# Исследование → проблемы → функции → приёмка

## Классы доказательств

- CODE/TEST_OBSERVED: текущие файлы и реально выполненные команды на baseline; лог/команда/SHA в VALIDATION.
- HISTORICAL_RECORDED: исходные ТЗ/QA/ADR/attestation с собственными датами; не новый факт этой сессии.
- DERIVATIVE_SOURCE: утверждение производных приложенных master/plan со ссылкой на отсутствующий Research; первичная проверка не выполнена.
- PROPOSAL/HYPOTHESIS: решение/ожидание команды; не наблюдение родителя.
- PENDING/UNKNOWN: первичных данных нет. Никакие результаты в эту категорию не дорисованы.

Полный mapping каждой F-записи к problem/requirements/AC находится в [FEATURE_REGISTRY](FEATURE_REGISTRY.json); общие objective/model/security/UX/human gates разрешаются по `phase_ref` в [EXP registry](PHASE_REGISTRY.json). Acceptance описывает требование, а не измеренный эффект.

## Источники и ограничения

| ID | Реальный источник | Что он подтверждает | Чего не подтверждает |
|---|---|---|---|
| R-01 | [ТЗ6 ноября](../sources/QOLDAU_ZHOL_FULL_TECHNICAL_SPEC_v1.0.txt) | Исходный контракт, сегменты/гипотезы, P0, правила и proposed метрики | Проведённые интервью, нынешнюю готовность приложения, актуальность правил конкурса |
| R-02 | [Исходный brief](../sources/MASTER_PROMPT_MAMAPRO_CODEX.txt) | Требование исследовать, аналоги-кандидаты, предложенные задачи родителя | Выполнение исследования/конкурентный факт |
| R-03 | [Master13 ноября](sources/01_MASTER_IMPLEMENTATION_PROMPT.md) | Все231 original names, research labels, продуктовые инварианты | Подлинность недоступного Research, текущую реализацию каждого ID |
| R-04 | [Engineering playbook](sources/02_CODEX_ENGINEERING_PLAYBOOK.md) | Правила provenance/QA/безопасности и delivery workflow | Approval оператора/live |
| R-05 | [EXP plan](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md) | Все25 карточек, dependencies, AC, market caveats | Actual execution, external permissions или измеренный impact |
| R-06 | [Historical phase registry](../PHASE_REGISTRY.json), [attestation](../TEAM_REVIEW_ATTESTATION.md) | Какие evidence/заявления записаны | Независимое подтверждение39 фаз |
| R-07 | [Новый inventory](SOURCE_INVENTORY.csv), [validation](VALIDATION.md) | Наличие/хеши335 baseline файлов, текущие baseline tests | Human UAT, полевые данные, содержимое binary видео/слайдов |
| R-08 | Original DOCX, original CSV, README_START_HERE | MISSING_AFTER_SEARCH: attachments, adjacent /workspace, Git tree | Никаких conclusions из их отсутствующего текста |

## Цепочки требований

