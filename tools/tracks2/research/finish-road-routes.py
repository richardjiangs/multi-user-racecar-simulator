"""Complete the remaining mapped roads and explicitly labelled reconstructions."""
import json,math,csv,ast,bisect
from pathlib import Path
from geometry_utils import xy,length,uniform
R=Path(__file__).resolve().parent
# Reuse connected-OSM helpers without running the extraction entry point.
module=ast.parse((R/'extract-extra.py').read_text());ns={'R':R,'json':json,'math':math}
exec('from collections import defaultdict\nimport heapq\nfrom geometry_utils import xy,length',ns)
for n in module.body:
 if isinstance(n,ast.FunctionDef) and n.name in ['read','join','shortest']:exec(compile(ast.Module(body=[n],type_ignores=[]),'helpers','exec'),ns)
read,join,shortest=[ns[k]for k in ['read','join','shortest']]
def crop(p,start,end):
 q=xy(p);ds=[0]
 for a,b in zip(q,q[1:]):ds.append(ds[-1]+math.dist(a,b))
 def at(d):
  i=max(0,min(len(p)-2,bisect.bisect_right(ds,d)-1));u=(d-ds[i])/(ds[i+1]-ds[i]);return[p[i][k]+u*(p[i+1][k]-p[i][k])for k in [0,1]]
 return[at(start)]+[v for v,d in zip(p,ds)if start<d<end]+[at(end)]
geo=json.loads((R/'extra-geographic.json').read_text())
w={v['id']:v for v in read('goodwood-hill')};p=join([w[36834888],w[61093898]],36834888);p=crop(p,165,2032)
geo['Goodwood Hillclimb']={'slug':'goodwood-hill','points':p,'L':1867,'closed':False,'width':2.9,'source':'https://www.goodwood.com/motorsport/festival-of-speed/','scene':'estate'}
w={v['id']:v for v in read('nevada')};p=join([w[k]for k in [295587111,1211992531,744638122]],295587111);p=crop(p,0,17700)
geo['Nevada State Route 160']={'slug':'nevada','points':p,'L':17700,'closed':False,'width':5.5,'source':'https://www.koenigsegg.com/history','scene':'arid'}
(R/'extra-geographic.json').write_text(json.dumps(geo,separators=(',',':')))
# These three are separate from the geographic importer to retain provenance.
out={}
def add(name,p,L,width,scene,source,notes,elev=None):
 pts,_,_=uniform(p,L,True);out[name]={'L':L,'closed':True,'points':pts,'src':source,'notes':notes,'elev':elev or [[0,0],[L,0]],'widths':[[0,width],[L,width]],'labels':[],'scene':scene,'pit':None}
p=[(622,467),(758,415),(802,394),(829,408),(813,448),(795,465),(719,504),(625,521),(526,541),(427,610),(334,669),(322,689),(273,696),(235,678),(214,651),(224,599),(232,541),(228,488),(224,432),(230,367),(246,350),(281,348),(301,363),(318,401),(346,441),(347,465),(329,505),(310,542),(288,579),(270,595),(272,614),(285,625),(304,615),(333,565),(371,503),(392,474),(411,465),(438,471),(501,493)]
add('Gotland Ring',[(x-622,467-y)for x,y in p],4100,6,'quarry','https://gotlandring.com/facility/','Southern Loop, 4.1 km. Hand-traced operator diagram; elevation is an illustrative quarry profile, not surveyed.',[[0,24],[400,30],[1100,12],[1800,5],[2200,18],[2700,9],[3200,12],[3650,26],[4100,24]])
rows=list(csv.reader((R/'centerlines/tum-Norisring.csv').read_text().splitlines()[1:]));p=[[float(v[0]),float(v[1])]for v in rows]
add('Norisring',p,2300,6,'street','https://github.com/TUMFTM/racetrack-database','TUM centreline; nominal 2.3 km configuration. Elevation and service facilities approximate.',[[0,0],[2300,0]])
out['Norisring']['pit']=[2130,140,1,60];out['Norisring']['serviceRange']=[-60,55]
# 1959 short AVUS: parallel long straights, tight south return and banked north loop.
# It is no longer a driveable raceway; do not imply modern motorway geometry is it.
p=[[-12,0],[-12,-3700],[-12,-3800],[-8,-3830],[8,-3840],[24,-3830],[28,-3800],[28,-3700],[28,-100],[50,0],[125,85],[145,145],[120,208],[58,230],[-5,207],[-48,158],[-46,102],[-24,55]]
add('AVUS Berlin',p,8300,5.5,'historic','https://www.berlin.de/ba-charlottenburg-wilmersdorf/ueber-den-bezirk/kultur-und-wissenschaft/skulpturen-und-denkmale/artikel.156596.php','Historic short-course reconstruction, not a survey. The two motorway straights, south hairpin and raised brick north bank are modelled explicitly.')
out['AVUS Berlin']['banking']={'maxSlope':math.tan(math.radians(43)),'curvatureScale':.01,'range':[7600,8300]};out['AVUS Berlin']['pit']=[8090,220,-1,60];out['AVUS Berlin']['serviceRange']=[-65,70]
(R/'normalized-special.json').write_text(json.dumps(out,separators=(',',':')))
print('Added two mapped roads and three documented reconstructions')
