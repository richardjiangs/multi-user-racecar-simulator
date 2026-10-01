# Venom F5, AMG ONE, Valkyrie and McLaren F1: individual 1.0 artwork

These four cars extend the accepted low-dashboard revision. They retain the
original 1.0 HUD, console and view tabs. Each has its own hand-authored Canvas
driving fascia and SVG cabin, steering wheel, body and engine compartment.
Materials and small hardware are shared; the layouts and body paths are not.

| Car | Cabin and wheel | Exterior and engine compartment |
| --- | --- | --- |
| Hennessey Venom F5 | Open-top cream-trimmed yoke, Hennessey crossbar, red ignition switch, separate instrument and centre screens, narrow carbon console | Blue body, triangular side intake, butterfly door, split-spoke wheels; polished twin-throttle Fury plenum, gold bulkhead, charge pipes, braces and service fittings |
| Mercedes-AMG ONE | Two rectangular displays, grey fascia, rectangular AMG wheel with four coloured buttons, metal console controls | Roof intake and fin, front louvres, mesh side intake, deployed wing; central intake spine, asymmetric V6 covers, orange hybrid cable, inboard dampers and shielded exhaust |
| Aston Martin Valkyrie | Carbon tub, wheel-mounted instruments, separate console display, harness seats and two live camera monitors | Low canopy, open underbody tunnels, thin lighting, gullwing door and separate road/AMR Pro tails; long Cosworth V12 plenum, six exhaust branches per bank, gearbox and dampers |
| McLaren F1 (1993) | Central analogue instruments with white faces, green LCDs, simple Nardi wheel, right-hand manual lever and three-seat arrangement | Low road-car tail, roof scoop, dihedral door and five-spoke wheels; twin BMW plenums, gold thermal lining, intake ducts, brace and four exhaust sections |

The McLaren F1 has period reflective side mirrors in painted housings on inboard
stalks. This corrects the former electronic-screen interpretation. Its analogue
tachometer now binds to the live RPM needle and its 8,000-rpm dial scale.

## Driving view and cameras

The dash remains at 70% of viewport height and the wheel near the bottom, as in
the accepted SSC placement. The Valkyrie's wheel is slightly higher because its
instruments live inside it. The forward road corridor remains clear at desktop,
tablet and phone sizes. The original console can cover part of the lower wheel.
The separate Cockpit tab shows the complete wheel and clickable cabin controls.

Following the feedback about similar driving dashboards, the F5 now has separate
cream shoulder pads, an exposed driver recess and visible open yoke crossbar;
AMG ONE has its own grey wing fascia, rectangular instruments and buttoned wheel;
Valkyrie has separate carbon cowl wings and wheel-mounted instruments rather than
a continuous dashboard shelf. These are separate paths and layouts, not a colour
swap of a common dashboard.

Valkyrie's camera monitors and McLaren F1's reflective side mirrors remain
visible in Drive and Cockpit. Their rear scenes use independent eye positions
and outward angles in the existing projection, with or without traffic. The
F1 has curved glass, silver frames and stalks, without screen labels or scanlines.
On resize, both rear views are placed at the same height in free space around the
actual header, HUD, footer and touch controls. The layout reserves the forward
road corridor. DOM measurements are cached between resize/view changes.

Small screens use the compact 1.0 HUD. Touch pedals and steering remain in Drive
and hide while a view panel is open. Their original input handlers are unchanged.

## Functions preserved

Drawn buttons support pointer activation, Enter and Space and delegate to the
existing controls. The original console and shortcuts remain available.

- F5 mode uses the existing fuel/mode action; no new engine calibration.
- AMG DRS uses its existing action. The second screen now displays live vehicle
  data in both Canvas and SVG: speed, temperatures, boost and DRS; the Canvas
  view also has live throttle/brake bars. The SVG includes RPM and gear. It does
  not invent battery state or electrical output that this simulation does not model.
