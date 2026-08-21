import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = "http://127.0.0.1:5173/work/web/launch/audi-rs5";
const out = resolve("docs/audi-rs5-qa");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
const checks = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") errors.push(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));

await page.goto(base, { waitUntil: "networkidle", timeout: 60_000 });
await page.locator(".rs5-root").waitFor({ state: "visible" });
await page.locator(".rs5-load").waitFor({ state: "hidden", timeout: 60_000 });

const root = page.locator(".rs5-root");
const nav = page.locator(".rs5-nav button");
const names = ["hero", "exterior", "acceleration", "quattro", "dynamics", "cabin"];

for (let i = 0; i < names.length; i += 1) {
  if (i > 0) {
    await nav.nth(i).click();
    await page.waitForTimeout(1500);
  }

  if (names[i] === "exterior") {
    const swatches = page.locator(".rs5-panel--config .rs5-swatch");
    await swatches.nth(3).click(); // paint
    await swatches.nth(7).click(); // wheel
    await swatches.nth(11).click(); // caliper
    await page.locator(".rs5-panel--config .rs5-toggle button").nth(1).click(); // exhaust
    checks.push({
      exteriorActiveSwatches: await page.locator(".rs5-panel--config .rs5-swatch[data-on='1']").count(),
      exhaust: await page.locator(".rs5-panel--config .rs5-toggle button").nth(1).getAttribute("data-on"),
    });
    await page.waitForTimeout(500);
  }
  if (names[i] === "acceleration") {
    await page.locator(".rs5-launch-copy .rs5-chip").first().click();
    await page.waitForTimeout(1900);
  }
  if (names[i] === "quattro") {
    await page.locator(".rs5-torque-dock .rs5-chip").nth(2).click();
    checks.push({
      torqueState: await page.locator(".rs5-torque-dock .rs5-chip").nth(2).getAttribute("data-on"),
    });
    await page.waitForTimeout(500);
  }
  if (names[i] === "dynamics") {
    await page.locator(".rs5-panel--dynamics .rs5-chip").first().click();
    await page.locator(".rs5-panel--dynamics .rs5-toggle button").first().click();
    checks.push({
      comfort: await page.locator(".rs5-panel--dynamics .rs5-chip").first().getAttribute("data-on"),
      drc: await page.locator(".rs5-panel--dynamics .rs5-toggle button").first().getAttribute("data-on"),
    });
    await page.waitForTimeout(500);
  }
  if (names[i] === "cabin") {
    await page.locator(".rs5-camera-rail button").nth(2).click(); // seats close-up
    await page.waitForTimeout(900);
    await root.screenshot({ path: resolve(out, "cabin-seats.png") });
    await page.locator(".rs5-camera-rail button").nth(1).click();
    await page.locator(".rs5-cabin-dock .rs5-swatch").last().click();
    checks.push({
      cabinCamera: await page.locator(".rs5-camera-rail button").nth(1).getAttribute("data-on"),
      cabinMaterial: await page.locator(".rs5-cabin-dock .rs5-swatch").last().getAttribute("data-on"),
    });
    await page.waitForTimeout(500);
  }

  await root.screenshot({ path: resolve(out, `${i + 1}-${names[i]}.png`) });
}

console.log(JSON.stringify({ screenshots: names.length, checks, errors }, null, 2));
await browser.close();
