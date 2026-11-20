"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";
import StudioLights from "./StudioLights";
import Warmup from "./Warmup";
import SoftShadow from "./SoftShadow";
import { createEnamelMaterial, createGoldMaterial, createPearlMaterial } from "./materials";
import { loadTooth } from "@/lib/three/loadTooth";
import type { BufferGeometry } from "three";

type Pointer = { x: number; y: number };

const PEARLS: { p: [number, number, number]; s: number; speed: number }[] = [
  { p: [-1.75, 0.95, -0.4], s: 0.11, speed: 1.1 },
  { p: [1.7, 1.25, -0.8], s: 0.075, speed: 1.4 },
  { p: [1.95, -0.55, 0.3], s: 0.13, speed: 0.9 },
  { p: [-1.5, -0.95, 0.5], s: 0.07, speed: 1.6 },
  { p: [-0.65, 1.7, -1.2], s: 0.055, speed: 1.2 },
  { p: [0.95, -1.35, 0.9], s: 0.06, speed: 1.3 },
  { p: [2.35, 0.45, -1.6], s: 0.09, speed: 0.8 },
  { p: [-2.4, 0.15, -1.4], s: 0.1, speed: 1 },
];

function Tooth({
  pointer,
  reduceMotion,
  quality,
  onReady,
}: {
  pointer: React.MutableRefObject<Pointer>;
  reduceMotion: boolean;
  quality: "high" | "low";
  onReady: () => void;
}) {
  const group = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const appear = useRef(0);

  // геометрията се строи във Web Worker — страницата не блокира
  useEffect(() => {
    let alive = true;
    loadTooth({ type: "hero", resolution: quality === "high" ? 84 : 64 }).then((g) => {
      if (alive) {
        setGeometry(g);
        onReady();
      }
    });
    return () => {
      alive = false;
    };
  }, [quality, onReady]);
  const enamel = useMemo(() => createEnamelMaterial(), []);

  useFrame((state, delta) => {
    if (!group.current || !spin.current) return;
    // мек „поява“ ефект, щом геометрията е готова
    if (geometry && appear.current < 0.999) {
      appear.current = reduceMotion ? 1 : MathUtils.damp(appear.current, 1, 3, delta);
      group.current.scale.setScalar(0.82 + 0.18 * appear.current);
    }
    const scroll = typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0;

    // плавно люлеене — зъбът почти винаги е с лицето към нас и се чете като икона
    if (!reduceMotion) spin.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.75;

    // Наклон към курсора + завъртане при скрол
    const targetX = reduceMotion ? 0.12 : 0.12 + pointer.current.y * 0.18 + scroll * 0.6;
    const targetZ = reduceMotion ? 0 : -pointer.current.x * 0.12;
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.z = MathUtils.damp(group.current.rotation.z, targetZ, 4, delta);
    group.current.position.y = MathUtils.damp(
      group.current.position.y,
      reduceMotion ? 0 : scroll * 0.9,
      6,
      delta
    );
    state.camera.position.x = MathUtils.damp(
      state.camera.position.x,
      reduceMotion ? 0 : pointer.current.x * 0.35,
      3,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <group ref={spin}>
        {geometry && <mesh geometry={geometry} material={enamel} scale={1.3} />}
      </group>
    </group>
  );
}

function Orbits({ reduceMotion }: { reduceMotion: boolean }) {
  const a = useRef<Mesh>(null);
  const b = useRef<Mesh>(null);
  const gold = useMemo(() => createGoldMaterial(), []);

  useFrame((_, delta) => {
    if (reduceMotion) return;
    if (a.current) a.current.rotation.z += delta * 0.18;
    if (b.current) b.current.rotation.z -= delta * 0.12;
  });

  return (
    <group>
      <mesh ref={a} rotation={[Math.PI / 2.35, 0.28, 0]} material={gold}>
        <torusGeometry args={[1.95, 0.008, 16, 200]} />
      </mesh>
      <mesh ref={b} rotation={[Math.PI / 1.85, -0.42, 0.4]} material={gold}>
        <torusGeometry args={[2.3, 0.005, 16, 220]} />
      </mesh>
    </group>
  );
}

function Pearls({ reduceMotion }: { reduceMotion: boolean }) {
  const pearl = useMemo(() => createPearlMaterial(), []);
  return (
    <>
      {PEARLS.map((item, i) => (
        <Float
          key={i}
          speed={reduceMotion ? 0 : item.speed}
          rotationIntensity={0}
          floatIntensity={reduceMotion ? 0 : 1.2}
          floatingRange={[-0.12, 0.12]}
        >
          <mesh position={item.p} material={pearl}>
            <sphereGeometry args={[item.s, 32, 32]} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function HeroScene({
  reduceMotion,
  active,
  quality,
  onReady,
}: {
  reduceMotion: boolean;
  active: boolean;
  quality: "high" | "low";
  onReady?: () => void;
}) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const handleCompiled = useCallback(() => {
    setCompiled(true);
    onReady?.();
  }, [onReady]);

  // Слушаме целия прозорец — текстът върху сцената не трябва да „гаси“ паралакса
  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion]);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality === "high" ? [1, 1.5] : [1, 1.25]}
      frameloop={active && compiled ? "always" : "never"}
      camera={{ position: [0, 0.2, 6.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <StudioLights />
      <Warmup when={ready} onDone={handleCompiled} />

      <Float
        speed={reduceMotion ? 0 : 1.4}
        rotationIntensity={reduceMotion ? 0 : 0.25}
        floatIntensity={reduceMotion ? 0 : 0.6}
      >
        <Tooth pointer={pointer} reduceMotion={reduceMotion} quality={quality} onReady={handleReady} />
      </Float>

      <Orbits reduceMotion={reduceMotion} />
      <Pearls reduceMotion={reduceMotion} />

      {ready && <SoftShadow position={[0, -1.85, 0]} scale={4.2} opacity={0.3} />}
    </Canvas>
  );
}
