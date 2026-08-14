import { useMemo } from "react";
import { WebEffectCanvas } from "../../../lab/WebEffectCanvas";
import { defaultValues, getWebEffect } from "../../../shaders/webEffects";

/**
 * Liquid as poured wine — viscous garnet body, ruby mid, rose meniscus.
 * Champagne gold is UI chrome only; it must not enter the GPU field.
 */
const WINE_LIQUID: Record<string, number | string> = {
  ...defaultValues(getWebEffect("liquid")),
  uSpeed: 0.2,
  uScale: 0.72,
  uIntensity: 0.78,
  uContrast: 0.55,
  uDetail: 0.38,
  uWarp: 0.1,
  uBg: "#120308",
  uColorA: "#4e0a16",
  uColorB: "#8a1428",
  uColorC: "#c45a62",
};

type Props = {
  className?: string;
};

export function VelvetLiquidBg({ className }: Props) {
  const effect = useMemo(() => getWebEffect("liquid"), []);
  const params = useMemo(() => WINE_LIQUID, []);

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
