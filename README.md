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

The guide covers racing line, braking references, apex choice, overtaking, defending, pit strategy, race starts, track-specific notes, and online etiquette.

## Project Files

- `index.html` - the published single-file simulator shell with embedded car simulators.
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
