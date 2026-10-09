"""Normalize mapped outlines with independent start/direction checks.

Atlas metadata contains several wrong datums/directions. Only its mapped XY is
used where the matching layout agrees; Paul Ricard GP uses the F1 chicane source.
"""
import json,math
from pathlib import Path
from geometry_utils import xy,uniform,length
R=Path(__file__).resolve().parent
sources=json.loads((R/'source-centerlines.json').read_text())
refs={'portimao':'pt-2008','imola':'it-1953','zandvoort':'nl-1948','shanghai':'cn-2004','barcelona':'es-1991','red-bull-ring':'at-1969','monza':'it-1922','circuit-of-the-americas':'us-2012','bahrain':'bh-2002','paul-ricard':'fr-1969','interlagos':'br-1940','baku':'az-2016','miami':'us-2022','hungaroring':'hu-1986','las-vegas':'us-2023'}
# Road widths (half-width metres), nominal configuration lengths, pit-side and scenery.
widths={'portimao':7,'laguna-seca':6,'circuit-de-la-sarthe':6,'imola':6,'mugello':7,'zandvoort':5.5,'fuji':7.5,'shanghai':7,'watkins-glen':6,'road-america':6,'sebring':6,'barcelona':6,'daytona':8,'red-bull-ring':6.5,'monza':6,'circuit-of-the-americas':7.5,'bahrain':7.5,'paul-ricard':6,'interlagos':7,'baku':5.5,'miami':6.5,'hungaroring':6,'las-vegas':6}
area=lambda p:sum(a[0]*b[1]-a[1]*b[0]for a,b in zip(p,p[1:]+p[:1]))
out={};audit=[]
for name,t in sources.items():
 slug=t['source'].split('/')[-1];points=t['points'][:]
 if points[-1]==points[0]:points.pop()
 datum=points[0];reverse=False;source=t['source'];oldOrigin=points[0];oldMetric=xy(t['points']);oldL=length(oldMetric)
 if slug in refs:
  ref=json.loads((R/'centerlines'/('bacinger-'+refs[slug]+'.geojson')).read_text())['features'][0]['geometry']['coordinates'];datum=ref[0]
  reverse=area(points)*area(ref)<0
  if reverse:points.reverse()
  if slug=='paul-ricard':points=ref[:-1]if ref[-1]==ref[0]else ref;source='https://github.com/bacinger/f1-circuits/blob/master/circuits/fr-1969.geojson'
 # Start on the reference line by inserting its projection, not snapping to a far node.
 metric=xy(points,datum);best=(float('inf'),0,0,None)
 for i,(a,b)in enumerate(zip(metric,metric[1:]+metric[:1])):
  dx,dy=b[0]-a[0],b[1]-a[1];u=max(0,min(1,-(a[0]*dx+a[1]*dy)/max(.0001,dx*dx+dy*dy)));q=[a[0]+dx*u,a[1]+dy*u];dd=math.hypot(*q)
  if dd<best[0]:best=(dd,i,u,q)
 _,i,u,q=best;origin=[points[i][k]+u*(points[(i+1)%len(points)][k]-points[i][k])for k in range(2)]
 points=[origin]+points[i+1:]+points[:i+1]
 clean=[]
 for p in points:
  if not clean or math.dist(clean[-1],p)>.0000001:clean.append(p)
 L=t['L'];pts,raw,scale=uniform(xy(clean,origin),L)
 # Preserve SRTM's geographic registration after datum/direction correction.
 terrain=json.loads((R/'elevations'/(slug+'.json')).read_text());original=t['points'];op=xy(original,origin);cum=[0]
 for a,b in zip(op,op[1:]):cum.append(cum[-1]+math.dist(a,b))
 originxy=[0,0];ix=min(range(len(op)),key=lambda i:math.dist(op[i],originxy));shift=cum[ix]/cum[-1]
 hs=terrain['samples']
 def height(f):
  f=f%1;j=min(len(hs)-2,max(0,int(f*(len(hs)-1))));a,b=hs[j:j+2];return a[1]+(b[1]-a[1])*(f-a[0])/(b[0]-a[0])
 elev=[]
 for j in range(len(hs)):
  f=j/(len(hs)-1);elev.append([round(f*L,4),round(height(shift+(-f if reverse else f)),3)])
 elev[-1][1]=elev[0][1]
 # Labels are currently numbered placeholders; official named-apex review follows.
 labels=[]
 for marker,label in t['labels']:
  fraction=((shift-marker)if reverse else(marker-shift))%1
  labels.append([round(fraction*L,3),label])
 labels.sort()
 track={'L':L,'closed':True,'src':source,'points':pts,'origin':origin,'geoScale':L/length(xy(clean,origin)),'elev':elev,'widths':[[0,widths[slug]],[L,widths[slug]]],'labels':labels,'count':len(labels),'pit':None,'scene':'street'if slug in ['baku','miami','las-vegas']else'arid'if slug in ['bahrain','paul-ricard','laguna-seca','portimao']else'circuit','sourceSlug':slug,'review':'pit and named-apex review pending'}
 out[name]=track;audit.append({'name':name,'slug':slug,'reversed':reverse,'datumMovedM':round(math.dist(xy([oldOrigin],origin)[0],[0,0]),2),'rawLengthM':round(raw,2),'targetLengthM':L,'scale':scale})
(R/'normalized-circuits.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
(R/'normalization-audit.json').write_text(json.dumps(audit,indent=2))
print('Normalized',len(out),'circuits for pit and landmark review. Runtime data not yet replaced.')
