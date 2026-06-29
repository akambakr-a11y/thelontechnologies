import type { ReactNode } from "react";
import { ScrollScene } from "@/components/ui/ScrollScene";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  band?: boolean;
};

/**
 * Consistent vertical rhythm + max-width container for page sections.
 */
export function Section({ id, children, className = "", band = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-20 sm:py-28 ${
        band ? "bg-band/70 backdrop-blur-sm" : "bg-transparent"
      } ${className}`}
    >
      <ScrollScene className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</ScrollScene>
    </section>
  );
}

type EyebrowProps = { children: ReactNode };

export function Eyebrow({ children }: EyebrowProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-soft">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}
