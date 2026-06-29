"use client";

import { useEffect, useRef } from "react";

const ICON: Record<string, string> = {
  SaaS: '<svg viewBox="0 0 24 24"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/></svg>',
  Data: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
  Web: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 2.5 15.4 0 18"/><path d="M12 3c-2.5 2.6-2.5 15.4 0 18"/></svg>',
  Cloud: '<svg viewBox="0 0 24 24"><path d="M17.5 18a4.5 4.5 0 0 0 .3-9 6 6 0 0 0-11.6 1.5A4 4 0 0 0 6.5 18h11z"/></svg>',
  API: '<svg viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5"/><path d="M15 7l5 5-5 5"/></svg>',
};
const LABELS = ["SaaS", "Data", "Web", "Cloud", "API"];

/**
 * Animated "intelligence engine": a central AI brain core, orbiting service
 * nodes, traveling data pulses, rotating orbit rings, and ambient particles.
 * Ported from the original Thelon hero visualization.
 */
export function IntelligenceEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = canvasRef.current;
    const layer = layerRef.current;
    if (!c || !layer) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let t = 0;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    type Node = {
      x: number;
      y: number;
      bx: number;
      by: number;
      a: number;
      label?: string;
      recv: number;
      core?: boolean;
    };
    type Pulse = { from: Node; to: Node; toIdx: number; p: number; sp: number };
    type Amb = { x: number; y: number; vx: number; vy: number; r: number };

    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let amb: Amb[] = [];

    // Build HTML node chips (synced to canvas positions).
    layer.innerHTML = "";
    const els = LABELS.map((l) => {
      const d = document.createElement("div");
      d.className = "node";
      d.innerHTML =
        '<div class="node-chip">' + ICON[l] + '</div><div class="node-label">' + l + "</div>";
      layer.appendChild(d);
      return d;
    });

    const size = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.width = r.width * dpr;
      h = c.height = r.height * dpr;
      const cx = w / 2;
      const cy = h / 2;
      const rad = Math.min(w, h) * 0.36;
      nodes = LABELS.map((l, i) => {
        const a = (i / LABELS.length) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(a) * rad,
          y: cy + Math.sin(a) * rad,
          bx: cx + Math.cos(a) * rad,
          by: cy + Math.sin(a) * rad,
          a,
          label: l,
          recv: 0,
        };
      });
      nodes.push({ x: cx, y: cy, bx: cx, by: cy, a: 0, core: true, recv: 0 });
      amb = Array.from({ length: reduce ? 0 : 30 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        vy: (Math.random() - 0.5) * 0.3 * dpr,
        r: (Math.random() * 1.4 + 0.6) * dpr,
      }));
    };

    const brain = (x: number, y: number, s: number) => {
      ctx.strokeStyle = "#fff";
      ctx.fillStyle = "rgba(255,255,255,.12)";
      ctx.lineWidth = 1.3 * s;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x, y - 7 * s);
      ctx.bezierCurveTo(x - 4 * s, y - 9 * s, x - 8 * s, y - 7 * s, x - 8 * s, y - 3 * s);
      ctx.bezierCurveTo(x - 11 * s, y - 2 * s, x - 10 * s, y + 3 * s, x - 7 * s, y + 4 * s);
      ctx.bezierCurveTo(x - 8 * s, y + 8 * s, x - 3 * s, y + 9 * s, x, y + 6.5 * s);
      ctx.bezierCurveTo(x + 3 * s, y + 9 * s, x + 8 * s, y + 8 * s, x + 7 * s, y + 4 * s);
      ctx.bezierCurveTo(x + 10 * s, y + 3 * s, x + 11 * s, y - 2 * s, x + 8 * s, y - 3 * s);
      ctx.bezierCurveTo(x + 8 * s, y - 7 * s, x + 4 * s, y - 9 * s, x, y - 7 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - 7 * s);
      ctx.bezierCurveTo(x - 1.2 * s, y - 3 * s, x + 1.2 * s, y + 1 * s, x, y + 6.5 * s);
      ctx.stroke();
      ctx.lineWidth = 1 * s;
      ctx.beginPath();
      ctx.moveTo(x - 1.5 * s, y - 4.5 * s);
      ctx.bezierCurveTo(x - 5 * s, y - 5 * s, x - 5 * s, y - 2 * s, x - 2.5 * s, y - 2 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 2 * s, y - 1 * s);
      ctx.bezierCurveTo(x - 6 * s, y - 1.5 * s, x - 6 * s, y + 2.5 * s, x - 2.5 * s, y + 2 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 1.5 * s, y - 4.5 * s);
      ctx.bezierCurveTo(x + 5 * s, y - 5 * s, x + 5 * s, y - 2 * s, x + 2.5 * s, y - 2 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 2 * s, y - 1 * s);
      ctx.bezierCurveTo(x + 6 * s, y - 1.5 * s, x + 6 * s, y + 2.5 * s, x + 2.5 * s, y + 2 * s);
      ctx.stroke();
      ctx.fillStyle = "rgba(160,210,255,.9)";
      [[-6, -6], [6, -6], [-7, 1], [7, 1], [0, -8]].forEach((p) => {
        ctx.beginPath();
        ctx.arc(x + p[0] * s, y + p[1] * s, 0.9 * s, 0, 7);
        ctx.fill();
      });
    };

    const spawn = () => {
      if (reduce) return;
      const core = nodes[nodes.length - 1];
      const oi = Math.floor(Math.random() * (nodes.length - 1));
      const o = nodes[oi];
      const out = Math.random() > 0.5;
      pulses.push({
        from: out ? core : o,
        to: out ? o : core,
        toIdx: out ? oi : -1,
        p: 0,
        sp: 0.006 + Math.random() * 0.006,
      });
    };

    let acc = 0;
    const loop = () => {
      t += 0.016;
      acc += 1;
      if (acc > 18) {
        spawn();
        acc = 0;
      }
      ctx.clearRect(0, 0, w, h);
      const core = nodes[nodes.length - 1];
      const cx = w / 2;
      const cy = h / 2;

      const wash = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.6);
      wash.addColorStop(0, "rgba(247,251,255,.92)");
      wash.addColorStop(0.55, "rgba(247,251,255,.6)");
      wash.addColorStop(1, "rgba(247,251,255,0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      for (const p of amb) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = "rgba(18,99,255,.16)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fill();
      }

      const R = Math.min(w, h) * 0.45;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.12);
      ctx.strokeStyle = "rgba(32,160,255,.2)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.setLineDash([6 * dpr, 10 * dpr]);
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, 7);
      ctx.stroke();
      ctx.restore();
      ctx.setLineDash([]);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.08);
      ctx.strokeStyle = "rgba(18,99,255,.12)";
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.84, 0, 7);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.05);
      ctx.strokeStyle = "rgba(32,170,255,.08)";
      ctx.lineWidth = 1 * dpr;
      ctx.setLineDash([2 * dpr, 8 * dpr]);
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.62, 0, 7);
      ctx.stroke();
      ctx.restore();
      ctx.setLineDash([]);
      for (let k = 0; k < 3; k++) {
        const a = t * 0.5 + k * 2.1;
        ctx.fillStyle = "rgba(40,170,255,.5)";
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 2.4 * dpr, 0, 7);
        ctx.fill();
      }

      for (const n of nodes) {
        const fx = Math.sin(t * 0.8 + n.a * 3) * 6 * dpr;
        const fy = Math.cos(t * 0.7 + n.a * 2) * 6 * dpr;
        let tx = n.bx + fx;
        let ty = n.by + fy;
        const dx = tx - mouse.x * dpr;
        const dy = ty - mouse.y * dpr;
        const d = Math.hypot(dx, dy);
        const RR = 80 * dpr;
        if (d < RR) {
          tx += (dx / d) * (RR - d) * 0.35;
          ty += (dy / d) * (RR - d) * 0.35;
        }
        n.x += (tx - n.x) * 0.08;
        n.y += (ty - n.y) * 0.08;
      }

      for (let i = 0; i < nodes.length - 1; i++) {
        const n = nodes[i];
        const g = ctx.createLinearGradient(core.x, core.y, n.x, n.y);
        g.addColorStop(0, "rgba(18,99,255,.35)");
        g.addColorStop(1, "rgba(32,170,255,.1)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(core.x, core.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(32,160,255,.14)";
      ctx.lineWidth = 1.1 * dpr;
      ctx.beginPath();
      for (let i = 0; i < nodes.length - 1; i++) {
        const n = nodes[i];
        if (i) ctx.lineTo(n.x, n.y);
        else ctx.moveTo(n.x, n.y);
      }
      ctx.closePath();
      ctx.stroke();

      pulses = pulses.filter((pu) => pu.p < 1);
      for (const pu of pulses) {
        const prev = pu.p;
        pu.p += pu.sp;
        if (prev < 1 && pu.p >= 1 && pu.toIdx >= 0) nodes[pu.toIdx].recv = 1;
        const x = pu.from.x + (pu.to.x - pu.from.x) * pu.p;
        const y = pu.from.y + (pu.to.y - pu.from.y) * pu.p;
        const tr = Math.max(0, pu.p - 0.12);
        const xt = pu.from.x + (pu.to.x - pu.from.x) * tr;
        const yt = pu.from.y + (pu.to.y - pu.from.y) * tr;
        const tg = ctx.createLinearGradient(xt, yt, x, y);
        tg.addColorStop(0, "rgba(40,170,255,0)");
        tg.addColorStop(1, "rgba(40,170,255,.7)");
        ctx.strokeStyle = tg;
        ctx.lineWidth = 2.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(xt, yt);
        ctx.lineTo(x, y);
        ctx.stroke();
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 7 * dpr);
        grd.addColorStop(0, "rgba(60,180,255,.95)");
        grd.addColorStop(1, "rgba(60,180,255,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, 7 * dpr, 0, 7);
        ctx.fill();
      }

      const pulse = 1 + Math.sin(t * 2) * 0.06;
      const cg = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, 72 * dpr * pulse);
      cg.addColorStop(0, "rgba(18,99,255,.34)");
      cg.addColorStop(1, "rgba(18,99,255,0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(core.x, core.y, 72 * dpr * pulse, 0, 7);
      ctx.fill();
      const coreG = ctx.createLinearGradient(
        core.x - 26 * dpr,
        core.y - 26 * dpr,
        core.x + 26 * dpr,
        core.y + 26 * dpr
      );
      coreG.addColorStop(0, "#1234ff");
      coreG.addColorStop(1, "#0a83ff");
      ctx.fillStyle = coreG;
      ctx.beginPath();
      ctx.arc(core.x, core.y, 28 * dpr, 0, 7);
      ctx.fill();
      brain(core.x, core.y, 2.1 * dpr);

      for (let i = 0; i < els.length; i++) {
        const n = nodes[i];
        els[i].style.left = n.x / dpr + "px";
        els[i].style.top = n.y / dpr + "px";
        if (n.recv > 0) {
          n.recv -= 0.04;
          els[i].classList.toggle("recv", n.recv > 0);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    size();
    window.addEventListener("resize", size);
    const parent = c.parentElement;
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);

    if (reduce) {
      // Draw a single static frame.
      loop();
      cancelAnimationFrame(raf);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="hero-stage">
      <div className="stage-panel">
        <div className="panel-bar">
          <span className="panel-dot r" />
          <span className="panel-dot y" />
          <span className="panel-dot g" />
          <span className="panel-title">thelon · intelligence engine</span>
          <span className="panel-live">
            <i />
            live
          </span>
        </div>
        <CodeConsole />
        <canvas ref={canvasRef} className="sys-canvas" />
        <div className="node-layer" ref={layerRef} />
      </div>

      <div className="chip chip-1">
        <span className="chip-k">Uptime</span>
        <b>99.98%</b>
      </div>
      <div className="chip chip-2">
        <span className="chip-k">Throughput</span>
        <b>12.4k/s</b>
      </div>
      <div className="chip chip-3">
        <span className="chip-k">Models</span>
        <b>Active</b>
      </div>
    </div>
  );
}

/* ---- live typing code console ---- */
type Tok = [string, string];
const LINES: Tok[][] = [
  [["cc-com", "// thelon intelligence engine"]],
  [["cc-key", "import "], ["", "{ Thelon, Pipeline } "], ["cc-key", "from "], ["cc-str", '"@thelon/core"']],
  [["", ""]],
  [["cc-key", "const "], ["", "engine = new "], ["cc-fn", "Thelon"], ["", "({"]],
  [["", "  mode: "], ["cc-str", '"realtime"'], ["", ","]],
  [["", "  models: "], ["cc-num", "12"], ["", ","]],
  [["", "  region: "], ["cc-str", '"global"'], ["", ","]],
  [["", "  scale: "], ["cc-key", "true"]],
  [["", "});"]],
  [["", ""]],
  [["cc-key", "async function "], ["cc-fn", "handle"], ["", "(req) {"]],
  [["", "  "], ["cc-key", "const "], ["", "out = "], ["cc-key", "await "], ["", "engine."], ["cc-fn", "run"], ["", "(req);"]],
  [["", "  "], ["cc-key", "return "], ["", "out."], ["cc-fn", "deploy"], ["", "();"]],
  [["", "}"]],
  [["", ""]],
  [["cc-com", "// 99.98% uptime · 12.4k req/s"]],
  [["", "Pipeline."], ["cc-fn", "from"], ["", "(engine)."], ["cc-fn", "start"], ["", "();"]],
];

function CodeConsole() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let li = 0;
    let cls = 0;
    let ch = 0;
    let html = "";
    let timer: ReturnType<typeof setTimeout>;

    const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const render = () => {
      el.innerHTML = '<div class="cc-body">' + html + '<span class="cc-caret"></span></div>';
    };

    if (reduce) {
      LINES.forEach((l) => {
        l.forEach((tk) => {
          html += '<span class="' + tk[0] + '">' + esc(tk[1]) + "</span>";
        });
        html += "\n";
      });
      render();
      return;
    }

    const tick = () => {
      if (li >= LINES.length) {
        timer = setTimeout(() => {
          li = 0;
          cls = 0;
          ch = 0;
          html = "";
          tick();
        }, 2600);
        return;
      }
      const tok = LINES[li][cls];
      if (!tok) {
        html += "\n";
        li++;
        cls = 0;
        ch = 0;
        render();
        timer = setTimeout(tick, 90);
        return;
      }
      const [klass, text] = tok;
      if (ch === 0) html += '<span class="' + klass + '">';
      if (ch < text.length) {
        html += esc(text[ch]);
        ch++;
        render();
        timer = setTimeout(tick, 18 + Math.random() * 30);
        return;
      }
      html += "</span>";
      cls++;
      ch = 0;
      render();
      timer = setTimeout(tick, 20);
    };

    render();
    tick();
    return () => clearTimeout(timer);
  }, []);

  return <div className="code-console" ref={ref} />;
}
