"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Светло студийно осветление. Отраженията идват от локални Lightformer-и
 * (без HDR файлове от мрежата), за да зарежда бързо и да няма външни заявки.
 */
export default function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff8ef" />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fffaf3" />
      <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#ffe7cf" />

      <Environment resolution={128} frames={1}>
        <color attach="background" args={["#f6efe6"]} />
        <Lightformer
          form="rect"
          intensity={3}
          color="#ffffff"
          position={[0, 4, 3]}
          rotation={[-Math.PI / 3, 0, 0]}
          scale={[8, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color="#ffe9cf"
          position={[-5, 1, 1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#ffffff"
          position={[5, 1, -1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[6, 4, 1]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          color="#f3dcbc"
          position={[0, -3, 4]}
          scale={3}
        />
      </Environment>
    </>
  );
}
