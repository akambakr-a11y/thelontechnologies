"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as THREE from "three";

const N = 18;

function buildGraph() {
  const gold = Math.PI * (3 - Math.sqrt(5));
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = gold * i;
    nodes.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
  }
  const pairs: [number, number][] = [];
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++)
      if (nodes[i].distanceTo(nodes[j]) < 0.92) pairs.push([i, j]);
  const linePos = new Float32Array(pairs.length * 6);
  pairs.forEach(([a, b], k) => {
    linePos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6);
  });
  return { nodes, pairs, linePos };
}

function Graph({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { nodes, pairs, linePos } = useMemo(buildGraph, []);

  // a few signals travelling along edges
  const signals = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        edge: (i * 7) % pairs.length,
        t: Math.random(),
        sp: 0.25 + Math.random() * 0.25,
      })),
    [pairs.length]
  );
  const sigRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lastScroll = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduce) g.rotation.y += delta * 0.22;
    // scroll spins the core
    if (!reduce && typeof window !== "undefined") {
      const sy = window.scrollY;
      g.rotation.y += (sy - lastScroll.current) * 0.0016;
      lastScroll.current = sy;
    }
    // pointer parallax tilt
    const tx = -state.pointer.y * 0.35 + 0.18;
    const ty = state.pointer.x * 0.35;
    g.rotation.x += (tx - g.rotation.x) * 0.06;
    if (reduce) g.rotation.y += (ty + 0.4 - g.rotation.y) * 0.06;

    // move signals
    signals.forEach((s, i) => {
      const m = sigRefs.current[i];
      if (!m) return;
      if (!reduce) s.t += delta * s.sp;
      if (s.t > 1) {
        s.t = 0;
        s.edge = (s.edge + 5) % pairs.length;
      }
      const [a, b] = pairs[s.edge];
      m.position.lerpVectors(nodes[a], nodes[b], s.t);
    });
  });

  return (
    <group ref={group} rotation={[0.18, 0.4, 0]}>
      {/* edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.4} />
      </lineSegments>

      {/* nodes */}
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.058, 18, 18]} />
          <meshStandardMaterial
            color="#2f6fed"
            emissive="#1d4ed8"
            emissiveIntensity={0.45}
            roughness={0.35}
            metalness={0.15}
          />
        </mesh>
      ))}

      {/* travelling signals */}
      {signals.map((_, i) => (
        <mesh key={`s${i}`} ref={(el) => { sigRefs.current[i] = el; }}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#7dd3fc" />
        </mesh>
      ))}
    </group>
  );
}

export default function NeuralCore3D() {
  const reduce = useReducedMotion() ?? false;
  return (
    <Canvas
      camera={{ position: [0, 0, 3.1], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 3, 4]} intensity={1.3} />
      <pointLight position={[-2, -1, 2]} intensity={0.7} color="#60a5fa" />
      <Graph reduce={reduce} />
    </Canvas>
  );
}
