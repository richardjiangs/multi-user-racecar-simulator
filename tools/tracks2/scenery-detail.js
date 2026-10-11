/* Authored landscape/architecture, exported once into permanent world meshes. */
function buildDetailedScenery(api){
 const {app,t,name,L,P,H,local,box,quad,tri,litQuad,litTri,cylinder,leafTree,facade,arch,groundY,clear,sceneryClear,hash,C}=api;
 function rock(p,r,h,seed,mesa=false,alpine=false){const rings=alpine?[[0,1],[.3,.8],[.64,.53],[1,.015]]:mesa?[[-.15,1],[.18,1.06],[.45,.82],[.72,.79],[1,.55]]:[[0,.87],[.26,1],[.7,.76],[1,.30]],N=alpine?13:mesa?11:8;
  if(alpine){
   // Broken longitudinal ridgelines, scree gullies and lingering snowfields.
   // Hundreds of fixed facets follow a mountain mass, rather than a cone apex.
   const grid=[],nx=36,nz=26;
   for(let i=0;i<=nx;i++){grid[i]=[];for(let j=0;j<=nz;j++){const x=i/nx*2-1,z=j/nz*2-1,crest=.19*Math.sin(z*5+seed)+.08*Math.sin(z*13),ridge=.63+.23*Math.sin(z*6+seed)+.12*Math.sin(z*15+.7),slope=Math.max(0,1-Math.abs(x-crest)/(x<crest?1.15:.82)),end=Math.max(0,1-z*z),gully=.90+.10*Math.sin(x*25+z*11+Math.sin(z*12)),y=h*Math.pow(slope,.72)*Math.pow(end,.48)*ridge*gully;grid[i][j]=local(p,x*r,y,z*r*.77);}}
   for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const a=grid[i][j],b=grid[i+1][j],c=grid[i+1][j+1],d=grid[i][j+1],e=(a.y+b.y+c.y+d.y)/4-p.y,stone=e<h*.20?'#737c66':e>h*.49&&Math.sin(i*.51+j*.8+seed)>.35?'#d4d9d5':['#8c9088','#999b91','#7d847b'][(i+j)%3];litQuad(a,b,c,d,stone);}return;
  }
  const vertex=(j,k)=>{const a=j/N*Math.PI*2,q=rings[k],rad=r*q[1]*(.84+.2*hash(seed+j*7)+.05*Math.sin(k+j));return local(p,Math.cos(a)*rad,q[0]*h+(k===0?0:hash(seed+j)*h*.07),Math.sin(a)*rad*.77);};
  for(let k=0;k<rings.length-1;k++)for(let j=0;j<N;j++){const tint=alpine?['#727b67','#85867d',j%3?'#a2a49a':'#d7ddd7'][k]:mesa?['#9a7358','#bd916b','#a97f5f','#c39b73'][k]:['#807869','#989081','#aca18a'][k];litQuad(vertex(j,k),vertex((j+1)%N,k),vertex((j+1)%N,k+1),vertex(j,k+1),tint);if(mesa&&k>0){const a=vertex(j,k),b=vertex((j+1)%N,k);quad(a,b,{...b,y:b.y+.18},{...a,y:a.y+.18},'#795f4f');}}
  for(let j=1;j<N-1;j++)litTri(vertex(0,rings.length-1),vertex(j,rings.length-1),vertex(j+1,rings.length-1),'#b69a78');
 }
 function acacia(p,r,seed){const h=3.4+seed*2.4;cylinder(p,0,0,0,.16,h*.65,'#74634c',7);for(const side of[-1,1]){const a=local(p,0,h*.4,0),b=local(p,side*r*.5,h*.77,.1);quad(a,{...a,x:a.x+.10},{...b,x:b.x+.10},b,'#74634c');}for(let cl=0;cl<3;cl++){const c={...p,x:p.x+(cl-1)*r*.48,y:p.y+h*.71,z:p.z+(cl%2)*r*.3};for(let j=0;j<10;j++){const a=j/10*Math.PI*2,b=(j+1)/10*Math.PI*2;litTri(local(c,Math.cos(a)*r*.73,Math.sin(a*3)*.11,Math.sin(a)*r*.65),local(c,Math.cos(b)*r*.73,Math.sin(b*3)*.11,Math.sin(b)*r*.65),local(c,0,.48,0),cl%2?'#787950':'#606848');}}}
 function dune(p,r,h,seed){const grid=[];for(let i=0;i<=10;i++){grid[i]=[];for(let j=0;j<=6;j++){const x=(i/10-.5)*2,z=(j/6-.5)*2,crest=.19+.20*Math.sin(z*2.6+seed),dist=x-crest,width=x<crest?1.3:.62,height=Math.max(0,1-Math.abs(dist)/width)**1.4*Math.max(0,1-z*z);grid[i][j]=local(p,x*r,height*h,z*r*.8);}}for(let i=0;i<10;i++)for(let j=0;j<6;j++)litQuad(grid[i][j],grid[i+1][j],grid[i+1][j+1],grid[i][j+1],j%3?'#cdb27e':'#c5a875');}
 if(t.terrain==='rally'){
  for(let d=0;d<L;d+=180)for(const side of[-1,1]){const kind=app.rallySector(d).kind,seed=hash(d+side),n=side*(H(d)+24+seed*120),p=P(d,n);p.y=groundY(p.x,p.z)-.12;p.psi=app.trackAt(d).psi;
   if(['canyon','rock','wadi','gravel'].includes(kind)){const r=kind==='canyon'?11+seed*20:kind==='rock'?3+seed*10:.4+seed*1.6;if(clear(p,r+3))rock(p,r,r*(kind==='canyon'?1.9:.8),d+side,kind==='canyon');}
   if(['sand','dunes'].includes(kind)){const r=kind==='dunes'?30+seed*35:18+seed*15;p.psi=.8;if(clear(p,r+3))dune(p,r,r*(kind==='dunes'?.35:.09),seed);}
   if(kind==='grove'||kind==='wadi'&&seed>.5)acacia(p,2+seed*2.2,seed);
   if(['piste','gravel','fesh','coast'].includes(kind)&&seed>.45){for(let i=0;i<3;i++){const q=local(p,i*.8,0,hash(d+i)*1.4);q.psi=0;for(let j=0;j<5;j++){const angle=j*Math.PI/2.5,a=local(q,0,0,0),b=local(q,Math.cos(angle)*.35,.27+seed*.3,Math.sin(angle)*.35);quad(a,{...a,x:a.x+.035},{...b,x:b.x+.03},b,'#898464');}}}
   if(kind==='coast'&&side===-1){const a=P(d,-110,-3),b=P(Math.min(L,d+180),-110,-3);quad(a,b,{...b,x:b.x-2200},{...a,x:a.x-2200},'#43888f');}
  }
  for(let d=15;d<L;d+=67){const kind=app.rallySector(d).kind;if(['transfer','dunes','salt','sand'].includes(kind))continue;for(const side of[-1,1]){const p=P(d,side*(H(d)+.8+hash(d)*3));p.psi=d;rock(p,.12+hash(d+side)*.35,.10+hash(d+2)*.30,d);}}
 }
 const furka=name==='Furka Pass'||/Furka/.test(name),matera=/Matera/.test(name),cinematic=t.scene==='cinematic';
 if(furka){
  // Tall serrated ridges, exposed scree and treeline separation, rather than cones.
  for(let d=80;d<L;d+=420)for(const side of[-1,1]){const seed=hash(d+side),r=90+seed*140;let p;for(let n=320+seed*340;n<1800;n+=110){const q=P(d,side*n);if(sceneryClear(q,r*1.3)){p=q;break;}}if(!p)continue;p.y=groundY(p.x,p.z)-12;p.psi=app.trackAt(d).psi;rock(p,r,160+seed*230,d,false,true);}
  // Belvédère's stepped hotel mass and tiled roof, placed beside the authored road.
  const p=P(L*.31,H(L*.31)+21);p.psi=app.trackAt(L*.31).psi+Math.PI/2;facade(p,30,14,13,'#d1c9b6');box(p,0,14,0,31,.30,14,'#928572');for(const x of[-10,0,10])box(p,x,14,0,7,2.5,8,'#afa28e');
 }
 if(matera){
  // The Sassi read as a stepped limestone amphitheatre, with terraces and parapets.
  for(let d=45;d<L;d+=57)for(const side of[-1,1])for(let tier=0;tier<3;tier++){const seed=hash(d+side+tier*9),p=P(d,side*(H(d)+19+tier*22));p.y+=tier*5-1;p.psi=app.trackAt(d).psi+side*Math.PI/2;if(!clear(p,6))continue;facade(p,11+seed*9,6+seed*5,10,['#c6bba1','#d1c5ab','#b4a78e'][tier]);box(p,0,-1,0,14,1,12,'#afa087');for(const x of[-5,5])box(p,x,0,-5.5,.18,1,.2,'#bfb298');}
  for(let d=0;d<L;d+=5){const p=P(d,H(d)+.8);p.psi=app.trackAt(d).psi;box(p,0,0,0,.55,.83,4.8,'#c0b296');box(p,0,.83,0,.68,.11,4.9,'#d4c8ac');}
 }
 if(cinematic){for(const st of t.stages||[]){const mid=(st.from+st.to)/2,p=P(mid,H(mid)+19);p.psi=app.trackAt(mid).psi+Math.PI/2;const label=st.name||'',isLondon=/London/.test(name)||/Big Ben|London|Buckingham/.test(label),isParis=/Paris/.test(name)||/Paris|market/.test(label),isTokyo=/Tokyo/.test(name)||/Tokyo/.test(label),isPorto=/Porto/.test(name)||/casino|Riviera/.test(label);
  if(isLondon&&['city','boulevard','stone','piazza'].includes(st.surf)){for(let d=st.from+15;d<st.to;d+=36){const q=P(d,H(d)+16);q.psi=app.trackAt(d).psi+Math.PI/2;facade(q,22,15,11,'#866451');for(const x of[-8,-4,0,4,8]){box(q,x,0,-5.65,3.2,1.1,.25,'#a79d8a');for(let y=3;y<15;y+=3)box(q,x,y,-5.65,2.3,.13,.15,'#d4c8ac');}for(const x of[-8,8])box(q,x,15,0,.9,2.3,1.2,'#826654');}}
  if(isParis&&['city','boulevard','market','stalls'].includes(st.surf)){for(let d=st.from+20;d<st.to;d+=44){const q=P(d,-H(d)-18);q.psi=app.trackAt(d).psi-Math.PI/2;facade(q,28,19,12,'#c9c1ae');box(q,0,18,0,28,2.4,11,'#525f66');for(let x=-11;x<=11;x+=4){box(q,x,18.5,-5.6,1.7,2,1.2,'#b1b5af');for(let y=4;y<18;y+=3)for(let j=-1;j<=1;j++)box(q,x+j*.54,y,-6.45,.025,.7,.025,'#394445');}const tr=P(d,H(d)+3);tr.psi=0;leafTree(tr,6.5,2.8);}}
  if(isTokyo&&['city','neon','boulevard','alley'].includes(st.surf)){for(let d=st.from+20;d<st.to;d+=42){const q=P(d,H(d)+19);q.psi=app.trackAt(d).psi+Math.PI/2;facade(q,20,24+hash(d)*24,13,'#9ca9b1','neon');for(const x of[-6,1,7]){box(q,x,3,-7.2,2,9,.40,'#eceadf');for(let y=4;y<11;y+=1.3){box(q,x,y,-7.43,1.2,.15,.025,'#c44343');box(q,x-.45,y,-7.45,.15,.85,.025,'#283e50');}}}}
  if(isPorto&&['casino','riviera','marina','piazza'].includes(st.surf)){facade(p,35,15,18,'#d1bda1');for(let x=-15;x<=15;x+=3){cylinder(p,x,0,-10,.30,6.0,'#d9cbb1');arch(p,x,1,-9.9,2.2,4,'#675f53');}box(p,0,6,-10,35,.4,1.2,'#c5b899');}
  if(['steel','pad','grate','under'].includes(st.surf)){for(let d=st.from+20;d<st.to;d+=110){const q=P(d,H(d)+13);q.psi=app.trackAt(d).psi;for(const side of[-1,1])for(let y=1;y<16;y+=3){box(q,side*5,y,0,.18,.18,24,'#6b7976');for(let z=-10;z<10;z+=5)quad(local(q,side*5,y,z),local(q,side*5,y+3,z+5),local(q,side*5,y+3,z+5.13),local(q,side*5,y,z+.13),'#afb1a1');}for(let z=-8;z<9;z+=3)cylinder(q,0,0,z,1.2,8,'#a5a99b');}}
 }}
}
