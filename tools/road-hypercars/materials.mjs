// Shared drawing materials and small hardware; the five cabin/body layouts are hand-authored.
export const path=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
export const text=(x,y,label,size=10,fill='#dce1e4',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${label}</text>`;
export const bolt=(x,y,r=3)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rhMetal)" stroke="#10151a"/><path d="M${x-r*.5} ${y}h${r}" stroke="#293138"/>`;
export const defs=`<defs>
 <linearGradient id="rhLeather" x2="0.15" y2="1"><stop stop-color="#424244"/><stop offset=".32" stop-color="#23262a"/><stop offset="1" stop-color="#0b0d10"/></linearGradient>
 <linearGradient id="rhTan" x2=".25" y2="1"><stop stop-color="#ba7950"/><stop offset=".5" stop-color="#8e4d2b"/><stop offset="1" stop-color="#4b281c"/></linearGradient>
 <linearGradient id="rhMetal" x2=".3" y2="1"><stop stop-color="#f0f0e9"/><stop offset=".25" stop-color="#899198"/><stop offset=".5" stop-color="#d6dce0"/><stop offset=".8" stop-color="#777e84"/><stop offset="1" stop-color="#c2c7ca"/></linearGradient>
 <linearGradient id="rhScreen" x2="0" y2="1"><stop stop-color="#14222a"/><stop offset="1" stop-color="#020507"/></linearGradient>
 <linearGradient id="rhGlass" x2=".3" y2="1"><stop stop-color="#79939a" stop-opacity=".6"/><stop offset=".5" stop-color="#233840" stop-opacity=".7"/><stop offset="1" stop-color="#0a1219"/></linearGradient>
 <radialGradient id="rhRim"><stop offset=".5" stop-color="#15181c"/><stop offset=".83" stop-color="#383a3c"/><stop offset="1" stop-color="#090b0e"/></radialGradient>
 <pattern id="rhCarbon" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="8" height="8" fill="#151b20"/><path d="M0 0h4v4H0zM4 4h4v4H4z" fill="#20272d"/><path d="M1 0v4M5 4v4" stroke="#30383e" stroke-width=".5"/></pattern>
 <pattern id="rhMesh" width="7" height="6" patternUnits="userSpaceOnUse"><rect width="7" height="6" fill="#05080a"/><path d="M0 2L3.5 0 7 2v2L3.5 6 0 4Z" stroke="#485057" stroke-width=".7" fill="none"/></pattern>
 <pattern id="rhPerforation" width="9" height="9" patternUnits="userSpaceOnUse"><rect width="9" height="9" fill="#767e83"/><circle cx="4.5" cy="4.5" r="2.4" fill="#080b0e"/></pattern>
 <pattern id="rhFoil" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#9d9b8b"/><path d="M0 0l5 5M-2 3l4-4M3 7l4-4" stroke="#d8d6c3" stroke-width="1"/></pattern>
</defs>`;
export function control(id,label,art,extra=''){
 return `<g role="button" tabindex="0" data-control="${id}" aria-label="${label}" ${extra}><title>${label}</title>${art}</g>`;
}
export function action(name,label,art,extra=''){
 return `<g role="button" tabindex="0" data-cabin-action="${name}" aria-label="${label}" ${extra}><title>${label}</title>${art}</g>`;
}
export function button(x,y,w,h,label,id,color='#aebbc4',size=9){
 return control(id,label,`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#13191e" stroke="#67747b"/>${text(x+w/2,y+h/2+size*.35,label,size,color,'text-anchor="middle"')}`);
}
export function dial(x,y,r,label,id){
 return control(id,label,`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rhMetal)" stroke="#11181d" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r-5}" fill="#14191e"/>${text(x,y+3,label,8,'#e5ecef','text-anchor="middle"')}<path d="M${x} ${y-r+1}v5" stroke="#f0e5d2" stroke-width="2"/>`);
}
export function vent(x,y,rx=25,ry=25){
 let blades=''; for(let a=0;a<360;a+=36)blades+=`<path d="M0 4L17 10 21 0 8 0Z" fill="#4d585e" stroke="#11181d" transform="rotate(${a})"/>`;
 return `<g transform="translate(${x} ${y}) scale(${rx/25} ${ry/25})"><circle r="25" fill="url(#rhMetal)"/><circle r="22" fill="#05090d"/>${blades}<circle r="6" fill="url(#rhMetal)"/></g>`;
}
export function ticks(cx,cy,r,max,count=40,start=-130,end=130,color='#d8dde0'){
 let s='';for(let i=0;i<=count;i++){const a=(start+(end-start)*i/count-90)*Math.PI/180,major=i%4===0;
  const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,l=major?9:4;
  s+=`<path d="M${x.toFixed(2)} ${y.toFixed(2)}l${(-Math.cos(a)*l).toFixed(2)} ${(-Math.sin(a)*l).toFixed(2)}" stroke="${color}" stroke-width="${major?1.6:.8}"/>`;
  if(major)s+=text(cx+Math.cos(a)*(r-18),cy+Math.sin(a)*(r-18)+3,Math.round(max*i/count),8,color,'text-anchor="middle"');
 }return s;
}
export const needle=(id,x,y,length,max=0)=>`<g id="${id}" data-cx="${x}" data-cy="${y}" data-a0="-130" data-a1="130" ${max?`data-max="${max}"`:''}><path d="M${x-2} ${y+9}L${x} ${y-length}l2 ${length+9}Z" fill="#f4663f"/><circle cx="${x}" cy="${y}" r="4" fill="url(#rhMetal)"/></g>`;
export function revSegments(x,y,w=230,n=36,color='#eee6da'){
 return `<g id="cabRevSegs" data-on="${color}" data-off="#26323b" data-redcol="#ff493b">${Array.from({length:n},(_,i)=>`<rect x="${x+i*w/n}" y="${y-i*.22}" width="${w/n-2}" height="9" rx="1"/>`).join('')}</g>`;
}
export function paddles(x,y,span=118){return control('downPaddle','Downshift',path(`M${x-span} ${y-66}q-15 25-6 81l13-3 1-83Z`,'url(#rhMetal)')+text(x-span,y-29,'−',15,'#111','text-anchor="middle"'))+control('upPaddle','Upshift',path(`M${x+span} ${y-66}q15 25 6 81l-13-3-1-83Z`,'url(#rhMetal)')+text(x+span,y-29,'+',13,'#111','text-anchor="middle"'));}
export function startCabin(label){return `<svg viewBox="0 0 1000 520" role="group" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><title>${label}</title>${defs}<style>
 text{font-family:Arial,sans-serif} [role=button]{cursor:pointer;outline:none} [role=button]:hover{filter:brightness(1.35)} [role=button]:focus-visible{filter:drop-shadow(0 0 5px #83dbff)} [aria-pressed=true]>rect:first-of-type,[aria-pressed=true]>circle:first-of-type{stroke:#9cd8ca;stroke-width:2.5}
 .stitch{fill:none;stroke:#96775a;stroke-width:1;stroke-dasharray:3 3}.edge{fill:none;stroke:#747b80;stroke-width:1.5}.fine{fill:none;stroke:#41484e;stroke-width:1}
 </style><rect width="1000" height="520" fill="#090e13"/>
 <path d="M70 0H930L993 165Q504 121 8 165Z" fill="url(#rhGlass)"/>
 <path d="M0 0H65L130 156 49 242 0 221ZM935 0H1000V226L953 230 873 156Z" fill="url(#rhCarbon)"/>
 <path d="M0 0H1000V19Q510 3 0 19Z" fill="#090c0f"/>
 <path d="M163 112Q491 72 830 112" fill="none" stroke="#92a7ac" opacity=".14"/>
 <rect x="424" y="28" width="150" height="39" rx="10" fill="#070b0e" stroke="#515d65"/><path d="M434 34h132v25H434Z" fill="url(#rhGlass)"/>`;
}
export const endCabin='</svg>';
export function namespaceMaterials(svg,prefix){
 const names=['rhLeather','rhTan','rhMetal','rhScreen','rhGlass','rhRim','rhCarbon','rhMesh','rhPerforation','rhFoil'];
 for(const name of names)svg=svg.replaceAll(`id="${name}"`,`id="${prefix}${name}"`).replaceAll(`url(#${name})`,`url(#${prefix}${name})`);
 return svg;
}
