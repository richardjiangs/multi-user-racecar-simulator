/* Authored launch-car side elevations. Geometry is illustrative, not factory CAD. */
(function(){
 const a=window.__Track2App,p=a.f1ArtProfile,b=F1_BODIES[TRACK2_CONFIG.key],T=a.f1ArtText,B=a.f1ArtBolt,D=a.f1ArtDefs;
 if(!p||!b)return;
 function tyre(x,y,r,far=false){return `<g transform="translate(${x} ${y})" opacity="${far?.5:1}"><circle r="${r}" fill="url(#ferubber)" stroke="#060b10" stroke-width="3"/><circle r="${r-7}" fill="none" stroke="#697078" stroke-opacity=".4"/><circle r="${r-15}" fill="none" stroke="#cdb655" stroke-width="1.1"/>
 <circle r="${r*.6}" fill="#0d161e" stroke="#65717c" stroke-width="2"/>
 <g class="f1WheelSpin">${Array.from({length:9},(_,i)=>`<path d="M-3 -6L-5 -${r*.55}L1 -${r*.57}L7 -8Z" fill="#465461" stroke="#6e7983" stroke-width=".5" transform="rotate(${i*40})"/>`).join('')}<path d="M0 -${r-5}v4" stroke="#eee9d0" stroke-width="2"/></g>
 <circle r="10" fill="url(#femetal)" stroke="#6a7981"/><circle r="5" fill="#252d37"/>${B(0,0,2)}
 ${T(-29,-r+13,'PIRELLI',8,'#d9c067','font-weight="bold" letter-spacing="1"')}${T(-21,r-11,'P ZERO',6.5,'#d9c067','letter-spacing="1"')}</g>`;}
 function exteriorSvg(){const[vx,vy,vn,vl,vs]=b.vents;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 440" role="img" aria-label="${p.model}: individually drawn nose, sidepods, air intake, engine cover, suspension, active wings and rotating slick wheels">${D('fe')}
 <defs><linearGradient id="fepaint" x2=".1" y2="1"><stop stop-color="${p.paint}"/><stop offset=".56" stop-color="${p.paint}"/><stop offset="1" stop-color="#18222b"/></linearGradient><linearGradient id="fefloor" x2="0" y2="1"><stop stop-color="#56636e"/><stop offset=".23" stop-color="#111d27"/><stop offset="1" stop-color="#070d15"/></linearGradient></defs>
 <rect width="1100" height="440" fill="#09151e"/><ellipse cx="554" cy="380" rx="490" ry="15" fill="#000" opacity=".44"/>
 <g id="bcBody">${tyre(298,290,64,true)}${tyre(859,284,68,true)}
 <path d="M307 319L425 335H844L929 320L988 338L967 353L850 367L353 364L258 348Z" fill="url(#fefloor)" stroke="#61717c"/>
 <path d="M343 350L505 355L806 351L914 333M358 357L801 358L925 342" fill="none" stroke="#a0aeb4" stroke-opacity=".6"/>
 ${[0,1,2,3].map(i=>`<path d="M${882+i*19} 350l27 -13l-5 19l-27 8Z" fill="#0c1720" stroke="#465d67"/>`).join('')}
 <!-- Rear wing endplates, exposed actuators and main plane. -->
 <path d="M940 227L953 311L967 307L960 220Z M1022 211L1033 296L1048 295L1044 196Z" fill="url(#feweave)" stroke="#77858d"/>
 <path d="M913 214Q973 224 1038 212L1045 223Q985 236 917 226Z" fill="url(#feweave)" stroke="#84939b"/>
 <g id="rearWingArt"><path d="M910 198Q975 208 1040 198L1041 210Q974 221 912 210Z" fill="${b.secondary}" stroke="#7a8993"/>${T(948,209,b.sponsor,8,b.ink,'letter-spacing=".7"')}</g>
 <path d="M955 222L955 259L979 273" fill="none" stroke="#7d8d94" stroke-width="3"/>
 <!-- Independent launch-car body surfaces, seam and cooling louvres. -->
 <path d="${b.cover}" fill="url(#fepaint)" stroke="#81939f" stroke-width=".8"/>
 <path d="${b.pod}" fill="url(#fepaint)" stroke="#8d9aa4" stroke-width="1"/>
 <path d="${b.nose}" fill="url(#fepaint)" stroke="#8599a6" stroke-width="1"/>
 <path d="${b.stripe}" fill="${b.secondary}"/>
 <path d="${b.inlet}" fill="#03090e" stroke="#65818e" stroke-width="2"/>
 <path d="${b.airbox}" fill="#040a11" stroke="${p.paint}" stroke-width="6"/>
 ${Array.from({length:vn},(_,i)=>`<path d="M${vx+i*8} ${vy+i*vs}l${vl} 5l-1 4l-${vl} -5Z" fill="#111820" stroke="#768690" stroke-width=".5"/>`).join('')}
 <path d="M563 249Q582 265 593 282M717 292L846 278" stroke="#bac4c9" stroke-opacity=".3" fill="none"/>
 <path d="M491 244Q521 233 558 245L576 263L538 274L482 267Z" fill="#040b13"/>
 <path id="exHeadrest" d="M542 250Q562 242 571 258L555 265L540 262Z" fill="#25333d" stroke="#697e8a"/>
 <path id="exSteeringWheel" d="M490 250L503 247L506 263L491 264Z" fill="#283c4d" stroke="#9cadb2"/>
 <!-- Halo leg, side hoop, stalk mirrors and camera pod. -->
 <path d="M446 250L450 220Q497 204 552 222L566 246" stroke="#050c15" stroke-width="10" fill="none"/><path d="M450 218Q497 207 552 222" stroke="${p.paint}" stroke-width="5" fill="none"/>
 <path d="M472 257L462 234" stroke="#617381" stroke-width="4"/>
 <path d="M470 240L450 231L424 236" fill="none" stroke="#22394b" stroke-width="3"/><path d="M406 232L437 226L441 237L409 240Z" fill="${p.paint}" stroke="#a9b1b3"/>
 <path d="M585 185V161H623V168H592" fill="#263949" stroke="#9cabb3"/>
 <path d="M594 171v-8M616 173v-8" stroke="#c5c7bd"/>
 ${T(586,297,b.sponsor,25,b.ink,'font-weight="bold" font-style="italic" letter-spacing=".5"')}
 ${T(358,272,b.number,22,b.ink,'font-weight="bold" transform="rotate(-11 358 272)"')}
 ${T(715,269,p.pu,7,b.ink,'letter-spacing=".6"')}
 ${[[442,267],[457,277],[599,212],[623,209],[855,296],[901,290]].map(([x,y])=>B(x,y,1.5)).join('')}
 <!-- Suspension members are attached to uprights; brake ducts remain stationary. -->
 <g fill="none" stroke="#111d28" stroke-linecap="round" stroke-width="7"><path d="M259 311L360 284M259 332L415 305M902 301L786 267M902 327L776 309"/><path d="${b.rod==='pull'?'M270 282L380 322':'M269 333L379 258'}"/></g>
 <g fill="none" stroke="#86949c" stroke-width="1"><path d="M259 309L360 282M259 330L415 303M902 299L786 265M902 325L776 307"/></g>
 <path d="M913 283L892 284L876 310L892 319Z M261 290L276 296L278 326L264 329Z" fill="#111e27" stroke="#5e7280"/>
 <g id="quadExhaustArt"><path d="M863 270L936 261L942 270L871 281Z" fill="url(#femetal)" stroke="#8d897f"/><ellipse cx="939" cy="266" rx="4" ry="6" fill="#030911"/></g>
 <g id="f1RainLight"><path d="M970 316h14v22h-14Z" fill="#16202a" stroke="#76808a"/>${Array.from({length:12},(_,i)=>`<circle cx="${973+i%3*4}" cy="${320+Math.floor(i/3)*4}" r="1.2" fill="#ff554b"/>`).join('')}</g>
 ${tyre(257,307,72)}${tyre(910,304,76)}
 <!-- Three front elements and thin endplate, with a live moveable flap. -->
 <path d="M58 340Q163 329 295 342L305 355Q169 367 59 354Z" fill="url(#feweave)" stroke="#8c9ba3"/>
 <g id="frontFlapArt"><path d="M66 327Q140 322 225 331L240 337L69 337Z" fill="${b.secondary}" stroke="#82929d"/><path d="M72 318L196 322L216 329L73 327Z" fill="url(#feweave)" stroke="#647e8d"/></g>
 <path d="M58 318L73 322L84 355L58 355Z" fill="${p.paint}" stroke="#7e959f"/>
 <path d="M91 347L287 350" stroke="#8a989e" stroke-width=".8"/></g>
 ${T(30,36,p.mark,19,'#dbe3e5','letter-spacing="2"')}${T(30,55,p.model+' / 2026',9,'#8aa4b3','letter-spacing="1.2"')}
 </svg>`;}
 a.f1ExteriorSvg=exteriorSvg;
})();
