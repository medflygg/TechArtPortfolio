import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import {
  asSmokeParams,
  defaultSmokeParams,
  SMOKE_SIM_REVISION,
  WebSmokeCanvas,
} from "../lab/WebSmokeCanvas";

/** Same resolved params Studio starts with — always mirrors smoke defaults. */
const homeSmokeParams = asSmokeParams(defaultSmokeParams);

export function HomePage() {
  const { t } = useI18n();
  const h = t.home;

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
          <div className="cta-row">
            <Link className="btn btn--accent" to="/work/web/launch">
              {h.ctaWeb}
            </Link>
            <Link className="btn btn--ghost" to="/lab/web">
              {h.ctaStudio}
            </Link>
          </div>
          <Link className="home-hero__secondary" to="/work/ta">
            {h.ctaTa}
          </Link>
        </div>
      </section>

      <section className="home-lanes">
        <Link to="/work/web/launch" className="home-lane home-lane--web home-lane--featured">
          <span className="home-lane__tag">{h.lane1Tag}</span>
          <h2>{h.lane1Title}</h2>
          <p>{h.lane1Body}</p>
          <span className="home-lane__go">{h.lane1Go}</span>
        </Link>
        <Link to="/lab/web" className="home-lane home-lane--lab">
          <span className="home-lane__tag">{h.lane2Tag}</span>
          <h2>{h.lane2Title}</h2>
          <p>{h.lane2Body}</p>
          <span className="home-lane__go">{h.lane2Go}</span>
        </Link>
        <Link to="/work/ta" className="home-lane">
          <span className="home-lane__tag">{h.lane3Tag}</span>
          <h2>{h.lane3Title}</h2>
          <p>{h.lane3Body}</p>
          <span className="home-lane__go">{h.lane3Go}</span>
        </Link>
      </section>
    </main>
  );
}
