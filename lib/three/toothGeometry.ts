import { BufferAttribute, BufferGeometry, MeshBasicMaterial } from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Процедурни 3D зъби.
 *
 * Всеки зъб е описан като signed distance field (SDF): гладки примитиви,
 * споени със „smooth min“. Полето се полигонизира веднъж с MarchingCubes,
 * върховете се сливат и нормалите се преизчисляват — получава се органична,
 * гладка повърхност без нито един външен 3D файл.
 */

export type ToothKind = "molar" | "premolar" | "canine" | "incisor" | "lateral";

type V3 = [number, number, number];

/* ---------------------------- SDF примитиви ---------------------------- */

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const len3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);

function smin(a: number, b: number, k: number) {
  const h = clamp(0.5 + (0.5 * (b - a)) / k, 0, 1);
  return b + (a - b) * h - k * h * (1 - h);
}

function smax(a: number, b: number, k: number) {
  return -smin(-a, -b, k);
}

function sdSphere(x: number, y: number, z: number, c: V3, r: number) {
  return len3(x - c[0], y - c[1], z - c[2]) - r;
}

function sdEllipsoid(x: number, y: number, z: number, c: V3, r: V3) {
  const px = (x - c[0]) / r[0];
  const py = (y - c[1]) / r[1];
  const pz = (z - c[2]) / r[2];
  const k0 = len3(px, py, pz);
  const k1 = len3(px / r[0], py / r[1], pz / r[2]);
  return k1 === 0 ? -Math.min(r[0], r[1], r[2]) : (k0 * (k0 - 1)) / k1;
}

function sdRoundBox(x: number, y: number, z: number, c: V3, b: V3, r: number) {
  const qx = Math.abs(x - c[0]) - b[0] + r;
  const qy = Math.abs(y - c[1]) - b[1] + r;
  const qz = Math.abs(z - c[2]) - b[2] + r;
  return (
    len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) +
    Math.min(Math.max(qx, Math.max(qy, qz)), 0) -
    r
  );
}

