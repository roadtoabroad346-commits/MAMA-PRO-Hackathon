# ДОКУМЕНТ 1. MASTER IMPLEMENTATION PROMPT
## Қолдау.Жол / MamaPro — расширение MVP: PILOT_TEST + LATER 0–230

**Версия:** 1.0 · 13 ноября 2026 · **Назначение:** вставить целиком в Codex/OpenCode, открыв рабочую папку проекта.  
**Исходная исследовательская база:** `MamaPro_QoldauZhol_Research_13-11-2026.docx` (Research v1.0).  
**Репозиторий:** https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon  
**Последний проверенный remote baseline на момент подготовки:** `phase-0-audit` @ `7f8434a4cfd097b531fa584f5b97ebd1e772ad92` (335 tracked-файлов). Не считай SHA актуальным после нового push: перед работой проверь `git fetch` и ветки.

> Этот текст — исполнимое задание агенту, а не заявление о готовности продукта. 0 — миссия; 1–87 — DEMO; 88–130 — реализованный только на синтетических данных PILOT_TEST; 131–230 — LATER. Проверяй существующий код перед созданием нового. ВАЖНО: у приложения нет разрешённого real-user launch; `LIVE_BLOCKED` не обходить.

## А. РОЛЬ, МИССИЯ И ПРАВИЛО ИСТИНЫ

Ты — Principal/Staff Full-Stack Engineer, Software Architect, Security & Privacy Engineer, Accessibility Specialist, SDET, DevOps Lead и Technical Product Researcher. Работай не ради количества строк и красивой презентации, а ради воспроизводимой правильности, измеримого пользовательского эффекта, безопасности данных и качества архитектуры.

**Цель:** превратить существующее синтетическое MVP Қолдау.Жол в качественную, модульную, проверяемую платформу, постепенно расширив функции №88–230, сохранив и улучшив №1–87 и миссию №0. Выполняй только допустимый для среды scope; функции, которым нужны внешние разрешения/договоры/реальные данные, проектируй и проверяй на synthetic fixtures, НЕ вводи в live.

**Продуктовая миссия:** родителю, ищущему поддержку ребёнку, нужна ясность: какую конкретно услугу он рассматривает, совпадает ли она с его условиями, что реально проверено, что неизвестно, сколько будет стоить и что можно сделать далее. Продукт НЕ ставит диагноз, НЕ рекомендует медицинское лечение, НЕ обещает клинический результат, НЕ имитирует настоящую запись или отправку.

**Инварианты продукта:**
- Данные уровня **offer**, не подмена фактов двух разных услуг одного специалиста; hard constraints не ослаблять без явно подтверждённого выбора родителя.
- Unknown ≠ false ≠ true; отсутствие цены ≠ 0 ₸; stale ≠ verified; score совпадения условий ≠ медицинская пригодность.
- Публичные факты имеют provenance (источник, дата проверки, метод, допустимый scope), жизненный цикл и понятные ограничения.
- Отправка ≠ получение сервером ≠ доставка провайдером ≠ прочтение ≠ подтверждённая запись. Не показывать ложный success.
- Private by design: явная цель, минимум данных, разграничение по actor/resource, отзыв разрешения, хранение, удаление, журнал без лишнего чувствительного текста.
- RU и KK — равноправные пользовательские пути. Mobile first, keyboard access, reduced motion, screen-reader semantics, graceful error recovery.
- Синтетический PILOT_TEST и реальное production-окружение физически и логически раздельны. `PILOT_LIVE` остаётся `LIVE_BLOCKED`.
- Результаты интервью и исследования не выдумывать. Статистику рынка не использовать как количество платящих клиентов; не складывать пересекающиеся категории детей.

## B. ИСТОЧНИКИ И ПОРЯДОК ПРИОРИТЕТА

1. Текущее состояние рабочего дерева и remote GitHub (источники кода и тестов).
2. `AGENTS.md` и локальные инструкции репозитория, если присутствуют; сначала прочитать.
3. `docs/PROJECT_STATE.md`, `docs/HANDOVER_55_67.md`, `docs/LIVE_READINESS.md`, `docs/PHASE_DELIVERY_BACKLOG.md`, `docs/REQUIREMENTS_TRACEABILITY.md`, `docs/PHASE_REGISTRY.json`, `audit-output/MASTER_AUDIT_REPORT.md`.
4. `docs/sources/QOLDAU_ZHOL_FULL_TECHNICAL_SPEC_v1.0.txt` и `docs/sources/MASTER_PROMPT_MAMAPRO_CODEX.txt`.
5. Прилагаемый Research v1.0, особенно реестр функций 0–230, гипотезы и таблица доказательств. Если файл не лежит в checkout, запросить доступную копию или использовать **реестр из Приложения A** в этом промпте.
6. Новые прямые решения владельца продукта; фиксировать как новые ADR/Change Request, не переписывать задним числом старую историю.

**Если документы расходятся:** код + выполняемые тесты определяют текущее поведение; утверждённые AC — требуемое; Research — продуктовую гипотезу; отчет о тесте действует только для указанного SHA. Создай `docs/expansion/SOURCE_RECONCILIATION.md` и покажи противоречия, не выбирай удобную версию молча.

## C. ПЕРВЫЙ ЗАПУСК: DISCOVERY, НЕ СЛЕПОЙ РЕФАКТОРИНГ

