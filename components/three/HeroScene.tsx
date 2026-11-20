"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Group, MathUtils, type BufferGeometry } from "three";
import StudioLights from "./StudioLights";
import Warmup from "./Warmup";
import SoftShadow from "./SoftShadow";
import { createEnamelMaterial, createGoldMaterial, createPearlMaterial } from "./materials";
import { loadTooth } from "@/lib/three/loadTooth";

const pearls: { position: [number, number, number]; radius: number }[] = [
  { position: [-1.46, 0.88, -0.4], radius: 0.09 },
  { position: [1.42, 1.04, -0.55], radius: 0.06 },
  { position: [1.62, -0.59, 0.1], radius: 0.11 },
  { position: [-1.38, -0.93, 0.35], radius: 0.055 },
  { position: [0.85, -1.15, -0.45], radius: 0.045 },
];

function Tooth({ geometry, onReady }: { geometry: BufferGeometry; onReady: () => void }) {
  const group = useRef<Group>(null);
  const firstFrame = useRef(true);
  const enamel = useMemo(createEnamelMaterial, []);

  useFrame(({ clock, pointer }, delta) => {
    const tooth = group.current;
    if (!tooth) return;
    const time = clock.elapsedTime;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    tooth.rotation.x = MathUtils.damp(tooth.rotation.x, 0.32 - pointer.y * 0.12 + scroll * 0.2, 4, delta);
    tooth.rotation.y = MathUtils.damp(tooth.rotation.y, -0.36 + Math.sin(time * 0.42) * 0.32 + pointer.x * 0.2, 4, delta);
    tooth.position.y = Math.sin(time * 0.75) * 0.04;
    if (firstFrame.current) {
      firstFrame.current = false;
      onReady();
    }
  });

  return (
    <group ref={group} rotation={[0.32, -0.36, -0.14]}>
      <mesh geometry={geometry} material={enamel} scale={1.95} />
    </group>
  );
}

function Jewelry() {
  const gold = useMemo(createGoldMaterial, []);
  const pearl = useMemo(createPearlMaterial, []);
  return (
    <>
      <mesh rotation={[1.27, 0.32, 0]} material={gold}>
        <torusGeometry args={[1.65, 0.009, 10, 180]} />
      </mesh>
      <mesh rotation={[1.62, -0.48, 0]} material={gold}>
        <torusGeometry args={[1.9, 0.006, 10, 180]} />
      </mesh>
      {pearls.map(({ position, radius }) => (
        <Float key={position[0]} speed={1} rotationIntensity={0} floatIntensity={0.4}>
          <mesh position={position} material={pearl}>
            <sphereGeometry args={[radius, 24, 16]} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function HeroScene({ active, quality, onReady }: {
  active: boolean;
  quality: "high" | "low";
  onReady: () => void;
}) {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);

  useEffect(() => {
    let alive = true;
    loadTooth({ type: "hero", resolution: quality === "high" ? 80 : 56 }).then(g => {
      if (alive) setGeometry(g);
    });
    return () => { alive = false; };
  }, [quality]);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality === "high" ? [1, 1.5] : 1}
      frameloop={active && compiled ? "always" : "never"}
      camera={{ position: [0, 0, 6.4], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
    >
      <StudioLights environmentIntensity={0.48} />
      <Warmup when={!!geometry} onDone={onCompiled} />
      {geometry && <Tooth geometry={geometry} onReady={onReady} />}
      <Jewelry />
      <SoftShadow position={[0, -1.4, 0]} scale={2.8} opacity={0.3} />
    </Canvas>
  );
}
