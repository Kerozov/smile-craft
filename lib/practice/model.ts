import { locationList } from "@/lib/locations";
import { services } from "@/lib/services";
import type { LocationSlug } from "@/lib/utils";

export const bookingStatuses = { new: "Нова", confirmed: "Потвърдена", canceled: "Отказана" };
export type BookingStatus = keyof typeof bookingStatuses;
export type BookingInput = {
  name: string; phone: string; email: string; location: LocationSlug;
  service: string; date: string; message: string;
};
export type Booking = BookingInput & {
  id: string; created_at: string; status: BookingStatus; appointment_at: string | null; revision: number;
};

export class FormError extends Error {}

const dateTime = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Sofia", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export function sofiaInput(date: Date) {
  return dateTime.format(date).replace(" ", "T");
}

export function displayTime(iso: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia", dateStyle: "short", timeStyle: "short",
  }).format(new Date(iso));
}

export function appointmentTime(value: string, now = Date.now()) {
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) throw new FormError("Въведете дата и час.");
  // Check both Sofia offsets by round-tripping. DST gaps and repeated times are ambiguous.
  const wallTime = Date.parse(value + ":00Z");
  const matches = [2, 3].map(offset => new Date(wallTime - offset * 3_600_000))
    .filter(date => Number.isFinite(date.getTime()) && sofiaInput(date) === value);
  if (matches.length !== 1) throw new FormError("Изберете валиден и еднозначен местен час за България.");
  if (matches[0].getTime() <= now) throw new FormError("Изберете бъдещ час.");
  return matches[0].toISOString();
}

export function field(data: FormData, key: string, max: number) {
  const raw = data.get(key);
  if (raw !== null && typeof raw !== "string") throw new FormError("Невалидно поле.");
  const value = (raw ?? "").trim();
  if (value.length > max) throw new FormError("Въведеният текст е прекалено дълъг.");
  return value;
}

export function readBooking(data: FormData): BookingInput {
  const name = field(data, "name", 100);
  if (name.length < 2 || /[\r\n]/.test(name)) throw new FormError("Въведете име за връзка.");
  let phone = field(data, "phone", 35).replace(/[\s().-]/g, "");
  if (phone.startsWith("00")) phone = "+" + phone.slice(2);
  else if (phone.startsWith("0")) phone = "+359" + phone.slice(1);
  else if (phone.startsWith("359")) phone = "+" + phone;
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new FormError("Въведете валиден телефон с код на държавата или български номер с 0.");
  const email = field(data, "email", 254).toLowerCase();
  if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email)) throw new FormError("Проверете имейл адреса.");
  const location = locationList.find(item => item.slug === data.get("location"));
  if (!location) throw new FormError("Изберете кабинет.");
  const service = field(data, "service", 40);
  if (service && !services.some(item => item.id === service)) throw new FormError("Изберете услуга от списъка.");
  const date = field(data, "date", 10);
  if (date && (!/^\d{4}-\d\d-\d\d$/.test(date) || !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date || date < sofiaInput(new Date()).slice(0, 10))) {
    throw new FormError("Изберете днешна или бъдеща дата.");
  }
  return { name, phone, email, location: location.slug, service, date, message: field(data, "message", 2000) };
}
