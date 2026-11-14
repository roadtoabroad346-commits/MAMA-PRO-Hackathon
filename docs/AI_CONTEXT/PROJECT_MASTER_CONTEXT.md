> Current: EXP-04 F061–F075 VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`;448 final executions PASS. LIVE_BLOCKED; HUMAN_QA_PENDING. [Closure](../expansion/stages/EXP-04.md). EXP05 not started. Older checkpoints below are historical.

> Current authorization: EXP-04 F061–F075, user request14 November2026. Branch `codex/exp-04-profile-trust-comparison`, base `7340dffa1b15e8452bf693f090f6c4085d46b158`. Audit [stage](../expansion/stages/EXP-04.md). LIVE_BLOCKED; HUMAN_QA_PENDING. Historical EXP-03 stop instructions below are superseded only for EXP-04. Next: B domain/trust regression.

# MamaPro — консолидированный контекст

Current checkpoint: **EXP-03 F037–F060 VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO)** on sourceac82ec7. [Closure](../expansion/stages/EXP-03.md), [handoff](SESSION_HANDOFF.md). LIVE_BLOCKED and human/native KK/real AT/device limits preserved. EXP-04 not started; permission required. Earlier narrative below is historical context.

**LIVE_BLOCKED сохраняется; DEMO/PILOT_TEST only.**

Память сверена с полным Research Markdown, исходным CSV F000–F230, README и всеми тремя инженерными документами. Оригинальный DOCX в checkout/remote отсутствует: его чтение и сверка с извлечением не заявляются. Текущее прямое поручение разрешило EXP-02; F017–F036 проверены, runtime-пробелов не обнаружено. Добавлены тесты и доказательная документация; приложение сохранено без изменений.

## Продукт и пользователь

Қолдау.Жол — мобильный RU/KK навигатор поддержки семьи. Родитель формулирует потребность и организационные условия, ищет конкретную услугу, сравнивает варианты, понимает источники доверия и неизвестные факты, затем выполняет честно обозначенное действие. Подбор отражает параметры услуги; диагноз, лечение, качество специалиста и клинический результат из score не следуют.

Первичный сегмент — родитель, впервые ищущий помощь и не знающий категории специалиста. Дополнительные проектные сегменты: опытный родитель, семья с ограничениями стоимости/дороги/времени, родитель с предпочтением казахского языка. Это сегментация ТЗ, а не вывод проведённых интервью. CORE ограничен вымышленным каталогом Алматы: LOGOPED, DEFECTOLOG, PSYCHOLOG; ru/kk, online/offline, четыре района, возрастные группы, цена/формат/заявленный приём обращений.

Пользовательские пути:

1. Главная → четырёхшаговая анкета → review → результаты. Draft применяется только явным подтверждением.
2. Главная → прямой каталог → фильтры/объяснения → профиль конкретного offer → паспорт доверия → сравнение 2–3 вариантов.
3. Выбранная услуга → подтверждение demo → сохранение в IndexedDB → UUID/статус → reload/отмена/очистка. Реального сообщения и визита нет.
4. Отдельный `/pilot`: synthetic specialist → application → assigned moderation → public projection → parent contact → sandbox inbox → synthetic confirmation/calendar → in-app reminders/private records/selected summary.
5. Явно сохранённая synthetic карточка → `/saved` → offline shell. Private pilot offline не поддерживается.

Қарлығаш — ласточка, сейчас три статичные декоративные SVG-композиции welcome/guide/search. Интерактивный assistant, voice и semantic search — будущий scope. Три позы уже сделаны; повторная реализация не нужна.

## Проверенная исходная точка

Репозиторий: https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon . Default на момент проверки — `phase-0-audit`, SHA `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. Несмотря на имя, ветка содержит текущий CORE, pilot55–67, audit fixes и дизайн 12–13 ноября. Создана `feature/context-init-2026-11-13` от этого SHA. Исторический снимок: [GIT_SNAPSHOT](GIT_SNAPSHOT.json). В этой сессии remote рабочей ветки подтверждён как `0e7e1896776dc50e2c7be114e0ed249b8e800395`; это родитель нового checkpoint. Найден EXP-01 на отдельной ветке `feature/mamapro-exp01-20261113` @ `a93cc18d7b357a637c7114e9408ec11242156eba` (тот же runtime, тесты/документация). Он прочитан, не объединён и не продублирован. Текущий source/Git receipt: [EXP-02 sources](../expansion/evidence/EXP-02-sources.json); новый HEAD/remote проверяются командами из [handoff](SESSION_HANDOFF.md).

