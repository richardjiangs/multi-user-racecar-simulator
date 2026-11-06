/* Roadster open stunt ramp. Geometry is shared with the rendered road.
   Tesla describes fan/seal suction separately from the cold-gas flight jets.
   Fan capacity, tyre friction and ramp dimensions here are simulator estimates. */
function installRoadsterRampContact(app,api){
 const s=app.state,C=app.clamp,{inputs,held,ready,tank,hit,saveAxes,axesFromEuler,takeoff,mass:M,gravity:G,wheelbase}=api;
 const dot=(a,b)=>a.reduce((n,v,i)=>n+v*b[i],0),P=()=>app.roadsterRampGeometry;
 const CENTER=.55,MU=1.4,MAX_SUCTION=2*G;
 const active=()=>app.roadsterScene()?.kind==='ramp';
 function pose(){
  const f=s.roadster,c=f.rampContact,p=app.roadsterRampAt(c.q,f.x),ch=Math.cos(c.heading),sh=Math.sin(c.heading);
  const b={right:[ch,-p.forward[1]*sh,-p.forward[2]*sh],up:p.up.slice(),forward:[sh,p.forward[1]*ch,p.forward[2]*ch],appliedYoke:f.yoke};
  f.x=p.x;f.y=p.y+p.up[1]*CENTER-CENTER;f.z=p.z+p.up[2]*CENTER;
  saveAxes(f,b);f.vx=b.forward[0]*s.speedMps;f.vy=b.forward[1]*s.speedMps;f.vz=b.forward[2]*s.speedMps;f.alt=Math.max(0,f.y);s.airborne=false;
 }
 function release(){
  const f=s.roadster;if(!f.rampContact)return;
  f.rampContact=null;f.airborne=true;s.airborne=true;f.gripForce=0;f.normalForce=0;
  f.hold=false;f.positionHold=false;f.landing=false;f.rampClearance=.08;
 }
 function capture(q,heading=0){
  const f=s.roadster;f.rampContact={q:C(q,0,P().length),heading};f.airborne=false;
  f.positionHold=false;f.hold=false;f.leveling=false;f.levelingRoll=false;f.landing=false;f.bodyAxes=null;pose();
 }
 function tryEnter(previous){
  const f=s.roadster,r=P();if(!active()||f.rampContact||f.airborne)return false;
  if(previous.z<=r.z&&f.z>=r.z&&Math.abs(f.x)<r.half-1&&Math.cos(f.yaw)>.6&&s.speedMps>0){capture(Math.max(0,f.z-r.z),f.yaw);return true;}return false;
 }
 function step(dt){
  const f=s.roadster,c=f.rampContact;inputs(dt);f.thrust=0;f.boost=0;
  // Pitch cannot tear sealed tyres off the ramp. P/L or the hover/land buttons
  // deliberately release contact; W/S pitch becomes effective after the edge.
  if(!s.trackPack&&s.rocket&&(held('KeyP')||held('KeyL'))){takeoff();return;}
  const p=app.roadsterRampAt(c.q,f.x),v=s.speedMps,vt=v*Math.cos(c.heading);
  // The centre travels inside the surface radius; use its radius for both
  // normal acceleration and the surface arc-length advance.
  const radiusScale=1-CENTER*p.curvature;
  const required=p.curvature/radiusScale*vt*vt+G*p.up[1];
  const powered=app.roadsterDownforce();
  // N/m = a_normal + g dot up + suction. Keep a 1 g tyre preload where possible.
  // Fans use electrical power, not cold gas: an empty flight tank cannot switch
  // off a still-powered seal. A road itself still cannot pull on the tyres.
  f.gripForce=powered?C(G-required,0,MAX_SUCTION):0;
  const normal=required+f.gripForce;f.normalForce=M*Math.max(0,normal);
  if(normal< -1e-6){release();return;}
  const direction=s.gearMode==='R'?-1:s.gearMode==='G'?1:0;
  const traction=MU*Math.max(0,normal);
  const motor=direction*Math.min(app.SPEC.peakTorqueNm*app.SPEC.finalDrive/app.SPEC.wheelRadiusM,app.SPEC.peakPowerW/Math.max(10,Math.abs(v)))*s.throttle/M*(s.realMode?C(1-s.damage*.7,.2,1):1);
  const drive=C(motor,-traction,traction),boost=f.rearJet&&!s.brake&&ready()?tank(M*16,dt):0;
  f.boost=boost;f.thrust=boost*.7;
  const loss=.5*1.225*.6*v*Math.abs(v)/M;
  const gravity=-G*p.forward[1]*Math.cos(c.heading);
  let next=v+(drive+boost*16*(direction||1)+gravity-loss)*dt;
  const brakes=Math.min(traction,s.brake*12+(!s.throttle?1.5:0)),rolling=Math.min(traction,210/M);
  next=Math.sign(next)*Math.max(0,Math.abs(next)-(brakes+rolling)*dt);
  s.speedMps=C(next,-16,app.SPEC.topSpeedMps);
  const steering=s.rocket?f.yawInput:s.steer;
  const yawRate=s.speedMps/wheelbase*Math.tan(app.roadsterSteerAngle(steering,v));
  const lateral=Math.sqrt(Math.max(0,traction*traction-Math.min(traction,Math.abs(drive)+brakes)**2));
  c.heading+=C(yawRate,-lateral/Math.max(1,Math.abs(v)),lateral/Math.max(1,Math.abs(v)))*dt;
  c.q+=s.speedMps*Math.cos(c.heading)/radiusScale*dt;f.x+=s.speedMps*Math.sin(c.heading)*dt;
  const end=c.q>=P().length,start=c.q<0;c.q=C(c.q,0,P().length);pose();
  // Open elevated edge: preserve tangent velocity and the inverted body frame.
  // Only reversing out of the ground entrance returns to ordinary road driving.
  if(end){release();return;}
  if(start){f.rampContact=null;f.airborne=false;s.airborne=false;f.gripForce=0;f.normalForce=0;f.y=0;f.pitch=0;f.roll=0;f.bodyAxes=null;f.yoke=0;return;}
  if(Math.abs(f.x)>P().half-1)release();
 }
 function attraction(){
  const f=s.roadster;if(!active()||!app.roadsterDownforce()||f.rampClearance>0)return null;
  const center={x:f.x,y:f.y+CENTER,z:f.z},near=app.roadsterRampNearest(center),b=axesFromEuler(f);
  if(Math.abs(f.x)>P().half-1||near.distance>8)return null;
  const p=near.point,n=p.up,d=(center.y-p.y)*n[1]+(center.z-p.z)*n[2],along=(center.y-p.y)*p.forward[1]+(center.z-p.z)*p.forward[2];
  if(d<CENTER-.1||dot(b.up,n)<.8||Math.abs(dot(b.forward,n))>.4)return null;
  if(near.q>=P().length-1e-6&&along>0||near.q<=1e-6&&along<0)return null;
  const gap=d-CENTER,vn=f.vy*n[1]+f.vz*n[2],target=-Math.min(4,Math.max(.25,gap*2));
  // Z vectors toward the nearby tyre-side surface. Slow the approach near
  // contact; account for gravity along that surface normal, including inverted.
  const acceleration=C((target-vn)*5+G*n[1],-MAX_SUCTION,MAX_SUCTION);
  return n.map(v=>v*acceleration);
 }
 function collide(previous){
  const f=s.roadster;if(!active()||f.rampContact)return;
  if(f.rampClearance>0){f.rampClearance-=1/120;return;}
  const center={x:f.x,y:f.y+CENTER,z:f.z},near=app.roadsterRampNearest(center);
  if(!near||Math.abs(f.x)>P().half+1||near.distance>4)return;
  const b=axesFromEuler(f),p=near.point,n=p.up,old={x:previous.x,y:previous.y+CENTER,z:previous.z};
  const signed=o=>(o.y-p.y)*n[1]+(o.z-p.z)*n[2];
  const radius=.95*Math.abs(b.right[1]*n[1]+b.right[2]*n[2])+CENTER*Math.abs(dot(b.up,n))+2.2*Math.abs(dot(b.forward,n));
  const d=signed(center),before=signed(old),vn=f.vy*n[1]+f.vz*n[2],side=before>=0?1:-1;
  if(Math.abs(d)>radius+.08||vn*side>=0)return;
  // Endpoints are finite: do not capture a car already beyond the open edge.
  const along=(center.y-p.y)*p.forward[1]+(center.z-p.z)*p.forward[2];
  if(near.q>=P().length-1e-6&&along>0||near.q<=1e-6&&along<0)return;
  if(side>0&&dot(b.up,n)>.85&&Math.abs(dot(b.forward,n))<.35&&Math.abs(f.x)<P().half-1&&(n[1]>=0||app.roadsterDownforce())){hit(Math.abs(vn));s.speedMps=dot([f.vx,f.vy,f.vz],b.forward);capture(near.q,Math.atan2(b.forward[0],dot(b.forward,p.forward)));return;}
  const correction=side*(radius+.08)-d;f.y+=n[1]*correction;f.z+=n[2]*correction;hit(Math.abs(vn));f.vy-=1.12*vn*n[1];f.vz-=1.12*vn*n[2];f.holdY=f.y;f.holdZ=f.z;
 }
 app.roadsterRampContact={step,tryEnter,release,collide,attraction};
}
