"""Select complete route geometry from cached OSM ways for map review.
The manifest records each way; length alone is never a layout selector.
"""
from pathlib import Path
from collections import defaultdict
import math,json,heapq
from geometry_utils import xy,length
R=Path(__file__).resolve().parent
out={}
def read(slug):return json.loads((R/'maps'/(slug+'.json')).read_text())['elements']
def join(ways,first=None):
 ws={w['id']:w for w in ways};w=ws.pop(first or ways[0]['id']);ids=w['nodes'][:];coords={n:[p['lon'],p['lat']]for w in ways for n,p in zip(w['nodes'],w['geometry'])}
 while ws:
  found=False
  for key,w in list(ws.items()):
   p=w['nodes']
   if p[0]==ids[-1]:ids+=p[1:]
   elif p[-1]==ids[-1]:ids+=p[-2::-1]
   elif p[-1]==ids[0]:ids=p[:-1]+ids
   elif p[0]==ids[0]:ids=p[:0:-1]+ids
   else:continue
   del ws[key];found=True;break
  if not found:raise ValueError(('disconnected',list(ws)))
 return [coords[n]for n in ids]
def add(name,slug,points,L,closed=True,width=6,**rest):
 out[name]={'slug':slug,'points':points,'L':L,'closed':closed,'width':width,'source':'https://www.openstreetmap.org/copyright',**rest};print(name,round(length(xy(points),closed)),L,flush=True)
def shortest(ways,start,end):
 coords={n:[p['lon'],p['lat']]for w in ways for n,p in zip(w['nodes'],w['geometry'])};metric={n:xy([p],start)[0]for n,p in coords.items()};graph=defaultdict(list)
 for w in ways:
  for a,b in zip(w['nodes'],w['nodes'][1:]):
   cost=math.dist(metric[a],metric[b]);graph[a].append((b,cost));graph[b].append((a,cost))
 a=min(coords,key=lambda n:math.dist(coords[n],start));b=min(coords,key=lambda n:math.dist(coords[n],end));queue=[(0,a)];dist={a:0};prev={}
 while queue:
  d,n=heapq.heappop(queue)
  if d!=dist[n]:continue
  if n==b:break
  for j,cost in graph[n]:
   q=d+cost
   if q<dist.get(j,float('inf')):dist[j]=q;prev[j]=n;heapq.heappush(queue,(q,j))
 if b not in prev:raise ValueError('No connected route')
 path=[b]
 while path[-1]!=a:path.append(prev[path[-1]])
 return [coords[n]for n in path[::-1]]
# Each road segment is physically connected; no invented joins across the valley.
ws=[w for w in read('furka')if w['tags'].get('ref')=='19'];p=shortest(ws,[8.3634,46.5629],[8.5024,46.5973]);add('Furka Pass','furka',p,round(length(xy(p),False)),False,3.5,scene='alpine',fence=False)
ws=[w for w in read('ehra')if w['tags'].get('name')=='Schnellbahn'];p=join(ws);add('Ehra-Lessien','ehra',p,21000,True,6,scene='test',wayIds=[w['id']for w in ws])
ws=[w for w in read('mira')if w['id']==45774109];mp=join(ws);add('MIRA Proving Ground','mira',mp,round(length(xy(mp))),True,7,scene='test',wayIds=[45774109])
ws=[w for w in read('bathurst')if 'Panorama' in w['tags'].get('alt_name','')];p=join(ws,306192512)
# OSM's connected directed sequence starts along Pit Straight toward Hell Corner.
add('Mount Panorama, Bathurst','bathurst',p,6213,True,5.5,scene='mountain',wayIds=[w['id']for w in ws])
ws=[w for w in read('modena')if w['id']==149097694];add('Autodromo di Modena','modena',join(ws),2068,True,6,wayIds=[149097694])
# NASA's runway centreline includes the two overrun pads; trim equal overrun ends.
w=next(w for w in read('landing-facility')if w['id']==26929962);p=[[q['lon'],q['lat']]for q in w['geometry']];metric=xy(p);total=length(metric,False);trim=(total-4572)/2
ss=[0]
for a,b in zip(metric,metric[1:]):ss.append(ss[-1]+math.dist(a,b))
def interpolate(d):
 i=next(i for i in range(len(ss)-1)if ss[i]<=d<=ss[i+1]);u=(d-ss[i])/(ss[i+1]-ss[i]);return[p[i][k]+u*(p[i+1][k]-p[i][k])for k in [0,1]]
q=[interpolate(trim)]+[pt for pt,d in zip(p,ss)if trim<d<total-trim]+[interpolate(total-trim)]
add('Launch and Landing Facility','landing-facility',q,4572,False,45.5,scene='runway',fence=False,wayIds=[26929962])
# Previously enumerated candidates that have the correct layout silhouette.
chosen={'Goodwood Motor Circuit':('goodwood',3809,0),'Scandinavian Raceway, Anderstorp':('anding',4025,0),'Twin Ring Motegi':('motegi',4801,0),'Okayama International Circuit':('okayama',3703,0),'Hethel Test Track':('hethel',3540,0),'Automotodrom Grobnik':('grobnik',4168,0),'Autodromo di Varano':('varano',2350,0),'Sportsland SUGO':('sugo',3586,0),'Willow Springs':('willow',4023,0),'Sachsenring':('sachsenring',3671,0),'MotorLand Aragón':('motorland',5344,0),'Virginia International Raceway Grand Course':('vir-grand',6760,0),'Balocco Proving Ground':('balocco',5750,1)}
candidates=json.loads((R/'osm-layout-candidates.json').read_text())
for name,(slug,L,index)in chosen.items():
 c=candidates[slug]['candidates'][index];add(name,slug,c['points'],L,True,6,wayIds=c['ways'],review='start line, direction and pit review pending')
ws=[w for w in read('fiorano')if w['tags'].get('name')=='Pista di Fiorano'];add('Pista di Fiorano','fiorano',join(ws),2976,True,4.2,wayIds=[w['id']for w in ws])
ws=[w for w in read('dunsfold')if w['tags'].get('highway')=='raceway'];add('Dunsfold Park','dunsfold',join(ws,22740179),2820,True,6,wayIds=[w['id']for w in ws])
ws={w['id']:w for w in read('tsukuba')};w=ws[110390474];shortcut=ws[110390472];a=w['nodes'].index(shortcut['nodes'][0]);b=w['nodes'].index(shortcut['nodes'][-1]);points=[[p['lon'],p['lat']]for p in w['geometry'][:a]+shortcut['geometry']+w['geometry'][b+1:]];add('Tsukuba Circuit','tsukuba',points,2045,True,5,wayIds=[110390474,110390472])
more=json.loads((R/'osm-layout-candidates-additions.json').read_text())
for name,slug,L in [('Brands Hatch GP','brands-hatch',3908),('Donington Park GP','donington',4020)]:
 c=more[slug]['candidates'][0];add(name,slug,c['points'],L,True,6,wayIds=c['ways'])
p=json.loads((R/'centerlines/bacinger-de-1932.geojson').read_text())['features'][0]['geometry']['coordinates'];add('Hockenheimring','hockenheim',p,4574,True,6.5)
(R/'extra-geographic.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
