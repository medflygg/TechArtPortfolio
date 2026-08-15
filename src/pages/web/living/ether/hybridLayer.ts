import * as THREE from "three";

export const quadVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/** Void smoke / nebula — authored shader, not a gen plate. */
export const atmosFrag = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uAccent;
uniform float uDensity;
uniform float uOpacity;
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
  for(int i=0;i<5;i++){ v += a * noise(p); p *= 2.05; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  p.x += uMouse.x * 0.04;
  p.y += uMouse.y * 0.03;
  float n = fbm(p * 1.35 + vec2(uTime * 0.028, -uTime * 0.02));
  float n2 = fbm(p * 2.5 - vec2(uTime * 0.035, uTime * 0.022));
  float smoke = smoothstep(0.28, 0.82, n * 0.62 + n2 * 0.48);
  float sides = smoothstep(0.2, 0.95, abs(p.x) * 0.8 + (1.0 - abs(p.y)) * 0.15);
  smoke *= mix(0.4, 1.0, sides);
  vec3 base = vec3(0.02, 0.018, 0.022);
  vec3 col = mix(base, uAccent * 0.42, smoke * uDensity);
  col += uAccent * exp(-length(p) * 1.5) * 0.1;
  float spark = step(0.996, hash(vUv * 900.0 + floor(uTime * 2.5)));
  col += spark * 0.25;
  float vig = smoothstep(1.35, 0.25, length(p * vec2(1.05, 1.15)));
  col *= vig;
  gl_FragColor = vec4(col, uOpacity);
}
`;

export const glassFrag = /* glsl */ `
uniform float uTime;
uniform float uAmount;
uniform vec3 uAccent;
varying vec2 vUv;
void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float rip = sin(r * 26.0 - uTime * 1.3) * 0.5 + 0.5;
  float ring = smoothstep(0.55, 0.12, r);
  vec3 col = mix(vec3(0.02), uAccent * 0.35, rip * ring * uAmount);
  float alpha = (0.12 + ring * 0.5) * uAmount;
  gl_FragColor = vec4(col, alpha);
}
`;

export function createAtmosMaterial(accent = "#6B4EFF") {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uAccent: { value: new THREE.Color(accent) },
      uDensity: { value: 0.65 },
      uOpacity: { value: 1 },
    },
    vertexShader: quadVert,
    fragmentShader: atmosFrag,
    transparent: true,
    depthWrite: false,
  });
}

export function createGlassVeilMaterial(accent = "#6B4EFF") {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uAmount: { value: 0 },
      uAccent: { value: new THREE.Color(accent) },
    },
    vertexShader: quadVert,
    fragmentShader: glassFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function createMoleculePoints(count = 180, color = "#6B4EFF") {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 4.2;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    seed[i] = Math.random() * Math.PI * 2;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.4, "rgba(255,255,255,0.4)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    map: new THREE.CanvasTexture(c),
    size: 0.055,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData.home = pos.slice();
  return pts;
}

export function tickMolecules(
  pts: THREE.Points,
  t: number,
  pointer: THREE.Vector2,
  intensity: number,
  color: string,
) {
  if (pts.material instanceof THREE.PointsMaterial) {
    pts.material.color.lerp(new THREE.Color(color), 0.06);
    pts.material.opacity = 0.1 + intensity * 0.4;
    pts.material.size = 0.03 + intensity * 0.035;
  }
  const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
  const seed = pts.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
  const home = pts.userData.home as Float32Array;
  for (let i = 0; i < pos.count; i++) {
    const s = seed.getX(i);
    let x = home[i * 3] + Math.sin(t * 0.18 + s) * 0.1;
    let y = home[i * 3 + 1] + Math.cos(t * 0.15 + s) * 0.08;
    let z = home[i * 3 + 2] + Math.sin(t * 0.12 + s) * 0.07;
    const dx = pointer.x * 1.4 - x;
    const dy = pointer.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
    if (dist < 1) {
      const w = (1 - dist) ** 2;
      x += (dx / dist) * w * 0.06 * intensity;
      y += (dy / dist) * w * 0.06 * intensity;
    }
    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;
}

export function createPathStream(count = 200) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) seed[i] = Math.random();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "#fff");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({
    color: 0xe0b35a,
    map: new THREE.CanvasTexture(c),
    size: 0.05,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pts = new THREE.Points(geo, mat);
  pts.visible = false;
  return pts;
}

export function tickPathStream(
  stream: THREE.Points,
  from: THREE.Vector3,
  to: THREE.Vector3,
  progress: number,
  accent: string,
  t: number,
) {
  const on = progress > 0.02;
  stream.visible = on;
  if (!on) return;
  if (stream.material instanceof THREE.PointsMaterial) {
    stream.material.color.set(accent);
    stream.material.opacity = Math.min(0.85, progress * 1.1);
  }
  const pos = stream.geometry.attributes.position as THREE.BufferAttribute;
  const seed = stream.geometry.getAttribute("aSeed") as THREE.BufferAttribute;
  const mid = from.clone().lerp(to, 0.45);
  mid.y += 0.5;
  mid.z += 0.3;
  for (let i = 0; i < pos.count; i++) {
    const s = seed.getX(i);
    const f = (s * 0.85 + progress * 0.9 + t * 0.05) % 1;
    const inv = 1 - f;
    const x = inv * inv * from.x + 2 * inv * f * mid.x + f * f * to.x;
    const y = inv * inv * from.y + 2 * inv * f * mid.y + f * f * to.y;
    const z = inv * inv * from.z + 2 * inv * f * mid.z + f * f * to.z;
    const spread = Math.sin(f * Math.PI) * 0.05;
    pos.setXYZ(i, x + Math.sin(s * 18) * spread, y + Math.cos(s * 14) * spread, z);
  }
  pos.needsUpdate = true;
}
