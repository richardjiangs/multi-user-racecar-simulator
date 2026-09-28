  function drawCabinFrame(w,h,pal){
    nxPillars(w,h,.10);const d=rhLayout(w,h).dashY;
    rhCarbon(`M0 ${d+17}Q${w*.23} ${d-1} ${w*.47} ${d+9}Q${w*.78} ${d-11} ${w} ${d+21}V${h}H0Z`,[0,d-11,w,h-d+11]);
    rhLeather(`M${w*.12} ${d+17}Q${w*.32} ${d-6} ${w*.43} ${d+13}L${w*.43} ${d+36}Q${w*.31} ${d+18} ${w*.12} ${d+40}Z`,[w*.12,d-6,w*.32,48]);
    rhStitch(`M${w*.12} ${d+22}Q${w*.32} ${d-1} ${w*.43} ${d+18}`,'#94957c');
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
