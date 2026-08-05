// tests/db5-missions.mjs — play Tokyo, Paris, Porto Corsa, London, Goldfinger and Matera
// end to end, then lose each one the way its own stage says it is lost.
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
  let out; try { out = await fn(p); } catch (e) { out = { ok: false, msg: "THREW " + e.message.slice(0, 90) }; }
  const ok = out.ok && !errs.length; if (!ok) bad++;
  console.log(`${ok ? "OK " : "!! "} ${label.padEnd(50)} ${out.msg}${errs.length ? "  ERR " + errs[0].slice(0, 110) : ""}`);
  await p.close();
};

/* one scripted player that knows what each stage of each mission wants */
const PLAY = (route, seconds) => `(() => {
  const a = window.Db5App, s = a.state, log = [];
  s.raceGrid = true; a.selectCircuit(${JSON.stringify(route)}); a.seedRivals();
  s.assist = true; s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true;
  s.doors = { driver: false, passenger: false };
  let last = "", frames = 0;
  for (let i = 0; i < 120 * ${seconds} && !(s.mission && s.mission.over); i++) {
    const st = s.stage, id = st ? st.id : "", q = s.q;
    if (id !== last) { log.push(id + "@" + Math.round(s.distanceM)); last = id; }
    s.keys.KeyW = true; s.keys.Space = false; s.keys.KeyA = false; s.keys.KeyD = false;
    if ((id === "sassi" || id === "rainbow" || id === "piazza") && q.shieldTarget < 0.5) a.qFire("shield");
    s.gearMode = s.gearMode === "R" ? "R" : "G";
    // --- TOKYO
    // no teleporting: drive at him and take it when you are actually there
    if (id === "washroom" && q.hook < 1) a.seaFire("hook");
    if (id === "alley") {
      if (!q.smokeUsed) a.qFire("smoke");
      const foes = (s.rivals || []).filter(r => !r.down && (r.role === "guard" || r.role === "shooter"));
      for (const f of foes.slice(0, 2)) { f.distM = s.distanceM + 16; f.lane = s.laneOffset; }
      q.gun = true; q.ammo = 104; q.muzzle = 1;
    } else { q.gun = false; q.muzzle = 0; }
    // --- LONDON
    if (id === "pits" && q.hook < 1) { s.gearMode = "R"; a.seaFire("hook"); s.gearMode = "G"; }
    if (id === "range" && q.rocket === 0) a.seaFire("rocket");
    // --- GOLDFINGER
    if (id === "tilly") {
      const t = (s.rivals || []).find(r => r.role === "shooter" && !r.down);
      if (t) { t.distM = s.distanceM + 2; t.lane = s.laneOffset; }
      if (q.slashTarget < 0.5) a.qFire("slash");
    }
    if (id === "yard") {
      const foes = (s.rivals || []).filter(r => !r.down && (r.role === "guard" || r.role === "shooter"));
      for (const f of foes.slice(0, 2)) { f.distM = s.distanceM + 16; f.lane = s.laneOffset; }
      q.gun = true; q.ammo = 104; q.muzzle = 1;
    }
    if (id === "woods") {
      const bd = (s.rivals || []).find(r => r.role === "boarder" && !r.down);
      if (bd) { bd.distM = s.distanceM - 8; bd.lane = s.laneOffset; bd.blinded = 0; }
      if (bd && bd.onBoard) q.ejectT = 1.0;
    }
    if (id === "mirror") {
      const rel = st.to - 60 - s.distanceM;
      if (rel < 260) { s.keys.KeyW = Math.abs(s.speedMps) < 4; s.keys.Space = Math.abs(s.speedMps) > 6; }
    }
    // --- PARIS
    if (id === "market" && !q.radar) a.qFire("radar");
    if (id === "stalls") {
      const t = (s.rivals || []).find(r => r.role === "target" && !r.down);
      if (t) t.distM = Math.min(t.distM, s.distanceM + 60);      // stay with him
      for (const bx of q.boxes || []) bx.lane = (s.laneOffset || 0) + 9;   // steer round the stock
    }
    if (id === "corner") {
      s.keys.KeyW = Math.abs(s.speedMps) * 3.6 < 12; s.keys.Space = Math.abs(s.speedMps) * 3.6 > 20;
      if (q.shots < 1) {
        if (!q.cam) a.seaFire("cam");
        else { q.camAim = q.camSubject; s.speedMps = Math.min(s.speedMps, 1); a.seaFire("cam"); }
      }
    }
    // --- PORTO CORSA
    if (id === "ivan") {
      const iv = (s.rivals || []).find(r => r.tag === "ivan" && !r.down);
      if (iv) s.laneOffset = iv.lane;              // line up on him — but close it yourself
      q.gun = true; q.ammo = 104; q.muzzle = 1;
    }
    if (id === "valet" && q.hook < 1) a.seaFire("hook");
    if (id === "floor" && q.plate === 0) { q.plateT = 0; a.qFire("plate"); }
    if (id === "meeting") {
      s.keys.KeyW = Math.abs(s.speedMps) * 3.6 < 12; s.keys.Space = Math.abs(s.speedMps) * 3.6 > 20;
      if (q.shots < 3) {
        if (!q.cam) a.seaFire("cam");
        else { q.camAim = q.camSubject; s.speedMps = Math.min(s.speedMps, 1); a.seaFire("cam"); }
      }
    }
    if (id === "blown") {
      const foes = (s.rivals || []).filter(r => !r.down && (r.role === "guard" || r.role === "shooter"));
      for (const f of foes.slice(0, 2)) { f.distM = s.distanceM + 16; f.lane = s.laneOffset; }
      q.gun = true; q.ammo = 104; q.muzzle = 1;
    }
    if (id === "getaway" && !q.smokeUsed) a.qFire("smoke");
    // --- MATERA
    if (id === "piazza") {
      s.keys.KeyW = false; s.keys.Space = Math.abs(s.speedMps) > 8;
      s.steer = 1; q.gun = true; q.ammo = 104;
      if ((q.spinDeg || 0) >= 345) { s.keys.Space = false; s.keys.KeyW = true; q.gun = false; }
    }
    if (id === "smoke" && !q.smokeUsed) a.qFire("smoke");
    a.updatePhysics(1 / 120); frames++;
  }
  return { log, over: !!(s.mission && s.mission.over), won: !!(s.mission && s.mission.won),
           cause: s.mission ? s.mission.cause : "", secs: Math.round(frames / 120),
           done: s.mission ? Object.keys(s.mission.done) : [], objs: s.mission ? s.mission.def.objectives.length : 0 };
})()`;

