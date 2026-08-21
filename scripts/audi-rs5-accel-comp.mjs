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
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

await page.goto(base, { waitUntil: "networkidle", timeout: 90_000 });
await page.locator(".rs5-root").waitFor({ state: "visible", timeout: 30_000 });
await page.locator(".rs5-load").waitFor({ state: "hidden", timeout: 90_000 });

const nav = page.locator(".rs5-nav button");
await nav.nth(2).click(); // acceleration
await page.waitForTimeout(1600);

await page.screenshot({ path: resolve(out, "accel-comp-0.png"), fullPage: false });

const launch = page.locator(".rs5-live__actions .rs5-chip").first();
await launch.click();
await page.waitForTimeout(1200);
await page.screenshot({ path: resolve(out, "accel-comp-mid.png"), fullPage: false });
await page.waitForTimeout(2200);
await page.screenshot({ path: resolve(out, "accel-comp-end.png"), fullPage: false });

const boxes = await page.evaluate(() => {
  const live = document.querySelector(".rs5-live");
  const actions = document.querySelector(".rs5-live__actions");
  const stage = document.querySelector(".rs5-stage");
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) };
  };
  return {
    stage: rect(stage),
    live: rect(live),
    actions: rect(actions),
    title: live?.querySelector(".rs5-live__title")?.textContent ?? null,
    timer: live?.querySelector(".rs5-live__n")?.textContent ?? null,
  };
});

console.log(JSON.stringify(boxes, null, 2));
await browser.close();
