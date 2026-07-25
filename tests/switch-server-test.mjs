#!/usr/bin/env node
/* switch-server-test.mjs — verifies tools/switch-server.mjs (the Nintendo Switch
   browser launcher) without needing root or a real console.

     node tests/switch-server-test.mjs

   Boots the launcher on high ports, then checks:
     - the Switch's captive-check domains resolve to this computer (A record)
     - IPv6 (AAAA) is denied for them, so the console falls back to IPv4 -> us
     - the web server hands over the game (index.html), the sim files and assets
*/
import { spawn, execSync } from "node:child_process";
import { createSocket } from "node:dgram";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const g = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(g, "playwright/index.mjs")).href);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DNS = 5354, HTTP = 8099, IP = "192.168.1.50";
let failures = 0;
const check = (label, ok, detail) => { console.log(`   ${ok ? "✔" : "✘ FAIL"}  ${label}${detail ? "  " + detail : ""}`); if (!ok) failures++; };

const srv = spawn(process.execPath,
  [resolve(ROOT, "tools/switch-server.mjs"), "--dns-port", String(DNS), "--http-port", String(HTTP), "--ip", IP],
  { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 900));

function dnsQuery(name, type) {
  const parts = [Buffer.from([0x12, 0x34, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])];
  for (const l of name.split(".")) { const b = Buffer.from(l, "ascii"); parts.push(Buffer.from([b.length]), b); }
  parts.push(Buffer.from([0x00, (type >> 8) & 255, type & 255, 0x00, 0x01]));
  return Buffer.concat(parts);
}
function ask(name, type) {
  return new Promise((res, rej) => {
    const s = createSocket("udp4");
    const to = setTimeout(() => { s.close(); rej(new Error("timeout")); }, 2500);
    s.on("message", (m) => {
      clearTimeout(to); s.close();
      const anc = m.readUInt16BE(6);
      const ip = anc > 0 ? `${m[m.length - 4]}.${m[m.length - 3]}.${m[m.length - 2]}.${m[m.length - 1]}` : null;
      res({ anc, ip });
    });
    s.on("error", rej);
    s.send(dnsQuery(name, type), DNS, "127.0.0.1");
  });
}
const get = async (path) => {
  const r = await fetch(`http://127.0.0.1:${HTTP}${path}`);
  return { status: r.status, ct: r.headers.get("content-type") || "", body: await r.text() };
};

try {
  console.log("▶ DNS captive interception");
  const a = await ask("conntest.nintendowifi.net", 1);
  check("conntest.nintendowifi.net -> this computer", a.ip === IP, JSON.stringify(a));
  const b = await ask("ctest.cdn.nintendo.net", 1);
  check("ctest.cdn.nintendo.net -> this computer", b.ip === IP, JSON.stringify(b));
  const v6 = await ask("conntest.nintendowifi.net", 28);
  check("AAAA denied (forces IPv4 to us)", v6.anc === 0, JSON.stringify(v6));

  console.log("▶ web server hands over the game");
  const root = await get("/");
  check("captive URL / serves the game", root.status === 200 && /car-card|SIM_FILES/.test(root.body));
  const unknown = await get("/generate_204");
  check("unknown captive-check path also serves the game", unknown.status === 200 && /car-card|SIM_FILES/.test(unknown.body));
  const sim = await get("/Ferrari%20F40%20simulator.html");
  check("a sim file loads", sim.status === 200 && /F40App|<canvas/.test(sim.body));
  const asset = await get("/assets/cars/ferrari-f40.jpg");
  check("a car photo loads", asset.status === 200);
  const html = await get("/Bugatti%20Chiron%20Super%20Sport%20300+%20simulator.html");
  check("touch shim + CSS injected into served sims", /caps\[id\]/.test(html.body) && /touch-wheel.*display: block/.test(html.body));

  console.log("▶ touch play works even without Pointer Events (the old Switch browser)");
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required", "--touch-events=enabled"] });
  const ctx = await browser.newContext({ hasTouch: true, viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  // mimic the Switch's older WebKit: no Pointer Events at all
  await page.addInitScript(() => { try { Object.defineProperty(window, "PointerEvent", { value: undefined, configurable: true }); } catch (e) {} });
  await page.goto(`http://127.0.0.1:${HTTP}/Bugatti%20Chiron%20Super%20Sport%20300+%20simulator.html`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1100);
  await page.evaluate(() => { const k = document.getElementById("keyOverlay"); if (k) k.style.display = "none"; });
  const noPE = await page.evaluate(() => typeof window.PointerEvent === "undefined");
  check("Pointer Events absent (as on the Switch)", noPE);
  const box = await page.evaluate(() => { const w = document.getElementById("touchWheel"); const r = w.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; });
  check("touch wheel is visible at 1280px (forced on)", box.w > 0, JSON.stringify(box));
  const drag = async (type, x, y) => page.evaluate(({ type, x, y }) => {
    const el = document.getElementById("touchWheel");
    const t = new Touch({ identifier: 1, target: el, clientX: x, clientY: y, pageX: x, pageY: y, screenX: x, screenY: y, radiusX: 2, radiusY: 2, force: 1 });
    el.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: type === "touchend" ? [] : [t], targetTouches: type === "touchend" ? [] : [t], changedTouches: [t] }));
  }, { type, x, y });
  await drag("touchstart", box.x, box.y);
  await drag("touchmove", box.x + box.w * 0.35, box.y + box.w * 0.12);
  await page.waitForTimeout(120);
  const steer = await page.evaluate(() => ({ ts: +window.BugattiApp.state.touchSteer.toFixed(3), active: window.BugattiApp.state.touchActive }));
  check("dragging the wheel steers (shim bridges touch -> pointer)", steer.ts > 0.05 && steer.active, JSON.stringify(steer));
  await drag("touchend", box.x + box.w * 0.35, box.y + box.w * 0.12);
  await page.waitForTimeout(120);
  const rel = await page.evaluate(() => +window.BugattiApp.state.touchSteer.toFixed(3));
  check("steering recentres on release", rel === 0);
  await browser.close();
} finally {
  srv.kill("SIGKILL");
}
console.log(`\n${failures === 0 ? "All Switch-launcher checks passed." : failures + " FAILED"}`);
process.exit(failures ? 1 : 0);
