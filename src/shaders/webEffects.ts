import { defaultSmokeParams } from "../lab/smokeParams";

/** Procedural web FX — abstract backgrounds (shaders.com–style). */

export type WebFloatParam = {
  type?: "float";
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
};

export type WebColorParam = {
  type: "color";
  key: string;
  label: string;
  default: string;
};

export type WebEffectParam = WebFloatParam | WebColorParam;

export type WebEffectKind = "bg" | "logo";

export type WebEffect = {
  id: string;
  title: string;
  blurb: string;
  fragment: string;
  params: WebEffectParam[];
  engine?: "fragment" | "smoke" | "particles";
  kind?: WebEffectKind;
  interactive?: boolean;
  needsImage?: boolean;
};

export function isColorParam(p: WebEffectParam): p is WebColorParam {
  return p.type === "color";
}

export function isFloatParam(p: WebEffectParam): p is WebFloatParam {
  return p.type !== "color";
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(6, "0").slice(0, 6);
  const n = parseInt(full, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const HEADER = `precision highp float;
uniform vec2 uResolution;
uniform float uTime;
// Speed-scaled clock accumulated on the CPU: changing uSpeed retimes the
// animation instead of teleporting its phase.
uniform float uPhase;
uniform vec2 uMouse;
uniform vec2 uMousePrev;
uniform float uSpeed;
uniform float uScale;
uniform float uIntensity;
uniform float uContrast;
uniform float uDetail;
uniform float uWarp;
uniform float uHover;
uniform float uCenterX;
uniform float uCenterY;
uniform float uRings;
uniform float uFacets;
uniform float uRefract;
uniform float uDispersion;
uniform float uGlow;
uniform float uOpacity;
uniform sampler2D uImage;
uniform float uHasImage;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uBg;

`;

export function wrap(body: string) {
  return HEADER + body;
}

export const COMMON = `
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  vec2 u=f*f*(3.0-2.0*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.02+vec2(1.7,9.2); a*=0.5; }
  return v;
}
vec2 mouseN(){
  vec2 m=(uMouse-0.5*uResolution.xy)/uResolution.y;
  if(length(uMouse)<1.0) m=vec2(0.0);
  return m;
}
`;

const SMOKE_DOC = `// ATLAS · Smoke — Stable Fluids (velocity + density), WebSmokeCanvas
`;

export const floats = (
  items: Omit<WebFloatParam, "type">[],
): WebFloatParam[] => items.map((p) => ({ ...p, type: "float" as const }));

export const colors = (
  items: { key: string; label: string; default: string }[],
): WebColorParam[] => items.map((p) => ({ ...p, type: "color" as const }));

export const webEffects: WebEffect[] = [
  {
    id: "smoke",
    title: "Smoke",
    blurb: "Stable Fluids · coasts after you stop",
    engine: "smoke",
    interactive: true,
    fragment: SMOKE_DOC,
    params: [
      ...floats([
        { key: "uSpeed", label: "Turbulence", min: 0, max: 8, step: 0.1, default: defaultSmokeParams.uSpeed },
        { key: "uDirection", label: "Wind", min: 0, max: 360, step: 1, default: defaultSmokeParams.uDirection },
        { key: "uFade", label: "Fade Rate", min: 0.05, max: 0.8, step: 0.01, default: defaultSmokeParams.uFade },
        { key: "uGravity", label: "Rise / Fall", min: 0, max: 1.2, step: 0.05, default: defaultSmokeParams.uGravity },
        { key: "uSpread", label: "Brush", min: 8, max: 60, step: 1, default: defaultSmokeParams.uSpread },
        { key: "uDensity", label: "Density", min: 0.1, max: 1.5, step: 0.05, default: defaultSmokeParams.uDensity },
        { key: "uInertia", label: "Coast", min: 0.1, max: 0.85, step: 0.01, default: defaultSmokeParams.uInertia },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: defaultSmokeParams.uBg },
        { key: "uColorA", label: "Color A", default: defaultSmokeParams.uColorA },
        { key: "uColorB", label: "Color B", default: defaultSmokeParams.uColorB },
      ]),
    ],
  },
  {
    id: "liquid",
    title: "Liquid",
    blurb: "Molten marble bands · opaque liquid",
    interactive: true,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uResolution.xy)/uResolution.y;
  vec2 m=mouseN();
  float t=uPhase*0.22;
  // Domain-warped marble — thick opaque ribbons (not smoke/fbm clouds)
  vec2 p=uv*uScale;
  p+=m*uWarp*0.12; // gentle field drift from cursor
  vec2 q=vec2(fbm(p+t*0.15), fbm(p+vec2(5.2,1.3)-t*0.12));
  vec2 r=vec2(
    fbm(p+1.6*q*uIntensity+vec2(1.7,9.2)+t*0.05),
    fbm(p+1.6*q*uIntensity+vec2(8.3,2.8)-t*0.04)
  );
  float f=fbm(p+1.9*r*uIntensity);
  // Ribbon index via sine of warped field
  float band=0.5+0.5*sin(f*6.283185*(1.0+uDetail*2.0)+r.x*4.0+t);
  band=smoothstep(0.15,0.85,band);
  // Full-coverage molten palette
  vec3 col=mix(uBg,uColorA,smoothstep(0.0,0.35,f));
  col=mix(col,uColorB,smoothstep(0.25,0.6,f));
  col=mix(col,uColorC,smoothstep(0.55,0.9,f)*band);
  col=mix(col,uColorC,pow(band,3.0)*0.35*uContrast);
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Speed", min: 0.02, max: 1.2, step: 0.02, default: 0.28 },
        { key: "uScale", label: "Scale", min: 0.4, max: 3, step: 0.05, default: 1.15 },
        { key: "uIntensity", label: "Warp", min: 0.4, max: 2.2, step: 0.05, default: 1.15 },
        { key: "uContrast", label: "Gloss", min: 0.2, max: 2, step: 0.05, default: 1.0 },
        { key: "uDetail", label: "Ribbons", min: 0.2, max: 2, step: 0.05, default: 0.85 },
        { key: "uWarp", label: "Cursor drift", min: 0, max: 1.2, step: 0.05, default: 0.35 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#080204" },
        { key: "uColorA", label: "Color A", default: "#8B1A0A" },
        { key: "uColorB", label: "Color B", default: "#F06718" },
        { key: "uColorC", label: "Color C", default: "#FFC89A" },
      ]),
    ],
  },
  {
    id: "holo",
    title: "Holo",
    blurb: "Full-bleed iridescent foil · marble bands",
    interactive: true,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uResolution.xy)/uResolution.y;
  vec2 m=mouseN();
  float t=uPhase*0.18;
  // Oil-on-water / holographic foil — opaque sweeping bands
  vec2 p=uv*uScale*0.85;
  p+=m*uWarp*0.1;
  vec2 q=vec2(fbm(p+vec2(t*0.2,-0.1)), fbm(p+vec2(2.7,5.1)-t*0.15));
  vec2 r=vec2(
    fbm(p+uIntensity*1.7*q+vec2(1.7,9.2)+t*0.08),
    fbm(p+uIntensity*1.7*q+vec2(8.3,2.8)-t*0.06)
  );
  float f=fbm(p+uIntensity*2.0*r);
  // Continuous phase — no fract() wrap (that caused hard color seams)
  float h=(f*2.4+r.x*1.2+r.y*0.55+uv.x*0.2+t*0.1)*6.283185;
  float wA=0.5+0.5*cos(h);
  float wB=0.5+0.5*cos(h+2.094395);
  float wC=0.5+0.5*cos(h+4.188790);
  float wSum=max(wA+wB+wC,1e-4);
  vec3 col=(uColorA*wA+uColorB*wB+uColorC*wC)/wSum;
  // Soft sheen — keep gradients smooth
  float gloss=0.5+0.5*sin((f+r.y)*6.283185*(0.55+uDetail*0.35));
  gloss=smoothstep(0.15,0.95,gloss);
  col=mix(col,col*1.08+uColorC*0.06,gloss*0.22*uContrast);
  col=mix(uBg,col,0.94);
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Speed", min: 0.02, max: 1, step: 0.02, default: 0.22 },
        { key: "uScale", label: "Scale", min: 0.5, max: 3.5, step: 0.05, default: 1.35 },
        { key: "uIntensity", label: "Warp", min: 0.5, max: 2.5, step: 0.05, default: 1.35 },
        { key: "uContrast", label: "Gloss", min: 0.2, max: 2, step: 0.05, default: 1.0 },
        { key: "uDetail", label: "Shimmer", min: 0.2, max: 2, step: 0.05, default: 0.9 },
        { key: "uWarp", label: "Cursor drift", min: 0, max: 1.2, step: 0.05, default: 0.3 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#1A1028" },
        { key: "uColorA", label: "Color A", default: "#FF2EC8" },
        { key: "uColorB", label: "Color B", default: "#3DE8FF" },
        { key: "uColorC", label: "Color C", default: "#C8FF3A" },
      ]),
    ],
  },
  {
    id: "wave",
    title: "Wave",
    blurb: "Soft light sweeps · animated",
    interactive: false,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution.xy;
  float t=uPhase*0.45;
  float w=0.0;
  w+=0.55*exp(-pow((uv.y-0.55-0.06*sin(uv.x*uScale*5.5+t))*10.0*uContrast,2.0));
  w+=0.32*exp(-pow((uv.y-0.42-0.05*sin(uv.x*uScale*3.8-t*1.1))*9.0,2.0));
  w+=0.22*exp(-pow((uv.y-0.66+0.04*cos(uv.x*uScale*4.5+t*0.7))*12.0,2.0));
  w*=uIntensity;
  vec3 col=mix(uBg,uColorA,w);
  col=mix(col,uColorB,w*w*0.65);
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Speed", min: 0.05, max: 1.5, step: 0.05, default: 0.45 },
        { key: "uScale", label: "Freq", min: 0.5, max: 4, step: 0.05, default: 1.5 },
        { key: "uIntensity", label: "Glow", min: 0.3, max: 2, step: 0.05, default: 1.1 },
        { key: "uContrast", label: "Soft", min: 0.4, max: 2, step: 0.05, default: 1.0 },
        { key: "uDetail", label: "Layers", min: 0, max: 1, step: 0.05, default: 0.5 },
        { key: "uWarp", label: "Bend", min: 0, max: 1, step: 0.05, default: 0.35 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#000000" },
        { key: "uColorA", label: "Color A", default: "#FFD24A" },
        { key: "uColorB", label: "Color B", default: "#FFE9A8" },
        { key: "uColorC", label: "Color C", default: "#FFB020" },
      ]),
    ],
  },
  {
    id: "bands",
    title: "Bands",
    blurb: "Curved light bands · animated",
    interactive: false,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution.xy;
  float t=uPhase*0.4;
  float y=uv.y+0.1*uWarp*sin(uv.x*3.0+t);
  float d=(uv.x*0.3+y)*uScale+t*0.15;
  float b=abs(fract(d)-0.5);
  b=pow(smoothstep(0.5/max(uContrast,0.2),0.0,b),1.5);
  b*=uIntensity;
  vec3 col=mix(uBg,uColorA,b);
  col=mix(col,uColorB,b*smoothstep(0.4,1.0,b));
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Speed", min: 0, max: 2, step: 0.05, default: 0.4 },
        { key: "uScale", label: "Density", min: 1, max: 10, step: 0.1, default: 4.0 },
        { key: "uIntensity", label: "Strength", min: 0.2, max: 2, step: 0.05, default: 1.0 },
        { key: "uContrast", label: "Hard", min: 0.5, max: 4, step: 0.05, default: 2.0 },
        { key: "uDetail", label: "Sharp", min: 0, max: 1, step: 0.05, default: 0.6 },
        { key: "uWarp", label: "Bend", min: 0, max: 1.5, step: 0.05, default: 0.7 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#000000" },
        { key: "uColorA", label: "Color A", default: "#FFD93A" },
        { key: "uColorB", label: "Color B", default: "#FFF1A0" },
        { key: "uColorC", label: "Color C", default: "#E8A820" },
      ]),
    ],
  },
  {
    id: "rings",
    title: "Rings",
    blurb: "Neon ring bases · pulse · set count",
    interactive: false,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution.xy;
  float aspect=uResolution.x/uResolution.y;
  vec2 center=vec2(uCenterX,uCenterY);
  vec2 p=(uv-center)*vec2(aspect,1.0);
  float r=length(p);
  float count=clamp(floor(uRings+0.5),1.0,20.0);
  float spacing=1.0/max(uScale,0.5);
  // Soft filled ring bases only — no outline/glow stroke
  float band=1e5;
  for(int i=0;i<20;i++){
    float fi=float(i);
    float on=step(fi,count-0.5);
    float ri=(fi+1.0)*spacing;
    band=min(band,mix(1e5,abs(r-ri),on));
  }
  float halfW=spacing*mix(0.18,0.42,clamp(uContrast*0.5,0.0,1.0));
  float base=smoothstep(halfW,halfW*0.12,band);
  // Pulse only the base fill
  float pulse=0.72+0.28*sin(uPhase*2.4);
  vec3 neon=mix(uColorA,uColorB,smoothstep(0.0,count*spacing,r));
  neon=mix(neon,uColorC,base*0.4);
  vec3 col=mix(uBg,neon,base*pulse*uIntensity);
  col=mix(uBg,col,smoothstep(1.55,0.2,r)*uDetail+(1.0-uDetail));
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uCenterX", label: "Center X", min: 0, max: 1, step: 0.01, default: 0.5 },
        { key: "uCenterY", label: "Center Y", min: 0, max: 1, step: 0.01, default: 0.5 },
        { key: "uRings", label: "Rings", min: 1, max: 16, step: 1, default: 6 },
        { key: "uScale", label: "Spacing", min: 2, max: 18, step: 0.1, default: 7 },
        { key: "uIntensity", label: "Neon", min: 0.3, max: 2, step: 0.05, default: 1.15 },
        { key: "uContrast", label: "Thickness", min: 0.3, max: 2, step: 0.05, default: 1.0 },
        { key: "uSpeed", label: "Pulse", min: 0, max: 2, step: 0.05, default: 0.35 },
        { key: "uDetail", label: "Vignette", min: 0, max: 1, step: 0.05, default: 0.55 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#050508" },
        { key: "uColorA", label: "Color A", default: "#5CFFEA" },
        { key: "uColorB", label: "Color B", default: "#FF4AD2" },
        { key: "uColorC", label: "Color C", default: "#FFFFFF" },
      ]),
    ],
  },
  {
    id: "blockify",
    title: "Blockify",
    blurb: "Macro voxels · local image",
    interactive: false,
    needsImage: true,
    fragment: wrap(
      COMMON +
        `
vec3 fallback(vec2 uv){
  return mix(uColorA,uColorB,uv.y)+uColorC*0.15*sin(uv.x*8.0);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution.xy;
  float cells=max(uScale,2.0);
  vec2 gv=floor(uv*cells);
  vec2 cuv=(gv+0.5)/cells;
  vec3 tex=uHasImage>0.5 ? texture2D(uImage,cuv).rgb : fallback(cuv);
  float levels=mix(3.0,10.0,clamp(uIntensity,0.0,1.0));
  tex=floor(tex*levels+0.5)/levels;
  tex=mix(uBg,tex,uContrast);
  float pulse=0.94+0.06*sin(uPhase*4.0+gv.x*0.2);
  gl_FragColor=vec4(tex*pulse,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Pulse", min: 0, max: 2, step: 0.05, default: 0.2 },
        { key: "uScale", label: "Blocks", min: 4, max: 48, step: 1, default: 14 },
        { key: "uIntensity", label: "Posterize", min: 0.2, max: 2, step: 0.05, default: 1 },
        { key: "uContrast", label: "Mix", min: 0.3, max: 1.5, step: 0.05, default: 1 },
        { key: "uDetail", label: "Levels", min: 0, max: 1, step: 0.05, default: 0.5 },
        { key: "uWarp", label: "Jitter", min: 0, max: 1, step: 0.05, default: 0 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#101218" },
        { key: "uColorA", label: "Color A", default: "#3A6FFF" },
        { key: "uColorB", label: "Color B", default: "#E8F0FF" },
        { key: "uColorC", label: "Color C", default: "#88AADD" },
      ]),
    ],
  },
  {
    id: "pixels",
    title: "Pixels",
    blurb: "Fine pixel grid · local image",
    interactive: false,
    needsImage: true,
    fragment: wrap(
      COMMON +
        `
vec3 fallback(vec2 uv){
  return mix(mix(uColorA,uColorB,uv.x),uColorC,uv.y);
}
void main(){
  vec2 guv=gl_FragCoord.xy/uResolution.xy;
  float aspect=uResolution.x/uResolution.y;
  float cells=max(uScale,4.0);
  vec2 cell=floor(guv*vec2(cells*aspect,cells));
  vec2 f=fract(guv*vec2(cells*aspect,cells));
  vec2 cuv=(cell+0.5)/vec2(cells*aspect,cells);
  vec3 tex=uHasImage>0.5 ? texture2D(uImage,cuv).rgb : fallback(cuv);
  tex=pow(tex,vec3(1.0/max(uContrast,0.2)));
  float gap=uIntensity*0.25;
  float pix=step(gap,f.x)*step(gap,f.y)*step(f.x,1.0-gap)*step(f.y,1.0-gap);
  float shimmer=0.92+0.08*sin(uPhase*6.0+cell.x*0.3);
  gl_FragColor=vec4(mix(uBg,tex*shimmer,pix),1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Shimmer", min: 0, max: 2, step: 0.05, default: 0.35 },
        { key: "uScale", label: "Grid", min: 16, max: 120, step: 1, default: 48 },
        { key: "uIntensity", label: "Gap", min: 0, max: 1, step: 0.02, default: 0.25 },
        { key: "uContrast", label: "Boost", min: 0.5, max: 2, step: 0.05, default: 1.1 },
        { key: "uDetail", label: "Soft", min: 0, max: 1, step: 0.05, default: 0.4 },
        { key: "uWarp", label: "Offset", min: 0, max: 1, step: 0.05, default: 0 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#0A0A0E" },
        { key: "uColorA", label: "Color A", default: "#8CB8FF" },
        { key: "uColorB", label: "Color B", default: "#FF9EC8" },
        { key: "uColorC", label: "Color C", default: "#F5F7FF" },
      ]),
    ],
  },
  {
    id: "fluted",
    title: "Fluted",
    blurb: "Ribbed glass from noise · soft cursor",
    interactive: true,
    needsImage: true,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution.xy;
  vec2 m=uMouse/uResolution.xy;
  if(length(uMouse)<1.0) m=vec2(0.5);
  float t=uPhase*0.2;
  float x=uv.x*uScale+t+(m.x-0.5)*uWarp*1.2;
  float ridge=sin(x*6.283185);
  // noise micro-structure
  float n=fbm(vec2(x*0.35,uv.y*uScale*0.4)+t);
  float shade=0.5+0.5*ridge;
  shade=mix(shade,n,0.25*uDetail);
  shade=pow(clamp(shade,0.0,1.0),mix(0.7,1.4,uContrast*0.4));
  vec3 base=mix(uColorA,uColorB,uv.y);
  if(uHasImage>0.5){
    vec2 suv=uv+vec2(ridge*0.02*uIntensity,0.0);
    base=mix(base,texture2D(uImage,suv).rgb,0.55);
  }
  vec3 col=mix(uBg,base,0.55+0.45*shade);
  col=mix(col,uColorC,pow(max(ridge,0.0),8.0)*uIntensity*0.5);
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Drift", min: 0, max: 1.2, step: 0.05, default: 0.2 },
        { key: "uScale", label: "Flutes", min: 6, max: 48, step: 1, default: 20 },
        { key: "uIntensity", label: "Sheen", min: 0.2, max: 2, step: 0.05, default: 0.9 },
        { key: "uContrast", label: "Depth", min: 0.3, max: 2, step: 0.05, default: 1.0 },
        { key: "uDetail", label: "Noise", min: 0, max: 1.5, step: 0.05, default: 0.7 },
        { key: "uWarp", label: "Cursor", min: 0, max: 1.5, step: 0.05, default: 0.35 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#101218" },
        { key: "uColorA", label: "Color A", default: "#6A8CFF" },
        { key: "uColorB", label: "Color B", default: "#FF8EB8" },
        { key: "uColorC", label: "Color C", default: "#F5F8FF" },
      ]),
    ],
  },
  {
    id: "mesh",
    title: "Mesh",
    blurb: "Wire grid · gentle cursor warp",
    interactive: true,
    fragment: wrap(
      COMMON +
        `
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*uResolution.xy)/uResolution.y;
  vec2 m=mouseN();
  float t=uPhase*0.35;
  uv+=0.08*uIntensity*vec2(sin(uv.y*3.0+t),cos(uv.x*3.0-t));
  uv+=0.12*uWarp*m*exp(-dot(uv,uv)*1.2);
  vec2 g=abs(fract(uv*uScale)-0.5);
  float line=min(g.x,g.y);
  line=1.0-smoothstep(0.0,0.04/max(uContrast,0.2),line);
  vec3 col=mix(uBg,uColorA,line);
  col=mix(col,uColorB,line*smoothstep(0.5,1.0,line)*0.5);
  gl_FragColor=vec4(col,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Speed", min: 0.05, max: 1.5, step: 0.05, default: 0.35 },
        { key: "uScale", label: "Density", min: 3, max: 24, step: 0.5, default: 9 },
        { key: "uIntensity", label: "Wave", min: 0.1, max: 1.5, step: 0.05, default: 0.7 },
        { key: "uContrast", label: "Line", min: 0.4, max: 2.5, step: 0.05, default: 1.2 },
        { key: "uDetail", label: "Thickness", min: 0, max: 1, step: 0.05, default: 0.5 },
        { key: "uWarp", label: "Cursor", min: 0, max: 1.2, step: 0.05, default: 0.4 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#000000" },
        { key: "uColorA", label: "Color A", default: "#C8CCD0" },
        { key: "uColorB", label: "Color B", default: "#EEF0F2" },
        { key: "uColorC", label: "Color C", default: "#889099" },
      ]),
    ],
  },
];

const LOGO = `
vec2 logoUv(){
  vec2 p=(gl_FragCoord.xy-0.5*uResolution.xy)/min(uResolution.x,uResolution.y);
  return p*(1.28/max(uScale,0.25))+vec2(0.5);
}
// Coverage lives in RGB, the signed distance to the outline in alpha; see
// logoMask.ts, which packs both and shares the SDF_RANGE constant below.
const float SDF_RANGE=0.085;
float logoMask(vec2 uv){
  if(uHasImage<0.5) return 0.0;
  if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) return 0.0;
  return texture2D(uImage,uv).r;
}
// Positive inside the mark, in uv units. Outside the texture the mark can only
// be further away, so fall back to the distance from the sampled edge.
float logoSdf(vec2 uv){
  if(uHasImage<0.5) return -1.0;
  vec2 c=clamp(uv,0.0,1.0);
  return (texture2D(uImage,c).a-0.5)*2.0*SDF_RANGE-length(uv-c);
}
vec3 logoN(vec2 uv){
  float e=1.5/min(uResolution.x,uResolution.y);
  float lft=logoMask(uv-vec2(e,0.0));
  float rgt=logoMask(uv+vec2(e,0.0));
  float dn=logoMask(uv-vec2(0.0,e));
  float up=logoMask(uv+vec2(0.0,e));
  return normalize(vec3(lft-rgt,dn-up,0.42));
}
vec2 mouseUv(){
  vec2 m=uMouse/uResolution.xy;
  if(length(uMouse)<1.0) m=vec2(0.52,0.58);
  return m;
}
vec2 mousePrevUv(){
  vec2 m=uMousePrev/uResolution.xy;
  if(length(uMousePrev)<1.0) m=mouseUv();
  return m;
}
// Mouse in the same space as logoUv() — stick effects must use this, not mouseUv().
vec2 mouseToLogo(vec2 mousePx){
  if(length(mousePx)<1.0) return vec2(0.52,0.58);
  vec2 p=(mousePx-0.5*uResolution.xy)/min(uResolution.x,uResolution.y);
  return p*(1.28/max(uScale,0.25))+vec2(0.5);
}
vec2 mouseLogoUv(){ return mouseToLogo(uMouse); }
vec2 mousePrevLogoUv(){ return mouseToLogo(uMousePrev); }
// 9-tap box blur of the mark — kept for a few soft body samples; blooms use
// logoBloom / logoEdgeGlow instead so halos stay smooth (no pixel steps).
float logoBlur(vec2 uv, float r){
  float d=r*0.70711;
  float s=logoMask(uv);
  s+=logoMask(uv+vec2(r,0.0))+logoMask(uv-vec2(r,0.0));
  s+=logoMask(uv+vec2(0.0,r))+logoMask(uv-vec2(0.0,r));
  s+=logoMask(uv+vec2(d,d))+logoMask(uv+vec2(d,-d));
  s+=logoMask(uv+vec2(-d,d))+logoMask(uv-vec2(d,d));
  return s/9.0;
}
// Soft outer glow from silhouette SDF — radial falloff, no texel-offset boxes.
// Radii should stay under ~SDF_RANGE so the packed field does not plateau.
float logoBloom(vec2 uv, float radius){
  float d=max(-logoSdf(uv),0.0);
  return exp(-d/max(radius,1e-4));
}
// Peak on the outer outline only (silhouette), not on internal facet seams.
float logoEdgeGlow(vec2 uv, float radius){
  return exp(-abs(logoSdf(uv))/max(radius,1e-4));
}
// Stacked SDF bloom — creamy neon/halo falloff.
float logoHalo(vec2 uv, float r){
  return clamp(
    logoBloom(uv,r)*0.50+
    logoBloom(uv,r*2.4)*0.32+
    logoBloom(uv,r*4.8)*0.18,
    0.0,1.0);
}
// Three-octave fbm for the expensive flow effects.
float fbm3(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<3;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=0.5; }
  return v;
}
float pot(vec2 p){ return noise(p)*0.64+noise(p*2.03+vec2(3.1,1.7))*0.30; }
// Curl of a scalar potential: divergence-free, so it swirls instead of stretching.
vec2 curl2(vec2 p){
  float e=0.055;
  float a=pot(p+vec2(0.0,e));
  float b=pot(p-vec2(0.0,e));
  float c=pot(p+vec2(e,0.0));
  float d=pot(p-vec2(e,0.0));
  return vec2(a-b,d-c)/(2.0*e);
}
float ridge(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<4;i++){
    v+=a*(1.0-abs(noise(p)*2.0-1.0));
    p=p*2.07+vec2(2.9,4.3);
    a*=0.5;
  }
  return v;
}
// Inflate the flat mark into a rounded solid. How far a pixel sits under the
// outline sets how far the normal tips outward, so the shoulder rolls over like
// a balloon instead of breaking into steps the way a coverage gradient does.
// Returns the anti-aliased silhouette in 'cover'.
// 'swell' pushes the outline outward, which rounds off sharp corners the way
// an inflated shape does.
vec3 dome(vec2 uv, float radius, float swell, out float cover){
  float e=0.0035;
  float d=logoSdf(uv)+swell;
  vec2 g=vec2(logoSdf(uv+vec2(e,0.0))-logoSdf(uv-vec2(e,0.0)),
              logoSdf(uv+vec2(0.0,e))-logoSdf(uv-vec2(0.0,e)));
  float gm=length(g);
  vec2 dir=gm>1e-5?g/gm:vec2(0.0,1.0);
  // Circular cross-section: at the rim the normal tips fully outward, at the
  // stroke centre it faces the camera — fat tubes, not flat bevels.
  float nd=clamp(d/max(radius,0.002),0.0,1.0);
  float k=sqrt(max(1.0-nd*nd,0.0));
  cover=smoothstep(-0.0015,0.0015,d);
  return normalize(vec3(-dir*k,nd+0.02));
}
// A mirrored studio box: deep floor, bright ceiling, a hard horizon and two
// strip lights. The hard steps are what separate chrome from grey plastic.
vec3 chromeEnv(vec3 R, float sharp){
  float y=clamp(R.y,-1.0,1.0);
  float e=mix(0.14,0.018,sharp);
  // Classic chrome matcap: dark floor / bright wall, horizon below eye line.
  vec3 c=mix(uColorA*0.55,uColorB,smoothstep(-e,e,y+0.28));
  c=mix(c,uColorC,smoothstep(0.38,0.82,y));             // ceiling softbox
  c=mix(c,uColorA*0.08,smoothstep(-0.35,-0.92,y));      // floor falls away
  // Bounce card under the horizon keeps undersides alive.
  c+=uColorB*0.55*pow(max(0.0,1.0-abs(y+0.58)*mix(5.0,12.0,sharp)),2.2);
  // Two strip lights — hard edges are what read as polish.
  c+=uColorC*pow(max(0.0,1.0-abs(y-0.02)*mix(10.0,32.0,sharp)),2.4)*1.05;
  c+=uColorC*pow(max(0.0,1.0-abs(y-0.55)*mix(8.0,22.0,sharp)),2.0)*0.55;
  // Window panels down the walls, faded out where the ceiling takes over.
  float panels=0.5+0.5*sin(atan(R.x,max(R.z,0.02))*5.0);
  return c*(1.0-0.38*panels*(1.0-smoothstep(0.28,0.78,abs(y))));
}
// What the eye finds along one refracted ray: the mark's own body seen from the
// inside, layered with slow internal banding. Sampled once per channel so
// dispersion splits it into colour fringes.
float gemLook(vec2 uv, vec2 off, float t){
  vec2 p=uv+off;
  // Soft body from silhouette distance — stays smooth under refraction offsets.
  float body=smoothstep(-0.055,0.018,logoSdf(p));
  float band=0.5+0.5*sin((p.x*5.2+p.y*6.4)+t*0.7);
  float veil=noise(p*5.0+vec2(t*0.09,-t*0.07));
  return clamp(body*0.62+band*0.24+veil*0.22,0.0,1.0);
}
// Distance travelled downward before hitting the mark — flames and drips ride it.
float below(vec2 uv, float reach){
  float b=0.0;
  for(int i=1;i<=7;i++){
    float k=float(i)/7.0;
    b=max(b, logoMask(uv-vec2(0.0,k*reach))*(1.0-k));
  }
  return b;
}
float grain(vec2 p){
  return hash(p*0.017+fract(uTime)*vec2(13.7,7.3))*2.0-1.0;
}
// Voronoi cut faces: x = distance to the facet seam, y = facet id,
// zw = that facet's plane tilt (constant per cell, so shading reads as flat glass).
vec4 facets(vec2 x){
  vec2 n=floor(x), f=fract(x);
  vec2 mg=vec2(0.0), mr=vec2(0.0);
  float md=8.0;
  for(int j=-1;j<=1;j++)
  for(int i=-1;i<=1;i++){
    vec2 g=vec2(float(i),float(j));
    vec2 o=vec2(hash(n+g),hash(n+g+vec2(19.2,7.1)));
    vec2 r=g+o-f;
    float d=dot(r,r);
    if(d<md){ md=d; mr=r; mg=g; }
  }
  float seam=8.0;
  for(int j=-1;j<=1;j++)
  for(int i=-1;i<=1;i++){
    vec2 g=mg+vec2(float(i),float(j));
    vec2 o=vec2(hash(n+g),hash(n+g+vec2(19.2,7.1)));
    vec2 r=g+o-f;
    vec2 d=r-mr;
    if(dot(d,d)>1e-5) seam=min(seam,dot(0.5*(mr+r),normalize(d)));
  }
  vec2 id=n+mg;
  vec2 tilt=vec2(hash(id+vec2(3.1,7.7)),hash(id+vec2(9.4,2.3)))*2.0-1.0;
  return vec4(seam,hash(id),tilt);
}
`;

webEffects.push(
  {
    id: "static-noise",
    title: "Static Noise",
    blurb: "Magnet clump · lag tail · gravity lean · fly home",
    kind: "logo",
    engine: "particles",
    interactive: true,
    needsImage: true,
    fragment: `// ATLAS · Static Noise — LogoParticlesCanvas (home · lag · leash)\n`,
    params: [
      ...floats([
        { key: "uSpeed", label: "Jitter", min: 0, max: 1.5, step: 0.02, default: 0.2 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uIntensity", label: "Grain", min: 0.3, max: 2, step: 0.05, default: 1.1 },
        { key: "uContrast", label: "Pull radius", min: 0.3, max: 2, step: 0.05, default: 0.7 },
        { key: "uDetail", label: "Density", min: 0.2, max: 1, step: 0.02, default: 0.65 },
        { key: "uWarp", label: "Chase", min: 0.2, max: 1.6, step: 0.05, default: 0.95 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#05060a" },
        { key: "uColorA", label: "Grain", default: "#f4f6ff" },
        { key: "uColorB", label: "Chroma A", default: "#ff4a6a" },
        { key: "uColorC", label: "Chroma B", default: "#4ad2ff" },
      ]),
    ],
  },
  {
    id: "mercury",
    title: "Mercury",
    blurb: "Liquid metal in the mark · drag to stir, keeps flowing",
    kind: "logo",
    engine: "smoke",
    interactive: true,
    needsImage: true,
    fragment: `// ATLAS · Mercury — WebSmokeCanvas (Stable Fluids · metal look)\n`,
    params: [
      ...floats([
        { key: "uSpeed", label: "Flow", min: 0.2, max: 3, step: 0.05, default: 1.2 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uDensity", label: "Wake", min: 0.1, max: 1.2, step: 0.02, default: 0.62 },
        { key: "uFade", label: "Settle", min: 0.05, max: 0.8, step: 0.01, default: 0.3 },
        { key: "uGravity", label: "Drift", min: 0, max: 1.2, step: 0.02, default: 0.18 },
        { key: "uSpread", label: "Brush", min: 8, max: 60, step: 1, default: 28 },
        { key: "uInertia", label: "Viscosity", min: 0.05, max: 0.9, step: 0.02, default: 0.86 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#0f0f0f" },
        { key: "uColorA", label: "Deep", default: "#040733" },
        { key: "uColorB", label: "Cyan", default: "#30c9ff" },
      ]),
    ],
  },
  {
    id: "gem",
    title: "Gem",
    blurb: "Crystal facets · orbiting light · soft edge glow",
    kind: "logo",
    interactive: true,
    needsImage: true,
    fragment: wrap(
      COMMON +
        LOGO +
        `
void main(){
  vec2 uv=logoUv();
  vec2 m=mouseUv();
  float mask=logoMask(uv);
  float t=uPhase;
  vec3 edgeN=logoN(uv);

  float cells=2.5+max(1.0,floor(uFacets+0.5))*3.0;
  vec4 fc=facets(uv*cells);
  float seam=fc.x;
  float id=fc.y;
  vec2 tilt=fc.zw;

  // One flat plane per cell, then a bevel that rolls the plane over near the seam.
  vec3 fN=normalize(vec3(tilt*mix(0.30,0.85,uContrast*0.5),1.0));
  float bevel=1.0-smoothstep(0.0,0.15,seam);
  fN=normalize(fN+vec3(normalize(tilt+vec2(1e-4))*bevel*0.6,0.0));
  float rimW=clamp(length(edgeN.xy)*1.7,0.0,1.0);
  vec3 N=normalize(mix(fN,edgeN,rimW*0.8));

  // Light orbits on its own; the cursor only leans it.
  vec3 L=normalize(vec3(cos(t*0.9),sin(t*0.7),0.62));
  L=normalize(L+vec3((m-uv)*uWarp*uHover*0.9,0.0));
  vec3 V=vec3(0.0,0.0,1.0);
  vec3 H=normalize(L+V);
  float ndl=max(dot(N,L),0.0);
  float hard=mix(28.0,90.0,uContrast*0.5);
  float fres=pow(1.0-max(dot(N,V),0.0),2.6);
  float F=clamp(0.05+0.95*fres,0.0,1.0);

  // Transmission: one refracted ray per channel. At Refraction 0 the rays stay
  // straight, so the stone stops bending and the fringes disappear on their own.
  float eta=1.0/(1.0+max(uRefract,0.0));
  float disp=uDispersion*0.14;
  vec3 I=vec3(0.0,0.0,-1.0);
  float k=0.40*(0.25+uRefract);
  vec3 rR=refract(I,N,eta*(1.0+disp));
  vec3 rG=refract(I,N,eta);
  vec3 rB=refract(I,N,eta*(1.0-disp));
  vec3 look=vec3(
    gemLook(uv,rR.xy*k,t),
    gemLook(uv,rG.xy*k,t),
    gemLook(uv,rB.xy*k,t));
  // Per-channel mix, so each wavelength lands on a different colour = prism.
  vec3 trans=mix(uColorA,uColorB,look);
  // Glint tint stays subtle — heavy uColorC made the stone blow out.
  trans=mix(trans,uColorC,pow(look,vec3(4.0))*0.14);
  // Thicker paths swallow more light — keeps it reading as solid glass.
  trans*=mix(vec3(0.45),vec3(1.05),look)*(0.55+0.45*ndl);

  // Reflection: studio environment on the facet planes.
  vec3 R=reflect(-V,N);
  float sky=smoothstep(-0.6,0.9,R.y);
  vec3 refl=mix(uColorA*0.5,uColorB,sky);
  refl+=uColorC*pow(max(0.0,1.0-abs(R.y-0.05)*7.0),3.0)*0.10;

  vec3 col=mix(trans,refl,F);

  // Soft speculars — keep microscopic dispersion, avoid overblown hotspots.
  float gR=pow(max(dot(normalize(N+vec3(disp*0.35,0.0,0.0)),H),0.0),hard);
  float gG=pow(max(dot(N,H),0.0),hard);
  float gB=pow(max(dot(normalize(N-vec3(disp*0.35,0.0,0.0)),H),0.0),hard);
  vec3 glint=vec3(gR,gG,gB)*mix(vec3(1.0),uColorC,0.4);
  col+=glint*0.55;

  // Facet seams: tiny internal shimmer only — never driven by Edge Glow.
  float wire=1.0-smoothstep(0.0,0.045,seam);
  float pulse=0.5+0.5*sin(t*1.7+id*21.0+uv.x*5.0+uv.y*3.0);
  col+=uColorB*wire*0.035*(0.45+0.55*pulse);

  col*=uIntensity;

  // Edge Glow = small soft halo on the mark outline only (silhouette SDF).
  float edge=logoEdgeGlow(uv,0.0055);
  float bloom=logoHalo(uv,0.007);
  float glowW=uGlow*(bloom*0.55+edge*0.35);
  vec3 edgeCol=mix(uColorB*0.9,uColorC,0.2);

  // Soft studio haze behind the stone — light drifting mist, not a fluid sim.
  vec2 screen=gl_FragCoord.xy/uResolution.xy;
  float mist=fbm3(screen*vec2(1.55,1.15)+vec2(t*0.035,-t*0.028));
  mist+=0.45*fbm3(screen*vec2(3.2,2.4)+vec2(-t*0.05,t*0.04));
  mist=smoothstep(0.22,0.78,mist)*0.28;
  float veil=pow(length(screen-0.5)*1.15,1.6)*0.12;
  vec3 hazeCol=mix(uColorA,uColorB,0.35)*0.55;
  vec3 bg=mix(uBg,hazeCol,mist+veil);

  float sil=smoothstep(0.18,0.58,mask);
  vec3 outCol=mix(bg,col,sil);
  outCol+=edgeCol*glowW;
  gl_FragColor=vec4(outCol,1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Shimmer", min: 0, max: 1.4, step: 0.02, default: 0.35 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uFacets", label: "Facet Count", min: 1, max: 10, step: 1, default: 3 },
        { key: "uRefract", label: "Refraction", min: 0, max: 1, step: 0.02, default: 0.4 },
        { key: "uDispersion", label: "Prismatic Dispersion", min: 0, max: 1, step: 0.02, default: 0.36 },
        { key: "uGlow", label: "Edge Glow", min: 0, max: 2, step: 0.05, default: 0.7 },
        { key: "uIntensity", label: "Crystal Brightness", min: 0.3, max: 2.2, step: 0.05, default: 1.15 },
        { key: "uContrast", label: "Facet Hardness", min: 0.2, max: 2, step: 0.05, default: 1.1 },
        { key: "uWarp", label: "Cursor", min: 0, max: 1, step: 0.05, default: 0.5 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#06050a" },
        { key: "uColorA", label: "Body", default: "#1a0a32" },
        { key: "uColorB", label: "Facet", default: "#7a3dff" },
        { key: "uColorC", label: "Glint", default: "#e8e0f5" },
      ]),
    ],
  },
  {
    id: "fluid-chrome",
    title: "Fluid Chrome",
    blurb: "Molten chrome inside the mark · stir with cursor",
    kind: "logo",
    interactive: true,
    needsImage: true,
    fragment: wrap(
      COMMON +
        LOGO +
        `
void main(){
  vec2 uv=logoUv();
  vec2 m=mouseUv();
  float t=uPhase;
  float bulge=uIntensity;
  float ripple=clamp(uDetail,0.0,1.5);

  // Molten flow field. Stirring is tangential, so the metal circulates under
  // the cursor instead of the whole mark sliding away from it.
  vec2 d=uv-m;
  float grip=exp(-dot(d,d)*4.8)*uHover*uWarp;
  vec2 flow=curl2(uv*1.85+vec2(t*0.11,-t*0.08));
  flow+=vec2(-d.y,d.x)*grip*5.8;
  flow+=d*grip*0.55;

  // Warp the silhouette UV itself — letter edges and interiors bend with the
  // metal, not only the reflection normals on a flat cutout.
  float warpAmp=mix(0.014,0.048,ripple)*(0.78+0.32*clamp(bulge,0.0,2.5));
  vec2 geo=vec2(fbm3(uv*1.55+flow*0.28+vec2(0.0,t*0.13)),
                fbm3(uv*1.55+flow*0.28+vec2(4.2,1.9)-vec2(0.0,t*0.11)))-0.4375;
  vec2 wuv=uv+flow*warpAmp+geo*mix(0.010,0.034,ripple);

  // Blow the flat mark up into a fat liquid body.
  float cover;
  float radius=0.010+0.028*bulge;
  float swell=0.0065*bulge;
  vec3 N=dome(wuv,radius,swell,cover);
  float depth=clamp((logoSdf(wuv)+swell)/radius,0.0,1.0);

  // Rolling surface — broad silk folds (ref. mercury pour) plus a finer chop.
  // 0.4375 is fbm3's mean, so swells don't bias the whole surface dark.
  vec2 w1=vec2(fbm3(wuv*1.7+flow*0.48+vec2(0.0,t*0.14)),
               fbm3(wuv*1.7+flow*0.48+vec2(5.7,2.3)-vec2(0.0,t*0.11)))-0.4375;
  float fs=mix(3.2,6.8,ripple);
  vec2 w2=vec2(fbm3(wuv*fs+flow*0.70+vec2(1.9,-t*0.22)),
               fbm3(wuv*fs+flow*0.70+vec2(-3.3,t*0.19)))-0.4375;
  N=normalize(N+vec3((w1*2.6+w2*1.05)*ripple*mix(0.45,1.35,depth),0.0));

  vec3 V=vec3(0.0,0.0,1.0);
  vec3 R=reflect(-V,N);
  float polish=clamp(uContrast*0.5,0.0,1.0);
  vec3 col=chromeEnv(R,polish);

  // Travelling glints keep crossing the surface on their own.
  vec3 L1=normalize(vec3(cos(t*0.55)*0.8,0.5+0.25*sin(t*0.43),0.7));
  vec3 L2=normalize(vec3(sin(t*0.37+2.1)*0.9,-0.2+0.3*cos(t*0.61),0.6));
  float hard=mix(60.0,480.0,polish);
  float sp=pow(max(dot(N,normalize(L1+V)),0.0),hard)*2.0;
  sp+=pow(max(dot(N,normalize(L2+V)),0.0),hard*0.45)*0.75;
  col+=uColorC*sp;
  float fres=pow(1.0-max(dot(N,V),0.0),2.8);
  col+=uColorB*fres*0.38;
  // Rim darkens as the tube rolls away — the chrome outline against the bg.
  col*=0.55+0.45*smoothstep(0.0,0.45,depth);
  col*=0.97+0.05*noise(uv*vec2(140.0,140.0));

  // Soft contact shadow under the mark (LIQUID CHROME reference).
  float sh=logoBlur(uv+vec2(0.0,-0.018),0.012)*0.55
          +logoBlur(uv+vec2(0.0,-0.028),0.022)*0.35
          +logoBlur(uv+vec2(0.0,-0.040),0.036)*0.18;
  sh*=(1.0-cover);
  vec3 bg=mix(uBg,uBg*0.35,clamp(sh,0.0,1.0));

  gl_FragColor=vec4(mix(bg,col,cover),1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Flow", min: 0, max: 1.4, step: 0.02, default: 0.55 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uIntensity", label: "Bulge", min: 0.2, max: 2.6, step: 0.05, default: 1.35 },
        { key: "uContrast", label: "Polish", min: 0.2, max: 2, step: 0.05, default: 1.4 },
        { key: "uDetail", label: "Ripple", min: 0, max: 1.5, step: 0.05, default: 0.75 },
        { key: "uWarp", label: "Stir", min: 0, max: 1.6, step: 0.05, default: 1.0 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#07080a" },
        { key: "uColorA", label: "Floor", default: "#15181d" },
        { key: "uColorB", label: "Sky", default: "#f0f4f8" },
        { key: "uColorC", label: "Glint", default: "#ffffff" },
      ]),
    ],
  },
  {
    id: "smokey",
    title: "Smokey",
    blurb: "Fluid smoke trapped in the silhouette · drag to stir",
    kind: "logo",
    engine: "smoke",
    interactive: true,
    needsImage: true,
    fragment: `// ATLAS · Smokey — WebSmokeCanvas driven by a logo mask (emit · confine · stir)\n`,
    params: [
      ...floats([
        { key: "uSpeed", label: "Turbulence", min: 0.2, max: 3, step: 0.05, default: 1.6 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uDensity", label: "Emit", min: 0.1, max: 1.2, step: 0.02, default: 0.5 },
        { key: "uFade", label: "Life", min: 0.05, max: 0.8, step: 0.01, default: 0.22 },
        { key: "uGravity", label: "Rise / Fall", min: 0, max: 1.2, step: 0.02, default: 0.5 },
        { key: "uSpread", label: "Brush", min: 8, max: 60, step: 1, default: 26 },
        { key: "uInertia", label: "Coast", min: 0.05, max: 0.9, step: 0.02, default: 0.82 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#07080b" },
        { key: "uColorA", label: "Fresh", default: "#7ebeea" },
        { key: "uColorB", label: "Cool", default: "#3d6fa8" },
      ]),
    ],
  },
  {
    id: "neon",
    title: "Neon",
    blurb: "Iridescent neon tube · soft bloom · flicker",
    kind: "logo",
    interactive: true,
    needsImage: true,
    fragment: wrap(
      COMMON +
        LOGO +
        `
void main(){
  vec2 uv=logoUv();
  vec2 m=mouseUv();
  float t=uPhase;

  // Rounded tube volume from silhouette SDF — bevelled shoulders, not a flat fill.
  float cover;
  float radius=mix(0.016,0.038,clamp(uContrast*0.5,0.0,1.0));
  float swell=0.0055;
  vec3 N=dome(uv,radius,swell,cover);
  float depth=clamp((logoSdf(uv)+swell)/max(radius,0.002),0.0,1.0);

  // Smooth SDF bloom (no logoBlur taps — creamy halo like the refs).
  float bloomR=mix(0.009,0.018,clamp(uDetail,0.0,1.0));
  float halo=logoHalo(uv,bloomR);
  halo=pow(clamp(halo,0.0,1.0),0.92);

  // Magenta ↔ cyan iridescence across the mark; uColorA/B/C drive the ramp.
  float sweep=uv.x*1.15-uv.y*0.85+t*0.12;
  float iri=0.5+0.5*sin((sweep+fbm3(uv*2.1+vec2(0.0,t*0.1))*0.55)*6.283185);
  vec3 neon=mix(uColorA,uColorB,smoothstep(0.08,0.92,iri));
  neon=mix(neon,uColorC,pow(iri,3.2)*0.28);

  // Gas flicker: slow sines + rare dip, never a hard strobe.
  float flick=0.92+0.06*sin(t*6.8)+0.035*sin(t*16.4);
  flick*=1.0-0.12*smoothstep(0.86,1.0,noise(vec2(t*0.85,3.7)));

  float spot=exp(-length(uv-m)*mix(3.5,1.55,uHover));
  float lit=(0.78+0.32*spot*uWarp*uHover)*flick;

  vec3 V=vec3(0.0,0.0,1.0);
  vec3 L=normalize(vec3(0.42+(m.x-0.5)*uWarp*uHover*0.7,0.55+(m.y-0.5)*0.35,0.78));
  float ndl=max(dot(N,L),0.0);
  float fres=pow(1.0-max(dot(N,V),0.0),2.7);
  float spec=pow(max(dot(N,normalize(L+V)),0.0),mix(48.0,140.0,uContrast*0.5));
  // Second glint for chrome-like hot edges.
  vec3 L2=normalize(vec3(-0.55,0.35,0.65));
  float spec2=pow(max(dot(N,normalize(L2+V)),0.0),90.0);

  // Hot filament denser toward the centre of the stroke.
  float core=pow(depth,0.55)*cover;

  vec3 glass=mix(neon*0.40,uColorC*0.55,fres);
  glass*=0.55+0.55*ndl;

  vec3 col=neon*halo*halo*1.55*uIntensity*lit;          // outer coloured bloom
  col+=glass*cover*uIntensity*1.05;                      // glass / bevel body
  col+=mix(neon,uColorC,0.62)*core*1.85*uIntensity*lit;  // hot core
  col+=uColorC*(spec*1.15+spec2*0.55)*cover;             // sharp speculars
  col+=neon*fres*cover*0.35*uIntensity;

  float a=clamp(max(halo*0.95,cover),0.0,1.0);
  gl_FragColor=vec4(mix(uBg,col,a),1.0);
}
`,
    ),
    params: [
      ...floats([
        { key: "uSpeed", label: "Pulse", min: 0, max: 1.5, step: 0.02, default: 0.2 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uIntensity", label: "Glow", min: 0.4, max: 2.4, step: 0.05, default: 1.35 },
        { key: "uContrast", label: "Bevel", min: 0.2, max: 2, step: 0.05, default: 1.15 },
        { key: "uDetail", label: "Bloom", min: 0, max: 1, step: 0.05, default: 0.62 },
        { key: "uWarp", label: "Spot", min: 0, max: 1.2, step: 0.05, default: 0.85 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#04050a" },
        { key: "uColorA", label: "Magenta", default: "#ff2d9b" },
        { key: "uColorB", label: "Cyan", default: "#2de8ff" },
        { key: "uColorC", label: "Hot", default: "#ffffff" },
      ]),
    ],
  },
);

export function getWebEffect(id: string) {
  return webEffects.find((e) => e.id === id) ?? webEffects[0];
}

export function effectKind(effect: WebEffect): WebEffectKind {
  return effect.kind ?? "bg";
}

export function effectsByKind(kind: WebEffectKind) {
  return webEffects.filter((e) => effectKind(e) === kind);
}

export function defaultValues(effect: WebEffect): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  for (const p of effect.params) {
    out[p.key] = p.default;
  }
  return out;
}

export function buildExportGlsl(effect: WebEffect) {
  // Sim-driven effects carry their own one-line doc instead of a fragment.
  if (effect.engine === "smoke" || effect.engine === "particles") {
    return effect.fragment;
  }
  return `// ATLAS · ${effect.title}\n${effect.fragment}`;
}

export function buildExportReact(effect: WebEffect) {
  return `// ATLAS · ${effect.title}\n// See WebEffectCanvas / WebSmokeCanvas in the portfolio repo.\n`;
}
