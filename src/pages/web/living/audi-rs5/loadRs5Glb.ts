import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { publicUrl } from "../../../../lib/publicUrl";
import {
  CALIPERS,
  DEFAULT_MATERIAL_TUNE,
  INTERIORS,
  PAINTS,
  WHEELS,
  type CaliperId,
  type InteriorId,
  type MaterialTune,
  type PaintId,
  type WheelId,
} from "./audiRs5Data";

export const RS5_GLB = publicUrl("portfolio/audi-rs5/rs5.glb");
/** Packshot IBL: dim Kloppenheim (`studio.hdr`) — warm softboxes, no outdoor cues. */
export const RS5_HDRI = publicUrl("portfolio/audi-rs5/studio.hdr");
export const RS5_ASPHALT = {
  diff: publicUrl("portfolio/audi-rs5/asphalt_diff.jpg"),
  nor: publicUrl("portfolio/audi-rs5/asphalt_nor.jpg"),
  rough: publicUrl("portfolio/audi-rs5/asphalt_rough.jpg"),
};

export type Rs5Handle = {
  root: THREE.Group;
  car: THREE.Object3D;
  wheels: THREE.Object3D[];
  setPaint: (id: PaintId) => void;
  setCaliper: (id: CaliperId) => void;
  setInterior: (id: InteriorId) => void;
  setWheel: (id: WheelId) => void;
  setSportExhaust: (on: boolean) => void;
  setCabinMode: (active: boolean) => void;
  setEnvIntensity: (intensity: number) => void;
  applyMaterialTune: (tune: MaterialTune) => void;
  dispose: () => void;
};

type MatBucket = {
  paint: THREE.MeshPhysicalMaterial[];
  caliper: THREE.MeshStandardMaterial[];
  wheel: THREE.MeshStandardMaterial[];
  interior: THREE.MeshStandardMaterial[];
  stitch: THREE.MeshStandardMaterial[];
  exhaustChrome: THREE.MeshStandardMaterial[];
  exhaustBody: THREE.MeshStandardMaterial[];
  glassBody: THREE.MeshPhysicalMaterial[];
  glassLens: THREE.MeshPhysicalMaterial[];
  glassTail: THREE.MeshPhysicalMaterial[];
  chrome: THREE.MeshStandardMaterial[];
  rubber: THREE.MeshStandardMaterial[];
  bumper: THREE.MeshStandardMaterial[];
  silver: THREE.MeshStandardMaterial[];
};

type BodyPbrMaps = {
  flakeNormal: THREE.CanvasTexture;
  clearcoatNormal: THREE.CanvasTexture;
  clearcoatRough: THREE.CanvasTexture;
  brushedNormal: THREE.CanvasTexture;
  brushedRough: THREE.CanvasTexture;
  rubberNormal: THREE.CanvasTexture;
  rubberRough: THREE.CanvasTexture;
  plasticNormal: THREE.CanvasTexture;
  plasticRough: THREE.CanvasTexture;
  carbonColor: THREE.CanvasTexture;
  carbonNormal: THREE.CanvasTexture;
  carbonRough: THREE.CanvasTexture;
  leatherNormal: THREE.CanvasTexture;
  leatherRough: THREE.CanvasTexture;
  dispose: () => void;
};

function asStd(m: THREE.Material | THREE.Material[]): THREE.MeshStandardMaterial[] {
  const list = Array.isArray(m) ? m : [m];
  return list.filter((x): x is THREE.MeshStandardMaterial => {
    return !!x && "color" in x && x.color instanceof THREE.Color;
  });
}

function asPhys(m: THREE.Material | THREE.Material[]): THREE.MeshPhysicalMaterial[] {
  return asStd(m).filter((x): x is THREE.MeshPhysicalMaterial => x instanceof THREE.MeshPhysicalMaterial);
}

function configureMap(
  tex: THREE.Texture,
  opts: { color?: boolean; repeat?: number; anisotropy?: number } = {},
) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const r = opts.repeat ?? 1;
  tex.repeat.set(r, r);
  tex.anisotropy = opts.anisotropy ?? 8;
  tex.colorSpace = opts.color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function canvasTex(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  opts: { color?: boolean; repeat?: number } = {},
) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  return configureMap(tex, opts);
}

