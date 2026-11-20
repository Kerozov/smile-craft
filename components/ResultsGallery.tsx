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
      layout={!shouldReduceMotion}
      className="mb-5 break-inside-avoid"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
    >
      <motion.div
        className="card-premium p-3"
        whileHover={shouldReduceMotion ? undefined : { y: -6 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <BeforeAfterSlider
          beforeImage={item.beforeImage}
          afterImage={item.afterImage}
          category={item.category}
          seed={Number(item.id)}
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
          className="glass-pill mb-12 inline-flex max-w-full flex-wrap gap-1 p-1.5"
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
                "relative rounded-full px-4 py-2.5 font-body text-xs font-semibold tracking-wide transition-colors md:px-5",
                activeFilter === tab.id ? "text-white" : "text-ink-soft hover:text-ink"
              )}
            >
              {activeFilter === tab.id && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-0 rounded-full bg-gradient-to-br from-[#c9a678] to-gold-deep shadow-soft"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
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
