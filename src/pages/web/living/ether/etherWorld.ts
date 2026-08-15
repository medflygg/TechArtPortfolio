export type Locale = "en" | "ru";
export type Loc = Record<Locale, string>;

export type ChapterId =
  | "hero"
  | "inside"
  | "anatomy"
  | "origin"
  | "lab"
  | "dna"
  | "match"
  | "reveal"
  | "drydown"
  | "bag";

export const CHAPTERS: ChapterId[] = [
  "hero",
  "inside",
  "anatomy",
  "origin",
  "lab",
  "dna",
  "match",
  "reveal",
  "drydown",
  "bag",
];

/** Scroll height per chapter in vh units (sticky journey). */
export const CHAPTER_VH: Record<ChapterId, number> = {
  hero: 200,
  inside: 130,
  anatomy: 160,
  origin: 180,
  lab: 150,
  dna: 150,
  match: 120,
  reveal: 140,
  drydown: 120,
  bag: 100,
};

export type ScentId = "nocturne" | "ember" | "mist";

export type NoteTier = "top" | "heart" | "base";

export type IngredientId =
  | "bergamot"
  | "iris"
  | "rose"
  | "cedar"
  | "vanilla"
  | "oud"
  | "pepper"
  | "musk"
  | "jasmine"
  | "amber"
  | "resin"
  | "sandalwood";

export type DnaAxes = {
  calmPower: number;
  dayNight: number;
  freshWarm: number;
  minimalSensual: number;
  lightDark: number;
};

export type Scent = {
  id: ScentId;
  name: string;
  accent: string;
  fog: string;
  liquid: string;
  price: number;
  blurb: Loc;
  notes: Record<NoteTier, { id: IngredientId; label: Loc }[]>;
  dna: DnaAxes;
  tags: { floral: number; woody: number; sweet: number; fresh: number };
};

export type Origin = {
  id: string;
  place: Loc;
  ingredient: IngredientId;
  lat: number;
  lon: number;
  mood: Loc;
};

export type Ingredient = {
  id: IngredientId;
  label: Loc;
  accent: string;
  tags: { floral: number; woody: number; sweet: number; fresh: number; intensity: number };
  trail: "cold" | "petal" | "smoke" | "gold" | "spark";
};

export const INGREDIENTS: Record<IngredientId, Ingredient> = {
  bergamot: {
    id: "bergamot",
    label: { en: "Bergamot", ru: "Бергамот" },
    accent: "#5EB8FF",
    tags: { floral: 0.1, woody: 0.05, sweet: 0.1, fresh: 0.9, intensity: 0.55 },
    trail: "cold",
  },
  iris: {
    id: "iris",
    label: { en: "Iris", ru: "Ирис" },
    accent: "#9B8AD4",
    tags: { floral: 0.7, woody: 0.15, sweet: 0.2, fresh: 0.35, intensity: 0.4 },
    trail: "petal",
  },
  rose: {
    id: "rose",
    label: { en: "Rose", ru: "Роза" },
    accent: "#C23048",
    tags: { floral: 0.95, woody: 0.1, sweet: 0.35, fresh: 0.2, intensity: 0.6 },
    trail: "petal",
  },
  cedar: {
    id: "cedar",
    label: { en: "Cedar", ru: "Кедр" },
    accent: "#6A4A2E",
    tags: { floral: 0.05, woody: 0.9, sweet: 0.15, fresh: 0.25, intensity: 0.65 },
    trail: "smoke",
  },
  vanilla: {
    id: "vanilla",
    label: { en: "Vanilla", ru: "Ваниль" },
    accent: "#E8B020",
    tags: { floral: 0.15, woody: 0.2, sweet: 0.95, fresh: 0.05, intensity: 0.7 },
    trail: "gold",
  },
  oud: {
    id: "oud",
    label: { en: "Oud", ru: "Уд" },
    accent: "#A85A22",
    tags: { floral: 0.1, woody: 0.85, sweet: 0.25, fresh: 0.0, intensity: 0.95 },
    trail: "smoke",
  },
  pepper: {
    id: "pepper",
    label: { en: "Pink pepper", ru: "Розовый перец" },
    accent: "#FF3D5A",
    tags: { floral: 0.1, woody: 0.2, sweet: 0.1, fresh: 0.55, intensity: 0.7 },
    trail: "spark",
  },
  musk: {
    id: "musk",
    label: { en: "Musk", ru: "Мускус" },
    accent: "#C8B8A8",
    tags: { floral: 0.2, woody: 0.25, sweet: 0.3, fresh: 0.15, intensity: 0.5 },
    trail: "smoke",
  },
  jasmine: {
    id: "jasmine",
    label: { en: "Jasmine", ru: "Жасмин" },
    accent: "#F0A8C8",
    tags: { floral: 0.9, woody: 0.05, sweet: 0.45, fresh: 0.3, intensity: 0.55 },
    trail: "petal",
  },
  amber: {
    id: "amber",
    label: { en: "Amber", ru: "Амбра" },
    accent: "#D46818",
    tags: { floral: 0.1, woody: 0.45, sweet: 0.7, fresh: 0.0, intensity: 0.75 },
    trail: "gold",
  },
  resin: {
    id: "resin",
    label: { en: "Resin", ru: "Смола" },
    accent: "#3A2214",
    tags: { floral: 0.05, woody: 0.8, sweet: 0.2, fresh: 0.0, intensity: 0.9 },
    trail: "smoke",
  },
  sandalwood: {
    id: "sandalwood",
    label: { en: "Sandalwood", ru: "Сандал" },
    accent: "#C9A66B",
    tags: { floral: 0.15, woody: 0.85, sweet: 0.35, fresh: 0.1, intensity: 0.55 },
    trail: "gold",
  },
};

