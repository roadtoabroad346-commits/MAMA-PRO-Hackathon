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
exp03_path=R/'docs/expansion/evidence/EXP-03.json'
exp03=json.loads(exp03_path.read_text()) if exp03_path.exists() else None
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
# Verify the received research package independently of the engineering appendices.
with (D/'sources/FEATURE_REGISTRY_000-230.csv').open(encoding='utf-8-sig',newline='') as f:
 source_rows=list(csv.DictReader(f))
check([(r['feature_id'],r['research_name'],r['research_status'],r['exp_stage']) for r in source_rows]==canonical[0],
 'Original Research CSV differs from canonical feature names/status/stages')
research=(D/'sources/00_REFERENCE_RESEARCH.md').read_text()
research_rows=[]
for line in research.splitlines():
 m=re.match(r'\| (\d+) \| (.*?) \| (DEMO|PILOT_TEST|LATER) \|',line)
 if m:research_rows.append((f'F{int(m[1]):03}',m[2],m[3]))
check(research_rows==[(r[0],r[1],r[2]) for r in canonical[0][1:]],
 'Research extract must contain all 230 named subfeatures in order, with original statuses')
check('0. Продуктовая миссия' in research,'Research mission F000 missing')
stage_map=read('sources/STAGE_MAP.json')['stages']
check([(p['stage'],p['feature_ids']) for p in stage_map]==[(p['id'],p['feature_ids']) for p in phases],
 'Original stage map differs from generated EXP registry')
for row in source_rows:check(bool(row['research_boundary']),row['feature_id']+': original boundary missing')
for name in ['01_MASTER_IMPLEMENTATION_PROMPT.md','02_CODEX_ENGINEERING_PLAYBOOK.md','03_INTEGRATED_PHASE_EXECUTION_PLAN.md','FEATURE_REGISTRY_000-230.csv','README_START_HERE.md','STAGE_MAP.json']:
 manifest=(D/'sources/SHA256_MANIFEST.txt').read_text()
 expected_hash=re.search(r'^([a-f0-9]{64})  '+re.escape(name)+r'$',manifest,re.M)
 check(bool(expected_hash) and hashlib.sha256((D/'sources'/name).read_bytes()).hexdigest()==expected_hash[1],
  'Received source differs from archive manifest: '+name)
coverage=[fid for p in phases for fid in p['feature_ids']]
check(collections.Counter(coverage)==collections.Counter(expected),'Phase coverage has missing/duplicate F-IDs')
check(collections.Counter(f['status'] for f in features)==summary['feature_counts'],'Summary status counts differ')
check(collections.Counter(f['research_status'] for f in features)=={'MISSION':1,'DEMO':87,'PILOT_TEST':43,'LATER':100},'Research horizons differ')
allowed={'VERIFIED_IMPLEMENTED','IMPLEMENTED_WITH_LIMITATIONS','PILOT_TEST_ONLY','PARTIALLY_IMPLEMENTED','PLANNED','BLOCKED_EXTERNAL','UNKNOWN'}
required=['id','name','purpose','parent_user_problem','functional_requirements','status','code_refs','existing_tests','technical_dependencies','security_considerations','ux_requirements','acceptance_criteria','phase','remaining_work','human_gate','last_verified_sha']
for feature_index,f in enumerate(features):
 check(f.get('registry_line')==feature_index+2,f"{f['id']}: original CSV line mismatch")
 research_line=f.get('research_line',0)
 check(1<=research_line<=len(research.splitlines()),f"{f['id']}: missing original Research line")
 if 1<=research_line<=len(research.splitlines()):
  source_line=research.splitlines()[research_line-1]
  check('0. Продуктовая миссия' in source_line if feature_index==0 else source_line.startswith(f'| {feature_index} | {f["name"]} | {f["research_status"]} |'),f"{f['id']}: original Research anchor mismatch")
 check(all(k in f for k in required),f"{f['id']}: missing required fields")
 check(f['status'] in allowed,f"{f['id']}: bad status")
 check(f['id'] in pm[f['phase']]['feature_ids'],f"{f['id']}: phase assignment mismatch")
 check(f['release_permission']=='SYNTHETIC_ONLY; LIVE_BLOCKED',f"{f['id']}: release boundary changed")
 allowed_shas=[None,summary['baseline_sha']]+([exp03['sourceSha']] if exp03 and f['phase']=='EXP-03' else [])
 check(f['last_verified_sha'] in allowed_shas,f"{f['id']}: unknown evidence SHA")
 if f.get('execution_state')=='VERIFIED_DONE':
  check(bool(exp03) and f['id'] in exp03['features'],f"{f['id']}: completion without EXP evidence")
  check(f.get('verification_scope')=='AUTOMATED_SYNTHETIC_DEMO',f"{f['id']}: completion scope missing")
  check(f['last_verified_sha']==exp03['sourceSha'],f"{f['id']}: completion SHA mismatch")
  for test in f['technical_verification']['tests']:check((R/test).is_file(),f"{f['id']}: missing technical proof file {test}")
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
 for key in ['name','research_status','phase','status','research_line','registry_line','last_verified_sha']:check(row[key]==str(f[key] if f[key] is not None else ''),f"CSV {f['id']}: {key} mismatch")
 for key in ['execution_state','verification_scope']:check(row.get(key,'')==f.get(key,''),f"CSV {f['id']}: {key} mismatch")
