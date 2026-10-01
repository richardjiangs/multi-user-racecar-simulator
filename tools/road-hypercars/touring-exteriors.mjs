import {path as p,text as t,bolt} from './materials.mjs';
import {setup,finishBody,lamp} from './exteriors.mjs';
const seam=d=>p(d,'none','class="rh-seam"');
const shine=d=>p(d,'none','class="rh-highlight"');
const carbon=d=>p(d,'url(#rhCarbon)','stroke="#52636d"');
const exhaust=(x,y,n=2)=>`<g id="quadExhaustArt">${Array.from({length:n},(_,i)=>`<ellipse class="outlet" cx="${x+i*10}" cy="${y}" rx="7" ry="4" fill="#07151e" stroke="#a9b7b9" stroke-width="2"/>`).join('')}</g>`;
function rim(x,r,kind){
 let spokes='';const count={wire:40,pagani:10,zr1:10,f40:5,magnesium:5,speedtail:10}[kind];
 if(kind==='wire')spokes=Array.from({length:count},(_,i)=>{const a=i*Math.PI*2/count;return p(`M${Math.cos(a)*11} ${Math.sin(a)*11}L${Math.cos(a+.32)*r*.81} ${Math.sin(a+.32)*r*.81}M${Math.cos(a)*11} ${Math.sin(a)*11}L${Math.cos(a-.32)*r*.81} ${Math.sin(a-.32)*r*.81}`,'none','stroke="#c5d2d3" stroke-width=".75"');}).join('');
 else if(kind==='magnesium')spokes=`<circle r="${r*.79}" fill="#32312a" stroke="#766d53" stroke-width="2"/>`+Array.from({length:5},(_,i)=>`<ellipse cy="${-r*.46}" rx="${r*.19}" ry="${r*.29}" fill="#07131b" stroke="#766b50" transform="rotate(${i*72})"/>`).join('');
 else spokes=Array.from({length:count},(_,i)=>p(kind==='f40'?`M-7-10L-8-${r*.75} 8-${r*.75} 8-9 5 10H-5Z`:`M-4-10L-11-${r*.74} -5-${r*.8} 2-20 7-${r*.8} 12-${r*.76} 6-7Z`,kind==='f40'?'#b7c4c4':'#4f6774',`stroke="#b7c9cc" stroke-width=".8" transform="rotate(${i*360/count})"`)).join('');
 return `<g transform="translate(${x} ${330-r})"><circle r="${r}" fill="#060c12" stroke="#415360" stroke-width="2"/><circle r="${r*.9}" fill="#0d1a23" stroke="#6a7e88"/><circle r="${r*.68}" fill="#7e8989"/>${Array.from({length:22},(_,i)=>`<circle cx="${Math.cos(i*Math.PI/11)*r*.56}" cy="${Math.sin(i*Math.PI/11)*r*.56}" r="1.1" fill="#344b57"/>`).join('')}<path d="M${r*.43}-${r*.42}h11v${r*.77}h-11Z" fill="${kind==='zr1'?'#c7a836':kind==='pagani'?'#b19556':'#494f48'}"/><g class="wSpin"><circle r="${r*.82}" fill="none" stroke="#c5d1cf" stroke-width="2"/>${spokes}<circle r="12" fill="#17303f" stroke="#c5d0cd" stroke-width="2"/><circle r="5" fill="${kind==='f40'?'#d5bd37':'#889e9e'}"/>${kind==='wire'?p('M-14-3L-3-6 11-17 16-12 6 2-1 17-8 15-5 2Z','#b7c7c9','stroke="#e0e5da"'):''}<path d="M-2 ${-r+2}h4v4h-4Z" fill="#b2bda8"/></g></g>`;
}
function interior(aperture,kind){
 const trim={mclaren:'#bab5a0',pagani:'#314c66',zr1:'#6b6b59',gto:'#426280',f40:'#ad3434',p917:'#a82236'}[kind];
 return `<defs><clipPath id="tcDoorClip"><path d="${aperture}"/></clipPath></defs><g clip-path="url(#tcDoorClip)"><path d="${aperture}" fill="#06111a"/>${p('M422 182L457 173 478 192 469 242 486 267 554 272 546 296 458 285 432 260Z',trim,'stroke="#8c9c9e" stroke-width="1.2"')}${p('M440 188L455 251 482 277M463 185L453 252 474 277','none','stroke="#0c151b" stroke-width="6"')}${kind==='mclaren'?p('M387 216Q409 197 426 217L428 276 459 290 451 312 391 292Z','#969d92'):''}${p('M541 202L633 193 649 210 585 226 554 216Z',kind==='gto'||kind==='p917'?'#6d7e82':'url(#rhCarbon)','stroke="#728b95"')}${p('M568 211l-10 20','none','stroke="#9baeb7" stroke-width="4"')}<ellipse cx="556" cy="226" rx="8" ry="20" transform="rotate(22 556 226)" fill="none" stroke="${kind==='gto'?'#b9884c':'#8498a4'}" stroke-width="3"/>${p('M604 242l10 2-7 24-10-2Zm-19 5 7 1-5 21-7-1Z','#a1b2b8')}${p('M410 301L651 291 663 310 423 319Z',kind==='gto'||kind==='p917'?'url(#rhMetal)':'url(#rhCarbon)','stroke="#879ca3"')}${kind==='p917'?p('M412 284L642 311M410 307L599 242','none','stroke="#a3b6b7" stroke-width="3"'):''}</g>`;
}
const door=(d,glass,extra='')=>`<g id="doorArt">${p(d,'url(#rhPaint)','stroke="#102530" stroke-width="1.3"')}${p(glass,'url(#rhGlass)','stroke="#96b0ba" stroke-width="1.3"')}${extra}</g>`;

