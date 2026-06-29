"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-scrubbed 3D wrapper: content tilts back as it enters from below,
 * lies flat through the middle of the viewport, and tilts gently away as it
 * leaves — giving the whole page the hero's 3D-on-scroll language.
 * Respects prefers-reduced-motion.
 */
export function ScrollScene({
  children,
  className,
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const rx = 9 * intensity;
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], reduce ? [0, 0, 0] : [rx, 0, -rx * 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.45, 1], reduce ? [0, 0, 0] : [44, 0, -14]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.9, 1],
    reduce ? [1, 1, 1, 1] : [0.35, 1, 1, 0.7]
  );

  return (
    <div ref={ref} className={className} style={{ perspective: 1300 }}>
      <motion.div style={{ rotateX, y, opacity, transformOrigin: "center" }}>
        {children}
      </motion.div>
    </div>
  );
}
