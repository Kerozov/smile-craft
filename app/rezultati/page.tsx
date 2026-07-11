import type { Metadata } from "next";
import ResultsGallery from "@/components/ResultsGallery";
import ScrollReveal from "@/components/ScrollReveal";
import { results } from "@/lib/results";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Резултати",
  description:
    "Разгледайте реални преди/след резултати от Smile Craft — импланти, избелване, ортодонтия и естетична стоматология в Пловдив, Рудозем и Девин.",
  openGraph: {
    title: "Резултати | Smile Craft",
    description:
      "Реални преди/след резултати от Smile Craft — импланти, избелване, ортодонтия и естетика.",
    url: `${siteConfig.url}/rezultati`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Резултати | Smile Craft",
    description: "Реални преди/след резултати от Smile Craft.",
  },
};

export default function RezultatiPage() {
  return (
    <>
      <section className="section-padding bg-bg-cream">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="eyebrow-label">Портфолио</p>
            <h1 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Резултати, не обещания
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-text-muted">
              Плъзнете разделителя, за да сравните преди и след. Всяка
              трансформация е резултат от индивидуален план и внимателно
              лечение.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-white">
        <div className="mx-auto max-w-7xl">
          <ResultsGallery items={results} showFilters />
        </div>
      </section>
    </>
  );
}
