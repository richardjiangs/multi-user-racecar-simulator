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

/* Only SIGNED-OFF drawings go in here. apply.mjs prefers whatever this map holds and falls back
   to the generator for everything else, so a car that has been drawn but not yet approved stays
   out of the garage until it is named on this line. */
export const DRAWN = { zr1: drawZr1, nevera: drawNevera, gto: drawGto, f40: drawF40, evija: drawEvija };

/* ------------------------------------------------------------------ *
 * Rimac Nevera                                                        *
 * 4,750 x 1,208 mm on a 2,745 mm wheelbase, 950/1,055 overhangs.       *
 * An EV, so no grille at all: the nose is one smooth surface falling   *
 * to a splitter. The flank carries Rimac's "tie" — a scoop that starts *
 * at the door and sweeps back into the rear haunch — and the tail is a *
 * full-width light bar over a very deep diffuser.                      *
 * ------------------------------------------------------------------ */
export function drawNevera(spec) {
  const ID = (n) => `hd${spec.key || "nevera"}${n}`;
  const axF = 753, axR = 265, rF = 62, rR = 64, G = FRAME.ground;
  const BODY = `M78,206
    L78,258 Q80,278 100,283 L156,286 L196,302
    A70,106 0 0 1 336,302
    Q510,310 686,302
    A68,108 0 0 1 822,302
    L886,296 Q914,292 922,272 L922,244
    C896,232 868,224 838,216
    C806,208 782,202 753,196
    C728,192 706,192 690,194
    C660,178 626,152 596,134
    C572,122 544,116 516,116
    C486,116 458,122 434,132
    C412,142 396,152 380,160
    C352,172 322,178 296,180
    C282,181 272,181 265,181
    C214,184 140,194 78,206 Z`;
  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Rimac Nevera side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6fd6e8"/><stop offset="0.36" stop-color="#1f8fb2"/><stop offset="0.8" stop-color="#0d4d66"/><stop offset="1" stop-color="#06222e"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8ecfa"/><stop offset="0.4" stop-color="#3f5b71"/><stop offset="1" stop-color="#080f16"/></linearGradient>
        <linearGradient id="${ID("Low")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f25"/><stop offset="1" stop-color="#05070a"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f4e3c8"/><stop offset="1" stop-color="#7a5326"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.44"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.4));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-24deg) translate(-8px,-14px);}
          #quadExhaustArt *{fill:#7fd8ff;} #quadExhaustArt.hot *{fill:#bff0ff;filter:url(#${ID("Glow")});}</style>
      </defs>
      <ellipse cx="500" cy="${G + 6}" rx="390" ry="9" fill="rgba(0,0,0,0.5)"/>
      <g id="rearWingArt"><path d="M104,178 L262,170 L262,182 L104,190 Z" fill="#12171d" stroke="#5c6570" stroke-width="1.2"/>
        <path d="M104,178 L262,170" stroke="#7fd8ff" stroke-width="2" opacity="0.7"/></g>
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,216 C300,196 560,192 922,254 L922,272 C560,212 300,214 78,234 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="248" width="1000" height="120" fill="rgba(0,0,0,0.18)"/>
          <!-- the canopy: a long teardrop with a fast screen and a wrapped backlight -->
          <path d="M690,196 C660,178 626,152 596,134
                   C572,122 544,116 516,116 C486,116 458,122 434,132 L410,150
                   C486,166 596,182 690,196 Z" fill="url(#${ID("Glass")})" stroke="#8fa8bb" stroke-width="1.4"/>
          <path d="M686,194 C656,176 624,150 594,134" stroke="#0c1117" stroke-width="7" stroke-linecap="round"/>
          <path d="M434,132 L410,150" stroke="#0c1117" stroke-width="7" stroke-linecap="round"/>
          <path d="M672,190 C646,174 618,152 592,138" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <!-- THE TIE: Rimac's scoop, from the door back into the haunch -->
          <path d="M470,200 C424,198 390,214 366,240 L374,262 C400,236 434,224 470,224 Z" fill="#04070a"/>
          <path d="M470,200 C424,198 390,214 366,240" fill="none" stroke="rgba(255,255,255,0.48)" stroke-width="2.4"/>
          <path d="M466,220 C432,220 406,230 384,250" fill="none" stroke="#7fd8ff" stroke-width="1.6" opacity="0.6"/>
          <g id="doorArt">
            <path d="M478,196 L676,214 L672,288 L482,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
            <rect x="572" y="232" width="26" height="6" rx="3" fill="#4f565e"/>
          </g>
          <path d="M478,194 L482,278" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <path d="M676,212 L672,288" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <path d="M170,210 C420,198 640,214 890,262" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M336,298 L682,302 L678,314 L340,310 Z" fill="url(#${ID("Low")})" stroke="rgba(120,132,146,0.3)"/>
          <!-- charge port, thin LED lamps, full-width tail bar -->
          <rect x="300" y="216" width="18" height="12" rx="4" fill="#0d141a" stroke="#7fd8ff" stroke-width="1.3"/>
          <path d="M894,250 L850,240" stroke="#e6f4ff" stroke-width="5" stroke-linecap="round"/>
          <path d="M890,258 L858,250" stroke="#7fd8ff" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M84,220 L150,214" stroke="#ff2d4e" stroke-width="7" stroke-linecap="round"/>
          <path d="M84,220 L150,214" stroke="rgba(255,190,200,0.6)" stroke-width="2.4" stroke-linecap="round"/>
          <text x="580" y="262" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(255,255,255,0.6)" letter-spacing="5">NEVERA</text>
        </g>
      </g>
      <g id="frontFlapArt"><rect x="830" y="298" width="82" height="6" rx="3" fill="#101318" stroke="#7fd8ff" stroke-opacity="0.5"/></g>
      <path d="M84,278 L188,284 L184,306 L88,300 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(160,180,196,0.4)" stroke-width="1.5"><path d="M112,286 L110,302"/><path d="M136,288 L134,304"/><path d="M160,290 L158,305"/></g>
      <g id="quadExhaustArt"><rect x="96" y="268" width="26" height="5" rx="2.5"/></g>
      ${wheel(axR, G - rR, rR, "basket", "#d8a866", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "basket", "#d8a866", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Ferrari 250 GTO (1962)                                              *
 * 4,325 x 1,210 mm on a 2,400 mm wheelbase, 1,000/925 overhangs.       *
 * Almost half the car is bonnet. The cabin is small, upright and set   *
 * a long way back; the tail is CUT — a Kamm panel with a ducktail lip  *
 * standing on it. Covered round lamps in faired perspex, the oval egg- *
 * crate mouth, three louvres in the front wing, Borrani wire wheels    *
 * and the competition roundel on the door.                             *
 * ------------------------------------------------------------------ */
export function drawGto(spec) {
  const ID = (n) => `hd${spec.key || "gto"}${n}`;
  const axF = 727, axR = 258, rF = 64, rR = 64, G = FRAME.ground;
  const BODY = `M78,202
    L78,244 Q80,262 98,268 L150,272 L190,300
    A72,110 0 0 1 334,300
    L660,300
    A72,110 0 0 1 800,300
    L878,296 Q912,292 920,272 L920,236
    C892,222 862,212 826,206
    C792,200 762,196 727,192
    C700,190 676,190 654,192
    C640,178 622,164 600,154
    C572,142 540,136 508,136
    C476,136 448,142 424,154
    C406,163 392,174 380,186
    C356,190 322,192 292,192
    C280,192 268,192 258,192
    C214,194 146,198 78,202 Z`;
  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ferrari 250 GTO side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f04a34"/><stop offset="0.32" stop-color="#c8151c"/><stop offset="0.78" stop-color="#78060d"/><stop offset="1" stop-color="#3a0206"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dceaf5"/><stop offset="0.4" stop-color="#516a7c"/><stop offset="1" stop-color="#101820"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f2f6fa"/><stop offset="1" stop-color="#6c757e"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.44"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-13deg) translate(-10px,-6px);}
          #quadExhaustArt *{fill:#b9c0c8;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>
      <ellipse cx="500" cy="${G + 6}" rx="382" ry="9" fill="rgba(0,0,0,0.5)"/>
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,180 C300,168 560,186 916,244 L916,264 C560,206 300,190 78,200 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="246" width="1000" height="120" fill="rgba(0,0,0,0.14)"/>
          <!-- the small upright cabin, chrome-framed, with a quarter light -->
          <path d="M654,192 C640,178 622,164 600,154
                   C572,142 540,136 508,136 C476,136 448,142 424,154 L404,178
                   C478,190 570,192 654,192 Z" fill="url(#${ID("Glass")})" stroke="#e6eef4" stroke-width="2.4"/>
          <path d="M650,190 C636,177 620,164 600,155" stroke="#b41219" stroke-width="6" stroke-linecap="round"/>
          <path d="M424,154 L404,178" stroke="#b41219" stroke-width="7" stroke-linecap="round"/>
          <path d="M600,158 L586,188" stroke="#e6eef4" stroke-width="2.2"/>
          <path d="M636,186 C622,174 606,162 588,154" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
          <!-- the three louvres cut into the front wing, and the bonnet scoop -->
          <g stroke="rgba(0,0,0,0.62)" stroke-width="3.4" stroke-linecap="round">
            <path d="M690,222 l-30,4"/><path d="M684,232 l-30,4"/><path d="M678,242 l-30,4"/>
          </g>
          <g stroke="rgba(255,255,255,0.3)" stroke-width="1.2" stroke-linecap="round">
            <path d="M690,219 l-30,4"/><path d="M684,229 l-30,4"/><path d="M678,239 l-30,4"/>
          </g>
          <path d="M840,206 C812,200 786,197 762,195 L760,204 C786,206 812,209 838,215 Z" fill="#12161b" stroke="rgba(255,255,255,0.3)"/>
          <!-- the door, and the competition roundel on it -->
          <g id="doorArt">
            <path d="M420,196 L640,196 L636,282 L424,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
          </g>
          <path d="M420,194 L424,278" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <path d="M640,194 L636,282" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <circle cx="528" cy="234" r="34" fill="#f5f7f9" stroke="#2a3037" stroke-width="1.8"/>
          <text x="528" y="248" text-anchor="middle" font-family="ui-serif,Georgia" font-size="38" fill="#1a1f26">24</text>
          <circle cx="382" cy="206" r="7" fill="#cbd4dc" stroke="#6e7780" stroke-width="1.5"/>
          <!-- the egg-crate mouth, the faired lamp, the chrome bumper -->
          <ellipse cx="892" cy="256" rx="26" ry="20" fill="#07090c" stroke="#d8e2ea" stroke-width="2.2"/>
          <g stroke="rgba(190,204,218,0.5)" stroke-width="1"><path d="M868,248 l48,0"/><path d="M866,256 l52,0"/><path d="M868,264 l48,0"/></g>
          <path d="M872,214 C848,210 836,218 834,236 L860,240 C862,226 868,220 878,220 Z" fill="rgba(214,232,244,0.45)" stroke="#dbe5ec" stroke-width="1.4"/>
          <circle cx="856" cy="228" r="12" fill="#eef5fa" stroke="#b7c2cc" stroke-width="1.4"/>
          <path d="M918,278 C900,288 876,290 854,286" fill="none" stroke="#e8eff5" stroke-width="6" stroke-linecap="round"/>
          <!-- round tail lamps in a pair, and the Kamm panel -->
          <circle cx="96" cy="228" r="10" fill="#e0223c" stroke="rgba(0,0,0,0.4)"/>
          <circle cx="122" cy="227" r="10" fill="#e0223c" stroke="rgba(0,0,0,0.4)"/>
          <path d="M80,214 L160,210" stroke="rgba(255,255,255,0.26)" stroke-width="1.6"/>
        </g>
        <!-- the ducktail lip, standing proud of the Kamm panel -->
        <g data-proud="1"><path d="M80,200 C114,190 158,186 196,190 L195,199 C158,195 114,199 80,209 Z" fill="#c8151c" stroke="rgba(255,255,255,0.42)" stroke-width="1.2"/></g>
      </g>
      <g id="frontFlapArt"><rect x="836" y="290" width="70" height="5" rx="2.5" fill="#1a1010" stroke="#e8eff5" stroke-opacity="0.35"/></g>
      <g id="quadExhaustArt" data-proud="1"><rect x="470" y="292" width="20" height="7" rx="3.5"/><rect x="496" y="292" width="20" height="7" rx="3.5"/><rect x="522" y="292" width="20" height="7" rx="3.5"/><rect x="548" y="292" width="20" height="7" rx="3.5"/></g>
      ${wheel(axR, G - rR, rR, "wire", "#e6eef4", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "wire", "#e6eef4", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Ferrari F40 (1987)                                                  *
 * 4,358 x 1,124 mm on a 2,450 mm wheelbase, 1,000/908 overhangs.       *
 * Pininfarina drew it with a ruler and that is the whole character:    *
 * a flat bonnet, a screen you can put a finger on the base of, a flat  *
 * roof, a hard break onto the engine deck and a chopped tail. The      *
 * lamps are POP-UPS and they are down, so what shows is the lid. The   *
 * flank carries the NACA duct, the deck carries the slatted engine     *
 * cover, and the wing is a fixed plane standing on the tail.           *
 * ------------------------------------------------------------------ */
export function drawF40(spec) {
  const ID = (n) => `hd${spec.key || "f40"}${n}`;
  const axF = 728, axR = 254, rF = 64, rR = 65, G = FRAME.ground;
  const BODY = `M78,196
    L78,250 Q80,268 98,274 L150,278 L186,302
    A72,108 0 0 1 330,302
    L654,302
    A71,106 0 0 1 796,302
    L880,298 Q912,294 920,276 L920,254
    L836,236 L760,222 L728,214
    L700,212 L668,210
    L604,168 L566,148
    L520,146 L470,148
    L440,166 L410,186
    L360,190 L300,192 L254,192
    L180,194 Z`;
  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ferrari F40 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2452c"/><stop offset="0.3" stop-color="#d1121a"/><stop offset="0.74" stop-color="#7d060c"/><stop offset="1" stop-color="#3a0205"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe2f0"/><stop offset="0.4" stop-color="#3f5568"/><stop offset="1" stop-color="#0a1016"/></linearGradient>
        <linearGradient id="${ID("Low")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2127"/><stop offset="1" stop-color="#06080a"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eef2f6"/><stop offset="1" stop-color="#33383f"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.1));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-13deg) translate(-10px,-6px);}
          #quadExhaustArt *{fill:#b0b7bf;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>
      <ellipse cx="500" cy="${G + 6}" rx="382" ry="9" fill="rgba(0,0,0,0.5)"/>
      <!-- the fixed wing: one plane on two uprights standing on the tail -->
      <g id="rearWingArt">
        <rect x="120" y="150" width="8" height="42" fill="#151a20" stroke="#4e565f"/>
        <rect x="238" y="148" width="8" height="42" fill="#151a20" stroke="#4e565f"/>
        <path d="M100,152 L268,144 L268,157 L100,165 Z" fill="#d1121a" stroke="rgba(255,255,255,0.42)" stroke-width="1.2"/>
      </g>
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,206 C300,196 560,206 916,260 L916,278 C560,224 300,214 78,224 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="250" width="1000" height="120" fill="rgba(0,0,0,0.2)"/>
          <!-- the glasshouse: a flat screen, a flat roof, a hard C-pillar. All straight lines. -->
          <path d="M668,210 L604,168 L566,148 L520,146 L470,148 L448,166 L560,186 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa3b3" stroke-width="1.4"/>
          <path d="M666,208 L602,167 L566,149" stroke="#0c1116" stroke-width="7" stroke-linecap="round"/>
          <path d="M470,148 L448,166" stroke="#0c1116" stroke-width="8" stroke-linecap="round"/>
          <path d="M648,200 L596,168 L566,153" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <!-- the slatted engine cover over the twin-turbo V8 -->
          <g stroke="rgba(0,0,0,0.62)" stroke-width="3.6" stroke-linecap="round">
            <path d="M420,190 l-56,4"/><path d="M404,196 l-56,4"/><path d="M388,202 l-56,4"/>
            <path d="M372,208 l-56,4"/><path d="M356,214 l-56,4"/>
          </g>
          <g stroke="rgba(255,255,255,0.26)" stroke-width="1.2" stroke-linecap="round">
            <path d="M420,187 l-56,4"/><path d="M404,193 l-56,4"/><path d="M388,199 l-56,4"/>
            <path d="M372,205 l-56,4"/><path d="M356,211 l-56,4"/>
          </g>
          <!-- the NACA duct sunk into the door, and the intake ahead of the rear arch -->
          <path d="M596,222 L520,230 Q504,238 508,250 L586,240 Z" fill="#0a0e13"/>
          <path d="M596,222 L520,230" stroke="rgba(255,255,255,0.42)" stroke-width="2"/>
          <path d="M470,214 C432,214 404,226 384,246 L390,268 C412,248 440,238 470,238 Z" fill="#05070a"/>
          <path d="M470,214 C432,214 404,226 384,246" fill="none" stroke="rgba(255,255,255,0.44)" stroke-width="2.2"/>
          <g id="doorArt">
            <path d="M478,208 L660,220 L656,286 L482,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
            <rect x="562" y="252" width="26" height="6" rx="3" fill="#4b525a"/>
          </g>
          <path d="M478,206 L482,278" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <path d="M660,218 L656,286" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <path d="M332,296 L676,300 L672,312 L336,308 Z" fill="url(#${ID("Low")})" stroke="rgba(120,132,146,0.3)"/>
          <!-- POP-UP LAMPS, DOWN: what shows is the lid and its shutline -->
          <rect x="796" y="222" width="76" height="9" rx="4" fill="#1c2128" stroke="#93a1ad" stroke-width="1.2"/>
          <path d="M798,234 L870,240" stroke="rgba(0,0,0,0.45)" stroke-width="1.6"/>
          <!-- the letterbox slot under the nose, and the round tail lamps -->
          <rect x="854" y="266" width="58" height="9" rx="4" fill="#07090c" stroke="rgba(255,255,255,0.28)"/>
          <circle cx="96" cy="216" r="11" fill="#e0223c" stroke="rgba(0,0,0,0.4)"/>
          <circle cx="124" cy="214" r="11" fill="#e0223c" stroke="rgba(0,0,0,0.4)"/>
          <text x="580" y="266" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(255,255,255,0.62)" letter-spacing="5">F40</text>
        </g>
      </g>
      <g id="frontFlapArt"><rect x="838" y="294" width="76" height="6" rx="3" fill="#141018" stroke="#e8eff5" stroke-opacity="0.3"/></g>
      <path d="M84,278 L182,284 L178,304 L88,298 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt"><circle cx="112" cy="268" r="7"/><circle cx="132" cy="269" r="7"/><circle cx="152" cy="270" r="7"/></g>
      ${wheel(axR, G - rR, rR, "telephone", "#e8e8e8", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "telephone", "#e8e8e8", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Lotus Evija                                                         *
 * 4,459 x 1,122 mm on a 2,770 mm wheelbase, 880/809 overhangs.         *
 * The defining feature is not on the flank, it is THROUGH it: two      *
 * venturi tunnels bored clean through the rear haunches, so you can    *
 * see daylight out of the back of the car. The bonnet is DISHED        *
 * between the arches, the canopy is a low bubble, there is no grille   *
 * anywhere, and the whole lower body is exposed carbon.                *
 * ------------------------------------------------------------------ */
export function drawEvija(spec) {
  const ID = (n) => `hd${spec.key || "evija"}${n}`;
  const axF = 755, axR = 231, rF = 65, rR = 69, G = FRAME.ground;
  const BODY = `M78,214
    L78,258 Q80,278 100,284 L146,288 L160,302
    A76,112 0 0 1 302,302
    Q500,312 682,302
    A72,110 0 0 1 828,302
    L890,296 Q916,292 922,272 L922,246
    C894,236 866,230 838,226
    C808,222 782,220 755,220
    C736,220 720,222 706,224
    C676,206 640,178 606,158
    C578,142 548,134 518,134
    C488,134 460,142 436,156
    C412,170 392,182 374,190
    C344,202 312,208 282,210
    C264,211 246,211 231,211
    C186,212 132,213 78,214 Z`;
  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Lotus Evija side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#dcf05a"/><stop offset="0.3" stop-color="#a6c81a"/><stop offset="0.62" stop-color="#5c7a0c"/><stop offset="1" stop-color="#141a08"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2e6f4"/><stop offset="0.4" stop-color="#3c5165"/><stop offset="1" stop-color="#080e13"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20262c"/><stop offset="1" stop-color="#080a0d"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f0f6dc"/><stop offset="1" stop-color="#4a5620"/></radialGradient>
        <radialGradient id="${ID("Tunnel")}" cx="60%" cy="45%" r="70%"><stop offset="0" stop-color="#39424a"/><stop offset="0.6" stop-color="#0d1116"/><stop offset="1" stop-color="#04060a"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.44"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.5));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-26deg) translate(-8px,-16px);}
          #quadExhaustArt *{fill:#c8ff5a;} #quadExhaustArt.hot *{fill:#e8ffb0;filter:url(#${ID("Glow")});}</style>
      </defs>
      <ellipse cx="500" cy="${G + 6}" rx="388" ry="9" fill="rgba(0,0,0,0.5)"/>
      <g id="rearWingArt"><path d="M92,190 L244,182 L244,193 L92,201 Z" fill="#12171d" stroke="#5c6570" stroke-width="1.2"/>
        <path d="M92,190 L244,182" stroke="#c8ff5a" stroke-width="2" opacity="0.7"/></g>
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>
        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,224 C300,212 560,214 922,254 L922,272 C560,232 300,232 78,242 Z" fill="url(#${ID("Shine")})"/>
          <!-- the whole lower body is exposed carbon, which is how an Evija is finished -->
          <rect x="0" y="256" width="1000" height="140" fill="url(#${ID("Carbon")})" opacity="0.94"/>
          <path d="M0,258 L1000,252" stroke="#c8ff5a" stroke-width="1.6" opacity="0.65"/>
          <!-- the canopy: a low bubble, wrapped, no B-pillar to speak of -->
          <path d="M706,224 C676,206 640,178 606,158
                   C578,142 548,134 518,134 C488,134 460,142 436,156 L416,176
                   C500,196 606,212 706,224 Z" fill="url(#${ID("Glass")})" stroke="#93a8b8" stroke-width="1.4"/>
          <path d="M702,222 C672,204 638,178 604,158" stroke="#0b1015" stroke-width="7" stroke-linecap="round"/>
          <path d="M436,156 L416,176" stroke="#0b1015" stroke-width="7" stroke-linecap="round"/>
          <path d="M688,218 C662,202 632,178 602,162" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <!-- THE VENTURI TUNNEL, bored clean through the rear haunch -->
          <ellipse cx="118" cy="243" rx="33" ry="25" fill="url(#${ID("Tunnel")})" stroke="#c8ff5a" stroke-width="2.4"/>
          <ellipse cx="124" cy="243" rx="21" ry="15" fill="#05070a"/>
          <path d="M96,232 C108,226 132,226 144,232" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="1.8"/>
          <!-- the dished bonnet between the front arches, drawn as its own surface -->
          <path d="M838,226 C806,236 780,240 755,240 C736,240 720,238 706,236 L706,224
                   C720,222 736,220 755,220 C782,220 808,222 838,226 Z" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.24)"/>
          <g id="doorArt">
            <path d="M452,196 L688,226 L684,292 L456,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
            <rect x="576" y="244" width="26" height="6" rx="3" fill="#59616a"/>
          </g>
          <path d="M452,194 L456,278" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <path d="M688,224 L684,292" stroke="rgba(0,0,0,0.32)" stroke-width="2"/>
          <rect x="330" y="222" width="18" height="12" rx="4" fill="#0d141a" stroke="#c8ff5a" stroke-width="1.3"/>
          <!-- the thin LED signatures, front and rear -->
          <path d="M898,252 L856,244" stroke="#eaffc0" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M84,222 L146,218" stroke="#ff2d4e" stroke-width="6" stroke-linecap="round"/>
          <text x="560" y="268" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(220,240,150,0.6)" letter-spacing="5">EVIJA</text>
        </g>
      </g>
      <g id="frontFlapArt"><rect x="836" y="298" width="80" height="6" rx="3" fill="#101318" stroke="#c8ff5a" stroke-opacity="0.5"/></g>
      <path d="M84,282 L172,288 L168,306 L88,300 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt"><rect x="96" y="272" width="24" height="5" rx="2.5"/></g>
      ${wheel(axR, G - rR, rR, "dish", "#c8ff5a", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#c8ff5a", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * SSC Tuatara — 4,630 x 1,092 mm, 2,680 wheelbase, 1,000/950.          *
 * Cd 0.279, and the shape is entirely in service of that: ONE          *
 * continuous line from the tip of the nose over the canopy and all the *
 * way to a tail that tapers almost to a point. No break anywhere, a    *
 * dorsal fin down the deck, and the rear wheels faired in behind spats.*
 * ------------------------------------------------------------------ */
export function drawTuatara(spec) {
  const ID = (n) => `hd${spec.key || "tuatara"}${n}`;
  const axF = 740, axR = 251, rF = 62, rR = 65, G = FRAME.ground;
  const BODY = `M78,238
    L78,266 Q82,284 102,289 L162,292 L182,302
    A72,110 0 0 1 320,302
    Q500,312 668,302
    A69,108 0 0 1 810,302
    L878,297 Q912,293 922,274 L922,252
    C892,240 862,232 830,226
    C798,220 770,216 740,214
    C716,212 698,212 684,214
    C650,192 610,168 566,154
    C534,144 500,140 466,142
    C432,144 402,152 376,164
    C346,178 316,192 288,202
    C270,208 258,212 251,214
    C196,224 138,232 78,238 Z`;
  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="SSC Tuatara side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f7fa"/><stop offset="0.36" stop-color="#c3ccd6"/><stop offset="0.78" stop-color="#79838f"/><stop offset="1" stop-color="#2b3138"/></linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe0ee"/><stop offset="0.4" stop-color="#37485a"/><stop offset="1" stop-color="#070c11"/></linearGradient>
        <linearGradient id="${ID("Low")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f25"/><stop offset="1" stop-color="#05070a"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eef2f6"/><stop offset="1" stop-color="#33383f"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.5));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-22deg) translate(-8px,-12px);}
          #quadExhaustArt *{fill:#b7bec6;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>
      <ellipse cx="500" cy="${G + 6}" rx="386" ry="9" fill="rgba(0,0,0,0.5)"/>
      <g id="rearWingArt"><path d="M92,222 L232,214 L232,224 L92,232 Z" fill="#12171d" stroke="#5c6570" stroke-width="1.1"/></g>
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.55)" stroke-width="1.2"/>
        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,246 C300,228 560,224 922,258 L922,276 C560,242 300,246 78,264 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="256" width="1000" height="120" fill="rgba(10,14,20,0.85)"/>
          <path d="M684,214 C650,192 610,168 566,154 C534,144 500,140 466,142
                   C432,144 402,152 376,164 L360,182
                   C470,196 580,206 684,214 Z" fill="url(#${ID("Glass")})" stroke="#93a4b4" stroke-width="1.4"/>
          <path d="M680,212 C648,192 608,168 564,155" stroke="#0a0f14" stroke-width="7" stroke-linecap="round"/>
          <path d="M376,164 L360,182" stroke="#0a0f14" stroke-width="6" stroke-linecap="round"/>
          <path d="M664,208 C634,190 600,170 562,158" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
          <path d="M470,214 C436,214 410,224 392,244 L398,264 C418,246 442,238 470,238 Z" fill="#05070a"/>
          <path d="M470,214 C436,214 410,224 392,244" fill="none" stroke="rgba(255,255,255,0.44)" stroke-width="2.2"/>
          <g id="doorArt"><path d="M480,208 L668,222 L664,286 L484,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.3)" stroke-width="1.4"/>
            <rect x="566" y="248" width="24" height="6" rx="3" fill="#525a63"/></g>
          <path d="M480,206 L484,278" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
          <path d="M668,220 L664,286" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
          <path d="M894,258 L852,250" stroke="#e8f2fa" stroke-width="4" stroke-linecap="round"/>
          <path d="M84,248 L142,244" stroke="#e0223c" stroke-width="5" stroke-linecap="round"/>
          <text x="560" y="266" text-anchor="middle" font-family="ui-sans-serif" font-size="9.5" fill="rgba(255,255,255,0.55)" letter-spacing="5">TUATARA</text>
        </g>
        <!-- the dorsal fin down the engine deck, and the spat over the rear wheel -->
        <g data-proud="1">
          <path d="M188,200 L320,192 L320,206 L188,214 Z" fill="#a8b2bd" stroke="rgba(255,255,255,0.5)" stroke-width="1.1"/>
          <path d="M182,262 A76,58 0 0 1 326,262 L326,276 L182,276 Z" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.4)" stroke-width="1.1" opacity="0.96"/>
        </g>
      </g>
      <g id="frontFlapArt"><rect x="838" y="298" width="76" height="6" rx="3" fill="#101318" stroke="#cfd8e2" stroke-opacity="0.4"/></g>
      <path d="M84,282 L166,288 L162,304 L88,298 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt"><circle cx="106" cy="274" r="6"/><circle cx="124" cy="275" r="6"/></g>
      ${wheel(axR, G - rR, rR, "dish", "#d8e2ec", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#d8e2ec", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Bugatti Chiron Super Sport 300+ — 4,994 x 1,212 mm, 2,711 wheelbase. *
 * Three things say Bugatti and nothing else: the C-LINE, the arc that  *
 * separates door from haunch and runs from the roof down to the sill;  *
 * the HORSESHOE at the nose; and the two-tone split along that C. This *
 * is the record car, so it is black over exposed carbon with the       *
 * orange stripes over the spine.                                       *
 * ------------------------------------------------------------------ */
export function drawBugatti(spec) {
  const ID = (n) => `hd${spec.key || "bugatti"}${n}`;
  const axF = 750, axR = 291, rF = 63, rR = 67, G = FRAME.ground;
  const BODY = `M78,200
    L78,252 Q80,272 100,278 L162,282 L222,302
    A74,110 0 0 1 360,302
    Q540,311 682,302
    A70,108 0 0 1 820,302
    L888,297 Q914,293 922,272 L922,236
    C896,224 866,214 836,208
    C804,202 776,198 750,196
    C726,194 706,194 690,196
    C664,178 630,152 596,136
    C566,122 534,116 502,116
    C470,116 442,122 418,134
    C396,146 378,158 362,168
    C338,182 314,190 291,194
    C220,200 148,202 78,200 Z`;
  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bugatti Chiron Super Sport 300+ side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a525c"/><stop offset="0.34" stop-color="#232a32"/><stop offset="0.78" stop-color="#101419"/><stop offset="1" stop-color="#05070a"/></linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cadcec"/><stop offset="0.4" stop-color="#33465a"/><stop offset="1" stop-color="#070b10"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1e24"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f0e2cf"/><stop offset="1" stop-color="#6b4a1e"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.55));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-18deg) translate(-9px,-9px);}
          #quadExhaustArt *{fill:#b7bec6;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>
      <ellipse cx="500" cy="${G + 6}" rx="392" ry="9" fill="rgba(0,0,0,0.55)"/>
      <g id="rearWingArt"><path d="M112,178 L268,170 L268,182 L112,190 Z" fill="#14181e" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M112,178 L268,170" stroke="#ff7a1c" stroke-width="2" opacity="0.8"/></g>
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.42)" stroke-width="1.2"/>
        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,208 C300,196 560,192 922,244 L922,262 C560,210 300,214 78,226 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="250" width="1000" height="130" fill="url(#${ID("Carbon")})" opacity="0.9"/>
          <!-- the orange stripes over the spine: this is the 300+ record car -->
          <path d="M118,196 C320,186 560,186 900,240" fill="none" stroke="#ff7a1c" stroke-width="7"/>
          <path d="M118,210 C320,200 560,200 900,254" fill="none" stroke="#ff7a1c" stroke-width="7"/>
          <path d="M690,196 C664,178 630,152 596,136 C566,122 534,116 502,116
                   C470,116 442,122 418,134 L398,152
                   C486,170 590,184 690,196 Z" fill="url(#${ID("Glass")})" stroke="#8ea2b4" stroke-width="1.4"/>
          <path d="M686,194 C660,176 628,152 594,136" stroke="#0a0e13" stroke-width="7" stroke-linecap="round"/>
          <path d="M418,134 L398,152" stroke="#0a0e13" stroke-width="7" stroke-linecap="round"/>
          <!-- THE C-LINE: roof to sill, splitting door from haunch. Nothing else has this. -->
          <path d="M462,170 C424,198 410,240 424,286 L438,286 C426,244 438,206 472,182 Z"
                fill="#0a0e14" stroke="#ff7a1c" stroke-width="2"/>
          <path d="M388,196 C356,204 336,220 322,242 L330,262 C346,240 364,228 388,220 Z" fill="#05070a"/>
          <path d="M388,196 C356,204 336,220 322,242" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <g id="doorArt"><path d="M464,166 L676,200 L672,286 L468,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.34)" stroke-width="1.4"/>
            <rect x="574" y="238" width="26" height="6" rx="3" fill="#5a626b"/></g>
          <path d="M676,198 L672,286" stroke="rgba(0,0,0,0.34)" stroke-width="2"/>
          <circle cx="322" cy="212" r="7" fill="#c9d2dc" stroke="#6d757d" stroke-width="1.4"/>
          <path d="M898,246 L856,238" stroke="#eaf3fa" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M84,218 L160,212" stroke="#ff2d4e" stroke-width="7" stroke-linecap="round"/>
          <text x="560" y="256" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(255,180,120,0.7)" letter-spacing="5">300+</text>
        </g>
        <!-- the horseshoe: chromed, arched, with its grid. Drawn proud, over the nose. -->
        <g data-proud="1">
          <path d="M906,246 C882,250 872,260 872,272 C872,284 882,292 906,296 Z" fill="#06090d" stroke="#dfe7ee" stroke-width="2"/>
          <g stroke="rgba(200,214,228,0.5)" stroke-width="0.9"><path d="M876,256 l30,0"/><path d="M873,266 l33,0"/><path d="M873,276 l33,0"/><path d="M876,286 l30,0"/></g>
        </g>
      </g>
      <g id="frontFlapArt"><rect x="836" y="300" width="76" height="6" rx="3" fill="#101318" stroke="#ff7a1c" stroke-opacity="0.5"/></g>
      <path d="M84,282 L184,288 L180,306 L88,300 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt"><circle cx="112" cy="270" r="6"/><circle cx="130" cy="271" r="6"/><circle cx="152" cy="272" r="6"/><circle cx="170" cy="273" r="6"/></g>
      ${wheel(axR, G - rR, rR, "turbine", "#d8a860", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "turbine", "#d8a860", ID("Hub"))}
    </svg>`;
}
