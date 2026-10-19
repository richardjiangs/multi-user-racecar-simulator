// A lossless construction recipe for the already-authored, immutable world.
// It is expanded once in a worker BEFORE the route becomes driveable.
import fs from 'node:fs';import {createHash} from 'node:crypto';
export const recipeFiles=['track-runtime.js','rally-runtime.js','car-models.js','world-lettering.js','museum-world.js','scenery-detail.js','world-builder.js'];
export function recipeSource(){
 const source=recipeFiles.map(f=>fs.readFileSync('tools/tracks2/'+f,'utf8')).join('\n');
 return `function reconstructTrack(name,track,museum,onProgress=()=>{}){
 const app={state:{route:{}},CIRCUITS:{[name]:{}},clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};app.halfWidthAt=d=>app.trackWidthAt(d);
 const window={__Track2App:app},TRACK_DATA={[name]:track},MUSEUM_CARS=museum;
 ${source.replace('tile.count++;vertexCount++;','tile.count++;vertexCount++;if(vertexCount%500000===0)onProgress(vertexCount);')}
 app.state.route={active:true,name,totalM:track.L};
 const original=app.pitSurface,cache=new Map();app.pitSurface=(q,n=0,h=0)=>{const key=q+','+n;if(!cache.has(key))cache.set(key,original(q,n,0));return{...cache.get(key),y:cache.get(key).y+h}};
 return buildCircuitWorld(app);
 }`;
}
export function recipeFingerprint(pack){return createHash('sha256').update(recipeSource()).update(JSON.stringify(pack)).update(fs.readFileSync('tools/tracks2/museum-cars.json')).digest('hex');}
