"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { HeroSystem } from "@/components/ui/HeroSystem";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const line: Variants = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.85, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const specItems = [
  "Thelon Technologies",
  "AI systems studio",
  "Ontario · Canada",
  "02 products live",
];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 9]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.85, 1], reduce ? [1, 1, 1] : [1, 1, 0.55]);

  return (
    <section id="top" ref={ref} className="relative">
      <div className="mx-auto w-full max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        {/* Spec / title-block bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-line/80 pb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
        >
          {specItems.map((s, i) => (
            <span key={s} className="flex items-center gap-5">
              {i > 0 && <span className="hidden h-3 w-px bg-line sm:block" />}
              <span className={i === 3 ? "text-primary" : ""}>{s}</span>
            </span>
          ))}
          <CornerTicks />
        </motion.div>

        {/* Headline */}
        <motion.div variants={container} initial="hidden" animate="show" className="pt-10 sm:pt-14">
          <h1 className="font-display text-[clamp(2.7rem,7.4vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.03em] text-ink">
            <Line>We build AI</Line>
            <Line>
              that does{" "}
              <span className="relative inline-block whitespace-nowrap text-primary">
                real work
                <Underline />
              </span>
              .
            </Line>
            <Line>
              <span className="text-muted/90">Not demos.</span>
            </Line>
          </h1>

          <motion.p
            variants={fade}
            className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            We design, build, and ship AI software, SaaS platforms, and the systems
            that run underneath them — prototype to production, with one
            accountable team that operates its own products in the wild.
          </motion.p>

        </motion.div>

        {/* Signature: one panel — live code (left) + AI intelligence hub (right) */}
        <div className="mt-12 sm:mt-16" style={{ perspective: 1500 }}>
          <motion.div style={{ rotateX, scale, y, opacity, transformOrigin: "center" }}>
            <HeroSystem />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span variants={line} className="block">
        {children}
      </motion.span>
    </span>
  );
}

function Underline() {
  const reduce = useReducedMotion();
  return (
    <svg
      className="absolute -bottom-1 left-0 h-[0.18em] w-full overflow-visible"
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      aria-hidden
    >
      <motion.path
        d="M2 5 C 50 1, 150 1, 198 5"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={4}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: reduce ? 0 : 1.15 }}
      />
    </svg>
  );
}

function CornerTicks() {
  // Faint draftsman crop-marks anchoring the sheet corners.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 hidden sm:block">
      <span className="absolute -left-2 top-0 h-3 w-px bg-line" />
      <span className="absolute -left-2 top-0 h-px w-3 bg-line" />
      <span className="absolute -right-2 top-0 h-3 w-px bg-line" />
      <span className="absolute -right-2 top-0 h-px w-3 bg-line" />
    </div>
  );
}

