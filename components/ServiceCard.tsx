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
        "rounded-sm border border-bg-dark/5 bg-white p-8 shadow-sm",
        className
      )}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Icon
        className="h-8 w-8 text-accent-gold"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="mt-4 font-display text-xl font-medium text-text-dark">
        {service.title}
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-text-dark/70">
        {service.description}
      </p>
    </motion.div>
  );
}
