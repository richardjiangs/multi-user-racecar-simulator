// bodykit.mjs — draw a car's side profile from the car's REAL dimensions.
//
// Why this exists: every body in the garage was a lozenge with the wheels pasted on top of it.
// None of them had a wheel arch, so none of them had proportions — a Revuelto and a 250 GTO
// came out the same shape in different colours, which is exactly what they are not.
//
// The fix is not to hand-draw 52 more blobs. It is to give the drawing the numbers that make a
// car look like itself: length, wheelbase, height, the two overhangs, the wheel diameters and
// the line of the roof. Feed those in and a Revuelto comes out cab-forward with a long tail and
// a roof at a quarter of its length, because that is what a Revuelto measures.
//
//   x runs REAR (left) to FRONT (right), matching every existing sim.
//   All inputs are millimetres, as published. The kit scales them to the frame.

export const FRAME = { w: 1000, h: 400, x0: 78, x1: 922, ground: 330 };

/* The roofline is given as [xFromFront (fraction of length), y (fraction of height)], front to
   back, y measured DOWN from the roof peak: 0 = highest point, 1 = at the sill.

   A THIRD element marks the point as a HARD CORNER: [x, y, "c"]. This matters more than any
   other single thing here. Smoothing every point into its neighbour — which is what this did —
   makes the whole top of the car one unbroken curve, so a 250 GTO, an F40 and a Model S all come
   out as the same rounded loaf with two bites taken out of the bottom for the arches. Real cars
   are full of hard creases: the base of a windscreen, the cut of a Kamm tail, the step down onto
   a boot lid, the shoulder over a rear arch. Those corners ARE the shape. */
export function profile(spec) {
  const { lengthMm, wheelbaseMm, heightMm, frontOverhangMm, rearOverhangMm } = spec;
  const drawL = FRAME.x1 - FRAME.x0;
  const k = drawL / lengthMm;                       // mm -> px
  const bodyH = heightMm * k;
  const sillH = (spec.sillMm != null ? spec.sillMm : 120) * k;   // ground clearance to the sill
  const rF = (spec.wheelDiaFrontMm / 2) * k, rR = (spec.wheelDiaRearMm / 2) * k;
  const axFront = FRAME.x1 - frontOverhangMm * k;
  const axRear = FRAME.x0 + rearOverhangMm * k;
  // sanity: the wheelbase has to be what is left between the axles
  const wbPx = axFront - axRear, wbWant = wheelbaseMm * k;
  const ground = FRAME.ground;
  const roofY = ground - bodyH;                      // the highest point of the car
  return {
    k, drawL, bodyH, sillH, rF, rR, axFront, axRear, ground, roofY,
    wbErr: Math.abs(wbPx - wbWant),
    cyF: ground - rF, cyR: ground - rR,
    sillY: ground - sillH,
    xAt: (fracFromFront) => FRAME.x1 - fracFromFront * drawL,
    yAt: (fracOfHeight) => roofY + fracOfHeight * (bodyH - sillH),
  };
}

/* THE HAUNCH — and this is the actual bite.
 *
 * Making the arch a tall ellipse so the tyre sits inside it was right, but it was only half the
 * job. Over the bonnet and the rear deck the body's own top surface sits LOWER than the new arch
 * apex, so the arch cut straight up through it: where the rising arch met the falling bonnet line
 * the outline closed in a sharp concave V. That notch, twice per car, is what has been getting
 * called a bite mark all along — and my arch fix put it there.
 *
 * A real car does not have that notch because it has a haunch: the wing over each wheel is raised
 * above the tyre and the bonnet falls away INSIDE it. So the roofline is lifted over each axle,
 * blended out over a fifth of the length, until the body is above its own arch everywhere.
 */
