// Independent side elevations: rear at left, tyre contact patches at y=330.
import {path as p,text as t} from './materials.mjs';
import {setup,lamp,doorInterior} from './exteriors.mjs';

function roadWheel(x,r,key){
 const n=key==='aston'?7:key==='mcf1'?5:10;
 const spokes=Array.from({length:n},(_,i)=>{
  const d=key==='mcf1'?`M-7-8Q-18-${r*.42}-9-${r*.78}L3-${r*.82}Q-3-${r*.34} 9-8L6 9Z`:key==='aston'?`M-4-8L-11-${r*.79} 3-${r*.82} 6-7 3 10Z`:`M-4-7L-11-${r*.80}-5-${r*.83} 3-12 8-${r*.80} 12-${r*.77} 7-5Z`;
  return p(d,key==='mcf1'?'url(#rhMetal)':'#354c59',`stroke="${key==='mcf1'?'#d4dddc':'#91a3aa'}" stroke-width=".8" transform="rotate(${i*360/n})"`);
 }).join('');
 return `<g transform="translate(${x} ${330-r})"><circle r="${r}" fill="#060b10" stroke="#475760" stroke-width="2"/><circle r="${r*.90}" fill="#101e26" stroke="#71848d"/><circle r="${r*.66}" fill="#65747c" stroke="#9caaae"/>${Array.from({length:32},(_,i)=>`<circle cx="${Math.cos(i*Math.PI/16)*r*.53}" cy="${Math.sin(i*Math.PI/16)*r*.53}" r="1.1" fill="#172a35"/>`).join('')}<path d="M${r*.39}-${r*.42}q${r*.26} ${r*.32} 0 ${r*.77}l${r*.20} 0q${r*.24}-${r*.34} 0-${r*.77}Z" fill="${key==='aston'?'#c4b635':key==='amgone'?'#4c8e88':'#747d7b'}" stroke="#172b37"/><g class="wSpin">${spokes}<circle r="10" fill="#1c303d" stroke="#becacc" stroke-width="2"/><circle r="4" fill="#8199a4"/></g><path d="M${-r*.65}-${r*.56}A${r*.86} ${r*.86} 0 0 1 ${r*.65}-${r*.56}" fill="none" stroke="#9badb3" stroke-width=".8" stroke-dasharray="2 3"/></g>`;
}
const louvres=(x,y,n,w,dx,dy)=>Array.from({length:n},(_,i)=>p(`M${x+i*dx} ${y+i*dy}l${w} 2-2 4-${w} -2Z`,'#0b1922','stroke="#7b969f" stroke-width=".5"')).join('');

export function drawNextVenom(){
 const body='M77 204Q151 177 240 176Q300 168 356 182L412 151Q452 116 520 117Q585 113 638 155L683 189Q744 175 803 198Q875 221 923 262L918 291 890 309H814A69 112 0 0 0 676 309H322A72 123 0 0 0 178 309L109 299 79 274Z';
 return setup('Hennessey Venom F5',body,['#9cbed8','#35678b','#1e3c57','#0d1e31'])+`
 <path d="M79 213Q208 171 358 195L417 167 664 200Q786 175 914 258L908 275Q781 223 665 232L453 253 329 225 79 245Z" fill="url(#rhShine)"/>
 <path d="M82 280L182 294 319 304 677 304 811 293 925 287V345H70Z" fill="url(#rhCarbon)"/>
 <path d="M380 193L415 200 440 261 365 291 331 252Z" fill="#030c14" stroke="#76909d"/><path d="M355 253l22-49 13 3 28 51-57 20Z" fill="url(#rhMesh)"/>
 ${louvres(255,180,7,43,9,2)}
 <path d="M857 227Q881 229 905 258L870 252Z" fill="#071722" stroke="#7d9baa"/>${lamp('M866 235l23 10 6 5-24-6Z')}
 <path d="M79 222l68-4 3 7-70 5Z" fill="#a92f3d"/><path d="M84 222l60-3" stroke="#ee8c7e" stroke-width="1.5"/>
 <path d="M83 241L167 238 179 265 92 267Z" fill="url(#rhMesh)"/>
 <path d="M865 269l45 9-4 21-49 2Z" fill="url(#rhMesh)" stroke="#607e90"/>
 ${doorInterior('M433 162L490 136 548 139 639 191 665 277 448 283Z','venom')}
 </g><g id="doorArt"><path d="M436 158Q490 129 548 137Q591 143 640 190L664 278 457 289 425 219Z" fill="url(#rhPaint)" stroke="#101d26"/>
 <path d="M444 163Q491 139 546 144L621 186 450 203Z" fill="url(#rhGlass)" stroke="#7a97a7"/><path d="M551 146L567 191M444 200L640 192" stroke="#142b3d" stroke-width="4"/>
 <path d="M441 217L640 204 651 239 457 279Z" fill="url(#rhShine)"/><path d="M461 273Q572 266 652 245" class="rh-highlight"/>
 <path d="M620 193l19 10 5 17-18-11Z" fill="#121e27"/><path d="M611 189q13-14 36-4l-1 11-31 3Z" fill="url(#rhPaint)" stroke="#8097a3"/>
 <path d="M448 216h23v5h-23Z" fill="#06131c" stroke="#698592"/>
 </g></g>
 <path d="M331 307L670 307 667 317H335Z" fill="url(#rhCarbon)" stroke="#708b98"/>
 <g id="rearWingArt"><path d="M78 204Q174 183 297 185L309 191 84 214Z" fill="url(#rhPaint)" stroke="#93aebc"/></g>
 <g id="frontFlapArt"><path d="M813 310L925 307 929 315 813 319Z" fill="url(#rhCarbon)" stroke="#839fac"/></g>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="87" cy="267" rx="7" ry="10" fill="#06111a" stroke="#aab9bc" stroke-width="3"/><ellipse class="outlet" cx="90" cy="289" rx="7" ry="10" fill="#06111a" stroke="#aab9bc" stroke-width="3"/></g>
 ${roadWheel(250,67,'venom')}${roadWheel(745,63,'venom')}${t(479,303,'VENOM F5',8,'#bdcdd4','letter-spacing="1"')}
 </svg>`;
}

