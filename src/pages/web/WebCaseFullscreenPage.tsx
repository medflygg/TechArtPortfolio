import { Link, Navigate, useParams } from "react-router-dom";
import { getWebCase, getWebCategory } from "../../data/webCases";
import { useI18n } from "../../i18n/I18nProvider";
import { LivingSite } from "./living/LivingSites";

/** Edge-to-edge living site — no portfolio chrome / host nav. */
export function WebCaseFullscreenPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const { locale, t } = useI18n();
  const cat = category ? getWebCategory(category) : null;
  const meta = slug ? getWebCase(slug) : null;

  if (
    !cat ||
    !meta ||
    meta.category !== cat.id ||
    meta.kind === "carousel" ||
    meta.fullscreen === false
  ) {
    return <Navigate to="/work/web" replace />;
  }

  const listing = t.workWeb.cases[meta.id as keyof typeof t.workWeb.cases];
  if (!listing) {
    return <Navigate to={`/work/web/${cat.id}`} replace />;
  }

  return (
    <main className="live-fs" data-accent={meta.accent}>
      <Link
        className="live-fs__exit"
        to={`/work/web/${cat.id}/${meta.id}`}
        aria-label={t.workWeb.caseExitFullscreen}
      >
        <span aria-hidden>×</span>
      </Link>
      <div className="live-fs__stage">
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
