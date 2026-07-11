"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Shield,
  Crown,
  AlignCenter,
  Sun,
  Baby,
  type LucideIcon,
} from "lucide-react";
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
  className?: string;
}

export default function ServiceCard({ service, className }: ServiceCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const Icon = iconMap[service.icon];

  return (
    <motion.div
      className={cn(
        "rounded-xl border border-beige-pale bg-bg-white p-8 shadow-soft",
        className
      )}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-beige-pale">
        <Icon
          className="h-6 w-6 text-beige-primary"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 font-display text-xl font-normal text-text-dark">
        {service.title}
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-text-muted">
        {service.description}
      </p>
    </motion.div>
  );
}
