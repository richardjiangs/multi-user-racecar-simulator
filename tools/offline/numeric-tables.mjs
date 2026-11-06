// Losslessly store large decimal coordinate tables as column-wise integer deltas.
// Every value must round-trip with ===; tables that cannot do so remain ordinary JSON.
export function decodeTables(bytes){
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),length=view.getUint32(0,true),header=JSON.parse(new TextDecoder().decode(bytes.subarray(4,4+length))),start=4+length;
 const tables=header.tables.map(([rows,columns,scales,offset,size])=>{let pos=start+offset;const out=Array.from({length:rows},()=>Array(columns));for(let col=0;col<columns;col++){let prev=0;for(let row=0;row<rows;row++){let n=0,m=1,b;do{b=bytes[pos++];n+=(b&127)*m;m*=128;}while(b>=128);prev+=n%2?-(n+1)/2:n/2;out[row][col]=prev/scales[col];}}if(pos!==start+offset+size)throw Error('Invalid offline coordinate table');return out;});
 function restore(v){if(!v||typeof v!=='object')return v;if(!Array.isArray(v)&&Object.keys(v).length===1&&Number.isInteger(v.$offlineTable))return tables[v.$offlineTable];for(const k of Object.keys(v))v[k]=restore(v[k]);return v;}
 return restore(header.bundle);
}
export function encodeTables(bundle){
 const tables=[],parts=[];let offset=0;
 function visit(v){
  if(!v||typeof v!=='object')return v;
  if(Array.isArray(v)&&v.length>32&&Array.isArray(v[0])&&v[0].length>0&&v[0].length<=8&&v.every(r=>Array.isArray(r)&&r.length===v[0].length&&r.every(Number.isFinite))){
   const cols=v[0].length,scales=Array.from({length:cols},(_,col)=>[1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000].find(s=>v.every(r=>{const n=Math.round(r[col]*s);return Math.abs(n)<2**50&&n/s===r[col];})));
   if(scales.every(Boolean)){
    const bytes=[];for(let col=0;col<cols;col++){let prev=0;for(const row of v){const n=Math.round(row[col]*scales[col]),delta=n-prev;prev=n;let z=delta<0?-delta*2-1:delta*2;while(z>=128){bytes.push(z%128+128);z=Math.floor(z/128);}bytes.push(z);}}
    const data=Buffer.from(bytes),id=tables.length;tables.push([v.length,cols,scales,offset,data.length]);parts.push(data);offset+=data.length;return{$offlineTable:id};
   }
  }
  return Array.isArray(v)?v.map(visit):Object.fromEntries(Object.entries(v).map(([k,x])=>[k,visit(x)]));
 }
 const packed=visit(bundle),header=Buffer.from(JSON.stringify({bundle:packed,tables})),length=Buffer.alloc(4);length.writeUInt32LE(header.length);const result=Buffer.concat([length,header,...parts]);
 if(JSON.stringify(decodeTables(result))!==JSON.stringify(bundle))throw Error('Coordinate table encoding changed source values.');return result;
}
