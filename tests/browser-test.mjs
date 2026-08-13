#!/usr/bin/env node
/* ============================================================================
   BROWSER SMOKE TEST — index.html shell + all six embedded simulators.
   Serves the repo over localhost, then verifies:
     1. the garage renders all six car cards
     2. PRIVATE PRACTICE keeps the AI rival grid alive (the old shell cleared
        it every 750 ms — the "no AI cars" bug this suite pins down)
     3. each embedded sim boots inside the shell and its physics advance
     4. ONLINE mode: rivals replaced by real racers only; circuit buttons
        locked for joiners; remote players render as rivals
     5. RACE CONTROL: countdown holds the car on the grid, five lights show,
        release turns assists off and lets the car launch
   Run:  node tests/browser-test.mjs
   ============================================================================ */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  const { execSync } = await import("node:child_process");
  const g = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(resolve(g, "playwright/index.mjs")).href);
}
const { chromium } = await loadPlaywright();

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg" };
const server = createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = join(ROOT, url === "/" ? "index.html" : url.slice(1));
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const BASE = `http://127.0.0.1:${server.address().port}/`;

let failures = 0;
const check = (label, ok, detail) => {
  console.log(`   ${ok ? "✔" : "✘ FAIL"}  ${label}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

/* ---------- every car must have its OWN engine voice ----------
   Firing frequency (rpm/60 x pulses-per-rev) was always right, but the oscillator stack
   on top of it is the timbre, and cloning a sim copies it verbatim: at one point three
   classics (250 GTO, F40, 917) shared a byte-identical stack, so a Colombo V12, a
   twin-turbo V8 and an air-cooled flat-12 were one instrument at three pitches. The only
   cars allowed to share a voice are the ones that really do share a power unit. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const ALLOWED_SHARED = [
    ["Mercedes F1 2026", "McLaren F1 2026", "Williams F1 2026", "Alpine F1 2026"],   // Mercedes PU
    ["Ferrari F1 2026", "Haas F1 2026", "Cadillac F1 2026"],                          // Ferrari PU
    ["Red Bull F1 2026", "Racing Bulls F1 2026"],                                     // Red Bull Ford PU
    ["Koenigsegg Jesko", "Koenigsegg Agera RS"],                                      // same 5.0 TT V8
  ].map((g) => g.slice().sort().join("|"));
  const sims = readdirSync(ROOT).filter((f) => /simulator\.html$/i.test(f));
  const byVoice = new Map();
  for (const f of sims) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const defs = (src.match(/const defs = \[[\s\S]*?\n      \];/) || [""])[0].replace(/\/\/[^\n]*/g, "");
    const order = (src.match(/\(s\.rpm \/ 60\) \* ([\d.]+)/) || [])[1];
    const key = createHash("md5").update(defs + "|" + order).digest("hex");
    const name = f.replace(/ simulator\.html/i, "");
    byVoice.set(key, (byVoice.get(key) || []).concat(name));
  }
  const shared = [...byVoice.values()].filter((v) => v.length > 1).map((v) => v.slice().sort().join("|"));
  const unexpected = shared.filter((g) => !ALLOWED_SHARED.includes(g));
  check(`${byVoice.size} distinct engine voices across ${sims.length} cars`, unexpected.length === 0,
    unexpected.length ? "UNEXPECTED SHARED VOICE: " + unexpected.join("  //  ") : "");
}


/* ---------- one template with the numbers nudged is not 26 cars ----------
   The first generated set measured a mean roofline difference of 0.070 with 98 of 496 pairs
   inside 0.03 of identical — one pair in five was the same silhouette. I had described those
   rooflines as written per car. They were not. This measures it instead of taking my word. */
{
  const { SPECS } = await import("../tools/bodykit/specs.mjs");
  const keys = Object.keys(SPECS).filter((k) => !SPECS[k].skip);
  const at = (roof, x) => {
    for (let i = 1; i < roof.length; i++) {
      if (roof[i][0] >= x) {
        const a = roof[i - 1], b = roof[i];
        return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
      }
    }
    return roof[roof.length - 1][1];
  };
  const XS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  const V = keys.map((k) => ({ k, v: XS.map((x) => at(SPECS[k].roof, x)) }));
  let sum = 0, n = 0, min = 9, worst = "";
  for (let i = 0; i < V.length; i++) {
    for (let j = i + 1; j < V.length; j++) {
      const d = Math.sqrt(V[i].v.reduce((s, a, q) => s + (a - V[j].v[q]) ** 2, 0) / XS.length);
      sum += d; n++;
      if (d < min) { min = d; worst = V[i].k + " / " + V[j].k; }
    }
  }
  const mean = sum / n;
  check(`${keys.length} rooflines differ: mean ${mean.toFixed(3)}, closest pair ${min.toFixed(3)} (${worst})`,
    mean >= 0.115 && min >= 0.038,
    mean < 0.115 ? "the set has collapsed back toward one template" : "two cars share a silhouette: " + worst);
}

/* ---------- the hand-drawn exteriors are not the generator's to overwrite ----------
   Eleven cars — the Evo through to the Czinger — were drawn by hand, car by car, and they are
   the standard the rest are trying to reach. A generator run flattened six of them into its own
   output. They are restored; this makes sure they stay that way. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const HAND = ["Mitsubishi Lancer Evo", "Nissan GT-R", "BMW M5", "Audi R8", "McLaren F1 1993",
    "Gordon Murray T.33", "Koenigsegg Agera", "Yangwang U9", "Aston Martin DB5",
    "300 SLR", "Czinger 21C"];
  const lost = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    if (!HAND.some((h) => f.includes(h))) continue;
    const src = readFileSync(ROOT + "/" + f, "utf8");
    if (/drawn from the car's own published dimensions/.test(src)) lost.push(f.replace(/ simulator\.html/i, ""));
  }
  check(HAND.length + " hand-drawn exteriors kept out of the generator's reach", lost.length === 0,
    lost.length ? "OVERWRITTEN BY THE GENERATOR: " + lost.join(", ") : "");
}

/* ---------- a body is not a lozenge with the wheels stuck on ----------
   Every exterior in the garage used to be one blob with the wheels painted on top of it, and
   NONE of them had a wheel arch. With no arch there is no relationship between the body and the
   wheel, so there are no proportions, so every car is the same shape in a different colour.
   Hashing the exteriors for duplicates said they were all distinct, which was true and useless.
   These are the checks that actually catch it. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const gaps = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const n = f.replace(/ simulator\.html/i, "");
    const i = src.indexOf("function injectExterior()");
    if (i < 0) { gaps.push(n + ": no exterior at all"); continue; }
    const art = src.slice(i, i + 26000);
    // an arch is an elliptical arc in the body outline: "A rx,ry 0 0 1" over the wheel centre.
    // A raid car hangs its arches off a spaceframe and an open-wheel car has none at all, so
    // those two declare themselves instead.
    const openWheel = /2026 Formula 1|halo|F1 R26|MCL40|FW48|VCARB|VF-26|SF-26|RB22|W17|AMR26|A526|C26/.test(art);
    const raid = /T1\+|Sandrider|GR DKR|HUNTER|RAPTOR/.test(art);
    if (!openWheel && !raid && !/ 0 0 1 /.test(art)) gaps.push(n + ": the body has no wheel arch");
    // and the paint must be the car's own, not one flat fill
    if (!/linearGradient/.test(art)) gaps.push(n + ": the body has no paint, just a flat fill");
  }
  check("every body has wheel arches cut into it and paint on it", gaps.length === 0, gaps.slice(0, 6).join(" | "));
}

/* ---------- a silhouette is not a car ----------
   The right proportions with one grey polygon for glass and nothing else was still described as
   "a half-bitten banana coloured in fifty-two ways", and that was fair: what you actually
   recognise a car by is the furniture. A 250 GTO has an egg-crate mouth, faired round lamps, a
   chrome window surround, wing louvres, a roundel and Borrani wires; a Chiron has a horseshoe and
   a C-line. This checks each generated car carries a front end, a tail and a flank of its own,
   and that no two wear the identical set. */
{
  const { SPECS } = await import("../tools/bodykit/specs.mjs");
  const keys = Object.keys(SPECS).filter((k) => !SPECS[k].skip);
  const bare = [], seen = new Map(), twins = [];
  for (const k of keys) {
    const s = SPECS[k];
    const miss = [];
    if (!s.glass || (!s.glass.none && s.glass.cowl == null)) miss.push("no daylight opening");
    if (!s.front || !s.front.lamp) miss.push("no headlamp");
    if (!s.rear || !s.rear.lamp) miss.push("no tail lamp");
    if (!s.side || !s.side.length) miss.push("nothing on the flanks");
    if (miss.length) bare.push(k + ": " + miss.join(", "));
    // the whole kit, not one field of it — two cars may share a grille and still look different
    const kit = JSON.stringify([s.front && s.front.grille, s.front && s.front.lamp,
      s.rear && s.rear.lamp, s.rear && s.rear.vent, s.rim,
      (s.side || []).map((x) => (Array.isArray(x) ? x[0] : x)).sort()]);
    if (seen.has(kit)) twins.push(seen.get(kit) + " / " + k); else seen.set(kit, k);
  }
  check(`${keys.length} bodies wear their own front end, tail and flank kit (${seen.size} distinct)`,
    bare.length === 0 && twins.length === 0,
    bare.concat(twins.map((t) => "identical kit: " + t)).slice(0, 6).join(" | "));
}

/* ---------- the tyre has to sit INSIDE the arch ----------
   This was the whole "half-eaten" complaint, and it was arithmetic, not taste. The arch was drawn
   as a near-circle springing from the sill — rx and ry both about one tyre radius — so its apex
   sat 29-39 px BELOW the top of the tyre on all 26 cars. The wheel bulged up through the opening
   and the body around it read as a shallow scoop bitten out of the bottom edge. A wheel arch is a
   TALL ellipse that goes over the tyre. */
{
  const { SPECS } = await import("../tools/bodykit/specs.mjs");
  const { profile } = await import("../tools/bodykit/bodykit.mjs");
  const proud = [];
  for (const k of Object.keys(SPECS).filter((x) => !SPECS[x].skip)) {
    const s = SPECS[k], P = profile(s), a = s.archLift || 1.06;
    for (const [cy, r, end] of [[P.cyR, P.rR, "rear"], [P.cyF, P.rF, "front"]]) {
      const over = (cy - r * a) - (cy - r);          // arch apex minus tyre top; must be negative
      if (over > -1) proud.push(`${k} ${end}: tyre stands ${over.toFixed(0)}px out of its arch`);
    }
  }
  check("every tyre sits inside its wheel arch", proud.length === 0, proud.slice(0, 6).join(" | "));
}

/* ---------- and the arch must not cut a notch out of the body above it ----------
   Making the arch a tall ellipse so the tyre fitted inside it was right and only half the job.
   Over a bonnet or a rear deck the body's own top surface sits LOWER than the new apex, so the
   arch sliced up through it and the outline closed in a sharp concave V where the rising arch met
   the falling bonnet line. Twice per car, on 18 of the 52 joins. THAT is the bite mark — the arch
   fix is what put it there. A real car has a haunch: the wing over the wheel stands above the
   tyre and the bonnet falls away inside it. */
{
  const { SPECS } = await import("../tools/bodykit/specs.mjs");
  const { profile, withHaunches, FRAME } = await import("../tools/bodykit/bodykit.mjs");
  const { roofAt } = await import("../tools/bodykit/detail.mjs");
  const notched = [];
  for (const k of Object.keys(SPECS).filter((x) => !SPECS[x].skip)) {
    const P = profile(SPECS[k]), s = withHaunches(SPECS[k], P), a = s.archLift || 1.06;
    for (const [ax, cy, r, end] of [[P.axRear, P.cyR, P.rR, "rear"], [P.axFront, P.cyF, P.rF, "front"]]) {
      const xf = (FRAME.x1 - ax) / P.drawL, top = roofAt(s, P, xf), apex = cy - r * a;
      if (apex < top - 0.5) notched.push(`${k} ${end}: the arch cuts ${(top - apex).toFixed(0)}px into the body`);
    }
  }
  check("no arch cuts a notch out of the body over it", notched.length === 0, notched.slice(0, 6).join(" | "));
}

/* ---------- one loaf with two bites out of it is not twenty-six cars ----------
   The top of every body was one unbroken chain of quadratics and the bottom was a straight line
   between two circular arch cut-outs. No car had a single hard crease anywhere — no windscreen
   base, no Kamm cut, no step onto a boot lid — so a 250 GTO, an F40 and a Model S came out as the
   same rounded mass in different colours. Those creases are the shape. */
{
  const { SPECS } = await import("../tools/bodykit/specs.mjs");
  const keys = Object.keys(SPECS).filter((k) => !SPECS[k].skip);
  const creased = keys.filter((k) => SPECS[k].roof.some((p) => p[2] === "c"));
  const shaped = keys.filter((k) => SPECS[k].rocker && SPECS[k].rocker !== "flat");
  check(`${creased.length}/${keys.length} bodies have hard creases, ${shaped.length} a shaped rocker`,
    creased.length >= 18 && shaped.length >= 14,
    "the outlines have gone back to one smooth loaf — creases: " + creased.length + ", rockers: " + shaped.length);
}

/* ---------- an instrument pack drawn with the wrong arguments lands off the screen ----------
   The U9 and the Nevera declared drawCluster(cx, cy, R) and drawCabinFrame still called them with
   the donor's four-argument (w, h, dashY, sway) form. cx became the canvas WIDTH and R became
   dashY, so the pack was drawn five times too big, centred on the bottom-right corner, over the
   road. It looked like a gear letter the height of the window. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const dec = src.match(/function drawCluster\(([^)]*)\)/);
    if (!dec) continue;                      // the F1 cars carry their instruments on the wheel
    const want = dec[1].split(",").filter((x) => x.trim()).length;
    for (const m of src.matchAll(/(?<!function )\bdrawCluster\(([^;]*?)\);/g)) {
      const got = m[1].split(",").length;
      if (got !== want) bad.push(`${f.replace(/ simulator\.html/i, "")}: declared ${want} args, called with ${got}`);
    }
  }
  check("every cluster is called with the arguments it declares", bad.length === 0, bad.join(" | "));
}

/* ---------- a stale shell hides every release ----------
   SIM_BUILD is the cache-buster for all 52 simulators and it lives inside index.html. A browser
   holding an old index.html therefore keeps requesting the old ?v= for ever: every sim is served
   from its own cache, the build stamp shows the old hash, and nothing that is shipped can reach
   the user. Five releases went out looking exactly like no release at all. build.txt is the same
   hash as a standalone file, fetched with cache:"no-store"; if it ever disagrees with the hash
   baked into index.html the self-heal reloads to the wrong build, or loops. */
{
  const { readFileSync, existsSync } = await import("node:fs");
  const idx = readFileSync(ROOT + "/index.html", "utf8");
  const baked = (idx.match(/SIM_BUILD = "([a-f0-9]+)"/) || [])[1];
  const live = existsSync(ROOT + "/build.txt") ? readFileSync(ROOT + "/build.txt", "utf8").trim() : null;
  check(`build.txt matches the hash baked into index.html (${baked || "?"})`,
    !!baked && !!live && baked === live,
    !live ? "build.txt is missing — the shell can never tell it is stale"
      : `index.html says ${baked}, build.txt says ${live}`);
  check("the shell checks whether it is stale on load",
    /cache:\s*"no-store"/.test(idx) && idx.includes("build.txt"),
    "index.html no longer verifies its own build against the server");
}

/* ---------- the generator has to be safe to run twice ----------
   The generated SVG carries its own <style> block, so a brace counter walking out of
   injectExterior() stops in the wrong place and swallows the next function — which is how six
   sims once ended up with "Unexpected identifier 'turbine'". The block is fenced now, but the
   first fix hand-counted the closing delimiter and lost a character per run: the damage was
   invisible for four runs and then split a token. Two runs, byte-identical, or it is broken. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const { execFileSync } = await import("node:child_process");
  const sims = readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x));
  const before = new Map(sims.map((f) => [f, readFileSync(ROOT + "/" + f, "utf8")]));
  execFileSync(process.execPath, [ROOT + "/tools/bodykit/apply.mjs"], { cwd: ROOT });
  const moved = sims.filter((f) => readFileSync(ROOT + "/" + f, "utf8") !== before.get(f));
  check("running the body generator again changes nothing", moved.length === 0,
    moved.length ? "NOT IDEMPOTENT — these files drifted on a second run: " + moved.slice(0, 5).join(", ") : "");
}

/* ---------- the cockpit is not a photograph ----------
   Every one of the 52 cars drew its instrument pack into the Cockpit tab as literal text in
   the SVG: the speed and the revs never moved while you drove. The first attempt at fixing it
   rendered the car's cluster into a canvas laid OVER the drawing, which read exactly like a
   sticker stuck on the dashboard. The instruments are now the car's own SVG elements, tagged
   with the ids the updater drives, so what moves is the picture itself. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const sims = readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x));
  const gaps = [];
  for (const f of sims) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const n = f.replace(/ simulator\.html/i, "");
    // the readout contract has to be in the updater
    if (!/num\("cabSpeedArt", spd\)/.test(src)) gaps.push(n + ": no live-readout contract");
    if (!/getElementById\("cabRevSegs"\)/.test(src)) gaps.push(n + ": the contract is incomplete");
    // and the car's own drawing has to declare at least one live instrument
    if (!/id="(cabSpeedArt|cabRpmArt|cabRevSegs|cabRevNeedle|cabSpeedNeedle|cabRevBar)"/.test(src))
      gaps.push(n + ": the cabin drawing has no live instrument");
    // no canvas may be laid over the cabin art again
    if (/cabLive|drawCabinLive/.test(src)) gaps.push(n + ": a canvas is pasted over the cabin art");
  }
  check(sims.length + " cockpits: the car's own instruments, and they move", gaps.length === 0, gaps.slice(0, 6).join(" | "));
}

/* ---------- downforce is a function of speed ----------
   updateAero computed its speed and cornering terms only when a driver aid was switched on.
   Turn the steering assist off — which is what anyone actually driving does — and the wing
   stopped working: the readout fell to 0 kg, the grip went with it, and so did the drag, so
   the car then ran well past its own top speed. Reported on the T.50s; it was in every car. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const n = f.replace(/ simulator\.html/i, "");
    if (/assistedDriving/.test(src)) bad.push(n + ": aero still gated on the driver aids");
    // and an opt-in setting must restore the car it was built as, not a number typed by hand
    if (!/const AERO0 = \{ aeroClA: SPEC\.aeroClA/.test(src)) bad.push(n + ": no AERO0 baseline");
    if (/SPEC\.aeroClA = next \? [\d.]+ : [\d.]+;/.test(src)) bad.push(n + ": a setting restores a hand-typed aeroClA");
    if (/SPEC\.dragCd = next \? [\d.]+ : [\d.]+;/.test(src)) bad.push(n + ": a setting restores a hand-typed dragCd");
    if (/state\.raceAero = false; SPEC\.aeroClA = [\d.]+/.test(src)) bad.push(n + ": resetCar writes a hand-typed aeroClA");
  }
  check("downforce follows speed, and every setting restores the car as built", bad.length === 0, bad.slice(0, 6).join(" | "));
}

/* ---------- the cabin wheel turns about where it actually is ----------
   The updater used to rewrite the wheel group's transform with a translate hard-coded from
   whichever donor the car was cloned from. Five cars snapped the wheel across the picture the
   moment you steered; three had no wheel group at all and never turned it. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const n = f.replace(/ simulator\.html/i, "");
    if (!/id="cabinWheelG"/.test(src)) bad.push(n + ": the cabin has no steering wheel to turn");
    if (!/cabinWheel\.dataset\.home/.test(src)) bad.push(n + ": the wheel's home position is not read from the SVG");
    if (/cabinWheel\.setAttribute\("transform", `translate\(/.test(src)) bad.push(n + ": the wheel still carries a hard-coded translate");
  }
  check("every cabin wheel turns about its own centre", bad.length === 0, bad.slice(0, 6).join(" | "));
}

