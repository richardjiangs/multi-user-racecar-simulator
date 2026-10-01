import {path as p,text as t,bolt,control as c,button as b,dial,vent,ticks,needle,revSegments,paddles,startCabin,endCabin} from './materials.mjs';
import {camera} from './next-cabins.mjs';
// The older cabins have painted/alloy screen surrounds, not modern carbon pillars.
function classicCabin(label,kind){
 let s=startCabin(label);
 const surround={gto:'#8d9595',f40:'#292d2c',p917:'#8e9691'}[kind];
 s=s.replace('<path d="M0 0H65L130 156 49 242 0 221ZM935 0H1000V226L953 230 873 156Z" fill="url(#rhCarbon)"/>',
  `<path d="M0 0H38L93 167 37 227 0 213ZM962 0H1000V213L963 227 907 167Z" fill="${surround}" stroke="#343d3d" stroke-width="2"/>
   <path d="M34 0L86 165M966 0L914 165" stroke="${kind==='f40'?'#606361':'#d4d8d1'}" stroke-width="3"/>`);
 if(kind==='p917')s=s.replace(/<rect x="424"[\s\S]*$/,'<path d="M54 152Q487 96 945 152" fill="none" stroke="#89988f" stroke-width="3"/>');
 if(kind==='gto')s=s.replace(/<rect x="424"[\s\S]*$/,'<path d="M498 12v25" stroke="#a6b3b1" stroke-width="5"/><rect x="440" y="32" width="116" height="32" rx="8" fill="url(#rhGlass)" stroke="url(#rhMetal)" stroke-width="4"/>');
 return s;
}
const stitch=d=>p(d,'none','class="stitch"');
const ring=(x,y,r,fill='#0b1012')=>`<circle cx="${x}" cy="${y}" r="${r+3}" fill="url(#rhMetal)" stroke="#050809" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#62696c"/>`;
const gauge=(x,y,r,label,max,id)=>ring(x,y,r)+ticks(x,y,r-5,max,40)+t(x,y+r*.45,label,r*.14,'#dfddd0','text-anchor="middle"')+(id?needle(id,x,y,r-12,max):'');
const smallGauge=(x,y,r,label,field,max=150)=>gauge(x,y,r,label,max)+`<g data-live-needle="${field}" data-max="${max}" data-cx="${x}" data-cy="${y}"><path d="M${x} ${y+5}V${y-r+7}" stroke="#ded9bb" stroke-width="1.4"/><circle cx="${x}" cy="${y}" r="2" fill="#a6aaa0"/></g>`;
const hiddenReadouts='<g display="none"><text id="cabSpeedArt">0</text><text id="cabRpmArt">0</text><text id="cabGearArt">N</text></g>';
const toggle=(x,y,label,id,color='#b4bec4')=>c(id,label,ring(x,y,6)+p(`M${x} ${y+2}l2-10`,'none',`stroke="${color}" stroke-width="4" stroke-linecap="round"`)+t(x,y+18,label,6,'#cad2d2','text-anchor="middle"'));
const holes=(angles,r=67)=>angles.map(a=>`<circle cx="${Math.cos(a)*r}" cy="${Math.sin(a)*r}" r="6" fill="#080e12"/>`).join('');
const harness=(x,y,color='#202429')=>p(`M${x} ${y}l15 144M${x+98} ${y}l-15 144`,'none',`stroke="${color}" stroke-width="15"`)+p(`M${x+37} ${y+115}h24v24h-24Z`,'url(#rhMetal)');
function manual(x,y,wood=false){return `<g id="leverArt">${p(`M${x-33} ${y+69}h66l13 29h-91Z`,'url(#rhMetal)','stroke="#54646a"')}${[-21,0,21].map(dx=>p(`M${x+dx} ${y+75}v15`,'none','stroke="#141e24" stroke-width="4"')).join('')}${p(`M${x-22} ${y+82}h44M${x} ${y+81}v-76`,'none','stroke="#acb8be" stroke-width="7"')}<circle cx="${x}" cy="${y}" r="15" fill="${wood?'#bc9056':'#0c1115'}" stroke="#b5a37c"/>${wood?Array.from({length:5},(_,i)=>p(`M${x-12} ${y-9+i*4}q12 5 24 0`,'none','stroke="#634423"')).join(''):p(`M${x-8} ${y}h16M${x-6} ${y-6}v12M${x+6} ${y-6}v12`,'none','stroke="#e2e1d6"')}${c('upPaddle','Manual gear lever — shift up',`<rect x="${x-23}" y="${y-23}" width="46" height="55" fill="transparent"/>`)}</g>${b(x-35,y+106,22,19,'−','downPaddle')}${b(x-10,y+106,22,19,'N','__neutral')}${b(x+15,y+106,22,19,'R','__reverse')}`;}
const stripVent=(x,y,w)=>p(`M${x} ${y}h${w}v16h-${w}Z`,'#04090c','stroke="#596770"')+[0,1,2].map(i=>p(`M${x+3} ${y+4+i*4}h${w-6}`,'none','stroke="#35454e"')).join('');

