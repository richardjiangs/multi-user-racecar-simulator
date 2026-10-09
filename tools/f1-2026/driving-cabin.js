  let f1WheelImage=null;
  function prepareF1Wheel(){f1WheelImage=new Image();f1WheelImage.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(app.f1WheelSvg(false));}
  function drawCabinFrame(w,h,pal){
    const sway=state.bodyRoll*.35,foot=document.querySelector('.bottombar'),footTop=foot?foot.getBoundingClientRect().top:h;
    const wc=Math.min(360,w*.4,h*.43),scale=wc/450,cy=Math.max(h*.75,Math.min(h*.87,footTop-75*scale));
    // The survival cell slopes away toward the front axle. No full-width road-car dashboard.
    const shell=ctx.createLinearGradient(0,h*.65,0,h);shell.addColorStop(0,'#34434a');shell.addColorStop(.12,'#0c181f');shell.addColorStop(.66,'#141e24');shell.addColorStop(1,'#040a0d');
    ctx.fillStyle=shell;
    ctx.beginPath();ctx.moveTo(0,h*.69);ctx.bezierCurveTo(w*.13,h*.64,w*.26,h*.75,w*.36,h);ctx.lineTo(0,h);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(w,h*.69);ctx.bezierCurveTo(w*.87,h*.64,w*.74,h*.75,w*.64,h);ctx.lineTo(w,h);ctx.closePath();ctx.fill();
    // The original free-practice Reset still works without a selected circuit.
    if(!trackCamera){const f=FOCAL,axle=2.12,eye=1.55;
      ctx.fillStyle='#667d81';ctx.beginPath();ctx.moveTo(w/2-40,horizonY+(eye-.24)*f/3);ctx.lineTo(w/2+40,horizonY+(eye-.24)*f/3);ctx.lineTo(w*.64,h);ctx.lineTo(w*.36,h);ctx.closePath();ctx.fill();
      for(const side of [-1,1]){const x=w/2+side*.8*f/axle,y=horizonY+(eye-.345)*f/axle,tw=.34*f/axle,th=.69*f/axle;const g=ctx.createLinearGradient(x-tw/2,0,x+tw/2,0);g.addColorStop(0,'#080f14');g.addColorStop(.4,'#29343b');g.addColorStop(1,'#0c141b');ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(x-tw/2,y-th/2,tw,th,tw*.28);ctx.fill();}
    }
    // Laminated carbon shoulders with seam highlights and captive hardware.
    ctx.strokeStyle=app.f1ArtProfile.accent;ctx.lineWidth=3;
    for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side<0?0:w,h*.70);ctx.quadraticCurveTo(w*(.5+side*.36),h*.69,w*(.5+side*.16),h);ctx.stroke();
      ctx.save();ctx.globalAlpha=.14;ctx.strokeStyle='#829c9e';ctx.lineWidth=.6;for(let j=0;j<25;j++){const yy=h*.73+j*9;ctx.beginPath();ctx.moveTo(side<0?0:w,yy);ctx.lineTo(w*(.5+side*(.37-j*.003)),yy+25);ctx.stroke();}ctx.restore();
      for(let j=0;j<3;j++){const x=w*(.5+side*(.43-j*.045)),y=h*(.77+j*.046);ctx.fillStyle='#798d8f';ctx.beginPath();ctx.arc(x,y,2.8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#1e363f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-1.6,y);ctx.lineTo(x+1.6,y);ctx.stroke();}
    }
    // Driver's-eye halo: a rounded forward hoop with a central structural leg.
    // The broad curve is the underside of a U-shaped tube, not a windscreen V.
    const cx=w/2,top=h*.31,base=cy-88*scale;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    const hoop=()=>{ctx.beginPath();ctx.moveTo(-w*.07,h*.12);ctx.bezierCurveTo(w*.04,h*.21,w*.24,h*.30,w*.40,top);ctx.bezierCurveTo(w*.46,top+h*.009,w*.54,top+h*.009,w*.60,top);ctx.bezierCurveTo(w*.76,h*.30,w*.96,h*.21,w*1.07,h*.12);};
    hoop();ctx.strokeStyle='#070f14';ctx.lineWidth=Math.max(17,h*.033);ctx.stroke();
    hoop();ctx.strokeStyle='#283c43';ctx.lineWidth=Math.max(11,h*.022);ctx.stroke();
    ctx.translate(0,-Math.max(3,h*.005));hoop();ctx.strokeStyle='#718485';ctx.lineWidth=1.3;ctx.stroke();ctx.translate(0,Math.max(3,h*.005));
    const leg=ctx.createLinearGradient(cx-9,0,cx+9,0);leg.addColorStop(0,'#42545a');leg.addColorStop(.22,'#14262e');leg.addColorStop(.7,'#08131b');leg.addColorStop(1,'#526b70');
    ctx.fillStyle=leg;ctx.beginPath();ctx.moveTo(cx-7,top+5);ctx.lineTo(cx+7,top+5);ctx.bezierCurveTo(cx+6,h*.48,cx+9,base-28,cx+17,base);ctx.lineTo(cx-17,base);ctx.bezierCurveTo(cx-9,base-28,cx-6,h*.48,cx-7,top+5);ctx.fill();
    ctx.fillStyle=app.f1ArtProfile.accent;ctx.beginPath();ctx.roundRect(cx-4,top+18,8,19,2);ctx.fill();
    // Captive halo mounting bolts and the small carbon reinforcement at its foot.
    ctx.fillStyle='#14252d';ctx.beginPath();ctx.ellipse(cx,base,28,9,0,0,Math.PI*2);ctx.fill();
    for(const dx of [-19,19]){ctx.fillStyle='#879a9b';ctx.beginPath();ctx.arc(cx+dx,base,2,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    ctx.save();ctx.translate(w/2+sway,cy);ctx.rotate(state.steer*.9);ctx.scale(scale,scale);
    if(f1WheelImage?.complete&&f1WheelImage.naturalWidth)ctx.drawImage(f1WheelImage,-225,-145,450,285);
    drawF1WheelDisplay();ctx.restore();
  }
