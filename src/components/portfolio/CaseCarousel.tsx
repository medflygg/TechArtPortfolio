import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { PortfolioMock } from "./PortfolioMocks";

export type Slide =
  | { kind: "image"; src: string; label: string }
  | { kind: "mock"; mock: string; label: string };

type CaseCarouselProps = {
  slides: Slide[];
  accent: string;
  title: string;
};

export function CaseCarousel({ slides, accent, title }: CaseCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const safeIndex = total === 0 ? 0 : ((index % total) + total) % total;
  const current = total > 0 ? slides[safeIndex] : null;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (total === 0) return;
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current || total === 0) return null;

  return (
    <div className="pcar" style={{ "--pcar-accent": accent } as CSSProperties}>
      <style>{PCAR_CSS}</style>
      <div className="pcar-top">
        <p className="pcar-title">{title}</p>
        <p className="pcar-counter" aria-live="polite">
          {safeIndex + 1} / {total}
        </p>
      </div>

      <div className="pcar-stage">
        <button
          type="button"
          className="pcar-nav pcar-nav--prev"
          onClick={() => go(-1)}
          aria-label="Previous slide"
        >
          ‹
        </button>

        <div className="pcar-frame" key={`${current.kind}-${safeIndex}`}>
          {current.kind === "image" ? (
            <img
              className="pcar-img"
              src={current.src}
              alt={current.label}
            />
          ) : (
            <div className="pcar-mock-wrap">
              <PortfolioMock id={current.mock} />
            </div>
          )}
        </div>

        <button
          type="button"
          className="pcar-nav pcar-nav--next"
          onClick={() => go(1)}
          aria-label="Next slide"
        >
          ›
        </button>
      </div>

      <div className="pcar-tabs" role="tablist" aria-label={`${title} slides`}>
        {slides.map((slide, i) => (
          <button
            key={`${slide.label}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            className={`pcar-tab${i === safeIndex ? " is-active" : ""}`}
            onClick={() => setIndex(i)}
          >
            <span className="pcar-tab-dot" />
            <span className="pcar-tab-label">{slide.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const PCAR_CSS = `
.pcar {
  --pcar-accent: #2563eb;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 64px;
  font-family: var(--font-body, "Sora", system-ui, sans-serif);
  color: var(--paper, #f2ede4);
}
.pcar-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.pcar-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--paper, #f2ede4);
}
.pcar-counter {
  margin: 0;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  color: var(--mute, #9a9488);
}
.pcar-stage {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: stretch;
  gap: 8px;
}
.pcar-nav {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: var(--paper, #f2ede4);
  border-radius: 8px;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.pcar-nav:hover {
  border-color: var(--pcar-accent);
  color: var(--pcar-accent);
  background: color-mix(in srgb, var(--pcar-accent) 16%, transparent);
}
.pcar-frame {
  position: relative;
  overflow: auto;
  max-height: 78vh;
  background: #f4f4f4;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  animation: pcar-fade 0.28s ease;
}
.pcar-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: none;
  object-fit: contain;
  background: #f4f4f4;
}
.pcar-mock-wrap {
  width: 100%;
  min-height: 320px;
  background: #fff;
}
@keyframes pcar-fade {
  from { opacity: 0.35; transform: translateY(4px); }
  to { opacity: 1; transform: none; }
}
.pcar-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
  justify-content: center;
}
.pcar-tab {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.04);
  border-radius: 999px;
  font-size: 0.72rem;
  color: var(--mute, #9a9488);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}
.pcar-tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #555;
}
.pcar-tab.is-active {
  border-color: var(--pcar-accent);
  color: var(--paper, #f2ede4);
  background: color-mix(in srgb, var(--pcar-accent) 18%, transparent);
}
.pcar-tab.is-active .pcar-tab-dot {
  background: var(--pcar-accent);
}
@media (max-width: 640px) {
  .pcar-stage {
    grid-template-columns: 32px 1fr 32px;
    gap: 4px;
  }
  .pcar-tab-label {
    display: none;
  }
  .pcar-tab {
    padding: 8px;
  }
}
`;
