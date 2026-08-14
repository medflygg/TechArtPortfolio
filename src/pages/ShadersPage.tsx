import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RainForestControls } from "../components/RainForestControls";
import { useI18n } from "../i18n/I18nProvider";
import { FullscreenShaderCanvas } from "../lab/FullscreenShaderCanvas";
import {
  MaterialPreviewCanvas,
  type MeshKind,
} from "../lab/MaterialPreviewCanvas";
import { RainForestCanvas } from "../lab/RainForestCanvas";
import {
  cloudsLocalCode,
  fakeLightFullscreenCode,
  rainForestBufferA,
  rainForestImage,
  rainForestMeta,
} from "../shaders/fullscreenSources";
import { materialPresets } from "../shaders/materialSources";
import {
  defaultRainForestParams,
  type RainForestParams,
} from "../shaders/rainForestParams";

type Mode = "fullscreen" | "material";
type RainTab = "bufferA" | "image";

const fullscreenPresets = [
  {
    id: "rain-forest",
    title: "Rain Forest",
    kind: "multipass" as const,
    code: rainForestBufferA,
    label: rainForestMeta.label,
  },
  {
    id: "clouds-local",
    title: "Clouds (local GLSL)",
    kind: "local" as const,
    code: cloudsLocalCode,
    label: "preview · fullscreen raymarch",
  },
  {
    id: "fake-lights",
    title: "Fake lantern field",
    kind: "local" as const,
    code: fakeLightFullscreenCode,
    label: "preview · fake dynamic lights",
  },
];

