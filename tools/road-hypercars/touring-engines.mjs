import {path as p,text as t,bolt} from './materials.mjs';
import {pipe,ribs,fasteners,fan,startEngine as start,endEngine as end} from './engines.mjs';
const cap=(x,y,label)=>`<circle cx="${x}" cy="${y}" r="17" fill="#14232c" stroke="#80999f" stroke-width="4"/>${t(x,y+3,label,6,'#d6c772','text-anchor="middle"')}`;
const clamp=(x,y,w=29)=>p(`M${x} ${y}h${w}M${x} ${y+5}h${w}`,'none','stroke="#becbd0" stroke-width="2"')+bolt(x+w*.73,y+2,2);
const coil=(x,y,a,color='#b5a878')=>`<g transform="translate(${x} ${y}) rotate(${a})">${pipe('M-54 0H54',9,'#bcc8c8')}<rect x="-37" y="-11" width="74" height="22" rx="6" fill="#283e4c"/>${Array.from({length:9},(_,i)=>p(`M${-36+i*8}-15l9 30`,'none',`stroke="${color}" stroke-width="3.4"`)).join('')}</g>`;
const trumpet=(x,y,r=15,brass=false)=>`<g class="tc-intake-stack"><path d="M${x-r*.6} ${y+23}V${y}h${r*1.2}v23Z" fill="${brass?'#9a784d':'url(#rhMetal)'}" stroke="#72766c"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.58}" fill="${brass?'#443e27':'#17262c'}" stroke="${brass?'#d2b780':'#cfd4c7'}" stroke-width="3"/><ellipse cx="${x}" cy="${y+1}" rx="${r-4}" ry="${r*.35}" fill="#101e23"/></g>`;
const radiator=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#rhMetal)" stroke="#82999e" stroke-width="3"/><rect x="${x+7}" y="${y+7}" width="${w-14}" height="${h-14}" fill="url(#rhMesh)"/>${Array.from({length:Math.floor(w/9)-1},(_,i)=>p(`M${x+11+i*9} ${y+8}v${h-16}`,'none','stroke="#a2b5b9" stroke-width="2"')).join('')}`;

export function gtoEngine(){return start('Ferrari 250 GTO • front-mounted Colombo V12, six twin-choke Webers and twelve polished intake trumpets','#ae252c').replace('FRONT / CABIN ↑','CABIN / WINDSCREEN ↑')+`
 <path d="M190 58H710L736 112H164Z" fill="#273339" stroke="#677b84"/>
 <path d="M190 136Q218 113 267 153L279 389 172 420 139 320ZM710 136Q682 113 633 153L621 389 728 420 761 320Z" fill="#15242d" stroke="#54646e"/>
 ${pipe('M199 184L244 408',35,'#28333a')}${Array.from({length:24},(_,i)=>p(`M${183+i*1.8} ${181+i*9}l32-6`,'none','stroke="#778382" stroke-width="1.3"')).join('')}
 <path d="M311 103L396 93 392 355 300 369 278 332ZM504 93L589 103 622 332 600 369 508 355Z" fill="#202829" stroke="#777e78" stroke-width="2"/>
 ${t(338,237,'Ferrari',24,'#aeb6af','font-family="Georgia,serif" font-style="italic" transform="rotate(-90 338 237)" text-anchor="middle"')}${t(562,237,'Ferrari',24,'#aeb6af','font-family="Georgia,serif" font-style="italic" transform="rotate(90 562 237)" text-anchor="middle"')}
 ${Array.from({length:6},(_,i)=>{const y=111+i*41;return `<rect x="403" y="${y+7}" width="94" height="24" rx="6" fill="url(#rhMetal)" stroke="#6c848a"/>${trumpet(429,y,17)}${trumpet(471,y,17)}${bolt(408,y+17)}${bolt(492,y+17)}<path d="M409 ${y+25}h84" stroke="#c6bca1" stroke-width="2"/>`;}).join('')}
 ${pipe('M400 99L400 356',4,'#bbad83')}${pipe('M500 99L500 356',4,'#bbad83')}
 ${Array.from({length:6},(_,i)=>p(`M${346+i*5} 81Q${289-i*4} ${125+i*7} 307 ${125+i*37}M${554-i*5} 81Q${611+i*4} ${125+i*7} 593 ${125+i*37}`,'none','stroke="#9b9170" stroke-width="2.5"')).join('')}
 <circle cx="351" cy="86" r="20" fill="#292c25" stroke="#788c8d"/><circle cx="549" cy="86" r="20" fill="#292c25" stroke="#788c8d"/>
 ${pipe('M282 131Q246 121 254 68',18,'#a0a487')}${pipe('M601 342Q660 354 645 413',16,'#a4a58f')}
 ${radiator(267,401,368,42)}${pipe('M337 366Q335 416 287 410',24,'#293b40')}
 <circle cx="350" cy="373" r="29" fill="#de6527" stroke="#f3a35a" stroke-width="3"/>${t(350,377,'FRAM',8,'#4a281d','text-anchor="middle"')}
 ${pipe('M207 115L696 391',7,'#24373d')}${pipe('M693 115L204 391',7,'#24373d')}
 ${cap(674,102,'COOL')}${cap(701,350,'OIL')}${fasteners([[288,116],[374,107],[612,116],[526,107],[302,343],[386,337],[598,343],[514,337],[220,112],[681,390]])}
 ${t(450,488,'COLOMBO V12 · SIX WEBER 38 DCN TWIN-CHOKE CARBURETTORS',9,'#bccacb','text-anchor="middle"')}
 `+end(`<path d="M247 49Q450 24 653 49L712 417Q450 469 188 417Z" fill="#b5262c" stroke="#e77c6a" stroke-width="2"/><path d="M376 87Q450 54 524 87L543 143H357Z" fill="#99222a" stroke="#e48679"/><path d="M367 132H533L538 148H362Z" fill="#0c151c"/>${fasteners([[258,69],[642,69],[220,395],[680,395]])}`,'250 GTO · FRONT BONNET');}

