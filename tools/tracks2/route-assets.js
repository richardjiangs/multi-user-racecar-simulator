/* Load the complete immutable route before allowing any physics steps. No road
   sections are generated or fetched in response to the car's position. */
(function(){
 const app=window.__Track2App,s=app.state;
 let request=0;
 const veil=document.createElement('div');veil.id='track2-route-loading';veil.setAttribute('role','status');veil.style.cssText='display:none;position:fixed;inset:0;z-index:10000;place-content:center;background:#10212ce8;color:#effbf8;text-align:center;font:16px/1.7 system-ui;padding:24px';document.body.appendChild(veil);
 const info=document.createElement('details');info.id='track2-source-note';info.style.cssText='margin:12px 0;padding:9px;border:1px solid #62716e;border-radius:8px;font:12px/1.5 system-ui';const summary=document.createElement('summary');summary.textContent='Track 2.0 · route sources and accuracy';const note=document.createElement('p');info.append(summary,note);const first=document.querySelector('[data-circuit]');first?.parentElement?.appendChild(info);
 const reset=app.track2Reset;app.track2Reset=()=>{request++;veil.style.display='none';reset?.();};
 app.trackMeshReady=()=>!app.trackModel()||!!TRACK_MESHES[s.route.name]?.bytes;
 app.prepareTrack=async name=>{
  const ticket=++request;if(!app.trackData[name]){veil.style.display='none';return;}note.textContent=app.trackData[name].notes||'Measured centreline with modelled track details.';if(app.trackData[name].src?.startsWith('https://')){const link=document.createElement('a');link.href=app.trackData[name].src;link.target='_blank';link.rel='noopener noreferrer';link.textContent=' Source';note.append(link);}
  if(TRACK_MESHES[name]?.bytes){veil.style.display='none';return;}
  veil.textContent='Loading the complete '+name+' route…';veil.style.display='grid';
  try{await trackBundle.ensure(name);if(ticket===request)veil.style.display='none';}
  catch(error){if(ticket!==request)return;veil.replaceChildren();const p=document.createElement('p');p.textContent='This route could not load. '+error.message;const retry=document.createElement('button');retry.textContent='Retry route';retry.onclick=()=>app.prepareTrack(name);veil.append(p,retry);}
 };
 app.updateOpenRoute=dt=>{
  const t=app.trackModel();if(!t||t.closed!==false)return;
  s.distanceM=app.clamp(s.distanceM,0,t.L);s.route.remainingM=t.L-s.distanceM;
  const neutral=t.neutralized?.some(([a,b])=>s.distanceM>=a&&s.distanceM<b);s.rallyNeutralized=!!neutral;if(!s.route.arrived&&!neutral)s.lap.curMs+=dt*1000;
  if(s.distanceM>=t.L-.3){s.speedMps=0;app.holdContactPlayer?.();if(!s.route.arrived){s.route.arrived=true;s.adaptiveCruise=false;s.testDriver=false;s.lap.lastMs=s.lap.curMs;app.showToast('Finish — '+(s.lap.curMs/1000).toFixed(1)+' seconds. Select a route to restart.','Route complete');}}
  // Keep the same world visible at the finish; never switch to the generic road.
 };
 if(app.trackModel())app.prepareTrack(s.route.name);
})();
