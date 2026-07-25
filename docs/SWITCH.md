# Nintendo Switch edition (`switch.html`)

`switch.html` is the whole garage — all 36 cars — as **one self-contained file**
with a Joy-Con / Pro Controller layer added. Nothing is cut: same cars, same
physics, same circuits, same modes. Copy the single file onto your microSD
("TF") card and play it.

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

## Getting it onto the console

The Switch's browser cannot open files from the SD card on stock firmware —
that needs homebrew. Two routes, most reliable first:

**1. Serve it from a PC on the same Wi-Fi (works on any Switch).**
Put `switch.html` in a folder on your computer and run a tiny web server in it:

```
python3 -m http.server 8080
```

Then open the Switch's browser and go to `http://<your-computer-ip>:8080/switch.html`.
(The hidden browser is normally reached through the Wi-Fi captive-portal login
screen.) Nothing is installed on the console.

**2. From the SD card via homebrew (Atmosphère / hbmenu).**
Copy `switch.html` to the card, e.g. `sd:/switch/racecar/switch.html`, and open
it with a homebrew browser or the offline web applet. Because the file is fully
self-contained — every car embedded inline, zero network requests — it does not
need any other file next to it.

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
  browser has a modest memory budget; if it struggles, use route 1 above with
  the ordinary `index.html`, which loads one ~300 KB car at a time.
- **Face-button positions.** The layer uses the W3C standard mapping by physical
  position (bottom / right / left / top), which on a Nintendo pad is B / A / Y /
  X. If a driver reports them swapped, A and B (and X and Y) will be exchanged.
