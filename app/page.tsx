import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LocationCard from "@/components/LocationCard";
import ServiceCard from "@/components/ServiceCard";
import Marquee from "@/components/Marquee";
import ScrollReveal from "@/components/ScrollReveal";
import { locationList } from "@/lib/locations";
import { services } from "@/lib/services";
import { results, testimonials } from "@/lib/results";

export default function HomePage() {
  const featuredResults = results.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Results section */}
      <section className="section-padding bg-bg-light">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              Портфолио
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-text-dark md:text-5xl">
              Резултати, не обещания
            </h2>
            <p className="mt-4 max-w-2xl font-body text-text-dark/70">
              Всяка усмивка е резултат от прецизна работа, планиране и
              занаятчийско усърдие. Плъзнете, за да видите трансформацията.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {featuredResults.map((result, i) => (
              <ScrollReveal key={result.id} delay={i * 0.1}>
                <BeforeAfterSlider
                  beforeImage={result.beforeImage}
                  afterImage={result.afterImage}
                  label={result.label}
                  altBefore={result.altBefore}
                  altAfter={result.altAfter}
                />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-10 text-center">
            <Link
              href="/rezultati"
              className="inline-block font-body text-sm text-accent-gold hover:underline"
            >
              Вижте всички резултати →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Locations section */}
      <section className="section-padding bg-bg-dark">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              Локации
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-text-light md:text-5xl">
              Нашите ателиета
            </h2>
            <p className="mt-4 max-w-2xl font-body text-text-light/70">
              Три ателета в Пловдив, Рудозем и Девин — еднакъв висок
              стандарт, локално удобство.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {locationList.map((loc, i) => (
              <ScrollReveal key={loc.slug} delay={i * 0.1}>
                <LocationCard location={loc} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="section-padding bg-bg-light">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              Услуги
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-text-dark md:text-5xl">
              Занаятът
            </h2>
            <p className="mt-4 max-w-2xl font-body text-text-dark/70">
              От профилактика до комплексни естетични трансформации — всяка
              процедура е изпълнена с внимание към детайла.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="section-padding bg-bg-dark">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bg-dark/80">
              <Image
                // TODO: replace with real photo
                src="/dr-ovardova.jpg"
                alt="Д-р Ани Овардова — основател на Smile Craft"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              За нас
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-text-light md:text-4xl">
              За Д-р Овардова
            </h2>
            <p className="mt-6 font-body leading-relaxed text-text-light/75">
              Д-р Ани Овардова основава Smile Craft с една ясна философия:
              стоматологията е занаят, който изисква еднакво внимание към
              науката и естетиката. С над десет години опит и непрекъснато
              професионално развитие, тя подхожда към всеки пациент като към
              уникален проект — с прецизност, топлина и безкомпромисен стандарт.
            </p>
            <p className="mt-4 font-body leading-relaxed text-text-light/75">
              Нейният екип споделя същата страст към детайла, съчетавайки
              модерна технология с човешко отношение във всяко от трите ателие.
            </p>
            <Link
              href="/za-nas"
              className="mt-8 inline-block font-body text-sm text-accent-gold hover:underline"
            >
              Научете повече →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding overflow-hidden bg-bg-light">
        <ScrollReveal className="mx-auto mb-10 max-w-7xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
            Отзиви
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-text-dark md:text-4xl">
            Думите на нашите пациенти
          </h2>
        </ScrollReveal>
        <Marquee items={testimonials} />
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-bg-dark">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold text-text-light md:text-5xl">
            Готови за своята{" "}
            <span className="text-accent-gold">трансформация</span>?
          </h2>
          <p className="mt-6 font-body text-text-light/70">
            Запишете час в ателието, най-близо до вас — Пловдив, Рудозем или
            Девин.
          </p>
          <Link
            href="/zapazi-chas"
            className="mt-10 inline-block rounded-sm bg-accent-gold px-10 py-4 font-body text-sm font-medium text-bg-dark transition-colors hover:bg-accent-gold/90"
          >
            Запази час
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
