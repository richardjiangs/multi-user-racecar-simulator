# In-car GPS navigation

The garage adds a read-only GPS to modern cars, in both Track 1.0 and Track 2.0.
Use the **GPS** selector next to the Driving/Exterior/Circuit tabs. The default is
Dashboard. Options are Off, Rear-view mirror, AR on the road, Dashboard, and Track outline.

**Track outline is available on every garage car**, including historical cars and all
eleven F1 teams, with either track version. It draws a grey route and live car markers
on a transparent background. It has no title, scale bar, preset buttons or zoom buttons.
Scroll/pinch to zoom and click/tap to switch whole-route and road-position presets.
Historical/F1 cars offer Off and Track outline; their default is Track outline.

Click/tap the map or its preset button to reset between **1 Whole route** and
**2 Road position**. Plus/minus, mouse wheel and two-finger pinch zoom within either
preset. Preset 2 follows the car at a scale that resolves the physical road width.
Blue is the player, coloured cars are rivals/traffic, and small edge markers locate
cars outside the current view. All active cars are included, including online rivals.
The scale bar is in metres/kilometres; the map keeps a fixed orientation through turns.

The mirror display uses the upper centre mirror area, with 22% on the right retaining
a live rear view. It does not replace either side mirror/camera. The original rear
renderer draws that view; the Phantom uses a live road/traffic projection because
its original centre mirror was decorative. Track 2.0 AR chevrons are submitted to
the world depth buffer, so cars, hills and buildings occlude them. Legacy AR uses
the original road projector. AR also retains a small HUD map for the whole route.

## Coordinates and map context

Track 2.0 reads the shared track model, full metric width profiles, pit geometry,
contact poses and rival pit progress. The GPS never changes physics, rivals, controls,
audio, road geometry or vehicle performance. Track 1.0 traces its actual legacy
curvature instead of showing a geographically unrelated newer route. Free driving
uses a rolling 6 km map window; the Phantom's London map uses its road network.

Mapped streets, building footprints, green areas and water are included where the
existing route has geographic registration. The map background database is in
`assets/gps/context.json`, adapted from © OpenStreetMap contributors under ODbL 1.0.
The map displays attribution linking to https://www.openstreetmap.org/copyright.
The database and license are downloadable separately; no Google Maps tiles are used.
Monaco uses the already-reviewed start datum and scale, without changing the track.
Where geographic context is unavailable, GPS shows the simulated road, pit pavement,
known buildings and route labels. Reconstructed Dakar stages retain their existing
approximation; GPS does not turn them into a surveyed real-world roadbook.

## Scope and implementation

The eleven 2026 F1s are excluded from the three full GPS displays, but have Track outline.
The same applies to these historical cars: 250 GTO, F40, 917K, DB5,
300 SLR, McLaren F1 (1993), Supra Mk4, RX-7, S2000 and Lancer Evo X. The final four
are the conservative historical grouping pending the user's optional clarification.
The modern Alfa Romeo 33 Stradale and Ferrari F12tdf are eligible.

`tools/gps/navigation.js` is the maintained source. `tools/embed-sims.mjs` embeds it
in both garages and stamps the GPS source and map context into the build hash.
The online garage fetches the selected simulator and exposes its renderer
helpers in the loaded copy; the original 64 files and 63 Track 2.0 files stay intact.
The offline garage embeds the complete map context, so GPS requires no network.

Validation: `tests/gps/navigation.mjs`, `tests/gps/offline.mjs`, the normal garage
browser tests, and `tests/track2/preservation.py`. Screenshots are reviewed at desktop,
short landscape and portrait sizes. No performance model changes are part of GPS.

## Follow-up driving and scenery release

Implemented after the GPS release; see [DRIVING_SCENERY_UPDATE.md](DRIVING_SCENERY_UPDATE.md) for sources, model limits and validation.

- Dakar surface response, detailed scenery, and researched sandstorm/rain/night
  occurrence and appearance; night restricted to Dakar.
- Detailed non-F1 rival cars; retain F1 rival artwork.
- Referenced DB5 unique-route scenery and a genuine 3D F12 museum environment.
- Steering-only assist, racing/apex lines and steering collision avoidance.
- Full-screen touchpad entry only after holding T + Space for one second.
