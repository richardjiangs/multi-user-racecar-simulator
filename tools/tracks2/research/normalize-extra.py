"""Import reviewed real geographic routes, retaining source coordinates and uncertainty."""
import json,math,bisect
from pathlib import Path
from geometry_utils import xy,uniform,length
R=Path(__file__).resolve().parent
sources=json.loads((R/'extra-geographic.json').read_text())
seeds={'bathurst':37594848,'modena':149097692,'goodwood':344562248,'anding':438314330,'motegi':229813464,'okayama':267173063,'grobnik':92343850,'sugo':573824372,'sachsenring':34402861,'motorland':230005499,'vir-grand':20265833,'tsukuba':110390473,'brands-hatch':4906930,'donington':90102737,'hockenheim':15446020}
# Circuit direction checks. Figure-eight/test layouts retain the mapped directed ways.
ccw={'bathurst','sachsenring','motorland','varano'}
cw={'modena','goodwood','anding','motegi','okayama','hethel','grobnik','sugo','willow','vir-grand','tsukuba','brands-hatch','donington','hockenheim'}
area=lambda p:sum(a[0]*b[1]-a[1]*b[0]for a,b in zip(p,p[1:]+p[:1]))
def project(points,q,closed=True):
 best=(float('inf'),0,0,None)
 for i in range(len(points) if closed else len(points)-1):
  a,b=points[i],points[(i+1)%len(points)];v=[b[k]-a[k]for k in (0,1)];u=max(0,min(1,sum((q[k]-a[k])*v[k]for k in (0,1))/max(1e-10,sum(x*x for x in v))));p=[a[k]+u*v[k]for k in (0,1)];d=math.dist(p,q)
  if d<best[0]:best=(d,i,u,p)
 return best
out={};audit=[]
for name,src in sources.items():
 slug=src['slug'];closed=src['closed'];points=src['points'][:]
 if points[0]==points[-1]:points.pop()
 if closed and ((slug in ccw and area(points)<0)or(slug in cw and area(points)>0)):points.reverse()
 ways={w['id']:w for w in json.loads((R/'maps'/(slug+'.json')).read_text())['elements']}
 # Use the service-straight midpoint to locate the start area, then project exactly
 # onto the main road. Published start positions override this approximate datum.
 datum=points[0]
 if slug in seeds:
  pp=ways[seeds[slug]]['geometry'];datum=[pp[len(pp)//2]['lon'],pp[len(pp)//2]['lat']]
 if slug=='hockenheim':datum=src['points'][0]
 if closed:
  p=xy(points,datum);_,i,u,q=project(p,[0,0]);datum=[points[i][k]+u*(points[(i+1)%len(points)][k]-points[i][k])for k in (0,1)];points=[datum]+points[i+1:]+points[:i+1]
 clean=[]
 for p in points:
  if not clean or math.dist(p,clean[-1])>1e-8:clean.append(p)
 L=4500 if slug=='mira'else src['L'];pts,raw,scale=uniform(xy(clean,datum),L,closed)
 # Re-register every cached elevation to its geographic location on this datum.
 terrain=json.loads((R/'elevations'/(slug+'.json')).read_text());heights=[]
 for r in terrain['response']['results']:
  loc=r['location'];q=[v*scale for v in xy([[loc['lng'],loc['lat']]],datum)[0]];_,i,u,_=project(pts,q,closed);heights.append([(i+u)/(len(pts)if closed else len(pts)-1)*L,r['elevation']])
 heights.sort();uniq=[]
 for p in heights:
  if not uniq or p[0]-uniq[-1][0]>1:uniq.append(p)
 heights=uniq
 if closed:
  f=heights[0];z=heights[-1];start=z[1]+(f[1]-z[1])*(L-z[0])/(L-z[0]+f[0]);heights=[[0,start]]+[v for v in heights if 1<v[0]<L-1]+[[L,start]]
 else:heights[0][0]=0;heights[-1][0]=L
 elev=[[round(d,3),round(h,3)]for d,h in heights]
 t={'L':L,'closed':closed,'src':src['source'],'points':pts,'origin':datum,'geoScale':scale,'elev':elev,'widths':[[0,src['width']],[L,src['width']]],'labels':[],'pit':None,'scene':src.get('scene','arid'if slug in ['grobnik','willow','motorland']else'circuit'),'sourceSlug':slug,'notes':'Mapped route; length follows the named circuit configuration. Start datum and SRTM terrain heights are approximate, not a survey.'}
 if not closed:t['fence']=False
 if slug in ['mira','ehra']:t['banking']={'maxSlope':math.tan(math.radians(33 if slug=='mira' else 30)),'curvatureScale':.006 if slug=='mira'else.0013};t['pit']=[L-250,200,1,60];t['serviceRange']=[-100,90]
 if slug=='landing-facility':t['widthScale']=1;t['scene']='runway';t['elev']=[[0,2],[L,2]]
 if slug=='dunsfold':t['fence']=False
 # Small paved test paddocks have no GP-style pit lane. Their simulated service
 # facility is explicit and does not claim to be an actual FIA pit building.
 if closed and slug not in seeds and slug not in ['mira','ehra']:
  t['pit']=[L-180,150,1,60];t['serviceRange']=[-60,55]
 if slug in seeds:t['pitSeed']=seeds[slug]
 # The geographic bridge tags identify the elevated deck; SRTM sees terrain only.
 if slug=='fiorano':
  bridge=[]
  for w in ways.values():
   if w['id']not in src['wayIds']or w['tags'].get('bridge')not in ['yes','viaduct']:continue
   for g in w['geometry']:
    q=[v*scale for v in xy([[g['lon'],g['lat']]],datum)[0]];_,i,u,_=project(pts,q);bridge.append((i+u)/len(pts)*L)
  lo,hi=min(bridge),max(bridge);assert hi-lo<200
  def h(d):
   i=max(0,min(len(elev)-2,bisect.bisect_right([v[0]for v in elev],d)-1));a,b=elev[i:i+2];return a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0])
  deck=max(h(lo),h(hi))+6.5;new=[v for v in elev if not lo-90<v[0]<hi+90];new +=[[lo-90,h(lo-90)],[lo,deck],[hi,deck],[hi+90,h(hi+90)]];t['elev']=sorted(new);t['bridges']=[[lo,hi,6.5]]
 out[name]=t;audit.append({'name':name,'rawLengthM':round(raw,2),'lengthM':L,'scale':round(scale,5),'directionArea':round(area(pts)),'pitSeed':t.get('pitSeed')})
(R/'normalized-extra.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')));(R/'extra-audit.json').write_text(json.dumps(audit,indent=2));print('Normalized',len(out))
