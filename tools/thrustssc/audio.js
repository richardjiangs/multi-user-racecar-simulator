// Spectral resynthesis from the official Run 65 field recording. The supplied
// envelope contains statistics only: no film soundtrack, speech or PCM samples.
function installSSCAudio(app,profile){
 const a=app.audio,s=app.state,jet=s.jet,baseInit=a.init.bind(a);
 const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 function texture(c,seed){
  // Inverse FFT with independent random phases gives a seamless periodic bed.
  // Almost six seconds and independent offsets avoid the short repeating hiss of the
  // old 3-second brown-noise source. Magnitudes follow the measured envelope.
  const N=131072,sr=22050,re=new Float64Array(N),im=new Float64Array(N);
  let random=seed>>>0;const rand=()=>((random=(Math.imul(random,1664525)+1013904223)>>>0)/4294967296);
  const f=profile.frequencies,v=profile.amplitudes;
  let k=0;for(let i=1;i<N/2;i++){
   const hz=i*sr/N;while(k<f.length-2&&f[k+1]<hz)k++;
   const mix=clamp((Math.log(Math.max(hz,f[0]))-Math.log(f[k]))/(Math.log(f[k+1])-Math.log(f[k])),0,1);
   let mag=v[k]*(1-mix)+v[k+1]*mix;
   if(hz<35)mag*=Math.pow(hz/35,2);if(hz>5000)mag*=Math.exp(-(hz-5000)/260);
   const phase=rand()*Math.PI*2;re[i]=mag*Math.cos(phase);im[i]=mag*Math.sin(phase);re[N-i]=re[i];im[N-i]=-im[i];
  }
  for(let i=1,j=0;i<N;i++){let bit=N>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];}}
  for(let len=2;len<=N;len<<=1){const angle=2*Math.PI/len,wr=Math.cos(angle),wi=Math.sin(angle);for(let i=0;i<N;i+=len){let xr=1,xi=0;for(let j=0;j<len/2;j++){const p=i+j,q=p+len/2,tr=xr*re[q]-xi*im[q],ti=xr*im[q]+xi*re[q];re[q]=re[p]-tr;im[q]=im[p]-ti;re[p]+=tr;im[p]+=ti;const next=xr*wr-xi*wi;xi=xr*wi+xi*wr;xr=next;}}}
  const rms=Math.sqrt(re.reduce((sum,n)=>sum+n*n,0)/N),buf=c.createBuffer(1,N,sr),out=buf.getChannelData(0);
  for(let i=0;i<N;i++)out[i]=re[i]/Math.max(1e-9,rms)*.14;
  return buf;
 }
 a.init=function(){
  if(this.ready)return;baseInit();if(!this.ctx)return;const c=this.ctx;
  for(const item of this.oscs||[])try{item.o.stop();}catch{}this.oscs=[];
  this.engineBus.gain.value=0;
  const limiter=c.createDynamicsCompressor();limiter.threshold.value=-9;limiter.knee.value=6;limiter.ratio.value=8;limiter.attack.value=.008;limiter.release.value=.22;limiter.connect(this.master);
  this.sscBus=limiter;this.spey=[0,1].map(i=>{
   const source=c.createBufferSource(),lowpass=c.createBiquadFilter(),gain=c.createGain(),pan=c.createStereoPanner();
   source.buffer=texture(c,19971015+i*197);source.loop=true;lowpass.type='lowpass';lowpass.frequency.value=4800;lowpass.Q.value=.35;gain.gain.value=0;pan.pan.value=i?.32:-.32;
   source.connect(lowpass);lowpass.connect(gain);gain.connect(pan);pan.connect(limiter);source.start(0,i*.713);
   return {source,lowpass,gain,pan};
  });
 };
 a.update=function(){
  if(!this.ready||!this.spey)return;const t=this.ctx.currentTime;
  const target=(param,value,tau=.16)=>param.setTargetAtTime(value,t,tau);
  target(this.engineBus.gain,0);for(const name of ['windGain','roadGain','turboGain'])if(this[name])target(this[name].gain,0);
  const mach=Math.abs(s.speedMps)/340.3,buffet=clamp((mach-.82)/.2,0,1),outside=s.view==='exterior'||s.view==='engine';
  for(let i=0;i<2;i++){
   const e=this.spey[i],n=clamp(jet.n[i],0,1),hot=jet.reheat&&s.throttle>.8&&n>.89;
   // Keep broadband turbulent exhaust dominant. No arbitrary musical oscillators
   // and no simulated Doppler on a camera attached to the vehicle.
   target(e.source.playbackRate,.47+.53*n,.3);
   target(e.lowpass.frequency,jet.canopy||outside?5000:3300+buffet*1500,.2);
   const thrust=clamp(jet.thrust[i]/90000,0,1);
   target(e.gain.gain,s.started?Math.pow(n,1.3)*(.16+.54*thrust+(hot?.17:0)+buffet*.1):0,.18);
  }
  this.telemetry={kind:'Spey-Run65-measured-spectrum',spools:[...jet.n],afterburner:jet.reheat&&s.throttle>.8,transonicBuffet:buffet,reference:profile.recording};
 };
 a.crackle=()=>{};a.blowoff=()=>{};a.blip=()=>{};a.startupFlair=()=>{};
}