export function drawTouringSpeedtail(){const body='M59 216Q159 197 277 184L388 162Q451 104 509 102H554Q603 109 675 168Q783 165 855 204L935 243 946 276 908 305H810A66 105 0 0 0 678 305H363A70 106 0 0 0 223 305L86 290 56 267Z',ap='M434 153Q486 119 548 120L581 137 656 180 652 298H436Z';
 return setup('McLaren Speedtail',body,['#c2d5d5','#91acb2','#3d626f','#153440'])+`
 ${p('M62 221Q221 190 388 171L460 140 435 210 81 255Z','url(#rhShine)')}${carbon('M65 267Q341 293 681 289L911 283 910 309H76Z')}
 ${p('M332 183L431 150 463 126 421 211 343 216Z','url(#rhGlass)','stroke="#7c99a6"')}${p('M629 146L688 181 756 184 714 212 673 202Z','url(#rhGlass)','stroke="#93aeb6"')}
 ${seam('M92 230Q241 203 375 185M100 255Q316 244 430 221M360 184L385 223')}${shine('M76 223Q230 191 374 177M823 209L917 250')}
 ${p('M71 234l116-18 12 12-126 21Z','#173744','stroke="#88a6b1"')}${p('M74 240l99-16','none','stroke="#d14136" stroke-width="3"')}
 ${lamp('M865 219Q894 225 928 246L909 248 854 226Z')}${seam('M842 228Q857 263 915 266')}${p('M875 271l62-9 1 14-61 7Z','url(#rhMesh)')}
 ${p('M233 188Q264 176 294 184','none','stroke="#c5d5d0" stroke-width="1.2"')}
 ${finishBody}${interior(ap,'mclaren')}${door(ap,'M443 155Q486 124 547 126L628 174 441 202Z',`${seam('M441 204L637 185M446 279Q553 253 648 228')}${shine('M455 152Q498 128 542 132')}${p('M449 216l19-3v5l-19 4Z','#536f7a')}`)}
 <g id="rearWingArt">${p('M62 212L193 197 191 204 63 222Z','url(#rhPaint)','stroke="#adc5c7"')}${p('M64 219l122-15','none','stroke="#243e4a"')}</g><g id="frontFlapArt">${carbon('M871 300L945 283 947 292 887 312Z')}</g>
 ${p('M645 188l21-12 13 4-1 8-29 7Z','url(#rhCarbon)','stroke="#8ca6ae"')}${exhaust(71,269)}
 ${rim(293,65,'speedtail')}${rim(744,63,'speedtail')}
 <g class="tc-fixed-aero-cover" transform="translate(744 267)"><circle r="47" fill="url(#rhCarbon)" stroke="#8ca0a9"/><circle r="10" fill="#304c5a" stroke="#b7c5c8"/><path d="M-38-20Q-12-45 24-31" fill="none" stroke="#849ca3"/><path d="M-3-43v10" stroke="#a0b4b5" stroke-width="2"/></g></svg>`;
}

