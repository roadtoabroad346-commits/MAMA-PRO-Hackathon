# ДОКУМЕНТ 2. CODEX / OPENCODE ENGINEERING PLAYBOOK
## Как выполнять сложное расширение MamaPro без потери контекста, качества и безопасности

**Версия:** 1.0 · 13.11.2026. **Читать вместе:** Документ 1 (Master Implementation Prompt), Документ 3 (Integrated Phase Execution Plan), Research v1.0.

## 1. ЦЕЛЬ И РАБОЧАЯ ФИЛОСОФИЯ

Этот playbook превращает работу Codex/OpenCode из хаотичных запросов «сделай все функции» в контролируемую инженерную поставку. Прогресс измеряется не строками кода и не фразой «DONE», а воспроизводимыми product requirements, test evidence, безопасной миграцией, commit SHA, доступным remote checkpoint и подтверждённым пользовательским эффектом.

**Ключевой принцип:** один логический шаг = один проверяемый результат = один атомарный коммит = один push = один восстановимый handoff. Для крупной фазы допустимы 3–10 таких шагов. Ранний push не означает merge или live deployment.

**Почему осторожность необходима:** приложение работает с темой поиска поддержки для детей и потенциально чувствительными семейными данными. Значительная часть целей может быть достигнута на синтетических данных; попытка «включить настоящее» без назначенного оператора, identity, законных оснований и защиты создаст риски, а не ценность.

## 2. ТОЧКА ВХОДА И ПОДГОТОВКА ОКРУЖЕНИЯ

### 2.1. Сначала докажи, где находишься

```bash
pwd
git status --short --branch
git remote -v
git branch -a -vv
git rev-parse HEAD
git stash list
git log -10 --format="%h %s"
node --version
npm --version
```

На Windows PowerShell синтаксис переменных окружения отличается от Linux/macOS; не вставляй Unix-префикс `PILOT_MODE=...` как готовую PowerShell-команду. Используй `$env:PILOT_MODE='PILOT_TEST'; npm run pilot`. Для cross-platform CI следуй реальному `package.json` и Playwright config. Прежде чем использовать `npm ci`, убедись, что находится правильный `package-lock.json` и установка не затронет чужую рабочую папку.

### 2.2. Актуальная отправная точка

В Research v1.0 зафиксирован удалённый SHA `7f8434a4cfd097b531fa584f5b97ebd1e772ad92` ветки `phase-0-audit` на 13.11.2026. В репозитории это уже объединённое состояние после audit/fixes и трёх дизайн-итераций. Ранее встречавшийся текст README о том, что default-ветка «устаревшая», исторический; проверяй GitHub API/коммитов перед решением. Обе старые PR №1/№2 могут оставаться открытыми; проверяй наличие эквивалентных изменений по Git ancestry/diff, а не делай двойной merge.

### 2.3. Безопасная ветка

**Предпочтительный сценарий:** `git fetch`; inspect commits; создавать `feature/mamapro-expansion-YYYYMMDD` от актуального default или другого одобренного чистого SHA. Если на текущей ветке чужие изменения — использовать `git worktree add ... <base-ref>`, не делать reset/clean/stash. Никогда не работать над новыми пакетами непосредственно на `phase-0-audit`.

Проверка безопасности: `.env*`, `node_modules`, `dist`, `.pilot-test/`, реальные базы и приватные файлы не должны попадать в Git. `git diff --cached --name-only` обязательна перед commit.

## 3. ТРИ ПАРАЛЛЕЛЬНЫЕ СИСТЕМЫ ИСТИНЫ

**Implementation truth:** конкретный код, migrations, tests, log и SHA.  
**Research truth:** потребности, гипотезы, конкурентная дифференциация, источники рынка, результаты действительного CustDev.  
**Operations truth:** кто отвечает за реальный доступ, согласия, модерацию, поддержку, инфраструктуру, инциденты, проверки.