export const SCENTS: Scent[] = [
  {
    id: "nocturne",
    name: "NOCTURNE",
    accent: "#6B4EFF",
    fog: "#050505",
    liquid: "#3d2480",
    price: 145,
    blurb: {
      en: "Night climate — violet air, deep quiet.",
      ru: "Ночной климат — фиолетовый воздух, глубокая тишина.",
    },
    notes: {
      top: [
        { id: "rose", label: { en: "Black rose", ru: "Чёрная роза" } },
        { id: "bergamot", label: { en: "Citrus essence", ru: "Цитрус" } },
        { id: "pepper", label: { en: "Pink pepper", ru: "Розовый перец" } },
      ],
      heart: [
        { id: "iris", label: { en: "Iris absolute", ru: "Ирис абсолют" } },
        { id: "oud", label: { en: "Oud accord", ru: "Аккорд уда" } },
        { id: "jasmine", label: { en: "Jasmine petals", ru: "Лепестки жасмина" } },
      ],
      base: [
        { id: "resin", label: { en: "Oud wood", ru: "Древесина уда" } },
        { id: "vanilla", label: { en: "Vanilla crystals", ru: "Кристаллы ванили" } },
        { id: "amber", label: { en: "Amber musk", ru: "Амбровый мускус" } },
      ],
    },
    dna: { calmPower: 0.72, dayNight: 0.92, freshWarm: 0.55, minimalSensual: 0.85, lightDark: 0.88 },
    tags: { floral: 0.55, woody: 0.7, sweet: 0.25, fresh: 0.2 },
  },
  {
    id: "ember",
    name: "EMBER",
    accent: "#C68132",
    fog: "#050505",
    liquid: "#8a4e18",
    price: 138,
    blurb: {
      en: "Warm climate — amber heat on skin.",
      ru: "Тёплый климат — янтарный жар на коже.",
    },
    notes: {
      top: [
        { id: "bergamot", label: INGREDIENTS.bergamot.label },
        { id: "pepper", label: INGREDIENTS.pepper.label },
        { id: "iris", label: INGREDIENTS.iris.label },
      ],
      heart: [
        { id: "cedar", label: INGREDIENTS.cedar.label },
        { id: "rose", label: INGREDIENTS.rose.label },
        { id: "vanilla", label: INGREDIENTS.vanilla.label },
      ],
      base: [
        { id: "amber", label: INGREDIENTS.amber.label },
        { id: "musk", label: INGREDIENTS.musk.label },
        { id: "oud", label: INGREDIENTS.oud.label },
      ],
    },
    dna: { calmPower: 0.55, dayNight: 0.65, freshWarm: 0.88, minimalSensual: 0.7, lightDark: 0.6 },
    tags: { floral: 0.3, woody: 0.65, sweet: 0.75, fresh: 0.25 },
  },
  {
    id: "mist",
    name: "MIST",
    accent: "#8BB8C9",
    fog: "#050505",
    liquid: "#3a6a7a",
    price: 128,
    blurb: {
      en: "Cool climate — clear air, soft distance.",
      ru: "Прохладный климат — чистый воздух, мягкая дистанция.",
    },
    notes: {
      top: [
        { id: "bergamot", label: INGREDIENTS.bergamot.label },
        { id: "pepper", label: INGREDIENTS.pepper.label },
        { id: "iris", label: INGREDIENTS.iris.label },
      ],
      heart: [
        { id: "jasmine", label: INGREDIENTS.jasmine.label },
        { id: "cedar", label: INGREDIENTS.cedar.label },
        { id: "rose", label: INGREDIENTS.rose.label },
      ],
      base: [
        { id: "musk", label: INGREDIENTS.musk.label },
        { id: "sandalwood", label: INGREDIENTS.sandalwood.label },
        { id: "vanilla", label: INGREDIENTS.vanilla.label },
      ],
    },
    dna: { calmPower: 0.35, dayNight: 0.25, freshWarm: 0.2, minimalSensual: 0.3, lightDark: 0.25 },
    tags: { floral: 0.25, woody: 0.4, sweet: 0.1, fresh: 0.9 },
  },
];

