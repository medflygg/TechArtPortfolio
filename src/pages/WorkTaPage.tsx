import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

const taProjects = [
  {
    slug: "mass-npc" as const,
    tone: "linear-gradient(135deg, #2a3d32, #121816)",
    to: "/work/mass-npc",
  },
  {
    slug: "scopes" as const,
    tone: "linear-gradient(135deg, #3a3428, #161410)",
    to: "/lab/shaders",
  },
  {
    slug: "fake-lights" as const,
    tone: "linear-gradient(135deg, #2c3340, #12151c)",
    to: "/lab/shaders",
  },
  {
    slug: "lbe-pipeline" as const,
    tone: "linear-gradient(135deg, #24382c, #101612)",
    to: "/contact",
  },
];

export function WorkTaPage() {
  const { t } = useI18n();
  const w = t.workTa;

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
          <Link to="/work/web">{t.nav.work}</Link>
          <Link to="/work/ta" aria-current="page">
            {t.nav.ta}
          </Link>
          <Link to="/lab/shaders">{t.nav.shaders}</Link>
        </div>
      </header>
      <div className="work-grid">
        <Link className="work-card work-card--rich" to="/lab/shaders">
          <div className="work-card__thumb work-card__thumb--rich work-card__thumb--ta-lab" aria-hidden>
            <div className="ta-lab-visual">
              <div className="ta-lab-visual__glow" />
              <div className="ta-lab-visual__grid" />
              <div className="ta-lab-visual__copy">
                <strong>{w.lab.title}</strong>
                <em>GLSL · live</em>
              </div>
            </div>
          </div>
          <div className="work-card__meta">
            <h2>{w.lab.title}</h2>
            <p>{w.lab.tags}</p>
          </div>
        </Link>

        {taProjects.map((project) => {
          const copy = w.projects[project.slug];
          return (
            <Link key={project.slug} className="work-card" to={project.to}>
              <div
                className="work-card__thumb"
                style={{ background: project.tone }}
              />
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
