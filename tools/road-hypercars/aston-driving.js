  function drawCabinFrame(w,h,pal){
    nxPillars(w,h,.10);const d=rhLayout(w,h).dashY;
    // Sparse structural tub and separate cowl wings: no conventional dashboard slab or binnacle.
    rhPath(`M0 ${d+75}Q${w*.31} ${d+138} ${w*.48} ${h}H0ZM${w} ${d+75}Q${w*.72} ${d+127} ${w*.6} ${h}H${w}Z`,'#040a10');
    rhCarbon(`M0 ${d+29}Q${w*.18} ${d-7} ${w*.36} ${d+21}L${w*.39} ${d+71}Q${w*.19} ${d+21} 0 ${d+82}ZM${w*.61} ${d+39}Q${w*.82} ${d-12} ${w} ${d+30}V${d+93}Q${w*.80} ${d+43} ${w*.62} ${d+76}Z`,[0,d-12,w,115]);
    rhPath(`M${w*.34} ${d+38}L${w*.43} ${h}M${w*.68} ${d+65}L${w*.62} ${h}`,null,'#253840',7);
    rhStitch(`M0 ${d+38}Q${w*.17} ${d+7} ${w*.35} ${d+32}M${w*.65} ${d+44}Q${w*.84} ${d+5} ${w} ${d+39}`,'#879083');
    drawCluster(w,h,d);drawWheel(w,h);
  }
  function drawCluster(w,h,d){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,d+33*s);ctx.scale(s,s);
    // The main instruments belong to the wheel. This is the separate centre console.
    rhCarbon('M231-47H360L372 60 231 67Z',[230,-48,143,117],'#7f9398');rhScreen('M238-40H353L363 53 238 60Z');
    rhText(298,-23,'VALKYRIE',9,'#b1c5b7');rhPath('M285-8q14-8 28 0l11 30q-23 11-48 0Z','#37555a','#a8b4a4',.7);rhText(299,45,state.amrPro?'AMR PRO':'ROAD + KERS',6,'#b1c46c');nxVent(246,87,112);
    ctx.save();ctx.translate(-261,57);ctx.scale(.58,1);rhVent(0,0,22);ctx.restore();rhPath('M-277 80h28',null,'#93ad3f',3);
    rhCarbon('M204 117L248 110 325 343H218Z',[204,110,122,234],'#647b83');rhPath('M228 154L242 151 252 174 235 182Z','#83969b','#bac6c4',1);
    rhText(260,229,'VALKYRIE',6,'#a6b5ac');nxButton(254,200,8,'LIGHT');nxButton(266,243,8,'A/C');nxButton(278,287,8,'AUDIO');ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,rhLayout(w,h).wheelY-108*s);ctx.scale(s,s);ctx.rotate(state.steer*.9);rhPaddles(-148,148);
    rhRim('M-100-112Q0-136 100-112Q133-100 141-55L138 57Q131 101 94 105Q0 120-94 105Q-131 101-138 57L-141-55Q-133-100-100-112Z','#30393b','#8c9b7e');
    rhCarbon('M-90-108Q0-129 90-108L80 61 50 96H-50L-80 61Z',[-90,-123,180,224],'#91a09c');rhScreen('M-73-94H73L69 40H-69Z');
    nxRev(-63,-83,126,23,'#b4cb7e');rhCircle(0,-25,47,'#09141d','#788c92',.8);rhTicks(0,-25,43,12,1,state.rpm/12000,'#789096');
    rhText(0,-18,nxSpeed(),25,'#e7f1ed');rhText(0,-6,'km/h',6,'#aec7c7');rhText(0,24,nxGear(),18,'#d7e7a3');rhText(0,53,Math.round(state.rpm)+' rpm',7,'#c3d0c6');
    nxButton(-112,-72,8,'LIGHT');nxButton(-112,-36,8,'HUD');nxButton(-112,27,8,'KERS','#adbf6c');nxButton(112,-72,8,'MODE');nxButton(112,-36,8,'HORN');nxButton(112,27,8,'ESC');
    rhMetal('M-25 61H25V78H-25Z',[-25,61,50,17]);rhText(0,68,'START',4.7,'#253b45');rhText(0,75,'STOP',4.5,'#253b45');nxButton(-18,95,8,'N');nxButton(18,95,8,'R');
    rhScrew(-80,-104);rhScrew(80,-104);rhScrew(-70,48);rhScrew(70,48);ctx.restore();
  }
