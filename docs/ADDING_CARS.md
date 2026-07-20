# Adding Cars — Handoff Playbook for the Next Claude Session

> **Read `CLAUDE.md` first** (repo root) — it is the authoritative architecture guide and
> is kept current every round. This file is the *how-to-extend* companion: how to add a new
> car end-to-end, the ordering rules, and the hard-won warnings from building the 24-car garage.
> When they disagree, `CLAUDE.md` wins and should be updated.

The garage is **24 self-contained HTML simulators** + `index.html` (the garage shell that
base64-embeds all 24). Today: **13 road cars/hypercars** then the **11-team 2026 F1 grid**.
Every sim shares one template; you add a car by **cloning the closest existing sim and
changing only the per-car deltas**, never by writing a sim from scratch.

---

## 0. The two categories and the ORDERING RULE (important)

There are two kinds of car, and they sort into two blocks in **every ordered list**
(the `index.html` car-cards, `EMBEDDED_SIM_BASE64`, the `tests/perf-test.mjs` `CARS`
registry, and the docs):

1. **Normal cars** — road cars & hypercars (Bugatti … Toyota GR Supra). No Real Race Mode
   by default (though they all have Learning Mode + a "Race Car 101").
2. **Special racing cars** — the F1 grid today; any purpose-built racer you add next
   (LMH/Le Mans Hypercar, IndyCar, GT3, NASCAR, …). **These get a Real Mode.**

**Rule — keep the blocks grouped, insert within the correct block:**

- A new **normal car** goes **at the end of the normal-car block, BEFORE the first racing car**
  (i.e. after `supra`, before `f1mercedes`). **Never append a normal car at the very end**
  (after the F1 cars) — that splits the road group.
- A new **special racing car** goes **at the end of the racing block** (after `f1cadillac`),
  or starts a new racing sub-block if it is a different series.

The current order is already correct (13 road cars, then 11 F1). Preserve it. If you ever
find a car out of its block, re-arrange **all** ordered lists together (cards, embed line,
perf-test registry) and re-run the full verification pipeline (§7).

---

## 1. Anatomy of a sim file (what you clone)

Every sim is one `.html`: `<style>` → `<body>` → one `<script type="module">`. The script
is split into **several top-level `{ … }` blocks, each opening with `const app = window.<Brand>App;`**.
Section order is a contract — **do not reorder**:

1. **CIRCUITS** — 7 shared real tracks (Monaco, Nürburgring 24h/Nordschleife/GP, Suzuka,
   Silverstone, Nardò Ring) — *never change their geometry* — **plus one brand-special track
   that is a DISTINCT real circuit per car** (Fiorano, Fuji, Laguna Seca, Le Mans, Hockenheim,
   Imola, Mugello, Zandvoort…; F1 gets real GP tracks: Spa, Red Bull Ring, Monza, COTA, Bahrain,
   Paul Ricard, Interlagos, Baku, Miami, Hungaroring, Las Vegas).
2. **SPEC** — the REAL manufacturer figures. `tractionCoeff` / `brakeMaxMps2` / `drivelineEff`
   are **calibrated** so the fixed-step integrator hits the official 0-100 / top speed / 100-0.
3. **shared context** — `state`, `el` lookup, helpers, exported on `window.<Brand>App`.
   index.html reaches the iframe through this global.
4. **audio** — synthesised engine (firing frequency = rpm/60 × pulses-per-rev; W16=8, V12=6,
   V8=4, V6=3, EV=inverter whine), turbo, blow-off, crackle, chimes.
5. **physics** — torque curve, gearbox + paddle/auto shift, active aero, traction cap, launch
   control, **bicycle-model steering**, lap timing, AI rival grid. **Fixed step 1/120 s.**
6. **render** — pseudo-3D canvas world, cockpit frame, circuit minimap, SVG art injection.
7. **UI actions / cockpit effects / co-pilot voice / HUD / events / main loop.**

