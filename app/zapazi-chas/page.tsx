import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Запази час",
  description:
    "Запишете час онлайн в Smile Craft — изберете кабинет в Пловдив, Рудозем или Девин и нашият екип ще се свърже с вас.",
  openGraph: {
    title: "Запази час | Smile Craft",
    description:
      "Запишете час онлайн в Smile Craft — Пловдив, Рудозем или Девин.",
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
        <div key={i} className="h-12 rounded-lg bg-beige-pale" />
      ))}
    </div>
  );
}

export default function ZapaziChasPage() {
  return (
    <>
      <section className="section-padding bg-bg-cream">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="eyebrow-label">Записване</p>
            <h1 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Запази час
            </h1>
            <p className="mt-6 font-body text-text-muted">
              Попълнете формата по-долу и нашият екип ще се свърже с вас за
              потвърждение на часа. Изберете кабинет в Пловдив, Рудозем или
              Девин.
            </p>
          </ScrollReveal>

          <ScrollReveal className="mt-12">
            <Suspense fallback={<BookingFormFallback />}>
              <BookingForm />
            </Suspense>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
