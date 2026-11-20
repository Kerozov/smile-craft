import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import CityLinks from "@/components/CityLinks";
import HeroArtwork from "@/components/HeroArtwork";
import { siteConfig } from "@/lib/utils";
import molar from "@/public/hero-molar.webp";

const stats = [
  { value: siteConfig.established, label: "година на основаване" },
  { value: "3", label: "кабинета в Родопите и Пловдив" },
  { value: "6", label: "направления на лечение" },
];

export default function Hero() {
  return (
    <section aria-labelledby="home-title" className="hero-aura relative isolate overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-50" aria-hidden="true" />

      <div className="mx-auto grid min-h-[100svh] max-w-[88rem] content-center px-5 pb-8 pt-[calc(var(--header-offset)+1rem)] sm:px-8 md:grid-cols-[1.04fr_1fr] md:gap-x-4 md:pb-16 md:pt-[calc(var(--header-offset)+2rem)] lg:px-12">
        <div>
          <div className="mb-6 hidden items-center gap-3 md:flex">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            <CityLinks
              className="!justify-start"
              linkClassName="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft hover:text-gold-deep"
            />
          </div>

          <h1 id="home-title" className="hero-title font-display font-normal text-ink">
            <span className="block">Усмивка, </span>
            <span className="block">на която можеш </span>
            <span className="block">да <em className="text-gold-deep">разчиташ</em></span>
          </h1>

          <p className="mt-5 max-w-lg font-body text-base leading-relaxed text-ink-soft md:mt-7 md:text-lg">
            {siteConfig.doctor} и екипът ѝ съчетават прецизна ортодонтия,
            естетика и спокойна грижа — в{" "}
            <Link href="/plovdiv" className="link-underline text-ink">Пловдив</Link>,{" "}
            <Link href="/rudozem" className="link-underline text-ink">Рудозем</Link> и{" "}
            <Link href="/devin" className="link-underline text-ink">Девин</Link>.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 md:mt-8">
            <Link href="/zapazi-chas" className="btn-primary !px-5 max-[359px]:!px-3 sm:!px-7">
              Запази час
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/rezultati" className="btn-ghost !px-5 max-[359px]:!px-3 sm:!px-7">
              Виж резултатите
            </Link>
          </div>
        </div>

        <HeroArtwork>
          <Image src={molar} alt="" priority unoptimized className="block h-full w-full object-contain" />
        </HeroArtwork>

        <dl className="grid max-w-xl grid-cols-3 gap-4 border-t border-ink/10 pt-4 md:col-start-1 md:mt-10 md:pt-5">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col">
              <dt className="mt-1 font-body text-[11px] leading-snug text-ink-soft md:text-xs">{label}</dt>
              <dd className="order-first font-display text-3xl leading-none text-ink md:text-4xl">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#ortodontiya"
        className="group absolute bottom-5 right-8 hidden items-center gap-3 font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-soft hover:text-gold-deep md:flex"
      >
        Скролнете
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10">
          <ArrowDown className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-y-0.5" aria-hidden="true" />
        </span>
      </a>
    </section>
  );
}