export function drawTouringPagani(){const body='M71 220L91 200Q193 184 271 185L376 166Q450 110 489 109H540Q606 108 693 178Q762 175 817 195L886 228 929 267 916 300 826 308A71 113 0 0 0 684 308H312A74 111 0 0 0 164 308L78 288Z',ap='M459 131Q506 113 550 127L672 184 671 294 461 289Z';
 return setup('Pagani Huayra BC coupé',body,['#d7d8d0','#a3aeaf','#536c74','#1d3643'],'rotate(52deg) translate(-5px,-42px)')+`
 ${p('M76 224Q326 187 450 170L713 187 903 246 888 264Q506 210 75 249Z','url(#rhShine)')}${carbon('M84 255Q448 265 680 248L903 270 920 300 313 313 153 299 79 286Z')}
 ${p('M322 190L382 169 445 131 427 195Z','url(#rhCarbon)','stroke="#718d97"')}${p('M651 152L701 181 670 197Z','url(#rhGlass)','stroke="#bacad0"')}
 ${p('M378 206L443 193 446 230 370 243Q356 227 378 206Z','url(#rhMesh)','stroke="#8fa8b1" stroke-width="2"')}${shine('M385 211L438 199')}
 ${p('M833 213Q859 215 884 237L860 241 827 223Z','#101f28','stroke="#c2d1d3"')}${[0,1,2].map(i=>`<ellipse class="rhLamp" cx="${839+i*13}" cy="${221+i*5}" rx="7" ry="5" fill="#d0e5ec" stroke="#637d8b"/>`).join('')}
 ${[105,121,136].map((x,i)=>`<circle cx="${x}" cy="${226-i*2}" r="6.5" fill="#a82031" stroke="#e7908a"/><circle cx="${x}" cy="${226-i*2}" r="2.3" fill="#f27570"/>`).join('')}
 ${carbon('M878 257L926 266 930 278 877 268Z')}${carbon('M887 275L923 280 919 287 880 282Z')}${seam('M324 252L450 240M171 192L313 186M791 213Q791 238 814 247')}
 ${finishBody}${interior(ap,'pagani')}${door(ap,'M472 138Q510 124 545 133L651 185 471 196Z',`${seam('M477 201L653 196M468 264Q555 248 666 261')}${shine('M485 134Q510 126 544 135')}${p('M485 214h22v5h-22Z','url(#rhMetal)')}${[[469,147],[466,202],[465,248],[466,281],[657,204],[659,248],[662,286]].map(([x,y])=>bolt(x,y,2)).join('')}`)}
 <g id="rearWingArt" style="transform:none">${carbon('M116 194L132 145H141L133 190ZM244 185L257 142H265L256 184Z')}${carbon('M88 144L283 140 292 151 88 157Z')}${shine('M93 146L280 142')}</g>
 <g id="frontFlapArt">${carbon('M826 302L935 292 942 305 828 316Z')}</g>${carbon('M318 305L674 304 681 315 314 317Z')}
 ${p('M652 184q14-20 28-18l17 6-5 7-24 1-8 11Z','url(#rhPaint)','stroke="#b5c9ce"')}${exhaust(79,254)}
 ${rim(238,69,'pagani')}${rim(755,65,'pagani')}${t(338,266,'Huayra BC',10,'#a5bdc4','font-family="Georgia,serif" font-style="italic"')}</svg>`;
}

