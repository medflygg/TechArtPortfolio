import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { createPortal } from "react-dom";

type Part = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  life: number;
  color: string;
  kind: BurstKind;
};

type BurstKind = "petal" | "smoke" | "spark" | "gold" | "cold";

export type BurstHandle = {
  spawn: (clientX: number, clientY: number, color: string, kind?: BurstKind) => void;
  spawnFrom: (el: HTMLElement, color: string, kind?: BurstKind) => void;
};

/** Client rects for each visible glyph inside an element. */
function glyphRects(el: HTMLElement): DOMRect[] {
  const out: DOMRect[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.nextNode();
  while (node) {
    const text = node.textContent ?? "";
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i]!)) continue;
      const range = document.createRange();
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      for (let j = 0; j < rects.length; j++) {
        const r = rects[j]!;
        if (r.width > 0.5 && r.height > 0.5) out.push(r);
      }
    }
    node = walker.nextNode();
  }
  if (!out.length) {
    const box = el.getBoundingClientRect();
    if (box.width > 1 && box.height > 1) out.push(box);
  }
  return out;
}

function pushBurst(
  parts: Part[],
  cx: number,
  cy: number,
  color: string,
  kind: BurstKind,
  count: number,
) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    // Slow drift — linger around the glyph before fading
    const sp =
      kind === "spark" ? 0.25 + Math.random() * 0.55 : kind === "smoke" ? 0.12 + Math.random() * 0.35 : 0.15 + Math.random() * 0.4;
    parts.push({
      x: cx + (Math.random() - 0.5) * 3,
      y: cy + (Math.random() - 0.5) * 3,
      vx: Math.cos(a) * sp * (kind === "spark" ? 1.1 : 0.75),
      vy: Math.sin(a) * sp * 0.65 - (kind === "smoke" ? 0.28 : 0.08),
      r:
        kind === "smoke"
          ? 8 + Math.random() * 14
          : kind === "petal"
            ? 4 + Math.random() * 7
            : 2.5 + Math.random() * 4.5,
      a: 0.55 + Math.random() * 0.4,
      life: 1,
      color,
      kind,
    });
  }
}

/**
 * Portal + viewport-fixed canvas: glyph-local particles, immune to parent
 * overflow / transform / isolation (which break in-tree fixed + canvas mapping).
 */
export const InteractionBurst = forwardRef<BurstHandle, { enabled?: boolean }>(function InteractionBurst(
  { enabled = true },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const partsRef = useRef<Part[]>([]);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useImperativeHandle(ref, () => ({
    spawn: (clientX, clientY, color, kind = "cold") => {
      if (!enabledRef.current) return;
      pushBurst(partsRef.current, clientX, clientY, color, kind, kind === "smoke" ? 14 : 10);
      if (partsRef.current.length > 220) partsRef.current.splice(0, partsRef.current.length - 220);
    },
    spawnFrom: (el, color, kind = "cold") => {
      if (!enabledRef.current || !el) return;
      const glyphs = glyphRects(el);
      if (!glyphs.length) return;

      const maxGlyphs = Math.min(glyphs.length, 20);
      const step = Math.max(1, Math.floor(glyphs.length / maxGlyphs));
      for (let i = 0; i < glyphs.length; i += step) {
        const g = glyphs[i]!;
        const cx = g.left + g.width * 0.5;
        const cy = g.top + g.height * 0.42;
        pushBurst(partsRef.current, cx, cy, color, kind, kind === "smoke" || kind === "petal" ? 2 : 1);
      }
      if (partsRef.current.length > 220) partsRef.current.splice(0, partsRef.current.length - 220);
    },
  }));

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dpr = canvas.width / Math.max(window.innerWidth, 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const list = partsRef.current;
      for (const p of list) {
        p.life *= 0.978;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        if (p.kind === "smoke") p.vy -= 0.012;
        if (p.kind === "petal") p.vx += Math.sin(p.y * 0.04) * 0.02;

        const alpha = Math.max(0, p.life * p.a);
        const rad = p.r * (0.55 + p.life * 0.55);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        g.addColorStop(0, p.color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = alpha * 0.72;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      partsRef.current = list.filter((p) => p.life > 0.04);
      ctx.globalAlpha = 1;
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled || typeof document === "undefined") return null;

  return createPortal(
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />,
    document.body,
  );
});
