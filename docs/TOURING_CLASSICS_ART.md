# Six individual touring and classic 1.0 interiors

This revision draws the Speedtail, Huayra BC coupé, 2025 Corvette ZR1, 250 GTO,
F40 and Porsche 917K. Each has separate Canvas dashboard/wheel paths and SVG
cockpit, body and engine artwork. The existing 1.0 console, performance, inputs,
shortcuts, assistance and garage photographs remain intact. Cabin lights still
start off. Materials and small hardware are shared; the layouts are not.

| Car | Cabin and driving instruments | Body and engine details |
| --- | --- | --- |
| McLaren Speedtail | Central seat, curved three-screen fascia, simple carbon wheel, overhead controls, two passenger seats, always-visible independent rear camera views | Long tapered tail, stationary front aero disc over a rotating wheel, dihedral door; rear service illustration with intake, ducting, thermal shielding, transaxle, hybrid cable and alloy frame |
| Pagani Huayra BC | Carbon and blue leather, two large chronograph instruments with small supplementary dials, freestanding turbine vents, oval milled console, individual toggles, knurled controls, exposed selector linkage and fasteners | BC coupé roof and gullwing, fixed BC wing, detailed wheels and carbon lower body; ribbed V12 plenum, polished charge pipes, carbon airboxes, bracing, dampers and four central exhaust outlets |
| Chevrolet Corvette ZR1 | Squared C8 wheel, yellow marker, crossflags, driver display, angled centre screen, tall climate spine and DCT switches | C8/ZTK silhouette, split rear window, fixed rear wing, side intakes; blue LT7 intake casting, carbon spine, builder plate, ducting and shielding |
| Ferrari 250 GTO | Black crackle fascia, Veglia tachometer, small gauges, wood and drilled-metal wheel, metal footwell, blue cloth and gated lever | Long bonnet, roofline, three nose openings, wire wheels, side vents; six twin-choke Weber carburettors, twelve trumpets, black cam covers, distributors, radiator, filter and bracing |
| Ferrari F40 | Grey flock fascia, hooded analog instruments, plain Momo wheel, red seat, Kevlar door trim, switches and gated lever | Wedge, fixed rear wing, slatted rear glass, NACA ducts and five-spoke wheels; two intercoolers, cast intake runners, red couplers, two turbos, shielding and three exhaust outlets |
| Porsche 917K | Right-hand seat, large VDO tachometer, smaller gauges, drilled metal wheel, exposed frame/fuses and balsa gear knob | Short-tail racing body, five-hole wheels, Gulf bands and headlamp covers; twelve inlet stacks, central rotating fan, fuel/ignition lines, tubular frame and transaxle |

The body paths and engine illustrations follow inspected photographs. They are
2D simulator illustrations, not production CAD. The Speedtail engine illustration
uses the available factory body-off/service view; it does not claim to reproduce
hidden components. The Pagani drawing follows the BC coupé represented by the
existing simulation, not the Roadster shown in its existing garage photo.

## Instruments, interaction and low placement

The dash remains around 70% of the driving viewport, with the wheel low enough
to preserve the SSC reference's forward road corridor. The 1.0 console may cover
the lower rim; the Cockpit tab exposes the complete drawing. Classical windscreen
surrounds use appropriate painted/alloy/felt treatment rather than carbon pillars.

Every drawn button routes to an existing simulator action, or the established
cabin fan/temperature UI state. Enter/Space work as well as clicking. The ZR1
climate plus/minus switches change the setpoint in opposite directions. GTO and
917 ignition/fuel switches route to the simulator's unified ignition action;
there is no added independent fuel-pump physics. The old console retains any
simulator-only functions that do not belong in the real cabin.

Speed/gear/RPM, analog needles, auxiliary temperatures and boost read from live
state. Tachometer sweeps use the numbers printed on each dial. Speedtail's side
cameras use separate eye positions and outward angles and remain visible without
traffic. Door motion reveals interior trim; engine covers reveal the engine;
wheels rotate with the existing wheel state while calipers and the Speedtail's
front aero disc stay fixed. The 917 engine fan follows engine RPM.

## Three classic engine voices

Only the 250 GTO, F40 and 917 sound graphs change. A pre-existing inline comment
had swallowed `shaper.connect(this.synthGain)`, muting most of their engine
harmonics. The voice generator restores that connection on its own line and
reduces excessive wind, road and induction noise.

- GTO: six firing pulses per crank revolution, rounded Colombo V12 harmonics
  with load-dependent induction texture.
- F40: four pulses per revolution, flat-plane V8 harmonics and restrained turbo
  noise; the previous cross-plane lope is removed.
- 917: six pulses per revolution, stronger third harmonic, a rougher intake voice
  and a small crank-related cooling-fan tone. The direct oscillator polarity
  avoids cancellation with the sawtooth's fundamental at idle.