/* ---------- no car may wear another car's cockpit ----------
   drawCabinFrame is the windscreen you drive through, drawCluster is the instrument pack and
   drawWheel is what you hold. A clone copies all three verbatim, and recolouring one is not
   re-deriving it. Only cars that genuinely share a chassis may share them. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const { createHash } = await import("node:crypto");
  const F1 = ["Alpine F1 2026", "Aston Martin F1 2026", "Audi F1 2026", "Cadillac F1 2026", "Ferrari F1 2026",
    "Haas F1 2026", "McLaren F1 2026", "Mercedes F1 2026", "Racing Bulls F1 2026", "Red Bull F1 2026", "Williams F1 2026"];
  const DAKAR = ["Dacia Sandrider Dakar", "Ford Raptor T1+ Dakar", "Prodrive Hunter Dakar", "Toyota GR DKR Hilux"];
  const ALLOWED = [F1, DAKAR].map((g) => g.slice().sort().join("|"));   // one shared chassis each
  const body = (src, name) => {
    const i = src.indexOf("function " + name + "(");
    if (i < 0) return null;
    let d = 0, st = src.indexOf("{", i), j = st;
    for (; j < src.length; j++) { if (src[j] === "{") d++; else if (src[j] === "}") { d--; if (!d) break; } }
    return src.slice(st, j).replace(/\s+/g, " ").replace(/#[0-9a-fA-F]{3,8}/g, "C")
      .replace(/rgba?\([^)]*\)/g, "C").replace(/"[^"]*"/g, "S");     // colour and copy are not design
  };
  const problems = [];
  for (const fn of ["drawCabinFrame", "drawCluster", "drawWheel"]) {
    const byShape = new Map();
    for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
      const b = body(readFileSync(ROOT + "/" + f, "utf8"), fn);
      if (b === null) continue;
      const k = createHash("md5").update(b).digest("hex");
      byShape.set(k, (byShape.get(k) || []).concat(f.replace(/ simulator\.html/i, "")));
    }
    for (const v of byShape.values()) {
      if (v.length < 2) continue;
      const key = v.slice().sort().join("|");
      if (!ALLOWED.includes(key)) problems.push(fn + " shared by " + v.join(", "));
    }
  }
  check("no car wears another car's cockpit, cluster or wheel", problems.length === 0, problems.slice(0, 4).join("  //  "));
}

/* ---------- a clone may not keep the donor's features ----------
   The SSC Tuatara shipped with the Venom F5's "F5 Mode" on key Z — button, voice command, both
   HUD warnings, the wheel boss, the header comment — and, worse, with the Venom's aero coupling
   still wired to it, so choosing E85 cut the Tuatara's drag by 16%. A fuel map cannot do that. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  // a string that names a car, and the only file allowed to contain it outside a rival grid
  const OWNED = {
    "F5 Mode": /Venom F5/, "HENNESSEY": /Venom F5/, "Speed Key": /Chiron/, "Absolut": /Jesko/,
    "2JZ": /Supra MK4/, "Getrag V160": /Supra MK4/, "S68": /BMW M5/, "xDrive": /BMW M5/,
    "Colombo": /250 GTO|F40/, "4B11T": /Lancer Evo/, "VR38DETT": /GT-R Nismo/, "AJ133": /Project 8/,
    "F20C": /S2000/, "F22C1": /S2000/, "S70\/2": /McLaren F1 1993/,
  };
  const BENIGN = /\{ name: "|GRID = \[|short-geared car|distinct from|RADIO_LINES/;
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const n = f.replace(/ simulator\.html/i, "");
    const lines = readFileSync(ROOT + "/" + f, "utf8").split("\n");
    for (const [needle, owner] of Object.entries(OWNED)) {
      if (owner.test(n)) continue;
      const re = new RegExp(needle);
      const hit = lines.findIndex((l) => re.test(l) && !BENIGN.test(l));
      if (hit >= 0) bad.push(n + ' keeps "' + needle + '" (line ' + (hit + 1) + ")");
    }
  }
  check("no car keeps a feature that belongs to the car it was cloned from", bad.length === 0, bad.slice(0, 6).join(" | "));
}

/* ---------- no car may hiss ----------
   Every sim carried the same induction node — band-passed white noise at 2.4 kHz, Q=5,
   which is exactly a "shhhhh" — driven by boostBar, which the cloned physics computes on
   EVERY car. So a naturally-aspirated 1962 Colombo V12 built 1.35 bar of imaginary boost
   and hissed all the way, and the 0.10 floor term meant it never fully stopped. A turbo
   whistle is narrow and high; intake rush on an NA engine is low, broad and quiet; an EV
   has no induction at all. Assert the filter matches the engine. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const NA = /250 GTO|Porsche 917|300 SLR|DB5|R8 V10|McLaren F1 1993|T\.33|Valkyrie|Revuelto|918 Spyder|Ford Raptor/;
  // The Tesla keeps its ORIGINAL inverter noise: the user saved that build and asked for
  // it back, and their preference outranks the rule. Everything else is exempt from
  // nothing.
  const EVc = /Taycan|Evija|Nevera|Yangwang|Spectre/;
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const m = src.match(/this\.turboNode = mkNoise\("bandpass", ([\d.]+), ([\d.]+)\)/);
    const gain = (src.match(/const turbo = ([^;]*);/) || [])[1] || "";
    const name = f.replace(/ simulator\.html/i, "");
    if (!m) { bad.push(name + ": no induction node"); continue; }
    const freq = +m[1], q = +m[2];
    // the Tesla is deliberately exempt: its original inverter noise IS a 2.4 kHz band,
    // the user saved that build and asked for it back
    const keepsOriginal = /Tesla/.test(name);
    if (!keepsOriginal && freq >= 1800 && freq <= 3200 && q >= 3) bad.push(name + ": 2.4 kHz hiss band is back");
    if (/turboGain = this\.turboNode\.g/.test(src) === false) bad.push(name + ": turboGain assignment lost");
    if (EVc.test(name) && !/^0\b/.test(gain.trim())) bad.push(name + ": an EV must have no induction noise");
    if (NA.test(name) && /boostBar/.test(gain)) bad.push(name + ": naturally aspirated but driven by boost");
    if (NA.test(name) && freq > 1200) bad.push(name + ": NA intake should be low, not a whistle");
  }
  check("induction noise matches each engine (no hiss, no fake turbos)", bad.length === 0, bad.join(" | "));
}

/* ---------- nothing you drop behind you may be drawn in front of you ----------
   q.slicks / q.puffs are laid at `state.distanceM - n`, i.e. BEHIND the car, and the draw
   code called projectAhead(-rel) — a POSITIVE distance, so every oil slick and smoke puff
   was painted ahead of the car and receded up the road you were driving into. The physics
   was always right (rivals behind drove through it); only the picture lied, and it lied in
   every sim for as long as the gadget has existed. Anything laid behind now goes in the
   mirror. This asserts nobody re-introduces the sign error. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    if (/projectAhead\(-rel/.test(src)) bad.push(f.replace(/ simulator\.html/i, "") + ": draws its own wake ahead of itself");
  }
  check("nothing laid behind the car is projected in front of it", bad.length === 0, bad.join(" | "));
}

/* ---------- you must be able to see behind you ----------
   Three separate faults, all of which made the world behind the car a void:
     - drawRivals called projectAhead(Math.max(0.6, ahead)), so a car 40 m BEHIND was
       projected 0.6 m in front of your nose, where the scale clamp squashed it out of
       sight. Turn round and the whole field vanished until it came past you again.
     - ROAD.BEHIND was 200 m but ROAD_OFFS — the distances the road is actually drawn at —
       started at -80, so looking back you got 80 m of tarmac and then nothing, and a corner
       you had just driven appeared out of thin air.
     - the mirrors were decoration. There is now one rear-view renderer, the real projection
       run through 180 deg and flipped, and every car has it in one of two layouts. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const SIDE = /Valkyrie|Speedtail|F1 2026/;    // camera pods / wing mirrors, always live
  const bad = [];
  let side = 0, centre = 0; const frames = new Set();
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), n = f.replace(/ simulator\.html/i, "");
    if (/projectAhead\(Math\.max\(0\.6, o\.ahead\)/.test(src)) bad.push(n + ": rivals behind you pinned in front of you");
    if (!/BEHIND: 240/.test(src)) bad.push(n + ": road table does not reach as far back as forward");
    if (!/for \(let d = -240; d < -80; d \+= 12\)/.test(src)) bad.push(n + ": road is not DRAWN further back than 80 m");
    if (!/function drawRearView\(/.test(src) || !/function rearProject\(/.test(src)) bad.push(n + ": no rear-view renderer");
    if (!/drawMirrors\(w, h, pal\);/.test(src)) bad.push(n + ": rear view never drawn");
    // the mirror must sample BOTH directions: reverse, or spin the car, and the glass still works
    if (!/REAR_OFFS/.test(src)) bad.push(n + ": mirror only looks one way down the road");
    if (!/const phi = state\.headingRel \+ Math\.PI \+ cam\.yaw/.test(src)) bad.push(n + ": pods share one viewpoint");
    const m = src.match(/const MIRROR = (\{[\s\S]*?\});/);
    if (!m) { bad.push(n + ": no mirror config"); continue; }
    let cfg; try { cfg = JSON.parse(m[1]); } catch (e) { bad.push(n + ": mirror config is not data"); continue; }
    if (cfg.style !== (SIDE.test(f) ? "side" : "centre")) bad.push(n + ": wrong mirror style " + cfg.style);
    if (cfg.style === "side") {
      side++;
      // two pods that show the SAME thing are one pod drawn twice. Each must have its own
      // mounting on the car and its own outward aim, or they are decoration again.
      if (cfg.pods.length !== 2) bad.push(n + ": a side car needs two pods");
      else {
        const [l, r] = cfg.pods;
        if (!(l.eye < 0 && r.eye > 0)) bad.push(n + ": pods are not mounted on opposite flanks");
        if (!(l.yaw < 0 && r.yaw > 0)) bad.push(n + ": pods are not aimed outboard");
        if (!(l.fx < 0.5 && r.fx > 0.5)) bad.push(n + ": pods are not on the left and right of the screen");
        // the HUD is an HTML panel OVER the canvas, so the canvas can never draw on top of
        // it — a pod has to live where the panel is not. The free band is hard outboard,
        // below the HUD aside and above the bottom bar.
        if (!(l.fx < 0.13 && r.fx > 0.87)) bad.push(n + ": pods are inboard, under the HUD panel");
        if (!(l.fy > 0.62 && l.fy < 0.74)) bad.push(n + ": pods are not in the clear band below the HUD (fy " + l.fy + ")");
      }
    } else {
      centre++;
      if (cfg.pods.length !== 1) bad.push(n + ": an interior mirror is one mirror");
      // high on the windscreen: above the horizon (0.46) so it never sits on the road,
      // and below the topbar so it never sits on the HUD
      else if (!(cfg.pods[0].fy > 0.11 && cfg.pods[0].fy < 0.26)) bad.push(n + ": interior mirror is not high on the screen (fy " + cfg.pods[0].fy + ")");
    }
    frames.add(cfg.frame);
  }
  // and they must not all look alike: the housings differ per car the way the dashboards do
  check(side + " with wing pods, " + centre + " with an interior mirror, " + frames.size + " housing styles",
    bad.length === 0 && side === 13 && centre === 43 && frames.size >= 6, bad.slice(0, 4).join(" | "));
}

/* ---------- the DB5 mission stages are stages, not circuits ----------
   The sea mission shipped once as a CIRCUITS entry with corners renamed "Tanker deck" and
   nothing drawn — a lap of Monaco in a costume. There are now five stage missions, and
   these are the properties that make them that rather than tracks. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Aston Martin DB5 simulator.html", "utf8");
  const WANT = {
    SEA_STAGES: ["crabby", "ride", "climb", "lip", "chase", "bridge", "helipad", "water", "dead", "sub"],
    TOK_STAGES: ["party", "washroom", "race", "bolt", "alley", "rainbow", "apron", "hold"],
    LON_STAGES: ["gears", "street", "pits", "range", "mall"],
    GF_STAGES: ["pass", "tilly", "recce", "yard", "woods", "mirror"],
    NTTD_STAGES: ["sassi", "steps", "piazza", "smoke", "viaduct"],
    PAR_STAGES: ["boulevard", "quay", "market", "stalls", "corner"],
    PC_STAGES: ["coast", "ivan", "valet", "floor", "meeting", "blown", "race", "getaway"],
  };
  const bad = [], surfaces = new Set();
  let total = 0;
  for (const [name, ids] of Object.entries(WANT)) {
    const blk = (src.match(new RegExp("^const " + name + " = \\[[\\s\\S]*?\\n\\];", "m")) || [""])[0];
    const got = [...blk.matchAll(/id: "(\w+)"/g)].map((m) => m[1]);
    for (const m of blk.matchAll(/surf: "(\w+)"/g)) surfaces.add(m[1]);
    total += got.length;
    if (got.join(",") !== ids.join(",")) bad.push(name + ": " + got.join(","));
    // every stage must say where you are, what has to happen, and how it is drawn
    const n = (blk.match(/name: "/g) || []).length, wh = (blk.match(/where: "/g) || []).length,
          hn = (blk.match(/hint: "/g) || []).length, sf = (blk.match(/surf: "/g) || []).length;
    if (n !== ids.length || wh !== ids.length || hn !== ids.length || sf !== ids.length)
      bad.push(name + ": a stage is missing its name/where/hint/surf");
  }
  check("7 stage missions, " + total + " stages, " + surfaces.size + " distinct surfaces",
    bad.length === 0 && total === 47 && surfaces.size >= 30, bad.join(" | "));
  // and the EIGHTH route: the campaign, built by cloning the five Cars 2 legs end to end
  {
    const gaps = [];
    if (!/"Mission — Cars 2, the whole thing"/.test(src)) gaps.push("the campaign route is gone");
    if (!/function buildCampaign\(\)/.test(src)) gaps.push("the campaign is no longer built from the five legs");
    // it must CLONE, not re-declare: the five missions have to keep working on their own
    if (!/s2\.id = pre \+ ":" \+ s2\.base;/.test(src)) gaps.push("campaign stages are not prefixed clones");
    if (!/s2\.leg = pre;/.test(src)) gaps.push("campaign stages do not carry their leg");
    // the Pacific beats must run on the campaign's opening leg, which is a different route
    if (!/state\.stage \? state\.stage\.leg === "sea"/.test(src)) gaps.push("onSea still asks the route, not the stage");
    // and "finish" must mean the END OF THE ROUTE, or Porto Corsa ends the campaign early
    if (!/const isLastStage = /.test(src)) gaps.push("no isLastStage — finish will fire on a leg");
    const loose = (src.match(/^\s*missionDone\("finish"\);/gm) || []).length;
    if (loose) gaps.push(loose + " ungated missionDone(\"finish\")");
    check("the campaign chains all five Cars 2 legs without breaking them", gaps.length === 0, gaps.join(" | "));
  }
  // a surface a stage names with no renderer behind it is a stage you drive through a void
  {
    const noDraw = [...surfaces].filter((sf) => !src.includes('case "' + sf + '":'));
    check("every surface a stage names is actually drawn", noDraw.length === 0, "no renderer: " + noDraw.join(","));
  }
  // Tokyo and London were empty streets: a World Grand Prix with nobody watching it, and a
  // city centre with no other cars in it.
  {
    const gaps = [];
    const body = (name) => (src.match(new RegExp("function " + name + "\\([\\s\\S]*?\\n  \\}")) || [""])[0];
    if (!/function crowd\(/.test(src)) gaps.push("no crowd()");
    if (!/function traffic\(/.test(src)) gaps.push("no traffic()");
    if (!/crowd\(/.test(body("drawNeon"))) gaps.push("the Tokyo night race has nobody watching it");
    const city = body("drawCity");
    if ((city.match(/crowd\(/g) || []).length < 2) gaps.push("London and The Mall are empty");
    if (!/traffic\(/.test(city)) gaps.push("The Mall has no other cars on it");
    if (!/traffic\(/.test(body("drawSuspension"))) gaps.push("the Rainbow Bridge is empty");
    if (!/crowd\(/.test(body("drawPitlane")) && !/roundRect/.test(body("drawPitlane"))) gaps.push("the pit lane has no crew");
    check("Tokyo and London are populated — crowds behind the barriers, traffic on the roads",
      gaps.length === 0, gaps.join(" | "));
  }
  const kit = ["seaHarpoon", "seaMagnet", "seaShutter", "seaRocket", "seaCharge", "seaFoil",
               "seaTorpedo", "seaDive", "seaSonar", "seaBlast", "seaClamp", "seaAlarm"];
  const missing = kit.filter((k) => !new RegExp("\\b" + k + "\\(").test(src));
  check("the mission equipment each has its own synthesised sound", missing.length === 0, "missing: " + missing.join(","));
  check("a stage draws its own world — no circuit kerbs, racing line, start/finish or roadside",
    /if \(pal\.env !== "sea"\) drawStartFinishLine\(\)/.test(src)
    && /if \(pal\.env === "sea"\) return;/.test(src)
    && /if \(!onStage\(\)\) \{ drawRoadside/.test(src));
  check("a stage run is one-way — braking cannot drop you back a stage",
    /s\.i < state\.stage\.i\) s = state\.stage/.test(src));
}

/* ---------- the Jesko is two cars ----------
   Z is the FUEL MAP (petrol 1,280 hp / E85 1,600) and Y is the BODY: the Attack, with the
   boomerang wing and 1,400 kg of downforce, or the Absolut, with the wing deleted for two
   rear-deck fins, 85 mm more tail and Cd 0.278. They are different axes and both are opt-in,
   so the certified 0-100 is the Attack car on petrol. Assert all of that stays true. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Koenigsegg Jesko simulator.html", "utf8");
  const gaps = [];
  if (!/KeyZ" && !e\.repeat\) app\.toggleFuel\(\)/.test(src)) gaps.push("Z is no longer the fuel map");
  if (!/KeyY" && !e\.repeat\) app\.toggleAbsolut\(\)/.test(src)) gaps.push("Y is not the Absolut body");
  if (!/dragCd: 0\.278/.test(src)) gaps.push("the Absolut has lost Cd 0.278");
  if (!/downforceKg: 150/.test(src)) gaps.push("the Absolut has lost its 150 kg");
  if (!/downforceKg: 1400/.test(src)) gaps.push("the Attack has lost its 1,400 kg");
  if (!/claimedTopKmh: 531/.test(src)) gaps.push("the 531 km/h claim is gone");
  // the body has to be real geometry, not a label
  for (const id of ["kgAbsolutFins", "kgAbsolutTail", "kgWheelCovers", "kgWingPylons"])
    if (!src.includes('id="' + id + '"')) gaps.push("no " + id + " in the exterior art");
  // both start hidden and both are off by default, or perf-test would see them
  if (!/absolut: false/.test(src)) gaps.push("the Absolut is on by default");
  if (!/e85: false/.test(src)) gaps.push("E85 is on by default");
  // applyBodyArt is in a different { } block from injectExterior — it must go through app
  if (/\n    applyBodyArt\(\);\s+\/\/ whichever body/.test(src))
    gaps.push("injectExterior calls applyBodyArt across a block boundary");
  check("the Jesko carries both bodies — Z the fuel map, Y the Absolut", gaps.length === 0, gaps.join(" | "));
}

/* ---------- a <title> that names a displacement must name its OWN ----------
   Six cars cloned from the Supra kept the 2JZ's "3.0" in the browser tab, on engines of
   5.2, 4.4, 3.9, 6.1, 2.0 and 3.8 litres — and six wore Toyota's GR badge on the start
   card, including a 1993 McLaren and a Gordon Murray. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const title = (src.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const litres = (title.match(/(\d\.\d)\s*(?:L\b|litre|naturally|turbo|twin-turbo|sequential|supercharged)/i) || [])[1];
    if (!litres) continue;                     // most titles name no displacement at all
    checked++;
    const cc = +(src.match(/displacementCc: (\d+)/) || [])[1];
    if (!cc) { bad.push(f + ": title says " + litres + " L but the SPEC has no displacement"); continue; }
    // a marketing displacement is sometimes rounded and sometimes truncated: the T.33s
    // 3,994 cc Cosworth is a "3.9" and the M5s 4,395 cc S68 is a "4.4". Accept either.
    const want = [(Math.round(cc / 100) / 10).toFixed(1), (Math.floor(cc / 100) / 10).toFixed(1)];
    if (!want.includes(litres)) bad.push(f.replace(/ simulator.html/i, "") + ': title says ' + litres + " L, SPEC says " + want.join(" or "));
  }
  check(checked + " titles checked — each quotes its own displacement", bad.length === 0, bad.join(" | "));
}

/* ---------- a stage gate latches ----------
   Reported: the Matera 360 never registered as passed. It did — missionDone("spin") fired —
   but the GATE re-read q.spinDeg >= 340 every frame, and q.spinDeg decays at 55 deg/s the
   moment you stop holding full lock with the guns live. Your magazine is 5.2 s and the spin
   needs 2.3 s of it, so the objective ticked, the guns ran dry, the counter fell back under
   340, and the gate shut behind the player and asked for the 360 again with nothing to fire.
   Five gates read a value that can go back down: spinDeg, the revolving plates (GB->CH->F->GB),
   the tracker scope, the hydrofoils, and q.stopped. Doing the thing must not be un-doable by
   the readout that measured it. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Aston Martin DB5 simulator.html", "utf8");
  const bad = [];
  if (!/if \(s\.met && rawMet\) state\.gatePassed\[gk\] = true;/.test(src)) bad.push("the shared gate no longer latches");
  if (!/const met = rawMet \|\| \(s\.met \? !!state\.gatePassed\[gk\] : true\);/.test(src)) bad.push("the shared gate does not read the latch");
  if (!/if \(s\.need && met\) state\.gatePassed\[gk\] = true;/.test(src)) bad.push("the Pacific gate no longer latches");
  if (!/const metL = met \|\| \(s\.need \? !!state\.gatePassed\[gk\] : true\);/.test(src)) bad.push("the Pacific gate does not read the latch");
  // and the latch must only remember a gate that EXISTS: latching the `true` that means
  // "this stage has no gate" marked the Pacific stages passed before they had been
  if (/if \(rawMet\) state\.gatePassed/.test(src)) bad.push("the latch fires on stages that have no gate");
  if (!/state\.stage = null; state\.stageT = 0; state\.gatePassed = \{\};/.test(src)) bad.push("the latch is not cleared when a mission starts");
  // the miniguns behind the headlamps are their own pair — arriving dry must not block it
  if (!/state\.q\.ammo = Math\.max\(state\.q\.ammo, 104\)/.test(src)) bad.push("the piazza no longer re-belts the miniguns");
  // and the Paris gate must not re-close once you drive away from the photograph
  if (/q\.shots >= 1 && q\.stopped/.test(src)) bad.push("the Paris gate still re-reads q.stopped");
  check("a stage gate latches — doing the thing cannot be un-done by the readout", bad.length === 0, bad.join(" | "));
}

/* ---------- nothing in a stage can outrun the stage ----------
   stageCapMps() clamps the PLAYER to what the place allows — 34 km/h down a washroom
   corridor, 62 along a marina quay — but updateRivals only ever clamped a rival to its own
   topMps. Rod left that corridor at 130 and Ivan left the quay at 118, and the gate on both
   stages is "get to him". Fifteen enemies across seven stages could outrun the player. */
{
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(ROOT + "/Aston Martin DB5 simulator.html", "utf8");
  const bad = [];
  if (!/const sc = stageCapMps\(\);/.test(src)) bad.push("updateRivals no longer applies the stage cap");
  if (!/r\.catchable \? 0\.82 : 1/.test(src)) bad.push("a car the stage is about catching is not held under the cap");
  const caps = {};
  for (const m of src.matchAll(/id: "(\w+)", to: \d+, cap: (\d+)/g)) caps[m[1]] = +m[2];
  let stage = null, checked = 0;
  for (const line of src.split("\n")) {
    const k = line.match(/^  (\w+): \[$/); if (k) stage = k[1];
    const e = line.match(/name: "([^"]*)".*top: (\d+).*role: "(\w+)"/);
    if (!e || !stage || !caps[stage]) continue;
    if (!["target", "guard", "shooter", "boarder"].includes(e[3])) continue;
    checked++;
    // the flag is what makes it fair; without the runtime clamp this would be a hard fail,
    // so assert the clamp exists (above) AND that a CATCHABLE car is declared as one
    // only the car the stage is ABOUT must be catchable — on the washroom stage that is Rod,
    // not the two lemons working him over, who belong at the cap
    const mustCatch = ["washroom", "ivan", "valet"].includes(stage)
      && (e[3] === "target" || /tag: "/.test(line));
    if (mustCatch && !/catchable: true/.test(line))
      bad.push(stage + ": " + e[1] + " is the car you must reach, but is not marked catchable");
  }
  check(checked + " stage enemies — none can outrun the place it is standing in",
    bad.length === 0, bad.join(" | "));
}

/* ---------- the co-pilot knows its own circuit ----------
   The voice map's fifth entry is the BRAND slot. On seven clones it was never re-derived,
   so "take me to Sebring" did nothing on a Corvette and the Venom F5 answered to "gotland" —
   Koenigsegg's home, and not a circuit either car has. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const SHARED = /monaco|nürburgring|nordschleife|suzuka|silverstone|nardò|prologue|stage |mission/i;
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const keys = [...src.matchAll(/^  "([^"]+)": \{$/gm)].map((m) => m[1]).filter((k) => !SHARED.test(k));
    const map = (src.match(/const map = \[.*?\];/) || [""])[0];
    if (!keys.length || !map) continue;
    const entries = map.match(/\["[^"]+", \[[^\]]*\]\]/g) || [];
    if (entries.length < 5) continue;
    checked++;
    const named = (entries[4].match(/^\["([^"]+)"/) || [])[1];
    // whatever the co-pilot offers must be a circuit this car actually has
    if (!src.includes('  "' + named + '": {'))
      bad.push(f.replace(/ simulator.html/i, "") + ' offers "' + named + '", which it does not have');
    else if (named !== keys[0])
      bad.push(f.replace(/ simulator.html/i, "") + ' offers "' + named + '" instead of "' + keys[0] + '"');
  }
  check(checked + " co-pilots — each offers the brand circuit its own car has", bad.length === 0, bad.slice(0, 6).join(" | "));
}

/* ---------- a rival cannot wear the host car's marque on somebody else's model ----------
   Cloning the T.33 find-replaced "McLaren Automotive" into "Gordon Murray Automotive", so a
   765LT and a P1 raced under Murray's name — in every sim downstream. The tell is a rival
   whose marque is the HOST car's but whose model belongs to a different maker. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const MODELS = { "765LT": "McLaren", "P1": "McLaren", "Senna": "McLaren", "Artura": "McLaren",
    "Huracán": "Lamborghini", "Revuelto": "Lamborghini", "Regera": "Koenigsegg",
    "Nevera": "Rimac", "Valkyrie": "Aston Martin", "LaFerrari": "Ferrari", "SF90": "Ferrari",
    "Veyron": "Bugatti", "MC20": "Maserati", "918": "Porsche" };
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    for (const m of src.matchAll(/name: "([^"]+)"/g)) {
      const n = m[1];
      for (const [model, maker] of Object.entries(MODELS)) {
        // whole word only: "P1" must not match "P100D"
        if (!new RegExp("(^|[^A-Za-z0-9])" + model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^A-Za-z0-9]|$)").test(n)) continue;
        checked++;
        if (!n.includes(maker)) bad.push(f.replace(/ simulator.html/i, "") + ' fields "' + n + '" — a ' + maker);
      }
    }
  }
  check(checked + " rival names checked — each model wears its own maker", bad.length === 0, [...new Set(bad)].slice(0, 6).join(" | "));
}

/* ---------- a brand circuit has to BE that circuit ----------
   Six cars cloned from the Supra never had their brand track re-derived, so six different
   buttons — Bathurst, Norisring, Dunsfold, Goodwood, Tsukuba, SUGO — all loaded FUJI
   SPEEDWAY's geometry and quoted Fuji's blurb; and six brand rival grids were the Supra's
   1990s JDM field with the donor's name find-replaced into it, which is where
   "Gordon Murray T.33 RZ (A80)" and "Nissan Skyline M5 R34 V-Spec" came from. Both are
   drawn on screen. Assert the blurb names its own circuit, that no two cars ship the same
   brand geometry, and that no rival is named after the car it is racing. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const SHARED = /monaco|nürburgring|nordschleife|suzuka|silverstone|nardò|prologue|stage |mission/i;
  const bad = [], geometry = new Map(), fields = new Map();
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), me = f.replace(/ simulator\.html/i, "");
    // the brand-special circuit is the first CIRCUITS key that is not one of the shared seven
    const keys = [...src.matchAll(/^  "([^"]+)": \{$/gm)].map((m) => m[1]).filter((k) => !SHARED.test(k));
    if (!keys.length) continue;
    const key = keys[0];
    const blk = (src.match(new RegExp('  "' + key.replace(/[.*+?^${}()|[\]\\]/g, "\\/* ---------- the start card is the first thing anybody reads ----------") + '": \\{[\\s\\S]*?\\n  \\},')) || [""])[0];
    if (!blk) continue;
    checked++;
    // the blurb must not name a DIFFERENT circuit than the key it sits under
    const blurb = (blk.match(/blurb: "([^"]*)"/) || [])[1] || "";
    const head = key.split(/[,—(]/)[0].trim().split(" ").filter((w) => w.length > 3);
    if (head.length && !head.some((w) => blurb.toLowerCase().includes(w.toLowerCase())))
      bad.push(me + ': "' + key + '" is described as "' + blurb.slice(0, 52) + '…"');
    // two cars must not ship byte-identical brand geometry under different names
    const geo = (blk.match(/c\(\d+[^)]*\)/g) || []).join("|");
    if (geo) {
      if (geometry.has(geo) && geometry.get(geo).key !== key)
        bad.push(me + ' ("' + key + '") has the same layout as ' + geometry.get(geo).me + ' ("' + geometry.get(geo).key + '")');
      else geometry.set(geo, { me, key });
    }
    // and two cars must not field the SAME brand grid. A car legitimately races its own
    // siblings (a Valkyrie meets an AMR Pro, an Agera RS meets an Agera), so the name alone
    // proves nothing — but six identical fields, differing only by a find-replaced word, is
    // exactly the fault: "Gordon Murray T.33 RZ (A80)", "Nissan Skyline M5 R34 V-Spec".
    const grid = (src.match(/const \w+_GRID = \[[\s\S]*?\n  \];/) || [""])[0];
    const names = [...grid.matchAll(/name: "([^"]*)"/g)].map((m) => m[1]);
    // normalise away the host's own name so a pure find-replace collapses to one string
    const sig = names.map((n) => n.split(" ").filter((w) => !me.includes(w)).join(" ")).join("|");
    if (sig.replace(/\W/g, "").length > 20) {
      if (fields.has(sig) && fields.get(sig) !== me)
        bad.push(me + " fields the same grid as " + fields.get(sig));
      else fields.set(sig, me);
    }
  }
  check(checked + " brand circuits — each its own layout, each its own field",
    bad.length === 0, bad.slice(0, 8).join(" | "));
}

/* ---------- the start card is the first thing anybody reads ----------
   Eleven cars were wearing their donor's maker line: the DB5 and the 300 SLR said
   "Ferrari · Maranello", the Yangwang U9 was built in Croatia, and six cars cloned from the
   Supra — a 1993 McLaren among them — said "Toyota Gazoo Racing". Assert the line names the
   marque on the badge. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  // the word in the filename that has to appear in the maker line
  const MARQUE = {
    "Bugatti": "Bugatti", "Pagani": "Pagani", "McLaren": "McLaren", "Ferrari": "Ferrari",
    "Koenigsegg": "Koenigsegg", "Tesla": "Tesla", "Mercedes": "Mercedes|AMG|Daimler",
    "Aston": "Aston Martin", "Lamborghini": "Lamborghini", "Porsche": "Porsche",
    "Toyota": "Toyota", "Hennessey": "Hennessey", "Lotus": "Lotus", "Rimac": "Rimac",
    "Chevrolet": "Chevrolet|Corvette", "Mitsubishi": "Mitsubishi", "Nissan": "Nissan",
    "BMW": "BMW", "Audi": "Audi", "Gordon": "Gordon Murray", "Yangwang": "Yangwang|BYD",
    "Czinger": "Czinger", "Dacia": "Dacia", "Ford": "Ford", "Prodrive": "Prodrive",
    "Alpine": "Alpine", "Williams": "Williams", "Racing": "Racing Bulls", "Haas": "Haas",
    "Cadillac": "Cadillac", "Red": "Red Bull", "Alfa": "Alfa Romeo", "SSC": "SSC", "Jaguar": "Jaguar",
    "Honda": "Honda", "Mazda": "Mazda", "Rolls-Royce": "Rolls-Royce",
  };
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8");
    const ring = (src.match(/<div class="ring">([^<]*)</) || [])[1];
    if (!ring) { bad.push(f + ": no maker line at all"); continue; }
    const key = Object.keys(MARQUE).find((k) => f.startsWith(k));
    if (!key) { bad.push(f + ": unknown marque"); continue; }
    checked++;
    if (!new RegExp(MARQUE[key], "i").test(ring)) bad.push(f.replace(/ simulator.html/i, "") + ' says "' + ring + '"');
  }
  check("all " + checked + " start cards name the maker that built the car",
    bad.length === 0, bad.slice(0, 6).join(" | "));
}

/* ---------- a car must quote its OWN numbers ----------
   The 917K is a clone of the 250 GTO and it inherited that car's strings: at 318 km/h it
   was warning you that you were "nearing the GTO's ~280 km/h ceiling". Assert that the
   speed warning names a number belonging to the car that is saying it. */
{
  const { readdirSync, readFileSync } = await import("node:fs");
  const bad = [];
  let checked = 0;
  for (const f of readdirSync(ROOT).filter((x) => /simulator\.html$/i.test(x))) {
    const src = readFileSync(ROOT + "/" + f, "utf8"), n = f.replace(/ simulator\.html/i, "");
    const warn = src.match(/warn\.push\("nearing ([^"]*)"\)/);
    if (!warn) continue;                      // most cars have no ceiling warning at all
    checked++;
    const top = +(src.match(/topSpeedKmh: (\d+)/) || [])[1];
    const quoted = (warn[1].match(/(\d{3})\s*km\/h/) || [])[1];
    if (!top || !quoted) { bad.push(n + ": cannot read its own ceiling"); continue; }
    if (Math.abs(+quoted - top) > top * 0.1) bad.push(n + " warns about " + quoted + " but tops out at " + top);
  }
  check(checked + " ceiling warnings, each quoting its own car's top speed", bad.length === 0, bad.join(" | "));
}

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e.message || e)));
await page.goto(BASE, { waitUntil: "domcontentloaded" });