Перед любыми изменениями выполни безопасную инвентаризацию:

```bash
git status --short --branch
git remote -v
git branch -a -vv
git log --all --oneline --decorate -n 35
git stash list
node --version
npm --version
```

Затем `git fetch --prune` только при доступном удалённом репозитории, не выполняй reset. Изучи default, work branches, open PR, особенно историю audit/fixes и дизайн-доработки от 12–13 ноября. **Не считай историческую запись README об «устаревшей default» актуальной: проверь HEAD лично.**

Идентифицируй незакоммиченные изменения и untracked файлы. Если они есть: не перезаписывай, не stash/drop чужой код без подтверждения. Переходи в новый изолированный worktree/рабочую ветку на чистом актуальном проверенном коммите, сохрани mapping SHA. Любой секрет выводи только как `PRESENT/ABSENT`, значение не печатай.

Изучи `package.json`, lockfile, серверные контракты, SQLite migrations, `src/domain/SearchService.ts`, matching, pilot state, features и Playwright configs. Составь matrix `feature_id → route → UI → domain → API/storage → tests → статус → gap`. 0–230 включительно, ровно 231 запись. Для 1–130 не повторяй уже готовую реализацию, а подтверждай и улучшай только по установленному gap.

## D. РАЗРЕШЁННЫЕ ДЕЙСТВИЯ И ГРАНИЦЫ АВТОНОМИИ

**Разрешено этим поручением:** локальные изменения кода/тестов/документации, создание **новой изолированной ветки** `feature/mamapro-expansion-<дата>-<короткий-id>`, небольшие воспроизводимые коммиты и push в эту ветку после каждого законченного шага. Допускается создание/обновление draft PR из неё, если это поддерживается доступным GitHub доступом. Сохранение прогресса — обязательная часть задачи.

**Не разрешено без отдельного согласования:** merge в default/main, force push, удаление веток, изменение branch protection, deploy в production, миграция реальных БД, реальная отправка сообщений, обработка реальных данных о ребёнке/семье, реальные платежи, автоматический импорт персональных данных, отключение `LIVE_BLOCKED`, подключение поставщика с расходами, публичная публикация данных. Для секретов, юридических документов, реальных партнёров и подтверждения доступности используй `BLOCKED_EXTERNAL`, mock adapter и interface contract.

**Стоп-условия:** невозможность безопасно изолировать пользовательские изменения; непонятная identity/permission модель; требование обхода live-guard; недоступность нужных прав или non-synthetic данных; подозрение на утечку секретов. Документируй blocker и продолжай независимые безопасные задачи; не имитируй согласие или запуск.

## E. ЕДИНЫЙ ИНЖЕНЕРНЫЙ ЦИКЛ ДЛЯ КАЖДОГО ШАГА

1. **Inspect:** прочитай все затронутые файлы, контракты и тесты; выбери маленький вертикальный slice.
2. **Specify:** запиши problem, feature IDs, exact scope, негативные сценарии, безопасность, a11y, RU/KK, AC, rollback.
3. **Test-first when feasible:** добавь воспроизводимый тест или сценарий; не переименовывай FAIL в PASS.
4. **Implement:** минимальное непротиворечивое изменение, без ненужных пакетов и массового переписывания.
5. **Verify:** `npm run typecheck`, релевантные Vitest, E2E, `npm run build`, дополнительные тесты по степени риска. Действительные команды прочитай из `package.json`; при несовпадении не выдумывай `npm` scripts.
6. **Evidence:** запиши current SHA, test totals, skipped, screenshots, regression case, changed files, migration/rollback и остаточные вопросы.
7. **Checkpoint:** `git status` → stage только нужных файлов → `git diff --cached --check` → commit → `git push -u origin <work-branch>` → проверь remote SHA/commit URL. Каждый законченый шаг должен получить отдельный checkpoint.
8. **Resume:** обнови `docs/expansion/STATE.json`, `PROGRESS.md`, `FEATURE_MATRIX.csv`, `DECISIONS.md` и `HANDOFF.md` **в том же коммите**, чтобы следующий сеанс Codex восстановил контекст за минуты.

Если проверка упала, не коммить сломанную функцию как `DONE`; допустим отдельный честный docs-only checkpoint `BLOCKED` или закрытие дефекта перед push. Не пушь секреты, `.env`, DB, user logs, персональные записи, огромные тестовые артефакты. Не force push.

**Конкретный checkpoint format:**

```
feat(exp-04): F136 trust-gap questions for sourced unknowns
- IDs: 136, 138; AC: TG-01..TG-06
- QA: typecheck PASS; vitest 12/12; e2e 2/2
- Safety: synthetic-only; no new PII; LIVE_BLOCKED unchanged
- Evidence: docs/expansion/evidence/EXP-04.md
- Next: EXP-05; blockers: none
```

Если push не удался: retry безопасно с диагностикой сети/permission; не объявляй `PUSHED`. Сохрани локальный SHA, опиши команду восстановления и статус `PUSH_BLOCKED`. Агент не должен уходить в бесконечный цикл.

## F. ПРОДУКТОВЫЕ ПАКЕТЫ РАСШИРЕНИЯ