### Cross-block scope — the #1 gotcha
Functions declared in one `{ … }` block are **NOT visible** in another block, even though both
do `const app = window.XApp`. To call across blocks you **export** on `app`
(`Object.assign(app, { fnName, … })`) and **call via `app.fnName(...)`**. Every "X is not
defined" bug this session was a missing export or a cross-block call. When you add a function
one block needs from another, export it.

### App globals (naming)
`BugattiApp, PaganiApp, McLarenApp, FerrariApp, KoenigseggApp, TeslaApp, AmgApp, AstonApp,
GtoApp, RevueltoApp, Porsche918App, TaycanApp, SupraApp`; F1: `MercedesF1App, RedbullF1App,
FerrariF1App, MclarenF1App, AstonF1App, AlpineF1App, WilliamsF1App, RacingbullsF1App, HaasF1App,
AudiF1App, CadillacF1App`. Pattern: `<Brand>App`. Pick a unique global for the new car and use
it consistently (state global, all block headers, index.html card `appName`).

---

## 2. Add a NORMAL car — step by step

1. **Research the real car** (WebSearch — the web is live, "current month is July 2026").
   Collect: power (kW/PS), torque + rpm band, 0-100 km/h, top speed (governed vs drag-limited),
   gearbox, kerb/dry mass, engine layout, a real **brand-special circuit** the marque is tied to,
   and a signature **special feature** (e.g. Bugatti Speed Key, Jesko E85, Tesla Drag Strip).
   Put the exact figures in `SPEC` with citation comments.
2. **Clone the closest sim.** Copy the file of the most similar car (similar drivetrain/mass).
   `cp "Porsche 918 Spyder simulator.html" "New Car simulator.html"`.
3. **Rename the global** everywhere: `Porsche918App` → `NewcarApp` (all block headers +
   `window.NewcarApp = …`). Change brand/title/colours (accent CSS vars), the SPEC block,
   `modeMap` shift points, audio osc stack + pulses/rev, the brand-special track (+ its circuit
   button, the brand-grid `state.route.name === …` check, and the voice alias), the exterior SVG,
   cockpit SVG, `drawCabinFrame` dashboard, steering-wheel drawing, engine-bay art, toasts/co-pilot
   lines, and the special feature.
4. **Calibrate** (§4) until `node tests/perf-test.mjs newcar` passes to ±0.0001 s on 0-100.
5. **Learning content** (§6): give it a *distinct* per-car chapter in "Race Car 101" and its own
   feature lesson — no two 101s may be identical.
6. **index.html card** (§5): real Wikimedia photo, spec chips, `data-practice`/`data-online`/
   `data-learn` buttons, and a `cars{}` registry entry with `appName`. **Insert the card and the
   registry entry at the END of the road-car block (before `f1mercedes`).**
7. **perf-test registry**: add a `CARS` entry (insert in the road block). **browser-test** picks
   cars up from the shell automatically but confirm it still lists all of them.
8. **Embed + verify** (§7): `node tools/embed-sims.mjs && node tests/perf-test.mjs &&
   node tests/browser-test.mjs`. Screenshot. Commit → draft PR → ready → merge (§8).

---

## 3. Add a SPECIAL RACING car (must include Real Mode)

Do everything in §2, **plus port Real Mode** and use an **inline SVG livery card** (not a photo).

**Real Mode is the big system** (built across rounds RM1-RM11; F1-only today). The cleanest
port is to **clone an F1 sim** (they already contain the full stack) and reskin it. What Real
Mode contains — all of it must come across, all **real-mode-gated / opt-in so certification is
untouched**:

- **`TEAM` / entrant object** — real pace, top speed, tyre deg, reliability, DNF/DNS odds,
  pit-crew time, repair speed, garage slot, failure-cause strings. **Research the real
  championship/series form** and encode it (we used the *actual* July-2026 F1 standings).
