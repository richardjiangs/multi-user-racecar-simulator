# bodykit — drawing a car's side profile from the car's real dimensions

## Why

Every exterior in the garage was a lozenge with the wheels pasted on top of it. **None of them
had a wheel arch.** That is why a Revuelto and a 250 GTO came out the same shape in different
colours: with no arch there is no relationship between the body and the wheels, so there are no
proportions, so every car is the same blob.

Hashing the exteriors said they were "all distinct", which was true and useless — they were 52
distinct blobs. The check that matters is whether the drawing has the numbers that make a car
look like itself.

## How

`bodykit.mjs` takes the published dimensions —

```
lengthMm  wheelbaseMm  heightMm  frontOverhangMm  rearOverhangMm
wheelDiaFrontMm  wheelDiaRearMm  sillMm
```

— scales them into the frame, and builds the body outline with the **arches cut into it**: the
sill runs forward, arcs up and over each wheel, and comes back down, so the wheel sits inside
the body instead of on top of it. The underside lifts away from the road at both ends and the
bumper faces are rounded, so the ends stop reading as cliffs.

The car's identity then comes from its `roof` array: `[xFromFront, yFromRoofPeak]` as fractions,
front to back. That one array is what makes a Revuelto cab-forward with a long tail and a 250
GTO long-bonneted with a Kamm cut, because that is what those two cars measure.

`render.mjs` turns a spec into the finished `<svg>`: paint, glasshouse and pillars, shoulder
crease, sill, door shut lines, mirror, lamps, splitter, exhausts and the car's own wheel
pattern — plus `extra(P, f)` for whatever is peculiar to that car.

It keeps the ids the sims bind to: `bcBody`, `doorArt`, `quadExhaustArt`, `rearWingArt`,
`frontFlapArt`.

## State

The kit is proven on four cars (`specs-proof.mjs`): Revuelto, 250 GTO, Chiron Super Sport 300+
and Valkyrie. **It is not yet wired into any simulator.** Each car needs its own researched
spec — dimensions and roofline — before its exterior is replaced, and each wants a pass of
hand detail on top of the generated shell to reach the standard the DB5's body sets.