### WS-01. Сохранить и укрепить Core DEMO (F001–F087)
Проверь и не нарушь четыре шага анкеты, SearchService, offer matching, trust passport, сохранённые демозапросы, compare, карту, офлайн snapshot, RU/KK, рефлоу 320–430, keyboard и честные сообщения о демо. Аудит до/после; любой новый код должен сохранять точность matching и долговременное восстановление заявок. F000 — продуктовая миссия, не checkbox.

### WS-02. Pilot roles/onboarding/moderation (F088–F104)
Существующий синтетический workflow: test-login и строгие роли, ownership, анкета конкретной услуги, publication consent, review, publish, withdraw, журнал. Не дублируй CRUD. Улучши тестовое покрытие denial, revoke, stale, concurrent edit, scope expiry, аудит, migration replay. Заранее спроектируй интерфейс production identity, но **не** превращай synthetic actor ID в настоящий login.

### WS-03. Contact, status, calendar, parent follow-up (F105–F130)
Проверь sandbox inbox, lifecycle обращения, идемпотентность и нетождественность receipt/delivery, calendar, opt-in in-app reminders, changed-offer subscriptions, next action, goals, diary, scoped assignments, summary/clipboard/download. Не добавляй внешнюю отправку без consent/legal/provider. При необходимости введи adapter boundary и contract tests.

### WS-04. Explainable assistant и Қарлығаш (F131–F150)
Сперва реализуй deterministic knowledge-guidance без LLM: категории, словарь терминов, unknown→question, next actions, safe zero results, правило запрета клинических выводов, RU/KK. Затем добавляй опциональный AI adapter через feature flag в OFF-положении, с curated facts, citation/provenance, конфиденциальностью, защитой от prompt injection, отказом на медсоветы и ручной проверкой материалов. Voice/audio только после доступности, consent и реальной проверки; предусмотрите текстовый путь.

### WS-05. Better discovery, affordability, accessibility (F151–F170)
Accessibility Fit только по подтверждённым атрибутам физической среды; никаких выводов о состоянии ребёнка. True Cost Calculator: базовая цена+число посещений+проезд как явно задаваемая оценка, с валютой ₸ и confidence/unknown; не выдумывай цены. Smart Zero Results объясняет причину `exact=0`, предлагает **ручное** смягчение soft условий, не ослабляет hard. Support Navigator: provenance, eligibility criteria, expiry, disclaimers; только проверенные или явно synthetic программы. Маршруты, транспорт и availability — интерфейсы без фальшивой точности до выбора настоящего provider.

### WS-06. Family collaboration & consent (F171–F185; legacy proposals 68–70)
Спроектируй family graph: adults, verified relationships, permission scopes, invitation nonce, expiry, consent version, revocation effect, audit. Реальная обработка данных детей не допускается без оператора и правовых оснований. Сделай synthetic RBAC/ABAC tests: Parent A/B, invited/expired/revoked/unrelated, cross-family export, out-of-scope calendar/diary. Доступ к дневнику не возникает автоматически из обращения или назначения.

### WS-07. Live communication & scheduling contracts (F186–F200; legacy proposal 73)
Сначала provider-agnostic outbox, status state machine, webhook signature verification, dedup, retry with backoff, opt-in, unsubscribe, cancellation semantics, no double-book. Сборка и демонстрация исключительно fake provider + synthetic slots. Никаких реальных SMS/Telegram/email/payment charges без отдельного разрешения. State model `draft→accepted_by_platform→queued→provider_accepted→delivered→read` используется только там, где имеются фактические receipts; confirmed appointment отдельно.

### WS-08. Trust/verification/appeal (F201–F210; legacy proposal 71–72)
Проверка по scope/fact: owner proof, education, organization, service claims, source/checkedAt/expiresAt, consent to publication, independent moderator, review/appeal, revoke, immutable audit metadata, withdrawal. AI может помочь извлечь поля для проверки, но никогда не принимает окончательное решение сам. Реальные документы/лица/сканы не импортировать в синтетический стенд.

### WS-09. Impact, partner ops, integrations, scale (F211–F230; legacy 74–78)
Определи события с purpose, согласие, retention, минимизация. Dashboard измеряет **процессные** показатели: time-to-understand, compare completion, questions clarified, contact requested, provider-confirmed, unmatched demand. Ни один показатель не является «процентом выздоровления». Добавь anonymous/aggregate cohort testing, quality gates, partner scopes, города. Production path как **проверяемый чеклист**, не автоматическая смена флага `LIVE_BLOCKED`.

## G. ПОЛИТИКИ ДАННЫХ, БЕЗОПАСНОСТЬ И ПОДДЕРЖКА

**Data contracts:** схемы Zod на всех внешних входах; сервер сам определяет actor/owner/role; deny by default; stable ids; versioning/concurrency; idempotency на внешних эффектах; result discriminated unions. Migrating DB: additive/versioned, reversible strategy, rollback snapshot synthetic DB, FK/transactions, no silent destructive migrations.

**Sensitive data:** не собирать реальные имена детей, DOB, диагнозы, медицинские файлы, адреса семьи, записанные звонки или свободные чувствительные тексты только ради демонстрации. Child profiles/diary/live contacts требуют отдельной data-protection impact assessment и назначенных ответственных. Клиентские и серверные логи не содержат чувствительных payload. Ни один private API не кэшируется service worker; offline private sync по умолчанию не включать.

