"use client";

import { useEffect, useState, type RefObject } from "react";

/** Пауза на WebGL рендера, когато сцената не е на екрана (батерия и FPS) */
export function useCanvasVisibility(ref: RefObject<Element | null>, rootMargin: string) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return visible;
}

let webglSupport: boolean | null = null;

export function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    webglSupport = !!gl;
    // освобождаваме пробния контекст веднага — браузърите имат лимит на WebGL контекстите
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export function isSmallScreen() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

/** Изпълнява cb, когато браузърът е свободен (или след timeout). Връща функция за отказ. */
export function whenIdle(cb: () => void, timeout = 800) {
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const t = window.setTimeout(cb, 200);
  return () => window.clearTimeout(t);
}
