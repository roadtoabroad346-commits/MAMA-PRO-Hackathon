# Расширенный план завершения проекта (proposed; НЕ выполнено)

Дата: 11.11.2026. Версия из `phases-0-67` — исходная точка. Здесь приведены **предлагаемые** рабочие пакеты для открытых диапазонов, а не вымышленные исходные требования фаз 15–27/36–54. Пока прежние контракты отсутствуют, назначать им «готово» нельзя.

> Обновление 11.11.2026: участник проекта сообщил, что команда тщательно проверила ранее неподтверждённые фазы 1–5, 9, 11, 15–27 и 36–54. Заявление отмечено как команда-подтверждено (`CONFIRMED_BY_TEAM_AS_REPORTED`). Этот backlog теперь отражает прежде всего **недостающие проверяемые артефакты и независимую приемку**, а не утверждение, что команда не проводила проверку. Готовность production по-прежнему не подтверждена. См. [TEAM_REVIEW_ATTESTATION](TEAM_REVIEW_ATTESTATION.md).

## A. Приоритет: убедительная, честная демонстрация для MamaPro (P0)

| Пакет | Действия | Доказательство закрытия | Статус |
|---|---|---|---|
| DEMO-01 | Пересобрать именно последний `phases-0-67` и проверить прямые URL, reload, локальный запрос, профиль, фильтры, сравнение, S01–S03 | Коммит, check/build, Playwright trace + реальные скриншоты обеих локалей | TODO |
| DEMO-02 | Обеспечить ясный путь родителя «потребность → конкретная услуга → проверка условий → действие» без лишней регистрации | Наблюдаемая попытка родителя; согласие; протокол задачи, времени/ошибок без чувствительных данных | BLOCKED (человек) |
| DEMO-03 | Полная редактура KK носителем, включающая формы, ошибки, причины matching, цены и даты | Список правок, подпись редактора/дата (не имитировать) + regression | BLOCKED (человек) |
| DEMO-04 | Проверить keyboard-only, screen reader, focus, 200% zoom, 320–430px и физическое Android/iOS | Устройства/браузеры, реальные PASS/FAIL и issue для каждого дефекта | PARTIAL (авто; real devices NOT RUN) |
| DEMO-05 | Повторить полную защиту с живым оператором, включая reserve video, 5 min + вопросы | Реальная репетиция и демо на актуальной сборке; no live claims | BLOCKED (человек) |
| DEMO-06 | Сверить правила хакатона и подготовить инвентарь предварительных материалов, AI usage, права на файлы, сроки передачи | Подтверждения организатора / документы команды; не выдавать предположения за согласие | BLOCKED (внешнее) |

## B. Неподтверждённые исторические диапазоны (P1 после восстановления источника)

- `15–27`: восстановить оригинальные задания, если они существовали. Для каждого — название, входы/выходы, UX, contracts, AC, тесты, история коммитов, handoff. Без источника не генерировать искусственную «фазу 15» с задним числом.
- `36–54`: то же. Исходники 55–67 могут закрывать часть функциональных потребностей, но это **не** доказательство выполнения 36–54.
- `1–5, 9, 11`: сверить с исходным планом W-01…W-13. Наличие аналогичных функций в поздних этапах не превращать в выполненный архивный этап.
- Для всех — сначала сделать gap analysis по критериям; затем реализовать конкретные отсутствующие UX/API/QA без дублирования уже работающих функций.

## C. Предлагаемые следующие пакеты после 67 (P1/P2, номера не утверждены)

| Proposed package | Зависимость | Минимальный результат и отрицательные тесты | Внешний gate |
|---|---|---|---|
| 68 — доверенные отношения семьи | Production identity design | Trusted parent/guardian, invitation consent, revocation, isolation, expiry, deny-by-default | Подтверждение полномочий и правовое основание |
| 69 — жизненный цикл согласия | 68 | Purpose-specific versioned consent, immutable events, withdrawal effects; never infer consent from login | Privacy/legal owner |
| 70 — production identities | 68/69 | Session rotation, MFA policy, role grants, account recovery; unauthenticated and impersonation denied | Security review |
| 71 — специалист и организация | 69/70 | Verified scopes, responsible moderation, appeal and expiry, independent test evidence | Реальные модераторы и SLA |
| 72 — live discovery | 71 | Verified offer publish, timestamps/sources, stale withdrawal, no synthetic/live mix | Real data provenance |
| 73 — external communications | 69–72 | Provider send queue, signed callbacks, dedup, explicit delivery state, opt-in, abuse prevention | Provider/recipient approval |
| 74 — clinical boundary review | 69–73 | No diagnosis/treatment advice implied; field minimization; human expert review | Medical/privacy advisors |
| 75 — operations & retention | 70–74 | Encryption/access logging, backup/restore, secure deletion lifecycle, incident tabletop | Accountable operator |
| 76 — live UX accessibility | 71–75 | Real device, assistive technologies, native KK, parent testing | Human review |
| 77 — release rehearsal | all applicable | Staging deployment, rollback, smoke, monitors, incident and support runbook | Owner go/no-go |
| 78 — limited launch | 77 | Explicitly approved scope, limited users, measured support, rollback rehearsed | Written authorization |

**Запрещено** автоматически менять `LIVE_BLOCKED` на успешный режим, публиковать тестовые actor IDs для реальных семей или отправлять реальные сообщения. Техническая разработка даже всех предложенных пакетов не отменяет внешних условий.

## D. Общие технические правила

- Сохранять строгую offer-level matching семантику и источник/дату каждого факта.
- Возврат ошибок никогда не считается успешной записью или внешней отправкой.
- Действия с семейной информацией: проверка владельца на сервере; deny-by-default; минимизация; version/revocation; audit без чувствительного текста.
- Private API: no-store, no service-worker cache, no durable offline queue без отдельного утверждения модели угроз.
- Миграции: additive/transactional, rollback и проверенная backup/restore; не смешивать синтетическую БД с live.
- Любой AI/ML, если его позднее добавят, должен работать в роли вспомогательного инструмента; нельзя выдавать модельный вывод за диагноз или подтверждённую пригодность специалиста.
- QA: boundaries, retries, duplicate requests, corrupt data, cross-account access, stale versions, RU/KK, keyboard, errors, mobile and no-network.

## E. Решение о запуске

Сейчас применим только `READY WITH LIMITATIONS` для синтетического DEMO/PILOT_TEST. Результат `PILOT_LIVE` — `BLOCKED`. Варианты следующего действия:
1. Завершить тесты и реальный показ существующего демо без настоящих персональных данных.
2. Восстановить первичные задания отсутствующих номерных фаз и закрывать их по AC.
3. Проектировать 68+ после назначения владельцев и подтверждения необходимых юридических/операционных оснований.

Не подменять «все файлы находятся в GitHub» утверждением «все фазы реализованы».
