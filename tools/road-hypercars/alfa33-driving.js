  function drawCabinFrame(w,h,pal){
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    rhLeather(`M0 0H${w*.07}L${w*.065} ${h*.65} 0 ${h*.72}Z`,[0,0,w*.07,h*.72]);
    rhLeather(`M${w} 0H${w*.93}L${w*.935} ${h*.65} ${w} ${h*.72}Z`,[w*.93,0,w*.07,h*.72]);
    rhLeather(`M0 ${dashY+12}Q${w*.45} ${dashY-12} ${w} ${dashY+12}V${h}H0Z`,[0,dashY-12,w,h-dashY+12]);
    rhStitch(`M${w*.04} ${dashY+23}Q${w*.52} ${dashY+8} ${w*.96} ${dashY+23}`,'#b39a74',.8);
    rhStitch(`M${w*.04} ${dashY+28}Q${w*.52} ${dashY+13} ${w*.96} ${dashY+28}`,'#806e55',.55);
    rhMetal(`M${w*.08} ${dashY+68}Q${w*.52} ${dashY+79} ${w*.92} ${dashY+67}L${w*.96} ${dashY+98}Q${w*.53} ${dashY+126} ${w*.07} ${dashY+108}Z`,[w*.07,dashY+65,w*.9,66],'#767f7c');
    ctx.fillStyle='#0e1417';ctx.fillRect(0,0,w,h*.02);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+49*s);ctx.scale(s,s);
    // Deep telescopic tunnels, polished annular rims and circular digital dials.
    rhLeather('M-168 24Q-178-68-104-68Q-48-73-31-34H31Q48-74 109-66Q181-59 169 29L132 66H-130Z',[-180,-75,362,145],'#65706e');
    rhStitch('M-158 20Q-164-57-103-57Q-53-61-25-27H25Q53-63 107-56Q168-50 159 24','#b9a282',.9);
    rhPath('M-144 36Q-156-44-100-48Q-52-52-39-16H39Q52-53 102-49Q157-46 147 39L125 57H-125Z','#02090d','#51636a',1);
    for(const x of [-94,94]){
      rhCircle(x,0,53,rhGradient(x-50,-50,100,100,[[0,'#d5d9d0'],[.24,'#7c8b8b'],[.53,'#c4cdc8'],[1,'#465c66']]));
      rhCircle(x,0,50,'#07131b','#d0d3c5',1);rhCircle(x,0,47,'#d8d8ca');rhCircle(x,0,33,'#11232c','#a4b3b1',.6);
      rhArc(x,0,49,Math.PI*.72,Math.PI*2.3,'#f2eee0',.7);
    }
    rhTicks(-94,0,44,350,4,Math.abs(app.kmh(state.speedMps))/350,'#283c43','#c5d4d1');
    rhTicks(94,0,44,SPEC.redlineRpm/1000,5,state.rpm/SPEC.redlineRpm,'#283c43','#c5d4d1');
    rhText(-94,-15,'km/h',6,'#becbc9');rhText(94,-15,'×1000',5,'#becbc9');rhText(94,22,Math.round(state.rpm),7,'#b4c7c7');
    rhText(0,-4,Math.round(Math.abs(app.kmh(state.speedMps))),26,'#f2eee0');rhText(0,8,'km/h',5.5,'#a2babd');rhText(0,28,state.gearMode==='G'?state.curGear:state.gearMode,18);
    rhText(0,46,state.pista?'PISTA':'STRADA',5.5,'#d5ba85');rhText(-95,59,Math.round(state.waterTempC)+'°C',5.5,'#94a9ad');rhText(94,59,(state.distanceM/1000).toFixed(1)+' km',5.5,'#94a9ad');
    rhScrew(-146,42);rhScrew(146,42);
    // A low retractable centre display and perforated, tactile aluminum tunnel.
    rhLeather('M203 63L358 58 375 139 210 149Z',[202,58,174,93],'#687e85');rhScreen('M212 71L352 66 366 132 218 139Z');
    rhText(238,84,'MyCar',7);rhText(331,82,'22°',6,'#abc1c5');rhPath('M219 90L356 84',null,'#344d58',.7);
    rhText(289,111,state.pista?'PISTA':'STRADA',11,'#e2caa1');rhText(291,128,state.cool?'CLIMATE ON':'CLIMATE OFF',5.5,'#91aeb8');
    rhMetal('M236 157L355 143 402 263 243 263Z',[235,141,169,125]);
    ctx.save();ctx.clip(new Path2D('M236 157L355 143 402 263 243 263Z'));for(let y=151;y<266;y+=6)for(let x=236;x<401;x+=6)rhCircle(x,y,1.05,'#3d5059');ctx.restore();
    rhKnob(271,181,16,state.pista?'PISTA':'STRADA');
    for(const [x,y,label] of [[317,173,'START'],[353,167,'LIFT'],[329,207,'BELT'],[365,200,'LAMP']]){
      rhCircle(x,y,8,'#0d1b23','#b1c2c8',1);rhPath(`M${x} ${y}l-5-13`,null,'#606f72',5);rhPath(`M${x-1} ${y-1}l-5-13`,null,'#e0e5db',2);rhText(x+2,y+16,label,4.2,'#182a31');
    }
    rhPath('M262 233L288 230 293 250 264 253Z','#15262d','#b9c9cb',1);rhText(278,245,'N',7);
    rhScrew(246,162);rhScrew(355,151);rhScrew(386,253);
    rhSurface('M-324 124Q-311 99-291 115L-215 250H-363Z','leather',[-364,97,151,156],[[0,'#c48e5e'],[.4,'#9f5f34'],[1,'#492a20']],'#845638');
    rhStitch('M-310 122L-243 243','#dbac7d');
    ctx.font='italic 16px Georgia';ctx.textAlign='center';ctx.fillStyle='#c4c8bc';ctx.fillText('33 Stradale',502,64);ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhPaddles(-117,117);
    rhRim('M0-127C70-127 127-70 127 0S70 127 0 127-127 70-127 0-70-127 0-127Z','#303532','#8d8a75');
    const grips='M-96-80Q-149-4-93 85M96-80Q149-4 93 85';
    rhPath(grips,null,rhGradient(-120,-90,240,180,[[0,'#c69361'],[.27,'#a5673e'],[.62,'#744327'],[1,'#bd8553']]),23);
    rhStitch('M-91-78Q-140-4-88 80M91-78Q140-4 88 80','#e0b68c',.85);
    rhMetal('M-125-13H125V14L36 26 22 117H-22L-36 26-125 14Z',[-126,-16,252,135],'#667b84');
    rhPath('M-120-9H120M-21 110H21',null,'#e1e8df',.7);rhCircle(0,65,11,'#07131a','#cbd5cf',1.5);rhCircle(0,97,9,'#07131a','#cbd5cf',1.5);
    rhCircle(0,0,48,rhGradient(-50,-45,100,90,[[0,'#6a7879'],[.4,'#293a3e'],[1,'#15252c']]),'#bdc8c6',1.5);
    rhCircle(0,0,30,'#213338','#aebeb9',1);rhCircle(0,0,26,null,'#697d7b',.6);
    // Monochrome Alfa roundel: Milan cross on the left, crowned Biscione on the right.
    rhPath('M-13-19v37M-24-7H-3',null,'#c6d1c6',3.1);rhPath('M0-23v46',null,'#6f8b86',.6);
    rhPath('M5-18L9-23 12-19 16-23 19-18Z','#b9c8b9');
    rhPath('M6-14Q24-20 21-11Q20-6 11-4Q3-2 6 3Q9 7 21 4Q27 7 20 12Q13 15 10 19M7-14L2-16',null,'#bdcebd',2.5);
    rhText(0,-34,'ALFA ROMEO',4.3,'#cbd6c9');rhText(0,39,'AIRBAG',4,'#728981');rhScrew(-37,24);rhScrew(37,24);
    rhPath('M0-140v23',null,'#bfc7bb',2);ctx.restore();
  }
