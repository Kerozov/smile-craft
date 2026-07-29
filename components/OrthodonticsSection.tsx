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
 * Scrollytelling сцена за ортодонтия.
 *
 * Цялата сцена е един inline SVG (без растерни изображения), за да е остра на
 * всеки екран и без фон около зъбите. Скролът разказва:
 *   криви зъби → диагностика → брекети + дъга → подреждане → готова усмивка
 */

/* ------------------------------------------------------------------ */
/*  Геометрия на зъбната дъга                                          */
/* ------------------------------------------------------------------ */

const VB_W = 620;
const VB_H = 250;
const CX = VB_W / 2;
const GUM_Y = 96; // венечна линия в центъра
const ARCH_RISE = 44; // колко се вдига дъгата към ъглите
const BRACKET_AT = 0.42; // позиция на брекета спрямо височината на зъба

type Kind = "central" | "lateral" | "canine" | "premolar";

const PLAN: { kind: Kind; w: number; h: number }[] = [
  { kind: "premolar", w: 66, h: 78 },
  { kind: "premolar", w: 70, h: 84 },
  { kind: "canine", w: 68, h: 108 },
  { kind: "lateral", w: 62, h: 88 },
  { kind: "central", w: 76, h: 104 },
  { kind: "central", w: 76, h: 104 },
  { kind: "lateral", w: 62, h: 88 },
  { kind: "canine", w: 68, h: 108 },
  { kind: "premolar", w: 70, h: 84 },
  { kind: "premolar", w: 66, h: 78 },
];

/** Разбъркано „преди“ състояние — фиксирано, за да е еднакво при всеки render */
const CHAOS = [
  { dx: 7, dy: 9, dr: 17, ds: 0.94 },
  { dx: -6, dy: -7, dr: -21, ds: 1.06 },
  { dx: 9, dy: 12, dr: 14, ds: 0.9 },
  { dx: -11, dy: -6, dr: -24, ds: 1.08 },
  { dx: 8, dy: 10, dr: 19, ds: 0.93 },
  { dx: -8, dy: -9, dr: -16, ds: 1.07 },
  { dx: 10, dy: 7, dr: 22, ds: 0.91 },
  { dx: -7, dy: 11, dr: -13, ds: 1.05 },
  { dx: 6, dy: -8, dr: 18, ds: 0.95 },
  { dx: -9, dy: 8, dr: -20, ds: 1.04 },
];

type ToothGeom = {
  kind: Kind;
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
  rot: number;
  depth: number; // 0 в центъра, 1 в краищата
};

const ARCH: ToothGeom[] = (() => {
  const n = PLAN.length;
  const half = (n - 1) / 2;

  const base = PLAN.map((p, i) => {
    const t = i - half;
    const depth = Math.abs(t) / half;
    const scale = 1 - 0.26 * Math.pow(depth, 1.4);
    const fore = 1 - 0.42 * Math.pow(depth, 1.6); // перспективно скъсяване
    return { p, t, depth, scale, pw: p.w * scale * fore };
  });

  // Подреждаме от центъра навън по проектирана ширина, за да се допират
  const xs = new Array<number>(n);
  const first = Math.ceil(half);
  for (let i = first; i < n; i++) {
    xs[i] =
      i === first
        ? CX + (base[i].pw / 2) * 0.97
        : xs[i - 1] + ((base[i - 1].pw + base[i].pw) / 2) * 0.95;
    xs[n - 1 - i] = 2 * CX - xs[i];
  }

  return base.map((b, i) => ({
    kind: b.p.kind,
    x: xs[i],
    y: GUM_Y - ARCH_RISE * Math.pow(b.depth, 1.9),
    w: b.p.w * b.scale,
    h: b.p.h * b.scale,
    scale: b.scale,
    rot: Math.sign(b.t) * 13 * Math.pow(b.depth, 1.2),
    depth: b.depth,
  }));
})();

/* ------------------------------------------------------------------ */
/*  Форми                                                              */
/* ------------------------------------------------------------------ */

