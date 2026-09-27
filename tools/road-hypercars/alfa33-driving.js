  function drawCabinFrame(w,h,pal) {
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    ctx.fillStyle=pal.night?'#101310':'#32322d';
    rhPath(`M0 0H${w*.07}L${w*.065} ${h*.65} 0 ${h*.72}Z`,ctx.fillStyle);
    rhPath(`M${w} 0H${w*.93}L${w*.935} ${h*.65} ${w} ${h*.72}Z`,ctx.fillStyle);
    const g=ctx.createLinearGradient(0,dashY,0,h);g.addColorStop(0,'#494a40');g.addColorStop(.28,'#252b2b');g.addColorStop(1,'#0c1114');
    rhPath(`M0 ${dashY+12}Q${w*.45} ${dashY-12} ${w} ${dashY+12}V${h}H0Z`,g);
    rhPath(`M${w*.1} ${dashY+35}Q${w*.53} ${dashY+50} ${w*.93} ${dashY+32}`,null,'#9d7d58',1.5);
    ctx.fillRect(0,0,w,h*.02);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+26*s);ctx.scale(s,s);
    rhPath('M-168 24Q-175-67-100-64Q-45-67-31-34H31Q48-68 107-63Q179-56 166 29L130 64H-130Z','#2a3237','#89918d',3);
    rhScreen('M-139-8Q-107-60-57-13H57Q107-60 140-8L143 44H-143Z');
    rhCircle(-95,0,50,'#c7c7be','#9babae',3);rhCircle(-95,0,32,'#142028');rhTicks(-95,0,46,350,4,Math.abs(app.kmh(state.speedMps))/350,'#1e272b');
    rhCircle(95,0,50,'#c7c7be','#9babae',3);rhCircle(95,0,32,'#142028');rhTicks(95,0,46,8,5,state.rpm/SPEC.redlineRpm,'#1e272b');
    rhText(0,5,Math.round(Math.abs(app.kmh(state.speedMps))),27);rhText(0,18,'km/h',7);rhText(0,39,state.gearMode==='G'?state.curGear:state.gearMode,16);
    rhText(95,23,Math.round(state.rpm),8);rhPath('M205 53L359 49 373 129 213 138Z','#1b2a33','#7f919a',2);rhText(242,74,'MyCar',10);rhText(305,94,state.pista?'PISTA':'STRADA',12,'#eee1cd');rhText(291,117,state.cool?'CLIMATE ON':'CLIMATE OFF',8);
    rhPath('M236 157L355 143 402 263 243 263Z','#9da6a7');rhCircle(271,179,16,'#4e595b','#d6dacf',2);rhText(271,182,'PISTA',6,'#e8e9dc');
    [[317,172],[353,165],[329,204],[365,197]].forEach(([x,y])=>{rhCircle(x,y,8,'#253139');rhPath(`M${x} ${y}l-5-14`,null,'#d5dad7',5);});rhText(503,62,'33 Stradale',17,'#b3b6a6');ctx.restore();
  }
  function drawWheel(w,h) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhCircle(0,0,127,null,'#070d10',28);rhCircle(0,0,127,null,'#3a3f3d',20);rhPath('M-96-80Q-149-4-93 85M96-80Q149-4 93 85',null,'#a26337',23);
    rhPath('M-125-13H125V14L36 26 22 117H-22L-36 26-125 14Z','#a7b5b9','#71858c',1.5);rhCircle(0,65,11,'#081117','#ced8d8');rhCircle(0,97,9,'#081117','#ced8d8');
    rhCircle(0,0,48,'#343f41','#9ba8a5',2);rhCircle(0,0,28,'#263439','#bec7c2');rhPath('M-6-23v44M-23-6H-7M-16-20v38',null,'#abbab5',3);rhPath('M8-19Q26-19 17-10L6-3Q-3 6 13 7Q30 8 13 20',null,'#b8c4bd',4);rhPath('M0-140v23',null,'#c5cbbb',3);ctx.restore();
  }
