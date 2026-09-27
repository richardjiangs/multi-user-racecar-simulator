  function drawCabinFrame(w,h,pal) {
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    ctx.fillStyle=pal.night?'#070c11':'#1e2831';
    rhPath(`M0 0H${w*.095}L${w*.063} ${h*.65} 0 ${h*.73}Z`,ctx.fillStyle);
    rhPath(`M${w} 0H${w*.89}L${w*.95} ${h*.63} ${w} ${h*.73}Z`,ctx.fillStyle);
    const g=ctx.createLinearGradient(0,dashY,0,h);g.addColorStop(0,'#343e45');g.addColorStop(.25,'#121c25');g.addColorStop(1,'#080f15');
    rhPath(`M0 ${dashY+10}L${w*.3} ${dashY-9} ${w*.54} ${dashY-5} ${w*.66} ${dashY+26} ${w} ${dashY+3}V${h}H0Z`,g);
    ctx.fillRect(0,0,w,h*.023);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+19*s);ctx.scale(s,s);
    rhPath('M-172 50L-164-56 153-63 183-28 170 48Z','#141e26','#737f87',2);rhScreen('M-158 39L-151-44 146-51 167-24 158 37Z');
    const rev=clamp(state.rpm/SPEC.redlineRpm,0,1);for(let i=0;i<35;i++){ctx.fillStyle=i<rev*35?(i>29?'#fa4945':'#e0e9ee'):'#2e3c47';ctx.fillRect(-141+i*8.3,-35-i*.16,6,9);}
    rhText(-65,13,Math.round(Math.abs(app.kmh(state.speedMps))),28);rhText(-65,29,'km/h',8);rhText(15,19,state.gearMode==='G'?state.curGear:state.gearMode,37);
    rhText(103,-6,'RPM',7,'#9aafbc');rhText(103,11,Math.round(state.rpm),13);rhText(103,28,state.driveMode.toUpperCase(),8,'#e8d67e');
    rhPath('M-280-29L-229-62-201-47-221 37-292 58Z','#07121a','#9daab3',2);for(let i=0;i<6;i++)rhPath(`M-273 ${-17+i*10}l${54-i*4}-${20-i}`,null,'#65747e',2);
    rhPath('M225-34L269-13 301 47 239 37Z','#07121a','#8196a0',2);
    rhPath('M257 70L314 58 405 242 302 242Z','#303f4a','#a0adb4',2);rhScreen('M275 81L308 73 338 132 299 142Z');rhText(307,113,'A/C',9);rhPath('M315 172L350 163 376 215 336 225Z','#a7b1b8');rhPath('M329 182l23-6m-20-2 16 37m-3-41 16 36',null,'#12202b',4);ctx.restore();
  }
  function drawWheel(w,h) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhRim('M-76-114H76Q104-111 116-69L125 17Q120 73 83 101H-83Q-120 73-125 17L-116-69Q-104-111-76-114Z','#28353d');
    rhPath('M-115-9L-43-29H43L115-9 108 42 45 42 20 82H-20L-45 42-108 42Z','#253541','#566b76',1.4);
    ctx.fillStyle='#2b353d';ctx.beginPath();ctx.ellipse(0,0,57,47,0,0,Math.PI*2);ctx.fill();rhCircle(0,0,25,'#edcf35','#12212a',2);
    rhPath('M-3 16L0 6-8 0-6-12-1-7 4-13 1-20 7-16 9-8 2-4 5 7 2 15M-2 8l-9 1M6 4l6 9',null,'#14222a',2.5);
    rhText(-84,2,'LIGHT',7);rhText(-84,25,'AUDIO',6);rhText(84,2,'HUD',7);rhText(84,25,'LIFT',7);rhCircle(70,58,16,'#b32636','#8799a1');rhText(70,61,'MODE',6);rhText(0,75,'START STOP',7,'#e3474a');
    for(let i=0;i<9;i++){ctx.fillStyle=state.ignition&&state.rpm/SPEC.redlineRpm>.6+i*.045?(i<6?'#efd978':'#f84b4b'):'#3c4140';ctx.fillRect(-41+i*10,-118,7,5);}ctx.restore();
  }
