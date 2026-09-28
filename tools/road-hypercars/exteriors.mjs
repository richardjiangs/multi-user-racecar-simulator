// Side elevations, rear at left, drawn individually from the references in docs/ROAD_HYPERCARS_ART.md.
// Shared material / wheel hardware never determines a roofline, door or body panel.
import {defs,path as p,text as t} from './materials.mjs';
function setup(name,body,paint,door='rotate(48deg) translate(8px,-12px)'){
 return `<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${name} side elevation" xmlns="http://www.w3.org/2000/svg">${defs}<defs>
 <linearGradient id="rhPaint" x2=".15" y2="1"><stop stop-color="${paint[0]}"/><stop offset=".26" stop-color="${paint[1]}"/><stop offset=".62" stop-color="${paint[2]}"/><stop offset=".87" stop-color="${paint[1]}"/><stop offset="1" stop-color="${paint[3]}"/></linearGradient>
 <linearGradient id="rhShine" x2=".2" y2="1"><stop stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#c4d4de" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient>
 <clipPath id="rhBodyClip"><path d="${body}"/></clipPath>
 </defs><style>.wSpin{transform-box:fill-box;transform-origin:center;transform:rotate(var(--wheel-rot,0deg))}#doorArt{transform-box:fill-box;transform-origin:100% 24%;transition:transform .8s cubic-bezier(.2,.8,.3,1)}#doorArt.open{transform:${door}}#rearWingArt{transform-box:fill-box;transform-origin:50% 100%;transform:rotate(calc(var(--wing-deg,10deg)*-.28));transition:transform .4s}#frontFlapArt{transform-origin:center;transform:rotate(var(--flap-deg,0deg))}.rhLamp{opacity:.32}.rh-lights .rhLamp{opacity:1;filter:drop-shadow(0 0 3px #d8efff)}#quadExhaustArt.hot .outlet{stroke:#e7884b}.rh-seam{fill:none;stroke:#060d14;stroke-width:1.2}.rh-highlight{fill:none;stroke:#e3eef5;stroke-opacity:.42;stroke-width:1.1}</style>
 <ellipse cx="500" cy="337" rx="405" ry="10" fill="#02070d" opacity=".8"/>
 <g id="bcBody"><path d="${body}" fill="url(#rhPaint)" stroke="#94a4ad" stroke-width="1.2"/>
 <g clip-path="url(#rhBodyClip)">`;
}
const finishBody='</g></g>';
const lamp=(d)=>p(d,'#d4ecfa','class="rhLamp"');
// Visible through the door opening: shaped seats, belts, wheel, footwell and carbon sill.
// Each opening is clipped to its own hand-drawn aperture, not a shared body template.
function doorInterior(aperture,key){
 const trim={bugatti:'#cc772e',jesko:'#9c866d',p1:'#bb753c',ferrari:'#bc2736',alfa33:'#b4774c',venom:'#bdc4b6',amgone:'#61c1b0',aston:'#9baa73',mcf1:'#b89565'}[key];
 const leather=key==='alfa33'?'url(#rhTan)':key==='ferrari'?'#8e1c29':'url(#rhLeather)';
 return `<defs><clipPath id="rhDoorOpening"><path d="${aperture}"/></clipPath></defs><g clip-path="url(#rhDoorOpening)">
 <path d="${aperture}" fill="#060c12"/>
 <path d="M409 166Q498 130 640 175L662 197 648 214 605 197 423 190Z" fill="#18232b"/>
 <path d="M425 278L558 263 665 282 670 302 427 311Z" fill="url(#rhCarbon)"/>
 <path d="M435 183Q452 164 479 174L491 188 478 225 477 256 545 265 551 283 486 292 449 275 451 237 435 218Z" fill="${leather}" stroke="#4c565c" stroke-width="1.2"/>
 <path d="M447 190Q459 183 477 189L470 221 461 257 485 278 531 276" fill="none" stroke="${trim}" stroke-width="2"/>
 <path d="M439 196L458 204 468 192M451 230l23 7M449 245l24 7" fill="none" stroke="#10171b" stroke-width="2"/>
 <path d="M455 176L479 266 485 282" fill="none" stroke="#05080c" stroke-width="5"/><path d="M479 262l7-1 4 11-7 2Z" fill="#7b8990"/>
 <path d="M603 197L649 196 659 217 604 214 581 226 571 211Z" fill="url(#rhLeather)" stroke="#3f4c55"/>
 <path d="M580 199L573 218" stroke="#66777f" stroke-width="5"/><ellipse cx="571" cy="211" rx="7" ry="19" transform="rotate(22 571 211)" fill="none" stroke="#77878d" stroke-width="3"/>
 <path d="M624 235l12 5-5 24-12-4Zm-18 4 8 2-6 22-8-2Z" fill="#6f7b80"/><path d="M633 239l-5 19M609 242l-5 15" stroke="#1c292f" stroke-width="2"/>
 <path d="M440 295Q550 303 665 294" fill="none" stroke="#788b94" stroke-width="2"/><path d="M493 298h62" stroke="${trim}" stroke-width="1.2"/>
 </g>`;
}
function wheel(x,r,type,caliper){
 let spokes='';
 const angles=Array.from({length:type==='bugatti'||type==='p1'?10:5},(_,i)=>i*360/(type==='bugatti'||type==='p1'?10:5));
 if(type==='alfa33'){
  spokes=`<circle r="${r*.81}" fill="#9c8050" stroke="#e3c693" stroke-width="2"/>`+angles.map(a=>`<ellipse cx="0" cy="${-r*.47}" rx="${r*.205}" ry="${r*.28}" fill="#0a1218" stroke="#cbb280" stroke-width="2.4" transform="rotate(${a})"/>`).join('');
 }else{
  spokes=angles.map(a=>type==='ferrari'?p(`M-6-9L${-r*.21}-${r*.78} ${r*.04}-${r*.82} 10-9 5 7Z`,'#444f57',`stroke="#97a8b1" stroke-width="1" transform="rotate(${a})"`):p(type==='jesko'?`M-5-7L${-r*.15}-${r*.8} ${r*.1}-${r*.81} 7-8 4 10Z`:`M-4-7L${-r*.16}-${r*.8} ${-r*.07}-${r*.83} 4-11 ${r*.1}-${r*.82} ${r*.16}-${r*.79} 8-4Z`,type==='jesko'?'url(#rhCarbon)':'#35424c',`stroke="#7e939e" stroke-width=".8" transform="rotate(${a})"`)).join('');
 }
 return `<g transform="translate(${x} ${330-r})"><circle r="${r}" fill="#050b10" stroke="#394750" stroke-width="2"/><circle r="${r*.91}" fill="#111c23" stroke="#6a7980" stroke-width="1"/><circle r="${r*.69}" fill="#66717a" stroke="#101b24" stroke-width="2"/>${Array.from({length:28},(_,i)=>`<circle cx="${Math.cos(i*Math.PI/14)*r*.55}" cy="${Math.sin(i*Math.PI/14)*r*.55}" r="1.2" fill="#1b2932"/>`).join('')}
 <path d="M${r*.41}-${r*.47}q${r*.25} ${r*.35} 0 ${r*.85}l${r*.19} 0q${r*.25}-${r*.4} 0-${r*.84}Z" fill="${caliper}" stroke="#111d26"/>
 <g class="wSpin"><circle r="${r*.81}" fill="none" stroke="#7e8c95" stroke-width="2"/>${spokes}<circle r="11" fill="#16262e" stroke="#a0acb2" stroke-width="2"/><circle r="5" fill="${type==='ferrari'?'#ddc54e':type==='alfa33'?'#a98b53':'#81909b'}"/>${Array.from({length:5},(_,i)=>`<circle cx="${Math.cos(i*Math.PI*.4)*8}" cy="${Math.sin(i*Math.PI*.4)*8}" r="1.2" fill="#c4ced2"/>`).join('')}</g>
 <path d="M${-r*.65}-${r*.53}A${r*.84} ${r*.84} 0 0 1 ${r*.65}-${r*.53}" fill="none" stroke="#606e76" stroke-dasharray="2 3" stroke-width="1"/>
 </g>`;
}
export {setup,finishBody,lamp,doorInterior,wheel};

