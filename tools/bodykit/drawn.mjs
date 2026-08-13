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
          <path d="M706,200 C670,182 630,155 596,138 L586,148
                   C552,143 508,143 484,151 L458,162
                   C520,170 620,186 706,200 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa3b3" stroke-width="1.4"/>
          <path d="M700,198 C666,182 630,158 596,150" stroke="#0d1116" stroke-width="7" stroke-linecap="round"/>
          <path d="M484,151 L458,162" stroke="#0d1116" stroke-width="8" stroke-linecap="round"/>
          <path d="M690,196 C660,182 628,160 598,152" stroke="rgba(255,255,255,0.30)" stroke-width="3"/>

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
export const DRAWN = {
  zr1: drawZr1, nevera: drawNevera, gto: drawGto, f40: drawF40, evija: drawEvija,
  tuatara: drawTuatara, bugatti: drawBugatti,
  pagani: drawPagani, mclaren: drawMclaren, ferrari: drawFerrariF80,
  koenigsegg: drawKoenigsegg, aston: drawAston,
  venom: drawVenom, amgone: drawAmgOne, p1: drawP1, p917: drawP917, revuelto: drawRevuelto,
  tesla: drawTesla, taycan: drawTaycan, amg: drawAmgGt, porsche918: drawPorsche918, supra: drawSupra,
  t50s: drawT50s, alfa33: drawAlfa33, project8: drawProject8, s2000: drawS2000,
  mustanggtd: drawMustangGtd, rx7: drawRx7,
  phantom: drawPhantom, spectre: drawSpectre,
};

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
                   C574,138 546,132 518,132 C488,132 460,138 436,148 L412,158
                   C486,166 596,182 690,196 Z" fill="url(#${ID("Glass")})" stroke="#8fa8bb" stroke-width="1.4"/>
          <path d="M686,194 C656,178 626,156 596,146" stroke="#0c1117" stroke-width="7" stroke-linecap="round"/>
          <path d="M436,148 L412,158" stroke="#0c1117" stroke-width="7" stroke-linecap="round"/>
          <path d="M672,190 C646,176 620,158 594,148" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
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
                   C572,156 540,150 508,150 C476,150 450,156 428,166 L408,182
                   C478,190 570,192 654,192 Z" fill="url(#${ID("Glass")})" stroke="#e6eef4" stroke-width="2.4"/>
          <path d="M650,190 C636,180 620,170 600,163" stroke="#b41219" stroke-width="6" stroke-linecap="round"/>
          <path d="M428,166 L408,182" stroke="#b41219" stroke-width="7" stroke-linecap="round"/>
          <path d="M600,166 L588,190" stroke="#e6eef4" stroke-width="2.2"/>
          <path d="M636,186 C622,177 606,168 590,162" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
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
          <path d="M668,210 L600,180 L568,164 L522,162 L474,164 L452,176 L560,186 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa3b3" stroke-width="1.4"/>
          <path d="M666,208 L600,180 L568,165" stroke="#0c1116" stroke-width="7" stroke-linecap="round"/>
          <path d="M474,164 L452,176" stroke="#0c1116" stroke-width="8" stroke-linecap="round"/>
          <path d="M648,200 L596,181 L568,169" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
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
    C576,152 552,148 536,147
    L482,147
    C466,148 452,152 436,158
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
                   C574,166 552,163 536,162 L484,162 C468,163 452,167 438,172 L418,186
                   C500,196 606,212 706,224 Z" fill="url(#${ID("Glass")})" stroke="#93a8b8" stroke-width="1.4"/>
          <path d="M702,222 C672,208 642,190 608,174" stroke="#0b1015" stroke-width="7" stroke-linecap="round"/>
          <path d="M438,170 L418,186" stroke="#0b1015" stroke-width="7" stroke-linecap="round"/>
          <path d="M688,218 C662,206 636,190 606,178" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <!-- the roof is a PANEL: give it its own highlight so it reads as painted metal -->
          <path d="M492,150 L544,150" stroke="rgba(255,255,255,0.42)" stroke-width="2.4" stroke-linecap="round"/>
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
          <path d="M684,214 C650,192 610,168 566,154 C534,158 500,154 466,156
                   C432,158 404,166 380,176 L364,190
                   C470,196 580,206 684,214 Z" fill="url(#${ID("Glass")})" stroke="#93a4b4" stroke-width="1.4"/>
          <path d="M680,212 C648,194 610,180 566,168" stroke="#0a0f14" stroke-width="7" stroke-linecap="round"/>
          <path d="M380,176 L364,190" stroke="#0a0f14" stroke-width="6" stroke-linecap="round"/>
          <path d="M664,208 C634,192 602,180 564,170" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
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
          <path d="M690,196 C664,178 630,152 596,136 C568,138 536,132 504,132
                   C472,132 444,138 420,148 L400,164
                   C486,170 590,184 690,196 Z" fill="url(#${ID("Glass")})" stroke="#8ea2b4" stroke-width="1.4"/>
          <path d="M686,194 C660,178 630,158 596,148" stroke="#0a0e13" stroke-width="7" stroke-linecap="round"/>
          <path d="M420,148 L400,164" stroke="#0a0e13" stroke-width="7" stroke-linecap="round"/>
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

/* ------------------------------------------------------------------ *
 * Pagani Huayra BC                                                    *
 *                                                                     *
 * 4,605 x 1,169 mm on a 2,795 mm wheelbase, 940/870 overhangs — nearly *
 * the whole car sits between the axles and the tail is 870 mm of       *
 * nothing. Three things make a Huayra a Huayra in side view and all    *
 * three are drawn: the GULLWING shut line, which does not stop at the  *
 * roof but climbs over it and takes a slice of roof panel with it; the *
 * FOUR titanium pipes grouped in the middle of the tail, high, over an *
 * open diffuser, instead of split to the corners; and the exposed      *
 * FASTENERS down every panel edge, which nothing else here wears. The  *
 * BC adds the canards at the nose and the wing on twin swan necks.     *
 * ------------------------------------------------------------------ */
export function drawPagani(spec) {
  const ID = (n) => `hd${spec.key || "pagani"}${n}`;
  const axF = 750, axR = 237, rF = 63, rR = 67, G = FRAME.ground;

  /* The outline. The roof runs FLAT from 486 to 540 — a Huayra's roof is a painted panel with
     a gullwing seam across it, not a canopy, so the glass below stops well short of this line. */
  const BODY = `M78,227
    L78,264 Q80,284 102,290 L150,294 L164,302
    A73,110 0 0 1 310,302
    Q500,312 680,302
    A70,104 0 0 1 820,302
    L886,298 Q912,294 920,276 L922,254
    C898,240 870,222 840,208
    C812,198 782,190 754,186
    C730,182 712,182 700,184
    C670,164 638,142 606,126
    C582,118 558,114 540,113
    L486,113
    C468,114 452,118 438,125
    C414,140 392,156 374,166
    C348,172 310,180 268,184
    C224,190 148,208 78,227 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Pagani Huayra BC side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a9f2ea"/><stop offset="0.32" stop-color="#43bdb8"/><stop offset="0.7" stop-color="#12666c"/><stop offset="1" stop-color="#05272d"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4e9f5"/><stop offset="0.4" stop-color="#3f5a68"/><stop offset="1" stop-color="#070e13"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d232a"/><stop offset="1" stop-color="#070a0d"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eafbf8"/><stop offset="1" stop-color="#1d5a5e"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.46"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.4));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 98%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-32deg) translate(-6px,-18px);}
          #quadExhaustArt *{fill:#d8dee4;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="384" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- the BC's wing, on two SWAN NECKS that hang the blade from above rather than prop it up -->
      <g id="rearWingArt">
        <path d="M126,196 C126,178 134,172 146,172" fill="none" stroke="#4a525b" stroke-width="6"/>
        <path d="M214,190 C214,172 222,166 234,166" fill="none" stroke="#4a525b" stroke-width="6"/>
        <path d="M98,176 L252,164 L252,176 L98,188 Z" fill="#12191d" stroke="#5f6a72" stroke-width="1.2"/>
        <path d="M98,176 L252,164" stroke="#8ff0e4" stroke-width="2" opacity="0.8"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,236 C300,222 560,220 922,248 L922,266 C560,238 300,240 78,252 Z" fill="url(#${ID("Shine")})"/>
          <!-- everything below the crease is bare carbon on a BC, not paint -->
          <rect x="0" y="250" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.93"/>
          <path d="M0,252 L1000,246" stroke="#8ff0e4" stroke-width="1.4" opacity="0.5"/>

          <!-- THE DAYLIGHT OPENING. Header rail at 138, roof outline at 113: the 25 px between
               them is painted panel, which is what the gullwing seam runs across. -->
          <path d="M700,188 C672,170 642,150 610,136
                   C588,144 566,141 548,140 L492,140
                   C476,141 460,145 446,150 L426,166
                   C506,174 604,182 700,188 Z"
                fill="url(#${ID("Glass")})" stroke="#93aab6" stroke-width="1.4"/>
          <path d="M700,188 C672,170 642,152 612,140" stroke="#0a1015" stroke-width="7" stroke-linecap="round"/>
          <path d="M446,150 L426,166" stroke="#0a1015" stroke-width="7" stroke-linecap="round"/>
          <path d="M688,186 C664,170 640,154 614,144" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <!-- the roof is a PANEL: its own highlight, so it reads as painted metal -->
          <path d="M498,126 L546,126" stroke="rgba(255,255,255,0.45)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the scoop in the rear quarter that feeds the AMG V12. Its mouth faces FORWARD and
               its throat narrows back into the haunch, which is the only way a duct reads in
               profile — a crescent floating on the flank reads as a scratch. -->
          <path d="M456,200 L392,202 Q376,204 376,216 L376,226 Q376,238 392,238 L456,236 Z"
                fill="#04080a" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M456,200 L456,236" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>
          <path d="M448,208 C424,209 404,211 388,214" fill="none" stroke="#8ff0e4" stroke-width="1.3" opacity="0.5"/>

          <!-- THE GULLWING. It does not stop at the roof: the shut line goes over the top and
               takes a slice of the roof panel with it. That single line is the whole car. -->
          <g id="doorArt">
            <path d="M492,116 L540,113 C566,114 588,118 606,126
                     C632,144 660,166 686,184
                     L682,288 L496,280 Z"
                  fill="rgba(255,255,255,0.035)" stroke="rgba(0,0,0,0.24)" stroke-width="1.3"/>
            <rect x="568" y="238" width="26" height="6" rx="3" fill="#5c646d"/>
          </g>
          <path d="M492,116 L496,278" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- the exposed fasteners. Pagani leaves them showing; nobody else here does. -->
          <g fill="#cfd8de" opacity="0.75">
            <circle cx="504" cy="164" r="2.1"/><circle cx="504" cy="200" r="2.1"/><circle cx="504" cy="238" r="2.1"/><circle cx="504" cy="272" r="2.1"/>
            <circle cx="676" cy="200" r="2.1"/><circle cx="678" cy="238" r="2.1"/><circle cx="680" cy="276" r="2.1"/>
            <circle cx="342" cy="220" r="2.1"/><circle cx="330" cy="244" r="2.1"/>
          </g>

          <!-- the sill blade, and the crease that runs the length of the flank -->
          <path d="M330,300 L668,304 L664,314 L334,310 Z" fill="#0a1013" stroke="rgba(143,240,228,0.3)"/>
          <path d="M186,214 C420,204 640,214 892,250" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2.2" stroke-linecap="round"/>

          <!-- FOUR round tail lamps, and the round front lamp under a clear cover -->
          <circle cx="100" cy="222" r="9" fill="#e0223c" stroke="#7d1020" stroke-width="1.2"/>
          <circle cx="124" cy="224" r="9" fill="#e0223c" stroke="#7d1020" stroke-width="1.2"/>
          <circle cx="100" cy="222" r="3.4" fill="#ff8b9c" opacity="0.85"/>
          <circle cx="124" cy="224" r="3.4" fill="#ff8b9c" opacity="0.85"/>
          <ellipse cx="876" cy="238" rx="19" ry="12" fill="#0a1014" stroke="#cfd8de" stroke-width="1.8"/>
          <circle cx="870" cy="238" r="6" fill="#e6f2f8"/><circle cx="884" cy="239" r="4.4" fill="#bcd6e2"/>
          <path d="M858,230 C866,226 888,226 894,230" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.4"/>

          <text x="560" y="262" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(180,240,232,0.62)" letter-spacing="5">HUAYRA BC</text>
        </g>
      </g>

      <!-- bolted on, outside the paint: nose canards, splitter, the four centre pipes -->
      <g id="frontFlapArt"><rect x="838" y="296" width="78" height="6" rx="3" fill="#101318" stroke="#8ff0e4" stroke-opacity="0.5"/></g>
      <path d="M900,266 l24,-5 l0,9 l-24,5 Z" fill="#0c1418" stroke="rgba(143,240,228,0.55)" stroke-width="1.2"/>
      <path d="M894,282 l28,-6 l0,9 l-28,6 Z" fill="#0c1418" stroke="rgba(143,240,228,0.4)" stroke-width="1.2"/>
      <path d="M84,272 L182,278 L178,300 L88,294 Z" fill="#080c10" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(160,180,192,0.36)" stroke-width="1.4"><path d="M108,294 L106,302"/><path d="M132,296 L130,303"/><path d="M156,297 L154,305"/></g>
      <path d="M98,250 L184,254 L182,276 L96,272 Z" fill="#04070a" stroke="rgba(160,190,190,0.3)" stroke-width="1.2"/>
      <g id="quadExhaustArt"><circle cx="112" cy="262" r="6.5"/><circle cx="131" cy="263" r="6.5"/><circle cx="150" cy="264" r="6.5"/><circle cx="169" cy="265" r="6.5"/></g>

      ${wheel(axR, G - rR, rR, "split", "#8ff0e4", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "split", "#8ff0e4", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * McLaren Speedtail                                                   *
 *                                                                     *
 * 5,137 mm long on a 2,720 mm wheelbase with a 1,407 mm rear overhang: *
 * a QUARTER of this car is behind the rear axle, and it never stops    *
 * falling. Nothing else in the garage is shaped like that. Two more    *
 * things settle it: the front wheels are covered by fixed carbon AERO  *
 * DISCS, so you see almost no front wheel at all; and it has no        *
 * mirrors — two camera pods deploy from the flanks and retract in      *
 * Velocity, which is what #cameraPod is bound to. The tail carries no  *
 * wing either: the trailing edge itself flexes.                        *
 * ------------------------------------------------------------------ */
export function drawMclaren(spec) {
  const ID = (n) => `hd${spec.key || "mclaren"}${n}`;
  const axF = 756, axR = 309, rF = 57, rR = 60, G = FRAME.ground;

  const BODY = `M78,238
    L78,272 Q82,290 104,294 L182,297 L245,302
    A64,98 0 0 1 373,302
    Q540,310 694,302
    A62,92 0 0 1 818,302
    L882,298 Q908,294 918,278 L922,262
    C890,250 858,232 830,216
    C800,198 772,182 748,172
    C722,162 690,155 660,152
    L600,152
    C566,155 534,161 502,167
    C452,178 410,188 374,194
    C350,196 328,196 309,196
    C240,206 160,222 78,238 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="McLaren Speedtail side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f2f6fa"/><stop offset="0.34" stop-color="#b9c5d1"/><stop offset="0.74" stop-color="#69737f"/><stop offset="1" stop-color="#232a31"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbeaf6"/><stop offset="0.42" stop-color="#46596b"/><stop offset="1" stop-color="#080d12"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#252c34"/><stop offset="1" stop-color="#0a0d11"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#39424c"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(calc(var(--wing-deg,10deg) * -0.5));transition:transform .5s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-26deg) translate(-8px,-14px);}
          #quadExhaustArt *{fill:#aeb6bf;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="398" ry="9" fill="rgba(0,0,0,0.5)"/>

      <!-- no wing. The tail's own trailing edge is the aerodynamic device, so it flexes. -->
      <g id="rearWingArt"><path d="M80,240 C104,236 128,234 152,234 L152,244 C128,244 104,246 80,250 Z" fill="#8b97a4" opacity="0.85"/></g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,248 C300,232 560,214 922,254 L922,272 C560,232 300,252 78,264 Z" fill="url(#${ID("Shine")})"/>
          <!-- the split: gloss over satin, along the full length -->
          <rect x="0" y="256" width="1000" height="146" fill="url(#${ID("Carbon")})" opacity="0.55"/>
          <path d="M0,258 L1000,246" stroke="rgba(255,255,255,0.2)" stroke-width="1.4"/>

          <!-- THE DAYLIGHT OPENING. The glazing on a Speedtail runs down the SPINE, which in a
               side elevation you cannot see: what you see from here is a painted roof panel
               with the side glass under it. Header rail 170, roof outline 152. -->
          <path d="M800,200
                   C762,190 716,178 668,170
                   L604,170
                   C578,172 552,178 528,186 L500,196
                   C600,198 706,200 800,200 Z"
                fill="url(#${ID("Glass")})" stroke="#9db0bf" stroke-width="1.4"/>
          <path d="M800,200 C764,190 718,180 670,172" stroke="#0b1116" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M528,186 L500,196" stroke="#0b1116" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M790,197 C756,188 716,180 672,174" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
          <path d="M614,160 L658,160" stroke="rgba(255,255,255,0.5)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the strake down the flank, and the long shut line of the dihedral door -->
          <path d="M436,214 C520,206 620,202 730,206" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2.2" stroke-linecap="round"/>
          <g id="doorArt">
            <path d="M498,204 L788,208 L784,290 L502,282 Z" fill="rgba(255,255,255,0.035)" stroke="rgba(0,0,0,0.28)" stroke-width="1.4"/>
            <rect x="626" y="240" width="26" height="6" rx="3" fill="#5d6672"/>
          </g>
          <path d="M498,202 L502,282" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>
          <path d="M788,206 L784,290" stroke="rgba(0,0,0,0.3)" stroke-width="2"/>

          <!-- the intake at the base of the tail, and the fine tail lamp -->
          <path d="M300,232 C266,234 240,242 220,254 L226,272 C248,258 274,250 302,250 Z" fill="#05080b"/>
          <path d="M300,232 C266,234 240,242 220,254" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="2"/>
          <path d="M84,240 L128,236" stroke="#ff2d4e" stroke-width="5" stroke-linecap="round"/>

          <!-- the slit headlamp, one thin line, which is all a Speedtail has -->
          <path d="M894,258 L866,251" stroke="#0d1319" stroke-width="9" stroke-linecap="round"/>
          <path d="M892,257 L868,251" stroke="#eef6fd" stroke-width="3.4" stroke-linecap="round"/>

          <text x="470" y="238" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(230,240,250,0.5)" letter-spacing="5">SPEEDTAIL</text>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="838" y="296" width="76" height="6" rx="3" fill="#101318" stroke="#c9d6e4" stroke-opacity="0.5"/></g>
      <path d="M84,284 L166,288 L162,304 L88,300 Z" fill="#0a0d12" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt"><circle cx="106" cy="270" r="5.5"/><circle cx="124" cy="271" r="5.5"/></g>

      ${wheel(axR, G - rR, rR, "dish", "#c9d6e4", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#c9d6e4", ID("Hub"))}

      <!-- the rear arch is closed over the tyre by a body-coloured spat, so the wheel is only
           half there. Drawn AFTER the wheel: inside the body clip it would have been buried. -->
      <path d="M246,254 C252,222 276,204 309,204 C342,204 366,222 372,254
               C356,232 336,220 309,220 C282,220 262,232 246,254 Z"
            fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.3)" stroke-width="1.2"/>

      <!-- THE STATIC AERO DISCS. They do not turn with the wheel, which is the point: they are
           bodywork bolted over the front hub, and they are the first thing anyone names. -->
      <circle cx="${axF}" cy="${G - rF}" r="${rF - 5}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.4)" stroke-width="1.4"/>
      <circle cx="${axF}" cy="${G - rF}" r="${rF - 18}" fill="none" stroke="rgba(201,214,228,0.5)" stroke-width="1.6"/>
      <circle cx="${axF}" cy="${G - rF}" r="6" fill="#39424c" stroke="#c9d6e4" stroke-width="1.2"/>

      <!-- the cameras, in place of mirrors. Velocity retracts them; the sim fades this group. -->
      <g id="cameraPod">
        <rect x="712" y="196" width="9" height="15" rx="3" fill="#161c22" stroke="#93a3b2" stroke-width="1.1"/>
        <circle cx="716.5" cy="200" r="2.4" fill="#7fd4ff"/>
      </g>
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Ferrari F80                                                         *
 *                                                                     *
 * 4,840 x 1,138 mm, 2,665 wheelbase, 1,030/1,145 overhangs. The F80 is *
 * drawn around a fighter-canopy cabin: a BLACK upper volume that is    *
 * visibly narrower and darker than the red body it sits on, so in      *
 * profile the car reads as two objects — a red hull with a black       *
 * cockpit set into it. The nose is on the floor (an S-duct pulls air   *
 * up through the bonnet), the tail lamp is one thin bar, and the wing  *
 * stands clear of the deck on two pylons with a moving upper flap.     *
 * ------------------------------------------------------------------ */
export function drawFerrariF80(spec) {
  const ID = (n) => `hd${spec.key || "ferrari"}${n}`;
  const axF = 742, axR = 278, rF = 59, rR = 64, G = FRAME.ground;

  const BODY = `M78,223
    L78,258 Q80,278 100,284 L164,288 L210,302
    A68,106 0 0 1 346,302
    Q520,311 678,302
    A64,96 0 0 1 806,302
    L876,304 Q904,300 916,290 L922,272
    C900,258 870,238 842,222
    C810,208 776,199 742,196
    C716,200 692,206 669,211
    C644,196 620,182 601,168
    C578,152 556,140 534,137
    L478,137
    C462,140 448,150 440,164
    C424,182 406,190 390,194
    C356,190 316,188 281,187
    C212,198 142,210 78,223 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ferrari F80 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff6a4c"/><stop offset="0.3" stop-color="#e02a24"/><stop offset="0.7" stop-color="#96101c"/><stop offset="1" stop-color="#380409"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe2f2"/><stop offset="0.4" stop-color="#39485a"/><stop offset="1" stop-color="#070b10"/></linearGradient>
        <linearGradient id="${ID("Canopy")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3138"/><stop offset="1" stop-color="#0a0d12"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f25"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#fff3d0"/><stop offset="1" stop-color="#6d5411"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.6));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .75s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-30deg) translate(-8px,-16px);}
          #quadExhaustArt *{fill:#b4bbc3;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="390" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- the wing stands clear of the deck on two pylons; the top element is the one that moves -->
      <rect x="118" y="174" width="7" height="42" fill="#141920" stroke="#4a525b"/>
      <rect x="222" y="166" width="7" height="36" fill="#141920" stroke="#4a525b"/>
      <g id="rearWingArt">
        <path d="M100,172 L252,160 L252,172 L100,184 Z" fill="#12161c" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M100,172 L252,160" stroke="#ffd24a" stroke-width="2" opacity="0.8"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.46)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,232 C300,216 560,222 922,272 L922,290 C560,240 300,236 78,248 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="262" width="1000" height="140" fill="url(#${ID("Carbon")})" opacity="0.9"/>

          <!-- THE BLACK UPPER VOLUME. The cabin on an F80 is a separate, darker object sitting in
               the red hull — so the roof here is black PAINT, and the glass stops below it. -->
          <path d="M669,211 C644,196 620,182 601,168
                   C578,152 556,140 534,137 L478,137
                   C462,140 448,150 440,164 C424,180 406,190 390,196
                   C470,200 580,206 669,211 Z"
                fill="url(#${ID("Canopy")})"/>
          <path d="M478,137 L534,137" stroke="rgba(255,255,255,0.34)" stroke-width="2.4" stroke-linecap="round"/>

          <path d="M660,212 C638,198 616,184 598,172
                   C580,160 560,152 540,150 L484,151
                   C470,154 458,162 450,174 L430,190
                   C506,196 586,204 660,212 Z"
                fill="url(#${ID("Glass")})" stroke="#7d8d9c" stroke-width="1.3"/>
          <path d="M660,212 C638,198 616,186 600,174" stroke="#080b0f" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M450,174 L430,190" stroke="#080b0f" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M650,210 C630,198 610,188 598,180" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>

          <!-- the intake ahead of the rear arch, and the louvres over the rear arch -->
          <path d="M428,208 L368,210 Q352,212 352,224 L352,234 Q352,246 368,246 L428,244 Z"
                fill="#04060a" stroke="rgba(255,255,255,0.22)" stroke-width="1.1"/>
          <path d="M428,208 L428,244" stroke="rgba(255,255,255,0.58)" stroke-width="3" stroke-linecap="round"/>
          <path d="M420,216 C398,217 380,219 364,222" fill="none" stroke="#ffd24a" stroke-width="1.3" opacity="0.5"/>
          <g stroke="rgba(0,0,0,0.6)" stroke-width="3" stroke-linecap="round">
            <path d="M300,204 l-34,3"/><path d="M298,214 l-34,3"/><path d="M296,224 l-34,3"/>
          </g>

          <!-- the butterfly door -->
          <g id="doorArt">
            <path d="M444,200 L662,214 L658,290 L448,282 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="546" y="242" width="26" height="6" rx="3" fill="#575f68"/>
          </g>
          <path d="M444,198 L448,282" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M662,212 L658,290" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- the S-duct exit on the bonnet: air comes UP through the nose and out here -->
          <path d="M790,244 C812,238 834,236 852,238 L850,248 C832,246 812,248 792,254 Z" fill="#05080c" stroke="rgba(255,210,74,0.45)" stroke-width="1.2"/>

          <path d="M84,214 L152,210" stroke="#ff2d4e" stroke-width="6" stroke-linecap="round"/>
          <path d="M906,270 L872,266" stroke="#eaf4ff" stroke-width="3.6" stroke-linecap="round"/>

          <text x="560" y="262" text-anchor="middle" font-family="ui-sans-serif" font-size="11" fill="rgba(255,214,120,0.7)" letter-spacing="5">F80</text>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="836" y="298" width="82" height="6" rx="3" fill="#101318" stroke="#ffd24a" stroke-opacity="0.55"/></g>
      <path d="M84,276 L184,282 L180,304 L88,298 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(170,186,200,0.36)" stroke-width="1.4"><path d="M112,296 L110,304"/><path d="M138,297 L136,305"/><path d="M164,299 L162,306"/></g>
      <g id="quadExhaustArt"><circle cx="118" cy="266" r="6"/><circle cx="140" cy="267" r="6"/></g>

      ${wheel(axR, G - rR, rR, "basket", "#ffd24a", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "basket", "#ffd24a", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Koenigsegg Jesko                                                    *
 *                                                                     *
 * 4,610 x 1,210 mm, 2,700 wheelbase, 980/930 overhangs — the TALLEST   *
 * of the hypercars here, and it looks it: a high, upright cabin over a *
 * short body. Two details are Koenigsegg's alone. The roof is a        *
 * REMOVABLE PANEL that stows in the front boot, so it is drawn as a    *
 * panel with a seam all the way round it — not a fixed roof and        *
 * certainly not glass. And the door is a synchro-helix: it rotates out *
 * and forward on one arm, which is why the shut line is a single arc.  *
 *                                                                     *
 * This car is also two cars. The ATTACK's boomerang wing on twin       *
 * pylons (#rearWingArt + #kgWingPylons) hides when Y is pressed, and   *
 * the ABSOLUT's deck fins, 85 mm of extra tail and aero wheel covers   *
 * (#kgAbsolutFins, #kgAbsolutTail, #kgWheelCovers) take their place.   *
 * ------------------------------------------------------------------ */
export function drawKoenigsegg(spec) {
  const ID = (n) => `hd${spec.key || "koenigsegg"}${n}`;
  const axF = 743, axR = 248, rF = 63, rR = 68, G = FRAME.ground;

  const BODY = `M78,192
    L78,250 Q80,272 102,278 L156,282 L176,302
    A72,114 0 0 1 320,302
    Q510,312 675,302
    A68,104 0 0 1 811,302
    L880,297 Q908,293 918,274 L922,236
    C896,226 866,218 838,212
    C806,198 776,192 753,188
    C724,180 696,174 669,170
    C646,158 622,146 601,137
    C578,124 552,116 525,115
    L468,115
    C452,117 438,122 426,130
    C400,142 374,150 348,152
    C298,158 262,162 230,165
    C180,172 128,180 78,192 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Koenigsegg Jesko side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/><stop offset="0.34" stop-color="#d5dce4"/><stop offset="0.74" stop-color="#8b96a3"/><stop offset="1" stop-color="#2b323b"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8ecfa"/><stop offset="0.4" stop-color="#3d5568"/><stop offset="1" stop-color="#070c11"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d222a"/><stop offset="1" stop-color="#070a0d"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#eaf6ff"/><stop offset="1" stop-color="#2b4457"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.7));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:2% 92%;transition:transform .85s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-14deg) translate(26px,-14px);}
          #quadExhaustArt *{fill:#b7c0c9;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="384" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- ATTACK: the boomerang, hung from two pylons. Y hides both and shows the Absolut kit. -->
      <g id="kgWingPylons">
        <rect x="128" y="150" width="7" height="52" fill="#141920" stroke="#4a525b"/>
        <rect x="236" y="146" width="7" height="52" fill="#141920" stroke="#4a525b"/>
      </g>
      <g id="rearWingArt">
        <path d="M96,158 C160,140 216,136 262,142 L262,156 C216,150 160,154 96,172 Z" fill="#12171e" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M96,158 C160,140 216,136 262,142" fill="none" stroke="#8fd4ff" stroke-width="2" opacity="0.8"/>
      </g>
      <!-- ABSOLUT: two deck fins instead of a wing, and 85 mm more tail -->
      <g id="kgAbsolutFins" style="display:none">
        <path d="M188,164 L318,182 L318,196 L188,178 Z" fill="#1a2028" stroke="rgba(143,212,255,0.6)" stroke-width="1.4"/>
        <path d="M212,172 L330,190 L330,202 L212,186 Z" fill="#141a22" stroke="rgba(143,212,255,0.4)" stroke-width="1.2"/>
      </g>
      <g id="kgAbsolutTail" style="display:none">
        <path d="M78,196 l-22,6 l0,52 l22,-6 Z" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.35)"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,202 C300,182 560,180 922,246 L922,266 C560,200 300,200 78,220 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="248" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.9"/>
          <path d="M0,250 L1000,240" stroke="#8fd4ff" stroke-width="1.4" opacity="0.45"/>

          <!-- THE DAYLIGHT OPENING, well under the roofline: header 133, outline 115 -->
          <path d="M669,172
                   C646,160 622,148 603,140
                   C582,132 556,133 532,133 L472,133
                   C458,136 444,142 432,150 L414,166
                   C500,170 588,171 669,172 Z"
                fill="url(#${ID("Glass")})" stroke="#93aebf" stroke-width="1.4"/>
          <path d="M669,172 C646,160 624,150 604,142" stroke="#0a0f14" stroke-width="7" stroke-linecap="round"/>
          <path d="M432,150 L414,166" stroke="#0a0f14" stroke-width="7" stroke-linecap="round"/>
          <path d="M660,170 C640,160 620,152 604,148" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>

          <!-- THE REMOVABLE ROOF. A seam all the way round a painted panel — it lifts out and
               stows in the front boot, which is why it cannot be a fixed dome and is not glass. -->
          <path d="M468,117 L525,116" stroke="rgba(255,255,255,0.5)" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M470,120 L466,132" stroke="rgba(0,0,0,0.42)" stroke-width="2" stroke-linecap="round"/>
          <path d="M528,119 L534,131" stroke="rgba(0,0,0,0.42)" stroke-width="2" stroke-linecap="round"/>
          <path d="M470,124 C492,121 512,121 530,123" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="1.6"/>

          <!-- the intake ahead of the rear arch, and the louvred vent over it -->
          <path d="M416,184 L358,186 Q342,188 342,200 L342,208 Q342,220 358,220 L416,218 Z"
                fill="#04070a" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M416,184 L416,218" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>
          <path d="M408,192 C388,193 372,195 356,198" fill="none" stroke="#8fd4ff" stroke-width="1.3" opacity="0.5"/>
          <g stroke="rgba(0,0,0,0.4)" stroke-width="2.6" stroke-linecap="round">
            <path d="M300,190 l-30,3"/><path d="M300,200 l-30,3"/><path d="M300,210 l-30,3"/>
          </g>

          <!-- SYNCHRO-HELIX: the door swings out and forward on one arm, so the cut is an arc -->
          <g id="doorArt">
            <path d="M430,164 C468,158 540,166 656,178 L652,286 C540,280 466,272 434,266 Z"
                  fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
            <rect x="540" y="232" width="26" height="6" rx="3" fill="#5b636c"/>
          </g>
          <path d="M430,164 C420,200 420,238 434,266" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.6"/>
          <path d="M656,176 L652,286" stroke="rgba(0,0,0,0.2)" stroke-width="1.6"/>

          <path d="M898,246 L858,240" stroke="#eaf6ff" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M84,206 L146,200" stroke="#ff2d4e" stroke-width="5.5" stroke-linecap="round"/>
          <text x="556" y="256" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(180,220,255,0.62)" letter-spacing="5">JESKO</text>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="298" width="84" height="6" rx="3" fill="#101318" stroke="#8fd4ff" stroke-opacity="0.55"/></g>
      <path d="M84,268 L176,274 L172,298 L88,292 Z" fill="#080c10" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(170,190,205,0.36)" stroke-width="1.4"><path d="M110,290 L108,300"/><path d="M134,292 L132,301"/><path d="M158,293 L156,302"/></g>
      <!-- one pipe, in the middle, which is how a Jesko is finished -->
      <g id="quadExhaustArt"><circle cx="120" cy="256" r="8"/></g>

      ${wheel(axR, G - rR, rR, "dish", "#8fd4ff", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#8fd4ff", ID("Hub"))}

      <g id="kgWheelCovers" style="display:none">
        <circle cx="${axR}" cy="${G - rR}" r="${rR - 4}" fill="#c9d2dc" opacity="0.92" stroke="#8fd4ff" stroke-width="1.4"/>
        <circle cx="${axF}" cy="${G - rF}" r="${rF - 4}" fill="#c9d2dc" opacity="0.92" stroke="#8fd4ff" stroke-width="1.4"/>
      </g>
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Aston Martin Valkyrie                                               *
 *                                                                     *
 * 4,530 x 1,100 mm, 2,740 wheelbase, 1,000/790 overhangs. This is a Le *
 * Mans prototype with a numberplate and it must not be drawn as a low  *
 * road car. What makes it itself is what ISN'T there: the body between *
 * the wheels is cut away underneath into two enormous VENTURI TUNNELS, *
 * so the sill is a bridge with daylight under it, and there is no rear *
 * window at all — the cabin ends in a blind wall with a camera. Add    *
 * the roof-mounted AIRBOX feeding the 6.5 V12 and the fin down the     *
 * deck behind it, and nothing else in the garage can be mistaken       *
 * for it.                                                             *
 * ------------------------------------------------------------------ */
export function drawAston(spec) {
  const ID = (n) => `hd${spec.key || "aston"}${n}`;
  const axF = 736, axR = 225, rF = 64, rR = 68, G = FRAME.ground;

  const BODY = `M78,219
    L78,250 Q80,268 98,274 L140,278 L153,302
    A72,114 0 0 1 297,302
    Q490,313 668,302
    A68,106 0 0 1 804,302
    L876,302 Q902,298 914,288 L922,270
    C898,256 868,238 840,222
    C806,206 772,196 736,190
    C712,186 694,180 677,174
    C654,160 632,150 610,141
    C588,131 564,127 542,127
    L486,127
    C470,129 456,134 444,141
    C424,156 406,172 390,187
    C348,186 300,182 264,180
    C200,190 140,204 78,219 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Aston Martin Valkyrie side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#c3f88a"/><stop offset="0.32" stop-color="#6fc23a"/><stop offset="0.72" stop-color="#256b22"/><stop offset="1" stop-color="#08240f"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6ecf6"/><stop offset="0.4" stop-color="#3e5460"/><stop offset="1" stop-color="#060c0f"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2026"/><stop offset="1" stop-color="#05080a"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#e6fff5"/><stop offset="1" stop-color="#1f5a49"/></radialGradient>
        <radialGradient id="${ID("Tunnel")}" cx="55%" cy="40%" r="72%"><stop offset="0" stop-color="#33403a"/><stop offset="0.6" stop-color="#0b1210"/><stop offset="1" stop-color="#030605"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.44"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.8));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-40deg) translate(-6px,-20px);}
          #quadExhaustArt *{fill:#c6cdd3;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="380" ry="9" fill="rgba(0,0,0,0.5)"/>

      <g id="rearWingArt">
        <rect x="112" y="146" width="7" height="48" fill="#141920" stroke="#4a525b"/>
        <rect x="208" y="142" width="7" height="48" fill="#141920" stroke="#4a525b"/>
        <path d="M92,154 L238,140 L238,152 L92,166 Z" fill="#111820" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M92,154 L238,140" stroke="#b6ff5c" stroke-width="2" opacity="0.8"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,228 C300,214 560,206 922,272 L922,290 C560,226 300,232 78,244 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="252" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.92"/>
          <path d="M0,254 L1000,246" stroke="#b6ff5c" stroke-width="1.4" opacity="0.5"/>

          <!-- THE DAYLIGHT OPENING. Header 146, roof outline 127: a teardrop screen, and then
               NOTHING behind the B-pillar — a Valkyrie has no rear window, only a camera. -->
          <path d="M677,178
                   C654,164 632,154 612,146
                   C590,138 566,136 546,136 L492,138
                   C478,141 466,147 456,156 L440,172
                   C520,176 600,177 677,178 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa8b0" stroke-width="1.4"/>
          <path d="M677,178 C654,164 634,154 614,148" stroke="#080f12" stroke-width="7" stroke-linecap="round"/>
          <path d="M456,156 L440,172" stroke="#080f12" stroke-width="8" stroke-linecap="round"/>
          <path d="M668,176 C648,164 630,156 614,152" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <path d="M498,138 L540,137" stroke="rgba(255,255,255,0.42)" stroke-width="2.4" stroke-linecap="round"/>
          <!-- the blind wall where a rear window would be, with the rear-facing camera on it -->
          <rect x="404" y="176" width="30" height="20" rx="4" fill="#0d1512" stroke="rgba(182,255,92,0.4)" stroke-width="1.2"/>
          <circle cx="419" cy="186" r="3.2" fill="#9ef0d8"/>

          <!-- THE VENTURI TUNNEL. The sill is a bridge: this is daylight under the car. -->
          <path d="M600,286 C540,266 460,258 380,262 C334,264 300,274 276,290 L286,320 L616,320 Z" fill="url(#${ID("Tunnel")})"/>
          <path d="M600,286 C540,266 460,258 380,262 C334,264 300,274 276,290" fill="none" stroke="rgba(182,255,92,0.55)" stroke-width="2.4"/>
          <path d="M576,292 C520,276 452,270 388,274" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>

          <!-- the exposed pushrod front suspension, which this car does not hide -->
          <g stroke="rgba(200,214,206,0.5)" stroke-width="3" stroke-linecap="round" fill="none">
            <path d="M700,258 L742,276"/><path d="M700,286 L740,278"/>
          </g>

          <g id="doorArt">
            <path d="M446,180 L664,190 L660,282 L450,272 Z" fill="rgba(255,255,255,0.035)" stroke="rgba(0,0,0,0.32)" stroke-width="1.4"/>
            <rect x="548" y="222" width="26" height="6" rx="3" fill="#5b6a62"/>
          </g>
          <path d="M446,178 L450,272" stroke="rgba(0,0,0,0.34)" stroke-width="2"/>
          <path d="M664,188 L660,282" stroke="rgba(0,0,0,0.34)" stroke-width="2"/>

          <path d="M84,208 C104,204 124,202 142,202" fill="none" stroke="#ff2d4e" stroke-width="6" stroke-linecap="round"/>
          <path d="M900,276 L866,284" stroke="#eafff4" stroke-width="3.6" stroke-linecap="round"/>
          <text x="540" y="244" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(200,255,150,0.6)" letter-spacing="5">VALKYRIE</text>
        </g>

        <!-- proud of the paint, so outside the clip: the roof AIRBOX and the fin behind it -->
        <g data-proud="1">
          <path d="M492,127 L474,100 L442,102 L438,143 Z" fill="#111a14" stroke="rgba(182,255,92,0.55)" stroke-width="1.5"/>
          <path d="M492,127 L474,100 L480,99 L498,125 Z" fill="#04080a" stroke="rgba(182,255,92,0.5)" stroke-width="1.2"/>
          <path d="M446,108 L470,107" stroke="rgba(255,255,255,0.32)" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M436,146 L290,176 L290,188 L436,158 Z" fill="#0f1712" stroke="rgba(182,255,92,0.4)" stroke-width="1.2"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="830" y="300" width="88" height="6" rx="3" fill="#0e1512" stroke="#b6ff5c" stroke-opacity="0.55"/></g>
      <path d="M84,264 L166,270 L162,296 L88,290 Z" fill="#070c09" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(170,200,180,0.36)" stroke-width="1.4"><path d="M106,288 L104,298"/><path d="M128,290 L126,300"/><path d="M150,291 L148,301"/></g>
      <!-- one pipe, exiting HIGH in the centre of the tail, above the diffuser -->
      <g id="quadExhaustArt"><circle cx="104" cy="234" r="9"/></g>

      ${wheel(axR, G - rR, rR, "dish", "#9ef0d8", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#9ef0d8", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Hennessey Venom F5                                                  *
 *                                                                     *
 * 4,666 x 1,130 mm on a 2,807 mm wheelbase — the LONGEST wheelbase of  *
 * the hypercars here inside a short body, which is why it looks       *
 * stretched over its wheels. It is built for one number, 301 mph, and  *
 * the shape says so: it carries no wing at all, only a ducktail worked *
 * into the deck, and the whole tail is left OPEN so the 6.6 Fury V8    *
 * sits in daylight between two flying buttresses. Twin round lamps at  *
 * each corner, a single pair of big centre pipes, and 'F5' on the      *
 * flank in the Texas way.                                              *
 * ------------------------------------------------------------------ */
export function drawVenom(spec) {
  const ID = (n) => `hd${spec.key || "venom"}${n}`;
  const axF = 752, axR = 244, rF = 62, rR = 67, G = FRAME.ground;

  const BODY = `M78,224
    L78,258 Q80,278 100,284 L158,288 L172,302
    A72,112 0 0 1 316,302
    Q506,312 684,302
    A68,102 0 0 1 820,302
    L886,298 Q912,294 920,276 L922,253
    C898,238 866,216 838,204
    C812,196 782,192 752,192
    C716,196 682,202 654,208
    C630,192 600,166 570,148
    C548,138 526,133 506,132
    L452,132
    C436,134 422,140 410,148
    C388,164 366,178 348,186
    C316,188 282,186 252,184
    C196,192 138,206 78,224 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Hennessey Venom F5 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#8ccbff"/><stop offset="0.32" stop-color="#3d8ee6"/><stop offset="0.72" stop-color="#15529f"/><stop offset="1" stop-color="#06203f"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2e6f8"/><stop offset="0.4" stop-color="#39516b"/><stop offset="1" stop-color="#060b12"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2028"/><stop offset="1" stop-color="#06080c"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#e8f2ff"/><stop offset="1" stop-color="#26405f"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.46"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:0% 50%;transform:rotate(calc(var(--wing-deg,10deg) * -0.3));transition:transform .5s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-28deg) translate(-8px,-14px);}
          #quadExhaustArt *{fill:#c2cad2;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="386" ry="9" fill="rgba(0,0,0,0.52)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,234 C300,216 560,212 922,254 L922,272 C560,232 300,236 78,252 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="256" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.9"/>

          <!-- the daylight opening, well below the roofline: header 152, outline 132 -->
          <path d="M654,210
                   C630,194 602,172 574,156
                   C552,148 530,150 512,150 L456,150
                   C442,152 428,158 418,166 L400,182
                   C486,194 574,203 654,210 Z"
                fill="url(#${ID("Glass")})" stroke="#8ea6bc" stroke-width="1.4"/>
          <path d="M654,210 C630,194 604,174 576,158" stroke="#080d13" stroke-width="7" stroke-linecap="round"/>
          <path d="M418,166 L400,182" stroke="#080d13" stroke-width="7" stroke-linecap="round"/>
          <path d="M645,208 C624,194 602,180 578,168" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <path d="M462,142 L506,142" stroke="rgba(255,255,255,0.46)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- THE OPEN TAIL. Two buttresses run back from the roof and the Fury V8 sits in the
               daylight between them, under a mesh — there is no engine cover to speak of. -->
          <path d="M396,186 L340,196 L300,214 L306,242 L352,220 L404,208 Z" fill="#050a10"/>
          <g stroke="rgba(160,200,255,0.42)" stroke-width="1.1">
            <path d="M312,214 l84,-22"/><path d="M316,224 l84,-22"/><path d="M320,234 l84,-22"/>
          </g>
          <path d="M396,186 L340,196 L300,214" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <path d="M262,190 C240,196 216,206 194,220" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="2.4"/>

          <!-- the intake behind the door: mouth, throat, closed rear end -->
          <path d="M446,196 L386,198 Q370,200 370,212 L370,222 Q370,234 386,234 L446,232 Z"
                fill="#04070c" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M446,196 L446,232" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <!-- a NACA duct let flush into the door, which is the F5's other flank feature -->
          <path d="M556,232 L604,228 L618,242 L556,244 Z" fill="#060b11" stroke="rgba(159,200,255,0.4)" stroke-width="1.1"/>

          <g id="doorArt">
            <path d="M424,196 L642,216 L638,288 L428,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="524" y="252" width="26" height="6" rx="3" fill="#5a636d"/>
          </g>
          <path d="M424,194 L428,278" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M642,214 L638,288" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- two round lamps at each end, which is how an F5 is lit -->
          <circle cx="96" cy="244" r="8" fill="#e0223c" stroke="#7d1020" stroke-width="1.2"/>
          <circle cx="120" cy="243" r="8" fill="#e0223c" stroke="#7d1020" stroke-width="1.2"/>
          <circle cx="884" cy="240" r="9" fill="#0a1018" stroke="#c6d4e2" stroke-width="1.6"/>
          <circle cx="884" cy="240" r="4.6" fill="#eef6ff"/>
          <circle cx="866" cy="248" r="7" fill="#0a1018" stroke="#c6d4e2" stroke-width="1.4"/>
          <circle cx="866" cy="248" r="3.4" fill="#eef6ff"/>

          <text x="540" y="268" text-anchor="middle" font-family="ui-sans-serif" font-size="12" fill="rgba(190,220,255,0.7)" letter-spacing="6">F5</text>
        </g>

        <!-- the ducktail: worked INTO the deck, not bolted above it. There is no wing. -->
        <g id="rearWingArt" data-proud="1">
          <path d="M78,222 C110,210 148,200 182,196 L184,208 C150,212 112,222 80,234 Z"
                fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="836" y="298" width="82" height="6" rx="3" fill="#101318" stroke="#9fc8ff" stroke-opacity="0.55"/></g>
      <path d="M84,270 L180,276 L176,300 L88,294 Z" fill="#070b10" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(170,190,215,0.36)" stroke-width="1.4"><path d="M112,292 L110,302"/><path d="M136,294 L134,303"/><path d="M160,295 L158,304"/></g>
      <path d="M100,252 L172,256 L170,278 L98,274 Z" fill="#04070c" stroke="rgba(150,180,220,0.28)" stroke-width="1.2"/>
      <g id="quadExhaustArt"><circle cx="120" cy="264" r="9"/><circle cx="150" cy="265" r="9"/></g>

      ${wheel(axR, G - rR, rR, "five", "#8fb4ff", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#8fb4ff", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Mercedes-AMG One                                                    *
 *                                                                     *
 * 4,800 x 1,160 mm, 2,720 wheelbase. This is the only road car in the  *
 * garage with a Formula 1 power unit in it, and the body cannot hide   *
 * that: the 1.6 V6 breathes through a ROOF SNORKEL, exactly like the   *
 * airbox above a driver's head on a grand prix car, and a SHARK FIN    *
 * runs from the back of it down the deck to the two-element wing. The  *
 * front arches are LOUVRED so the air that has been through the        *
 * radiators can get out over the wheel. Silver, with the Petronas      *
 * teal, because that is the car AMG actually built.                    *
 * ------------------------------------------------------------------ */
export function drawAmgOne(spec) {
  const ID = (n) => `hd${spec.key || "amgone"}${n}`;
  const axF = 741, axR = 263, rF = 61, rR = 64, G = FRAME.ground;

  const BODY = `M78,202
    L78,248 Q80,268 100,274 L172,278 L195,302
    A68,106 0 0 1 331,302
    Q510,311 676,302
    A65,100 0 0 1 806,302
    L874,298 Q902,294 916,278 L922,262
    C896,246 866,224 840,208
    C812,196 778,190 741,188
    C712,192 686,196 660,200
    C640,180 620,158 601,144
    C578,134 552,130 525,130
    L466,132
    C452,136 442,146 436,158
    C420,172 400,182 380,188
    C340,192 300,196 263,196
    C196,196 136,198 78,202 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mercedes-AMG One side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#eef2f6"/><stop offset="0.34" stop-color="#b3bcc6"/><stop offset="0.74" stop-color="#5c6670"/><stop offset="1" stop-color="#1b2026"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6ecf2"/><stop offset="0.4" stop-color="#3a5259"/><stop offset="1" stop-color="#060c0f"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d232a"/><stop offset="1" stop-color="#070a0d"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#e6fffb"/><stop offset="1" stop-color="#0f5a54"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.75));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-30deg) translate(-8px,-15px);}
          #quadExhaustArt *{fill:#bcc6ce;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="388" ry="9" fill="rgba(0,0,0,0.52)"/>

      <g id="rearWingArt">
        <rect x="128" y="152" width="7" height="46" fill="#141920" stroke="#4a525b"/>
        <rect x="234" y="150" width="7" height="44" fill="#141920" stroke="#4a525b"/>
        <path d="M108,160 L260,148 L260,160 L108,172 Z" fill="#12181e" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M110,176 L256,165 L256,173 L110,184 Z" fill="#0e141a" stroke="#4d555f" stroke-width="1"/>
        <path d="M108,160 L260,148" stroke="#00d2be" stroke-width="2" opacity="0.85"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,212 C300,200 560,198 922,258 L922,276 C560,214 300,216 78,230 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="250" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.88"/>
          <!-- the Petronas stripes down the flank -->
          <path d="M120,208 C360,198 600,206 892,252" fill="none" stroke="#00d2be" stroke-width="4" opacity="0.85"/>
          <path d="M120,218 C360,208 600,216 892,262" fill="none" stroke="#00d2be" stroke-width="2.4" opacity="0.6"/>

          <!-- the daylight opening, header 148, roof outline 130 -->
          <path d="M660,202
                   C640,182 620,162 603,150
                   C580,142 554,142 528,142 L472,144
                   C458,148 448,156 442,166 L428,180
                   C506,190 584,196 660,202 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa8ae" stroke-width="1.4"/>
          <path d="M660,202 C640,184 622,166 604,152" stroke="#080e11" stroke-width="7" stroke-linecap="round"/>
          <path d="M442,166 L428,180" stroke="#080e11" stroke-width="7" stroke-linecap="round"/>
          <path d="M651,200 C634,184 618,170 604,160" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <path d="M478,140 L520,139" stroke="rgba(255,255,255,0.46)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- LOUVRES over the front arch: radiator air has to leave over the wheel -->
          <g stroke="rgba(0,0,0,0.55)" stroke-width="3" stroke-linecap="round">
            <path d="M792,214 l-30,4"/><path d="M796,224 l-30,4"/><path d="M800,234 l-30,4"/>
          </g>

          <path d="M418,192 L360,194 Q344,196 344,208 L344,218 Q344,230 360,230 L418,228 Z"
                fill="#04080a" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M418,192 L418,228" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M436,186 L648,206 L644,284 L440,276 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="530" y="242" width="26" height="6" rx="3" fill="#59626c"/>
          </g>
          <path d="M436,184 L440,276" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M648,204 L644,284" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <path d="M84,196 L146,194" stroke="#ff2d4e" stroke-width="5" stroke-linecap="round"/>
          <path d="M896,252 L858,244" stroke="#0c1216" stroke-width="10" stroke-linecap="round"/>
          <path d="M894,251 L860,244" stroke="#eaf6ff" stroke-width="4" stroke-linecap="round"/>
        </g>

        <!-- proud of the paint: the ROOF SNORKEL and the SHARK FIN. This is a grand prix car. -->
        <g data-proud="1">
          <path d="M472,130 L460,102 L436,103 L428,178 Z" fill="#4c555f" stroke="rgba(0,210,190,0.7)" stroke-width="1.5"/>
          <path d="M472,130 L460,102 L466,101 L480,128 Z" fill="#05090c" stroke="rgba(0,210,190,0.5)" stroke-width="1.2"/>
          <path d="M440,110 L456,109" stroke="rgba(255,255,255,0.4)" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M430,160 L268,190 L268,208 L430,178 Z" fill="#3b444e" stroke="rgba(0,210,190,0.55)" stroke-width="1.2"/>
          <path d="M426,164 L272,193" stroke="rgba(255,255,255,0.28)" stroke-width="1.4"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="298" width="84" height="6" rx="3" fill="#101318" stroke="#00d2be" stroke-opacity="0.55"/></g>
      <path d="M84,266 L172,272 L168,296 L88,290 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(160,200,196,0.36)" stroke-width="1.4"><path d="M108,288 L106,298"/><path d="M132,290 L130,300"/><path d="M156,291 L154,301"/></g>
      <!-- one big pipe in the middle, the way a single-turbo F1 unit is finished -->
      <g id="quadExhaustArt"><circle cx="112" cy="240" r="10"/></g>

      ${wheel(axR, G - rR, rR, "dish", "#00d7c4", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#00d7c4", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * McLaren P1                                                          *
 *                                                                     *
 * 4,588 x 1,188 mm, 2,670 wheelbase — SHORT, and shrink-wrapped so     *
 * tightly over its wheels that the arches are the widest part of the   *
 * car. Two things are unmistakable. The tail is not a tail: behind the *
 * cabin the bodywork is CUT AWAY to a mesh with the single centre pipe *
 * in the middle of it, so you are looking through the back of the car. *
 * And the huge active wing rides on a single central pylon and extends *
 * 300 mm rearward, which is why it is drawn hung off the deck rather   *
 * than propped on end plates. Volcano orange, and the McLaren          *
 * speedmark for a headlamp.                                            *
 * ------------------------------------------------------------------ */
export function drawP1(spec) {
  const ID = (n) => `hd${spec.key || "p1"}${n}`;
  const axF = 740, axR = 249, rF = 62, rR = 67, G = FRAME.ground;

  const BODY = `M78,229
    L78,262 Q80,282 100,288 L156,292 L178,302
    A71,112 0 0 1 320,302
    Q506,312 673,302
    A67,102 0 0 1 807,302
    L876,298 Q904,294 918,278 L922,265
    C898,244 866,220 840,206
    C812,196 776,190 740,188
    C712,192 686,198 660,204
    C636,182 610,156 584,138
    C560,126 534,118 508,116
    L452,118
    C436,122 424,130 414,142
    C396,158 376,170 356,178
    C330,182 304,180 281,178
    C212,192 144,210 78,229 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="McLaren P1 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffd070"/><stop offset="0.32" stop-color="#ff8e1c"/><stop offset="0.72" stop-color="#c04b06"/><stop offset="1" stop-color="#421903"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d2e6f6"/><stop offset="0.4" stop-color="#3b4d5e"/><stop offset="1" stop-color="#070c11"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1e24"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#ffe9cf"/><stop offset="1" stop-color="#6a3208"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.44"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.9));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:5% 96%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-34deg) translate(-7px,-17px);}
          #quadExhaustArt *{fill:#c0c7ce;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="382" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- ONE central pylon, not two end plates: the P1's wing rides out on a single stalk -->
      <rect x="164" y="150" width="9" height="48" fill="#141920" stroke="#4a525b"/>
      <g id="rearWingArt">
        <path d="M104,156 L242,144 L242,158 L104,170 Z" fill="#12161c" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M104,156 L242,144" stroke="#ff8a3c" stroke-width="2" opacity="0.85"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,238 C300,214 560,208 922,256 L922,274 C560,228 300,250 78,262 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="256" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.9"/>

          <!-- the daylight opening, header 136, roof outline 116 -->
          <path d="M660,206
                   C636,186 612,164 588,148
                   C566,138 540,134 516,134 L458,136
                   C444,140 432,148 424,158 L406,174
                   C492,188 578,198 660,206 Z"
                fill="url(#${ID("Glass")})" stroke="#8b9dad" stroke-width="1.4"/>
          <path d="M660,206 C636,188 614,168 590,152" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M424,158 L406,174" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M651,204 C630,188 610,174 590,162" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <path d="M464,128 L508,127" stroke="rgba(255,255,255,0.48)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- THE TAIL IS NOT A TAIL. Behind the cabin the body is cut away to a mesh and you
               are looking straight through the back of the car at the exhaust. -->
          <path d="M352,182 L246,196 L216,214 L222,252 L262,228 L358,210 Z" fill="#04080b"/>
          <g stroke="rgba(255,150,60,0.34)" stroke-width="1.1">
            <path d="M228,214 l124,-22"/><path d="M232,226 l124,-22"/><path d="M236,238 l122,-22"/>
          </g>
          <path d="M352,182 L246,196 L216,214" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="2.2"/>

          <path d="M400,192 L340,194 Q324,196 324,208 L324,220 Q324,232 340,232 L400,230 Z"
                fill="#04060a" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M400,192 L400,230" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M420,178 L648,208 L644,286 L424,276 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="524" y="242" width="26" height="6" rx="3" fill="#5a616a"/>
          </g>
          <path d="M420,176 L424,276" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M648,206 L644,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- the SPEEDMARK: McLaren's headlamp is the badge's own swoosh, not a lamp shape -->
          <path d="M900,250 C884,240 868,236 856,238 L858,250 C870,248 884,252 896,260 Z"
                fill="#eef6ff" stroke="#8ea0ae" stroke-width="1.1"/>
          <path d="M84,220 L150,214" stroke="#ff2d4e" stroke-width="5.5" stroke-linecap="round"/>

          <text x="530" y="256" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(255,220,180,0.55)" letter-spacing="6">P1</text>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="298" width="84" height="6" rx="3" fill="#101318" stroke="#ffcf7a" stroke-opacity="0.55"/></g>
      <path d="M84,272 L170,278 L166,300 L88,294 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <!-- one pipe, high in the middle of the cut-away tail -->
      <g id="quadExhaustArt"><circle cx="240" cy="232" r="10"/></g>

      ${wheel(axR, G - rR, rR, "five", "#ff8a3c", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#ff8a3c", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Porsche 917K                                                        *
 *                                                                     *
 * 4,290 x 920 mm on a 2,300 mm wheelbase — the SHORTEST wheelbase and  *
 * the LOWEST roof in the whole garage, and the only car here whose     *
 * deck RISES again behind the cabin: the Kurzheck tail sweeps up into  *
 * two fins with the short tail slung between them, which is the fix    *
 * that made the 917 stop trying to take off and start winning Le Mans. *
 * Gulf light blue with the orange stripe over the nose and down the    *
 * spine, roundels on the doors with 20 on them, faired-in round lamps  *
 * under plexiglass, and the exhausts stacked out of the top of the     *
 * tail because a flat-12 has nowhere else to put them.                 *
 * ------------------------------------------------------------------ */
export function drawP917(spec) {
  const ID = (n) => `hd${spec.key || "p917"}${n}`;
  const axF = 715, axR = 263, rF = 61, rR = 65, G = FRAME.ground;

  const BODY = `M78,192
    L78,246 Q80,268 100,274 L172,278 L194,302
    A69,108 0 0 1 332,302
    Q500,311 650,302
    A65,100 0 0 1 780,302
    L858,298 Q898,294 916,282 L922,268
    C892,262 856,250 828,240
    C800,228 762,214 715,204
    C692,208 676,212 662,216
    C640,196 620,176 601,164
    C578,156 550,152 525,153
    L470,155
    C456,158 448,166 444,176
    C428,192 404,204 380,210
    C350,206 320,200 292,196
    C260,190 190,186 140,186
    C112,186 92,188 78,192 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Porsche 917K side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a9e3f7"/><stop offset="0.34" stop-color="#54b0dd"/><stop offset="0.74" stop-color="#1f76a8"/><stop offset="1" stop-color="#0a3450"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dcf0fa"/><stop offset="0.4" stop-color="#41606f"/><stop offset="1" stop-color="#081016"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#ffeccd"/><stop offset="1" stop-color="#6d4410"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.48"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:8% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-15deg) translate(-8px,-6px);}
          #quadExhaustArt *{fill:#cfd6dc;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="378" ry="9" fill="rgba(0,0,0,0.5)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,200 C300,192 560,200 922,276 L922,292 C560,216 300,214 78,222 Z" fill="url(#${ID("Shine")})"/>

          <!-- GULF. The orange goes over the nose and runs the length of the spine. -->
          <path d="M78,214 C300,204 560,214 922,282 L922,302 C560,232 300,224 78,234 Z" fill="#f07a1a" opacity="0.95"/>
          <path d="M78,214 C300,204 560,214 922,282" fill="none" stroke="rgba(255,255,255,0.32)" stroke-width="1.4"/>

          <!-- the daylight opening: header 172, roof outline 153. Low and wide, not a bubble. -->
          <path d="M662,220
                   C640,202 622,186 604,174
                   C582,168 556,166 532,167 L478,169
                   C466,172 458,178 452,186 L440,198
                   C516,208 590,214 662,220 Z"
                fill="url(#${ID("Glass")})" stroke="#96b2c0" stroke-width="1.4"/>
          <path d="M662,220 C640,204 622,190 606,178" stroke="#08111a" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M452,186 L440,198" stroke="#08111a" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M653,218 C634,204 618,192 604,184" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
          <path d="M484,163 L524,162" stroke="rgba(255,255,255,0.48)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the roundel, with 20 in it, which is how a Gulf 917 is identified from 200 m -->
          <circle cx="536" cy="238" r="30" fill="#f4f7f9" stroke="rgba(0,0,0,0.2)" stroke-width="1.4"/>
          <text x="536" y="250" text-anchor="middle" font-family="ui-sans-serif" font-weight="700" font-size="34" fill="#0d2a3d">20</text>

          <g id="doorArt">
            <path d="M448,196 L646,222 L644,282 L452,272 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
          </g>
          <path d="M448,194 L452,272" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M646,220 L644,282" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- the gill behind the front arch that lets the front radiator air out -->
          <g stroke="rgba(0,0,0,0.5)" stroke-width="3" stroke-linecap="round">
            <path d="M676,232 l-28,4"/><path d="M678,242 l-28,4"/><path d="M680,252 l-28,4"/>
          </g>

          <circle cx="98" cy="206" r="8" fill="#e0223c" stroke="#7d1020" stroke-width="1.2"/>
          <circle cx="124" cy="205" r="8" fill="#e0223c" stroke="#7d1020" stroke-width="1.2"/>
        </g>

        <!-- proud of the paint: the two KURZHECK FINS the short tail is slung between -->
        <g data-proud="1">
          <path d="M186,186 L186,164 L124,166 L118,190 Z" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.42)" stroke-width="1.2"/>
          <path d="M182,170 L128,171" stroke="#f07a1a" stroke-width="4" opacity="0.9"/>
        </g>

        <!-- FAIRED-IN round lamps under plexiglass, which is how a Le Mans car is lit -->
        <g data-proud="1">
          <ellipse cx="870" cy="252" rx="21" ry="15" fill="rgba(200,228,240,0.28)" stroke="#dfe9f0" stroke-width="1.6"/>
          <circle cx="864" cy="252" r="9" fill="#eef6fb" stroke="#93a6b2" stroke-width="1.1"/>
          <circle cx="882" cy="254" r="6.5" fill="#dfeaf2" stroke="#93a6b2" stroke-width="1"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="828" y="298" width="88" height="6" rx="3" fill="#0e1318" stroke="#e8622a" stroke-opacity="0.6"/></g>
      <path d="M84,262 L166,268 L162,292 L88,286 Z" fill="#080c10" stroke="rgba(255,255,255,0.14)"/>
      <!-- a flat-12 has nowhere to put its pipes but up and out of the top of the tail -->
      <g id="quadExhaustArt">
        <circle cx="146" cy="200" r="6"/><circle cx="162" cy="201" r="6"/>
        <circle cx="178" cy="202" r="6"/><circle cx="194" cy="203" r="6"/>
      </g>

      ${wheel(axR, G - rR, rR, "five", "#e8a33c", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#e8a33c", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Lamborghini Revuelto                                                *
 *                                                                     *
 * 4,947 x 1,160 mm, 2,779 wheelbase, and cab-forward: the screen base  *
 * is a third of the way down the car and the tail then runs on and on. *
 * The thing that separates a Lamborghini from everything else in this  *
 * garage is that it is drawn with a RULER — hexagons and Ys and        *
 * straight cuts, no radii to speak of — so this outline is written     *
 * with L segments where every other car here uses C. The Y is          *
 * everywhere on purpose: the headlamp is a Y, the tail lamp is a Y,    *
 * the rear-quarter intake is the arm of a Y. The two hexagonal pipes   *
 * are stacked HIGH in the middle of the tail, above the diffuser,      *
 * where a V12 with nothing behind it can put them. And the doors go    *
 * UP, because they always have.                                        *
 * ------------------------------------------------------------------ */
export function drawRevuelto(spec) {
  const ID = (n) => `hd${spec.key || "revuelto"}${n}`;
  const axF = 750, axR = 276, rF = 59, rR = 63, G = FRAME.ground;

  const BODY = `M78,219
    L78,254 Q80,274 100,280 L176,284 L209,302
    A67,104 0 0 1 343,302
    Q520,312 687,302
    A63,96 0 0 1 813,302
    L878,298 Q906,294 918,280 L922,266
    L855,238 L779,222 L750,196
    L711,206 L652,214
    L584,158 L500,142
    L436,146 L412,176
    L399,196 L280,192
    L163,200 L78,219 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Lamborghini Revuelto side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffc46a"/><stop offset="0.32" stop-color="#ff8a26"/><stop offset="0.72" stop-color="#c94b0b"/><stop offset="1" stop-color="#511803"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e8f6"/><stop offset="0.4" stop-color="#3c4c5c"/><stop offset="1" stop-color="#070b10"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1e23"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f2ffc9"/><stop offset="1" stop-color="#5c6d09"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.42"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.65));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          /* the doors go UP. They always have. */
          #doorArt{transform-box:fill-box;transform-origin:88% 92%;transition:transform .85s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-36deg);}
          #quadExhaustArt *{fill:#c4ccd4;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="392" ry="9" fill="rgba(0,0,0,0.52)"/>

      <g id="rearWingArt">
        <rect x="122" y="176" width="7" height="34" fill="#141920" stroke="#4a525b"/>
        <rect x="214" y="172" width="7" height="30" fill="#141920" stroke="#4a525b"/>
        <path d="M104,180 L238,168 L238,180 L104,192 Z" fill="#12161b" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M104,180 L238,168" stroke="#ffb35c" stroke-width="2" opacity="0.85"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,228 C300,214 560,208 922,272 L922,290 C560,230 300,240 78,252 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="262" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.9"/>

          <!-- the daylight opening. Straight cuts, no radii: header 162, roof outline 142. -->
          <path d="M652,218 L590,172 L508,158 L446,162 L424,188 L414,200
                   L500,206 L578,212 Z"
                fill="url(#${ID("Glass")})" stroke="#8c9dae" stroke-width="1.4"/>
          <path d="M652,218 L592,174" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M424,188 L414,200" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M642,216 L590,180" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M456,152 L500,150" stroke="rgba(255,255,255,0.46)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the hexagonal glass over the V12, let into the deck -->
          <path d="M392,200 L330,206 L306,222 L316,238 L378,230 L400,214 Z"
                fill="rgba(120,150,178,0.3)" stroke="rgba(210,230,246,0.45)" stroke-width="1.2"/>
          <g stroke="rgba(0,0,0,0.5)" stroke-width="2.4" stroke-linecap="round">
            <path d="M324,220 l60,-7"/><path d="M328,228 l58,-7"/>
          </g>

          <!-- the arm of the Y in the rear quarter: two straight cuts, not a rounded scoop -->
          <path d="M404,206 L344,212 L332,232 L344,246 L404,236 Z"
                fill="#04070b" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M404,206 L404,236" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M420,196 L640,220 L636,290 L424,280 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="520" y="248" width="26" height="6" rx="3" fill="#5a6068"/>
          </g>
          <path d="M420,194 L424,280" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M640,218 L636,290" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- THE Y, twice: a Y for a headlamp and a Y for a tail lamp -->
          <g stroke="#eaf4ff" stroke-width="4" stroke-linecap="round" fill="none">
            <path d="M898,252 L874,246"/><path d="M874,246 L856,236"/><path d="M874,246 L856,254"/>
          </g>
          <g stroke="#ff2d4e" stroke-width="4.6" stroke-linecap="round" fill="none">
            <path d="M84,214 L110,212"/><path d="M110,212 L132,204"/><path d="M110,212 L132,220"/>
          </g>

          <text x="540" y="266" text-anchor="middle" font-family="ui-sans-serif" font-size="9" fill="rgba(255,210,160,0.55)" letter-spacing="5">REVUELTO</text>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="836" y="298" width="82" height="6" rx="3" fill="#101318" stroke="#ffb35c" stroke-opacity="0.55"/></g>
      <path d="M84,272 L184,278 L180,300 L88,294 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <g stroke="rgba(190,180,160,0.32)" stroke-width="1.4"><path d="M112,292 L110,302"/><path d="M138,294 L136,303"/><path d="M164,295 L162,304"/></g>
      <!-- TWO HEXAGONS, stacked, high in the middle of the tail. Nothing else is finished that way. -->
      <g id="quadExhaustArt">
        <path d="M132,222 l10,-6 l10,6 l0,11 l-10,6 l-10,-6 Z"/>
        <path d="M132,240 l10,-6 l10,6 l0,11 l-10,6 l-10,-6 Z"/>
      </g>

      ${wheel(axR, G - rR, rR, "ten", "#c8ff2a", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "ten", "#c8ff2a", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Tesla Model S Plaid                                                 *
 *                                                                     *
 * 4,979 x 1,445 mm on a 2,960 mm wheelbase — a FIVE-DOOR LIFTBACK, and *
 * the first car in this file that is not a two-seat coupe. That        *
 * changes the whole drawing: there is a B-pillar, the side glass is    *
 * SPLIT into a front and a rear light, there are two door handles, and *
 * the roof is a long flat plateau rather than a peak. The other three  *
 * things that make it itself are all absences — no grille at all (the  *
 * nose is one closed surface), no exhaust anywhere, and no door        *
 * handles standing off the skin, because they sit flush and only the   *
 * shut line tells you they are there. The tail is one unbroken arc     *
 * from the base of the screen to the liftback, and the lamp is a bar.  *
 * ------------------------------------------------------------------ */
export function drawTesla(spec) {
  const ID = (n) => `hd${spec.key || "tesla"}${n}`;
  const axF = 766, axR = 264, rF = 61, rR = 61, G = FRAME.ground;

  const BODY = `M78,227
    L78,268 Q80,292 104,298 L172,302 L198,302
    A66,100 0 0 1 330,302
    Q530,312 700,302
    A66,100 0 0 1 832,302
    L890,299 Q912,296 920,282 L922,262
    C900,250 872,236 846,226
    C818,212 792,202 766,196
    C740,196 720,198 703,198
    C680,178 662,160 644,144
    C614,120 582,100 551,95
    L455,93
    C424,100 388,110 348,124
    C310,142 274,160 238,178
    C186,196 130,214 78,227 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Tesla Model S Plaid side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/><stop offset="0.34" stop-color="#dbe2ea"/><stop offset="0.74" stop-color="#9aa5b1"/><stop offset="1" stop-color="#39424c"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dceaf6"/><stop offset="0.4" stop-color="#4a5c6e"/><stop offset="1" stop-color="#0b131b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#3d4750"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.52"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.09"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:4% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-11deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#a7aeb6;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="392" ry="9" fill="rgba(0,0,0,0.5)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,238 C300,220 560,214 922,272 L922,292 C560,234 300,240 78,256 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="278" width="1000" height="120" fill="rgba(0,0,0,0.2)"/>

          <!-- THE GREENHOUSE OF A FOUR-DOOR: two lights, split by a B-pillar, header at 122
               with 10 px of painted roof above it. This is not a canopy. -->
          <path d="M700,194 L568,108 L468,106 L396,176
                   C492,182 596,188 700,194 Z"
                fill="url(#${ID("Glass")})" stroke="#93a7bb" stroke-width="1.4"/>
          <path d="M700,194 L568,108" stroke="#0a1119" stroke-width="7" stroke-linecap="round"/>
          <path d="M468,106 L396,176" stroke="#0a1119" stroke-width="7" stroke-linecap="round"/>
          <!-- the B-pillar, blacked out the way a Model S does it -->
          <path d="M517,107 L520,183" stroke="#0a1119" stroke-width="9" stroke-linecap="round"/>
          <path d="M690,190 L572,114" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M482,99 L546,98" stroke="rgba(255,255,255,0.5)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- two doors, and the handles that sit FLUSH: a shut line, not a lever -->
          <g id="doorArt">
            <path d="M519,184 L700,196 L696,288 L521,284 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="606" y="212" width="30" height="5" rx="2.5" fill="#8d99a5"/>
          </g>
          <path d="M519,182 L521,284" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M700,194 L696,288" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M396,176 L400,280" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <rect x="440" y="206" width="30" height="5" rx="2.5" fill="#8d99a5"/>

          <!-- the crease along the flank, and the CHARGE PORT in the rear quarter -->
          <path d="M120,236 C360,220 620,222 894,258" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round"/>
          <path d="M196,222 l24,-2 l1,15 l-24,2 Z" fill="#0d141b" stroke="rgba(200,16,46,0.6)" stroke-width="1.2"/>

          <!-- one bar across the tail, and the swept front cluster. No grille anywhere. -->
          <path d="M84,238 L152,232" stroke="#e0223c" stroke-width="7" stroke-linecap="round"/>
          <path d="M900,254 C884,246 866,242 850,242 L852,254 C866,254 882,258 896,264 Z"
                fill="#eef6ff" stroke="#8fa0ad" stroke-width="1.1"/>

          <text x="560" y="252" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(70,84,98,0.65)" letter-spacing="5">PLAID</text>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="838" y="296" width="78" height="6" rx="3" fill="#141a20" stroke="#c8102e" stroke-opacity="0.4"/></g>
      <path d="M84,282 L172,288 L168,304 L88,298 Z" fill="#0c1116" stroke="rgba(255,255,255,0.12)"/>
      <!-- there is no exhaust on a Model S. The group stays so the sim's ref still binds. -->
      <g id="quadExhaustArt"></g>

      ${wheel(axR, G - rR, rR, "ten", "#b9c6d4", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "ten", "#b9c6d4", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Porsche Taycan Turbo GT                                             *
 *                                                                     *
 * 4,963 x 1,381 mm on a 2,900 mm wheelbase — also a four-door, but it  *
 * is not drawn like the Tesla and must not be. Porsche's FLYLINE runs  *
 * the roof down in one continuous fall straight into the ducktail with *
 * no boot step at all, the front wings stand PROUD of the bonnet the   *
 * way they have since the 911, and the rear haunch is the widest part  *
 * of the car. Four-point lamps in a recessed pod at the front, a       *
 * full-width bar with the name written across it at the back, the      *
 * charge-port flap ahead of the door, and no exhaust.                  *
 * ------------------------------------------------------------------ */
export function drawTaycan(spec) {
  const ID = (n) => `hd${spec.key || "taycan"}${n}`;
  const axF = 764, axR = 271, rF = 60, rR = 61, G = FRAME.ground;

  const BODY = `M78,231
    L78,272 Q80,294 104,300 L166,303 L205,302
    A66,100 0 0 1 337,302
    Q530,312 699,302
    A65,98 0 0 1 829,302
    L888,299 Q910,296 918,282 L922,258
    C898,242 872,222 848,212
    C818,204 792,200 764,199
    C740,194 720,189 703,184
    C682,160 660,138 635,124
    C608,108 576,99 542,98
    L470,100
    C432,112 390,132 348,151
    C320,170 292,188 255,206
    C200,212 140,218 78,227 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Porsche Taycan Turbo GT side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#a7f0e8"/><stop offset="0.32" stop-color="#3fb4b2"/><stop offset="0.72" stop-color="#106a70"/><stop offset="1" stop-color="#062a30"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8eef6"/><stop offset="0.4" stop-color="#41606a"/><stop offset="1" stop-color="#08131a"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f2f8fc"/><stop offset="1" stop-color="#3a4a54"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:translateY(calc(var(--wing-deg,10deg) * -0.28px));transition:transform .5s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:4% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-12deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#a7aeb6;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="392" ry="9" fill="rgba(0,0,0,0.5)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,242 C300,226 560,220 922,268 L922,288 C560,240 300,246 78,260 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="276" width="1000" height="120" fill="rgba(0,0,0,0.2)"/>

          <!-- the greenhouse: header 142, roof outline 104-106. THE FLYLINE is the point —
               the backlight and the deck are ONE line, with no step onto a boot lid. -->
          <path d="M700,190 L558,116 L476,116
                   C440,134 400,166 362,198
                   C474,196 588,193 700,190 Z"
                fill="url(#${ID("Glass")})" stroke="#8fb0bb" stroke-width="1.4"/>
          <path d="M700,190 L558,116" stroke="#08131a" stroke-width="7" stroke-linecap="round"/>
          <path d="M476,116 C440,136 400,168 364,198" stroke="#08131a" stroke-width="6" stroke-linecap="round"/>
          <path d="M528,117 L531,194" stroke="#08131a" stroke-width="8.5" stroke-linecap="round"/>
          <path d="M690,186 L562,122" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M488,104 L544,103" stroke="rgba(255,255,255,0.5)" stroke-width="2.4" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M530,194 L700,192 L696,288 L532,286 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="614" y="216" width="30" height="5" rx="2.5" fill="#8fa0aa"/>
          </g>
          <path d="M530,192 L532,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M700,190 L696,288" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M394,204 L398,280" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <rect x="452" y="218" width="30" height="5" rx="2.5" fill="#8fa0aa"/>

          <!-- the charge-port flap AHEAD of the door, which is where a Taycan carries it -->
          <path d="M700,232 l26,-2 l1,18 l-26,2 Z" fill="#0a181c" stroke="rgba(95,208,234,0.6)" stroke-width="1.2"/>
          <!-- the hip over the rear wheel: the widest point of the car, so the hardest crease -->
          <path d="M180,244 C240,232 300,228 356,232" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the four-point lamp, recessed into its own pod -->
          <path d="M902,246 C884,238 866,236 852,238 L854,254 C868,252 884,256 898,262 Z" fill="#0a1418" stroke="#cfe0e6" stroke-width="1.3"/>
          <g fill="#eef8ff"><circle cx="866" cy="244" r="3.2"/><circle cx="878" cy="247" r="3.2"/><circle cx="866" cy="253" r="3.2"/><circle cx="878" cy="256" r="3.2"/></g>
          <!-- the bar across the tail with the name written across it -->
          <path d="M84,242 L172,236" stroke="#e0223c" stroke-width="7" stroke-linecap="round"/>
          <text x="128" y="232" text-anchor="middle" font-family="ui-sans-serif" font-size="7" fill="rgba(255,255,255,0.7)" letter-spacing="3">PORSCHE</text>
        </g>

        <!-- the deployable ducktail: it RISES rather than tilts, which is what a Taycan does -->
        <g id="rearWingArt" data-proud="1">
          <path d="M84,228 C120,220 160,214 196,212 L198,224 C162,226 122,232 86,240 Z"
                fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.42)" stroke-width="1.2"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="836" y="296" width="80" height="6" rx="3" fill="#0e161a" stroke="#5fd0ea" stroke-opacity="0.5"/></g>
      <path d="M84,286 L176,290 L172,304 L88,300 Z" fill="#0a1215" stroke="rgba(255,255,255,0.12)"/>
      <!-- no exhaust on a Taycan either -->
      <g id="quadExhaustArt"></g>

      ${wheel(axR, G - rR, rR, "five", "#d8e0e8", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#d8e0e8", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Mercedes-AMG GT Black Series                                        *
 *                                                                     *
 * 4,638 x 1,284 mm on a 2,630 mm wheelbase with a 1,120 mm FRONT       *
 * overhang — the longest bonnet in the garage by a wide margin, and    *
 * the only front-engined two-seater here. Everything follows from      *
 * that: the cabin sits right back over the rear axle, the screen base  *
 * is more than halfway down the car, and the tail is cut off short.    *
 * The Black Series adds the two-plane fixed wing with the manually     *
 * adjustable upper element, the louvres cut into the top of each front *
 * wing to let radiator air out, and the extra bonnet vents. Solarbeam  *
 * yellow, because that is the colour AMG launched it in.               *
 * ------------------------------------------------------------------ */
export function drawAmgGt(spec) {
  const ID = (n) => `hd${spec.key || "amg"}${n}`;
  const axF = 718, axR = 240, rF = 64, rR = 66, G = FRAME.ground;

  const BODY = `M78,199
    L78,252 Q80,274 102,280 L152,284 L170,302
    A70,110 0 0 1 310,302
    Q480,312 650,302
    A68,106 0 0 1 786,302
    L862,298 Q896,294 912,282 L922,246
    C898,232 862,214 828,200
    C796,192 760,188 718,188
    C688,190 660,192 630,194
    C608,170 588,144 566,126
    C548,116 530,112 512,112
    L452,115
    C438,124 424,140 412,158
    C392,164 372,167 356,169
    C326,168 294,167 264,166
    C218,176 148,190 78,199 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mercedes-AMG GT Black Series side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffe86a"/><stop offset="0.32" stop-color="#f6cc12"/><stop offset="0.72" stop-color="#a97f00"/><stop offset="1" stop-color="#3a2900"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8e8f4"/><stop offset="0.4" stop-color="#3f4c58"/><stop offset="1" stop-color="#080c11"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f25"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#fff6cf"/><stop offset="1" stop-color="#6a5200"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.46"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.5));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-13deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#b6bdc4;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="388" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- the two-plane fixed wing. The upper element is the one you set by hand in the pits. -->
      <rect x="106" y="152" width="7" height="46" fill="#141920" stroke="#4a525b"/>
      <rect x="206" y="150" width="7" height="46" fill="#141920" stroke="#4a525b"/>
      <g id="rearWingArt">
        <path d="M88,158 L232,146 L232,158 L88,170 Z" fill="#12161c" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M88,158 L232,146" stroke="#f2c200" stroke-width="2" opacity="0.85"/>
      </g>
      <path d="M92,176 L228,165 L228,173 L92,184 Z" fill="#0e1218" stroke="#4d555f" stroke-width="1"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,210 C300,200 560,208 922,274 L922,292 C560,228 300,226 78,232 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="268" width="1000" height="130" fill="url(#${ID("Carbon")})" opacity="0.85"/>

          <!-- the greenhouse, set right back: header 128, roof outline 105 -->
          <path d="M632,194 L552,132 L458,128 L404,168
                   C480,177 556,186 632,194 Z"
                fill="url(#${ID("Glass")})" stroke="#8697a6" stroke-width="1.4"/>
          <path d="M632,194 L552,132" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M458,128 L404,168" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M623,191 L556,139" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M468,120 L520,118" stroke="rgba(255,255,255,0.46)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- LOUVRES cut into the top of the front wing: Black Series only, and the fastest
               way to tell one from an ordinary GT at a glance -->
          <g stroke="rgba(0,0,0,0.6)" stroke-width="3.4" stroke-linecap="round">
            <path d="M786,208 l-34,4"/><path d="M790,218 l-34,4"/><path d="M794,228 l-34,4"/>
          </g>
          <!-- and the extra vents let into that very long bonnet -->
          <g stroke="rgba(0,0,0,0.4)" stroke-width="3" stroke-linecap="round">
            <path d="M850,222 l-26,3"/><path d="M854,232 l-26,3"/>
          </g>

          <path d="M414,176 C368,182 330,190 296,198" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2.2" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M418,172 L626,194 L622,288 L422,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="520" y="224" width="30" height="6" rx="3" fill="#7d6a12"/>
          </g>
          <path d="M418,170 L422,278" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M626,192 L622,288" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <path d="M84,206 L154,202" stroke="#e0223c" stroke-width="6" stroke-linecap="round"/>
          <path d="M902,258 C888,250 872,246 858,246 L860,258 C872,258 886,262 898,268 Z"
                fill="#eef6ff" stroke="#8f9aa5" stroke-width="1.1"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="828" y="298" width="90" height="6" rx="3" fill="#101318" stroke="#f2c200" stroke-opacity="0.55"/></g>
      <path d="M84,274 L176,280 L172,302 L88,296 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <!-- two round pipes, out at the corners, which is the AMG way -->
      <g id="quadExhaustArt"><circle cx="110" cy="262" r="8"/><circle cx="136" cy="263" r="8"/></g>

      ${wheel(axR, G - rR, rR, "five", "#ffd23a", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#ffd23a", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Porsche 918 Spyder                                                  *
 *                                                                     *
 * 4,643 x 1,167 mm, 2,730 wheelbase. It is a SPYDER, which is the      *
 * whole drawing: two roof panels lift out and stow in the nose, so     *
 * behind the seats there are two ROLL HOOPS standing proud of the deck *
 * rather than a backlight, and the space between them is open. The     *
 * other thing nothing else in this garage has is where the exhaust     *
 * comes out — the 918's pipes exit STRAIGHT UP out of the top of the   *
 * engine cover, inches behind the driver's head, because the shortest  *
 * pipe is the best one and there was nowhere else to route it. Two     *
 * stubs on the deck, not a diffuser.                                   *
 * ------------------------------------------------------------------ */
export function drawPorsche918(spec) {
  const ID = (n) => `hd${spec.key || "porsche918"}${n}`;
  const axF = 740, axR = 244, rF = 62, rR = 65, G = FRAME.ground;

  const BODY = `M78,203
    L78,254 Q80,276 102,282 L156,286 L174,302
    A70,108 0 0 1 314,302
    Q506,312 673,302
    A67,102 0 0 1 807,302
    L878,298 Q906,294 918,282 L922,262
    C898,246 866,228 838,214
    C808,204 774,198 740,194
    C712,198 686,202 662,204
    C640,192 616,178 598,168
    L590,198
    C560,199 530,199 508,198
    C504,176 494,166 482,166
    C470,166 462,176 458,192
    C454,176 444,166 432,166
    C420,166 412,176 408,186
    C380,183 330,181 282,184
    C230,186 178,192 126,198
    L78,203 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Porsche 918 Spyder side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/><stop offset="0.34" stop-color="#d6dde4"/><stop offset="0.74" stop-color="#939ea9"/><stop offset="1" stop-color="#2a3138"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8ecf6"/><stop offset="0.4" stop-color="#41545f"/><stop offset="1" stop-color="#080e13"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2129"/><stop offset="1" stop-color="#070a0d"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f6fadd"/><stop offset="1" stop-color="#4a5514"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.8));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-15deg) translate(-10px,-6px);}
          #quadExhaustArt *{fill:#cdd4da;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="386" ry="9" fill="rgba(0,0,0,0.5)"/>

      <!-- the deployable rear wing, hung low behind the deck -->
      <g id="rearWingArt">
        <rect x="112" y="176" width="6" height="26" fill="#141920" stroke="#4a525b"/>
        <rect x="196" y="174" width="6" height="26" fill="#141920" stroke="#4a525b"/>
        <path d="M96,180 L218,170 L218,180 L96,190 Z" fill="#12171d" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M96,180 L218,170" stroke="#c8e400" stroke-width="2" opacity="0.8"/>
      </g>

      <!-- THE COCKPIT, drawn BEHIND the body. The outline above has a notch cut in it where a
           coupe would have a roof, so everything here shows through that notch and nothing
           else: you are looking INTO the car rather than at a shape painted on its side. -->
      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,212 C300,204 560,210 922,272 L922,290 C560,230 300,230 78,238 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="256" width="1000" height="150" fill="url(#${ID("Carbon")})" opacity="0.88"/>
          <!-- the Weissach stripes -->
          <path d="M140,214 C380,206 620,216 890,262" fill="none" stroke="#c8102e" stroke-width="4.5" opacity="0.9"/>
          <path d="M140,224 C380,216 620,226 890,272" fill="none" stroke="#c8102e" stroke-width="2.6" opacity="0.6"/>

          <!-- THE WINDSCREEN, and nothing after it. One raked pane in a bright frame; behind
               its header the outline drops straight into the cockpit, because the roof is out. -->
          <path d="M662,204 L598,168 L590,184 L654,214 Z"
                fill="url(#${ID("Glass")})" stroke="#93aab6" stroke-width="1.2"/>
          <path d="M662,204 L598,168" stroke="#c2ccd4" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M655,201 L602,171" stroke="rgba(255,255,255,0.34)" stroke-width="2.4"/>
          <!-- the sill along the top of the cockpit side -->
          <path d="M588,198 C548,199 516,199 508,198" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2.4" stroke-linecap="round"/>

          <path d="M424,196 L364,198 Q348,200 348,212 L348,220 Q348,232 364,232 L424,230 Z"
                fill="#04080a" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M424,196 L424,230" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M446,196 L654,204 L650,286 L450,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="536" y="238" width="28" height="6" rx="3" fill="#5d666f"/>
          </g>
          <path d="M446,194 L450,278" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M654,202 L650,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <path d="M84,210 L146,206" stroke="#e0223c" stroke-width="5.5" stroke-linecap="round"/>
          <circle cx="880" cy="248" r="11" fill="#0a1016" stroke="#c6d0da" stroke-width="1.5"/>
          <circle cx="880" cy="248" r="5" fill="#eef6ff"/>
        </g>

        <!-- The two roll hoops are not stuck on: they ARE the two humps in the outline behind
             the cockpit. What follows is what you can actually SEE down into an open car from
             directly beside it — the far sill, a seat back with its belt over the shoulder, and
             the top of the wheel rim over the scuttle. Everything else up there is sky. -->
        <g data-proud="1">
          <path d="M508,199 L590,198 L588,189 C560,187 532,187 508,189 Z" fill="#10161b"/>
          <path d="M552,198 C552,180 546,172 536,172 C526,172 520,180 520,198 Z" fill="#2b333a"/>
          <path d="M536,172 C531,180 529,188 529,198" fill="none" stroke="#c8e400" stroke-width="1.8" opacity="0.85"/>
          <ellipse cx="576" cy="190" rx="5" ry="9" fill="none" stroke="#232a31" stroke-width="3.4"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="298" width="84" height="6" rx="3" fill="#101318" stroke="#c8e400" stroke-opacity="0.55"/></g>
      <path d="M84,268 L166,274 L162,296 L88,290 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <!-- THE TOP PIPES. Straight up out of the engine cover, behind the driver's head.
           Nothing else in this garage exhausts anywhere near here. -->
      <path d="M264,180 L320,178 L320,192 L264,194 Z" fill="#0a0e12" stroke="rgba(200,210,220,0.35)" stroke-width="1.1"/>
      <g id="quadExhaustArt">
        <ellipse cx="280" cy="178" rx="9" ry="5"/>
        <ellipse cx="306" cy="177" rx="9" ry="5"/>
      </g>

      ${wheel(axR, G - rR, rR, "five", "#c8d4e0", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#c8d4e0", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Toyota Supra MK4 (A80)                                              *
 *                                                                     *
 * 4,514 x 1,275 mm on a 2,550 mm wheelbase — the shortest wheelbase of *
 * the road cars here, under a rounded fastback with no straight lines  *
 * in it at all. Two things settle what it is from across a car park:   *
 * the WING, which on a Turbo is a full-width blade standing on two     *
 * tall stanchions clear above the boot lid rather than a lip on it;    *
 * and the four ROUND tail lamps in a black panel across the tail. Add  *
 * the hatchback glass running most of the way down the back, the       *
 * swept projector cluster at the front, and Renaissance Red.           *
 * ------------------------------------------------------------------ */
export function drawSupra(spec) {
  const ID = (n) => `hd${spec.key || "supra"}${n}`;
  const axF = 735, axR = 258, rF = 60, rR = 62, G = FRAME.ground;

  const BODY = `M78,211
    L78,262 Q80,286 104,292 L168,296 L192,302
    A66,102 0 0 1 324,302
    Q500,312 671,302
    A64,98 0 0 1 799,302
    L868,298 Q898,294 914,282 L922,268
    C898,254 866,240 838,232
    C808,220 774,212 735,206
    C716,208 704,209 694,210
    C674,180 650,146 620,122
    C602,108 584,100 568,99
    L484,102
    C470,106 458,116 448,130
    C424,158 396,184 366,204
    C320,208 292,208 264,207
    C200,200 138,204 78,211 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Toyota Supra MK4 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff6f52"/><stop offset="0.32" stop-color="#e23225"/><stop offset="0.72" stop-color="#9c1416"/><stop offset="1" stop-color="#3a0607"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e6f2"/><stop offset="0.4" stop-color="#3f4d5c"/><stop offset="1" stop-color="#080c11"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f6f9fc"/><stop offset="1" stop-color="#454e57"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.46"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.3));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-13deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#b8bfc6;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="384" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- THE WING. A full-width blade on two tall stanchions, standing clear above the boot —
           not a lip on it. On an A80 this is the whole silhouette from behind. -->
      <rect x="132" y="150" width="8" height="58" fill="#8c1416" stroke="#4d0a0b"/>
      <rect x="230" y="146" width="8" height="58" fill="#8c1416" stroke="#4d0a0b"/>
      <g id="rearWingArt">
        <path d="M110,152 L262,140 L262,154 L110,166 Z" fill="#c8281f" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
        <path d="M110,152 L262,140" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,222 C300,212 560,216 922,278 L922,296 C560,236 300,240 78,248 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="272" width="1000" height="126" fill="rgba(0,0,0,0.24)"/>

          <!-- the greenhouse: header 118, roof outline 99-102. The hatch glass runs most of
               the way down the back, which is what makes an A80 a fastback and not a coupe. -->
          <path d="M694,216 L620,128 L500,112 L462,138
                   C440,166 414,190 388,208
                   C490,212 592,214 694,216 Z"
                fill="url(#${ID("Glass")})" stroke="#8b9caa" stroke-width="1.4"/>
          <path d="M694,216 L622,130" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M462,138 C442,166 416,190 390,208" stroke="#080c11" stroke-width="6" stroke-linecap="round"/>
          <path d="M684,212 L624,140" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M500,110 L570,109" stroke="rgba(255,255,255,0.46)" stroke-width="2.4" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M446,208 L688,220 L684,290 L450,282 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="562" y="238" width="30" height="6" rx="3" fill="#6d4040"/>
            <!-- the door mirror, on the skin, where an A80 carries it -->
            <path d="M688,204 l22,-4 l2,13 l-22,4 Z" fill="#c8281f" stroke="rgba(255,255,255,0.4)" stroke-width="1.1"/>
          </g>
          <path d="M446,206 L450,282" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M688,218 L684,290" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- the fuel filler on the rear quarter, and the crease along the flank -->
          <circle cx="308" cy="228" r="9" fill="#a8201c" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
          <path d="M140,232 C360,220 600,228 886,268" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="2" stroke-linecap="round"/>

          <!-- FOUR ROUND LAMPS in a black panel across the tail -->
          <path d="M80,216 L162,210 L164,238 L82,244 Z" fill="#141a20" stroke="rgba(255,255,255,0.2)" stroke-width="1.1"/>
          <circle cx="98" cy="226" r="8.5" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="120" cy="224" r="8.5" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="142" cy="222" r="6.5" fill="#ffb35c" stroke="#7d4a10" stroke-width="1"/>

          <!-- the swept projector cluster -->
          <path d="M904,258 C888,248 868,242 852,242 L854,256 C868,256 886,260 900,268 Z"
                fill="#0b1016" stroke="#c6d0da" stroke-width="1.3"/>
          <circle cx="870" cy="250" r="5" fill="#eef6ff"/><circle cx="886" cy="256" r="4" fill="#dfeaf4"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="298" width="84" height="6" rx="3" fill="#1a1012" stroke="#ff7a6c" stroke-opacity="0.5"/></g>
      <path d="M84,278 L172,284 L168,302 L88,296 Z" fill="#0c0e12" stroke="rgba(255,255,255,0.12)"/>
      <!-- ONE very large pipe, which is how a 2JZ is finished -->
      <g id="quadExhaustArt"><circle cx="118" cy="262" r="12"/></g>

      ${wheel(axR, G - rR, rR, "five", "#e0e6ec", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#e0e6ec", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Gordon Murray T.50s Niki Lauda                                      *
 *                                                                     *
 * 4,352 x 1,145 mm and 852 kg — the shortest and by far the lightest   *
 * car in the garage. One feature settles it before any other: the      *
 * 400 mm FAN in the middle of the tail, driven off the engine, which   *
 * sucks the car onto the road instead of pressing it there. It is      *
 * drawn as what it is — a shrouded rotor you can see through, not a    *
 * badge. Above it sits the delta wing on its central fin, and above    *
 * the cabin the ram AIRBOX the Cosworth V12 breathes through. Track    *
 * only, so it wears race numbers rather than plates, and the driver    *
 * sits in the MIDDLE, which is why the screen is symmetrical and the   *
 * door is cut so far into the roof.                                    *
 * ------------------------------------------------------------------ */
export function drawT50s(spec) {
  const ID = (n) => `hd${spec.key || "t50s"}${n}`;
  const axF = 761, axR = 237, rF = 63, rR = 67, G = FRAME.ground;

  const BODY = `M78,175
    L78,238 Q80,262 102,268 L150,272 L165,302
    A72,112 0 0 1 309,302
    Q510,312 693,302
    A68,104 0 0 1 829,302
    L888,298 Q914,294 920,278 L922,237
    C898,228 866,220 838,214
    C812,206 786,198 761,192
    C728,196 690,202 644,206
    C620,182 594,156 568,144
    C548,132 522,120 500,117
    L432,119
    C414,124 396,136 378,152
    C356,164 322,158 264,161
    C204,164 138,168 78,175 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gordon Murray T.50s Niki Lauda side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff"/><stop offset="0.34" stop-color="#dae0e6"/><stop offset="0.74" stop-color="#98a2ac"/><stop offset="1" stop-color="#2b3138"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dceaf4"/><stop offset="0.4" stop-color="#42525f"/><stop offset="1" stop-color="#080d12"/></linearGradient>
        <radialGradient id="${ID("Fan")}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#39424c"/><stop offset="0.7" stop-color="#161c22"/><stop offset="1" stop-color="#080b0f"/></radialGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f6f9fc"/><stop offset="1" stop-color="#414a53"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          .fanSpin{transform-box:fill-box;transform-origin:center;transform:rotate(calc(var(--wheel-rot,0deg) * 3));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.85));transition:transform .4s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .8s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-34deg) translate(-8px,-16px);}
          #quadExhaustArt *{fill:#ccd3da;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="376" ry="9" fill="rgba(0,0,0,0.5)"/>

      <!-- the delta wing, on a central fin rather than two end plates -->
      <path d="M132,148 L206,142 L206,178 L132,182 Z" fill="#131920" stroke="#4a525b" stroke-width="1.1"/>
      <g id="rearWingArt">
        <path d="M92,142 L240,128 L240,142 L92,156 Z" fill="#12161c" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M92,142 L240,128" stroke="#c8102e" stroke-width="2" opacity="0.85"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,184 C300,172 560,180 922,248 L922,268 C560,200 300,200 78,212 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="252" width="1000" height="150" fill="rgba(0,0,0,0.28)"/>
          <path d="M120,190 C360,180 600,196 894,252" fill="none" stroke="#c8102e" stroke-width="5" opacity="0.9"/>
          <path d="M120,202 C360,192 600,208 894,264" fill="none" stroke="#c8102e" stroke-width="2.6" opacity="0.6"/>

          <!-- the screen. The driver sits in the MIDDLE, so it is symmetrical and very wide;
               header 160, roof outline 117-119, and the roof itself is painted. -->
          <path d="M644,204 L508,134 L440,132 L396,168
                   C480,182 562,193 644,204 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa2b0" stroke-width="1.4"/>
          <path d="M644,204 L510,134" stroke="#080d12" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M440,132 L396,168" stroke="#080d12" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M636,200 L516,142" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <path d="M444,128 L494,126" stroke="rgba(255,255,255,0.48)" stroke-width="2.4" stroke-linecap="round"/>

          <path d="M400,192 L340,194 Q324,196 324,208 L324,216 Q324,228 340,228 L400,226 Z"
                fill="#04070a" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M400,192 L400,226" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M414,168 L638,206 L634,286 L418,276 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="520" y="236" width="26" height="6" rx="3" fill="#5d666f"/>
          </g>
          <path d="M414,166 L418,276" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M638,204 L634,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- track only: a race roundel where a numberplate would be -->
          <circle cx="520" cy="196" r="0" fill="none"/>
          <circle cx="700" cy="240" r="26" fill="#f4f7f9" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
          <text x="700" y="251" text-anchor="middle" font-family="ui-sans-serif" font-weight="700" font-size="30" fill="#c8102e">7</text>

          <circle cx="96" cy="196" r="7" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="118" cy="194" r="7" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="880" cy="238" r="11" fill="#0a1016" stroke="#c6d0da" stroke-width="1.5"/>
          <circle cx="880" cy="238" r="5" fill="#eef6ff"/>
        </g>

        <!-- proud of the paint: the ram AIRBOX over the driver's head -->
        <g data-proud="1">
          <path d="M452,120 L440,96 L406,98 L396,148 Z" fill="#20262d" stroke="rgba(200,16,46,0.55)" stroke-width="1.4"/>
          <path d="M452,120 L440,96 L446,95 L460,118 Z" fill="#05090c" stroke="rgba(200,16,46,0.45)" stroke-width="1.2"/>
          <path d="M410,104 L434,103" stroke="rgba(255,255,255,0.34)" stroke-width="1.8" stroke-linecap="round"/>
        </g>
      </g>

      <!-- THE FAN. 400 mm, engine-driven, in the middle of the tail: the whole idea of the car. -->
      <circle cx="128" cy="216" r="46" fill="url(#${ID("Fan")})" stroke="#8f99a3" stroke-width="2.4"/>
      <g class="fanSpin">
        <g stroke="#aeb8c2" stroke-width="4" stroke-linecap="round">
          <path d="M128,216 L128,178"/><path d="M128,216 L155,189"/><path d="M128,216 L166,216"/>
          <path d="M128,216 L155,243"/><path d="M128,216 L128,254"/><path d="M128,216 L101,243"/>
          <path d="M128,216 L90,216"/><path d="M128,216 L101,189"/>
        </g>
      </g>
      <circle cx="128" cy="216" r="9" fill="#5c666f" stroke="#c6d0da" stroke-width="1.4"/>

      <g id="frontFlapArt"><rect x="828" y="298" width="90" height="6" rx="3" fill="#101318" stroke="#c8102e" stroke-opacity="0.5"/></g>
      <path d="M84,258 L172,264 L168,288 L88,282 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <!-- one pipe, out of the TOP of the tail, above the fan -->
      <g id="quadExhaustArt"><ellipse cx="190" cy="172" rx="11" ry="6"/></g>

      ${wheel(axR, G - rR, rR, "dish", "#c8d0d8", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#c8d0d8", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Alfa Romeo 33 Stradale (2023)                                       *
 *                                                                     *
 * 4,640 x 1,210 mm. The new car is a deliberate quotation of the 1967  *
 * one, and the quotation is what has to be drawn: a shell with almost  *
 * nothing on it — no wing, no splitter, no louvres, no strakes — the   *
 * SCUDETTO at the nose as a shield rather than a mouth, round lamps    *
 * under covers at both ends, and the DIHEDRAL door that takes a piece  *
 * of the ROOF with it when it opens, which is why the shut line runs   *
 * up over the cabin and across. Telephone-dial wheels, Alfa red, and   *
 * a glass cover over the V6 that you can see the engine through.       *
 * ------------------------------------------------------------------ */
export function drawAlfa33(spec) {
  const ID = (n) => `hd${spec.key || "alfa33"}${n}`;
  const axF = 740, axR = 249, rF = 62, rR = 65, G = FRAME.ground;

  const BODY = `M78,176
    L78,240 Q80,264 102,270 L156,274 L179,302
    A70,108 0 0 1 319,302
    Q506,312 674,302
    A66,102 0 0 1 806,302
    L878,298 Q906,294 918,280 L922,268
    C898,240 866,206 838,190
    C812,180 776,176 740,178
    C724,174 716,172 711,172
    C692,160 664,142 635,132
    C608,124 578,127 551,128
    L470,131
    C440,133 400,134 348,136
    C310,142 274,148 238,154
    C186,162 130,170 78,176 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Alfa Romeo 33 Stradale side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff6a5c"/><stop offset="0.32" stop-color="#e02630"/><stop offset="0.72" stop-color="#8c0d18"/><stop offset="1" stop-color="#300409"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dceaf4"/><stop offset="0.4" stop-color="#42505e"/><stop offset="1" stop-color="#080c11"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f4e8cd"/><stop offset="1" stop-color="#6d5a2e"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.48"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          /* the door takes a piece of the roof with it, so it swings up and out */
          #doorArt{transform-box:fill-box;transform-origin:8% 98%;transition:transform .85s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-38deg) translate(-6px,-20px);}
          #quadExhaustArt *{fill:#c8ceD4;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="384" ry="9" fill="rgba(0,0,0,0.52)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,186 C300,172 560,180 922,258 L922,278 C560,204 300,204 78,214 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="268" width="1000" height="130" fill="rgba(0,0,0,0.32)"/>

          <!-- the daylight opening. Header 150, roof outline 128-131, and a CHROME surround —
               the only car in this garage that wears bright trim round its glass. -->
          <path d="M708,178 L636,150 L556,146 L474,149 L440,152 L410,166
                   C508,172 608,175 708,178 Z"
                fill="url(#${ID("Glass")})" stroke="#e6dcc8" stroke-width="2.2"/>
          <path d="M708,178 L638,150" stroke="#0a0e13" stroke-width="6" stroke-linecap="round"/>
          <path d="M440,152 L410,166" stroke="#0a0e13" stroke-width="6" stroke-linecap="round"/>
          <path d="M700,175 L642,156" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
          <path d="M488,138 L556,136" stroke="rgba(255,255,255,0.5)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the glass cover over the V6, which on this car you really can see through -->
          <path d="M390,142 L300,148 L272,162 L286,178 L376,166 L400,152 Z"
                fill="rgba(130,158,182,0.32)" stroke="rgba(220,236,248,0.45)" stroke-width="1.2"/>
          <g stroke="rgba(0,0,0,0.45)" stroke-width="2.4" stroke-linecap="round">
            <path d="M292,158 l88,-8"/><path d="M296,168 l84,-8"/>
          </g>

          <!-- THE DIHEDRAL DOOR. It takes a piece of the roof, so the cut runs up and across. -->
          <g id="doorArt">
            <path d="M474,131 L556,128 C588,130 614,138 638,150
                     C664,164 686,174 700,180
                     L696,286 L478,278 Z"
                  fill="rgba(255,255,255,0.035)" stroke="rgba(0,0,0,0.26)" stroke-width="1.3"/>
            <rect x="576" y="234" width="26" height="6" rx="3" fill="#7a3038"/>
          </g>
          <path d="M474,131 L478,278" stroke="rgba(0,0,0,0.24)" stroke-width="1.7"/>

          <!-- the intake, kept small: this car does not wear its cooling on the outside -->
          <path d="M432,196 L384,198 Q370,200 370,210 L370,218 Q370,228 384,228 L432,226 Z"
                fill="#05080c" stroke="rgba(255,255,255,0.22)" stroke-width="1.1"/>
          <path d="M432,196 L432,226" stroke="rgba(255,255,255,0.55)" stroke-width="2.6" stroke-linecap="round"/>
          <circle cx="326" cy="196" r="8" fill="#c8b088" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>

          <!-- ROUND lamps at both ends, under covers, the way both 33s are lit -->
          <ellipse cx="106" cy="200" rx="17" ry="12" fill="rgba(200,228,240,0.2)" stroke="#e6dcc8" stroke-width="1.4"/>
          <circle cx="100" cy="200" r="7.5" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="118" cy="201" r="5.5" fill="#e0223c" stroke="#7d1020" stroke-width="1"/>
          <ellipse cx="872" cy="228" rx="21" ry="14" fill="rgba(200,228,240,0.24)" stroke="#e6dcc8" stroke-width="1.6"/>
          <circle cx="864" cy="228" r="8.5" fill="#eef6ff" stroke="#93a6b2" stroke-width="1.1"/>
          <circle cx="884" cy="230" r="6" fill="#dfeaf2" stroke="#93a6b2" stroke-width="1"/>
        </g>

        <!-- the SCUDETTO: a shield standing proud on the nose, not a hole cut in it -->
        <g data-proud="1">
          <path d="M886,246 C872,249 864,260 864,272 C864,285 872,295 886,299
                   C898,295 904,285 904,272 C904,260 898,249 886,246 Z"
                fill="#0a0d12" stroke="#e6dcc8" stroke-width="2"/>
          <g stroke="rgba(214,224,232,0.45)" stroke-width="0.9">
            <path d="M868,260 l34,0"/><path d="M866,272 l38,0"/><path d="M868,284 l34,0"/>
          </g>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="300" width="84" height="6" rx="3" fill="#1a0d10" stroke="#e8c9c9" stroke-opacity="0.45"/></g>
      <path d="M84,272 L176,278 L172,298 L88,292 Z" fill="#0a0d11" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt"><circle cx="112" cy="252" r="8"/><circle cx="138" cy="253" r="8"/></g>

      ${wheel(axR, G - rR, rR, "telephone", "#c8b088", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "telephone", "#c8b088", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Jaguar XE SV Project 8                                              *
 *                                                                     *
 * 4,679 x 1,424 mm — THE ONLY FOUR-DOOR SALOON IN THE GARAGE, and it   *
 * has to read as one from any distance. That means three boxes, not    *
 * two: a bonnet, a cabin, and a BOOT that steps up behind the          *
 * backlight and carries the wing on its lid. Four doors, a B-pillar,   *
 * split side glass, two handles a side. Then the SV parts go on top of *
 * an ordinary saloon and that contrast is the joke: blistered arches   *
 * over standard doors, a manually adjustable wing, a splitter you set  *
 * with a spanner, quad pipes, and French Racing Blue with gold wheels. *
 * ------------------------------------------------------------------ */
export function drawProject8(spec) {
  const ID = (n) => `hd${spec.key || "project8"}${n}`;
  const axF = 762, axR = 250, rF = 62, rR = 63, G = FRAME.ground;

  const BODY = `M78,219
    L78,266 Q80,290 104,296 L168,300 L184,302
    A66,104 0 0 1 316,302
    Q520,312 697,302
    A65,102 0 0 1 827,302
    L890,299 Q912,296 920,284 L922,268
    C900,254 872,236 846,226
    C818,208 792,196 762,192
    C740,198 726,206 711,212
    C692,186 668,158 644,135
    C620,110 582,86 542,84
    L440,86
    C420,96 400,112 380,132
    C360,152 340,174 320,196
    L281,200
    L163,201
    C126,206 96,212 78,219 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Jaguar XE SV Project 8 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#79b4f6"/><stop offset="0.32" stop-color="#2f74d2"/><stop offset="0.72" stop-color="#123c82"/><stop offset="1" stop-color="#061a36"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8e8f6"/><stop offset="0.4" stop-color="#3c4e64"/><stop offset="1" stop-color="#080c14"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#fdf0cd"/><stop offset="1" stop-color="#6d5410"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.46"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.5));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:4% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-12deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#b8c0c8;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="390" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- the wing stands on the BOOT LID, which is the whole point: this is a saloon -->
      <rect x="126" y="150" width="8" height="44" fill="#111820" stroke="#4a525b"/>
      <rect x="228" y="148" width="8" height="44" fill="#111820" stroke="#4a525b"/>
      <g id="rearWingArt">
        <path d="M104,154 L258,142 L258,156 L104,168 Z" fill="#12161c" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M104,154 L258,142" stroke="#e8b23a" stroke-width="2" opacity="0.85"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,230 C300,208 560,204 922,272 L922,292 C560,232 300,242 78,254 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="272" width="1000" height="126" fill="rgba(0,0,0,0.26)"/>

          <!-- a real four-door greenhouse: two lights, a B-pillar, header 100 with painted
               roof above it, and a backlight that stops at the BOOT rather than running on -->
          <path d="M706,208 L560,100 L452,98 L352,190
                   C470,196 588,202 706,208 Z"
                fill="url(#${ID("Glass")})" stroke="#8fa2b8" stroke-width="1.4"/>
          <path d="M706,208 L562,102" stroke="#080c14" stroke-width="7" stroke-linecap="round"/>
          <path d="M452,98 L352,190" stroke="#080c14" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M517,99 L519,198" stroke="#080c14" stroke-width="9" stroke-linecap="round"/>
          <path d="M696,204 L566,110" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M466,90 L536,88" stroke="rgba(255,255,255,0.46)" stroke-width="2.4" stroke-linecap="round"/>
          <!-- the shoulder where the boot lid steps up behind the backlight: this is the
               third box, and without it a saloon reads as a fastback -->
          <path d="M320,196 L281,200 L163,201" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" stroke-linecap="round"/>

          <!-- two doors, two handles: the SV parts sit on an ordinary saloon and that is the joke -->
          <g id="doorArt">
            <path d="M519,198 L706,210 L702,290 L521,286 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="622" y="230" width="30" height="5" rx="2.5" fill="#8fa6c4"/>
          </g>
          <path d="M519,196 L521,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M706,208 L702,290" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M352,190 L356,282" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <rect x="426" y="224" width="30" height="5" rx="2.5" fill="#8fa6c4"/>

          <!-- the blistered arches: 24 mm wider than a standard XE, so they get their own line -->
          <path d="M180,236 C216,214 284,208 320,222" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M700,230 C736,206 800,202 840,218" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2.4" stroke-linecap="round"/>
          <!-- the gill behind the front arch -->
          <g stroke="rgba(0,0,0,0.5)" stroke-width="3" stroke-linecap="round">
            <path d="M688,242 l-28,4"/><path d="M690,252 l-28,4"/>
          </g>

          <path d="M84,232 L156,226" stroke="#e0223c" stroke-width="6" stroke-linecap="round"/>
          <path d="M904,258 C888,248 868,242 852,242 L854,256 C868,256 886,260 900,268 Z"
                fill="#eef6ff" stroke="#8f9aa8" stroke-width="1.1"/>

          <text x="560" y="256" text-anchor="middle" font-family="ui-sans-serif" font-size="9" fill="rgba(210,228,255,0.6)" letter-spacing="4">PROJECT 8</text>
        </g>
      </g>

      <!-- the splitter you set with a spanner, and four pipes -->
      <g id="frontFlapArt"><rect x="834" y="298" width="86" height="7" rx="3" fill="#0e1420" stroke="#e8b23a" stroke-opacity="0.6"/></g>
      <path d="M84,278 L184,284 L180,302 L88,296 Z" fill="#080c12" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt">
        <circle cx="104" cy="268" r="6"/><circle cx="122" cy="269" r="6"/>
        <circle cx="146" cy="270" r="6"/><circle cx="164" cy="271" r="6"/>
      </g>

      ${wheel(axR, G - rR, rR, "ten", "#e8b23a", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "ten", "#e8b23a", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Honda S2000 (AP1)                                                   *
 *                                                                     *
 * 4,135 x 1,285 mm on a 2,400 mm wheelbase — the SMALLEST car in the   *
 * garage, and the only ROADSTER. It is drawn with the hood UP, in      *
 * black cloth with the bows showing through it, because a fabric roof  *
 * is something nothing else here has and it says roadster instantly.   *
 * Behind the seats sit the two humps and the roll bar. The F20C is     *
 * mounted BEHIND the front axle, so the bonnet is long and the deck    *
 * is short, and the whole car sits between its wheels with almost no   *
 * overhang at either end.                                              *
 * ------------------------------------------------------------------ */
export function drawS2000(spec) {
  const ID = (n) => `hd${spec.key || "s2000"}${n}`;
  const axF = 742, axR = 253, rF = 62, rR = 64, G = FRAME.ground;

  const BODY = `M78,204
    L78,258 Q80,282 104,288 L166,292 L186,302
    A67,106 0 0 1 320,302
    Q510,312 677,302
    A65,102 0 0 1 807,302
    L876,298 Q902,294 916,282 L922,257
    C898,240 866,220 838,206
    C812,198 776,194 742,194
    C716,198 682,201 648,204
    C630,176 610,150 590,131
    C574,116 552,104 528,101
    L470,103
    C452,108 436,122 424,142
    C404,168 380,188 352,200
    C320,196 288,192 253,190
    C196,192 138,198 78,204 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Honda S2000 side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff7060"/><stop offset="0.32" stop-color="#e2342a"/><stop offset="0.72" stop-color="#9c1018"/><stop offset="1" stop-color="#3a060a"/>
        </linearGradient>
        <linearGradient id="${ID("Cloth")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#33383e"/><stop offset="0.5" stop-color="#1e2328"/><stop offset="1" stop-color="#0d1013"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e6f2"/><stop offset="0.4" stop-color="#3e4c5a"/><stop offset="1" stop-color="#080c11"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f6f9fc"/><stop offset="1" stop-color="#454e57"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.44"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:6% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-14deg) translate(-12px,-5px);}
          #quadExhaustArt *{fill:#c0c7ce;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="374" ry="9" fill="rgba(0,0,0,0.52)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.48)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,214 C300,202 560,208 922,268 L922,288 C560,228 300,232 78,242 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="272" width="1000" height="126" fill="rgba(0,0,0,0.24)"/>

          <!-- THE HOOD, UP, IN CLOTH. Nothing else in this garage has a fabric roof, and the
               bows showing through it are what tell you it is fabric and not painted steel. -->
          <path d="M648,204 C630,176 610,150 590,131
                   C574,116 552,104 528,101 L470,103
                   C452,108 436,122 424,142
                   C404,168 380,188 352,200
                   C450,203 550,204 648,204 Z"
                fill="url(#${ID("Cloth")})" stroke="#454c53" stroke-width="1.3"/>
          <g stroke="rgba(255,255,255,0.13)" stroke-width="2" fill="none">
            <path d="M524,101 C516,132 500,166 476,196"/>
            <path d="M470,103 C462,132 446,166 424,192"/>
          </g>
          <path d="M488,106 C512,104 524,106 534,110" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.6"/>

          <!-- the windscreen, in its own satin frame, which is all the glass a roadster has -->
          <path d="M646,202 L590,140 L536,124 L520,128 L568,186
                   C594,192 620,197 646,202 Z"
                fill="url(#${ID("Glass")})" stroke="#b8c2cb" stroke-width="1.8"/>
          <path d="M646,202 L592,142" stroke="#080c11" stroke-width="6" stroke-linecap="round"/>
          <path d="M638,199 L596,150" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>

          <g id="doorArt">
            <path d="M436,196 L644,206 L640,288 L440,282 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="546" y="230" width="30" height="6" rx="3" fill="#6d3634"/>
            <path d="M644,192 l22,-4 l2,13 l-22,4 Z" fill="#c8281f" stroke="rgba(255,255,255,0.4)" stroke-width="1.1"/>
          </g>
          <path d="M436,194 L440,282" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M644,204 L640,288" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <circle cx="300" cy="216" r="9" fill="#a8201c" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
          <path d="M130,222 C340,210 580,216 880,262" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="2" stroke-linecap="round"/>

          <path d="M84,214 L150,210" stroke="#e0223c" stroke-width="6" stroke-linecap="round"/>
          <path d="M902,252 C886,242 866,238 850,238 L852,252 C866,252 884,256 898,264 Z"
                fill="#0b1016" stroke="#c6d0da" stroke-width="1.3"/>
          <circle cx="868" cy="245" r="5" fill="#eef6ff"/><circle cx="884" cy="251" r="4" fill="#dfeaf4"/>

          <text x="470" y="252" text-anchor="middle" font-family="ui-sans-serif" font-size="9" fill="rgba(255,200,190,0.5)" letter-spacing="4">S2000</text>
        </g>

        <!-- no roll hoop drawn: with the hood UP it is under the fabric, and a hoop poking
             through the roof was the first thing that looked wrong here -->
      </g>

      <g id="frontFlapArt"><rect x="836" y="298" width="80" height="6" rx="3" fill="#1a1012" stroke="#ff8a7c" stroke-opacity="0.45"/></g>
      <path d="M84,276 L166,282 L162,298 L88,292 Z" fill="#0c0e12" stroke="rgba(255,255,255,0.12)"/>
      <g id="quadExhaustArt"><circle cx="112" cy="264" r="7"/><circle cx="134" cy="265" r="7"/></g>

      ${wheel(axR, G - rR, rR, "seven", "#d0d8e0", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "seven", "#d0d8e0", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Ford Mustang GTD                                                    *
 *                                                                     *
 * 4,831 x 1,331 mm on a 2,718 mm wheelbase with an 890/1,223 mm        *
 * overhang split — so the bonnet is long, the cabin sits well back and *
 * a quarter of the car is behind the rear axle. It has to read as a    *
 * MUSTANG first and a racing car second, and the thing that does that  *
 * is the TRI-BAR tail lamp: three vertical blades each side, which no  *
 * other car in this garage has and every Mustang since 1964 has had.   *
 * On top of that go the parts that make it a GTD — the gooseneck wing  *
 * hung from above rather than propped from below, the blistered arches *
 * standing proud of the doors, the duct behind the door feeding the    *
 * rear transaxle, and a splitter with dive planes on it.               *
 * ------------------------------------------------------------------ */
export function drawMustangGtd(spec) {
  const ID = (n) => `hd${spec.key || "mustanggtd"}${n}`;
  const axF = 766, axR = 292, rF = 61, rR = 62, G = FRAME.ground;

  const BODY = `M78,196
    L78,252 Q80,276 104,282 L184,286 L226,302
    A66,102 0 0 1 358,302
    Q540,312 701,302
    A65,100 0 0 1 831,302
    L892,299 Q914,296 920,284 L922,262
    C898,244 866,220 838,208
    C812,198 790,194 766,192
    C730,190 690,188 646,186
    C620,158 592,128 560,110
    C544,102 522,98 500,98
    L412,102
    C392,116 372,136 352,156
    C330,166 310,172 292,176
    C238,180 168,186 120,190
    C104,192 90,194 78,196 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Ford Mustang GTD side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#cdd4dc"/><stop offset="0.32" stop-color="#8a929b"/><stop offset="0.72" stop-color="#454d56"/><stop offset="1" stop-color="#14181d"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e6f4"/><stop offset="0.4" stop-color="#3d4b5a"/><stop offset="1" stop-color="#080c11"/></linearGradient>
        <linearGradient id="${ID("Carbon")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f25"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#e6f0ff"/><stop offset="1" stop-color="#27364c"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.46"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.07"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg) * -0.55));transition:transform .45s ease;}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:5% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-13deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#b6bec6;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="392" ry="9" fill="rgba(0,0,0,0.52)"/>

      <!-- GOOSENECK mounts: the wing hangs from ABOVE on two curved stalks instead of being
           propped up from below, so the air under the blade is never disturbed by a pylon.
           That is the detail that separates a GTD's wing from every other wing here. -->
      <g id="rearWingArt">
        <path d="M138,166 C138,146 148,140 162,140" fill="none" stroke="#4a525b" stroke-width="6"/>
        <path d="M236,160 C236,140 246,134 260,134" fill="none" stroke="#4a525b" stroke-width="6"/>
        <path d="M104,144 L272,130 L272,144 L104,158 Z" fill="#12161c" stroke="#5e6772" stroke-width="1.2"/>
        <path d="M104,144 L272,130" stroke="#2f6ad0" stroke-width="2" opacity="0.9"/>
      </g>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,206 C300,196 560,204 922,272 L922,292 C560,228 300,226 78,232 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="266" width="1000" height="134" fill="url(#${ID("Carbon")})" opacity="0.85"/>

          <!-- the greenhouse. Header 118, roof outline 98-102: painted metal above the glass. -->
          <path d="M646,182 L562,120 L424,116 L358,158
                   C454,166 550,174 646,182 Z"
                fill="url(#${ID("Glass")})" stroke="#8697a8" stroke-width="1.4"/>
          <path d="M646,182 L564,122" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M424,116 L358,158" stroke="#080c11" stroke-width="7" stroke-linecap="round"/>
          <path d="M637,179 L568,129" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
          <path d="M430,106 L494,104" stroke="rgba(255,255,255,0.48)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- the duct behind the door: the gearbox is at the BACK of this car and needs air -->
          <path d="M348,196 L292,198 Q276,200 276,212 L276,222 Q276,234 292,234 L348,232 Z"
                fill="#04070b" stroke="rgba(255,255,255,0.24)" stroke-width="1.1"/>
          <path d="M348,196 L348,232" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>

          <!-- the louvres over the front arch, and the big vent in that very long bonnet -->
          <g stroke="rgba(0,0,0,0.55)" stroke-width="3.2" stroke-linecap="round">
            <path d="M836,214 l-32,4"/><path d="M840,224 l-32,4"/><path d="M844,234 l-32,4"/>
          </g>
          <path d="M742,204 C766,198 790,196 810,197 L808,208 C788,207 766,210 744,216 Z"
                fill="#05080c" stroke="rgba(47,106,208,0.5)" stroke-width="1.2"/>

          <!-- the blistered arches: they stand proud of the doors, so they get their own line -->
          <path d="M226,222 C266,196 330,190 366,204" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M700,224 C740,200 806,196 846,210" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2.4" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M360,164 L642,190 L638,286 L364,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="520" y="222" width="30" height="6" rx="3" fill="#6a7480"/>
          </g>
          <path d="M360,162 L364,278" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M642,188 L638,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- THE TRI-BAR. Three vertical blades, and it is the only reason you can name this
               car from behind at 300 metres. Every Mustang since 1964 has had them. -->
          <g fill="#e0223c" stroke="rgba(0,0,0,0.35)" stroke-width="0.8">
            <rect x="86" y="204" width="9" height="26" rx="2"/>
            <rect x="99" y="205" width="9" height="26" rx="2"/>
            <rect x="112" y="206" width="9" height="26" rx="2"/>
          </g>
          <path d="M904,254 C888,244 866,240 850,240 L852,254 C868,254 888,258 900,266 Z"
                fill="#eef6ff" stroke="#8f9aa8" stroke-width="1.1"/>

          <text x="520" y="252" text-anchor="middle" font-family="ui-sans-serif" font-size="10" fill="rgba(200,222,255,0.6)" letter-spacing="5">GTD</text>
        </g>
      </g>

      <!-- the splitter and its dive planes, and four pipes -->
      <g id="frontFlapArt"><rect x="832" y="298" width="88" height="7" rx="3" fill="#0e1420" stroke="#2f6ad0" stroke-opacity="0.6"/></g>
      <path d="M898,268 l24,-5 l0,9 l-24,5 Z" fill="#0c1218" stroke="rgba(47,106,208,0.55)" stroke-width="1.2"/>
      <path d="M84,272 L188,278 L184,300 L88,294 Z" fill="#080b0f" stroke="rgba(255,255,255,0.14)"/>
      <g id="quadExhaustArt">
        <circle cx="106" cy="262" r="6"/><circle cx="124" cy="263" r="6"/>
        <circle cx="150" cy="264" r="6"/><circle cx="168" cy="265" r="6"/>
      </g>

      ${wheel(axR, G - rR, rR, "ten", "#8fb6ff", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "ten", "#8fb6ff", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Mazda RX-7 Spirit R (FD3S)                                          *
 *                                                                     *
 * 4,285 x 1,230 mm on a 2,425 mm wheelbase — the second-shortest car   *
 * here, and there is not a straight line anywhere on it. The FD is one *
 * continuous curve from the nose over the cabin and down into the      *
 * tail, which is exactly why it has to be drawn almost entirely in C   *
 * segments while the Lamborghini next to it is drawn in L.             *
 *                                                                     *
 * And then the one feature nothing else in this garage has: POP-UP     *
 * HEADLAMPS, drawn UP. They are the whole face of the car. Down, the   *
 * FD is a smooth blank wedge with two shut lines in the bonnet; up, it *
 * is unmistakable. Add the round tail lamps, the tiny lip on the boot, *
 * the vent behind the front arch and the Spirit R's five-spokes.       *
 * ------------------------------------------------------------------ */
export function drawRx7(spec) {
  const ID = (n) => `hd${spec.key || "rx7"}${n}`;
  const axF = 737, axR = 259, rF = 63, rR = 63, G = FRAME.ground;

  const BODY = `M78,184
    L78,246 Q80,272 104,278 L162,282 L193,302
    A66,104 0 0 1 325,302
    Q506,312 671,302
    A66,104 0 0 1 803,302
    L878,298 Q906,294 918,284 L922,272
    C900,262 866,236 838,222
    C806,208 770,196 737,192
    C706,186 672,180 640,176
    C620,152 596,124 570,104
    C556,96 536,92 517,92
    L432,98
    C404,110 372,126 340,138
    C300,148 256,156 213,162
    C176,168 140,172 108,172
    L104,158 L82,160 L78,178 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mazda RX-7 Spirit R side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#b6e6fa"/><stop offset="0.32" stop-color="#54aede"/><stop offset="0.72" stop-color="#1a6f9e"/><stop offset="1" stop-color="#07283c"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dceaf4"/><stop offset="0.4" stop-color="#41545f"/><stop offset="1" stop-color="#080e13"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f6fafd"/><stop offset="1" stop-color="#41505c"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          #doorArt{transform-box:fill-box;transform-origin:5% 96%;transition:transform .7s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-13deg) translate(-12px,-4px);}
          #quadExhaustArt *{fill:#c0c8d0;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="380" ry="9" fill="rgba(0,0,0,0.5)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,194 C300,182 560,192 922,262 L922,282 C560,216 300,214 78,222 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="272" width="1000" height="128" fill="rgba(0,0,0,0.22)"/>

          <!-- the greenhouse. Header 108, roof outline 88-90: a band of paint above the glass,
               which on an FD is barely a finger wide and still has to be there. -->
          <path d="M640,174 L562,112 L440,116 L352,152
                   C450,160 544,167 640,174 Z"
                fill="url(#${ID("Glass")})" stroke="#8ea2b0" stroke-width="1.4"/>
          <path d="M640,174 L564,114" stroke="#080e13" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M440,116 L352,152" stroke="#080e13" stroke-width="6" stroke-linecap="round"/>
          <path d="M631,171 L568,121" stroke="rgba(255,255,255,0.32)" stroke-width="3"/>
          <path d="M448,100 L508,97" stroke="rgba(255,255,255,0.5)" stroke-width="2.4" stroke-linecap="round"/>

          <g id="doorArt">
            <path d="M362,156 L636,178 L632,286 L366,278 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.2)" stroke-width="1.2"/>
            <rect x="516" y="216" width="30" height="6" rx="3" fill="#3f6f8c"/>
            <path d="M636,166 l22,-4 l2,13 l-22,4 Z" fill="#2f8ec0" stroke="rgba(255,255,255,0.4)" stroke-width="1.1"/>
          </g>
          <path d="M362,154 L366,278" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>
          <path d="M636,176 L632,286" stroke="rgba(0,0,0,0.22)" stroke-width="1.6"/>

          <!-- the vent behind the front arch, and the filler on the rear quarter -->
          <g stroke="rgba(0,0,0,0.5)" stroke-width="3" stroke-linecap="round">
            <path d="M696,206 l-26,4"/><path d="M698,216 l-26,4"/>
          </g>
          <circle cx="300" cy="200" r="9" fill="#1c7fae" stroke="rgba(255,255,255,0.35)" stroke-width="1.2"/>
          <path d="M130,200 C340,190 580,198 880,254" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="2" stroke-linecap="round"/>

          <!-- ROUND tail lamps in a dark panel, which is how an FD is lit -->
          <path d="M80,190 L164,184 L166,214 L82,220 Z" fill="#141a20" stroke="rgba(255,255,255,0.18)" stroke-width="1.1"/>
          <circle cx="100" cy="200" r="9" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="124" cy="198" r="9" fill="#e0223c" stroke="#7d1020" stroke-width="1.1"/>
          <circle cx="146" cy="197" r="6" fill="#ffb35c" stroke="#7d4a10" stroke-width="1"/>

          <text x="500" y="238" text-anchor="middle" font-family="ui-sans-serif" font-size="9" fill="rgba(220,242,255,0.5)" letter-spacing="5">RX-7</text>
        </g>

        <!-- POP-UP HEADLAMPS, UP. This is the face of the car and the last one of its kind
             sold anywhere. The lid hinges at its back edge and the lamp stands on it. -->
        <g data-proud="1">
          <path d="M772,218 L828,209 L830,234 L774,243 Z" fill="#1b232a" stroke="rgba(255,255,255,0.45)" stroke-width="1.4"/>
          <ellipse cx="802" cy="225" rx="19" ry="9" fill="#eef6ff" stroke="#8fa3b0" stroke-width="1.2"/>
          <ellipse cx="802" cy="225" rx="7" ry="4" fill="#bcd8e8"/>
          <path d="M774,243 C788,248 816,244 830,234" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="836" y="298" width="82" height="6" rx="3" fill="#0d1a22" stroke="#a8dcf4" stroke-opacity="0.5"/></g>
      <path d="M84,268 L164,274 L160,294 L88,288 Z" fill="#0a1015" stroke="rgba(255,255,255,0.12)"/>
      <!-- ONE big round pipe. A 13B has almost no back pressure and wants a straight path out. -->
      <g id="quadExhaustArt"><circle cx="118" cy="256" r="12"/></g>

      ${wheel(axR, G - rR, rR, "five", "#d8e2ea", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "five", "#d8e2ea", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Rolls-Royce Phantom VIII                                            *
 *                                                                     *
 * 5,762 x 1,646 mm on a 3,552 mm wheelbase — the longest and tallest   *
 * car in the garage by a distance, and it has to be drawn as a formal  *
 * three-box saloon rather than anything low. Three things and nothing  *
 * else identify it:                                                   *
 *                                                                     *
 *  - the PANTHEON GRILLE, which is not a hole in the nose but a        *
 *    polished temple front standing PROUD of it, taller than it is     *
 *    wide, with the Spirit of Ecstasy on the prow above it;            *
 *  - the COACH DOORS. The rear doors hinge at the BACK, so the two     *
 *    handles sit at the INNER edges of the doors and meet in the       *
 *    middle of the car — which is the opposite of every other          *
 *    four-door ever drawn, and the fastest way to tell a Phantom from  *
 *    a photograph of its side;                                        *
 *  - the WAFT LINE, one unbroken hard crease from the top of the front *
 *    wheel to the tail lamp, and a roof that is nearly level for its   *
 *    whole length because the people who matter sit under the back of  *
 *    it.                                                              *
 * ------------------------------------------------------------------ */
export function drawPhantom(spec) {
  const ID = (n) => `hd${spec.key || "phantom"}${n}`;
  const axF = 766, axR = 246, rF = 58, rR = 58, G = FRAME.ground;

  /* Straight off specs.mjs: 5,762 mm at k = 844/5762, roof peak 1,646 mm above the
     road (y 89), nose 196, boot deck 166. The bonnet is nearly level for a third of
     the car, the roof is level over the back seat, and the TAIL IS A TALL FLAT FACE
     that goes down to a bumper at y 300 — a saloon's boot, not a wedge. */
  const BODY = `M78,166
    L78,286 Q80,297 104,300 L176,303
    A70,104 0 0 1 316,303
    Q506,313 698,303
    A68,102 0 0 1 834,303
    L892,300 Q916,296 922,286
    L922,196
    C892,187 850,179 804,176
    C762,171 720,167 685,166
    C642,164 612,163 584,161
    C560,145 534,119 508,103
    C490,93 470,89 448,89
    L352,93
    C332,105 310,121 288,134
    C252,142 176,156 122,162
    C106,164 92,165 78,166 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Rolls-Royce Phantom side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f6f3ea"/><stop offset="0.3" stop-color="#e8e4d8"/><stop offset="0.72" stop-color="#8f8b80"/><stop offset="1" stop-color="#26241f"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe8ee"/><stop offset="0.4" stop-color="#3f4a52"/><stop offset="1" stop-color="#090c0f"/></linearGradient>
        <linearGradient id="${ID("Chrome")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f2e6"/><stop offset="0.45" stop-color="#c9a85f"/><stop offset="1" stop-color="#6d5a2e"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#f8f5ec"/><stop offset="1" stop-color="#4a4740"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.08"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          /* a coach door hinges at the BACK, so the pivot is the REAR-bottom corner of
             the panel and it is the LEADING edge that swings out toward you — the
             opposite of every other door in this garage */
          #doorArt{transform-box:fill-box;transform-origin:3% 96%;transition:transform 1.1s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-8deg) translate(-12px,-2px);}
          #quadExhaustArt *{fill:#cfc9b8;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="398" ry="9" fill="rgba(0,0,0,0.5)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.55)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,178 C300,172 560,182 922,232 L922,252 C560,202 300,196 78,202 Z" fill="url(#${ID("Shine")})"/>
          <!-- only the valance is dark. A Phantom is one colour from the waist to the sill. -->
          <rect x="0" y="272" width="1000" height="130" fill="rgba(20,24,30,0.55)"/>

          <!-- the greenhouse. Roof outline 89-93; the glass header is 22 px BELOW it, so a
               band of paint shows above the DLO all the way round — the roof of a Phantom
               is painted metal and the brightest thing on the flank is the chrome that
               frames the glass. -->
          <path d="M598,170 L494,112 L366,116 L318,172
                   C400,175 500,173 598,170 Z"
                fill="url(#${ID("Glass")})" stroke="url(#${ID("Chrome")})" stroke-width="2.8"/>
          <path d="M598,170 L494,112" stroke="#090c0f" stroke-width="7" stroke-linecap="round"/>
          <path d="M366,116 L318,172" stroke="#090c0f" stroke-width="7" stroke-linecap="round"/>
          <!-- the B-pillar, between the two doors: a Phantom has four side windows -->
          <path d="M431,114 L433,173" stroke="#090c0f" stroke-width="5.5"/>
          <path d="M589,168 L500,120" stroke="rgba(255,255,255,0.34)" stroke-width="3"/>
          <path d="M400,104 L470,101" stroke="rgba(255,255,255,0.5)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- THE COACH DOORS. The shut line between them, and then the two handles: the
               front door's at its REAR edge, the rear door's at its FRONT edge, both
               inboard, meeting in the middle. No other car in this garage is like this. -->
          <g id="doorArt">
            <path d="M352,170 L488,168 L486,288 L356,284 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
            <rect x="458" y="212" width="26" height="5" rx="2.5" fill="url(#${ID("Chrome")})"/>
          </g>
          <path d="M492,168 L600,172 L596,290 L490,288 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(0,0,0,0.18)" stroke-width="1.2"/>
          <rect x="496" y="212" width="26" height="5" rx="2.5" fill="url(#${ID("Chrome")})"/>
          <path d="M489,166 L488,288" stroke="rgba(0,0,0,0.3)" stroke-width="2.2"/>
          <path d="M352,168 L356,284" stroke="rgba(0,0,0,0.2)" stroke-width="1.6"/>
          <path d="M600,170 L596,290" stroke="rgba(0,0,0,0.2)" stroke-width="1.6"/>
          <!-- the boot lid's side shut line, under the deck -->
          <path d="M290,144 C232,155 152,166 82,172" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.6"/>
          <!-- and the bonnet's, which on a car with this much bonnet is a long way from it -->
          <path d="M900,193 C820,183 700,174 606,172" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/>

          <!-- THE WAFT LINE: one crease, front arch to tail lamp, unbroken -->
          <path d="M818,202 C620,197 380,201 116,206" fill="none" stroke="rgba(255,255,255,0.42)" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M818,205 C620,200 380,204 116,209" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.6"/>
          <!-- the coachline: one hand-painted stripe, the length of the car -->
          <path d="M846,238 C620,232 380,236 96,240" fill="none" stroke="#c9a85f" stroke-width="1.8" opacity="0.85"/>

          <!-- a single slim lamp at each end, set high, with a chrome underline -->
          <path d="M84,196 L154,193 L154,214 L84,217 Z" fill="#8c1622" stroke="rgba(255,255,255,0.25)" stroke-width="1.1"/>
          <path d="M88,200 L148,198" stroke="#ff5568" stroke-width="4" stroke-linecap="round"/>
          <path d="M84,224 L160,221" stroke="url(#${ID("Chrome")})" stroke-width="3" stroke-linecap="round"/>
          <path d="M856,198 L910,196 L912,228 L858,230 Z" fill="rgba(13,16,20,0.72)"/>
          <path d="M904,206 L864,204" stroke="#f4f8fc" stroke-width="7" stroke-linecap="round"/>
          <path d="M906,220 L860,218" stroke="url(#${ID("Chrome")})" stroke-width="3" stroke-linecap="round"/>
          <!-- the chrome garnish on the front wing, behind the wheel -->
          <path d="M666,214 L714,211 L716,221 L668,224 Z" fill="url(#${ID("Chrome")})" opacity="0.9"/>
          <circle cx="304" cy="182" r="8" fill="#b8b2a4" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
        </g>

        <!-- THE PANTHEON GRILLE, standing PROUD of the nose, and the Spirit of Ecstasy on
             the prow above it. This is drawn outside the body clip on purpose: the grille
             is a separate polished object bolted to the front of the car, not a hole. -->
        <g data-proud="1">
          <path d="M884,198 L924,193 L924,266 L884,262 Z" fill="#0d1014" stroke="url(#${ID("Chrome")})" stroke-width="3"/>
          <g stroke="rgba(230,222,200,0.55)" stroke-width="1.3">
            <path d="M890,204 l30,-3"/><path d="M890,214 l30,-3"/><path d="M890,224 l30,-3"/>
            <path d="M890,234 l30,-3"/><path d="M890,244 l30,-3"/><path d="M890,254 l30,-3"/>
          </g>
          <path d="M882,193 L926,188 L926,197 L882,202 Z" fill="url(#${ID("Chrome")})"/>
          <!-- the Spirit of Ecstasy: a figure leaning forward with her sleeves swept back -->
          <path d="M898,190 C900,180 904,175 909,172 C905,179 904,184 904,190 Z" fill="url(#${ID("Chrome")})"/>
          <path d="M903,178 C896,177 889,180 885,185 C892,182 898,182 904,183 Z" fill="url(#${ID("Chrome")})"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="836" y="296" width="82" height="6" rx="3" fill="#1a1c20" stroke="#c9a85f" stroke-opacity="0.45"/></g>
      <path d="M84,286 L184,290 L182,300 L86,296 Z" fill="#131518" stroke="rgba(255,255,255,0.12)"/>
      <!-- two rectangular pipes, flush in the valance, because they are not a feature -->
      <g id="quadExhaustArt">
        <rect x="104" y="276" width="26" height="8" rx="3"/><rect x="140" y="277" width="26" height="8" rx="3"/>
      </g>

      ${wheel(axR, G - rR, rR, "dish", "#d8d2c4", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#d8d2c4", ID("Hub"))}
    </svg>`;
}

/* ------------------------------------------------------------------ *
 * Rolls-Royce Spectre Black Badge                                     *
 *                                                                     *
 * 5,453 x 1,559 mm on a 3,210 mm wheelbase and 2,975 kg — a TWO-DOOR   *
 * fastback, which is the whole difference from the Phantom beside it.  *
 * There is one door each side and it is enormous: 1.5 metres of coach  *
 * door, the largest fitted to a modern car, hinged at the back like    *
 * the Phantom's rear doors and taking the entire cabin side with it.   *
 * So the flank has exactly ONE shut line on it, and a car with one     *
 * shut line reads as a coupe from any distance.                        *
 *                                                                     *
 * Black Badge darkens everything that is normally bright: the Pantheon *
 * grille, the surrounds and the Spirit of Ecstasy all go to a smoked   *
 * chrome instead of polished. It is an EV, so there are no pipes at    *
 * all — and the split headlamps and the illuminated grille are the     *
 * two things that say Spectre rather than Phantom at the front.        *
 * ------------------------------------------------------------------ */
export function drawSpectre(spec) {
  const ID = (n) => `hd${spec.key || "spectre"}${n}`;
  const axF = 760, axR = 263, rF = 61, rR = 61, G = FRAME.ground;

  /* 5,453 mm at k = 844/5453. The roofline out of specs.mjs is the whole difference
     from the Phantom: the peak is at 449 and from there the outline FALLS CONTINUOUSLY
     to the tail — 108 at the C-pillar, 142 over the rear axle, 180 at the boot. There
     is no separate deck, because a Spectre is a fastback. */
  const BODY = `M78,180
    L78,282 Q80,294 104,297 L193,302
    A70,106 0 0 1 333,302
    Q506,312 692,302
    A68,102 0 0 1 828,302
    L890,300 Q914,296 922,286
    L922,209
    C890,199 856,191 821,185
    C786,178 750,172 719,168
    C684,163 650,158 620,155
    C596,140 570,118 540,106
    C512,95 484,90 460,89
    L404,92
    C376,100 350,110 320,124
    C282,140 244,152 210,160
    C170,169 120,176 96,179
    C90,180 84,180 78,180 Z`;

  return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Rolls-Royce Spectre Black Badge side">
      <defs>
        <linearGradient id="${ID("Paint")}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6c757f"/><stop offset="0.34" stop-color="#333941"/><stop offset="0.74" stop-color="#171b20"/><stop offset="1" stop-color="#06080a"/>
        </linearGradient>
        <linearGradient id="${ID("Glass")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8d6e0"/><stop offset="0.4" stop-color="#2f3840"/><stop offset="1" stop-color="#06080b"/></linearGradient>
        <linearGradient id="${ID("Chrome")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a9384"/><stop offset="0.45" stop-color="#6b6355"/><stop offset="1" stop-color="#2a2721"/></linearGradient>
        <radialGradient id="${ID("Hub")}" cx="42%" cy="38%" r="62%"><stop offset="0" stop-color="#8c949e"/><stop offset="1" stop-color="#1b1f24"/></radialGradient>
        <linearGradient id="${ID("Shine")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
        <filter id="${ID("Glow")}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="${ID("Clip")}"><path d="${BODY}"/></clipPath>
        <style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg));}
          #frontFlapArt{transform-box:fill-box;transform-origin:100% 50%;transform:rotate(var(--flap-deg,0deg));transition:transform .35s ease;}
          /* 1.5 metres of coach door, hinged at the BACK: the pivot is the rear-bottom
             corner, it swings slowly, it swings the other way, and the whole side of
             the cabin goes with it */
          #doorArt{transform-box:fill-box;transform-origin:3% 96%;transition:transform 1.3s cubic-bezier(.2,.9,.2,1);}
          #doorArt.open{transform:rotate(-10deg) translate(-16px,-3px);}
          #quadExhaustArt *{fill:#8c949e;} #quadExhaustArt.hot *{fill:#ff8a3c;filter:url(#${ID("Glow")});}</style>
      </defs>

      <ellipse cx="500" cy="${G + 6}" rx="394" ry="9" fill="rgba(0,0,0,0.55)"/>

      <g id="bcBody">
        <path d="${BODY}" fill="url(#${ID("Paint")})" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>

        <g clip-path="url(#${ID("Clip")})">
          <path d="M78,192 C300,186 560,196 922,244 L922,264 C560,214 300,208 78,216 Z" fill="url(#${ID("Shine")})"/>
          <rect x="0" y="270" width="1000" height="130" fill="rgba(6,8,10,0.5)"/>

          <!-- the greenhouse: a fastback, so the glass runs BACK past the door and dies
               in a very wide C-pillar rather than stopping at a boot. Header 22 px under
               the roof outline, so the roof shows as paint. -->
          <path d="M620,166 L510,116 L398,121 L318,178
                   C420,181 520,174 620,166 Z"
                fill="url(#${ID("Glass")})" stroke="url(#${ID("Chrome")})" stroke-width="2.6"/>
          <path d="M620,166 L510,116" stroke="#06080b" stroke-width="7" stroke-linecap="round"/>
          <path d="M398,121 L318,178" stroke="#06080b" stroke-width="7" stroke-linecap="round"/>
          <!-- the door glass ends here and a small fixed quarter light carries on: the
               only division in the side glass, because there is no B-pillar on a coupe -->
          <path d="M392,121 L388,177" stroke="#06080b" stroke-width="4"/>
          <path d="M611,164 L516,125" stroke="rgba(255,255,255,0.26)" stroke-width="3"/>
          <path d="M420,108 L492,104" stroke="rgba(255,255,255,0.36)" stroke-width="2.4" stroke-linecap="round"/>

          <!-- ONE shut line. That is the entire flank of a Spectre. -->
          <g id="doorArt">
            <path d="M388,176 L622,168 L618,290 L392,286 Z" fill="rgba(255,255,255,0.025)" stroke="rgba(0,0,0,0.22)" stroke-width="1.3"/>
            <rect x="584" y="212" width="28" height="5" rx="2.5" fill="url(#${ID("Chrome")})"/>
          </g>
          <path d="M388,174 L392,286" stroke="rgba(0,0,0,0.26)" stroke-width="1.8"/>
          <path d="M622,166 L618,290" stroke="rgba(0,0,0,0.26)" stroke-width="1.8"/>

          <path d="M812,206 C620,200 380,206 116,214" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M840,242 C620,236 380,242 96,250" fill="none" stroke="#c9a85f" stroke-width="1.6" opacity="0.6"/>
          <!-- the charge flap, on the rear quarter where a fuel filler would be -->
          <path d="M240,196 l26,-3 l2,17 l-26,3 Z" fill="#0d1216" stroke="rgba(201,168,95,0.55)" stroke-width="1.2"/>

          <path d="M84,206 L152,201 L153,220 L85,225 Z" fill="#7d1420" stroke="rgba(255,255,255,0.2)" stroke-width="1.1"/>
          <path d="M88,210 L147,206" stroke="#ff5568" stroke-width="4" stroke-linecap="round"/>
          <!-- SPLIT headlamps: a thin daylight blade above, the main lamp below, both sunk
               into a dark housing that wraps onto the wing -->
          <path d="M858,208 L912,206 L914,240 L860,242 Z" fill="rgba(6,8,11,0.75)"/>
          <path d="M908,214 L864,212" stroke="#e6eef6" stroke-width="4" stroke-linecap="round"/>
          <path d="M906,232 L872,230" stroke="#f4f8fc" stroke-width="8" stroke-linecap="round"/>

          <!-- Black Badge's own mark: the Double-R roundel, inverted to black on black,
               where the boot badge would be on a car that had a boot -->
          <circle cx="285" cy="168" r="9" fill="#0a0d10" stroke="rgba(154,147,132,0.8)" stroke-width="1.3"/>
          <text x="285" y="172" text-anchor="middle" font-family="ui-serif,Georgia,serif" font-size="9" fill="rgba(154,147,132,0.9)">RR</text>
        </g>

        <!-- the Pantheon grille again, but SMOKED — and lit from within, which the Phantom's
             is not. Black Badge darkens every bright part on the car, including her. -->
        <g data-proud="1">
          <path d="M886,210 L924,205 L924,272 L886,268 Z" fill="#0a0d10" stroke="url(#${ID("Chrome")})" stroke-width="3"/>
          <g stroke="rgba(201,168,95,0.55)" stroke-width="1.4">
            <path d="M892,216 l28,-3"/><path d="M892,226 l28,-3"/><path d="M892,236 l28,-3"/>
            <path d="M892,246 l28,-3"/><path d="M892,256 l28,-3"/>
          </g>
          <path d="M884,205 L926,200 L926,209 L884,214 Z" fill="url(#${ID("Chrome")})"/>
          <path d="M900,202 C902,193 906,188 911,185 C907,192 906,197 906,202 Z" fill="url(#${ID("Chrome")})"/>
          <path d="M905,191 C898,190 891,193 887,198 C894,195 900,195 906,196 Z" fill="url(#${ID("Chrome")})"/>
        </g>
      </g>

      <g id="frontFlapArt"><rect x="834" y="296" width="84" height="6" rx="3" fill="#0d1014" stroke="#c9a85f" stroke-opacity="0.4"/></g>
      <path d="M84,284 L178,288 L176,298 L86,294 Z" fill="#0a0d10" stroke="rgba(255,255,255,0.1)"/>
      <!-- there is no exhaust on a Spectre. The group stays so the sim's ref still binds. -->
      <g id="quadExhaustArt"></g>

      ${wheel(axR, G - rR, rR, "dish", "#3a3f46", ID("Hub"))}
      ${wheel(axF, G - rF, rF, "dish", "#3a3f46", ID("Hub"))}
    </svg>`;
}
