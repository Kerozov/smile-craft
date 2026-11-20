"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Box, Pause, X } from "lucide-react";
import { isSmallScreen, useCanvasVisibility } from "@/components/three/useCanvasVisibility";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const controls = {
  idle: { icon: Box, label: "Виж в 3D" },
  loading: { icon: X, label: "Откажи зареждането" },
  playing: { icon: Pause, label: "Спри анимацията" },
};

type Mode = keyof typeof controls | "static" | "unavailable";

export default function HeroArtwork({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useCanvasVisibility(stage, "0px");
  const [mode, setMode] = useState<Mode>("static");
  const showScene = mode === "loading" || mode === "playing";
  const control = mode === "static" || mode === "unavailable" ? null : controls[mode];
  const onReady = useCallback(() => setMode(current => current === "loading" ? "playing" : current), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(motion.matches || !window.WebGL2RenderingContext ? "static" : "idle");
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);

  return (
    <div className="mx-auto my-3 w-full max-w-[min(22rem,38svh)] self-center md:col-start-2 md:row-span-2 md:row-start-1 md:my-0 md:max-w-none">
      <div ref={stage} aria-hidden="true" className="relative aspect-[5/4]">
        <div className={`h-full transition-opacity duration-300 ${mode === "playing" ? "opacity-0" : "opacity-100"}`}>
          {children}
        </div>
        {showScene && (
          <div className={`absolute inset-0 transition-opacity duration-300 ${mode === "playing" ? "opacity-100" : "opacity-0"}`}>
            <SceneBoundary onError={() => setMode("unavailable")}>
              <HeroScene active={visible} quality={isSmallScreen() ? "low" : "high"} onReady={onReady} />
            </SceneBoundary>
          </div>
        )}
      </div>
      <div className="relative flex min-h-11 items-center justify-center">
        {mode === "unavailable" && <span role="status" className="text-xs text-ink-soft">3D изгледът е недостъпен.</span>}
        {control && (
          <button
            type="button"
            onClick={() => setMode(showScene ? "idle" : "loading")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-body text-xs font-semibold text-ink-soft transition-colors hover:bg-white/70 hover:text-gold-deep"
          >
            <control.icon size={15} aria-hidden="true" />
            {control.label}
          </button>
        )}
      </div>
    </div>
  );
}
