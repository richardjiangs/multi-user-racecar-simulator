// sheet.mjs — render every spec to one page so the whole set can be judged at once.
import { renderCar } from "./render.mjs";
import { SPECS } from "./specs.mjs";
import { writeFileSync } from "node:fs";
const cells = Object.entries(SPECS).filter(([, s]) => !s.skip).map(([k, s]) =>
  `<div style="width:470px"><div style="color:#9fb0c4;font:11px ui-sans-serif;padding:3px 6px">${s.name}</div>
   <div style="background:#0d1015;border:1px solid #222;border-radius:6px">${renderCar({ ...s, key: k })}</div></div>`).join("");
writeFileSync(process.argv[2] || "/tmp/sheet.html",
  `<body style="margin:0;background:#07080a;display:flex;flex-wrap:wrap;gap:8px">${cells}</body>`);
console.log(Object.values(SPECS).filter((s) => !s.skip).length + " cars rendered");
