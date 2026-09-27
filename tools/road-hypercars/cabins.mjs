import {path as p,text as t,bolt,control as c,action as a,button as b,dial,vent,ticks,needle,revSegments,paddles,startCabin,endCabin} from './materials.mjs';

// All five are separate elevations: these are not a recoloured cockpit template.
export function bugattiCabin(){return startCabin('Chiron Super Sport 300+ • Alcantara cabin, analog speedometer and four climate dials')+`
 <path d="M44 161Q174 92 416 132Q456 140 493 181Q753 115 958 166L982 314Q722 337 530 293L482 410H169L37 318Z" fill="url(#rhLeather)" stroke="#45494b"/>
 <path d="M50 176Q185 115 407 148M541 175Q757 133 944 178" class="stitch" stroke="#d37636"/>
 <path d="M495 81C437 115 448 184 477 227C509 278 518 399 648 517" fill="none" stroke="#646c71" stroke-width="15"/>
 <path d="M495 82C444 120 451 184 483 226C515 278 524 397 654 517" fill="none" stroke="#d8c8b8" stroke-width="2"/>
 <path d="M553 205Q733 158 951 192L960 298Q785 332 583 281Z" fill="url(#rhCarbon)" opacity=".6"/>
 <path d="M40 233Q61 216 113 225L151 381 83 500 0 473V261Z" fill="#1b2024"/>
 <path d="M22 284Q65 265 108 292L125 371 23 396Z" fill="url(#rhLeather)" stroke="#5c4c42"/>
 <path d="M44 299l58-12 5 12-49 14Z" fill="url(#rhMetal)"/>
 ${c('doorAllBtn','Open / close doors',`<path d="M35 285l80-17 13 42-84 20Z" fill="transparent"/>`)}
 <path d="M880 310Q918 238 996 250L1000 484 854 501Z" fill="url(#rhLeather)"/><path d="M906 345l75-24M902 355l78-24" class="stitch"/>
 <path d="M752 394Q807 344 858 366L891 520H669Z" fill="url(#rhLeather)" stroke="#5b6164"/>
 ${Array.from({length:8},(_,i)=>p(`M${728-i*5} ${418+i*13}q70-13 133-4`,'none','stroke="#606165" stroke-width="1.2"')).join('')}
 <path d="M110 416Q163 365 212 391L282 520H67Z" fill="url(#rhLeather)" stroke="#5b6164"/>
 <path d="M156 184Q174 119 273 123H359Q453 129 461 192L442 259 172 258Z" fill="#080b0e" stroke="#596269" stroke-width="3"/>
 <path d="M165 186Q184 137 262 140H366Q431 146 450 189L433 245H181Z" fill="url(#rhScreen)"/>
 <rect x="176" y="170" width="65" height="67" rx="6" fill="#091017"/>${t(207,188,'POWER',8,'#9daebc','text-anchor="middle"')}${t(207,215,'0',21,'#f0ece3','id="rhPower" text-anchor="middle"')}${t(207,231,'PS',8,'#9daebc','text-anchor="middle"')}
 <circle cx="309" cy="191" r="59" fill="#090d11" stroke="url(#rhMetal)" stroke-width="2"/>${ticks(309,191,53,500)}${needle('cabSpeedNeedle',309,191,46,500)}
 ${t(309,222,'0',16,'#eff3f4','id="cabSpeedArt" text-anchor="middle"')}${t(309,235,'km/h',7,'#adb8bf','text-anchor="middle"')}
 ${t(396,185,'N',23,'#f1ebe0','id="cabGearArt" text-anchor="middle"')}${t(396,209,'1,100',13,'#eae1d2','id="cabRpmArt" text-anchor="middle"')}${t(396,223,'rpm',8,'#94a1ab','text-anchor="middle"')}
 <path d="M376 239h50" stroke="#bc602b" stroke-width="2"/>
 ${vent(121,222,15,38)}${vent(482,199,11,27)}${vent(933,209,13,36)}
 <path d="M505 177Q528 168 548 197L587 343Q597 374 576 399L541 412Q525 355 510 291Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="3"/>
 ${dial(530,209,18,'22°','__temperature').replace('<text','<text id="rhTempSet"')}${dial(540,252,17,'FAN 2','__fan').replace('<text','<text id="rhFanSet"')}${dial(551,293,16,'AUTO','__climateAuto').replace('<text','<text id="rhClimateAuto"')}${dial(562,332,15,'A/C','coolBtn')}
 <path d="M579 380L620 444 597 464 563 404Z" fill="url(#rhMetal)"/><path d="M577 359q28-10 35 17l-8 29-20 3Z" fill="url(#rhLeather)" stroke="#969b9d"/>
 ${c('upPaddle','Select drive / upshift',`<path d="M574 356q37-15 43 23l-9 31-34-6Z" fill="transparent"/>`)}
 ${t(662,264,'SUPER SPORT',14,'#ca7032','letter-spacing="2"')}${t(758,284,'300+',16,'#ca7032','font-style="italic"')}
 ${b(552,457,46,22,'N','__neutral')}${b(603,457,46,22,'R','__reverse')}
 ${paddles(308,326,122)}
 <g id="cabinWheelG" transform="translate(308 326)">
 <path d="M-80-91Q0-141 80-91C140-36 133 37 74 96H-74C-133 37-140-36-80-91Z" fill="none" stroke="#080a0c" stroke-width="30"/>
 <path d="M-80-91Q0-141 80-91C140-36 133 37 74 96H-74C-133 37-140-36-80-91Z" fill="none" stroke="url(#rhLeather)" stroke-width="24"/>
 <path d="M-78-82Q0-131 78-82C126-37 123 31 67 85H-67C-123 31-126-37-78-82Z" class="stitch" stroke="#be6835"/>
 <path d="M-4-116v24" stroke="#ee781f" stroke-width="9"/>
 <path d="M-112-20L-38-6 38-6 112-20 111 9 41 27 23 91H-23L-41 27-111 9Z" fill="url(#rhMetal)"/>
 <path d="M-103-17L-41-4-44 20-103 5ZM103-17L41-4 44 20 103 5Z" fill="#10151a"/>
 ${c('audioBtn','Cabin audio',`<rect x="-105" y="-22" width="53" height="31" rx="5" fill="transparent"/>${t(-79,-6,'♪  +',12,'#bac6ce','text-anchor="middle"')}`)}
 ${c('lightsBtn','Headlamps',`<rect x="55" y="-22" width="52" height="31" rx="5" fill="transparent"/>${t(81,-6,'◀  ☼',10,'#bac6ce','text-anchor="middle"')}`)}
 <path d="M-44-46Q0-64 44-46L53-5Q50 42 0 50Q-50 42-53-5Z" fill="url(#rhLeather)" stroke="#70767a"/>
 ${t(0,10,'EB',29,'#b6bdc2','text-anchor="middle" font-family="serif" font-weight="bold"')}
 ${dial(-70,49,18,'MODE','modeBtn')}${dial(70,49,18,'START','startSwitchBtn')}
 ${c('hornBtn','Horn',`<circle r="38" fill="transparent"/>`)}
 </g>
 ${c('speedKeyBtn','Speed key',`<circle cx="121" cy="377" r="16" fill="url(#rhMetal)"/><path d="M116 375h10v4h-10Z" fill="#13191d"/>${t(121,405,'SPEED KEY',8,'#d99055','text-anchor="middle"')}`)}
 ${t(719,504,'CHIRON • SUPER SPORT 300+',9,'#8c8277','letter-spacing="1.7"')}
 `+endCabin;}

