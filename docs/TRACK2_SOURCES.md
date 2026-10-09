# Track 2.0 route provenance and limits

This release contains 83 route entries used by 63 upgraded simulators. All 64 original Track 1.0 files remain unchanged. Both Rolls-Royce city-journey implementations remain unchanged; Spectre's shared circuits use Track 2.0. Phantom has no shared circuit interface and retains its original simulator.

## What is mapped and what is authored

- Circuit and public-road centerlines use OpenStreetMap, TUM racetrack-database, Bacinger circuit data and Track Atlas where available. They are resampled at fixed stations and normalized to the selected layout's nominal length. A mapped path is not a laser scan.
- Coarse geographic elevation samples are interpolated continuously. Landmark profiles supplement them. Fuji, SUGO, Furka and Bathurst profiles are constrained by published gradient limits. SUGO's range is bounded by 69.83 m. Banking at AVUS is historical; Ehra banking is an approximation. Building footprints use OSM where available; missing building heights, openings and scenery are authored.
- Pits use mapped pit ways where available and modeled connectors/service areas elsewhere. Their rendered pavement, barriers and driving coordinates share the same geometry. Rendered terrain cells are depressed beneath crossing pavement so a coarse ground triangle cannot hide or pierce the road.
- Gotland's South layout is an operator-map reconstruction, Norisring a simplified historical/current-layout model, and AVUS an 8.3 km historical reconstruction with the former northern banking. They are explicitly not current-road surveys.
- The DB5 missions are film-inspired sets. Their original mission distances and objectives are retained; streets, buildings, industrial structures, bridges and interiors are authored in a permanent world. They are not surveyed routes through those cities. The F12tdf museum remains a fictional 380 m exhibition drive with its existing exhibits.
- Widths retain the approved Track 2.0 scaling. Scenery is illustrative; this is not a navigation tool or a source of track safety measurements.

Every selected route is fully loaded before driving. Its mesh is immutable, world anchored and depth tested. Camera culling avoids drawing geometry behind the driver but does not generate, move or discard route sections based on driving progress.

## Dakar 2026

The eleven routes available across the four existing Dakar car menus now total 3,795 km. Distances and terrain order follow the organizer overview and contemporaneous team stage reports. Local bends, height details and terrain boundaries are **authored reconstructions, not GPS roadbooks**. The official overview map does not provide sufficient detail to claim exact rally paths.

Stages include hard piste, gravel, rocky wadis, canyons, dunes, fesh-fesh, salt flats, acacia groves and coastal ground. Their grip and suspension response differ. The 326 km Stage 6 includes a 51 km neutralized transfer from km 78 to km 129, excluded from the stage timer. Liaison distances are not silently added to timed distances. Marathon stages do not provide invented mid-stage assistance. Assistance trucks appear only at modeled service zones; Real Mode repairs and practice service are tested separately.

References:

