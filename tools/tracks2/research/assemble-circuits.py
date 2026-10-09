"""Assemble reviewed mapped paths; source labels without geographic evidence are excluded.
Original shared circuit stations remain byte-for-byte unchanged.
"""
import json,math
from pathlib import Path
R=Path(__file__).resolve().parent;S=R.parent
base=S/'shared-circuits.json'
if not base.exists():
 old=json.loads((S/'track-data.json').read_text());assert len(old)==8;base.write_text(json.dumps(old,separators=(',',':')))
data=json.loads(base.read_text());extra=json.loads((R/'normalized-circuits.json').read_text());pits=json.loads((R/'mapped-pits.json').read_text());extra.update(json.loads((R/'normalized-extra.json').read_text()));pits.update(json.loads((R/'mapped-extra-pits.json').read_text()))
def bends(t):
 p=t['points'];N=len(p);ds=t['L']/N;k=[]
 if t.get('closed') is False:return []
 angle=lambda a:math.atan2(math.sin(a),math.cos(a))
 for i,v in enumerate(p):
  a=p[(i-3)%N];b=p[(i+3)%N];k.append(angle(math.atan2(b[0]-v[0],b[1]-v[1])-math.atan2(v[0]-a[0],v[1]-a[1]))/(3*ds))
 candidates=[]
 for i,v in enumerate(k):
  if abs(v)<.0025 or abs(v)<max(abs(k[(i+j)%N])for j in range(-5,6)):continue
  if sum(abs(k[(i+j)%N])*ds for j in range(-10,11))<.18:continue
  candidates.append((i*ds,abs(v)))
 selected=[]
 for d,k in sorted(candidates,key=lambda x:-x[1]):
  if all(abs((d-other+t['L']/2)%t['L']-t['L']/2)>45 for other in selected):selected.append(d)
 return [[round(d,2),'Bend']for d in sorted(selected)]
for name,t in extra.items():
 if name in pits:
  m=pits[name];t['mappedPit']=m;t['pit']=[m['entry'],m['exit'],m['side'],m['limit']]
 t['labels']=bends(t);t['notes']=t.get('notes','Mapped centreline with coarse terrain elevations; pit service bays are simulated.')+' Corner signs mark geometric braking zones, not unverified corner names.'
 t.pop('review',None);data[name]=t
for suffix in ['special','rally','cinematic']:
 data.update(json.loads((R/('normalized-'+suffix+'.json')).read_text()))
(S/'track-data.json').write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('Assembled',len(data),'circuits')
