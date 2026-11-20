import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
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

const steps = [
  { n: "01", title: "Консултация", text: "Изслушваме ви и оглеждаме внимателно — без бързане." },
  { n: "02", title: "План", text: "Получавате ясен план на лечението, срокове и възможности." },
  { n: "03", title: "Лечение", text: "Работим по протокол, с модерно оборудване и спокойствие." },
  { n: "04", title: "Грижа след това", text: "Профилактика и съвети, за да се запази резултатът." },
];

export default function UslugiPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Начало", href: "/" },
          { name: "Услуги", href: "/uslugi" },
        ]}
      />

      <PageHero
        eyebrow="Услуги"
        title="Грижа за усмивката —"
        accent="от А до Я"
        lead="Всяка услуга е изпълнена с внимание и индивидуален подход. Изберете процедура и запишете час в кабинета, най-удобен за вас."
      />

      <section className="px-5 pb-24 sm:px-8 md:pb-32 lg:px-12">
        <div className="container-wide grid auto-rows-[minmax(18rem,auto)] gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ScrollReveal
              key={service.id}
              delay={(i % 3) * 0.08}
              className={i === 0 ? "h-full md:col-span-2 lg:row-span-2" : "h-full"}
            >
              <ServiceCard service={service} index={i} featured={i === 0} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-ivory to-cream">
        <div className="container-wide">
          <ScrollReveal>
            <p className="eyebrow-label">Как работим</p>
            <h2 className="heading-lg mt-6 max-w-3xl">
              Четири стъпки до <span className="text-gold-gradient italic">спокойна усмивка</span>
            </h2>
          </ScrollReveal>
          <ol className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.08}>
                <li className="card-premium h-full p-7">
                  <span className="text-gold-gradient font-display text-5xl italic">{s.n}</span>
                  <h3 className="mt-8 font-display text-2xl text-ink">{s.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{s.text}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </section>

      <div className="bg-cream">
        <CtaBand />
      </div>
    </>
  );
}
