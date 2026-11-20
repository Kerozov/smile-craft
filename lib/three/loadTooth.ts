import type { BufferGeometry } from "three";
import { arraysToGeometry, buildToothArrays, specKey, type ToothArrays, type ToothSpec } from "./toothGeometry";

const cache = new Map<string, Promise<BufferGeometry>>();
let worker: Worker | null | undefined;
let nextId = 0;
const pending = new Map<number, (a: ToothArrays) => void>();

function getWorker() {
  if (worker !== undefined) return worker;
  try {
    worker = new Worker(new URL("./tooth.worker.ts", import.meta.url));
    worker.onmessage = (e: MessageEvent<{ id: number; arrays: ToothArrays }>) => {
      pending.get(e.data.id)?.(e.data.arrays);
      pending.delete(e.data.id);
    };
  } catch {
    worker = null;
  }
  return worker;
}

/** Зарежда геометрия на зъб асинхронно (във worker, с резервен вариант в основния поток) */
export function loadTooth(spec: ToothSpec): Promise<BufferGeometry> {
  const key = specKey(spec);
  let p = cache.get(key);
  if (!p) {
    const w = getWorker();
    p = w
      ? new Promise<ToothArrays>((resolve) => {
          const id = nextId++;
          pending.set(id, resolve);
          w.postMessage({ id, spec });
        }).then(arraysToGeometry)
      : new Promise<BufferGeometry>((resolve) =>
          setTimeout(() => resolve(arraysToGeometry(buildToothArrays(spec))), 0)
        );
    cache.set(key, p);
  }
  return p;
}
