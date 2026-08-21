import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = `http://127.0.0.1:5173/work/web/launch/audi-rs5?qa=${Date.now()}`;
const out = resolve("docs/audi-rs5-qa/materials");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
const errors = [];
page.on("pageerror", (err) => errors.push(err.message));

await page.goto(base, { waitUntil: "networkidle", timeout: 90_000 });
await page.locator(".rs5-root").waitFor({ state: "visible" });
await page.locator(".rs5-load").waitFor({ state: "hidden", timeout: 90_000 });
await page.waitForTimeout(2200);

const root = page.locator(".rs5-root");
await root.screenshot({ path: resolve(out, "refcheck-hero-nardo.png") });

// Configurator chapter
await page.locator(".rs5-nav button").nth(5).click();
await page.waitForTimeout(1800);
// Paint row: nardo, mythos, turbo, sonoma, tangored, daytona, glacier
const paints = page.locator(".rs5-panel--config .rs5-row").first().locator(".rs5-swatch");
await paints.nth(4).click(); // tangored
await page.waitForTimeout(800);
await root.screenshot({ path: resolve(out, "refcheck-exterior-tangored.png") });

// 0–100
await page.locator(".rs5-nav button").nth(2).click();
await page.waitForTimeout(2400);
await root.screenshot({ path: resolve(out, "refcheck-accel-tangored.png") });

console.log(JSON.stringify({ out, errors }, null, 2));
await browser.close();
