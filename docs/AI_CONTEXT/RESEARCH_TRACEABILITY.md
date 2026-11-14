# Исследование → проблемы → функции → приёмка

## Классы доказательств

- CODE/TEST_OBSERVED: текущие файлы и реально выполненные команды на baseline; лог/команда/SHA в VALIDATION.
- HISTORICAL_RECORDED: исходные ТЗ/QA/ADR/attestation с собственными датами; не новый факт этой сессии.
- RESEARCH_DOCUMENT_READ: полностью прочитано текстовое/табличное извлечение Research §00–18; исходные CSV/README/STAGE_MAP и инженерные документы сопоставлены. DOCX недоступен; достоверность конверсии/Word layout не проверены. PUBLIC_SOURCE_UNVERIFIED: первичные внешние URL названы в Research, но не проверены этой сессией.
- PROPOSAL/HYPOTHESIS: решение/ожидание команды; не наблюдение родителя.
- PENDING/UNKNOWN: первичных данных нет. Никакие результаты в эту категорию не дорисованы.

Полный mapping каждой F-записи к problem/requirements/AC находится в [FEATURE_REGISTRY](FEATURE_REGISTRY.json); общие objective/model/security/UX/human gates разрешаются по `phase_ref` в [EXP registry](PHASE_REGISTRY.json). Acceptance описывает требование, а не измеренный эффект.

## Источники и ограничения

| ID | Реальный источник | Что он подтверждает | Чего не подтверждает |
|---|---|---|---|
| R-01 | [ТЗ6 ноября](../sources/QOLDAU_ZHOL_FULL_TECHNICAL_SPEC_v1.0.txt) | Исходный контракт, сегменты/гипотезы, P0, правила и proposed метрики | Проведённые интервью, нынешнюю готовность приложения, актуальность правил конкурса |
| R-02 | [Исходный brief](../sources/MASTER_PROMPT_MAMAPRO_CODEX.txt) | Требование исследовать, аналоги-кандидаты, предложенные задачи родителя | Выполнение исследования/конкурентный факт |
| R-03 | [Master13 ноября](sources/01_MASTER_IMPLEMENTATION_PROMPT.md) | Все 231 F-ID/названия и продуктовые инварианты | Фактическую реализацию функций не подтверждает; для Research сверять [источник](sources/00_REFERENCE_RESEARCH.md) |
| R-04 | [Engineering playbook](sources/02_CODEX_ENGINEERING_PLAYBOOK.md) | Правила provenance/QA/безопасности и delivery workflow | Approval оператора/live |
| R-05 | [EXP plan](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md) | Все25 карточек, dependencies, AC, market caveats | Actual execution, external permissions или измеренный impact |
| R-06 | [Historical phase registry](../PHASE_REGISTRY.json), [attestation](../TEAM_REVIEW_ATTESTATION.md) | Какие evidence/заявления записаны | Независимое подтверждение39 фаз |
| R-07 | [Новый inventory](SOURCE_INVENTORY.csv), [validation](VALIDATION.md) | Наличие/хеши335 baseline файлов, текущие baseline tests | Human UAT, полевые данные, содержимое binary видео/слайдов |
| R-08 | [Research text extract](sources/00_REFERENCE_RESEARCH.md), [CSV](sources/FEATURE_REGISTRY_000-230.csv), [README](sources/README_START_HERE.md), [STAGE_MAP](sources/STAGE_MAP.json) | READ_FULL_THIS_SESSION: 1314 строк Research, 231 CSV-запись, 25 EXP; происхождение DOCX в Library известно только из historical intake | Бинарный DOCX не вложен в Git, ручная валидация исследований/полевых данных не проведена |

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

Все проблемы выше — гипотезы/intent Research §02/05 и ТЗ, пока нет аутентичного полевого наблюдения. Полнота links→features проверяется скриптом; статистическая подтверждённость от этого не возникает.

## Реестр утверждений для защиты

| Утверждение | Класс | Разрешённая формулировка |
|---|---|---|
| Есть работающий CORE и synthetic pilot | CODE/TEST_OBSERVED | На указанном SHA воспроизведены перечисленные автоматические проверки; данные вымышленные |
| Поиск уменьшает неопределённость и экономит время | HYPOTHESIS | Предлагаем проверить заданиями и baseline; измеренного улучшения пока нет |
| >237 тыс. детей с ООП, 125,1 тыс. с инвалидностью | RESEARCH_DOCUMENT_READ §03/18; PUBLIC_SOURCE_UNVERIFIED | Research ссылается на S01/S02; primary URL/даты/метод не проверены в этой сессии; не суммировать, не считать TAM/SAM/покупателями |
| Отличаемся explanation+Trust Passport+support navigation | PROPOSAL | Это проверяемая гипотеза дифференциации; support navigation ещё LATER |
| 103.kz/Logozavr/2GIS, сообщества и центры | RESEARCH_DOCUMENT_READ §04, S07/S08 | Нужна актуальная матрица возможностей; отсутствие функции у аналога не установлено |
| Фонд/партнёры поддержат платформу | PROPOSAL | Предлагается модель; подтверждённых партнёров/обязательств нет |
| Социальный/клинический результат достигнут | UNKNOWN | Такого доказательства нет; не включать как achieved claim |
| 300000 KZT / 3 декабря | HISTORICAL_PROPOSAL из R-02 | План/оценка исходного brief, не полученное финансирование и не обещание release |

