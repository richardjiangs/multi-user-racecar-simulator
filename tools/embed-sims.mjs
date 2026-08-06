#!/usr/bin/env node
/* Regenerates the sim registry after editing ANY simulator:
     node tools/embed-sims.mjs

   Writes two things:
     - sims-embedded.js  — every sim base64-encoded. index.html loads this ONLY
       over file:// (offline), where Chrome can't point an iframe at a sibling file.
     - index.html        — between the EMBED markers, just the tiny key -> filename
       SIM_FILES map. Over http(s) the garage lazy-loads each sim file on demand,
       so the initial page stays small (was ~12 MB with the base64 inlined).
*/
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
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
  supra: "Toyota Supra MK4 simulator.html",
  evo: "Mitsubishi Lancer Evo X FQ-440 simulator.html",
  gtr: "Nissan GT-R Nismo simulator.html",
  m5: "BMW M5 simulator.html",
  r8: "Audi R8 V10 Performance simulator.html",
  mcf1: "McLaren F1 1993 simulator.html",
  t33: "Gordon Murray T.33 simulator.html",
  agera: "Koenigsegg Agera RS simulator.html",
  u9: "Yangwang U9 simulator.html",
  db5: "Aston Martin DB5 simulator.html",
  slr300: "Mercedes-Benz 300 SLR Uhlenhaut simulator.html",
  czinger: "Czinger 21C simulator.html",
  alfa33: "Alfa Romeo 33 Stradale simulator.html",
  tuatara: "SSC Tuatara simulator.html",
  venom: "Hennessey Venom F5 simulator.html",
  evija: "Lotus Evija simulator.html",
  amgone: "Mercedes-AMG One simulator.html",
  nevera: "Rimac Nevera simulator.html",
  zr1: "Chevrolet Corvette ZR1 simulator.html",
  p1: "McLaren P1 simulator.html",
  f40: "Ferrari F40 simulator.html",
  p917: "Porsche 917 simulator.html",
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
  dacia: "Dacia Sandrider Dakar simulator.html",
  fordraptor: "Ford Raptor T1+ Dakar simulator.html",
  grhilux: "Toyota GR DKR Hilux simulator.html",
  hunter: "Prodrive Hunter Dakar simulator.html",
};

const enc = {};
for (const [key, file] of Object.entries(FILES)) {
  const buf = readFileSync(resolve(ROOT, file));
  enc[key] = buf.toString("base64");
  console.log(`${key.padEnd(11)} ${file}  ${(buf.length / 1024).toFixed(0)} KB`);
}

// A content hash over every sim, stamped into the page as SIM_BUILD and appended to each
// sim URL as ?v=. Without it the sim files sit on stable URLs, and prefetchSims() warms
// all 47 into the browser cache on every visit — so a visitor could take a fresh
// index.html and still open last week's simulator out of disk cache. It only changes when
// a sim actually changes, so it does not defeat caching, it just ends staleness.
const SIM_BUILD = createHash("sha1")
  .update(Object.keys(enc).sort().map((k) => k + ":" + enc[k]).join("|"))
  .digest("hex").slice(0, 10);

// 1) base64 copies -> a separate file, loaded by index.html ONLY over file://.
const embedPath = resolve(ROOT, "sims-embedded.js");
const embedJs = `window.EMBEDDED_SIM_BASE64 = ${JSON.stringify(enc)};\n`;
writeFileSync(embedPath, embedJs);

// 2) index.html carries only the small key -> filename map for the lazy http(s) path.
const indexPath = resolve(ROOT, "index.html");
const html = readFileSync(indexPath, "utf8");
const START = "/*__EMBED_START__*/", END = "/*__EMBED_END__*/";
const i = html.indexOf(START), j = html.indexOf(END);
if (i < 0 || j < 0) { console.error("EMBED markers not found in index.html"); process.exit(1); }
const line = `${START}const SIM_FILES = ${JSON.stringify(FILES)};const SIM_BUILD = ${JSON.stringify(SIM_BUILD)};${END}`;
const newIndex = html.slice(0, i) + line + html.slice(j + END.length);
writeFileSync(indexPath, newIndex);

// 3) index-offline.html — the original all-in-one page: one self-contained file
//    with every sim embedded inline, always uses the embedded copy (no network,
//    zero loading), works the same from disk or a server. Derived from index.html
//    so it never drifts.
const offline = newIndex
  // inline the base64 next to the filename map (no external sims-embedded.js)
  .replace(line, `${START}const SIM_FILES = ${JSON.stringify(FILES)};const SIM_BUILD = ${JSON.stringify(SIM_BUILD)};window.EMBEDDED_SIM_BASE64 = ${JSON.stringify(enc)};${END}`)
  // the file:// guard that pulls in the external embed is unnecessary here
  .replace(`if (location.protocol === "file:") document.write('<script src="sims-embedded.js"><\\/script>');`,
           `/* index-offline.html: every sim is embedded inline above — no external file */`)
  // always take the embedded path so it needs zero network on any protocol
  .replace(`if (location.protocol === "file:") {`, `if (true) {  /* self-contained build: always use the embedded copy */`)
  // no background prefetch — the sims are already inline
  .replace(`      if (document.readyState === "complete") setTimeout(prefetchSims, 600);\n      else window.addEventListener("load", () => setTimeout(prefetchSims, 600));`,
           `      /* index-offline.html: sims embedded inline, no prefetch needed */`);
const offlinePath = resolve(ROOT, "index-offline.html");
if (offline === newIndex) { console.error("index-offline transform matched nothing — aborting"); process.exit(1); }
writeFileSync(offlinePath, offline);

console.log(`sims-embedded.js written (${(embedJs.length / 1024 / 1024).toFixed(2)} MB — file:// fallback only).`);
console.log(`index.html updated (${(line.length / 1024).toFixed(1)} KB SIM_FILES map inline, build ${SIM_BUILD}).`);
console.log(`index-offline.html written (${(offline.length / 1024 / 1024).toFixed(2)} MB — self-contained, zero network).`);