export function f40Engine(){return start('Ferrari F40 • twin IHI turbo V8, cast intake runners, paired intercoolers and silver heat shields','#b4252a')+`
 <path d="M177 70H723L712 119H188Z" fill="url(#rhFoil)" stroke="#c8c9bb"/>
 <path d="M350 110H550L572 251H328Z" fill="#a63a2c" stroke="#d58767"/>
 ${Array.from({length:4},(_,i)=>`<path d="M${351+i*50} 115q-19 53-9 115h35q-10-57 12-115Z" fill="url(#rhMetal)" stroke="#d0dbd8" stroke-width="2"/>`).join('')}
 <path d="M337 108H563V140H337Z" fill="url(#rhMetal)" stroke="#b8c9ca"/>
 ${t(450,130,'Ferrari',22,'#566b70','font-family="Georgia,serif" font-style="italic" text-anchor="middle"')}
 ${radiator(228,182,132,112)}${radiator(540,182,132,112)}
 ${pipe('M344 148L309 167 292 184',28,'#aebfc5')}${pipe('M556 148L591 167 608 184',28,'#aebfc5')}
 ${pipe('M295 291L286 347',29,'#c0c6bc')}${pipe('M605 291L614 347',29,'#c0c6bc')}
 ${pipe('M322 159L313 174',31,'#a84536')}${pipe('M578 159L587 174',31,'#a84536')}${clamp(302,166,29)}${clamp(572,166,29)}${clamp(272,316,29)}${clamp(600,316,29)}
 ${[286,614].map(x=>`<circle cx="${x}" cy="353" r="27" fill="url(#rhMetal)" stroke="#718891" stroke-width="3"/><circle cx="${x}" cy="353" r="12" fill="#172c36"/>`).join('')}
 <path d="M360 310Q450 284 540 310L593 436H307Z" fill="url(#rhFoil)" stroke="#c7d2c5" stroke-width="2"/>
 <path d="M390 314L377 416M510 314L523 416" stroke="#e0e2d7" stroke-width="3"/>
 ${pipe('M286 376Q300 431 400 450',21,'#b9a991')}${pipe('M614 376Q600 431 500 450',21,'#b9a991')}${pipe('M450 421V461',17,'#ada38b')}
 ${[400,450,500].map(x=>`<ellipse cx="${x}" cy="462" rx="${x===450?12:18}" ry="10" fill="#09151c" stroke="#bac4bc" stroke-width="3"/>`).join('')}
 ${coil(216,344,74,'#3d4344')}${coil(684,344,106,'#3d4344')}
 ${pipe('M196 77L704 327',8,'#202f36')}${pipe('M704 77L196 327',8,'#202f36')}${pipe('M195 328L706 328',9,'#24363d')}
 ${cap(409,260,'OIL')}${cap(664,98,'COOL')}${fasteners([[244,194],[344,194],[244,282],[344,282],[556,194],[656,194],[556,282],[656,282],[338,110],[562,110],[392,343],[508,343]])}
 `+end(`<path d="M181 42L719 42 791 402 702 448H198L109 402Z" fill="#b82b2d" stroke="#e97566" stroke-width="2"/><path d="M280 62H620L661 339 602 414H298L239 339Z" fill="url(#rhGlass)" stroke="#bbc9c5" stroke-width="3"/>${Array.from({length:10},(_,i)=>p(`M${289-i*4} ${96+i*26}H${611+i*4}`,'none','stroke="#2e3d46" stroke-width="9"')).join('')}<path d="M151 69H749V98H151Z" fill="#9f2226" stroke="#e47a6e"/>`,'F40 · VENTED PERSPEX REAR CLAMSHELL');}

