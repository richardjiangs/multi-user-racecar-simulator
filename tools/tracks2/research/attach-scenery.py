"""Add mapped building footprints to the fixed worlds; unknown heights are modelled."""
import json,math,re
from pathlib import Path
from geometry_utils import xy
R=Path(__file__).resolve().parent;p=R.parent/'track-data.json';data=json.loads(p.read_text());total=0
for name,t in data.items():
 slug=t.get('sourceSlug');src=R/'maps'/((slug or '')+'.json')
 if not src.exists()or not t.get('origin'):continue
 grid={};scale=t['geoScale'];points=t['points'];N=len(points)
 for i in range(0,N,8):
  x,z=points[i];grid.setdefault((math.floor(x/150),math.floor(z/150)),[]).append((x,z,i))
 buildings=[]
 for w in json.loads(src.read_text())['elements']:
  tags=w.get('tags',{});g=w.get('geometry',[])
  if not(tags.get('building')or tags.get('leisure')=='grandstand')or len(g)<4:continue
  poly=[[round(a*scale,3),round(b*scale,3)]for a,b in xy([[v['lon'],v['lat']]for v in g],t['origin'])]
  if poly[0]==poly[-1]:poly.pop()
  x=sum(v[0]for v in poly)/len(poly);z=sum(v[1]for v in poly)/len(poly);gx,gz=math.floor(x/150),math.floor(z/150);near=[v for dx in range(-3,4)for dz in range(-3,4)for v in grid.get((gx+dx,gz+dz),[])]
  if not near:continue
  q=min(near,key=lambda v:(v[0]-x)**2+(v[1]-z)**2);dist=math.hypot(x-q[0],z-q[1])
  if dist>450:continue
  # Do not turn imprecise building edges into road obstructions; physical fences
  # remain the only static collision objects, as requested.
  def number(v,default):
   m=re.match(r'^[\d.]+',str(v));return float(m[0])if m else default
  height=number(tags.get('height'),number(tags.get('building:levels'),2)*3.2)
  buildings.append({'id':w['id'],'points':poly,'height':round(min(160,max(2.5,height)),2),'name':tags.get('name',''),'at':round(q[2]/(N if t.get('closed') else N-1)*t['L'],2),'type':tags.get('building',tags.get('leisure'))})
 t['buildings']=buildings;total+=len(buildings)
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')));print('Mapped',total,'building footprints; unspecified heights remain modelled')
