# Multi User Racecar Simulator

A browser-based garage of six hypercar simulators with private practice, AI rival grids, and online rooms for real racers.

Live site: https://richardjiangs.github.io/multi-user-racecar-simulator/

## Quick Start

1. Open the live site.
2. Choose a car from the garage.
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

Each simulator also includes on-screen controls for mobile and trackpad users.

## Online Racing

- **Host Room** creates a shareable room code.
- **Join Room** connects to an existing host by room code.
- The host controls the shared track and the race start sequence.
- Online mode shows connected human racers only; private practice keeps the AI rival grid.

## Race Car 101

Need a driving guide? Open **Race Car 101** from the garage or visit:

https://richardjiangs.github.io/multi-user-racecar-simulator/race-car-101.html

The guide covers first launch, braking, cornering, track choice, online race flow, and common troubleshooting.

## Project Files

- `index.html` - the published single-file simulator shell with embedded car simulators.
- `race-car-101.html` - the driving guide page.
- `vendor/` - local fallback libraries used by the online mode.
- `tests/` - browser and performance smoke tests.

## Support Button

To add a "Buy me a coffee" button, create an account on a donation platform such as Buy Me a Coffee, Ko-fi, or GitHub Sponsors, then add the public donation link to `README.md` and optionally to the website header.

Example Markdown:

```md
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-support-yellow)](https://www.buymeacoffee.com/YOUR_NAME)
```

Replace `YOUR_NAME` with your real donation page name.
