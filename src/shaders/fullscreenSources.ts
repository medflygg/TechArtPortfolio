import bufferASource from "./rainForest/bufferA.glsl?raw";
import imageSource from "./rainForest/image.glsl?raw";

export const rainForestBufferA = bufferASource;
export const rainForestImage = imageSource;

export const rainForestMeta = {
  id: "rain-forest",
  title: "Rain Forest",
  language: "GLSL · Buffer A + Image",
  label: "preview · local multipass",
  note: "Local WebGL2 multipass (Buffer A ping-pong → Image).",
};

export const cloudsLocalCode = `// Volumetric clouds — local fullscreen GLSL

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 p = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash(p + vec3(0,0,0));
  float n100 = hash(p + vec3(1,0,0));
  float n010 = hash(p + vec3(0,1,0));
  float n110 = hash(p + vec3(1,1,0));
  float n001 = hash(p + vec3(0,0,1));
  float n101 = hash(p + vec3(1,0,1));
  float n011 = hash(p + vec3(0,1,1));
  float n111 = hash(p + vec3(1,1,1));
  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z) * 2.0 - 1.0;
}

float mapCloud(vec3 p, float t) {
  vec3 q = p - vec3(0.0, 0.1, 1.0) * t;
  float f = 0.5000 * noise(q); q *= 2.02;
  f += 0.2500 * noise(q); q *= 2.03;
  f += 0.1250 * noise(q); q *= 2.01;
  f += 0.0625 * noise(q);
  return clamp(1.5 - p.y - 2.0 + 1.75 * f, 0.0, 1.0);
}

vec3 sundir = normalize(vec3(-1.0, 0.0, -1.0));

vec4 raymarch(vec3 ro, vec3 rd, vec3 bg) {
  vec4 sum = vec4(0.0);
  float t = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 pos = ro + t * rd;
    if (pos.y < -3.0 || pos.y > 2.0 || sum.a > 0.99) break;
    float den = mapCloud(pos, iTime);
    if (den > 0.01) {
      float dif = clamp((den - mapCloud(pos + 0.3 * sundir, iTime)) / 0.6, 0.0, 1.0);
      vec3 lin = vec3(0.65, 0.68, 0.7) * 1.3 + 0.5 * vec3(0.7, 0.5, 0.3) * dif;
      vec4 col = vec4(mix(1.15 * vec3(1.0, 0.95, 0.8), vec3(0.65), den), den);
      col.xyz *= lin;
      col.xyz = mix(col.xyz, bg, 1.0 - exp(-0.003 * t * t));
      col.a *= 0.4;
      col.rgb *= col.a;
      sum += col * (1.0 - sum.a);
    }
    t += max(0.08, 0.02 * t);
  }
  return clamp(sum, 0.0, 1.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  vec2 m = iMouse.xy / max(iResolution.xy, vec2(1.0));
  if (length(iMouse.xy) < 1.0) m = vec2(0.45, 0.35);

  vec3 ro = 4.0 * normalize(vec3(sin(3.0 * m.x), 0.35 + 0.4 * m.y, cos(3.0 * m.x)));
  vec3 ta = vec3(0.0, -1.0, 0.0);
  vec3 cw = normalize(ta - ro);
  vec3 cu = normalize(cross(cw, vec3(0.0, 1.0, 0.0)));
  vec3 cv = normalize(cross(cu, cw));
  vec3 rd = normalize(p.x * cu + p.y * cv + 1.5 * cw);

  float sun = clamp(dot(sundir, rd), 0.0, 1.0);
  vec3 col = vec3(0.6, 0.71, 0.75) - rd.y * 0.2 * vec3(1.0, 0.5, 1.0) + 0.075;
  col += 0.2 * vec3(1.0, 0.6, 0.1) * pow(sun, 8.0);

  vec4 res = raymarch(ro, rd, col);
  col = col * (1.0 - res.w) + res.xyz;
  col += 0.1 * vec3(1.0, 0.4, 0.2) * pow(sun, 3.0);

  fragColor = vec4(col, 1.0);
}
`;

export const fakeLightFullscreenCode = `// Fake dynamic lighting lab — Mobile Forward vibe
// Soft keyed "lanterns" without real lights.

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

  vec3 base = mix(vec3(0.05, 0.06, 0.08), vec3(0.12, 0.14, 0.11), uv.y);
  vec3 col = base;

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 c = vec2(
      sin(iTime * (0.2 + 0.03 * fi) + fi * 1.7),
      cos(iTime * (0.15 + 0.02 * fi) + fi)
    ) * vec2(1.1, 0.7);
    float d = length(p - c);
    float w = 0.18 + 0.04 * sin(iTime * 2.0 + fi);
    vec3 tint = mix(vec3(1.0, 0.55, 0.2), vec3(0.4, 0.9, 1.0), fract(fi * 0.17));
    col += tint * exp(-d * d / (w * w)) * 0.35;
  }

  float grain = (hash21(fragCoord + iTime) - 0.5) * 0.03;
  col += grain;
  fragColor = vec4(col, 1.0);
}
`;
