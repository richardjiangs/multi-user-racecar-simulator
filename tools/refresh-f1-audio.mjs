// Rebuild only the 11 F1 audio graphs; each HTML remains self-contained.
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root = resolve(import.meta.dirname, '..');
const voices = {
  Mercedes: {family:'Mercedes',cyl:6,pulseWidth:.010,bankDelay:.0015,bankGain:.67,harmonics:58,resonance:920,brightness:4900,grain:.43,turboHz:5900},
  Ferrari: {family:'Ferrari',cyl:6,pulseWidth:.013,bankDelay:.0030,bankGain:.64,harmonics:48,resonance:700,brightness:4200,grain:.51,turboHz:5600},
  'Red Bull Ford': {family:'Red Bull Ford',cyl:6,pulseWidth:.009,bankDelay:.0020,bankGain:.69,harmonics:65,resonance:1080,brightness:5300,grain:.40,turboHz:6200},
  Honda: {family:'Honda',cyl:6,pulseWidth:.012,bankDelay:.0025,bankGain:.62,harmonics:54,resonance:810,brightness:4600,grain:.55,turboHz:6500},
  Audi: {family:'Audi',cyl:6,pulseWidth:.011,bankDelay:.0010,bankGain:.70,harmonics:61,resonance:990,brightness:5100,grain:.46,turboHz:6050},
};
const teams = {Mercedes:'Mercedes',McLaren:'Mercedes',Williams:'Mercedes',Alpine:'Mercedes',Ferrari:'Ferrari',Haas:'Ferrari',Cadillac:'Ferrari','Red Bull':'Red Bull Ford','Racing Bulls':'Red Bull Ford','Aston Martin':'Honda',Audi:'Audi'};
const template = readFileSync(resolve(import.meta.dirname, 'f1-audio.js'), 'utf8');
for (const [team, family] of Object.entries(teams)) {
  const path = resolve(root, `${team} F1 2026 simulator.html`);
  let source = readFileSync(path, 'utf8');
  const graph = template.replace('__VOICE__', JSON.stringify(voices[family]));
  const split = graph.indexOf('    update(s, dt) {');
  source = source.replace(/    init\(\) \{[\s\S]*?(?=    resume\(\))/, graph.slice(0, split));
  source = source.replace(/    update\(s, dt\) \{[\s\S]*?(?=    blowoff\(\))/, graph.slice(split) + '\n');
  // These transients join the synthesised powertrain bus so ignition/recording/shift
  // envelopes apply to them as well. Cabin music, horn and UI sounds stay separate.
  source = source.replace(/    blowoff\(\) \{[\s\S]*?(?=    click\(freq\))/, `    blowoff() {
      const c = this.ctx, t = c.currentTime;
      const src = c.createBufferSource(); src.buffer = this.noiseBuf;
      const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2900; f.Q.value = .8;
      const g = c.createGain(); this._env(src, g, t, .07, .008, .13);
      src.connect(f); f.connect(g); g.connect(this.synthGain); src.start(t); src.stop(t + .16);
    },
    crackle() {
      const c = this.ctx, t = c.currentTime;
      const src = c.createBufferSource(); src.buffer = this.noiseBuf;
      const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1100; f.Q.value = .9;
      const g = c.createGain(); this._env(src, g, t, .11, .002, .028);
      src.connect(f); f.connect(g); g.connect(this.synthGain); src.start(t); src.stop(t + .04);
    },
    _env(node, g, t, peak, attack, decay) { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + attack + decay); },
    startupFlair() {
      if (!this.ready) return;
      // Catch and flare the same V6 pressure oscillators, never a separate V12/saw voice.
      const t = this.ctx.currentTime;
      for (const {o} of this.oscs) { o.frequency.cancelScheduledValues(t); o.frequency.setValueAtTime(8, t); o.frequency.linearRampToValueAtTime(SPEC.idleRpm / 120, t + .22); }
    },
    blip() {
      // Physics supplies rev-matching RPM to update(); avoid a second fixed-pitch engine.
      if (this.ready) this.click(1800);
    },
`);
  writeFileSync(path, source);
  console.log(`${team}: ${family} V6 pressure synthesis`);
}
