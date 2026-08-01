// tests/db5-missions-pacific.mjs — drive the Cars 2 opening end to end in a real browser, then break it on
// purpose in every way the stage machine says you can lose.
import { resolve } from "node:path"; import { pathToFileURL } from "node:url"; import { execSync } from "node:child_process";
const g = execSync("npm root -g").toString().trim();
const { chromium } = await import(pathToFileURL(resolve(g, "playwright/index.mjs")).href);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--autoplay-policy=no-user-gesture-required"] });
const REPO = process.env.REPO || process.cwd();
let bad = 0;

const run = async (label, fn) => {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(pathToFileURL(resolve(REPO, "Aston Martin DB5 simulator.html")).href);
  await p.waitForTimeout(1200);
  await p.evaluate(() => { const k = document.getElementById("keyOverlay"); if (k) k.style.display = "none"; });
  let out; try { out = await fn(p); } catch (e) { out = { ok: false, msg: "THREW " + e.message.slice(0, 90) }; }
  const ok = out.ok && !errs.length; if (!ok) bad++;
  console.log(`${ok ? "OK " : "!! "} ${label.padEnd(52)} ${out.msg}${errs.length ? "  ERR " + errs[0].slice(0, 110) : ""}`);
  await p.close();
};

/* the scripted player: it knows what each stage wants and does it, and nothing else */
const PLAYER = `
  const a = window.Db5App, s = a.state, log = [];
  s.raceGrid = true; a.selectCircuit(SEA); a.seedRivals();
  s.assist = true; s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true;
  s.doors = { driver: false, passenger: false };
  const key = (c, on) => { s.keys[c] = on; };
  let last = "", frames = 0;
  for (let i = 0; i < 120 * 420 && !(s.mission && s.mission.over); i++) {
    const st = s.stage, id = st ? st.id : "";
    if (id !== last) { log.push(id + "@" + Math.round(s.distanceM)); last = id; }
    key("KeyW", true); key("Space", false);
    // ---- what each stage wants
    if (id === "crabby" && s.distanceM > 320 && s.q.hook < 1) a.seaFire("hook");
    if (id === "ride" && s.distanceM > 2200 && s.q.hook < 2) a.seaFire("hook");
    if (id === "climb" && !s.q.magnet) a.seaFire("magnet");
    if (id === "lip" && s.q.shots < 3) {
      key("KeyW", false); key("Space", Math.abs(s.speedMps) > 3);        // stop and hold to shoot
      if (!s.q.cam) a.seaFire("cam");
      else if (Math.abs(s.speedMps) < 4) { s.q.camAim = s.q.camSubject; a.seaFire("cam"); }
    }
    if (id === "chase") {
      if (!s.q.slicks.length) a.qFire("oil");
      if (s.q.slicks.length && !(s.mission.done.burn)) { s.q.gun = true; s.q.muzzle = 1; }
      else { s.q.gun = false; s.q.muzzle = 0; }
    }
    if (id === "bridge" && s.q.charge == null && s.distanceM > 6250) a.seaFire("charge");
    if (id === "helipad" && s.q.foil < 0.5) a.seaFire("foil");
    if (id === "dead" && !s.q.tyres) a.seaFire("sub");
    if (id === "sub" && !s.q.sub) a.seaFire("sub");
    a.updatePhysics(1 / 120); frames++;
  }
  return { log, over: !!(s.mission && s.mission.over), won: !!(s.mission && s.mission.won),
           cause: s.mission ? s.mission.cause : "", dist: Math.round(s.distanceM),
           shots: s.q.shots, secs: Math.round(frames / 120),
           done: s.mission ? Object.keys(s.mission.done) : [] };
`;

await run("full play-through — all ten stages, mission complete", async (p) => {
  const r = await p.evaluate(`(() => { const SEA = "Mission — Oil Platform, Pacific"; ${PLAYER} })()`);
  return { ok: r.won && r.done.length === 7 && r.log.length === 10,
           msg: `${r.log.length} stages in ${r.secs}s · ${r.done.length}/7 objectives · ${r.log.join(" → ")}` };
});

/* ---- the failure paths, one page each ---- */
const fail = async (label, body, want) => run(label, async (p) => {
  const r = await p.evaluate(`(() => {
    const a = window.Db5App, s = a.state;
    s.raceGrid = true; a.selectCircuit("Mission — Oil Platform, Pacific"); a.seedRivals();
    s.assist = true; s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true;
    s.doors = { driver: false, passenger: false };
    ${body}
    return { over: !!(s.mission && s.mission.over), won: !!(s.mission && s.mission.won),
             cause: s.mission ? s.mission.cause : "", dist: Math.round(s.distanceM), stage: s.stage ? s.stage.id : "" };
  })()`);
  return { ok: r.over && !r.won && r.cause.includes(want), msg: `${r.stage}@${r.dist}m — "${r.cause}"` };
});

