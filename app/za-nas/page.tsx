import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import DoctorPortrait from "@/components/DoctorPortrait";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "За нас",
  description:
    "Запознайте се с Д-р Ани Овардова и екипа на Smile Craft — дентална практика с три кабинета в Пловдив, Рудозем и Девин.",
  openGraph: {
    title: "За нас | Smile Craft",
    description: "Запознайте се с Д-р Ани Овардова и екипа на Smile Craft.",
    url: `${siteConfig.url}/za-nas`,
  },
  twitter: {
    card: "summary_large_image",
    title: "За нас | Smile Craft",
    description: "Запознайте се с Д-р Ани Овардова и екипа на Smile Craft.",
  },
};

const values = [
  { title: "Без бързане", text: "Време да ви изслушаме и да обясним всяка стъпка." },
  { title: "Без компромис", text: "Внимателна работа и прозрачна комуникация." },
  { title: "Постоянно обучение", text: "Съвременни методи, които прилагаме за вашия случай." },
];

export default function ZaNasPage() {
  return (
    <>
      <PageHero
        eyebrow={`От ${siteConfig.established} г.`}
        title="Грижа, на която"
        accent="можете да се доверите"
        lead={`Дентална практика, основана от ${siteConfig.doctor}, с кабинети в Пловдив, Рудозем и Девин.`}
      />

      <section className="px-5 pb-24 sm:px-8 md:pb-32 lg:px-12">
        <div className="container-wide grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <ScrollReveal>
            <DoctorPortrait priority />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="eyebrow-label">Нашият подход</p>
            <h2 className="heading-lg mt-6">{siteConfig.doctor}</h2>
            <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-ink-soft md:text-lg">
              <p>
                Smile Craft се създава с ясна цел: пациентите да получават грижа, на
                която могат да се доверят. Д-р Ани Овардова прекарва време не само в
                клиниката, но и в обучение по съвременни методи — за да предложи на
                всеки пациент решение, съобразено с неговите нужди.
              </p>
              <p>
                Всеки кабинет е проектиран като пространство за спокойствие и
                доверие. Без бързане, без компромис — внимателна работа, прозрачна
                комуникация и резултати, които говорят сами за себе си.
              </p>
              <p>
                Нашият екип споделя страстта към качествената грижа и постоянно
                развива уменията си, за да предложи лечение на високо ниво в три
                български града.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-ivory to-cream">
        <div className="container-wide grid gap-5 md:grid-cols-3">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.1}>
              <div className="card-premium h-full p-8">
                <span className="text-gold-gradient font-display text-5xl italic">0{i + 1}</span>
                <h3 className="mt-10 font-display text-2xl text-ink">{v.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{v.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="bg-cream">
        <CtaBand title="Готови да" accent="започнем?" text="Запишете първия си преглед и открийте разликата на Smile Craft." />
      </div>
    </>
  );
}
