"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import CityLinks from "@/components/CityLinks";
import MagneticButton from "@/components/ui/MagneticButton";
import { hasWebGL, isSmallScreen, useCanvasVisibility, whenIdle } from "@/components/three/useCanvasVisibility";
import { siteConfig } from "@/lib/utils";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

const line1 = ["Усмивка,", "на", "която"];
const line2 = ["можеш", "да"];

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: `${siteConfig.established}`, label: "година на основаване" },
  { value: "3", label: "кабинета в Родопите и Пловдив" },
  { value: "6", label: "направления на лечение" },
];

export default function Hero() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const visible = useCanvasVisibility(stageRef, "0px");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [quality, setQuality] = useState<"high" | "low">("high");

  const [mount3d, setMount3d] = useState(false);
  const [ready3d, setReady3d] = useState(false);
  const onReady = useCallback(() => setReady3d(true), []);

  useEffect(() => {
    setWebgl(hasWebGL());
    setQuality(isSmallScreen() ? "low" : "high");
    // 3D сцената стартира чак след като началната анимация на текста приключи
    // и браузърът е свободен — така отварянето е гладко
    let cancelIdle = () => {};
    const t = window.setTimeout(() => {
      cancelIdle = whenIdle(() => setMount3d(true), 600);
    }, 1500);
    return () => {
      window.clearTimeout(t);
      cancelIdle();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const word = (i: number) => ({
    initial: { y: reduce ? 0 : "110%", opacity: reduce ? 0 : 1 },
    animate: { y: "0%", opacity: 1 },
    transition: { duration: 1.1, ease, delay: 0.15 + i * 0.07 },
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden bg-ivory"
    >
      {/* Светъл, многослоен фон */}
      <div className="hero-aura pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden="true" />

      {/* 3D сцена */}
      <div
        ref={stageRef}
        className="absolute inset-x-0 top-[7svh] h-[46svh] md:inset-y-0 md:left-auto md:right-0 md:top-0 md:h-full md:w-[58%]"
        aria-hidden="true"
      >
        {webgl && mount3d && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
            animate={ready3d ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduce ? 1 : 0.92 }}
            transition={{ duration: 1.4, ease }}
          >
            <HeroScene reduceMotion={reduce} active={visible} quality={quality} onReady={onReady} />
          </motion.div>
        )}
        {webgl === false && (
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#efe4d4_60%,transparent_72%)] shadow-glow" />
        )}
      </div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative mx-auto flex min-h-[100svh] max-w-[88rem] flex-col px-5 pb-12 pt-[50svh] sm:px-8 md:justify-center md:pb-24 md:pt-[calc(var(--header-offset)+1rem)] lg:px-12"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="glass-pill hidden items-center gap-3 px-4 py-2 md:inline-flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <CityLinks
              className="!justify-start"
              linkClassName="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft hover:text-gold-deep"
            />
          </motion.div>

          <h1 className="font-display md:mt-7 text-[clamp(2.7rem,9vw,7.4rem)] font-normal leading-[0.95] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              {line1.map((w, i) => (
                <motion.span key={w} {...word(i)} className="mr-[0.22em] inline-block">
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              {line2.map((w, i) => (
                <motion.span key={w} {...word(i + 3)} className="mr-[0.22em] inline-block">
                  {w}
                </motion.span>
              ))}
              <motion.span
                {...word(5)}
                className="text-gold-gradient inline-block italic"
              >
                разчиташ
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="mt-7 max-w-xl font-body text-base leading-relaxed text-ink-soft md:text-lg"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.7 }}
          >
            {siteConfig.doctor} и екипът ѝ съчетават прецизна ортодонтия,
            естетика и спокойна грижа — в{" "}
            <Link href="/plovdiv" className="link-underline text-ink">Пловдив</Link>,{" "}
            <Link href="/rudozem" className="link-underline text-ink">Рудозем</Link> и{" "}
            <Link href="/devin" className="link-underline text-ink">Девин</Link>.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
          >
            <MagneticButton href="/zapazi-chas" className="btn-primary">
              Запази час
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>
            <Link href="/rezultati" className="btn-ghost">
              Виж резултатите
            </Link>
          </motion.div>
        </div>

        <motion.dl
          className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-ink/10 pt-6 md:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl text-ink md:text-4xl">{s.value}</dd>
              <dd className="mt-1 font-body text-[11px] leading-snug text-ink-muted md:text-xs">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.a
        href="#ortodontiya"
        className="absolute bottom-8 right-8 hidden items-center gap-3 font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-muted transition-colors hover:text-gold-deep md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        Скролнете
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 backdrop-blur">
          <ArrowDown className="h-4 w-4 animate-bounce-slow motion-reduce:animate-none" aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  );
}
