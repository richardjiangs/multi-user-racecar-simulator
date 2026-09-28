import {path as p,text as t,bolt} from './materials.mjs';
import {pipe,ribs,fasteners,fan,startEngine as start,endEngine as end} from './engines.mjs';

const gold=`<defs><linearGradient id="nxGold" x2=".7" y2="1"><stop stop-color="#ddc566"/><stop offset=".22" stop-color="#765521"/><stop offset=".45" stop-color="#e8ce7d"/><stop offset=".7" stop-color="#987335"/><stop offset="1" stop-color="#e7bd55"/></linearGradient><pattern id="nxGoldCrinkle" width="29" height="21" patternUnits="userSpaceOnUse"><path d="M0 2L9 9 17 2 29 12M4 21L9 9 22 18 29 12" fill="none" stroke="#fce4a0" stroke-opacity=".27" stroke-width=".8"/></pattern></defs>`;
const goldPanel=d=>p(d,'url(#nxGold)','stroke="#b69a57"')+p(d,'url(#nxGoldCrinkle)');
const cap=(x,y,label)=>`<circle cx="${x}" cy="${y}" r="15" fill="url(#rhMetal)" stroke="#101820" stroke-width="3"/><circle cx="${x}" cy="${y}" r="9" fill="#151e23"/>${t(x,y+3,label,5.5,'#d2c291','text-anchor="middle"')}`;
const coil=(x,y,angle,color='#d4b850')=>`<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M-60 0H60" stroke="#a3bbc2" stroke-width="7"/><rect x="-40" y="-12" width="80" height="24" rx="8" fill="#2d6790"/>${Array.from({length:10},(_,i)=>p(`M${-39+i*8}-15l10 30`,'none',`stroke="${color}" stroke-width="4"`)).join('')}<circle cx="-62" r="8" fill="#16252e" stroke="#8a9aa2"/><circle cx="62" r="8" fill="#16252e" stroke="#8a9aa2"/></g>`;
const plugRail=(x,y,n,dx,dy)=>Array.from({length:n},(_,i)=>`<rect x="${x+i*dx}" y="${y+i*dy}" width="18" height="21" rx="3" fill="#0c1720" stroke="#627780"/><path d="M${x+9+i*dx} ${y+21+i*dy}q-18 8-14 23" fill="none" stroke="#293a46" stroke-width="3"/>`).join('');

export function venomEngine(){return start('Venom F5 • Fury V8, polished twin throttle intake, gold bulkhead and carbon braces','#183650')+gold+`
 ${goldPanel('M211 56H689L727 193 657 292H243L173 193Z')}
 <path d="M282 80H618L632 145H268Z" fill="url(#rhCarbon)" stroke="#6d8590"/><path d="M337 89H563L577 133H323Z" fill="#283943" stroke="#6b808b"/>
 ${cap(241,96,'COOL')}${cap(660,96,'OIL')}
 <path d="M290 237L353 215 394 356 313 388 270 340ZM610 237L547 215 506 356 587 388 630 340Z" fill="#d4b731" stroke="#efd987" stroke-width="2"/>
 ${plugRail(287,249,4,8,28)}${plugRail(596,249,4,-8,28)}
 <path d="M379 193Q450 160 521 193L541 291Q509 334 450 317Q391 334 359 291Z" fill="url(#rhMetal)" stroke="#b0c2c7" stroke-width="2"/>
 <path d="M397 201Q423 184 433 208L423 291 389 299ZM503 201Q477 184 467 208L477 291 511 299Z" fill="#6a808d" stroke="#d9e0dc"/>
 ${pipe('M403 313L395 420',41,'#1a2a33')}${pipe('M497 313L505 420',41,'#1a2a33')}
 <path d="M383 332l25 2M381 343l25 2M379 354l25 2M379 365l25 2M493 332l25-2M495 343l25-2M497 354l25-2M497 365l25-2" stroke="#81939c" stroke-width="1.2"/>
 <ellipse cx="400" cy="316" rx="27" ry="12" fill="#7d939d" stroke="#d5dbd4"/><ellipse cx="500" cy="316" rx="27" ry="12" fill="#7d939d" stroke="#d5dbd4"/>
 ${[0,1].map(i=>pipe(`M${292+i*316} 206Q${195+i*510} 231 ${248+i*404} 351`,14,'#b3b6ab')).join('')}
 <path d="M213 367L319 402 303 443 180 414ZM687 367L581 402 597 443 720 414Z" fill="url(#rhFoil)" stroke="#a2afa9"/>
 ${pipe('M299 100L204 382',18,'#253e4b')}${pipe('M601 100L696 382',18,'#253e4b')}
 ${fasteners([[291,96],[609,96],[199,391],[701,391],[377,201],[523,201],[369,282],[531,282],[308,235],[592,235]])}
 ${t(450,252,'FURY',15,'#1e3540','text-anchor="middle" letter-spacing="3"')}${t(450,276,'HENNESSEY',7,'#36525e','text-anchor="middle" letter-spacing="2"')}
 ${t(450,487,'6.6 TWIN-TURBO V8 · TWIN CARBON CHARGE PIPES',10,'#b3c6cd','text-anchor="middle"')}
 `+end(`<path d="M174 42Q450-4 726 42L789 386 704 438H196L111 386Z" fill="#1d3b54" stroke="#6c98b1" stroke-width="2"/><path d="M278 71Q450 30 622 71L666 337Q450 390 234 337Z" fill="url(#rhGlass)" stroke="#859da7" stroke-width="4"/>${ribs(202,108,22,0,11,40)}${ribs(659,108,22,0,11,40)}`,'VENOM F5 · GLASS ENGINE DECK');}

