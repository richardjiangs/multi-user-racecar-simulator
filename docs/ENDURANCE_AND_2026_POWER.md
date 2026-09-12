# Endurance prototypes and 2026 F1 power

The Porsche 919 Hybrid and Ferrari 499P are separate simulator implementations, not livery variants. Each has its own exterior, cockpit, visible power-unit layout, engine voice, racing controls, dedicated circuit and rival grid.

## Porsche 919 Hybrid (2017)

- Porsche's 2017 press kit specifies a 2.0-litre 90-degree turbo V4, under 500 PS from the combustion engine, more than 400 PS from the front MGU, more than 900 PS total, 875 kg minimum weight, a seven-speed sequential gearbox and the 8 MJ Le Mans deployment class.
- The simulator treats 8 MJ as a per-lap deployment allowance. It does not describe it as battery capacity. The 4 MJ usable store in the model is an explicit simulation assumption.
- The 334.9 km/h maximum is the officially measured speed of the winning number 2 car in the 2017 Le Mans race. The 369.4 km/h figure belongs to the later unrestricted 919 Evo.
- The 2.2-second 0–100 km/h value is a simulator target because Porsche did not publish a road-style launch figure for this race car.

Primary references: [Porsche 919 Hybrid 2017 press kit](https://newsroom.porsche.com/dam/jcr:7c981d12-d361-4158-8c0b-4ba930696f40/Press-kit_LMP1_2017_English_Web.pdf), [Porsche's 2017 Le Mans race facts](https://newsroom.porsche.com/en/motorsports/porsche-le-mans-2017-win-hattrick-facts-919-hybrid-lmp-fiawec-13851.html).

## Ferrari 499P

- Ferrari and the FIA specify a load-bearing 2,992 cc 120-degree twin-turbo V6, a 200 kW front ERS, a 500 kW combined power ceiling, a 900 V system, 1,030 kg minimum weight and a seven-speed sequential gearbox.
- The front ERS is held off below 190 km/h and replaces part of rear-engine output under the combined cap. It does not add 200 kW beyond the 500 kW ceiling.
- The 2.3-second launch and 347 km/h maximum are simulator performance envelopes, not Ferrari factory claims. The 2.5 MJ usable store is an explicit simulation assumption.

Primary references: [FIA 499P technical overview](https://www.fia.com/news/wec-ferrari-499p-hypercar-breaks-cover), [Ferrari 499P introduction](https://www.ferrari.com/en-US/magazine/articles/ferrari-499p-the-comeback), [2023 Hypercar BoP table](https://www.fia.com/sites/default/files/wec_2023_d0054_hypercar_bop_03072023.pdf).

## 2026 Formula 1 driving modes

Normal Mode is the user-requested practice model: all eleven cars reach and sustain **354 km/h** using ordinary throttle. It has sustained electrical assistance and automatically selects low drag on straights. Braking and cornering restore downforce. The existing 2.6 s launch target is unchanged. The 354 figure is a simulator target, not a universal measured F1 top speed.

Real Mode uses finite energy and a speed-dependent electrical envelope. The 350 kW standard curve tapers above 290 km/h to zero at 345; Overtake holds 350 to 337.5 and reaches zero at 355. The usable energy window is 4 MJ. Deployment and harvest respect 500 Nm at crankshaft speed and the 0.97 electrical/mechanical conversion. Standing starts withhold deployment until 50 km/h. Recharge uses an 8.5 MJ/lap default. The model exposes a configurable lap limit and 250 kW power-limited envelope for event configuration. Reference: [FIA Technical Regulations, Issue 20, 5 August 2026, C5.2](https://www.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_c_technical_-_iss_20_-_2026-08-05.pdf).

These are implemented regulatory bounds, not a claim of complete event-level compliance. FIA sector eligibility, wet-session maps, standing-start safety-net logic and proprietary team deployment/aero/ICE data are unavailable here. The approximate one-second Overtake check, team tuning and 400 kW ICE map remain simulation assumptions. Real Mode top speed follows power, energy and drag rather than a 270 or 354 km/h governor. Hold **X** for low drag; **V** requests Overtake when eligible. Low drag now replaces the extra high-downforce drag term instead of being penalized by both settings. Lift/coast harvesting takes kinetic energy; brake harvesting blends with friction braking. Empty or full stores cannot create energy.

## Regression verification

`tests/driving-regression-test.mjs` drives all eleven cars for 120 seconds on a clear straight and asserts every sample in the final minute is 354 km/h. It checks braking cancels low drag, switching modes restores practice energy, Real Mode spends exactly its 4 MJ window, and launch/deployment/recharge limits hold. `tests/perf-test.mjs` retains acceleration and braking calibration checks for all 63 cars.

For the 919 and 499P, the same regression test renders both axles before/after physics updates, checks forward and reverse rotation, and verifies the drawings stay still when stopped. SVG disc, spoke and tyre groups rotate around their own axle origin; brake calipers remain fixed.
