"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import {
  CatmullRomCurve3,
  Group,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Color,
  Quaternion,
  TubeGeometry,
  Vector3,
} from "three";
import StudioLights from "./StudioLights";
import { createEnamelMaterial, createGoldMaterial } from "./materials";
import { getCrownGeometry, type ToothKind } from "@/lib/three/toothGeometry";

/* ------------------------------------------------------------------ */
/*  Зъбна дъга                                                         */
/* ------------------------------------------------------------------ */

/** Относителни размери на зъбите (централен резец ≈ 8.5 мм, молар ≈ 10 мм) */
const HALF: { kind: ToothKind; s: number }[] = [
  { kind: "incisor", s: 1 },
  { kind: "lateral", s: 0.98 },
  { kind: "canine", s: 1.08 },
  { kind: "premolar", s: 1 },
  { kind: "premolar", s: 1 },
  { kind: "molar", s: 0.86 },
];
const PLAN = [...HALF].reverse().concat(HALF);

/** Горният ръб на всички коронки е на една линия (оклузална равнина) */
const OCCLUSAL_Y = 0.32;
const SPEE = 0.08; // лека „крива на Спее“ към кътниците

/** „Преди“ — фиксиран хаос, за да е еднакъв при всяко зареждане */
const CHAOS = [
  { n: 0.06, y: 0.03, ry: 0.18, rz: 0.05 },
  { n: -0.12, y: -0.04, ry: -0.42, rz: -0.08 },
  { n: 0.16, y: 0.06, ry: 0.55, rz: 0.1 },
  { n: 0.22, y: -0.05, ry: -0.35, rz: 0.14 },
  { n: -0.2, y: 0.07, ry: 0.62, rz: -0.12 },
  { n: 0.14, y: -0.06, ry: -0.3, rz: 0.09 },
  { n: -0.1, y: 0.05, ry: 0.38, rz: -0.1 },
  { n: 0.24, y: -0.03, ry: -0.6, rz: 0.12 },
  { n: -0.18, y: 0.06, ry: 0.45, rz: -0.13 },
  { n: 0.15, y: -0.05, ry: -0.5, rz: 0.08 },
  { n: -0.1, y: 0.04, ry: 0.3, rz: -0.06 },
  { n: 0.05, y: -0.02, ry: -0.2, rz: 0.04 },
];

const BASE_CURVE = new CatmullRomCurve3(
  [
    new Vector3(-1.62, 0, -1.75),
    new Vector3(-1.52, 0, -0.95),
    new Vector3(-1.24, 0, -0.2),
    new Vector3(-0.7, 0, 0.38),
    new Vector3(0, 0, 0.62),
    new Vector3(0.7, 0, 0.38),
    new Vector3(1.24, 0, -0.2),
    new Vector3(1.52, 0, -0.95),
    new Vector3(1.62, 0, -1.75),
  ],
  false,
  "centripetal"
);

type Slot = {
  kind: ToothKind;
  scale: number;
  pos: Vector3;
  quat: Quaternion;
  normal: Vector3;
  yOff: number;
  bracketY: number;
  front: number;
};

const box = (kind: ToothKind) => getCrownGeometry(kind, 52).boundingBox!;