- Valkyrie starts in the road variant. Y and the drawn AMR Pro button retain the
  existing toggle; the AMR tail appears and road hybrid hardware hides with it.
- McLaren F1 uses the manual lever and existing neutral/reverse controls; it has
  no invented paddle shifters. Its existing XP5 record-run configuration remains.
- Ignition, lights, cooling, cabin audio, doors, lift, horn and driving modes use
  their existing simulator actions. Cabin lighting still starts off.
- Opening doors reveals the cabin; engine covers reveal the compartment; wheels
  rotate from the existing physics state while brake calipers stay fixed.

SPEC, audio, physics and transmission source sections are byte-identical to
`f353437`. Other cars' artwork, assists and sound are outside this revision.
These are hand-authored 2D illustrations based on photographs, not production CAD.

## Drawing references

Manufacturer descriptions establish the design; photographs were inspected for
the shapes, materials and component arrangements.

- F5: [model description](https://www.hennesseyflorida.com/2021-venom-f5/),
  [cabin](https://www.carbodydesign.com/media/2021/11/Hennessey-Venom-F5-Interior-01.jpg),
  [Fury engine](https://s1.cdn.autoevolution.com/images/news/gallery/an-in-depth-look-at-hennesseys-mind-blowing-1817-horsepower-ls-based-fury-v8_3.jpg).
- AMG ONE: [Mercedes launch material](https://media.mercedes-benz.com/article/f2612158-3abe-409c-8b75-6581489ee0f2),
  [cabin](https://luxurypulse.com/img/pictures/6642024304322le_19.jpeg),
  [engine compartment](https://images.pistonheads.com/nimg/49141/amg16.jpg).
- Valkyrie: [Aston Martin model page](https://www.astonmartin.com/en/models/valkyrie),
  [cabin](https://media.gq-magazine.co.uk/photos/6405fb67990efb98e161544d/master/w_1600%2Cc_limit/Aston-Martin-Valkyrie---Interiors-%282%29.jpg),
  [Cosworth V12](https://hips.hearstapps.com/hmg-prod/images/valkyriev12-9-1548691198.jpg).
- McLaren F1: [McLaren model page](https://www.mclaren.com/cars/gl_en/ultimate-models/mclaren-f1),
  [cabin](https://hagerty-media-prod.imgix.net/2021/06/1995_McLaren_F1-Creative-13.jpg?auto=format%2Ccompress&ixlib=php-3.3.0),
  [engine compartment](https://static.techno-science.net/illustrations/definitions/1200px/1/1996-mclaren-f1-engine_2b501f2c5acbfc8873889c4eb6d39957.jpg).

The four corresponding real photos in `assets/cars/` also served as exterior
references. The garage photos are unchanged.

## Regeneration and checks

Sources live in `tools/road-hypercars/next-*.mjs`, `next-driving-common.js` and
the four model-specific `*-driving.js` files. The bodykit registry calls the new
F5, AMG ONE and Valkyrie drawings. McLaren F1 remains protected from the general
bodykit generator and is updated directly by the four-car refresher.

```sh
node tools/refresh-next-hypercars-art.mjs
node tools/bodykit/apply.mjs
node tests/next-hypercars-art-test.mjs
node tests/road-hypercars-art-test.mjs
node tests/dashboard-sightline-test.mjs
node tests/track-specials-test.mjs
node tools/embed-sims.mjs
node tests/perf-test.mjs
node tests/browser-test.mjs
```

The focused test checks preserved powertrain/audio source, idempotence, SVG IDs,
control targets, click/keyboard parity, live instruments, special modes, both
camera projections, doors, wheels, covers and real-loop steering. The sightline
test now compares all fifteen updated cars with SSC at six viewport sizes; the
three cars with permanent side views additionally check four intermediate sizes,
bezel/label clearance, opposite
sides and level placement. It still detects the old high-dashboard regression.
Set `VERIFICATION_DIR` to save rendered screenshots and result files.
