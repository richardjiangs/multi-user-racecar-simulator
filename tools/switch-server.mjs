#!/usr/bin/env node
/* switch-server.mjs — open the game in a stock Nintendo Switch's own browser,
   with NO homebrew, NO exploit, NO console modification.

     sudo node tools/switch-server.mjs         (ports 53 + 80 need sudo/admin)

   How it works (all legitimate, all on YOUR machine + YOUR console):
     - The Switch has a hidden WebKit browser that only appears when a Wi-Fi
       network wants a login page (a "captive portal").
     - This tool runs a tiny DNS responder + web server on your computer. When
       the Switch does its "am I online?" check, the DNS answer points it here,
       and the web server answers in a way that makes the console say
       "this network needs you to log in" and open its browser — straight onto
       the game.
     - Everything else the Switch asks for is forwarded to a real DNS
       (1.1.1.1), so the console still works normally.

   Then on the Switch: System Settings > Internet > (your Wi-Fi) > Change
   Settings > DNS Settings > Manual > Primary DNS = this computer's IP (printed
   below). Reconnect; the browser opens on the game. Play with the touchscreen
   in handheld mode.

   Flags (for testing without root): --dns-port N  --http-port N  --ip x.x.x.x
   --redirect <url> serves nothing and just bounces the console to <url>
   (e.g. the live GitHub Pages site) instead of the local repo.
*/
import { createServer } from "node:http";
import { createSocket } from "node:dgram";
import { readFile } from "node:fs/promises";
import { resolve, dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const DNS_PORT = +opt("--dns-port", 53);
const HTTP_PORT = +opt("--http-port", 80);
const UPSTREAM = opt("--upstream", "1.1.1.1");
const REDIRECT = opt("--redirect", null);   // e.g. https://richardjiangs.github.io/multi-user-racecar-simulator/

function lanIP() {
  const ifs = networkInterfaces();
  const pick = [];
  for (const name of Object.keys(ifs)) for (const a of ifs[name] || []) {
    if (a.family === "IPv4" && !a.internal) pick.push({ name, addr: a.address });
  }
  // prefer common LAN ranges, and en0/wlan-style names
  pick.sort((x, y) => (/^(192\.168|10\.|172\.)/.test(y.addr) - /^(192\.168|10\.|172\.)/.test(x.addr)));
  return (pick[0] && pick[0].addr) || "127.0.0.1";
}
const HOST_IP = opt("--ip", lanIP());

/* the domains the Switch uses for its "am I online?" check — intercept these,
   forward everything else so the console keeps working */
const CAPTIVE = ["conntest.nintendowifi.net", "ctest.cdn.nintendo.net", "detect.ntp.org"];

/* ----------------------------- HTTP ----------------------------- */
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".json": "application/json",
};

/* The touch wheel + pedals are wired with Pointer Events. Modern phones have
   them; the Switch's older browser may only have Touch Events. This shim bridges
   touch -> pointer (with per-finger capture, so the wheel keeps tracking and the
   pedals work at the same time). It NO-OPS on any browser that already has
   PointerEvent, so it changes nothing on a PC/phone. Injected only into pages
   this launcher serves. */