/** Дъгата се мащабира така, че зъбите да се допират плътно */
const { ARCH_CURVE, SLOTS } = (() => {
  const widths = PLAN.map((p) => {
    const b = box(p.kind);
    return (b.max.x - b.min.x) * p.s * 0.9;
  });
  const total = widths.reduce((a, w) => a + w, 0);
  const k = total / BASE_CURVE.getLength();
  const curve = new CatmullRomCurve3(
    BASE_CURVE.points.map((v) => v.clone().multiplyScalar(k).add(new Vector3(0, 0, 0.35))),
    false,
    "centripetal"
  );

  let acc = 0;
  const up = new Vector3(0, 1, 0);
  const slots: Slot[] = PLAN.map((p, i) => {
    const u = (acc + widths[i] / 2) / total;
    acc += widths[i];
    const pos = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u).normalize();
    const normal = new Vector3().crossVectors(tangent, up).normalize();
    const quat = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(tangent, up, normal));
    const b = box(p.kind);
    const depth = Math.abs(u - 0.5) * 2;
    const top = OCCLUSAL_Y - SPEE * depth * depth;
    const yOff = top - b.max.y * p.s;
    const visibleH = Math.min((b.max.y - b.min.y) * p.s, 0.75);
    return {
      kind: p.kind,
      scale: p.s,
      pos,
      quat,
      normal,
      yOff,
      bracketY: top - visibleH * 0.48,
      front: b.max.z * p.s,
    };
  });
  return { ARCH_CURVE: curve, SLOTS: slots };
})();

function bracketPoint(slot: Slot, extra = 0) {
  return slot.pos
    .clone()
    .addScaledVector(slot.normal, slot.front + extra)
    .setY(slot.bracketY);
}

const GUM_Y = -0.42;
const GUM_R = 0.34;

function buildGum() {
  const pts = ARCH_CURVE.getSpacedPoints(80).map((p) => new Vector3(p.x, 0, p.z));
  const curve = new CatmullRomCurve3(pts, false, "centripetal");
  return {
    tube: new TubeGeometry(curve, 220, GUM_R, 28, false),
    caps: [pts[0], pts[pts.length - 1]],
  };
}

/** Две половини на дъгата — от центъра към всеки край */
function buildWires() {
  const mid = SLOTS.length / 2;
  const center = bracketPoint(SLOTS[mid - 1], 0.03).lerp(bracketPoint(SLOTS[mid], 0.03), 0.5);
  const right = SLOTS.slice(mid).map((s) => bracketPoint(s, 0.03));
  const left = SLOTS.slice(0, mid).reverse().map((s) => bracketPoint(s, 0.03));
  return [right, left].map((pts) => {
    const curve = new CatmullRomCurve3([center, ...pts], false, "centripetal");
    return new TubeGeometry(curve, 180, 0.017, 10, false);
  });
}

/* ------------------------------------------------------------------ */
/*  Хронология на скрола (съвпада с главите в текста)                  */
/* ------------------------------------------------------------------ */

const seg = (p: number, a: number, b: number) => MathUtils.smoothstep(p, a, b);

const CAMERA_KEYS: { at: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { at: 0, pos: [0, 0.9, 4.6], look: [0, -0.05, -0.1] },
  { at: 0.2, pos: [2.7, 1.9, 3.3], look: [0, -0.1, -0.15] },
  { at: 0.42, pos: [0.3, 4.6, 1.6], look: [0, -0.1, -0.2] },
  { at: 0.62, pos: [-2.8, 1.6, 3.1], look: [0, -0.05, -0.1] },
  { at: 0.82, pos: [-0.8, 0.9, 4.1], look: [0, -0.05, -0.05] },
  { at: 1, pos: [0, 0.65, 4.2], look: [0, -0.05, -0.05] },
];

function sampleCamera(p: number, out: Vector3, look: Vector3) {
  let i = 0;
  while (i < CAMERA_KEYS.length - 2 && p > CAMERA_KEYS[i + 1].at) i++;
  const a = CAMERA_KEYS[i];
  const b = CAMERA_KEYS[i + 1];
  const t = MathUtils.smootherstep(p, a.at, b.at);
  out.set(
    MathUtils.lerp(a.pos[0], b.pos[0], t),
    MathUtils.lerp(a.pos[1], b.pos[1], t),
    MathUtils.lerp(a.pos[2], b.pos[2], t)
  );
  look.set(
    MathUtils.lerp(a.look[0], b.look[0], t),
    MathUtils.lerp(a.look[1], b.look[1], t),
    MathUtils.lerp(a.look[2], b.look[2], t)
  );
}

