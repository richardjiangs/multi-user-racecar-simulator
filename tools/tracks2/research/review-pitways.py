"""Generate compact map sheets so selected pit roads can be checked visually."""
import json,math,html
from pathlib import Path
R=Path(__file__).resolve().parent;routes=json.loads((R/'source-centerlines.json').read_text());sheets=[]
for name,t in routes.items():
 slug=t['source'].split('/')[-1];file=R/'maps'/(slug+'.json')
 if not file.exists() or any(slug==x[0]for x in sheets):continue
 p=t['points'];lon,lat=p[0];fac=math.cos(math.radians(lat));conv=lambda pt,lon=lon,lat=lat,fac=fac:((pt[0]-lon)*fac*111320,(pt[1]-lat)*111320)
 mid=conv(p[0]);ways=[w for w in json.loads(file.read_text())['elements']if w.get('tags',{}).get('highway')=='raceway'];lines=[]
 for w in ways:
  pts=[conv([g['lon'],g['lat']])for g in w['geometry']]
  # Near the control line: include the last and first sections and adjacent pits.
  if min(math.hypot(x,y)for x,y in pts)>850:continue
  tags=w['tags'];named=any(x in ' '.join(tags.values()).lower()for x in ['pit','boxen']);lines.append((w['id'],pts,named))
 sheets.append((slug,p,lines,conv))
for page in range(math.ceil(len(sheets)/6)):
 out=['<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1440"><rect width="1500" height="1440" fill="#111c25"/>']
 for i,(name,p,lines,conv)in enumerate(sheets[page*6:page*6+6]):
  x0=i%3*500;y0=i//3*720;sc=.26;X=lambda x:x0+250+x*sc;Y=lambda y:y0+360-y*sc
  out+= [f'<svg x="{x0}" y="{y0}" width="500" height="720" viewBox="{x0} {y0} 500 720">',f'<text x="{x0+12}" y="{y0+24}" fill="white" font-size="20">{name}</text>']
  pp=[conv(q)for q in p];out.append('<polyline points="'+' '.join(f'{X(x):.1f},{Y(y):.1f}'for x,y in pp)+'" fill="none" stroke="#549089" stroke-width="5"/>')
  for wid,pts,named in lines:
   out.append('<polyline points="'+' '.join(f'{X(x):.1f},{Y(y):.1f}'for x,y in pts)+f'" fill="none" stroke="{"#ffc758" if named else "#d6dce0"}" stroke-width="1.5"/>')
   near=min(pts,key=lambda q:math.hypot(*q));x,y=near;out.append(f'<text x="{X(x)+3}" y="{Y(y)-4}" fill="{"#ffc758" if named else "#91a4b2"}" font-size="10">{wid}</text>')
  out.append(f'<circle cx="{X(0)}" cy="{Y(0)}" r="5" fill="#ff5968"/></svg>')
 out.append('</svg>');(R/f'pit-review-{page}.svg').write_text(''.join(out))
print(len(sheets),'layouts')
