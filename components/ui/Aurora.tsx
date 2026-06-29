/**
 * Soft animated gradient blobs + grid used as a light, premium backdrop.
 * Pure CSS animation (see globals.css) so it works without JS and respects
 * prefers-reduced-motion.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Subtle dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(11,27,52,0.06) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />
      {/* Colour blobs */}
      <div
        className="aurora-blob absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(32,212,255,0.35), transparent 60%)",
          animation: "aurora-drift 14s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob absolute -top-10 right-[12%] h-[28rem] w-[28rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(18,99,255,0.30), transparent 60%)",
          animation: "aurora-drift 18s ease-in-out infinite reverse",
        }}
      />
      <div
        className="aurora-blob absolute top-24 left-[8%] h-[24rem] w-[24rem] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(8,60,217,0.20), transparent 60%)",
          animation: "aurora-drift 22s ease-in-out infinite",
        }}
      />
    </div>
  );
}