## Созвон с родителем и анализ её проблемы на практике

**PENDING — аутентичные сведения не предоставлены.** Дата, участники, согласие, цитаты, наблюдения и результаты не заполнены. Синтетическая voice rehearsal в `docs/phase14/voice/` не является интервью.

Для будущего разрешённого исследования: добровольное согласие отдельно от разрешения цитат/записи; минимум организационных сведений; пять задач P-01/P-02/P-03/P-04/P-05; фиксировать task/action/help/errors/time/outcome без medical history. Затем observation ID→problem→hypothesis→F-ID→experiment→result→decision→retest. Не отправлять родителям приглашения из этой задачи.

Пример будущей метрики — только определение: search completion = completed search tasks / attempted tasks за выбранный период и sample n; n=0 означает «нет данных». Technical request receipt, specialist response, confirmed appointment и посещение — четыре разные ступени. Никогда не выводить «выздоровление» или clinical quality из интерфейсной активности.

## Сверка поступившего Research и EXP-02 — 13.11.2026

[Ledger прочитанных файлов, SHA256 и Git refs](../expansion/evidence/EXP-02-sources.json). Все три текущих вложения побайтово совпадают с Git sources. Исходные CSV и STAGE_MAP сверены с Research §08 и реестрами. Для всех F000–F230 записаны `research_line` и `registry_line`; исходные статусы 1 MISSION /87 DEMO /43 PILOT_TEST /100 LATER сохранены. [Валидатор](validate_context.py) теперь проверяет эти источники непосредственно, а не только одинаковые приложения инженерных документов.

§09: семь направлений Smart Guide / Trust Gap / Smart Zero / Accessibility Fit / True Cost / Social Support / Impact. §10: H1 начало без категории; H2 понимание matching; H3 сравнение2–3; H4 понимание trust; H5 понимание демозаявки; H6 вопросы по unknown; H7 доступность поддержки. Это цели экспериментов, не измеренные достижения. §11 намеренно пуст; §12 требует добровольного согласия и минимизации. §13 — гипотезы каналов и финансирования, §14/17 — launch gates/риски, §15/16 — сценарий питча, а не новый launch report.

| Research reference | Что прочитано | Предел проверки |
|---|---|---|
| S01/S02 | ООП >237000; 125100 детей с инвалидностью; 6,9 млн детей; 539 организаций; отдельные даты и ссылки | URL не открывались; категории не складывать, TAM не измерен |
| S03–S05 | UNICEF: системные барьеры, исторический доступ к соцпомощи, digital inclusion | Не доказательство частоты боли в Алматы или эффекта продукта |
| S06/S09 | DataReportal 19,5 млн /93,4%; БНС ИКТ | Цифровой контекст; не клиенты |
| S07/S08 | 103.kz и Logozavr; цены отдельных объявлений 1500–25000₸+ | Не средняя цена, не актуальный feature-by-feature аудит конкурентов |
| S10 | MamaPro/Creaton; доступ при подготовке Research был ограничен | Даты/критерии не проверены |
| R01–R11 | GitHub/ТЗ/документы, их собственные даты | Текущий код проверен отдельно; исторические логи не новый QA |

P-01/P-02 → F017–F036 → [EXP-02 AC/evidence](../expansion/stages/EXP-02.md): технические AC-01…04 пройдены, приложение не переписано. Возможность заполнить/подтвердить анкету не подтверждает H1/H2 или понятность KK у родителя. EXP-01 найден в sibling remote @a93cc18, не выполнялся повторно. Оригинальный DOCX остаётся UNAVAILABLE_IN_CHECKOUT; требование его полного чтения в этой сессии не закрыто.

EXP04 P-03/P-04 technical proof: all F061–F075 and4 AC are automated synthetic PASS (see ../expansion/stages/EXP-04.md). Actual parent badge comprehension, native KK and real AT/device remain HUMAN_QA_PENDING. This is not H3/H4 user validation; interview PENDING, original DOCX SOURCE_UNAVAILABLE.
