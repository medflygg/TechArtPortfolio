import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";

export function Nav() {
  const { pathname } = useLocation();
  const { locale, setLocale, t } = useI18n();

  const links = [
    { to: "/work/web", label: t.nav.web, match: "/work/web" },
    { to: "/lab/web", label: t.nav.studio, match: "/lab/web" },
    { to: "/work/ta", label: t.nav.ta, match: "/work/ta" },
    { to: "/lab/shaders", label: t.nav.shaders, match: "/lab/shaders" },
    { to: "/contact", label: t.nav.contact, match: "/contact" },
  ];

  return (
    <header className="nav nav--dark">
      <NavLink to="/" className="nav__brand">
        ATLAS
      </NavLink>
      <div className="nav__end">
        <ul className="nav__links">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                aria-current={
                  pathname.startsWith(link.match) ? "page" : undefined
                }
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