console.log("▶ garage");
check("fifty-six car cards render", await page.locator(".car-card").count() === 56);
check("host board present", await page.locator("#activeHostList").count() === 1);

/* ---------- every card must be WIRED, not just rendered ----------
   The car keys are read off the page instead of being listed here, because a hardcoded
   list is exactly how five cards once shipped that rendered perfectly and did nothing:
   they had no entry in the shell's `cars` registry, so openPractice() returned at
   `if (!car) return;` and every button on them was inert — and this file never tried
   them, because they were not in the list. Derive, never enumerate. */
const CAR_KEYS = await page.$$eval("[data-car-card]", (els) => els.map((e) => e.dataset.carCard));
check(`every card key discovered from the page (${CAR_KEYS.length})`, CAR_KEYS.length === 56);

const wiring = await page.evaluate((keys) => keys.map((k) => ({
  key: k,
  practice: !!document.querySelector(`[data-practice="${k}"]`),
  online: !!document.querySelector(`[data-online="${k}"]`),
  learn: !!document.querySelector(`[data-learn="${k}"]`),
})), CAR_KEYS);
const unwired = wiring.filter((w) => !w.practice || !w.online || !w.learn);
check("every card has practice / online / learning buttons", unwired.length === 0,
  unwired.length ? JSON.stringify(unwired) : "");