export function drawBugatti(){
 const body='M78 207L83 269 109 294 220 310A71 117 0 0 1 362 310L679 310A71 109 0 0 1 821 310L902 307Q925 301 922 272L915 239Q884 207 828 196Q785 179 749 184Q702 183 677 190Q615 137 566 125Q484 106 430 139Q373 168 338 179Q211 181 78 207Z';
 return setup('Bugatti Chiron Super Sport 300+',body,['#71808b','#29343e','#101a23','#050b12'],'scaleX(.65) skewY(-9deg)')+`
 <path d="M81 212Q265 166 412 173Q541 127 678 192Q810 162 916 241L903 259Q745 193 681 218L371 214 80 246Z" fill="url(#rhShine)"/>
 <path d="M74 268L228 292 664 299 921 281V348H60Z" fill="url(#rhCarbon)"/>
 <path d="M121 200Q322 166 430 139Q492 112 567 128Q620 144 678 192" fill="none" stroke="#e67624" stroke-width="4"/>
 <path d="M154 202Q331 174 438 143Q494 121 565 134" fill="none" stroke="#ab511e" stroke-width="2"/>
 <path d="M423 151Q382 174 383 214Q381 270 429 289L583 290 672 306 450 309Q354 306 350 225Q345 174 405 147Z" fill="#07111a"/>
 <path d="M430 143Q371 160 368 213Q359 290 444 295L664 299" fill="none" stroke="#8597a0" stroke-width="4"/>
 <path d="M421 157Q386 171 384 210Q380 248 417 270L428 184Z" fill="url(#rhMesh)"/>
 <path d="M683 209L673 247 696 240 706 211Z" fill="#040c13" stroke="#728590"/><path d="M688 211l10 19" stroke="#b1bec2" stroke-width="2"/>
 ${Array.from({length:9},(_,i)=>`<ellipse cx="${734+i*7}" cy="${191+(i-4)*(i-4)*.17}" rx="2.1" ry="1.4" fill="#070c12"/>`).join('')}
 <path d="M91 209L142 204 151 211 96 219Z" fill="#8b1831"/><path d="M93 212l48-4" stroke="#f26c6d" stroke-width="2"/>
 <path d="M856 219Q883 219 902 240L866 237Z" fill="#0a1620" stroke="#889ba6"/>
 ${[0,1,2,3].map(i=>lamp(`M${864+i*8} ${225+i*2}h5v5h-5Z`)).join('')}
 <path d="M891 258L916 258 918 291 893 293Z" fill="url(#rhMesh)" stroke="#6e808a"/><path d="M836 259L861 267 854 296 831 296Z" fill="#050f18"/>
 <path d="M94 239L174 229 189 247 104 258Z" fill="url(#rhMesh)"/>
 <path d="M129 267L193 267 205 290H145Z" fill="#07121b"/>
 ${doorInterior('M380 166L439 142 566 141 660 198 670 289 437 285Z','bugatti')}
 </g>
 <g id="doorArt">
 <path d="M433 148Q488 127 563 141L658 198 669 290 443 286Q397 259 398 211Q399 174 433 148Z" fill="url(#rhPaint)" stroke="#080e14" stroke-width="1.5"/>
 <path d="M432 154Q491 135 559 147L641 195 413 194Q408 172 432 154Z" fill="url(#rhGlass)" stroke="#8095a0"/>
 <path d="M472 145L474 194M560 147L555 194" stroke="#101d26" stroke-width="4"/>
 <path d="M423 204Q535 194 655 205L660 249Q531 254 443 275Q408 257 407 220Z" fill="url(#rhShine)"/>
 <path d="M403 213Q399 280 451 290L666 296" fill="none" stroke="#929fa5" stroke-width="2"/>
 <ellipse cx="479" cy="224" rx="16" ry="5" fill="#080f16" stroke="#6b7b84"/><path d="M463 223h31" stroke="#8b979e"/>
 <path d="M645 199l18 4 6 13-24-4Z" fill="#101b24"/><path d="M640 185q15-11 33 0l-2 11-29 0Z" fill="url(#rhPaint)" stroke="#92a3ad"/>
 </g></g>
 <g id="rearWingArt"><path d="M79 202Q175 180 307 182L320 187 108 215Z" fill="url(#rhCarbon)" stroke="#78909b"/></g>
 <g id="frontFlapArt"><path d="M819 310L925 308 930 314 818 317Z" fill="url(#rhCarbon)" stroke="#647b8a"/></g>
 <path d="M86 270L212 292 210 313 112 302Z" fill="url(#rhCarbon)" stroke="#586c78"/>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="91" cy="259" rx="7" ry="10" fill="#050b10" stroke="#9ca9af" stroke-width="3"/><ellipse class="outlet" cx="94" cy="281" rx="7" ry="10" fill="#050b10" stroke="#9ca9af" stroke-width="3"/></g>
 ${wheel(291,67,'bugatti','#262f35')}${wheel(750,63,'bugatti','#262f35')}
 </svg>`;
}

