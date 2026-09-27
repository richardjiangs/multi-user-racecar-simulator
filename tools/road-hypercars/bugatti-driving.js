  function drawCabinFrame(w,h,pal) {
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0, dashY=rhLayout(w,h).dashY+sway*.2;
    ctx.fillStyle=pal.night?'#080b0e':'#1d2227';
    rhPath(`M0 0H${w*.1}L${w*.063} ${h*.65} 0 ${h*.71}Z`,ctx.fillStyle);
    rhPath(`M${w} 0H${w*.9}L${w*.953} ${h*.65} ${w} ${h*.72}Z`,ctx.fillStyle);
    const g=ctx.createLinearGradient(0,dashY,0,h);g.addColorStop(0,'#363537');g.addColorStop(.23,'#151a20');g.addColorStop(1,'#080c10');
    rhPath(`M0 ${dashY+17}Q${w*.24} ${dashY-14} ${w*.49} ${dashY}Q${w*.78} ${dashY-9} ${w} ${dashY+10}V${h}H0Z`,g);
    ctx.fillStyle='#10151a';ctx.fillRect(0,0,w,h*.026);
    drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+27*s);ctx.scale(s,s);
    rhPath('M-174 57L-184-1Q-177-64-107-69H100Q174-65 182-1L164 59Z','#141a20','#585e64',2);
    rhScreen('M-164 46L-170-1Q-162-51-103-54H102Q158-50 166 1L150 47Z');
    rhCircle(0,-4,57,'#080d12','#a8b0b6',2);rhTicks(0,-4,52,500,4,Math.abs(app.kmh(state.speedMps))/500);
    rhText(0,25,Math.round(Math.abs(app.kmh(state.speedMps))),17);rhText(0,38,'km/h',7,'#9faeb6');
    rhText(-113,-10,'POWER',8,'#a5bac7');rhText(-113,13,Math.round(app.engineTorque(state.rpm)*state.rpm*Math.PI/30*state.throttle/735.5),22);rhText(-113,29,'PS',8,'#a4b8c5');
    rhText(109,-5,state.gearMode==='G'?state.curGear:state.gearMode,29);rhText(109,20,Math.round(state.rpm),13);rhText(109,33,'rpm',8,'#a5b3bc');
    rhPath('M235-66Q218-19 240 30Q265 92 294 218',null,'#697279',10);rhPath('M237-66Q220-19 242 30Q267 92 296 218',null,'#b9aea0',1.2);
    rhPath('M257-23L280-23 329 211 294 211Z','#1d252b','#6a7379',2);
    [0,45,88,129].forEach((y,i)=>{rhCircle(273+i*9,y,17,'#afb8bc');rhCircle(273+i*9,y,13,'#111a20');rhText(273+i*9,y+3,[(state.cabinSetpoint??22)+'°','FAN '+(state.cabinFanLevel??2),(state.cabinClimateAuto??true)?'AUTO':'MAN',state.cool?'AC ON':'AC'][i],7);});
    rhText(443,55,'SUPER SPORT 300+',12,'#bd783f');rhVent(-259,35,27);ctx.restore();
  }
  function drawWheel(w,h) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhRim('M-82-99Q0-147 82-99C148-40 141 42 79 100H-79C-141 42-148-40-82-99Z','#333334');
    rhPath('M0-134v24',null,'#d57a29',8);
    rhPath('M-119-18L-45-6H45L119-18 118 10 41 27 21 95H-21L-41 27-118 10Z','#78848b');
    rhPath('M-113-13L-54-2-56 15-113 2ZM113-13L54-2 56 15 113 2Z','#111a20');
    rhPath('M-44-45Q0-64 44-45L53-5Q50 42 0 50Q-50 42-53-5Z','#22292e','#646d73',1.5);
    rhText(0,11,'EB',27,'#bdc8ce');rhCircle(-74,49,18,'#131c23','#adb5bc',2);rhCircle(74,49,18,'#131c23','#adb5bc',2);
    rhText(-74,52,'MODE',7);rhText(74,52,'START',7);ctx.restore();
  }