export function withHaunches(spec, P) {
  const arch = spec.archLift != null ? spec.archLift : 1.06;
  const span = spec.haunchSpan != null ? spec.haunchSpan : 0.13;   // how far the swell reaches
  const dh = P.bodyH - P.sillH;
  const axles = [
    { xf: (FRAME.x1 - P.axFront) / P.drawL, apex: P.cyF - P.rF * arch },
    { xf: (FRAME.x1 - P.axRear) / P.drawL, apex: P.cyR - P.rR * arch },
  ];
  // the highest the roofline may sit at a station, as a fraction, to stay clear of that arch
  const capAt = (xf) => {
    let cap = Infinity;
    for (const a of axles) {
      const d = Math.abs(xf - a.xf);
      if (d > span) continue;
      const t = 1 - d / span;                       // 1 over the axle, 0 at the edge of the swell
      const need = (a.apex - 5 - P.roofY) / dh;     // the body must clear the arch by 5px
      cap = Math.min(cap, need + (1 - t) * (1 - t) * 0.5);
    }
    return cap;
  };
  const roof = spec.roof.map(([xf, yf, k]) => {
    const cap = capAt(xf);
    return cap < yf ? [xf, Math.max(0, cap), k] : [xf, yf, k];
  });
  /* A CREST IS NOT ENOUGH, because the outline is not the roofline.
   *
   * bodyPath draws `Q` curves between roof points, and a quadratic Bézier SAGS below its control
   * point — it only touches the endpoints. So the edge that actually gets drawn sits below the
   * polyline this function reasons about, and a single raised point at the axle gets rounded off
   * and dips straight back under the arch. Measuring the roofline said every car was clean while
   * 21 of the 26 visibly had a notch over a wheel.
   *
   * The haunch is therefore a PLATEAU — three points across the top of the arch, not one — and it
   * carries a margin over what the arch needs, so whatever the smoothing takes off the top the
   * edge still clears. The acceptance test for this is not arithmetic: it hit-tests the drawn
   * shape column by column and looks for a dip.
   */
  const MARGIN = 0.055;              // in roofline fractions, absorbed by the Bézier sag
  for (const a of axles) {
    if (a.xf <= 0.03 || a.xf >= 0.97) continue;
    const cap = capAt(a.xf);
    if (!Number.isFinite(cap)) continue;
    const want = Math.max(0, cap - MARGIN);
    for (const dx of [-0.045, 0, 0.045]) {
      const xf = Number((a.xf + dx).toFixed(3));
      if (xf <= 0.005 || xf >= 0.995) continue;
      const near = roof.findIndex(([x]) => Math.abs(x - xf) < 0.02);
      if (near >= 0) roof[near] = [roof[near][0], Math.min(roof[near][1], want), roof[near][2]];
      else {
        const at = roof.findIndex(([x]) => x > xf);
        if (at > 0) roof.splice(at, 0, [xf, want]);
      }
    }
  }
  roof.sort((u, v) => u[0] - v[0]);
  return { ...spec, roof };
}

