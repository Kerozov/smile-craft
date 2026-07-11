"use client";

import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
}

interface MarqueeProps {
  items: Testimonial[];
  className?: string;
}

export default function Marquee({ items, className }: MarqueeProps) {
  const duplicated = [...items, ...items];

  return (
    <div
      className={cn("group relative mx-auto max-w-7xl px-6 md:px-12", className)}
      aria-label="Отзиви от пациенти"
    >
      <div className="marquee-fade overflow-hidden">
        <div className="flex animate-marquee gap-6 py-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {duplicated.map((item, i) => (
            <blockquote
              key={`${item.id}-${i}`}
              className="w-[300px] shrink-0 rounded-xl border border-beige-pale bg-bg-white p-6 shadow-soft md:w-[380px]"
            >
              <p className="font-body text-sm italic leading-relaxed text-text-muted">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4">
                <cite className="not-italic">
                  <span className="font-body text-sm font-medium text-text-dark">
                    {item.author}
                  </span>
                  <span className="ml-2 font-body text-xs text-text-muted">
                    {item.location}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}
