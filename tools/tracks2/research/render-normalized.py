import json,math
from pathlib import Path
R=Path(__file__).resolve().parent;t=json.load(open(R/'normalized-circuits.json'));p=json.load(open(R/'mapped-pits.json'));items=list(t.items())
for page in range(math.ceil(len(items)/9)):
 svg=['<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1500"><rect width="1800" height="1500" fill="#0d1921"/>']
 for i,(name,d)in enumerate(items[page*9:page*9+9]):
  pts=d['points'];xs=[v[0]for v in pts];ys=[v[1]for v in pts];scale=min(530/(max(xs)-min(xs)),425/(max(ys)-min(ys)));x0=i%3*600+35;y0=i//3*500+55
  X=lambda x:x0+(x-min(xs))*scale;Y=lambda y:y0+(max(ys)-y)*scale
  svg.append(f'<text x="{x0}" y="{y0-24}" fill="white" font-size="16">{name} / {d["L"]} m</text>')
  for pp,col,width in [(pts+[pts[0]],'#4eafac',4),(p.get(name,{}).get('points',[]),'#e9bd67',3)]:
   if pp:svg.append('<polyline fill="none" stroke="'+col+'" stroke-width="'+str(width)+'" points="'+' '.join(f'{X(v[0]):.2f},{Y(v[1]):.2f}'for v in pp)+'"/>')
  svg.append(f'<circle cx="{X(pts[0][0])}" cy="{Y(pts[0][1])}" r="6" fill="#ff6677"/>')
  for j in range(1,5):
   ix=int(len(pts)*j/5);a=pts[ix];b=pts[(ix+4)%len(pts)];psi=math.atan2(b[1]-a[1],b[0]-a[0]);x,y=X(a[0]),Y(a[1]);svg.append(f'<path d="M-6 -4L0 0L-6 4" transform="translate({x},{y}) rotate({-math.degrees(psi)})" fill="none" stroke="white" stroke-width="2"/>')
 svg.append('</svg>');(R/f'normalized-review-{page}.svg').write_text(''.join(svg))
