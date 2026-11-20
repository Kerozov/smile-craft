import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locationList } from "@/lib/locations";
import { siteConfig } from "@/lib/utils";

const links = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/rezultati", label: "Резултати" },
  { href: "/za-nas", label: "За нас" },
  { href: "/zapazi-chas", label: "Запази час" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ink/[0.06] bg-gradient-to-b from-cream to-sand/70">
      <div className="container-wide px-5 pb-10 pt-20 sm:px-8 md:pt-28 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-display text-3xl text-ink">Smile Craft</p>
            <p className="mt-2 font-body text-sm text-ink-soft">{siteConfig.doctor} · от {siteConfig.established} г.</p>
            <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-ink-soft">
              Съвременна дентална грижа с внимание и спокойствие — в Пловдив, Рудозем и Девин.
            </p>
            <div className="mt-8 flex flex-col gap-2 font-body text-sm">
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="w-fit text-ink transition-colors hover:text-gold-deep">
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="w-fit text-ink transition-colors hover:text-gold-deep">
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {locationList.map((loc) => (
              <div key={loc.slug}>
                <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-deep">{loc.nameBg}</h3>
                <address className="mt-4 space-y-1 font-body text-sm not-italic leading-relaxed text-ink-soft">
                  <p>{loc.address}</p>
                  <p>
                    {loc.postalCode} {loc.city}
                  </p>
                  <p className="pt-2">
                    <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-gold-deep">
                      {loc.phone}
                    </a>
                  </p>
                  <p>
                    <a href={`mailto:${loc.email}`} className="transition-colors hover:text-gold-deep">
                      {loc.email}
                    </a>
                  </p>
                </address>
                <Link href={`/${loc.slug}`} className="link-arrow mt-4 text-xs">
                  Кабинетът
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-gold-gradient pointer-events-none mt-20 select-none text-center font-display text-[clamp(4rem,17vw,16rem)] italic leading-[0.85] opacity-90"
          aria-hidden="true"
        >
          Smile Craft
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink/[0.08] pt-8 md:flex-row">
          <p className="font-body text-xs text-ink-muted">
            © {new Date().getFullYear()} Smile Craft. Всички права запазени.
          </p>
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Долна навигация">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="font-body text-xs font-medium text-ink-muted transition-colors hover:text-gold-deep">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
