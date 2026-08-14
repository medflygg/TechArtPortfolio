const SIZE = 1536;
/** Distance field resolution — the field is smooth, so half size costs nothing. */
const SDF_SIZE = 768;
/**
 * Half-width of the distance ramp stored in alpha, as a fraction of the canvas.
 * Shaders decode with the same number (SDF_RANGE in webEffects.ts), so the two
 * must move together.
 */
export const SDF_RANGE = 0.085;

/** Felzenszwalb's 1D squared distance transform — the row/column kernel. */
function edt1d(f: Float32Array, d: Float32Array, v: Int32Array, z: Float32Array, n: number) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const dx = q - v[k];
    d[q] = dx * dx + f[v[k]];
  }
}

/** Squared distance from every cell to the nearest zero cell in `f`. */
function edt2d(f: Float32Array, n: number) {
  const line = new Float32Array(n);
  const out = new Float32Array(n);
  const v = new Int32Array(n);
  const z = new Float32Array(n + 1);
  for (let y = 0; y < n; y++) {
    const row = y * n;
    for (let x = 0; x < n; x++) line[x] = f[row + x];
    edt1d(line, out, v, z, n);
    for (let x = 0; x < n; x++) f[row + x] = out[x];
  }
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) line[y] = f[y * n + x];
    edt1d(line, out, v, z, n);
    for (let y = 0; y < n; y++) f[y * n + x] = out[y];
  }
}

/**
 * Signed distance to the outline, positive inside, in units of the full canvas.
 * Effects use it to inflate the flat mark into a rounded solid — a gradient of
 * the coverage alone only knows about the two pixels either side of an edge.
 */
function signedField(cov: Uint8Array, size: number, n: number): Float32Array {
  const inside = new Float32Array(n * n);
  const outside = new Float32Array(n * n);
  const step = size / n;
  for (let y = 0; y < n; y++) {
    const sy = Math.min(size - 1, Math.round((y + 0.5) * step));
    for (let x = 0; x < n; x++) {
      const sx = Math.min(size - 1, Math.round((x + 0.5) * step));
      const solid = cov[sy * size + sx] >= 128;
      inside[y * n + x] = solid ? 1e12 : 0;
      outside[y * n + x] = solid ? 0 : 1e12;
    }
  }
  edt2d(inside, n);
  edt2d(outside, n);
  const out = new Float32Array(n * n);
  for (let i = 0; i < out.length; i++) {
    out[i] = (Math.sqrt(inside[i]) - Math.sqrt(outside[i])) * step;
  }
  return out;
}

/**
 * Default ATLAS wordmark — flat-top A, bold extended geometric sans, tight kerning.
 * Path data fitted from the brand PNG (white on black); no webfonts.
 * Counters are evenodd subpaths on the same <path> (not separate elements).
 */
export const DEFAULT_LOGO_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 606 81" fill="#fff" fill-rule="evenodd">
  <path d="M50 2 H83 L130 77 H101 L94 66 H40 L32 77 H0 Z M67 26 L54 48 H80 L71 26 Z"/>
  <path d="M125 2 H244 V24 H197 V77 H168 V24 H125 Z"/>
  <path d="M253 2 H283 V55 H351 V77 H253 Z"/>
  <path d="M406 2 H439 L489 77 H457 L449 66 H395 L388 77 H355 Z M422 26 L410 48 H436 L424 26 Z"/>
  <path d="M528 0 L569 1 L583 5 L592 10 L599 18 L602 30 L571 30 L567 25 L556 22 L526 23 L521 27 L521 30 L527 33 L572 34 L593 38 L597 40 L604 49 L605 56 L601 67 L595 72 L583 77 L560 80 L528 79 L511 75 L499 69 L491 60 L489 50 L521 50 L528 55 L536 57 L569 57 L576 53 L573 48 L565 46 L510 44 L497 39 L493 35 L491 31 L491 21 L494 14 L506 5 L527 1 Z"/>
</svg>`;

/**
 * Pack the mark for the shaders: RGB carries the anti-aliased coverage, alpha
 * the signed distance to the outline. Coverage lives in RGB because the canvas
 * stores premultiplied pixels, and it is only ever needed where alpha is high.
 */
function toAlphaMask(ctx: CanvasRenderingContext2D, size: number) {
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  let minA = 255;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] < minA) minA = d[i];
  }
  const hasAlpha = minA < 250;
  const cov = new Uint8Array(size * size);
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const a = d[i + 3] / 255;
    const l = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) / 255;
    const m = hasAlpha ? a : 1 - l;
    cov[p] = Math.round(Math.max(0, Math.min(1, m)) * 255);
  }

  const n = Math.min(SDF_SIZE, size);
  const field = signedField(cov, size, n);
  const range = SDF_RANGE * size;
  const toField = n / size;
  for (let y = 0, p = 0; y < size; y++) {
    const fy = Math.min(n - 1.001, Math.max(0, (y + 0.5) * toField - 0.5));
    const y0 = Math.floor(fy);
    const ty = fy - y0;
    for (let x = 0; x < size; x++, p++) {
      const fx = Math.min(n - 1.001, Math.max(0, (x + 0.5) * toField - 0.5));
      const x0 = Math.floor(fx);
      const tx = fx - x0;
      const r0 = y0 * n + x0;
      const r1 = r0 + n;
      const top = field[r0] + (field[r0 + 1] - field[r0]) * tx;
      const bot = field[r1] + (field[r1 + 1] - field[r1]) * tx;
      const sd = top + (bot - top) * ty;
      const i = p * 4;
      d[i] = cov[p];
      d[i + 1] = cov[p];
      d[i + 2] = cov[p];
      d[i + 3] = Math.round(Math.max(0, Math.min(1, 0.5 + (sd / range) * 0.5)) * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
}

function drawContained(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  size: number,
  srcW: number,
  srcH: number,
) {
  const pad = size * 0.1;
  const box = size - pad * 2;
  const scale = Math.min(box / Math.max(srcW, 1), box / Math.max(srcH, 1));
  const w = srcW * scale;
  const h = srcH * scale;
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(source, (size - w) / 2, (size - h) / 2, w, h);
  toAlphaMask(ctx, size);
}

export function rasterizeSvgText(svg: string, size = SIZE): Promise<HTMLCanvasElement> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("2d context"));
        return;
      }
      const w = img.naturalWidth || img.width || size;
      const h = img.naturalHeight || img.height || size;
      drawContained(ctx, img, size, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("svg"));
    };
    img.src = url;
  });
}

export async function rasterizeSvgFile(file: File): Promise<HTMLCanvasElement> {
  const text = await file.text();
  if (!text.includes("<svg")) {
    throw new Error("svg");
  }
  return rasterizeSvgText(text);
}

export function rasterizeDefaultLogo(): Promise<HTMLCanvasElement> {
  return rasterizeSvgText(DEFAULT_LOGO_SVG);
}
