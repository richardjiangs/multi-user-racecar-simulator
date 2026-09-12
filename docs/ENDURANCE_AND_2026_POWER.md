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

## 2026 Formula 1 MGU-K envelope

All eleven 2026 F1 simulators use the FIA electrical-power curve. Standard deployment is limited to `min(350, 1800 - 5v)` kW below 340 km/h, tapers as `6900 - 20v` kW from 340 to 345 km/h, and is zero at or above 345 km/h. Manual Override uses `clamp(7100 - 20v, 0, 350)` kW, remaining at 350 kW through 337.5 km/h and reaching zero at 355 km/h. Once the electrical curve reaches zero, only the roughly 400 kW combustion engine continues to drive the car.

Primary reference: [FIA 2026 Formula 1 Technical Regulations, section C5.2.7–C5.2.8](https://www.fia.com/system/files/documents/fia_2026_f1_regulations_-_section_c_technical_-_iss_16_-_2026-02-27.pdf).
