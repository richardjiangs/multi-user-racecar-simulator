"""Obtain mapped pit roads for review; read-only public OSM queries, cached locally."""
import json,subprocess,time
from pathlib import Path
R=Path(__file__).resolve().parent
sources=json.loads((R/'source-centerlines.json').read_text());out=R/'pitways';out.mkdir(exist_ok=True)
seen=set()
for name,t in sources.items():
 slug=t['source'].split('/')[-1]
 if slug in seen:continue
 seen.add(slug);dst=out/(slug+'.json')
 if dst.exists():continue
 p=t['points'];xs=[v[0]for v in p];ys=[v[1]for v in p]
 box=','.join(map(str,[min(ys)-.002,min(xs)-.002,max(ys)+.002,max(xs)+.002]))
 query=f'[out:json][timeout:75];(way[highway=raceway]({box});way[service=pit_lane]({box}););out tags geom;'
 for attempt in range(3):
  result=subprocess.run(['curl','-fLsS','--max-time','100','-G','https://overpass.kumi.systems/api/interpreter','--data-urlencode','data='+query],capture_output=True)
  if result.returncode==0:
   try:
    data=json.loads(result.stdout);assert 'elements' in data;dst.write_bytes(result.stdout);print(slug,len(data['elements']),flush=True);break
   except Exception:pass
  print(slug,'retry',attempt,flush=True);time.sleep(3)
 time.sleep(1)
