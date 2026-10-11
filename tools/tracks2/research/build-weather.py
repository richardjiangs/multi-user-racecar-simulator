"""January station-hour climatology; observed nearby-airport proxy, not route forecasts."""
import csv,json,subprocess,re,concurrent.futures,datetime,hashlib,statistics
from pathlib import Path
R=Path(__file__).resolve().parent;cache=Path('/tmp/dakar-metar');cache.mkdir(exist_ok=True)
stations={'OEYN':['Yanbu',24.144,38.063],'OEAO':['AlUla',26.483,38.119],'OEHL':['Hail',27.438,41.686],'OERK':['Riyadh',24.957,46.699],'OEWD':['Wadi Ad Dawasir',20.504,45.199],'OEBH':['Bisha',19.984,42.621]}
def fetch(year):
 p=cache/f'jan-{year}.csv';u='https://mesonet.agron.iastate.edu/cgi-bin/request/asos.py?'+ '&'.join('station='+s for s in stations)+f'&data=metar&year1={year}&month1=1&day1=1&year2={year}&month2=2&day2=1&tz=Etc%2FUTC&format=onlycomma&latlon=no&elev=no&missing=M&trace=T&direct=no&report_type=3&report_type=4'
 if not p.exists():subprocess.run(['curl','--fail','--retry','2','--max-time','180','-sS',u,'-o',str(p)],check=True)
 rows=list(csv.DictReader(p.open()));assert rows and 'metar' in rows[0]
 print(year,len(rows),flush=True);return rows,{'year':year,'url':u,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
results=list(concurrent.futures.ThreadPoolExecutor(max_workers=3).map(fetch,range(2016,2026)));by={k:{} for k in stations}
for rows,_ in results:
 for row in rows:
  st=row['station'];hour=row['valid'][:13];text=row['metar'];tokens=text.split();kind='clear'
  # Rain takes priority for the mutually exclusive simulation state; samples
  # with no valid visibility/wind or missing METAR are not valid observations.
  if not re.search(r'\b(?:\d{5}|VRB\d\d)(?:G\d\d)?KT\b',text):continue
  if any(re.fullmatch(r'[+-]?(?:VC)?(?:TS|SH|FZ)?(?:RA|DZ|RASN|SNRA|RAGR|RAGS)',t) for t in tokens):kind='rain'
  elif any(re.fullmatch(r'[+-]?(?:VC)?(?:DS|SS)',t) for t in tokens):kind='storm'
  elif any(re.fullmatch(r'[+-]?(?:BL|DR)?(?:DU|SA)',t) for t in tokens):kind='dust'
  old=by[st].get(hour);minute=int(row['valid'][14:16]);rank=abs(minute-0)
  if old is None or rank<old[0]:by[st][hour]=(rank,kind,text)
output={'period':'January 2016–2025','method':'Nearest top-of-hour valid routine/SPECI METAR per station-hour. Weather-token category; missing hours excluded. Nearby airport proxy, not exact Dakar route climatology.','source':'Iowa Environmental Mesonet international METAR archive','requests':[r[1] for r in results],'stations':{}}
for st,hours in by.items():
 counts={k:0 for k in ['clear','rain','dust','storm']};runs={k:[] for k in counts};run=0;last=None;prev=None
 for hour,(_,kind,text) in sorted(hours.items()):
  counts[kind]+=1;dt=datetime.datetime.strptime(hour,'%Y-%m-%d %H')
  if kind==last and (dt-prev).total_seconds()==3600:run+=1
  else:
   if last:runs[last].append(run)
   last=kind;run=1
  prev=dt
 if last:runs[last].append(run)
 n=sum(counts.values());assert n>5000,(st,n)
 observed={}
 for kind in counts:
  winds=[];visibility=[]
  for _,k,text in hours.values():
   if k!=kind:continue
   m=re.search(r'\b(?:\d{3}|VRB)(\d{2,3})(?:G(\d{2,3}))?KT\b',text)
   if m:winds.append(int(m[1])*.514444)
   vis=next((int(t) for t in text.split() if re.fullmatch(r'\d{4}',t)),None)
   if 'CAVOK' in text or vis==9999:vis=10000
   if vis is not None:visibility.append(vis)
  observed[kind]={'windMps':statistics.median(winds) if winds else None,'visibilityM':statistics.median(visibility) if visibility else None,'samples':len(winds)}

 output['stations'][st]={'name':stations[st][0],'lat':stations[st][1],'lon':stations[st][2],'hours':n,'observed':observed,'counts':counts,'probability':{k:v/n for k,v in counts.items()},'durationHours':{k:sum(v)/len(v) if v else 1 for k,v in runs.items()}}
 print(st,n,counts,flush=True)
(R/'weather/january-climatology.json').write_text(json.dumps(output,indent=2)+'\n')
