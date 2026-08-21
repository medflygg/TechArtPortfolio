export type Locale = "en" | "ru";

export type ChapterId =
  | "hero"
  | "specs"
  | "exterior"
  | "acceleration"
  | "quattro"
  | "dynamics"
  | "cabin"
  | "order";

export type PaintId =
  | "nardo"
  | "mythos"
  | "turbo"
  | "sonoma"
  | "tangored"
  | "daytona"
  | "glacier";
export type CaliperId = "red" | "black" | "blue";
export type InteriorId = "black" | "rock" | "red";
export type WheelId = "silver" | "graphite" | "bronze";
export type CabinView = "driver" | "dash" | "seats" | "rear";
export type TorqueState = "normal" | "front" | "rear";
export type DamperMode = "comfort" | "auto" | "dynamic";

export type ConfigState = {
  paint: PaintId;
  caliper: CaliperId;
  interior: InteriorId;
  wheel: WheelId;
  cabinView: CabinView;
  sportDiff: boolean;
  drc: boolean;
  dynamicPackage: boolean;
  sportExhaust: boolean;
  torque: TorqueState;
  damper: DamperMode;
};

export const CHAPTERS: {
  id: ChapterId;
  label: Record<Locale, string>;
}[] = [
  { id: "hero", label: { en: "Reveal", ru: "Reveal" } },
  { id: "specs", label: { en: "Specs", ru: "Данные" } },
  { id: "acceleration", label: { en: "0–100", ru: "0–100" } },
  { id: "quattro", label: { en: "quattro", ru: "quattro" } },
  { id: "dynamics", label: { en: "Dynamics", ru: "Динамика" } },
  { id: "exterior", label: { en: "Configurator", ru: "Configurator" } },
  { id: "order", label: { en: "Order", ru: "Order" } },
];

/** Scroll narrative spine (Order / Interior cabin stay click-driven). */
export const SCROLL_SPINE: ChapterId[] = [
  "hero",
  "specs",
  "acceleration",
  "quattro",
  "dynamics",
  "exterior",
];

/** Viewport heights per spine chapter — acceleration is long so the strip can scrub + dwell on 3.9. */
export const SCROLL_VH: Record<(typeof SCROLL_SPINE)[number], number> = {
  hero: 100,
  specs: 190,
  acceleration: 300,
  quattro: 286,
  dynamics: 260,
  exterior: 100,
};

/**
 * Fraction of the acceleration scroll that drives 0→100.
 * Remainder holds at 3.9s so the figure can be read before Quattro.
 */
export const ACCEL_SCRUB_FRAC = 0.7;

/** Specs sheet: scrub rows early, then hold so the full list can be read. */
export const SPECS_SCRUB_START = 0.05;
export const SPECS_SCRUB_END = 0.52;

/** Map specs chapter-local scroll (0–1) → how many tech rows are revealed. */
export function specsRowsRevealed(local: number, rowCount: number) {
  if (rowCount <= 0) return 0;
  const t = Math.min(
    1,
    Math.max(0, (local - SPECS_SCRUB_START) / (SPECS_SCRUB_END - SPECS_SCRUB_START)),
  );
  return t * rowCount;
}

export function specsIsHold(local: number) {
  return Math.min(1, Math.max(0, local)) >= SPECS_SCRUB_END;
}

/** Map acceleration chapter-local scroll (0–1) → launch strip progress (0–1). */
export function launchTFromAccelLocal(local: number) {
  return Math.min(1, Math.max(0, local) / ACCEL_SCRUB_FRAC);
}

export function scrollSpineTotalVh() {
  return SCROLL_SPINE.reduce((s, id) => s + SCROLL_VH[id], 0);
}

export function chapterFromScrollProgress(p: number): {
  id: ChapterId;
  index: number;
  local: number;
} {
  const total = scrollSpineTotalVh();
  // Work in VH units so chapter edges (integer sums) don't lose to float noise.
  const pos = Math.min(total - 1e-6, Math.max(0, p) * total);
  let cursor = 0;
  for (let i = 0; i < SCROLL_SPINE.length; i++) {
    const id = SCROLL_SPINE[i];
    const h = SCROLL_VH[id];
    if (pos < cursor + h || i === SCROLL_SPINE.length - 1) {
      const local = h <= 0 ? 0 : (pos - cursor) / h;
      return { id, index: i, local: Math.min(1, Math.max(0, local)) };
    }
    cursor += h;
  }
  return { id: "hero", index: 0, local: 0 };
}

