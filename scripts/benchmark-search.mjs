import { createServer } from 'vite';
import { performance } from 'node:perf_hooks';
import { cpus, totalmem, platform, release, arch } from 'node:os';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

// Vite is already locked in the project; load the same TS modules used by UI.
const vite = await createServer({ configFile: false, server: { middlewareMode: true } });
try {
  const { SearchService } = await vite.ssrLoadModule('/src/domain/SearchService.ts');
  const { emptySearchInput } = await vite.ssrLoadModule('/src/domain/contracts.ts');
  const { syntheticCatalog } = await vite.ssrLoadModule('/tests/support/syntheticCatalog.ts');
  const base = emptySearchInput();
  const scenarios = {
    neutral: base,
    combined: { ...base, categoryIds: ['LOGOPED', 'PSYCHOLOG'], ageGroup: 'AGE_3_5',
      serviceLanguage: 'kk', format: 'offline', budgetKzt: 6000, budgetHard: true, availabilityPreferred: true },
    district: { ...base, districtId: 'BOSTANDYK', sort: 'district' },
    price: { ...base, sort: 'price' },
    text: { ...base, query: 'Синтетический специалист 12' },
    zero: { ...base, serviceLanguage: 'kk', format: 'offline', budgetKzt: 0, budgetHard: true },
  };
  const measure = fn => { const start = performance.now(); const value = fn(); return [performance.now() - start, value]; };
  const stats = samples => {
    const sorted = [...samples].sort((a, b) => a - b);
    const q = p => sorted[Math.ceil(p * sorted.length) - 1];
    return { samples: sorted.length, p50Ms: q(0.5), p95Ms: q(0.95), maxMs: sorted.at(-1) };
  };
  const results = [];
  for (const count of [20, 100, 1000]) {
    const fixture = syntheticCatalog(count);
    const [constructionMs, service] = measure(() => new SearchService(fixture));
    for (const [scenario, input] of Object.entries(scenarios)) {
      for (let i = 0; i < 20; i++) service.search(input);
      const samples = []; let checksum = 0;
      for (let i = 0; i < 100; i++) {
        const [ms, result] = measure(() => service.search(input));
        samples.push(ms);
        checksum += result.eligibleOfferCount + result.incompleteOfferCount;
      }
      results.push({ offers: count, specialists: fixture.specialists.length, scenario,
        constructionMs, ...stats(samples), checksum });
    }
  }
  const optional = path => { try { return readFileSync(path, 'utf8').trim(); } catch { return null; } };
  const report = {
    measuredAt: new Date().toISOString(),
    sourceSha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    dirtyFiles: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean),
    environment: { node: process.version, platform: platform(), kernel: release(), arch: arch(),
      cpu: cpus()[0]?.model, logicalCpus: cpus().length, totalMemoryBytes: totalmem(),
      cgroupCpuMax: optional('/sys/fs/cgroup/cpu.max'), cgroupMemoryMax: optional('/sys/fs/cgroup/memory.max') },
    methodology: 'Single process, sequential scenarios; fixed catalog.demoClock; 20 warmups + 100 timed synchronous search calls per scenario and size. Nearest-rank p50/p95. Constructor (schema/public projection) timed separately once per size; excludes fixture generation, UI/render/network. Shared cloud CPU, no field/mobile latency claim.',
    inputs: scenarios, results,
  };
  const outputIndex = process.argv.indexOf('--output');
  if (outputIndex !== -1) {
    const path = process.argv[outputIndex + 1];
    if (!path) throw new Error('MISSING_OUTPUT_PATH');
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
} finally { await vite.close(); }
