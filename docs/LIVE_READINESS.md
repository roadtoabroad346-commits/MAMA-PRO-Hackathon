# Live readiness — 55–67

Статус: **LIVE_BLOCKED / NO-GO**. Обновление 10.11.2026 UTC. Доказательства разработки относятся к синтетическому PILOT_TEST; они не подтверждают правовые основания, реальные личности или работу фонда.

| Условие | Статус | Ответственный | Доказательство / дата | Разрешает / блокирует |
|---|---|---|---|---|
| Оператор, владелец продукта | TO-VALIDATE | Фонд: человек не назначен | Нет подтверждения | Блокирует весь live |
| Цели и состав данных | PROPOSAL | Оператор + privacy owner, не назначены | ACCESS_AND_DATA_MODEL, 10.11 | Только synthetic test |
| Основания обработки по праву Казахстана | TO-VALIDATE | Компетентный юрист оператора, не назначен | Актуальные первичные источники в этой задаче не проверены | Блокирует реальные данные |
| Несовершеннолетний / полномочия представителя | TO-VALIDATE | Оператор, не назначен | Самодекларация не проверяет полномочия | Блокирует live family |
| Размещение, юрисдикция, передача данных | TO-VALIDATE | Оператор + infrastructure owner, не назначены | Локальная SQLite — тестовая, не production-хостинг | Блокирует live storage |
| Поставщики и обработчики | TO-VALIDATE | Оператор, не назначен | Внешних каналов и production-поставщиков не подключали | Блокирует внешнюю передачу |
| Публикация профиля | IMPLEMENTED test / TO-VALIDATE live | Ответственный onboarding, не назначен | Версия test-publication-v1; contracts.ts | Реальные согласия отсутствуют |
| Подтверждение обращения | IMPLEMENTED test / TO-VALIDATE live | Contact owner, не назначен | Получатель, цель, состав; test-contact-v1 | Не legal consent для live |
| Необходимость diary-полей | ASSUMPTION | Родитель + профильный специалист: не привлечены | Интервью NOT RUN | Блокирует live diary |
| Retention / основания продления | PROPOSAL | Privacy owner, не назначен | STATE_AND_STORAGE | Реальная политика не согласована |
| Удаление, backups, прекращение пилота | TO-VALIDATE | Operations owner, не назначен | Тестовое логическое удаление и runbook | Нет production backup/restore доказательств |
| Identity / trusted roles | TESTED test / BLOCKED live | Security owner, не назначен | Synthetic sessions; production guard | Нет production IdP / identity proofing |
| Ownership / scopes | TESTED test | Разработка, эта версия | SQL + service + отрицательные тесты | Разрешает только тестовые аккаунты |
| Назначенный модератор | TESTED test / BLOCKED live | Фонд: человек не назначен | MODERATOR — вымышленный actor | Нет SLA/реального исполнителя |
| Канал обработки обращения | TESTED sandbox | Contact owner, не назначен | Durable sandbox inbox | Внешняя доставка отсутствует |
| Напоминания | TESTED in-app Chromium | Operations owner, не назначен | SQLite jobs → in-app inbox | Не push/email, нет закрытой доставки |
| Поддержка | TO-VALIDATE | Фонд: контакт не назначен | Нет реального адреса поддержки | Блокирует запуск |
| Инциденты / аудит / доступы | PROPOSAL | Security + operations owner, не назначены | Метаданные audit, ACCESS_AND_DATA_MODEL | Нужны runbook, owner, incident rehearsal |
| План завершения и отзывов | PROPOSAL | Оператор, не назначен | HANDOVER_55_67 | Нет утверждённого production-плана |

Go: закрыты все применимые реальные условия, назначены люди, проверены актуальные первичные источники и подтверждения, создан отдельный production identity adapter, выполнены security/backup/incident/доставка проверки. Затем требуется отдельное поручение на размещение/production-миграцию/реальные отправки. Сам флаг PILOT_LIVE не включает функциональность: сервер его отвергает.

Не проверялись повторно условия хакатона. Старые правовые/хакатонные материалы не выдаются за актуальную проверку.
