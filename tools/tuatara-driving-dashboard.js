  // Production Tuatara: a single digital HMI beneath a stitched angular cowl.
  function drawCluster(w, h, dashY, sway) {
    const scale = Math.min(w / 1200, h / 850), cx = w / 2 + sway;
    const cy = dashY + 36 * scale;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(scale, scale);
    const polygon = points => { ctx.beginPath(); points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath(); };
    polygon([[-172,-62],[140,-62],[174,-34],[153,85],[-157,85],[-179,-20]]);
    const cowl = ctx.createLinearGradient(0,-70,0,90); cowl.addColorStop(0,"#333738"); cowl.addColorStop(1,"#0a0e11");
    ctx.fillStyle = cowl; ctx.fill(); ctx.strokeStyle = "#6a5a4f"; ctx.lineWidth = 3; ctx.stroke();
    polygon([[-158,-48],[130,-48],[156,-27],[139,71],[-143,71],[-163,-18]]);
    ctx.fillStyle = "#02080c"; ctx.fill();
    const rev = clamp(state.rpm / SPEC.redlineRpm,0,1);
    for (let i=0;i<32;i++) {
      const a = Math.PI * (1.04 + i / 31 * .88), x = Math.cos(a)*113, y = 48 + Math.sin(a)*81;
      ctx.save(); ctx.translate(x,y); ctx.rotate(a + Math.PI/2);
      ctx.fillStyle = i < rev*32 ? (i>27 ? "#ff5848" : "#e3edf0") : "#27333c"; ctx.fillRect(-3,-8,6,14); ctx.restore();
    }
    ctx.textAlign = "center"; ctx.fillStyle = "#ed5c48"; ctx.font = "600 44px ui-sans-serif";
    ctx.fillText(state.gearMode === "G" ? String(state.curGear) : state.gearMode,0,25);
    ctx.fillStyle = "#edf6fa"; ctx.font = "24px ui-sans-serif"; ctx.fillText(String(Math.round(Math.abs(app.kmh(state.speedMps)))),0,54);
    ctx.fillStyle = "#93a5b0"; ctx.font = "9px ui-sans-serif"; ctx.fillText("km/h",43,54);
    ctx.textAlign = "left"; ctx.fillText("BOOST",-142,25); ctx.fillText((state.boostBar||0).toFixed(1)+" bar",-142,41);
    ctx.textAlign = "right"; ctx.fillText("OIL °C",139,26); ctx.fillText(String(Math.round(state.oilTempC)),139,43);
    ctx.fillStyle = "#ce997a"; ctx.font = "8px ui-sans-serif"; ctx.fillText(state.e85 ? "E85" : "91 OCT",132,62);
    // The two circles to the right are central air vents above the portrait touchscreen.
    [237,308].forEach(x => {
      ctx.fillStyle="#b4bdc2";ctx.beginPath();ctx.arc(x,-4,26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#0a1115";ctx.beginPath();ctx.arc(x,-4,21,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#646f74";ctx.lineWidth=2;
      for(let y=-16;y<=12;y+=7){ctx.beginPath();ctx.moveTo(x-16,y);ctx.lineTo(x+16,y);ctx.stroke();}
    });
    polygon([[220,33],[318,33],[348,208],[216,208]]); ctx.fillStyle="#b4babd";ctx.fill();
    polygon([[229,42],[310,42],[335,200],[224,200]]); ctx.fillStyle="#071018";ctx.fill();
    ctx.textAlign="center";ctx.fillStyle="#d6e0e5";ctx.font="9px ui-sans-serif";ctx.fillText("TUATARA",271,57);
    ctx.strokeStyle="#85969f";ctx.lineWidth=2;roundRect(ctx,256,70,36,62,10);ctx.stroke();
    ctx.fillStyle="#071018";ctx.strokeRect(261,81,26,17);
    ctx.fillStyle="#dd9b76";ctx.fillText(state.driveMode.toUpperCase(),276,156);
    ctx.fillStyle="#9caeb9";ctx.fillText(state.cool ? "A/C ON" : "A/C OFF",278,178);
    ctx.restore();
  }
  function drawWheel(w, h) {
    const R = Math.min(w / 1200, h / 850) * 142, cx = w/2 + state.shake.x*.3, cy = h*.97;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(state.steer*.9);ctx.scale(R,R);
    const rim=()=>{ctx.beginPath();ctx.moveTo(-.56,-.81);ctx.quadraticCurveTo(0,-.95,.56,-.81);ctx.bezierCurveTo(1.13,-.55,1.12,.25,.61,.79);ctx.lineTo(-.61,.79);ctx.bezierCurveTo(-1.12,.25,-1.13,-.55,-.56,-.81);};
    rim();ctx.strokeStyle="#080b0d";ctx.lineWidth=.22;ctx.stroke();ctx.strokeStyle="#43372e";ctx.lineWidth=.16;ctx.stroke();
    ctx.strokeStyle="#ad6748";ctx.lineWidth=.009;ctx.setLineDash([.028,.023]);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle="#f0804e";ctx.lineWidth=.047;ctx.beginPath();ctx.moveTo(0,-.94);ctx.lineTo(0,-.78);ctx.stroke();
    ctx.fillStyle="#a1a9ad";ctx.beginPath();ctx.moveTo(-.94,-.13);ctx.lineTo(.94,-.13);ctx.lineTo(.94,.07);ctx.lineTo(.28,.16);ctx.lineTo(.18,.72);ctx.lineTo(-.18,.72);ctx.lineTo(-.28,.16);ctx.lineTo(-.94,.07);ctx.closePath();ctx.fill();
    ctx.fillStyle="#171d22";ctx.beginPath();ctx.moveTo(-.43,-.25);ctx.quadraticCurveTo(0,-.38,.43,-.25);ctx.lineTo(.35,.12);ctx.lineTo(0,.4);ctx.lineTo(-.35,.12);ctx.closePath();ctx.fill();
    ctx.fillStyle="#e0e5e7";ctx.beginPath();ctx.moveTo(-.1,-.14);ctx.lineTo(.1,-.14);ctx.lineTo(.08,.08);ctx.lineTo(0,.18);ctx.lineTo(-.08,.08);ctx.closePath();ctx.fill();
    ctx.fillStyle="#11191f";ctx.fillRect(-.08,-.12,.08,.08);ctx.fillRect(0,-.04,.08,.08);ctx.fillRect(-.07,.04,.07,.07);
    for(let i=0;i<6;i++){ctx.fillStyle=state.ignition&&state.rpm/SPEC.redlineRpm>.65+i*.05?(i<4?"#f6bc51":"#fd5542"):"#322c25";ctx.fillRect(-.17+i*.056,-.84,.039,.023);}
    ctx.restore();
  }
