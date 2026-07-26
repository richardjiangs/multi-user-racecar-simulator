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

**Copying a file to the microSD card does nothing** — the console has no way to
open it from there. Here are the two routes that actually work, no console
modification, no exploit.

### A. On your actual Switch, in its own browser (touch)

This uses the hidden browser the Switch already ships (the one that appears when
a Wi-Fi network wants a login page). A tiny launcher on your computer makes the
console open it straight onto the game.

On your computer (same Wi-Fi as the Switch):

```
sudo node tools/switch-server.mjs
```

It prints your computer's IP and holds ports 53 (DNS) and 80 (web) — hence
`sudo`. Then, on the Switch:

> System Settings → Internet → Internet Settings → (your Wi-Fi) → **Change
> Settings** → **DNS Settings → Manual** → **Primary DNS = the IP it printed**
> (Secondary DNS `0.0.0.0`) → **Save** → **Connect to This Network.**

The console decides it needs to log in and opens its browser **on the game**.
Turn the Switch sideways (handheld) and drive with the on-screen wheel + pedals.
When you're done, press `Ctrl+C` on the computer and set the Switch's DNS back to
**Automatic**.

What the launcher does — all on your own machine and console, nothing installed
on the Switch:

- answers *only* the Switch's "am I online?" check (`conntest.nintendowifi.net`,
  `ctest.cdn.nintendo.net`) with your computer's IP, and **forwards every other
  DNS query to a real resolver** so the console still works;
- serves the game (the light lazy-loading `index.html`, so the Switch's modest
  browser only pulls one ~300 KB car at a time);
- injects a small **touch→pointer shim** and forces the on-screen wheel + D-pad
  visible, because the Switch reports a desktop-width viewport and its older
  browser may lack Pointer Events. `tests/switch-server-test.mjs` verifies, with
  Pointer Events removed, that dragging the wheel actually steers.

macOS notes: port 53 is normally free (it is *not* held by mDNSResponder); if a
VPN or another DNS tool has it, quit that first. The first run pops a macOS
firewall prompt — click **Allow**. Find your IP by hand any time with
`ipconfig getifaddr en0` (Wi-Fi) — the launcher also prints it.

### B. With your Joy-Cons — on a Mac, phone or tablet

The Switch's own browser will **not** drive the Joy-Cons (it is a login browser,
not a game runtime — only custom firmware could change that, which this project
will not do). So the controllers go on a device that exposes the Gamepad API:

1. **Pair each Joy-Con.** Detach it from the console, then hold its little
   **sync button** — the round button on the flat rail edge, between SL and SR —
   for ~5 s until the four lights run. On the Mac, open **Bluetooth** settings and
   connect **"Joy-Con (L)"** and **"Joy-Con (R)"**. (Keep the Switch asleep so it
   doesn't grab them back.) A **Pro Controller** pairs the same way, from the sync
   button on its top edge.
2. **Open `switch.html` in Chrome** (or the live site, or serve the folder).
3. **One-time setup.** Two Joy-Cons show up as *two separate, non-standard* pads
   on a Mac — macOS does not fuse them into one L+R controller the way the console
   does, and their button numbers are not the standard layout. So `switch.html`
   pops a **calibration wizard** the first time it sees a Joy-Con: it asks you to
   do each action once ("push the LEFT stick right", "press ACCELERATE", …) and
   learns whatever your pads report — using the left Joy-Con for steering and the
   right for the buttons/pointer, or vice-versa, whatever you press. It saves the
   result, so it is a one-time thing. Redo it any time with the **⚙ Remap
   controls** button (top-left).

   A **Pro Controller** or an **Xbox / PlayStation** pad reports the *standard*
   layout and needs no wizard — it just works (`tests/switch-test.mjs`, 14
   checks). The wizard is verified by `tests/switch-joycon-test.mjs`, which learns
   two deliberately scrambled fake Joy-Cons and then drives the car with them.

Everything in one place cannot be had without hacking: Joy-Cons *and* the
Switch's own screen means the Switch's browser reading the controllers, which it
does not do. Route A gives you the Switch screen (touch); route B gives you the
Joy-Cons (on another screen).

### Not covered here

Running this from the SD card would require custom firmware, which means
exploiting the console. That risks a permanent Nintendo Online ban and can
brick the unit, and it is out of scope for this project — no instructions for it
are provided. Shipping an actual Switch title (`.nsp`) requires a licensed
Nintendo developer account through the Nintendo Developer Portal.

## Honest caveats

I could not test on real Switch hardware from here. The parts I *could* verify
in a headless browser are green (DNS interception + web serving in
`tests/switch-server-test.mjs`; and touch steering with Pointer Events removed,
proving the shim). These are the things only the console itself can settle:

- **Reaching the browser (route A).** The captive-portal trick works on every
  retail Switch I know of, but Nintendo tweaks the connection-check between
  firmware versions. If the browser never opens, the launcher intercepts several
  known check domains; tell me the firmware version and I'll add whichever host
  yours uses.
- **The browser's age.** It is a cut-down, older WebKit. The touch shim covers a
  missing Pointer Events API, and the page is the light one-car-at-a-time build,
  but if a car is too heavy the tab may reload — pick a simpler car, or tell me
  and I'll add a "lite" single-car page.
- **Gamepad in the Switch browser (route B is the answer).** That browser almost
  certainly does not expose `navigator.getGamepads`, which is exactly why the
  Joy-Cons go on a Mac/phone instead. On the Mac the mapping is verified
  (`tests/switch-test.mjs`, 14 checks).
- **Face-button positions (route B).** The layer uses the W3C standard mapping by
  physical position (bottom / right / left / top), which on a Nintendo pad is
  B / A / Y / X. If a driver reports them swapped, A/B (and X/Y) are exchanged.
