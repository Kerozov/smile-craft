import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ScrollReveal from "@/components/ScrollReveal";
import { getLocationBySlug } from "@/lib/locations";
import { getResultsByLocation } from "@/lib/results";
import { siteConfig } from "@/lib/utils";

function createLocationMetadata(city: string, slug: string): Metadata {
  const title = `Зъболекар в ${city} — Smile Craft`;
  const description = `Smile Craft — дентална практика в ${city}. Д-р Ани Овардова предлага естетична стоматология, импланти, избелване и повече. Запишете час онлайн.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${slug}`,
      locale: "bg_BG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateLocationPage(slug: string) {
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const locationResults = getResultsByLocation(location.slug).slice(0, 3);

  return {
    location,
    locationResults,
    metadata: createLocationMetadata(location.nameBg, location.slug),
  };
}

export default function LocationPageContent({
  location,
  locationResults,
}: {
  location: NonNullable<ReturnType<typeof getLocationBySlug>>;
  locationResults: ReturnType<typeof getResultsByLocation>;
}) {
  return (
    <>
      <LocalBusinessSchema location={location} />
      <BreadcrumbSchema
        items={[
          { name: "Начало", href: "/" },
          { name: location.nameBg, href: `/${location.slug}` },
        ]}
      />

      <PageHero eyebrow={`Кабинет ${location.nameBg}`} title="Зъболекар в" accent={location.nameBg} lead={location.intro}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/zapazi-chas?grad=${location.slug}`} className="btn-primary">
            Запази час в {location.nameBg}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="btn-ghost">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {location.phone}
          </a>
        </div>
      </PageHero>

      <section className="px-5 pb-24 sm:px-8 md:pb-32 lg:px-12">
        <div className="container-wide grid gap-5 lg:grid-cols-[1fr_1.6fr]">
          <ScrollReveal>
            <div className="card-premium h-full p-8 md:p-10">
              <h2 className="font-display text-3xl text-ink">Адрес и работно време</h2>
              <address className="mt-8 space-y-4 font-body text-sm not-italic text-ink-soft">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    {location.address}
                    <br />
                    {location.postalCode} {location.city}
                  </span>
                </p>
                <p className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="hover:text-gold-deep">
                    {location.phone}
                  </a>
                </p>
                <p className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  <a href={`mailto:${location.email}`} className="hover:text-gold-deep">
                    {location.email}
                  </a>
                </p>
              </address>
              <ul className="mt-8 divide-y divide-ink/[0.06] border-y border-ink/[0.06]">
                {location.hours.map((line) => {
                  const [day, ...rest] = line.split(": ");
                  return (
                    <li key={line} className="flex justify-between gap-4 py-3 font-body text-sm">
                      <span className="text-ink-muted">{day}</span>
                      <span className="text-right font-medium text-ink">{rest.join(": ")}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="card-premium h-full min-h-[22rem] overflow-hidden p-2">
              <iframe
                title={`Карта на Smile Craft ${location.nameBg}`}
                src={location.mapEmbedUrl}
                className="h-full min-h-[22rem] w-full rounded-[1.4rem] border-0 grayscale-[0.4] sepia-[0.15]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {locationResults.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-ivory to-cream">
          <div className="container-wide">
            <ScrollReveal>
              <p className="eyebrow-label">Портфолио</p>
              <h2 className="heading-lg mt-6">
                Резултати от <span className="text-gold-gradient italic">{location.nameBg}</span>
              </h2>
            </ScrollReveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {locationResults.map((result, i) => (
                <ScrollReveal key={result.id} delay={i * 0.1}>
                  <div className="card-premium p-3">
                    <BeforeAfterSlider
                      beforeImage={result.beforeImage}
                      afterImage={result.afterImage}
                      category={result.category}
                      seed={Number(result.id)}
                      label={result.label}
                      altBefore={result.altBefore}
                      altAfter={result.altAfter}
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-wide">
          <ScrollReveal>
            <p className="eyebrow-label">Услуги</p>
            <h2 className="heading-lg mt-6">
              Услуги в <span className="text-gold-gradient italic">{location.nameBg}</span>
            </h2>
          </ScrollReveal>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {location.services.map((service, i) => (
              <ScrollReveal key={service} delay={i * 0.05}>
                <li className="flex items-center gap-4 rounded-2xl border border-ink/[0.06] bg-white p-5 font-body text-ink shadow-soft">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream font-display text-sm italic text-gold-deep">
                    {i + 1}
                  </span>
                  {service}
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Запазете час в" accent={location.nameBg} />
    </>
  );
}