export function drawJesko(){
 const body='M78 201Q137 182 195 173Q249 163 316 172L386 161Q429 120 484 113Q548 106 607 139L681 188Q752 174 802 194Q863 217 922 252L915 289 884 310H813A70 114 0 0 0 673 310H322A74 124 0 0 0 174 310L107 300 78 274Z';
 return setup('Koenigsegg Jesko Attack / Absolut',body,['#f6f9f6','#bbc7cd','#778b98','#293e4d'])+`
 <path d="M77 203Q228 170 356 191L419 168 679 197Q805 177 920 250L908 270Q791 220 684 229L466 249 320 221 75 244Z" fill="url(#rhShine)"/>
 <path d="M72 268L161 286 323 294 674 286 920 285V347H70Z" fill="url(#rhCarbon)"/>
 <path d="M355 195Q400 187 446 207L417 264 353 277 335 233Z" fill="url(#rhMesh)" stroke="#465b68"/>
 <path d="M333 221L418 203 433 210 352 238 329 271Z" fill="#142732" stroke="#a9b9c0"/>
 <path d="M340 219l74-16" stroke="#d9692c" stroke-width="3"/>
 <path d="M406 162L454 131 482 121 555 124 602 148 670 193 436 199Z" fill="#111e27"/>
 <path d="M365 167L408 155 420 166 382 182Z" fill="url(#rhGlass)" stroke="#b3c2c6"/>
 <path d="M316 180l48-7M315 186l49-7M314 192l43-5" stroke="#111f2b" stroke-width="3"/>
 <path d="M83 222Q107 205 145 209L162 219Q116 217 97 231Z" fill="#61172c" stroke="#9b263d"/><path d="M91 221q25-10 55-5" stroke="#fa7883" stroke-width="2"/>
 <path d="M849 232Q874 231 899 248L873 252 842 244Z" fill="#0b1822" stroke="#9cacb6"/>${lamp('M850 237L888 245 879 248 849 241Z')}
 <path d="M832 263L866 273 855 290 814 296Z" fill="#081621"/><path d="M828 264L859 274" stroke="#b7c9d0" stroke-width="1.2"/>
 <path d="M125 249L156 246 166 277 125 275Z" fill="url(#rhMesh)"/>
 ${doorInterior('M433 174L662 197 674 294 439 292Z','jesko')}
 </g>
 <g id="doorArt"><path d="M451 132Q512 111 563 134L659 194 675 291 448 292 421 255 433 166Z" fill="url(#rhPaint)" stroke="#1a2c36" stroke-width="1.4"/>
 <path d="M451 141Q511 122 559 143L641 190 439 185Z" fill="url(#rhGlass)" stroke="#425e70" stroke-width="2"/><path d="M548 139L552 187" stroke="#0e202b" stroke-width="4"/>
 <path d="M440 203Q551 210 656 200L665 226Q558 254 445 275Z" fill="url(#rhShine)"/><path d="M442 273L661 240" class="rh-highlight"/>
 <path d="M459 212h22l-1 5h-23Z" fill="#263b46"/><path d="M636 188l17-2 12 17-24 0Z" fill="#111f28"/><path d="M639 178q11-7 28 0l1 12-27 2Z" fill="url(#rhCarbon)" stroke="#6d8592"/>
 </g></g>
 <g id="kgWingPylons"><path d="M129 185L165 130H179L152 184ZM236 177L260 127H272L258 178Z" fill="url(#rhCarbon)" stroke="#8d9ea4"/></g>
 <g id="rearWingArt"><path d="M75 123Q156 142 271 117L317 125Q188 156 83 139Z" fill="url(#rhCarbon)" stroke="#7d919b" stroke-width="1.5"/><path d="M79 116l48 10-1 25-36-4Z" fill="#a14e2a" stroke="#d38d56"/><path d="M85 128Q168 143 303 126" fill="none" stroke="#d97a35" stroke-width="2"/></g>
 <g id="kgAbsolutTail" style="display:none"><path d="M80 201L65 198 62 273 78 280Z" fill="url(#rhPaint)" stroke="#a8b7bc"/></g>
 <g id="kgAbsolutFins" style="display:none"><path d="M102 197L255 146 223 189ZM163 190L317 149 274 184Z" fill="url(#rhCarbon)" stroke="#a2b5be"/></g>
 <g id="frontFlapArt"><path d="M816 304L925 295 934 306 815 317Z" fill="url(#rhCarbon)" stroke="#ac6035" stroke-width="2"/></g>
 <path d="M81 273L167 285 170 312 89 300Z" fill="url(#rhCarbon)" stroke="#617f91"/><path d="M332 307H669L656 316H341Z" fill="#0b1c27" stroke="#708897"/>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="91" cy="270" rx="11" ry="14" fill="#030a10" stroke="#c4c9c6" stroke-width="3"/></g>
 ${wheel(248,68,'jesko','#b15b34')}${wheel(743,63,'jesko','#b15b34')}
 <g id="kgWheelCovers" style="display:none"><circle cx="248" cy="262" r="51" fill="url(#rhCarbon)" stroke="#7a949c"/><circle cx="248" cy="262" r="12" fill="#13232c" stroke="#a6bec4"/></g>
 </svg>`;
}