export function amgOneEngine(){return start('Mercedes-AMG ONE • longitudinal F1 V6, central carbon intake, inboard dampers and hybrid hardware','#a3afb1')+gold+`
 <path d="M207 57L319 72 337 228 263 387 131 402ZM693 57L581 72 563 228 637 387 769 402Z" fill="url(#rhCarbon)" stroke="#6c818b"/>
 ${goldPanel('M301 98H599L630 349 562 403H338L270 349Z')}
 <path d="M337 86L414 104 405 231 310 250Z" fill="#7f765e" stroke="#c2bca4"/>
 <path d="M486 105L555 99 599 207 566 281 481 239Z" fill="url(#rhCarbon)" stroke="#a0adb0" stroke-width="2"/>
 ${ribs(346,110,10,-1,10,51)}${plugRail(305,262,3,9,24)}${plugRail(577,262,3,-9,24)}
 <path d="M384 281H516L553 420H347Z" fill="url(#rhFoil)" stroke="#c8c5b7"/>
 ${pipe('M450 312L450 440',41,'#807c6b')}
 <circle cx="450" cy="333" r="36" fill="url(#rhMetal)" stroke="#5b6667" stroke-width="5"/><circle cx="450" cy="333" r="20" fill="#2d3b41"/>
 <path d="M225 99L258 111 281 176 263 228" stroke="#cc7338" stroke-width="10" fill="none"/>
 <rect x="217" y="118" width="37" height="32" rx="5" fill="#e8903c" stroke="#e7b46d"/>
 ${cap(267,80,'COOL')}${cap(641,94,'OIL')}
 ${coil(290,348,-26)}${coil(610,348,26)}
 ${pipe('M219 243L324 388',9,'#263f53')}${pipe('M681 243L576 388',9,'#263f53')}
 <path d="M180 380L293 335 354 437 192 444ZM720 380L607 335 546 437 708 444Z" fill="url(#rhCarbon)" stroke="#6e8592"/>
 <path d="M435 46H465L478 212 471 456H429L422 212Z" fill="url(#rhCarbon)" stroke="#8b9c9f" stroke-width="2"/>
 ${t(450,228,'AMG',16,'#ced9d8','text-anchor="middle" transform="rotate(90 450 228)" font-style="italic"')}
 ${t(450,441,'E PERFORMANCE',6,'#b8cbd0','text-anchor="middle"')}
 ${fasteners([[434,74],[465,74],[424,197],[476,197],[193,387],[707,387],[223,131],[317,276],[583,276],[443,453],[457,453]])}
 <path d="M202 195L259 206M698 195L641 206" stroke="#afbec0" stroke-width="5"/>
 `+end(`<path d="M170 40Q450-3 730 40L798 400 711 445H189L102 400Z" fill="#a4afb3" stroke="#d6dfdf" stroke-width="2"/><path d="M300 61L415 44 423 430H315L252 361ZM600 61L485 44 477 430H585L648 361Z" fill="url(#rhCarbon)" stroke="#6b7e88"/><path d="M442 25h16l18 420h-52Z" fill="url(#rhCarbon)" stroke="#9aadb1"/>${ribs(305,112,23,0,11,94)}${ribs(502,112,23,0,11,94)}`,'AMG ONE · TWIN LOUVRED ENGINE COVERS');}

