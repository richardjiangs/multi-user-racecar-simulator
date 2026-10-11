/* The existing fictional exhibition walk, now composed entirely of depth-tested
   world meshes. Exhibit names, chronology and the 380 m drive are retained. */
function buildMuseumWorld({P,local,box,quad,tri,cylinder,C,app}){
 const road=MUSEUM_CARS.filter(c=>c.kind!=='openwheel'),f1=MUSEUM_CARS.filter(c=>c.kind==='openwheel'),placed=[];
 const place=(list,lo,hi)=>list.forEach((car,i)=>placed.push({car,d:lo+(hi-lo)*(i+.5)/list.length,side:i%2?1:-1}));place(road.slice(0,8),52,168);place(road.slice(8),176,230);place(f1,240,328);
 for(const{car,d,side}of placed){const p=P(d,side*6.85,.24);p.psi=app.trackAt(d).psi+side*Math.PI/2;
  box({...p,y:p.y-.24},0,0,0,2.6,.24,5.8,'#cccac3');box({...p,y:p.y-.025},0,0,0,2.5,.025,5.7,'#efeee7');
  const mesh={point:(x,y,z)=>local(p,x,y,z),quad,triangle:tri,box:(...args)=>box(p,...args)};
  if(car.kind==='openwheel')museumSingleSeater(mesh,car);else drawDetailedRoadCar(mesh,{...car,paint:C(car.col)});
  for(const z of[-3.1,3.1])for(const x of[-1.45,1.45]){cylinder(p,x,-.24,z,.025,.78,'#8a9391',8);box(p,x,.47,z,.05,.045,.05,'#c8cfcc');}
  for(const side of[-1,1])box(p,side*1.45,.48,0,.018,.018,6.2,'#676d6b');
  const panel=P(d+3,side*4.5);panel.psi=app.trackAt(d).psi;box(panel,0,0,0,.035,.82,.035,'#8a9391');box(panel,0,.8,0,1.35,.48,.08,'#efeee5');worldLettering((x,y,z)=>local(panel,x,y,z),quad,car.name,-.6,.94,-.045,Math.min(.12,.95/car.name.length),[41,46,44]);worldLettering((x,y,z)=>local(panel,x,y,z),quad,String(car.year),-.2,.83,-.045,.065,[139,47,35]);
 }
 // Ceiling trusses, spotlights, hanging panels and trophy cases all have depth.
 for(let d=6;d<378;d+=12){const p=P(d);p.psi=app.trackAt(d).psi;box(p,0,6.7,0,19.5,.12,.14,'#9d9e98');for(const x of[-7,-4,4,7]){box(p,x,6.55,0,.26,.16,.36,'#2b3235');box(p,x,6.52,0,.20,.03,.30,'#fff4d8');}}
 for(const d of[43,171,233,331]){const p=P(d);p.psi=app.trackAt(d).psi;box(p,0,4.7,0,5.4,.8,.12,'#a10b16');box(p,0,4.72,-.065,5.2,.03,.014,'#ddc38c');const label=({43:'CLASSICI',171:'SUPERCARS',233:'SCUDERIA FERRARI',331:'FIORANO'})[d];worldLettering((x,y,z)=>local(p,x,y,z),quad,label,-label.length*.112,4.99,-.068,.28,[238,228,205]);for(const x of[-2,2])box(p,x,5.5,0,.02,1.2,.02,'#93958e');}
 for(let d=244;d<329;d+=18){const p=P(d,9.35);p.psi=app.trackAt(d).psi;box(p,0,.45,0,.55,1.5,3.6,'#31393c');for(const z of[-1.1,0,1.1]){cylinder(p,-.20,1,z,.10,.38,'#b68d32');cylinder(p,-.20,1.3,z,.19,.2,'#dfc169');cylinder(p,-.20,.9,z,.17,.10,'#625944');}}
}
function museumSingleSeater({point:P,box:B,quad:Q,triangle:T},car){
 const red=[189,26,22],black=[22,26,28],cream=[224,220,207],silver=[130,142,145],L=car.L,W=1.65,R=car.wheel/2;
 const profile=car.cigar?[[0,.21,.46],[.2,.37,.68],[.5,.36,.69],[.75,.25,.52],[1,.11,.34]]:[[0,.22,.48],[.2,.32,.78],[.46,.39,.56],[.66,.21,.42],[1,.13,car.highNose?.46:.29]];
 for(let j=0;j<profile.length-1;j++){const a=profile[j],b=profile[j+1];for(let i=0;i<16;i++){const u=i/16*Math.PI*2,v=(i+1)/16*Math.PI*2,F=(r,t)=>P(Math.cos(t)*r[1],.3+Math.sin(t)*r[2]*.5,(r[0]-.5)*L);Q(F(a,u),F(a,v),F(b,v),F(b,u),red.map(x=>x*(.7+.25*Math.sin(u))));}}
 B(0,.55,-.13,.43,.04,.72,black);if(!car.cigar){for(const side of[-1,1]){B(side*.62,.2,-.28,.42,.28,car.groundEffect?2.2:1.7,red);B(side*.62,.47,-.2,.42,.035,1.4,cream);B(side*.58,.40,-.86,.24,.06,.5,black);}B(0,.14,L*.45,1.5,.045,.29,red);B(0,.78,-L*.43,1.42,.10,.31,cream);for(const side of[-1,1])B(side*.70,.45,-L*.43,.025,.5,.42,red);}
 for(const side of[-1,1])for(const z of[-car.wb/2,car.wb/2]){const x=side*W/2,width=car.cigar?.18:.34;for(let i=0;i<28;i++){const a=i/28*Math.PI*2,b=(i+1)/28*Math.PI*2,F=(u,t)=>P(x+u,R+Math.cos(t)*R,z+Math.sin(t)*R);Q(F(-width/2,a),F(width/2,a),F(width/2,b),F(-width/2,b),black);T(P(x+side*width/2,R,z),F(side*width/2,a),F(side*width/2,b),car.covers?black:silver);}B(side*.45,.25,z,.65,.025,.03,silver);}
 if(car.halo){B(0,.64,.4,.03,.34,.05,black);B(0,.96,.10,.62,.025,.65,black);}
}
