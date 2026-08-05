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

---

## Paris and Porto Corsa — the two Cars 2 locations that were missing

Researched, not remembered. Sources: the Pixar Cars wiki pages for
[Tomber](https://pixarcars.fandom.com/wiki/Tomber), the
[Marché Aux Pièces](https://pixarcars.fandom.com/wiki/March%C3%A9_Aux_Pi%C3%A8ces),
[Porto Corsa](https://pixarcars.fandom.com/wiki/Porto_Corsa) and the
[Porto Corsa Grand Prix](https://pixarcars.fandom.com/wiki/Porto_Corsa_Grand_Prix).

### Paris — `Mission — Paris, the parts market`, 5 stages

The **Marché aux Pièces** is a parts market spread over several streets inside one
iron-and-glass shed drawn from the **Gare du Nord**. **Tomber** is a rusted three-wheeled
**Citroën 2CV** who deals in salvaged parts; his plate is **PCS NO1R** — *pièces noires*. He
is Finn's informant, which Holley does not know.

What happens, in order: they drive into Paris at night; Tomber catches **Finn's reflection in
a mirror** and bolts; there is a chase through the stalls in which he **brings a stack of
boxes down** behind him; **Holley corners him and tasers him** before Finn can stop her. Then
the photograph — a **Rover V8**, which Tomber calls *"the worst motor ever made"* — except
that he is not looking at the engine. He is looking at the **boxes of rare parts stacked
beside it**, which he sold, by telephone, to a car he has never seen. He names the lemon
families — **Gremlins, Pacers, Hugos, Trunkovs** — and tells them the bosses are meeting at
**Porto Corsa**, and that the kingpin will be there, because he has just shipped him parts.

| stage | you are driving on | what has to happen | how you lose it |
|---|---|---|---|
| `boulevard` | wet Paris pavé, Haussmann stone, a Guimard Métro arch, the tower lit | — | — |
| `quay` | the Seine on your left, bouquiniste boxes shut on the parapet | — | — |
| `market` | the train shed: riveted arches, glazing, engines on chains | **tracker scope (8)** finds him — and he sees you in the mirror | 80 s and he is out the far end |
| `stalls` | aisles racked to the roof, his stock coming down across them | stay inside 150 m of him | he gets away |
| `corner` | a dead end | **stop**, camera up (**P**), and frame *the boxes*, not the engine | 75 s |

The camera beat is the film's beat: framing the Rover V8 gets you *"the worst motor ever
made"*; framing what is stacked beside it gets you the case.

### Porto Corsa — `Mission — Porto Corsa, the casino`, 8 stages

An Italian Riviera town built on **Monaco** with Portofino in it: hilly, arched bridges, a
marina full of boats, and a **casino on a rock shaped like a 1948 Fiat 500 Topolino**. The
circuit leaves the port, climbs the coast road, drops, crosses the **Casino Bridge** and comes
back to the port; the hairpin is **Loews**.

**Ivan** — a Russian tow truck who works for **Victor Hugo** — is put out so you can take his
place and tow Victor Hugo into the casino. In the back room the **kingpin speaks through a
screen**: the plan is to make the world turn its back on **Allinol** by making it look as
though it is destroying the racers, and they pick **Lightning McQueen** to kill. The disguise
comes off, the room draws, and outside **Grem and Acer are working the electromagnetic pulse
camera** on the Allinol runners. McQueen wins it, from Francesco.

| stage | you are driving on | what has to happen | how you lose it |
|---|---|---|---|
| `coast` | the Ligurian coast road, sea below, terraced houses above | — | — |
| `ivan` | the quayside: cobbles, bollards, nets, boats | put **Ivan** out — guns (**2**) or slashers (**4**) | 85 s and he reaches the forecourt |
| `valet` | the casino carpet, and a great many photographers | **Victor Hugo on the hook (G)** | 90 s |
| `floor` | patterned carpet, gaming tables, chandeliers, gilt | **revolve the plates (1)** — not on BMT 216A | 75 s, or a doorman reads the number |
| `meeting` | the back room: one long table, the bosses down it | **three exposures (P)** — the table, the professor, the screen | 100 s |
| `blown` | the same floor, and everyone in it armed | **two of them down** | 110 s |
| `race` | the Riviera circuit, in daylight, with a crowd | run it — the pulse camera picks runners off around you | — |
| `getaway` | the old town above the port | **smoke (6)** | they box you in |

The camera has **per-stage subjects** (`STAGE_SUBJECTS`): three under the deck in the Pacific,
three in the back room, one in the photograph in Paris. That indirection is also where a real
fault lived — see below.

### Two faults the tests found, and the tests that now hold them

**`subjectsFor` was defined in the physics block and used in the render block.** The sim's
module is a run of sibling `{ }` blocks — physics in one, rendering in the next — and neither
can see the other's consts, which is why `onSea`/`onStage` are already declared twice. The
mission logic was perfect and the *picture* threw `ReferenceError` the moment the viewfinder
was painted. The logic now lives at module scope (`subjectsIn`/`subjectAtIn`) with a one-line
binding per block, and **`all 46 stages render, viewfinder and all`** paints every stage of
every mission with the camera up.

**Eleven start cards named the wrong maker.** The clone audit read the ignition prompt, the
toasts, the wheel hub and the 101 course — but not the `<div class="ring">` maker line, which
is the first thing anybody sees. The DB5 and the 300 SLR said *"Ferrari · Maranello"*, the
Yangwang U9 was built in Croatia, and six cars cloned from the Supra — a 1993 McLaren among
them — said *"Toyota Gazoo Racing"*, which post-dates that car by fourteen years. All eleven
now name the plant that built them, the audit reads the start card, and
**`all 47 start cards name the maker that built the car`** asserts the positive form.
