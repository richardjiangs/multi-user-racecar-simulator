// proof.mjs — render four of the worst offenders and look at them before touching the garage.
import { renderCar } from "./render.mjs";
import { writeFileSync } from "node:fs";

const CARS = [
  {
    key: "revuelto", name: "Lamborghini Revuelto",
    lengthMm: 4947, wheelbaseMm: 2779, heightMm: 1160, frontOverhangMm: 1010, rearOverhangMm: 1158,
    wheelDiaFrontMm: 693, wheelDiaRearMm: 740, sillMm: 105,
    paint: ["#ff9a3c", "#e2560f", "#5c1c04"], accent: "#ffb35c",
    // cab-forward wedge: the screen starts a third of the way back and the tail runs on
    roof: [[0.00,0.72],[0.06,0.66],[0.14,0.60],[0.24,0.52],[0.31,0.40],[0.36,0.16],[0.45,0.06],[0.53,0.12],[0.63,0.30],[0.75,0.40],[0.88,0.44],[1.00,0.50]],
    
    glass: { span: [0.31, 0.63], base: 0.40, inset: 0.03, pillars: [0.30], rake: 9, pillarW: 7 },
    doors: [0.30, 0.50], doorSwing: -34,          // scissor doors
    creaseY: 0.50, archLift: 1.10, flareMm: 18,
    headlamp: "strip", lampY: 0.40, rim: "ten", badge: "REVUELTO", badgeX: 0.46,
    exhaust: { kind: "stack" },
    wing: { x: 0.86, y: 0.20, w: 0.20, drop: 0.24 },
    extra: (P, f) => `<path d="M${f(P.xAt(0.62))},${f(P.yAt(0.34))} l${f(P.drawL * 0.07)},-6 l4,26 l-${f(P.drawL * 0.07)},8 Z" fill="#0a0d11" stroke="rgba(255,180,90,0.5)"/>`,
  },
  {
    key: "gto", name: "Ferrari 250 GTO",
    lengthMm: 4325, wheelbaseMm: 2400, heightMm: 1210, frontOverhangMm: 985, rearOverhangMm: 940,
    wheelDiaFrontMm: 640, wheelDiaRearMm: 640, sillMm: 130,
    paint: ["#e8382c", "#b81420", "#4d060c"], accent: "#ffd24a",
    // long bonnet, cabin set well back, and the Kamm tail Bizzarrini cut off
    roof: [[0.00,0.60],[0.07,0.50],[0.17,0.44],[0.28,0.40],[0.36,0.34],[0.43,0.12],[0.55,0.06],[0.66,0.16],[0.80,0.32],[0.92,0.42],[1.00,0.46]],
    
    glass: { span: [0.36, 0.66], base: 0.38, inset: 0.03, pillars: [0.42], rake: 10, pillarW: 5 },
    doors: [0.44, 0.62], creaseY: 0.52, archLift: 1.12, flareMm: 24,
    headlamp: "round", lampY: 0.42, rim: "wire", badge: "", exhaust: { kind: "side", n: 6 },
    extra: (P, f) => `<circle cx="${f(P.xAt(0.66))}" cy="${f(P.yAt(0.46))}" r="17" fill="#f3f4f2" stroke="#20242a" stroke-width="1.4"/>
      <text x="${f(P.xAt(0.66))}" y="${f(P.yAt(0.46) + 5)}" text-anchor="middle" font-family="ui-sans-serif" font-size="13" font-weight="700" fill="#1a1d22">24</text>
      <path d="M${f(P.xAt(0.13))},${f(P.yAt(0.30))} l26,-4 l0,9 l-26,4 Z" fill="#0d1014" stroke="#7f8892"/>`,
  },
  {
    key: "bugatti", name: "Bugatti Chiron Super Sport 300+",
    lengthMm: 4994, wheelbaseMm: 2711, heightMm: 1212, frontOverhangMm: 1020, rearOverhangMm: 1263,
    wheelDiaFrontMm: 700, wheelDiaRearMm: 745, sillMm: 115,
    paint: ["#4f8fe0", "#173f7e", "#071b34"], accent: "#9cc6ff",
    roof: [[0.00,0.56],[0.08,0.46],[0.18,0.36],[0.27,0.28],[0.34,0.16],[0.41,0.06],[0.50,0.02],[0.60,0.08],[0.70,0.22],[0.84,0.36],[1.00,0.44]],
    
    glass: { span: [0.34, 0.70], base: 0.34, inset: 0.03, pillars: [0.34], rake: 9, pillarW: 6 },
    doors: [0.34, 0.54], doorSwing: -18, creaseY: 0.44, archLift: 1.08, flareMm: 20,
    headlamp: "strip", lampY: 0.36, rim: "turbine", badge: "300+", badgeX: 0.48,
    exhaust: { kind: "quad", n: 4 },
    extra: (P, f) => `<path d="M${f(P.xAt(0.40))},${f(P.yAt(0.34))} q-26,26 -4,54 l-22,4 q-22,-32 4,-62 Z" fill="#0a0e14" stroke="rgba(156,198,255,0.55)" stroke-width="1.4"/>`,
  },
  {
    key: "aston", name: "Aston Martin Valkyrie",
    lengthMm: 4530, wheelbaseMm: 2740, heightMm: 1100, frontOverhangMm: 1000, rearOverhangMm: 790,
    wheelDiaFrontMm: 690, wheelDiaRearMm: 730, sillMm: 78,
    paint: ["#8fe04a", "#2f7a24", "#0d2a10"], accent: "#b6ff5c",
    // a Le Mans prototype with a numberplate: teardrop canopy, and the body cut away underneath
    roof: [[0.00,0.70],[0.09,0.56],[0.19,0.42],[0.28,0.28],[0.36,0.12],[0.45,0.02],[0.55,0.10],[0.66,0.26],[0.80,0.38],[1.00,0.46]],
    
    glass: { span: [0.36, 0.55], base: 0.28, inset: 0.02, pillars: [], rake: 0, pillarW: 0 },
    doors: [0.32, 0.52], doorSwing: -40, creaseY: 0.46, archLift: 1.16, flareMm: 26,
    headlamp: "strip", lampY: 0.44, rim: "dish", badge: "", exhaust: { kind: "twin", n: 2 },
    wing: { x: 0.88, y: 0.10, w: 0.24, drop: 0.30 },
    extra: (P, f) => `<path d="M${f(P.xAt(0.60))},${f(P.sillY - 4)} l${f(P.drawL * 0.16)},0 l-10,20 l-${f(P.drawL * 0.16)},0 Z" fill="#080b0f" stroke="rgba(182,255,92,0.4)"/>`,
  },
];

const cells = CARS.map((c) => `<div style="width:640px"><div style="color:#9fb0c4;font:12px ui-sans-serif;padding:4px 8px">${c.name}</div>
  <div style="background:#0d1015;border:1px solid #222;border-radius:8px">${renderCar(c)}</div></div>`).join("");
writeFileSync("/tmp/claude-0/-home-user-multi-user-racecar-simulator/94337bbb-7be4-5ba6-aa8e-d6642bca4a20/scratchpad/proof.html",
  `<body style="margin:0;background:#07080a;display:flex;flex-wrap:wrap;gap:10px">${cells}</body>`);
console.log("proof.html written");
