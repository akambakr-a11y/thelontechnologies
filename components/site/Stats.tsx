"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/ui/Counter";
import { ScrollScene } from "@/components/ui/ScrollScene";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const stats = [
  { to: 20, suffix: "+", label: "Years of experience" },
  { to: 4, suffix: "", label: "Core practices" },
  { to: 2, suffix: "", label: "Live AI products" },
  { to: 24, suffix: "h", label: "Response time" },
];

export function Stats() {
  return (
    <section className="border-y border-line bg-white/70 backdrop-blur-sm">
      <ScrollScene intensity={0.6} className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-y-10 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center">
              <div className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </ScrollScene>
    </section>
  );
}
