import type { BufferGeometry } from "three";
import { loadTooth } from "./loadTooth";
import type { ToothKind } from "./toothGeometry";

export const ARCH_KINDS: ToothKind[] = ["molar", "premolar", "canine", "lateral", "incisor"];
export const ARCH_RESOLUTION = 52;

export type ArchGeometries = Record<ToothKind, BufferGeometry>;

/** Всички коронки за зъбната дъга (строят се във worker-а, кешират се) */
export function loadArchTeeth(): Promise<ArchGeometries> {
  return Promise.all(ARCH_KINDS.map((kind) => loadTooth({ type: "crown", kind, resolution: ARCH_RESOLUTION }))).then(
    (geos) => Object.fromEntries(ARCH_KINDS.map((k, i) => [k, geos[i]])) as ArchGeometries
  );
}
