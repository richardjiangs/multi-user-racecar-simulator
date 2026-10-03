  // Complete prebuilt world + a genuine depth buffer. Track buffers never change
  // while driving. Projection is shared by road, competitors and the player's tyres.
  let trackCamera=null,trackPitch=0,trackGL=null;
  const EYE_HEIGHT=app.track2Vehicle.f1?.97:app.track2Vehicle.prototype?1.0:1.15;
  function trackPoint(d,n=0,lift=0){return app.surfacePoint(d,n,lift);}
  function trackFrame(){const impact=app.contactPose?.(),p=impact||app.worldPose();if(!p){trackCamera=null;return;}const q=impact||(!state.inPitLane?trackPoint(state.distanceM,state.laneOffset):p);p.y=q.y;trackPitch=Math.atan(p.grade);trackCamera={...p,psi:impact?p.psi:p.psi+state.headingRel,roll:Math.atan(q.bank||0)+(state.impactJolt||0)*Math.sin(state.time*35)};}
  function cameraPoint(p){const c=trackCamera,dx=p.x-c.x,dz=p.z-c.z,f=dx*Math.sin(c.psi)+dz*Math.cos(c.psi),u=p.y-c.y-EYE_HEIGHT,r=dx*Math.cos(c.psi)-dz*Math.sin(c.psi),up=u*Math.cos(trackPitch)-f*Math.sin(trackPitch);return{rgt:r*Math.cos(c.roll)+up*Math.sin(c.roll),fwd:f*Math.cos(trackPitch)+u*Math.sin(trackPitch),up:up*Math.cos(c.roll)-r*Math.sin(c.roll)};}
  function projectTrack(p){if(!trackCamera)return {x:0,y:0,scale:-1,fwd:-1};const a=cameraPoint(p);if(a.fwd<.2)return{x:0,y:0,scale:-1,fwd:a.fwd};const scale=FOCAL/a.fwd;return{x:innerWidth/2+a.rgt*scale,y:horizonY-a.up*scale,scale,fwd:a.fwd};}
  function createTrackGL(){
    const surface=document.createElement('canvas'),gl=surface.getContext('webgl',{alpha:true,antialias:true,depth:true,preserveDrawingBuffer:true,premultipliedAlpha:false});
    if(!gl)throw Error('Track 2.0 requires WebGL for depth-correct tracks. Enable graphics acceleration in the browser.');
    const vs=`attribute vec3 aPosition;attribute vec3 aColor;attribute float aMaterial;
      uniform vec3 uEye,uRight,uUp,uForward;uniform vec4 uProjection;varying vec3 vColor,vWorld;varying float vDistance,vMaterial;
      void main(){vec3 d=aPosition-uEye;float z=dot(d,uForward);gl_Position=vec4(dot(d,uRight)*uProjection.x,dot(d,uUp)*uProjection.y+uProjection.z*z,1.000042858*z-.600012857,z);vColor=aColor;vWorld=aPosition;vDistance=length(d);vMaterial=aMaterial;}`;
    const fs=`precision highp float;varying vec3 vColor,vWorld;varying float vDistance,vMaterial;uniform float uNight;uniform sampler2D uAsphalt;
      void main(){vec3 c=vColor;float detail=(1.-smoothstep(12.,65.,vDistance));if(vMaterial>.5&&vMaterial<1.5){float grain=texture2D(uAsphalt,vWorld.xz*1.2).r;c+=(grain-.5)*.065;}
      float light=mix(1.,.22,uNight);if(vMaterial>3.5)light=1.;c*=light;vec3 fog=mix(vec3(.70,.79,.81),vec3(.04,.07,.11),uNight);float haze=smoothstep(1600.,12500.,vDistance)*.7;gl_FragColor=vec4(mix(c,fog,haze),1.);}`;
    const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;},program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    const uniforms={};for(const n of ['Eye','Right','Up','Forward','Projection','Night'])uniforms[n]=gl.getUniformLocation(program,'u'+n);
    const attrs=['aPosition','aColor','aMaterial'].map(n=>gl.getAttribLocation(program,n));for(const a of attrs)gl.enableVertexAttribArray(a);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
    const tex=gl.createTexture(),pixels=new Uint8Array(128*128*4);let seed=73991;for(let i=0;i<pixels.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const n=83+(seed>>>25);pixels[i]=pixels[i+1]=pixels[i+2]=n;pixels[i+3]=255;}gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,128,128,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);gl.generateMipmap(gl.TEXTURE_2D);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);const aniso=gl.getExtension('EXT_texture_filter_anisotropic');if(aniso)gl.texParameterf(gl.TEXTURE_2D,aniso.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));gl.useProgram(program);gl.uniform1i(gl.getUniformLocation(program,'uAsphalt'),0);
    const buffers=new Map(),dynamic=gl.createBuffer();
    function bind(buffer){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.vertexAttribPointer(attrs[0],3,gl.FLOAT,false,16,0);gl.vertexAttribPointer(attrs[1],3,gl.UNSIGNED_BYTE,true,16,12);gl.vertexAttribPointer(attrs[2],1,gl.UNSIGNED_BYTE,false,16,15);}
    function upload(name){if(buffers.has(name))return buffers.get(name);const src=TRACK_MESHES[name],bytes=src.bytes;const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,bytes,gl.STATIC_DRAW);const o={buffer,count:src.vertices,bytes:bytes.length,uploads:1};buffers.set(name,o);return o;}
    const draw=(w,h,night,mirror=null)=>{
      const dpr=mirror?1:Math.min(devicePixelRatio||1,1.5),W=Math.round(w*dpr),H=Math.round(h*dpr);if(!mirror&&(surface.width!==W||surface.height!==H)){surface.width=W;surface.height=H;}gl.viewport(0,0,W,H);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
      const c=mirror?{...app.trackLateral(trackCamera,mirror.eye),psi:trackCamera.psi+Math.PI+mirror.yaw,roll:-trackCamera.roll}:trackCamera,pitch=mirror?-trackPitch:trackPitch,sp=Math.sin(c.psi),cp=Math.cos(c.psi),st=Math.sin(pitch),ct=Math.cos(pitch),sr=Math.sin(c.roll),cr=Math.cos(c.roll);
      gl.uniform3f(uniforms.Eye,c.x,c.y+EYE_HEIGHT,c.z);gl.uniform3f(uniforms.Right,cp*cr-sp*st*sr,ct*sr,-sp*cr-cp*st*sr);gl.uniform3f(uniforms.Up,-sp*st*cr-cp*sr,ct*cr,-cp*st*cr+sp*sr);gl.uniform3f(uniforms.Forward,sp*ct,st,cp*ct);const focal=mirror?w*.55:FOCAL;gl.uniform4f(uniforms.Projection,2*focal/w,2*focal/h,mirror?.12:1-2*horizonY/h,0);gl.uniform1f(uniforms.Night,night?1:0);
      const mesh=upload(state.route.name);bind(mesh.buffer);gl.drawArrays(gl.TRIANGLES,0,mesh.count);
      const cars=buildVisibleCars(!!mirror);bind(dynamic);gl.bufferData(gl.ARRAY_BUFFER,cars,gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,cars.byteLength/16);
      if(!mirror)ctx.drawImage(surface,0,0,w,h);
    };
    app.worldRendererInfo=()=>({backend:'WebGL depth buffer',fullCircuit:true,farPlaneM:14000,stationGrid:'fixed at export',loaded:[...buffers].map(([name,v])=>({name,vertices:v.count,bytes:v.bytes,uploads:v.uploads})),error:gl.getError()});
    app.worldPixelAt=(x,y)=>{const v=new Uint8Array(4);gl.readPixels(Math.floor(x*surface.width/innerWidth),surface.height-1-Math.floor(y*surface.height/innerHeight),1,1,gl.RGBA,gl.UNSIGNED_BYTE,v);return Array.from(v);};
    app.inspectTrackSurface=(ahead=[10])=>{trackFrame();draw(innerWidth,innerHeight,state.dayPhase>.82);return ahead.map(d=>{const q=projectTrack(state.inPitLane?app.pitSurface((state.pitQ||0)+d,0,.02):trackPoint(state.distanceM+d,0,.02));return {ahead:d,...q,color:app.worldPixelAt(q.x,q.y)};});};
    return{draw,surface,gl,buffers};
  }
  function buildVisibleCars(mirror=false){
    const out=[],col=h=>[parseInt(h.slice(1,3),16)||30,parseInt(h.slice(3,5),16)||35,parseInt(h.slice(5,7),16)||40];
    const triangle=(a,b,c,C,material=0)=>{for(const p of [a,b,c])out.push(p.x,p.y,p.z,...C,material);},quad=(a,b,c,d,C,material=0)=>{triangle(a,b,c,C,material);triangle(a,c,d,C,material);};
    function car(p,heading,body,player=false,steer=0){const sy=Math.sin(heading),cy=Math.cos(heading),grade=player?trackPitch:Math.atan(p.grade||0),bank=player?trackCamera.roll:Math.atan(p.bank||0);
      const point=(x,y,z)=>{const yy=y+z*Math.tan(grade)+x*Math.tan(bank);return{x:p.x+x*cy+z*sy,y:p.y+yy,z:p.z-x*sy+z*cy};};
      const box=(x,y,z,w,h,l,C)=>{const a=point(x-w/2,y,z-l/2),b=point(x+w/2,y,z-l/2),c=point(x+w/2,y,z+l/2),d=point(x-w/2,y,z+l/2),up=q=>({...q,y:q.y+h});quad(a,b,up(b),up(a),C.map(v=>v*.7));quad(b,c,up(c),up(b),C.map(v=>v*.8));quad(c,d,up(d),up(c),C);quad(d,a,up(a),up(d),C.map(v=>v*.9));quad(up(a),up(b),up(c),up(d),C);};
      if(!app.track2Vehicle.f1){const paint=col(body||'#80929e'),glass=[33,48,59],rubber=[18,23,27];box(0,.20,0,1.86,.45,4.55,paint);box(0,.65,-.1,1.50,.49,2.02,glass);box(0,1.12,-.1,1.53,.045,1.9,paint);for(const side of [-1,1])for(const z of [-1.45,1.45]){const x=side*.91;for(let i=0;i<20;i++){const u=i*Math.PI/10,v=(i+1)*Math.PI/10;quad(point(x-.12,.34+Math.cos(u)*.34,z+Math.sin(u)*.34),point(x+.12,.34+Math.cos(u)*.34,z+Math.sin(u)*.34),point(x+.12,.34+Math.cos(v)*.34,z+Math.sin(v)*.34),point(x-.12,.34+Math.cos(v)*.34,z+Math.sin(v)*.34),rubber);}}box(0,.44,-2.28,1.5,.085,.02,[157,27,28]);box(0,.46,2.28,1.45,.08,.02,[210,219,205]);return;}
      const tire=(side,z,angle)=>{const X=side*.80,Y=.345,W=.29,R=.345,ca=Math.cos(angle),sa=Math.sin(angle),P=(x,y,zz)=>point(X+x*ca+zz*sa,Y+y,z-x*sa+zz*ca);for(let i=0;i<40;i++){const a=i/40*Math.PI*2,b=(i+1)/40*Math.PI*2;quad(P(-W/2,Math.cos(a)*R,Math.sin(a)*R),P(W/2,Math.cos(a)*R,Math.sin(a)*R),P(W/2,Math.cos(b)*R,Math.sin(b)*R),P(-W/2,Math.cos(b)*R,Math.sin(b)*R),[25+Math.round(7*Math.cos(a)),30+Math.round(7*Math.cos(a)),34+Math.round(7*Math.cos(a))]);for(const side of [-1,1])triangle(P(side*W/2,0,0),P(side*W/2,Math.cos(a)*R,Math.sin(a)*R),P(side*W/2,Math.cos(b)*R,Math.sin(b)*R),[15,19,23]);}
        const inner=-side*(W/2+.002),spin=(player?state.wheelRotation:p.d||0)*Math.PI/180;
        for(let j=0;j<32;j++){const a=j/32*Math.PI*2,b=(j+1)/32*Math.PI*2,ring=(r,t)=>P(inner,Math.cos(t)*r,Math.sin(t)*r);quad(ring(.18,a),ring(.205,a),ring(.205,b),ring(.18,b),[60,69,70]);}
        for(let j=0;j<6;j++){const a=spin+j/6*Math.PI*2;quad(P(inner,Math.cos(a)*.055,Math.sin(a)*.055),P(inner,Math.cos(a)*.185,Math.sin(a)*.185),P(inner,Math.cos(a+.11)*.185,Math.sin(a+.11)*.185),P(inner,Math.cos(a+.11)*.055,Math.sin(a+.11)*.055),[40,49,53]);}
        const mark=spin;quad(P(-W*.32,Math.cos(mark)*R*1.003,Math.sin(mark)*R*1.003),P(W*.32,Math.cos(mark)*R*1.003,Math.sin(mark)*R*1.003),P(W*.32,Math.cos(mark+.045)*R*1.003,Math.sin(mark+.045)*R*1.003),P(-W*.32,Math.cos(mark+.045)*R*1.003,Math.sin(mark+.045)*R*1.003),[108,107,75]);
      };
      // Driver eye origin is behind the front axle. Dimensions are world metres,
      // independent of window size; wheel diameter no longer shrinks with the HUD.
      for(const side of [-1,1]){tire(side,2.12,steer*.58*app.clamp(1.15-Math.abs(state.speedMps)*.013,.44,1));if(!player)tire(side,-1.18,0);
        for(const yy of [.21,.43])for(const z of [1.20,2.40]){const a=point(side*.23,yy,z),b=point(side*.80,yy,2.12);quad(a,{...a,y:a.y+.026},{...b,y:b.y+.026},b,[43,53,58]);}
      }
      const silver=col(body||'#9db0ae'),dark=[20,31,38];
      // Slender tapered nose, front wing and side endplates.
      const nose=[point(-.33,.51,.40),point(.33,.51,.40),point(.13,.23,3.02),point(-.13,.23,3.02)];quad(...nose,silver);quad(point(-.13,.23,3.02),point(.13,.23,3.02),point(.13,.13,3.02),point(-.13,.13,3.02),dark);quad(point(-.045,.515,.40),point(.045,.515,.40),point(.034,.235,3.02),point(-.034,.235,3.02),[0,161,145]);
      for(const z of [2.92,3.07,3.22])box(0,.10,z,1.84,.035,.16,dark);for(const side of [-1,1])box(side*.92,.07,3.05,.035,.19,.52,silver);
      if(!player){box(0,.05,-.30,1.65,.1,3.2,dark);box(0,.14,-.25,.83,.53,2.3,silver);box(0,.30,-1.05,.56,.57,1.0,dark);box(0,.52,0,.4,.1,.75,[4,12,16]);box(0,.64,-.1,.29,.27,.31,[189,216,56]);box(0,.67,-1.82,1.65,.16,.38,dark);for(const side of [-1,1])box(side*.82,.42,-1.82,.03,.53,.52,silver);}
    }
    {const q=app.pitBox(app.TEAM.slot),p=(d,n)=>app.pitSurface(d,n,.064);quad(p(q-3,1.5),p(q-3,4.1),p(q+3,4.1),p(q+3,1.5),[8,124,112],2);}
    const player=app.contactPose?.()||app.worldPose();player.y=trackCamera.y;if(!mirror&&app.track2Vehicle.f1)car(player,trackCamera.psi,getComputedStyle(document.documentElement).getPropertyValue('--f1body').trim()||'#94a8aa',true,state.steer);
    for(const r of (state.raceGrid?state.rivals:[])||[]){if(r.gone||r.dns)continue;const p=app.contactPose?.(r)||(r.pitState?app.pitSurface(r.pitQ||0,r.lane||0):trackPoint(r.distM,r.lane||0));if(Math.hypot(p.x-trackCamera.x,p.z-trackCamera.z)>1600)continue;car(p,p.psi,r.body,false,0);}
    if(state.learnMode&&!mirror){for(let d=Math.ceil((state.distanceM+4)/3)*3;d<state.distanceM+190;d+=3){const n=q=>app.clamp(app.raceLineOffAt(q),-app.halfWidthAt(q)+1.5,app.halfWidthAt(q)-1.5),a=trackPoint(d,n(d)-.16,.058),b=trackPoint(d,n(d)+.16,.058),c=trackPoint(d+2.6,n(d+2.6)+.16,.058),e=trackPoint(d+2.6,n(d+2.6)-.16,.058),cap=Math.sqrt(1.5*9.81/Math.max(.0001,Math.abs(app.curvatureAt(d))));quad(a,b,c,e,state.speedMps>cap*1.08?[215,105,57]:[70,207,151]);}}
    // Short, depth-tested metallic trails. Physics supplies their position and
    // count from the dissipated contact energy; no sparks are generated on grass.
    for(const p of app.contactSparks?.()||[]){const heat=p.life/p.maxLife,C=[255,Math.round(85+170*heat),Math.round(15+145*heat)],width=.002+.003*heat,
      tail={x:p.x-p.vx*.018,y:p.y-p.vy*.018,z:p.z-p.vz*.018},rx=Math.cos(trackCamera.psi)*width,rz=-Math.sin(trackCamera.psi)*width;
      quad({x:tail.x-rx,y:tail.y,z:tail.z-rz},{x:tail.x+rx,y:tail.y,z:tail.z+rz},{x:p.x+rx,y:p.y,z:p.z+rz},{x:p.x-rx,y:p.y,z:p.z-rz},C,4);
      triangle({x:p.x-rx,y:p.y,z:p.z-rz},{x:p.x+rx,y:p.y,z:p.z+rz},{x:p.x,y:p.y+width*2,z:p.z},[255,235,177],4);
    }
    const buf=new ArrayBuffer(out.length/7*16),v=new DataView(buf);for(let i=0,j=0;i<out.length;i+=7,j+=16){for(let k=0;k<3;k++)v.setFloat32(j+k*4,out[i+k],true);for(let k=0;k<4;k++)v.setUint8(j+12+k,out[i+3+k]);}return new Uint8Array(buf);
  }
  function drawTrackRoad(w,h,pal){trackFrame();if(!trackCamera)return false;if(!trackGL)trackGL=createTrackGL();trackGL.draw(w,h,pal.night);return true;}

  function drawTrackMirror(mx,my,mw,mh,p,pal){
    trackGL.draw(Math.max(96,Math.round(mw*1.5)),Math.max(36,Math.round(mh*1.5)),pal.night,p);
    ctx.save();ctx.beginPath();ctx.roundRect(mx,my,mw,mh,4);ctx.clip();ctx.fillStyle=pal.night?'#122330':'#adc9d7';ctx.fillRect(mx,my,mw,mh);ctx.translate(mx+mw,my);ctx.scale(-1,1);const W=Math.max(96,Math.round(mw*1.5)),H=Math.max(36,Math.round(mh*1.5));ctx.drawImage(trackGL.surface,0,trackGL.surface.height-H,W,H,0,0,mw,mh);ctx.restore();drawMirrorFrame(mx,my,mw,mh,p);
  }
  function drawTrackMap(){
    const t=app.trackModel();if(!t||!app.el.mapCanvas)return false;
    const c=app.el.mapCanvas,g=c.getContext('2d'),w=c.clientWidth||300,h=c.clientHeight||380,dpr=Math.min(2,devicePixelRatio||1);
    if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle='#0b151a';g.fillRect(0,0,w,h);
    const pit=app.pitModel(),learn=state.learnMode;
    let pts;if(learn){pts=[];for(let d=-100;d<560;d+=3)pts.push(app.trackAt(state.distanceM+d));}else pts=t.points.map(([x,z])=>({x,z}));
    const xs=pts.map(p=>p.x),zs=pts.map(p=>p.z);let xmin=Math.min(...xs),xmax=Math.max(...xs),zmin=Math.min(...zs),zmax=Math.max(...zs);const scale=Math.min((w-52)/Math.max(40,xmax-xmin),(h-120)/Math.max(40,zmax-zmin));const ox=(w-(xmax-xmin)*scale)/2-xmin*scale,oy=52+(h-120-(zmax-zmin)*scale)/2+zmax*scale;
    const X=p=>ox+p.x*scale,Y=p=>oy-p.z*scale,stroke=(p,col,width,closed)=>{g.strokeStyle=col;g.lineWidth=width;g.lineJoin='round';g.lineCap='round';g.beginPath();p.forEach((p,i)=>i?g.lineTo(X(p),Y(p)):g.moveTo(X(p),Y(p)));if(closed)g.closePath();g.stroke();};
    g.strokeStyle='#21323a';g.lineWidth=.5;for(let x=0;x<w;x+=24){g.beginPath();g.moveTo(x,38);g.lineTo(x,h-66);g.stroke();}
    stroke(pts,'#758681',Math.max(6,app.halfWidthAt(0)*2*scale+2),!learn);stroke(pts,'#354248',Math.max(3.5,app.halfWidthAt(0)*2*scale),!learn);
    if(!learn){for(let sec=0;sec<3;sec++){const p=[];for(let i=sec*t.points.length/3;i<=(sec+1)*t.points.length/3;i+=2)p.push(app.trackAt(i/t.points.length*t.L));stroke(p,['#68d6bf','#d3b574','#739ddd'][sec],1.5);}}
    if(pit)stroke(pit.points,'#e9c075',Math.max(1.7,pit.half*2*scale));
    if(learn){const line=pts.map((p,i)=>app.trackLateral(p,app.raceLineOffAt(state.distanceM-100+i*3)));stroke(line,'#65ddbf',2);}
    const start=app.trackAt(0);g.save();g.translate(X(start),Y(start));g.rotate(-start.psi);g.fillStyle='#f5f0dd';g.fillRect(-6,-2,12,4);g.restore();
    if(!learn&&w>310){for(const [d,n] of t.labels){const p=app.trackAt(d);g.fillStyle='#aabbb9';g.font='9px sans-serif';g.textAlign='left';g.fillText(n,X(p)+5,Y(p)-5,80);}}
    for(const r of state.rivals||[]){if(r.gone)continue;const p=app.contactPose?.(r)||app.trackLateral(r.pitState?app.pitAt(r.pitQ||0):app.trackAt(r.distM),r.lane);g.fillStyle=r.body;g.beginPath();g.arc(X(p),Y(p),2,0,Math.PI*2);g.fill();}
    const p=app.worldPose();g.save();g.translate(X(p),Y(p));g.rotate(p.psi+state.headingRel);g.fillStyle='#8ffff0';g.strokeStyle='#052522';g.lineWidth=1.5;g.beginPath();g.moveTo(0,-7);g.lineTo(4.5,4);g.lineTo(0,2);g.lineTo(-4.5,4);g.closePath();g.fill();g.stroke();g.restore();
    g.fillStyle='#e5eeeb';g.textAlign='left';g.font='bold 12px sans-serif';g.fillText(learn?'LINE AHEAD':state.route.name,12,22);g.textAlign='right';g.fillStyle='#80cdbd';g.font='11px monospace';g.fillText((t.L/1000).toFixed(3)+' km',w-12,22);
    // Height profile shares the road's interpolation, including the exact current position.
    const yy=h-32,hh=27,alts=t.elev.map(v=>v[1]),lo=Math.min(...alts),hi=Math.max(...alts),range=Math.max(1,hi-lo);g.strokeStyle='#49685f';g.lineWidth=1;g.beginPath();for(let i=0;i<=160;i++){const x=12+(w-24)*i/160,y=yy-(app.trackProfile(t.elev,i/160*t.L)-lo)/range*hh;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();const ph=app.trackWrap(state.distanceM,t.L),xx=12+(w-24)*ph/t.L;g.fillStyle='#86e7cf';g.fillRect(xx-1,yy-hh,2,hh+3);g.fillStyle='#9cb5b0';g.textAlign='left';g.font='9px monospace';g.fillText(`ALT ${Math.round(p.y)} m  ·  GRADE ${(p.grade*100).toFixed(1)}%`,12,h-10);
    return true;
  }