export function drawNextAmgOne(){
 const body='M66 211Q149 172 238 176L370 172Q409 135 464 128L507 121Q572 115 627 147L692 196Q768 178 826 207Q881 232 935 271L925 300 886 315H824A69 120 0 0 0 686 315H317A72 126 0 0 0 173 315L95 300 69 272Z';
 return setup('Mercedes-AMG ONE',body,['#f0f3ef','#abbfc7','#6a8a9f','#253f53'])+`
 <path d="M63 214Q213 172 370 192L430 156 646 180 695 211Q788 187 921 268L909 286Q793 241 682 252L417 255 307 222 66 244Z" fill="url(#rhShine)"/>
 <path d="M72 285L180 302 317 307H686L825 298 932 296V345H65Z" fill="url(#rhCarbon)"/>
 <path d="M331 199Q370 195 406 213L436 259 346 295 320 257Z" fill="url(#rhMesh)" stroke="#7e9aa7"/>
 <path d="M91 245L173 236 174 276 94 279Z" fill="url(#rhMesh)"/>
 <path d="M852 241L884 249 913 270 871 262Z" fill="#081822" stroke="#88a4af"/>${lamp('M863 248l33 15-26-7Z')}
 <path d="M69 223l84-12 5 5-87 15Z" fill="#a6233b" stroke="#e77b7e"/>
 <path d="M878 280L922 288 912 304 866 302Z" fill="url(#rhMesh)"/>
 <path d="M281 180L423 136 494 122 382 183Z" fill="url(#rhCarbon)" stroke="#526c7b"/>
 ${louvres(315,179,9,29,8,-3)}${louvres(730,194,5,41,10,2)}
 <path d="M499 121l-13-21q19-14 41 0l29 29Z" fill="url(#rhCarbon)" stroke="#8ca5b0"/>
 ${Array.from({length:15},(_,i)=>{const x=128+(i%5)*36,y=209+Math.floor(i/5)*19;return p(`M${x} ${y-5}l1 5 5 3-6-2-6 2 5-3Z`,'#d3dedf','opacity=".40"');}).join('')}
 ${doorInterior('M430 159L486 135 556 139 660 202 658 291 438 291Z','amgone')}
 </g><g id="doorArt"><path d="M439 152Q491 127 556 135Q609 150 660 201L665 292 449 299 419 225Z" fill="url(#rhPaint)" stroke="#152d3a"/>
 <path d="M447 156Q496 135 552 142L640 196 431 203Z" fill="url(#rhGlass)" stroke="#8eacb7"/><path d="M561 143L568 199" stroke="#122737" stroke-width="5"/>
 <path d="M432 218Q542 196 650 216L656 257 450 285Z" fill="url(#rhShine)"/><path d="M450 288L661 282" stroke="#278f92" stroke-width="3"/>
 <path d="M639 204l13-24 12 3-12 30Z" fill="url(#rhCarbon)"/><path d="M642 174q21-10 43 2l-6 10-35-2Z" fill="url(#rhPaint)" stroke="#8da8b6"/>
 <path d="M444 220h26v5h-26Z" fill="#192e3c"/>
 </g></g>
 <g id="rearWingArt"><path d="M99 199l6-24M241 186l-1-17" stroke="#263d47" stroke-width="6"/><path d="M61 169Q169 151 292 164L294 173 65 181Z" fill="url(#rhCarbon)" stroke="#9cb7c2"/></g>
 <g id="frontFlapArt"><path d="M825 313L934 311 942 318 824 322Z" fill="url(#rhCarbon)" stroke="#7b99a7"/></g>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="79" cy="267" rx="9" ry="13" fill="#07131b" stroke="#b8c3c2" stroke-width="3"/><ellipse class="outlet" cx="83" cy="291" rx="4" ry="5" fill="#08141c" stroke="#95a9ae"/></g>
 ${roadWheel(245,68,'amgone')}${roadWheel(755,65,'amgone')}${t(472,313,'AMG  E PERFORMANCE',8,'#b3d1d4','font-style="italic"')}
 </svg>`;
}

