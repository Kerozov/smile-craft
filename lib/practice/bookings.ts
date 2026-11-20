import "server-only";
import { createHash } from "node:crypto";
import type { Transaction } from "@libsql/client";
import { locations } from "@/lib/locations";
import { presets, renderMessage, tokensFor, type Kind, type Automation } from "./automations";
import { field, FormError, type Booking, type BookingInput } from "./model";
import { database, rows, write } from "./db";

export async function withinLimit(tx: Transaction, key: string, max: number, windowMs: number) {
  const now = Date.now();
  const hash = createHash("sha256").update(key).digest("hex");
  await tx.execute({ sql: "DELETE FROM rate_limits WHERE reset_at <= ?", args: [now] });
  const result = await tx.execute({
    sql: `INSERT INTO rate_limits(key, count, reset_at) VALUES(?, 1, ?)
          ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < ? RETURNING count`,
    args: [hash, now + windowMs, max],
  });
  return result.rows.length === 1;
}

async function enqueue(tx: Transaction, booking: Booking, kinds: Kind[]) {
  const rules = await rows<Automation>("SELECT * FROM automations WHERE enabled = 1", tx);
  for (const rule of rules) {
    if (!kinds.includes(rule.kind)) continue;
    const { channel } = presets[rule.kind];
    const recipient = rule.kind === "office" ? locations[booking.location].email
      : channel === "sms" ? booking.phone : booking.email;
    if (!recipient) continue;
    let sendAt: string | null = null;
    if (rule.kind === "reminder" && booking.appointment_at) {
      const due = Date.parse(booking.appointment_at) - rule.lead_hours * 3_600_000;
      if (due <= Date.now()) continue;
      sendAt = new Date(due).toISOString();
    }
    const content = renderMessage(rule, booking);
    await tx.execute({
      sql: `INSERT INTO notifications(id, booking_id, kind, channel, recipient, subject, body, created_at, send_at, expires_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [`${booking.id}:${booking.revision}:${rule.kind}`, booking.id, rule.kind, channel, recipient,
        content.subject, content.body, new Date().toISOString(), sendAt, booking.appointment_at],
    });
  }
}

export async function createBooking(id: string, input: BookingInput, clientIp: string) {
  return write(async tx => {
    const [existing] = await rows<Booking>({ sql: "SELECT * FROM bookings WHERE id = ?", args: [id] }, tx);
    if (existing) {
      if (Object.entries(input).some(([k, v]) => existing[k as keyof BookingInput] !== v)) {
        throw new FormError("Данните са променени след изпращане. Отворете нова заявка.");
      }
      return;
    }
    const hour = 3_600_000;
    if (!await withinLimit(tx, "booking-ip:" + clientIp, 15, hour) ||
        !await withinLimit(tx, "booking-phone:" + input.phone, 4, hour) ||
        (input.email && !await withinLimit(tx, "booking-email:" + input.email, 4, hour))) {
      throw new FormError("Получихме няколко заявки за кратко време. Опитайте по-късно или се обадете в кабинета.");
    }
    const [booking] = await rows<Booking>({
      sql: `INSERT INTO bookings(id, created_at, name, phone, email, location, service, date, message)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
      args: [id, new Date().toISOString(), input.name, input.phone, input.email, input.location, input.service, input.date, input.message],
    }, tx);
    await enqueue(tx, booking, ["office", "receipt"]);
  });
}

export async function changeBooking(id: string, revision: number, appointment: string | null) {
  return write(async tx => {
    const [old] = await rows<Booking>({ sql: "SELECT * FROM bookings WHERE id = ?", args: [id] }, tx);
    if (!old || old.revision !== revision) throw new FormError("Заявката е променена. Обновете страницата.");
    if (old.status === "canceled") throw new FormError("Заявката вече е отказана.");
    if (appointment && old.appointment_at === appointment) return;
    const [booking] = await rows<Booking>({
      sql: "UPDATE bookings SET status = ?, appointment_at = ?, revision = revision + 1 WHERE id = ? RETURNING *",
      args: [appointment ? "confirmed" : "canceled", appointment, id],
    }, tx);
    await tx.execute({
      sql: `UPDATE notifications SET obsolete = 1 WHERE booking_id = ? AND kind IN ('confirmation','reminder')
            AND status NOT IN ('sent','canceled','failed')`,
      args: [id],
    });
    if (appointment) await enqueue(tx, booking, ["confirmation", "reminder"]);
  });
}

export async function saveRule(data: FormData) {
  const kind = field(data, "kind", 30) as Kind;
  if (!Object.hasOwn(presets, kind)) throw new FormError("Непозната автоматизация.");
  const subject = field(data, "subject", 200);
  const body = field(data, "body", presets[kind].channel === "sms" ? 480 : 4000);
  if (!body || (presets[kind].channel === "email" && !subject) || /[\r\n]/.test(subject)) {
    throw new FormError("Попълнете текста и темата на имейла.");
  }
  const allowed = new Set(tokensFor(kind));
  const plain = (subject + body).replace(/\{\{([^{}]+)\}\}/g, (match, key) => allowed.has(key) ? "" : match);
  if (plain.includes("{{") || plain.includes("}}")) throw new FormError("Използвайте показаните полета в шаблона.");
  const lead = kind === "reminder" ? Number(field(data, "lead_hours", 3)) : 24;
  if (!Number.isInteger(lead) || lead < 1 || lead > 168) throw new FormError("Изберете между 1 и 168 часа.");
  await (await database()).execute({
    sql: "UPDATE automations SET enabled = ?, subject = ?, body = ?, lead_hours = ? WHERE kind = ?",
    args: [data.get("enabled") === "on" ? 1 : 0, subject, body, lead, kind],
  });
}