/** Scroll progress at the start of a spine chapter (0–1). */
export function progressForChapterStart(id: ChapterId) {
  const total = scrollSpineTotalVh();
  let cursor = 0;
  for (const c of SCROLL_SPINE) {
    if (c === id) {
      // Land a hair inside the chapter so we never resolve as the previous chapter's end.
      return Math.min(0.999999, (cursor + 0.5) / total);
    }
    cursor += SCROLL_VH[c as (typeof SCROLL_SPINE)[number]];
  }
  return 0;
}

/** Base MSRP (DE list, concept) + options — for living configurator display. */
export const PRICE = {
  base: 89000,
  paint: {
    nardo: 0,
    mythos: 900,
    turbo: 1450,
    sonoma: 1450,
    tangored: 1450,
    daytona: 1450,
    glacier: 2100,
  } satisfies Record<PaintId, number>,
  wheel: {
    silver: 0,
    graphite: 1250,
    bronze: 1850,
  } satisfies Record<WheelId, number>,
  caliper: {
    red: 0,
    black: 480,
    blue: 480,
  } satisfies Record<CaliperId, number>,
  interior: {
    black: 0,
    rock: 2400,
    red: 2900,
  } satisfies Record<InteriorId, number>,
  dynamicPackage: 3900,
  sportExhaust: 1650,
} as const;

export function priceEuro(config: ConfigState) {
  return (
    PRICE.base +
    PRICE.paint[config.paint] +
    PRICE.wheel[config.wheel] +
    PRICE.caliper[config.caliper] +
    PRICE.interior[config.interior] +
    (config.dynamicPackage ? PRICE.dynamicPackage : 0) +
    (config.sportExhaust ? PRICE.sportExhaust : 0)
  );
}