export function drawNextAston(){
 const body='M64 217Q133 178 225 180Q279 173 324 209L387 190Q424 134 481 122Q547 104 602 140L668 201Q712 178 758 186Q814 189 847 223L930 263 925 287 890 303H821A69 112 0 0 0 683 303L643 274 370 282 306 304A70 123 0 0 0 166 304L97 294 65 270Z';
 return setup('Aston Martin Valkyrie road / AMR Pro',body,['#91c5b5','#367c70','#174d47','#072b30'],'rotate(62deg) translate(0,-17px)')+`
 <path d="M64 223Q185 168 288 199L344 228 410 191 622 172 679 211Q780 175 850 231L925 269 911 288 811 250 680 254 448 246 321 262 63 250Z" fill="url(#rhShine)"/>
 <path d="M294 243Q355 232 398 244L441 263 635 240 681 271 628 317H329Z" fill="#030b10" stroke="#5d8588"/>
 <path d="M310 291Q405 265 495 296L637 269 647 290 599 315 327 316Z" fill="url(#rhCarbon)" stroke="#789497"/>
 <path d="M315 228L376 219 386 267 345 282Z" fill="url(#rhMesh)"/><path d="M349 275L409 248 434 262 407 295Z" fill="#0a1f28"/>
 <path d="M472 123L475 102 509 99 528 119Z" fill="url(#rhCarbon)" stroke="#6f9d9d"/>
 <path d="M801 204Q826 210 843 237L811 229Z" fill="#071720" stroke="#8db1ae"/>${lamp('M812 213l15 8 6 7-18-7Z')}
 <path d="M66 229L153 204 154 211 69 237Z" fill="#e16160"/>
 <path d="M78 249L151 240 162 272 95 281Z" fill="url(#rhMesh)"/>
 ${doorInterior('M410 174Q451 130 493 130L554 133 636 195 612 253 414 239Z','aston')}
 </g><g id="doorArt"><path d="M417 166Q451 125 492 125Q551 113 592 147L641 194 613 252 412 239 394 202Z" fill="url(#rhPaint)" stroke="#122a31"/>
 <path d="M424 166Q456 133 494 133Q543 124 582 151L621 190 414 205Z" fill="url(#rhGlass)" stroke="#799c9e"/><path d="M497 131L502 198" stroke="#152b32" stroke-width="4"/>
 <path d="M415 211L628 198 611 233 435 233Z" fill="url(#rhCarbon)" stroke="#57787c"/><path d="M438 213h21v4h-21Z" fill="#90a8aa"/>
 </g></g>
 <g class="road-variant-art" id="rearWingArt"><path d="M78 218Q154 199 241 198L245 207 80 228Z" fill="url(#rhCarbon)" stroke="#809b96"/></g>
 <g class="amr-variant-art"><path d="M31 271L143 280 157 299 43 296Z" fill="url(#rhPaint)" stroke="#6aa997"/><path d="M68 222L75 151M171 204V145" stroke="#182f33" stroke-width="8"/><path d="M27 141Q128 127 260 140L255 155 28 158Z" fill="url(#rhCarbon)" stroke="#a4bd49" stroke-width="3"/></g>
 <g id="frontFlapArt"><path d="M823 302L940 294 945 309 822 315Z" fill="url(#rhCarbon)" stroke="#b3c96a" stroke-width="2"/></g>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="86" cy="249" rx="8" ry="6" fill="#0b171b" stroke="#b5beb7" stroke-width="3"/></g>
 <path d="M663 219l4-11 14 1 2 8Z" fill="#243e40" stroke="#839f9b"/>
 ${roadWheel(236,67,'aston')}${roadWheel(752,64,'aston')}
 </svg>`;
}

