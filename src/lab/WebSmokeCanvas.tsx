import { useEffect, useRef } from "react";
import { hexToRgb } from "../shaders/webEffects";
import type { SmokeParams } from "./smokeParams";

export type { SmokeParams };
export { defaultSmokeParams, asSmokeParams, SMOKE_SIM_REVISION } from "./smokeParams";

/**
 * Stable Fluids smoke (Stam) — density rides a persistent velocity field.
 * Mouse injects density + force; when the cursor stops, smoke keeps drifting
 * inside the frame (“aquarium” walls).
 */

type SmokeLook = "smoke" | "mercury";

type Props = {
  params: SmokeParams;
  onError?: (message: string | null) => void;
  /**
   * Optional alpha mark. When present the sim runs *inside* the logo: the shape
   * emits smoke, confines density and damps velocity at its border.
   */
  mask?: TexImageSource | null;
  /** Matches logoUv() in the fragment effects so the Size slider agrees. */
  maskScale?: number;
  /**
   * Keep the field alive without a cursor — used as Logo Lab atmosphere under
   * translucent effects. Emits patchy density across the frame every tick.
   */
  ambient?: boolean;
  /**
   * Same Stam fluids as smoke; mercury only changes the display (solid metal
   * body + density as surface height).
   */
  look?: SmokeLook;
};

const MARK = `
uniform sampler2D uMask;
uniform float uHasMask;
uniform vec2 uAspect;
uniform float uMaskScale;
vec2 markUv(vec2 uv){
  vec2 frag = uv * uAspect;
  vec2 p = (frag - 0.5 * uAspect) / min(uAspect.x, uAspect.y);
  return p * (1.28 / max(uMaskScale, 0.25)) + 0.5;
}
float mark(vec2 uv) {
  if (uHasMask < 0.5) return 1.0;
  vec2 m = markUv(uv);
  if (m.x < 0.0 || m.x > 1.0 || m.y < 0.0 || m.y > 1.0) return 0.0;
  return texture(uMask, m).r; // coverage; alpha holds the distance field
}
float markSdf(vec2 uv){
  if (uHasMask < 0.5) return 1.0;
  vec2 m = markUv(uv);
  vec2 c = clamp(m, 0.0, 1.0);
  return (texture(uMask, c).a - 0.5) * 2.0 * 0.085 - length(m - c);
}
`;

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const SPLAT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;   // velocity: xy force; density: x dens, y heat
uniform float uRadius;
uniform vec2 uTexel;
uniform float uSoftCap; // 1 = density+heat splat
void main() {
  vec2 p = vUv - uPoint;
  p.x *= uTexel.y / uTexel.x;
  float d = exp(-dot(p, p) / uRadius);
  vec3 base = texture(uTarget, vUv).xyz;
  if (uSoftCap > 0.5) {
    float room = max(0.0, 0.6 - base.x);
    float addD = min(uColor.x * d, room * d);
    float heat = max(base.y, uColor.y * d);
    fragColor = vec4(base.x + addD, heat, base.z, 1.0);
  } else {
    fragColor = vec4(base + uColor * d, 1.0);
  }
}
`;

const ADVECT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDissipation;
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  coord = clamp(coord, uTexel, 1.0 - uTexel);
  fragColor = uDissipation * texture(uSource, coord);
}
`;

// Density R + heat G — heat cools faster so smoke rises first, then falls
const ADVECT_DENSITY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uDensDiss;
uniform float uHeatDiss;
${MARK}
void main() {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  coord = clamp(coord, uTexel, 1.0 - uTexel);
  vec4 s = texture(uSource, coord);
  // Whatever drifts past the silhouette dies there — smoke stays in the mark.
  float keep = uHasMask > 0.5 ? smoothstep(0.25, 0.6, mark(vUv)) : 1.0;
  fragColor = vec4(s.x * uDensDiss * keep, s.y * uHeatDiss * keep, 0.0, 1.0);
}
`;

/** Continuous, patchy emission from inside the mark — the logo smoulders. */
const EMIT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform float uTime;
uniform float uAmount;
${MARK}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1, 0));
  float c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main() {
  vec3 base = texture(uTarget, vUv).xyz;
  float m = smoothstep(0.4, 0.85, mark(vUv));
  // Logo emit uses mark space; ambient full-frame uses screen UVs so patches
  // drift across the whole studio instead of clustering in the mark box.
  vec2 nuv = uHasMask > 0.5 ? markUv(vUv) : vUv * vec2(1.7, 1.0);
  float n = noise(nuv * 6.5 + vec2(uTime * 0.45, -uTime * 0.62));
  n = smoothstep(0.28, 0.88, n);
  float add = uAmount * m * n;
  float room = max(0.0, 0.62 - base.x);
  fragColor = vec4(base.x + min(add, room), max(base.y, n * m * 0.9), base.z, 1.0);
}
`;

