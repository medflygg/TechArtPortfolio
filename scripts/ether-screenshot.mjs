import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = "docs/ether-qa";
fs.mkdirSync(outDir, { recursive: true });

const CHAPTER_VH = {
  hero: 200,
  inside: 130,
  anatomy: 160,
  origin: 180,
  lab: 150,
  dna: 150,
  match: 120,
  reveal: 140,
  drydown: 120,
  bag: 100,
};
const chapters = Object.keys(CHAPTER_VH);
const total = chapters.reduce((s, id) => s + CHAPTER_VH[id], 0);

function midProgress(id) {
  let cursor = 0;
  for (const ch of chapters) {
    const share = CHAPTER_VH[ch] / total;
    if (ch === id) return cursor + share * (id === "reveal" ? 0.7 : 0.45);
    cursor += share;
  }
  return 0;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:5173/work/web/launch/ether", { waitUntil: "networkidle" });
await page.waitForSelector(".eu-root[data-mode='full']", { timeout: 20000 });
await page.waitForFunction(() => typeof window.__etherJump === "function", null, { timeout: 15000 });
await page.waitForTimeout(1000);

for (const ch of chapters) {
  const p = midProgress(ch);
  await page.evaluate((prog) => window.__etherJump(prog), p);
  await page.waitForTimeout(1600);
  const url = await page.locator(".eu-chrome__url").innerText();
  const got = url.split("/").pop().trim();
  try {
    if (ch === "origin") {
      await page.locator(".eu-origin button").nth(1).click({ force: true, timeout: 1500 });
      await page.waitForTimeout(700);
    }
    if (ch === "lab") {
      await page.locator(".eu-lab__ings button").first().click({ force: true, timeout: 1500 });
      await page.waitForTimeout(500);
    }
    if (ch === "match") {
      await page.locator(".eu-match__card").nth(1).click({ force: true, timeout: 1500 });
      await page.waitForTimeout(500);
    }
  } catch {
    /* ignore */
  }
  await page.waitForTimeout(600);
  const shot = path.join(outDir, `live-${ch}.png`);
  await page.locator(".eu-root").screenshot({ path: shot });
  console.log(ch, got === ch ? "ok" : `WARN got=${got}`, "p=", p.toFixed(3), "->", shot);
}

await browser.close();
