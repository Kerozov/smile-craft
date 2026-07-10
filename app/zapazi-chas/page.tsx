import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Запази час",
  description:
    "Запишете час онлайн в Smile Craft — изберете ателие в Пловдив, Рудозем или Девин и нашият екип ще се свърже с вас.",
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
        <div key={i} className="h-12 rounded-sm bg-white/10" />
      ))}
    </div>
  );
}

export default function ZapaziChasPage() {
  return (
    <>
      <section className="section-padding bg-bg-dark pt-32">
        <div className="mx-auto max-w-2xl">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              Записване
            </p>
            <h1 className="mt-4 font-display text-3xl font-semibold text-text-light md:text-5xl">
              Запази час
            </h1>
            <p className="mt-6 font-body text-text-light/75">
              Попълнете формата по-долу и нашият екип ще се свърже с вас за
              потвърждение на часа. Изберете ателие в Пловдив, Рудозем или
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
