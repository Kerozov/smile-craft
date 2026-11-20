import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { siteConfig } from "@/lib/utils";

export default function CtaBand({
  title = "Готови сте за",
  accent = "първата стъпка?",
  text = "Запишете час в кабинета най-близо до вас — Пловдив, Рудозем или Девин. Ще се свържем с вас за потвърждение.",
}: {
  title?: string;
  accent?: string;
  text?: string;
}) {
  return (
    <section className="px-5 pb-24 sm:px-8 md:pb-32 lg:px-12">
      <ScrollReveal className="container-wide">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-white via-cream to-sand px-6 py-20 text-center shadow-card md:px-16 md:py-28">
          {/* „перли“ */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#f1e6d6_55%,rgba(241,230,214,0)_72%)] shadow-glow" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#f4dcd4_55%,rgba(244,220,212,0)_72%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[18%] top-10 h-6 w-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#e3cba6)] shadow-soft" aria-hidden="true" />

          <p className="eyebrow-label justify-center">Запазване на час</p>
          <h2 className="heading-xl mx-auto mt-6 max-w-4xl">
            {title} <span className="text-gold-gradient italic">{accent}</span>
          </h2>
          <p className="lead mx-auto mt-6 max-w-xl">{text}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href="/zapazi-chas" className="btn-primary">
              Запази час
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
            <Link href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="btn-ghost">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.phone}
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
