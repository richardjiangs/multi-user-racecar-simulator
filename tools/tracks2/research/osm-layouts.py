"""Enumerate mapped raceway cycles for manual layout review.

Length ranks candidates; it does NOT certify that a candidate is the right layout.
Way IDs and alternatives are kept in the audit so junction choices are reviewable.
"""
from pathlib import Path
from collections import defaultdict, Counter
import json, math,sys

ROOT = Path(__file__).resolve().parent
ways_by_place = json.loads((ROOT/'osm-separated.json').read_text())
targets = {'modena':2007,'ehra':21000,'fiorano':2976,'gotland':7300,
 'goodwood':3809,'dunsfold':2820,'balocco':5750,'anding':4025,
 'motegi':4801,'okayama':3703,'hethel':3540,'grobnik':4168,'varano':2350,
 'tsukuba':2045,'sugo':3586,'willow':4023,'sachsenring':3671,'motorland':5344,
 'vir-grand':6760}
suffix=''
if '--additions' in sys.argv:
    targets={'brands-hatch':3908,'donington':4020}
    ways_by_place={name:[w for w in json.loads((ROOT/'maps'/(name+'.json')).read_text())['elements'] if w['tags'].get('highway')=='raceway' and w['tags'].get('area')!='yes'] for name in targets}
    suffix='-additions'

def metres(a,b):
    return math.hypot((a[0]-b[0])*111320*math.cos(math.radians((a[1]+b[1])/2)),(a[1]-b[1])*111320)

result={}
for place,target in targets.items():
    ways=ways_by_place[place]
    # Exclude known pit roads and karting; they remain in the downloaded source.
    ways=[w for w in ways if not any(s in w.get('tags',{}).get('name','').lower()
          for s in ['pit lane','boxengasse','kart','ピット','パドック','automodellismo'])]
    coords={n:[p['lon'],p['lat']] for w in ways for n,p in zip(w['nodes'],w['geometry'])}
    membership=Counter(n for w in ways for n in set(w['nodes']))
    cuts={n for n,c in membership.items() if c>1}|{w['nodes'][0] for w in ways}|{w['nodes'][-1] for w in ways}
    edges=[];graph=defaultdict(list)
    for w in ways:
        nodes=w['nodes'];start=0
        for i in range(1,len(nodes)):
            if nodes[i] not in cuts:continue
            part=nodes[start:i+1];start=i
            if len(part)<2:continue
            length=sum(metres(coords[a],coords[b])for a,b in zip(part,part[1:]))
            e={'nodes':part,'way':w['id'],'length':length,'name':w.get('tags',{}).get('name','')}
            idx=len(edges);edges.append(e);graph[part[0]].append((idx,False,part[-1]))
            if place=='brands-hatch' or w.get('tags',{}).get('oneway')!='yes':graph[part[-1]].append((idx,True,part[0]))
    cycles={};visits=0
    for root in list(graph):
        def walk(node,used,seen,path,total):
            global visits
            visits+=1
            if visits>250000 or total>target*1.15 or len(path)>90:return
            for index,rev,end in graph[node]:
                if index in used:continue
                edge=edges[index];length=total+edge['length'];seq=path+[(index,rev)]
                if end==root and length>target*.45:
                    signature=tuple(sorted(used|{index}))
                    if signature not in cycles:cycles[signature]=(length,seq)
                elif end not in seen and end>=root:
                    walk(end,used|{index},seen|{end},seq,length)
        walk(root,set(),{root},[],0)
        if visits>250000:break
    candidates=[]
    for length,path in sorted(cycles.values(),key=lambda x:abs(x[0]-target))[:8]:
        nodes=[]
        for index,reverse in path:
            part=edges[index]['nodes'];part=part[::-1] if reverse else part
            nodes.extend(part[:-1])
        nodes.append(nodes[0])
        candidates.append({'length':round(length,2),'ways':[edges[i]['way']for i,r in path],
                           'points':[coords[n]for n in nodes]})
    result[place]={'targetForReview':target,'candidates':candidates,'searchLimitReached':visits>250000}
    print(place,'candidates',len(cycles),'best',[c['length']for c in candidates[:3]])
(ROOT/('osm-layout-candidates'+suffix+'.json')).write_text(json.dumps(result,separators=(',',':')))

# A contact sheet exposes wrong loops, shortcuts and accidental pit-lane choices.
svg=['<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600"><rect width="1600" height="1600" fill="#111b20"/>']
for i,(name,info) in enumerate(result.items()):
    x=i%4*400;y=i//4*320
    svg.append(f'<text x="{x+14}" y="{y+22}" fill="white" font-size="17">{name} / target {info["targetForReview"]}</text>')
    if not info['candidates']:continue
    c=info['candidates'][0];p=c['points'];lat=p[0][1];p=[((a-p[0][0])*math.cos(math.radians(lat)),b-p[0][1])for a,b in p]
    xs=[v[0]for v in p];ys=[v[1]for v in p];scale=min(355/max(.00001,max(xs)-min(xs)),240/max(.00001,max(ys)-min(ys)))
    pts=' '.join(f'{x+20+(a-min(xs))*scale:.1f},{y+285-(b-min(ys))*scale:.1f}'for a,b in p)
    svg.append(f'<polyline points="{pts}" stroke="#62debb" fill="none" stroke-width="2.2"/><text x="{x+14}" y="{y+310}" fill="#adbbbd" font-size="13">mapped {c["length"]:.0f} m • review required</text>')
svg.append('</svg>');(ROOT/('osm-layout-review'+suffix+'.svg')).write_text(''.join(svg))
