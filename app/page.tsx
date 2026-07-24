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
import { portraitPlaceholder } from "@/lib/utils";

export default function HomePage() {
  const featuredResults = results.slice(0, 4);

  return (
    <>
      <Hero />

      {/* Results section */}
      <section className="section-padding bg-bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="eyebrow-label">Портфолио</p>
            <h2 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Резултати, не обещания
            </h2>
            <p className="mt-4 max-w-2xl font-body text-text-muted">
              Всяка усмивка е резултат от внимателно планиране и прецизно
              лечение. Плъзнете, за да видите трансформацията.
            </p>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {featuredResults.map((result, i) => (
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

          <ScrollReveal className="mt-10 text-center">
            <Link
              href="/rezultati"
              className="inline-block font-body text-sm text-beige-primary hover:underline"
            >
              Вижте всички резултати →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Locations section */}
      <section className="section-padding bg-bg-cream">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="eyebrow-label">Локации</p>
            <h2 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Нашите кабинети
            </h2>
            <p className="mt-4 max-w-2xl font-body text-text-muted">
              Три кабинета —{" "}
              <Link
                href="/plovdiv"
                className="text-beige-primary hover:underline"
              >
                Пловдив
              </Link>
              ,{" "}
              <Link
                href="/rudozem"
                className="text-beige-primary hover:underline"
              >
                Рудозем
              </Link>{" "}
              и{" "}
              <Link
                href="/devin"
                className="text-beige-primary hover:underline"
              >
                Девин
              </Link>{" "}
              — еднакво високо качество на грижа, близо до вас
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
      <section className="section-padding bg-bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="eyebrow-label">Услуги</p>
            <h2 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
              Нашите услуги
            </h2>
            <p className="mt-4 max-w-2xl font-body text-text-muted">
              От профилактика до сложни естетични възстановявания — всяка
              процедура следва ясен протокол за вашата безопасност и комфорт
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
      <section className="section-padding bg-bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-beige-pale bg-beige-pale shadow-soft">
              <Image
                // TODO: replace with real photo
                src={portraitPlaceholder}
                alt="Д-р Ани Овардова — основател на Smile Craft"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="eyebrow-label">За нас</p>
            <h2 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl">
              За Д-р Овардова
            </h2>
            <p className="mt-6 font-body leading-relaxed text-text-muted">
              Д-р Ани Овардова основава Smile Craft с ясна цел: пациентите да
              получават грижа, на която могат да се доверят. С над десет
              години опит и постоянно обучение в съвременни методи на лечение,
              тя отделя време да изслуша всеки пациент и да предложи решение,
              съобразено с неговите нужди.
            </p>
            <p className="mt-4 font-body leading-relaxed text-text-muted">
              Екипът ѝ споделя същия подход — модерно оборудване, съчетано с
              внимание и спокойствие във всеки от трите кабинета.
            </p>
            <Link
              href="/za-nas"
              className="mt-8 inline-block font-body text-sm text-beige-primary hover:underline"
            >
              Научете повече →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-bg-white">
        <ScrollReveal className="mx-auto mb-10 max-w-7xl text-center">
          <p className="eyebrow-label">Отзиви</p>
          <h2 className="mt-4 font-display text-3xl font-normal text-text-dark md:text-4xl">
            Думите на нашите пациенти
          </h2>
        </ScrollReveal>
        <Marquee items={testimonials} />
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-b from-bg-cream to-bg-white">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-normal text-text-dark md:text-4xl lg:text-5xl">
            Готови сте за{" "}
            <span className="text-beige-primary">първата стъпка</span>?
          </h2>
          <p className="mt-6 font-body text-text-muted">
            Запишете час в кабинета, най-близо до вас — Пловдив, Рудозем или
            Девин.
          </p>
          <Link href="/zapazi-chas" className="btn-primary mt-10">
            Запази час
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
