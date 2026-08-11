import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { webCategories } from "../data/webCases";
import { useI18n } from "../i18n/I18nProvider";
import {
  HoloUiVisual,
  LaunchSitesVisual,
  ShaderStudioVisual,
} from "../components/WorkWebVisuals";

const visuals = {
  "holo-ui": HoloUiVisual,
  "launch-sites": LaunchSitesVisual,
} as const;

export function WorkWebPage() {
  const { t } = useI18n();
  const w = t.workWeb;

  const onCardMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const stage = e.currentTarget.querySelector<HTMLElement>(".mock-shader__stage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    stage.style.setProperty("--mx", `${x}%`);
    stage.style.setProperty("--my", `${y}%`);
  };

  return (
    <main className="page page--dark">
      <header className="section-head section-head--split">
        <div>
          <p className="section-kicker">{w.kicker}</p>
          <h1>{w.title}</h1>
          <p>{w.lead}</p>
        </div>
        <div className="section-switch">
          <Link to="/work/web" aria-current="page">
            {t.nav.web}
          </Link>
          <Link to="/work/ta">{t.nav.ta}</Link>
        </div>
      </header>

      <div className="work-grid">
        <Link
          className="work-card work-card--rich"
          to="/lab/web"
          onMouseMove={onCardMove}
        >
          <div className="work-card__thumb work-card__thumb--rich" aria-hidden>
            <ShaderStudioVisual title={w.studio.title} />
          </div>
          <div className="work-card__meta">
            <h2>{w.studio.title}</h2>
            <p>{w.studio.tags}</p>
          </div>
        </Link>

        {webCategories.map((cat) => {
          const copy = w.categories[cat.id];
          const Visual = visuals[cat.visual];
          return (
            <Link
              key={cat.id}
              className={`work-card work-card--rich${cat.id === "launch" ? " work-card--sites" : ""}`}
              to={`/work/web/${cat.id}`}
            >
              <div className="work-card__thumb work-card__thumb--rich" aria-hidden>
                <Visual title={copy.title} />
              </div>
              <div className="work-card__meta">
                <h2>{copy.title}</h2>
                <p>{copy.tags}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