const DIVERGENCE = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
  float T = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
  vec2 uv = vUv;
  if (uv.x < uTexel.x) L = -R;
  if (uv.x > 1.0 - uTexel.x) R = -L;
  if (uv.y < uTexel.y) B = -T;
  if (uv.y > 1.0 - uTexel.y) T = -B;
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const PRESSURE = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  float C = texture(uDivergence, vUv).x;
  // Neumann walls
  if (vUv.x < uTexel.x) L = R;
  if (vUv.x > 1.0 - uTexel.x) R = L;
  if (vUv.y < uTexel.y) B = T;
  if (vUv.y > 1.0 - uTexel.y) T = B;
  fragColor = vec4((L + R + B + T - C) * 0.25, 0.0, 0.0, 1.0);
}
`;

const GRADIENT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel -= 0.5 * vec2(R - L, T - B);
  // Soft aquarium walls — damp near edges (no hard bounce / corner rockets)
  float edge = min(
    min(vUv.x, 1.0 - vUv.x) / (uTexel.x * 8.0),
    min(vUv.y, 1.0 - vUv.y) / (uTexel.y * 8.0)
  );
  float damp = smoothstep(0.0, 1.0, clamp(edge, 0.0, 1.0));
  vel *= mix(0.15, 1.0, damp);
  fragColor = vec4(vel, 0.0, 1.0);
}
`;

const CURL = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
void main() {
  float L = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
  float B = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
  float curl = R - L - T + B;
  fragColor = vec4(0.5 * curl, 0.0, 0.0, 1.0);
}
`;

const VORTICITY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform vec2 uTexel;
uniform float uCurlForce;
uniform float uDt;
void main() {
  float L = texture(uCurl, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture(uCurl, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture(uCurl, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture(uCurl, vUv + vec2(0.0, uTexel.y)).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  float len = length(force) + 1e-5;
  force = (force / len) * uCurlForce * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;
  fragColor = vec4(vel + force * uDt, 0.0, 1.0);
}
`;

const CLEAR = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uValue;
void main() {
  fragColor = uValue * texture(uTexture, vUv);
}
`;

const GRAVITY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uDensity; // .r dens, .g heat (fresh)
uniform float uRise;
uniform float uFall;
uniform float uWindX;
uniform float uWindY;
uniform float uDt;
uniform vec2 uTexel;
uniform float uTime;
uniform float uWander; // always-on drift so smoke never freezes
${MARK}
void main() {
  vec2 vel = texture(uVelocity, vUv).xy;
  float dens = texture(uDensity, vUv).x;
  float heat = texture(uDensity, vUv).y;
  float alive = smoothstep(0.008, 0.06, dens);

  // Match splat velocity units (≈ pixels): force / texel
  float scaleY = 1.0 / max(uTexel.y, 1e-5);
  float scaleX = 1.0 / max(uTexel.x, 1e-5);

  // Fresh rises hard; cool smoke slowly falls — but never zero motion
  float riseW = 0.35 + 0.65 * smoothstep(0.05, 0.5, heat);
  float fallW = smoothstep(0.45, 0.02, heat);
  vel.y += uRise * dens * riseW * uDt * scaleY;
  vel.y -= uFall * dens * fallW * uDt * scaleY * 0.55;

  // Ambient loft + wander — keeps the whole field alive (loft trimmed ~30%)
  float wobX = sin(vUv.y * 18.0 + uTime * 0.7) * 0.35
             + sin(vUv.x * 11.0 - uTime * 0.45) * 0.25;
  float wobY = 0.38 + 0.18 * sin(vUv.x * 14.0 + uTime * 0.55);
  vel.x += (uWindX * scaleX * 0.4 + wobX * uWander * scaleX) * dens * uDt * alive;
  vel.y += (uWindY * scaleY * 0.25 + wobY * uWander * scaleY) * dens * uDt * alive;

  // The silhouette acts as a wall: motion dies just outside it.
  if (uHasMask > 0.5) vel *= smoothstep(0.1, 0.55, mark(vUv));

  fragColor = vec4(vel, 0.0, 1.0);
}
`;

const DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDensity;
uniform vec2 uTexel;
uniform vec3 uBg;
uniform vec3 uSmokeStart;
uniform vec3 uSmokeEnd;
${MARK}
void main() {
  vec2 t = uTexel * 1.25;
  float d = 0.0;
  float h = 0.0;
  d += texture(uDensity, vUv).x * 0.28;
  h += texture(uDensity, vUv).y * 0.28;
  d += texture(uDensity, vUv + vec2(t.x, 0.0)).x * 0.12;
  h += texture(uDensity, vUv + vec2(t.x, 0.0)).y * 0.12;
  d += texture(uDensity, vUv - vec2(t.x, 0.0)).x * 0.12;
  h += texture(uDensity, vUv - vec2(t.x, 0.0)).y * 0.12;
  d += texture(uDensity, vUv + vec2(0.0, t.y)).x * 0.12;
  h += texture(uDensity, vUv + vec2(0.0, t.y)).y * 0.12;
  d += texture(uDensity, vUv - vec2(0.0, t.y)).x * 0.12;
  h += texture(uDensity, vUv - vec2(0.0, t.y)).y * 0.12;
  d += texture(uDensity, vUv + t).x * 0.06;
  h += texture(uDensity, vUv + t).y * 0.06;
  d += texture(uDensity, vUv - t).x * 0.06;
  h += texture(uDensity, vUv - t).y * 0.06;
  d += texture(uDensity, vUv + vec2(t.x, -t.y)).x * 0.06;
  h += texture(uDensity, vUv + vec2(t.x, -t.y)).y * 0.06;
  d += texture(uDensity, vUv + vec2(-t.x, t.y)).x * 0.06;
  h += texture(uDensity, vUv + vec2(-t.x, t.y)).y * 0.06;

  float body = smoothstep(0.01, 0.32, d);
  float core = smoothstep(0.28, 0.7, d);
  // Age tint + fresh already cool-blue
  float age = 1.0 - smoothstep(0.02, 0.42, h);
  age = pow(clamp(age, 0.0, 1.0), 0.75);
  vec3 cyan = vec3(0.35, 0.78, 1.0);
  vec3 deepBlue = vec3(0.22, 0.45, 0.82);
  vec3 cool = mix(deepBlue, cyan, 0.55);
  cool = mix(cool, uSmokeEnd, 0.2);
  // Start from Color A already biased toward blue
  vec3 fresh = mix(uSmokeStart, cyan, 0.28);
  vec3 smoke = mix(fresh, cool, age * 0.92);
  smoke = mix(smoke, fresh * 1.04, core * (1.0 - age) * 0.18);
  float a = clamp(body * 0.66 + core * 0.18, 0.0, 0.82);
  if (uHasMask > 0.5) {
    float clip = smoothstep(0.22, 0.58, mark(vUv));
    // Keep the silhouette crisp; the little that bleeds past it reads as glow.
    a *= clip + (1.0 - clip) * 0.22;
  }
  fragColor = vec4(mix(uBg, smoke, a), 1.0);
}
`;

// Solid metal logo: density is surface height, velocity leans the normal.
const DISPLAY_MERCURY = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDensity;
uniform sampler2D uVelocity;
uniform vec2 uTexel;
uniform vec3 uBg;
uniform vec3 uSmokeStart;
uniform vec3 uSmokeEnd;
uniform float uTime;
${MARK}
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1, 0));
  float c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
void main() {
  float cover = smoothstep(0.28, 0.58, mark(vUv));
  float sd = markSdf(vUv);

  vec2 t = uTexel * 1.35;
  float h = 0.0;
  h += texture(uDensity, vUv).x * 0.34;
  h += texture(uDensity, vUv + vec2(t.x, 0.0)).x * 0.165;
  h += texture(uDensity, vUv - vec2(t.x, 0.0)).x * 0.165;
  h += texture(uDensity, vUv + vec2(0.0, t.y)).x * 0.165;
  h += texture(uDensity, vUv - vec2(0.0, t.y)).x * 0.165;

  float hx = texture(uDensity, vUv + vec2(t.x, 0.0)).x - texture(uDensity, vUv - vec2(t.x, 0.0)).x;
  float hy = texture(uDensity, vUv + vec2(0.0, t.y)).x - texture(uDensity, vUv - vec2(0.0, t.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy;
  float speed = length(vel) * 0.0035;

  vec3 Nliq = normalize(vec3(-(hx * 3.2 + vel.x * 0.00045), -(hy * 3.2 + vel.y * 0.00045), 0.78));

  float thick = 0.0065;
  float be = 0.0022;
  vec2 g = vec2(markSdf(vUv + vec2(be, 0.0)) - markSdf(vUv - vec2(be, 0.0)),
                markSdf(vUv + vec2(0.0, be)) - markSdf(vUv - vec2(0.0, be)));
  float gm = length(g);
  vec2 bdir = gm > 1e-5 ? g / gm : vec2(0.0, 1.0);
  float rim = 1.0 - smoothstep(0.0, thick, max(sd, 0.0));
  rim *= rim;
  vec3 Nrim = normalize(vec3(-bdir * rim * 0.4, sqrt(max(1.0 - rim * rim * 0.22, 0.25))));
  vec3 N = normalize(mix(Nliq, Nrim, 0.3 * rim));

  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(0.35, 0.55, 0.75));
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.2);

  vec3 warm = vec3(1.0, 0.51, 0.45);
  vec2 q = markUv(vUv) * 2.05 + vel.xy * 0.0003 + vec2(uTime * 0.035, -uTime * 0.028);
  float swirl = noise(q) * 0.65 + noise(q * 1.7 + 3.1) * 0.35;
  vec3 col = mix(uSmokeStart, uSmokeEnd, smoothstep(0.18, 0.88, swirl + h * 0.7));
  col = mix(col, uSmokeEnd * 1.2, pow(smoothstep(0.45, 0.95, swirl), 1.5) * 0.4);
  col = mix(col, warm, smoothstep(0.55, 0.12, swirl) * 0.28);
  col = mix(col, vec3(0.92, 0.96, 1.0), pow(max(h, 0.0), 1.25) * 0.4);

  vec3 R = reflect(-V, N);
  float sky = smoothstep(-0.2, 0.9, R.y);
  vec3 refl = mix(uSmokeStart * 0.7, uSmokeEnd * 1.1, sky);
  refl = mix(refl, vec3(0.85, 0.92, 1.0), pow(max(R.y, 0.0), 4.0) * 0.65);
  col = mix(col, refl, clamp(0.16 + 0.55 * fres, 0.0, 0.8));
  col += mix(uSmokeEnd, vec3(0.8, 0.9, 1.0), 0.35) * rim * fres * 0.4;

  float sp = pow(max(dot(N, normalize(L + V)), 0.0), 64.0);
  col += vec3(0.95, 0.97, 1.0) * sp * (0.7 + speed * 0.55);
  col += warm * pow(max(h, 0.0), 1.5) * sp * 0.22;
  col *= 1.28;

  float grain = noise(vUv * vec2(420.0, 380.0) + uTime * 2.0);
  col *= 0.97 + 0.05 * grain;
  vec3 bg = uBg * (0.96 + 0.08 * noise(vUv * 220.0));
  fragColor = vec4(mix(bg, col, cover), 1.0);
}
`;

