import { useEffect, useRef } from "react";
import { hexToRgb } from "../shaders/webEffects";

type Props = {
  params: Record<string, number | string>;
  image?: TexImageSource | null;
  onError?: (message: string | null) => void;
};

const VERT = `
attribute vec2 aPos;
uniform vec2 uRes;
uniform vec2 uOffset;
uniform float uSize;
void main() {
  vec2 p = (aPos + uOffset) / uRes * 2.0 - 1.0;
  gl_Position = vec4(p.x, p.y, 0.0, 1.0);
  gl_PointSize = uSize;
}
`;

const FRAG = `
precision mediump float;
uniform vec3 uTint;
uniform float uAlpha;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  float a = uAlpha * (1.0 - d);
  gl_FragColor = vec4(uTint * a, a);
}
`;

const MAX = 14000;

function num(params: Record<string, number | string>, key: string, fallback: number) {
  const v = params[key];
  return typeof v === "number" ? v : fallback;
}

function hex(params: Record<string, number | string>, key: string, fallback: string) {
  const v = params[key];
  return typeof v === "string" ? v : fallback;
}

function logoRect(w: number, h: number, scale: number) {
  const size = Math.min(w, h) * (Math.max(scale, 0.25) / 1.28);
  return {
    x: w * 0.5 - size * 0.5,
    y: h * 0.5 - size * 0.5,
    size,
  };
}

function spawn(
  source: TexImageSource,
  w: number,
  h: number,
  scale: number,
  density: number,
) {
  const tmp = document.createElement("canvas");
  const sw =
    "width" in source && typeof source.width === "number" ? source.width : 1024;
  const sh =
    "height" in source && typeof source.height === "number" ? source.height : 1024;
  tmp.width = sw;
  tmp.height = sh;
  const ctx = tmp.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, sw, sh);
  ctx.drawImage(source as CanvasImageSource, 0, 0, sw, sh);
  const img = ctx.getImageData(0, 0, sw, sh).data;
  const rect = logoRect(w, h, scale);
  const stride = density > 0.85 ? 3 : density > 0.55 ? 4 : 5;
  const hx: number[] = [];
  const hy: number[] = [];
  for (let y = 0; y < sh; y += stride) {
    for (let x = 0; x < sw; x += stride) {
      const a = img[(y * sw + x) * 4];
      if (a < 70) continue;
      const jitter = ((x * 13 + y * 17) % 7) / 7;
      // ~2× denser than the previous sparse pass.
      if (jitter > density * 0.72) continue;
      hx.push(rect.x + (x / sw) * rect.size);
      hy.push(rect.y + (1 - y / sh) * rect.size);
      if (hx.length >= MAX) {
        y = sh;
        break;
      }
    }
  }
  const n = hx.length;
  const homeX = new Float32Array(hx);
  const homeY = new Float32Array(hy);
  const slotA = new Float32Array(n);
  const slotR = new Float32Array(n);
  const lag = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    slotA[i] = Math.random() * Math.PI * 2;
    slotR[i] = Math.pow(Math.random(), 0.56) * (0.84 + Math.random() * 0.32);
    // Per-grain follow rate — outer/slower grains make the comet tail.
    lag[i] = 0.035 + Math.random() * 0.09;
  }
  return {
    n,
    homeX,
    homeY,
    x: new Float32Array(homeX),
    y: new Float32Array(homeY),
    // Lagged magnet anchors — each grain chases the tip at its own rate.
    ax: new Float32Array(homeX),
    ay: new Float32Array(homeY),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    grab: new Float32Array(n),
    prevGrab: new Float32Array(n),
    slotA,
    slotR,
    lag,
    seed: Float32Array.from({ length: n }, () => Math.random()),
  };
}

