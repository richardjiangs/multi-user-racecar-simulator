"""Constrain coarse terrain samples using independently published road gradients.
Fits continuous profiles locally; does not globally flatten the elevation range.
Run after assemble-circuits.py, before the world export.
"""
import json,math,bisect
from pathlib import Path
R=Path(__file__).resolve().parent;p=R.parent/'track-data.json';data=json.loads(p.read_text())
originals={};pits={}
for suffix in ['circuits','extra','cinematic']:originals.update(json.loads((R/('normalized-'+suffix+'.json')).read_text()))
for filename in ['mapped-pits.json','mapped-extra-pits.json']:pits.update(json.loads((R/filename).read_text()))
limits={'Furka Pass':(.11,.11),'Sportsland SUGO':(.10,.10),'Fuji Speedway':(.1005,.0888),'Mount Panorama, Bathurst':(1/6,1/6),'Mission — Furka Pass & Auric Enterprises, 1964':(.11,.11)}
def linear(keys,d):
 i=max(0,min(len(keys)-2,bisect.bisect_right([v[0]for v in keys],d)-1));a,b=keys[i:i+2];return a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0])
def maxgrad(v,ds,closed):
 n=len(v);slopes=[]
 for i in range(n):
  if not closed and i in [0,n-1]:s=(v[1]-v[0])/ds if i==0 else(v[-1]-v[-2])/ds
  else:
   a=(v[i]-v[(i-1)%n])/ds;b=(v[(i+1)%n]-v[i])/ds;s=0 if a*b<=0 else 2*a*b/(a+b)
  slopes.append(s)
 low=high=0
 for i in range(n if closed else n-1):
  j=(i+1)%n;dv=(v[j]-v[i])/ds;ma,mb=slopes[i],slopes[j]
  for k in range(11):
   u=k/10;g=6*u*(1-u)*dv+(3*u*u-4*u+1)*ma+(3*u*u-2*u)*mb;low=min(low,g);high=max(high,g)
 return low,high
for name,(down,up)in limits.items():
 t=data[name];original=originals[name]['elev'];L=t['L'];closed=t['closed'];N=math.ceil(L/10);ds=L/N;v=[linear(original,i*ds)for i in range(N if closed else N+1)]
 # Alternating projection bounds each adjacent height difference; a final
 # convolution removes SRTM stair steps without introducing any new extreme.
 def fit(factor):
  out=v[:];lo=-down*ds*factor;hi=up*ds*factor
  for _ in range(12):
   for ids in [range(len(out)if closed else len(out)-1),range(len(out)-2,-1,-1)]:
    for i in ids:
     j=(i+1)%len(out);delta=out[j]-out[i];error=delta-max(lo,min(hi,delta));out[j]-=error
  for _ in range(3):out=[(out[max(0,i-1)if not closed else(i-1)%len(out)]+2*out[i]+out[min(len(out)-1,i+1)if not closed else(i+1)%len(out)])/4 for i in range(len(out))]
  return out
 factor=.99
 for attempt in range(24):
  new=fit(factor);mi,ma=maxgrad(new,ds,closed)
  if mi>=-down-.0001 and ma<=up+.0001:break
  factor*=min(down/max(down,-mi),up/max(up,ma))*.995
 assert mi>=-down-.0001 and ma<=up+.0001,(name,mi,ma)
 if name=='Sportsland SUGO':
  lo=min(new);span=max(new)-lo;new=[lo+(h-lo)*min(1,69.83/span)for h in new]
  mi,ma=maxgrad(new,ds,closed)
 keys=[[round(i*ds,6),round(h,6)]for i,h in enumerate(new)]
 if closed:keys.append([L,keys[0][1]])
 else:keys[-1][0]=L
 if name in pits:t['mappedPit']=pits[name]
 if t.get('mappedPit'):
  pts=t['points'];grid={}
  for i,(x,z)in enumerate(pts):grid.setdefault((math.floor(x/40),math.floor(z/40)),[]).append(i)
  for v in t['mappedPit']['points']:
   x,z=v[:2];gx,gz=math.floor(x/40),math.floor(z/40);candidates=[i for a in range(-4,5)for b in range(-4,5)for i in grid.get((gx+a,gz+b),[])]
   if not candidates:continue
   i=min(candidates,key=lambda i:math.dist(pts[i],[x,z]));d=i/len(pts)*L;v[2]+=linear(keys,d)-linear(original,d)
 t['elev']=keys;t['gradientLimits']={'descent':down,'ascent':up};t['notes']=t['notes'].split(' Coarse terrain heights are fitted')[0]+' Coarse terrain heights are fitted within published gradient bounds (film set uses the pass bound).'
 print(name,round(mi*100,2),round(ma*100,2),flush=True)
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
