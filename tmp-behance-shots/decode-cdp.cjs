const fs = require("fs");
const path = require("path");
const outDir = "C:/Users/Medfly/ta-portfolio/tmp-behance-shots";
function fromCdp(jsonPath, outName) {
  const raw = fs.readFileSync(jsonPath, "utf8");
  const j = JSON.parse(raw);
  const data = j.result?.data || j.data;
  if (!data) throw new Error("no data in " + jsonPath + " keys=" + Object.keys(j));
  const buf = Buffer.from(data, "base64");
  fs.writeFileSync(path.join(outDir, outName), buf);
  console.log("wrote", outName, buf.length);
}
const logs = "C:/Users/Medfly/.cursor/browser-logs";
const files = fs.readdirSync(logs).filter(f => f.includes("Page.captureScreenshot")).sort();
console.log("cdp files", files.slice(-3));
if (files.length) fromCdp(path.join(logs, files[files.length-1]), "last-cdp.png");
