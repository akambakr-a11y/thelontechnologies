"use client";

import { motion } from "motion/react";
import { Section, Eyebrow } from "@/components/ui/Section";
import {
  IconBrain,
  IconLayers,
  IconCode,
  IconGlobe,
  IconSpark,
  IconShield,
  IconChart,
  IconBolt,
} from "@/components/ui/icons";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { useTilt } from "@/lib/useTilt";

const services = [
  {
    icon: IconBrain,
    title: "AI Software Development",
    desc: "Custom models, agents, and AI-native workflows built into your product — from retrieval pipelines to autonomous systems.",
  },
  {
    icon: IconLayers,
    title: "SaaS Platforms",
    desc: "Multi-tenant platforms with auth, billing, and real-time data — architected to scale from your first user to your millionth.",
  },
  {
    icon: IconCode,
    title: "Custom Software",
    desc: "Bespoke systems that fit how your business actually works, integrated cleanly with the tools your team already uses.",
  },
  {
    icon: IconGlobe,
    title: "Website Development",
    desc: "Fast, polished marketing sites and web apps engineered for performance, accessibility, and conversion.",
  },
];

const capabilities = [
  { icon: IconSpark, label: "AI Automation" },
  { icon: IconBolt, label: "Workflow Orchestration" },
  { icon: IconShield, label: "Secure & Scalable" },
  { icon: IconChart, label: "Real-time Insights" },
];

export function Services() {
  const tilt = useTilt();
  return (
    <Section id="services" band>
      <div className="max-w-2xl">
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          One team for every layer of your product.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Strategy, design, engineering, and AI under one roof — so the thing
          we ship is coherent, fast, and genuinely yours.
        </p>
      </div>

      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((s) => (
          <motion.article
            key={s.title}
            variants={fadeUp}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="tilt group relative overflow-hidden rounded-card border border-line bg-white/90 p-6 shadow-soft backdrop-blur hover:shadow-lift"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-band text-primary ring-1 ring-line transition-colors group-hover:bg-primary group-hover:text-white">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
          </motion.article>
        ))}
      </motion.div>

      {/* Capability chips */}
      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-8 flex flex-wrap gap-3"
      >
        {capabilities.map((c) => (
          <motion.span
            key={c.label}
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-soft shadow-soft"
          >
            <c.icon className="h-4 w-4 text-primary" />
            {c.label}
          </motion.span>
        ))}
      </motion.div>
    </Section>
  );
}
