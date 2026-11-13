# MamaPro — консолидированный контекст

**LIVE_BLOCKED сохраняется; DEMO/PILOT_TEST only.**

Эта память восстановлена из GitHub и четырёх пользовательских вложений. Scope текущего поручения — анализ, постоянная память и docs-only Git checkpoint. EXP-01–24 не исполнялись. Приложение сохранено без изменений.

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

Репозиторий: https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon . Default на момент проверки — `phase-0-audit`, SHA `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. Несмотря на имя, ветка содержит текущий CORE, pilot55–67, audit fixes и дизайн 12–13 ноября. Создана `feature/context-init-2026-11-13` от этого SHA. Точные ref/время/PR: [GIT_SNAPSHOT](GIT_SNAPSHOT.json); синхронизация текущего результата: [SESSION_HANDOFF](SESSION_HANDOFF.md).

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

[FEATURE_STATUS](FEATURE_STATUS.md) и [FEATURE_REGISTRY.json](FEATURE_REGISTRY.json) содержат ровно 231 запись F000–F230. Имена и EXP assignment сверены между master и integrated plan.

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

Оригинал `00_REFERENCE_RESEARCH.docx` / `MamaPro_QoldauZhol_Research_13-11-2026.docx` не найден ни во вложениях, ни в соседних папках, ни в Git tree. Также отсутствуют исходные FEATURE_REGISTRY_000-230.csv и README_START_HERE.md. Доступны три приложенных производных документа с полным реестром; они сохранены [без изменений](sources/01_MASTER_IMPLEMENTATION_PROMPT.md).

Рынок Казахстана, языковые/финансовые/территориальные барьеры и проблема fragmented search — продуктовые гипотезы. В производном плане названы >237 тыс. детей с ООП и 125,1 тыс. детей с инвалидностью. Первичные источники чисел здесь не проверены; числа не складывать и не выдавать за покупателей/TAM/SAM. Нельзя утверждать «первый/единственный».

Аналоги из исходных briefs: 2GIS, 103.kz, общий поиск, соцсети/родительские сообщества. Текущая feature-by-feature проверка конкурентов не выполнена; нельзя выводить отсутствие у них функций. Гипотеза отличия — same-offer explanation + provenance Trust Passport + организационный путь, позднее affordability/support navigation.

Социальные метрики предложены для процесса: ясность следующего шага, завершение поиска/сравнения, вопросы к специалисту, unmatched queries, technical receipt, specialist confirmation. Измеренного социального/медицинского эффекта нет. Для будущего dashboard нужны event definition, период, n, numerator/denominator и synthetic/live labels.

Модель партнёрства — предложенный фонд/оператор и program owners, scoped кабинеты, помощь с проверкой/обновлением данных; подтверждённые договоры, реальные партнёры, выручка, коммерческие ставки и оплачивающие клиенты не установлены. В исходных briefs 300000 KZT и срок 3 декабря — исторический план, не полученные деньги/согласованное обязательство. Базовый поиск предполагается доступным без платы уязвимой семье; paid promotion не должно маскироваться под matching.

Раздел **«Созвон с родителем и анализ её проблемы на практике» — PENDING**. Аутентичные материалы/согласие/протокол отсутствуют. Интервью, цитаты, достижения и human UAT не выдумываются. Полная цепочка доказательств/гипотез: [RESEARCH_TRACEABILITY](RESEARCH_TRACEABILITY.md).

Материалы защиты уже есть в `docs/phase14/`: slides/video/rehearsal, включая синтезированную голосовую запись. Их наличие/хеши учтены; запись человека и результаты исследования из этого не следуют. Бинарные материалы в этой инициализации не воспроизводились. Актуальность условий конкурса после исторической проверки 6 ноября не подтверждалась.

## Решения и следующий шаг

Действующие product/architecture ADR сохраняются в [историческом журнале](../DECISIONS.md); новые решения восстановления — [DECISION_LOG](DECISION_LOG.md). Противоречия и их временное разрешение — [SOURCE_RECONCILIATION](../expansion/SOURCE_RECONCILIATION.md). Неполученные данные/решения — [OPEN_QUESTIONS](OPEN_QUESTIONS.md).

Текущий результат — постоянная память с доказательными ссылками, baseline regression и docs-only checkpoint. Он не устраняет отсутствие первичного Research, интервью и operational sign-offs. Первое рекомендуемое продуктовое поручение после явного разрешения: EXP-11, узкий deterministic Trust Gap slice F136, переиспользующий existing unknown/freshness/trust data. Никакого LLM/provider подключения для него не требуется. Требования и stop condition записаны в handoff.

Новая сессия читает AGENTS → master → handoff → phases → Git → нужные specs; затем фиксирует конкретное действие. После задачи обновляет только относящиеся feature/phase/decision/evidence записи, commit/push и проверяет remote. Память — version-controlled документы, а не обещание неограниченного контекста модели.
