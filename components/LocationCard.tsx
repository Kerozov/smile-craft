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
        "rounded-xl border border-beige-pale bg-bg-white p-8 shadow-soft",
        className
      )}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, boxShadow: "0 16px 48px rgba(61, 54, 50, 0.12)" }
      }
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige-pale">
          <MapPin
            className="h-5 w-5 text-beige-primary"
            aria-hidden="true"
          />
        </div>
        <div>
          <h3 className="font-display text-2xl font-normal text-text-dark">
            {location.nameBg}
          </h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-text-muted">
            {location.address}
            <br />
            {location.postalCode} {location.city}
          </p>
          <p className="mt-4 font-body text-xs text-text-muted">
            {location.hours[0]}
          </p>
          <Link
            href={`/${location.slug}`}
            className="mt-6 inline-block font-body text-sm text-beige-primary transition-colors hover:text-beige-deep"
          >
            Виж кабинета →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
