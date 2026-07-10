import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "За нас",
  description:
    "Запознайте се с Д-р Ани Овардова и философията на Smile Craft — бутикова дентална практика, където прецизността е изкуство.",
  openGraph: {
    title: "За нас | Smile Craft",
    description:
      "Запознайте се с Д-р Ани Овардова и философията на Smile Craft.",
    url: `${siteConfig.url}/za-nas`,
  },
  twitter: {
    card: "summary_large_image",
    title: "За нас | Smile Craft",
    description:
      "Запознайте се с Д-р Ани Овардова и философията на Smile Craft.",
  },
};

export default function ZaNasPage() {
  return (
    <>
      <section className="section-padding bg-bg-dark pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              ЕСТ. {siteConfig.established}
            </p>
            <h1 className="mt-4 font-display text-3xl font-semibold text-text-light md:text-5xl">
              За Smile Craft
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-text-light/75">
              Бутикова дентална практика, основана от {siteConfig.doctor}, с
              ателиета в Пловдив, Рудозем и Девин.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-light">
        <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                // TODO: replace with real photo
                src="/dr-ovardova.jpg"
                alt="Д-р Ани Овардова — основател и главен зъболекар на Smile Craft"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="font-display text-2xl font-semibold text-text-dark md:text-3xl">
              Философия на занаята
            </h2>
            <div className="mt-6 space-y-4 font-body leading-relaxed text-text-dark/80">
              <p>
                Smile Craft се ражда от убеждението, че стоматологията може да
                бъде едновременно научна дисциплина и изкуство. Д-р Ани
                Овардова прекарва време не само в клиниката, но и в
                проучването на най-новите техники — за да предложи на всеки
                пациент решение, което е едновременно функционално и
                естетически безупречно.
              </p>
              <p>
                Всяко ателие е проектирано като пространство за спокойствие и
                доверие. Без бързане, без компромис — само внимателна работа,
                прозрачна комуникация и резултати, които говорят сами за себе
                си.
              </p>
              <p>
                Нашият екип споделя страстта към детайла и постоянно
                развива уменията си, за да предложи грижа от световна
                класа в три български града.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-dark">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-text-light md:text-3xl">
            Готови да започнем?
          </h2>
          <p className="mt-4 font-body text-text-light/70">
            Запишете първия си преглед и открийте разликата на Smile Craft.
          </p>
          <Link
            href="/zapazi-chas"
            className="mt-8 inline-block rounded-sm bg-accent-gold px-8 py-4 font-body text-sm font-medium text-bg-dark transition-colors hover:bg-accent-gold/90"
          >
            Запази час
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