export function p917Engine(){return start('Porsche 917K • air-cooled twelve-cylinder engine with central fan, twelve intake stacks and exposed tubular chassis','#79b1c6')+`
 <style>.tcCrankFan{transform:rotate(var(--tc-crank-fan,0deg))}</style>
 <path d="M284 73H616L637 356 589 402H311L263 356Z" fill="#3e4637" stroke="#929679"/>
 <path d="M274 84L346 78 350 348 277 360ZM554 78L626 84 623 360 550 348Z" fill="#aa854c" stroke="#dac18b" stroke-width="2"/>
 ${[309,591].map(x=>Array.from({length:6},(_,i)=>trumpet(x,108+i*41,19,true)+p(`M${x+23} ${118+i*41}q18-34 4-30l-7 7`,'none','stroke="#c1c6b0" stroke-width="2"')+bolt(x-25,115+i*41,2.5)).join('')).join('')}
 <g transform="translate(450 235)"><circle r="92" fill="#967944" stroke="#d8bf81" stroke-width="6"/><circle r="84" fill="#514b2c"/><g class="tcCrankFan">${Array.from({length:10},(_,i)=>p('M-9-28Q-52-62-28-79L-13-82Q-24-58 14-28Z','#c9b475',`stroke="#f3dfaa" stroke-width="1" transform="rotate(${i*36})"`)).join('')}</g><circle r="37" fill="#d8c382" stroke="#e8d9a7" stroke-width="5"/><circle r="22" fill="url(#rhMetal)"/>${Array.from({length:6},(_,i)=>bolt(Math.cos(i*Math.PI/3)*18,Math.sin(i*Math.PI/3)*18,2.8)).join('')}</g>
 ${[125,359].map(y=>`<ellipse cx="450" cy="${y}" rx="39" ry="21" fill="#2f2920" stroke="#75715b"/>`+Array.from({length:12},(_,i)=>p(`M${425+i*4.5} ${y}Q${i<6?367:533} ${y+20} ${i<6?365:535} ${90+(i%6)*43}`,'none',`stroke="${i%3?'#382f2b':'#ad3d2c'}" stroke-width="2.5"`)).join('')).join('')}
 <path d="M388 365H512L541 436 489 467H411L359 436Z" fill="url(#rhMetal)" stroke="#667e88"/>${ribs(390,382,7,0,10,120)}
 ${pipe('M450 441L212 411',10,'#9bacac')}${pipe('M450 441L688 411',10,'#9bacac')}
 ${pipe('M183 85L208 411 690 411 717 85',9,'#1d2f34')}${pipe('M191 119L684 390',7,'#1d2f34')}${pipe('M709 119L216 390',7,'#1d2f34')}
 ${pipe('M251 366L210 455',25,'#a09475')}${pipe('M649 366L690 455',25,'#a09475')}
 <rect x="160" y="166" width="67" height="100" rx="9" fill="url(#rhMetal)" stroke="#8c9e9d"/>${cap(194,178,'OIL')}
 ${fasteners([[183,86],[717,86],[208,411],[690,411],[397,389],[503,389],[397,439],[503,439]])}
 ${t(450,493,'TYPE 912 · MECHANICAL INJECTION · ENGINE-DRIVEN COOLING FAN',9,'#b9c9cb','text-anchor="middle"')}
 `+end(`<path d="M164 44Q450 5 736 44L802 395 716 442H184L98 395Z" fill="#7aafc0" stroke="#b0d6da" stroke-width="2"/><path d="M422 33H478L493 441H407Z" fill="#df722c"/><ellipse cx="450" cy="229" rx="113" ry="104" fill="url(#rhMesh)" stroke="#bbcad0" stroke-width="3"/><path d="M218 82H282L258 393H177ZM618 82H682L723 393H642Z" fill="url(#rhMesh)" stroke="#546e7a"/>`,'917K · SHORT-TAIL REAR BODY');}

