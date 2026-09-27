import {defs,path as p,text as t,bolt} from './materials.mjs';
const pipe=(d,w=14,color='#747c82')=>p(d,'none',`stroke="#080c10" stroke-width="${w+5}" stroke-linecap="round"`)+p(d,'none',`stroke="${color}" stroke-width="${w}" stroke-linecap="round"`)+p(d,'none',`stroke="#e0e3d9" stroke-opacity=".23" stroke-width="${Math.max(1,w*.15)}"`);
const ribs=(x,y,n,dx=0,dy=8,w=62)=>Array.from({length:n},(_,i)=>p(`M${x+i*dx} ${y+i*dy}h${w}`,'none','stroke="#59626a" stroke-width="2"')).join('');
const fasteners=(points)=>points.map(([x,y])=>bolt(x,y,3)).join('');
function fan(x,y,r=34){return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#080e13" stroke="#5e707b" stroke-width="4"/><g class="rhFan">${Array.from({length:7},(_,i)=>p(`M-3-4Q${r*.2}-${r} ${r*.75}-${r*.64}L${r*.45}-8 4 4Z`,'#46545e',`stroke="#101c24" transform="rotate(${i*360/7})"`)).join('')}</g><circle r="9" fill="#798791"/></g>`;}
function start(label,color){return `<svg viewBox="0 0 900 520" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><title>${label}</title>${defs}<style>text{font-family:Arial,sans-serif}.rhFan{transform:rotate(var(--rh-fan,0deg))}.rhHatch{transition:opacity .5s,transform .6s;transform-origin:450px 30px}.is-open .rhHatch{opacity:0;transform:translateY(-500px);pointer-events:none}</style><rect width="900" height="520" fill="#071019"/><path d="M132 24Q450-4 768 24L842 410 749 498H153L59 410Z" fill="${color}" stroke="#79838a" stroke-width="2"/><path d="M177 54H723L785 390 720 464H180L115 390Z" fill="#050b10" stroke="#343e48" stroke-width="10"/>${t(450,33,'FRONT / CABIN ↑',10,'#bbc5cb','text-anchor="middle" letter-spacing="2"')}`;}
function end(hatch,label){return `<g class="rhHatch">${hatch}${t(450,459,label,13,'#d9e2e5','text-anchor="middle" letter-spacing="1.5"')}${t(450,480,'OPEN COVER TO INSPECT',10,'#a4b2ba','text-anchor="middle" letter-spacing="1.5"')}</g></svg><div class="cover" id="engineCover">ENGINE COVER CLOSED</div>`;}

export function bugattiEngine(){return start('Chiron Super Sport 300+ • W16 rear compartment, two carbon inlet covers and center spine','#20272d')+`
 <path d="M170 58L249 66 254 381 168 411 129 373Z" fill="url(#rhCarbon)" stroke="#5a6973"/><path d="M730 58L651 66 646 381 732 411 771 373Z" fill="url(#rhCarbon)" stroke="#5a6973"/>
 ${ribs(175,107,27,0,9,51)}${ribs(674,107,27,0,9,51)}
 ${pipe('M214 88Q290 48 322 132',22,'#222e37')}${pipe('M686 88Q610 48 578 132',22,'#222e37')}
 ${pipe('M255 328Q239 365 284 400L350 432',19)}${pipe('M645 328Q661 365 616 400L550 432',19)}
 <path d="M306 67Q338 50 380 63L411 353Q368 387 285 348L269 296Z" fill="url(#rhCarbon)" stroke="#77878e" stroke-width="2"/>
 <path d="M594 67Q562 50 520 63L489 353Q532 387 615 348L631 296Z" fill="url(#rhCarbon)" stroke="#77878e" stroke-width="2"/>
 <path d="M322 86Q348 72 370 83L381 196 306 192Z" fill="#0c1720" stroke="#53616a"/>
 <path d="M578 86Q552 72 530 83L519 196 594 192Z" fill="#0c1720" stroke="#53616a"/>
 <path d="M301 216L382 225 393 318Q348 344 286 312Z" fill="#11202b" stroke="#606f77"/>
 <path d="M599 216L518 225 507 318Q552 344 614 312Z" fill="#11202b" stroke="#606f77"/>
 ${t(340,267,'W16',25,'#e99440','text-anchor="middle" font-weight="bold"')}${t(340,296,'EB',24,'#e99440','text-anchor="middle"')}${t(560,267,'1600',25,'#e99440','text-anchor="middle" font-weight="bold"')}${t(560,296,'EB',24,'#e99440','text-anchor="middle"')}
 <path d="M418 80H482L489 344 411 344Z" fill="#1c2931" stroke="#839096"/>
 ${[0,1,2,3].map(i=>p(`M${420+i*7} 127v156M${460+i*7} 127v156`,'none','stroke="#cb7430" stroke-width="2"')).join('')}
 <path d="M438 51H462L470 373 430 373Z" fill="#171f27" stroke="#505c66"/>
 <path d="M444 51H449L452 373H447ZM453 51H458L461 373H456Z" fill="#ec782c"/>
 <path d="M231 378L389 363 450 392 511 363 669 378 688 423H212Z" fill="url(#rhFoil)" stroke="#353d42"/>
 ${pipe('M277 418L297 446',24,'#92908a')}${pipe('M623 418L603 446',24,'#92908a')}
 ${fasteners([[299,79],[388,339],[279,327],[601,79],[512,339],[621,327],[423,87],[477,87],[428,340],[472,340]])}
 ${t(450,497,'8.0 W16 · FOUR TURBOCHARGERS BENEATH THE DECK',10,'#9facb6','text-anchor="middle"')}
 `+end(`<path d="M146 50Q450 8 754 50L811 402 747 438 632 425 630 373 651 84 494 64 481 370 419 370 406 64 249 84 270 373 268 425 153 438 89 402Z" fill="url(#rhCarbon)" stroke="#7f8a91" stroke-width="2"/><path d="M439 45H461L473 430H427Z" fill="#e78131"/><path d="M448 45H452L457 430H443Z" fill="#121c24"/>`,'EXPOSED W16 · REAR DECK');}

export function jeskoEngine(){return start('Jesko • rear clamshell removed, carbon airboxes, three Triplex dampers and twin exhaust outlets','#d8dede')+`
 <path d="M175 61L309 68 320 251 226 284 135 361Z" fill="url(#rhCarbon)" stroke="#7c8a8e"/><path d="M725 61L591 68 580 251 674 284 765 361Z" fill="url(#rhCarbon)" stroke="#7c8a8e"/>
 <path d="M322 62L404 72 421 201 291 199Z" fill="url(#rhCarbon)" stroke="#65777e"/><path d="M578 62L496 72 479 201 609 199Z" fill="url(#rhCarbon)" stroke="#65777e"/>
 <path d="M337 75l54 11 3 30-65-6ZM563 75l-54 11-3 30 65-6Z" fill="url(#rhMesh)"/>
 <path d="M425 45H475L484 107H417Z" fill="url(#rhGlass)" stroke="#667a7e"/>
 ${pipe('M190 115Q234 86 303 131',20,'#283c3e')}${pipe('M710 115Q666 86 597 131',20,'#283c3e')}
 <path d="M351 140H550L567 313H334Z" fill="#111f25" stroke="#596b75"/>
 ${t(450,163,'Koenigsegg',18,'#a3c660','text-anchor="middle" font-style="italic"')}
 ${pipe('M319 111L571 342',13,'#a0a3a0')}${pipe('M581 111L329 342',13,'#a0a3a0')}
 <path d="M257 211L450 338 643 211M207 363L336 296M693 363L564 296" fill="none" stroke="#929b98" stroke-width="10"/>
 <path d="M269 199L286 233 614 233 631 199Z" fill="#bbc3bd" stroke="#171f22" stroke-width="3"/>
 <rect x="321" y="204" width="258" height="17" rx="8" fill="url(#rhMetal)"/>
 <path d="M392 196H476V229H392Z" fill="#1e2a2b" stroke="#8aa39a"/><text x="434" y="210" text-anchor="middle" font-size="8" fill="#aace5a">KOENIGSEGG</text>${t(434,221,'TRIPLEX',9,'#cce186','text-anchor="middle"')}
 ${Array.from({length:9},(_,i)=>`<ellipse cx="${487+i*8}" cy="213" rx="5" ry="21" fill="none" stroke="#6b7679" stroke-width="4"/>`).join('')}
 <g transform="translate(315 253) rotate(23)"><rect x="-6" y="-13" width="104" height="26" rx="7" fill="#c5992e" stroke="#f0d382"/><rect x="19" y="-16" width="27" height="32" rx="5" fill="#d5a326"/><path d="M65-18v36m8-36v36m8-36v36m8-36v36" stroke="#27333a" stroke-width="4"/></g>
 <g transform="translate(585 253) rotate(157)"><rect x="-6" y="-13" width="104" height="26" rx="7" fill="#c5992e" stroke="#f0d382"/><rect x="19" y="-16" width="27" height="32" rx="5" fill="#d5a326"/><path d="M65-18v36m8-36v36m8-36v36m8-36v36" stroke="#27333a" stroke-width="4"/></g>
 <path d="M232 309L325 288 363 312 535 312 575 288 668 309 625 329H275Z" fill="url(#rhCarbon)" stroke="#65757a"/>
 ${Array.from({length:4},(_,i)=>`<rect x="${402+i*27}" y="332" width="18" height="40" rx="6" fill="#24607c" stroke="#88b4c1"/>`).join('')}
 <path d="M388 387Q362 365 338 400Q324 425 386 454L432 440Z" fill="url(#rhFoil)" stroke="#b2b7ad"/>
 <path d="M512 387Q538 365 562 400Q576 425 514 454L468 440Z" fill="url(#rhFoil)" stroke="#b2b7ad"/>
 ${pipe('M390 427L416 476',33,'#a8b2b2')}${pipe('M510 427L484 476',33,'#a8b2b2')}
 <ellipse cx="416" cy="476" rx="20" ry="10" fill="#071016" stroke="#bdc9c9" stroke-width="3"/><ellipse cx="484" cy="476" rx="20" ry="10" fill="#071016" stroke="#bdc9c9" stroke-width="3"/>
 ${fasteners([[279,208],[621,208],[268,316],[632,316],[346,86],[554,86],[210,371],[690,371],[362,312],[537,312]])}
 `+end(`<path d="M163 44Q450 3 737 44L796 385 724 440H176L104 385Z" fill="#d9ddda" stroke="#8b999d" stroke-width="2"/><path d="M301 58L410 45H490L599 58 563 365H337Z" fill="url(#rhCarbon)" stroke="#64767e"/><path d="M361 92H539L514 230H386Z" fill="url(#rhGlass)" stroke="#7d969d"/><path d="M170 58L186 400M730 58L714 400" stroke="#d17731" stroke-width="6"/>${ribs(377,262,9,0,9,146)}`,'JESKO · REAR CLAMSHELL');}

export function p1Engine(){return start('McLaren P1 • M838TQ rear service view with Y collector, carbon plenums, heat shields and side fans','#c66423')+`
 <path d="M182 61L334 76 311 285 207 339 137 390Z" fill="url(#rhCarbon)" stroke="#7a8c94"/><path d="M718 61L566 76 589 285 693 339 763 390Z" fill="url(#rhCarbon)" stroke="#7a8c94"/>
 <path d="M313 72H589L619 106 595 130H307L278 108Z" fill="url(#rhCarbon)" stroke="#62737b"/>
 <circle cx="328" cy="94" r="15" fill="#293941" stroke="#718992"/><circle cx="572" cy="94" r="15" fill="#293941" stroke="#718992"/>
 ${t(328,97,'OIL',7,'#efd273','text-anchor="middle"')}${t(572,97,'COOL',6,'#e7ce73','text-anchor="middle"')}
 <path d="M401 119Q450 88 499 119L487 239H413Z" fill="url(#rhCarbon)" stroke="#7b8d94"/>
 ${t(450,162,'McLaren',13,'#b6c5c8','text-anchor="middle" font-style="italic"')}
 <path d="M316 139L386 140 380 224 314 217ZM584 139L514 140 520 224 586 217Z" fill="url(#rhMetal)" stroke="#83969d"/>
 ${pipe('M411 152Q379 117 353 149',23,'#31414a')}${pipe('M489 152Q521 117 547 149',23,'#31414a')}
 ${pipe('M285 179L257 268 285 357',10,'#40545d')}${pipe('M615 179L643 268 615 357',10,'#40545d')}
 <path d="M385 230L515 230 575 425 325 425Z" fill="url(#rhFoil)" stroke="#d0cfc3"/>
 <path d="M350 228Q322 221 335 276L361 314 391 298 381 257Z" fill="url(#rhFoil)" stroke="#adb6b5"/>
 <path d="M550 228Q578 221 565 276L539 314 509 298 519 257Z" fill="url(#rhFoil)" stroke="#adb6b5"/>
 ${pipe('M370 290Q386 334 449 379L450 435',29,'#b1a485')}${pipe('M530 290Q514 334 451 379',29,'#b1a485')}
 ${[326,345,369,406].map(y=>p(`M${y<370?404-(370-y)*.7:435} ${y}l${y<370?13:30} ${y<370?-15:0}`,'none','stroke="#726055" stroke-width="2"')).join('')}
 <path d="M420 447H480L494 474H406Z" fill="#171e23" stroke="#b6c1c4" stroke-width="3"/>
 <path d="M303 225H597M312 231H588" stroke="#a8b7bc" stroke-width="4"/>
 ${[340,385,514,557].map(x=>`<rect x="${x}" y="220" width="5" height="18" fill="#3b82a3"/>`).join('')}
 <path d="M206 329L290 312 321 415 194 431ZM694 329L610 312 579 415 706 431Z" fill="url(#rhCarbon)" stroke="#7c9099"/>
 ${fan(263,375,43)}${fan(637,375,43)}
 <path d="M612 100L659 120 678 191" fill="none" stroke="#d77b29" stroke-width="9"/>
 <rect x="672" y="255" width="55" height="54" rx="6" fill="url(#rhMetal)" stroke="#647783"/>${ribs(679,266,5,0,7,42)}
 ${fasteners([[309,84],[591,84],[322,147],[578,147],[342,254],[558,254],[305,405],[595,405],[686,263],[714,301]])}
 ${t(450,499,'3.8 TWIN-TURBO V8 · IPAS REAR HYBRID DRIVE',10,'#c2cdd1','text-anchor="middle"')}
 `+end(`<path d="M162 43Q450 7 738 43L795 402 709 443H191L105 402Z" fill="#cd6d29" stroke="#de9f62" stroke-width="2"/><path d="M367 52H533L585 355 518 418H382L315 355Z" fill="url(#rhCarbon)" stroke="#7f9096"/><path d="M394 86H506L532 251H368Z" fill="url(#rhGlass)" stroke="#798e99"/><path d="M416 52h68l11 79h-90Z" fill="#0b171f" stroke="#778991"/>${ribs(366,276,11,0,9,169)}`,'McLAREN P1 · CARBON REAR CLAMSHELL');}

export function f80Engine(){return start('Ferrari F80 • 120 degree V6, carbon rear structure, transverse active suspension and twin exhaust ducts','#bc2a2c')+`
 <path d="M187 53L310 75 337 269 238 374 132 374Z" fill="url(#rhCarbon)" stroke="#7b8b91"/><path d="M713 53L590 75 563 269 662 374 768 374Z" fill="url(#rhCarbon)" stroke="#7b8b91"/>
 <path d="M304 104L427 121 419 282 284 259Z" fill="url(#rhCarbon)" stroke="#5f7480"/><path d="M596 104L473 121 481 282 616 259Z" fill="url(#rhCarbon)" stroke="#5f7480"/>
 <path d="M339 172L413 180 407 245 332 237Z" fill="url(#rhMetal)"/>
 ${t(369,211,'Ferrari',17,'#243238','transform="rotate(6 369 211)" text-anchor="middle" font-family="Georgia,serif"')}
 ${pipe('M316 124Q246 95 245 213L280 276',25,'#263c49')}${pipe('M584 124Q654 95 655 213L620 276',25,'#263c49')}
 <path d="M419 71H481L503 242 548 296 515 327 385 327 352 296 397 242Z" fill="url(#rhCarbon)" stroke="#81919a" stroke-width="2"/>
 <path d="M439 104H461L470 204H430Z" fill="#101c24"/><path d="M433 279h34v26h-34Z" fill="url(#rhMetal)"/>
 <path d="M233 335Q450 283 667 335L650 370Q450 327 250 370Z" fill="url(#rhCarbon)" stroke="#7b8e96"/>
 <g transform="translate(239 299) rotate(-13)"><rect width="159" height="18" y="-9" rx="8" fill="url(#rhMetal)"/><rect x="46" y="-14" width="72" height="28" rx="9" fill="#b02b34"/>${Array.from({length:8},(_,i)=>`<ellipse cx="${32+i*14}" cy="0" rx="7" ry="23" fill="none" stroke="#b9c3bd" stroke-width="4"/>`).join('')}</g>
 <g transform="translate(661 299) rotate(193)"><rect width="159" height="18" y="-9" rx="8" fill="url(#rhMetal)"/><rect x="46" y="-14" width="72" height="28" rx="9" fill="#b02b34"/>${Array.from({length:8},(_,i)=>`<ellipse cx="${32+i*14}" cy="0" rx="7" ry="23" fill="none" stroke="#b9c3bd" stroke-width="4"/>`).join('')}</g>
 <path d="M403 347Q358 331 356 381L377 462H440L447 384Z" fill="url(#rhLeather)" stroke="#778993" stroke-width="3"/>
 <path d="M497 347Q542 331 544 381L523 462H460L453 384Z" fill="url(#rhLeather)" stroke="#778993" stroke-width="3"/>
 <ellipse cx="408" cy="463" rx="32" ry="14" fill="#070f15" stroke="url(#rhMetal)" stroke-width="4"/><ellipse cx="492" cy="463" rx="32" ry="14" fill="#070f15" stroke="url(#rhMetal)" stroke-width="4"/>
 <path d="M194 218l29 135 41 45m442-180-29 135-41 45" stroke="#7e8e93" stroke-width="8" fill="none"/>
 <path d="M555 185l31 34 4 51" stroke="#d07a29" stroke-width="5" fill="none"/>
 ${fasteners([[425,80],[475,80],[398,253],[502,253],[378,300],[522,300],[246,339],[654,339],[227,115],[673,115]])}
 ${t(450,499,'F163CF · V6 / REAR MGU-K · FRONT E-AXLE AHEAD OF CABIN',10,'#b6c6cd','text-anchor="middle"')}
 `+end(`<path d="M157 49L378 33H522L743 49 790 400 710 440H190L110 400Z" fill="#b5242d" stroke="#e16561" stroke-width="2"/><path d="M353 43H547L580 398H320Z" fill="url(#rhCarbon)" stroke="#70868f"/>${Array.from({length:6},(_,i)=>p(`M${364-i*3} ${87+i*43}h${172+i*6}l3 20H${361-i*3}Z`,'#050c12','stroke="#526870"')).join('')}`,'F80 · SIX-LOUVRE ENGINE DECK');}

export function alfaEngine(){return start('Alfa Romeo 33 Stradale • modern twin-turbo V6 compartment with sculpted carbon cover and service caps','#912830')+`
 <path d="M167 61Q450 31 733 61L769 385 718 451H182L131 385Z" fill="url(#rhCarbon)" stroke="#7f8c8e"/>
 <path d="M267 115L412 95 487 103 627 160 664 346 611 399 267 367 232 207Z" fill="#111c24" stroke="#667982"/>
 <path d="M173 95L317 70 381 133 286 183 218 342 150 327Z" fill="url(#rhLeather)" stroke="#637580" stroke-width="2"/>
 <path d="M728 95L589 70 526 133 619 183 680 342 747 327Z" fill="url(#rhLeather)" stroke="#637580" stroke-width="2"/>
 <path d="M215 145L313 100 358 135 291 176 262 268 200 299Z" fill="url(#rhMesh)" stroke="#819298"/>
 <path d="M685 145L587 100 542 135 609 176 638 268 700 299Z" fill="url(#rhMesh)" stroke="#819298"/>
 <path d="M317 169L503 120 594 191 577 298 439 362 292 316 314 255 405 250 449 228 365 222Z" fill="url(#rhCarbon)" stroke="#8a989b" stroke-width="2"/>
 <path d="M307 177L478 135 587 181 575 213 408 249 299 219Z" fill="#172c3a" stroke="#849398"/>
 ${t(440,210,'Alfa Romeo',30,'#c4cfd1','text-anchor="middle" font-family="Georgia,serif" font-style="italic" transform="rotate(3 440 210)"')}
 <path d="M318 280L427 282 548 245 559 289 440 340 294 315Z" fill="#101b23" stroke="#697e86"/>
 <path d="M235 331L332 330 370 406 248 428 197 388Z" fill="url(#rhLeather)" stroke="#819099"/>
 <path d="M665 331L568 330 530 406 652 428 703 388Z" fill="url(#rhLeather)" stroke="#819099"/>
 <circle cx="279" cy="371" r="26" fill="#081218" stroke="#4b5f6a" stroke-width="7"/><circle cx="279" cy="371" r="17" fill="#35444b" stroke="#697973"/>${t(279,375,'OIL',10,'#d5c279','text-anchor="middle"')}
 <circle cx="621" cy="371" r="26" fill="#081218" stroke="#4b5f6a" stroke-width="7"/><circle cx="621" cy="371" r="17" fill="#35444b" stroke="#697973"/>${t(621,375,'COOL',8,'#d5c279','text-anchor="middle"')}
 <path d="M373 393L528 393 552 448 348 448Z" fill="url(#rhCarbon)"/>
 ${ribs(377,401,5,0,8,146)}${fasteners([[214,111],[686,111],[329,159],[545,169],[304,298],[554,281],[226,361],[674,361],[360,429],[540,429]])}
 ${t(450,493,'3.0 TWIN-TURBO V6 · LONGITUDINAL REAR ENGINE',10,'#b7c8cd','text-anchor="middle"')}
 `+end(`<path d="M174 49Q450-3 726 49L795 380 705 441H195L105 380Z" fill="#982b31" stroke="#d96964" stroke-width="2"/><path d="M277 70Q450 19 623 70L672 364 618 404H282L228 364Z" fill="url(#rhGlass)" stroke="#98a5a3" stroke-width="4"/><path d="M255 152L647 132M248 216L657 193M239 279L666 257M230 343L674 321" stroke="#17212a" stroke-width="12"/>`,'33 STRADALE · GLASS REAR CLAMSHELL');}

export const ENGINES={bugatti:bugattiEngine,koenigsegg:jeskoEngine,p1:p1Engine,ferrari:f80Engine,alfa33:alfaEngine};
