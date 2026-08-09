// detail.mjs — the furniture that makes a painted shape read as a particular car.
//
// The dimensioned body was the right foundation and the wrong stopping point. A silhouette with
// one grey polygon for glass and a 5 px lamp is what the garage looked like when it was described
// as "a half-bitten banana coloured in fifty-two ways" — and that was fair. What a viewer actually
// reads a car by is the FURNITURE:
//
//   * the daylight opening — a windscreen, side glass and a backlight, with a surround and real
//     pillars. One flat polygon is the single biggest reason a body looks generic.
//   * the front end — a Bugatti has a horseshoe, an Audi has a single frame, a 250 GTO has an egg
//     crate and three round lamps, an F40 has pop-ups and a slot. These are not variations of one
//     grille; they are different objects.
//   * the rear end — round lamps in pairs (Ferrari), a full-width bar (Corvette), louvres over an
//     engine, a diffuser with fins.
//   * the flanks — a NACA duct, a side blade, gills, a strake, a skirt, covered rear wheels.
//
// Every primitive here is drawn from the real thing, and each takes the profile P so it lands in
// the right place on whatever body it is bolted to.

const f = (n) => Number(n).toFixed(1);

/* ------------------------------------------------------------------ *
 * the daylight opening                                               *
 * ------------------------------------------------------------------ */

/* interpolate the roofline at an arbitrary x fraction, so glass can start anywhere */
export function roofAt(spec, P, xf) {
  const r = spec.roof;
  if (xf <= r[0][0]) return P.yAt(r[0][1]);
  for (let i = 1; i < r.length; i++) {
    if (xf <= r[i][0]) {
      const t = (xf - r[i - 1][0]) / (r[i][0] - r[i - 1][0] || 1);
      return P.yAt(r[i - 1][1] + t * (r[i][1] - r[i - 1][1]));
    }
  }
  return P.yAt(r[r.length - 1][1]);
}

/* the DLO as a closed path: up the screen, back along the roof, down the backlight, along the belt.
   The roof section is smoothed with the SAME quadratics bodyPath uses — drawn as straight
   segments it cuts the corners the body rounds, and the glass pokes through the roof at the peak. */
export function dloPath(spec, P, G) {
  const beltY = P.yAt(G.base);
  const inset = G.inset != null ? G.inset : 0.03;
  const dh = P.bodyH - P.sillH;
  const pts = [[P.xAt(G.roofF), roofAt(spec, P, G.roofF) + inset * dh, false]];
  for (const [xf, yf, k] of spec.roof) {
    if (xf > G.roofF + 0.001 && xf < G.roofR - 0.001) pts.push([P.xAt(xf), P.yAt(yf + inset), k === "c"]);
  }
  pts.push([P.xAt(G.roofR), roofAt(spec, P, G.roofR) + inset * dh, false]);

  const d = [`M${f(P.xAt(G.cowl))},${f(beltY)}`, `L${f(pts[0][0])},${f(pts[0][1])}`];
  for (let i = 1; i < pts.length; i++) {
    const [px, py, pCorner] = pts[i - 1], [x, y, corner] = pts[i];
    // the glass follows the same corners the body does, or the roof creases and the glass does not
    if (corner || pCorner) d.push(`L${f(x)},${f(y)}`);
    else d.push(`Q${f((px + x) / 2)},${f(py)} ${f(x)},${f(y)}`);
  }
  d.push(`L${f(P.xAt(G.deck))},${f(beltY)} Z`);
  return d.join(" ");
}

