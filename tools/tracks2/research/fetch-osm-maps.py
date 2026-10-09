"""Cache OSM map extracts. Keep selected road geometry and attribution for review."""
from pathlib import Path
import json,subprocess,xml.etree.ElementTree as ET,time
R=Path(__file__).resolve().parent;sources=json.loads((R/'source-centerlines.json').read_text());out=R/'maps';out.mkdir(exist_ok=True)
regions={}
for name,t in sources.items():
 slug=t['source'].split('/')[-1];xs=[p[0]for p in t['points']];ys=[p[1]for p in t['points']];regions[slug]=[min(xs)-.001,min(ys)-.001,max(xs)+.001,max(ys)+.001]
regions.update({'ehra':[10.7,52.6,10.86,52.76],'gotland':[18.77,57.78,18.93,57.90],'bathurst':[149.54,-33.46,149.58,-33.42],'mira':[-1.49,52.55,-1.44,52.585],'goodwood-hill':[-.76,50.84,-.71,50.89],'furka':[8.32,46.54,8.54,46.62],'landing-facility':[-80.74,28.56,-80.64,28.67],'nevada':[-115.93,35.97,-115.46,36.30],'ferrari-museum':[10.851,44.525,10.865,44.535],'avus':[13.23,52.437,13.29,52.505]})
for slug,(lat,lon) in json.loads((R/'osm-places.json').read_text()).items():
 if slug not in regions:regions[slug]=[lon-.025,lat-.02,lon+.025,lat+.02]
regions.update({'donington':[-1.40,52.82,-1.35,52.85],'brands-hatch':[.23,51.34,.28,51.38],'hockenheim':[8.55,49.315,8.61,49.35],'norisring':[11.10,49.42,11.15,49.45]})
def fetch_region(name,bbox,depth=0):
 url='https://api.openstreetmap.org/api/0.6/map?bbox='+','.join(map(str,bbox))
 cache=out/(name+('-'+str(depth) if depth else '')+'.osm')
 r=subprocess.run(['curl','-fLsS','--max-time','45',url],capture_output=True)
 if r.returncode:
  if depth>=5:return []
  print(name,'split',depth,flush=True);x0,y0,x1,y1=bbox
  if (x1-x0)*.7>y1-y0:
   m=(x0+x1)/2;boxes=[[x0,y0,m,y1],[m,y0,x1,y1]]
  else:
   m=(y0+y1)/2;boxes=[[x0,y0,x1,m],[x0,m,x1,y1]]
  return sum((fetch_region(name+'-'+str(i),box,depth+1)for i,box in enumerate(boxes)),[])
 try:root=ET.fromstring(r.stdout)
 except ET.ParseError:return []
 nodes={int(n.attrib['id']):{'lon':float(n.attrib['lon']),'lat':float(n.attrib['lat'])}for n in root.findall('node')};ways=[]
 for w in root.findall('way'):
  tags={t.attrib['k']:t.attrib['v']for t in w.findall('tag')}
  if not any(k in tags for k in ['highway','aeroway','barrier','building','natural','waterway']):continue
  ids=[int(n.attrib['ref'])for n in w.findall('nd')]
  if not all(i in nodes for i in ids):continue
  ways.append({'id':int(w.attrib['id']),'nodes':ids,'geometry':[nodes[i]for i in ids],'tags':tags})
 time.sleep(.7);return ways
for name,bbox in regions.items():
 file=out/(name+'.json')
 if file.exists():continue
 ways=fetch_region(name,bbox);ways=list({w['id']:w for w in ways}.values())
 if not ways:print(name,'FAILED',flush=True);continue
 file.write_text(json.dumps({'source':'https://api.openstreetmap.org/api/0.6/map','bbox':bbox,'copyright':'© OpenStreetMap contributors','license':'ODbL 1.0','elements':ways},separators=(',',':')));print(name,len(ways),'features',flush=True)
