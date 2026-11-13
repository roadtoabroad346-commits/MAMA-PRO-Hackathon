# ДОКУМЕНТ 3. INTEGRATED PHASE EXECUTION PLAN
## Единая дорожная карта EXP-00–EXP-24 для Қолдау.Жол: функции F000–F230, acceptance, тесты, коммиты и push

**Версия:** 1.0 · 13.11.2026 · **Статус:** инженерная программа для безопасного поэтапного выполнения, НЕ отчёт о выполнении.  
**Источник функциональности:** Research v1.0, точный реестр 0–230. **База кода:** GitHub `phase-0-audit` @ `7f8434a4cfd097b531fa584f5b97ebd1e772ad92` на дату анализа; перед выполнением перепроверить.  
**Задача Codex:** идти по стадиям, закрывать slice → tests → evidence → commit → push. При внешних блокерах сохранять прогресс и переходить к независимой безопасной работе.

## 1. НЕ ПУТАТЬ НОМЕРА С ФАКТИЧЕСКОЙ ИСТОРИЕЙ

**F000–F230** — идентификаторы функций Research. **EXP-00–EXP-24** — **новая программа расширения**, не историческая последовательность реализации. В репозитории были исторические фазы 0–67, а предложения 68–78 относятся к live readiness. Их статус нельзя изменять ради красивой диаграммы. Программа EXP повторно **верифицирует** существующие 1–130 и предлагает реализацию LATER 131–230, не создаёт дубль уже готового.

Никаких утверждений «всё 0–230 DONE» без code/QA/human evidence. Для функций, которые не могут быть завершены без настоящих операторов/согласий/партнёров, stage `SYNTHETIC_COMPLETE + LIVE_BLOCKED` является корректным техническим результатом. Это не «срыв», а честная граница проекта.

## 2. ТРИ ВРЕМЕННЫХ ГОРИЗОНТА

- **H0 — безопасная защита хакатона (немедленно):** F001–F130 QA, polished parent journey, Trust Gap, Smart Zero, Қарлығаш deterministic. Не заменять синтетический каталог выдуманными партнёрами; живой human demo и честные слайды.
- **H1 — продуктовая валидация и расширенный synthetic MVP:** F131–F170, UX/cost/accessibility/support catalogue, исследование родителя, synthetic integration contracts. Ценность измерять, не только демонстрировать UI.
- **H2 — при наличии оператора и правовых оснований:** семейный доступ, identity, реальные специалисты/доставка/слоты, мониторинг/backup и ограниченный пилот F171–F230. Без внешних разрешений только проектирование, mock providers, security tests и `BLOCKED_EXTERNAL`.

Календарная дата сама по себе не переводит проект из H0 в H2. Gate зависит от доказательств.

## 3. DEPENDENCY GRAPH И КРИТИЧЕСКИЙ ПУТЬ

```
EXP-00 baseline / Git / research trace
  ├─ EXP-01..05: regress CORE 001–087
  ├─ EXP-06..10: verify synthetic pilot 088–130
  └─ EXP-11: assistant 131–140 (depends on search/trust)
       ├─ EXP-12 voice/AI extras 141–150 (optional)
       ├─ EXP-13 cost/accessibility 151–154
       ├─ EXP-14 routes/discovery 155–166 (external API optional)
       └─ EXP-15 social navigator 167–170 (trusted source data)
EXP-06..10 + external owner/legal gate
  ├─ EXP-16→17: family permission and coordination 171–185
  ├─ EXP-18→19: external comms and booking 186–200
  └─ EXP-20: real trust workflows 201–210
EXP-11..20 + consented metrics plan
  ├─ EXP-21 impact 211–217
  ├─ EXP-22 partner/scale/integrations 218–224
  ├─ EXP-23 ops/security/a11y 225–228
  └─ EXP-24 approved pilot + production 229–230 (external gate)
```

**Строгое правило:** EXP-23/24 нельзя «обойти», даже если UI EXP-18 выглядит рабочим. В частности, семейные приглашения и правовые consent не являются автоматическим продолжением synthetic-login.

## 4. DEFINITION OF READY / DONE / RELEASE

### Definition of Ready (перед каждым slice)

- Есть feature IDs, pain point или обоснованная гипотеза из Research; явно помечено, что еще не подтверждено родителем.
- Прочитан существующий код, оценен reuse и regression blast radius.
- API/data contract и privacy class определены; вопросы/гейты человека перечислены.
- Acceptance criteria: success + no-results + invalid + denied + retry + concurrency при применимости.
- Tests можно исполнить локально без секретов и реальных данных.

### Definition of Done — synthetic

- Работает сквозной путь на синтетических fixtures.
- Domain logic tested, permission negative cases tested; RU/KK и a11y проверены.
- Unit/integration/e2e/build фактически запущены; skipped явно указан.
- Честная маркировка демо; нет real outbound effects; gate `LIVE_BLOCKED` неизменен.
- Документация/feature matrix/evidence обновлены в том же commit.
- **Commit + push** в isolated feature-ветку успешно завершены; remote SHA подтверждён.

### Definition of Done — live (не выполняется одним Codex)

- Назначены юридический/операционный/privacy/security владельцы, проверены правовые основания РК и полномочия родителей, договоры и условия провайдеров.
- Real identity, consent lifecycle, trusted specialists, moderation SLA, encrypted storage, retention/deletion, backup restore, support/incident, staging, security review и field accessibility проверены.
- Есть письменное разрешение на ограниченный real-user pilot, работающие наблюдение/откат и конкретное ответственное лицо.

## 5. АТОМАРНАЯ ПОСТАВКА — ОБЯЗАТЕЛЬНЫЙ GIT ПРОТОКОЛ

**Ветка:** `feature/mamapro-expansion-YYYYMMDD` (или другая уникальная feature ветка). Запрет на direct push в default; запрет force push, reset hard, clean, чужие stashes, удаления PR. Прежде чем выбирать baseline, сравни текущие ветки и проверь, нет ли новых коммитов.

В каждой стадии допускаются **четыре небольших checkpoints**:

1. `EXP-XX.a — contract/design`: ADR, data classes, AC, implementation notes, тест-план. **Commit и push.**
2. `EXP-XX.b — domain/backend`: миграция/чистые правила/API, unit/negative tests. **Commit и push** после прохождения релевантного QA.
3. `EXP-XX.c — UX/integration`: RU/KK, mobile/keyboard, error states, Playwright. **Commit и push** после QA.
4. `EXP-XX.d — verification/handoff`: summary, totals, evidence, blocker list, changed files, next step. **Commit и push**, если эта запись не уже была включена в c; не создавать пустой commit ради красивой последовательности.

Если stage состоит лишь из аудита и нет кодовых изменений, это один содержательный docs/test checkpoint. Каждый **фактически завершённый** шаг синхронизируется в remote, но нельзя пушить секреты, сломанный код, фиктивные PASS-статусы. При CI-красном допускается `docs: blocked stage` с честным тестовым результатом; функциональный stage не считается DONE.

**Команды после проверки окружения:**

```bash
# Безопасная диагностическая последовательность
git status --short --branch
git diff --check
# Запустить актуальные scripts из package.json, как минимум applicable typecheck, tests, build
# Затем stage только осмысленные файлы
git add docs/expansion src server tests  # использовать ИСКЛЮЧИТЕЛЬНО если все перечисленные пути намеренно изменены; предпочтительны явные файлы
git diff --cached --check
git diff --cached --stat
git commit -m "feat(exp-XX): <single verified deliverable>"
git push -u origin <actual-feature-branch>
# Проверить через remote refs/API, что SHA последнего commit совпал
```

В `docs/expansion/STATE.json` всегда укажи последний remote SHA и currentStage; `PROGRESS.md` содержит одно событие на checkpoint. Не записывать примерные/угаданные SHA. Перед передачей следующему Codex поищи отсутствующие локальные коммиты и убедись, что remote up to date.

## 6. ОБЩИЕ КОНТРАКТЫ МЕЖДУ ЭТАПАМИ

### Shared domain contracts

- `OfferFacts`: scope, language, format, age, price, district, accessibility, availability, source/freshness; сохранять семантику `UNKNOWN`.
- `DecisionExplanation`: применённые hard/soft, причины, unverified fields, sources; без медицинского вывода.
- `ProvenanceRecord`: original source, checkedAt, reviewDueAt, reviewer role, change history, publication permission.
- `ContactLifecycle`: platform/sandbox event отдельно от delivery/appointment confirmation.
- `ConsentRecord`: version + purpose + granted/revoked + subject/authority + effect.
- `ResourcePolicy`: actor/session/role/relation/owner/recipient/scope/purpose/time → allow/deny.
- `ImpactEvent`: минимальное событие, не raw diary/medical text, synthetic/live provenance.

### Cross-cutting non-functional contracts

- Все входы валидированы, private DTO allowlisted.
- Сервис не «исправляет» данные за пользователя без подтверждения.
- Idempotent writes, optimistic concurrency/version conflicts, safe retry.
- UI: empty/loading/error/retry, 320–430, text zoom, keyboard, SR roles, RU/KK.
- No real provider send, no real family data, no `LIVE_BLOCKED` changes без внешнего решения.

## 7. РЕЖИМ ДОКАЗАТЕЛЬСТВ ДЛЯ ПРЕЗЕНТАЦИИ

Веди `docs/expansion/PITCH_CLAIMS.md`: `Claim | Source | Date | Evidence grade | Safe wording | Needs validation`. Реализация функции демонстрационным пользователем — не подтверждение социального эффекта. В Research предусмотрен **незаполненный раздел интервью родителя**; он должен остаться пустым до реального созвона с согласием. Социальные гипотезы `H1..H5` проверяются заданиями, а не воображаемыми цитатами.

### Контекст рынка, который нельзя исказить

В Research упомянуты >237 тыс. детей с особыми образовательными потребностями (2025–2026) и 125,1 тыс. детей с инвалидностью (01.11.2026). Эти категории могут пересекаться; их нельзя складывать. Ни одна цифра не означает количество платящих семей, конверсию или валидированный SAM. Конкуренты имеют каталоги/отзывы/запись; слово «первый/единственный» не использовать без доказательств. Мы проверяем возможное отличие через explanation + trust provenance + support navigation.

## 8. ТРЕБОВАНИЯ К ФИНАЛЬНОЙ ИНТЕГРАЦИИ

В конце каждой EXP-стадии создавай/обновляй:

`docs/expansion/stages/EXP-XX.md` с точными `F-IDs`, current SHA, scope, UX flows, API/data contracts, tests passed/failed/skipped/not-run, screenshots/evidence links, security notes, performance, human validation, migration/rollback, `LIVE_BLOCKED`, commit links, next safe slice.

Раз в 3–5 стадий открывай **draft PR** с ясным описанием dependency contract и веткой. Не merge автоматически. Если доступен native PR review, ответь на comments в новом atomic commit+push. При конфликтах — forward-only merge/rebase только если безопасно и не перезаписывает чужую работу; не force push общую ветку.

## 9. ПЛАН СТАДИЙ — ДЕТАЛЬНЫЕ КАРТОЧКИ EXP-00–EXP-24

Ниже **все 231 ID распределены без пропусков и дублирования**. Каждый этап содержит: статус, цели, пользовательскую ценность, contracts, data/security, негативные проверки, acceptance и внешние условия. Порядок является рекомендуемой dependency-последовательностью, а не дедлайном мероприятия.

### Сводная карта стадий

