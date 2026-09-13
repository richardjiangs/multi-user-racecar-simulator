    init() {
      if (this.ready) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const c = this.ctx = new AC();
      const pulseVoice = __VOICE__;
      this.voiceModel = pulseVoice;
      this.master = c.createGain(); this.master.gain.value = .82;
      const limiter = c.createDynamicsCompressor();
      limiter.threshold.value = -3; limiter.knee.value = 3; limiter.ratio.value = 12;
      limiter.attack.value = .002; limiter.release.value = .08;
      this.master.connect(limiter); limiter.connect(c.destination);
      this.engineBus = c.createGain(); this.engineBus.gain.value = 0;
      this.analyser = c.createAnalyser(); this.analyser.fftSize = 2048;
      this.engineBus.connect(this.analyser); this.analyser.connect(this.master);
      this.engFilter = c.createBiquadFilter(); this.engFilter.type = "lowpass";
      this.engFilter.frequency.value = 1600; this.engFilter.Q.value = .62;
      this.engFilter.connect(this.engineBus);
      this.synthGain = c.createGain(); this.synthGain.connect(this.engFilter);
      this.recGain = c.createGain(); this.recGain.gain.value = 0; this.recGain.connect(this.engFilter);
      const shaper = c.createWaveShaper(); shaper.curve = this._satCurve(1.35);
      shaper.oversample = "4x"; shaper.connect(this.synthGain);

      // A four-stroke V6 produces six exhaust events per 720-degree crank cycle.
      // The two banks share one frequency: there are no detuned sawtooth layers.
      // Pulse shape/pipe response are synthesis estimates, not manufacturer recordings.
      const bankWave = bank => {
        const real = new Float32Array(97), imag = new Float32Array(97);
        for (let n = 1; n < real.length; n++) {
          const w = 2 * Math.PI * n * pulseVoice.pulseWidth;
          const tail = w * 3.4;
          const hr = 1 / (1 + w*w) - .68 / (1 + tail*tail);
          const hi = -w / (1 + w*w) + .68 * tail / (1 + tail*tail);
          for (let event = bank; event < 6; event += 2) {
            const phase = -2 * Math.PI * n * (event / 6 + bank * pulseVoice.bankDelay);
            const amp = [1, .97, 1.015, 1, .985, 1.025][event];
            const rolloff = Math.exp(-Math.pow(n / pulseVoice.harmonics, 1.25));
            real[n] += amp * rolloff * (hr * Math.cos(phase) - hi * Math.sin(phase));
            imag[n] += amp * rolloff * (hr * Math.sin(phase) + hi * Math.cos(phase));
          }
        }
        return c.createPeriodicWave(real, imag);
      };
      this.oscs = [0, 1].map(bank => {
        const o = c.createOscillator(); o.setPeriodicWave(bankWave(bank)); o.frequency.value = 30;
        const g = c.createGain(); g.gain.value = bank ? pulseVoice.bankGain : .72;
        o.connect(g); g.connect(shaper); o.start(); return {o, g, mul: 1};
      });
      this.noiseBuf = this._noiseBuffer(2);
      const noise = (type, frequency, q, bus) => {
        const src = c.createBufferSource(); src.buffer = this.noiseBuf; src.loop = true;
        const f = c.createBiquadFilter(); f.type = type; f.frequency.value = frequency; f.Q.value = q;
        const g = c.createGain(); g.gain.value = 0;
        src.connect(f); f.connect(g); g.connect(bus); src.start(); return {src, f, g};
      };
      this.combNode = noise("bandpass", pulseVoice.resonance, .7, this.synthGain);
      // Pressure-gated broadband combustion adds exhaust grain rather than a continuous hiss.
      this.combPulse = c.createOscillator(); this.combPulse.type = "sawtooth";
      const gate = c.createWaveShaper(), curve = new Float32Array(1024);
      for (let i = 0; i < curve.length; i++) {
        const x = 2 * i / (curve.length - 1) - 1;
        curve[i] = x > .15 ? Math.pow((x - .15) / .85, 2) : 0;
      }
      gate.curve = curve;
      this.combDepth = c.createGain(); this.combDepth.gain.value = 0;
      this.combPulse.connect(gate); gate.connect(this.combDepth); this.combDepth.connect(this.combNode.g.gain); this.combPulse.start();
      this.turboNode = noise("bandpass", pulseVoice.turboHz, 5, this.synthGain); this.turboGain = this.turboNode.g;
      const tone = (type, bus) => {
        const o = c.createOscillator(); o.type = type;
        const g = c.createGain(); g.gain.value = 0; o.connect(g); g.connect(bus); o.start(); return {o, g};
      };
      this.gearTone = tone("triangle", this.synthGain);
      this.mguTone = tone("sine", this.synthGain);
      this.windNode = noise("lowpass", 520, .7, this.master); this.windGain = this.windNode.g;
      this.roadNode = noise("bandpass", 190, .8, this.master); this.roadGain = this.roadNode.g;
      this.musicGain = c.createGain(); this.musicGain.gain.value = 0; this.musicGain.connect(this.master);
      this.lastThrottle = 0; this.ready = true;
    },
    update(s, dt) {
      if (!this.ready) return;
      const t = this.ctx.currentTime, v = this.voiceModel;
      const rpmN = clamp(s.rpm / SPEC.redlineRpm, 0, 1), load = clamp(s.throttle, 0, 1);
      const spd = Math.abs(s.speedMps), running = s.ignition && !s.retired;
      this._set(this.windGain.gain, clamp((spd - 6) / 90, 0, 1) * .09, .1);
      this._set(this.windNode.f.frequency, 420 + spd * 16, .1);
      this._set(this.roadGain.gain, clamp(spd / 80, 0, 1) * .07 * (1 + (s.roadInputG || 0)), .08);
      if (!running) {
        this._set(this.engineBus.gain, 0, .035); this.lastThrottle = 0; return;
      }
      const cycleHz = Math.max(1, s.rpm / 120);
      for (const osc of this.oscs) this._set(osc.o.frequency, cycleHz, .012);
      this._set(this.combPulse.frequency, cycleHz * 6, .012);
      const shifting = s.shiftTimer > 0;
      const torqueCut = shifting ? .22 : 1;
      const valve = s.exhaustValve ? 1 : .65;
      const mode = s.driveMode === "race" ? 1 : s.driveMode === "sport" ? .9 : .78;
      this._set(this.engineBus.gain, (.13 + .34 * load + .18 * rpmN) * valve * mode * torqueCut, shifting ? .004 : .016);
      this._set(this.engFilter.frequency, 1500 + rpmN * v.brightness + load * 1900, .025);
      this._set(this.combDepth.gain, v.grain * (.15 + load * .85), .025);
      this._set(this.combNode.f.frequency, v.resonance + rpmN * 950 + load * 350, .04);
      // No MGU-H: the turbo follows exhaust load with a finite spool/decay time.
      const boost = clamp((s.boostBar || 0) / 2.5, 0, 1);
      this._set(this.turboGain.gain, boost * (.014 + load * .035), .18);
      this._set(this.turboNode.f.frequency, v.turboHz + boost * 1300 + rpmN * 650, .18);
      this._set(this.gearTone.o.frequency, 800 + s.rpm * .30 + (s.curGear || 1) * 85, .022);
      this._set(this.gearTone.g.gain, spd > 2 ? .005 + .017 * load : 0, .04);
      const electricKw = Math.max(s.mguKPowerKw || 0, s.ersHarvestKw || 0);
      this._set(this.mguTone.o.frequency, 1300 + s.rpm * .31, .03);
      this._set(this.mguTone.g.gain, clamp(electricKw / 350, 0, 1) * .022, .04);
      this._set(this.synthGain.gain, this.useRecording ? 0 : 1, .08);
      this._set(this.recGain.gain, this.useRecording ? 1 : 0, .08);
      if (this.useRecording && this.engineSrc) this._set(this.engineSrc.playbackRate, .8 + rpmN * 1.5, .05);
      if (!this.useRecording && this.lastThrottle - load > .35 && boost > .25 && t - this.blowoffAt > .45) {
        this.blowoffAt = t; this.blowoff();
      }
      // Short lift transients only; steady throttle must not machine-gun random pops.
      if (!this.useRecording && this.lastThrottle - load > .5 && rpmN > .4 && t - this.crackleAt > .35) {
        this.crackleAt = t; this.crackle();
      }
      this.lastThrottle = load;
    },