/** Зъб в локални координати: (0,0) = венечна точка, +y надолу към режещия ръб */
function toothPath(kind: Kind, w: number, h: number) {
  const b = w / 2;
  const neck = b * 0.8;

  if (kind === "canine") {
    return [
      `M ${-neck} 0`,
      `C ${-b * 1.02} ${h * 0.22} ${-b} ${h * 0.5} ${-b * 0.86} ${h * 0.7}`,
      `C ${-b * 0.74} ${h * 0.86} ${-b * 0.34} ${h * 0.9} 0 ${h}`,
      `C ${b * 0.34} ${h * 0.9} ${b * 0.74} ${h * 0.86} ${b * 0.86} ${h * 0.7}`,
      `C ${b} ${h * 0.5} ${b * 1.02} ${h * 0.22} ${neck} 0`,
      "Z",
    ].join(" ");
  }

  if (kind === "premolar") {
    return [
      `M ${-neck} 0`,
      `C ${-b} ${h * 0.24} ${-b} ${h * 0.56} ${-b * 0.9} ${h * 0.76}`,
      `C ${-b * 0.82} ${h * 0.94} ${-b * 0.5} ${h} ${-b * 0.3} ${h * 0.96}`,
      `C ${-b * 0.12} ${h * 0.92} ${b * 0.12} ${h * 0.92} ${b * 0.3} ${h * 0.96}`,
      `C ${b * 0.5} ${h} ${b * 0.82} ${h * 0.94} ${b * 0.9} ${h * 0.76}`,
      `C ${b} ${h * 0.56} ${b} ${h * 0.24} ${neck} 0`,
      "Z",
    ].join(" ");
  }

  const e = b * 0.9; // режещ ръб
  return [
    `M ${-neck} 0`,
    `C ${-b} ${h * 0.2} ${-b} ${h * 0.55} ${-e} ${h * 0.82}`,
    `C ${-e * 0.99} ${h * 0.95} ${-e * 0.72} ${h} ${-e * 0.55} ${h}`,
    `C ${-e * 0.2} ${h * 1.02} ${e * 0.2} ${h * 1.02} ${e * 0.55} ${h}`,
    `C ${e * 0.72} ${h} ${e * 0.99} ${h * 0.95} ${e} ${h * 0.82}`,
    `C ${b} ${h * 0.55} ${b} ${h * 0.2} ${neck} 0`,
    "Z",
  ].join(" ");
}

/** Гладка крива през точки (Catmull-Rom → безие) */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${
      p2.x - (p3.x - p1.x) / 6
    } ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

const BRACKET_PTS = ARCH.map((t) => ({
  x: t.x,
  y: t.y + t.h * BRACKET_AT,
}));

const MID = BRACKET_PTS.length / 2;
const CENTER_PT = {
  x: (BRACKET_PTS[MID - 1].x + BRACKET_PTS[MID].x) / 2,
  y: (BRACKET_PTS[MID - 1].y + BRACKET_PTS[MID].y) / 2,
};

/** Дъгата се чертае от центъра навън — две огледални половини */
const WIRE_RIGHT = smoothPath([
  CENTER_PT,
  ...BRACKET_PTS.slice(MID),
  { x: BRACKET_PTS[BRACKET_PTS.length - 1].x + 14, y: BRACKET_PTS[BRACKET_PTS.length - 1].y + 2 },
]);
const WIRE_LEFT = smoothPath([
  CENTER_PT,
  ...BRACKET_PTS.slice(0, MID).reverse(),
  { x: BRACKET_PTS[0].x - 14, y: BRACKET_PTS[0].y + 2 },
]);

const GUM_PATH = (() => {
  const line = smoothPath(ARCH.map((t) => ({ x: t.x, y: t.y + 3 })));
  const last = ARCH[ARCH.length - 1];
  const first = ARCH[0];
  return `${line} L ${last.x + 26} ${last.y - 34} L ${first.x - 26} ${first.y - 34} Z`;
})();

/* ------------------------------------------------------------------ */
/*  Глави от разказа                                                   */
/* ------------------------------------------------------------------ */

const CHAPTERS = [
  {
    range: [0, 0.17] as const,
    kicker: "Специалност",
    title: "Ортодонтия",
    subtitle: "Усмивка с ясен план",
  },
  {
    range: [0.15, 0.32] as const,
    kicker: "Стъпка 01",
    title: "Консултация",
    subtitle: "Цели, захапка, възможности",
  },
  {
    range: [0.3, 0.48] as const,
    kicker: "Стъпка 02",
    title: "Диагностика",
    subtitle: "Дигитален план преди лечението",
  },
  {
    range: [0.46, 0.64] as const,
    kicker: "Стъпка 03",
    title: "Апаратура",
    subtitle: "Брекети или прозрачни алайнери",
  },
  {
    range: [0.62, 0.83] as const,
    kicker: "Стъпка 04",
    title: "Корекция",
    subtitle: "Зъбите се местят малко по малко",
  },
  {
    range: [0.81, 1] as const,
    kicker: "Резултат",
    title: "Равна усмивка",
    subtitle: "Готови за консултация",
  },
];

