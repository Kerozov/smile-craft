"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Go2-style scrollytelling:
 * - one full-viewport sticky stage
 * - visual scrubbed by scroll (zoom / orbit / morph)
 * - chapter text overlays crossfade (bottom-left)
 * - scroll up reverses everything
 */

const TEETH = 8;

const CHAOS = [
  { r: -38, y: 56, x: -42 },
  { r: 34, y: -48, x: 38 },
  { r: -28, y: 62, x: 18 },
  { r: 40, y: -54, x: -28 },
  { r: -32, y: 50, x: 44 },
  { r: 26, y: -40, x: -46 },
  { r: -36, y: 58, x: 30 },
  { r: 30, y: -52, x: -14 },
];

const CHAPTERS = [
  {
    range: [0, 0.18] as const,
    kicker: "Специалност",
    title: "Ортодонтия",
    subtitle: "Усмивка с ясен план",
  },
  {
    range: [0.16, 0.34] as const,
    kicker: "Стъпка 01",
    title: "Консултация",
    subtitle: "Цели, захапка, възможности",
  },
  {
    range: [0.32, 0.5] as const,
    kicker: "Стъпка 02",
    title: "Диагностика",
    subtitle: "Дигитален план преди лечението",
  },
  {
    range: [0.48, 0.66] as const,
    kicker: "Стъпка 03",
    title: "Апаратура",
    subtitle: "Брекети или прозрачни алайнери",
  },
  {
    range: [0.64, 0.82] as const,
    kicker: "Стъпка 04",
    title: "Корекция",
    subtitle: "Зъбите се местят малко по малко",
  },
  {
    range: [0.8, 1] as const,
    kicker: "Резултат",
    title: "Равна усмивка",
    subtitle: "Готови за консултация",
  },
];

/** Width scale across the arch for natural smile rhythm */
const TOOTH_SCALE = [0.9, 0.82, 1, 1.08, 1.08, 1, 0.82, 0.9];

