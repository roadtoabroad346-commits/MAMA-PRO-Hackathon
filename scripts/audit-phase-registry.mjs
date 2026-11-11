#!/usr/bin/env node
// Phase evidence verifier. No package dependencies and no write operations.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, isAbsolute, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = resolve(root, 'docs', 'PHASE_REGISTRY.json');
const fail = [];
let registry;
try { registry = JSON.parse(readFileSync(registryPath, 'utf8')); }
catch (error) {
  console.error('PHASE_REGISTRY_UNREADABLE:', error.message);
  process.exit(1);
}
if (registry.schema_version !== 1 || !Array.isArray(registry.phases)) {
  console.error('PHASE_REGISTRY_SCHEMA_INVALID');
  process.exit(1);
}
const all = registry.phases;
const statuses = new Set(['RECORDED', 'NO_VERIFIED_DELIVERY']);
const scopes = new Set(['PLANNING', 'DEMO', 'SYNTHETIC_PILOT', 'UNSPECIFIED', 'FUTURE_PROPOSAL']);
const ids = new Set();
for (const phase of all) {
  if (!Number.isInteger(phase.number) || phase.number < 0 || phase.number > 68 || ids.has(phase.number)) fail.push('Duplicate/invalid number: ' + phase.number);
  ids.add(phase.number);
  if (!statuses.has(phase.evidence_status)) fail.push('Invalid evidence status: ' + phase.number);
  if (!scopes.has(phase.scope)) fail.push('Invalid scope: ' + phase.number);
  if (typeof phase.summary !== 'string' || !phase.summary.trim()) fail.push('Missing description: ' + phase.number);
  if (!Array.isArray(phase.evidence)) { fail.push('Evidence is not an array: ' + phase.number); continue; }
  if (phase.evidence_status === 'RECORDED' && phase.evidence.length === 0) fail.push('Recorded phase without evidence: ' + phase.number);
  if (phase.evidence_status === 'NO_VERIFIED_DELIVERY' && phase.evidence.length !== 0) fail.push('Unverified phase falsely cites evidence: ' + phase.number);
  for (const evidence of phase.evidence) {
    if (typeof evidence !== 'string' || !evidence || isAbsolute(evidence) || evidence.includes('\\')) {
      fail.push('Unsafe evidence path: ' + phase.number); continue;
    }
    const resolved = resolve(root, evidence);
    if (!resolved.startsWith(root + sep) || !existsSync(resolved)) fail.push('Missing/unsafe evidence file: ' + phase.number + ' ' + evidence);
  }
}
for (let i = 0; i <= 68; i++) if (!ids.has(i)) fail.push('Missing phase: ' + i);
if (all.length !== 69) fail.push('Expected exactly 69 phase records; got ' + all.length);
if (registry.phases.find(x => x.number === 68)?.evidence_status !== 'NO_VERIFIED_DELIVERY') fail.push('Phase 68 cannot be declared delivered without new independent evidence');
if (fail.length) { for (const x of fail) console.error('FAIL:', x); process.exit(1); }
const recorded = all.filter(x => x.evidence_status === 'RECORDED').length;
console.log('Phase registry valid: 69 records, ' + recorded + ' have recorded historical evidence, ' + (69 - recorded) + ' without verified delivery evidence.');
console.log('Evidence recorded does NOT mean full acceptance, legal readiness, user validation, deployment, or new tests passed.');