/* ------------------------------------------------------------------ */
/*  Зъб                                                                */
/* ------------------------------------------------------------------ */

function Tooth({
  index,
  progress,
  reduceMotion,
}: {
  index: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const t = ARCH[index];
  const c = CHAOS[index];
  const d = toothPath(t.kind, t.w, t.h);

  // Подреждането тече в глава „Корекция“, със стъпаловидно закъснение
  const a0 = 0.58 + index * 0.008;
  const a1 = 0.8 + index * 0.006;

  const x = useTransform(progress, [a0, a1], reduceMotion ? [0, 0] : [c.dx, 0]);
  const y = useTransform(progress, [a0, a1], reduceMotion ? [0, 0] : [c.dy, 0]);
  const rotate = useTransform(
    progress,
    [a0, a1],
    reduceMotion ? [t.rot, t.rot] : [t.rot + c.dr, t.rot]
  );
  const scale = useTransform(
    progress,
    [a0, a1],
    reduceMotion ? [1, 1] : [c.ds, 1]
  );

  // Брекетът се появява в глава „Апаратура“ и отпада в „Резултат“
  const bracketOpacity = useTransform(
    progress,
    [0.47 + index * 0.006, 0.57 + index * 0.006, 0.88, 0.94],
    reduceMotion ? [0, 0, 0, 0] : [0, 1, 1, 0]
  );

  const bw = 15 * t.scale;
  const bh = 12.5 * t.scale;

  return (
    <g transform={`translate(${t.x} ${t.y})`}>
      <motion.g style={{ x, y, rotate, scale }}>
        <g clipPath={`url(#tooth-clip-${index})`}>
          <path d={d} fill="url(#enamel)" />
          {/* прозрачност към режещия ръб */}
          <rect
            x={-t.w}
            y={t.h * 0.68}
            width={t.w * 2}
            height={t.h * 0.5}
            fill="url(#incisal)"
          />
          {/* мека сянка при шийката, за да седи под венеца */}
          <rect
            x={-t.w}
            y={-t.h * 0.2}
            width={t.w * 2}
            height={t.h * 0.34}
            fill="url(#neckShade)"
          />
          {/* блик */}
          <ellipse
            cx={-t.w * 0.19}
            cy={t.h * 0.32}
            rx={t.w * 0.11}
            ry={t.h * 0.19}
            fill="#ffffff"
            opacity={0.7}
            transform={`rotate(-8 ${-t.w * 0.19} ${t.h * 0.32})`}
          />
        </g>

        <path
          d={d}
          fill="none"
          stroke="#9A7B55"
          strokeOpacity={0.26}
          strokeWidth={1.1 * t.scale}
        />

        <clipPath id={`tooth-clip-${index}`}>
          <path d={d} />
        </clipPath>

        {/* Брекет */}
        <motion.g
          style={{ opacity: bracketOpacity }}
          transform={`translate(0 ${t.h * BRACKET_AT})`}
        >
          {/* крилца */}
          <rect
            x={-bw * 0.78}
            y={-bh * 0.3}
            width={bw * 1.56}
            height={bh * 0.6}
            rx={bh * 0.3}
            fill="#D9C6A8"
            opacity={0.85}
          />
          <rect
            x={-bw / 2}
            y={-bh / 2}
            width={bw}
            height={bh}
            rx={bw * 0.22}
            fill="url(#metal)"
            stroke="#8A6E4C"
            strokeWidth={0.8}
          />
          {/* слот за дъгата */}
          <rect
            x={-bw / 2}
            y={-bh * 0.1}
            width={bw}
            height={bh * 0.2}
            fill="#6E573A"
            opacity={0.55}
          />
        </motion.g>
      </motion.g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Сцена                                                              */
/* ------------------------------------------------------------------ */

function SmileStage({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const still = reduceMotion;

  // Спокойно „камерно“ движение — без орбитиране, само лек zoom
  const camScale = useTransform(
    progress,
    [0, 0.3, 0.62, 0.85, 1],
    still ? [1, 1, 1, 1, 1] : [0.9, 0.97, 1.06, 1.02, 1]
  );
  const camY = useTransform(
    progress,
    [0, 0.5, 1],
    still ? [0, 0, 0] : [14, 0, -6]
  );

  const gumOpacity = useTransform(
    progress,
    [0.5, 0.72],
    still ? [0.9, 0.9] : [0.35, 0.9]
  );

  // Диагностика: сканиращ лъч + пунктирана целева дъга
  const scanY = useTransform(progress, [0.3, 0.48], [30, 210]);
  const scanOpacity = useTransform(
    progress,
    [0.3, 0.35, 0.44, 0.48],
    still ? [0, 0, 0, 0] : [0, 1, 1, 0]
  );
  const targetOpacity = useTransform(
    progress,
    [0.32, 0.4, 0.52, 0.58],
    still ? [0, 0, 0, 0] : [0, 0.75, 0.75, 0]
  );

  // Дъга (телта)
  const wireDraw = useTransform(progress, [0.52, 0.68], [0, 1]);
  const wireOpacity = useTransform(
    progress,
    [0.52, 0.56, 0.88, 0.94],
    still ? [0, 0, 0, 0] : [0, 1, 1, 0]
  );

  const glow = useTransform(progress, [0.8, 1], [0, 0.75]);
  const sparkle = useTransform(progress, [0.88, 0.96], [0, 1]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46vmin] w-[74vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,149,106,0.35),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />

      <motion.svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="relative w-[94%] max-w-5xl will-change-transform"
        style={{ scale: camScale, y: camY }}
        role="img"
        aria-label="Илюстрация: криви зъби се подреждат с брекети до равна усмивка"
      >
        <defs>
          <linearGradient id="enamel" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FCF8F1" />
            <stop offset="100%" stopColor="#EEE3D2" />
          </linearGradient>
          <linearGradient id="incisal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9CBD4" stopOpacity="0" />
            <stop offset="100%" stopColor="#B7BCC9" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="neckShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9A7B55" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#9A7B55" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#FBF5EA" />
            <stop offset="50%" stopColor="#E4D5BC" />
            <stop offset="100%" stopColor="#C2A87F" />
          </linearGradient>
          <linearGradient id="gum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E4A79C" />
            <stop offset="100%" stopColor="#F0C8BF" />
          </linearGradient>
          <linearGradient id="wire" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9A7B55" stopOpacity="0.35" />
            <stop offset="18%" stopColor="#B8956A" />
            <stop offset="82%" stopColor="#B8956A" />
            <stop offset="100%" stopColor="#9A7B55" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B8956A" stopOpacity="0" />
            <stop offset="50%" stopColor="#B8956A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#B8956A" stopOpacity="0" />
          </linearGradient>
          <filter id="soften" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="4"
              floodColor="#6B573F"
              floodOpacity="0.16"
            />
          </filter>
        </defs>

        {/* Венец */}
        <motion.path
          d={GUM_PATH}
          fill="url(#gum)"
          filter="url(#soften)"
          style={{ opacity: gumOpacity }}
        />

        {/* Целева дъга по време на диагностиката */}
        <motion.path
          d={`${WIRE_LEFT} ${WIRE_RIGHT}`}
          fill="none"
          stroke="#B8956A"
          strokeWidth={1.4}
          strokeDasharray="5 6"
          strokeLinecap="round"
          style={{ opacity: targetOpacity }}
        />

        {/* Зъби — страничните се рисуват първи, за да са отзад */}
        <g filter="url(#dropShadow)">
          {ARCH.map((_, i) => i)
            .sort((a, b) => ARCH[b].depth - ARCH[a].depth)
            .map((i) => (
              <Tooth
                key={i}
                index={i}
                progress={progress}
                reduceMotion={reduceMotion}
              />
            ))}
        </g>

        {/* Ортодонтска дъга — чертае се от центъра навън */}
        <motion.g style={{ opacity: wireOpacity }}>
          <motion.path
            d={WIRE_LEFT}
            fill="none"
            stroke="url(#wire)"
            strokeWidth={3.2}
            strokeLinecap="round"
            style={{ pathLength: wireDraw }}
          />
          <motion.path
            d={WIRE_RIGHT}
            fill="none"
            stroke="url(#wire)"
            strokeWidth={3.2}
            strokeLinecap="round"
            style={{ pathLength: wireDraw }}
          />
        </motion.g>

        {/* Сканиращ лъч */}
        <motion.g style={{ opacity: scanOpacity, y: scanY }}>
          <rect x={40} y={-1} width={VB_W - 80} height={2} fill="url(#scan)" />
          <rect
            x={40}
            y={-9}
            width={VB_W - 80}
            height={18}
            fill="url(#scan)"
            opacity={0.18}
          />
        </motion.g>

        {/* Финален блясък */}
        <motion.g style={{ opacity: sparkle }}>
          {[
            { x: CX - 62, y: 178, s: 9 },
            { x: CX + 40, y: 190, s: 7 },
            { x: CX + 128, y: 158, s: 6 },
          ].map((p, i) => (
            <path
              key={i}
              d={`M ${p.x} ${p.y - p.s} Q ${p.x + p.s * 0.18} ${p.y - p.s * 0.18} ${
                p.x + p.s
              } ${p.y} Q ${p.x + p.s * 0.18} ${p.y + p.s * 0.18} ${p.x} ${
                p.y + p.s
              } Q ${p.x - p.s * 0.18} ${p.y + p.s * 0.18} ${p.x - p.s} ${p.y} Q ${
                p.x - p.s * 0.18
              } ${p.y - p.s * 0.18} ${p.x} ${p.y - p.s} Z`}
              fill="#FFFFFF"
            />
          ))}
        </motion.g>
      </motion.svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Текст                                                              */
/* ------------------------------------------------------------------ */

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
    [a, a + 0.035, mid, b - 0.035, b],
    reduceMotion ? [1, 1, 1, 1, 1] : [0, 1, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [a, mid, b],
    reduceMotion ? [0, 0, 0] : [26, 0, -14]
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

function ChapterCta({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const opacity = useTransform(
    progress,
    [0.87, 0.94],
    reduceMotion ? [1, 1] : [0, 1]
  );
  const y = useTransform(
    progress,
    [0.87, 0.94],
    reduceMotion ? [0, 0] : [20, 0]
  );

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

function StateLabel({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const beforeOp = useTransform(
    progress,
    [0.5, 0.62],
    reduceMotion ? [0, 0] : [1, 0]
  );
  const afterOp = useTransform(
    progress,
    [0.82, 0.92],
    reduceMotion ? [0, 0] : [0, 1]
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-offset)+2rem)] z-20 flex justify-center">
      <div className="relative h-4">
        <motion.span
          style={{ opacity: beforeOp }}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-[11px] uppercase tracking-[0.4em] text-text-muted"
        >
          Преди
        </motion.span>
        <motion.span
          style={{ opacity: afterOp }}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-[11px] uppercase tracking-[0.4em] text-beige-primary"
        >
          След
        </motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function OrthodonticsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = !!shouldReduceMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 500 : 110,
    damping: reduceMotion ? 60 : 30,
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
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f1ea] via-bg-cream to-[#ebe4da]" />

        {/* Прогрес */}
        <div className="absolute left-0 right-0 top-[var(--header-offset)] z-30 h-[2px] bg-beige-pale/60">
          <motion.div
            className="h-full origin-left bg-beige-primary"
            style={{ scaleX: barScale }}
          />
        </div>

        <div className="relative h-full pt-[var(--header-offset)]">
          <SmileStage progress={smooth} reduceMotion={reduceMotion} />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-12 md:pb-14 lg:px-16">
            <div className="relative mx-auto max-w-7xl">
              <div className="relative min-h-[7.5rem] max-w-xl">
                {CHAPTERS.map((ch) => (
                  <ChapterText
                    key={ch.title}
                    chapter={ch}
                    progress={smooth}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
              <ChapterCta progress={smooth} reduceMotion={reduceMotion} />
            </div>
          </div>
        </div>

        <StateLabel progress={smooth} reduceMotion={reduceMotion} />

        <p className="pointer-events-none absolute right-6 top-[calc(var(--header-offset)+1rem)] z-30 hidden font-body text-[10px] uppercase tracking-[0.3em] text-text-muted/70 md:block">
          Скролнете
        </p>
      </div>
    </section>
  );
}
