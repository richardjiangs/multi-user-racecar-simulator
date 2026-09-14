// The user explicitly selected the existing Porsche 919 sound for all eleven F1 cars.
// Copy from that simulator so a separate F1 template cannot drift from the chosen sound.
import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const root = resolve(import.meta.dirname, '..');
const reference = readFileSync(resolve(root, 'Porsche 919 Hybrid simulator.html'), 'utf8');
const audio = reference.match(/  const audio = \{[\s\S]*?\n  app\.audio = audio;/)?.[0];
const redline = reference.match(/redlineRpm:\s*(\d+)/)?.[1];
if (!audio || !redline) throw Error('Porsche 919 audio or redline missing');
if ([...audio.matchAll(/\bSPEC\.(\w+)/g)].some(m => m[1] !== 'redlineRpm')) {
  throw Error('Porsche audio uses additional specification fields; review the audio-only adapter');
}
const files = readdirSync(root).filter(f => / F1 2026 simulator\.html$/.test(f));
if (files.length !== 11) throw Error('Expected eleven F1 simulators');
const audioBlock = /\/\* ===== audio:[^\n]*\n\{[\s\S]*?\n\}\n\n(?=\/\* ===== physics:)/;
for (const file of files) {
  const path = resolve(root, file), source = readFileSync(path, 'utf8');
  const oldBlock = source.match(audioBlock)?.[0];
  const appName = oldBlock?.match(/const app = window\.(\w+);/)?.[1];
  if (!appName) throw Error('Audio block missing: ' + file);
  // Map only the differently named electric-power readings. Preserve the reference
  // oscillators, filters, gains, pulse order, transients and RPM normalization exactly.
  const adapted = audio.replaceAll('s.mguPowerKw', 's.mguKPowerKw').replaceAll('s.regenPowerKw', 's.ersHarvestKw');
  const block = `/* ===== audio: user-selected Porsche 919 sound ===== */
{
  const app = window.${appName};
  const { clamp } = app;
  // Audio normalization from Porsche 919 only; the F1 physics SPEC is unchanged.
  const SPEC = { redlineRpm: ${redline} };

${adapted}
  audio.voiceSource = "porsche919";
}

`;
  writeFileSync(path, source.replace(audioBlock, () => block)
    .replace(/(id="engineSoundStatus">)[^<]*/, '$1Engine voice: Porsche 919'));
  console.log(file + ': Porsche 919 sound');
}
