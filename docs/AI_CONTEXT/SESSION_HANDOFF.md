# EXP-03 checkpoint A handoff

LIVE_BLOCKED; synthetic-only. Current branch: `codex/exp-03-offer-matching` from verified remote EXP-02 `0ebd5bf206f082db718945096b7abfdeee1fa31b`. Direct user request supersedes prior STOP at EXP-02; STOP now after EXP-03. [Contracts, findings, matrix and rollback](../expansion/stages/EXP-03.md).

A: npm ci/check PASS (154 tests, strict TS, historical registry); measured baseline20/100/1000. Runtime unchanged. Next B: reproduce omitted offer-title query, locale-sensitive ID tie and invalid inspect clock; add domain properties and narrow fixes. C/D remain NOT_VERIFIED. Human/native KK/real AT/device approval BLOCKED_EXTERNAL. Current containing commit self SHA is resolved with git rev-parse HEAD and git ls-remote origin refs/heads/codex/exp-03-offer-matching after push; do not guess it.

# Historical handoff after EXP-02

**LIVE_BLOCKED; DEMO/PILOT_TEST only. Реальные семьи, отправки, запись и deployment не разрешены.**

Выполнено текущее поручение: сверка поступивших источников и проверка EXP-02 F017–F036. Runtime gap не найден; добавлены 10 acceptance cases и проверки документации. Все 20 функций уже были реализованы и повторно не создавались. [Полный отчёт, AC,20 mappings, rollback](../expansion/stages/EXP-02.md).

## Git и источники

Рабочая ветка: `feature/context-init-2026-11-13`; проверенный remote до текущего checkpoint и его parent — `0e7e1896776dc50e2c7be114e0ed249b8e800395`. Runtime совпадает с `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. Этот документ входит в новый test/docs commit; его self SHA в собственное содержимое не встраивается. Факт push проверяется отдельно; для актуального checkpoint выполнить команды ниже.

EXP-01 уже сохранён в отдельной `feature/mamapro-exp01-20261113` @`a93cc18d7b357a637c7114e9408ec11242156eba`. Его stage/evidence/test прочитаны; runtime совпадает с baseline. Ветки не объединялись, EXP-01 не дублировался. В этой ветке dev suite89, в sibling EXP-01 исторически 85: это 79 общих +10EXP-02 либо +6EXP-01 соответственно, а не потеря тестов. Открытые PR1/2 остаются историческими, их heads входят в baseline; merge не выполнялся.

Прочитаны полностью: Research Markdown §00–18, исходный CSV231, root README, README_START_HERE, STAGE_MAP, manifest/intake и все три инженерных документа. Вложения 01–03 побайтово совпадают с Git sources. [Имена, SHA256, размеры и read scope](../expansion/evidence/EXP-02-sources.json). Код/тесты: Intake, Review, AppState, session, SearchInput/contracts, SearchService/matching, Catalog, связанные dictionaries и tests/configs; сохранены прежние архитектура и исторические фазы.

**Оригинального Research DOCX и папки research/ нет в workspace и fetched GitHub heads.** Historical intake сообщает о Library-копии; она не смонтирована. DOCX в этой сессии НЕ прочитан, его hash/layout/полнота извлечения НЕ перепроверены. Не выдавать Markdown за проверенный бинарный оригинал. Владелец подтвердил путь архива MamaPro_Codex_Expansion/00_REFERENCE_RESEARCH.docx и ожидаемый SHA2563ceb39a…bd6, явно разрешил продолжать по Markdown. После фактического получения сверить с derivative и обновить provenance отдельным checkpoint, сохранив результаты EXP-02.

## Что подтверждено

- 231 IDs F000–F230, без пропусков/дубликатов; source statuses MISSION1/DEMO87/PILOT_TEST43/LATER100 и 25 EXP сохранены. Каждый ID имеет `research_line`/`registry_line`, проверяемые против исходных материалов.
- EXP-02 AC-01…04: PASS_AUTOMATED_SYNTHETIC. A/B/C RU/KK, exact/incomplete IDs и counts,4 шага, null/zero, hard/soft, draft/applied, editing, Back/history/reload и бюджет проверены.
- Invalid budget блокирует count/apply; остальные ответы не теряются. Raw budget живёт только в памяти: reload восстанавливает валидированный null/number; это существующий контракт. Expired/corrupt/storage denial покрыты прежними тестами.
- Исходные 335 baseline-файлов побайтово сохранены; src/server/public/dependencies/migrations не изменены. Статусы остаются IMPLEMENTED_WITH_LIMITATIONS; human readiness не повышена.

Текущая проверка: strict TS +154 unit/integration и исторический audit PASS; build PASS; dev89/89; dist40/40 (18 существующих release +12 intake +10 EXP-02). Основные прогоны:283 PASS, failed0/skipped0. Отдельный focused10 PASS и baseline-focused22 PASS не добавляются повторно в283. Pilot/offline повторно NOT_RUN, их код не изменён. [Команды, хеши и полные логи](../expansion/evidence/EXP-02.json).

Первые два пробных прогона новых тестов:6fail/2pass каждый, причина — неверный test selector incomplete-card. Исправлен тест по исходнику OfferCard, expected IDs/assertions сохранены. Это не продуктовый дефект и не основание править runtime. Фактические команды/логи/хеши — в stage evidence.

## Восстановление и следующий шаг

```sh
git status --short --branch
git log -5 --oneline
git rev-parse HEAD
git ls-remote origin refs/heads/feature/context-init-2026-11-13
python3 docs/AI_CONTEXT/validate_context.py
npm ci
npm run check
npm run build
CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2
```

Node24.22.1/npm11.9.0/Chromium156.0.8078.79. Не запускать dev/release одновременно на 5173. Обычный release gate: `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2`. Полный EXP-02 dist acceptance: `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.exp02.config.ts --workers=2`. PILOT_MODE=PILOT_TEST/npm run pilot — только отдельный synthetic backend; в этой задаче он не изменён.

**STOP после EXP-02 и push.** Следующий кандидат, только по новому поручению: EXP-03 F037–F060 — same-offer/hard/unknown/freshness/zero results и benchmark20/100/1000. Не переходить к EXP-11 поверх непроверенных зависимостей, не придумывать требования неизвестных исторических фаз.

Открыто: DOCX; первичные market/competitor URLs и актуальные условия конкурса; аутентичный созвон родителя PENDING; native KK/real AT/device/browser zoom NOT_RUN;39 фаз TEAM_ATTESTED без независимого per-phase evidence; real identity/consent/operators/providers/ops/live gates. Технический PASS не доказывает социальный эффект. См. [OPEN_QUESTIONS](OPEN_QUESTIONS.md).
