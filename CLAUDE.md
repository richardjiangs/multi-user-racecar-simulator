# Multi-User Racecar Simulator — Agent Guide (CLAUDE.md)

A garage of twenty-eight simulators — each a **single self-contained HTML file** —
thirteen road cars/hypercars (incl. the Toyota GR Supra), the full **2026
Formula 1 grid** (eleven teams), and four **2026 Dakar Rally** raid cars (Dacia
Sandrider · Ford Raptor T1+ · Toyota GR DKR Hilux · Prodrive Hunter). `index.html` bundles all of them together with
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
Toyota GR Supra simulator.html
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
Dacia Sandrider Dakar simulator.html        ← 2026 Dakar Rally raid cars (4, one shared T1+ Ultimate chassis SPEC):
Ford Raptor T1+ Dakar simulator.html           Dacia Sandrider · Ford Raptor T1+ · Toyota GR DKR Hilux · Prodrive Hunter.
Toyota GR DKR Hilux simulator.html             Each: real engine + unique sound (Ford = 5.0 NA V8; the rest twin-turbo V6),
Prodrive Hunter Dakar simulator.html           real 2026 Dakar stages with terrain/dune/bump physics, Rally Stage (Real) Mode, Dakar Rally 101.
tests/perf-test.mjs                         ← factory-figure verification harness (node tests/perf-test.mjs)
tests/browser-test.mjs                      ← shell + practice + online + race-control smoke test
tools/embed-sims.mjs                        ← re-embeds all sim files into index.html (run after editing a sim)
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
1,280→1,600 hp · Speedtail Velocity mode · Tesla Track Package 262→322 &
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
| Koenigsegg Jesko | 954 kW / 1,280 hp @ 7,800 (E85: 1,193 kW / 1,600 hp) | 1,000 Nm @ 2,700–6,170 (E85 1,500 @ 5,100) | 2.5 s | drag-limited (Attack aero) | 9-LST | 1,420 kg |
| Tesla Model S Plaid | 760 kW / 1,020 hp tri-motor | ~1,420 Nm combined | 2.1 s (w/ 1-ft rollout: 0-60 1.99 s) | 262 governed / 322 Track Pack | 1-speed | 2,162 kg |
| Mercedes-AMG GT Black Series | 537 kW / 730 PS / 720 hp @ 6,900 (flat-plane V8) | 800 Nm @ 2,000–6,000 | 3.2 s | 325 governed | 7-DCT | 1,615 kg |
| Aston Martin Valkyrie | 853 kW / 1,160 PS combined (1,000 hp V12 @ 10,500 + ~160 hp KERS) | 900 Nm combined | 2.5 s | 350 | 7-seq | 1,030 kg (dry) |
| Ferrari 250 GTO | 221 kW / 300 PS @ 7,500 (Colombo V12, six Webers) | 294 Nm @ 5,500 | 6.1 s | ~280 | 5-manual | 880 kg (dry) |
| Lamborghini Revuelto | 747 kW / 1,015 CV combined (825 CV V12 @ 9,250 + 3 e-motors) | ~1,100 Nm combined | 2.5 s | 350 | 8-DCT | 1,772 kg (dry) |
| Porsche 918 Spyder | 652 kW / 887 PS combined (608 PS V8 @ 8,700 + 2 e-motors) | ~1,280 Nm combined | 2.6 s | 345 | 7-PDK | 1,674 kg |
| Porsche Taycan Turbo GT | 815 kW / 1,108 PS overboost (dual PSM, 2-speed rear) | ~1,340 Nm | 2.2 s | 305 | 2-speed | 2,220 kg |
| Toyota GR Supra | 285 kW / 387 PS @ 5,800–6,500 (B58 twin-scroll turbo I6) | 500 Nm @ 1,800–5,000 | 4.1 s | 250 governed | 8-ZF auto | 1,520 kg |
| 2026 F1 (all 11 teams) | 745 kW / 1,013 PS combined (1.6 L V6 turbo-hybrid, ~50/50 split) | 900 Nm combined | 2.6 s | ~350 (drag-limited, active aero) | 8-seq | 768 kg (min.) |
| 2026 Dakar (all 4 cars) | ~265 kW / ~360 hp (air-restricted T1+ Ultimate; Ford = 5.0 NA V8, rest = twin-turbo V6) | ~620 Nm | 5.3 s | 170 km/h governed | 6-seq | ~2,000 kg (T1+ min.) |

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
Chiron, Tesla Model S Plaid, Taycan Turbo GT, Revuelto, 918 Spyder, GR Supra**. The ultra-low,
slick-shod, ground-effect cars (Valkyrie, F80, AMG Black, Speedtail, Huayra BC, Jesko, 250 GTO) are
left tarmac-only. Terrain is route-gated, so each road car's certified 0-100/top/braking is untouched;
they keep their own cockpit/dashboard and simply gain the stages in the Circuit tab.

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
**Learning mode (all 24 sims)**: a `data-view="learn"` tab AFTER Circuit — road
cars "Race Car 101", AMG "Safety Car 101", F1 "Formula 1 101" — with a curriculum
panel + `learnBtn` toggling `state.learnMode`: `drawLearningMarks()` paints
150/100/BRAKE boards, TURN IN, a LATE APEX cone (60% through the corner) and an
EXIT—POWER board around the next corner; the teal racing line stays on and
`drawMap` overlays the full racing line. All opt-in → certification untouched.

**v8** — width 3.75 in ALL 24 sims. `radioSay` uses cancel → setTimeout(60 ms) →
resume+speak plus a 4 s resume keepalive (Chrome silently drops queued utterances
otherwise). Learning is a **launch mode**: the learn tab is `display:none` until the
garage card's **Learning** button calls `app.enterLearning()` (index.html
`openLearning` polls `getSimApp()`). Each 101 is a real course: CONTENTS quick-nav,
two inline SVG diagrams, a per-car feature lesson (all 24 differ) and **Demo**
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

## index.html — garage + online race shell

- Twenty-four `car-card`s with real photos (road cars) / liveried SVG cards (2026 F1)
  + spec chips; buttons `data-practice` / `data-online` per car key (`pagani, bugatti,
  mclaren, ferrari, koenigsegg, tesla, amg, aston, gto, revuelto, porsche918, taycan,
  supra, f1mercedes, f1redbull, f1ferrari, f1mclaren, f1aston, f1alpine, f1williams,
  f1racingbulls, f1haas, f1audi, f1cadillac`).
- `EMBEDDED_SIM_BASE64 = {…}` — every sim base64-embedded on ONE line between
  `/*__EMBED_START__*/ … /*__EMBED_END__*/` markers. `tools/embed-sims.mjs`
  regenerates that line from the twelve files. Sims load into the `simFrame`
  iframe via `srcdoc`, so everything works from `file://` AND hosted.
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
