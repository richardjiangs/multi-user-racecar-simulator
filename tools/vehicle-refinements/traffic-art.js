/* Individually proportioned city vehicles. Geometry is in metres; panels, glass,
   lamps, trim, wheels and fittings are hand-authored, not rectangular sprites. */
(function(root){
 function drawTrafficVehicle(ctx,x,y,scale,car,front,night,time,view=.22){
  if(!(scale>0)||!Number.isFinite(x+y+scale))return;
  let kind=car.kind||'',name=car.name||'';
  if(!kind){kind=/Cullinan/.test(name)?'cullinan':/Phantom/.test(name)?'phantom':/Ghost/.test(name)?'ghost':/Bentley/.test(name)?'bentley':/Maybach/.test(name)?'maybach':/Range Rover/.test(name)?'range':/taxi/i.test(name)?'cab':/bus/i.test(name)?'ddbus':/van/i.test(name)?'van':/police/i.test(name)?'police':car.dakar?/Ford/.test(name)?'raptor':/Toyota/.test(name)?'hilux':/Dacia/.test(name)?'sandrider':'hunter':'saloon';}
  const models={
   cab:[1.91,1.89,4.86,.9,.72,.90,'#11161a'],yellowcab:[1.99,1.48,5.38,.77,.53,.76,'#eac324'],crown:[1.70,1.52,4.69,.79,.56,.72,'#161b21'],santana:[1.70,1.43,4.55,.79,.55,.70,'#285a86'],
   ddbus:[2.55,4.40,11.23,.98,.94,.97,'#b82531'],bus:[2.55,3.15,12,.98,.91,.96,'#276c50'],toeibus:[2.49,3.05,10.75,.97,.94,.97,'#e4dfcb'],
   van:[2.02,2.65,5.93,.92,.91,.91,'#dde1e5'],hiace:[1.88,2.05,4.84,.94,.88,.95,'#e5e7e3'],keitruck:[1.48,1.83,3.40,.94,.92,.91,'#e5e6df'],truck:[2.45,3.45,8.5,.99,.98,.98,'#839095'],
   saloon:[1.86,1.46,4.80,.79,.53,.76,null],hatch:[1.79,1.50,4.25,.86,.61,.81,null],suv:[1.98,1.78,4.88,.90,.65,.87,null],
   ghost:[1.98,1.57,5.55,.85,.57,.82,'#232d34'],phantom:[2.02,1.65,5.98,.88,.59,.85,'#e4dfd2'],cullinan:[2.16,1.84,5.34,.93,.64,.90,'#303f43'],bentley:[1.99,1.49,5.32,.83,.54,.77,'#194839'],maybach:[1.92,1.51,5.47,.80,.53,.77,'#232830'],range:[2.05,1.87,5.25,.95,.71,.91,'#4e5a50'],police:[1.88,1.52,4.95,.82,.55,.78,'#e6e8e6'],
   raptor:[2.30,2.10,5.05,.94,.71,.76,'#1b458e'],hilux:[2.30,1.89,4.81,.93,.67,.80,'#e5e5e3'],sandrider:[2.29,1.81,4.14,.88,.52,.66,'#bcae8b'],hunter:[2.30,1.95,4.60,.92,.57,.76,'#c92b32']
  };
  const rider=['cycle','ebike','scooter'].includes(kind),m=models[kind]||models.saloon,[W,H,L,shoulder,roof]=m;
  const body=car.body||m[6]||`hsl(${car.hue||205},20%,${car.tone||40}%)`,bus=['ddbus','bus','toeibus'].includes(kind),van=['van','hiace','truck','keitruck'].includes(kind),rally=['raptor','hilux','sandrider','hunter'].includes(kind),lux=['ghost','phantom','cullinan'].includes(kind),box=bus||kind==='truck';
  const worldYaw=Number.isFinite(car.viewYaw),v=worldYaw?car.viewYaw:Math.max(-.48,Math.min(.48,view)),cs=Math.cos(v),sn=Math.sin(v),direction=front?1:-1,nearSide=sn>=0?1:-1;
  const P=(a,b,c)=>worldYaw?[(a*cs-c*sn)*scale,(-b+(a*sn+c*cs)*.10)*scale]:[(a*cs+c*direction*sn)*scale,(-b-(c*direction*cs-a*sn)*.10)*scale];
  ctx.save();ctx.translate(x,y);
  const poly=(points,fill,stroke,width=.012)=>{ctx.beginPath();for(let i=0;i<points.length;i++){const q=P(...points[i]);i?ctx.lineTo(...q):ctx.moveTo(...q);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(fill===body){const gloss=ctx.createLinearGradient(0,-H*scale,0,0);gloss.addColorStop(0,'#ffffff30');gloss.addColorStop(.6,'#ffffff00');gloss.addColorStop(1,'#00000045');ctx.fillStyle=gloss;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(.4,width*scale);ctx.stroke();}};
  const line=(points,color,width=.016)=>{ctx.beginPath();points.forEach((p,i)=>{const q=P(...p);i?ctx.lineTo(...q):ctx.moveTo(...q);});ctx.strokeStyle=color;ctx.lineWidth=Math.max(.45,width*scale);ctx.stroke();};
  const panel=(a,b,c,d,e,f,color)=>poly([[a,b,c],[d,b,c],[d,e,f],[a,e,f]],color);
  const faceZ=-L/2,backZ=L/2;
  const shadow=ctx.createRadialGradient(0,0,0,0,0,W*scale);shadow.addColorStop(0,'#0009');shadow.addColorStop(1,'#0000');ctx.fillStyle=shadow;ctx.beginPath();ctx.ellipse(0,0,(W*.65+Math.abs(sn)*L*.4)*scale,.17*scale,0,0,Math.PI*2);ctx.fill();
  if(rider){
   const pedal=kind==='cycle',R=pedal?.34:.23;
   for(const z of [-.58,.58]){const p=P(0,R,z);ctx.strokeStyle='#11161a';ctx.lineWidth=scale*(pedal?.04:.10);ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(1,.085*scale),R*scale,0,0,Math.PI*2);ctx.stroke();for(let i=0;i<10;i++){const a=i*Math.PI/5+time*3;line([[0,R,z],[.02,R+R*Math.sin(a),z+R*Math.cos(a)]],'#909a9c',.009);}}
   line([[0,.34,-.58],[0,.62,.02],[0,.34,.58],[0,.34,-.58],[0,.9,-.36],[0,.85,.05]],kind==='ebike'?'#7eafbb':'#42635a',.06);
   line([[-.24,1,-.4],[.24,1,-.4]],'#33393c',.055);
   poly([[-.20,.82,.04],[.19,.82,.04],[.23,1.27,.10],[-.23,1.27,.10]],'#2d425a');
   for(const s of [-1,1]){line([[s*.18,1.17,.08],[s*.29,1.01,-.16],[s*.24,1,-.40]],'#bda58c',.075);line([[s*.12,.84,.04],[s*.19,.55,-.15],[s*.12,.28,.02]],'#24313e',.1);}
   const p=P(0,1.49,.11);ctx.fillStyle='#d5d8d5';ctx.beginPath();ctx.ellipse(p[0],p[1],.16*scale,.18*scale,0,0,Math.PI*2);ctx.fill();line([[-.12,1.45,-.04],[.12,1.45,-.04]],'#20343e',.09);ctx.restore();return;
  }
  // Wheels are independent volumes, with sidewalls, hubs and rotating spokes.
  const R=rally?.47:bus||kind==='truck'?.48:kind==='keitruck'?.27:.34,axles=[-L*.31,L*.32],tire=.21;
  for(const z of axles)for(const side of [-1,1]){
   const p=P(side*(W*.45),R,z),rx=Math.max(.035,Math.abs(sn)*R)*scale;
   ctx.fillStyle='#111416';ctx.beginPath();ctx.ellipse(p[0],p[1],rx+tire*scale*.35,R*scale,0,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle='#303639';ctx.lineWidth=.045*scale;ctx.stroke();ctx.fillStyle='#a0a5a6';ctx.beginPath();ctx.ellipse(p[0],p[1],rx*.57,R*.57*scale,0,0,Math.PI*2);ctx.fill();
   for(let i=0;i<10;i++){const a=i*Math.PI/5+time*(car.speedMps||car.speed||0)/R;ctx.strokeStyle='#2b3034';ctx.lineWidth=Math.max(.4,.025*scale);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+Math.cos(a)*rx*.56,p[1]+Math.sin(a)*R*.56*scale);ctx.stroke();}
  }
  const low=R*.68,belt=box?H*.46:van?H*.48:kind==='cab'?H*.53:rally?H*.60:H*.64,hood=box?belt:van?H*.53:kind==='cab'?H*.57:rally?H*.64:H*.66,roofStart=box?-L*.49:van?-L*.42:-L*.16,roofEnd=box?L*.49:kind==='keitruck'?-L*.02:rally?L*.22:L*.27;
  const rings=[[-L*.5,W*.43,hood*.85],[-L*.37,W*.50,hood],[roofStart,W*.50,belt],[roofEnd,W*.50,belt],[L*.4,W*.48,hood*.94],[L*.5,W*.43,hood*.88]];
  // Far flank, nose/tail, near flank, bonnet and boot receive separate lighting.
  for(const side of [nearSide]){poly(rings.map(([z,w,h])=>[side*w,h,z]).concat([[side*W*.43,low,L*.5],[side*W*.43,low,-L*.5]]),body,'#172027');poly(rings.map(([z,w,h])=>[side*w,h,z]).concat([[side*W*.43,low,L*.5],[side*W*.43,low,-L*.5]]),side===-1?'#0003':'#ffffff0c');}
  if(front)poly([[-W*.43,low,faceZ],[W*.43,low,faceZ],[W*.43,hood*.85,faceZ],[-W*.43,hood*.85,faceZ]],body,'#1b2329');
  poly([[-W*.43,hood*.85,faceZ],[W*.43,hood*.85,faceZ],[W*.5,hood,-L*.37],[W*.5,belt,roofStart],[-W*.5,belt,roofStart],[-W*.5,hood,-L*.37]],body,'#ffffff24');
  poly([[-W*.5,belt,roofEnd],[W*.5,belt,roofEnd],[W*.43,hood*.88,backZ],[-W*.43,hood*.88,backZ]],body,'#ffffff24');
  const roofW=W*(bus||van?roof:shoulder)*.5,baseW=W*.46;
  const upright=bus||van||kind==='cab',ra=upright?.22:['suv','cullinan','range'].includes(kind)?.43:.62,rb=upright?.16:rally?.32:.52;
  for(const side of [nearSide]){
   poly([[side*baseW,belt,roofStart],[side*roofW,H,roofStart+ra],[side*roofW,H,roofEnd-rb],[side*baseW,belt,roofEnd]],body,'#bac3c55c');
   const glazedEnd=['van','truck'].includes(kind)?roofStart+L*.22:roofEnd;
   poly([[side*(baseW-.035),belt+.09,roofStart+.16],[side*(roofW+.007),H-.08,roofStart+ra+.07],[side*(roofW+.007),H-.08,glazedEnd-rb-.08],[side*(baseW-.035),belt+.09,glazedEnd-.16]],'#243e4b','#a6bcc450');
   const count=bus?6:box?0:2;
   for(let i=1;i<count;i++){const z=roofStart+(roofEnd-roofStart)*i/count;line([[side*baseW,belt,z],[side*roofW,H,z]],body,bus?.09:.065);}
   for(const z of [roofStart+.45,roofEnd-.38]){line([[side*(W*.498),belt-.025,z],[side*(W*.492),low+.06,z]],'#101a2455');line([[side*(W*.504),belt-.095,z+.06],[side*(W*.504),belt-.095,z+.22]],'#c8cece',.025);}
  }
  poly([[-roofW,H,roofStart+ra],[roofW,H,roofStart+ra],[roofW,H,roofEnd-rb],[-roofW,H,roofEnd-rb]],body,'#ffffff38');
  if(!front)poly([[-W*.43,low,backZ],[W*.43,low,backZ],[W*.43,hood*.88,backZ],[-W*.43,hood*.88,backZ]],body,'#1b2329');
  const glass=ctx.createLinearGradient(0,-H*scale,0,-belt*scale);glass.addColorStop(0,'#12232e');glass.addColorStop(.48,'#537383');glass.addColorStop(.53,'#304958');glass.addColorStop(1,'#192f3b');
  for(const end of [front?-1:1]){const z=end<0?roofStart:roofEnd,rz=z+(end<0?ra:-rb);poly([[-baseW,belt,z],[baseW,belt,z],[roofW,H,rz],[-roofW,H,rz]],body,'#a4b1b35c');if(!(van&&!front&&kind!=='keitruck'&&kind!=='hiace'))poly([[-baseW*.90,belt+.07,z],[baseW*.90,belt+.07,z],[roofW*.91,H-.075,rz],[-roofW*.91,H-.075,rz]],glass,'#d0dad65f');line([[-baseW*.65,belt+.09,z],[baseW*.12,belt+.34,z+.02]],'#141e26',.019);}
  // Near-side wheel openings, rolled arches and recessed rotating alloy hubs.
  for(const z0 of axles){const side=nearSide,p=P(side*W*.505,R,z0),rx=Math.max(.055,Math.abs(sn)*R)*scale;
   ctx.fillStyle='#0b1116';ctx.beginPath();ctx.ellipse(p[0],p[1],rx+.055*scale,R*1.04*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=body;ctx.lineWidth=.025*scale;ctx.stroke();
   ctx.fillStyle='#1a2126';ctx.beginPath();ctx.ellipse(p[0],p[1],rx,R*.94*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#515b60';ctx.lineWidth=.018*scale;ctx.stroke();
   ctx.fillStyle='#4b565d';ctx.beginPath();ctx.ellipse(p[0],p[1],rx*.70,R*.62*scale,0,0,Math.PI*2);ctx.fill();
   for(let i=0;i<10;i++){const a=i*Math.PI/5+time*(car.speedMps||car.speed||0)/R;ctx.strokeStyle='#c5ccca';ctx.lineWidth=Math.max(.45,.024*scale);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(p[0]+Math.cos(a)*rx*.67,p[1]+Math.sin(a)*R*.59*scale);ctx.stroke();}
  }
  const z=(front?faceZ-.016:backZ+.016),fy=hood*.85,chrome='#c4cbca',black='#131b21';
  // Rolled bumper corners and a crowned bonnet give the coachwork its own
  // continuous silhouette instead of an exposed rectangular front panel.
  if(!bus&&!van){
   const q=(xx,yy)=>P(xx,yy,z-.01),corner=lux?.065:kind==='cab'?.07:.12;
   ctx.beginPath();ctx.moveTo(...q(-W*.39,low));ctx.quadraticCurveTo(...q(-W*.48,low),...q(-W*.48,low+corner));
   ctx.lineTo(...q(-W*.47,fy*.78));ctx.quadraticCurveTo(...q(-W*.46,fy*1.02),...q(-W*.32,fy*1.025));
   ctx.quadraticCurveTo(...q(0,fy*1.08),...q(W*.32,fy*1.025));ctx.quadraticCurveTo(...q(W*.46,fy*1.02),...q(W*.47,fy*.78));
   ctx.lineTo(...q(W*.48,low+corner));ctx.quadraticCurveTo(...q(W*.48,low),...q(W*.39,low));ctx.closePath();ctx.fillStyle=body;ctx.fill();
   const coat=ctx.createLinearGradient(0,-fy*scale,0,-low*scale);coat.addColorStop(0,'#ffffff24');coat.addColorStop(.38,'#ffffff05');coat.addColorStop(.8,'#00000012');coat.addColorStop(1,'#0000005c');ctx.fillStyle=coat;ctx.fill();ctx.strokeStyle='#17263090';ctx.lineWidth=.012*scale;ctx.stroke();
   const q1=q(-W*.34,fy*.54),q2=q(W*.34,fy*.54);ctx.strokeStyle='#aabfc33a';ctx.lineWidth=.018*scale;ctx.beginPath();ctx.moveTo(...q1);ctx.quadraticCurveTo(...q(0,fy*.49),...q2);ctx.stroke();
   for(const side of [-1,1]){line([[side*W*.23,hood*.96,-L*.36],[side*W*.33,belt,roofStart]],'#cedbdd3b',.012);}
   if(lux||kind==='maybach')for(const side of [nearSide])line([[side*W*.505,belt-.03,roofStart],[side*W*.505,belt-.03,roofEnd]],'#d5c9a77a',.012);
  }
  // Direction selects the actual nose or tail: never red lamps on an approaching car.
  if(front){
   panel(-W*.23,low+.04,z,W*.23,fy*.78,z,black);
   if(lux||kind==='bentley'||kind==='maybach'||kind==='crown'||kind==='cab'){
    const tall=lux||kind==='cab',gw=lux?.42:kind==='bentley'?.57:.58,gh=tall?fy*.7:fy*.39,gy=fy-gh;
    panel(-W*gw/2,gy,z-.01,W*gw/2,fy,z-.01,black);line([[-W*gw/2,gy,z-.02],[-W*gw/2,fy,z-.02],[W*gw/2,fy,z-.02],[W*gw/2,gy,z-.02]],chrome,.035);
    for(let i=-7;i<=7;i++){const xx=i*W*gw/15;line([[xx,gy+.02,z-.02],[xx,fy-.03,z-.02]],chrome,lux?.017:.010);}
    if(lux){line([[0,fy+.02,z],[0,fy+.11,z+.04]],chrome,.018);line([[-.05,fy+.09,z+.02],[0,fy+.12,z+.04],[.05,fy+.09,z+.02]],chrome,.016);}
   }else if(!bus){for(let i=0;i<4;i++)line([[-W*.23,low+.08+i*.04,z-.02],[W*.23,low+.08+i*.04,z-.02]],'#58676c',.015);}
   for(const side of [-1,1]){
    if(kind==='bentley'||kind==='cab'){for(const off of (kind==='cab'?[0]:[0,.17])){const p=P(side*(W*.37-off),fy*.77,z-.04);ctx.fillStyle=night?'#fffbd3':'#dce9e9';ctx.beginPath();ctx.ellipse(p[0],p[1],.075*scale,.075*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=chrome;ctx.lineWidth=.014*scale;ctx.stroke();}}
    else {
     const swept=['maybach','saloon','hatch','suv','police','yellowcab'].includes(kind),inner=W*.28,outer=W*.43,yy=fy*.78;
     poly([[side*inner,yy-.055,z-.035],[side*outer,yy-.045,z-.035],[side*(outer+.012),yy+.075,z-.035],[side*(inner+(swept?.07:0)),yy+.075,z-.035]],'#141f27','#879b9c',.012);
     const count=lux||kind==='santana'?2:1;
     for(let j=0;j<count;j++){const xx=side*(inner+.07+j*.10),p=P(xx,yy+.015,z-.045);ctx.fillStyle=night?'#fff8d1':'#d1e4e8';ctx.beginPath();ctx.ellipse(p[0],p[1],.038*scale,.041*scale,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8fa2aa';ctx.lineWidth=.009*scale;ctx.stroke();}
     line([[side*(inner+.025),yy+.075,z-.04],[side*outer,yy+.075,z-.04],[side*(outer+.01),yy+.015,z-.04]],'#f1f3d7',.018);
     if(kind==='cullinan')line([[side*outer,yy+.075,z-.05],[side*outer,yy-.13,z-.05]],'#f7f4d7',.022);
     if(['crown','santana','yellowcab'].includes(kind))panel(side*(outer-.025),yy-.04,z-.045,side*(outer+.008),yy+.065,z-.045,'#c89433');
    }
   }
  }else{
   for(const side of [-1,1]){const vertical=['cab','cullinan','van','hiace','range','raptor','hilux'].includes(kind);panel(side*W*.33,vertical?fy*.31:fy*.72,z-.035,side*W*.43,fy*.9,z-.035,car.brake?'#ff492e':'#a31b20');if(!vertical)line([[side*W*.29,fy*.83,z-.04],[side*W*.43,fy*.83,z-.04]],'#f46d61',.026);}
   line([[-W*.35,fy*.55,z-.02],[W*.35,fy*.55,z-.02]],chrome,.018);
   if(kind==='range')panel(-W*.44,fy*.91,z-.02,W*.44,fy*1.02,z-.02,'#10171a');
   for(const side of [-1,1])panel(side*W*.26,low+.025,z-.03,side*W*.33,low+.08,z-.03,'#111518');
  }
  // Bumpers, registration plate, seams, mirrors, visible tyre clearance.
  line([[-W*.43,low+.025,z],[W*.43,low+.025,z]],van||rally?'#30383c':chrome,rally?.085:.025);
  panel(-.19,low+.08,z-.05,.19,low+.17,z-.05,front?'#eeefe6':'#e4c85b');
  for(let i=0;i<6;i++)line([[-.145+i*.054,low+.095,z-.06],[-.145+i*.054,low+.15,z-.06]],'#263136',.012);
  for(const side of [-1,1]){poly([[side*W*.47,belt+.20,roofStart+.16],[side*W*.61,belt+.20,roofStart+.16],[side*W*.62,belt+.30,roofStart+.20],[side*W*.48,belt+.32,roofStart+.21]],body,'#18262b');}
  if(['cab','yellowcab','crown'].includes(kind)){panel(-.19,H+.025,roofStart+.60,.19,H+.13,roofStart+.60,kind==='yellowcab'?'#151c23':'#eccc62');const p=P(0,H+.08,roofStart+.59);ctx.font=`bold ${Math.max(3,.07*scale)}px sans-serif`;ctx.fillStyle=kind==='yellowcab'?'#eecb39':'#101718';ctx.textAlign='center';ctx.fillText('TAXI',p[0],p[1]);}
  if(bus){
   // Separate upper/lower glazing and destination blinds for the double-decker.
   if(kind==='ddbus'){
    const side=nearSide;
    for(let j=0;j<6;j++){const za=roofStart+.35+j*(roofEnd-roofStart-.7)/6,zb=za+(roofEnd-roofStart-.7)/6-.10;
     poly([[side*W*.503,H*.29,za],[side*W*.503,H*.29,zb],[side*W*.503,H*.46,zb],[side*W*.503,H*.46,za]],glass,'#bcc7c84a');
    }
    const atY=(y,z0)=>[side*(baseW+(roofW-baseW)*(y-belt)/(H-belt)+.006),y,z0];
    poly([atY(H*.48,roofStart+.1),atY(H*.48,roofEnd-.1),atY(H*.60,roofEnd-.1),atY(H*.60,roofStart+.1)],body);
    panel(-W*.43,H*.59,z-.03,W*.43,H*.87,z-.03,glass);panel(-W*.43,H*.29,z-.03,W*.43,H*.51,z-.03,glass);line([[0,H*.59,z-.04],[0,H*.87,z-.04]],body,.06);}
   else panel(-W*.43,H*.50,z-.03,W*.43,H*.85,z-.03,glass);
   panel(-W*.38,H*.89,z-.03,W*.38,H*.96,z-.03,'#152123');const p=P(0,H*.905,z-.04);ctx.fillStyle='#e9d98d';ctx.font=`${Math.max(3,.13*scale)}px monospace`;ctx.textAlign='center';ctx.fillText(kind==='ddbus'?'11  VICTORIA':kind==='toeibus'?'都営バス':'CITY',p[0],p[1]);
   for(let i=0;i<6;i++)line([[-W*.28,H*.17+i*.022,z-.04],[W*.28,H*.17+i*.022,z-.04]],'#212c30',.013);
   if(kind==='toeibus')panel(-W*.47,H*.33,z-.045,W*.47,H*.41,z-.045,'#267ebb');
  }
  if(van&&!front){for(const side of [-1,1]){line([[side*.02,low+.10,z-.04],[side*.02,H-.10,z-.04]],'#25303b',.015);line([[side*W*.38,H*.35,z-.04],[side*W*.38,H*.82,z-.04]],chrome,.015);}}
  if(kind==='truck'&&!front){panel(-W*.48,low+.05,z-.04,W*.48,H-.05,z-.04,'#c1c7c5');for(let i=0;i<14;i++)line([[-W*.46,.45+i*.19,z-.06],[W*.46,.45+i*.19,z-.06]],'#737e82',.013);line([[0,.4,z-.08],[0,H-.15,z-.08]],chrome,.032);}
  if(kind==='keitruck'&&!front){panel(-W*.46,low+.05,z-.08,W*.46,H*.5,z-.08,'#e0e4df');for(let i=0;i<3;i++)line([[-W*.4,low+.14+i*.10,z-.09],[W*.4,low+.14+i*.10,z-.09]],'#83908d',.012);}
  if(rally){for(const side of [-1,1]){line([[side*W*.48,.45,z+.13],[side*W*.48,.65,z-.03],[side*W*.35,.81,z-.04]],'#232d31',.08);panel(side*.13,low+.1,z-.09,side*.19,low+.23,z-.09,'#ea4731');}panel(-W*.18,fy*.75,z-.06,W*.18,fy*.90,z-.06,car.stripe||'#d8cd35');if(!front){for(const side of [-1,1]){const p=P(side*.35,.95,faceZ+.4);ctx.strokeStyle='#181e21';ctx.lineWidth=.18*scale;ctx.beginPath();ctx.ellipse(p[0],p[1],.25*scale,.30*scale,0,0,Math.PI*2);ctx.stroke();}}}
  if(kind==='police'){
   for(let i=0;i<8;i++)panel(-W*.43+i*W*.107,H*.30,z-.075,-W*.43+(i+1)*W*.107,H*.45,z-.075,i%2?'#17569f':'#d5e83c');
   panel(-.5,H+.035,roofStart+.68,.5,H+.13,roofStart+.68,'#283339');
   for(const side of [-1,1]){const p=P(side*.35,H+.115,roofStart+.65),on=(Math.floor(time*9)%2===(side<0?0:1));ctx.fillStyle=on?'#62bdff':'#123575';ctx.fillRect(p[0]-.12*scale,p[1]-.045*scale,.24*scale,.09*scale);if(on){const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],.45*scale);g.addColorStop(0,'#55aaff9c');g.addColorStop(1,'#55aaff00');ctx.fillStyle=g;ctx.fillRect(p[0]-.45*scale,p[1]-.45*scale,.9*scale,.9*scale);}}
  }
  ctx.restore();
 }
 root.MUCSVehicleArt={drawTrafficVehicle};
})(typeof window==='undefined'?globalThis:window);
