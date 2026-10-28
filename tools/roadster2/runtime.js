/* Roadster-only rigid-body flight and ground controller. SI units throughout.
   Unpublished mass, force, drag and stored impulse are explicit simulation assumptions;
   they are not claimed Tesla homologation or flight-envelope measurements. */
function installRoadsterRuntime(app){
 const s=app.state,C=app.clamp,doc=document,keys=Object.create(null),G=9.80665,M=app.SPEC.massKg,IMPULSE=300000;
 const angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
 const fresh=()=>({x:0,y:0,z:0,yaw:0,pitch:0,roll:0,vx:0,vy:0,vz:0,alt:0,gas:1,airborne:false,hold:true,holdY:0,positionHold:false,holdX:0,holdZ:0,spinInput:0,landing:false,thrust:0,boost:0,impact:0,rampQ:null,disableOnLand:false,throttleLever:0,yoke:0,yawCommand:0,yawInput:0});
 s.roadster=fresh();s.rocket=false;s.assist=false;
 installRoadsterArt(app);installRoadsterWorld(app);
 const old={};for(const k of['updatePhysics','selectCircuit','resetCar','updateUi','prepareTrack','trackMeshReady','toggleTestDriver','drawMap','setView','toggleDoor'])old[k]=app[k];
 const held=k=>!!(keys[k]||s.keys[k]);
 const flightControls=()=>s.rocket||s.roadster.airborne;
 const ready=()=>s.ignition&&s.harness&&!app.anyDoorOpen()&&(!s.realMode||!s.retired);
 function spawn(){const f=s.roadster=fresh(),t=app.roadsterScene();s.rocket=false;s.trackPack=false;s.distanceM=0;s.speedMps=0;s.laneOffset=0;s.headingRel=0;s.dayPhase=.3;s.testDriver=false;s.padThrottle=0;s.padBrake=0;s.keys=Object.create(null);for(const k in keys)delete keys[k];if(t){Object.assign(f,t.start);f.yaw=t.start.yaw||0;s.distanceM=t.start.z;app.prepareRoadsterWorld();s.rivals=[];s.traffic=[];}else syncGround();app.roadsterRefreshArt();}
 function syncGround(){const f=s.roadster,p=app.worldPose?.()||app.trackAt?.(s.distanceM);if(p){f.x=p.x;f.y=p.y||0;f.z=p.z;f.yaw=(p.psi||0)+s.headingRel;}else{f.x=s.laneOffset;f.z=s.distanceM;f.y=0;f.yaw=s.headingRel;}f.vx=Math.sin(f.yaw)*s.speedMps;f.vz=Math.cos(f.yaw)*s.speedMps;f.vy=0;f.alt=0;f.pitch=0;f.roll=0;}
 app.prepareTrack=name=>app.roadsterScene()?(app.prepareRoadsterWorld(),Promise.resolve()):old.prepareTrack?.(name);
 app.trackMeshReady=()=>app.roadsterScene()?true:(old.trackMeshReady?.()??true);
 app.selectCircuit=name=>{old.selectCircuit(name);spawn();};
 app.resetCar=()=>{old.resetCar();spawn();};
 app.toggleTestDriver=force=>{if(app.roadsterScene()&&!app.roadsterScene().closed){s.testDriver=false;app.showToast('Free driving / flight arena — you control the pedals and heading.');return;}old.toggleTestDriver(force);};
 app.toggleTrackPack=()=>{s.trackPack=!s.trackPack;app.setActive('trackPackBtn',s.trackPack);app.showToast(s.trackPack?'Thrust augment on — hold V for rear cold-gas boost.':'Thrust augment off.');app.roadsterRefreshArt();};
 app.toggleDoor=which=>{if(s.roadster.airborne){app.showToast('Land before opening a door.');return;}old.toggleDoor(which);};
 app.adjustSeat=delta=>{s.yokeReach=C((s.yokeReach||0)+delta*2,-40,40);app.showToast('Yoke reach '+s.yokeReach+' mm. The seats stay fixed.');};
 // New Roadster steering dimensions are unpublished: these are explicit game
 // geometry, separate from the original Roadster service-manual specifications.
 const WHEELBASE=2.75,MAX_STEER=35*Math.PI/180;
 app.roadsterSteerAngle=(input,speed)=>C(input,-1,1)*Math.min(MAX_STEER,Math.atan(1.9*G*WHEELBASE/Math.max(1,speed*speed)));
 app.roadsterTurning={wheelbaseM:WHEELBASE,maxAngleDeg:35,estimated:true};
 function holdPosition(){const f=s.roadster;f.positionHold=true;f.hold=true;f.holdX=f.x;f.holdY=f.y;f.holdZ=f.z;f.pitch=angle(f.pitch);f.leveling=true;f.yoke=0;f.throttleLever=0;f.yawCommand=0;f.yawInput=0;f.landing=false;s.padThrottle=0;}
 function land(){const f=s.roadster;holdPosition();f.landing=true;f.throttleLever=0;f.yoke=0;s.padThrottle=0;app.showToast('Controlled descent — steer toward a clear landing surface.');}
 app.toggleRocket=()=>{const f=s.roadster;if(s.rocket&&f.airborne){land();f.disableOnLand=true;return;}s.rocket=!s.rocket;f.positionHold=false;f.landing=false;f.disableOnLand=false;f.throttleLever=0;f.yoke=0;f.yawCommand=0;s.throttle=0;s.brake=0;s.padThrottle=0;s.padBrake=0;s.testDriver=false;s.adaptiveCruise=false;s.launchArmed=false;s.launchActive=false;
  // A held road key must not survive the change of control scheme.
  for(const k of ['KeyW','KeyS','KeyA','KeyD','KeyP','KeyL','KeyI','KeyO','Tab','ShiftLeft','ShiftRight']){delete keys[k];delete s.keys[k];}
  for(const id of ['throttleSlider','brakeSlider']){const el=doc.getElementById(id);if(el)el.value=0;}
  app.showToast(s.rocket?'Rocket armed. P/L hover; W/S pitch; Tab/Shift adjust the held throttle; arrows steer; I/O rotate in place; F holds position.':'Rocket off — normal driving controls restored.');app.roadsterRefreshArt();};
 function adjustThrottle(delta){if(!flightControls())return;const f=s.roadster;f.throttleLever=C(Math.round((f.throttleLever+delta)*100)/100,0,1);if(delta>0){f.landing=false;f.positionHold=false;}app.roadsterRefreshArt();}
 function action(id){app.audio.init();if(id==='thrust')app.toggleTrackPack();if(id==='rocket')app.toggleRocket();if(id==='hover'){holdPosition();app.showToast('Position hold — braking to this spot, leveling and centering the yoke. I/O rotate in place.');}if(id==='land')land();if(id==='throttleUp')adjustThrottle(.05);if(id==='throttleDown')adjustThrottle(-.05);if(id==='refill'){if(s.roadster.airborne||Math.abs(s.speedMps)>.5){app.showToast('Stop on the ground to refill and service.');return;}s.roadster.gas=1;for(const k in s.sys)s.sys[k]=0;s.damage=0;s.retired=false;app.showToast('Cold gas refilled; ground service complete.');}if(id==='maps'){const gps=doc.querySelector('#gpsMode, [data-gps-mode]');if(app.gps){const modes=['off','mirror','ar','dashboard','line'];app.gps.setMode?.(modes[(modes.indexOf(app.gps.mode)+1)%modes.length]);}else if(gps)gps.click();else doc.querySelector('[data-view="circuit"]')?.click();}if(id==='lights')app.toggleLights();if(id==='horn'){s.horn=true;setTimeout(()=>s.horn=false,250);}if(id==='more')doc.querySelector('.bottombar')?.scrollIntoView({block:'nearest'});if(id==='belt')app.latchHarness(!s.harness);if(id==='ignition')app.setIgnition(!s.ignition);if(id==='drive'){app.closeAllDoors(true);app.latchHarness(true);app.setIgnition(true);app.setGear('G',1);}if(id==='reverse')app.setGear('R');if(id==='neutral')app.setGear('N');if(id==='door')app.toggleDoor('driver');app.roadsterRefreshArt();}
 app.roadsterAction=action;
 // The existing touch throttle slider is the same lever, not a second throttle
 // that could override Tab/Shift. The ordinary road slider is untouched.
 doc.addEventListener('input',e=>{if(!flightControls()||e.target.id!=='throttleSlider')return;e.stopImmediatePropagation();s.padThrottle=0;adjustThrottle(Number(e.target.value)/100-s.roadster.throttleLever);},true);
 doc.addEventListener('click',e=>{const b=e.target.closest('[data-rs-action]');if(b)action(b.dataset.rsAction);});
 let spaceAction=null;
 doc.addEventListener('keydown',e=>{if(e.code==='KeyT')spaceAction=null;if(!e.target.matches('[data-rs-action]'))return;if(e.code==='Enter'){e.preventDefault();if(!e.repeat)action(e.target.dataset.rsAction);}if(e.code==='Space'){e.preventDefault();if(!held('KeyT')&&!e.repeat)spaceAction=e.target;}});
 // A fullscreen chord must not also activate the focused Rocket/landing button.
 doc.addEventListener('keyup',e=>{if(e.code!=='Space')return;const target=spaceAction;spaceAction=null;if(target){e.preventDefault();if(!held('KeyT')&&!s.trackpadSteering)action(target.dataset.rsAction);}});
 const flightCodes=new Set(['Tab','ShiftLeft','ShiftRight','KeyW','KeyS','KeyA','KeyD','KeyI','KeyO','KeyP','KeyL','KeyF','KeyG','KeyV']);
 window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('textarea,select,input:not([type=range]):not([type=checkbox]):not([type=button]),[contenteditable=true]'))return;const captures=e.code==='KeyY'||(flightControls()&&flightCodes.has(e.code))||(s.trackPack&&e.code==='KeyV');if(!captures)return;e.preventDefault();e.stopImmediatePropagation();keys[e.code]=true;if(!e.repeat){app.audio.init();if(e.code==='KeyY')action('rocket');if(flightControls()&&e.code==='Tab')adjustThrottle(.05);if(flightControls()&&(e.code==='ShiftLeft'||e.code==='ShiftRight'))adjustThrottle(-.05);if(s.rocket&&e.code==='KeyF')action('hover');if(s.rocket&&e.code==='KeyG')action('land');}},true);
 // A two-finger horizontal swipe commands heading independently of yoke bank.
 window.addEventListener('wheel',e=>{if(flightControls()&&e.target.id==='throttleSlider'&&!e.ctrlKey){e.preventDefault();e.stopImmediatePropagation();adjustThrottle(-Math.sign(e.deltaY)*.05);return;}if(!flightControls()||e.ctrlKey||e.target.closest?.('#gpsUnit,input,select,textarea,[contenteditable]'))return;const unit=e.deltaMode===1?16:e.deltaMode===2?innerWidth:1,delta=(Math.abs(e.deltaX)<.6&&e.shiftKey?e.deltaY:e.deltaX)*unit;if(Math.abs(delta)<.2)return;e.preventDefault();e.stopImmediatePropagation();s.roadster.yawCommand=C((s.roadster.yawCommand||0)+delta*.004,-1,1);s.trackpadLastInput=s.time;if(s.trackpadSteering){s.touchSteer=s.roadster.yawCommand;doc.documentElement.style.setProperty('--tw-rot',(s.touchSteer*120)+'deg');}},{capture:true,passive:false});
 window.addEventListener('keyup',e=>{if(keys[e.code]){delete keys[e.code];delete s.keys[e.code];e.preventDefault();e.stopImmediatePropagation();}},true);
 window.addEventListener('blur',()=>{for(const k in keys)delete keys[k];for(const k in s.keys)delete s.keys[k];s.padThrottle=s.padBrake=0;s.roadster.yawCommand=0;});
 for(const b of doc.querySelectorAll('[data-rs-hold]')){b.addEventListener('pointerdown',e=>{e.preventDefault();keys[b.dataset.rsHold]=true;if(b.hasPointerCapture?.(e.pointerId)===false){try{b.setPointerCapture(e.pointerId);}catch{}}app.audio.init();});for(const evt of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(evt,()=>delete keys[b.dataset.rsHold]);}
 function hit(dv){const f=s.roadster;f.impact=Math.max(f.impact,C(dv/20,0,1));if(s.realMode&&dv>3.5){const e=.5*M*Math.pow(dv-3.5,2),d=C(e/450000,0,1);s.sys.body=C(s.sys.body+d,0,1);s.sys.susp=C(s.sys.susp+d*.65,0,1);s.damage=Math.max(...Object.values(s.sys));if(s.damage>=1){s.retired=true;s.failCause='impact damage';}}}
 function tank(force,dt){const f=s.roadster;if(!s.realMode)return 1;const required=force*dt/IMPULSE,ratio=required>0?Math.min(1,f.gas/required):1;f.gas=Math.max(0,f.gas-required);return ratio;}
 function inputs(dt){
  const f=s.roadster,flight=flightControls(),target=(held('KeyD')?1:0)-(held('KeyA')?1:0),arrows=(held('ArrowRight')?1:0)-(held('ArrowLeft')?1:0),manualTouch=s.touchActive||s.trackpadSteering;
  if(flight){
   f.yoke=C(f.yoke+target*.7*dt,-1,1);
   f.yawCommand*=Math.exp(-3.8*dt);
   // Trackpad capture and ordinary horizontal swipes use the SAME flight command.
   // Only a finger actively holding the wheel overrides it; fullscreen alone does not.
   f.yawInput=arrows||(s.touchActive?s.touchSteer:f.yawCommand);
   if(s.trackpadSteering&&!s.touchActive){s.touchSteer=f.yawCommand;doc.documentElement.style.setProperty('--tw-rot',(s.touchSteer*120)+'deg');}
  }else f.yawInput=0;
  let st=flight?(f.airborne?f.yoke:f.yawInput):manualTouch?s.touchSteer:target+arrows;
  if(!flight&&app.roadsterScene()&&(s.testDriver||(s.assist&&!target&&!manualTouch))){const look=Math.max(14,Math.abs(s.speedMps)*.9),p=app.trackAt(s.distanceM+look),err=angle(Math.atan2(p.x-f.x,p.z-f.z)-f.yaw);st=C(Math.atan(5.5*Math.sin(err)/look)/app.roadsterSteerAngle(1,s.speedMps),-1,1);}
  s.steer+=(st-s.steer)*(1-Math.exp(-7*dt));
  const throttle=flight?Math.max(f.throttleLever,held('ArrowUp')?1:0):(held('KeyW')||held('ArrowUp')?1:0),brake=held('ArrowDown')||held('Space')&&!held('KeyT')||!flight&&held('KeyS');
  s.brake=C(Math.max(brake?1:0,s.padBrake||0),0,1);s.throttle=ready()?C(Math.max(throttle,s.padThrottle||0),0,1):0;
  if(flight&&s.brake>0)s.throttle=0; // Pedal braking overrides, but never changes, the held lever.
  if(s.testDriver&&app.roadsterScene()?.closed&&!flight){s.throttle=ready()?C((38-s.speedMps)*.2,0,1):0;s.brake=C((s.speedMps-39)*.2,0,1);}
 }
 // The shared-circuit powertrain calls this at its input boundary too. No legacy
 // W/S throttle, Shift gear shift, cruise or autopilot can substitute flight inputs.
 app.roadsterReadInputs=dt=>{if(!flightControls())return false;inputs(dt);return true;};
 function takeoff(){const f=s.roadster;if(!app.roadsterScene()&&!app.trackFrame){if(!f.flightHint){app.showToast('For 3D flight choose a Roadster arena or a Track 2.0 circuit.');f.flightHint=true;}return;}if(!ready()||!s.rocket||(s.realMode&&f.gas<=0))return;if(!app.roadsterScene())syncGround();f.airborne=true;f.hold=true;f.holdY=f.y;f.landing=false;f.vy=held('KeyP')?1:0;f.pitch=held('KeyW')?.08:0;f.y+=.04;s.testDriver=false;}
 app.roadsterFlightPose=()=>s.roadster.airborne?{...s.roadster,psi:s.roadster.yaw,grade:0}:null;
 function constrainSolids(previous){const t=app.roadsterScene(),f=s.roadster;if(!t)return;const bounds=t.solid||[];for(const b of bounds){if(f.y>b.y+b.h||f.y+1.25<b.y)continue;const ex=b.w/2+1,ez=b.l/2+2.3,dx=f.x-b.x,dz=f.z-b.z;if(Math.abs(dx)>=ex||Math.abs(dz)>=ez)continue;const px=ex-Math.abs(dx),pz=ez-Math.abs(dz);if(px<pz){const sign=Math.sign(previous.x-b.x)||Math.sign(dx)||1;f.x=b.x+sign*ex;hit(Math.abs(f.vx));f.vx=-f.vx*.12;}else{const sign=Math.sign(previous.z-b.z)||Math.sign(dz)||1;f.z=b.z+sign*ez;hit(Math.abs(f.vz));f.vz=-f.vz*.12;}s.speedMps=f.vx*Math.sin(f.yaw)+f.vz*Math.cos(f.yaw);}
 if(t.kind==='bridge'&&f.y<70&&f.y>63&&f.z>0&&f.z<t.L&&Math.abs(f.x)>12.6){const side=Math.sign(f.x);f.x=side*12.6;if(f.vx*side>0){hit(Math.abs(f.vx));f.vx=-f.vx*.15;}s.speedMps=f.vx*Math.sin(f.yaw)+f.vz*Math.cos(f.yaw);}}
 function fly(dt){
 const f=s.roadster;inputs(dt);
 const hover=(held('KeyP')?1:0)-(held('KeyL')?1:0),pitchIn=(held('KeyW')?1:0)-(held('KeyS')?1:0),spin=(held('KeyO')?1:0)-(held('KeyI')?1:0);
 if(spin&&!f.positionHold)holdPosition();f.spinInput=spin;
 if(!spin&&(pitchIn||held('ArrowUp')||held('KeyA')||held('KeyD')||Math.abs(f.yawInput)>.02))f.positionHold=false;
 if(pitchIn){f.pitch+=pitchIn*.75*dt;f.hold=false;f.leveling=false;f.landing=false;} // Continuous attitude: no clamp at vertical or inverted.
 if(hover){f.hold=true;f.holdY=f.y;f.landing=false;}
 if(f.leveling||f.landing){f.pitch-=angle(f.pitch)*(1-Math.exp(-2.8*dt));if(Math.abs(angle(f.pitch))<.002){f.pitch=0;f.leveling=false;}}
 f.roll+=(-f.yoke*1.22-f.roll)*(1-Math.exp(-3*dt));
 const ground=app.roadsterSurface(f.x,f.z);f.alt=Math.max(0,f.y-ground);
 const cp=Math.cos(f.pitch),sp=Math.sin(f.pitch),sy=Math.sin(f.yaw),cy=Math.cos(f.yaw),boost=held('KeyV')?1:0,forward=f.positionHold?0:s.throttle*(7+boost*11);
 const speed=Math.hypot(f.vx,f.vz),yawRate=f.positionHold?0:f.yawInput*Math.min(2,speed/WHEELBASE*Math.tan(MAX_STEER),36/Math.max(1,speed));
 // Heading changes from road steering rotate the velocity too. I/O instead use
 // a balanced thruster couple: yaw rotates freely without translating the car.
 const spinRate=spin*1.4;
 let holdAX=0,holdAZ=0;if(f.positionHold){holdAX=(f.holdX-f.x)*2.56-f.vx*3.2;holdAZ=(f.holdZ-f.z)*2.56-f.vz*3.2;const k=Math.min(1,12/Math.max(.001,Math.hypot(holdAX,holdAZ)));holdAX*=k;holdAZ*=k;}

 // Perimeter jets vector hover vertically; rear jets follow the nose. Pitching
 // therefore changes the flight path, while P/L independently command vertical speed.
 const targetVy=f.landing?-C(f.alt*.7,.45,3):hover*6;
 const verticalControl=f.hold||f.landing||hover;
 const vertical=verticalControl?C(G+(targetVy-f.vy)*2.4+(!hover&&!f.landing?C((f.holdY-f.y)*1.3,-4,4):0)-sp*forward,-2.5*G,2.5*G):G;
 const bank=f.positionHold?0:-Math.sin(f.roll)*4.5,brakeAccel=Math.min(16,speed*(s.brake*1.6+(f.landing?.6:0)));
 const force=M*(Math.abs(vertical)+forward+Math.abs(bank)+speed*Math.abs(yawRate)+brakeAccel+Math.hypot(holdAX,holdAZ)+Math.abs(spinRate)*3),available=ready()&&s.rocket?tank(force,dt):0;
 f.thrust=available*C(force/(M*G*3),0,1);f.boost=boost*available;
 // Exact rotation preserves horizontal speed; heading and velocity both respond.
 const turn=yawRate*available*dt,ct=Math.cos(turn),st=Math.sin(turn),vx=f.vx;
 f.vx=vx*ct+f.vz*st;f.vz=f.vz*ct-vx*st;f.yaw=angle(f.yaw+turn+spinRate*available*dt);
 const drag=Math.hypot(f.vx,f.vy,f.vz)*.00055,brakeRate=speed>0?brakeAccel/speed:0;
 f.vx+=(available*(sy*cp*forward+cy*bank+holdAX-f.vx*brakeRate)-f.vx*drag)*dt;
 f.vz+=(available*(cy*cp*forward-sy*bank+holdAZ-f.vz*brakeRate)-f.vz*drag)*dt;
 f.vy+=(available*(vertical+sp*forward)-G-f.vy*(drag+.04))*dt;
 const previous={...f};f.x+=f.vx*dt;f.y+=f.vy*dt;f.z+=f.vz*dt;constrainSolids(previous);
 const surface=app.roadsterSurface(f.x,f.z);if(f.y<=surface&&f.vy<0){hit(-f.vy);f.y=surface;f.vy=0;f.airborne=false;f.positionHold=false;f.spinInput=0;f.pitch=0;f.roll=0;f.yoke=0;f.throttleLever=0;f.landing=false;s.padThrottle=0;if(f.disableOnLand){s.rocket=false;f.disableOnLand=false;}if(!app.roadsterScene()){const n=app.roadsterNearest(f);if(Number.isFinite(n?.d)){s.distanceM=n.d;s.laneOffset=n.n;const p=app.trackAt(n.d);s.headingRel=angle(f.yaw-p.psi);}}}
 if(f.y< -1&&app.roadsterScene()?.kind==='bridge'){hit(Math.abs(f.vy)+10);const damage=s.damage,sys={...s.sys};spawn();if(s.realMode){s.damage=damage;s.sys=sys;}app.showToast('Water landing — recovered to the bridge approach.');return;}
 s.speedMps=Math.hypot(f.vx,f.vz);f.alt=Math.max(0,f.y-surface);s.airborne=f.airborne;}
 function groundStep(dt){const f=s.roadster,t=app.roadsterScene();inputs(dt);const previous={...f},v=s.speedMps,dir=s.gearMode==='R'?-1:s.gearMode==='G'?1:0,boost=(s.trackPack||s.rocket)&&held('KeyV')&&ready()?tank(M*16,dt):0;f.boost=boost;f.thrust=boost*.7;
 const force=Math.min(app.SPEC.peakTorqueNm*app.SPEC.finalDrive/app.SPEC.wheelRadiusM,app.SPEC.peakPowerW/Math.max(10,Math.abs(v)))*s.throttle*(dir?1:0),drag=.5*1.225*.30*2.0*v*Math.abs(v),resistance=Math.abs(v)>.05?(210+M*(s.brake*12+(!s.throttle?1.5:0)))*Math.sign(v):0;let acc=dir*force/M-drag/M-resistance/M+boost*16*(dir||1);if(s.realMode)acc*=C(1-s.damage*.7,.2,1);s.speedMps=C(v+acc*dt,dir<0?-16:0,app.SPEC.topSpeedMps);if(s.brake&&Math.sign(v)!==Math.sign(s.speedMps))s.speedMps=0;
 const delta=app.roadsterSteerAngle(s.steer,v),yawRate=s.speedMps/WHEELBASE*Math.tan(delta);f.yaw=angle(f.yaw+yawRate*dt);f.vx=Math.sin(f.yaw)*s.speedMps;f.vz=Math.cos(f.yaw)*s.speedMps;f.x+=f.vx*dt;f.z+=f.vz*dt;f.y=app.roadsterSurface(f.x,f.z);f.pitch=0;
 const r=t.ramp;if(r&&Math.abs(f.x-r.x)<(r.curved?6:4)&&Math.cos(f.yaw)>.6){if(r.curved){if(f.rampQ!==null||(previous.z<=r.z&&f.z>=r.z)){if(f.rampQ===null)f.rampQ=0;f.rampQ+=Math.abs(s.speedMps)*dt;const a=f.rampQ/22;f.z=r.z+22*Math.sin(a);f.y=r.y+22*(1-Math.cos(a));f.pitch=a;s.speedMps=Math.max(0,s.speedMps-G*Math.sin(a)*dt);if(a>=1.99){f.airborne=true;f.vz=Math.cos(a)*s.speedMps;f.vy=Math.sin(a)*s.speedMps;f.hold=false;f.rampQ=null;}}}else if(f.z>=r.z&&f.z<=r.z+r.length){const q=(f.z-r.z)/r.length;f.y=r.y+r.height*q*q;f.pitch=Math.atan(2*r.height*q/r.length);}else if(previous.z<=r.z+r.length&&previous.z>=r.z&&f.z>r.z+r.length){f.y=r.y+r.height+.01;f.vy=s.speedMps*Math.sin(Math.atan(2*r.height/r.length));f.airborne=true;f.hold=false;}}
 constrainSolids(previous);if(f.y<0&&t.kind==='bridge'){f.airborne=true;f.y=67;f.vy=0;}if(s.rocket&&(held('KeyP')||held('KeyW')&&Math.abs(s.speedMps)>6))takeoff();f.alt=Math.max(0,f.y-app.roadsterSurface(f.x,f.z));s.lateralG=v*yawRate/G;}
 function coordinates(){const t=app.roadsterScene(),f=s.roadster;if(t){let best=Infinity,d=0,n=0;if(t.kind==='tesla'){for(let i=0;i<t.points.length-1;i++){const a=t.points[i],b=t.points[i+1],dx=b[0]-a[0],dz=b[1]-a[1],u=C(((f.x-a[0])*dx+(f.z-a[1])*dz)/(dx*dx+dz*dz),0,1),x=a[0]+dx*u,z=a[1]+dz*u,dist=Math.hypot(f.x-x,f.z-z);if(dist<best){best=dist;d=t.cumulative[i]+Math.hypot(dx,dz)*u;n=((f.x-x)*dz-(f.z-z)*dx)/Math.hypot(dx,dz);}}}else{d=f.z;n=f.x;}s.distanceM=d;s.laneOffset=n;s.headingRel=angle(f.yaw-app.trackAt(d).psi);s.route.remainingM=Math.max(0,t.L-d);s.route.arrived=!t.closed&&d>=t.L;}else if(f.airborne){const n=app.roadsterNearest(f);if(Number.isFinite(n?.d)){s.distanceM=n.d;s.laneOffset=n.n;s.headingRel=angle(f.yaw-app.trackAt(n.d).psi);}}}
 app.updatePhysics=dt=>{const f=s.roadster;f.impact*=Math.exp(-5*dt);if(app.roadsterScene()||f.airborne){if(f.airborne){fly(dt);if(!app.roadsterScene())app.updateRivals?.(dt);}else groundStep(dt);coordinates();s.wheelRotation=(s.wheelRotation+s.speedMps*dt/app.SPEC.wheelRadiusM*180/Math.PI)%360;s.rpm=Math.abs(s.speedMps)/app.SPEC.wheelRadiusM*app.SPEC.finalDrive*60/(2*Math.PI);s.boostBar=C(s.throttle*.8+f.boost*.2,0,1);s.torqueNm=app.SPEC.peakTorqueNm*s.throttle;s.dayPhase=.3;}else{old.updatePhysics(dt);syncGround();f.thrust=0;f.boost=0;if((s.trackPack||s.rocket)&&held('KeyV')&&ready()&&s.gearMode==='G'){const ratio=tank(M*16,dt);s.speedMps=Math.min(app.SPEC.topSpeedMps,s.speedMps+16*ratio*dt);f.thrust=.7*ratio;f.boost=ratio;}if(s.rocket&&(held('KeyP')||held('KeyW')&&Math.abs(s.speedMps)>6))takeoff();}if(!s.realMode)f.gas=1;};
 const audio=app.audio;let bus=null;const oldAudio=audio.update.bind(audio);audio.update=(state,dt)=>{oldAudio(state,dt);if(!bus&&audio.ctx&&audio.master){const ac=audio.ctx,buffer=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),arr=buffer.getChannelData(0);let last=0;for(let i=0;i<arr.length;i++){last=last*.4+(Math.random()*2-1)*.6;arr[i]=last;}const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();src.buffer=buffer;src.loop=true;filter.type='highpass';filter.frequency.value=900;gain.gain.value=0;src.connect(filter).connect(gain).connect(audio.master);src.start();bus={src,filter,gain};}if(bus){const f=s.roadster;bus.gain.gain.setTargetAtTime(f.thrust*.42,audio.ctx.currentTime,.035);bus.filter.frequency.setTargetAtTime(800+f.thrust*1500,audio.ctx.currentTime,.04);}};
 app.roadsterAudioInfo=()=>({active:!!bus,level:bus?.gain.gain.value||0});
 app.updateUi=()=>{old.updateUi();app.el.frontSeatRead.textContent=(s.yokeReach||0)+' mm';if(app.gpsBridge)app.gpsBridge.arDepth=!app.roadsterScene()&&typeof app.trackFrame==='function';app.roadsterRefreshArt();const b=doc.getElementById('trackPackBtn');if(b)b.textContent=s.trackPack?'Thrust augment: ON · Z':'Thrust augment · Z';};
 app.drawMap=()=>{const t=app.roadsterScene();if(!t)return old.drawMap();const canvas=app.el.mapCanvas,c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,p=t.points,xs=p.map(a=>a[0]),zs=p.map(a=>a[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),scale=Math.min((w-80)/(maxX-minX+60),(h-80)/(maxZ-minZ+60)),ox=w/2-(minX+maxX)/2*scale,oy=h/2+(minZ+maxZ)/2*scale;c.fillStyle='#152632';c.fillRect(0,0,w,h);c.lineCap='round';c.lineWidth=Math.max(3,t.half*2*scale);c.strokeStyle='#77828b';c.beginPath();p.forEach(([x,z],i)=>c[i?'lineTo':'moveTo'](ox+x*scale,oy-z*scale));c.stroke();c.fillStyle='#89f9d5';c.beginPath();c.arc(ox+s.roadster.x*scale,oy-s.roadster.z*scale,5,0,7);c.fill();c.fillStyle='#d1e0e2';c.font='12px system-ui';c.fillText(t.name,12,20);};
 app.roadsterModel={massKg:M,gravity:G,storedImpulseNs:IMPULSE,estimated:true};
}
