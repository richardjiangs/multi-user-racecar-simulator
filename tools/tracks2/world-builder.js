/* Build-time geometry only. This source is NOT executed while driving.
   The resulting immutable vertex buffers are embedded in the standalone HTML. */
function buildCircuitWorld(app){
 const t=app.trackModel(),name=app.state.route.name,L=t.L,street=name==='Circuit de Monaco',ring=name==='Nardò Ring',nords=/Nord|24h/.test(name),suzuka=name==='Suzuka Circuit';
 const vertices=[],C=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)],hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
 const vtx=(p,c,m)=>vertices.push(p.x,p.y,p.z,...c,m),tri=(a,b,c,col,mat=0)=>{const cc=typeof col==='string'?C(col):col;vtx(a,cc,mat);vtx(b,cc,mat);vtx(c,cc,mat);},quad=(a,b,c,d,col,mat=0)=>{tri(a,b,c,col,mat);tri(a,c,d,col,mat);};
 const local=(p,x,y,z)=>({x:p.x+Math.cos(p.psi)*x+Math.sin(p.psi)*z,y:p.y+y,z:p.z-Math.sin(p.psi)*x+Math.cos(p.psi)*z});
 const box=(p,x,y,z,w,h,l,col)=>{const c=C(col),p0=local(p,x-w/2,y,z-l/2),p1=local(p,x+w/2,y,z-l/2),p2=local(p,x+w/2,y,z+l/2),p3=local(p,x-w/2,y,z+l/2),up=p=>({...p,y:p.y+h}),shade=f=>c.map(v=>Math.round(v*f));quad(p0,p1,up(p1),up(p0),shade(.68));quad(p1,p2,up(p2),up(p1),shade(.8));quad(p2,p3,up(p3),up(p2),c);quad(p3,p0,up(p0),up(p3),shade(.85));quad(up(p0),up(p1),up(p2),up(p3),shade(1.05));};
 const P=(d,n=0,h=0)=>app.surfacePoint(d,n,h),H=d=>app.halfWidthAt(d),band=(a,b,n0,n1,col,h=0,mat=0)=>quad(P(a,n0,h),P(a,n1,h),P(b,n1,h),P(b,n0,h),col,mat);
 // Lookup cells used only during export to keep roads and roadside objects separated.
 const grid=new Map(),nodes=[];for(let d=0;d<L;d+=6){const p=app.trackAt(d);p.d=d;p.H=H(d);nodes.push(p);const key=Math.floor(p.x/60)+','+Math.floor(p.z/60);if(!grid.has(key))grid.set(key,[]);grid.get(key).push(p);}
 const near=(x,z,r=2)=>{const gx=Math.floor(x/60),gz=Math.floor(z/60);let best=null,dist=Infinity;for(let ix=gx-r;ix<=gx+r;ix++)for(let iz=gz-r;iz<=gz+r;iz++)for(const p of grid.get(ix+','+iz)||[]){const dd=(p.x-x)**2+(p.z-z)**2;if(dd<dist){dist=dd;best=p;}}return {p:best,dist:Math.sqrt(dist)};};
 const clear=(p,margin)=>{const q=near(p.x,p.z);return !q.p||q.dist>q.p.H+margin||Math.abs(q.p.y-p.y)>12;};
 // Continuous ground beneath the complete circuit. At crossings use the lower deck's
 // terrain; bridge decks are independent structural geometry, never a painted mask.
 const xs=nodes.map(p=>p.x),zs=nodes.map(p=>p.z),low=Math.min(...nodes.map(p=>p.y)),xmin=Math.min(...xs)-420,xmax=Math.max(...xs)+420,zmin=Math.min(...zs)-420,zmax=Math.max(...zs)+420,step=street?18:45;
 function ground(x,z){const q=near(x,z,3);let y=q.p?q.p.y-Math.min(14,1.8+q.dist*.06):low-18;if(suzuka&&q.p&&q.dist<100){const gx=Math.floor(x/60),gz=Math.floor(z/60);for(let i=gx-1;i<=gx+1;i++)for(let j=gz-1;j<=gz+1;j++)for(const p of grid.get(i+','+j)||[])if(Math.hypot(p.x-x,p.z-z)<50)y=Math.min(y,p.y-2);}const pit=app.pitModel();for(const p of pit.points)if(Math.abs(p.x-x)<65&&Math.abs(p.z-z)<65)y=Math.min(y,p.y-3);return{x,y,z};}
 function groundY(x,z){const gx=xmin+Math.floor((x-xmin)/step)*step,gz=zmin+Math.floor((z-zmin)/step)*step,u=(x-gx)/step,v=(z-gz)/step,a=ground(gx,gz).y,b=ground(gx+step,gz).y,c=ground(gx+step,gz+step).y,d=ground(gx,gz+step).y;return v<=u?a*(1-u)+b*(u-v)+c*v:a*(1-v)+c*u+d*(v-u);}
 for(let x=xmin;x<xmax;x+=step)for(let z=zmin;z<zmax;z+=step){const c=street?'#7d8076':ring?'#78805a':nords?'#49683c':'#688455';quad(ground(x,z),ground(x+step,z),ground(x+step,z+step),ground(x,z+step),c);}
 // Fixed 2.5 m stations, including one shared seam. No stations follow the camera.
 const count=Math.ceil(L/2.5),ds=L/count;
 for(let i=0;i<count;i++){
  const a=i*ds,b=(i+1)*ds,k=app.trackAt((a+b)/2).k,ha=H(a),hb=H(b),kerb=!ring&&!street&&Math.abs(k)>.0015;
  // Multiple crossfall strips match the driver's exact banked height.
  for(let j=0;j<4;j++)quad(P(a,ha*(-1+j/2),.018),P(a,ha*(-1+(j+1)/2),.018),P(b,hb*(-1+(j+1)/2),.018),P(b,hb*(-1+j/2),.018),'#4b5053',1);
  for(const side of [-1,1]){
   const edge=(d,n,h)=>P(d,side*(H(d)+n),h);
   quad(edge(a,-.24,.031),edge(a,-.09,.031),edge(b,-.09,.031),edge(b,-.24,.031),'#e1e3db',2);
   // Shoulder surface is strictly outside the road; no broad grass quads span it.
   const hairpin=street&&a>1260&&a<1360&&side===-1,kerbW=hairpin?.85:kerb?1.15:street?.45:.7;
   quad(edge(a,0,.012),edge(a,kerbW,.012),edge(b,kerbW,.012),edge(b,0,.012),(kerb||hairpin)?(i%2?'#e3dfce':'#ad4036'):street?'#aca99c':'#969587',2);
   {const aa=edge(a,0,0),bb=edge(b,0,0),cc={...bb,y:Math.min(bb.y-.25,groundY(bb.x,bb.z)-.3)},dd={...aa,y:Math.min(aa.y-.25,groundY(aa.x,aa.z)-.3)};quad(aa,bb,cc,dd,'#747b72');}
   for(const [u,v] of [[kerbW,4],[4,12],[12,32]]){
    if(street&&u>=4)continue;if(suzuka&&a>4870&&a<4985)continue;
    const pts=[edge(a,u,-.045),edge(a,v,-.10),edge(b,v,-.10),edge(b,u,-.045)];
    // A grass triangle must never cover a different part of a hairpin.
    const q=near((pts[0].x+pts[1].x+pts[2].x+pts[3].x)/4,(pts[0].z+pts[1].z+pts[2].z+pts[3].z)/4,1);
    const phase=q.p?Math.abs(app.trackWrap(q.p.d-a+L/2,L)-L/2):0;
    const pitOverlap=pts.some(p=>app.pitCovers(p,2))||app.pitCovers({x:pts.reduce((v,p)=>v+p.x,0)/4,z:pts.reduce((v,p)=>v+p.z,0)/4,y:pts[0].y},2);
    if(pitOverlap){const fill=pts.map(p=>{const near=app.pitNearest(p);return{...p,y:Math.min(p.y-(name==='Nordschleife'?1.2:.4),Number.isFinite(near.distance)?near.y-(name==='Nordschleife'?1.5:.5):p.y-.4)};});quad(...fill,'#747b77');}
    if(!pitOverlap&&(!q.p||phase<35||q.dist>q.p.H+1.5||q.p.y>pts[0].y+.2))quad(...pts,street?'#8a8983':kerb&&!nords&&u<4?'#438776':'#567744');
   }

  }
  if(ring)for(const n of [-.5,0,.5])if(i%6<3)band(a,b,ha*n-.07,ha*n+.07,'#dfded3',.033,2);
  if(nords&&t.labels.some(([d,n])=>/Karussell/.test(n)&&Math.abs(a-d)<85)){
   band(a,b,-Math.min(4.3,ha),Math.min(2,ha),'#afb1a4',.04,2);if(i%2===0)band(a,a+.05,-Math.min(4.3,ha),Math.min(2,ha),'#686d67',.047,2);
  }
 }
 // Draw exactly the same finite barrier segments used by contact physics.
 for(const f of app.fenceSegments()){const {a,b,top,mesh}=f,up=(p,y)=>({...p,y:p.y+y});quad(up(a,.1),up(b,.1),up(b,top),up(a,top),'#a5b0aa');for(const y of [.23,.45,.66])quad(up(a,y),up(b,y),up(b,y+.045),up(a,y+.045),'#5e6c70');
  if(f.index%4===0){const p={...a,psi:Math.atan2(b.x-a.x,b.z-a.z)};box(p,0,0,0,.11,mesh?2.9:1,.11,'#727d7e');}if(mesh)for(const y of [1.4,1.9,2.4,2.85])quad(up(a,y),up(b,y),up(b,y+.014),up(a,y+.014),'#616e70');}
 // Start line and starting boxes anchored to world metres.
 for(let i=0;i<24;i++)for(let j=0;j<2;j++)band(j*.32,(j+1)*.32,-H(0)+i*H(0)/12,-H(0)+(i+1)*H(0)/12,(i+j)%2?'#1c2429':'#f0eee2',.045,2);
 if(!ring)for(let i=0;i<20;i++){const d=app.trackWrap(-12-i*8,L),n=(i%2?1:-1)*H(d)*.46;band(d,d+.14,n-1,n+1,'#d6d6c9',.04,2);for(const side of [-1,1])band(d-2,d,n+side*1-.055,n+side*1+.055,'#d6d6c9',.04,2);}
 const font={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111'],P:['110','101','110','100','100'],I:['111','010','010','010','111'],T:['111','010','010','010','010'],E:['111','100','110','100','111'],N:['101','111','111','111','101'],D:['110','101','101','101','110'],M:['101','111','111','101','101']};
 function board(p,word,width=1.6,col='#e7e5d8'){
  box(p,0,0,0,.10,2.25,.12,'#858c86');box(p,0,1.20,0,width,1.04,.08,col);const unit=Math.min(width/(word.length*4+1),.14),x0=-(word.length*4-1)*unit/2;
  for(let c=0;c<word.length;c++)for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(font[word[c]]?.[y][x]==='1'){const xx=x0+(c*4+x)*unit,yy=2.04-y*unit;quad(local(p,xx,yy,-.052),local(p,xx+unit*.87,yy,-.052),local(p,xx+unit*.87,yy+unit*.87,-.052),local(p,xx,yy+unit*.87,-.052),'#17282b',2);}
 }
 for(const [d,label] of t.labels){if(ring||/Tunnel|Quarter|Half|Three|200R|Dunlop/.test(label))continue;const turn=Math.sign(app.trackAt(d).k)||1;for(const m of [150,100,50]){const at=d-m,p=P(at,-turn*(H(at)+1.8));p.psi=app.trackAt(at).psi;board(p,String(m));}}
 // Complete pit lane, apron, garage buildings and limiter markers.
 const pit=app.pitModel(),pp=(q,n=0,h=0)=>app.pitSurface(q,n,h);
 const pitStep=name==='Nordschleife'?.4:2.5;for(let q=0;q<pit.length;q+=pitStep){const b=Math.min(pit.length,q+pitStep);
  const apron=q>pit.boxStart-12&&q<pit.boxEnd+12?13:pit.half;
  for(let j=0,N=Math.ceil((apron+pit.half)/(name==='Nordschleife'?.25:1.1));j<N;j++){const n0=-pit.half+j*(apron+pit.half)/N,n1=-pit.half+(j+1)*(apron+pit.half)/N;quad(pp(q,n0,-.06),pp(q,n1,-.06),pp(b,n1,-.06),pp(b,n0,-.06),'#747b77');}
  for(const n of [-pit.half,apron]){const a=pp(q,n),c=pp(b,n),aa={...a,y:Math.min(a.y-.3,groundY(a.x,a.z)-.5)},cc={...c,y:Math.min(c.y-.3,groundY(c.x,c.z)-.5)};quad(a,c,cc,aa,'#747c77');}
for(let j=0;j<8;j++){const n0=-pit.half+j*pit.half/4,n1=n0+pit.half/4;quad(pp(q,n0,.02),pp(q,n1,.02),pp(b,n1,.02),pp(b,n0,.02),'#555a5a',1);}for(const n of [-pit.half,pit.half])quad(pp(q,n-.06,.035),pp(q,n+.06,.035),pp(b,n+.06,.035),pp(b,n-.06,.035),'#d9dccf',2);}
 for(const [q,word] of [[30,'PIT'],[pit.limitIn,String(pit.limit)],[pit.limitOut,'END']]){const p=pp(q,-5.1);p.psi=app.pitAt(q).psi;board(p,word,2.1);}
 for(const q of [pit.limitIn,pit.limitOut])quad(pp(q,-4,.045),pp(q,4,.045),pp(q+.3,4,.045),pp(q+.3,-4,.045),'#e2e4d9',2);
 const slots=ring||name==='Nordschleife'?[1]:Array.from({length:11},(_,i)=>i);
 for(const slot of slots){const q=app.pitBox(slot),p=app.pitAt(q),c=slot===1?'#00a995':'#536676';const footing=local(p,pit.half+4.2,0,0),depth=Math.max(.3,p.y-groundY(footing.x,footing.z)+1);box(p,pit.half+4.2,-depth,0,8,depth,11.3,'#89938e');box(p,pit.half+4.2,0,0,7.8,3.6,11,'#c4c7c1');box(p,pit.half+4.1,3.6,0,8.3,.28,11.7,'#647676');box(p,pit.half+.26,.1,0,.05,2.65,8.6,'#162a31');box(p,pit.half+.17,2.84,0,.1,.44,9.3,c);if(slot===1){quad(pp(q-3,1.5,.05),pp(q-3,4.1,.05),pp(q+3,4.1,.05),pp(q+3,1.5,.05),'#087c70',2);quad(pp(q,1.5,.058),pp(q,4.1,.058),pp(q+.2,4.1,.058),pp(q+.2,1.5,.058),'#99edcf',2);}}
 // Permanently present scenery. It does not depend on distance, speed or camera heading.
 for(let d=0;d<L;d+=street?32:nords?21:70){if(ring)continue;for(const side of [-1,1]){
  const seed=hash(d+side),n=side*(H(d)+(street?12:nords?11:36)+seed*(street?12:35)),p=P(d,n,-.12);p.psi=app.trackAt(d).psi;
  p.y=Math.min(p.y,groundY(p.x,p.z))-.45;if(!clear(p,street?7:5))continue;if(side===pit.side&&app.trackWrap(d-pit.entry,L)<pit.span)continue;
  if(street){if(d>1530&&d<2070&&side===1)continue;const width=10+seed*9,height=9+hash(d+6)*19,deep=9+seed*7;box(p,0,0,0,width,height,deep,['#cbbda6','#e1cfb3','#b9bdba','#d0b69b'][Math.floor(seed*4)]);box(p,0,height,0,width+.4,.4,deep+.4,'#9a9d93');for(let y=2;y<height-1;y+=3)for(let x=-width/2+1;x<width/2-1;x+=2.2){const wall=local(p,x,y,-deep/2-.015);quad(wall,local(p,x+1,y,-deep/2-.015),local(p,x+1,y+1.5,-deep/2-.015),local(p,x,y+1.5,-deep/2-.015),'#4d6368',3);}}
  else{const height=7+seed*9,rad=2+seed*2;box(p,0,-.5,0,.42,height*.55,.42,'#6c6251');for(let tier=0;tier<2;tier++){const yy=height*(.28+tier*.25),top={...p,y:p.y+height*(.78+tier*.22)},rr=rad*(1-tier*.2);for(let j=0;j<7;j++){const a=j/7*Math.PI*2,b=(j+1)/7*Math.PI*2;tri({x:p.x+Math.cos(a)*rr,y:p.y+yy,z:p.z+Math.sin(a)*rr},{x:p.x+Math.cos(b)*rr,y:p.y+yy,z:p.z+Math.sin(b)*rr},top,j%2?'#35573b':'#416644');}}}
 }}
 // Monaco's tunnel remains in the scene both outside and inside; roof and wall have
 // thickness, and the harbour-facing side is carried on regularly spaced columns.
 if(street)for(let d=1555;d<2050;d+=4){const b=Math.min(2050,d+4),aH=H(d)+.7,bH=H(b)+.7;quad(P(d,-aH,4.8),P(d,aH,4.8),P(b,bH,4.8),P(b,-bH,4.8),'#4c5255');quad(P(d,-aH,4.8),P(d,aH,4.8),P(d,aH,5.2),P(d,-aH,5.2),'#898f8b');quad(P(d,-aH,.0),P(b,-bH,.0),P(b,-bH,4.8),P(d,-aH,4.8),'#949891');if(Math.round(d)%16<4){const p=P(d,aH,0);p.psi=app.trackAt(d).psi;box(p,0,0,0,.5,4.8,.55,'#a6aaa0');}for(const side of [-1,1])quad(P(d,side*3,4.76),P(d,side*3+.12,4.76),P(d+1.5,side*3+.12,4.76),P(d+1.5,side*3,4.76),'#f3efcf',4);}
 if(suzuka){for(const d of [4885,4975]){const p=P(d,0,-7);p.psi=app.trackAt(d).psi;box(p,0,0,0,H(d)*2+.9,6.15,2.2,'#8c9892');}for(let d=4885;d<4975;d+=3){const b=d+3,H0=H(d);quad(P(d,-H0,-.85),P(d,H0,-.85),P(b,H(b),-.85),P(b,-H(b),-.85),'#747d7b');for(const side of [-1,1])quad(P(d,side*H0,-.85),P(b,side*H(b),-.85),P(b,side*H(b),0),P(d,side*H0,0),'#a3aca6');}for(const d of [4898,4962])for(const side of [-1,1]){const p=P(d,side*(H(d)-.5),-7);p.psi=app.trackAt(d).psi;box(p,0,0,0,1.2,6.5,1.4,'#8f9993');}}
 const out=new ArrayBuffer(vertices.length/7*16),view=new DataView(out);for(let i=0,j=0;i<vertices.length;i+=7,j+=16){for(let k=0;k<3;k++)view.setFloat32(j+k*4,vertices[i+k],true);for(let k=0;k<4;k++)view.setUint8(j+12+k,Math.max(0,Math.min(255,vertices[i+3+k])));}
 return{buffer:out,vertices:vertices.length/7,bounds:{xmin,xmax,zmin,zmax},length:L};
}
