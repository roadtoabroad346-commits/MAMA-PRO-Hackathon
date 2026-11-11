# 10 — ARCHITECTURE QUALITY REVIEW (Stage 10)

## 1. Оценка по критериям

| Критерий | Оценка | Обоснование |
|---|---|---|
| Modularity | **Сильно** | Чистый домен (src/domain) без React/браузера; app-состояние отделено; фичи composируются; сервер — отдельный замкнутый слой. |
| Separation of concerns | **Сильно** | UI не содержит бизнес-правил:_catalog вызывает SearchService; объяснения генерируются доменом (localeKey), а не UI. |
| Domain-driven boundaries | **Сильно** | Catalog/Offer/SearchInput/DemoRequest/Command — формальные zod-контракты; версии (catalog-v2/rules-v2/freshness-v2) закреплены. |
| Type safety | **Сильно** | strict TS; zod на всех границах (входы UI, storage, HTTP); KK-паритет ключей enforced компилятором. |
| Testability | **Сильно** | Чистые функции + injectable Clock/uuid/now; 147 unit на реальном SQLite/fake-indexeddb; E2E по слоям. |
| Dependency management | **Хорошо** | 4 runtime-зависимости, все используются; lockfile единственный; типовые импорты из server/* в pilot-UI (import type — без рантайм-ребра). |
| Maintainability | **Хорошо** | Компактные модули; самый крупный файл — i18n-каталог и pilot/messages.ts (данные). Недостатки: инлайн-тексты ResultMap, цена-логика в 3 местах. |
| Scalability | **Ограничено сознательно** | Синхронный поиск в памяти и `list()` в пилоте рассчитаны на демо-объёмы; измеренный потолок ~900–1000 offers до p95>100ms. Задокументировано. |
| Reliability / failure isolation | **Сильно** | Различение отказа и неопределённости (UncertainStorageResult); никакой in-memory fallback; ошибки каталога блокируют поиск, а не подменяют данные. |
| Data consistency | **Сильно** | Один источник истины matching (SearchService); review/каталог/профиль/сравнение используют один и тот же сервис; optimistic versioning; идемпотентность. |
| Observability | **Средне** | audit-метаданные на сервере; на клиенте логов нет (консоль/ошибки не собираются) — для демо ОК, для эксплуатации — нет. |
| Extensibility | **Хорошо** | Новый фактор = WEIGHTS+sourceKeys+reasonKeys (локализованные); новая команда = вариант union. Но весовая таблица hardcoded (без конфигурации per-deployment). |

## 2. Специальные проверки (из задания)

| Вопрос | Ответ | Доказательство |
|---|---|---|
| Дублирование бизнес-правил backend/frontend? | **Нет** (кроме отображения цены в 3 UI-местах — косметика). | Matching только в src/domain; серверные правила в server/service; UI декларативен. |
| Единый источник истины matching? | **Да.** | `evaluateOffer` — единственная точка; review/catalog/compare/profile через SearchService; изолированный p0-оракул подтверждает согласованность. |
| Может ли UI показать устаревшее состояние? | **Риск закрыт** | URL-backed radios коммитят selection синхронно с контентом; объяснения пересчитываются от текущего input; сравнение при изменении условий показывает compareChanged и переоценивает. |
| Зависит ли домен от React? | **Нет.** | src/domain не импортирует react (проверено импортами); Clock/UUID — интерфейсы. |
| Разделение synthetic/production режимов? | **Да, на нескольких уровнях.** | `isSynthetic:true` в данных; LIVE-гейт в http+start; production-статик сервер отвечает 503 на /api/; NODE_ENV guard. |
| Ложные статусы отправки/подтверждения? | **Не найдены.** | Commit-контракт IndexedDB (tx.oncomplete), UncertainStorageResult без ложного успеха; сервер: inbox называется sandbox/in-app, никогда «delivered»; e2e проверяет отсутствие «Сохранено» при отказе. |

## 3. Слабые границы / скрытые состояния

- `catalogView` (scroll/focus/showIncomplete) — UI-состояние в AppState: приемлемо, не бизнес-логика.
- `comparison` in-memory (намеренно; задокументировано: reload очищает).
- `budgetDraft` — нечисловой черновик только в памяти (сознательно, чтобы не хранить невалидное значение).
- Pilot UI импортирует **типы** из `server/*` — тонкая связность frontend↔backend, но без рантайм-зависимости; контракт фактически дублируется через HTTP+JSON. Отмечено как осознанный компромисс (микрориск дрейфа типов, покрытый e2e).

## 4. Рекомендации

**Must fix** — нет (на уровне архитектуры критических дефектов не найдено).

**Should fix:**
1. Предвычисление districtKey в district-сортировке (удалить переоценку в компараторе) — готовит масштабирование.
2. Мемоизация `service.search` в Catalog/Filters по input.
3. Авто-очистка повреждённого intent (`SessionAttemptStorage.read()` → пометить битым и очищать, а не блокировать submit навсегда).

**Nice to have:**
4. Ручные чанки для react-dom/zod (кэширование).
5. Объединить price-отображение в один helper.
6. Перенести тексты ResultMap в i18n-каталог.
7. Вынести WEIGHTS в константу конфигурации правил (rulesVersion-совместимо).

Переписывание проекта не требуется: архитектура соответствует заявленному объёму и проверена 251 автоматической проверкой.