export function LogoParticlesCanvas({ params, image, onError }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const imageRef = useRef(image);
  imageRef.current = image;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    mount.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      onError?.("WebGL is required");
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error("shader");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s) || "compile";
        gl.deleteShader(s);
        throw new Error(log);
      }
      return s;
    };

    let prog: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    let raf = 0;
    const mouse = { x: 0, y: 0, px: 0, py: 0, inside: 0 };
    const pos = new Float32Array(MAX * 2);
    let cloud: ReturnType<typeof spawn> | null = null;
    let lastSrc: TexImageSource | null | undefined;
    let lastScale = -1;
    let lastDensity = -1;
    let lastW = 0;
    let lastH = 0;
    const t0 = performance.now();

    try {
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);
      prog = gl.createProgram();
      if (!prog) throw new Error("program");
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog) || "link");
      }
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      onError?.(null);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Particles failed");
      mount.removeChild(canvas);
      return;
    }

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uOffset = gl.getUniformLocation(prog, "uOffset");
    const uSize = gl.getUniformLocation(prog, "uSize");
    const uTint = gl.getUniformLocation(prog, "uTint");
    const uAlpha = gl.getUniformLocation(prog, "uAlpha");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(mount.clientWidth * dpr));
      const h = Math.max(1, Math.floor(mount.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      lastSrc = undefined;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dprX = canvas.width / Math.max(rect.width, 1);
      const dprY = canvas.height / Math.max(rect.height, 1);
      mouse.x = (e.clientX - rect.left) * dprX;
      mouse.y = (rect.height - (e.clientY - rect.top)) * dprY;
      if (!mouse.inside) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }
      mouse.inside = 1;
    };
    const onLeave = () => {
      mouse.inside = 0;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerenter", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!prog) return;
      const p = paramsRef.current;
      const scale = num(p, "uScale", 0.92);
      const density = num(p, "uDetail", 0.72);
      const src = imageRef.current;
      if (
        src &&
        (src !== lastSrc ||
          scale !== lastScale ||
          density !== lastDensity ||
          canvas.width !== lastW ||
          canvas.height !== lastH)
      ) {
        cloud = spawn(src, canvas.width, canvas.height, scale, density);
        lastSrc = src;
        lastScale = scale;
        lastDensity = density;
        lastW = canvas.width;
        lastH = canvas.height;
      }
      if (!src) {
        cloud = null;
        lastSrc = src;
      }

      const bg = hexToRgb(hex(p, "uBg", "#05060a"));
      gl.useProgram(prog);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(bg[0], bg[1], bg[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!cloud || cloud.n < 1) return;

      const jitter = num(p, "uSpeed", 0.2);
      const grain = num(p, "uIntensity", 1.1);
      const chase = num(p, "uWarp", 1.05);
      const contrast = num(p, "uContrast", 0.75);
      const minWH = Math.min(canvas.width, canvas.height);

      // Capture only a small neighbourhood of the tip.
      const captureR = minWH * (0.035 + 0.025 * contrast);
      const captureR2 = captureR * captureR;
      // Leash from each grain's HOME — ~3.5× previous so carry feels usable.
      const leashR = minWH * (0.16 + 0.1 * contrast);
      const leashR2 = leashR * leashR;
      // Gravity well = 1.8× capture (1.2 × 1.5) — local lean, not the whole wordmark.
      const gravR = captureR * 1.8;
      const gravR2 = gravR * gravR;
      const gravLean = captureR * 0.7;
      // Small packed head — still tiny vs the old blob.
      const clumpR = minWH * 0.018;
      const dot = Math.max(1.1, 1.15 + grain * 0.65);

      mouse.px += (mouse.x - mouse.px) * 0.35;
      mouse.py += (mouse.y - mouse.py) * 0.35;
      const magX = mouse.px;
      const magY = mouse.py;
      const holding = mouse.inside > 0.5;

      const {
        n,
        homeX,
        homeY,
        x,
        y,
        ax,
        ay,
        vx,
        vy,
        grab,
        prevGrab,
        slotA,
        slotR,
        lag,
        seed,
      } = cloud;
      const time = (performance.now() - t0) * 0.001;

      for (let i = 0; i < n; i++) {
        const hx = homeX[i];
        const hy = homeY[i];
        const hdx = magX - hx;
        const hdy = magY - hy;
        const homeDist2 = hdx * hdx + hdy * hdy;
        const pdx = magX - x[i];
        const pdy = magY - y[i];
        const partDist2 = pdx * pdx + pdy * pdy;

        // Gravity shifts the rest seat toward the cursor (never grabs).
        let restX = hx;
        let restY = hy;
        let gravW = 0;
        if (holding && homeDist2 < gravR2) {
          const hd = Math.sqrt(homeDist2) + 1e-3;
          const fall = 1 - hd / gravR;
          gravW = fall * fall;
          const lean = gravLean * gravW * (0.85 + 0.4 * chase);
          restX = hx + (hdx / hd) * lean;
          restY = hy + (hdy / hd) * lean;
        }

        if (holding && homeDist2 < captureR2 && partDist2 < captureR2 * 2.5) {
          grab[i] = Math.min(1, grab[i] + (0.08 + 0.12 * chase) * (1 - grab[i]));
        } else if (homeDist2 > leashR2 || !holding) {
          grab[i] *= homeDist2 > leashR2 ? 0.95 : 0.9;
          if (grab[i] < 0.015) grab[i] = 0;
        } else {
          grab[i] *= 0.985;
          if (grab[i] < 0.015) grab[i] = 0;
        }

        const g = grab[i];
        const pastLeash = homeDist2 > leashR2 || !holding;
        const carried = g > 0.04 && !pastLeash;
        if (prevGrab[i] > 0.04 && (!carried || pastLeash)) {
          const fallX = x[i] - hx;
          const fallY = y[i] - hy;
          const fall = Math.hypot(fallX, fallY) + 1e-3;
          // Gentle send-off toward home — no hard snap impulse.
          vx[i] = vx[i] * 0.55 - (fallX / fall) * 0.45;
          vy[i] = vy[i] * 0.55 - (fallY / fall) * 0.45;
          ax[i] = x[i];
          ay[i] = y[i];
        }
        prevGrab[i] = g;

        if (carried) {
          const rate = lag[i] * (0.55 + 0.55 * chase);
          ax[i] += (magX - ax[i]) * rate;
          ay[i] += (magY - ay[i]) * rate;

          const ang = slotA[i] + time * (0.35 + seed[i] * 0.5);
          const rr = slotR[i] * clumpR;
          const tx = ax[i] + Math.cos(ang) * rr;
          const ty = ay[i] + Math.sin(ang) * rr;

          const k = 0.05 + seed[i] * 0.04 + slotR[i] * 0.03;
          vx[i] += (tx - x[i]) * k;
          vy[i] += (ty - y[i]) * k;
          vx[i] *= 0.78 + seed[i] * 0.05;
          vy[i] *= 0.78 + seed[i] * 0.05;
        } else {
          // Soft flight / settle toward gravity-leaned seat — spring only, no position snaps.
          const toX = restX - x[i];
          const toY = restY - y[i];
          const dist = Math.hypot(toX, toY) + 1e-3;
          const away = Math.hypot(x[i] - hx, y[i] - hy);
          const settleGate = Math.max(gravLean * 1.5, 28);
          const returning = away > settleGate;
          // Cap step so arrival eases in — never a last-mile teleport.
          const k = returning
            ? Math.min(0.022, 1.8 / Math.max(dist, 50))
            : 0.05 + seed[i] * 0.02 + gravW * 0.03;
          vx[i] += toX * k;
          vy[i] += toY * k;
          // Extra damp near home so the last stretch crawls in.
          const near = dist < 30 ? 0.88 : returning ? 0.94 : 0.84;
          vx[i] *= near;
          vy[i] *= near;
          // Kill residual speed when almost home so it doesn't overshoot/pop.
          if (dist < 10) {
            vx[i] *= 0.6;
            vy[i] *= 0.6;
            x[i] += (restX - x[i]) * 0.08;
            y[i] += (restY - y[i]) * 0.08;
          }
          ax[i] += (restX - ax[i]) * 0.08;
          ay[i] += (restY - ay[i]) * 0.08;
        }

        // Idle + carried chaos — Jitter param drives this for every grain.
        const jAmp = jitter * (0.9 + seed[i] * 0.7) * (carried ? 1.35 : 1.6);
        vx[i] += (Math.random() - 0.5) * jAmp;
        vy[i] += (Math.random() - 0.5) * jAmp;
        const wf = 0.6 + seed[i] * 3.4;
        vx[i] += Math.cos(time * wf + seed[i] * 24.0) * jAmp * 0.22;
        vy[i] += Math.sin(time * wf * 1.13 + seed[i] * 17.0) * jAmp * 0.22;

        x[i] += vx[i];
        y[i] += vy[i];

        pos[i * 2] = x[i];
        pos[i * 2 + 1] = y[i];
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos.subarray(0, n * 2));
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uSize, dot);

      const a = hexToRgb(hex(p, "uColorA", "#f4f6ff"));
      const b = hexToRgb(hex(p, "uColorB", "#ff4a6a"));
      const c = hexToRgb(hex(p, "uColorC", "#4ad2ff"));
      const split = 1.15 + grain * 0.35;

      gl.uniform2f(uOffset, -split, split * 0.35);
      gl.uniform3f(uTint, b[0], b[1], b[2]);
      gl.uniform1f(uAlpha, 0.22);
      gl.drawArrays(gl.POINTS, 0, n);

      gl.uniform2f(uOffset, split, -split * 0.35);
      gl.uniform3f(uTint, c[0], c[1], c[2]);
      gl.uniform1f(uAlpha, 0.22);
      gl.drawArrays(gl.POINTS, 0, n);

      gl.uniform2f(uOffset, 0, 0);
      gl.uniform3f(uTint, a[0], a[1], a[2]);
      gl.uniform1f(uAlpha, 0.42);
      gl.drawArrays(gl.POINTS, 0, n);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerenter", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      if (buf) gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
  }, [onError]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
