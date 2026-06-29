"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { IconCompass, IconCode, IconRocket } from "@/components/ui/icons";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const steps = [
  {
    n: "01",
    icon: IconCompass,
    title: "Discover & Define",
    desc: "We dig into your goals, constraints, and users — then define the smallest thing worth building and a clear path to it.",
  },
  {
    n: "02",
    icon: IconCode,
    title: "Design & Build",
    desc: "Design and engineering move together in tight loops, shipping working software you can see and react to every week.",
  },
  {
    n: "03",
    icon: IconRocket,
    title: "Launch & Scale",
    desc: "We ship to production, instrument what matters, and keep iterating — hardening and scaling as real usage grows.",
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="process" band>
      <div className="max-w-2xl">
        <Eyebrow>Our process</Eyebrow>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          A straight line from idea to production.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          No black boxes. Three clear phases, visible progress, and software in
          your hands the whole way through.
        </p>
      </div>

      <div ref={ref} className="relative mt-14">
        {/* Connecting line (desktop) */}
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-line lg:block">
          <motion.div
            style={{ scaleX }}
            className="h-full origin-left bg-gradient-to-r from-primary to-accent"
          />
        </div>

        <motion.div
          variants={stagger(0.18)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-10 lg:grid-cols-3 lg:gap-8"
        >
          {steps.map((s) => (
            <motion.div key={s.n} variants={fadeUp} className="relative">
              <div className="flex items-center gap-4 lg:block">
                <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-white text-primary shadow-soft">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="mt-0 text-sm font-semibold tracking-widest text-muted lg:mt-5 lg:block">
                  STEP {s.n}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-ink lg:mt-2">
                {s.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