export function greenhouse(spec, P, ID, acc) {
  const G = spec.glass;
  if (!G || G.none) return "";
  const beltY = P.yAt(G.base);
  const inset = G.inset != null ? G.inset : 0.03;
  const dh = P.bodyH - P.sillH;
  const path = dloPath(spec, P, G);
  const o = [];

  o.push(`<path d="${path}" fill="url(#${ID("Glass")})"/>`);
  // the specular streak that tells you it is glass and not a hole
  o.push(`<path d="${path}" fill="none" clip-path="none" opacity="0"/>`);
  o.push(`<g clip-path="url(#${ID("Dlo")})">
      <path d="M${f(P.xAt(G.cowl) + 4)},${f(beltY)} L${f(P.xAt(G.roofF) - 6)},${f(roofAt(spec, P, G.roofF))} L${f(P.xAt(G.roofF) + 14)},${f(roofAt(spec, P, G.roofF))} L${f(P.xAt(G.cowl) + 26)},${f(beltY)} Z" fill="rgba(255,255,255,0.30)"/>
      <path d="M${f(P.xAt(G.roofR) - 10)},${f(beltY)} L${f(P.xAt(G.roofR) + 20)},${f(roofAt(spec, P, G.roofR))} L${f(P.xAt(G.roofR) + 28)},${f(roofAt(spec, P, G.roofR))} L${f(P.xAt(G.roofR) + 2)},${f(beltY)} Z" fill="rgba(255,255,255,0.13)"/>
    </g>`);

  /* The A-pillar and the C-pillar are structure. On a car with a chromed or satin surround they
     are PAINTED — drawing them black there was what made a 250 GTO's roof read as a black wedge
     dropped on top of a red car instead of part of the same body. */
  const sur = G.surround || "black";
  const pillar = (x0, y0, x1, y1, w, col) =>
    `<path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="butt"/>`;
  const pw = G.pillarW || 6;
  const pc = G.pillarCol || (sur === "chrome" || sur === "satin" ? spec.paint[1] : "#10141a");
  o.push(pillar(P.xAt(G.cowl), beltY, P.xAt(G.roofF), roofAt(spec, P, G.roofF) + inset * dh, pw, pc));
  o.push(pillar(P.xAt(G.deck), beltY, P.xAt(G.roofR), roofAt(spec, P, G.roofR) + inset * dh, G.cPillarW || pw, pc));

  /* B-pillars / quarter-light divisions: a saloon has them, a coupe usually does not */
  for (const xf of G.split || []) {
    o.push(pillar(P.xAt(xf), beltY, P.xAt(xf + 0.006), roofAt(spec, P, xf) + inset * dh, G.splitW || 4, pc));
  }

  /* a vent window on a pre-1970 car */
  if (G.vent) {
    const vx = P.xAt(G.cowl - 0.045);
    o.push(pillar(vx, beltY, vx + 5, roofAt(spec, P, G.cowl - 0.045) + inset * dh, 2.4, sur === "chrome" ? "#dfe7ee" : pc));
  }

  /* the surround goes on LAST so it frames the pillars rather than sitting under them */
  if (sur !== "none") {
    const col = sur === "chrome" ? "#dfe7ee" : sur === "satin" ? "#9aa5b0" : "#0c1015";
    const w = G.frameW || (sur === "chrome" ? 2.4 : 2.8);
    o.push(`<path d="${path}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`);
    if (sur === "chrome") o.push(`<path d="${path}" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="0.8"/>`);
  }
  if (G.dripRail) {
    const pts = spec.roof.filter(([xf]) => xf >= G.roofF - 0.02 && xf <= G.roofR + 0.02);
    if (pts.length > 1) {
      o.push(`<path d="${pts.map(([xf, yf], i) => `${i ? "L" : "M"}${f(P.xAt(xf))},${f(P.yAt(yf) + 3)}`).join(" ")}" fill="none" stroke="#cfd8e0" stroke-width="1.6" opacity="0.8"/>`);
    }
  }
  return o.join("\n      ");
}

/* ------------------------------------------------------------------ *
 * the front end                                                      *
 * ------------------------------------------------------------------ */

