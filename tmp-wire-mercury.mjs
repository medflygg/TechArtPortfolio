import fs from "fs";

const path = "src/shaders/webEffects.ts";
let text = fs.readFileSync(path, "utf8");

text = text.replace(
  /engine\?: "fragment" \| "smoke" \| "particles";/,
  'engine?: "fragment" | "smoke" | "particles" | "mercury";',
);

const start = text.indexOf('    id: "mercury",');
const end = text.indexOf('    id: "gem",');
if (start < 0 || end < 0) {
  console.error("mercury block not found", start, end);
  process.exit(1);
}

const neu = `    id: "mercury",
    title: "Mercury",
    blurb: "Liquid metal sim · drag to stir, keeps flowing",
    kind: "logo",
    engine: "mercury",
    interactive: true,
    needsImage: true,
    fragment: \`// ATLAS · Mercury — WebMercuryCanvas (Stable Fluids velocity + height)\\n\`,
    params: [
      ...floats([
        { key: "uSpeed", label: "Flow", min: 0.2, max: 2.4, step: 0.05, default: 1.15 },
        { key: "uScale", label: "Size", min: 0.55, max: 1.8, step: 0.02, default: 0.92 },
        { key: "uIntensity", label: "Gain", min: 0.6, max: 2.2, step: 0.05, default: 1.35 },
        { key: "uContrast", label: "Bevel", min: 0.2, max: 2, step: 0.05, default: 0.9 },
        { key: "uWarp", label: "Wake", min: 0.2, max: 1.8, step: 0.05, default: 1.05 },
        { key: "uSpread", label: "Brush", min: 8, max: 60, step: 1, default: 30 },
        { key: "uFade", label: "Settle", min: 0.05, max: 0.9, step: 0.01, default: 0.28 },
        { key: "uInertia", label: "Viscosity", min: 0.05, max: 0.95, step: 0.02, default: 0.84 },
      ]),
      ...colors([
        { key: "uBg", label: "Background", default: "#0f0f0f" },
        { key: "uColorA", label: "Deep", default: "#040733" },
        { key: "uColorB", label: "Cyan", default: "#30c9ff" },
        { key: "uColorC", label: "Warm", default: "#ff8373" },
      ]),
    ],
  },
  {
`;

text = text.slice(0, start) + neu + text.slice(end);

text = text.replace(
  'if (effect.engine === "smoke" || effect.engine === "particles") {',
  'if (effect.engine === "smoke" || effect.engine === "particles" || effect.engine === "mercury") {',
);

text = text.replace(
  "// See WebEffectCanvas / WebSmokeCanvas in the portfolio repo.\\n`;",
  "// See WebEffectCanvas / WebSmokeCanvas / WebMercuryCanvas in the portfolio repo.\\n`;",
);

fs.writeFileSync(path, text);
console.log("webEffects mercury replaced");
