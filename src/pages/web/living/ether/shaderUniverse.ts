import * as THREE from "three";
import type { ChapterId, ScentId } from "./etherWorld";

export type ShaderUniverseState = {
  chapter: ChapterId;
  local: number;
  scentId: ScentId;
  accent: string;
  /** Accent of hovered / selected material — local field tint, not a flash. */
  focusAccent: string;
  hoverEnergy: number;
  selectEnergy: number;
  dna: { calmPower: number; dayNight: number; freshWarm: number; minimalSensual: number; lightDark: number };
  drydown: number;
  reveal: number;
  labEnergy: number;
  matchBias: number;
};

const CHAPTER_MODE: Record<ChapterId, number> = {
  hero: 0,
  inside: 1,
  anatomy: 2,
  origin: 3,
  lab: 4,
  dna: 5,
  match: 6,
  reveal: 7,
  drydown: 8,
  bag: 9,
};

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * Atmospheric perfume field — no cosmic stars, no interaction flashes.
 * Chapters / focus accents reshape density, warmth, and motif quietly.
 */
const frag = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uMode;
uniform float uLocal;
uniform float uHover;
uniform float uSelect;
uniform float uDry;
uniform float uReveal;
uniform float uLab;
uniform float uMatch;
uniform vec3 uAccent;
uniform vec3 uFocus;
uniform vec3 uBone;
uniform float uDna0;
uniform float uDna1;
uniform float uDna2;
uniform float uDna3;
uniform float uDna4;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  mat2 m = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p * 2.02; a *= 0.5; }
  return v;
}
float wMode(float m, float target) {
  return 1.0 - smoothstep(0.0, 1.05, abs(m - target));
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 q = p + uMouse * 0.035;
  float m = clamp(uMode, 0.0, 9.0);

  float dens = 0.4;
  float warm = 0.22;
  dens = mix(dens, 0.42 + uLocal * 0.2, wMode(m, 0.0));
  dens = mix(dens, 0.82, wMode(m, 1.0));
  dens = mix(dens, 0.5 + uHover * 0.25, wMode(m, 2.0));
  dens = mix(dens, 0.48 + uSelect * 0.2, wMode(m, 3.0));
  dens = mix(dens, 0.5 + uLab * 0.3, wMode(m, 4.0));
  dens = mix(dens, 0.58 + uDna0 * 0.18, wMode(m, 5.0));
  dens = mix(dens, 0.5, wMode(m, 6.0));
  dens = mix(dens, 0.4 + uReveal * 0.35, wMode(m, 7.0));
  dens = mix(dens, 0.55 * (1.0 - uDry * 0.4), wMode(m, 8.0));
  dens = mix(dens, 0.28, wMode(m, 9.0));

  warm = mix(warm, 0.2, wMode(m, 0.0));
  warm = mix(warm, 0.25, wMode(m, 1.0));
  warm = mix(warm, 0.3 + uHover * 0.25, wMode(m, 2.0));
  warm = mix(warm, 0.35 + uSelect * 0.25, wMode(m, 3.0));
  warm = mix(warm, 0.28 + uLab * 0.35, wMode(m, 4.0));
  warm = mix(warm, mix(0.18, 0.48, uDna2 * 0.55 + uDna4 * 0.35), wMode(m, 5.0));
  warm = mix(warm, 0.15 + uMatch * 0.45, wMode(m, 6.0));
  warm = mix(warm, 0.3, wMode(m, 7.0));
  // Dry-down: cool opening → warm base
  warm = mix(warm, mix(0.12, 0.62, uDry), wMode(m, 8.0));

  vec3 scentTint = mix(uAccent, uFocus, clamp(uHover + uSelect * 0.7, 0.0, 1.0));
  vec3 tint = mix(scentTint, uBone, warm * 0.18);
  vec3 voidCol = vec3(0.03, 0.028, 0.032);

  float n1 = fbm(q * 0.95 + vec2(uTime * 0.015, -uTime * 0.011));
  float n2 = fbm(q * 1.8 - vec2(uTime * 0.017, uTime * 0.013) + 2.5);
  float mist = smoothstep(0.22, 0.82, n1 * 0.55 + n2 * 0.45);
  mist = pow(mist, mix(1.2, 0.75, dens));

  vec3 col = voidCol;
  col = mix(col, tint * 0.4, mist * (0.4 + dens * 0.4));
  col += tint * pow(mist, 2.2) * 0.12;
  col += tint * exp(-length(q * vec2(1.05, 1.2)) * mix(1.5, 0.55, dens)) * 0.14;

  // Hero — quiet presence
  col += tint * exp(-length(q) * 1.5) * (0.1 + uLocal * 0.15) * wMode(m, 0.0);

  // Inside — denser aromatic volume
  float swirl = fbm(q * 2.6 + uTime * 0.05);
  col += tint * smoothstep(0.45, 0.9, swirl) * 0.28 * wMode(m, 1.0);

  // Anatomy — strata + local focus around cursor when hovering a note
  float wa = wMode(m, 2.0);
  float band = 0.5 + 0.5 * sin(q.y * 6.0 + fbm(q * 1.8) * 2.0 + uTime * 0.15);
  col += tint * band * 0.08 * wa;
  float locus = exp(-length(q - uMouse * 0.55) * 2.8);
  col += uFocus * locus * uHover * 0.35 * wa;

  // Origin — soft rings, tinted by selected place
  float wo = wMode(m, 3.0);
  float r = length(q);
  float rings = 0.0;
  for (float i = 1.0; i < 4.0; i++) {
    float rr = 0.18 * i + 0.02 * sin(uTime * 0.2 + i);
    rings += exp(-abs(r - rr) * 42.0) * (0.4 / i);
  }
  col += mix(uAccent, uFocus, uSelect) * rings * (0.35 + uSelect * 0.35) * wo;
  col += uFocus * exp(-r * 2.2) * uSelect * 0.25 * wo;

  // Lab
  float wl = wMode(m, 4.0);
  float beam = exp(-abs(fract(q.x * 1.8 + 0.5) - 0.5) * 20.0);
  float core = exp(-length((q - vec2(0.0, -0.05)) * vec2(1.4, 1.0)) * 3.2);
  col += tint * beam * 0.08 * wl;
  col += mix(uAccent, uFocus, uLab) * core * (0.2 + uLab * 0.4) * wl;

  // DNA — soft preference atmosphere (no bands / grids / waves)
  // Floor stays filled — axes retint vapor, never punch holes to empty void.
  float wd = wMode(m, 5.0);
  vec3 cool = vec3(0.42, 0.58, 0.72);
  vec3 warmC = vec3(0.76, 0.46, 0.26);
  vec3 nightC = vec3(0.28, 0.18, 0.48);
  vec3 dayC = vec3(0.7, 0.66, 0.52);
  vec3 softC = vec3(0.58, 0.55, 0.52);
  vec3 lushC = vec3(0.7, 0.32, 0.46);
  vec3 dnaA = mix(cool, warmC, uDna2);
  vec3 dnaB = mix(dayC, nightC, uDna1);
  vec3 dnaC = mix(softC, lushC, uDna3);
  vec3 dnaD = mix(uBone * 0.55, uAccent * 0.85, uDna4);
  vec3 dnaTint = mix(mix(dnaA, dnaB, 0.42), mix(dnaC, dnaD, 0.5), 0.48);
  dnaTint = max(dnaTint, vec3(0.08));

  vec2 dq = q * 0.85;
  dq += vec2(uDna2 * 0.08 - 0.04, uDna4 * 0.06 - 0.03);
  float drift = uTime * 0.016;
  float v1 = fbm(dq * 1.05 + vec2(drift, -drift * 0.7));
  float v2 = fbm(dq * 1.9 - vec2(drift * 0.55, drift * 0.9) + 3.1 + uDna1 * 0.4);
  float v3 = fbm(dq * 0.55 + vec2(-drift * 0.3, drift * 0.4) + uDna3);
  // Soft veil with a minimum so the field never goes empty
  float veil = smoothstep(0.18, 0.82, v1 * 0.5 + v2 * 0.35 + v3 * 0.25);
  veil = mix(0.35, 1.0, veil);
  veil = pow(veil, mix(1.05, 0.85, uDna0));

  float bloomA = smoothstep(0.28, 0.88, fbm(dq * 0.85 + vec2(uTime * 0.018, uDna2)));
  float bloomB = smoothstep(0.32, 0.9, fbm(dq * 0.95 - vec2(uDna1, uTime * 0.014) + 4.2));
  float bloomC = smoothstep(0.35, 0.9, fbm(dq * 0.75 + vec2(uDna3, -uDna4) + 7.0));
  float bloomW = bloomA + bloomB * 0.85 + bloomC * 0.75 + 0.15;
  vec3 mood = (dnaA * bloomA + dnaB * bloomB * 0.85 + dnaC * bloomC * 0.75 + dnaTint * 0.15) / bloomW;
  mood = mix(mood, dnaD, clamp(bloomC * uDna4 * 0.3, 0.0, 0.45));
  mood = clamp(mood, vec3(0.05), vec3(0.95));

  // Solid atmospheric base first, then tint — no mix toward pure void
  vec3 dnaFloor = mix(voidCol * 1.4, dnaTint * 0.32, 0.72);
  col = mix(col, dnaFloor, 0.78 * wd);
  col = mix(col, mood * 0.42, veil * 0.5 * wd);
  col += dnaTint * veil * (0.08 + uDna0 * 0.06) * wd;
  float aura = exp(-length(q * vec2(0.95, 1.08)) * 1.15);
  col += mix(dnaA, dnaD, uDna4) * aura * 0.12 * wd;
  col += uBone * veil * (1.0 - uDna4) * 0.035 * wd;
  col = max(col, voidCol * 1.15 * wd + col * (1.0 - wd));

  // Match — three climate pools
  float wm = wMode(m, 6.0);
  vec3 mistC = vec3(0.48, 0.68, 0.76);
  vec3 emberC = vec3(0.78, 0.5, 0.26);
  float fa = exp(-dot(q - vec2(-0.52, 0.02), q - vec2(-0.52, 0.02)) * 5.5);
  float fb = exp(-dot(q - vec2(0.0, 0.1), q - vec2(0.0, 0.1)) * 5.0);
  float fc = exp(-dot(q - vec2(0.52, 0.02), q - vec2(0.52, 0.02)) * 5.5);
  col += (mistC * fa + uAccent * fb + emberC * fc) * 0.36 * wm;

  // Reveal
  float wr = wMode(m, 7.0);
  float bloom = exp(-length(q - vec2(-0.18, 0.0)) * 2.2) * uReveal;
  col += mix(uAccent, uBone, 0.3) * bloom * 0.4 * wr;

  // Dry-down — field color follows note mix (uFocus); thin over time
  float wdr = wMode(m, 8.0);
  float topP = smoothstep(0.38, 0.0, uDry);
  float heartP = 1.0 - abs(uDry - 0.45) * 2.6;
  heartP = clamp(heartP, 0.0, 1.0);
  float baseP = smoothstep(0.38, 0.9, uDry);
  vec3 phaseCol = mix(uAccent, uFocus, 0.65);
  phaseCol = mix(phaseCol * 1.15, uFocus, clamp(heartP + baseP * 0.5, 0.0, 1.0));
  float haze = fbm(q * 1.05 + uTime * 0.01);
  // Explicit background shift — not a subtle haze
  vec3 dryVoid = mix(voidCol, phaseCol * 0.22, 0.55 + baseP * 0.25);
  col = mix(col, dryVoid, 0.72 * wdr);
  col = mix(col, phaseCol * (0.28 + topP * 0.18), (0.4 + haze * 0.35) * wdr);
  col += uFocus * exp(-length(q) * mix(1.8, 0.9, uDry)) * (0.12 + heartP * 0.1) * wdr;
  col *= mix(1.0, 0.82 + (1.0 - uDry) * 0.2, wdr);

  float wb = wMode(m, 9.0);
  col = mix(col, vec3(0.028, 0.026, 0.03), 0.25 * wb);

  float grain = hash(uv * uRes * 0.1 + floor(uTime * 2.5));
  col += (grain - 0.5) * 0.0025;

  float vig = smoothstep(1.5, 0.28, length(p * vec2(1.02, 1.12)));
  col *= vig;
  col = pow(max(col, 0.0), vec3(0.94));
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createUniverseMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
      uMode: { value: 0 },
      uLocal: { value: 0 },
      uHover: { value: 0 },
      uSelect: { value: 0 },
      uDry: { value: 0 },
      uReveal: { value: 0 },
      uLab: { value: 0 },
      uMatch: { value: 0.5 },
      uAccent: { value: new THREE.Color("#6B4EFF") },
      uFocus: { value: new THREE.Color("#EAE6DD") },
      uBone: { value: new THREE.Color("#EAE6DD") },
      uDna0: { value: 0.5 },
      uDna1: { value: 0.5 },
      uDna2: { value: 0.5 },
      uDna3: { value: 0.5 },
      uDna4: { value: 0.5 },
    },
    vertexShader: vert,
    fragmentShader: frag,
    depthTest: false,
    depthWrite: false,
  });
}

export function chapterMode(id: ChapterId) {
  return CHAPTER_MODE[id];
}
