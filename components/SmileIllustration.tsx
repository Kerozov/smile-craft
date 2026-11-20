import type { ResultCategory } from "@/lib/utils";

/**
 * Векторна илюстрация „преди / след“ — показва се, докато няма реални снимки
 * на пациенти. Всяка категория показва различен проблем:
 *   ортодонтия → криви зъби, избелване → потъмнял цвят,
 *   импланти → липсващ зъб, естетика → неравни/отчупени ръбове.
 */

const TEETH = [
  { w: 34, h: 70 }, // премолар
  { w: 40, h: 84 }, // кучешки
  { w: 38, h: 82 }, // страничен резец
  { w: 50, h: 96 }, // централен резец
  { w: 50, h: 96 },
  { w: 38, h: 82 },
  { w: 40, h: 84 },
  { w: 34, h: 70 },
];

/** Детерминиран псевдо-случаен генератор (еднакъв на сървъра и в браузъра) */
function rand(seed: number) {
  let t = (seed * 2654435761) >>> 0;
  t ^= t >>> 15;
  t = Math.imul(t, 2246822519) >>> 0;
  t ^= t >>> 13;
  return (t % 10000) / 10000;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

function toothPath(w: number, h: number, chip = 0) {
  const r = w * 0.32;
  const top = 0;
  const bottom = h - chip;
  return [
    `M ${-w / 2 + 3} ${top}`,
    `L ${w / 2 - 3} ${top}`,
    `C ${w / 2 + 1} ${h * 0.35} ${w / 2} ${bottom - r} ${w / 2 - r * 0.35} ${bottom - r * 0.2}`,
    `Q ${w / 2 - r * 0.6} ${bottom} ${w / 2 - r} ${bottom}`,
    `L ${-w / 2 + r} ${h}`,
    `Q ${-w / 2 + r * 0.6} ${h} ${-w / 2 + r * 0.35} ${h - r * 0.2}`,
    `C ${-w / 2} ${h - r} ${-w / 2 - 1} ${h * 0.35} ${-w / 2 + 3} ${top}`,
    "Z",
  ].join(" ");
}

export default function SmileIllustration({
  variant,
  category,
  seed,
  className,
}: {
  variant: "before" | "after";
  category: ResultCategory;
  seed: number;
  className?: string;
}) {
  const before = variant === "before";
  const id = `${category}-${seed}-${variant}`;
  const total = TEETH.reduce((s, t) => s + t.w, 0) + (TEETH.length - 1) * 2;
  let x = 200 - total / 2;

  const enamelTop = before && category === "whitening" ? "#F3E6C4" : "#FFFFFF";
  const enamelBottom = before && category === "whitening" ? "#DCC596" : before ? "#EFE6D8" : "#F7F1E8";
  const missing = before && category === "implants" ? 2 + Math.floor(rand(seed) * 4) : -1;

  return (
    <svg
      viewBox="30 40 340 240"
      className={className}
      role="img"
      aria-label={before ? "Илюстрация: преди лечение" : "Илюстрация: след лечение"}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor={before ? "#F7F1E9" : "#FFFFFF"} />
          <stop offset="100%" stopColor={before ? "#E9DFD1" : "#F3EBDF"} />
        </radialGradient>
        <linearGradient id={`en-${id}`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor={enamelTop} />
          <stop offset="100%" stopColor={enamelBottom} />
        </linearGradient>
        <linearGradient id={`gum-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9AFA4" />
          <stop offset="100%" stopColor="#F3CDC4" />
        </linearGradient>
        <linearGradient id={`lip-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7B7AA" />
          <stop offset="100%" stopColor="#D99F92" />
        </linearGradient>
        <filter id={`sh-${id}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#8F6F48" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect width="400" height="300" fill={`url(#bg-${id})`} />

      {/* устни — мек силует */}
      <path
        d="M 40 120 Q 200 40 360 120 Q 330 250 200 262 Q 70 250 40 120 Z"
        fill={`url(#lip-${id})`}
        opacity="0.55"
      />
      <path d="M 58 124 Q 200 70 342 124 Q 312 236 200 244 Q 88 236 58 124 Z" fill="#FBF3EE" />

      {/* венец */}
      <path d="M 66 96 Q 200 66 334 96 L 334 140 Q 200 118 66 140 Z" fill={`url(#gum-${id})`} />

      <g filter={`url(#sh-${id})`}>
        {TEETH.map((t, i) => {
          const cx = x + t.w / 2;
          x += t.w + 2;
          if (i === missing) return null;

          const depth = Math.abs(i - 3.5) / 3.5;
          const y = 134 - 11 * (1 - depth * depth);
          const s = 1 - depth * 0.12;
          let rot = 0;
          let dy = 0;
          let dx = 0;
          let chip = 0;
          if (before && category === "orthodontics") {
            rot = (rand(seed * 10 + i) - 0.5) * 26;
            dy = (rand(seed * 20 + i) - 0.5) * 14;
            dx = (rand(seed * 30 + i) - 0.5) * 8;
          }
          if (before && category === "aesthetic") {
            chip = rand(seed * 7 + i) > 0.55 ? 6 + rand(seed + i) * 10 : 0;
            dy = (rand(seed * 5 + i) - 0.5) * 8;
          }

          return (
            <g key={i} transform={`translate(${r2(cx + dx)} ${r2(y + dy)}) rotate(${r2(rot)}) scale(${r2(s)})`}>
              <path d={toothPath(t.w, t.h, chip)} fill={`url(#en-${id})`} />
              <path d={toothPath(t.w, t.h, chip)} fill="none" stroke="#B8956A" strokeOpacity="0.18" />
              <ellipse cx={-t.w * 0.16} cy={t.h * 0.36} rx={t.w * 0.09} ry={t.h * 0.18} fill="#fff" opacity="0.75" />
            </g>
          );
        })}
      </g>

      {!before && (
        <g fill="#FFFFFF">
          <path d="M 286 160 l 3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 z" />
          <path d="M 118 178 l 2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" opacity="0.9" />
        </g>
      )}
    </svg>
  );
}
