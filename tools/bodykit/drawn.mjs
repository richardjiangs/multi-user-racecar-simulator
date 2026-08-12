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