/* Open a car from the garage and wait for its sim to be live in the iframe. The app's
   global name is discovered inside the frame rather than looked up in a table here — one
   less hardcoded per-car list to forget to update. Returns the frame and that name. */
async function openCar(key) {
  await page.click(`[data-practice="${key}"]`);
  await page.waitForFunction(() => {
    const w = document.getElementById("simFrame").contentWindow;
    if (!w) return false;
    return Object.keys(w).some((k) => /App$/.test(k) && w[k] && w[k].updatePhysics);
  }, null, { timeout: 20000 });
  const frame = page.frames().find((f) => f !== page.mainFrame());
  const app = await frame.evaluate(() =>
    Object.keys(window).find((k) => /App$/.test(k) && window[k] && window[k].updatePhysics));
  return { frame, app };
}

/* ---------- private practice: AI rivals must survive ---------- */
console.log("▶ private practice (AI rival grid)");
for (const key of ["bugatti", "tesla"]) {
  const { frame, app } = await openCar(key);
  await frame.click("#startBtn");
  await frame.evaluate((a) => window[a].selectCircuit("Suzuka Circuit"), app);
  await page.waitForTimeout(2600);   // > 3 shell render ticks: the old bug wiped rivals here
  const r = await frame.evaluate((a) => ({
    rivals: window[a].state.rivals.length,
    grid: window[a].state.raceGrid,
  }), app);
  check(`${key}: AI rivals alive after 2.6 s (${r.rivals} cars)`, r.rivals > 0 && r.grid === true);
  await page.click("#practiceBackBtn");
}

