"""Artwork replacement only; no changes to powertrain, sound, or keyboard handlers."""
from pathlib import Path
R=Path(__file__).resolve().parent

def integrate(s):
 def rep(a,b):
  nonlocal s
  assert a in s,a[:120]
  s=s.replace(a,b,1)
 def block(a,b,new):
  nonlocal s
  i=s.index(a);j=s.index(b,i);s=s[:i]+new+s[j:]
 modules='\n'.join((R/f).read_text() for f in ['wheel-profiles.js','exterior-profiles.js','wheel-art.js','cockpit-art.js','exterior-art.js','engine-art.js'])
 rep('/* ===== render: the driving world ===== */',modules+'\n/* ===== render: the driving world ===== */')
 block('  function drawCabinFrame(w, h, pal) {','    function drawHeadlights(w, h)',(R/'driving-cabin.js').read_text()+(R/'live-display.js').read_text()+'\nfunction roundRectC(x,y,w,h,r){roundRect(ctx,x,y,w,h,r);}\n')
 block('  function injectExterior() {','  function weave() {','''  function injectExterior(){app.el.exteriorArt.innerHTML=app.f1ExteriorSvg();app.el.bcBody=document.getElementById('bcBody');app.el.quadExhaustArt=document.getElementById('quadExhaustArt');}
  function injectArt(){injectExterior();app.el.cabinArt.innerHTML=app.f1CockpitSvg();prepareF1Wheel();document.getElementById('f1EngineDrawing').innerHTML=app.f1EngineSvg();}
''')
 block('          <div style="position:absolute;left:15%;right:15%;top:13%;height:158px;pointer-events:none">','          <div class="emotor"','          <div id="f1EngineDrawing"></div>\n')
 rep('el.engineBay.style.setProperty("--cover", on ? "0%" : "-101%");','el.engineBay.style.setProperty("--cover", on ? "-101%" : "0%");')
 # Team body and accent are also used on the in-world player nose.
 rep('[0,161,145]);',"col(app.f1ArtProfile?.accent||'#00a191'));")
 # Existing controls retain their actions, with labels describing their F1 components.
 for x,y in [('Doors stay shut while moving.','Wheel and headrest stay fitted while moving.'),('Doors rising.','Steering wheel and headrest removed.'),('Doors closed.','Steering wheel and headrest fitted.'),('Use a real V8 recording','Use a real engine recording'),('Cabin ambient lighting on.','Wheel display brightness high.'),('Ambient lighting off.','Wheel display brightness low.')]:s=s.replace(x,y)
 rep('`${which === "driver" ? "Driver" : "Passenger"} door ${next ? "open" : "closed"}.`','`${which === "driver" ? "Steering wheel" : "Headrest"} ${next ? "removed" : "fitted"}.`')
 rep('warn.push("doors open")','warn.push("wheel / headrest removed")')
 idx=s.rfind('</script>');s=s[:idx]+(R/'bindings.js').read_text()+s[idx:]
 rep('  </style>',(R/'style.css').read_text()+'\n</style>')
 return s
