"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BrainHub } from "@/components/ui/BrainHub";

/**
 * Hero centerpiece: one panel — a live code editor on the left and the animated
 * AI intelligence hub on the right, sharing the same window chrome.
 */
export function HeroSystem() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.65 }}
      className="relative w-full min-w-0"
    >
      {/* glow behind the editor */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-2 -top-6 bottom-0 -z-[1] rounded-[2rem] opacity-70 blur-2xl"
        style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(14,165,233,0.14), transparent 70%)" }}
      />
      <div className="overflow-hidden rounded-2xl border border-line bg-white/95 shadow-lift backdrop-blur">
        {/* tab bar */}
        <div className="flex items-center gap-2 border-b border-line bg-band px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex items-center gap-1">
            <span className="rounded-t-md border-x border-t border-line bg-white px-3 py-1.5 font-mono text-xs font-medium text-ink">
              engine.ts
            </span>
            <span className="px-3 py-1.5 font-mono text-xs text-muted">agent.ts</span>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary shadow-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
            </span>
            agent
          </span>
        </div>

        {/* body: code (left) + intelligence hub (right), blended on one canvas */}
        <div className="grid bg-[linear-gradient(125deg,#ffffff_0%,#f3f7fd_55%,#eaf1fb_100%)] lg:grid-cols-[1.06fr_0.94fr]">
          {/* code */}
          <div className="flex">
            <div
              aria-hidden
              className="select-none px-3 py-5 text-right font-mono text-[12.5px] leading-[1.75] text-muted/40"
            >
              {Array.from({ length: TOTAL_LINES }, (_, i) => (
                <div key={i}>{String(i + 1).padStart(2, "0")}</div>
              ))}
            </div>
            <CodePane />
          </div>
          {/* intelligence hub */}
          <div className="flex items-center justify-center p-4">
            <BrainHub />
          </div>
        </div>

        {/* status bar */}
        <div className="flex items-center justify-between border-t border-line bg-band px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            main · agent: build → ship
          </span>
          <span className="hidden sm:inline">TypeScript · 99.98% uptime · 12.4k req/s</span>
        </div>
      </div>
    </motion.div>
  );
}

type Tok = [string, string];
const LINES: Tok[][] = [
  [["cc-com", "// thelon · ship AI to production"]],
  [["cc-key", "import "], ["", "{ Agent, Model, Pipeline } "], ["cc-key", "from "], ["cc-str", '"@thelon/core"']],
  [["", ""]],
  [["cc-key", "const "], ["", "engine = new "], ["cc-fn", "Agent"], ["", "({"]],
  [["", "  model: "], ["cc-str", '"reasoning-pro"'], ["", ","]],
  [["", "  tools: ["], ["cc-fn", "search"], ["", ", "], ["cc-fn", "code"], ["", ", "], ["cc-fn", "deploy"], ["", "],"]],
  [["", "  memory: "], ["cc-key", "true"], ["", ","]],
  [["", "});"]],
  [["", ""]],
  [["cc-key", "const "], ["", "pipeline = "], ["cc-fn", "Pipeline"], ["", "."], ["cc-fn", "from"], ["", "(engine)"]],
  [["", "  ."], ["cc-fn", "validate"], ["", "(schema)"]],
  [["", "  ."], ["cc-fn", "observe"], ["", "(metrics);"]],
  [["", ""]],
  [["cc-key", "export async function "], ["cc-fn", "handle"], ["", "(task) {"]],
  [["", "  "], ["cc-key", "const "], ["", "out = "], ["cc-key", "await "], ["", "pipeline."], ["cc-fn", "run"], ["", "(task);"]],
  [["", "  "], ["cc-key", "return "], ["", "out."], ["cc-fn", "ship"], ["", "();  "], ["cc-com", "// → prod"]],
  [["", "}"]],
];
const TOTAL_LINES = LINES.length;

function CodePane() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let li = 0, cls = 0, ch = 0, html = "";
    let timer: ReturnType<typeof setTimeout>;

    const render = () => {
      el.innerHTML = '<div class="cc-body">' + html + '<span class="cc-caret"></span></div>';
    };

    if (reduce) {
      LINES.forEach((l) => {
        l.forEach((t) => (html += '<span class="' + t[0] + '">' + esc(t[1]) + "</span>"));
        html += "\n";
      });
      render();
      return;
    }

    const tick = () => {
      // type once, then hold with a blinking caret (no jarring erase loop)
      if (li >= LINES.length) { render(); return; }
      const tok = LINES[li][cls];
      if (!tok) {
        li++; cls = 0; ch = 0;
        if (li < LINES.length) html += "\n"; // no trailing newline after the last line
        render();
        timer = setTimeout(tick, 70);
        return;
      }
      const [k, text] = tok;
      if (ch === 0) html += '<span class="' + k + '">';
      if (ch < text.length) { html += esc(text[ch]); ch++; render(); timer = setTimeout(tick, 14 + Math.random() * 24); return; }
      html += "</span>"; cls++; ch = 0; render(); timer = setTimeout(tick, 14);
    };

    render();
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden
      className="min-w-0 flex-1 overflow-hidden whitespace-pre px-4 py-5 font-mono text-[12.5px] leading-[1.75] sm:px-5"
    >
      <div ref={ref} />
    </div>
  );
}
