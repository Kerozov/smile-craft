import type { LocationSlug, ResultCategory } from "./utils";
import { placeholderAfter, placeholderBefore } from "./utils";

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
    beforeImage: placeholderBefore("1"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("1"),
    label: "Естетична реставрация",
    altBefore: "Преди естетична реставрация — пациент на Smile Craft Пловдив",
    altAfter: "След естетична реставрация — пациент на Smile Craft Пловдив",
    category: "aesthetic",
    location: "plovdiv",
  },
  {
    id: "2",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("2"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("2"),
    label: "Избелване на зъби",
    altBefore: "Преди избелване на зъби — пациент на Smile Craft",
    altAfter: "След избелване на зъби — пациент на Smile Craft",
    category: "whitening",
    location: "plovdiv",
  },
  {
    id: "3",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("3"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("3"),
    label: "Дентален имплант",
    altBefore: "Преди дентален имплант — пациент на Smile Craft Рудозем",
    altAfter: "След дентален имплант — пациент на Smile Craft Рудозем",
    category: "implants",
    location: "rudozem",
  },
  {
    id: "4",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("4"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("4"),
    label: "Ортодонтско лечение",
    altBefore: "Преди ортодонтско лечение — пациент на Smile Craft Девин",
    altAfter: "След ортодонтско лечение — пациент на Smile Craft Девин",
    category: "orthodontics",
    location: "devin",
  },
  {
    id: "5",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("5"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("5"),
    label: "Фасети",
    altBefore: "Преди фасети — пациент на Smile Craft Пловдив",
    altAfter: "След фасети — пациент на Smile Craft Пловдив",
    category: "aesthetic",
    location: "plovdiv",
  },
  {
    id: "6",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("6"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("6"),
    label: "Професионално избелване",
    altBefore: "Преди професионално избелване — пациент на Smile Craft Рудозем",
    altAfter: "След професионално избелване — пациент на Smile Craft Рудозем",
    category: "whitening",
    location: "rudozem",
  },
  {
    id: "7",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("7"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("7"),
    label: "Имплант и корона",
    altBefore: "Преди имплант и корона — пациент на Smile Craft Пловдив",
    altAfter: "След имплант и корона — пациент на Smile Craft Пловдив",
    category: "implants",
    location: "plovdiv",
  },
  {
    id: "8",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("8"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("8"),
    label: "Естетичен бондинг",
    altBefore: "Преди естетичен бондинг — пациент на Smile Craft Девин",
    altAfter: "След естетичен бондинг — пациент на Smile Craft Девин",
    category: "aesthetic",
    location: "devin",
  },
  {
    id: "9",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("9"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("9"),
    label: "Алайнери",
    altBefore: "Преди лечение с алайнери — пациент на Smile Craft Пловдив",
    altAfter: "След лечение с алайнери — пациент на Smile Craft Пловдив",
    category: "orthodontics",
    location: "plovdiv",
  },
  {
    id: "10",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("10"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("10"),
    label: "Избелване — комбинирано",
    altBefore: "Преди комбинирано избелване — пациент на Smile Craft Девин",
    altAfter: "След комбинирано избелване — пациент на Smile Craft Девин",
    category: "whitening",
    location: "devin",
  },
  {
    id: "11",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("11"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("11"),
    label: "Пълна естетична трансформация",
    altBefore: "Преди пълна естетична трансформация — Smile Craft",
    altAfter: "След пълна естетична трансформация — Smile Craft",
    category: "aesthetic",
    location: "rudozem",
  },
  {
    id: "12",
    // TODO: replace with real photo
    beforeImage: placeholderBefore("12"),
    // TODO: replace with real photo
    afterImage: placeholderAfter("12"),
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