export function drawTouringZr1(){const body='M77 188L285 169 390 165Q467 126 521 120H574L611 139 704 195Q783 186 837 215L925 253 932 281 890 304H832A70 109 0 0 0 692 304H338A73 112 0 0 0 192 304L96 284 76 251Z',ap='M443 158L517 128 567 132 656 185 649 297 440 289Z';
 return setup('2025 Chevrolet Corvette ZR1',body,['#f3da66','#d0ad2e','#99761d','#3f3c24'],'rotate(22deg) translate(-10px,-13px)')+`
 ${p('M81 199L380 177 466 146 522 129 433 201 129 228Z','url(#rhShine)')}${carbon('M78 260L184 274 338 296H682L914 284 924 303H349L160 305 83 279Z')}
 ${p('M337 170L417 146 479 131 426 192 377 205Z','url(#rhGlass)','stroke="#83a0ac"')}${p('M590 145L696 199 666 207Z','url(#rhGlass)','stroke="#b2c4c8"')}
 ${p('M363 201L453 190 442 280 348 294 385 260Z','url(#rhMesh)','stroke="#516b78"')}${carbon('M349 193L468 183 434 220 385 232Z')}${shine('M358 195L458 187')}
 ${p('M819 219L892 241 916 256 885 251 811 225Z','#0c1c25','stroke="#a2bac3"')}${lamp('M819 221L889 244 908 252 885 246Z')}
 ${carbon('M807 264L917 261 925 278 853 286Z')}${p('M101 207l75-5 17 17-23 7-70-2Z','#822330','stroke="#d37c76"')}${p('M103 211l65-4 14 11-77 0','none','stroke="#e9615c" stroke-width="3"')}
 ${seam('M791 218L802 241 868 256M129 236L316 225M796 287L854 292')}${carbon('M866 279L925 278 921 283 865 286Z')}
 ${finishBody}${interior(ap,'zr1')}${door(ap,'M453 164L520 137 565 141 635 184 452 199Z',`${seam('M450 201L640 191M449 280L630 260')}${shine('M468 162L521 141 560 145')}${p('M450 205h17v5h-17Z','#14303e')}${t(534,270,'ZR1',9,'#33444b','font-style="italic"')}`)}
 <g id="rearWingArt" style="transform:none">${carbon('M115 179L127 136H137L129 179ZM251 171L264 132H274L265 170Z')}${carbon('M92 137L290 128 297 139 94 149Z')}${p('M95 138L288 131','none','stroke="#d6b23c" stroke-width="2"')}</g>
 <g id="frontFlapArt">${carbon('M822 306L936 291 940 304 824 317Z')}</g>${p('M629 189l30-13 27 6-4 9-47 5Z','url(#rhCarbon)','stroke="#9cb3bb"')}${exhaust(81,271)}${rim(265,67,'zr1')}${rim(762,64,'zr1')}</svg>`;
}

export function drawTouringGto(){const body='M79 202Q156 190 265 186L374 178Q436 122 492 117H531Q601 119 650 169L681 188Q785 178 858 205Q904 217 925 243L924 276Q913 298 885 304H804A73 114 0 0 0 658 304H332A73 113 0 0 0 186 304L101 281 80 257Z',ap='M408 175Q448 133 495 129H532L614 170 623 288H409Z';
 return setup('Ferrari 250 GTO',body,['#f1674e','#c62e2f','#851c29','#341b24'],'rotate(25deg) translate(-12px,-12px)')+`
 ${p('M83 207Q360 171 671 191Q827 176 916 244L902 259Q707 196 320 213L86 234Z','url(#rhShine)')}${seam('M641 180Q720 185 833 206M342 218L366 184M100 264Q351 298 661 284M810 282L902 284')}
 ${p('M342 181L385 157 448 132 405 180Z','url(#rhGlass)','stroke="#b3c6c9" stroke-width="2"')}
 ${[0,1,2].map(i=>p(`M${647+i*14} ${213-i*2}l-5 36 8-1 5-36Z`,'#0a1820','stroke="#be8172"')).join('')}
 ${p('M744 188Q772 178 808 195L803 205 744 199Z','#892630','stroke="#d5816c"')}${p('M753 189l40 4-1 5-38-4Z','#13252f')}
 <ellipse cx="888" cy="254" rx="29" ry="21" fill="url(#rhMesh)" stroke="#b2c2c7" stroke-width="2"/>
 ${p('M854 207Q884 209 897 231L864 239Q843 228 854 207Z','url(#rhGlass)','stroke="#bcccd0" stroke-width="1.6"')}${lamp('M859 218Q873 209 883 224L881 234 863 233Z')}
 ${[101,127].map(x=>`<circle cx="${x}" cy="234" r="8" fill="#a1242a" stroke="#becec9" stroke-width="2"/>`).join('')}
 ${p('M876 282Q899 285 920 273','none','stroke="#bac9c9" stroke-width="4"')}${p('M78 201Q114 185 160 185L155 193 79 212Z','url(#rhPaint)','stroke="#e4a492"')}
 ${finishBody}${interior(ap,'gto')}${door(ap,'M420 176Q452 139 496 136H529L596 172 612 189 420 189Z',`${p('M586 169L582 189','none','stroke="#c7d1cb" stroke-width="2"')}${p('M430 212h23v4h-23Z','url(#rhMetal)')}<circle cx="513" cy="243" r="34" fill="#e6e7db" stroke="#8b9898"/>${t(512,257,'24',37,'#132731','text-anchor="middle" font-family="Georgia,serif"')}${shine('M428 200H612')}`)}
 <g id="rearWingArt"></g><g id="frontFlapArt"></g>${exhaust(82,287)}${rim(259,65,'wire')}${rim(731,64,'wire')}<circle cx="367" cy="209" r="8" fill="url(#rhMetal)" stroke="#546d77"/>${p('M624 189l10-15 13-1 1 11-19 9Z','url(#rhMetal)')}</svg>`;
}