export function formatEuro(amount: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Automotive paint: metallic flake vs solid lacquer (dielectric + clearcoat). */
export type PaintKind = "metallic" | "solid";

export const PAINTS: {
  id: PaintId;
  hex: string;
  kind: PaintKind;
  metalness: number;
  roughness: number;
  clearcoatRoughness: number;
  envIntensity: number;
  flake: number;
  label: Record<Locale, string>;
}[] = [
  {
    id: "nardo",
    hex: "#6E7278",
    kind: "metallic",
    metalness: 0.74,
    roughness: 0.34,
    clearcoatRoughness: 0.06,
    envIntensity: 0.92,
    flake: 0.025,
    label: { en: "Nardo Grey", ru: "Nardo Grey" },
  },
  {
    id: "mythos",
    hex: "#0A0F12",
    kind: "solid",
    metalness: 0.12,
    roughness: 0.28,
    clearcoatRoughness: 0.065,
    envIntensity: 0.85,
    flake: 0.01,
    label: { en: "Mythos Black", ru: "Mythos Black" },
  },
  {
    id: "turbo",
    hex: "#1A4A9C",
    kind: "metallic",
    metalness: 0.72,
    roughness: 0.24,
    clearcoatRoughness: 0.05,
    envIntensity: 1.15,
    flake: 0.022,
    label: { en: "Turbo Blue", ru: "Turbo Blue" },
  },
  {
    id: "sonoma",
    hex: "#1F3D2E",
    kind: "metallic",
    metalness: 0.7,
    roughness: 0.26,
    clearcoatRoughness: 0.055,
    envIntensity: 1.08,
    flake: 0.02,
    label: { en: "Sonoma Green", ru: "Sonoma Green" },
  },
  {
    id: "tangored",
    hex: "#7A1822",
    kind: "metallic",
    metalness: 0.7,
    roughness: 0.26,
    clearcoatRoughness: 0.055,
    envIntensity: 1.1,
    flake: 0.02,
    label: { en: "Tango Red", ru: "Tango Red" },
  },
  {
    id: "daytona",
    hex: "#55595E",
    kind: "metallic",
    metalness: 0.82,
    roughness: 0.3,
    clearcoatRoughness: 0.05,
    envIntensity: 1.12,
    flake: 0.022,
    label: { en: "Daytona Grey", ru: "Daytona Grey" },
  },
  {
    id: "glacier",
    hex: "#B4B0A8",
    kind: "metallic",
    metalness: 0.68,
    roughness: 0.28,
    clearcoatRoughness: 0.05,
    envIntensity: 1.15,
    flake: 0.018,
    label: { en: "Glacier White", ru: "Glacier White" },
  },
];

/** Baked material / HDR look (applied at load — no live tune panel). */
export type MaterialTune = {
  environmentIntensity: number;
  exposure: number;
  envMeshIntensity: number;
  keyIntensity: number;
  rimIntensity: number;
  fillIntensity: number;
  shadowIntensity: number;
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  paintClearcoat: number;
  paintClearcoatRoughness: number;
  paintSpecularSolid: number;
  paintSpecularMetallic: number;
  paintEnvMul: number;
  glassRoughness: number;
  glassClearcoat: number;
  glassClearcoatRoughness: number;
  glassSpecular: number;
  glassEnvBody: number;
  glassEnvLens: number;
  glassOpacityBody: number;
  glassOpacityLens: number;
  glassOpacityTail: number;
  chromeRoughness: number;
  chromeEnv: number;
  rubberRoughness: number;
  rubberEnv: number;
  rubberSpecular: number;
  wheelMetalness: number;
  wheelRoughness: number;
  wheelEnv: number;
  bumperMetalness: number;
  bumperRoughness: number;
  bumperEnv: number;
};

export const DEFAULT_MATERIAL_TUNE: MaterialTune = {
  // Hold body hue — softboxes + env must not bleach lacquer
  environmentIntensity: 0.58,
  exposure: 0.9,
  envMeshIntensity: 0.95,
  keyIntensity: 1.25,
  rimIntensity: 0.95,
  fillIntensity: 0.18,
  shadowIntensity: 0.38,
  bloomStrength: 0.012,
  bloomRadius: 0.48,
  bloomThreshold: 0.99,
  paintClearcoat: 1,
  paintClearcoatRoughness: 0.07,
  paintSpecularSolid: 0.48,
  paintSpecularMetallic: 0.42,
  paintEnvMul: 0.55,
  glassRoughness: 0.22,
  glassClearcoat: 0.15,
  glassClearcoatRoughness: 0.35,
  glassSpecular: 0.22,
  glassEnvBody: 0.35,
  glassEnvLens: 0.45,
  glassOpacityBody: 0.26,
  glassOpacityLens: 0.14,
  glassOpacityTail: 0.38,
  // Gloss black optic (window frames / face / rear bar)
  chromeRoughness: 0.28,
  chromeEnv: 0.85,
  rubberRoughness: 0.9,
  rubberEnv: 0.06,
  rubberSpecular: 0.25,
  wheelMetalness: 0.9,
  wheelRoughness: 0.4,
  wheelEnv: 0.85,
  bumperMetalness: 0.04,
  bumperRoughness: 0.62,
  bumperEnv: 0.45,
};

export function formatMaterialTune(t: MaterialTune): string {
  return [
    "=== GLOBAL LIGHT / ENV ===",
    `environmentIntensity: ${t.environmentIntensity}`,
    `toneMappingExposure: ${t.exposure}`,
    `setEnvIntensity: ${t.envMeshIntensity}`,
    `keyIntensity: ${t.keyIntensity}`,
    `rimIntensity: ${t.rimIntensity}`,
    `fillIntensity: ${t.fillIntensity}`,
    `shadowIntensity: ${t.shadowIntensity}`,
    `bloom strength: ${t.bloomStrength}`,
    `bloom radius: ${t.bloomRadius}`,
    `bloom threshold: ${t.bloomThreshold}`,
    "",
    "=== PAINT ===",
    `clearcoat: ${t.paintClearcoat}`,
    `clearcoatRoughness: ${t.paintClearcoatRoughness}`,
    `specularSolid: ${t.paintSpecularSolid}`,
    `specularMetallic: ${t.paintSpecularMetallic}`,
    `envMul: ${t.paintEnvMul}`,
    "",
    "=== GLASS ===",
    `roughness: ${t.glassRoughness}`,
    `clearcoat: ${t.glassClearcoat}`,
    `clearcoatRoughness: ${t.glassClearcoatRoughness}`,
    `specular: ${t.glassSpecular}`,
    `envBody: ${t.glassEnvBody}`,
    `envLens: ${t.glassEnvLens}`,
    `opacityBody: ${t.glassOpacityBody}`,
    `opacityLens: ${t.glassOpacityLens}`,
    `opacityTail: ${t.glassOpacityTail}`,
    "",
    "=== CHROME ===",
    `roughness: ${t.chromeRoughness}`,
    `env: ${t.chromeEnv}`,
    "",
    "=== RUBBER ===",
    `roughness: ${t.rubberRoughness}`,
    `env: ${t.rubberEnv}`,
    `specular: ${t.rubberSpecular}`,
    "",
    "=== WHEELS ===",
    `metalness: ${t.wheelMetalness}`,
    `roughness: ${t.wheelRoughness}`,
    `env: ${t.wheelEnv}`,
    "",
    "=== REAR BUMPER ===",
    `metalness: ${t.bumperMetalness}`,
    `roughness: ${t.bumperRoughness}`,
    `env: ${t.bumperEnv}`,
  ].join("\n");
}

export const CALIPERS: {
  id: CaliperId;
  hex: string;
  label: Record<Locale, string>;
}[] = [
  { id: "red", hex: "#C41E3A", label: { en: "Red", ru: "Красный" } },
  { id: "black", hex: "#1A1A1A", label: { en: "Black", ru: "Чёрный" } },
  { id: "blue", hex: "#1E4F9C", label: { en: "Blue", ru: "Синий" } },
];

export const WHEELS: {
  id: WheelId;
  hex: string;
  label: Record<Locale, string>;
}[] = [
  { id: "silver", hex: "#B9B7B0", label: { en: "Silver", ru: "Серебро" } },
  { id: "graphite", hex: "#363738", label: { en: "Graphite", ru: "Графит" } },
  { id: "bronze", hex: "#5A3C24", label: { en: "Bronze", ru: "Бронза" } },
];

export const INTERIORS: {
  id: InteriorId;
  hex: string;
  stitch: string;
  label: Record<Locale, string>;
}[] = [
  { id: "black", hex: "#171717", stitch: "#8C1828", label: { en: "Fine Nappa · Black", ru: "Fine Nappa · чёрный" } },
  { id: "rock", hex: "#4A4540", stitch: "#A8A39B", label: { en: "Rock Grey", ru: "Rock Grey" } },
  { id: "red", hex: "#5C121C", stitch: "#EEE7DD", label: { en: "RS Red", ru: "RS Red" } },
];

export const CABIN_VIEWS: {
  id: CabinView;
  label: Record<Locale, string>;
}[] = [
  { id: "driver", label: { en: "Driver", ru: "Водитель" } },
  { id: "dash", label: { en: "Dash", ru: "Панель" } },
  { id: "seats", label: { en: "Seats", ru: "Сиденья" } },
  { id: "rear", label: { en: "Rear", ru: "Задний ряд" } },
];

export const TORQUE_STATES: {
  id: TorqueState;
  front: number;
  rear: number;
  label: Record<Locale, string>;
}[] = [
  { id: "rear", front: 15, rear: 85, label: { en: "Max rear", ru: "Макс. зад" } },
  { id: "normal", front: 40, rear: 60, label: { en: "Normal", ru: "Норма" } },
  { id: "front", front: 70, rear: 30, label: { en: "Max front", ru: "Макс. перед" } },
];

/** Hold fraction at each torque key (Max rear / Normal / Max front). */
export const QUATTRO_HOLD_FRAC = 0.15;

/** Scroll path Max rear → Normal → Max front, with dwells at each mode. */
export function torqueFromQuattroLocal(local: number): {
  front: number;
  rear: number;
  mode: TorqueState;
} {
  const u = Math.min(1, Math.max(0, local));
  const h = QUATTRO_HOLD_FRAC;
  const tLen = (1 - 3 * h) / 2;
  const a = TORQUE_STATES[0];
  const b = TORQUE_STATES[1];
  const c = TORQUE_STATES[2];

  const s0 = h;
  const s1 = h + tLen;
  const s2 = h + tLen + h;
  const s3 = h + tLen + h + tLen;

  const smoothstep = (w: number) => {
    const x = Math.min(1, Math.max(0, w));
    return x * x * (3 - 2 * x);
  };

  if (u < s0) {
    return { front: a.front, rear: a.rear, mode: "rear" };
  }
  if (u < s1) {
    const w = smoothstep((u - s0) / tLen);
    return {
      front: a.front + (b.front - a.front) * w,
      rear: a.rear + (b.rear - a.rear) * w,
      mode: w < 0.5 ? "rear" : "normal",
    };
  }
  if (u < s2) {
    return { front: b.front, rear: b.rear, mode: "normal" };
  }
  if (u < s3) {
    const w = smoothstep((u - s2) / tLen);
    return {
      front: b.front + (c.front - b.front) * w,
      rear: b.rear + (c.rear - b.rear) * w,
      mode: w < 0.5 ? "normal" : "front",
    };
  }
  return { front: c.front, rear: c.rear, mode: "front" };
}

export function quattroIsHold(local: number) {
  const u = Math.min(1, Math.max(0, local));
  const h = QUATTRO_HOLD_FRAC;
  const tLen = (1 - 3 * h) / 2;
  const s0 = h;
  const s1 = h + tLen;
  const s2 = h + tLen + h;
  const s3 = h + tLen + h + tLen;
  return u < s0 || (u >= s1 && u < s2) || u >= s3;
}

export const DAMPERS: {
  id: DamperMode;
  label: Record<Locale, string>;
}[] = [
  { id: "comfort", label: { en: "Comfort", ru: "Comfort" } },
  { id: "auto", label: { en: "Auto", ru: "Auto" } },
  { id: "dynamic", label: { en: "Dynamic", ru: "Dynamic" } },
];

/** Hold at each damper character during the Load Lab scroll. */
export const DYNAMICS_HOLD_FRAC = 0.15;

export type DynamicsLive = {
  damper: DamperMode;
  drc: boolean;
  rollDeg: number;
  fl: number;
  fr: number;
  rl: number;
  rr: number;
  phase: "entry" | "peak" | "exit";
};

function smoothstep01(w: number) {
  const x = Math.min(1, Math.max(0, w));
  return x * x * (3 - 2 * x);
}

function damperFromDynamicsLocal(local: number): DamperMode {
  const u = Math.min(1, Math.max(0, local));
  const h = DYNAMICS_HOLD_FRAC;
  const tLen = (1 - 3 * h) / 2;
  const s0 = h;
  const s1 = h + tLen;
  const s2 = h + tLen + h;
  const s3 = h + tLen + h + tLen;
  if (u < s0) return "comfort";
  if (u < s1) return smoothstep01((u - s0) / tLen) < 0.5 ? "comfort" : "auto";
  if (u < s2) return "auto";
  if (u < s3) return smoothstep01((u - s2) / tLen) < 0.5 ? "auto" : "dynamic";
  return "dynamic";
}

/** Corner-load sweep: Comfort→Auto→Dynamic holds, one corner arc, DRC mid-chapter. */
export function dynamicsFromScrollLocal(local: number): DynamicsLive {
  const u = Math.min(1, Math.max(0, local));
  const damper = damperFromDynamicsLocal(u);

  let corner = 0;
  let phase: DynamicsLive["phase"] = "entry";
  if (u < 0.38) {
    corner = smoothstep01(u / 0.38);
    phase = "entry";
  } else if (u < 0.55) {
    corner = 1;
    phase = "peak";
  } else {
    corner = 1 - smoothstep01((u - 0.55) / 0.45);
    phase = "exit";
  }

  const drc = u >= 0.48;
  const idle = { fl: 38, fr: 40, rl: 39, rr: 41 };
  const openPeak = { fl: 26, fr: 82, rl: 74, rr: 30 };
  const evenPeak = { fl: 46, fr: 54, rl: 49, rr: 55 };
  const peak = drc ? evenPeak : openPeak;

  const fl = idle.fl + (peak.fl - idle.fl) * corner;
  const fr = idle.fr + (peak.fr - idle.fr) * corner;
  const rl = idle.rl + (peak.rl - idle.rl) * corner;
  const rr = idle.rr + (peak.rr - idle.rr) * corner;

  const damperScale = damper === "comfort" ? 1 : damper === "auto" ? 0.7 : 0.45;
  const baseRoll = drc ? 1.15 : 3.45;
  const rollDeg = Math.max(0.15, baseRoll * damperScale * (0.2 + 0.8 * corner));

  return { damper, drc, rollDeg, fl, fr, rl, rr, phase };
}

export function dynamicsIsHold(local: number) {
  const u = Math.min(1, Math.max(0, local));
  const h = DYNAMICS_HOLD_FRAC;
  const tLen = (1 - 3 * h) / 2;
  const s0 = h;
  const s1 = h + tLen;
  const s2 = h + tLen + h;
  const s3 = h + tLen + h + tLen;
  return u < s0 || (u >= s1 && u < s2) || u >= s3;
}

export const SPECS = {
  powerPs: 450,
  powerKw: 331,
  torqueNm: 600,
  zeroToHundred: 3.9,
  /** Approximate distance covered in an official 0–100 run (m). */
  zeroToHundredDistanceM: 54,
  zeroToTwoHundred: 13.7,
  topSpeed: 250,
  topSpeedDynamic: 280,
  quattroDefault: "40:60",
  redlineRpm: 7000,
} as const;

/** Official technical data sheet between Reveal and 0–100. */
export const TECH_DATA = {
  models: {
    en: "Audi RS 5 Coupé and Sportback",
    ru: "Audi RS 5 Coupé и Sportback",
  },
  engine: "2.9 V6 TFSI",
  rows: [
    {
      label: { en: "Displacement in cc", ru: "Рабочий объём, см³" },
      value: { en: "2,894", ru: "2 894" },
    },
    {
      label: {
        en: "Max. power output kW (PS) at rpm",
        ru: "Макс. мощность кВт (л.с.) при об/мин",
      },
      value: {
        en: "331 (450) at 5,700–6,700",
        ru: "331 (450) при 5 700–6 700",
      },
    },
    {
      label: {
        en: "Max. torque in Nm (lb-ft) at rpm",
        ru: "Макс. крутящий момент Н·м (lb-ft) при об/мин",
      },
      value: {
        en: "600 (442.5) at 1,900–5,000",
        ru: "600 (442.5) при 1 900–5 000",
      },
    },
    {
      label: {
        en: "Top speed in km/h (mph)",
        ru: "Макс. скорость, км/ч (mph)",
      },
      value: {
        en: "250 (155.3), optionally 280 (174.0)",
        ru: "250 (155.3), опционально 280 (174.0)",
      },
    },
    {
      label: {
        en: "Acceleration 0–100 km/h (0–62.1 mph) in s",
        ru: "Разгон 0–100 км/ч (0–62.1 mph), с",
      },
      value: { en: "3.9", ru: "3.9" },
    },
    {
      label: {
        en: "Fuel consumption (combined) in l/100 km (US mpg)",
        ru: "Расход топлива (смеш.), л/100 км (US mpg)",
      },
      value: {
        en: "9.1 (25.8) Coupé · 9.2 (25.6) Sportback",
        ru: "9.1 (25.8) Coupé · 9.2 (25.6) Sportback",
      },
    },
    {
      label: {
        en: "Combined CO₂ emissions in g/km (g/mi)",
        ru: "Выбросы CO₂ (смеш.), г/км (g/mi)",
      },
      value: {
        en: "208 (334.7) Coupé · 209 (336.4) Sportback",
        ru: "208 (334.7) Coupé · 209 (336.4) Sportback",
      },
    },
    {
      label: { en: "Transmission", ru: "Трансмиссия" },
      value: {
        en: "Eight-speed tiptronic and quattro permanent all-wheel drive",
        ru: "8-ступенчатый tiptronic и постоянный полный привод quattro",
      },
    },
  ],
} as const;

/**
 * Speed (km/h) vs time (s) for a twin-turbo RS 5–class launch.
 * Shape from automobile-catalog RS5 Sportback estimate (0–100 ≈ 4.0 s),
 * times scaled to the official factory 3.9 s claim.
 */
const LAUNCH_SPEED_KEYS: ReadonlyArray<{ t: number; v: number }> = [
  { t: 0, v: 0 },
  { t: 0.88, v: 30 },
  { t: 1.07, v: 40 },
  { t: 1.37, v: 50 },
  { t: 1.85, v: 60 },
  { t: 2.24, v: 70 },
  { t: 2.63, v: 80 },
  { t: 3.32, v: 90 },
  { t: 3.9, v: 100 },
];

function lerpSpeedAtTime(timeS: number) {
  const keys = LAUNCH_SPEED_KEYS;
  if (timeS <= keys[0].t) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (timeS <= b.t) {
      const w = (timeS - a.t) / (b.t - a.t);
      return a.v + (b.v - a.v) * w;
    }
  }
  return keys[keys.length - 1].v;
}