export function paganiEngine(){return start('Pagani Huayra BC • AMG V12, ribbed central plenums, polished charge pipes, carbon airboxes and titanium exhaust','#8f9696')+`
 <path d="M170 61L293 72 307 276 223 395 126 399ZM730 61L607 72 593 276 677 395 774 399Z" fill="url(#rhCarbon)" stroke="#728c98" stroke-width="2"/>
 <path d="M298 86Q450 58 602 86L627 194 581 283H319L273 194Z" fill="url(#rhCarbon)" stroke="#afc0c3" stroke-width="2"/>
 <path d="M340 85Q450 52 560 85L577 167Q450 187 323 167Z" fill="#344149" stroke="url(#rhMetal)" stroke-width="3"/>
 ${Array.from({length:17},(_,i)=>p(`M${348+i*13} ${82+Math.abs(i-8)*.9}q-6 38-5 77`,'none','stroke="#a1b3b8" stroke-width="2"')).join('')}
 <path d="M335 183L416 169 422 252 315 264ZM484 169L565 183 585 264 478 252Z" fill="url(#rhCarbon)" stroke="#7793a0"/>
 ${t(370,223,'AMG',17,'#d0dcd8','text-anchor="middle" font-style="italic"')}${t(531,223,'V12',17,'#d0dcd8','text-anchor="middle"')}
 ${pipe('M327 241Q244 197 250 281Q257 326 323 327',26,'#b5c9cc')}${pipe('M573 241Q656 197 650 281Q643 326 577 327',26,'#b5c9cc')}
 <path d="M171 181L268 160 287 247 209 287 155 263ZM729 181L632 160 613 247 691 287 745 263Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="3"/>
 <path d="M183 185L254 171 266 198 172 223ZM717 185L646 171 634 198 728 223Z" fill="url(#rhMesh)" stroke="#a4bbc4"/>
 ${ribs(179,188,9,8,-1.5,2)}${t(223,251,'PAGANI',9,'#b3cbd0','text-anchor="middle"')}${t(677,251,'PAGANI',9,'#b3cbd0','text-anchor="middle"')}
 ${pipe('M249 85L641 344',10,'#314d5b')}${pipe('M651 85L259 344',10,'#314d5b')}${pipe('M181 312L719 312',10,'#344d57')}
 ${coil(242,351,-20,'#244c74')}${coil(658,351,20,'#244c74')}
 ${[0,1].map(i=>`<circle cx="${301+i*298}" cy="363" r="18" fill="#d99731" stroke="#edcb78"/>`+pipe(`M${301+i*298} 355L${316+i*268} 328`,7,'#c8d4cd')).join('')}
 <path d="M357 343H543L578 427 520 463H380L322 427Z" fill="url(#rhFoil)" stroke="#b5beb1"/>
 ${pipe('M322 364Q365 400 421 418',17,'#aea386')}${pipe('M578 364Q535 400 479 418',17,'#aea386')}
 <g id="tc-pagani-exhaust">${[[-17,-15],[17,-15],[-17,15],[17,15]].map(([x,y])=>`<ellipse cx="${450+x}" cy="${437+y}" rx="14" ry="12" fill="#0a171e" stroke="#c2c7b4" stroke-width="4"/>`).join('')}</g>
 ${cap(215,97,'COOL')}${cap(688,94,'OIL')}${fasteners([[340,90],[560,90],[329,162],[571,162],[181,185],[254,171],[717,185],[646,171],[250,85],[650,85],[184,312],[716,312],[362,354],[538,354],[421,406],[479,406]])}
 ${t(450,491,'M158 AMG V12 · TITANIUM QUAD EXHAUST · BC COUPÉ',10,'#b8cbd0','text-anchor="middle"')}
 `+end(`<path d="M160 46Q450-9 740 46L794 386 709 439H191L106 386Z" fill="#969d9e" stroke="#d3dcd9" stroke-width="2"/><path d="M327 50Q450 13 573 50L595 267H305Z" fill="url(#rhCarbon)" stroke="#839ba5"/><path d="M367 76Q450 53 533 76L552 228H348Z" fill="url(#rhGlass)" stroke="#9cb1b6" stroke-width="3"/><path d="M423 50H477L489 439H411Z" fill="url(#rhCarbon)"/>${ribs(195,184,16,0,11,75)}${ribs(630,184,16,0,11,75)}<path d="M137 343H763V375H137Z" fill="url(#rhCarbon)" stroke="#9aadad"/>`,'HUAYRA BC · REAR CLAMSHELL');}

