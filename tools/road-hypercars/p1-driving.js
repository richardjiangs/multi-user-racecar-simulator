  function drawCabinFrame(w,h,pal) {
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0, dashY=rhLayout(w,h).dashY+sway*.2;
    ctx.fillStyle=pal.night?'#080c10':'#242b30';
    rhPath(`M0 0H${w*.12}L${w*.066} ${h*.63} 0 ${h*.72}Z`,ctx.fillStyle);
    rhPath(`M${w} 0H${w*.88}L${w*.934} ${h*.65} ${w} ${h*.72}Z`,ctx.fillStyle);
    const g=ctx.createLinearGradient(0,dashY,0,h);g.addColorStop(0,'#3a3e40');g.addColorStop(.2,'#182129');g.addColorStop(1,'#090d12');
    rhPath(`M0 ${dashY+16}Q${w*.29} ${dashY-10} ${w*.48} ${dashY}L${w*.59} ${dashY+20}Q${w*.8} ${dashY-14} ${w} ${dashY+15}V${h}H0Z`,g);
    ctx.fillRect(0,0,w,h*.026);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+28*s);ctx.scale(s,s);
    rhPath('M-176 52L-180-15Q-153-69-91-65H92Q158-64 183-15L170 52Z','#252d34','#69757e',2);
    rhScreen('M-165 38L-167-14-85-48V42ZM-78-48H81V43H-78ZM89-48L170-14 157 39H89Z');
    rhPath('M-65 3Q0-79 69 3',null,'#d98f36',3);
    for(let i=0;i<=9;i++)rhText(-67+i*15,-8-Math.sin(i/9*Math.PI)*25,i,7,'#e9c992');
    rhText(0,13,state.gearMode==='G'?state.curGear:state.gearMode,29);rhText(0,36,Math.round(Math.abs(app.kmh(state.speedMps))),17);rhText(32,36,'km/h',7);
    rhText(-125,-14,'WATER',7,'#a9bcc9');rhText(-125,3,Math.round(state.waterTempC)+'°C',14);rhText(-126,27,(state.boostBar||0).toFixed(1)+' bar',10);
    rhText(124,-10,'RPM',7);rhText(124,8,Math.round(state.rpm),16);rhText(124,29,state.driveMode.toUpperCase(),7,'#efb065');
    rhVent(-243,14,30);rhVent(223,-4,24);
    rhPath('M280-51Q298-63 318-33L377 218 290 219 267-16Z','#343f47','#858e94',2);
    rhCircle(302,-17,14,'#c4cecf');rhCircle(302,-17,10,'#28353d');rhText(302,-14,'START',5);
    rhScreen('M286 17L322 17 350 139 301 147Z');rhText(311,40,'IRIS',10);rhText(318,68,'MEDIA',8);rhText(326,98,state.cool?'A/C ON':'A/C OFF',8);
    rhCircle(322,180,16,'#111b22','#a7b5bc',3);rhCircle(365,173,16,'#111b22','#a7b5bc',3);rhText(322,183,'H',11);rhText(365,176,'P',11);ctx.restore();
  }
  function drawWheel(w,h) {
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhCircle(0,0,127,null,'#070a0d',28);rhCircle(0,0,127,null,'#31393e',21);
    rhPath('M-120-11L-45-28H45L120-11 119 12 39 27 22 110H-22L-39 27-119 12Z','#38444d','#717f87',1.4);
    rhCircle(0,0,53,'#252e35');rhCircle(0,0,29,'#101c23','#9cabb4',1.8);
    rhPath('M-19 8Q-5-17 21-12Q12 2 2 3Q7-3 10-7Q-4-5-19 8','#d8e2e7');
    rhCircle(-90,-5,14,state.velocity?'#589fff':'#1767a0','#9dabb2',1);rhText(-90,-2,'DRS',7);rhCircle(90,-5,14,'#b7263c','#bc8492');rhText(90,-2,'IPAS',7);ctx.restore();
  }
