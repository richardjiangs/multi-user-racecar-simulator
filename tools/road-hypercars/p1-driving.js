  function drawCabinFrame(w,h,pal){
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    rhCarbon(`M0 0H${w*.12}L${w*.066} ${h*.63} 0 ${h*.72}Z`,[0,0,w*.12,h*.72]);
    rhCarbon(`M${w} 0H${w*.88}L${w*.934} ${h*.65} ${w} ${h*.72}Z`,[w*.88,0,w*.12,h*.72]);
    rhLeather(`M0 ${dashY+16}Q${w*.29} ${dashY-10} ${w*.48} ${dashY}L${w*.59} ${dashY+20}Q${w*.8} ${dashY-14} ${w} ${dashY+15}V${h}H0Z`,[0,dashY-15,w,h-dashY+15]);
    rhStitch(`M0 ${dashY+26}Q${w*.29} ${dashY} ${w*.48} ${dashY+10}L${w*.59} ${dashY+30}Q${w*.8} ${dashY-4} ${w} ${dashY+25}`,'#b28456');
    rhCarbon(`M0 ${dashY+84}Q${w*.3} ${dashY+67} ${w*.46} ${dashY+91}L${w*.59} ${dashY+104}Q${w*.8} ${dashY+57} ${w} ${dashY+79}V${h}H0Z`,[0,dashY+57,w,h-dashY-57]);
    ctx.fillStyle='#0b1217';ctx.fillRect(0,0,w,h*.026);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+43*s);ctx.scale(s,s);
    rhLeather('M-177 53L-185-13Q-156-69-92-67H92Q159-65 187-13L175 53Z',[-186,-70,374,124],'#5b656a');
    rhStitch('M-174 43L-176-12Q-148-58-90-57H91Q150-55 177-12L164 43Z','#ae8050');
    rhScreen('M-164 36L-166-14-86-47V39ZM-78-48H80V42H-78ZM88-47L169-14 157 36H88Z');
    // P1's rising digital rev arc spans the central display, with side status pages.
    for(let i=0;i<=45;i++){
      const x=-65+i*2.9,y=3-Math.sin(i/45*Math.PI)*37;
      rhPath(`M${x} ${y}l0-${i%5===0?7:4}`,null,i/45<state.rpm/SPEC.redlineRpm?(i>40?'#e66544':'#e2a157'):'#415058',i%5===0?1.4:.65);
      if(i%5===0)rhText(x,y-10,i/5,5.5,'#aeb4a9');
    }
    rhText(0,16,state.gearMode==='G'?state.curGear:state.gearMode,29,'#f3f0dd');rhText(0,35,Math.round(Math.abs(app.kmh(state.speedMps))),16);rhText(31,35,'km/h',6);
    rhText(-125,-18,'WATER',5.5,'#9fb2bd');rhText(-125,-2,Math.round(state.waterTempC)+'°C',13);rhPath('M-148 7H-102',null,'#334651',.6);
    rhText(-125,18,'BOOST',5.5,'#8fa4af');rhText(-125,31,(state.boostBar||0).toFixed(1)+' bar',9);
    rhText(124,-14,'ENGINE',5.5,'#8fa4af');rhText(124,2,Math.round(state.rpm),14);rhText(124,12,'rpm',5,'#8198a4');rhPath('M102 18h42',null,'#2b424d',.7);
    rhText(124,30,state.driveMode.toUpperCase(),6,'#d49a53');
    rhPath('M-172 51H170',null,'#091015',4);
    rhVent(-244,14,29);rhVent(223,-4,24);
    // Slender IRIS stack, start switch above, machined Handling/Powertrain dials below.
    rhCarbon('M280-51Q298-64 318-33L377 218 290 219 267-16Z',[266,-64,112,286],'#778891');
    rhPath('M279-33L297 213M315-31L369 211',null,'#94a0a5',.8);
    rhKnob(302,-17,13,'START');rhScreen('M286 17L322 17 350 139 301 147Z');rhText(308,30,'IRIS',6.5,'#c7d6da');
    rhPath('M293 35l31-1m-26 20 29-2m-26 21 30-2m-25 23 30-3m-27 25 33-4',null,'#364d59',.7);
    rhText(310,48,'MEDIA',6);rhPath('M307 59v9m0-7 9-2v7',null,'#b3c6ce',1.1);rhCircle(305,69,1.8,'#b3c6ce');rhCircle(314,67,1.8,'#b3c6ce');
    rhText(322,86,'CLIMATE',5);rhText(326,102,state.cool?'A/C ON':'A/C OFF',7);rhText(330,126,'22.0°',8,'#a1c1cb');
    rhKnob(322,180,16,'H');rhKnob(365,173,16,'P');rhText(320,205,'HANDLING',4.5,'#aabac3');rhText(367,198,'POWERTRAIN',4.5,'#aabac3');
    rhScrew(279,-25);rhScrew(323,6);rhScrew(306,211);rhScrew(370,211);
    ctx.font='italic 12px Arial';ctx.fillStyle='#b6c1c4';ctx.textAlign='center';ctx.fillText('McLaren',480,43);rhText(498,59,'P1',13,'#d29b4f');
    rhPath('M374 76Q486 96 600 68',null,'#0a1014',2);rhStitch('M376 84Q486 104 600 76','#82664c',.6);ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhPaddles(-114,114);
    rhRim('M0-127C70-127 127-70 127 0S70 127 0 127-127 70-127 0-70-127 0-127Z','#313335','#928b79');
    rhCarbon('M-120-11L-45-28H45L120-11 119 12 39 27 22 110H-22L-39 27-119 12Z',[-120,-30,240,142],'#77868c');
    rhPath('M-114-5L-42-17M114-5L42-17M-20 103H20',null,'#acb7b9',.8);
    rhLeather('M-46-28Q0-53 46-28L50 11Q34 49 0 52Q-34 49-50 11Z',[-52,-43,104,98],'#48545c');
    rhCircle(0,0,30,rhGradient(-30,-30,60,60,[[0,'#4a5b64'],[.5,'#17252d'],[1,'#0b151d']]),'#a4b2b9',1);
    rhPath('M-19 8Q-5-17 21-12Q12 2 2 3Q7-3 10-7Q-4-5-19 8','#d8e2e7');
    rhCircle(-90,-5,15,'#8d9eaa','#102430',1);rhCircle(-90,-5,12,rhGradient(-100,-15,24,24,[[0,state.velocity?'#8cd1ff':'#4c9dcc'],[1,'#075581']]));rhText(-90,-2,'DRS',6.5);
    rhCircle(90,-5,15,'#96959a','#36202c',1);rhCircle(90,-5,12,rhGradient(78,-17,24,24,[[0,'#e15c68'],[1,'#8d1028']]));rhText(90,-2,'IPAS',6.5);
    rhText(0,37,'AIRBAG',4.5,'#637b85');rhScrew(-32,47);rhScrew(32,47);rhScrew(0,100);ctx.restore();
  }
