"use client";

import { motion } from "motion/react";
import { IconArrowRight } from "@/components/ui/icons";
import { ScrollScene } from "@/components/ui/ScrollScene";
import { fadeUp, viewportOnce } from "@/lib/animations";

export function CTABand() {
  return (
    <section className="relative py-16 sm:py-24">
      <ScrollScene className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-[1.75rem] border border-line bg-gradient-to-br from-white to-band-deep px-7 py-14 sm:px-14 sm:py-16"
        >
          {/* hairline accent at the top edge */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />
          {/* faint corner grid for texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-[0.5]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.08) 1px, transparent 0)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(circle at 70% 30%, black, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at 70% 30%, black, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Let&apos;s build
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.05]">
              Have something worth building?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
              Tell us what you&apos;re working on. We&apos;ll reply within 24 hours
              with a clear, honest next step — no sales runaround.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#contact"
                className="shine group inline-flex items-center gap-2.5 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-primary"
              >
                Start a project
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </ScrollScene>
    </section>
  );
}
