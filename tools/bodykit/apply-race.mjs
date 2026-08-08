// apply-race.mjs — the eleven 2026 F1 cars and the four Dakar raid cars, each drawn by the
// generator that suits it. They share a chassis in real life, so they share a silhouette here
// and differ in livery, race number and the details that are actually theirs.
import { readFileSync, writeFileSync } from "node:fs";
import { renderF1 } from "./openwheel.mjs";
import { renderRaid } from "./raid.mjs";

const F1 = {
  f1mercedes: { file: "Mercedes F1 2026 simulator.html", name: "Mercedes-AMG F1 W17", body: "#00423d", trim: "#00d2be", number: 63 },
  f1redbull: { file: "Red Bull F1 2026 simulator.html", name: "Red Bull RB22", body: "#0b1a4a", trim: "#e8002d", number: 1 },
  f1ferrari: { file: "Ferrari F1 2026 simulator.html", name: "Scuderia Ferrari SF-26", body: "#a6141e", trim: "#ffe000", number: 16 },
  f1mclaren: { file: "McLaren F1 2026 simulator.html", name: "McLaren MCL40", body: "#c8500a", trim: "#3fc7f0", number: 4 },
  f1aston: { file: "Aston Martin F1 2026 simulator.html", name: "Aston Martin AMR26", body: "#00473a", trim: "#cedc00", number: 14 },
  f1alpine: { file: "Alpine F1 2026 simulator.html", name: "Alpine A526", body: "#0b3fa8", trim: "#ff5fa2", number: 10 },
  f1williams: { file: "Williams F1 2026 simulator.html", name: "Williams FW48", body: "#0a1a3f", trim: "#3fb7f0", number: 23 },
  f1racingbulls: { file: "Racing Bulls F1 2026 simulator.html", name: "Racing Bulls VCARB 03", body: "#1a2d6b", trim: "#e8002d", number: 22 },
  f1haas: { file: "Haas F1 2026 simulator.html", name: "Haas VF-26", body: "#e6e6e6", trim: "#c8102e", number: 20 },
  f1audi: { file: "Audi F1 2026 simulator.html", name: "Audi F1 R26", body: "#1a1d22", trim: "#c8102e", number: 27 },
  f1cadillac: { file: "Cadillac F1 2026 simulator.html", name: "Cadillac F1 C26", body: "#0d2b3f", trim: "#d4af37", number: 2 },
};

const RAID = {
  dacia: { file: "Dacia Sandrider Dakar simulator.html", name: "Dacia Sandrider", body: "#1d2a35", trim: "#c8e400", number: 200, badge: "SANDRIDER" },
  fordraptor: { file: "Ford Raptor T1+ Dakar simulator.html", name: "Ford Raptor T1+", body: "#0d3f8f", trim: "#ff6a1a", number: 201, badge: "RAPTOR T1+" },
  grhilux: { file: "Toyota GR DKR Hilux simulator.html", name: "Toyota GR DKR Hilux", body: "#e8e8e8", trim: "#c8102e", number: 202, badge: "GR DKR" },
  hunter: { file: "Prodrive Hunter Dakar simulator.html", name: "Prodrive Hunter", body: "#1b1d22", trim: "#e8a800", number: 203, badge: "HUNTER" },
};

function swap(file, svg, name) {
  let s = readFileSync(file, "utf8");
  const i = s.indexOf("  function injectExterior() {");
  if (i < 0) { console.log("no injectExterior: " + file); return false; }
  let d = 0, j = s.indexOf("{", i), end = j;
  for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) { end = j + 1; break; } } }
  const esc = svg.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  s = s.slice(0, i) + `  /* ${name} — drawn as the kind of car it actually is, not a road car with
     bits removed: the floor, the sidepod, the halo and the exposed suspension are most of
     what you can see of one of these from the side. */
  function injectExterior() {
    app.el.exteriorArt.innerHTML = \`
    ${esc}
    \`;
    app.el.doorArt = document.getElementById("doorArt");
    app.el.quadExhaustArt = document.getElementById("quadExhaustArt");
    app.el.bcBody = document.getElementById("bcBody");
  }` + s.slice(end + 1);
  writeFileSync(file, s);
  return true;
}

let n = 0;
for (const [key, s] of Object.entries(F1)) if (swap(s.file, renderF1({ ...s, key }), s.name)) n++;
for (const [key, s] of Object.entries(RAID)) if (swap(s.file, renderRaid({ ...s, key }), s.name)) n++;
console.log("race bodies replaced in " + n + " simulators");