export function jeskoCabin(){return startCabin('Jesko • SmartWheel, self-leveling SmartCluster, SmartCenter and Autoskin')+`
 <path d="M39 166Q145 125 293 156L386 170 448 138 517 179Q760 121 961 174L981 318 753 358 533 318 446 444 142 427 28 287Z" fill="url(#rhCarbon)" stroke="#6c757b"/>
 <path d="M62 168Q203 141 397 181L425 218 86 245ZM560 179Q763 145 938 178L925 241 574 236Z" fill="url(#rhLeather)" stroke="#5b6266"/>
 <path d="M74 179Q222 151 394 193M573 190Q771 159 930 189" class="stitch"/>
 <path d="M1 245Q38 207 96 241L128 357 97 510H0Z" fill="url(#rhLeather)"/><path d="M24 267l67-21 17 57-72 30Z" fill="url(#rhCarbon)" stroke="#586166"/>
 ${c('doorAllBtn','Autoskin doors',`<path d="M36 287l52-15v11l-48 15Z" fill="url(#rhMetal)"/>`)}
 <path d="M868 315Q931 243 999 257V516H878Z" fill="url(#rhLeather)"/><path d="M898 320l77-35" class="edge"/>
 <path d="M696 415Q744 354 826 360L895 520H650Z" fill="url(#rhLeather)" stroke="#67705e"/><path d="M716 417Q760 378 812 385L845 501 693 505Z" fill="#20282b" stroke="#a1b673"/>
 <path d="M138 403Q171 376 203 391L267 520H77Z" fill="url(#rhLeather)" stroke="#879771"/>
 <path d="M541 206L614 210Q652 306 663 422L614 500 520 439Z" fill="url(#rhMetal)"/>
 <path d="M550 213L604 218 645 411 613 480 532 433Z" fill="url(#rhCarbon)"/>
 <path d="M538 173Q574 154 613 170L623 203Q583 218 540 203Z" fill="url(#rhMetal)" stroke="#77848b"/>
 <path d="M544 176Q576 163 607 176L613 198Q580 207 547 198Z" fill="url(#rhMesh)"/>
 <circle cx="561" cy="188" r="6" fill="url(#rhMetal)"/><circle cx="598" cy="188" r="6" fill="url(#rhMetal)"/>
 <path d="M103 177q37-26 66 1l-3 33-58 4Z" fill="url(#rhMetal)"/><path d="M110 180q28-17 51 1l-3 24-45 3Z" fill="url(#rhMesh)"/>
 <path d="M897 174q28-21 46-1l4 38-45 2Z" fill="url(#rhMetal)"/><path d="M903 177q21-13 34 0l4 28-32 2Z" fill="url(#rhMesh)"/>
 <path d="M549 228L608 231 630 347 551 351Z" fill="url(#rhScreen)" stroke="#6a777e"/>
 ${t(585,247,'SmartCenter',9,'#d8e0dc','text-anchor="middle"')}
 <path d="M580 259q12-8 23 0l10 44q-15 12-34 0Z" fill="#334449" stroke="#a9c896"/><path d="M583 265h18l4 17h-23Z" fill="#09151b"/>
 ${b(551,309,33,27,'DOOR','doorAllBtn','#b7d693',7)}${b(589,309,33,27,'LIFT','liftBtn','#b7d693',7)}
 ${b(555,344,33,22,'A/C','coolBtn','#dbe7ed',7)}${b(591,344,34,22,'♪','audioBtn','#dbe7ed',10)}
 <g transform="translate(75 10)"><path d="M580 392h35l7 60h-52Z" fill="url(#rhMetal)"/><path d="M590 387v-29" stroke="url(#rhMetal)" stroke-width="10"/><path d="M574 352q15-11 34 0l-1 27q-15 11-33 0Z" fill="url(#rhLeather)" stroke="#adb4b5"/>
 ${c('upPaddle','Select drive / upshift',`<rect x="568" y="343" width="44" height="45" rx="8" fill="transparent"/>`)}
 </g>${dial(560,393,13,'N','__neutral')}${dial(630,394,13,'R','__reverse')}${dial(593,456,21,'START','startSwitchBtn')}
 ${b(458,398,50,23,'MODE','modeBtn','#b8d191',8)}${b(463,430,50,23,'SKIN','heatBtn','#b8d191',8)}
 ${paddles(314,322,123)}
 <g id="cabinWheelG" transform="translate(314 322)">
 <path d="M-91-88Q-75-117 0-118Q75-117 91-88L118-20Q129 34 77 88Q0 111-77 88Q-129 34-118-20Z" fill="none" stroke="#080a0c" stroke-width="31"/>
 <path d="M-91-88Q-75-117 0-118Q75-117 91-88L118-20Q129 34 77 88Q0 111-77 88Q-129 34-118-20Z" fill="none" stroke="url(#rhLeather)" stroke-width="24"/>
 <path d="M-91 66Q-76 103 0 104Q76 103 91 66" fill="none" stroke="url(#rhCarbon)" stroke-width="20"/>
 <path d="M0-130v23" stroke="#d7d3c5" stroke-width="3"/>
 <rect x="-53" y="-111" width="106" height="84" rx="10" fill="url(#rhMetal)"/><rect x="-49" y="-106" width="98" height="75" rx="6" fill="#040a10"/>
 <g transform="translate(0 -70)"><g id="jeskoLevelArt">
 <circle r="32" fill="#111b26" stroke="#758794"/><circle r="26" fill="none" stroke="#475568" stroke-width="3"/>
 ${t(0,-17,'N',13,'#edf4e1','id="cabGearArt" text-anchor="middle"')}${t(0,4,'0',20,'#edf4e1','id="cabSpeedArt" text-anchor="middle"')}${t(0,14,'km/h',6,'#97b695','text-anchor="middle"')}${t(0,28,'0',8,'#ccddbb','id="cabRpmArt" text-anchor="middle"')}
 <rect x="-37" y="-36" width="74" height="3" fill="#aed34e" id="rhJeskoRev"/>
 </g></g>
 <path d="M-117-19L-38-9 38-9 117-19 110 24 45 27 30 80H-30L-45 27-110 24Z" fill="url(#rhCarbon)" stroke="#676e72"/>
 ${b(-108,-9,53,28,'LIGHTS','lightsBtn','#c9dad5',7)}${b(55,-9,53,28,'AUDIO','audioBtn','#c9dad5',7)}
 <circle r="55" fill="url(#rhMetal)"/><circle r="50" fill="url(#rhLeather)" stroke="#080c10" stroke-width="3"/>
 <path d="M-19-24Q0-34 19-24L17 12 0 30-17 12Z" fill="#232e30" stroke="#718780"/><path d="M0-25v48M-12-18l25 9-25 8 25 8-20 8" stroke="#495d55" fill="none"/>
 ${c('hornBtn','Horn',`<circle r="43" fill="transparent"/>`)}
 <path d="M-48 82h96l-13 17h-70Z" fill="url(#rhMetal)"/>${t(0,95,'Koenigsegg',9,'#1c282b','font-style="italic" text-anchor="middle"')}
 </g>
 ${t(749,272,'Jesko',25,'#c8d0c9','font-style="italic"')}${t(747,292,'Koenigsegg',9,'#8b989a')}
 ${t(739,494,'SMARTWHEEL · SMARTCENTER',9,'#81928c','letter-spacing="1"')}
 `+endCabin;}

