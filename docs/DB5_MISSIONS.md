# Aston Martin DB5 — mission design

The first pass shipped two "missions" that were a road with renamed corners and five
counters. No ships, no rig, no vessels of any size — the user's verdict, fairly, was
"are docks cars???". This document is the researched design for the real thing, so the
build is against a spec instead of an improvisation.

## What is wrong with the current build

- **The stages are just tracks.** `Mission — Docks & Rig` is a `CIRCUITS` entry with corner
  names like "Tanker deck". Nothing is drawn. There is no tanker.
- **There is no world geometry.** The renderer draws road, kerbs, barriers and rival
  sprites. A ship, a rig leg, a patrol boat and open water are all new object classes.
- **Only one mission per source.** Cars 2 has the oil-rig cold open *and* Tokyo, Porto
  Corsa and London. Goldfinger's DB5 has the Furka Pass tail *and* the factory. Each
  source needs a campaign, not a single stage.

## Source 1 — Cars 2, the oil-rig cold open (researched)

Opens on the Pacific at night, **40° 6.80′ N, 172° 23.84′ W**. Beats, in order:

1. **Approach by sea.** Finn McMissile is carried out by a small boat, **Crabby**. The
   field is guarded by **combat ships** that keep the platforms secret (satellite images
   are scrambled). The combat ships turn on Crabby — the small boat is attacked.
2. **Grapple and climb.** Finn fires a **grappling hook** over a barrier on the platform,
   releases the second hook, switches on **magnetic wheels** and drives **up one of the
   platform's legs**, vertically.
3. **The photograph.** On the deck he watches **Professor Zündapp** open a case containing
   what looks like an ordinary **television camera** — the device the lemons use to
   sabotage racers. Finn photographs it.
4. **The escape.** Cornered on the topmost platform, he reverses off the edge, falls
   roughly **100 feet** into the sea, then deploys **water skis and rocket boosters** and
   leaves across the surface.

The oilfield is the largest in the world and belongs to **Miles Axlerod**; the fuel at the
centre of the plot is **Allinol**.

*Note on naming:* the stage will use these beats and none of the Disney/Pixar proper
nouns — an unnamed agent, an unnamed tug, an unnamed rig — so it is safe to publish.
The mechanics are what the user asked for; the trademarks are not needed for them.

## Source 2 — Goldfinger (1964), already partly researched

Filmed July 1964 on the **Furka Pass**, Urseren Valley near Andermatt, with DB5 material
shot around **Realp**. Goldfinger's **Rolls-Royce Phantom III (AU 1)**, Tilly Masterson's
white **Ford Mustang**, then the **Auric Enterprises** factory (Pinewood sets, with the
Pilatus works at Stans for exteriors). That gives a second campaign: the pass tail, then
the factory infiltration, then the escape.

## What the build actually needs

The gap is **world objects**, not more counters. Required, with real dimensions:

| object | real size | why |
|---|---|---|
| offshore rig | legs ~100 m tall, deck 60 × 60 m | the climb and the fall are the scene |
| tanker | 200–330 m long, deck 30 m wide | it has to read as a ship you drive onto |
| tug | ~25 m | the small boat that gets attacked |
| patrol / combat boat | 20–35 m, moving | the threat, and it must move on water |
| open water | — | a surface with swell, not tarmac |

New mechanics on top of the existing physics:

- **Vertical driving** on a rig leg (magnetic wheels) — a segment where gravity is sideways.
- **A grappling hook** with a real anchor point and a rope drawn under tension.
- **A camera/photograph objective** — line up a target within a frame and hold it.
- **Water mode** — hydrofoil/booster travel with different drag and steering.
- **A fall** with real airtime, then a water entry.

Each of these is a renderer feature, not a data table. That is the honest reason this is
a large piece of work rather than another `CIRCUITS` entry.

## Campaign shape

**Sea campaign** (4 stages): approach and the tug ambush · grapple and climb the leg ·
the deck and the photograph · reverse off the top, fall, hydrofoil escape.

**Goldfinger campaign** (3 stages): the Furka Pass tail · the factory approach and gate ·
inside the compound and out.

Every stage keeps the failable-objective model that already works (clock, damage pips,
objective ticks, gadget-answers-role), because that part tested well — nine paths green.

## Rule for this build

Real sizes, real objects drawn in the world, real sound per event (grapple fire, magnet
clamp, shutter, hull impact, water entry, booster). No stage ships as a renamed track.
