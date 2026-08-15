import { publicUrl } from "../../../../lib/publicUrl";
import type { ChapterId } from "./etherWorld";

/** Storyboard gen plates — brought alive with shaders / motion. */
export const ETHER_PLATES = {
  hero: publicUrl("portfolio/ether/ether-01-hero.png"),
  enter: publicUrl("portfolio/ether/ether-02-enter-glass.png"),
  inside: publicUrl("portfolio/ether/ether-03-inside-bottle.png"),
  anatomy: publicUrl("portfolio/ether/ether-04-anatomy.png"),
  origin: publicUrl("portfolio/ether/ether-05-origin-globe.png"),
  stream: publicUrl("portfolio/ether/ether-06-ingredient-stream.png"),
  lab: publicUrl("portfolio/ether/ether-07-perfumer-lab.png"),
  dna: publicUrl("portfolio/ether/ether-08-scent-dna.png"),
  match: publicUrl("portfolio/ether/ether-08b-match.png"),
  reveal: publicUrl("portfolio/ether/ether-09-product-reveal.png"),
  drydown: publicUrl("portfolio/ether/ether-10-drydown.png"),
  bag: publicUrl("portfolio/ether/ether-11-bag-memory.png"),
} as const;

/** Cutout elements — black-bg PNGs, additive motion sprites. */
export const ETHER_ELEMS = {
  bergamot: publicUrl("portfolio/ether/ether-elem-bergamot.png"),
  rose: publicUrl("portfolio/ether/ether-elem-rose.png"),
  thumbHero: publicUrl("portfolio/ether/ether-01-hero.png"),
  bottleGlb: publicUrl("portfolio/ether/ether-bottle.glb"),
} as const;

export type PlateKey = keyof typeof ETHER_PLATES;
export type ElemKey = keyof typeof ETHER_ELEMS;

export type PlatePlan = {
  primary: PlateKey;
  secondary: PlateKey | null;
  mix: number;
  glass: number;
  breath: number;
  /** Extra cutout float layer */
  floaters: boolean;
  molecules: number;
};

/** Which plate(s) + motion recipe for each chapter. */
export function plateForChapter(
  chapter: ChapterId,
  opts: { local: number; originFlight: number },
): PlatePlan {
  const { local, originFlight } = opts;

  switch (chapter) {
    case "hero": {
      const enter = Math.max(0, (local - 0.5) / 0.5);
      return {
        primary: "hero",
        secondary: "enter",
        mix: enter * 0.35,
        glass: enter,
        breath: 1,
        floaters: true,
        molecules: 0.25 + enter * 0.4,
      };
    }
    case "inside":
      return {
        primary: "inside",
        secondary: null,
        mix: 0,
        glass: Math.max(0, 0.35 - local * 0.45),
        breath: 1.1,
        floaters: true,
        molecules: 1.15,
      };
    case "anatomy":
      return {
        primary: "anatomy",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.7,
        floaters: true,
        molecules: 0.45,
      };
    case "origin":
      return {
        primary: "origin",
        secondary: originFlight > 0.15 ? "stream" : null,
        mix: Math.min(0.55, originFlight * 0.7),
        glass: 0,
        breath: 0.75,
        floaters: false,
        molecules: 0.35,
      };
    case "lab":
      return {
        primary: "lab",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.65,
        floaters: false,
        molecules: 0.2,
      };
    case "dna":
      return {
        primary: "dna",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.85,
        floaters: false,
        molecules: 0.4,
      };
    case "match":
      return {
        primary: "match",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.8,
        floaters: false,
        molecules: 0.55,
      };
    case "reveal":
      return {
        primary: "reveal",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.9,
        floaters: false,
        molecules: 0.5,
      };
    case "drydown":
      return {
        primary: "drydown",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.6,
        floaters: false,
        molecules: Math.max(0.15, 1 - local),
      };
    case "bag":
      return {
        primary: "bag",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 0.5,
        floaters: false,
        molecules: 0.2,
      };
    default:
      return {
        primary: "hero",
        secondary: null,
        mix: 0,
        glass: 0,
        breath: 1,
        floaters: true,
        molecules: 0.25,
      };
  }
}
