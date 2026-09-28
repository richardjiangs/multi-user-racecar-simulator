import {path as p,text as t,bolt,control as c,button as b,dial,vent,ticks,needle,revSegments,paddles,startCabin,endCabin} from './materials.mjs';

const stitch=d=>p(d,'none','class="stitch"');
const ribVent=(x,y,w)=>`<rect x="${x}" y="${y}" width="${w}" height="19" rx="7" fill="#03090d" stroke="#737b7f"/>`+[0,1,2].map(i=>p(`M${x+7} ${y+5+i*4}h${w-14}`,'none','stroke="#515d65" stroke-width="1.4"')).join('');
const circleButton=(x,y,r,label,id,color='#859b9f')=>c(id,label,`<circle cx="${x}" cy="${y}" r="${r}" fill="#111a20" stroke="${color}" stroke-width="2"/>${t(x,y+2.5,label,6.5,'#e4ecec','text-anchor="middle"')}`);
const seat=(x,y,w,trim='#363a3d')=>`<path d="M${x} ${y+116}q-21-52 6-98q${w*.45}-30 ${w-12} 0q27 46 6 98l24 99H${x-24}Z" fill="url(#rhCarbon)" stroke="#515c61"/><path d="M${x+12} ${y+108}q-13-48 4-76q${w*.36}-25 ${w-32} 0q17 28 4 76l17 100H${x-5}Z" fill="${trim}" stroke="#76736b"/>${stitch(`M${x+17} ${y+95}l-2-57q${w*.35}-18 ${w-35} 0l2 57`)}<path d="M${x+w*.2} ${y+25}l13 173M${x+w*.78} ${y+25}l-10 173" stroke="#090c10" stroke-width="9"/>`;

