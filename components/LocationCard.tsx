"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import type { Location } from "@/lib/locations";

export default function LocationCard({ location, index = 0 }: { location: Location; index?: number }) {
  return (
    <TiltCard className="flex h-full flex-col overflow-hidden p-7 md:p-9">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(227,203,166,0.45),transparent_70%)]" aria-hidden="true" />
      <div className="flex items-center justify-between [transform:translateZ(30px)]">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Кабинет {String(index + 1).padStart(2, "0")}
        </span>
        <MapPin className="h-5 w-5 text-gold" strokeWidth={1.4} aria-hidden="true" />
      </div>

      <h3 className="mt-10 font-display text-4xl font-normal text-ink md:text-5xl [transform:translateZ(40px)]">
        {location.nameBg}
      </h3>

      <div className="mt-6 space-y-3 font-body text-sm text-ink-soft [transform:translateZ(20px)]">
        <p className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <span>
            {location.address}, {location.postalCode} {location.city}
          </span>
        </p>
        <p className="flex gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <span>{location.hours[0]}</span>
        </p>
        <p className="flex gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <span>{location.phone}</span>
        </p>
      </div>

      <Link href={`/${location.slug}`} className="link-arrow mt-auto pt-10 after:absolute after:inset-0">
        Виж кабинета
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </TiltCard>
  );
}
