/* Explicit input layout. Existing wheel and keyboard handlers remain in place. */
window.installGarageControls = function(win, mode) {
 const doc=win.document,app=Object.values(win).find(v=>v&&v.state&&v.updatePhysics&&v.setGear);if(!app)return false;
 const state=app.state;let style=doc.getElementById('garage-control-layout');
 if(!style){style=doc.createElement('style');style.id='garage-control-layout';style.textContent=`
 html[data-controls="pc"] .mobile-pad,html[data-controls="pc"] .touch-wheel{display:none!important}
 html[data-controls="dpad"] body.view-drive .mobile-pad{display:grid!important;grid-template-columns:repeat(2,56px)!important;grid-template-rows:repeat(2,48px)!important;gap:6px!important;left:10px!important;touch-action:none}
 html[data-controls="dpad"] body.view-drive .touch-wheel{display:block!important;touch-action:none}
 html[data-controls="dpad"] .mobile-pad button{min-width:44px;min-height:44px;user-select:none;touch-action:none}
 html[data-controls="dpad"] .mobile-pad [data-pad="up"]{grid-column:1;grid-row:1}
 html[data-controls="dpad"] .mobile-pad [data-pad="down"]{grid-column:2;grid-row:1}
 html[data-controls="dpad"] .mobile-pad [data-pad="left"]{grid-column:1;grid-row:2}
 html[data-controls="dpad"] .mobile-pad [data-pad="right"]{grid-column:2;grid-row:2}
 html[data-controls="dpad"] .mobile-pad>span{display:none}
 @media(max-height:550px){html[data-controls="dpad"] body.view-drive .mobile-pad{bottom:116px!important;grid-template-columns:repeat(2,48px)!important;grid-template-rows:repeat(2,44px)!important}html[data-controls="dpad"] body.view-drive .touch-wheel{bottom:116px!important;right:10px!important;width:84px!important;height:84px!important}}
 `;doc.head.appendChild(style);}
 let pad=doc.querySelector('.mobile-pad');if(!pad){pad=doc.createElement('div');pad.className='mobile-pad';pad.style.cssText='position:fixed;left:10px;bottom:200px;z-index:100';doc.body.appendChild(pad);}
 const codes={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'},labels={up:'Go',down:'Brake',left:'◀ Left',right:'Right ▶'};
 for(const [direction,code]of Object.entries(codes)){let button=pad.querySelector(`[data-pad="${direction}"]`);if(!button){button=doc.createElement('button');button.dataset.pad=direction;button.textContent=labels[direction];button.setAttribute('aria-label',direction==='left'?'Turn left':direction==='right'?'Turn right':labels[direction]);pad.appendChild(button);}
  if(button.dataset.garageBound)continue;button.dataset.garageBound='true';const pointers=new Set();
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pointers.add(e.pointerId);state.keys[code]=true;});const release=e=>{pointers.delete(e.pointerId);if(!pointers.size)state.keys[code]=false;};for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,release);button.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();state.keys[code]=true;}});button.addEventListener('keyup',()=>state.keys[code]=false);button.addEventListener('blur',()=>state.keys[code]=false);
 }
 for(const code of Object.values(codes))state.keys[code]=false;state.padThrottle=state.padBrake=0;
 doc.documentElement.dataset.controls=mode==='dpad'?'dpad':'pc';
 if(!win.__garageInputBlur){win.__garageInputBlur=true;win.addEventListener('blur',()=>{for(const code of Object.values(codes))state.keys[code]=false;state.padThrottle=state.padBrake=0;});}
 return true;
};
