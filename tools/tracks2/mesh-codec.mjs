/* Lossless mesh storage. Byte patterns, draw order, positions and colours round-trip
   exactly. Index blocks are local to spatial batches to bound the encoder's memory. */
import {gzipSync} from 'node:zlib';
export function shuffle(bytes){const N=bytes.length/16,out=Buffer.alloc(bytes.length);for(let k=0;k<4;k++){let prev=0;for(let i=0;i<N;i++){const v=bytes.readUInt32LE(i*16+k*4),delta=k===3?v:v^prev;prev=v;for(let q=0;q<4;q++)out[(k*4+q)*N+i]=(delta>>>(q*8))&255;}}return out;}
export function unshuffle(bytes){const N=bytes.length/16,out=new Uint8Array(bytes.length),view=new DataView(out.buffer);for(let k=0;k<4;k++){let prev=0;for(let i=0;i<N;i++){let v=0;for(let q=0;q<4;q++)v|=bytes[(k*4+q)*N+i]<<(q*8);if(k!==3)v^=prev;prev=v;view.setUint32(i*16+k*4,v,true);}}return out;}
export function indexed(bytes,batches,shuffled=false){const chunks=[];for(const batch of batches){const unique=new Map(),verts=[],indices=[];let previous=0;for(let i=batch.first;i<batch.first+batch.count;i++){const vertex=bytes.subarray(i*16,i*16+16),key=vertex.toString('base64');let index=unique.get(key);if(index===undefined){index=unique.size;unique.set(key,index);verts.push(vertex);}let diff=index-previous,value=(diff<<1)^(diff>>31);previous=index;while(value>=128){indices.push((value&127)|128);value>>>=7;}indices.push(value);}const header=Buffer.alloc(8);header.writeUInt32LE(unique.size,0);header.writeUInt32LE(batch.count,4);const raw=Buffer.concat(verts);chunks.push(header,shuffled?shuffle(raw):raw,Buffer.from(indices));}return Buffer.concat(chunks);}
export function decodeMesh(bytes,codec,vertices){
 if(codec==='xor-planes')return unshuffle(bytes);
 if(!codec||codec==='raw')return bytes;
 if(codec!=='indexed'&&codec!=='indexed-xor')throw Error('Unknown track mesh codec '+codec);
 const out=new Uint8Array(vertices*16),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let at=0,dest=0;
 while(at<bytes.length){const unique=view.getUint32(at,true),count=view.getUint32(at+4,true);at+=8;if(at+unique*16>bytes.length)throw Error('Truncated mesh');let values=bytes.subarray(at,at+unique*16);if(codec==='indexed-xor')values=unshuffle(values);at+=unique*16;let index=0;
  for(let i=0;i<count;i++){let value=0,shift=0,b;do{if(at>=bytes.length||shift>28)throw Error('Invalid mesh index');b=bytes[at++];value|=(b&127)<<shift;shift+=7;}while(b&128);index+=(value>>>1)^-(value&1);if(index<0||index>=unique||dest+16>out.length)throw Error('Mesh index out of bounds');out.set(values.subarray(index*16,index*16+16),dest);dest+=16;}
 }if(dest!==out.length)throw Error('Incomplete mesh');return out;
}
export function encodeMesh(bytes,batches){let best={codec:'raw',gzip:gzipSync(bytes,{level:9})};for(const codec of ['xor-planes','indexed','indexed-xor']){const packed=codec==='xor-planes'?shuffle(bytes):indexed(bytes,batches,codec==='indexed-xor'),gzip=gzipSync(packed,{level:9});if(gzip.length<best.gzip.length)best={codec,gzip};}return best;}
