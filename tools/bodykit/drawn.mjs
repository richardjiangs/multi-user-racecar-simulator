// drawn.mjs — bodies drawn BY HAND, car by car, from that car's own side elevation.
//
// The generator gave every body correct proportions and a family resemblance it could not shed:
// one outline routine, one arch routine, one furniture set, tuned twenty-six ways. Four rounds of
// fixing it produced four new artefacts, and the measurement built to prove it clean turned out to
// flag the hand-drawn cars too. A parametric model that keeps producing faults nobody can measure
// is exactly where hand drawing wins.
//
// So these are drawings. Each is written against that car's real side view in the shared frame
// (1000 x 400, x runs REAR -> FRONT, ground at y = 330), with its own outline, its own shut lines,
// its own lamps. Nothing here is derived from anything else here.
//
// The frame, the wheel helper and the animated ids (bcBody, doorArt, quadExhaustArt, frontFlapArt,
// rearWingArt) are shared with the generator so a hand-drawn car drops straight into the sim.

import { FRAME, wheel } from "./bodykit.mjs";

/* ------------------------------------------------------------------ *
 * Chevrolet Corvette ZR1 (C8, LT7)                                    *
 *                                                                     *
 * 4,630 mm long, 2,723 mm wheelbase, 1,234 mm tall, 880/1,027 mm       *
 * overhangs. In side view the C8 is unmistakable for three reasons and *
 * they are all drawn here: the cabin is pushed a long way FORWARD, so  *
 * the windscreen base sits almost over the front axle and the deck     *
 * behind the roof is nearly half the car; the flank is dominated by    *
 * one deep intake ahead of the rear wheel feeding the flat-plane V8;   *
 * and a flying buttress runs from the roof down onto the deck with the *
 * engine glass let into the middle of it.                              *
 * ------------------------------------------------------------------ */
