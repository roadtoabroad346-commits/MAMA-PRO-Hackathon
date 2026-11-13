# Проверка инициализации и baseline

Проверяемый source SHA: **7f8434a4cfd097b531fa584f5b97ebd1e772ad92**. Все runtime source/tests/config/335 исходных tracked-файлов сохранены byte-for-byte. Никаких EXP-01+ features не добавлено. Новые проверки относятся к этому неизменённому коду; не выдумана новая независимая human acceptance.

Среда: Linux, Node24.22.1, npm11.9.0, Chromium156.0.8078.79. Временные метки команд отображаются в локальной зоне среды; машинный summary содержит явное UTC. Клиентская зона для отчёта Asia/Qyzylorda (UTC+5).

| Проверка | Команда | Фактический результат |
|---|---|---|
| Locked dependencies | `npm ci` | exit0 |
| Strict TS, unit/integration, historical registry | `npm run check` | exit0; 154/154; 69 historical records, 29 with evidence,39 team confirmations |
| Static build | `npm run build` | exit0; main377.20kB/gzip110.64kB; advisory не превышен |
| CORE browser | `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2` | 79/79 PASS |
| Release browser | `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2` | 18/18 PASS |
| Real synthetic backend browser | `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.pilot.config.ts` | 5/5 PASS |
| PWA/map browser | `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.offline.config.ts` | 2/2 PASS |
| Dependency advisories | `npm audit --json` | total0, high0, critical0 |
| Context consistency | `python3 docs/AI_CONTEXT/validate_context.py` | PASS; 10067 проверок согласованности, 231 features/25 phases/335 files |
| Diff/staged boundary | `git diff --cached --check`, allowlisted names и original hashes | См. итоговую запись checkpoint |
| Push/remote SHA | `git push -u origin feature/context-init-2026-11-13` + `git ls-remote` | PASS для initial checkpoint b0b4115b694ec8271ead0f90a1d4c7742327145f; subsequent handoff-record commit проверяется отдельно |

Итого выполнено **258** unit/integration/browser проверок, failed0/skipped0. Логи с исходным stdout сохранены в [evidence](evidence/check.log); все пути/размеры/SHA256 — в [VALIDATION.json](VALIDATION.json). NO_COLOR/FORCE_COLOR и experimental node:sqlite warnings не трактуются как failed checks. Browser suites работали на собственных серверах с CI=1; pilot DB имеет отдельное e2e имя и не коммитится.

Автоматический validator сверяет exact F000–F230, canonical names и horizons в двух оригиналах, unique EXP coverage, shared phase fields/AC, именованные test anchors, JSON/CSV/Markdown статусы, локальные ссылки/строки, source snapshots и сохранность335 baseline файлов. Это проверка согласованности документации, а не автоматическое доказательство всех новых phase AC.

Экспертный обзор проведён по архитектурным contracts, домену, API/storage, основным feature paths и tests; все275 текстовых baseline файлов полностью прочитаны программно для хеширования/структурного индекса; 60 бинарников только хешированы. [SOURCE_INDEX](SOURCE_INDEX.json) — навигация по exports/requirements/test titles, не свидетельство exhaustive semantic review каждой строки. Полный independent security review и просмотр всех binary assets не заявляются.

NOT_RUN/BLOCKED: отсутствующий первичный DOCX/CSV/README пакета; authentic parent interview; native KK; реальные screen readers/physical devices/browser zoom; multi-version SW и real mobile install; current legal/official hackathon/market-source verification; production CI attestation, staging/live/restore/external delivery. Исторические PASS/251/147/benchmarks сохраняют свои SHA и не подставлены как результат текущего запуска.

Протокол безопасности: синтетические данные, `LIVE_BLOCKED` неизменён и covered existing unit suite; никаких real providers, external messages, deployment, merge или force-push. Исторические source prompts сохранены как источники требований, не как новые полномочия.

Первый запуск context validator потребовал явную строку LIVE_BLOCKED в master/handoff; строки добавлены, повторная проверка PASS. Это документационное исправление; runtime/tests не менялись.

Staged review: 35 новых контекстных файлов, unrelated/runtime paths0; secret-pattern findings0. CSV приведены к LF; source-directory .gitattributes сохраняет исходные Markdown hard-break spaces без изменения оригинальных вложений. После этого `git diff --cached --check` PASS.

## EXP-02 — текущий checkpoint13.11.2026

Runtime сохраняется на7f8434a; parent0e7e189. [Stage/20 feature mappings](../expansion/stages/EXP-02.md): strict TS/154unit/89dev/40dist PASS, failed0/skipped0; focused10 PASS отдельно. Все335 baseline-файлов сохранены. Оригинальные source statuses/231 IDs/25 EXP сверены с Research Markdown/CSV/STAGE_MAP/manifest; валидатор теперь проверяет прямые source anchors, links и tests. [Точные команды и хеши логов](../expansion/evidence/EXP-02.json); [текущая context validation](../expansion/evidence/EXP-02-context.json).

Первые два прогона новых тестов6fail/2pass из-за ошибочного incomplete-card selector; временный release config не стартовал из-за cwd. Исправлены тестовый селектор/воспроизводимый root config; runtime/старые assertions не менялись. Старый validation выше описывает свой SHA. Native KK/parent/real AT/DOCX/primary external URLs не проверены. Pilot/offline в этой сессии повторно NOT_RUN. Remote CI не запускался: текущая ветка не входит в push allowlist workflow.

## EXP-03 — technical closure13.11.2026

Source ac82ec7209de0ec5e0154947193cafcb7be856ba: strict TS/196 unit-integration/103 dev/54 dist/5 pilot/2 offline PASS,360 final executions,0 failed/0 skipped. Build PASS; dependency audit0. [Full24-feature/4-AC closure](../expansion/stages/EXP-03.md), [exact commands/hashes](../expansion/evidence/EXP-03.json), [measured before/after20/100/1000](../expansion/evidence/EXP-03-benchmark.md), [current context check](../expansion/evidence/EXP-03-D-context.json).330 of335 historical baseline files byte-exact;5 intentionally reviewed changes checked against original Git blobs/current tested-tree hashes. Archived sources unchanged. Older335-preserved statements above apply to their old docs-only checkpoints, not this runtime fix.

Technical scope VERIFIED_DONE/AUTOMATED_SYNTHETIC_DEMO only. Human parent/native KK/real AT/device/browser zoom NOT_VERIFIED/BLOCKED_EXTERNAL; original DOCX unavailable. LIVE_BLOCKED unchanged. Remote CI NOT_RUN: feature branch outside existing push allowlist. No merge/deploy. Initial6 domain regression failures and8 test-harness failures are documented, fixed and excluded from final PASS totals. Context checks verify actual test files, source SHA, transcript hashes, exact feature IDs and per-feature execution metadata.
