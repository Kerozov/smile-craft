import "server-only";
import { randomUUID } from "node:crypto";
import { database, rows } from "./db";
import type { Notice } from "./automations";
import { configMessage, inspectNotice, stopNotice, submitNotice, workerConfigured } from "./worker";

const unfinished = "status IN ('queued','error') OR (obsolete = 1 AND status IN ('pending','processing'))";
type Mode = "dispatch" | "retry" | "refresh";

export async function processNotice(id: string, mode: Mode = "dispatch"): Promise<void> {
  const db = await database();
  const lease = randomUUID();
  const allowed = mode === "refresh" ? "status IN ('pending','processing')" :
    mode === "retry" ? `(${unfinished}) OR status = 'failed'` : unfinished;
  const [n] = await rows<Notice>({
    sql: `UPDATE notifications SET lease = ?, lease_until = ? WHERE id = ? AND lease_until <= ? AND (${allowed})
          AND (kind != 'reminder' OR obsolete = 1 OR NOT EXISTS (
            SELECT 1 FROM notifications old WHERE old.booking_id = notifications.booking_id AND old.kind = 'reminder'
            AND old.obsolete = 1 AND old.status NOT IN ('sent','failed','canceled'))) RETURNING *`,
    args: [lease, Date.now() + 30_000, id, Date.now()],
  });
  if (!n) return;

  const expired = n.expires_at !== null && Date.parse(n.expires_at) <= Date.now();
  const stopping = Boolean(n.obsolete || expired);
  let result: Awaited<ReturnType<typeof submitNotice>>;
  try {
    if (stopping && !n.worker_id && !n.tries) {
      result = { status: "canceled" };
    } else if (!workerConfigured()) {
      result = mode === "refresh" && !stopping ? { status: n.status, error: configMessage } : { status: "error", error: configMessage };
    } else if (stopping) {
      result = await stopNotice(n);
    } else if (mode === "refresh") {
      result = await inspectNotice(n);
    } else {
      // Only an explicitly retried, definitively failed worker job gets a new idempotency key.
      if (n.status === "failed") { n.attempt += 1; n.worker_id = null; }
      await db.execute({
        sql: "UPDATE notifications SET status = 'queued', attempt = ?, worker_id = ?, tries = tries + 1 WHERE id = ? AND lease = ?",
        args: [n.attempt, n.worker_id, id, lease],
      });
      result = await submitNotice(n);
    }
  } catch {
    result = { status: mode === "refresh" && !stopping ? n.status : "error", error: "Връзката с worker-а прекъсна. Опитайте отново." };
  }

  const [saved] = await rows<{ obsolete: number }>({
    sql: `UPDATE notifications SET status = ?, error = ?, worker_id = coalesce(?, worker_id),
          lease = NULL, lease_until = 0 WHERE id = ? AND lease = ? RETURNING obsolete`,
    args: [result.status, result.error ?? "", result.id ?? null, id, lease],
  });
  if (saved?.obsolete && !stopping && (result.status === "pending" || result.status === "processing" || result.status === "error")) {
    await processNotice(id);
  }
}

export async function dispatchQueue(bookingId?: string) {
  const items = await rows<{ id: string; obsolete: number }>({
    sql: `SELECT id, obsolete FROM notifications WHERE (${unfinished}) AND lease_until <= ?
          ${bookingId ? "AND booking_id = ?" : ""} ORDER BY obsolete DESC, created_at LIMIT 24`,
    args: bookingId ? [Date.now(), bookingId] : [Date.now()],
  });
  // Retire the old reminder before registering the replacement. Bound worker concurrency.
  for (const obsolete of [1, 0]) {
    const group = items.filter(item => item.obsolete === obsolete);
    for (let i = 0; i < group.length; i += 4) await Promise.all(group.slice(i, i + 4).map(item => processNotice(item.id)));
  }
}
