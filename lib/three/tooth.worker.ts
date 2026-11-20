/// <reference lib="webworker" />
import { buildToothArrays, type ToothSpec } from "./toothGeometry";

// Генерира геометрията на зъбите извън основния поток, за да не „забива“ страницата
self.onmessage = (e: MessageEvent<{ id: number; spec: ToothSpec }>) => {
  const { id, spec } = e.data;
  const a = buildToothArrays(spec);
  (self as unknown as Worker).postMessage({ id, arrays: a }, [a.position.buffer, a.normal.buffer, a.index.buffer]);
};