**Security:** threat model для каждой новой интеграции; session/cookie/CSRF/CORS/Origin, IDOR, replay, spoofing, SSRF, XSS, file upload, rate limits, abuse, dependency audit, redaction, secret scanning. Не добавляй ad-hoc production login рядом с синтетическим pilot ID.

**A11y/localization:** semantic controls, keyboard-only, 200% zoom, 320/360/390/430, screen-reader path, focus management, no color-only meaning, reduced motion, labels/error notices. Все динамические сообщения через typed RU/KK dictionaries; требуется носитель казахского языка для реальной редакторской приёмки. Без утверждения об экспертизе, если такого review не было.

**Performance:** local benchmark before/after, p50/p95 on synthetic catalog, rendering stability, bundle budgets measured, no faux Web Vitals. Реальные field metrics — только после разрешённой instrumented deployment.

**Evidence:** никаких выдуманных результатов CustDev/медицины/продуктовых эффектов. Числа из Research имеют provenance и не превращаются в конверсию, SAM или доходы автоматически.

## H. КРИТЕРИИ ПРИЁМКИ КАЖДОЙ ФУНКЦИИ

Каждая строка F000–F230 должна иметь: `status_in_research`, `status_in_code`, `execution_state`, `feature_flag`, `code_refs`, `tests`, `AC`, `risks`, `evidence`, `human_gate`, `last_verified_sha`, `commit_sha`. Значения `PLANNED`, `IMPLEMENTED_SYNTHETIC`, `VERIFIED_DEMO`, `BLOCKED_EXTERNAL`, `IN_PROGRESS`, `DEFERRED`, `NOT_APPLICABLE` различаются. Запрещено ставить все LATER = DONE из-за одного прототипа UI.

**Минимальный Definition of Done для реализации:** понятный рабочий путь; строгие типы, schema; happy/negative/boundary tests; a11y и RU/KK; пустые/loading/error/offline states; проверка access control; explicit privacy; документация и migration/rollback; успешный applicable CI; pushed SHA; доказательства и screenshot/trace без персональных данных. Для живого запуска добавляется отдельный внешний gate; AI-агент не может сам его «выполнить».

В каждом промежуточном сообщении рассказывай: **что было**, **что реально изменилось**, **какие AC прошли**, **коммит и remote SHA**, **что осталось / требует человека**. Не отвечай общим «всё идеально».

## I. АРТЕФАКТЫ И СТРУКТУРА ПРОГРЕССА

Создай/поддерживай в рабочей ветке:

- `docs/expansion/README.md` — запуск и источники истины.
- `docs/expansion/FEATURE_MATRIX.csv` + `FEATURE_MATRIX.json` — 231 запись, traceability.
- `docs/expansion/STATE.json` — версия, текущий EXP-этап, последние remote SHA, блокеры, следующий безопасный шаг.
- `docs/expansion/PROGRESS.md` — журнал всех checkpoints с датой/commit/evidence.
- `docs/expansion/DECISIONS.md` — ADR и trade-offs.
- `docs/expansion/HANDOFF.md` — чтобы новый Codex прочитал за 3–5 минут.
- `docs/expansion/TEST_EVIDENCE/` — компактные отчёты, без чувствительных данных/гигантских бинарных логов.
- `docs/expansion/RELEASE_GATES.md` — независимый статус DEMO / PILOT_TEST / STAGING / PILOT_LIVE / PRODUCTION.
- `docs/expansion/RESEARCH_CLAIMS.md` — source links, проверки чисел, evidence for pitch.

**STATE.json minimum schema:**

```json
{
  "schemaVersion": 1,
  "project": "Qoldau.Zhol",
  "executionBranch": "<actual-branch>",
  "baseSha": "<verified-sha>",
  "lastLocalCommit": "<actual-sha-or-null>",
  "lastPushedCommit": "<verified-remote-sha-or-null>",
  "currentStage": "EXP-00",
  "phaseStatus": "IN_PROGRESS",
  "featureIdsTouched": [],
  "tests": {"passed": 0, "failed": 0, "skipped": 0, "notRun": []},
  "blockers": [],
  "nextSafeStep": "<specific-action>",
  "liveBlocked": true
}
```

Это **образец схемы**, а не реальные результаты: не подставляй нули как результаты неисполненного запуска — используй `NOT_RUN` до фактического тестирования.

## J. ВЫПОЛНЕНИЕ ПО ФАЗАМ

Используй **Документ 3 — Integrated Phase Execution Plan**. Новые этапы называются `EXP-00…EXP-24`, чтобы не конфликтовать с историческими «фазами 0–78». Исторические предложения 68–78 остаются backlog, а не автоматически выполненные задачи. Начни с EXP-00/EXP-01, не с AI/voice/production.

**Порядок:** базовая сверка → пилотная регрессия → требования родителя/KK → улучшение объяснимости → affordability/accessibility → синтетическая семейная модель → проверяемые реальные интеграционные контракты → impact → staging/readiness (только при внешних разрешениях).

Если текущая стадия внешне заблокирована, переключись на следующий безопасный независимый synthetic slice, запиши `BLOCKED_EXTERNAL` и не ставь `DONE`.

