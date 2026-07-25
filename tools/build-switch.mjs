#!/usr/bin/env node
/* Builds switch.html — the Nintendo Switch edition.

     node tools/build-switch.mjs      (run after tools/embed-sims.mjs)

   It takes the self-contained index-offline.html (every car embedded inline,
   zero network) and injects a Joy-Con / Pro Controller layer, so the whole
   garage is one file you can drop on a microSD card and play with a gamepad.

   The game itself is untouched — the layer only feeds the existing analog
   inputs (state.padThrottle / padBrake / touchSteer) and clicks existing
   buttons, so every car still drives exactly as it does in a browser.
*/
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = resolve(ROOT, "index-offline.html");
if (!existsSync(SRC)) { console.error("index-offline.html missing — run tools/embed-sims.mjs first"); process.exit(1); }

const CSS = `
  /* ---- Nintendo Switch edition ---- */
  html, body { overscroll-behavior: none; }
  #nxCursor {
    position: fixed; left: 0; top: 0; width: 26px; height: 26px; z-index: 2147483647;
    pointer-events: none; will-change: transform; transform: translate(-999px,-999px);
    transition: opacity .18s linear;
  }
  #nxCursor::before {
    content: ""; position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.95); background: rgba(0,190,255,0.28);
    box-shadow: 0 0 0 2px rgba(0,0,0,0.55), 0 3px 12px rgba(0,0,0,0.6);
  }
  #nxCursor.press::before { background: rgba(255,220,0,0.72); transform: scale(0.8); }
  #nxHelp {
    position: fixed; right: 12px; bottom: 12px; z-index: 2147483646;
    background: rgba(6,10,16,0.90); border: 1px solid rgba(150,180,210,0.35);
    border-radius: 10px; padding: 10px 12px; font: 600 12px/1.55 ui-sans-serif, system-ui, sans-serif;
    color: #dce6f2; max-width: 330px; pointer-events: none; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }
  /* the cheat-sheet is transient: it fades out so it never sits on the telemetry pad */
  #nxHelp.fade { opacity: 0; transition: opacity .6s linear; }
  #nxHelp b { color: #7fd4ff; }
  #nxHelp .k {
    display: inline-block; min-width: 20px; text-align: center; padding: 0 5px; margin-right: 4px;
    border-radius: 5px; background: #1b2330; border: 1px solid rgba(160,190,220,0.4); color: #fff;
  }
  #nxHelp .off { color: #ff9a7a; }
  #nxHelp .on { color: #7ce38b; }
  /* Switch screen is 1280x720 handheld / 1920x1080 docked — keep touch targets comfortable */
  @media (max-height: 760px) { .photo { height: 150px; } }
`;

