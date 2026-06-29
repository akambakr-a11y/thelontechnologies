"use client";

import dynamic from "next/dynamic";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";

// WebGL neural core — client-only, no SSR.
const NeuralCore3D = dynamic(() => import("@/components/ui/NeuralCore3D"), { ssr: false });

/**
 * Recreation of an AI "intelligence hub": a glowing circuit-brain core orbited
 * by glassmorphic capability nodes, joined by hairlines and halo rings.
 * Sophisticated, restrained motion (gentle float + slow ring spin + glow pulse).
 */
type Node = { top: number; left: number; icon: ReactNode; label: string };

const NODES: Node[] = [
  { top: 11, left: 50, icon: <CubeIcon />, label: "Models" },
  { top: 25, left: 83, icon: <DonutIcon />, label: "Insights" },
  { top: 50, left: 91, icon: <ShieldIcon />, label: "Secure" },
  { top: 76, left: 83, icon: <SitemapIcon />, label: "Orchestrate" },
  { top: 89, left: 50, icon: <UsersIcon />, label: "Teams" },
  { top: 76, left: 17, icon: <CloudIcon />, label: "Cloud" },
  { top: 50, left: 9, icon: <DatabaseIcon />, label: "Data" },
  { top: 25, left: 17, icon: <BarsIcon />, label: "Analytics" },
];

