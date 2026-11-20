import { locations } from "@/lib/locations";
import { displayTime, type Booking } from "./model";

export type Channel = "email" | "sms";
export const presets = {
  office: {
    title: "Нова заявка в кабинета", trigger: "При получаване на заявка", audience: "Избраният кабинет",
    channel: "email", subject: "Нова заявка за час в {{кабинет}}",
    body: "{{име}} подаде заявка за час в кабинета в {{кабинет}}. Телефон за връзка {{телефон}}. Подробностите са в админ панела на Smile Craft.",
  },
  receipt: {
    title: "Получена заявка", trigger: "При получаване на заявка", audience: "Пациентът, ако е посочил имейл",
    channel: "email", subject: "Получихме заявката ви за Smile Craft",
    body: "Здравейте, {{име}}!\n\nПолучихме заявката ви за кабинета в {{кабинет}}. Ще се свържем с вас, за да уточним свободен час.\n\nЕкипът на Smile Craft",
  },
  confirmation: {
    title: "Потвърден час", trigger: "При потвърждение или пренасрочване", audience: "Пациентът",
    channel: "sms", subject: "",
    body: "Smile Craft: Очакваме ви на {{час}} в {{кабинет}}, {{адрес}}. За промяна се обадете на {{кабинетен_телефон}}.",
  },
  reminder: {
    title: "Напомняне за посещение", trigger: "Преди потвърдения час", audience: "Пациентът, ако е посочил имейл",
    channel: "email", subject: "Напомняне за вашия час в Smile Craft",
    body: "Здравейте, {{име}}!\n\nОчакваме ви на {{час}} в кабинета в {{кабинет}}, {{адрес}}. При нужда от промяна можете да се свържете с нас на {{кабинетен_телефон}}.\n\nЕкипът на Smile Craft",
  },
} as const;

export type Kind = keyof typeof presets;
export type Automation = { kind: Kind; enabled: number; subject: string; body: string; lead_hours: number };
export const baseTokens = ["име", "кабинет", "адрес", "кабинетен_телефон", "телефон"];
export function tokensFor(kind: Kind) {
  return kind === "confirmation" || kind === "reminder" ? [...baseTokens, "час"] : baseTokens;
}

export function renderMessage(rule: Automation, booking: Booking) {
  const office = locations[booking.location];
  const tokens: Record<string, string> = {
    име: booking.name, телефон: booking.phone, кабинет: office.nameBg, адрес: office.address,
    кабинетен_телефон: office.phone, час: booking.appointment_at ? displayTime(booking.appointment_at) : "",
  };
  const render = (text: string) => text.replace(/\{\{([^{}]+)\}\}/g, (_, key: string) => tokens[key] ?? "");
  return { subject: render(rule.subject), body: render(rule.body) };
}

export const notificationLabels = {
  queued: "Чака изпращане", pending: "Прието от worker-а", processing: "Обработва се",
  sent: "Изпратено", error: "За повторен опит", failed: "Неуспешно", canceled: "Отменено",
};
export type NoticeStatus = keyof typeof notificationLabels;
export type Notice = {
  id: string; booking_id: string; kind: Kind; channel: Channel; recipient: string; subject: string; body: string;
  send_at: string | null; expires_at: string | null; created_at: string; status: NoticeStatus;
  worker_id: string | null; error: string; obsolete: number; attempt: number; tries: number;
};
