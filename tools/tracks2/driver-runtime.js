/* A geometric driving line, with exit-biased hairpin apexes and a braking envelope.
   This is a simulator driving aid, not recorded F1 telemetry or a fastest-lap claim.
   Planning changes pedals/steering only; the original drivetrain and contacts integrate motion. */
(function(){
 const a=window.__Track2App,s=a.state,C=a.clamp,wrap=a.trackWrap,ang=a.trackAngle;
 let plan=null,serial=0,avoidance=null;
 const smooth=u=>(u=C(u,0,1),u*u*(3-2*u));
 function line(){const t=a.trackModel();if(!t)return null;if(t.drivingLine)return t.drivingLine;
  const N=t.points.length,open=t.closed===false,I=i=>open?C(i,0,N-1):(i%N+N)%N,ds=t.L/(open?N-1:N),at=i=>a.trackSample(t,i*ds),ks=Array.from({length:N},(_,i)=>at(i).k),signs=ks.map(k=>Math.abs(k)>.0018?Math.sign(k):0);
  // Join brief straight patches inside a compound bend, retaining opposite turns.
  for(let i=0;i<N;i++)if(signs[i]===0){let j=1;while(j<6&&!signs[I(i+j)])j++;const prev=signs[I(i-1)];if(j<6&&prev&&signs[I(i+j)]===prev)for(let n=0;n<j;n++)signs[I(i+n)]=prev;}
  const corners=[];let origin=signs.findIndex((v,i)=>v!==signs[I(i-1)]);if(origin<0||open)origin=0;
  for(let step=0;step<N;){const start=origin+step,sign=signs[I(start)];let count=1;while(step+count<N&&signs[I(start+count)]===sign)count++;step+=count;if(!sign)continue;
   const turn=Array.from({length:count},(_,j)=>Math.abs(ks[I(start+j)])*ds).reduce((x,y)=>x+y,0);if(turn<.10||count*ds>t.L*.8)continue;
   const fraction=turn>1.9?.64:.54;let swept=0,apex=start;for(let j=0;j<count;j++){swept+=Math.abs(ks[I(start+j)])*ds;if(swept>=turn*fraction){apex=start+j;break;}}
   corners.push({start:start*ds,end:(start+count)*ds,apex:apex*ds,sign,turn,fraction,lead:C(count*ds*.4,18,65),tail:C(count*ds*.3,18,60)});
  }
  // Visit only the stations influenced by each corner. Long rally routes must
  // not multiply every route station by every bend during their initial load.
  const sums=new Float64Array(N),weights=new Float64Array(N);
  for(const c of corners){const start=c.start-c.lead,end=c.end+c.tail;
   for(let j=Math.ceil(start/ds);j<=Math.floor(end/ds);j++){if(open&&(j<0||j>=N))continue;const i=I(j),d=i*ds,x=j*ds,amplitude=Math.max(0,a.halfWidthAt(d)-2.4)*.78,inside=Math.min(amplitude,.25/Math.max(.001,Math.abs(ks[i])));let n,w;
    if(x<c.start){n=-amplitude;w=smooth((x-start)/c.lead);}else if(x<c.apex){n=-amplitude+(amplitude+inside)*smooth((x-c.start)/(c.apex-c.start));w=1;}else if(x<c.end){n=inside-(amplitude+inside)*smooth((x-c.apex)/(c.end-c.apex));w=1;}else{n=-amplitude;w=1-smooth((x-c.end)/c.tail);}sums[i]+=n*c.sign*w;weights[i]+=w;
   }
  }
  let offsets=Array.from(sums,(v,i)=>weights[i]?v/Math.max(1,weights[i]):0);
  // Smooth steering transitions between linked corners without touching the road.
  for(let pass=0;pass<6;pass++)offsets=offsets.map((v,i)=>(offsets[I(i-2)]+4*offsets[I(i-1)]+6*v+4*offsets[I(i+1)]+offsets[I(i+2)])/16);
  const points=offsets.map((n,i)=>a.trackLateral(at(i),n));
  const curvature=points.map((p,i)=>{const x=points[I(i-2)],z=points[I(i+2)],len=(Math.hypot(p.x-x.x,p.z-x.z)+Math.hypot(z.x-p.x,z.z-p.z))/2;return ang(Math.atan2(z.x-p.x,z.z-p.z)-Math.atan2(p.x-x.x,p.z-x.z))/Math.max(.5,len);});
  const vmax=a.SPEC.topSpeedRecordMps||a.SPEC.topSpeedMps||354/3.6,lat=a.track2Vehicle.f1?21:C(a.SPEC.tractionCoeff*9.81,7.5,21);const speeds=curvature.map((k,i)=>{const terrain=a.rallySector?.(i*ds);return Math.min(vmax,terrain?Math.max(18,52-terrain.rough*36):vmax,Math.sqrt(lat*(terrain?.grip||1)/Math.max(.00001,Math.abs(k))))});
  if(open)speeds[N-1]=0;
  for(let pass=0;pass<3;pass++)for(let i=N-1;i>=0;i--)speeds[i]=Math.min(speeds[i],Math.sqrt(speeds[I(i+1)]**2+2*9*ds));
  return t.drivingLine={offsets,speeds,curvature,corners,N,ds};
 }
 function interpolate(arr,d){const t=a.trackModel(),open=t.closed===false,f=a.trackPhase(t,d)/t.L*(open?arr.length-1:arr.length),i=open?Math.min(arr.length-2,Math.floor(f)):Math.floor(f);return arr[i]+(arr[(i+1)%arr.length]-arr[i])*(f-i);}
 function offset(d){return interpolate(line().offsets,d);}
 function laneSpeed(d){return interpolate(line().speeds,d);}
 function descriptor(r){const player=!r,pit=player?s.inPitLane:!!r.pitState,d=player?s.distanceM:r.distM,n=player?s.laneOffset:r.lane,v=player?s.speedMps:r.speedMps,q=player?s.pitQ:r.pitQ;
  const p=a.contactPose?.(r)|| (pit?a.trackLateral(a.pitAt(q||0),n):a.surfacePoint(d,n));return {r,player,pit,d,n,v:Math.max(0,v),q:q||0,p};}
 function neighbours(self){const actors=[...(s.raceGrid?s.rivals:[]).filter(r=>!r.gone&&!r.dns&&r!==self.r)];if(!self.player)actors.push(null);const L=a.trackModel().L,out=[];
  for(const r of actors){const o=descriptor(r);let gap,n;
   if(o.pit===self.pit){gap=self.pit?o.q-self.q:(a.trackModel().closed===false?o.d-self.d:wrap(o.d-self.d+L/2,L)-L/2);n=o.n;}
   else {const near=self.pit?a.pitNearest(o.p):a.roadNearest(o.p);if(!Number.isFinite(near.distance)||near.distance>22)continue;const p=self.pit?a.pitAt(near.q):a.trackAt(near.d);n=(o.p.x-p.x)*Math.cos(p.psi)-(o.p.z-p.z)*Math.sin(p.psi);gap=self.pit?near.q-self.q:(a.trackModel().closed===false?near.d-self.d:wrap(near.d-self.d+L/2,L)-L/2);}
   if(gap> -35&&gap<500)out.push({...o,gap,n});
  }return out;
 }
 function traffic(self,wanted,cap){const nearby=neighbours(self),half=self.pit?a.pitModel().half:a.halfWidthAt(self.d),edge=half-1.7;let n=C(wanted,-edge,edge),blocked=false;
  // Steering-only assist must plan a pass before reaching the slower car;
  // it cannot rely on the Test Driver's longitudinal braking envelope.
  if(self.player&&s.assist&&!s.testDriver&&!s.adaptiveCruise&&!self.pit){
   const held=avoidance&&avoidance.route===s.route.name&&nearby.find(o=>o.r===avoidance.car&&o.gap> -14&&o.gap<170);
   const lead=held||nearby.filter(o=>o.gap>0&&o.gap<Math.max(40,(self.v-o.v)*3.3+20)&&Math.abs(o.n-self.n)<3.2).sort((x,y)=>x.gap-y.gap)[0];
   if(lead){const time=C((lead.gap-8)/Math.max(1,self.v-lead.v),.4,3),margin=3.25;
    const options=[lead.n-margin,lead.n+margin].filter(x=>Math.abs(x)<=edge&&nearby.every(o=>o===lead||Math.abs(o.n-x)>margin||Math.abs(o.gap+(o.v-self.v)*time)>15));
    if(options.length){n=options.reduce((best,x)=>Math.abs(x-(held?avoidance.n:self.n))<Math.abs(best-(held?avoidance.n:self.n))?x:best,options[0]);avoidance={route:s.route.name,car:lead.r,n};}
   }else avoidance=null;
  }else if(self.player)avoidance=null;
  // Yield lateral space to cars alongside, including one coming up from behind.
  for(const o of nearby){const span=10+Math.max(0,o.v-self.v)*.6;if(Math.abs(o.gap)<span){const separation=2.9;if(self.n<o.n)n=Math.min(n,o.n-separation);else n=Math.max(n,o.n+separation);}}
  n=C(n,-edge,edge);
  for(const o of nearby){if(o.gap<0)continue;const future=self.pit?n:offset(self.d+o.gap),overlap=Math.min(Math.abs(self.n-o.n),Math.abs(n-o.n),Math.abs(future-o.n))<3.1;
   if(!overlap)continue;const free=o.gap-8,follow=8+self.v*.55;const brakeCap=Math.sqrt(Math.max(0,o.v*o.v+2*8*Math.max(0,free-self.v*.35))),followCap=Math.max(0,o.v+(o.gap-follow)*.7);
   cap=Math.min(cap,brakeCap,followCap);blocked=true;
  }return {n,cap,blocked,nearby};
 }
 function begin(dt){serial++;plan=null;if(!a.trackModel())return;const self=descriptor(null),v=self.v;let target,cap;
  if(self.pit){target=s.pitTargetOffset||0;cap=a.pitModel().limit/3.6;for(let d=3;d<80;d+=4)cap=Math.min(cap,Math.sqrt(16/Math.max(.001,Math.abs(a.pitCurvature(self.q+d)))+2*8*d));if(s.pitStage==='enter')cap=Math.min(cap,Math.sqrt(2*7*Math.max(0,a.pitBox(a.TEAM.slot)-self.q-.5)));if(a.pitHeld())cap=0;}
  else {target=offset(self.d+C(v*.33+2,6,24));const t=a.trackModel();cap=laneSpeed(t.closed===false?Math.min(self.d+v*.55+4,t.L-2):self.d+v*.55+4);if(t.closed===false)cap=self.d>=t.L-.3||s.route.arrived?0:Math.min(cap,Math.max(.7,Math.sqrt(10*Math.max(0,t.L-self.d))));if(s.adaptiveCruise&&!s.testDriver)cap=Math.min(cap,s.cruiseSetKmh/3.6);if(s.pitLimiter)cap=Math.min(cap,60/3.6);if(s.safetyCar)cap=Math.min(cap,130/3.6);
   if(s.pitArmed&&a.pitModel()){const p=a.pitModel(),gap=wrap(p.entry-self.d,a.trackModel().L);if(gap<150||wrap(self.d-p.entry,a.trackModel().L)<p.span*.5)cap=Math.min(cap,Math.sqrt((p.limit/3.6)**2+16*Math.max(0,gap-30)));}
  }
  plan={...traffic(self,target,cap),serial,dt,self};
 }
 function get(){if(!plan)begin(1/120);return plan;}
 function steer(){const p=get(),v=s.speedMps,look=C(Math.abs(v)*.30+2,5,25),self=p.self;let q;
  if(self.pit)q=a.trackLateral(a.pitAt(self.q+look),p.n);
  else {const target=offset(self.d+look),n=p.blocked||Math.abs(p.n-offset(self.d+C(Math.abs(v)*.33+2,6,24)))>.1?p.n:target;q=a.trackLateral(a.trackAt(self.d+look),n);
   if(s.pitArmed&&a.pitModel()){const pit=a.pitModel(),past=wrap(self.d-pit.entry+a.trackModel().L/2,a.trackModel().L)-a.trackModel().L/2;if(past> -look&&past<pit.span*.5)q=a.pitAt(Math.max(0,past+look));}}
  const yaw=(a.contactPose?.()?.psi)??((self.pit?a.pitAt(self.q):a.trackAt(self.d)).psi+s.headingRel),dx=q.x-self.p.x,dz=q.z-self.p.z,right=dx*Math.cos(yaw)-dz*Math.sin(yaw),k=2*right/Math.max(9,dx*dx+dz*dz),factor=C(1.15-Math.abs(v)*.013,.44,1);
  return C(Math.atan(k*a.STEERING.wheelbase)/(a.STEERING.maxAngle*factor),-1,1);
 }
 function controls(){const p=get(),err=p.cap-s.speedMps;return {throttle:C(err*.65,0,1),brake:C(-err*.42,0,1),steerTarget:steer()};}
 function rival(r,dt,oldV){if(!a.trackModel())return;const self=descriptor(r),base=offset(r.distM+12),p=traffic(self,base,Math.min(r.speedMps,laneSpeed(r.distM+self.v*.55+4)));r.speedMps=Math.min(r.speedMps,Math.max(p.cap,oldV-12*dt));r.lane+=C(p.n-r.lane,-1.0*dt,1.0*dt);}
 Object.assign(a,{racingOffset:offset,drivingLine:line,driverBegin:begin,driverTarget:()=>get().cap,driverControls:controls,driverSteer:steer,rivalDriver:rival,driverInfo:()=>{const p=get();return {target:p.cap,offset:p.n,blocked:p.blocked,nearby:p.nearby.map(o=>({name:o.r?.name||'Mercedes',gap:o.gap,n:o.n,v:o.v}))};}});
})();