export function frontEnd(spec, P, ID, acc) {
  const F = spec.front || {};
  const o = [];
  // Everything at the nose is placed as a FRACTION OF LENGTH and hung off the body's own surface
  // at that station. Placing it in absolute pixels off the frame edge is what left every lamp
  // clipped to a white sliver hanging past the bumper: the nose is a curve, not a wall.
  const noseXf = 0.035 + (spec.noseInset || 0);
  const noseX = P.xAt(noseXf);
  const surf = (xf) => roofAt(spec, P, xf);                    // the top of the body at a station
  const between = (xf, t) => surf(xf) + t * (P.sillY - surf(xf));
  const gy = between(noseXf + 0.02, F.grilleY != null ? F.grilleY : 0.52);
  const gw = (F.grilleW != null ? F.grilleW : 0.042) * P.drawL;
  const gh = (F.grilleH != null ? F.grilleH : 0.20) * P.bodyH;
  const dark = "#080b0f";

  switch (F.grille) {
    case "horseshoe":   // Bugatti: a tall arch, chromed, with a fine grid in it
      o.push(`<path d="M${f(noseX - 2)},${f(gy - gh * 0.9)} q${f(-gw * 1.5)},${f(gh * 0.9)} 0,${f(gh * 1.8)} Z" fill="${dark}" stroke="#dfe7ee" stroke-width="2"/>`);
      for (let i = 1; i < 5; i++) o.push(`<path d="M${f(noseX - 3)},${f(gy - gh * 0.9 + (i * gh * 1.8) / 5)} l${f(-gw * 1.1)},0" stroke="rgba(200,214,228,0.5)" stroke-width="1"/>`);
      break;
    case "eggcrate":    // a 1960s Ferrari / Aston: an oval mouth with a woven mesh
      o.push(`<ellipse cx="${f(noseX - gw * 0.6)}" cy="${f(gy)}" rx="${f(gw * 0.75)}" ry="${f(gh * 0.7)}" fill="${dark}" stroke="#cfd8e0" stroke-width="2"/>`);
      for (let i = -2; i <= 2; i++) o.push(`<path d="M${f(noseX - gw * 1.3)},${f(gy + i * gh * 0.24)} l${f(gw * 1.4)},0" stroke="rgba(190,204,218,0.45)" stroke-width="0.9"/>`);
      break;
    case "singleframe": // Audi: a wide flat hexagon
      o.push(`<path d="M${f(noseX)},${f(gy - gh * 0.55)} l${f(-gw * 1.6)},${f(gh * 0.18)} l0,${f(gh * 0.8)} l${f(gw * 1.6)},${f(gh * 0.2)} Z" fill="${dark}" stroke="#8e98a3" stroke-width="1.6"/>`);
      break;
    case "kidney":      // BMW: two upright kidneys, so in profile a tall narrow slot
      o.push(`<path d="M${f(noseX - 2)},${f(gy - gh * 0.8)} l${f(-gw * 0.8)},${f(gh * 0.2)} l0,${f(gh * 1.3)} l${f(gw * 0.8)},${f(gh * 0.2)} Z" fill="${dark}" stroke="#b9c3cd" stroke-width="1.8"/>`);
      break;
    case "slot":        // a wedge-era supercar: one thin letterbox and nothing else
      o.push(`<rect x="${f(noseX - gw * 1.5)}" y="${f(gy - 4)}" width="${f(gw * 1.5)}" height="8" rx="3" fill="${dark}" stroke="${acc}" stroke-opacity="0.5"/>`);
      break;
    case "mouth":       // a modern hypercar: one huge low opening feeding the radiators
      o.push(`<path d="M${f(noseX - 4)},${f(gy - gh * 0.2)} q${f(-gw * 1.2)},${f(gh * 0.35)} ${f(-gw * 1.9)},${f(gh * 0.95)} l${f(gw * 0.4)},${f(gh * 0.35)} q${f(gw * 0.9)},${f(-gh * 0.6)} ${f(gw * 1.6)},${f(-gh * 0.75)} Z" fill="${dark}" stroke="rgba(255,255,255,0.28)"/>`);
      break;
    case "shark":       // a Le Mans prototype: a low duct under a shovel nose
      o.push(`<path d="M${f(noseX - 6)},${f(gy + gh * 0.2)} l${f(-gw * 1.8)},${f(gh * 0.3)} l0,${f(gh * 0.5)} l${f(gw * 1.8)},${f(-gh * 0.2)} Z" fill="${dark}" stroke="rgba(255,255,255,0.22)"/>`);
      break;
    case "mesh":        // a Japanese turbo car: a rectangular grille with a fine mesh
      o.push(`<rect x="${f(noseX - gw * 1.5)}" y="${f(gy - gh * 0.5)}" width="${f(gw * 1.5)}" height="${f(gh)}" rx="3" fill="${dark}" stroke="#8e98a3" stroke-width="1.4"/>`);
      for (let i = 1; i < 4; i++) o.push(`<path d="M${f(noseX - gw * 1.5)},${f(gy - gh * 0.5 + (i * gh) / 4)} l${f(gw * 1.5)},0" stroke="rgba(160,176,192,0.4)" stroke-width="0.8"/>`);
      break;
    default: break;     // an EV or a closed nose really has no grille at all
  }

  /* the lower intake and the splitter blade sit under whatever the grille is */
  if (F.lowerIntake !== false) {
    o.push(`<path d="M${f(noseX - 6)},${f(P.sillY - P.bodyH * 0.10)} L${f(noseX - P.drawL * 0.085)},${f(P.sillY - P.bodyH * 0.07)} L${f(noseX - P.drawL * 0.082)},${f(P.sillY - 2)} L${f(noseX - 8)},${f(P.sillY - 4)} Z" fill="#0a0d12" stroke="rgba(255,255,255,0.16)"/>`);
  }

  /* the headlamp — the shape is the make's signature, so it is not one primitive with a scale */
  const lampXf = F.lampX != null ? F.lampX : noseXf + 0.045;
  const lx = P.xAt(lampXf);
  const ly = between(lampXf, F.lampT != null ? F.lampT : 0.24);
  const lamp = F.lamp || spec.headlamp || "strip";
  const lensR = P.bodyH * (F.lampR || 0.055);
  if (lamp === "round") {
    o.push(`<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(lensR)}" fill="#9fb6c8" stroke="#e2ebf2" stroke-width="1.8"/>`);
    o.push(`<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(lensR * 0.5)}" fill="#dfeaf2"/>`);
    o.push(`<circle cx="${f(lx - lensR * 0.3)}" cy="${f(ly - lensR * 0.3)}" r="${f(lensR * 0.2)}" fill="#ffffff" opacity="0.85"/>`);
  } else if (lamp === "coveredRound") {   // a 250 GTO / DB5: a round lamp behind a faired perspex cover
    o.push(`<path d="M${f(lx + lensR * 1.1)},${f(ly - lensR)} q${f(-lensR * 2.4)},${f(-2)} ${f(-lensR * 2.6)},${f(lensR * 2)} l${f(lensR * 2.5)},2 Z" fill="rgba(214,232,244,0.5)" stroke="#cfd8e0" stroke-width="1.4"/>`);
    o.push(`<circle cx="${f(lx - lensR * 0.4)}" cy="${f(ly + lensR * 0.25)}" r="${f(lensR * 0.7)}" fill="#a8bccc" stroke="#dbe6ee"/>`);
  } else if (lamp === "quadRound") {      // a 1960s Mercedes / Jaguar: a big lamp and a small one
    o.push(`<circle cx="${f(lx)}" cy="${f(ly)}" r="${f(lensR)}" fill="#a8bccc" stroke="#dbe6ee" stroke-width="1.6"/>`);
    o.push(`<circle cx="${f(lx - lensR * 2.1)}" cy="${f(ly + lensR * 0.5)}" r="${f(lensR * 0.55)}" fill="#ffe9a8" stroke="#c6b27a" stroke-width="1.2"/>`);
  } else if (lamp === "pop") {            // an F40 / 917: the lamp is down, so you see the lid
    o.push(`<rect x="${f(lx - P.drawL * 0.055)}" y="${f(ly - 3)}" width="${f(P.drawL * 0.062)}" height="7" rx="3" fill="#1a1f26" stroke="#8e979f" stroke-width="1.2"/>`);
    o.push(`<path d="M${f(lx - P.drawL * 0.05)},${f(ly + 5)} l${f(P.drawL * 0.05)},0" stroke="rgba(0,0,0,0.4)" stroke-width="1.4"/>`);
  } else if (lamp === "boomerang") {      // a modern Lamborghini / Ferrari: an angled Y or L blade
    o.push(`<path d="M${f(lx + lensR * 0.8)},${f(ly - lensR * 0.7)} l${f(-lensR * 1.9)},${f(lensR * 0.45)} l${f(lensR * 0.45)},${f(lensR * 0.8)} l${f(lensR * 1.6)},${f(-lensR * 0.5)} Z" fill="#dfeaf4" stroke="#8e9aa6" stroke-width="1"/>`);
  } else if (lamp === "slit") {           // a Lotus / Rimac: a very thin LED line
    o.push(`<path d="M${f(lx + lensR * 0.8)},${f(ly)} l${f(-lensR * 2.4)},${f(lensR * 0.3)}" stroke="${F.lampCol || "#dff0ff"}" stroke-width="3.2" stroke-linecap="round"/>`);
  } else if (lamp === "cluster") {        // a modern GT: a lens with a DRL bar over it
    o.push(`<path d="M${f(lx + lensR * 0.9)},${f(ly - lensR * 0.45)} l${f(-lensR * 2)},${f(lensR * 0.32)} l0,${f(lensR * 0.85)} l${f(lensR * 2)},${f(-lensR * 0.25)} Z" fill="#cfe0ee" stroke="#8894a0" stroke-width="1"/>`);
    o.push(`<path d="M${f(lx + lensR * 0.85)},${f(ly - lensR * 0.62)} l${f(-lensR * 1.9)},${f(lensR * 0.3)}" stroke="${acc}" stroke-width="1.8" stroke-linecap="round"/>`);
  } else {                                 // "strip": the modern default, a wrapped LED signature
    o.push(`<path d="M${f(lx + lensR)},${f(ly - 2)} q${f(-lensR * 1.5)},-2 ${f(-lensR * 2.4)},${f(lensR * 0.7)}" fill="none" stroke="#eaf3fa" stroke-width="3.6" stroke-linecap="round"/>`);
    o.push(`<path d="M${f(lx + lensR)},${f(ly + 4)} q${f(-lensR * 1.2)},0 ${f(-lensR * 2)},${f(lensR * 0.55)}" fill="none" stroke="${acc}" stroke-width="1.6" opacity="0.7"/>`);
  }

  /* a chrome bumper is a whole object on a pre-1970 car, and nothing at all after it */
  if (F.bumper === "chrome") {
    const by = between(noseXf + 0.03, 0.72);
    o.push(`<path d="M${f(noseX)},${f(by)} q${f(-P.drawL * 0.05)},${f(6)} ${f(-P.drawL * 0.09)},${f(3)}" fill="none" stroke="#e6eef4" stroke-width="6" stroke-linecap="round"/>`);
    o.push(`<path d="M${f(noseX)},${f(by)} q${f(-P.drawL * 0.05)},${f(6)} ${f(-P.drawL * 0.09)},${f(3)}" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.6" stroke-linecap="round"/>`);
  }

  /* the bonnet shutline, offset just under the roofline — it is what gives a bonnet a length */
  if (F.bonnetLine !== false) {
    const a = spec.roof.filter(([xf]) => xf <= (spec.glass ? spec.glass.cowl : 0.3) + 0.01);
    if (a.length > 1) {
      o.push(`<path d="${a.map(([xf, yf], i) => `${i ? "L" : "M"}${f(P.xAt(xf))},${f(P.yAt(yf) + 5)}`).join(" ")}" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.6"/>`);
    }
  }
  return o.join("\n      ");
}

