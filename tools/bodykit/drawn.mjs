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