export function venomCabin(){return startCabin('Venom F5 • carbon cockpit, open-top yoke and narrow switch tunnel')+`
 <path d="M28 164Q252 125 460 160Q733 115 970 166L978 296 713 336 480 277 415 414H160L24 290Z" fill="url(#rhCarbon)" stroke="#596970"/>
 <path d="M46 153Q234 129 446 163L454 187Q232 159 55 185ZM493 169Q740 123 950 162L943 206Q747 171 498 207Z" fill="#99958a" stroke="#c9c5ba"/>
 ${stitch('M61 163Q239 140 435 173M506 178Q743 141 933 174')}
 <path d="M1 222L79 205 120 313 109 520H0ZM897 268L976 215 1000 239V520H924Z" fill="url(#rhCarbon)" stroke="#616c70"/>
 <path d="M17 276L67 252 90 338 38 416 12 401ZM920 330L967 283 989 316 972 443 934 454Z" fill="#96958c" stroke="#c2c0b5"/>
 ${c('doorAllBtn','Butterfly doors',p('M40 293l32-17 4 8-31 18Z','url(#rhMetal)'))}
 ${seat(727,345,122,'#8e918b')}${seat(149,395,67,'#95978f')}
 <path d="M205 110L405 114 415 239 195 235Z" fill="url(#rhCarbon)" stroke="#879194" stroke-width="2"/>
 <path d="M217 125L393 128 401 223 207 221Z" fill="url(#rhScreen)" stroke="#1c292e" stroke-width="3"/>
 ${revSegments(227,143,154,28,'#8ebbe6')}
 ${t(308,184,'N',35,'#f1efe8','id="cabGearArt" text-anchor="middle"')}${t(239,202,'0',23,'#e5ecef','id="cabSpeedArt"')}${t(239,214,'km/h',6,'#94a9b7')}${t(382,199,'0',15,'#e5ecef','id="cabRpmArt" text-anchor="end"')}${t(382,212,'rpm',6,'#94a9b7','text-anchor="end"')}
 <path d="M300 112v12M305 112v12M310 112v12" stroke="#e8ebdf" stroke-width="4"/><path d="M300 112v12" stroke="#124478" stroke-width="3"/><path d="M310 112v12" stroke="#c03938" stroke-width="3"/>
 <path d="M498 140L661 128 674 258 501 273Z" fill="#0a1016" stroke="#81919b" stroke-width="3"/>
 ${t(585,178,'VENOM F5',18,'#cbd8dc','text-anchor="middle" font-style="italic"')}${t(585,202,'VEHICLE',8,'#819dab','text-anchor="middle"')}
 ${b(522,216,57,27,'F5 MODE','fuelBtn','#6fa9eb',8)}${b(585,212,64,28,'DOORS','doorAllBtn','#c8d6dd',8)}
 <path d="M504 283L591 269 666 520H532Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="3"/>
 ${vent(525,301,15,23)}${vent(568,294,15,23)}${dial(558,352,20,'A/C','coolBtn')}
 ${[[552,394,'N','__neutral'],[557,418,'R','__reverse'],[562,442,'D','upPaddle'],[567,466,'LIFT','liftBtn']].map(([x,y,l,id])=>b(x,y,48,21,l,id,'#d7e1e2',8)).join('')}
 ${ribVent(79,180,60)}${ribVent(853,190,68)}
 ${paddles(307,336,126)}
 <g id="cabinWheelG" transform="translate(307 336)">
 <path d="M-106-108L-112-7Q-113 67-73 90Q0 110 73 90Q113 67 112-7L106-108" fill="none" stroke="#060a0e" stroke-width="34" stroke-linecap="round"/>
 <path d="M-106-108L-112-7Q-113 67-73 90Q0 110 73 90Q113 67 112-7L106-108" fill="none" stroke="#a3a59b" stroke-width="25" stroke-linecap="round"/>
 ${stitch('M-101-100L-101-9Q-102 52-67 79M101-100L101-9Q102 52 67 79')}
 <path d="M-93-58Q0-76 93-58L103 22 66 85H-66L-103 22Z" fill="url(#rhCarbon)" stroke="#65727a"/>
 <path d="M-85-58Q0-73 85-58L82-28Q0-40-82-28Z" fill="url(#rhMetal)"/><rect x="-70" y="-57" width="140" height="20" rx="4" fill="#141b20"/>
 ${t(0,-43,'Hennessey',13,'#ced6d4','text-anchor="middle" font-style="italic"')}${t(0,-7,'F5',22,'#99a7ad','text-anchor="middle" font-style="italic"')}
 ${dial(-67,13,15,'VOL','audioBtn')}${dial(67,13,15,'MODE','modeBtn')}
 ${circleButton(-34,28,11,'LIGHT','lightsBtn')}${circleButton(34,28,11,'HUD','dataBtn')}
 <path d="M-6 22h12v27H-6Z" fill="#b7d971"/>
 ${c('startSwitchBtn','Ignition',`<path d="M-41 60L32 45 43 67-31 82Z" fill="#d3452d" stroke="#edb88d"/>${t(0,66,'IGNITION',9,'#ffefe7','text-anchor="middle" transform="rotate(-11 0 66)"')}`)}
 ${c('hornBtn','Horn',`<rect x="-25" y="-29" width="50" height="39" rx="5" fill="transparent"/>`)}
 ${bolt(-84,-46)}${bolt(84,-46)}${bolt(-40,51)}${bolt(38,41)}
 <path d="M-4 92v12M1 92v12M6 92v12" stroke="#ebeee5" stroke-width="4"/><path d="M-4 92v12" stroke="#265780" stroke-width="3"/><path d="M6 92v12" stroke="#b84944" stroke-width="3"/>
 </g>${t(785,277,'Hennessey',19,'#bdc9ca','font-style="italic"')}
 `+endCabin;}

