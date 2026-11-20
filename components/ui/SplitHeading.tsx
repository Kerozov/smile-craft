"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Заглавие, чиито думи „изплуват“ една по една при скрол */
export default function SplitHeading({
  text,
  accent,
  as: Tag = "h2",
  className,
}: {
  text: string;
  /** дума(и) в края, изписани в злато и курсив */
  accent?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  const item = (i: number) => ({
    variants: {
      hidden: reduce ? { opacity: 0 } : { y: "105%" },
      show: { y: "0%", opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 } },
    },
  });

  return (
    <MotionTag
      className={cn("heading-xl", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <span className="sr-only">{accent ? `${text} ${accent}` : text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span className="inline-block" {...item(i)}>
              {w}&nbsp;
            </motion.span>
          </span>
        ))}
        {accent && (
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="text-gold-gradient inline-block italic" {...item(words.length)}>
              {accent}
            </motion.span>
          </span>
        )}
      </span>
    </MotionTag>
  );
}
