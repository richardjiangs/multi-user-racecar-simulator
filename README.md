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
- `* simulator 2.0.html` - 56 separate upgraded versions; keep `assets/tracks-2/pack.js` alongside them when copying the folder.
- `assets/tracks-2/pack.js` - all eight prebuilt shared circuit meshes, compressed once and fully unpacked before driving. Track geometry uses OpenStreetMap/TUM data; elevations and scenery remain modeled approximations.

Track 2.0 retains each car’s original brand circuit. DB5, F12tdf, Phantom, Spectre and all four Dakar cars stay on Track 1.0. The host sets the online room’s track version; cars without Track 2.0 join Track 1.0 rooms.

To regenerate Track 2.0 after editing its source:

```sh
node tools/build-track2-world.mjs
node tools/pack-tracks2.mjs /tmp/track2-world
python3 tools/build-track2.py
node tools/embed-sims.mjs
node tests/perf-test.mjs
TRACK_VERSION=2 node tests/perf-test.mjs
node tests/track2/geometry.mjs
python3 tests/track2/preservation.py
```

The browser tests in `tests/track2/` use a local server on port 8765. `CODEX_NODE_MODULES` and `CHROMIUM_PATH` can point to an installed Playwright runtime and Chromium executable.
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