/* the body outline, WITH the arches cut into it — this is the whole difference */
export function bodyPath(spec, P) {
  // THE ARCH. This is where "a loaf with two bites out of it" actually came from. The arch was
  // drawn as a near-circle springing from the sill line — rx and ry both about one tyre radius —
  // so its apex sat 30-40 px BELOW the top of the tyre on every car in the garage. The wheel bulged
  // up through the opening and what was left of the body read as a shallow scoop bitten out of the
  // bottom edge. A real wheel arch is a TALL ellipse: it goes over the top of the tyre, so the
  // tyre sits INSIDE it. (The hand-drawn Audi R8 has rx 69.1, ry 96.2 — ry is 1.4x rx.)
  const arch = spec.archLift != null ? spec.archLift : 1.06;     // how far the arch clears the tyre
  const flare = spec.flareMm != null ? spec.flareMm * P.k : 0;   // arch mouth wider than the tyre
  const rearMouth = P.rR * arch + flare, frontMouth = P.rF * arch + flare;
  // the apex is a whole tyre-radius above the axle, plus the clearance — never at the sill
  const rearRise = P.sillY - (P.cyR - P.rR * arch);
  const frontRise = P.sillY - (P.cyF - P.rF * arch);
  // the front bumper face and the tail panel are the FIRST and LAST roof points: a car's nose
  // has a height, and letting the roofline own it is what stops every body ending in a spike
  const tailX = FRAME.x0 + (spec.tailInset != null ? spec.tailInset : 0) * P.drawL;
  const noseX = FRAME.x1 - (spec.noseInset != null ? spec.noseInset : 0) * P.drawL;
  const tailY = P.yAt(spec.roof[spec.roof.length - 1][1]);

  const top = spec.roof.map(([xf, yf, k]) => [P.xAt(xf), P.yAt(yf), k === "c"]);

  // the underside is not a plank: it lifts away from the road at both ends, which is what
  // stops a body reading as a slab with wheels stuck to it
  const lift = (spec.endLift != null ? spec.endLift : 0.30) * (P.sillY - P.roofY);
  // the sill between the arches. A mid-engined car pinches in above the floor, a saloon runs
  // straight, a car on a spaceframe steps. Left as one straight line for all 26 it was the other
  // half of the loaf — nothing between the two arch bites ever varied.
  const rocker = spec.rocker || "flat";
  const tuck = rocker === "tuck" ? P.bodyH * 0.055 : rocker === "step" ? P.bodyH * 0.03 : 0;
  // How far the valance hangs at each end. It was the same at both ends of all 26, so the bottom
  // of every car was the same shape too: a splitter-low nose and a diffuser-high tail are as much
  // of a car's stance as its roof is.
  const noseDrop = (spec.noseDrop != null ? spec.noseDrop : 0.20) * (P.sillY - P.roofY);
  const tailDrop = (spec.tailDrop != null ? spec.tailDrop : 0.34) * (P.sillY - P.roofY);
  const midX = (P.axRear + P.axFront) / 2;
  const between = (x0, x1) => {
    if (rocker === "step") {
      return `L${(x0 + (x1 - x0) * 0.12).toFixed(1)},${(P.sillY + tuck).toFixed(1)} ` +
        `L${(x0 + (x1 - x0) * 0.88).toFixed(1)},${(P.sillY + tuck).toFixed(1)} L${x1.toFixed(1)},${P.sillY.toFixed(1)}`;
    }
    if (rocker === "tuck") return `Q${midX.toFixed(1)},${(P.sillY + tuck).toFixed(1)} ${x1.toFixed(1)},${P.sillY.toFixed(1)}`;
    return `L${x1.toFixed(1)},${P.sillY.toFixed(1)}`;
  };

  const d = [];
  d.push(`M${tailX.toFixed(1)},${tailY.toFixed(1)}`);
  // down the tail panel, then forward under the rear overhang, rising as it goes back
  d.push(`Q${(tailX - 4).toFixed(1)},${(P.sillY - tailDrop * 0.62).toFixed(1)} ${(tailX + 10).toFixed(1)},${(P.sillY - tailDrop * 0.38).toFixed(1)}`);
  d.push(`L${(P.axRear - rearMouth).toFixed(1)},${P.sillY.toFixed(1)}`);
  // REAR ARCH — up OVER the top of the wheel and back down, not a scoop out of the sill
  d.push(`A${rearMouth.toFixed(1)},${rearRise.toFixed(1)} 0 0 1 ${(P.axRear + rearMouth).toFixed(1)},${P.sillY.toFixed(1)}`);
  d.push(between(P.axRear + rearMouth, P.axFront - frontMouth));
  // FRONT ARCH
  d.push(`A${frontMouth.toFixed(1)},${frontRise.toFixed(1)} 0 0 1 ${(P.axFront + frontMouth).toFixed(1)},${P.sillY.toFixed(1)}`);
  d.push(`L${(noseX - 10).toFixed(1)},${(P.sillY - noseDrop * 0.30).toFixed(1)}`);
  // round the bottom corner of the bumper, then run UP its face to meet the bonnet line
  const noseTop = P.yAt(spec.roof[0][1]);
  d.push(`Q${noseX.toFixed(1)},${(P.sillY - noseDrop * 0.45).toFixed(1)} ${noseX.toFixed(1)},${((P.sillY - noseDrop * 0.45 + noseTop) / 2).toFixed(1)}`);
  // up the face of the front bumper to the first roof point, then back along the top
  d.push(`L${top[0][0].toFixed(1)},${top[0][1].toFixed(1)}`);
  d.push(topEdge(top));
  d.push("Z");
  return d.join(" ");
}