Не смешивай их. Например, форма «согласие получено» в synthetic UI не означает юридически действительное согласие на обработку данных семьи. Зелёный Playwright не доказывает, что родителю понятна формулировка. Реестр моделей и фактов не подтверждает квалификацию реального специалиста.

## 4. ОСНОВНАЯ КАРТА АРХИТЕКТУРЫ

### 4.1. Существующие подсистемы

- `src/features/intake`: анкета, review.
- `src/features/search`: каталог, фильтры, offer cards, compare, карта.
- `src/features/profile`: профиль, trust passport, переход к заявке.
- `src/domain`: SearchService, matching, freshness, данные каталога, demo-request logic.
- `src/data`: synthetic catalog, IndexedDB repository.
- `src/features/pilot`: server-driven synthetic accounts, onboarding, contacts, calendar, inbox, private records, next actions, saved demo.
- `server`: Zod contracts, HTTP security, service authorization, SQLite store, migration.
- `tests` и `tests/e2e`: базовые, browser, offline, pilot.

Реальные пути и экспортируемые функции подтвердить чтением текущей ветки: это архитектурный ориентир, а не повод создавать отсутствующие файлы с тем же именем.

### 4.2. Предлагаемая граница модулей расширения

```
src/features/assistant/         # deterministic explanations; optional AI adapter
src/features/accessibility-fit/ # sourced venue facts; no diagnosis
src/features/cost-planner/      # price/unit/visits/travel estimates
src/features/support/           # verified source-backed programs
src/features/family/            # invitation UI, synthetic scope only
src/features/impact/            # privacy-safe aggregated dashboards
src/domain/                     # pure policies, matching, validation, state machines
server/                         # authority, transactions, output allowlists
server/integrations/            # fake/real provider adapters (real disabled)
server/migrations/              # additive schema versions
```

Не создавать модули ради структуры, если вертикальный slice лучше вписывается в текущие файлы. Не переносить бизнес-правила из `src/domain` в React component; не доверять actor/role/owner из client payload.

## 5. ПОНИМАНИЕ ФУНКЦИЙ 0–230 И КАРТА ПРИОРИТЕТОВ

F000 — миссия. F001–F087 — baseline DEMO. F088–F130 — существующий synthetic pilot, требующий regression hardening/доказательств. F131–F230 — новые LATER, не реализованные как полная production-возможность. Полная матрица с оригинальными названиями — **Приложение A Документа 1** и **Приложение A Документа 3**.

Для каждого ID веди пять разных осей:
1. `product_intent`: зачем это родителю/специалисту/фонду.
2. `implementation_depth`: mock | synthetic integrated | human-tested | approved live | production.
3. `security_level`: public | family-private | sensitive | external-effect.
4. `evidence_level`: code only | automated tested | manual reviewed | real-user validated.
5. `release_permission`: demo | internal pilot | requires operator approval.

Не своди многомерный статус к одному неясному «ГОТОВО». Два связанных ID могут закрываться одним модулем, но у каждого свой AC и evidence.

## 6. ШАБЛОН ЗАДАЧИ ДЛЯ CODEX — ОДИН VERTICAL SLICE

Скопируй и заполняй перед каждым шагом:

```
Ты работаешь над Қолдау.Жол в отдельной feature-ветке.
STAGE: EXP-XX / SLICE: XX.YY
FEATURE IDS: F___, F___
PRODUCT PROBLEM: <конкретный наблюдаемый барьер>
EXISTING BEHAVIOR: <пути + текущий SHA + ограничения>
NEW BEHAVIOR: <user journey, states, conditions>
NON-GOALS: <что не делаешь>
DATA: synthetic-only; no real child/family/specialist PII
AC: AC-1..AC-N с позитивными, негативными и граничными случаями
SECURITY: owner/role, consent, deny, logging/redaction
I18N/A11Y: RU/KK, keyboard, focus, 320px, 200% zoom
TEST: unit + server integration + applicable Playwright + build
EVIDENCE: affected files, executed commands, real PASS/FAIL/NOT_RUN
GIT: atomic commit; push only to feature branch; verify remote SHA
DELIVERABLE: code + test + docs/expansion/<stage> + handoff
DO NOT: merge, deploy, change LIVE_BLOCKED, claim real delivery
```

