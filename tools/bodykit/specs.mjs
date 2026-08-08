// specs.mjs — every road car's REAL dimensions and its own roofline.
//
// The numbers are the published ones. The roofline is [xFromFront, yFromRoofPeak] as fractions
// of length and height, front to back — it is the one thing that makes a car look like itself,
// so it is written per car from that car's actual side view, not copied from a neighbour.
//
// paint[] is the car's own launch colour, dark to light; accent is the trim that goes with it.

export const SPECS = {
  /* ---------------- the hypercars ---------------- */
  bugatti: {
    name: "Bugatti Chiron Super Sport 300+",
    lengthMm: 4994, wheelbaseMm: 2711, heightMm: 1212, frontOverhangMm: 1020, rearOverhangMm: 1263,
    wheelDiaFrontMm: 700, wheelDiaRearMm: 745, sillMm: 115,
    paint: ["#5b9ae8", "#173f7e", "#061932"], accent: "#9cc6ff",
    roof: [[0.00, 0.34], [0.10, 0.26], [0.21, 0.22], [0.32, 0.19], [0.40, 0.11], 
           [0.49, 0.03], [0.58, 0.07], [0.68, 0.24], [0.80, 0.40], [0.90, 0.48], 
           [1.00, 0.54]],
    glass: { span: [0.34, 0.70], base: 0.34, inset: 0.03, pillars: [0.34], rake: 9, pillarW: 6 },
    doors: [0.34, 0.54], doorSwing: -18, creaseY: 0.44, archLift: 1.08, flareMm: 20, endLift: 0.26,
    headlamp: "strip", lampY: 0.36, rim: "turbine", badge: "300+", badgeX: 0.48,
    exhaust: { kind: "quad", n: 4 },
    // the C-line: the arc that separates the door from the rear haunch on every modern Bugatti
    extra: (P, f) => `<path d="M${f(P.xAt(0.40))},${f(P.yAt(0.30))} q-30,26 -6,58 l-20,3 q-24,-34 6,-64 Z" fill="#0a0e14" stroke="rgba(156,198,255,0.6)" stroke-width="1.6"/>`,
  },
  pagani: {
    name: "Pagani Huayra BC",
    lengthMm: 4605, wheelbaseMm: 2795, heightMm: 1169, frontOverhangMm: 940, rearOverhangMm: 870,
    wheelDiaFrontMm: 686, wheelDiaRearMm: 735, sillMm: 95,
    paint: ["#7fe6dc", "#1d8f92", "#08343a"], accent: "#8ff0e4",
    roof: [[0.00, 0.70], [0.06, 0.40], [0.13, 0.26], [0.22, 0.22], [0.31, 0.19], 
           [0.39, 0.04], [0.47, 0.02], [0.56, 0.12], [0.68, 0.34], [0.84, 0.46], 
           [1.00, 0.52]],
    glass: { span: [0.31, 0.60], base: 0.32, inset: 0.03, pillars: [0.32], rake: 8, pillarW: 5 },
    doors: [0.32, 0.52], doorSwing: -32, creaseY: 0.44, archLift: 1.12, flareMm: 26, endLift: 0.30,
    headlamp: "round", lampY: 0.38, rim: "five", badge: "", exhaust: { kind: "quad", n: 4 },
    // the four titanium pipes are grouped in the centre, and there is a big side scoop
    extra: (P, f) => `<path d="M${f(P.xAt(0.55))},${f(P.yAt(0.34))} q26,-6 40,4 l-4,22 q-18,-8 -38,-4 Z" fill="#08181c" stroke="rgba(143,240,228,0.6)" stroke-width="1.4"/>`,
  },
  mclaren: {
    name: "McLaren Speedtail",
    lengthMm: 5137, wheelbaseMm: 2720, heightMm: 1120, frontOverhangMm: 1010, rearOverhangMm: 1407,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 730, sillMm: 100,
    paint: ["#d8dee6", "#8b97a4", "#2a3138"], accent: "#c9d6e4",
    // a teardrop: the tail is a quarter of the car and it never stops falling
    roof: [[0.00, 0.66], [0.08, 0.46], [0.16, 0.26], [0.24, 0.10], [0.31, 0.02], 
           [0.40, 0.08], [0.52, 0.18], [0.65, 0.28], [0.79, 0.38], [0.90, 0.44], 
           [1.00, 0.50]],
    glass: { span: [0.28, 0.58], base: 0.30, inset: 0.02, pillars: [], rake: 0, pillarW: 0 },
    doors: [0.30, 0.50], doorSwing: -26, creaseY: 0.42, archLift: 1.06, flareMm: 10, endLift: 0.34,
    headlamp: "strip", lampY: 0.34, rim: "dish", badge: "", exhaust: { kind: "twin", n: 2 },
    mirror: false,               // it has cameras, not mirrors
    extra: (P, f) => `<path d="M${f(P.axFront - P.rF * 1.1)},${f(P.sillY - 26)} l-26,-4 l0,16 l26,4 Z" fill="#0b0f14" stroke="rgba(201,214,228,0.45)"/>`,
  },
  ferrari: {
    name: "Ferrari F80",
    lengthMm: 4840, wheelbaseMm: 2665, heightMm: 1138, frontOverhangMm: 1030, rearOverhangMm: 1145,
    wheelDiaFrontMm: 680, wheelDiaRearMm: 730, sillMm: 88,
    paint: ["#e8402c", "#a5101c", "#3d0409"], accent: "#ffd24a",
    roof: [[0.00, 0.86], [0.13, 0.64], [0.26, 0.46], [0.36, 0.30], [0.43, 0.10], 
           [0.51, 0.01], [0.59, 0.08], [0.68, 0.28], [0.82, 0.40], [1.00, 0.48]],
    glass: { span: [0.31, 0.58], base: 0.30, inset: 0.02, pillars: [0.32], rake: 7, pillarW: 5 },
    doors: [0.32, 0.51], doorSwing: -30, creaseY: 0.42, archLift: 1.14, flareMm: 24, endLift: 0.32,
    headlamp: "strip", lampY: 0.34, rim: "five", badge: "F80", badgeX: 0.46,
    exhaust: { kind: "twin", n: 2 },
    wing: { x: 0.90, y: 0.16, w: 0.20, drop: 0.22 },
    extra: (P, f) => `<path d="M${f(P.xAt(0.20))},${f(P.yAt(0.28))} l34,-8 l6,16 l-36,8 Z" fill="#0a0d11" stroke="rgba(255,210,74,0.5)"/>`,
  },
  koenigsegg: {
    name: "Koenigsegg Jesko",
    lengthMm: 4610, wheelbaseMm: 2700, heightMm: 1210, frontOverhangMm: 980, rearOverhangMm: 930,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 740, sillMm: 92,
    paint: ["#f2f4f7", "#9aa5b3", "#2b323b"], accent: "#8fd4ff",
    roof: [[0.00, 0.60], [0.11, 0.50], [0.22, 0.39], [0.33, 0.27], [0.41, 0.14], 
           [0.50, 0.04], [0.60, 0.06], [0.72, 0.14], [0.86, 0.20], [1.00, 0.28]],
    glass: { span: [0.31, 0.60], base: 0.30, inset: 0.02, pillars: [0.32], rake: 8, pillarW: 5 },
    doors: [0.32, 0.52], doorSwing: -36, creaseY: 0.44, archLift: 1.12, flareMm: 22, endLift: 0.30,
    headlamp: "strip", lampY: 0.36, rim: "dish", badge: "", exhaust: { kind: "single", n: 1 },
    wing: { x: 0.88, y: 0.06, w: 0.26, drop: 0.34 },
    // The Jesko is TWO cars from the windscreen back. Y swaps the Attack's boomerang wing and
    // its twin pylons for the Absolut's two deck fins, 85 mm of extra tail and the aero wheel
    // covers — real geometry, hidden or shown by applyBodyArt, not a label.
    extra: (P, f) => `<g id="kgWingPylons">
        <rect x="${f(P.xAt(0.86))}" y="${f(P.yAt(0.10))}" width="6" height="${f(P.bodyH * 0.30)}" fill="#141920" stroke="#4a525b"/>
        <rect x="${f(P.xAt(0.94))}" y="${f(P.yAt(0.12))}" width="6" height="${f(P.bodyH * 0.28)}" fill="#141920" stroke="#4a525b"/>
      </g>
      <g id="kgAbsolutFins" style="display:none">
        <path d="M${f(P.xAt(0.60))},${f(P.yAt(0.18))} L${f(P.xAt(0.90))},${f(P.yAt(0.30))} L${f(P.xAt(0.90))},${f(P.yAt(0.38))} L${f(P.xAt(0.60))},${f(P.yAt(0.26))} Z" fill="#1a2028" stroke="rgba(143,212,255,0.6)" stroke-width="1.4"/>
        <path d="M${f(P.xAt(0.64))},${f(P.yAt(0.22))} L${f(P.xAt(0.92))},${f(P.yAt(0.33))} L${f(P.xAt(0.92))},${f(P.yAt(0.40))} L${f(P.xAt(0.64))},${f(P.yAt(0.30))} Z" fill="#141a22" stroke="rgba(143,212,255,0.4)" stroke-width="1.2"/>
      </g>
      <g id="kgAbsolutTail" style="display:none">
        <path d="M${f(P.xAt(1.0))},${f(P.yAt(0.42))} l-24,2 l0,${f(P.bodyH * 0.20)} l24,-3 Z" fill="url(#${"bk"}koenigseggPaint)" stroke="rgba(255,255,255,0.35)"/>
      </g>
      <g id="kgWheelCovers" style="display:none">
        <circle cx="${f(P.axRear)}" cy="${f(P.cyR)}" r="${f(P.rR * 0.66)}" fill="#c9d2dc" opacity="0.9"/>
        <circle cx="${f(P.axFront)}" cy="${f(P.cyF)}" r="${f(P.rF * 0.66)}" fill="#c9d2dc" opacity="0.9"/>
      </g>`,
  },
  venom: {
    name: "Hennessey Venom F5",
    lengthMm: 4666, wheelbaseMm: 2807, heightMm: 1130, frontOverhangMm: 940, rearOverhangMm: 919,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 740, sillMm: 92,
    paint: ["#4fa3f0", "#1a5fb4", "#082444"], accent: "#9fc8ff",
    roof: [[0.00, 0.62], [0.14, 0.54], [0.28, 0.46], [0.40, 0.34], [0.48, 0.14], 
           [0.56, 0.02], [0.64, 0.12], [0.75, 0.32], [0.88, 0.44], [1.00, 0.52]],
    glass: { span: [0.31, 0.60], base: 0.30, inset: 0.02, pillars: [0.32], rake: 8, pillarW: 5 },
    doors: [0.32, 0.52], doorSwing: -28, creaseY: 0.42, archLift: 1.10, flareMm: 20, endLift: 0.30,
    headlamp: "strip", lampY: 0.34, rim: "five", badge: "F5", badgeX: 0.46, exhaust: { kind: "twin", n: 2 },
  },
  amgone: {
    name: "Mercedes-AMG One",
    lengthMm: 4800, wheelbaseMm: 2720, heightMm: 1160, frontOverhangMm: 1030, rearOverhangMm: 1050,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 730, sillMm: 90,
    paint: ["#cfd6dd", "#69737e", "#20262d"], accent: "#00d2be",
    roof: [[0.00, 0.78], [0.06, 0.56], [0.12, 0.34], [0.19, 0.16], [0.25, 0.04], 
           [0.32, 0.01], [0.43, 0.14], [0.58, 0.26], [0.75, 0.30], [0.88, 0.32], 
           [1.00, 0.34]],
    glass: { span: [0.31, 0.58], base: 0.30, inset: 0.02, pillars: [0.32], rake: 7, pillarW: 5 },
    doors: [0.32, 0.51], doorSwing: -30, creaseY: 0.42, archLift: 1.12, flareMm: 22, endLift: 0.30,
    headlamp: "strip", lampY: 0.34, rim: "dish", badge: "", exhaust: { kind: "single", n: 1 },
    wing: { x: 0.88, y: 0.08, w: 0.24, drop: 0.30 },
    // the roof scoop that feeds the F1 engine, and the shark fin behind it
    extra: (P, f) => `<path d="M${f(P.xAt(0.46))},${f(P.yAt(0.04))} l-16,-9 l-16,9 Z" fill="#0c1116" stroke="rgba(0,210,190,0.6)"/>
      <path d="M${f(P.xAt(0.60))},${f(P.yAt(0.16))} L${f(P.xAt(0.80))},${f(P.yAt(0.26))} L${f(P.xAt(0.80))},${f(P.yAt(0.32))} L${f(P.xAt(0.60))},${f(P.yAt(0.24))} Z" fill="#141a20" stroke="rgba(0,210,190,0.4)"/>`,
  },
  p1: {
    name: "McLaren P1",
    lengthMm: 4588, wheelbaseMm: 2670, heightMm: 1188, frontOverhangMm: 990, rearOverhangMm: 928,
    wheelDiaFrontMm: 675, wheelDiaRearMm: 725, sillMm: 95,
    paint: ["#ffb03a", "#d9600c", "#4a1c04"], accent: "#ffcf7a",
    roof: [[0.00, 0.72], [0.07, 0.46], [0.15, 0.28], [0.23, 0.16], [0.30, 0.06], 
           [0.40, 0.02], [0.52, 0.10], [0.64, 0.34], [0.80, 0.46], [1.00, 0.54]],
    glass: { span: [0.31, 0.60], base: 0.30, inset: 0.02, pillars: [0.32], rake: 8, pillarW: 5 },
    doors: [0.32, 0.52], doorSwing: -34, creaseY: 0.42, archLift: 1.12, flareMm: 22, endLift: 0.30,
    headlamp: "strip", lampY: 0.34, rim: "five", badge: "", exhaust: { kind: "single", n: 1 },
    wing: { x: 0.88, y: 0.10, w: 0.22, drop: 0.26 },
  },
  zr1: {
    name: "Chevrolet Corvette ZR1",
    lengthMm: 4630, wheelbaseMm: 2723, heightMm: 1234, frontOverhangMm: 900, rearOverhangMm: 1007,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 740, sillMm: 105,
    paint: ["#ffe14a", "#e0a200", "#4a3200"], accent: "#f2c200",
    roof: [[0.00, 0.50], [0.09, 0.42], [0.19, 0.36], [0.27, 0.29], [0.33, 0.11], 
           [0.41, 0.04], [0.52, 0.07], [0.66, 0.11], [0.80, 0.16], [0.92, 0.22], 
           [1.00, 0.30]],
    glass: { span: [0.31, 0.62], base: 0.30, inset: 0.02, pillars: [0.33], rake: 8, pillarW: 5 },
    doors: [0.33, 0.53], creaseY: 0.42, archLift: 1.10, flareMm: 22, endLift: 0.28,
    headlamp: "strip", lampY: 0.34, rim: "five", badge: "ZR1", badgeX: 0.46, exhaust: { kind: "quad", n: 4 },
    wing: { x: 0.90, y: 0.10, w: 0.22, drop: 0.26 },
  },
  evija: {
    name: "Lotus Evija",
    lengthMm: 4459, wheelbaseMm: 2700, heightMm: 1122, frontOverhangMm: 880, rearOverhangMm: 879,
    wheelDiaFrontMm: 680, wheelDiaRearMm: 730, sillMm: 92,
    paint: ["#d6f03c", "#84a800", "#232f04"], accent: "#b6d900",
    roof: [[0.00, 0.54], [0.07, 0.50], [0.15, 0.54], [0.24, 0.40], [0.32, 0.16], 
           [0.40, 0.02], [0.50, 0.08], [0.62, 0.22], [0.77, 0.30], [1.00, 0.34]],
    glass: { span: [0.31, 0.60], base: 0.30, inset: 0.02, pillars: [0.32], rake: 7, pillarW: 5 },
    doors: [0.32, 0.52], doorSwing: -32, creaseY: 0.42, archLift: 1.12, flareMm: 22, endLift: 0.32,
    headlamp: "strip", lampY: 0.34, rim: "dish", badge: "", exhaust: { kind: "none" },
    // the Venturi tunnels that go straight through the back of the car
    extra: (P, f) => `<ellipse cx="${f(P.xAt(0.84))}" cy="${f(P.yAt(0.34))}" rx="22" ry="13" fill="#05080b" stroke="rgba(182,217,0,0.65)" stroke-width="1.6"/>`,
  },
  nevera: {
    name: "Rimac Nevera",
    lengthMm: 4750, wheelbaseMm: 2745, heightMm: 1208, frontOverhangMm: 990, rearOverhangMm: 1015,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 740, sillMm: 100,
    paint: ["#4fd8e8", "#137f96", "#062a36"], accent: "#5fd0ea",
    roof: [[0.00, 0.70], [0.10, 0.58], [0.20, 0.48], [0.30, 0.38], [0.38, 0.20], 
           [0.47, 0.06], [0.57, 0.04], [0.68, 0.16], [0.82, 0.34], [1.00, 0.46]],
    glass: { span: [0.31, 0.62], base: 0.30, inset: 0.02, pillars: [0.33], rake: 8, pillarW: 5 },
    doors: [0.33, 0.53], doorSwing: -24, creaseY: 0.42, archLift: 1.10, flareMm: 20, endLift: 0.30,
    headlamp: "strip", lampY: 0.34, rim: "dish", badge: "", exhaust: { kind: "none" },
  },
  tuatara: {
    name: "SSC Tuatara",
    lengthMm: 4670, wheelbaseMm: 2705, heightMm: 1092, frontOverhangMm: 1000, rearOverhangMm: 965,
    wheelDiaFrontMm: 680, wheelDiaRearMm: 740, sillMm: 88,
    paint: ["#e6e9ee", "#8c95a1", "#252b33"], accent: "#c8102e",
    // Cd 0.279: the whole car is one falling line and the tail is a long taper
    roof: [[0.00, 0.50], [0.12, 0.37], [0.24, 0.24], [0.35, 0.13], [0.45, 0.04], 
           [0.55, 0.08], [0.66, 0.20], [0.78, 0.34], [0.90, 0.46], [1.00, 0.56]],
    glass: { span: [0.31, 0.62], base: 0.28, inset: 0.02, pillars: [0.33], rake: 7, pillarW: 5 },
    doors: [0.33, 0.53], doorSwing: -30, creaseY: 0.42, archLift: 1.10, flareMm: 18, endLift: 0.34,
    headlamp: "strip", lampY: 0.32, rim: "dish", badge: "TUATARA", badgeX: 0.48, exhaust: { kind: "twin", n: 2 },
  },

  aston: {
    name: "Aston Martin Valkyrie",
    lengthMm: 4530, wheelbaseMm: 2740, heightMm: 1100, frontOverhangMm: 1000, rearOverhangMm: 790,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 730, sillMm: 78,
    paint: ["#8fe04a", "#2f7a24", "#0c2810"], accent: "#b6ff5c",
    // a Le Mans prototype with a numberplate: teardrop canopy, and the body cut away underneath
    roof: [[0.00, 0.86], [0.11, 0.64], [0.22, 0.44], [0.31, 0.22], [0.39, 0.06], 
           [0.47, 0.01], [0.55, 0.12], [0.65, 0.36], [0.80, 0.46], [1.00, 0.52]],
    glass: { span: [0.34, 0.56], base: 0.26, inset: 0.02, pillars: [], rake: 0, pillarW: 0 },
    doors: [0.32, 0.52], doorSwing: -40, creaseY: 0.44, archLift: 1.16, flareMm: 26, endLift: 0.40,
    headlamp: "strip", lampY: 0.40, rim: "dish", badge: "", exhaust: { kind: "single", n: 1 },
    wing: { x: 0.90, y: 0.06, w: 0.26, drop: 0.34 },
    // the venturi tunnels that the whole car is built around
    extra: (P, f) => `<path d="M${f(P.xAt(0.62))},${f(P.sillY - 6)} l${f(P.drawL * 0.18)},2 l-12,18 l-${f(P.drawL * 0.18)},-2 Z" fill="#07100a" stroke="rgba(182,255,92,0.45)"/>`,
  },
  revuelto: {
    name: "Lamborghini Revuelto",
    lengthMm: 4947, wheelbaseMm: 2779, heightMm: 1160, frontOverhangMm: 1010, rearOverhangMm: 1158,
    wheelDiaFrontMm: 693, wheelDiaRearMm: 740, sillMm: 105,
    paint: ["#ff9a3c", "#e2560f", "#5a1b04"], accent: "#ffb35c",
    // cab-forward: the screen starts a third of the way back and the tail runs on and on
    roof: [[0.00, 0.76], [0.06, 0.66], [0.15, 0.56], [0.24, 0.46], [0.30, 0.24], 
           [0.36, 0.04], [0.44, 0.08], [0.53, 0.22], [0.66, 0.28], [0.83, 0.32], 
           [1.00, 0.38]],
    glass: { span: [0.31, 0.63], base: 0.38, inset: 0.03, pillars: [0.32], rake: 9, pillarW: 6 },
    doors: [0.32, 0.52], doorSwing: -36, creaseY: 0.48, archLift: 1.10, flareMm: 18, endLift: 0.28,
    headlamp: "strip", lampY: 0.38, rim: "ten", badge: "REVUELTO", badgeX: 0.46,
    exhaust: { kind: "stack" },
    wing: { x: 0.88, y: 0.20, w: 0.20, drop: 0.22 },
    // the Y-shaped intake in the rear quarter, and the hexagonal engine cover glass
    extra: (P, f) => `<path d="M${f(P.xAt(0.60))},${f(P.yAt(0.32))} l${f(P.drawL * 0.06)},-6 l5,24 l-${f(P.drawL * 0.06)},7 Z" fill="#0a0d11" stroke="rgba(255,180,90,0.55)"/>`,
  },
  /* ---------------- the classics ---------------- */
  gto: {
    name: "Ferrari 250 GTO",
    lengthMm: 4325, wheelbaseMm: 2400, heightMm: 1210, frontOverhangMm: 985, rearOverhangMm: 940,
    wheelDiaFrontMm: 640, wheelDiaRearMm: 640, sillMm: 130,
    paint: ["#e8382c", "#b81420", "#4d060c"], accent: "#ffd24a",
    roof: [[0.00, 0.56], [0.09, 0.47], [0.20, 0.42], [0.31, 0.39], [0.40, 0.33], 
           [0.48, 0.10], [0.58, 0.06], [0.68, 0.18], [0.82, 0.34], [0.94, 0.42], 
           [1.00, 0.44]],
    glass: { span: [0.36, 0.66], base: 0.38, inset: 0.03, pillars: [0.42], rake: 10, pillarW: 5 },
    doors: [0.44, 0.62], creaseY: 0.52, archLift: 1.12, flareMm: 24, endLift: 0.36,
    headlamp: "round", lampY: 0.42, rim: "wire", badge: "", exhaust: { kind: "side", n: 6 },
    extra: (P, f) => `<circle cx="${f(P.xAt(0.62))}" cy="${f(P.yAt(0.46))}" r="17" fill="#f3f4f2" stroke="#20242a" stroke-width="1.4"/>
      <text x="${f(P.xAt(0.62))}" y="${f(P.yAt(0.46) + 5)}" text-anchor="middle" font-family="ui-sans-serif" font-size="13" font-weight="700" fill="#1a1d22">24</text>
      <path d="M${f(P.xAt(0.16))},${f(P.yAt(0.26))} l30,-4 l0,10 l-30,4 Z" fill="#0d1014" stroke="#7f8892"/>`,
  },
  f40: {
    name: "Ferrari F40",
    lengthMm: 4358, wheelbaseMm: 2450, heightMm: 1124, frontOverhangMm: 1000, rearOverhangMm: 908,
    wheelDiaFrontMm: 640, wheelDiaRearMm: 680, sillMm: 105,
    paint: ["#e8382c", "#b0121e", "#41060b"], accent: "#ffd24a",
    // a wedge with a straight bonnet and a huge fixed wing on the deck
    roof: [[0.00, 0.62], [0.13, 0.56], [0.26, 0.52], [0.36, 0.48], [0.41, 0.18], 
           [0.52, 0.10], [0.62, 0.18], [0.74, 0.36], [0.88, 0.40], [1.00, 0.42]],
    glass: { span: [0.36, 0.60], base: 0.32, inset: 0.02, pillars: [0.37], rake: 9, pillarW: 5 },
    doors: [0.37, 0.56], creaseY: 0.44, archLift: 1.12, flareMm: 26, endLift: 0.30,
    headlamp: "pop", lampY: 0.44, rim: "five", badge: "F40", badgeX: 0.46, exhaust: { kind: "twin", n: 3 },
    wing: { x: 0.90, y: 0.20, w: 0.20, drop: 0.20 },
    // the NACA duct on the bonnet and the louvred engine cover
    extra: (P, f) => `<path d="M${f(P.xAt(0.16))},${f(P.yAt(0.44))} l30,-4 l4,10 l-32,5 Z" fill="#8c1018"/>
      <g stroke="#4a0d12" stroke-width="2.4">${[0, 1, 2, 3].map((i) => `<path d="M${f(P.xAt(0.62 + i * 0.03))},${f(P.yAt(0.20))} l16,7"/>`).join("")}</g>`,
  },
  p917: {
    name: "Porsche 917K",
    lengthMm: 4290, wheelbaseMm: 2300, heightMm: 920, frontOverhangMm: 1050, rearOverhangMm: 940,
    wheelDiaFrontMm: 620, wheelDiaRearMm: 660, sillMm: 85,
    paint: ["#7fd0ef", "#2b8fc4", "#0b3450"], accent: "#e8622a",
    // 1970 Le Mans: a very low, very wide teardrop with the tail curving up over the wheels
    roof: [[0.00, 0.76], [0.11, 0.56], [0.22, 0.40], [0.30, 0.22], [0.38, 0.06], 
           [0.47, 0.02], [0.57, 0.14], [0.67, 0.32], [0.78, 0.22], [0.90, 0.18], 
           [1.00, 0.24]],
    glass: { span: [0.32, 0.56], base: 0.26, inset: 0.02, pillars: [0.34], rake: 8, pillarW: 4 },
    doors: [0.34, 0.52], creaseY: 0.44, archLift: 1.18, flareMm: 34, endLift: 0.40,
    headlamp: "round", lampY: 0.40, rim: "five", badge: "", exhaust: { kind: "stack" },
    extra: (P, f) => `<circle cx="${f(P.xAt(0.60))}" cy="${f(P.yAt(0.40))}" r="18" fill="#f3f4f2" stroke="#20242a" stroke-width="1.4"/>
      <text x="${f(P.xAt(0.60))}" y="${f(P.yAt(0.40) + 6)}" text-anchor="middle" font-family="ui-sans-serif" font-size="14" font-weight="700" fill="#1a1d22">23</text>
      <path d="M${f(P.xAt(0.30))},${f(P.yAt(0.50))} l0,26 l${f(P.drawL * 0.30)},0 l0,-26 Z" fill="#e8622a" opacity="0.9"/>`,
  },
  slr300: { skip: true },        // already drawn to standard
  db5: { skip: true },
  agera: { skip: true },
  u9: { skip: true },
  czinger: { skip: true },

  /* ---------------- the road cars ---------------- */
  tesla: {
    name: "Tesla Model S Plaid",
    lengthMm: 4979, wheelbaseMm: 2960, heightMm: 1445, frontOverhangMm: 920, rearOverhangMm: 1099,
    wheelDiaFrontMm: 720, wheelDiaRearMm: 720, sillMm: 130,
    paint: ["#f2f5f8", "#b8c2cc", "#3b444d"], accent: "#c8102e",
    // a five-door liftback: one unbroken arc from the bonnet to the tail
    roof: [[0.00, 0.76], [0.09, 0.66], [0.18, 0.58], [0.26, 0.46], [0.33, 0.24], 
           [0.44, 0.04], [0.56, 0.03], [0.68, 0.16], [0.81, 0.38], [0.92, 0.52], 
           [1.00, 0.58]],
    glass: { span: [0.28, 0.72], base: 0.44, inset: 0.03, pillars: [0.30, 0.50], rake: 10, pillarW: 6 },
    doors: [0.32, 0.50, 0.64], creaseY: 0.56, archLift: 1.05, flareMm: 8, endLift: 0.22,
    headlamp: "strip", lampY: 0.46, rim: "ten", badge: "PLAID", badgeX: 0.46, exhaust: { kind: "none" },
  },
  taycan: {
    name: "Porsche Taycan Turbo GT",
    lengthMm: 4963, wheelbaseMm: 2900, heightMm: 1381, frontOverhangMm: 930, rearOverhangMm: 1133,
    wheelDiaFrontMm: 710, wheelDiaRearMm: 720, sillMm: 120,
    paint: ["#7fe6dc", "#188f8c", "#073237"], accent: "#5fd0ea",
    roof: [[0.00, 0.74], [0.09, 0.62], [0.18, 0.52], [0.26, 0.42], [0.32, 0.14], 
           [0.44, 0.02], [0.60, 0.03], [0.71, 0.20], [0.81, 0.44], [0.90, 0.50], 
           [1.00, 0.54]],
    glass: { span: [0.28, 0.70], base: 0.42, inset: 0.03, pillars: [0.30, 0.50], rake: 10, pillarW: 6 },
    doors: [0.32, 0.50, 0.64], creaseY: 0.54, archLift: 1.06, flareMm: 12, endLift: 0.24,
    headlamp: "strip", lampY: 0.44, rim: "five", badge: "", exhaust: { kind: "none" },
  },
  amg: {
    name: "Mercedes-AMG GT Black Series",
    lengthMm: 4638, wheelbaseMm: 2630, heightMm: 1284, frontOverhangMm: 1120, rearOverhangMm: 888,
    wheelDiaFrontMm: 700, wheelDiaRearMm: 730, sillMm: 105,
    paint: ["#f2c200", "#c08a00", "#3d2b00"], accent: "#f2c200",
    // the longest bonnet in the garage, and a short cut-off tail behind the cabin
    roof: [[0.00, 0.56], [0.14, 0.50], [0.28, 0.45], [0.40, 0.40], [0.48, 0.34], 
           [0.57, 0.06], [0.66, 0.04], [0.76, 0.20], [0.88, 0.36], [1.00, 0.44]],
    glass: { span: [0.40, 0.66], base: 0.36, inset: 0.03, pillars: [0.41], rake: 9, pillarW: 6 },
    doors: [0.41, 0.60], creaseY: 0.46, archLift: 1.10, flareMm: 24, endLift: 0.26,
    headlamp: "strip", lampY: 0.38, rim: "five", badge: "", exhaust: { kind: "twin", n: 2 },
    wing: { x: 0.90, y: 0.16, w: 0.20, drop: 0.22 },
    extra: (P, f) => `<g stroke="#3d2b00" stroke-width="2.6">${[0, 1, 2].map((i) => `<path d="M${f(P.xAt(0.16 + i * 0.035))},${f(P.yAt(0.42))} l20,6"/>`).join("")}</g>`,
  },
  porsche918: {
    name: "Porsche 918 Spyder",
    lengthMm: 4643, wheelbaseMm: 2730, heightMm: 1167, frontOverhangMm: 1000, rearOverhangMm: 913,
    wheelDiaFrontMm: 680, wheelDiaRearMm: 720, sillMm: 100,
    paint: ["#eef1f4", "#a4aeb8", "#2a3138"], accent: "#c8e400",
    roof: [[0.00, 0.60], [0.11, 0.50], [0.22, 0.44], [0.33, 0.40], [0.41, 0.30], 
           [0.49, 0.16], [0.57, 0.22], [0.68, 0.32], [0.84, 0.38], [1.00, 0.44]],
    glass: { span: [0.33, 0.58], base: 0.30, inset: 0.02, pillars: [0.35], rake: 8, pillarW: 5 },
    doors: [0.35, 0.54], creaseY: 0.44, archLift: 1.10, flareMm: 20, endLift: 0.30,
    headlamp: "strip", lampY: 0.36, rim: "five", badge: "918", badgeX: 0.46,
    // the top pipes: the 918's exhausts come out of the top of the engine cover
    exhaust: { kind: "none" },
    extra: (P, f) => `<g fill="#a7aeb6"><ellipse cx="${f(P.xAt(0.66))}" cy="${f(P.yAt(0.24))}" rx="9" ry="6"/><ellipse cx="${f(P.xAt(0.70))}" cy="${f(P.yAt(0.25))}" rx="9" ry="6"/></g>`,
  },
  supra: {
    name: "Toyota Supra MK4",
    lengthMm: 4514, wheelbaseMm: 2550, heightMm: 1275, frontOverhangMm: 1000, rearOverhangMm: 964,
    wheelDiaFrontMm: 640, wheelDiaRearMm: 660, sillMm: 125,
    paint: ["#e8382c", "#b01a1a", "#3f0708"], accent: "#ff7a6c",
    // the A80: a rounded fastback with the big ducktail on the boot
    roof: [[0.00, 0.72], [0.11, 0.60], [0.21, 0.50], [0.29, 0.38], [0.35, 0.12], 
           [0.45, 0.02], [0.56, 0.06], [0.69, 0.28], [0.83, 0.46], [0.93, 0.42], 
           [1.00, 0.48]],
    glass: { span: [0.33, 0.64], base: 0.38, inset: 0.03, pillars: [0.35], rake: 10, pillarW: 6 },
    doors: [0.35, 0.58], creaseY: 0.50, archLift: 1.08, flareMm: 14, endLift: 0.26,
    headlamp: "strip", lampY: 0.40, rim: "five", badge: "", exhaust: { kind: "single", n: 1 },
    wing: { x: 0.88, y: 0.28, w: 0.18, drop: 0.14 },
  },
  evo: { skip: true },   // hand-drawn — the generator must not touch it
  gtr: { skip: true },   // hand-drawn — the generator must not touch it
  m5: { skip: true },   // hand-drawn — the generator must not touch it
  r8: { skip: true },   // hand-drawn — the generator must not touch it
  mclarenf1: { skip: true },   // hand-drawn — the generator must not touch it
  t33: { skip: true },   // hand-drawn — the generator must not touch it
  t50s: {
    name: "Gordon Murray T.50s Niki Lauda",
    lengthMm: 4352, wheelbaseMm: 2700, heightMm: 1145, frontOverhangMm: 830, rearOverhangMm: 822,
    wheelDiaFrontMm: 650, wheelDiaRearMm: 690, sillMm: 88,
    paint: ["#eef1f4", "#aab3bd", "#2b3138"], accent: "#c8102e",
    roof: [[0.00, 0.66], [0.10, 0.54], [0.22, 0.42], [0.34, 0.28], [0.42, 0.08], 
           [0.50, 0.01], [0.56, 0.14], [0.66, 0.38], [0.82, 0.50], [1.00, 0.56]],
    glass: { span: [0.33, 0.60], base: 0.28, inset: 0.02, pillars: [0.35], rake: 6, pillarW: 4 },
    doors: [0.35, 0.55], doorSwing: -34, creaseY: 0.42, archLift: 1.10, flareMm: 18, endLift: 0.34,
    headlamp: "round", lampY: 0.34, rim: "dish", badge: "", exhaust: { kind: "stack" },
    wing: { x: 0.92, y: 0.06, w: 0.24, drop: 0.32 },
    // the 400 mm fan in the tail, and the roof-to-tail fin
    extra: (P, f) => `<circle cx="${f(P.xAt(0.94))}" cy="${f(P.yAt(0.34))}" r="20" fill="#0a0d11" stroke="rgba(200,16,46,0.7)" stroke-width="2"/>
      <g stroke="#5b636d" stroke-width="1.6">${[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * 60) * Math.PI / 180; return `<path d="M${f(P.xAt(0.94))},${f(P.yAt(0.34))} l${f(Math.cos(a) * 17)},${f(Math.sin(a) * 17)}"/>`; }).join("")}</g>
      <path d="M${f(P.xAt(0.54))},${f(P.yAt(0.06))} L${f(P.xAt(0.86))},${f(P.yAt(0.24))} L${f(P.xAt(0.86))},${f(P.yAt(0.32))} L${f(P.xAt(0.54))},${f(P.yAt(0.14))} Z" fill="#141a20" stroke="rgba(200,16,46,0.5)"/>`,
  },
  alfa33: {
    name: "Alfa Romeo 33 Stradale",
    lengthMm: 4640, wheelbaseMm: 2700, heightMm: 1210, frontOverhangMm: 1000, rearOverhangMm: 940,
    wheelDiaFrontMm: 680, wheelDiaRearMm: 710, sillMm: 105,
    paint: ["#d8242e", "#8f0d18", "#33040a"], accent: "#e8c9c9",
    // the 2023 car quotes the 1967 one: a rounded shell and a domed glass canopy
    roof: [[0.00, 0.72], [0.07, 0.52], [0.15, 0.36], [0.25, 0.28], [0.34, 0.22], 
           [0.44, 0.10], [0.56, 0.08], [0.68, 0.12], [0.81, 0.20], [1.00, 0.30]],
    glass: { span: [0.32, 0.62], base: 0.30, inset: 0.02, pillars: [0.34], rake: 7, pillarW: 4 },
    doors: [0.34, 0.55], doorSwing: -38, creaseY: 0.44, archLift: 1.10, flareMm: 20, endLift: 0.32,
    headlamp: "round", lampY: 0.36, rim: "five", badge: "", exhaust: { kind: "twin", n: 2 },
  },
  project8: {
    name: "Jaguar XE SV Project 8",
    lengthMm: 4679, wheelbaseMm: 2835, heightMm: 1424, frontOverhangMm: 890, rearOverhangMm: 954,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 700, sillMm: 135,
    paint: ["#3f80d8", "#17458f", "#071c3a"], accent: "#74a9ff",
    // a four-door saloon with a boot and the big adjustable wing standing on it
    roof: [[0.00, 0.74], [0.08, 0.64], [0.17, 0.58], [0.25, 0.52], [0.31, 0.24], 
           [0.45, 0.04], [0.61, 0.07], [0.71, 0.30], [0.79, 0.50], [0.92, 0.53], 
           [1.00, 0.57]],
    glass: { span: [0.28, 0.70], base: 0.46, inset: 0.03, pillars: [0.30, 0.48], rake: 9, pillarW: 6 },
    doors: [0.32, 0.48, 0.62], creaseY: 0.58, archLift: 1.07, flareMm: 18, endLift: 0.18,
    headlamp: "strip", lampY: 0.48, rim: "ten", badge: "PROJECT 8", badgeX: 0.46,
    exhaust: { kind: "quad", n: 4 },
    wing: { x: 0.88, y: 0.24, w: 0.22, drop: 0.22 },
  },
  s2000: {
    name: "Honda S2000",
    lengthMm: 4135, wheelbaseMm: 2400, heightMm: 1285, frontOverhangMm: 880, rearOverhangMm: 855,
    wheelDiaFrontMm: 610, wheelDiaRearMm: 630, sillMm: 125,
    paint: ["#e8382c", "#b0121e", "#3f060b"], accent: "#ff8a7c",
    // a roadster: the engine is behind the front axle so the bonnet is long and the deck short
    roof: [[0.00, 0.74], [0.13, 0.62], [0.26, 0.54], [0.38, 0.48], [0.46, 0.22], 
           [0.55, 0.06], [0.64, 0.12], [0.74, 0.34], [0.87, 0.48], [1.00, 0.54]],
    glass: { span: [0.40, 0.62], base: 0.36, inset: 0.03, pillars: [0.42], rake: 9, pillarW: 5 },
    doors: [0.42, 0.62], creaseY: 0.52, archLift: 1.08, flareMm: 12, endLift: 0.24,
    headlamp: "strip", lampY: 0.42, rim: "seven", badge: "S2000", badgeX: 0.50,
    exhaust: { kind: "twin", n: 2 },
  },
};
