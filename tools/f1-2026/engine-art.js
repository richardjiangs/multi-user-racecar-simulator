/* Public-specification architecture cutaways. Internal plumbing is schematic;
   supplier-specific housings and installation are not claimed to be CAD surveys. */
(function(){
 const a=window.__Track2App,p=a.f1ArtProfile,T=a.f1ArtText,B=a.f1ArtBolt,D=a.f1ArtDefs;if(!p)return;
 const suppliers={
  'Ferrari 067/6':{bank:'#8c3338',plenum:'M303 229L345 200L566 205L636 244L615 292L333 309L293 276Z',lid:'FERRARI',turbo:[696,271],inverter:[210,331],rake:7},
  'Mercedes-AMG M17':{bank:'#748183',plenum:'M290 245L339 216L579 200L630 242L617 294L342 303L291 280Z',lid:'AMG',turbo:[677,264],inverter:[230,345],rake:0},
  'Honda RA626H':{bank:'#626b76',plenum:'M318 223L348 197L541 197L612 222L629 274L598 305L329 302L301 270Z',lid:'HONDA',turbo:[704,268],inverter:[261,353],rake:-4},
  'Red Bull Ford DM01':{bank:'#3c506c',plenum:'M306 236L366 201L555 205L627 243L623 282L585 303L330 300Z',lid:'FORD / RED BULL',turbo:[689,274],inverter:[231,346],rake:5},
  'Audi AFR 26':{bank:'#9dabae',plenum:'M305 224L350 198L573 198L633 245L623 289L578 307L329 302L296 275Z',lid:'AUDI',turbo:[699,267],inverter:[243,354],rake:-2}
 },u=suppliers[p.pu],tx=u.turbo[0],ty=u.turbo[1];
 function engineSvg(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 530" role="img" aria-label="${p.pu}: illustrated V6 banks, single turbo, MGU-K, energy store, heat exchangers and gearbox">${D('fu')}
 <rect width="1000" height="530" fill="#08121c"/><path d="M94 223L231 122L397 95L662 100L846 159L944 265L879 411L650 450L374 443L187 398Z" fill="url(#fuweave)" stroke="#687a84" stroke-width="2"/>
 <!-- Two heat exchanger cores, each with individual fins, tanks and hose clamps. -->
 ${[-1,1].map(side=>`<g transform="translate(500 263) scale(1 ${side})"><path d="M-236 76L233 63L271 119L-262 134Z" fill="#263c49" stroke="#b4bcc1"/>${Array.from({length:47},(_,i)=>`<path d="M${-250+i*11} 129L${-232+i*10} 76" stroke="${i%2?'#7c8a91':'#374751'}" stroke-width="2"/>`).join('')}<path d="M-235 75L232 63M-261 135L271 119" stroke="#97a5aa" stroke-width="4"/><path d="M-253 130Q-301 104 -263 58L-207 42M265 119Q294 75 232 39" fill="none" stroke="#1d333e" stroke-width="11"/><path d="M-274 100l-10 -3M268 82l8 -7" stroke="#bbc3bb" stroke-width="4"/></g>`).join('')}
 <path d="M639 222L722 212L805 231L837 262L814 306L725 324L642 300Z" fill="url(#fuweave)" stroke="#a3b2b8"/>
 ${Array.from({length:9},(_,i)=>`<path d="M${664+i*16} 226L${674+i*16} 310" stroke="#617887" stroke-width="2"/>`).join('')}
 <path d="M776 236L931 189M791 293L942 356M721 223L875 153M737 310L881 404" stroke="#111e28" stroke-width="12"/><path d="M776 234L931 187M791 291L942 354M721 221L875 151M737 308L881 402" stroke="#8c9ba2" stroke-width="1.5"/>
 <!-- Six separate exhaust primaries, three per bank, merge at a single turbo. -->
 ${[0,1,2].map(i=>{const x=364+i*85;return `<path d="M${x} 188C${x+9} ${137-i*10} ${tx-20} ${108+i*10} ${tx} ${ty-47}M${x} 343C${x+19} ${408+i*8} ${tx-8} ${421-i*10} ${tx} ${ty+46}" fill="none" stroke="#544342" stroke-width="14"/><path d="M${x} 188C${x+9} ${137-i*10} ${tx-20} ${108+i*10} ${tx} ${ty-47}M${x} 343C${x+19} ${408+i*8} ${tx-8} ${421-i*10} ${tx} ${ty+46}" fill="none" stroke="${['#b4a08e','#8f8fa5','#c2b69d'][i]}" stroke-width="8"/>`;}).join('')}
 <path d="M331 181L594 170L643 216L348 245Z M348 296L643 313L594 358L331 336Z" fill="url(#fumetal)" stroke="#b4c0c2"/>
 <path d="M346 190L591 181L623 210L352 233Z M352 308L623 324L591 348L346 328Z" fill="${u.bank}" stroke="#8e9ea7"/>
 ${[0,1,2].map(i=>{const x=382+i*84;return `<ellipse cx="${x}" cy="${211-i*4}" rx="20" ry="10" fill="#142430" stroke="#bbc3c4"/><ellipse cx="${x}" cy="${322+i*4}" rx="20" ry="10" fill="#142430" stroke="#bbc3c4"/><path d="M${x-8} ${211-i*4}h16M${x-8} ${322+i*4}h16" stroke="#a3a8a2" stroke-width="3"/>${B(x+30,199-i*4,2)}${B(x+30,334+i*4,2)}`;}).join('')}
 <path d="${u.plenum}" fill="url(#fuweave)" stroke="#879ea9" stroke-width="2"/>
 <path d="M337 239Q460 215 588 236M333 284Q463 301 604 279" stroke="#8aa0aa" stroke-opacity=".5" fill="none"/>
 ${T(463,263,u.lid,u.lid.length>8?17:27,'#cbd6d7','text-anchor="middle" font-style="italic" font-weight="bold"')}${T(463,281,p.pu,8,p.accent,'text-anchor="middle" letter-spacing="1.5"')}
 <g transform="translate(${tx} ${ty})"><circle r="44" fill="#82765f" stroke="#c0bba6" stroke-width="2"/><circle r="31" fill="url(#fumetal)" stroke="#d3cbbb"/><circle r="23" fill="#11202b"/><g id="f1TurboRotor">${Array.from({length:11},(_,i)=>`<path d="M1 -6L-7 -19L3 -26L8 -14Z" transform="rotate(${i*360/11})" fill="#8f9e9e"/>`).join('')}</g><circle r="6" fill="#d0c6a9"/></g>
 <path d="M${tx+38} ${ty-8}L833 257L873 242L878 260L835 276L${tx+35} ${ty+13}Z" fill="url(#fumetal)" stroke="#9e9786"/><ellipse cx="876" cy="251" rx="4" ry="9" fill="#030a11" stroke="#c5c0aa"/>
 <g transform="translate(${u.inverter[0]} ${u.inverter[1]}) rotate(${u.rake})"><path d="M13 -20L76 -29L101 -5L88 36L31 46L6 18Z" fill="url(#fumetal)" stroke="#9db0b6"/><ellipse cx="49" cy="10" rx="22" ry="27" fill="#254454" stroke="#9cbdc4"/>${Array.from({length:11},(_,i)=>`<path d="M${28+i*4} -9V27" stroke="#537989"/>`).join('')}</g>
 <path d="M${u.inverter[0]+12} ${u.inverter[1]}L218 325L187 291" fill="none" stroke="#f29735" stroke-width="7"/>
 <path d="M111 236L191 213L245 240L226 321L144 339L105 302Z" fill="url(#fuweave)" stroke="#90a3ab"/><path d="M128 246L188 230L222 248L206 311L151 324L124 298Z" fill="#273e4a" stroke="#6e8994"/>
 ${T(150,267,'HV',19,'#e0c467','font-weight="bold"')}${T(134,288,'ENERGY STORE',7)}${T(135,302,'AHEAD OF PU',6,'#91a3ab')}
 <path d="M187 217Q274 170 329 176L592 163L645 206M175 339Q202 404 288 411L594 422L650 355" fill="none" stroke="#1b2b36" stroke-width="8"/><path d="M187 217Q274 170 329 176L592 163L645 206M175 339Q202 404 288 411L594 422L650 355" fill="none" stroke="#7b8a94" stroke-width="2" stroke-dasharray="2 5"/>
 ${[[227,179],[328,145],[603,131],[725,178],[780,334],[528,412],[311,417],[142,352]].map(([x,y])=>B(x,y,3)).join('')}
 <g fill="none" stroke="#627f91"><path d="M33 118H166L210 228M353 62H424V180M816 84H759L710 225M961 421H858L791 311M31 443H225L284 385"/></g>
 ${T(32,104,'ENERGY STORE',10)}${T(353,49,'1.6 L V6',11)}${T(807,72,'SINGLE TURBO',10)}${T(808,438,'8-SPEED GEARBOX',10)}${T(31,465,'MGU-K',11,p.accent)}
 ${T(31,491,p.pu+' · architecture illustration',10,'#b4c5ce')}${T(31,507,'Public specifications · internal plumbing is schematic',8,'#72909f')}
 </svg>`;}
 a.f1EngineSvg=engineSvg;
})();