export function amgOneCabin(){return startCabin('Mercedes-AMG ONE • twin displays, rectangular AMG wheel and structural carbon tunnel')+`
 <path d="M29 155Q214 101 440 146Q698 123 972 166L975 320 703 345 486 302 438 457 107 425 24 287Z" fill="url(#rhCarbon)" stroke="#67747a"/>
 <path d="M48 149Q221 115 455 162Q679 132 946 173L944 237Q701 190 474 220L125 233 55 218Z" fill="#7f8583" stroke="#b4bdb8"/>
 <path d="M78 159Q250 140 438 173M502 175Q701 154 929 184" class="fine"/>
 <path d="M0 230L78 213 108 399 93 520H0ZM888 321L966 249 1000 248V520H922Z" fill="url(#rhCarbon)"/>
 <path d="M914 330L969 269 989 289 974 433 937 460Z" fill="#d6d9cf" stroke="#8e9899"/>
 ${c('doorAllBtn','Dihedral doors',p('M37 267l40-15v11l-37 16Z','url(#rhMetal)'))}
 ${seat(732,355,112)}${seat(155,401,63)}
 <path d="M184 111L417 119 418 249 180 241Z" fill="url(#rhScreen)" stroke="url(#rhMetal)" stroke-width="4"/>
 ${revSegments(203,137,195,30,'#73b3ed')}
 <path d="M238 179L270 160 336 160 368 186 392 208H209Z" fill="#162b3e" stroke="#a7595d"/>
 ${t(305,199,'N',37,'#f1f4e8','id="cabGearArt" text-anchor="middle"')}${t(304,221,'0',19,'#def2f5','id="cabSpeedArt" text-anchor="middle"')}
 ${t(213,179,'OIL',7,'#9cafb7')}${t(213,191,'88°C',9,'#b6c4c9','id="rhOil"')}${t(389,179,'RPM',7,'#9cafb7','text-anchor="end"')}${t(389,193,'0',11,'#b6c4c9','id="cabRpmArt" text-anchor="end"')}
 <path d="M204 231h192" stroke="#448ecb"/><path d="M293 116h29" stroke="#78c8bf" stroke-width="3"/>
 <path d="M503 159L706 151 719 278 504 286Z" fill="url(#rhScreen)" stroke="url(#rhMetal)" stroke-width="3"/>
 ${t(611,181,'AMG ONE',13,'#cfdedb','text-anchor="middle"')}${t(610,205,'HYBRID SYSTEM',8,'#8499a3','text-anchor="middle"')}
 <path d="M577 217h26l8 17h38M600 217h26v-5h22" fill="none" stroke="#52bcb5" stroke-width="2"/>
 ${b(522,249,82,22,'ENERGY','dataBtn','#8bd7cc',7)}${b(612,245,80,22,'A/C','coolBtn','#cbdde0',8)}
 ${ribVent(86,208,67)}${ribVent(538,298,139)}${ribVent(865,214,69)}
 <path d="M484 324L576 317 678 520H492Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="3"/>
 ${dial(535,356,23,'START','startSwitchBtn')}
 ${b(505,391,29,22,'N','__neutral')}${b(538,391,29,22,'R','__reverse')}${b(571,391,29,22,'D','upPaddle')}
 ${b(521,421,85,25,'LIFT','liftBtn')}${b(530,453,85,23,'AUDIO','audioBtn')}
 <path d="M549 489l65-4 21 20-80 7Z" fill="url(#rhMetal)"/>${t(584,503,'AMG',10,'#1d2b32','text-anchor="middle" font-style="italic"')}
 ${paddles(305,350,127)}
 <g id="cabinWheelG" transform="translate(305 350)">
 <path d="M-76-111H76Q112-109 120-65L121 46Q116 92 75 96H-75Q-116 92-121 46L-120-65Q-112-109-76-111Z" fill="none" stroke="#080d10" stroke-width="32"/>
 <path d="M-76-111H76Q112-109 120-65L121 46Q116 92 75 96H-75Q-116 92-121 46L-120-65Q-112-109-76-111Z" fill="none" stroke="url(#rhLeather)" stroke-width="25"/>
 <path d="M-63-113H63" fill="none" stroke="url(#rhCarbon)" stroke-width="21"/>
 ${stitch('M-107-63L-108 44Q-104 75-83 83M107-63L108 44Q104 75 83 83')}
 <path d="M-112-47L-48-65H48L112-47 105 29 50 31 31 83H-31L-50 31-105 29Z" fill="url(#rhCarbon)" stroke="#6c797e"/>
 ${circleButton(-78,-51,12,'DRS','drsBtn','#4d6dbd')}${circleButton(-52,-69,11,'LIGHT','lightsBtn','#c6ad40')}${circleButton(52,-69,11,'INFO','dataBtn','#429567')}${circleButton(78,-51,12,'MODE','modeBtn','#b6424a')}
 ${b(-106,-21,47,19,'VOL − +','audioBtn','#b8cace',6)}${b(59,-21,47,19,'HUD','dataBtn','#b8cace',7)}
 <path d="M-101 10h37M65 10h37" stroke="url(#rhMetal)" stroke-width="4"/>
 <ellipse rx="53" ry="65" fill="url(#rhLeather)" stroke="#6c7577"/>
 <circle r="27" fill="#0b141c" stroke="url(#rhMetal)" stroke-width="3"/><path d="M0-25L4-2 23 13 0 5-23 13-4-2Z" fill="url(#rhMetal)"/>
 ${c('hornBtn','Horn','<ellipse rx="47" ry="59" fill="transparent"/>')}
 ${dial(70,64,17,'MODE','modeBtn')}${b(-90,51,34,25,'ESC','escBtn','#76cfc2',8)}
 ${t(0,48,'AIRBAG',5,'#77858b','text-anchor="middle"')}${bolt(-105,34)}${bolt(105,34)}
 </g>${t(801,286,'AMG ONE',17,'#bdcbc9','font-style="italic"')}
 `+endCabin;}

