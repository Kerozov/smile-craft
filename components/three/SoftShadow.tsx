"use client";

import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * Лека мека сянка под обекта — един плосък квадрат с радиален градиент.
 * Изглежда като ContactShadows, но не рендерира сцената наново всеки кадър.
 */
export default function SoftShadow({
  position,
  scale,
  opacity,
  color = "#8a6e4c",
}: {
  position: [number, number, number];
  scale: number;
  opacity: number;
  color?: string;
}) {
  const texture = useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, color);
    g.addColorStop(0.35, color + "b3");
    g.addColorStop(0.7, color + "33");
    g.addColorStop(1, color + "00");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [color]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={[scale, scale * 0.55, 1]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
