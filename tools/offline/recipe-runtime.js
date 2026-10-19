/* The offline archive reconstructs the existing world in a dedicated worker.
   Only complete, validated buffers are exposed to the unchanged driving renderer. */
function installOfflineRecipes(bundle){
 const meshes={},pending=new Map(),recent=[],jobs=new Map();let worker=null,next=0;
 // Driving code may add caches to data; recipes always start from pristine inputs.
 const inputs=Object.fromEntries(Object.entries(bundle.data).map(([name,data])=>[name,JSON.stringify(data)]));
 const hex=buffer=>Array.from(new Uint8Array(buffer),v=>v.toString(16).padStart(2,'0')).join('');
 function startWorker(){
  if(worker)return worker;
  const source=bundle.recipe+'\nconst museum='+JSON.stringify(bundle.museum)+';\nconst hex='+hex.toString()+`;let queue=Promise.resolve();
  self.onmessage=e=>{queue=queue.then(async()=>{const {id,name,track,expected}=e.data;try{
   const mesh=reconstructTrack(name,track,museum,count=>self.postMessage({id,progress:Math.min(99,Math.floor(count/expected.vertices*100))}));
   // Restore the few words affected by cross-engine arithmetic rounding.
   const words=new DataView(mesh.buffer);for(const [offset,value]of expected.patches||[])words.setUint32(offset,value,true);
   if(JSON.stringify(mesh.batches.map(b=>[b.first,b.count]))!==JSON.stringify(expected.batches.map(b=>[b.first,b.count])))throw Error('Route topology did not match its archive.');
   mesh.batches=expected.batches;
   const digest=hex(await crypto.subtle.digest('SHA-256',mesh.buffer));
   const batchDigest=hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(mesh.batches))));
   if(mesh.vertices!==expected.vertices||digest!==expected.sha256||batchDigest!==expected.batchesSha256)throw Error('The complete route did not pass its integrity check.');
   self.postMessage({id,buffer:mesh.buffer,vertices:mesh.vertices,batches:mesh.batches},[mesh.buffer]);
  }catch(error){self.postMessage({id,error:error.message});}});};`;
  const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));worker=new Worker(url);
  // Firefox may still be reading a file-origin Blob when the constructor returns.
  // Release it only after the worker confirms it has started.
  worker.onmessage=e=>{URL.revokeObjectURL(url);const v=e.data,job=jobs.get(v.id);if(!job)return;
   if(v.progress!==undefined){try{const doc=document.getElementById('simFrame')?.contentDocument,app=doc?.defaultView.__Track2App,veil=doc?.getElementById('track2-route-loading');if(app?.state.route.name===job.name&&veil)veil.textContent='Preparing the complete '+job.name+' route… '+v.progress+'%';}catch{}return;}
   jobs.delete(v.id);if(v.error){job.reject(Error(v.error));return;}job.resolve({vertices:v.vertices,bytes:new Uint8Array(v.buffer),batches:v.batches});
  };
  worker.onerror=e=>{URL.revokeObjectURL(url);for(const job of jobs.values())job.reject(Error(e.message||'Route preparation failed.'));jobs.clear();worker.terminate();worker=null;};return worker;
 }
 async function ensure(name){
  if(meshes[name])return meshes[name];if(pending.has(name))return pending.get(name);
  if(!bundle.data[name]||!bundle.proof[name])throw Error('This offline edition does not include that route.');
  const job=new Promise((resolve,reject)=>{const id=++next;jobs.set(id,{name,resolve,reject});startWorker().postMessage({id,name,track:JSON.parse(inputs[name]),expected:bundle.proof[name]});}).then(mesh=>{
   meshes[name]=mesh;const at=recent.indexOf(name);if(at>=0)recent.splice(at,1);recent.push(name);while(recent.length>2)delete meshes[recent.shift()];return mesh;
  });pending.set(name,job);try{return await job;}finally{pending.delete(name);}
 }
 return{data:bundle.data,meshes,ensure};
}
