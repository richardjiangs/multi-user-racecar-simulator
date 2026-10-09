(function(){
 const a=window.__Track2App,p=a.f1ArtProfile,T=a.f1ArtText,B=a.f1ArtBolt,D=a.f1ArtDefs;
 if(!p)return;
 // Team-specific cockpit openings, shoulder padding and cockpit rim rake.
 const openings={
  f1redbull:[361,187,639,398,450],f1ferrari:[348,195,652,406,470],
  f1mclaren:[366,181,634,414,454],f1aston:[355,184,645,408,463],
  f1alpine:[344,203,656,416,474],f1williams:[359,190,641,410,460],
  f1racingbulls:[361,188,639,400,452],f1haas:[350,194,650,407,467],
  f1audi:[357,185,643,405,464],f1cadillac:[353,198,647,411,470]
 };
 function cockpitSvg(){const[l,front,r,hip,end]=openings[TRACK2_CONFIG.key],paint=p.paint,accent=p.accent;
  return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" role="img" aria-label="${p.model} survival cell, steering wheel, pedals, six point harness and removable headrest">${D('fc')}
  <defs><linearGradient id="fcpaint" x2=".3" y2="1"><stop stop-color="${paint}"/><stop offset=".28" stop-color="${paint}"/><stop offset="1" stop-color="#0c161e"/></linearGradient></defs>
  <rect width="1000" height="560" fill="#071218"/>
  <path d="M101 560L162 267Q217 146 401 95L455 34H545L599 95Q783 146 838 267L899 560Z" fill="url(#fcpaint)" stroke="#7e949f" stroke-width="1.5"/>
  <path d="M181 560L223 281Q286 173 ${l} ${front}Q438 145 500 152Q562 145 ${r} ${front}Q714 173 777 281L819 560Z" fill="url(#fcweave)" stroke="#708893" stroke-width="2"/>
  <path d="M${l} ${front}Q500 137 ${r} ${front}L${r-23} ${hip}Q595 504 500 541Q405 504 ${l+23} ${hip}Z" fill="#030a10" stroke="#3c525e" stroke-width="4"/>
  <path d="M${l+20} ${front+15}L${l+46} ${hip}Q418 477 485 499M${r-20} ${front+15}L${r-46} ${hip}Q582 477 515 499" fill="none" stroke="#1e323d" stroke-width="14"/>
  <!-- Offset column and pedal well remain visible behind the removable wheel. -->
  <path d="M484 175H516L531 332L519 386H481L469 332Z" fill="url(#fcmetal)" stroke="#263943"/>
  <path d="M491 181H509V379H491Z" fill="#152932"/>
  <g id="f1Pedals"><path d="M435 155L468 150L472 198L441 204Z M534 149L565 155L559 204L530 198Z" fill="url(#fcmetal)" stroke="#a4b4bc"/>
  ${Array.from({length:5},(_,i)=>`<path d="M442 ${160+i*7}l23 -3M536 ${157+i*7}l22 4" stroke="#314b58" stroke-width="2"/>`).join('')}</g>
  <!-- Lap belts, shoulder webbing, stitching and forged cam-lock. -->
  <g id="f1Harness"><path d="M418 ${hip}L447 ${hip-9}L494 502L470 516Z M582 ${hip}L553 ${hip-9}L506 502L530 516Z" fill="#949b90" stroke="#d4d7ca"/>
  <path d="M425 ${hip+3}L477 503M437 ${hip}L488 500M575 ${hip+3}L523 503M563 ${hip}L512 500" stroke="#3b4a47" stroke-width="1" stroke-dasharray="2 3"/>
  <path d="M394 494L492 493L494 510L395 512M606 494L508 493L506 510L605 512" fill="#6e7d77" stroke="#aab5ad"/>
  <path d="M481 549L487 510H497L493 549M519 549L513 510H503L507 549" fill="#adb3a4"/>
  <circle cx="500" cy="503" r="18" fill="url(#fcmetal)" stroke="#7d8d91"/><circle cx="500" cy="503" r="11" fill="#852b2b"/>${T(500,506,'PULL',5,'#fff','text-anchor="middle"')}</g>
  <g id="f1Headrest" fill="url(#fcrubber)" stroke="#6b7f89" stroke-width="1.5"><path d="M${l+6} ${hip-20}L${l+36} ${hip-35}L${l+58} ${hip-9}L448 ${end}L411 ${end+5}Z"/><path d="M${r-6} ${hip-20}L${r-36} ${hip-35}L${r-58} ${hip-9}L552 ${end}L589 ${end+5}Z"/></g>
  <path d="M228 5Q315 99 491 119Q500 122 509 119Q685 99 772 5" fill="none" stroke="#050b10" stroke-width="27"/><path d="M228 5Q315 99 491 119Q500 122 509 119Q685 99 772 5" fill="none" stroke="#738b96" stroke-width="2"/>
  <path d="M493 121H507L516 214H484Z" fill="url(#fcweave)" stroke="#526e7b"/>
  <path d="M216 277Q280 167 358 181M784 277Q720 167 642 181" fill="none" stroke="${accent}" stroke-width="3"/>
  <path d="M226 297L310 329L299 453L205 423Z M774 297L690 329L701 453L795 423Z" fill="url(#fcweave)" stroke="#486575"/>
  ${[0,1,2,3,4].map(i=>B(235+i*13,318+i*7,2.2)+B(765-i*13,318+i*7,2.2)).join('')}
  <path d="M243 444L300 459L294 489L235 472Z" fill="#222e32" stroke="#7f969c"/>${T(241,462,p.model,9,'#e4eee9','transform="rotate(15 241 462)"')}
  <path id="f1DrinkTube" d="M781 470Q702 449 663 359L626 347" fill="none" stroke="#78aaa8" stroke-width="4"/>
  <g id="f1VentAir" stroke="#95cbdc" stroke-width="2" opacity=".18" fill="none"><path d="M295 266q17 -12 4 -26q-10 -16 9 -28M705 266q-17 -12 -4 -26q10 -16 -9 -28"/></g>
  ${B(479,213,2.5)}${B(521,213,2.5)}${B(348,371,3)}${B(652,371,3)}
  <g id="cabinWheelG" transform="translate(500,306)"><g transform="scale(.91)">${a.f1WheelSvg(true).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g></g>
  ${T(26,524,p.mark,15,'#b4c7d0','letter-spacing="2"')}${T(26,544,p.model+' / DRIVER CELL',8,'#738e9a','letter-spacing="1.6"')}
  </svg>`;
 }
 Object.assign(a,{f1CockpitSvg:cockpitSvg});
})();
