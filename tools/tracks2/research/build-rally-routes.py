"""Full-distance 2026 Dakar special-stage reconstructions.
The organiser publishes overview maps, not a reusable GPS roadbook. Broad stage
headings, distances and terrain types follow cited reports; local bends, sector
boundaries and elevation are authored approximations. They must stay labelled.
All geometry is computed here, never generated as the player drives.
"""
import json,math
from pathlib import Path
from geometry_utils import uniform
R=Path(__file__).resolve().parent
BASE='https://portal.toyota-body.co.jp/dakar/en/news/2026/'
# points follow the broad stage itinerary, not precise geographic coordinates.
# Terrain stations (km) are illustrative except explicit neutralisation/service.
rows=[
('Prologue — Yanbu',22,'01',[(0,0),(4,7),(9,9),(13,5),(11,-1),(4,-2),(.3,-.3)],[(0,'piste'),(5,'canyon'),(9,'rock'),(13,'sand'),(18,'piste')],[60,190,230,80,60]),
('Stage 2 — Yanbu to AlUla',400,'03',[(0,0),(22,30),(14,60),(45,75),(63,115),(58,157),(83,192),(69,225),(84,265)],[(0,'gravel'),(46,'wadi'),(112,'rock'),(167,'canyon'),(220,'gravel'),(286,'wadi'),(320,'sand'),(365,'rock')],[280,650,980,720,860]),
('Stage 3 — AlUla',421,'04',[(0,0),(-25,32),(-18,85),(5,118),(48,110),(60,70),(48,30),(15,4),(1,-1)],[(0,'sand'),(75,'gravel'),(130,'rock'),(190,'fesh'),(258,'canyon'),(319,'rock'),(382,'piste')],[700,1050,1280,910,700]),
('Stage 4 — AlUla Marathon',452,'05',[(0,0),(-15,45),(8,83),(44,91),(65,75),(98,90),(108,127),(140,151)],[(0,'piste'),(65,'rock'),(129,'sand'),(204,'gravel'),(265,'wadi'),(322,'sand'),(396,'gravel')],[720,1160,980,1230,1050]),
('Stage 5 — AlUla to Hail',371,'06',[(0,0),(27,-14),(51,-48),(82,-54),(111,-41),(125,-15),(158,4),(188,2)],[(0,'rock'),(64,'wadi'),(118,'gravel'),(185,'piste'),(256,'sand'),(319,'piste')],[1110,970,1100,940,1010]),
('Stage 6 — Hail to Riyadh',326,'07',[(0,0),(43,-4),(65,-22),(76,-68),(99,-91),(117,-103),(147,-140),(174,-145)],[(0,'sand'),(28,'dunes'),(78,'transfer'),(129,'sand'),(163,'dunes'),(224,'sand'),(271,'dunes'),(313,'piste')],[870,780,750,690,590]),
('Stage 7 — Riyadh to Wadi Ad Dawasir',459,'09',[(0,0),(-38,-30),(-83,-58),(-100,-106),(-92,-152),(-75,-193),(-82,-243)],[(0,'gravel'),(95,'piste'),(184,'dunes'),(224,'gravel'),(301,'grove'),(361,'piste'),(412,'rock')],[660,740,790,700,710]),
('Stage 8 — Wadi Ad Dawasir',483,'10',[(0,0),(-31,-29),(-70,-62),(-84,-112),(-58,-135),(-17,-130),(7,-96),(1,-49),(.5,-1)],[(0,'dunes'),(85,'sand'),(148,'rock'),(220,'sand'),(287,'canyon'),(350,'dunes'),(400,'wadi'),(448,'gravel')],[710,650,890,1120,710]),
('Stage 9 — Wadi Ad Dawasir to Bisha',410,'11',[(0,0),(-27,4),(-43,26),(-39,55),(-68,84),(-99,84),(-127,65)],[(0,'sand'),(81,'dunes'),(118,'gravel'),(188,'wadi'),(254,'rock'),(312,'piste'),(350,'dunes')],[780,870,1180,1060,940]),
('Stage 11 — Bisha to Al-Hanakiya',346,'13',[(0,0),(-33,2),(-57,22),(-62,62),(-74,106),(-90,137),(-98,186)],[(0,'gravel'),(73,'rock'),(115,'wadi'),(151,'salt'),(215,'gravel'),(271,'wadi'),(310,'rock')],[1200,1050,960,920,830]),
('Stage 13 — Yanbu Finish',105,'15',[(0,0),(16,12),(27,1),(22,-23),(11,-34),(3,-30),(-7,-13),(-4,2)],[(0,'gravel'),(18,'rock'),(39,'wadi'),(55,'coast'),(84,'piste')],[80,250,120,40,20])]
out={}
for index,(name,km,issue,controls,sectors,heights) in enumerate(rows):
 L=km*1000
 # Schematic overview scaled to the actual special-stage distance. Local bends
 # provide navigation through the described terrain, without claiming GPS fidelity.
 macro,_,_=uniform([(x*1000,z*1000)for x,z in controls],L,False,spacing=400)
 detail=[]
 for i,(x,z)in enumerate(macro):
  a=macro[max(0,i-1)];b=macro[min(len(macro)-1,i+1)];psi=math.atan2(b[0]-a[0],b[1]-a[1]);d=L*i/(len(macro)-1);edge=math.sin(math.pi*i/(len(macro)-1))**2
  # Fixed survey-unknown local terrain interpretation, 1–4 km bend wavelengths.
  n=edge*(85*math.sin(d/1700+index)+28*math.sin(d/530+index*.7)+12*math.sin(d/190))
  detail.append((x+math.cos(psi)*n,z-math.sin(psi)*n))
 pts,_,_=uniform(detail,L,False,spacing=8)
 def kind(d):return next((v for start,v in reversed(sectors)if d>=start*1000),sectors[0][1])
 elev=[];N=math.ceil(L/32)
 for i in range(N+1):
  d=L*i/N;q=d/L*(len(heights)-1);j=min(len(heights)-2,int(q));u=q-j;base=heights[j]+(heights[j+1]-heights[j])*u
  k=kind(d);amp={'dunes':12,'sand':2.6,'canyon':6,'wadi':1.3,'rock':3,'gravel':1.7,'piste':1,'fesh':1,'grove':.8,'salt':.04,'coast':.5,'transfer':.12}[k]
  # Fade relief over 400 m at sector boundaries; road and mesh share these keys.
  boundary=min([abs(d-start*1000)for start,_ in sectors]+[d,L-d]);fade=min(1,boundary/400)
  relief=amp*(math.sin(d/160+index)*.62+math.sin(d/73+index*.3)*.28+math.sin(d/41)*.10)*fade
  elev.append([round(d,3),round(base+relief,3)])
 out[name]={'L':L,'closed':False,'src':BASE+issue+'.html','points':pts,'elev':elev,'widths':[[0,6],[L,6]],'widthScale':1.2,'labels':[],'pit':None,'fence':False,'terrain':'rally','scene':'desert','sectors':[[int(d*1000),k]for d,k in sectors], 'notes':'Full-distance 2026 special-stage reconstruction from organiser overview and team reports. Local bends, elevation and terrain-sector boundaries are illustrative; no GPS roadbook was available. Liaisons are excluded.'}
 if issue=='07':out[name]['neutralized']=[[78000,129000]];out[name]['notes']+=' Includes the 51 km untimed paved transfer, excluded from the stage clock.'
 if issue in ['05','06','11']:out[name]['marathon']=True
 if issue=='03':out[name]['serviceZones']=[[142000,144000]]
 if issue=='13':out[name]['serviceZones']=[[189500,190500]]
(R/'normalized-rally.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')))
print('Built',len(out),'full-distance stages;',sum(v['L']for v in out.values())/1000,'km; all reconstruction limitations retained')
