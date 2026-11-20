"use client";

import { useEffect, useState, type RefObject } from "react";

/** Пауза на WebGL рендера, когато сцената не е на екрана (батерия и FPS) */
export function useCanvasVisibility(ref: RefObject<Element | null>, rootMargin = "200px") {
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
    webglSupport = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export function isSmallScreen() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}
