import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import ResultsGallery from "@/components/ResultsGallery";
import { results } from "@/lib/results";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Резултати",
  description:
    "Разгледайте преди/след резултати от Smile Craft — импланти, избелване, ортодонтия и естетична стоматология в Пловдив, Рудозем и Девин.",
  openGraph: {
    title: "Резултати | Smile Craft",
    description:
      "Преди/след резултати от Smile Craft — импланти, избелване, ортодонтия и естетика.",
    url: `${siteConfig.url}/rezultati`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Резултати | Smile Craft",
    description: "Преди/след резултати от Smile Craft.",
  },
};

export default function RezultatiPage() {
  return (
    <>
      <PageHero
        eyebrow="Портфолио"
        title="Резултати,"
        accent="не обещания"
        lead="Плъзнете разделителя, за да сравните преди и след. Всяка трансформация е резултат от индивидуален план и внимателно лечение."
      />

      <section className="px-5 pb-24 sm:px-8 md:pb-32 lg:px-12">
        <div className="container-wide">
          <ResultsGallery items={results} showFilters />
        </div>
      </section>

      <CtaBand title="Вашата усмивка е" accent="следващата" />
    </>
  );
}