const JS = String.raw`
<script>
/* ===================== Nintendo Switch controller layer =====================
   Joy-Con / Pro Controller -> the game's existing inputs. Nothing about the
   cars changes; this only writes the same analog values the touch wheel and
   pedals already write, and clicks the same on-screen buttons.

   Standard Gamepad mapping, Nintendo face-button positions:
     buttons[0] bottom = B      buttons[1] right = A
     buttons[2] left   = Y      buttons[3] top   = X
     buttons[4] L   [5] R   [6] ZL   [7] ZR
     axes[0,1] left stick       axes[2,3] right stick
============================================================================ */
(function () {
  "use strict";
  var DEAD = 0.18;          // stick deadzone
  var TRIG = 0.12;          // trigger threshold
  var CURSOR_PXPS = 1000;   // right-stick pointer speed (px/sec)

  var cursor, help, cx = 0, cy = 0, last = 0, haveCursor = false;
  var prevBtn = {}, hornDown = false, revHold = 0, padSteering = false, connected = false;

  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---- reach the car running inside the iframe ---- */
  var appCache = null;
  function simFrame() { return $("simFrame"); }
  function simApp() {
    var f = simFrame(); if (!f) return null;
    var w; try { w = f.contentWindow; } catch (e) { return null; }
    if (!w) return null;
    if (appCache && appCache.w === w && appCache.app && appCache.app.state) return appCache.app;
    var found = null;
    try {
      var keys = Object.keys(w);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (!/App$/.test(k)) continue;
        var cand = w[k];
        if (cand && cand.state && typeof cand.updatePhysics === "function") { found = cand; break; }
      }
    } catch (e) { return null; }
    appCache = { w: w, app: found };
    return found;
  }
  function driving() { var f = simFrame(); return !!(f && (f.getAttribute("src") || f.getAttribute("srcdoc"))); }

  /* ---- virtual pointer: works over the page AND inside the sim iframe ---- */
  function elAt(x, y) {
    var el = null;
    try { el = document.elementFromPoint(x, y); } catch (e) { return null; }
    var f = simFrame();
    if (el && f && el === f) {
      try {
        var r = f.getBoundingClientRect();
        var inner = f.contentDocument.elementFromPoint(x - r.left, y - r.top);
        if (inner) el = inner;
      } catch (e) {}
    }
    return el;
  }
  function localXY(el, x, y) {
    if (el && el.ownerDocument !== document) {
      var f = simFrame();
      if (f) { var r = f.getBoundingClientRect(); return [x - r.left, y - r.top]; }
    }
    return [x, y];
  }
  function fire(el, type, x, y, down) {
    var view = (el.ownerDocument && el.ownerDocument.defaultView) || window;
    var o = { bubbles: true, cancelable: true, composed: true, clientX: x, clientY: y, view: view,
              button: 0, buttons: down ? 1 : 0, pointerId: 1, pointerType: "mouse", isPrimary: true };
    try { el.dispatchEvent(new view.PointerEvent(type, o)); return; } catch (e) {}
    try { el.dispatchEvent(new view.MouseEvent(type.replace("pointer", "mouse"), o)); } catch (e) {}
  }
  var pressEl = null;
  function pointerDown() {
    var el = elAt(cx, cy); if (!el) return;
    pressEl = el;
    var p = localXY(el, cx, cy);
    fire(el, "pointerdown", p[0], p[1], true);
    fire(el, "mousedown", p[0], p[1], true);
    if (cursor) cursor.classList.add("press");
  }
  function pointerUp() {
    var el = pressEl || elAt(cx, cy);
    if (cursor) cursor.classList.remove("press");
    if (!el) { pressEl = null; return; }
    var p = localXY(el, cx, cy);
    fire(el, "pointerup", p[0], p[1], false);
    fire(el, "mouseup", p[0], p[1], false);
    // only a genuine click if the pointer never left the element it pressed
    var now = elAt(cx, cy);
    if (now === el || (el.contains && now && el.contains(now))) {
      fire(el, "click", p[0], p[1], false);
      try { if (typeof el.click === "function" && el.tagName !== "BODY") el.click(); } catch (e) {}
    }
    pressEl = null;
  }

  /* ---- the car's own "add speed" feature differs per car; Y finds it ---- */
  var SPECIALS = ["toggleSpeedKey", "toggleTrackPack", "toggleVelocity", "toggleFuel", "toggleDrs"];
  function pressSpecial(app) {
    for (var i = 0; i < SPECIALS.length; i++) {
      if (typeof app[SPECIALS[i]] === "function") { try { app[SPECIALS[i]](); return SPECIALS[i]; } catch (e) {} }
    }
    return null;
  }

  /* ---- build the on-screen bits ---- */
  function ui() {
    cursor = document.createElement("div"); cursor.id = "nxCursor";
    help = document.createElement("div"); help.id = "nxHelp";
    document.body.appendChild(cursor); document.body.appendChild(help);
    cx = Math.round(innerWidth / 2); cy = Math.round(innerHeight / 2);
    paintHelp();
  }
  function paintHelp() {
    if (!help) return;
    help.innerHTML =
      '<div style="margin-bottom:4px"><b>Switch controls</b> &nbsp;' +
      (connected ? '<span class="on">controller ready</span>' : '<span class="off">no controller — press any button</span>') +
      '</div>' +
      '<div><span class="k">L-stick</span>steer &nbsp; <span class="k">ZR</span>accelerate &nbsp; <span class="k">ZL</span>brake / reverse</div>' +
      '<div><span class="k">R-stick</span>pointer &nbsp; <span class="k">A</span>click / continue &nbsp; <span class="k">B</span>back</div>' +
      '<div><span class="k">X</span>horn &nbsp; <span class="k">Y</span>boost / track mode &nbsp; <span class="k">L</span><span class="k">R</span>gear down / up</div>' +
      '<div style="opacity:.65;margin-top:3px">+ shows / hides this panel</div>';
  }
  /* show the cheat-sheet briefly, then let it fade so it never covers the HUD */
  var hideT = null;
  function flashHelp(ms) {
    if (!help) return;
    help.style.display = "";
    help.classList.remove("fade");
    if (hideT) clearTimeout(hideT);
    hideT = setTimeout(function () { help.classList.add("fade"); }, ms || 8000);
  }

  /* ---- main poll ---- */
  function pads() {
    var g = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < g.length; i++) if (g[i] && g[i].connected) return g[i];
    return null;
  }
  function edge(name, isDown, onDown, onUp) {
    var was = !!prevBtn[name];
    if (isDown && !was && onDown) onDown();
    if (!isDown && was && onUp) onUp();
    prevBtn[name] = isDown;
  }
  function btn(gp, i) {
    var b = gp.buttons[i];
    if (b == null) return { p: false, v: 0 };
    return (typeof b === "object") ? { p: !!b.pressed, v: b.value || (b.pressed ? 1 : 0) } : { p: b > 0.5, v: b };
  }

  function loop(t) {
    requestAnimationFrame(loop);
    var dt = last ? Math.min(0.1, (t - last) / 1000) : 0; last = t;
    var gp = pads();
    if (!gp) { if (connected) { connected = false; paintHelp(); } return; }
    if (!connected) { connected = true; paintHelp(); flashHelp(8000); }

    var lx = gp.axes[0] || 0, rx = gp.axes[2] || 0, ry = gp.axes[3] || 0;
    var B = btn(gp, 0), A = btn(gp, 1), Y = btn(gp, 2), X = btn(gp, 3);
    var L = btn(gp, 4), R = btn(gp, 5), ZL = btn(gp, 6), ZR = btn(gp, 7);
    var plus = btn(gp, 9);

    /* right stick -> pointer */
    var mx = Math.abs(rx) > DEAD ? (rx - Math.sign(rx) * DEAD) / (1 - DEAD) : 0;
    var my = Math.abs(ry) > DEAD ? (ry - Math.sign(ry) * DEAD) / (1 - DEAD) : 0;
    if (mx || my) {
      cx = clamp(cx + mx * CURSOR_PXPS * dt, 0, innerWidth - 1);
      cy = clamp(cy + my * CURSOR_PXPS * dt, 0, innerHeight - 1);
      haveCursor = true;
    }
    if (cursor && haveCursor) cursor.style.transform = "translate(" + (cx - 13) + "px," + (cy - 13) + "px)";

    /* A = click / continue, B = back */
    edge("A", A.p, pointerDown, pointerUp);
    edge("B", B.p, function () {
      var bb = $("backBtn");
      if (bb && bb.offsetParent !== null) { bb.click(); return; }
      var pb = $("practiceBackBtn");
      if (pb && pb.offsetParent !== null) pb.click();
    });
    edge("plus", plus.p, function () {
      if (!help) return;
      var hidden = help.classList.contains("fade") || help.style.display === "none";
      if (hidden) flashHelp(10000); else help.classList.add("fade");
    });

    var app = simApp();
    if (!app || !app.state) return;
    var st = app.state;

    /* left stick -> analog steering (same channel the touch wheel uses) */
    if (Math.abs(lx) > DEAD) {
      st.touchActive = true;
      st.touchSteer = clamp((lx - Math.sign(lx) * DEAD) / (1 - DEAD), -1, 1);
      padSteering = true;
    } else if (padSteering) {
      st.touchActive = false; st.touchSteer = 0; padSteering = false;
    }

    /* ZR -> throttle, ZL -> brake (analog, same channel as the pedals) */
    st.padThrottle = ZR.v > TRIG ? clamp((ZR.v - TRIG) / (1 - TRIG), 0, 1) : 0;
    st.padBrake    = ZL.v > TRIG ? clamp((ZL.v - TRIG) / (1 - TRIG), 0, 1) : 0;

    /* holding ZL once stopped selects reverse; a dab of ZR takes drive again */
    var stopped = Math.abs(st.speedMps || 0) < 0.5;
    if (ZL.v > 0.5 && stopped) {
      revHold += dt;
      if (revHold > 0.45 && st.gearMode !== "R" && typeof app.setGear === "function") { app.setGear("R"); }
    } else revHold = 0;
    if (ZR.v > 0.5 && st.gearMode === "R" && stopped && typeof app.setGear === "function") app.setGear("G", 1);

    /* X = horn (hold) */
    edge("X", X.p,
      function () { hornDown = true; if (app.hornOn) app.hornOn(); },
      function () { if (hornDown && app.hornOff) app.hornOff(); hornDown = false; });

    /* Y = the car's speed feature: Speed Key / Track Pack / Velocity / E85 / DRS,
       and on the F1 cars it holds the ERS Override while pressed */
    edge("Y", Y.p,
      function () { pressSpecial(app); if (st.keys) st.keys.KeyV = true; },
      function () { if (st.keys) st.keys.KeyV = false; });

    /* L / R = paddle shift (the cars are auto by default, so this is optional) */
    edge("L", L.p, function () { if (app.paddleDown) app.paddleDown(); });
    edge("R", R.p, function () { if (app.paddleUp) app.paddleUp(); });
  }

  function boot() {
    ui();
    addEventListener("gamepadconnected", function () { connected = true; paintHelp(); });
    addEventListener("gamepaddisconnected", function () { connected = false; paintHelp(); });
    // the sim iframe is swapped when you pick a car — drop the cached app handle
    var f = $("simFrame");
    if (f) f.addEventListener("load", function () { appCache = null; });
    requestAnimationFrame(loop);
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", boot);
  else boot();
})();
</script>
`;

let html = readFileSync(SRC, "utf8");

// title so the applet/tab reads right
html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>Multi-User Racecar Simulator — Nintendo Switch edition</title>");

// styles: append to the first stylesheet
const styleEnd = html.indexOf("</style>");
if (styleEnd < 0) { console.error("no </style> found"); process.exit(1); }
html = html.slice(0, styleEnd) + CSS + html.slice(styleEnd);

// controller layer: last thing before </body>
const bodyEnd = html.lastIndexOf("</body>");
if (bodyEnd < 0) { console.error("no </body> found"); process.exit(1); }
html = html.slice(0, bodyEnd) + JS + html.slice(bodyEnd);

const out = resolve(ROOT, "switch.html");
writeFileSync(out, html);
console.log(`switch.html written (${(html.length / 1024 / 1024).toFixed(2)} MB — self-contained, gamepad-mapped).`);
