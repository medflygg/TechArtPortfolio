import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

const capKeys = ["01", "02", "03", "04"] as const;

export function ContactPage() {
  const { t } = useI18n();
  const c = t.contact;

  return (
    <main className="page page--dark">
      <div className="pipeline pipeline--dark">
        <div className="pipeline__intro">
          <p className="section-kicker">{c.kicker}</p>
          <h1 className="pipeline__name">{c.name}</h1>
          <p className="pipeline__role">{c.role}</p>
          <p className="pipeline__tagline">{c.title}</p>
          <p>{c.lead}</p>
          <ul className="pipeline__contacts">
            <li>
              <span>{c.emailLabel}</span>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </li>
            <li>
              <span>{c.telegramLabel}</span>
              <a href={c.telegramUrl} target="_blank" rel="noreferrer">
                {c.telegram}
              </a>
            </li>
          </ul>
          <div className="cta-row" style={{ marginTop: 28 }}>
            <Link className="btn btn--accent" to="/lab/web">
              {c.ctaStudio}
            </Link>
            <Link className="btn btn--ghost" to="/lab/shaders">
              {c.ctaShaders}
            </Link>
          </div>
        </div>
        <ol className="pipeline__list pipeline__list--dark">
          {capKeys.map((n) => (
            <li key={n}>
              <span>{n}</span>
              <div>
                <strong>{c.caps[n].title}</strong>
                <p>{c.caps[n].body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
