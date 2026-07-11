import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const siteConfig = {
  name: "Smile Craft",
  doctor: "Д-р Ани Овардова",
  url: "https://smilecraft.bg",
  email: "info@smilecraft.bg",
  phone: "+359 888 123 456",
  established: "2015",
  description:
    "Д-р Ани Овардова — зъболекар в Пловдив, Рудозем и Девин. Съвременно лечение, внимателен подход, три удобни локации. Запазете час онлайн.",
};

export type LocationSlug = "plovdiv" | "rudozem" | "devin";

export type ResultCategory =
  | "implants"
  | "whitening"
  | "orthodontics"
  | "aesthetic";

export const categoryLabels: Record<ResultCategory, string> = {
  implants: "Импланти",
  whitening: "Избелване",
  orthodontics: "Ортодонтия",
  aesthetic: "Естетична стоматология",
};

/** Placeholder images — TODO: replace with real photos */
export function placeholderBefore(id: string) {
  return `https://placehold.co/600x450/F7F4EF/9A7B55/png?text=Преди+${id}`;
}

export function placeholderAfter(id: string) {
  return `https://placehold.co/600x450/EDE8E0/B8956A/png?text=След+${id}`;
}

export const portraitPlaceholder =
  "https://placehold.co/600x750/F7F4EF/B8956A/png?text=Д-р+Овардова";