- [Organizer's 2026 overview map](https://storage-aso.lequipe.fr/ASO/motorSports_dak/dak26-parcours-vd.pdf)
- [Toyota Auto Body Dakar 2026 stage reports](https://portal.toyota-body.co.jp/dakar/en/news/2026/) — individual reports are linked in the catalog below.

## F1 artwork

The ten additional teams have separate wheel outlines, grip profiles, control arrangements, cabin geometry, bodywork and power-unit illustrations. The Mercedes artwork is retained. Drawn controls call existing simulator actions and displays read live state. Audio, keyboard bindings and powertrain calibration remain unchanged.

References and limitations are recorded in `tools/tracks2/research/f1-references.json`. Public launch material and older team wheel references do not reveal every 2026 switch or internal installation. The artwork is a hand-authored interpretation, not a claim of access to confidential CAD. The engine panels illustrate disclosed architecture, not hidden internal packaging dimensions.

## Geographic attribution

Route and building data: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License. Derived geometry and its build inputs are available in this repository.

Additional datasets: [TUMFTM racetrack-database](https://github.com/TUMFTM/racetrack-database), [Bacinger f1-circuits](https://github.com/bacinger/f1-circuits), [Track Atlas](https://github.com/tobi/track-atlas). Their respective repositories document the source data and licensing. Coarse elevation inputs are SRTM/OpenTopoData-derived, not a track surface scan.

Primary checks: [Fuji gradients](https://fsw.tv/guide/facility/racing.html), [SUGO layout, gradient and elevation](https://sportsland-sugo.co.jp/course/c-racing/), [Furka gradient](https://www.tcs.ch/de/tools/verkehrsinfo-verkehrslage/furka-pass.php), [Bathurst circuit](https://www.bathurst.nsw.gov.au/Services/Facilities/Mount-Panorama/About-the-Mount/The-Circuit), [Gotland layout](https://gotlandring.com/facility/), [MIRA banking](https://vehicletesting.solutions/proving-ground/high-speed-circuit/), [Goodwood Hillclimb](https://www.goodwood.com/motorsport/festival-of-speed/explore/hillclimb/).

## Route catalog

Each entry exposes its accuracy note inside the simulator's Circuit panel. A shared name has one model across all upgraded simulators that offer it. Original Rolls-Royce city journeys are outside this catalog.

| Route | Length (km) | Source / basis |
| --- | ---: | --- |
| Circuit de Monaco | 3.337 | Bacinger / OpenStreetMap |
| Nürburgring GP | 5.148 | TUM / OpenStreetMap |
| Nordschleife | 20.832 | OpenStreetMap |
| Nürburgring 24h | 25.378 | OpenStreetMap |
| Suzuka Circuit | 5.807 | TUM / OpenStreetMap |
| Silverstone Circuit | 5.891 | TUM / OpenStreetMap |
| Circuit de Spa-Francorchamps | 7.004 | TUM / OpenStreetMap; RAC Spa altitude map |
| Nardò Ring | 12.6 | Porsche Engineering, analytic 12.6 km circle |
| Algarve Circuit | 4.653 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/portimao) |
| Laguna Seca | 3.602 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/laguna-seca) |
| Circuit de la Sarthe | 13.626 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/circuit-de-la-sarthe) |
| Circuit de la Sarthe — 2017 | 13.629 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/circuit-de-la-sarthe) |
| Autodromo di Imola | 4.909 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/imola) |
| Autodromo Imola — 499P | 4.909 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/imola) |
| Mugello Circuit | 5.245 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/mugello) |
| Circuit Zandvoort | 4.259 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/zandvoort) |
| Fuji Speedway | 4.563 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/fuji) |
| Shanghai International Circuit | 5.451 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/shanghai) |
| Watkins Glen International | 5.472 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/watkins-glen) |
| Road America | 6.515 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/road-america) |
| Sebring International Raceway | 6.019 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/sebring) |
| Circuit de Barcelona-Catalunya | 4.657 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/barcelona) |
| Daytona Road Course | 5.729 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/daytona) |
| Red Bull Ring | 4.318 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/red-bull-ring) |
| Autodromo Nazionale Monza | 5.793 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/monza) |
| Circuit of the Americas | 5.513 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/circuit-of-the-americas) |
| Bahrain International Circuit | 5.412 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/bahrain) |
| Circuit Paul Ricard | 5.842 | [source](https://github.com/bacinger/f1-circuits/blob/master/circuits/fr-1969.geojson) |
| Autodromo Jose Carlos Pace | 4.309 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/interlagos) |
| Baku City Circuit | 6.003 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/baku) |
| Miami International Autodrome | 5.412 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/miami) |
| Hungaroring | 4.381 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/hungaroring) |
| Las Vegas Strip Circuit | 6.201 | [source](https://github.com/tobi/track-atlas/tree/main/tracks/las-vegas) |
| Furka Pass | 22.333 | [source](https://www.openstreetmap.org/copyright) |
| Ehra-Lessien | 21 | [source](https://www.openstreetmap.org/copyright) |
| MIRA Proving Ground | 4.5 | [source](https://www.openstreetmap.org/copyright) |
| Mount Panorama, Bathurst | 6.213 | [source](https://www.openstreetmap.org/copyright) |
| Autodromo di Modena | 2.068 | [source](https://www.openstreetmap.org/copyright) |
| Launch and Landing Facility | 4.572 | [source](https://www.openstreetmap.org/copyright) |
| Goodwood Motor Circuit | 3.809 | [source](https://www.openstreetmap.org/copyright) |
| Scandinavian Raceway, Anderstorp | 4.025 | [source](https://www.openstreetmap.org/copyright) |
| Twin Ring Motegi | 4.801 | [source](https://www.openstreetmap.org/copyright) |
| Okayama International Circuit | 3.703 | [source](https://www.openstreetmap.org/copyright) |
| Hethel Test Track | 3.54 | [source](https://www.openstreetmap.org/copyright) |
| Automotodrom Grobnik | 4.168 | [source](https://www.openstreetmap.org/copyright) |
| Autodromo di Varano | 2.35 | [source](https://www.openstreetmap.org/copyright) |
| Sportsland SUGO | 3.586 | [source](https://www.openstreetmap.org/copyright) |
| Willow Springs | 4.023 | [source](https://www.openstreetmap.org/copyright) |
| Sachsenring | 3.671 | [source](https://www.openstreetmap.org/copyright) |
| MotorLand Aragón | 5.344 | [source](https://www.openstreetmap.org/copyright) |
| Virginia International Raceway Grand Course | 6.76 | [source](https://www.openstreetmap.org/copyright) |
| Balocco Proving Ground | 5.75 | [source](https://www.openstreetmap.org/copyright) |
| Pista di Fiorano | 2.976 | [source](https://www.openstreetmap.org/copyright) |
| Dunsfold Park | 2.82 | [source](https://www.openstreetmap.org/copyright) |
| Tsukuba Circuit | 2.045 | [source](https://www.openstreetmap.org/copyright) |
| Brands Hatch GP | 3.908 | [source](https://www.openstreetmap.org/copyright) |
| Donington Park GP | 4.02 | [source](https://www.openstreetmap.org/copyright) |
| Hockenheimring | 4.574 | [source](https://www.openstreetmap.org/copyright) |
| Goodwood Hillclimb | 1.867 | [source](https://www.goodwood.com/motorsport/festival-of-speed/) |
| Nevada State Route 160 | 17.7 | [source](https://www.koenigsegg.com/history) |
| Gotland Ring | 4.1 | [source](https://gotlandring.com/facility/) |
| Norisring | 2.3 | [source](https://github.com/TUMFTM/racetrack-database) |
| AVUS Berlin | 8.3 | [source](https://www.berlin.de/ba-charlottenburg-wilmersdorf/ueber-den-bezirk/kultur-und-wissenschaft/skulpturen-und-denkmale/artikel.156596.php) |
| Prologue — Yanbu | 22 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/01.html) |
| Stage 2 — Yanbu to AlUla | 400 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/03.html) |
| Stage 3 — AlUla | 421 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/04.html) |
| Stage 4 — AlUla Marathon | 452 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/05.html) |
| Stage 5 — AlUla to Hail | 371 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/06.html) |
| Stage 6 — Hail to Riyadh | 326 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/07.html) |
| Stage 7 — Riyadh to Wadi Ad Dawasir | 459 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/09.html) |
| Stage 8 — Wadi Ad Dawasir | 483 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/10.html) |
| Stage 9 — Wadi Ad Dawasir to Bisha | 410 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/11.html) |
| Stage 11 — Bisha to Al-Hanakiya | 346 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/13.html) |
| Stage 13 — Yanbu Finish | 105 | [source](https://portal.toyota-body.co.jp/dakar/en/news/2026/15.html) |
| Mission — Tokyo, World Grand Prix | 9.4 | Authored film/exhibition set |
| Mission — London, the last race | 8.6 | Authored film/exhibition set |
| Mission — Furka Pass & Auric Enterprises, 1964 | 8.9 | Authored film/exhibition set |
| Mission — Matera, 2021 | 5.2 | Authored film/exhibition set |
| Mission — Oil Platform, Pacific | 11.6 | Authored film/exhibition set |
| Mission — Paris, the parts market | 4.2 | Authored film/exhibition set |
| Mission — Porto Corsa, the casino | 8.3 | Authored film/exhibition set |
| Mission — Cars 2, the whole thing | 44.5 | Authored film/exhibition set |
| Museo Ferrari, Maranello | 0.38 | Authored film/exhibition set |

## Build and verification

The checked-in `track-data.json` and geometry export tools reproduce the immutable meshes. Research scripts record earlier mapping/normalization steps; raw downloaded map/PDF caches are not shipped as website assets.

```sh
node --max-old-space-size=8192 tools/build-track2-world.mjs /tmp/track2-world
node tools/pack-tracks2.mjs /tmp/track2-world
python3 tools/build-track2.py
node --max-old-space-size=8192 tools/embed-sims.mjs
node tools/build-pages.mjs
```

Verification uses `tests/track2/preservation.py`, `geometry.mjs`, `open-route.mjs`, `variants.mjs`, `f1-art.mjs`, `driving.mjs`, `rally-driving.mjs`, `scenery-review.mjs` and `settings.mjs`, plus the existing performance and garage/browser suites. Browser tests require a local HTTP server on port 8000, Playwright and Chromium; runtime locations may be supplied through `CODEX_NODE_MODULES` and `CHROMIUM_PATH`.

The offline garage is generated during Pages deployment because it exceeds GitHub's individual Git-file limit. It remains one HTML download. The duplicate local-folder fallback `sims-embedded.js` is generated locally but omitted from the hosted artifact to meet the Pages size limit. The hosted garage loads only the selected simulator and route. A complete repository-folder copy needs all files under `assets/tracks-2/`; copying only a 2.0 simulator HTML does not make that variant a standalone offline file.
