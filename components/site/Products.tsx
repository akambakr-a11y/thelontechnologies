"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { IconArrowRight, IconCheck } from "@/components/ui/icons";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { useTilt } from "@/lib/useTilt";

const products = [
  {
    name: "ClashNex.ai",
    tagline: "Construction drawing intelligence",
    desc: "Reads architectural, structural, and trade drawings together — surfacing clashes, missing information, and contradictions with clear evidence before they become RFIs, delays, or rework.",
    points: ["Automated clash detection", "Drawing-set analysis", "RFI-ready output"],
    href: "https://clashnex.ai",
    image: "/assets/product-clashnex.webp",
    width: 1022,
    height: 788,
  },
  {
    name: "Chartrend.ai",
    tagline: "AI-powered market analysis",
    desc: "Turns chart noise into clear, structured market outlooks — bias, key levels, and confidence scoring — so traders see the reasoning in seconds instead of drowning in indicators.",
    points: ["Confidence scoring", "Structured outlooks", "Backtesting insights"],
    href: "https://chartrend.ai",
    image: "/assets/product-chartrend.webp",
    width: 1322,
    height: 944,
  },
];

export function Products() {
  const tilt = useTilt();
  return (
    <Section id="products">
      <div className="max-w-2xl">
        <Eyebrow>Featured products</Eyebrow>
        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Live AI products, built and shipped by us.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          We don&apos;t just consult — we operate our own products in production.
          The same team and standards go into everything we build for clients.
        </p>
      </div>

      <motion.div
        variants={stagger(0.14)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12 grid gap-6 lg:grid-cols-2"
      >
        {products.map((p) => (
          <motion.article
            key={p.name}
            variants={fadeUp}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="tilt group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft hover:shadow-lift"
          >
            {/* Real product screenshot */}
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-[16/10] overflow-hidden border-b border-line bg-band"
            >
              <Image
                src={p.image}
                alt={`${p.name} product interface`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-soft backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </a>

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="font-display text-xl font-bold text-ink">{p.name}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{p.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>

              <ul className="mt-5 grid gap-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-ink-soft">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-band text-primary">
                      <IconCheck className="h-3 w-3" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary"
              >
                Visit {p.name}
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
