// openwheel.mjs — a 2026 Formula 1 car, which is not a road car with the roof cut off.
//
// The old drawing was a plank with two wheels and a bubble on it: no floor, no sidepod, no
// halo, no suspension, no wing elements. An F1 car in side view is almost entirely those
// things — the tub you can actually see is a small part of it.
//
// 2026 regulations: 5,400 mm maximum length on a 3,400 mm wheelbase, 970 mm tall to the top of
// the airbox, 18-inch wheels (front tyre 720 mm, rear 725 mm), active front and rear wings.
import { FRAME, wheel } from "./bodykit.mjs";

const f = (n) => Number(n).toFixed(1);

export function renderF1(spec) {
  const ID = (n) => `f1${spec.key}${n}`;
  const L = 5400, WB = 3400, FOH = 1050, ROH = 950;
  const drawL = FRAME.x1 - FRAME.x0, k = drawL / L;
  const g0 = FRAME.ground;
  const rF = (720 / 2) * k, rR = (725 / 2) * k;
  const axF = FRAME.x1 - FOH * k, axR = FRAME.x0 + ROH * k;
  const H = 970 * k, top = g0 - H;
  const X = (mmFromFront) => FRAME.x1 - mmFromFront * k;
  const Y = (mmFromGround) => g0 - mmFromGround * k;
  const body = spec.body, trim = spec.trim, dark = spec.dark || "#0d1116";
  const o = [];

  o.push(`<defs>
        <linearGradient id="${ID("Body")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${trim}"/><stop offset="0.4" stop-color="${body}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
        <linearGradient id="${ID("Floor")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f26"/><stop offset="1" stop-color="#07090c"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eef2f6"/><stop offset="1" stop-color="#2b3138"/></radialGradient>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.5));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
        </style>
      </defs>`);
  o.push(`<ellipse cx="${f((FRAME.x0 + FRAME.x1) / 2)}" cy="${f(g0 + 5)}" rx="${f(drawL * 0.46)}" ry="7" fill="rgba(0,0,0,0.5)"/>`);

  /* ---- the floor: the single biggest surface on the car, and the diffuser it ends in ---- */
  o.push(`<path d="M${f(X(600))},${f(Y(90))} L${f(X(3900))},${f(Y(60))} L${f(X(4900))},${f(Y(70))}
      L${f(X(5100))},${f(Y(330))} L${f(X(4600))},${f(Y(250))} L${f(X(1200))},${f(Y(170))} Z"
      fill="url(#${ID("Floor")})" stroke="rgba(150,166,182,0.35)" stroke-width="1.2"/>`);

  /* ---- front wing: four elements stepping up to the nose, on the ground ---- */
  o.push(`<g id="frontFlapArt">`);
  for (let i = 0; i < 4; i++) {
    const x = X(430 - i * 90), y = Y(60 + i * 55);
    o.push(`  <path d="M${f(x)},${f(y)} l${f(-105 * k * 4)},${f(-14)} l0,10 l${f(105 * k * 4)},14 Z" fill="${i % 2 ? trim : body}" stroke="rgba(0,0,0,0.4)" stroke-width="0.8"/>`);
  }
  o.push(`  <rect x="${f(X(560))}" y="${f(Y(70))}" width="7" height="${f(60 * k)}" fill="#0d1116"/>`);
  o.push(`</g>`);

  /* ---- nose and tub: a thin blade rising to the cockpit ---- */
  o.push(`<g id="bcBody">`);
  o.push(`  <path d="M${f(X(420))},${f(Y(230))}
      Q${f(X(900))},${f(Y(250))} ${f(X(1500))},${f(Y(330))}
      L${f(X(2100))},${f(Y(400))} L${f(X(2450))},${f(Y(430))}
      L${f(X(3500))},${f(Y(560))} L${f(X(4200))},${f(Y(520))} L${f(X(4750))},${f(Y(300))}
      L${f(X(4900))},${f(Y(150))} L${f(X(3900))},${f(Y(115))} L${f(X(1400))},${f(Y(180))} Z"
      fill="url(#${ID("Body")})" stroke="rgba(255,255,255,0.4)" stroke-width="1.1"/>`);

  /* ---- sidepod: the inlet, and the long undercut that runs back to the coke bottle ---- */
  o.push(`  <path d="M${f(X(2500))},${f(Y(300))} L${f(X(3600))},${f(Y(430))} L${f(X(4400))},${f(Y(330))}
      L${f(X(4500))},${f(Y(150))} L${f(X(2700))},${f(Y(170))} Z" fill="${body}" stroke="rgba(255,255,255,0.28)"/>`);
  o.push(`  <path d="M${f(X(2500))},${f(Y(300))} l-26,-6 l0,-90 l26,-6 Z" fill="#05080c" stroke="${trim}" stroke-width="1.4"/>`);
  o.push(`  <path d="M${f(X(2700))},${f(Y(180))} Q${f(X(3600))},${f(Y(150))} ${f(X(4400))},${f(Y(200))}" fill="none" stroke="${trim}" stroke-width="2.4" opacity="0.85"/>`);

  /* ---- the cockpit, the halo and the airbox ---- */
  o.push(`  <path d="M${f(X(2450))},${f(Y(430))} Q${f(X(2900))},${f(Y(520))} ${f(X(3450))},${f(Y(560))} L${f(X(3450))},${f(Y(470))} Q${f(X(2950))},${f(Y(440))} ${f(X(2500))},${f(Y(390))} Z" fill="#05080c"/>`);
  o.push(`  <path d="M${f(X(2500))},${f(Y(470))} Q${f(X(2600))},${f(Y(700))} ${f(X(3100))},${f(Y(720))} Q${f(X(3450))},${f(Y(710))} ${f(X(3480))},${f(Y(560))}" fill="none" stroke="#161c24" stroke-width="8" stroke-linecap="round"/>`);
  o.push(`  <path d="M${f(X(2500))},${f(Y(470))} Q${f(X(2600))},${f(Y(700))} ${f(X(3100))},${f(Y(720))} Q${f(X(3450))},${f(Y(710))} ${f(X(3480))},${f(Y(560))}" fill="none" stroke="${trim}" stroke-width="2.2" stroke-linecap="round"/>`);
  // the airbox above and behind the driver's head, and the engine cover falling from it
  o.push(`  <path d="M${f(X(3500))},${f(Y(560))} Q${f(X(3620))},${f(Y(830))} ${f(X(3820))},${f(Y(820))} L${f(X(4300))},${f(Y(560))} L${f(X(4400))},${f(Y(430))} L${f(X(3600))},${f(Y(470))} Z" fill="url(#${ID("Body")})" stroke="rgba(255,255,255,0.32)"/>`);
  // the shark fin
  o.push(`  <path d="M${f(X(3900))},${f(Y(760))} L${f(X(4900))},${f(Y(560))} L${f(X(4900))},${f(Y(430))} L${f(X(4100))},${f(Y(560))} Z" fill="${body}" opacity="0.92" stroke="rgba(255,255,255,0.22)"/>`);
  o.push(`  <text x="${f(X(3050))}" y="${f(Y(640))}" text-anchor="middle" font-family="ui-sans-serif" font-size="15" font-weight="800" fill="${trim}">${spec.number}</text>`);
  o.push(`</g>`);

  /* ---- suspension: wishbones you can actually see, front and rear ---- */
  const arm = (x1, y1, x2, y2, w) => `  <path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" stroke="#20262e" stroke-width="${w}" stroke-linecap="round"/>`;
  o.push(arm(X(1350), Y(230), axF, g0 - rF, 6));
  o.push(arm(X(1450), Y(140), axF, g0 - rF, 5));
  o.push(arm(X(4400), Y(430), axR, g0 - rR, 6));
  o.push(arm(X(4550), Y(200), axR, g0 - rR, 5));

  /* ---- rear wing: two elements on a swan neck, and the beam wing under it ---- */
  o.push(`<g id="rearWingArt">
      <rect x="${f(X(5150))}" y="${f(Y(680))}" width="8" height="${f(300 * k)}" fill="#12171e"/>
      <path d="M${f(X(5350))},${f(Y(900))} L${f(X(4950))},${f(Y(870))} L${f(X(4950))},${f(Y(830))} L${f(X(5350))},${f(Y(860))} Z" fill="${body}" stroke="rgba(255,255,255,0.4)"/>
      <path d="M${f(X(5350))},${f(Y(820))} L${f(X(4980))},${f(Y(790))} L${f(X(4980))},${f(Y(760))} L${f(X(5350))},${f(Y(790))} Z" fill="${trim}" stroke="rgba(0,0,0,0.35)"/>
      <path d="M${f(X(5280))},${f(Y(430))} L${f(X(4950))},${f(Y(410))} L${f(X(4950))},${f(Y(380))} L${f(X(5280))},${f(Y(400))} Z" fill="#171d25" stroke="${trim}" stroke-width="1"/>
    </g>`);

  /* ---- the wheels, with the 2026 covers over them ---- */
  o.push(wheel(axR, g0 - rR, rR, "dish", trim, ID("Hub")));
  o.push(wheel(axF, g0 - rF, rF, "dish", trim, ID("Hub")));
  o.push(`<g id="quadExhaustArt"><circle cx="${f(X(5120))}" cy="${f(Y(430))}" r="7"/></g>`);

  return `<svg viewBox="0 0 ${FRAME.w} ${FRAME.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${spec.name} side">
      ${o.join("\n      ")}
    </svg>`;
}