function sdRoundRect2D(x: number, y: number, hw: number, hh: number, r: number) {
  const qx = Math.abs(x) - hw + r;
  const qy = Math.abs(y) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Конус със заоблени краища между точките a (радиус ra) и b (радиус rb) */
function sdRoundCone(x: number, y: number, z: number, a: V3, b: V3, ra: number, rb: number) {
  const bax = b[0] - a[0];
  const bay = b[1] - a[1];
  const baz = b[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz;
  const rr = ra - rb;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;

  const pax = x - a[0];
  const pay = y - a[1];
  const paz = z - a[2];
  const yv = pax * bax + pay * bay + paz * baz;
  const zv = yv - l2;
  const cx = pax * l2 - bax * yv;
  const cy = pay * l2 - bay * yv;
  const cz = paz * l2 - baz * yv;
  const x2 = cx * cx + cy * cy + cz * cz;
  const y2 = yv * yv * l2;
  const z2 = zv * zv * l2;

  const k = Math.sign(rr) * rr * rr * x2;
  if (Math.sign(zv) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb;
  if (Math.sign(yv) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra;
  return (Math.sqrt(x2 * a2 * il2) + yv * rr) * il2 - ra;
}

const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ------------------------------- Зъби ---------------------------------- */

/** Голям молар с два корена — за hero сцената */
function sdMolar(x: number, y: number, z: number, withRoots: boolean) {
  // коронката леко се стеснява към шийката
  const taper = 0.82 + 0.18 * smoothstep(-0.05, 0.3, y);
  const tx = x / taper;
  const tz = z / taper;

  let d = sdRoundBox(tx, y, tz, [0, 0.28, 0], [0.36, 0.2, 0.31], 0.17) * taper;

  // четири туберкула
  const cusps: V3[] = [
    [0.17, 0.42, 0.14],
    [-0.17, 0.43, 0.14],
    [0.17, 0.41, -0.14],
    [-0.17, 0.4, -0.14],
  ];
  for (const c of cusps) d = smin(d, sdSphere(x, y, z, c, 0.17), 0.12);

  // фисура по средата на дъвкателната повърхност
  d = smax(d, -sdEllipsoid(x, y, z, [0, 0.64, 0], [0.3, 0.07, 0.05]), 0.06);
  d = smax(d, -sdEllipsoid(x, y, z, [0, 0.64, 0], [0.05, 0.07, 0.24]), 0.06);

  // шийка
  d = smin(d, sdRoundBox(x, y, z, [0, 0.06, 0], [0.27, 0.1, 0.24], 0.12), 0.1);

  if (withRoots) {
    const rootL = sdRoundCone(x, y, z, [-0.19, 0.04, 0.02], [-0.26, -0.34, 0], 0.15, 0.1);
    const tipL = sdRoundCone(x, y, z, [-0.26, -0.34, 0], [-0.2, -0.62, -0.02], 0.1, 0.035);
    const rootR = sdRoundCone(x, y, z, [0.19, 0.04, -0.02], [0.27, -0.32, 0], 0.15, 0.1);
    const tipR = sdRoundCone(x, y, z, [0.27, -0.32, 0], [0.22, -0.58, 0.02], 0.1, 0.035);
    const roots = Math.min(smin(rootL, tipL, 0.08), smin(rootR, tipR, 0.08));
    d = smin(d, roots, 0.12);
    // фуркация — ясно разделени корени
    d = smax(d, -sdEllipsoid(x, y, z, [0, -0.3, 0], [0.11, 0.26, 0.5]), 0.07);
  }

  return d;
}

/** Коронка за зъбна дъга: върхът е +y, лицевата (букална) повърхност е +z */
function sdCrown(kind: ToothKind, x: number, y: number, z: number) {
  switch (kind) {
    case "molar":
      return sdMolar(x * 1.0, y + 0.1, z, false);

    case "premolar": {
      const taper = 0.84 + 0.16 * smoothstep(-0.2, 0.25, y);
      let d =
        sdRoundBox(x / taper, y, z / taper, [0, 0.05, 0], [0.22, 0.3, 0.27], 0.15) * taper;
      d = smin(d, sdSphere(x, y, z, [0, 0.3, 0.12], 0.17), 0.12);
      d = smin(d, sdSphere(x, y, z, [0, 0.26, -0.12], 0.15), 0.12);
      d = smax(d, -sdEllipsoid(x, y, z, [0, 0.47, 0], [0.18, 0.06, 0.05]), 0.05);
      return d;
    }

    case "canine": {
      const taper = 0.7 + 0.3 * smoothstep(-0.45, 0.1, y);
      // лицевата повърхност е изпъкнала
      const zz = z - 0.08 * (1 - (x / 0.25) ** 2);
      let d =
        sdRoundBox(x / taper, y, zz / taper, [0, -0.08, 0.0], [0.2, 0.36, 0.17], 0.14) * taper;
      d = smin(d, sdRoundCone(x, y, z, [0, 0.12, 0.02], [0, 0.5, 0.04], 0.19, 0.03), 0.12);
      return d;
    }

    case "lateral":
    case "incisor": {
      const w = kind === "incisor" ? 0.27 : 0.21;
      const h = kind === "incisor" ? 0.44 : 0.38;
      // силует: широк режещ ръб, стеснява се към шийката, заоблени ъгли
      const taper = 0.62 + 0.38 * smoothstep(-0.55, 0.2, y);
      const d2 = sdRoundRect2D(x / taper, y + 0.04, w, h, kind === "incisor" ? 0.12 : 0.14) * taper;
      // режещият ръб е по-тънък от шийката (лопатовидна форма)
      const thick = 0.05 + 0.1 * (1 - smoothstep(-0.45, 0.42, y));
      // изпъкнала лицева повърхност
      const zz = z - 0.08 * (1 - Math.min((x / w) ** 2, 1)) - 0.04;
      const dz = Math.abs(zz) - thick;
      const m = Math.max(d2, dz);
      return len3(Math.max(d2, 0), Math.max(dz, 0), 0) + Math.min(m, 0) - 0.035;
    }
  }
}

/* ---------------------------- Полигонизация ---------------------------- */

function polygonize(sdf: (x: number, y: number, z: number) => number, resolution: number) {
  const mc = new MarchingCubes(resolution, new MeshBasicMaterial(), false, false, 120000);
  const size = mc.size;
  const half = size / 2;
  const field = mc.field as Float32Array;
  const iso = mc.isolation;

  for (let k = 0; k < size; k++) {
    const fz = (k - half) / half;
    for (let j = 0; j < size; j++) {
      const fy = (j - half) / half;
      const row = k * size * size + j * size;
      for (let i = 0; i < size; i++) {
        const fx = (i - half) / half;
        field[row + i] = iso - sdf(fx, fy, fz) * 400;
      }
    }
  }

  mc.update();

  const count = mc.count as number;
  const positions = (mc.positionArray as Float32Array).slice(0, count * 3);

  const raw = new BufferGeometry();
  raw.setAttribute("position", new BufferAttribute(positions, 3));
  const geo = mergeVertices(raw, 1e-4);
  geo.computeVertexNormals();
  geo.computeBoundingBox();
  geo.computeBoundingSphere();

  raw.dispose();
  mc.geometry.dispose();
  (mc.material as MeshBasicMaterial).dispose();

  return geo;
}

const cache = new Map<string, BufferGeometry>();

export function getHeroToothGeometry(resolution = 84) {
  const key = `hero-${resolution}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      polygonize((x, y, z) => sdMolar(x * 0.95, y - 0.05, z * 0.95, true), resolution)
    );
  }
  return cache.get(key)!;
}

export function getCrownGeometry(kind: ToothKind, resolution = 56) {
  const key = `${kind}-${resolution}`;
  if (!cache.has(key)) {
    cache.set(
      key,
      polygonize((x, y, z) => sdCrown(kind, x, y, z), resolution)
    );
  }
  return cache.get(key)!;
}