for (const [route, secs, stages] of [
  ["Mission — Tokyo, World Grand Prix", 620, 7],
  ["Mission — Paris, the parts market", 480, 5],
  ["Mission — Porto Corsa, the casino", 900, 8],
  ["Mission — London, the last race", 480, 5],
  ["Mission — Furka Pass & Auric Enterprises, 1964", 620, 6],
  ["Mission — Matera, 2021", 460, 5],
]) {
  await run(route.replace("Mission — ", "") + ": played to the end", async (p) => {
    const r = await p.evaluate(PLAY(route, secs));
    return { ok: r.won && r.log.length === stages,
             msg: `${r.log.length}/${stages} stages in ${r.secs}s · ${r.done.length}/${r.objs} objectives · ${r.log.join(" → ")}` +
                  (r.won ? "" : `  LOST: ${r.cause}`) };
  });
}

/* losing each one the way its own stage says you lose it */
const fail = async (label, route, body, want) => run(label, async (p) => {
  const r = await p.evaluate(`(() => {
    const a = window.Db5App, s = a.state;
    s.raceGrid = true; a.selectCircuit(${JSON.stringify(route)}); a.seedRivals();
    s.assist = true; s.gearMode = "G"; s.curGear = 1; s.ignition = true; s.harness = true;
    s.doors = { driver: false, passenger: false };
    ${body}
    return { over: !!(s.mission && s.mission.over), won: !!(s.mission && s.mission.won),
             cause: s.mission ? s.mission.cause : "", stage: s.stage ? s.stage.id : "" };
  })()`);
  return { ok: r.over && !r.won && r.cause.includes(want), msg: `${r.stage} — "${r.cause}"` };
});

await fail("Tokyo: never reach Rod → they finish with him", "Mission — Tokyo, World Grand Prix",
  `s.distanceM = 700; for (let i = 0; i < 120 * 70 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "finished with Rod");
await fail("London: the five minutes run out", "Mission — London, the last race",
  `s.distanceM = 4100; s.q.hook = 1; a.updatePhysics(1/120);
   s.q.outOfRange = true; s.q.bombT = 3;
   for (let i = 0; i < 120 * 8 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "five minutes");
await fail("Goldfinger: straight into the mirror wall", "Mission — Furka Pass & Auric Enterprises, 1964",
  `s.distanceM = 8000; s.q.slash = 1; s.mission.done.mustang = true; s.mission.done.guards = true;
   s.mission.done.boarder = true; s.speedMps = 40;
   for (let i = 0; i < 120 * 40 && !s.mission.over; i++) { s.keys.KeyW = true; s.speedMps = Math.max(s.speedMps, 30); a.updatePhysics(1/120); }`,
  "Into the wall");
await fail("Paris: lose Tomber in the stalls", "Mission — Paris, the parts market",
  `s.distanceM = 2850; a.updatePhysics(1/120);
   const t = (s.rivals || []).find(r => r.role === "target"); if (t) t.distM = s.distanceM + 400;
   for (let i = 0; i < 120 * 6 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "lost him");
await fail("Porto Corsa: go in on BMT 216A and the doorman knows the number", "Mission — Porto Corsa, the casino",
  `s.distanceM = 2850; a.updatePhysics(1/120); s.q.plate = 0;
   for (let i = 0; i < 120 * 90 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "BMT 216A");
await fail("Matera: never turn the car → they take it apart", "Mission — Matera, 2021",
  `s.distanceM = 2300; a.updatePhysics(1/120); s.mission.def.limitS = 40;
   for (let i = 0; i < 120 * 60 && !s.mission.over; i++) { s.keys.KeyW = true; a.updatePhysics(1/120); }`,
  "");

await b.close();
console.log(bad ? `\n${bad} FAILED` : "\nall green");
process.exit(bad ? 1 : 0);