type FBO = {
  tex: WebGLTexture;
  fbo: WebGLFramebuffer;
  w: number;
  h: number;
};

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
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
}

function link(gl: WebGL2RenderingContext, vert: string, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  const prog = gl.createProgram();
  if (!prog) throw new Error("createProgram failed");
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog) || "link error");
  }
  return prog;
}

function createFBO(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
): FBO {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fbo, w, h };
}

function createDouble(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  filter: number,
) {
  let read = createFBO(gl, w, h, internalFormat, format, type, filter);
  let write = createFBO(gl, w, h, internalFormat, format, type, filter);
  return {
    get read() {
      return read;
    },
    get write() {
      return write;
    },
    swap() {
      const t = read;
      read = write;
      write = t;
    },
    destroy() {
      for (const f of [read, write]) {
        gl.deleteTexture(f.tex);
        gl.deleteFramebuffer(f.fbo);
      }
    },
  };
}

export function WebSmokeCanvas({
  params,
  onError,
  mask,
  maskScale,
  ambient = false,
  look = "smoke",
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const maskRef = useRef(mask);
  maskRef.current = mask;
  const maskScaleRef = useRef(maskScale ?? 0.92);
  maskScaleRef.current = maskScale ?? 0.92;
  const ambientRef = useRef(ambient);
  ambientRef.current = ambient;
  const lookRef = useRef(look);
  lookRef.current = look;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    mount.appendChild(canvas);

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      onError?.("WebGL2 is required for smoke simulation");
      return;
    }

    // Prefer half-float for stable fluids
    const extColor = gl.getExtension("EXT_color_buffer_float");
    const extLinear = gl.getExtension("OES_texture_float_linear");
    if (!extColor) {
      onError?.("Floating-point textures required for smoke");
      return;
    }

    let programs: Record<string, WebGLProgram>;
    let buf: WebGLBuffer;
    try {
      programs = {
        splat: link(gl, VERT, SPLAT),
        advect: link(gl, VERT, ADVECT),
        advectDensity: link(gl, VERT, ADVECT_DENSITY),
        divergence: link(gl, VERT, DIVERGENCE),
        pressure: link(gl, VERT, PRESSURE),
        gradient: link(gl, VERT, GRADIENT),
        curl: link(gl, VERT, CURL),
        vorticity: link(gl, VERT, VORTICITY),
        clear: link(gl, VERT, CLEAR),
        gravity: link(gl, VERT, GRAVITY),
        emit: link(gl, VERT, EMIT),
        display: link(gl, VERT, DISPLAY),
        displayMercury: link(gl, VERT, DISPLAY_MERCURY),
      };
      buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      onError?.(null);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Smoke shader failed");
      mount.removeChild(canvas);
      return;
    }

    const internalFormat = gl.RGBA16F;
    const format = gl.RGBA;
    const texType = gl.HALF_FLOAT;
    const filter = extLinear ? gl.LINEAR : gl.NEAREST;

    let simW = 0;
    let simH = 0;
    let velocity: ReturnType<typeof createDouble> | null = null;
    let density: ReturnType<typeof createDouble> | null = null;
    let pressure: ReturnType<typeof createDouble> | null = null;
    let divergence: FBO | null = null;
    let curl: FBO | null = null;

    const mouse = {
      x: 0.5,
      y: 0.5,
      px: 0.5,
      py: 0.5,
      has: false,
      ready: false,
      // Persistent coast velocity from last stroke (physics keeps it going when idle)
      coastX: 0,
      coastY: 0,
    };

    const bindQuad = (prog: WebGLProgram) => {
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    const blit = (target: FBO | null) => {
      if (target) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.w, target.h);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(mount.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(mount.clientHeight * dpr));
      // Sim grid closer to display — less pixelation
      const scale = 0.72;
      simW = Math.max(96, Math.floor(canvas.width * scale));
      simH = Math.max(96, Math.floor(canvas.height * scale));

      velocity?.destroy();
      density?.destroy();
      pressure?.destroy();
      if (divergence) {
        gl.deleteTexture(divergence.tex);
        gl.deleteFramebuffer(divergence.fbo);
      }
      if (curl) {
        gl.deleteTexture(curl.tex);
        gl.deleteFramebuffer(curl.fbo);
      }

      velocity = createDouble(gl, simW, simH, internalFormat, format, texType, filter);
      density = createDouble(gl, simW, simH, internalFormat, format, texType, filter);
      pressure = createDouble(gl, simW, simH, internalFormat, format, texType, filter);
      divergence = createFBO(gl, simW, simH, internalFormat, format, texType, gl.NEAREST);
      curl = createFBO(gl, simW, simH, internalFormat, format, texType, gl.NEAREST);
      mouse.ready = false;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      mouse.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
      mouse.has = true;
      if (!mouse.ready) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.ready = true;
      }
    };
    const onLeave = () => {
      mouse.has = false;
    };
    // Listen on mount (full hero/stage), not only canvas — Home + Studio parity
    mount.style.touchAction = "none";
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerdown", onMove);
    mount.addEventListener("pointerleave", onLeave);
    mount.addEventListener("pointerenter", onMove);

    const maskTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 0]),
    );
    let lastMask: TexImageSource | null | undefined;
    const syncMask = () => {
      const src = maskRef.current;
      if (src === lastMask) return;
      lastMask = src;
      if (!src) return;
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    };

    const locCache = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
    const U = (prog: WebGLProgram, name: string) => {
      let m = locCache.get(prog);
      if (!m) {
        m = new Map();
        locCache.set(prog, m);
      }
      if (!m.has(name)) m.set(name, gl.getUniformLocation(prog, name));
      return m.get(name) ?? null;
    };

    const bindMark = (prog: WebGLProgram, unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.uniform1i(U(prog, "uMask"), unit);
      gl.uniform1f(U(prog, "uHasMask"), maskRef.current ? 1 : 0);
      gl.uniform2f(U(prog, "uAspect"), canvas.width, canvas.height);
      gl.uniform1f(U(prog, "uMaskScale"), maskScaleRef.current);
    };

    let raf = 0;
    let last = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!velocity || !density || !pressure || !divergence || !curl) return;

      const now = performance.now();
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const p = paramsRef.current;

      syncMask();
      const hasMask = !!maskRef.current;
      const ambientOn = ambientRef.current && !hasMask;
      const mercury = lookRef.current === "mercury";

      const texel = [1 / simW, 1 / simH] as const;
      const velDiss = 0.97 + Math.max(0.05, Math.min(0.9, p.uInertia)) * 0.02;
      const fade = Math.max(0.05, Math.min(0.8, p.uFade));
      // Inside a mark the field is refilled every frame, so it has to turn over
      // in seconds — otherwise the logo saturates into a flat silhouette.
      // Ambient underlays also turn over faster so the room never goes flat.
      const lifeSec = hasMask
        ? mercury
          ? 2.2 + fade * 9
          : 1.2 + fade * 7
        : ambientOn
          ? 4 + fade * 10
          : 30 - ((fade - 0.05) / 0.75) * 10;
      const densDiss = Math.pow(0.03, 1 / Math.max(1, lifeSec * 60));
      const heatLife = hasMask
        ? mercury
          ? 1.2 + fade * 4
          : 0.7 + fade * 3
        : ambientOn
          ? 2.5 + (1 - fade / 0.8) * 3
          : 10 + (1 - fade / 0.8) * 4;
      const heatDiss = Math.pow(0.05, 1 / Math.max(1, heatLife * 60));

      const radius = Math.max(0.0002, p.uSpread * 0.00019);
      const splatDens = Math.max(0.04, p.uDensity) * (mercury ? 0.07 : 0.054);
      const forceScale = (28 + p.uSpeed * 6) * (mercury ? 1.15 : 1);
      const curlForce = (8 + p.uSpeed * 4) * (mercury ? 0.85 : 1);
      // Soft loft — mercury barely rises; smoke keeps the buoyant look.
      const rise = mercury
        ? (0.08 + p.uGravity * 0.2) * 0.35
        : (0.35 + p.uGravity * 0.55) * 0.55;
      const fall = mercury ? 0.08 + p.uGravity * 0.2 : 0.2 + p.uGravity * 0.45;
      const wander = mercury
        ? 0.06 + p.uSpeed * 0.02
        : 0.18 + p.uSpeed * 0.05;
      const ang = (p.uDirection * Math.PI) / 180;
      const windX = Math.cos(ang) * p.uSpeed * 0.08;
      const windY = Math.sin(ang) * p.uSpeed * 0.08;

      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      // Mark emit (Smokey) or ambient full-frame emit (Logo Lab atmosphere).
      // Without this, a pointer-events:none underlay stays empty forever.
      if (hasMask || ambientOn) {
        const emitScale = hasMask ? (mercury ? 0.028 : 0.055) : 0.038;
        bindQuad(programs.emit);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
        gl.uniform1i(U(programs.emit, "uTarget"), 0);
        gl.uniform1f(U(programs.emit, "uTime"), now * 0.001);
        gl.uniform1f(
          U(programs.emit, "uAmount"),
          Math.max(0.04, p.uDensity) * emitScale * Math.min(dt * 60, 2),
        );
        bindMark(programs.emit, 2);
        blit(density.write);
        density.swap();
      }

      if (mouse.has && mouse.ready) {
        const speed = Math.hypot(dx, dy);
        if (speed > 0.00008) {
          mouse.coastX = mouse.coastX * 0.58 + dx * 0.85;
          mouse.coastY = mouse.coastY * 0.58 + dy * 0.85;
          const cLen = Math.hypot(mouse.coastX, mouse.coastY);
          const cMax = 0.038;
          if (cLen > cMax) {
            mouse.coastX = (mouse.coastX / cLen) * cMax;
            mouse.coastY = (mouse.coastY / cLen) * cMax;
          }
        } else {
          // Kill residual coast fast — leftover upward coast caused the “kick”
          mouse.coastX *= 0.9;
          mouse.coastY *= 0.82;
        }

        const moving = speed > 0.00008;
        const densAmt = moving ? splatDens : splatDens * 0.14;
        const heatAmt = moving ? 0.9 : 0.55;

        // Velocity only while moving — idle never injects force (no jerk)
        if (moving) {
          bindQuad(programs.splat);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
          gl.uniform1i(U(programs.splat, "uTarget"), 0);
          gl.uniform2f(U(programs.splat, "uPoint"), mouse.x, mouse.y);
          gl.uniform3f(
            U(programs.splat, "uColor"),
            dx * forceScale * simW,
            dy * forceScale * simH,
            0,
          );
          gl.uniform1f(U(programs.splat, "uRadius"), radius * 1.05);
          gl.uniform2f(U(programs.splat, "uTexel"), texel[0], texel[1]);
          gl.uniform1f(U(programs.splat, "uSoftCap"), 0);
          blit(velocity.write);
          velocity.swap();
        }

        if (!hasMask || mercury) {
          bindQuad(programs.splat);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
          gl.uniform1i(U(programs.splat, "uTarget"), 0);
          gl.uniform2f(U(programs.splat, "uPoint"), mouse.x, mouse.y);
          gl.uniform3f(U(programs.splat, "uColor"), densAmt, heatAmt, 0);
          gl.uniform1f(U(programs.splat, "uRadius"), radius * (mercury ? 1.0 : 0.85));
          gl.uniform2f(U(programs.splat, "uTexel"), texel[0], texel[1]);
          gl.uniform1f(U(programs.splat, "uSoftCap"), 1);
          blit(density.write);
          density.swap();
        }
      } else {
        mouse.coastX *= 0.92;
        mouse.coastY *= 0.85;
      }

      // --- vorticity confinement (smoke swirls) ---
      bindQuad(programs.curl);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.curl, "uVelocity"), 0);
      gl.uniform2f(U(programs.curl, "uTexel"), texel[0], texel[1]);
      blit(curl);

      bindQuad(programs.vorticity);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.vorticity, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curl.tex);
      gl.uniform1i(U(programs.vorticity, "uCurl"), 1);
      gl.uniform2f(U(programs.vorticity, "uTexel"), texel[0], texel[1]);
      gl.uniform1f(U(programs.vorticity, "uCurlForce"), curlForce);
      gl.uniform1f(U(programs.vorticity, "uDt"), dt);
      blit(velocity.write);
      velocity.swap();

      // --- buoyancy / wind on dense regions ---
      bindQuad(programs.gravity);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.gravity, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(U(programs.gravity, "uDensity"), 1);
      gl.uniform1f(U(programs.gravity, "uRise"), rise);
      gl.uniform1f(U(programs.gravity, "uFall"), fall);
      gl.uniform1f(U(programs.gravity, "uWindX"), windX);
      gl.uniform1f(U(programs.gravity, "uWindY"), windY);
      gl.uniform1f(U(programs.gravity, "uDt"), dt);
      gl.uniform2f(U(programs.gravity, "uTexel"), texel[0], texel[1]);
      gl.uniform1f(U(programs.gravity, "uTime"), now * 0.001);
      gl.uniform1f(U(programs.gravity, "uWander"), wander);
      bindMark(programs.gravity, 2);
      blit(velocity.write);
      velocity.swap();

      // --- advect velocity ---
      bindQuad(programs.advect);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.advect, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.advect, "uSource"), 1);
      gl.uniform2f(U(programs.advect, "uTexel"), texel[0], texel[1]);
      gl.uniform1f(U(programs.advect, "uDt"), dt);
      gl.uniform1f(U(programs.advect, "uDissipation"), Math.pow(velDiss, dt * 60));
      blit(velocity.write);
      velocity.swap();

      // --- pressure projection ---
      bindQuad(programs.divergence);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.divergence, "uVelocity"), 0);
      gl.uniform2f(U(programs.divergence, "uTexel"), texel[0], texel[1]);
      blit(divergence);

      bindQuad(programs.clear);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      gl.uniform1i(U(programs.clear, "uTexture"), 0);
      gl.uniform1f(U(programs.clear, "uValue"), 0.8);
      blit(pressure.write);
      pressure.swap();

      for (let i = 0; i < 18; i++) {
        bindQuad(programs.pressure);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(U(programs.pressure, "uPressure"), 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, divergence.tex);
        gl.uniform1i(U(programs.pressure, "uDivergence"), 1);
        gl.uniform2f(U(programs.pressure, "uTexel"), texel[0], texel[1]);
        blit(pressure.write);
        pressure.swap();
      }

      bindQuad(programs.gradient);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      gl.uniform1i(U(programs.gradient, "uPressure"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.gradient, "uVelocity"), 1);
      gl.uniform2f(U(programs.gradient, "uTexel"), texel[0], texel[1]);
      blit(velocity.write);
      velocity.swap();

      // --- advect density + cool heat ---
      bindQuad(programs.advectDensity);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(U(programs.advectDensity, "uVelocity"), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(U(programs.advectDensity, "uSource"), 1);
      gl.uniform2f(U(programs.advectDensity, "uTexel"), texel[0], texel[1]);
      gl.uniform1f(U(programs.advectDensity, "uDt"), dt);
      gl.uniform1f(
        U(programs.advectDensity, "uDensDiss"),
        Math.pow(densDiss, dt * 60),
      );
      gl.uniform1f(
        U(programs.advectDensity, "uHeatDiss"),
        Math.pow(heatDiss, dt * 60),
      );
      bindMark(programs.advectDensity, 2);
      blit(density.write);
      density.swap();

      // --- display ---
      const bg = hexToRgb(p.uBg);
      const ca = hexToRgb(p.uColorA);
      const cb = hexToRgb(p.uColorB);
      const displayProg = mercury ? programs.displayMercury : programs.display;
      bindQuad(displayProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(U(displayProg, "uDensity"), 0);
      if (mercury) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
        gl.uniform1i(U(displayProg, "uVelocity"), 1);
        gl.uniform1f(U(displayProg, "uTime"), now * 0.001);
      }
      gl.uniform2f(U(displayProg, "uTexel"), texel[0], texel[1]);
      gl.uniform3f(U(displayProg, "uBg"), bg[0], bg[1], bg[2]);
      gl.uniform3f(U(displayProg, "uSmokeStart"), ca[0], ca[1], ca[2]);
      gl.uniform3f(U(displayProg, "uSmokeEnd"), cb[0], cb[1], cb[2]);
      bindMark(displayProg, 2);
      blit(null);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerdown", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      mount.removeEventListener("pointerenter", onMove);
      velocity?.destroy();
      density?.destroy();
      pressure?.destroy();
      if (divergence) {
        gl.deleteTexture(divergence.tex);
        gl.deleteFramebuffer(divergence.fbo);
      }
      if (curl) {
        gl.deleteTexture(curl.tex);
        gl.deleteFramebuffer(curl.fbo);
      }
      gl.deleteTexture(maskTex);
      gl.deleteBuffer(buf);
      for (const prog of Object.values(programs)) gl.deleteProgram(prog);
      if (canvas.parentElement === mount) mount.removeChild(canvas);
    };
  }, [onError]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
