"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  Phone,
  X,
  Mail,
  MapPin,
  Sparkles,
  Shield,
  Crown,
  AlignCenter,
  Sun,
  Baby,
  type LucideIcon,
} from "lucide-react";
import { locationList } from "@/lib/locations";
import { services, type ServiceIconName } from "@/lib/services";
import { siteConfig, cn } from "@/lib/utils";

const iconMap: Record<ServiceIconName, LucideIcon> = {
  shield: Shield,
  sparkles: Sparkles,
  crown: Crown,
  "align-center": AlignCenter,
  sun: Sun,
  baby: Baby,
};

type OpenMenu = "services" | "about" | "locations" | null;

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openDropdown = (menu: OpenMenu) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-bg-white transition-shadow duration-300",
        scrolled || openMenu ? "shadow-header" : "shadow-none"
      )}
    >
      {/* Top contact strip — like Klaas */}
      <div className="hidden border-b border-beige-pale bg-bg-cream lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 xl:px-12">
          <div className="flex items-center divide-x divide-beige-pale">
            <Link
              href="/zapazi-chas"
              className="px-4 py-2.5 font-body text-xs font-medium text-text-dark transition-colors hover:text-beige-primary"
            >
              Контакт
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="px-4 py-2.5 font-body text-xs text-text-muted transition-colors hover:text-beige-primary"
            >
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="px-4 py-2.5 font-body text-xs text-text-muted transition-colors hover:text-beige-primary"
            >
              {siteConfig.phone}
            </a>
          </div>
          <Link
            href="/zapazi-chas"
            className="bg-beige-primary px-5 py-2.5 font-body text-xs font-medium text-white transition-colors hover:bg-beige-deep"
          >
            Запази час
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-beige-pale">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8 xl:px-12">
          {/* Logo + tagline */}
          <Link
            href="/"
            className="group flex shrink-0 flex-col leading-none"
            aria-label="Smile Craft — начална страница"
          >
            <span className="font-display text-2xl font-medium tracking-tight text-text-dark transition-colors group-hover:text-beige-primary md:text-[1.65rem]">
              Smile Craft
            </span>
            <span className="mt-1 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-text-muted">
              Дентална практика
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Основна навигация"
            onMouseLeave={scheduleClose}
            onMouseEnter={cancelClose}
          >
            <Link
              href="/"
              className={cn(
                "rounded-md px-3 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                pathname === "/" ? "text-beige-primary" : "text-text-dark"
              )}
            >
              Начало
            </Link>

            {/* Treatments mega menu */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("services")}
            >
              <Link
                href="/uslugi"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                  pathname === "/uslugi" || openMenu === "services"
                    ? "text-beige-primary"
                    : "text-text-dark"
                )}
                aria-expanded={openMenu === "services"}
              >
                Услуги
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    openMenu === "services" && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <Link
              href="/rezultati"
              className={cn(
                "rounded-md px-3 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                pathname === "/rezultati"
                  ? "text-beige-primary"
                  : "text-text-dark"
              )}
            >
              Резултати
            </Link>

            {/* About mega menu */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("about")}
            >
              <Link
                href="/za-nas"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                  pathname === "/za-nas" || openMenu === "about"
                    ? "text-beige-primary"
                    : "text-text-dark"
                )}
                aria-expanded={openMenu === "about"}
              >
                За нас
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    openMenu === "about" && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Clinics mega menu */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("locations")}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 font-body text-sm transition-colors hover:text-beige-primary",
                  locationList.some((l) => pathname === `/${l.slug}`) ||
                    openMenu === "locations"
                    ? "text-beige-primary"
                    : "text-text-dark"
                )}
                aria-expanded={openMenu === "locations"}
                aria-haspopup="true"
              >
                Кабинети
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    openMenu === "locations" && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>
          </nav>

          {/* Right actions — like Klaas: email + Call us + Book */}
          <div className="hidden items-center gap-3 xl:flex">
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-body text-sm text-text-muted transition-colors hover:text-beige-primary"
            >
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-beige-pale px-4 py-2.5 font-body text-sm font-medium text-text-dark transition-colors hover:border-beige-primary hover:text-beige-primary"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Обадете се
            </a>
            <Link
              href="/zapazi-chas"
              className="rounded-full bg-beige-primary px-5 py-2.5 font-body text-sm font-medium text-white shadow-soft transition-colors hover:bg-beige-deep"
            >
              Запази час
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-beige-pale px-3 py-2 text-text-dark xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Отвори меню"
          >
            <span className="font-body text-xs font-medium uppercase tracking-wider">
              Меню
            </span>
            <Menu size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Desktop mega panels */}
      {openMenu && (
        <div
          className="absolute inset-x-0 top-full hidden border-b border-beige-pale bg-bg-white shadow-card xl:block"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-7xl px-8 py-8 xl:px-12">
            {openMenu === "services" && (
              <div>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="eyebrow-label">Лечение</p>
                    <p className="mt-2 font-display text-2xl text-text-dark">
                      Нашите услуги
                    </p>
                  </div>
                  <Link
                    href="/uslugi"
                    className="font-body text-sm text-beige-primary hover:underline"
                  >
                    Всички услуги →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {services.map((service) => {
                    const Icon = iconMap[service.icon];
                    return (
                      <Link
                        key={service.id}
                        href="/uslugi"
                        className="group flex gap-4 rounded-xl border border-beige-pale p-4 transition-all hover:border-beige-primary/40 hover:bg-bg-cream hover:shadow-soft"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-beige-pale transition-colors group-hover:bg-beige-primary/15">
                          <Icon
                            className="h-5 w-5 text-beige-primary"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-text-dark">
                            {service.title}
                          </p>
                          <p className="mt-1 line-clamp-2 font-body text-xs leading-relaxed text-text-muted">
                            {service.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {openMenu === "about" && (
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-4">
                  <p className="eyebrow-label">За нас</p>
                  <p className="mt-2 font-display text-2xl text-text-dark">
                    Smile Craft
                  </p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
                    Д-р Ани Овардова и екипът ѝ — внимателна грижа в три
                    кабинета.
                  </p>
                  <Link href="/za-nas" className="btn-primary mt-6 text-xs">
                    Повече за нас
                  </Link>
                </div>
                <div className="col-span-8 grid grid-cols-2 gap-3">
                  {[
                    {
                      href: "/za-nas",
                      title: "За практиката",
                      desc: "Философия, подход и екип",
                    },
                    {
                      href: "/rezultati",
                      title: "Резултати",
                      desc: "Преди и след от реални пациенти",
                    },
                    {
                      href: "/uslugi",
                      title: "Услуги",
                      desc: "Пълен спектър от дентални процедури",
                    },
                    {
                      href: "/zapazi-chas",
                      title: "Запази час",
                      desc: "Онлайн записване за преглед",
                    },
                  ].map((item) => (
                    <Link
                      key={item.href + item.title}
                      href={item.href}
                      className="rounded-xl border border-beige-pale p-5 transition-all hover:border-beige-primary/40 hover:bg-bg-cream"
                    >
                      <p className="font-body text-sm font-medium text-text-dark">
                        {item.title}
                      </p>
                      <p className="mt-1 font-body text-xs text-text-muted">
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {openMenu === "locations" && (
              <div>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="eyebrow-label">Локации</p>
                    <p className="mt-2 font-display text-2xl text-text-dark">
                      Нашите кабинети
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {locationList.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/${loc.slug}`}
                      className="group rounded-xl border border-beige-pale p-5 transition-all hover:border-beige-primary/40 hover:bg-bg-cream hover:shadow-soft"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-beige-pale">
                          <MapPin
                            className="h-4 w-4 text-beige-primary"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="font-display text-xl text-text-dark">
                          {loc.nameBg}
                        </p>
                      </div>
                      <p className="mt-3 font-body text-xs leading-relaxed text-text-muted">
                        {loc.address}
                        <br />
                        {loc.postalCode} {loc.city}
                      </p>
                      <p className="mt-3 font-body text-xs text-beige-primary group-hover:underline">
                        Виж кабинета →
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen mobile menu — Klaas style */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-bg-white xl:hidden">
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

          <div className="flex-1 overflow-y-auto px-6 py-8">
            <nav className="flex flex-col gap-1" aria-label="Мобилна навигация">
              {[
                { href: "/", label: "Начало" },
                { href: "/uslugi", label: "Услуги" },
                { href: "/rezultati", label: "Резултати" },
                { href: "/za-nas", label: "За нас" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-beige-pale py-4 font-display text-2xl text-text-dark"
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-6 font-body text-xs uppercase tracking-[0.2em] text-text-muted">
                Кабинети
              </p>
              {locationList.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/${loc.slug}`}
                  className="border-b border-beige-pale py-3 font-body text-lg text-text-dark"
                >
                  {loc.nameBg}
                </Link>
              ))}
            </nav>

            <div className="mt-10 space-y-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 font-body text-sm text-text-muted"
              >
                <Mail className="h-4 w-4 text-beige-primary" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 font-body text-sm text-text-muted"
              >
                <Phone className="h-4 w-4 text-beige-primary" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </div>
          </div>

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
