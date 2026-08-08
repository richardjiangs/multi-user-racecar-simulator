// apply.mjs — replace each simulator's injectExterior() with the body drawn from that car's
// real dimensions. The ids the sims bind to (bcBody, doorArt, quadExhaustArt, frontFlapArt,
// rearWingArt) come out of the renderer, so nothing that drives the art has to change.
import { readFileSync, writeFileSync } from "node:fs";
import { renderCar } from "./render.mjs";
import { SPECS } from "./specs.mjs";

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
  evo: "Mitsubishi Lancer Evo X FQ-440 simulator.html",
  gtr: "Nissan GT-R Nismo simulator.html",
  m5: "BMW M5 simulator.html",
  r8: "Audi R8 V10 Performance simulator.html",
  mclarenf1: "McLaren F1 1993 simulator.html",
  t33: "Gordon Murray T.33 simulator.html",
  t50s: "Gordon Murray T50s Niki Lauda simulator.html",
  alfa33: "Alfa Romeo 33 Stradale simulator.html",
  project8: "Jaguar XE SV Project 8 simulator.html",
  s2000: "Honda S2000 simulator.html",
};

let done = 0;
for (const [key, file] of Object.entries(FILES)) {
  const spec = SPECS[key];
  if (!spec || spec.skip) { console.log("no spec: " + key); continue; }
  let s = readFileSync(file, "utf8");
  const i = s.indexOf("  function injectExterior() {");
  if (i < 0) { console.log("no injectExterior: " + file); continue; }
  let d = 0, j = s.indexOf("{", i), end = j;
  for (; j < s.length; j++) { if (s[j] === "{") d++; else if (s[j] === "}") { d--; if (!d) { end = j + 1; break; } } }

  const svg = renderCar({ ...spec, key }).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  const fn = `  /* ${spec.name} — drawn from the car's own published dimensions: ${spec.lengthMm} mm long
     on a ${spec.wheelbaseMm} mm wheelbase, ${spec.heightMm} mm tall, ${spec.frontOverhangMm}/${spec.rearOverhangMm} mm
     overhangs. The wheel arches are cut INTO the body, which is what gives it proportions. */
  function injectExterior() {
    app.el.exteriorArt.innerHTML = \`
    ${svg}
    \`;
    // the SVG replaced the original nodes — re-point the element refs at the new ones
    app.el.doorArt = document.getElementById("doorArt");
    app.el.quadExhaustArt = document.getElementById("quadExhaustArt");
    app.el.bcBody = document.getElementById("bcBody");
  }`;
  s = s.slice(0, i) + fn + s.slice(end + 1);
  writeFileSync(file, s);
  done++;
}
console.log("bodies replaced in " + done + " simulators");
