  function drawCabinFrame(w,h,pal){
    nxPillars(w,h);const d=rhLayout(w,h).dashY;
    // Cream padded shoulders frame the exposed carbon driver recess; no continuous display shelf.
    rhCarbon(`M0 ${d+19}L${w*.29} ${d+5}Q${w*.49} ${d+52} ${w*.62} ${d+20}L${w} ${d+12}V${h}H0Z`,[0,d,w,h-d]);
    const shoulder=`M0 ${d+10}Q${w*.19} ${d-5} ${w*.34} ${d+15}L${w*.32} ${d+58}Q${w*.17} ${d+30} 0 ${d+46}ZM${w*.65} ${d+14}Q${w*.83} ${d-10} ${w} ${d+12}V${d+68}Q${w*.81} ${d+34} ${w*.65} ${d+49}Z`;
    rhSurface(shoulder,'leather',[0,d-10,w,83],[[0,'#b7b5a8'],[.4,'#92988f'],[1,'#505e5c']],'#c2c9bf');
    rhStitch(`M0 ${d+17}Q${w*.19} ${d+3} ${w*.33} ${d+23}M${w*.66} ${d+23}Q${w*.83} ${d-1} ${w} ${d+20}`,'#e3dfc9');
    drawCluster(w,h,d);drawWheel(w,h);
  }
  function drawCluster(w,h,d){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,d+38*s);ctx.scale(s,s);
    rhCarbon('M-133-66H133V56H-133Z',[-133,-66,266,122],'#647882');rhScreen('M-123-55H123V46H-123Z');
    rhPath('M-8-66v10M0-66v10M8-66v10',null,'#cbd4cf',5);rhPath('M-8-66v10',null,'#25619a',4);rhPath('M8-66v10',null,'#ad3a3e',4);
    nxRev(-110,-43,220,30);rhText(0,-5,nxGear(),34,'#e6eddf');rhText(-84,17,nxSpeed(),25,'#e5edf2');rhText(-84,30,'km/h',6,'#a0b8c2');rhText(76,14,Math.round(state.rpm),14);rhText(76,26,'rpm',6,'#a0b8c2');
    rhPath('M-111 37H111',null,'#587897',.7);rhText(0,32,state.e85?'F5 MODE':state.driveMode.toUpperCase(),7,'#d1c0a4');
    rhScrew(-127,-60);rhScrew(127,-60);rhScrew(-127,50);rhScrew(127,50);
    rhScreen('M228-49L395-55 405 89 231 91Z');rhText(313,-16,'VENOM F5',15,'#b6c9d0');rhText(313,12,'VEHICLE',6,'#718f9e');
    rhPath('M295 27q18-10 37 0l10 25q-29 12-58 0Z','#293f4c','#8facbb',.8);rhText(311,76,state.e85?'F5 MODE':'SPORT',7,'#abcef0');
    rhCarbon('M234 106L303 105 359 309H251Z',[232,104,128,210],'#92a6ac');rhVent(249,125,12);rhVent(284,125,12);rhKnob(274,177,20,state.cool?'A/C ON':'A/C');
    for(let i=0;i<4;i++){rhMetal(`M${265+i*6} ${215+i*24}h36v16h-36Z`,[264+i*6,214+i*24,39,18]);rhText(283+i*6,226+i*24,['N','R','D','LIFT'][i],6,'#172e3a');}
    nxVent(-330,53,104);nxVent(513,45,103);rhText(477,109,'Hennessey',15,'#c0cac9');ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,Math.max(h*.83,rhLayout(w,h).bottom+35*s));ctx.scale(s,s);ctx.rotate(state.steer*.9);rhPaddles(-135,135);
    const rim='M-117-110L-121-5Q-121 65-77 90Q0 114 77 90Q121 65 121-5L117-110';
    rhPath(rim,null,'#090f14',35);rhPath(rim,null,rhGradient(-120,-110,240,220,[[0,'#aeb3a8'],[.5,'#747f7c'],[1,'#adb5a9']]),26);rhStitch('M-113-106L-111-3Q-111 62-70 80M113-106L111-3Q111 62 70 80','#444f4f');
    rhCarbon('M-106-58Q0-86 106-58L112 30 67 87H-67L-112 30Z',[-114,-77,228,167]);
    rhMetal('M-95-64Q0-80 95-64L90-33Q0-45-90-33Z',[-97,-78,194,47]);rhPath('M-79-61H79V-42H-79Z','#131f29');rhText(0,-48,'Hennessey',12,'#d6ddda');rhText(0,-7,'F5',22,'#8b9ea9');
    rhKnob(-76,17,15,'VOL');rhKnob(76,17,15,'MODE');nxButton(-36,33,8,'LIGHT');nxButton(36,33,8,'HUD');rhPath('M-5 18h10v29H-5Z','#a1bf5d');
    rhPath('M-46 62L37 44 47 65-35 84Z','#d84d30','#e5af79',.7);rhText(0,66,'IGNITION',8,'#f4f2e3');[-90,90].forEach(x=>rhScrew(x,-52));rhScrew(-47,51);rhScrew(47,42);ctx.restore();
  }
