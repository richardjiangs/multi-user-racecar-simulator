/* Orthographic LEFT SIDE elevations. Both axles are on one ground plane; no
 * foreshortening, visible grille plane, or three-quarter-view wheel ellipses.
 * Each body's curves, glazing, seams and trim are independently authored. */
(function(root){
 function exterior(key){
  const tesla=key==='tesla',id=tesla?'plaidSide':'supraSide';
  const defs=`<defs>
   <linearGradient id="${id}paint" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${tesla?'#f6f9fb':'#f77c5e'}"/><stop offset=".35" stop-color="${tesla?'#b9c9d5':'#d93f2e'}"/><stop offset=".52" stop-color="${tesla?'#edf2f6':'#f35a3f'}"/><stop offset=".64" stop-color="${tesla?'#d8e3ea':'#dc382a'}"/><stop offset=".82" stop-color="${tesla?'#9eb2c0':'#941e20'}"/><stop offset="1" stop-color="${tesla?'#e8eff3':'#d04230'}"/></linearGradient>
   <linearGradient id="${id}glass" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="#8da7b6"/><stop offset=".22" stop-color="#506a7b"/><stop offset=".48" stop-color="#253c4d"/><stop offset="1" stop-color="#111f2c"/></linearGradient>
   <linearGradient id="${id}chrome" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#788b98"/><stop offset=".23" stop-color="#f0f5f7"/><stop offset=".43" stop-color="#7f939f"/><stop offset=".56" stop-color="#e0e9ed"/><stop offset="1" stop-color="#506672"/></linearGradient>
   <radialGradient id="${id}rubber" cx=".42" cy=".36"><stop offset=".68" stop-color="#1d252d"/><stop offset=".82" stop-color="#3c454d"/><stop offset=".89" stop-color="#1b2229"/><stop offset=".97" stop-color="#10171e"/><stop offset="1" stop-color="#2c363f"/></radialGradient>
   <radialGradient id="${id}rim"><stop stop-color="#84949f"/><stop offset=".52" stop-color="#d6e0e5"/><stop offset=".87" stop-color="#647681"/><stop offset=".95" stop-color="#e7f0f4"/><stop offset="1" stop-color="#687d8c"/></radialGradient>
   <linearGradient id="${id}lamp" x2="0" y2="1"><stop stop-color="#a2c2d5"/><stop offset=".3" stop-color="#293c50"/><stop offset=".64" stop-color="#131f2c"/><stop offset="1" stop-color="#afc4d0"/></linearGradient>
   <linearGradient id="${id}sill" x2="0" y2="1"><stop stop-color="#4a5e6b"/><stop offset=".22" stop-color="#1a2a35"/><stop offset="1" stop-color="#090f17"/></linearGradient>
   <pattern id="${id}carbon" width="5" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h2v2H0ZM2 2h3v2H2Z" fill="#56616b" fill-opacity=".18"/></pattern>
   <pattern id="${id}grille" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0l2 2-2 2M2 0l2 2-2 2" stroke="#677681" stroke-width=".55" fill="none"/></pattern>
  </defs>`;
  function wheel(cx,cy,r){
   const R=r*(tesla?.775:.68),s=R/50;
   return `<g class="profile-wheel" transform="translate(${cx} ${cy})">
    <circle r="${r}" fill="url(#${id}rubber)"/><circle r="${r-3}" fill="none" stroke="#53606b" stroke-width=".8"/><circle r="${r-6}" fill="none" stroke="#171f27" stroke-width=".8"/>
    ${Array.from({length:48},(_,i)=>`<path transform="rotate(${i*7.5})" d="M-1 ${-r+1}l2 2" stroke="#64717b" stroke-opacity=".22" stroke-width=".65"/>`).join('')}
    <text x="0" y="${-r+11}" text-anchor="middle" font-family="Arial" font-size="4.3" letter-spacing="1.2" fill="#89959e" opacity=".65">${tesla?'MICHELIN PILOT SPORT':'BRIDGESTONE POTENZA'}</text>
    <text x="0" y="${r-9}" text-anchor="middle" font-family="Arial" font-size="3.8" letter-spacing=".7" fill="#71808a">${tesla?'21  ·  ZR':'17  ·  ZR'}</text>
    <circle r="${R+1.5}" fill="url(#${id}rim)"/><circle r="${R-2}" fill="#0b1721"/><circle r="${R*.80}" fill="#737e84"/><circle r="${R*.71}" fill="#525e66" stroke="#9ca7ac" stroke-width=".5"/><circle r="${R*.39}" fill="#293945"/>
    ${Array.from({length:36},(_,i)=>`<circle cx="${Math.cos(i*Math.PI/18)*R*.68}" cy="${Math.sin(i*Math.PI/18)*R*.68}" r=".65" fill="#293944"/>`).join('')}
    <path d="M${R*.38} ${-R*.67}Q${R*.80} ${-R*.48} ${R*.76} ${R*.09}L${R*.54} ${R*.23}L${R*.35} ${-R*.07}Z" fill="${tesla?'#bd3438':'#303e47'}" stroke="${tesla?'#f46c5c':'#758792'}" stroke-width=".65"/>
    <text x="${R*.62}" y="${-R*.19}" text-anchor="middle" transform="rotate(76 ${R*.62} ${-R*.19})" fill="#d7e0e4" font-family="Arial" font-size="3.7">${tesla?'TESLA':'TOYOTA'}</text>
    <g class="wSpin" style="transform:rotate(var(--wheel-rot,0deg));transform-origin:0px 0px"><g transform="scale(${s})">
     ${Array.from({length:tesla?10:5},(_,i)=>tesla?`<g transform="rotate(${i*36})"><path d="M-5-8L-10-43Q-8-48-3-48L2-19 10-45 14-43 7-10Z" fill="#263a47" stroke="#8598a4" stroke-width=".7"/><path d="M-7-12L-8-43M5-14L11-43" stroke="#b1c0ca" stroke-opacity=".6" stroke-width=".5"/></g>`:`<g transform="rotate(${i*72})"><path d="M-8-12C-9-21-13-29-14-36Q-16-42-10-45Q0-49 10-45Q15-42 12-36L8-12Z" fill="url(#${id}chrome)" stroke="#718793" stroke-width=".8"/><path d="M-6-17L-10-37Q-10-44 4-43L3-17Z" fill="#c7d2d8" fill-opacity=".44"/></g>`).join('')}
     <circle r="${tesla?12:17}" fill="url(#${id}rim)" stroke="#738996" stroke-width="1"/>
     ${Array.from({length:5},(_,i)=>`<circle cx="${Math.sin(i*Math.PI*.4)*8.6}" cy="${-Math.cos(i*Math.PI*.4)*8.6}" r="1.8" fill="#253642" stroke="#bccbd3" stroke-width=".5"/>`).join('')}
     <circle r="5.5" fill="${tesla?'#2c414e':'#bdcdd5'}" stroke="#758b97" stroke-width=".7"/>
     ${tesla?'<path d="M-3-2q3-2 6 0l-2 1-1 4-1-4Z" fill="#cad8df"/>':'<g fill="none" stroke="#546d7a" stroke-width=".5"><ellipse rx="3.7" ry="2.6"/><ellipse rx="1.2" ry="2.6"/><ellipse cy="-1" rx="2.9" ry="1.2"/></g>'}
    </g></g><circle r="${R-.5}" stroke="#cad7df" stroke-opacity=".6" fill="none" stroke-width=".8"/>
   </g>`;
  }
  const teslaBody=`
   <!-- 2,960 mm axle spacing in a 4,970 mm body; roof height 1,445 mm. -->
   <g id="bcBody">
    <path d="M65 249Q64 229 91 223L306 199Q341 195 362 174L425 132C470 98 520 86 571 89C660 89 710 127 803 184Q867 190 918 207Q938 214 945 241L943 289Q940 307 913 314L857 315C861 271 843 221 789 220C736 219 713 268 719 315L321 315C326 271 305 220 253 220C201 220 179 270 185 315L91 312Q68 307 66 290Z" fill="url(#plaidSidepaint)" stroke="#627b8c" stroke-width="1.25"/>
    <!-- Two reflective skins meet at the real shoulder and low rocker crease. -->
    <path d="M93 227Q222 203 324 207L785 197Q873 200 924 218" fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="1.6"/>
    <path d="M326 242Q515 257 714 242L707 279Q508 303 330 279Z" fill="#eaf1f5" fill-opacity=".19"/>
    <path d="M323 292Q532 305 717 292" fill="none" stroke="#627f91" stroke-opacity=".48" stroke-width="1.6"/>
    <path d="M95 280l77 5M867 284l68-7" stroke="#6e899b" stroke-opacity=".6" fill="none"/>
    <!-- Roof and glass form one long arch, with four doors and a liftback. -->
    <path d="M346 198L432 138C473 107 524 96 571 99C655 99 706 135 785 190Q743 200 695 204L353 206Z" fill="#111f2a" stroke="#a0b2bd" stroke-width="1"/>
    <path d="M363 197L440 145C472 122 513 109 554 108L555 198Z" fill="url(#plaidSideglass)" stroke="#4a6578"/>
    <path d="M568 108C610 107 648 117 677 138L726 181L703 197L569 198Z" fill="url(#plaidSideglass)" stroke="#456477"/>
    <path d="M688 144Q731 166 766 187Q742 192 718 195L733 182Z" fill="url(#plaidSideglass)"/>
    <path d="M557 106L556 202L570 202L568 106Z" fill="#0b1721"/><path d="M562 112v82" stroke="#718694" stroke-width=".75"/>
    <path d="M679 135L716 197" stroke="#0c1a25" stroke-width="5"/>
    <path d="M373 194L445 147C476 125 515 113 549 112" fill="none" stroke="#e2edf3" stroke-opacity=".3" stroke-width="1.3"/>
    <path d="M438 150Q481 118 540 113L547 128L399 183Z" fill="#c0d7e5" opacity=".09"/>
    <!-- Seats, headrests, dashboard top and yoke visible through the side glass. -->
    <g fill="#182c3b" stroke="#456071" stroke-width=".8"><path d="M465 194l7-36q0-9 10-8l14 2q7 2 5 11l-8 33Z"/><rect x="475" y="137" width="22" height="16" rx="5"/><path d="M648 194l-8-39q-2-8 8-8h13q8 0 10 9l9 38Z"/><rect x="638" y="135" width="25" height="15" rx="5"/></g>
    <path d="M367 195l38-7 19 8M413 191l-5-15 12-4 5 13" stroke="#172c3b" stroke-width="4" fill="none"/>
    <!-- A-pillar, beltline, two individual door shut lines and flush handles. -->
    <path d="M347 208L339 222L333 270Q335 296 345 309L550 309Q560 303 560 291L559 208Z" fill="none" stroke="#627e90" stroke-width="1"/>
    <path d="M566 208L708 205L734 214L723 232Q708 253 707 283L697 307L567 310Z" fill="none" stroke="#657f8e" stroke-width="1"/>
    <g id="doorArt"><path d="M347 208L559 208L558 291Q559 303 550 309L345 309Q335 296 333 270L339 222Z" fill="url(#plaidSidepaint)" stroke="#6b8291" stroke-width=".85"/>
    <path d="M346 215L550 215" stroke="#f8fbfc" stroke-opacity=".8" stroke-width="1.3"/><path d="M342 289Q447 303 551 291" stroke="#8b9eab" stroke-opacity=".55" fill="none"/>
    <path d="M506 220h32q4 2 0 5h-32q-4-2 0-5Z" fill="#485e6e" stroke="#dce7ec" stroke-width=".7"/><path d="M507 221h30" stroke="#afc2cd" stroke-width="1"/></g>
    <path d="M662 220h31q4 2 0 5h-31q-4-2 0-5Z" fill="#415c6e" stroke="#dce7ec" stroke-width=".7"/><path d="M663 221h28" stroke="#afc2cd" stroke-width="1"/>
    <path d="M347 201L329 186Q322 184 320 190L326 201Z" fill="#152a38"/><path d="M323 183Q343 180 354 188L355 197Q334 201 320 195Z" fill="url(#plaidSidepaint)" stroke="#506c7f"/><path d="M323 196l30-1" stroke="#112a3a" stroke-width="2.4"/><path d="M327 193h20" stroke="#e1f0f5" stroke-width=".8"/>
    <!-- Wheel-arch returns and black lower side blade follow the same ground line. -->
    <path d="M184 315C180 268 204 219 253 218C304 217 330 265 322 315M718 315C712 265 738 216 789 218C841 218 866 268 858 315" fill="none" stroke="#eff5f8" stroke-width="2.5"/>
    <path d="M189 315C186 267 209 225 253 224C300 224 323 266 317 315M723 315C717 268 741 224 789 223C835 223 859 269 853 315" fill="none" stroke="#3a5264" stroke-width="2.3"/>
    <path d="M320 312L719 312L719 321L320 321Z" fill="url(#plaidSidesill)"/><path d="M324 313h389" stroke="#93aebb" stroke-width="1"/>
    <!-- Lamp wraps and small bumper features visible in a side elevation. -->
    <path d="M75 231Q118 219 178 216L163 227L85 242Z" fill="url(#plaidSidelamp)" stroke="#506c80"/><path d="M82 234L165 219L170 218" stroke="#e2f6ff" stroke-width="2.1" fill="none"/><path d="M98 235l12-2 2-6-9 1Z" fill="#c5e0ed"/>
    <path d="M72 263l26-3-8 26-18 6Z" fill="#132834"/><path d="M74 266l18-3-7 20-11 5Z" fill="url(#plaidSidegrille)"/><path id="frontFlapArt" d="M68 299l29 9 86 3v7l-92-2-24-11Z" fill="#152733"/>
    <path d="M913 209l24 15 4 10-28-10-19-2-2-6Z" fill="#6f1728" stroke="#9a3540"/><path d="M915 214l20 12-23-5-15-2" stroke="#ee5360" stroke-width="1.9" fill="none"/>
    <path d="M899 220l17 3 2 17-20-1Z" fill="none" stroke="#6c8594" stroke-width=".8"/>
    <path d="M922 281l14-2v5l-14 3Z" fill="#be3445"/>
    <path d="M879 303l48-8 12-9-4 18-27 8h-51v-4Z" fill="#243d4e"/><path d="M894 310h31" stroke="#677d8b"/>
    <path id="rearWingArt" d="M836 190Q888 194 922 206L925 210Q883 201 838 196Z" fill="#172731"/><path d="M840 192Q890 195 921 207" fill="none" stroke="#81939d" stroke-width=".8"/>
    <path d="M838 190Q888 194 922 206L925 210Q883 201 838 196Z" fill="url(#plaidSidecarbon)"/>
    <path d="M885 235h8m-8 3h8" fill="none" stroke="#5e7686" stroke-width=".65"/>
    <circle cx="93" cy="253" r="2.2" fill="none" stroke="#7992a2"/><circle cx="926" cy="254" r="2.2" fill="none" stroke="#738e9e"/>
    <path d="M310 216l5 8-8 1 1-8Z" fill="#1c3648"/><path d="M307 222h5" stroke="#a2bbc9"/>
   </g>${wheel(253,292,66)}${wheel(789,292,66)}`;
  const supraBody=`
   <!-- A80 coupe: 2,550 mm wheelbase, high round cabin, long curved bonnet. -->
   <g id="bcBody"><path d="M81 257Q78 243 100 235L309 208Q337 202 365 176L430 142C462 121 504 113 550 116C588 117 620 133 653 155Q695 183 744 202Q804 202 882 214L911 228L915 289Q908 307 878 314L795 314C800 268 777 229 731 229C685 229 662 269 667 315L320 315C323 268 301 230 256 230C211 230 187 270 191 315L108 315Q86 312 83 297Z" fill="url(#supraSidepaint)" stroke="#7b2b2c" stroke-width="1.4"/>
    <path d="M103 239Q227 216 310 216L350 204" fill="none" stroke="#ffa180" stroke-width="1.5"/><path d="M114 245Q222 229 300 226" fill="none" stroke="#b32a28" stroke-width="1"/>
    <path d="M352 207L438 149C469 128 507 122 549 125C585 126 615 141 644 161Q668 179 695 199Q655 207 598 208Z" fill="#121e29" stroke="#c75a46" stroke-width="1.5"/>
    <path d="M371 198L445 155C475 135 510 129 550 132Q571 133 589 139L596 199Z" fill="url(#supraSideglass)" stroke="#526c7e" stroke-width="1"/>
    <path d="M605 145Q623 151 641 165L675 193Q677 198 669 200L611 200Z" fill="url(#supraSideglass)" stroke="#4b6376"/>
    <path d="M590 135L597 205L611 205L605 141Z" fill="#0d1b26"/><path d="M599 146l5 51" stroke="#687c8d" stroke-width=".7"/>
    <path d="M376 197L448 157C478 137 512 133 549 135Q570 136 584 140" stroke="#d0e6f1" stroke-opacity=".35" stroke-width="1.3" fill="none"/>
    <path d="M436 166Q479 132 548 135L576 144L390 190Z" fill="#c2d9e7" opacity=".08"/>
    <path d="M619 160L665 192L622 190Z" fill="#92a9ba" opacity=".08"/>
    <!-- Separate hatch surround and rear screen reflection, seen strictly edge-on. -->
    <path d="M655 156Q697 183 744 202L765 207L730 195Z" fill="#283744" stroke="#a64a3d" stroke-width=".8"/><path d="M662 160q40 27 79 42" stroke="#9bacb6" stroke-width=".7"/>
    <path d="M481 197l-1-28q0-10 9-9h11q7 2 8 9l2 29Z" fill="#263a47" stroke="#597180" stroke-width=".7"/><rect x="483" y="145" width="23" height="17" rx="6" fill="#2c414e" stroke="#687f8b" stroke-width=".7"/>
    <path d="M373 200l37-9 24 8M416 191l-4-13 11-4 5 14" fill="none" stroke="#1d3343" stroke-width="4"/>
    <!-- One long coupe door and the A80's rounded rear-quarter intake. -->
    <g id="doorArt"><path d="M356 210L588 211Q606 212 613 229L611 280Q607 302 592 311L327 311Q321 290 324 268L337 226Z" fill="url(#supraSidepaint)" stroke="#8c3430" stroke-width="1"/>
    <path d="M350 218L591 218" stroke="#ff9373" stroke-width="1.3"/><path d="M333 278Q460 294 607 274" fill="none" stroke="#ff946f" stroke-opacity=".25" stroke-width="1.3"/>
    <path d="M334 303Q467 309 590 301" fill="none" stroke="#a52d27" stroke-width="1"/>
    <path d="M548 224h36q7 3 2 9l-38 2q-6-5 0-11Z" fill="#7c2026" stroke="#ef7458" stroke-width=".8"/><path d="M551 227h30v3h-30Z" fill="#ba4a3c"/><circle cx="584" cy="228" r="1.7" fill="#d7c2b5"/></g>
    <path d="M619 272Q624 261 646 260L643 282Q629 287 619 284Z" fill="#15232f" stroke="#ec6c50" stroke-width="1.4"/><path d="M624 279Q630 268 641 267" stroke="#425663" stroke-width="2" fill="none"/><path d="M620 286Q632 289 645 282" stroke="#76262a" fill="none" stroke-width="2"/>
    <path d="M356 209l-20-14q-5-3-7 4l7 12Z" fill="#73262b"/><path d="M327 190Q345 184 360 194L361 205Q342 211 325 202Z" fill="url(#supraSidepaint)" stroke="#792d2e"/><path d="M326 202q17 6 34 0" stroke="#2c2c35" stroke-width="2" fill="none"/>
    <!-- Narrow rub strip, rocker, panel returns and the sculpted wheel lips. -->
    <path d="M111 272h79M322 272h285M795 272h106" stroke="#a63a31" stroke-width="2"/>
    <path d="M114 273h73M324 273h279M799 273h98" stroke="#f3815f" stroke-width=".65"/>
    <path d="M320 309h347l-2 13H323Z" fill="#a52e27" stroke="#77252a"/><path d="M327 312h334" stroke="#fc9270" stroke-width="1.6"/><path d="M325 319h339" stroke="#57232a" stroke-width="2.5"/>
    <path d="M191 315C186 269 211 226 256 227C302 227 327 269 321 315M667 315C662 268 685 226 731 226C777 226 802 267 796 314" stroke="#fa9977" stroke-width="2.2" fill="none"/>
    <path d="M195 315C191 271 215 232 256 232C299 232 322 271 317 315M671 315C667 272 689 232 731 231C773 231 797 271 792 315" fill="none" stroke="#51242b" stroke-width="2"/>
    <!-- Side edge of the oval projector lamp; no frontal lamp bank in elevation. -->
    <path d="M87 241Q111 232 159 230L173 235Q139 248 91 253Z" fill="url(#supraSidelamp)" stroke="#692c30"/><path d="M93 242l61-10" stroke="#d8edf7" stroke-width="1.7"/>
    <ellipse cx="112" cy="242" rx="10" ry="5" fill="#9bb9cd" stroke="#2d4c61" stroke-width="1.5"/><path d="M136 238l17-4-10 9-12 3Z" fill="#718fa5"/>
    <path d="M91 261l36-5 2 8-39 6Z" fill="#d69b47" stroke="#693a2c"/><path d="M94 262l30-4" stroke="#f7cf8a" stroke-width="1"/>
    <path d="M90 278l14-2 4 21-16 4Z" fill="#192b38"/><path d="M92 281l10-2 2 14-10 3Z" fill="url(#supraSidegrille)"/>
    <path id="frontFlapArt" d="M84 303l22 10h85v7h-82l-22-7Z" fill="#202b35"/><path d="M89 313l21 4h78" stroke="#556876" stroke-width="1" fill="none"/>
    <path d="M897 222l13 9 1 22-17-5Z" fill="#672132" stroke="#a44a4c"/><path d="M901 227l5 5v15l-7-2" fill="none" stroke="#ef5f60" stroke-width="2"/>
    <path d="M894 284h12v6h-13Z" fill="#ba3549"/>
    <path d="M860 306h33l16-8-4 13-20 8h-90v-5Z" fill="#762c2d"/>
    <g id="quadExhaustArt"><path d="M900 306h20v7h-20Z" fill="url(#supraSidechrome)"/><ellipse cx="920" cy="309.5" rx="2.8" ry="3.5" fill="#101c25" stroke="#9fb5c1" stroke-width="1"/></g>
    <!-- High hoop spoiler in SIDE elevation: aerofoil chord and one visible leg. -->
    <g id="rearWingArt"><path d="M841 212L850 150L862 150L858 214Z" fill="url(#supraSidepaint)" stroke="#8f302d"/><path d="M852 155l-8 52" stroke="#ff9874" stroke-width="1.2"/>
    <path d="M822 146Q830 134 846 134Q883 135 916 145L914 150Q871 145 827 151Z" fill="url(#supraSidepaint)" stroke="#88302d"/><path d="M830 142Q862 136 907 146" stroke="#ffac85" stroke-width="1.4" fill="none"/>
    </g>
    <path d="M744 208Q826 212 891 223" fill="none" stroke="#942e2a" stroke-width="1"/>
    <rect x="805" y="229" width="42" height="34" rx="8" fill="none" stroke="#9c3c32" stroke-width=".8"/>
    <path d="M869 246q3-5 5-1t5-2q3-1 3 2t5-1" fill="none" stroke="#d2c2b6" stroke-width=".9"/>
    <path d="M301 238h12v4h-12Z" fill="#dca254" stroke="#953e2e" stroke-width=".7"/>
   </g>${wheel(256,296,61)}${wheel(731,296,61)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" role="img" aria-label="${tesla?'Tesla Model S Plaid':'Toyota Supra Mk4 Turbo'} — detailed left-side profile"><title>${tesla?'Model S Plaid · 21-inch Arachnid wheels · four-door liftback':'A80 Supra Turbo · factory 17-inch five-spoke wheels · hoop spoiler'}</title>${defs}<style>#doorArt{transform-origin:${tesla?'340px 210px':'338px 210px'};transition:transform .55s ease}#doorArt.open{transform:scaleX(.73)}.wSpin{transition:none}</style><ellipse cx="504" cy="357" rx="446" ry="12" fill="#07131e" opacity=".26"/>${tesla?teslaBody:supraBody}</svg>`;
 }
 root.MUCSProfileArt={exterior};
})(typeof window==='undefined'?globalThis:window);