export function p1Cabin(){return startCabin('McLaren P1 • left-hand driving seat, three-part instrument display, IRIS and DRS/IPAS wheel')+`
 <path d="M27 193Q68 133 177 147Q281 93 431 148L479 192Q573 128 705 150Q854 152 968 179L973 312 764 355 487 324 424 456 111 449 26 315Z" fill="url(#rhCarbon)" stroke="#49525b"/>
 <path d="M40 182Q118 126 175 155Q286 105 427 156L469 189 416 221 149 220Z" fill="url(#rhLeather)"/>
 <path d="M593 150Q746 126 925 168L925 208Q709 179 618 209Z" fill="url(#rhLeather)" stroke="#62635c"/>
 <path d="M49 176Q108 145 166 163M615 159Q752 142 923 179" class="stitch"/>
 <path d="M0 259Q47 211 93 243L123 342 105 520H0Z" fill="url(#rhCarbon)"/><path d="M23 278l64-19 18 46-65 22Z" fill="#0c1115" stroke="#646c70"/>
 ${c('doorAllBtn','Dihedral doors',`<path d="M37 285l44-11 3 8-43 15Z" fill="url(#rhMetal)"/>`)}
 <path d="M870 290Q945 238 1000 265V520H899Z" fill="url(#rhLeather)"/><path d="M903 326l73-29" class="edge"/>
 <path d="M699 387Q759 346 820 369L879 520H650Z" fill="url(#rhCarbon)" stroke="#444d53"/><path d="M718 398Q754 368 801 386L835 505H689Z" fill="url(#rhLeather)" stroke="#907653"/>
 <path d="M128 405Q170 378 206 398L266 520H75Z" fill="url(#rhLeather)" stroke="#967857"/>
 <path d="M167 186Q173 149 224 148H398Q440 150 451 181L434 245 173 243Z" fill="#070a0d" stroke="#788188" stroke-width="2"/>
 <path d="M174 183l58-22v72l-56 2ZM239 158h144v80H239ZM390 161l51 20-11 53h-40Z" fill="url(#rhScreen)" stroke="#46515a"/>
 ${t(197,181,'WATER',6,'#9aacb7')}${t(197,199,'88°C',11,'#dbe6ea','id="rhWater"')}${t(193,218,'BOOST',6,'#9aacb7')}${t(195,230,'0.0',9,'#dbe6ea','id="rhBoost"')}
 <path d="M249 201Q310 128 373 201" fill="none" stroke="#dd8c2f" stroke-width="3"/>
 ${Array.from({length:10},(_,i)=>t(251+i*13.2,188-Math.sin(i/9*Math.PI)*22,i,6,'#e4c193','text-anchor="middle"')).join('')}
 ${t(308,209,'N',29,'#f2e9dd','id="cabGearArt" text-anchor="middle"')}${t(309,231,'0',16,'#edf2f2','id="cabSpeedArt" text-anchor="middle"')}${t(336,231,'km/h',7,'#849eab')}
 ${t(396,184,'RPM',6,'#a9b7bf')}${t(411,199,'0',12,'#eae5da','id="cabRpmArt" text-anchor="middle"')}${t(412,222,'SPORT',7,'#f2a759','id="rhMode" text-anchor="middle"')}
 ${vent(119,206,26,29)}${vent(476,191,24,27)}${vent(936,188,24,26)}
 <path d="M513 169Q540 151 563 185L640 438Q648 462 631 492L539 467 507 223Z" fill="url(#rhCarbon)" stroke="#788188" stroke-width="2.5"/>
 ${dial(538,201,16,'START','startSwitchBtn')}
 <path d="M523 234L564 228 594 353 540 366Z" fill="url(#rhScreen)" stroke="#899298"/>
 ${t(553,254,'IRIS',9,'#ecf0f0','text-anchor="middle"')}
 ${b(533,267,45,25,'MEDIA','audioBtn','#dce4e7',7)}${b(539,298,46,25,'A/C','coolBtn','#dce4e7',8)}${b(546,330,44,24,'LIGHT','ambientBtn','#dce4e7',7)}
 ${dial(572,388,21,'IRIS','audioBtn')}${dial(559,442,18,'H','modeBtn')}${dial(608,434,18,'P','modeBtn')}
 ${t(558,474,'HANDLING',6,'#b7c1c5','text-anchor="middle"')}${t(613,465,'POWERTRAIN',6,'#b7c1c5','text-anchor="middle"')}
 ${b(645,457,28,25,'N','__neutral')}${b(679,457,28,25,'R','__reverse')}
 <path d="M166 289l40 6-2 10-38-7Z" fill="#1e2c35" stroke="#97a4ad"/>
 ${c('lightsBtn','Headlamp stalk',`<rect x="144" y="282" width="28" height="20" rx="5" fill="#1e2c35" stroke="#97a4ad"/>${t(158,296,'☼',10,'#b5c3ce','text-anchor="middle"')}`)}
 ${paddles(312,327,127)}
 <g id="cabinWheelG" transform="translate(312 327)">
 <circle r="116" fill="none" stroke="#07090b" stroke-width="29"/><circle r="116" fill="none" stroke="url(#rhLeather)" stroke-width="22"/>
 <path d="M-98 61Q0 160 98 61" fill="none" stroke="url(#rhCarbon)" stroke-width="23"/>
 <path d="M-105-12L-44-29 43-29 108-18 113 4 42 21 23 99H-23L-42 21-113 4Z" fill="url(#rhCarbon)" stroke="#7e858a"/>
 <circle r="51" fill="url(#rhLeather)"/><circle r="26" fill="#11191d" stroke="url(#rhMetal)" stroke-width="2"/>
 <path d="M-18 8Q-5-15 19-11Q12 0 2 3Q6-3 9-7Q-5-5-18 8" fill="#dce3e5"/>
 ${c('velocityBtn','DRS',`<ellipse cx="-85" cy="-8" rx="16" ry="11" fill="#226cbe" stroke="#8799a2"/>${t(-85,-5,'DRS',7,'white','text-anchor="middle"')}`)}
 ${a('ipas','IPAS hybrid power readout',`<ellipse cx="85" cy="-8" rx="16" ry="11" fill="#be2436" stroke="#ce818d"/>${t(85,-5,'IPAS',7,'white','text-anchor="middle"')}`)}
 ${c('hornBtn','Horn',`<circle r="31" fill="transparent"/>`)}
 <path d="M-110-6Q-111 58-58 90M110-6Q111 58 58 90" class="stitch" stroke="#bd895e"/>
 </g>
 ${t(760,263,'McLaren',18,'#b3bdc1','font-style="italic"')}${t(848,288,'P1',20,'#d4813a','font-style="italic"')}
 ${t(734,494,'MONOCAGE · ALCANTARA',9,'#7e8c94','letter-spacing="1.6"')}
 `+endCabin;}