/* ------------------------------------------------------------------ *
 * the rear end                                                       *
 * ------------------------------------------------------------------ */

export function rearEnd(spec, P, ID, acc) {
  const R = spec.rear || {};
  const tailXf = 0.988 - (spec.tailInset || 0);
  const tailX = P.xAt(tailXf);
  const surf = (xf) => roofAt(spec, P, xf);
  const ly = surf(tailXf - 0.02) + (R.lampT != null ? R.lampT : 0.30) * (P.sillY - surf(tailXf - 0.02));
  const o = [];
  const red = R.lampCol || "#e0223c";
  const r = P.bodyH * 0.075;

  if (R.lamp === "roundPair") {          // Ferrari, Corvette: two round lenses side by side
    o.push(`<circle cx="${f(tailX + r * 1.4)}" cy="${f(ly)}" r="${f(r)}" fill="${red}" stroke="rgba(0,0,0,0.45)"/>`);
    o.push(`<circle cx="${f(tailX + r * 3.7)}" cy="${f(ly)}" r="${f(r)}" fill="${red}" stroke="rgba(0,0,0,0.45)"/>`);
  } else if (R.lamp === "roundSingle") {
    o.push(`<circle cx="${f(tailX + r * 1.5)}" cy="${f(ly)}" r="${f(r * 1.1)}" fill="${red}" stroke="rgba(0,0,0,0.45)"/>`);
  } else if (R.lamp === "bar") {         // a full-width light bar, which is a modern signature
    o.push(`<path d="M${f(tailX + 3)},${f(ly)} l${f(P.drawL * 0.075)},${f(-2)}" stroke="${red}" stroke-width="6" stroke-linecap="round"/>`);
    o.push(`<path d="M${f(tailX + 3)},${f(ly)} l${f(P.drawL * 0.075)},${f(-2)}" stroke="rgba(255,180,190,0.55)" stroke-width="2"/>`);
  } else if (R.lamp === "stack") {       // an upright cluster on a classic saloon
    o.push(`<rect x="${f(tailX + 2)}" y="${f(ly - r * 1.4)}" width="7" height="${f(r * 2.8)}" rx="2.5" fill="${red}"/>`);
    o.push(`<rect x="${f(tailX + 2)}" y="${f(ly + r * 1.5)}" width="7" height="${f(r * 0.9)}" rx="2" fill="#ffcf6a"/>`);
  } else {                                // "slim": a thin wrapped lens
    o.push(`<path d="M${f(tailX + 2)},${f(ly - 3)} l${f(P.drawL * 0.05)},${f(-1)} l0,9 l${f(-P.drawL * 0.05)},2 Z" fill="${red}"/>`);
  }

  /* the vent over an engine that lives behind the driver */
  if (R.vent === "louvre") {
    const x0 = P.xAt(R.ventX != null ? R.ventX : 0.74), y0 = P.yAt(R.ventY != null ? R.ventY : 0.22);
    for (let i = 0; i < (R.ventN || 6); i++) {
      o.push(`<path d="M${f(x0 - i * 11)},${f(y0 + i * 2.4)} l${f(-26)},${f(5)}" stroke="rgba(0,0,0,0.62)" stroke-width="3.4" stroke-linecap="round"/>`);
    }
  } else if (R.vent === "mesh") {
    const x0 = P.xAt(R.ventX != null ? R.ventX : 0.72), y0 = P.yAt(R.ventY != null ? R.ventY : 0.24);
    o.push(`<rect x="${f(x0 - P.drawL * 0.07)}" y="${f(y0)}" width="${f(P.drawL * 0.07)}" height="${f(P.bodyH * 0.13)}" rx="3" fill="#080b0f" stroke="rgba(255,255,255,0.2)"/>`);
    for (let i = 1; i < 4; i++) o.push(`<path d="M${f(x0 - P.drawL * 0.07)},${f(y0 + (i * P.bodyH * 0.13) / 4)} l${f(P.drawL * 0.07)},0" stroke="rgba(150,166,182,0.35)" stroke-width="0.8"/>`);
  } else if (R.vent === "glassEngine") {  // a Pagani / Czinger: you can see the engine through it
    const x0 = P.xAt(R.ventX != null ? R.ventX : 0.70), y0 = P.yAt(R.ventY != null ? R.ventY : 0.20);
    o.push(`<rect x="${f(x0 - P.drawL * 0.08)}" y="${f(y0)}" width="${f(P.drawL * 0.08)}" height="${f(P.bodyH * 0.12)}" rx="4" fill="rgba(120,150,175,0.35)" stroke="rgba(220,236,250,0.5)"/>`);
    o.push(`<circle cx="${f(x0 - P.drawL * 0.055)}" cy="${f(y0 + P.bodyH * 0.06)}" r="4" fill="#c8a24a"/>`);
    o.push(`<circle cx="${f(x0 - P.drawL * 0.028)}" cy="${f(y0 + P.bodyH * 0.06)}" r="4" fill="#c8a24a"/>`);
  }

  /* the diffuser: fins under the tail, which is why a modern car's rear looks hollow */
  if (R.diffuser !== false) {
    const x1 = tailX + P.drawL * 0.02, y = P.sillY + 4, w = P.drawL * 0.085, h = P.bodyH * 0.11;
    o.push(`<path d="M${f(x1)},${f(y - h)} l${f(w)},${f(-2)} l0,${f(h + 6)} l${f(-w)},0 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.16)"/>`);
    for (let i = 1; i < 4; i++) o.push(`<path d="M${f(x1 + (i * w) / 4)},${f(y - h)} l0,${f(h + 5)}" stroke="rgba(170,186,200,0.38)" stroke-width="1.4"/>`);
  }

  return o.join("\n      ");
}