export function speedtailCabin(){return startCabin('McLaren Speedtail • central seat, curved three-screen fascia, overhead controls and rear-camera monitors')+`
 <path d="M22 170Q259 99 500 150Q744 103 978 170L973 279Q733 245 642 312L616 520H384L358 312Q224 240 27 279Z" fill="#aaa99f" stroke="#dcddd1" stroke-width="2"/>
 <path d="M40 177Q274 122 403 154L400 246Q204 233 44 264ZM597 154Q740 122 960 177L956 264Q796 232 600 246Z" fill="url(#rhLeather)" stroke="#767d7b"/>
 ${stitch('M35 174Q264 112 397 156M603 156Q741 112 965 174M45 270Q218 242 354 318M646 318Q782 242 955 270')}
 <path d="M120 180Q289 147 407 155L409 230Q272 218 120 249Z" fill="url(#rhScreen)" stroke="#71868e" stroke-width="2"/>
 <path d="M421 156Q500 142 579 156V239H421Z" fill="url(#rhScreen)" stroke="#78929c" stroke-width="2"/>
 <path d="M593 155Q744 145 880 180V249Q747 218 591 230Z" fill="url(#rhScreen)" stroke="#71868e" stroke-width="2"/>
 ${revSegments(436,170,128,26,'#eee5cc')}${t(500,209,'0',29,'#e7eae5','id="cabSpeedArt" text-anchor="middle"')}${t(546,225,'N',13,'#e9cf88','id="cabGearArt"')}${t(437,225,'0',9,'#a8bdc8','id="cabRpmArt"')}
 ${t(244,176,'VEHICLE',9,'#c4d4d8','text-anchor="middle"')}${b(154,199,64,22,'DOORS','doorAllBtn','#bfcfd4',7)}${b(230,194,67,22,'LIFT','liftBtn','#bfcfd4',8)}${b(309,190,74,24,'DATA','dataBtn','#bfcfd4',8)}
 ${t(719,176,'COMFORT',9,'#c4d4d8','text-anchor="middle"')}${b(610,191,67,24,'A/C','coolBtn')}${b(687,196,67,23,'AUDIO','audioBtn','#dce6e9',8)}${b(766,201,69,23,'CABIN','ambientBtn','#dce6e9',8)}
 ${vent(93,218,17,26)}${vent(907,218,17,26)}${camera(29,103,116,60,'Left')}${camera(855,103,116,60,'Right')}
 <path d="M373 2H627L608 91H392Z" fill="url(#rhCarbon)" stroke="#b3b8b4" stroke-width="2"/>
 ${b(412,8,26,21,'D','upPaddle')}${b(444,8,26,21,'N','__neutral')}${b(476,8,26,21,'R','__reverse')}${dial(530,22,13,'START','startSwitchBtn')}${dial(574,26,16,'V','velocityBtn')}
 ${dial(432,61,17,'MODE','modeBtn')}${b(465,49,40,20,'LIGHT','lightsBtn','#b9c9d1',6)}${b(513,50,34,20,'ESC','escBtn','#b9c9d1',7)}${dial(573,64,13,'LIFT','liftBtn')}
 <path d="M98 330Q166 278 258 326L291 520H79ZM742 326Q834 278 902 330L921 520H709Z" fill="#99988e" stroke="#c3c4bb" stroke-width="3"/>
 ${stitch('M114 356Q174 321 242 350L265 501M758 350Q826 321 886 356L907 501')}${harness(127,344)}${harness(775,344)}
 ${paddles(500,352,122)}<g id="cabinWheelG" transform="translate(500 352)">
 <path d="M-75-93Q0-135 75-93C129-51 135 33 84 94H-84C-135 33-129-51-75-93Z" fill="none" stroke="#050a0e" stroke-width="30"/><path d="M-75-93Q0-135 75-93C129-51 135 33 84 94H-84C-135 33-129-51-75-93Z" fill="none" stroke="url(#rhCarbon)" stroke-width="23"/>
 <path d="M-106-30L-41-18H41L106-30 109 5 43 20 23 89H-23L-43 20-109 5Z" fill="url(#rhCarbon)" stroke="#71838b"/>
 <path d="M-39-31Q0-49 39-31L43 24Q0 55-43 24Z" fill="url(#rhLeather)" stroke="#7e8b90"/><path d="M-25 5Q9-17 29-7L18 4Q14-4-25 5Z" fill="url(#rhMetal)"/>
 ${c('hornBtn','Horn','<ellipse rx="36" ry="35" fill="transparent"/>')}${bolt(-77,-12)}${bolt(77,-12)}${bolt(0,70)}
 </g>`+endCabin;}

