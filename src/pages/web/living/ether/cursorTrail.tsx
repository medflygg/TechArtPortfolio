import { useEffect, useRef } from "react";
import type { IngredientId } from "./etherWorld";
import { INGREDIENTS } from "./etherWorld";

type Props = {
  ingredient: IngredientId | null;
  accent: string;
  enabled: boolean;
};

/** Soft luminous trail — no hard white dots. */
export function CursorTrail({ ingredient, accent, enabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<{ x: number; y: number; life: number }[]>([]);
  const ptr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || !ingredient) {
      points.current = [];
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let lastPush = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dpr = canvas.width / Math.max(r.width, 1);
      ptr.current.x = (e.clientX - r.left) * dpr;
      ptr.current.y = (e.clientY - r.top) * dpr;
      const now = performance.now();
      if (now - lastPush < 28) return;
      lastPush = now;
      points.current.push({ x: ptr.current.x, y: ptr.current.y, life: 1 });
      if (points.current.length > 14) points.current.shift();
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const trail = INGREDIENTS[ingredient].trail;
      const color = INGREDIENTS[ingredient].accent || accent;

      for (const p of points.current) {
        p.life *= 0.92;
        const base =
          trail === "smoke" ? 22 : trail === "petal" ? 16 : trail === "gold" ? 12 : trail === "spark" ? 10 : 14;
        const size = base * p.life;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        g.addColorStop(0, color);
        g.addColorStop(0.35, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = Math.max(0, p.life * 0.22);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      points.current = points.current.filter((p) => p.life > 0.08);
      ctx.globalAlpha = 1;
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [enabled, ingredient, accent]);

  if (!enabled || !ingredient) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}
    />
  );
}
