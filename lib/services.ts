export type ServiceIconName =
  | "shield"
  | "sparkles"
  | "crown"
  | "align-center"
  | "sun"
  | "baby";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIconName;
}

export const services: Service[] = [
  {
    id: "orthodontics",
    title: "Ортодонтско лечение",
    description:
      "Водещ фокус на практиката — изправяне с модерни брекети и прозрачни алайнери, според вашия случай.",
    icon: "align-center",
  },
  {
    id: "prophylaxis",
    title: "Профилактика и хигиена",
    description:
      "Редовни прегледи, професионално почистване и персонализирани съвети за домашна грижа — основата на здравата усмивка.",
    icon: "shield",
  },
  {
    id: "aesthetic",
    title: "Естетична стоматология",
    description:
      "Фасети, бондинг и реставрации, създадени с артистична точност за естествен и хармоничен резултат.",
    icon: "sparkles",
  },
  {
    id: "implants",
    title: "Дентални импланти",
    description:
      "Трайни решения за липсващи зъби с премиум имплантни системи и 3D планиране за перфектна интеграция.",
    icon: "crown",
  },
  {
    id: "whitening",
    title: "Избелване на зъби",
    description:
      "Професионално избелване в клиниката и домашни системи за сияйна, но естествено изглеждаща усмивка.",
    icon: "sun",
  },
  {
    id: "pediatric",
    title: "Детска стоматология",
    description:
      "Нежна грижа за най-малките пациенти — от първия преглед до формиране на навици за живот.",
    icon: "baby",
  },
];
