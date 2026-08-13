# Multi-User Racecar Simulator — Agent Guide (CLAUDE.md)

A garage of fifty-six simulators — each a **single self-contained HTML file** —
forty-one road/classic cars & hypercars, the full **2026 Formula 1 grid** (eleven teams),
and four **2026 Dakar Rally** raid cars (Dacia Sandrider · Ford Raptor T1+ · Toyota GR DKR
Hilux · Prodrive Hunter). The road block runs from the Bugatti Chiron through the Toyota
Supra MK4 (A80), the six later hypercars (Hennessey Venom F5 · Lotus Evija · Mercedes-AMG
One · Rimac Nevera · Chevrolet Corvette ZR1 · McLaren P1), two classic racers (**Ferrari
F40**, **Porsche 917K**), six road cars added next (Mitsubishi Lancer Evolution X FQ-440 MR ·
Nissan GT-R Nismo · BMW M5 G90 · Audi R8 V10 Performance · McLaren F1 1993 · Gordon Murray
T.33), and five more after them (**Koenigsegg Agera RS** · **Yangwang U9** · **Aston Martin
DB5** with its Q Branch equipment · **Mercedes-Benz 300 SLR Uhlenhaut Coupé** · **Czinger
21C**), and five more after those (**Alfa Romeo 33 Stradale** · **SSC Tuatara** · **Gordon
Murray T.50s Niki Lauda** · **Jaguar XE SV Project 8** — the only four-door in the garage —
· **Honda S2000**), two more after those (**Ford Mustang GTD** · **Mazda RX-7 Spirit R**), and
finally two **Rolls-Royces** — the **Phantom VIII** and the **Spectre Black Badge** — which are
not sports cars at all and are the reason the garage now has city journeys, working traffic
signals and a course in being a chauffeur. `index.html` bundles all of them together with
real photos / liveried cards / performance cards, a **Private Practice** mode
(the untouched simulator) and an **Online Race** mode (browser-to-browser WebRTC,
no paid server).

> **Extending the garage?** Read **`docs/ADDING_CARS.md`** — the step-by-step playbook for
> adding a new car (normal vs special-racing), the ordering rules (new **normal** cars go at the
> end of the road block **before** the F1 cars, never last; new **racing** cars get a **Real Mode**
> and go after the racing block), the calibration/verification pipeline, the hard warnings, and the
> current known open bug (learning-mode apex side + real-time apex marks).

## Repository layout

```
index.html                                  ← garage + online race shell (all sims embedded as base64)
Bugatti Chiron Super Sport 300+ simulator.html
Pagani Huayra BC Simulator.html
McLaren Speedtail simulator.html
Ferrari F80 simulator.html
Koenigsegg Jesko simulator.html
Tesla Model S Plaid simulator.html
Mercedes-AMG GT Black Series simulator.html
Aston Martin Valkyrie simulator.html
Ferrari 250 GTO simulator.html
Lamborghini Revuelto simulator.html
Porsche 918 Spyder simulator.html
Porsche Taycan Turbo GT simulator.html
Toyota Supra MK4 simulator.html
Hennessey Venom F5 simulator.html           ← six later hypercars (each its own calibrated SPEC, real
Lotus Evija simulator.html                     brand circuit, unique-but-real engine sound + Real Mode;
Mercedes-AMG One simulator.html                inserted at the END of the road block, BEFORE the F1 cars):
Rimac Nevera simulator.html                    Venom F5 (6.6 TT V8) · Evija + Nevera (quad-motor EV) ·
Chevrolet Corvette ZR1 simulator.html          AMG One (F1 1.6 V6 hybrid) · ZR1 (5.5 flat-plane V8) ·
McLaren P1 simulator.html                      P1 (3.8 V8 hybrid). The two AWD quad-motor EVs (Evija,
                                               Nevera; cloned from Tesla) carry the Dakar stages + terrain;
                                               the four low ground-effect cars are tarmac-only.
Ferrari F40 simulator.html                  ← two classic racers (cloned from the 250 GTO, tarmac-only, a low
Porsche 917 simulator.html                     mid-engine body swapped in): F40 (2.9 TT V8, Mugello, red) and
                                               917K (4.9 air-cooled flat-12, Daytona, Gulf blue/orange).
Mercedes F1 2026 simulator.html             ← 2026 F1 grid (11 teams, one shared chassis SPEC):
Red Bull F1 2026 simulator.html                Mercedes · Red Bull · Ferrari · McLaren · Aston Martin ·
Ferrari F1 2026 simulator.html                 Alpine · Williams · Racing Bulls · Haas · Audi · Cadillac.
McLaren F1 2026 simulator.html                 Each: unique livery (var(--f1body)/var(--teal)), number,
Aston Martin F1 2026 simulator.html            and per-engine _satCurve; V6 turbo-hybrid, halo, active aero.
Alpine F1 2026 simulator.html
Williams F1 2026 simulator.html
Racing Bulls F1 2026 simulator.html
Haas F1 2026 simulator.html
Audi F1 2026 simulator.html
Cadillac F1 2026 simulator.html
Mitsubishi Lancer Evo X FQ-440 simulator.html  ← six road cars added after the classics (each cloned from its
Nissan GT-R Nismo simulator.html               closest donor, then re-derived end to end — SPEC, gear ladder,
BMW M5 simulator.html                          engine voice, body, cabin, cluster, wheel and engine bay):
Audi R8 V10 Performance simulator.html         Evo X (2.0 4B11T, S-AWC) · GT-R Nismo (3.8 VR38DETT) ·
McLaren F1 1993 simulator.html                 M5 G90 (4.4 S68 hybrid) · R8 (5.2 NA V10) ·
Gordon Murray T.33 simulator.html              McLaren F1 (6.1 BMW S70/2, central seat) · T.33 (3.9 Cosworth GMA).
Koenigsegg Agera RS simulator.html          ← five more (same rule: real SPEC, real brand circuit, unique voice,
Yangwang U9 simulator.html                     unique art, one real ultimate-speed feature each on key Z):
Aston Martin DB5 simulator.html                Agera RS (5.0 TT V8, Nevada SR 160, 1 MW package) ·
Mercedes-Benz 300 SLR Uhlenhaut simulator.html U9 (quad-motor e⁴, Shanghai, Xtreme spec) ·
Czinger 21C simulator.html                     DB5 (4.0 DOHC six, Furka Pass, Q BRANCH tab + Vantage spec) ·
                                               300 SLR (3.0 desmo straight-eight, AVUS, Le Mans axle) ·
                                               21C (2.88 TT flat-plane V8 + 2 e-motors, Willow Springs, V Max).
Alfa Romeo 33 Stradale simulator.html       ← five more again (same rule, and each with one real
SSC Tuatara simulator.html                     configuration on key Z): 33 Stradale (3.0 TT V6, Balocco,
Gordon Murray T50s Niki Lauda simulator.html   Pista) · Tuatara (5.9 TT flat-plane V8, Launch and Landing
Jaguar XE SV Project 8 simulator.html          Facility, E85) · T.50s (3.9 Cosworth GMA V12 + 400 mm fan,
Honda S2000 simulator.html                     Anderstorp, high downforce) · Project 8 (5.0 supercharged V8,
                                               MIRA, Track Pack — a FOUR-DOOR SALOON, the only one here) ·
                                               S2000 (2.0 F20C VTEC to 9,000, Twin Ring Motegi, AP2 spec).
Ford Mustang GTD simulator.html             ← two more (5.2 supercharged cross-plane V8, the only belt-driven
Mazda RX-7 simulator.html                      blower here; and the only Wankel — 13B-REW, sequential turbos).
Rolls-Royce Phantom simulator.html          ← TWO ROLLS-ROYCES, and almost nothing in the template applied
Rolls-Royce Spectre Black Badge simulator.html unchanged: Phantom VIII (6.75 TT V12, 2,560 kg, 250 governed)
                                               and Spectre Black Badge (two motors, 1,075 Nm, one speed,
                                               2,975 kg). Seven point-to-point CITY JOURNEYS instead of
                                               circuits, real traffic signals every car obeys, a ten-piece
                                               rear compartment on keys 1-0, a POWER RESERVE dial instead of
                                               a tachometer, and Chauffeur 101 in place of Race Car 101.
Dacia Sandrider Dakar simulator.html        ← 2026 Dakar Rally raid cars (4, one shared T1+ Ultimate chassis SPEC):
Ford Raptor T1+ Dakar simulator.html           Dacia Sandrider · Ford Raptor T1+ · Toyota GR DKR Hilux · Prodrive Hunter.
Toyota GR DKR Hilux simulator.html             Each: real engine + unique sound (Ford = 5.0 NA V8; the rest twin-turbo V6),
Prodrive Hunter Dakar simulator.html           real 2026 Dakar stages with terrain/dune/bump physics, Rally Stage (Real) Mode, Dakar Rally 101.
tests/perf-test.mjs                         ← factory-figure verification harness (node tests/perf-test.mjs)
tests/browser-test.mjs                      ← shell + practice + online + race-control smoke test
tests/switch-test.mjs                       ← drives switch.html with a simulated Pro Controller (node tests/switch-test.mjs)
tests/switch-joycon-test.mjs                ← verifies switch.html's controller-calibration wizard with two non-standard fake Joy-Cons
tests/switch-server-test.mjs                ← verifies tools/switch-server.mjs (DNS capture + serving + touch-shim steering)
tools/embed-sims.mjs                        ← regenerates sims-embedded.js + the index.html SIM_FILES map (run after editing a sim)
sims-embedded.js                            ← generated: all sims base64; loaded by index.html ONLY over file:// (offline fallback)
index-offline.html                          ← generated: the original all-in-one page — one self-contained file, every sim embedded inline, zero network / zero loading on any protocol
switch.html                                 ← generated by tools/build-switch.mjs: self-contained build + a standard-gamepad (Pro Controller/Joy-Con) layer.
                                               A WEB PAGE, not a Switch title — the console cannot run HTML off the SD card; see docs/SWITCH.md
tools/switch-server.mjs                      ← runs a DNS+web launcher so a STOCK Switch's own browser opens the game (touch play, no homebrew); see docs/SWITCH.md
vendor/trystero-nostr.min.js                ← bundled Trystero (ESM); vendor/peerjs.min.js ← PeerJS fallback
```

