import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { useI18n } from "../i18n/I18nProvider";
import {
  HoloUiVisual,
  LaunchSitesVisual,
  ShaderStudioVisual,
} from "../components/WorkWebVisuals";

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

  const launch = w.categories.launch;
  const holo = w.categories.holo;

  return (
    <main className="page page--dark">
      <p className="wc-back">
        <Link to="/">{t.nav.backHome}</Link>
      </p>
      <header className="section-head section-head--split">
        <div>
          <p className="section-kicker">{w.kicker}</p>
          <h1>{w.title}</h1>
          <p>{w.lead}</p>
        </div>
        <div className="section-switch">
          <Link to="/work/web" aria-current="page">
            {t.nav.work}
          </Link>
          <Link to="/work/ta">{t.nav.ta}</Link>
        </div>
      </header>

      <div className="work-grid">
        <Link
          className="work-card work-card--rich work-card--sites"
          to="/work/web/launch"
        >
          <div className="work-card__thumb work-card__thumb--rich" aria-hidden>
            <LaunchSitesVisual title={launch.title} />
          </div>
          <div className="work-card__meta">
            <h2>{launch.title}</h2>
            <p>{launch.tags}</p>
          </div>
        </Link>

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

        <Link className="work-card work-card--rich" to="/work/web/holo">
          <div className="work-card__thumb work-card__thumb--rich" aria-hidden>
            <HoloUiVisual title={holo.title} />
          </div>
          <div className="work-card__meta">
            <h2>{holo.title}</h2>
            <p>{holo.tags}</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
