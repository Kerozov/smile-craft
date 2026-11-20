"use client";

import Link from "next/link";
import { Sparkles, Shield, Crown, AlignCenter, Sun, Baby, ArrowUpRight, type LucideIcon } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import type { Service, ServiceIconName } from "@/lib/services";
import { cn } from "@/lib/utils";

const iconMap: Record<ServiceIconName, LucideIcon> = {
  shield: Shield,
  sparkles: Sparkles,
  crown: Crown,
  "align-center": AlignCenter,
  sun: Sun,
  baby: Baby,
};

interface ServiceCardProps {
  service: Service;
  index?: number;
  featured?: boolean;
  className?: string;
}

export default function ServiceCard({ service, index = 0, featured = false, className }: ServiceCardProps) {
  const Icon = iconMap[service.icon];

  return (
    <TiltCard className={cn("flex flex-col overflow-hidden p-7 md:p-9", featured && "bg-gradient-to-br from-white via-white to-cream", className)}>
      {featured && (
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute -right-8 top-6 h-[78%] w-auto opacity-70 [transform:translateZ(20px)] md:right-6"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="feat-tooth" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E3CBA6" />
              <stop offset="100%" stopColor="#B8956A" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M7.2 3.2c-2.4 0-4 1.9-4 4.6 0 2.1.8 3.3 1.4 5.1.6 1.9.7 3.9 1.3 5.9.3 1.1.9 2 1.8 2 1.6 0 1.5-2.6 2-4.3.3-1.1.8-1.8 2.3-1.8s2 .7 2.3 1.8c.5 1.7.4 4.3 2 4.3.9 0 1.5-.9 1.8-2 .6-2 .7-4 1.3-5.9.6-1.8 1.4-3 1.4-5.1 0-2.7-1.6-4.6-4-4.6-1.9 0-2.9 1-4.8 1s-2.9-1-4.8-1Z"
            fill="none"
            stroke="url(#feat-tooth)"
            strokeWidth="0.25"
          />
          <path
            d="M7.6 4.6c-1.7 0-2.9 1.4-2.9 3.3 0 1.5.6 2.4 1 3.7.5 1.4.5 2.8 1 4.3"
            fill="none"
            stroke="#E3CBA6"
            strokeWidth="0.15"
            strokeLinecap="round"
          />
        </svg>
      )}
      <div className="flex items-start justify-between [transform:translateZ(40px)]">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-sand shadow-inner-light ring-1 ring-gold/20">
          <Icon className="h-6 w-6 text-gold-deep" strokeWidth={1.4} aria-hidden="true" />
        </div>
        <span className="font-display text-sm italic text-ink-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-auto pt-12 [transform:translateZ(30px)]">
        <h3 className={cn("font-display font-normal leading-tight text-ink", featured ? "text-3xl md:text-4xl" : "text-2xl")}>
          {service.title}
        </h3>
        <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft md:text-[15px]">{service.description}</p>
        <Link
          href={`/zapazi-chas?service=${service.id}`}
          className="link-arrow mt-6 after:absolute after:inset-0"
          aria-label={`Запази час за ${service.title}`}
        >
          Запази час
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </TiltCard>
  );
}
