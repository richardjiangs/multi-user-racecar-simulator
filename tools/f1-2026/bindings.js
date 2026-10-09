(function(){
 const a=window.__Track2App,s=a.state,p=a.f1ArtProfile;
 const action={neutral:()=>a.setGear('N'),pit:()=>a.togglePit(),box:()=>a.pitInOut(),radio:()=>a.teamRadio(),mode:()=>a.cycleMode(),up:()=>a.paddleUp(),down:()=>a.paddleDown(),display:()=>document.getElementById('dataBtn').click(),ignition:()=>a.setIgnition(!s.ignition),strat:()=>a.cycleStrat(),bias:()=>a.cycleBias(),hybrid:()=>a.toggleFuel(),drink:()=>a.setToggle('heat'),cool:()=>a.setToggle('cool')};
 const held=new Map();
 document.querySelectorAll('[data-wheel-action]').forEach(e=>{const key=e.dataset.wheelAction;
  if(key==='aero'||key==='override'){
   const code=key==='aero'?'KeyX':'KeyV';
   e.addEventListener('pointerdown',ev=>{ev.preventDefault();e.setPointerCapture(ev.pointerId);s.keys[code]=true;held.set(ev.pointerId,code);});
   for(const type of ['pointerup','pointercancel','lostpointercapture'])e.addEventListener(type,ev=>{s.keys[code]=false;held.delete(ev.pointerId);});
   e.addEventListener('keydown',ev=>{if(ev.key===' '||ev.key==='Enter'){ev.preventDefault();s.keys[code]=true;}});
   e.addEventListener('keyup',ev=>{if(ev.key===' '||ev.key==='Enter')s.keys[code]=false;});e.addEventListener('blur',()=>{s.keys[code]=false;});
  }else{e.addEventListener('click',()=>action[key]?.());e.addEventListener('keydown',ev=>{if(ev.key===' '||ev.key==='Enter'){ev.preventDefault();action[key]?.();}});}
 });
 window.addEventListener('blur',()=>{for(const code of held.values())s.keys[code]=false;held.clear();});
 const update=a.updateUi;
 a.updateUi=(...args)=>{update(...args);const e=id=>document.getElementById(id),put=(id,v)=>{if(e(id))e(id).textContent=v;};
  put('f1WheelEnergy',Math.round(s.ersStore*100)+'%');put('f1WheelDeploy',Math.round(s.mguKPowerKw||0)+' kW');put('f1WheelStrategy',s.inPitLane?'PIT '+s.pitLimitKmh:s.xMode?'X MODE':s.strat.toUpperCase());
  const opacity=(id,v)=>{if(e(id))e(id).style.opacity=String(v);};
  opacity('cabinWheelG',s.doors.driver?.12:1);if(e('cabinWheelG'))e('cabinWheelG').style.pointerEvents=s.doors.driver?'none':'auto';
  opacity('f1Harness',s.harness?1:.35);opacity('f1Headrest',s.doors.passenger?0:1);
  opacity('f1LiveDisplay',s.ignition?(s.ambient?1:.75):0);opacity('f1DrinkTube',s.heat?.9:.2);opacity('f1VentAir',s.cool?.9:.15);
  opacity('f1RainLight',s.lights&&Math.floor(s.time*6)%2===0?1:.16);opacity('exHeadrest',s.doors.passenger?.12:1);opacity('exSteeringWheel',s.doors.driver?.12:1);
  if(e('f1Pedals'))e('f1Pedals').setAttribute('transform','translate(0 '+s.frontRecline*.6+')');
  if(e('f1TurboRotor'))e('f1TurboRotor').setAttribute('transform','rotate('+(s.ignition?s.time*(260+s.boostBar*4000)%360:0)+')');
  document.querySelectorAll('.f1WheelSpin').forEach(n=>n.setAttribute('transform','rotate('+(s.distanceM/.345*180/Math.PI%360)+')'));
  if(e('cabRevSegs')){e('cabRevSegs').style.opacity=s.ignition&&s.shifterLight?'1':'.18';const N=e('cabRevSegs').children.length;[...e('cabRevSegs').children].forEach((n,i)=>n.setAttribute('fill',s.rpm/a.SPEC.redlineRpm>(i+1)/(N+2)?(i<N*.34?'#4fe6a6':i<N*.67?'#e75349':'#829dff'):'#253934'));}
  document.documentElement.style.setProperty('--wing-deg',(s.xMode?12:12+s.aeroDeploy*26)+'deg');document.documentElement.style.setProperty('--flap-deg',(s.xMode?0:s.frontFlap*22)+'deg');
  if(s.pitMenuOpen){document.querySelector('.pm-title').textContent=p.mark+(s.realMode?' PIT STOP — repairs & tyres':' PIT STOP — practice service');put('pmFix',a.pitPlan().text);}
 };
})();
