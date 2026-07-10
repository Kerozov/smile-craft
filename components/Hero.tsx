"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const headlineWords = ["Прецизност,", "поднесена", "като", "изкуство"];

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-dark px-6 pt-24 md:px-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,161,92,0.15)_0%,transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
          Пловдив / Рудозем / Девин
        </p>

        <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-text-light md:text-6xl lg:text-7xl">
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
          className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-text-light/75 md:text-xl"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          Д-р Ани Овардова създава усмивки в Пловдив, Рудозем и Девин с
          занаятчийско внимание към всеки детайл
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.55 }}
        >
          <Link
            href="/zapazi-chas"
            className="mt-10 inline-block rounded-sm bg-accent-gold px-8 py-4 font-body text-sm font-medium tracking-wide text-bg-dark transition-colors hover:bg-accent-gold/90"
          >
            Запази час
          </Link>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 h-px max-w-xs origin-left bg-accent-gold"
          initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