/** Trapezoid integral of v(t) → distance (m), then normalize to SPECS distance. */
function buildLaunchDistanceLut() {
  const n = 160;
  const T = SPECS.zeroToHundred;
  const raw: number[] = new Array(n + 1);
  raw[0] = 0;
  let acc = 0;
  let prevV = 0;
  for (let i = 1; i <= n; i++) {
    const t = (i / n) * T;
    const vKmh = lerpSpeedAtTime(t);
    const vMs = vKmh / 3.6;
    const prevT = ((i - 1) / n) * T;
    acc += ((prevV + vMs) * 0.5) * (t - prevT);
    raw[i] = acc;
    prevV = vMs;
  }
  const total = raw[n] || 1;
  const scale = SPECS.zeroToHundredDistanceM / total;
  return raw.map((d) => d * scale);
}

const LAUNCH_DIST_LUT = buildLaunchDistanceLut();

function distanceAtTime(timeS: number) {
  const T = SPECS.zeroToHundred;
  const u = Math.min(1, Math.max(0, timeS / T));
  const n = LAUNCH_DIST_LUT.length - 1;
  const x = u * n;
  const i = Math.min(n - 1, Math.floor(x));
  const f = x - i;
  return LAUNCH_DIST_LUT[i] + (LAUNCH_DIST_LUT[i + 1] - LAUNCH_DIST_LUT[i]) * f;
}

