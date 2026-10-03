/* Mercedes offline circuit model. One arc-length centerline serves physics, map and road.
   XY: TUM racetrack database / OpenStreetMap contributors. Altitude profiles are
   interpolated landmark approximations, not a laser scan. Width profiles are in metres, without the legacy arcade multiplier. */
(function(){
 const app=window.__Track2App,{state,clamp}=app;
 const TAU=Math.PI*2,wrap=(d,L)=>(d%L+L)%L,angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
 const data=TRACK_DATA;
 function profile(keys,s){
  const L=keys[keys.length-1][0];s=wrap(s,L);let i=0;while(i<keys.length-2&&keys[i+1][0]<s)i++;
  const a=keys[i],b=keys[i+1],h=b[0]-a[0],u=(s-a[0])/h;
  // Monotone Hermite: continuous grade without overshoot below a valley/above a crest.
  const slope=j=>{let A,B,C;if(j===0){A=[keys[keys.length-2][0]-L,keys[keys.length-2][1]];B=keys[0];C=keys[1];}else if(j===keys.length-1){A=keys[j-1];B=keys[j];C=[keys[1][0]+L,keys[1][1]];}else{A=keys[j-1];B=keys[j];C=keys[j+1];}const m=(B[1]-A[1])/(B[0]-A[0]),n=(C[1]-B[1])/(C[0]-B[0]);return m*n<=0?0:2*m*n/(m+n);};
  return (2*u**3-3*u*u+1)*a[1]+(u**3-2*u*u+u)*h*slope(i)+(-2*u**3+3*u*u)*b[1]+(u**3-u*u)*h*slope(i+1);
 }
 function rawAt(t,d){const f=wrap(d,t.L)/t.L*t.points.length,i=Math.floor(f),u=f-i,a=t.points[i],b=t.points[(i+1)%t.points.length];return {x:a[0]+(b[0]-a[0])*u,z:a[1]+(b[1]-a[1])*u,y:profile(t.elev,d)};}
 function precise(t,d){const p=rawAt(t,d),a=rawAt(t,d-3),b=rawAt(t,d+3),aa=rawAt(t,d-8),bb=rawAt(t,d+8);p.psi=Math.atan2(b.x-a.x,b.z-a.z);p.k=angle(Math.atan2(bb.x-p.x,bb.z-p.z)-Math.atan2(p.x-aa.x,p.z-aa.z))/8;p.grade=(b.y-a.y)/6;return p;}
 // Cache differential geometry once, rather than evaluating five splines per mesh vertex.
 function sample(t,d){if(!t.samples)t.samples=t.points.map((_,i)=>precise(t,i/t.points.length*t.L));const f=wrap(d,t.L)/t.L*t.samples.length,i=Math.floor(f),u=f-i,a=t.samples[i],b=t.samples[(i+1)%t.samples.length],p={d};for(const k of ['x','z','y','k','grade'])p[k]=a[k]+(b[k]-a[k])*u;p.psi=a.psi+angle(b.psi-a.psi)*u;return p;}
 const current=()=>state.route.active?data[state.route.name]:null;
 function widthAt(d){const t=current();if(!t?.widths)return null;const w=t.widths,ph=wrap(d,t.L);let lo=0,hi=w.length-1;while(hi-lo>1){const m=(hi+lo)>>1;if(w[m][0]<=ph)lo=m;else hi=m;}const u=(ph-w[lo][0])/Math.max(.001,w[hi][0]-w[lo][0]);return 1.2*(w[lo][1]+(w[hi][1]-w[lo][1])*u);}
 function at(d){const t=current();return t?sample(t,d):null;}
 function lateral(p,n){return {...p,x:p.x+Math.cos(p.psi)*n,z:p.z-Math.sin(p.psi)*n};}
  function surfacePoint(d,n=0,lift=0){const p=app.trackAt(d);let bank=0;const t=app.trackModel();
    if(state.route.name==='Nardò Ring'){
      // Parabolic crossfall, 25% maximum outer slope. Use the requested road width.
      const H=app.halfWidthAt(d),u=app.clamp((n+H)/(2*H),0,1);p.y+=.125*(2*H)*(1-u)*(1-u);bank=-.25*(1-u);
    }else if(/Nord|24h/.test(state.route.name)){
      const ph=app.trackWrap(d,t.L),kar=t.labels.find(([s,nm])=>/Karussell/.test(nm)&&Math.abs(ph-s)<95);
      if(kar){const f=Math.cos((ph-kar[0])/95*Math.PI/2),slope=.42*f*f;bank=n>=-5&&n<=4?slope:0;p.y+=app.clamp(n,-5,4)*slope;}
    }
    const v=app.trackLateral(p,n);v.y+=lift;v.bank=bank;return v;
  }

 function surface(d,n=0){const t=current();if(!t)return .1;const s=wrap(d,t.L),name=state.route.name;let r=name==='Nardò Ring'?.022:name==='Circuit de Monaco'?.12:/Nord|24h/.test(name)?.11:.045;
  if(name==='Circuit de Monaco'&&s>1500&&s<2040)r=.035;
  if(/Nord|24h/.test(name)){for(const [pos,label] of t.labels){if(/Karussell/.test(label)&&Math.abs(s-pos)<100)r=.31;else if(/Pflanzgarten|Sprunghügel|Flugplatz/.test(label)&&Math.abs(s-pos)<130)r=Math.max(r,.16);}}
  if(Math.abs(n)>app.halfWidthAt(d)-.7)r=Math.max(r,.35);return r;
 }
 // Pit roads have tangent-matched entry/exit connectors and a dense service straight.
 // This same path supplies the pavement, support height, markers, garages and fences.
 function prepPit(t){if(t.pitGeometry)return t.pitGeometry;
  const [entry,exit,side,limit]=t.pit,L=t.L,span=L-entry+exit,name=state.route.name;
  const ranges={'Circuit de Monaco':[-90,165],'Nürburgring GP':[-280,230],'Nordschleife':[-100,160],'Nürburgring 24h':[-260,200],'Suzuka Circuit':[-70,330],'Silverstone Circuit':[-65,220],'Circuit de Spa-Francorchamps':[-70,220],'Nardò Ring':[-260,70]};
  const [start,end]=ranges[name],half=4.2*1.2,offset=d=>side*(app.halfWidthAt(d)+half+2.6);
  const pitRoad=(d,n)=>{const p=lateral(sample(t,d),n);if(name==='Nardò Ring'){const H=app.halfWidthAt(d),u=clamp((n+H)/(2*H),0,1);p.y+=.25*H*(1-u)**2;}return p;},service=d=>{if(name!=='Nordschleife')return pitRoad(d,offset(d));const a=pitRoad(L+start,offset(L+start)),b=pitRoad(L+end,offset(L+end)),u=(d-L-start)/(end-start),len=Math.hypot(b.x-a.x,b.z-a.z);return{x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u,y:a.y+(b.y-a.y)*u,psi:Math.atan2(b.x-a.x,b.z-a.z),grade:(b.y-a.y)/len};};
  const points=[],append=p=>{const prev=points.at(-1);if(prev&&Math.hypot(p.x-prev.x,p.z-prev.z)<.01)return;p.q=prev?prev.q+Math.hypot(p.x-prev.x,p.z-prev.z):0;points.push(p);};
  function connector(a,b){const len=Math.hypot(b.x-a.x,b.z-a.z),handle=Math.min(len*.34,100),aa={x:a.x+Math.sin(a.psi)*handle,z:a.z+Math.cos(a.psi)*handle,y:a.y+a.grade*handle},bb={x:b.x-Math.sin(b.psi)*handle,z:b.z-Math.cos(b.psi)*handle,y:b.y-b.grade*handle};
   for(let i=0,N=Math.ceil(len/1.4)+8;i<=N;i++){const u=i/N,v=1-u,p={};for(const k of ['x','z','y'])p[k]=v**3*a[k]+3*v*v*u*aa[k]+3*v*u*u*bb[k]+u**3*b[k];append(p);}}
  if(name==='Circuit de Monaco'||name==='Nordschleife'||name==='Circuit de Spa-Francorchamps')connector(sample(t,entry),service(L+start));
  else {append(pitRoad(entry,0));for(let d=entry+1.5;d<L+start;d+=1.5){const u=(d-entry)/(L+start-entry);append(pitRoad(d,offset(d)*u*u*(3-2*u)));}append(service(L+start));}
  const serviceStart=points.at(-1).q;
  for(let d=L+start+1.5;d<L+end;d+=1.5)append(service(d));append(service(L+end));const serviceEnd=points.at(-1).q;
  if(name==='Circuit de Monaco'||name==='Nordschleife')connector(service(L+end),pitRoad(L+exit,0));else for(let d=L+end+1.5;d<L+exit;d+=1.5){const u=(d-L-end)/(exit-end),n=offset(d)*(1-u*u*(3-2*u))**2;append(pitRoad(d,n));}append(pitRoad(L+exit,0));const len=points.at(-1).q;
  return t.pitGeometry={points,length:len,entry,exit,span,side,limit,boxStart:serviceStart+22,boxEnd:serviceEnd-22,limitIn:Math.min(serviceStart,55),limitOut:len-45,half,name:name==='Nardò Ring'?'Test service area':name==='Nordschleife'?'T13 paddock':'Grand Prix pits'};
 }
 function pitNearest(p,min=0,max=Infinity){const pit=prepPit(current());let best={distance:Infinity,q:0};
  // Spatial bins avoid scanning the whole pit on each physics step or mesh vertex.
  if(!pit.grid){pit.grid=new Map();for(let i=0;i<pit.points.length-1;i++){const a=pit.points[i],b=pit.points[i+1];const key=Math.floor((a.x+b.x)/40)+','+Math.floor((a.z+b.z)/40);if(!pit.grid.has(key))pit.grid.set(key,[]);pit.grid.get(key).push(i);}}
  const gx=Math.floor(p.x/20),gz=Math.floor(p.z/20);
  for(let x=gx-1;x<=gx+1;x++)for(let z=gz-1;z<=gz+1;z++)for(const i of pit.grid.get(x+','+z)||[]){const a=pit.points[i],b=pit.points[i+1];if(b.q<min||a.q>max)continue;const dx=b.x-a.x,dz=b.z-a.z,u=clamp(((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz),0,1),v={x:a.x+u*dx,z:a.z+u*dz,y:a.y+(b.y-a.y)*u},dist=Math.hypot(p.x-v.x,p.z-v.z);if(dist<best.distance)best={distance:dist,q:a.q+u*(b.q-a.q),...v};}return best;
 }
 function pitCovers(p,margin=0){const near=pitNearest(p),pit=prepPit(current()),apron=near.q>pit.boxStart-15&&near.q<pit.boxEnd+15;
  if(near.distance>Math.max(pit.half,apron?14:0)+margin||Math.abs(near.y-p.y)>3)return false;
  const at=pitAt(near.q),n=(p.x-at.x)*Math.cos(at.psi)-(p.z-at.z)*Math.sin(at.psi);return n>=-pit.half-margin&&n<=(apron?14:pit.half)+margin;
 }
 function fenceSegments(){const t=current();if(!t)return[];if(t.fences)return t.fences;const name=state.route.name,L=t.L,street=name==='Circuit de Monaco',nords=/Nord|24h/.test(name),ring=name==='Nardò Ring',count=Math.ceil(L/2.5),ds=L/count,out=[];
  for(let i=0;i<count;i++)for(const side of [-1,1]){const d=i*ds,e=(i+1)*ds,wall=street?.9:nords?2.7:ring?1.8:name==='Suzuka Circuit'&&d>4870&&d<4985?.35:12;
   const a=surfacePoint(d,side*(app.halfWidthAt(d)+wall)),b=surfacePoint(e,side*(app.halfWidthAt(e)+wall)),mid={x:(a.x+b.x)/2,z:(a.z+b.z)/2,y:(a.y+b.y)/2};
   if(pitCovers(mid,1.6)||pitCovers(a,1.6)||pitCovers(b,1.6))continue;
   out.push({a,b,top:street?.95:.7,mesh:street,d,side,index:i});
  }
  return t.fences=out;
 }
 function pitAt(q,t=current()) {if(!t)return null;const p=prepPit(t),a=p.points;q=clamp(q,0,p.length);let lo=0,hi=a.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(a[m].q<q)lo=m;else hi=m;}const u=(q-a[lo].q)/Math.max(.001,a[hi].q-a[lo].q),r={};for(const k of ['x','z','y'])r[k]=a[lo][k]+(a[hi][k]-a[lo][k])*u;const aa=a[Math.max(0,lo-2)],bb=a[Math.min(a.length-1,hi+2)];r.psi=Math.atan2(bb.x-aa.x,bb.z-aa.z);r.grade=(bb.y-aa.y)/Math.max(.1,bb.q-aa.q);r.q=q;return r;}
 // The road and pit share a supported floor at merge areas. Crossfall is sampled
 // across the whole lane, so a tyre cannot sink through Nardò's banked entrance.
 function roadNearest(p,heightTolerance=3){const t=current();if(!t.roadGrid){t.roadGrid=new Map();const count=Math.ceil(t.L/3),ds=t.L/count;for(let i=0;i<count;i++){const a=sample(t,i*ds),b=sample(t,(i+1)*ds),key=Math.floor((a.x+b.x)/40)+','+Math.floor((a.z+b.z)/40);if(!t.roadGrid.has(key))t.roadGrid.set(key,[]);t.roadGrid.get(key).push({a,b,d:i*ds,ds});}}
  let best={distance:Infinity};const gx=Math.floor(p.x/20),gz=Math.floor(p.z/20);for(let x=gx-1;x<=gx+1;x++)for(let z=gz-1;z<=gz+1;z++)for(const seg of t.roadGrid.get(x+','+z)||[]){const {a,b,d,ds}=seg;if(Math.abs((a.y+b.y)/2-p.y)>heightTolerance)continue;const dx=b.x-a.x,dz=b.z-a.z,u=clamp(((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz),0,1),dist=Math.hypot(p.x-a.x-u*dx,p.z-a.z-u*dz);if(dist<best.distance){const at=d+u*ds,v=sample(t,at),n=(p.x-v.x)*Math.cos(v.psi)-(p.z-v.z)*Math.sin(v.psi);best={distance:dist,d:at,n,p:v};}}return best;
 }
 function pitSurface(q,n=0,lift=0){const p=pitAt(q),v=lateral(p,n),near=roadNearest(v,state.route.name==='Nordschleife'?30:3);v.bank=0;
  if(Number.isFinite(near.distance)){const H=app.halfWidthAt(near.d),blend=clamp((H+1.4-Math.abs(near.n))/1.4,0,1),road=surfacePoint(near.d,near.n);v.y+=(road.y-v.y)*blend;v.bank=blend*((road.bank||0)*Math.cos(p.psi-road.psi)+road.grade*Math.sin(road.psi-p.psi));}
  v.y+=lift;return v;
 }
 function pitCurvature(q){const a=pitAt(q-5),b=pitAt(q+5);return a&&b?angle(b.psi-a.psi)/10:0;}
 function pitBox(slot=1){const p=prepPit(current());return p.boxStart+(p.boxEnd-p.boxStart)*(slot+.5)/11;}
 function pitEntry(d,n){const t=current();if(!t)return false;const p=prepPit(t),phase=wrap(d-p.entry,t.L);
  if(phase>p.span*.85||Math.abs(n)<app.halfWidthAt(d)*.60)return false;
  const near=pitNearest(lateral(at(d),n),2,p.boxStart);return near.distance<p.half-.2&&near.q>3;
 }
 function worldPose(){if(state.inPitLane)return pitSurface(state.pitQ||0,state.laneOffset);const p=at(state.distanceM);return p?lateral(p,state.laneOffset):null;}
 function pitMotion(dt,dsdt){if(!state.inPitLane)return dsdt;if(pitHeld())return 0;const t=current(),p=prepPit(t),old=state.pitQ||0;state.pitQ=clamp(old+dsdt*dt,0,p.length);const delta=(state.pitQ-old)/p.length*p.span;return delta/dt;}
 function pitHeld(){return state.inPitLane&&(state.pitStage==='box'||state.pitStage==='service');}
 function serviceZone(q,n){const box=pitBox(app.TEAM.slot),p=prepPit(current());return (Math.abs(q-box)<=3&&n>=1.3&&n<=4.5)||(Math.abs(q-box)<=5.5&&n>=p.half-.1&&n<=p.half+8.2);}
 function openService(){state.pitAutoStart=3;state.pitStage='box';state.pitArmed=true;state.pitMenuOpen=true;state.speedMps=0;state.pitFuelAdd=0;state.pitTireSel=state.tyreComp==='soft'?'medium':'soft';app.holdContactPlayer?.();app.showToast('Pit crew ready. Choose tyres; service starts automatically in 3 seconds.','Pit crew');}
 function requestPit(){const p=app.pitModel();if(!p)return false;
  if(state.inPitLane){
   if(state.pitStage==='box'){state.pitMenuOpen=true;return true;}
   if(state.pitStage==='service'){app.showToast(`Repairs in progress · ${Math.ceil(state.pitService)} s remaining.`,'Pit crew');return true;}
   state.pitArmed=true;state.pitStage='enter';app.showToast('Service requested. Stop in the teal your service bay; if you passed it, reverse carefully back to it.','Pit crew');return true;
  }
  return false;
 }
 function leavePit(message){const before=app.contactPose?.()||pitSurface(state.pitQ,state.laneOffset),oldHeading=app.contactPose?.()?.psi??(before.psi+state.headingRel),near=roadNearest(before);
  if(!Number.isFinite(near.distance))return false;
  const t=current(),lap=Math.round((state.distanceM-near.d)/t.L);state.distanceM=lap*t.L+near.d;state.laneOffset=near.n;state.headingRel=angle(oldHeading-near.p.psi);state.inPitLane=false;state.pitStage='';state.pitArmed=false;state.pitMenuOpen=false;
  if(message)app.showToast(message,'Pit Wall');return true;
 }
 function pitStep(dt,TEAM){const t=current();if(!t)return;const p=prepPit(t);state.pitLimitKmh=p.limit;
  if(!state.inPitLane&&pitEntry(state.distanceM,state.laneOffset)){
   const before=lateral(at(state.distanceM),state.laneOffset),nearest=pitNearest(before,0,p.boxStart),near=nearest.q;
   if(nearest.distance>p.half+.2)return;
   const v=pitAt(near),oldHeading=at(state.distanceM).psi+state.headingRel;
   state.pitQ=near;state.pitBase=Math.floor((state.distanceM-p.entry)/t.L)*t.L+p.entry;
   state.distanceM=state.pitBase+near/p.length*p.span;
   state.laneOffset=(before.x-v.x)*Math.cos(v.psi)-(before.z-v.z)*Math.sin(v.psi);state.headingRel=angle(oldHeading-v.psi);
   state.inPitLane=true;if(Object.values(state.sys).some(v=>v>.005)||state.tyreWear>.75)state.pitArmed=true;state.pitStage=state.pitArmed?'enter':'transit';
   app.showToast(`${p.name} · ${p.limit} km/h at the white limiter line. ${state.pitArmed?'Stop at the teal your service bay.':'Stop in the teal your service bay for service, or follow the fast lane to the exit.'}`, 'Pit Wall');
  }
  if(!state.inPitLane)return;
  const q=state.pitQ,box=pitBox(TEAM.slot),err=box-q,pl=p.limit/3.6;
  // Driving out across a grass verge leaves the pit route; it is not an invisible
  // lane constraint or a speed limiter following the car around the circuit.
  if(!pitHeld()&&(state.laneOffset < -p.half-2||state.laneOffset > (q>p.boxStart-15&&q<p.boxEnd+15?16:p.half+2))){if(leavePit('Left the pit lane.'))return;}
  const limit=v=>{state.speedMps=Math.min(state.speedMps,v);app.limitContactSpeed?.(v);};
  // Existing assisted pit service is retained; no teleport to a fixed side of the circuit.
  const boxOffset=state.pitStage==='enter'?3.1*clamp((50-err)/35,0,1):state.pitStage==='box'||state.pitStage==='service'?3.1:3.1*clamp((box+35-q)/35,0,1);
  // The tyres steer through the actual entry and exit. No lateral/heading teleport.
  state.pitTargetOffset=state.pitStage==='transit'?0:boxOffset;
  if(q>=p.limitIn&&q<=p.limitOut)limit(pl);
  if((state.pitStage==='enter'||state.pitStage==='transit')&&serviceZone(q,state.laneOffset)&&Math.abs(state.speedMps)<1.5)openService();
  if(state.pitStage==='enter'){
   if(err>=-2&&err<70&&state.gearMode!=='R')limit(Math.sqrt(Math.max(0,2*12*Math.max(0,err-.4))));
   if(serviceZone(q,state.laneOffset)&&Math.abs(state.speedMps)<1.5)openService();
  }else if(state.pitStage==='box'){state.speedMps=0;state.pitAutoStart-=dt;if(state.pitAutoStart<=0||state.testDriver)app.pitConfirm();}
  else if(state.pitStage==='service'){state.speedMps=0;state.pitService-=dt;if(state.pitService<=0){const s=state.sys;if(state.realMode){state.tyreWear=0;for(const k of Object.keys(s))s[k]=0;state.retired=false;state.failRisk=0;state.damage=0;state.fuelKg=clamp(state.fuelKg+state.pitFuelAdd,0,110);}state._boxCalled=false;app.holdContactPlayer?.();state.tyreComp=state.pitTireSel;state.pitStops++;state.gearMode='G';state.curGear=1;state.pitStage='exit';app.showToast('Released in first. Hold the limiter to the exit line.','Pit crew');}}
  if(q>=p.length-.25&&state.pitStage!=='box'&&state.pitStage!=='service'){
   const pit=pitAt(p.length),road=at(state.distanceM),before=lateral(pit,state.laneOffset),old=pit.psi+state.headingRel;state.laneOffset=(before.x-road.x)*Math.cos(road.psi)-(before.z-road.z)*Math.sin(road.psi);state.headingRel=angle(old-road.psi);state.inPitLane=false;state.pitStage='';state.pitArmed=false;state.pitMenuOpen=false;app.showToast('Pit exit — follow the blend line and check the mirrors.','Pit Wall');
  }
 }
 function rivalPit(r,dt){const t=current();if(!t)return false;const p=prepPit(t),phase=wrap(r.distM,t.L);
  if(!r.pitState&&(r.wantPit||r.limp)&&wrap(phase-p.entry,t.L)<95){r.pitState='in';r.pitQ=0;r.pitBase=Math.floor((r.distM-p.entry)/t.L)*t.L+p.entry;}
  if(!r.pitState)return false;const box=pitBox(r.slot||0),remain=box-(r.pitQ||0),lim=p.limit/3.6;
  if(r.pitState==='in'){r.speedMps=Math.min(lim,Math.sqrt(Math.max(0,24*Math.max(0,remain-.25))));if(remain<1&&remain>=-3){r.speedMps=0;if(r.limp){r.gone=true;r.out=true;return true;}r.pitState='box';r.pitT=(r.pitS||2.6)+(r.needsFix?5.5*(r.fixS||1):0);}}
  else if(r.pitState==='box'){r.speedMps=0;r.pitT-=dt;if(r.pitT<=0){r.wear=0;r.needsFix=false;r.wantPit=false;r.pitState='exit';}}
  else r.speedMps=Math.min(lim,r.speedMps+9*dt);
  r.pitQ=clamp((r.pitQ||0)+r.speedMps*dt,0,p.length);r.distM=r.pitBase+r.pitQ/p.length*p.span;r.lane=r.pitState==='in'?3.1*clamp((50-remain)/35,0,1):r.pitState==='box'?3.1:3.1*clamp((box+35-r.pitQ)/35,0,1);r.brake=r.pitState==='box'?1:0;
  if(r.pitQ>=p.length){r.pitState='';r.pitQ=null;}return true;
 }
 Object.assign(app,{serviceZone,pitHeld,requestPit,pitSurface,roadNearest,pitNearest,pitCovers,fenceSegments,surfacePoint,trackData:data,trackModel:current,trackWidthAt:widthAt,trackAt:at,trackSample:sample,trackSurface:surface,trackLateral:lateral,trackProfile:profile,trackWrap:wrap,trackAngle:angle,pitModel:()=>current()?prepPit(current()):null,pitAt,pitBox,pitEntry,pitMotion,pitStep,pitCurvature,rivalPit,worldPose});
 for(const [name,t] of Object.entries(data)){const c=app.CIRCUITS[name];if(!c)continue;c.dist=t.L;c.corners=t.count||c.corners;c.blurb=`${(t.L/1000).toFixed(3)} km ${name}`;c.track=t.labels.map(([at,name])=>({at,dir:Math.sign(sample(t,at).k)||1,deg:60,len:60,name}));}
})();