**Не отправляй одновременно десятки больших unrelated задач одному агенту**, иначе сложнее выявить regressions и опасные скрытые зависимости. Сначала полностью определи contracts и review thresholds; затем назначай очередной slice.

## 7. СТАНДАРТ ДАННЫХ И PROVENANCE

### 7.1. Offer и факт

Один специалист может иметь несколько услуг с разными ценами, возрастами, языками, адресами и режимами. Соответствие вычисляется для конкретного offer. Для каждого public факта: `value | status KNOWN/UNKNOWN | source | verifiedAt | reviewDueAt | verifiedScope | limitations | isSynthetic`. Если real verification отсутствует, не создавай badge «проверено».

### 7.2. Новые данные: costs/accessibility/support

- `CostEstimate`: `offerId`, цена, единица, frequency, duration, travelCost input, range, currency KZT, assumptions, uncertainty; без фиктивной средней цены.
- `VenueAccessibility`: отдельные проверяемые атрибуты (вход, лифт, туалет, транспортная доступность) с источниками/датами, без оценки состояния ребёнка.
- `SupportProgram`: организация, география, eligibility, тип помощи, требуемые подтверждения, checkedAt, expiresAt, applicationContact, source URL, synthetic/live marker. Не выдумывать право участия.
- `SearchExplanation`: facts used, applied hard constraints, missing fields, suggested questions, exact action; причина нулевой выдачи без «подходит вашему ребёнку».

Zod parse на границах, даты с offset и time zones, nullable/unknown различать. Не вводи отдельный enum-клон статусов, если уже существует canonical schema.

## 8. EXPLAINABLE MATCHING, SMART ZERO RESULTS И TRUST GAP

### 8.1. Не меняй исходный смысл score

Внутренний score соответствия условиям — не рейтинг клинической компетентности. `unknown` остаётся unknown. Если hard condition не проходит, offer не может стать exact после «умного» AI-реранжирования. При изменении rulesVersion должна быть migration/reproducible snapshot semantics и тест на обратную совместимость.

### 8.2. Trust Gap Assistant

Для неизвестных/устаревших данных генерируй **вопросы**, не ответы. Пример: неизвестная стоимость → «Какова цена за одно занятие и его продолжительность?»; неизвестная доступность помещения → «Есть ли безбарьерный вход?»; неподтверждённый язык → «Проводятся ли занятия на казахском языке?». Каждому вопросу сопоставь `factId`, evidence state и источник пробела, чтобы не задавать вопрос о уже проверенном факте.

### 8.3. Smart Zero Results

Система показывает какие ограничения исключают варианты, предлагает **контролируемые** пользовательские действия (изменить район/предпочтение, включить online, увидеть неполные предложения). Не изменяй автоматически жесткие требования. Тестируй: 0 результатов, все unknown, budget 0, stale price, mixed offers, KK, offline.

## 9. AI / LLM / VOICE: ТОЛЬКО КОНТРОЛИРУЕМОЕ УСИЛЕНИЕ

**Сначала deterministic baseline.** Интерактивная Қарлығаш может прекрасно помогать без LLM: guided steps, curated FAQs, well-defined next actions, trust-gap questions. Это повышает контролируемость и уменьшает стоимость.

Если LLM включается в разрешённый synthetic эксперимент:
- Backend-only adapter, ключ не попадает в браузер, configurable cost cap, no hidden outbound transfer.
- Вход — только минимально необходимые user preferences и разрешённые публичные факты; исключить ребёнка, диагноз, дневник и частные документы.
- Retrieval только по источникам с provenance; вся генерация маркируется как пояснение, а не «проверено».
- Schema-constrained output, allowlisted actions, цитаты/ссылки на факты; fallback к deterministic version.
- Тесты на prompt injection в user text, документы и provider response; on failure no hallucinated contact/schedule/medical suggestion.
- Human review экспертных формулировок, отдельная проверка RU/KK; voice не единственный способ доступа.