| EXP | Horizon | Feature IDs | Статус источника | Ключевой результат | External gate |
|---|---|---|---|---|---|
| EXP-00 | H0 | F000 | MISSION | Baseline, источники истины и разрешения | Да |
| EXP-01 | H0 | F001–F016 | DEMO | DEMO: главная, языки, навигация и маскот | Только human QA |
| EXP-02 | H0 | F017–F036 | DEMO | DEMO: анкета и подтверждение условий | Только human QA |
| EXP-03 | H0 | F037–F060 | DEMO | DEMO: offer-level matching и каталог | Только human QA |
| EXP-04 | H0 | F061–F075 | DEMO | DEMO: профиль, паспорт доверия, сравнение | Только human QA |
| EXP-05 | H0 | F076–F087 | DEMO | DEMO: заявки, карта, PWA и устойчивость | Только human QA |
| EXP-06 | H0 | F088–F094 | PILOT_TEST | PILOT_TEST: synthetic identity, роли и доступы | Только human QA |
| EXP-07 | H0 | F095–F104 | PILOT_TEST | PILOT_TEST: специалист, анкета и модерация | Только human QA |
| EXP-08 | H0 | F105–F114 | PILOT_TEST | PILOT_TEST: обращения и статусы | Только human QA |
| EXP-09 | H0 | F115–F122 | PILOT_TEST | PILOT_TEST: календарь, inbox и подписки | Только human QA |
| EXP-10 | H0 | F123–F130 | PILOT_TEST | PILOT_TEST: next action, приватные цели и сводка | Только human QA |
| EXP-11 | H0→H1 | F131–F140 | LATER | LATER: deterministic Қарлығаш и explainability | Только human QA |
| EXP-12 | H1 | F141–F150 | LATER | LATER: voice, semantic search и assistant safety | Да |
| EXP-13 | H1 | F151–F154 | LATER | LATER: Accessibility Fit + True Cost Calculator | Да |
| EXP-14 | H1→H2 | F155–F166 | LATER | LATER: маршруты, доступность слотов и расширенный поиск | Да |
| EXP-15 | H1 | F167–F170 | LATER | LATER: Social Support Navigator | Да |
| EXP-16 | H2 | F171–F180 | LATER | LATER: production identity, family permissions, consent | Да |
| EXP-17 | H2 | F181–F185 | LATER | LATER: семейная координация и portability | Да |
| EXP-18 | H2 | F186–F195 | LATER | LATER: связь с живым специалистом и каналы уведомлений | Да |
| EXP-19 | H2 | F196–F200 | LATER | LATER: календарные интеграции и booking lifecycle | Да |
| EXP-20 | H2 | F201–F210 | LATER | LATER: реальный trust, модерация, отзывы | Да |
| EXP-21 | H1→H2 | F211–F217 | LATER | LATER: Social Impact Dashboard и research metrics | Да |
| EXP-22 | H2 | F218–F224 | LATER | LATER: кабинет фонда, партнёры, Telegram, регионы | Да |
| EXP-23 | H2 | F225–F228 | LATER | LATER: observability, backups, production security, real-device a11y | Да |
| EXP-24 | H2 external gate | F229–F230 | LATER | LATER: ограниченный live pilot и production launch | Да |


### EXP-00. Baseline, источники истины и разрешения

**Охват:** F000 · **Исходный Research статус:** MISSION · **Горизонт:** H0 · **Зависимости:** Только репозиторий и Research.

**Зачем родителю/команде:** Согласовать назначение платформы и не потерять фактическое состояние: code SHA, historical phase status, scope, sources, known unknowns. Не изменять продукт ради выполнения этапа.

**Что уже переиспользовать:** Research v1.0; Git status, открытые PR; исходные docs/PHASE_REGISTRY.json и аудит; проверить новые коммиты и собственные локальные файлы.

**Инженерное содержание:** Создать FEATURE_MATRIX 231 ID, gap map, ADR о синтетическом демо, requirements-to-tests map, STATE/PROGRESS/HANDOFF и рабочую ветку. Прочитать AGENTS.md и реальные npm scripts.

**Privacy / security gate:** Секреты не печатать, личные файлы не перезаписывать; ни один live gate не менять.

**Состав функций этой стадии:**

- **F000** — Миссия: прозрачный цифровой навигатор поддержки семьи (MISSION).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-00-AC-01` — 231 ID 0–230 присутствует без дубликатов, Research status сохранён отдельно от code status.
2. `EXP-00-AC-02` — HEAD/remote status/dirty files/PR описаны с настоящими SHA и датами.
3. `EXP-00-AC-03` — Каждый неизвестный исторический stage помечен UNKNOWN/TEAM_ATTESTED, а не выдуман как VERIFIED.
4. `EXP-00-AC-04` — Первый docs-only checkpoint запушен и remote SHA совпадает; если права отсутствуют — честный PUSH_BLOCKED.

**Отрицательные/граничные проверки:** Рабочая папка грязная; неверный remote/default; docs отстают от кода; доступ в GitHub только read-only.

**Применимые тесты:** Schema/uniqueness validation для registry; npm scripts discovery; baseline QA без выдуманных PASS.

**Что нужно от людей:** Участник подтверждает границы при обнаружении противоречий. Отдельный оригинальный Codex chat URL отсутствует.

**Допустимый результат:** Документация/план, не live.

**Git checkpoints:** `docs(exp-00) contracts/evidence` → `test/feat(exp-00) validated slice` → `docs(exp-00) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-01. DEMO: главная, языки, навигация и маскот

**Охват:** F001–F016 · **Исходный Research статус:** DEMO · **Горизонт:** H0 · **Зависимости:** EXP-00.

**Зачем родителю/команде:** Обеспечить понятный вход родителя без регистрации, чёткий CTA, RU/KK, достоверную маркировку демо и визуально связанный путь.

**Что уже переиспользовать:** Home, App Router, AppState, controls/Bird, MASCOT_KARLYGASH, DESIGN_DELIVERY 12–13.11.

**Инженерное содержание:** Не переписывать визуальную систему; при необходимости исправить обнаруженные проблемы текста, focus, mobile reflow, deep links, return navigation и состояния Қарлығаш.

**Privacy / security gate:** Не собирать данные ребёнка, не обещать реальную связь. Избегать декоративной AI-анимации, мешающей клавиатуре.

**Состав функций этой стадии:**

- **F001** — Главная страница (DEMO).
- **F002** — Объяснение платформы (DEMO).
- **F003** — Быстрый переход к каталогу (DEMO).
- **F004** — Маршрут подбора специалиста (DEMO).
- **F005** — Использование без регистрации (DEMO).
- **F006** — Русский язык интерфейса (DEMO).
- **F007** — Казахский язык интерфейса (DEMO).
- **F008** — Переключение языков (DEMO).
- **F009** — Сохранение выбранного языка (DEMO).
- **F010** — Маркировка демоданных (DEMO).
- **F011** — Маскот Қарлығаш (DEMO).
- **F012** — Три позы маскота (DEMO).
- **F013** — Адаптивный дизайн (DEMO).
- **F014** — Мобильная навигация (DEMO).
- **F015** — Прямые ссылки на страницы (DEMO).
- **F016** — Обработка ошибок интерфейса (DEMO).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-01-AC-01` — С нуля можно выбрать один из двух маршрутов, оба работают без регистрации.
2. `EXP-01-AC-02` — Смена RU/KK изменяет все публичные сообщения и сохраняет прогресс.
3. `EXP-01-AC-03` — Демо-маркировка присутствует при каждом чувствительном действии.
4. `EXP-01-AC-04` — Три SVG-позы корректно выглядят при 320/390/1280 и не вмешиваются в accessibility tree.

**Отрицательные/граничные проверки:** Back/refresh/deep link, unavailable localStorage, browser 200% zoom, long KK labels.

**Применимые тесты:** dev E2E, production release E2E, screenshot comparison, keyboard/axe if available.

**Что нужно от людей:** Редактор KK и реальный родитель подтверждают понятность формулировок; до этого NOT_RUN.

**Допустимый результат:** DEMO READY только после текущих тестов.

**Git checkpoints:** `docs(exp-01) contracts/evidence` → `test/feat(exp-01) validated slice` → `docs(exp-01) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-02. DEMO: анкета и подтверждение условий

**Охват:** F017–F036 · **Исходный Research статус:** DEMO · **Горизонт:** H0 · **Зависимости:** EXP-01.

**Зачем родителю/команде:** Родитель без знания специальности может выразить ограничения без диагноза, увидеть ровно те параметры, которые применятся в поиске.

**Что уже переиспользовать:** Intake.tsx, Review.tsx, canonical SearchInput/session schemas.

**Инженерное содержание:** Проверить четыре шага, null semantics, hard/soft switches, budget validation, review count и сохранение текста/настроек. Улучшать UX только по измеренным проблемам.

**Privacy / security gate:** Никаких name/DOB/medical details; private search answers не отправлять в analytics.

**Состав функций этой стадии:**

- **F017** — Анкета из четырёх шагов (DEMO).
- **F018** — Выбор потребности (DEMO).
- **F019** — Выбор категории специалиста (DEMO).
- **F020** — Вариант «Не знаю, кто нужен» (DEMO).
- **F021** — Выбор возрастной группы (DEMO).
- **F022** — Выбор языка занятий (DEMO).
- **F023** — Выбор формата (DEMO).
- **F024** — Выбор района (DEMO).
- **F025** — Выбор бюджета (DEMO).
- **F026** — Учёт заявленной доступности услуги (DEMO).
- **F027** — Обязательные условия (DEMO).
- **F028** — Необязательные предпочтения (DEMO).
- **F029** — Пропуск необязательных вопросов (DEMO).
- **F030** — Возврат к предыдущему шагу (DEMO).
- **F031** — Редактирование ответов (DEMO).
- **F032** — Сохранение состояния анкеты (DEMO).
- **F033** — Валидация данных (DEMO).
- **F034** — Предпросмотр ответов (DEMO).
- **F035** — Подсчёт подходящих вариантов (DEMO).
- **F036** — Переход к результатам (DEMO).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-02-AC-01` — Все 20 IDs функционально прослежены к code/test или зарегистрирован gap.
2. `EXP-02-AC-02` — Review preview использует тот же SearchService и точно соответствует каталогу.
3. `EXP-02-AC-03` — Неизвестный ответ не становится медицинской категорией или ложным hard constraint.
4. `EXP-02-AC-04` — Невалидный бюджет видимо блокирует apply, остальные ответы сохраняются.

**Отрицательные/граничные проверки:** 0, пусто, отрицательное, 100001, длинная строка, back forward history, expired session, KK.

**Применимые тесты:** unit boundary/session; Playwright route/review A/B/C RU/KK.

**Что нужно от людей:** Наблюдение родителя по сценарию «не знаю категорию» — отдельный Human UAT.

**Допустимый результат:** DEMO; полевые выводы отдельно.

**Git checkpoints:** `docs(exp-02) contracts/evidence` → `test/feat(exp-02) validated slice` → `docs(exp-02) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-03. DEMO: offer-level matching и каталог

**Охват:** F037–F060 · **Исходный Research статус:** DEMO · **Горизонт:** H0 · **Зависимости:** EXP-02.

**Зачем родителю/команде:** Дать точный, объяснимый список конкретных услуг и честное пустое состояние.

**Что уже переиспользовать:** SearchService/matching/freshness/SearchResult, Catalog, Filters, ResultMap.

**Инженерное содержание:** Проверить 24 ID, strict hard filters, soft rank, unknown/incomplete, stale, tie-break, grouping after evaluation, price 0 vs UNKNOWN, error/retry. Не заменять текущий алгоритм LLM.

**Privacy / security gate:** No clinical prediction; offer provenance; без автоматического ослабления hard.

**Состав функций этой стадии:**

- **F037** — Поиск специалистов (DEMO).
- **F038** — Поиск конкретных услуг (DEMO).
- **F039** — Фильтрация по категории (DEMO).
- **F040** — Фильтрация по возрасту (DEMO).
- **F041** — Фильтрация по языку (DEMO).
- **F042** — Фильтрация по формату (DEMO).
- **F043** — Фильтрация по району (DEMO).
- **F044** — Фильтрация по бюджету (DEMO).
- **F045** — Учёт неизвестной цены (DEMO).
- **F046** — Учёт бесплатных услуг (DEMO).
- **F047** — Учёт указанной доступности (DEMO).
- **F048** — Комбинация фильтров (DEMO).
- **F049** — Сброс фильтров (DEMO).
- **F050** — Hard constraints (DEMO).
- **F051** — Soft preferences (DEMO).
- **F052** — Расчёт matching score (DEMO).
- **F053** — Расчёт полноты данных (DEMO).
- **F054** — Объяснение соответствия (DEMO).
- **F055** — Разделение точных и неполных совпадений (DEMO).
- **F056** — Проверка актуальности информации (DEMO).
- **F057** — Стабильная сортировка (DEMO).
- **F058** — Обработка отсутствия результатов (DEMO).
- **F059** — Сохранение условий при переходах (DEMO).
- **F060** — Защита от смешивания условий разных услуг одного специалиста (DEMO).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-03-AC-01` — Свойства двух офферов одного специалиста никогда не объединяются для ложного match.
2. `EXP-03-AC-02` — Критерии и объяснения RU/KK коррелируют с результатом; stale исключает ложное verified.
3. `EXP-03-AC-03` — 20/100/1000 synthetic offer benchmark задокументирован в той же среде, без fake field metrics.
4. `EXP-03-AC-04` — Zero results не приводит к скрытой смене ограничений.

**Отрицательные/граничные проверки:** multiple offers, mixed hard, unknown data, stale boundary, budget zero, 1000 offer performance.

**Применимые тесты:** matching/search Vitest + E2E filters/explanations; benchmark and build.

**Что нужно от людей:** Родитель объясняет причины выбора, не считать тест алгоритма человеческой оценкой.

**Допустимый результат:** DEMO; реальные списки не подмешивать.

**Git checkpoints:** `docs(exp-03) contracts/evidence` → `test/feat(exp-03) validated slice` → `docs(exp-03) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-04. DEMO: профиль, паспорт доверия, сравнение