/* a ducktail or a lip is bodywork standing proud of the deck, so it is drawn outside the paint */
export function rearSpoiler(spec, P, acc) {
  const R = spec.rear || {};
  if (!R.spoiler) return "";
  // it sits ON the deck, over the last tenth of the car — a ducktail is a kick-up in the bodywork,
  // not a fin cantilevered off the tail panel
  const x0 = P.xAt(0.90), x1 = P.xAt(0.975);
  const y0 = roofAt(spec, P, 0.90) + 2, y1 = roofAt(spec, P, 0.975) + 2;
  if (R.spoiler === "ducktail") {
    const h = P.bodyH * 0.055;
    return `<path d="M${f(x0)},${f(y0)} Q${f((x0 + x1) / 2)},${f(y1 - h * 1.4)} ${f(x1)},${f(y1 - h)} l0,7 Q${f((x0 + x1) / 2)},${f(y1 - h * 0.4 + 7)} ${f(x0)},${f(y0 + 6)} Z" fill="${spec.paint[1]}" stroke="rgba(255,255,255,0.42)" stroke-width="1.2"/>`;
  }
  return `<path d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1 - P.bodyH * 0.03)} l0,5 L${f(x0)},${f(y0 + 5)} Z" fill="#12161c" stroke="${acc}" stroke-opacity="0.5"/>`;
}

