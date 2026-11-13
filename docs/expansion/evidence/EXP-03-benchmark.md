# EXP-03 measured search benchmark

All values below are **milliseconds**, measured locally on synthetic data; no field/mobile/Web Vitals claims. Source after: `ac82ec7209de0ec5e0154947193cafcb7be856ba` (clean tree). Source before: `0ebd5bf206f082db718945096b7abfdeee1fa31b`; harness/generator were untracked during measurement and saved byte-exact in checkpoint A `cd1a7a5812ea65bd8bc49ee149bdfe105f0f1773`. Runtime before is identical at that checkpoint. [Raw before](EXP-03-benchmark-before.json), [raw after](EXP-03-benchmark-after.json).

Reproduce after `npm ci`: `node scripts/benchmark-search.mjs --output work/exp03/benchmark.json`. For before, run the same command in a separate checkout/worktree at checkpoint A. No environment credentials required. Do not run browser/build workloads alongside the benchmark. The recorded runs had no concurrent browser suites.

Method: fixed DEMO clock from catalog; validated synthetic fixtures with exactly20/100/1000 published offers and10/50/500 specialists (two offers each), preserving varying categories, known/missing/lower-bound/stale facts. Six fixed inputs (raw JSON records every field),20 warmups then100 synchronous SearchService.search samples per scenario and size; nearest-rank p50/p95, no outlier removal. Constructor/schema/public projection timed separately once per size; fixture generation, Vite module transform/startup, UI, rendering and network excluded from search timing. Node uses normal GC/JIT; shared cloud scheduling introduces noise, and20 warmups cannot eliminate it.

Environment: Linux6.18.57 x64; Node24.22.1; npm11.9.0; AMD EPYC9V74;3 visible logical CPUs; cgroup CPU quota2 cores (`200000 100000`),8GiB cgroup memory. Report timestamps and full environment are in raw JSON. Vite uses the project's locked dependencies to load the same TypeScript modules as the application. No extra benchmark dependency.

| Offers | Scenario | Before p50 | Before p95 | After p50 | After p95 | After max |
|---|---|---|---|---|---|---|
| 20 | neutral | 0.516 | 0.759 | 0.545 | 0.907 | 1.718 |
| 20 | combined | 0.264 | 1.051 | 0.148 | 0.737 | 2.012 |
| 20 | district | 0.196 | 0.323 | 0.193 | 0.370 | 0.534 |
| 20 | price | 0.267 | 0.338 | 0.158 | 0.335 | 0.729 |
| 20 | text | 0.681 | 0.780 | 0.013 | 0.047 | 0.102 |
| 20 | zero | 0.154 | 0.239 | 0.116 | 0.284 | 1.540 |
| 100 | neutral | 0.449 | 0.882 | 0.734 | 1.002 | 5.145 |
| 100 | combined | 0.637 | 0.882 | 0.777 | 1.823 | 2.362 |
| 100 | district | 0.948 | 1.284 | 0.905 | 1.277 | 1.474 |
| 100 | price | 0.822 | 1.245 | 0.830 | 1.119 | 1.616 |
| 100 | text | 3.403 | 3.808 | 0.031 | 0.057 | 0.264 |
| 100 | zero | 0.532 | 0.883 | 0.590 | 1.001 | 2.361 |
| 1000 | neutral | 4.909 | 9.576 | 4.351 | 9.497 | 25.766 |
| 1000 | combined | 8.114 | 34.219 | 9.402 | 40.291 | 54.538 |
| 1000 | district | 10.496 | 13.157 | 12.643 | 15.867 | 21.838 |
| 1000 | price | 11.507 | 13.109 | 12.874 | 15.909 | 18.137 |
| 1000 | text | 36.930 | 41.122 | 0.288 | 0.458 | 0.964 |
| 1000 | zero | 6.096 | 9.772 | 6.822 | 8.678 | 12.428 |

| Offers | Constructor before | Constructor after |
|---|---|---|
| 20 | 1.100 | 2.033 |
| 100 | 2.699 | 5.279 |
| 1000 | 26.900 | 51.574 |

All18 before/after scenario inputs and result checksums match; quantile ordering is valid. All recorded after p95 values are below the historical local100ms proposal, which is not an SLO for devices or real users. Text normalization/indexing improves the text scenario strongly; some neutral/combined/district/price samples regress, so this report does not claim a universal speedup or statistical significance. Maximum after p95 is40.291ms (1000 combined); text1000 p95 is0.458ms vs41.122ms before. More sessions would be needed for reliable small differences. Search still evaluates each offer independently before grouping.
