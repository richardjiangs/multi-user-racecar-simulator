// Original, hand-authored Solus GT geometry. Repeated fasteners, spokes and engine
// components are procedural; body, canopy, tub, wheel and engine layout are unique.
// References and which details are schematic: docs/SOLUS_GT.md.
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const dir=new URL('solus-art/',import.meta.url);mkdirSync(dir,{recursive:true});
const p=(d,f='#111b20',s='#71818b',w=1.5,extra='')=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}" ${extra}/>`;
const r=(x,y,w,h,f='#111b20',rx=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${extra}/>`;
const c=(x,y,r,f,s='none',w=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${s}" stroke-width="${w}"/>`;
const t=(x,y,txt,size=10,fill='#dce5e9',extra='')=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${fill}" text-anchor="middle" ${extra}>${txt}</text>`;
const bolt=(x,y)=>c(x,y,3,'url(#metal)','#141b20')+p(`M${x-1} ${y-1}l2 2`,'none','#39464e',1);
const defs=`<defs><linearGradient id="white" x2="0" y2="1"><stop stop-color="#fbfdfb"/><stop offset=".32" stop-color="#dce2df"/><stop offset=".55" stop-color="#fbfdfa"/><stop offset=".78" stop-color="#949f9f"/><stop offset="1" stop-color="#4e6268"/></linearGradient><linearGradient id="metal" x2=".2" y2="1"><stop stop-color="#f0f6f7"/><stop offset=".24" stop-color="#83949b"/><stop offset=".55" stop-color="#ccd3d4"/><stop offset="1" stop-color="#36454e"/></linearGradient><linearGradient id="glass" x2=".4" y2="1"><stop stop-color="#94bdc8"/><stop offset=".3" stop-color="#354c59"/><stop offset=".68" stop-color="#061116"/><stop offset="1" stop-color="#152735"/></linearGradient><linearGradient id="titanium" x2="1" y2=".3"><stop stop-color="#454955"/><stop offset=".26" stop-color="#ab8e69"/><stop offset=".48" stop-color="#e1ceb0"/><stop offset=".7" stop-color="#77738b"/><stop offset="1" stop-color="#566aa0"/></linearGradient><linearGradient id="rubber" x2=".5" y2="1"><stop stop-color="#3b454b"/><stop offset=".4" stop-color="#0a1014"/><stop offset="1" stop-color="#010608"/></linearGradient><pattern id="carbon" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><rect width="8" height="8" fill="#131c21"/><path d="M0 1h4M4 5h4" stroke="#34434a" stroke-width="2"/><path d="M1 0v4M5 4v4" stroke="#233139" stroke-width="2"/></pattern></defs>`;
const carbon='url(#carbon)',white='url(#white)',metal='url(#metal)';
const svg=(kind,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${h}" role="img" aria-label="McLaren Solus GT ${kind} — original hand drawing" data-hand-drawn="2026-09-13">${defs}${body}</svg>`.replace(/id="(white|metal|glass|titanium|rubber|carbon)"/g,(_,id)=>`id="solus-${h}-${kind.split(" ")[0]}-${id}"`).replace(/url\(#(white|metal|glass|titanium|rubber|carbon)\)/g,(_,id)=>`url(#solus-${h}-${kind.split(" ")[0]}-${id})`);
function wheel(x,y,radius){let s=c(x,y,radius,'url(#rubber)','#03090c',2)+c(x,y,radius*.78,'#0a1115','#627078',3)+c(x,y,radius*.61,'#474b49','#8a9290');
 s+=p(`M${x+radius*.4} ${y-radius*.45}q22 25 0 ${radius*.85}l-8-6v-${radius*.66}z`,'#dadfda','#273337',2);
 s+=`<g data-wheel-spin="${x} ${y}">`;
 for(let i=0;i<18;i++)s+=p('M-2-7L-3-48L1-49L4-9Z',metal,'#26353c',.7,`transform="translate(${x} ${y}) rotate(${i*20}) scale(${radius/66})"`);
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;s+=c(x+Math.cos(a)*radius*.54,y+Math.sin(a)*radius*.54,1.25,'#1a2428');}
 s+=t(x,y-radius*.83,'SOLUS',6,'#d2d7d3')+'</g>'+c(x,y,9,metal,'#1f2a31',2)+c(x,y,4,'#929da1');return s;}
let ext=r(0,0,1000,450,'#14212a')+p('M0 357H1000V450H0Z','#0b1217','none')+`<ellipse cx="500" cy="371" rx="456" ry="18" fill="#030708"/>`;
ext+=`<g id="rearWingArt">`+p('M810 240L817 146L833 143L838 248M915 247L912 139L925 139L940 249',carbon)+p('M797 139Q880 125 963 134L959 153L791 159Z',carbon,'#9daeb4')+p('M796 160L963 150L959 164L789 172Z','#111c23','#91a2a8')+p('M864 133L951 118L975 132L967 192L953 202L878 184Z',carbon,'#889ba4')+t(929,159,'2',33,'#a5b7bf')+'</g>';
ext+=`<g id="bcBody">`+p('M46 348L967 344L948 362L35 363Z',carbon,'#99acb4')+p('M306 219Q395 150 489 158L550 150Q570 154 580 161L651 188L824 218L928 247L909 329L780 348L339 348L286 293Z',white,'#a9b7b9',2);
ext+=p('M329 238Q495 214 730 233L799 247L694 317Q554 347 324 350L344 319L400 277Z',white,'#718790',1.5)+p('M326 248L361 266L339 323L306 350L333 345L408 277L729 250Q571 239 326 248Z','#111e24','#7d9299',1);
ext+=p('M561 153L572 145L576 128L583 128L587 150L604 158L774 213L670 211Z',white,'#afbcbb')+p('M577 141L583 141L587 150L576 149Z','#081218','none');
ext+=`<g id="doorArt">`+p('M306 224Q391 155 495 161L558 163L565 218L354 239Z','url(#glass)','#bac7c5',3)+p('M311 224Q390 164 448 164L388 227L358 234Z',white,'#d6dfdb',1)+p('M559 166L589 173Q613 184 612 191L563 209Z','url(#glass)','#82979d',1)+p('M338 220L383 190','none','#081014',5)+p('M422 164Q479 151 557 162','none','#dbe4df',6)+p('M495 157h25','none','#c82d38',4)+p('M526 159h29','none','#0c797c',4)+'</g>';
ext+=p('M62 330L86 277Q119 231 169 222Q213 211 251 229L339 253L327 278L299 331L289 348L270 349A72 84 0 0 0 126 350L86 350Z',white,'#b3c2c3',2)+p('M66 333l27-19 20 31-55 4z',carbon)+p('M297 294l30-12-16 35-23 29-20 3z',carbon)+p('M123 249Q185 208 244 242','none','#e5ece8',3);
ext+=p('M671 347L733 286Q760 242 789 231Q831 211 872 229L935 248L956 264L947 301L917 319L910 348L897 348A74 84 0 0 0 749 348Z',white,'#b8c5c3',2)+p('M686 337L747 291L744 346L672 350Z',carbon)+p('M918 310l27-12-4 36-32 17z',carbon)+p('M744 238l-45-4-13 5 31 9z','#10242b','#5b747f',1);
for(let i=0;i<20;i++)ext+=p(`M${343+i*10} ${306+i%3*5}l${34+i%4*11}-${5+i%3*2}`,'none',i>12?'#457b81':'#1a3945',2);
ext+=t(485,286,'McLaren',17,'#21323a','font-style="italic"')+t(591,330,'SOLUS GT',12,'#203943','letter-spacing="3"')+'</g>'+wheel(199,308,66)+wheel(823,308,68);
ext+=`<g id="frontFlapArt">`+p('M37 350L132 350L133 359L25 359Z',carbon,'#9badb4')+'</g><g id="quadExhaustArt">'+c(949,280,6,'#03090b','url(#titanium)',3)+'</g>';
writeFileSync(new URL('exterior.svg',dir),svg('side elevation with podded wheels and sliding canopy',450,ext));
const control=(id,x,y,label,color='#ff8734',radius=9)=>`<g data-control="${id}" role="button" tabindex="0" aria-label="${label}">`+c(x,y,radius,'#081016',color,2)+c(x,y,radius*.45,color)+t(x,y+radius+10,label,6.5)+'</g>';
const rotary=(id,x,y,label)=>`<g data-control="${id}" role="button" tabindex="0" aria-label="${label}">`+c(x,y,19,'#080e12','#d8dad2',1)+Array.from({length:12},(_,i)=>{let a=i/12*Math.PI*2;return p(`M${x+Math.cos(a)*16} ${y+Math.sin(a)*16}l${Math.cos(a)*3} ${Math.sin(a)*3}`,'none','#bcc4c1',1)}).join('')+c(x,y,12,'#f58230','#dbe3df')+p(`M${x} ${y}l0-9`,'none','#1a262c',3)+t(x,y+31,label,7)+'</g>';
let cab=p('M0 500L92 179L186 119L241 147L193 335L293 468L331 500Z',carbon,'#66818d',2)+p('M1000 500L908 179L814 119L759 147L807 335L707 468L669 500Z',carbon,'#66818d',2);
cab+=p('M0 355L86 177L149 134L171 146L122 237L104 346Z','#167477','#5eadad',2)+p('M1000 355L914 177L851 134L829 146L878 237L896 346Z','#167477','#5eadad',2);
cab+=p('M391 0L442 139L466 206L534 206L558 139L609 0','url(#carbon)','#748f9d',2)+p('M467 0L476 118L524 118L533 0','#03090d','#3e5a68',2);
cab+=`<g data-control="rearCameraBtn" role="button" tabindex="0" aria-label="Rear camera">`+r(408,33,184,62,'#080e12',5,'stroke="#7794a2" stroke-width="2"')+r(416,40,168,45,'url(#glass)',2)+p('M442 85L481 43H519L558 85','#2c3639','none')+p('M479 84l16-34M521 84l-16-34','none','#b4c4c2',1)+t(500,97,'REAR CAMERA',7)+'</g>';
cab+=p('M222 170Q353 208 500 196Q647 208 778 170L812 242L649 276L602 356H398L351 276L188 242Z',carbon,'#8c9ca3',2)+p('M215 209Q500 259 785 209','none','#9aabb0',4)+p('M324 500L367 375L426 364H574L633 375L676 500Z',carbon,'#587482',2)+p('M412 493L442 380Q500 363 558 380L588 493Z','url(#rubber)','#344c58',1.5);
cab+=p('M440 440L455 500M560 440L545 500','none','#eb722e',19)+r(480,471,40,25,metal,5)+c(500,484,8,'#151c20','#dae2df',2);
cab+=`<g id="pedalBoxArt">`+p('M451 249L459 217H482L487 249M513 249L518 217H541L549 249',metal,'#71858d',1)+Array.from({length:4},(_,i)=>p(`M461 ${223+i*5}h17M522 ${223+i*5}h16`,'none','#374954',1)).join('')+'</g>';
cab+=`<g data-control="doorAllBtn" role="button" tabindex="0" aria-label="Canopy release">`+p('M247 292L274 290L290 420L265 427Z','#d33234','#ffa99b',1)+t(269,362,'CANOPY',9,'#fff','transform="rotate(82 269 362)"')+'</g>';
cab+=`<g data-control="frontForward" role="button" tabindex="0" aria-label="Pedals forward">`+p('M736 293L761 301L739 425L712 418Z','#0c1115','#899a9d',1)+t(739,356,'PEDALS +',9,'#e5eeed','transform="rotate(100 739 356)"')+'</g>';
cab+=control('frontBack',786,395,'PEDALS −','#a5bbc3')+control('harnessBtn',500,477,'BELT','#ff7f37',8);
cab+=`<g id="cabinWheelG" transform="translate(500 337)">`;
cab+=p('M-104-87L-145-81Q-164-42-156 22L-128 76L-96 67L-103 38L-114 18L-111-38Z','url(#rubber)','#465963',3)+p('M104-87L145-81Q164-42 156 22L128 76L96 67L103 38L114 18L111-38Z','url(#rubber)','#465963',3);
cab+=p('M-117-83L-84-95H84L117-83L129-36L111 25L85 79L-85 79L-111 25L-129-36Z',carbon,'#91a4ac',2)+r(-72,-68,144,84,'#050b10',6,'stroke="#a3b4b7" stroke-width="2"')+r(-66,-61,132,70,'#11212b',2);
cab+=t(0,-76,'McLaren',8,'#e8eeeb','font-style="italic"');
for(let i=0;i<12;i++)cab+=r(-55+i*10,-89,6,4,'#32738d',1,`data-live="led" data-led="${i}"`);
cab+=t(0,-10,'N',38,'#f4f4e7','id="cabGearArt" data-live="text" font-weight="700"')+t(-44,-23,'0',18,'#aee8f0','id="cabSpeedArt" data-live="text"')+t(-44,-11,'km/h',6)+t(42,-33,'0',8,'#ffc276','id="cabRpmArt" data-live="text"')+t(43,-21,'RPM',6)+t(0,5,'RACE',8,'#baffd0','id="cabModeArt" data-live="text"');
cab+=control('pitBtn',-95,-57,'PLS','#3be78d',8)+control('coolBtn',95,-57,'AC','#76acff',8)+control('gearNBtn',-106,-20,'N','#fafbe3',8)+control('pageBtn',106,-20,'OK','#efd74e',8)+control('biasBtn',-102,18,'BIAS','#f15b43',8)+control('absBtn',102,18,'ABS','#d5e266',8);
cab+=rotary('corseMapBtn',-42,46,'MODE · Z')+rotary('tcBtn',42,46,'SLIP / TC')+control('ignitionBtn',0,53,'START','#37a0e3',8)+t(0,25,'TC 6 · ABS ON · BB 58%',7,'#e1d7b2','id="cabTcArt" data-live="text"');
cab+='</g>'+t(678,264,'G-METER',9,'#b6d4dc','id="cabPageArt" data-live="text"')+t(678,280,'0.00 G',12,'#fcbd7b','id="cabGArt" data-live="text"')+t(500,192,'SOLUS GT · CENTRAL DRIVING POSITION',9,'#a3b8bc','letter-spacing="2"');
writeFileSync(new URL('cockpit.svg',dir),svg('central single-seat cockpit with functioning wheel controls',500,cab));
let eng=r(0,0,1000,500,'#091218')+p('M60 20H940L974 477H26Z',carbon,'#608390',2)+p('M115 18L231 488M885 18L769 488','none','#4d666f',9);
eng+=p('M334 12L366 92L634 92L666 12Z',white,'#809a9d',2)+p('M390 0L430 92H570L610 0Z',carbon,'#89a4af',2)+t(500,53,'ROOF AIRBOX',11)+t(500,71,'lifted for intake inspection',8,'#90a4aa');
// V engine viewed from above, front at top. Ten open throttle trumpets, cam
// covers, injector looms and 5-into-1 headers; service layout is schematic.
eng+=p('M340 90L315 352L380 394H620L685 352L660 90Z',metal,'#849392',2);
for(const side of [-1,1]){
 const x=500+side*111;
 eng+=r(x-36,111,72,226,'#383d3d',13,'stroke="#819292" stroke-width="2"')+t(x,228,'JUDD',28,'#6d7675',`font-weight="700" transform="rotate(${side*90} ${x} 228)"`);
 for(let i=0;i<5;i++){
  const y=127+i*43, tx=500+side*47;
  eng+=`<ellipse cx="${tx}" cy="${y}" rx="29" ry="18" fill="url(#metal)" stroke="#a9b7b7" stroke-width="2"/><ellipse cx="${tx}" cy="${y+2}" rx="23" ry="12" fill="#c94331"/><ellipse cx="${tx}" cy="${y+5}" rx="17" ry="8" fill="#7e271e"/>`;
  eng+=r(x-7,y-6,14,13,'#10191d',3,'stroke="#789095"')+bolt(x-27,y)+bolt(x+26,y);
  eng+=p(`M${x+side*29} ${y+8}C${x+side*102} ${y+23} ${x+side*103} ${366+i*10} ${500+side*53} 408`,'none','#1e2e34',15)+p(`M${x+side*29} ${y+8}C${x+side*102} ${y+23} ${x+side*103} ${366+i*10} ${500+side*53} 408`,'none','url(#titanium)',10);
  eng+=p(`M${x} ${y-6}q${-side*20}-12 ${-side*23} -24`,'none','#151f24',4)+r(tx+side*30-4,y-2,8,10,'#3b6390',2);
 }
 eng+=p(`M${x} 109V333`,'none','#1c282e',4)+p(`M${500+side*79} 114V322`,'none',metal,5);
 eng+=p(`M${500+side*54} 407L${500+side*39} 461`,'none','url(#titanium)',19);
 eng+=p(`M${170+(side>0?550:0)} 50l35 255 64 33-37-267Z`,metal,'#607781',2);
 for(let i=0;i<25;i++)eng+=p(`M${190+(side>0?550:0)+i*.85} ${74+i*8}l42 10`,'none','#2c404a',2);
 eng+=p(`M${x} 93Q${x+side*180} 37 ${x+side*179} 266`,'none','#070e12',11)+p(`M${x} 93Q${x+side*180} 37 ${x+side*179} 266`,'none','#4a6e7f',2);
}
eng+=p('M427 350H573L562 446L534 483H466L438 446Z',metal,'#7a959e',2);
for(let y=364;y<449;y+=10)eng+=p(`M444 ${y}h112`,'none','#556d74',3);
eng+=t(500,472,'7-SPEED SEQUENTIAL',8,'#17282f');
eng+=p('M296 343L390 370M704 343L610 370M231 432L436 417M769 432L564 417','none','#a4b4b4',6);
for(const x of [290,710]){eng+=p(`M${x} 354v99`,'none','#c3cac4',5);for(let y=362;y<446;y+=9)eng+=p(`M${x-12} ${y}l24 5`,'none','#e47230',4);eng+=bolt(x,351)+bolt(x,457);}
eng+=t(500,496,'5.2 L NATURALLY ASPIRATED V10 · TEN INDIVIDUAL THROTTLES',10,'#b5cdcf');
writeFileSync(new URL('engine.svg',dir),svg('V10 engine inspection with ten trumpets, headers and transaxle',500,eng));
// Embed into the self-contained simulator, and refresh its garage illustration.
const file=new URL('../McLaren Solus GT simulator.html',import.meta.url);let s=readFileSync(file,'utf8');
for(const [regex,kind,prefix,suffix] of [[/const HAND_COCKPIT = `[\s\S]*?`;/,'cockpit','const HAND_COCKPIT = `','`;'],[/app\.el\.exteriorArt\.innerHTML=`[\s\S]*?`;/,'exterior','app.el.exteriorArt.innerHTML=`','`;'],[/app\.el\.engineBay\.innerHTML=`[\s\S]*?`;/,'engine','app.el.engineBay.innerHTML=`','<div class="cover" id="engineCover">BODYWORK CLOSED</div>`;']]){if(!regex.test(s))throw Error('Missing '+kind);s=s.replace(regex,()=>prefix+readFileSync(new URL(kind+'.svg',dir),'utf8')+suffix);}
writeFileSync(file,s);
const indexFile=new URL('../index.html',import.meta.url);let index=readFileSync(indexFile,'utf8'),a=index.indexOf('data-car-card="solusgt"');if(a>=0){let b=index.indexOf('<svg',a),e=index.indexOf('</svg>',b)+6;const art=readFileSync(new URL('exterior.svg',dir),'utf8').replace(/id="([^"]+)"/g,(_,id)=>`id="card-solus-${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#card-solus-${id})`);index=index.slice(0,b)+art+index.slice(e);writeFileSync(indexFile,index);}
console.log('Solus GT: original exterior, cockpit and V10 engine artwork embedded.');