// These canvases receive the same live, independently aimed rear projections as Drive.
export const camera=(x,y,w,h,side)=>`<g><rect x="${x-6}" y="${y-7}" width="${w+12}" height="${h+18}" rx="6" fill="url(#rhCarbon)" stroke="#667880" stroke-width="2"/><foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><canvas xmlns="http://www.w3.org/1999/xhtml" id="rhRear${side}" width="300" height="160" aria-label="Live ${side.toLowerCase()} rear view" style="width:100%;height:100%;background:#132331"></canvas></foreignObject>${t(x+w/2,y+h+8,side.toUpperCase(),5,'#93aaaf','text-anchor="middle"')}</g>`;

export function valkyrieCabin(){return startCabin('Aston Martin Valkyrie • carbon tub, removable display wheel and permanent rear-camera monitors')+`
 <path d="M19 165Q194 126 426 163L495 206Q722 131 977 179L959 322 806 367 531 300 446 444 151 431 20 306Z" fill="url(#rhCarbon)" stroke="#58696e"/>
 <path d="M54 171Q220 141 423 179L422 201Q217 169 62 202ZM579 181Q752 148 948 189L928 229Q757 194 580 221Z" fill="url(#rhLeather)"/>
 ${stitch('M65 181Q218 151 413 187M588 190Q755 160 930 198')}
 <path d="M0 0H74L148 172 92 272 42 221ZM919 0H1000V292L937 272 860 165Z" fill="url(#rhCarbon)" stroke="#6a7375"/>
 <path d="M0 242L62 223 122 352 146 520H0ZM897 322L977 244 1000 280V520H930Z" fill="url(#rhCarbon)"/>
 <path d="M34 288L67 275 104 350" fill="none" stroke="#72898c" stroke-width="6"/>
 ${c('doorAllBtn','Gullwing doors',p('M33 279l47-14 4 18-45 18Z','transparent'))}
 ${seat(734,352,115,'#161f24')}${seat(169,394,71,'#151e23')}
 ${camera(94,123,104,62,'Left')}${camera(816,136,108,63,'Right')}
 <path d="M503 129L628 128 639 238 501 245Z" fill="url(#rhCarbon)" stroke="#77858a" stroke-width="3"/>
 <path d="M511 138L620 137 629 229 510 234Z" fill="url(#rhScreen)"/>
 ${t(568,156,'VALKYRIE',9,'#dbe8d8','text-anchor="middle"')}
 <path d="M552 169q16-9 31 0l7 30q-22 10-46 0Z" fill="#50686c" stroke="#99b7b6"/>
 ${b(516,211,48,18,'LIFT','liftBtn','#c5d4ba',6)}${b(573,210,48,18,'A/C','coolBtn','#c5d4ba',7)}
 ${ribVent(511,253,113)}${vent(235,235,10,18)}${vent(904,239,10,18)}
 <path d="M482 318L540 299 629 520H491Z" fill="url(#rhCarbon)" stroke="#718286"/>
 <path d="M504 352L539 342 548 360 510 372Z" fill="#131e25" stroke="#809692"/>
 ${b(510,391,48,21,'HARNESS','harnessBtn','#bfcfae',6)}${b(521,421,48,21,'LIGHT','ambientBtn','#bfcfae',7)}${b(533,451,48,21,'AUDIO','audioBtn','#bfcfae',7)}
 <g id="amrProArt" role="button" tabindex="0" aria-label="Toggle AMR Pro variant"><rect x="710" y="307" width="123" height="27" rx="5" fill="#182920" stroke="#91b96b"/>${t(771,325,'AMR PRO · Y',10,'#cfe8a7','text-anchor="middle"')}</g>
 ${t(770,292,'ROAD + KERS',9,'#b9c8a6','id="variantStatusArt" text-anchor="middle"')}
 ${paddles(353,328,164)}
 <g id="cabinWheelG" transform="translate(353 328)">
 <path d="M-96-110Q0-133 96-110Q128-98 135-58L132 53Q125 94 92 99Q0 113-92 99Q-125 94-132 53L-135-58Q-128-98-96-110Z" fill="none" stroke="#070c10" stroke-width="32"/>
 <path d="M-96-110Q0-133 96-110Q128-98 135-58L132 53Q125 94 92 99Q0 113-92 99Q-125 94-132 53L-135-58Q-128-98-96-110Z" fill="none" stroke="url(#rhLeather)" stroke-width="24"/>
 ${stitch('M-109-88Q-120-63-121-30V45M109-88Q120-63 121-30V45')}
 <path d="M-87-105Q0-125 87-105L78 58 47 92H-47L-78 58Z" fill="url(#rhCarbon)" stroke="#748481"/>
 <path d="M-70-88H70L64 37H-64Z" fill="url(#rhScreen)" stroke="#819391"/>
 ${revSegments(-58,-77,116,20,'#b7db68')}
 <circle cx="0" cy="-17" r="43" fill="#09161e" stroke="#546674"/>${ticks(0,-17,40,12,48,-130,130,'#aabcc2')}
 ${t(0,-13,'0',27,'#eef4e6','id="cabSpeedArt" text-anchor="middle"')}${t(0,0,'km/h',6,'#acbdbc','text-anchor="middle"')}${t(0,23,'N',16,'#d1e886','id="cabGearArt" text-anchor="middle"')}${t(0,49,'0',9,'#a9bcbb','id="cabRpmArt" text-anchor="middle"')}
 ${circleButton(-105,-67,9,'LIGHT','lightsBtn')}${circleButton(-105,-34,9,'HUD','dataBtn')}${circleButton(-105,24,9,'KERS','hybridBtn','#9cb866')}
 ${circleButton(105,-67,9,'MODE','modeBtn')}${circleButton(105,-34,9,'HORN','hornBtn')}${circleButton(105,24,9,'ESC','escBtn')}
 ${b(-27,57,54,18,'START / STOP','startSwitchBtn','#d8e1dc',6)}${circleButton(-18,90,10,'N','__neutral')}${circleButton(18,90,10,'R','__reverse')}
 ${bolt(-77,-96)}${bolt(77,-96)}${bolt(-66,45)}${bolt(66,45)}
 </g>${t(706,487,'ASTON MARTIN',10,'#849a91','letter-spacing="2"')}
 `+endCabin;}

