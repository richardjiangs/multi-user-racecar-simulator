# Five road hypercars: individual 1.0 artwork

This revision covers only the Chiron Super Sport 300+, Jesko, P1, F80 and modern
33 Stradale. The requested SSC reference meant the care of the drawing and the
**1.0 interface**, not SSC styling. Each car has its own canvas driving fascia,
SVG cockpit, side elevation and engine compartment. The original HUD, pedals,
gear controls and separate view tabs remain. These cars do not use the track
specials' 2.0 dashboard.

## What is drawn

| Car | Cabin and wheel | Exterior and rear compartment |
| --- | --- | --- |
| Chiron Super Sport 300+ | Black Alcantara, orange stitching, large central analog speedometer between digital displays, EB wheel, C-shaped centre spine and four machined climate dials | Long-tail dark body, orange accents, C-side opening, stacked exhausts; two W16/1600 carbon covers, central body spine, ducts and service caps |
| Jesko | Wheel-mounted SmartCluster with counter-rotating readout, spoke touch displays, portrait SmartCenter, machined console and separate selector | Attack boomerang wing and carbon wheels; existing Absolut body switching, fins and wheel cover retained; V8 airboxes, bracing, Triplex suspension and heat shielding |
| P1 | Left-hand driving position, three-part instruments, round Alcantara wheel with blue DRS/red IPAS controls, circular vents, IRIS console and H/P dials | Teardrop canopy, sculpted carbon door intake, deployable wing; V8 plenum and intake elbows, shielded exhaust, service fans and hybrid cable |
| F80 | Asymmetric red/black 1+ cabin, angular vents, flat top and bottom wheel with physical spoke buttons, manettino and gated console selector | Angular fenders, black canopy, five-blade wheels, six rear louvres; carbon structure, V6, transverse dampers, ducts and paired exhausts |
| Modern 33 Stradale | Tributo tan trim, telescopic twin instruments, button-free three-spoke wheel, perforated aluminum console, aircraft-style switches and low centre display | Curved canopy, side intakes, butterfly doors, telephone-dial wheels and round rear lamps; sculpted modern V6 carbon cover and service caps beneath the glass rear clamshell |

These are hand-authored 2D drawings, not photos, production CAD or generated
bitmap assets. Side views use a projected opening-door animation. Seats, belts,
sills and footwells appear inside the opening. Wheels rotate using the existing
physics state; brake calipers remain stationary. Engine covers reveal the
service compartment, and existing cooling-fan state drives the drawn fans.

## Controls and scope

The SVG cockpit controls support click, Enter and Space. They delegate to
existing ignition, shift, neutral/reverse, lighting, lift, cabin audio, climate,
door and mode actions. The original buttons and keyboard controls are retained.
The canvas driving fascia is an instrument drawing; the clickable controls are
in the Cockpit tab and original console.

- Chiron: temperature setpoint, fan level, Auto and A/C have separate controls.
  Setpoint and fan level are cabin UI settings; they do not add an HVAC or
  performance model. Shift-click turns the temperature dial down.
- Jesko: the wheel moves while the SmartCluster readout remains level. Autoskin
  uses the existing action. Y still selects the existing Attack/Absolut option.
- P1: DRS uses the existing DRS action. IPAS selects the hybrid power readout;
  combined hybrid output remains in the existing throttle model. It is **not a
  newly simulated manual boost system**. H and P use the existing combined
  simulator mode cycle; there are no new independent chassis/powertrain maps.
- F80: physical switches and manettino operate existing simulator controls.
- Alfa: ignition and drive-mode controls are on the console; the wheel centre
  operates the horn. The existing Pista action is retained.

No calibrated SPEC values, physics/transmission routines or audio graph were
changed. The targeted test compares those entire source sections against
`70d7d00`. Other cars retain their art, controls, assist defaults and audio.
Cabin lighting still starts off. The 919/eleven-F1 sound override is untouched.

Small screens retain the original controls in a compact layout. Driving touch
controls hide when a view panel is open, so they cannot obstruct its buttons.

