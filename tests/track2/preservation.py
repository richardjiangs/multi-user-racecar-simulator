from pathlib import Path
import hashlib,json,re
r=Path('.');originals=json.load(open('tests/track2/original-sim-hashes.json'));variants=json.load(open('tools/tracks2/manifest.json'));files=json.load(open('tools/tracks2/sim-files.json'));report=[]
for name,digest in originals.items():assert hashlib.sha256((r/name).read_bytes()).hexdigest()==digest,name
for key,name in variants.items():
 old=(r/files[key]).read_text();new=(r/name).read_text()
 for start,end in [('/* ===== audio','/* ===== physics'),('  function bindKeyboard()','  function bindMobilePad()')]:
  a=old[old.index(start):old.index(end,old.index(start))];b=new[new.index(start):new.index(end,new.index(start))];assert a==b,(key,start)
 if key!='f1mercedes':
  for svg in re.findall(r'<svg\b.*?</svg>',old,re.S):assert svg in new,(key,'original SVG art changed')
 report.append(key)
norm=lambda v:[norm(x)for x in v]if isinstance(v,list)else float(v or 0)if isinstance(v,(int,float))else v
old=json.load(open('tests/track2/original-geometry-hashes.json'));new=json.load(open('tools/tracks2/track-data.json'))
for name in old:
 for field in ['points','widths','L','labels']:assert old[name][field]==hashlib.sha256(json.dumps(norm(new[name][field]),separators=(',',':')).encode()).hexdigest(),(name,field)
assert set(files)-set(variants)=={'db5','f12tdf','phantom','spectre','dacia','fordraptor','grhilux','hunter'}
result={'originalFilesUnchanged':len(originals),'newVariants':len(report),'audioAndKeyboardUnchanged':True,'existingSvgArtUnchangedExceptMercedesPreview':True,'xyLengthsWidthsLabelsUnchanged':True,'excludedCarsUnchanged':True}
Path('tests/track2/preservation-results.json').write_text(json.dumps(result,indent=2));print(result)
