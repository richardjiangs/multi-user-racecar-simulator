# Dashboard, assist and F1 audio — 13 September 2026

## Garage restoration and lighting — 14 September 2026

The full garage was restored from `2f55334` after a later change replaced it with a network-dependent loader. Its layout, photos, controls and assist behavior are preserved. All 63 simulators with a cabin/map/ambient-light control now initialize `ambient` to false and render that button inactive. Users can still turn it on. Phantom's separate `stars` and `galleryLit` defaults remain true; its simulator is unchanged. Exterior lights and other lighting controls retain their previous behavior. Rebuild both garage entry points with `node tools/embed-sims.mjs` so offline use receives the same defaults.

## Assist defaults

Only Viper ACR Extreme Aero, MCXtrema, Peugeot 9X8, Aurora Agil and Solus GT start and reset with assist off. **P** invokes the existing toggle and status toast. Held-key repeats, modified shortcuts and typing in editable fields do not toggle it. Other cars retain their previous defaults and keyboard behavior. Zenvo's near-limit message now reads `SPEC.topSpeedMps`, producing “approaching 360 km/h limit” at 98% of its current limit.

## SSC Tuatara dashboard

The former twin round instrument pods were incorrect. Both driving canvas and cockpit SVG now follow the production arrangement: one broad digital HMI behind a stitched three-spoke wheel, twin circular centre vents, and a portrait touchscreen between metallic rails. Speed, gear, RPM, shift lights, boost, temperatures, fuel map and driving mode read simulation state. Console controls invoke the existing mode, lift, climate, audio and ignition actions; drawn paddles operate the gearbox.

References: [SSC model specification](https://www.sscnorthamerica.com/model/tuatara), [SSC production debut](https://www.sscnorthamerica.com/news/2020-tuatara-debut), and [SSC publicity cabin photograph](https://images.hgmsites.net/hug/ssc-tuatara_100722519_h.jpg). These are hand-authored illustrations using available simulator readings and modes, not proprietary HMI software.

Edit `tools/tuatara-dashboard.svg` and `tools/tuatara-driving-dashboard.js`, then run `node tools/refresh-tuatara-dashboard.mjs`. SSC's physics, sound and assist behavior are unchanged.

## F1 audio

**User selection, 14 September 2026:** all eleven F1 cars now use Porsche 919's existing sound. This replaces the earlier five-family V6 synthesis. Porsche 919 itself is unchanged.

The copied graph preserves the 919's oscillator stack, pulse order, filters, gains, turbo/gearbox/motor layers, startup, blips, lift transients and recording behavior. F1's `mguKPowerKw` and `ersHarvestKw` feed the corresponding 919 motor-sound inputs. Its audio-only 9,000 rpm normalization is retained so identical engine inputs produce matching sound; actual F1 RPM still drives pitch. This does not modify the F1 physics specification, rev limit, power, energy model or performance.

This is an intentional sound preference, not a claim that the real engines are identical. The voice audit explicitly permits the 919 and all eleven F1 cars to share this sound.

Run `node tools/refresh-f1-audio.mjs` to copy the audio directly from `Porsche 919 Hybrid simulator.html`. There is no separate F1 sound template to drift away from the reference. Every HTML keeps its audio embedded for offline use.

## Verification

Both garage entry points expose **Report issue**, linking to this repository's GitHub issue chooser. Generate `index-offline.html` from `index.html` rather than editing it directly.

After generators, run `node tools/embed-sims.mjs`, then:

```sh
node tests/dashboard-audio-test.mjs
node tests/browser-test.mjs
node tests/perf-test.mjs
node tests/driving-regression-test.mjs
node tests/track-specials-test.mjs
node tests/solus-test.mjs
```

The targeted test exercises assist defaults and keyboard edge cases, SSC live instruments and SVG controls, and both issue links. It renders the actual 919 and F1 graphs with identical noise seeds, checking audio samples match within 0.000001 at idle, load, high RPM, electrical deployment and regeneration (allowing a few floating-point rounding steps across audio contexts). Additional scenarios compare startup, downshift, lift, ignition shutoff and recording playback. `VERIFICATION_DIR` saves screenshots, WAV files and metrics. These checks establish equivalence to the chosen simulator sound, not real-world acoustic fidelity.

Performance certification explicitly selects its original assisted-line launch setup, so user-facing defaults cannot change calibrated test inputs. Its tolerance, physics and expected times remain unchanged; top-speed runs still use assist off.
