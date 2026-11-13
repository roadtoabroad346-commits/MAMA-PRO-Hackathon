#!/usr/bin/env python3
"""Read-only consistency proof for the initialization snapshot (stdlib only)."""
from pathlib import Path
import collections,csv,hashlib,json,re,subprocess,sys
R=Path(__file__).resolve().parents[2];D=R/'docs/AI_CONTEXT'; errors=[]; checks=0
def check(ok,message):
 global checks
 checks+=1
 if not ok:errors.append(message)
def read(name):return json.loads((D/name).read_text())
def refs(record):
 if isinstance(record,dict):
  if 'path' in record and 'line' in record:yield record
  for value in record.values():yield from refs(value)
 elif isinstance(record,list):
  for value in record:yield from refs(value)
def git(*args):return subprocess.check_output(['git',*args],cwd=R,text=True).strip()
features=read('FEATURE_REGISTRY.json');phases=read('PHASE_REGISTRY.json');summary=read('GENERATION_SUMMARY.json');pm={p['id']:p for p in phases}
expected=[f'F{i:03}' for i in range(231)];check([f['id'] for f in features]==expected,'Feature set/order must be exactly F000–F230')
check([p['id'] for p in phases]==[f'EXP-{i:02}' for i in range(25)],'Phase set/order must be exactly EXP-00–24')
canonical=[]
for name in ['01_MASTER_IMPLEMENTATION_PROMPT.md','03_INTEGRATED_PHASE_EXECUTION_PLAN.md']:
 rows=[]
 for line in (D/'sources'/name).read_text().splitlines():
  m=re.match(r'\| (F\d{3}) \| (.*?) \| (MISSION|DEMO|PILOT_TEST|LATER) \| (EXP-\d\d) \|',line)
  if m:rows.append(m.groups())
 canonical.append(rows)
check(len(canonical[0])==231 and canonical[0]==canonical[1],'Original master/plan canonical names/status/phase do not agree')
check([(f['id'],f['name'],f['research_status'],f['phase']) for f in features]==canonical[0],'Generated registry differs from original canonical rows')
coverage=[fid for p in phases for fid in p['feature_ids']]
check(collections.Counter(coverage)==collections.Counter(expected),'Phase coverage has missing/duplicate F-IDs')
check(collections.Counter(f['status'] for f in features)==summary['feature_counts'],'Summary status counts differ')
check(collections.Counter(f['research_status'] for f in features)=={'MISSION':1,'DEMO':87,'PILOT_TEST':43,'LATER':100},'Research horizons differ')
allowed={'VERIFIED_IMPLEMENTED','IMPLEMENTED_WITH_LIMITATIONS','PILOT_TEST_ONLY','PARTIALLY_IMPLEMENTED','PLANNED','BLOCKED_EXTERNAL','UNKNOWN'}
required=['id','name','purpose','parent_user_problem','functional_requirements','status','code_refs','existing_tests','technical_dependencies','security_considerations','ux_requirements','acceptance_criteria','phase','remaining_work','human_gate','last_verified_sha']
for f in features:
 check(all(k in f for k in required),f"{f['id']}: missing required fields")
 check(f['status'] in allowed,f"{f['id']}: bad status")
 check(f['id'] in pm[f['phase']]['feature_ids'],f"{f['id']}: phase assignment mismatch")
 check(f['release_permission']=='SYNTHETIC_ONLY; LIVE_BLOCKED',f"{f['id']}: release boundary changed")
 check(f['last_verified_sha'] in [None,summary['baseline_sha']],f"{f['id']}: unknown evidence SHA")
 if f['status'] in {'VERIFIED_IMPLEMENTED','IMPLEMENTED_WITH_LIMITATIONS','PILOT_TEST_ONLY','PARTIALLY_IMPLEMENTED'}:check(bool(f['code_refs']),f"{f['id']}: implemented status without code/foundation evidence")
 if f['status']=='PLANNED':check(not f['code_refs'],f"{f['id']}: planned path mislabelled as code")
 for key in ['parent_user_problem','security_considerations','ux_requirements','required_tests','human_gate']:
  ref=f[key];check(isinstance(ref,dict) and ref['phase_ref']==f['phase'] and ref['field'] in pm[f['phase']],f"{f['id']}: invalid shared {key}")
 for ac in f['acceptance_criteria'][1:]:check(ac['phase_ref']==f['phase'] and ac['id'] in [a['id'] for a in pm[f['phase']]['acceptance_criteria']],f"{f['id']}: invalid acceptance reference")
 for t in f['existing_tests']:
  check(t['text']==(R/t['path']).read_text().splitlines()[t['line']-1].strip()[:400],f"{f['id']}: test anchor text mismatch")