/** Deterministic 0–100 telemetry from linear time fraction `u` ∈ [0, 1]. */
export function launchTelemetry(uRaw: number) {
  const u = Math.min(1, Math.max(0, uRaw));
  const timeS = u * SPECS.zeroToHundred;
  const speedKmh = lerpSpeedAtTime(timeS);
  const distM = distanceAtTime(timeS);
  const distFrac = Math.min(1, distM / SPECS.zeroToHundredDistanceM);

  // Peak torque arrives early (boosted V6); holds near 600 with mild launch fade
  const torqueNm = Math.round(
    Math.min(
      SPECS.torqueNm,
      280 + (SPECS.torqueNm - 280) * Math.min(1, u * 4.5) * (1 - 0.06 * u),
    ),
  );
  // RPM climbs with speed; soft plateaus for tiptronic shifts
  const rpmClimb = 1800 + (SPECS.redlineRpm - 1600) * (speedKmh / 100) ** 0.85;
  const shiftRipple = 1 - 0.04 * Math.sin(u * Math.PI * 5.2);
  const rpm = Math.round(Math.min(SPECS.redlineRpm, rpmClimb * shiftRipple));

  return {
    u,
    distFrac,
    speedKmh: Math.round(speedKmh),
    distM,
    timeS,
    torqueNm,
    rpm,
  };
}

export const DEFAULT_CONFIG: ConfigState = {
  paint: "nardo",
  caliper: "red",
  interior: "black",
  wheel: "bronze",
  cabinView: "driver",
  sportDiff: true,
  drc: true,
  dynamicPackage: true,
  sportExhaust: false,
  torque: "normal",
  damper: "dynamic",
};

export function topSpeedFor(config: ConfigState) {
  return config.dynamicPackage ? SPECS.topSpeedDynamic : SPECS.topSpeed;
}