export function drawZr1(spec) {
  const ID = (n) => `hd${spec.key || "zr1"}${n}`;
  const axF = 762, axR = 265, rF = 61, rR = 64, G = FRAME.ground;

  /* The outline, once, as one closed path. Tail panel down, rear valance, up over the rear
     wheel, the tucked sill, up over the front wheel, the splitter, the nose face — then the
     whole top edge back to the tail. The arches are tall ellipses that pass OVER each tyre,
     and the body at each axle is drawn above its own arch, which is what a haunch is. */
  const BODY = `M78,186
    L78,248 Q79,268 97,273 L152,277 L196,300
    A70,104 0 0 1 336,300
    Q516,309 694,300
    A67,106 0 0 1 828,300
    L892,295 Q916,291 922,270 L922,250
    C900,240 880,232 830,217
    C800,208 782,201 762,194
    C730,192 712,195 700,198
    C672,184 640,160 610,142
    C596,134 586,129 575,127
    C550,123 535,122 520,123
    C500,125 484,128 470,133
    C450,142 434,148 420,153
    C400,161 384,166 370,169
    C340,172 312,172 300,172
    C288,171 276,170 265,170
    C220,172 140,178 78,186 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Chevrolet Corvette ZR1 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe063"/><stop offset="0.34" stop-color="#f5b312"/><stop offset="0.78" stop-color="#c07d00"/><stop offset="1" stop-color="#6d4a00"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d6e8f7"/><stop offset="0.38" stop-color="#4a6478"/><stop offset="1" stop-color="#0a1017"/>
        </linearGradient>
        <linearGradient id="${ID("Vent")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#05070a"/></linearGradient>
        <linearGradient id="${ID("Low")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#23272d"/><stop offset="1" stop-color="#06080a"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eef2f6"/><stop offset="1" stop-color="#2b3138"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>
          .wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.14));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-11deg) translate(-10px,-5px);}
          #quadExhaustArt *{fill:#a7aeb6;}
          #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}
        </style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="386" ry="9" fill="rgba(0,0,0,0.5)"/>

      <!-- the ZR1's high wing, on two end plates, behind the body so the plates read -->
      <g id="rearWingArt">
        <rect x="112" y="132" width="7" height="44" fill="#141920" stroke="#4a525b"/>
        <rect x="226" y="130" width="7" height="44" fill="#141920" stroke="#4a525b"/>
        <path d="M96,134 L250,126 L250,137 L96,145 Z" fill="#15191f" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M96,134 L250,126" stroke="#ffd23a" stroke-width="2" opacity="0.75"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <!-- paint, not a fill: a soft band under the shoulder and a darkened lower body -->
          <path d="M78,196 C300,180 560,178 922,258 L922,276 C560,196 300,198 78,214 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="252" width="1000" height="120" fill="rgba(0,0,0,0.16)"/>

          <!-- the flying buttress: roof down onto the deck, with the engine glass let into it -->
          <path d="M470,133 L455,158 L392,176 L420,153 Z" fill="#191e25" stroke="rgba(255,255,255,0.22)"/>
          <path d="M300,174 L392,158 L448,166 L352,186 Z" fill="rgba(126,158,184,0.34)" stroke="rgba(214,232,246,0.45)"/>
          <g stroke="rgba(0,0,0,0.5)" stroke-width="2.4" stroke-linecap="round">
            <path d="M322,176 L392,163"/><path d="M334,180 L404,167"/><path d="M346,184 L416,171"/>
          </g>

          <!-- THE DAYLIGHT OPENING: a fast screen, a short side window, a hard C-pillar -->
          <path d="M706,200 C670,182 630,155 596,138 L580,130
                   C548,125 505,125 478,133 L455,158
                   C520,170 620,186 706,200 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa3b3" stroke-width="1.4"/>
          <path d="M700,198 C666,180 628,153 592,136" stroke="#0d1116" stroke-width="7" stroke-linecap="round"/>
          <path d="M478,133 L455,158" stroke="#0d1116" stroke-width="8" stroke-linecap="round"/>
          <path d="M690,196 C660,180 626,156 596,140" stroke="rgba(255,255,255,0.30)" stroke-width="3"/>

          <!-- THE SIDE INTAKE. On a C8 this is the flank: a deep scoop ahead of the rear arch. -->
          <path d="M492,186 C452,184 420,196 396,216 L402,246 C428,222 460,212 492,212 Z" fill="#05070a"/>
          <path d="M492,186 C452,184 420,196 396,216" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2.4"/>
          <path d="M486,208 C456,208 432,216 410,234" fill="none" stroke="#ffd23a" stroke-width="1.6" opacity="0.6"/>

          <!-- the door, its shut lines and the flush handle -->
          <g id="doorArt">
            <path d="M498,182 L700,206 L696,286 L500,272 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.32)" stroke-width="1.4"/>
            <rect x="596" y="222" width="28" height="7" rx="3.5" fill="#4d545c"/>
          </g>
          <path d="M498,180 L500,272" stroke="rgba(0,0,0,0.34)" stroke-width="2"/>
          <path d="M700,204 L696,286" stroke="rgba(0,0,0,0.34)" stroke-width="2"/>

          <!-- the shoulder crease, and the gill behind the front arch -->
          <path d="M180,196 C420,186 640,206 892,262" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="2.2" stroke-linecap="round"/>
          <g stroke="rgba(0,0,0,0.55)" stroke-width="3" stroke-linecap="round">
            <path d="M742,238 l-28,6"/><path d="M734,247 l-28,6"/><path d="M726,256 l-28,6"/>
          </g>

          <!-- the rocker skirt -->
          <path d="M338,296 L690,300 L686,312 L342,308 Z" fill="url(#${ID("Low")})" stroke="rgba(120,132,146,0.32)"/>

          <!-- lamps: the C8's thin wrapped headlamp, and the squared tail cluster -->
          <path d="M896,252 L852,240 L850,253 L894,265 Z" fill="#e2edf6" stroke="#93a1ad" stroke-width="1.1"/>
          <path d="M893,247 L856,236" stroke="#ffd23a" stroke-width="2.2" stroke-linecap="round"/>
          <rect x="84" y="200" width="36" height="10" rx="2.5" fill="#e0223c"/>
          <rect x="84" y="214" width="24" height="7" rx="2" fill="#8c1220"/>

          <text x="600" y="258" text-anchor="middle" font-family="ui-sans-serif" font-size="11" fill="rgba(255,255,255,0.72)" letter-spacing="4">ZR1</text>
        </g>
      </g>

      <!-- hardware bolted to the car, outside the paint: splitter, diffuser, quad centre pipes -->
      <g id="frontFlapArt"><rect x="836" y="296" width="82" height="6" rx="3" fill="#101318" stroke="#ffd23a" stroke-opacity="0.5"/></g>
      <path d="M84,272 L178,278 L174,300 L88,294 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(170,186,200,0.38)" stroke-width="1.4"><path d="M110,294 L108,302"/><path d="M134,296 L132,303"/><path d="M158,297 L156,305"/></g>
      <g id="quadExhaustArt"><circle cx="102" cy="286" r="5.5"/><circle cx="118" cy="287" r="5.5"/><circle cx="142" cy="288" r="5.5"/><circle cx="158" cy="289" r="5.5"/></g>

      ${wheel(axR, G - rR, rR, "split", "#ffd23a", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "split", "#ffd23a", ID("Hub"))}
    </svg>`;
}

export const DRAWN = { zr1: drawZr1 };
