(function(){
 const {data,catalog}=window.TRACK2_CATALOG,meshes={},pending=new Map(),recent=[];
 window.TRACK2_ASSETS ||= {};
 const root=document.currentScript?.src?new URL('.',document.currentScript.src).href:new URL('assets/tracks-2/',document.baseURI).href;
 async function ensure(name){
  if(meshes[name])return meshes[name];if(pending.has(name))return pending.get(name);
  const job=(async()=>{const entry=catalog[name];if(!entry)throw Error('No Track 2.0 geometry for '+name);
   if(!window.TRACK2_ASSETS[entry.id])await new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=root+entry.file;el.onload=()=>{el.remove();resolve();};el.onerror=()=>{el.remove();reject(Error('Please check the connection and try again.'));};document.head.appendChild(el);});
   const packed=window.TRACK2_ASSETS[entry.id],bytes=Uint8Array.from(atob(packed.gzip),c=>c.charCodeAt(0));
   const unpacked=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
   const mesh={vertices:packed.vertices,bytes:decodeMesh(new Uint8Array(unpacked),packed.codec,packed.vertices),batches:packed.batches};meshes[name]=mesh;
   const i=recent.indexOf(name);if(i>=0)recent.splice(i,1);recent.push(name);while(recent.length>2)delete meshes[recent.shift()];return mesh;
  })();pending.set(name,job);try{return await job;}finally{pending.delete(name);}
 }
 window.TRACK2_UNPACK=Promise.resolve({data,meshes,ensure});window.TRACK2_READY ||= window.TRACK2_UNPACK;
})();
