"""Anchor fictional mission spines to permanent world coordinates.
Mission station distances/objectives and specialised hand-drawn sets stay intact.
These are film-inspired routes, explicitly not public-road replicas.
"""
import json,math
from pathlib import Path
R=Path(__file__).resolve().parent
routes=json.loads((R/'cinematic-routes.json').read_text());stages=json.loads((R/'cinematic-stages.json').read_text());out={}
for name,c in routes.items():
 L=c['dist'];N=math.ceil(L/2);ds=L/N;x=z=psi=0;pts=[[0,0]]
 for i in range(N):
  d=(i+.5)*ds;k=0
  for cc in c['track']:
   u=(d-cc['at'])/cc['len']
   if 0<=u<=1:k+=cc['dir']*math.radians(cc['deg'])/cc['len']*(1-math.cos(2*math.pi*u))
  k=max(-.062,min(.062,k));x+=math.sin(psi+k*ds/2)*ds;z+=math.cos(psi+k*ds/2)*ds;psi+=k*ds;pts.append([round(x,6),round(z,6)])
 museum=name.startswith('Museo');ss=[{k:v for k,v in s.items()if k in ['from','to','surf','name','cap']}for s in stages.get(name,{}).get('stages',[])]
 widths=[[0,c['widthM']/2],[L,c['widthM']/2]]
 elev=[[0,0],[L,0]]
 # These heights describe the authored sets, never claim location survey data.
 if 'Furka' in name:elev=[[0,1300],[900,1410],[2200,1610],[3000,1500],[3600,1450],[6300,1450],[7300,1510],[L,1460]]
 if 'Matera' in name:elev=[[0,395],[1100,410],[1500,405],[2050,380],[2900,388],[3300,379],[4100,370],[L,365]]
 out[name]={'L':L,'closed':False,'points':pts,'elev':elev,'widths':widths,'labels':[],'pit':None,'fence':False,'scene':'museum'if museum else'cinematic','stages':ss,'notes':'Fictional exhibition drive.'if museum else'Film-inspired mission reconstruction. Locations are authored sets; distances and mission objectives retain the original story timing. Not a surveyed public road.','src':'docs/TRACK2_SOURCES.md'}
(R/'normalized-cinematic.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')));print('Anchored',len(out),'cinematic routes')
