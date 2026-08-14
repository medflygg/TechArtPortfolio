const fs = require("fs");
const path = require("path");
const outDir = "C:/Users/Medfly/ta-portfolio/tmp-behance-shots";
function fromCdp(jsonPath, outName) {
  const j = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const data = j.result?.data || j.data;
  if (!data) throw new Error("no data in " + jsonPath);
  fs.writeFileSync(path.join(outDir, outName), Buffer.from(data, "base64"));
  console.log("wrote", outName, Buffer.from(data, "base64").length);
}
fromCdp("C:/Users/Medfly/.cursor/browser-logs/cdp-response-Page.captureScreenshot-2026-08-13T20-40-34-437Z.json", "01-home-cdp.png");