export function paganiCabin(){return startCabin('Pagani Huayra BC • machined chronograph instruments, turbine vents, carbon weave and exposed sequential selector')+`
 <path d="M19 171Q165 111 397 151Q618 111 978 184L975 294Q748 265 653 328L678 520H410L412 346 178 386 19 295Z" fill="url(#rhCarbon)" stroke="#748b91" stroke-width="2"/>
 <path d="M45 169Q206 125 400 165L397 204Q213 160 49 207ZM662 160Q817 140 955 184L948 225Q803 182 664 205Z" fill="#344353" stroke="#728087"/>
 ${stitch('M54 177Q212 137 390 174M674 171Q817 154 946 192')}
 <path d="M29 295L122 239 178 391 115 520H0ZM891 294L970 242 1000 297V520H926Z" fill="url(#rhCarbon)" stroke="#768b92"/>
 ${c('doorAllBtn','Gullwing door release',p('M72 288q18-17 33-1l-7 10-20 2Z','url(#rhMetal)'))}
 <path d="M695 358Q752 307 823 345L890 520H693Z" fill="#25364a" stroke="#526b81" stroke-width="4"/>${stitch('M712 373Q752 336 813 364L856 499')}${harness(712,364,'#0c1219')}
 <path d="M180 234Q156 151 216 131Q310 99 403 136Q452 147 427 242L390 265H220Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="5"/>
 <path d="M180 222Q167 152 224 140Q310 114 397 144Q436 155 420 225" fill="none" stroke="#a3aaa7" stroke-width="1.3"/>
 ${gauge(238,189,46,'RPM × 1000',8,'cabRevNeedle')}${gauge(375,189,46,'km/h',400,'cabSpeedNeedle')}
 <path d="M294 147Q308 143 322 147L329 237 289 237Z" fill="url(#rhMetal)"/><rect x="298" y="157" width="21" height="54" rx="3" fill="#10202b"/>
 ${t(309,182,'N',19,'#d9eff4','id="cabGearArt" text-anchor="middle"')}${t(309,200,'0',8,'#b9d0d5','id="cabSpeedArt" text-anchor="middle"')}${t(309,224,'0',7,'#263d4b','id="cabRpmArt" text-anchor="middle"')}
 ${smallGauge(264,248,19,'OIL','oilTempC')}${smallGauge(357,248,19,'H₂O','waterTempC')}
 ${[194,219,244,370,395,420].map((x,i)=>bolt(x,127+Math.abs(307-x)*.16,2)).join('')}
 ${[164,454,835,921].map((x,i)=>vent(x,225+i%2*8,19,24)).join('')}
 <path d="M510 193Q498 139 531 139Q554 139 561 185M604 185Q611 139 634 139Q667 139 655 193" fill="none" stroke="url(#rhMetal)" stroke-width="9"/>
 ${vent(531,151,28,25)}${vent(634,151,28,25)}
 <path d="M517 184Q584 164 648 184Q667 245 659 341L683 492Q582 528 483 493L505 341Q496 245 517 184Z" fill="url(#rhMetal)" stroke="#c5d5d8" stroke-width="2"/>
 <path d="M529 196Q584 181 637 196L649 333 665 482Q584 506 501 482L517 333Z" fill="url(#rhCarbon)" stroke="#586e7c" stroke-width="2"/>
 ${Array.from({length:6},(_,i)=>toggle(529+i*21,215,['START','LIGHT','CABIN','LIFT','A/C','AUDIO'][i],['startSwitchBtn','lightsBtn','ambientBtn','liftBtn','coolBtn','audioBtn'][i])).join('')}
 <path d="M529 244H639V307H525Z" fill="url(#rhScreen)" stroke="url(#rhMetal)" stroke-width="3"/>
 ${t(582,265,'HUAYRA BC',12,'#dedbc4','text-anchor="middle" font-family="Georgia,serif"')}${t(582,282,'0.0',12,'#dce9e6','id="rhBoost" text-anchor="middle"')}${t(582,295,'BOOST · bar',6,'#91a9b3','text-anchor="middle"')}
 ${dial(540,330,15,'TEMP','__temperature')}${dial(624,330,15,'FAN','__fan')}${dial(582,334,14,'MODE','modeBtn')}
 <path d="M530 370L565 355 636 380 643 455 610 478 532 453Z" fill="url(#rhMetal)" stroke="#e1e8e8" stroke-width="2"/>
 <path d="M548 387L571 374 621 391 625 449 606 461 548 443Z" fill="#07131b" stroke="#607782"/>
 <path d="M552 394L614 449M551 431L616 397" stroke="#b2c4ca" stroke-width="4"/>
 <g id="leverArt"><path d="M586 435L596 363" stroke="#d5dfda" stroke-width="9"/><path d="M589 398L619 409 613 434 583 425" fill="none" stroke="#99aab2" stroke-width="5"/><ellipse cx="597" cy="360" rx="15" ry="20" fill="url(#rhMetal)" stroke="#dbe8e4"/>${c('upPaddle','Exposed sequential selector — upshift','<rect x="574" y="337" width="47" height="61" fill="transparent"/>')}</g>
 ${[[531,373],[633,383],[538,451],[612,474],[553,395],[614,448]].map(([x,y])=>bolt(x,y,4)).join('')}
 ${b(521,478,32,18,'−','downPaddle')}${b(562,482,30,18,'N','__neutral')}${b(602,478,30,18,'R','__reverse')}
 ${paddles(308,358,120)}<g id="cabinWheelG" transform="translate(308 358)">
 <circle r="112" fill="none" stroke="#03090e" stroke-width="29"/><circle r="112" fill="none" stroke="url(#rhLeather)" stroke-width="22"/><circle r="105" class="stitch"/>
 <path d="M-107-33Q-68-28-40-43Q0-59 40-43Q68-28 107-33L109-1 45 22 24 103H-24L-45 22-109-1Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="2"/>
 <path d="M-42-43Q0-61 42-43L51 15Q42 55 0 63Q-42 55-51 15Z" fill="#33495b" stroke="#748d9b"/>
 <ellipse rx="26" ry="14" fill="#15252e" stroke="url(#rhMetal)" stroke-width="2"/>${t(0,4,'PAGANI',8,'#d9dfd6','text-anchor="middle" letter-spacing="1"')}
 ${c('hornBtn','Horn','<ellipse rx="41" ry="47" fill="transparent"/>')}${dial(-76,-11,11,'VOL','audioBtn')}${dial(77,-11,11,'DATA','dataBtn')}${dial(68,58,18,'MODE','modeBtn')}${dial(-66,58,15,'START','startSwitchBtn')}
 ${[-1,1].map(k=>p(`M${k*89} 10l${k*-34} 10`,'none','stroke="url(#rhMetal)" stroke-width="4"')).join('')}${bolt(-36,33)}${bolt(36,33)}${bolt(0,81)}
 </g>${t(786,291,'Huayra BC',22,'#aabdc1','font-family="Georgia,serif" font-style="italic"')}`+endCabin;}