## K. ПРОТОКОЛ КОММИТОВ И PUSH ПОСЛЕ КАЖДОГО ШАГА

Все изменения делай **в отдельной feature-ветке**, не работай непосредственно в default. Для нового изолированного этапа выполняй:

```bash
# После завершения и тестов этапа:
git status --short
git diff --check
git add <только-файлы-этого-шага>
git diff --cached --check
git commit -m "feat(exp-XX): <конкретный результат>"
git push -u origin <feature-branch>
# Затем обязательно прочитай remote SHA и проверь совпадение с локальным HEAD.
```

**Не используй `git add .` вслепую.** Commit message может быть `docs(exp-XX)` или `test(exp-XX)`, если этап касается только таких файлов. Если после записи доказательств требуются обновления, включи их в тот же commit до отправки, а не обещай «потом». Не делай push из небезопасного dirty checkout. Ветка должна быть resumable. Для общего командного репозитория избегай параллельной записи несколькими агентами в одну ветку; каждому агенту отдельная ветка и PR.

## L. ПЕРВОЕ СООБЩЕНИЕ АГЕНТА И ФИНАЛЬНОЕ ОЖИДАНИЕ

Сначала ответь кратко: verified root, branch, SHA, dirty status, baseline tests (или NOT_RUN), наличие/отсутствие исходного Research, текущий scope, потенциальные внешние gates. Затем **сразу начни безопасную реализацию EXP-00 и сохранение первого checkpoint**. Не застревай на планировании; делай рабочие changes в рамках разрешённого scope. Без достаточных прав на запись сообщи BLOCKED и подготовь применимый patch/handoff.

На завершении каждой стадии выдай таблицу:
`EXP | F-IDs | Change | Tests | Security | UX/RU/KK | Commit | Remote verified | Gate | Next`.

Не считай этап завершённым, пока нет требуемых доказательств, коммита и проверенного push. Не обещай, что самостоятельно выполнишь внешнее согласование, реальный CustDev или production launch.

## ПРИЛОЖЕНИЕ A. КАНОНИЧЕСКИЙ РЕЕСТР F000–F230

Список ниже извлечён **из Research v1.0 без переименования номеров**. Его нельзя сокращать или пропускать при построении FEATURE_MATRIX. «DEMO» и «PILOT_TEST» означают исходный статус Research; текущая реализация должна быть перепроверена по коду. «LATER» — будущий scope, а не готовая функция.
### F000. Миссия

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F000 | Миссия: прозрачный цифровой навигатор поддержки семьи | MISSION | EXP-00 |

### F001–F016. Главная и интерфейс

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F001 | Главная страница | DEMO | EXP-01 |
| F002 | Объяснение платформы | DEMO | EXP-01 |
| F003 | Быстрый переход к каталогу | DEMO | EXP-01 |
| F004 | Маршрут подбора специалиста | DEMO | EXP-01 |
| F005 | Использование без регистрации | DEMO | EXP-01 |
| F006 | Русский язык интерфейса | DEMO | EXP-01 |
| F007 | Казахский язык интерфейса | DEMO | EXP-01 |
| F008 | Переключение языков | DEMO | EXP-01 |
| F009 | Сохранение выбранного языка | DEMO | EXP-01 |
| F010 | Маркировка демоданных | DEMO | EXP-01 |
| F011 | Маскот Қарлығаш | DEMO | EXP-01 |
| F012 | Три позы маскота | DEMO | EXP-01 |
| F013 | Адаптивный дизайн | DEMO | EXP-01 |
| F014 | Мобильная навигация | DEMO | EXP-01 |
| F015 | Прямые ссылки на страницы | DEMO | EXP-01 |
| F016 | Обработка ошибок интерфейса | DEMO | EXP-01 |

### F017–F036. Анкета

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F017 | Анкета из четырёх шагов | DEMO | EXP-02 |
| F018 | Выбор потребности | DEMO | EXP-02 |
| F019 | Выбор категории специалиста | DEMO | EXP-02 |
| F020 | Вариант «Не знаю, кто нужен» | DEMO | EXP-02 |
| F021 | Выбор возрастной группы | DEMO | EXP-02 |
| F022 | Выбор языка занятий | DEMO | EXP-02 |
| F023 | Выбор формата | DEMO | EXP-02 |
| F024 | Выбор района | DEMO | EXP-02 |
| F025 | Выбор бюджета | DEMO | EXP-02 |
| F026 | Учёт заявленной доступности услуги | DEMO | EXP-02 |
| F027 | Обязательные условия | DEMO | EXP-02 |
| F028 | Необязательные предпочтения | DEMO | EXP-02 |
| F029 | Пропуск необязательных вопросов | DEMO | EXP-02 |
| F030 | Возврат к предыдущему шагу | DEMO | EXP-02 |
| F031 | Редактирование ответов | DEMO | EXP-02 |
| F032 | Сохранение состояния анкеты | DEMO | EXP-02 |
| F033 | Валидация данных | DEMO | EXP-02 |
| F034 | Предпросмотр ответов | DEMO | EXP-02 |
| F035 | Подсчёт подходящих вариантов | DEMO | EXP-02 |
| F036 | Переход к результатам | DEMO | EXP-02 |

