// raid.mjs — a T1+ Ultimate Dakar car, which is not a road car on big tyres.
//
// It is a spaceframe with panels hung on it, sitting 400 mm off the ground on 37-inch
// BFGoodrich tyres, with 350 mm of suspension travel at each corner, a roof scoop, a light
// bar, two spare wheels bolted to the back and a sump guard the length of the car.
//
// FIA T1+ Ultimate: ~2,300 mm wide, ~1,900 mm tall, wheelbase ~3,000 mm, 37x12.5R17 tyres.
import { FRAME, wheel } from "./bodykit.mjs";

const f = (n) => Number(n).toFixed(1);

export function renderRaid(spec) {
  const ID = (n) => `rd${spec.key}${n}`;
  const L = 4400, FOH = 800, ROH = 600;
  const drawL = FRAME.x1 - FRAME.x0, k = drawL / L;
  const g0 = FRAME.ground + 22;                       // it sits high, so drop the ground line
  const r = (940 / 2) * k;                            // 37-inch tyre
  const axF = FRAME.x1 - FOH * k, axR = FRAME.x0 + ROH * k;
  const X = (mm) => FRAME.x1 - mm * k;
  const Y = (mm) => g0 - mm * k;
  const body = spec.body, trim = spec.trim;
  const o = [];

  o.push(`<defs>
        <linearGradient id="${ID("Body")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${trim}"/><stop offset="0.45" stop-color="${body}"/><stop offset="1" stop-color="#0c1016"/></linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9cede"/><stop offset="1" stop-color="#131b22"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#e8edf3"/><stop offset="1" stop-color="#2b3138"/></radialGradient>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.05));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-16deg) translate(-12px,-4px);}
        </style>
      </defs>`);
  o.push(`<ellipse cx="${f((FRAME.x0 + FRAME.x1) / 2)}" cy="${f(g0 + 6)}" rx="${f(drawL * 0.44)}" ry="9" fill="rgba(0,0,0,0.5)"/>`);

  /* ---- long-travel suspension: the wishbones and the twin dampers are the whole point ---- */
  const damper = (cx) => `  <path d="M${f(cx - 10)},${f(Y(1250))} L${f(cx - 26)},${f(g0 - r)}" stroke="#8e979f" stroke-width="7" stroke-linecap="round"/>
  <path d="M${f(cx + 12)},${f(Y(1250))} L${f(cx - 6)},${f(g0 - r)}" stroke="#c8a24a" stroke-width="7" stroke-linecap="round"/>
  <path d="M${f(cx - 60)},${f(Y(520))} L${f(cx)},${f(g0 - r)}" stroke="#20262e" stroke-width="8" stroke-linecap="round"/>
  <path d="M${f(cx + 60)},${f(Y(520))} L${f(cx)},${f(g0 - r)}" stroke="#20262e" stroke-width="8" stroke-linecap="round"/>`;
  o.push(damper(axF));
  o.push(damper(axR));

  o.push(`<g id="bcBody">`);
  /* ---- the sump guard: a flat plate the length of the car, 400 mm up ---- */
  o.push(`  <path d="M${f(X(700))},${f(Y(400))} L${f(X(3700))},${f(Y(400))} L${f(X(3760))},${f(Y(470))} L${f(X(660))},${f(Y(470))} Z" fill="#2a3038" stroke="#6b757f" stroke-width="1.2"/>`);

  /* ---- the body: a flat-sided box, wheelarch tubs cut out of it, tall and square ---- */
  o.push(`  <path d="M${f(X(500))},${f(Y(700))}
      L${f(X(1150))},${f(Y(760))} L${f(X(1500))},${f(Y(1180))} L${f(X(2050))},${f(Y(1250))}
      L${f(X(3050))},${f(Y(1250))} L${f(X(3350))},${f(Y(1000))} L${f(X(3850))},${f(Y(940))}
      L${f(X(3950))},${f(Y(700))} L${f(X(3900))},${f(Y(470))} L${f(X(560))},${f(Y(470))} Z"
      fill="url(#${ID("Body")})" stroke="rgba(255,255,255,0.45)" stroke-width="1.2"/>`);

  /* ---- the cage: you can see it through the cut-out sides ---- */
  o.push(`  <g stroke="#c9d2dc" stroke-width="4" fill="none" opacity="0.9">
      <path d="M${f(X(2050))},${f(Y(1250))} L${f(X(1520))},${f(Y(1180))} L${f(X(1480))},${f(Y(560))}"/>
      <path d="M${f(X(3050))},${f(Y(1250))} L${f(X(3340))},${f(Y(1010))} L${f(X(3380))},${f(Y(560))}"/>
      <path d="M${f(X(2050))},${f(Y(1250))} L${f(X(3050))},${f(Y(1250))}"/>
      <path d="M${f(X(1480))},${f(Y(880))} L${f(X(3380))},${f(Y(880))}"/>
    </g>`);

  /* ---- the glass: a single flat screen and a side window in a door ---- */
  o.push(`  <path d="M${f(X(3050))},${f(Y(1230))} L${f(X(3330))},${f(Y(1010))} L${f(X(3360))},${f(Y(760))} L${f(X(3060))},${f(Y(780))} Z" fill="url(#${ID("Glass")})" stroke="#7b8792"/>`);
  o.push(`  <g id="doorArt">
      <path d="M${f(X(2100))},${f(Y(1180))} L${f(X(3000))},${f(Y(1180))} L${f(X(3020))},${f(Y(560))} L${f(X(2120))},${f(Y(560))} Z" fill="rgba(255,255,255,0.05)" stroke="rgba(0,0,0,0.35)" stroke-width="1.3"/>
      <path d="M${f(X(2180))},${f(Y(1140))} L${f(X(2900))},${f(Y(1140))} L${f(X(2910))},${f(Y(900))} L${f(X(2190))},${f(Y(900))} Z" fill="#0a0f14" stroke="#59636d"/>
      <text x="${f(X(2550))}" y="${f(Y(700))}" text-anchor="middle" font-family="ui-sans-serif" font-size="17" font-weight="800" fill="${trim}">${spec.number}</text>
    </g>`);

  /* ---- roof: the air scoop, the light bar and the aerial whips ---- */
  o.push(`  <path d="M${f(X(2200))},${f(Y(1250))} l0,-46 l${f(-260 * k)},0 l0,46 Z" fill="#161c24" stroke="${trim}" stroke-width="1.4"/>`);
  o.push(`  <g id="rearWingArt"><rect x="${f(X(3060))}" y="${f(Y(1330))}" width="${f(640 * k)}" height="9" rx="3" fill="#12171e" stroke="#59636d"/>
      <g fill="#ffe9a8">${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${f(X(3020 - i * 110))}" cy="${f(Y(1326))}" r="4.5"/>`).join("")}</g></g>`);
  o.push(`  <path d="M${f(X(1560))},${f(Y(1180))} l6,-${f(320 * k)}" stroke="#9aa3ad" stroke-width="2"/>
  <path d="M${f(X(1660))},${f(Y(1170))} l6,-${f(280 * k)}" stroke="#9aa3ad" stroke-width="2"/>`);

  /* ---- the two spare wheels bolted across the back ---- */
  o.push(`  <circle cx="${f(X(760))}" cy="${f(Y(860))}" r="${f(r * 0.62)}" fill="#0a0b0e" stroke="#1b1f25" stroke-width="7"/>
  <circle cx="${f(X(760))}" cy="${f(Y(860))}" r="${f(r * 0.30)}" fill="#20262e"/>`);

  /* ---- lamps, splitter, mudflaps ---- */
  o.push(`  <rect x="${f(X(3980))}" y="${f(Y(760))}" width="${f(180 * k)}" height="${f(120 * k)}" rx="4" fill="#f2f6fa" opacity="0.92"/>`);
  o.push(`  <rect x="${f(X(560))}" y="${f(Y(760))}" width="${f(120 * k)}" height="${f(90 * k)}" rx="3" fill="rgba(200,20,40,0.85)"/>`);
  o.push(`  <g id="frontFlapArt"><rect x="${f(X(4050))}" y="${f(Y(430))}" width="${f(260 * k)}" height="7" rx="3" fill="#171d24" stroke="${trim}" stroke-opacity="0.6"/></g>`);
  o.push(`  <path d="M${f(axR - r * 1.05)},${f(g0 - 6)} l-16,0 l0,-${f(220 * k)} l16,0 Z" fill="#12171e"/>`);
  o.push(`  <text x="${f(X(2550))}" y="${f(Y(520))}" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(255,255,255,0.72)" letter-spacing="4">${spec.badge}</text>`);
  o.push(`</g>`);

  /* ---- and the exhaust, which exits high out of the side ---- */
  o.push(`<g id="quadExhaustArt"><rect x="${f(X(1500))}" y="${f(Y(620))}" width="26" height="10" rx="5"/></g>`);

  o.push(wheel(axR, g0 - r, r, "seven", trim, ID("Hub")));
  o.push(wheel(axF, g0 - r, r, "seven", trim, ID("Hub")));

  return `<svg viewBox="0 0 ${FRAME.w} ${FRAME.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${spec.name} side">
      ${o.join("\n      ")}
    </svg>`;
}