export function drawNextMcf1(){
 const body='M83 207Q163 180 256 180L365 185Q407 144 463 130Q514 117 561 135Q616 151 668 199Q735 183 789 208Q865 240 925 275L920 299 885 313H804A67 112 0 0 0 670 313H320A72 122 0 0 0 176 313L106 300 84 271Z';
 return setup('McLaren F1 1993',body,['#e4eae5','#a0b3ba','#6a8798','#304759'])+`
 <path d="M81 217Q235 171 368 202L422 161 624 172 675 222Q772 194 918 279L910 294Q781 250 674 262L432 273 333 239 82 252Z" fill="url(#rhShine)"/>
 <path d="M83 283L177 299 319 305 670 305 804 301 925 296V345H80Z" fill="url(#rhCarbon)"/>
 <path d="M329 238L391 204 419 245 351 287 325 284Z" fill="url(#rhMesh)" stroke="#8aa4af"/>
 ${louvres(268,186,9,42,8,1)}
 <path d="M482 126l-8-14q19-12 41-2l22 20Z" fill="#10232f" stroke="#869da8"/>
 <path d="M85 224l59-10 11 7-67 12Z" fill="#1a2b38"/><ellipse cx="98" cy="224" rx="8" ry="5" fill="#d44b4e"/><ellipse cx="118" cy="220" rx="8" ry="5" fill="#bf493b"/>
 <path d="M847 250L881 260 903 277 859 266Z" fill="#0c1a28" stroke="#9db3be"/>
 ${lamp('M859 254l10 5 5 7-10-3ZM873 260l10 5 5 7-10-3Z')}
 <path d="M891 283l25 8-5 8-29-7Z" fill="url(#rhMesh)"/><ellipse cx="886" cy="280" rx="8" ry="3" fill="#bd8c4d"/>
 ${doorInterior('M418 174L467 140 531 142 634 202 649 288 439 291Z','mcf1')}
 </g><g id="doorArt"><path d="M424 167Q468 135 509 134Q562 136 631 191L655 286 444 298 402 234Z" fill="url(#rhPaint)" stroke="#253b48"/>
 <path d="M433 168Q471 142 509 142Q557 144 614 189L416 207Z" fill="url(#rhGlass)" stroke="#839da9"/><path d="M492 143L500 200M428 192L608 183" stroke="#243c4b" stroke-width="3"/>
 <path d="M416 220L638 207 650 249 445 285Z" fill="url(#rhShine)"/><path d="M447 282Q546 277 642 254" class="rh-highlight"/>
 <path d="M616 202l8-25 10 3-5 26Z" fill="url(#rhPaint)"/><path d="M612 168q17-8 36 3v11l-33-1Z" fill="url(#rhPaint)" stroke="#acc0c8"/>
 <path d="M433 222h24v5h-24Z" fill="#1a2d3b"/>
 </g></g>
 <g id="rearWingArt"><path d="M88 207Q196 184 272 187L267 193 89 215Z" fill="url(#rhPaint)" stroke="#91a9b6"/></g>
 <g id="frontFlapArt"><path d="M806 312L923 308 926 315 807 319Z" fill="url(#rhCarbon)" stroke="#5d7e90"/></g>
 <g id="quadExhaustArt"><ellipse class="outlet" cx="93" cy="278" rx="5" ry="7" fill="#101a22" stroke="#b9c4bd" stroke-width="2"/><ellipse class="outlet" cx="103" cy="281" rx="5" ry="7" fill="#101a22" stroke="#b9c4bd" stroke-width="2"/></g>
 ${roadWheel(248,67,'mcf1')}${roadWheel(737,63,'mcf1')}${t(454,309,'McLaren F1',8,'#bed0d6','font-style="italic"')}
 </svg>`;
}
