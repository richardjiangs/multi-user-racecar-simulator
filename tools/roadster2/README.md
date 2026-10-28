# Roadster 2

Added October 2026. Only the new Roadster simulator uses these modules. The original 64 simulator sources and their performance/audio are preserved.

## References and scope

- [Tesla Roadster](https://www.tesla.com/roadster?redirect=no): current 2026 exterior, gold glazing, white fixed seats, yoke, two forward displays and center touchscreen; Performance, Thrust and Rocket variants. The cockpit was checked against Tesla's official carousel interior image. Vector artwork is authored here, not a recolored Plaid drawing. The driving view uses the low, full-width Type A composition and original footer controls; the yoke, fascia and screen details are Roadster-specific.
- [Golden Gate Bridge District dimensions](https://www.goldengate.org/bridge/history-research/statistics-data/design-construction-stats/): 2,737 m overall bridge, 1,280 m main span, 227 m towers, approximately 67 m deck clearance. Roadway and bridge geometry use those principal dimensions; terrain, skyline and surroundings are artistic approximations. The marked Golden Gate ramp is fictional simulator scenery, not a claimed Tesla test location.
- [Port Authority JFK runway diagram](https://www.panynj.gov/content/dam/port-authority/aircraft-noise/jfkac-presentation-sep-2022.pdf): runway 13R/31L nominal 14,511 × 200 ft (4,423 × 60.96 m). Terminal/apron scenery is an authored airport approximation, not a surveyed operational airport.
- Tesla Development Grounds is a fictional electric-car test oval. McGregor is a demo-inspired curved-ramp arena, not a survey of the SpaceX site.

The side elevation uses revised wheelbase/overhang proportions, separate titanium thin-spoke wheels with brake hardware, gold canopy reflections, white panel facets, lamp optics, body seams and animated perimeter thrusters.

Detailed A350-family aircraft use [Airbus published dimensions](https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a350-family): 73.78 m A350-1000 length, 64.75 m span, and 66.8 m A350-900 length. Fuselage cross-sections, swept cambered wings, nacelles with visible fan blades, cockpit/window/door details, lights and retractable landing-gear meshes are authored locally. Static meshes are uploaded once and rigidly transformed along continuous scenery flight paths; these are not real air-traffic data.

Steering uses estimated 2.75 m wheelbase and 35° maximum road-wheel lock, with speed-sensitive ground grip. Moving flight turns use a matching low-speed radius with acceleration limits; I/O rotation stays independent. These values are not published production steering specifications.

Precise production mass, drivetrain output and gas endurance are not fully published. The game explicitly labels its 1,800 kg, 900 kW, 400 km/h ceiling and 300,000 N·s stored gas impulse as **simulation estimates**, not factory specifications. Flight uses SI gravity, force/mass acceleration, drag, gas impulse consumption, attitude stabilization and landing velocity. It is a game flight model, not flight-test validation.

## Controls

- Z: toggle Thrust augment; V: hold rear cold-gas boost.
- Y: toggle Rocket / SpaceX. Disarming in flight requests a landing first.
- Rocket mode only: Tab increases the throttle lever by 5 percentage points per press; Shift decreases it. Holding a key does not repeat the adjustment. Release keeps the selected throttle. Up/down arrows are temporary accelerator/brake pedals; braking overrides but does not reset the lever.
- A/D move the bank yoke; it keeps its deflection after release. Left/right arrows, horizontal touchpad swipes (including fullscreen capture) and the touch wheel steer heading and trajectory independently.
- P/L command vertical hover up/down. W/S pitch the nose up/down without an angular stop: forward thrust follows the nose, allowing climbs, dives and full loops. W can lift a moving car; it cannot act as the ground accelerator in Rocket mode.
- I/O rotate left/right in place through unlimited yaw, using a balanced thruster couple. The position controller brakes back to the captured point; spinning does not rotate the horizontal velocity.
- F levels the nose, centers the bank yoke, zeros forward throttle and holds a fixed horizontal position and altitude. Increasing throttle or applying normal steering, pitch or bank releases position hold. P/L can adjust its height. G brakes to a fixed position and descends for landing. Disarming restores normal W/S and A/D road controls. The shared-track input boundary and capturing key listeners both enforce this separation.
- Cockpit D READY: shut doors, buckle, power on, select drive. Individual belt, power, neutral, reverse, lights and door controls also work.
- REFILL services a stopped car on the ground. Real Mode consumes gas and preserves damage; accessible mode replenishes gas and has no persistent impact damage.
- Touch controls are in the Roadster controls drawer. The existing steering wheel, D-pad and immediate T+Space trackpad controls remain available.

Flight works in the four complete Roadster worlds in both editions and over shared Track 2.0 worlds. Legacy pseudo-3D Track 1.0 circuits keep ground driving; their launch prompt directs the driver to a flight arena or Track 2.0.

## Build and validation

1. `node tools/roadster2/build.mjs`
2. `python3 tools/build-track2.py`
3. Serve repo on localhost:8000; `node tools/roadster2/snapshot.mjs`
4. `node --max-old-space-size=8192 tools/embed-sims.mjs`
5. `node tests/roadster2/controls.mjs` and `node tests/roadster2/controls.mjs --garage` (real keyboard, slider, touch wheel and fullscreen steering, both physics paths)
6. `node tests/roadster2/hover-yaw.mjs` (fixed hover, unlimited yaw, moving/ground U-turns and aircraft motion)
7. `node tests/roadster2/flight.mjs` and `node tests/roadster2/arenas.mjs` (worlds, gas, landings, ramps and touch controls)

The builder clones the existing EV template for compatibility, then installs unique art, controls, audio and worlds. Unused donor dashboard and body drawings are removed during generation. Each world mesh is constructed completely before driving and uploaded once per selection; the render loop does not generate chunks in front of the car. All new assets are procedural or vector source, with no remote runtime dependency. The LITE edition retains its specified ten cars.
