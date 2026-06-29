"use client";

import { useRef, type ReactNode } from "react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

/**
 * A button/link that subtly follows the cursor (magnetic effect) and, for the
 * primary variant, sweeps a shine across on hover.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${(y * 0.35).toFixed(1)}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const base =
    "group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-[background,box-shadow,color] duration-200 will-change-transform";
  const styles =
    variant === "primary"
      ? "shine bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_18px_38px_rgba(18,99,255,0.28)] hover:shadow-glow"
      : "border border-line bg-white/80 text-ink shadow-soft backdrop-blur hover:bg-band";

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
