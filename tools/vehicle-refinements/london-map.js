/* Offline street navigation drawn from the same fixed world as the driver sees. */
(function(root){
 function drawLondonMap(g,{network:n,state:s,width:w,height:h,preset=2,zoom=1,centre=null,bearing:forcedBearing}){
  const C=(x,a,b)=>Math.max(a,Math.min(b,x)),TAU=Math.PI*2,angle=x=>Math.atan2(Math.sin(x),Math.cos(x)),player=n.playerPoint(),nav=n.navigation(),points=n.plannedPoints(),next=nav?.turns[0];
  const top=nav?(h<160?36:52):0,bottom=nav?(h<180?22:34):20,rail=nav?20:0,W=w-rail,H=Math.max(30,h-top-bottom),bearing=forcedBearing??((nav||preset===2)?player.psi:0),cs=Math.cos(bearing),sn=Math.sin(bearing);
  const coords=p=>({x:p.x*cs-p.z*sn,z:p.x*sn+p.z*cs});let cx,cz,fit;
  if(preset===1){const list=(nav&&points.length?points:n.roads.flatMap(r=>[{x:r.A.e*1000,z:r.A.n*1000},{x:r.B.e*1000,z:r.B.n*1000}])).map(coords),xs=list.map(p=>p.x),zs=list.map(p=>p.z),x=(Math.min(...xs)+Math.max(...xs))/2,z=(Math.min(...zs)+Math.max(...zs))/2;cx=x*cs+z*sn;cz=-x*sn+z*cs;fit=Math.min((W-35)/Math.max(100,Math.max(...xs)-Math.min(...xs)),(H-25)/Math.max(100,Math.max(...zs)-Math.min(...zs)));}
  else {fit=Math.min(W,H)/(nav&&next?.distance<150?210:300);cx=player.x;cz=player.z;}
  const scale=C(fit*zoom,.001,16),ox=W/2,oy=top+H*(preset===2?.73:.5);if(centre){cx=centre.x;cz=centre.z;}
  const P=p=>{const dx=p.x-cx,dz=p.z-cz;return{x:ox+(dx*cs-dz*sn)*scale,y:oy-(dx*sn+dz*cs)*scale};};
  const U=(x,y)=>{const dx=(x-ox)/scale,dz=(oy-y)/scale;return{x:cx+dx*cs+dz*sn,z:cz-dx*sn+dz*cs};};
  const visible=(p,r=0)=>{const q=P(p);return q.x>-r&&q.x<W+r&&q.y>top-r&&q.y<top+H+r;};
  const path=(list,close=false)=>{g.beginPath();list.forEach((p,i)=>{const a=P(p);i?g.lineTo(a.x,a.y):g.moveTo(a.x,a.y);});if(close)g.closePath();};
  g.clearRect(0,0,w,h);g.fillStyle='#f1eee7';g.fillRect(0,0,w,h);g.save();g.beginPath();g.rect(0,top,W,H);g.clip();
  let buildingCount=0,parkCount=0;
  for(const ground of n.grounds){path(ground.points,true);g.fillStyle=ground.color==='#6e8658'?'#c9dfbd':'#a6d4e6';g.fill();parkCount++;}
  if(scale>.035)for(const b of n.buildings){if(!visible(b,(b.radius+20)*scale))continue;const B=(x,z)=>({x:b.x+b.cs*x+b.sn*z,z:b.z-b.sn*x+b.cs*z}),poly=[B(-b.w/2,-b.depth/2),B(b.w/2,-b.depth/2),B(b.w/2,b.depth/2),B(-b.w/2,b.depth/2)];g.save();g.translate(1,1.4);path(poly,true);g.fillStyle='#b9b4aa65';g.fill();g.restore();path(poly,true);g.fillStyle=b.kind==='citylondon'?'#d8dde0':b.tower?'#d1c2a8':'#ded9d0';g.fill();g.strokeStyle='#c5beb2';g.lineWidth=.65;g.stroke();buildingCount++;}
  g.lineCap='round';g.lineJoin='round';
  const roads=n.roads.filter(r=>{const a=P({x:r.A.e*1000,z:r.A.n*1000}),b=P({x:r.B.e*1000,z:r.B.n*1000});return Math.max(a.x,b.x)>-20&&Math.min(a.x,b.x)<W+20&&Math.max(a.y,b.y)>top-20&&Math.min(a.y,b.y)<top+H+20;});
  for(const border of [true,false])for(const r of roads){path([{x:r.A.e*1000,z:r.A.n*1000},{x:r.B.e*1000,z:r.B.n*1000}]);g.lineWidth=Math.max(border?3:1.5,n.width(r)*scale+(border?2:0));g.strokeStyle=border?'#c5c0b5':r.w>=14?'#fff3c2':'#fffefa';g.stroke();}
  if(nav&&points.length){path(points);g.strokeStyle='#fff';g.lineWidth=8;g.stroke();g.strokeStyle='#438fe0';g.lineWidth=5;g.stroke();g.strokeStyle='#116cd4';g.lineWidth=1.3;g.stroke();}
  const occupied=[];
  function label(text,p,color='#62696a',size=10,rotate=0){const a=P(p),width=Math.min(150,g.measureText(text).width+8),height=size+5;if(a.x<20||a.x>W-20||a.y<top+10||a.y>top+H-12||occupied.some(b=>Math.abs(b.x-a.x)<(b.w+width)*.48&&Math.abs(b.y-a.y)<height))return;occupied.push({x:a.x,y:a.y,w:width});g.save();g.translate(a.x,a.y);g.rotate(rotate);g.font=`500 ${size}px system-ui`;g.textAlign='center';g.textBaseline='middle';g.strokeStyle='#f8f6ef';g.lineWidth=3;g.strokeText(text,0,0,150);g.fillStyle=color;g.fillText(text,0,0,150);g.restore();}
  if(scale>.055)for(const r of roads){const ax=r.A.e*1000,az=r.A.n*1000,dx=(r.B.e-r.A.e)*1000,dz=(r.B.n-r.A.n)*1000,u=C(((cx-ax)*dx+(cz-az)*dz)/(r.len*r.len),.12,.88),turn=angle(Math.PI/2-r.brg+bearing),rotation=Math.abs(turn)>Math.PI/2?angle(turn+Math.PI):turn;label(r.name.replace(/ \(.*\)$/,''),{x:ax+dx*u,z:az+dz*u},'#6b6f6a',w<450?9:11,rotation);}
  const pins=[];for(const p of n.locations){const a=P(p);pins.push({id:p.id,x:a.x,y:a.y});if(!visible(p,8))continue;const selected=p.id===n.destinationPoint?.id;g.fillStyle=selected?'#da554d':/Park|Gardens|Common/.test(p.name)?'#5b8b55':'#8d7b9d';g.strokeStyle='#fff';g.lineWidth=1.5;g.beginPath();g.arc(a.x,a.y,selected?5:2.5,0,TAU);g.fill();g.stroke();if(scale>.025||selected)label(p.name.replace(' · Sherlock Holmes Museum',''),{x:p.x,z:p.z+12/scale},selected?'#a73f37':'#66645e',selected?11:10);}
  const markers=[];for(const car of n.policePoses()){const p=P(car);if(!visible(car,10))continue;g.fillStyle='#1764ba';g.strokeStyle='#fff';g.lineWidth=1.4;g.beginPath();g.roundRect(p.x-6,p.y-6,12,12,3);g.fill();g.stroke();g.fillStyle='#fff';g.font='bold 9px system-ui';g.textAlign='center';g.fillText('P',p.x,p.y+3);markers.push({...p,name:car.name||'Police',kind:'police',worldX:car.x,worldZ:car.z});}
  const own=P(player);g.save();g.translate(own.x,own.y);g.rotate(player.psi-bearing);g.fillStyle='#2c8ef02d';g.beginPath();g.arc(0,0,16,0,TAU);g.fill();g.beginPath();g.moveTo(0,-10);g.lineTo(7,7);g.lineTo(0,3);g.lineTo(-7,7);g.closePath();g.fillStyle='#197ce0';g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();g.restore();
  // A compass remains useful while the map follows the car's heading.
  g.save();g.translate(W-16,top+16);g.fillStyle='#fffef8';g.beginPath();g.arc(0,0,11,0,TAU);g.fill();g.rotate(-bearing);g.fillStyle='#bc5749';g.beginPath();g.moveTo(0,-8);g.lineTo(3,4);g.lineTo(0,1);g.lineTo(-3,4);g.fill();g.restore();g.restore();
  const metres=d=>d>=1000?(d/1000).toFixed(d<10000?1:0)+' km':Math.round(Math.max(0,d)/5)*5+' m';
  if(nav){
   g.fillStyle='#163d40';g.fillRect(0,0,w,top);g.fillStyle='#fff';g.textAlign='left';g.textBaseline='alphabetic';g.font='bold '+(h<160?11:13)+'px system-ui';g.fillText(nav.arrived?'Arrived at your destination':metres(next.distance)+' · '+next.action,12,top<40?15:20,w-83);g.fillStyle='#cfe2db';g.font='10px system-ui';g.fillText(nav.arrived?nav.destination:next.road,12,top<40?29:37,w-83);
   // Junction preview uses the actual turn angle and points into the next road.
   const x=w-42,y=top-8,turn=next?.angle||0,dx=Math.sin(turn)*19,dy=-Math.cos(turn)*19;g.lineCap='round';g.lineJoin='round';g.strokeStyle='#73958d';g.lineWidth=4;g.beginPath();g.moveTo(x-25,y-16);g.lineTo(x+25,y-16);g.moveTo(x,y);g.lineTo(x,y-32);g.stroke();g.strokeStyle='#83d4ff';g.lineWidth=4;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-15);g.lineTo(x+dx,y-15+dy);g.stroke();const aa=Math.atan2(dy,dx);g.beginPath();g.moveTo(x+dx-7*Math.cos(aa-.55),y-15+dy-7*Math.sin(aa-.55));g.lineTo(x+dx,y-15+dy);g.lineTo(x+dx-7*Math.cos(aa+.55),y-15+dy-7*Math.sin(aa+.55));g.stroke();
   g.fillStyle='#f9faf6';g.fillRect(W,top,rail,H);g.strokeStyle='#d4dedb';g.lineWidth=4;g.beginPath();g.moveTo(W+rail/2,top+12);g.lineTo(W+rail/2,top+H-12);g.stroke();g.strokeStyle='#2384d9';g.beginPath();g.moveTo(W+rail/2,top+12);g.lineTo(W+rail/2,top+12+(H-24)*nav.progress);g.stroke();g.fillStyle='#1873bf';g.beginPath();g.arc(W+rail/2,top+12+(H-24)*nav.progress,4,0,TAU);g.fill();g.fillStyle='#576968';g.font='8px system-ui';g.textAlign='center';g.fillText('●',W+rail/2,top+H-2);
   g.fillStyle='#fffef9';g.fillRect(0,h-bottom,w,bottom);g.textAlign='left';g.font='bold 11px system-ui';g.fillStyle='#246d50';g.fillText(nav.arrived?'Destination reached':metres(nav.remaining)+' remaining · '+Math.max(1,Math.round(nav.etaSeconds/60))+' min',9,h-bottom+14,w-18);
   if(bottom>25&&nav.turns[1]){g.font='9px system-ui';g.fillStyle='#697477';g.fillText('Then '+metres(nav.turns[1].distance)+' · '+nav.turns[1].action+' · '+nav.turns[1].road,9,h-5,w-18);}
  }else {g.fillStyle='#fffef7e8';g.fillRect(0,h-bottom,w,bottom);g.fillStyle='#607271';g.font='10px system-ui';g.textAlign='left';g.fillText('London · free exploration',8,h-6);}
  const scaleM=10**Math.floor(Math.log10(45/scale)),bar=scaleM*scale;g.strokeStyle='#50666d';g.lineWidth=1.5;g.beginPath();g.moveTo(8,top+H-9);g.lineTo(8+bar,top+H-9);g.stroke();g.font='8px system-ui';g.fillStyle='#3b535a';g.textAlign='left';g.fillText(scaleM>=1000?(scaleM/1000)+' km':scaleM+' m',8,top+H-13);
  return {project:P,unproject:U,pins,fit,scale,cx,cz,w,h,bearing,ox,oy,buildingCount,parkCount,navigation:nav,markers,player:{...own,worldX:player.x,worldZ:player.z},policeCount:markers.length};
 }
 root.MUCSLondonMap={draw:drawLondonMap};
})(typeof window==='undefined'?globalThis:window);
