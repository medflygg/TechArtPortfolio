import type { RainForestParams } from "../shaders/rainForestParams";
import { defaultRainForestParams } from "../shaders/rainForestParams";

type Props = {
  value: RainForestParams;
  onChange: (next: RainForestParams) => void;
};

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  hint,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="rf-control">
      <span className="rf-control__label">
        {label}
        <em>{hint ?? value.toFixed(2)}</em>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="rf-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function todLabel(v: number) {
  if (v < 0.12 || v >= 0.88) return "night";
  if (v < 0.32) return "dawn";
  if (v < 0.62) return "day";
  if (v < 0.82) return "dusk";
  return "night";
}

function seasonLabel(v: number) {
  if (v < 0.25) return "summer";
  if (v < 0.6) return "late summer";
  if (v < 0.85) return "autumn";
  return "peak autumn";
}

export function RainForestControls({ value, onChange }: Props) {
  const set = <K extends keyof RainForestParams>(key: K, next: RainForestParams[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <aside className="rf-panel" aria-label="Rain Forest parameters">
      <div className="rf-panel__head">
        <strong>parameters</strong>
        <button
          type="button"
          className="rf-panel__reset"
          onClick={() => onChange({ ...defaultRainForestParams })}
        >
          reset
        </button>
      </div>

      <div className="rf-panel__toggles">
        <Toggle
          label="Auto day cycle"
          checked={value.autoCycle}
          onChange={(v) => set("autoCycle", v)}
        />
      </div>

      <Slider
        label="Time of day"
        hint={todLabel(value.timeOfDay)}
        min={0}
        max={1}
        step={0.01}
        value={value.timeOfDay}
        onChange={(v) => set("timeOfDay", v)}
      />
      <Slider
        label="Season"
        hint={seasonLabel(value.season)}
        min={0}
        max={1}
        step={0.01}
        value={value.season}
        onChange={(v) => set("season", v)}
      />
      <Slider
        label="Cloud cover"
        hint={value.cloudCover < 0.02 ? "clear" : value.cloudCover.toFixed(2)}
        min={0}
        max={2}
        step={0.01}
        value={value.cloudCover}
        onChange={(v) => set("cloudCover", v)}
      />
      <Slider
        label="Fog"
        min={0}
        max={2.5}
        step={0.01}
        value={value.fogAmount}
        onChange={(v) => set("fogAmount", v)}
      />
      <Slider
        label="Wind"
        min={0}
        max={2.5}
        step={0.01}
        value={value.wind}
        onChange={(v) => set("wind", v)}
      />
      <Slider
        label="Vignette"
        min={0}
        max={1}
        step={0.01}
        value={value.vignette}
        onChange={(v) => set("vignette", v)}
      />
    </aside>
  );
}
