# Dashboard, assist and F1 audio — 13 September 2026

## Assist defaults

Only Viper ACR Extreme Aero, MCXtrema, Peugeot 9X8, Aurora Agil and Solus GT start and reset with assist off. **P** invokes the existing toggle and status toast. Held-key repeats, modified shortcuts and typing in editable fields do not toggle it. Other cars retain their previous defaults and keyboard behavior. Zenvo's near-limit message now reads `SPEC.topSpeedMps`, producing “approaching 360 km/h limit” at 98% of its current limit.

## SSC Tuatara dashboard

The former twin round instrument pods were incorrect. Both driving canvas and cockpit SVG now follow the production arrangement: one broad digital HMI behind a stitched three-spoke wheel, twin circular centre vents, and a portrait touchscreen between metallic rails. Speed, gear, RPM, shift lights, boost, temperatures, fuel map and driving mode read simulation state. Console controls invoke the existing mode, lift, climate, audio and ignition actions; drawn paddles operate the gearbox.

References: [SSC model specification](https://www.sscnorthamerica.com/model/tuatara), [SSC production debut](https://www.sscnorthamerica.com/news/2020-tuatara-debut), and [SSC publicity cabin photograph](https://images.hgmsites.net/hug/ssc-tuatara_100722519_h.jpg). These are hand-authored illustrations using available simulator readings and modes, not proprietary HMI software.

Edit `tools/tuatara-dashboard.svg` and `tools/tuatara-driving-dashboard.js`, then run `node tools/refresh-tuatara-dashboard.mjs`. SSC's physics, sound and assist behavior are unchanged.

## F1 audio

All eleven F1 graphs use six exhaust-pressure events per 720-degree cycle, with two banks locked to `rpm / 120`. Pressure waveforms and pulse-gated combustion noise replace the detuned sawtooth/square stack. Porsche 919 suggested the separation of combustion, gearbox and electric-drive sounds; its file and V4 audio remain unchanged.

Pitch follows RPM, the shift timer reduces exhaust output, turbo noise follows boost with finite spool time, and electric whine follows actual MGU-K deployment or harvesting. Ignition shutoff fades the powertrain bus. Recording playback replaces all continuous synthetic powertrain layers. Wind, road and cabin audio remain separate. Steady throttle no longer triggers repeated random exhaust pops. A master compressor provides headroom.

Shared-engine groups remain Mercedes/McLaren/Williams/Alpine, Ferrari/Haas/Cadillac and Red Bull/Racing Bulls; Aston Martin uses Honda and Audi its own family. Five acoustic profiles vary pressure width, bank balance, filtering and compressor frequency. These are **synthesis assumptions**, not recordings or measured manufacturer timings. Architecture reference: [Formula 1's 2026 power-unit explanation](https://www.formula1.com/en/latest/article/2026-regulations-explained-all-you-need-to-know-about-f1s-new-power-units.14jfv7a36905uDJDdNyfQd).

Edit `tools/f1-audio.js` and the profiles in `tools/refresh-f1-audio.mjs`, then run the latter. Every HTML keeps its audio embedded for offline use. F1 performance and energy models are unchanged.

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

The targeted test exercises assist defaults and keyboard edge cases, SSC live instruments and SVG controls, and both issue links. It renders shipped F1 graphs at 6,000 and 12,000 rpm, checking pulse frequency, headroom, pitch tracking, shift cuts, shutoff, recording isolation, electric power and boost response, and five distinct family spectra. `VERIFICATION_DIR` saves screenshots, WAV files and metrics. Numerical checks do not establish acoustic fidelity.

Performance certification explicitly selects its original assisted-line launch setup, so user-facing defaults cannot change calibrated test inputs. Its tolerance, physics and expected times remain unchanged; top-speed runs still use assist off.
