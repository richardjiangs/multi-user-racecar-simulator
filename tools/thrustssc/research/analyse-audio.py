"""Measure the archived team Run 65 film; never play audio or embed its recording."""
import json,sys,hashlib
import numpy as np
from scipy.io import wavfile
from scipy.signal import stft
from scipy.ndimage import gaussian_filter1d
from pathlib import Path
rate,x=wavfile.read(sys.argv[1]);x=x.astype(float)/32768
# Post-boom receding jet, before the later foreground conversation. Low temporal
# percentile suppresses isolated speech/impulses; log smoothing removes narrow
# voice harmonics. This is a field-microphone spectrum, not a cockpit transfer.
start,end=8.65,10.8
y=x[int(start*rate):int(end*rate)]
f,t,z=stft(y,rate,nperseg=2048,noverlap=1536)
p=np.percentile(abs(z)**2,25,axis=1)
p=gaussian_filter1d(np.log(np.maximum(p,1e-12)),2.2)
freq=np.geomspace(35,5000,96)
amp=np.sqrt(np.exp(np.interp(freq,f,p)))
amp/=np.max(amp)
profile={'source':'https://www.thrustssc.com/thrustssc/Videos/Videos.html','recording':'Run 65 from the ground — Jeremy Davey, 1997','archive':'https://web.archive.org/web/20060505172134id_/http://www.thrustssc.com:80/thrustssc/Videos/Run_65.avi','segmentSeconds':[start,end],'sourceSampleRate':11025,'wavSha256':hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest(),'method':'25th percentile STFT power; smoothed spectral envelope; random-phase resynthesis (no recorded waveform or voice copied)','limitations':'Field microphone, receding pass, 8-bit 11.025 kHz original; not an isolated engine or cockpit measurement. Spool/reheat/canopy mapping is a simulation approximation.','frequencies':freq.round(3).tolist(),'amplitudes':amp.round(6).tolist()}
Path('tools/thrustssc/audio-profile.json').write_text(json.dumps(profile,indent=2)+'\n')
print('Measured 96-band jet spectral envelope without playback. Strongest band:',freq[np.argmax(amp)])
