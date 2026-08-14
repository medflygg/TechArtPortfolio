import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import { WebEffectCanvas } from "../lab/WebEffectCanvas";
import {
  asSmokeParams,
  SMOKE_SIM_REVISION,
  WebSmokeCanvas,
  type SmokeParams,
} from "../lab/WebSmokeCanvas";
import { LogoParticlesCanvas } from "../lab/LogoParticlesCanvas";
import {
  rasterizeDefaultLogo,
  rasterizeSvgFile,
} from "../lab/logoMask";
import {
  defaultValues,
  effectKind,
  effectsByKind,
  getWebEffect,
  isColorParam,
  isFloatParam,
  buildExportGlsl,
  buildExportReact,
  type WebEffectKind,
} from "../shaders/webEffects";

type ExportKind = "glsl" | "react";
type ParamValues = Record<string, number | string>;

export function WebShadersPage() {
  const { t } = useI18n();
  const [room, setRoom] = useState<WebEffectKind>("bg");
  const catalog = useMemo(() => effectsByKind(room), [room]);
  const [effectId, setEffectId] = useState(catalog[0].id);
  const effect = useMemo(() => getWebEffect(effectId), [effectId]);
  const [values, setValues] = useState<ParamValues>(() => defaultValues(effect));
  const [exportKind, setExportKind] = useState<ExportKind>("glsl");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [logoMask, setLogoMask] = useState<HTMLCanvasElement | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const defaultLogoTried = useRef(false);

  const selectEffect = (id: string) => {
    const next = getWebEffect(id);
    setEffectId(id);
    setValues(defaultValues(next));
    setCopied(false);
  };

  const selectRoom = (next: WebEffectKind) => {
    setRoom(next);
    const first = effectsByKind(next)[0];
    if (first) selectEffect(first.id);
    setError(null);
  };

  useEffect(() => {
    if (effectKind(effect) !== "logo" || logoMask || defaultLogoTried.current) return;
    defaultLogoTried.current = true;
    let alive = true;
    rasterizeDefaultLogo()
      .then((canvas) => {
        if (!alive) return;
        setLogoMask(canvas);
        setLogoName("ATLAS.svg");
      })
      .catch(() => {
        if (alive) setError(t.studio.errSvgRead);
      });
    return () => {
      alive = false;
    };
  }, [effect, logoMask, t.studio.errSvgRead]);

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

  const onPickSvg = async (file: File | null) => {
    if (!file) return;
    const isSvg =
      file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    if (!isSvg) {
      setError(t.studio.errSvgType);
      return;
    }
    try {
      const canvas = await rasterizeSvgFile(file);
      setLogoMask(canvas);
      setLogoName(file.name);
      setError(null);
    } catch {
      setError(t.studio.errSvgRead);
    }
  };

  const resetLogo = async () => {
    try {
      const canvas = await rasterizeDefaultLogo();
      setLogoMask(canvas);
      setLogoName("ATLAS.svg");
      setError(null);
    } catch {
      setError(t.studio.errSvgRead);
    }
  };

  const isLogo = effectKind(effect) === "logo";
  const logoHint =
    t.studio.logoHints?.[effect.id as keyof typeof t.studio.logoHints] ??
    effect.blurb;
  const hint = isLogo
    ? logoHint
    : effect.engine === "smoke"
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
  const stageImage = isLogo ? logoMask : effect.needsImage ? localImage : null;

  return (
    <main className="page page--dark web-lab">
      <p className="wc-back">
        <Link to="/work/web">{t.studio.back}</Link>
      </p>
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

      <div className="web-lab__rooms" role="tablist" aria-label={t.studio.rooms}>
        <button
          type="button"
          role="tab"
          className="web-lab__room"
          aria-selected={room === "bg"}
          onClick={() => selectRoom("bg")}
        >
          {t.studio.roomBg}
        </button>
        <button
          type="button"
          role="tab"
          className="web-lab__room"
          aria-selected={room === "logo"}
          onClick={() => selectRoom("logo")}
        >
          {t.studio.roomLogo}
        </button>
      </div>

      <div className="web-lab__effects" role="list">
        {catalog.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className="web-lab__chip"
            aria-pressed={effectId === item.id}
            onClick={() => selectEffect(item.id)}
          >
            <span>{item.title}</span>
            <em>
              {t.studio.logoHints?.[item.id as keyof typeof t.studio.logoHints] ??
                item.blurb}
            </em>
          </button>
        ))}
      </div>

      {error ? (
        <p className="lab__hint" style={{ color: "#ff8f7a" }}>
          {error}
        </p>
      ) : null}

      <div className="web-lab__stage">
        <section
          className={`web-lab__viewport${isLogo ? " web-lab__viewport--logo" : ""}`}
        >
          {/* Always a full-bleed layer so particles / Smokey get a real height. */}
          <div className="web-lab__fx">
            {effect.engine === "smoke" ? (
              <WebSmokeCanvas
                key={`studio-smoke-${effect.id}-${SMOKE_SIM_REVISION}`}
                params={smokeParams}
                mask={isLogo ? logoMask : null}
                maskScale={Number(values.uScale ?? 0.92)}
                look={effect.id === "mercury" ? "mercury" : "smoke"}
                onError={setError}
              />
            ) : effect.engine === "particles" ? (
              <LogoParticlesCanvas
                key={`logo-particles-v12-${effect.id}`}
                params={values}
                image={stageImage}
                onError={setError}
              />
            ) : (
              <WebEffectCanvas
                fragment={effect.fragment}
                params={values}
                image={stageImage}
                onError={setError}
              />
            )}
          </div>
          <div className="web-lab__viewport-meta">
            <strong>{effect.title}</strong>
            <span>{hint}</span>
          </div>
        </section>

        <aside className="web-lab__side">
          {isLogo ? (
            <div className="web-lab__side-block">
              <h2>{t.studio.svg}</h2>
              <p className="web-lab__note">{t.studio.svgNote}</p>
              <input
                ref={logoRef}
                type="file"
                accept=".svg,image/svg+xml"
                hidden
                onChange={(e) => onPickSvg(e.target.files?.[0] ?? null)}
              />
              <div className="web-lab__image-actions">
                <button
                  type="button"
                  className="btn btn--accent"
                  onClick={() => logoRef.current?.click()}
                >
                  {logoName && logoName !== "ATLAS.svg"
                    ? t.studio.replaceSvg
                    : t.studio.chooseSvg}
                </button>
                {logoName && logoName !== "ATLAS.svg" ? (
                  <button type="button" className="btn btn--ghost" onClick={resetLogo}>
                    {t.studio.useDefault}
                  </button>
                ) : null}
              </div>
              {logoName ? <p className="web-lab__note web-lab__note--file">{logoName}</p> : null}
            </div>
          ) : effect.needsImage ? (
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
