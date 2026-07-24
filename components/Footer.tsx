import Link from "next/link";
import CityLinks from "@/components/CityLinks";
import { locationList } from "@/lib/locations";
import { siteConfig } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t border-beige-pale bg-bg-cream">
      <div className="section-padding mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-normal text-text-dark">
              Smile Craft
            </p>
            <p className="mt-3 font-body text-sm text-text-muted">
              {siteConfig.doctor}
            </p>
            <CityLinks
              className="mt-2 justify-start"
              linkClassName="font-body text-xs uppercase tracking-widest text-beige-primary"
            />
            <p className="mt-1 font-body text-xs text-text-muted">
              От {siteConfig.established} г.
            </p>
          </div>

          {locationList.map((loc) => (
            <div key={loc.slug}>
              <h3 className="font-display text-lg font-normal text-text-dark">
                {loc.nameBg}
              </h3>
              <address className="mt-3 not-italic">
                <p className="font-body text-xs leading-relaxed text-text-muted">
                  {loc.address}
                  <br />
                  {loc.postalCode} {loc.city}
                </p>
                <p className="mt-2 font-body text-xs text-text-muted">
                  <a
                    href={`tel:${loc.phone.replace(/\s/g, "")}`}
                    className="hover:text-beige-primary"
                  >
                    {loc.phone}
                  </a>
                </p>
                <p className="font-body text-xs text-text-muted">
                  <a
                    href={`mailto:${loc.email}`}
                    className="hover:text-beige-primary"
                  >
                    {loc.email}
                  </a>
                </p>
              </address>
              <Link
                href={`/${loc.slug}`}
                className="mt-3 inline-block font-body text-sm text-beige-primary hover:underline"
              >
                Научете повече →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-beige-pale pt-8 md:flex-row">
          <p className="font-body text-xs text-text-muted">
            © {new Date().getFullYear()} Smile Craft. Всички права запазени.
          </p>
          <nav className="flex gap-6" aria-label="Долна навигация">
            <Link
              href="/uslugi"
              className="font-body text-xs text-text-muted hover:text-beige-primary"
            >
              Услуги
            </Link>
            <Link
              href="/rezultati"
              className="font-body text-xs text-text-muted hover:text-beige-primary"
            >
              Резултати
            </Link>
            <Link
              href="/zapazi-chas"
              className="font-body text-xs text-text-muted hover:text-beige-primary"
            >
              Запази час
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
