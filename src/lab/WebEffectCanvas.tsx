import { useEffect, useRef } from "react";
import { hexToRgb } from "../shaders/webEffects";

type Props = {
  fragment: string;
  params: Record<string, number | string>;
  image?: HTMLImageElement | ImageBitmap | null;
  onError?: (message: string | null) => void;
};

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const COLOR_KEYS = ["uBg", "uColorA", "uColorB", "uColorC"] as const;

function makeFallbackImage(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 512, 512);
  g.addColorStop(0, "#6a9fff");
  g.addColorStop(0.5, "#ff8fc8");
  g.addColorStop(1, "#f5f7ff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  return c;
}

export function WebEffectCanvas({ fragment, params, image, onError }: Props) {
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
      if (!s) throw new Error("createShader failed");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s) || "compile error";
        gl.deleteShader(s);
        throw new Error(log);
      }
      return s;
    };

    let prog: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    let imageTex: WebGLTexture | null = null;
    let raf = 0;
    const start = performance.now();
    const mouse = { x: 0, y: 0 };
    const fallback = makeFallbackImage();

    try {
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, fragment);
      prog = gl.createProgram();
      if (!prog) throw new Error("createProgram failed");
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prog) || "link error");
      }
      gl.useProgram(prog);

      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      imageTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, fallback);
      onError?.(null);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Shader failed");
      mount.removeChild(canvas);
      return;
    }

    const uRes = gl.getUniformLocation(prog, "uResolution");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uImage = gl.getUniformLocation(prog, "uImage");
    const uHasImage = gl.getUniformLocation(prog, "uHasImage");

    let lastImage: typeof image = undefined;
    const syncImage = () => {
      if (!imageTex) return;
      const src = imageRef.current;
      if (src === lastImage) return;
      lastImage = src;
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        src ?? fallback,
      );
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(mount.clientWidth * dpr));
      const h = Math.max(1, Math.floor(mount.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      mouse.x = w * 0.5;
      mouse.y = h * 0.5;
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
    };
    canvas.addEventListener("pointermove", onMove);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!prog) return;
      syncImage();
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTex);
      if (uImage) gl.uniform1i(uImage, 0);
      if (uHasImage) gl.uniform1f(uHasImage, imageRef.current ? 1.0 : 0.0);

      const p = paramsRef.current;
      for (const [key, value] of Object.entries(p)) {
        if (COLOR_KEYS.includes(key as (typeof COLOR_KEYS)[number]) && typeof value === "string") {
          const locC = gl.getUniformLocation(prog, key);
          if (locC) {
            const [r, g, b] = hexToRgb(value);
            gl.uniform3f(locC, r, g, b);
          }
          continue;
        }
        if (typeof value === "number") {
          const locU = gl.getUniformLocation(prog, key);
          if (locU) gl.uniform1f(locU, value);
        }
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      if (buf) gl.deleteBuffer(buf);
      if (imageTex) gl.deleteTexture(imageTex);
      if (prog) gl.deleteProgram(prog);
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
  }, [fragment, onError]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
