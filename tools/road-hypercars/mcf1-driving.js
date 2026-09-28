  function drawCabinFrame(w,h,pal){
    nxPillars(w,h,.08);const d=rhLayout(w,h).dashY;
    rhLeather(`M0 ${d+8}Q${w*.19} ${d-12} ${w*.34} ${d+8}Q${w*.5} ${d-35} ${w*.66} ${d+8}Q${w*.81} ${d-12} ${w} ${d+8}V${h}H0Z`,[0,d-35,w,h-d+35]);
    rhPath(`M0 ${d+52}Q${w*.22} ${d+23} ${w*.36} ${d+62}L${w*.36} ${d+87}Q${w*.20} ${d+52} 0 ${d+90}ZM${w*.64} ${d+62}Q${w*.78} ${d+23} ${w} ${d+52}V${d+90}Q${w*.8} ${d+52} ${w*.64} ${d+87}Z`,rhGradient(0,d,0,160,[[0,'#9c704a'],[.55,'#755238'],[1,'#322d2b']]),'#8d765c');
    rhStitch(`M0 ${d+16}Q${w*.22} ${d-7} ${w*.34} ${d+17}M${w*.66} ${d+17}Q${w*.78} ${d-7} ${w} ${d+16}`,'#b39975');drawCluster(w,h,d);drawWheel(w,h);
  }
  function drawCluster(w,h,d){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,d+44*s);ctx.scale(s,s);
    rhCarbon('M-204 38Q-208-24-167-34L-134-37Q-104-73 0-75Q104-73 134-37L167-34Q208-24 204 38L196 58H-196Z',[-207,-75,414,135]);
    rhPath('M-137-37Q-109-81 0-83Q109-81 137-37',null,'#928371',10);rhStitch('M-137-38Q-109-80 0-81Q109-80 137-38','#c0b396');
    rhCircle(0,-13,55,'#d7dcd2','#1b2930',3);rhTicks(0,-13,49,8,1,state.rpm/8000,'#263942');rhText(0,8,'rpm × 1000',6,'#314750');rhText(0,25,'F1',14,'#3f5156');
    rhCircle(98,5,41,'#d7dcd2','#1b2930',3);rhTicks(98,5,36,400,1,nxSpeed()/400,'#263942');rhText(98,26,'km/h',6,'#314750');
    rhCircle(-98,5,41,'#d7dcd2','#1b2930',3);
    [[-113,-5,'OIL',.42],[-83,-5,'WATER',clamp((state.waterTempC-40)/100,0,1)],[-98,17,'FUEL',.65]].forEach(([x,y,l,f])=>{rhArc(x,y,13,-Math.PI,0,'#334853',.7);for(let i=0;i<=4;i++){const a=-Math.PI+i*Math.PI/4;rhPath(`M${x+Math.cos(a)*13} ${y+Math.sin(a)*13}l${-Math.cos(a)*3} ${-Math.sin(a)*3}`,null,'#253d49',.6);}const a=-Math.PI+Math.PI*f;rhPath(`M${x} ${y}l${Math.cos(a)*10} ${Math.sin(a)*10}`,null,'#c07140',1);rhText(x,y+8,l,4.5,'#283e47');});
    rhPath('M-140 44h99v18h-99ZM41 44h99v18H41Z','#a1b56b','#354c33',1);rhText(-131,55,nxSpeed()+' km/h',6,'#293b25','left');rhText(48,55,Math.round(state.rpm)+'  '+nxGear(),6,'#293b25','left');
    rhKnob(-170,-5,11,'LIGHT');rhKnob(-170,27,10,'A/C');rhKnob(170,-5,11,'IGN');rhKnob(170,27,10,'DOOR');
    nxVent(-310,60,86);nxVent(224,60,86);rhCircle(-48,36,2,state.ignition?'#a13425':'#312d26');rhCircle(48,36,2,state.ignition?'#a13425':'#312d26');
    rhCarbon('M191 167L226 164 287 333H232Z',[191,164,97,173]);rhMetal('M246 248h9v-76h-9Z',[244,171,13,80]);rhCircle(250,170,17,'#29383f','#8ba0a7',1);rhPath('M242 169h16M245 161v17M255 161v17',null,'#a7bac2',1);rhText(262,280,'6 SPEED',6,'#809da8');ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);
    rhRim('M0-124A124 124 0 1 1-.01-124Z','#303434','#8c8a78');
    rhLeather('M-116-21L-48-18Q0-44 48-18L116-21 114 12 44 16 20 116H-20L-44 16-114 12Z',[-117,-31,234,149],'#53646b');
    rhCircle(0,0,47,'#13222b','#8fa0a8',1.5);ctx.save();ctx.beginPath();ctx.arc(0,0,44,0,Math.PI*2);ctx.clip();ctx.fillStyle=rhTexture('carbon');ctx.fillRect(-45,-45,90,90);ctx.restore();
    rhPath('M-23-16H4L0-6H-17L-19 0H-4L-7 9H-23ZM11-16H24L10 16H1Z',null,'#b8c8cc',1.6);rhText(0,29,'V12',11,'#b5c9cd');rhScrew(-37,0);rhScrew(37,0);rhText(0,94,'NARDI',6,'#7d9098');ctx.restore();
  }
