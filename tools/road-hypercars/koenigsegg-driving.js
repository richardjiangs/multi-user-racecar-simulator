  function drawCabinFrame(w,h,pal){
    const sway=Number.isFinite(state.bodyRoll)?state.bodyRoll*1.4:0,dashY=rhLayout(w,h).dashY+sway*.2;
    rhCarbon(`M0 0H${w*.095}L${w*.068} ${h*.67} 0 ${h*.74}Z`,[0,0,w*.1,h*.74]);
    rhCarbon(`M${w} 0H${w*.905}L${w*.935} ${h*.67} ${w} ${h*.74}Z`,[w*.9,0,w*.1,h*.74]);
    rhLeather(`M0 ${dashY}L${w*.3} ${dashY+12} ${w*.5} ${dashY-2} ${w*.72} ${dashY+14} ${w} ${dashY}V${h}H0Z`,[0,dashY-2,w,h-dashY+2]);
    rhCarbon(`M0 ${dashY+56}Q${w*.26} ${dashY+40} ${w*.48} ${dashY+60}L${w*.7} ${dashY+84} ${w} ${dashY+52}V${h}H0Z`,[0,dashY+40,w,h-dashY-40]);
    rhStitch(`M0 ${dashY+10}L${w*.3} ${dashY+22} ${w*.5} ${dashY+8} ${w*.72} ${dashY+24} ${w} ${dashY+10}`,'#98866a');
    ctx.fillStyle='#10181c';ctx.fillRect(0,0,w,h*.025);drawCluster(w,h,dashY,sway);drawWheel(w,h);
  }
  function drawCluster(w,h,dashY,sway){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2+sway,dashY+27*s);ctx.scale(s,s);
    // A clean dash in front of the driver: the instruments belong to the SmartWheel.
    rhPath('M-175 0Q0-12 158 1',null,'#465458',1);rhStitch('M-175 7Q0-5 158 8','#6b6654',.6);
    // Twin adjusters sit in a perforated capsule above SmartCenter.
    rhMetal('M207-25Q248-47 291-24L296 13Q248 39 204 13Z',[203,-46,95,84]);
    rhPath('M214-19Q248-38 284-19L288 9Q248 27 213 9Z','#050c11','#53636b',1);
    for(let x=218;x<=282;x+=6)for(let y=-15;y<=12;y+=6){if(Math.abs(x-250)<28&&Math.abs(y)<16)rhCircle(x,y,1.45,'#47575e');}
    rhKnob(230,-1,7,'');rhKnob(271,-1,7,'');
    rhMetal('M204 37L300 35 336 235 215 235Z',[204,35,135,200]);
    rhCarbon('M211 43L295 40 329 227 221 227Z',[211,40,122,190],'#182c36');
    rhScreen('M217 50L288 48 310 168 225 174Z');
    rhText(253,64,'KOENIGSEGG',6.5,'#a8b4b9');rhPath('M224 71l66-2',null,'#263944',.7);
    rhPath('M244 86Q254 78 269 86L279 126Q263 137 243 127Z','#3c5157','#9cbbbe',1);
    rhPath('M248 91L267 90 273 105 245 106ZM248 119l26-1-1 9-24 1Z','#101e26','#617d89',.8);
    rhPath('M239 94l-3 23m45-21 5 24M247 131l-2 7m30-8 4 7',null,'#839b9e',1.2);
    rhText(239,150,'22°',10);rhText(280,150,state.cool?'A/C':'OFF',7,'#b0c9bb');rhPath('M229 155l71-3',null,'#344955',.6);
    rhKnob(274,207,17,'START');rhText(274,217,'STOP',4,'#8faaa9');
    rhMetal('M335 123Q345 113 353 126L349 152 341 155Z',[333,113,22,43]);rhPath('M345 146l8 50',null,'#53656d',5);rhText(349,178,'N',6,'#d0d9d3');
    rhStitch('M355 57Q453 34 557 49','#8a856e');ctx.font='italic 18px Georgia';ctx.fillStyle='#c4c9bd';ctx.fillText('Jesko',441,68);
    rhText(441,83,state.absolut?'ABSOLUT':'ATTACK',5.5,'#8a9b94');
    rhMetal('M-341-5L-269-15-244 26-328 36Z',[-341,-15,100,55]);rhPath('M-333 0L-277-8-258 21-324 28Z','#0b151c');
    for(let i=0;i<5;i++)rhPath(`M${-329+i*4} ${i*5}l54-8`,null,'#667c84',1.4);
    ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale,angle=state.steer*.9;
    // SmartCluster is on the rim, so its screen sits just above the low foreground wheel.
    ctx.save();ctx.translate(w/2+state.shake.x*.3,rhLayout(w,h).wheelY-55*s);ctx.scale(s,s);ctx.rotate(angle);
    rhPaddles(-121,121);
    rhRim('M-95-93Q-81-124 0-125Q81-124 95-93L125-22Q133 37 81 94Q0 118-81 94Q-133 37-125-22Z','#273033','#a19571');
    rhCarbon('M-59-119Q0-128 59-119L58-34H-58Z',[-60,-127,120,94],'#879396');
    rhScreen('M-53-116H53V-38H-53Z');
    ctx.save();ctx.translate(0,-77);ctx.rotate(-angle);
    rhCircle(0,0,31,'#07141d','#567480',1);rhArc(0,0,28,Math.PI*.83,Math.PI*2.2,'#2d4a58',2);
    rhArc(0,0,28,Math.PI*.83,Math.PI*(.83+1.37*clamp(state.rpm/SPEC.redlineRpm,0,1)),'#c9d581',2.5);
    for(let i=0;i<9;i++){const a=Math.PI*(.83+i*.17);rhPath(`M${Math.cos(a)*32} ${Math.sin(a)*32}L${Math.cos(a)*35} ${Math.sin(a)*35}`,null,'#7196a0',.7);}
    rhText(0,-16,state.gearMode==='G'?state.curGear:state.gearMode,12,'#cddd9d');rhText(0,5,Math.round(Math.abs(app.kmh(state.speedMps))),22);rhText(0,15,'km/h',5.5,'#83a2b0');rhText(0,28,Math.round(state.rpm),6.5,'#c0d1c0');
    rhText(-41,2,Math.round(state.waterTempC)+'°',5,'#8ba0a4');rhText(41,2,'OIL',4,'#8ba0a4');rhText(41,9,Math.round(state.oilTempC),5,'#adc2be');ctx.restore();
    rhCarbon('M-121-15L-40-8H40L121-15 114 26 43 27 28 82H-28L-43 27-114 26Z',[-122,-17,244,102]);
    rhScreen('M-111-8H-64V18H-111ZM64-8H111V18H64Z');
    rhPath('M-102 4h8m-7-5 5 3m-6 8 6-2M-85 1v9m-5-4h10M79 1l-5 4h5l4 5V-3Z',null,'#b8cdd2',1);
    rhArc(85,3,5,-.8,.8,'#a3bfc6',1);rhArc(85,3,9,-.7,.7,'#718f99',.6);
    rhCircle(0,0,53,rhGradient(-50,-50,100,100,[[0,'#d2dada'],[.45,'#727f85'],[1,'#aab8ba']]));
    rhCircle(0,0,49,'#1a252b','#080e13',1);rhCircle(0,0,46,null,'#54646d',.5);
    rhPath('M-16-24Q0-31 16-24L14 10 0 26-14 10Z','#385047','#9ea88b',.9);
    ctx.save();ctx.clip(new Path2D('M-16-24Q0-31 16-24L14 10 0 26-14 10Z'));for(let y=-27;y<24;y+=7)for(let x=-18;x<18;x+=6)rhPath(`M${x} ${y}l6 3-6 3-6-3Z`,((x/6+y/7)|0)%2?'#a0a38a':'#374d41');ctx.restore();
    rhText(0,38,'AIRBAG',4.5,'#61767a');rhScrew(-38,32);rhScrew(38,32);rhText(0,94,'Koenigsegg',8,'#c4cabc');ctx.restore();
  }
