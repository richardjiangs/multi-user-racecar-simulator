#!/usr/bin/env node
/* switch-joycon-test.mjs — verifies switch.html's calibration wizard, the path
   that makes two paired Joy-Cons (or any odd pad) usable on a Mac.

     node tests/switch-joycon-test.mjs

   Installs TWO fake Joy-Cons with deliberately NON-standard, scrambled
   button/axis indices (so nothing can pass by assuming the standard layout),
   runs the on-screen calibration by performing each prompted action, checks the
   learned profile captured the real indices, then confirms the profile actually
   drives the car (steer / throttle / brake / horn).
*/
import { spawn, execSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const g = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(g, "playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".avif": "image/avif", ".webp": "image/webp" };
const server = createServer(async (q, s) => { try { const u = decodeURIComponent(new URL(q.url, "http://x").pathname); const f = join(ROOT, u === "/" ? "index.html" : u.slice(1)); const b = await readFile(f); s.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); s.end(b); } catch { s.writeHead(404); s.end("no"); } });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const BASE = `http://127.0.0.1:${server.address().port}/`;

let failures = 0;
const check = (label, ok, detail) => { console.log(`   ${ok ? "✔" : "✘ FAIL"}  ${label}${detail ? "  " + detail : ""}`); if (!ok) failures++; };

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errs = []; page.on("pageerror", (e) => errs.push(String(e.message || e).split("\n")[0]));

/* two fake Joy-Cons with SCRAMBLED indices — the truth the wizard must discover */
await page.addInitScript(() => {
  window.__pads = [
    { connected: true, id: "Joy-Con (L)", index: 0, mapping: "", axes: [0, 0], buttons: new Array(16).fill(0) },
    { connected: true, id: "Joy-Con (R)", index: 1, mapping: "", axes: [0, 0], buttons: new Array(16).fill(0) },
  ];
  navigator.getGamepads = () => window.__pads.map((p) => p ? { connected: p.connected, id: p.id, index: p.index, mapping: p.mapping, axes: p.axes.slice(), buttons: p.buttons.slice() } : null);
});

await page.goto(BASE + "switch.html", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1000);

const frames = (n = 8) => page.evaluate((n) => new Promise((r) => { let i = 0; (function f() { if (++i >= n) return r(); requestAnimationFrame(f); })(); }), n);
const nxStep = () => page.evaluate(() => window.__NX.step());
const calActive = () => page.evaluate(() => window.__NX.calActive());
const setInput = (pad, kind, i, val) => page.evaluate(({ pad, kind, i, val }) => { window.__pads[pad][kind === "axis" ? "axes" : "buttons"][i] = val; }, { pad, kind, i, val });
async function waitFor(fn, ms = 3000) { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return true; await frames(2); } return false; }

console.log("▶ the wizard auto-opens for Joy-Cons");
await frames(10);
check("calibration wizard opened (Joy-Con + no profile)", await calActive());

/* the scrambled truth: which fake input each prompt should capture */
const STEP_INPUT = [
  { pad: 0, kind: "axis", i: 0 },   // steer -> Left stick X
  { pad: 1, kind: "button", i: 5 }, // accel -> right ZR
  { pad: 0, kind: "button", i: 4 }, // brake -> left ZL
  { pad: 1, kind: "axis", i: 0 },   // ptrx  -> Right stick X
  { pad: 1, kind: "axis", i: 1 },   // ptry  -> Right stick Y
  { pad: 1, kind: "button", i: 3 }, // click -> A
  { pad: 1, kind: "button", i: 2 }, // back  -> B
  { pad: 1, kind: "button", i: 1 }, // horn  -> X
  { pad: 1, kind: "button", i: 0 }, // boost -> Y
];

console.log("▶ performing each prompted action");
for (let s = 0; s < STEP_INPUT.length; s++) {
  await waitFor(async () => (await nxStep()) === s && (await calActive()), 3000);
  const inp = STEP_INPUT[s];
  await setInput(inp.pad, inp.kind, inp.i, 1);   // press / deflect
  await frames(8);
  await setInput(inp.pad, inp.kind, inp.i, 0);   // release
  await waitFor(async () => (await nxStep()) > s || !(await calActive()), 3000);
}
await frames(6);
check("wizard finished and saved a profile", !(await calActive()) && !!(await page.evaluate(() => window.__NX.profile())));

const prof = await page.evaluate(() => window.__NX.profile());
const okSrc = (p, wantId, wantI) => p && p.id === wantId && p.i === wantI;
check("learned STEERING = Left-stick X", okSrc(prof.steer, "Joy-Con (L)", 0), JSON.stringify(prof.steer));
check("learned ACCEL = right ZR (scrambled index 5)", okSrc(prof.accel, "Joy-Con (R)", 5), JSON.stringify(prof.accel));
check("learned BRAKE = left ZL (index 4)", okSrc(prof.brake, "Joy-Con (L)", 4), JSON.stringify(prof.brake));
check("learned A / B / X / Y on the right Joy-Con", okSrc(prof.click, "Joy-Con (R)", 3) && okSrc(prof.back, "Joy-Con (R)", 2) && okSrc(prof.horn, "Joy-Con (R)", 1) && okSrc(prof.boost, "Joy-Con (R)", 0));

console.log("▶ the learned profile actually drives the car");
await page.click('[data-practice="bugatti"]');
await page.waitForTimeout(1600);
const st = () => page.evaluate(() => { try { const s = document.getElementById("simFrame").contentWindow.BugattiApp.state; return { ts: +(s.touchSteer || 0).toFixed(3), ta: s.touchActive, thr: +(s.padThrottle || 0).toFixed(2), brk: +(s.padBrake || 0).toFixed(2), horn: s.horn }; } catch (e) { return null; } });
const zero = async () => { await page.evaluate(() => { window.__pads.forEach((p) => { p.axes = p.axes.map(() => 0); p.buttons = p.buttons.map(() => 0); }); }); await frames(4); };

await setInput(0, "axis", 0, 0.9); await frames(8);
check("Left stick steers via profile", (await st()).ts > 0.6 && (await st()).ta, JSON.stringify(await st())); await zero();
await setInput(1, "button", 5, 1); await frames(8);
check("right ZR = throttle via profile", (await st()).thr >= 0.99, JSON.stringify(await st())); await zero();
await setInput(0, "button", 4, 1); await frames(8);
check("left ZL = brake via profile", (await st()).brk >= 0.99, JSON.stringify(await st())); await zero();
await setInput(1, "button", 1, 1); await frames(8);
check("right X = horn via profile", (await st()).horn === true, JSON.stringify(await st())); await zero();

check("no page errors", errs.length === 0, errs.slice(0, 2).join(" | "));
await browser.close(); server.close();
console.log(`\n${failures === 0 ? "All Joy-Con calibration checks passed." : failures + " FAILED"}`);
process.exit(failures ? 1 : 0);