- **Probabilistic damage** — named systems `sys = {engine, gearbox, hydraulics, brakes, tyre,
  nose}` (0..1) that grow with real stress, scaled by reliability; a system at 1.0 is a *real*
  failure. **Crashes carry luck** (graze → disaster, severity × speed) and **sudden gremlins**
  strike at random weighted by reliability — not just DNS.
- **Rivals live a real race** — full grid, per-entrant tyre wear + pit stops **at their own
  garage**, break/limp/park behaviours, DNS cars stay in the garage.
- **Drive-in pit** (no button) — steer onto the pit apron in the entry window, auto limiter,
  stop in your box, X-ray pit screen (repair every damaged system, per-part time), released in
  1st gear. No refuelling (banned 2010). Pit wall + team garages drawn in the world; PIT branch
  on the map.
- **Safety car** — a **Mercedes-AMG GT Black Series** deployed on a stoppage; nobody passes it.
  (The AMG sim also has a *drivable* Safety Car Mode — a full F1 race runs around you.)
- **Series-correct controls** — for F1: X-mode active aero (hold X), ERS Manual Override (hold V,
  MOM proximity rule), engine Strat, brake bias, rain light, team **radio** (live spoken calls),
  diff. Adapt to your series (e.g. LMH: hybrid deploy, Balance-of-Performance, full-course yellow).
- **Live team radio** — `radioLive` toggle; `radioCall(auto)` builds real engineer content and
  `radioSay` voices it via browser `speechSynthesis` (no API). **Speech gotcha (§9).**

**Insert a new racing car at the end of the racing block** (after `f1cadillac`), or as a new
series sub-block. Its card is an **inline SVG livery** in `index.html`, not a Wikimedia photo.

---

## 4. SPEC & calibration (the ±0.0001 s contract)

`tests/perf-test.mjs` drives the **real exported `app.updatePhysics`** at the sim's own 1/120 s
step through a launch-control start (0-100/200/300), a flat-out run (top speed), and a 100-0
brake test, and asserts **0-100 within ±0.0001 s** of `SPEC.zeroTo100Kmh` plus the other marks
within documented bands. Tesla marks are rollout-subtracted (its own convention).

- **Calibrate** with `node tests/perf-test.mjs --calibrate <car>` — it binary-searches
  `tractionCoeff` / `brakeMaxMps2` / `drivelineEff` to the factory targets. Paste the printed
  values into `SPEC`, re-run to confirm.
- The 11 F1 cars share **one calibrated chassis SPEC**; `--calibrate f1mercedes` certifies all
  eleven. If your new racers share a chassis, do the same.
- **Any opt-in feature must not touch the certification runs.** perf-test now **clears
  `state.rivals` after every `resetCar()`** (contact runs in all modes). Hold-to-activate
  controls (X/V) are never held during certification. Keep new features gated so the launch
  numbers never move.

Env for headless runs: `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
Playwright resolves from the global npm root.

---

## 5. The homepage card (`index.html`)

- **Normal cars → real photo.** Use a Wikimedia Commons file via
  `https://commons.wikimedia.org/wiki/Special:FilePath/<File_Name>.jpg?width=1200`.
  **Verify the file actually exists first** (WebSearch for the Commons file page; direct
  `WebFetch` of commons/wikipedia often returns 403 in this env, but `Special:FilePath` renders
  in the browser). If no clean free photo exists, fall back to an inline SVG illustration.
- **Special racing cars → inline SVG livery** (see the F1 cards and the AMG Safety Car card).
  Never fake a photo for a liveried racer.
- Each card needs: `data-car-card="<key>"`, spec chips, and three buttons —
  `data-practice="<key>"`, `data-online="<key>"`, `data-learn="<key>"`.
