(function(root){
 function prepare(html,key){
  if(html.includes('/* MUCS vehicle refinements v1 */'))return html;
  const appName=key==='phantom'?'PhantomApp':html.match(/window\.(\w+App)\s*=\s*\{/)[1];
  const sedan=root.MUCSLondonSedans.eligible(key);if(sedan)html=root.MUCSLondonSedans.prepare(html,key);
  const city=key==='spectre'||key==='phantom',classic=key==='db5',rallyFiles=/Dakar/.test(html);
  const helper=root.MUCSVehicleArt.drawTrafficVehicle.toString();
  function insertBeforeFunction(name,text){const mark='function '+name+'(';if(!html.includes(mark))throw Error('Missing '+key+' '+name);html=html.replace(mark,text+'\n  '+mark);}
  if(city){
   insertBeforeFunction('drawCityTraffic',helper+'\n'+`function drawCityTraffic(w,h,pal){
    const list=state.traffic.filter(c=>!c.hidden).map(car=>{const lateral=car.lat??car.lane*3,p=projectAhead(car.z,lateral),road=centerlineAt(car.z),yaw=road.psi+(car.oncoming?Math.PI:0)-Math.atan2(road.X-state.laneOffset,road.Z);return{car,p,yaw};}).filter(v=>v.p.fwd>1.5).sort((a,b)=>b.p.fwd-a.p.fwd);
    for(const {car,p,yaw} of list){const v=VEHICLES[car.kind]||VEHICLES.saloon;if(p.scale<.04)continue;
     drawTrafficVehicle(ctx,p.x,p.y,p.scale,{...car,viewYaw:yaw,body:car.body||v.body},Math.cos(yaw)<0,pal.night,state.time);
    }
   }`);
   // Keep the old drawing in the source archive for provenance, but do not execute it.
   const second=html.indexOf('function drawCityTraffic(',html.indexOf('function drawCityTraffic(')+1);
   html=html.slice(0,second)+html.slice(second).replace('function drawCityTraffic(','function drawLegacyCityTraffic(');
   if(key==='spectre'){
    html=html.replace('audio.chime && audio.chime(0.7);','app.startPursuit?.();');
    html=html.replace('showToast(`You went through ${sg.name} on red. In this car that is unforgivable.`, "Signal");','showToast("Police are following behind after the red light.", "Signal");');
    html=html.replace('function drawCarSprite(x, y, sc, car, brake, pal, label, laneSide) {',`function drawCarSprite(x,y,sc,car,brake,pal,label,laneSide){return drawTrafficVehicle(ctx,x,y,sc,{...car,brake},false,pal.night,state.time,(laneSide||0)*.025);}\n function drawLegacyCarSprite(x, y, sc, car, brake, pal, label, laneSide) {`);
    html=html.replace('const seen = [];\n    for (const r of (state.rivals || [])) {','const seen = (state.pursuit||[]).map(r=>({r,off:r.distM-state.distanceM}));\n    for (const r of (state.rivals || [])) {');
    html=html.replace('body: (v && v.body) || `hsl(${c.hue},18%,${c.tone}%)`,','kind:c.kind, body: (v && v.body) || `hsl(${c.hue},18%,${c.tone}%)`,');
    const start=html.indexOf('      const cw = Math.max(3, 1.9 * pp.s)'),end=html.indexOf('      ctx.restore();',start);
    if(start<0||end<0)throw Error('Spectre mirror boundary');
    html=html.slice(0,start)+'      drawTrafficVehicle(ctx,pp.x,pp.y,pp.s,r,!r.oncoming,pal.night,state.time,(r.lane||0)*.02);\n'+html.slice(end+'      ctx.restore();'.length);
    // Looking back through a turned car also reveals the pursuers in the main view.
    html=html.replace('drawSignals(w, h, pal); drawJunctionPost(w, h, pal); drawRivals(w, h, pal);','drawSignals(w, h, pal); drawJunctionPost(w, h, pal); drawRivals(w, h, pal); for(const r of state.pursuit||[]){const p=projectAhead(r.distM-state.distanceM,r.lane);if(p.fwd>.4)drawTrafficVehicle(ctx,p.x,p.y,p.scale,r,true,pal.night,state.time);}');
   }else{
    html=html.replace('function drawPolice(w, h, pal) {',`function drawPolice(w,h,pal){const r=state.police;if(!r)return;const p=projectAhead(r.z,app.homeLaneOffAt?.(state.distanceM)||0);if(p.scale>.06)drawTrafficVehicle(ctx,p.x,p.y,p.scale,{kind:'police'},true,pal.night,state.time);}\n function drawLegacyPolice(w, h, pal) {`);
   }
   html=html.replace('enterLondon, londonActive, currentRoad, junctionChoices, LDN,','enterLondon, londonActive, currentRoad, junctionChoices, LDN, londonMarks:LDN_MARKS, londonOpen:LDN_OPEN, londonLook:LDN_LOOK,');
   html=html.replace('function drawLandmark(p, rel, half, kit, night) {','app.drawCityLandmark=drawLandmark;\n  function drawLandmark(p, rel, half, kit, night) {');
   const landStart=html.indexOf('function drawLandmark(p, rel, half, kit, night) {');
   html=html.slice(0,landStart)+html.slice(landStart).replace('const b = projectAhead(Math.max(2.5, rel), lat);','const b = p.worldProjection || projectAhead(Math.max(2.5, rel), lat);');
   html=html.replace('function drawBlock(p, rel, lat, kit, night) {','app.drawCityBlock=drawBlock;\n  function drawBlock(p, rel, lat, kit, night) {');
   html=html.replace('const q = wallQuad(rel, lat, p.wM, hM); if (!q) return;','const q = p.worldQuad || wallQuad(rel, lat, p.wM, hM); if (!q) return;');
   const cityApp=key==='spectre'?'LAPP()':'app';
   html=html.replace('picked: preferredChoice(outs)',`picked: outs.find(c=>c.link===${cityApp}.state.ldn?.netExit?.link)||preferredChoice(outs)`);
   html=html.replace('Math.min(limit, cornerCap, trafficCap, arriveCap)','Math.min(limit, cornerCap, trafficCap, arriveCap, app.cityNetwork?.arrivalSpeedLimit()??Infinity)');
   html=html.replace('function londonStep(dt) {',`function londonStep(dt) { if(${cityApp}.cityNetwork)return ${cityApp}.cityNetwork.step(dt);`);
   html=html.replace('function londonCurvatureAt(d) {',`function londonCurvatureAt(d) { if(${cityApp}.cityNetwork)return ${cityApp}.cityNetwork.curvature(d);`);
   html=html.replace('function cityTrafficStep(dt) {','function cityTrafficStep(dt) { if(state.ldn&&app.cityNetwork)return app.cityNetwork.trafficStep(dt);');
   html=html.replace('state.distanceM + (c.oncoming ? -c.z : c.z)','state.distanceM + c.z');
   if(key==='phantom')html=html.replace('    if (street) {','    if(state.ldn&&app.cityNetwork){app.cityNetwork.draw(w,h,pal);}else if (street) {');
   else{
    const start=html.indexOf('    if (state.city) { ctx.fillStyle = pal.grass;',html.indexOf('function drawWorld()'));
    let end=html.indexOf('drawCabinFrame(w, h, pal);',start);
    // Track 2.0 wraps the old world block; leave its closing brace outside ours.
    if(html.slice(end-1,end)==='}')end--;

    if(start<0||end<0)throw Error('London world renderer boundary');
    html=html.slice(0,start)+'    if(state.ldn&&app.cityNetwork){app.cityNetwork.draw(w,h,pal);}else{\n'+html.slice(start,end)+'    }\n'+html.slice(end);
    html=html.replace('function drawRearView(mx, my, mw, mh, p, pal) {','function drawRearView(mx, my, mw, mh, p, pal) { if(state.ldn&&app.cityNetwork){app.cityNetwork.drawRear(mx,my,mw,mh,pal,p);return;}');
   }
  }else if(rallyFiles&&!/^f1(?!2)/.test(key)){
   // Some rally cars reseed directly when Real Mode changes. Keep that path
   // behind the same route-aware roster used by the garage and grid controls.
   html=html.replace(/(?<![.\w])seedRivals\(\);/g,'app.seedRivals();');
   insertBeforeFunction('drawCarSprite',helper);
   html=html.replace('function drawCarSprite(x, y, sc, car, brake, pal, label, laneSide) {','function drawCarSprite(x, y, sc, car, brake, pal, label, laneSide) { if(car.dakar)return drawTrafficVehicle(ctx,x,y,sc,{...car,brake},false,pal.night,state.time,(laneSide||0)*.03);');
  }
  if(classic){
   insertBeforeFunction('drawCabinFrame',root.MUCSDB5Art.drawDB5Dashboard.toString());
   html=html.replace('function drawCabinFrame(w, h, pal) {',`function drawCabinFrame(w,h,pal){
    ctx.save();ctx.fillStyle='#182026';for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side<0?0:w,0);ctx.lineTo(side<0?w*.065:w*.935,0);ctx.lineTo(side<0?w*.023:w*.977,h*.74);ctx.lineTo(side<0?0:w,h*.77);ctx.closePath();ctx.fill();}ctx.fillRect(0,0,w,h*.018);ctx.restore();
    drawDB5Dashboard(ctx,w,h,state,app);app.db5Dashboard={fasciaY:h*.735,topY:h*.735-19*Math.min(w/1400,h/720)};
   }\n function drawLegacyCabinFrame(w, h, pal) {`);
  }
  const runtime=root.MUCSVehicleRuntime.install.toString();
  let extra=sedan?`(${root.MUCSLondonSedans.install.toString()})(app,(${root.MUCSLondonData.create.toString()})());`:'';
  if(city||sedan)extra+=`(${root.MUCSCityNetwork.install.toString()})(app,${helper},${root.MUCSLondonMap.draw.toString()});`;
  if(classic)extra=`
    ${root.MUCSDB5Art.drawDB5Dashboard.toString()}
    const cabin=app.el.cabinArt,old=cabin.querySelector('svg');if(old)old.style.display='none';
    const canvas=document.createElement('canvas');canvas.id='db5PeriodCabin';canvas.setAttribute('aria-label','Live DB5 Black Pearl dashboard, Smiths instruments and David Brown wood-rim steering wheel');canvas.style.cssText='display:block;width:100%;aspect-ratio:1400/420';cabin.appendChild(canvas);
    const ui=app.updateUi;app.updateUi=function(...args){ui.apply(app,args);if(!document.body.classList.contains('view-cockpit'))return;const w=canvas.clientWidth||1000,h=w*420/1400,dpr=Math.min(2,devicePixelRatio);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);drawDB5Dashboard(ctx,w,h,app.state,app,true);};`;
  html=html.replace('</body>',`<script type="module">\n/* MUCS vehicle refinements v1 */\nif(window.TRACK2_READY)await window.TRACK2_READY;\nconst app=window.${appName};\n(${runtime})(app,${JSON.stringify(key)});\n${extra}\n<\/script>\n</body>`);
  return html;
 }
 root.MUCSVehicleRefinements={prepare};
})(typeof window==='undefined'?globalThis:window);
