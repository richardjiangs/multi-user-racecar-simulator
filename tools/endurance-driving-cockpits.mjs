// Hand-authored driving-view geometry, separate from the inspectable SVG cabin.
import {readFileSync,writeFileSync} from 'node:fs';
for(const [file,p] of [['Porsche 919 Hybrid simulator.html',true],['Ferrari 499P simulator.html',false]]){
 let s=readFileSync(file,'utf8');
 const code=`  function drawCabinFrame(w,h,pal){
    const y=h*.69;
    ctx.fillStyle='#080c10';ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,y+30);ctx.lineTo(w*.22,y-17);ctx.lineTo(w*.5,y+10);ctx.lineTo(w*.78,y-17);ctx.lineTo(w,y+30);ctx.lineTo(w,h);ctx.fill();
    ctx.strokeStyle='${p?'#555f67':'#363e43'}';ctx.lineWidth=${p?12:19};ctx.beginPath();ctx.moveTo(0,h*.97);ctx.lineTo(w*.12,h*.24);ctx.lineTo(w*.25,h*.04);ctx.moveTo(w,h*.97);ctx.lineTo(w*.88,h*.24);ctx.lineTo(w*.75,h*.04);ctx.stroke();
    ctx.strokeStyle='${p?'#e8e9e9':'#f3cf23'}';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#161c22';ctx.beginPath();ctx.moveTo(w*.73,y);ctx.lineTo(w*.9,y-5);ctx.lineTo(w*.97,h);ctx.lineTo(w*.77,h);ctx.fill();
    ctx.fillStyle='#b3bdc5';ctx.font='bold '+Math.max(8,h*.016)+'px monospace';ctx.textAlign='center';ctx.fillText('${p?'919 SYSTEMS':'499P CONSOLE'}',w*.834,y+18);
    for(let i=0;i<6;i++){const x=w*(.799+(i%2)*.065),yy=y+40+Math.floor(i/2)*h*.063;ctx.fillStyle=['#ed3234','#f4cc22','#41a3dd'][i%3];ctx.beginPath();ctx.arc(x,yy,h*.010,0,Math.PI*2);ctx.fill();ctx.fillStyle='#afbcc5';ctx.font=Math.max(7,h*.013)+'px monospace';ctx.fillText(['PIT','FCY','ERS','RAD','RAIN','START'][i],x,yy+h*.026);}
    drawWheel(w,h);
    if(state.wiper){ctx.save();ctx.translate(w*.5,h*.11);ctx.rotate(Math.sin(state.time*4)*.55);ctx.strokeStyle='#020406';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w*.29,h*.13);ctx.stroke();ctx.restore();}
  }
  function drawCluster(w,h,y,s){
    const R=Math.min(w,h)*.${p?'265':'255'};
    ctx.fillStyle='#010607';ctx.strokeStyle='${p?'#aaaeb1':'#647c80'}';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(-R*.61,-R*.42,R*1.22,R*.60,4);ctx.fill();ctx.stroke();
    const rpmN=clamp(state.rpm/SPEC.redlineRpm,0,1);
    for(let i=0;i<15;i++){ctx.fillStyle=i/14<rpmN?(i>11?'#f13637':i>8?'#ffdb3b':'${p?'#4caff0':'#49df60'}'):'#283237';ctx.fillRect(-R*.56+i*R*.077,-R*.36,R*.053,R*.036);}
    ctx.textAlign='center';ctx.fillStyle='#f3f7f8';ctx.font='900 '+R*.27+'px monospace';ctx.fillText(state.gearMode==='G'?state.curGear:state.gearMode,0,-R*.04);
    ctx.font='700 '+R*.125+'px monospace';ctx.fillText(Math.round(Math.abs(app.kmh(state.speedMps))),-R*.38,-R*.07);ctx.fillStyle='#8ca3b0';ctx.font=R*.065+'px monospace';ctx.fillText('KM/H',-R*.38,R*.04);
    ctx.fillStyle='${p?'#f4d82e':'#50e676'}';ctx.font='700 '+R*.095+'px monospace';ctx.fillText(Math.round(state.hybridEnergy)+'%',R*.38,-R*.11);ctx.font=R*.070+'px monospace';ctx.fillText(Math.round(state.mguPowerKw||0)+' kW',R*.37,R*.045);
    ctx.fillStyle='#e0e9eb';ctx.font=R*.066+'px monospace';ctx.fillText(${p?'["8MJ AUTO","BOOST","RECUP"]':'["STINT","ATTACK","CHARGE"]'}[state.energyMode]+' · BB '+state.brakeMigration+'%',0,R*.135);
  }
  function drawWheel(w,h){
    const R=Math.min(w,h)*.${p?'265':'255'};ctx.save();ctx.translate(w*.46,h*.845);ctx.rotate(state.steer*.64);
    ctx.strokeStyle='#9faab1';ctx.lineWidth=R*.036;ctx.beginPath();ctx.moveTo(-R*1.02,-R*.33);ctx.lineTo(-R*1.02,R*.36);ctx.moveTo(R*1.02,-R*.33);ctx.lineTo(R*1.02,R*.36);ctx.stroke();
    ctx.fillStyle='#090e13';ctx.strokeStyle='${p?'#bfc9ce':'#59666e'}';ctx.lineWidth=2.5;ctx.beginPath();
    ${p?`ctx.moveTo(-R*.97,-R*.55);ctx.lineTo(-R*.73,-R*.62);ctx.lineTo(R*.73,-R*.62);ctx.lineTo(R*.97,-R*.55);ctx.lineTo(R*.96,R*.46);ctx.lineTo(R*.63,R*.55);ctx.lineTo(-R*.63,R*.55);ctx.lineTo(-R*.96,R*.46);`:`ctx.moveTo(-R*.68,-R*.57);ctx.lineTo(R*.68,-R*.57);ctx.bezierCurveTo(R*1.14,-R*.44,R*1.04,R*.47,R*.62,R*.51);ctx.lineTo(R*.45,R*.23);ctx.lineTo(-R*.45,R*.23);ctx.lineTo(-R*.62,R*.51);ctx.bezierCurveTo(-R*1.04,R*.47,-R*1.14,-R*.44,-R*.68,-R*.57);`}
    ctx.closePath();ctx.fill();ctx.stroke();drawCluster(w,h,0,0);
    const labels=${p?'["BOOST","FLASH","MI−","MI+","BR−","BR+","BOX","WIPE","RAD","OK"]':'["FLASH","FCY","TC+","BBW","WIPE","N"]'};
    for(let i=0;i<labels.length;i++){const side=i%2?1:-1,x=side*R*.78,yy=-R*.40+Math.floor(i/2)*R*${p?'.18':'.23'};ctx.fillStyle=['#e33838','#f4d33f','#5cace0','#e75c9d','#51bc76'][Math.floor(i/2)];ctx.beginPath();ctx.arc(x,yy,R*.048,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d4e0e5';ctx.font=R*.045+'px monospace';ctx.fillText(labels[i],x,yy+R*.081);}
    for(let i=0;i<3;i++){const x=(i-1)*R*.38,yy=R*.${p?'37':'38'};ctx.fillStyle=['#d33131','#e88029','#45b570'][i];ctx.beginPath();ctx.arc(x,yy,R*.085,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e3e9eb';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+Math.sin(state.energyMode+i)*R*.065,yy-Math.cos(state.energyMode+i)*R*.065);ctx.stroke();ctx.fillStyle='#c6d2d9';ctx.font=R*.045+'px monospace';ctx.fillText(${p?'["TCF","BOOST","RECUP"]':'["PEDAL","ENGINE","STRAT"]'}[i],x,yy+R*.13);}
    ctx.restore();
  }
`;
 s=s.replace(/  function drawCabinFrame\(w,h,pal\)\{[\s\S]*?    function drawHeadlights/,code+'    function drawHeadlights');
 writeFileSync(file,s);
}