function Tooth({
  index,
  progress,
  reduceMotion,
}: {
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const c = CHAOS[index];
  const a0 = 0.12 + index * 0.07;
  const a1 = 0.55 + index * 0.05;
  const size = TOOTH_SCALE[index];

  const rotate = useTransform(
    progress,
    [a0, a1],
    reduceMotion ? [0, 0] : [c.r, 0]
  );
  const y = useTransform(progress, [a0, a1], reduceMotion ? [0, 0] : [c.y, 0]);
  const x = useTransform(progress, [a0, a1], reduceMotion ? [0, 0] : [c.x, 0]);
  const scale = useTransform(
    progress,
    [a0, a1],
    reduceMotion ? [size, size] : [size * 0.72, size]
  );

  const bracketOp = useTransform(
    progress,
    [0.38 + index * 0.035, 0.52 + index * 0.03],
    reduceMotion ? [1, 1] : [0, 1]
  );

  return (
    <motion.div
      className="relative flex flex-col items-center will-change-transform"
      style={{ rotate, x, y, scale }}
    >
      <div className="relative h-40 w-[4.5rem] md:h-48 md:w-[5.5rem] xl:h-56 xl:w-24">
        {/* Perfect classic tooth pictogram */}
        <img
          // TODO: replace with real photo / custom illustration if needed
          src="/orthodontics/tooth.png"
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full object-contain select-none"
        />

        {/* Orthodontic bracket on crown */}
        <motion.div
          style={{ opacity: bracketOp }}
          className="absolute left-1/2 top-[32%] z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] border-[1.5px] border-[#7a6144] bg-beige-primary shadow-[0_0_14px_rgba(184,149,106,0.55)] md:h-[22px] md:w-[22px]"
        >
          <div className="h-2 w-2 rounded-[1px] bg-[#f6ecde]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ChapterText({
  chapter,
  progress,
  reduceMotion,
}: {
  chapter: (typeof CHAPTERS)[number];
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const [a, b] = chapter.range;
  const mid = (a + b) / 2;
  const opacity = useTransform(
    progress,
    [a, a + 0.04, mid, b - 0.04, b],
    reduceMotion ? [1, 1, 1, 1, 1] : [0, 1, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [a, mid, b],
    reduceMotion ? [0, 0, 0] : [28, 0, -16]
  );

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0">
      <p className="font-body text-xs font-medium uppercase tracking-[0.35em] text-beige-primary md:text-sm">
        {chapter.kicker}
      </p>
      <h2 className="mt-2 font-display text-4xl font-normal text-text-dark md:text-5xl lg:text-6xl">
        {chapter.title}
      </h2>
      <p className="mt-2 font-body text-base text-text-muted md:text-lg">
        {chapter.subtitle}
      </p>
    </motion.div>
  );
}

function ChapterOverlay({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-12 md:pb-14 lg:px-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="relative min-h-[7.5rem] max-w-xl">
          {CHAPTERS.map((ch) => (
            <ChapterText
              key={ch.title}
              chapter={ch}
              progress={progress}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
        <ChapterCta progress={progress} reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}

function ChapterCta({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const opacity = useTransform(
    progress,
    [0.86, 0.93],
    reduceMotion ? [1, 1] : [0, 1]
  );
  const y = useTransform(progress, [0.86, 0.93], reduceMotion ? [0, 0] : [20, 0]);

  return (
    <motion.div style={{ opacity, y }} className="pointer-events-auto mt-8">
      <Link
        href="/zapazi-chas?service=orthodontics"
        className="btn-primary inline-flex items-center gap-2"
      >
        Запиши ортодонтска консултация
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

function SmileStage({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  // Camera-like moves (Go2 orbit/zoom feel)
  const camRotateY = useTransform(
    progress,
    [0, 0.25, 0.55, 0.85, 1],
    reduceMotion ? [0, 0, 0, 0, 0] : [-26, -10, 8, 16, 0]
  );
  const camRotateX = useTransform(
    progress,
    [0, 0.4, 1],
    reduceMotion ? [0, 0, 0] : [12, 4, 0]
  );
  const camScale = useTransform(
    progress,
    [0, 0.2, 0.55, 0.85, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.72, 0.88, 1.12, 1.28, 1.05]
  );
  const camX = useTransform(
    progress,
    [0, 0.35, 0.7, 1],
    reduceMotion ? [0, 0, 0, 0] : [40, 10, -30, 0]
  );
  const camY = useTransform(
    progress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [30, -10, 0]
  );

  const wireOp = useTransform(progress, [0.42, 0.58], [0, 1]);
  const wireScale = useTransform(progress, [0.42, 0.78], [0.08, 1]);
  const glow = useTransform(progress, [0.55, 0.9], [0.15, 0.7]);
  const beforeOp = useTransform(progress, [0, 0.2, 0.35], [1, 0.5, 0]);
  const afterOp = useTransform(progress, [0.65, 0.82, 1], [0, 0.9, 1]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Atmospheric depth */}
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-[42%] h-[55vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,149,106,0.45),transparent_68%)] blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(247,244,239,0.85)_75%)]"
        aria-hidden="true"
      />

      <motion.div
        className="relative will-change-transform"
        style={{
          rotateY: camRotateY,
          rotateX: camRotateX,
          scale: camScale,
          x: camX,
          y: camY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative mb-8 flex h-5 justify-center">
          <motion.span
            style={{ opacity: beforeOp }}
            className="absolute font-body text-[11px] uppercase tracking-[0.4em] text-text-muted"
          >
            Преди
          </motion.span>
          <motion.span
            style={{ opacity: afterOp }}
            className="absolute font-body text-[11px] uppercase tracking-[0.4em] text-beige-primary"
          >
            След
          </motion.span>
        </div>

        <div
          className="relative flex items-end justify-center gap-1.5 md:gap-2.5"
          aria-hidden="true"
        >
          <div className="pointer-events-none absolute top-[12%] left-1/2 h-10 w-[100%] -translate-x-1/2 rounded-[100%] bg-[#efd0c8]/35 blur-[2px]" />

          {Array.from({ length: TEETH }).map((_, i) => (
            <Tooth
              key={i}
              index={i}
              progress={progress}
              reduceMotion={reduceMotion}
            />
          ))}

          <motion.div
            style={{ opacity: wireOp, scaleX: wireScale }}
            className="pointer-events-none absolute left-1/2 top-[34%] z-30 h-[3px] w-[94%] origin-center -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-beige-deep to-transparent shadow-[0_0_16px_rgba(154,123,85,0.55)]"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function OrthodonticsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: shouldReduceMotion ? 500 : 100,
    damping: shouldReduceMotion ? 60 : 28,
    mass: 0.25,
  });

  const barScale = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg-cream"
      style={{ height: "450vh" }}
      aria-label="Ортодонтия — scroll сцена"
    >
      {/* Sticky full-bleed stage — like Unitree Go2 */}
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3eee6] via-bg-cream to-[#ebe4da]" />

        {/* Progress line */}
        <div className="absolute left-0 right-0 top-[var(--header-offset)] z-30 h-[2px] bg-beige-pale/60">
          <motion.div
            className="h-full origin-left bg-beige-primary"
            style={{ scaleX: barScale }}
          />
        </div>

        <div className="relative h-full pt-[var(--header-offset)]">
          <SmileStage
            progress={smooth}
            reduceMotion={!!shouldReduceMotion}
          />
          <ChapterOverlay
            progress={smooth}
            reduceMotion={!!shouldReduceMotion}
          />
        </div>

        <p className="pointer-events-none absolute right-6 top-[calc(var(--header-offset)+1rem)] z-30 hidden font-body text-[10px] uppercase tracking-[0.3em] text-text-muted/70 md:block">
          Скролнете
        </p>
      </div>
    </section>
  );
}
