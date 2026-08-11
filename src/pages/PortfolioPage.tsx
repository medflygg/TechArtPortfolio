import { Link, Navigate, useParams } from "react-router-dom";
import { CaseCarousel } from "../components/portfolio/CaseCarousel";
import { getPortfolioCase, portfolioCases } from "../data/portfolioCases";
import { useI18n } from "../i18n/I18nProvider";
import { LivingSite, LivingSiteThumb } from "./web/living/LivingSites";

export function PortfolioPage() {
  const { locale, t } = useI18n();
  const p = t.portfolio;

  return (
    <main className="page page--dark">
      <header className="section-head">
        <p className="section-kicker">{p.kicker}</p>
        <h1>{p.title}</h1>
        <p>{p.lead}</p>
      </header>
      <div className="work-grid port-grid">
        {portfolioCases.map((c) => {
          const copy = p.cases[c.id as keyof typeof p.cases];
          if (!copy) return null;
          return (
            <Link
              key={c.id}
              className="work-card work-card--rich port-card"
              to={`/portfolio/${c.id}`}
            >
              <div className="work-card__thumb work-card__thumb--rich port-card__thumb">
                {c.cover.startsWith("/") ? (
                  <img
                    className="port-card__img"
                    src={c.cover}
                    alt=""
                    loading="lazy"
                  />
                ) : c.view === "living" && c.livingId ? (
                  <div className="work-card__live">
                    <LivingSiteThumb
                      caseId={c.livingId}
                      accent={c.accent}
                      locale={locale}
                    />
                  </div>
                ) : null}
              </div>
              <div className="work-card__meta">
                <p className="work-card__cat">{copy.audience}</p>
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

export function PortfolioCasePage() {
  const { id } = useParams<{ id: string }>();
  const { locale, t } = useI18n();
  const p = t.portfolio;

  if (id === "saitik") return <Navigate to="/portfolio/yy-portfolio" replace />;
  if (id === "toybox") return <Navigate to="/portfolio/kiln-identity" replace />;

  const meta = id ? getPortfolioCase(id) : null;

  if (!meta) return <Navigate to="/portfolio" replace />;

  const copy = p.cases[meta.id as keyof typeof p.cases];
  if (!copy) return <Navigate to="/portfolio" replace />;

  return (
    <main className="page page--dark site-case">
      <p className="wc-back">
        <Link to="/portfolio">{p.back}</Link>
      </p>
      <header className="site-case__head">
        <p className="section-kicker">{copy.audience}</p>
        <h1>{copy.title}</h1>
        <p className="site-case__hint">{copy.lead}</p>
      </header>

      {meta.view === "carousel" && meta.slides ? (
        <CaseCarousel
          slides={meta.slides}
          accent={meta.accent}
          title={copy.title}
        />
      ) : (
        <div className="site-case__frame site-case__frame--tall">
          <LivingSite
            caseId={meta.livingId ?? meta.id}
            accent={meta.accent}
            locale={locale}
            mode="full"
          />
        </div>
      )}
    </main>
  );
}
