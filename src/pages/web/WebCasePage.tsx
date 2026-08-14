import { Link, Navigate, useParams } from "react-router-dom";
import { CaseCarousel } from "../../components/portfolio/CaseCarousel";
import { getPortfolioCase } from "../../data/portfolioCases";
import { getWebCase, getWebCategory } from "../../data/webCases";
import { useI18n } from "../../i18n/I18nProvider";
import { LivingSite } from "./living/LivingSites";

export function WebCasePage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const { locale, t } = useI18n();
  const cat = category ? getWebCategory(category) : null;
  const meta = slug ? getWebCase(slug) : null;

  if (!cat || !meta || meta.category !== cat.id) {
    return <Navigate to="/work/web" replace />;
  }

  const listing = t.workWeb.cases[meta.id as keyof typeof t.workWeb.cases];
  const catCopy = t.workWeb.categories[cat.id];
  const w = t.workWeb;

  if (!listing) {
    return <Navigate to={`/work/web/${cat.id}`} replace />;
  }

  const portfolio =
    meta.kind === "carousel" && meta.portfolioId
      ? getPortfolioCase(meta.portfolioId)
      : null;

  const isLiving = !(meta.kind === "carousel" && portfolio?.slides);

  if (isLiving) {
    return (
      <main className="page page--dark site-case site-case--live">
        <div className="site-case__bar">
          <div className="site-case__bar-main">
            <Link className="site-case__bar-back" to={`/work/web/${cat.id}`}>
              {catCopy.back}
            </Link>
            <div className="site-case__bar-meta">
              <h1>{listing.title}</h1>
              <p className="site-case__role site-case__bar-role">{w.caseRole}</p>
            </div>
          </div>
          <Link className="btn btn--accent site-case__bar-cta" to="/contact">
            {w.caseCta}
          </Link>
        </div>

        <div className="site-case__frame site-case__frame--viewport">
          <LivingSite
            caseId={meta.livingId ?? meta.id}
            accent={meta.accent}
            locale={locale}
            mode="full"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="page page--dark site-case">
      <p className="wc-back">
        <Link to={`/work/web/${cat.id}`}>{catCopy.back}</Link>
      </p>
      <header className="site-case__head">
        <p className="section-kicker">{listing.tags}</p>
        <h1>{listing.title}</h1>
        <p className="site-case__role">{w.caseRole}</p>
        <p className="site-case__hint">{w.caseHintCarousel}</p>
      </header>

      <CaseCarousel
        slides={portfolio!.slides!}
        accent={meta.accent}
        title={listing.title}
      />

      <aside className="site-case__cta">
        <div>
          <h2>{w.caseCtaTitle}</h2>
          <p>{w.caseCtaBody}</p>
        </div>
        <Link className="btn btn--accent" to="/contact">
          {w.caseCta}
        </Link>
      </aside>
    </main>
  );
}
