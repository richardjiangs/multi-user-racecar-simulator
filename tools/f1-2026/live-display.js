  function drawF1WheelDisplay(){
    const s=state,p=app.f1ArtProfile,[x,y,w,h]=p.screen,[lx,ly,ln,ld]=p.led;
    ctx.fillStyle=s.ignition?'#071319':'#020508';ctx.fillRect(x,y,w,h);
    if(!s.ignition)return;
    const txt=(label,xx,yy,size,color,align='left')=>{ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.font=`bold ${size}px monospace`;ctx.fillStyle=color;ctx.fillText(String(label),xx,yy);};
    txt(s.inPitLane?'PIT '+s.pitLimitKmh:s.xMode?'STRAIGHT MODE':s.strat.toUpperCase(),0,y+11,5.5,'#9eb8bb','center');
    txt(s.gearMode==='G'?s.curGear:s.gearMode,0,y+h*.63,34,'#eff5eb','center');
    txt(Math.round(Math.abs(app.kmh(s.speedMps))),x+7,y+h*.38,14,'#bbe3e8');txt('KM/H',x+7,y+h*.5,5,'#879da8');
    txt(Math.round(s.ersStore*100)+'%',x+w-7,y+h*.38,10,s.ersBoost?'#ffd579':'#d7df7f','right');txt('ERS',x+w-7,y+h*.5,5,'#879da8','right');
    txt(Math.round(s.rpm),x+7,y+h-9,8,'#c0ced5');txt(Math.round(s.mguKPowerKw||0)+' kW',x+w-7,y+h-9,8,'#c0ced5','right');
    ctx.fillStyle='#213338';ctx.fillRect(x+7,y+h-5,w-14,2);ctx.fillStyle=p.accent;ctx.fillRect(x+7,y+h-5,(w-14)*app.clamp(s.ersStore,0,1),2);
    for(let i=0;i<ln;i++){const on=s.shifterLight&&s.rpm/app.SPEC.redlineRpm>(i+1)/(ln+2);ctx.fillStyle=on?(i<5?'#63e5a9':i<10?'#e44d4f':'#88a7ff'):'#293a36';ctx.beginPath();ctx.arc(lx+i*ld,ly,2.6,0,Math.PI*2);ctx.fill();}
  }
