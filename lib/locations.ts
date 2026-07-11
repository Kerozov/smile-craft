import type { LocationSlug } from "./utils";

export interface Location {
  slug: LocationSlug;
  name: string;
  nameBg: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  hours: string[];
  mapEmbedUrl: string;
  intro: string;
  services: string[];
}

export const locations: Record<LocationSlug, Location> = {
  plovdiv: {
    slug: "plovdiv",
    name: "Plovdiv",
    nameBg: "Пловдив",
    address: 'ул. „Gladstone" № 45',
    postalCode: "4000",
    city: "Пловдив",
    phone: "+359 32 123 456",
    email: "plovdiv@smilecraft.bg",
    hours: [
      "Пон–Пет: 09:00 – 19:00",
      "Събота: 10:00 – 14:00",
      "Неделя: почивен ден",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Plovdiv%2C%20Bulgaria&output=embed",
    intro:
      "В сърцето на Пловдив, нашият кабинет на Smile Craft предлага пълен спектър от дентални услуги с модерно оборудване и спокойна атмосфера. Д-р Овардова и екипът ѝ обслужват семейства и професионалисти от целия град — от профилактика до комплексни естетични възстановявания.",
    services: [
      "Профилактика и хигиена",
      "Естетична стоматология",
      "Дентални импланти",
      "Ортодонтско лечение",
      "Избелване на зъби",
      "Детска стоматология",
    ],
  },
  rudozem: {
    slug: "rudozem",
    name: "Rudozem",
    nameBg: "Рудозем",
    address: 'ул. „Христо Ботев" 12',
    postalCode: "4960",
    city: "Рудозем",
    phone: "+359 3051 2345",
    email: "rudozem@smilecraft.bg",
    hours: [
      "Пон–Чет: 09:00 – 18:00",
      "Пет: 09:00 – 16:00",
      "Събота–Неделя: почивни дни",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Rudozem%2C%20Bulgaria&output=embed",
    intro:
      "Кабинетът ни в Рудозем носи висококласната грижа на Smile Craft по-близо до жителите на Родопите. Тук всеки пациент получава индивидуално внимание — от детската стоматология до имплантология, с удобни работни часове, съобразени с ритъма на малкия град.",
    services: [
      "Профилактика и хигиена",
      "Естетична стоматология",
      "Дентални импланти",
      "Избелване на зъби",
      "Детска стоматология",
    ],
  },
  devin: {
    slug: "devin",
    name: "Devin",
    nameBg: "Девин",
    address: 'бул. „България" 8',
    postalCode: "4800",
    city: "Девин",
    phone: "+359 3041 5678",
    email: "devin@smilecraft.bg",
    hours: [
      "Вт–Пет: 10:00 – 18:00",
      "Събота: 10:00 – 13:00",
      "Пон–Нед (почивен): понеделник",
    ],
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Devin%2C%20Bulgaria&output=embed",
    intro:
      "В живописния Девин Smile Craft предлага спокойна и дискретна дентална грижа сред планината. Клиниката е удобна за местни жители и гости на курорта, нуждаещи се от естетични процедури и профилактика на високо ниво.",
    services: [
      "Профилактика и хигиена",
      "Естетична стоматология",
      "Избелване на зъби",
      "Ортодонтско лечение",
      "Детска стоматология",
    ],
  },
};

export const locationList = Object.values(locations);

export function getLocationBySlug(slug: string): Location | undefined {
  return locations[slug as LocationSlug];
}
