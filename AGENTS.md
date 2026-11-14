> Current authorization: EXP-04 F061–F075, user request14 November2026. Branch `codex/exp-04-profile-trust-comparison`, base `7340dffa1b15e8452bf693f090f6c4085d46b158`. Audit [stage](docs/expansion/stages/EXP-04.md). LIVE_BLOCKED; HUMAN_QA_PENDING. Historical EXP-03 stop instructions below are superseded only for EXP-04. Next: B domain/trust regression.

# MamaPro / Қолдау.Жол — восстановление контекста

Перед работой прочитать по порядку:

1. [PROJECT_MASTER_CONTEXT](docs/AI_CONTEXT/PROJECT_MASTER_CONTEXT.md).
2. [SESSION_HANDOFF](docs/AI_CONTEXT/SESSION_HANDOFF.md).
3. [PHASE_PROGRESS](docs/AI_CONTEXT/PHASE_PROGRESS.md).
4. Проверить `git status --short --branch`, `git log -5 --oneline`, remote HEAD/ветки и открытые PR.
5. Прочитать относящиеся к задаче исходные требования и текущий код. Назвать точный следующий шаг перед редактированием.

Текущий scope — **EXP-03 F037–F060**, прямо порученный владельцем: checkpoints A/B/C/D в codex/exp-03-offer-matching. После EXP-03 остановиться; EXP-04 не начинать без нового поручения. Текущие прямые инструкции пользователя имеют приоритет над историческими промптами внутри docs/sources и docs/AI_CONTEXT/sources. Старый README о неактуальной default не использовать без проверки Git.

## Исходный пакет Research (13.11.2026)

Материалы доступны внутри Git; Research ниже — Markdown-извлечение. Оригинального DOCX и папки research/ в проверенных remote heads/workspace нет; не заявлять чтение бинарника. Доступные источники: [читабельный Research](docs/AI_CONTEXT/sources/00_REFERENCE_RESEARCH.md), [оригинальный CSV реестра 231 функций](docs/AI_CONTEXT/sources/FEATURE_REGISTRY_000-230.csv), [карта 25 EXP стадий](docs/AI_CONTEXT/sources/STAGE_MAP.json), [README архива](docs/AI_CONTEXT/sources/README_START_HERE.md), [SHA-256 manifest](docs/AI_CONTEXT/sources/SHA256_MANIFEST.txt), [provenance и ограничения импорта](docs/AI_CONTEXT/sources/SOURCE_PACKAGE_INTAKE.md). Research Markdown — текстовое извлечение из исходного DOCX, не отменяет проверку первичных внешних источников. Числа рынка/конкуренты/интервью остаются неподтверждёнными, если отдельное evidence отсутствует.

## Карта памяти

- [FEATURE_STATUS](docs/AI_CONTEXT/FEATURE_STATUS.md), [машинный реестр 231 функций](docs/AI_CONTEXT/FEATURE_REGISTRY.json), [CSV](docs/AI_CONTEXT/FEATURE_REGISTRY.csv).
- [Архитектура](docs/AI_CONTEXT/ARCHITECTURE_MEMORY.md), [решения](docs/AI_CONTEXT/DECISION_LOG.md), [вопросы](docs/AI_CONTEXT/OPEN_QUESTIONS.md).
- [Исследование и provenance](docs/AI_CONTEXT/RESEARCH_TRACEABILITY.md), [расхождения источников](docs/expansion/SOURCE_RECONCILIATION.md), [проверки](docs/AI_CONTEXT/VALIDATION.md).
- История 0–68: `docs/PHASE_REGISTRY.json`; EXP-00–24: `docs/AI_CONTEXT/PHASE_REGISTRY.json`. Это разные пространства номеров.

## Команды из package.json

Node 24.22+ для `node:sqlite`. `npm ci`; `npm run check`; `npm run build`.
CORE: `npm run dev`. Synthetic pilot в отдельном терминале: `PILOT_MODE=PILOT_TEST npm run pilot`; `/pilot`.
Browser: `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2`.
После build: та же переменная + `npm run check:release -- --workers=2`; pilot/offline: `npx playwright test --config playwright.pilot.config.ts` / `playwright.offline.config.ts`.
Не запускать dev и release suite одновременно на 5173. `CI=1` исключает переиспользование чужого dev-сервера. На другой ОС использовать корректный синтаксис переменных/путь браузера.
Контекст: `python3 docs/AI_CONTEXT/validate_context.py`.

## Неизменяемые границы

- Сохранять `LIVE_BLOCKED`. Реальные семьи, consent, специалисты, внешние send, production identity/deploy требуют отдельного поручения и readiness evidence. Только synthetic fixtures в разработке.
- UI → domain SearchService/evaluateOffer; одна услуга до группировки. Unknown ≠ false; unknown price ≠ 0; score ≠ клиническая пригодность. Hard не ослаблять автоматически.
- Private authority только server session → role/owner/scope → transaction/version. DemoRequest IndexedDB и Contact SQLite — разные сущности.
- Private API не кэшировать; summary default-empty; audit без содержимого diary. Не превращать sandbox receipt в delivery или реальную запись.
- RU/KK, keyboard, responsive/reduced motion. Не заявлять native KK/parent/screen-reader review без протокола. Интервью остаётся pending.
- Сохранять исходники/чужие изменения. Отдельная development-ветка; никаких force-push, reset/clean, автоматического merge/deploy, удаления неизвестных файлов или изменения тестов ради PASS.

После законченной задачи обновить feature/phase status, решения, handoff, фактические tests/риски. Проверить точный diff, stage только свои файлы, `git diff --cached --check`, commit, push в разрешённую ветку, проверить remote SHA. При отказе сохранить локально и записать PUSH_BLOCKED. Commit сам по себе не означает синхронизацию. Временные файлы — `work/`; базы, `.env*`, артефакты запусков и приватные данные не коммитить.
