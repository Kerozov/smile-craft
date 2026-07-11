import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig, portraitPlaceholder } from "@/lib/utils";

export const metadata: Metadata = {
  title: "За нас",
  description:
    "Запознайте се с Д-р Ани Овардова и екипа на Smile Craft — дентална практика с три кабинета в Пловдив, Рудозем и Девин.",
  openGraph: {
    title: "За нас | Smile Craft",
    description:
      "Запознайте се с Д-р Ани Овардова и екипа на Smile Craft.",
    url: `${siteConfig.url}/za-nas`,
  },
  twitter: {
    card: "summary_large_image",
    title: "За нас | Smile Craft",
    description:
      "Запознайте се с Д-р Ани Овардова и екипа на Smile Craft.",
  },
};

export default function ZaNasPage() {
  return (
    <>
      <section className="section-padding bg-bg-cream">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <p className="eyebrow-label">От {siteConfig.established} г.</p>
            <h1 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              За Smile Craft
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-text-muted">
              Дентална практика, основана от {siteConfig.doctor}, с кабинети в
              Пловдив, Рудозем и Девин.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-white">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-beige-pale bg-beige-pale shadow-soft">
              <Image
                // TODO: replace with real photo
                src={portraitPlaceholder}
                alt="Д-р Ани Овардова — основател и главен зъболекар на Smile Craft"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-2xl font-normal text-text-dark md:text-3xl">
              Нашият подход
            </h2>
            <div className="mt-6 space-y-4 font-body leading-relaxed text-text-muted">
              <p>
                Smile Craft се създава с ясна цел: пациентите да получават
                грижа, на която могат да се доверят. Д-р Ани Овардова
                прекарва време не само в клиниката, но и в обучение по
                съвременни методи — за да предложи на всеки пациент решение,
                съобразено с неговите нужди.
              </p>
              <p>
                Всеки кабинет е проектиран като пространство за спокойствие и
                доверие. Без бързане, без компромис — внимателна работа,
                прозрачна комуникация и резултати, които говорят сами за себе
                си.
              </p>
              <p>
                Нашият екип споделя страстта към качествената грижа и постоянно
                развива уменията си, за да предложи лечение на високо ниво в
                три български града.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-cream">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-normal text-text-dark md:text-3xl">
            Готови да започнем?
          </h2>
          <p className="mt-4 font-body text-text-muted">
            Запишете първия си преглед и открийте разликата на Smile Craft.
          </p>
          <Link href="/zapazi-chas" className="btn-primary mt-8">
            Запази час
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
