import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const base = "http://127.0.0.1:5173";

/** CSS viewport size of the presentation slot (≈16:9). Capture at 2× DPR. */
const VIEW_W = 1400;
const VIEW_H = 788;
const DPR = 2;

const shots = [
  { url: "/work/web", out: "frame-web-hub-2x.png", waitMs: 2500 },
  { url: "/work/web/launch", out: "frame-web-launch-2x.png", waitMs: 3500 },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: VIEW_W, height: VIEW_H },
  deviceScaleFactor: DPR,
  locale: "ru-RU",
});
await context.addInitScript(() => {
  try {
    localStorage.setItem("atlas-locale", "ru");
  } catch {}
});

const page = await context.newPage();

for (const shot of shots) {
  await page.goto(base + shot.url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(shot.waitMs);
  // Hide cursor / selection noise
  await page.addStyleTag({
    content: `* { caret-color: transparent !important; }`,
  });
  const out = path.join(outDir, shot.out);
  await page.screenshot({ path: out, type: "png", fullPage: false });
  console.log("saved", shot.out);
}

await browser.close();
console.log("done");