export function zr1Engine(){return start('2025 Corvette ZR1 • Edge Blue LT7 intake, black charge ducts, carbon panels and split-window cover','#c4a82a')+`
 <path d="M197 59L325 82 290 188 186 235 139 359 168 447H238L296 348 301 243ZM703 59L575 82 610 188 714 235 761 359 732 447H662L604 348 599 243Z" fill="url(#rhCarbon)" stroke="#70858d" stroke-width="2"/>
 ${cap(245,105,'COOL')}${cap(687,370,'OIL')}
 <path d="M315 168L365 155 377 340 303 361 277 279ZM535 155L585 168 623 279 597 361 523 340Z" fill="url(#rhMetal)" stroke="#8b9e9f"/>
 ${pipe('M293 234Q248 239 233 329',38,'#25323a')}${pipe('M607 234Q652 239 667 329',38,'#25323a')}
 ${clamp(250,270,35)}${clamp(615,270,35)}
 <path d="M365 115Q450 82 535 115L575 284 537 350H363L325 284Z" fill="#315a79" stroke="#668ca2" stroke-width="2"/>
 <path d="M365 116L420 104 418 333 365 345 340 282ZM480 104L535 116 560 282 535 345 482 333Z" fill="#416a88" stroke="#5f8ca6"/>
 <path d="M421 100H479L488 339H412Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="2"/>
 ${Array.from({length:6},(_,i)=>bolt(432+i%2*34,129+Math.floor(i/2)*46,5)).join('')}
 <path d="M427 257l19 9 4 16 4-16 19-9-8 20-15 13-15-13Z" fill="#a74135" stroke="#c8d3ce"/>
 <rect x="422" y="303" width="56" height="23" fill="#6f868f" stroke="#c8d2ca"/>${t(450,318,'LT7 · ZR1',7,'#121f26','text-anchor="middle"')}
 <path d="M320 381H580L616 433 540 458H360L284 433Z" fill="url(#rhFoil)" stroke="#899c9d"/>
 ${pipe('M303 340L340 414',26,'#908f7f')}${pipe('M597 340L560 414',26,'#908f7f')}
 ${pipe('M223 141L677 141',8,'#283c47')}${pipe('M214 369L355 409',9,'#2c444f')}${pipe('M686 369L545 409',9,'#2c444f')}
 ${fasteners([[206,73],[694,73],[370,127],[530,127],[351,272],[549,272],[217,369],[683,369]])}
 ${t(450,493,'5.5 LT7 TWIN-TURBO V8 · EDGE BLUE INTAKE',10,'#b8ccd2','text-anchor="middle"')}
 `+end(`<path d="M180 45L342 35H558L720 45 790 390 701 445H199L110 390Z" fill="#d7b32b" stroke="#f6dc83" stroke-width="2"/><path d="M294 69L428 48 420 389 300 405 254 347ZM472 48L606 69 646 347 600 405 480 389Z" fill="url(#rhGlass)" stroke="#a4b9be" stroke-width="3"/><path d="M435 40H465L482 434H418Z" fill="url(#rhCarbon)" stroke="#8197a2"/>${ribs(429,178,17,0,11,41)}`,'ZR1 · CARBON SPLIT-WINDOW ENGINE HATCH');}

