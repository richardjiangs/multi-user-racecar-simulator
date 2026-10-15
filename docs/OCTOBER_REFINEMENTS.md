# Outline map, traffic and DB5 refinement — 15 October 2026

The garage now offers **Track outline** on all 64 cars in both track versions.
This transparent grey route view includes live rival/traffic positions. It has no
on-map controls; wheel/trackpad scroll and two-finger pinch zoom, and a click/tap
switches the whole-route/road-position presets. Modern cars retain their existing
full GPS modes. See [GPS_NAVIGATION.md](GPS_NAVIGATION.md).

## Runtime and preservation

`tools/vehicle-refinements/prepare.js` applies the artwork and runtime changes to
the copies loaded by the garage. `tools/driving/update.mjs` also applies them to
the 63 generated Track 2.0 documents. All 64 archived original HTML files remain
byte-identical to the preceding release. Edit the source modules, then run:

```sh
python3 tools/build-track2.py
node --max-old-space-size=8192 tools/embed-sims.mjs
node tools/build-pages.mjs
```

Dakar routes select a four-model T1+ roster: Sandrider, Raptor, Hilux and Hunter.
Reseeding via the grid, route selector or Real Mode takes the same route-aware
path. Selecting an ordinary circuit restores its normal roster. F1 rival artwork
is unchanged.

Spectre's red-light freeze came from passing a number to `audio.chime`, which
expects an array. The violation now starts two visible police pursuers behind the
car, shown in its mirror and map, without imposing a player-speed change. Their
positions follow the route; this is a simple pursuit model, not police AI tactics.

DB5's land routes constrain outward lateral travel at the road edge. This removes
the outward heading component without a collision impulse, speed stop, damage or
sparks. Traffic contacts retain their existing behavior. Sea missions and service
lanes retain their own movement rules.

## Authored artwork

DB5's new low 1.0 fascia uses Black Pearl metal, a grille-outline instrument
surround, Smiths gauges, Lucas ammeter, period radio/heater fittings, chrome rings,
wood rim/rivets and a David Brown rose hub. Both the driving view and cockpit
preview render live instruments. RPM and road speed use simulation telemetry;
oil pressure/charging indications are visual estimates where no sensor exists.
The original controls, Q Branch equipment, audio and performance remain.

References: [Aston Martin's DB5 retrospective](https://theastonmartinmagazine.com/60-years-of-db5/),
[official media archive](https://media.astonmartin.com/db5/?lang=eng),
and [period dashboard photographs](https://aston.co.uk/cars-for-sale/aston-martin/db5/car2380).
The restored car photograph informed the right-hand-drive layout and fittings;
this is authored Canvas artwork, not a photograph overlay.

The two Rolls-Royces now use separately proportioned traffic profiles for taxis,
saloons, hatchbacks, SUVs, luxury cars, buses, commercial vehicles and two-wheelers.
The drawings include glazing, doors, wheel arches, rotating rims, mirrors, lamps,
grilles, plates, taxi signs and bus destination displays. Front and rear views
are distinct. They remain stylized drawings within the existing perspective engine.
Reference families include [LEVC TX](https://www.levc.com/new-models/tx-taxi-overview/),
[Phantom](https://www.rolls-roycemotorcars.com/en_GB/showroom/phantom.html),
[Ghost](https://www.rolls-roycemotorcars.com/en_GB/showroom/ghost-in-detail.html), and
[TfL's New Bus for London](https://tfl.gov.uk/info-for/media/press-releases/2012/february/first-passengers-jump-aboard-the-new-bus-for-london).

## Dakar weather frequencies and wind

Track 2.0 weather uses January 2016–2025 station-hour observations from the
[IEM international METAR archive](https://www.mesonet.agron.iastate.edu/request/download.phtml?network=SA__ASOS).
The data now includes Medinah for the Al Henakiyah region. Stage-region assignments
were corrected around Yanbu and the Bisha/Al Henakiyah return. The checked-in data
contains request URLs, raw-response hashes and category counts.

| Regional station | Valid hours | Rain | Airborne dust/sand | Reported dust/sand storm |
|---|---:|---:|---:|---:|
| Yanbu | 7,412 | 0.162% | 0.418% | 0 observed |
| AlUla | 6,595 | 0.273% | 0.804% | 0 observed |
| Hail | 7,401 | 1.365% | 0.689% | 0 observed |
| Riyadh | 7,406 | 2.565% | 5.063% | 0.068% |
| Wadi Ad Dawasir | 7,260 | 0.372% | 4.848% | 0 observed |
| Bisha | 7,358 | 0.082% | 6.021% | 0 observed |
| Medinah | 7,385 | 0.569% | 3.223% | 0 observed |

These are **regional airport hour fractions, not exact probabilities at every
point on a Dakar stage**. Zero reports do not prove impossibility. Categories are
mutually exclusive; rain takes precedence over dust in mixed reports. Missing
observations are excluded. Stage dates/routes are referenced in
[TRACK2_SOURCES.md](TRACK2_SOURCES.md) and [the organizer's 2026 stage information](https://www.dakar.com/en/news/2026/stage-11/bike).

Wind is sampled from joint observed direction/mean-speed/gust tuples conditional
on weather category, preserving their observed frequencies and association.
Directions use [true north as in METAR](https://www.weather.gov/asos/WindSensor.html).
Particles now drift with the signed crosswind. Hourly resampling, 12-second
smoothing, variable-direction interpolation and brief gust timing are simulation
assumptions. Rain/dust durations retain the existing continuous-time model whose
equilibrium matches the observed fractions. Night remains restricted to Dakar.

## Validation

- `tests/gps/navigation.mjs`: 128 car/version combinations, including outline mode.
- `tests/gps/offline.mjs`: 18 display/car combinations, no required network access.
- `tests/refinements/map-gestures.mjs`: real wheel and touch input, presets and no buttons.
- `tests/refinements/revision.mjs`: DB5 boundaries in both Real Mode settings and
  both track versions; live dashboard; Dakar roster/reseed; Spectre red-light progress.
- `tests/refinements/wind.mjs`: 22 condition/station distributions, 25,000 draws each,
  observed mean/gust frequency, direction conversion and regional assignments.
- `tests/driving/rally-surface.mjs`: 75 surface sectors, solar time and weather equilibrium.
- `tests/driving/controls.mjs`: eight manual-pedal and shortcut checks.
- `tests/browser-test.mjs`: garage, private practice, online and race-control checks.
- `tests/track2/preservation.py`: all 64 originals, audio/keyboard sections and geometry unchanged.

The factory performance suite currently reports 59 failed target checks across
63 Track 2.0 cars, mainly sub-frame launch-time calibration differences. Running
the identical harness against baseline `326e92adb03912a4c23e2ccdb97f081ff669fdf9`
produces byte-identical output, including all six-decimal measurements and failures.
This release does not recalibrate performance. The comparison is recorded in
`tests/refinements/performance-comparison.json`; the earlier blanket performance
pass recorded in DRIVING_SCENERY_UPDATE.md was not reproducible in this check.