/* ---------- every sim boots inside the shell ----------
   CAR_KEYS comes off the page, so a newly added card is tested the moment it exists —
   including that Private Practice actually puts a running simulator in the iframe. */
console.log("▶ all sims boot in the shell");
for (const key of CAR_KEYS) {
  const { frame, app } = await openCar(key);
  const moved = await frame.evaluate((a) => {
    const x = window[a];
    x.state.ignition = true; x.setGear("G", 1); x.state.keys.KeyW = true;
    for (let i = 0; i < 240; i++) x.updatePhysics(1 / 120);
    x.state.keys.KeyW = false;
    return x.state.speedMps;
  }, app);
  check(`${key}: ${app} boots, physics advance (2 s -> ${(moved * 3.6).toFixed(0)} km/h)`, moved > 5);
  await page.click("#practiceBackBtn");
}

/* ---------- online rules ---------- */
console.log("▶ online mode rules");
await page.click('[data-online="ferrari"]');
await page.waitForFunction(() => {
  const w = document.getElementById("simFrame").contentWindow;
  return w && w.FerrariApp && w.FerrariApp.updatePhysics && window.__mucs;
});
const frame = page.frames().find((f) => f !== page.mainFrame());
await frame.click("#startBtn");
await page.waitForTimeout(900);
let res = await page.evaluate(() => {
  const app = window.__mucs.getSimApp();
  return { rivals: app.state.rivals.length, grid: app.state.raceGrid, gridBtnDisabled: !!document.getElementById("simFrame").contentDocument.getElementById("gridBtn").disabled };
});
check("AI grid replaced (0 rivals before joiners)", res.rivals === 0 && res.grid === false);
check("sim's Rival Grid button locked", res.gridBtnDisabled);

