"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { locationList } from "@/lib/locations";
import { siteConfig, cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Начало" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/rezultati", label: "Резултати" },
  { href: "/za-nas", label: "За нас" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white to-sand shadow-inner-light ring-1 ring-gold/25">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
          <path
            d="M7.2 3.2c-2.4 0-4 1.9-4 4.6 0 2.1.8 3.3 1.4 5.1.6 1.9.7 3.9 1.3 5.9.3 1.1.9 2 1.8 2 1.6 0 1.5-2.6 2-4.3.3-1.1.8-1.8 2.3-1.8s2 .7 2.3 1.8c.5 1.7.4 4.3 2 4.3.9 0 1.5-.9 1.8-2 .6-2 .7-4 1.3-5.9.6-1.8 1.4-3 1.4-5.1 0-2.7-1.6-4.6-4-4.6-1.9 0-2.9 1-4.8 1s-2.9-1-4.8-1Z"
            fill="none"
            stroke="#8F6F48"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-medium tracking-tight text-ink">Smile Craft</span>
        <span className="mt-1 font-body text-[9px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
          Дентална практика
        </span>
      </span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLocationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setLocationsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLocationsOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isLocationActive = locationList.some((loc) => pathname === `/${loc.slug}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-[88rem] items-center justify-between gap-6 rounded-full border px-4 py-2.5 transition-all duration-700 ease-premium md:px-6",
          scrolled
            ? "border-white/80 bg-white/75 shadow-header backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="shrink-0" aria-label="Smile Craft — начална страница">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основна навигация">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 font-body text-sm font-medium transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white shadow-soft ring-1 ring-ink/5"
                    transition={{ duration: 0.6, ease }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLocationsOpen((o) => !o)}
              aria-expanded={locationsOpen}
              aria-haspopup="true"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-4 py-2 font-body text-sm font-medium transition-colors",
                isLocationActive || locationsOpen ? "text-ink" : "text-ink-soft hover:text-ink",
                isLocationActive && "bg-white shadow-soft ring-1 ring-ink/5"
              )}
            >
              Кабинети
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform duration-300", locationsOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {locationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.3, ease }}
                  className="glass-card absolute right-0 top-full z-50 mt-3 w-64 origin-top-right p-2"
                >
                  {locationList.map((loc) => (
                    <Link
                      key={loc.slug}
                      href={`/${loc.slug}`}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-white",
                        pathname === `/${loc.slug}` && "bg-white"
                      )}
                    >
                      <span>
                        <span className="block font-display text-lg text-ink">{loc.nameBg}</span>
                        <span className="block font-body text-xs text-ink-muted">{loc.address}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="hidden font-body text-sm font-medium text-ink-soft transition-colors hover:text-gold-deep xl:inline"
          >
            {siteConfig.phone}
          </a>
          <Link href="/zapazi-chas" className="btn-primary !px-6 !py-3 text-xs">
            Запази час
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 text-ink backdrop-blur lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Отвори меню"
          aria-expanded={mobileOpen}
        >
          <span className="font-body text-xs font-semibold uppercase tracking-[0.18em]">Меню</span>
          <Menu size={18} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ivory lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
          >
            <div className="hero-aura pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
            <div className="flex items-center justify-between px-5 py-5">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Logo />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4"
                aria-label="Затвори меню"
              >
                <span className="font-body text-xs font-semibold uppercase tracking-[0.18em]">Затвори</span>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 px-5 pt-6" aria-label="Мобилна навигация">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between border-b border-ink/[0.07] py-4 font-display text-4xl",
                      pathname === link.href ? "text-gold-deep" : "text-ink"
                    )}
                  >
                    {link.label}
                    <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden="true" />
                  </Link>
                </motion.div>
              ))}
              <motion.p
                className="eyebrow-label mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Кабинети
              </motion.p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {locationList.map((loc, i) => (
                  <motion.div
                    key={loc.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.42 + i * 0.05 }}
                  >
                    <Link
                      href={`/${loc.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-2xl border border-white bg-white/70 px-3 py-4 text-center font-body text-sm font-semibold text-ink shadow-soft"
                    >
                      {loc.nameBg}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            <div className="space-y-3 p-5">
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="btn-ghost w-full">
                {siteConfig.phone}
              </a>
              <Link href="/zapazi-chas" className="btn-primary w-full" onClick={() => setMobileOpen(false)}>
                Запази час
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
