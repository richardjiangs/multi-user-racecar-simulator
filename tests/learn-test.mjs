#!/usr/bin/env node
/* ============================================================================
   LEARNING-MODE VERIFICATION HARNESS
   ----------------------------------------------------------------------------
   Guards the coaching picture the driving school paints on screen:

   1. APEX DOT SIDE (empirical, on screen). The apex dot's lateral offset is
      +c.dir * (halfAt(apexD) - 1.4) — the sign was locked by rendering BOTH
      ±dir candidates in headless Chromium and measuring each against the
      DRAWN inside kerb (+dir landed on it for left- and right-handers;
      -dir landed on the outside kerb, as did the pre-fix dot that rode the
      then-inverted racing line).  This test re-renders a right-hander and a
      left-hander mid-corner, reconstructs the two drawn kerb chains from the
      real canvas calls, reads the bend side off the drawn road itself, and
      asserts the drawn dot hugs the INSIDE chain — plus the teal racing line
      spends the corner on the inside half.
   2. LIVE FRAC. The dot and the countdown boards track the live
      early/mid/late frac: DEFEND pulls the apex to 0.35, ATTACK pushes it to
      0.62, in real time, while TURN IN stays put (the corner cache still
      kills board jitter).  Verified by stubbing app.rivalGaps.
   3. LABEL/FRAC AUDIT. Statically across ALL 24 sims: every apex label
      matches its frac (EARLY 0.38 < MID 0.50 < LATE 0.58 ≤ V-LINE/ATTACK
      0.62, DEFEND 0.35 the lowest), the locked dot sign is intact, the
      racing line apexes on the inside (+dir), and the map inset no longer
      mirrors the world (car dot, blue line, apex dot).  At runtime, every
      rendered advice label is cross-checked against its live frac.
   4. MAP INSET. With the car parked by one world kerb, the inset car dot is
      on the same side of the track; blue line and inset apex dot sit on the
      inside of the drawn bend.

   Usage:  node tests/learn-test.mjs             # audit all 24, drive 3 sims
           node tests/learn-test.mjs f1mercedes  # drive one sim only
   ============================================================================ */
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const { execSync } = await import("node:child_process");
  const globalRoot = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(globalRoot, "playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* one road car, one F1 car, and the safety-car AMG cover the three learn curricula */
const DRIVE_CARS = {
  f1mercedes: { file: "Mercedes F1 2026 simulator.html", app: "MercedesF1App", label: "Mercedes F1 W17 (Formula 1 101)" },
  supra: { file: "Toyota GR Supra simulator.html", app: "SupraApp", label: "Toyota GR Supra (Race Car 101)" },
  amg: { file: "Mercedes-AMG GT Black Series simulator.html", app: "AmgApp", label: "Mercedes-AMG GT BS (Safety Car 101)" },
};
/* Suzuka is in every sim: one clean right-hander, one clean left-hander */
const CORNERS = [
  { name: "Turn 1 (right)", at: 600, dir: 1 },
  { name: "Spoon (left)", at: 3400, dir: -1 },
];

const fmt = (v, d = 1) => (v == null ? "—" : Number(v).toFixed(d));
let failures = 0;
const check = (label, ok, detail) => {
  console.log(`   ${ok ? "✔" : "✘ FAIL"}  ${label}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

/* ---------------------------------------------------------------------------
   STATIC AUDIT — every sim file carries the same, coherent advice table
--------------------------------------------------------------------------- */
function staticAudit() {
  console.log("\n▶ static audit — all sims: labels match fracs, locked signs intact");
  const sims = readdirSync(ROOT).filter(f => /simulator\.html$/i.test(f));
  check(`24 simulator files found`, sims.length === 24, `(${sims.length})`);
  for (const f of sims) {
    const src = readFileSync(resolve(ROOT, f), "utf8");
    const bad = [];
    const has = (s) => src.includes(s);
    const grab = (re) => { const m = src.match(re); return m ? parseFloat(m[1]) : null; };

    // the geometric classification table — labels must match their fracs
    const early = grab(/type = "EARLY APEX — double apex"; frac = ([\d.]+);/);
    const mid = grab(/type = "MID APEX — set up the next"; frac = ([\d.]+);/);
    const vline = grab(/type = "V-LINE · LATE APEX"; frac = ([\d.]+);/);
    const late = grab(/type = "LATE APEX"; frac = ([\d.]+);/);
    if (early == null || mid == null || vline == null || late == null) bad.push("classification table incomplete");
    else {
      if (!(early < 0.5)) bad.push(`EARLY frac ${early} not < 0.5`);
      if (mid !== 0.5) bad.push(`MID frac ${mid} ≠ 0.5`);
      if (!(late > 0.5)) bad.push(`LATE frac ${late} not > 0.5`);
      if (!(vline >= late)) bad.push(`V-LINE frac ${vline} < LATE ${late}`);
    }
    // the live racecraft overrides — defend lowest, attack highest
    const defend = grab(/typ = "DEFEND · EARLY APEX — own the inside"; frac = Math\.min\(frac, ([\d.]+)\);/);
    const attack = grab(/typ = "ATTACK · LATE APEX — get the run"; frac = Math\.max\(frac, ([\d.]+)\);/);
    if (defend == null || attack == null) bad.push("defend/attack overrides missing");
    else {
      if (!(early != null && defend <= early)) bad.push(`DEFEND frac ${defend} not ≤ EARLY ${early}`);
      if (!(vline != null && attack >= vline)) bad.push(`ATTACK frac ${attack} not ≥ V-LINE ${vline}`);
    }
    // dot + boards ride the LIVE frac, dot pinned to the inside kerb (+dir, screen-locked)
    if (!has("const apexAt = c.start + (c.end - c.start) * frac")) bad.push("apexAt not on live frac");
    if (src.includes("(c.end - c.start) * 0.5, apexD")) bad.push("apexAt still hard-coded 0.5");
    if (!has("const dotLat = c.dir * (halfAt(apexD) - 1.4);")) bad.push("dot not +dir inside kerb");
    if (!has("state._learnLive = { typ, frac, apexAt, apexD, dotLat }")) bad.push("_learnLive not exposed");
    // racing line apexes on the inside; map no longer mirrors the world
    if (!has("const lat = -cc.dir * ((val * 2 - 1)")) bad.push("raceLineOffAt corner sign regressed");
    if (!has("return sI * (hw - 2.4);")) bad.push("raceLineOffAt free-run sign regressed");
    if (src.includes("-app.raceLineOffAt")) bad.push("map still mirrors raceLineOffAt");
    if (src.includes("P(p0, -state.laneOffset)")) bad.push("map car dot still mirrored");
    check(f, bad.length === 0, bad.join("; "));
  }
}

/* ---------------------------------------------------------------------------
   IN-PAGE MEASUREMENT — runs inside the sim, all screen-space, no conventions
--------------------------------------------------------------------------- */
const PAGE_FNS = {
  /* render mid-corner and measure the drawn dot / kerbs / racing line / labels */
  corner: ({ appName, at, gaps, camBack }) => {
    const app = window[appName], state = app.state;
    app.selectCircuit("Suzuka Circuit");
    state.rivals = [];                                     // clean track (certification-style)
    state.learnMode = true;
    state._lc = null;
    const savedGaps = app.rivalGaps;
    if (gaps) app.rivalGaps = () => gaps;                  // stub the race situation
    state.speedMps = gaps ? 40 : 0;                        // defend/attack windows scale with speed
    Object.assign(state, { distanceM: at - 100, laneOffset: 0, headingRel: 0 });
    app.drawWorld();                                       // pass 1: lock the corner, fill _learnLive
    const live1 = state._learnLive, lc = state._lc;
    if (!lc || !live1) { app.rivalGaps = savedGaps; return { err: "no corner/advice" }; }
    state.distanceM = (camBack != null) ? lc.start - camBack : live1.apexAt - 35;

    const ctx = app.ctx, cap = { on: false, recs: [] };
    let path = [];
    const wrap = (name, fn) => { const orig = ctx[name].bind(ctx); ctx[name] = (...a) => { if (cap.on) fn(...a); return orig(...a); }; };
    wrap("beginPath", () => { path = []; });
    wrap("moveTo", (x, y) => path.push({ x, y }));
    wrap("lineTo", (x, y) => path.push({ x, y }));
    wrap("arc", (x, y, r) => path.push({ x, y, r, arc: 1 }));
    wrap("stroke", () => cap.recs.push({ t: "s", style: String(ctx.strokeStyle).replace(/\s+/g, ""), pts: path.slice() }));
    wrap("fill", () => cap.recs.push({ t: "f", style: String(ctx.fillStyle).replace(/\s+/g, ""), pts: path.slice() }));
    wrap("fillText", (txt, x, y) => cap.recs.push({ t: "txt", txt: String(txt), x, y, style: String(ctx.fillStyle).replace(/\s+/g, "") }));
    cap.on = true; app.drawWorld(); cap.on = false;
    app.rivalGaps = savedGaps;
    const live = state._learnLive;

    const out = {
      live: { typ: live.typ, frac: live.frac, apexD: Math.round(live.apexD), dotLat: +live.dotLat.toFixed(2) },
      lc: { dir: lc.dir, type: lc.type, frac: lc.frac, start: Math.round(lc.start), end: Math.round(lc.end) },
      advice: state._advice || "",
      texts: cap.recs.filter(r => r.t === "txt").map(r => ({ txt: r.txt, x: Math.round(r.x), y: +r.y.toFixed(1), style: r.style })),
    };
    const dotRec = cap.recs.find(r => r.t === "f" && r.style === "#ffd21e" && r.pts.some(p => p.arc));
    if (!dotRec) return Object.assign(out, { dot: null });
    const dot = dotRec.pts.find(p => p.arc);
    out.dot = { x: Math.round(dot.x), y: +dot.y.toFixed(1) };

    // rebuild the two drawn kerb chains (consecutive 2-point strokes), approach legs only
    const KERB = ["rgba(220,70,70,0.85)", "rgba(240,240,240,0.85)"];
    const segs = cap.recs.filter(r => r.t === "s" && KERB.includes(r.style) && r.pts.length >= 2)
      .map(r => ({ a: r.pts[0], b: r.pts[r.pts.length - 1] }));
    const chains = [];
    for (const s of segs) {
      const c = chains.find(ch => { const e = ch[ch.length - 1]; return Math.abs(e.x - s.a.x) < 0.75 && Math.abs(e.y - s.a.y) < 0.75; });
      if (c) c.push(s.b); else chains.push([s.a, s.b]);
    }
    chains.sort((a, b) => b.length - a.length);
    let big = chains.filter(ch => ch.length >= 8).slice(0, 2);
    if (big.length < 2) return Object.assign(out, { err: "kerb chains not found" });
    big = big.map(ch => { let mi = 0; for (let i = 1; i < ch.length; i++) if (ch[i].y < ch[mi].y) mi = i; return ch.slice(0, mi + 1); });
    const xAtY = (ch, y) => {
      for (let i = 1; i < ch.length; i++) {
        const a = ch[i - 1], b = ch[i];
        if ((a.y - y) * (b.y - y) <= 0 && Math.abs(b.y - a.y) > 1e-9) return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y));
      }
      return null;
    };
    const topY = Math.max(big[0][big[0].length - 1].y, big[1][big[1].length - 1].y) + 2;
    const botY = Math.min(big[0][0].y, big[1][0].y, innerHeight * 1.5) - 2;
    const midAt = (y) => { const a = xAtY(big[0], y), b = xAtY(big[1], y); return a == null || b == null ? null : (a + b) / 2; };
    const midNear = midAt(botY), midFar = midAt(topY);
    if (midNear == null || midFar == null) return Object.assign(out, { err: "no common kerb rows" });
    out.driftPx = Math.round(midFar - midNear);
    const bendSign = Math.sign(out.driftPx);
    const xA = xAtY(big[0], topY), xB = xAtY(big[1], topY);
    const insideChain = bendSign > 0 ? (xA > xB ? big[0] : big[1]) : (xA < xB ? big[0] : big[1]);
    const outsideChain = insideChain === big[0] ? big[1] : big[0];
    const distTo = (ch) => {
      let best = 1e9;
      for (let i = 1; i < ch.length; i++) {
        const a = ch[i - 1], b = ch[i];
        const vx = b.x - a.x, vy = b.y - a.y, L2 = vx * vx + vy * vy || 1e-9;
        let t = ((dot.x - a.x) * vx + (dot.y - a.y) * vy) / L2; t = Math.max(0, Math.min(1, t));
        best = Math.min(best, Math.hypot(dot.x - (a.x + vx * t), dot.y - (a.y + vy * t)));
      }
      return best;
    };
    out.bendSign = bendSign;
    out.dToIn = Math.round(distTo(insideChain));
    out.dToOut = Math.round(distTo(outsideChain));

    const teal = [];
    for (const r of cap.recs) if (r.t === "s" && r.style === "rgba(156,198,255,0.55)")
      for (const p of r.pts) if (p.y > topY && p.y < botY) teal.push(p);
    let inVotes = 0, nVotes = 0;
    for (const p of teal.filter(q => q.y < (topY + botY) / 2)) {
      const m = midAt(p.y); if (m == null) continue;
      nVotes++; if (Math.sign(p.x - m) === bendSign) inVotes++;
    }
    out.tealVotes = { inside: inVotes, n: nVotes };
    return out;
  },

  /* map inset: car dot / blue line / apex dot sides vs the drawn inset edges */
  mapInset: ({ appName, at, lane }) => {
    const app = window[appName], state = app.state;
    app.selectCircuit("Suzuka Circuit");
    state.rivals = []; state.learnMode = true; state._lc = null;
    Object.assign(state, { distanceM: at - 100, speedMps: 0, laneOffset: 0, headingRel: 0 });
    app.drawWorld();
    const lc = state._lc, live = state._learnLive;
    if (!lc || !live) return { err: "no corner" };
    Object.assign(state, { distanceM: live.apexAt - 35, laneOffset: lane });
    app.drawWorld();                                        // refresh _learnLive at the new position

    const g = app.el.mapCanvas.getContext("2d");
    const recs = [];
    let path = [];
    const wrap = (name, fn) => { const orig = g[name].bind(g); g[name] = (...a) => { fn(...a); return orig(...a); }; };
    wrap("beginPath", () => { path = []; });
    wrap("moveTo", (x, y) => path.push({ x, y }));
    wrap("lineTo", (x, y) => path.push({ x, y }));
    wrap("arc", (x, y, r) => path.push({ x, y, r, arc: 1 }));
    wrap("stroke", () => recs.push({ t: "s", style: String(g.strokeStyle).replace(/\s+/g, ""), pts: path.slice() }));
    wrap("fill", () => recs.push({ t: "f", style: String(g.fillStyle).replace(/\s+/g, ""), pts: path.slice() }));
    app.drawMap();

    const edges = recs.filter(r => r.t === "s" && r.style === "rgba(170,180,190,0.8)" && r.pts.length > 20).map(r => r.pts);
    const blue = recs.find(r => r.t === "s" && r.style === "rgba(90,190,255,0.95)" && r.pts.length > 20);
    const carDot = recs.filter(r => r.t === "f" && ["#fff", "#ffffff"].includes(r.style) && r.pts.some(p => p.arc))
      .map(r => r.pts.find(p => p.arc)).find(p => p && p.r < 5);
    const apexDot = recs.filter(r => r.t === "f" && r.style === "#ffd21e" && r.pts.some(p => p.arc))
      .map(r => r.pts.find(p => p.arc)).pop();
    if (edges.length < 2 || !blue || !carDot) return { err: "inset marks missing", edges: edges.length, blue: !!blue, car: !!carDot };

    const E0 = edges[0], E1 = edges[1], n = Math.min(E0.length, E1.length);
    const mid = (i) => ({ x: (E0[i].x + E1[i].x) / 2, y: (E0[i].y + E1[i].y) / 2 });
    const cross = (t, d) => t.x * d.y - t.y * d.x;          // y-down screen: > 0 = right of travel
    const sideOf = (pt, i) => Math.sign(cross({ x: mid(i + 1).x - mid(i - 1).x, y: mid(i + 1).y - mid(i - 1).y }, { x: pt.x - mid(i).x, y: pt.y - mid(i).y }));
    const CAR_I = 15;                                       // back(90)/stepZ(6)
    const APEX_I = Math.max(3, Math.min(n - 3, Math.round((live.apexAt - state.distanceM + 90) / 6)));
    const tPrev = { x: mid(APEX_I).x - mid(APEX_I - 2).x, y: mid(APEX_I).y - mid(APEX_I - 2).y };
    const tNext = { x: mid(APEX_I + 2).x - mid(APEX_I).x, y: mid(APEX_I + 2).y - mid(APEX_I).y };
    const bendMap = Math.sign(cross(tPrev, tNext));         // +1 = drawn right-hand bend
    return {
      carSide: sideOf(carDot, CAR_I),                       // +1 right of travel, -1 left
      bendMap,
      blueSideAtApex: sideOf(blue.pts[Math.min(blue.pts.length - 1, APEX_I)], APEX_I),
      apexSide: apexDot ? sideOf(apexDot, APEX_I) : 0,
    };
  },
};

/* ---------------------------------------------------------------------------
   DRIVERS
--------------------------------------------------------------------------- */
async function openSim(browser, car) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on("pageerror", (e) => { throw new Error(`[${car.label}] page error: ${e.message}`); });
  await page.goto(pathToFileURL(resolve(ROOT, car.file)).href);
  await page.waitForFunction((appName) => !!window[appName] && !!window[appName].drawWorld, car.app, { timeout: 15000 });
  return page;
}

const labelMatchesFrac = (typ, frac) =>
  (typ.includes("DEFEND") && frac <= 0.35) ||
  (typ.includes("ATTACK") && frac >= 0.62) ||
  (typ.includes("EARLY") && frac < 0.5) ||
  (typ.includes("MID") && Math.abs(frac - 0.5) < 1e-9) ||
  (typ.includes("LATE") && frac > 0.5);

async function verifyCar(browser, key) {
  const car = DRIVE_CARS[key];
  const page = await openSim(browser, car);
  console.log(`\n▶ ${car.label}`);

  // 1. the apex dot hugs the DRAWN inside kerb — both corner directions
  for (const corner of CORNERS) {
    const r = await page.evaluate(PAGE_FNS.corner, { appName: car.app, at: corner.at, gaps: null, camBack: null });
    if (r.err || !r.dot) { check(`${corner.name}: rendered dot + kerbs`, false, r.err || "no dot"); continue; }
    check(`${corner.name}: road bends ${corner.dir > 0 ? "right" : "left"} on screen`, r.bendSign === corner.dir && Math.abs(r.driftPx) >= 10, `drift ${r.driftPx}px`);
    check(`${corner.name}: apex dot ON the inside kerb`, r.dToIn * 3 < r.dToOut, `in ${r.dToIn}px vs out ${r.dToOut}px`);
    check(`${corner.name}: teal racing line runs the inside through the corner`, r.tealVotes.n >= 2 && r.tealVotes.inside / r.tealVotes.n > 0.5, `${r.tealVotes.inside}/${r.tealVotes.n}`);
    check(`${corner.name}: label matches live frac`, labelMatchesFrac(r.live.typ, r.live.frac), `"${r.live.typ}" @ ${r.live.frac}`);
    const drawnLabel = r.texts.find(t => t.style === "#ffe27a");
    check(`${corner.name}: drawn advice label = live typ`, !!drawnLabel && drawnLabel.txt === r.live.typ, drawnLabel && `"${drawnLabel.txt}"`);
  }

  // 2. dot + boards follow the live frac in real time (defend / clean / attack)
  const situations = {
    clean: null,
    defend: { ahead: 1e9, behind: 20 },
    attack: { ahead: 20, behind: 1e9 },
  };
  const runs = {};
  for (const [name, gaps] of Object.entries(situations))
    runs[name] = await page.evaluate(PAGE_FNS.corner, { appName: car.app, at: 600, gaps, camBack: 60 });
  const geomFrac = runs.clean.lc.frac;
  check(`defend: label + frac 0.35`, runs.defend.live.typ.startsWith("DEFEND") && runs.defend.live.frac === 0.35, `"${runs.defend.live.typ}" @ ${runs.defend.live.frac}`);
  check(`attack: label + frac 0.62`, runs.attack.live.typ.startsWith("ATTACK") && runs.attack.live.frac === 0.62, `"${runs.attack.live.typ}" @ ${runs.attack.live.frac}`);
  check(`clean: geometric frac restored`, runs.clean.live.frac === geomFrac && !runs.clean.live.typ.includes("DEFEND") && !runs.clean.live.typ.includes("ATTACK"), `@ ${runs.clean.live.frac}`);
  for (const name of Object.keys(situations))
    check(`${name}: advice text carries the label`, runs[name].advice.startsWith(runs[name].live.typ), `"${runs[name].advice}"`);
  const dotY = (r) => r.dot && r.dot.y;
  check(`dot placed deeper for attack vs defend (live apexD)`, runs.attack.live.apexD >= runs.defend.live.apexD + 10,
    `attack ${runs.attack.live.apexD}m vs defend ${runs.defend.live.apexD}m`);
  check(`drawn dot sits deeper on screen for attack`, dotY(runs.attack) != null && dotY(runs.defend) != null && dotY(runs.attack) < dotY(runs.defend) - 0.1,
    `attack y ${fmt(dotY(runs.attack))} < defend y ${fmt(dotY(runs.defend))}`);
  const b50 = (r) => { const t = r.texts.find(tt => tt.txt === "50"); return t && t.y; };
  check(`"50" board counts down to the LIVE apex (moves with frac)`, b50(runs.attack) != null && b50(runs.defend) != null && b50(runs.attack) < b50(runs.defend) - 2,
    `attack y ${fmt(b50(runs.attack))} < defend y ${fmt(b50(runs.defend))}`);
  const turnIn = (r) => { const t = r.texts.find(tt => tt.txt === "TURN IN"); return t && t.y; };
  check(`TURN IN board stays cached (no jitter)`, turnIn(runs.attack) != null && Math.abs(turnIn(runs.attack) - turnIn(runs.defend)) < 0.75,
    `Δ ${fmt(turnIn(runs.attack) != null && turnIn(runs.defend) != null ? Math.abs(turnIn(runs.attack) - turnIn(runs.defend)) : null, 2)}px`);

  // 3. the zoom map tells the same story as the world
  for (const conf of [{ at: 600, lane: 25, want: 1 }, { at: 600, lane: -25, want: -1 }]) {
    const m = await page.evaluate(PAGE_FNS.mapInset, { appName: car.app, at: conf.at, lane: conf.lane });
    if (m.err) { check(`map inset rendered (lane ${conf.lane})`, false, JSON.stringify(m)); continue; }
    check(`map inset: car dot on the ${conf.want > 0 ? "right" : "left"}, same as the world (lane ${conf.lane})`, m.carSide === conf.want);
    check(`map inset: blue line + apex dot on the inside of the bend (lane ${conf.lane})`, m.bendMap !== 0 && m.blueSideAtApex === m.bendMap && m.apexSide === m.bendMap,
      `bend ${m.bendMap}, blue ${m.blueSideAtApex}, apex ${m.apexSide}`);
  }

  await page.close();
}

/* ---------------------------------------------------------------------------
   RUN
--------------------------------------------------------------------------- */
staticAudit();

const args = process.argv.slice(2);
const keys = args.filter((a) => DRIVE_CARS[a]);
const list = keys.length ? keys : Object.keys(DRIVE_CARS);

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  for (const key of list) {
    try { await verifyCar(browser, key); }
    catch (e) { console.log(`\n▶ ${DRIVE_CARS[key].label}\n   ✘ ${e.message || e}`); failures++; }
  }
} finally {
  await browser.close();
}
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