These are synthesized interpretations, not recordings. The fan order and harmonic
mix are audio-design approximations. Firing rates follow the engine layouts.
Offline Web Audio renders check idle, full load and redline, finite samples,
headroom, connected harmonics and engine/noise balance. Current load peaks are
approximately 0.66, 0.70 and 0.76 respectively, with redline peaks below 0.78.
Other sound effects and the recording selection controls are retained.

## Inspected references

Manufacturer material establishes the model and hardware; the images informed
the drawing geometry and materials. Reference photographs are not copied into
the artwork.

- Speedtail: [manufacturer press material](https://www.motorshow.me/uploadImages/GalleryDocs/Doc7434.pdf),
  [owner manual](https://mclaren-web.s3.eu-west-2.amazonaws.com/files/Owner%20Manual%20-%20P23%20-%20Europe%20-%20English.pdf),
  [official cabin photograph](https://mclaren.scene7.com/is/image/mclaren/McLaren_Speedtail-09-3%3Acrop-16x9?hei=1005&wid=1786),
  [factory powertrain images](https://www.autoweek.com/news/sports-cars/a32345033/mclaren-speedtail-1055-hp-hybrid-powertrain-details/).
- Huayra BC: [Pagani model page](https://www.pagani.com/huayra-bc/),
  [2017 coupé cabin](https://www.automototube.net/2017-pagani-huayra-bc-interior-view-2.jpg),
  [coupé engine photographs](https://rmsothebys.com/auctions/df24/lots/r0039-2017-pagani-huayra-bc-coupe/).
  The auction car has later modifications; its extra exhaust configuration is not used.
- ZR1: [Chevrolet launch and product photographs](https://news.chevrolet.com/newsroom.detail.html/Pages/news/us/en/2024/jul/0725-zr1.html),
  [2025 cockpit](https://www.theautohost.com/_contentPages/vehicleContentPages/chevy/2025/Corvette-ZR1/images/2025-Chevrolet-Corvette-ZR1-images-Interior.jpg),
  [official LT7 engine bay](https://news.chevrolet.ca/dld/content/dam/Media/images/US/Vehicles/Chevrolet/Cars/Corvette_ZR1/2025/Product/chevrolet-corvette-zr1-coupe-009.jpg).
- GTO: [Ferrari model history](https://www.ferrari.com/en-VE/history/garage/1962/250-gto),
  [cabin](https://s1.cdn.autoevolution.com/images/gallery/FERRARI-250-GTO-5526_5.jpg),
  [auction detail photographs](https://rmsothebys.com/auctions/mo18/lots/r0117-1962-ferrari-250-gto-by-scaglietti/).
- F40: [Ferrari history](https://www.ferrari.com/en-HU/history/moments/1987/enzos-dream/more),
  [designer interview](https://theroadrat.com/post/the-ferrari-f40),
  [cabin](https://www.joemacari.com/blobs/stock/10004759/images/e37e2bbc-209e-4019-a0d6-0baed29caf51.jpg?height=1333&width=2000),
  [engine and exterior photographs](https://www.fiskens.com/cars-previously-sold/1991-ferrari-f40/10945).
- 917K: [Porsche history](https://www.porsche.com/stories/innovation/why-the-porsche-917-is-a-gamechanger/),
  [right-hand cockpit](https://www.motor16.com/images/10000/10810/10810_porsche-917-k-gulf-imagenes-interior_1_2.jpg),
  [engine and body photographs](https://www.ecurie.co.uk/blog/2017/7/17/1970-porsche-917k).

The six existing `assets/cars/` photographs were also inspected for exterior form.

## Sources and checks

Edit `tools/road-hypercars/touring-{cabins,engines,exteriors}.mjs` and the six
individual `*-driving.js` files. The bodykit registry points to these body drawings.
Do not edit embedded base64 directly.

```sh
node tools/refresh-next-hypercars-art.mjs
node tools/refresh-touring-art.mjs
node tools/refresh-classics-audio.mjs
node tools/bodykit/apply.mjs
node tests/next-hypercars-art-test.mjs
node tests/touring-art-test.mjs
node tests/classics-audio-test.mjs
node tests/dashboard-sightline-test.mjs
node tests/road-hypercars-art-test.mjs
node tests/track-specials-test.mjs
node tools/embed-sims.mjs
node tests/perf-test.mjs
node tests/browser-test.mjs
```

Run the full browser suite alone because its driving checks use wall-clock time.
`VERIFICATION_DIR` saves focused screenshots and result JSON. The focused tests
assert unchanged SPEC/physics/transmission source against `f890153`, and unchanged
audio for the other three touring cars. They check idempotence, live instruments,
click/keyboard parity, doors, wheel rotation, covers, special functions, mobile
layout, steering and JavaScript/SVG errors. The existing four-car tests also cover
AMG's live second screen and the corrected F1 mirrors/tachometer.