/* ------------------------------------------------------------------ *
 * the flanks                                                         *
 * ------------------------------------------------------------------ */

/* Things that lie FLAT on a panel (a duct, a gill, a stripe) belong under the body's clip.
   Things that stand PROUD of it (a fin, an airbox, a roll hoop, a fan, a faired-in rear wheel)
   are cut in half by that clip and vanish, so they are drawn outside it. */
export const PROUD = ["fin", "airbox", "rollhoop", "fan", "coveredRear", "topexit", "scoop", "sidepipe"];

export function sideKit(spec, P, ID, acc, layer) {
  const o = [];
  for (const item of spec.side || []) {
    const [kind, ax, ay] = Array.isArray(item) ? item : [item, null, null];
    const proud = PROUD.includes(kind);
    if (layer === "proud" ? !proud : proud) continue;
    const x = P.xAt(ax != null ? ax : 0.5);
    const top = roofAt(spec, P, ax != null ? ax : 0.5);
    // y is a fraction of the body's own depth AT THIS STATION, so a duct lands on the flank
    // rather than at a fixed height that may be above the roof or below the sill
    const y = top + (ay != null ? ay : 0.40) * (P.sillY - top);
    switch (kind) {
      case "naca":       // the F40's flush duct: it starts as a hairline and widens as it goes back
        o.push(`<path d="M${f(x)},${f(y)} L${f(x - P.drawL * 0.055)},${f(y + 2)} q${f(-10)},${f(2)} ${f(-12)},${f(9)} l${f(P.drawL * 0.05)},${f(-2)} Z" fill="#0a0e13"/>`);
        o.push(`<path d="M${f(x)},${f(y)} L${f(x - P.drawL * 0.055)},${f(y + 2)}" stroke="rgba(255,255,255,0.4)" stroke-width="1.4"/>`);
        o.push(`<path d="M${f(x - P.drawL * 0.005)},${f(y + 7)} L${f(x - P.drawL * 0.06)},${f(y + 10)}" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>`);
        break;
      case "blade":      // the R8's side blade: a whole panel in a contrasting finish
        o.push(`<path d="M${f(x)},${f(y - P.bodyH * 0.10)} l${f(-P.drawL * 0.13)},${f(P.bodyH * 0.05)} l${f(6)},${f(P.bodyH * 0.20)} l${f(P.drawL * 0.12)},${f(-P.bodyH * 0.07)} Z" fill="#161b21" stroke="rgba(255,255,255,0.24)" stroke-width="1.3"/>`);
        break;
      case "gill":       // three short louvred gills behind the front arch, cut into the panel
        for (let i = 0; i < 3; i++) {
          o.push(`<path d="M${f(x - i * 10)},${f(y + i * 3)} l${f(-18)},${f(3)}" stroke="rgba(0,0,0,0.62)" stroke-width="3.4" stroke-linecap="round"/>`);
          o.push(`<path d="M${f(x - i * 10)},${f(y + i * 3 - 2)} l${f(-18)},${f(3)}" stroke="rgba(255,255,255,0.22)" stroke-width="1.1" stroke-linecap="round"/>`);
        }
        break;
      case "strake":     // a long horizontal fin along the sill
        o.push(`<path d="M${f(x)},${f(y)} l${f(-P.drawL * 0.17)},${f(5)} l0,5 l${f(P.drawL * 0.17)},${f(-4)} Z" fill="#12171d" stroke="${acc}" stroke-opacity="0.4"/>`);
        break;
      case "skirt":      // a deep side skirt with a turning vane at its front
        o.push(`<path d="M${f(P.axFront - P.rF * 1.15)},${f(P.sillY + 2)} L${f(P.axRear + P.rR * 1.15)},${f(P.sillY + 4)} l0,8 L${f(P.axFront - P.rF * 1.10)},${f(P.sillY + 9)} Z" fill="#0b0f14" stroke="rgba(255,255,255,0.15)"/>`);
        break;
      case "intake": {   // a big side intake feeding a mid engine: a mouth with a lip and a floor
        const w = P.drawL * 0.062, h = P.bodyH * 0.15;
        o.push(`<path d="M${f(x)},${f(y - h * 0.5)} q${f(-w * 0.55)},${f(-4)} ${f(-w)},${f(3)} l${f(3)},${f(h)} q${f(w * 0.5)},${f(-5)} ${f(w * 0.95)},${f(-6)} Z" fill="#0b1016"/>`);
        o.push(`<path d="M${f(x)},${f(y - h * 0.5)} q${f(-w * 0.55)},${f(-4)} ${f(-w)},${f(3)}" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="2"/>`);
        o.push(`<path d="M${f(x - w * 0.1)},${f(y + h * 0.34)} q${f(w * 0.4)},${f(-4)} ${f(w * 0.82)},${f(-5)}" fill="none" stroke="${acc}" stroke-width="1.6" opacity="0.55"/>`);
        break;
      }
      case "cline":      // the arc that splits door from haunch on a modern Bugatti
        o.push(`<path d="M${f(x)},${f(y - P.bodyH * 0.10)} q${f(-30)},${f(P.bodyH * 0.18)} ${f(-6)},${f(P.bodyH * 0.40)} l${f(-19)},${f(2)} q${f(-23)},${f(-P.bodyH * 0.24)} ${f(6)},${f(-P.bodyH * 0.44)} Z" fill="#0a0e14" stroke="${acc}" stroke-width="1.6" stroke-opacity="0.65"/>`);
        break;
      case "louvre":     // louvres over the rear wheel, ahead of the tail
        for (let i = 0; i < 5; i++) o.push(`<path d="M${f(x - i * 10)},${f(y + i * 2)} l${f(-22)},${f(4)}" stroke="rgba(0,0,0,0.55)" stroke-width="3" stroke-linecap="round"/>`);
        break;
      case "scoop":      // a roof or shoulder scoop standing proud of the panel
        o.push(`<path d="M${f(x)},${f(y)} q${f(-P.drawL * 0.03)},${f(-P.bodyH * 0.09)} ${f(-P.drawL * 0.065)},${f(-P.bodyH * 0.02)} l${f(2)},${f(P.bodyH * 0.07)} Z" fill="#0d1218" stroke="rgba(255,255,255,0.3)"/>`);
        break;
      case "sidepipe":   // side pipes, which only a handful of cars really have
        for (let i = 0; i < 6; i++) o.push(`<rect x="${f(x - i * 13)}" y="${f(P.sillY - 4)}" width="10" height="7" rx="3" fill="#b8bfc7" stroke="#6d757d"/>`);
        break;
      case "fuelcap":
        o.push(`<circle cx="${f(x)}" cy="${f(y)}" r="6.5" fill="#c9d2dc" stroke="#6d757d" stroke-width="1.4"/>`);
        break;
      case "chargeport":
        o.push(`<rect x="${f(x - 9)}" y="${f(y - 6)}" width="18" height="12" rx="4" fill="#0e131a" stroke="${acc}" stroke-width="1.4"/>`);
        break;
      case "coveredRear": // a Speedtail / record car: the rear wheel is faired over
        o.push(`<path d="M${f(P.axRear + P.rR * 1.25)},${f(P.sillY)} a${f(P.rR * 1.25)},${f(P.rR * 1.1)} 0 0 0 ${f(-P.rR * 2.5)},0 Z" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.35)"/>`);
        break;
      case "fin":        // a dorsal fin down the engine cover — a Valkyrie, an AMG One, a T.50s
        o.push(`<path d="M${f(x)},${f(y)} L${f(P.xAt(0.97))},${f(y + P.bodyH * 0.06)} L${f(P.xAt(0.97))},${f(y + P.bodyH * 0.22)} L${f(x)},${f(y + P.bodyH * 0.16)} Z" fill="${spec.paint[1]}" opacity="0.95" stroke="rgba(255,255,255,0.3)"/>`);
        break;
      case "tunnel":     // the Evija's venturi tunnel, straight through the rear haunch
        o.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(P.drawL * 0.05)}" ry="${f(P.bodyH * 0.13)}" fill="#05070a" stroke="${acc}" stroke-width="2"/>`);
        o.push(`<ellipse cx="${f(x - 6)}" cy="${f(y)}" rx="${f(P.drawL * 0.032)}" ry="${f(P.bodyH * 0.085)}" fill="#0e141b"/>`);
        break;
      case "fan":        // the T.50s's 400 mm ground-effect fan, in a shroud on the tail panel
        o.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(P.bodyH * 0.20)}" fill="#0a0e13" stroke="#98a4b0" stroke-width="2.4"/>`);
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          o.push(`<path d="M${f(x)},${f(y)} L${f(x + Math.cos(a) * P.bodyH * 0.19)},${f(y + Math.sin(a) * P.bodyH * 0.19)}" stroke="#5d6771" stroke-width="2.6"/>`);
        }
        break;
      case "topexit":    // the 918's two pipes, which leave through the TOP of the engine cover
        o.push(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="9" ry="5" fill="#b8bfc7" stroke="#5d666f" stroke-width="1.4"/>`);
        o.push(`<ellipse cx="${f(x - 22)}" cy="${f(y + 2)}" rx="9" ry="5" fill="#b8bfc7" stroke="#5d666f" stroke-width="1.4"/>`);
        break;
      case "airbox":     // a roof-mounted ram intake feeding an engine behind the driver
        o.push(`<path d="M${f(x)},${f(y)} q${f(-P.drawL * 0.02)},${f(-P.bodyH * 0.13)} ${f(-P.drawL * 0.055)},${f(-P.bodyH * 0.10)} l${f(-P.drawL * 0.03)},${f(P.bodyH * 0.09)} Z" fill="${spec.paint[1]}" stroke="rgba(255,255,255,0.35)"/>`);
        o.push(`<ellipse cx="${f(x - P.drawL * 0.052)}" cy="${f(y - P.bodyH * 0.055)}" rx="5" ry="${f(P.bodyH * 0.05)}" fill="#05080c"/>`);
        break;
      case "rollhoop":   // the twin humps behind a roadster's seats
        o.push(`<path d="M${f(x)},${f(y)} a${f(P.drawL * 0.022)},${f(P.bodyH * 0.09)} 0 0 1 ${f(P.drawL * 0.044)},0 Z" fill="${spec.paint[1]}" stroke="rgba(255,255,255,0.32)"/>`);
        o.push(`<path d="M${f(x - P.drawL * 0.05)},${f(y)} a${f(P.drawL * 0.022)},${f(P.bodyH * 0.09)} 0 0 1 ${f(P.drawL * 0.044)},0 Z" fill="${spec.paint[2]}" stroke="rgba(255,255,255,0.22)"/>`);
        break;
      case "sideNumber":  // a competition roundel
        o.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(P.bodyH * 0.16)}" fill="#f4f7fa" stroke="#2a3037" stroke-width="1.6"/>`);
        o.push(`<text x="${f(x)}" y="${f(y + P.bodyH * 0.055)}" text-anchor="middle" font-family="ui-serif,Georgia" font-size="${f(P.bodyH * 0.19)}" fill="#1a1f26">${spec.raceNo || ""}</text>`);
        break;
      case "stripe":      // a livery stripe along the flank
        o.push(`<path d="M${f(P.xAt(0.98))},${f(y)} L${f(P.xAt(0.02))},${f(y - 4)} l0,${f(P.bodyH * 0.09)} L${f(P.xAt(0.98))},${f(y + P.bodyH * 0.09)} Z" fill="${spec.stripeCol || acc}" opacity="0.9"/>`);
        break;
      default: break;
    }
  }
  return o.join("\n      ");
}

