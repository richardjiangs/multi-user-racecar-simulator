// cloneaudit.mjs — find the 917K's problem everywhere else.
// A clone inherits the donor's strings. Look for one car's distinctive name inside another
// car's USER-VISIBLE text: the ignition prompt, toasts, the 101 course, the wheel hub, the
// panel copy — not the rival grids (a Ferrari SF90 is legitimately in the Chiron's field)
// and not the shared circuit list.
import { readdirSync, readFileSync } from "node:fs";
process.chdir("/home/user/multi-user-racecar-simulator");

// a distinctive token per car — the thing that must not appear in anyone else's copy
const MARK = {
  "Bugatti Chiron Super Sport 300+": ["Chiron", "Veyron"],
  "Pagani Huayra BC": ["Huayra", "Pagani"],
  "McLaren Speedtail": ["Speedtail"],
  "Ferrari F80": ["F80"],
  "Koenigsegg Jesko": ["Jesko"],
  "Tesla Model S Plaid": ["Model S", "Plaid"],
  "Mercedes-AMG GT Black Series": ["Black Series"],
  "Aston Martin Valkyrie": ["Valkyrie"],
  "Ferrari 250 GTO": ["250 GTO"],
  "Lamborghini Revuelto": ["Revuelto"],
  "Porsche 918 Spyder": ["918"],
  "Porsche Taycan Turbo GT": ["Taycan"],
  "Toyota Supra MK4": ["Supra"],
  "Hennessey Venom F5": ["Venom"],
  "Lotus Evija": ["Evija"],
  "Mercedes-AMG One": ["AMG ONE", "AMG One"],
  "Rimac Nevera": ["Nevera"],
  "Chevrolet Corvette ZR1": ["ZR1", "Corvette"],
  "McLaren P1": ["McLaren P1"],
  "Ferrari F40": ["F40"],
  "Porsche 917": ["917K", "917"],
  "Mitsubishi Lancer Evo X FQ-440": ["Evolution X", "Evo X", "Lancer"],
  "Nissan GT-R Nismo": ["GT-R", "Nismo"],
  "BMW M5": ["M5"],
  "Audi R8 V10 Performance": ["R8"],
  "McLaren F1 1993": ["McLaren F1"],
  "Gordon Murray T.33": ["T.33"],
  "Koenigsegg Agera RS": ["Agera"],
  "Yangwang U9": ["U9", "Yangwang"],
  "Aston Martin DB5": ["DB5"],
  "Mercedes-Benz 300 SLR Uhlenhaut": ["300 SLR"],
  "Czinger 21C": ["21C", "Czinger"],
  "Dacia Sandrider Dakar": ["Sandrider"],
  "Ford Raptor T1+ Dakar": ["Raptor"],
  "Toyota GR DKR Hilux": ["Hilux"],
  "Prodrive Hunter Dakar": ["Hunter"],
};

/* the places a user actually reads. Rival grids, circuit tables and the safety-car code
   legitimately name other cars, so they are excluded. */
function visible(src) {
  const out = [];
  const push = (re, what) => { for (const m of src.matchAll(re)) out.push([what, m[1] || m[0]]); };
  push(/<div class="warning"[^>]*>([^<]*)</g, "ignition prompt");
  push(/<div class="tw-hub">([^<]*)</g, "wheel hub");
  push(/<div class="ring">([^<]*)</g, "start card");
  push(/<div class="pmark">([^<]*)</g, "start card badge");
  push(/<div class="key-card">[\s\S]*?<h1>([^<]*)</g, "start card title");
  push(/showToast\("([^"]{6,})"/g, "toast");
  push(/app\.showToast\("([^"]{6,})"/g, "toast");
  push(/warn\.push\("([^"]{6,})"/g, "warning");
  push(/reply\("([^"]{10,})"/g, "co-pilot");
  push(/<p style="margin:4px 0">([^<]{20,})</g, "101 course");
  push(/<h3 id="ls\d"[^>]*>([^<]*)</g, "101 heading");
  push(/<span class="small"[^>]*>([^<]{10,})</g, "panel copy");
  push(/title="([^"]{20,})"/g, "tooltip");
  return out;
}

const files = readdirSync(".").filter((f) => /simulator\.html$/i.test(f));
const findings = [];
for (const f of files) {
  const me = f.replace(/ simulator\.html/i, "");
  const src = readFileSync(f, "utf8");
  const mine = MARK[me] || [];
  const texts = visible(src);
  for (const [other, marks] of Object.entries(MARK)) {
    if (other === me) continue;
    for (const mk of marks) {
      // skip a token that is also one of my own names (McLaren F1 vs McLaren F1 2026 etc.)
      if (mine.some((x) => x.includes(mk) || mk.includes(x))) continue;
      for (const [where, text] of texts) {
        if (!text.includes(mk)) continue;
        findings.push({ me, other, mk, where, text: text.slice(0, 110) });
      }
    }
  }
}
if (!findings.length) { console.log("clean: no car quotes another car in its own copy"); process.exit(0); }
const byCar = {};
for (const x of findings) (byCar[x.me] ||= []).push(x);
for (const [car, list] of Object.entries(byCar)) {
  console.log("\n" + car + "  (" + list.length + ")");
  for (const x of list) console.log("   [" + x.where + "] " + x.mk + " → " + x.text);
}
console.log("\n" + findings.length + " leftovers across " + Object.keys(byCar).length + " cars");
