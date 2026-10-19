# Tesla Plaid, Supra A80 and offline editions — October 2026

The side-profile art source is `tools/vehicle-refinements/profile-art.js`; Supra
cabin/engine and live dashboard artwork is in `tools/vehicle-refinements/road-art.js`. The garage applies it to
Track 1.0 copies; `tools/build-track2.py` applies it to the two generated Track 2.0
files. All 64 archived originals stay byte-identical.

Both exterior drawings are true left-side elevations with equal circular wheels,
aligned axles, separately authored curved bodywork and panel detailing.

Tesla changes are confined to the exterior SVG: four-door liftback silhouette,
panoramic roof, flush handles, window pillars, mirrors, lamp elements, lower nose
inlets, carbon rear lip, brake discs/calipers and independently rotating Arachnid
wheel spokes. The existing cabin, dashboard, engine illustration, vehicle model,
sound and controls are retained. The open-door and body-lift element references
are rebound to the replacement drawing.

The Supra represents the early export A80 Turbo, with its curved projector-lamp
nose, factory hoop spoiler and five-spoke wheels. The RHD cabin uses the three
instrument pods, circular three-vane vents, curved driver-facing console, cassette
head-unit and early four-spoke airbag wheel. Both the driving dashboard and cabin
overview read the same speed, RPM, temperature and steering state. The driving
fascia remains low; existing 1.0 controls are retained. The engine drawing shows
the longitudinal 2JZ-GTE, six intake runners, alloy cam covers, plug-well spine,
two sequential turbos on the exhaust side, ancillary plumbing and radiator.
All five map modes are enabled for Supra by the user's explicit request.

Primary visual references:

- [Toyota UK: 1993–1996 Supra archive](https://media.toyota.co.uk/vehicles/supra-archive-1993/)
- [Toyota UK: factory A80 interior photographs](https://media.toyota.co.uk/images/supra-interior-1993-1996/)
- [Mecum: unmodified 1993 Supra side profile](https://www.mecum.com/lots/545880/1993-toyota-supra/)
- [AutoHunter: 2021 Model S Plaid side profile](https://autohunter.com/Listing/Details/57546674/2021-TESLA-MODEL-S-PLAID-AWD)
- [Toyota: 1993 model launch](https://global.toyota/en/detail/7868203)
- [Tesla Model S exterior reference](https://www.tesla.com/ownersmanual/models/en_us/GUID-6C6C3944-9674-4E81-A0E8-94D60B6D87B9.html)
- [Tesla Palladium wheel reference](https://service.tesla.com/docs/ModelS/ServiceManual/Palladium/en-au/air/GUID-769C9625-76EE-467B-B756-C9032AC2B99A.html)

## Porsche 919 Boost

The 919 previously depleted its physical battery and per-lap hybrid allowance with
Real Mode off, leaving Boost selected while the MGU no longer delivered power.
The transformed Track 1.0 copy and generated Track 2.0 now supply the requested
MGU output continuously when Real Mode is off. Demand still follows throttle,
braking, sailing, pit/FCY limiters, ignition and hybrid mode. Real Mode retains
the original battery/lap limits. `tests/refinements/porsche919-boost.mjs` exercises
150-second full-throttle runs starting with exhausted energy and lap allowance,
checks stable 334.9 km/h and 294 kW after acceleration in both track versions, and
checks the Real Mode energy limits plus brake/pit/sail gates.

## Offline storage

`tools/offline/snapshot-exteriors.mjs` captures the actual simulator exterior SVGs.
Phantom retains its owner's CSS coachwork inside an SVG foreignObject, with
computed styling preserved. Nothing is traced or rasterised. The checked-in
`exteriors.json` snapshot allows CI to build without installing a browser; original
source hashes reject stale snapshots when source HTML changes. Tesla/Supra also
verify the side-profile generator hash. Refresh the
snapshots after modifying exterior art.

`tools/offline/build.mjs` replaces only the offline garage images. The online
garage keeps its existing photos. It builds the ten requested LITE car entries,
both track versions, and all the Track 2.0 routes those cars can select. The
McLaren F1 entry is the 1993 road car; the Formula 1 entry is Mercedes.

The full edition is approximately **13.0 MB**, and the ten-car LITE edition is
approximately **8.0 MB** (decimal file sizes), both below the 20 MB target.

The small offline format uses two lossless dictionaries:

1. All simulator source lines are stored once and referenced by line number. Each
   of the 127 source files must reconstruct byte-for-byte; LITE contains its 20.
2. Existing track construction code plus its exact inputs replaces millions of
   expanded vertex records. `verify-recipes.mjs` compares EVERY route against the
   published mesh: vertex count, all position/color/material bytes, draw order and
   spatial batches. The source/input fingerprint binds `recipe-proof.json` to that
   verification, and a changed recipe cannot silently build without a fresh audit.

A dedicated browser worker expands the complete selected route BEFORE driving.
It verifies SHA-256 hashes of the complete mesh and batches before exposing them
at all. No road or scenery is created in response to the car's position. Physics,
route dimensions, scenery, map context and all authored detail remain unchanged.
The archive includes original spatial bounds and a sparse set of exact coordinate
word corrections for arithmetic differences between JavaScript engines. They are a
no-op when a browser already produces the original bits; final SHA-256 checks
still require an exact match. `verify-browser-recipes.mjs` checks all routes in
Chrome, Safari's WebKit and Firefox and binds the correction table to the same source fingerprint.

Preparation can take several seconds for a long Dakar stage; the interface stays
responsive and shows progress. Two completed route buffers are cached, matching
previous memory behaviour. Private recipe inputs remain separate from live
physics/map caches.

Homepage SVG markup is also stored in the compressed archive, then displayed
through local Blob URLs at its original vector quality.

The combined dictionary is compressed with Brotli quality 11 and a 16 MiB window.
Every build verifies decompression equality. The pinned, embedded `brotli-dec-wasm`
2.3.2 decoder needs no network access; its MIT/Apache licenses accompany the source.
PeerJS and Trystero are also embedded; online racing still needs a connection.

Build:

```
python3 tools/build-track2.py
# After any world geometry source/input change:
node --max-old-space-size=8192 tools/offline/verify-recipes.mjs
node --max-old-space-size=8192 tools/offline/verify-browser-recipes.mjs
node --max-old-space-size=8192 tools/embed-sims.mjs
node tools/build-pages.mjs
```

After an exterior change, refresh `exteriors.json` against the local garage before
the final embed. Both generated offline HTML files remain outside Git; CI publishes
them alongside the normal website. LITE is named exactly `index-offline LITE.html`.

Verification: `tests/refinements/tesla-supra.mjs`,
`tests/refinements/offline-editions.mjs` (including <20 MB size, all source hashes,
complete mesh integrity, main-thread responsiveness and no network),
`tests/refinements/offline-portability.mjs` (Chrome, WebKit and Firefox loading from disk), `tests/gps/offline.mjs`,
`tests/track2/preservation.py`, and the existing performance/browser suites.