export function zr1Cabin(){return startCabin('2025 Chevrolet Corvette ZR1 • driver-oriented C8 cockpit, squared wheel and tall climate-control spine')+`
 <path d="M22 172Q218 123 432 155Q715 130 979 181V315L726 364 479 304 427 427 92 409 20 299Z" fill="url(#rhLeather)" stroke="#81888a"/>
 ${stitch('M39 177Q215 137 432 166M660 170Q817 157 961 192')}
 <path d="M184 149Q317 94 443 155L456 250 182 256Z" fill="url(#rhLeather)" stroke="#687680" stroke-width="4"/>
 <path d="M206 158Q313 124 424 160L433 232H204Z" fill="url(#rhScreen)" stroke="#577480"/>
 ${revSegments(223,166,188,30,'#ecb930')}${t(313,207,'N',36,'#e8e5d3','id="cabGearArt" text-anchor="middle"')}${t(244,219,'0',21,'#e3edf0','id="cabSpeedArt"')}${t(402,214,'0',13,'#b9cbd2','id="cabRpmArt" text-anchor="end"')}
 <path d="M465 162L628 183 608 294 457 271Z" fill="url(#rhScreen)" stroke="#768b93" stroke-width="3"/>
 ${t(540,202,'CORVETTE',11,'#e7d69d','text-anchor="middle"')}${b(477,217,57,24,'DATA','dataBtn','#c4d8dc',8)}${b(542,227,53,24,'AUDIO','audioBtn','#c4d8dc',8)}
 <path d="M619 184L650 181Q672 326 760 493L729 510Q644 338 619 184Z" fill="url(#rhMetal)" stroke="#d2d3c6"/>
 ${Array.from({length:12},(_,i)=>{const x=626+i*5+i*i*.23,y=209+i*23;return b(x,y,22,17,['+','−','AUTO','A/C','FAN','HEAT','COOL','SYNC','CABIN','LIFT','DATA','AUDIO'][i],['__temperature','__temperatureDown','__climateAuto','coolBtn','__fan','heatBtn','coolBtn','__climateAuto','ambientBtn','liftBtn','dataBtn','audioBtn'][i],'#c3d2d9',4.5)}).join('')}
 <path d="M478 294L604 316 722 520H460Z" fill="url(#rhCarbon)" stroke="#6d828b"/>
 ${b(511,337,27,28,'R','__reverse')}${b(546,344,27,28,'N','__neutral')}${b(580,352,27,28,'D','upPaddle')}${dial(579,414,24,'MODE','modeBtn')}${dial(511,407,14,'START','startSwitchBtn')}${b(580,456,77,23,'E85 · Z','fuelBtn','#e2c269',8)}
 ${stripVent(83,224,65)}${stripVent(765,231,172)}
 <path d="M22 311L97 273 136 373 113 520H0ZM785 367Q842 311 902 370L950 520H781Z" fill="url(#rhLeather)" stroke="#867e63"/>
 ${stitch('M801 386Q843 351 889 385L924 507')}${harness(805,374)}${c('doorAllBtn','Door release',p('M38 326l45-20 7 13-46 21Z','url(#rhMetal)'))}
 ${c('lightsBtn','Headlamp stalk',p('M141 274L207 288 205 300 138 286Z','#172832','stroke="#869da4"')+t(159,284,'LIGHT',6,'#ccdbdb'))}
 ${paddles(316,358,125)}<g id="cabinWheelG" transform="translate(316 358)">
 <path d="M-82-99H82Q121-93 125-54V48Q118 92 78 99H-78Q-118 92-125 48V-54Q-121-93-82-99Z" fill="none" stroke="#060b10" stroke-width="30"/><path d="M-82-99H82Q121-93 125-54V48Q118 92 78 99H-78Q-118 92-125 48V-54Q-121-93-82-99Z" fill="none" stroke="url(#rhLeather)" stroke-width="23"/><path d="M0-109v22" stroke="#e4bf34" stroke-width="7"/>
 ${stitch('M-112-49v91Q-107 78-76 86M112-49v91Q107 78 76 86')}
 <path d="M-113-36L-37-47H37L113-36 112 11 47 25 23 89H-23L-47 25-112 11Z" fill="url(#rhCarbon)" stroke="#7b9095"/>
 <path d="M-40-39Q0-51 40-39L49 5Q36 55 0 57Q-36 55-49 5Z" fill="url(#rhLeather)" stroke="#697f89"/>
 <path d="M-29-12L-4-1 0 19 4-1 29-12 19 12 0 26-19 12Z" fill="#a93731" stroke="#c6cdbf"/><path d="M-27-10l20 9-11 8M-21-8l3 15M-13-4l-4 10" stroke="#e1e8df" stroke-width="3"/>
 ${c('hornBtn','Horn','<ellipse rx="40" ry="43" fill="transparent"/>')}${b(-107,-17,54,22,'VOL − +','audioBtn','#cbd9d8',7)}${b(54,-17,54,22,'DATA','dataBtn','#cbd9d8',7)}${dial(-75,65,15,'Z','fuelBtn')}${dial(75,65,15,'MODE','modeBtn')}${t(0,78,'ZR1',12,'#d3c786','text-anchor="middle"')}
 </g>`+endCabin;}

