/* A geometric driving line, with exit-biased hairpin apexes and a braking envelope.
   This is a simulator driving aid, not recorded F1 telemetry or a fastest-lap claim.
   Planning changes pedals/steering only; the original drivetrain and contacts integrate motion. */
(function(){
 const a=window.__Track2App,s=a.state,C=a.clamp,wrap=a.trackWrap,ang=a.trackAngle;
 let plan=null,serial=0;
 const smooth=u=>(u=C(u,0,1),u*u*(3-2*u));
 function line(){const t=a.trackModel();if(!t)return null;if(t.drivingLine)return t.drivingLine;
  const N=t.points.length,ds=t.L/N,at=i=>a.trackSample(t,i*ds),ks=Array.from({length:N},(_,i)=>at(i).k),signs=ks.map(k=>Math.abs(k)>.0018?Math.sign(k):0);
  // Join brief straight patches inside a compound bend, retaining opposite turns.
  for(let i=0;i<N;i++)if(signs[i]===0){let j=1;while(j<6&&!signs[(i+j)%N])j++;const prev=signs[(i-1+N)%N];if(j<6&&prev&&signs[(i+j)%N]===prev)for(let n=0;n<j;n++)signs[(i+n)%N]=prev;}
  const corners=[];let origin=signs.findIndex((v,i)=>v!==signs[(i-1+N)%N]);if(origin<0)origin=0;
  for(let step=0;step<N;){const start=origin+step,sign=signs[start%N];let count=1;while(step+count<N&&signs[(start+count)%N]===sign)count++;step+=count;if(!sign)continue;
   const turn=Array.from({length:count},(_,j)=>Math.abs(ks[(start+j)%N])*ds).reduce((x,y)=>x+y,0);if(turn<.10||count*ds>t.L*.8)continue;
   const fraction=turn>1.9?.64:.54;let swept=0,apex=start;for(let j=0;j<count;j++){swept+=Math.abs(ks[(start+j)%N])*ds;if(swept>=turn*fraction){apex=start+j;break;}}
   corners.push({start:start*ds,end:(start+count)*ds,apex:apex*ds,sign,turn,fraction,lead:C(count*ds*.4,18,65),tail:C(count*ds*.3,18,60)});
  }
  let offsets=Array.from({length:N},(_,i)=>{const d=i*ds;let sum=0,weight=0;for(const c of corners)for(const lap of [-1,0,1]){const x=d+lap*t.L,start=c.start-c.lead,end=c.end+c.tail;if(x<start||x>end)continue;const amplitude=Math.max(0,a.halfWidthAt(d)-2.4)*.78,inside=Math.min(amplitude,.25/Math.max(.001,Math.abs(ks[i])));let n,w;
    if(x<c.start){n=-amplitude;w=smooth((x-start)/c.lead);}else if(x<c.apex){n=-amplitude+(amplitude+inside)*smooth((x-c.start)/(c.apex-c.start));w=1;}else if(x<c.end){n=inside-(amplitude+inside)*smooth((x-c.apex)/(c.end-c.apex));w=1;}else{n=-amplitude;w=1-smooth((x-c.end)/c.tail);}sum+=n*c.sign*w;weight+=w;}
   return weight?sum/Math.max(1,weight):0;});
  // Smooth steering transitions between linked corners without touching the road.
  for(let pass=0;pass<6;pass++)offsets=offsets.map((v,i)=>(offsets[(i-2+N)%N]+4*offsets[(i-1+N)%N]+6*v+4*offsets[(i+1)%N]+offsets[(i+2)%N])/16);
  const points=offsets.map((n,i)=>a.trackLateral(at(i),n));
  const curvature=points.map((p,i)=>{const x=points[(i-2+N)%N],z=points[(i+2)%N],len=(Math.hypot(p.x-x.x,p.z-x.z)+Math.hypot(z.x-p.x,z.z-p.z))/2;return ang(Math.atan2(z.x-p.x,z.z-p.z)-Math.atan2(p.x-x.x,p.z-x.z))/Math.max(.5,len);});
  const vmax=a.SPEC.topSpeedRecordMps||a.SPEC.topSpeedMps||354/3.6,lat=a.track2Vehicle.f1?21:C(a.SPEC.tractionCoeff*9.81,7.5,21);const speeds=curvature.map(k=>Math.min(vmax,Math.sqrt(lat/Math.max(.00001,Math.abs(k)))));
  for(let pass=0;pass<3;pass++)for(let i=N-1;i>=0;i--)speeds[i]=Math.min(speeds[i],Math.sqrt(speeds[(i+1)%N]**2+2*9*ds));
  return t.drivingLine={offsets,speeds,curvature,corners,N,ds};
 }
 function interpolate(arr,d){const t=a.trackModel(),f=wrap(d,t.L)/t.L*arr.length,i=Math.floor(f);return arr[i]+(arr[(i+1)%arr.length]-arr[i])*(f-i);}
 function offset(d){return interpolate(line().offsets,d);}
 function laneSpeed(d){return interpolate(line().speeds,d);}
 function descriptor(r){const player=!r,pit=player?s.inPitLane:!!r.pitState,d=player?s.distanceM:r.distM,n=player?s.laneOffset:r.lane,v=player?s.speedMps:r.speedMps,q=player?s.pitQ:r.pitQ;
  const p=a.contactPose?.(r)|| (pit?a.trackLateral(a.pitAt(q||0),n):a.surfacePoint(d,n));return {r,player,pit,d,n,v:Math.max(0,v),q:q||0,p};}
 function neighbours(self){const actors=[...(s.raceGrid?s.rivals:[]).filter(r=>!r.gone&&!r.dns&&r!==self.r)];if(!self.player)actors.push(null);const L=a.trackModel().L,out=[];
  for(const r of actors){const o=descriptor(r);let gap,n;
   if(o.pit===self.pit){gap=self.pit?o.q-self.q:wrap(o.d-self.d+L/2,L)-L/2;n=o.n;}
   else {const near=self.pit?a.pitNearest(o.p):a.roadNearest(o.p);if(!Number.isFinite(near.distance)||near.distance>22)continue;const p=self.pit?a.pitAt(near.q):a.trackAt(near.d);n=(o.p.x-p.x)*Math.cos(p.psi)-(o.p.z-p.z)*Math.sin(p.psi);gap=self.pit?near.q-self.q:wrap(near.d-self.d+L/2,L)-L/2;}
   if(gap> -35&&gap<500)out.push({...o,gap,n});
  }return out;
 }
 function traffic(self,wanted,cap){const nearby=neighbours(self),half=self.pit?a.pitModel().half:a.halfWidthAt(self.d),edge=half-1.7;let n=C(wanted,-edge,edge),blocked=false;
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
  else {target=offset(self.d+C(v*.33+2,6,24));cap=laneSpeed(self.d+v*.55+4);if(s.adaptiveCruise&&!s.testDriver)cap=Math.min(cap,s.cruiseSetKmh/3.6);if(s.pitLimiter)cap=Math.min(cap,60/3.6);if(s.safetyCar)cap=Math.min(cap,130/3.6);
   if(s.pitArmed){const p=a.pitModel(),gap=wrap(p.entry-self.d,a.trackModel().L);if(gap<150||wrap(self.d-p.entry,a.trackModel().L)<p.span*.5)cap=Math.min(cap,Math.sqrt((p.limit/3.6)**2+16*Math.max(0,gap-30)));}
  }
  plan={...traffic(self,target,cap),serial,dt,self};
 }
 function get(){if(!plan)begin(1/120);return plan;}
 function steer(){const p=get(),v=s.speedMps,look=C(Math.abs(v)*.30+2,5,25),self=p.self;let q;
  if(self.pit)q=a.trackLateral(a.pitAt(self.q+look),p.n);
  else {const target=offset(self.d+look),n=p.blocked||Math.abs(p.n-offset(self.d+C(Math.abs(v)*.33+2,6,24)))>.1?p.n:target;q=a.trackLateral(a.trackAt(self.d+look),n);
   if(s.pitArmed){const pit=a.pitModel(),past=wrap(self.d-pit.entry+a.trackModel().L/2,a.trackModel().L)-a.trackModel().L/2;if(past> -look&&past<pit.span*.5)q=a.pitAt(Math.max(0,past+look));}}
  const yaw=(a.contactPose?.()?.psi)??((self.pit?a.pitAt(self.q):a.trackAt(self.d)).psi+s.headingRel),dx=q.x-self.p.x,dz=q.z-self.p.z,right=dx*Math.cos(yaw)-dz*Math.sin(yaw),k=2*right/Math.max(9,dx*dx+dz*dz),factor=C(1.15-Math.abs(v)*.013,.44,1);
  return C(Math.atan(k*a.STEERING.wheelbase)/(a.STEERING.maxAngle*factor),-1,1);
 }
 function controls(){const p=get(),err=p.cap-s.speedMps;return {throttle:C(err*.65,0,1),brake:C(-err*.42,0,1),steerTarget:steer()};}
 function rival(r,dt,oldV){if(!a.trackModel())return;const self=descriptor(r),base=offset(r.distM+12),p=traffic(self,base,Math.min(r.speedMps,laneSpeed(r.distM+self.v*.55+4)));r.speedMps=Math.min(r.speedMps,Math.max(p.cap,oldV-12*dt));r.lane+=C(p.n-r.lane,-1.0*dt,1.0*dt);}
 Object.assign(a,{racingOffset:offset,drivingLine:line,driverBegin:begin,driverTarget:()=>get().cap,driverControls:controls,driverSteer:steer,rivalDriver:rival,driverInfo:()=>{const p=get();return {target:p.cap,offset:p.n,blocked:p.blocked,nearby:p.nearby.map(o=>({name:o.r?.name||'Mercedes',gap:o.gap,n:o.n,v:o.v}))};}});
})();