// fake two remote racers (no relays inside the sandbox) and a host claiming the room
res = await page.evaluate(() => {
  const M = window.__mucs;
  M.localId = "me";
  M.hostId = "host-1";
  const mk = (id, name, d) => ({ id, name, car: "bugatti", carLabel: "Chiron SS 300+", body: "#4d8dff", stripe: "#ff8a36",
    distanceM: d, laneOffset: 1.5, speedMps: 60, speedKmh: 216, brake: 0, throttle: 1, gear: "5", route: "Suzuka Circuit", lapMs: 0, bestMs: 0, at: Date.now() });
  const m = new Map(); m.set("host-1", mk("host-1", "Ada", 220)); m.set("p2", mk("p2", "Linus", 180));
  M.testPlayers = m;
  M.injectRemoteRacers();
  const app = M.getSimApp();
  return { rivals: app.state.rivals.map((r) => r.name), grid: app.state.raceGrid };
});
check("remote racers appear as rivals", res.rivals.length === 2 && res.grid === true, JSON.stringify(res.rivals));

// joiner circuit lock
res = await page.evaluate(() => {
  window.__mucs.isHost = false;
  window.__mucs.enforceOnline();
  const doc = document.getElementById("simFrame").contentDocument;
  const btns = Array.from(doc.querySelectorAll("[data-circuit]"));
  return btns.every((b) => b.disabled);
});
check("joiner circuit buttons locked (host sets the track)", res);

