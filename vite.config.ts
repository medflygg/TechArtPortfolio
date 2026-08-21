import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Project Pages: https://<user>.github.io/<repo>/
 * Override locally: VITE_BASE_PATH=/ta-portfolio/ npm run build
 */
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base =
  process.env.VITE_BASE_PATH ??
  (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : "/");

export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: "spa-github-pages-404",
      closeBundle() {
        const indexHtml = resolve(process.cwd(), "dist/index.html");
        const notFoundHtml = resolve(process.cwd(), "dist/404.html");
        copyFileSync(indexHtml, notFoundHtml);
      },
    },
  ],
  server: {
    watch: {
      // Large binaries and generated QA captures can EBUSY the Windows FS watcher
      ignored: [
        "**/public/portfolio/**/*.glb",
        "**/public/portfolio/**/*.hdr",
        "**/public/portfolio/**/*.jpg",
        "**/docs/audi-rs5-qa/**",
      ],
    },
  },
});