**IMPORTANT:** after editing ANY simulator HTML, run
`node tools/embed-sims.mjs && node tests/perf-test.mjs`
so `index.html` picks up the change and the physics stay factory-exact.

## Anatomy of a simulator file (the shared template)

Every simulator follows the *same* section order (do not reorder — "code layout"
is part of the contract):

1. `<style>` — dark cockpit UI. Only the accent CSS variables and art-specific
   classes change per car.
2. `<body>` — topbar (brand, view tabs, quick buttons) · HUD · mode panels
   (Exterior / Cockpit / Engine / Dynamics / Circuit) · bottombar (console,
   gearbox + pedals, telemetry pad) · touch wheel · key overlay.
3. `<script type="module">` with these blocks, in order:
   - **data: circuits** — `CIRCUITS`: Monaco, Nürburgring 24h/Nordschleife/GP,
     Suzuka, Silverstone, Nardò Ring (these seven are shared, real, and identical
     across all cars — **never change their geometry**), plus **one brand-special
     track that is a DISTINCT real circuit per car** (Fiorano, Fuji, Laguna Seca,
     Le Mans, Hockenheim, Imola, Mugello, Zandvoort, …; the F1 grid gets real GP
     circuits — Spa, Red Bull Ring, Monza, COTA, Bahrain, Paul Ricard, Interlagos,
     Baku, Miami, Hungaroring, Las Vegas). It sits between the brand key and
     `"Nardò Ring"`; changing it also updates the circuit button, the brand-grid
     `state.route.name === …` check, and the voice alias.
   - **data: vehicle spec** — `SPEC` object: THE real manufacturer figures.
     Comments cite the exact numbers. `tractionCoeff` / `brakeMaxMps2` are
     *calibrated* so the fixed-step integrator reproduces the official 0-100
     and 100-0 figures exactly (see tests/perf-test.mjs).
   - **shared context** — `state` + `el` lookup + helpers, exported on
     `window.<Brand>App` (`BugattiApp`, `PaganiApp`, `McLarenApp`, `FerrariApp`,
     `KoenigseggApp`, `TeslaApp`, `AmgApp`, `AstonApp`, `GtoApp`, `RevueltoApp`,
     `Porsche918App`, `TaycanApp`, `SupraApp`; and the F1 grid `MercedesF1App`,
     `RedbullF1App`, `FerrariF1App`, `MclarenF1App`, `AstonF1App`, `AlpineF1App`,
     `WilliamsF1App`, `RacingbullsF1App`, `HaasF1App`, `AudiF1App`,
     `CadillacF1App`). index.html reaches into the iframe through this global.
   - **audio** — synthesised engine (osc stack + firing frequency = rpm/60 ×
     pulses-per-rev; W16=8, V12=6, V8=4, V6=3, EV=inverter whine), turbo,
     blow-off, crackle, horn, chimes.
   - **physics** — engine torque curve (low-rpm ramp → plateau at
     `peakTorqueNm`, capped by `peakPowerW/ω`), gearbox w/ auto+paddle shift,
     active aero, traction cap, launch control, bicycle-model steering, lap
     timing, AI rival grid (`GRID_CARS` + brand grid on the brand track).
     Fixed step 1/120 s — frame-rate independent, so what the test proves is
     what the car does.
   - **render** — pseudo-3D canvas world (`rebuildRoadTable`/`projectAhead`),
     kerbs, racing line, rivals as sprites + name tags, **start/finish line**
     (checkered strip at lap phase 0 on loop circuits), cockpit frame with the
     car's real dashboard, circuit map, exterior/cockpit SVG art injection.
   - **UI actions / cockpit effects / co-pilot voice / HUD / events / main loop**.

### Steering — do not touch the input paths

Keyboard A/D, the mobile touch wheel, and trackpad steering (hold Space+T or
long-press) are identical in every car. Only `STEERING = { wheelbase,
frontTrack, maxAngle }` carries real per-car geometry.

### Per-car deltas (what you change when cloning a sim)

brand/title/colours · `SPEC` + `modeMap` shift points · engine audio osc stack
+ pulses/rev · special feature (Bugatti Speed Key 380→490.5 · Jesko E85 fuel
1,280→1,600 hp on **Z** and the **Absolut body on Y** · Speedtail Velocity mode · Tesla Track Package 262→322 &
Drag Strip launch · F80 Boost Optimization/e-turbo) · brand track name + brand
rival grid · exterior SVG · cockpit SVG · `drawCabinFrame` dashboard (real
cluster per car) · steering-wheel drawing (roundel/shape; Tesla = yoke) ·
engine-bay art (turbo count/e-motors) · toasts & co-pilot lines.

### The cars — factory figures encoded in `SPEC`

