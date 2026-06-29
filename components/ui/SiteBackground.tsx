"use client";

import { useEffect, useRef } from "react";

/**
 * Site backdrop:
 *  - gradient scene + static hairline grid (CSS)
 *  - moving blue dots connected by lines (canvas) — restored from the original site
 *  - top scroll-progress bar
 */
export function SiteBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // scroll progress
    const bar = barRef.current;
    const onScroll = () => {
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? window.scrollY / max : 0) * 100 + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // particle network
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const mouse = { x: -9999, y: -9999 };
    type Pt = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: Pt[] = [];

    if (canvas && ctx) {
      const size = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.width = window.innerWidth * dpr;
        h = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        const n = reduce ? 0 : Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 18000));
        pts = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.32 * dpr, vy: (Math.random() - 0.5) * 0.32 * dpr,
          r: (Math.random() * 1.6 + 1) * dpr,
        }));
      };

      const loop = () => {
        ctx.clearRect(0, 0, w, h);
        const mx = mouse.x * dpr, my = mouse.y * dpr, R = 150 * dpr;
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
          if (d < R) { const f = ((R - d) / R) * 1.3; p.x += (dx / d) * f; p.y += (dy / d) * f; }
        }
        const max = 135 * dpr;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const a = pts[i], b = pts[j];
            const dx = a.x - b.x, dy = a.y - b.y, dist = Math.hypot(dx, dy);
            if (dist < max) {
              ctx.strokeStyle = "rgba(14,165,233," + (1 - dist / max) * 0.22 + ")";
              ctx.lineWidth = dpr * 0.6;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (const p of pts) {
          ctx.fillStyle = "rgba(14,165,233,0.6)";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        }
        raf = requestAnimationFrame(loop);
      };

      const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      size();
      window.addEventListener("resize", size);
      window.addEventListener("pointermove", onMove);
      if (!reduce) loop();

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", size);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", onScroll);
      };
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="scroll-progress" ref={barRef} aria-hidden />
      <div className="bg-scene" aria-hidden />
      <div className="bg-grid" aria-hidden />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-[1] opacity-70"
      />
    </>
  );
}
