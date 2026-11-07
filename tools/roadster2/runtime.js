/* Roadster-only rigid-body flight and ground controller. SI units throughout.
   Unpublished mass, force, drag and stored impulse are explicit simulation assumptions;
   they are not claimed Tesla homologation or flight-envelope measurements. */
function installRoadsterRuntime(app){
 const s=app.state,C=app.clamp,doc=document,keys=Object.create(null),G=9.80665,M=app.SPEC.massKg,IMPULSE=300000;
 const angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
 // Body axes are the attitude state. Euler angles are only an output for existing
 // cameras/gauges; W/S never adds to a world-space Euler pitch angle.
 const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 const cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const unit3=a=>{const n=Math.hypot(...a);return a.map(v=>v/n);};
 const mixAxes=(a,b,c,t)=>a.map((v,i)=>v*c+b[i]*t);
 function axesFromEuler(f){const sy=Math.sin(f.yaw),cy=Math.cos(f.yaw),sp=Math.sin(f.pitch),cp=Math.cos(f.pitch),sr=Math.sin(f.roll),cr=Math.cos(f.roll);return{right:[cy*cr-sy*sp*sr,cp*sr,-sy*cr-cy*sp*sr],up:[-sy*sp*cr-cy*sr,cp*cr,-cy*sp*cr+sy*sr],forward:[sy*cp,sp,cy*cp],appliedYoke:f.yoke||0};}
 function flightAxes(f){let b=f.bodyAxes;if(!b||b.euler[0]!==f.yaw||b.euler[1]!==f.pitch||b.euler[2]!==f.roll){b=axesFromEuler(f);b.euler=[f.yaw,f.pitch,f.roll];f.bodyAxes=b;}return b;}
 function rotateRoll(b,a){const c=Math.cos(a),t=Math.sin(a),r=b.right,u=b.up;b.right=mixAxes(r,u,c,t);b.up=mixAxes(u,r,c,-t);}
 function rotatePitch(b,a){const c=Math.cos(a),t=Math.sin(a),u=b.up,v=b.forward;b.forward=mixAxes(v,u,c,t);b.up=mixAxes(u,v,c,-t);}
 function rotateVector(v,n,a){const c=Math.cos(a),t=Math.sin(a),d=dot3(n,v),cross=cross3(n,v);return v.map((x,i)=>x*c+cross[i]*t+n[i]*d*(1-c));}
 function rotateSteering(b,a){const c=Math.cos(a),t=Math.sin(a),r=b.right,v=b.forward;b.forward=mixAxes(v,r,c,t);b.right=mixAxes(r,v,c,-t);}
 function levelingRotation(f,b){
  const target=f.landing?[0,1,0]:f.neutralUp,axis=cross3(b.up,target),sn=Math.hypot(...axis),cos=C(dot3(b.up,target),-1,1);
  // Opposite up vectors have no unique shortest axis. Roll about the nose in
  // that one case; never unwind ambiguous Euler pitch/roll after a backflip.
  return{axis:sn>1e-10?axis.map(v=>v/sn):b.forward,angle:Math.atan2(sn,cos)};
 }
 // Pitch changes the flight path as well as the nose. Apply its shortest
 // rotation to momentum; pure roll leaves the nose and trajectory unchanged.
 function turnFlightVelocity(v,from,to){
  const axis=cross3(from,to),sn=Math.hypot(...axis);if(sn<1e-10)return v.slice();
  const n=axis.map(x=>x/sn),a=Math.atan2(sn,C(dot3(from,to),-1,1)),c=Math.cos(a),t=Math.sin(a),nv=dot3(n,v),cross=cross3(n,v);
  return v.map((x,i)=>x*c+cross[i]*t+n[i]*nv*(1-c));
 }
 function saveAxes(f,b){
  // Re-orthogonalize to prevent drift after repeated simultaneous loops and rolls.
  b.forward=unit3(b.forward);b.up=unit3(cross3(b.forward,b.right));b.right=unit3(cross3(b.up,b.forward));
  const near=(v,ref)=>ref+angle(v-ref),h=Math.hypot(b.forward[0],b.forward[2]);let y,p,r;
  if(h>1e-8){y=Math.atan2(b.forward[0],b.forward[2]);p=Math.atan2(b.forward[1],h);r=Math.atan2(b.right[1],b.up[1]);
   const candidates=[[y,p,r],[y+Math.PI,Math.PI-p,r+Math.PI]].map(v=>v.map((x,i)=>near(x,[f.yaw,f.pitch,f.roll][i])));
   candidates.sort((a,b)=>a.reduce((n,v,i)=>n+(v-[f.yaw,f.pitch,f.roll][i])**2,0)-b.reduce((n,v,i)=>n+(v-[f.yaw,f.pitch,f.roll][i])**2,0));[y,p,r]=candidates[0];
  }else{y=f.yaw;p=near(Math.sign(b.forward[1])*Math.PI/2,f.pitch);const base=axesFromEuler({yaw:y,pitch:p,roll:0});r=near(Math.atan2(dot3(b.right,base.up),dot3(b.right,base.right)),f.roll);}
  f.yaw=angle(y);f.pitch=p;f.roll=r;b.euler=[f.yaw,f.pitch,f.roll];f.bodyAxes=b;
 }
 function commandedAxes(f,b,rollDelta,pitchDelta,dt,scale){
  if(f.leveling||f.levelingRoll||f.landing){const correction=levelingRotation(f,b),k=Math.exp(-2.8*dt*scale),a=correction.angle*(1-k),out={appliedYoke:b.appliedYoke*k};for(const key of['right','up','forward'])out[key]=rotateVector(b[key],correction.axis,a);return out;}
  const out={right:[...b.right],up:[...b.up],forward:[...b.forward],appliedYoke:b.appliedYoke+(-rollDelta*180/Math.PI)*scale};
  rotateRoll(out,rollDelta*scale);rotatePitch(out,pitchDelta*scale);return out;
 }
 // The eye rotates about the cabin's center, rather than rotating a flat image.
 app.roadsterEyePose=(f,height=1.05)=>{if(!f.airborne&&!f.rampContact)return{x:f.x,y:f.y+height,z:f.z};const u=axesFromEuler(f).up,arm=height-.55;return{x:f.x+u[0]*arm,y:f.y+.55+u[1]*arm,z:f.z+u[2]*arm};};
 app.roadsterAttitudeInfo=()=>{const f=s.roadster,b=flightAxes(f);return{right:[...b.right],up:[...b.up],forward:[...b.forward],yoke:f.yoke,appliedYoke:b.appliedYoke,eye:app.roadsterEyePose(f)};};

 const fresh=()=>({x:0,y:0,z:0,yaw:0,pitch:0,roll:0,rollRate:0,levelingRoll:false,neutralUp:[0,1,0],vx:0,vy:0,vz:0,alt:0,gas:1,airborne:false,hold:true,holdY:0,positionHold:false,holdX:0,holdZ:0,spinInput:0,rearJet:false,roadSwipeIdle:1,waterContact:false,landing:false,thrust:0,boost:0,impact:0,rampContact:null,gripForce:0,normalForce:0,disableOnLand:false,throttleLever:0,yoke:0,yawCommand:0,yawInput:0});
 s.roadster=fresh();s.rocket=false;s.assist=false;
 installRoadsterArt(app);installRoadsterWorld(app);
 const old={};for(const k of['updatePhysics','selectCircuit','resetCar','updateUi','prepareTrack','trackMeshReady','toggleTestDriver','drawMap','setView','toggleDoor'])old[k]=app[k];
 const held=k=>!!(keys[k]||s.keys[k]);
 const flightControls=()=>s.rocket;
 const ready=()=>s.ignition&&s.harness&&!app.anyDoorOpen()&&(!s.realMode||!s.retired);
 function spawn(){const f=s.roadster=fresh(),t=app.roadsterScene();s.rocket=false;s.trackPack=false;s.distanceM=0;s.speedMps=0;s.laneOffset=0;s.headingRel=0;s.dayPhase=.3;s.testDriver=false;s.padThrottle=0;s.padBrake=0;s.keys=Object.create(null);for(const k in keys)delete keys[k];if(t){Object.assign(f,t.start);f.yaw=t.start.yaw||0;s.distanceM=t.start.z;app.prepareRoadsterWorld();s.rivals=[];s.traffic=[];}else syncGround();app.roadsterRefreshArt();}
 function syncGround(){const f=s.roadster,p=app.worldPose?.()||app.trackAt?.(s.distanceM);if(p){f.x=p.x;f.y=p.y||0;f.z=p.z;f.yaw=(p.psi||0)+s.headingRel;}else{f.x=s.laneOffset;f.z=s.distanceM;f.y=0;f.yaw=s.headingRel;}f.vx=Math.sin(f.yaw)*s.speedMps;f.vz=Math.cos(f.yaw)*s.speedMps;f.vy=0;f.alt=0;f.pitch=0;f.roll=0;f.rollRate=0;f.levelingRoll=false;f.neutralUp=[0,1,0];f.bodyAxes=null;}
 app.prepareTrack=name=>app.roadsterScene()?(app.prepareRoadsterWorld(),Promise.resolve()):old.prepareTrack?.(name);
 app.trackMeshReady=()=>app.roadsterScene()?true:(old.trackMeshReady?.()??true);
 app.selectCircuit=name=>{old.selectCircuit(name);spawn();};
 app.resetCar=()=>{old.resetCar();spawn();};
 app.toggleTestDriver=force=>{if(app.roadsterScene()&&!app.roadsterScene().closed){s.testDriver=false;app.showToast('Free driving / flight arena — you control the pedals and heading.');return;}old.toggleTestDriver(force);};
 app.roadsterDownforce=()=>s.trackPack&&s.ignition&&(!s.realMode||!s.retired);
 app.toggleTrackPack=()=>{s.trackPack=!s.trackPack;if(s.trackPack){s.roadster.hold=false;s.roadster.positionHold=false;s.roadster.landing=false;}app.setActive('trackPackBtn',s.trackPack);app.showToast(s.trackPack?'Downforce ON — surface grip; flight lift is disabled. Press Z to release.':'Downforce OFF — Y arms flight; V toggles the separate rear jet.');app.roadsterRefreshArt();};
 function toggleRearJet(){s.roadster.rearJet=!s.roadster.rearJet;app.showToast(s.roadster.rearJet?'Rear jet ON — press V again to switch off.':'Rear jet OFF.');app.roadsterRefreshArt();}
 app.toggleDoor=which=>{if(s.roadster.airborne){app.showToast('Land before opening a door.');return;}old.toggleDoor(which);};
 app.adjustSeat=delta=>{s.yokeReach=C((s.yokeReach||0)+delta*2,-40,40);app.showToast('Yoke reach '+s.yokeReach+' mm. The seats stay fixed.');};
 // New Roadster steering dimensions are unpublished: these are explicit game
 // geometry, separate from the original Roadster service-manual specifications.
 const WHEELBASE=2.75,MAX_STEER=35*Math.PI/180;
 app.roadsterSteerAngle=(input,speed)=>C(input,-1,1)*Math.min(MAX_STEER,Math.atan((app.roadsterDownforce()?3.9:1.9)*G*WHEELBASE/Math.max(1,speed*speed)));
 app.roadsterTurning={wheelbaseM:WHEELBASE,maxAngleDeg:35,estimated:true};
 function holdPosition(level=true){if(s.trackPack)return;const f=s.roadster;if(f.rampContact){if(s.trackPack)return;app.roadsterRampContact.release();}f.positionHold=true;f.hold=true;f.holdX=f.x;f.holdY=f.y;f.holdZ=f.z;if(level){f.leveling=true;f.levelingRoll=true;f.yoke=0;}f.throttleLever=0;f.yawCommand=0;f.yawInput=0;f.landing=false;s.padThrottle=0;}
 function recenterYoke(){const f=s.roadster,b=flightAxes(f);f.yoke=0;b.appliedYoke=0;f.neutralUp=[...b.up];f.leveling=false;f.levelingRoll=false;f.landing=false;f.rollRate=0;app.roadsterRefreshArt();app.showToast('Yoke centered — this attitude is the new hover neutral. Car orientation and motion unchanged.');}
 function trackUp(f){
  if(f.rampContact)return app.roadsterRampAt(f.rampContact.q,f.x).up;
  if(!app.roadsterScene()&&app.surfacePoint){
   const n=app.roadsterNearest(f);
   if(Number.isFinite(n?.d)){
    const a=app.surfacePoint(n.d-.5,n.n),b=app.surfacePoint(n.d+.5,n.n),l=app.surfacePoint(n.d,n.n-.5),r=app.surfacePoint(n.d,n.n+.5);
    const up=cross3([b.x-a.x,b.y-a.y,b.z-a.z],[r.x-l.x,r.y-l.y,r.z-l.z]);
    if(Math.hypot(...up)>1e-8&&up.every(Number.isFinite))return unit3(up[1]<0?up.map(v=>-v):up);
   }
  }
  return app.roadsterSurfaceInfo(f.x,f.z,f.y).normal;
 }
 function recenterToTrack(){
  const f=s.roadster,b=flightAxes(f),forward=[...b.forward],normal=trackUp(f),d=dot3(normal,forward),projected=normal.map((v,i)=>v-d*forward[i]);
  // Roll only: preserve the complete nose vector, pitch, position and momentum.
  // A vertical nose has no unique road-relative roll zero, so keep its bank.
  const up=Math.hypot(...projected)>1e-8?unit3(projected):[...b.up];
  saveAxes(f,{right:unit3(cross3(up,forward)),up,forward,appliedYoke:0});
  // Use the equivalent canonical attitude so a later touchdown keeps the
  // actual reverse heading after a backflip instead of reviving its old yaw.
  const q=f.bodyAxes,h=Math.hypot(forward[0],forward[2]);
  if(h>1e-8){f.yaw=Math.atan2(forward[0],forward[2]);f.pitch=Math.atan2(forward[1],h);f.roll=Math.atan2(q.right[1],q.up[1]);q.euler=[f.yaw,f.pitch,f.roll];}
  recenterYoke();app.showToast('Yoke centered and roll aligned to the track. Nose direction and motion unchanged; this is the new zero.');
 }
 function land(){const f=s.roadster;if(s.trackPack){f.hold=false;f.positionHold=false;app.showToast('Downforce is seeking the tyre-side surface. Switch Z off for flight landing control.');return;}holdPosition();f.landing=true;f.throttleLever=0;f.yoke=0;s.padThrottle=0;app.showToast('Controlled descent — steer toward a clear landing surface.');}
 app.toggleRocket=()=>{const f=s.roadster;s.rocket=!s.rocket;if(s.rocket)s.trackPack=false;f.hold=false;f.leveling=false;f.levelingRoll=false;f.positionHold=false;f.landing=false;f.disableOnLand=false;f.throttleLever=0;f.yoke=0;if(f.bodyAxes)f.bodyAxes.appliedYoke=0;f.yawCommand=0;s.throttle=0;s.brake=0;s.padThrottle=0;s.padBrake=0;s.steer=0;s.touchSteer=0;s.testDriver=false;s.adaptiveCruise=false;s.launchArmed=false;s.launchActive=false;
  // A held road key must not survive the change of control scheme.
  for(const k of ['KeyW','KeyS','KeyA','KeyD','KeyP','KeyL','KeyI','KeyO','KeyG','KeyF','Digit2','Numpad2','Tab','ShiftLeft','ShiftRight']){delete keys[k];delete s.keys[k];}
  for(const id of ['throttleSlider','brakeSlider']){const el=doc.getElementById(id);if(el)el.value=0;}
  app.showToast(s.rocket?'Rocket armed. P/L hover; W/S pitch; Tab/Shift adjust the held throttle; arrows steer; I/O rotate in place; F holds position.':'Rocket off — normal driving controls restored.');app.roadsterRefreshArt();};
 function adjustThrottle(delta){if(!flightControls())return;const f=s.roadster;f.throttleLever=C(Math.round((f.throttleLever+delta)*100)/100,0,1);if(delta>0){f.landing=false;f.positionHold=false;}app.roadsterRefreshArt();}
 function action(id){app.audio.init();if(id==='thrust')app.toggleTrackPack();if(id==='rearJet')toggleRearJet();if(id==='rocket')app.toggleRocket();if(id==='hover'){holdPosition();app.showToast(s.trackPack?'Release Z downforce before selecting hover.':'Position hold — braking to this spot and returning to the saved neutral. I/O rotate in place.');}if(id==='land')land();if(id==='recenter')recenterYoke();if(id==='recenterTrack')recenterToTrack();if(id==='throttleUp')adjustThrottle(.05);if(id==='throttleDown')adjustThrottle(-.05);if(id==='refill'){if(s.roadster.airborne||Math.abs(s.speedMps)>.5){app.showToast('Stop on the ground to refill and service.');return;}s.roadster.gas=1;for(const k in s.sys)s.sys[k]=0;s.damage=0;s.retired=false;app.showToast('Cold gas refilled; ground service complete.');}if(id==='maps'){const gps=doc.querySelector('#gpsMode, [data-gps-mode]');if(app.gps){const modes=['off','mirror','ar','dashboard','line'];app.gps.setMode?.(modes[(modes.indexOf(app.gps.mode)+1)%modes.length]);}else if(gps)gps.click();else doc.querySelector('[data-view="circuit"]')?.click();}if(id==='lights')app.toggleLights();if(id==='horn'){s.horn=true;setTimeout(()=>s.horn=false,250);}if(id==='more')doc.querySelector('.bottombar')?.scrollIntoView({block:'nearest'});if(id==='belt')app.latchHarness(!s.harness);if(id==='ignition')app.setIgnition(!s.ignition);if(id==='drive'){app.closeAllDoors(true);app.latchHarness(true);app.setIgnition(true);app.setGear('G',1);}if(id==='reverse')app.setGear('R');if(id==='neutral')app.setGear('N');if(id==='door')app.toggleDoor('driver');app.roadsterRefreshArt();}
 app.roadsterAction=action;
 // The existing touch throttle slider is the same lever, not a second throttle
 // that could override Tab/Shift. The ordinary road slider is untouched.
 doc.addEventListener('input',e=>{if(!flightControls()||e.target.id!=='throttleSlider')return;e.stopImmediatePropagation();s.padThrottle=0;adjustThrottle(Number(e.target.value)/100-s.roadster.throttleLever);},true);
 doc.addEventListener('click',e=>{const b=e.target.closest('[data-rs-action]');if(b)action(b.dataset.rsAction);});
 let spaceAction=null;
 doc.addEventListener('keydown',e=>{if(e.code==='KeyT')spaceAction=null;if(!e.target.matches('[data-rs-action]'))return;if(e.code==='Enter'){e.preventDefault();if(!e.repeat)action(e.target.dataset.rsAction);}if(e.code==='Space'){e.preventDefault();if(!held('KeyT')&&!e.repeat)spaceAction=e.target;}});
 // A fullscreen chord must not also activate the focused Rocket/landing button.
 doc.addEventListener('keyup',e=>{if(e.code!=='Space')return;const target=spaceAction;spaceAction=null;if(target){e.preventDefault();if(!held('KeyT')&&!s.trackpadSteering)action(target.dataset.rsAction);}});
 const flightCodes=new Set(['Tab','ShiftLeft','ShiftRight','KeyW','KeyS','KeyA','KeyD','KeyI','KeyO','KeyP','KeyL','KeyF','KeyG','Digit2','Numpad2','KeyV']);
 window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('textarea,select,input:not([type=range]):not([type=checkbox]):not([type=button]),[contenteditable=true]'))return;const captures=e.code==='KeyY'||e.code==='KeyV'||(flightControls()&&flightCodes.has(e.code));if(!captures)return;e.preventDefault();e.stopImmediatePropagation();keys[e.code]=true;if(!e.repeat){app.audio.init();if(e.code==='KeyY')action('rocket');if(e.code==='KeyV')action('rearJet');if(flightControls()&&e.code==='Tab')adjustThrottle(.05);if(flightControls()&&(e.code==='ShiftLeft'||e.code==='ShiftRight'))adjustThrottle(-.05);if(s.rocket&&e.code==='KeyF')action('hover');if(flightControls()&&['KeyG','Digit2','Numpad2'].includes(e.code)){if(held('KeyG')&&(held('Digit2')||held('Numpad2')))action('recenterTrack');else if(e.code==='KeyG')action('recenter');}}},true);
 // A two-finger horizontal swipe commands heading independently of yoke bank.
 window.addEventListener('wheel',e=>{if(flightControls()&&e.target.id==='throttleSlider'&&!e.ctrlKey){e.preventDefault();e.stopImmediatePropagation();adjustThrottle(-Math.sign(e.deltaY)*.05);return;}if((!flightControls()&&!s.trackpadSteering)||e.ctrlKey||e.target.closest?.('#gpsUnit,input,select,textarea,[contenteditable]'))return;const unit=e.deltaMode===1?16:e.deltaMode===2?innerWidth:1,delta=(Math.abs(e.deltaX)<.6&&e.shiftKey?e.deltaY:e.deltaX)*unit;if(Math.abs(delta)<.2)return;e.preventDefault();e.stopImmediatePropagation();if(!flightControls()){s.touchSteer=C(s.touchSteer+delta*.002,-1,1);s.roadster.roadSwipeIdle=0;s.trackpadLastInput=s.time;doc.documentElement.style.setProperty('--tw-rot',(s.touchSteer*120)+'deg');return;}s.roadster.yawCommand=C((s.roadster.yawCommand||0)+delta*.004,-1,1);s.trackpadLastInput=s.time;if(s.trackpadSteering){s.touchSteer=s.roadster.yawCommand;doc.documentElement.style.setProperty('--tw-rot',(s.touchSteer*120)+'deg');}},{capture:true,passive:false});
 window.addEventListener('keyup',e=>{if(keys[e.code]){delete keys[e.code];delete s.keys[e.code];e.preventDefault();e.stopImmediatePropagation();}},true);
 window.addEventListener('blur',()=>{for(const k in keys)delete keys[k];for(const k in s.keys)delete s.keys[k];s.padThrottle=s.padBrake=0;s.roadster.yawCommand=0;});
 for(const b of doc.querySelectorAll('[data-rs-hold]')){b.addEventListener('pointerdown',e=>{e.preventDefault();keys[b.dataset.rsHold]=true;if(b.hasPointerCapture?.(e.pointerId)===false){try{b.setPointerCapture(e.pointerId);}catch{}}app.audio.init();});for(const evt of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(evt,()=>delete keys[b.dataset.rsHold]);}
 function hit(dv){const f=s.roadster;f.impact=Math.max(f.impact,C(dv/20,0,1));if(s.realMode&&dv>3.5){const e=.5*M*Math.pow(dv-3.5,2),d=C(e/450000,0,1);s.sys.body=C(s.sys.body+d,0,1);s.sys.susp=C(s.sys.susp+d*.65,0,1);s.damage=Math.max(...Object.values(s.sys));if(s.damage>=1){s.retired=true;s.failCause='impact damage';}}}
 function tank(force,dt){const f=s.roadster;if(!s.realMode)return 1;const required=force*dt/IMPULSE,ratio=required>0?Math.min(1,f.gas/required):1;f.gas=Math.max(0,f.gas-required);return ratio;}
 function inputs(dt){
  const f=s.roadster,flight=flightControls(),target=(held('KeyD')?1:0)-(held('KeyA')?1:0),arrows=(held('ArrowRight')?1:0)-(held('ArrowLeft')?1:0),manualTouch=s.touchActive||s.trackpadSteering;
  if(flight){
   f.yoke+=target*90*dt; // 90 yoke degrees per second while a key is held; release holds its angle.
   f.yawCommand*=Math.exp(-3.8*dt);
   // Trackpad capture and ordinary horizontal swipes use the SAME flight command.
   // Only a finger actively holding the wheel overrides it; fullscreen alone does not.
   f.yawInput=arrows||(s.touchActive?s.touchSteer:f.yawCommand);
   if(s.trackpadSteering&&!s.touchActive){s.touchSteer=f.yawCommand;doc.documentElement.style.setProperty('--tw-rot',(s.touchSteer*120)+'deg');}
  }else{
   f.yawInput=0;f.yoke=0;
   // The special-world integrator must return the road wheel to center too.
   // Only the Rocket A/D yoke is a persistent degree control.
   f.roadSwipeIdle+=dt;
   if(s.trackpadSteering&&!s.touchActive&&f.roadSwipeIdle>.16){s.touchSteer*=Math.exp(-6.5*dt);if(Math.abs(s.touchSteer)<.003)s.touchSteer=0;doc.documentElement.style.setProperty('--tw-rot',(s.touchSteer*120)+'deg');}
  }
  const manualSteer=C(target+arrows,-1,1);
  // Explicit road keys override a quiet fullscreen touchpad and the assisted line.
  let st=flight?(f.airborne?C(f.yoke/90,-1,1):f.yawInput):manualSteer||(manualTouch?s.touchSteer:0);
  if(!flight&&app.roadsterScene()&&!manualSteer&&!manualTouch&&(s.testDriver||s.assist)){const look=Math.max(14,Math.abs(s.speedMps)*.9),p=app.trackAt(s.distanceM+look),err=angle(Math.atan2(p.x-f.x,p.z-f.z)-f.yaw);st=C(Math.atan(5.5*Math.sin(err)/look)/app.roadsterSteerAngle(1,s.speedMps),-1,1);}
  s.steer+=(st-s.steer)*(1-Math.exp(-7*dt));
  const throttle=flight?Math.max(f.throttleLever,held('ArrowUp')?1:0):(held('KeyW')||held('ArrowUp')?1:0),brake=held('ArrowDown')||held('Space')&&!held('KeyT')||!flight&&held('KeyS');
  s.brake=C(Math.max(brake?1:0,s.padBrake||0),0,1);s.throttle=ready()?C(Math.max(throttle,s.padThrottle||0),0,1):0;
  if(flight&&s.brake>0)s.throttle=0; // Pedal braking overrides, but never changes, the held lever.
  if(s.testDriver&&app.roadsterScene()?.closed&&!flight){s.throttle=ready()?C((38-s.speedMps)*.2,0,1):0;s.brake=C((s.speedMps-39)*.2,0,1);}
 }
 // The shared-circuit powertrain calls this at its input boundary too. No legacy
 // W/S throttle, Shift gear shift, cruise or autopilot can substitute flight inputs.
 app.roadsterReadInputs=dt=>{if(!flightControls())return false;inputs(dt);return true;};
 function takeoff(){const f=s.roadster;if(!app.roadsterScene()&&!app.trackFrame){if(!f.flightHint){app.showToast('For 3D flight choose a Roadster arena or a Track 2.0 circuit.');f.flightHint=true;}return;}if(s.trackPack||!ready()||!s.rocket||(s.realMode&&f.gas<=0))return;if(f.rampContact){app.roadsterRampContact.release();f.hold=held('KeyP')||held('KeyL');f.holdY=f.y;return;}if(!app.roadsterScene())syncGround();f.airborne=true;f.hold=true;f.holdY=f.y;f.landing=false;f.vy=held('KeyP')?1:0;f.pitch=held('KeyW')?.08:0;f.y+=.04;s.testDriver=false;}
 app.roadsterFlightPose=()=>s.roadster.airborne?{...s.roadster,psi:s.roadster.yaw,grade:0}:null;
 function constrainSolids(previous){const t=app.roadsterScene(),f=s.roadster;if(!t)return;const bounds=t.solid||[];for(const b of bounds){if(f.y>b.y+b.h||f.y+1.25<b.y)continue;const ex=b.w/2+1,ez=b.l/2+2.3,dx=f.x-b.x,dz=f.z-b.z;if(Math.abs(dx)>=ex||Math.abs(dz)>=ez)continue;const px=ex-Math.abs(dx),pz=ez-Math.abs(dz);if(px<pz){const sign=Math.sign(previous.x-b.x)||Math.sign(dx)||1;f.x=b.x+sign*ex;hit(Math.abs(f.vx));f.vx=-f.vx*.12;}else{const sign=Math.sign(previous.z-b.z)||Math.sign(dz)||1;f.z=b.z+sign*ez;hit(Math.abs(f.vz));f.vz=-f.vz*.12;}s.speedMps=f.vx*Math.sin(f.yaw)+f.vz*Math.cos(f.yaw);}
 if(t.kind==='bridge'&&f.y<70&&f.y>63&&f.z>0&&f.z<t.L&&Math.abs(previous.x)<14.2&&Math.abs(f.x)>12.6){const side=Math.sign(f.x);f.x=side*12.6;if(f.vx*side>0){hit(Math.abs(f.vx));f.vx=-f.vx*.15;}s.speedMps=f.vx*Math.sin(f.yaw)+f.vz*Math.cos(f.yaw);}}
 function fly(dt){
 const f=s.roadster,body=flightAxes(f);inputs(dt);
 const hover=(held('KeyP')?1:0)-(held('KeyL')?1:0),pitchIn=(held('KeyW')?1:0)-(held('KeyS')?1:0),spin=(held('KeyO')?1:0)-(held('KeyI')?1:0);
 // I/O only rotates: F alone requests braking and a fixed position.
 f.spinInput=spin;
 if(pitchIn||held('ArrowUp')||Math.abs(f.yawInput)>.02)f.positionHold=false;
 if(pitchIn){f.hold=false;f.leveling=false;f.levelingRoll=false;f.landing=false;}
 if(hover){f.hold=true;f.holdY=f.y;f.landing=false;}
 if(held('KeyA')||held('KeyD')){f.leveling=false;f.levelingRoll=false;}
 // The degree yoke rolls about the current nose, then pitch rotates about the
 // resulting body-right axis. At 180 degrees bank, W points toward the ground;
 // at 90 degrees bank it changes direction sideways, not world altitude.
 const speed=Math.hypot(f.vx,f.vy,f.vz);
 // The vectored jets provide up to 36 m/s² for a pitching flight path, the
 // same estimated acceleration ceiling as ordinary flight steering. At high
 // speed a loop has a larger radius, rather than leaving momentum behind.
 const pitchRate=pitchIn*Math.min(.75,36/Math.max(1,speed));
 const rollDelta=-(f.yoke-body.appliedYoke)*Math.PI/180,pitchDelta=pitchRate*dt;
 const requestedRollRate=(f.leveling||f.levelingRoll||f.landing?levelingRotation(f,body).angle*(1-Math.exp(-2.8*dt)):rollDelta)/Math.max(dt,.000001);
 let nextBody=commandedAxes(f,body,rollDelta,pitchDelta,dt,1);
 const ground=app.roadsterSurface(f.x,f.z,f.y);f.alt=Math.max(0,f.y-ground);
 const downforce=app.roadsterDownforce();
 let sp=nextBody.forward[1];const boost=f.rearJet?1:0,forward=f.positionHold||downforce?0:s.throttle*(7+boost*11);
 const yawRate=f.positionHold?0:f.yawInput*Math.min(2,speed/WHEELBASE*Math.tan(MAX_STEER),36/Math.max(1,speed));
 // All flight steering turns toward the car's own right/left about body-up,
 // including at inverted or vertical attitudes. I/O can also rotate at rest.
 const spinRate=spin*Math.min(3,72/Math.max(1,speed));
 let holdAX=0,holdAZ=0;if(f.positionHold){holdAX=(f.holdX-f.x)*2.56-f.vx*3.2;holdAZ=(f.holdZ-f.z)*2.56-f.vz*3.2;const k=Math.min(1,12/Math.max(.001,Math.hypot(holdAX,holdAZ)));holdAX*=k;holdAZ*=k;}

 // Perimeter jets vector hover vertically; rear jets follow the nose. Pitching
 // therefore changes the flight path, while P/L independently command vertical speed.
 const targetVy=f.landing?-C(f.alt*.7,.45,3):hover*6;
 const verticalControl=!downforce&&(f.hold||f.landing||hover);
 const followPitch=!downforce&&!f.positionHold&&!verticalControl;
 const velocity=[f.vx,f.vy,f.vz],pitchedVelocity=followPitch?turnFlightVelocity(velocity,body.forward,nextBody.forward):velocity;
 const pathAccel=Math.hypot(...pitchedVelocity.map((v,i)=>v-velocity[i]))/dt;
 let vertical=verticalControl?C(G+(targetVy-f.vy)*2.4+(!hover&&!f.landing?C((f.holdY-f.y)*1.3,-4,4):0)-sp*forward,-2.5*G,2.5*G):downforce?0:G;
 const brakeAccel=Math.min(16,speed*(s.brake*1.6+(f.landing?.6:0)));
 const force=M*(Math.abs(vertical)+forward+(Math.abs(requestedRollRate)+Math.abs(pitchRate))*3+pathAccel+speed*Math.abs(yawRate+(!f.positionHold?spinRate:0))+brakeAccel+Math.hypot(holdAX,holdAZ)+Math.abs(spinRate)*3),available=ready()&&s.rocket?tank(force,dt):0;
 f.thrust=available*C(force/(M*G*3),0,1);f.boost=forward>0?boost*s.throttle*available:0;
 if(available!==1)nextBody=commandedAxes(f,body,rollDelta,pitchDelta,dt,available);
 if(followPitch){const v=available===1?pitchedVelocity:turnFlightVelocity(velocity,body.forward,nextBody.forward);[f.vx,f.vy,f.vz]=v;}
 f.rollRate=requestedRollRate*available;saveAxes(f,nextBody);
 if(f.leveling||f.levelingRoll||f.landing){f.yoke=nextBody.appliedYoke;const correction=levelingRotation(f,nextBody);if(correction.angle<1e-8&&Math.abs(f.yoke)<1e-6){f.yoke=0;nextBody.appliedYoke=0;f.rollRate=0;f.leveling=false;f.levelingRoll=false;}}
 // Exact 3D rotation preserves speed. Fixed hover rotates only the body;
 // moving turns rotate momentum about the very same body-up axis as the nose.
 const turn=(yawRate+(!f.positionHold?spinRate:0))*available*dt;
 [f.vx,f.vy,f.vz]=rotateVector([f.vx,f.vy,f.vz],nextBody.up,turn);rotateSteering(nextBody,turn+(f.positionHold?spinRate*available*dt:0));saveAxes(f,nextBody);
 sp=nextBody.forward[1];vertical=verticalControl?C(G+(targetVy-f.vy)*2.4+(!hover&&!f.landing?C((f.holdY-f.y)*1.3,-4,4):0)-sp*forward,-2.5*G,2.5*G):downforce?0:G;
 const thrustDirection=[...nextBody.forward];
 const drag=Math.hypot(f.vx,f.vy,f.vz)*.00055,brakeRate=speed>0?brakeAccel/speed:0;
 f.vx+=(available*(thrustDirection[0]*forward+holdAX-f.vx*brakeRate)-f.vx*drag)*dt;
 f.vz+=(available*(thrustDirection[2]*forward+holdAZ-f.vz*brakeRate)-f.vz*drag)*dt;
 // Use the same drag law on all three axes. Extra world-vertical drag made
 // identical full-throttle speed fall and recover once per climb/dive cycle.
 f.vy+=(available*(vertical+sp*forward-f.vy*brakeRate)-G-f.vy*drag)*dt;
 if(downforce){const a=app.roadsterRampContact.attraction()||[0,-2*G,0];f.vx+=a[0]*dt;f.vy+=a[1]*dt;f.vz+=a[2]*dt;}
 // Water dissipates impact speed, then permits a slow sink. Positive hover
 // thrust can lift the car clear; recovery waits until its whole body is under.
 const water=app.roadsterScene()?.kind==='bridge'&&app.roadsterTerrainAt(f.x,f.z).kind==='water';
 const extY=.95*Math.abs(nextBody.right[1])+.68*Math.abs(nextBody.up[1])+2.2*Math.abs(nextBody.forward[1]);
 f.waterContact=water&&f.y+.55-extY<=app.roadsterWaterLevel;
 if(f.waterContact){if(hover<=0){f.hold=false;f.positionHold=false;f.landing=false;}if(f.vy<=.05)f.vy=Math.max(-.5,-.42+(Math.min(0,f.vy)+.42)*Math.exp(-8*dt));f.vx*=Math.exp(-1.8*dt);f.vz*=Math.exp(-1.8*dt);}
 const previous={...f};f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;constrainSolids(previous);app.roadsterRampContact.collide(previous);
 const support=app.roadsterSurfaceInfo(f.x,f.z,previous.y),surface=support.y;if(!f.rampContact&&support.kind!=='water'&&f.y<=surface&&f.vy-f.vx*support.dx-f.vz*support.dz<0){hit(Math.max(0,(-f.vy+f.vx*support.dx+f.vz*support.dz)*support.normal[1]));f.y=surface;f.vy=0;f.airborne=false;f.bodyAxes=null;f.neutralUp=[0,1,0];f.leveling=false;f.positionHold=false;f.spinInput=0;f.pitch=0;f.roll=0;f.rollRate=0;f.levelingRoll=false;f.yoke=0;f.throttleLever=0;f.landing=false;s.padThrottle=0;if(f.disableOnLand){s.rocket=false;f.disableOnLand=false;}if(!app.roadsterScene()){const n=app.roadsterNearest(f);if(Number.isFinite(n?.d)){s.distanceM=n.d;s.laneOffset=n.n;const p=app.trackAt(n.d);s.headingRel=angle(f.yaw-p.psi);}}}
 if(f.waterContact&&f.y+.55+extY<app.roadsterWaterLevel){const damage=s.damage,sys={...s.sys};spawn();if(s.realMode){s.damage=damage;s.sys=sys;}app.showToast('Fully submerged — recovered to the bridge approach.');return;}
 s.speedMps=f.airborne||f.rampContact?Math.hypot(f.vx,f.vy,f.vz):Math.hypot(f.vx,f.vz);f.alt=Math.max(0,f.y-surface);s.airborne=f.airborne;}
 function groundStep(dt){const f=s.roadster,t=app.roadsterScene();inputs(dt);f.gripForce=app.roadsterDownforce()?2*G:0;f.normalForce=M*(G+f.gripForce);const previous={...f},v=s.speedMps,dir=s.gearMode==='R'?-1:s.gearMode==='G'?1:0,boost=f.rearJet&&!s.brake&&ready()?tank(M*16,dt):0;f.boost=boost;f.thrust=boost*.7;
 const force=Math.min(app.SPEC.peakTorqueNm*app.SPEC.finalDrive/app.SPEC.wheelRadiusM,app.SPEC.peakPowerW/Math.max(10,Math.abs(v)))*s.throttle*(dir?1:0),drag=.5*1.225*.30*2.0*v*Math.abs(v),resistance=Math.abs(v)>.05?(210+M*(s.brake*12+(!s.throttle?1.5:0)))*Math.sign(v):0;const terrain=app.roadsterSurfaceInfo(f.x,f.z,f.y+.3),slope=terrain.dx*Math.sin(f.yaw)+terrain.dz*Math.cos(f.yaw);let acc=dir*force/M-drag/M-resistance/M+boost*16*(dir||1)-G*slope/Math.hypot(1,slope);if(s.realMode)acc*=C(1-s.damage*.7,.2,1);s.speedMps=C(v+acc*dt,dir<0?-16:0,app.SPEC.topSpeedMps);if(s.brake&&Math.sign(v)!==Math.sign(s.speedMps))s.speedMps=0;
 const delta=app.roadsterSteerAngle(s.steer,v),yawRate=s.speedMps/WHEELBASE*Math.tan(delta);f.yaw=angle(f.yaw+yawRate*dt);const groundSpeed=s.speedMps/Math.hypot(1,slope);f.vx=Math.sin(f.yaw)*groundSpeed;f.vz=Math.cos(f.yaw)*groundSpeed;f.x+=f.vx*dt;f.z+=f.vz*dt;
 const support=app.roadsterSurfaceInfo(f.x,f.z,previous.y+.3);
 if(support.kind==='water'){f.y=previous.y;f.airborne=true;f.hold=false;f.vy=0;}
 else{f.y=support.y;const tangent=unit3([Math.sin(f.yaw),support.dx*Math.sin(f.yaw)+support.dz*Math.cos(f.yaw),Math.cos(f.yaw)]),right=unit3(cross3(support.normal,tangent));saveAxes(f,{right,up:support.normal,forward:tangent,appliedYoke:f.yoke});f.vx=tangent[0]*s.speedMps;f.vy=tangent[1]*s.speedMps;f.vz=tangent[2]*s.speedMps;}
 if(!s.rocket)f.yoke=0;
 const r=t.ramp;if(r&&Math.abs(f.x-r.x)<(r.curved?6:4)&&Math.cos(f.yaw)>.6){if(r.curved){app.roadsterRampContact.tryEnter(previous);}else if(f.z>=r.z&&f.z<=r.z+r.length){const q=(f.z-r.z)/r.length;f.y=r.y+r.height*q*q;f.pitch=Math.atan(2*r.height*q/r.length);}else if(previous.z<=r.z+r.length&&previous.z>=r.z&&f.z>r.z+r.length){f.y=r.y+r.height+.01;f.vy=s.speedMps*Math.sin(Math.atan(2*r.height/r.length));f.airborne=true;f.hold=false;}}
 constrainSolids(previous);if(!f.rampContact&&s.rocket&&(held('KeyP')||held('KeyW')&&Math.abs(s.speedMps)>6))takeoff();f.alt=Math.max(0,f.y-app.roadsterSurface(f.x,f.z,f.y));s.lateralG=v*yawRate/G;}
 function coordinates(){const t=app.roadsterScene(),f=s.roadster;if(t){let best=Infinity,d=0,n=0;if(t.kind==='tesla'){for(let i=0;i<t.points.length-1;i++){const a=t.points[i],b=t.points[i+1],dx=b[0]-a[0],dz=b[1]-a[1],u=C(((f.x-a[0])*dx+(f.z-a[1])*dz)/(dx*dx+dz*dz),0,1),x=a[0]+dx*u,z=a[1]+dz*u,dist=Math.hypot(f.x-x,f.z-z);if(dist<best){best=dist;d=t.cumulative[i]+Math.hypot(dx,dz)*u;n=((f.x-x)*dz-(f.z-z)*dx)/Math.hypot(dx,dz);}}}else{d=f.z;n=f.x;if(t.kind==='ramp'){const q=f.rampContact?.q??(f.airborne?app.roadsterRampNearest({x:f.x,y:f.y+.55,z:f.z}).q:null);if(q!==null)d=app.roadsterRampGeometry.z+q;}}s.distanceM=d;s.laneOffset=n;s.headingRel=angle(f.yaw-app.trackAt(d).psi);s.route.remainingM=Math.max(0,t.L-d);s.route.arrived=!t.closed&&d>=t.L;}else if(f.airborne){const n=app.roadsterNearest(f);if(Number.isFinite(n?.d)){s.distanceM=n.d;s.laneOffset=n.n;s.headingRel=angle(f.yaw-app.trackAt(n.d).psi);}}}
 installRoadsterRampContact(app,{inputs,held,ready,tank,hit,saveAxes,axesFromEuler,takeoff,mass:M,gravity:G,wheelbase:WHEELBASE});
 app.updatePhysics=dt=>{const f=s.roadster;f.impact*=Math.exp(-5*dt);if(app.roadsterScene()||f.airborne){
  // The custom integrator bypasses the donor physics, including its toast clock.
  // Advance it exactly once here for special roads, ramp contact and free flight.
  if(s.toastTimer>0){s.toastTimer=Math.max(0,s.toastTimer-dt);if(!s.toastTimer)app.el.toast.classList.remove('show');}
  if(f.rampContact){app.roadsterRampContact.step(dt);}else if(f.airborne){fly(dt);if(!app.roadsterScene())app.updateRivals?.(dt);}else groundStep(dt);coordinates();s.wheelRotation=(s.wheelRotation+s.speedMps*dt/app.SPEC.wheelRadiusM*180/Math.PI)%360;s.rpm=Math.abs(s.speedMps)/app.SPEC.wheelRadiusM*app.SPEC.finalDrive*60/(2*Math.PI);s.boostBar=C(s.throttle*.8+f.boost*.2,0,1);s.torqueNm=app.SPEC.peakTorqueNm*s.throttle;s.dayPhase=.3;}else{old.updatePhysics(dt);syncGround();f.thrust=0;f.boost=0;if(f.rearJet&&!s.brake&&ready()&&s.gearMode==='G'){const ratio=tank(M*16,dt);s.speedMps=Math.min(app.SPEC.topSpeedMps,s.speedMps+16*ratio*dt);f.thrust=.7*ratio;f.boost=ratio;}if(s.rocket&&(held('KeyP')||held('KeyW')&&Math.abs(s.speedMps)>6))takeoff();}if(!s.realMode)f.gas=1;};
 const audio=app.audio;let bus=null;const oldAudio=audio.update.bind(audio);audio.update=(state,dt)=>{oldAudio(state,dt);if(!bus&&audio.ctx&&audio.master){const ac=audio.ctx,buffer=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),arr=buffer.getChannelData(0);let last=0;for(let i=0;i<arr.length;i++){last=last*.4+(Math.random()*2-1)*.6;arr[i]=last;}const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();src.buffer=buffer;src.loop=true;filter.type='highpass';filter.frequency.value=900;gain.gain.value=0;src.connect(filter).connect(gain).connect(audio.master);src.start();bus={src,filter,gain};}if(bus){const f=s.roadster;bus.gain.gain.setTargetAtTime(f.thrust*.42,audio.ctx.currentTime,.035);bus.filter.frequency.setTargetAtTime(800+f.thrust*1500,audio.ctx.currentTime,.04);}};
 app.roadsterAudioInfo=()=>({active:!!bus,level:bus?.gain.gain.value||0});
 app.updateUi=()=>{old.updateUi();app.el.frontSeatRead.textContent=(s.yokeReach||0)+' mm';if(app.gpsBridge)app.gpsBridge.arDepth=!app.roadsterScene()&&typeof app.trackFrame==='function';app.roadsterRefreshArt();const b=doc.getElementById('trackPackBtn');if(b)b.textContent=s.trackPack?'Downforce: ON · Z':'Downforce · Z';};
 app.drawMap=()=>{const t=app.roadsterScene();if(!t)return old.drawMap();const canvas=app.el.mapCanvas,c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,p=t.points,xs=p.map(a=>a[0]),zs=p.map(a=>a[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),scale=Math.min((w-80)/(maxX-minX+60),(h-80)/(maxZ-minZ+60)),ox=w/2-(minX+maxX)/2*scale,oy=h/2+(minZ+maxZ)/2*scale;c.fillStyle='#152632';c.fillRect(0,0,w,h);c.lineCap='round';c.lineWidth=Math.max(3,t.half*2*scale);c.strokeStyle='#77828b';c.beginPath();p.forEach(([x,z],i)=>c[i?'lineTo':'moveTo'](ox+x*scale,oy-z*scale));c.stroke();c.fillStyle='#89f9d5';c.beginPath();c.arc(ox+s.roadster.x*scale,oy-s.roadster.z*scale,5,0,7);c.fill();c.fillStyle='#d1e0e2';c.font='12px system-ui';c.fillText(t.name,12,20);};
 app.roadsterModel={massKg:M,gravity:G,storedImpulseNs:IMPULSE,estimated:true};
}
