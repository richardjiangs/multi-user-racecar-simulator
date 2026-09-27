  function drawCabinFrame(w,h,pal) {
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0, dashY=rhLayout(w,h).dashY+sway*.2;
    ctx.fillStyle=pal.night?'#090e13':'#222b30';
    rhPath(`M0 0H${w*.095}L${w*.068} ${h*.67} 0 ${h*.74}Z`,ctx.fillStyle);
    rhPath(`M${w} 0H${w*.905}L${w*.935} ${h*.67} ${w} ${h*.74}Z`,ctx.fillStyle);
    const g=ctx.createLinearGradient(0,dashY,0,h);g.addColorStop(0,'#343e40');g.addColorStop(.25,'#151e24');g.addColorStop(1,'#080e13');
    rhPath(`M0 ${dashY}L${w*.3} ${dashY+12} ${w*.5} ${dashY-2} ${w*.72} ${dashY+14} ${w} ${dashY}V${h}H0Z`,g);
    ctx.fillRect(0,0,w,h*.025);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+27*s);ctx.scale(s,s);
    // Jesko has no conventional instrument binnacle: the SmartCluster is on the wheel.
    rhPath('M208-24Q248-47 291-24L294 13Q247 35 206 13Z','#aeb7b9');rhPath('M215-20Q248-38 284-20L287 8Q249 22 214 8Z','#080f16');
    for(let x=219;x<282;x+=9)for(let y=-15;y<10;y+=8)rhCircle(x,y,2.5,'#45545b');rhCircle(229,-3,6,'#bbc3c1');rhCircle(271,-3,6,'#bbc3c1');
    rhPath('M205 37L300 35 332 228 215 228Z','#8c979a');rhScreen('M215 48L290 47 309 164 224 171Z');
    rhText(253,68,'SmartCenter',10);rhPath('M246 82q10-7 21 0l9 43q-15 11-31 0Z','#394e51','#bdd499');rhText(264,151,state.cool?'A/C ON':'A/C OFF',9,'#b1d09b');
    rhCircle(274,207,17,'#1c292f','#c5cecb',2);rhText(274,210,'START',6);rhText(438,67,'Jesko',18,'#bfc6be');ctx.restore();
  }
  function drawWheel(w,h) {
    const s=rhLayout(w,h).scale,angle=state.steer*.9;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(angle);
    rhRim('M-95-93Q-81-124 0-125Q81-124 95-93L125-22Q133 37 81 94Q0 118-81 94Q-133 37-125-22Z','#2b3437');
    rhScreen('M-53-117H53V-38H-53Z');ctx.save();ctx.translate(0,-78);ctx.rotate(-angle);
    rhCircle(0,0,30,'#101d28','#758e9b');rhCircle(0,0,24,null,'#445e6e',3);rhText(0,-17,state.gearMode==='G'?state.curGear:state.gearMode,13,'#d9edce');rhText(0,4,Math.round(Math.abs(app.kmh(state.speedMps))),21);rhText(0,14,'km/h',6);rhText(0,28,Math.round(state.rpm),7,'#c5dfba');
    ctx.fillStyle='#b3d95e';ctx.fillRect(-37,-37,74*clamp(state.rpm/SPEC.redlineRpm,0,1),3);ctx.restore();
    rhPath('M-121-15L-40-8H40L121-15 114 26 43 27 28 82H-28L-43 27-114 26Z','#343e46','#737f82',1);
    rhPath('M-110-7H-62V17H-110ZM62-7H110V17H62Z','#09121a','#577079',1);rhText(-86,10,'LIGHTS',6);rhText(86,10,'AUDIO',6);
    rhCircle(0,0,53,'#a8b4b6');rhCircle(0,0,49,'#202b30');rhPath('M-17-24Q0-33 17-24L15 12 0 28-15 12Z','#273d36','#637d70',1.5);
    rhPath('M0-27v50M-12-18L12-8-12 1 12 10-8 17',null,'#59745c',1.3);rhText(0,97,'Koenigsegg',10,'#bad196');ctx.restore();
  }