export const ORIGINS: Origin[] = [
  {
    id: "calabria",
    place: { en: "Calabria", ru: "Калабрия" },
    ingredient: "bergamot",
    lat: 39.0,
    lon: 16.5,
    mood: { en: "Bright citrus air · morning light", ru: "Яркий цитрусовый воздух · утренний свет" },
  },
  {
    id: "madagascar",
    place: { en: "Madagascar", ru: "Мадагаскар" },
    ingredient: "vanilla",
    lat: -18.8,
    lon: 46.8,
    mood: { en: "Warm sweetness · soft gold", ru: "Тёплая сладость · мягкое золото" },
  },
  {
    id: "india",
    place: { en: "India", ru: "Индия" },
    ingredient: "cedar",
    lat: 22.0,
    lon: 78.0,
    mood: { en: "Dry wood · quiet heat", ru: "Сухое дерево · тихий жар" },
  },
  {
    id: "oman",
    place: { en: "Oman", ru: "Оман" },
    ingredient: "oud",
    lat: 21.0,
    lon: 57.0,
    mood: { en: "Deep resin · night smoke", ru: "Глубокая смола · ночной дым" },
  },
  {
    id: "bulgaria",
    place: { en: "Bulgaria", ru: "Болгария" },
    ingredient: "rose",
    lat: 42.7,
    lon: 25.5,
    mood: { en: "Petal velvet · cool dusk", ru: "Бархат лепестков · прохладные сумерки" },
  },
];

export const LAB_POOL: IngredientId[] = ["bergamot", "iris", "rose", "cedar", "vanilla", "oud"];

export function getScent(id: ScentId) {
  return SCENTS.find((s) => s.id === id) ?? SCENTS[0];
}

