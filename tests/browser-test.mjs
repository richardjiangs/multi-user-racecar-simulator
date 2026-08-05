#!/usr/bin/env node
/* ============================================================================
   BROWSER SMOKE TEST — index.html shell + all six embedded simulators.
   Serves the repo over localhost, then verifies:
     1. the garage renders all six car cards
     2. PRIVATE PRACTICE keeps the AI rival grid alive (the old shell cleared
        it every 750 ms — the "no AI cars" bug this suite pins down)
     3. each embedded sim boots inside the shell and its physics advance
     4. ONLINE mode: rivals replaced by real racers only; circuit buttons
        locked for joiners; remote players render as rivals
     5. RACE CONTROL: countdown holds the car on the grid, five lights show,
        release turns assists off and lets the car launch
   Run:  node tests/browser-test.mjs
   ============================================================================ */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const { execSync } = await import("node:child_process");
  const g = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(g, "playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg" };
const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = join(ROOT, url === "/" ? "index.html" : url.slice(1));
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const BASE = `http://127.0.0.1:${server.address().port}/`;

let failures = 0;
const check = (label, ok, detail) => {
  console.log(`   ${ok ? "✔" : "✘ FAIL"}  ${label}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

/* ---------- every car must have its OWN engine voice ----------
   Firing frequency (rpm/60 x pulses-per-rev) was always right, but the oscillator stack
   on top of it is the timbre, and cloning a sim copies it verbatim: at one point three
   classics (250 GTO, F40, 917) shared a byte-identical stack, so a Colombo V12, a
   twin-turbo V8 and an air-cooled flat-12 were one instrument at three pitches. The only
   cars allowed to share a voice are the ones that really do share a power unit. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const ALLOWED_SHARED = [
    ["Mercedes F1 2026", "McLaren F1 2026", "Williams F1 2026", "Alpine F1 2026"],   // Mercedes PU
    ["Ferrari F1 2026", "Haas F1 2026", "Cadillac F1 2026"],                          // Ferrari PU
    ["Red Bull F1 2026", "Racing Bulls F1 2026"],                                     // Red Bull Ford PU
    ["Koenigsegg Jesko", "Koenigsegg Agera RS"],                                      // same 5.0 TT V8
  ].map((g) => g.slice().sort().join("|"));
  const sims = readdirSync(ROOT).filter((f) => /simulator\.html$/i.test(f));
  const byVoice = new Map();
  for (const f of sims) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const defs = (src.match(/const defs = \[[\s\S]*?\n      \];/) || [""])[0].replace(/\/\/[^\n]*/g, "");
    const order = (src.match(/\(s\.rpm \/ 60\) \* ([\d.]+)/) || [])[1];
    const key = createHash("md5").update(defs + "|" + order).digest("hex");
    const name = f.replace(/ simulator\.html/i, "");
    byVoice.set(key, (byVoice.get(key) || []).concat(name));
  }
  const shared = [...byVoice.values()].filter((v) => v.length > 1).map((v) => v.slice().sort().join("|"));
  const unexpected = shared.filter((g) => !ALLOWED_SHARED.includes(g));
  check(`${byVoice.size} distinct engine voices across ${sims.length} cars`, unexpected.length === 0,
    unexpected.length ? "UNEXPECTED SHARED VOICE: " + unexpected.join("  //  ") : "");
}

/* ---------- no car may hiss ----------
   Every sim carried the same induction node — band-passed white noise at 2.4 kHz, Q=5,
   which is exactly a "shhhhh" — driven by boostBar, which the cloned physics computes on
   EVERY car. So a naturally-aspirated 1962 Colombo V12 built 1.35 bar of imaginary boost
   and hissed all the way, and the 0.10 floor term meant it never fully stopped. A turbo
   whistle is narrow and high; intake rush on an NA engine is low, broad and quiet; an EV
   has no induction at all. Assert the filter matches the engine. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const NA = /250 GTO|Porsche 917|300 SLR|DB5|R8 V10|McLaren F1 1993|T\.33|Valkyrie|Revuelto|918 Spyder|Ford Raptor/;
  // The Tesla keeps its ORIGINAL inverter noise: the user saved that build and asked for
  // it back, and their preference outranks the rule. Everything else is exempt from
  // nothing.
  const EVc = /Taycan|Evija|Nevera|Yangwang/;
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const m = src.match(/this\.turboNode = mkNoise\("bandpass", ([\d.]+), ([\d.]+)\)/);
    const gain = (src.match(/const turbo = ([^;]*);/) || [])[1] || "";
    const name = f.replace(/ simulator\.html/i, "");
    if (!m) { bad.push(name + ": no induction node"); continue; }
    const freq = +m[1], q = +m[2];
    // the Tesla is deliberately exempt: its original inverter noise IS a 2.4 kHz band,
    // the user saved that build and asked for it back
    const keepsOriginal = /Tesla/.test(name);
    if (!keepsOriginal && freq >= 1800 && freq <= 3200 && q >= 3) bad.push(name + ": 2.4 kHz hiss band is back");
    if (/turboGain = this\.turboNode\.g/.test(src) === false) bad.push(name + ": turboGain assignment lost");
    if (EVc.test(name) && !/^0\b/.test(gain.trim())) bad.push(name + ": an EV must have no induction noise");
    if (NA.test(name) && /boostBar/.test(gain)) bad.push(name + ": naturally aspirated but driven by boost");
    if (NA.test(name) && freq > 1200) bad.push(name + ": NA intake should be low, not a whistle");
  }
  check("induction noise matches each engine (no hiss, no fake turbos)", bad.length === 0, bad.join(" | "));
}

/* ---------- nothing you drop behind you may be drawn in front of you ----------
   q.slicks / q.puffs are laid at `state.distanceM - n`, i.e. BEHIND the car, and the draw
   code called projectAhead(-rel) — a POSITIVE distance, so every oil slick and smoke puff
   was painted ahead of the car and receded up the road you were driving into. The physics
   was always right (rivals behind drove through it); only the picture lied, and it lied in
   every sim for as long as the gadget has existed. Anything laid behind now goes in the
   mirror. This asserts nobody re-introduces the sign error. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    if (/projectAhead\(-rel/.test(src)) bad.push(f.replace(/ simulator\.html/i, "") + ": draws its own wake ahead of itself");
  }
  check("nothing laid behind the car is projected in front of it", bad.length === 0, bad.join(" | "));
}

/* ---------- you must be able to see behind you ----------
   Three separate faults, all of which made the world behind the car a void:
     - drawRivals called projectAhead(Math.max(0.6, ahead)), so a car 40 m BEHIND was
       projected 0.6 m in front of your nose, where the scale clamp squashed it out of
       sight. Turn round and the whole field vanished until it came past you again.
     - ROAD.BEHIND was 200 m but ROAD_OFFS — the distances the road is actually drawn at —
       started at -80, so looking back you got 80 m of tarmac and then nothing, and a corner
       you had just driven appeared out of thin air.
     - the mirrors were decoration. There is now one rear-view renderer, the real projection
       run through 180 deg and flipped, and every car has it in one of two layouts. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const SIDE = /Valkyrie|Speedtail|F1 2026/;    // camera pods / wing mirrors, always live
  const bad = [];
  let side = 0, centre = 0; const frames = new Set();
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), n = f.replace(/ simulator\.html/i, "");
    if (/projectAhead\(Math\.max\(0\.6, o\.ahead\)/.test(src)) bad.push(n + ": rivals behind you pinned in front of you");
    if (!/BEHIND: 240/.test(src)) bad.push(n + ": road table does not reach as far back as forward");
    if (!/for \(let d = -240; d < -80; d \+= 12\)/.test(src)) bad.push(n + ": road is not DRAWN further back than 80 m");
    if (!/function drawRearView\(/.test(src) || !/function rearProject\(/.test(src)) bad.push(n + ": no rear-view renderer");
    if (!/drawMirrors\(w, h, pal\);/.test(src)) bad.push(n + ": rear view never drawn");
    // the mirror must sample BOTH directions: reverse, or spin the car, and the glass still works
    if (!/REAR_OFFS/.test(src)) bad.push(n + ": mirror only looks one way down the road");
    if (!/const phi = state\.headingRel \+ Math\.PI \+ cam\.yaw/.test(src)) bad.push(n + ": pods share one viewpoint");
    const m = src.match(/const MIRROR = (\{[\s\S]*?\});/);
    if (!m) { bad.push(n + ": no mirror config"); continue; }
    let cfg; try { cfg = JSON.parse(m[1]); } catch (e) { bad.push(n + ": mirror config is not data"); continue; }
    if (cfg.style !== (SIDE.test(f) ? "side" : "centre")) bad.push(n + ": wrong mirror style " + cfg.style);
    if (cfg.style === "side") {
      side++;
      // two pods that show the SAME thing are one pod drawn twice. Each must have its own
      // mounting on the car and its own outward aim, or they are decoration again.
      if (cfg.pods.length !== 2) bad.push(n + ": a side car needs two pods");
      else {
        const [l, r] = cfg.pods;
        if (!(l.eye < 0 && r.eye > 0)) bad.push(n + ": pods are not mounted on opposite flanks");
        if (!(l.yaw < 0 && r.yaw > 0)) bad.push(n + ": pods are not aimed outboard");
        if (!(l.fx < 0.5 && r.fx > 0.5)) bad.push(n + ": pods are not on the left and right of the screen");
        // the HUD is an HTML panel OVER the canvas, so the canvas can never draw on top of
        // it — a pod has to live where the panel is not. The free band is hard outboard,
        // below the HUD aside and above the bottom bar.
        if (!(l.fx < 0.13 && r.fx > 0.87)) bad.push(n + ": pods are inboard, under the HUD panel");
        if (!(l.fy > 0.62 && l.fy < 0.74)) bad.push(n + ": pods are not in the clear band below the HUD (fy " + l.fy + ")");
      }
    } else {
      centre++;
      if (cfg.pods.length !== 1) bad.push(n + ": an interior mirror is one mirror");
      // high on the windscreen: above the horizon (0.46) so it never sits on the road,
      // and below the topbar so it never sits on the HUD
      else if (!(cfg.pods[0].fy > 0.11 && cfg.pods[0].fy < 0.26)) bad.push(n + ": interior mirror is not high on the screen (fy " + cfg.pods[0].fy + ")");
    }
    frames.add(cfg.frame);
  }
  // and they must not all look alike: the housings differ per car the way the dashboards do
  check(side + " with wing pods, " + centre + " with an interior mirror, " + frames.size + " housing styles",
    bad.length === 0 && side === 13 && centre === 34 && frames.size >= 6, bad.slice(0, 4).join(" | "));
}

/* ---------- the DB5 mission stages are stages, not circuits ----------
   The sea mission shipped once as a CIRCUITS entry with corners renamed "Tanker deck" and
   nothing drawn — a lap of Monaco in a costume. There are now five stage missions, and
   these are the properties that make them that rather than tracks. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Aston Martin DB5 simulator.html", "utf8");
  const WANT = {
    SEA_STAGES: ["crabby", "ride", "climb", "lip", "chase", "bridge", "helipad", "water", "dead", "sub"],
    TOK_STAGES: ["party", "washroom", "race", "bolt", "alley", "rainbow", "apron"],
    LON_STAGES: ["gears", "street", "pits", "range", "mall"],
    GF_STAGES: ["pass", "tilly", "recce", "yard", "woods", "mirror"],
    NTTD_STAGES: ["sassi", "steps", "piazza", "smoke", "viaduct"],
    PAR_STAGES: ["boulevard", "quay", "market", "stalls", "corner"],
    PC_STAGES: ["coast", "ivan", "valet", "floor", "meeting", "blown", "race", "getaway"],
  };
  const bad = [], surfaces = new Set();
  let total = 0;
  for (const [name, ids] of Object.entries(WANT)) {
    const blk = (src.match(new RegExp("^const " + name + " = \\[[\\s\\S]*?\\n\\];", "m")) || [""])[0];
    const got = [...blk.matchAll(/id: "(\w+)"/g)].map((m) => m[1]);
    for (const m of blk.matchAll(/surf: "(\w+)"/g)) surfaces.add(m[1]);
    total += got.length;
    if (got.join(",") !== ids.join(",")) bad.push(name + ": " + got.join(","));
    // every stage must say where you are, what has to happen, and how it is drawn
    const n = (blk.match(/name: "/g) || []).length, wh = (blk.match(/where: "/g) || []).length,
          hn = (blk.match(/hint: "/g) || []).length, sf = (blk.match(/surf: "/g) || []).length;
    if (n !== ids.length || wh !== ids.length || hn !== ids.length || sf !== ids.length)
      bad.push(name + ": a stage is missing its name/where/hint/surf");
  }
  check("7 stage missions, " + total + " stages, " + surfaces.size + " distinct surfaces",
    bad.length === 0 && total === 46 && surfaces.size >= 30, bad.join(" | "));
  // a surface a stage names with no renderer behind it is a stage you drive through a void
  {
    const noDraw = [...surfaces].filter((sf) => !src.includes('case "' + sf + '":'));
    check("every surface a stage names is actually drawn", noDraw.length === 0, "no renderer: " + noDraw.join(","));
  }
  // Tokyo and London were empty streets: a World Grand Prix with nobody watching it, and a
  // city centre with no other cars in it.
  {
    const gaps = [];
    const body = (name) => (src.match(new RegExp("function " + name + "\\([\\s\\S]*?\\n  \\}")) || [""])[0];
    if (!/function crowd\(/.test(src)) gaps.push("no crowd()");
    if (!/function traffic\(/.test(src)) gaps.push("no traffic()");
    if (!/crowd\(/.test(body("drawNeon"))) gaps.push("the Tokyo night race has nobody watching it");
    const city = body("drawCity");
    if ((city.match(/crowd\(/g) || []).length < 2) gaps.push("London and The Mall are empty");
    if (!/traffic\(/.test(city)) gaps.push("The Mall has no other cars on it");
    if (!/traffic\(/.test(body("drawSuspension"))) gaps.push("the Rainbow Bridge is empty");
    if (!/crowd\(/.test(body("drawPitlane")) && !/roundRect/.test(body("drawPitlane"))) gaps.push("the pit lane has no crew");
    check("Tokyo and London are populated — crowds behind the barriers, traffic on the roads",
      gaps.length === 0, gaps.join(" | "));
  }
  const kit = ["seaHarpoon", "seaMagnet", "seaShutter", "seaRocket", "seaCharge", "seaFoil",
               "seaTorpedo", "seaDive", "seaSonar", "seaBlast", "seaClamp", "seaAlarm"];
  const missing = kit.filter((k) => !new RegExp("\\b" + k + "\\(").test(src));
  check("the mission equipment each has its own synthesised sound", missing.length === 0, "missing: " + missing.join(","));
  check("a stage draws its own world — no circuit kerbs, racing line, start/finish or roadside",
    /if \(pal\.env !== "sea"\) drawStartFinishLine\(\)/.test(src)
    && /if \(pal\.env === "sea"\) return;/.test(src)
    && /if \(!onStage\(\)\) \{ drawRoadside/.test(src));
  check("a stage run is one-way — braking cannot drop you back a stage",
    /s\.i < state\.stage\.i\) s = state\.stage/.test(src));
}

/* ---------- the Jesko is two cars ----------
   Z is the FUEL MAP (petrol 1,280 hp / E85 1,600) and Y is the BODY: the Attack, with the
   boomerang wing and 1,400 kg of downforce, or the Absolut, with the wing deleted for two
   rear-deck fins, 85 mm more tail and Cd 0.278. They are different axes and both are opt-in,
   so the certified 0-100 is the Attack car on petrol. Assert all of that stays true. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Koenigsegg Jesko simulator.html", "utf8");
  const gaps = [];
  if (!/KeyZ" && !e\.repeat\) app\.toggleFuel\(\)/.test(src)) gaps.push("Z is no longer the fuel map");
  if (!/KeyY" && !e\.repeat\) app\.toggleAbsolut\(\)/.test(src)) gaps.push("Y is not the Absolut body");
  if (!/dragCd: 0\.278/.test(src)) gaps.push("the Absolut has lost Cd 0.278");
  if (!/downforceKg: 150/.test(src)) gaps.push("the Absolut has lost its 150 kg");
  if (!/downforceKg: 1400/.test(src)) gaps.push("the Attack has lost its 1,400 kg");
  if (!/claimedTopKmh: 531/.test(src)) gaps.push("the 531 km/h claim is gone");
  // the body has to be real geometry, not a label
  for (const id of ["kgAbsolutFins", "kgAbsolutTail", "kgWheelCovers", "kgWingPylons"])
    if (!src.includes('id="' + id + '"')) gaps.push("no " + id + " in the exterior art");
  // both start hidden and both are off by default, or perf-test would see them
  if (!/absolut: false/.test(src)) gaps.push("the Absolut is on by default");
  if (!/e85: false/.test(src)) gaps.push("E85 is on by default");
  // applyBodyArt is in a different { } block from injectExterior — it must go through app
  if (/\n    applyBodyArt\(\);\s+\/\/ whichever body/.test(src))
    gaps.push("injectExterior calls applyBodyArt across a block boundary");
  check("the Jesko carries both bodies — Z the fuel map, Y the Absolut", gaps.length === 0, gaps.join(" | "));
}

/* ---------- a <title> that names a displacement must name its OWN ----------
   Six cars cloned from the Supra kept the 2JZ's "3.0" in the browser tab, on engines of
   5.2, 4.4, 3.9, 6.1, 2.0 and 3.8 litres — and six wore Toyota's GR badge on the start
   card, including a 1993 McLaren and a Gordon Murray. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const title = (src.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const litres = (title.match(/(\d\.\d)\s*(?:L\b|litre|naturally|turbo|twin-turbo|sequential|supercharged)/i) || [])[1];
    if (!litres) continue;                     // most titles name no displacement at all
    checked++;
    const cc = +(src.match(/displacementCc: (\d+)/) || [])[1];
    if (!cc) { bad.push(f + ": title says " + litres + " L but the SPEC has no displacement"); continue; }
    // a marketing displacement is sometimes rounded and sometimes truncated: the T.33s
    // 3,994 cc Cosworth is a "3.9" and the M5s 4,395 cc S68 is a "4.4". Accept either.
    const want = [(Math.round(cc / 100) / 10).toFixed(1), (Math.floor(cc / 100) / 10).toFixed(1)];
    if (!want.includes(litres)) bad.push(f.replace(/ simulator.html/i, "") + ': title says ' + litres + " L, SPEC says " + want.join(" or "));
  }
  check(checked + " titles checked — each quotes its own displacement", bad.length === 0, bad.join(" | "));
}

/* ---------- nothing in a stage can outrun the stage ----------
   stageCapMps() clamps the PLAYER to what the place allows — 34 km/h down a washroom
   corridor, 62 along a marina quay — but updateRivals only ever clamped a rival to its own
   topMps. Rod left that corridor at 130 and Ivan left the quay at 118, and the gate on both
   stages is "get to him". Fifteen enemies across seven stages could outrun the player. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Aston Martin DB5 simulator.html", "utf8");
  const bad = [];
  if (!/const sc = stageCapMps\(\);/.test(src)) bad.push("updateRivals no longer applies the stage cap");
  if (!/r\.catchable \? 0\.82 : 1/.test(src)) bad.push("a car the stage is about catching is not held under the cap");
  const caps = {};
  for (const m of src.matchAll(/id: "(\w+)", to: \d+, cap: (\d+)/g)) caps[m[1]] = +m[2];
  let stage = null, checked = 0;
  for (const line of src.split("\n")) {
    const k = line.match(/^  (\w+): \[$/); if (k) stage = k[1];
    const e = line.match(/name: "([^"]*)".*top: (\d+).*role: "(\w+)"/);
    if (!e || !stage || !caps[stage]) continue;
    if (!["target", "guard", "shooter", "boarder"].includes(e[3])) continue;
    checked++;
    // the flag is what makes it fair; without the runtime clamp this would be a hard fail,
    // so assert the clamp exists (above) AND that a CATCHABLE car is declared as one
    // only the car the stage is ABOUT must be catchable — on the washroom stage that is Rod,
    // not the two lemons working him over, who belong at the cap
    const mustCatch = ["washroom", "ivan", "valet"].includes(stage)
      && (e[3] === "target" || /tag: "/.test(line));
    if (mustCatch && !/catchable: true/.test(line))
      bad.push(stage + ": " + e[1] + " is the car you must reach, but is not marked catchable");
  }
  check(checked + " stage enemies — none can outrun the place it is standing in",
    bad.length === 0, bad.join(" | "));
}

/* ---------- a brand circuit has to BE that circuit ----------
   Six cars cloned from the Supra never had their brand track re-derived, so six different
   buttons — Bathurst, Norisring, Dunsfold, Goodwood, Tsukuba, SUGO — all loaded FUJI
   SPEEDWAY's geometry and quoted Fuji's blurb; and six brand rival grids were the Supra's
   1990s JDM field with the donor's name find-replaced into it, which is where
   "Gordon Murray T.33 RZ (A80)" and "Nissan Skyline M5 R34 V-Spec" came from. Both are
   drawn on screen. Assert the blurb names its own circuit, that no two cars ship the same
   brand geometry, and that no rival is named after the car it is racing. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const SHARED = /monaco|nürburgring|nordschleife|suzuka|silverstone|nardò|prologue|stage |mission/i;
  const bad = [], geometry = new Map(), fields = new Map();
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), me = f.replace(/ simulator\.html/i, "");
    // the brand-special circuit is the first CIRCUITS key that is not one of the shared seven
    const keys = [...src.matchAll(/^  "([^"]+)": \{$/gm)].map((m) => m[1]).filter((k) => !SHARED.test(k));
    if (!keys.length) continue;
    const key = keys[0];
    const blk = (src.match(new RegExp('  "' + key.replace(/[.*+?^${}()|[\]\\]/g, "\\/* ---------- the start card is the first thing anybody reads ----------") + '": \\{[\\s\\S]*?\\n  \\},')) || [""])[0];
    if (!blk) continue;
    checked++;
    // the blurb must not name a DIFFERENT circuit than the key it sits under
    const blurb = (blk.match(/blurb: "([^"]*)"/) || [])[1] || "";
    const head = key.split(/[,—(]/)[0].trim().split(" ").filter((w) => w.length > 3);
    if (head.length && !head.some((w) => blurb.toLowerCase().includes(w.toLowerCase())))
      bad.push(me + ': "' + key + '" is described as "' + blurb.slice(0, 52) + '…"');
    // two cars must not ship byte-identical brand geometry under different names
    const geo = (blk.match(/c\(\d+[^)]*\)/g) || []).join("|");
    if (geo) {
      if (geometry.has(geo) && geometry.get(geo).key !== key)
        bad.push(me + ' ("' + key + '") has the same layout as ' + geometry.get(geo).me + ' ("' + geometry.get(geo).key + '")');
      else geometry.set(geo, { me, key });
    }
    // and two cars must not field the SAME brand grid. A car legitimately races its own
    // siblings (a Valkyrie meets an AMR Pro, an Agera RS meets an Agera), so the name alone
    // proves nothing — but six identical fields, differing only by a find-replaced word, is
    // exactly the fault: "Gordon Murray T.33 RZ (A80)", "Nissan Skyline M5 R34 V-Spec".
    const grid = (src.match(/const \w+_GRID = \[[\s\S]*?\n  \];/) || [""])[0];
    const names = [...grid.matchAll(/name: "([^"]*)"/g)].map((m) => m[1]);
    // normalise away the host's own name so a pure find-replace collapses to one string
    const sig = names.map((n) => n.split(" ").filter((w) => !me.includes(w)).join(" ")).join("|");
    if (sig.replace(/\W/g, "").length > 20) {
      if (fields.has(sig) && fields.get(sig) !== me)
        bad.push(me + " fields the same grid as " + fields.get(sig));
      else fields.set(sig, me);
    }
  }
  check(checked + " brand circuits — each its own layout, each its own field",
    bad.length === 0, bad.slice(0, 8).join(" | "));
}

/* ---------- the start card is the first thing anybody reads ----------
   Eleven cars were wearing their donor's maker line: the DB5 and the 300 SLR said
   "Ferrari · Maranello", the Yangwang U9 was built in Croatia, and six cars cloned from the
   Supra — a 1993 McLaren among them — said "Toyota Gazoo Racing". Assert the line names the
   marque on the badge. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  // the word in the filename that has to appear in the maker line
  const MARQUE = {
    "Bugatti": "Bugatti", "Pagani": "Pagani", "McLaren": "McLaren", "Ferrari": "Ferrari",
    "Koenigsegg": "Koenigsegg", "Tesla": "Tesla", "Mercedes": "Mercedes|AMG|Daimler",
    "Aston": "Aston Martin", "Lamborghini": "Lamborghini", "Porsche": "Porsche",
    "Toyota": "Toyota", "Hennessey": "Hennessey", "Lotus": "Lotus", "Rimac": "Rimac",
    "Chevrolet": "Chevrolet|Corvette", "Mitsubishi": "Mitsubishi", "Nissan": "Nissan",
    "BMW": "BMW", "Audi": "Audi", "Gordon": "Gordon Murray", "Yangwang": "Yangwang|BYD",
    "Czinger": "Czinger", "Dacia": "Dacia", "Ford": "Ford", "Prodrive": "Prodrive",
    "Alpine": "Alpine", "Williams": "Williams", "Racing": "Racing Bulls", "Haas": "Haas",
    "Cadillac": "Cadillac", "Red": "Red Bull",
  };
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const ring = (src.match(/<div class="ring">([^<]*)</) || [])[1];
    if (!ring) { bad.push(f + ": no maker line at all"); continue; }
    const key = Object.keys(MARQUE).find((k) => f.startsWith(k));
    if (!key) { bad.push(f + ": unknown marque"); continue; }
    checked++;
    if (!new RegExp(MARQUE[key], "i").test(ring)) bad.push(f.replace(/ simulator.html/i, "") + ' says "' + ring + '"');
  }
  check("all " + checked + " start cards name the maker that built the car",
    bad.length === 0, bad.slice(0, 6).join(" | "));
}

/* ---------- a car must quote its OWN numbers ----------
   The 917K is a clone of the 250 GTO and it inherited that car's strings: at 318 km/h it
   was warning you that you were "nearing the GTO's ~280 km/h ceiling". Assert that the
   speed warning names a number belonging to the car that is saying it. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), n = f.replace(/ simulator\.html/i, "");
    const warn = src.match(/warn\.push\("nearing ([^"]*)"\)/);
    if (!warn) continue;                      // most cars have no ceiling warning at all
    checked++;
    const top = +(src.match(/topSpeedKmh: (\d+)/) || [])[1];
    const quoted = (warn[1].match(/(\d{3})\s*km\/h/) || [])[1];
    if (!top || !quoted) { bad.push(n + ": cannot read its own ceiling"); continue; }
    if (Math.abs(+quoted - top) > top * 0.1) bad.push(n + " warns about " + quoted + " but tops out at " + top);
  }
  check(checked + " ceiling warnings, each quoting its own car's top speed", bad.length === 0, bad.join(" | "));
}

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e.message || e)));
await page.goto(BASE, { waitUntil: "domcontentloaded" });

console.log("▶ garage");
check("forty-seven car cards render", await page.locator(".car-card").count() === 47);
check("host board present", await page.locator("#activeHostList").count() === 1);

/* ---------- every card must be WIRED, not just rendered ----------
   The car keys are read off the page instead of being listed here, because a hardcoded
   list is exactly how five cards once shipped that rendered perfectly and did nothing:
   they had no entry in the shell's `cars` registry, so openPractice() returned at
   `if (!car) return;` and every button on them was inert — and this file never tried
   them, because they were not in the list. Derive, never enumerate. */
const CAR_KEYS = await page.$$eval("[data-car-card]", (els) => els.map((e) => e.dataset.carCard));
check(`every card key discovered from the page (${CAR_KEYS.length})`, CAR_KEYS.length === 47);

const wiring = await page.evaluate((keys) => keys.map((k) => ({
  key: k,
  practice: !!document.querySelector(`[data-practice="${k}"]`),
  online: !!document.querySelector(`[data-online="${k}"]`),
  learn: !!document.querySelector(`[data-learn="${k}"]`),
})), CAR_KEYS);
const unwired = wiring.filter((w) => !w.practice || !w.online || !w.learn);
check("every card has practice / online / learning buttons", unwired.length === 0,
  unwired.length ? JSON.stringify(unwired) : "");

/* Open a car from the garage and wait for its sim to be live in the iframe. The app's
   global name is discovered inside the frame rather than looked up in a table here — one
   less hardcoded per-car list to forget to update. Returns the frame and that name. */
async function openCar(key) {
  await page.click(`[data-practice="${key}"]`);
  await page.waitForFunction(() => {
    const w = document.getElementById("simFrame").contentWindow;
    if (!w) return false;
    return Object.keys(w).some((k) => /App$/.test(k) && w[k] && w[k].updatePhysics);
  }, null, { timeout: 20000 });
  const frame = page.frames().find((f) => f !== page.mainFrame());
  const app = await frame.evaluate(() =>
    Object.keys(window).find((k) => /App$/.test(k) && window[k] && window[k].updatePhysics));
  return { frame, app };
}

/* ---------- private practice: AI rivals must survive ---------- */
console.log("▶ private practice (AI rival grid)");
for (const key of ["bugatti", "tesla"]) {
  const { frame, app } = await openCar(key);
  await frame.click("#startBtn");
  await frame.evaluate((a) => window[a].selectCircuit("Suzuka Circuit"), app);
  await page.waitForTimeout(2600);   // > 3 shell render ticks: the old bug wiped rivals here
  const r = await frame.evaluate((a) => ({
    rivals: window[a].state.rivals.length,
    grid: window[a].state.raceGrid,
  }), app);
  check(`${key}: AI rivals alive after 2.6 s (${r.rivals} cars)`, r.rivals > 0 && r.grid === true);
  await page.click("#practiceBackBtn");
}

/* ---------- every sim boots inside the shell ----------
   CAR_KEYS comes off the page, so a newly added card is tested the moment it exists —
   including that Private Practice actually puts a running simulator in the iframe. */
console.log("▶ all sims boot in the shell");
for (const key of CAR_KEYS) {
  const { frame, app } = await openCar(key);
  const moved = await frame.evaluate((a) => {
    const x = window[a];
    x.state.ignition = true; x.setGear("G", 1); x.state.keys.KeyW = true;
    for (let i = 0; i < 240; i++) x.updatePhysics(1 / 120);
    x.state.keys.KeyW = false;
    return x.state.speedMps;
  }, app);
  check(`${key}: ${app} boots, physics advance (2 s -> ${(moved * 3.6).toFixed(0)} km/h)`, moved > 5);
  await page.click("#practiceBackBtn");
}

/* ---------- online rules ---------- */
console.log("▶ online mode rules");
await page.click('[data-online="ferrari"]');
await page.waitForFunction(() => {
  const w = document.getElementById("simFrame").contentWindow;
  return w && w.FerrariApp && w.FerrariApp.updatePhysics && window.__mucs;
});
const frame = page.frames().find((f) => f !== page.mainFrame());
await frame.click("#startBtn");
await page.waitForTimeout(900);
let res = await page.evaluate(() => {
  const app = window.__mucs.getSimApp();
  return { rivals: app.state.rivals.length, grid: app.state.raceGrid, gridBtnDisabled: !!document.getElementById("simFrame").contentDocument.getElementById("gridBtn").disabled };
});
check("AI grid replaced (0 rivals before joiners)", res.rivals === 0 && res.grid === false);
check("sim's Rival Grid button locked", res.gridBtnDisabled);

// fake two remote racers (no relays inside the sandbox) and a host claiming the room
res = await page.evaluate(() => {
  const M = window.__mucs;
  M.localId = "me";
  M.hostId = "host-1";
  const mk = (id, name, d) => ({ id, name, car: "bugatti", carLabel: "Chiron SS 300+", body: "#4d8dff", stripe: "#ff8a36",
    distanceM: d, laneOffset: 1.5, speedMps: 60, speedKmh: 216, brake: 0, throttle: 1, gear: "5", route: "Suzuka Circuit", lapMs: 0, bestMs: 0, at: Date.now() });
  const m = new Map(); m.set("host-1", mk("host-1", "Ada", 220)); m.set("p2", mk("p2", "Linus", 180));
  M.testPlayers = m;
  M.injectRemoteRacers();
  const app = M.getSimApp();
  return { rivals: app.state.rivals.map((r) => r.name), grid: app.state.raceGrid };
});
check("remote racers appear as rivals", res.rivals.length === 2 && res.grid === true, JSON.stringify(res.rivals));

// joiner circuit lock
res = await page.evaluate(() => {
  window.__mucs.isHost = false;
  window.__mucs.enforceOnline();
  const doc = document.getElementById("simFrame").contentDocument;
  const btns = Array.from(doc.querySelectorAll("[data-circuit]"));
  return btns.every((b) => b.disabled);
});
check("joiner circuit buttons locked (host sets the track)", res);

/* ---------- race control: track from host + lights + hold + release ---------- */
console.log("▶ race control");
await page.evaluate(() => {
  const M = window.__mucs;
  M.hostId = "";
  M.hostNetId = "";
  M.applyCfg({ type: "cfg", hostId: "host-1", track: "Suzuka Circuit", phase: "lobby", at: Date.now() }, "relay-host");
  M.applyCfg({ type: "cfg", hostId: "host-1", track: "Silverstone Circuit", phase: "lobby", at: Date.now() }, "relay-host");
  M.enforceOnline();
});
await page.waitForTimeout(700);
res = await page.evaluate(() => {
  const app = window.__mucs.getSimApp();
  return { route: app.state.route.name, active: app.state.route.active, hostNetId: window.__mucs.hostNetId };
});
check("host's later track applied even when host network id differs", res.active && res.route === "Silverstone Circuit" && res.hostNetId === "relay-host", res.route);

await page.evaluate(() => {
  const M = window.__mucs;
  M.applyCfg({ type: "cfg", hostId: "host-1", track: "Suzuka Circuit", phase: "countdown",
    goAt: Date.now() + 6800, grid: ["host-1", "me", "p2"], at: Date.now() }, "relay-host");
});
await page.waitForTimeout(1200);
res = await page.evaluate(() => {
  const M = window.__mucs;
  const app = M.getSimApp();
  return {
    holding: M.raceLocal.holding, gridIndex: M.raceLocal.gridIndex,
    speed: app.state.speedMps, dist: app.state.distanceM,
    lightsShown: document.getElementById("startLights").classList.contains("show"),
  };
});
check("grid hold: car pinned to slot P2", res.holding && res.gridIndex === 1 && res.speed === 0 && Math.abs(res.dist + 17) < 0.5, `dist=${res.dist.toFixed(1)}`);
check("start lights overlay visible", res.lightsShown);

await page.waitForTimeout(4500);
res = await page.evaluate(() => {
  const lit = Array.from(document.querySelectorAll("#startLights .lamp")).filter((l) => l.classList.contains("on")).length;
  return { lit };
});
check(`red lights coming on one per second (${res.lit} lit)`, res.lit >= 2 && res.lit <= 5);

await page.waitForTimeout(2600);   // past goAt
res = await page.evaluate(() => {
  const M = window.__mucs;
  const app = M.getSimApp();
  // player floors it after release
  app.state.keys.KeyW = true;
  for (let i = 0; i < 360; i++) app.updatePhysics(1 / 120);
  app.state.keys.KeyW = false;
  return {
    released: M.raceLocal.released, holding: M.raceLocal.holding,
    assist: app.state.assist, testDriver: app.state.testDriver, cruise: app.state.adaptiveCruise,
    speedKmh: app.state.speedMps * 3.6,
  };
});
check("lights out -> hold released", res.released && !res.holding);
check("assists OFF at launch (assist/test driver/cruise)", res.assist === false && res.testDriver === false && res.cruise === false);
check(`car free to launch (${res.speedKmh.toFixed(0)} km/h after 3 s)`, res.speedKmh > 100);

check("no page errors", pageErrors.length === 0, pageErrors.slice(0, 3).join(" | "));

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll browser checks passed.");
process.exit(failures ? 1 : 0);
