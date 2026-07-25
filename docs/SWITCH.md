# Nintendo Switch edition (`switch.html`)

`switch.html` is the whole garage — all 36 cars — as **one self-contained file**
with a Joy-Con / Pro Controller layer added. Nothing is cut: same cars, same
physics, same circuits, same modes.

> ### Read this first: it is a web page, not a Switch game
>
> **The Switch cannot run an HTML file from the microSD card.** Retail games are
> signed, encrypted `.nsp` / `.xci`; homebrew is `.nro`. There is no supported
> way to put a file on the card and have the console launch it. Doing that needs
> custom firmware, which means exploiting the console — that risks a permanent
> Nintendo Online ban and can brick the unit. **This project does not help with
> that, and these docs do not describe it.**
>
> What *is* supported: the Switch has a real WebKit browser (the hidden one used
> for Wi-Fi captive-portal logins). It renders ordinary HTML, so you can point it
> at this page over your network — no modification to the console. See
> "Playing it" below.
>
> If you just want the controller experience with no caveats, the most reliable
> option by far is to pair a **Pro Controller or Joy-Con over Bluetooth to a PC,
> phone or tablet** and open the page there. The pads report as a standard
> gamepad, which is exactly what this layer is built and tested against.

Build it with:

```
node tools/embed-sims.mjs        # regenerates index-offline.html
node tools/build-switch.mjs      # -> switch.html
node tests/switch-test.mjs       # verifies the whole control mapping
```

`build-switch.mjs` derives `switch.html` from `index-offline.html`, so it never
drifts from the real game. The car code is **not** modified — the layer only
writes the analog inputs the touch wheel and pedals already use
(`state.padThrottle`, `state.padBrake`, `state.touchSteer`) and clicks the
existing on-screen buttons.

## Controls

| Input | Action |
|---|---|
| **Left stick** | Steer (analog — small movements = small corrections) |
| **ZR** | Accelerate (analog — the harder you pull, the more throttle) |
| **ZL** | Brake (analog). Keep holding once stopped → **reverse**; a dab of ZR takes drive again |
| **Right stick** | Move the on-screen pointer |
| **A** | Click whatever the pointer is over / continue |
| **B** | Back to the garage |
| **X** | Horn (hold) |
| **Y** | The car's speed feature — Speed Key, Track Package, Velocity mode, E85, DRS, and ERS Override on the F1 cars |
| **L / R** | Gear down / up (the cars shift automatically, so this is optional) |
| **+** | Show / hide the control cheat-sheet (it fades out on its own) |

The pointer works over the garage **and** inside a running car, so every button
in the sim — Circuit, Learning, Real Mode, pit menu — is reachable with the
right stick and A.

If no controller is detected the panel says so; press any button to wake it.
The Switch is also a touchscreen in handheld mode, and the game's touch wheel
and pedals work there too, so you have both.

## Playing it

**Copying it to the microSD card does nothing** — the console has no way to open
it from there. Use one of these instead.

**1. Pro Controller / Joy-Con on a PC, phone or tablet (recommended).**
Pair the pad over Bluetooth and open `switch.html` (or the normal site) in any
modern browser. The pads report as a standard gamepad, which is what this layer
targets and what `tests/switch-test.mjs` verifies — so the full mapping works,
with no caveats and nothing done to your console.

**2. On the Switch itself, through its own browser.**
Serve the file from a computer on the same Wi-Fi:

```
python3 -m http.server 8080
```

then reach the console's built-in browser — it is the one that appears when a
Wi-Fi network shows a captive-portal login — and open
`http://<your-computer-ip>:8080/switch.html`. Nothing is installed and nothing
is modified; you are using a feature the console already ships. Note the browser
is a cut-down WebKit build, so treat gamepad support as unproven (see below);
the touchscreen works in handheld mode either way.

Because the file is fully self-contained, only that one URL is ever fetched.

### Not covered here

Running this from the SD card would require custom firmware, which means
exploiting the console. That risks a permanent Nintendo Online ban and can
brick the unit, and it is out of scope for this project — no instructions for it
are provided. Shipping an actual Switch title (`.nsp`) requires a licensed
Nintendo developer account through the Nintendo Developer Portal.

## Honest caveats

I could not test this on real Switch hardware from here, so these are the parts
to check on the console itself:

- **Gamepad API support.** The mapping is verified against a simulated Switch
  Pro Controller in the standard mapping (`tests/switch-test.mjs`, 14 checks),
  but Nintendo's browser is a limited WebKit build and may not expose
  `navigator.getGamepads`. If it doesn't, the cheat-sheet will keep saying "no
  controller" — the touchscreen and the browser's own cursor still work, so the
  game remains playable.
- **Memory.** The file is ~12 MB because every car is embedded. The Switch
  browser has a modest memory budget; if it struggles, serve the ordinary
  `index.html` instead, which loads one ~300 KB car at a time.
- **Face-button positions.** The layer uses the W3C standard mapping by physical
  position (bottom / right / left / top), which on a Nintendo pad is B / A / Y /
  X. If a driver reports them swapped, A and B (and X and Y) will be exchanged.
