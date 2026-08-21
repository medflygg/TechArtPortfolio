import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { ScrollToTop } from "./components/ScrollToTop";
import { CasePage } from "./pages/CasePage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ShadersPage } from "./pages/ShadersPage";
import { WebShadersPage } from "./pages/WebShadersPage";
import { WorkTaPage } from "./pages/WorkTaPage";
import { WorkWebPage } from "./pages/WorkWebPage";
import { WebCaseFullscreenPage } from "./pages/web/WebCaseFullscreenPage";
import { WebCasePage } from "./pages/web/WebCasePage";
import { WebCategoryPage } from "./pages/web/WebCategoryPage";
import "./App.css";

export default function App() {
  const { pathname } = useLocation();
  const hideHostNav = /\/work\/web\/[^/]+\/[^/]+\/full\/?$/.test(pathname);

  return (
    <div className={`app-shell${hideHostNav ? " app-shell--live-fs" : ""}`}>
      <ScrollToTop />
      {!hideHostNav && <Nav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<Navigate to="/work/web" replace />} />
        <Route path="/work/ta" element={<WorkTaPage />} />
        <Route path="/work/web" element={<WorkWebPage />} />
        <Route path="/work/web/brand" element={<Navigate to="/work/web/launch" replace />} />
        <Route path="/work/web/brand/:slug" element={<Navigate to="/work/web/launch" replace />} />
        <Route path="/work/web/:category/:slug/full" element={<WebCaseFullscreenPage />} />
        <Route path="/work/web/:category/:slug" element={<WebCasePage />} />
        <Route path="/work/web/:category" element={<WebCategoryPage />} />
        <Route path="/work/mass-npc" element={<CasePage />} />
        <Route path="/lab/shaders" element={<ShadersPage />} />
        <Route path="/lab/web" element={<WebShadersPage />} />
        <Route path="/portfolio" element={<Navigate to="/work/web/launch" replace />} />
        <Route path="/portfolio/:id" element={<Navigate to="/work/web/launch" replace />} />
        <Route path="/shaders" element={<Navigate to="/lab/shaders" replace />} />
        <Route path="/pipeline" element={<Navigate to="/contact" replace />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