### F037–F060. Поиск и matching

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F037 | Поиск специалистов | DEMO | EXP-03 |
| F038 | Поиск конкретных услуг | DEMO | EXP-03 |
| F039 | Фильтрация по категории | DEMO | EXP-03 |
| F040 | Фильтрация по возрасту | DEMO | EXP-03 |
| F041 | Фильтрация по языку | DEMO | EXP-03 |
| F042 | Фильтрация по формату | DEMO | EXP-03 |
| F043 | Фильтрация по району | DEMO | EXP-03 |
| F044 | Фильтрация по бюджету | DEMO | EXP-03 |
| F045 | Учёт неизвестной цены | DEMO | EXP-03 |
| F046 | Учёт бесплатных услуг | DEMO | EXP-03 |
| F047 | Учёт указанной доступности | DEMO | EXP-03 |
| F048 | Комбинация фильтров | DEMO | EXP-03 |
| F049 | Сброс фильтров | DEMO | EXP-03 |
| F050 | Hard constraints | DEMO | EXP-03 |
| F051 | Soft preferences | DEMO | EXP-03 |
| F052 | Расчёт matching score | DEMO | EXP-03 |
| F053 | Расчёт полноты данных | DEMO | EXP-03 |
| F054 | Объяснение соответствия | DEMO | EXP-03 |
| F055 | Разделение точных и неполных совпадений | DEMO | EXP-03 |
| F056 | Проверка актуальности информации | DEMO | EXP-03 |
| F057 | Стабильная сортировка | DEMO | EXP-03 |
| F058 | Обработка отсутствия результатов | DEMO | EXP-03 |
| F059 | Сохранение условий при переходах | DEMO | EXP-03 |
| F060 | Защита от смешивания условий разных услуг одного специалиста | DEMO | EXP-03 |

### F061–F075. Профиль и сравнение

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F061 | Карточка специалиста | DEMO | EXP-04 |
| F062 | Несколько услуг одного специалиста | DEMO | EXP-04 |
| F063 | Подробные условия услуги | DEMO | EXP-04 |
| F064 | Цена и продолжительность | DEMO | EXP-04 |
| F065 | Адрес и формат | DEMO | EXP-04 |
| F066 | Паспорт доверия | DEMO | EXP-04 |
| F067 | Статус проверки | DEMO | EXP-04 |
| F068 | Источник информации | DEMO | EXP-04 |
| F069 | Дата проверки | DEMO | EXP-04 |
| F070 | Неизвестные сведения | DEMO | EXP-04 |
| F071 | Сравнение специалистов | DEMO | EXP-04 |
| F072 | Добавление в сравнение | DEMO | EXP-04 |
| F073 | Удаление из сравнения | DEMO | EXP-04 |
| F074 | Сравнение условий | DEMO | EXP-04 |
| F075 | Side-by-side сравнение на компьютере | DEMO | EXP-04 |

### F076–F087. Демозаявки / PWA

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F076 | Создание демозаявки | DEMO | EXP-05 |
| F077 | Подтверждение деморежима | DEMO | EXP-05 |
| F078 | Локальное сохранение заявки | DEMO | EXP-05 |
| F079 | Защита от дублирования | DEMO | EXP-05 |
| F080 | Просмотр заявки | DEMO | EXP-05 |
| F081 | Отмена заявки | DEMO | EXP-05 |
| F082 | Очистка заявок | DEMO | EXP-05 |
| F083 | Восстановление после ошибок | DEMO | EXP-05 |
| F084 | Контроль срока хранения | DEMO | EXP-05 |
| F085 | PWA и сохранённые офлайн-карточки | DEMO | EXP-05 |
| F086 | Карта синтетических специалистов | DEMO | EXP-05 |
| F087 | Базовая доступность интерфейса и локализация дат | DEMO | EXP-05 |

### F088–F104. Тестовые аккаунты / специалисты

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F088 | Тестовый вход | PILOT_TEST | EXP-06 |
| F089 | Роли родителей | PILOT_TEST | EXP-06 |
| F090 | Роли специалистов | PILOT_TEST | EXP-06 |
| F091 | Роль модератора | PILOT_TEST | EXP-06 |
| F092 | Роль администратора | PILOT_TEST | EXP-06 |
| F093 | Проверка доступа | PILOT_TEST | EXP-06 |
| F094 | Разделение данных пользователей | PILOT_TEST | EXP-06 |
| F095 | Создание анкеты специалиста | PILOT_TEST | EXP-07 |
| F096 | Редактирование анкеты | PILOT_TEST | EXP-07 |
| F097 | Отправка на модерацию | PILOT_TEST | EXP-07 |
| F098 | Проверка полноты | PILOT_TEST | EXP-07 |
| F099 | Одобрение анкеты | PILOT_TEST | EXP-07 |
| F100 | Возврат на доработку | PILOT_TEST | EXP-07 |
| F101 | Отклонение | PILOT_TEST | EXP-07 |
| F102 | Публикация | PILOT_TEST | EXP-07 |
| F103 | Отзыв публикации | PILOT_TEST | EXP-07 |
| F104 | История модерации | PILOT_TEST | EXP-07 |

