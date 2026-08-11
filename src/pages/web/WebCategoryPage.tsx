import { Link, Navigate, useParams } from "react-router-dom";
import {
  casesForCategory,
  getWebCategory,
  type WebCategoryId,
} from "../../data/webCases";
import { getPortfolioCase } from "../../data/portfolioCases";
import { useI18n } from "../../i18n/I18nProvider";
import { LivingSiteThumb } from "./living/LivingSites";

export function WebCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { locale, t } = useI18n();
  const meta = category ? getWebCategory(category) : null;

  if (!meta) return <Navigate to="/work/web" replace />;

  const copy = t.workWeb.categories[meta.id];
  const cases = casesForCategory(meta.id as WebCategoryId);

  return (
    <main className="page page--dark">
      <p className="wc-back">
        <Link to="/work/web">{t.workWeb.back}</Link>
      </p>
      <header className="section-head">
        <p className="section-kicker">{copy.tags}</p>
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </header>
      <div className="work-grid">
        {cases.map((c) => {
          const caseCopy = t.workWeb.cases[c.id as keyof typeof t.workWeb.cases];
          if (!caseCopy) return null;

          const livingKey = c.livingId ?? c.id;
          const portfolio = c.portfolioId ? getPortfolioCase(c.portfolioId) : null;
          const coverImg =
            portfolio?.cover.startsWith("/") ? portfolio.cover : null;

          return (
            <Link
              key={c.id}
              className="work-card work-card--rich port-card"
              to={`/work/web/${meta.id}/${c.id}`}
            >
              <div className="work-card__thumb work-card__thumb--rich work-card__thumb--live port-card__thumb">
                {c.kind === "carousel" && coverImg ? (
                  <img className="port-card__img" src={coverImg} alt="" loading="lazy" />
                ) : (
                  <div className="work-card__live">
                    <LivingSiteThumb
                      caseId={livingKey}
                      accent={c.accent}
                      locale={locale}
                    />
                  </div>
                )}
              </div>
              <div className="work-card__meta">
                <h2>{caseCopy.title}</h2>
                <p>{caseCopy.tags}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
