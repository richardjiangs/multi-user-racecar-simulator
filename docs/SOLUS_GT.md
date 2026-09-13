# McLaren Solus GT

The Solus GT is the 49th road/classic/track car in the 64-car garage, immediately
before the eleven Formula 1 teams. Its self-contained file exports `SolusApp`;
the garage key is `solusgt`. It includes Private Practice, Online Race, Learning,
and opt-in Real Mode.

## Sources and model boundaries

Manufacturer specifications:

- [McLaren Solus GT](https://cars.mclaren.com/us_en/mclaren-solus-gt): 5.2-litre
  naturally aspirated V10, more than 840 PS, 650 Nm, beyond 10,000 rpm, less than
  1,000 kg dry, 0–100 km/h in 2.5 seconds, maximum speed above 200 mph, and 1,200 kg
  downforce at 150 mph. The page's animated counters can return incomplete figures
  to text crawlers; the static specifications and written launch text are used.
- [McLaren launch release, manufacturer text mirrored as PDF](https://www.motorshow.me/uploadImages/GalleryDocs/Doc7823.pdf):
  central single seat, forward-sliding canopy, adjustable pedal box, fixed
  twin-element rear wing, individual throttle barrels, stressed engine,
  seven-speed straight-cut sequential transmission and carbon clutch.
- [Judd Power — Solus GT](https://juddpower.com/mclaren-solus-gt/): engine maker's
  association with the car. The synthesis does not claim to be a recorded engine.
- [Goodwood's 2023 winning run](https://www.goodwood.com/grr/event-coverage/festival-of-speed/video-mclaren-solus-gts-insane-shootout-winning-run/):
  a reference for the high-rev V10 character; no lap-time replication is claimed.
- [Donington Park circuit map](https://www.donington-park.co.uk/about/circuit-map):
  4.02 km GP layout, twelve corners. [McLaren's 1993 European GP history](https://www.mclaren.com/racing/heritage/trophies/mclaren-trophies-european-gp-1993/)
  provides the heritage connection. This is not claimed as a Solus factory test venue.

Photo references inspected before drawing:

- [Exterior side elevation](https://www.autobics.com/wp-content/uploads/2022/08/2023-McLaren-Solus-GT-Side.jpg)
- [Central cockpit](https://www.topgear.com/sites/default/files/2024/06/_W8A2088.jpg)
- [Judd engine with ten intake trumpets](https://hips.hearstapps.com/hmg-prod/images/vol-25-mclaren-solus-23-67410952e652d.jpg?resize=980%3A%2A)

All artwork is newly hand-authored SVG geometry, not a recoloured car template.
The engine view is a schematic service inspection with the airbox lifted: the
trumpets, two cam covers, injector wiring, five-into-one headers, cooling packs,
transaxle and suspension are individually drawn. Their exact routing is illustrative.
Exterior canopy, body channels, wheel pods and fixed wing follow the side photograph.
The cockpit follows the central tub and canopy spine, camera, fixed seat, pull straps,
carbon wheel, display, LEDs and orange rotaries visible in the references.

Unpublished parameters are explicitly simulation assumptions: 990 kg dry reference
mass; 618 kW power baseline (840 PS rounded); torque curve from 280 Nm at 2,000 rpm to
650 Nm at 8,500 rpm with a 618 kW cap; 10,500 rpm cutoff; 2.65 m wheelbase and 1.65 m
front track; 0.35 m rolling radius; final drive 3.7 and ratios
3.82 / 3.10 / 2.52 / 2.05 / 1.67 / 1.36 / 1.10; Cd 0.74 on 1.62 m²; 26 m 100–0
braking benchmark. These are not represented as published factory measurements.
First gear is approximately 98 km/h at the model cutoff; seventh approximately
340 km/h. The model's normal-speed benchmark is 322 km/h, just above 200 mph.
Real Mode removes that benchmark governor and lets power, drag, gearing and wear
set speed. Damage and tyre-wear rates are educational calibrations, not measured
McLaren failure rates. There is no FIA F1 energy store, LMH BoP or championship
rulebook imposed on this unrestricted track car.

## Working controls

- Z or the MODE rotary cycles WET / INTER / TRACK / RACE. The labels follow the
  photographed selector; model response/power factors are 45 / 65 / 85 / 100%.
- SLIP / TC cycles twelve simulator intervention steps; ABS toggles lock-up
  protection. BIAS cycles 52–64% front balance, with 58% the model's reference.
  These change physical acceleration or braking, not just text labels.
- PLS operates the pit limiter; N selects neutral; START toggles ignition;
  AC operates cabin cooling; OK cycles G, lap-time and brake-temperature pages.
- CANOPY opens one canopy forward and upward only when stopped. Selecting drive
  closes it. The seat remains fixed; PEDALS + / − move the pedal-box drawing.
- The canopy camera controls the existing rear-world rendering in Drive.
  The inspection panel's camera illustration is static.
- The wheel turns with steering; gear, speed, revs, mode, TC/ABS/bias and shift LEDs
  are live. Each exterior wheel rotates from physical distance, reverses and stops
  with the car. Calipers stay fixed.
- The low driving overlay preserves the scene from the horizon to 68% viewport
  height. Full drawings and controls are available in the Cockpit tab. Phone
  steering and pedals occupy separate sides.

The seven shared circuits are unchanged. Donington has the required 16 m base
width and shared 3.75 visual scale. Its corner radii and distances are approximate
model geometry following the real sequence, not a surveyed track scan. The
Solus-only owner-session grid uses fictional liveries, not invented racing teams.
The dedicated learning chapter covers central-seat vision, wheel-pod clearance,
pedal setup, high-rev shifting, the four maps and speed-dependent fixed aero.

## Audio and maintenance

The two bank waveforms carry five combustion events each over 720 crank degrees,
interleaved every 72 degrees. Their oscillators run at rpm / 120, producing five
combined firing events per revolution. Narrow pressure pulses, high-frequency
exhaust resonances, induction noise and a low-level straight-cut gear component
create the Solus voice. There are no turbo or electric traction oscillators.
The engine waveform is drawn from an AnalyserNode on the actual audio graph.
Music is optional and separate. The audio-level control is a simulator setting,
not a claim that the real car has an exhaust flap.

Edit `tools/draw-solus.mjs`, then run `node tools/draw-solus.mjs` to regenerate the
three `tools/solus-art/*.svg` sources and refresh the simulator and garage card.
It does not rewrite physics, controls or other cars. After simulator edits, run
`node tools/embed-sims.mjs` to rebuild the online/offline garage artifacts.

Validation: `tests/solus-test.mjs` exercises the drawn controls, mechanical effects,
canopy and pedals, live instruments, fixed aero, Real Mode, wear/retirement,
Donington, Learning and the rendered audio graph at 2,000 / 6,000 / 10,000 rpm.
`tests/perf-test.mjs solusgt` verifies 0–100, Normal maximum and braking.
`tests/driving-regression-test.mjs` includes Solus at desktop, laptop and phone sizes.
The complete garage browser and performance suites remain required before publishing.