Начальный checkout в этой среде был unborn `work`, без source/коммитов/dirty/stash. Выполнен fetch всех heads, сохранена история, затем новая ветка. Доступ к чужим машинам и их неопубликованной работе отсутствует; выводов об их состоянии нет.

Открыты PR [№1](https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon/pull/1) и [draft №2](https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon/pull/2). Их heads уже предки baseline. Новые merge не нужны для восстановления имеющегося кода; решение по закрытию/merge оставлено владельцу. PR №3–7 отражены объединениями в Git history. Поиск issues дал ложный пустой результат; вывод о PR основан на прямом REST collection.

## История и состояние

- 6 ноября: аудит/ТЗ; 7–8 ноября: intake/search/profile/local requests/QA/release/защита.
- 10 ноября: фазы28–35 — чистый same-offer evaluator, freshness-v2, request-wide score/coverage, draft/review.
- 11 ноября: synthetic pilot55–67; реестр/attestation; аудит и fixes.
- 12 ноября: три SVG, сортировка, icons/gradients, district tiles и budget chips.
- 13 ноября: desktop subgrid compare и Intl даты. Эти улучшения присутствуют в baseline.
- Исторические 0–68: 29 записей с repository evidence; 39 фаз с team-reported review и без per-phase delivery evidence; 68 не начата. Источник — [старый реестр](../PHASE_REGISTRY.json). Нельзя придумывать требования пропущенных номеров или переводить attestation в независимую проверку.

Текущая система — React19/TypeScript strict/Vite7/router7/Zod4; domain search; synthetic JSON catalog; session/localStorage/IndexedDB; отдельный Node24 `node:sqlite` pilot backend. Нет Next.js, managed DB, production IdP, внешнего delivery provider или production hosting. Архитектура: [ARCHITECTURE_MEMORY](ARCHITECTURE_MEMORY.md).

## Полный функциональный охват

[FEATURE_STATUS](FEATURE_STATUS.md) и [FEATURE_REGISTRY.json](FEATURE_REGISTRY.json) содержат ровно 231 запись F000–F230. Имена, source statuses и EXP assignment сверены между Research Markdown, исходным CSV, STAGE_MAP, master, integrated plan и существующими реестрами: 231 ID, без пропусков/дубликатов. `research_line`/`registry_line` дают исходную строку для каждого ID. Полное покрытие реестром не означает проверку всего будущего runtime.

| Текущий статус | Число | Значение |
|---|---|---|
| IMPLEMENTED_WITH_LIMITATIONS | 88 | F000 и 87 DEMO; synthetic и незавершённая human acceptance |
| PILOT_TEST_ONLY | 43 | F088–F130; интегрированный test backend, без live |
| PARTIALLY_IMPLEMENTED | 6 | F135/F137/F149/F150: explanations/empty state/compare/schema; F206/F210: synthetic complaints/change audit. Полный целевой scope отсутствует |
| PLANNED | 51 | Будущее поведение пока не реализовано |
| BLOCKED_EXTERNAL | 43 | Завершение целевого scope требует людей/данных/provider/legal/ops |

Источник Research отдельно: MISSION=1, DEMO=87, PILOT_TEST=43, LATER=100. Статус BLOCKED_EXTERNAL не означает наличия synthetic prototype. Все новые EXP acceptance сохранены как требования, не массовые PASS. Полному новому acceptance без human evidence не присвоен VERIFIED_IMPLEMENTED.

Известные ограничения реализации: CORE хранит район, но не полный venue/address; история moderation ограничена audit metadata и текущими полями, полного moderator case-history UI нет; календарь предупреждает overlap в UI и не реализует slot locking; данные pilot offers не подключены к CORE SearchService live adapter. SQLite синхронный, один процесс, без шифрования/RLS/production restore. In-app jobs работают при запущенном сервере; фоновой внешней доставки нет. Native KK review F-03 остаётся pending.

[PHASE_PROGRESS](PHASE_PROGRESS.md) содержит EXP-00–24 со всеми зависимостями и четырьмя исходными AC каждой фазы. EXP-01–05 переоценивают existing DEMO; 06–10 existing pilot; 11–15 assistant/discovery/cost/accessibility/support; 16–20 family/identity/comms/calendar/trust; 21–24 impact/partner/ops/authorized launch. Это новый roadmap, а не замена исторической нумерации.

## Исследование и рынок