export function drawP1(){
 const body='M78 233Q136 198 213 182Q262 168 329 185L374 169Q427 121 475 117Q528 109 583 138L662 192Q711 176 755 183Q822 190 879 235L922 272 913 300 874 311H810A70 113 0 0 0 670 311H322A73 123 0 0 0 176 311L100 303 78 276Z';
 return setup('McLaren P1',body,['#ffe09a','#e7842c','#993706','#422315'])+`
 <path d="M77 237Q201 163 331 200L427 166 637 192 666 216Q780 169 923 274L907 287Q762 224 680 241L593 274 338 230 78 260Z" fill="url(#rhShine)"/>
 <path d="M81 278L174 291 325 299 666 291 921 302V349H70Z" fill="url(#rhCarbon)"/>
 <path d="M344 205Q426 181 455 205L435 279Q386 292 335 257Z" fill="url(#rhMesh)" stroke="#c78752"/>
 <path d="M346 215L417 212 391 236 335 247Z" fill="#172a35"/>
 <path d="M385 169Q429 125 480 123Q535 118 578 144L647 193 420 206Z" fill="url(#rhCarbon)"/>
 <path d="M352 181L415 160 428 172 380 193Z" fill="url(#rhGlass)" stroke="#788f9b"/>
 <path d="M92 243Q110 224 146 222L146 230Q122 234 112 247L130 258 120 262Z" fill="#921c32" stroke="#eb5a61" stroke-width="1.6"/>
 <path d="M874 244Q838 217 823 226Q823 241 848 253L837 273 886 261Z" fill="#0a1520" stroke="#8396a3"/>
 ${lamp('M873 244Q843 226 831 229L839 242 858 245 844 250 852 252Z')}
 <path d="M890 276L918 277 913 298 867 302Z" fill="url(#rhMesh)"/>
 <path d="M831 273L849 266 835 298 816 304Z" fill="#06121c"/>
 ${doorInterior('M426 173L640 195 670 281 442 298 418 253Z','p1')}
 </g>
 <g id="doorArt"><path d="M448 134Q510 122 571 146L638 192 668 281Q579 266 499 296L443 294 424 254 433 172Z" fill="url(#rhPaint)" stroke="#482619" stroke-width="1.4"/>
 <path d="M448 143Q509 132 569 153L626 191 437 195 438 168Z" fill="url(#rhGlass)" stroke="#a29b86"/>
 <path d="M473 139L465 193" stroke="#162934" stroke-width="3"/>
 <path d="M434 217Q514 235 641 205L666 278Q581 250 501 293L444 288Z" fill="url(#rhCarbon)" stroke="#7f8380"/>
 <path d="M440 223Q524 240 641 213L648 232Q566 246 499 280L446 282Z" fill="url(#rhShine)"/>
 <path d="M446 210h22l-1 5h-23Z" fill="#51321e"/><path d="M620 198l19-5 8 24-23-4Z" fill="#1c2830"/><path d="M615 180q15-9 35 5l-2 12-28 2Z" fill="url(#rhCarbon)" stroke="#8f9ba0"/>
 </g></g>
 <path d="M445 117l18-14 55 2 17 14Z" fill="url(#rhCarbon)" stroke="#81949f"/>
 <path d="M137 213V166h9v43M260 187l2-32h9l-3 31" fill="#2d414d" stroke="#a1b0b7"/>
 <g id="rearWingArt"><path d="M84 151Q174 171 302 145L316 154Q185 181 88 163Z" fill="url(#rhCarbon)" stroke="#bcb6a3" stroke-width="2"/><path d="M86 163Q189 181 311 155" fill="none" stroke="#ba672f" stroke-width="2"/></g>
 <g id="frontFlapArt"><path d="M812 309L925 306 929 315 813 319Z" fill="url(#rhCarbon)" stroke="#8699a4"/></g>
 <path d="M83 278L170 298 170 313 92 302Z" fill="url(#rhCarbon)" stroke="#71828d"/>
 <g id="quadExhaustArt"><path class="outlet" d="M80 267l14-3 4 18-15 3Z" fill="#060e15" stroke="#a1b0b8" stroke-width="3"/></g>
 ${wheel(249,67,'p1','#d26c31')}${wheel(740,62,'p1','#d26c31')}
 </svg>`;
}

