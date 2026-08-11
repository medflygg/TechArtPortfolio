/** Single source of truth for Smoke — Home + Studio share these. */

export type SmokeParams = {
  uSpeed: number;
  uDirection: number;
  uFade: number;
  uGravity: number;
  uSpread: number;
  uDensity: number;
  uInertia: number;
  uBg: string;
  uColorA: string;
  uColorB: string;
};

/** Bump when sim behavior changes so Home remounts the live canvas. */
export const SMOKE_SIM_REVISION = 8;

export const defaultSmokeParams: SmokeParams = {
  uSpeed: 1.5,
  uDirection: 0,
  uFade: 0.12,
  uGravity: 0.45,
  uSpread: 28,
  uDensity: 0.48,
  uInertia: 0.82,
  // Cooler blue from the start
  uBg: "#07080b",
  uColorA: "#7EBEEA",
  uColorB: "#3D6FA8",
};

export function asSmokeParams(
  values: Record<string, number | string> | SmokeParams,
): SmokeParams {
  return {
    uSpeed: Number(values.uSpeed ?? defaultSmokeParams.uSpeed),
    uDirection: Number(values.uDirection ?? defaultSmokeParams.uDirection),
    uFade: Number(values.uFade ?? defaultSmokeParams.uFade),
    uGravity: Number(values.uGravity ?? defaultSmokeParams.uGravity),
    uSpread: Number(values.uSpread ?? defaultSmokeParams.uSpread),
    uDensity: Number(values.uDensity ?? defaultSmokeParams.uDensity),
    uInertia: Number(values.uInertia ?? defaultSmokeParams.uInertia),
    uBg: String(values.uBg ?? defaultSmokeParams.uBg),
    uColorA: String(values.uColorA ?? defaultSmokeParams.uColorA),
    uColorB: String(values.uColorB ?? defaultSmokeParams.uColorB),
  };
}
