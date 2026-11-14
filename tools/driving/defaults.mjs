import fs from 'node:fs';
import {pathToFileURL} from 'node:url';

export function routeFor(key){
  if(key==='phantom'||key==='spectre')return 'London';
  if(key==='roadster2')return 'SpaceX McGregor — Demo Ramp';
  if(['dacia','fordraptor','grhilux','hunter'].includes(key))return 'Prologue — Yanbu';
  if(key==='thrustssc')return 'Black Rock Desert';
  return 'Silverstone Circuit';
}
export function withDefaults(html,key){
  html=html.replace(/<!-- MUCS starting defaults -->[\s\S]*?<!-- END MUCS starting defaults -->\s*/g,'');
  html=html.replace(/\bassist:\s*true/g,'assist: false');
  const name=html.match(/window\.(\w+App)\s*=/)?.[1];if(!name)throw Error('Missing app: '+key);
  const route=routeFor(key);
  const script=`<!-- MUCS starting defaults --><script type="module">
if(window.TRACK2_READY)await window.TRACK2_READY;
const started=performance.now();
function startingDefaults(){
 const app=window.${name};
 if(!app?.updatePhysics||!app?.state||!(app.selectCircuit||app.enterLondon)){
  if(performance.now()-started<120000)setTimeout(startingDefaults,20);return;
 }
 if(app.startingDefaultsApplied)return;
 const s=app.state;s.assist=false;s.testDriver=false;s.adaptiveCruise=false;if('chauffeur' in s)s.chauffeur=false;
 ${route==='London'?"app.enterLondon();app.cityNetwork?.destination(null);":"app.selectCircuit("+JSON.stringify(route)+");"}
 s.assist=false;s.testDriver=false;s.adaptiveCruise=false;
 app.setActive?.('assistBtn',false);app.setActive?.('testDriverBtn',false);
 app.startingDefaultsApplied={key:${JSON.stringify(key)},route:${JSON.stringify(route)}};
}
startingDefaults();
</script><!-- END MUCS starting defaults -->\n`;
  return html.replace('</body>',script+'</body>');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const maps=['tools/tracks2/sim-files.json','tools/tracks2/manifest.json'].map(p=>JSON.parse(fs.readFileSync(p)));
 for(const map of maps)for(const [key,file]of Object.entries(map))fs.writeFileSync(file,withDefaults(fs.readFileSync(file,'utf8'),key));
 console.log('Starting defaults applied to',maps.reduce((n,m)=>n+Object.keys(m).length,0),'simulator editions.');
}
