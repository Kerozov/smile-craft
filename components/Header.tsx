"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { locationList } from "@/lib/locations";
import { siteConfig } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navLinks = [
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
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLocationsOpen(false);
  }, [pathname]);

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
        "fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
        scrolled ? "shadow-header" : "shadow-none"
      )}
    >
      {/* Top utility bar — Klaas-style contact strip */}
      <div className="hidden border-b border-beige-pale bg-bg-cream lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-12 py-2">
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-body text-xs text-text-muted transition-colors hover:text-beige-primary"
            >
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 font-body text-xs text-text-muted transition-colors hover:text-beige-primary"
            >
              <Phone className="h-3 w-3" aria-hidden="true" />
              {siteConfig.phone}
            </a>
          </div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-text-muted">
            Пловдив · Рудозем · Девин
          </p>
        </div>
      </div>

      {/* Main navigation */}
      <div
        className={cn(
          "border-b border-beige-pale bg-bg-white/95 backdrop-blur-md transition-colors",
          scrolled && "bg-bg-white"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link
            href="/"
            className="font-display text-xl font-medium tracking-tight text-text-dark md:text-2xl"
            aria-label="Smile Craft — начална страница"
          >
            Smile Craft
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Основна навигация"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-sm transition-colors hover:text-beige-primary",
                  pathname === link.href
                    ? "font-medium text-beige-primary"
                    : "text-text-dark"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Locations dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLocationsOpen((o) => !o)}
                aria-expanded={locationsOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-1 font-body text-sm transition-colors hover:text-beige-primary",
                  isLocationActive
                    ? "font-medium text-beige-primary"
                    : "text-text-dark"
                )}
              >
                Кабинети
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    locationsOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
              {locationsOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 min-w-[180px] rounded-lg border border-beige-pale bg-bg-white py-2 shadow-card">
                  {locationList.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/${loc.slug}`}
                      className="block px-4 py-2 font-body text-sm text-text-dark transition-colors hover:bg-bg-cream hover:text-beige-primary"
                    >
                      {loc.nameBg}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/zapazi-chas"
              className="btn-outline text-xs"
            >
              Контакт
            </Link>
            <Link href="/zapazi-chas" className="btn-primary text-xs">
              Запази час
            </Link>
          </div>

          <button
            type="button"
            className="text-text-dark lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Затвори меню" : "Отвори меню"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="border-b border-beige-pale bg-bg-white px-6 pb-6 lg:hidden"
          aria-label="Мобилна навигация"
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 font-body text-text-dark hover:bg-bg-cream"
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-2 px-3 font-body text-xs uppercase tracking-wider text-text-muted">
              Кабинети
            </p>
            {locationList.map((loc) => (
              <Link
                key={loc.slug}
                href={`/${loc.slug}`}
                className="rounded-lg px-3 py-2 pl-6 font-body text-sm text-text-dark hover:bg-bg-cream"
              >
                {loc.nameBg}
              </Link>
            ))}
            <Link href="/zapazi-chas" className="btn-primary mt-4 text-center">
              Запази час
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
