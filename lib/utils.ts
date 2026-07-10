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
    "Бутикова дентална практика с ателиета в Пловдив, Рудозем и Девин. Прецизност, поднесена като изкуство.",
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