/* ---------- race control: track from host + lights + hold + release ---------- */
console.log("▶ race control");
await page.evaluate(() => {
  const M = window.__mucs;
  M.hostId = "";
  M.hostNetId = "";
  M.applyCfg({ type: "cfg", hostId: "host-1", track: "Suzuka Circuit", phase: "lobby", at: Date.now() }, "relay-host");
  M.applyCfg({ type: "cfg", hostId: "host-1", track: "Silverstone Circuit", phase: "lobby", at: Date.now() }, "relay-host");
  M.enforceOnline();
});
await page.waitForTimeout(700);
res = await page.evaluate(() => {
  const app = window.__mucs.getSimApp();
  return { route: app.state.route.name, active: app.state.route.active, hostNetId: window.__mucs.hostNetId };
});
check("host's later track applied even when host network id differs", res.active && res.route === "Silverstone Circuit" && res.hostNetId === "relay-host", res.route);

await page.evaluate(() => {
  const M = window.__mucs;
  M.applyCfg({ type: "cfg", hostId: "host-1", track: "Suzuka Circuit", phase: "countdown",
    goAt: Date.now() + 6800, grid: ["host-1", "me", "p2"], at: Date.now() }, "relay-host");
});
await page.waitForTimeout(1200);
res = await page.evaluate(() => {
  const M = window.__mucs;
  const app = M.getSimApp();
  return {
    holding: M.raceLocal.holding, gridIndex: M.raceLocal.gridIndex,
    speed: app.state.speedMps, dist: app.state.distanceM,
    lightsShown: document.getElementById("startLights").classList.contains("show"),
  };
});
check("grid hold: car pinned to slot P2", res.holding && res.gridIndex === 1 && res.speed === 0 && Math.abs(res.dist + 17) < 0.5, `dist=${res.dist.toFixed(1)}`);
check("start lights overlay visible", res.lightsShown);

