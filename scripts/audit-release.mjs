// Reproducible fingerprint and limited secret/dev-marker scan, not a security certification.
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const hash = data => createHash('sha256').update(data).digest('hex');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(`${dir}/${e.name}`) : [`${dir}/${e.name}`]))).flat();
}
const inputs = [...await files('src'), ...await files('scripts'), ...await files('tests'),
  'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'index.html',
  'playwright.config.ts', 'playwright.release.config.ts'].sort();
const sourceRows = await Promise.all(inputs.map(async file => `${hash(await readFile(file))}  ${file}`));
const artifacts = [];
const findings = [];
const secret = /sk-proj-[A-Za-z0-9_-]{15,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:api[_-]?key|client[_-]?secret|password)\s*[:=]\s*["'][^"']{12,}["']/iu;
const dev = /\/@vite\/client|\/@react-refresh|react\.development\.js|fake-indexeddb|setupWorker\(|localhost:5173/u;
for (const file of [...(await files('dist')).sort(), ...inputs.filter(f => f.startsWith('src/') || /^(?:package.*\.json|vite\.config\.ts|index\.html)$/u.test(f))]) {
  const content = await readFile(file); const built = file.startsWith('dist/');
  if (secret.test(content.toString())) findings.push({ file, kind: 'secret-pattern' });
  if (built) {
    artifacts.push({ file, bytes: content.length, sha256: hash(content) });
    if (dev.test(content.toString()) || file.endsWith('.map')) findings.push({ file, kind: 'dev-marker-or-source-map' });
  }
}
const catalog = JSON.parse(await readFile('src/data/catalog.json', 'utf8'));
if (catalog.catalogVersion !== 'catalog-v1' || catalog.rulesVersion !== 'rules-v1' ||
  catalog.demoClock !== '2026-11-14T12:00:00+05:00' || catalog.specialists.length !== 12 || catalog.offers.length !== 20)
  findings.push({ kind: 'unexpected-catalog' });
const envFiles = (await readdir('.')).filter(name => /^\.env/u.test(name));
if (envFiles.length) findings.push({ kind: 'env-files', files: envFiles });
const sourceManifest = sourceRows.join('\n') + '\n';
const buildManifest = artifacts.map(a => `${a.sha256}  ${a.file}`).join('\n') + '\n';
let baseCommit = 'not-a-git-checkout';
try { baseCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch {}
const result = {
  releaseId: `phase13-${hash(buildManifest).slice(0, 12)}`,
  baseCommit,
  sourceSetSha256: hash(sourceManifest), buildSetSha256: hash(buildManifest),
  node: process.version, catalogVersion: catalog.catalogVersion, rulesVersion: catalog.rulesVersion,
  demoClock: catalog.demoClock, specialists: catalog.specialists.length, offers: catalog.offers.length,
  scan: { status: findings.length ? 'FAIL' : 'PASS', findings, envFiles,
    scope: 'src, dist, package/lock, vite config, index; known credential signatures; no env files; dist dev markers/maps' },
  runtimeVariability: ['request/idempotency crypto.randomUUID()', 'request timestamps and TTL Date.now()', 'search session expiresAt Date.now()'],
  artifacts,
};
await mkdir('docs/release', { recursive: true });
await writeFile('docs/release/source.sha256', sourceManifest);
await writeFile('docs/release/build.sha256', buildManifest);
await writeFile('docs/release/manifest.json', JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exitCode = 1;
