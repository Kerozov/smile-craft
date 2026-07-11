import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import ScrollReveal from "@/components/ScrollReveal";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Пълен спектър от дентални услуги в Smile Craft — профилактика, естетика, импланти, ортодонтия, избелване и детска стоматология в Пловдив, Рудозем и Девин.",
  openGraph: {
    title: "Услуги | Smile Craft",
    description:
      "Пълен спектър от дентални услуги в Smile Craft — профилактика, естетика, импланти и повече.",
    url: `${siteConfig.url}/uslugi`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Услуги | Smile Craft",
    description: "Пълен спектър от дентални услуги в Smile Craft.",
  },
};

export default function UslugiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Начало", href: "/" },
          { name: "Услуги", href: "/uslugi" },
        ]}
      />

      <section className="section-padding bg-bg-cream">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="eyebrow-label">Услуги</p>
            <h1 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Нашите услуги
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-text-muted">
              Всяка услуга е изпълнена с внимание и индивидуален подход.
              Изберете процедура и запишете час в кабинета, най-удобен за вас.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-16 text-center">
            <Link href="/zapazi-chas" className="btn-primary">
              Запази час
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