- Add a matching entry to the shell `cars { <key>: { key, label, short, mark, appName, … } }`
  registry. Keys currently: `pagani,bugatti,mclaren,ferrari,koenigsegg,tesla,amg,aston,gto,
  revuelto,porsche918,taycan,supra,f1mercedes,f1redbull,f1ferrari,f1mclaren,f1aston,f1alpine,
  f1williams,f1racingbulls,f1haas,f1audi,f1cadillac`.

---

## 6. Learning Mode & the 101 (all cars, each DIFFERENT)

Every sim has a **Learning launch mode**: the garage card's **Learning** button calls
`app.enterLearning()` (the shell `openLearning()` polls `getSimApp()` until the iframe boots,
then calls it). The `data-view="learn"` tab is `display:none` until launched.

- **The 101 course panel** — CONTENTS quick-nav, 2 inline SVG diagrams, core chapters
  (racing line, apex types, racecraft, braking, vision) **plus a per-car chapter that must be
  unique** (road cars get a car-specific lesson; racing cars get a series/entrant lesson), and
  **Demo** buttons → `app.learnDemo()` (loads Suzuka, engages the test driver on the racing line).
  Titles: road → "Race Car 101", the AMG → "Safety Car 101", F1 → "Formula 1 101".
- **On-track coaching** (`drawLearningMarks`) — 300/200/150/100/50 boards counting **to the
  apex**, a TURN IN board, a big **yellow apex dot on the line**, an EXIT board; the teal racing
  line stays on; the minimap becomes a **zoomed** inset.
- **The shared racing-line engine** `raceLineOffAt(d)` builds the line from the circuit's real
  corner table (wide in → through the apex → wide out) and is used by the drawn line, the map,
  the apex dot **and** the demo driver, so they always agree.

---

## 7. Verification pipeline (run EVERY time, in order)

```bash
node tools/embed-sims.mjs                 # re-embed all sims into index.html (after ANY sim edit)
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node tests/perf-test.mjs      # all cars certify (0-100 ±0.0001 s)
CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node tests/browser-test.mjs   # garage, practice AI grid, all sims boot, online rules, race control
```

Always **syntax-check** each edited sim first (extract the module `<script>`, `new Function(...)`)
and keep your own end-to-end Playwright checks for new behaviours. Screenshot new UI. Only
commit when all three pass.

### The applier-script pattern (use it for multi-file edits)
When a change touches all 11 F1 (or all 24) files, write a Node script with
`rep(find, replace)` that **asserts the split count === 1** (the anchor is unique), collects
errors, and **writes only if there are no errors**. This is how every uniform change this
session was made safely. Keep anchors long enough to be unique across files.

---

## 8. Ship it (git + GitHub Pages)

- Work on the branch `claude/add-race-simulators-xkv3bf`. Commit with a clear message.
  **Never put the model identifier in commits, PR titles/bodies, or code** — chat only.
- `git push -u origin <branch>` (retry with backoff on network errors).
- Open a **draft PR** (github MCP: `create_pull_request draft:true`), then
  `update_pull_request draft:false`, then `merge_pull_request` (merge method `merge`) into
  `main`. GitHub Pages is classic branch mode on `main`/root → merging republishes automatically
  at `https://richardjiangs.github.io/multi-user-racecar-simulator/`.
- If the github MCP server is disconnected, the egress proxy still injects a token for the
  GitHub REST API from `curl` — but draft→ready needs the MCP tool or a human (REST can't undraft;
  GraphQL undraft is disabled). Prefer the MCP tools.

---

## 9. WARNINGS (hard-won — read before touching anything)

1. **After editing ANY sim, re-embed** (`tools/embed-sims.mjs`) or `index.html` serves the stale
   version. Then run perf-test + browser-test.
2. **Certification is sacred**: 0-100 must stay ±0.0001 s. New features are opt-in / real-mode
   gated so the launch runs never see them. perf-test clears `state.rivals` after `resetCar`.
3. **Cross-block scope**: export on `app` and call via `app.fn` — see §1.
4. **Never change the 7 shared circuit geometries.** The brand-special track must be a *distinct
   real* circuit and you must update its circuit button, the brand-grid name check, and the voice
   alias together.
