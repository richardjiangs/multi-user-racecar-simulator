"""Export ODbL map context already researched for Track 2.0, in its local metres.
This is a map layer only; it never alters the drivable roads or collision meshes.
"""
from pathlib import Path
import json, math, xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[2];D=json.loads((R/'tools/tracks2/track-data.json').read_text());sources=R/'tools/tracks2/research/maps'
def simplify(p,tol=1.2):
 if len(p)<3:return p
 a,b=p[0],p[-1];dx,dz=b[0]-a[0],b[1]-a[1];den=dx*dx+dz*dz;best=0;index=0
 for i,c in enumerate(p[1:-1],1):
  u=max(0,min(1,((c[0]-a[0])*dx+(c[1]-a[1])*dz)/den))if den else 0
  d=math.hypot(c[0]-a[0]-u*dx,c[1]-a[1]-u*dz)
  if d>best:best,index=d,i
 return simplify(p[:index+1],tol)[:-1]+simplify(p[index:],tol)if best>tol else[a,b]

def classify(tags):
 if tags.get('building'):return 'building'
 if tags.get('natural') in ['water','wetland'] or tags.get('waterway')=='riverbank':return 'water'
 if tags.get('natural') in ['wood','scrub','grassland'] or tags.get('landuse') in ['forest','grass','meadow'] or tags.get('leisure') in ['park','garden','golf_course']:return 'green'
 if tags.get('highway') in ['primary','secondary','tertiary','unclassified','residential','living_street','service','trunk','motorway','pedestrian','footway','path','steps']:return 'road'
 if tags.get('waterway') in ['river','stream','canal']:return 'stream'
 return None
# Reuse the reviewed Monaco start datum and 1.0018765 uniform scale.
monaco=sources/'gps-monaco.json'
if not monaco.exists():
 root=ET.parse('/tmp/gps-monaco.osm').getroot();nodes={n.attrib['id']:{'lon':float(n.attrib['lon']),'lat':float(n.attrib['lat'])}for n in root.findall('node')}
 ways=[];coasts=[]
 for w in root.findall('way'):
  ids=[n.attrib['ref']for n in w.findall('nd')];tags={t.attrib['k']:t.attrib['v']for t in w.findall('tag')}
  if tags.get('natural')=='coastline':coasts.append(ids)
  if classify(tags)and all(n in nodes for n in ids):ways.append({'id':int(w.attrib['id']),'geometry':[nodes[n]for n in ids],'tags':tags})
 # OSM coastline keeps land on the left; close its offshore side beyond the map.
 ends={v[-1]for v in coasts};seq=next(v for v in coasts if v[0]not in ends)[:]
 while any(v[0]==seq[-1]for v in coasts):seq+=next(v for v in coasts if v[0]==seq[-1])[1:]
 sea=[nodes[n]for n in seq];sea.extend([{'lon':7.46,'lat':sea[-1]['lat']},{'lon':7.46,'lat':sea[0]['lat']},sea[0]])
 ways.append({'id':'monaco-sea','geometry':sea,'tags':{'natural':'water','name':'Mediterranean Sea'}})
 monaco.write_text(json.dumps({'elements':ways}))
origin=json.loads((R/'tools/gps/monaco-registration.json').read_text())['origin']
D['Circuit de Monaco']={**D['Circuit de Monaco'],'origin':origin,'geoScale':1.0018765,'sourceSlug':'gps-monaco'}
result={}
for name,t in D.items():
 src=sources/(t.get('sourceSlug','')+'.json')
 if not t.get('origin')or not src.exists():continue
 lon,lat=t['origin'];sc=t.get('geoScale',1);mx=111320*math.cos(math.radians(lat))*sc;mz=111320*sc
 pts=t['points'];xmin=min(p[0]for p in pts)-300;xmax=max(p[0]for p in pts)+300;zmin=min(p[1]for p in pts)-300;zmax=max(p[1]for p in pts)+300;features=[]
 for w in json.loads(src.read_text())['elements']:
  tags=w.get('tags',{});kind=classify(tags);raw=w.get('geometry',[])
  if not kind or len(raw)<2:continue
  p=[[(n['lon']-lon)*mx,(n['lat']-lat)*mz]for n in raw]
  if max(n[0]for n in p)<xmin or min(n[0]for n in p)>xmax or max(n[1]for n in p)<zmin or min(n[1]for n in p)>zmax:continue
  p=[[round(a,1),round(b,1)]for a,b in simplify(p,.5 if kind=='building' else 1.2)]
  features.append({'id':w['id'],'type':kind,'name':tags.get('name',''),'class':tags.get('highway',''),'points':p})
 if features:result[name]=features
out=R/'assets/gps';out.mkdir(exist_ok=True)
(out/'context.json').write_text(json.dumps({'license':'ODbL-1.0','copyright':'© OpenStreetMap contributors','source':'https://www.openstreetmap.org/copyright','routes':result},ensure_ascii=False,separators=(',',':')))
print(len(result),'mapped surroundings;',sum(map(len,result.values())),'features;', (out/'context.json').stat().st_size,'bytes')
