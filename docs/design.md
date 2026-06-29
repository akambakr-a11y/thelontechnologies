# Thelon Technologies — Website Design Spec

_Date: 2026-06-29_

## Goal
A premium, animated single-page marketing site for **Thelon Technologies Inc** that reads
like a top-tier SaaS company (Stripe / Notion / Linear calibre): light, clean, enterprise,
with tasteful, intentional motion.

## Stack
- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** (CSS-based `@theme` tokens)
- **motion** (Framer Motion) for animation
- **Resend** for the contact form (server Route Handler)
- Deploy target: **Vercel**

## Aesthetic
- Light theme: white + soft-gray (`#f7f9fc`) section bands, generous whitespace.
- Type: **Inter** (display + body). Tight, confident headings.
- Color: ink navy `#0b1b34`, muted `#54657e`, primary blue `#1263ff`,
  deep blue `#083cd9`, cyan accent `#20d4ff` (sparingly).
- Soft shadows, 1px hairline borders (`#e6ebf2`), rounded-2xl cards, glassy sticky nav.

## Sections (single scrolling page)
1. **Navbar** — glass, sticky, condenses on scroll; CTA button.
2. **Hero** — headline, subhead, dual CTA, animated product-UI visual + gradient mesh,
   staggered entrance, subtle parallax.
3. **Stats** — animated count-up (20+ yrs, 4 practices, 2 products, 24h response).
4. **Services** — 4 cards (AI Software, SaaS Platforms, Custom Software, Website Dev),
   scroll-stagger reveal + hover lift.
5. **Products** — featured ClashNex.ai + Chartrend.ai cards with mock UI.
6. **Process** — 3-step animated timeline (Discover & Define → Design & Build → Launch & Scale).
7. **Contact** — validated form → `/api/contact` (Resend), success animation.
8. **Footer** — links, copyright.

## Motion principles
- `whileInView` scroll reveals with staggered children.
- Hero entrance + `useScroll`/`useTransform` parallax.
- Animated counters, hover micro-interactions.
- Everything gated by `prefers-reduced-motion`.

## Architecture
- `app/page.tsx` — server component, composes section components.
- `components/site/*` — section components (client where motion is used).
- `components/ui/*` — `Reveal`, `Counter`, `Section`, `GradientMesh` primitives.
- `lib/animations.ts` — shared motion variants.
- `app/api/contact/route.ts` — Resend handler; env `RESEND_API_KEY`, `CONTACT_TO`.

## Contact form behaviour
- Client form with inline validation + success/error states and animation.
- POSTs JSON to `/api/contact`.
- If `RESEND_API_KEY` is absent, the route returns a friendly "not configured" message
  so the UI still works in dev; real sending activates once the key is set.
