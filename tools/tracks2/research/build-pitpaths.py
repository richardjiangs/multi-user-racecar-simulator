"""Follow connected OSM pit ways and project their entry/exit onto the same road.
All choices retain source IDs and generate a map for review before packaging.
"""
import json,math,heapq,bisect,sys
from pathlib import Path
from collections import defaultdict
from geometry_utils import xy,spline
R=Path(__file__).resolve().parent;extra='--extra' in sys.argv;tracks=json.loads((R/('normalized-extra.json' if extra else 'normalized-circuits.json')).read_text())
if extra:tracks={n:t for n,t in tracks.items()if t.get('pitSeed')}
seeds={'portimao':157790380,'laguna-seca':109859349,'circuit-de-la-sarthe':777192901,'imola':196368195,'mugello':197788411,'zandvoort':38144527,'fuji':148621414,'shanghai':107371138,'watkins-glen':20164027,'road-america':110527554,'sebring':1041888710,'barcelona':178416729,'daytona':198465570,'red-bull-ring':289111668,'monza':38168747,'circuit-of-the-americas':514836373,'bahrain':187123422,'paul-ricard':799477739,'interlagos':33779109,'baku':1513267145,'miami':1017340352,'hungaroring':231417580,'las-vegas':1223479152}
class Project:
 def __init__(self,t):
  self.t=t;self.p=t['points'];self.grid=defaultdict(list)
  for i,p in enumerate(self.p):self.grid[(int(p[0]//60),int(p[1]//60))].append(i)
 def near(self,q):
  x,z=q;cx,cz=int(x//60),int(z//60);best=(float('inf'),0,0,None)
  for dx in range(-2,3):
   for dz in range(-2,3):
    for i in self.grid[(cx+dx,cz+dz)]:
     a,b=self.p[i],self.p[(i+1)%len(self.p)];vx,vz=b[0]-a[0],b[1]-a[1];u=max(0,min(1,((x-a[0])*vx+(z-a[1])*vz)/max(.000001,vx*vx+vz*vz)));p=[a[0]+u*vx,a[1]+u*vz];dd=math.dist(p,q)
     if dd<best[0]:best=(dd,(i+u)/len(self.p)*self.t['L'],(x-p[0])*vz-(z-p[1])*vx,p)
  return best
if extra:seeds={t['sourceSlug']:t['pitSeed']for t in tracks.values()}
results={};audit=[]
for name,t in tracks.items():
 slug=t['sourceSlug'];allways=json.loads((R/'maps'/(slug+'.json')).read_text())['elements'];ways={w['id']:w for w in allways if w['tags'].get('highway') in ['raceway','service']};seed=ways[seeds[slug]]
 scale=t['geoScale'];nodes={node:[v*scale for v in xy([[g['lon'],g['lat']]],t['origin'])[0]]for w in ways.values()for node,g in zip(w['nodes'],w['geometry'])};proj=Project(t);cache={}
 def near(n):
  if n not in cache:cache[n]=proj.near(nodes[n])
  return cache[n]
 # Orient the seed in race direction even when an untagged way is stored backwards.
 path=seed['nodes'][:];L=t['L'];d0=near(path[0])[1];d1=near(path[-1])[1]
 if (d1-d0)%L>L*.5:path.reverse()
 graph=defaultdict(list)
 for w in ways.values():
  for a,b in zip(w['nodes'],w['nodes'][1:]):
   cost=math.dist(nodes[a],nodes[b]);named=' '.join(w['tags'].values()).lower();factor=.3 if any(x in named for x in ['pit','boxen','stand'])else 1
   graph[a].append((b,cost*factor,w['id']));graph[b].append((a,cost*factor,w['id']))
 def connect(start,blocked):
  queue=[(0,start,[])];visited=set();answer=None
  while queue:
   cost,n,seq=heapq.heappop(queue)
   if n in visited or n in blocked:continue
   visited.add(n);dd,dist,side,p=near(n)
   if dd<3.5 and min(dist,L-dist)<L*.26:return seq+[n]
   if cost>1800:continue
   for nextnode,w,wayid in graph[n]:
    if nextnode not in visited:heapq.heappush(queue,(cost+w,nextnode,seq+[n]))
  return [start]
 before=connect(path[0],set(path[1:]));after=connect(path[-1],set(path[:-1]));path=before[::-1][:-1]+path+after[1:]
 start=near(path[0]);end=near(path[-1]);entry,exit=start[1],end[1];span=(exit-entry)%L
 if start[0]>25 or end[0]>25 or span>L*.55 or span<50:
  audit.append({'name':name,'status':'NEEDS MANUAL CONNECTION','seed':seed['id'],'startError':start[0],'endError':end[0],'span':span});print(name,'CHECK',start[0],end[0],span);continue
 points=[start[3]]+[nodes[n]for n in path]+[end[3]];clean=[]
 for p in points:
  if not clean or math.dist(p,clean[-1])>.2:clean.append(p)
 points=spline(clean,False);dist=[0]
 for a,b in zip(points,points[1:]):dist.append(dist[-1]+math.dist(a,b))
 # Height follows the same geographic ground data, with an endpoint-correct profile.
 h=lambda d:next((a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0])for a,b in zip(t['elev'],t['elev'][1:])if a[0]<=d<=b[0]),t['elev'][0][1])
 pe=[]
 for i,p in enumerate(points):
  station=(entry+span*dist[i]/dist[-1])%L;pe.append([round(p[0],4),round(p[1],4),round(h(station),4)])
 # Service positions lie on the longest straight part, not in an entry chicane.
 runs=[];run=[]
 for i in range(2,len(points)-2):
  a,b=points[i-2],points[i+2];v=[b[0]-a[0],b[1]-a[1]];u=[points[i][0]-a[0],points[i][1]-a[1]];k=abs(math.atan2(v[0],v[1])-math.atan2(u[0],u[1]));k=abs(math.atan2(math.sin(k),math.cos(k)))
  if k<.007 and dist[i]>35 and dist[i]<dist[-1]-35:run.append(i)
  else:
   if run:runs.append(run);run=[]
 if run:runs.append(run)
 run=max(runs,key=lambda r:dist[r[-1]]-dist[r[0]])if runs else list(range(int(len(points)*.3),int(len(points)*.7)))
 boxStart,boxEnd=dist[run[0]]+8,dist[run[-1]]-8
 if boxEnd-boxStart<30:boxStart,boxEnd=dist[-1]*.33,dist[-1]*.68
 side=1 if proj.near(points[run[len(run)//2]])[2]>0 else -1
 results[name]={'points':pe,'entry':entry,'exit':exit,'span':span,'side':side,'garageSide':side,'limit':60 if slug in ['baku','monza'] else 80,'boxStart':boxStart,'boxEnd':boxEnd,'half':4.2*1.2,'limitIn':min(60,boxStart-10),'limitOut':dist[-1]-40,'name':'Pit lane','slots':max(1,min(11,int((boxEnd-boxStart)/12))),'sourceWay':seed['id']}
 audit.append({'name':name,'status':'ready for map review','seed':seed['id'],'entry':round(entry),'exit':round(exit),'length':round(dist[-1]),'side':side,'boxLength':round(boxEnd-boxStart),'endpointErrors':[round(start[0],2),round(end[0],2)]})
 print(name,round(dist[-1]),'m pit','side',side)
(R/('mapped-extra-pits.json' if extra else 'mapped-pits.json')).write_text(json.dumps(results,ensure_ascii=False,separators=(',',':')));(R/('extra-pit-audit.json' if extra else 'pit-audit.json')).write_text(json.dumps(audit,indent=2))