Исторический intake утверждает, что `00_REFERENCE_RESEARCH.docx` получен из ZIP и сохранён в Библиотеке ChatGPT; эта библиотека не смонтирована. В текущей сессии DOCX и папка `research/` не найдены ни в workspace, ни в fetched heads; бинарный hash/полнота конверсии не перепроверены. Его [полное текстовое/табличное извлечение](sources/00_REFERENCE_RESEARCH.md), [исходный CSV](sources/FEATURE_REGISTRY_000-230.csv), [STAGE_MAP](sources/STAGE_MAP.json), [README](sources/README_START_HERE.md) и [manifest](sources/SHA256_MANIFEST.txt) добавлены в Git. Историческое утверждение об отсутствии оригинала относилось к состоянию до поступления архива; подробности [SOURCE_PACKAGE_INTAKE](sources/SOURCE_PACKAGE_INTAKE.md).

Рынок Казахстана, языковые/финансовые/территориальные барьеры и проблема fragmented search — продуктовые гипотезы. В прочитанном Research §03 названы >237 тыс. детей с ООП, 125,1 тыс. детей с инвалидностью, 6,9 млн детей, 539 организаций и 19,5 млн пользователей интернета (93,4%). Первичные источники чисел здесь не проверены; числа не складывать и не выдавать за покупателей/TAM/SAM. Нельзя утверждать «первый/единственный».

Research §04 называет 103.kz, Logozavr, 2GIS/карты, соцсети/чаты, прямые центры и фонды. Текущая feature-by-feature проверка конкурентов не выполнена; нельзя выводить отсутствие у них функций. Гипотеза отличия — same-offer explanation + provenance Trust Passport + организационный путь, позднее affordability/support navigation.

Социальные метрики предложены для процесса: ясность следующего шага, завершение поиска/сравнения, вопросы к специалисту, unmatched queries, technical receipt, specialist confirmation. Измеренного социального/медицинского эффекта нет. Для будущего dashboard нужны event definition, период, n, numerator/denominator и synthetic/live labels.

Модель партнёрства — предложенный фонд/оператор и program owners, scoped кабинеты, помощь с проверкой/обновлением данных; подтверждённые договоры, реальные партнёры, выручка, коммерческие ставки и оплачивающие клиенты не установлены. В исходных briefs 300000 KZT и срок 3 декабря — исторический план, не полученные деньги/согласованное обязательство. Базовый поиск предполагается доступным без платы уязвимой семье; paid promotion не должно маскироваться под matching.

Раздел **«Созвон с родителем и анализ её проблемы на практике» — PENDING**. Аутентичные материалы/согласие/протокол отсутствуют. Интервью, цитаты, достижения и human UAT не выдумываются. Полная цепочка доказательств/гипотез: [RESEARCH_TRACEABILITY](RESEARCH_TRACEABILITY.md).

Research §09 задаёт семь LATER-направлений: Smart Guide, Trust Gap, Smart Zero, Accessibility Fit, True Cost, Social Support Navigator, Impact Dashboard. §10 содержит H1–H7; все остаются гипотезами. Эксперименты H1–H5 связаны с пятью заданиями интервью, H6 — с unknown-вопросами, H7 — с доступностью поддержки. Технический EXP-02 подтверждает возможность задать условия, но не успех реального родителя.

Материалы защиты уже есть в `docs/phase14/`: slides/video/rehearsal, включая синтезированную голосовую запись. Их наличие/хеши учтены; запись человека и результаты исследования из этого не следуют. Бинарные материалы в этой инициализации не воспроизводились. Актуальность условий конкурса после исторической проверки 6 ноября не подтверждалась.

## Решения и следующий шаг

Действующие product/architecture ADR сохраняются в [историческом журнале](../DECISIONS.md); новые решения восстановления — [DECISION_LOG](DECISION_LOG.md). Противоречия и их временное разрешение — [SOURCE_RECONCILIATION](../expansion/SOURCE_RECONCILIATION.md). Неполученные данные/решения — [OPEN_QUESTIONS](OPEN_QUESTIONS.md).

Текущий результат — [EXP-02](../expansion/stages/EXP-02.md): четыре AC подтверждены автоматикой, F017–F036 имеют точные code/test связи; A/B/C RU/KK, soft/hard, draft/applied, бюджет, Back/reload проверены. Runtime и 335 исходных baseline-файлов не изменены. Следующий безопасный кандидат — EXP-03 F037–F060, только после нового поручения: matching invariants, same-offer, freshness, zero results и benchmark. Human UAT/native KK/real AT, первичные внешние источники, DOCX и live sign-offs остаются открытыми.
Новая сессия читает AGENTS → master → handoff → phases → Git → нужные specs; затем фиксирует конкретное действие. После задачи обновляет только относящиеся feature/phase/decision/evidence записи, commit/push и проверяет remote. Память — version-controlled документы, а не обещание неограниченного контекста модели.
