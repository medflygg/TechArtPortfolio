import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { ShaderStudioVisual } from "../components/WorkWebVisuals";
import { LivingSiteThumb } from "./web/living/LivingSites";
import {
  asSmokeParams,
  defaultSmokeParams,
  SMOKE_SIM_REVISION,
  WebSmokeCanvas,
} from "../lab/WebSmokeCanvas";

/** Same resolved params Studio starts with — always mirrors smoke defaults. */
const homeSmokeParams = asSmokeParams(defaultSmokeParams);

const FEATURED = [
  {
    key: "vesper" as const,
    to: "/work/web/launch/vesper",
    kind: "living" as const,
    livingId: "vesper",
    accent: "#c9a36a",
  },
  {
    key: "kiln" as const,
    to: "/work/web/launch/kiln-site",
    kind: "living" as const,
    livingId: "kiln-identity",
    accent: "#e8c07a",
  },
  {
    key: "mochalki" as const,
    to: "/work/web/launch/mochalki",
    kind: "living" as const,
    livingId: "mochalki",
    accent: "#b8955a",
  },
  {
    key: "studio" as const,
    to: "/lab/web",
    kind: "studio" as const,
  },
];

export function HomePage() {
  const { locale, t } = useI18n();
  const h = t.home;

  const onStudioMove = (e: MouseEvent<HTMLAnchorElement>) => {
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
    <main className="page page--dark home">
      <section className="home-hero">
        <div className="home-hero__fx" aria-hidden>
          <WebSmokeCanvas
            key={`home-smoke-${SMOKE_SIM_REVISION}`}
            params={homeSmokeParams}
          />
        </div>
        <div className="home-hero__veil" aria-hidden />
        <div className="home-hero__content">
          <p className="home-hero__kicker">{h.kicker}</p>
          <h1 className="home-hero__brand">ATLAS</h1>
          <p className="home-hero__lead">{h.lead}</p>
          <p className="home-hero__aside">{h.leadSecondary}</p>
          <p className="home-hero__aside home-hero__aside--ops">{h.leadOps}</p>
          <div className="cta-row">
            <Link className="btn btn--accent" to="/work/web/launch">
              {h.ctaWork}
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              {h.ctaContact}
            </Link>
          </div>
          <Link className="home-hero__secondary" to="/work/ta">
            {h.ctaTa}
          </Link>
        </div>
      </section>

      <section className="home-proof">
        <header className="home-proof__head">
          <p className="section-kicker">{h.proofKicker}</p>
          <h2>{h.proofTitle}</h2>
          <p>{h.proofLead}</p>
        </header>

        <div className="home-proof__grid">
          {FEATURED.map((item) => {
            const copy = h.featured[item.key];

            if (item.kind === "studio") {
              return (
                <Link
                  key={item.key}
                  className="home-proof__card home-proof__card--studio"
                  to={item.to}
                  onMouseMove={onStudioMove}
                >
                  <div className="home-proof__media" aria-hidden>
                    <ShaderStudioVisual title={copy.title} />
                  </div>
                  <div className="home-proof__meta">
                    <span>{copy.tag}</span>
                    <h3>{copy.title}</h3>
                    <p>{copy.body}</p>
                  </div>
                </Link>
              );
            }

            if (item.kind === "living") {
              return (
                <Link
                  key={item.key}
                  className="home-proof__card home-proof__card--live"
                  to={item.to}
                >
                  <div className="home-proof__media home-proof__media--live" aria-hidden>
                    <div className="work-card__live">
                      <LivingSiteThumb
                        caseId={item.livingId}
                        accent={item.accent}
                        locale={locale}
                      />
                    </div>
                  </div>
                  <div className="home-proof__meta">
                    <span>{copy.tag}</span>
                    <h3>{copy.title}</h3>
                    <p>{copy.body}</p>
                  </div>
                </Link>
              );
            }

            return null;
          })}
        </div>

        <Link className="home-proof__all" to="/work/web">
          {h.proofAll}
        </Link>
      </section>

      <section className="home-close">
        <div className="home-close__inner">
          <h2>{h.closeTitle}</h2>
          <p>{h.closeLead}</p>
          <a
            className="btn btn--accent"
            href={t.contact.telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            {h.closeCta}
          </a>
        </div>
      </section>
    </main>
  );
}