**Охват:** F061–F075 · **Исходный Research статус:** DEMO · **Горизонт:** H0 · **Зависимости:** EXP-03.

**Зачем родителю/команде:** Родитель видит условия конкретной услуги, источники фактов и сравнивает до трёх вариантов.

**Что уже переиспользовать:** OfferProfile, TrustPassport, Comparison, дизайн 13.11.

**Инженерное содержание:** Проверить даты/единицы цены/offer switching, verified scopes, side-by-side desktop, mobile stack, action state и persistence. При статусе проверки обязательно показывать limitations.

**Privacy / security gate:** Синтетический badge не равен подлинной проверке диплома.

**Состав функций этой стадии:**

- **F061** — Карточка специалиста (DEMO).
- **F062** — Несколько услуг одного специалиста (DEMO).
- **F063** — Подробные условия услуги (DEMO).
- **F064** — Цена и продолжительность (DEMO).
- **F065** — Адрес и формат (DEMO).
- **F066** — Паспорт доверия (DEMO).
- **F067** — Статус проверки (DEMO).
- **F068** — Источник информации (DEMO).
- **F069** — Дата проверки (DEMO).
- **F070** — Неизвестные сведения (DEMO).
- **F071** — Сравнение специалистов (DEMO).
- **F072** — Добавление в сравнение (DEMO).
- **F073** — Удаление из сравнения (DEMO).
- **F074** — Сравнение условий (DEMO).
- **F075** — Side-by-side сравнение на компьютере (DEMO).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-04-AC-01` — Профиль отражает именно выбранный offer, ссылка и возврат работают.
2. `EXP-04-AC-02` — В сравнение можно добавить/удалить 2–3 варианта без потери фильтров.
3. `EXP-04-AC-03` — Паспорт показывает источник+дату+ограничение, неизвестный факт честно неизвестен.
4. `EXP-04-AC-04` — На 390/1280 сравнение читается, keyboard accessible.

**Отрицательные/граничные проверки:** missing price/source, withdrawn service, stale fact, unavailable comparison item, KK long text.

**Применимые тесты:** profile/compare unit E2E screenshots.

**Что нужно от людей:** Проверка понимания бейджа родителем; native KK review.

**Допустимый результат:** DEMO; без обещаний качества услуг.

**Git checkpoints:** `docs(exp-04) contracts/evidence` → `test/feat(exp-04) validated slice` → `docs(exp-04) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-05. DEMO: заявки, карта, PWA и устойчивость

**Охват:** F076–F087 · **Исходный Research статус:** DEMO · **Горизонт:** H0 · **Зависимости:** EXP-04.

**Зачем родителю/команде:** Закончить демонстрационный путь честной локальной записью действия и устойчивым восстановлением.

**Что уже переиспользовать:** DemoRequestService, IndexedDB, SavedDemo, SW, ResultMap.

**Инженерное содержание:** Не подключать реальный send. Проверить IndexedDB transaction, same-key retry, double-click, cancel, purge, 7-day TTL, map/list/geolocation refusal, public offline snapshot. Сохранить no-store private APIs.

**Privacy / security gate:** Не отправлять в live; никаких sensitive данных в IndexedDB и cache; демозаявка не подтверждает визит.

**Состав функций этой стадии:**

- **F076** — Создание демозаявки (DEMO).
- **F077** — Подтверждение деморежима (DEMO).
- **F078** — Локальное сохранение заявки (DEMO).
- **F079** — Защита от дублирования (DEMO).
- **F080** — Просмотр заявки (DEMO).
- **F081** — Отмена заявки (DEMO).
- **F082** — Очистка заявок (DEMO).
- **F083** — Восстановление после ошибок (DEMO).
- **F084** — Контроль срока хранения (DEMO).
- **F085** — PWA и сохранённые офлайн-карточки (DEMO).
- **F086** — Карта синтетических специалистов (DEMO).
- **F087** — Базовая доступность интерфейса и локализация дат (DEMO).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-05-AC-01` — Success появляется только после подтверждённого локального сохранения, а не после click.
2. `EXP-05-AC-02` — Двойной submit/uncertain response не порождает дубль.
3. `EXP-05-AC-03` — Offline saved snapshot явно помечен stale; private API не кэшируется.
4. `EXP-05-AC-04` — Карта доступна списком, отказ geolocation не блокирует поиск.

**Отрицательные/граничные проверки:** Corrupt sessionStorage, IndexedDB denial, abort, offline reload, duplicate clicks, expire, cancelled.

**Применимые тесты:** unit demo request + release E2E + offline Playwright.

**Что нужно от людей:** Живой демо-прогон; проверить формулировку «реальная запись не создана».

**Допустимый результат:** DEMO only.

**Git checkpoints:** `docs(exp-05) contracts/evidence` → `test/feat(exp-05) validated slice` → `docs(exp-05) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-06. PILOT_TEST: synthetic identity, роли и доступы

**Охват:** F088–F094 · **Исходный Research статус:** PILOT_TEST · **Горизонт:** H0 · **Зависимости:** EXP-00 и готовая база пилота.

**Зачем родителю/команде:** Убедиться, что тестовые акторы и серверный контроль доступны только в предназначенном synthetic режиме.

**Что уже переиспользовать:** server/http.ts, contracts.ts, service/store, PILOT_MODE/guard.

**Инженерное содержание:** Аудит role/owner/scope, cookie, CSRF/origin, session expiry/logout, invalid actor, operation throttle. Разработать interface для будущего IdP, не внедрять real login.

**Privacy / security gate:** PILOT_TEST loopback; production mode login запрещён; не менять LIVE_BLOCKED.

**Состав функций этой стадии:**

- **F088** — Тестовый вход (PILOT_TEST).
- **F089** — Роли родителей (PILOT_TEST).
- **F090** — Роли специалистов (PILOT_TEST).
- **F091** — Роль модератора (PILOT_TEST).
- **F092** — Роль администратора (PILOT_TEST).
- **F093** — Проверка доступа (PILOT_TEST).
- **F094** — Разделение данных пользователей (PILOT_TEST).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-06-AC-01` — Гость не получает private data; Parent A не читает Parent B.
2. `EXP-06-AC-02` — Specialist/Moderator/Admin не получают дневник родителя по роли.
3. `EXP-06-AC-03` — Сессии/CSRF/Origin fail-closed; закрытая или expired session не продолжает запись.
4. `EXP-06-AC-04` — NODE_ENV=production + test-login и PILOT_LIVE не стартуют.

**Отрицательные/граничные проверки:** IDOR, role spoof, revoked sessions, CSRF, cross-site, brute test, logout failure.

**Применимые тесты:** pilot unit real HTTP negative + 5 pilot E2E baseline.

**Что нужно от людей:** Production identity design требует ответственного security owner.

**Допустимый результат:** Только PILOT_TEST.

**Git checkpoints:** `docs(exp-06) contracts/evidence` → `test/feat(exp-06) validated slice` → `docs(exp-06) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-07. PILOT_TEST: специалист, анкета и модерация

**Охват:** F095–F104 · **Исходный Research статус:** PILOT_TEST · **Горизонт:** H0 · **Зависимости:** EXP-06.

**Зачем родителю/команде:** Отправить на проверку конкретный оффер, безопасно вернуть на доработку, публиковать и отзывать синтетическую запись.

**Что уже переиспользовать:** Onboarding, Forms, server application+moderation.

**Инженерное содержание:** Проверить model application lifecycle, assigned moderator, source scope, publication consent, freshness, immutable history, publish/withdraw, needs_changes, audit.

**Privacy / security gate:** Нельзя доверять specialist self-verified; private evidence не попадает в public projection.

**Состав функций этой стадии:**

- **F095** — Создание анкеты специалиста (PILOT_TEST).
- **F096** — Редактирование анкеты (PILOT_TEST).
- **F097** — Отправка на модерацию (PILOT_TEST).
- **F098** — Проверка полноты (PILOT_TEST).
- **F099** — Одобрение анкеты (PILOT_TEST).
- **F100** — Возврат на доработку (PILOT_TEST).
- **F101** — Отклонение (PILOT_TEST).
- **F102** — Публикация (PILOT_TEST).
- **F103** — Отзыв публикации (PILOT_TEST).
- **F104** — История модерации (PILOT_TEST).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-07-AC-01` — Только назначенный модератор решает допуск; специалист не self-publishes.
2. `EXP-07-AC-02` — При изменении опубликованной услуги требуется новый review; history snapshot сохранён.
3. `EXP-07-AC-03` — Withdraw немедленно удаляет предложение из публичного поиска.
4. `EXP-07-AC-04` — Публичная projection не раскрывает внутреннее evidence или контактные данные.

**Отрицательные/граничные проверки:** Self-approval, stale review, unauthorized decision, overposting, deleted source.

**Применимые тесты:** test state machine, forbidden transitions, E2E role workflow.

**Что нужно от людей:** Реальные модераторы/SLA и проверка документов не утверждены.

**Допустимый результат:** Синтетическая модерация.

**Git checkpoints:** `docs(exp-07) contracts/evidence` → `test/feat(exp-07) validated slice` → `docs(exp-07) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-08. PILOT_TEST: обращения и статусы

**Охват:** F105–F114 · **Исходный Research статус:** PILOT_TEST · **Горизонт:** H0 · **Зависимости:** EXP-06/07.

**Зачем родителю/команде:** Подтвердить честное и устойчивое server-side создание обращения в sandbox с возможностью отзыва.

**Что уже переиспользовать:** Contacts, Inbox, server contact state machine and idempotent operations.

**Инженерное содержание:** Воспроизвести platform received → sandbox available → replied → specialist-confirmed; cancel/revoke/delete; unique key + payload hash; restart durability.

**Privacy / security gate:** Server receipt ≠ provider delivered; no external send; owner checked.

**Состав функций этой стадии:**

- **F105** — Серверное создание обращения (PILOT_TEST).
- **F106** — Внутренний ящик специалиста (PILOT_TEST).
- **F107** — Отслеживание статуса обращения (PILOT_TEST).
- **F108** — Ответ специалиста (PILOT_TEST).
- **F109** — Подтверждение записи (PILOT_TEST).
- **F110** — Отмена обращения (PILOT_TEST).
- **F111** — История изменений (PILOT_TEST).
- **F112** — Защита от повторной отправки (PILOT_TEST).
- **F113** — Хранение обращения в SQLite (PILOT_TEST).
- **F114** — Проверка прав владельца (PILOT_TEST).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-08-AC-01` — Повтор того же idempotency key возвращает тот же результат; другой payload получает conflict.
2. `EXP-08-AC-02` — Отмена не допускает позднего перевода записи в active.
3. `EXP-08-AC-03` — Статус appointment confirmed появляется только после разрешённого действия специалиста.
4. `EXP-08-AC-04` — Нет фальшивых delivery/read states.

**Отрицательные/граничные проверки:** Dropped response after commit, race/cancel, forged role, actor A/B, store restart.

**Применимые тесты:** SQLite restart/transaction, negative HTTP, pilot E2E.

**Что нужно от людей:** Контактный канал реального фонда не определён.

**Допустимый результат:** Sandbox only.

**Git checkpoints:** `docs(exp-08) contracts/evidence` → `test/feat(exp-08) validated slice` → `docs(exp-08) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-09. PILOT_TEST: календарь, inbox и подписки

