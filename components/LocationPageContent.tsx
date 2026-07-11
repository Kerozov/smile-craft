import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
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

      <section className="section-padding bg-bg-cream">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="eyebrow-label">{location.nameBg.toUpperCase()}</p>
            <h1 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Зъболекар в {location.nameBg} — Smile Craft
            </h1>
            <p className="mt-6 font-body text-lg leading-relaxed text-text-muted">
              {location.intro}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section-padding bg-bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-normal text-text-dark">
              Адрес и работно време
            </h2>
            <address className="mt-6 not-italic">
              <p className="font-body text-sm leading-relaxed text-text-muted">
                {location.address}
                <br />
                {location.postalCode} {location.city}
              </p>
              <p className="mt-4 font-body text-sm text-text-muted">
                <a
                  href={`tel:${location.phone.replace(/\s/g, "")}`}
                  className="hover:text-beige-primary"
                >
                  {location.phone}
                </a>
              </p>
            </address>
            <div className="mt-6 space-y-1">
              {location.hours.map((line) => (
                <p
                  key={line}
                  className="font-body text-xs uppercase tracking-wider text-text-muted"
                >
                  {line}
                </p>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="aspect-video overflow-hidden rounded-xl border border-beige-pale bg-beige-pale">
              <iframe
                title={`Карта на Smile Craft ${location.nameBg}`}
                src={location.mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {locationResults.length > 0 && (
        <section className="section-padding bg-bg-cream">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal>
              <h2 className="font-display text-2xl font-normal text-text-dark md:text-3xl">
                Резултати от {location.nameBg}
              </h2>
            </ScrollReveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {locationResults.map((result, i) => (
                <ScrollReveal key={result.id} delay={i * 0.1}>
                  <div className="overflow-hidden rounded-xl border border-beige-pale bg-bg-white p-2 shadow-soft">
                    <BeforeAfterSlider
                      beforeImage={result.beforeImage}
                      afterImage={result.afterImage}
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

      <section className="section-padding bg-bg-white">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-normal text-text-dark">
              Услуги в {location.nameBg}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {location.services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-2 font-body text-text-muted"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-beige-primary" />
                  {service}
                </li>
              ))}
            </ul>
            <Link
              href={`/zapazi-chas?grad=${location.slug}`}
              className="btn-primary mt-10"
            >
              Запази час в {location.nameBg}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