export function mcf1Cabin(){return startCabin('McLaren F1 • central driving position, white analogue instruments and three-seat cabin')+`
 <path d="M32 166Q180 118 345 160Q500 67 655 160Q820 118 967 166L978 292 678 332 626 449H374L322 332 23 292Z" fill="url(#rhLeather)" stroke="#776f65"/>
 <path d="M39 230Q203 185 337 239L357 284Q185 229 41 277ZM663 239Q797 185 961 230L959 277Q815 229 643 284Z" fill="url(#rhTan)" stroke="#c4a383"/>
 ${stitch('M43 172Q186 134 334 177M666 177Q814 134 957 172')}
 <path d="M1 257L86 228 142 366 132 520H0ZM999 257L914 228 858 366 868 520H1000Z" fill="url(#rhCarbon)"/>
 ${seat(142,305,135,'url(#rhTan)')}${seat(723,305,135,'url(#rhTan)')}
 <path d="M374 430Q500 388 626 430L635 520H365Z" fill="url(#rhLeather)" stroke="#71685c"/>
 <path d="M293 207Q320 151 374 155Q395 113 500 111Q605 113 626 155Q680 151 707 207L696 275H304Z" fill="url(#rhCarbon)" stroke="#69757d" stroke-width="2"/>
 <path d="M368 151Q398 104 500 103Q602 104 632 151" fill="none" stroke="#9a8d78" stroke-width="14"/>
 ${stitch('M369 148Q400 109 500 109Q600 109 631 148')}
 <circle cx="414" cy="201" r="40" fill="#deded3" stroke="#0c141a" stroke-width="4"/>
 ${[[-16,-3,'OIL'],[16,-3,'WATER'],[0,19,'FUEL']].map(([x,y,l])=>`<path d="M${414+x-12} ${201+y}a12 12 0 0 1 24 0" fill="none" stroke="#283d47" stroke-width=".8"/>${t(414+x,201+y+8,l,5,'#263841','text-anchor="middle"')}<path d="M${414+x} ${201+y}l-6-7" stroke="#c26b3e"/>`).join('')}
 <circle cx="500" cy="185" r="53" fill="#e3e3d9" stroke="#101a20" stroke-width="4"/>${ticks(500,185,47,8,32,-130,130,'#27343b')}${needle('cabRpmNeedle',500,185,39,8000)}${t(500,210,'rpm × 1000',6,'#293840','text-anchor="middle"')}${t(500,224,'F1',13,'#303d42','text-anchor="middle" font-style="italic"')}
 <circle cx="586" cy="201" r="40" fill="#deded3" stroke="#0c141a" stroke-width="4"/>${ticks(586,201,34,400,32,-130,130,'#2b3b43')}${needle('cabSpeedNeedle',586,201,29,400)}${t(586,224,'km/h',6,'#263841','text-anchor="middle"')}
 <rect x="385" y="249" width="79" height="20" rx="2" fill="#a8b76d" stroke="#222e26"/><rect x="538" y="249" width="77" height="20" rx="2" fill="#a8b76d" stroke="#222e26"/>
 ${t(391,262,'0',10,'#23361b','id="cabSpeedArt"')}${t(444,263,'km/h',6,'#314429')}${t(543,263,'0',9,'#2c3e22','id="cabRpmArt"')}${t(601,263,'N',9,'#2c3e22','id="cabGearArt"')}
 ${dial(335,188,13,'LIGHT','lightsBtn')}${dial(335,225,12,'A/C','coolBtn')}${dial(665,188,13,'IGN','startSwitchBtn')}${dial(665,225,12,'DOOR','doorAllBtn')}
 ${ribVent(230,253,71)}${ribVent(698,253,71)}${ribVent(58,227,62)}${ribVent(880,227,62)}
 <path d="M353 311L376 327 346 520H299Z" fill="url(#rhCarbon)" stroke="#60727a"/>
 <path d="M624 327L647 311 706 520H654Z" fill="url(#rhCarbon)" stroke="#60727a"/>
 ${b(302,419,47,25,'AUDIO','audioBtn','#c7d6da',7)}${b(307,387,47,24,'A/C','coolBtn','#c7d6da',8)}
 <path d="M656 448v-60" stroke="url(#rhMetal)" stroke-width="9"/><ellipse cx="656" cy="387" rx="19" ry="24" fill="#22292c" stroke="#99a5a8"/>
 <path d="M646 385h20M649 376v19M662 376v19" stroke="#aebfc5" fill="none"/>
 ${c('upPaddle','Manual gear lever — shift up',`<rect x="631" y="357" width="51" height="60" rx="9" fill="transparent"/>`)}${b(656,454,33,22,'−','downPaddle','#c7d7da',13)}${b(662,482,33,20,'N','__neutral')}${b(619,480,33,20,'R','__reverse')}
 <g id="cabinWheelG" transform="translate(500 345)">
 <circle r="113" fill="none" stroke="#05090d" stroke-width="29"/><circle r="113" fill="none" stroke="url(#rhLeather)" stroke-width="23"/><circle r="106" class="stitch"/>
 <path d="M-107-20L-43-18Q0-41 43-18L107-20 105 12 42 14 20 105H-20L-42 14-105 12Z" fill="url(#rhLeather)" stroke="#4e5a60"/>
 <circle r="43" fill="url(#rhCarbon)" stroke="#849197" stroke-width="2"/>
 <path d="M-20-13H4L0-4H-14L-16 1H-3L-6 8H-19ZM11-13H22L10 13H2Z" fill="none" stroke="#b5c5c9" stroke-width="2"/>
 ${t(0,25,'V12',11,'#abbabe','text-anchor="middle"')}${bolt(-33,0)}${bolt(33,0)}${t(0,89,'NARDI',5,'#75848b','text-anchor="middle"')}
 ${c('hornBtn','Horn','<circle r="39" fill="transparent"/>')}
 </g>${b(449,480,101,23,'XP5 RECORD RUN','raceAeroBtn','#d7c48f',8)}
 ${camera(95,98,115,61,'Left')}${camera(790,98,115,61,'Right')}
 `+endCabin;}

export const NEXT_CABINS={venom:venomCabin,amgone:amgOneCabin,aston:valkyrieCabin,mcf1:mcf1Cabin};
