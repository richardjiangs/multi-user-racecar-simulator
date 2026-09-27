  function drawCabinFrame(w,h,pal){
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    rhCarbon(`M0 0H${w*.095}L${w*.063} ${h*.65} 0 ${h*.73}Z`,[0,0,w*.1,h*.73]);
    rhCarbon(`M${w} 0H${w*.89}L${w*.95} ${h*.63} ${w} ${h*.73}Z`,[w*.89,0,w*.11,h*.73]);
    rhCarbon(`M0 ${dashY+10}L${w*.3} ${dashY-9} ${w*.54} ${dashY-5} ${w*.66} ${dashY+26} ${w} ${dashY+3}V${h}H0Z`,[0,dashY-10,w,h-dashY+10]);
    rhLeather(`M0 ${dashY+60}L${w*.3} ${dashY+39} ${w*.52} ${dashY+51} ${w*.62} ${h}H0Z`,[0,dashY+40,w*.62,h-dashY-40]);
    rhPath(`M0 ${dashY+70}L${w*.12} ${dashY+65} ${w*.10} ${h}H0Z`,rhGradient(0,dashY,w*.12,h-dashY,[[0,'#7f1729'],[.4,'#b02a36'],[1,'#300e1b']]));
    rhStitch(`M${w*.006} ${dashY+80}L${w*.11} ${dashY+76} ${w*.093} ${h}`,'#df7676');
    rhPath(`M${w*.69} ${dashY+65}L${w*.95} ${dashY+38}`,null,'#4e606d',.8);
    ctx.fillStyle='#0c1319';ctx.fillRect(0,0,w,h*.023);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+40*s);ctx.scale(s,s);
    rhCarbon('M-174 53L-164-58 153-65 185-29 173 52Z',[-176,-66,363,120],'#6d7f88');
    rhPath('M-168 47L-159-51 150-57 177-26 166 46Z','#030a10','#9aa3a4',.6);
    rhScreen('M-158 39L-151-44 146-51 167-24 158 37Z');
    const rev=clamp(state.rpm/SPEC.redlineRpm,0,1);
    for(let i=0;i<36;i++){ctx.fillStyle=i<rev*36?(i>29?'#fb5f4b':'#e2ebef'):'#263741';ctx.fillRect(-142+i*8.25,-35-i*.15,6,7);}
    for(let i=1;i<=9;i++)rhText(-132+(i-1)*34,-43,i,4.8,'#718d9c');
    rhText(-82,4,'SPEED',5.5,'#7796a8');rhText(-81,27,Math.round(Math.abs(app.kmh(state.speedMps))),24,'#eef1e6');rhText(-49,25,'km/h',6,'#839fae');
    rhPath('M-35-18v48M45-18v48',null,'#273e4d',.6);rhText(8,23,state.gearMode==='G'?state.curGear:state.gearMode,39);
    rhText(104,-8,'ENGINE',5,'#6f91a5');rhText(104,7,Math.round(state.rpm),13);rhText(104,22,state.driveMode.toUpperCase(),6,'#e3cd76');
    rhText(106,33,Math.round(state.waterTempC)+'°C',5.5,'#9cb5be');
    // Driver-side trapezoid vent, central double vane and passenger slot.
    rhCarbon('M-280-29L-229-62-198-46-221 38-293 58Z',[-295,-63,99,123],'#82949d');
    rhPath('M-273-22L-231-50-210-40-229 29-282 45Z','#060d12','#3f5969',.8);
    for(let i=0;i<7;i++){rhPath(`M${-269-i*.8} ${-14+i*7}l${47-i*3}-${17-i*.7}`,null,'#627a87',1.5);rhPath(`M${-269-i*.8} ${-15+i*7}l${47-i*3}-${17-i*.7}`,null,'#a5b2b8',.45);}
    rhPath('M-252-2l-6 21',null,'#aab9be',3);
    rhCarbon('M225-34L269-13 301 47 239 37Z',[224,-35,78,83],'#788c96');rhPath('M234-23L265-6 286 34 246 25Z','#071018');
    for(let i=0;i<5;i++)rhPath(`M${237+i*2} ${-17+i*9}l${27+i*2} ${12+i*1.5}`,null,'#7a8f9a',1.2);
    // Narrow bridge console, set apart from the passenger's low carbon fascia.
    rhCarbon('M257 70L314 58 405 242 302 242Z',[256,58,151,185],'#8798a1');
    rhMetal('M267 77L310 68 346 141 294 154Z',[266,67,82,88]);rhScreen('M275 83L305 77 335 135 300 145Z');
    rhText(303,103,'CLIMATE',4.5);rhText(311,119,'22°',10,'#c0d3dc');rhText(318,132,state.cool?'A/C':'OFF',5.5);
    rhMetal('M315 172L350 163 377 217 336 228Z',[314,162,65,68]);
    rhPath('M325 183L352 175M333 175L348 215M345 170L361 209',null,'#13232d',4);
    rhPath('M324 181l10-2 5 8-10 2ZM347 194l10-3 5 8-10 3Z','#8899a1','#e5e8df',.6);
    rhText(327,174,'R',4,'#0a1822');rhText(358,182,'A',4,'#0a1822');rhText(361,216,'M',4,'#0a1822');
    rhScrew(305,74);rhScrew(335,214);rhScrew(372,216);
    rhPath('M348 9L551 4 594 59 382 76Z','#131d24','#364a56',.6);rhStitch('M351 16L548 11 581 52','#687275',.55);
    rhText(474,47,'F80',12,'#cad5d9');ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhPaddles(-126,126);
    rhRim('M-76-114H76Q104-111 116-69L125 17Q120 73 83 101H-83Q-120 73-125 17L-116-69Q-104-111-76-114Z','#262c31','#657078');
    rhCarbon('M-77-123H77L81-103H-81Z',[-82,-124,164,22],'#687980');
    rhCarbon('M-115-9L-43-29H43L115-9 108 42 45 42 20 82H-20L-45 42-108 42Z',[-116,-30,232,114]);
    rhLeather('M-53-22Q-34-47 0-46Q34-47 53-22L46 21Q0 66-46 21Z',[-54,-47,108,114],'#3f505c');
    rhCircle(0,0,25,'#e8c840','#141d24',2);rhCircle(0,0,22,null,'#867b36',.55);
    rhPath('M-4 17L-1 8-9 2-8-4-5-9-6-15-1-11 2-15 0-19 5-18 8-13 7-7 3-5 1 1 6 7 3 14 7 17 3 18 0 12-2 18ZM-8-3L-13-8-11-13-9-10-10-8-5-5M5 6L12 12 11 15 8 11 3 9','#192428');
    // Physical F80 spoke buttons, not the capacitive Ferrari wheel used elsewhere.
    for(const [x,y,label] of [[-83,-5,'LIGHT'],[-84,20,'AUDIO'],[82,-5,'HUD'],[83,20,'LIFT']]){
      rhPath(`M${x-17} ${y-7}h34v15h-34Z`,'#142530','#6a808c',.6);rhText(x,y+3,label,5.5,'#b6d0d9');
    }
    rhCircle(71,58,18,'#080f14','#718791',1);rhCircle(71,58,14,rhGradient(59,44,24,28,[[0,'#e16b65'],[1,'#721524']]));
    rhPath('M71 46l4 10-3 8',null,'#dde4e0',2);rhText(71,84,'MANETTINO',4.5,'#8aa6b1');
    rhPath('M-20 65H20V78H-20Z','#10222b','#425d6d',.6);rhText(0,71,'ENGINE',4,'#e5786e');rhText(0,77,'START STOP',4.5,'#e5786e');
    for(let i=0;i<9;i++){rhCircle(-40+i*10,-114,2.9,'#080e12');rhCircle(-40+i*10,-114,2,state.ignition&&state.rpm/SPEC.redlineRpm>.6+i*.045?(i<6?'#efd978':'#f84b4b'):'#3c4140');}
    rhScrew(-38,38);rhScrew(38,38);rhText(0,41,'AIRBAG',4,'#718893');ctx.restore();
  }
