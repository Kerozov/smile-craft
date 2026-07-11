"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  label?: string;
  altBefore?: string;
  altAfter?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  label,
  altBefore = "Преди лечение",
  altAfter = "След лечение",
  className,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const percent = useMotionValue(50);
  const smoothPercent = useSpring(percent, {
    stiffness: shouldReduceMotion ? 1000 : 320,
    damping: shouldReduceMotion ? 100 : 32,
    mass: 0.8,
  });

  const activePercent = shouldReduceMotion ? percent : smoothPercent;
  const clipPath = useTransform(
    activePercent,
    (v) => `inset(0 ${100 - v}% 0 0)`
  );
  const handleLeft = useTransform(activePercent, (v) => `${v}%`);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const { left, width } = el.getBoundingClientRect();
      const next = ((clientX - left) / width) * 100;
      percent.set(Math.min(Math.max(next, 5), 95));
    },
    [percent]
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => setIsDragging(false);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const current = percent.get();
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      percent.set(Math.max(current - 3, 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      percent.set(Math.min(current + 3, 95));
    }
  };

  const [ariaValue, setAriaValue] = useState(50);
  useEffect(() => {
    return activePercent.on("change", (v) => setAriaValue(Math.round(v)));
  }, [activePercent]);

  const isRemote = beforeImage.startsWith("http");

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-col-resize overflow-hidden rounded-lg bg-beige-pale touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Image
          src={afterImage}
          alt={altAfter}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          draggable={false}
          unoptimized={isRemote}
        />

        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <Image
            src={beforeImage}
            alt={altBefore}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
            unoptimized={isRemote}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-beige-primary"
          style={{ left: handleLeft }}
        />

        <motion.div
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: handleLeft }}
        >
          <motion.button
            type="button"
            role="slider"
            aria-label="Плъзгач за сравнение преди и след"
            aria-valuemin={5}
            aria-valuemax={95}
            aria-valuenow={ariaValue}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-beige-primary bg-bg-white shadow-soft"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
            animate={{ scale: isDragging && !shouldReduceMotion ? 1.15 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="flex gap-0.5" aria-hidden="true">
              <span className="h-3 w-0.5 rounded-full bg-beige-primary" />
              <span className="h-3 w-0.5 rounded-full bg-beige-primary" />
            </span>
          </motion.button>
        </motion.div>

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-bg-white/90 px-3 py-1 font-body text-[10px] uppercase tracking-wider text-text-dark">
          Преди
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-bg-white/90 px-3 py-1 font-body text-[10px] uppercase tracking-wider text-text-dark">
          След
        </span>
      </div>

      {label && (
        <p className="mt-3 font-body text-sm text-text-muted">{label}</p>
      )}
    </div>
  );
}