export function f80Cabin(){return startCabin('Ferrari F80 • asymmetric 1+ cabin, flat-top wheel, physical controls and gated selector')+`
 <path d="M31 173L127 142 181 151 211 120 432 119 472 171 531 173 591 207 934 167 982 240 951 326 614 343 540 315 414 440 108 426Z" fill="url(#rhCarbon)" stroke="#58616a"/>
 <path d="M449 139L679 158 780 193 579 203 504 180Z" fill="url(#rhLeather)"/><path d="M500 188L583 218 912 201" fill="none" stroke="#a7adb0" stroke-width="2"/>
 <path d="M0 204L75 197 123 301 108 510H0Z" fill="url(#rhCarbon)"/>
 <path d="M0 272L79 258 96 339 0 362Z" fill="#921923" stroke="#d14546"/>
 ${c('doorAllBtn','Butterfly doors',`<path d="M29 241l42-13 9 19-46 16Z" fill="url(#rhMetal)"/>`)}
 <path d="M885 279L950 245 1000 260V520H882Z" fill="url(#rhCarbon)"/><path d="M893 383l101-35" class="edge"/>
 <path d="M690 349Q741 324 811 345L864 489 637 510Z" fill="#0c1014" stroke="#343e46"/><path d="M720 370l73-8 34 95-139 12Z" fill="#171e24"/>
 <path d="M104 433Q159 391 213 416L266 520H66Z" fill="#9e1c25" stroke="#e94a4a"/><path d="M159 429L190 422 232 520H196Z" fill="#ce2e32"/>
 <path d="M190 159L425 153 448 169 438 235 180 237Z" fill="#04070b" stroke="#566770" stroke-width="2"/>
 <path d="M196 168L421 162 436 175 427 227H190Z" fill="url(#rhScreen)"/>
 ${revSegments(205,180,208,30,'#e2e6e7')}
 ${t(273,209,'0',23,'#e8eff3','id="cabSpeedArt" text-anchor="middle"')}${t(273,223,'km/h',7,'#9bb2bf','text-anchor="middle"')}${t(325,213,'N',28,'#dce7ed','id="cabGearArt" text-anchor="middle"')}
 ${t(380,202,'0',10,'#d9e6ec','id="cabRpmArt" text-anchor="middle"')}${t(380,218,'RACE',7,'#efd45b','id="rhMode" text-anchor="middle"')}
 <path d="M92 182L151 158 174 170 144 247 95 260 76 237Z" fill="#090e12" stroke="url(#rhMetal)" stroke-width="2"/>
 ${Array.from({length:5},(_,i)=>p(`M${89-i*2} ${205+i*9}l${66-i*5}-${21-i*2}`,'none','stroke="#556069" stroke-width="2"')).join('')}
 <path d="M451 165L483 177 508 231 473 230 451 207Z" fill="#070d12" stroke="#8b989f"/>
 ${Array.from({length:4},(_,i)=>p(`M458 ${179+i*10}l${24+i*3} ${8-i}`,'none','stroke="#556069" stroke-width="2"')).join('')}
 <path d="M908 176L938 181 967 226 924 233 901 205Z" fill="#080e12" stroke="#717f87"/>
 <path d="M914 192l34 10m-32 3 39 10m-35 3 42 8" stroke="#556069" fill="none"/>
 <path d="M487 253L547 240 664 503 548 519 466 286Z" fill="url(#rhCarbon)" stroke="url(#rhMetal)" stroke-width="3"/>
 <path d="M493 263L539 253 576 333 519 345Z" fill="url(#rhMetal)"/>
 <path d="M502 273L536 268 559 321 519 331Z" fill="#050a0f"/>
 ${b(510,290,39,25,'A/C','coolBtn','#d2e2ee',8)}
 <path d="M534 357L583 346 619 421 566 437Z" fill="url(#rhMetal)"/>
 <path d="M548 370l44-10m-35-1 21 57m-10-60 22 57m-10-60 22 57" stroke="#12191e" stroke-width="5"/>
 ${b(553,377,18,27,'R','__reverse','#18232a',8)}${b(575,370,18,27,'N','__neutral','#18232a',8)}${c('upPaddle','Select drive / upshift',`<path d="M588 365l11-3 12 27-11 3Z" fill="#7b858c"/>${t(599,383,'D',8,'#101b21','text-anchor="middle"')}`)}
 <rect x="592" y="453" width="32" height="32" transform="rotate(-16 608 469)" fill="#ead42d"/>${t(608,474,'F80',11,'#17232b','text-anchor="middle" font-weight="bold"')}
 ${paddles(313,328,127)}
 <g id="cabinWheelG" transform="translate(313 328)">
 <path d="M-72-105H72Q99-102 111-65L119 15Q114 68 79 95H-79Q-114 68-119 15L-111-65Q-99-102-72-105Z" fill="none" stroke="#05080a" stroke-width="29"/>
 <path d="M-72-105H72Q99-102 111-65L119 15Q114 68 79 95H-79Q-114 68-119 15L-111-65Q-99-102-72-105Z" fill="none" stroke="url(#rhCarbon)" stroke-width="22"/>
 <path d="M-111-53L-118 13Q-113 55-93 77M111-53L118 13Q113 55 93 77" fill="none" stroke="url(#rhLeather)" stroke-width="27"/>
 <path d="M-109-12L-45-28 45-28 109-12 101 40 45 43 19 79H-19L-45 43-101 40Z" fill="url(#rhCarbon)" stroke="#484f55"/>
 <ellipse rx="56" ry="45" fill="url(#rhLeather)"/><circle r="25" fill="#f3d729" stroke="#11181d" stroke-width="3"/>
 <path d="M-3 16l3-10-8-6 2-12 5 5 5-6-3-7 6 4 2 8-7 4 3 11-3 8m-4-8-9 1m16-5 6 9" fill="none" stroke="#151d1e" stroke-width="3" stroke-linecap="round"/>
 ${b(-106,-9,40,20,'LIGHT','lightsBtn','#cdd8dd',6)}${b(-104,16,40,19,'AUDIO','audioBtn','#cdd8dd',6)}
 ${b(64,-9,40,20,'HUD','dataBtn','#cdd8dd',7)}${b(64,16,40,19,'LIFT','liftBtn','#cdd8dd',7)}
 ${dial(66,55,17,'MODE','modeBtn')}${c('startSwitchBtn','Engine start / stop',`<rect x="-21" y="62" width="42" height="20" rx="4" fill="#151d22"/>${t(0,70,'ENGINE',5,'#f3403a','text-anchor="middle"')}${t(0,77,'START STOP',5,'#f3403a','text-anchor="middle"')}`)}
 ${c('hornBtn','Horn',`<circle r="27" fill="transparent"/>`)}
 <g id="rhShiftLights">${Array.from({length:9},(_,i)=>`<rect x="${-39+i*9}" y="-110" width="6" height="5" rx="1" fill="#34332a"/>`).join('')}</g>
 </g>
 ${t(831,248,'F80',14,'#bbc4c9','font-style="italic"')}
 `+endCabin;}

