// This runs in every frame before any simulator code. Audio graphs still run
// for numerical analysis, but their physical output is zero at all times.
export function silenceOutput(){
 const connect=AudioNode.prototype.connect,sinks=new WeakMap();
 AudioNode.prototype.connect=function(destination,...args){
  if(destination instanceof AudioDestinationNode && !(this.context instanceof OfflineAudioContext)){
   let sink=sinks.get(this.context);if(!sink){sink=this.context.createGain();sink.gain.value=0;connect.call(sink,destination);sinks.set(this.context,sink);}
   return connect.call(this,sink,...args);
  }
  return connect.call(this,destination,...args);
 };
 HTMLMediaElement.prototype.play=function(){this.muted=true;return Promise.resolve();};
 window.__testsMuted=true;
}
