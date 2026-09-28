  // Additional small hardware shared by this set; cabin silhouettes remain car-specific.
  function nxPillars(w,h,width=.09){
    rhCarbon(`M0 0H${w*width}L${w*.06} ${h*.65} 0 ${h*.71}Z`,[0,0,w*width,h*.72]);
    rhCarbon(`M${w} 0H${w*(1-width)}L${w*.94} ${h*.65} ${w} ${h*.71}Z`,[w*(1-width),0,w*width,h*.72]);
    ctx.fillStyle='#070d12';ctx.fillRect(0,0,w,h*.022);
  }
  function nxRev(x,y,w,n=25,color='#86b8df'){
    const rev=clamp(state.rpm/SPEC.redlineRpm,0,1);
    for(let i=0;i<n;i++){ctx.fillStyle=rev>i/n?(i>n*.86?'#f46851':color):'#26343a';ctx.fillRect(x+i*w/n,y,w/n-1.3,3.2);}
  }
  function nxVent(x,y,w){rhPath(`M${x} ${y}h${w}v15h-${w}Z`,'#050b10','#6b7c82',.8);for(let i=0;i<3;i++)rhPath(`M${x+4} ${y+4+i*3.5}h${w-8}`,null,'#4d616d',1);}
  function nxButton(x,y,r,label,color='#637985'){rhCircle(x,y,r+2,'#0b1219',color,.9);rhCircle(x,y,r,'#22323b');rhText(x,y+2,label,4.5,'#dae6e6');}
  function nxSpeed(){return Math.round(Math.abs(app.kmh(state.speedMps)));}
  function nxGear(){return state.gearMode==='G'?state.curGear:state.gearMode;}
  function nxStar(x,y,r){rhCircle(x,y,r,'#09121b','#abb8bb',1.3);rhPath(`M${x} ${y-r+2}l3 ${r-5} ${r-5} ${r/2+1}-${r-2}-${r/2-2}-${r-2} ${r/2-1} ${r-5}-${r/2+1}Z`,'#b6c4c7');}
