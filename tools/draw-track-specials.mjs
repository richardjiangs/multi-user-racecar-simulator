// Original hand-drawn coordinates. Shared helpers only repeat fasteners, vents and materials.
// Reference photographs and source notes: docs/TRACK_SPECIALS_ART.md.
import {mkdirSync,writeFileSync} from 'node:fs';
const out=new URL('./track-specials-art/',import.meta.url);mkdirSync(out,{recursive:true});
const p=(d,f='#171c21',s='#69747d',sw=1.5,attrs='')=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${sw}" ${attrs}/>`;
const r=(x,y,w,h,f='#10171c',rx=4,s='#49545d',attrs='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" stroke="${s}" ${attrs}/>`;
const c=(x,y,R,f='#080d11',s='#7b8790',sw=2,attrs='')=>`<circle cx="${x}" cy="${y}" r="${R}" fill="${f}" stroke="${s}" stroke-width="${sw}" ${attrs}/>`;
const t=(x,y,txt,size=12,col='#d8e3e8',attrs='')=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${col}" ${attrs}>${txt}</text>`;
const line=(d,col='#adb9c2',w=2,attrs='')=>p(d,'none',col,w,attrs);
const bolts=(pts)=>pts.map(([x,y])=>c(x,y,3,'#c3cbd1','#38424c',1)+line(`M${x-1.5} ${y}h3`,'#242c34',1)).join('');
const defs=`<defs>
 <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f0f3f4"/><stop offset=".25" stop-color="#858f98"/><stop offset=".5" stop-color="#dde4e6"/><stop offset=".8" stop-color="#505c67"/><stop offset="1" stop-color="#9ca7b0"/></linearGradient>
 <linearGradient id="carbonShade" x2=".75" y2="1"><stop stop-color="#353c41"/><stop offset=".5" stop-color="#12171b"/><stop offset="1" stop-color="#03070a"/></linearGradient>
 <pattern id="weave" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><rect width="9" height="9" fill="#141b20"/><path d="M0 1h5M4 5h5" stroke="#39444a" stroke-width="2"/><path d="M1 0v5M6 4v5" stroke="#222c32" stroke-width="2"/></pattern>
 <linearGradient id="rubber" x2=".8" y2="1"><stop stop-color="#3d4144"/><stop offset=".35" stop-color="#111417"/><stop offset=".85" stop-color="#020406"/><stop offset="1" stop-color="#242c31"/></linearGradient>
 <radialGradient id="tyre"><stop stop-color="#1b2329"/><stop offset=".65" stop-color="#05080a"/><stop offset=".88" stop-color="#22292e"/><stop offset="1" stop-color="#020406"/></radialGradient>
 <linearGradient id="glass" x2=".2" y2="1"><stop stop-color="#8ba5b5"/><stop offset=".24" stop-color="#3f5867"/><stop offset=".65" stop-color="#101f2a"/><stop offset="1" stop-color="#060b10"/></linearGradient>
 <linearGradient id="silver" x2=".15" y2="1"><stop stop-color="#f8fafb"/><stop offset=".3" stop-color="#aebbc5"/><stop offset=".47" stop-color="#e9eef1"/><stop offset=".75" stop-color="#65737e"/><stop offset="1" stop-color="#202d38"/></linearGradient>
 <linearGradient id="blue" x2="0" y2="1"><stop stop-color="#95b0d2"/><stop offset=".28" stop-color="#425d8b"/><stop offset=".52" stop-color="#172c59"/><stop offset=".76" stop-color="#3c5180"/><stop offset="1" stop-color="#0d1636"/></linearGradient>
 <linearGradient id="red" x2=".2" y2="1"><stop stop-color="#ff8584"/><stop offset=".2" stop-color="#e32b36"/><stop offset=".48" stop-color="#9b091a"/><stop offset=".74" stop-color="#490d15"/><stop offset="1" stop-color="#18090e"/></linearGradient>
 <linearGradient id="white" x2="0" y2="1"><stop stop-color="#f7fafb"/><stop offset=".5" stop-color="#b7c3c9"/><stop offset="1" stop-color="#555f69"/></linearGradient>
 <linearGradient id="titanium" x2="1" y2=".4"><stop stop-color="#8a7660"/><stop offset=".22" stop-color="#e5d5b8"/><stop offset=".47" stop-color="#736560"/><stop offset=".72" stop-color="#b0afbc"/><stop offset="1" stop-color="#6b78a0"/></linearGradient>
 <linearGradient id="suede" x2=".4" y2="1"><stop stop-color="#404346"/><stop offset=".45" stop-color="#191d21"/><stop offset="1" stop-color="#090d10"/></linearGradient>
</defs>`;
const svg=(name,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${h}" role="img" aria-label="${name}" data-hand-drawn="2026-09-12">${defs}${body}</svg>`;
const save=(name,h,title,body)=>{
 const materials='metal|carbonShade|weave|rubber|tyre|glass|silver|blue|red|white|titanium|suede';
 // Each inline panel needs its own paint definitions: another panel can be display:none.
 const drawing=svg(title,h,body).replace(new RegExp('id="('+materials+')"','g'),(_,id)=>'id="'+name+'-'+id+'"').replace(new RegExp('url\\(#('+materials+')\\)','g'),(_,id)=>'url(#'+name+'-'+id+')');
 writeFileSync(new URL(name+'.svg',out),drawing);
};
const studio=r(0,0,1000,450,'#0e151d',0,'none')+p('M0 357H1000V450H0Z','#080e14','none')+line('M0 370H1000','#233440',1)+`<ellipse cx="505" cy="366" rx="450" ry="20" fill="#000" opacity=".75"/>`;
function wheel(x,y,R,spokes=10,accent='#8d969d',slick=false){let q=c(x,y,R,'url(#tyre)','#060b10',3)+c(x,y,R*.85,'#161f26','#343e46',2)+c(x,y,R*.72,'url(#metal)','#48545f',2)+c(x,y,R*.6,'#292e32','#5b6065',1);
for(let i=0;i<26;i++){const a=i*Math.PI*2/26;q+=c(x+Math.cos(a)*R*.55,y+Math.sin(a)*R*.55,1.4,'#060a0e','none',0);}
q+=p(`M${x+R*.39} ${y-R*.37}q18 25 0 ${R*.72}l-11-6v-${R*.59}z`,accent,'#12181d',1);
q+=`<g class="wheel-spin" style="transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg))">`;
for(let i=0;i<spokes;i++)q+=p(`M-6-8L-4-${R*.72}L5-${R*.79}L9-${R*.73}L5-8Z`,'url(#metal)','#26313b',1,`transform="translate(${x} ${y}) rotate(${i*360/spokes})"`);q+='</g>'+c(x,y,R*.17,'#17232b',accent,2)+c(x,y,R*.07,'#bbc7cf','#3b4f5d',2);
if(slick)q+=`<path d="M${x-R*.64} ${y-R*.61}A${R*.89} ${R*.89} 0 0 1 ${x+R*.64} ${y-R*.61}" fill="none" stroke="${accent}" stroke-width="2"/>`+t(x,y-R*.76,'RACING',7,accent,'text-anchor="middle" letter-spacing="2"');return q;}
const vent=(x,y,R)=>c(x,y,R,'url(#metal)','#070b0e',3)+c(x,y,R*.83,'#020507','#58626c',1)+[-.35,0,.35].map(d=>line(`M${x-R*.7} ${y+R*d}q${R*.7} ${R*.2} ${R*1.4} 0`,'#59636b',2)).join('');
function dial(x,y,R,max=8,id=''){let q=c(x,y,R,'#040a0e','url(#metal)',3)+c(x,y,R*.91,'#080d10','#303c44',1);for(let i=0;i<=max;i++){const a=(140+i*260/max)*Math.PI/180;const xx=x+Math.cos(a)*R*.72,yy=y+Math.sin(a)*R*.72;q+=line(`M${x+Math.cos(a)*R*.86} ${y+Math.sin(a)*R*.86}L${x+Math.cos(a)*R*.95} ${y+Math.sin(a)*R*.95}`,i>=max-1?'#ea4a46':'#e0e9ed',2)+t(xx,yy+4,i,11,'#d8e1e5','text-anchor="middle"');}q+=line(`M${x} ${y}l${Math.cos(140*Math.PI/180)*R*.75} ${Math.sin(140*Math.PI/180)*R*.75}`,'#f25145',2.5,id?`id="${id}" data-live="needle" data-cx="${x}" data-cy="${y}" data-max-rpm="${max*1000}"`:'')+c(x,y,5,'#28353f','#aebbc4',1);return q;}
const live=(id,x,y,txt,size=18,col='#f2f6f8',extra='')=>t(x,y,txt,size,col,`id="${id}" data-live="text" text-anchor="middle" font-weight="700" ${extra}`);
function button(x,y,label,color,action){return `<g ${action?`data-control="${action}" role="button" tabindex="0" aria-label="${label}"`:''}>${c(x,y,9,'#0a1015',color,2)}${c(x,y,4,color,'none',0)}${t(x,y+19,label,7,'#dbe4e7','text-anchor="middle"')}</g>`;}
const seat=(x,y,color='#153455')=>p(`M${x-58} ${y+150}l7-136q5-24 26-28l3-48q22-24 44 0l3 48q21 4 26 28l7 136z`,'url(#weave)','#46565f',2)+p(`M${x-37} ${y+130}l5-118q32-20 64 0l5 118z`,color,'#202c34')+line(`M${x-17} ${y-23}l-5 153M${x+17} ${y-23}l5 153`,'#c5d334',12)+r(x-15,y+69,30,20,'#3b4348',3,'#adb6bc');

// VIPER: long front clamshell, rear-biased cabin, swept gill, sill exhaust and tall two-element wing.
save('viper-exterior',450,'Dodge Viper ACR Extreme Aero — hand-drawn driver-side profile',studio+
p('M39 320L950 324L962 340L36 345Z','url(#weave)','#72818b',1)+
`<g id="rearWingArt">${p('M129 240L140 133L152 134L153 242M228 213L238 137L250 139L244 225','url(#weave)','#737f89',1)}${p('M58 113Q168 102 289 112L280 130L64 137Z','url(#carbonShade)','#8e9aa3',2)}${p('M58 126L280 123L274 138L60 145Z','#10191f','#8998a3',1)}${p('M57 106L59 155L76 153L81 111Z','url(#weave)','#9da9b1',1)}</g>`+
`<g id="bcBody">${p('M70 317L133 324L159 320A81 93 0 0 1 321 325L663 325A87 97 0 0 1 837 326L936 324L957 304L949 277C918 251 873 237 824 228L620 207C589 168 548 144 500 139C455 134 418 151 384 178L326 217Q285 205 238 211Q183 213 151 230L107 238Q64 246 62 275Z','url(#silver)','#c5d1d9',2)}
${p('M389 213L427 167Q462 145 499 150Q548 155 592 206L570 215Z','url(#glass)','#12212c',2)}${line('M444 162L463 211','#c8d2d7',7)}${line('M447 161L466 211','#17232b',3)}
${p('M601 213L781 227L879 249L850 259L684 244Z','#d7e0e6','none')}${p('M619 217L651 224L679 253L662 258L612 236Z','#091119','#97a6b0',1)}
${[0,1,2].map(i=>p(`M${688+i*47} ${234+i*4}l37 6-16 13-35-6z`,'#081019','#a1afb8',1)).join('')}
${p('M639 239Q668 241 687 257L654 299L611 300Q625 272 639 239Z','#03080b','#627785',2)}${line('M642 244L666 260L643 290','#b81320',4)}
<g id="doorArt">${p('M381 220L594 216L610 308L350 306L360 264Z','transparent','#5d6f7b',1.5)}${p('M559 232l25-2 3 7-26 3z','#273943','#b4c1ca',1)}${line('M373 291Q484 277 599 297','#d9e3e8',2)}</g>
${p('M358 314L634 314L617 333L345 331Z','url(#weave)','#576b78',1)}${p('M886 261Q931 272 940 282L889 283L859 269Z','#c8e9f7','#526c7c',2)}${line('M890 267L930 278','#fff',3)}
${p('M68 267L116 259L116 277L64 284Z','#c9212e','#70101b',1)}${line('M78 291L148 286','#162d3d',6)}${t(547,288,'ACR',20,'#972431','font-style="italic"')}${p('M591 184l34 6 5 15-29-4z','url(#silver)','#5e6f7c',1)}
</g><g id="quadExhaustArt">${p('M332 319h43v11h-43z','url(#metal)','#344550',1)}${r(339,321,28,7,'#010507',3,'#3c4b57')}</g>
<g id="frontFlapArt">${p('M876 323L970 314L963 339L850 342Z','url(#weave)','#637582',1)}${p('M906 291l44-4-2 10-48 5zM911 305l44-5-3 9-48 5z','#121e27','#6e8795',1)}</g>
${wheel(240,301,64,10,'#c02e37')}${wheel(749,302,62,10,'#c02e37')}`);

// MCXtrema: the unusually long wedge nose, roof snorkel, uninterrupted rear buttress and high fin.
save('mcx-exterior',450,'Maserati MCXtrema — hand-drawn Blu Xtrema number 24 profile',studio+
p('M44 332L966 332L952 348L47 348Z','url(#weave)','#708496',1)+
`<g id="rearWingArt">${p('M134 237L128 146L144 146L160 237M271 209L271 148L284 148L293 221','url(#weave)','#7b8d9c',1)}${p('M49 124L322 136L314 157L63 153Z','url(#weave)','#b7c1c9',1.5)}${p('M42 129L63 137L75 208L62 209Z','url(#weave)','#8d9ba7',1)}${t(188,147,'Maserati',19,'#e4ebf2','text-anchor="middle" font-style="italic"')}</g>`+
`<g id="bcBody">${p('M66 316L147 324A80 100 0 0 1 307 329L664 329A83.5 94 0 0 1 831 328L945 327L929 289C900 281 866 253 826 240Q787 215 746 215Q704 216 674 227L651 224L578 181Q535 156 476 153L419 157L361 194L151 222L83 235Z','url(#blue)','#7e90ad',1.7)}
${p('M141 221L367 190L402 157L419 155L377 220Z','url(#weave)','#8897a4',1)}${p('M397 217L429 167L492 165Q532 165 569 188L621 223Z','url(#glass)','#788b9d',1.5)}${line('M398 218L430 164Q516 151 574 187L627 225','#182b40',7)}
${p('M477 153L492 140L531 145L544 159','url(#weave)','#9ba8b6',1)}${p('M177 222L373 170L379 220Z','url(#blue)','#8799b2',1)}
<g id="doorArt">${p('M397 221L622 227L650 302L610 331L390 325L374 268Z','url(#blue)','#101d31',1.5)}${t(491,298,'24',62,'#d6e1e9','font-weight="700" font-style="italic"')}${p('M614 223l25 6 4 15-28-7z','url(#weave)','#8c9ca9',1)}</g>
${p('M306 250L373 262L398 325L313 326Z','#050b11','#294359',1)}${p('M646 281L688 273L670 331L615 331Z','url(#weave)','#566e84',1)}${p('M833 275L927 291L956 327L837 326Z','#0a1421','#2a4054',1)}
${p('M865 267L929 292L897 292L848 274Z','#c9dce9','#24394d',1)}${line('M78 276L141 276','#ff3540',4)}${t(164,219,'MASERATI CORSE',8,'#dfebf3')}${t(575,344,'NO STEP',7,'#d39591')}${p('M390 203l-6-19 10-2 3 18z','#ec434d','#131e29',1)}
</g><g id="quadExhaustArt">${c(78,304,7,'#03080c','url(#titanium)',3)}</g><g id="frontFlapArt">${p('M842 328L968 327L967 338L833 344Z','url(#weave)','#7b8f9f',1)}</g>
${wheel(224,302,64,12,'#d4dc52',true)}${wheel(748,302,62,12,'#d4dc52',true)}`);

// AURORA AGIL: floating painted wheel pods around a deeply exposed ZM1 carbon chassis.
save('zenvo-exterior',450,'Zenvo Aurora Agil — hand-drawn exposed-carbon and red body profile',studio+
p('M39 325Q169 330 302 331L674 331L943 327L955 343L35 345Z','url(#weave)','#71868c',1)+
`<g id="rearWingArt">${p('M866 235L879 167L891 165L885 236M920 238L930 174L941 178L938 245','url(#weave)','#566b70',2)}${p('M839 159Q894 138 970 155L955 177L848 180Z','url(#weave)','#93b7bb',2)}${p('M955 150l29 6-14 24-24-7z','#1c2a30','#749ca2',1)}</g>`+
`<g id="bcBody">${p('M320 218L375 186Q428 154 484 150L543 153Q623 163 705 195L832 229L823 326L323 327Z','url(#weave)','#596b70',1.5)}
${p('M347 215L395 181Q434 162 479 163L531 166L599 203L566 219Z','url(#glass)','#7b939b',1.5)}${p('M536 157L602 169L703 196L764 219L582 218Z','url(#carbonShade)','#718388',1)}${line('M537 155L539 213','#414e55',4)}${c(568,187,12,'#121d24','#849399',2)}
${p('M51 307L88 267Q132 222 198 219Q254 211 298 234L319 264L301 326L288 326A71 99 0 0 0 146 328L82 323Z','url(#red)','#f16f73',1.5)}
${p('M302 235L520 222L567 231L531 245L321 253Z','url(#red)','#d95358',1.5)}${p('M554 230Q655 205 744 207Q823 194 888 236L913 282L904 328L861 329A70 105 0 0 0 722 334L686 323Q617 288 554 230Z','url(#red)','#db5c64',1.5)}
<g id="doorArt">${p('M320 255L530 246L557 263L535 326L344 326L320 289L352 278Z','url(#carbonShade)','#52676e',1.5)}${line('M335 252L520 244','#64838a',2)}${p('M333 270l31 11-25 23-21-2 30-21z','url(#metal)','#0b202a',1)}</g>
${p('M50 307L108 290L138 316L141 337L35 337Z','url(#weave)','#566d73',1)}${p('M83 265L124 246L120 264L77 285Z','#d4f2f7','#638b99',1)}${line('M83 269L119 251','#fff',4)}
${p('M875 244l58 13-22 11-28-9z','#152229','#758b8f',1)}${line('M893 254L923 260','#f64845',3)}${p('M389 195l-30-3-14 10 17 11 26-4z','url(#carbonShade)','#6d9298',1)}${p('M365 211l-4 14','#142429','#3b5862',5)}
</g><g id="frontFlapArt">${p('M40 316L93 315L70 329L34 327Z','url(#weave)','#7c989e',1)}</g><g id="quadExhaustArt">${p('M910 285l25 4-5 18-21-3z','url(#titanium)','#253940',1)}${p('M916 290l14 2-3 11-12-1z','#020609','#61757c',1)}</g>
${wheel(221,302,65,14,'#748f96')}${wheel(794,302,65,14,'#748f96')}`);

// 2024 9X8: low constant-height wheel pods, vertical three-claw lights, new rear wing.
save('peugeot-exterior',450,'Peugeot 9X8 2024 number 94 — hand-drawn Le Mans Hypercar profile',studio+
p('M44 330L951 332L949 347L37 347Z','#071114','#65777d',1)+
`<g id="rearWingArt">${p('M832 269L842 197L855 198L850 268M922 264L929 187L941 187L937 270','url(#weave)','#657f85',1)}${p('M778 185L959 176L968 191L801 207Z','#d5e339','#dee9a7',1)}${p('M952 171L972 174L975 220L950 218Z','#142024','#6c858e',1)}${t(866,193,'PEUGEOT',14,'#182419','text-anchor="middle" letter-spacing="3"')}</g>`+
`<g id="bcBody">${p('M49 321L117 325A83.5 100 0 0 1 284 331L704 331A81 100 0 0 1 866 330L947 327L946 235Q908 219 846 222L729 214L648 176Q619 157 579 158L479 162L420 192L340 227L211 215Q125 215 83 255L51 278Z','url(#white)','#b2c6cf',1.6)}
${p('M351 228L448 186Q476 174 496 175L566 172L603 202L564 223Z','url(#glass)','#253843',2)}${line('M436 193L451 224M575 177L604 207','#e1e9ec',5)}${p('M479 157L493 145L539 145L551 158','url(#weave)','#98a9b0',1)}
${p('M584 160L649 172L754 216L653 214Z','url(#weave)','#8c9fa7',1)}${t(663,192,'TotalEnergies',13,'#f0f6f8','transform="rotate(17 663 192)"')}
<g id="doorArt">${p('M429 229L567 223L593 269L567 329L367 328L377 266Z','transparent','#3b4f57',1.5)}${p('M379 246L450 242L439 257L379 261Z','#d2df2e','none')}</g>
${p('M287 254L372 250L355 328L292 329Z','#142125','#44585f',1)}${p('M288 259L309 239L329 250L319 277L341 289L335 312L313 302L307 278L289 283Z','#dce6e9','#253940',1)}
${p('M399 269L456 256L482 264L428 290L397 317L373 318Z','#19262b','none')}${p('M464 237L490 235L465 277L451 277ZM490 233L511 231L489 266L474 271ZM519 231L538 229L516 260L501 264Z','#19262b','none')}
${p('M569 224L607 212L666 226L625 241L649 256L618 272L640 293L602 315L579 316L605 285L590 267L615 247Z','#d7e32e','none')}${p('M701 252L723 233L737 240L728 265L710 272Z','#253439','none')}
${p('M813 236L831 230L856 258L841 273Z','#17272c','none')}${p('M854 282L883 264L916 269L929 293L917 312L883 310Z','#28393d','none')}
${r(552,277,56,44,'#d72131',1,'#fcf1f0')}${t(580,309,'94',32,'#fff','text-anchor="middle" font-weight="900"')}${t(453,311,'PEUGEOT',12,'#e2e9ed','text-anchor="middle" letter-spacing="2"')}${t(669,318,'HYBRID',9,'#101e24','letter-spacing="2"')}
${p('M86 274L123 261L122 312L73 316Z','#061318','#537482',1)}${[0,1,2].map(i=>line(`M${92+i*10} ${275-i*3}l-6 31`,'#e8fdff',3)).join('')}${[0,1,2].map(i=>line(`M${921+i*8} 274v44`,'#ea3338',4)).join('')}
${p('M374 216l-30-9-14 8 11 14 30-1z','#16282e','#8caaad',1)}${line('M353 228L360 241','#334e55',4)}${line('M67 318L118 318','#d5e53a',7)}
</g><g id="frontFlapArt">${p('M37 329L127 327L124 339L35 341Z','url(#weave)','#9baeb1',1)}</g><g id="quadExhaustArt">${c(941,257,7,'#040a0d','url(#titanium)',3)}</g>
${wheel(199,304,59,10,'#d9e3e9',true)}${wheel(786,304,60,10,'#d9e3e9',true)}`);

// VIPER cabin: one physical tach, digital information to the left, four round vents and manual console.
save('viper-cockpit',500,'Dodge Viper ACR — suede wheel, analogue tachometer and Uconnect cockpit',
p('M0 161Q181 103 376 110Q583 112 780 144L1000 199V500H0Z','url(#suede)','#657079',2)+
p('M0 207L68 0L130 0L61 215M1000 204L909 0L858 0L948 204','url(#weave)','#4e5b64',2)+
line('M12 163Q239 88 463 122Q733 142 983 202','#bec7c9',1,'stroke-dasharray="3 3"')+
p('M166 220L174 158Q239 95 371 126Q420 135 448 186L440 231Z','#080d11','#74818a',2)+
r(193,163,102,66,'#091219',5,'#263b49')+live('cabSpeedArt',240,199,'0',30)+t(240,216,'KM/H',9,'#a9bbc6','text-anchor="middle"')+dial(354,186,57,7,'cabTachNeedle')+live('cabGearArt',354,213,'N',13)+
vent(101,232,33)+vent(582,169,29)+vent(662,172,29)+vent(921,235,29)+
p('M527 208L720 220L769 408L537 408Z','url(#weave)','#9ca8ae',2)+r(551,227,161,100,'#02080c',7,'url(#metal)')+r(559,235,145,80,'#0a161c',2,'#273e4b')+
t(631,252,'SRT PERFORMANCE',11,'#ed4b49','text-anchor="middle"')+line('M574 283h113M574 287h113','#394e5a',1)+live('cabPageArt',631,274,'G-METER',10,'#f6d1ce')+live('cabGArt',631,307,'0.00 G',20,'#f0f6f8')+
c(568,339,14,'#111c24','url(#metal)',2)+c(706,348,14,'#111c24','url(#metal)',2)+c(637,366,22,'#111d26','url(#metal)',2)+t(637,370,'AUTO',8,'#e3edf1','text-anchor="middle"')+
button(606,339,'HAZARD','#da4749','hazardBtn')+button(759,244,'START','#db473a','ignitionBtn')+
p('M537 387L772 409L865 500H532Z','url(#suede)','#b6c1c6',1.5)+p('M592 459Q574 435 610 416Q644 403 669 431L698 465Z','#151a20','#626b74',2)+
p('M618 437L620 395L633 395L638 440','url(#metal)','#37424c',1)+c(626,388,19,'url(#suede)','url(#metal)',1)+t(626,391,'1 3 5',6,'#eef5f8','text-anchor="middle"')+t(626,399,'2 4 6',6,'#eef5f8','text-anchor="middle"')+
p('M730 464L680 398L690 389L750 452Z','#111820','#8c999f',2)+line('M768 251Q852 259 941 283','#a9b5ba',1,'stroke-dasharray="3 3"')+t(848,254,'ACR',20,'#b72935','font-style="italic"')+
`<g id="cabinWheelG" transform="translate(327 340)">${p('M-95-79Q-42-125 29-109Q100-91 112-17Q120 58 63 97L-56 101Q-112 63-113-8Q-114-55-95-79Z','none','url(#rubber)',23)}${p('M-94-77Q-42-117 29-103Q95-86 105-17Q113 55 58 93L-53 94Q-105 60-106-8Q-107-52-94-77Z','none','#b8c0c2',1,'stroke-dasharray="3 3"')}${p('M-95-13L-36-25L29-23L95-9L90 29L37 27L20 80L-16 80L-43 25L-91 29Z','url(#weave)','#586770',2)}${c(0,2,41,'url(#suede)','#879299',1.5)}${p('M-19-14Q0-26 20-12L15 20Q0 35-17 19Z','#8e161f','#e88c81',1.5)}${p('M-12-9Q14-21 14-6L1 7L9 15L-9 19L-12 6L1-8Z','#121b24','#f49584',1)}${r(-86,-9,35,36,'#111b24',5,'#b9c6ce')}${r(52,-9,35,36,'#111b24',5,'#b9c6ce')}${line('M-83 3h30M-83 15h30M55 3h29M55 15h29','#727f88',1)}${t(-68,0,'▲',8,'#d8e4eb','text-anchor="middle"')}${t(69,0,'LAUNCH',5,'#e7edf1','text-anchor="middle"')}${p('M-8-111L8-111L11-96L-8-96Z','#dbe0df','#c6cccf',1)}</g>`);

// ZENVO: skeletal three-pod cluster and open-spoke wheel, exposed passenger carbon and red pads.
save('zenvo-cockpit',500,'Zenvo Aurora Agil — exposed ZM1 carbon, three instruments and open-spoke wheel',
p('M0 158L83 117L234 147L480 119L597 144L845 112L1000 158V500H0Z','url(#weave)','#71828a',2)+
p('M0 270L38 0L102 0L93 179L169 243L143 486L43 500Z','url(#carbonShade)','#82949d',2)+p('M1000 274L958 0L913 0L909 178L827 253L855 500H1000Z','url(#carbonShade)','#526976',2)+
p('M485 179Q638 120 867 167L819 220Q648 212 514 246Z','#050b0e','#536a75',2)+line('M510 181Q682 145 847 171','#89a6b1',2)+
p('M520 251L604 230L686 500H514L489 353Z','url(#weave)','#6b8991',2)+line('M538 247L603 240L669 490','#aab9bf',1)+
seat(825,356,'#711c28')+p('M875 309L925 265L997 299V485L881 470Z','url(#weave)','#789199',1)+
p('M234 208Q245 151 305 165Q331 108 388 133Q432 144 446 190Q491 192 498 232L474 269L251 263Z','url(#carbonShade)','#8aa4ad',2)+
dial(364,190,57,10,'cabTachNeedle')+live('cabRpmArt',364,224,'1100',13,'#f1f4e3')+t(364,238,'RPM × 1000',7,'#a9bdbe','text-anchor="middle"')+
c(276,228,39,'#091117','url(#metal)',3)+live('cabSpeedArt',276,234,'0',22)+t(262,250,'KM/H',7,'#a7bec4','text-anchor="middle"')+live('cabGearArt',294,252,'N',13,'#e8eec2')+
c(449,228,39,'#06110f','url(#metal)',3)+live('cabHybridArt',449,231,'P2 ON',13,'#aade9d')+t(449,249,'TORQUE FILL',6,'#b3ccbd','text-anchor="middle"')+
[0,1,2,3].map(i=>p(`M${600+i*13} ${277+i*31}l16-3 5 11-18 4z`,'url(#metal)','#263e4b',1)).join('')+
button(612,420,'START','#e13d45','ignitionBtn')+button(566,313,'HYBRID','#78bd8e','hybridBtn')+button(584,365,'AERO','#d6c561','aeroStrategyBtn')+
`<g id="cabinWheelG" transform="translate(364 348)">${p('M-88-83Q0-132 90-82L108-1Q107 54 60 88L-55 88Q-112 54-108-4Z','none','url(#rubber)',19)}${line('M-3-109L3-109','#ed3443',12)}${p('M-97-17L-28-7L27-7L98-17L96 6L29 14L44 61L-42 61L-27 14L-95 6Z','url(#weave)','#809aa3',2)}${p('M-43 59L-27 34L27 34L43 59L18 76L-18 76Z','none','#c7d3d6',2)}${c(0,0,31,'url(#suede)','#9babad',2)}${t(0,5,'ZENVO',10,'#c4d9dc','text-anchor="middle"')}${button(-69,-4,'MODE','#dce6e7','modeBtn')}${button(69,-4,'P2','#82b898','hybridBtn')}${button(-37,58,'AERO','#d8c96a','aeroStrategyBtn')}${button(37,58,'LIFT','#8db9d7','liftBtn')}</g>`);

// MCX: single racing seat, trident dash beam, visible cage, blue wheel grips and UV console lettering.
save('mcx-cockpit',500,'Maserati MCXtrema — hand-drawn racing cockpit and blue-grip display wheel',
p('M0 168Q215 111 432 143L741 126L1000 211V500H0Z','url(#weave)','#788b98',1.5)+
p('M43 500L133 0M932 500L858 0M111 105L851 93','none','#090e12',25)+p('M43 500L133 0M932 500L858 0M111 105L851 93','none','url(#metal)',14)+
p('M751 255L984 394M987 244L741 493','none','#12191f',19)+line('M751 255L984 394M987 244L741 493','#66767f',4)+
p('M478 148L707 127L819 176L761 226L575 216L480 251Z','url(#carbonShade)','#7b8e99',2)+
p('M539 161l44-9 34 27-27 18-47-10z','url(#metal)','#afbfca',1)+p('M550 163l29-5 25 21-18 10-30-7z','#061016','#465f71',1)+line('M550 173l47 8','#8ba0ae',2)+t(672,190,'MCXtrema',24,'#9cadbb','font-style="italic"')+
p('M172 230L206 149L338 137L422 185L440 257L372 278Z','url(#weave)','#a4b4bd',1.5)+
r(160,154,71,45,'#02080d',4,'#5a6d7b')+t(196,181,'REAR VIEW',8,'#99bdca','text-anchor="middle"')+
p('M474 257L601 270L713 474L611 499L477 395Z','url(#weave)','#cbdc33',2)+
button(505,294,'ENGINE','#d6ec43','ignitionBtn')+button(559,310,'RESET','#d6ec43')+button(533,353,'ENG MAP','#d6ec43')+button(589,371,'EPS','#d6ec43')+button(572,419,'TC','#d6ec43','tcLevelBtn')+
p('M482 269l-5-27 25-3 10 33M538 281l-5-27 25-3 10 34','#d54043','#272f35',1)+p('M626 447q-21-5-19 14l23 27 54-15q-4-30-29-27z','url(#metal)','#788a99',1)+
seat(804,404,'#152334')+p('M144 498l34-87 46-42 51 21 27 115','url(#weave)','#677e90',2)+p('M166 483l38-83 32-12 30 22-22 73Z','#205491','#5d8bba',1)+
`<g id="cabinWheelG" transform="translate(345 326)">${p('M-102-93L-125-59L-133 43L-112 95L-78 89L-67 54L-74-54L-76-84Z','#245c9b','#7096bd',3)}${p('M102-93L125-59L133 43L112 95L78 89L67 54L74-54L76-84Z','#245c9b','#7096bd',3)}${p('M-78-86L77-86L91-48L82 73L52 84L-54 84L-87 64L-92-49Z','url(#weave)','#8fa7b8',2)}${r(-60,-69,120,96,'#02090d',5,'#bcc8ce')}${r(-55,-64,110,86,'#091d24',2,'#183b48')}${live('cabSpeedArt',-27,-12,'0',21)}${live('cabGearArt',30,-10,'N',35)}${live('cabTcArt',0,13,'TC 06 · ENDURANCE',7,'#cfea49')}${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>r(-54+i*9,-60,6,4,i>8?'#e14d43':'#55bf87',1,'none',`data-live="led" data-led="${i}"`)).join('')}${button(-76,-57,'RAD','#e8ee90')}${button(76,-57,'PIT','#e7ed7a','pitBtn')}${button(-78,-16,'N','#e5ecf0','gearNBtn')}${button(78,-16,'PAGE','#d9e970')}${button(-76,26,'LGT','#d9e979','lightsBtn')}${button(76,26,'TC','#dbe53f','tcLevelBtn')}${button(-43,57,'ABS','#e2e865')}${button(43,57,'TCS','#d6e945','tcLevelBtn')}${t(0,62,'MCXtrema',10,'#eff2f3','text-anchor="middle" font-style="italic"')}</g>`);

// 9X8: narrow survival cell; most functions cluster around the wheel-mounted endurance display.
save('peugeot-cockpit',500,'Peugeot 9X8 — carbon survival cell and multifunction endurance wheel',
p('M0 171L139 115Q268 92 410 128L778 123L1000 186V500H0Z','url(#suede)','#6b7b84',1.5)+
p('M12 500L73 140L141 0L187 0L124 153L110 500M1000 500L942 149L875 0L827 0L897 151L906 500','url(#weave)','#778b94',3)+
line('M92 151L122 70M907 150L877 70','#d5e139',6)+
p('M211 189L589 160L779 187L771 292L582 297L564 376L218 366Z','url(#carbonShade)','#465e6a',1)+
p('M529 324L672 271L807 500H492Z','url(#weave)','#79939d',2)+
r(152,210,97,139,'#081015',3,'#8b9ea6')+t(199,228,'MASTER POWER',8,'#f4f5e7','text-anchor="middle"')+['P2','P0','MAIN OFF','MAIN ON','IGNITION'].map((z,i)=>r(178,240+i*20,41,14,'#111e26',0,'#798d97')+t(198,250+i*20,z,7,'#cddce4','text-anchor="middle"')).join('')+
line('M84 176L257 240','#1c272d',10)+line('M85 174L256 238','#6b7d85',2)+
r(645,160,119,56,'#02080b',4,'#647b86')+t(704,184,'REAR CAMERA',9,'#d4de86','text-anchor="middle"')+line('M659 207L688 192L714 192L747 207','#87a7b4',2)+
button(581,320,'BRAKE MIG','#d9e53b','brakeMigBtn')+button(626,348,'HYBRID','#70c3c1','hybridBtn')+button(669,396,'FCY','#f2d848')+
p('M761 291L822 274L884 500H774Z','url(#weave)','#5e7886',2)+seat(827,433,'#232a2c')+line('M116 325L241 352L129 389L244 420M132 321L136 440M174 333L179 453M216 345L222 464','#1e2b34',7)+
`<g id="cabinWheelG" transform="translate(378 328)">${p('M-106-88Q-144-48-132 71Q-124 110-99 98L-78 65L-83-53Z','url(#rubber)','#74848b',2)}${p('M106-88Q144-48 132 71Q124 110 99 98L78 65L83-53Z','url(#rubber)','#74848b',2)}${p('M-96-81L-61-108L61-108L96-81L95 67L61 108L-63 108L-95 66Z','url(#weave)','#a1b0b7',2)}${t(0,-78,'PEUGEOT',13,'#e8f0f2','text-anchor="middle" letter-spacing="3"')}${r(-64,-66,128,91,'#051216',3,'#7c939b')}${r(-23,-62,43,61,'#bf7b27',0,'none')}${live('cabGearArt',-1,-18,'N',35,'#fff4da')}${live('cabSpeedArt',-43,-33,'0',16)}${live('cabSocArt',42,-37,'75%',12,'#abcfe1')}${live('cabMapArt',0,17,'STINT · BB 52%',8,'#e5e889')}${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(i=>c(-56+i*8,-94,2.5,i>10?'#f73338':'#32e655','none',0,`data-live="led" data-led="${i}"`)).join('')}${button(-81,-61,'RAD','#6487e7')}${button(81,-61,'PIT','#d2d86b','pitBtn')}${button(-85,-24,'ACK','#a16add')}${button(85,-24,'MARK','#6999e6')}${button(-85,15,'WIP','#47ccbf')}${button(85,15,'E-RS','#dd505a','hybridBtn')}${button(-73,52,'N','#70d992','gearNBtn')}${button(73,52,'FCY','#e3e361')}${button(-36,53,'MIX','#e95071')}${button(36,53,'BMIG','#51d892','brakeMigBtn')}${button(-23,90,'TC','#5077ef','escBtn')}${button(24,90,'STRAT','#dbe15a','hybridBtn')}${p('M-10 38L10 38L12 58L0 67L-12 58Z','#0a131b','#d1dde3',1)}</g>`);

// ENGINE HELPERS: the layouts themselves are independently authored below.
const hose=(d,w=14,col='#222d36')=>line(d,'#02070a',w+4)+line(d,col,w)+line(d,'#79909b',1);
const pipe=(d,w=15)=>line(d,'#050b10',w+4)+line(d,'url(#metal)',w)+line(d,'#e7ecee',1.5);
function turbo(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})" data-component="turbo">${p('M-33 2Q-38-27-10-34Q20-41 34-15L38 6L21 15Q24 41-4 41Q-26 41-31 21Z','url(#titanium)','#404c56',2)}${c(0,5,24,'url(#metal)','#75808a',2)}${c(0,5,15,'#08141c','#536571',2)}${[0,1,2,3,4,5,6,7].map(i=>p('M1 4Q15-8 11-14Q22 1 5 9Z','#93a8b4','#31424e',.5,`transform="rotate(${i*45} 0 5)"`)).join('')}${p('M22-17L48-18L49-3L29 0Z','url(#metal)','#6a7d88',1)}${bolts([[-22,-17],[20,-20],[-22,28],[21,29]])}</g>`;}
function radiator(x,y,w,h,angle=0){return `<g transform="translate(${x} ${y}) rotate(${angle})">${r(0,0,w,h,'#111a20',3,'#a5b5bf')}${Array.from({length:Math.floor(w/5)},(_,i)=>line(`M${4+i*5} 5v${h-10}`,'#82919b',1)).join('')}${line(`M0 0h${w}M0 ${h}h${w}`,'url(#metal)',8)}</g>`;}
const label=(x,y,txt,d)=>t(x,y,txt,11,'#b3c8d3','letter-spacing="1"')+line(d,'#6c8c9e',1)+c(...(d.match(/[-\d.]+/g).slice(-2).map(Number)),2,'#b0cbd7','none',0);
// VIPER overhead view. Long ten-cylinder intake under the crossed brace, front at bottom.
save('viper-engine',500,'Viper ACR front engine bay — longitudinal V10, twin throttles and crossed carbon brace',
r(0,0,1000,500,'#0b131b',0,'none')+p('M225 22Q505-6 777 22L855 420L798 470H202L146 421Z','url(#carbonShade)','#687c8a',3)+
p('M235 38Q500 5 761 38L735 87L259 87Z','#0b141a','#889aa4',1)+Array.from({length:30},(_,i)=>line(`M${259+i*15} 40v27`,'#455862',1)).join('')+
r(261,129,59,227,'#1e252c',14,'#627581')+r(682,133,59,220,'#1e252c',14,'#627581')+
p('M339 100L431 83L456 349L371 377L337 319Z','url(#red)','#b8494d',2)+p('M660 100L568 83L542 349L628 377L662 319Z','url(#red)','#b8494d',2)+
p('M435 96L565 96L581 291L560 359H439L418 291Z','#151d24','#9caab4',2)+
Array.from({length:5},(_,i)=>p(`M443 ${112+i*42}q58-14 112 0v25q-52-13-112 0z`,'url(#rubber)','#6a7982',1)).join('')+
line('M471 105V343M477 104V344M524 104V344M530 105V343','#c5d2d7',2)+t(378,254,'VIPER',21,'#e5e9eb','transform="rotate(-95 378 254)" font-weight="700"')+t(622,253,'VIPER',21,'#e5e9eb','transform="rotate(95 622 253)" font-weight="700"')+
pipe('M447 353L441 400',26)+pipe('M554 353L560 400',26)+hose('M441 393Q424 431 377 430',27)+hose('M560 393Q577 431 623 430',27)+r(327,421,346,39,'#0a1014',9,'#5d727f')+
Array.from({length:7},(_,i)=>line(`M${427+i*4} 381l27 4M${547+i*4} 381l27-4`,'#aebdc6',2)).join('')+
c(228,145,32,'#1e2830','url(#metal)',4)+c(769,145,32,'#1e2830','url(#metal)',4)+c(228,145,11,'#101b22','#829aa8',3)+c(769,145,11,'#101b22','#829aa8',3)+
r(748,317,55,64,'#bac2b2',14,'#72858e')+c(775,328,16,'#dbc44d','#77754e',2)+r(188,272,58,55,'#d1d6c7',10,'#82959b')+c(216,275,14,'#1b2025','#89979b',2)+r(217,339,71,62,'#090f14',6,'#556b78')+
hose('M205 236C241 197 313 224 327 292',10)+hose('M751 295C775 253 720 219 680 243',12)+pipe('M381 378L333 401L312 465',10)+pipe('M618 378L669 400L691 465',10)+
// X-brace sits over the intake, joining the actual four chassis mounting points.
p('M237 146L274 127L500 224L727 126L765 145L529 250L745 384L713 405L500 273L287 405L253 385L472 251Z','url(#weave)','#96a9b5',2)+c(500,246,22,'#101921','#9cacb2',2)+t(500,251,'V10',12,'#e8f0f3','text-anchor="middle"')+bolts([[255,146],[744,146],[277,385],[725,385],[332,110],[668,110],[288,433],[712,433]])+
label(22,100,'8.4 L OHV V10','M153 105H300L359 126')+label(21,225,'CARBON X-BRACE','M161 228H248L373 196')+label(19,417,'TWIN THROTTLES','M166 418H313L437 380')+label(803,83,'REAR / BULKHEAD','M872 91V61L737 58')+t(500,489,'FRONT · RADIATOR AND AIRBOX',10,'#9db8c8','text-anchor="middle" letter-spacing="2"'));

// MCX rear clam removed, engine at left and transaxle / exhausts at right, as photographed.
save('mcx-engine',500,'MCXtrema rear engine bay — roof intake, Nettuno V6, blue couplers and six-speed transaxle',
r(0,0,1000,500,'#0b131d',0,'none')+p('M63 94L290 36L725 70L931 145L958 375L701 449L267 461L63 390Z','url(#weave)','#6d879a',2)+
p('M76 139L298 63L314 162L128 220Z','url(#blue)','#7089a8',2)+p('M78 355L294 443L316 338L129 280Z','url(#blue)','#7089a8',2)+
radiator(271,87,143,57,14)+radiator(274,354,143,56,-11)+
p('M335 169L506 154L556 325L358 341Z','url(#metal)','#617888',2)+r(361,189,146,107,'#25313b',9,'#aec0ca')+
Array.from({length:3},(_,i)=>r(374+i*42,194,32,87,'#0e1c25',8,'#6e8797')).join('')+
pipe('M303 145Q335 127 374 160L392 187',17)+pipe('M308 348Q350 371 396 313L409 293',17)+
line('M354 156L376 174','#346bd5',23)+line('M381 335L399 313','#346bd5',23)+
turbo(491,122,.69)+turbo(500,366,.72)+hose('M511 112L573 115L598 174',13)+hose('M517 382L576 375L600 330',13)+
r(531,179,98,52,'url(#metal)',8,'#718a9b')+r(532,260,98,52,'url(#metal)',8,'#718a9b')+c(559,187,13,'#182530','#b5c5ce',2)+c(564,269,13,'#17252e','#b5c5ce',2)+
p('M640 197L733 207L768 249L738 296L640 307Z','url(#metal)','#596f7e',2)+Array.from({length:8},(_,i)=>line(`M${650+i*11} ${205+i*1.2}v${87-i*2.4}`,'#5c7280',2)).join('')+
line('M627 247H828','url(#metal)',17)+pipe('M542 130L625 143Q646 160 666 165L866 175',16)+pipe('M547 366L624 356Q647 337 668 334L865 325',16)+
line('M660 165L866 175','url(#titanium)',13)+line('M661 334L865 325','url(#titanium)',13)+
p('M824 146L908 145L912 354L826 354L831 322L873 316L873 185L832 180Z','url(#weave)','#738896',2)+
line('M308 115L664 160L800 141M305 385L665 342L801 362','#050b10',15)+line('M308 115L664 160L800 141M305 385L665 342L801 362','url(#metal)',8)+line('M337 120L555 250L338 380','#121c24',12)+line('M339 121L554 250L340 379','#839aab',3)+
// Long carbon roof-intake bridge over the engine, with a real open mouth.
p('M160 238L265 209L584 228L652 221L652 279L585 270L266 291L160 272Z','url(#weave)','#afc0ca',2)+p('M165 239L239 224L244 278L166 267Z','#02090e','#7896a7',2)+t(420,257,'NETTUNO',19,'#e0ebf2','text-anchor="middle" letter-spacing="3"')+
bolts([[310,116],[306,385],[660,160],[665,343],[800,142],[803,362],[845,150],[844,349],[650,222],[650,278]])+
label(27,31,'ROOF INTAKE','M117 40V191L188 242')+label(390,29,'3.0 V6 · TWIN TURBO','M477 36V76L484 116')+label(720,44,'6-SPEED SEQUENTIAL','M814 52V114L714 248')+label(736,463,'TITANIUM EXHAUSTS','M825 451V380L821 327'));

// ZENVO engine: four turbochargers inside the hot V, long outer plenums, rear P2 ring.
save('zenvo-engine',500,'Zenvo Mjølner V12 hot-V — four central turbos, outer carbon plenums and rear P2 motor',
r(0,0,1000,500,'#0a1319',0,'none')+p('M95 158L344 55L768 95L933 302L698 454L220 423Z','url(#weave)','#617d88',2)+
p('M214 241L400 126L706 153L820 279L634 383L283 353Z','url(#metal)','#8199a7',2)+
p('M261 299L420 225L702 254L773 310L624 405L314 375Z','#24303a','#627b8c',2)+
p('M218 228L376 132L432 153L278 259L307 340L264 354Z','url(#carbonShade)','#68899c',2)+
p('M335 282L505 182L768 222L824 292L646 394L382 354Z','url(#weave)','#b4c6ce',2)+
t(571,310,'MJØLNER V12–4T',26,'#e0e9ec','transform="rotate(9 571 310)" text-anchor="middle" font-family="Georgia,serif"')+t(601,346,'MAHLE POWERTRAIN',13,'#afc2cd','transform="rotate(9 601 346)" text-anchor="middle" letter-spacing="2"')+
pipe('M355 147Q377 112 430 120L458 164',16)+pipe('M488 117Q529 77 567 113L582 161',16)+pipe('M400 209Q435 173 470 206L491 252',16)+pipe('M554 200Q589 165 624 202L639 259',16)+
turbo(394,146,.95)+turbo(527,133,.95)+turbo(464,220,1.06)+turbo(604,215,1.06)+
// Wastegate actuators and short hot-V exhaust collectors.
pipe('M424 129L477 155L496 187',12)+pipe('M557 117L610 142L638 177',12)+pipe('M494 203L548 226L570 263',12)+pipe('M634 199L687 218L709 259',12)+
Array.from({length:6},(_,i)=>pipe(`M${294+i*42} ${348+i*5}q-7 19 15 29l30 4`,5)).join('')+
p('M741 312L801 305L848 349L803 392L756 374Z','url(#metal)','#7b929e',2)+`<g data-component="rear-p2">${p('M782 311Q831 291 860 336Q885 381 841 407L809 389Q841 371 827 346Q817 329 795 336Z','#222e36','#ec833e',4)}</g>`+
pipe('M843 353L897 347L929 379',10)+hose('M210 178C140 227 183 343 275 377',14)+hose('M699 126Q825 156 865 253',16)+
line('M277 365L411 108M418 95L731 413','#0a131b',12)+line('M277 365L411 108M418 95L731 413','#8b9ea8',3)+
bolts([[218,240],[374,135],[388,355],[648,393],[768,224],[824,291],[809,389],[283,350],[348,57]])+
label(29,63,'FOUR TURBOS · HOT V','M205 69L305 71L395 140')+label(25,445,'OUTER CARBON INTAKE PLENUM','M250 434L349 426L463 318')+label(737,463,'REAR P2 MOTOR','M838 446V424L836 374')+t(858,67,'6.6 L · V12',15,'#d6e9e9','text-anchor="middle"')+t(858,87,'9,800 RPM',11,'#89b8bc','text-anchor="middle"'));

// 9X8 technical cutaway: front axle on left, central safety cell, rear V6 and gearbox on right.
save('peugeot-engine',500,'Peugeot 9X8 hybrid chassis — separate front MGU and rear V6 powertrain',
r(0,0,1000,500,'#0b141b',0,'none')+p('M82 122L889 99L951 176L950 344L878 421L83 398L54 338L54 179Z','url(#weave)','#647d8a',2)+
// Four tyres and double-wishbone corners are part of the exposed chassis, not a generic bay box.
[[142,124],[143,373],[851,124],[851,376]].map(([x,y])=>r(x-38,y-55,76,110,'url(#rubber)',19,'#4d606c')+line(`M${x-26} ${y-52}v105M${x+26} ${y-52}v105`,'#182b34',3)).join('')+
line('M144 152L262 207L144 340M144 152L210 267L144 340M850 151L739 211L852 341M850 151L786 269L852 341','url(#metal)',6)+
line('M143 249H299M738 249H851','url(#metal)',13)+
`<g data-component="front-mgu">${r(185,213,105,71,'url(#metal)',17,'#b5c7cf')}${Array.from({length:13},(_,i)=>line(`M${194+i*6} 220v57`,'#476573',2)).join('')}${c(236,249,24,'#3c6976','#afc7ce',2)}${t(237,254,'MGU',12,'#edfbfe','text-anchor="middle"')}</g>`+
p('M313 173L387 133L495 136L569 168L575 332L492 377L382 376L310 329Z','url(#carbonShade)','#718b99',3)+
p('M386 177L475 168L510 195L512 301L476 336L388 329L359 306L359 208Z','#02080c','#426370',2)+
p('M383 230L397 195L454 194L472 230L468 304L388 304Z','#192b35','#557e8b',2)+
`<g data-component="hv-battery">${r(534,190,45,135,'#343f42',4,'#9ea84b')}${t(558,256,'900 V',12,'#e5e886','transform="rotate(-90 558 256)" text-anchor="middle"')}</g>`+
line('M535 208L315 172L265 201L265 217','#e77a34',7)+line('M537 302L314 332L277 289','#e77a34',6)+
radiator(340,87,157,35,1)+radiator(339,385,157,35,-1)+
p('M602 178L668 175L710 206L710 306L665 330L599 319Z','url(#metal)','#77909e',2)+
r(597,178,64,37,'#536773',5,'#d1e0e7')+r(597,286,64,37,'#536773',5,'#d1e0e7')+
Array.from({length:3},(_,i)=>r(606+i*17,221,13,59,'#111f28',5,'#8ba3b0')).join('')+
turbo(699,180,.54)+turbo(700,320,.54)+pipe('M713 175Q751 178 776 197',10)+pipe('M714 322Q752 319 776 302',10)+
p('M723 218L776 222L802 247L777 282L723 286Z','url(#metal)','#8ca6b3',2)+Array.from({length:7},(_,i)=>line(`M${729+i*8} ${224+i}v${54-i*2}`,'#536f7d',2)).join('')+
pipe('M686 197L668 158L597 159L581 205',11)+pipe('M686 302L668 348L596 348L581 290',11)+
p('M818 207L924 189L924 312L818 295L836 270L836 233Z','url(#weave)','#7f98a2',2)+line('M796 221L909 164M796 282L909 336','url(#metal)',5)+
bolts([[315,180],[314,325],[377,136],[494,139],[572,176],[572,325],[602,180],[603,320],[827,210],[827,293],[187,218],[286,221]])+
label(24,31,'FRONT AXLE · 200 kW MGU','M195 40V73L236 224')+label(351,31,'CARBON SAFETY CELL','M449 40V86L444 181')+label(640,31,'2.6 L TWIN-TURBO V6','M750 40V92L650 180')+
label(26,471,'SINGLE-SPEED REDUCTION','M214 455V418L262 276')+label(417,476,'900 V HYBRID BATTERY','M554 459V374L557 280')+label(716,475,'7-SPEED REAR GEARBOX','M846 453V399L752 258'));
console.log('Wrote 12 individually drawn SVG assets.');