export function gtoCabin(){return classicCabin('Ferrari 250 GTO • black crackle dash, Veglia gauges, wood-rim wheel and bare aluminium footwell','gto')+`
 <path d="M20 181Q243 143 460 172Q714 152 980 189V306L20 307Z" fill="#232426" stroke="#62676a" stroke-width="2"/>
 <path d="M30 204H967V302H30Z" fill="url(#rhLeather)"/><path d="M39 303L192 313 262 520H14ZM447 305H946L981 520H457Z" fill="url(#rhMetal)" stroke="#7e898c"/>
 <path d="M447 319L497 477M905 319L726 498M80 311L190 493" fill="none" stroke="#8b9292" stroke-width="8"/>
 ${Array.from({length:12},(_,i)=>bolt(470+i*39,315,2.3)).join('')}
 ${gauge(315,211,57,'GIRI × 100',100,'cabRevNeedle')}${smallGauge(205,197,26,'OLIO','oilTempC')}${smallGauge(213,260,24,'ACQUA','waterTempC')}${smallGauge(416,197,25,'OLIO','oilTempC')}${gauge(423,259,24,'km/h',300,'cabSpeedNeedle')}
 ${hiddenReadouts}${toggle(142,245,'IGNIZIONE','startSwitchBtn')}${toggle(500,238,'LUCI','lightsBtn')}${toggle(549,238,'VENTOLA','fansBtn')}${dial(597,234,11,'ARIA','coolBtn')}
 <path d="M691 191h122v44H691Z" fill="#04080b" stroke="#5e676b"/>
 ${[708,752,796].map(x=>`<path d="M${x-10} 228v-18h20v18" fill="url(#rhMetal)"/><ellipse cx="${x}" cy="210" rx="13" ry="7" fill="#17252c" stroke="#d0d6d1" stroke-width="3"/>`).join('')}
 <path d="M685 348H825V430H685Z" fill="#2b373d" stroke="#818e95"/>
 ${Array.from({length:8},(_,i)=>`<rect x="${695+i*15}" y="367" width="8" height="43" fill="#c6b784" stroke="#566568"/>`+p(`M${699+i*15} 412q0 28 ${i*6-18} 46`,'none',`stroke="${i%2?'#b24432':'#c1aa5e'}" stroke-width="1.5"`)).join('')}
 <path d="M589 439l72-34 83 61-20 54H565Z" fill="#294866" stroke="#59758a"/>
 ${manual(641,362)}
 <path d="M42 321L151 363 181 520H0ZM832 391L949 337 996 520H863Z" fill="#304c6c" stroke="#74848d"/>
 ${c('doorAllBtn','Door latch',p('M47 327l59 22 5 14-62-23Z','url(#rhMetal)'))}
 <g id="cabinWheelG" transform="translate(315 376)">
 <circle r="113" fill="none" stroke="#231b13" stroke-width="19"/><circle r="113" fill="none" stroke="#b2763b" stroke-width="13"/><circle r="109" fill="none" stroke="#e0b26c" stroke-width="1"/><circle r="116" fill="none" stroke="#74411e" stroke-width="1"/>
 <path d="M-105-29L-25-14H25L105-29 111-7 28 12 16 106H-16L-28 12-111-7Z" fill="url(#rhMetal)" stroke="#dae1da"/>
 ${holes([-2.98,-.16,1.57])}<circle r="30" fill="#11191e" stroke="#d4ddd6" stroke-width="3"/><circle r="22" fill="#dcc641" stroke="#313a37"/>${t(0,8,'♞',29,'#10191b','text-anchor="middle"')}${c('hornBtn','Horn','<circle r="28" fill="transparent"/>')}${[0,2.094,4.188].map(a=>bolt(Math.cos(a)*27,Math.sin(a)*27,2)).join('')}
 </g>`+endCabin;}

