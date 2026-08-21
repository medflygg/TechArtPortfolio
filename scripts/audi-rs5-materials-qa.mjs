import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = `http://127.0.0.1:5173/work/web/launch/audi-rs5?qa=${Date.now()}`;
const out = resolve("docs/audi-rs5-qa/materials");
await mkdir(out, { recursive: true });

const paints = ["nardo", "mythos", "turbo", "tangored", "daytona", "glacier"];

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1.5 });
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.goto(base, { waitUntil: "networkidle", timeout: 90_000 });
await page.locator(".rs5-root").waitFor({ state: "visible" });
await page.locator(".rs5-load").waitFor({ state: "hidden", timeout: 90_000 });

// Exterior chapter
await page.locator(".rs5-nav button").nth(1).click();
await page.waitForTimeout(2200);

const root = page.locator(".rs5-root");
const swatches = page.locator(".rs5-panel--config .rs5-swatch");

for (let i = 0; i < paints.length; i += 1) {
  await swatches.nth(i).click();
  await page.waitForTimeout(700);
  await root.screenshot({ path: resolve(out, `paint-${paints[i]}.png`) });
}

// Glacier close-up — flake grain check (center body panel)
await swatches.nth(5).click(); // glacier
await page.waitForTimeout(600);
await root.screenshot({
  path: resolve(out, `flake-closeup-glacier.png`),
  clip: { x: 520, y: 360, width: 420, height: 280 },
});

// Nardo overview — glass / rubber / nature IBL
await swatches.nth(0).click();
await page.waitForTimeout(500);
await root.screenshot({ path: resolve(out, `body-nardo-overview.png`) });

// Hero for silhouette + nature reflections
await page.locator(".rs5-nav button").nth(0).click();
await page.waitForTimeout(2000);
await root.screenshot({ path: resolve(out, `hero-void-pbr.png`) });

// Cabin
await page.locator(".rs5-nav button").nth(5).click();
await page.waitForTimeout(1800);
await root.screenshot({ path: resolve(out, `cabin-interior.png`) });
await page.locator(".rs5-camera-rail button").nth(2).click();
await page.waitForTimeout(1000);
await root.screenshot({ path: resolve(out, `cabin-seats.png`) });

console.log(JSON.stringify({ out, paints: paints.length, errors }, null, 2));
await browser.close();
