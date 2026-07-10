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
      "В сърцето на Пловдив, Smile Craft предлага пълноценно дентално ателие, където модерната технология среща занаятчийската прецизност. Д-р Овардова и екипът ѝ обслужват семейства и професионалисти от целия град — от профилактика до комплексни естетични трансформации, в спокойна и топла атмосфера.",
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
      "Ателието в Рудозем носи висококласната грижа на Smile Craft по-близо до жителите на Родопите. Тук всеки пациент получава индивидуално внимание без компромис — от детската стоматология до имплантология, с удобни работни часове, съобразени с ритъма на малкия град.",
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
      "В живописния Девин Smile Craft съчетава денталното изкуство с спокойствието на планината. Клиниката е проектирана за пациенти, които търсят дискретна, премиум грижа — идеална за местни жители и гости на курорта, нуждаещи се от естетични процедури и профилактика на световно ниво.",
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
