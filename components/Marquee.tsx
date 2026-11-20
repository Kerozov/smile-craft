"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
}

export default function Marquee({ items, className }: { items: Testimonial[]; className?: string }) {
  const rows = [items, [...items].reverse()];

  return (
    <div className={cn("space-y-6", className)} aria-label="Отзиви от пациенти">
      {rows.map((row, r) => (
        <div key={r} className="marquee-fade group overflow-hidden">
          <div
            className={cn(
              "flex w-max gap-6 py-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
              r === 0 ? "animate-marquee" : "animate-marquee [animation-direction:reverse]"
            )}
          >
            {[...row, ...row].map((item, i) => (
              <blockquote
                key={`${item.id}-${i}`}
                aria-hidden={i >= row.length}
                className="glass-card w-[300px] shrink-0 p-7 md:w-[420px]"
              >
                <Quote className="h-6 w-6 text-gold/70" strokeWidth={1.2} aria-hidden="true" />
                <p className="mt-4 font-display text-lg leading-snug text-ink md:text-xl">{item.quote}</p>
                <footer className="mt-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold font-body text-xs font-semibold text-white">
                    {item.author.charAt(0)}
                  </span>
                  <cite className="not-italic">
                    <span className="block font-body text-sm font-semibold text-ink">{item.author}</span>
                    <span className="block font-body text-xs text-ink-muted">{item.location}</span>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
