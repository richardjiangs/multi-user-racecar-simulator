// render.mjs — turn one car's real dimensions into its side-profile SVG.
import { FRAME, profile, bodyPath, wheel } from "./bodykit.mjs";
import { greenhouse, dloPath, frontEnd, rearEnd, rearSpoiler, sideKit } from "./detail.mjs";

const f1 = (n) => Number(n).toFixed(1);

export function renderCar(spec) {
  const ID = (n) => `bk${spec.key}${n}`;
  const P = profile(spec);
  const body = bodyPath(spec, P);
  const acc = spec.accent, body1 = spec.paint[0], body2 = spec.paint[1], body3 = spec.paint[2];
  const g = [];

  /* ---- defs: the paint, the glass, the hub, and a soft top highlight ---- */
  g.push(`<defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${body1}"/><stop offset="0.45" stop-color="${body2}"/><stop offset="1" stop-color="${body3}"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b8cfe2" stop-opacity="0.9"/><stop offset="0.5" stop-color="#33495c" stop-opacity="0.92"/><stop offset="1" stop-color="#0a1219"/>
        </linearGradient>
        <linearGradient id="${ID("Low")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2026"/><stop offset="1" stop-color="#07090c"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eef2f6"/><stop offset="1" stop-color="#2b3138"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${body}"/></clipPath>
        ${spec.glass && !spec.glass.none ? `<clipPath id="${ID("Dlo")}"><path d="${dloPath(spec, P, spec.glass)}"/></clipPath>` : ""}
        <style>
          .wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.14));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(${spec.doorSwing || -13}deg) translate(-11px,-4px);}
          #quadExhaustArt *{fill:#a7aeb6;}
          #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}
        </style>
      </defs>`);

  /* ---- ground shadow, tight under the car ---- */
  g.push(`<ellipse cx="${f1((FRAME.x0 + FRAME.x1) / 2)}" cy="${f1(FRAME.ground + 6)}" rx="${f1(P.drawL * 0.47)}" ry="9" fill="rgba(0,0,0,0.55)"/>`);

  /* ---- a fixed wing, if the car has one, BEHIND the body so the pylons read ---- */
  if (spec.wing) {
    const wx = P.xAt(spec.wing.x), wy = P.yAt(spec.wing.y), ww = spec.wing.w * P.drawL, pylon = spec.wing.pylon !== false;
    g.push(`<g id="rearWingArt">
        ${pylon ? `<rect x="${f1(wx - ww * 0.34)}" y="${f1(wy)}" width="7" height="${f1(spec.wing.drop * P.bodyH)}" fill="#141920" stroke="#4a525b"/>
        <rect x="${f1(wx + ww * 0.28)}" y="${f1(wy)}" width="7" height="${f1(spec.wing.drop * P.bodyH)}" fill="#141920" stroke="#4a525b"/>` : ""}
        <path d="M${f1(wx - ww / 2)},${f1(wy + 5)} L${f1(wx + ww / 2)},${f1(wy)} L${f1(wx + ww / 2)},${f1(wy + 9)} L${f1(wx - ww / 2)},${f1(wy + 14)} Z" fill="#141920" stroke="#5b636d" stroke-width="1.2"/>
        <path d="M${f1(wx - ww / 2)},${f1(wy + 5)} L${f1(wx + ww / 2)},${f1(wy)}" stroke="${acc}" stroke-width="2" opacity="0.75"/>
      </g>`);
  }

  /* ---- THE BODY ---- */
  g.push(`<g id="bcBody">`);
  g.push(`  <path d="${body}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.42)" stroke-width="1.1"/>`);
  // the highlight that makes paint look like paint: a soft band under the shoulder
  g.push(`  <g clip-path="url(#${ID("Clip")})">
        <path d="M${f1(FRAME.x0)},${f1(P.yAt(0.30))} Q${f1((FRAME.x0 + FRAME.x1) / 2)},${f1(P.yAt(0.18))} ${f1(FRAME.x1)},${f1(P.yAt(0.30))} L${f1(FRAME.x1)},${f1(P.yAt(0.40))} Q${f1((FRAME.x0 + FRAME.x1) / 2)},${f1(P.yAt(0.28))} ${f1(FRAME.x0)},${f1(P.yAt(0.42))} Z" fill="url(#${ID("Shine")})"/>
        <rect x="0" y="${f1(P.sillY - P.bodyH * 0.06)}" width="1000" height="${f1(P.bodyH)}" fill="rgba(0,0,0,0.16)"/>
      </g>`);

  // the arch mouths, drawn as dark lips so the wheel sits INSIDE the body
  const lip = (cx, r) => `  <path d="M${f1(cx - r * 1.06)},${f1(P.sillY)} A${f1(r * 1.06)},${f1(r)} 0 0 1 ${f1(cx + r * 1.06)},${f1(P.sillY)}" fill="none" stroke="rgba(0,0,0,0.55)" stroke-width="4"/>
  <path d="M${f1(cx - r * 1.06)},${f1(P.sillY)} A${f1(r * 1.06)},${f1(r)} 0 0 1 ${f1(cx + r * 1.06)},${f1(P.sillY)}" fill="none" stroke="${acc}" stroke-width="1.4" opacity="0.45"/>`;
  g.push(lip(P.axRear, P.rR * (spec.archLift || 1.06)));
  g.push(lip(P.axFront, P.rF * (spec.archLift || 1.06)));

  g.push(`  <g clip-path="url(#${ID("Clip")})">`);   // details belong to the body, not to the air

  // the shoulder crease that runs the length of the car
  if (spec.crease !== false) {
    const cy = P.yAt(spec.creaseY != null ? spec.creaseY : 0.42);
    g.push(`  <path d="M${f1(FRAME.x0 + 14)},${f1(cy + 4)} Q${f1((FRAME.x0 + FRAME.x1) / 2)},${f1(cy - 3)} ${f1(FRAME.x1 - 20)},${f1(cy)}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2.2" stroke-linecap="round"/>`);
  }

  // the sill / rocker
  if (spec.sill !== false) {
    const y = P.sillY - P.bodyH * 0.02;
    g.push(`  <path d="M${f1(P.axRear + P.rR * 1.1)},${f1(y)} L${f1(P.axFront - P.rF * 1.1)},${f1(y - 2)} L${f1(P.axFront - P.rF * 1.15)},${f1(y + 12)} L${f1(P.axRear + P.rR * 1.15)},${f1(y + 14)} Z" fill="url(#${ID("Low")})" stroke="rgba(120,132,146,0.35)"/>`);
  }

  // the flank furniture that lies flat on the panel — ducts, blades, gills, strakes, stripes
  g.push("  " + sideKit(spec, P, ID, acc, "flat"));

  // door shut lines + the one that opens
  const doorFront = spec.doors ? spec.doors[0] : null;
  (spec.doors || []).forEach((xf) => {
    const x = P.xAt(xf);
    g.push(`  <path d="M${f1(x)},${f1(P.yAt(0.30))} L${f1(x - 3)},${f1(P.sillY - 6)}" stroke="rgba(0,0,0,0.34)" stroke-width="2"/>`);
  });
  if (doorFront != null) {
    const xa = P.xAt(doorFront), xb = P.xAt(spec.doors[1] != null ? spec.doors[1] : doorFront + 0.16);
    g.push(`  <g id="doorArt">
        <path d="M${f1(xb)},${f1(P.yAt(0.34))} L${f1(xa)},${f1(P.yAt(0.32))} L${f1(xa - 4)},${f1(P.sillY - 10)} L${f1(xb - 2)},${f1(P.sillY - 8)} Z" fill="rgba(255,255,255,0.028)" stroke="rgba(0,0,0,0.3)" stroke-width="1.3"/>
        <rect x="${f1((xa + xb) / 2 - 12)}" y="${f1(P.yAt(0.50))}" width="24" height="5" rx="2.5" fill="#3c434b"/>
      </g>`);
  }

  // THE GLASSHOUSE — a screen, side glass, a backlight, a surround and real pillars
  g.push("  " + greenhouse(spec, P, ID, acc));

  // the nose: grille, intake, lamp, bumper, bonnet shutline
  g.push("  " + frontEnd(spec, P, ID, acc));
  // the tail: lamps, engine vent, diffuser, ducktail
  g.push("  " + rearEnd(spec, P, ID, acc));

  // the badge / name on the flank
  if (spec.badge) {
    g.push(`  <text x="${f1(P.xAt(spec.badgeX != null ? spec.badgeX : 0.5))}" y="${f1(P.yAt(0.56))}" text-anchor="middle" font-family="ui-sans-serif" font-size="11" fill="rgba(255,255,255,0.72)" letter-spacing="4">${spec.badge}</text>`);
  }
  if (spec.extra) g.push("  " + spec.extra(P, f1));
  g.push(`  </g>`);                                   // end of the clipped bodywork
  // furniture that stands PROUD of the panel — a fin, a roof airbox, roll hoops, the T.50s fan,
  // the Speedtail's faired rear wheel — would be cut in half by that clip, so it goes on top
  g.push("  " + sideKit(spec, P, ID, acc, "proud"));
  g.push("  " + rearSpoiler(spec, P, acc));
  // the splitter and the pipes are hardware bolted to the car, so they sit outside the paint
  g.push(`  <g id="frontFlapArt"><rect x="${f1(FRAME.x1 - P.drawL * 0.105)}" y="${f1(P.sillY + 6)}" width="${f1(P.drawL * 0.085)}" height="6" rx="3" fill="#101318" stroke="${acc}" stroke-opacity="0.5"/></g>`);
  {
    const ex = spec.exhaust || { kind: "twin", n: 2 };
    // anchored to the tail panel, not to the frame edge — a pipe that floats past the bumper is
    // the tell that a detail was placed in page coordinates instead of on the car
    const exY = P.sillY + 8, ex0 = P.xAt(0.985) + 6;
    let exs = "";
    if (ex.kind === "quad" || ex.kind === "twin" || ex.kind === "single") {
      const n = ex.n || (ex.kind === "quad" ? 4 : ex.kind === "twin" ? 2 : 1);
      for (let i = 0; i < n; i++) exs += `<circle cx="${f1(ex0 + i * 15 + (i >= 2 ? 8 : 0))}" cy="${f1(exY)}" r="6"/>`;
    } else if (ex.kind === "side") {
      for (let i = 0; i < (ex.n || 6); i++) exs += `<rect x="${f1(P.axRear + P.rR * 1.25 + i * 13)}" y="${f1(exY - 6)}" width="9" height="7" rx="2"/>`;
    } else if (ex.kind === "stack") {
      exs += `<rect x="${f1(ex0)}" y="${f1(exY - 10)}" width="30" height="9" rx="4"/><rect x="${f1(ex0)}" y="${f1(exY + 2)}" width="30" height="9" rx="4"/>`;
    }
    g.push(`  <g id="quadExhaustArt">${exs}</g>`);
  }
  // the mirror sits on its stalk at the BASE of the A-pillar, at the beltline — up by the roof
  // it read as a black flag flying off the cabin, which is not where a door mirror lives
  if (spec.mirror !== false && spec.glass && !spec.glass.none) {
    const mx = P.xAt(spec.glass.cowl) + 6, my = P.yAt(spec.glass.base) + 2;
    g.push(`  <path d="M${f1(mx)},${f1(my)} l7,-2 l13,-4 l1,10 l-19,3 Z" fill="#0b0e12" stroke="rgba(255,255,255,0.22)" stroke-width="0.9"/>`);
  }

  g.push(`</g>`);

  /* ---- the wheels, drawn last so they sit in the arch mouths ---- */
  g.push(wheel(P.axRear, P.cyR, P.rR, spec.rimRear || spec.rim || "five", spec.rimCol || acc, ID("Hub")));
  g.push(wheel(P.axFront, P.cyF, P.rF, spec.rim || "five", spec.rimCol || acc, ID("Hub")));

  return `<svg viewBox="0 0 ${FRAME.w} ${FRAME.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${spec.name} side">
      ${g.join("\n      ")}
    </svg>`;
}
