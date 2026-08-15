import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:5173/work/web/launch/ether", { waitUntil: "networkidle" });
await page.waitForSelector(".eu-root[data-mode='full']", { timeout: 20000 });
await page.waitForTimeout(4000);
await page.locator(".eu-root").screenshot({ path: "docs/ether-qa/live-hero.png" });
console.log("ok", await page.locator(".eu-chrome__url").innerText());
await browser.close();
