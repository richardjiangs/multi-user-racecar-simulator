  function drawCabinFrame(w,h,pal){
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    rhLeather(`M0 0H${w*.1}L${w*.063} ${h*.65} 0 ${h*.71}Z`,[0,0,w*.1,h*.72]);
    rhLeather(`M${w} 0H${w*.9}L${w*.953} ${h*.65} ${w} ${h*.72}Z`,[w*.9,0,w*.1,h*.72]);
    const fascia=`M0 ${dashY+17}Q${w*.24} ${dashY-14} ${w*.49} ${dashY}Q${w*.78} ${dashY-9} ${w} ${dashY+10}V${h}H0Z`;
    rhLeather(fascia,[0,dashY-14,w,h-dashY+14]);
    rhStitch(`M0 ${dashY+25}Q${w*.24} ${dashY-6} ${w*.49} ${dashY+8}Q${w*.78} ${dashY-1} ${w} ${dashY+18}`,'#ab713e');
    rhStitch(`M0 ${dashY+29}Q${w*.24} ${dashY-2} ${w*.49} ${dashY+12}Q${w*.78} ${dashY+3} ${w} ${dashY+22}`,'#654c39',.55);
    ctx.fillStyle='#10151a';ctx.fillRect(0,0,w,h*.026);
    drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+45*s);ctx.scale(s,s);
    // Separate stitched hood, rolled inner edge, analog dial and two inset displays.
    const hood='M-179 62L-192 3Q-189-61-112-70H105Q182-65 191 1L173 64Z';
    rhLeather(hood,[-193,-72,386,138],'#515a5d');
    rhStitch('M-173 51L-181 0Q-175-56-109-60H106Q168-55 180 2L162 54Z','#bd8b56',.75);
    rhPath('M-166 45L-172 0Q-165-49-102-51H102Q159-48 169 3L152 47Z','#02070b','#1d303b',2);
    rhScreen('M-156 34L-160-5Q-151-32-101-39L-64-29V39H-152Z');
    rhScreen('M64-29L103-40Q149-34 157-5L148 37H64Z');
    rhCircle(0,-4,61,'#11191c','#8d9698',1.3);rhCircle(0,-4,58,'#040a0e','#414f53',1);rhCircle(0,-4,53,null,'#b6c4c6',.5);
    rhTicks(0,-4,51,500,4,Math.abs(app.kmh(state.speedMps))/500);
    rhText(0,-23,'BUGATTI',5.5,'#788e97');rhText(0,27,Math.round(Math.abs(app.kmh(state.speedMps))),17,'#f1f4f0');rhText(0,38,'km/h',6.5,'#91a7b2');
    const power=Math.round(app.engineTorque(state.rpm)*state.rpm*Math.PI/30*state.throttle/735.5);
    rhText(-113,-15,'POWER',6.5,'#869da8');rhText(-113,6,power,19,'#e8f0f2');rhText(-113,17,'PS',6,'#91a5af');
    rhPath('M-145 23H-83',null,'#2d424e',1);rhPath(`M-145 23h${62*clamp(power/1600,0,1)}`,null,'#c17f3b',2);
    rhText(-113,34,(state.boostBar||0).toFixed(1)+' bar',6.5,'#b4c5cb');
    rhText(104,-7,state.gearMode==='G'?state.curGear:state.gearMode,26,'#e1ecee');rhText(104,10,Math.round(state.rpm),11);rhText(127,10,'rpm',5,'#89a2af');
    rhPath('M78 20H140',null,'#29414d',1);rhText(109,32,state.driveMode.toUpperCase(),6,'#bcb8a3');
    rhCircle(-41,48,1.8,state.lights?'#82bc88':'#263532');rhText(-29,50,'LIGHT',4.5,'#849998','left');
    rhCircle(21,48,1.8,state.speedKey?'#edb75b':'#3a322b');rhText(28,50,'TOP SPEED',4.5,'#8f9a9e','left');
    // Four separate machined dials travel down the narrow C-shaped spine.
    rhPath('M235-65Q217-22 240 29Q265 92 294 218',null,'#080d11',14);
    rhPath('M235-65Q217-22 240 29Q265 92 294 218',null,rhGradient(220,-70,90,290,[[0,'#d2d5ce'],[.21,'#788990'],[.6,'#d5d6ce'],[1,'#404f59']]),8);
    rhPath('M234-65Q216-22 239 29Q264 92 293 218',null,'#f2dfc2',.65);
    rhLeather('M258-20L280-20 329 211 294 211Z',[257,-23,75,237],'#4d606a');
    [0,45,88,129].forEach((y,i)=>rhKnob(273+i*9,y,17,[(state.cabinSetpoint??22)+'°','FAN '+(state.cabinFanLevel??2),(state.cabinClimateAuto??true)?'AUTO':'MAN',state.cool?'A/C ON':'A/C'][i]));
    rhVent(-259,35,25);ctx.save();ctx.translate(217,-1);ctx.scale(.58,1);rhVent(0,0,22);ctx.restore();
    rhPath('M-294 84Q-263 97-216 76M351 83Q465 105 592 82',null,'#060b0e',3);
    rhStitch('M356 95Q469 114 587 93','#8e613c');
    ctx.font='italic 12px Georgia';ctx.textAlign='center';ctx.fillStyle='#d89854';ctx.fillText('Super Sport',443,56);rhText(443,70,'3 0 0 +',7,'#ac783f');
    ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhPaddles();
    rhRim('M-82-99Q0-147 82-99C148-40 141 42 79 100H-79C-141 42-148-40-82-99Z','#282b2c','#a87542');
    rhPath('M0-134v24',null,'#cd762d',6);rhPath('M-2-134v23',null,'#f0b66a',.8);
    rhMetal('M-119-18L-45-6H45L119-18 118 10 41 27 21 95H-21L-41 27-118 10Z',[-120,-20,240,120]);
    rhCarbon('M-113-13L-54-2-56 15-113 2ZM113-13L54-2 56 15 113 2Z',[-114,-14,228,30]);
    rhLeather('M-44-45Q0-64 44-45L53-5Q50 42 0 50Q-50 42-53-5Z',[-54,-55,108,106],'#4b575c');
    rhStitch('M-37-40Q0-55 37-40L45-4Q41 33 0 42Q-41 33-45-4Z','#555d5d',.55);
    // Interlocking EB monogram, engraved into the padded centre boss.
    rhPath('M-22-13H-4V12H-22M-20-1H-4M2-13V12H11Q25 12 24 5Q24-1 14-1Q23-1 22-8Q22-13 12-13Z',null,'#c3cdce',2.4);
    rhText(0,29,'AIRBAG',4.5,'#4c5b63');rhKnob(-74,49,18,'MODE');rhKnob(74,49,18,'START');
    rhText(74,59,'STOP',4,'#b7c6ca');rhPath('M-98-7h22m-18-5v10M77-8h20m-10-5v10',null,'#9eafb7',1);
    rhScrew(-40,28);rhScrew(40,28);ctx.restore();
  }