5. **Filename case**: the Pagani file is `Pagani Huayra BC Simulator.html` (capital "Simulator").
   A lowercase `*simulator*.html` glob **misses it** — use a case-insensitive match when scripting
   over all files.
6. **Wikimedia**: `WebFetch` of commons/wikipedia → 403 here, but `WebSearch` works and
   `Special:FilePath` URLs render in the browser. Verify a photo exists before using it; illustrate
   with SVG if not.
7. **Speech synthesis** (`radioSay`): Chrome **garbage-collects** the utterance and drops queued
   speech after `cancel()`. You must (a) **hold a reference** (`window._u = u`), (b) `cancel()` →
   `setTimeout(60ms)` → `resume()` + `speak()`, and (c) run a ~4 s `resume()` keepalive interval.
   Without all three the radio says one line then goes silent.
8. **Map handedness is mirrored vs the world frame** — the inside of a corner is `+sign(k)·normal`
   in the map's own integration but the driving world uses the opposite sign. When placing the
   apex dot / racing line, **verify the side empirically** (project both ±offsets and compare to
   the drawn inside kerb on screen) and lock it with a regression test.
9. **`TRACK_WIDTH_SCALE` is 3.75** in all 24 sims (×1.5 wider). Keep it consistent if you clone.
10. **Real photos vs liveries**: never publish a page that fakes a real photo of a liveried racer;
    use SVG. (General rule: don't impersonate real orgs/records.)
11. **Don't re-derive facts** — the numbers below and in `CLAUDE.md` are researched and calibrated.
    Re-research only the *new* car; reuse the rest.

---

## 10. KNOWN OPEN BUG (do this first next round)

The **learning-mode apex dot still lands on the OUTSIDE of some corners in the driving view**,
and the marks/labels don't fully satisfy the brief. Fix precisely:

1. **Apex side (world view)** — `raceLineOffAt()` uses *inside = −corner.dir*; the driving-view
   projection disagrees for some corner directions. **Determine the sign empirically in-page**
   (project `+dir` and `−dir` offsets at a known corner, compare to the drawn inside kerb's screen
   x), lock it, and **add a permanent regression test** so it can never flip. The dot must be a
   point **on the track's inside line**, not derived from a sign guess.
2. **Real-time marks** — the *advice label* already updates live, but since the dot was pinned to
   the corner middle it no longer moves. Make the **apex dot and the boards follow the live
   `frac`** again (early ≈ 0.38, mid ≈ 0.50, late ≈ 0.62 of the corner length) so chasing/defending
   visibly moves the apex.
3. **Apex-type correctness (audit every label vs frac vs situation)** — the definitions to encode:
   - **Early apex** — clip **before** the geometric middle. Use when **defending** (own the inside)
     or on the **first of a same-direction double-apex**.
   - **Mid / geometric apex** — the corner's **middle**. Constant-radius / 90° corners in clear air,
     and S-complex compromises.
   - **Late apex** — clip **after** the middle. Corners **onto a straight**, **hairpins/V-line**,
     and when **attacking** (sacrifice entry for a stronger exit run).
   Confirm each label string matches its `frac` and the live race situation — this has been mixed
   up repeatedly, so add assertions.

Everything else through **v11 / PR #26** is merged and live: corner-table racing line, demo follows
the drawn line, crash-severity luck + sudden gremlins, live coaching radio, the drivable Safety Car,
the 101 courses, width ×1.5, per-team July-2026 data, the drive-in pit with X-ray.

---

## 11. Quick reference — factory figures already encoded

See the table in `CLAUDE.md` ("The cars — factory figures encoded in `SPEC`") for all 24 cars'
power/torque/0-100/top-speed/box/mass, and the Real-Mode sections for the per-team constants,
pit-crew times, garage order, reliability and ERS characters. Reuse them; only research the new car.
