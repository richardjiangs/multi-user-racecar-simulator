/* Garage/runtime corrections. The archived 1.0 documents remain intact. */
(function(root){
 function install(app,key){
  if(app.vehicleRefinements)return;const s=app.state;app.vehicleRefinements=true;
  const rally=()=>(/Dakar|^Stage \d|^Prologue/i.test(s.route.name)||s.route.env==='rally')||app.trackModel?.()?.terrain==='rally';
  const roster=[['Dacia Sandrider','#c9b78c','#bad000'],['Ford Raptor T1+','#18438c','#f65b19'],['Toyota GR DKR Hilux','#e7e8e7','#e31927'],['Prodrive Hunter','#c21c24','#141820']];
  const seed=app.seedRivals;
  if(seed)app.seedRivals=function(...args){seed.apply(app,args);if(!rally())return;for(const [i,r] of (s.rivals||[]).entries()){const [name,body,stripe]=roster[i%roster.length];Object.assign(r,{name:name+' · '+(201+i),body,stripe,dakar:true,topMps:170/3.6,latG:1.5,accel:8.2});r.speedMps=Math.min(r.speedMps,170/3.6);}};
  if(rally())app.seedRivals?.();
  if(key==='db5'){
   // A route constraint, deliberately not a collision. Keep forward speed and
   // remove only the attempted outward travel. Never snap the viewing heading.
   app.routeBoundaryActive=()=>s.route.active&&!s.stage?.sea&&!/Pacific|Oil Rig|Sea Chase/i.test(s.route.name)&&!s.inPitLane;
   app.constrainRoute=function(){
    if(!app.routeBoundaryActive())return false;
    const hw=app.halfWidthAt(s.distanceM),edge=Math.max(.2,hw-(app.track2Vehicle?.halfWidth||.86)-.25);
    if(Math.abs(s.laneOffset)<=edge)return false;const side=Math.sign(s.laneOffset);
    s.laneOffset=side*edge;
    s.bodyRoll*=.8;s.offTrack=0;return true;
   };
   const physics=app.updatePhysics;app.updatePhysics=function(dt){app.constrainRoute();physics(dt);app.constrainRoute();};
  }
  if(key==='spectre'){
   s.pursuit=[];
   app.startPursuit=function(){if(s.pursuit.length)return;s.pursuit=[0,1].map(i=>({name:'Police patrol',kind:'police',body:'#e7e9ed',stripe:'#d8ed41',gap:38+i*20,lane:(i?1:-1)*1.8,police:true,distM:s.distanceM-38-i*20,speedMps:Math.abs(s.speedMps)}));};
   const physics=app.updatePhysics;app.updatePhysics=function(dt){physics(dt);for(const [i,p] of s.pursuit.entries()){const target=15+i*13;p.gap+=(target-p.gap)*(1-Math.exp(-dt*.12));p.distM=s.distanceM-p.gap;p.speedMps=s.speedMps;p.lane+=(Math.max(-2.5,Math.min(2.5,s.laneOffset+(i?1:-1)*1.4))-p.lane)*(1-Math.exp(-dt*1.3));}};
   const select=app.selectCircuit,reset=app.resetCar;
   app.selectCircuit=function(...args){s.pursuit=[];return select.apply(app,args);};app.resetCar=function(...args){s.pursuit=[];return reset.apply(app,args);};
  }
 }
 root.MUCSVehicleRuntime={install};
})(typeof window==='undefined'?globalThis:window);
