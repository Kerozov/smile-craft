import Link from "next/link";
import { locationList } from "@/lib/locations";
import { siteConfig } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-text-light">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold">Smile Craft</p>
            <p className="mt-3 font-body text-sm text-text-light/70">
              {siteConfig.doctor}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-accent-gold">
              Пловдив / Рудозем / Девин
            </p>
            <p className="mt-1 font-mono text-xs text-text-light/50">
              ЕСТ. {siteConfig.established}
            </p>
          </div>

          {locationList.map((loc) => (
            <div key={loc.slug}>
              <h3 className="font-display text-lg font-medium">{loc.nameBg}</h3>
              <address className="mt-3 not-italic">
                <p className="font-mono text-xs leading-relaxed text-text-light/70">
                  {loc.address}
                  <br />
                  {loc.postalCode} {loc.city}
                </p>
                <p className="mt-2 font-mono text-xs text-text-light/70">
                  <a
                    href={`tel:${loc.phone.replace(/\s/g, "")}`}
                    className="hover:text-accent-gold"
                  >
                    {loc.phone}
                  </a>
                </p>
                <p className="font-mono text-xs text-text-light/70">
                  <a
                    href={`mailto:${loc.email}`}
                    className="hover:text-accent-gold"
                  >
                    {loc.email}
                  </a>
                </p>
              </address>
              <Link
                href={`/${loc.slug}`}
                className="mt-3 inline-block font-body text-sm text-accent-gold hover:underline"
              >
                Научете повече →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-body text-xs text-text-light/50">
            © {new Date().getFullYear()} Smile Craft. Всички права запазени.
          </p>
          <nav className="flex gap-6" aria-label="Долна навигация">
            <Link href="/uslugi" className="font-body text-xs text-text-light/50 hover:text-accent-gold">
              Услуги
            </Link>
            <Link href="/rezultati" className="font-body text-xs text-text-light/50 hover:text-accent-gold">
              Резултати
            </Link>
            <Link href="/zapazi-chas" className="font-body text-xs text-text-light/50 hover:text-accent-gold">
              Запази час
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