export function valkyrieEngine(){return start('Valkyrie • structural Cosworth V12, carbon intake plenum and six-branch exhaust banks','#315d58')+`
 <path d="M185 59L280 64 314 174 244 366 131 407ZM715 59L620 64 586 174 656 366 769 407Z" fill="url(#rhCarbon)" stroke="#83948f"/>
 <path d="M298 117L390 133 370 343 271 317ZM602 117L510 133 530 343 629 317Z" fill="url(#rhMetal)" stroke="#a0b4b6" stroke-width="2"/>
 ${plugRail(297,141,6,-2,27)}${plugRail(585,141,6,2,27)}
 ${Array.from({length:6},(_,i)=>pipe(`M${289-i*2} ${158+i*27}Q${224-i*2} ${176+i*24} ${243+i*7} 358L290 410`,10,'#a79570')+pipe(`M${611+i*2} ${158+i*27}Q${676+i*2} ${176+i*24} ${657-i*7} 358L610 410`,10,'#a79570')).join('')}
 <path d="M387 82Q450 60 513 82L533 286Q450 323 367 286Z" fill="url(#rhCarbon)" stroke="#91a3a5" stroke-width="2"/>
 <path d="M401 96Q450 82 499 96L512 261Q450 286 388 261Z" fill="#202f38" stroke="#4d666e"/>
 ${t(451,184,'COSWORTH',14,'#c2d0cf','text-anchor="middle" letter-spacing="1.6"')}${t(451,208,'ASTON MARTIN',8,'#b4c0b4','text-anchor="middle" letter-spacing="1"')}
 <path d="M403 57H497L504 105 396 105Z" fill="url(#rhCarbon)" stroke="#92a5a5"/>
 <path d="M360 343Q450 307 540 343L565 424 511 454H389L335 424Z" fill="url(#rhMetal)" stroke="#526b77"/>
 ${ribs(382,363,8,0,9,136)}
 <path d="M204 374L340 350 380 420M696 374L560 350 520 420" stroke="#7c949e" stroke-width="7" fill="none"/>
 ${coil(289,383,26,'#adb87c')}${coil(611,383,-26,'#adb87c')}
 ${pipe('M290 407L327 456',29,'#99987f')}${pipe('M610 407L573 456',29,'#99987f')}
 <ellipse cx="327" cy="456" rx="20" ry="11" fill="#0a151d" stroke="#b5b7a3" stroke-width="3"/><ellipse cx="573" cy="456" rx="20" ry="11" fill="#0a151d" stroke="#b5b7a3" stroke-width="3"/>
 ${cap(219,107,'OIL')}${cap(681,107,'COOL')}
 <g class="road-variant-art"><path d="M573 85L636 112 659 184" stroke="#d88838" stroke-width="8" fill="none"/><rect x="628" y="154" width="46" height="38" rx="6" fill="url(#rhMetal)" stroke="#6d8a95"/>${t(651,176,'KERS',7,'#263d46','text-anchor="middle"')}</g>
 ${fasteners([[390,89],[510,89],[379,286],[521,286],[412,112],[488,112],[398,251],[502,251],[348,417],[552,417]])}
 `+end(`<path d="M186 40Q450-5 714 40L777 378 677 444H223L123 378Z" fill="url(#rhCarbon)" stroke="#83b4a0" stroke-width="2"/><path d="M373 52Q450 21 527 52L552 202H348Z" fill="#254e48" stroke="#86a9a0"/><path d="M403 43H497L509 118H391Z" fill="#071218" stroke="#8ca9a2"/>${ribs(288,234,15,0,10,324)}<path d="M448 165h4v267" stroke="#91b947" stroke-width="3"/>`,'VALKYRIE · CARBON REAR CLAMSHELL');}

