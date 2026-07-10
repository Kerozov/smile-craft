import type { LocationSlug, ResultCategory } from "./utils";

export interface ResultItem {
  id: string;
  beforeImage: string;
  afterImage: string;
  label: string;
  altBefore: string;
  altAfter: string;
  category: ResultCategory;
  location?: LocationSlug;
}

export const results: ResultItem[] = [
  {
    id: "1",
    // TODO: replace with real photo
    beforeImage: "/results/1-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/1-after.jpg",
    label: "Естетична реставрация",
    altBefore: "Преди естетична реставрация — пациент на Smile Craft Пловдив",
    altAfter: "След естетична реставрация — пациент на Smile Craft Пловдив",
    category: "aesthetic",
    location: "plovdiv",
  },
  {
    id: "2",
    // TODO: replace with real photo
    beforeImage: "/results/2-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/2-after.jpg",
    label: "Избелване на зъби",
    altBefore: "Преди избелване на зъби — пациент на Smile Craft",
    altAfter: "След избелване на зъби — пациент на Smile Craft",
    category: "whitening",
    location: "plovdiv",
  },
  {
    id: "3",
    // TODO: replace with real photo
    beforeImage: "/results/3-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/3-after.jpg",
    label: "Дентален имплант",
    altBefore: "Преди дентален имплант — пациент на Smile Craft Рудозем",
    altAfter: "След дентален имплант — пациент на Smile Craft Рудозем",
    category: "implants",
    location: "rudozem",
  },
  {
    id: "4",
    // TODO: replace with real photo
    beforeImage: "/results/4-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/4-after.jpg",
    label: "Ортодонтско лечение",
    altBefore: "Преди ортодонтско лечение — пациент на Smile Craft Девин",
    altAfter: "След ортодонтско лечение — пациент на Smile Craft Девин",
    category: "orthodontics",
    location: "devin",
  },
  {
    id: "5",
    // TODO: replace with real photo
    beforeImage: "/results/5-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/5-after.jpg",
    label: "Фасети",
    altBefore: "Преди фасети — пациент на Smile Craft Пловдив",
    altAfter: "След фасети — пациент на Smile Craft Пловдив",
    category: "aesthetic",
    location: "plovdiv",
  },
  {
    id: "6",
    // TODO: replace with real photo
    beforeImage: "/results/6-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/6-after.jpg",
    label: "Професионално избелване",
    altBefore: "Преди професионално избелване — пациент на Smile Craft Рудозем",
    altAfter: "След професионално избелване — пациент на Smile Craft Рудозем",
    category: "whitening",
    location: "rudozem",
  },
  {
    id: "7",
    // TODO: replace with real photo
    beforeImage: "/results/7-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/7-after.jpg",
    label: "Имплант и корона",
    altBefore: "Преди имплант и корона — пациент на Smile Craft Пловдив",
    altAfter: "След имплант и корона — пациент на Smile Craft Пловдив",
    category: "implants",
    location: "plovdiv",
  },
  {
    id: "8",
    // TODO: replace with real photo
    beforeImage: "/results/8-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/8-after.jpg",
    label: "Естетичен бондинг",
    altBefore: "Преди естетичен бондинг — пациент на Smile Craft Девин",
    altAfter: "След естетичен бондинг — пациент на Smile Craft Девин",
    category: "aesthetic",
    location: "devin",
  },
  {
    id: "9",
    // TODO: replace with real photo
    beforeImage: "/results/9-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/9-after.jpg",
    label: "Алайнери",
    altBefore: "Преди лечение с алайнери — пациент на Smile Craft Пловдив",
    altAfter: "След лечение с алайнери — пациент на Smile Craft Пловдив",
    category: "orthodontics",
    location: "plovdiv",
  },
  {
    id: "10",
    // TODO: replace with real photo
    beforeImage: "/results/10-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/10-after.jpg",
    label: "Избелване — комбинирано",
    altBefore: "Преди комбинирано избелване — пациент на Smile Craft Девин",
    altAfter: "След комбинирано избелване — пациент на Smile Craft Девин",
    category: "whitening",
    location: "devin",
  },
  {
    id: "11",
    // TODO: replace with real photo
    beforeImage: "/results/11-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/11-after.jpg",
    label: "Пълна естетична трансформация",
    altBefore: "Преди пълна естетична трансформация — Smile Craft",
    altAfter: "След пълна естетична трансформация — Smile Craft",
    category: "aesthetic",
    location: "rudozem",
  },
  {
    id: "12",
    // TODO: replace with real photo
    beforeImage: "/results/12-before.jpg",
    // TODO: replace with real photo
    afterImage: "/results/12-after.jpg",
    label: "Имплантология",
    altBefore: "Преди имплантология — пациент на Smile Craft Рудозем",
    altAfter: "След имплантология — пациент на Smile Craft Рудозем",
    category: "implants",
    location: "rudozem",
  },
];

export function getResultsByLocation(location: LocationSlug): ResultItem[] {
  return results.filter((r) => r.location === location);
}

export const testimonials = [
  {
    id: "1",
    quote:
      "Д-р Овардова превърна моя страх от зъболекаря в доверие. Резултатът надмина очакванията ми.",
    author: "Мария К.",
    location: "Пловдив",
  },
  {
    id: "2",
    quote:
      "Професионализъм и топлина на едно място. Най-накрая се усмихвам без притеснение.",
    author: "Иван П.",
    location: "Рудозем",
  },
  {
    id: "3",
    quote:
      "Имплантът изглежда и се усеща като истински зъб. Благодаря на целия екип!",
    author: "Елена Д.",
    location: "Девин",
  },
  {
    id: "4",
    quote:
      "Детето ми обожава посещенията. Нежен подход и перфектна организация всеки път.",
    author: "Светла М.",
    location: "Пловдив",
  },
  {
    id: "5",
    quote:
      "Избелването беше бързо, безболезнено и с невероятен резултат. Препоръчвам!",
    author: "Георги Т.",
    location: "Пловдив",
  },
];
