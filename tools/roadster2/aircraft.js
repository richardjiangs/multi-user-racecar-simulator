/* Authored A350-family 3D geometry, in metres. Airbus published dimensions:
   A350-1000 length 73.78 m, span 64.75 m, fuselage width 5.96 m.
   The flight paths below are simulator scenery, not a live airport traffic feed. */
function buildRoadsterAircraft(){
 const body=[],gear=[],beacons=[];let out=body;
 const white=[.91,.93,.94],light=[.72,.78,.81],dark=[.035,.065,.09],blue=[.035,.15,.30],metal=[.43,.48,.52],rubber=[.035,.04,.045];
 function tri(a,b,c,col){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,shade=.63+.37*Math.abs((n[0]*.3+n[1]*.85+n[2]*.4)/l);for(const p of[a,b,c])out.push(...p,...col.map(v=>v*shade));}
 function quad(a,b,c,d,col){tri(a,b,c,col);tri(a,c,d,col);}
 function box(x,y,z,w,h,l,col){const p=[[x-w/2,y,z-l/2],[x+w/2,y,z-l/2],[x+w/2,y,z+l/2],[x-w/2,y,z+l/2]],up=a=>[a[0],a[1]+h,a[2]];for(let i=0;i<4;i++)quad(p[i],p[(i+1)%4],up(p[(i+1)%4]),up(p[i]),col);quad(...p.map(up),col);quad(...p,col);}
 // Cross-sections explicitly taper the radome, crown and rear pressure vessel;
 // the aircraft is not an ellipsoid with flat triangular wings attached.
 const stations=[[-36.89,.03,.03,-.45],[-36,.6,.45,-.42],[-34.7,1.22,.96,-.18],[-33.3,1.75,1.63,.08],[-31.5,2.35,2.28,.08],[-29,2.85,2.87,0],[-26,2.98,3,0],[-14,2.98,3,0],[0,2.98,3,0],[17,2.98,3,0],[23,2.89,2.95,-.04],[27,2.61,2.75,-.18],[30,2.05,2.2,-.45],[33,1.26,1.4,-.7],[35,.65,.75,-.8],[36.4,.22,.25,-.75],[36.89,.025,.025,-.75]];
 // Nose is +Z. Authored cross-sections run nose-to-tail, so reverse their Z.
 const section=(q,a)=>[Math.sin(a)*q[1],q[3]+Math.cos(a)*q[2],-q[0]];
 for(let j=0;j<stations.length-1;j++)for(let i=0;i<48;i++){const a=i*Math.PI/24,b=(i+1)*Math.PI/24;quad(section(stations[j],a),section(stations[j],b),section(stations[j+1],b),section(stations[j+1],a),Math.cos((a+b)/2)<-.57?light:white);}
 function bodyX(z,y){const q=-z;let j=0;while(j<stations.length-2&&stations[j+1][0]<q)j++;const a=stations[j],b=stations[j+1],u=Math.max(0,Math.min(1,(q-a[0])/(b[0]-a[0]))),rx=a[1]+(b[1]-a[1])*u,ry=a[2]+(b[2]-a[2])*u,cy=a[3]+(b[3]-a[3])*u;return rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2))+.018;}
 function patch(side,z,y,w,h,col){const a=z-w/2,b=z+w/2,c=y-h/2,d=y+h/2;quad([side*bodyX(a,c),c,a],[side*bodyX(b,c),c,b],[side*bodyX(b,d),d,b],[side*bodyX(a,d),d,a],col);}
 // A350 cockpit mask, six panes and the characteristic dropped nose profile.
 for(const side of[-1,1]){for(let z=29.5;z<33.9;z+=.2)patch(side,z,1.5-(z-29.5)*.14,.23,1.05,dark);for(const [z,w,y]of[[30.3,1.3,1.48],[31.9,1.3,1.27],[33.2,.95,1.06]])patch(side,z,y,w,.73,[.18,.32,.39]);
  for(let z=-27.3;z<23;z+=.71){if([-25,-10.9,9.2,23.3].some(d=>Math.abs(z-d)<1.1))continue;patch(side,z,1.03,.38,.56,metal);patch(side,z,1.03,.30,.47,dark);}
  for(const z of[-25,-10.9,9.2,23.3]){patch(side,z,.24,1.18,2.28,metal);patch(side,z,.24,1.08,2.18,white);patch(side,z,1.01,.32,.43,dark);patch(side,z,-.02,.38,.07,metal);patch(side,z,1.55,.50,.13,[.76,.19,.13]);}
  for(let z=-28;z<21;z+=.8)patch(side,z,-1.15,.83,.11,blue);
  for(const z of[-20,4,18]){patch(side,z,-1.9,2.2,.85,metal);patch(side,z,-1.9,2.1,.76,light);}
 }
 // Swept, cambered wings: root fairing, separate upper/lower skins, raked tips,
 // slats, flap hinges and flap-track canoe fairings. Coordinates preserve 64.75 m span.
 function wing(side,tail=false){const points=tail?[[2.2,-1,-25],[6,-.1,-27],[10.2,1.1,-31.5],[9.8,1,-33.5],[3,-1.3,-31]]:[[2,-.65,9],[10,.1,5],[24,2.5,-4],[31.6,4.6,-10.8],[32.375,6.7,-13.9],[31.1,5,-13.6],[23,2.4,-10.2],[9,-.1,-5.1],[2,-.9,-4]];
  const top=points.map(([x,y,z])=>[x*side,y,z]),low=top.map(([x,y,z])=>[x,y-(tail?.17:.36)*(1-Math.abs(x)/40),z]);for(let i=1;i<top.length-1;i++){tri(top[0],top[i],top[i+1],white);tri(low[0],low[i+1],low[i],light);}for(let i=0;i<top.length;i++)quad(top[i],top[(i+1)%top.length],low[(i+1)%top.length],low[i],metal);
  if(!tail){for(const x of[6,11,17,23]){const z=1.2-x*.45;box(side*x,.05+x*.09,z-3.1,.30,.22,3.6,metal);box(side*x,-.3+x*.09,z-3.7,.48,.33,2.5,light);}quad([side*4,-.5,8.15],[side*23,2.51,-3.2],[side*23,2.52,-3.34],[side*4,-.49,8],metal);quad([side*10,.14,-4.1],[side*27,3.3,-10.6],[side*27,3.31,-10.75],[side*10,.15,-4.25],metal);box(side*31.7,5.3,-12,.16,.12,.22,side<0?[.95,.05,.025]:[.03,.94,.13]);}}
 wing(-1);wing(1);wing(-1,true);wing(1,true);
 for(const side of[-1,1]){quad([side*2,-.9,11],[side*4,-.55,7],[side*4,-.55,-6],[side*2,-2,-11],light);}
 // Tall tapered fin and inset rudder, rather than a block tail.
 for(const side of[-1,1]){const x=side*.30;quad([x,1.9,-23],[x,10.7,-31],[x,10.9,-34.6],[x,1.2,-33.8],blue);quad([x+side*.013,3,-31],[x+side*.013,10.4,-33.5],[x+side*.013,10.6,-34.25],[x+side*.013,2.9,-33.3],[.18,.38,.57]);quad([x+side*.02,5,-27.6],[x+side*.02,8.9,-31],[x+side*.02,8.9,-31.7],[x+side*.02,4.1,-29],[.8,.87,.91]);}
 quad([-.3,10.7,-31],[.3,10.7,-31],[.3,10.9,-34.6],[-.3,10.9,-34.6],metal);
 // Trent XWB nacelles: open intake lips, fan blades, spinner and tapered exhaust.
 for(const side of[-1,1]){const x=side*10.2,y=-2.6,z=3.9;box(x,-2.5,z-1.1,.72,2.5,4.1,light);
  const ring=(r,zz,a)=>[x+r*Math.cos(a),y+r*Math.sin(a),z+zz];
  const rings=[[-4.5,.65],[-3.8,1.18],[-2.8,1.66],[0,1.89],[2.1,1.8],[2.4,1.65]];
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<40;i++){const a=i*Math.PI/20,b=(i+1)*Math.PI/20;quad(ring(rings[j][1],rings[j][0],a),ring(rings[j][1],rings[j][0],b),ring(rings[j+1][1],rings[j+1][0],b),ring(rings[j+1][1],rings[j+1][0],a),j===4?metal:white);}
  for(let i=0;i<40;i++){const a=i*Math.PI/20,b=(i+1)*Math.PI/20;quad(ring(1.65,2.4,a),ring(1.65,2.4,b),ring(1.43,2.14,b),ring(1.43,2.14,a),metal);quad(ring(1.43,2.14,a),ring(1.43,2.14,b),ring(1.38,1.35,b),ring(1.38,1.35,a),dark);tri([x,y,z+1.38],ring(1.39,1.35,a),ring(1.39,1.35,b),dark);tri([x,y,z-4.8],ring(.65,-4.5,a),ring(.65,-4.5,b),dark);}
  for(let i=0;i<22;i++){const a=i*Math.PI/11;quad(ring(.36,1.54,a),ring(1.36,1.39,a+.12),ring(1.36,1.39,a+.21),ring(.36,1.54,a+.31),[.26,.3,.33]);tri([x,y,z+2.05],ring(.37,1.5,a),ring(.37,1.5,a+.30),metal);}
 }
 box(0,2.95,8,.15,.75,1.05,white);box(0,2.9,-13,.12,.55,.7,white);box(0,-3.3,-9,.12,.38,.5,metal);
 // Gear is a separate static mesh; flight instances can retract it without hiding wheels on parked aircraft.
 out=gear;
 function tyre(x,y,z,r,w){for(let i=0;i<24;i++){const a=i*Math.PI/12,b=(i+1)*Math.PI/12,p=(xx,t)=>[xx,y+r*Math.sin(t),z+r*Math.cos(t)];quad(p(x-w/2,a),p(x+w/2,a),p(x+w/2,b),p(x-w/2,b),rubber);for(const side of[-1,1]){tri([x+side*w/2,y,z],p(x+side*w/2,a),p(x+side*w/2,b),rubber);const rr=r*.47;tri([x+side*(w/2+.005),y,z],[x+side*(w/2+.005),y+rr*Math.sin(a),z+rr*Math.cos(a)],[x+side*(w/2+.005),y+rr*Math.sin(b),z+rr*Math.cos(b)],metal);}}}
 for(const side of[-1,1]){box(side*4.7,-4.8,-3.5,.22,3,.27,metal);box(side*4.7,-5.4,-3.6,1.6,.18,3.3,metal);for(const z of[-5,-3.6,-2.2])for(const t of[-1,1])tyre(side*4.7+t*.62,-5.3,z,.68,.48);box(side*4.7,-2.1,-3.5,1.1,.1,3.6,white);}
 box(0,-5.2,26,.18,3,.18,metal);for(const side of[-1,1])tyre(side*.38,-5.6,26,.41,.28);box(0,-2.1,25.5,.8,.12,2.1,white);
 out=beacons;box(0,3.02,0,.26,.10,.28,[1,.02,.01]);box(0,-3.13,-2,.24,.12,.28,[1,.02,.01]);for(const side of[-1,1])box(side*32.05,5.6,-13,.14,.15,.20,[1,1,.96]);
 return{body:new Float32Array(body),gear:new Float32Array(gear),beacons:new Float32Array(beacons)};
}
function roadsterAircraftPoses(kind,time){
 const planes=[],ellipse=(id,cx,cz,rx,rz,phase,rate,height,lengthScale=1)=>{const a=phase+time*rate,vx=-rx*Math.sin(a)*rate,vz=rz*Math.cos(a)*rate,vy=5.6*Math.cos(a*.7)*rate,speed=Math.hypot(vx,vz),yawRate=-rx*rz*rate**3/(speed*speed);planes.push({id,x:cx+rx*Math.cos(a),z:cz+rz*Math.sin(a),y:height+8*Math.sin(a*.7),yaw:Math.atan2(vx,vz),pitch:Math.atan2(vy,speed),roll:Math.atan2(-yawRate*speed,9.80665),lengthScale,gear:false,flying:true});};
 if(kind==='jfk'){
  ellipse('A350-1000 · departing',0,2200,3000,1500,-1.7,.024,145);
  ellipse('A350-900 · approach',1000,2500,1000,6000,Math.PI,.015,200,.9054);
  ellipse('A350-1000 · overflight',-1800,1800,5000,4500,.5,-.016,760);
  for(let i=0;i<5;i++)planes.push({id:'A350 · apron '+(i+1),x:535,y:6.1,z:600+i*240,yaw:Math.PI/2,pitch:0,roll:0,lengthScale:i%2?.9054:1,gear:true,flying:false});
 }else if(kind==='bridge'){ellipse('A350-1000 · bay crossing',0,1200,3200,2200,-1.8,.024,520);ellipse('A350-900 · coastal flight',-1800,2500,5000,3600,1.3,-.016,1150,.9054);}
 else ellipse('A350-900 · passing traffic',600,300,2800,2200,-1.6,.026,600,.9054);
 return planes;
}