export function alfaCabin(){return startCabin('Alfa Romeo 33 Stradale • Tributo cabin, telescopic instruments, button-free wheel and aircraft switches')+`
 <path d="M35 177Q166 133 245 148L342 148Q590 130 965 178L979 296Q816 350 491 305L413 436 103 417 24 289Z" fill="url(#rhLeather)" stroke="#57554f"/>
 <path d="M47 176Q160 148 245 162M363 160Q655 147 956 188" class="stitch" stroke="#bc804f"/>
 <path d="M96 213Q206 180 453 216L887 204 941 238Q803 287 517 270L440 295 131 298Z" fill="url(#rhMetal)"/>
 <path d="M373 197L911 190 933 205 482 217Z" fill="url(#rhCarbon)"/>
 <path d="M397 200L896 193M421 205L910 198" stroke="#101518" stroke-width="4"/>
 <path d="M0 208Q56 187 112 228L129 352 103 520H0Z" fill="url(#rhLeather)"/><path d="M13 233Q66 214 97 258" fill="none" stroke="#b88859" stroke-width="3"/>
 ${Array.from({length:12},(_,i)=>p(`M${10+i*7} ${285+i*4}q-3 51 25 84`,'none','stroke="#765a44" stroke-width="1.4"')).join('')}
 ${c('doorAllBtn','Open / close butterfly doors',`<ellipse cx="63" cy="266" rx="16" ry="22" fill="url(#rhMetal)"/><ellipse cx="63" cy="266" rx="12" ry="18" fill="#272c2b"/>${t(63,269,'APRI',6,'#d0c7b3','text-anchor="middle"')}`)}
 <path d="M871 303Q930 239 1000 258V520H900Z" fill="url(#rhTan)"/><path d="M900 335l74-39" class="stitch"/>
 <path d="M686 390Q745 341 815 374L888 520H645Z" fill="url(#rhTan)" stroke="#d7a36e"/>
 ${Array.from({length:8},(_,i)=>p(`M${699-i*3} ${413+i*13}q70-18 135-7`,'none','stroke="#593827" stroke-width="6"')).join('')}
 <path d="M105 423Q163 380 210 404L269 520H61Z" fill="url(#rhTan)" stroke="#c18e5c"/>
 <path d="M170 203Q170 132 231 128Q266 122 285 152Q310 119 352 129Q412 139 405 210L378 247 201 250Z" fill="#151b20" stroke="#757c7a" stroke-width="3"/>
 <path d="M197 179Q221 139 254 173H325Q353 139 382 179L388 226 192 226Z" fill="url(#rhScreen)"/>
 <circle cx="234" cy="190" r="44" fill="#c3c5be" stroke="url(#rhMetal)" stroke-width="5"/><circle cx="234" cy="190" r="30" fill="#10191e"/>${ticks(234,190,40,350,28,-135,135,'#151b20')}${needle('cabSpeedNeedle',234,190,26,350)}
 <circle cx="349" cy="190" r="44" fill="#c3c5be" stroke="url(#rhMetal)" stroke-width="5"/><circle cx="349" cy="190" r="30" fill="#10191e"/>${ticks(349,190,40,8,32,-135,135,'#151b20')}${needle('cabRevNeedle',349,190,26)}
 ${t(293,191,'0',22,'#eeeae0','id="cabSpeedArt" text-anchor="middle"')}${t(293,206,'km/h',7,'#899b9f','text-anchor="middle"')}${t(293,222,'N',13,'#dfdfd6','id="cabGearArt" text-anchor="middle"')}
 ${t(350,218,'0',7,'#c8d4d8','id="cabRpmArt" text-anchor="middle"')}
 <path d="M486 294L641 283 657 354 497 372Z" fill="url(#rhScreen)" stroke="#646f75" stroke-width="2"/>
 ${t(510,309,'MyCar',10,'#d2cec2')}${t(612,307,'STRADA',8,'#d2cec2','id="rhMode" text-anchor="middle"')}
 ${b(503,321,43,29,'A/C','coolBtn','#e4dfd2',8)}${b(550,316,43,29,'AUDIO','audioBtn','#e4dfd2',7)}${b(597,311,43,29,'LIFT','liftBtn','#e4dfd2',8)}
 <path d="M515 387L644 365 698 517H526Z" fill="url(#rhMetal)" stroke="#424c52" stroke-width="2"/>
 <path d="M638 365L682 358 737 506 695 511Z" fill="url(#rhPerforation)"/>
 ${dial(548,408,18,'PISTA','pistaBtn')}${dial(557,452,16,'MODE','modeBtn')}
 ${[[598,393,'START','startSwitchBtn'],[632,384,'LIFT','liftBtn'],[610,434,'ESC','escBtn'],[643,425,'LAMP','ambientBtn']].map(([x,y,label,id])=>c(id,label,`<circle cx="${x}" cy="${y}" r="9" fill="#3b4144"/><path d="M${x} ${y}l-5-13" stroke="url(#rhMetal)" stroke-width="7" stroke-linecap="round"/>${t(x,y+19,label,6,'#242f35','text-anchor="middle"')}`)).join('')}
 <path d="M583 478l70-12 8 35-74 9Z" fill="#11191d"/><path d="M597 475l8 29m9-32 8 29m9-32 8 29" stroke="url(#rhMetal)" stroke-width="10"/>
 ${b(588,478,20,22,'R','__reverse','#dce2de',7)}${b(613,474,20,22,'N','__neutral','#dce2de',7)}${c('upPaddle','Drive / upshift',`<path d="M638 471l13-2 6 22-13 2Z" fill="transparent"/>${t(646,486,'D',8,'#e0e5df','text-anchor="middle"')}`)}
 <path d="M596 27L698 30 715 92 599 86Z" fill="url(#rhMetal)" stroke="#68716d"/>
 ${dial(619,58,12,'☼','ambientBtn')}${dial(650,60,12,'♪','audioBtn')}${dial(682,62,12,'AC','coolBtn')}
 <path d="M148 290l40 5-2 10-38-7Z" fill="#283335" stroke="#8eaaa8"/>
 ${c('lightsBtn','Headlamp stalk',`<rect x="126" y="283" width="28" height="20" rx="5" fill="#283335" stroke="#8eaaa8"/>${t(140,297,'☼',10,'#bfcbc4','text-anchor="middle"')}`)}
 ${paddles(290,330,122)}
 <g id="cabinWheelG" transform="translate(290 330)">
 <circle r="118" fill="none" stroke="#080b0c" stroke-width="26"/><circle r="118" fill="none" stroke="url(#rhLeather)" stroke-width="20"/>
 <path d="M-89-74Q-139-3-87 79M89-74Q139-3 87 79" fill="none" stroke="url(#rhTan)" stroke-width="23"/>
 <path d="M-116-15H116V12L34 23 20 110H-20L-34 23-116 12Z" fill="url(#rhMetal)" stroke="#656e70"/>
 <circle cy="58" r="10" fill="#090e12" stroke="#bec5c4"/><circle cy="88" r="8" fill="#090e12" stroke="#bec5c4"/>
 <circle r="47" fill="url(#rhLeather)" stroke="#777b75"/><circle r="27" fill="#30383a" stroke="#adb5b2"/>
 <path d="M-6-22v43M-22-6h15M-16-20v38" stroke="#b8bfba" stroke-width="4"/>
 <path d="M8-19q18 0 9 9L6-3q-9 9 7 10q17 1 0 13" fill="none" stroke="#b7bfb9" stroke-width="5"/>
 ${c('hornBtn','Horn',`<circle r="36" fill="transparent"/>`)}
 <path d="M0-130v22" stroke="#c4c6bd" stroke-width="4"/>
 </g>
 ${t(750,242,'33 Stradale',21,'#b4b4a8','font-family="Georgia,serif" font-style="italic"')}
 `+endCabin;}

export const CABINS={bugatti:bugattiCabin,koenigsegg:jeskoCabin,p1:p1Cabin,ferrari:f80Cabin,alfa33:alfaCabin};