export function mcf1Engine(){return start('McLaren F1 • BMW S70/2 V12, twin carbon plenums, gold heat shielding and titanium exhaust','#878b8c')+gold+`
 ${goldPanel('M208 58H692L755 367 694 445H206L145 367Z')}
 <path d="M342 62L420 56 435 263 337 296 298 140ZM558 62L480 56 465 263 563 296 602 140Z" fill="url(#rhCarbon)" stroke="#92a4a9" stroke-width="2"/>
 <path d="M362 76L409 72 415 246 347 265 317 138ZM538 76L491 72 485 246 553 265 583 138Z" fill="#101e27" stroke="#4a606a"/>
 ${t(378,177,'BMW M POWER',12,'#dce2dd','text-anchor="middle" transform="rotate(82 378 177)"')}${t(522,177,'BMW M POWER',12,'#dce2dd','text-anchor="middle" transform="rotate(-82 522 177)"')}
 ${pipe('M394 268L380 326',34,'#203641')}${pipe('M506 268L520 326',34,'#203641')}
 <ellipse cx="380" cy="323" rx="21" ry="11" fill="#071117" stroke="#a0b5bd" stroke-width="3"/><ellipse cx="520" cy="323" rx="21" ry="11" fill="#071117" stroke="#a0b5bd" stroke-width="3"/>
 ${plugRail(294,112,6,3,25)}${plugRail(588,112,6,-3,25)}
 <path d="M243 346L657 346 644 362H256Z" fill="url(#nxGold)" stroke="#d6ba65" stroke-width="2"/>
 <path d="M266 349l48-37 47 37 89-37 89 37 47-37 48 37" stroke="#ba924f" stroke-width="7" fill="none"/>
 ${[0,1,2,3].map(i=>pipe(`M${282+i*111} 366Q${265+i*111} 403 ${271+i*114} 441`,34,'#a79d7b')).join('')}
 ${[271,385,499,613].map(x=>`<ellipse cx="${x}" cy="442" rx="20" ry="10" fill="#0a131b" stroke="#c4b98f" stroke-width="3"/>`).join('')}
 ${pipe('M231 137L222 271 276 332',13,'#4b7193')}${pipe('M669 137L678 271 624 332',13,'#4b7193')}
 ${cap(243,107,'COOL')}${cap(657,107,'OIL')}
 ${fan(200,313,28)}${fan(700,313,28)}
 ${fasteners([[355,71],[545,71],[319,139],[581,139],[345,260],[555,260],[263,349],[637,349],[363,352],[537,352]])}
 ${t(450,492,'6.1 BMW S70/2 V12 · GOLD FOIL THERMAL LINING',10,'#d9c69a','text-anchor="middle"')}
 `+end(`<path d="M202 44Q450-3 698 44L765 381 680 442H220L135 381Z" fill="#9a9fa2" stroke="#c8d0ce" stroke-width="2"/><path d="M283 65H617L659 362 606 403H294L241 362Z" fill="url(#rhCarbon)" stroke="#78929f"/>${ribs(293,91,26,0,11,314)}<path d="M430 46H470L488 127H412Z" fill="#101c24" stroke="#93a5a8"/>`,'McLAREN F1 · LOUVRED ENGINE LID');}

export const NEXT_ENGINES={venom:venomEngine,amgone:amgOneEngine,aston:valkyrieEngine,mcf1:mcf1Engine};
