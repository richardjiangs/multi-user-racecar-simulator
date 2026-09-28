  function drawCabinFrame(w,h,pal){
    nxPillars(w,h,.085);const d=rhLayout(w,h).dashY;
    rhCarbon(`M0 ${d+9}Q${w*.5} ${d-15} ${w} ${d+13}V${h}H0Z`,[0,d-15,w,h-d+15]);
    rhPath(`M0 ${d+14}Q${w*.25} ${d-5} ${w*.43} ${d+11}L${w*.61} ${d+8}Q${w*.83} ${d-4} ${w} ${d+20}L${w} ${d+63}Q${w*.76} ${d+38} ${w*.57} ${d+51}L${w*.39} ${d+52}Q${w*.2} ${d+32} 0 ${d+52}Z`,rhGradient(0,d,w,h-d,[[0,'#6f7c7e'],[.35,'#3e4a50'],[1,'#14252e']]),'#6e8189',.8);
    drawCluster(w,h,d);drawWheel(w,h);
  }
  function drawCluster(w,h,d){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,d+38*s);ctx.scale(s,s);
    rhMetal('M-146-61H146V58H-146Z',[-146,-61,292,119]);rhScreen('M-143-58H143V55H-143Z');nxRev(-130,-42,260,38);
    rhPath('M-119 34L-65-13H65L119 34',null,'#b26372',1.3);rhPath('M-110 34L-58-6H58L110 34',null,'#325981',1.2);
    rhText(0,17,nxGear(),38,'#f3f1e3');rhText(0,41,nxSpeed(),18,'#c9e7ed');rhText(-99,-9,'OIL TEMP',5,'#809bab');rhText(-99,5,Math.round(state.oilTempC)+'°C',9);rhText(97,-9,'ENGINE',5,'#809bab');rhText(97,5,Math.round(state.rpm),11);rhText(97,18,'rpm',5,'#809bab');rhText(-111,46,'AMG',7,'#a7bbbf');
    rhScreen('M233-48L431-49 438 83 234 90Z');rhText(334,-26,'AMG ONE',12,'#b9d9dc');rhText(334,-7,'ENERGY FLOW',7,'#799fad');
    rhPath('M305 9h51l10 37h-71Z','#294652','#84a1ae',.8);rhPath('M331 11v31M310 28h44',null,'#54b49d',2);rhText(334,70,'HYBRID',7,'#92cbbb');
    nxVent(-341,49,99);nxVent(260,109,146);nxVent(518,49,94);
    rhCarbon('M224 139L295 133 370 324H230Z',[222,132,150,195],'#91a5ac');rhKnob(268,169,22,'START','#eab3ad');
    ['N','R','D'].forEach((v,i)=>{rhMetal(`M${240+i*24} 207h21v16h-21Z`,[240+i*24,207,21,16]);rhText(250+i*24,218,v,6,'#233844');});
    rhPath('M246 238h72M250 254h74',null,'#89999d',3);rhText(292,285,'AMG',14,'#b7cbce');ctx.restore();
  }
  function drawWheel(w,h){
    const s=rhLayout(w,h).scale;ctx.save();ctx.translate(w/2,rhLayout(w,h).wheelY);ctx.scale(s,s);ctx.rotate(state.steer*.9);rhPaddles(-137,137);
    rhRim('M-82-118H82Q122-116 128-68L126 45Q118 98 80 100H-80Q-118 98-126 45L-128-68Q-122-116-82-118Z','#343c3f','#60a59f');
    rhPath('M-70-119H70',null,rhTexture('carbon'),20);
    rhCarbon('M-117-51L-47-65H47L117-51 112 32 52 31 31 91H-31L-52 31-112 32Z',[-118,-66,236,159]);
    nxButton(-78,-56,12,'DRS','#557cc2');nxButton(-50,-77,10,'LIGHT','#bba044');nxButton(50,-77,10,'INFO','#4a9b6b');nxButton(78,-56,12,'MODE','#bc5554');
    [-1,1].forEach(sign=>{rhPath(`M${sign*63}-16h${sign*43}v19h${-sign*43}Z`,'#111c25','#819396',.6);rhPath(`M${sign*66} 10h${sign*33}`,null,'#bacace',2.7);rhText(sign*86,-3,sign<0?'VOL − +':'HUD',6);});
    rhLeather('M-49-53Q0-78 49-53L57 14Q48 71 0 70Q-48 71-57 14Z',[-57,-65,114,139],'#707d83');nxStar(0,0,27);rhText(0,48,'AIRBAG',4.5,'#748b94');rhKnob(77,70,17,'MODE');nxButton(-77,70,15,'ESC');ctx.restore();
  }