/** 2K procedural PBR maps for body materials (no external packs required). */
function createBodyPbrMaps(size = 2048): BodyPbrMaps {
  // Micro metallic grain — dense tile, low amplitude (not chunky FlakesTexture)
  const flakeNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    const img = ctx.getImageData(0, 0, s, s);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      // ±3 around 128 → barely-there microflake
      const nx = 128 + ((Math.random() * 6) | 0) - 3;
      const ny = 128 + ((Math.random() * 6) | 0) - 3;
      d[i] = nx;
      d[i + 1] = ny;
      d[i + 2] = 255;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 72 });

  // Clearcoat orange-peel + micro-scratches (archviz lacquer)
  const clearcoatNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    // Orange peel low-frequency bumps
    for (let i = 0; i < 2800; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 6 + Math.random() * 18;
      const nx = Math.round(127 + (Math.random() - 0.5) * 18);
      const ny = Math.round(127 + (Math.random() - 0.5) * 18);
      ctx.fillStyle = `rgba(${nx},${ny},255,0.22)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 7000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const len = 4 + Math.random() * 26;
      const ang = Math.random() * Math.PI;
      const nx = Math.cos(ang);
      const ny = Math.sin(ang);
      const dx = Math.round(127 + nx * 26);
      const dy = Math.round(127 + ny * 26);
      ctx.strokeStyle = `rgb(${dx},${dy},255)`;
      ctx.globalAlpha = 0.07 + Math.random() * 0.1;
      ctx.lineWidth = 0.55 + Math.random();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + nx * len, y + ny * len);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, { repeat: 5 });

  const clearcoatRough = canvasTex(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = 28 + Math.random() * 42;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = n;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 3 });

  // Brushed metal normal + roughness
  const brushedNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y++) {
      const wobble = Math.sin(y * 0.35) * 0.4 + (Math.random() - 0.5) * 0.8;
      const g = Math.round(128 + wobble * 40);
      ctx.fillStyle = `rgb(${g},128,255)`;
      ctx.fillRect(0, y, s, 1);
    }
  }, { repeat: 8 });

  const brushedRough = canvasTex(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      const base = 70 + Math.sin(y * 0.2) * 8 + Math.random() * 18;
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const v = Math.max(40, Math.min(140, base + (Math.random() - 0.5) * 10));
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 6 });

  // Rubber / tire-like
  const rubberNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 12000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 1 + Math.random() * 3;
      const nx = Math.round(127 + (Math.random() - 0.5) * 50);
      const ny = Math.round(127 + (Math.random() - 0.5) * 50);
      ctx.fillStyle = `rgb(${nx},${ny},255)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, { repeat: 10 });

  const rubberRough = canvasTex(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      // Near-white → high roughness (matte tire)
      const v = 220 + Math.random() * 30;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 8 });

  // Hard black plastic
  const plasticNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const nx = Math.round(127 + (Math.random() - 0.5) * 24);
      const ny = Math.round(127 + (Math.random() - 0.5) * 24);
      ctx.fillStyle = `rgba(${nx},${ny},255,0.5)`;
      ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
  }, { repeat: 5 });

  const plasticRough = canvasTex(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 130 + Math.random() * 40;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 4 });

  // Carbon weave (2K)
  const carbonColor = canvasTex(
    size,
    (ctx, s) => {
      const cell = 32;
      for (let y = 0; y < s; y += cell) {
        for (let x = 0; x < s; x += cell) {
          const odd = ((x / cell) + (y / cell)) % 2 === 0;
          const g = odd ? 28 : 42;
          ctx.fillStyle = `rgb(${g},${g},${g + 2})`;
          ctx.fillRect(x, y, cell, cell);
          ctx.strokeStyle = "rgba(10,10,12,0.45)";
          ctx.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
        }
      }
    },
    { color: true, repeat: 14 },
  );

  const carbonNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    const cell = 32;
    for (let y = 0; y < s; y += cell) {
      for (let x = 0; x < s; x += cell) {
        const odd = ((x / cell) + (y / cell)) % 2 === 0;
        ctx.fillStyle = odd ? "rgb(148,118,255)" : "rgb(118,148,255)";
        ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      }
    }
  }, { repeat: 14 });

  const carbonRough = canvasTex(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 95 + Math.random() * 35;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 14 });

  // Soft-touch leather / Nappa grain
  const leatherNormal = canvasTex(size, (ctx, s) => {
    ctx.fillStyle = "rgb(128,128,255)";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 42000; i++) {
      const x = Math.random() * s;
      const y = Math.random() * s;
      const r = 0.6 + Math.random() * 1.8;
      const nx = Math.round(127 + (Math.random() - 0.5) * 22);
      const ny = Math.round(127 + (Math.random() - 0.5) * 22);
      ctx.fillStyle = `rgba(${nx},${ny},255,0.55)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, { repeat: 8 });

  const leatherRough = canvasTex(size, (ctx, s) => {
    const img = ctx.createImageData(s, s);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 155 + Math.random() * 45;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, { repeat: 6 });

  const all = [
    flakeNormal,
    clearcoatNormal,
    clearcoatRough,
    brushedNormal,
    brushedRough,
    rubberNormal,
    rubberRough,
    plasticNormal,
    plasticRough,
    carbonColor,
    carbonNormal,
    carbonRough,
    leatherNormal,
    leatherRough,
  ];

  return {
    flakeNormal,
    clearcoatNormal,
    clearcoatRough,
    brushedNormal,
    brushedRough,
    rubberNormal,
    rubberRough,
    plasticNormal,
    plasticRough,
    carbonColor,
    carbonNormal,
    carbonRough,
    leatherNormal,
    leatherRough,
    dispose: () => {
      for (const t of all) t.dispose();
    },
  };
}

function toPhysical(mat: THREE.MeshStandardMaterial): THREE.MeshPhysicalMaterial {
  if (mat instanceof THREE.MeshPhysicalMaterial) return mat;
  const phys = new THREE.MeshPhysicalMaterial();
  phys.copy(mat);
  phys.name = mat.name;
  return phys;
}

function applyGlassPbr(
  mat: THREE.MeshStandardMaterial,
  env: THREE.Texture | null,
  kind: "body" | "lens" | "tail" = "body",
): THREE.MeshPhysicalMaterial {
  const phys = toPhysical(mat);
  // Drop baked albedo — light maps + alpha read as milky plastic, not glass.
  phys.map = null;
  phys.alphaMap = null;
  phys.metalnessMap = null;
  phys.roughnessMap = null;
  phys.normalMap = null;
  phys.emissiveMap = null;
  phys.emissive.set(0x000000);
  phys.emissiveIntensity = 0;

  // Packshot glass: dark tint + real alpha so cabin/void shows through.
  if (kind === "tail") {
    phys.color.set(0x2c0a0e);
  } else if (kind === "lens") {
    phys.color.set(0x12161a);
  } else {
    phys.color.set(0x101816);
  }

  phys.metalness = 0;
  phys.roughness = 0.22;
  phys.transmission = 0;
  phys.thickness = 0;
  phys.attenuationDistance = Infinity;
  phys.ior = 1.45;
  phys.clearcoat = 0.15;
  phys.clearcoatRoughness = 0.35;
  phys.transparent = true;
  phys.opacity = kind === "lens" ? 0.14 : kind === "tail" ? 0.38 : 0.26;
  phys.depthWrite = false;
  phys.side = THREE.FrontSide;
  phys.specularIntensity = 0.22;
  phys.envMapIntensity = kind === "body" ? 0.35 : 0.45;
  if (env) phys.envMap = env;
  phys.needsUpdate = true;
  return phys;
}

function applyPaintPbr(mat: THREE.MeshPhysicalMaterial, _maps: BodyPbrMaps) {
  // Lacquer that holds body color at grazing angles
  mat.clearcoat = 1;
  mat.clearcoatRoughness = 0.07;
  mat.clearcoatNormalMap = null;
  mat.clearcoatRoughnessMap = null;
  mat.normalMap = null;
  mat.normalScale = new THREE.Vector2(1, 1);
  mat.ior = 1.5;
  mat.specularIntensity = 0.45;
  if (mat.aoMap) mat.aoMapIntensity = 1.35;
  mat.needsUpdate = true;
}

function applyChromePbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  // Exhaust tips / bright metal only — window & face trim use black optic
  mat.color.set(0xc8c4bc);
  mat.metalness = 1;
  mat.roughness = 0.18;
  mat.map = null;
  mat.aoMap = null;
  mat.aoMapIntensity = 0;
  mat.metalnessMap = null;
  mat.roughnessMap = null;
  mat.emissive?.set(0x000000);
  mat.emissiveIntensity = 0;
  mat.normalMap = maps.brushedNormal;
  mat.normalScale = new THREE.Vector2(0.16, 0.08);
  mat.envMapIntensity = 1.35;
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.clearcoat = 0.2;
    mat.clearcoatRoughness = 0.12;
    mat.specularIntensity = 1;
  }
  if (env) mat.envMap = env;
  mat.needsUpdate = true;
  return mat;
}

/** Window frames, rear diffuser bar, front face trim — gloss black optic. */
function applyBlackTrimPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  mat.color.set(0x0c0c0c);
  mat.metalness = 0.92;
  mat.roughness = 0.28;
  mat.map = null;
  mat.aoMap = null;
  mat.aoMapIntensity = 0;
  mat.metalnessMap = null;
  mat.roughnessMap = null;
  mat.emissive?.set(0x000000);
  mat.emissiveIntensity = 0;
  mat.normalMap = maps.brushedNormal;
  mat.normalScale = new THREE.Vector2(0.12, 0.06);
  mat.envMapIntensity = 0.85;
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.clearcoat = 0.85;
    mat.clearcoatRoughness = 0.08;
    mat.clearcoatNormalMap = maps.clearcoatNormal;
    mat.clearcoatNormalScale = new THREE.Vector2(0.08, 0.08);
    mat.specularIntensity = 0.7;
  }
  if (env) mat.envMap = env;
  mat.needsUpdate = true;
  return mat;
}

function applySilverPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  return applyBlackTrimPbr(mat, maps, env);
}

function applyAlloyPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  // Soft satin alloy — matte enough to tame spoke aliasing
  mat.metalness = Math.max(mat.metalness, 0.9);
  mat.roughness = 0.4;
  mat.map = null;
  mat.aoMap = null;
  mat.metalnessMap = null;
  mat.normalMap = maps.brushedNormal;
  mat.normalScale = new THREE.Vector2(0.12, 0.06);
  mat.roughnessMap = maps.brushedRough;
  mat.envMapIntensity = 0.85;
  if (env) mat.envMap = env;
  mat.needsUpdate = true;
}

function applyRubberPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  // Keep baked tire / matte albedo when present; force dead-matte rubber
  if (mat.map) mat.color.set(0xffffff);
  else mat.color.set(0x0e0e0e);
  mat.metalness = 0;
  mat.metalnessMap = null;
  mat.roughness = 0.9;
  mat.normalMap = maps.rubberNormal;
  mat.normalScale = new THREE.Vector2(0.14, 0.14);
  mat.roughnessMap = maps.rubberRough;
  mat.envMapIntensity = 0.06;
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.clearcoat = 0;
    mat.transmission = 0;
    mat.specularIntensity = 0.25;
  }
  if (env) mat.envMap = env;
  mat.needsUpdate = true;
}

function applyPlasticPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  mat.color.set(0x1a1a1a);
  mat.metalness = 0.04;
  mat.roughness = 0.58;
  if (!mat.normalMap) {
    mat.normalMap = maps.plasticNormal;
    mat.normalScale = new THREE.Vector2(0.22, 0.22);
  }
  if (!mat.roughnessMap) mat.roughnessMap = maps.plasticRough;
  mat.envMapIntensity = 0.55;
  if (mat instanceof THREE.MeshPhysicalMaterial) {
    mat.clearcoat = 0;
    mat.transmission = 0;
    mat.opacity = 1;
    mat.transparent = false;
  }
  if (env) mat.envMap = env;
  mat.needsUpdate = true;
}

function applyPianoPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null): THREE.MeshPhysicalMaterial {
  const phys = toPhysical(mat);
  phys.color.set(0x0a0a0a);
  phys.metalness = 0.08;
  phys.roughness = 0.28;
  phys.clearcoat = 1;
  phys.clearcoatRoughness = 0.05;
  phys.clearcoatNormalMap = maps.clearcoatNormal;
  phys.clearcoatNormalScale = new THREE.Vector2(0.1, 0.1);
  phys.clearcoatRoughnessMap = maps.clearcoatRough;
  phys.envMapIntensity = 1.05;
  if (env) phys.envMap = env;
  phys.needsUpdate = true;
  return phys;
}

function applyCarbonPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null): THREE.MeshPhysicalMaterial {
  const phys = toPhysical(mat);
  // Prefer baked carbon maps from the GLB
  if (!phys.map) phys.map = maps.carbonColor;
  if (!phys.normalMap) {
    phys.normalMap = maps.carbonNormal;
    phys.normalScale = new THREE.Vector2(0.55, 0.55);
  } else {
    phys.normalScale = new THREE.Vector2(0.7, 0.7);
  }
  if (!phys.roughnessMap) phys.roughnessMap = maps.carbonRough;
  phys.metalness = 0.28;
  phys.roughness = 0.35;
  phys.clearcoat = 0.7;
  phys.clearcoatRoughness = 0.1;
  phys.envMapIntensity = 0.9;
  if (env) phys.envMap = env;
  phys.needsUpdate = true;
  return phys;
}

function applyLeatherPbr(mat: THREE.MeshStandardMaterial, maps: BodyPbrMaps, env: THREE.Texture | null) {
  mat.metalness = 0.06;
  mat.roughness = 0.78;
  if (!mat.normalMap) {
    mat.normalMap = maps.leatherNormal;
    mat.normalScale = new THREE.Vector2(0.35, 0.35);
  }
  if (!mat.roughnessMap) mat.roughnessMap = maps.leatherRough;
  mat.envMapIntensity = 0.48;
  if (env) mat.envMap = env;
  mat.needsUpdate = true;
}

/** Full exterior material pass — every body-related slot gets PBR maps. */
function hardenSurfaces(root: THREE.Object3D, env: THREE.Texture | null, maps: BodyPbrMaps) {
  const remap = new Map<THREE.Material, THREE.Material>();

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const list = Array.isArray(obj.material) ? obj.material : [obj.material];
    const next = list.map((m) => {
      if (!(m instanceof THREE.MeshStandardMaterial)) return m;
      const cached = remap.get(m);
      if (cached) return cached;

      const n = (m.name || "").toLowerCase();
      let out: THREE.Material = m;

      if (n.includes("car_paint") || n.includes("car paint")) {
        const phys = toPhysical(m);
        applyPaintPbr(phys, maps);
        if (env) phys.envMap = env;
        out = phys;
      } else if (n.includes("windshiled") || n.includes("windshield") || n.includes("roof_black")) {
        out = applyGlassPbr(m, env, "body");
      } else if (n.includes("hl_cover")) {
        out = applyGlassPbr(m, env, "lens");
      } else if (n.includes("tail_cover")) {
        out = applyGlassPbr(m, env, "tail");
      } else if (n.includes("chrome") || n.includes("mirror") || n.includes("in_shine") || n.includes("inchrome")) {
        applyBlackTrimPbr(m, maps, env);
      } else if (n.includes("alloy")) {
        applyAlloyPbr(m, maps, env);
      } else if (n.includes("silver")) {
        applyBlackTrimPbr(m, maps, env);
      } else if (n.includes("pianoblack")) {
        out = applyPianoPbr(m, maps, env);
      } else if (n.includes("carbon")) {
        out = applyCarbonPbr(m, maps, env);
      } else if (
        n.includes("matte_black") ||
        n.includes("matal_black") ||
        n.includes("rs5_texture")
      ) {
        applyRubberPbr(m, maps, env);
      } else if (n.includes("black_palastic") || n.includes("tail_plastic")) {
        applyPlasticPbr(m, maps, env);
      } else if (n.includes("caliper") || n.includes("break_rear") || n.includes("brake")) {
        m.metalness = 0.55;
        m.roughness = 0.35;
        if (!m.normalMap) {
          m.normalMap = maps.plasticNormal;
          m.normalScale = new THREE.Vector2(0.12, 0.12);
        }
        matSafeEnv(m, env, 1.05);
      } else if (n.includes("int1") || n.includes(":til") || n.includes("_til") || n.endsWith("til_0") || n.includes("til_")) {
        applyLeatherPbr(m, maps, env);
      } else if (n.includes("led") || n.includes("halogen") || n.includes("hl_texture") || n.includes("tail")) {
        m.metalness = Math.min(m.metalness, 0.4);
        m.roughness = Math.max(m.roughness, 0.25);
        matSafeEnv(m, env, 0.9);
      } else {
        matSafeEnv(m, env, 1.0);
      }

      remap.set(m, out);
      return out;
    });
    obj.material = Array.isArray(obj.material) ? (next as THREE.Material[]) : next[0];

    const glass = next.some((m) => {
      const n = (m.name || "").toLowerCase();
      return (
        n.includes("windshiled") ||
        n.includes("windshield") ||
        n.includes("roof_black") ||
        n.includes("hl_cover") ||
        n.includes("tail_cover")
      );
    });
    if (glass) {
      obj.castShadow = false;
      obj.renderOrder = 3;
    } else {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
}

function matSafeEnv(m: THREE.MeshStandardMaterial, env: THREE.Texture | null, intensity: number) {
  if (env) m.envMap = env;
  m.envMapIntensity = intensity;
  m.needsUpdate = true;
}

function collectMats(root: THREE.Object3D): MatBucket {
  const bucket: MatBucket = {
    paint: [],
    caliper: [],
    wheel: [],
    interior: [],
    stitch: [],
    exhaustChrome: [],
    exhaustBody: [],
    glassBody: [],
    glassLens: [],
    glassTail: [],
    chrome: [],
    rubber: [],
    bumper: [],
    silver: [],
  };
  const seen = new Set<THREE.Material>();

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    for (const mat of asStd(obj.material)) {
      if (seen.has(mat)) continue;
      seen.add(mat);
      const n = (mat.name || "").toLowerCase();
      if (n.includes("car_paint") || n.includes("car paint")) {
        if (mat instanceof THREE.MeshPhysicalMaterial) bucket.paint.push(mat);
      } else if (n.includes("caliper")) bucket.caliper.push(mat);
      else if (n.includes("alloy")) bucket.wheel.push(mat);
      else if (n === "rs5red" || n === "rs5:red" || n.endsWith("red__") || n.includes("rs5red"))
        bucket.stitch.push(mat);
      else if (n.includes("int1") || n === "rs5int1" || n.includes(":int1")) bucket.interior.push(mat);
      else if (n.includes("exhaust_chrome") || n.includes("exhaust chrome"))
        bucket.exhaustChrome.push(mat);
      else if (n.includes("exhaust") && !n.includes("chrome")) bucket.exhaustBody.push(mat);
      else if (n.includes("windshiled") || n.includes("windshield") || n.includes("roof_black")) {
        if (mat instanceof THREE.MeshPhysicalMaterial) bucket.glassBody.push(mat);
      } else if (n.includes("hl_cover")) {
        if (mat instanceof THREE.MeshPhysicalMaterial) bucket.glassLens.push(mat);
      } else if (n.includes("tail_cover")) {
        if (mat instanceof THREE.MeshPhysicalMaterial) bucket.glassTail.push(mat);
      } else if (n.includes("chrome") || n.includes("mirror") || n.includes("in_shine") || n.includes("inchrome")) {
        bucket.chrome.push(mat);
      } else if (
        n.includes("matte_black") ||
        n.includes("matal_black") ||
        n.includes("rs5_texture")
      ) {
        bucket.rubber.push(mat);
      } else if (n.includes("black_palastic") || n.includes("tail_plastic")) {
        bucket.bumper.push(mat);
      } else if (n.includes("silver")) {
        bucket.silver.push(mat);
      }
    }
  });

  return bucket;
}

function collectWheels(root: THREE.Object3D): THREE.Object3D[] {
  const wheels: THREE.Object3D[] = [];
  const seen = new Set<string>();
  root.traverse((obj) => {
    const n = (obj.name || "").toLowerCase();
    if (!n.includes("wheel") && !n.includes("rim") && !n.includes("alloy")) return;
    if (seen.has(obj.uuid)) return;
    if (obj instanceof THREE.Mesh && (n.includes("wheel") || n.includes("rim"))) {
      wheels.push(obj);
      seen.add(obj.uuid);
    }
  });
  return wheels;
}

function tint(
  mats: THREE.MeshStandardMaterial[],
  hex: string,
  opts: { metalness?: number; roughness?: number; emissive?: string; emissiveIntensity?: number } = {},
) {
  const c = new THREE.Color(hex);
  for (const m of mats) {
    m.color.copy(c);
    if (opts.metalness != null) m.metalness = opts.metalness;
    if (opts.roughness != null) m.roughness = opts.roughness;
    if (opts.emissive && m.emissive) {
      m.emissive.set(opts.emissive);
      m.emissiveIntensity = opts.emissiveIntensity ?? 0.15;
    }
    m.needsUpdate = true;
  }
}

function applyEnv(
  root: THREE.Object3D,
  env: THREE.Texture | null,
  intensity = 1.2,
  opts: { skipPaint?: boolean } = {},
) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    for (const m of asStd(obj.material)) {
      const n = (m.name || "").toLowerCase();
      if (opts.skipPaint && (n.includes("car_paint") || n.includes("car paint"))) continue;
      m.envMap = env;
      if (n.includes("matte_black") || n.includes("matal_black") || n.includes("rs5_texture")) {
        m.envMapIntensity = 0.06;
      } else if (
        n.includes("windshiled") ||
        n.includes("windshield") ||
        n.includes("roof_black") ||
        n.includes("hl_cover") ||
        n.includes("tail_cover")
      ) {
        m.envMapIntensity = n.includes("tail_cover") || n.includes("hl_cover") ? 0.45 : 0.4;
      } else if (n.includes("black_palastic") || n.includes("tail_plastic")) {
        m.envMapIntensity = intensity * 0.4;
      } else if (n.includes("int1") || n.includes("til")) {
        m.envMapIntensity = intensity * 0.35;
      } else {
        m.envMapIntensity = intensity;
      }
      m.needsUpdate = true;
    }
  });
}

/** Load RS5 GLB, normalize length ~5.2 units, base on y=0. */
export function loadRs5Glb(
  url: string,
  opts: { envMap?: THREE.Texture | null; targetLength?: number } = {},
): Promise<Rs5Handle> {
  const targetLength = opts.targetLength ?? 5.2;
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const root = new THREE.Group();
        root.name = "rs5Root";
        const car = new THREE.Group();
        car.name = "rs5Car";
        car.add(model);
        model.position.sub(center);
        root.add(car);

        const scale = targetLength / Math.max(size.x, size.z, 0.001);
        root.scale.setScalar(scale);
        root.updateMatrixWorld(true);

        const box2 = new THREE.Box3().setFromObject(root);
        root.position.y -= box2.min.y;

        const maps = createBodyPbrMaps(2048);
        if (opts.envMap) applyEnv(root, opts.envMap, 0.85);
        hardenSurfaces(root, opts.envMap ?? null, maps);

        // Sharpen baked GLB maps for close camera work
        root.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          for (const m of asStd(obj.material)) {
            for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap"] as const) {
              const tex = m[key];
              if (!tex) continue;
              tex.anisotropy = Math.max(tex.anisotropy, 8);
              tex.needsUpdate = true;
            }
          }
        });

        const mats = collectMats(root);
        const wheels = collectWheels(root);
        const modelMeshes: THREE.Mesh[] = [];
        root.traverse((obj) => {
          if (obj instanceof THREE.Mesh) modelMeshes.push(obj);
        });

        // Re-collect paint after Physical upgrade
        mats.paint = [];
        const paintSeen = new Set<THREE.Material>();
        root.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          for (const mat of asPhys(obj.material)) {
            const n = (mat.name || "").toLowerCase();
            if (!n.includes("car_paint") && !n.includes("car paint")) continue;
            if (paintSeen.has(mat)) continue;
            paintSeen.add(mat);
            mats.paint.push(mat);
          }
        });

        let paintId: PaintId = "nardo";
        let wheelId: WheelId = "silver";
        let tune: MaterialTune = { ...DEFAULT_MATERIAL_TUNE };

        const setPaint = (id: PaintId) => {
          paintId = id;
          const p = PAINTS.find((x) => x.id === id) ?? PAINTS[0];
          tint(mats.paint, p.hex, { metalness: p.metalness, roughness: p.roughness });
          for (const m of mats.paint) {
            m.envMapIntensity = p.envIntensity * tune.paintEnvMul;
            applyPaintPbr(m, maps);
            m.clearcoat = tune.paintClearcoat;
            m.clearcoatRoughness = Math.max(tune.paintClearcoatRoughness, p.clearcoatRoughness);
            m.specularIntensity = p.kind === "solid" ? tune.paintSpecularSolid : tune.paintSpecularMetallic;
            if (p.kind === "solid") m.specularColor?.set(0xffffff);
            m.needsUpdate = true;
          }
        };

        const applyChromeTune = () => {
          for (const m of [...mats.chrome, ...mats.silver]) {
            applyBlackTrimPbr(m, maps, opts.envMap ?? null);
            m.needsUpdate = true;
          }
        };

        const applyRubberTune = () => {
          for (const m of mats.rubber) {
            m.roughness = tune.rubberRoughness;
            m.envMapIntensity = tune.rubberEnv;
            if (m instanceof THREE.MeshPhysicalMaterial) {
              m.specularIntensity = tune.rubberSpecular;
            }
            m.needsUpdate = true;
          }
        };

        const applyWheelTune = () => {
          for (const m of mats.wheel) {
            m.metalness = tune.wheelMetalness;
            m.roughness = tune.wheelRoughness;
            m.envMapIntensity = tune.wheelEnv;
            m.needsUpdate = true;
          }
        };

        const applyBumperTune = () => {
          for (const m of mats.bumper) {
            applyPlasticPbr(m, maps, opts.envMap ?? null);
            m.metalness = tune.bumperMetalness;
            m.roughness = tune.bumperRoughness;
            m.envMapIntensity = tune.bumperEnv;
            m.needsUpdate = true;
          }
        };

        const applyMaterialTune = (next: MaterialTune) => {
          tune = next;
          setPaint(paintId);
          setWheel(wheelId);
          applyChromeTune();
          applyRubberTune();
          applyBumperTune();
        };

        const setCaliper = (id: CaliperId) => {
          const c = CALIPERS.find((x) => x.id === id) ?? CALIPERS[0];
          tint(mats.caliper, c.hex, { metalness: 0.55, roughness: 0.32 });
          for (const m of mats.caliper) {
            m.normalMap = maps.plasticNormal;
            m.normalScale = new THREE.Vector2(0.1, 0.1);
            m.envMapIntensity = 1.05;
            m.needsUpdate = true;
          }
        };
        const setInterior = (id: InteriorId) => {
          const i = INTERIORS.find((x) => x.id === id) ?? INTERIORS[0];
          tint(mats.interior, i.hex, { metalness: 0.06, roughness: 0.78 });
          tint(mats.stitch, i.stitch, { metalness: 0.15, roughness: 0.5 });
          for (const m of mats.interior) {
            applyLeatherPbr(m, maps, opts.envMap ?? null);
            m.color.set(i.hex);
            m.needsUpdate = true;
          }
        };
        const setWheel = (id: WheelId) => {
          wheelId = id;
          const w = WHEELS.find((x) => x.id === id) ?? WHEELS[0];
          const rough = id === "bronze" ? Math.max(0.42, tune.wheelRoughness) : tune.wheelRoughness;
          tint(mats.wheel, w.hex, { metalness: tune.wheelMetalness, roughness: rough });
          for (const m of mats.wheel) {
            applyAlloyPbr(m, maps, opts.envMap ?? null);
            m.color.set(w.hex);
            m.metalness = tune.wheelMetalness;
            m.roughness = rough;
            m.envMapIntensity = tune.wheelEnv;
            m.needsUpdate = true;
          }
        };
        const setSportExhaust = (on: boolean) => {
          tint(mats.exhaustChrome, on ? "#1A1A1A" : "#C8C4BC", {
            metalness: on ? 0.85 : 1,
            roughness: on ? 0.35 : 0.14,
          });
          for (const m of mats.exhaustChrome) {
            if (!on) applyChromePbr(m, maps, opts.envMap ?? null);
            else {
              m.normalMap = maps.brushedNormal;
              m.roughnessMap = maps.brushedRough;
              m.needsUpdate = true;
            }
          }
          tint(mats.exhaustBody, on ? "#111111" : "#2A2A2A", {
            metalness: 0.35,
            roughness: 0.55,
          });
          if (!on) applyChromeTune();
        };
        const setCabinMode = (_active: boolean) => {
          for (const mesh of modelMeshes) mesh.visible = true;
        };
        const setEnvIntensity = (intensity: number) => {
          applyEnv(root, opts.envMap ?? null, intensity, { skipPaint: true });
          applyChromeTune();
          applyRubberTune();
          applyWheelTune();
          applyBumperTune();
        };

        setPaint("nardo");
        setCaliper("red");
        setInterior("black");
        setWheel("bronze");
        setSportExhaust(false);
        applyMaterialTune(DEFAULT_MATERIAL_TUNE);

        const dispose = () => {
          maps.dispose();
          root.traverse((obj) => {
            if (!(obj instanceof THREE.Mesh)) return;
            obj.geometry?.dispose?.();
            const list = Array.isArray(obj.material) ? obj.material : [obj.material];
            for (const m of list) m?.dispose?.();
          });
        };

        resolve({
          root,
          car,
          wheels,
          setPaint,
          setCaliper,
          setInterior,
          setWheel,
          setSportExhaust,
          setCabinMode,
          setEnvIntensity,
          applyMaterialTune,
          dispose,
        });
      },
      undefined,
      reject,
    );
  });
}

export type StudioEnv = {
  envMap: THREE.Texture;
  background: THREE.Color;
  pmrem: THREE.PMREMGenerator;
};

export async function createStudioEnv(renderer: THREE.WebGLRenderer): Promise<StudioEnv> {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const solidBg = new THREE.Color(0x101010);

  try {
    const hdr = await new HDRLoader().loadAsync(RS5_HDRI);
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmrem.fromEquirectangular(hdr).texture;
    hdr.dispose();
    return { envMap, background: solidBg, pmrem };
  } catch (err) {
    console.warn("RS5 HDRI failed, falling back to neutral PMREM", err);
    const room = new THREE.Scene();
    room.background = new THREE.Color(0x1a1a1a);
    const lightGeo = new THREE.PlaneGeometry(4, 3);
    const addPanel = (hex: number, intensity: number, pos: [number, number, number], rotY = 0) => {
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(intensity) });
      const mesh = new THREE.Mesh(lightGeo, mat);
      mesh.position.set(...pos);
      mesh.rotation.y = rotY;
      room.add(mesh);
    };
    addPanel(0xffffff, 2.2, [0, 3.2, 4]);
    addPanel(0xb8c8d0, 1.1, [-4, 2.4, 0], Math.PI / 2);
    addPanel(0xd7b98f, 0.9, [4, 2.2, -1], -Math.PI / 2);
    const envMap = pmrem.fromScene(room, 0.04).texture;
    room.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
    return { envMap, background: solidBg, pmrem };
  }
}