/* ------------------------------------------------------------------ */

function Arch({ progress, reduceMotion }: { progress: MotionValue<number>; reduceMotion: boolean }) {
  const enamel = useMemo(() => createEnamelMaterial(), []);
  const gold = useMemo(() => createGoldMaterial(), []);
  // отделен материал за всеки брекет — появяват се един след друг
  const bracketMats = useMemo(
    () =>
      SLOTS.map(() => {
        const m = createGoldMaterial();
        m.transparent = true;
        return m;
      }),
    []
  );
  const wireMat = useMemo(() => {
    const m = new MeshStandardMaterial({ color: "#cfb084", metalness: 1, roughness: 0.18, transparent: true });
    return m;
  }, []);
  const ghostMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: "#c9a678",
        wireframe: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    []
  );

  const geos = useMemo(() => {
    const kinds: ToothKind[] = ["molar", "premolar", "canine", "lateral", "incisor"];
    return Object.fromEntries(kinds.map((k) => [k, getCrownGeometry(k, 52)])) as Record<
      ToothKind,
      ReturnType<typeof getCrownGeometry>
    >;
  }, []);

  const wires = useMemo(() => buildWires(), []);
  const gum = useMemo(() => buildGum(), []);
  const gumMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#f1c6bd",
        roughness: 0.42,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        sheen: 1,
        sheenColor: new Color("#ffe1da"),
        sheenRoughness: 0.4,
      }),
    []
  );

  const teeth = useRef<(Group | null)[]>([]);
  const brackets = useRef<(Mesh | null)[]>([]);
  const wireRefs = useRef<(Mesh | null)[]>([]);
  const root = useRef<Group>(null);

  const tmpQ = useMemo(() => new Quaternion(), []);
  const tmpQ2 = useMemo(() => new Quaternion(), []);
  const yAxis = useMemo(() => new Vector3(0, 1, 0), []);
  const zAxis = useMemo(() => new Vector3(0, 0, 1), []);
  const camPos = useMemo(() => new Vector3(), []);
  const camLook = useMemo(() => new Vector3(), []);
  const curLook = useRef(new Vector3(0, -0.05, -0.1));

  const { camera, size } = useThree();

  useFrame((state, delta) => {
    const p = progress.get();

    // Камера
    if (reduceMotion) {
      camPos.set(0, 0.9, 4.4);
      camLook.set(0, -0.05, -0.1);
    } else {
      sampleCamera(p, camPos, camLook);
    }
    // по-тесни екрани → камерата се отдръпва, за да се вижда цялата дъга
    const aspect = size.width / size.height;
    const pull = (aspect < 1.1 ? MathUtils.clamp(1.5 / aspect, 1, 2.6) : 1) * 1.18;
    camPos.multiplyScalar(pull);
    // на широк екран дъгата стои вдясно, текстът — вляво
    if (aspect > 1.15) {
      const shift = MathUtils.clamp((aspect - 1.15) * 0.9, 0, 0.75);
      camPos.x -= shift;
      camLook.x -= shift;
    }
    camera.position.lerp(camPos, 1 - Math.exp(-delta * 8));
    curLook.current.lerp(camLook, 1 - Math.exp(-delta * 8));
    camera.lookAt(curLook.current);
    (camera as PerspectiveCamera).updateProjectionMatrix();

    SLOTS.forEach((slot, i) => {
      const g = teeth.current[i];
      if (!g) return;
      const c = CHAOS[i];
      const local = reduceMotion ? 1 : seg(p, 0.6 + i * 0.008, 0.8 + i * 0.005);
      const k = 1 - local;
      g.position.copy(slot.pos).addScaledVector(slot.normal, c.n * 1.4 * k);
      g.position.y = c.y * 1.4 * k;
      tmpQ.setFromAxisAngle(yAxis, c.ry * k);
      tmpQ2.setFromAxisAngle(zAxis, c.rz * k);
      g.quaternion.copy(slot.quat).multiply(tmpQ).multiply(tmpQ2);

      const b = brackets.current[i];
      if (b) {
        const on = reduceMotion ? 0 : seg(p, 0.45 + i * 0.006, 0.55 + i * 0.006) * (1 - seg(p, 0.86, 0.93));
        (b.material as MeshStandardMaterial).opacity = on;
        b.visible = on > 0.01;
        b.scale.setScalar(0.6 + 0.4 * on);
      }
    });

    // Дъга: чертае се от центъра навън
    const draw = reduceMotion ? 0 : seg(p, 0.5, 0.66);
    const wireOn = draw * (1 - seg(p, 0.86, 0.93));
    wireMat.opacity = wireOn;
    wireRefs.current.forEach((w, i) => {
      if (!w) return;
      const idx = wires[i].index!.count;
      wires[i].setDrawRange(0, Math.floor((idx * draw) / 6) * 6);
      w.visible = wireOn > 0.01;
    });

    // Диагностика: дигитален „призрак“ на идеалната дъга
    const ghost = reduceMotion ? 0 : seg(p, 0.27, 0.34) * (1 - seg(p, 0.5, 0.58));
    ghostMat.opacity = ghost * 0.22;

    // Финал: лек „поклон“ на цялата дъга
    if (root.current) {
      const finale = reduceMotion ? 0 : seg(p, 0.84, 1);
      root.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.04 * finale;
      root.current.position.y = 0.04 * finale;
    }
  });

  return (
    <group ref={root}>
      {SLOTS.map((slot, i) => (
        <group key={i} ref={(el) => void (teeth.current[i] = el)}>
          <mesh geometry={geos[slot.kind]} material={enamel} scale={slot.scale} position-y={slot.yOff} />
          <mesh
            ref={(el) => void (brackets.current[i] = el)}
            position={[0, slot.bracketY, slot.front + 0.012]}
            material={bracketMats[i]}
          >
            <boxGeometry args={[0.13, 0.105, 0.045]} />
          </mesh>
        </group>
      ))}

      {/* Венец */}
      <group position-y={GUM_Y} scale={[1, 0.72, 1]}>
        <mesh geometry={gum.tube} material={gumMat} />
        {gum.caps.map((c, i) => (
          <mesh key={i} position={c} material={gumMat}>
            <sphereGeometry args={[GUM_R, 32, 24]} />
          </mesh>
        ))}
      </group>

      {/* Идеалната дъга — „дигитален план“ */}
      {SLOTS.map((slot, i) => (
        <mesh
          key={`g${i}`}
          geometry={geos[slot.kind]}
          material={ghostMat}
          position={[slot.pos.x, slot.yOff, slot.pos.z]}
          quaternion={slot.quat}
          scale={slot.scale * 1.02}
        />
      ))}

      {wires.map((g, i) => (
        <mesh key={`w${i}`} ref={(el) => void (wireRefs.current[i] = el)} geometry={g} material={wireMat} />
      ))}


      {/* Ненатрапчив златен подиум */}
      <mesh position={[0, -0.72, -0.1]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.05, 0.85, 1]} material={gold}>
        <torusGeometry args={[1.75, 0.005, 8, 200]} />
      </mesh>
    </group>
  );
}

export default function ArchScene({
  progress,
  reduceMotion,
  active,
  quality,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
  active: boolean;
  quality: "high" | "low";
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={quality === "high" ? [1, 1.75] : [1, 1.4]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.9, 4.6], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <StudioLights />
      <Arch progress={progress} reduceMotion={reduceMotion} />
      <ContactShadows
        position={[0, -0.72, -0.1]}
        opacity={0.3}
        scale={4.5}
        blur={2.2}
        far={1.2}
        resolution={512}
        color="#8a6e4c"
      />
    </Canvas>
  );
}

