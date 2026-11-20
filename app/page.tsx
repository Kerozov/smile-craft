import Link from "next/link";
import { ArrowUpRight, HeartHandshake, MapPinned, ScanLine } from "lucide-react";
import Hero from "@/components/Hero";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import LocationCard from "@/components/LocationCard";
import ServiceCard from "@/components/ServiceCard";
import Marquee from "@/components/Marquee";
import TextMarquee from "@/components/TextMarquee";
import ScrollReveal from "@/components/ScrollReveal";
import SplitHeading from "@/components/ui/SplitHeading";
import OrthodonticsSection from "@/components/OrthodonticsSection";
import DoctorPortrait from "@/components/DoctorPortrait";
import CtaBand from "@/components/CtaBand";
import { locationList } from "@/lib/locations";
import { services } from "@/lib/services";
import { results, testimonials } from "@/lib/results";
import { siteConfig } from "@/lib/utils";

const principles = [
  {
    icon: HeartHandshake,
    title: "Време за всеки пациент",
    text: "Изслушваме ви, обясняваме всяка стъпка и предлагаме решение, съобразено с вашите нужди.",
  },
  {
    icon: ScanLine,
    title: "Ясен протокол",
    text: "Всяка процедура следва ясен план — за вашата безопасност, комфорт и предвидим резултат.",
  },
  {
    icon: MapPinned,
    title: "Три кабинета, един стандарт",
    text: "Еднакво високо качество на грижа в Пловдив, Рудозем и Девин — близо до вас.",
  },
];

export default function HomePage() {
  const featuredResults = results.slice(0, 4);

  return (
    <>
      <Hero />

      <TextMarquee words={["Ортодонтия", "Естетика", "Импланти", "Избелване", "Профилактика", "Детска грижа"]} />

      <OrthodonticsSection />

      {/* Услуги — bento */}
      <section className="section-padding relative">
        <div className="container-wide">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <ScrollReveal>
                <p className="eyebrow-label">Услуги</p>
              </ScrollReveal>
              <SplitHeading text="Всичко за усмивката," accent="на едно място" className="mt-6" />
            </div>
            <ScrollReveal delay={0.1}>
              <p className="lead max-w-md lg:ml-auto">
                От ортодонтия и естетика до профилактика — всяка процедура следва
                ясен протокол за вашата безопасност и комфорт.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-16 grid auto-rows-[minmax(18rem,auto)] gap-5 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

      {/* Резултати */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-b from-ivory via-cream to-ivory">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <ScrollReveal>
                <p className="eyebrow-label">Портфолио</p>
              </ScrollReveal>
              <SplitHeading text="Резултати," accent="не обещания" className="mt-6" />
            </div>
            <ScrollReveal delay={0.1} className="max-w-sm">
              <p className="lead">Плъзнете разделителя, за да видите трансформацията.</p>
              <Link href="/rezultati" className="link-arrow mt-5">
                Всички резултати
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {featuredResults.map((result, i) => (
              <ScrollReveal key={result.id} delay={(i % 2) * 0.12} className={i % 2 ? "md:mt-16" : undefined}>
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

      {/* За д-р Овардова */}
      <section className="section-padding">
        <div className="container-wide grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <ScrollReveal>
            <DoctorPortrait />
          </ScrollReveal>
          <div>
            <ScrollReveal>
              <p className="eyebrow-label">Основател</p>
            </ScrollReveal>
            <SplitHeading text={siteConfig.doctor} className="mt-6" />
            <ScrollReveal delay={0.1}>
              <p className="lead mt-8">
                Д-р Ани Овардова основава Smile Craft с ясна цел: пациентите да
                получават грижа, на която могат да се доверят. С над десет години
                опит и постоянно обучение в съвременни методи на лечение, тя
                отделя време да изслуша всеки пациент.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-4">
              {principles.map((p, i) => (
                <ScrollReveal key={p.title} delay={0.1 + i * 0.08}>
                  <div className="flex gap-5 rounded-2xl border border-ink/[0.06] bg-white/70 p-5 backdrop-blur transition-colors duration-500 hover:border-gold/30 hover:bg-white">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-gold-deep">
                      <p.icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-ink">{p.title}</h3>
                      <p className="mt-1 font-body text-sm leading-relaxed text-ink-soft">{p.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <Link href="/za-nas" className="link-arrow mt-10">
                Научете повече за нас
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Кабинети */}
      <section className="section-padding bg-gradient-to-b from-ivory to-cream">
        <div className="container-wide">
          <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <ScrollReveal>
                <p className="eyebrow-label">Локации</p>
              </ScrollReveal>
              <SplitHeading text="Три кабинета," accent="близо до вас" className="mt-6" />
            </div>
            <ScrollReveal delay={0.1}>
              <p className="lead max-w-md lg:ml-auto">
                <Link href="/plovdiv" className="link-underline">Пловдив</Link>,{" "}
                <Link href="/rudozem" className="link-underline">Рудозем</Link> и{" "}
                <Link href="/devin" className="link-underline">Девин</Link> — еднакво
                високо качество на грижа във всеки от тях.
              </p>
            </ScrollReveal>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {locationList.map((loc, i) => (
              <ScrollReveal key={loc.slug} delay={i * 0.1} className="h-full">
                <LocationCard location={loc} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Отзиви */}
      <section className="section-padding overflow-hidden bg-cream !px-0">
        <div className="container-wide px-5 sm:px-8 lg:px-12">
          <ScrollReveal>
            <p className="eyebrow-label">Отзиви</p>
          </ScrollReveal>
          <SplitHeading text="Думите на" accent="нашите пациенти" className="mt-6" />
        </div>
        <Marquee items={testimonials} className="mt-16" />
      </section>

      <div className="bg-cream pt-24 md:pt-32">
        <CtaBand />
      </div>
    </>
  );
}