**Охват:** F115–F122 · **Исходный Research статус:** PILOT_TEST · **Горизонт:** H0 · **Зависимости:** EXP-08.

**Зачем родителю/команде:** Дать родителю организационную историю событий и безопасные in-app reminders без обещания фоновой доставки.

**Что уже переиспользовать:** Calendar, Inbox, NextAction-related jobs, offer subscriptions.

**Инженерное содержание:** Проверить time zones, version conflicts, overlap warning, cancelled jobs, in-app opt-in, dedup and change alert semantics.

**Privacy / security gate:** В уведомлении нет чувствительных полей; нет push/email/recurrence пока.

**Состав функций этой стадии:**

- **F115** — Личный календарь (PILOT_TEST).
- **F116** — Создание событий (PILOT_TEST).
- **F117** — Редактирование событий (PILOT_TEST).
- **F118** — Подтверждённые события (PILOT_TEST).
- **F119** — Предупреждение о пересечении времени (PILOT_TEST).
- **F120** — Напоминания внутри приложения (PILOT_TEST).
- **F121** — Подписка на изменения условий услуги (PILOT_TEST).
- **F122** — Уведомления об изменениях внутри приложения (PILOT_TEST).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-09-AC-01` — Реальный confirmed event рождается из разрешённого подтверждения, personal событие остаётся planned.
2. `EXP-09-AC-02` — Редактирование/отмена инвалидируют старое напоминание и предотвращают повторные inbox-сообщения.
3. `EXP-09-AC-03` — Подписка отключаемая, косметическое обновление не создаёт notice.
4. `EXP-09-AC-04` — Таймзоны, DST/leap и частичное отсутствие сети обработаны честно.

**Отрицательные/граничные проверки:** stale event revision, overlapping, server shutdown, late job, unknown time zone.

**Применимые тесты:** calendar/reminder unit and browser pilot/offline.

**Что нужно от людей:** Фоновая доставка и устройство пользователя не проверены.

**Допустимый результат:** In-app при работающем сервере, не push.

**Git checkpoints:** `docs(exp-09) contracts/evidence` → `test/feat(exp-09) validated slice` → `docs(exp-09) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-10. PILOT_TEST: next action, приватные цели и сводка

**Охват:** F123–F130 · **Исходный Research статус:** PILOT_TEST · **Горизонт:** H0 · **Зависимости:** EXP-06/08/09.

**Зачем родителю/команде:** Сопровождать организационные задачи семьи без рейтинга ребёнка, профилирования состояния или неподтверждённой медицинской помощи.

**Что уже переиспользовать:** NextAction, PrivateRecords, goals/diary/assignments, summary.

**Инженерное содержание:** Проверить CRUD/version/deletion, scoped assignment and response, question/unable, retraction, summary opt-in selection, clipboard and download.

**Privacy / security gate:** Дневник приватен даже от модератора и специалиста без отдельного explicit scope; scrub sensitive text from audit.

**Состав функций этой стадии:**

- **F123** — Следующий организационный шаг (PILOT_TEST).
- **F124** — Отметка выполнения шага (PILOT_TEST).
- **F125** — Личные цели (PILOT_TEST).
- **F126** — Приватный дневник (PILOT_TEST).
- **F127** — Задания от специалиста (PILOT_TEST).
- **F128** — Ответы родителя на задания (PILOT_TEST).
- **F129** — Формирование выборочной сводки (PILOT_TEST).
- **F130** — Копирование и скачивание сводки (PILOT_TEST).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-10-AC-01` — Редактирование/удаление goals/diary не раскрывает текст audit или чужому аккаунту.
2. `EXP-10-AC-02` — Специалист видит только recipient+scope и версию собственной инструкции.
3. `EXP-10-AC-03` — Manual next-action marker не меняет lifecycle записи.
4. `EXP-10-AC-04` — Summary default-empty, только явно выбранные поля, никакой внешней отправки.

**Отрицательные/граничные проверки:** XSS literal, cross-account, revoked scope, stale version, clipboard denial, export denial.

**Применимые тесты:** pilot unit+E2E private and scoped cases.

**Что нужно от людей:** Необходимость полей дневника и реальный consent требуют интервью и privacy owner.

**Допустимый результат:** Synthetic privacy-only.

**Git checkpoints:** `docs(exp-10) contracts/evidence` → `test/feat(exp-10) validated slice` → `docs(exp-10) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-11. LATER: deterministic Қарлығаш и explainability

**Охват:** F131–F140 · **Исходный Research статус:** LATER · **Горизонт:** H0→H1 · **Зависимости:** EXP-01–04; sources/QA completed.

**Зачем родителю/команде:** Интерактивный проводник снижает неопределённость, но не подменяет специалиста и не выдаёт диагноз.

**Что уже переиспользовать:** Bird, text dictionaries, search explanations and trust facts.

**Инженерное содержание:** Создать decision graph + safe dictionary: questions for missing facts; explain category, reasons, next action, safe zero results; optional LLM adapter interface with feature flag OFF. UI clear fallback.

**Privacy / security gate:** Запрет медсоветов, вымышленных фактов/verified badges; sanitize input; no child-sensitive payload.

**Состав функций этой стадии:**

