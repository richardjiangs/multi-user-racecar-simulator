"""Generate new Track 2.0 pages. Original simulator HTML files are never rewritten."""
from pathlib import Path
import json,re,hashlib,importlib.util
f1_art_spec=importlib.util.spec_from_file_location("f1_art",Path(__file__).parent/"f1-2026/integrate.py");f1_art=importlib.util.module_from_spec(f1_art_spec);f1_art_spec.loader.exec_module(f1_art)
R=Path(__file__).resolve().parent.parent;S=R/'tools/tracks2';files=json.loads((S/'sim-files.json').read_text());excluded={'phantom'}
outputs={};audit={}
for key,file in files.items():
 if key in excluded:continue
 original=(R/file).read_text();s=original;f1=key.startswith('f1') and key!='f12tdf';race_pits=f1 or key in {'dacia','fordraptor','grhilux','hunter'};appname=re.search(r'window\.(\w+App)\s*=\s*\{',s)[1]
 def rep(a,b,required=True):
  global s
  if a not in s:
   if required:raise ValueError((key,'missing',a[:95]))
   return
  s=s.replace(a,b,1)
 def block(a,b,new):
  global s
  i=s.index(a);j=s.index(b,i);s=s[:i]+new+s[j:]
 rep('<script type="module">',(S/'loader.html').read_text()+'\n<script type="module">\nconst trackBundle=await window.TRACK2_READY;const TRACK_DATA=structuredClone(trackBundle.data),TRACK_MESHES=trackBundle.meshes;\nconst TRACK2_CONFIG='+json.dumps({'key':key,'f1':f1,'prototype':key in ['porsche919','ferrari499p','peugeot9x8','solusgt']})+';')
 rep('function halfWidthAt(d) {','function halfWidthAt(d) { if(app.trackModel?.())return app.trackWidthAt(d);')
 rep('function curvatureAt(d) {','function curvatureAt(d) { if(app.trackModel?.())return app.trackAt(d).k;')
 rep('function terrainOf() {','function terrainOf() { if(app.trackModel?.()?.terrain==="rally")return app.rallySector(state.distanceM);',False)
 rep('function terrainStep(dt) {','function terrainStep(dt) { if(app.rallyStep?.(dt))return;',False)
 rep('function roughnessAt(d) {','function roughnessAt(d) { if(app.trackModel?.())return state.inPitLane?.025:app.trackSurface(d,state.laneOffset);')
 rep('function raceLineOffAt(d) {','function raceLineOffAt(d) { if(app.trackModel?.())return app.racingOffset(d);')
 rep('function pathSteer(gain, targetOffset) {','function pathSteer(gain, targetOffset) { if(app.trackModel?.())return app.driverSteer();')
 rep('function targetSpeedMps() {','function targetSpeedMps() { if(app.trackModel?.())return app.driverTarget();')
 rep('function autopilotControls() {','function autopilotControls() { if(app.trackModel?.())return app.driverControls();')
 rep('function updatePhysics(dt) {','function updatePhysics(dt) { if(app.trackModel?.()&&!app.trackMeshReady?.())return;app.contactBegin?.(dt);app.driverBegin?.(dt);')
 rep('    updateInputs(dt);','    updateInputs(dt);if(app.pitHeld?.()){state.throttle=0;state.brake=1;state.speedMps=0;}')
 rep('    if (state.launchActive) {           // launch control commands full throttle instantly','    if(app.trackModel?.()&&(state.assist||state.testDriver||cruiseActive)&&state.gearMode!=="R"){const safe=app.driverControls();throttleTarget=Math.min(throttleTarget,safe.throttle);brakeTarget=Math.max(brakeTarget,safe.brake);if(safe.brake>.05)state.launchActive=false;}\n    if (state.launchActive) {           // launch control commands full throttle instantly')
 rep('state.curvature = curvatureAt(state.distanceM);','state.curvature = app.trackModel?.()&&state.inPitLane?app.pitCurvature(state.pitQ):curvatureAt(state.distanceM);')
 rep('const dsdt = v * Math.cos(state.headingRel) / denom;','let dsdt = v * Math.cos(state.headingRel) / denom;')
 rep('state.distanceM += dsdt * dt;','if(app.trackModel?.())dsdt=app.pitMotion(dt,dsdt);state.distanceM += dsdt * dt;')
 rep('if (overrun > 0.3', 'if (!app.trackModel?.() && overrun > 0.3')
 rep('state.laneOffset = clamp(state.laneOffset + dndt * dt, -60, 60);','state.laneOffset = app.trackModel?.()?state.laneOffset+dndt*dt:clamp(state.laneOffset+dndt*dt,-60,60);')
 rep('if (state.gearMode !== "R" && state.speedMps < 0) state.speedMps = 0;','if (state.gearMode !== "R" && state.speedMps < 0 && !app.contactActive?.()) state.speedMps = 0;')
 rep('if (state.dayPhase !== 0.9) state.dayPhase = (state.dayPhase + dt * 0.004) % 1;','if(app.trackModel?.())state.dayPhase=.30;else if (state.dayPhase !== 0.9) state.dayPhase = (state.dayPhase + dt * 0.004) % 1;')
 real_call='    realStep(dt, dsdt);' if '    realStep(dt, dsdt);' in s else '    realStep(dt);'
 rep(real_call,real_call+'\n    if(app.trackModel?.()){app.contactStep(dt);app.pitStep(dt,app.TEAM);app.trackLimitsStep(dt);}')
 rep('function resetCar() {','function resetCar() { app.track2Reset?.();')
 rep('function selectCircuit(name) {','function selectCircuit(name) { app.track2Reset?.();')
 route='state.route = { active: true, name, env: circ.env, totalM: circ.dist, remainingM: circ.dist, arrived: false };'
 if key=='spectre':route='state.route = { active: true, name, env: circ.env, totalM: circ.dist, remainingM: circ.dist,\n                    arrived: false, endDist: state.distanceM + circ.dist, loop: !!circ.loop };'
 rep(route,route+'\n    if(app.trackModel?.()){Object.assign(state,{distanceM:0,laneOffset:0,headingRel:0,speedMps:0,_lc:null,dayPhase:.3});state.route.endDist=circ.dist;app.prepareTrack(name);}')
 rep('function updateLap(dsdt, dt) {','function updateLap(dsdt, dt) { if(app.trackModel?.()?.closed===false){app.updateOpenRoute(dt);return;}')
 rep('      const v = r.speedMps;', '      if(app.contactActive?.(r))continue;\n      const v = r.speedMps;')
 rep('      r.brake = (v - r.speedMps) > 0.04 ? 1 : 0;','      app.rivalDriver?.(r,dt,v);\n      r.brake = (v - r.speedMps) > 0.04 ? 1 : 0;')
 rep('      r.lane = approach(r.lane, clamp(-Math.sign(kc) * Math.min(Math.abs(kc) * 600, 2.0), -3, 3), 0.02, dt);','      if(!app.trackModel?.())r.lane = approach(r.lane, clamp(-Math.sign(kc) * Math.min(Math.abs(kc) * 600, 2.0), -3, 3), 0.02, dt);')
 if race_pits:
  rep('function checkContact(dt) {','function checkContact(dt) { if(app.trackModel?.())return;')
  marker='    // ---- pit lane: drive in, auto pit limiter, stop in the box, choose tyres+fuel, release ----';end='    // safety car neutralises the field';i=s.index(marker);j=s.index(end,i);s=s[:i]+'    if(!app.trackModel?.()){\n'+s[i:j]+'    }\n'+s[j:]
  rep('if (r.out) {                                                            // retired:','if(app.trackModel?.()&&app.rivalPit(r,dt))continue;\n      if (r.out) {                                                            // retired:')
  rep('if (r.pitState === "" && r.wantPit && phr > Lr - 262','if (!app.trackModel?.() && r.pitState === "" && r.wantPit && phr > Lr - 262')
  rep('function pitInOut() {','function pitInOut() { if(app.requestPit?.())return;')
  rep('if (!state.realMode) { showToast("Pit stops are part of Real Race Mode — turn it on first.", "Pit Wall"); return; }','if (!state.realMode&&!app.trackModel?.()) { showToast("Choose a circuit to enter the pit lane.", "Pit Wall"); return; }')
  rep('function pitPlan() {','function pitPlan() { if(app.trackModel?.()&&!state.realMode)return {t:TEAM.pitCrew,items:["Practice tyre change"],text:"Practice tyre change — no damage repairs"};')
  for part,old in [('nose','.12'),('gearbox','.2'),('hydraulics','.2'),('brakes','.2'),('engine','.25')]:
   s=s.replace('s.'+part+' > 0'+old,'s.'+part+' > 0.005',1)
  # The old straight-line pit paths remain only on the unchanged brand circuit.
  s=s.replace('if (!r.pitState && phr > Lr - 262','if (!app.trackModel?.() && !r.pitState && phr > Lr - 262',1)
 rep('function drawMap() {','function drawMap() { if(drawTrackMap())return;')
 rep('const FOCAL = 360, CAM_H = 1.55;','let FOCAL=360;const CAM_H=1.55;')
 rep('  function resizeCanvas() {',(S/'render-track.js').read_text()+'\n  function resizeCanvas() {')
 rep('horizonY = h * 0.46; const pal = envColors(); rebuildRoadTable();','horizonY=h*(app.trackModel?.()?.42:.46);FOCAL=app.trackModel?.()?Math.min(w*.57,h*.78):360;const pal=envColors();rebuildRoadTable();')
 old='ctx.translate(w / 2 + state.shake.x, h / 2 + state.shake.y); ctx.rotate(state.shake.rot); ctx.translate(-w / 2, -h / 2);'
 rep(old,'if(!app.trackModel?.()){'+old+'}')
 old='drawSky(w, h, pal); drawScenery(w, h, pal); drawRoad(w, h, pal); drawRoadside(w, h, pal); drawTraffic(w, h, pal); drawRivals(w, h, pal);'
 if key=='db5':old='drawSky(w, h, pal); drawScenery(w, h, pal); drawRoad(w, h, pal); drawStage(w, h, pal);\n    if (!onStage()) { drawRoadside(w, h, pal); drawTraffic(w, h, pal); }\n    drawRivals(w, h, pal);'
 if key=='spectre':
  start=s.index('drawSky(w, h, pal);',s.index('function drawWorld('));end=s.index('drawCabinFrame(w, h, pal);',start);old=s[start:end]
 original_world=old.replace('drawSky(w, h, pal);','',1)
 rep(old,'drawSky(w,h,pal);if(app.trackModel?.()){drawTrackRoad(w,h,pal);'+('if(state.stage)drawHookLine(w,h);' if key=='db5' else '')+'}else{trackCamera=null;'+original_world+'}')
 if key=='f12tdf':
  rep('      drawMuseum(w, h, pal);','      if(app.trackModel?.())drawTrackRoad(w,h,pal);drawMuseum(w,h,pal);')
  rep('for (let i = bays.length - 1; i > 0; i--) {','for (let i = app.trackModel?.()?0:bays.length - 1; i > 0; i--) {')
 if key=='slr300':
  s=re.sub(r'(data-circuit="AVUS Berlin"[^>]*>)[^<]+',r'\1AVUS Berlin · historic',s)
 rep('ctx.fillStyle = sky; ctx.fillRect(0, 0, w, horizonY + 40);','ctx.fillStyle = sky; ctx.fillRect(0,0,w,h);')
 rep('function projectAhead(distAhead, lateralM) {','function projectAhead(distAhead, lateralM) { if(trackCamera)return projectTrack(trackPoint(state.distanceM+distAhead,lateralM||0));')
 rep('function drawRearView(mx, my, mw, mh, p, pal) {','function drawRearView(mx, my, mw, mh, p, pal) { if(trackCamera&&trackGL){drawTrackMirror(mx,my,mw,mh,p,pal);return;}',False)
 rep('Object.assign(app, { resizeCanvas, drawWorld, drawMap, injectArt, roundRect });','Object.assign(app, { resizeCanvas, drawWorld, drawMap, injectArt, roundRect,trackFrame,trackPoint,projectTrack });')
 modules='window.__Track2App=window.'+appname+';\n'+'\n'.join((S/name).read_text()for name in ['compat.js','track-runtime.js','rally-runtime.js','contact-runtime.js','driver-runtime.js','route-assets.js'])
 rep('/* ===== render: the driving world ===== */',modules+'\n/* ===== render: the driving world ===== */')
 if f1 and key!='f1mercedes':s=f1_art.integrate(s)
 # Record byte-identical audio and keyboard source before/after.
 preserved={}
 for label,start,end in [('audio','/* ===== audio','/* ===== physics'),('keyboard','  function bindKeyboard()','  function bindMobilePad()')]:
  if start in original and end in original:
   x=original[original.index(start):original.index(end,original.index(start))];y=s[s.index(start):s.index(end,s.index(start))];assert x==y,(key,label);preserved[label]=hashlib.sha256(x.encode()).hexdigest()
 if key=='f1mercedes' and (S/'mercedes-template.html').exists():
  s=(S/'mercedes-template.html').read_text().replace('<!--TRACK2_LOADER-->',(S/'loader.html').read_text())
  s=s.replace('const TRACK_DATA=','const TRACK_DATA=',1)
  rep('const trackBundle=await window.TRACK2_READY;','const TRACK2_CONFIG={key:"f1mercedes",f1:true,prototype:false};\nconst trackBundle=await window.TRACK2_READY;')
  block('/* Mercedes offline circuit model.','/* Hand-authored W17 artwork.',modules+'\n')
  block('  // Complete prebuilt world +','  function resizeCanvas() {',(S/'render-track.js').read_text()+'\n')
  rep('function updatePhysics(dt) {','function updatePhysics(dt) { if(app.trackModel?.()&&!app.trackMeshReady?.())return;')
  rep('function updateLap(dsdt, dt) {','function updateLap(dsdt, dt) { if(app.trackModel?.()?.closed===false){app.updateOpenRoute(dt);return;}')
  rep(route,route+'\n    if(app.trackModel?.())app.prepareTrack(name);')
 s=s.replace('</body>','<script>'+ (S/'touch-controls.js').read_text()+'''
{const controls=new URLSearchParams(location.search).get('controls');if(controls){const t=setInterval(()=>{if(window.installGarageControls(window,controls))clearInterval(t)},100);setTimeout(()=>clearInterval(t),30000);}}</script></body>''')
 name=Path(file).stem+' 2.0.html';(R/name).write_text(s);outputs[key]=name;audit[key]={'file':name,'app':appname,'preserved':preserved,'bytes':len(s.encode())}
(S/'manifest.json').write_text(json.dumps(outputs,indent=2));(R/'tests/track2/build-audit.json').write_text(json.dumps(audit,indent=2));print('Generated',len(outputs),'2.0 simulators; kept',len(excluded),'cars unchanged')
