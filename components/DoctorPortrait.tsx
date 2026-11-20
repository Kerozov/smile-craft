"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { doctorPhoto, siteConfig } from "@/lib/utils";

/** Портрет с паралакс. Без снимка показва монограм в стила на бранда. */
export default function DoctorPortrait({ priority = false }: { priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);
  const badgeY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);

  return (
    <div ref={ref} className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-white via-cream to-sand shadow-card">
        <motion.div style={{ y }} className="absolute inset-[-40px]">
          {doctorPhoto ? (
            <Image
              src={doctorPhoto}
              alt={`${siteConfig.doctor} — основател на Smile Craft`}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center" role="img" aria-label={`${siteConfig.doctor} — монограм`}>
              <div className="absolute h-[70%] w-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,1),rgba(255,255,255,0)_70%)]" />
              <div className="absolute h-[62%] w-[62%] rounded-full border border-gold/25" />
              <div className="absolute h-[48%] w-[48%] rounded-full border border-gold/15" />
              <span className="text-gold-gradient relative font-display text-[clamp(6rem,14vw,11rem)] italic leading-none">
                АО
              </span>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        style={{ y: badgeY }}
        className="glass-card absolute -bottom-6 left-4 max-w-[16rem] p-5 sm:-left-6 md:p-6"
      >
        <p className="font-display text-4xl text-ink">10+</p>
        <p className="mt-1 font-body text-xs leading-snug text-ink-soft">
          години опит и постоянно обучение в съвременни методи
        </p>
      </motion.div>
    </div>
  );
}