/* ------------------------------------------------------------------ *
 * livery                                                             *
 * ------------------------------------------------------------------ */

/* Thirteen mid-engined two-seaters of near-identical dimensions will always share a silhouette —
   a Chiron, a Nevera and a Tuatara really are the same box in life. What tells them apart at a
   glance is the LIVERY, and every one of these was drawn in one flat colour top to bottom. These
   are the real launch schemes: the 300+ record car is black with its orange stripes, the Evija
   wears its exposed-carbon lower half, the 917K its Gulf hoops. */
export function livery(spec, P, ID, acc) {
  const L = spec.livery;
  if (!L) return "";
  const o = [];
  const y = (t) => P.roofY + t * (P.sillY - P.roofY);
  if (L.kind === "stripes") {
    // a pair of longitudinal stripes over the spine, as on the Chiron 300+ and the Ford GT
    const w = L.w || 9, gap = L.gap || 7;
    for (const off of [-gap, gap]) {
      const d = spec.roof.map(([xf, yf], i) =>
        `${i ? "L" : "M"}${f(P.xAt(xf))},${f(P.yAt(yf) + off + 26)}`).join(" ");
      o.push(`<path d="${d}" fill="none" stroke="${L.col}" stroke-width="${w}" opacity="0.95"/>`);
    }
  } else if (L.kind === "lower") {
    // the lower half in a second material — exposed carbon on the Evija, black on the Valkyrie
    o.push(`<rect x="0" y="${f(y(L.at || 0.55))}" width="1000" height="${f(P.bodyH)}" fill="${L.col}" opacity="${L.op || 0.9}"/>`);
    o.push(`<path d="M0,${f(y(L.at || 0.55))} L1000,${f(y((L.at || 0.55) - 0.03))}" stroke="${acc}" stroke-width="1.6" opacity="0.7"/>`);
  } else if (L.kind === "upper") {
    // a contrasting roof and screen surround, the way a two-tone GT is painted
    o.push(`<rect x="0" y="0" width="1000" height="${f(y(L.at || 0.34))}" fill="${L.col}" opacity="${L.op || 0.92}"/>`);
  } else if (L.kind === "hoops") {
    // Le Mans hoops: two transverse bands over the whole body, as on the Gulf 917
    for (const xf of L.at || [0.30, 0.62]) {
      o.push(`<path d="M${f(P.xAt(xf))},0 L${f(P.xAt(xf + 0.075))},0 L${f(P.xAt(xf + 0.075))},400 L${f(P.xAt(xf))},400 Z" fill="${L.col}" opacity="0.95"/>`);
    }
  } else if (L.kind === "split") {
    // a diagonal two-tone break, as on the Speedtail's tail and the Agera's split
    o.push(`<path d="M${f(P.xAt(L.at || 0.55))},0 L1000,0 L1000,400 L${f(P.xAt((L.at || 0.55) - 0.10))},400 Z" fill="${L.col}" opacity="${L.op || 0.9}"/>`);
  }
  return o.join("\n      ");
}
