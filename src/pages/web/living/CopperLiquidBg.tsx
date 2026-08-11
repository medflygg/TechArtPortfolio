import { useMemo } from "react";
import { WebEffectCanvas } from "../../../lab/WebEffectCanvas";
import { defaultValues, getWebEffect } from "../../../shaders/webEffects";

/** Liquid molten marble — copper / heat palette for Kiln hero (no cursor warp). */
const COPPER_LIQUID: Record<string, number | string> = {
  ...defaultValues(getWebEffect("liquid")),
  uSpeed: 0.55,
  uScale: 1.05,
  uIntensity: 1.2,
  uContrast: 1.05,
  uDetail: 0.9,
  uWarp: 0,
  uBg: "#080204",
  uColorA: "#6B1408",
  uColorB: "#E85A12",
  uColorC: "#F0C49A",
};

type Props = {
  className?: string;
};

export function CopperLiquidBg({ className }: Props) {
  const effect = useMemo(() => getWebEffect("liquid"), []);
  const params = useMemo(() => COPPER_LIQUID, []);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <WebEffectCanvas fragment={effect.fragment} params={params} />
    </div>
  );
}