export function BrainHub() {
  const reduce = useReducedMotion();

  // pointer parallax — foreground (lines + icons) drifts over the fixed core
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 16 });
  const py = useSpring(rawY, { stiffness: 60, damping: 16 });
  const fgX = useTransform(px, (v) => v * 16);
  const fgY = useTransform(py, (v) => v * 16);

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    rawY.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.4 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto aspect-square w-full max-w-[400px] self-center"
      aria-hidden
    >
      {/* connecting lines + pulses (parallax foreground) */}
      <motion.svg style={{ x: fgX, y: fgY }} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(120,170,255,0.28)" />
            <stop offset="70%" stopColor="rgba(120,170,255,0.05)" />
            <stop offset="100%" stopColor="rgba(120,170,255,0)" />
          </radialGradient>
          {/* shared 3D gradient for the floating capability icons */}
          <linearGradient id="node3d" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0%" stopColor="#8fc6ff" />
            <stop offset="46%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1b3a8f" />
          </linearGradient>
          {/* beams emanate bright from the core and fade outward → depth */}
          <radialGradient id="beam" cx="50" cy="50" r="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(37,99,235,0.65)" />
            <stop offset="55%" stopColor="rgba(59,130,246,0.32)" />
            <stop offset="100%" stopColor="rgba(96,165,250,0.05)" />
          </radialGradient>
          <radialGradient id="pulseGlow">
            <stop offset="0%" stopColor="rgba(125,211,252,0.95)" />
            <stop offset="100%" stopColor="rgba(125,211,252,0)" />
          </radialGradient>
          <filter id="beamGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {/* soft platform glow */}
        <circle cx="50" cy="50" r="34" fill="url(#hubGlow)" />

        {/* glowing 3D beams + travelling pulse orbs */}
        {NODES.map((n, i) => {
          const out = i % 2 === 0;
          const from = out ? { x: 50, y: 50 } : { x: n.left, y: n.top };
          const to = out ? { x: n.left, y: n.top } : { x: 50, y: 50 };
          return (
            <g key={i}>
              {/* soft glow underlay */}
              <line
                x1="50" y1="50" x2={n.left} y2={n.top}
                stroke="url(#beam)" strokeWidth="1.7" strokeLinecap="round"
                filter="url(#beamGlow)"
              />
              {/* crisp beam */}
              <line
                x1="50" y1="50" x2={n.left} y2={n.top}
                stroke="url(#beam)" strokeWidth="0.55" strokeLinecap="round"
              />
              {/* travelling pulse: halo + bright core */}
              <motion.g
                initial={{ x: from.x, y: from.y, opacity: 0 }}
                animate={
                  reduce
                    ? { x: (50 + n.left) / 2, y: (50 + n.top) / 2, opacity: 1 }
                    : { x: [from.x, to.x], y: [from.y, to.y], opacity: [0, 1, 1, 0] }
                }
                transition={
                  reduce
                    ? {}
                    : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.28, times: [0, 0.12, 0.82, 1] }
                }
              >
                <circle r="2.2" fill="url(#pulseGlow)" />
                <circle r="0.8" fill="#e0f2fe" />
              </motion.g>
            </g>
          );
        })}
      </motion.svg>

      {/* WebGL neural core */}
      <motion.div
        className="absolute left-1/2 top-1/2 aspect-square w-[48%] -translate-x-1/2 -translate-y-1/2"
        animate={reduce ? {} : { scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 10px 26px rgba(37,99,235,0.38))" }}
      >
        <NeuralCore3D />
      </motion.div>

      {/* orbiting capability nodes (parallax foreground) */}
      <motion.div style={{ x: fgX, y: fgY }} className="absolute inset-0">
        {NODES.map((n, i) => (
          <motion.div
            key={n.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${n.top}%`, left: `${n.left}%` }}
            animate={reduce ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 3.4 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.22 }}
          >
            <div
              className="flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24"
              style={{ filter: "drop-shadow(0 12px 16px rgba(23,42,120,0.35))" }}
            >
              {n.icon}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* floating accent cubes */}
      <FloatCube className="left-[6%] top-[20%]" delay={0} reduce={!!reduce} />
      <FloatCube className="right-[4%] top-[12%]" delay={1.2} reduce={!!reduce} />
      <FloatCube className="left-[10%] bottom-[10%]" delay={0.6} reduce={!!reduce} />
      <FloatCube className="right-[8%] bottom-[16%]" delay={1.8} reduce={!!reduce} />
    </motion.div>
  );
}

function FloatCube({ className, delay, reduce }: { className: string; delay: number; reduce: boolean }) {
  return (
    <motion.div
      className={`absolute h-3 w-3 ${className}`}
      animate={reduce ? {} : { y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" fill="rgba(59,108,240,0.18)" stroke="rgba(59,108,240,0.5)" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M12 2v10m0 0 9-5m-9 5-9-5" stroke="rgba(59,108,240,0.4)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}

/**
 * Living neural sphere: nodes arranged on a rotating globe, connected by edges,
 * with signals firing along the connections. Canvas-rendered, the recognizable
 * "neural network" motif for AI.
 */
/* ---------------- node icons (blue) ---------------- */
const ic = { fill: "none", stroke: "url(#node3d)", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function BarsIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" {...ic}><path d="M4 20V4M4 20h16" /><rect x="7" y="12" width="3" height="5" fill="url(#node3d)" stroke="none" /><rect x="12" y="9" width="3" height="8" fill="url(#node3d)" stroke="none" /><rect x="17" y="6" width="3" height="11" fill="url(#node3d)" stroke="none" opacity="0.6" /><path d="M6 11l4-3 4 2 5-5" /></svg>;
}
function DonutIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" {...ic}><circle cx="9" cy="12" r="6" /><path d="M9 6a6 6 0 0 1 0 12" fill="url(#node3d)" stroke="none" opacity="0.85" /><circle cx="9" cy="12" r="2.4" fill="#fff" stroke="none" /><path d="M18 9h4M18 12h4M18 15h3" /></svg>;
}
function CubeIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" fill="url(#node3d)"><path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" opacity="0.9" /><path d="M12 12 21 7M12 12v10M12 12 3 7" stroke="#fff" strokeWidth="1.2" fill="none" /></svg>;
}
function DatabaseIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" fill="url(#node3d)"><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" opacity="0.7" /><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" opacity="0.5" /></svg>;
}
function ShieldIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" fill="url(#node3d)"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z" /><path d="m8.5 12 2.3 2.3L16 9.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CloudIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" fill="url(#node3d)"><path d="M17.5 19a4.5 4.5 0 0 0 .3-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6.5 19h11Z" /></svg>;
}
function SitemapIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" {...ic}><rect x="9.5" y="3" width="5" height="4" rx="1" fill="url(#node3d)" stroke="none" /><rect x="3" y="16" width="5" height="4" rx="1" fill="url(#node3d)" stroke="none" /><rect x="9.5" y="16" width="5" height="4" rx="1" fill="url(#node3d)" stroke="none" opacity="0.7" /><rect x="16" y="16" width="5" height="4" rx="1" fill="url(#node3d)" stroke="none" opacity="0.5" /><path d="M12 7v4M5.5 16v-2.5h13V16M12 13.5V16" /></svg>;
}
function UsersIcon() {
  return <svg width="46" height="46" viewBox="0 0 24 24" fill="url(#node3d)"><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0Z" /><circle cx="16.5" cy="9" r="2.6" opacity="0.7" /><path d="M14.5 19a4.5 4.5 0 0 1 6.5-4" opacity="0.7" /></svg>;
}
