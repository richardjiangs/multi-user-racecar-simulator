  // Drawing primitives only; each car below has its own fascia, instruments and wheel paths.
  let rhLayoutCache=null;
  function rhLayout(w,h){
    if(rhLayoutCache?.w===w&&rhLayoutCache?.h===h)return rhLayoutCache;
    const footer=document.querySelector('.bottombar').getBoundingClientRect(),top=document.querySelector('.topbar').getBoundingClientRect().bottom;
    const bottom=Math.min(h-8,footer.top);
    const scale=Math.min(w/1200,h/850);
    // SSC's 1.0 driving composition: low fascia, wheel partly below the viewport.
    // Do not lift the whole steering wheel above the footer: it hides the road.
    const dashY=h*.70,wheelY=h*.97;
    document.documentElement.style.setProperty('--rh-footer-height',(h-bottom)+'px');
    document.documentElement.style.setProperty('--rh-header-height',top+'px');
    return rhLayoutCache={w,h,scale,wheelY,dashY,bottom};
  }
  const rhTextures=new Map();
  function rhTexture(kind){
    if(rhTextures.has(kind))return rhTextures.get(kind);
    const tile=document.createElement('canvas');tile.width=64;tile.height=64;const g=tile.getContext('2d');
    if(kind==='carbon'){
      for(let y=0;y<64;y+=8)for(let x=0;x<64;x+=8){
        g.fillStyle='#60747e';g.fillRect(x,y,4,4);g.fillRect(x+4,y+4,4,4);
        g.fillStyle='#13232c';g.fillRect(x+4,y,4,4);g.fillRect(x,y+4,4,4);
        g.strokeStyle='#9eb0b6';g.lineWidth=.45;g.beginPath();g.moveTo(x+1,y);g.lineTo(x+1,y+4);g.moveTo(x+5,y+4);g.lineTo(x+5,y+8);g.stroke();
      }
    }else if(kind==='metal'){
      for(let y=0;y<64;y++){g.strokeStyle=y%3?'rgba(232,238,239,.16)':'rgba(12,23,31,.15)';g.beginPath();g.moveTo(0,y+.5);g.lineTo(64,y+.5);g.stroke();}
    }else{
      for(let i=0;i<1200;i++){const x=(i*37+i*i*3)%64,y=(i*13+Math.floor(i/64)*7)%64;g.fillStyle=i%3?'rgba(182,186,174,.18)':'rgba(0,0,0,.30)';g.fillRect(x,y,i%5?1:2,.6);}
    }
    const pattern=ctx.createPattern(tile,'repeat');if(kind==='carbon')pattern.setTransform(new DOMMatrix().rotate(35).scale(.75));rhTextures.set(kind,pattern);return pattern;
  }
  function rhPath(d,fill,stroke,width=1){const p=new Path2D(d);if(fill){ctx.fillStyle=fill;ctx.fill(p);}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke(p);}}
  function rhGradient(x,y,w,h,stops){const g=ctx.createLinearGradient(x,y,x+w,y+h);stops.forEach(([at,color])=>g.addColorStop(at,color));return g;}
  function rhSurface(d,kind,bounds,colors,edge){
    const [x,y,w,h]=bounds;
    rhPath(d,rhGradient(x,y,w*.16,h,colors),edge,1);
    ctx.save();ctx.clip(new Path2D(d));ctx.globalAlpha=kind==='carbon'?.14:kind==='metal'?.22:.13;ctx.fillStyle=rhTexture(kind);ctx.fillRect(x,y,w,h);ctx.restore();
  }
  function rhCarbon(d,bounds,edge='#46525a'){rhSurface(d,'carbon',bounds,[[0,'#343d41'],[.26,'#171e24'],[.67,'#0c1319'],[1,'#202a30']],edge);}
  function rhMetal(d,bounds,edge='#939da2'){rhSurface(d,'metal',bounds,[[0,'#e5e9e6'],[.2,'#7e8b91'],[.42,'#c9d0d0'],[.68,'#52616b'],[1,'#a7b2b5']],edge);}
  function rhLeather(d,bounds,edge='#343d41'){rhSurface(d,'leather',bounds,[[0,'#34373a'],[.24,'#20262a'],[.74,'#0c1115'],[1,'#171d22']],edge);}
  function rhStitch(d,color='#8e7560',width=.8){ctx.save();ctx.setLineDash([2,3]);rhPath(d,null,color,width);ctx.restore();}
  function rhText(x,y,value,size=12,color='#dae5e9',align='center'){ctx.fillStyle=color;ctx.font=size+'px Arial';ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(value,x,y);}
  function rhCircle(x,y,r,fill,stroke,width=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
  function rhArc(x,y,r,a,b,color,width=1){ctx.beginPath();ctx.arc(x,y,r,a,b);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
  function rhScrew(x,y){rhCircle(x,y,2.2,'#8b999f','#152027',.8);rhPath(`M${x-1} ${y}h2`,null,'#20303a',.7);}
  function rhKnob(x,y,r,label,color='#d9e5e8'){
    rhCircle(x,y,r+2,'#070d12');rhCircle(x,y,r,rhGradient(x-r,y-r,r*2,r*2,[[0,'#e0e7e7'],[.28,'#7a888d'],[.52,'#b8c4c8'],[1,'#45535c']]));
    for(let i=0;i<48;i++){const a=i*Math.PI/24;rhPath(`M${x+Math.cos(a)*(r-1)} ${y+Math.sin(a)*(r-1)}l${Math.cos(a)*1.9} ${Math.sin(a)*1.9}`,null,i<24?'#a7b3b7':'#404f59',.6);}
    rhCircle(x,y,r-4,'#111a22','#667b84',.7);rhCircle(x,y,r-6,null,'#263942',.5);rhText(x,y+3,label,r*.42,color);
    rhPath(`M${x} ${y-r+1}v3`,null,'#faf5df',1.5);
  }
  function rhVent(x,y,r){
    rhCircle(x,y,r+3,'#0b1116','#414e54',1);rhCircle(x,y,r,rhGradient(x-r,y-r,r*2,r*2,[[0,'#d1dadd'],[.35,'#606d74'],[.55,'#c4cfd1'],[1,'#4a5962']]));
    rhCircle(x,y,r-3,'#050b0f','#78868c',.6);
    for(let i=0;i<8;i++){ctx.save();ctx.translate(x,y);ctx.rotate(i*Math.PI/4);ctx.scale(r/27,r/27);rhPath('M5-2L20-8Q24-5 22-1L10 8Z','#34434b','#718088',.5);rhPath('M7 1L21-3',null,'#a0afb4',.5);ctx.restore();}
    rhCircle(x,y,r*.2,'#84969f','#16232b',1);rhCircle(x,y,r*.09,'#263e49');
  }
  function rhTicks(x,y,r,max,step,fraction,face='#d9e1e5',numberColor=face){
    const divisions=max===350?70:max<=10?Math.round(max)*10:100;
    for(let i=0;i<=divisions;i++){const a=(-220+i*260/divisions)*Math.PI/180,major=i%10===0;rhPath(`M${x+Math.cos(a)*r} ${y+Math.sin(a)*r}L${x+Math.cos(a)*(r-(major?7:3))} ${y+Math.sin(a)*(r-(major?7:3))}`,null,face,major?1.25:.55);
      if(major)rhText(x+Math.cos(a)*(r-17),y+Math.sin(a)*(r-17)+2.7,Math.round(max*i/divisions),7.5,numberColor);
    }
    const a=(-220+260*clamp(fraction,0,1))*Math.PI/180;
    ctx.save();ctx.translate(x,y);ctx.rotate(a);rhPath('M-8-1.4L'+(r-7)+' 0 -8 1.4Z','#ef743c');ctx.restore();rhCircle(x,y,3,'#c5ccd0','#26353d',.6);
  }
  function rhRim(d,color='#2d3032',stitch='#787267'){
    const leather=rhGradient(-110,-130,220,260,[[0,'#515758'],[.25,color],[.65,'#0d1419'],[1,'#3b4246']]);
    ctx.save();ctx.shadowColor='#000';ctx.shadowBlur=10;ctx.shadowOffsetY=5;rhPath(d,null,'#05090b',29);ctx.restore();rhPath(d,null,leather,23);
    ctx.save();ctx.globalAlpha=.35;rhPath(d,null,rhTexture('leather'),20);ctx.restore();rhStitch(d,stitch,.7);
    ctx.save();ctx.translate(0,-1.2);ctx.globalAlpha=.3;rhPath(d,null,'#a2afb2',.6);ctx.restore();
  }
  function rhScreen(d){rhPath(d,rhGradient(0,-70,0,140,[[0,'#12252f'],[.15,'#040c13'],[1,'#071019']]),'#536773',1.1);}
  function rhPaddles(left=-116,right=116){
    rhMetal(`M${left-8}-83Q${left-21}-48 ${left-11} 0L${left+2}-4 ${left+1}-82Z`,[left-22,-85,26,90]);
    rhMetal(`M${right+8}-83Q${right+21}-48 ${right+11} 0L${right-2}-4 ${right-1}-82Z`,[right-4,-85,26,90]);
    rhText(left-5,-40,'−',12,'#17272e');rhText(right+5,-40,'+',10,'#17272e');
  }
