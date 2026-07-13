#!/usr/bin/env node
/* Re-embeds the simulator HTML files into index.html as base64, replacing
   the single line between the EMBED markers. Run after editing ANY simulator:
     node tools/embed-sims.mjs
*/
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FILES = {
  pagani: "Pagani Huayra BC Simulator.html",
  bugatti: "Bugatti Chiron Super Sport 300+ simulator.html",
  mclaren: "McLaren Speedtail simulator.html",
  ferrari: "Ferrari F80 simulator.html",
  koenigsegg: "Koenigsegg Jesko simulator.html",
  tesla: "Tesla Model S Plaid simulator.html",
  amg: "Mercedes-AMG GT Black Series simulator.html",
  aston: "Aston Martin Valkyrie simulator.html",
  gto: "Ferrari 250 GTO simulator.html",
  revuelto: "Lamborghini Revuelto simulator.html",
  porsche918: "Porsche 918 Spyder simulator.html",
  taycan: "Porsche Taycan Turbo GT simulator.html",
  supra: "Toyota GR Supra simulator.html",
  f1mercedes: "Mercedes F1 2026 simulator.html",
  f1redbull: "Red Bull F1 2026 simulator.html",
  f1ferrari: "Ferrari F1 2026 simulator.html",
  f1mclaren: "McLaren F1 2026 simulator.html",
  f1aston: "Aston Martin F1 2026 simulator.html",
  f1alpine: "Alpine F1 2026 simulator.html",
  f1williams: "Williams F1 2026 simulator.html",
  f1racingbulls: "Racing Bulls F1 2026 simulator.html",
  f1haas: "Haas F1 2026 simulator.html",
  f1audi: "Audi F1 2026 simulator.html",
  f1cadillac: "Cadillac F1 2026 simulator.html",
};

const enc = {};
for (const [key, file] of Object.entries(FILES)) {
  const buf = readFileSync(resolve(ROOT, file));
  enc[key] = buf.toString("base64");
  console.log(`${key.padEnd(11)} ${file}  ${(buf.length / 1024).toFixed(0)} KB`);
}

const indexPath = resolve(ROOT, "index.html");
const html = readFileSync(indexPath, "utf8");
const START = "/*__EMBED_START__*/", END = "/*__EMBED_END__*/";
const i = html.indexOf(START), j = html.indexOf(END);
if (i < 0 || j < 0) { console.error("EMBED markers not found in index.html"); process.exit(1); }
const line = `${START}const EMBEDDED_SIM_BASE64 = ${JSON.stringify(enc)};${END}`;
writeFileSync(indexPath, html.slice(0, i) + line + html.slice(j + END.length));
console.log(`index.html updated (${(line.length / 1024 / 1024).toFixed(2)} MB embedded).`);