export function drawTouringF40(){const body='M77 189L350 180 414 169 470 126H555L604 151 674 195 741 195 837 224 925 254 927 281 889 306H799A71 112 0 0 0 657 306H330A74 114 0 0 0 182 306L99 284 77 257Z',ap='M445 162L477 137H552L633 184 640 290H439Z';
 return setup('Ferrari F40',body,['#f36951','#c32d31','#861b28','#351d29'],'rotate(24deg) translate(-12px,-11px)')+`
 ${p('M77 197L341 186 451 166 643 189 920 256 914 268 630 207 354 207 77 220Z','url(#rhShine)')}${p('M77 247L655 245 919 270','none','stroke="#13242e" stroke-width="3"')}
 ${p('M336 184L412 170 457 139 434 192Z','url(#rhGlass)','stroke="#7394a2"')}${Array.from({length:8},(_,i)=>p(`M${333+i*12} ${186-i*4.5}l41-3`,'none','stroke="#0a1a25" stroke-width="3"')).join('')}
 ${p('M342 217L421 194 417 230 356 241Z','url(#rhMesh)','stroke="#b77370"')}${p('M354 274L412 255 411 279 365 291Z','#091a23','stroke="#a37d78"')}
 ${seam('M691 205L752 217 810 239 764 239 691 217ZM842 236L868 241 889 253 852 248Z')}
 ${lamp('M863 263L922 269 920 283 861 274Z')}${p('M82 220h75v20H82Z','#9e3032','stroke="#5a2c36"')}${[99,131].map(x=>`<circle cx="${x}" cy="230" r="7" fill="#ca443f" stroke="#d8816d"/>`).join('')}
 ${p('M851 282l71 4-7 13-69-9Z','url(#rhMesh)')}${carbon('M79 270L173 289 330 296H654L897 293 920 305H334L97 289Z')}
 ${finishBody}${interior(ap,'f40')}${door(ap,'M450 164L482 145H548L614 182 450 197Z',`${p('M548 149L555 188','none','stroke="#597a8b" stroke-width="2"')}${p('M465 157h50v29h-50Z','none','stroke="#9eb1b7" stroke-width="1"')}${p('M461 217h14v5h-14Z','#102936')}${seam('M445 245H634')}${p('M458 278l44-11-33-6Z','url(#rhMesh)')}`)}
 <g id="rearWingArt" style="transform:none">${p('M89 189L99 127H114L120 184ZM283 182L282 128H295L305 180Z','url(#rhPaint)','stroke="#e89e8a"')}${p('M92 126H299V142H95Z','url(#rhPaint)','stroke="#e39783"')}${t(104,170,'F40',15,'#7e2430','font-style="italic"')}</g>
 <g id="frontFlapArt">${carbon('M809 309L926 298 932 309 808 318Z')}</g>${p('M613 189l17-12 26 5v11l-32 1Z','url(#rhPaint)','stroke="#bf9290"')}${exhaust(80,273,3)}${rim(256,66,'f40')}${rim(730,64,'f40')}</svg>`;
}