md=(D/'FEATURE_STATUS.md').read_text();check(re.findall(r'^## (F\d{3})$',md,re.M)==expected,'Readable feature sections mismatch')
for f in features:check(f"**{f['name']}** — {f['status']}." in md,f"Readable status mismatch: {f['id']}")
phase_md=(D/'PHASE_PROGRESS.md').read_text();check(re.findall(r'^## (EXP-\d\d)$',phase_md,re.M)==list(pm),'Readable phase sections mismatch')
# Preserve the historical snapshot, while checking explicitly reviewed EXP changes
# against both the original Git blob and their recorded current content hash.
with (D/'SOURCE_INVENTORY.csv').open(newline='') as f:inventory=list(csv.DictReader(f))
check(len(inventory)==335,'Expected 335 baseline records')
check({x['path'] for x in inventory}==set(git('ls-tree','-r','--name-only',summary['baseline_sha']).splitlines()),'Inventory differs from baseline Git tree')
change_path=R/'docs/expansion/evidence/EXP-03-verified-changes.json'
change_manifest=json.loads(change_path.read_text()) if change_path.exists() else {}
exp04_manifest_path=R/'docs/expansion/evidence/EXP-04-verified-changes.json'
exp04_manifest=json.loads(exp04_manifest_path.read_text()) if exp04_manifest_path.exists() else {}
changes_by_path={x['path']:x for x in change_manifest.get('changes',[])}
changes_by_path.update({x['path']:x for x in exp04_manifest.get('changes',[])})
changes=list(changes_by_path.values())
changed={x['path']:x for x in changes}
check(len(changed)==len(changes),'Duplicate reviewed change path')
check(set(changed)<=set(x['path'] for x in inventory),'Reviewed changes must refer to baseline files')
for record in inventory:
 p=R/record['path'];reviewed=changed.get(record['path'])
 if reviewed:
  check(reviewed['baselineSha256']==record['sha256'],'Reviewed baseline hash mismatch: '+record['path'])
  original=subprocess.check_output(['git','show',summary['baseline_sha']+':'+record['path']],cwd=R)
  check(hashlib.sha256(original).hexdigest()==record['sha256'],'Original Git blob differs: '+record['path'])
  check(bool(reviewed.get('reason')) and bool(reviewed.get('verification')),'Missing change review: '+record['path'])
 check(p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==(reviewed['currentSha256'] if reviewed else record['sha256']),'Unreviewed file change/missing: '+record['path'])
if exp03:
 source_sha=exp03['sourceSha']
 check(change_manifest.get('verifiedSourceSha')==source_sha,'EXP-03 evidence/manifest SHA mismatch')
 check(subprocess.run(['git','merge-base','--is-ancestor',source_sha,'HEAD'],cwd=R).returncode==0,'Verified source is not in current ancestry')
 for path,expected_hash in change_manifest.get('verifiedSourceFiles',{}).items():
  original=subprocess.check_output(['git','show',source_sha+':'+path],cwd=R)
  check(hashlib.sha256(original).hexdigest()==expected_hash,'Verified Git source mismatch: '+path)
  current_expected=next((x['currentSha256'] for x in exp04_manifest.get('changes',[]) if x['path']==path),expected_hash)
  check(hashlib.sha256((R/path).read_bytes()).hexdigest()==current_expected,'Current source has no reviewed tested successor: '+path)
 for path,record in exp03['evidenceFiles'].items():
  check(hashlib.sha256((R/path).read_bytes()).hexdigest()==record['sha256'],'EXP-03 evidence changed: '+path)
 check(set(exp03['features'])==set(f'F{i:03}' for i in range(37,61)),'EXP-03 must prove exactly F037–F060')
 check(exp03['verification_scope']=='AUTOMATED_SYNTHETIC_DEMO' and exp03['live']=='LIVE_BLOCKED','EXP-03 release scope changed')
 check(exp03['tests']['total_final_executions']==sum(exp03['tests'][k] for k in ['unit_integration','dev','dist','pilot','offline']),'EXP-03 test total mismatch')
 for name,key in [('C-check','unit_integration'),('C-dev','dev'),('D-dist','dist'),('D-pilot','pilot'),('D-offline','offline')]:
  log=(R/f'docs/expansion/evidence/EXP-03-{name}.log').read_text()
  check(bool(re.search(r'\b'+str(exp03['tests'][key])+r' passed',log)),'EXP-03 executed log total mismatch: '+name)
for record in summary['source_snapshots']:
 check(hashlib.sha256((R/record['path']).read_bytes()).hexdigest()==record['sha256'],'Uploaded source snapshot changed: '+record['path'])
# New narrative documents only: archived original prompts have historical/example links.
for p in [R/'AGENTS.md',*(D.glob('*.md')),*(R/'docs/expansion').rglob('*.md')]:
 for target in re.findall(r'\[[^\]\n]+\]\(([^)\n]+)\)',p.read_text()):
  if re.match(r'^[a-z]+://',target):continue
  path,_,fragment=target.partition('#');dest=p.parent/path if path else p
  check(dest.is_file(),'Broken local link in '+str(p.relative_to(R))+': '+target)
  if dest.is_file() and re.fullmatch(r'L\d+',fragment):check(1<=int(fragment[1:])<=len(dest.read_text().splitlines()),'Broken markdown line link: '+target)
for p in [R/'AGENTS.md',D/'PROJECT_MASTER_CONTEXT.md',D/'SESSION_HANDOFF.md']:
 check('LIVE_BLOCKED' in p.read_text(),str(p)+': missing live boundary')
check('PENDING' in (D/'RESEARCH_TRACEABILITY.md').read_text(),'Parent interview pending marker missing')
check(read('../expansion/STATE.json')['currentStage'] in (D/'SESSION_HANDOFF.md').read_text(),'Current stage scope missing')
result={'status':'FAIL' if errors else 'PASS','checks':checks,'features':len(features),'phases':len(phases),'baseline_files_preserved':len(inventory)-len(changed),'baseline_files_reviewed_changed':len(changed),'errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(bool(errors))