| Car | Power | Torque | 0-100 | Top speed | Box | Mass |
|---|---|---|---|---|---|---|
| Bugatti Chiron SS 300+ | 1,177 kW / 1,600 PS @ 7,000 | 1,600 Nm @ 2,250–7,000 | 2.4 s | 380 governed / 490.5 Speed Key | 7-DSG | 1,995 kg |
| Pagani Huayra BC | 562 kW / 764 PS @ 5,900 | 1,000 Nm @ 2,500–5,600 | 2.8 s | 350 | 7-seq | 1,218 kg (dry) |
| McLaren Speedtail | 787 kW / 1,070 PS @ 7,000 | 1,150 Nm @ 5,500–6,500 | 3.0 s (0-300 12.8 s) | 403 (Velocity) | 7-DCT | 1,430 kg (dry) |
| Ferrari F80 | 883 kW / 1,200 cv (900 ICE + 300 e) | 850 Nm @ 5,550 + e-fill | 2.15 s (0-200 5.75) | 350 | 8-DCT | 1,525 kg (dry) |
| Koenigsegg Jesko | 954 kW / 1,280 hp @ 7,800 (E85: 1,193 kW / 1,600 hp) | 1,000 Nm @ 2,700–6,170 (E85 1,500 @ 5,100) | 2.5 s | ~425 drag-limited (Attack) / **531 claimed (Absolut)** | 9-LST | 1,420 kg |
| Tesla Model S Plaid | 760 kW / 1,020 hp tri-motor | ~1,420 Nm combined | 2.1 s (w/ 1-ft rollout: 0-60 1.99 s) | 262 governed / 322 Track Pack | 1-speed | 2,162 kg |
| Mercedes-AMG GT Black Series | 537 kW / 730 PS / 720 hp @ 6,900 (flat-plane V8) | 800 Nm @ 2,000–6,000 | 3.2 s | 325 governed | 7-DCT | 1,615 kg |
| Aston Martin Valkyrie | 853 kW / 1,160 PS combined (1,000 hp V12 @ 10,500 + ~160 hp KERS) | 900 Nm combined | 2.5 s | 350 | 7-seq | 1,030 kg (dry) |
| Ferrari 250 GTO | 221 kW / 300 PS @ 7,500 (Colombo V12, six Webers) | 294 Nm @ 5,500 | 6.1 s | ~280 | 5-manual | 880 kg (dry) |
| Lamborghini Revuelto | 747 kW / 1,015 CV combined (825 CV V12 @ 9,250 + 3 e-motors) | ~1,100 Nm combined | 2.5 s | 350 | 8-DCT | 1,772 kg (dry) |
| Porsche 918 Spyder | 652 kW / 887 PS combined (608 PS V8 @ 8,700 + 2 e-motors) | ~1,280 Nm combined | 2.6 s | 345 | 7-PDK | 1,674 kg |
| Porsche Taycan Turbo GT | 815 kW / 1,108 PS overboost (dual PSM, 2-speed rear) | ~1,340 Nm | 2.2 s | 305 | 2-speed | 2,220 kg |
| Toyota Supra MK4 (A80) | 243 kW / 330 PS @ 5,600 (2JZ-GTE sequential twin-turbo I6) | 427 Nm @ 4,000 | 4.9 s | 250 governed | 6-Getrag manual | 1,615 kg |
| Hennessey Venom F5 | 1,355 kW / 1,817 hp @ 8,000 (6.6 L twin-turbo 'Fury' V8) | 1,617 Nm @ 5,000 | 2.6 s | 484 (301 mph design) | 7-single-clutch | 1,360 kg (dry) |
| Lotus Evija | 1,500 kW / 2,039 PS (quad-motor EV, one motor/wheel) | 1,704 Nm | 2.9 s | 349 governed | 1-speed | 1,680 kg |
| Mercedes-AMG One | 782 kW / 1,063 PS combined (1.6 L V6 F1 turbo-hybrid @ 11,000 + 4 e-motors) | ~900 Nm combined | 2.9 s | 352 governed | 7-AMG SPEEDSHIFT | 1,695 kg |
| Rimac Nevera | 1,400 kW / 1,914 hp (quad-motor EV, one motor/wheel) | 2,340 Nm | 1.81 s | 412 governed | 1-speed | 2,150 kg |
| Chevrolet Corvette ZR1 | 794 kW / 1,064 hp @ 7,000 (5.5 L flat-plane twin-turbo V8, LT7) | 1,123 Nm @ 6,000 | 2.4 s | 375 governed | 8-DCT | 1,665 kg |
| McLaren P1 | 674 kW / 916 PS combined (3.8 L twin-turbo V8 @ 7,300 + IPAS e-motor) | 900 Nm @ 4,000 | 2.8 s | 350 governed | 7-DCT | 1,395 kg (dry) |
| Ferrari F40 | 352 kW / 478 PS @ 7,000 (2.9 L IHI twin-turbo V8, F120A) | 577 Nm @ 4,000 | 4.1 s | 324 (drag-limited) | 5-manual | 1,100 kg (dry) |
| Porsche 917K | 441 kW / ~600 PS @ 8,400 (4.9 L air-cooled flat-12, Type 912) | ~500 Nm @ 6,400 | 2.9 s | ~360 (Le Mans) | 5-manual | ~800 kg |
| Mitsubishi Lancer Evolution X FQ-440 MR | 324 kW / 440 PS @ 6,500 (2.0 L 4B11T turbo I4) | 549 Nm @ 3,500 | 3.8 s | 250 governed | 6-SST | 1,560 kg |
| Nissan GT-R Nismo (R35) | 441 kW / 600 PS @ 6,800 (3.8 L VR38DETT twin-turbo V6) | 652 Nm @ 3,600 | 2.7 s (1-ft rollout) | 315 | 6-DCT | 1,720 kg |
| BMW M5 (G90) | 535 kW / 727 PS combined (4.4 L S68 twin-turbo V8 + e-motor) | 1,000 Nm | 3.5 s | 305 (M Driver) | 8-Steptronic | 2,435 kg |
| Audi R8 V10 Performance | 456 kW / 620 PS @ 8,000 (5.2 L NA V10, dry sump) | 580 Nm @ 6,400 | 3.1 s | 331 | 7-S tronic | 1,595 kg |
| McLaren F1 (1993) | 461 kW / 627 PS @ 7,400 (6.1 L BMW S70/2 NA V12) | 651 Nm @ 5,600 | 3.2 s | 386.4 (Nardò, 1998) | 6-manual | 1,138 kg |
| Gordon Murray T.33 | 447 kW / 615 PS @ 11,500 (3.9 L Cosworth GMA NA V12) | 451 Nm @ 9,000 | 3.0 s | 333 | 6-Xtrac manual | 1,090 kg |
| Koenigsegg Agera RS | 865 kW / 1,176 PS @ 7,800 (5.0 L twin-turbo V8) — 1,000 kW / 1,360 PS on the 1 MW package | 1,280 Nm (1,371 on 1 MW) | 2.8 s | 429; **447.19 two-way record**, Nevada SR 160, 4 Nov 2017 | 7-DCT | 1,395 kg |
| Yangwang U9 **Xtreme** | 2,219 kW / 3,018 PS (four 30,000 rpm motors, one per wheel, 1,200 V) — 960 kW / 1,306 PS as the standard U9 | 1,680 Nm | 1.9 s | **496.22 (ATP Papenburg, 14 Sep 2025 — the fastest production car ever)**; 309 standard | 1-speed × 4 | 2,480 kg |
| Aston Martin DB5 | 210 kW / 282 bhp @ 5,500 (4.0 L DOHC straight-six, three SU HD8) — 242 kW / 325 bhp in Vantage spec | 390 Nm @ 3,850 | 7.1 s | 233 (246 Vantage) | ZF 5-manual | 1,466 kg |
| Mercedes-Benz 300 SLR Uhlenhaut Coupé | 228 kW / 310 PS @ 7,400 (3.0 L M196 desmodromic straight-eight, Bosch direct injection) | 314 Nm @ 5,950 | 6.9 s | 290 (300 on the Le Mans axle) — the fastest road-legal car of 1955 | 5-transaxle | 1,117 kg |
| Czinger 21C | 932 kW / 1,250 hp combined (2.88 L twin-turbo flat-plane V8 to 11,000 + 2 front e-motors) — 1,007 kW / 1,350 hp as V Max | 1,210 Nm | 1.9 s | 407 (452 V Max) | 7-sequential | 1,250 kg |
| Alfa Romeo 33 Stradale | 456 kW / 620 CV / 612 hp @ 6,750 (3.0 L twin-turbo 90° V6, mid-mounted) | 720 Nm @ 2,500–5,500 | 3.0 s | 333 | 8-DCT | 1,500 kg |
| SSC Tuatara | 1,007 kW / 1,350 hp on 91 octane, **1,305 kW / 1,750 hp on E85** (5.9 L twin-turbo flat-plane V8, Nelson Racing Engines) | 1,735 Nm | 2.5 s | **474.8 recorded** (295.0 mph, Launch and Landing Facility, 14 May 2022); 455.3 two-way | 7-CIMA | 1,247 kg dry |
| Gordon Murray T.50s Niki Lauda | 541 kW / 725 bhp @ 11,500 (3.9 L Cosworth GMA NA V12, 12,100 rpm) | 485 Nm | **2.6 s — DERIVED, not a factory figure** (GMA publish none for a track-only car) | ~318 drag-limited, fan + delta wing + fin | 6-Xtrac paddle | **852 kg** |
| Jaguar XE SV Project 8 | 441 kW / 600 PS / 592 hp @ 6,500 (5.0 L supercharged AJ133 V8, Roots-type twin-vortex blower in the vee) | 700 Nm @ 3,500–5,000 | 3.7 s | 322 (200 mph) | 8-ZF auto | 1,745 kg (1,732 with the Track Pack) |
| Honda S2000 (AP1) | 176 kW / 240 PS / 237 hp @ 8,300 (2.0 L F20C DOHC VTEC I4) — **120 PS per litre**, the NA production record at launch; the AP2's 2.2 F22C1 makes 237 hp @ 7,800 | 208 Nm @ 7,500 (AP2 220 @ 6,800) | 6.2 s | 241 (150 mph — reached, not governed) | 6-manual | 1,260 kg |
| Ford Mustang GTD | 608 kW / 815 hp @ 7,400 (5.2 L supercharged cross-plane V8, 2.65 L twin-screw blower) | 900 Nm (664 lb-ft) @ 4,800 | 3.0 s — DERIVED from Ford's 0-60 mph 2.8 s | 325 (202 mph); 338 in Track mode | 8-DCT **transaxle** | 1,950 kg |
| Mazda RX-7 Spirit R (FD3S) | 206 kW / 280 PS @ 6,500 (1.3 L 13B-REW **twin-rotor Wankel**, SEQUENTIAL twin turbos) — 654 cc × 2 | 314 Nm @ 5,000 | 5.2 s | 250; the JDM car was limited to 180 | 5-manual (Mazda's published table) | 1,270 kg |
| Rolls-Royce Phantom VIII | 420 kW / 563 PS / 571 hp @ 5,000 (6.75 L twin-turbo V12, N74B68) | **900 Nm at 1,700 rpm** — all of it, just above idle | 5.4 s | 250 governed | 8-ZF, satellite-aided | 2,560 kg |
| Rolls-Royce Spectre Black Badge | 485 kW / 659 PS (two motors, 102 kWh) — 430 kW / 584 PS as the standard Spectre | 1,075 Nm from rest (900 standard) | 4.1 s | 250 governed | 1-speed | 2,975 kg |
| 2026 F1 (all 11 teams) | 745 kW / 1,013 PS combined (1.6 L V6 turbo-hybrid, ~50/50 split) | 900 Nm combined | 2.6 s | ~350 (drag-limited, active aero) | 8-seq | 768 kg (min.) |
| 2026 Dakar (all 4 cars) | ~265 kW / ~360 hp (air-restricted T1+ Ultimate; Ford = 5.0 NA V8, rest = twin-turbo V6) | ~620 Nm | 5.3 s | 170 km/h governed | 6-seq | ~2,000 kg (T1+ min.) |

**The five newest road cars** each carry one *real* ultimate-speed feature on **key Z**, opt-in
and OFF by default so `tests/perf-test.mjs` never sees it and certification is untouched:
the Agera RS's **1 MW package** (larger turbos on E85: 1,176 → 1,360 PS, 429 → 447 km/h — the
map that set the record), the U9's **standard specification** (the Xtreme is the car the sim now models, so Z drops
it the other way: 3,018 → 1,306 PS, 496 → 309 km/h), the DB5's **Vantage specification** (three Weber 45DCOE and a
hotter cam: 282 → 325 bhp), the 300 SLR's **Le Mans final drive** (3.11 → 2.76, 290 → 300 km/h)
and the 21C's **V Max** configuration (wing flat, 1,250 → 1,350 hp, 407 → 452 km/h). Each has
its own sound and its own on-screen flag in the cluster.

**The Jesko is two cars, on two different keys.** **Z** is the **fuel map** — petrol 1,280 hp,
E85 1,600 hp / 1,500 Nm — and **Y** is the **body**, which is not a setting but a different car
from the windscreen back. The **Attack** (default, and what the certified 0-100 = 2.5000 s is
measured on) carries the boomerang wing on twin pylons and up to 1,400 kg of downforce;
Koenigsegg publish no top speed for it because in that aero it is genuinely drag-limited —
**~425 km/h on E85** here. The **Absolut** deletes the wing for **two rear-deck fins**, re-shapes
the front splitter winglets and louvers, adds **85 mm of tail** and offers removable **aero wheel
covers**: downforce falls to **150 kg** and Cd comes out at **0.278** on 1.88 m² (the programme was
aiming at 0.28). Koenigsegg claim **~531 km/h / 330 mph** in ideal conditions and no run has ever
been made — so 531 is the Absolut's governor and the Attack's ceiling (560) is never reached.
All of it is real geometry in the exterior SVG (`kgAbsolutFins`, `kgAbsolutTail`,
`kgWheelCovers`, `kgWingPylons`) rather than a label, the "Rear Wing" control becomes a
disabled "Deck Fins (fixed)", and `perf-test` certifies **both** bodies — the Attack in its
drag-limited band and the Absolut on the exact claim.

