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
    hex: "#9A9EA2",
    kind: "metallic",
    metalness: 0.92,
    roughness: 0.42,
    clearcoatRoughness: 0.04,
    envIntensity: 1.35,
    flake: 0.14,
    label: { en: "Nardo Grey", ru: "Nardo Grey" },
  },
  {
    id: "mythos",
    hex: "#0E0F11",
    kind: "solid",
    metalness: 0.06,
    roughness: 0.48,
    clearcoatRoughness: 0.03,
    envIntensity: 1.15,
    flake: 0.04,
    label: { en: "Mythos Black", ru: "Mythos Black" },
  },
  {
    id: "turbo",
    hex: "#1A3F86",
    kind: "solid",
    metalness: 0.08,
    roughness: 0.5,
    clearcoatRoughness: 0.045,
    envIntensity: 1.2,
    flake: 0.06,
    label: { en: "Turbo Blue", ru: "Turbo Blue" },
  },
  {
    id: "tangored",
    hex: "#6B1420",
    kind: "solid",
    metalness: 0.1,
    roughness: 0.52,
    clearcoatRoughness: 0.05,
    envIntensity: 1.18,
    flake: 0.05,
    label: { en: "Tango Red", ru: "Tango Red" },
  },
  {
    id: "daytona",
    hex: "#63676C",
    kind: "metallic",
    metalness: 0.95,
    roughness: 0.4,
    clearcoatRoughness: 0.035,
    envIntensity: 1.4,
    flake: 0.16,
    label: { en: "Daytona Grey", ru: "Daytona Grey" },
  },
  {
    id: "glacier",
    hex: "#E6E2DA",
    kind: "metallic",
    metalness: 0.88,
    roughness: 0.38,
    clearcoatRoughness: 0.03,
    envIntensity: 1.45,
    flake: 0.1,
    label: { en: "Glacier White", ru: "Glacier White" },
  },
];