# Thrust SSC

Original SVG artwork and live instruments are based on the team's 1997 instrument diagram and cockpit photographs. The car defaults to its Black Rock Desert straight course, which is also selectable in the Circuit view. The 21.726 km lane, mountains and timing-gate placement are reconstructions, not surveyed 1997 coordinates.

## Sound provenance

The previous arbitrary sine-tone / brown-noise patch was replaced by spectral resynthesis. `audio-profile.json` records 96 envelope bands measured from the team's **Run 65 from the ground**, filmed by Jeremy Davey in 1997. The original official [video index](https://www.thrustssc.com/thrustssc/Videos/Videos.html) identifies the film. Its current AVI link is missing; the research metadata includes the Internet Archive copy and its waveform hash.

`research/analyse-audio.py /path/to/thrust-run65.wav` reproduces the envelope. Analysis used a post-boom segment, temporal lower-percentile STFT power and frequency smoothing to reduce isolated voices and impulses. No source audio, voice, video or PCM samples are included in the simulator. Independent random-phase inverse FFT beds use the measured envelope, producing broadband jet texture instead of conspicuous invented musical tones. Playback-rate and gain transitions follow actual simulated spool and thrust; reheat and transonic buffeting blend smoothly.

This is recording-informed synthesis, not an exact cockpit recording. The reference is an 8-bit, 11.025 kHz **receding field recording**. Doppler, microphone response and terrain absorption limit it. Idle/spool/canopy/reheat mapping remains an approximation. The cockpit does not play a spectator's double sonic boom. [Andy Green's cockpit notes](https://www.thrustssc.com/thrustssc/Club/Secure/mn6_Driving_ThrustSSC.html) and [Ron Ayers' acoustic notes](https://www.thrustssc.com/thrustssc/Engineering/Anticipated_Noise.html) distinguish engine roar, canopy shockwave howl, helmet attenuation and the external bow/tail shocks.

## Build and checks

`node tools/thrustssc/build.mjs` generates both root simulator editions. `node tools/driving/defaults.mjs` applies starting routes and assist-off to all editions. Then refresh snapshots' source hashes (art stays unchanged), run `node tools/embed-sims.mjs`, rebuild individual offline files, and run the integrity checks.

All browser checks for this release use `tests/thrustssc/mute.mjs`: output is intercepted through a zero-gain sink before simulator code loads; Chromium additionally uses `--mute-audio`. Audio verification uses numerical data and offline rendering, never speaker playback.
