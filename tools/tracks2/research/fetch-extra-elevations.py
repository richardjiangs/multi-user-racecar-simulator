"""Cache public SRTM terrain heights for checking circuit gradients.

SRTM is a coarse terrain model, not a track survey. Bridge decks, banked roads,
retaining walls and known sharp elevation changes require separate review.
"""
from pathlib import Path
import json, math, time, subprocess, urllib.parse

ROOT=Path(__file__).resolve().parent
routes=json.loads((ROOT/'extra-geographic.json').read_text())
out=ROOT/'elevations';out.mkdir(exist_ok=True)
seen={}
for name,t in routes.items():
    source=t['slug'];file=out/(source+'.json')
    if file.exists():continue
    points=t['points'];lat=points[0][1];dist=[0]
    for a,b in zip(points,points[1:]):
        dist.append(dist[-1]+math.hypot((a[0]-b[0])*111320*math.cos(math.radians(lat)),(a[1]-b[1])*111320))
    count=min(98,max(24,math.ceil(dist[-1]/90)))
    samples=[];index=0
    for i in range(count):
        station=dist[-1]*i/(count-1)
        while index<len(points)-2 and dist[index+1]<station:index+=1
        a,b=points[index:index+2];u=(station-dist[index])/max(.001,dist[index+1]-dist[index])
        samples.append([round(a[k]+u*(b[k]-a[k]),7) for k in [0,1]])
    locations='|'.join(f'{lat},{lon}'for lon,lat in samples)
    url='https://api.opentopodata.org/v1/srtm90m?'+urllib.parse.urlencode({'locations':locations,'interpolation':'bilinear'})
    r=subprocess.run(['curl','-fLsS','--max-time','35',url],capture_output=True,text=True)
    if r.returncode:print('FAILED',name,r.stderr,flush=True);continue
    try:response=json.loads(r.stdout)
    except ValueError:print('FAILED JSON',name,flush=True);continue
    if response.get('status')!='OK' or any(v.get('elevation') is None for v in response.get('results',[])):
        print('FAILED DATA',name,response.get('status'),flush=True);continue
    file.write_text(json.dumps({'source':'https://www.opentopodata.org/datasets/srtm/','resolutionM':90,'name':name,'samples':[[i/(count-1),v['elevation']] for i,v in enumerate(response['results'])],'response':response},separators=(',',':')))
    print(name,'saved',len(response['results']),'terrain samples',flush=True)
    time.sleep(1.1)
