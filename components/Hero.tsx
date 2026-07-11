"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const headlineWords = ["Усмивка,", "на", "която", "можеш", "да", "разчиташ"];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const wordVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: i * 0.08,
      },
    }),
  };

  return (
    <section className="relative flex min-h-[calc(100dvh-var(--header-offset))] items-center justify-center overflow-hidden bg-bg-cream px-6 py-12 md:px-12 lg:px-20">
      {/* Soft decorative blob */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-beige-pale/60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="eyebrow-label">Пловдив · Рудозем · Девин</p>

        <h1 className="mt-6 font-display text-4xl font-normal leading-tight text-text-dark md:text-5xl lg:text-6xl">
          {headlineWords.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-text-muted md:text-xl"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        >
          Д-р Ани Овардова и екипът ѝ се грижат за зъбите на пациенти в
          Пловдив, Рудозем и Девин с внимание, спокойствие и модерни методи на
          лечение
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
        >
          <Link href="/zapazi-chas" className="btn-primary mt-10">
            Запази час
          </Link>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 h-px max-w-xs origin-left bg-beige-primary/40"
          initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
