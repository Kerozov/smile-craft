import { Sparkle } from "lucide-react";

/** Голям, бавно движещ се ред от думи — редакционен акцент между секциите */
export default function TextMarquee({ words }: { words: string[] }) {
  const loop = [...words, ...words];
  return (
    <div className="marquee-fade overflow-hidden border-y border-ink/[0.06] bg-white/60 py-6 md:py-8" aria-hidden="true">
      <div className="flex w-max animate-marquee items-center gap-10 motion-reduce:animate-none md:gap-14">
        {loop.map((w, i) => (
          <span key={i} className="flex items-center gap-10 md:gap-14">
            <span className={i % 2 ? "text-gold-gradient font-display text-4xl italic md:text-6xl" : "font-display text-4xl text-ink md:text-6xl"}>
              {w}
            </span>
            <Sparkle className="h-5 w-5 text-gold" strokeWidth={1.2} />
          </span>
        ))}
      </div>
    </div>
  );
}
