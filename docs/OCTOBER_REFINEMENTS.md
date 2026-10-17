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

## October 17: London navigation, persistent junctions and movable outline

`tools/vehicle-refinements/city-network.js` now supplies the two Rolls-Royces
with one persistent London coordinate system for roads, pavement, frontages,
landmarks, signals, traffic and the rear camera. It retains the existing road
network and its 1.55 width factor. The network is an authored approximation of
London, not a surveyed street model. Junctions no longer get regenerated around
the current edge when the driver turns. Transition curves share their position
and tangent across edges, and reversing retraces the previous edge.

Ambient vehicles keep their identities and road coordinates, choose connected
roads, slow for corners and signals, and follow the vehicle ahead. Their drawing
uses the trajectory tangent relative to the viewer, including side and front
views. Lane-centre curves avoid the folded offsets that can reverse a car's
apparent facing on tight turns. Other city journeys also use the road heading
for their traffic drawings; oncoming actors now sample the road at the correct
signed distance. F1 rival artwork is unchanged.

Both the driving GPS and Navigation tab offer a London destination selector.
Map pins select destinations; the Navigation map also supports wheel zoom and
pan. Routing follows the existing connected road graph. With steering assist or
the chauffeur enabled, junction selection follows that route. Only the full
automatic driver receives a destination braking target; manual driving and
steering-only assist retain the user's pedals.

221B Baker Street is included, based on the
[Sherlock Holmes Museum's address](https://www.sherlock-holmes.co.uk/contact-us/).
Its pin is placed along the simulator's existing Baker Street edge; it is not a
claim of address-level geospatial accuracy. Existing London landmarks and park/
river corridors remain represented in the fixed world. Tower Bridge's displayed
bascules use the existing lift schedule.

Every garage car's grey outline can be dragged with a mouse or one finger. Its
viewport-relative placement is remembered across cars and window sizes. Tap
still switches presets; wheel and pinch still zoom, with no buttons on the
outline. Zoomed outlines show corner numbers. Monaco and Suzuka account for the
unnamed corners omitted from the previous label lists, using
[Formula 1's Monaco corner guide](https://www.formula1.com/en/latest/article/explained-how-every-monaco-corner-got-its-name.5ClYqWmfpeUpsRJA6mDNaX)
and the [FIA's Suzuka layout](https://www.fia.com/sites/default/files/english_3.pdf).
On routes whose data contains generic sampled bends, same-direction samples of
one continuous bend are grouped and numbered in driving order; these are
simulator apex identifiers, not independently verified official corner numbers.
The map remains a thin line at every zoom.

The DB5's silent route boundary no longer snaps its heading. On Track 2.0 it also
avoids switching into off-road body projection merely because a tight bend is
reached at the edge. Vehicle-to-vehicle impacts remain supported. The boundary
still clamps outward position without fence sparks or barrier damage, and sea
missions retain their existing behavior.

Additional checks:

- `tests/refinements/london-navigation.mjs`: both Rolls and both garage track
  settings, destination controls, forward/reverse junction continuity, stable
  road geometry and traffic identities, traffic velocity versus drawn heading,
  rear views and destination arrival behavior.
- `tests/refinements/map-boundary.mjs`: DB5 frame-to-frame heading/position at
  both boundaries, both Real Mode settings and both track versions; outline
  dragging and zoom on F1, historical and modern cars; Fairmont labelled 6.

The persistent frontages retain the original district styles and storey profiles.
Near shopfronts reuse the authored façade drawing. Rendering rejects off-screen
geometry before projection and caches small distant car views; the world data
and traffic identities remain loaded. Both full physics drivers were also checked
through a routed junction for 30 simulated seconds without a discontinuity.
Mouse-wheel, touch pinch, one-finger dragging, and tap-to-switch checks cover
modern, historical and F1 cars. The repeated factory suite still matches the
baseline report byte-for-byte (SHA-256 recorded above); its 59 existing target
failures remain unchanged.

## London guidance and sedan access — 17 October 2026

London is now available in the Tesla Model S Plaid, Porsche Taycan Turbo GT,
BMW M5, Mitsubishi Lancer Evolution X and Jaguar XE SV Project 8, alongside the
existing Phantom and Spectre. Both garage track settings support it. The city
adapter uses each car's existing powertrain and controls; leaving London restores
its circuit environment and navigation display. The Evo gains the full city GPS
while in London and returns to its historical-car map options elsewhere.

A selected destination no longer takes precedence over manual junction input.
The chosen road remains latched after the steering input is released. Changing a
turn inside the junction reprojects the car onto the new curve while preserving
its world position and yaw. The route planner recalculates from the road actually
entered, including when an address has been passed. Clearing the destination
leaves free city driving available. Assist and chauffeur guidance may follow the
suggested route, with manual steering able to override the choice.

The London navigation display uses filled street widths, building footprints,
parks, water, street names and destination pins from the same authored world as
the driving view. It follows heading during navigation, shows an upcoming junction
preview and distance instructions, the following maneuver, remaining distance and
an estimated travel time, and journey progress along the right edge. The ETA is a
simple simulated urban-speed estimate; it is not live traffic data. Map and AR
share the same planned route. Only police positions appear on London maps;
ordinary cars remain visible in the driving world. Circuit and Dakar maps retain
their normal vehicle markers. The grey map stays draggable and gesture-zoomable.

This is a self-contained offline street map, not Google Maps or a new geographic
survey. It retains the existing 174-road London graph and authored frontage
positions. No external tiles, geocoding, or map service is required.

Validation adds `tests/refinements/london-guidance.mjs`: the seven cars in both
track settings, destination clearing, manual missed turns, rerouting, junction
position/yaw continuity, route endpoints, progress, heading, police-only markers,
AR route revisions, actual physics stepping, responsive displays and leaving
London. Offline tests include London on the Model S and Evo. The original London
geometry/traffic tests, all-car GPS suite, controls suite, original-file checks
and factory performance comparison remain part of this release verification.

The final junction sweep (`tests/refinements/london-late-turns.mjs`) covers 2,720
late-input scenarios across every legal incoming road direction, including 1,740
changed exits. It checks repeated choice stability and continuity through the
edge transition. Reprojection searches both halves of the junction with a bounded
closest-point calculation, avoiding overshoot on sharp bends. Turn selection uses
the car's world heading so changing the path coordinates cannot change the chosen
exit again. The largest measured movement was 0.000022 m, with no unstable choices.
`london-transition.mjs` additionally verifies both U-turn directions and the
Dakar → London → Monaco environment/map transition.

Release checks passed: 14 London car/version combinations, all 128 garage GPS
combinations, all 64 browser startup/physics checks and online race controls,
26 offline mode/car checks, eight controls checks, and mouse/touch map gestures.
All 64 archived simulators remain byte-identical. Factory performance output
matches the recorded baseline hash, including the same 59 pre-existing failures.
