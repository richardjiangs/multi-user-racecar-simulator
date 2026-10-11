/* Shared surface samples for the prebuilt rally mesh and vehicle. No terrain
   is generated during driving; every height comes from the loaded route. */
(function(){
 const a=window.__Track2App,s=a.state,C=a.clamp;
 const types={
  piste:{surf:'Hard sandy piste',grip:.82,rough:.20,color:'#b29a74',dune:0},
  gravel:{surf:'Gravel piste',grip:.78,rough:.32,color:'#978c77',dune:0},
  wadi:{surf:'Dry wadi · stones',grip:.74,rough:.49,color:'#96856e',dune:0},
  rock:{surf:'Rocky ground',grip:.72,rough:.59,color:'#8e8070',dune:0},
  canyon:{surf:'Rock canyon',grip:.75,rough:.43,color:'#ab8462',dune:0},
  sand:{surf:'Sandy piste',grip:.67,rough:.23,color:'#c4a675',dune:.35},
  dunes:{surf:'Dune field',grip:.61,rough:.16,color:'#d5b47c',dune:1},
  fesh:{surf:'Fesh-fesh · buried rocks',grip:.63,rough:.54,color:'#baa38a',dune:0},
  salt:{surf:'Chott · salt flat',grip:.76,rough:.10,color:'#cecab6',dune:0},
  grove:{surf:'Acacia grove · winding piste',grip:.76,rough:.30,color:'#a49576',dune:0},
  coast:{surf:'Coastal gravel',grip:.78,rough:.22,color:'#b8ab8c',dune:0},
  transfer:{surf:'Neutralised paved transfer',grip:1,rough:.035,color:'#54595a',dune:0}
 };
 function sector(d,t=a.trackModel()) {if(t?.terrain!=='rally')return null;const v=t.sectors;let lo=0,hi=v.length;while(lo+1<hi){const m=(lo+hi)>>1;if(v[m][0]<=d)lo=m;else hi=m;}return {kind:v[lo][1],...types[v[lo][1]]};}
 // Fixed, band-limited road relief. The renderer exports the same 3 m stations.
 function relief(d,n=0,t=a.trackModel()){
  if(t?.terrain!=='rally')return 0;
  const step=t.L/Math.ceil(t.L/3),q=C(d,0,t.L)/step,i=Math.min(Math.floor(q),Math.ceil(t.L/3)-1),u=q-i;
  const knot=D=>{const A=sector(Math.max(0,D-12),t).rough,B=sector(Math.min(t.L,D+12),t).rough,r=(A+B)*.5;
   const broad=.17*Math.sin(D*.097+.7*Math.sin(D*.013))+.095*Math.sin(D*.251+.4)+.038*Math.sin(D*.51+1.8),cross=.013*Math.sin(D*.17+.9)+.007*Math.sin(D*.39);
   return r*(broad+n*cross);};
  return knot(i*step)*(1-u)+knot((i+1)*step)*u;
 }
 function step(dt){const t=a.trackModel();if(t?.terrain!=='rally')return false;const d=s.distanceM,v=Math.abs(s.speedMps),terr=sector(d),p=a.trackAt(d),slope=p.grade;
  a.rallyWeatherStep?.(dt);
  const wb=a.track2Vehicle?.wheelbase||3,tw=(a.track2Vehicle?.halfWidth||1)*1.8,n=s.laneOffset||0;
  const wheel=[relief(d+wb/2,n-tw/2),relief(d+wb/2,n+tw/2),relief(d-wb/2,n-tw/2),relief(d-wb/2,n+tw/2)],mean=wheel.reduce((x,y)=>x+y,0)/4;
  let body=s.rallyBody;
  if(!body||Math.abs(d-body.d)>30){body=s.rallyBody={heave:mean,pitch:(wheel[0]+wheel[1]-wheel[2]-wheel[3])/(2*wb),roll:(wheel[1]+wheel[3]-wheel[0]-wheel[2])/(2*tw),vh:0,vp:0,vr:0,d};}
  const spring=(pos,vel,target,omega)=>{const acceleration=omega*omega*(target-body[pos])-1.3*omega*body[vel];body[vel]+=acceleration*dt;body[pos]+=body[vel]*dt;return acceleration;};
  const verticalAccel=spring('heave','vh',mean,10.5);spring('pitch','vp',(wheel[0]+wheel[1]-wheel[2]-wheel[3])/(2*wb),9);spring('roll','vr',(wheel[1]+wheel[3]-wheel[0]-wheel[2])/(2*tw),8.5);body.d=d;
  s.susComp=C((mean-body.heave)/.175,-1,1);s.rallyHeave=C(body.heave-relief(d,n),-.22,.22);s.rallyPitch=C(body.pitch,-.10,.10);s.rallyRoll=C(body.roll,-.09,.09);
  s.duneGrade=slope;s._gradeAccel=-9.81*slope/Math.sqrt(1+slope*slope);
  const normalAccel=v*v*(a.trackAt(d+4).grade-a.trackAt(Math.max(0,d-4)).grade)/8;
  if(!s.airborne&&normalAccel< -9.81&&v>8){s.airborne=true;s._rallyY=p.y;s._rallyVy=v*slope;}
  if(s.airborne){s._rallyVy-=9.81*dt;s._rallyY+=s._rallyVy*dt;if(s._rallyY<=p.y){s.airborne=false;body.vh-=C(Math.abs(s._rallyVy-v*slope)*.18,0,1.6);s._rallyY=p.y;}}
  s.rallyAirHeight=s.airborne?Math.max(0,s._rallyY-p.y):0;
  const load=C(1+verticalAccel/9.81,.35,1.35);let grip=terr.grip*Math.sqrt(load)*(s.rallyWeather?.wetGrip||1);
  s.bogging=terr.grip<.7&&v<7&&s.throttle>.65&&!s.xMode;if(s.bogging)grip*=.8;if(s.airborne)grip*=.05;s.gripMul=C(grip,.03,1.2);return true;
 }
 function begin(dt){if(a.trackModel()?.terrain==='rally')step(dt);else{Object.assign(s,{rallyHeave:0,rallyPitch:0,rallyRoll:0,rallyAirHeight:0,rallyBody:null,rallyWeather:null});}}
 const oldRequest=a.requestPit,oldHeld=a.pitHeld,oldStep=a.pitStep;
 function serviceNear(){const t=a.trackModel();if(t?.terrain!=='rally')return false;return (t.serviceZones||[]).some(([lo,hi])=>Math.abs(s.distanceM-(lo+hi)/2)<38&&Math.abs(s.laneOffset-(a.halfWidthAt(s.distanceM)+11))<9);}
 a.requestPit=()=>{if(a.trackModel()?.terrain!=='rally')return oldRequest();if(!serviceNear()){a.showToast('Assistance is available only at the marked service truck. Stop beside it and request service.','Rally assistance');return true;}if(Math.abs(s.speedMps)>1.5){a.showToast('Stop beside the service truck first.','Rally assistance');return true;}if(!s.rallyService){s.rallyService=s.realMode?12:5;s.rallyServiceRequested=true;a.holdContactPlayer?.();a.showToast(s.realMode?'Crew servicing tyres and repairing damage…':'Practice service in progress…','Rally assistance');}return true;};
 a.pitHeld=()=>oldHeld()||s.rallyService>0;
 a.pitStep=(dt,team)=>{if(a.trackModel()?.terrain!=='rally')return oldStep(dt,team);if(!s.rallyService)return;s.speedMps=0;s.rallyService=Math.max(0,s.rallyService-dt);if(!s.rallyService&&s.rallyServiceRequested){s.rallyServiceRequested=false;if(s.realMode){s.damage=0;s.tyreWear=0;s.retired=false;s.failRisk=0;for(const k of Object.keys(s.sys))s.sys[k]=0;}s.pitStops++;a.showToast('Service complete — check the route before rejoining.','Rally assistance');}};
 Object.assign(a,{rallyTypes:types,rallySector:sector,rallyStep:step,rallyRelief:relief,rallyBegin:begin});
})();