/* THE TOP EDGE — and this is what kept putting the notches back.
 *
 * It used to be a chain of `Q cx,py x,y`: a quadratic whose control point is the PREVIOUS point's
 * height. A quadratic only touches its endpoints — it sags away from the control — so the line
 * that got drawn hung below the roofline every calculation here reasons about. Lift the body over
 * an axle and the smoothing quietly took the lift back out, which is why the arithmetic reported
 * every car clean while 21 of the 26 visibly had a bite out of a wing.
 *
 * This is a monotone cubic (Fritsch-Carlson tangents). It passes THROUGH every point and cannot
 * overshoot or sag between them, so the drawn edge IS the roofline. Points marked as corners break
 * the run, so a windscreen base or a Kamm cut is still a hard crease.
 */
export function topEdge(pts) {
  const out = [];
  let i = 0;
  while (i < pts.length - 1) {
    let j = i;                                        // the end of this smooth run
    while (j < pts.length - 1 && !pts[j + 1][2] && !pts[j][2]) j++;
    if (j === i) { const [x, y] = pts[i + 1]; out.push(`L${x.toFixed(1)},${y.toFixed(1)}`); i++; continue; }
    const run = pts.slice(i, j + 1);
    const n = run.length;
    const h = [], s = [];
    for (let k = 0; k < n - 1; k++) {
      h.push(run[k + 1][0] - run[k][0]);
      s.push(h[k] === 0 ? 0 : (run[k + 1][1] - run[k][1]) / h[k]);
    }
    const m = new Array(n);
    m[0] = s[0]; m[n - 1] = s[n - 2];
    for (let k = 1; k < n - 1; k++) m[k] = s[k - 1] * s[k] <= 0 ? 0 : (s[k - 1] + s[k]) / 2;
    for (let k = 0; k < n - 1; k++) {                 // Fritsch-Carlson: clamp so it stays monotone
      if (s[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
      const a = m[k] / s[k], b = m[k + 1] / s[k], t = a * a + b * b;
      if (t > 9) { const q = 3 / Math.sqrt(t); m[k] = q * a * s[k]; m[k + 1] = q * b * s[k]; }
    }
    for (let k = 0; k < n - 1; k++) {
      const [x0, y0] = run[k], [x1, y1] = run[k + 1], dx = h[k] / 3;
      out.push(`C${(x0 + dx).toFixed(1)},${(y0 + m[k] * dx).toFixed(1)} ` +
               `${(x1 - dx).toFixed(1)},${(y1 - m[k + 1] * dx).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`);
    }
    i = j;
  }
  return out.join(" ");
}

/* a wheel: tyre, rim face and the car's own spoke pattern.
   A wheel design is one of the things people actually recognise a car by — a Fuchs is not a
   BBS mesh is not a Borrani wire — so this carries the real families rather than a spoke count. */
export function wheel(cx, cy, r, style, accent, hubId) {
  const rim = r * 0.62;
  let spokes = "";
  const P = (a, r1, r2, wdeg) => {
    const w = (wdeg * Math.PI) / 180;
    const p = (ang, rr) => `${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`;
    return `M${p(a - w, r1)} L${p(a - w * 0.35, r2)} L${p(a + w * 0.35, r2)} L${p(a + w, r1)} Z`;
  };
  const pt = (ang, rr) => `${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`;
  if (style === "wire") {                              // a Borrani: 36 tension spokes and a knock-off
    for (let i = 0; i < 36; i++) {
      const a = (i * 10 * Math.PI) / 180;
      spokes += `<line x1="${(cx + Math.cos(a) * r * 0.14).toFixed(1)}" y1="${(cy + Math.sin(a) * r * 0.14).toFixed(1)}" x2="${(cx + Math.cos(a + 0.22) * rim).toFixed(1)}" y2="${(cy + Math.sin(a + 0.22) * rim).toFixed(1)}" stroke="#c9d2dc" stroke-width="1.1"/>`;
    }
  } else if (style === "dish") {                       // a smooth aero cover, seen on record cars
    spokes = `<circle cx="${cx}" cy="${cy}" r="${rim.toFixed(1)}" fill="#20252c"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${(rim * 0.62).toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1.6" opacity="0.55"/>`;
  } else if (style === "mesh") {                       // a BBS-style woven mesh: crossed thin spokes
    for (let i = 0; i < 20; i++) {
      const a = (i * 18 * Math.PI) / 180;
      spokes += `<line x1="${pt(a, r * 0.2).split(",")[0]}" y1="${pt(a, r * 0.2).split(",")[1]}" x2="${pt(a + 0.55, rim).split(",")[0]}" y2="${pt(a + 0.55, rim).split(",")[1]}" stroke="#39414a" stroke-width="2"/>`;
      spokes += `<line x1="${pt(a, r * 0.2).split(",")[0]}" y1="${pt(a, r * 0.2).split(",")[1]}" x2="${pt(a - 0.55, rim).split(",")[0]}" y2="${pt(a - 0.55, rim).split(",")[1]}" stroke="#2a3138" stroke-width="2"/>`;
    }
  } else if (style === "fuchs") {                      // a Fuchs: five broad leaves with a raised rib
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72) * Math.PI) / 180;
      spokes += `<path d="${P(a, r * 0.18, rim * 0.98, 26)}" fill="#333b43"/>`;
      spokes += `<path d="M${pt(a, r * 0.24)} L${pt(a, rim * 0.9)}" stroke="#c3ccd4" stroke-width="2.4"/>`;
    }
  } else if (style === "basket") {                     // a modern forged basket: ten thin paired spokes
    for (let i = 0; i < 10; i++) {
      const a = ((i * 36) * Math.PI) / 180;
      spokes += `<path d="${P(a - 0.06, r * 0.17, rim, 9)}" fill="#2e353d"/>`;
      spokes += `<path d="${P(a + 0.06, r * 0.17, rim, 9)}" fill="#252b32"/>`;
    }
  } else if (style === "telephone") {                  // a 1980s telephone-dial: five round cut-outs
    spokes = `<circle cx="${cx}" cy="${cy}" r="${rim.toFixed(1)}" fill="#2f363e"/>`;
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72 + 18) * Math.PI) / 180;
      spokes += `<circle cx="${(cx + Math.cos(a) * rim * 0.55).toFixed(1)}" cy="${(cy + Math.sin(a) * rim * 0.55).toFixed(1)}" r="${(rim * 0.26).toFixed(1)}" fill="#0d1116"/>`;
    }
  } else if (style === "split") {                      // a Y-spoke: five spokes that fork at the rim
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72) * Math.PI) / 180;
      spokes += `<path d="M${pt(a, r * 0.18)} L${pt(a - 0.17, rim)} L${pt(a - 0.10, rim)} L${pt(a, r * 0.3)} L${pt(a + 0.10, rim)} L${pt(a + 0.17, rim)} Z" fill="#2b3138"/>`;
    }
  } else {
    const n = style === "five" ? 5 : style === "ten" ? 10 : style === "turbine" ? 12 : 7;
    for (let i = 0; i < n; i++) {
      spokes += `<path d="${P(((i * 360) / n) * Math.PI / 180, r * 0.16, rim, 360 / n * 0.34)}" fill="#2b3138"/>`;
    }
  }
  return `<g>
      <circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="#0a0b0e"/>
      <circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="#1b1f25" stroke-width="${(r * 0.13).toFixed(1)}"/>
      <circle cx="${cx}" cy="${cy}" r="${(r * 0.9).toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1.4" opacity="0.5"/>
      <circle cx="${cx}" cy="${cy}" r="${rim.toFixed(1)}" fill="#14181d"/>
      <g class="wSpin" style="transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg))">${spokes}</g>
      <circle cx="${cx}" cy="${cy}" r="${(r * 0.13).toFixed(1)}" fill="url(#${hubId})"/>
    </g>`;
}
