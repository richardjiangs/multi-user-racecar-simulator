/* SVG primitives are shared; each team's authored contour and control layout is
   supplied by wheel-profiles.js. The LCD is a live instrument, never a picture. */
(function(){
 const app=window.__Track2App,profile=F1_WHEELS[TRACK2_CONFIG.key];
 if(!profile)return;
 const text=(x,y,label,size=8,color='#d6dde0',extra='')=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}" ${extra}>${label}</text>`;
 const bolt=(x,y,r=2)=>`<g transform="translate(${x} ${y})"><circle r="${r+1}" fill="#070a0c"/><circle r="${r}" fill="#929da2"/><path d="M-${r*.55} 0H${r*.55}M0 -${r*.55}V${r*.55}" stroke="#263136" stroke-width=".75"/></g>`;
 const defs=p=>`<defs>
 <pattern id="${p}weave" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(32)"><rect width="7" height="7" fill="#151b1e"/><path d="M0 0H4V3H0ZM3 4H7V7H3Z" fill="#222a2f"/><path d="M1 0V3M3 0V3M4 4V7M6 4V7" stroke="#3b474e" stroke-width=".45" opacity=".4"/></pattern>
 <linearGradient id="${p}rubber"><stop stop-color="#0a0d0f"/><stop offset=".24" stop-color="#30373b"/><stop offset=".55" stop-color="#151a1e"/><stop offset=".82" stop-color="#242b30"/><stop offset="1" stop-color="#06090b"/></linearGradient>
 <linearGradient id="${p}metal" x2=".35" y2="1"><stop stop-color="#d4dde0"/><stop offset=".32" stop-color="#67757c"/><stop offset=".55" stop-color="#bec9cf"/><stop offset="1" stop-color="#3b484e"/></linearGradient>
 <radialGradient id="${p}knob"><stop stop-color="#606b70"/><stop offset=".45" stop-color="#293439"/><stop offset=".72" stop-color="#141c22"/><stop offset="1" stop-color="#03080c"/></radialGradient>
 </defs>`;
 const active=(live,action,label)=>live?`data-wheel-action="${action}" role="button" tabindex="0" aria-label="${label}"`:'';
 const titles={neutral:'Select neutral',box:'Request pit stop',pit:'Pit speed limiter',radio:'Team radio',override:'Hold energy override · V',aero:'Hold active aero · X',mode:'Drive mode',strat:'Power-unit strategy',bias:'Brake balance',hybrid:'Energy deployment',display:'Telemetry display',ignition:'Ignition',drink:'Drink pump',cool:'Driver cooling',up:'Upshift paddle',down:'Downshift paddle'};
 function button(b,live){const[x,y,label,color,action]=b;return`<g ${active(live,action,titles[action])}><title>${titles[action]}</title><circle cx="${x}" cy="${y}" r="11.5" fill="#060b0d" stroke="#66757b" stroke-width="1"/><circle cx="${x}" cy="${y}" r="8.5" fill="${color}" stroke="#f4eee5" stroke-opacity=".28"/><path d="M${x-5} ${y-5}Q${x} ${y-9} ${x+5} ${y-5}" stroke="#fff" stroke-opacity=".25" fill="none"/>${text(x,y+2.3,label,label.length>3?4.8:6.5,'#11191d','text-anchor="middle" font-weight="bold"')}</g>`;}
 function rotary(r,live){const[x,y,radius,label,color,action]=r;return`<g ${active(live,action,titles[action])}><title>${titles[action]}</title><circle cx="${x}" cy="${y}" r="${radius+2}" fill="#050b0f" stroke="#65737a"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>
 ${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6,tx=x+Math.sin(a)*(radius-3.5),ty=y-Math.cos(a)*(radius-3.5);return text(tx,ty+1.5,String(i+1),4.2,'#142126','text-anchor="middle"');}).join('')}
 <circle cx="${x}" cy="${y}" r="${radius*.58}" fill="url(#${live?'fwLive':'fwDrive'}knob)"/>
 <path d="M${x-4} ${y+radius*.53}L${x-4} ${y-radius*.7}L${x+3} ${y-radius*.83}L${x+5} ${y+radius*.48}Z" fill="#202d33" stroke="#95a4aa" stroke-width=".7"/>
 <path d="M${x} ${y-3}V${y-radius*.65}" stroke="#eeeede" stroke-width="1.8"/>${text(x,y+radius+10,label,5.5,'#d6dddf','text-anchor="middle"')}</g>`;}
 function roller(r,live){const[x,y,label,action]=r;return `<g ${active(live,action,titles[action])}><title>${titles[action]}</title><rect x="${x-7}" y="${y-12}" width="14" height="24" rx="4" fill="#080b0d" stroke="#6e7d82"/>
 <rect x="${x-5.5}" y="${y-10}" width="11" height="20" rx="3" fill="#dcb843"/>${Array.from({length:7},(_,i)=>`<path d="M${x-5.5} ${y-9+i*3}h11" stroke="#453919" stroke-width="1"/>`).join('')}${text(x,y+20,label,4.7,'#d4dee0','text-anchor="middle"')}</g>`;}
 function wheelSvg(live=false){const p=live?'fwLive':'fwDrive',[sx,sy,sw,sh]=profile.screen,[lx,ly,ln,ld]=profile.led;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-225 -145 450 285" role="img" aria-label="${profile.model} carbon steering wheel with live telemetry and working controls">${defs(p)}
  ${[-1,1].map(side=>`<g ${active(live,side===-1?'down':'up',side===-1?titles.down:titles.up)}><path d="M${side*149} -70L${side*181} -87L${side*185} 36L${side*158} 72L${side*148} 42Z" fill="url(#${p}weave)" stroke="#88979e"/>${text(side*168,-49,side===-1?'−':'+',15,'#e0e8e9','text-anchor="middle"')}</g>`).join('')}
  <path d="${profile.outline}" fill="#04090d" stroke="#060a0e" stroke-width="8" transform="translate(0 4)"/>
  <path d="${profile.outline}" fill="url(#${p}weave)" stroke="#77858d" stroke-width="1.4"/>
  ${[-1,1].map(side=>`<g transform="scale(${side} 1)"><path d="${profile.grip}" fill="url(#${p}rubber)" stroke="#58656c" stroke-width="1.5"/>
  <path d="M187 -57Q197 -15 180 80" stroke="#9da4a7" stroke-opacity=".13" stroke-width="3" fill="none"/>
  ${Array.from({length:13},(_,i)=>`<path d="M${181-i*.2} ${-27+i*8}l11 3" stroke="#748088" stroke-width=".5" opacity=".25"/>`).join('')}</g>`).join('')}
  <rect x="${sx-6}" y="${sy-6}" width="${sw+12}" height="${sh+12}" rx="5" fill="#05090c" stroke="#738187" stroke-width="1.3"/>
  <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="2" fill="#071319"/>
  <path d="M${sx+2} ${sy+2}h${sw-4}L${sx+2} ${sy+sh*.22}Z" fill="#b3d4dd" opacity=".035"/>
  <g ${live?'id="cabRevSegs" data-on="#65e7ae" data-off="#20372e" data-red=".7" data-redcol="#92afff" data-redoff="#1b2439"':''}>${Array.from({length:ln},(_,i)=>`<circle cx="${lx+i*ld}" cy="${ly}" r="2.6" fill="#33453e" stroke="#151e21" stroke-width=".8"/>`).join('')}</g>
  ${[-1,1].map(side=>Array.from({length:3},(_,i)=>`<circle cx="${side*(sw/2+12)}" cy="${sy+4+i*9}" r="2.4" fill="#384553"/>`).join('')).join('')}
  ${profile.buttons.map(v=>button(v,live)).join('')}${profile.rotaries.map(v=>rotary(v,live)).join('')}${profile.rollers.map(v=>roller(v,live)).join('')}
  ${[[sx-3,sy-3],[sx+sw+3,sy-3],[sx-3,sy+sh+3],[sx+sw+3,sy+sh+3]].map(([x,y])=>bolt(x,y,1.5)).join('')}
  ${text(0,126,profile.mark,8.5,'#aebdc5','text-anchor="middle" letter-spacing="1.5"')}
  ${live?`<g id="f1LiveDisplay" transform="translate(${sx+sw/2} ${sy})"><text id="tachGearArt" x="0" y="${sh*.62}" fill="#f0f4ec" text-anchor="middle" font-family="monospace" font-size="34" font-weight="bold">N</text>
  ${text(-sw/2+7,sh*.38,'0',14,'#bce2e4','id="cabSpeedArt" font-weight="bold"')}${text(-sw/2+7,sh*.50,'KM/H',5,'#8ba3ae')}
  ${text(sw/2-7,sh*.38,'100%',10,'#d8de81','id="f1WheelEnergy" text-anchor="end"')}${text(sw/2-7,sh*.50,'ERS',5,'#8ba3ae','text-anchor="end"')}
  ${text(-sw/2+7,sh-9,'0',8,'#bdc9d2','id="cabRpmArt"')}${text(sw/2-7,sh-9,'0 kW',8,'#bdc9d2','id="f1WheelDeploy" text-anchor="end"')}
  ${text(0,11,'STANDARD',5.4,'#92bcb8','id="f1WheelStrategy" text-anchor="middle"')}</g>`:''}
  </svg>`;
 }
 Object.assign(app,{f1ArtProfile:profile,f1WheelSvg:wheelSvg,f1ArtText:text,f1ArtBolt:bolt,f1ArtDefs:defs});
})();
