import { type CSSProperties, type ReactNode } from "react";
import { kilnArtPhotos } from "../pages/web/living/kilnArtPhotos";
import { mochalkiPhotos } from "../pages/web/living/mochalkiPhotos";

type VisualProps = {
  title: string;
};

function BrowserChrome({ children, url }: { children: ReactNode; url: string }) {
  return (
    <div className="mock-browser">
      <div className="mock-browser__bar">
        <span className="mock-browser__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="mock-browser__url">{url}</span>
      </div>
      <div className="mock-browser__body">{children}</div>
    </div>
  );
}

export function ShaderStudioVisual({ title }: VisualProps) {
  return (
    <div className="work-visual work-visual--shader">
      <BrowserChrome url="studio.atlas / shader">
        <div className="mock-shader">
          <aside className="mock-shader__rail">
            <span className="mock-shader__chip is-active">Smoke</span>
            <span className="mock-shader__chip">Holo</span>
            <span className="mock-shader__chip">Liquid</span>
            <span className="mock-shader__chip">Fluted</span>
          </aside>
          <div className="mock-shader__stage">
            <div className="mock-shader__fx" />
            <div className="mock-shader__cursor" />
            <div className="mock-shader__hud">
              <strong>{title}</strong>
              <em>live · WebGL</em>
            </div>
          </div>
          <aside className="mock-shader__panel">
            <div className="mock-shader__row">
              <span>Density</span>
              <b style={{ "--w": "72%" } as CSSProperties} />
            </div>
            <div className="mock-shader__row">
              <span>Curl</span>
              <b style={{ "--w": "48%" } as CSSProperties} />
            </div>
            <div className="mock-shader__row">
              <span>Fade</span>
              <b style={{ "--w": "61%" } as CSSProperties} />
            </div>
            <div className="mock-shader__swatches">
              <i style={{ background: "#7ebee9" }} />
              <i style={{ background: "#3d6fa8" }} />
              <i style={{ background: "#c6f24d" }} />
            </div>
          </aside>
        </div>
      </BrowserChrome>
    </div>
  );
}

export function HoloUiVisual({ title }: VisualProps) {
  return (
    <div className="work-visual work-visual--holo">
      <BrowserChrome url="atlas.studio / surfaces">
        <div className="mock-holo">
          <header className="mock-holo__nav">
            <span>ATLAS</span>
            <nav>
              <em>Product</em>
              <em>Surfaces</em>
              <em>Lab</em>
            </nav>
          </header>
          <div className="mock-holo__grid">
            <article className="mock-holo__card mock-holo__card--hero">
              <div className="mock-holo__sheen" />
              <p>Fluted glass</p>
              <h3>{title}</h3>
              <button type="button" tabIndex={-1}>
                Explore
              </button>
            </article>
            <article className="mock-holo__card">
              <div className="mock-holo__sheen" />
              <span>Button</span>
              <strong>Holo CTA</strong>
            </article>
            <article className="mock-holo__card">
              <div className="mock-holo__sheen" />
              <span>Panel</span>
              <strong>Iridescent</strong>
            </article>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
}

export function LaunchSitesVisual({ title }: VisualProps) {
  const tiles = [
    {
      src: null,
      tone: "vesper" as const,
      label: "Cabaret",
      url: "vesper.house",
    },
    {
      src: mochalkiPhotos.hero,
      tone: "photo" as const,
      label: "Shop",
      url: "supracor.shop",
    },
    {
      src: kilnArtPhotos.forge,
      tone: "photo" as const,
      label: "Atelier",
      url: "kiln.atelier",
    },
  ];

  return (
    <div className="work-visual work-visual--sites">
      <div className="mock-sites">
        <div className="mock-sites__head">
          <span className="mock-sites__kicker">Multi-page · live</span>
          <strong>{title}</strong>
          <em>Cabaret · Ecommerce · Atelier</em>
        </div>
        <div className="mock-sites__grid">
          {tiles.map((tile, i) => (
            <article
              key={tile.url}
              className={`mock-sites__tile mock-sites__tile--${i + 1}`}
            >
              <div className="mock-sites__chrome">
                <span aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <em>{tile.url}</em>
              </div>
              <div className={`mock-sites__shot${tile.tone === "vesper" ? " mock-sites__shot--vesper" : ""}`}>
                {tile.src ? <img src={tile.src} alt="" loading="lazy" /> : <span>VESPER</span>}
              </div>
              <span className="mock-sites__tag">{tile.label}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