## Sources used for drawing

Manufacturer material establishes the models and design features; actual cabin,
side and engine photographs were inspected for shape and placement.

- Bugatti: [Super Sport design](https://newsroom.bugatti.com/press-releases/the-bugatti-chiron-super-sport-the-quintessence-of-luxury-and-speed),
  [300+ production details](https://newsroom.bugatti.com/api/en/press-releases/pdf/first-bugatti-chiron-super-sport-300-ready-for-launch),
  [cabin](https://www.bugattiofgreenwich.com/imagetag/8172/13/l/Used-2022-Bugatti-Chiron-Super-Sport.jpg),
  [300+ side](https://de.drivenluxurycars.com/images/8622/152/bugatti-chiron-super-sport-300.jpg),
  [engine covers](https://hips.hearstapps.com/hmg-prod/images/2022-bugatti-chiron-supersports-07-1632927334.jpg).
- Koenigsegg: [Jesko press kit](https://mb.cision.com/Public/18511/3630153/9e2feb2f599a205c.pdf),
  [cabin](https://www.supervettura.com/images/koenigsegg/jesko-gallery-3.jpg),
  [engine and suspension](https://www.autoforum.cz/tmp/magazin/ko/Koenigsegg_Jesko_oficialni_12.jpg),
  [side](https://luxurypulse.com/img/pictures/6954438c98b73rande.jpeg).
- McLaren: [P1](https://cars.mclaren.com/us_en/legacy/mclaren-p1),
  [cabin](https://img.cdn.dragon2000.net/C395/U5478/IMG_81903-large.jpg),
  [engine with clamshell removed](https://gtspirit.com/wp-content/gallery/gallery-mclaren-p1-without-clamshell/mclaren-p1-engine2.jpg),
  plus the repository's `assets/cars/mclaren-p1.jpg`.
- Ferrari: [F80 press kit](https://cdn.ferrari.com/cms/network/media/pdf/CS_F80_gbr_v2.pdf),
  [design article](https://www.ferrari.com/en-CA/magazine/articles/the-ferrari-f80-a-car-from-the-future),
  [cabin](https://www.hdcarwallpapers.com/download/ferrari_f80_2024_interior-2560x1440.jpg),
  [side](https://car-images.bauersecure.com/wp-images/199969/ferrarif80_51.jpg),
  [rear compartment](https://www.goodwood.com/globalassets/.road--racing/road/news/2024/10-october/ferrari-f80/ferrari-f80-13.jpg?rxy=0.5).
- Alfa Romeo: [33 Stradale launch](https://www.media.stellantis.com/uk-en/alfa-romeo/press/alfa-romeo-33-stradale-daring-to-dream),
  [cabin](https://hagerty-media-prod.imgix.net/2023/08/New-Alfa-Romeo-Supercar-Interior-drivers-chest-view_Cockpit-scaled.jpg?auto=format%2Ccompress&ixlib=php-3.3.0),
  [modern engine cover](https://i.iplsc.com/000L0B9MBOF5FRMQ-C323-F4.webp),
  plus the repository's `assets/cars/alfa-33-stradale.jpg`.

## Editing and verification

Sources live in `tools/road-hypercars/`. Materials and small hardware are shared;
the five cabin layouts, driving renderers, engine arrangements and body paths
are individually authored. The bodykit entry points import those body drawings
so regeneration cannot silently replace them with older shapes.

```sh
node tools/refresh-road-hypercars-art.mjs
node tools/bodykit/apply.mjs
node tests/road-hypercars-art-test.mjs
node tools/embed-sims.mjs
node tests/perf-test.mjs
node tests/browser-test.mjs
```

The targeted test checks unchanged powertrain/audio source, refresh idempotence,
SVG IDs and control targets, actual clicks and keyboard activation, live
instruments, doors, cover visibility, wheel rotation from physics, real-loop
keyboard steering, portrait/landscape rendering and panel clearances.
Set `VERIFICATION_DIR` to save view screenshots.
