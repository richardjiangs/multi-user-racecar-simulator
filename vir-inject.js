(function(){
  Promise.all([
    fetch("vir-inject-a.js", {cache:"no-store"}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); }),
    fetch("vir-inject-b.js", {cache:"no-store"}).then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
  ]).then(function(parts){
    var s = document.createElement("script");
    s.textContent = parts.join("");
    document.documentElement.appendChild(s);
  }).catch(function(err){ console.error("VIR inject failed", err); });
})();