export function drawTouringP917(){const body='M76 188Q170 164 270 185L378 197 445 159Q472 128 520 129H549Q603 132 635 171L670 207Q708 190 747 207L828 236 923 270 923 291 875 307H788A68 110 0 0 0 652 307H337A74 119 0 0 0 189 307L102 287 76 253Z',ap='M447 174Q478 139 523 139H545Q598 142 627 179L645 216 638 293 449 290Z';
 return setup('Porsche 917K',body,['#aad4dc','#69aac3','#357494','#163b54'],'rotate(57deg) translate(-18px,-24px)')+`
 ${p('M78 210Q295 199 450 210L655 220 922 284 918 304 635 245 450 233 77 233Z','#dd7534','stroke="#efb16d"')}${p('M77 196Q230 175 375 207L424 196 402 221Q247 195 78 222Z','url(#rhShine)')}
 ${p('M372 198L423 175 462 151 440 219Z','url(#rhGlass)','stroke="#91aeba"')}${p('M603 155Q638 172 667 211L645 217Z','url(#rhGlass)','stroke="#c1d2d2"')}
 ${p('M457 146Q502 119 551 133L575 141 550 145 472 157Z','#e8883c')}
 ${Array.from({length:7},(_,i)=>p(`M${131+i*18} ${185+i%2*2}l7 21`,'none','stroke="#2b586f" stroke-width="3"')).join('')}
 ${p('M813 235Q838 237 896 267L857 276 802 249Z','url(#rhGlass)','stroke="#c0d6d7"')}${[0,1].map(i=>`<ellipse class="rhLamp" cx="${825+i*31}" cy="${248+i*11}" rx="12" ry="8" fill="#d9e6e2" stroke="#89aab9" stroke-width="2"/>`).join('')}
 ${p('M857 291L920 282 918 296 861 303Z','url(#rhMesh)')}${p('M85 235h29v16H85Z','#a02e2b','stroke="#c58b74"')}${seam('M358 236L420 242M801 271L838 282')}
 ${finishBody}${interior(ap,'p917')}${door(ap,'M457 177Q484 149 524 149H545Q586 151 612 180L628 210 456 218Z',`${p('M477 171h66v32h-66Z','none','stroke="#b2c7c8" stroke-width="1"')}${p('M540 168v36','none','stroke="#b2c7c8"')}${p('M453 236L639 243 638 259 451 251Z','#e9833c')}<circle cx="542" cy="257" r="34" fill="#e6e8df" stroke="#bcc9c9"/>${t(542,272,'20',40,'#172c3b','text-anchor="middle" font-weight="bold"')}${bolt(455,224,2)}${bolt(632,224,2)}${p('M607 223h16v5h-16Z','#223f50')}`)}
 <g id="rearWingArt" style="transform:none">${p('M80 190L90 153 161 181 151 193Z','url(#rhPaint)','stroke="#a4cdd6"')}${p('M82 190L261 184 259 192 81 198Z','url(#rhPaint)','stroke="#aad4db"')}</g><g id="frontFlapArt"></g>${exhaust(79,280)}
 <circle cx="350" cy="246" r="20" fill="#edeee3" stroke="#d67637" stroke-width="2"/><path d="M331 242h38v8h-38Z" fill="#e77d39"/>${t(350,251,'Gulf',13,'#28526b','text-anchor="middle" font-weight="bold"')}
 ${rim(265,68,'magnesium')}${rim(720,63,'magnesium')}${t(355,280,'PORSCHE',9,'#203f56','letter-spacing="1"')}</svg>`;
}
export const TOURING_EXTERIORS={mclaren:drawTouringSpeedtail,pagani:drawTouringPagani,zr1:drawTouringZr1,gto:drawTouringGto,f40:drawTouringF40,p917:drawTouringP917};
