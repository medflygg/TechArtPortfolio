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

export type WebEffect = {
  id: string;
  title: string;
  blurb: string;
  fragment: string;
  params: WebEffectParam[];
  engine?: "fragment" | "smoke";
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
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uScale;
uniform float uIntensity;
uniform float uContrast;
uniform float uDetail;
uniform float uWarp;
uniform float uCenterX;
uniform float uCenterY;
uniform float uRings;
uniform sampler2D uImage;
uniform float uHasImage;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uBg;

`;

function wrap(body: string) {
  return HEADER + body;
}

const COMMON = `
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

const floats = (
  items: Omit<WebFloatParam, "type">[],
): WebFloatParam[] => items.map((p) => ({ ...p, type: "float" as const }));

const colors = (
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
  float t=uTime*uSpeed*0.22;
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
  float t=uTime*uSpeed*0.18;
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
  float t=uTime*uSpeed*0.45;
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
  float t=uTime*uSpeed*0.4;
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
  float pulse=0.72+0.28*sin(uTime*uSpeed*2.4);
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
  float pulse=0.94+0.06*sin(uTime*uSpeed*4.0+gv.x*0.2);
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
  float shimmer=0.92+0.08*sin(uTime*uSpeed*6.0+cell.x*0.3);
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
  float t=uTime*uSpeed*0.2;
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
  float t=uTime*uSpeed*0.35;
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

export function getWebEffect(id: string) {
  return webEffects.find((e) => e.id === id) ?? webEffects[0];
}

export function defaultValues(effect: WebEffect): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  for (const p of effect.params) {
    out[p.key] = p.default;
  }
  return out;
}

export function buildExportGlsl(effect: WebEffect) {
  if (effect.engine === "smoke") {
    return `// ATLAS · ${effect.title} — WebSmokeCanvas (lagged trail · expand/fade)\n`;
  }
  return `// ATLAS · ${effect.title}\n${effect.fragment}`;
}

export function buildExportReact(effect: WebEffect) {
  return `// ATLAS · ${effect.title}\n// See WebEffectCanvas / WebSmokeCanvas in the portfolio repo.\n`;
}
