  function drawCabinFrame(w,h,pal){
    nxPillars(w,h,.075);const d=rhLayout(w,h).dashY;
    rhCarbon(`M0 ${d+18}Q${w*.22} ${d-12} ${w*.48} ${d+14}Q${w*.7} ${d-12} ${w} ${d+23}V${h}H0Z`,[0,d-12,w,h-d+12]);
    rhSurface(`M0 ${d+27}Q${w*.2} ${d-2} ${w*.35} ${d+22}L${w*.34} ${d+54}Q${w*.18} ${d+28} 0 ${d+65}ZM${w*.68} ${d+20}Q${w*.83} ${d+3} ${w} ${d+31}V${d+72}Q${w*.82} ${d+40} ${w*.68} ${d+55}Z`,'leather',[0,d,w,80],[[0,'#3c5465'],[.4,'#263c4d'],[1,'#142835']],'#6f8791');
    rhStitch(`M0 ${d+35}Q${w*.2} ${d+8} ${w*.34} ${d+30}M${w*.69} ${d+29}Q${w*.83} ${d+14} ${w} ${d+40}`,'#94a7a8');drawCluster(w,h,d);drawWheel(w,h);
  }
  function drawCluster(w,h,d){const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,d+44*s);ctx.scale(s,s);
    rhCarbon('M-166 54Q-190-35-139-55Q0-89 139-55Q190-35 166 54L116 73H-116Z',[-176,-68,352,144],'#abbcc0');rhMetal('M-168 46Q-179-34-136-50Q0-81 136-50Q179-34 168 46L156 46Q167-26 131-40Q0-69-131-40Q-167-26-156 46Z',[-179,-78,358,132]);
    tcDial(-84,-1,54,'RPM × 1000',8,state.rpm/1000);tcDial(84,-1,54,'km/h',400,nxSpeed());
    rhMetal('M-17-44Q0-51 17-44L25 56H-25Z',[-25,-49,50,106]);rhScreen('M-13-36H13V25H-13Z');rhText(0,-5,nxGear(),24);rhText(0,17,nxSpeed(),8);rhText(0,43,'BC',8,'#192e38');
    tcDial(-53,65,20,'OIL',150,state.oilTempC);tcDial(53,65,20,'H₂O',150,state.waterTempC);
    [-143,-121,-99,99,121,143].forEach(x=>rhScrew(x,-54+Math.abs(x)*.12));rhVent(-251,41,26);rhVent(558,49,27);
    // Freestanding paired turbines and milled oval console rails.
    rhPath('M253 7Q240-52 273-50M377 7Q390-52 357-50',null,'#b2c2c5',7);rhVent(274,-42,27);rhVent(358,-42,27);
    rhMetal('M254 7Q315-11 377 7L392 203Q315 235 238 203Z',[236,-9,158,242]);rhCarbon('M263 19Q315 3 368 19L380 194Q315 220 251 194Z',[250,10,130,210]);
    for(let i=0;i<6;i++)tcSwitch(266+i*20,34,['IGN','LAMP','CAB','LIFT','AIR','VOL'][i],i===0?state.ignition:i===1?state.lights:false);
    rhScreen('M269 65H363V126H266Z');rhText(315,87,'HUAYRA BC',10,'#d7d8bc');rhText(315,106,(state.boostBar||0).toFixed(1)+' bar',12,'#b2cbd2');rhKnob(278,154,15,'TEMP');rhKnob(354,154,15,'FAN');rhKnob(315,158,12,'MODE');
    rhMetal('M264 230L299 217 370 245 372 306 340 333 266 307Z',[264,216,112,120]);rhPath('M280 240L300 233 355 251 355 300 336 316 281 299Z','#09151c','#5b707c',1.5);rhPath('M282 246L349 302M283 289L348 251',null,'#c4d0ce',3.5);rhPath('M317 292L330 218',null,'#c6d4d2',7);rhCircle(330,216,13,rhGradient(320,203,25,28,[[0,'#e4e9e0'],[.5,'#718895'],[1,'#c2d3d5']]));[[268,234],[367,249],[270,305],[339,330]].forEach(([x,y])=>rhScrew(x,y));
    ctx.font='italic 15px Georgia';ctx.fillStyle='#b6c8ca';ctx.fillText('Huayra BC',472,104);ctx.restore();
  }
  function drawWheel(w,h){const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,tcWheelPosition(w,h));ctx.scale(s,s);ctx.rotate(state.steer*.9);rhPaddles(-134,134);tcThinWheel(121);
    rhMetal('M-116-35Q-67-29-42-43H42Q67-29 116-35L115 0 45 25 24 110H-24L-45 25-115 0Z',[-116,-44,232,155]);rhCarbon('M-111-31L-43-38H43L111-31 109-4 39 22 20 103H-20L-39 22-109-4Z',[-111,-40,222,145]);
    rhSurface('M-44-43Q0-62 44-43L52 15Q41 54 0 65Q-41 54-52 15Z','leather',[-52,-57,104,122],[[0,'#3f5b70'],[.5,'#20384c'],[1,'#172d3f']],'#8a9ba1');rhCircle(0,0,26,'#11232e','#b7c6c8',1.5);rhText(0,3,'PAGANI',8,'#d8d8c6');rhKnob(-78,-8,11,'VOL');rhKnob(78,-8,11,'DATA');rhKnob(-73,66,15,'START');rhKnob(73,66,18,'MODE','#db9885');rhScrew(-35,36);rhScrew(35,36);rhScrew(0,88);ctx.restore();
  }
