import { useEffect, useId, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

export function Nav() {
  const { pathname } = useLocation();
  const { locale, setLocale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const links = [
    { to: "/work/web", label: t.nav.web, match: "/work/web" },
    { to: "/lab/web", label: t.nav.studio, match: "/lab/web" },
    { to: "/work/ta", label: t.nav.ta, match: "/work/ta" },
    { to: "/lab/shaders", label: t.nav.shaders, match: "/lab/shaders" },
    { to: "/contact", label: t.nav.contact, match: "/contact" },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className={`nav nav--dark${menuOpen ? " nav--open" : ""}`}>
      <NavLink to="/" className="nav__brand" onClick={() => setMenuOpen(false)}>
        ATLAS
      </NavLink>

      <button
        type="button"
        className="nav__burger"
        aria-expanded={menuOpen}
        aria-controls={menuId}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className="nav__scrim"
        hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <div id={menuId} className="nav__panel">
        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                aria-current={
                  pathname.startsWith(link.match) ? "page" : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="lang-switch" role="group" aria-label="Language">
          <button
            type="button"
            className="lang-switch__btn"
            aria-pressed={locale === "en"}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
          <button
            type="button"
            className="lang-switch__btn"
            aria-pressed={locale === "ru"}
            onClick={() => setLocale("ru")}
          >
            RU
          </button>
        </div>
      </div>
    </header>
  );
}
