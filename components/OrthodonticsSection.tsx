"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SmileStageSvg from "@/components/OrthodonticsSvgStage";
import { hasWebGL, isSmallScreen, useCanvasVisibility } from "@/components/three/useCanvasVisibility";

const ArchScene = dynamic(() => import("@/components/three/ArchScene"), { ssr: false });

/**
 * Scrollytelling за ортодонтия — в истинско 3D.
 * Скролът движи камерата около зъбната дъга и разказва:
 *   криви зъби → диагностика → брекети + дъга → подреждане → равна усмивка
 */

const CHAPTERS = [
  {
    range: [0, 0.17] as const,
    kicker: "Специалност",
    title: "Ортодонтия",
    subtitle: "Усмивка с ясен план — от първата консултация до последния ден с брекети.",
  },
  {
    range: [0.15, 0.3] as const,
    kicker: "Стъпка 01",
    title: "Консултация",
    subtitle: "Говорим за целите ви, оглеждаме захапката и възможностите.",
  },
  {
    range: [0.28, 0.48] as const,
    kicker: "Стъпка 02",
    title: "Диагностика",
    subtitle: "Дигитален план на идеалната дъга — преди да започне лечението.",
  },
  {
    range: [0.46, 0.62] as const,
    kicker: "Стъпка 03",
    title: "Апаратура",
    subtitle: "Брекети или прозрачни алайнери — според вашия случай.",
  },
  {
    range: [0.6, 0.83] as const,
    kicker: "Стъпка 04",
    title: "Корекция",
    subtitle: "Зъбите се местят малко по малко към планираната позиция.",
  },
  {
    range: [0.81, 1] as const,
    kicker: "Резултат",
    title: "Равна усмивка",
    subtitle: "Здрава захапка и усмивка, която носите с увереност.",
  },
];

function ChapterText({
  chapter,
  index,
  progress,
  reduceMotion,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const [a, b] = chapter.range;
  const mid = (a + b) / 2;
  const first = index === 0;
  const last = index === CHAPTERS.length - 1;
  const opacity = useTransform(
    progress,
    [a, a + 0.03, mid, b - 0.03, b],
    reduceMotion
      ? first ? [1, 1, 1, 0, 0] : [0, 0, 0, 0, 0]
      : [first ? 1 : 0, 1, 1, 1, last ? 1 : 0]
  );
  const y = useTransform(progress, [a, mid, b], reduceMotion ? [0, 0, 0] : [first ? 0 : 40, 0, last ? 0 : -30]);
  const blur = useTransform(
    progress,
    [a, a + 0.03, b - 0.03, b],
    reduceMotion ? ["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"] : [first ? "blur(0px)" : "blur(8px)", "blur(0px)", "blur(0px)", last ? "blur(0px)" : "blur(8px)"]
  );

  return (
    <motion.div style={{ opacity, y, filter: blur }} className="absolute inset-x-0 bottom-0">
      <p className="flex items-center gap-3 font-body text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-deep">
        <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
        {chapter.kicker}
      </p>
      <h2 className="mt-3 font-display text-[clamp(2.6rem,7vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.02em] text-ink">
        {chapter.title}
      </h2>
      <p className="mt-4 max-w-md font-body text-base leading-relaxed text-ink-soft md:text-lg">
        {chapter.subtitle}
      </p>
    </motion.div>
  );
}

function ChapterRail({ progress }: { progress: MotionValue<number> }) {
  return (
    <ol className="pointer-events-none absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:right-10" aria-hidden="true">
      {CHAPTERS.map((ch) => (
        <RailDot key={ch.title} chapter={ch} progress={progress} />
      ))}
    </ol>
  );
}

function RailDot({ chapter, progress }: { chapter: (typeof CHAPTERS)[number]; progress: MotionValue<number> }) {
  const [a, b] = chapter.range;
  const active = useTransform(progress, [a - 0.001, a, b - 0.02, b], [0, 1, 1, 0]);
  const width = useTransform(active, [0, 1], [12, 40]);
  const color = useTransform(active, [0, 1], ["rgba(42,36,33,0.18)", "rgba(184,149,106,1)"]);
  const labelOpacity = useTransform(active, [0, 1], [0, 1]);
  return (
    <li className="flex items-center justify-end gap-3">
      <motion.span style={{ opacity: labelOpacity }} className="font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
        {chapter.title}
      </motion.span>
      <motion.span style={{ width, backgroundColor: color }} className="h-[2px] rounded-full" />
    </li>
  );
}

function ChapterCta({ progress, reduceMotion }: { progress: MotionValue<number>; reduceMotion: boolean }) {
  const opacity = useTransform(progress, [0.87, 0.93], reduceMotion ? [1, 1] : [0, 1]);
  const y = useTransform(progress, [0.87, 0.93], reduceMotion ? [0, 0] : [20, 0]);
  const pointerEvents = useTransform(opacity, (v) => (v > 0.5 ? "auto" : "none"));

  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="mt-8">
      <Link href="/zapazi-chas?service=orthodontics" className="btn-primary">
        Запиши ортодонтска консултация
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

function StateBadge({ progress, reduceMotion }: { progress: MotionValue<number>; reduceMotion: boolean }) {
  const beforeOp = useTransform(progress, [0.55, 0.65], reduceMotion ? [0, 0] : [1, 0]);
  const afterOp = useTransform(progress, [0.8, 0.88], reduceMotion ? [1, 1] : [0, 1]);
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-offset)+1.75rem)] z-20 flex justify-center">
      <div className="glass-pill relative h-9 w-28">
        <motion.span style={{ opacity: beforeOp }} className="absolute inset-0 flex items-center justify-center font-body text-[10px] font-semibold uppercase tracking-[0.4em] text-ink-muted">
          Преди
        </motion.span>
        <motion.span style={{ opacity: afterOp }} className="absolute inset-0 flex items-center justify-center font-body text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-deep">
          След
        </motion.span>
      </div>
    </div>
  );
}

