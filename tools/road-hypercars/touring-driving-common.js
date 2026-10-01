  // Instrument hardware only. Each model owns its fascia geometry and wheel construction.
  function tcDial(x,y,r,label,max,value,bright='#d6dbd4'){
    rhCircle(x,y,r+3,'#081015','#9ba7a9',1.6);rhCircle(x,y,r,'#10191d','#5a6c73',1);rhCircle(x,y,r-2,null,'#c4cfcc',.55);
    rhTicks(x,y,r-5,max,1,value/max,bright);rhText(x,y+r*.44,label,r*.145,bright);
    rhArc(x,y,r-1,-2.4,-.65,'rgba(238,244,240,.25)',1);
  }
  function tcWheelPosition(w,h){const l=rhLayout(w,h);return Math.max(h*.86,l.bottom+52*l.scale);}
  function tcSwitch(x,y,label,on=false){rhCircle(x,y,5,'#131f26','#99aeb5',1);rhPath(`M${x} ${y+2}l2-8`,null,on?'#e4dac1':'#80919a',3);rhText(x,y+16,label,5.5,'#b2c4ca');}
  function tcThinWheel(r,wood=false){rhCircle(0,0,r,null,'#070c10',wood?21:27);rhCircle(0,0,r,null,wood?rhGradient(-r,-r,r*2,r*2,[[0,'#c99555'],[.4,'#6e4223'],[.7,'#c48d4c'],[1,'#8e5e31']]):rhGradient(-r,-r,r*2,r*2,[[0,'#515a5c'],[.3,'#19242c'],[.75,'#0a131b'],[1,'#434e54']]),wood?14:19);rhCircle(0,0,r-5,null,wood?'#e7b66f':'#4b5f68',.7);}
  function tcManual(x,y,wood=false){rhMetal(`M${x-27} ${y+75}h54l9 22h-72Z`,[x-36,y+75,72,22]);for(let i=-1;i<=1;i++)rhPath(`M${x+i*17} ${y+80}v11`,null,'#0b1821',3);rhPath(`M${x-18} ${y+85}h36M${x} ${y+85}V${y}`,null,'#a9bdc5',6);rhCircle(x,y,15,wood?'#b68b51':'#101e27','#8b9ca1',1);if(wood)for(let i=0;i<5;i++)rhPath(`M${x-11} ${y-8+i*4}q11 4 22 0`,null,'#765026',1);}

  function tcClassicPillars(w,h,kind){
    const metal=kind!=='f40',outer=kind==='p917'?.024:kind==='gto'?.035:.044;
    const edge=kind==='p917'?.035:kind==='gto'?.045:.054;
    for(const side of [0,1]){
      ctx.save();if(side){ctx.translate(w,0);ctx.scale(-1,1);}
      const d=`M0 0H${w*outer}L${w*edge} ${h*.66} 0 ${h*.71}Z`;
      if(metal)rhMetal(d,[0,0,w*edge,h*.71]);else rhLeather(d,[0,0,w*edge,h*.71],'#555d5d');
      rhPath(`M${w*(outer-.006)} 0L${w*(edge-.006)} ${h*.655}`,null,metal?'#161e22':'#747d78',2);
      ctx.restore();
    }
    rhPath(`M0 0H${w}V${h*.011}Q${w/2} ${h*.008} 0 ${h*.011}Z`,'#171f21');
  }
