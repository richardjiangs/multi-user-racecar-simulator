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
