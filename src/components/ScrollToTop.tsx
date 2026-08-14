import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reset window scroll on every route change (SPA default keeps previous position). */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
