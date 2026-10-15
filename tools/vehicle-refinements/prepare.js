(function(root){
 function prepare(html,key){
  if(html.includes('/* MUCS vehicle refinements v1 */'))return html;
  const appName=key==='phantom'?'PhantomApp':html.match(/window\.(\w+App)\s*=\s*\{/)[1];
  const city=key==='spectre'||key==='phantom',classic=key==='db5',rallyFiles=/Dakar/.test(html);
  const helper=root.MUCSVehicleArt.drawTrafficVehicle.toString();
  function insertBeforeFunction(name,text){const mark='function '+name+'(';if(!html.includes(mark))throw Error('Missing '+key+' '+name);html=html.replace(mark,text+'\n  '+mark);}
  if(city){
   insertBeforeFunction('drawCityTraffic',helper+'\n'+`function drawCityTraffic(w,h,pal){
    const list=state.traffic.slice().filter(c=>!c.hidden&&c.z>1.5).sort((a,b)=>b.z-a.z);
    for(const car of list){const v=VEHICLES[car.kind]||VEHICLES.saloon,lateral=car.lat??car.lane*3,p=projectAhead(car.z,lateral);if(p.scale<.04)continue;
     drawTrafficVehicle(ctx,p.x,p.y,p.scale,{...car,body:car.body||v.body},!!car.oncoming,pal.night,state.time,Math.atan2(lateral-state.laneOffset,Math.max(8,car.z)));
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
  let extra='';
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