**Q Branch (Aston Martin DB5 only)** — a `data-view="qbranch"` tab after Exterior with the
eight pieces of special equipment fitted to chassis DP/216/1 for *Goldfinger* (1964), each on
its own number key **1–8** and each with a real sound and a real on-track effect drawn by
`drawQBranch`: revolving number plates (GB / CH / F), Browning .30 wing guns (104 rounds,
muzzle flash and tracers), the bulletproof rear shield, tyre-slashing hub blades, the rear oil
slick (rivals that drive through it lose grip), the smoke screen, the passenger ejector seat
(the roof panel goes first) and the dash-top tracker scope, whose blip is the nearest live
rival. `qStep(dt)` runs from `updatePhysics`; all of it is opt-in, so the certified figures
stand.

**DB5 Mission mode — seven stage missions, 47 stages, plus the campaign** — the Circuit tab carries seven
point-to-point routes that are **not circuits**: no laps, no kerbs, no racing line, no
start/finish, no armco, and none of the shared roadside furniture — a stage draws its own
world instead. Each is a **stage machine** (`STAGE_SETS`, module
scope so the renderer sees it too) where every stage owns its **surface, furniture, gate and
failure**. The gate is the stage's own `met(state, kit, mission)` predicate: miss it and
`stageStep` clamps `distanceM` and takes your speed away — you physically cannot go on. A run
is **one-way** (braking cannot drop you back a stage, which the Matera doughnut requires).
Enemies arrive **per stage** (`SEA_ENEMIES`/`TOK_ENEMIES`/…), and a `target` retires when its
stage ends.

| mission | film | stages | the beats |
|---|---|---|---|
| `Mission — Oil Platform, Pacific` | Cars 2, the opening | 10 | Crabby → Tony Trihull → magnet climb → under the deck → oil+fire → the span → helipad → hydrofoil → four tyres → submarine |
| `Mission — Tokyo, World Grand Prix` | Cars 2, Tokyo | 7 | the party carpet → the washroom and Rod Torque Redline → the night street race → through the barrier → the alleys → the Rainbow Bridge → Haneda |
| `Mission — Paris, the parts market` | Cars 2, Paris | 5 | into Paris → the Seine quay → the Marché aux Pièces and the tracker scope → he sees you in a mirror and runs, putting his stock down behind him → cornered in a dead end, and the photograph |
| `Mission — Porto Corsa, the casino` | Cars 2, Porto Corsa | 8 | the Ligurian coast road → put the real Ivan out → tow Victor Hugo up the carpet → the casino floor on somebody else's plates → the back room, the bosses and the kingpin on a screen → the disguise comes off → the Grand Prix and the pulse camera → out over the Casino Bridge |
| `Mission — London, the last race` | Cars 2, London | 5 | inside Big Bentley's movement → the circuit → the pit box and the bomb in your air filter → the rocket run out of detonator range → The Mall, five minutes, Buckingham Palace |
| `Mission — Furka Pass & Auric Enterprises, 1964` | Goldfinger | 6 | the pass behind the Phantom III → Tilly's Mustang and the slashers → the refinery → the yard → the woods and the ejector seat → the mirror Bond drove into |
| `Mission — Cars 2, the whole thing` | Cars 2, all of it | 40 | the five locations end to end in the film's order, flown between in **Siddeley** — whose hold is where the case comes out, where you look at what you brought back, and where you are told the next place |
| `Mission — Matera, 2021` | No Time to Die | 5 | the Sassi → the limestone steps → Piazza San Giovanni Battista and the 360 with the miniguns → the smoke screen → the gorge road |

**35 distinct surfaces** are drawn out of six shared helpers (`deckStrip`, `seams`, `wall`,
`handrail`, `props` — world-anchored so furniture arrives and passes rather than travelling
with the camera — and `flood`), plus two that fill the places that were empty, **`crowd`**
and **`traffic`** (both world-anchored, so a spectator you have passed stays passed and a car
you overtake does not teleport back in front of you): timber deck · warship flight deck ·
braced leg · under-deck girders · open grating · through truss · helipad · open sea ·
submerged · red carpet · tiled corridor · wet neon street · alley · suspension bridge ·
airport apron · clock movement · London street · pit lane · The Mall · alpine pass · refinery ·
night forest · the mirror wall · Matera limestone · steps · piazza · gorge viaduct ·
**Ligurian coast road · Porto Corsa quayside · casino floor · the back room · Paris boulevard ·
the Seine quay · the Marché aux Pièces train shed · the market aisles**.

The **daylight** stages are the Furka Pass and the whole Porto Corsa Riviera (`DAY_SURFACES`);
everything else is at night, which is when the films set it. Tokyo and London used to be empty
streets — a World Grand Prix with nobody watching it, The Mall on the day of the last race with
nothing behind the rail, and a pit lane with no crew. They now carry grandstands four and five
deep with camera flashes going off, ambient traffic on the Rainbow Bridge and The Mall, a car
and a crew in every garage, and the team stood on the pit wall.

**A stage that is a room has to be a room.** Both new routes first put 120–140° corners in the
middle of their interior stages, so standing on the casino floor you were looking at the inside
of a bend and the room itself was off-screen. The tight corners now sit at the **transitions** —
where you really are turning into a doorway or a lift — and the rooms run nearly straight
(`c(3000, -1, 22, 200)` across the casino floor, `c(3700, -1, 16, 220)` down the length of the
table), because a casino floor and a boardroom are places you can see the far end of.

**The Cars 2 opening, stage by stage** — the sequence in the film: Finn is aboard the crab
boat **Crabby**; **Tony Trihull** (a combat ship drawn from *USS Independence* LCS-2 — a
127.4 m aluminium trimaran, 44 kn, hull number 02) puts his light and his gun on Crabby and
orders him off; Finn is already on Tony's transom on his harpoons; at the platform he hooks
the barrier, releases Tony, switches to **steel magnet wheels** and drives up a leg; under the
deck he hangs and photographs **Professor Zündapp's box** and the crate holding what is left
of **Agent Leland Turbo**; he is seen; then oil, fire, rockets, the span he drops behind him,
the helipad, off the edge, hydrofoils, Tony's torpedo — and **four tyres left floating** so
everyone is sure they killed him. Then the submarine.

| stage | you are driving on | what has to happen | how you lose it |
|---|---|---|---|
| `crabby` | Crabby's timber deck, bulwarks, pots | harpoon into Tony's transom (**G**) | Tony fires on Crabby (34 s) |
| `ride` | Tony's non-skid flight deck, both amas, the 57 mm | second harpoon onto the rig (**G**) | he carries you past the platform |
| `climb` | the braced leg face, sea dropping away | **magnets on (M)** | magnets off ⇒ you slide and fall |
| `lip` | the underside of the main deck, girders overhead | **camera up (P)**, frame with A/D, three shutters | magnets off, or 70 s hanging there |
| `chase` | open steel grating, modules, floods | **oil (5) then a round through it (2)** | they run you down |
| `bridge` | a through truss with nothing either side | **limpet (K)**, and be clear | still on the span when it goes |
| `helipad` | the pad, the H, the deck edge | **hydrofoils down (F)** | over the edge with the wheels down |
| `water` | open sea, foilborne, Tony astern | stay off his line | his guns |
| `dead` | same, torpedo running | **eject the four tyres (J)** | the torpedo finds a car, not a decoy |
| `sub` | submerged — light shafts, particulate, sonar | **dive (J)** | — |

Finn's kit is **mission-only** (`seaFire(what)`, and `onSea()` gates all of it), so the
certified DB5 figures never see it: **G** harpoon · **M** magnet wheels · **P** spy camera ·
**B** tail rockets · **K** limpet charge · **F** hydrofoils · **J** tyres/dive. Each has its own
synthesised sound built from the mechanism (`seaHarpoon` is a gas launch plus a wire paying
out; `seaMagnet` is a contactor closing then a 100 Hz field; `seaShutter` is a leaf blade then
a film wind; `seaTorpedo` is a screw closing on you). `stageStep(dt)` runs from
`updatePhysics`, `stageForce()` adds the grade on the leg and the water drag on the sea,
`stageCapMps()` caps each stage, and `drawStage(w,h,pal)` paints the surface.

**Exteriors — every road car is now DRAWN BY HAND.** All **41** road-car bodies are written out
car by car: the eleven that always were (Evo X · GT-R Nismo · M5 · R8 · McLaren F1 1993 · T.33 ·
Agera RS · U9 · DB5 · 300 SLR · Czinger 21C) plus the **30** in `tools/bodykit/drawn.mjs`, which
`DRAWN` now covers completely. `apply.mjs` prefers `DRAWN[key]` and falls back to the generator,
so the generator is still the safety net for a new car but no longer draws anything shipped.
(The F1 grid and the Dakar cars are drawn by `openwheel.mjs` / `raid.mjs`, which is right — eleven
F1 cars really are one chassis in eleven liveries.)

A hand drawing has to do for itself the two things the generator did automatically, and both were
got wrong at least once here before the render caught them:

- **the haunch** — the body top must sit *above* the wheel-arch apex at each axle, or the tyre
  stands proud of the bodywork and the car reads as an open-wheeler;
- **the roofline is the OUTLINE, not the glass** — writing a deck from the glass line puts the tail
  30–50 px too low, and the body comes out as a thin slab with the cabin sitting on it like a box.

