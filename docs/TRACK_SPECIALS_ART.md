# Track-special drawings and Valkyrie variants — September 2026

The Viper ACR Extreme Aero, MCXtrema, 2024 Peugeot 9X8 and Aurora Agil now have twelve individually drawn SVGs: one exterior, cockpit/dashboard and engine layout for each car. The driving view renders the same cockpit geometry as the cockpit panel. Speed, gear, revs, tachometer needles, shift LEDs and model-specific readouts are overlaid from live simulation state, and the wheel rotates around its own drawing origin.

Only controls connected to a matching simulator function are interactive; unmodelled race-radio, ECU-reset, mixture and acknowledgement controls remain part of the drawing.

These are hand-authored illustrations informed by reference photographs and technical documentation, not photographs, dimensional CAD models or factory component schematics. Shared code repeats materials, fasteners and wheels; each body's profile, cabin structure and engine arrangement has its own coordinates.

## Drawing references

- **Dodge Viper ACR Extreme Aero:** long front clamshell, cabin behind the engine, gill behind the front wheel, side-exhaust outlet ahead of the rear wheel, fixed Extreme Aero wing, splitter and dive planes. The cockpit has the full-time analogue tachometer beside its configurable digital display, four round vents, central Uconnect screen, suede steering wheel and six-speed manual lever. The engine illustration shows the naturally aspirated V10's long intake, ten runners, twin front throttles, red valve covers and crossed brace. The incorrect dry-sump label was removed. Primary references: [FCA's 2016 model announcement](https://www.prnewswire.com/news-releases/dodge-viper-powers-into-2016-with-new-acr-model-expanded-custom-options-and-industry-exclusive-colors-300105302.html) and [ACR launch release](https://www.prnewswire.com/news-releases/new-2016-dodge-viper-acr--fastest-street-legal-viper-track-car-ever-300080280.html), plus vehicle photographs used during visual review.
- **Maserati MCXtrema:** Blu Xtrema number 24 profile with long wedge nose, roof intake, rear buttress/fin and high rear wing. The stripped cockpit has the five-inch display on the blue-grip steering wheel, exposed cage and yellow console labels. The rear powertrain drawing distinguishes the intake bridge, twin turbo plumbing and sequential transaxle. References: [Maserati's MCXtrema page](https://www.maserati.com/us/en/corse/mcxtrema) and [Maserati's July 2024 release](https://www.media.stellantis.com/em-en/maserati/press/mcxtrema-the-most-powerful-track-only-maserati-july-2024).
- **Peugeot 9X8:** the **2024 winged LMH**, with number 94, long low wheel pods, three-claw front lighting and a carbon survival cell. Its endurance wheel carries the display, LEDs, coloured controls and rotaries. The powertrain cutaway separates the front 200 kW MGU from the rear twin-turbo 2.6-litre V6 and seven-speed gearbox, linked by the high-voltage system. The livery is an illustrative treatment. References: [2024 model reveal](https://peugeot-sport.com/en/2024/03/23/peugeot-9x8-reveal-2024/), [Peugeot Sport's technical sheet](https://peugeot-sport.com/wp-content/uploads/2024/11/fiche-technique-2024-9x8-1.pdf), and [ACO's cockpit photographs](https://www.24h-lemans.com/en/news/the-peugeot-9x8-under-the-microscope-has-the-lion-sharpened-its-claws-59722). The schematic layout is informed by Peugeot's powertrain cutaway; hidden pipes and brackets are simplified.
- **Zenvo Aurora Agil:** red fender pods and open carbon channels, low canopy and rear wing; inside, exposed ZM1 structure, a raised central analogue tachometer, side instruments, red seat pads and an open-spoke wheel. The engine illustration puts all four turbochargers inside the V with the rear P2 motor at the transmission. References: [current official model specifications](https://zenvoautomotive.com/models/), [original design explanation](https://zenvoautomotive.prezly.com/zenvo-automotive-the-second-chapter), and [MAHLE engine announcement and photographs](https://zenvoautomotive.prezly.com/zenvo-automotive-announce-mahle-powertrain-as-engine-partner-on-all-new-v12-quad-turbocharged-engine). The current official page specifies eight speeds and a 360 km/h limiter; the older release described seven speeds and different targets. The simulator retains the current eight-speed model. Agil's powertrain is modelled with the rear P2 motor and no front motors; the current table's AWD architecture row conflicts with its own “front motors: not applicable” entry and the original Agil drivetrain description.

## Sound

The four engines use separate band-limited exhaust-bank pressure pulses over a 720-degree engine cycle. The oscillator cycle frequency is `rpm / 120`; the combined banks contain ten, six, six or twelve pulses per cycle respectively. The Viper has an uneven paired pulse envelope and short side-exhaust resonance, the Maserati a darker turbo V6 and sequential-gear layer, the Peugeot a sharper LMH V6 with gearbox and speed-gated front-MGU tone, and the Zenvo a V12 with four compressor bands and a rear-P2 layer.

Pulse widths, bank pressure balance, resonances, gear-mesh orders and motor/turbo pitches are **synthesis assumptions**, not manufacturer firing-order measurements or recordings. Existing user-supplied recording import remains available. The engine-panel waveform reads a real Web Audio analyser on the powertrain bus; wind, tyres and cabin music are excluded. Its horizontal window is 25 ms, and it shows a flat line before audio starts.

## Valkyrie behavior

The road Valkyrie is the default. `Y`, the cockpit's **Enable AMR Pro** button and the button in the cockpit drawing select the AMR Pro track variant. Repeating a held key does not toggle it repeatedly. Reset returns to the road car. Applying either variant restores a complete specification and aero baseline, so repeated toggles cannot compound changes.

The road model uses the [2019 launch powertrain specification](https://media.astonmartin.com/aston-martin-valkyrie-the-ultimate-hybrid-powertrain-for-the-ultimate-hypercar/?lang=eng): 1,160 bhp combined and KERS. Its 2.5 s, 350 km/h and 1,030 kg values are simulator targets. The [AMR Pro announcement](https://media.astonmartin.com/aston-martin-valkyrie-amr-pro-the-ultimate-no-rules-hypercar/?lang=eng) establishes the 1,000 bhp naturally aspirated V12 and removal of the hybrid hardware. Its 2.3 s, 402 km/h and 1,000 kg values remain user-requested simulator targets, not published or measured factory performance. `Z` controls road KERS or, in AMR Pro, Le Mans/maximum-downforce aero trim. The latter never adds electric power.

## Driving visibility

The driving projection now occupies the lower 32% of the viewport, with compact controls and a smaller HUD. It keeps the road from the horizon through 66% of the screen clear at desktop, laptop and phone sizes. Cockpit retains the full drawing and interactive controls. The two phone touch controls occupy opposite corners without overlapping.

## Maintenance and checks

Edit the paths in `tools/draw-track-specials.mjs`, then run:

```sh
node tools/draw-track-specials.mjs
node tools/refresh-track-specials-art.mjs
node tools/embed-sims.mjs
node tests/perf-test.mjs
node tests/browser-test.mjs
node tests/track-specials-test.mjs
node tests/driving-regression-test.mjs
```

The Valkyrie exterior is maintained by `drawAston` in `tools/bodykit/drawn.mjs`, including the optional AMR Pro tail and wing. The new track-special test checks live instruments, actual cockpit controls, both Valkyrie selection paths and reset behavior. It also renders the shipped audio graphs at 1,500 and 4,500 rpm in `OfflineAudioContext`, checking output levels, clipping, crank frequency and the different spectral balance of the two V6s. Set `VERIFICATION_DIR` to save WAV files and measured audio metrics. Visual review covers all twelve drawings and all four driving dashboards; automated checks do not establish photographic or acoustic fidelity.
