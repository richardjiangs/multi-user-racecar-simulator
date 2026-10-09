import json,math
from pathlib import Path
R=Path(__file__).resolve().parent;s=json.loads((R/'source-centerlines.json').read_text())
refs={'portimao':'pt-2008','imola':'it-1953','zandvoort':'nl-1948','shanghai':'cn-2004','barcelona':'es-1991','red-bull-ring':'at-1969','monza':'it-1922','circuit-of-the-americas':'us-2012','bahrain':'bh-2002','paul-ricard':'fr-1969','interlagos':'br-1940','baku':'az-2016','miami':'us-2022','hungaroring':'hu-1986','las-vegas':'us-2023'}
area=lambda p:sum(a[0]*b[1]-a[1]*b[0]for a,b in zip(p,p[1:]+p[:1]))
for name,t in s.items():
 slug=t['source'].split('/')[-1]
 if slug not in refs:continue
 f=R/'centerlines'/('bacinger-'+refs[slug]+'.geojson')
 if not f.exists():print(slug,'REF MISSING');continue
 p=json.load(open(f))['features'][0]['geometry']['coordinates'];q=t['points'];lon,lat=p[0];d=math.hypot((q[0][0]-lon)*111320*math.cos(math.radians(lat)),(q[0][1]-lat)*111320)
 print(slug,'direction', 'SAME'if area(p)*area(q)>0 else 'REVERSED','start difference',round(d))