export function latLonToVec(lat: number, lon: number, r = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

export function blendLab(ids: IngredientId[]) {
  if (!ids.length) {
    return { floral: 0, woody: 0, sweet: 0, fresh: 0, intensity: 0.2, accent: "#EAE6DD" };
  }
  const acc = { floral: 0, woody: 0, sweet: 0, fresh: 0, intensity: 0 };
  let r = 0;
  let g = 0;
  let b = 0;
  for (const id of ids) {
    const ing = INGREDIENTS[id];
    acc.floral += ing.tags.floral;
    acc.woody += ing.tags.woody;
    acc.sweet += ing.tags.sweet;
    acc.fresh += ing.tags.fresh;
    acc.intensity += ing.tags.intensity;
    const hex = ing.accent.replace("#", "");
    r += parseInt(hex.slice(0, 2), 16);
    g += parseInt(hex.slice(2, 4), 16);
    b += parseInt(hex.slice(4, 6), 16);
  }
  const n = ids.length;
  const toHex = (v: number) => Math.round(v / n).toString(16).padStart(2, "0");
  return {
    floral: Math.round((acc.floral / n) * 100),
    woody: Math.round((acc.woody / n) * 100),
    sweet: Math.round((acc.sweet / n) * 100),
    fresh: Math.round((acc.fresh / n) * 100),
    intensity: Math.round((acc.intensity / n) * 100),
    accent: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
  };
}

/** Mix ingredient accents — used for lab blends and dry-down field tint. */
export function mixNoteAccents(ids: IngredientId[]): string {
  if (!ids.length) return "#EAE6DD";
  let r = 0;
  let g = 0;
  let b = 0;
  for (const id of ids) {
    const hex = INGREDIENTS[id].accent.replace("#", "");
    r += parseInt(hex.slice(0, 2), 16);
    g += parseInt(hex.slice(2, 4), 16);
    b += parseInt(hex.slice(4, 6), 16);
  }
  const n = ids.length;
  const toHex = (v: number) => Math.round(v / n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Crossfade top → heart → base accents by dry-down timeline (0–1). */
export function drydownFieldAccent(scent: Scent, dry: number): string {
  const t = Math.min(1, Math.max(0, dry));
  const top = mixNoteAccents(scent.notes.top.map((n) => n.id));
  const heart = mixNoteAccents(scent.notes.heart.map((n) => n.id));
  const base = mixNoteAccents(scent.notes.base.map((n) => n.id));
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] as const;
  };
  const a = parse(top);
  const b = parse(heart);
  const c = parse(base);
  let wTop = 0;
  let wHeart = 0;
  let wBase = 0;
  if (t < 0.35) {
    const u = t / 0.35;
    wTop = 1 - u;
    wHeart = u;
  } else if (t < 0.65) {
    const u = (t - 0.35) / 0.3;
    wHeart = 1 - u;
    wBase = u;
  } else {
    wBase = 1;
  }
  const mix = (i: 0 | 1 | 2) => Math.round(a[i] * wTop + b[i] * wHeart + c[i] * wBase);
  const toHex = (v: number) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0");
  return `#${toHex(mix(0))}${toHex(mix(1))}${toHex(mix(2))}`;
}

export function drydownPhaseFromT(dry: number): NoteTier {
  if (dry < 0.28) return "top";
  if (dry < 0.58) return "heart";
  return "base";
}

export function scoreDna(axes: DnaAxes) {
  return SCENTS.map((s) => {
    const d =
      Math.abs(s.dna.calmPower - axes.calmPower) +
      Math.abs(s.dna.dayNight - axes.dayNight) +
      Math.abs(s.dna.freshWarm - axes.freshWarm) +
      Math.abs(s.dna.minimalSensual - axes.minimalSensual) +
      Math.abs(s.dna.lightDark - axes.lightDark);
    const match = Math.round((1 - d / 5) * 100);
    return { scent: s, match: Math.max(40, match) };
  }).sort((a, b) => b.match - a.match);
}

export function chapterFromProgress(p: number): { id: ChapterId; index: number; local: number } {
  const total = CHAPTERS.reduce((s, id) => s + CHAPTER_VH[id], 0);
  let cursor = 0;
  const clamped = Math.min(0.999, Math.max(0, p));
  for (let i = 0; i < CHAPTERS.length; i++) {
    const id = CHAPTERS[i];
    const share = CHAPTER_VH[id] / total;
    if (clamped < cursor + share || i === CHAPTERS.length - 1) {
      const local = (clamped - cursor) / share;
      return { id, index: i, local: Math.min(1, Math.max(0, local)) };
    }
    cursor += share;
  }
  return { id: "bag", index: CHAPTERS.length - 1, local: 1 };
}