Нет основания генерировать упражнения, давать медицинские советы или оценивать развитие ребёнка без клинического процесса. Такие фичи не включать автоматически даже в LATER.

## 10. FAMILY, CONSENT, AUTHORIZATION

Family graph не равен тому, что два человека знают одинаковый email. К каждой операции нужно server-side `actor → role → relation → scope → resource → purpose → temporal validity`; invitation token одноразовый, ограничен сроком и областью; отзыв немедленно закрывает последующие запросы. Family-admin не получает автоматический доступ ко всем дневникам и private records, пока не подтверждены конкретные полномочия и правовые основания.

Synthetic test matrix: Parent A, Parent B, Invited adult, Expired invite, Revoked invite, Specialist A/B, Moderator, Admin, Unknown actor. Проверяй cross-family leakage, revoked access, scope downgrade, export/summary, stale session, replay, CSRF, origin and rate limits.

Реальная identity proofing, parental authority, consent legal text, retention and jurisdiction — владельцы/юристы/оператор. Codex создаёт интерфейс и тесты, но не «утверждает» правовое основание.

## 11. OUTBOX, CALENDAR И ВНЕШНИЕ ИНТЕГРАЦИИ

Существующий `sandbox inbox` корректно тестирует серверную запись, но не является Telegram/SMS/email delivery. Для внешнего контура до live необходимы:
- `OutboundMessage` with idempotency key, consent purpose, recipient policy, queuedAt, attempt count.
- Provider-agnostic `send/lookup/cancel` interface и `FakeProvider` для tests.
- Указанный provider не означает ACK от человека; сохраняй разделение state `queued`, `providerAccepted`, `delivered`, `read`.
- Webhook signature/timestamp/nonce verification; дедупликация out-of-order events.
- Retry/backoff, dead-letter, rate limits, recipient opt-out, admin incident response.
- Booking conflict prevention и подтверждение реального слота **со стороны специалиста**; предложение слота не равно бронированию.
- Recurrence calendar и OAuth — отдельные проверяемые work packages, не скрытая часть одной кнопки.

Платёжный контур, если когда-нибудь понадобится, требует отдельного дизайна и провайдера; в текущем 0–230 он не является обязательной функцией. Никаких реальных выплат/платежей во время синтетической разработки.

## 12. SECURITY/PERFORMANCE/ACCESSIBILITY: GATES

### Security Quality Gate

Тесты на IDOR/role spoofing, CSRF/origin, replay/idempotency, data minimization, no private SW cache, HTML/XSS as data, injection boundaries, rate limits, secret scan, dependency risk, delete/revoke lifecycle. Критические находки P0/P1 блокируют дальнейший функциональный merge. Зависимости вводи только при реальной необходимости; фиксируй версии в lockfile.

### Performance Gate

Измеряй p50/p95 на 20/100/1000 синтетических offer и на списке private resources. Сравнивай до/после в одной среде. Изучай Next.js или иной framework migration только если есть measurable need — существующий React/Vite не надо переписывать ради моды. Полевые Web Vitals не изобретать из lab benchmark.

### A11y/UI Gate

Проверка без мыши, visible focus, form labels, skip link, semantic statuses, 320–430 reflow, 200% text/zoom, reduced motion, error recovery, RU/KK length, numbers/prices/dates in KZT. Для реального release нужны ручные проверки NVDA/VoiceOver/TalkBack и носитель казахского; пока они NOT_RUN — так и фиксируй.

## 13. ДИЗАЙН ПО ДАННЫМ РОДИТЕЛЯ, А НЕ ПО ВООБРАЖЕНИЮ

Исследование включает **пустой раздел «Созвон с родителем и анализ её проблемы на практике»**. Codex не заполняет его придуманными историями/цитатами. После настоящего согласованного интервью можно внести обезличенное наблюдение и связать его с конкретным product decision `research_id → pain_point → hypothesis → feature_ids → experiment → result → decision`.

