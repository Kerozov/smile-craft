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

/**
 * Снимка на д-р Овардова. Сложете файла в /public (напр. "/dr-ovardova.jpg")
 * и попълнете пътя тук — дотогава се показва елегантен монограм.
 */
export const doctorPhoto: string | null = null;
