"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";
import type { ResultItem } from "@/lib/results";
import { categoryLabels, type ResultCategory } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ResultsGalleryProps {
  items: ResultItem[];
  showFilters?: boolean;
  className?: string;
}

const filterTabs: { id: "all" | ResultCategory; label: string }[] = [
  { id: "all", label: "Всички" },
  { id: "implants", label: categoryLabels.implants },
  { id: "whitening", label: categoryLabels.whitening },
  { id: "orthodontics", label: categoryLabels.orthodontics },
  { id: "aesthetic", label: categoryLabels.aesthetic },
];

function GalleryItem({
  item,
  index,
  shouldReduceMotion,
}: {
  item: ResultItem;
  index: number;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      className="mb-6 break-inside-avoid"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: (index % 3) * 0.08 }}
    >
      <motion.div
        className="overflow-hidden rounded-sm ring-1 ring-transparent transition-shadow duration-300 hover:shadow-glow hover:ring-accent-gold/50"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <BeforeAfterSlider
          beforeImage={item.beforeImage}
          afterImage={item.afterImage}
          label={item.label}
          altBefore={item.altBefore}
          altAfter={item.altAfter}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ResultsGallery({
  items,
  showFilters = false,
  className,
}: ResultsGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<"all" | ResultCategory>("all");

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

  return (
    <div className={className}>
      {showFilters && (
        <div
          className="mb-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Филтриране на резултати"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={cn(
                "rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                activeFilter === tab.id
                  ? "bg-accent-gold text-bg-dark"
                  : "bg-bg-dark/5 text-text-dark/70 hover:bg-bg-dark/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {filtered.map((item, i) => (
          <GalleryItem
            key={item.id}
            item={item}
            index={i}
            shouldReduceMotion={!!shouldReduceMotion}
          />
        ))}
      </div>
    </div>
  );
}
