// apply.mjs — replace each simulator's injectExterior() with the body drawn from that car's
// real dimensions. The ids the sims bind to (bcBody, doorArt, quadExhaustArt, frontFlapArt,
// rearWingArt) come out of the renderer, so nothing that drives the art has to change.
import { readFileSync, writeFileSync } from "node:fs";
import { renderCar } from "./render.mjs";
import { SPECS } from "./specs.mjs";
// Cars that have been DRAWN BY HAND and signed off take precedence over the generator. The
// generator stays in place for the ones not yet reached, so the garage is never half-empty
// while the set is worked through.
import { DRAWN } from "./drawn.mjs";

// HANDS OFF. These eleven were drawn by hand, car by car, and they are the standard the rest
// are trying to reach: evo, gtr, m5, r8, mclarenf1, t33, agera, u9, db5, slr300, czinger.
// The generator overwrote six of them once. It does not get a second go.
const HAND_DRAWN = ["evo", "gtr", "m5", "r8", "mclarenf1", "t33", "agera", "u9", "db5", "slr300", "czinger"];

/* the fences that make a re-run safe — see the note further down */
const OPEN = "BODYKIT:BEGIN", CLOSE = "BODYKIT:END";

const FILES = {
  bugatti: "Bugatti Chiron Super Sport 300+ simulator.html",
  aston: "Aston Martin Valkyrie simulator.html",
  revuelto: "Lamborghini Revuelto simulator.html",
  pagani: "Pagani Huayra BC Simulator.html",
  mclaren: "McLaren Speedtail simulator.html",
  ferrari: "Ferrari F80 simulator.html",
  koenigsegg: "Koenigsegg Jesko simulator.html",
  venom: "Hennessey Venom F5 simulator.html",
  amgone: "Mercedes-AMG One simulator.html",
  p1: "McLaren P1 simulator.html",
  zr1: "Chevrolet Corvette ZR1 simulator.html",
  evija: "Lotus Evija simulator.html",
  nevera: "Rimac Nevera simulator.html",
  tuatara: "SSC Tuatara simulator.html",
  gto: "Ferrari 250 GTO simulator.html",
  f40: "Ferrari F40 simulator.html",
  p917: "Porsche 917 simulator.html",
  tesla: "Tesla Model S Plaid simulator.html",
  taycan: "Porsche Taycan Turbo GT simulator.html",
  amg: "Mercedes-AMG GT Black Series simulator.html",
  porsche918: "Porsche 918 Spyder simulator.html",
  supra: "Toyota Supra MK4 simulator.html",
  t50s: "Gordon Murray T50s Niki Lauda simulator.html",
  alfa33: "Alfa Romeo 33 Stradale simulator.html",
  project8: "Jaguar XE SV Project 8 simulator.html",
  s2000: "Honda S2000 simulator.html",
};

let done = 0;
for (const [key, file] of Object.entries(FILES)) {
  if (HAND_DRAWN.includes(key)) { console.log("refusing to touch hand-drawn art: " + key); continue; }
  const spec = SPECS[key];
  if (!spec || spec.skip) { console.log("no spec: " + key); continue; }
  let s = readFileSync(file, "utf8");

  const byHand = typeof DRAWN[key] === "function";
  const raw = byHand ? DRAWN[key]({ ...spec, key }) : renderCar({ ...spec, key });
  const svg = raw.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  const TAIL = `app.el.bcBody = document.getElementById("bcBody");\n  }`;
  const provenance = byHand
    ? `DRAWN BY HAND, from this car's own side elevation: ${spec.lengthMm} mm long on a
     ${spec.wheelbaseMm} mm wheelbase, ${spec.heightMm} mm tall, ${spec.frontOverhangMm}/${spec.rearOverhangMm} mm
     overhangs. One hand-written outline, its own shut lines, its own lamps. Nothing about it is
     shared with any other car. The source is tools/bodykit/drawn.mjs.`
    : `drawn from the car's own published dimensions: ${spec.lengthMm} mm long
     on a ${spec.wheelbaseMm} mm wheelbase, ${spec.heightMm} mm tall, ${spec.frontOverhangMm}/${spec.rearOverhangMm} mm
     overhangs. The wheel arches are cut INTO the body, which is what gives it proportions, and the
     furniture on it — glasshouse, grille, lamps, vents, flank kit — is what that car really wears.`;
  const fn = `  /* ${OPEN} ${spec.name} — ${provenance} */
  function injectExterior() {
    app.el.exteriorArt.innerHTML = \`
    ${svg}
    \`;
    // the SVG replaced the original nodes — re-point the element refs at the new ones
    app.el.doorArt = document.getElementById("doorArt");
    app.el.quadExhaustArt = document.getElementById("quadExhaustArt");
    ${TAIL}
  /* ${CLOSE} */`;

  // Re-running this used to corrupt the file: the generated SVG carries its own <style> block, so
  // a brace counter walking from `function injectExterior() {` counts ITS braces and stops in the
  // wrong place, swallowing whatever follows. The generated block is therefore fenced, and a
  // re-run replaces what is between the fences instead of counting anything.
  const a = s.indexOf(OPEN), b = s.indexOf(CLOSE);
  if (a >= 0 && b > a) {
    // find the real end of the closing comment. Counting characters instead cost one per run and
    // the loss accumulated silently across re-runs until it had swallowed `\n  func` and the next
    // function started mid-token — which is exactly the "Unexpected identifier" this fence exists
    // to prevent. Never hand-count a delimiter you can search for.
    const closeEnd = s.indexOf("*/", b) + 2;
    s = s.slice(0, s.lastIndexOf("  /*", a)) + fn + s.slice(closeEnd);
  } else if (s.includes("drawn from the car's own published dimensions")) {
    // an earlier unfenced generation: bound it by its own comment and its own last line
    const c0 = s.lastIndexOf("  /*", s.indexOf("drawn from the car's own published dimensions"));
    const c1 = s.indexOf(TAIL, c0);
    if (c0 < 0 || c1 < 0) { console.log("cannot bound the old block: " + key); continue; }
    s = s.slice(0, c0) + fn + s.slice(c1 + TAIL.length);
  } else {
    const i = s.indexOf("  function injectExterior() {");
    if (i < 0) { console.log("no injectExterior: " + file); continue; }
    let d = 0, j = s.indexOf("{", i), end = j;
    for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) { end = j + 1; break; } } }
    s = s.slice(0, i) + fn + s.slice(end + 1);
  }
  writeFileSync(file, s);
  done++;
}
console.log("bodies replaced in " + done + " simulators");