Пять базовых заданий: начать без категории; найти казахский язык/формат; сравнить два варианта; объяснить паспорт доверия; создать демозаявку и сказать, что произошло. Измеряй success/assistance/errors/time, не собирай подробности о здоровье ребёнка. Никаких fabricated survey metrics в питче или dashboard.

## 14. СИСТЕМА ДОКАЗАТЕЛЬСТВ И АНАЛИТИКИ

Логи и dashboard должны различать **synthetic_demo_event** и **consented_live_event**. До отдельного разрешения — только synthetic. Реальные события: минимизация, purpose, retention, opt-in/opt-out, aggregation thresholds и запрет текстовых payload. Процессные KPI: `time_to_clarify`, `search_success`, `unmatched_queries`, `questions_prepared`, `request_receipt`, `provider_confirmation`, `support_program_discovery`. Не выводи проценты улучшения без baseline и исследования.

Фраза «237 тыс. детей с ООП» из Research — официальный контекст, **не количество покупателей**. Число детей с инвалидностью из другого источника пересекается с ним и не складывается. TAM/SAM/SOM нельзя получить простым умножением на произвольную долю.

## 15. КОНКРЕТНЫЙ QUALITY CHECKLIST ПЕРЕД КАЖДЫМ PUSH

- [ ] Рабочая ветка изолирована, `git status` понятен.
- [ ] Использованы правильные feature IDs, нет дубликата существующего.
- [ ] Все acceptance criteria и negative tests записаны.
- [ ] Секреты/данные реальных семей отсутствуют.
- [ ] TypeScript strict, schema validation, async/error states корректны.
- [ ] Нельзя получить чужой ресурс через ID/роль/приглашение.
- [ ] RU/KK + mobile + keyboard проверены (или honest NOT_RUN).
- [ ] Функция не выдаёт provider ACK / запись без реального факта.
- [ ] `LIVE_BLOCKED` не ослаблен.
- [ ] Применимые тесты запущены; FAIL/SKIP видимы.
- [ ] Commit атомарный, docs/expansion/STATE.json актуален.
- [ ] `git diff --cached --check` прошёл, staged только разрешённое.
- [ ] `git push` прошёл, `remote SHA == local SHA` проверено.
- [ ] Прогресс/блокеры/следующий шаг записаны.

## 16. КАК СОХРАНЯТЬ КОНТЕКСТ МЕЖДУ СЕССИЯМИ

Агент начинает каждую новую сессию с чтения:
1. `docs/expansion/HANDOFF.md`.
2. `docs/expansion/STATE.json`.
3. `docs/expansion/PROGRESS.md`.
4. `docs/expansion/FEATURE_MATRIX.csv`.
5. `docs/expansion/RELEASE_GATES.md`.
6. `git status`, branch, last local/remote commit.
7. Последний stage evidence и открытые PR comments.

**Формат HANDOFF:** `What works / What changed / SHA & branch / How to reproduce / Remaining defects / External blockers / Last commands and factual results / Next one safe slice`. Пример: `EXP-04 Trust Gap; F136 F138; AC-1..6 pass; no live; SHA abc...; next EXP-05` — SHA должен быть реальным, не заглушкой в готовом файле.

Если работа ведётся несколькими AI-агентами: один отвечает за UX, другой за API, третий за QA, но у каждого **своя ветка**, owner reviews cross-cutting contracts, интеграция только через CI-tested PR; не разрешать одновременный push в одну общую ветку.

## 17. ПРОЦЕСС РАБОТЫ ПРИ ОШИБКАХ И БЛОКЕРАХ

**Окружение:** port occupied, не тот Chromium, неверный Node, отсутствует npm package — диагностика, исправить среду, повторить, не менять тест ради «зелёного».  
**Баг продукта:** создать red regression test, показать root cause, минимально исправить, подтвердить обратную совместимость.  
**Внешняя зависимость:** нет реальных специалистов/проверенного фонда/согласий/IdP — `BLOCKED_EXTERNAL`, fake provider и docs-only checkpoint.  
**Неизвестное требование:** original historical phases 1–5, 9, 11, 15–27, 36–54 без первичных AC — не реконструировать из фантазии; сохранить attestation и описать gap.

