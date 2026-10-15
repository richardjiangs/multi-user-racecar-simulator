import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('tools/tracks2/track-data.json'));
const climate=JSON.parse(fs.readFileSync('tools/tracks2/research/weather/january-climatology.json'));
const app={state:{route:{}},CIRCUITS:{},clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
const env={window:{__Track2App:app},TRACK_DATA:data};vm.createContext(env);
for(const file of ['track-runtime.js','rally-weather.js'])vm.runInContext(fs.readFileSync('tools/tracks2/'+file,'utf8'),env);
const checks=[],N=25000,kt=.514444;
for(const [station,c]of Object.entries(climate.stations))for(const [kind,observed]of Object.entries(c.observed)){
 const rows=observed.windHistogram;
 assert.equal(rows.reduce((n,r)=>n+r[3],0),observed.samples);
 if(!observed.samples)continue;
 const w={kind,seed:17291},sampleClimate={stations:[station,station],fraction:0};
 const mean=rows.reduce((n,r)=>n+r[1]*r[3],0)/observed.samples;
 const variance=rows.reduce((n,r)=>n+(r[1]-mean)**2*r[3],0)/observed.samples;
 const gustFraction=rows.reduce((n,r)=>n+(r[2]>r[1]?r[3]:0),0)/observed.samples;
 let sum=0,gusts=0;
 for(let i=0;i<N;i++){
  const v=app.rallySampleWind(w,sampleClimate);sum+=v.mean/kt;gusts+=Number(v.gust>v.mean);
  assert.ok(Number.isFinite(v.from+v.mean+v.gust));assert.ok(v.gust>=v.mean&&v.mean>=0);
  assert.ok(Math.abs(v.x+Math.sin(v.from*Math.PI/180))<1e-12);
  assert.ok(Math.abs(v.z+Math.cos(v.from*Math.PI/180))<1e-12);
 }
 assert.ok(Math.abs(sum/N-mean)<Math.max(.025,6*Math.sqrt(variance/N)),station+' '+kind+' wind distribution');
 assert.ok(Math.abs(gusts/N-gustFraction)<Math.max(.002,6*Math.sqrt(gustFraction*(1-gustFraction)/N)),station+' '+kind+' gust frequency');
 checks.push({station,kind,observations:observed.samples,meanKnots:mean,sampledMeanKnots:sum/N,gustFraction,sampledGustFraction:gusts/N});
}
app.trackModel=()=>({L:1000});
for(const [stage,pair]of [[1,['OEYN','OEYN']],[9,['OEWD','OEBH']],[11,['OEBH','OEMA']],[12,['OEMA','OEYN']],[13,['OEYN','OEYN']]]){
 app.state.route={active:true,name:'Stage '+stage+' — regional lookup'};app.state.distanceM=0;
 assert.deepEqual(Array.from(app.rallyClimate().stations),pair);
}
fs.writeFileSync('tests/refinements/wind-results.json',JSON.stringify({samplesPerCondition:N,checks},null,2));
console.log('PASS',checks.length,'observed wind/gust distributions and Dakar regional assignments');
