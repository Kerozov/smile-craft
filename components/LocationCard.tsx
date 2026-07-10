"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  location: Location;
  className?: string;
}

export default function LocationCard({ location, className }: LocationCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "rounded-sm border border-white/10 bg-bg-dark/60 p-8 backdrop-blur-sm",
        className
      )}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, boxShadow: "0 16px 48px rgba(0, 0, 0, 0.32)" }
      }
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent-gold" aria-hidden="true" />
        <div>
          <h3 className="font-display text-2xl font-semibold text-text-light">
            {location.nameBg}
          </h3>
          <p className="mt-2 font-mono text-xs leading-relaxed text-text-light/60">
            {location.address}
            <br />
            {location.postalCode} {location.city}
          </p>
          <p className="mt-4 font-mono text-xs text-text-light/50">
            {location.hours[0]}
          </p>
          <Link
            href={`/${location.slug}`}
            className="mt-6 inline-block font-body text-sm text-accent-gold transition-colors hover:text-accent-gold/80"
          >
            Виж ателието →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
