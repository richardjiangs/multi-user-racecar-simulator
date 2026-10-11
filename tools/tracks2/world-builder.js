/* Build-time geometry only. This source is NOT executed while driving.
   The resulting immutable vertex buffers are embedded in the standalone HTML. */
function buildCircuitWorld(app){
 const t=app.trackModel(),name=app.state.route.name,L=t.L,street=name==='Circuit de Monaco'||t.scene==='street',ring=name==='Nardò Ring',nords=/Nord|24h/.test(name),suzuka=name==='Suzuka Circuit',rally=t.terrain==='rally',museum=t.scene==='museum',cinematic=t.scene==='cinematic',estate=t.scene==='estate',arid=rally||['arid','quarry','runway'].includes(t.scene);
 const tiles=new Map(),C=h=>Array.isArray(h)?h:[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)],hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
 let vertexCount=0;
 const tri=(a,b,c,col,mat=0)=>{if(rally){if(mat===0)mat=6;else if(mat===1)mat=5;}const cc=typeof col==='string'?C(col):col,key=Math.floor((a.x+b.x+c.x)/1536)+','+Math.floor((a.z+b.z+c.z)/1536);let tile=tiles.get(key);if(!tile){tile={chunks:[],count:0,min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity]};tiles.set(key,tile);}
  for(const p of [a,b,c]){const i=tile.count%4096;if(i===0)tile.chunks.push(new DataView(new ArrayBuffer(4096*16)));const view=tile.chunks.at(-1),v=[p.x,p.y,p.z];for(let k=0;k<3;k++){view.setFloat32(i*16+k*4,v[k],true);tile.min[k]=Math.min(tile.min[k],v[k]);tile.max[k]=Math.max(tile.max[k],v[k]);}for(let k=0;k<4;k++)view.setUint8(i*16+12+k,Math.max(0,Math.min(255,k===3?mat:cc[k])));tile.count++;vertexCount++;}
 },quad=(a,b,c,d,col,mat=0)=>{tri(a,b,c,col,mat);tri(a,c,d,col,mat);};
 const litTri=(a,b,c,col)=>{const ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z;let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;if(ny<0){nx=-nx;ny=-ny;nz=-nz;}const length=Math.hypot(nx,ny,nz)||1,light=.56+.48*Math.max(0,(nx*.44+ny*.79+nz*.43)/length);tri(a,b,c,(typeof col==='string'?C(col):col).map(v=>v*light));};
 const litQuad=(a,b,c,d,col)=>{litTri(a,b,c,col);litTri(a,c,d,col);};
 const local=(p,x,y,z)=>({x:p.x+Math.cos(p.psi)*x+Math.sin(p.psi)*z,y:p.y+y,z:p.z-Math.sin(p.psi)*x+Math.cos(p.psi)*z});
 const box=(p,x,y,z,w,h,l,col)=>{const c=C(col),p0=local(p,x-w/2,y,z-l/2),p1=local(p,x+w/2,y,z-l/2),p2=local(p,x+w/2,y,z+l/2),p3=local(p,x-w/2,y,z+l/2),up=p=>({...p,y:p.y+h}),shade=f=>c.map(v=>Math.round(v*f));quad(p0,p1,up(p1),up(p0),shade(.68));quad(p1,p2,up(p2),up(p1),shade(.8));quad(p2,p3,up(p3),up(p2),c);quad(p3,p0,up(p0),up(p3),shade(.85));quad(up(p0),up(p1),up(p2),up(p3),shade(1.05));};
 const P=(d,n=0,h=0)=>app.surfacePoint(d,n,h),H=d=>app.halfWidthAt(d),band=(a,b,n0,n1,col,h=0,mat=0)=>quad(P(a,n0,h),P(a,n1,h),P(b,n1,h),P(b,n0,h),col,mat);
 // Lookup cells used only during export to keep roads and roadside objects separated.
 const grid=new Map(),nodes=[];for(let d=0;d<L;d+=6){const p=app.trackAt(d);p.d=d;p.H=H(d);nodes.push(p);const key=Math.floor(p.x/60)+','+Math.floor(p.z/60);if(!grid.has(key))grid.set(key,[]);grid.get(key).push(p);}
 const near=(x,z,r=2)=>{const gx=Math.floor(x/60),gz=Math.floor(z/60);let best=null,dist=Infinity;for(let ix=gx-r;ix<=gx+r;ix++)for(let iz=gz-r;iz<=gz+r;iz++)for(const p of grid.get(ix+','+iz)||[]){const dd=(p.x-x)**2+(p.z-z)**2;if(dd<dist){dist=dd;best=p;}}return {p:best,dist:Math.sqrt(dist)};};
 const clear=(p,margin)=>{const q=near(p.x,p.z);return !q.p||q.dist>q.p.H+margin||Math.abs(q.p.y-p.y)>12;};
 // Tall scenery must clear every nearby road level, including distant bends.
 // The small-object lookup above is not sufficient for a 200 m mountain base.
 const sceneryClear=(p,radius)=>{const gx=Math.floor(p.x/60),gz=Math.floor(p.z/60),r=Math.ceil((radius+25)/60);for(let x=gx-r;x<=gx+r;x++)for(let z=gz-r;z<=gz+r;z++)for(const q of grid.get(x+','+z)||[])if(Math.hypot(q.x-p.x,q.z-p.z)<radius+q.H+6)return false;return true;};
 // Continuous ground beneath the complete circuit. At crossings use the lower deck's
 // terrain; bridge decks are independent structural geometry, never a painted mask.
 const bounds=nodes.reduce((b,p)=>({xmin:Math.min(b.xmin,p.x),xmax:Math.max(b.xmax,p.x),zmin:Math.min(b.zmin,p.z),zmax:Math.max(b.zmax,p.z),low:Math.min(b.low,p.y)}),{xmin:Infinity,xmax:-Infinity,zmin:Infinity,zmax:-Infinity,low:Infinity}),low=bounds.low,xmin=bounds.xmin-420,xmax=bounds.xmax+420,zmin=bounds.zmin-420,zmax=bounds.zmax+420,step=t.terrain==='rally'?80:street?18:45;
 // Lower all vertices of a terrain cell crossed by a road below that road.
 // A coarse cell cannot interpolate above the vehicle even on a steep crest.
 const caps=new Map();for(const p of nodes){const r=p.H+3;for(let ix=Math.floor((p.x-r-xmin)/step);ix<=Math.floor((p.x+r-xmin)/step);ix++)for(let iz=Math.floor((p.z-r-zmin)/step);iz<=Math.floor((p.z+r-zmin)/step);iz++)for(const [dx,dz]of [[0,0],[1,0],[1,1],[0,1]]){const key=(ix+dx)+','+(iz+dz);caps.set(key,Math.min(caps.get(key)??Infinity,p.y-.45));}}
 const groundCache=new Map();function ground(x,z){const key=x+','+z;if(groundCache.has(key))return groundCache.get(key);let q=near(x,z,3);if(!q.p)q=near(x,z,9);let y=q.p?q.p.y-Math.min(14,1.8+q.dist*.06):low-18;if(rally&&q.p){const k=app.rallySector(q.p.d).kind,relief=k==='dunes'?15:k==='canyon'?45:k==='rock'?16:k==='salt'?.05:3,fade=Math.min(1,Math.max(0,q.dist-q.p.H-1)/65);y=q.p.y-.08+fade*relief*(.3+.35*Math.sin(x/117+z/231)+.35*Math.sin(z/73-x/191));}if(cinematic&&q.p&&['wood','steel','leg','under','grate','bridge','pad','water','sub'].includes(stageAt(q.p.d)?.surf))y=Math.min(y,q.p.y-25);if((suzuka||t.bridges?.length)&&q.p&&q.dist<100){const gx=Math.floor(x/60),gz=Math.floor(z/60);for(let i=gx-1;i<=gx+1;i++)for(let j=gz-1;j<=gz+1;j++)for(const p of grid.get(i+','+j)||[])if(Math.hypot(p.x-x,p.z-z)<50)y=Math.min(y,p.y-2);}const pit=app.pitModel();for(const p of pit?.points||[])if(Math.abs(p.x-x)<65&&Math.abs(p.z-z)<65)y=Math.min(y,p.y-3);const cap=caps.get(Math.round((x-xmin)/step)+','+Math.round((z-zmin)/step));if(cap!==undefined)y=Math.min(y,cap);const result={x,y,z};groundCache.set(key,result);return result;}
 function groundY(x,z){const gx=xmin+Math.floor((x-xmin)/step)*step,gz=zmin+Math.floor((z-zmin)/step)*step,u=(x-gx)/step,v=(z-gz)/step,a=ground(gx,gz).y,b=ground(gx+step,gz).y,c=ground(gx+step,gz+step).y,d=ground(gx,gz+step).y;return v<=u?a*(1-u)+b*(u-v)+c*v:a*(1-v)+c*u+d*(v-u);}
 const groundTiles=new Set();if(t.closed===false||L>50000){for(const p of nodes.filter((_,i)=>i%10===0))for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++)groundTiles.add((Math.floor((p.x-xmin)/step)+dx)+','+(Math.floor((p.z-zmin)/step)+dz));}else for(let x=0;x<(xmax-xmin)/step;x++)for(let z=0;z<(zmax-zmin)/step;z++)groundTiles.add(x+','+z);
 for(const key of groundTiles){const [ix,iz]=key.split(',').map(Number),x=xmin+ix*step,z=zmin+iz*step,q=rally||cinematic?near(x,z,3):null,c=cinematic?(['alpine','forest','mirrorwall'].includes(stageAt(q.p?.d||0)?.surf)?'#687757':'#989482'):rally?(q.p?app.rallySector(q.p.d).color:'#b6a17c'):arid?'#a4997a':street?'#7d8076':ring?'#78805a':nords?'#49683c':'#688455';litQuad(ground(x,z),ground(x+step,z),ground(x+step,z+step),ground(x,z+step),c);}
 // Fixed 2.5 m stations, including one shared seam. No stations follow the camera.
 const count=Math.ceil(L/(rally?3:2.5)),ds=L/count;
 for(let i=0;i<count;i++){
  const a=i*ds,b=(i+1)*ds,k=app.trackAt((a+b)/2).k,ha=H(a),hb=H(b),kerb=!ring&&!street&&!estate&&!cinematic&&Math.abs(k)>.0015;
  if(rally){const terrain=app.rallySector((a+b)/2),c=C(terrain.color);for(let j=0;j<2;j++)quad(P(a,ha*(-1+j),.018),P(a,ha*j,.018),P(b,hb*j,.018),P(b,hb*(-1+j),.018),c,1);
   // Two worn tyre tracks, broad natural shoulders and visible gravel without
   // painted GP lines or kerbs. Every strip exists for the whole stage at load.
   for(const side of [-1,1]){if(terrain.kind!=='transfer')band(a,b,side*1.1-.18,side*1.1+.18,c.map(v=>v*.94),.024,1);const aa=P(a,side*ha),bb=P(b,side*hb),cc=P(b,side*(hb+8)),dd=P(a,side*(ha+8));cc.y=groundY(cc.x,cc.z)+.012;dd.y=groundY(dd.x,dd.z)+.012;quad(aa,bb,cc,dd,c);}
   continue;
  }
  if(cinematic){missionRoad(a,b,i);continue;}
  if(museum){const section=a<44?0:a<172?1:a<234?2:a<332?3:4,wall=['#b7ad9d','#ddd9d0','#282b31','#581116','#aaaeb2'][section],floor=['#4a4c50','#44474c','#191c21','#231416','#484b50'][section];band(a,b,-9.8,9.8,floor,.018);for(const side of [-1,1]){quad(P(a,side*9.8),P(b,side*9.8),P(b,side*9.8,7.2),P(a,side*9.8,7.2),wall);quad(P(a,side*9.79,2.30),P(b,side*9.79,2.30),P(b,side*9.79,2.62),P(a,side*9.79,2.62),'#b5151e');}band(a,b,-9.8,9.8,'#22252a',7.2);if(i%4===0)for(const side of [-1,1])band(a,b,side*5-.14,side*5+.14,'#fff0d4',7.15,4);continue;}
  // Multiple crossfall strips match the driver's exact banked height.
  for(let j=0;j<4;j++)quad(P(a,ha*(-1+j/2),.018),P(a,ha*(-1+(j+1)/2),.018),P(b,hb*(-1+(j+1)/2),.018),P(b,hb*(-1+j/2),.018),'#4b5053',1);
  for(const side of [-1,1]){
   const edge=(d,n,h)=>P(d,side*(H(d)+n),h);
   if(!estate&&!cinematic)quad(edge(a,-.24,.031),edge(a,-.09,.031),edge(b,-.09,.031),edge(b,-.24,.031),'#e1e3db',2);
   // Shoulder surface is strictly outside the road; no broad grass quads span it.
   const hairpin=street&&a>1260&&a<1360&&side===-1,kerbW=hairpin?.85:kerb?1.15:street?.45:.7;
   quad(edge(a,0,.012),edge(a,kerbW,.012),edge(b,kerbW,.012),edge(b,0,.012),(kerb||hairpin)?(i%2?'#e3dfce':'#ad4036'):street?'#aca99c':'#969587',2);
   {const aa=edge(a,0,0),bb=edge(b,0,0),cc={...bb,y:Math.min(bb.y-.25,groundY(bb.x,bb.z)-.3)},dd={...aa,y:Math.min(aa.y-.25,groundY(aa.x,aa.z)-.3)};quad(aa,bb,cc,dd,'#747b72');}
   for(const [u,v] of [[kerbW,4],[4,12],[12,32]]){
    if(street&&u>=4)continue;if(suzuka&&a>4870&&a<4985||t.bridges?.some(([lo,hi])=>a>lo&&a<hi))continue;
    const pts=[edge(a,u,-.045),edge(a,v,-.10),edge(b,v,-.10),edge(b,u,-.045)];
    // A grass triangle must never cover a different part of a hairpin.
    const q=near((pts[0].x+pts[1].x+pts[2].x+pts[3].x)/4,(pts[0].z+pts[1].z+pts[2].z+pts[3].z)/4,1);
    const phase=q.p?Math.abs(app.trackWrap(q.p.d-a+L/2,L)-L/2):0;
    const pitOverlap=pts.some(p=>app.pitCovers(p,2))||app.pitCovers({x:pts.reduce((v,p)=>v+p.x,0)/4,z:pts.reduce((v,p)=>v+p.z,0)/4,y:pts[0].y},2);
    if(pitOverlap){const fill=pts.map(p=>{const near=app.pitNearest(p);return{...p,y:Math.min(p.y-(name==='Nordschleife'?1.2:.4),Number.isFinite(near.distance)?near.y-(name==='Nordschleife'?1.5:.5):p.y-.4)};});quad(...fill,'#747b77');}
    if(!pitOverlap&&(!q.p||phase<35||q.dist>q.p.H+1.5||q.p.y>pts[0].y+.2))quad(...pts,street?'#8a8983':kerb&&!nords&&!estate&&u<4?'#438776':'#567744');
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
 if(!ring&&t.closed!==false)for(let i=0;i<20;i++){const d=app.trackWrap(-12-i*8,L),n=(i%2?1:-1)*H(d)*.46;band(d,d+.14,n-1,n+1,'#d6d6c9',.04,2);for(const side of [-1,1])band(d-2,d,n+side*1-.055,n+side*1+.055,'#d6d6c9',.04,2);}
 const font={0:['111','101','101','101','111'],1:['010','110','010','010','111'],2:['111','001','111','100','111'],3:['111','001','111','001','111'],4:['101','101','111','001','001'],5:['111','100','111','001','111'],6:['111','100','111','101','111'],7:['111','001','010','010','010'],8:['111','101','111','101','111'],9:['111','101','111','001','111'],P:['110','101','110','100','100'],I:['111','010','010','010','111'],T:['111','010','010','010','010'],E:['111','100','110','100','111'],N:['101','111','111','111','101'],D:['110','101','101','101','110'],M:['101','111','111','101','101']};
 function board(p,word,width=1.6,col='#e7e5d8'){
  box(p,0,0,0,.10,2.25,.12,'#858c86');box(p,0,1.20,0,width,1.04,.08,col);const unit=Math.min(width/(word.length*4+1),.14),x0=-(word.length*4-1)*unit/2;
  for(let c=0;c<word.length;c++)for(let y=0;y<5;y++)for(let x=0;x<3;x++)if(font[word[c]]?.[y][x]==='1'){const xx=x0+(c*4+x)*unit,yy=2.04-y*unit;quad(local(p,xx,yy,-.052),local(p,xx+unit*.87,yy,-.052),local(p,xx+unit*.87,yy+unit*.87,-.052),local(p,xx,yy+unit*.87,-.052),'#17282b',2);}
 }
 for(const [d,label] of t.labels){if(ring||rally||cinematic||estate||/Tunnel|Quarter|Half|Three|200R|Dunlop/.test(label))continue;const turn=Math.sign(app.trackAt(d).k)||1;for(const m of [150,100,50]){const at=d-m,p=P(at,-turn*(H(at)+1.8));p.psi=app.trackAt(at).psi;board(p,String(m));}}
 // Complete pit lane, apron, garage buildings and limiter markers.
 const pit=app.pitModel();if(pit){const gs=pit.garageSide||1,pp=(q,n=0,h=0)=>app.pitSurface(q,n*gs,h);
 const pitStep=name==='Nordschleife'?.4:2.5;for(let q=0;q<pit.length;q+=pitStep){const b=Math.min(pit.length,q+pitStep);
  const apron=q>pit.boxStart-12&&q<pit.boxEnd+12?13:pit.half;
  for(let j=0,N=Math.ceil((apron+pit.half)/(name==='Nordschleife'?.25:1.1));j<N;j++){const n0=-pit.half+j*(apron+pit.half)/N,n1=-pit.half+(j+1)*(apron+pit.half)/N;quad(pp(q,n0,-.06),pp(q,n1,-.06),pp(b,n1,-.06),pp(b,n0,-.06),'#747b77');}
  for(const n of [-pit.half,apron]){const a=pp(q,n),c=pp(b,n),aa={...a,y:Math.min(a.y-.3,groundY(a.x,a.z)-.5)},cc={...c,y:Math.min(c.y-.3,groundY(c.x,c.z)-.5)};quad(a,c,cc,aa,'#747c77');}
for(let j=0;j<8;j++){const n0=-pit.half+j*pit.half/4,n1=n0+pit.half/4;quad(pp(q,n0,.02),pp(q,n1,.02),pp(b,n1,.02),pp(b,n0,.02),'#555a5a',1);}for(const n of [-pit.half,pit.half])quad(pp(q,n-.06,.035),pp(q,n+.06,.035),pp(b,n+.06,.035),pp(b,n-.06,.035),'#d9dccf',2);}
 for(const [q,word] of [[30,'PIT'],[pit.limitIn,String(pit.limit)],[pit.limitOut,'END']]){const p=pp(q,-5.1);p.psi=app.pitAt(q).psi;board(p,word,2.1);}
 for(const q of [pit.limitIn,pit.limitOut])quad(pp(q,-4,.045),pp(q,4,.045),pp(q+.3,4,.045),pp(q+.3,-4,.045),'#e2e4d9',2);
 const slots=ring||name==='Nordschleife'?[1]:Array.from({length:pit.slots||11},(_,i)=>i);
 const garageBox=(p,x,...args)=>box(p,x*gs,...args);
 for(const slot of slots){const q=app.pitBox(slot),p=app.pitAt(q),c=slot===1?'#00a995':'#536676';const footing=local(p,(pit.half+4.2)*gs,0,0),depth=Math.max(.3,p.y-groundY(footing.x,footing.z)+1);garageBox(p,pit.half+4.2,-depth,0,8,depth,11.3,'#89938e');garageBox(p,pit.half+4.2,0,0,7.8,3.6,11,'#c4c7c1');garageBox(p,pit.half+4.1,3.6,0,8.3,.28,11.7,'#647676');garageBox(p,pit.half+.26,.1,0,.05,2.65,8.6,'#162a31');garageBox(p,pit.half+.17,2.84,0,.1,.44,9.3,c);if(slot===1){quad(pp(q-3,1.5,.05),pp(q-3,4.1,.05),pp(q+3,4.1,.05),pp(q+3,1.5,.05),'#087c70',2);quad(pp(q,1.5,.058),pp(q,4.1,.058),pp(q+.2,4.1,.058),pp(q+.2,1.5,.058),'#99edcf',2);}}
 }
 // Permanently present scenery. It does not depend on distance, speed or camera heading.
 for(let d=0;d<L;d+=street?32:nords?21:70){if(ring||rally||museum||cinematic||t.scene==='runway'||t.buildings?.length&&street)continue;for(const side of [-1,1]){
  const seed=hash(d+side),n=side*(H(d)+(street?12:nords?11:36)+seed*(street?12:35)),p=P(d,n,-.12);p.psi=app.trackAt(d).psi;
  p.y=Math.min(p.y,groundY(p.x,p.z))-.45;if(!clear(p,street?7:5))continue;if(pit&&side===pit.side&&app.trackWrap(d-pit.entry,L)<pit.span)continue;
  if(street){if(d>1530&&d<2070&&side===1)continue;const width=10+seed*9,height=9+hash(d+6)*19,deep=9+seed*7;box(p,0,0,0,width,height,deep,['#cbbda6','#e1cfb3','#b9bdba','#d0b69b'][Math.floor(seed*4)]);box(p,0,height,0,width+.4,.4,deep+.4,'#9a9d93');for(let y=2;y<height-1;y+=3)for(let x=-width/2+1;x<width/2-1;x+=2.2){const wall=local(p,x,y,-deep/2-.015);quad(wall,local(p,x+1,y,-deep/2-.015),local(p,x+1,y+1.5,-deep/2-.015),local(p,x,y+1.5,-deep/2-.015),'#4d6368',3);}}
  else if(arid){const h=.25+seed*1.3;box(p,0,0,0,1.5+seed*3,h,1.8+seed*2,'#8d8874');}
  else if(estate){leafTree(p,8+seed*8,4+seed*2);}
  else{const height=7+seed*9,rad=2+seed*2;box(p,0,-.5,0,.42,height*.55,.42,'#6c6251');for(let tier=0;tier<2;tier++){const yy=height*(.28+tier*.25),top={...p,y:p.y+height*(.78+tier*.22)},rr=rad*(1-tier*.2);for(let j=0;j<7;j++){const a=j/7*Math.PI*2,b=(j+1)/7*Math.PI*2;tri({x:p.x+Math.cos(a)*rr,y:p.y+yy,z:p.z+Math.sin(a)*rr},{x:p.x+Math.cos(b)*rr,y:p.y+yy,z:p.z+Math.sin(b)*rr},top,j%2?'#35573b':'#416644');}}}
 }}
 // Monaco's tunnel remains in the scene both outside and inside; roof and wall have
 // thickness, and the harbour-facing side is carried on regularly spaced columns.
 if(name==='Circuit de Monaco')for(let d=1555;d<2050;d+=4){const b=Math.min(2050,d+4),aH=H(d)+.7,bH=H(b)+.7;quad(P(d,-aH,4.8),P(d,aH,4.8),P(b,bH,4.8),P(b,-bH,4.8),'#4c5255');quad(P(d,-aH,4.8),P(d,aH,4.8),P(d,aH,5.2),P(d,-aH,5.2),'#898f8b');quad(P(d,-aH,.0),P(b,-bH,.0),P(b,-bH,4.8),P(d,-aH,4.8),'#949891');if(Math.round(d)%16<4){const p=P(d,aH,0);p.psi=app.trackAt(d).psi;box(p,0,0,0,.5,4.8,.55,'#a6aaa0');}for(const side of [-1,1])quad(P(d,side*3,4.76),P(d,side*3+.12,4.76),P(d+1.5,side*3+.12,4.76),P(d+1.5,side*3,4.76),'#f3efcf',4);}
 if(suzuka){for(const d of [4885,4975]){const p=P(d,0,-7);p.psi=app.trackAt(d).psi;box(p,0,0,0,H(d)*2+.9,6.15,2.2,'#8c9892');}for(let d=4885;d<4975;d+=3){const b=d+3,H0=H(d);quad(P(d,-H0,-.85),P(d,H0,-.85),P(b,H(b),-.85),P(b,-H(b),-.85),'#747d7b');for(const side of [-1,1])quad(P(d,side*H0,-.85),P(b,side*H(b),-.85),P(b,side*H(b),0),P(d,side*H0,0),'#a3aca6');}for(const d of [4898,4962])for(const side of [-1,1]){const p=P(d,side*(H(d)-.5),-7);p.psi=app.trackAt(d).psi;box(p,0,0,0,1.2,6.5,1.4,'#8f9993');}}

 // Geographic buildings retain their own footprints. Heights without OSM tags
 // are approximate; openings and cladding are authored material details.
 for(const building of t.buildings||[]){const p=building.points.map(([x,z])=>({x,z,y:groundY(x,z)}));if(p.length<3||p.some(v=>!clear(v,1.2)||app.pitCovers(v,5)))continue;const y=Math.min(...p.map(v=>v.y)),height=building.height;for(const v of p)v.y=y;
  const paint=street?'#c5bba9':'#b2b7b3';for(let j=0;j<p.length;j++){const a=p[j],b=p[(j+1)%p.length],up=q=>({...q,y:y+height});quad(a,b,up(b),up(a),j%2?paint:'#979f9e');const len=Math.hypot(b.x-a.x,b.z-a.z),dx=(b.x-a.x)/len,dz=(b.z-a.z)/len;
   for(let h=2;h<height-1;h+=3.2)for(let m=1;m<len-1.7;m+=3.2){const Q=(d,v)=>({x:a.x+dx*d+dz*.02,z:a.z+dz*d-dx*.02,y:y+v});quad(Q(m,h),Q(m+1.25,h),Q(m+1.25,h+1.45),Q(m,h+1.45),'#495b65',3);}}
  for(let j=1;j<p.length-1;j++)tri({...p[0],y:y+height},{...p[j],y:y+height},{...p[j+1],y:y+height},'#899492');
 }
 for(const [start,end,height]of t.bridges||[]){for(let d=start;d<end;d+=3){const b=Math.min(end,d+3),h=H(d);quad(P(d,-h,-.65),P(d,h,-.65),P(b,H(b),-.65),P(b,-H(b),-.65),'#788482');for(const side of [-1,1])quad(P(d,side*h,-.65),P(b,side*H(b),-.65),P(b,side*H(b),0),P(d,side*h,0),'#a1aaa5');}for(const d of [start+5,end-5])for(const side of [-1,1]){const p=P(d,side*(H(d)-.8),-height);p.psi=app.trackAt(d).psi;box(p,0,0,0,1.2,height-.6,1.4,'#8b9691');}}
 if(rally){for(const d of [0,L]){const p=P(d);p.psi=app.trackAt(d).psi;for(const side of [-1,1])box(p,side*(H(d)+1),0,0,.45,4,.45,'#e9c229');box(p,0,3.5,0,H(d)*2+2.5,.65,.5,'#e7bf2c');}for(const zone of t.serviceZones||[]){const d=(zone[0]+zone[1])/2,p=P(d,H(d)+11);p.psi=app.trackAt(d).psi;box(p,0,0,0,4,2.7,9,'#d5d9d5');box(p,-4,2.5,0,6,.16,10,'#ece7d8');}}
 // Architectural primitives for the film sets and the estate hill. Dimensions
 // are authored interpretations; the source note never calls these surveys.
 function cylinder(p,x,y,z,r,h,col,sides=12){for(let j=0;j<sides;j++){const a=j/sides*Math.PI*2,b=(j+1)/sides*Math.PI*2;quad(local(p,x+Math.cos(a)*r,y,z+Math.sin(a)*r),local(p,x+Math.cos(b)*r,y,z+Math.sin(b)*r),local(p,x+Math.cos(b)*r,y+h,z+Math.sin(b)*r),local(p,x+Math.cos(a)*r,y+h,z+Math.sin(a)*r),C(col).map(v=>v*(.72+.22*Math.cos(a-.6))));tri(local(p,x,y+h,z),local(p,x+Math.cos(a)*r,y+h,z+Math.sin(a)*r),local(p,x+Math.cos(b)*r,y+h,z+Math.sin(b)*r),col);}}
 function leafTree(p,height,r){box(p,0,0,0,.55,height*.65,.6,'#70614a');for(let cluster=0;cluster<3;cluster++){const cx=cluster===0?-r*.38:cluster===1?r*.4:0,cz=cluster===0?r*.2:cluster===1?-r*.25:0,cy=height*(cluster===2?.81:.64),rx=r*(cluster===2?.72:.82),ry=height*.24;const Q=(j,k)=>{const a=j/8*Math.PI*2,b=-Math.PI/2+k/4*Math.PI;return local(p,cx+rx*Math.cos(b)*Math.cos(a),cy+ry*Math.sin(b),cz+rx*Math.cos(b)*Math.sin(a));};for(let j=0;j<8;j++)for(let k=0;k<4;k++)litQuad(Q(j,k),Q(j+1,k),Q(j+1,k+1),Q(j,k+1),cluster===2?'#527448':'#43673d');}}

 function arch(p,x,y,z,w,h,col){quad(local(p,x-w/2,y,z),local(p,x+w/2,y,z),local(p,x+w/2,y+h-w/2,z),local(p,x-w/2,y+h-w/2,z),col);for(let j=0;j<12;j++){const a=j/12*Math.PI,b=(j+1)/12*Math.PI;tri(local(p,x,y+h-w/2,z),local(p,x+Math.cos(a)*w/2,y+h-w/2+Math.sin(a)*w/2,z),local(p,x+Math.cos(b)*w/2,y+h-w/2+Math.sin(b)*w/2,z),col);}}
 function facade(p,width,height,depth,stone,style='stone'){
  box(p,0,0,0,width,height,depth,stone);box(p,0,height-.35,0,width+.5,.32,depth+.45,style==='neon'?'#425060':'#c9bea7');
  const front=-depth/2-.025;
  for(let y=2;y<height-1;y+=3.15)for(let x=-width/2+1.2;x<width/2-1;x+=2.7){box(p,x,y-.15,front,1.35,.13,.25,'#c9c0aa');arch(p,x,y,front-.02,1.05,1.65,style==='neon'?'#b1c9c7':'#3d4747');if(style==='stone')for(const side of[-1,1])box(p,x+side*.63,y,front-.04,.18,1.65,.09,'#676c61');}
  arch(p,0,0,front-.05,2.4,3.3,'#363b37');
  if(style!=='neon'){const r1=local(p,-width/2-.3,height,-depth/2-.3),r2=local(p,width/2+.3,height,-depth/2-.3),r3=local(p,width/2+.3,height,depth/2+.3),r4=local(p,-width/2-.3,height,depth/2+.3),a=local(p,-width/2,height+2.2,0),b=local(p,width/2,height+2.2,0);quad(r1,r2,b,a,'#897260');quad(a,b,r3,r4,'#705b4d');tri(r1,a,r4,stone);tri(r2,r3,b,stone);}
  else{for(let x=-width/2+.8;x<width/2;x+=2.8)box(p,x,2,front-.2,.55,height-3,.2,x%2?'#9b3e75':'#429999');}
 }
 function stageAt(d){return(t.stages||[]).find(s=>d>=s.from&&d<s.to)||t.stages?.at(-1);}
 function missionRoad(a,b,i){const surf=stageAt(a)?.surf||'stone',h0=H(a),h1=H(b),water=['water','sub'].includes(surf),metal=['steel','leg','under','grate','bridge','pad','hold'].includes(surf),indoor=['carpet','corridor','casino','backroom','gears','hold'].includes(surf),c=water?'#365f70':metal?'#677777':surf==='wood'?'#73634b':['carpet','casino'].includes(surf)?'#692830':['stone','piazza','steps','market','stalls'].includes(surf)?'#9c927c':'#585d5f';
  quad(P(a,-h0,.025),P(a,h0,.025),P(b,h1,.025),P(b,-h1,.025),c,water?3:1);
  if(water){for(const side of[-1,1])quad(P(a,side*h0,-.04),P(b,side*h1,-.04),P(b,side*300,-.08),P(a,side*300,-.08),'#396b7c',3);return;}
  for(const side of[-1,1]){const n0=side*h0,n1=side*h1;quad(P(a,n0),P(b,n1),P(b,n1+side*3,.14),P(a,n0+side*3,.14),metal?'#435d66':'#a9a18c');if(metal||['viaduct','quay','marina','suspension'].includes(surf)){for(const y of[.4,1.1])quad(P(a,n0,y),P(b,n1,y),P(b,n1,y+.07),P(a,n0,y+.07),metal?'#c2c9c7':'#b4aa92');if(i%4===0){const p=P(a,n0);p.psi=app.trackAt(a).psi;box(p,0,0,0,.16,1.2,.18,'#929b92');}}
   if(indoor){quad(P(a,n0+side*3,.15),P(b,n1+side*3,.15),P(b,n1+side*3,7),P(a,n0+side*3,7),surf==='hold'?'#8c9496':'#a79c86');}}
  if(indoor){quad(P(a,-h0-3,7),P(a,h0+3,7),P(b,h1+3,7),P(b,-h1-3,7),'#51595b');if(i%6===0)for(const side of[-1,1])band(a,b,side*3-.2,side*3+.2,'#eadfbe',6.97,4);}
  if(['wood','stone','piazza','steps','grate'].includes(surf)&&i%2===0)band(a,a+.06,-h0,h0,metal?'#303f45':'#746d5e',.034,2);
  if(surf==='wood')for(let n=-h0;n<h0;n+=.6)band(a,b,n,n+.025,'#514638',.035,2);
 }
 function missionSets(){for(const stage of t.stages||[]){const {from,to,surf}=stage,sea=['wood','steel','leg','under','grate','bridge','pad','water','sub'].includes(surf),alpine=['alpine','forest','mirrorwall'].includes(surf),urban=['stone','steps','piazza','city','mall','boulevard','neon','alley','riviera','marina','market','stalls'].includes(surf);
   if(urban)for(let d=from+8;d<to;d+=surf==='piazza'?38:23)for(const side of[-1,1]){const seed=hash(d+side),p=P(d,side*(H(d)+(surf==='piazza'?20:10)));p.psi=app.trackAt(d).psi+side*Math.PI/2;if(!clear(p,5))continue;const modern=['neon','alley'].includes(surf);facade(p,13+seed*6,modern?14+seed*19:7+seed*7,10,modern?'#546169':surf==='stone'||surf==='piazza'?'#bbac91':['#c1b195','#c3baa3','#b9b8ad'][Math.floor(seed*3)],modern?'neon':'stone');}
   if(['market','stalls','marina'].includes(surf))for(let d=from+10;d<to;d+=16)for(const side of[-1,1]){const p=P(d,side*(H(d)+3));p.psi=app.trackAt(d).psi;box(p,0,0,0,2.4,.8,4,'#8a7050');box(p,0,2.4,0,3,.15,5,'#8d4340');for(const x of[-1,1])for(const z of[-1.8,1.8])box(p,x,0,z,.07,2.5,.07,'#9f9786');for(const z of[-1,0,1])cylinder(p,0,.85,z,.35,.35,'#6a7977');}
   if(alpine)for(let d=from;d<to;d+=26)for(const side of[-1,1]){const p=P(d,side*(H(d)+14+hash(d)*18));p.psi=app.trackAt(d).psi;if(!clear(p,4))continue;if(surf!=='alpine'||side===1)leafTree(p,7+hash(d+3)*7,3);else{const r=14+hash(d)*18;if(!sceneryClear(p,r+3))continue;for(let j=0;j<8;j++){const a=j/8*Math.PI*2,b=(j+1)/8*Math.PI*2;litTri(local(p,Math.cos(a)*r,-4,Math.sin(a)*r),local(p,Math.cos(b)*r,-4,Math.sin(b)*r),local(p,0,15+hash(d)*25,0),'#9e9b8b');}}}
   if(['refinery','grate','steel','pad','under'].includes(surf))for(let d=from+20;d<to;d+=65){const p=P(d,H(d)+12);p.psi=app.trackAt(d).psi;cylinder(p,0,0,0,5,12,'#a5aaa3');for(const y of[1,6,10])cylinder(p,0,y,0,5.1,.25,'#677978');for(const side of[-1,1]){box(p,side*6,0,0,.3,17,.3,'#9ea699');box(p,side*6,16,0,.35,.3,24,'#b0ae96');}box(p,0,16,0,12,.3,.3,'#c0b8a5');}
   if(['bridge','suspension','viaduct'].includes(surf))for(let d=from+10;d<to;d+=34){const p=P(d);p.psi=app.trackAt(d).psi;for(const side of[-1,1]){box(p,side*(H(d)+1),-18,0,1.4,29,1.6,'#899690');quad(local(p,side*(H(d)+1),11,0),local(p,side*(H(d)+1),1,28),local(p,side*(H(d)+1),1.3,28),local(p,side*(H(d)+1),11.3,0),'#aab3aa');}box(p,0,10.5,0,H(d)*2+3,.5,.8,'#a1aaa4');}
   if(sea)for(let d=from;d<to;d+=30)for(const side of[-1,1])quad(P(d,side*(H(d)+4),-12),P(Math.min(d+30,to),side*(H(d)+4),-12),P(Math.min(d+30,to),side*450,-12),P(d,side*450,-12),'#284c60',3);
   if(['carpet','casino','backroom','corridor'].includes(surf))for(let d=from+8;d<to;d+=16)for(const side of[-1,1]){const p=P(d,side*(H(d)+1.5));p.psi=app.trackAt(d).psi;cylinder(p,0,0,0,.38,6.8,'#ded0aa');cylinder(p,0,0,0,.62,.3,'#b8a47a');if(surf==='casino'){cylinder(p,0,1.0,5,1.2,.18,'#295a49');cylinder(p,0,0,5,.16,1,'#806745');}if(surf==='carpet'||surf==='casino'){cylinder(p,0,5,0,.65,.15,'#d8b16b');for(let j=0;j<6;j++){const a=j/6*Math.PI*2;box(p,Math.cos(a)*.65,5,Math.sin(a)*.65,.1,.5,.1,'#fff0c4');}}}
   if(surf==='piazza'){const d=from+(to-from)*.55,p=P(d,H(d)+30);p.psi=app.trackAt(d).psi+Math.PI/2;facade(p,24,16,13,'#c5b798');box(p,9,0,0,5,25,6,'#c2b28f');for(const x of[-9,9])arch(p,x,2,-6.56,2,4,'#44473d');cylinder({...p,psi:p.psi+Math.PI/2},0,18,0,.9,.1,'#978266');}
  }}
 if(cinematic)missionSets();
 if(rally||cinematic||name==='Furka Pass')buildDetailedScenery({app,t,name,L,P,H,local,box,quad,tri,litQuad,litTri,cylinder,leafTree,facade,arch,groundY,clear,sceneryClear,hash,C});
 if(museum)buildMuseumWorld({P,local,box,quad,tri,cylinder,C,app});
 if(estate){for(let d=15;d<L;d+=2.8)for(const side of[-1,1]){const p=P(d,side*(H(d)+.7));p.psi=app.trackAt(d).psi;box(p,0,0,0,.8,.85,2.6,'#bca575');box(p,0,.37,0,.81,.04,2.6,'#8b7b59');}
  // Flint Wall: patterned stone outside the climbing estate road.
  for(let d=1160;d<1380;d+=2){const p=P(d,H(d)+1.5);p.psi=app.trackAt(d).psi;box(p,0,0,0,.48,2.15,2,'#888b80');box(p,0,2.15,0,.6,.12,2,'#b6b6a4');for(let y=.25;y<2;y+=.38)for(let z=-.8;z<1;z+=.45)box(p,-.251,y,z,.035,.23,.28,hash(d+y+z)>.5?'#626e6d':'#a0a493');}
  for(let d=0;d<.92;d+=.23)band(d,d+.21,-H(d),H(d),'#956d52',.047,2);
 }

 const out=new ArrayBuffer(vertexCount*16),bytes=new Uint8Array(out),batches=[];let first=0;for(const tile of tiles.values()){let offset=0;for(const part of tile.chunks){const size=Math.min(4096,tile.count-offset)*16;bytes.set(new Uint8Array(part.buffer,0,size),(first+offset)*16);offset+=size/16;}batches.push({first,count:tile.count,min:tile.min,max:tile.max});first+=tile.count;}
 return{buffer:out,vertices:vertexCount,batches,bounds:{xmin,xmax,zmin,zmax},length:L};
}
