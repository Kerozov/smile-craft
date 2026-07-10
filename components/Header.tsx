"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/rezultati", label: "Резултати" },
  { href: "/za-nas", label: "За нас" },
  { href: "/plovdiv", label: "Локации" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(20, 18, 15, 0)", "rgba(20, 18, 15, 0.95)"]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-white/10 backdrop-blur-md"
          : "border-transparent"
      )}
      style={
        shouldReduceMotion
          ? { backgroundColor: scrolled ? "rgba(20, 18, 15, 0.95)" : "transparent" }
          : { backgroundColor: headerBg }
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-text-light md:text-2xl"
          aria-label="Smile Craft — начална страница"
        >
          Smile Craft
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Основна навигация">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-sm tracking-wide transition-colors hover:text-accent-gold",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-accent-gold"
                  : "text-text-light/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/zapazi-chas"
            className="rounded-sm bg-accent-gold px-5 py-2.5 font-body text-sm font-medium text-bg-dark transition-colors hover:bg-accent-gold/90"
          >
            Запази час
          </Link>
        </nav>

        <button
          type="button"
          className="text-text-light md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Затвори меню" : "Отвори меню"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 bg-bg-dark px-6 pb-6 md:hidden"
          aria-label="Мобилна навигация"
        >
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-text-light/90 hover:text-accent-gold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/zapazi-chas"
              className="mt-2 inline-block rounded-sm bg-accent-gold px-5 py-2.5 text-center font-body text-sm font-medium text-bg-dark"
            >
              Запази час
            </Link>
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
