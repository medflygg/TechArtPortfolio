import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";
import "./index.css";

/** Vite BASE_URL always ends with `/`; React Router basename must not. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
);
