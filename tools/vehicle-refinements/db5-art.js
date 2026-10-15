/* DB5: Black Pearl metal fascia, grille-outline binnacle, Smiths instruments,
   Lucas ammeter, period clock/radio and riveted wood wheel. Reference photographs
   and provenance are recorded in docs/OCTOBER_REFINEMENTS.md. */
(function(root){
 function drawDB5Dashboard(ctx,w,h,s,app,overview=false){
  const u=Math.min(w/1400,h/(overview?420:720)),cx=w*(overview?.64:.50),dy=overview?h*.15:h*.735,cy=dy+73*u;
  const save=()=>ctx.save(),restore=()=>ctx.restore();
  const shape=(path,fill,stroke,width=1)=>{ctx.beginPath();path(ctx);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
  const grad=(y0,y1,colors)=>{const g=ctx.createLinearGradient(0,y0,0,y1);colors.forEach(([p,c])=>g.addColorStop(p,c));return g;};
  const chrome=grad(dy,dy+170*u,[[0,'#929c9f'],[.15,'#edf1ed'],[.31,'#77868d'],[.51,'#eef0e9'],[.65,'#5d6b73'],[.90,'#ced7d6'],[1,'#4b555d']]);
  save();
  if(overview){ctx.fillStyle='#181c20';ctx.fillRect(0,0,w,h);for(let side of [-1,1]){ctx.fillStyle='#22272b';ctx.beginPath();ctx.roundRect(w*(side<0?.10:.78),h*.52,w*.18,h*.60,28*u);ctx.fill();ctx.strokeStyle='#394044';ctx.lineWidth=1;for(let i=0;i<9;i++){ctx.beginPath();ctx.moveTo(w*(side<0?.11:.79),h*.57+i*15*u);ctx.lineTo(w*(side<0?.27:.95),h*.57+i*15*u);ctx.stroke();}}}
  // Leather crash roll: restrained grain, rolled stitching and demister slots.
  ctx.fillStyle=grad(dy-17*u,h,[[0,'#303439'],[.07,'#15191e'],[1,'#060b10']]);ctx.fillRect(0,dy-10*u,w,h-dy+10*u);
  ctx.strokeStyle='#555b5b';ctx.lineWidth=u;ctx.beginPath();ctx.moveTo(0,dy-9*u);ctx.bezierCurveTo(w*.2,dy-23*u,w*.75,dy-23*u,w,dy-9*u);ctx.stroke();
  for(let i=0;i<2;i++){ctx.fillStyle='#070d12';ctx.beginPath();ctx.roundRect(cx+(i?310:-430)*u,dy-10*u,135*u,5*u,2*u);ctx.fill();for(let n=0;n<15;n++){ctx.fillStyle='#41494b';ctx.fillRect(cx+(i?313:-427)*u+n*8.5*u,dy-10*u,1*u,5*u);}}
  // The metal instrument panel is a wide, shallow Aston grille shape. It rises
  // only 2.5% of the viewport above the fascia and never fills the windscreen.
  const panelPath=p=>{p.moveTo(cx-268*u,dy+125*u);p.quadraticCurveTo(cx-298*u,dy+40*u,cx-231*u,dy+30*u);p.bezierCurveTo(cx-168*u,dy+28*u,cx-179*u,dy-17*u,cx-115*u,dy-19*u);p.lineTo(cx+116*u,dy-19*u);p.bezierCurveTo(cx+180*u,dy-17*u,cx+169*u,dy+28*u,cx+229*u,dy+30*u);p.quadraticCurveTo(cx+298*u,dy+40*u,cx+268*u,dy+125*u);p.quadraticCurveTo(cx,dy+152*u,cx-268*u,dy+125*u);p.closePath();};
  shape(panelPath,grad(dy-20*u,dy+150*u,[[0,'#4b5052'],[.22,'#272c30'],[.58,'#353b3e'],[1,'#191f23']]),'#10171c',10*u);
  shape(panelPath,'#00000000',chrome,2*u);
  save();ctx.beginPath();panelPath(ctx);ctx.clip();ctx.fillStyle='#c2ced311';for(let yy=0;yy<47;yy++)for(let xx=0;xx<155;xx++){const f=(xx*17+yy*31)%11;if(f<2)ctx.fillRect(cx-286*u+xx*3.7*u,dy-20*u+yy*3.7*u,.65*u,.65*u);}restore();
  const label=(text,x,y,size,color='#dce0d9',font='Arial')=>{ctx.fillStyle=color;ctx.font=`${size*u}px ${font}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,x,y);};
  function dial(x,y,r,value,max,title,unit,ticks,minor=5,red=null){
   save();ctx.translate(x,y);const R=r*u;const bezel=ctx.createLinearGradient(-R,-R,R,R);[[0,'#343e45'],[.2,'#f2f3ed'],[.43,'#89979c'],[.58,'#edf0e9'],[.81,'#4c5a62'],[1,'#acb9ba']].forEach(c=>bezel.addColorStop(...c));
   for(const [rad,col] of [[1.05,'#080f14'],[1,bezel],[.955,'#121b21'],[.929,'#8b999b'],[.910,'#10171b']]){ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,R*rad,0,Math.PI*2);ctx.fill();}
   const face=ctx.createRadialGradient(-R*.2,-R*.3,0,0,0,R);face.addColorStop(0,'#263037');face.addColorStop(.75,'#11191e');face.addColorStop(1,'#060b10');ctx.fillStyle=face;ctx.beginPath();ctx.arc(0,0,R*.89,0,Math.PI*2);ctx.fill();
   const a0=Math.PI*.77,span=Math.PI*1.46,N=ticks*minor;
   for(let i=0;i<=N;i++){const a=a0+span*i/N,big=i%minor===0;ctx.strokeStyle='#d4dedb';ctx.lineWidth=R*(big?.014:.007);ctx.beginPath();ctx.moveTo(Math.cos(a)*R*(big?.69:.76),Math.sin(a)*R*(big?.69:.76));ctx.lineTo(Math.cos(a)*R*.84,Math.sin(a)*R*.84);ctx.stroke();if(big){ctx.fillStyle='#dee5de';ctx.font=`${R*(r>40?.18:.19)}px 'Arial Narrow',Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.round(i/N*max)),Math.cos(a)*R*.56,Math.sin(a)*R*.56);}}
   if(red!=null){ctx.strokeStyle='#b14a43';ctx.lineWidth=R*.036;ctx.beginPath();ctx.arc(0,0,R*.82,a0+span*red/max,a0+span);ctx.stroke();}
   ctx.fillStyle='#d0dad4';ctx.font=`${R*.115}px Arial`;ctx.textAlign='center';ctx.fillText(title,0,-R*.22);ctx.font=`${R*.10}px Arial`;ctx.fillText(unit,0,R*.28);ctx.font=`${R*.095}px Georgia`;ctx.fillText(title==='AMPS'?'LUCAS':'SMITHS',0,R*.49);
   if(unit==='M.P.H.'){
    const miles=Math.floor(Math.abs(s.distanceM)/1609.344+37106).toString().padStart(5,'0');ctx.fillStyle='#050a0e';ctx.fillRect(-R*.31,-R*.04,R*.62,R*.16);ctx.font=`${R*.13}px monospace`;ctx.fillStyle='#d7dace';for(let i=0;i<5;i++){ctx.fillText(miles[i],(-.25+i*.125)*R,R*.045);ctx.strokeStyle='#525d59';ctx.lineWidth=.4*u;ctx.strokeRect((-.31+i*.125)*R,-R*.04,R*.125,R*.16);}
   }
   const a=a0+span*Math.max(0,Math.min(1,value/max));ctx.rotate(a);ctx.fillStyle='#dddcc4';ctx.beginPath();ctx.moveTo(-R*.13,-R*.025);ctx.lineTo(R*.80,0);ctx.lineTo(-R*.13,R*.025);ctx.closePath();ctx.fill();ctx.rotate(-a);ctx.fillStyle='#a4afae';ctx.beginPath();ctx.arc(0,0,R*.078,0,Math.PI*2);ctx.fill();ctx.fillStyle='#3c4649';ctx.beginPath();ctx.arc(0,0,R*.042,0,Math.PI*2);ctx.fill();
   // A narrow glazing reflection leaves every numeral and needle legible.
   ctx.strokeStyle='#ffffff14';ctx.lineWidth=R*.028;ctx.beginPath();ctx.arc(0,0,R*.87,Math.PI*1.02,Math.PI*1.78);ctx.stroke();restore();
  }
  dial(cx-86*u,cy-17*u,58,Math.abs(s.speedMps)*2.236936,180,'','M.P.H.',9,4);
  dial(cx+86*u,cy-17*u,58,s.rpm/100,60,'','R.P.M. x100',6,5,55);
  dial(cx,dy+25*u,28,s.ignition?32+Math.min(40,s.rpm*.008):0,100,'OIL','LB / SQ IN',5,2);
  dial(cx-200*u,dy+70*u,31,(s.fuel??.7)*100,100,'FUEL','E       F',4,2);
  dial(cx-166*u,dy+123*u,24,s.waterTempC??s.waterTemp??75,120,'WATER','°C',4,2);
  dial(cx+200*u,dy+70*u,31,s.oilTempC??s.oilTemp??80,140,'OIL','°C',4,2);
  dial(cx+166*u,dy+123*u,24,s.ignition?31:30,60,'AMPS','−  0  +',6,1);
  // Indicator jewels and individual toggle/knob bezels, with engraved labels.
  for(const [dx,dy0,color,on] of [[0,73,'#2455a8',s.lights],[-42,112,'#ab392b',s.ignition&&s.rpm<700],[42,112,'#3a7848',s.ignition]]){ctx.fillStyle=chrome;ctx.beginPath();ctx.arc(cx+dx*u,dy+dy0*u,6*u,0,Math.PI*2);ctx.fill();ctx.fillStyle=on?color:'#1a2228';ctx.beginPath();ctx.arc(cx+dx*u,dy+dy0*u,4.2*u,0,Math.PI*2);ctx.fill();}
  for(const [dx,title,on] of [[-245,'PANEL',s.ambient],[-118,'LIGHTS',s.lights],[-63,'WIPER',s.wipers],[64,'FAN',s.coolingFans],[118,'FOG',s.lights],[245,'CHOKE',false]]){
   const x=cx+dx*u,y=dy+(Math.abs(dx)>220?110:130)*u;ctx.fillStyle=chrome;ctx.beginPath();ctx.arc(x,y,5.8*u,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d3dcd9';ctx.lineWidth=3.2*u;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+2*u,y+(on?-8:8)*u);ctx.stroke();ctx.fillStyle='#172126';ctx.beginPath();ctx.arc(x+2*u,y+(on?-8:8)*u,3*u,0,Math.PI*2);ctx.fill();label(title,x,y-11*u,5.8);}
  // Passenger glovebox, clock, ignition escutcheon and three curved heater levers.
  const clockX=cx-364*u;dial(clockX,dy+63*u,36,0,12,'','',12,1);
  const hour=(10+(s.time||0)/3600)%12,minute=((s.time||0)/60)%60;
  for(const [angle,len] of [[hour*Math.PI/6,16],[minute*Math.PI/30,25]]){ctx.strokeStyle='#d2d9d4';ctx.lineWidth=2*u;ctx.beginPath();ctx.moveTo(clockX,dy+63*u);ctx.lineTo(clockX+Math.sin(angle)*len*u,dy+63*u-Math.cos(angle)*len*u);ctx.stroke();}
  shape(p=>{p.moveTo(cx-700*u,dy+24*u);p.lineTo(cx-445*u,dy+25*u);p.quadraticCurveTo(cx-410*u,dy+62*u,cx-445*u,dy+113*u);p.lineTo(cx-700*u,dy+113*u);p.closePath();},'#242b2f',chrome,1.6*u);
  ctx.fillStyle=chrome;ctx.beginPath();ctx.roundRect(cx-507*u,dy+98*u,36*u,5*u,2*u);ctx.fill();
  for(let i=0;i<3;i++){const y=dy+(133+i*14)*u;ctx.strokeStyle=chrome;ctx.lineWidth=5*u;ctx.beginPath();ctx.moveTo(clockX-51*u,y);ctx.quadraticCurveTo(clockX,y+11*u,clockX+51*u,y);ctx.stroke();ctx.strokeStyle='#121c22';ctx.lineWidth=1.5*u;ctx.stroke();label(['AIR','TEMP','FAST   RICH   START'][i],clockX,y+3*u,6);ctx.fillStyle='#c9ceca';ctx.beginPath();ctx.arc(clockX-30*u+i*22*u,y+4*u,4*u,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle=chrome;ctx.beginPath();ctx.roundRect(clockX-68*u,dy+189*u,136*u,44*u,3*u);ctx.fill();ctx.fillStyle='#29363e';ctx.fillRect(clockX-46*u,dy+194*u,92*u,23*u);label('MOTOROLA',clockX,dy+200*u,6);label('700  900  1100  1400',clockX,dy+210*u,6);
  for(const side of [-1,1]){ctx.fillStyle='#858f91';ctx.beginPath();ctx.arc(clockX+side*57*u,dy+210*u,8*u,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e1e3dc';ctx.lineWidth=1.1*u;ctx.stroke();}
  for(let i=0;i<5;i++){ctx.fillStyle='#0c151c';ctx.fillRect(clockX-40*u+i*17*u,dy+224*u,13*u,5*u);}
  // Thin laminated wood rim: metal inner spine, polished grain and twelve rivets.
  const R=146*u,wy=overview?dy+226*u:h*.995;
  save();ctx.translate(cx,wy);ctx.rotate((s.steer||0)*.62);ctx.shadowColor='#000a';ctx.shadowBlur=6*u;
  ctx.strokeStyle='#4d3523';ctx.lineWidth=12*u;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
  const wood=ctx.createLinearGradient(-R,-R,R,R);wood.addColorStop(0,'#8e6038');wood.addColorStop(.25,'#c4965e');wood.addColorStop(.5,'#6d4328');wood.addColorStop(.8,'#a97743');wood.addColorStop(1,'#dab37c');ctx.strokeStyle=wood;ctx.lineWidth=9*u;ctx.stroke();
  for(const d of [-3,-1,2,4]){ctx.strokeStyle=d%2?'#37251d55':'#e1bd804a';ctx.lineWidth=.55*u;ctx.beginPath();ctx.arc(0,0,R+d*u,0,Math.PI*2);ctx.stroke();}ctx.strokeStyle='#bbc1b6';ctx.lineWidth=1*u;ctx.beginPath();ctx.arc(0,0,R-6*u,0,Math.PI*2);ctx.stroke();
  const metal=ctx.createLinearGradient(-R,-R,R,R);metal.addColorStop(0,'#eff2eb');metal.addColorStop(.5,'#849195');metal.addColorStop(1,'#c0cbca');
  for(const a of [-Math.PI/2,Math.PI/6,Math.PI*5/6]){save();ctx.rotate(a);shape(p=>{p.moveTo(15*u,-11*u);p.lineTo(R-5*u,-9*u);p.lineTo(R-5*u,9*u);p.lineTo(15*u,11*u);p.closePath();},metal,'#515e64',.8*u);restore();}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;ctx.fillStyle='#dde1d5';ctx.beginPath();ctx.arc(Math.cos(a)*R,Math.sin(a)*R,2.2*u,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#6a604b';ctx.lineWidth=.55*u;ctx.stroke();}
  const boss=ctx.createRadialGradient(-9*u,-12*u,0,0,0,31*u);boss.addColorStop(0,'#4d565a');boss.addColorStop(.55,'#182126');boss.addColorStop(1,'#050b10');ctx.fillStyle=boss;ctx.beginPath();ctx.arc(0,0,31*u,0,Math.PI*2);ctx.fill();ctx.strokeStyle=metal;ctx.lineWidth=2*u;ctx.stroke();ctx.fillStyle='#152632';ctx.beginPath();ctx.arc(0,0,21*u,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#b5c5c5';ctx.lineWidth=.8*u;ctx.stroke();
  // David Brown rose crest, individually drawn petals in red and ivory.
  for(let ring=0;ring<2;ring++)for(let i=0;i<5;i++){const a=i*Math.PI*2/5+ring*.63;ctx.fillStyle=ring?'#dedbd0':'#9e3032';ctx.beginPath();ctx.ellipse(Math.cos(a)*(ring?4:7)*u,Math.sin(a)*(ring?4:7)*u,(ring?4:6)*u,(ring?3:4.5)*u,a,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#c9ad62';ctx.beginPath();ctx.arc(0,0,2*u,0,Math.PI*2);ctx.fill();label('DAVID BROWN',0,-15*u,3.9);label('ASTON MARTIN',0,15*u,3.6);restore();
  restore();
 }
 root.MUCSDB5Art={drawDB5Dashboard};
})(typeof window==='undefined'?globalThis:window);
