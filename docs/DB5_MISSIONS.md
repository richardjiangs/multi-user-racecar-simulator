# Aston Martin DB5 — mission design

Two missions ship in the Circuit tab. One is built and correct; one is still a road with
renamed corners and is flagged below.

| mission | route key | status |
|---|---|---|
| Cars 2, the opening | `Mission — Oil Platform, Pacific` | **built** — ten stages, ten surfaces |
| Goldfinger, 1964 | `Mission — Furka Pass, 1964` | **still generic** — see the bottom of this file |

---

## Cars 2 — the cold open

### What actually happens

Two sources: the user, who described the sequence beat by beat after I got it wrong twice,
and the Pixar Cars / Disney wikis and the film transcript, which agree with them and add the
names. Where the two differ it is only in vocabulary — the user says "tug" and "tanker" for
what the film calls **Crabby** (a crab boat) and **Tony Trihull** (a combat ship).

1. The Pacific at night. Finn McMissile is aboard the crab boat **Crabby**, at the
   coordinates Agent Leland Turbo sent before he went dark.
2. **Tony Trihull** comes out of the shadows, puts his lights and his gun on Crabby and
   orders him away. Crabby turns for home.
3. Finn is no longer aboard. He is **on Tony's transom, held there on his harpoons**.
4. Tony carries him to the platform. Finn **puts one hook over a barrier on the rig,
   releases the other from Tony**, switches his wheels to **steel magnets** and drives **up
   one of the legs**.
5. Under the deck he hangs and watches: **Professor Zündapp** opens a box; **Grem** and
   **Acer** open a crate with the cubed remains of **Leland Turbo** inside it. He
   **photographs** it — and is **seen**.
6. The chase across the platform. **Oil down, a round through it**, rockets, a **span
   dropped behind him**, the **helipad**, and off the edge.
7. **Hydrofoils out**, planing away, **Tony astern and firing**.
8. A **torpedo**. He leaves **four tyres floating** and a burning wreck, so that everyone
   watching is certain they killed him, then puts out fins and screws and **goes under**.

Tony Trihull is drawn from what he is: an **Independence-class littoral combat ship** —
127.4 m, 31.6 m across the amas, aluminium trimaran, 44 knots, hull number **02**, a 57 mm
Mk 110 forward and a flight deck aft. He is drawn at those dimensions, not eyeballed.

### How it is built

`SEA_STAGES` (module scope, so both the physics block and the render block can see it) is
ten stages on an 11.6 km spine. The spine exists only so the integrator has something to run
along — it is **not a circuit**, it has no laps, no kerbs, no racing line and no start/finish
line, and `drawRoad` returns early on `pal.env === "sea"` before any of that is drawn.

| stage | surface drawn | gate | failure |
|---|---|---|---|
| `crabby` | timber deck, bulwarks, crab pots, Tony's light sweeping | harpoon (**G**) | 34 s, then he fires on Crabby |
| `ride` | non-skid flight deck, landing circles, both amas, the 57 mm | harpoon (**G**) | carried past the platform |
| `climb` | braced leg face, sea dropping away, the deck lip coming down | magnets (**M**) | slide off the leg |
| `lip` | underside of the main deck: girders overhead, sea 100 m below | 3 photographs (**P**) | magnets off, or 70 s |
| `chase` | open grating you can see the sea through, modules, floods | oil (**5**) + fire (**2**) | run down |
| `bridge` | a through truss, portal frames overhead, nothing either side | limpet (**K**) | on the span when it goes |
| `helipad` | the pad, the circle, the H, the deck edge | hydrofoils (**F**) | into the water with wheels down |
| `water` | open sea, swell, foil spray, Tony astern with a bow wave | — | his guns |
| `dead` | same, torpedo running, four tyres floating | eject tyres (**J**) | the torpedo finds a car |
| `sub` | submerged: light shafts, particulate rising, sonar | dive (**J**) | — |

A gate is not a suggestion. If the stage's job is not done, `stageStep` clamps
`state.distanceM` at `stage.to - 40` and takes your speed away — you physically cannot leave.

**Enemies arrive per stage** (`SEA_ENEMIES`), not at seed: nobody is chasing you while you
are still on a crab boat. Grem and Acer and two more lemons come aboard at `chase`, two more
at `bridge`.

### Finn's kit

All of it is gated on `onSea()`, so `tests/perf-test.mjs` never sees any of it and the DB5's
certified 7.1 s and 233 km/h are untouched.

| key | kit | what it really does | the sound |
|---|---|---|---|
| **G** | quad harpoon | crosses you to Tony, then to the rig | gas launch, then a wire paying out and slowing |
| **M** | steel magnet wheels | the only thing holding you on the leg and under the deck | contactor closing, then a 100 Hz field with harmonics |
| **P** | spy camera | viewfinder; pan with A/D, shutter on P, three exposures | leaf shutter twice, then the film wind |
| **B** | tail rockets | +8.2 kN | broadband roar opening from 300 Hz to 2.6 kHz |
| **K** | limpet charge | drops the span, and anything on it | a beep train getting faster, then the blast |
| **F** | hydrofoils | required before the deck edge; changes the water drag | servo, then the hull coming out of the water |
| **J** | tyres / dive | the fake death, then the submarine | the eject charge; then tanks flooding, then sonar |

### The mirror

`q.slicks` and `q.puffs` are laid at `state.distanceM - n` — **behind** the car — and the
draw code called `projectAhead(-rel)`, a *positive* distance, so everything you dropped was
painted **in front of you** and receded up the road you were driving into. The physics was
always right (rivals behind really did drive through it); only the picture lied, and it lied
in every sim in the garage for as long as the gadget has existed.

There is no rear window in this view, so it now goes where a driver actually looks: an
interior mirror at the top of the windscreen, showing the road behind, the oil, the smoke,
the fire, the armed limpet and the cars following you — lane mirrored left-for-right, and
distance behind mapped to height in the glass. `tests/browser-test.mjs` fails on any
`projectAhead(-rel` anywhere in the repo.

---

## Goldfinger, 1964 — still generic

`Mission — Furka Pass, 1964` is a real road (the Furka Pass above Andermatt, where the July
1964 chase was shot) with real cars on it (the Phantom III **AU 1**, Tilly Masterson's
Mustang, Auric Enterprises guards) and the roles work — but it is still fundamentally a
drive with a counter, not a sequence of set pieces the way the Pacific stage now is.

It needs the same treatment: the actual beats, in order, each with its own surface, its own
gate and its own failure. That research is mine to do — the user has not read the books and
should not be asked to supply it.

## Rule

Build from sources, not from a summary. Both times this went wrong it was because I wrote
from a recollection of a plot rather than checking it, and each pass cost a release.
