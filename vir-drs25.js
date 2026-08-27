/* VIR-only: 2.5x DRS kerbs. Does not touch other tracks. */
(function () {
  const VIR_DIST = 6759;
  function getApp() {
    try { return window.__mucs && window.__mucs.getSimApp && window.__mucs.getSimApp();
    } catch (e) { return null; }
  }
  function onVir(app) {
    const r = app && app.state && app.state.route;
    const n = r && r.name;
    return !!(r && r.active && (n === "VIR Grand Course" || n === "Virginia International Raceway Grand Course"));
  }
  function inDrs(dist) {
    const d = ((dist % VIR_DIST) + VIR_DIST) % VIR_DIST;
    return d >= 6200 || d <= 910 || (d >= 2680 && d <= 3600);
  }
  function upgrade(app) {
    if (!app || app._virDrs25) return;
    const prev = app.drawWorld;
    if (typeof prev !== "function") return;
    app.drawWorld = function (w, h, pal) {
      try { prev.apply(this, arguments); } catch (e) {}
      try {
        if (!onVir(app) || !app.ctx || !app.state) return;
        const ctx = app.ctx, st = app.state;
        const hwFn = app.halfWidthAt || function () { return 12; };
        const kerbM = 4.63 * 2.5;
        const proj = app.projectAhead || app.project || null;
        if (typeof proj !== "function") return;
        for (const sign of [-1, 1]) {
          let prevP = null;
          for (let off = 4; off <= 160; off += 4) {
            if (!inDrs(st.distanceM + off)) { prevP = null; continue; }
            const half = hwFn(st.distanceM + off);
            const inner = proj.call(app, off, sign * (half + 0.05));
            const outer = proj.call(app, off, sign * (half + 0.05 + kerbM));
            if (!inner || !outer || inner.fwd < 0.4 || outer.fwd < 0.4) { prevP = { inner: inner, outer: outer }; continue; }
            if (prevP && prevP.inner && prevP.outer && prevP.inner.fwd > 0.4) {
              const red = (((st.distanceM + off) % 8) + 8) % 8 < 4;
              ctx.fillStyle = red ? "rgba(220,70,70,0.92)" : "rgba(245,245,245,0.92)";
              ctx.beginPath();
              ctx.moveTo(prevP.inner.x, prevP.inner.y);
              ctx.lineTo(prevP.outer.x, prevP.outer.y);
              ctx.lineTo(outer.x, outer.y);
              ctx.lineTo(inner.x, inner.y);
              ctx.closePath();
              ctx.fill();
            }
            prevP = { inner: inner, outer: outer };
          }
        }
      } catch (e) {}
    };
    app._virDrs25 = true;
  }
  function tick() {
    const app = getApp();
    if (app) upgrade(app);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setInterval(tick, 1500);
  const frame = document.getElementById("simFrame");
  if (frame) frame.addEventListener("load", function () { setTimeout(tick, 80); });
})();
