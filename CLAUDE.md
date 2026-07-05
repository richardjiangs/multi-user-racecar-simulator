# Multi-User Racecar Simulator — Agent Guide (CLAUDE.md)

A garage of eight hypercar simulators — each a **single self-contained HTML file** —
plus `index.html`, which bundles all eight together with real photos/performance
cards, a **Private Practice** mode (the untouched simulator) and an **Online
Race** mode (browser-to-browser WebRTC, no paid server).

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
tests/perf-test.mjs                         ← factory-figure verification harness (node tests/perf-test.mjs)
tests/browser-test.mjs                      ← shell + practice + online + race-control smoke test
tools/embed-sims.mjs                        ← re-embeds the eight sim files into index.html (run after editing a sim)
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
     Suzuka, Silverstone, one brand-special track, Nardò Ring. Corner lists are
     shared across all cars. **Never change track geometry.**
   - **data: vehicle spec** — `SPEC` object: THE real manufacturer figures.
     Comments cite the exact numbers. `tractionCoeff` / `brakeMaxMps2` are
     *calibrated* so the fixed-step integrator reproduces the official 0-100
     and 100-0 figures exactly (see tests/perf-test.mjs).
   - **shared context** — `state` + `el` lookup + helpers, exported on
     `window.<Brand>App` (`BugattiApp`, `PaganiApp`, `McLarenApp`, `FerrariApp`,
     `KoenigseggApp`, `TeslaApp`, `AmgApp`, `AstonApp`). index.html reaches into the iframe through
     this global.
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

### The eight cars — factory figures encoded in `SPEC`

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

## index.html — garage + online race shell

- Six `car-card`s with real photos + spec chips; buttons `data-practice` /
  `data-online` per car key (`pagani, bugatti, mclaren, ferrari, koenigsegg, tesla, amg, aston`).
- `EMBEDDED_SIM_BASE64 = {…}` — every sim base64-embedded on ONE line between
  `/*__EMBED_START__*/ … /*__EMBED_END__*/` markers. `tools/embed-sims.mjs`
  regenerates that line from the six files. Sims load into the `simFrame`
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
