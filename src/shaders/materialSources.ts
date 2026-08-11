export const materialVertex = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

/**
 * Fill only — solid white, no lighting.
 * Black silhouette is a screen-space mask dilate in the preview (not N·V / hull).
 */
export const toonOutlineMaterialFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uLightDir;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

export const fakeLanternMaterialFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uLightDir;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 n = normalize(vNormal);
  vec3 base = vec3(0.08, 0.09, 0.1);
  float ambient = 0.18 + 0.08 * max(dot(n, normalize(uLightDir)), 0.0);

  vec3 col = base * ambient;
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec3 lp = vec3(
      sin(uTime * (0.4 + 0.1 * fi) + fi) * 1.4,
      0.6 + 0.4 * cos(uTime * 0.3 + fi),
      cos(uTime * (0.35 + 0.08 * fi) + fi * 1.3) * 1.4
    );
    vec3 toL = lp - vWorldPos;
    float dist = length(toL);
    vec3 ld = toL / max(dist, 0.001);
    float atten = 1.0 / (0.35 + dist * dist);
    float ndl = max(dot(n, ld), 0.0);
    vec3 tint = mix(vec3(1.0, 0.55, 0.2), vec3(0.45, 0.85, 1.0), fract(fi * 0.23));
    col += tint * ndl * atten * 0.55;
  }

  vec3 r = reflect(-normalize(uLightDir), n);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  col += vec3(0.15) * pow(max(dot(r, viewDir), 0.0), 24.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const materialPresets = [
  {
    id: "toon-outline",
    title: "Toon outlines",
    language: "GLSL",
    code: toonOutlineMaterialFragment,
    silhouetteOutline: true,
  },
  {
    id: "lanterns",
    title: "Fake dynamic lanterns",
    language: "GLSL",
    code: fakeLanternMaterialFragment,
    silhouetteOutline: false,
  },
] as const;
