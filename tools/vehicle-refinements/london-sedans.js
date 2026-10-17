/* London is a selectable driving environment. Powertrains and non-city routes
   continue through each car's original functions. */
(function(root){
 const keys=new Set(['tesla','taycan','m5','evo','project8']);
 function prepare(html,key){
  if(!keys.has(key))return html;
  const hook=(name,code)=>{const re=new RegExp('function '+name+'\\(([^)]*)\\) \\{');if(!re.test(html))throw Error(key+' missing '+name);html=html.replace(re,(m)=>m+' '+code);};
  hook('curvatureAt','if(state.ldn&&app.cityNetwork)return app.cityNetwork.curvature(d);');
  hook('halfWidthAt','if(state.ldn)return state.ldn.road.w*1.55/2;');
  hook('pathSteer','if(state.ldn&&app.cityNetwork)return app.cityNetwork.driverSteer(gain);');
  hook('targetSpeedMps','if(state.ldn&&app.cityNetwork)return app.cityNetwork.driverTarget();');
  hook('updateLap','if(state.ldn)return;');
  hook('updateRivals','if(state.ldn)return;');
  hook('selectCircuit',"if(name==='London'){app.enterLondon();return;}if(state.ldn)app.leaveLondon();");
  hook('resetCar','if(state.ldn)app.leaveLondon();');
  hook('drawRearView','if(state.ldn&&app.cityNetwork){app.cityNetwork.drawRear(mx,my,mw,mh,pal,p);return;}');
  hook('projectAhead','if(state.ldn&&app.cityNetwork)return app.cityNetwork.projectRelative(distAhead,lateralM);');
  const start=html.indexOf('function drawWorld()'),sky=html.indexOf('drawSky(',start),end=html.indexOf('drawCabinFrame(w, h, pal);',sky),skyEnd=html.indexOf(';',sky)+1;
  if(start<0||sky<0||end<0)throw Error(key+' city renderer insertion');
  html=html.slice(0,skyEnd)+'if(state.ldn&&app.cityNetwork){app.cityNetwork.draw(w,h,pal);}else{'+html.slice(skyEnd,end)+'}'+html.slice(end);
  return html;
 }
 function install(app,data){
  Object.assign(app,data);const s=app.state,doc=app.canvas.ownerDocument;let gridBefore=true;
  app.CIRCUITS.London={dist:1,env:'city',loop:false,blurb:'London road network'};
  app.enterLondon=(nodeId,roadName)=>{
   app.track2Reset?.();if(!s.ldn)gridBefore=s.raceGrid;const node=app.LDN.byId[nodeId]||app.LDN.byId.charingx,link=node.roads.find(l=>(!roadName||l.road.name===roadName)&&(l.out>0?l.road.fwd:l.road.back)>0)||node.roads[0];
   s.ldn={road:link.road,dir:link.out,node,next:link.out>0?link.road.B:link.road.A,origin:0};
   Object.assign(s,{distanceM:0,routeTime:0,edgeD:0,headingRel:0,speedMps:0,laneOffset:-link.road.w*1.55/2+link.road.w*1.55/(link.road.fwd+link.road.back)*.5,rivals:[],traffic:[],raceGrid:false,pursuit:[],dayPhase:.3});
   s.route={active:true,name:'London',env:'city',totalM:link.road.len,remainingM:link.road.len,loop:false,arrived:false,label:link.road.name};s.lap.running=false;
   app.cityNetwork?.prepare();doc.querySelectorAll('[data-circuit]').forEach(b=>b.classList.toggle('active',b.dataset.circuit==='London'));app.setView('drive');app.showToast?.('London · explore freely or choose a destination.','Navigation');
  };
  app.leaveLondon=()=>{s.ldn=null;s.city=null;s.pursuit=[];s.traffic=[];s.raceGrid=gridBefore;app.cityNetwork?.destination('');};
  const seed=app.seedRivals;app.seedRivals=function(){if(s.ldn){s.rivals=[];return;}return seed.apply(this,arguments);};
  const original=app.updatePhysics;app.updatePhysics=function(dt){
   const L=s.ldn,d=s.distanceM;const result=original.call(app,dt);if(!s.ldn)return result;
   const net=app.cityNetwork;s.dayPhase=.3;s.routeTime+=dt;
   if(L===s.ldn&&d<L.road.len-4&&s.distanceM>=L.road.len-4&&L.next.roads.length>=3&&net.signalState(L.next)==='red'&&!s.pursuit.length){s.pursuit=[{kind:'police',name:'Metropolitan Police',gap:38,speedMps:Math.abs(s.speedMps)+2}];app.showToast?.('Red light — police are following.','London');}
   for(const car of s.pursuit){car.speedMps+=(Math.abs(s.speedMps)+2-car.speedMps)*Math.min(1,dt*2);car.gap=Math.max(10,car.gap+(Math.abs(s.speedMps)-car.speedMps)*dt);}
   net.step();net.trafficStep(dt);return result;
  };
  const first=doc.querySelector('[data-circuit]');if(first){const b=doc.createElement('button');b.type='button';b.dataset.circuit='London';b.textContent='London · free city driving';b.onclick=()=>app.enterLondon();first.parentElement.appendChild(b);}
 }
 root.MUCSLondonSedans={eligible:key=>keys.has(key),prepare,install};
})(typeof window==='undefined'?globalThis:window);
