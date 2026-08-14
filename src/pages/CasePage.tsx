import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

export function CasePage() {
  const { t } = useI18n();
  const c = t.caseMassNpc;

  return (
    <main className="page page--dark">
      <p className="wc-back">
        <Link to="/work/ta">{c.back}</Link>
      </p>
      <section className="case-hero">
        <div>
          <p className="case-hero__kicker">{c.kicker}</p>
          <h1>{c.title}</h1>
        </div>
      </section>
      <div className="case-body">
        <div className="case-block">
          <h2>{c.problemTitle}</h2>
          <p>{c.problem}</p>
        </div>
        <div className="case-block">
          <h2>{c.approachTitle}</h2>
          <p>{c.approach}</p>
        </div>
        <div className="case-compare">
          <figure>
            <div className="case-compare__shot" />
            <figcaption>{c.before}</figcaption>
          </figure>
          <figure>
            <div
              className="case-compare__shot"
              style={{
                background: "linear-gradient(135deg, #44553a, #1a2216)",
              }}
            />
            <figcaption>{c.after}</figcaption>
          </figure>
        </div>
        <div className="case-block">
          <h2>{c.resultTitle}</h2>
          <p>{c.result}</p>
        </div>
        <div className="tags">
          <span className="tag">C++</span>
          <span className="tag">Vertex</span>
          <span className="tag">Mobile Forward</span>
          <span className="tag">Profiling</span>
          <span className="tag">VR</span>
        </div>
      </div>
    </main>
  );
}