The roof is **painted metal**, in all 40 closed cars (the 918 is a Spyder and has no roof at all — its
outline has a NOTCH cut where a coupe's roof would be, so the cockpit is a real opening you look into
rather than a shape painted on the side): the glass top edge is drawn *below* the body outline so a
band of body colour shows above it, and that band gets its own highlight. Every drawing here once
had its DLO on the roofline instead, which made the roof glass and the cabin a bubble.

`specs.mjs` is still the source of truth for the numbers — length, wheelbase, height, both
overhangs, wheel diameters, and the `roof: [[xFromFront, yFromRoofPeak], …]` array — and every
hand-drawn outline is written from them. `tools/bodykit/render.mjs` + `detail.mjs` remain as the
fallback generator, and its **furniture** vocabulary is the checklist a new drawing is measured
against:

| part | what it carries |
|---|---|
| **daylight opening** | a real windscreen, side glass and backlight, following the roofline with the same quadratics the body uses, with a surround (chrome · satin · gloss black · none), painted A/C pillars, B-pillar splits for the saloons, a vent window and a drip rail for the pre-1970 cars |
| **front end** | the grille as a distinct object — `horseshoe` (Bugatti) · `eggcrate` (250 GTO, 33 Stradale) · `singleframe` · `kidney` · `slot` (F40) · `mouth` · `shark` (917K, Valkyrie, T.50s) · `mesh` · none (the EVs) — plus the lamp (`round` · `coveredRound` · `quadRound` · `pop` · `strip` · `boomerang` · `slit` · `cluster`), the lower intake, a chrome bumper and the bonnet shutline |
| **rear end** | `roundPair` / `roundSingle` / `bar` / `stack` / `slim` lamps, the engine vent (`louvre` · `mesh` · `glassEngine`), a finned diffuser and a ducktail or lip |
| **flanks** | `naca` · `blade` · `gill` · `strake` · `skirt` · `intake` · `cline` · `louvre` · `scoop` · `sidepipe` · `fuelcap` · `chargeport` · `coveredRear` · `sideNumber` · `stripe` · `fin` · `tunnel` (Evija) · `fan` (T.50s) · `topexit` (918) · `airbox` · `rollhoop` |
| **wheels** | `wire` (Borrani) · `fuchs` · `mesh` (BBS) · `telephone` · `split` · `basket` · `dish` · `five`/`seven`/`ten`/`turbine`, each with the car's own rim colour |

Furniture that lies **flat** on a panel is drawn under the body's clip; furniture that stands
**proud** of it (a fin, a roof airbox, roll hoops, the fan, a faired-in rear wheel) is drawn on top,
because the clip cuts it in half. Everything at the nose and tail is placed as a **fraction of
length** and hung off the body's own surface at that station — placing it in frame pixels is what
left every lamp clipped to a white sliver hanging past the bumper.

**Eleven exteriors are off limits to the tooling entirely** (Evo X · GT-R Nismo · M5 · R8 ·
McLaren F1 1993 · T.33 · Agera RS · U9 · DB5 · 300 SLR · Czinger 21C). They live inline in their
own simulator files rather than in `drawn.mjs`; `apply.mjs` refuses to touch them and
`tests/browser-test.mjs` fails if it ever does — the generator flattened six of them once.

The block written into each sim is **fenced** (`BODYKIT:BEGIN` … `BODYKIT:END`) so `apply.mjs` can be re-run:
the SVG carries its own `<style>` block, so a brace counter walking out of `injectExterior()` stops
in the wrong place and swallows the next function. `browser-test` runs the generator a second time
and fails on any byte of drift, and measures the roofline set (mean pairwise difference ≥ 0.115, no
pair closer than 0.038) and the furniture set (no two cars wearing the identical kit).

**Seeing behind you (all 52 cars)** — three faults made the world behind the car a void:

- `drawRivals` called `projectAhead(Math.max(0.6, ahead))`, so a rival 40 m **behind** was
  projected 0.6 m in front of your nose, where the scale clamp squashed it out of sight.
  Turn the car round and the entire field vanished until it came past you again. It now
  passes the real relative distance and lets `projectRoad` decide — that already drops
  anything behind the camera and returns it once you have turned to face it.
- `ROAD.BEHIND` was 200 m but **`ROAD_OFFS`**, the distances the road surface is actually
  drawn at, started at **-80**. So looking back you got 80 m of tarmac and then nothing, and
  a corner you had just driven appeared out of thin air. Both now reach **240 m**, the same
  as ahead.
- the mirrors were decoration. There is now **one** rear-view renderer (`rearProject` +
  `drawRearView`): the *same* projection as the forward view, run with the camera through
  180° and the image flipped left-for-right the way glass does it — so the bend in the glass
  is the bend you just drove and the cars in it are where they actually are. It samples
  `REAR_OFFS` in **both** directions and keeps whatever has `fwd > 0`, because a mirror
  looks opposite the nose of the car rather than "backwards along the road": reverse, or
  spin the car, and what it shows is the road at a *positive* offset.

`MIRROR` is a per-car object — position, size, mounting and housing — so a mirror looks
like it came off that car, the way the dashboards do. Each pod carries its own **eye**
(where it is mounted on the flank, in metres) and **yaw** (how far outboard it is aimed),
which is what makes a left and a right pod show genuinely *different* things: a car can be
in one and not the other, and each shows a slice of your own bodywork on its inboard edge.

| layout | cars | where, and what it looks like |
|---|---|---|
| `side` | **Valkyrie** | two camera screens in the **dash corners** — teal bezel, scanlines, a live tally |
| `side` | **Speedtail** | no mirrors in reality: two screens flanking the **central seat** |
| `side` | the eleven **2026 F1** cars | small pods on **sidepod stalks**, aimed wide, team-coloured |
| `centre` | 1950s–60s (250 GTO · DB5 · 300 SLR · 917K) | a small **chromed** oval, high on the screen |
| `centre` | 80s–90s (F40 · McLaren F1 · Supra · Evo · GT-R) | a black **plastic** rectangle |
| `centre` | the hypercars | a thin **carbon** blade with a woven edge |
| `centre` | the EVs (Tesla · Taycan · Evija · Nevera · U9) | a **frameless** glass slab on a stalk |
| `centre` | the four **Dakar** cars | a **rally** mirror, thick matte bezel, bolted to the cage |

The interior mirror sits high on the windscreen (`fy` 0.11–0.26), which is **above the
horizon** — so it never sits on the road — and below the topbar, so it never sits on the HUD.
It appears only when there is something in it.

Everything you drop — oil, smoke, an armed limpet — goes in the glass too, at its real
distance, so the DB5's mirror is the same code as everyone else's rather than a bespoke one.
Before this, the draw code called `projectAhead(-rel)`, a *positive* distance, so every slick
and puff in every sim was painted **in front of** you, receding up the road you were driving
into. The physics was always right; only the picture lied. A small mirror has to be legible
before it is faithful, so the tarmac is lifted off the verge: on a street circuit `pal.road`
and `pal.grass` are both near-black and the image came out correct and unreadable.
`tests/browser-test.mjs` fails on any `projectAhead(-rel`, on the 0.6 m clamp, on a road
table that does not reach 240 m back, on a sim with no rear-view renderer, and on a wrong
mirror style.

`MISSIONS` gives each stage a brief, a time limit, a damage allowance and its objectives;
`missionStep(dt)` runs from `updatePhysics` and `drawMissionHud` draws the board (clock,
damage pips, objective ticks). Enemies carry a **role** and the gadget that answers it:

| role | what it does | the answer |
|---|---|---|
| `target` | must stay within `loseM` or the mission is lost | drive |
| `shooter` | fires at you every ~1.6 s | the **bulletproof shield** — it blocks the shot outright |
| `guard` | has hit points | the **wing guns**, the **slashers** alongside, or the **oil slick** |
| `boarder` | latches on behind and gets in after 12 s | the **ejector seat** |

Smoke blinds anything within 60 m behind for 3 s. You lose on the clock, on
`hits >= maxHits`, on losing the target, or on being boarded too long.

