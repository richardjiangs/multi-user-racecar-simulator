  function drawCabinFrame(w,h,pal){
    nxPillars(w,h,.08);const d=rhLayout(w,h).dashY;
    const fascia=`M0 ${d+21}Q${w*.25} ${d-8} ${w*.5} ${d+13}Q${w*.75} ${d-8} ${w} ${d+21}V${h}H0Z`;
    rhSurface(fascia,'leather',[0,d-8,w,h-d+8],[[0,'#b8b5a8'],[.3,'#969d94'],[1,'#3f4d50']],'#c4ccc5');
    rhStitch(`M0 ${d+31}Q${w*.25} ${d+3} ${w*.5} ${d+23}Q${w*.75} ${d+3} ${w} ${d+31}`,'#e2ddc6');
    drawCluster(w,h,d);drawWheel(w,h);
  }
  function drawCluster(w,h,d){const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,d+43*s);ctx.scale(s,s);
    rhLeather('M-408 24Q-250-57-100-33Q0-60 100-33Q250-57 408 24L402 92Q213 22 94 61H-94Q-213 22-402 92Z',[-408,-49,816,145],'#79888a');
    rhScreen('M-369 17Q-236-34-112-25L-105 43Q-243 18-369 65Z');rhScreen('M112-25Q236-34 369 17V65Q243 18 105 43Z');rhScreen('M-86-31Q0-48 86-31V57H-86Z');
    nxRev(-72,-22,144,28,'#c8d9ce');rhText(0,16,nxSpeed(),32);rhText(0,28,'km/h',6);rhText(-62,47,Math.round(state.rpm),8);rhText(60,44,nxGear(),18,'#ebd289');
    rhText(-246,2,'McLaren',15,'#b4c7cd');rhText(-245,22,state.velocity?'VELOCITY':'VEHICLE',8,'#b7d0d6');rhText(-246,38,state.driveMode.toUpperCase(),6,'#728f9e');
    rhText(231,0,'COMFORT',7,'#819dab');rhText(231,26,(state.cabinSetpoint??22)+'°',21,'#c2d7df');rhText(231,43,state.cool?'A/C ON':'A/C OFF',6,'#a6babf');
    rhVent(-405,51,21);rhVent(405,51,21);rhPath('M-411 112Q-237 65-120 92M120 92Q237 65 411 112',null,'#657979',2);ctx.restore();
    // The real selector and Velocity controls are overhead, not on a floor tunnel.
    ctx.save();ctx.translate(w/2,0);ctx.scale(s,s);rhCarbon('M-102 0H102L85 44H-85Z',[-102,0,204,44]);['D','N','R'].forEach((v,i)=>nxButton(-59+i*27,18,9,v));nxButton(36,19,10,'START','#b97363');nxButton(68,19,11,'V','#6495b7');ctx.restore();
  }
  function drawWheel(w,h){const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,tcWheelPosition(w,h));ctx.scale(s,s);ctx.rotate(state.steer*.9);rhPaddles(-131,131);
    rhRim('M-81-99Q0-141 81-99C137-50 137 39 87 100H-87C-137 39-137-50-81-99Z','#242d32','#788686');
    rhCarbon('M-115-27L-41-16H41L115-27 112 8 41 23 23 94H-23L-41 23-112 8Z',[-116,-28,232,124]);rhLeather('M-41-33Q0-50 41-33L47 20Q0 55-47 20Z',[-47,-47,94,95],'#819194');rhPath('M-28 4Q12-20 31-8L18 5Q13-5-28 4Z','#b4c8ce');rhScrew(-80,-10);rhScrew(80,-10);rhScrew(0,77);ctx.restore();
  }