export default function OrthodonticsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = !!useReducedMotion();
  const visible = useCanvasVisibility(stageRef, "100px");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    setWebgl(hasWebGL());
    setQuality(isSmallScreen() ? "low" : "high");
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 500 : 120,
    damping: reduceMotion ? 60 : 30,
    mass: 0.3,
  });

  const barScale = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section
      id="ortodontiya"
      ref={sectionRef}
      className="relative h-[420vh] bg-ivory"
      aria-label="Ортодонтия — от криви зъби до равна усмивка"
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="ortho-aura absolute inset-0" aria-hidden="true" />
        <div className="grid-lines absolute inset-0 opacity-40" aria-hidden="true" />

        {/* Прогрес */}
        <div className="absolute inset-x-0 top-[var(--header-offset)] z-30 h-px bg-ink/5">
          <motion.div className="h-full origin-left bg-gradient-to-r from-gold-light via-gold to-gold-deep" style={{ scaleX: barScale }} />
        </div>

        <div className="absolute inset-0 pt-[var(--header-offset)]">
          <div className="relative h-[66%] w-full md:h-[88%]">
            {webgl && (
              <ArchScene progress={smooth} reduceMotion={reduceMotion} active={visible} quality={quality} />
            )}
            {webgl === false && <SmileStageSvg progress={smooth} reduceMotion={reduceMotion} />}
          </div>
        </div>

        <StateBadge progress={smooth} reduceMotion={reduceMotion} />
        <ChapterRail progress={smooth} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ivory via-ivory/90 to-transparent px-5 pb-10 pt-12 sm:px-8 md:bg-none md:pb-14 lg:px-12">
          <div className="relative mx-auto max-w-[88rem]">
            <div className="relative min-h-[11rem] max-w-xl md:min-h-[13rem]">
              {CHAPTERS.map((ch, i) => (
                <ChapterText key={ch.title} chapter={ch} index={i} progress={smooth} reduceMotion={reduceMotion} />
              ))}
            </div>
            <ChapterCta progress={smooth} reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </section>
  );
}