- **F131** — Интерактивная AI-Қарлығаш (LATER).
- **F132** — Диалоговый помощник родителя (LATER).
- **F133** — Объяснение категорий специалистов (LATER).
- **F134** — AI-помощь при заполнении анкеты (LATER).
- **F135** — Объяснение результатов простым языком (LATER).
- **F136** — Trust Gap Assistant (LATER).
- **F137** — Smart Zero Results (LATER).
- **F138** — AI-подготовка вопросов специалисту (LATER).
- **F139** — AI-перевод сложных описаний (LATER).
- **F140** — AI-помощник по навигации (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-11-AC-01` — Қарлығаш умеет объяснять подход и источник каждого факта на RU/KK без LLM.
2. `EXP-11-AC-02` — Trust Gap задаёт вопрос по неизвестному факту и не отвечает за специалиста.
3. `EXP-11-AC-03` — Zero results объясняет ограничение, не снимает hard без подтверждения.
4. `EXP-11-AC-04` — Offline/error → deterministic fallback без фальшивого AI-thinking.

**Отрицательные/граничные проверки:** prompt injection, category ambiguity, stale facts, 0 matches, misleading medical language.

**Применимые тесты:** table-driven rules; negative medical assertions; E2E guide RU/KK.

**Что нужно от людей:** Родитель и эксперт по текстам проверяют понятность; native KK review.

**Допустимый результат:** Synthetic demo of guidance; AI outbound OFF.

**Git checkpoints:** `docs(exp-11) contracts/evidence` → `test/feat(exp-11) validated slice` → `docs(exp-11) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-12. LATER: voice, semantic search и assistant safety

**Охват:** F141–F150 · **Исходный Research статус:** LATER · **Горизонт:** H1 · **Зависимости:** EXP-11, manual accessibility review.

**Зачем родителю/команде:** Упростить навигацию для разных пользователей при сохранении текста как основного и полностью доступного пути.

**Что уже переиспользовать:** Existing search input schema and deterministic assistant; no new PII needed.

**Инженерное содержание:** Определить voice command grammar RU/KK, confirmation before mutations; TTS as optional local/browser capability, semantic retrieval only over allowlisted public source-backed facts; optional LLM after separate review.

**Privacy / security gate:** Микрофон только по явному действию, кратковременные данные, stop controls; no passive recording; semantic search не обходит hard rules.

**Состав функций этой стадии:**

- **F141** — Голосовой ввод RU/KK (LATER).
- **F142** — Голосовое управление (LATER).
- **F143** — Озвучивание интерфейса (LATER).
- **F144** — Персонализированные подсказки Қарлығаш (LATER).
- **F145** — AI-сводка организационной истории (LATER).
- **F146** — AI-помощь специалисту при заполнении профиля (LATER).
- **F147** — Поиск на естественном языке (LATER).
- **F148** — Семантический поиск (LATER).
- **F149** — Объяснение различий между вариантами (LATER).
- **F150** — AI-проверка полноты сведений без автоматической верификации (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-12-AC-01` — Все голосовые команды имеют текстовый эквивалент, отключаемы и объясняют разрешения.
2. `EXP-12-AC-02` — AI/semantic result проходит те же hard filters и provenance controls.
3. `EXP-12-AC-03` — Вопрос о медицинском диагнозе не превращается в совет по лечению.
4. `EXP-12-AC-04` — Отказ микрофона/поставщика сохраняет работоспособность DEMO.

**Отрицательные/граничные проверки:** misrecognition KK, prompt injection, inaccessible voice-only action, no permission.

**Применимые тесты:** text/voice command grammar unit, mocked mic denies, schema, security prompt tests.

**Что нужно от людей:** Носители RU/KK, accessibility reviewers и privacy owner до реального voice.

**Допустимый результат:** Опциональный синтетический prototype; voice не обязателен к хакатону.

**Git checkpoints:** `docs(exp-12) contracts/evidence` → `test/feat(exp-12) validated slice` → `docs(exp-12) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-13. LATER: Accessibility Fit + True Cost Calculator

**Охват:** F151–F154 · **Исходный Research статус:** LATER · **Горизонт:** H1 · **Зависимости:** EXP-03, verified/source-backed schema.

**Зачем родителю/команде:** Сопоставить доступность помещения и экономическую сторону посещений без недоказанных свойств и «скрытых цен».

**Что уже переиспользовать:** Offer DTO, price fields, location unknown handling, Intl KZT.

**Инженерное содержание:** Создать source-backed venue attributes; cost calculator с прозрачными inputs: offer price/unit × planned visits + travel estimate + separately known fees; ranges, unknown and editable assumptions.

**Privacy / security gate:** Не выводить особые потребности ребёнка по ответам и не помечать «подходит для состояния X».

**Состав функций этой стадии:**

- **F151** — Accessibility Fit: подбор по доступности среды (LATER).
- **F152** — True Cost Calculator: полная стоимость поддержки (LATER).
- **F153** — Учёт расходов на дорогу (LATER).
- **F154** — Учёт регулярности занятий (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-13-AC-01` — Если вход не подтверждён, UI пишет unknown, не «доступно».
2. `EXP-13-AC-02` — Стоимость рассчитана по ясной формуле и показана как оценка, не оферта.
3. `EXP-13-AC-03` — Множитель frequency/visits, KZT и неизвестные расходы явно видны.
4. `EXP-13-AC-04` — Матрица доступности использует факты помещения, не диагнозы.

**Отрицательные/граничные проверки:** unknown price, free=0, different units, missing travel, venue source expired, overflow.

**Применимые тесты:** domain cost math/property cases, i18n, a11y, comparison E2E.

**Что нужно от людей:** Реальное подтверждение атрибутов и стоимости делает владелец данных.

**Допустимый результат:** Synthetic only until sourced real offers.

**Git checkpoints:** `docs(exp-13) contracts/evidence` → `test/feat(exp-13) validated slice` → `docs(exp-13) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-14. LATER: маршруты, доступность слотов и расширенный поиск

**Охват:** F155–F166 · **Исходный Research статус:** LATER · **Горизонт:** H1→H2 · **Зависимости:** EXP-03/13; external provider agreement for real routes/availability.

**Зачем родителю/команде:** Помочь осознанно находить варианты по времени, дороге, нескольким районам и изменению предложений без ложных гарантий.

**Что уже переиспользовать:** SearchService, ResultMap and in-app subscriptions.

**Инженерное содержание:** Схема verified slots/stale timestamps; route provider interface, multi-district search, saved searches, notification subscriptions, alternative after cancellation, offer validity policy; ручное смягчение soft.

**Privacy / security gate:** Геолокация opt-in, private route inputs not logged; no fake real-time booking.

**Состав функций этой стадии:**

- **F155** — Подтверждённые свободные слоты (LATER).
- **F156** — Реальная транспортная доступность (LATER).
- **F157** — Расчёт маршрута (LATER).
- **F158** — Общественный транспорт (LATER).
- **F159** — Подбор нескольких услуг для семьи (LATER).
- **F160** — Поиск по нескольким районам (LATER).
- **F161** — Сохранённые поисковые запросы (LATER).
- **F162** — Подписка на новые подходящие предложения (LATER).
- **F163** — Уведомления о новых специалистах (LATER).
- **F164** — Альтернативы при отмене записи (LATER).
- **F165** — Контроль актуальности свободных мест (LATER).
- **F166** — Объяснение компромиссов (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-14-AC-01` — Свободный слот показывается только с provider timestamp и статусом, без подтверждения не booking.
2. `EXP-14-AC-02` — Если маршрутизатор недоступен, показываются адрес и неопределённая длительность, не придуманное ETA.
3. `EXP-14-AC-03` — Сохранённые фильтры остаются tenant-scoped, уведомления opt-in и dedup.
4. `EXP-14-AC-04` — После отмены предлагаются варианты, не создавая новую запись самостоятельно.

**Отрицательные/граничные проверки:** route API unavailable, stale slots, geolocation denied, multiple districts/unknown availability.

**Применимые тесты:** adapter contract fake, invalid slots, A/B isolation, permission tests, responsive.

**Что нужно от людей:** Настоящий поставщик расписания/карт, согласия на geo и проверенные данные.

**Допустимый результат:** Mock routes/slots until provider and agreement.

**Git checkpoints:** `docs(exp-14) contracts/evidence` → `test/feat(exp-14) validated slice` → `docs(exp-14) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-15. LATER: Social Support Navigator

**Охват:** F167–F170 · **Исходный Research статус:** LATER · **Горизонт:** H1 · **Зависимости:** EXP-03/13; human source verification.

**Зачем родителю/команде:** Позволить семье увидеть и понять условия доступных бесплатных/льготных программ без обещания права участия.

**Что уже переиспользовать:** Existing catalog, trust provenance, RU/KK filters.

**Инженерное содержание:** SupportProgram schema with region, issuer, verified conditions, expiry, eligibility, limits, source link, contact method, human verification role. Search/list/filter, rule-based question checklist.

**Privacy / security gate:** Не спрашивать диагноз или загружать документы для простой выдачи; право на льготу не определять автоматически.

**Состав функций этой стадии:**

- **F167** — Поиск бесплатных программ (LATER).
- **F168** — Поиск субсидируемых услуг (LATER).
- **F169** — Поиск по условиям участия в программах (LATER).
- **F170** — Social Support Navigator (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-15-AC-01` — Каждая программа имеет source URL, date checked, status и ограничение.
2. `EXP-15-AC-02` — Unknown eligibility объясняется и отправляет к официальному источнику, не автоматически APPROVED.
3. `EXP-15-AC-03` — Можно отфильтровать бесплатные/субсидируемые, доступны RU/KK.
4. `EXP-15-AC-04` — Истёкшие программы скрыты или явно stale, synthetic fixtures заметны.

**Отрицательные/граничные проверки:** missing source, expired program, mixed funding, no eligibility, update conflicts.

**Применимые тесты:** support source validation, expired boundaries, catalogue E2E.

**Что нужно от людей:** Реестр программ и условия подтверждает фонд/ответственный.

**Допустимый результат:** Синтетические программы до подтверждения организаций.

**Git checkpoints:** `docs(exp-15) contracts/evidence` → `test/feat(exp-15) validated slice` → `docs(exp-15) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-16. LATER: production identity, family permissions, consent

**Охват:** F171–F180 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-06/10 + legal/privacy/operator gate.

**Зачем родителю/команде:** Определить реальные учётные записи, полномочия представителей ребёнка и целевые согласия без несанкционированного расширения доступа.

**Что уже переиспользовать:** Existing synthetic RBAC/owner checks, Zod contracts, sessions.

**Инженерное содержание:** Сначала synthetic family relationship and consent version/revoke model. Строго отделить future identity provider, MFA/account recovery, privacy export and relation expiry. Не заменять synthetic login на self-declared parent.

**Privacy / security gate:** Принцип наименьших привилегий, purpose-specific consent, no auto diary access, encrypted-at-rest planning, audit without child content.

**Состав функций этой стадии:**

- **F171** — Реальная регистрация (LATER).
- **F172** — Восстановление аккаунта (LATER).
- **F173** — Защищённый профиль семьи (LATER).
- **F174** — Приглашение второго родителя (LATER).
- **F175** — Совместный семейный календарь (LATER).
- **F176** — Раздельные права членов семьи (LATER).
- **F177** — Отзыв доступа (LATER).
- **F178** — История согласий (LATER).
- **F179** — Отзыв согласия (LATER).
- **F180** — Безопасный экспорт семейных данных (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-16-AC-01` — Invited adult получает только указанные scopes/время, A/B изоляция выдерживает отрицательные тесты.
2. `EXP-16-AC-02` — Revoked/expired invite мгновенно закрывает дальнейшие чтения/записи.
3. `EXP-16-AC-03` — Consent version меняет разрешение целевого действия, withdrawal effects проверяются.
4. `EXP-16-AC-04` — Реальный IdP и enrollment остаются behind explicit external gate.

**Отрицательные/граничные проверки:** replayed invites, leaked token, family impersonation, export other child, stolen session.

**Применимые тесты:** policy matrix, consent/revoke, auth E2E synthetic.

**Что нужно от людей:** Юрист РК, оператор, подтверждение полномочий законного представителя, security review.

**Допустимый результат:** Только проектирование/synthetic tests до approval.

**Git checkpoints:** `docs(exp-16) contracts/evidence` → `test/feat(exp-16) validated slice` → `docs(exp-16) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-17. LATER: семейная координация и portability

**Охват:** F181–F185 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-16.

**Зачем родителю/команде:** Помочь нескольким законно уполномоченным взрослым согласованно вести организационные задачи без лишнего доступа к приватным записям.

**Что уже переиспользовать:** Calendar, private records, saved offers, consent scopes.

**Инженерное содержание:** Shared calendar and question list as separate resources with explicit grants; safe export, delete request lifecycle, shared favorites and revocation semantics.

**Privacy / security gate:** Усечённый default share, приватное не передаётся автоматически, expiry and revocation applied on every read.

**Состав функций этой стадии:**

- **F181** — Удаление аккаунта и данных по утверждённой процедуре (LATER).
- **F182** — Семейные организационные задачи (LATER).
- **F183** — Совместный список вопросов (LATER).
- **F184** — Общее избранное (LATER).
- **F185** — Передача информации другому опекуну с разрешения (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-17-AC-01` — Shared item доступен только конкретно приглашённому пользователю.
2. `EXP-17-AC-02` — Отзыв права немедленно скрывает записи и будущие выгрузки.
3. `EXP-17-AC-03` — Экспорт содержит только разрешённые поля и даты; удаление фиксирует workflow и retention limitations.
4. `EXP-17-AC-04` — Параллельные правки показывают conflict, не перетирают записи.

**Отрицательные/граничные проверки:** cross-family share, stale group membership, leaked export, simultaneous updates.

**Применимые тесты:** A/B, scope, export, revoked capability, concurrency.

**Что нужно от людей:** Approval family authority, record retention policy.

**Допустимый результат:** Synthetic until legal/ops.

**Git checkpoints:** `docs(exp-17) contracts/evidence` → `test/feat(exp-17) validated slice` → `docs(exp-17) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-18. LATER: связь с живым специалистом и каналы уведомлений

**Охват:** F186–F195 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-08 + EXP-16/20 + provider authorization.

**Зачем родителю/команде:** Не только сохранить тестовую заявку, а честно доставить согласованное обращение и показать точный статус.

**Что уже переиспользовать:** Sandbox inbox/contact state machine, idempotency, consent.

**Инженерное содержание:** Outbox, fake provider, queued/sent/provider_ack/delivered/read distinct, signed callbacks, retries, cancellation, chat boundary, push/email/Telegram adapter toggles. Все реальные endpoints по умолчанию OFF.

**Privacy / security gate:** Server-side secrets, provider permission, anti-abuse, opt-in, per-purpose consent, content minimization, no sensitive lock-screen.

**Состав функций этой стадии:**

- **F186** — Реальные обращения специалистам (LATER).
- **F187** — Подтверждение доставки сообщения (LATER).
- **F188** — Защищённый чат (LATER).
- **F189** — Настоящие свободные слоты (LATER).
- **F190** — Онлайн-запись (LATER).
- **F191** — Перенос записи (LATER).
- **F192** — Отмена подтверждённой записи (LATER).
- **F193** — Push-уведомления (LATER).
- **F194** — Email-уведомления (LATER).
- **F195** — Telegram-уведомления (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-18-AC-01` — No duplicate real-effect attempts on retry; fake provider records attempt once.
2. `EXP-18-AC-02` — UI не называет DELIVERED без provider receipt и не называет booking confirmed без специалиста.
3. `EXP-18-AC-03` — Отозванный consent предотвращает будущую отправку, errors recoverable.
4. `EXP-18-AC-04` — Chat out-of-scope private files/diagnoses are blocked absent approved model.

**Отрицательные/граничные проверки:** provider down, lost receipt, forged callback, revoked consent, duplicate, 429, timeout.

**Применимые тесты:** fake-provider integration, webhook crypto signatures, queue idempotency, CSRF/IDOR.

**Что нужно от людей:** Подключение/договор с каналом, одобрение оператора и получателей, incident plan.

**Допустимый результат:** Integration fake-only; real messages blocked.

**Git checkpoints:** `docs(exp-18) contracts/evidence` → `test/feat(exp-18) validated slice` → `docs(exp-18) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-19. LATER: календарные интеграции и booking lifecycle

**Охват:** F196–F200 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-18; trusted provider slots.

**Зачем родителю/команде:** Предотвратить двойную запись, обеспечить отмену/перенос и синхронизацию только после реального подтверждения.

**Что уже переиспользовать:** Calendar timed event schema, contact confirmation.

**Инженерное содержание:** Google Calendar provider interface, OAuth scope plan, recurrence RRULE/zone, specialist availability, waitlist, collision detection, cancellation and automatic suggestion with manual confirm.

**Privacy / security gate:** Calendar tokens protected backend, consent for sync, no sensitive title in third-party calendar by default.

**Состав функций этой стадии:**

- **F196** — Интеграция с Google Calendar (LATER).
- **F197** — Повторяющиеся события (LATER).
- **F198** — Синхронизация расписания специалиста (LATER).
- **F199** — Лист ожидания (LATER).
- **F200** — Предложение освободившегося времени (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-19-AC-01` — Conflicting slot rejected or surfaced as stale, never silently double-booked.
2. `EXP-19-AC-02` — Reschedule/cancel changes event and invalidates reminders consistently.
3. `EXP-19-AC-03` — Waitlist offers are invitations, not automatic booking or unsolicited messages.
4. `EXP-19-AC-04` — OAuth absent → safe local calendar unchanged.

**Отрицательные/граничные проверки:** DST, leap, revoked OAuth, race double-book, provider latency, recurrence edits.

**Применимые тесты:** booking transactional integration, fake calendar OAuth, timezone, replay/race.

**Что нужно от людей:** Provider contracts/permissions, real specialist calendar, test accounts and approval.

**Допустимый результат:** Mock provider until approvals.

**Git checkpoints:** `docs(exp-19) contracts/evidence` → `test/feat(exp-19) validated slice` → `docs(exp-19) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-20. LATER: реальный trust, модерация, отзывы

**Охват:** F201–F210 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-07 + EXP-16/18 + qualified moderator.

**Зачем родителю/команде:** Проверяемые факты квалификации и доступных услуг, безопасный процесс жалоб и прозрачность отзывов.

**Что уже переиспользовать:** Synthetic trust passport, moderation source/fact model.

**Инженерное содержание:** Verified scope for education/org/identity, document handling boundary without real uploads, review/appeal with audit, expiry revocation, verified contact-linked reviews and specialist response.

**Privacy / security gate:** Никакого AI self-verification, no public evidence scans, impersonation defense, neutral moderation, challenge handling.

**Состав функций этой стадии:**

- **F201** — Реальная проверка квалификации (LATER).
- **F202** — Проверка документов ответственным модератором (LATER).
- **F203** — Подтверждение принадлежности профиля специалисту (LATER).
- **F204** — Проверка организации (LATER).
- **F205** — Повторная проверка устаревших сведений (LATER).
- **F206** — Жалобы и обращения на проверку (LATER).
- **F207** — Обжалование модерации (LATER).
- **F208** — Подтверждённые отзывы (LATER).
- **F209** — Ответ специалиста на отзыв (LATER).
- **F210** — Проверяемая история изменений условий (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-20-AC-01` — Каждый verification badge имеет scope/source/date/reviewer, stale revokes visible status.
2. `EXP-20-AC-02` — Неавторизованный специалист не утверждает собственную квалификацию.
3. `EXP-20-AC-03` — Verified review связан с реальным разрешённым interaction, без disclosure ребёнка.
4. `EXP-20-AC-04` — Appeal не меняет public status без ответственного reviewer.

**Отрицательные/граничные проверки:** self-review, forged source, duplicate reviews, conflicts, expired evidence, privilege escalation.

**Применимые тесты:** RBAC, state machine, audit and moderation E2E.

**Что нужно от людей:** Назначенные компетентные модераторы, процедура проверки реальных документов, согласия на отзывы.

**Допустимый результат:** Synthetic fake evidence only until human-approved.

**Git checkpoints:** `docs(exp-20) contracts/evidence` → `test/feat(exp-20) validated slice` → `docs(exp-20) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-21. LATER: Social Impact Dashboard и research metrics

**Охват:** F211–F217 · **Исходный Research статус:** LATER · **Горизонт:** H1→H2 · **Зависимости:** EXP-00, research protocol, consent/retention if live.

**Зачем родителю/команде:** Измерять устранение информационных барьеров, а не выдумывать медицинские показатели успеха.

**Что уже переиспользовать:** Research hypotheses, test event schema; no existing real-user data.

**Инженерное содержание:** Event taxonomy and consent gate, synthetic metrics: time-to-understand, clarify questions, filter recoveries, search completion, confirmed contact, failed demand, geographic gaps; cohort thresholds; source label.

**Privacy / security gate:** No private diary text in analytics; no unconsented identifiers; aggregate/small-cohort suppression.

**Состав функций этой стадии:**

- **F211** — Social Impact Dashboard (LATER).
- **F212** — Аналитика времени поиска (LATER).
- **F213** — Аналитика успешных контактов (LATER).
- **F214** — Аналитика доступности услуг (LATER).
- **F215** — Обезличенная аналитика потребностей (LATER).
- **F216** — Аналитика незакрытого спроса (LATER).
- **F217** — Карта районов с недостатком предложений (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-21-AC-01` — Synthetic dashboard явно маркирован, не выдаётся за реальные результаты интервью.
2. `EXP-21-AC-02` — Метрика раскрывает numerator/denominator, период, статус данных, sample n.
3. `EXP-21-AC-03` — Отсутствие live events показывает «данных нет», не 100% успеха.
4. `EXP-21-AC-04` — Нет показателей выздоровления/качества ребёнка из интерфейсной активности.

**Отрицательные/граничные проверки:** n=0, very small group, same event duplicate, opt-out, missing consent.

**Применимые тесты:** aggregator property/fake telemetry, privacy no-sensitive, dashboard E2E.

**Что нужно от людей:** Реальное интервью и оператор analytics policy before field events.

**Допустимый результат:** Synthetic measurement demo; real impact not claimed.

**Git checkpoints:** `docs(exp-21) contracts/evidence` → `test/feat(exp-21) validated slice` → `docs(exp-21) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-22. LATER: кабинет фонда, партнёры, Telegram, регионы

**Охват:** F218–F224 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-15/16/18/20/21; partner agreements.

**Зачем родителю/команде:** Сделать масштабируемый административный контур, не превращая внутреннюю статистику в доступ к частным семейным данным.

**Что уже переиспользовать:** Role-based admin, public offers, moderation, safe aggregate events.

**Инженерное содержание:** Partner portal with scoped org roles, programs, review workflow, public API contracts/rate limits, Telegram Mini App as optional presentation shell, multi-city data partitions & localisation.

**Privacy / security gate:** Partner cannot read other organizations/family diary; API keys rotatable, scopes fine-grained, logging and abuse controls.

**Состав функций этой стадии:**

- **F218** — Кабинет фонда (LATER).
- **F219** — Управление программами помощи (LATER).
- **F220** — Professional Referral Network с согласием семьи (LATER).
- **F221** — Telegram Mini App (LATER).
- **F222** — Интеграции с партнёрскими организациями (LATER).
- **F223** — Публичный API с контролем доступа (LATER).
- **F224** — Выход в другие города Казахстана (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-22-AC-01` — Public/partner endpoints return only allowlisted data, enforce scopes and provenance.
2. `EXP-22-AC-02` — Другой город не меняет базовые права; фильтры и таймзоны корректны.
3. `EXP-22-AC-03` — Telegram shell работает без расширения разрешений и без вывода private data в URL.
4. `EXP-22-AC-04` — Фонд видит агрегаты и назначенные задачи, не весь личный дневник.

**Отрицательные/граничные проверки:** org IDOR, token leakage, API spam, region mixing, revoked partnership.

**Применимые тесты:** partner A/B, API scopes, region TZ, rate limits, contract.

**Что нужно от людей:** Фонд/партнёры, соглашения, budgets, approved provider policies.

**Допустимый результат:** Synthetic partner fixtures until agreements.

**Git checkpoints:** `docs(exp-22) contracts/evidence` → `test/feat(exp-22) validated slice` → `docs(exp-22) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-23. LATER: observability, backups, production security, real-device a11y

**Охват:** F225–F228 · **Исходный Research статус:** LATER · **Горизонт:** H2 · **Зависимости:** EXP-06/16/18/20/22; operator/security owners.

**Зачем родителю/команде:** Управляемость и готовность инфраструктуры к безопасному ограниченному пилоту.

**Что уже переиспользовать:** Existing audit metadata, CI, release runbooks, live readiness register.

**Инженерное содержание:** Staging infrastructure plan, logs/metrics with redaction, incident escalation, backup+restore drill on synthetic DB, token rotation, data retention/delete pipeline, CSP/HSTS on TLS layer, SCA, tests across devices and assistive tech.

**Privacy / security gate:** Not merely scan tools: require access review, encryption/secrets, recovery RTO/RPO proposal and tested restore, vulnerability triage.

**Состав функций этой стадии:**

- **F225** — Мониторинг и реагирование на инциденты (LATER).
- **F226** — Резервное копирование и восстановление (LATER).
- **F227** — Production identity и безопасность (LATER).
- **F228** — Реальный аудит accessibility (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-23-AC-01` — Синтетический backup+restore в чистом окружении повторён и проверен checksum/record semantics.
2. `EXP-23-AC-02` — Алёрты не раскрывают PII, key expiry/rotation monitored, least privilege documented.
3. `EXP-23-AC-03` — CI reports checks accurately, dependency risk triaged, rollback measured.
4. `EXP-23-AC-04` — Реальные screen reader/Android/iOS имеют протокол или честный NOT_RUN.

**Отрицательные/граничные проверки:** corrupt DB, restore conflict, leaked logs, absent owner, expired credential, inaccessible form.

**Применимые тесты:** restore drill, failover simulation, secret scan, E2E release and independent manual.

**Что нужно от людей:** Security owner, ops oncall, privacy owner, device testers, native KK editor.

**Допустимый результат:** Production readiness gate still BLOCKED until operational proof.

**Git checkpoints:** `docs(exp-23) contracts/evidence` → `test/feat(exp-23) validated slice` → `docs(exp-23) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


### EXP-24. LATER: ограниченный live pilot и production launch

**Охват:** F229–F230 · **Исходный Research статус:** LATER · **Горизонт:** H2 external gate · **Зависимости:** EXP-16–23 + all required LIVE_READINESS sign-offs.

**Зачем родителю/команде:** Контролируемо проверить реальную полезность при сохранении права на остановку, поддержку и исправление ошибок.

**Что уже переиспользовать:** Product demo/synthetic platform, pilot plan, release manifests.

**Инженерное содержание:** Только после отдельного письменного разрешения: staging review, contract/legal checklist, informed consent, limited cohorts, support/oncall, rollback/switch-off, monitoring and post-launch review. Без разрешения подготовить полный go/no-go pack и остановиться.

**Privacy / security gate:** No live personal information without formal lawful processing, no public deployment by this prompt alone.

**Состав функций этой стадии:**

- **F229** — Ограниченный пилот после согласований (LATER).
- **F230** — Production-запуск (LATER).

**Acceptance criteria (не заменять фактическими PASS без тестов):**

1. `EXP-24-AC-01` — Go/no-go checklist имеет имена ответственных, доказательства и даты, не заполнен фиктивно.
2. `EXP-24-AC-02` — Release candidate SHA воспроизводим, smoke/rollback/recovery инцидентный сценарий проверены.
3. `EXP-24-AC-03` — Пилот имеет согласованный recruitment/support/retention/incident scope и explicit stop condition.
4. `EXP-24-AC-04` — Если любой gate не закрыт — статус NO-GO, `LIVE_BLOCKED` не менять.

**Отрицательные/граничные проверки:** denied consent, incident, broken rollback, provider outage, missing support, unknown legal basis.

**Применимые тесты:** staging drills only; UAT independent; no production deployment until separate authorization.

**Что нужно от людей:** Юрист, оператор/фонд, privacy и security owners, реальные специалисты, письменный authorization.

**Допустимый результат:** BLOCKED_EXTERNAL из исходного состояния.

**Git checkpoints:** `docs(exp-24) contracts/evidence` → `test/feat(exp-24) validated slice` → `docs(exp-24) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.


## 10. МАТРИЦА ВНЕШНИХ ЗАВИСИМОСТЕЙ (ГЕЙТЫ НЕ КОДОМ)

| Гейт | Функции | Человек/организация | Безопасный технический результат до разрешения |
|---|---|---|---|
| Юридическое основание и полномочия взрослых | F171–F185, F229–F230 | Оператор, юрист РК, privacy owner | Synthetic relationship/consent policy tests; live no-go |
| Проверенные специалисты и источники | F155–F170, F201–F210 | Фонд, организации, квалифицированный модератор | Demo fixtures + provenance model, no verified claims |
| Реальная коммуникация и расписание | F186–F200 | Provider/специалисты/оператор | Fake provider, outbox contract, no real send |
| Audio/LLM external model | F131–F150 | Privacy/security owner, supplier agreement | Deterministic assistant, AI OFF, no child data outbound |
| Соблюдение условий и доступности программ | F167–F170 | Program owners, fund partners | Synthetic support cards and expired/source tests |
| Реальная аналитика / результаты интервью | F211–F217 | Родители с согласием, исследователь, data steward | Synthetic dashboard, no fabricated outcome |
| Production security, support, backups | F225–F230 | Infra/security/ops owners | Staging/drill checklist, independent review, LIVE_BLOCKED |

## 11. ВЕРИФИКАЦИЯ ПОКРЫТИЯ И КРИТЕРИИ ФИНАЛЬНОГО АУДИТА

Собери по всем стадиям matrix в 231 строку. Требование: `set(F-IDs)=0..230`, 0 пропусков, 0 дубликатов; все F001–F130 имеют code-level подтверждение или честный GAP, все F131–F230 имеют точный synthetic/live статус, AC и source/human gate. Статус `BLOCKED_EXTERNAL` не засчитывается в live readiness.

**Итоговый проверочный отчёт:**
- `featureCoverage`: all 231 statuses, with commit refs and tests.
- `stageCoverage`: EXP-00..24, required AC and actual QA.
- `safety`: LIVE_BLOCKED remains, no real child data or real outbound transmissions.
- `git`: per-slice commit hashes, remote confirmation, clean feature branch, PR readiness.
- `humanResearch`: результаты родительского интервью только после согласованной встречи и записи фактов.
- `release`: DEMO / PILOT_TEST / FIELD / PRODUCTION individually, not one badge.
- `nextActions`: P0/P1 bugs, human blockers, release decisions, rollback.

## 12. СОПРЯЖЕНИЕ С ИСТОРИЧЕСКИМИ ПРЕДЛОЖЕНИЯМИ 68–78

| Исторический proposed пакет | В новой программе | Смысл сопоставления |
|---|---|---|
| 68 Trusted family | EXP-16, EXP-17 | Семейные отношения, приглашение и отзыв |
| 69 Consent lifecycle | EXP-16 | Purpose-specific versioned consent и последствия отзыва |
| 70 Production identities | EXP-16, EXP-23 | Identity, MFA strategy, secure operations |
| 71 Specialist and organization | EXP-20, EXP-22 | Проверка фактов/модерация и партнёрские scope |
| 72 Live discovery | EXP-14, EXP-15, EXP-20 | Verified offers and source freshness |
| 73 External communications | EXP-18, EXP-19 | Outbox, provider callbacks, booking |
| 74 Clinical boundary review | EXP-11, EXP-12, EXP-23 | Нет медицинских диагнозов/обещаний |
| 75 Operations & retention | EXP-23 | Backup, incidents, retention, access logs |
| 76 UX accessibility | EXP-01..05, EXP-23 | Носители KK, real devices, real parent UAT |
| 77 Release rehearsal | EXP-23, EXP-24 | Rollback, smoke, incident, support |
| 78 Limited launch | EXP-24 | Только с письменным внешним одобрением |

## 13. ФИНАЛЬНЫЙ ПРОМПТ НА ИСПОЛНЕНИЕ ВСЕЙ ПРОГРАММЫ

```text
Ты — Lead Engineering Agent для Қолдау.Жол. Открой текущий repo,
прочитай Research и Документы 1–3, установи baseline SHA, рабочую
ветку и dirty status. Исполни EXP-00..EXP-24 в безопасной
зависимостной последовательности. Для каждого завершённого slice:
разработай AC/tests, реализуй минимальный code/UI/backend,
проверь typecheck/unit/E2E/build/security/privacy/RU+KK,
запиши evidence и обнови STATE/PROGRESS/HANDOFF, создай атомарный
commit и push ТОЛЬКО в feature-ветку, подтвердив remote SHA.
Не смешивай DEMO и live, не придумывай интервью/партнёров/согласия,
не обойди LIVE_BLOCKED, не выполняй real data handling, external sends,
merge/deploy без отдельного разрешения. External gates помечай
BLOCKED_EXTERNAL и продолжай независимую synthetic-safe работу.
В каждом отчёте перечисли закрытые F-IDs, фактически выполненные
тесты и реальные remote SHA. Не называй LATER готовым, если это
лишь макет или контракт. Финальный результат — 231 traceable IDs,
воспроизводимый synthetic demo, честные границы реального пилота.
```

## ПРИЛОЖЕНИЕ A. TRACEABILITY MATRIX — ВСЕ F000–F230

Эта матрица — каноническая копия нумерации из Research и **назначение на EXP-этап**, а НЕ заявление об исполнении.

### F000. Миссия

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F000 | Миссия: прозрачный цифровой навигатор поддержки семьи | MISSION | EXP-00 | Research mission |

### F001–F016. Главная и интерфейс

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F001 | Главная страница | DEMO | EXP-01 | Re-verify DEMO |
| F002 | Объяснение платформы | DEMO | EXP-01 | Re-verify DEMO |
| F003 | Быстрый переход к каталогу | DEMO | EXP-01 | Re-verify DEMO |
| F004 | Маршрут подбора специалиста | DEMO | EXP-01 | Re-verify DEMO |
| F005 | Использование без регистрации | DEMO | EXP-01 | Re-verify DEMO |
| F006 | Русский язык интерфейса | DEMO | EXP-01 | Re-verify DEMO |
| F007 | Казахский язык интерфейса | DEMO | EXP-01 | Re-verify DEMO |
| F008 | Переключение языков | DEMO | EXP-01 | Re-verify DEMO |
| F009 | Сохранение выбранного языка | DEMO | EXP-01 | Re-verify DEMO |
| F010 | Маркировка демоданных | DEMO | EXP-01 | Re-verify DEMO |
| F011 | Маскот Қарлығаш | DEMO | EXP-01 | Re-verify DEMO |
| F012 | Три позы маскота | DEMO | EXP-01 | Re-verify DEMO |
| F013 | Адаптивный дизайн | DEMO | EXP-01 | Re-verify DEMO |
| F014 | Мобильная навигация | DEMO | EXP-01 | Re-verify DEMO |
| F015 | Прямые ссылки на страницы | DEMO | EXP-01 | Re-verify DEMO |
| F016 | Обработка ошибок интерфейса | DEMO | EXP-01 | Re-verify DEMO |

### F017–F036. Анкета

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F017 | Анкета из четырёх шагов | DEMO | EXP-02 | Re-verify DEMO |
| F018 | Выбор потребности | DEMO | EXP-02 | Re-verify DEMO |
| F019 | Выбор категории специалиста | DEMO | EXP-02 | Re-verify DEMO |
| F020 | Вариант «Не знаю, кто нужен» | DEMO | EXP-02 | Re-verify DEMO |
| F021 | Выбор возрастной группы | DEMO | EXP-02 | Re-verify DEMO |
| F022 | Выбор языка занятий | DEMO | EXP-02 | Re-verify DEMO |
| F023 | Выбор формата | DEMO | EXP-02 | Re-verify DEMO |
| F024 | Выбор района | DEMO | EXP-02 | Re-verify DEMO |
| F025 | Выбор бюджета | DEMO | EXP-02 | Re-verify DEMO |
| F026 | Учёт заявленной доступности услуги | DEMO | EXP-02 | Re-verify DEMO |
| F027 | Обязательные условия | DEMO | EXP-02 | Re-verify DEMO |
| F028 | Необязательные предпочтения | DEMO | EXP-02 | Re-verify DEMO |
| F029 | Пропуск необязательных вопросов | DEMO | EXP-02 | Re-verify DEMO |
| F030 | Возврат к предыдущему шагу | DEMO | EXP-02 | Re-verify DEMO |
| F031 | Редактирование ответов | DEMO | EXP-02 | Re-verify DEMO |
| F032 | Сохранение состояния анкеты | DEMO | EXP-02 | Re-verify DEMO |
| F033 | Валидация данных | DEMO | EXP-02 | Re-verify DEMO |
| F034 | Предпросмотр ответов | DEMO | EXP-02 | Re-verify DEMO |
| F035 | Подсчёт подходящих вариантов | DEMO | EXP-02 | Re-verify DEMO |
| F036 | Переход к результатам | DEMO | EXP-02 | Re-verify DEMO |

### F037–F060. Поиск и matching

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F037 | Поиск специалистов | DEMO | EXP-03 | Re-verify DEMO |
| F038 | Поиск конкретных услуг | DEMO | EXP-03 | Re-verify DEMO |
| F039 | Фильтрация по категории | DEMO | EXP-03 | Re-verify DEMO |
| F040 | Фильтрация по возрасту | DEMO | EXP-03 | Re-verify DEMO |
| F041 | Фильтрация по языку | DEMO | EXP-03 | Re-verify DEMO |
| F042 | Фильтрация по формату | DEMO | EXP-03 | Re-verify DEMO |
| F043 | Фильтрация по району | DEMO | EXP-03 | Re-verify DEMO |
| F044 | Фильтрация по бюджету | DEMO | EXP-03 | Re-verify DEMO |
| F045 | Учёт неизвестной цены | DEMO | EXP-03 | Re-verify DEMO |
| F046 | Учёт бесплатных услуг | DEMO | EXP-03 | Re-verify DEMO |
| F047 | Учёт указанной доступности | DEMO | EXP-03 | Re-verify DEMO |
| F048 | Комбинация фильтров | DEMO | EXP-03 | Re-verify DEMO |
| F049 | Сброс фильтров | DEMO | EXP-03 | Re-verify DEMO |
| F050 | Hard constraints | DEMO | EXP-03 | Re-verify DEMO |
| F051 | Soft preferences | DEMO | EXP-03 | Re-verify DEMO |
| F052 | Расчёт matching score | DEMO | EXP-03 | Re-verify DEMO |
| F053 | Расчёт полноты данных | DEMO | EXP-03 | Re-verify DEMO |
| F054 | Объяснение соответствия | DEMO | EXP-03 | Re-verify DEMO |
| F055 | Разделение точных и неполных совпадений | DEMO | EXP-03 | Re-verify DEMO |
| F056 | Проверка актуальности информации | DEMO | EXP-03 | Re-verify DEMO |
| F057 | Стабильная сортировка | DEMO | EXP-03 | Re-verify DEMO |
| F058 | Обработка отсутствия результатов | DEMO | EXP-03 | Re-verify DEMO |
| F059 | Сохранение условий при переходах | DEMO | EXP-03 | Re-verify DEMO |
| F060 | Защита от смешивания условий разных услуг одного специалиста | DEMO | EXP-03 | Re-verify DEMO |

### F061–F075. Профиль и сравнение

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F061 | Карточка специалиста | DEMO | EXP-04 | Re-verify DEMO |
| F062 | Несколько услуг одного специалиста | DEMO | EXP-04 | Re-verify DEMO |
| F063 | Подробные условия услуги | DEMO | EXP-04 | Re-verify DEMO |
| F064 | Цена и продолжительность | DEMO | EXP-04 | Re-verify DEMO |
| F065 | Адрес и формат | DEMO | EXP-04 | Re-verify DEMO |
| F066 | Паспорт доверия | DEMO | EXP-04 | Re-verify DEMO |
| F067 | Статус проверки | DEMO | EXP-04 | Re-verify DEMO |
| F068 | Источник информации | DEMO | EXP-04 | Re-verify DEMO |
| F069 | Дата проверки | DEMO | EXP-04 | Re-verify DEMO |
| F070 | Неизвестные сведения | DEMO | EXP-04 | Re-verify DEMO |
| F071 | Сравнение специалистов | DEMO | EXP-04 | Re-verify DEMO |
| F072 | Добавление в сравнение | DEMO | EXP-04 | Re-verify DEMO |
| F073 | Удаление из сравнения | DEMO | EXP-04 | Re-verify DEMO |
| F074 | Сравнение условий | DEMO | EXP-04 | Re-verify DEMO |
| F075 | Side-by-side сравнение на компьютере | DEMO | EXP-04 | Re-verify DEMO |

### F076–F087. Демозаявки / PWA

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F076 | Создание демозаявки | DEMO | EXP-05 | Re-verify DEMO |
| F077 | Подтверждение деморежима | DEMO | EXP-05 | Re-verify DEMO |
| F078 | Локальное сохранение заявки | DEMO | EXP-05 | Re-verify DEMO |
| F079 | Защита от дублирования | DEMO | EXP-05 | Re-verify DEMO |
| F080 | Просмотр заявки | DEMO | EXP-05 | Re-verify DEMO |
| F081 | Отмена заявки | DEMO | EXP-05 | Re-verify DEMO |
| F082 | Очистка заявок | DEMO | EXP-05 | Re-verify DEMO |
| F083 | Восстановление после ошибок | DEMO | EXP-05 | Re-verify DEMO |
| F084 | Контроль срока хранения | DEMO | EXP-05 | Re-verify DEMO |
| F085 | PWA и сохранённые офлайн-карточки | DEMO | EXP-05 | Re-verify DEMO |
| F086 | Карта синтетических специалистов | DEMO | EXP-05 | Re-verify DEMO |
| F087 | Базовая доступность интерфейса и локализация дат | DEMO | EXP-05 | Re-verify DEMO |

### F088–F104. Тестовые аккаунты / специалисты

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F088 | Тестовый вход | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F089 | Роли родителей | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F090 | Роли специалистов | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F091 | Роль модератора | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F092 | Роль администратора | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F093 | Проверка доступа | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F094 | Разделение данных пользователей | PILOT_TEST | EXP-06 | Re-verify PILOT_TEST |
| F095 | Создание анкеты специалиста | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F096 | Редактирование анкеты | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F097 | Отправка на модерацию | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F098 | Проверка полноты | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F099 | Одобрение анкеты | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F100 | Возврат на доработку | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F101 | Отклонение | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F102 | Публикация | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F103 | Отзыв публикации | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |
| F104 | История модерации | PILOT_TEST | EXP-07 | Re-verify PILOT_TEST |

### F105–F114. Тестовые обращения

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F105 | Серверное создание обращения | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F106 | Внутренний ящик специалиста | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F107 | Отслеживание статуса обращения | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F108 | Ответ специалиста | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F109 | Подтверждение записи | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F110 | Отмена обращения | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F111 | История изменений | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F112 | Защита от повторной отправки | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F113 | Хранение обращения в SQLite | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |
| F114 | Проверка прав владельца | PILOT_TEST | EXP-08 | Re-verify PILOT_TEST |

### F115–F122. Календарь / уведомления

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F115 | Личный календарь | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F116 | Создание событий | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F117 | Редактирование событий | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F118 | Подтверждённые события | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F119 | Предупреждение о пересечении времени | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F120 | Напоминания внутри приложения | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F121 | Подписка на изменения условий услуги | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |
| F122 | Уведомления об изменениях внутри приложения | PILOT_TEST | EXP-09 | Re-verify PILOT_TEST |

### F123–F130. Приватные записи / сводки

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F123 | Следующий организационный шаг | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F124 | Отметка выполнения шага | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F125 | Личные цели | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F126 | Приватный дневник | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F127 | Задания от специалиста | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F128 | Ответы родителя на задания | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F129 | Формирование выборочной сводки | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |
| F130 | Копирование и скачивание сводки | PILOT_TEST | EXP-10 | Re-verify PILOT_TEST |

### F131–F150. AI и Қарлығаш — LATER

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F131 | Интерактивная AI-Қарлығаш | LATER | EXP-11 | Synthetic first; live requires gate |
| F132 | Диалоговый помощник родителя | LATER | EXP-11 | Synthetic first; live requires gate |
| F133 | Объяснение категорий специалистов | LATER | EXP-11 | Synthetic first; live requires gate |
| F134 | AI-помощь при заполнении анкеты | LATER | EXP-11 | Synthetic first; live requires gate |
| F135 | Объяснение результатов простым языком | LATER | EXP-11 | Synthetic first; live requires gate |
| F136 | Trust Gap Assistant | LATER | EXP-11 | Synthetic first; live requires gate |
| F137 | Smart Zero Results | LATER | EXP-11 | Synthetic first; live requires gate |
| F138 | AI-подготовка вопросов специалисту | LATER | EXP-11 | Synthetic first; live requires gate |
| F139 | AI-перевод сложных описаний | LATER | EXP-11 | Synthetic first; live requires gate |
| F140 | AI-помощник по навигации | LATER | EXP-11 | Synthetic first; live requires gate |
| F141 | Голосовой ввод RU/KK | LATER | EXP-12 | Synthetic first; live requires gate |
| F142 | Голосовое управление | LATER | EXP-12 | Synthetic first; live requires gate |
| F143 | Озвучивание интерфейса | LATER | EXP-12 | Synthetic first; live requires gate |
| F144 | Персонализированные подсказки Қарлығаш | LATER | EXP-12 | Synthetic first; live requires gate |
| F145 | AI-сводка организационной истории | LATER | EXP-12 | Synthetic first; live requires gate |
| F146 | AI-помощь специалисту при заполнении профиля | LATER | EXP-12 | Synthetic first; live requires gate |
| F147 | Поиск на естественном языке | LATER | EXP-12 | Synthetic first; live requires gate |
| F148 | Семантический поиск | LATER | EXP-12 | Synthetic first; live requires gate |
| F149 | Объяснение различий между вариантами | LATER | EXP-12 | Synthetic first; live requires gate |
| F150 | AI-проверка полноты сведений без автоматической верификации | LATER | EXP-12 | Synthetic first; live requires gate |

### F151–F170. Продвинутый поиск — LATER

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F151 | Accessibility Fit: подбор по доступности среды | LATER | EXP-13 | Synthetic first; live requires gate |
| F152 | True Cost Calculator: полная стоимость поддержки | LATER | EXP-13 | Synthetic first; live requires gate |
| F153 | Учёт расходов на дорогу | LATER | EXP-13 | Synthetic first; live requires gate |
| F154 | Учёт регулярности занятий | LATER | EXP-13 | Synthetic first; live requires gate |
| F155 | Подтверждённые свободные слоты | LATER | EXP-14 | Synthetic first; live requires gate |
| F156 | Реальная транспортная доступность | LATER | EXP-14 | Synthetic first; live requires gate |
| F157 | Расчёт маршрута | LATER | EXP-14 | Synthetic first; live requires gate |
| F158 | Общественный транспорт | LATER | EXP-14 | Synthetic first; live requires gate |
| F159 | Подбор нескольких услуг для семьи | LATER | EXP-14 | Synthetic first; live requires gate |
| F160 | Поиск по нескольким районам | LATER | EXP-14 | Synthetic first; live requires gate |
| F161 | Сохранённые поисковые запросы | LATER | EXP-14 | Synthetic first; live requires gate |
| F162 | Подписка на новые подходящие предложения | LATER | EXP-14 | Synthetic first; live requires gate |
| F163 | Уведомления о новых специалистах | LATER | EXP-14 | Synthetic first; live requires gate |
| F164 | Альтернативы при отмене записи | LATER | EXP-14 | Synthetic first; live requires gate |
| F165 | Контроль актуальности свободных мест | LATER | EXP-14 | Synthetic first; live requires gate |
| F166 | Объяснение компромиссов | LATER | EXP-14 | Synthetic first; live requires gate |
| F167 | Поиск бесплатных программ | LATER | EXP-15 | Synthetic first; live requires gate |
| F168 | Поиск субсидируемых услуг | LATER | EXP-15 | Synthetic first; live requires gate |
| F169 | Поиск по условиям участия в программах | LATER | EXP-15 | Synthetic first; live requires gate |
| F170 | Social Support Navigator | LATER | EXP-15 | Synthetic first; live requires gate |

### F171–F185. Семья — LATER

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F171 | Реальная регистрация | LATER | EXP-16 | Synthetic first; live requires gate |
| F172 | Восстановление аккаунта | LATER | EXP-16 | Synthetic first; live requires gate |
| F173 | Защищённый профиль семьи | LATER | EXP-16 | Synthetic first; live requires gate |
| F174 | Приглашение второго родителя | LATER | EXP-16 | Synthetic first; live requires gate |
| F175 | Совместный семейный календарь | LATER | EXP-16 | Synthetic first; live requires gate |
| F176 | Раздельные права членов семьи | LATER | EXP-16 | Synthetic first; live requires gate |
| F177 | Отзыв доступа | LATER | EXP-16 | Synthetic first; live requires gate |
| F178 | История согласий | LATER | EXP-16 | Synthetic first; live requires gate |
| F179 | Отзыв согласия | LATER | EXP-16 | Synthetic first; live requires gate |
| F180 | Безопасный экспорт семейных данных | LATER | EXP-16 | Synthetic first; live requires gate |
| F181 | Удаление аккаунта и данных по утверждённой процедуре | LATER | EXP-17 | Synthetic first; live requires gate |
| F182 | Семейные организационные задачи | LATER | EXP-17 | Synthetic first; live requires gate |
| F183 | Совместный список вопросов | LATER | EXP-17 | Synthetic first; live requires gate |
| F184 | Общее избранное | LATER | EXP-17 | Synthetic first; live requires gate |
| F185 | Передача информации другому опекуну с разрешения | LATER | EXP-17 | Synthetic first; live requires gate |

### F186–F200. Связь/записи — LATER

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F186 | Реальные обращения специалистам | LATER | EXP-18 | Synthetic first; live requires gate |
| F187 | Подтверждение доставки сообщения | LATER | EXP-18 | Synthetic first; live requires gate |
| F188 | Защищённый чат | LATER | EXP-18 | Synthetic first; live requires gate |
| F189 | Настоящие свободные слоты | LATER | EXP-18 | Synthetic first; live requires gate |
| F190 | Онлайн-запись | LATER | EXP-18 | Synthetic first; live requires gate |
| F191 | Перенос записи | LATER | EXP-18 | Synthetic first; live requires gate |
| F192 | Отмена подтверждённой записи | LATER | EXP-18 | Synthetic first; live requires gate |
| F193 | Push-уведомления | LATER | EXP-18 | Synthetic first; live requires gate |
| F194 | Email-уведомления | LATER | EXP-18 | Synthetic first; live requires gate |
| F195 | Telegram-уведомления | LATER | EXP-18 | Synthetic first; live requires gate |
| F196 | Интеграция с Google Calendar | LATER | EXP-19 | Synthetic first; live requires gate |
| F197 | Повторяющиеся события | LATER | EXP-19 | Synthetic first; live requires gate |
| F198 | Синхронизация расписания специалиста | LATER | EXP-19 | Synthetic first; live requires gate |
| F199 | Лист ожидания | LATER | EXP-19 | Synthetic first; live requires gate |
| F200 | Предложение освободившегося времени | LATER | EXP-19 | Synthetic first; live requires gate |

### F201–F210. Доверие — LATER

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F201 | Реальная проверка квалификации | LATER | EXP-20 | Synthetic first; live requires gate |
| F202 | Проверка документов ответственным модератором | LATER | EXP-20 | Synthetic first; live requires gate |
| F203 | Подтверждение принадлежности профиля специалисту | LATER | EXP-20 | Synthetic first; live requires gate |
| F204 | Проверка организации | LATER | EXP-20 | Synthetic first; live requires gate |
| F205 | Повторная проверка устаревших сведений | LATER | EXP-20 | Synthetic first; live requires gate |
| F206 | Жалобы и обращения на проверку | LATER | EXP-20 | Synthetic first; live requires gate |
| F207 | Обжалование модерации | LATER | EXP-20 | Synthetic first; live requires gate |
| F208 | Подтверждённые отзывы | LATER | EXP-20 | Synthetic first; live requires gate |
| F209 | Ответ специалиста на отзыв | LATER | EXP-20 | Synthetic first; live requires gate |
| F210 | Проверяемая история изменений условий | LATER | EXP-20 | Synthetic first; live requires gate |

### F211–F230. Impact/платформа — LATER

| F-ID | Название | Research status | Stage | Предполагаемая глубина приемки |
|---|---|---|---|---|
| F211 | Social Impact Dashboard | LATER | EXP-21 | Synthetic first; live requires gate |
| F212 | Аналитика времени поиска | LATER | EXP-21 | Synthetic first; live requires gate |
| F213 | Аналитика успешных контактов | LATER | EXP-21 | Synthetic first; live requires gate |
| F214 | Аналитика доступности услуг | LATER | EXP-21 | Synthetic first; live requires gate |
| F215 | Обезличенная аналитика потребностей | LATER | EXP-21 | Synthetic first; live requires gate |
| F216 | Аналитика незакрытого спроса | LATER | EXP-21 | Synthetic first; live requires gate |
| F217 | Карта районов с недостатком предложений | LATER | EXP-21 | Synthetic first; live requires gate |
| F218 | Кабинет фонда | LATER | EXP-22 | Synthetic first; live requires gate |
| F219 | Управление программами помощи | LATER | EXP-22 | Synthetic first; live requires gate |
| F220 | Professional Referral Network с согласием семьи | LATER | EXP-22 | Synthetic first; live requires gate |
| F221 | Telegram Mini App | LATER | EXP-22 | Synthetic first; live requires gate |
| F222 | Интеграции с партнёрскими организациями | LATER | EXP-22 | Synthetic first; live requires gate |
| F223 | Публичный API с контролем доступа | LATER | EXP-22 | Synthetic first; live requires gate |
| F224 | Выход в другие города Казахстана | LATER | EXP-22 | Synthetic first; live requires gate |
| F225 | Мониторинг и реагирование на инциденты | LATER | EXP-23 | Synthetic first; live requires gate |
| F226 | Резервное копирование и восстановление | LATER | EXP-23 | Synthetic first; live requires gate |
| F227 | Production identity и безопасность | LATER | EXP-23 | Synthetic first; live requires gate |
| F228 | Реальный аудит accessibility | LATER | EXP-23 | Synthetic first; live requires gate |
| F229 | Ограниченный пилот после согласований | LATER | EXP-24 | Synthetic first; live requires gate |
| F230 | Production-запуск | LATER | EXP-24 | Synthetic first; live requires gate |


## ПРИЛОЖЕНИЕ B. ПРАВИЛА НЕДОКАЗАННОЙ «ГОТОВНОСТИ»

Для фазы H0 достаточно проверенного DEMO и synthetic пилота. Для H1 — реальный CustDev, когда участник сам его предоставит, и работающие synthetic features. Для H2 — личное утверждение ответственными лицами и доказанная безопасность. Не считать активную кнопку «Записаться» доказательством свободного слота, chatbot — врачом, скан документа — проверенной квалификацией, а диаграмму — измеренным социальным эффектом. Все LATER сохранять в матрице даже если отложены.
