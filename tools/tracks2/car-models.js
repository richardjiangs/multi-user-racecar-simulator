/* Hand-authored world-space coachwork. The F1 rival renderer does not call this.
   Stations run rear to nose; each family has its own silhouette and glazing. */
function drawDetailedRoadCar(mesh,info={}){
 const {point:P,quad:Q,triangle:T,box:B}=mesh,name=info.name||'',paint=info.paint||[170,25,24],accent=info.accent||[213,215,207],dark=[19,25,28],glass=[39,61,72],metal=[133,147,151];
 const family=/Dacia|Sandrider/.test(name)?'dacia':/· Ford|Raptor/.test(name)?'ford':/· Toyota|Hilux/.test(name)?'hilux':/Prodrive|Hunter/.test(name)?'hunter':/X-raid|Century/.test(name)?'raid':/Bugatti|Veyron/.test(name)?'bugatti':/Porsche|911/.test(name)?'porsche':/McLaren/.test(name)?'mclaren':/Lamborghini/.test(name)?'lambo':/Koenigsegg/.test(name)?'koenigsegg':/Valkyrie|AMG ONE/.test(name)?'prototype':/Aston/.test(name)?'aston':/Rimac/.test(name)?'rimac':/Maserati/.test(name)?'maserati':/BMW|Audi|Mercedes|Tesla|Nissan|Supra|Lancer|Jaguar/.test(name)?'saloon':'ferrari';
 const raid=['dacia','ford','hilux','hunter','raid'].includes(family),open=info.open||info.kind==='barchetta';
 const specs={ // length, width, height, rear axle, front axle, wheel radius
  bugatti:[4.46,2.0,1.20,-1.31,1.40,.36],porsche:[4.53,1.88,1.30,-1.22,1.27,.35],mclaren:[4.60,1.95,1.18,-1.37,1.33,.35],lambo:[4.56,1.96,1.16,-1.33,1.36,.35],koenigsegg:[4.73,2.03,1.21,-1.39,1.40,.36],prototype:[4.65,2.00,1.07,-1.43,1.35,.35],aston:[4.72,1.96,1.21,-1.37,1.37,.35],rimac:[4.75,1.99,1.20,-1.42,1.33,.36],maserati:[4.67,1.97,1.22,-1.38,1.30,.35],saloon:[4.9,1.93,1.42,-1.43,1.45,.36],ferrari:[4.58,1.94,1.18,-1.37,1.32,.35],dacia:[4.14,2.20,1.81,-1.5,1.5,.47],ford:[4.68,2.30,1.98,-1.5,1.5,.47],hilux:[4.81,2.30,1.89,-1.57,1.57,.47],hunter:[4.60,2.30,1.85,-1.5,1.5,.47],raid:[4.5,2.2,1.9,-1.50,1.50,.47]};
 let [L,W,H,rear,front,R]=specs[family];if(info.L){L=info.L;H=info.H;W=info.kind==='openwheel'?1.8:1.78;rear=-info.wb/2;front=info.wb/2;R=(info.wheel||.65)/2;}
 const stations={
  bugatti:[[0,.83,.69],[.12,1,.80],[.3,1,.81],[.5,.91,.72],[.68,.96,.67],[.85,1,.58],[1,.77,.43]],
  porsche:[[0,.81,.65],[.15,1,.76],[.36,.95,.80],[.55,.85,.70],[.73,.98,.58],[.88,.92,.52],[1,.73,.38]],
  mclaren:[[0,.9,.65],[.16,1,.78],[.34,.97,.66],[.52,.83,.55],[.72,.96,.53],[.87,1,.56],[1,.79,.30]],
  lambo:[[0,.92,.73],[.18,1,.73],[.34,.98,.62],[.55,.84,.55],[.77,.99,.52],[.9,.91,.42],[1,.68,.28]],
  koenigsegg:[[0,.87,.73],[.15,1,.83],[.32,.95,.69],[.51,.84,.59],[.72,1,.56],[.9,.98,.45],[1,.72,.33]],
  prototype:[[0,.9,.55],[.17,1,.65],[.35,.72,.40],[.55,.68,.38],[.72,.89,.48],[.88,.96,.54],[1,.54,.21]],
  aston:[[0,.82,.66],[.15,1,.77],[.34,.92,.69],[.54,.86,.60],[.74,.95,.61],[.9,.93,.48],[1,.71,.35]],
  rimac:[[0,.82,.69],[.15,1,.76],[.34,.91,.67],[.54,.86,.58],[.76,.97,.59],[.9,.96,.49],[1,.77,.36]],
  maserati:[[0,.82,.65],[.15,1,.74],[.35,.91,.63],[.53,.88,.60],[.75,.97,.55],[.9,.9,.43],[1,.69,.33]],
  saloon:[[0,.85,.75],[.15,.96,.78],[.35,1,.81],[.53,.98,.78],[.73,.96,.73],[.90,.94,.67],[1,.85,.51]],
  ferrari:[[0,.85,.69],[.15,1,.76],[.35,.94,.61],[.53,.85,.59],[.73,.96,.60],[.91,.94,.46],[1,.75,.29]],
  dacia:[[0,.69,.90],[.12,.88,1.05],[.3,1,1.06],[.5,.81,1.08],[.68,.9,.95],[.88,1,.88],[1,.72,.62]],
  ford:[[0,.82,1.07],[.12,1,1.13],[.30,.98,1.20],[.5,.93,1.26],[.70,.93,1.31],[.89,1,1.26],[1,.87,1.02]],
  hilux:[[0,.86,1.12],[.13,1,1.12],[.32,.96,1.16],[.52,.88,1.24],[.70,.94,1.19],[.88,1,1.14],[1,.86,.99]],
  hunter:[[0,.75,.89],[.15,1,1.04],[.33,.96,1.09],[.53,.79,1.13],[.73,.94,1.12],[.90,1,1.04],[1,.69,.77]],
  raid:[[0,.72,.96],[.15,1,1.12],[.33,.95,1.14],[.53,.83,1.14],[.73,.99,1.04],[.90,.98,.90],[1,.71,.71]]
 };
 const shade=(c,f)=>c.map(v=>Math.min(255,v*f)),quad=(a,b,c,d,color)=>Q(P(...a),P(...b),P(...c),P(...d),color);
 let profile=stations[family];
 if(info.p){const clean=info.p.filter((p,i,arr)=>!i||p[0]!==arr[i-1][0]);profile=clean.map(([u,y])=>[1-u,.72+.26*Math.sin(Math.PI*u),Math.min(y,H*.65)]).reverse();}
 const cross=[[-1,.48],[-1,.82],[-.91,.99],[-.66,1.035],[0,1.045],[.66,1.035],[.91,.99],[1,.82],[1,.48]];
 for(let i=0;i<profile.length-1;i++){const a=profile[i],b=profile[i+1];for(let j=0;j<cross.length-1;j++){const c=cross[j],d=cross[j+1],V=(v,c)=>[c[0]*W*.5*v[1],Math.max(raid?.48:.18,v[2]*c[1]),(v[0]-.5)*L];quad(V(a,c),V(a,d),V(b,d),V(b,c),shade(paint,.7+.3*Math.max(0,1-Math.abs(c[0]))+.09*c[0]));}}
 for(const k of [0,profile.length-1]){const v=profile[k],z=(v[0]-.5)*L;for(let j=0;j<cross.length-1;j++)T(P(0,raid?.49:.19,z),P(cross[j][0]*W*.5*v[1],Math.max(raid?.48:.18,v[2]*cross[j][1]),z),P(cross[j+1][0]*W*.5*v[1],Math.max(raid?.48:.18,v[2]*cross[j+1][1]),z),shade(paint,k?.86:.65));}
 let cabin=family==='porsche'?[-.92,-.37,.63,1.16]:family==='saloon'?[-1.25,-.60,.61,1.25]:family==='dacia'?[-.85,-.56,.30,.98]:family==='ford'?[-.95,-.68,.44,1.13]:family==='hilux'?[-1.16,-.73,.38,.98]:family==='hunter'?[-.98,-.55,.43,1.05]:[-.9,-.44,.38,1.12],belt=raid?1.12:family==='saloon'?.78:.66;
 if(info.glass)cabin=[info.glass.at(-1)[0],info.glass[2][0],info.glass[1][0],info.glass[0][0]].map(u=>(.5-u)*L);
 if(!open&&!raid&&!info.L){
  // Compound roof curvature and separate framed quarter lights. A curved
  // greenhouse reads very differently from a single rectangular glass box.
  const [back,rback,rfront,fwd]=cabin,wb=W*.38,rb=family==='prototype'?.43:.60;
  const rings=[[back,wb,belt],[rback-.10,rb*.98,H*.94],[rback+.12,rb,H],[rfront-.10,rb,H*.99],[rfront+.08,rb*.96,H*.94],[fwd,wb,belt]];
  const section=[[-1,0],[-.90,.055],[-.65,.098],[0,.12],[.65,.098],[.90,.055],[1,0]];
  for(let i=0;i<rings.length-1;i++)for(let j=0;j<section.length-1;j++){
   const V=(r,c)=>[r[1]*c[0],r[2]+c[1]*(i===0||i===4?.6:1),r[0]],a=rings[i],b=rings[i+1];
   quad(V(a,section[j]),V(a,section[j+1]),V(b,section[j+1]),V(b,section[j]),i===0?shade(glass,.76):i===4?shade(glass,1.2):shade(paint,1.04+.10*(1-Math.abs(section[j][0]))));
  }
  for(const side of[-1,1]){
   const vertices=[[side*wb,belt,back],[side*rb,H*.94,rback-.1],[side*rb,H*.99,rfront],[side*wb,belt,fwd]];
   quad(...vertices,shade(glass,side>0?.96:.70));
   // A/B/C pillars, lower brightwork, quarter-window divider and door seams.
   for(const [z,r]of[[back,rback-.1],[fwd,rfront]])quad([side*wb,belt,z],[side*rb,H*.98,r],[side*(rb+.045),H*.98,r+.045],[side*(wb+.025),belt,z+.045],shade(paint,.9));
   quad([side*(wb+.012),belt+.025,-.28],[side*(rb+.012),H*.99,-.28],[side*(rb+.013),H*.99,-.24],[side*(wb+.014),belt+.025,-.24],dark);
   B(side*(wb+.015),belt-.016,(back+fwd)/2,.024,.022,fwd-back,metal);
   B(side*(wb+.025),belt-.060,-.17,.030,.028,.19,metal);
   B(side*(wb+.12),belt+.13,fwd-.19,.20,.075,.25,paint);B(side*(wb+.13),belt+.145,fwd-.30,.16,.036,.021,metal);
  }
 }else if(!open){const [back,rback,rfront,fwd]=cabin,roof=H,rb=raid?.65:family==='prototype'?.44:.61,wb=raid?.86:W*.38;
  quad([-wb,belt,back],[wb,belt,back],[rb,roof,rback],[-rb,roof,rback],raid?dark:glass);quad([-rb,roof,rback],[rb,roof,rback],[rb,roof,rfront],[-rb,roof,rfront],shade(paint,1.08));quad([-rb,roof,rfront],[rb,roof,rfront],[wb,belt,fwd],[-wb,belt,fwd],shade(glass,1.35));
  for(const side of [-1,1]){quad([side*wb,belt,back],[side*rb,roof,rback],[side*rb,roof,rfront],[side*wb,belt,fwd],shade(glass,side>0?1:.6));for(const z of [back,fwd]){const r=z===back?rback:rfront;quad([side*wb,belt,z],[side*rb,roof,r],[side*(rb+.055),roof,r+.03],[side*(wb+.035),belt,z+.055],paint);}B(side*.90,belt+.17,fwd-.27,.20,.095,.27,paint);B(side*.96,belt+.13,fwd-.3,.18,.07,.04,metal);B(side*(wb+.015),belt+.015,-.05,.025,.025,.21,metal);if(raid)for(let z=back+.1;z<fwd;z+=.15)quad([side*(wb+.007),belt+.07,z],[side*rb,roof-.09,rfront],[side*(rb+.018),roof-.09,rfront],[side*(wb+.024),belt+.07,z+.025],dark);}
 }else{B(0,belt-.10,-.12,W*.6,.04,.92,dark);for(const side of [-1,1]){B(side*.31,belt-.07,-.18,.34,.23,.40,[91,45,31]);B(side*.31,belt+.11,-.36,.34,.30,.09,[110,51,34]);}quad([-W*.32,belt,.35],[W*.32,belt,.35],[W*.31,belt+.26,.2],[-W*.31,belt+.26,.2],glass);}
 // Wheels have toroidal shoulders, recessed rims, brake rotors and moving spokes.
 const wheel=(side,z,spare=false)=>{const x=side*(W*.5-.06),width=raid?.32:.27,spin=(info.distance||0)/R,N=info.far?16:32;
  const wheelP=(xx,r,t)=>P(x+xx,R+r*Math.cos(t),z+r*Math.sin(t));
  for(let i=0;i<N;i++){const a=i/N*Math.PI*2,b=(i+1)/N*Math.PI*2;for(const [u,v,r0,r1]of[[-width/2,width/2,R,R],[side*width/2,side*(width/2+.015),R,R*.85],[side*(width/2+.016),side*(width/2+.018),R*.85,R*.62]])Q(wheelP(u,r0,a),wheelP(v,r1,a),wheelP(v,r1,b),wheelP(u,r0,b),[25,29,31]);T(wheelP(side*(width/2+.02),0,a),wheelP(side*(width/2+.02),R*.61,a),wheelP(side*(width/2+.02),R*.61,b),[65,70,71]);if(raid&&i%2===0)Q(wheelP(-width*.44,R*1.018,a),wheelP(width*.44,R*1.018,a+.025),wheelP(width*.44,R*1.018,b),wheelP(-width*.44,R*1.018,b-.025),[39,42,39]);}
  for(let j=0;j<(raid?6:10);j++){const angle=spin+j/(raid?6:10)*Math.PI*2,xx=side*(width/2+.03);Q(wheelP(xx,R*.13,angle),wheelP(xx,R*.59,angle),wheelP(xx,R*.59,angle+.095),wheelP(xx,R*.13,angle+.23),metal);}
  B(x+side*(width/2+.035),R,z,.024,.10,.10,metal);
 };
 for(const side of[-1,1])for(const z of[rear,front]){wheel(side,z);const archR=R*1.10;for(let j=0;j<18;j++){const u=-Math.PI/2+j/18*Math.PI,v=-Math.PI/2+(j+1)/18*Math.PI;quad([side*W*.501,R+Math.cos(u)*archR,z+Math.sin(u)*archR],[side*W*.501,R+Math.cos(u)*(archR+.065),z+Math.sin(u)*(archR+.065)],[side*W*.501,R+Math.cos(v)*(archR+.065),z+Math.sin(v)*(archR+.065)],[side*W*.501,R+Math.cos(v)*archR,z+Math.sin(v)*archR],raid?dark:paint);}}
 // Splitters, sill blades, diffuser vanes, separate lamp clusters and exhausts.
 B(0,raid?.39:.12,L*.49,W*.90,.045,.28,dark);B(0,raid?.38:.14,-L*.49,W*.88,.10,.26,dark);
 for(let x=-W*.36;x<=W*.36;x+=W*.18)B(x,raid?.39:.13,-L*.48,.025,.12,.40,dark);
 for(const side of[-1,1]){B(side*W*.47,raid?.46:.17,0,.075,.07,L*.56,dark);B(side*W*.33,raid?1.04:.45,L*.495,raid?.38:.30,raid?.10:.038,.05,[231,237,217]);B(side*W*.32,raid?.9:.57,-L*.502,raid?.18:.33,.07,.025,[198,22,21]);B(side*.34,raid?.52:.29,-L*.509,.13,.10,.05,metal);B(side*.34,raid?.52:.30,-L*.515,.09,.07,.02,[9,13,15]);}
 if(family==='bugatti'){B(0,.36,L*.505,.28,.26,.035,metal);B(0,.38,L*.515,.22,.18,.035,dark);for(const side of[-1,1])for(let i=0;i<4;i++)B(side*(.55+i*.07),.52,L*.502,.04,.04,.03,[219,229,231]);}
 if(!raid&&!info.L){
  // Rear engine vent, individual lamp lenses and a recessed registration panel.
  B(0,.34,-L*.506,W*.64,.19,.025,dark);for(let x=-W*.30;x<W*.31;x+=.055)B(x,.35,-L*.514,.014,.14,.012,[54,62,65]);
  B(0,.43,-L*.518,.29,.065,.012,[189,192,181]);
  if(family==='bugatti'||family==='ferrari'||family==='mclaren')for(const side of[-1,1]){
   const centers=family==='bugatti'?[.58,.77]:family==='ferrari'?[.68]:[.64,.83];
   for(const x of centers)for(let j=0;j<24;j++){const a=j/24*Math.PI*2,b=(j+1)/24*Math.PI*2,r=family==='mclaren'?.047:.065;
    const V=(q,t)=>[side*x+Math.cos(t)*q,.62+Math.sin(t)*q,-L*.517];quad(V(r,a),V(r,b),V(r*.65,b),V(r*.65,a),[233,38,30]);}
  }
  if(family==='bugatti'){for(const side of[-1,1]){B(side*.47,.795,-1.20,.38,.065,.74,dark);for(let j=0;j<7;j++)B(side*.47,.855,-1.5+j*.095,.35,.012,.024,metal);}B(0,.84,-1.87,1.52,.055,.24,paint);}
 }
 if(family==='lambo'){for(const side of[-1,1]){quad([side*.6,.5,L*.48],[side*.9,.45,L*.47],[side*.92,.46,L*.47],[side*.6,.53,L*.48],[238,240,223]);quad([side*.6,.51,L*.48],[side*.64,.42,L*.48],[side*.66,.42,L*.48],[side*.62,.51,L*.48],[238,240,223]);}}
 if(family==='porsche'){for(const side of[-1,1])for(let j=0;j<16;j++){const a=j/16*Math.PI*2,b=(j+1)/16*Math.PI*2;T(P(side*.68,.60,L*.435),P(side*.68+Math.cos(a)*.11,.60+Math.sin(a)*.10,L*.435),P(side*.68+Math.cos(b)*.11,.60+Math.sin(b)*.10,L*.435),[226,234,230]);}B(0,.64,-L*.506,W*.78,.03,.025,[187,29,26]);}
 if(raid){B(0,.63,L*.505,W*.56,.28,.045,dark);for(let x=-.55;x<=.55;x+=.12)B(x,.66,L*.532,.055,.20,.025,metal);B(0,H+.02,-.15,.75,.11,.57,dark);for(let x=-.32;x<.33;x+=.10)B(x,H+.08,.145,.06,.04,.03,[238,239,222]);for(const side of[-1,1]){B(side*.94,.58,0,.10,.08,2.0,metal);B(side*.98,.82,-.15,.028,.26,.42,accent);B(side*.98,1.10,-.3,.03,.17,.26,[240,240,232]);}
  if(family==='dacia'){for(const side of[-1,1])for(const dy of[-.06,.06])quad([side*.53,1.02,L*.503],[side*.83,1.02+dy,L*.5],[side*.84,1.045+dy,L*.5],[side*.53,1.045,L*.503],[232,238,204]);}
  if(family==='hilux'||family==='ford'){B(0,1.13,-1.5,1.57,.10,1.05,dark);for(const x of[-.36,.36])B(x,1.24,-1.5,.48,.28,.72,[32,35,34]);}
  // Exposed rear cradle, diagonal cage tubes, radiators and two full-size
  // spare tyres, rather than a sedan's rear windscreen on a rally prototype.
  const tube=(a,b,r,color)=>{const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],l=Math.hypot(dx,dy,dz),n=Math.hypot(dx,dz)||1,u=[dz/n,0,-dx/n],v=[-dy*dx/(l*n),n/l,-dy*dz/(l*n)];for(let j=0;j<8;j++){const a0=j*Math.PI/4,a1=(j+1)*Math.PI/4,V=(p,t)=>p.map((x,k)=>x+r*(u[k]*Math.cos(t)+v[k]*Math.sin(t)));quad(V(a,a0),V(a,a1),V(b,a1),V(b,a0),shade(color,.78+.20*Math.cos(a0)));}};
  if(family==='dacia'||family==='hunter'||family==='raid'){
   B(0,.88,-L*.38,1.18,.12,.64,dark);for(const side of[-1,1]){
    tube([side*.65,.69,-L*.49],[side*.53,1.60,-.72],.036,metal);tube([side*.69,.70,-L*.48],[-side*.58,1.19,-L*.39],.027,[84,95,96]);
    const cx=side*.39,cy=1.03,cz=-L*.35,r=.37;for(let j=0;j<24;j++){const a=j/12*Math.PI,b=(j+1)/12*Math.PI,V=(rr,t,z)=>[cx+rr*Math.cos(t),cy+rr*Math.sin(t),z];quad(V(r,a,cz-.10),V(r,b,cz-.10),V(r,b,cz+.11),V(r,a,cz+.11),[31,34,33]);quad(V(r,a,cz-.11),V(r*.50,a,cz-.11),V(r*.50,b,cz-.11),V(r,b,cz-.11),[22,25,25]);quad(V(r*.49,a,cz-.10),[cx,cy,cz-.10],[cx,cy,cz-.10],V(r*.49,b,cz-.10),metal);}
    B(side*.73,.81,-L*.50,.12,.20,.045,[186,25,22]);B(side*.78,.24,-1.91,.23,.28,.045,dark);
   }
  }
  // Roof intake slats and spare-wheel straps also identify pickups from behind.
  for(let x=-.27;x<=.28;x+=.09)B(x,H+.04,-.44,.024,.065,.018,metal);
  for(const side of[-1,1]){B(side*.56,1.21,-1.4,.027,.022,.70,accent);tube([side*.80,.68,-1.40],[side*.58,1.07,-1.12],.048,[198,173,43]);}
  B(.4,H+.04,-.42,.018,.56,.018,dark);
 }else{
  for(const side of[-1,1]){quad([side*W*.49,.33,-.5],[side*W*.48,.57,-.65],[side*W*.46,.60,-1.0],[side*W*.49,.30,-.85],dark);for(let j=0;j<5;j++)B(side*.56,.76,-L*.26-j*.10,.38,.018,.035,dark);}
  if(/STO|Jesko|AMG ONE|765LT|P1|F40|F50|FXX|Valkyrie/.test(name)||info.wing){const y=raid?H:H*.80;for(const side of[-1,1])B(side*.49,.57,-L*.38,.045,y-.57,.14,dark);B(0,y,-L*.40,W*.91,.065,.30,paint);for(const side of[-1,1])B(side*W*.45,y-.08,-L*.40,.035,.20,.40,dark);}
 }
 return family;
}