export function drawF80(){
 const body='M78 221L94 202Q182 176 260 180L339 179 399 161Q448 133 486 132L558 137 651 179 683 196Q714 184 757 190Q815 191 853 211L920 263 922 293 896 313H808A66 112 0 0 0 676 313L347 313A70 121 0 0 0 207 313L116 305 83 280Z';
 return setup('Ferrari F80',body,['#ff9b82','#e3322f','#92121d','#400b17'])+`
 <path d="M78 227Q198 170 336 196L412 176 646 184 676 211Q782 175 921 267L909 282Q789 227 683 246L565 266 345 221 78 256Z" fill="url(#rhShine)"/>
 <path d="M80 275L197 290 347 291 676 293 922 291V349H71Z" fill="url(#rhCarbon)"/>
 <path d="M399 162Q452 132 486 132L558 137 648 179 666 198 502 201 438 180Z" fill="url(#rhCarbon)"/>
 <path d="M399 161L449 145 443 181 375 191 333 182Z" fill="url(#rhPaint)"/>
 <path d="M362 190L411 179 414 199Q398 213 360 211Z" fill="#081721" stroke="#4a626e"/>
 <path d="M92 223L174 216 177 238 86 250Z" fill="url(#rhCarbon)"/>
 <path d="M92 224l75-5" stroke="#fe7780" stroke-width="3"/>
 ${Array.from({length:6},(_,i)=>p(`M${225+i*23} ${177-i*3}l21-4 3 6-22 4Z`,'#15222b')).join('')}
 <path d="M836 224L891 252 916 266 894 271 843 246Z" fill="#080f16" stroke="#536b7b"/>
 ${lamp('M878 248L905 263 900 266 875 253Z')}
 <path d="M850 271L866 272 866 302 847 302Z" fill="url(#rhMesh)"/>
 <path d="M692 214L715 202 708 231 683 247Z" fill="#111c23"/><path d="M698 220l10-7-4 14-8 5Z" fill="#e6c83d"/>
 ${doorInterior('M424 188L656 199 671 301 431 299Z','ferrari')}
 </g>
 <g id="doorArt"><path d="M450 146L555 146 649 184 657 210 669 301 435 300 420 257 423 193Z" fill="url(#rhPaint)" stroke="#4b1720" stroke-width="1.5"/>
 <path d="M457 153L549 153 636 187 641 200 491 207 431 190Z" fill="url(#rhGlass)" stroke="#0a1924" stroke-width="4"/>
 <path d="M429 221Q534 239 660 221L666 295 436 296 426 269Z" fill="url(#rhShine)"/>
 <path d="M449 295l211-1M451 217l52-5" class="rh-highlight"/>
 <path d="M634 196l17-5 11 24-21-1Z" fill="#131e25"/><path d="M631 182q17-9 30 4l3 14-29 1Z" fill="url(#rhCarbon)" stroke="#8398a4"/>
 </g></g>
 <path d="M85 205l15-18 53-5-6 21M232 183l9-24 19-2 3 21" fill="url(#rhCarbon)" stroke="#8396a2"/>
 <g id="rearWingArt"><path d="M83 180Q143 188 234 159L286 167Q184 204 86 197Z" fill="url(#rhPaint)" stroke="#a36267" stroke-width="1.5"/><path d="M90 198Q186 199 281 173" class="rh-highlight"/></g>
 <g id="frontFlapArt"><path d="M810 312L925 311 928 318 810 321Z" fill="url(#rhCarbon)" stroke="#7f8f99"/></g>
 <path d="M78 278L193 293 196 315 104 306Z" fill="url(#rhCarbon)" stroke="#748a98"/><path d="M105 292l-1 14m22-10-1 14m24-11-1 11m24-7-1 12" stroke="#283f4d" stroke-width="4"/>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="89" cy="267" rx="8" ry="11" fill="#07111a" stroke="#9caeb7" stroke-width="3"/></g>
 ${wheel(278,64,'ferrari','#e0c13a')}${wheel(742,59,'ferrari','#e0c13a')}
 </svg>`;
}