const TOUCH_CSS = `<style>
  /* The touch wheel + D-pad only show on narrow phone widths; the Switch reports
     ~1280px, so force the on-screen driving controls on regardless of width. */
  .touch-wheel { display: block !important; }
  .mobile-pad { display: grid !important; }
</style>`;
const TOUCH_SHIM = `<script>(function(){
  if (window.PointerEvent) return;
  var caps = {};
  function send(el, type, t){
    var e; try { e = new Event(type, {bubbles:true, cancelable:true}); } catch(_){ e = document.createEvent("Event"); e.initEvent(type, true, true); }
    e.clientX = t.clientX; e.clientY = t.clientY; e.pageX = t.pageX; e.pageY = t.pageY; e.screenX = t.screenX; e.screenY = t.screenY;
    e.pointerId = (t.identifier==null?1:t.identifier)+2; e.pointerType = "touch"; e.isPrimary = true;
    e.button = 0; e.buttons = (type==="pointerup"||type==="pointercancel")?0:1; e.view = window; e.pressure = e.buttons?0.5:0;
    el.dispatchEvent(e);
  }
  function on(name, ptype){
    document.addEventListener(name, function(ev){
      var ts = ev.changedTouches || [ev];
      for (var i=0;i<ts.length;i++){
        var t = ts[i], id = t.identifier==null?1:t.identifier, el;
        if (ptype==="pointerdown"){ el = document.elementFromPoint(t.clientX,t.clientY) || ev.target; caps[id]=el; }
        else { el = caps[id] || document.elementFromPoint(t.clientX,t.clientY) || ev.target; }
        if (el) send(el, ptype, t);
        if (ptype==="pointerup"||ptype==="pointercancel") delete caps[id];
      }
      if (ev.cancelable && ev.target && ev.target.closest && ev.target.closest("#touchWheel,[data-pad],#throttle,#brake,.pedal,canvas")) ev.preventDefault();
    }, {passive:false, capture:true});
  }
  on("touchstart","pointerdown"); on("touchmove","pointermove"); on("touchend","pointerup"); on("touchcancel","pointercancel");
  if (!Element.prototype.setPointerCapture) Element.prototype.setPointerCapture = function(){};
  if (!Element.prototype.releasePointerCapture) Element.prototype.releasePointerCapture = function(){};
})();</script>`;

const INJECT = TOUCH_CSS + TOUCH_SHIM;
function injectShim(buf) {
  let html = buf.toString("utf8");
  const m = html.match(/<head[^>]*>/i);
  if (m) return html.slice(0, m.index + m[0].length) + INJECT + html.slice(m.index + m[0].length);
  return INJECT + html;   // no <head> — prepend
}
const http = createServer(async (req, res) => {
  // if configured to bounce to a remote URL, do that for the captive check
  if (REDIRECT) { res.writeHead(302, { Location: REDIRECT }); res.end(); return; }
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { urlPath = "/"; }
  // keep it inside the repo
  let rel = normalize(urlPath).replace(/^(\.\.[\/\\])+/, "").replace(/^\/+/, "");
  let file = rel === "" ? "index.html" : join(ROOT, rel);
  try {
    const body = await readFile(file);
    const isHtml = extname(file) === ".html";
    res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream", "cache-control": "no-cache" });
    res.end(isHtml ? injectShim(body) : body);
  } catch {
    // unknown path (including the bare captive-check URL) -> hand over the game
    try {
      const idx = await readFile(join(ROOT, "index.html"));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" });
      res.end(injectShim(idx));
    } catch { res.writeHead(404); res.end("not found"); }
  }
});

/* ----------------------------- DNS ------------------------------ */
function readName(buf, off) {
  const labels = [];
  while (off < buf.length) {
    const len = buf[off];
    if (len === 0) { off += 1; break; }
    if ((len & 0xc0) === 0xc0) { off += 2; break; }   // compression pointer (not expected in a question)
    labels.push(buf.slice(off + 1, off + 1 + len).toString("ascii"));
    off += 1 + len;
  }
  return { name: labels.join("."), off };
}
function aResponse(query, qEndOff, ip) {
  const head = Buffer.alloc(12);
  query.copy(head, 0, 0, 12);
  head.writeUInt16BE(0x8180, 2);   // standard query response, no error, recursion available
  head.writeUInt16BE(1, 4);        // QDCOUNT
  head.writeUInt16BE(1, 6);        // ANCOUNT
  head.writeUInt16BE(0, 8); head.writeUInt16BE(0, 10);
  const question = query.slice(12, qEndOff);
  const ans = Buffer.alloc(16);
  ans.writeUInt16BE(0xc00c, 0);    // pointer to the question name
  ans.writeUInt16BE(1, 2);         // TYPE A
  ans.writeUInt16BE(1, 4);         // CLASS IN
  ans.writeUInt32BE(30, 6);        // TTL 30s
  ans.writeUInt16BE(4, 10);        // RDLENGTH
  const parts = ip.split(".").map((n) => +n & 255);
  ans[12] = parts[0]; ans[13] = parts[1]; ans[14] = parts[2]; ans[15] = parts[3];
  return Buffer.concat([head, question, ans]);
}
function emptyResponse(query, qEndOff) {
  const head = Buffer.alloc(12);
  query.copy(head, 0, 0, 12);
  head.writeUInt16BE(0x8180, 2);
  head.writeUInt16BE(1, 4); head.writeUInt16BE(0, 6); head.writeUInt16BE(0, 8); head.writeUInt16BE(0, 10);
  return Buffer.concat([head, query.slice(12, qEndOff)]);
}
const dns = createSocket("udp4");
dns.on("message", (msg, rinfo) => {
  let name = "", qtype = 1, qEndOff = 12;
  try {
    const r = readName(msg, 12); name = r.name.toLowerCase();
    qtype = msg.readUInt16BE(r.off); qEndOff = r.off + 4;
  } catch { name = ""; }
  const hit = CAPTIVE.some((d) => name === d || name.endsWith("." + d));
  if (hit) {
    // point the captive check at us on IPv4; deny IPv6 so the console uses IPv4 -> us
    const reply = qtype === 1 ? aResponse(msg, qEndOff, HOST_IP) : emptyResponse(msg, qEndOff);
    dns.send(reply, rinfo.port, rinfo.address);
    log(`captive  ${name} -> ${HOST_IP}`);
    return;
  }
  // forward everything else to a real resolver so the Switch stays online
  const up = createSocket("udp4");
  let done = false;
  const finish = () => { if (!done) { done = true; try { up.close(); } catch {} } };
  up.on("message", (ans) => { dns.send(ans, rinfo.port, rinfo.address); finish(); });
  up.on("error", finish);
  setTimeout(finish, 4000);
  try { up.send(msg, 53, UPSTREAM); } catch { finish(); }
});