export function f40Cabin(){return classicCabin('Ferrari F40 • grey flock dashboard, hooded Veglia instruments, Momo wheel and exposed Kevlar doors','f40')+`
 <path d="M23 185Q214 143 468 176Q704 146 976 190L971 304 479 317 167 303 23 281Z" fill="#4b4b4a" stroke="#757775" stroke-width="2"/>
 <path d="M51 192Q287 158 462 185M552 186Q771 165 946 195" fill="none" stroke="#858580" stroke-width="2"/>
 <path d="M168 246L176 167Q184 127 242 126H391Q450 127 458 167L465 246Z" fill="#383b3c" stroke="#8c8e87" stroke-width="3"/>
 <path d="M179 234L189 170Q196 142 242 142H390Q435 144 444 172L453 234Z" fill="#090d10"/>
 ${gauge(234,189,36,'km/h',360,'cabSpeedNeedle')}${gauge(326,183,49,'GIRI × 1000',10,'cabRevNeedle')}${smallGauge(415,192,27,'bar','boostBar',2)}
 ${hiddenReadouts}${smallGauge(545,225,25,'OLIO','oilTempC')}${smallGauge(612,225,25,'ACQUA','waterTempC')}${smallGauge(679,225,25,'OLIO','oilTempC')}
 ${stripVent(91,227,51)}${stripVent(761,227,173)}
 <path d="M491 281H704V365H487Z" fill="#121b21" stroke="#666f73"/>
 ${[509,555,601,647].map((x,i)=>b(x,291,27,26,['IGN','LUCI','CABIN','CORSA'][i],['startSwitchBtn','lightsBtn','ambientBtn','corsaBtn'][i],i===0?'#f08571':'#e0ded1',5.5)).join('')}
 ${dial(522,344,14,'TEMP','__temperature')}${dial(593,344,14,'FAN','__fan')}${dial(664,344,14,'A/C','coolBtn')}
 <path d="M491 369H629L693 520H467Z" fill="#0e171e" stroke="#52636c"/>${manual(570,389)}
 <path d="M1 287L106 277 155 359 135 520H0ZM870 341L974 282 1000 314V520H920Z" fill="#544e32" stroke="#9d9573"/>
 ${Array.from({length:8},(_,i)=>p(`M${5+i*14} 307l31 199M${933+i*8} 318l-12 185`,'none','stroke="#928261" stroke-width=".8"')).join('')}
 ${c('doorAllBtn','Door pull cable',p('M39 323Q84 302 100 332' ,'none','stroke="#a9a998" stroke-width="5"'))}
 <path d="M729 389Q796 325 854 385L901 520H711Z" fill="#952428" stroke="#cd5953" stroke-width="3"/>${harness(742,392)}
 <g id="cabinWheelG" transform="translate(325 369)"><circle r="113" fill="none" stroke="#060b0f" stroke-width="27"/><circle r="113" fill="none" stroke="url(#rhLeather)" stroke-width="19"/>
 <path d="M-110-28L-27-14H27L110-28 113-6 28 12 15 108H-15L-28 12-113-6Z" fill="#182328" stroke="#657279"/>
 <circle r="29" fill="#17232b" stroke="#93a1a5"/><circle r="19" fill="#d8c034"/>${t(0,7,'♞',25,'#17201a','text-anchor="middle"')}${Array.from({length:6},(_,i)=>bolt(Math.cos(i*Math.PI/3)*25,Math.sin(i*Math.PI/3)*25,2.6)).join('')}${t(0,82,'momo',6,'#d4bc67','text-anchor="middle"')}${c('hornBtn','Horn','<circle r="20" fill="transparent"/>')}</g>`+endCabin;}

