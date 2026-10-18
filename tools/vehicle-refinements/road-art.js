/* Hand-authored 2021 Model S Plaid and 1993 A80 Supra artwork.
 * Geometry is deliberately separate: neither car is a recoloured body template.
 * Reference photographs and scope are in docs/TESLA_SUPRA_ART.md. */
(function(root){
 function engine(){
  const bolt=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.2" fill="#bac1c6" stroke="#4c555d"/><path d="M${x-1.6} ${y}h3.2" stroke="#3a444c"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" role="img" aria-label="Longitudinal 2JZ-GTE six-cylinder engine: alloy cam covers, six intake runners, sequential twin turbos, radiator and auxiliary systems"><defs><linearGradient id="jzMetal"><stop stop-color="#485157"/><stop offset=".24" stop-color="#c7cacc"/><stop offset=".48" stop-color="#929b9e"/><stop offset=".72" stop-color="#e1e1d9"/><stop offset="1" stop-color="#626d73"/></linearGradient><linearGradient id="jzCast" x2="0" y2="1"><stop stop-color="#a2aaa9"/><stop offset=".4" stop-color="#5d676b"/><stop offset="1" stop-color="#252e35"/></linearGradient><linearGradient id="jzRed" x2="0" y2="1"><stop stop-color="#ed5948"/><stop offset=".5" stop-color="#ab302a"/><stop offset="1" stop-color="#5d181e"/></linearGradient><pattern id="jzRibs" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0v5" stroke="#656e73" stroke-width="1"/></pattern></defs>
   <path d="M78 49Q450 2 822 49L853 399Q450 487 47 399Z" fill="#131b22" stroke="#ba3d34" stroke-width="18"/><path d="M88 52Q450 19 811 52L802 87Q449 59 97 87Z" fill="#2c3439"/>
   ${Array.from({length:35},(_,i)=>`<path d="M${112+i*19} 48v23" stroke="#111920" stroke-width="5"/>`).join('')}
   <path d="M75 111L217 99 241 346 89 391Z M687 99l137 13 11 281-146-53Z" fill="url(#jzRed)" stroke="#f1745c"/>
   ${[155,746].map(x=>`<ellipse cx="${x}" cy="167" rx="53" ry="42" fill="#932924" stroke="#e46e56"/><ellipse cx="${x}" cy="167" rx="31" ry="25" fill="#273038" stroke="#a2acaf"/><circle cx="${x}" cy="167" r="12" fill="url(#jzMetal)"/>${[[-20,-15],[22,-12],[0,25]].map(([dx,dy])=>bolt(x+dx,167+dy)).join('')}`).join('')}
   <!-- Rear firewall, vacuum lines and brake booster. -->
   <circle cx="681" cy="102" r="37" fill="#222c33" stroke="#5b656c" stroke-width="3"/><path d="M658 93h53v24h-53Z" fill="url(#jzCast)"/><path d="M662 76h47v22h-47Z" fill="#d8d5bd"/><rect x="674" y="72" width="25" height="6" rx="2" fill="#272f33"/>
   <path d="M263 86Q277 109 317 112L351 188M640 117Q600 91 558 109L537 159M683 119L662 245" fill="none" stroke="#151f27" stroke-width="8"/>
   <!-- Engine is mounted front to back. The six plug wells follow that axis. -->
   <path d="M357 107L519 107 539 336 339 336Z" fill="#202a31" stroke="#718087" stroke-width="3"/>
   <path d="M355 115L404 113 399 311 345 314Z M463 113l49 2 19 199-56-3Z" fill="url(#jzMetal)" stroke="#414e55" stroke-width="2"/>
   <path d="M408 115h51l12 196h-65Z" fill="#222b31" stroke="#58636a"/>
   ${Array.from({length:6},(_,i)=>`<ellipse cx="436" cy="${133+i*29}" rx="15" ry="10" fill="#151d24" stroke="#45535b"/><path d="M442 ${133+i*29}l31 3" stroke="#101a22" stroke-width="5"/>${bolt(359-i*1.3,132+i*30)}${bolt(505+i*2,132+i*30)}`).join('')}
   <text transform="translate(377 284) rotate(-90)" fill="#424c51" font-family="Arial" font-size="13" letter-spacing="2">TOYOTA</text><text transform="translate(493 288) rotate(-90)" fill="#414b51" font-family="Arial" font-size="11" letter-spacing="1.5">TWIN CAM 24 VALVE</text>
   <circle cx="373" cy="153" r="14" fill="#212b31" stroke="#a3acae"/><path d="M362 151h22M369 144h9" stroke="#9ca7a9" stroke-width="2"/>
   <!-- Six cast intake runners join a single plenum at the left. -->
   ${Array.from({length:6},(_,i)=>`<path d="M350 ${125+i*29}C315 ${119+i*29} 319 ${107+i*29} 286 ${119+i*29}" stroke="#222f36" stroke-width="18" fill="none"/><path d="M350 ${122+i*29}C315 ${116+i*29} 319 ${104+i*29} 286 ${116+i*29}" stroke="url(#jzMetal)" stroke-width="13" fill="none"/>`).join('')}
   <path d="M267 101Q252 99 250 120L248 279Q248 300 281 299L305 284 302 113Z" fill="url(#jzCast)" stroke="#9ca6a7" stroke-width="2"/><path d="M259 125v151" stroke="#b0b9b7" stroke-width="1"/><path d="M267 296L270 337 332 361" stroke="#151f27" stroke-width="29" fill="none"/><path d="M269 299L274 330 335 352" stroke="#54646d" stroke-width="18" fill="none"/>
   <!-- Both sequential turbos sit on the exhaust side, beneath heat shields. -->
   ${[167,250].map((y,i)=>`<g><path d="M520 ${y-21}q27-13 43 1l15 29-49 19Z" fill="#796e5c" stroke="#a49b86"/><path d="M538 ${y-24}Q592 ${y-42} 624 ${y-16}L628 ${y+22}Q585 ${y+38} 540 ${y+18}Z" fill="url(#jzCast)" stroke="#a0a7a5"/><ellipse cx="592" cy="${y}" rx="31" ry="28" fill="url(#jzMetal)" stroke="#4e6068" stroke-width="2"/><circle cx="592" cy="${y}" r="15" fill="#1a2932"/>${Array.from({length:8},(_,n)=>`<path d="M592 ${y}l${Math.cos(n*Math.PI/4)*13} ${Math.sin(n*Math.PI/4)*13} -7 2Z" fill="#727f85"/>`).join('')}<path d="M613 ${y+18}l36 13" fill="none" stroke="#6d7b80" stroke-width="13"/>${bolt(551,y-16)}${bolt(620,y+13)}</g>`).join('')}
   <path d="M646 193Q696 193 683 278L629 331Q608 348 580 348" fill="none" stroke="#1c252e" stroke-width="24"/><path d="M646 190Q688 194 675 274L621 326" fill="none" stroke="#5d696e" stroke-width="13"/>
   <path d="M345 314Q434 299 531 314L537 365Q432 386 338 365Z" fill="#202a31" stroke="#58666d" stroke-width="2"/><path d="M359 321v37M368 317v43M377 316v43M486 317v43M496 318v41M506 320v37" stroke="#414e55" stroke-width="2"/><text x="435" y="341" fill="#c0c7c8" text-anchor="middle" font-size="10">3000 TWIN CAM 24</text><text x="435" y="356" fill="#8b999e" text-anchor="middle" font-size="9">TWIN TURBO</text>
   <!-- Air cleaner, battery, coolant overflow and radiator are individually drawn. -->
   <path d="M665 283l118 16 14 73-142-12Z" fill="#202a32" stroke="#58646d"/><path d="M671 294l102 15 10 48-116-10Z" fill="url(#jzRibs)"/><path d="M660 319L600 314" stroke="#202d35" stroke-width="25"/>
   <path d="M105 267l109-11 10 99-120 14Z" fill="#1c2932" stroke="#4c5b65"/><path d="M111 271l96-10 6 17-102 10Z" fill="#43525d"/><rect x="123" y="276" width="23" height="14" fill="#a7332c"/><path d="M136 275Q129 238 194 235" fill="none" stroke="#8d3029" stroke-width="6"/><path d="M197 276Q239 251 239 306" fill="none" stroke="#111c25" stroke-width="7"/><path d="M133 307l55-6v27l-55 7Z" fill="#cecbb2"/><text x="160" y="320" fill="#253038" text-anchor="middle" font-size="8">12V BATTERY</text>
   <path d="M209 334l43-3 7 56-48 5Z" fill="#d6d4b8" stroke="#8d998d"/><ellipse cx="231" cy="330" rx="13" ry="7" fill="#293b31"/><path d="M234 339L262 376" stroke="#4a514a" stroke-width="4"/>
   <path d="M272 392Q453 414 654 386L650 416Q449 450 274 425Z" fill="#242e34" stroke="#707d81"/><path d="M285 401Q456 421 639 397" stroke="#829095" stroke-width="6"/><path d="M319 363Q304 394 357 400M537 360Q573 363 584 400" stroke="#17242c" stroke-width="18" fill="none"/><circle cx="576" cy="402" r="10" fill="url(#jzMetal)"/><path d="M570 399h12" stroke="#75482b" stroke-width="4"/>
   ${[[95,106],[816,106],[95,395],[814,396],[294,412],[634,409]].map(([x,y])=>bolt(x,y)).join('')}
  </svg>`;
 }
 function drawSupraDashboard(ctx,w,h,s,app,overview=false){
  // RHD UK/export A80: three pods and a continuous wraparound centre console.
  const u=Math.min(w/1400,h/(overview?520:720)),ox=overview?w*.64:w*.50,oy=overview?85*u:h*.765;
  ctx.save();ctx.translate(ox,oy);ctx.scale(u,u);
  const P=(d,fill,stroke,lw=1)=>{const p=new Path2D(d);ctx.fillStyle=fill;ctx.fill(p);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke(p);}};
  const G=(y0,y1,colors)=>{const g=ctx.createLinearGradient(0,y0,0,y1);colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c));return g;};
  const txt=(t,x,y,size=9,c='#bfc6c5')=>{ctx.fillStyle=c;ctx.font=`${size}px Arial`;ctx.textAlign='center';ctx.fillText(t,x,y);};
  const circle=(x,y,r,f,st)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=f;ctx.fill();if(st){ctx.strokeStyle=st;ctx.lineWidth=1;ctx.stroke();}};
  P('M-900 3Q-528 -28-390-10Q-320-8-265-27Q-235-55-165-55L163-55Q221-49 252-14Q335-6 900 13L900 600H-900Z',G(-55,280,['#3d4245','#272d31','#10171d']),'#151e25',3);
  P('M-900 31Q-577 2-419 21Q-339 23-280 1Q-257-35-177-38L159-38Q212-33 242-3Q255 34 260 117Q250 148 206 155L-152 156Q-235 165-255 217L-341 364-467 349Q-431 245-417 164Q-398 70-368 36Q-569 43-900 56Z',G(-38,350,['#242a2f','#32383b','#161e24']),'#62686a',1.2);
  // Demisters, stitched crash pad, glovebox and turbine-style vent vanes.
  ctx.strokeStyle='#767b7d';ctx.lineWidth=.6;ctx.setLineDash([2.4,3.8]);ctx.stroke(new Path2D('M-890 8Q-530-19-390 2M267 6Q470 2 890 17'));ctx.setLineDash([]);
  for(const x of [-590,330]){P(`M${x} -2h140l12 6H${x-8}Z`,'#0b1219');for(let i=0;i<18;i++){ctx.fillStyle='#3b474d';ctx.fillRect(x+i*7.6,-1,1,4);}}
  function vent(x,y,r=25){circle(x,y,r+3,'#161e25','#6a7377');circle(x,y,r,'#090f16','#3b464e');for(let i=0;i<3;i++){ctx.save();ctx.translate(x,y);ctx.rotate(i*Math.PI*2/3);P('M-3-4L-4-21Q-1-23 2-21L4-4Z','#4b565b','#737d80',.5);ctx.restore();}circle(x,y,5,'#7c878a');circle(x,y,2,'#26353e');}
  vent(-287,73,26);vent(226,73,26);vent(-650,69,29);
  P('M-840 116Q-625 95-448 124L-468 218Q-629 235-840 219Z','#272f34','#444e54');P('M-597 205h53v8h-53Z','#121b21','#5d696f');txt('SRS AIRBAG',-555,142,7,'#626c71');
  function dial(x,y,r,max,value,label,step,red){circle(x,y,r+5,'#10171d','#697176');circle(x,y,r+2,'#353d42');circle(x,y,r,'#0c131a','#7d878a');circle(x,y,r-3,G(y-r,y+r,['#172128','#090f16']));const a0=Math.PI*.76,span=Math.PI*1.48;
   for(let i=0;i<=max/step*5;i++){const major=i%5===0,a=a0+span*i/(max/step*5),r0=r*(major?.73:.82);ctx.strokeStyle=red!=null&&i/(max/step*5)*max>=red?'#d34b42':'#d7ded8';ctx.lineWidth=major?1.4:.65;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r0,y+Math.sin(a)*r0);ctx.lineTo(x+Math.cos(a)*r*.91,y+Math.sin(a)*r*.91);ctx.stroke();if(major)txt(String(Math.round(i/5*step)),x+Math.cos(a)*r*.59,y+Math.sin(a)*r*.59+3,r*.145);}
   txt(label,x,y+r*.36,r*.115);const a=a0+span*Math.max(0,Math.min(1,value/max));ctx.save();ctx.translate(x,y);ctx.rotate(a);P(`M-9-1.8L${r*.83}-.7L${r*.83}1L-9 2.4Z`,'#ec8151');ctx.restore();circle(x,y,5,'#202b32','#566167');ctx.strokeStyle='#dbe6eb20';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r-2,Math.PI,Math.PI*1.72);ctx.stroke();}
  dial(-103,39,53,300,Math.abs(s.speedMps)*3.6,'km/h',20);dial(8,29,58,8,(s.rpm||0)/1000,'x1000 r/min',1,6.8);
  // Combined fuel/water pod, the third instrument, not four invented gauges.
  circle(119,43,48,'#111920','#758086');circle(119,43,44,'#111a21');
  function small(y,f,a,b){for(let i=0;i<7;i++){const x=96+i*7;ctx.strokeStyle='#c8d1ce';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+(i===0||i===6?7:4));ctx.stroke();}txt(a,90,y+5,7);txt(b,146,y+5,7);ctx.strokeStyle='#ed8558';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(119,y+24);ctx.lineTo(96+42*f,y+5);ctx.stroke();circle(119,y+24,3,'#56616a');}
  small(14,s.fuel??.7,'E','F');small(53,Math.max(0,Math.min(1,((s.waterTempC??s.coolantC??88)-40)/100)),'C','H');
  P('M-130 64h55v12h-55Z','#080d12','#3a4449');txt(String(Math.floor(86200+(s.distanceM||0)/1000)).padStart(6,'0'),-102,73,9,'#b8c1a8');
  for(const [x,t,on] of [[-167,'ABS',false],[-133,'BRAKE',s.brake>.2],[-80,'OIL',s.ignition&&(s.rpm||0)<500],[47,'⇧',s.lights],[83,'TRC',s.tractionOff]])txt(t,x,108,6.5,on?'#ed784a':'#444e51');
  // Climate controls, factory cassette head-unit and dashboard clock.
  circle(-220,72,20,'#202b32','#687276');P('M-236 65h32v12h-32Z','#0d171c');txt('10:24',-220,74,7,'#acbfab');
  for(const [y,t,id,on] of [[122,'TEMP','heatBtn',s.heat],[166,'FAN','coolBtn',s.cool]]){circle(-310,y,17,'#17222a','#7c898d');circle(-310,y,12,'#354249');ctx.strokeStyle=on?'#a8c9d2':'#8a969b';ctx.beginPath();ctx.moveTo(-310,y);ctx.lineTo(-305,y-10);ctx.stroke();txt(t,-310,y+27,6);for(let i=0;i<4;i++){P(`M${-280+i*31} ${y-10}h28v16h-28Z`,'#202d35','#617078',.6);txt((y===122?['AUTO','OFF','A/C','↻']:['⇧','↗','⇢','♨'])[i],-266+i*31,y+1,6.5);}}
  P('M-334 207L-176 198-186 264-350 275Z','#151e26','#68777e',1.2);P('M-298 215l96-5-2 18-95 7Z','#a6b49d','#09141b');txt('FM  89.5',-250,227,9,'#243b34');circle(-321,225,8,'#54616a');circle(-321,248,8,'#465760');for(let i=0;i<6;i++){P(`M${-300+i*17} 243h14v9h-14Z`,'#394951');txt(String(i+1),-293+i*17,250,5);}
  P('M-353 285L-189 271-192 302-366 320Z','#151e26','#66757b');txt('TOYOTA',-267,294,10,'#6c7a7f');
  if(overview){
   // Door card, padded armrest, window switches and fabric-backed seats.
   P('M290 38L500 121 510 453 333 414 275 192Z','#202b32','#465760',2);P('M321 183l112 41-8 41-110-29Z','#35444b','#596a71');P('M320 196l64 22v11l-64-22Z','#0d1820','#85939a');for(let i=0;i<2;i++)P(`M${349+i*27} ${279+i*8}l21 7v25l-21-7Z`,'#111b23','#4f616a');
   for(const x of [-670,0]){P(`M${x-115} 328Q${x} 290 ${x+122} 334L${x+148} 515H${x-148}Z`,G(310,520,['#454c4e','#232d34']),'#5e686b',2);P(`M${x-73} 347Q${x} 331 ${x+76} 347L${x+84} 510H${x-87}Z`,'#323e43','#6d7676');for(let i=0;i<8;i++){ctx.strokeStyle='#566268';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(x-78,365+i*18);ctx.lineTo(x+78,365+i*18);ctx.stroke();}}
   P('M-371 328L-191 312-155 508-409 509Z','#252f36','#586970',2);P('M-315 369L-247 367-228 441-335 445Z','#111c23','#6d787b');for(let i=0;i<6;i++){ctx.strokeStyle='#4e5b60';ctx.beginPath();ctx.moveTo(-281,387);ctx.lineTo(-327+i*18,439);ctx.stroke();}P('M-287 387v-26h14v26Z','#7f8a8f');circle(-280,352,19,'#1c262d','#889397');txt('1 3 5',-280,349,7);txt('2 4 6',-280,360,7);P('M-216 446l-20-84q-3-13 10-15 12 0 13 14l17 82Z','#161f26','#4a5a61',2);
  }
  // Original early-A80 four-spoke leather wheel, broad Toyota airbag pad.
  const wy=overview?214:164,R=130;ctx.save();ctx.translate(0,wy);ctx.rotate((s.steer||0)*.62);
  ctx.shadowColor='#0009';ctx.shadowBlur=8;ctx.shadowOffsetY=5;ctx.strokeStyle='#080f15';ctx.lineWidth=24;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle=G(-130,130,['#50595c','#17232c','#36434b']);ctx.lineWidth=17;ctx.stroke();ctx.strokeStyle='#748084';ctx.lineWidth=.65;ctx.setLineDash([2,3]);ctx.beginPath();ctx.arc(0,0,123,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  P('M-120-29L-53-19-42 32-75 85-91 78-60 24-124-6Z M120-29L53-19 42 32 75 85 91 78 60 24 124-6Z','#344149','#657278',1);
  P('M-72-39Q0-60 72-39L67 32Q53 68 0 73Q-53 68-67 32Z',G(-50,74,['#525e63','#2e3a42','#1a2832']),'#647379',1.2);P('M-59-3Q0 3 59-3','transparent','#7b888c',.7);
  ctx.strokeStyle='#879397';ctx.lineWidth=1.8;ctx.beginPath();ctx.ellipse(0,-5,17,12,0,0,Math.PI*2);ctx.ellipse(0,-5,5,12,0,0,Math.PI*2);ctx.ellipse(0,-10,13,5,0,0,Math.PI*2);ctx.stroke();txt('SRS AIRBAG',0,42,6,'#8a969b');ctx.restore();
  // Column stalks and ignition remain at the period locations.
  P('M-128 121l-48-6-2 10 49 11Z','#18252e','#56666d');txt('LIGHTS',-158,122,5.5);P('M129 120l47-8 2 11-49 13Z','#18252e','#596b73');txt('WIPER',159,122,5.5);circle(151,167,11,'#09141c','#829198');ctx.strokeStyle='#a9b7bc';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(151,162);ctx.lineTo(156,172);ctx.stroke();txt('IGNITION',151,189,5.5);
  ctx.restore();app.supraDashboard={topY:oy-55*u,fasciaY:oy,style:'A80-1993-RHD',overview};
 }
 function install(app,key,svg,engineSvg,draw){
  const target=app.el.exteriorArt;target.innerHTML=svg;
  for(const id of ['doorArt','quadExhaustArt','bcBody','rearWingArt','frontFlapArt'])app.el[id]=target.querySelector('#'+id);
  if(key!=='supra')return;
  const replaceText=(oldText,newText)=>{const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;while(node=walk.nextNode())if(node.parentElement.tagName!=='SCRIPT'&&node.nodeValue.includes(oldText))node.nodeValue=node.nodeValue.replace(oldText,newText);};
  replaceText('Exterior — GR Aero','Exterior — A80 Turbo');
  replaceText('Renaissance Red over black double-bubble roof, GR accents, integrated ducktail spoiler','Renaissance Red, curved A80 body, projector headlamps and factory hoop rear spoiler');
  replaceText('Digital GR instrument cluster with the central tachometer · 8.8-inch Supra Command touchscreen','A80 wraparound cockpit · three analogue instrument pods · factory four-spoke wheel and cassette stereo');
  const style=document.createElement('style');style.textContent='#engineBay{height:auto;min-height:240px;aspect-ratio:900/480;background:#101a24}#engineBay>.a80-engine{position:absolute;inset:0;width:100%;height:100%}#engineBay>.cover{z-index:2}#a80Cockpit{display:block;width:100%;aspect-ratio:1400/520}';document.head.appendChild(style);
  const bay=app.el.engineBay;for(const el of [...bay.children])if(!['engineCover','turboL','turboR'].includes(el.id))el.style.display='none';bay.insertAdjacentHTML('afterbegin',engineSvg.replace('<svg ','<svg class="a80-engine" '));
  const cabin=app.el.cabinArt;for(const el of [...cabin.children])el.style.display='none';const canvas=document.createElement('canvas');canvas.id='a80Cockpit';canvas.setAttribute('aria-label','Toyota Supra A80 right-hand-drive interior with live analogue instruments and four-spoke steering wheel');cabin.appendChild(canvas);
  const ui=app.updateUi;app.updateUi=function(...args){ui.apply(app,args);if(!document.body.classList.contains('view-cockpit'))return;const w=canvas.clientWidth||1000,h=w*520/1400,dpr=Math.min(2,devicePixelRatio);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#101922';ctx.fillRect(0,0,w,h);draw(ctx,w,h,app.state,app,true);};
  // Buttons remain in the original 1.0 control panels. These optional, labelled
  // cockpit shortcuts call those same controls and never create new vehicle logic.
  const actions=[['Ignition','startSwitchBtn'],['Cabin lights','ambientBtn'],['Cooling','coolBtn'],['Heating','heatBtn'],['Wipers','wipersBtn'],['Horn','hornBtn']];
  const bar=document.createElement('div');bar.className='control-grid';for(const [name,id] of actions){if(!document.getElementById(id))continue;const b=document.createElement('button');b.textContent=name;b.setAttribute('aria-label','Supra cockpit '+name);b.onclick=()=>document.getElementById(id).click();bar.appendChild(b);}cabin.appendChild(bar);
 }
 root.MUCSRoadArt={exterior:root.MUCSProfileArt.exterior,engine,drawSupraDashboard,install};
})(typeof window==='undefined'?globalThis:window);
