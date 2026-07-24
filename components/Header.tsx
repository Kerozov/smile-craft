"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { locationList } from "@/lib/locations";
import { siteConfig, cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Начало" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/rezultati", label: "Резултати" },
  { href: "/za-nas", label: "За нас" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLocationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setLocationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLocationActive = locationList.some(
    (loc) => pathname === `/${loc.slug}`
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-bg-white/95 backdrop-blur-md transition-shadow duration-300",
        scrolled ? "shadow-header" : "border-b border-beige-pale"
      )}
    >
      {/* Main navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4 md:px-8 xl:px-12">
        <Link
          href="/"
          className="group flex shrink-0 flex-col leading-none"
          aria-label="Smile Craft — начална страница"
        >
          <span className="font-display text-2xl font-medium tracking-tight text-text-dark transition-colors group-hover:text-beige-primary">
            Smile Craft
          </span>
          <span className="mt-1 font-body text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
            Дентална практика
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Основна навигация"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3.5 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                pathname === link.href
                  ? "font-medium text-beige-primary"
                  : "text-text-dark"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLocationsOpen((o) => !o)}
              aria-expanded={locationsOpen}
              aria-haspopup="true"
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-3.5 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                isLocationActive || locationsOpen
                  ? "font-medium text-beige-primary"
                  : "text-text-dark"
              )}
            >
              Кабинети
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  locationsOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {locationsOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-beige-pale bg-bg-white py-2 shadow-card">
                {locationList.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${loc.slug}`}
                    className={cn(
                      "block px-4 py-2.5 font-body text-sm transition-colors hover:bg-bg-cream hover:text-beige-primary",
                      pathname === `/${loc.slug}`
                        ? "bg-bg-cream text-beige-primary"
                        : "text-text-dark"
                    )}
                  >
                    {loc.nameBg}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/zapazi-chas" className="btn-primary text-xs">
            Запази час
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-beige-pale px-3 py-2 text-text-dark lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Отвори меню"
        >
          <span className="font-body text-xs font-medium uppercase tracking-wider">
            Меню
          </span>
          <Menu size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-beige-pale px-6 py-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex flex-col leading-none"
            >
              <span className="font-display text-xl text-text-dark">
                Smile Craft
              </span>
              <span className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Дентална практика
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-beige-pale px-3 py-2"
              aria-label="Затвори меню"
            >
              <span className="font-body text-xs font-medium uppercase tracking-wider">
                Затвори
              </span>
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-6 py-6"
            aria-label="Мобилна навигация"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-beige-pale py-4 font-display text-2xl text-text-dark"
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-6 mb-1 font-body text-xs uppercase tracking-[0.2em] text-text-muted">
                Кабинети
              </p>
              {locationList.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/${loc.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-beige-pale py-3 font-body text-lg text-text-dark"
                >
                  {loc.nameBg}
                </Link>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              <a
                href={`mailto:${siteConfig.email}`}
                className="block font-body text-sm text-text-muted"
              >
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="block font-body text-sm text-text-muted"
              >
                {siteConfig.phone}
              </a>
            </div>
          </nav>

          <div className="border-t border-beige-pale p-6">
            <Link
              href="/zapazi-chas"
              className="btn-primary block w-full text-center"
              onClick={() => setMobileOpen(false)}
            >
              Запази час
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