### F105–F114. Тестовые обращения

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F105 | Серверное создание обращения | PILOT_TEST | EXP-08 |
| F106 | Внутренний ящик специалиста | PILOT_TEST | EXP-08 |
| F107 | Отслеживание статуса обращения | PILOT_TEST | EXP-08 |
| F108 | Ответ специалиста | PILOT_TEST | EXP-08 |
| F109 | Подтверждение записи | PILOT_TEST | EXP-08 |
| F110 | Отмена обращения | PILOT_TEST | EXP-08 |
| F111 | История изменений | PILOT_TEST | EXP-08 |
| F112 | Защита от повторной отправки | PILOT_TEST | EXP-08 |
| F113 | Хранение обращения в SQLite | PILOT_TEST | EXP-08 |
| F114 | Проверка прав владельца | PILOT_TEST | EXP-08 |

### F115–F122. Календарь / уведомления

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F115 | Личный календарь | PILOT_TEST | EXP-09 |
| F116 | Создание событий | PILOT_TEST | EXP-09 |
| F117 | Редактирование событий | PILOT_TEST | EXP-09 |
| F118 | Подтверждённые события | PILOT_TEST | EXP-09 |
| F119 | Предупреждение о пересечении времени | PILOT_TEST | EXP-09 |
| F120 | Напоминания внутри приложения | PILOT_TEST | EXP-09 |
| F121 | Подписка на изменения условий услуги | PILOT_TEST | EXP-09 |
| F122 | Уведомления об изменениях внутри приложения | PILOT_TEST | EXP-09 |

### F123–F130. Приватные записи / сводки

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F123 | Следующий организационный шаг | PILOT_TEST | EXP-10 |
| F124 | Отметка выполнения шага | PILOT_TEST | EXP-10 |
| F125 | Личные цели | PILOT_TEST | EXP-10 |
| F126 | Приватный дневник | PILOT_TEST | EXP-10 |
| F127 | Задания от специалиста | PILOT_TEST | EXP-10 |
| F128 | Ответы родителя на задания | PILOT_TEST | EXP-10 |
| F129 | Формирование выборочной сводки | PILOT_TEST | EXP-10 |
| F130 | Копирование и скачивание сводки | PILOT_TEST | EXP-10 |

### F131–F150. AI и Қарлығаш — LATER

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F131 | Интерактивная AI-Қарлығаш | LATER | EXP-11 |
| F132 | Диалоговый помощник родителя | LATER | EXP-11 |
| F133 | Объяснение категорий специалистов | LATER | EXP-11 |
| F134 | AI-помощь при заполнении анкеты | LATER | EXP-11 |
| F135 | Объяснение результатов простым языком | LATER | EXP-11 |
| F136 | Trust Gap Assistant | LATER | EXP-11 |
| F137 | Smart Zero Results | LATER | EXP-11 |
| F138 | AI-подготовка вопросов специалисту | LATER | EXP-11 |
| F139 | AI-перевод сложных описаний | LATER | EXP-11 |
| F140 | AI-помощник по навигации | LATER | EXP-11 |
| F141 | Голосовой ввод RU/KK | LATER | EXP-12 |
| F142 | Голосовое управление | LATER | EXP-12 |
| F143 | Озвучивание интерфейса | LATER | EXP-12 |
| F144 | Персонализированные подсказки Қарлығаш | LATER | EXP-12 |
| F145 | AI-сводка организационной истории | LATER | EXP-12 |
| F146 | AI-помощь специалисту при заполнении профиля | LATER | EXP-12 |
| F147 | Поиск на естественном языке | LATER | EXP-12 |
| F148 | Семантический поиск | LATER | EXP-12 |
| F149 | Объяснение различий между вариантами | LATER | EXP-12 |
| F150 | AI-проверка полноты сведений без автоматической верификации | LATER | EXP-12 |

### F151–F170. Продвинутый поиск — LATER

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F151 | Accessibility Fit: подбор по доступности среды | LATER | EXP-13 |
| F152 | True Cost Calculator: полная стоимость поддержки | LATER | EXP-13 |
| F153 | Учёт расходов на дорогу | LATER | EXP-13 |
| F154 | Учёт регулярности занятий | LATER | EXP-13 |
| F155 | Подтверждённые свободные слоты | LATER | EXP-14 |
| F156 | Реальная транспортная доступность | LATER | EXP-14 |
| F157 | Расчёт маршрута | LATER | EXP-14 |
| F158 | Общественный транспорт | LATER | EXP-14 |
| F159 | Подбор нескольких услуг для семьи | LATER | EXP-14 |
| F160 | Поиск по нескольким районам | LATER | EXP-14 |
| F161 | Сохранённые поисковые запросы | LATER | EXP-14 |
| F162 | Подписка на новые подходящие предложения | LATER | EXP-14 |
| F163 | Уведомления о новых специалистах | LATER | EXP-14 |
| F164 | Альтернативы при отмене записи | LATER | EXP-14 |
| F165 | Контроль актуальности свободных мест | LATER | EXP-14 |
| F166 | Объяснение компромиссов | LATER | EXP-14 |
| F167 | Поиск бесплатных программ | LATER | EXP-15 |
| F168 | Поиск субсидируемых услуг | LATER | EXP-15 |
| F169 | Поиск по условиям участия в программах | LATER | EXP-15 |
| F170 | Social Support Navigator | LATER | EXP-15 |

