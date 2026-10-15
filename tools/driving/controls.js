/* Current garage controls, also applied to new standalone Track 2.0 files.
   Track 1.0 source downloads remain archived byte-for-byte. */
(function(root){
  function bindTrackpadSteering() {
    const capture=document.getElementById('trackpadCapture'),countdown=document.getElementById('trackpadCountdown'),number=document.getElementById('trackpadCountdownNum');
    let timer=null,ownFullscreen=false;
    const typing=e=>e.target?.closest?.('input,textarea,select,[contenteditable="true"],#gpsUnit');
    const cancel=()=>{clearTimeout(timer);timer=null;if(countdown)countdown.hidden=true;};
    const disable=()=>{cancel();state.trackpadSteering=false;state.touchSteer=0;state.trackpadLastInput=-99;document.documentElement.classList.remove('trackpad-steer');document.documentElement.style.setProperty('--tw-rot','0deg');if(capture)capture.hidden=true;if(ownFullscreen&&document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});ownFullscreen=false;};
    window.addEventListener('keydown',e=>{
      if(e.code==='Escape'){disable();return;}
      if(e.repeat||typing(e)||timer||state.trackpadSteering)return;
      if(!((e.code==='KeyT'&&state.keys.Space)||(e.code==='Space'&&state.keys.KeyT)))return;
      e.preventDefault();if(number)number.textContent='1';if(countdown)countdown.hidden=false;
      showToast('Hold T + Space for 1 second for fullscreen trackpad steering.','Controls');
      timer=setTimeout(()=>{
        cancel();if(!state.keys.KeyT||!state.keys.Space)return;
        state.trackpadSteering=true;state.touchActive=false;state.touchSteer=0;state.trackpadLastInput=state.time;
        document.documentElement.classList.add('trackpad-steer');if(capture)capture.hidden=false;
        if(!document.fullscreenElement&&document.documentElement.requestFullscreen){ownFullscreen=true;document.documentElement.requestFullscreen({navigationUI:'hide'}).catch(()=>{ownFullscreen=false;showToast('Trackpad steering is on; the browser blocked fullscreen.','Controls');});}
        showToast('Trackpad steering on — horizontal two-finger swipe steers. Escape exits.','Controls');
      },1000);
    });
    window.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='KeyT')cancel();});
    window.addEventListener('blur',()=>{cancel();state.keys.KeyT=false;state.keys.Space=false;});
    window.addEventListener('wheel',e=>{
      if(!state.trackpadSteering||e.ctrlKey||typing(e))return;
      const unit=e.deltaMode===1?16:e.deltaMode===2?innerWidth:1;
      let delta=e.deltaX*unit;if(Math.abs(delta)<.6&&e.shiftKey)delta=e.deltaY*unit;
      e.preventDefault();if(Math.abs(delta)<.35)return;state.trackpadLastInput=state.time;state.touchSteer=clamp(state.touchSteer+delta*.002,-1,1);document.documentElement.style.setProperty('--tw-rot',(state.touchSteer*120)+'deg');
    },{capture:true,passive:false});
    document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&ownFullscreen)disable();});
  }
  function prepare(html,key){
    html=root.MUCSVehicleRefinements.prepare(html,key);
    if(html.includes('/* MUCS controls 2026-10 */'))return html;
    const start=html.indexOf('function bindTrackpadSteering()');
    if(start<0)throw Error('Trackpad binding missing: '+key);
    // The original function is followed by bindStart (template) or bindMobilePad (Phantom).
    const end=html.indexOf(key==='phantom'?'function bindMobilePad()':'function bindStart()',start);
    if(end<0)throw Error('Trackpad boundary missing: '+key);
    html=html.slice(0,start)+bindTrackpadSteering.toString()+'\n  '+html.slice(end);
    html=html.replace(/\(state\.assist\s*\|\|\s*state\.testDriver\s*\|\|\s*cruiseActive\)/g,'(state.testDriver || cruiseActive)');
    html=html.replace(/if\s*\(state\.assist\s*&&\s*!driving\)\s*app\.toggleTestDriver\(true\);/g,'/* Assist never engages the separate Test Driver. */');
    if(key!=='phantom'){
      html=html.replace('const follow = pathSteer(1.0, 0);','const follow = pathSteer(1.0, steeringAssistOffset());');
      html=html.replace('function pathSteer(gain, targetOffset) {',`let assistPass=null;
  function steeringAssistOffset(){
    const speed=Math.abs(state.speedMps),look=clamp(speed*.65,10,35),edge=Math.max(0,halfWidthAt(state.distanceM)-1.6),line=clamp(raceLineOffAt(state.distanceM+look),-edge,edge),L=state.route.totalM||1e9;
    const actors=(state.raceGrid?state.rivals:[]).filter(r=>!r.gone&&!r.dns).map(r=>({id:r,gap:state.route.loop?((r.distM-state.distanceM+L/2)%L+L)%L-L/2:r.distM-state.distanceM,n:r.lane||0,v:r.speedMps||0}));
    for(const r of state.traffic||[])actors.push({id:r,gap:r.z,n:r.lat??r.lane*3,v:r.oncoming?-r.speed:r.speed});
    const held=assistPass&&actors.find(r=>r.id===assistPass.id&&r.gap> -14&&r.gap<170),lead=held||actors.filter(r=>r.gap>0&&r.gap<Math.max(45,(speed-r.v)*3.3+20)&&Math.abs(r.n-state.laneOffset)<3.2).sort((a,b)=>a.gap-b.gap)[0];
    if(!lead){assistPass=null;return line;}
    const candidates=[lead.n-3.25,lead.n+3.25].filter(n=>Math.abs(n)<=edge&&actors.every(r=>r===lead||Math.abs(r.n-n)>3.1||Math.abs(r.gap+(r.v-speed)*2)>16));
    if(!candidates.length)return line;const target=held?assistPass.n:state.laneOffset,n=candidates.reduce((a,b)=>Math.abs(a-target)<Math.abs(b-target)?a:b);assistPass={id:lead.id,n};return n;
  }
  function pathSteer(gain, targetOffset) {`);
    }
    html=html.replace(/Hold Space \+ T for 3 seconds/g,'Hold T + Space for 1 second').replace(/hold (?:Space \+ T|T \+ Space) for 3 seconds/gi,'hold T + Space for 1 second');
    return html.replace('</body>','<!-- /* MUCS controls 2026-10 */ --></body>');
  }
  root.MUCSDriving={prepare};
})(typeof window==='undefined'?globalThis:window);