The four **2026 Dakar** cars share **one calibrated chassis SPEC** (like the F1 grid — a single
`--calibrate dacia` certifies all four at 0-100 = 5.3 s; the FIA air-restrictor equalises T1+ power,
so raw straight-line performance is real *because* it's near-identical). They differ in livery
(`var(--f1body)`/`var(--teal)`), engine + **unique sound** (Ford = 5.0 NA V8, 4 pulses/rev, no turbo;
the three V6s differ by `_satCurve`/turbo), one unique special stage each, and a per-car
`TEAM = {pace,top,corner,tyreDeg,pitCrew,rel,dnf,dns,fix,slot,causeEng}` encoding the **real July-2026
Dakar result** — so **performance, tyre deg and damage/reliability differ per car** (top speed via
`realTop()` shows in every mode; `TEAM.rel`/`tyreDeg`/`pitCrew` drive damage growth `1/rel`, wear and
service time in Rally Stage Mode):

| Car | pace | top | corner | tyreDeg | rel | dnf | signature failure |
|---|---|---|---|---|---|---|---|
| Dacia Sandrider | 1.000 | 1.000 | 0.996 | 0.97 | **0.94** | 0.05 | an engine issue (won 2026 — most reliable) |
| Ford Raptor T1+ | 0.996 | 0.999 | 0.988 | 1.02 | 0.80 | 0.11 | a broken front axle (fast but fragile; Sainz barely finished) |
| Toyota GR DKR Hilux | 0.994 | 0.996 | 0.994 | 1.00 | 0.77 | 0.13 | a mechanical failure (all-new car; Al-Rajhi's stage-4 DNF) |
| Prodrive Hunter | 0.976 | 0.992 | 0.978 | 1.06 | **0.72** | 0.15 | engine trouble (privateer — least reliable) |

The shared `RM_GRID` rival field encodes the same real 2026 form (Al-Rajhi retires ~stage 4, Sainz
breaks an axle, Dacia runs clean), so rival retirements track the actual race.

**Dakar stages on the capable road cars** — the seven shared Dakar stages (+ full terrain/dune/bump
physics: `terrainStep`, terrain-aware `roughnessAt`, `terrainGrip`, desert palettes/scenery) are also
injected into the road cars that could plausibly attempt off-road — the AWD/robust set **Bugatti
Chiron, Tesla Model S Plaid, Taycan Turbo GT, Revuelto, 918 Spyder, Supra MK4**, plus the two later
AWD quad-motor EVs **Lotus Evija and Rimac Nevera** (cloned from Tesla). The ultra-low, slick-shod,
ground-effect cars (Valkyrie, F80, AMG Black, Speedtail, Huayra BC, Jesko, 250 GTO — and the later
Venom F5, AMG One, Corvette ZR1, McLaren P1) are left tarmac-only. Terrain is route-gated, so each
road car's certified 0-100/top/braking is untouched; they keep their own cockpit/dashboard and simply
gain the stages in the Circuit tab.

**Road-car Real Mode (light)** — all **24 road cars** now have a Circuit-tab **Real Mode** toggle
(`realBtn`, `toggleRealMode`). ON: `realStep(dt)` grows real per-system damage `sys = {engine, gearbox,
brakes, tyre, susp, body}` from real stress (revs→engine, shifts→gearbox, braking→brakes, tyre-wear²→
tyre, `roughnessAt`·speed + airborne→susp, offs→body) scaled by `1/REL` (a per-car reliability — Tesla
0.95/Supra 0.94 tough … Valkyrie 0.72/250 GTO 0.70 fragile), so **damage grows far faster on the rough
Dakar stages**; a system at 1.0 is a retirement. Tyre wear + damage fade grip via `realGrip()` and power
via `realPower()` (both `1` when OFF, so certification is untouched — perf-test never toggles it). The
telemetry overlay shows `REAL tyre% dmg%`. This is the lighter cousin of the F1/Dakar Real Mode (no
drive-in pit / rival-DNF layer).

The eleven F1 cars share **one calibrated chassis SPEC** so a single
`--calibrate f1mercedes` certifies all eleven at the same exact 0-100; they differ
in livery (`var(--f1body)` body + `var(--teal)` accent), race number, engine badge,
a per-engine `_satCurve` timbre, and a per-team `TEAM = {pace,top,corner,tyreDeg,
pitCrew,dnf,dns}` object (real pecking order + reliability). Feature set is
F1-specific: ERS **Override** boost (not a road-car special), e-Deploy gauge, halo
+ survival cell, active aero (X/Z), detachable F1 wheel, slicks.

**Real Race Mode** (Circuit tab toggle, F1 only, OFF by default so the certified
0-100 stays exact): flips assists off + the full 2026 grid on and runs every team
to its own `TEAM` pace/reliability. `realPower()`/`realTop()`/`realGrip()` (all `1`
when off) fold in tyre wear (grip fades over a stint; soft/med/hard degrade
differently), fuel burn (car lightens) and damage. `realStep(dt,dsdt)` runs the
per-step sim: tyre/fuel, **probabilistic per-system reliability**, the **drive-in
pit-lane state machine** and the safety car.

**Probabilistic damage (v3)** — no abstract "damage number." Both you and every
rival carry named systems `sys = {engine, gearbox, hydraulics, brakes, tyre, nose}`
(0..1). **Yours grow** each step from real stress (revs → engine, shifts → gearbox,
braking → brakes, tyre-wear² → puncture risk) scaled by `(safetyCar?0.3:1)/TEAM.rel`
so a fragile team wears ~2× faster; a system hitting 1.0 is a *real* failure (retire,
or a puncture that limps you to the pits). A clean race finishes; a thrashed or
contact-heavy one breaks — per team. **Rivals** pre-roll a mechanical DNF at seed:
`willDnf = rand < clamp(rm.dnf*1.4, .32)` firing at a spread `dnfAtT` (so ~0–4 cars
retire per race, most-fragile teams most often), plus per-team `dns`. This runs in
**private practice too** (F1 cars always race the full 11-car grid with reliability).
`onRaceLap()` just advances `raceLap`.

**Rivals live real races (v5)** — every rival tracks tyre `wear` and pits at **its
own garage** (`boxPhAt(slot,L)`; `slot` = 2025 WCC garage order from pit entry:
McLaren, Mercedes, Red Bull, Ferrari, Williams, RB, Aston, Audi, Haas, Alpine,
Cadillac last) for `rm.pit` seconds (+repairs × `rm.fix`); contact sets `needsFix`
so they call in for a wing. When the pre-rolled DNF fires: `crashy` cars spin and
park **off the road** as a wreck (75% SC), tyre/nose failures **limp to the pits
and vanish into the garage** (`gone`), engine-type failures coast off-line and park.
**DNS cars never appear on track** (`gone: true` at seed). `gone` cars are skipped by
rendering, the minimap, `racePosition`, `fieldSize` (which also no longer counts the
safety car) and the gap HUD. TEAM/RM_GRID/ERS constants encode the **real July-2026
season** (researched): WCC Mercedes > Ferrari > McLaren > Red Bull > Alpine > RB >
Haas > Williams > Audi > Aston (1 pt) > Cadillac; Mercedes fastest but battery-module
failures (its `causeEng`/`cause` strings say so, also for customers McLaren, Alpine,
Williams); crews Ferrari 2.0 s > McLaren 2.15 > Mercedes 2.2 > RB 2.25 (2026 DHL
data). `realTop()` returns `TEAM.top` in **every** mode (top-speed spread, launch
untouched). The 2026 **MOM rule** gates ERS Override in real mode: only within ~1 s
of the car ahead. The player boxes at **their own team's slot** too, and `drawPitLane`
labels it "YOUR BOX" (`GARAGE_COLS`/`TEAM_SLOT`).

**v6** — `TRACK_WIDTH_SCALE` is **3.75** in the F1 sims (×1.5 wider). `checkContact`
runs in **every mode** (practice contact is real; `triggerSC` itself is real-mode-only
since an SC could never be recalled in practice) — so `tests/perf-test.mjs` clears
`state.rivals` after every `resetCar()` (certification = clear track; keep this when
adding PAGE_FNS). **Team radio speaks**: `radioCall(auto)` builds real engineer
content (box calls with your garage position, deg %, wing damage, fuel li-co, next
corner + apex advice via `curvatureAt`, gaps with MOM hint, position) and `radioSay`
voices it via **browser speechSynthesis** (en-GB preferred, no API). Auto-calls: tyre
wear crossing 0.75 (`_boxCalled`), SC deploy, pit release. The Radio button/H key +
the Cockpit "Team Radio" button route through it. `drawPitLane` draws a **pit wall**
(dark barrier + white top) and real **garage buildings** (roof band, team-colour
strip, dark open door, `GARAGE_NAMES` over the door, tyre stacks, crew at your box).

**v7** — **Live radio**: H / the Radio buttons now TOGGLE `state.radioLive`; a
scheduler in updatePhysics fires `radioCall(true)` every ~25–40 s (muting cancels
speech). **Drivable safety car**: the AMG sim has SAFETY CAR MODE (`toggleScMode`,
`scBtn` in Circuit tab) — `seedScRace()` grids 11 F1 cars (July-2026 pace) behind
you, `scStep`/`updateScRace` run the researched FIA procedure: formation lap →
peel into the pits → GREEN; on a crash you're deployed (spoken auto-reminders),
the field bunches in queue slots behind you (hard no-pass clamp), the wreck is
craned away after `scT`, "in this lap" → box → GREEN and the next incident is
pre-rolled. A race-control board (name/status/health per car) draws in
`drawTelemetry`; map dots get status rings. The index.html AMG card is now the
**FIA F1 Safety Car** (inline SVG livery: silver, green stripe, light bar).
**Learning mode (all 56 sims)**: a `data-view="learn"` tab AFTER Circuit — road
cars "Race Car 101", AMG "Safety Car 101", F1 "Formula 1 101" — with a curriculum
panel + `learnBtn` toggling `state.learnMode`: `drawLearningMarks()` paints
150/100/BRAKE boards, TURN IN, a LATE APEX cone (60% through the corner) and an
EXIT—POWER board around the next corner; the teal racing line stays on and
`drawMap` overlays the full racing line. All opt-in → certification untouched.

**v8** — width 3.75 in ALL 56 sims. `radioSay` uses cancel → setTimeout(60 ms) →
resume+speak plus a 4 s resume keepalive (Chrome silently drops queued utterances
otherwise). Learning is a **launch mode**: the learn tab is `display:none` until the
garage card's **Learning** button calls `app.enterLearning()` (index.html
`openLearning` polls `getSimApp()`). Each 101 is a real course: CONTENTS quick-nav,
two inline SVG diagrams, a per-car feature lesson (all 56 differ) and **Demo**
buttons → `app.learnDemo()` (Suzuka, test driver, gear engaged, markers on).
`analyseCorner()` CACHES the corner target (no board jitter) and classifies the
apex: straight after → LATE (frac .58), hairpin → V-LINE (.62), same-direction
double → EARLY (.38), S-complex → MID (.5); live racecraft overrides via
`rivalGaps()`: defending → EARLY .35 "own the inside", attacking → LATE .62 "get
the run". Boards count 300→50 **to the apex** with distance fade; a big yellow
apex dot carries the advice. The map draws an exaggerated line (no closePath
chord) plus a ZOOMED inset (track edges, exact blue line, apex dot, car). Pit-entry
radio names your garage (`ORD[TEAM.slot]`). DNS odds audited over 600 seeds
(McLaren 3.0%, Audi 5.5%, Cadillac 5.2% — all tracking their constants).

**F1-correct cockpit (v5)** — no road-car controls in the F1 sims: quick bar has
**Strat** (`cycleStrat`: Standard/Push/Lean — ±2% power, ×2.2/×0.6 engine wear,
fuel burn; default Standard so certification is untouched), **B-Bias** (`cycleBias`:
Std/Fwd/Rear — braking-only yaw feel), **Rain Light** (no headlamps on an F1 car);
bottombar **Radio** (was Horn; `teamRadio()` plays per-team `RADIO_LINES` pit-wall
calls; key H) and **Diff** (was ESC). Cockpit tab: pedal-box reach, cockpit temp,
Drinks Pump, Helmet Airflow, Dash Bright, Team Radio, Shift Lights (no seat
recline/climate/cabin-audio); "doors" are Steering Wheel / Headrest. The pit menu
has **no refuelling** (banned since 2010) — tyres + repairs only.

**Drive-in pit (v3/v4, no button)** — the pit is a real place you steer into: cross
to the pit side (`laneOffset < -halfWidth*0.72`) in the entry window (`ph ∈ [L-260,
L-20]`) and `inPitLane`/`pitStage:"enter"` arm automatically, the 80 km/h limiter
(60 at Monaco) engages, the car stops in its box → `#pitMenu` opens. The menu shows
a **car-shaped X-ray** (`#xrNose/#xrEng/#xrGbx/#xrFL…` rects + `#xr*T` % labels,
coloured green→red per `sys`) and a live repair plan (`pitPlan()` → `#pmFix`). The
crew fixes **every** damaged system, each costing time: wing/hyd/brakes/gearbox
reset to 0.05, the engine is only *nursed* (`max(0.2, eng*0.45)` — a PU can't be
swapped). Service = `TEAM.pitCrew` (Red Bull 2.0 … Cadillac 3.2 s) + fuel + repairs;
the car is **released in 1st gear** (`gearMode="G", curGear=1` — never stuck in N),
then `"exit"` rejoins at ph>100. Pit apron + team garages + green PIT board drawn in
the world (`drawPitLane`, real-mode only); **PIT branch on the minimap** (`drawMap`).

**Collisions** (`checkContact`, 1 s cooldown) damage **both cars**: your wing takes
0.09–0.20 `sys.nose`, the rival gets `hurtT` 5–10 s slow-down and a 35% chance its
pre-rolled DNF is pulled forward — survivable either way (one tap ≠ out).
**Track limits**: all four wheels over the line invalidates the lap (`lapInvalid`),
race warnings → black-and-white flag → `penaltyS`; walls on street circuits crash
you. **Safety car** = a **Mercedes-AMG GT Black Series** (`isSC` rival, silver body
/ green stripe) deployed by `triggerSC()` on a stoppage; it paces the field,
**no rival may pass it** (updateRivals clamps them 14 m behind), and **you
overtaking it 3× black-flags you out**. HUD panel (position, lap, stops,
tyre/fuel/damage bars, PIT LANE/limiter/LAP INVALID) draws in `drawTelemetry`. All
state is real-mode-gated, so perf-test is unaffected.

**2026 racing controls (v4, all modes, certification-safe because opt-in)** —
**hold X = X-mode**: active aero sheds drag (`ERS.xShed` off `cdA`) and 45% of
downforce-grip; auto-snaps back to Z under braking, >1.7 lateral g, or <~100 km/h.
**Hold V = ERS Manual Override**: `ERS.boost` power multiplier draining `ersStore`
(`ERS.storeS` seconds full-boost; recharges at `ERS.regen`, 3.5× under braking).
Each team has its own `const ERS = {storeS, regen, boost, xShed, blurb}` — real
2026 PU pecking order (Ferrari hits hardest 1.14, Aston/Honda biggest store 7.2 s,
Audi fastest recharge, Red Bull slipperiest X-mode 0.34, Cadillac smallest store).
ERS bar + X-MODE/OVERRIDE flags draw in `drawTelemetry`; keys listed in the help
panel. Perf-test never holds X/V, so the certified figures are untouched.




## The two Rolls-Royces — journeys, signals and the rear compartment

Everything the garage template assumes is wrong for these two. A Phantom on a circuit tells
you nothing about a Phantom, so the Circuit tab carries **seven point-to-point JOURNEYS**
(`loop: false`) through real streets in the order you would actually drive them:

| journey | the road | signals |
|---|---|---|
| `The Mall, London` | Park Lane · Hyde Park Corner · Constitution Hill · Buckingham Palace, 4.2 km | 5 |
| `Paris — Champs-Élysées` | the Étoile down to the Concorde, Rue de Rivoli, Place Vendôme, 3.6 km | 5 |
| `New York — Park Avenue` | Grand Central up Park to Grand Army Plaza and Central Park South, 3.9 km | 6 |
| `Tokyo — Ginza` | Chūō-dōri · Harumi-dōri · Hibiya · the Imperial Palace moat, 3.4 km | 5 |
| `Shanghai — The Bund` | Zhongshan East Road with the Huangpu on your right, then Nanjing Road, 3.7 km | 5 |
| `The Royal Hotel` | the last mile: a service road, two turns and the porte-cochère, 1.7 km | 2 |
| `The White Palace` | four kilometres of gravel and lime trees, two gates, one forecourt | 2 |

**Traffic signals that every car obeys.** `sig(at, name, cycle, offset)` puts a signal head at
a real junction; `signalPhase(sg, t)` is a **pure function of route time**, so the phase is
identical for you, for every AI rival and for every piece of ambient traffic. Nobody gets a
private light: if it is red for you it is red for the taxi beside you, which is the entire
point of putting them there. New York's offsets are a **green wave** — hold the limit and you
meet green after green — and London's deliberately are not. `signalStep` checks the CROSSING
rather than proximity, so creeping over a stop line still counts, and `trafficSignalStep` eases
the ambient cars to a halt rather than snapping them, so a bus does not stop dead.

`onJourney()` is the one predicate everything hangs off, and it is simply "does this route have
signals". On a journey the rival field is replaced by `RR_GRID` — a Ghost, a Cullinan, a Flying
Spur, a Maybach, a London taxi, a bus, a van, a police escort — because on a city street **the
traffic IS the field**, not a grid of cars to beat.

**Chauffeur 101** replaces Race Car 101, and the score is not the clock. Two numbers come
straight off the running integrator: **jerk** (the derivative of acceleration, `CH_JERK_OK` =
2.5 m/s³) and **lateral g** (`CH_LAT_OK` = 0.30). A passenger cannot feel a steady 0.2 g and can
feel any sudden change, which is why jerk is the one that matters. `chauffeurGrade()` returns
DISMISSED the moment you run a red, then FAULTLESS · ACCEPTABLE · THEY NOTICED. You cannot talk
your way to a good mark — it is measured, not asserted.

**The POWER RESERVE dial.** A Rolls-Royce has never had a tachometer, so the left-hand dial reads
how much of the engine you have **left**: 100% at rest, falling as you use it, and on an ordinary
journey it barely moves off 100. It fills from the opposite end of the scale (`o.reserve` reverses
the sweep). The Spectre keeps it, which is Rolls-Royce's own joke on a car with no engine. Between
the two dials, on a journey, sits the **next signal** — its name, its colour and the seconds left
on it, which is the one piece of information that actually helps you drive these cars well.

**The rear compartment — ten pieces of equipment, keys 1-9 and 0.** Starlight (1) · the Gallery
(2) · door umbrellas (3) · picnic tables (4) · theatre screens (5) · the privacy suite (6) · the
champagne cooler (7) · rear recline (8) · rear massage (9) · and **0 retracts the Spirit of
Ecstasy** into the prow, which is what she really does at the touch of a button and by herself if
anyone tries to take her. Each has a sound built from its own **mechanism** rather than a beep — a
picnic table is a detent releasing and then a damper; an umbrella is a spring and a sliding shaft;
the electrochromic divider is essentially silent, so what you hear is the relay — and each has an
effect you can see: the Starlight is a band of fibre ends across the headliner with a shooting
star every ten to twenty-five seconds, the Gallery lights the full width of the fascia, and the
tables, screens, privacy glass and massage all show in the interior mirror, because they are
behind you. **The Spectre's Starlight is in its DOORS as well** — 5,876 lights in the roof and
4,796 more in the door cards, which no other car in the world has, and which is why the two cars'
headliners are not the same drawing. All of it is opt-in and `rearMassKg()` is only added while a
feature is deployed, so `tests/perf-test.mjs` never sees a gram of it.

**Key Z** is not an ultimate-speed mode on these two — there isn't one. It hands the car to the
**chauffeur**, and takes it back, because on a Rolls-Royce that is the switch that matters.

## Engine voice — every car sounds like its own engine

Firing frequency is `rpm/60 × pulses-per-rev` (I4=2, I6/V6=3, V8/straight-8=4, V10=5,
V12/flat-12=6, W16=8, EV=inverter). That was always right. The **oscillator stack on top of
it is the timbre**, and cloning a sim copies it verbatim — which is how the 250 GTO, F40 and
917 once shared a byte-identical stack, so a Colombo V12, a twin-turbo V8 and an air-cooled
flat-12 were one instrument played at three pitches. Only **24 of 47** cars had a distinct
voice.

The stack is now derived from what the engine physically is, so two engines that differ in
reality cannot come out identical:

| property | what it puts in the sound |
|---|---|
| **crank** | a cross-plane V8 fires unevenly — that detuned half-order pair *is* the burble. A flat-plane V8 has none of it. |
| **layout** | two banks beat against each other; a straight-six or straight-eight has one bank and no beat, which is why an inline engine sounds smoother than a V. |
| **induction** | carburettors breathe (rounded sines + intake hiss at 2×); turbos add spool at quarter-order; slide/ITB throttles a 1.5× honk; mechanical injection is dry with no intake resonance at all. |
| **cooling** | an air-cooled engine has a **fan** — the 917's axial fan at ~7× is the single most recognisable thing about it. |
| **displacement** | a 6.6 V8 has far more bottom end than a 2.88 V8 of the same layout. |
| **revs** | an 11,000 rpm engine carries much more high-order content than a 5,750 one. |
| **restrictor** | an FIA air restrictor strangles the top end — that is the Dakar sound. |
| **e-motor** | a hybrid carries an inverter whine under the engine note. |
| **EV** | no firing order at all: inverter switching + reduction-stage and rotor whine, pitched by motor speed (a 30,000 rpm U9 Xtreme rotor whines far higher than a Nevera's). |

**49 distinct voices across 56 cars.** The Mustang GTD and the RX-7 are why the derivation matters: the Mustang GTD is the only **belt-driven supercharger** here, so its blower screams at a fixed ~6.9× crank order and never spools, lags or falls away the way a turbo does; and the RX-7 is the only **Wankel**, which has no crankshaft, no valve and no bank — so it has *no* half-order burble and *no* two-bank beat, an unusually strong 2nd and 3rd harmonic (the brap), and a 1/3-order rotor whir underneath because the eccentric shaft turns three times per rotor revolution. The groups that still share one are the ones
that really do share a power unit — the Mercedes, Ferrari and Red Bull Ford F1 customer
teams, and the Jesko/Agera RS 5.0 twin-turbo V8. `tests/browser-test.mjs` hashes every
oscillator stack and **fails on any shared voice outside that allow-list**, so this cannot
silently regress.

The two Rolls-Royces are the other end of the same derivation. The Phantom's 6.75 twin-turbo V12
is the only engine in the garage whose brief was **silence**: six pulses a revolution at a 600 rpm
idle is 60 Hz, below where a cabin resonates, so its stack is deliberately poor in high harmonics,
its two banks are barely detuned (a V12 is inherently balanced and has no reason to beat), and its
turbos are big, slow and low-pitched rather than a whistle — what is left is a hum you feel through
the floor. The Spectre has **no firing order at all** and only **two** motors where the Evija, the
Nevera and the U9 have four, so its inverter switching and reduction-stage whine sit at their own
frequencies and it does not collide with the other EVs.

## Gearbox invariants (learned the hard way — check these on every car)

These four are the ones a cloned car gets wrong silently. `docs/ADDING_CARS.md` §4b has the
full derivation; the short form:

1. **The ladder** — the top-speed gear reaches the car's REAL top speed at about its power
   peak; geometric ladder down from it; **first gear must top out somewhere a driver would
   use it** (55-100 km/h normally, 100-130 for a long-geared hypercar, higher only for the
   genuine exceptions: McLaren F1 132, Porsche 917 142, an F1 car 125). Diagnostic:
   top-gear-at-limiter ÷ real top speed should be ~1.0-1.2 (racer) or ~1.2-1.6 (road car
   with an overdrive top). **Above 1.7 the ladder is stretched** and gears sit above the
   car's own top speed, unusable.
2. **Shift points** — `modeMap.race.upRpm` just under `redlineRpm` (~0.93x), sport ~0.79x,
   wet ~0.56x. A donor's numbers on a different engine shift at the wrong speed by the ratio
   of the two redlines.
3. **Gear count** — always `SPEC.gearRatios.length`, **never a literal**. A hardcoded 8 broke
   six-speed cars; a hardcoded 1 in the four EVs stopped the Taycan's real two-speed axle
   from ever shifting.
4. **Launch control must let the box shift** (at the limiter). If it blocks shifting and
   releases at a fixed speed, a short-geared car sits on the limiter and then dumps two or
   three shifts at once — gear 2 flashes past in one `shiftTimeS` and looks skipped.

Related: **anything keyed to engine/motor rpm that is really a function of road speed**
(aero load, battery draw, a limiter warning) breaks when the gearing changes. Key it to
speed. And **generate the header comments from the file's own SPEC** so they cannot drift
from the numbers perf-test certifies.

## index.html — garage + online race shell

- Fifty-six `car-card`s with real photos (road cars) / liveried SVG cards (2026 F1 +
  the six later hypercars, each with a real-photo `<img class="realcar">` slot that reveals
  a supplied photo and otherwise falls back to the SVG livery) + spec chips; buttons
  `data-practice` / `data-online` per car key (`pagani, bugatti, mclaren, ferrari,
  koenigsegg, tesla, amg, aston, gto, revuelto, porsche918, taycan, supra, venom, evija,
  amgone, nevera, zr1, p1, f40, p917, f1mercedes, f1redbull, f1ferrari, f1mclaren, f1aston, f1alpine,
  f1williams, f1racingbulls, f1haas, f1audi, f1cadillac, dacia, fordraptor, grhilux,
  hunter`; plus the later road cars `evo, gtr, m5, r8, mclarenf1, t33, agera, u9, db5,
  slr300, czinger, alfa33, tuatara, t50s, project8, s2000, mustanggtd, rx7, phantom,
  spectre`). New normal cars insert at the END of the road block, BEFORE the F1 cards.
- **Lazy sim loading** (so the homepage isn't a 12 MB download): between the
  `/*__EMBED_START__*/ … /*__EMBED_END__*/` markers index.html now carries only a
  tiny `SIM_FILES = {key: "filename.html"}` map. `loadEmbeddedSim` branches on
  protocol — over **http(s)** it sets `simFrame.src` to the real sim file, fetching
  just that one car on demand (cached after); over **file://** (where Chrome blocks
  sibling-file iframes) it falls back to `srcdoc` from `EMBEDDED_SIM_BASE64`, which
  lives in the generated **`sims-embedded.js`** and is pulled in by a
  `document.write` guard **only** when `location.protocol === "file:"`.
  `tools/embed-sims.mjs` regenerates both `sims-embedded.js` and the inline
  `SIM_FILES` map. So it still works from `file://` AND hosted, but hosted visitors
  download ~0.2 MB of shell instead of ~12 MB.
- **Zero-loading prefetch**: once the garage has painted, `prefetchSims()` quietly
  warms every sim in the background (`<link rel=prefetch>`, lowest priority, staggered
  on `requestIdleCallback`) — http(s) only (on `file://` they're already embedded). So
  the homepage is instant AND, by the time you click a car, it is already cached →
  the car opens with no visible load. Best-effort and never blocks first paint / photos.
- **`index-offline.html`** (generated by `embed-sims.mjs` alongside the above) is the
  original all-in-one page kept intact: one self-contained file with every sim embedded
  inline, forced to the embedded path (`if (true)`), no prefetch — zero network / zero
  loading on any protocol, for offline/single-file use. Derived from `index.html` so it
  never drifts.
- **Private Practice** = untouched sim in the iframe. The shell must NOT touch
  `state.rivals`/`raceGrid` in practice (that was the "no AI cars" bug: a
  global 750 ms interval kept calling `injectRemoteRacers()` in every mode).
  Any online-only enforcement is gated on online mode being active.
- **Online Race** = same sim + network. AI grid replaced by real racers only.

### Networking (free, no server of ours)

Signalling: **Trystero** (bundled locally, `vendor/trystero-*.js`) over
multiple public Nostr relays — redundant, so one dead relay no longer kills
matchmaking (the old single free PeerJS broker was the weak link). Transport
after signalling is direct browser-to-browser WebRTC (STUN + public TURN
fallback). PeerJS is kept as an automatic fallback path if all relays fail.
Room = `mucs2-<CODE>`; host is authoritative: roster, track choice, race
control, bans. Telemetry every 90 ms; peers stale after 8.5 s; auto-rejoin
with backoff on drop; heartbeats keep NAT bindings warm.

### Race control (host-only)

- Host picks the circuit (lobby Track select or the sim's Circuit tab) —
  broadcast to all; joiners' circuit buttons are locked ("host sets the track").
- **Start Race**: everyone is teleported to a staggered grid behind the
  start/finish line, held stationary; five red lights come on one per second
  over the start line, all-out = GO. At lights-out steering assist, test
  driver and cruise are switched OFF for everyone (manual racing), launch
  is released, and the race distance counter starts. Sims draw the checkered
  start line themselves; the lights + grid overlay live in index.html.

## Verification — the performance tests

`node tests/perf-test.mjs`: loads each sim in headless Chromium and drives the
REAL exported `app.updatePhysics` at the sim's own fixed 1/120 s step (launch
control → 0-100/0-200/0-300, governed/drag-limited top speed, 100-0 braking).
Asserts 0-100 within ±0.0001 s of `SPEC.zeroTo100Kmh` (Tesla marks are
rollout-subtracted — Tesla's own convention) and the other marks within their
documented bands. `--calibrate <car>` binary-searches `tractionCoeff` /
`brakeMaxMps2` / `drivelineEff` against the factory targets.
`node tests/browser-test.mjs` serves the repo over localhost and checks the
garage, private-practice AI grid survival, all six sims booting in the shell,
online-mode rules, and the full race-control (grid/lights/release) flow.

## Publishing

GitHub Pages is already enabled on this repo in classic branch mode (source:
`main`, repo root) — every merge/push to `main` republishes automatically at
`https://richardjiangs.github.io/multi-user-racecar-simulator/`.
No Actions workflow needed (the auto-created `github-pages` environment
rejects deploys from non-main branches anyway).
