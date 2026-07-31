# Aston Martin DB5 — mission design

**Status: the shipped missions are wrong.** They are a road with renamed corners plus a
counter. This document now records the sequence as the user described it, because my own
research pass was too shallow and produced generic beats instead of the real ones.

## Cars 2 — the cold open, as it actually happens

Told to me by the user after I got it wrong. This is the spec; build against it, not
against a summary.

1. **Finn McMissile is on a tug boat.**
2. **The tanker points a laser at the tug.** That is the trigger — not a vague "ambush".
3. Finn **launches a hook and hooks himself onto the tanker**, off the tug.
4. When **the tanker nears the platform**, he **hooks the top**, switches the wheels to
   **magnet mode**, drives to the top and **hangs himself over the edge**.
5. He **photographs the dangerous TV camera** — and **is caught**.
6. Escape, in order: he **lays oil on the road**, **fires**, takes the **speedy turn**,
   **blows up a bridge**, and heads for the **helicopter pad**.
7. He goes **into the water**, **turns into a boat**, and is **chased by the tanker**.
8. He **ejects his four tyres to play dead**, **turns into a submarine**, and carries on to
   the next mission.

Key corrections against what I built:

| I built | actually |
|---|---|
| a generic "dock patrol" ambush | the **tanker's laser** on the tug is what starts it |
| hook onto the rig from the water | hook onto the **tanker** first, then from the tanker to the platform top |
| drive up a leg | **hang over the top edge** after magnet-driving up |
| photograph, then just leave | photograph, **get caught**, then a specific escape chain |
| "escape to a fuel depot" | oil → guns → speed boost → **blow a bridge** → helicopter pad |
| a water "mode" | **boat form**, chased by the tanker, then **tyres off to play dead**, then **submarine** |
| one stage | it **continues into the next mission** — this is a campaign |

## James Bond — also wrong

The user says the Goldfinger stage is wrong too. Do not rebuild it from my earlier notes.
It needs the same treatment: the actual sequence, beat by beat, confirmed before any code.
Bond has more than one mission, so this is a campaign as well, not a single stage.

## What the build needs

Not more objectives — **mechanics that do not exist yet**:

- a **hook** that attaches to a moving vessel and pulls the car across a gap
- **magnet mode** on the wheels, and driving on a vertical surface
- **hanging** from an edge as a held state
- a **photograph** action with a framed target, and a **capture** consequence
- **boat form** and **submarine form**, with different physics
- **ejecting the tyres** as a deliberate act
- a **bridge that can be destroyed**
- vessels that **move** and **aim** (the tanker's laser tracks the tug)

## Rule

Confirm the sequence with the user before building. I have now got this wrong twice by
summarising instead of checking, and each pass cost a release.