export function speedtailEngine(){return start('McLaren Speedtail • longitudinal twin-turbo hybrid drivetrain, silver intake, thermal shielding and rear subframe','#859b9f')+`
 <path d="M191 66L292 71 320 236 254 384 139 411ZM709 66L608 71 580 236 646 384 761 411Z" fill="url(#rhCarbon)" stroke="#6f8b97"/>
 <path d="M349 84H551L579 127 557 285H343L321 127Z" fill="url(#rhMetal)" stroke="#aec2c8" stroke-width="2"/>
 <path d="M373 106L428 96 430 239 362 251ZM472 96L527 106 538 251 470 239Z" fill="#7e989f" stroke="#d6e1dc"/>
 ${t(450,159,'McLaren',17,'#2c434e','text-anchor="middle" font-style="italic"')}
 ${pipe('M350 206Q288 157 268 233L280 302',30,'#273f4a')}${pipe('M550 206Q612 157 632 233L620 302',30,'#273f4a')}
 <path d="M270 310L342 291 382 382 320 425 236 397ZM630 310L558 291 518 382 580 425 664 397Z" fill="url(#rhFoil)" stroke="#c7c9b4" stroke-width="2"/>
 ${pipe('M329 333Q379 376 404 435',30,'#aaa38a')}${pipe('M571 333Q521 376 496 435',30,'#aaa38a')}
 ${[404,496].map(x=>`<ellipse cx="${x}" cy="438" rx="21" ry="15" fill="#07151c" stroke="#c8cfc2" stroke-width="4"/>`).join('')}
 <path d="M381 288H519L529 365 503 410H397L371 365Z" fill="#283f4c" stroke="#879ea9"/>
 ${ribs(391,302,7,0,10,118)}
 <path d="M245 103L299 120 311 271 366 290" fill="none" stroke="#d88232" stroke-width="8"/><rect x="219" y="95" width="51" height="66" rx="5" fill="url(#rhMetal)" stroke="#8099a4"/>${ribs(226,105,6,0,8,36)}
 ${pipe('M178 146L275 388 388 432',10,'#96aeb5')}${pipe('M722 146L625 388 512 432',10,'#96aeb5')}${pipe('M187 176L700 358',8,'#7c969e')}${pipe('M713 176L200 358',8,'#7c969e')}
 ${coil(230,356,48,'#869496')}${coil(670,356,132,'#869496')}${cap(210,86,'COOL')}${cap(690,86,'OIL')}
 ${fasteners([[357,95],[543,95],[345,265],[555,265],[223,101],[263,153],[184,173],[706,173],[273,387],[627,387]])}
 ${t(450,491,'M840T HYBRID · REAR SERVICE VIEW',10,'#b7cbd1','text-anchor="middle"')}
 `+end(`<path d="M177 39Q450-9 723 39L786 403Q450 478 114 403Z" fill="#91a8aa" stroke="#cedbd5" stroke-width="2"/><path d="M333 52Q450 13 567 52L608 349Q450 402 292 349Z" fill="url(#rhCarbon)" stroke="#92adb4"/><path d="M368 90Q450 54 532 90L555 247H345Z" fill="url(#rhMesh)" stroke="#718d98"/><path d="M449 68h3v284" stroke="#b64435" stroke-width="3"/><path d="M215 316L325 333 313 374 188 353ZM685 316L575 333 587 374 712 353Z" fill="#7b959b" stroke="#c3d6d4"/>`,'SPEEDTAIL · LONG REAR CLAMSHELL');}
export const TOURING_ENGINES={mclaren:speedtailEngine,pagani:paganiEngine,zr1:zr1Engine,gto:gtoEngine,f40:f40Engine,p917:p917Engine};
