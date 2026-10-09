# Multi User Racecar Simulator

A browser-based garage of 64 car simulators with private practice, AI rival grids, and online rooms for real racers.

Live site: https://richardjiangs.github.io/multi-user-racecar-simulator/

## Quick Start

1. Open the live site.
2. Choose Track 1.0 or Track 2.0 and PC or D-pad in the homepage settings, then choose a car.
3. Select **Private Practice** for solo driving with AI rivals, or **Online Race** to host or join a room.
4. In online mode, the host chooses the track and starts the race for everyone.

## Controls

| Action | Keyboard |
| --- | --- |
| Throttle | `W` or `Arrow Up` |
| Brake | `Space` or `Arrow Down` |
| Steer | `A` / `D` or arrow keys |
| Gear neutral | `N` |
| Reverse | `R` |
| Paddle up/down | `E` / `Q` |
| Horn | `H` |

D-pad mode shows throttle, brake, left and right buttons in either orientation and retains the existing steering wheel. PC mode hides the touch controls. The homepage remembers your choices.

## Online Racing

- **Host Room** creates a shareable room code.
- **Join Room** connects to an existing host by room code.
- The host controls the shared track and the race start sequence.
- Online mode shows connected human racers only; private practice keeps the AI rival grid.

## Race Car 101

Need a driving guide? Open **Race Car 101** from the garage or visit:

https://richardjiangs.github.io/multi-user-racecar-simulator/race-car-101.html

The guide covers racing line, braking references, apex choice, overtaking, defending, pit strategy, race starts, track-specific corner tables, and visual PNG/MP4 lessons.

## Project Files

- `index.html` - the hosted garage, loading the selected simulator on demand.
- `index-offline.html` - both simulator versions and the complete Track 2.0 world data embedded in one file.
- `* simulator.html` - the 64 original Track 1.0 files, preserved unchanged.
- `* simulator 2.0.html` - 63 separate upgraded versions; keep the complete `assets/tracks-2/` directory alongside them when copying the folder.
- `assets/tracks-2/pack.js` - the route catalog and loader. Hashed mesh files contain 83 complete routes; the selected route is unpacked before driving, never generated section by section.

Track 2.0 now includes shared and brand circuits, the DB5 missions, the F12tdf museum and all four Dakar cars. Spectre uses upgraded shared circuits while its city journeys remain original; Phantom stays original. All 64 Track 1.0 HTML files are retained. The host sets the online room’s track version.

The other ten F1 cars have separate hand-authored wheel, cockpit, exterior and power-unit illustrations, with working controls and live displays. Their existing performance, sounds and keyboard controls are preserved.

See [route sources and accuracy](docs/TRACK2_SOURCES.md). Geographic centerlines are mapped; elevation, scenery and proprietary details remain approximations. Dakar stages retain published distances and terrain sequences, but are authored reconstructions without a GPS roadbook. DB5 film sets and the museum are fictional drives.

To regenerate Track 2.0 after editing its source:

```sh
node tools/build-track2-world.mjs
node tools/pack-tracks2.mjs /tmp/track2-world
python3 tools/build-track2.py
node --max-old-space-size=8192 tools/embed-sims.mjs
node tests/perf-test.mjs
TRACK_VERSION=2 node tests/perf-test.mjs
node tests/track2/geometry.mjs
python3 tests/track2/preservation.py
```

The browser tests in `tests/track2/` use a local server on port 8000. `CODEX_NODE_MODULES` and `CHROMIUM_PATH` can point to an installed Playwright runtime and Chromium executable.
- `race-car-101.html` - the driving guide page.
- `vendor/` - local fallback libraries used by the online mode.
- `tests/` - browser and performance smoke tests.

## Support With Bitcoin

No Buy Me a Coffee account is needed. You can support the simulator directly with Bitcoin:

```text
1G3owA2kPUuYS45XGyj8p8M3kgdHQzePBs
```

![Bitcoin QR code](assets/bitcoin-qr.png)

Please double-check the address before sending. Bitcoin transactions cannot be reversed.

### Publishing the large offline edition

GitHub Actions builds and publishes `index-offline.html` from the committed source. `sims-embedded.js` remains the generated local-folder fallback; the hosted site omits this duplicate of the entire offline data to stay within the Pages size limit. These generated files exceed GitHub’s individual Git-file limit, so they are not tracked. Run `node tools/build-pages.mjs` after embedding to check the complete deployment size. Publishing still requires pushing the intended release to `main`; `.github/workflows/pages.yml` deploys through GitHub Pages.
