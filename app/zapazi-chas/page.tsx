import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Phone } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import ScrollReveal from "@/components/ScrollReveal";
import { locationList } from "@/lib/locations";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Запази час",
  description:
    "Запишете час онлайн в Smile Craft — изберете кабинет в Пловдив, Рудозем или Девин и нашият екип ще се свърже с вас.",
  openGraph: {
    title: "Запази час | Smile Craft",
    description: "Запишете час онлайн в Smile Craft — Пловдив, Рудозем или Девин.",
    url: `${siteConfig.url}/zapazi-chas`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Запази час | Smile Craft",
    description: "Запишете час онлайн в Smile Craft.",
  },
};

function BookingFormFallback() {
  return (
    <div className="animate-pulse space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 rounded-2xl bg-sand/60" />
      ))}
    </div>
  );
}

export default function ZapaziChasPage() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-aura absolute inset-0 -z-10" aria-hidden="true" />
      <div className="grid-lines absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

      <div className="container-wide grid gap-14 px-5 pb-24 pt-[calc(var(--header-offset)+4.5rem)] sm:px-8 md:pb-32 md:pt-[calc(var(--header-offset)+7rem)] lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:px-12">
        <ScrollReveal>
          <p className="eyebrow-label">Записване</p>
          <h1 className="heading-xl mt-6">
            Запази <span className="text-gold-gradient italic">час</span>
          </h1>
          <p className="lead mt-8 max-w-md">
            Попълнете формата и нашият екип ще се свърже с вас за потвърждение на
            часа. Предпочитате телефон? Обадете се директно в кабинета.
          </p>

          <div className="mt-12 space-y-3">
            {locationList.map((loc) => (
              <div key={loc.slug} className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white/70 p-5 shadow-soft backdrop-blur">
                <div>
                  <p className="font-display text-xl text-ink">{loc.nameBg}</p>
                  <p className="mt-1 flex items-center gap-2 font-body text-xs text-ink-muted">
                    <Clock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    {loc.hours[0]}
                  </p>
                </div>
                <a
                  href={`tel:${loc.phone.replace(/\s/g, "")}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cream px-4 py-2.5 font-body text-xs font-semibold text-ink transition-colors hover:bg-sand"
                >
                  <Phone className="h-3.5 w-3.5 text-gold-deep" aria-hidden="true" />
                  {loc.phone}
                </a>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="glass-card p-6 sm:p-8 md:p-10">
            <Suspense fallback={<BookingFormFallback />}>
              <BookingForm />
            </Suspense>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
