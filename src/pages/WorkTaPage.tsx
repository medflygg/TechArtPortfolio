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
      <header className="section-head section-head--split">
        <div>
          <p className="section-kicker">{w.kicker}</p>
          <h1>{w.title}</h1>
          <p>{w.lead}</p>
        </div>
        <div className="section-switch">
          <Link to="/work/web">{t.nav.web}</Link>
          <Link to="/work/ta" aria-current="page">
            {t.nav.ta}
          </Link>
        </div>
      </header>
      <div className="work-grid">
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