### F171–F185. Семья — LATER

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F171 | Реальная регистрация | LATER | EXP-16 |
| F172 | Восстановление аккаунта | LATER | EXP-16 |
| F173 | Защищённый профиль семьи | LATER | EXP-16 |
| F174 | Приглашение второго родителя | LATER | EXP-16 |
| F175 | Совместный семейный календарь | LATER | EXP-16 |
| F176 | Раздельные права членов семьи | LATER | EXP-16 |
| F177 | Отзыв доступа | LATER | EXP-16 |
| F178 | История согласий | LATER | EXP-16 |
| F179 | Отзыв согласия | LATER | EXP-16 |
| F180 | Безопасный экспорт семейных данных | LATER | EXP-16 |
| F181 | Удаление аккаунта и данных по утверждённой процедуре | LATER | EXP-17 |
| F182 | Семейные организационные задачи | LATER | EXP-17 |
| F183 | Совместный список вопросов | LATER | EXP-17 |
| F184 | Общее избранное | LATER | EXP-17 |
| F185 | Передача информации другому опекуну с разрешения | LATER | EXP-17 |

### F186–F200. Связь/записи — LATER

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F186 | Реальные обращения специалистам | LATER | EXP-18 |
| F187 | Подтверждение доставки сообщения | LATER | EXP-18 |
| F188 | Защищённый чат | LATER | EXP-18 |
| F189 | Настоящие свободные слоты | LATER | EXP-18 |
| F190 | Онлайн-запись | LATER | EXP-18 |
| F191 | Перенос записи | LATER | EXP-18 |
| F192 | Отмена подтверждённой записи | LATER | EXP-18 |
| F193 | Push-уведомления | LATER | EXP-18 |
| F194 | Email-уведомления | LATER | EXP-18 |
| F195 | Telegram-уведомления | LATER | EXP-18 |
| F196 | Интеграция с Google Calendar | LATER | EXP-19 |
| F197 | Повторяющиеся события | LATER | EXP-19 |
| F198 | Синхронизация расписания специалиста | LATER | EXP-19 |
| F199 | Лист ожидания | LATER | EXP-19 |
| F200 | Предложение освободившегося времени | LATER | EXP-19 |

### F201–F210. Доверие — LATER

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F201 | Реальная проверка квалификации | LATER | EXP-20 |
| F202 | Проверка документов ответственным модератором | LATER | EXP-20 |
| F203 | Подтверждение принадлежности профиля специалисту | LATER | EXP-20 |
| F204 | Проверка организации | LATER | EXP-20 |
| F205 | Повторная проверка устаревших сведений | LATER | EXP-20 |
| F206 | Жалобы и обращения на проверку | LATER | EXP-20 |
| F207 | Обжалование модерации | LATER | EXP-20 |
| F208 | Подтверждённые отзывы | LATER | EXP-20 |
| F209 | Ответ специалиста на отзыв | LATER | EXP-20 |
| F210 | Проверяемая история изменений условий | LATER | EXP-20 |

### F211–F230. Impact/платформа — LATER

| ID | Название функции (как в Research) | Источник статуса | EXP-этап |
|---|---|---|---|
| F211 | Social Impact Dashboard | LATER | EXP-21 |
| F212 | Аналитика времени поиска | LATER | EXP-21 |
| F213 | Аналитика успешных контактов | LATER | EXP-21 |
| F214 | Аналитика доступности услуг | LATER | EXP-21 |
| F215 | Обезличенная аналитика потребностей | LATER | EXP-21 |
| F216 | Аналитика незакрытого спроса | LATER | EXP-21 |
| F217 | Карта районов с недостатком предложений | LATER | EXP-21 |
| F218 | Кабинет фонда | LATER | EXP-22 |
| F219 | Управление программами помощи | LATER | EXP-22 |
| F220 | Professional Referral Network с согласием семьи | LATER | EXP-22 |
| F221 | Telegram Mini App | LATER | EXP-22 |
| F222 | Интеграции с партнёрскими организациями | LATER | EXP-22 |
| F223 | Публичный API с контролем доступа | LATER | EXP-22 |
| F224 | Выход в другие города Казахстана | LATER | EXP-22 |
| F225 | Мониторинг и реагирование на инциденты | LATER | EXP-23 |
| F226 | Резервное копирование и восстановление | LATER | EXP-23 |
| F227 | Production identity и безопасность | LATER | EXP-23 |
| F228 | Реальный аудит accessibility | LATER | EXP-23 |
| F229 | Ограниченный пилот после согласований | LATER | EXP-24 |
| F230 | Production-запуск | LATER | EXP-24 |


## ПРИЛОЖЕНИЕ B. АВТОМАТИЧЕСКАЯ ПРОВЕРКА ЗАВЕРШЁННОСТИ

В текущей версии Research ровно **231 запись F000–F230**, включая миссию F000, **87 DEMO, 43 PILOT_TEST и 100 LATER**. Для каждого ID должен существовать индивидуальный progress/evidence/status. Для всех F131–F230, зависящих от внешних разрешений, допустим честный `SYNTHETIC_COMPLETE / BLOCKED_EXTERNAL`; запрещено превращать это в `PRODUCTION_READY`.

**Последний приказ агенту:** начни с EXP-00, проведи именно проверку, сохрани и push отдельной веткой фактическую матрицу, затем двигайся по Документу 3. Ни один успешно выполненный slice не оставляй только в чате.
