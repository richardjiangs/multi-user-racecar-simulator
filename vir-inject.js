/* VIR Grand Course injector — loaded by GitHub Pages index.html
   Does not rewrite individual car simulator files. */
(function () {
  function getSimApp() {
    try { return window.__mucs && window.__mucs.getSimApp && window.__mucs.getSimApp(); }
    catch (e) { return null; }
  }
  function simFrame() { return document.getElementById("simFrame"); }
  function selectedCar() {
    const labelEl = document.getElementById("raceCarLabel");
    const label = labelEl ? String(labelEl.textContent || "").replace(/\s+—.*$/, "").trim() : "";
    return { label: label, short: label };
  }
  const VIR_NAME = "VIR Grand Course";
  const VIR_DIST = 6759;
  const VIR_FOCAL = 360, VIR_CAM_H = 1.55;
  function virC(at, dir, deg, len, name) { return { at, dir, deg, len, name }; }
  const VIR_CIRCUIT = {
    dist: VIR_DIST, env: "track", limitKmh: 280, loop: true, widthM: 21.96, corners: 25,
    blurb: "the 4.20 mi / 6.759 km Virginia International Raceway Grand Course (Grand East) — Alton, VA, 130 ft / 40 m of elevation, clockwise",
    widthZones: [
      { from: 0, to: 910, w: 23.04 }, { from: 1780, to: 2320, w: 20.52 }, { from: 2480, to: 2680, w: 21.24 },
      { from: 2680, to: 3900, w: 22.68 }, { from: 3900, to: 4900, w: 20.16 }, { from: 5840, to: 6200, w: 22.32 }
    ],
    bumps: [
      { from: 0, to: 910, r: 0.08 }, { from: 910, to: 1120, r: 0.18 }, { from: 1120, to: 1620, r: 0.22 },
      { from: 1780, to: 2320, r: 0.28 }, { from: 2320, to: 2480, r: 0.24 }, { from: 2480, to: 2680, r: 0.16 },
      { from: 2680, to: 3300, r: 0.10 }, { from: 3300, to: 3450, r: 0.20 }, { from: 3450, to: 3900, r: 0.11 },
      { from: 3900, to: 4900, r: 0.20 }, { from: 5050, to: 5520, r: 0.32 }, { from: 5840, to: 6200, r: 0.14 },
      { from: 6200, to: 6759, r: 0.09 }
    ],
    grades: [
      { from: 0, to: 910, pct: -1.2 }, { from: 910, to: 1120, pct: 2.5 }, { from: 1120, to: 1620, pct: -1.8 },
      { from: 1620, to: 1780, pct: 1.1 }, { from: 1780, to: 2020, pct: 7.2 }, { from: 2020, to: 2160, pct: 5.5 },
      { from: 2160, to: 2320, pct: 3.0 }, { from: 2320, to: 2480, pct: -6.5 }, { from: 2480, to: 2680, pct: -2.0 },
      { from: 2680, to: 3300, pct: 0.8 }, { from: 3300, to: 3900, pct: 1.5 }, { from: 3900, to: 4450, pct: 2.0 },
      { from: 4450, to: 4750, pct: 6.8 }, { from: 4750, to: 5050, pct: 1.0 }, { from: 5050, to: 5200, pct: 4.5 },
      { from: 5200, to: 5360, pct: -8.2 }, { from: 5360, to: 5520, pct: -3.0 }, { from: 5520, to: 5840, pct: -1.0 },
      { from: 5840, to: 6200, pct: -4.2 }, { from: 6200, to: 6759, pct: -0.6 }
    ],
    track: [
      virC(910, 1, 95, 55, "Horseshoe T1"), virC(980, 1, 70, 45, "Horseshoe T2"), virC(1120, -1, 85, 50, "NASCAR Bend"),
      virC(1280, -1, 50, 35, "Snake L"), virC(1360, 1, 55, 35, "Snake R"), virC(1450, -1, 70, 40, "Left Hook"),
      virC(1780, -1, 45, 50, "Climbing Esses T7"), virC(1900, 1, 50, 45, "Climbing Esses T8a"), virC(2020, -1, 48, 42, "Climbing Esses T8b"),
      virC(2160, 1, 55, 48, "Climbing Esses T9"), virC(2320, -1, 40, 70, "South Bend"), virC(2480, 1, 55, 40, "Oak Tree entry"),
      virC(2580, 1, 95, 38, "Oak Tree"), virC(3900, -1, 80, 45, "Spiral L"), virC(4020, 1, 70, 40, "Spiral R"),
      virC(4160, -1, 100, 42, "Fish Hook"), virC(4300, 1, 60, 35, "Fish Hook exit"), virC(4450, -1, 50, 50, "Up Hill"),
      virC(4600, 1, 75, 40, "Patriot R"), virC(4750, -1, 65, 38, "Patriot connector"), virC(5050, -1, 70, 45, "The Bitch / Roller Coaster entry"),
      virC(5200, 1, 85, 40, "Roller Coaster"), virC(5360, -1, 60, 38, "Roller Coaster compression"), virC(5840, 1, 50, 40, "Hog Pen entry"),
      virC(5900, 1, 70, 55, "Hog Pen")
    ]
  };
  function onVir(app) {
    const r = app && app.state && app.state.route;
    return !!(r && r.active && (r.name === VIR_NAME || r.name === "Virginia International Raceway Grand Course"));
  }
  function isDakarTrack(app) {
    const r = app && app.state && app.state.route;
    if (!r || !r.active) return false;
    if (r.env === "desert" || r.env === "dune" || r.env === "canyon") return true;
    const n = r.name || "";
    return /Stage |Prologue|Dakar|Yanbu|AlUla|Bisha|Wadi|Empty Quarter|Riyadh/i.test(n);
  }
  function virAhead(app, atM) {
    const st = app.state; const L = VIR_DIST;
    let a = ((atM - (st.distanceM || 0)) % L + L) % L;
    if (a > L / 2) a -= L; return a;
  }
  function virBuildSamples(app) {
    const st = app.state, STEP = 4, BEHIND = 80, AHEAD = 240;
    const s0 = st.distanceM || 0;
    const curv = app.curvatureAt || function () { return 0; };
    const arr = []; let psi = 0, X = 0, Z = 0; const back = [];
    for (let d = -STEP; d >= -BEHIND; d -= STEP) {
      const k = curv(s0 + d + STEP / 2) || 0;
      psi -= k * STEP; X -= Math.sin(psi) * STEP; Z -= Math.cos(psi) * STEP;
      back.push({ off: d, X, Z, psi });
    }
    for (let i = back.length - 1; i >= 0; i--) arr.push(back[i]);
    arr.push({ off: 0, X: 0, Z: 0, psi: 0 });
    psi = 0; X = 0; Z = 0;
    for (let d = STEP; d <= AHEAD; d += STEP) {
      const k = curv(s0 + d - STEP / 2) || 0;
      psi += k * STEP; X += Math.sin(psi) * STEP; Z += Math.cos(psi) * STEP;
      arr.push({ off: d, X, Z, psi });
    }
    return arr;
  }
  function virCenter(samples, off) {
    if (!samples.length) return { X: 0, Z: Math.max(0.1, off), psi: 0 };
    const first = samples[0], last = samples[samples.length - 1], STEP = 4;
    if (off <= first.off) { const e = off - first.off; return { X: first.X + Math.sin(first.psi) * e, Z: first.Z + Math.cos(first.psi) * e, psi: first.psi }; }
    if (off >= last.off) { const e = off - last.off; return { X: last.X + Math.sin(last.psi) * e, Z: last.Z + Math.cos(last.psi) * e, psi: last.psi }; }
    const idx = (off - first.off) / STEP;
    let i0 = Math.floor(idx); if (i0 < 0) i0 = 0; if (i0 > samples.length - 1) i0 = samples.length - 1;
    const i1 = Math.min(samples.length - 1, i0 + 1), f = Math.max(0, Math.min(1, idx - i0));
    const a = samples[i0], b = samples[i1];
    return { X: a.X + (b.X - a.X) * f, Z: a.Z + (b.Z - a.Z) * f, psi: a.psi + (b.psi - a.psi) * f };
  }
  function virProject(app, samples, ahead, lateral, w, h) {
    const st = app.state;
    const c = virCenter(samples, ahead);
    const nx = Math.cos(c.psi), nz = -Math.sin(c.psi);
    const Xr = c.X + lateral * nx, Zr = c.Z + lateral * nz;
    const phi = st.headingRel || 0, n0 = st.laneOffset || 0;
    const dX = Xr - n0, dZ = Zr;
    const fwd = dX * Math.sin(phi) + dZ * Math.cos(phi);
    const rgt = dX * Math.cos(phi) - dZ * Math.sin(phi);
    const horizonY = h * 0.46;
    if (fwd <= 0.8) return { x: w / 2, y: horizonY, scale: -1, fwd, horizonY };
    const scale = VIR_FOCAL / fwd;
    return { x: w / 2 + rgt * scale, y: horizonY + VIR_CAM_H * scale, scale, fwd, horizonY };
  }
  function installVirOnApp(app) {
    if (!app || app._virInstalled) return false;
    if (app.CIRCUITS) {
      app.CIRCUITS[VIR_NAME] = VIR_CIRCUIT;
      app.CIRCUITS["Virginia International Raceway Grand Course"] = VIR_CIRCUIT;
    }
    const origDraw = app.drawWorld;
    if (origDraw && !origDraw._virDraw) {
      const wrapped = function (w, h, pal) {
        try { origDraw.apply(this, arguments); } catch (e) {}
        const canvas = app.canvas || (app.ctx && app.ctx.canvas);
        const cw = (canvas && (canvas.width || canvas.clientWidth)) || 0;
        const ch = (canvas && (canvas.height || canvas.clientHeight)) || 0;
        w = (w && isFinite(w) && w > 32) ? w : cw;
        h = (h && isFinite(h) && h > 32) ? h : ch;
        if (!w || !h || !isFinite(w) || !isFinite(h)) return;
        try {
          if (!isDakarTrack(app)) drawFatKerbs(app, w, h);
          if (onVir(app)) drawVirWorld(app, w, h);
        } catch (e) {}
      };
      wrapped._virDraw = true;
      app.drawWorld = wrapped;
    }
    try { injectVirButton(app); } catch (e) {}
    app._virInstalled = true;
    return true;
  }
  function kerbPointOk(p, w, h) {
    return p && isFinite(p.x) && isFinite(p.y) && p.fwd > 3.2 && p.scale > 0 && p.scale < 4.2
      && p.x > -w * 0.35 && p.x < w * 1.35 && p.y > h * 0.28 && p.y < h * 1.08;
  }
  function drawFatKerbs(app, w, h) {
    const ctx = app.ctx, st = app.state;
    if (!ctx || !st || !st.route || !st.route.active) return;
    const samples = virBuildSamples(app);
    const hwFn = app.halfWidthAt || function () { return 12; };
    const kerbM = 4.63;
    const maxSpan = Math.min(w, h) * 0.22;
    for (const sign of [-1, 1]) {
      let prev = null;
      for (let off = 6; off <= 140; off += 4) {
        const half = hwFn(st.distanceM + off);
        const inner = virProject(app, samples, off, sign * (half + 0.08), w, h);
        const outer = virProject(app, samples, off, sign * (half + 0.08 + kerbM), w, h);
        if (prev && kerbPointOk(inner, w, h) && kerbPointOk(outer, w, h)
            && kerbPointOk(prev.inner, w, h) && kerbPointOk(prev.outer, w, h)) {
          const span = Math.max(
            Math.hypot(inner.x - outer.x, inner.y - outer.y),
            Math.hypot(inner.x - prev.inner.x, inner.y - prev.inner.y)
          );
          if (span < maxSpan) {
            const red = (((st.distanceM + off) % 16) + 16) % 16 < 8;
            ctx.fillStyle = red ? "rgba(210,64,64,0.78)" : "rgba(236,236,236,0.78)";
            ctx.beginPath();
            ctx.moveTo(prev.inner.x, prev.inner.y);
            ctx.lineTo(prev.outer.x, prev.outer.y);
            ctx.lineTo(outer.x, outer.y);
            ctx.lineTo(inner.x, inner.y);
            ctx.closePath();
            ctx.fill();
          }
        }
        prev = { inner, outer };
      }
    }
  }
  function drawVirWorld(app, w, h) {
    const ctx = app.ctx, st = app.state;
    if (!ctx || !st) return;
    const samples = virBuildSamples(app);
    const hwFn = app.halfWidthAt || function () { return 12; };
    const items = [];
    function add(at, side, kind, span) {
      const ahead = virAhead(app, at);
      const maxA = kind === "oak" ? 1100 : 200;
      const minA = kind === "oak" ? -25 : -45;
      if (ahead < minA || ahead > maxA) return;
      items.push({ at, ahead, side, kind, span: span || 8 });
    }
    add(2580, 1, "oak", 12);
    items.sort((a, b) => b.ahead - a.ahead);
    items.forEach((it) => {
      const half = hwFn(st.distanceM + it.ahead);
      const lat = it.side * (half + (it.kind === "oak" ? 6.5 : 4.5));
      const p = virProject(app, samples, it.ahead, lat, w, h);
      if (!p || !isFinite(p.x) || !isFinite(p.y) || p.fwd < 2.2) return;
      if (it.kind === "oak" && (p.x < -80 || p.x > w + 80 || p.y < h * 0.12 || p.y > h + 40)) return;
      ctx.save();
      if (it.kind === "oak") {
        const S = Math.min(Math.max(p.scale, 0.22), 4.8);
        ctx.fillStyle = "#3d5a32";
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 4 * S, 38 * S, 10 * S, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#4a3018";
        ctx.beginPath();
        ctx.moveTo(p.x - 5.5 * S, p.y);
        ctx.lineTo(p.x - 4.2 * S, p.y - 28 * S);
        ctx.lineTo(p.x + 4.8 * S, p.y - 28 * S);
        ctx.lineTo(p.x + 6.2 * S, p.y);
        ctx.closePath(); ctx.fill();
        const clouds = [[0, -42, 26, 18, "#1c4a1c"], [-16, -36, 18, 14, "#245828"], [18, -35, 19, 14, "#1a5420"], [0, -30, 20, 12, "#326e30"]];
        clouds.forEach(function (c) {
          ctx.fillStyle = c[4];
          ctx.beginPath(); ctx.ellipse(p.x + c[0] * S, p.y + c[1] * S, c[2] * S, c[3] * S, 0, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = "#e8f0dc";
        ctx.font = "bold " + Math.max(11, 12 * S) + "px sans-serif";
        ctx.fillText("OAK TREE", p.x - 34 * S, p.y + 16 * S);
      }
      ctx.restore();
    });
  }
  function injectVirButton(app) {
    const doc = simFrame() && simFrame().contentDocument;
    if (!doc || doc.getElementById("virGrandBtn")) return;
    const nardo = doc.querySelector('[data-circuit="Nardò Ring"]');
    const btn = doc.createElement("button");
    btn.id = "virGrandBtn";
    btn.setAttribute("data-circuit", VIR_NAME);
    btn.textContent = "VIR Grand Course";
    btn.title = "Virginia International Raceway Grand Course — 4.20 mi, 25 turns, 40 m elevation";
    btn.addEventListener("click", () => {
      if (app.selectCircuit) app.selectCircuit(VIR_NAME);
    });
    if (nardo && nardo.parentNode) nardo.parentNode.insertBefore(btn, nardo.nextSibling);
    else {
      const box = doc.querySelector("[data-circuit]");
      if (box && box.parentNode) box.parentNode.appendChild(btn);
    }
  }
  function waitVirInstall(then) {
    const t0 = Date.now();
    const poll = setInterval(() => {
      const app = getSimApp();
      if (app) {
        clearInterval(poll);
        installVirOnApp(app);
        if (typeof then === "function") then();
      } else if (Date.now() - t0 > 18000) {
        clearInterval(poll);
        if (typeof then === "function") then();
      }
    }, 60);
  }
  function patchTrackPicker() {
    const sel = document.getElementById("trackSelect");
    if (sel && !sel.querySelector('option[value="VIR Grand Course"]')) {
      const opt = document.createElement("option");
      opt.value = "VIR Grand Course";
      opt.textContent = "VIR Grand Course";
      sel.appendChild(opt);
    }
    if (window.__mucs && window.__mucs.applySharedTrack && !window.__mucs._virTrackPatched) {
      const orig = window.__mucs.applySharedTrack;
      window.__mucs.applySharedTrack = function (name) {
        if (name === "VIR Grand Course" || name === "Virginia International Raceway Grand Course") {
          const app = getSimApp();
          if (app) installVirOnApp(app);
          if (app && app.selectCircuit) {
            try { app.selectCircuit("VIR Grand Course"); } catch (e) {}
            return true;
          }
        }
        return orig(name);
      };
      window.__mucs._virTrackPatched = true;
    }
  }
  function bootVir() {
    patchTrackPicker();
    const frame = simFrame();
    if (frame && !frame._virLoadHook) {
      frame.addEventListener("load", function () { waitVirInstall(); });
      frame._virLoadHook = true;
    }
    waitVirInstall();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootVir);
  else bootVir();
  setInterval(function () {
    patchTrackPicker();
    const app = getSimApp();
    if (app && !app._virInstalled) installVirOnApp(app);
    else if (app) injectVirButton(app);
  }, 2500);
})();
