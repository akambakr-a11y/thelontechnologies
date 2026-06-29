"use client";

import { useCallback } from "react";

/**
 * Returns pointer handlers that apply a 3D perspective tilt and feed the
 * cursor position into CSS vars (--mx/--my) for a follow glow. Pair with the
 * `.tilt` class. No-ops under prefers-reduced-motion.
 */
export function useTilt() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-9px)`;
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  return { onPointerMove, onPointerLeave };
}