function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export function ShadersPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("fullscreen");
  const [mesh, setMesh] = useState<MeshKind>("cube");
  const [autoRotate, setAutoRotate] = useState(false);
  const [fullscreenId, setFullscreenId] = useState(fullscreenPresets[0].id);
  const [materialId, setMaterialId] = useState<string>(materialPresets[0].id);
  const [rainTab, setRainTab] = useState<RainTab>("bufferA");
  const [bufferACode, setBufferACode] = useState(rainForestBufferA);
  const [imageCode, setImageCode] = useState(rainForestImage);
  const [code, setCode] = useState(fullscreenPresets[0].code);
  const [error, setError] = useState<string | null>(null);
  const [rainParams, setRainParams] = useState<RainForestParams>(
    defaultRainForestParams,
  );

  // Keep multipass sources in sync when shader modules hot-reload
  useEffect(() => {
    setBufferACode(rainForestBufferA);
  }, [rainForestBufferA]);
  useEffect(() => {
    setImageCode(rainForestImage);
  }, [rainForestImage]);

  const liveCode = useDebounced(code, 350);
  const liveBufferA = useDebounced(bufferACode, 600);
  const liveImage = useDebounced(imageCode, 600);

  const activeFullscreen = useMemo(
    () => fullscreenPresets.find((p) => p.id === fullscreenId)!,
    [fullscreenId],
  );
  const activeMaterial = useMemo(
    () => materialPresets.find((p) => p.id === materialId)!,
    [materialId],
  );

  const showRainControls =
    mode === "fullscreen" && activeFullscreen.kind === "multipass";

  const editorValue = showRainControls
    ? rainTab === "bufferA"
      ? bufferACode
      : imageCode
    : code;

  const setEditorValue = (next: string) => {
    if (showRainControls) {
      if (rainTab === "bufferA") setBufferACode(next);
      else setImageCode(next);
      return;
    }
    setCode(next);
  };

  const selectFullscreen = (id: string) => {
    const preset = fullscreenPresets.find((p) => p.id === id)!;
    setFullscreenId(id);
    setCode(preset.code);
    setError(null);
  };

  const selectMaterial = (id: string) => {
    const preset = materialPresets.find((p) => p.id === id)!;
    setMaterialId(id);
    setCode(preset.code);
    if (preset.silhouetteOutline) setMesh("cube");
    setError(null);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    if (next === "fullscreen") {
      setCode(activeFullscreen.code);
    } else {
      setCode(activeMaterial.code);
      if (activeMaterial.silhouetteOutline) setMesh("cube");
    }
    setError(null);
  };

  return (
    <main className="page page--dark">
      <p className="wc-back">
        <Link to="/work/ta">{t.shadersLab.back}</Link>
      </p>
      <header className="section-head">
        <p className="section-kicker">{t.shadersLab.kicker}</p>
        <h1>{t.shadersLab.title}</h1>
        <p>{t.shadersLab.lead}</p>
      </header>

      <div className="lab">
        <div className="lab__controls">
          <div className="pill-group" role="group" aria-label="Mode">
            <button
              className="pill"
              type="button"
              aria-pressed={mode === "fullscreen"}
              onClick={() => switchMode("fullscreen")}
            >
              Fullscreen
            </button>
            <button
              className="pill"
              type="button"
              aria-pressed={mode === "material"}
              onClick={() => switchMode("material")}
            >
              Material
            </button>
          </div>

          {mode === "fullscreen" ? (
            <div className="pill-group" role="group" aria-label="Fullscreen preset">
              {fullscreenPresets.map((preset) => (
                <button
                  key={preset.id}
                  className="pill"
                  type="button"
                  aria-pressed={fullscreenId === preset.id}
                  onClick={() => selectFullscreen(preset.id)}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="pill-group" role="group" aria-label="Material preset">
                {materialPresets.map((preset) => (
                  <button
                    key={preset.id}
                    className="pill"
                    type="button"
                    aria-pressed={materialId === preset.id}
                    onClick={() => selectMaterial(preset.id)}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
              <div className="pill-group" role="group" aria-label="Mesh">
                {(["sphere", "cube", "plane"] as MeshKind[]).map((kind) => (
                  <button
                    key={kind}
                    className="pill"
                    type="button"
                    aria-pressed={mesh === kind}
                    onClick={() => setMesh(kind)}
                  >
                    {kind[0].toUpperCase() + kind.slice(1)}
                  </button>
                ))}
              </div>
              <div className="pill-group" role="group" aria-label="Orbit">
                <button
                  className="pill"
                  type="button"
                  aria-pressed={autoRotate}
                  onClick={() => setAutoRotate((v) => !v)}
                >
                  Auto-rotate
                </button>
              </div>
            </>
          )}

          {showRainControls ? (
            <div className="pill-group" role="group" aria-label="Pass">
              <button
                className="pill"
                type="button"
                aria-pressed={rainTab === "bufferA"}
                onClick={() => setRainTab("bufferA")}
              >
                Buffer A
              </button>
              <button
                className="pill"
                type="button"
                aria-pressed={rainTab === "image"}
                onClick={() => setRainTab("image")}
              >
                Image
              </button>
            </div>
          ) : null}
        </div>

        {showRainControls ? <p className="lab__hint">{rainForestMeta.note}</p> : null}

        {error ? (
          <p className="lab__hint" style={{ color: "#ff8f7a" }}>
            Compile: {error}
          </p>
        ) : null}

        <div
          className={`lab__workspace ${showRainControls ? "lab__workspace--rain" : ""}`}
        >
          {showRainControls ? (
            <RainForestControls value={rainParams} onChange={setRainParams} />
          ) : null}

          <section className="lab__code">
            <div className="lab__code-head">
              {showRainControls
                ? `Rain Forest · ${rainTab === "bufferA" ? "Buffer A" : "Image"} · GLSL`
                : mode === "fullscreen"
                  ? `${activeFullscreen.title} · GLSL`
                  : `${activeMaterial.title} · ${activeMaterial.language}`}
            </div>
            <textarea
              value={editorValue}
              spellCheck={false}
              onChange={(e) => setEditorValue(e.target.value)}
            />
          </section>

          <section className="lab__viewport">
            {showRainControls ? (
              <RainForestCanvas
                bufferA={liveBufferA}
                image={liveImage}
                params={rainParams}
                onError={setError}
              />
            ) : mode === "fullscreen" ? (
              <FullscreenShaderCanvas code={liveCode} onError={setError} />
            ) : (
              <MaterialPreviewCanvas
                fragment={liveCode}
                mesh={mesh}
                autoRotate={autoRotate}
                silhouetteOutline={Boolean(activeMaterial.silhouetteOutline)}
                onError={setError}
              />
            )}
            <div className="lab__viewport-label">
              <span />
              <span>
                {mode === "fullscreen"
                  ? activeFullscreen.label
                  : `preview · ${mesh} · drag LMB to orbit`}
              </span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
