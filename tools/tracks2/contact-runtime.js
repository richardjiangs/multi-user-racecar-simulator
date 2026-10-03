/* Contact-only planar rigid bodies. Free driving still uses the original powertrain,
   transmission and bicycle steering. Metres, seconds, kilograms and radians throughout.
   Positive yaw rotates +Z toward +X; its 2D cross product is rz*fx-rx*fz. */
(function(){
 const app=window.__Track2App,s=app.state,C=app.clamp,A=app.trackAngle;
 const mass=app.SPEC?.massKg||768,halfLength=app.track2Vehicle.halfLength,halfWidth=app.track2Vehicle.halfWidth,centerOffset=app.track2Vehicle.centerOffset;
 const cross=(r,n)=>r.z*n.x-r.x*n.z,dot=(a,b)=>a.x*b.x+a.z*b.z;
 const basis=b=>({f:{x:Math.sin(b.yaw),z:Math.cos(b.yaw)},r:{x:Math.cos(b.yaw),z:-Math.sin(b.yaw)}});
 function makeBody(p,v=0,yaw=p.psi||0,m=mass,hl=halfLength,hw=halfWidth){return{x:p.x,z:p.z,y:p.y||0,yaw,vx:Math.sin(yaw)*v,vz:Math.cos(yaw)*v,omega:0,im:m?1/m:0,ii:m?12/(m*((2*hl)**2+(2*hw)**2)):0,hl,hw,active:false,age:0};}
 function corners(b){const {f,r}=basis(b);return [[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>({x:b.x+u*b.hw*r.x+v*b.hl*f.x,z:b.z+u*b.hw*r.z+v*b.hl*f.z}));}
 function manifold(a,b){if((!b.wall&&Math.abs(a.y-b.y)>1.25)||Math.hypot(a.x-b.x,a.z-b.z)>a.hl+b.hl+a.hw+b.hw)return null;
  const ba=basis(a),bb=basis(b),delta={x:b.x-a.x,z:b.z-a.z};let depth=Infinity,n;
  for(const axis of [ba.f,ba.r,bb.f,bb.r]){const ra=a.hl*Math.abs(dot(ba.f,axis))+a.hw*Math.abs(dot(ba.r,axis)),rb=b.hl*Math.abs(dot(bb.f,axis))+b.hw*Math.abs(dot(bb.r,axis)),d=dot(delta,axis),overlap=ra+rb-Math.abs(d);if(overlap<=0)return null;if(overlap<depth){depth=overlap;n={x:axis.x*(d>=0?1:-1),z:axis.z*(d>=0?1:-1)};}}
  // Clip the overlapping footprint; a face-on rear hit has a centred impulse,
  // whereas an offset wheel/side hit has the appropriate lever arm.
  let poly=corners(a);for(const axis of [bb.r,bb.f])for(const sign of [-1,1]){const norm={x:axis.x*sign,z:axis.z*sign},extent=axis===bb.r?b.hw:b.hl,dist=p=>(p.x-b.x)*norm.x+(p.z-b.z)*norm.z-extent,out=[];
   for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],dp=dist(p),dq=dist(q);if(dp<=0)out.push(p);if((dp<=0)!==(dq<=0)){const u=dp/(dp-dq);out.push({x:p.x+(q.x-p.x)*u,z:p.z+(q.z-p.z)*u});}}poly=out;}
  let px=0,pz=0,area=0;for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],c=p.x*q.z-q.x*p.z;area+=c;px+=(p.x+q.x)*c;pz+=(p.z+q.z)*c;}
  const point=Math.abs(area)>1e-7?{x:px/(3*area),z:pz/(3*area)}:poly.length?{x:poly.reduce((v,p)=>v+p.x,0)/poly.length,z:poly.reduce((v,p)=>v+p.z,0)/poly.length}:{x:(a.x+b.x)/2,z:(a.z+b.z)/2};
  // Compare the supported floor at the contact, not at two segment centres.
  // A sloping fence must remain solid; the other deck of a bridge must not collide.
  if(b.wall&&b.seg){const u=C(dot({x:point.x-b.seg.a.x,z:point.z-b.seg.a.z},bb.f)/(2*b.hl),0,1),wy=b.seg.a.y+(b.seg.b.y-b.seg.a.y)*u;
   const psi=a.pathPsi??a.yaw,dx=point.x-a.x,dz=point.z-a.z,ay=a.y+(a.pathGrade||0)*(dx*Math.sin(psi)+dz*Math.cos(psi))+(a.pathBank||0)*(dx*Math.cos(psi)-dz*Math.sin(psi));
   if(ay>wy+b.seg.top+.45||ay+.75<wy)return null;
  }
  return{n,depth,point};
 }
 function fenceManifold(a,b){const m=manifold(a,b);if(!m)return null;
  const {f,r}=basis(b),along=dot({x:m.point.x-b.x,z:m.point.z-b.z},f);
  // Real open ends at pit entries keep their end face. Internal mesh joints do not.
  if((along < -b.hl+.06&&!b.joinStart)||(along > b.hl-.06&&!b.joinEnd))return m;
  const sign=dot({x:(a.prev?.x??a.x)-b.x,z:(a.prev?.z??a.z)-b.z},r)>=0?1:-1;
  let poly=corners(a);
  for(const side of [-1,1]){const dist=p=>side*dot({x:p.x-b.x,z:p.z-b.z},f)-b.hl,out=[];
   for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],dp=dist(p),dq=dist(q);if(dp<=0)out.push(p);if((dp<=0)!==(dq<=0)){const u=dp/(dp-dq);out.push({x:p.x+(q.x-p.x)*u,z:p.z+(q.z-p.z)*u});}}poly=out;
  }
  if(!poly.length)return null;
  const distance=p=>sign*dot({x:p.x-b.x,z:p.z-b.z},r),nearest=Math.min(...poly.map(distance)),depth=b.hw-nearest;
  if(depth<=0)return null;
  const face=poly.filter(p=>distance(p)<nearest+.002),point={x:0,z:0};for(const p of face){point.x+=p.x/face.length;point.z+=p.z/face.length;}
  const correction=b.hw-distance(point);point.x+=r.x*sign*correction;point.z+=r.z*sign*correction;
  return {point,depth,n:{x:-r.x*sign,z:-r.z*sign}};
 }
 function resolve(a,b,m,e=.12,mu=.46){const n=m.n,ra={x:m.point.x-a.x,z:m.point.z-a.z},rb={x:m.point.x-b.x,z:m.point.z-b.z};
  const relative=()=>({x:b.vx+b.omega*rb.z-a.vx-a.omega*ra.z,z:b.vz-b.omega*rb.x-a.vz+a.omega*ra.x});
  const denominator=n=>a.im+b.im+cross(ra,n)**2*a.ii+cross(rb,n)**2*b.ii;
  const apply=(j,n)=>{a.vx-=j*n.x*a.im;a.vz-=j*n.z*a.im;a.omega-=j*cross(ra,n)*a.ii;b.vx+=j*n.x*b.im;b.vz+=j*n.z*b.im;b.omega+=j*cross(rb,n)*b.ii;};
  const vn=dot(relative(),n);let jn=0,jt=0,energy=0,slip=0;if(vn<0){jn=-(1+e)*vn/denominator(n);energy=jn*(-vn)-.5*jn*jn*denominator(n);apply(jn,n);const tangent={x:-n.z,z:n.x},vt=dot(relative(),tangent);slip=Math.abs(vt);jt=C(-vt/denominator(tangent),-mu*jn,mu*jn);energy+=-jt*vt-.5*jt*jt*denominator(tangent);apply(jt,tangent);}
  const inv=a.im+b.im;if(inv){const correction=Math.max(0,m.depth-.002)*.78/inv;a.x-=n.x*correction*a.im;a.z-=n.z*correction*a.im;b.x+=n.x*correction*b.im;b.z+=n.z*correction*b.im;}
  return{jn,jt,energy:Math.max(0,energy),slip,closing:Math.max(0,-vn),point:m.point,n};
 }
 let track=null,frame=null,player=null,bodies=new Map(),fenceGrid=null,events=[],serial=0,sparks=[],sparkSeed=7183,sparkRemainder=0,sparkTotal=0;
 function reset(){track=app.trackModel();frame=null;player=null;bodies.clear();fenceGrid=null;events=[];sparks=[];sparkRemainder=0;sparkTotal=0;s.impactJolt=0;}
 function fenceIndex(){if(fenceGrid)return fenceGrid;fenceGrid=new Map();const segments=app.fenceSegments(),ends=new Map(),keyOf=p=>Math.round(p.x*1000)+','+Math.round(p.y*1000)+','+Math.round(p.z*1000);for(const seg of segments){for(const p of [seg.a,seg.b]){const k=keyOf(p);ends.set(k,(ends.get(k)||0)+1);}}for(const seg of segments){const a=seg.a,b=seg.b,p={x:(a.x+b.x)/2,z:(a.z+b.z)/2,y:(a.y+b.y)/2},wall=makeBody(p,0,Math.atan2(b.x-a.x,b.z-a.z),0,Math.hypot(b.x-a.x,b.z-a.z)/2+.015,.085);wall.wall=true;wall.seg=seg;wall.joinStart=ends.get(keyOf(a))>1;wall.joinEnd=ends.get(keyOf(b))>1;const key=Math.floor(p.x/20)+','+Math.floor(p.z/20);if(!fenceGrid.has(key))fenceGrid.set(key,[]);fenceGrid.get(key).push(wall);}return fenceGrid;}
 function wallsNear(b){const grid=fenceIndex(),out=[],x=Math.floor(b.x/20),z=Math.floor(b.z/20);for(let i=x-1;i<=x+1;i++)for(let j=z-1;j<=z+1;j++)out.push(...(grid.get(i+','+j)||[]));return out;}
 function basePose(r){const pit=r?r.pitState:s.inPitLane,d=r?r.distM:s.distanceM,n=r?r.lane||0:s.laneOffset,p=pit?app.pitSurface(r?r.pitQ||0:s.pitQ||0,n):app.surfacePoint(d,n);return{...p,psi:p.psi+(r?r.contactHeading||0:s.headingRel)};}
 function fromActor(r){const p=basePose(r),b=makeBody({x:p.x+Math.sin(p.psi)*centerOffset,z:p.z+Math.cos(p.psi)*centerOffset,y:p.y},r?r.speedMps:s.speedMps,p.psi);b.actor=r||null;b.player=!r;b.pathPsi=p.psi-(r?r.contactHeading||0:s.headingRel);b.pathGrade=p.grade||0;b.pathBank=p.bank||0;return b;}
 function origin(b){return{x:b.x-Math.sin(b.yaw)*centerOffset,z:b.z-Math.cos(b.yaw)*centerOffset,y:b.y,psi:b.yaw};}
 function begin(dt){if(!app.trackModel()){if(track)reset();return;}if(track!==app.trackModel())reset();
  const all=[null,...(s.raceGrid?s.rivals:[]).filter(r=>!r.gone&&!r.dns)];frame=[];
  for(const r of all){let active=r?bodies.get(r):player;const current=fromActor(r);
   // Coordinate projection is only telemetry off road. It must never discard a
   // physical position just because no nearby centreline represents it exactly.
   const b=active||current;
   if(!r&&!active&&!app.pitHeld?.()&&!s.inPitLane&&(Math.abs(s.laneOffset)>app.halfWidthAt(s.distanceM)+.25||Math.abs(s.laneOffset*app.trackAt(s.distanceM).k)>.32)){
    activate(b);b.age=2;b.freeMotion=true;
   }
   b.beforeSpeed=r?r.speedMps:s.speedMps;b.beforeD=r?r.distM:s.distanceM;b.beforeQ=r?r.pitQ:s.pitQ;b.beforeN=r?r.lane:s.laneOffset;b.beforeRel=r?r.contactHeading:s.headingRel;b.prev={x:b.x,z:b.z,y:b.y,yaw:b.yaw};frame.push(b);
  }
 }
 function project(b){const r=b.actor,p=origin(b),pit=r?r.pitState:s.inPitLane,old=b.beforeD??(r?r.distM:s.distanceM);let q,p0;
  if(pit){const oldQ=b.beforeQ??(r?r.pitQ||0:s.pitQ||0),near=app.pitNearest(p,oldQ-35,oldQ+35);if(Number.isFinite(near.distance)){q=near.q;p0=app.pitAt(q);}else {q=oldQ;p0=app.pitAt(q);}}
  else{let best=Infinity,guess=old;for(let d=old-35;d<=old+35;d+=3){const v=app.trackAt(d),cost=(v.x-p.x)**2+(v.z-p.z)**2+4*(v.y-b.y)**2;if(cost<best){best=cost;guess=d;}}
   q=guess;for(let i=0;i<3;i++){const v=app.trackAt(q);q+=C((p.x-v.x)*Math.sin(v.psi)+(p.z-v.z)*Math.cos(v.psi),-4,4);}p0=app.trackAt(q);
  }
  const n=(p.x-p0.x)*Math.cos(p0.psi)-(p.z-p0.z)*Math.sin(p0.psi),rel=A(b.yaw-p0.psi),v=b.vx*Math.sin(b.yaw)+b.vz*Math.cos(b.yaw);
  if(r){if(pit){r.pitQ=q;r.distM=r.pitBase+q/app.pitModel().length*app.pitModel().span;}else r.distM=q;r.lane=n;r.speedMps=v;r.contactHeading=rel;}
  else {if(pit){s.pitQ=q;s.distanceM=s.pitBase+q/app.pitModel().length*app.pitModel().span;}else s.distanceM=q;s.laneOffset=n;s.headingRel=rel;s.speedMps=v;}
  // Road decks are support surfaces, including the full pit pavement; no gravity
  // teleport or switching to Suzuka's lower deck at an XY crossing.
  const support=pit?app.pitSurface(q,n):app.surfacePoint(q,n);b.y=support.y;b.pathBank=support.bank||0;b.pathPsi=p0.psi;b.pathGrade=p0.grade;b.pathN=n;b.projectionError=Math.hypot(support.x-p.x,support.z-p.z);
 }
 function activate(b){if(!b.im)return;b.active=true;b.age=0;b.freeMotion=false;if(b.player)player=b;else bodies.set(b.actor,b);}
 function damage(b,hit){if(!s.realMode||!b.im||hit.jn*b.im<.45)return;const dv=hit.jn*b.im,severity=C(((dv-.45)/15)**1.35,0,1),p=hit.point,{f,r}=basis(b),local={x:(p.x-b.x)*r.x+(p.z-b.z)*r.z,z:(p.x-b.x)*f.x+(p.z-b.z)*f.z},front=local.z>.65,side=Math.abs(local.x)>.62;
  if(b.player){const sys=s.sys,nose='nose' in sys?'nose':'body',hyd='hydraulics' in sys?'hydraulics':'susp';sys[nose]=C((sys[nose]||0)+severity*(front?1:.18),0,1);sys.tyre=C((sys.tyre||0)+severity*(side?.8:.15),0,1);sys[hyd]=C((sys[hyd]||0)+severity*(side?.35:.1),0,1);sys.gearbox=C((sys.gearbox||0)+severity*(local.z<-.8?.5:.06),0,1);s.damage=Math.max(...Object.values(sys));if(severity>.85||sys.tyre>=1){s.retired=true;}}
  else {const r=b.actor;r.contactDamage=C((r.contactDamage||0)+severity,0,1);r.needsFix=r.contactDamage>.12;r.hurtT=Math.max(r.hurtT||0,severity*12);if(r.contactDamage>=1){r.out=true;r.retLap=s.raceLap;r.limp=false;}}
 }
 function emitSparks(a,b,hit){
  if(!b.wall||hit.energy<.05||(hit.closing<.4&&hit.slip<1))return;
  sparkRemainder+=hit.energy/650;
  const count=Math.min(140,Math.floor(sparkRemainder),420-sparks.length);sparkRemainder-=Math.floor(sparkRemainder);
  const rand=()=>{sparkSeed=(Math.imul(sparkSeed,1664525)+1013904223)>>>0;return sparkSeed/4294967296;};
  const magnitude=Math.min(16,1+Math.sqrt(hit.energy/mass)*1.2),t={x:-hit.n.z,z:hit.n.x},slide=a.vx*t.x+a.vz*t.z;
  for(let i=0;i<count;i++){const life=.16+rand()*.35,speed=magnitude*(.35+rand()*.65),spread=(rand()-.5)*2;
   const p={x:hit.point.x-hit.n.x*.09,y:a.y+.18+rand()*.2,z:hit.point.z-hit.n.z*.09,
    vx:-hit.n.x*speed*.35+t.x*(slide*.2+spread*speed),vz:-hit.n.z*speed*.35+t.z*(slide*.2+spread*speed),vy:speed*(.18+rand()*.45),life,maxLife:life};
   p.px=p.x;p.py=p.y;p.pz=p.z;p.floor=a.y+.02;sparks.push(p);sparkTotal++;
  }
 }
 function advanceSparks(dt){for(const p of sparks){p.px=p.x;p.py=p.y;p.pz=p.z;p.life-=dt;const drag=Math.exp(-dt*2);p.vx*=drag;p.vz*=drag;p.vy-=9.81*dt;p.x+=p.vx*dt;p.z+=p.vz*dt;p.y+=p.vy*dt;if(p.y<p.floor){p.y=p.floor;p.vy=Math.abs(p.vy)*.2;p.vx*=.5;p.vz*=.5;}}sparks=sparks.filter(p=>p.life>0);}
 function holdPlayer(){player=null;s.speedMps=0;s.impactJolt=0;}
 function limitSpeed(v){if(!player)return;const f=basis(player).f,forward=dot({x:player.vx,z:player.vz},f);if(forward>v){player.vx-=f.x*(forward-v);player.vz-=f.z*(forward-v);}}
 function contact(a,b,m){const hit=resolve(a,b,m,b.wall?.06:.12,b.wall?.18:.46);emitSparks(a,b,hit);if(hit.jn>1||m.depth>.01){activate(a);activate(b);damage(a,hit);damage(b,hit);if(hit.jn*a.im>.2||hit.jn*b.im>.2){const record={id:++serial,type:b.wall?'fence':'car',time:s.time,closing:hit.closing,impulse:hit.jn,energy:hit.energy,a:a.player?'Player':a.actor?.name,b:b.wall?'fence':b.player?'Player':b.actor?.name,real:s.realMode};events.push(record);if(events.length>100)events.shift();if(a.player||b.player){s.impactJolt=Math.min(.035,Math.max(s.impactJolt||0,hit.jn/mass*.002));if((s.time-(s.lastContactToast??-10))>.6){s.lastContactToast=s.time;app.showToast(s.realMode?'Impact — check the damage display.':'Impact — recovering grip.','Race Control');}}}}
 }
 function step(dt){advanceSparks(dt);if(!frame||!app.trackModel())return;
  // Crew holds the car before integration, including its collision velocities.
  const held=app.pitHeld?.(),moving=frame;if(held){const b=frame.find(b=>b.player);holdPlayer();s.distanceM=b.beforeD;s.pitQ=b.beforeQ;s.laneOffset=b.beforeN;s.headingRel=b.beforeRel;b.active=false;b.im=0;b.ii=0;b.vx=b.vz=b.omega=0;b.held=true;}
  for(const b of moving){b.goal=fromActor(b.actor);if(b.active){b.age+=dt;const forward=b.vx*Math.sin(b.yaw)+b.vz*Math.cos(b.yaw);let dv;
    if(b.player){dv=s.speedMps-b.beforeSpeed;}
    else {const r=b.actor,cap=r.out?0:Math.min(r.topMps||85,Math.sqrt(1.5*9.81/Math.max(.0001,Math.abs(app.trackAt(r.distM+22).k)))),target=Math.abs(A(b.yaw-(b.pathPsi??b.yaw)))>.65?Math.min(cap,10):cap;dv=C(target-forward,-(r.out?12:18)*dt,(r.accel||8)*dt);}
    b.vx+=Math.sin(b.yaw)*dv;b.vz+=Math.cos(b.yaw)*dv;
    const lat=b.vx*Math.cos(b.yaw)-b.vz*Math.sin(b.yaw),grip=1.3*9.81,remove=C(lat,-grip*dt,grip*dt);b.vx-=Math.cos(b.yaw)*remove;b.vz+=Math.sin(b.yaw)*remove;
    let desiredYaw;if(b.player){const steer=s.steer*app.STEERING.maxAngle*C(1.15-Math.abs(b.beforeSpeed)*.013,.44,1);desiredYaw=s.speedMps/app.STEERING.wheelbase*Math.tan(steer);}
    else {const r=b.actor,p=origin(b),look=C(Math.abs(forward)*.4+4,7,28),q=r.pitState?app.pitAt((r.pitQ||0)+look):app.trackAt(r.distM+look),dx=q.x-p.x,dz=q.z-p.z,k=2*(dx*Math.cos(b.yaw)-dz*Math.sin(b.yaw))/Math.max(9,dx*dx+dz*dz);desiredYaw=forward*C(k,-Math.tan(.58)/3.6,Math.tan(.58)/3.6);}
    const impactSpin=b.omega-(b.steerYaw||0);
    b.steerYaw=desiredYaw;
    // Damping applies to impact spin, not to the commanded yaw rate. Otherwise
    // an ordinary sustained bend never satisfies the old recovery condition.
    b.omega=desiredYaw+impactSpin*Math.exp(-dt*7);
    if(b.player&&b.freeMotion){b.freeSpeed=s.speedMps;b.omega=desiredYaw;}
    b.yaw=A(b.yaw);
   }else{b.vx=b.goal.vx;b.vz=b.goal.vz;b.omega=A(b.goal.yaw-b.prev.yaw)/dt;b.steerYaw=b.omega;}
  }
  const maxSpeed=Math.max(1,...moving.map(b=>Math.hypot(b.vx,b.vz)+Math.abs(b.omega)*3)),steps=Math.max(1,Math.ceil(maxSpeed*dt/.28)),h=dt/steps;
  for(let i=1;i<=steps;i++){
   for(const b of moving){if(b.active){
     if(b.freeMotion){const yaw=b.yaw+b.omega*h*.5;b.vx=Math.sin(yaw)*b.freeSpeed;b.vz=Math.cos(yaw)*b.freeSpeed;}
     // Rolling tyres turn the velocity with normal steering. An impact's excess
     // spin still rotates the chassis independently, producing a temporary skid.
     if(!b.freeMotion){const turn=b.steerYaw*h*.5,cs=Math.cos(turn),sn=Math.sin(turn),vx=b.vx; b.vx=vx*cs+b.vz*sn;b.vz=b.vz*cs-vx*sn;}
     b.x+=b.vx*h;b.z+=b.vz*h;b.yaw+=b.omega*h;
     if(!b.freeMotion){const turn=b.steerYaw*h*.5,cs=Math.cos(turn),sn=Math.sin(turn),vx=b.vx;b.vx=vx*cs+b.vz*sn;b.vz=b.vz*cs-vx*sn;}
     if(b.freeMotion){b.vx=Math.sin(b.yaw)*b.freeSpeed;b.vz=Math.cos(b.yaw)*b.freeSpeed;}
    }else{const u=i/steps;b.x=b.prev.x+(b.goal.x-b.prev.x)*u;b.z=b.prev.z+(b.goal.z-b.prev.z)*u;b.y=b.prev.y+(b.goal.y-b.prev.y)*u;b.yaw=b.prev.yaw+A(b.goal.yaw-b.prev.yaw)*u;}}
   for(let pass=0;pass<5;pass++){
    for(let j=0;j<moving.length;j++)for(let k=j+1;k<moving.length;k++){const a=moving[j],b=moving[k],m=manifold(a,b);if(m)contact(a,b,m);}
    for(const b of moving)for(const wall of wallsNear(b)){const m=fenceManifold(b,wall);if(m)contact(b,wall,m);}
   }
  }
  for(const b of moving)if(b.active){project(b);const lat=b.vx*Math.cos(b.yaw)-b.vz*Math.sin(b.yaw),r=b.actor,rel=A(b.yaw-b.pathPsi);
   const settled=b.age>.35&&Math.abs(lat)<.08&&Math.abs(b.omega-(b.steerYaw||0))<.035;
   // Regain ordinary steering after an impact. Staying off road must not keep
   // the car in a perpetual skid, or reintroduce the old ±60 m position clamp.
   if(b.player&&settled)b.freeMotion=true;
   const road=s.inPitLane?app.pitModel().half:app.halfWidthAt(s.distanceM),safe=b.player?Math.abs(s.laneOffset)<road-.3&&Math.abs(rel)<.3&&b.projectionError<.035:!r.out&&Math.abs(rel)<.035&&Math.abs(r.lane)<app.halfWidthAt(r.distM)-1.3;
   if(settled&&safe){b.active=false;if(b.player)player=null;else{bodies.delete(r);r.contactHeading=0;}}
  }
  s.impactJolt=(s.impactJolt||0)*Math.exp(-dt*10);frame=null;
 }
 function trackLimitsStep(dt){if(!app.trackModel())return;const over=Math.abs(s.laneOffset)-app.halfWidthAt(s.distanceM),off=over>.3&&!s.inPitLane&&!app.pitEntry(s.distanceM,s.laneOffset);s.offTrack=off?1:Math.max(0,s.offTrack-dt*3);
  // Preserve the existing sporting penalties. Grass is not a collision surface.
  if(s.realMode&&off&&over>.9&&s.tlCool<=0){s.tlCool=2.5;s.lapInvalid=true;if(s.route.env!=='street'){s.tlWarnings++;if(s.tlWarnings>=4){s.penaltyS+=5;app.showToast('+5 s penalty — repeated track limits.','Race Control');}else if(s.tlWarnings===3)app.showToast('Black-and-white flag — final track-limits warning.','Race Control');else app.showToast("Track limits — this lap won't count (warning "+s.tlWarnings+'/3).','Race Control');}}
 }
 function pose(r){const b=r?bodies.get(r):player;if(!b)return null;const rel=A(b.yaw-b.pathPsi),grade=b.pathGrade||0,bank=b.pathBank||0;return{...origin(b),grade:grade*Math.cos(rel)+bank*Math.sin(rel),bank:bank*Math.cos(rel)-grade*Math.sin(rel),contact:true};}
 Object.assign(app,{contactSparks:()=>sparks,limitContactSpeed:limitSpeed,holdContactPlayer:holdPlayer,trackLimitsStep,contactBegin:begin,contactStep:step,resetContacts:reset,contactPose:pose,contactActive:r=>r?bodies.has(r):!!player,contactInfo:()=>({sparks:{live:sparks.length,total:sparkTotal},events:events.slice(),player:player?{...origin(player),vx:player.vx,vz:player.vz,omega:player.omega,steerYaw:player.steerYaw||0,age:player.age,freeMotion:player.freeMotion}:null,rivals:[...bodies.values()].map(b=>({name:b.actor.name,...origin(b),vx:b.vx,vz:b.vz,omega:b.omega}))}),contactMath:{makeBody,manifold,fenceManifold,resolve,corners,basis}});
})();
