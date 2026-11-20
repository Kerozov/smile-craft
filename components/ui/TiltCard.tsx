"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Карта с истински 3D наклон към курсора и „светлинен“ отблясък.
 * На тъч устройства и при reduced motion е статична.
 */
export default function TiltCard({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 20 });
  const sy = useSpring(py, { stiffness: 180, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(255,255,255,0.75), rgba(227,203,166,0.18) 35%, transparent 60%)`;
  const glareOpacity = useMotionValue(0);
  const glareSpring = useSpring(glareOpacity, { stiffness: 120, damping: 20 });

  return (
    <div className="h-full [perspective:1200px]">
      <motion.div
        ref={ref}
        className={cn("card-premium group h-full preserve-3d", className)}
        style={reduce ? undefined : { rotateX, rotateY }}
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
          glareOpacity.set(1);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
          glareOpacity.set(0);
        }}
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glare, opacity: glareSpring }}
        />
      </motion.div>
    </div>
  );
}