await page.waitForTimeout(4500);
res = await page.evaluate(() => {
  const lit = Array.from(document.querySelectorAll("#startLights .lamp")).filter((l) => l.classList.contains("on")).length;
  return { lit };
});
check(`red lights coming on one per second (${res.lit} lit)`, res.lit >= 2 && res.lit <= 5);

await page.waitForTimeout(2600);   // past goAt
res = await page.evaluate(() => {
  const M = window.__mucs;
  const app = M.getSimApp();
  // player floors it after release
  app.state.keys.KeyW = true;
  for (let i = 0; i < 360; i++) app.updatePhysics(1 / 120);
  app.state.keys.KeyW = false;
  return {
    released: M.raceLocal.released, holding: M.raceLocal.holding,
    assist: app.state.assist, testDriver: app.state.testDriver, cruise: app.state.adaptiveCruise,
    speedKmh: app.state.speedMps * 3.6,
  };
});
check("lights out -> hold released", res.released && !res.holding);
check("assists OFF at launch (assist/test driver/cruise)", res.assist === false && res.testDriver === false && res.cruise === false);
check(`car free to launch (${res.speedKmh.toFixed(0)} km/h after 3 s)`, res.speedKmh > 100);

check("no page errors", pageErrors.length === 0, pageErrors.slice(0, 3).join(" | "));

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll browser checks passed.");
process.exit(failures ? 1 : 0);
