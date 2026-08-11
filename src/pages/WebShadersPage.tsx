import { useMemo, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { WebEffectCanvas } from "../lab/WebEffectCanvas";
import {
  asSmokeParams,
  SMOKE_SIM_REVISION,
  WebSmokeCanvas,
  type SmokeParams,
} from "../lab/WebSmokeCanvas";
import {
  defaultValues,
  getWebEffect,
  isColorParam,
  isFloatParam,
  webEffects,
  buildExportGlsl,
  buildExportReact,
} from "../shaders/webEffects";

type ExportKind = "glsl" | "react";
type ParamValues = Record<string, number | string>;

export function WebShadersPage() {
  const { t } = useI18n();
  const [effectId, setEffectId] = useState(webEffects[0].id);
  const effect = useMemo(() => getWebEffect(effectId), [effectId]);
  const [values, setValues] = useState<ParamValues>(() => defaultValues(effect));
  const [exportKind, setExportKind] = useState<ExportKind>("glsl");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectEffect = (id: string) => {
    const next = getWebEffect(id);
    setEffectId(id);
    setValues(defaultValues(next));
    setCopied(false);
  };

  const setFloat = (key: string, v: number) =>
    setValues((prev) => ({ ...prev, [key]: v }));
  const setColor = (key: string, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const exportText =
    exportKind === "glsl" ? buildExportGlsl(effect) : buildExportReact(effect);

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const onPickImage = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t.studio.errImageType);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setLocalImage(img);
      setImageName(file.name);
      setError(null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError(t.studio.errImageRead);
    };
    img.src = url;
  };

  const hint = effect.engine === "smoke"
    ? t.studio.hintSmoke
    : effect.interactive
      ? t.studio.hintInteractive
      : effect.needsImage
        ? imageName
          ? `${t.studio.hintImageOn} · ${imageName}`
          : t.studio.hintImageOff
        : t.studio.hintAmbient;

  const floatParams = effect.params.filter(isFloatParam);
  const colorParams = effect.params.filter(isColorParam);
  const smokeParams: SmokeParams = asSmokeParams(values);

  return (
    <main className="page page--dark web-lab">
      <header className="web-lab__head">
        <div>
          <p className="web-lab__kicker">{t.studio.kicker}</p>
          <h1>{t.studio.title}</h1>
          <p>{t.studio.lead}</p>
        </div>
        <div className="web-lab__export-bar">
          <div className="pill-group" role="group" aria-label="Export format">
            <button
              type="button"
              className="pill"
              aria-pressed={exportKind === "glsl"}
              onClick={() => setExportKind("glsl")}
            >
              GLSL
            </button>
            <button
              type="button"
              className="pill"
              aria-pressed={exportKind === "react"}
              onClick={() => setExportKind("react")}
            >
              React
            </button>
          </div>
          <button type="button" className="btn btn--accent" onClick={copyExport}>
            {copied ? t.studio.copied : t.studio.exportCode}
          </button>
        </div>
      </header>

      <div className="web-lab__effects" role="list">
        {webEffects.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className="web-lab__chip"
            aria-pressed={effectId === item.id}
            onClick={() => selectEffect(item.id)}
          >
            <span>{item.title}</span>
            <em>{item.blurb}</em>
          </button>
        ))}
      </div>

      {error ? (
        <p className="lab__hint" style={{ color: "#ff8f7a" }}>
          {error}
        </p>
      ) : null}

      <div className="web-lab__stage">
        <section className="web-lab__viewport">
          {effect.engine === "smoke" ? (
            <WebSmokeCanvas
              key={`studio-smoke-${SMOKE_SIM_REVISION}`}
              params={smokeParams}
              onError={setError}
            />
          ) : (
            <WebEffectCanvas
              fragment={effect.fragment}
              params={values}
              image={effect.needsImage ? localImage : null}
              onError={setError}
            />
          )}
          <div className="web-lab__viewport-meta">
            <strong>{effect.title}</strong>
            <span>{hint}</span>
          </div>
        </section>

        <aside className="web-lab__side">
          {effect.needsImage ? (
            <div className="web-lab__side-block">
              <h2>{t.studio.image}</h2>
              <p className="web-lab__note">{t.studio.imageNote}</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
              />
              <div className="web-lab__image-actions">
                <button
                  type="button"
                  className="btn btn--accent"
                  onClick={() => fileRef.current?.click()}
                >
                  {imageName ? t.studio.replaceImage : t.studio.chooseImage}
                </button>
                {imageName ? (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      setLocalImage(null);
                      setImageName(null);
                    }}
                  >
                    {t.studio.clear}
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="web-lab__side-block">
            <h2>{t.studio.colors}</h2>
            <div className="web-lab__colors">
              {colorParams.map((param) => (
                <label key={param.key} className="web-lab__color">
                  <span>{param.label}</span>
                  <input
                    type="color"
                    value={String(values[param.key] ?? param.default)}
                    onChange={(e) => setColor(param.key, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="web-lab__side-block">
            <h2>{t.studio.params}</h2>
            {floatParams.map((param) => (
              <label key={param.key} className="rf-control">
                <span className="rf-control__label">
                  {param.label}
                  <em>{Number(values[param.key] ?? param.default).toFixed(2)}</em>
                </span>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={Number(values[param.key] ?? param.default)}
                  onChange={(e) => setFloat(param.key, Number(e.target.value))}
                />
              </label>
            ))}
          </div>

          <div className="web-lab__side-block web-lab__code">
            <div className="lab__code-head">
              {exportKind === "glsl"
                ? t.studio.exportFragment
                : t.studio.exportReact}
            </div>
            <textarea readOnly value={exportText} spellCheck={false} />
          </div>
        </aside>
      </div>
    </main>
  );
}
