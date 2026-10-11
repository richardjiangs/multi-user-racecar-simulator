# Steering, Dakar conditions and detailed worlds

This release follows GPS build `4b000f3`. GPS stays available in both garage track modes, with the historical-car and Formula 1 exclusions documented in [GPS_NAVIGATION.md](GPS_NAVIGATION.md).

## Controls

Assist supplies steering, a geometric cornering line with later hairpin apexes, and a passing path where space is available. It supplies no throttle or brake demand. The separate Test Driver and adaptive cruise retain their pedal control. Selecting a circuit no longer silently enables Test Driver. This is a geometric driving aid, not recorded professional-driver telemetry.

Hold **T + Space for one second** to enter fullscreen trackpad steering. Releasing either key early cancels entry; Escape leaves the mode. A long mouse press no longer activates it. The homepage PC/D-pad preference and steering wheel remain available.

`tools/driving/controls.js` applies the same controls to garage-loaded Track 1.0 copies and generated Track 2.0 downloads. The 64 archived original simulator HTML files remain byte-identical.

## Dakar surface and weather

Each stage still loads its complete permanent world before driving. Shared circuit widths, centreline routes, stage distances and pit geometry are unchanged.

The rally road now has fixed, band-limited relief at three-metre export stations. Four wheel samples drive a damped body heave/pitch/roll model; the camera follows that body motion. Suspension load affects the existing surface grip model. Asphalt transfers remain much smoother than rocky wadis. Crests retain ballistic separation and landing; practice and Real Mode service behavior is preserved. The ground, rock strata, dunes, vegetation and coast remain authored reconstructions, not surveyed terrain.

Weather is restricted to Dakar stages. January 2016–2025 METAR reports from six nearby Saudi airports were reduced to one valid observation per station-hour. Missing hours were excluded. Weather categories use METAR precipitation/dust codes; observed condition-specific median wind and visibility inform appearance. `9999`/CAVOK visibility is a lower bound of 10 km, not an exact observation above it.

| Nearby station | Valid hours | Rain | Dust/sand in air | Reported dust/sand storm |
|---|---:|---:|---:|---:|
| Yanbu | 7,412 | 0.162% | 0.418% | 0 observed |
| AlUla | 6,595 | 0.273% | 0.804% | 0 observed |
| Hail | 7,401 | 1.365% | 0.689% | 0 observed |
| Riyadh | 7,406 | 2.565% | 5.063% | 0.068% |
| Wadi Ad Dawasir | 7,260 | 0.372% | 4.848% | 0 observed |
| Bisha | 7,358 | 0.082% | 6.021% | 0 observed |

These are nearby-airport January hour fractions, **not exact weather probabilities along the rally roadbook**. Zero observations do not establish impossibility. Hourly event runs provide modelled mean durations; a continuous-time clear/event process preserves the measured equilibrium fractions. Transitions use simulation seconds, independent of rendering frame rate. Region weights follow stage start/end areas. Rain grip and visual particles are simulation approximations, not measured tyre or particle physics.

The stage clock begins at 08:00 local and advances with elapsed simulation time. NOAA solar-position equations use January date, regional latitude and longitude: a sufficiently late finish reaches dusk and night. Other tracks remain in daylight, including DB5 missions whose old story scripts set night. Night is not randomly applied to ordinary circuits.

Research/data: [IEM archive](https://mesonet.agron.iastate.edu/request/download.phtml), [Saudi station table](https://mesonet.agron.iastate.edu/sites/networks.php?network=SA__ASOS), [NOAA solar equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF), and the [stage source table](TRACK2_SOURCES.md). Reproduce the weather reduction with `python3 tools/tracks2/research/build-weather.py`; its checked-in JSON includes request URLs and raw-response SHA-256 hashes.

## Vehicles and scenery

Non-F1 Track 2.0 rivals use authored coachwork profiles, glazing, wheel arches, tyres, rotating rims, lamps, vents, sills and rear diffusers. The Dakar opponents have distinct Dacia, Ford, Toyota and Prodrive silhouettes. Existing F1 player/rival mesh drawing code is byte-identical to the GPS release.

DB5 film-inspired sets gain stepped Matera limestone buildings and parapets; Furka ridges, scree and hotel massing; London brick frontages; Paris mansard buildings; Tokyo signs; Porto colonnades; and platform bracing. Original mission timing/objectives and authored route spines remain. These are interpretations, not an exact geographic or film-set survey. Reference context includes [Bond's Italy](https://www.007.com/james-bonds-italy/bonds-italy-matera/) and [Furka Pass](https://www.tcs.ch/de/tools/verkehrsinfo-verkehrslage/furka-pass.php), alongside the original route sources.

The F12tdf's fictional 380 m museum drive now renders its twenty existing exhibits as depth-tested 3D models on plinths, with railings, labels, ceiling structure, lights and trophy displays. The older flat exhibit renderer remains only in the archived Track 1.0 original. Museum references: [Ferrari Supercars exhibition](https://www.ferrari.com/en-EN/museums/supercars) and [Ferrari's museum brochure](https://cdn.ferrari.com/cms/network/media/pdf/Brochure%20Eventi%20Musei%20Ferrari%202023.pdf).

## Storage and validation

Mesh storage chooses the smallest lossless representation per route: raw, XOR byte planes, indexed vertices, or indexed XOR planes. Decoding restores the original vertex bytes and draw order exactly. Every packed route is compared byte-for-byte against its build intermediate before output. This keeps complete offline worlds within the hosting limit without reducing geometric detail.

Verification results live in `tests/driving/`: manual pedals, shortcut hold/cancel/exit, steering-only passing, all 75 rally surface sectors, road/mesh alignment, daylight isolation, solar time, and browser visual checks. Existing performance, track driving, service, preservation, GPS, offline and hosted checks also apply. Final run results are recorded alongside those tests.

Final local validation (11 October 2026): 63 Track 2.0 cars and all 83 routes booted and rendered; 128 garage car/version GPS combinations passed; 12 offline GPS mode checks required no network; both PC/D-pad modes and host track-version synchronization passed. The performance suite passed all 63 variants, the normal garage/multiplayer browser suite passed, and eight shortcut/manual-pedal checks passed. Both steering-only passing scenarios had zero contacts and zero automatic brake demand. All 75 rally surface-sector checks passed. The final Pages directory is 835.2 MB, including the complete offline download.