await fail("crabby: never fire the harpoon → Tony shoots Crabby",
  `for (let i = 0; i < 120 * 60 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "round through Crabby");

await fail("climb: magnets off → off the leg and into the water",
  `s.distanceM = 2680; s.q.hook = 2; s.speedMps = 14;
   for (let i = 0; i < 120 * 30 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "into the water");

await fail("lip: magnets dropped while hanging → straight down",
  `s.distanceM = 3560; s.q.hook = 2; s.q.magnet = true; s.speedMps = 5;
   for (let i = 0; i < 120 * 6 && !s.mission.over; i++) { if (i === 120) s.q.magnet = false; s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "upside down");

await fail("lip: hang there too long without the photographs",
  `s.distanceM = 3560; s.q.hook = 2; s.q.magnet = true; s.speedMps = 0;
   for (let i = 0; i < 120 * 90 && !s.mission.over; i++) { a.updatePhysics(1/120); }`,
  "deck hand");

await fail("bridge: still on the span when the limpet goes",
  `s.distanceM = 6300; s.q.hook = 2; s.q.magnet = true; s.q.shots = 3; s.mission.done.burn = true;
   s.q.blownAt = null; s.speedMps = 0;
   a.updatePhysics(1/120);                 // one step so the stage machine knows we are on the span
   a.seaFire("charge");
   for (let i = 0; i < 120 * 8 && !s.mission.over; i++) { s.speedMps = 0; a.updatePhysics(1/120); }`,
  "still on the span");

await fail("dead: torpedo arrives with no decoy out",
  `s.distanceM = 10150; s.q.hook = 2; s.q.shots = 3; s.q.foil = 1; s.q.blownAt = 6500;
   s.mission.done.burn = true; s.speedMps = 0;
   for (let i = 0; i < 120 * 40 && !s.mission.over; i++) a.updatePhysics(1/120);`,
  "instead of a decoy");

/* ---- gates: you physically cannot leave a stage with its job undone ---- */
await run("gates hold: no harpoon = no progress past 580 m", async (p) => {
  const r = await p.evaluate(`(() => {
    const a = window.Db5App, s = a.state;
    s.raceGrid = true; a.selectCircuit("Mission — Oil Platform, Pacific"); a.seedRivals();
    s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true; s.assist = true;
    s.doors = { driver: false, passenger: false };
    s.mission.def.limitS = 1e9;                       // take the clock out so only the gate can stop us
    for (let i = 0; i < 120 * 25; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); if (s.mission.over) break; }
    const held = Math.round(s.distanceM);
    a.seaFire("hook");
    for (let i = 0; i < 120 * 20; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); if (s.mission.over) break; }
    return { held, after: Math.round(s.distanceM), stage: s.stage ? s.stage.id : "" };
  })()`);
  return { ok: r.held <= 582 && r.after > 700, msg: `held at ${r.held} m, released to ${r.after} m (${r.stage})` };
});

/* ---- the kit must be inert everywhere else: certification is not allowed to notice it ---- */
await run("Finn's kit is inert off the Pacific stage", async (p) => {
  const r = await p.evaluate(() => {
    const a = window.Db5App, s = a.state;
    a.selectCircuit("Circuit de Monaco");
    const before = { f: a.stageStep ? 1 : 0, cap: 0 };
    ["hook", "magnet", "cam", "rocket", "charge", "foil", "sub"].forEach((k) => a.seaFire(k));
    s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true;
    for (let i = 0; i < 240; i++) { s.keys.KeyW = true; a.updatePhysics(1 / 120); }
    return { stage: s.stage, magnet: s.q.magnet, rocket: s.q.rocket, foil: s.q.foil, sub: s.q.sub,
             hook: s.q.hook, speed: Math.round(s.speedMps * 3.6), on: a.onSea() };
  });
  const inert = r.stage === null && !r.magnet && !r.rocket && !r.foil && !r.sub && !r.hook && !r.on;
  return { ok: inert && r.speed > 10, msg: `stage=${r.stage} kit all off, car still drives (${r.speed} km/h)` };
});

/* ---- and it renders: every stage must paint without throwing ---- */
await run("every stage renders", async (p) => {
  const r = await p.evaluate(() => {
    const a = window.Db5App, s = a.state;
    s.raceGrid = true; a.selectCircuit("Mission — Oil Platform, Pacific"); a.seedRivals();
    s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true;
    const marks = [200, 1500, 3000, 3700, 5000, 6500, 7400, 9000, 10500, 11300], painted = [];
    for (const d of marks) {
      s.distanceM = d; s.speedMps = 20; s.q.cam = d === 3700 ? 1 : 0;
      s.q.magnet = true; s.q.hookTo = "rig"; s.q.tyres = d > 10100; s.q.sub = d > 11000 ? 1 : 0;
      s.q.charge = d === 6500 ? d - 20 : null; s.q.chargeT = 2;
      a.updatePhysics(1 / 120);
      a.drawWorld();
      painted.push(s.stage ? s.stage.id : "?");
    }
    return { painted };
  });
  return { ok: new Set(r.painted).size === 10 && !r.painted.includes("?"), msg: r.painted.join(",") };
});

await b.close();
console.log(bad ? `\n${bad} FAILED` : "\nall green");
process.exit(bad ? 1 : 0);
