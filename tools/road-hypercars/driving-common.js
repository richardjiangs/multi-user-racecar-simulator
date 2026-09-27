  // Drawing primitives only; each car below has its own fascia, instruments and wheel paths.
  let rhLayoutCache=null;
  function rhLayout(w,h){
    if(rhLayoutCache?.w===w&&rhLayoutCache?.h===h)return rhLayoutCache;
    const footer=document.querySelector('.bottombar').getBoundingClientRect(),top=document.querySelector('.topbar').getBoundingClientRect().bottom;
    const bottom=Math.min(h-8,footer.top),available=Math.max(110,bottom-top);
    const scale=Math.max(.22,Math.min(w<600?w/540:w/1200,h/850,available/480));
    const wheelY=bottom-140*scale-10,dashY=wheelY-112*scale;
    document.documentElement.style.setProperty('--rh-footer-height',(h-bottom)+'px');
    document.documentElement.style.setProperty('--rh-header-height',top+'px');
    return rhLayoutCache={w,h,scale,wheelY,dashY};
  }
  function rhPath(d, fill, stroke, width=1) { const p=new Path2D(d); if(fill){ctx.fillStyle=fill;ctx.fill(p);} if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke(p);} }
  function rhText(x,y,value,size=12,color='#dae5e9',align='center') { ctx.fillStyle=color;ctx.font=size+'px Arial';ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(value,x,y); }
  function rhCircle(x,y,r,fill,stroke,width=1){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
  function rhVent(x,y,r){rhCircle(x,y,r,'#080e13','#929c9f',3);for(let i=0;i<10;i++){ctx.save();ctx.translate(x,y);ctx.rotate(i*Math.PI/5);rhPath('M5 0L18 0 13 7 4 4Z','#46535b');ctx.restore();}rhCircle(x,y,5,'#8a989c');}
  function rhTicks(x,y,r,max,step,fraction,face='#d9e1e5') { for(let i=0;i<=40;i++){const a=(-220+i*6.5)*Math.PI/180;ctx.strokeStyle=face;ctx.lineWidth=i%4===0?1.4:.7;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*(r-(i%4===0?8:4)),y+Math.sin(a)*(r-(i%4===0?8:4)));ctx.stroke();if(i%step===0)rhText(x+Math.cos(a)*(r-17),y+Math.sin(a)*(r-17)+3,Math.round(max*i/40),8,face);}
    const a=(-220+260*clamp(fraction,0,1))*Math.PI/180;ctx.strokeStyle='#f7714b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-Math.cos(a)*7,y-Math.sin(a)*7);ctx.lineTo(x+Math.cos(a)*(r-7),y+Math.sin(a)*(r-7));ctx.stroke();rhCircle(x,y,3,'#b1bbc0'); }
  function rhRim(d,color='#2d3032'){
    const leather=ctx.createLinearGradient(-110,-130,110,130);leather.addColorStop(0,'#444d50');leather.addColorStop(.35,color);leather.addColorStop(.72,'#111a20');leather.addColorStop(1,'#384147');
    ctx.save();ctx.shadowColor='#000';ctx.shadowBlur=9;ctx.shadowOffsetY=4;rhPath(d,null,'#05090b',28);ctx.restore();rhPath(d,null,leather,21);
    ctx.save();ctx.setLineDash([2,4]);rhPath(d,null,'#697070',.8);ctx.restore();
  }
  function rhScreen(d){rhPath(d,'#040b12','#626e76',2);}
