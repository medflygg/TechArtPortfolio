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

  if (!listing) {
    return <Navigate to={`/work/web/${cat.id}`} replace />;
  }

  const portfolio =
    meta.kind === "carousel" && meta.portfolioId
      ? getPortfolioCase(meta.portfolioId)
      : null;

  return (
    <main className="page page--dark site-case">
      <p className="wc-back">
        <Link to={`/work/web/${cat.id}`}>{catCopy.back}</Link>
      </p>
      <header className="site-case__head">
        <p className="section-kicker">{listing.tags}</p>
        <h1>{listing.title}</h1>
        <p className="site-case__hint">
          {meta.kind === "carousel"
            ? locale === "ru"
              ? "Листайте экраны — многостраничный кейс из реального макета."
              : "Browse screens — a multi-page case from a real design file."
            : locale === "ru"
              ? "Кликайте разделы внутри макета — у сайта несколько страниц и живой интерактив."
              : "Click sections inside the mock — each site has multiple pages and live interaction."}
        </p>
      </header>

      {meta.kind === "carousel" && portfolio?.slides ? (
        <CaseCarousel
          slides={portfolio.slides}
          accent={meta.accent}
          title={listing.title}
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
