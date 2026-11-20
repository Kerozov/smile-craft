"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Компилира шейдърите асинхронно (KHR_parallel_shader_compile), преди сцената
 * да започне да рендерира. Без това първият кадър „замръзва“ основния поток,
 * докато GPU драйверът компилира тежките физични материали.
 */
export default function Warmup({ when, onDone }: { when: boolean; onDone: () => void }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    if (!when) return;
    let alive = true;
    const done = () => alive && onDone();
    // изчакваме един кадър, за да са добавени всички обекти в сцената
    const raf = requestAnimationFrame(() => {
      gl.compileAsync(scene, camera).then(done, done);
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [when, gl, scene, camera, onDone]);

  return null;
}