## 18. ПРОМПТ ДЛЯ АВТОНОМНОГО ВОССТАНОВЛЕНИЯ ПОСЛЕ ПЕРЕРЫВА

```
Продолжи MamaPro expansion без потери контекста. Прочитай актуальный
AGENTS.md, docs/expansion/{HANDOFF.md,STATE.json,PROGRESS.md,
FEATURE_MATRIX.csv,RELEASE_GATES.md}, проверь git status/branch/
remote SHA и open PR. Не повторяй готовые ID. Определи последний
подтверждённый stage, один следующий безопасный slice и его AC.
Выполни реализацию, проверки, атомарный commit и push на feature-ветку;
проверь remote SHA, обнови состояние в том же commit. Не делай merge,
не запускай real-user pilot, не меняй LIVE_BLOCKED. Если permission/
consent отсутствует, зафиксируй blocker и продолжи synthetic-safe work.
```

## 19. PROMPT REVIEWER: НЕЗАВИСИМАЯ ПРИЁМКА СДЕЛАННОГО

```
Будь независимым reviewer отдельной feature-ветки MamaPro. Сравни с
base SHA, проверь реализованные F-IDs, докажи каждый AC исходником,
повторным тестом и neg-case; сравни security/consent/status semantics,
RU/KK, keyboard/mobile, migration/backward compatibility. Не принимай
только сгенерированные отчёты как доказательство без фактических команд.
Верни P0/P1/P2/P3 findings с файлами и воспроизведением, статус GO
только для synthetic test / demo, и список внешних gate. Не push/merge
за автора и не скрывай failed test.
```

## 20. СЛОВАРЬ СТАТУСОВ, КОТОРЫЕ НЕЛЬЗЯ ПУТАТЬ

- `DESIGNED`: определён контракт, кода может не быть.
- `SYNTHETIC_IMPLEMENTED`: выполняется на fake data/backend.
- `AUTOMATED_VERIFIED`: по указанному SHA получены реальные tests.
- `HUMAN_VALIDATED`: есть реальный протокол юзабилити, разрешение и обезличенные наблюдения.
- `LIVE_APPROVED`: внешние организационно-правовые условия подтверждены; не достижимо автоматическим кодом.
- `PRODUCTION_READY`: независимый операционный security/release gate выполнен; **не исходный статус проекта**.
- `BLOCKED_EXTERNAL`: нужен человек, разрешение, организация, договор/данные/провайдер.
- `UNKNOWN`: нет доказательства; не равно NOT_IMPLEMENTED.

## 21. ОСНОВНЫЕ ИСТОЧНИКИ ДЛЯ АГЕНТА

1. Исследование: `MamaPro_QoldauZhol_Research_13-11-2026.docx`, главы 00–18.
2. Исходное ТЗ: `docs/sources/QOLDAU_ZHOL_FULL_TECHNICAL_SPEC_v1.0.txt`.
3. Codex brief: `docs/sources/MASTER_PROMPT_MAMAPRO_CODEX.txt`.
4. Состояние: `docs/PROJECT_STATE.md`, `docs/HANDOVER_55_67.md`.
5. Ограничения: `docs/LIVE_READINESS.md`, `docs/PHASE_DELIVERY_BACKLOG.md`.
6. Проверка: `docs/QA_RESULTS.md`, `docs/AUDIT_FIX_DELIVERY.md`, `audit-output/MASTER_AUDIT_REPORT.md`.
7. Дизайн: `docs/MASCOT_KARLYGASH.md`, `docs/DESIGN_DELIVERY_2026-11-13.md`.

> **Правило завершения:** идеальной считается не та реализация, о которой агент заявил PASS, а та, для которой следующий инженер может по SHA, запуску, тестам и документации самостоятельно воспроизвести результат и отличить готовое DEMO от запрещённого live.