| Problem ID / гипотеза | Проектная проблема | Функции / EXP | Что проверяется технически | Как проверить с человеком |
|---|---|---|---|---|
| P-01 | Новичок не знает специальности и следующего шага | F001–036; EXP-01/02; F131–140 EXP-11 | Два входа, null category, draft/review, понятные safe actions | Начать без категории, объяснить выбор; success/assistance/errors/time |
| P-02 | Нельзя понять совпадение языка/формата/возраста/бюджета | F037–060; EXP-03 | Same-offer hard/unknown/score/coverage/freshness; no silent relaxation | Найти услугу на KK/в нужном формате и объяснить applied conditions |
| P-03 | Неясно, что действительно проверено | F061–070; EXP-04; F136/138; F201–210 EXP-20 | Source/date/scope/limitations, stale/revoked; questions вместо invented answers | Родитель своими словами объясняет badge и unknown |
| P-04 | Трудно сравнить варианты и стоимость | F071–075; F151–154; EXP-04/13 | Compare2–3, desktop alignment, price units; позднее visits/travel/unknown | Сравнить два варианта, назвать компромиссы и неопределённость |
| P-05 | Непонятно, что произошло после контакта | F076–084; F105–114; EXP-05/08; F186–200 | Local commit vs server receipt vs sandbox vs confirmation; idempotency/cancel | Создать demo action и объяснить, создана ли настоящая запись |
| P-06 | Низкая связность/ограниченные устройства и язык | F006–016; F085–087; F228 | RU/KK, keyboard/reflow, explicit saved shell, no private cache | Реальные устройства/AT/носитель KK; текущий статус NOT_RUN |
| P-07 | Забываются организационные шаги и информация | F115–130; EXP-09/10 | Zone/version/in-app jobs, private goals/diary, exact summary | Проверить нужность diary полей и ясность следующего шага; пока ASSUMPTION |
| P-08 | Барьеры помещения/дороги/доступности программ | F151–170; EXP-13–15 | Proposed sourced venue/cost/routes/SupportProgram/eligibility/expiry | Подтверждение program/venue owners и наблюдение доступности поиска |
| P-09 | Координация взрослых без лишнего доступа | F171–185; EXP-16/17 | Proposed family grant/expiry/revoke/isolation/export | Legal authority/consent и family validation; live BLOCKED |
| P-10 | Доказательство социальной пользы/партнёрской устойчивости | F211–230; EXP-21–24 | Proposed safe event aggregation, partner scopes, ops gates | Протокол исследования, реальные owners/contracts, explicit launch authorization |

Все проблемы выше — гипотезы/intent исходного ТЗ, пока нет аутентичного полевого наблюдения. Полнота links→features проверяется скриптом; статистическая подтверждённость от этого не возникает.

## Реестр утверждений для защиты

| Утверждение | Класс | Разрешённая формулировка |
|---|---|---|
| Есть работающий CORE и synthetic pilot | CODE/TEST_OBSERVED | На указанном SHA воспроизведены перечисленные автоматические проверки; данные вымышленные |
| Поиск уменьшает неопределённость и экономит время | HYPOTHESIS | Предлагаем проверить заданиями и baseline; измеренного улучшения пока нет |
| >237 тыс. детей с ООП, 125,1 тыс. с инвалидностью | DERIVATIVE_SOURCE из R-05 | Производный документ приводит эти числа; primary URL/даты/метод не проверены в этой сессии; не суммировать, не считать TAM/SAM/покупателями |
| Отличаемся explanation+Trust Passport+support navigation | PROPOSAL | Это проверяемая гипотеза дифференциации; support navigation ещё LATER |
| 2GIS/103.kz и сообщества решают часть поиска | HISTORICAL/кандидаты из R-02 | Нужна актуальная матрица возможностей; отсутствие функции у аналога не установлено |
| Фонд/партнёры поддержат платформу | PROPOSAL | Предлагается модель; подтверждённых партнёров/обязательств нет |
| Социальный/клинический результат достигнут | UNKNOWN | Такого доказательства нет; не включать как achieved claim |
| 300000 KZT / 3 декабря | HISTORICAL_PROPOSAL из R-02 | План/оценка исходного brief, не полученное финансирование и не обещание release |

## Созвон с родителем и анализ её проблемы на практике

**PENDING — аутентичные сведения не предоставлены.** Дата, участники, согласие, цитаты, наблюдения и результаты не заполнены. Синтетическая voice rehearsal в `docs/phase14/voice/` не является интервью.

Для будущего разрешённого исследования: добровольное согласие отдельно от разрешения цитат/записи; минимум организационных сведений; пять задач P-01/P-02/P-03/P-04/P-05; фиксировать task/action/help/errors/time/outcome без medical history. Затем observation ID→problem→hypothesis→F-ID→experiment→result→decision→retest. Не отправлять родителям приглашения из этой задачи.

Пример будущей метрики — только определение: search completion = completed search tasks / attempted tasks за выбранный период и sample n; n=0 означает «нет данных». Technical request receipt, specialist response, confirmed appointment и посещение — четыре разные ступени. Никогда не выводить «выздоровление» или clinical quality из интерфейсной активности.