export function p917Cabin(){return classicCabin('Porsche 917K • right-hand racing seat, VDO tachometer, drilled wheel, exposed frame and balsa shift knob','p917')+`
 <path d="M21 167Q271 127 557 155Q791 101 978 172L976 291 543 287 32 277Z" fill="#36383a" stroke="#777c7b" stroke-width="2"/>
 <path d="M596 220L605 147Q631 100 721 107Q811 108 839 151L848 222Z" fill="#141b20" stroke="#777e7c" stroke-width="3"/>
 ${gauge(723,164,48,'VDO · RPM × 1000',10,'cabRevNeedle')}${smallGauge(634,200,24,'OEL','oilTempC')}${smallGauge(815,202,24,'TEMP','waterTempC')}
 ${hiddenReadouts}${[657,695,748,795].map((x,i)=>`<circle cx="${x}" cy="124" r="6" fill="${['#99834b','#5c161c','#684431','#426042'][i]}" stroke="#c1c3ac"/>`+t(x,112,['BR','BEN','LK','OEL'][i],5,'#dbdfd1','text-anchor="middle"')).join('')}
 ${[134,206,278,352,427].map((x,i)=>toggle(x,205,['ZÜNDUNG','BENZIN','LICHT','VENT','START'][i],['startSwitchBtn','startSwitchBtn','lightsBtn','fansBtn','startSwitchBtn'][i])).join('')}
 ${dial(330,250,13,'LUFT','coolBtn')}${b(405,239,53,20,'DATA','dataBtn','#b8c8d1',7)}
 <path d="M109 297L177 271 220 488M174 285L402 460M499 286L320 463M591 292L618 491M965 291L851 494" fill="none" stroke="#858b88" stroke-width="10"/>
 <path d="M104 299L176 274 218 484M174 283L401 458" fill="none" stroke="#d1d4c8" stroke-width="2"/>
 <path d="M231 280H372V435H231Z" fill="#253039" stroke="#727c7d" stroke-width="3"/>
 ${Array.from({length:9},(_,i)=>`<rect x="${241+i*13}" y="335" width="7" height="49" fill="#ccbd90"/>`+p(`M${244+i*13} 326q${i*3-12}-28 ${i*5-20}-39M${244+i*13} 389q${i*4-16} 15 ${i*2-10} 31`,'none',`stroke="${i%3?'#c5b89a':'#bd4540'}" stroke-width="1.4"`)).join('')}
 <rect x="257" y="288" width="83" height="35" rx="3" fill="url(#rhMetal)"/><rect x="254" y="407" width="83" height="23" fill="url(#rhMetal)"/>
 <path d="M465 427Q492 361 575 374L624 520H451ZM648 429Q720 343 793 410L831 520H621Z" fill="#a31e32" stroke="#c5525b" stroke-width="3"/>${harness(665,420)}
 ${manual(904,364,true)}${c('doorAllBtn','Door latch',p('M39 228l65-8 3 12-65 11Z','url(#rhMetal)'))}
 <g id="cabinWheelG" transform="translate(721 348)"><circle r="113" fill="none" stroke="#050b0f" stroke-width="27"/><circle r="113" fill="none" stroke="url(#rhLeather)" stroke-width="18"/>
 <path d="M-110-31L-26-15H26L110-31 113-7 28 15 16 108H-16L-28 15-113-7Z" fill="url(#rhMetal)" stroke="#bcc7c7"/>
 ${[-1,1].map(k=>[48,72,94].map(v=>`<circle cx="${k*v}" cy="${-v*.18}" r="6.5" fill="#071117"/>`).join('')).join('')}${[42,66,91].map(y=>`<circle cy="${y}" r="7" fill="#061117"/>`).join('')}
 <circle r="28" fill="#7b8c93" stroke="#dbe0d9"/><circle r="16" fill="#08131a"/>
 ${Array.from({length:6},(_,i)=>bolt(Math.cos(i*Math.PI/3)*24,Math.sin(i*Math.PI/3)*24,3)).join('')}${c('hornBtn','Horn','<circle r="20" fill="transparent"/>')}
 </g>`+endCabin;}
export const TOURING_CABINS={mclaren:speedtailCabin,pagani:paganiCabin,zr1:zr1Cabin,gto:gtoCabin,f40:f40Cabin,p917:p917Cabin};