/* ----------------------------- boot ----------------------------- */
let quiet = false;
function log(...a) { if (!quiet) console.log(...a); }

function banner() {
  const src = REDIRECT ? REDIRECT : `http://<served locally>`;
  console.log("");
  console.log("  ┌─────────────────────────────────────────────────────────────┐");
  console.log("  │  Nintendo Switch launcher — the console's OWN browser         │");
  console.log("  └─────────────────────────────────────────────────────────────┘");
  console.log("");
  console.log(`  This computer's IP on your network:   \x1b[1m${HOST_IP}\x1b[0m`);
  console.log("");
  console.log("  On the Switch:");
  console.log("    System Settings > Internet > Internet Settings");
  console.log("    > pick your Wi-Fi > Change Settings > DNS Settings > Manual");
  console.log(`    > Primary DNS = \x1b[1m${HOST_IP}\x1b[0m   (Secondary DNS = 0.0.0.0)`);
  console.log("    > Save, then Connect to This Network.");
  console.log("");
  console.log("  The console will say a login is needed and open its browser on");
  console.log("  the game. Turn the Switch sideways (handheld) and drive with the");
  console.log("  on-screen wheel + pedals. Ctrl+C here when you're done, and set");
  console.log("  the Switch's DNS back to Automatic.");
  console.log("");
  if (REDIRECT) console.log(`  Serving: redirect to ${REDIRECT}`);
  else console.log(`  Serving: the game from this folder (${ROOT})`);
  console.log("");
}

function bindError(what, port, err) {
  console.error(`\n  ✗ could not start the ${what} on port ${port}: ${err.code || err.message}`);
  if (err.code === "EACCES") console.error("    Ports 53 and 80 need privileges — run it with:  sudo node tools/switch-server.mjs");
  if (err.code === "EADDRINUSE") {
    console.error(`    Port ${port} is already in use.`);
    if (port === 53) console.error("    On macOS this is rarely mDNSResponder; another DNS/VPN tool may hold it. Quit it, or pass --dns-port for testing.");
  }
  process.exit(1);
}

if (process.env.SWITCH_SERVER_SELFTEST !== "1") {
  http.on("error", (e) => bindError("web server", HTTP_PORT, e));
  dns.on("error", (e) => bindError("DNS responder", DNS_PORT, e));
  http.listen(HTTP_PORT, () => {});
  dns.bind(DNS_PORT, () => { banner(); log(`  (dns:${DNS_PORT}  http:${HTTP_PORT})  ready — waiting for the Switch…\n`); });
}

export { http, dns, aResponse, readName, HOST_IP, CAPTIVE };