for p in phases:
 required_phase=['objective','feature_ids','prerequisites','technical_architecture','existing_implementation','missing_implementation','backend_requirements','frontend_requirements','data_models','security_requirements','required_tests','acceptance_criteria','git_checkpoint','external_dependencies','completion_evidence']
 check(all(k in p for k in required_phase),p['id']+': missing phase fields')
 check(len(p['acceptance_criteria'])==4,p['id']+': wrong AC count')
 for path in p['existing_implementation']:check((R/path).is_file(),p['id']+': missing existing file '+path)
for record in refs([features,phases]):
 p=R/record['path'];check(p.is_file(),'Missing reference: '+str(p))
 if p.is_file():check(1<=record['line']<=len(p.read_text().splitlines()),'Invalid line anchor: '+str(record))
with (D/'FEATURE_REGISTRY.csv').open(newline='') as f:csvrows=list(csv.DictReader(f))
check([x['id'] for x in csvrows]==expected,'CSV feature set mismatch')
for row,f in zip(csvrows,features):
 for key in ['name','research_status','phase','status']:check(row[key]==f[key],f"CSV {f['id']}: {key} mismatch")
md=(D/'FEATURE_STATUS.md').read_text();check(re.findall(r'^## (F\d{3})$',md,re.M)==expected,'Readable feature sections mismatch')
for f in features:check(f"**{f['name']}** — {f['status']}." in md,f"Readable status mismatch: {f['id']}")
phase_md=(D/'PHASE_PROGRESS.md').read_text();check(re.findall(r'^## (EXP-\d\d)$',phase_md,re.M)==list(pm),'Readable phase sections mismatch')
# Verify every original baseline file hash, including binaries; no product/config/test was overwritten.
with (D/'SOURCE_INVENTORY.csv').open(newline='') as f:inventory=list(csv.DictReader(f))
check(len(inventory)==335,'Expected 335 baseline records')
check({x['path'] for x in inventory}==set(git('ls-tree','-r','--name-only',summary['baseline_sha']).splitlines()),'Inventory differs from baseline Git tree')
for record in inventory:
 p=R/record['path'];check(p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==record['sha256'],'Baseline file changed/missing: '+record['path'])
for record in summary['source_snapshots']:
 check(hashlib.sha256((R/record['path']).read_bytes()).hexdigest()==record['sha256'],'Uploaded source snapshot changed: '+record['path'])
# New narrative documents only: archived original prompts have historical/example links.
for p in [R/'AGENTS.md',*(D.glob('*.md')),R/'docs/expansion/SOURCE_RECONCILIATION.md']:
 for target in re.findall(r'\[[^\]\n]+\]\(([^)\n]+)\)',p.read_text()):
  if re.match(r'^[a-z]+://',target):continue
  path,_,fragment=target.partition('#');dest=p.parent/path if path else p
  check(dest.is_file(),'Broken local link in '+str(p.relative_to(R))+': '+target)
  if dest.is_file() and re.fullmatch(r'L\d+',fragment):check(1<=int(fragment[1:])<=len(dest.read_text().splitlines()),'Broken markdown line link: '+target)
for p in [R/'AGENTS.md',D/'PROJECT_MASTER_CONTEXT.md',D/'SESSION_HANDOFF.md']:
 check('LIVE_BLOCKED' in p.read_text(),str(p)+': missing live boundary')
check('PENDING' in (D/'RESEARCH_TRACEABILITY.md').read_text(),'Parent interview pending marker missing')
check('EXP-01' in (D/'SESSION_HANDOFF.md').read_text(),'Initialization stop condition missing')
result={'status':'FAIL' if errors else 'PASS','checks':checks,'features':len(features),'phases':len(phases),'baseline_files_preserved':len(inventory),'errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(bool(errors))
