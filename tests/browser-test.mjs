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
  let side = 0, centre = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), n = f.replace(/ simulator\.html/i, "");
    if (/projectAhead\(Math\.max\(0\.6, o\.ahead\)/.test(src)) bad.push(n + ": rivals behind you pinned in front of you");
    if (!/BEHIND: 240/.test(src)) bad.push(n + ": road table does not reach as far back as forward");
    if (!/for \(let d = -240; d < -80; d \+= 12\)/.test(src)) bad.push(n + ": road is not DRAWN further back than 80 m");
    if (!/function drawRearView\(/.test(src) || !/function rearProject\(/.test(src)) bad.push(n + ": no rear-view renderer");
    if (!/drawMirrors\(w, h, pal\);/.test(src)) bad.push(n + ": rear view never drawn");
    // the mirror must sample BOTH directions: reverse, or spin the car, and the glass still works
    if (!/REAR_OFFS/.test(src)) bad.push(n + ": mirror only looks one way down the road");
    const m = src.match(/const MIRROR_STYLE = "(\w+)"/);
    if (!m) { bad.push(n + ": no mirror style"); continue; }
    if (m[1] !== (SIDE.test(f) ? "side" : "centre")) bad.push(n + ": wrong mirror style " + m[1]);
    if (m[1] === "side") side++; else centre++;
  }
  check(side + " cars with wing screens, " + centre + " with an interior mirror",
    bad.length === 0 && side === 13 && centre === 34, bad.slice(0, 4).join(" | "));
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
  check("5 stage missions, " + total + " stages, " + surfaces.size + " distinct surfaces",
    bad.length === 0 && total === 33 && surfaces.size >= 20, bad.join(" | "));
  const kit = ["seaHarpoon", "seaMagnet", "seaShutter", "seaRocket", "seaCharge", "seaFoil",
               "seaTorpedo", "seaDive", "seaSonar", "seaBlast", "seaClamp", "seaAlarm"];
  const missing = kit.filter((k) => !new RegExp("\\b" + k + "\\(").test(src));
  check("the mission equipment each has its own synthesised sound", missing.length === 0, "missing: " + missing.join(","));
  check("no kerbs, racing line, start/finish, armco or ambient traffic on a stage",
    /if \(pal\.env !== "sea"\) drawStartFinishLine\(\)/.test(src)
    && /if \(pal\.env === "sea"\) return;/.test(src)
    && /if \(!onStage\(\)\) \{ drawRoadside/.test(src));
  check("a stage run is one-way — braking cannot drop you back a stage",
    /s\.i < state\.stage\.i\) s = state\.stage/.test(src));
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