export function drawAlfa33(){
 const body='M78 208Q122 184 175 179Q244 165 311 177L375 166Q417 124 466 114Q535 107 593 132L670 185Q711 175 754 184Q833 186 884 236L922 272 917 302 885 310H807A67 113 0 0 0 673 310H320A71 122 0 0 0 178 310L110 301 79 274Z';
 return setup('Alfa Romeo 33 Stradale (modern V6)',body,['#ff8c83','#bd1d32','#791024','#360d1b'])+`
 <path d="M78 219Q198 164 308 194Q438 156 658 193L678 209Q791 173 921 274L905 289Q784 224 679 240L505 258 329 218 81 251Z" fill="url(#rhShine)"/>
 <path d="M79 274L176 292 327 295 672 293 921 294V348H69Z" fill="url(#rhCarbon)"/>
 <path d="M337 200Q369 183 405 193Q443 208 426 253Q407 277 370 270L340 243Z" fill="url(#rhMesh)" stroke="#a78478" stroke-width="1.8"/>
 <path d="M341 208Q385 196 421 223M342 232l78-8" fill="none" stroke="#829392" stroke-width="2"/>
 <path d="M382 170Q420 131 471 122Q537 117 586 140L655 188Q562 207 406 194Z" fill="url(#rhGlass)" stroke="#899b9f" stroke-width="2"/>
 <path d="M353 171L411 150 424 162 381 189Z" fill="url(#rhGlass)" stroke="#9caaa7"/>
 <path d="M87 215Q107 207 125 218L124 239 91 238Z" fill="#101923" stroke="#6b8793"/>
 <ellipse cx="104" cy="225" rx="12" ry="9" fill="none" stroke="#e34758" stroke-width="4"/>
 <path d="M844 222Q870 220 899 252L885 271 838 250Z" fill="#0b1a25" stroke="#80959f" stroke-width="1.4"/>
 ${lamp('M845 226Q871 226 891 249L886 254Q868 235 845 231Z')}
 ${Array.from({length:6},(_,i)=>lamp(`M${847+i*6} ${245+i*2}l5 1-2 3-5-1Z`)).join('')}
 <path d="M896 275L919 279 914 299 899 294Z" fill="url(#rhMesh)" stroke="#9aa8a3"/>
 <path d="M92 254L142 247 158 270 100 279Z" fill="url(#rhMesh)"/>
 ${doorInterior('M421 174L650 194 670 290 448 296 418 270Z','alfa33')}
 </g>
 <g id="doorArt"><path d="M451 122Q523 110 587 140L647 185 656 232 667 293Q557 274 449 298L419 264 421 190Z" fill="url(#rhPaint)" stroke="#511829" stroke-width="1.2"/>
 <path d="M452 132Q521 120 580 150L637 188Q547 203 435 190L434 164Z" fill="url(#rhGlass)" stroke="#92a4a5" stroke-width="2"/>
 <path d="M466 127L455 191M584 148L573 198" stroke="#122631" stroke-width="3"/>
 <path d="M432 213Q534 233 653 204L663 265Q557 261 446 286L428 251Z" fill="url(#rhShine)"/>
 <path d="M435 220Q529 237 650 216" class="rh-highlight"/>
 <path d="M635 193l17-3 7 24-23-2Z" fill="#1d272c"/><path d="M627 181q16-11 36 0l1 13-34 4Z" fill="url(#rhPaint)" stroke="#ac726c"/>
 <path d="M635 234l-15 22h31Z" fill="#d8ded5"/><path d="M635 239v12m-6-7 12 4m-12 0 12-4" stroke="#1e694b" stroke-width="3"/>
 </g></g>
 <g id="rearWingArt"><path d="M81 206Q163 173 222 176L230 182Q156 185 82 214Z" fill="url(#rhPaint)" stroke="#bd626a"/></g>
 <g id="frontFlapArt"><path d="M810 310L925 308 929 316 808 319Z" fill="url(#rhCarbon)" stroke="#a4aaa6"/></g>
 <path d="M326 304Q493 319 669 302L663 313 330 316Z" fill="url(#rhMetal)"/><path d="M81 277L167 296 170 311 90 299Z" fill="url(#rhCarbon)" stroke="#5d7889"/>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="91" cy="270" rx="7" ry="9" fill="#09131b" stroke="#b2b5a5" stroke-width="3"/><ellipse class="outlet" cx="110" cy="278" rx="7" ry="9" fill="#09131b" stroke="#b2b5a5" stroke-width="3"/></g>
 ${wheel(249,65,'alfa33','#1b292f')}${wheel(740,62,'alfa33','#1b292f')}
 </svg>`;
}
