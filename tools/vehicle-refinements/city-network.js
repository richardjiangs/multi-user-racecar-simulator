/* Persistent London coordinates shared by roads, navigation, traffic and camera.
   The existing authored road graph is retained; no street moves when a turn is chosen. */
(function(root){
 function installCityNetwork(app,drawVehicle){
  if(!app.LDN||app.cityNetwork)return;
  const s=app.state,G=app.LDN,C=(v,a,b)=>Math.max(a,Math.min(b,v)),A=v=>Math.atan2(Math.sin(v),Math.cos(v));
  const pos=n=>({x:n.e*1000,z:n.n*1000}),bearing=(r,dir)=>r.brg+(dir<0?Math.PI:0),end=(r,dir)=>dir>0?r.B:r.A;
  const width=r=>r.w*(app.WIDTH_SCALE||1.55),right=(p,n)=>({...p,x:p.x+Math.cos(p.psi)*n,z:p.z-Math.sin(p.psi)*n});
  const roads=G.roads,buildings=[],traffic=[],primitives=[],landmarks=[],grounds=[],trees=[];roads.forEach((r,i)=>r.networkId=i);
  let rng=8821;const random=()=>((rng=(Math.imul(rng,1664525)+1013904223)>>>0)+.5)/4294967296;
  const kinds=['cab','saloon','hatch','bus','ddbus','van','ghost','cullinan','bentley','maybach','cycle'];
  function roadPoint(r,dir,d){const q=pos(dir>0?r.A:r.B),psi=bearing(r,dir);return{x:q.x+Math.sin(psi)*d,z:q.z+Math.cos(psi)*d,psi,y:0};}
  function linkChoices(r,dir){return end(r,dir).roads.filter(l=>l.road!==r&&(l.out>0?l.road.fwd:l.road.back)>0);}
  function straightChoice(r,dir){const list=linkChoices(r,dir);return list.sort((a,b)=>Math.abs(A(bearing(a.road,a.out)-bearing(r,dir)))-Math.abs(A(bearing(b.road,b.out)-bearing(r,dir))))[0]||end(r,dir).roads.find(l=>l.road===r);}
  function bend(r,dir,next){const node=end(r,dir),p=pos(node),a=bearing(r,dir),b=bearing(next.road,next.out),R=Math.min(24,r.len*.22,next.road.len*.22),turn=A(b-a);
   return {p,a,b,R,turn,rIn:r,rOut:next.road,P:{x:p.x-Math.sin(a)*R,z:p.z-Math.cos(a)*R},Q:{x:p.x+Math.sin(b)*R,z:p.z+Math.cos(b)*R}};
  }
  function curve(c,u){if(Math.abs(c.turn)>Math.PI-.02){const f=Math.sin(Math.PI*u),dx=.3*c.R*f*f*Math.sin(2*Math.PI*u),dz=c.R*f,ddx=.3*c.R*(2*f*Math.PI*Math.cos(Math.PI*u)*Math.sin(2*Math.PI*u)+f*f*2*Math.PI*Math.cos(2*Math.PI*u)),ddz=c.R*Math.PI*Math.cos(Math.PI*u);return{x:c.P.x+dx*Math.cos(c.a)+dz*Math.sin(c.a),z:c.P.z-dx*Math.sin(c.a)+dz*Math.cos(c.a),psi:c.a+Math.atan2(ddx,ddz),y:0};}const v=1-u,x=v*v*c.P.x+2*v*u*c.p.x+u*u*c.Q.x,z=v*v*c.P.z+2*v*u*c.p.z+u*u*c.Q.z,dx=2*v*(c.p.x-c.P.x)+2*u*(c.Q.x-c.p.x),dz=2*v*(c.p.z-c.P.z)+2*u*(c.Q.z-c.p.z);return{x,z,psi:Math.atan2(dx,dz),y:0};}
  function path(r,dir,d,entry,exit){if(entry&&d<entry.R)return curve(entry,.5+.5*C(d/entry.R,0,1));if(exit&&d>r.len-exit.R)return curve(exit,.5*C((d-r.len+exit.R)/exit.R,0,1));return roadPoint(r,dir,d);}
  let nav=null,lastPlan='',routeLinks=[],routePoints=[];
  const signal=(node)=>{const cycle=52+node.roads.length*8,u=((s.routeTime+node.e*31+node.n*17)%cycle+cycle)%cycle;return u<cycle*.52?'green':u<cycle*.52+3.4?'amber':'red';};
  function shortest(start,target){const dist=new Map([[start,0]]),prev=new Map(),todo=new Set(G.nodes);while(todo.size){let node=null,best=Infinity;for(const n of todo){const d=dist.get(n)??Infinity;if(d<best){best=d;node=n;}}if(!node||node===target)break;todo.delete(node);for(const l of node.roads){if((l.out>0?l.road.fwd:l.road.back)<=0)continue;const next=end(l.road,l.out),d=best+l.road.len;if(d<(dist.get(next)??Infinity)){dist.set(next,d);prev.set(next,{node,link:l});}}}if(!dist.has(target))return null;const links=[];for(let n=target;n!==start;){const p=prev.get(n);if(!p)return null;links.unshift(p.link);n=p.node;}return{links,distance:dist.get(target)};}
  const locations=G.nodes.map(n=>({id:n.id,name:n.name,node:n,...pos(n)}));
  const baker=roads.find(r=>r.name==='Baker Street (A41)');
  if(baker){const p=roadPoint(baker,1,baker.len*.66);locations.push({id:'221b-baker',name:'221B Baker Street · Sherlock Holmes Museum',node:baker.B,road:baker,d:baker.len*.66,...p});}
  function plan(){const L=s.ldn;if(!L||!nav)return;const id=L.road.networkId+':'+L.dir+':'+nav.id;if(id===lastPlan){if(routePoints.length)routePoints[0]=playerPoint();return;}lastPlan=id;
   if(nav.road===L.road){const d=L.dir>0?nav.d:L.road.len-nav.d;if(d>=s.distanceM){routeLinks=[];routePoints=[playerPoint(),{x:nav.x,z:nav.z}];return;}}
   let candidates=[];if(nav.road){for(const n of [nav.road.A,nav.road.B]){const q=shortest(L.next,n);if(q)candidates.push({...q,node:n,tail:n===nav.road.A?nav.d:nav.road.len-nav.d});}}
   else{const q=shortest(L.next,nav.node);if(q)candidates=[{...q,node:nav.node,tail:0}];}
   const best=candidates.sort((a,b)=>(a.distance+a.tail)-(b.distance+b.tail))[0];routeLinks=best?.links||[];
   if(nav.road&&best&&best.tail>1)routeLinks.push({road:nav.road,out:best.node===nav.road.A?1:-1});
   routePoints=[playerPoint(),pos(L.next),...routeLinks.map(l=>pos(end(l.road,l.out)))];routePoints[routePoints.length-1]={x:nav.x,z:nav.z};
  }
  function destination(id){const p=typeof id==='object'?id:locations.find(p=>p.id===id);if(!p)return false;if(!s.ldn)app.enterLondon();nav={...p,arrived:false};for(const id of ['gpsDestination','cityDestination']){const el=app.canvas.ownerDocument.getElementById(id);if(el)el.value=p.id;}lastPlan='';plan();app.showToast?.('Destination: '+p.name,'Navigation');return true;}
  function arrivalSpeedLimit(){if(!s.ldn||!nav||!(s.chauffeur||s.testDriver))return Infinity;if(nav.arrived)return 0;const L=s.ldn;let remaining=Infinity;if(nav.road===L.road)remaining=(L.dir>0?nav.d:L.road.len-nav.d)-s.distanceM;else if(!nav.road&&nav.node===L.next)remaining=L.road.len-s.distanceM;return remaining>=-20?Math.sqrt(2.8*Math.max(0,remaining-4)):Infinity;}
  function choose(L){plan();const auto=s.chauffeur||s.testDriver||s.assist||s.laneAssist;const planned=routeLinks[0];if(nav&&auto&&planned&&L.next.roads.includes(planned))return planned;
   if(nav&&auto&&planned){const match=L.next.roads.find(l=>l.road===planned.road&&l.out===planned.out);if(match)return match;}
   const choices=linkChoices(L.road,L.dir),want=(s.headingRel||0)*.7+(s.steer||0)*1.55,straight=straightChoice(L.road,L.dir);if(Math.abs(want)<.30)return straight;return choices.sort((a,b)=>Math.abs(A(bearing(a.road,a.out)-bearing(L.road,L.dir))-want)-Math.abs(A(bearing(b.road,b.out)-bearing(L.road,L.dir))-want))[0]||straight;
  }
  function prepare(){const L=s.ldn;if(!L)return;const remaining=L.road.len-s.distanceM;if(!L.netExit||remaining>26){const link=choose(L);if(link)L.netExit={link,curve:bend(L.road,L.dir,link)};}s.ldnTurn=L.netExit?{link:L.netExit.link,turn:L.netExit.curve.turn}:null;}
  function at(d){let L=s.ldn;for(let i=0;i<20;i++){if(d<0&&L.previous){L=L.previous;d+=L.road.len;continue;}if(d>L.road.len){const exit=L.netExit||(()=>{const link=straightChoice(L.road,L.dir);return link?{link,curve:bend(L.road,L.dir,link)}:null;})();if(exit){d-=L.road.len;L={road:exit.link.road,dir:exit.link.out,netEntry:exit.curve};continue;}}return path(L.road,L.dir,d,L.netEntry,L.netExit?.curve);}return roadPoint(L.road,L.dir,d);}
  function actorPose(r){const p=right(at(r.distM),r.lane||0);return{...p,psi:p.psi+(r.contactHeading||0)};}
  function curvature(d){return s.ldn?A(at(d+.05).psi-at(d-.05).psi)/.1:null;}
  function playerPoint(){if(!s.ldn)return null;const p=right(at(s.distanceM),s.laneOffset||0);return{...p,psi:p.psi+(s.headingRel||0)};}
  function step(){let L=s.ldn;if(!L)return;prepare();
   if(s.distanceM>=L.road.len&&L.netExit){const excess=s.distanceM-L.road.len,link=L.netExit.link;for(const r of s.rivals||[])r.distM-=L.road.len;s.ldn={road:link.road,dir:link.out,node:L.next,next:end(link.road,link.out),origin:(L.origin||0)+L.road.len,netEntry:L.netExit.curve,inTurn:L.netExit.curve.turn,previous:L};s.distanceM=excess;L=s.ldn;lastPlan='';prepare();}
   if(s.distanceM<0){if(L.previous){const old=L.previous;s.distanceM+=old.road.len;for(const r of s.rivals||[])r.distM+=old.road.len;s.ldn=old;L=old;lastPlan='';}else s.distanceM=0;}

   s.edgeD=s.distanceM;s.route.totalM=L.road.len;s.route.remainingM=L.road.len-s.distanceM;s.route.label=L.road.name;s.route.arrived=false;
   if(nav){const p=playerPoint(),near=Math.hypot(p.x-nav.x,p.z-nav.z);if(near<22&&Math.abs(s.speedMps)<1.5&&!nav.arrived){nav={...nav,arrived:true};app.showToast?.('Arrived at '+nav.name,'Navigation');}}
  }
  function addRoad(r){const half=width(r)/2,N=Math.ceil(r.len/20);for(let i=0;i<N;i++){const d0=i*r.len/N,d1=(i+1)*r.len/N;for(const[H,y,col]of[[half+3,-.03,'#a9a59b'],[half,0,'#3a3f43']]){const a=roadPoint(r,1,d0),b=roadPoint(r,1,d1);primitives.push({points:[right(a,-H),right(a,H),right(b,H),right(b,-H)].map(p=>({...p,y})),color:col,road:r.networkId});}if(i%2===0){const a=roadPoint(r,1,d0+2),b=roadPoint(r,1,Math.min(d1,d0+6));primitives.push({points:[right(a,-.065),right(a,.065),right(b,.065),right(b,-.065)].map(p=>({...p,y:.012})),color:'#d9d8cd',road:r.networkId});}}
   for(let d=40;d<r.len-38;d+=24+random()*15)for(const side of [-1,1]){const open=app.londonOpen?.find(o=>o.re.test(r.name)&&(o.both||o.side===side));if(open){if(open.kind==='park')trees.push(right(roadPoint(r,1,d),side*(half+8)));continue;}const p=right(roadPoint(r,1,d),side*(half+8+random()*3));if(roads.some(o=>o!==r&&distanceRoad(p,o)<width(o)/2+7))continue;const look=app.londonLook?.[(d<r.len/2?r.A:r.B).district]||{kind:'victorian',storeys:5};buildings.push({...p,psi:r.brg,w:11+random()*10,depth:9+random()*10,height:Math.max(2,look.storeys-1+Math.floor(random()*3))*3.4,side,seed:random(),kind:look.kind,brick:random()<.48,color:['#a69581','#918578','#b5aea0','#8d7469'][Math.floor(random()*4)],road:r.networkId});}
   for(const dir of [-1,1])if((dir>0?r.fwd:r.back)>0)for(let d=30+random()*60;d<r.len-15;d+=85+random()*100){traffic.push({id:traffic.length,road:r,dir,d,kind:kinds[Math.floor(random()*kinds.length)],speed:0,target:7+random()*6,lane:0,entry:null,exit:null});}
  }
  function distanceRoad(p,r){const a=pos(r.A),b=pos(r.B),u=C(((p.x-a.x)*(b.x-a.x)+(p.z-a.z)*(b.z-a.z))/(r.len*r.len),0,1);return Math.hypot(p.x-a.x-(b.x-a.x)*u,p.z-a.z-(b.z-a.z)*u);}
  for(const r of roads){addRoad(r);for(const side of [-1,1]){const o=app.londonOpen?.find(o=>o.re.test(r.name)&&(o.both||o.side===side));if(!o)continue;const a=roadPoint(r,1,0),b=roadPoint(r,1,r.len),near=side*(width(r)/2+3),far=near+side*(o.kind==='park'?100:180),y=o.kind==='park'?-.05:-9;grounds.push({points:[right(a,near),right(a,far),right(b,far),right(b,near)].map(p=>({...p,y})),color:o.kind==='park'?'#6e8658':'#476e7f'});}}
  for(const [id,marks]of Object.entries(app.londonMarks||{})){const n=G.byId[id];if(!n)continue;const rd=n.roads[0],r=rd.road,dir=-rd.out,base=roadPoint(r,dir,r.len-24);for(const m of marks){if(m.kind==='towerbridge')continue;landmarks.push({...right(base,(m.side||1)*(width(r)/2+18)),kind:m.kind});}}
  const towerBridge=roads.find(r=>/^Tower Bridge/.test(r.name));
  if(towerBridge)for(const d of [towerBridge.len/2-30.5,towerBridge.len/2+30.5])for(const side of [-1,1]){buildings.push({...right(roadPoint(towerBridge,1,d),side*(width(towerBridge)/2+4)),psi:towerBridge.brg,w:7,depth:11,height:42,color:'#c1b39b',tower:true});}
  // Geometry is stored once. Bounds reject invisible pieces before projection,
  // without regenerating a street or moving its buildings at a junction.
  const layers=['#a9a59b','#3a3f43','#d9d8cd'].map(color=>primitives.filter(p=>p.color===color));
  for(const mesh of [...primitives,...grounds]){mesh.x=mesh.points.reduce((n,p)=>n+p.x,0)/mesh.points.length;mesh.z=mesh.points.reduce((n,p)=>n+p.z,0)/mesh.points.length;mesh.radius=Math.max(...mesh.points.map(p=>Math.hypot(p.x-mesh.x,p.z-mesh.z)));}
  for(const b of buildings){b.cs=Math.cos(b.psi);b.sn=Math.sin(b.psi);b.radius=Math.hypot(b.w,b.depth)/2;}
  // Distant cars retain the same authored geometry. Small cached raster views
  // avoid hundreds of sub-pixel panel and spoke strokes for each distant car.
  const carViews=new Map();
  function drawCar(ctx,x,y,scale,car,yaw,night){if(scale>=4||car.kind==='police'){drawVehicle(ctx,x,y,scale,{...car,speedMps:car.speed,viewYaw:yaw},Math.cos(yaw)<0,night,s.time,0);return;}
   const angle=Math.round(yaw*64/Math.PI)*Math.PI/64,key=[car.kind,car.name,car.body,car.hue,car.tone,!!car.brake,angle,night].join(':');let canvas=carViews.get(key);
   if(!canvas){canvas=app.canvas.ownerDocument.createElement('canvas');canvas.width=320;canvas.height=192;drawVehicle(canvas.getContext('2d'),160,170,20,{...car,speed:0,speedMps:0,viewYaw:angle},Math.cos(angle)<0,night,0,0);carViews.set(key,canvas);if(carViews.size>256)carViews.delete(carViews.keys().next().value);}
   const k=scale/20;ctx.drawImage(canvas,x-160*k,y-170*k,320*k,192*k);
  }
  function trafficExit(c){const options=linkChoices(c.road,c.dir),link=options[c.id%Math.max(1,options.length)]||straightChoice(c.road,c.dir);return link?{link,curve:bend(c.road,c.dir,link)}:null;}
  for(const c of traffic)c.exit=trafficExit(c);
  const laneOffset=r=>-width(r)/2+width(r)/Math.max(1,r.fwd+r.back)*.5;
  function trafficPose(c){let bend0,u;const d=c.d;
   if(c.entry&&d<c.entry.R){bend0=c.entry;u=.5+.5*C(d/c.entry.R,0,1);}
   else if(c.exit&&d>c.road.len-c.exit.curve.R){bend0=c.exit.curve;u=.5*C((d-c.road.len+bend0.R)/bend0.R,0,1);}
   if(!bend0)return right(roadPoint(c.road,c.dir,d),laneOffset(c.road));
   // Interpolate lane centres themselves. Rotating an offset around a tight
   // centreline can fold the lane backwards or create a cusp in a U-turn.
   return trafficCurve(bend0,u);
  }
  function trafficCurve(b,u){const P=right({...b.P,psi:b.a},laneOffset(b.rIn)),Q=right({...b.Q,psi:b.b},laneOffset(b.rOut)),R=Math.min(b.R*2/3,Math.hypot(Q.x-P.x,Q.z-P.z)*.42),
    U={x:P.x+Math.sin(b.a)*R,z:P.z+Math.cos(b.a)*R},V={x:Q.x-Math.sin(b.b)*R,z:Q.z-Math.cos(b.b)*R},v=1-u,
    x=v*v*v*P.x+3*v*v*u*U.x+3*v*u*u*V.x+u*u*u*Q.x,z=v*v*v*P.z+3*v*v*u*U.z+3*v*u*u*V.z+u*u*u*Q.z,
    dx=3*v*v*(U.x-P.x)+6*v*u*(V.x-U.x)+3*u*u*(Q.x-V.x),dz=3*v*v*(U.z-P.z)+6*v*u*(V.z-U.z)+3*u*u*(Q.z-V.z);
   return{x,z,y:0,psi:Math.atan2(dx,dz)};
  }
  function cornerLimit(b){if(b.speedLimit)return b.speedLimit;let maxK=0,old=trafficCurve(b,0);for(let i=1;i<=64;i++){const p=trafficCurve(b,i/64),ds=Math.hypot(p.x-old.x,p.z-old.z);maxK=Math.max(maxK,Math.abs(A(p.psi-old.psi))/Math.max(.001,ds));old=p;}return b.speedLimit=Math.min(14,Math.sqrt(2.0/Math.max(.0001,maxK)));}
  function trafficStep(dt){if(!s.ldn)return;const lanes=new Map();for(const c of traffic){const id=c.road.networkId+':'+c.dir;if(!lanes.has(id))lanes.set(id,[]);lanes.get(id).push(c);}
   for(const list of lanes.values()){list.sort((a,b)=>b.d-a.d);for(let i=0;i<list.length;i++){const c=list[i],gap=c.road.len-c.d,node=end(c.road,c.dir);let target=c.target;
     if(c.exit){const limit=cornerLimit(c.exit.curve);target=Math.min(target,Math.sqrt(limit*limit+4.6*Math.max(0,gap-c.exit.curve.R)));}if(c.entry&&c.d<c.entry.R)target=Math.min(target,cornerLimit(c.entry));
     if(c.road===s.ldn.road&&c.dir===s.ldn.dir){const gap=s.distanceM-c.d;if(gap>0)target=Math.min(target,Math.max(0,s.speedMps+(gap-9)*.5));}
     if(node.roads.length>=3){const green=signal(node)==='green';if(!green)target=Math.min(target,Math.sqrt(4.8*Math.max(0,gap-5)));}
     if(i){const lead=list[i-1],free=lead.d-c.d-(lead.kind.includes('bus')?10:5)-3;target=Math.min(target,Math.max(0,lead.speed+(free-4)*.55));}
     c.speed+=C(target-c.speed,-3.2*dt,1.8*dt);c.d+=c.speed*dt;
     if(!c.exit)c.exit=trafficExit(c);
     if(c.d>=c.road.len&&c.exit){c.d-=c.road.len;c.entry=c.exit.curve;c.dir=c.exit.link.out;c.road=c.exit.link.road;c.exit=trafficExit(c);}

   }}
   // Legacy driver sensors receive relative positions only; world actors never respawn.
   const L=s.ldn;s.traffic=traffic.filter(c=>c.road===L.road).map(c=>{const same=c.dir===L.dir,d=same?c.d:L.road.len-c.d,p=trafficPose(c);return{...c,world:p,z:d-s.distanceM,routeD:d,oncoming:!same,lat:(same?-1:1)*(width(L.road)/2-width(L.road)/(L.road.fwd+L.road.back)*.5),speed:c.speed,hold:1,hidden:false,lane:same?0:1};});
  }
  function draw(w,h,pal,options={}){const ctx=app.ctx,eye=options.eye||playerPoint(),focal=options.focal||(app.WIDTH_SCALE?380:360),eyeHeight=app.WIDTH_SCALE?1.6:1.55,horizon=h*.46;ctx.fillStyle=pal.grass||'#a4a098';ctx.fillRect(0,horizon,w,h-horizon);
   const cs=Math.cos(eye.psi),sn=Math.sin(eye.psi),slope=w/(2*focal);
   const camera=p=>{const dx=p.x-eye.x,dz=p.z-eye.z;return{x:dx*cs-dz*sn,z:dx*sn+dz*cs,y:p.y||0};};
   const visible=(p,range=1400)=>{const dx=p.x-eye.x,dz=p.z-eye.z,z=dx*sn+dz*cs,r=p.radius||0;return z+r>.5&&z-r<range&&Math.abs(dx*cs-dz*sn)<Math.max(0,z)*slope+r*(1+slope);};
   const project=p=>({x:w/2+p.x*focal/p.z,y:horizon+(eyeHeight-p.y)*focal/p.z,scale:focal/p.z});
   function polygon(points,color){let a=points.map(camera),out=[];for(let i=0;i<a.length;i++){const p=a[i],q=a[(i+1)%a.length],ip=p.z>=.5,iq=q.z>=.5;if(ip)out.push(p);if(ip!==iq){const u=(.5-p.z)/(q.z-p.z);out.push({x:p.x+(q.x-p.x)*u,y:p.y+(q.y-p.y)*u,z:.5});}}if(out.length<3)return;const pts=out.map(project);if(pts.every(p=>p.x<0)||pts.every(p=>p.x>w)||pts.every(p=>p.y>h)||pts.every(p=>p.y<0))return;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=color;ctx.fill();}
   for(const ground of grounds)if(visible(ground,1800))polygon(ground.points,ground.color);
   for(const layer of layers)for(const mesh of layer)if(visible(mesh,1600))polygon(mesh.points,mesh.color);
   if(towerBridge){const r=towerBridge,mid=r.len/2,half=width(r)/2,lift=app.bridgeLift?.(s.routeTime)?.open||0,ang=lift*43*Math.PI/180,P=(d,n,y=0)=>({...right(roadPoint(r,1,d),n),y});if(lift>.001){polygon([P(mid-30.5,-half),P(mid+30.5,-half),P(mid+30.5,half),P(mid-30.5,half)],'#42697a');for(const side of [-1,1]){const d=mid+side*30.5,tip=d-side*30.5*Math.cos(ang),H=30.5*Math.sin(ang);polygon([P(d,-half),P(d,half),P(tip,half,H),P(tip,-half,H)],'#555d64');}}for(const side of [-1,1]){const n=side*(half+3);polygon([P(mid-30.5,n-1,34),P(mid+30.5,n-1,34),P(mid+30.5,n+1,36),P(mid-30.5,n+1,36)],'#81a9ad');}}
   const objects=[];for(const p of landmarks){const q=camera(p);if(q.z>2&&q.z<1200)objects.push({type:'landmark',depth:q.z,p,q});}for(const p of trees){const q=camera(p);if(q.z>1&&q.z<650)objects.push({type:'tree',depth:q.z,p,q});}for(const b of buildings){if(visible(b)){const p=camera(b);objects.push({depth:p.z,type:'building',b});}}
   const actors=traffic.map(c=>({c,p:trafficPose(c)}));if(s.raceGrid)for(const c of s.rivals||[]){if(!c.gone&&!c.out)actors.push({c,p:actorPose(c)});}
   for(const c of s.pursuit||[]){const p=right(at(s.distanceM-c.gap),c.lane);actors.push({c,p});}
   if(s.police&&Number.isFinite(s.police.z))actors.push({c:{kind:'police',speed:s.speedMps},p:right(at(s.distanceM+s.police.z),s.laneOffset)});
   for(const {c,p} of actors){const q=camera(p);if(q.z>1&&q.z<1100&&Math.abs(q.x)<q.z*slope+10)objects.push({depth:q.z,type:'car',c,p,q});}
   for(const node of G.nodes){const p=pos(node),q=camera(p);if(q.z>1&&q.z<500&&Math.abs(q.x)<q.z*2)objects.push({depth:q.z,type:'junction',node,p,q});}
   objects.sort((a,b)=>b.depth-a.depth);
   for(const o of objects){ctx.globalAlpha=C((1400-o.depth)/400,0,1);if(o.type==='tree'){const p=project(o.q);ctx.fillStyle='#71614c';ctx.fillRect(p.x-.13*p.scale,p.y-5*p.scale,.26*p.scale,5*p.scale);ctx.fillStyle='#476744';ctx.beginPath();ctx.ellipse(p.x,p.y-5.6*p.scale,2.2*p.scale,2.7*p.scale,0,0,Math.PI*2);ctx.fill();continue;}if(o.type==='landmark'){const p=project(o.q);app.drawCityLandmark?.({...o.p,side:0,worldProjection:{...p,fwd:o.q.z}},o.q.z,0,{},!!pal.night);continue;}if(o.type==='junction'){const {node}=o;for(const l of node.roads){const r=l.road,dir=-l.out,atEnd=roadPoint(r,dir,r.len-5),side=right(atEnd,-width(r)/2-1);const q=camera(side);if(q.z<=1)continue;const p=project(q),H=3.7*p.scale;ctx.fillStyle='#4d5558';ctx.fillRect(p.x-1*p.scale/10,p.y-H,.12*p.scale,H);ctx.fillStyle='#f0ece0';ctx.fillRect(p.x-1.8*p.scale,p.y-H,3.6*p.scale,.65*p.scale);if(p.scale>1.1){ctx.fillStyle='#253139';ctx.font=Math.min(14,Math.max(5,.24*p.scale))+'px system-ui';ctx.textAlign='center';ctx.fillText(r.name,p.x,p.y-H+.43*p.scale,3.3*p.scale);}if(node.roads.length>=3){ctx.fillStyle='#152025';ctx.fillRect(p.x-.23*p.scale,p.y-3*p.scale,.46*p.scale,1.02*p.scale);for(const [i,col]of ['red','amber','green'].entries()){ctx.fillStyle=signal(node)===col?{red:'#fc3433',amber:'#ffc541',green:'#53ea86'}[col]:'#303735';ctx.beginPath();ctx.arc(p.x,p.y-(2.82-i*.3)*p.scale,.1*p.scale,0,Math.PI*2);ctx.fill();}}}continue;}if(o.type==='car'){const q=project(o.q),yaw=A(o.p.psi-eye.psi-Math.atan2(o.q.x,o.q.z));drawCar(ctx,q.x,q.y,q.scale,o.c,yaw,!!pal.night);continue;}
    const b=o.b,P=(x,y,z)=>({x:b.x+b.cs*x+b.sn*z,z:b.z-b.sn*x+b.cs*z,y}),W=b.w/2,D=b.depth/2,H=b.height,
     ex=(eye.x-b.x)*b.cs-(eye.z-b.z)*b.sn,ez=(eye.x-b.x)*b.sn+(eye.z-b.z)*b.cs;
    // Draw only the faces visible to this camera. Near street fronts reuse the
    // original stonework, sash windows, cornices, shop glazing and awnings.
    for(const side of [-1,1]){
     const x=side*W,z=side*D;
     if(ex*side>W){
      const face=[P(x,0,-D),P(x,0,D),P(x,H,D),P(x,H,-D)],a=camera(face[0]),q=camera(face[1]);
      if(!b.tower&&side===-b.side&&o.depth<260&&a.z>.5&&q.z>.5&&app.drawCityBlock){const A=project(a),B=project(q);app.drawCityBlock({...b,storeys:H/3.4,wM:2*D,shop:true,awn:b.seed>.55,hue:b.seed,shopName:Math.abs(B.x-A.x)>50?['BOOKSELLER','BAKERY','CAFÉ','TAILOR','GALLERY','PHARMACY'][Math.floor(b.seed*6)]:'',worldQuad:{a:A,b:B,ah:H*A.scale,bh:H*B.scale}},o.depth,0,{script:'latin'},!!pal.night);}
      else {polygon(face,b.color);if(o.depth<350)for(let y=3;y<H-1;y+=3.4)for(let d=-D+1.5;d<D-1;d+=3)polygon([P(x,y,d-.5),P(x,y,d+.5),P(x,y+1.5,d+.5),P(x,y+1.5,d-.5)],'#344650');}
     }
     if(ez*side>D){polygon([P(-W,0,z),P(W,0,z),P(W,H,z),P(-W,H,z)],side<0?'#746e66':'#8a8276');if(o.depth<240)for(let y=3;y<H-1;y+=3.4)for(let x=-W+1.6;x<W-1;x+=3)polygon([P(x-.55,y,z),P(x+.55,y,z),P(x+.55,y+1.5,z),P(x-.55,y+1.5,z)],'#344650');}
    }
    if(eyeHeight>H)polygon([P(-W,H,-D),P(W,H,-D),P(W,H,D),P(-W,H,D)],'#5b6061');
    if(b.tower){polygon([P(-W-.3,H,-D-.3),P(W+.3,H,-D-.3),P(0,H+10,0)],'#487978');polygon([P(W+.3,H,-D-.3),P(W+.3,H,D+.3),P(0,H+10,0)],'#365b60');}
   }ctx.globalAlpha=1;
   if(nav){const q=camera(nav);if(q.z>1&&q.z<600){const p=project(q);ctx.fillStyle='#f0c661';ctx.beginPath();ctx.arc(p.x,p.y-25,7,0,Math.PI*2);ctx.fill();ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.strokeStyle='#17222c';ctx.lineWidth=3;ctx.strokeText(nav.name,p.x,p.y-40);ctx.fillText(nav.name,p.x,p.y-40);}}
  }
  function drawRear(x,y,w,h,pal,mirror={}){if(w<1||h<1)return;const ctx=app.ctx,eye=right(playerPoint(),mirror.eye||0);ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(x+w,y);ctx.scale(-1,1);ctx.fillStyle='#adc7d3';ctx.fillRect(0,0,w,h);draw(w,h,pal,{eye:{...eye,psi:eye.psi+Math.PI+(mirror.yaw||0)},focal:w*.85});ctx.restore();}
  const mapCanvas=app.el.mapCanvas,originalMap=app.drawMap;let mapHits=[],mapZoom=1,mapCentre=null,mapTransform=null,mapDrag=null;
  if(mapCanvas){const doc=mapCanvas.ownerDocument,choice=doc.createElement('select');choice.id='cityDestination';choice.setAttribute('aria-label','Map destination');choice.style.cssText='width:100%;padding:8px;background:#16232d;color:white;border:1px solid #576b74;border-radius:6px';choice.add(new Option('Choose a London destination…',''));for(const p of locations.slice().sort((a,b)=>a.name.localeCompare(b.name)))choice.add(new Option(p.name,p.id));(mapCanvas.closest('.smart-screen')||mapCanvas.parentElement).before(choice);choice.style.marginBottom='8px';choice.onchange=()=>destination(choice.value);
   mapCanvas.addEventListener('click',e=>{if(!s.ldn||mapDrag?.moved)return;const rect=mapCanvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,hit=mapHits.map(p=>({...p,gap:Math.hypot(p.sx-x,p.sy-y)})).sort((a,b)=>a.gap-b.gap)[0];if(hit?.gap<12){destination(hit.id);choice.value=hit.id;}});
   mapCanvas.style.touchAction='none';mapCanvas.addEventListener('wheel',e=>{if(!s.ldn||!mapTransform)return;e.preventDefault();e.stopPropagation();const t=mapTransform,r=mapCanvas.getBoundingClientRect(),dx=e.clientX-r.left-t.w/2,dz=-(e.clientY-r.top-t.h/2),worldX=t.cx+dx/t.scale,worldZ=t.cz+dz/t.scale;mapZoom=C(mapZoom*Math.exp(C(-e.deltaY*.003,-.5,.5)),1,60);const scale=t.fit*mapZoom;mapCentre={x:worldX-dx/scale,z:worldZ-dz/scale};app.drawMap();},{passive:false});
   mapCanvas.addEventListener('pointerdown',e=>{if(!s.ldn||!mapTransform)return;mapDrag={x:e.clientX,y:e.clientY,cx:mapTransform.cx,cz:mapTransform.cz,moved:false};mapCanvas.setPointerCapture(e.pointerId);});
   mapCanvas.addEventListener('pointermove',e=>{if(!mapDrag||!mapCanvas.hasPointerCapture(e.pointerId))return;const dx=e.clientX-mapDrag.x,dy=e.clientY-mapDrag.y;if(Math.hypot(dx,dy)>4)mapDrag.moved=true;if(mapDrag.moved){mapCentre={x:mapDrag.cx-dx/mapTransform.scale,z:mapDrag.cz+dy/mapTransform.scale};app.drawMap();}});
   app.drawMap=function(){if(!s.ldn)return originalMap?.();const w=mapCanvas.clientWidth||300,h=mapCanvas.clientHeight||380,dpr=Math.min(2,devicePixelRatio);if(mapCanvas.width!==w*dpr||mapCanvas.height!==h*dpr){mapCanvas.width=w*dpr;mapCanvas.height=h*dpr;}const g=mapCanvas.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);const xs=G.nodes.map(n=>n.e*1000),zs=G.nodes.map(n=>n.n*1000),minX=Math.min(...xs),maxX=Math.max(...xs),minZ=Math.min(...zs),maxZ=Math.max(...zs),fit=Math.min((w-24)/(maxX-minX),(h-30)/(maxZ-minZ)),scale=fit*mapZoom,cx=mapCentre?.x??(minX+maxX)/2,cz=mapCentre?.z??(minZ+maxZ)/2,X=x=>w/2+(x-cx)*scale,Y=z=>h/2-(z-cz)*scale;mapTransform={w,h,fit,scale,cx,cz};g.fillStyle='#15222c';g.fillRect(0,0,w,h);const line=(points,color,width)=>{g.beginPath();points.forEach((p,i)=>i?g.lineTo(X(p.x),Y(p.z)):g.moveTo(X(p.x),Y(p.z)));g.strokeStyle=color;g.lineWidth=width;g.stroke();};for(const r of roads)line([pos(r.A),pos(r.B)],'#8a979e',1.5);plan();if(nav)line(routePoints,'#59b6ff',3);mapHits=locations.map(p=>({...p,sx:X(p.x),sy:Y(p.z)}));for(const p of mapHits){g.fillStyle=p.id===nav?.id?'#f4be54':'#c7a5e0';g.beginPath();g.arc(p.sx,p.sy,p.id===nav?.id?5:2.5,0,Math.PI*2);g.fill();}const p=playerPoint();g.fillStyle='#fff';g.beginPath();g.arc(X(p.x),Y(p.z),4,0,Math.PI*2);g.fill();g.font='11px system-ui';g.fillStyle='#f2f7fb';g.fillText(nav?'To '+nav.name:'Tap a location or choose a destination',8,16,w-16);};
  }
  app.cityNetwork={prepare,step,at,curvature,playerPoint,drawRear,trafficStep,draw,locations,destination,trafficPose,actorPose,arrivalSpeedLimit,traffic,roads,buildings,primitives,inspect:()=>({mapView:mapTransform?{...mapTransform,zoom:mapZoom}:null,destination:nav?.name,arrived:!!nav?.arrived,routePoints,routeLinks:routeLinks.map(l=>l.road.name),roads:roads.length,buildings:buildings.length,traffic:traffic.length}),get destinationPoint(){return nav;},get routePoints(){plan();return routePoints;}};
  const physics=app.updatePhysics;app.updatePhysics=function(dt){if(s.ldn)prepare();return physics.call(app,dt);};
 }
 root.MUCSCityNetwork={install:installCityNetwork};
})(typeof window==='undefined'?globalThis:window);
