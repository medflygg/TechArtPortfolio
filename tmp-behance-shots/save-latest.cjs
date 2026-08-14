const fs = require("fs");
const path = require("path");
const outDir = "C:/Users/Medfly/ta-portfolio/tmp-behance-shots";
const logs = "C:/Users/Medfly/.cursor/browser-logs";
function latestCdp() {
  const files = fs.readdirSync(logs).filter(f => f.includes("Page.captureScreenshot")).sort();
  return path.join(logs, files[files.length - 1]);
}
function saveLatest(outName) {
  const j = JSON.parse(fs.readFileSync(latestCdp(), "utf8"));
  const data = j.result?.data || j.data;
  const buf = Buffer.from(data, "base64");
  fs.writeFileSync(path.join(outDir, outName), buf);
  console.log(outName, buf.length, "from", path.basename(latestCdp()));
}
saveLatest(process.argv[2] || "shot.png");
