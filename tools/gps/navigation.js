/* Garage navigation. Map rendering is read-only; explicit destination selection
   delegates routing to the city's navigation adapter.
   Maps use the simulated road, not an unrelated decorative circuit SVG. */
(function () {
  'use strict';
  const historical = new Set(['gto','f40','p917','db5','slr300','mcf1','supra','evo','s2000','rx7']);
  const eligible = key => !(key.startsWith('f1') && key !== 'f12tdf') && !historical.has(key);
  // Expose renderer geometry in the loaded copy only. Original downloads stay intact.
  function prepare(html, key) {
    if (!eligible(key) && key !== 'evo') return html;
    // A map gesture must not steer the car while trackpad steering is active.
    html=html.replace('if (!state.trackpadSteering || e.ctrlKey) return;', 'if (e.target?.closest?.("#gpsUnit") || !state.trackpadSteering || e.ctrlKey) return;');
    html=html.replace('if (!state.trackpadSteering || event.ctrlKey || isTypingTarget(event)) return;', 'if (event.target?.closest?.("#gpsUnit") || !state.trackpadSteering || event.ctrlKey || isTypingTarget(event)) return;');
    if (key === 'phantom') return html;
    const exportPattern = /Object\.assign\(app, \{ resizeCanvas, drawWorld, drawMap, injectArt, roundRect([^}]*)\}\);/;
    if (!exportPattern.test(html)) throw Error('GPS renderer bridge missing for '+key);
    html = html.replace(exportPattern, (s, extra) => `Object.assign(app, { resizeCanvas, drawWorld, drawMap, injectArt, roundRect${extra}, gpsBridge: {projectAhead,centerlineAt,drawRearView,mirror:MIRROR,envColors,arDepth:typeof buildVisibleCars === "function"} });`);
    if(html.includes('function buildVisibleCars(mirror=false)')) {
      const marker='    if(state.learnMode&&!mirror){';
      if(!html.includes(marker))throw Error('GPS depth renderer bridge missing for '+key);
      html=html.replace(marker,`    if(app.gps?.mode==='ar'&&!mirror&&!state.ldn){
        const t=app.trackModel(),max=t.closed===false?Math.min(95,t.L-state.distanceM):95;let count=0;
        for(let off=5;off<max;off+=7){const d=state.distanceM+off,n=state.inPitLane?0:app.clamp(app.racingOffset(d),-app.halfWidthAt(d)+1.4,app.halfWidthAt(d)-1.4);
          const P=(ahead,lat)=>state.inPitLane?app.pitSurface((state.pitQ||0)+off+ahead,lat,.06):trackPoint(d+ahead,lat,.06),C=[90,216,250];
          quad(P(0,n-.64),P(.2,n-.64),P(2.1,n),P(1.8,n),C,4);
          quad(P(1.8,n),P(2.1,n),P(.2,n+.64),P(0,n+.64),C,4);count++;
        }app.gps.arRendered=count;
      }
`+marker);
    }
    return html.replace('function drawRearView(mx, my, mw, mh, p, pal) {', 'function drawRearView(mx, my, mw, mh, p, pal) { if(app.gps?.mode === "mirror" && p.eye === 0 && !app.gps.renderingRear) return;');
  }
  function install(win, app, key) {
    if (app.gps) return;
    const fullGPS=eligible(key),baseModes=fullGPS?["off","mirror","ar","dashboard","line"]:["off","line"],modePref=fullGPS?"mucs-gps-mode":"mucs-outline-mode";
    let modes=baseModes,cityMode=false,previousMode=null,previousPreset=1;
    const doc=win.document, state=app.state, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), wrap=(d,L)=>(d%L+L)%L;
    const TAU=Math.PI*2, angle=a=>Math.atan2(Math.sin(a),Math.cos(a));
    const getPref=(k,f)=>{try{return win.localStorage.getItem(k)||f;}catch{return f;}};
    const save=(k,v)=>{try{win.localStorage.setItem(k,v);}catch{}};
    let mode=getPref(modePref,fullGPS?'dashboard':'line');if(!modes.includes(mode))mode=fullGPS?'dashboard':'line';
    let preset=Number(getPref('mucs-gps-preset','1'))===2?2:1;
    const zooms={1:1,2:1};let model=null, signature='', lastMap=-Infinity, lastLayout='', snapshot={}, transform=null;
    let placement=null;try{placement=JSON.parse(getPref('mucs-outline-position','null'));}catch{}
    const make=(tag,props,parent)=>{const e=doc.createElement(tag);Object.assign(e,props);parent?.appendChild(e);return e;};
    const style=make('style',{textContent:`
      #gpsControls,#gpsUnit,#gpsAR{box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif}
      body:not(.view-drive) #gpsControls,body:not(.view-drive) #gpsUnit,body:not(.view-drive) #gpsAR{display:none!important}
      #gpsControls{display:inline-flex;align-items:center;gap:5px;font-size:11px;white-space:nowrap;color:#c8d8df}
      #gpsDestination{max-width:190px;background:#16232d;color:#fff;border:1px solid #576b74;border-radius:6px;padding:5px;font:11px system-ui}\n      #gpsMode{font:600 11px system-ui;padding:6px;border:1px solid #576b74;border-radius:6px;background:#16232d;color:#f4fafc;max-width:151px}
      #gpsUnit{position:fixed;z-index:24;border:3px solid #26383f;border-radius:12px;background:#0c1d26;box-shadow:0 3px 14px #0009;overflow:hidden;isolation:isolate;color:#f5faff;pointer-events:auto}
      #gpsUnit[hidden],#gpsAR[hidden]{display:none!important}
      #gpsTitle{height:25px;padding:5px 8px;font-size:10px;font-weight:650;letter-spacing:.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:#142e3c}
      #gpsViewport{display:block;width:100%;height:calc(100% - 50px);touch-action:none;cursor:zoom-in;outline-offset:-3px}
      #gpsFooter{height:25px;display:flex;align-items:center;gap:4px;padding:0 4px;background:#142e3c;font-size:9px}
      #gpsFooter button{font:600 11px system-ui;min-width:25px;min-height:23px;padding:0 5px;border:0;border-radius:4px;background:#294957;color:#fff;cursor:pointer}
      #gpsPreset{margin-right:auto;white-space:nowrap}#gpsScale{font-variant-numeric:tabular-nums;white-space:nowrap}
      #gpsCredits{position:absolute;bottom:26px;right:4px;font:7px system-ui;color:#395664;background:#fffdf2d9;padding:1px 3px;text-decoration:none;z-index:2}#gpsUnit[data-mode=mirror] #gpsCredits{right:calc(22% + 4px)}
      #gpsRear{position:absolute;right:0;top:0;bottom:0;width:22%;background:transparent;border-left:3px solid #26383f;pointer-events:none}
      #gpsRear span{position:absolute;bottom:3px;left:3px;font:bold 8px system-ui;background:#12202abf;border-radius:3px;padding:2px;color:white}
      #gpsUnit[data-mode=mirror]{background:linear-gradient(90deg,#0c1d26 78%,transparent 78%);border-color:#35444c;border-radius:9px}
      #gpsUnit[data-mode=mirror] #gpsTitle,#gpsUnit[data-mode=mirror] #gpsViewport,#gpsUnit[data-mode=mirror] #gpsFooter{width:78%;box-sizing:border-box}
      #gpsUnit[data-mode=ar]{border-color:#66cfffa0;box-shadow:0 0 14px #65ccff29}
      #gpsUnit[data-mode=line]{border:0;border-radius:0;background:transparent;box-shadow:none;overflow:visible}
      #gpsUnit[data-mode=line] #gpsTitle,#gpsUnit[data-mode=line] #gpsFooter,#gpsUnit[data-mode=line] #gpsCredits{display:none}
      #gpsUnit[data-mode=line] #gpsViewport{height:100%;width:100%;cursor:grab;filter:drop-shadow(0 1px 2px #000a)}
      #gpsAR{position:fixed;inset:0;pointer-events:none;z-index:5}
      @media(max-width:600px){#gpsMode{max-width:130px;padding:4px}#gpsControls{font-size:10px}}
    `},doc.head);
    const controls=make('label',{id:'gpsControls',textContent:fullGPS?'GPS ':'Map '},doc.querySelector('.tabs')||doc.querySelector('.topbar')||doc.body);
    const select=make('select',{id:'gpsMode',title:'Navigation display'},controls);select.setAttribute('aria-label','GPS display mode');
    for(const [value,label] of [['off','Off'],['mirror','Rear-view mirror'],['ar','AR · on the road'],['dashboard','Dashboard'],['line','Track outline']])if(modes.includes(value))make('option',{value,textContent:label},select);
    let destinationSelect=null;
    if(app.cityNetwork){destinationSelect=make('select',{id:'gpsDestination',title:'Choose a London destination'},controls);destinationSelect.setAttribute('aria-label','London destination');make('option',{value:'',textContent:'No destination · explore London'},destinationSelect);for(const p of app.cityNetwork.locations.slice().sort((a,b)=>a.name.localeCompare(b.name)))make('option',{value:p.id,textContent:p.name},destinationSelect);destinationSelect.onchange=()=>chooseDestination(destinationSelect.value);}
    function chooseDestination(id){if(!app.cityNetwork?.destination(id))return;destinationSelect.value=id;syncCity();if(id)setPreset(2);signature='';lastMap=-Infinity;return true;}
    const unit=make('section',{id:'gpsUnit'},doc.body);unit.setAttribute('aria-label','Live GPS navigation');
    const title=make('div',{id:'gpsTitle'},unit),canvas=make('canvas',{id:'gpsViewport',tabIndex:0},unit);canvas.setAttribute('role','button');canvas.setAttribute('aria-label','Track map: tap to switch whole route and road views; scroll or pinch to zoom');
    const footer=make('div',{id:'gpsFooter'},unit),toggle=make('button',{id:'gpsPreset',type:'button'},footer),scaleLabel=make('span',{id:'gpsScale'},footer);
    const minus=make('button',{id:'gpsZoomOut',type:'button',textContent:'−',title:'Zoom out'},footer),plus=make('button',{id:'gpsZoomIn',type:'button',textContent:'+',title:'Zoom in'},footer);
    minus.setAttribute('aria-label','GPS zoom out');plus.setAttribute('aria-label','GPS zoom in');
    const credits=make('a',{id:'gpsCredits',textContent:'© OpenStreetMap',href:'https://www.openstreetmap.org/copyright',target:'_blank',rel:'noopener'},unit);credits.title='Map data © OpenStreetMap contributors · ODbL 1.0';
    const rear=make('div',{id:'gpsRear'},unit);make('span',{textContent:'LIVE REAR'},rear);
    const ar=make('canvas',{id:'gpsAR'},doc.body),g=canvas.getContext('2d'),ag=ar.getContext('2d');
    const gps=app.gps={mode,preset,renderingRear:false,setMode,setPreset,chooseDestination,zoom:zoomBy,render:renderNow,inspect:()=>snapshot};
    function setMode(value){if(!modes.includes(value))return;mode=value;gps.mode=value;snapshot.mode=value;select.value=value;save(cityMode?'mucs-london-gps-mode':modePref,value);lastLayout='';lastMap=-Infinity;unit.dataset.mode=value;unit.hidden=value==='off';rear.hidden=value!=='mirror';ar.hidden=value!=='ar';if(value!=='ar')ag.clearRect(0,0,ar.width,ar.height);}
    function syncCity(){
      const active=!!state.ldn;if(destinationSelect)destinationSelect.hidden=!active;
      if(active===cityMode)return;
      cityMode=active;modes=active?["off","mirror","ar","dashboard","line"]:baseModes;
      select.replaceChildren();for(const [value,label] of [['off','Off'],['mirror','Rear-view mirror'],['ar','AR · on the road'],['dashboard','Dashboard'],['line','Track outline']])if(modes.includes(value))make('option',{value,textContent:label},select);
      if(active){previousMode=mode;previousPreset=preset;setMode('dashboard');setPreset(2);}
      else{setMode(modes.includes(previousMode)?previousMode:baseModes[1]);setPreset(previousPreset);}
      signature='';lastLayout='';lastMap=-Infinity;
    }
    function setPreset(value){preset=value===2?2:1;gps.preset=preset;zooms[preset]=1;save('mucs-gps-preset',String(preset));lastMap=-Infinity;}
    function zoomBy(factor){zooms[preset]=clamp(zooms[preset]*factor,1/32,4096);lastMap=-Infinity;}
    select.addEventListener('change',()=>setMode(select.value));toggle.onclick=()=>setPreset(preset===1?2:1);minus.onclick=()=>zoomBy(1/1.5);plus.onclick=()=>zoomBy(1.5);
    for(const e of [controls,unit])for(const type of ['keydown','pointerdown','pointerup','click'])e.addEventListener(type,ev=>ev.stopPropagation());
    canvas.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();setPreset(preset===1?2:1);}else if(e.key==='+'||e.key==='='){e.preventDefault();zoomBy(1.5);}else if(e.key==='-'){e.preventDefault();zoomBy(1/1.5);}});
    canvas.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();zoomBy(Math.exp(clamp(-e.deltaY*.002,-.5,.5)));},{passive:false});
    const pointers=new Map();let gesture=null,pinch=0;
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){const box=unit.getBoundingClientRect();gesture={x:e.clientX,y:e.clientY,left:box.left,top:box.top,moved:false};}else{gesture.moved=true;gesture.pinched=true;const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);}});
    canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(gesture&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>5)gesture.moved=true;if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch>2)zoomBy(d/pinch);pinch=d;}else if(mode==='line'&&gesture.moved&&!gesture.pinched){const W=unit.offsetWidth,H=unit.offsetHeight;placement={x:clamp(gesture.left+e.clientX-gesture.x,4,win.innerWidth-W-4)/Math.max(1,win.innerWidth-W),y:clamp(gesture.top+e.clientY-gesture.y,4,win.innerHeight-H-4)/Math.max(1,win.innerHeight-H)};lastLayout='';layout();}});
    canvas.addEventListener('pointerup',e=>{if(pointers.size===1&&gesture&&!gesture.moved){if(!pickDestination(e))setPreset(preset===1?2:1);}if(mode==='line'&&placement)save('mucs-outline-position',JSON.stringify(placement));pointers.delete(e.pointerId);});for(const type of ['pointercancel','lostpointercapture'])canvas.addEventListener(type,e=>{pointers.delete(e.pointerId);if(gesture)gesture.moved=true;});
    function pickDestination(e){
      if(mode==='line'||!state.ldn||!app.cityNetwork||!transform)return false;
      const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top,{scale,cx,cz,w,h}=transform;
      const targets=(transform.pins||[]).map(pin=>({p:app.cityNetwork.locations.find(p=>p.id===pin.id),d:Math.hypot(pin.x-x,pin.y-y)})).sort((a,b)=>a.d-b.d);
      return targets[0]?.d<11?!!chooseDestination(targets[0].p.id):false;
    }
    const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z);
    const lateral=(p,n=0)=>({...p,x:p.x+Math.cos(p.psi||0)*n,z:p.z-Math.sin(p.psi||0)*n});
    function modelForRoute(){
      const t=app.trackModel?.(),ldn=state.ldn,route=state.route||{},free=!route.active&&!t,start=free?Math.floor(state.distanceM/4000)*4000-1000:0,id=[route.name,route.totalM,!!t,ldn?.road.name||'',ldn?.dir||0,start].join('|');
      if(id===signature&&model)return model;signature=id;
      const L=t?.L||route.totalM||6000,closed=t?t.closed!==false:!!route.loop;
      let points=[],at,net=[],labels=t?.labels||((route.trackCorners||[]).map(c=>[c.at+c.len*.5,c.name||'Corner']));
      if(ldn&&app.LDN){
        for(const r of app.LDN.roads)net.push({name:r.name,points:[{x:r.A.e*1000,z:r.A.n*1000},{x:r.B.e*1000,z:r.B.n*1000}]});
        const r=ldn.road,a=ldn.dir>0?r.A:r.B,psi=r.brg+(ldn.dir>0?0:Math.PI);
        at=d=>app.cityNetwork?.at(d)||({x:a.e*1000+Math.sin(psi)*d,z:a.n*1000+Math.cos(psi)*d,psi,y:0});points=[{...at(0),d:0,H:app.halfWidthAt(0)},{...at(r.len),d:r.len,H:app.halfWidthAt(r.len)}];
        labels=app.cityNetwork?.locations||app.LDN.nodes.map(n=>({x:n.e*1000,z:n.n*1000,name:n.name}));
      }else if(t){
        at=d=>app.trackAt(d);const count=t.points.length;
        points=t.points.map(([x,z],i)=>{const d=i*L/(closed?count:count-1),p=at(d);return{x,z,d,y:p.y,psi:p.psi,H:app.halfWidthAt(d)};});
        if(closed)points.push({...points[0],d:L});
      }else{
        const N=Math.min(35000,Math.max(200,Math.ceil(L/4))),step=L/N;let x=0,z=0,psi=0;
        for(let i=0;i<=N;i++){const d=start+i*step;points.push({x,z,d,psi,y:0,H:app.halfWidthAt?.(d)||7});psi+=(app.curvatureAt?.(d+step*.5)||0)*step;x+=Math.sin(psi)*step;z+=Math.cos(psi)*step;}
        at=d=>{const q=closed?wrap(d,L):clamp(d-start,0,L),f=q/step,i=Math.min(N-1,Math.floor(f)),u=f-i,a=points[i],b=points[i+1];return{x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u,psi:a.psi+angle(b.psi-a.psi)*u,y:0};};
      }
      let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
      for(const p of net.length?net.flatMap(r=>r.points):points){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minZ=Math.min(minZ,p.z);maxZ=Math.max(maxZ,p.z);}
      const pit=t?app.pitModel?.():null;
      const context=(t?window.MUCS_GPS_CONTEXT?.routes?.[route.name]:null)||[];
      const features=context.map(f=>{const points=f.points.map(([x,z])=>({x,z}));let x0=Infinity,x1=-Infinity,z0=Infinity,z1=-Infinity;for(const p of points){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);z0=Math.min(z0,p.z);z1=Math.max(z1,p.z);}return {...f,points,x0,x1,z0,z1};});
      model={id,t,L,closed,free,start,points,at,net,labels,features,minX,maxX,minZ,maxZ,pit,buildings:t?.buildings||[],rally:t?.terrain==='rally'||/desert|dune|canyon/.test(route.env),name:ldn?'London road network':route.active?route.name:'Free drive'};
      return model;
    }
    function playerPoint(){
      if(state.ldn&&app.cityNetwork)return app.cityNetwork.playerPoint();
      if(model.t){const p=app.contactPose?.()||app.worldPose?.()||lateral(model.at(state.distanceM),state.laneOffset);return{...p,psi:app.contactPose?.()?p.psi:p.psi+(state.headingRel||0)};}
      const d=state.ldn?(state.edgeD??state.distanceM):state.distanceM,p=lateral(model.at(d),state.laneOffset||0);return{...p,psi:p.psi+(state.headingRel||0)};
    }
    function cars(){
      const all=[];
      if(state.ldn&&app.cityNetwork)return app.cityNetwork.policePoses().map(p=>({...p,name:p.name||'Police',color:'#448cd6',kind:'police'}));
      if(state.raceGrid!==false)for(const r of state.rivals||[]){if(r.gone||r.out)continue;let p=model.t?app.contactPose?.(r):null;
        if(!finite(p))p=model.t&&r.pitState?app.pitSurface(r.pitQ||0,r.lane||0):lateral(model.at(r.distM||0),r.lane||0);
        if(finite(p))all.push({...p,name:r.name||'Rival',color:r.body||'#ef8854',kind:'rival',d:r.distM});}
      for(const r of state.traffic||[]){if(r.hidden)continue;const d=state.ldn?(state.edgeD||0)+r.z:(Number.isFinite(r.routeD)&&state.city?r.routeD:state.distanceM+r.z),p=lateral(model.at(d),r.lat??((r.lane||0)*3+(r.oncoming?-3.6:0)));if(finite(p))all.push({...p,psi:p.psi+(r.oncoming?Math.PI:0),name:r.kind||'Traffic',color:'#d06d35',kind:'traffic',d});}
      for(const r of state.pursuit||[]){const p=lateral(model.at(r.distM),r.lane||0);if(finite(p))all.push({...p,name:r.name,color:'#448cd6',kind:'police',d:r.distM});}
      return all;
    }
    function layout(){
      const w=win.innerWidth,h=win.innerHeight,bar=doc.querySelector('.topbar')?.getBoundingClientRect(),bottom=doc.querySelector('.bottombar')?.getBoundingClientRect();
      const top=Math.max(8,bar?.bottom||8),floor=Math.min(h-6,bottom?.top||h-6),key=[w,h,mode,cityMode,top,floor].join('|');if(key===lastLayout)return;lastLayout=key;
      let W,H,x,y;
      if(mode==='line'){W=Math.min(270,w*.30);H=Math.min(215,h*.26);x=w-W-14;y=Math.max(top+12,Math.min(h*.39,floor-H-8));}
      else if(mode==='mirror'){W=Math.min(450,w*.63);H=clamp(h*.20,130,176);x=(w-W)/2;y=top+8;}
      else if(mode==='ar'){W=Math.min(275,w*.43);H=Math.min(180,h*.25);x=w-W-12;y=top+12;}
      else{W=Math.min(322,w*.30);H=Math.min(210,Math.max(145,h*.245));x=w*.64;H=Math.min(H,185);y=Math.max(h*.61,floor-H-4);if(y+H>floor)H=Math.max(108,floor-y);}
      if(w<600){W=mode==='mirror'?Math.min(w-20,355):Math.min(w*.49,260);H=mode==='mirror'?140:160;x=mode==='mirror'?(w-W)/2:w-W-8;y=mode==='mirror'?top+5:Math.max(h*.65,floor-H-5);}
      if(cityMode&&mode!=='line'){if(mode==='dashboard'){W=Math.min(370,w*.36);H=Math.min(290,h*.34);x=w-W-12;y=floor-H-5;}else if(mode==='ar'){W=Math.min(330,w*.36);H=Math.min(250,h*.31);}else H=Math.min(230,h*.28);if(w<600){W=mode==='mirror'?w-20:Math.min(w*.54,300);H=Math.min(235,h*.32);x=mode==='mirror'?(w-W)/2:w-W-6;y=mode==='mirror'?top+5:floor-H-5;}}
      H=Math.max(105,Math.min(H,h-top-14));y=clamp(y,top+4,h-H-6);x=clamp(x,4,w-W-4);
      if(mode==='line'&&placement){x=clamp(placement.x*(w-W),4,w-W-4);y=clamp(placement.y*(h-H),4,h-H-4);}
      Object.assign(unit.style,{width:W+'px',height:H+'px',left:x+'px',top:y+'px'});
      const ratio=Math.min(win.devicePixelRatio||1,2);ar.width=Math.round(w*ratio);ar.height=Math.round(h*ratio);ar.style.width=w+'px';ar.style.height=h+'px';ag.setTransform(ratio,0,0,ratio,0,0);
    }
    function textLabel(text,x,y,color='#445744',size=10){g.font=`600 ${size}px system-ui`;g.textAlign='center';g.lineWidth=3;g.strokeStyle='#f7f8ecd9';g.strokeText(text,x,y);g.fillStyle=color;g.fillText(text,x,y);}
    function apexes(m){
      if(m.apexes)return m.apexes;
      const named=m.t?.labels;
      let corners=named?named.map(([d,name],i)=>({d,name,number:i+1})):(state.route.trackCorners||state.trackCorners||state.corners||[]).map((c,i)=>({d:c.at+(c.len||0)*.5,name:c.name,number:i+1}));
      if(m.name==='Circuit de Monaco'&&named){const ns=[1,3,4,5,6,7,8,9,10,12,13,14,15,16,18,19];corners.forEach((c,i)=>c.number=ns[i]);corners.push({d:620,number:2},{d:2205,number:11},{d:2920,number:17});}
      if(m.name==='Suzuka Circuit'&&named){corners.forEach((c,i)=>c.number=i<9?i+1:i+2);corners.push({d:2710,number:10});}
      // Generic sampled bends are grouped by turning direction, so multiple
      // samples on one sweeping corner do not receive multiple apex numbers.
      if(named?.length&&named.every(l=>l[1]==='Bend')){
        const groups=[];for(const c of corners){const k=app.trackAt(c.d).k,sign=Math.sign(k),last=groups.at(-1);if(last&&sign===last.sign&&c.d-last.end<180){last.end=c.d;if(Math.abs(k)>last.peak){last.d=c.d;last.peak=Math.abs(k);}}else groups.push({...c,end:c.d,sign,peak:Math.abs(k)});}corners=groups.map((c,i)=>({...c,number:i+1}));
      }
      return m.apexes=corners.sort((a,b)=>a.d-b.d);
    }
    function renderMap(now){
      if(now-lastMap<60)return;lastMap=now;modelForRoute();
      const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(win.devicePixelRatio||1,2);if(w<10||h<10)return;
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}g.setTransform(dpr,0,0,dpr,0,0);
      if(cityMode&&mode!=='line'){
        transform=app.renderCityMap(g,w,h,{preset,zoom:zooms[preset]});const v=transform,n=v.navigation;
        credits.hidden=true;title.textContent=n?'To '+n.destination:'London · explore freely';toggle.textContent=(preset===1?'1 · Route overview':'2 · Follow heading')+' ⇄';scaleLabel.textContent=zooms[preset]===1?'':zooms[preset].toFixed(1)+'×';
        snapshot={mode,preset,zoom:zooms[preset],route:'London road network',lengthM:state.ldn.road.len,track2:false,scalePixelsPerM:v.scale,bearing:v.bearing,player:v.player,markers:v.markers,carCount:1+v.policeCount,policeCount:v.policeCount,buildings:v.buildingCount,mapFeatures:v.buildingCount+v.parkCount,destination:n?.destination||null,navigation:n,roadHalfWidth:app.halfWidthAt(state.distanceM),pit:false};return;
      }
      const player=playerPoint(),all=cars(),m=model;
      const fit=Math.min((w-42)/Math.max(50,m.maxX-m.minX),(h-36)/Math.max(50,m.maxZ-m.minZ));
      const scale=clamp((preset===1?fit:Math.min(w,h)/85)*zooms[preset],fit/3,12),follow=preset===2||zooms[preset]>1.05,cx=follow?player.x:(m.minX+m.maxX)/2,cz=follow?player.z:(m.minZ+m.maxZ)/2;
      // North-up is stable through hairpins; positions use the same metres as physics.
      const X=x=>(x-cx)*scale+w/2,Y=z=>h/2-(z-cz)*scale,P=p=>({x:X(p.x),y:Y(p.z)});
      transform={scale,cx,cz,w,h};
      if(mode==='line'){
        g.clearRect(0,0,w,h);g.lineCap='round';g.lineJoin='round';
        const line=(pts,color,width)=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(X(p.x),Y(p.z)):g.moveTo(X(p.x),Y(p.z)));g.strokeStyle=color;g.lineWidth=width;g.stroke();};
        if(m.net.length)for(const rd of m.net)line(rd.points,'#777e85',2.5);
        line(m.points,'#22272ca0',6);line(m.points,'#a9afb4',3.5);if(m.pit)line(m.pit.points,'#777f85',1.5);
        const marker=(p,own=false)=>{const x=X(p.x),y=Y(p.z),px=clamp(x,5,w-5),py=clamp(y,5,h-5);if(m.net.length&&!own&&(x<0||x>w||y<0||y>h))return{x,y,edge:true,worldX:p.x,worldZ:p.z,name:p.name};g.save();g.translate(px,py);g.rotate(p.psi||0);g.beginPath();if(own){g.moveTo(0,-6);g.lineTo(4.8,4.5);g.lineTo(0,2);g.lineTo(-4.8,4.5);g.closePath();}else g.arc(0,0,3.2,0,TAU);g.fillStyle=own?'#fff':'#bbc1c5';g.strokeStyle='#333a40';g.lineWidth=1.4;g.fill();g.stroke();g.restore();return{x,y,edge:x!==px||y!==py,worldX:p.x,worldZ:p.z,name:p.name};};
        const apexLabels=[];
        if(preset===2||zooms[preset]>1.15){const corners=apexes(m);
          for(const c of corners){const p=m.at(c.d),x=X(p.x),y=Y(p.z);if(x<8||x>w-8||y<8||y>h-8)continue;const explicit=String(c.name||'').match(/^(?:T|Turn\s*)(\d+)\b/i),number=explicit?Number(explicit[1]):c.number;g.font='bold 12px system-ui';g.textAlign='center';g.lineWidth=3;g.strokeStyle='#20272b';g.strokeText(String(number),x+10,y-8);g.fillStyle='#f0f1f2';g.fillText(String(number),x+10,y-8);apexLabels.push({number,x,y,d:c.d});}}
        const markers=all.map(p=>marker(p)),own=marker(player,true);snapshot={mode,preset,zoom:zooms[preset],route:m.name,lengthM:m.L,track2:!!m.t,scalePixelsPerM:scale,player:own,markers,carCount:all.length+1,pit:!!m.pit,roadHalfWidth:app.halfWidthAt?.(state.distanceM)||7,mapFeatures:0,buttons:false,apexLabels,placement:unit.getBoundingClientRect().toJSON()};return;
      }
      g.fillStyle=m.rally?'#e6d9b7':m.net.length?'#e9e7df':'#dce7ce';g.fillRect(0,0,w,h);
      const visible=p=>Math.abs(p.x-cx)<w/scale*.7+100&&Math.abs(p.z-cz)<h/scale*.7+100;
      const path=(pts,close=false)=>{g.beginPath();pts.forEach((p,i)=>i?g.lineTo(X(p.x),Y(p.z)):g.moveTo(X(p.x),Y(p.z)));if(close)g.closePath();};
      const features=m.features.filter(f=>f.x1>=cx-w/scale/2&&f.x0<=cx+w/scale/2&&f.z1>=cz-h/scale/2&&f.z0<=cz+h/scale/2);
      for(const type of ['green','water','building','stream','road'])for(const f of features){if(f.type!==type)continue;
        path(f.points,type==='building'||type==='water'||type==='green');
        if(type==='building'){g.fillStyle='#e9e3d8';g.fill();g.strokeStyle='#c3c1b6';g.lineWidth=.7;g.stroke();}
        else if(type==='water'||type==='green'){g.fillStyle=type==='water'?'#aad4e5':'#bed8ad';g.fill();}
        else if(type==='stream'){g.strokeStyle='#9cc9de';g.lineWidth=Math.max(1.5,scale*4);g.stroke();}
        else{const walk=/footway|path|steps|pedestrian/.test(f.class),width=walk?2:/motorway|trunk|primary/.test(f.class)?12:6;g.lineCap='round';g.strokeStyle=walk?'#c9c5ba':'#cac6b9';g.lineWidth=Math.max(walk?.7:1.8,width*scale+1.4);g.stroke();if(!walk){g.strokeStyle=/primary|trunk/.test(f.class)?'#fff0bb':'#fffef8';g.lineWidth=Math.max(1,width*scale);g.stroke();}}
      }
      credits.hidden=!m.t;
      // Map subtle ground grid gives distance context without invented public roads.
      const grid=10**Math.floor(Math.log10(70/scale));g.strokeStyle=m.rally?'#d8cba950':'#cad6c34f';g.lineWidth=.6;
      for(let x=Math.floor((cx-w/scale/2)/grid)*grid;x<cx+w/scale/2;x+=grid){g.beginPath();g.moveTo(X(x),0);g.lineTo(X(x),h);g.stroke();}
      for(let z=Math.floor((cz-h/scale/2)/grid)*grid;z<cz+h/scale/2;z+=grid){g.beginPath();g.moveTo(0,Y(z));g.lineTo(w,Y(z));g.stroke();}
      for(const b of m.features.length?[]:m.buildings){const p=b.points;if(!p?.length||!p.some(([x,z])=>visible({x,z})))continue;const a=p.map(([x,z])=>({x,z}));g.save();g.translate(1,1.5);path(a,true);g.fillStyle='#a3ad9b70';g.fill();g.restore();path(a,true);g.fillStyle='#ece7dd';g.fill();g.strokeStyle='#b3b3a8';g.lineWidth=.7;g.stroke();}
      g.lineCap='round';g.lineJoin='round';
      for(const rd of m.net){path(rd.points);g.lineWidth=Math.max(4,scale*16);g.strokeStyle='#c8c3b6';g.stroke();g.lineWidth=Math.max(2,scale*13);g.strokeStyle='#fffef6';g.stroke();}
      // Draw actual variable-width pavement. In close view a metre stays a metre.
      const pts=m.points,stride=scale<.03?Math.max(1,Math.floor(.5/(scale*(m.L/pts.length)))):1;
      const roadSeg=[];for(let i=0;i<pts.length-1;i+=stride){const a=pts[i],b=pts[Math.min(pts.length-1,i+stride)];if(!visible(a)&&!visible(b))continue;roadSeg.push([a,b]);}
      for(const [a,b] of roadSeg){g.strokeStyle=m.rally?'#d9bf88':'#c4cbb6';g.lineWidth=Math.max(5,(a.H+b.H+7)*scale);path([a,b]);g.stroke();}
      for(const [a,b] of roadSeg){g.strokeStyle=m.rally?'#f1e4c7':'#b2b7ac';g.lineWidth=Math.max(4,(a.H+b.H)*scale+2);path([a,b]);g.stroke();g.strokeStyle=m.rally?'#f5e9cf':'#fcfbf6';g.lineWidth=Math.max(2,(a.H+b.H)*scale);g.stroke();}
      if(m.pit){const ps=m.pit.points;path(ps);g.strokeStyle='#a8afa6';g.lineWidth=Math.max(3,m.pit.half*2*scale+2);g.stroke();g.strokeStyle='#f7f5ef';g.lineWidth=Math.max(1.8,m.pit.half*2*scale);g.stroke();
        if(scale>.05)for(let q=m.pit.boxStart;q<m.pit.boxEnd;q+=10){const p=app.pitAt(q),v=lateral(p,(m.pit.garageSide||1)*(m.pit.half+4)),c=P(v);g.save();g.translate(c.x,c.y);g.rotate(p.psi);g.fillStyle='#d9d4c9';g.fillRect(-4*scale,-4*scale,8*scale,8*scale);g.strokeStyle='#aaa99c';g.lineWidth=.7;g.strokeRect(-4*scale,-4*scale,8*scale,8*scale);g.restore();}
      }
      for(const [a,b] of roadSeg){path([a,b]);g.strokeStyle='#3588e8';g.lineWidth=scale>.8?2.5:Math.max(2,Math.min(3.5,scale*3));g.stroke();}
      if(scale>.7){g.strokeStyle='#d3ccad';g.lineWidth=1;for(const [a,b] of roadSeg){for(const n of [-1,1]){path([lateral(a,(a.H-.4)*n),lateral(b,(b.H-.4)*n)]);g.stroke();}}}
      if(state.ldn&&app.cityNetwork){const route=app.cityNetwork.routePoints;if(route.length>1){path(route);g.strokeStyle='#167bea';g.lineWidth=4;g.stroke();}for(const p of app.cityNetwork.locations){const x=X(p.x),y=Y(p.z);if(x<4||x>w-4||y<4||y>h-4)continue;g.fillStyle=p.id===app.cityNetwork.destinationPoint?.id?'#d84939':'#776caa';g.beginPath();g.arc(x,y,p.id===app.cityNetwork.destinationPoint?.id?5:2.7,0,TAU);g.fill();}}
      const occupied=[];
      function label(name,p,color){const a=P(p);if(a.x<15||a.x>w-15||a.y<20||a.y>h-15||occupied.some(v=>Math.abs(v.x-a.x)<60&&Math.abs(v.y-a.y)<18))return;occupied.push(a);textLabel(String(name).slice(0,32),a.x,a.y-9,color);}
      for(const l of m.labels){const p=Array.isArray(l)?m.at(l[0]):l;label(Array.isArray(l)?l[1]:l.name,p);}
      if(m.pit)label('P · PIT LANE',app.pitAt((m.pit.boxStart+m.pit.boxEnd)/2),'#6f6393');
      if(scale>.12)for(const f of features){if(f.name&&f.type!=='building'){const p=f.points[Math.floor(f.points.length/2)];label(f.name,p,f.type==='water'?'#417899':'#7f7c6e');}}
      if(scale>.08)for(const b of m.buildings){if(b.name){const p=b.points[0];label(b.name,{x:p[0],z:p[1]},'#787668');}}
      if(m.net.length&&scale>.07)for(const rd of m.net)label(rd.name,{x:(rd.points[0].x+rd.points[1].x)/2,z:(rd.points[0].z+rd.points[1].z)/2});
      function marker(p,color,own=false){const c=P(p),outside=c.x<7||c.x>w-7||c.y<7||c.y>h-7;
        if(m.net.length&&!own&&outside)return{x:c.x,y:c.y,edge:true,worldX:p.x,worldZ:p.z,name:p.name};
        const x=clamp(c.x,6,w-6),y=clamp(c.y,6,h-6);g.save();g.translate(x,y);g.rotate(p.psi||0);
        if(own){g.fillStyle='#298cff2b';g.beginPath();g.arc(0,0,14,0,TAU);g.fill();}
        g.fillStyle=color;g.strokeStyle='#fff';g.lineWidth=own?2:1.4;
        if(scale>.9&&!outside&&!own){g.beginPath();g.roundRect(-.95*scale,-2.3*scale,1.9*scale,4.6*scale,.5*scale);g.fill();g.stroke();g.fillStyle='#263e56';g.fillRect(-.65*scale,-1.3*scale,1.3*scale,.7*scale);}
        else{const r=own?7:m.net.length&&scale<.1?1.5:outside?3:4;g.beginPath();if(own){g.moveTo(0,-r*1.3);g.lineTo(r,r);g.lineTo(0,r*.5);g.lineTo(-r,r);g.closePath();}else g.arc(0,0,r,0,TAU);g.fill();g.stroke();}g.restore();return{x:c.x,y:c.y,edge:outside,worldX:p.x,worldZ:p.z,name:p.name};}
      const markers=all.map(c=>marker(c,c.color));const own=marker(player,'#087cff',true);
      if(!m.closed&&!m.net.length){const a=P(m.at(m.L));if(a.x>0&&a.x<w&&a.y>0&&a.y<h)textLabel('⚑',a.x,a.y,'#323e45',16);}
      // Useful map furniture: orientation, real scale, and all-car count.
      g.fillStyle='#fffffff0';g.beginPath();g.arc(w-14,14,10,0,TAU);g.fill();g.fillStyle='#c04a40';g.beginPath();g.moveTo(w-14,6);g.lineTo(w-17,15);g.lineTo(w-11,15);g.closePath();g.fill();g.font='bold 7px system-ui';g.textAlign='center';g.fillStyle='#31494f';g.fillText('N',w-14,22);
      const target=45/scale,power=10**Math.floor(Math.log10(target)),unitM=[1,2,5,10].map(v=>v*power).filter(v=>v<=target).at(-1)||power,bar=unitM*scale;
      g.strokeStyle='#34515b';g.lineWidth=2;g.beginPath();g.moveTo(8,h-12);g.lineTo(8,h-8);g.lineTo(8+bar,h-8);g.lineTo(8+bar,h-12);g.stroke();
      g.font='9px system-ui';g.textAlign='left';g.fillStyle='#26404b';g.fillText(unitM>=1000?(unitM/1000)+' km':unitM+' m',8,h-16);
      title.textContent=(app.cityNetwork?.destinationPoint&&state.ldn?'To '+app.cityNetwork.destinationPoint.name:m.name)+' · '+(all.length+1)+' cars';toggle.textContent=(preset===1?'1 · Whole route':'2 · Road position')+' ⇄';scaleLabel.textContent=zooms[preset]===1?'':zooms[preset].toFixed(zooms[preset]<10?1:0)+'×';
      snapshot={mode,preset,zoom:zooms[preset],route:m.name,lengthM:m.L,track2:!!m.t,scalePixelsPerM:scale,player:own,markers,carCount:all.length+1,pit:!!m.pit,roadHalfWidth:app.halfWidthAt?.(state.distanceM)||7,buildings:m.buildings.length,mapFeatures:m.features.length,destination:state.ldn?app.cityNetwork?.destinationPoint?.name:null};
    }
    function renderRear(){
      const box=rear.getBoundingClientRect(),mx=box.left+3,my=box.top+1,mw=box.width-4,mh=box.height-2;
      if(mw<1||mh<1)return;
      if(state.ldn&&app.cityNetwork){app.cityNetwork.drawRear(mx,my,mw,mh,app.gpsBridge?.envColors?.()||app.envColors?.()||{});return;}
      // The original centre rear-camera renderer reads the same world/rivals as driving.
      if(app.gpsBridge?.drawRearView){gps.renderingRear=true;try{app.gpsBridge.drawRearView(mx,my,mw,mh,{eye:0,yaw:0},app.gpsBridge.envColors());}finally{gps.renderingRear=false;}return;}
      // Phantom's original centre mirror is decorative. Supply a live geometric view.
      const c=app.ctx;c.save();c.beginPath();c.rect(mx,my,mw,mh);c.clip();c.fillStyle='#a5c4d1';c.fillRect(mx,my,mw,mh);c.fillStyle='#657760';c.fillRect(mx,my+mh*.45,mw,mh);
      const pose=playerPoint(),view=p=>{const dx=p.x-pose.x,dz=p.z-pose.z,f=-(dx*Math.sin(pose.psi)+dz*Math.cos(pose.psi)),r=dx*Math.cos(pose.psi)-dz*Math.sin(pose.psi);return f>1?{x:mx+mw/2+r*mw*.7/f,y:my+mh*.45+1.6*mw*.7/f,s:mw*.7/f}:null;};
      let prev=null;for(let d=-180;d<181;d+=3){const p=model.at(state.distanceM+d),H=app.halfWidthAt?.(state.distanceM+d)||7,a=view(lateral(p,-H)),b=view(lateral(p,H));if(a&&b&&prev){c.fillStyle='#535963';c.beginPath();c.moveTo(prev.a.x,prev.a.y);c.lineTo(prev.b.x,prev.b.y);c.lineTo(b.x,b.y);c.lineTo(a.x,a.y);c.fill();}prev=a&&b?{a,b}:null;}
      for(const p of cars()){const q=view(p);if(q){c.fillStyle=p.color;c.fillRect(q.x-q.s,q.y-q.s*1.4,q.s*2,q.s*1.4);}}
      c.restore();
    }
    function renderCityAR(){
      const n=app.cityNetwork,nav=n.navigation();let count=0;const samples=[];
      if(nav&&!nav.arrived){
        ag.save();ag.beginPath();ag.rect(win.innerWidth*.06,win.innerHeight*.20,win.innerWidth*.88,win.innerHeight*.49);ag.clip();
        const project=(off,lat=0)=>{const p=n.guideAt(state.distanceM+off);return n.projectWorld({...lateral(p,p.lane+lat),y:.045});};
        for(let off=Math.min(110,nav.remaining-2);off>6;off-=7){const a=project(off,-.65),b=project(off+2),c=project(off,.65);if([a,b,c].some(p=>p.fwd<.6||!Number.isFinite(p.x+p.y)))continue;
          ag.strokeStyle='#75e7ff';ag.lineWidth=clamp(a.scale*.1,1.8,5);ag.shadowColor='#006a99';ag.shadowBlur=3;ag.beginPath();ag.moveTo(a.x,a.y);ag.lineTo(b.x,b.y);ag.lineTo(c.x,c.y);ag.stroke();count++;samples.push(n.guideAt(state.distanceM+off));
        }ag.restore();
      }snapshot.arChevrons=count;snapshot.arRouteRevision=nav?.revision;snapshot.arRouteSamples=samples;
    }
    function renderAR(){
      ag.clearRect(0,0,win.innerWidth,win.innerHeight);if(cityMode){renderCityAR();return;}if(model.t&&app.gpsBridge?.arDepth){snapshot.arChevrons=gps.arRendered||0;snapshot.arDepthTested=true;return;}const bridge=app.gpsBridge||app,project=bridge.projectAhead;if(!project)return;
      const m=model,limit=m.closed||m.free?95:Math.min(95,m.L-state.distanceM),guide=d=>state.inPitLane?0:clamp((m.t?app.racingOffset?.(d):null)??app.raceLineOffAt?.(d)??0,-(app.halfWidthAt?.(d)||7)+1.4,(app.halfWidthAt?.(d)||7)-1.4);
      const projectAt=(off,n)=>m.t?app.projectTrack(state.inPitLane?app.pitSurface((state.pitQ||0)+off,n,.045):app.surfacePoint(state.distanceM+off,n,.045)):project(off,n);
      ag.save();ag.beginPath();ag.rect(win.innerWidth*.10,win.innerHeight*.20,win.innerWidth*.80,win.innerHeight*.47);ag.clip();
      let count=0;for(let d=limit;d>6;d-=7){const n=guide(state.distanceM+d),a=projectAt(d,n-.6),b=projectAt(d+2,n),c=projectAt(d,n+.6);if([a,b,c].some(p=>p.fwd<.6||!Number.isFinite(p.x+p.y)))continue;
        ag.strokeStyle='#75e7ff';ag.lineWidth=clamp(a.scale*.10,1.8,5);ag.shadowColor='#006a99';ag.shadowBlur=3;ag.beginPath();ag.moveTo(a.x,a.y);ag.lineTo(b.x,b.y);ag.lineTo(c.x,c.y);ag.stroke();count++;}
      ag.restore();snapshot.arChevrons=count;
    }
    function renderNow(now=win.performance.now()){
      syncCity();
      if(mode==='off'||!doc.body.classList.contains('view-drive'))return;
      layout();renderMap(now);if(mode==='mirror')renderRear();if(mode==='ar')renderAR();
    }
    // Run after the simulator's own world pass, so mirror pixels and AR share its frame.
    const drawName=app.drawWorld?'drawWorld':'drawCity',original=app[drawName];app[drawName]=function(...args){const result=original.apply(this,args);renderNow();return result;};
    setMode(mode);
    win.addEventListener('pagehide',()=>{app[drawName]=original;style.remove();controls.remove();unit.remove();ar.remove();},{once:true});
  }
  window.MUCSNavigation={eligible,prepare,install,historical:[...historical]};
})();
