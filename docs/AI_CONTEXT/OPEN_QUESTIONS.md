# Неизвестное и решения людей

Эти вопросы не блокируют synthetic-проверку EXP-02 и обновление контекста. Они блокируют перечисленные утверждения/будущие работы. Секреты в чат не запрашивать; внешних сообщений/исследований эта сессия не проводит.

| ID | Что отсутствует / требуется | Ответственный | Последствие и безопасное состояние |
|---|---|---|---|
| Q-CTX-01 (SOURCE_RECEIVED 13.11.2026) | Historical intake сообщает о получении DOCX; в текущем workspace и GitHub heads бинарник отсутствует. [Markdown](sources/00_REFERENCE_RESEARCH.md) прочитан полностью | Владелец исследования | Оригинальный DOCX и полнота извлечения НЕ перепроверены; интервью и первичные URL открыты |
| Q-CTX-02 (SOURCE_RECEIVED 13.11.2026) | CSV/README/STAGE_MAP/SHA256_MANIFEST из пользовательского архива сохранены в [sources](sources/README_START_HERE.md) | Владелец пакета | Покрытие F000–F230 и EXP-00–EXP-24 подтверждено структурно; сверены имена/статусы/назначения со всеми реестрами; runtime readiness не следует из наличия документа |
| Q-CTX-03 | Аутентичный созвон/согласие/наблюдения родителя | Владелец исследования + добровольный участник | Раздел «Созвон с родителем и анализ её проблемы на практике» PENDING; human UAT/impact не заявлять |
| Q-CTX-04 | Источники и AC 39 исторических фаз, reviewers, dates, commits/tests | Команда | TEAM_ATTESTED сохраняется; independent verification UNKNOWN |
| Q-CTX-05 | Native KK review: demo/запись/проверка/анкета и flagged F-03 strings | Редактор-носитель, не назначен | Автоматическая parity не равна языковой приёмке |
| Q-CTX-06 | Screen reader/physical devices/browser zoom/real install и multi-version SW upgrade | Accessibility QA, не назначен | Chromium emulation/text200% tests есть; реальный accessibility audit NOT_RUN |
| Q-CTX-07 | Оператор, legal/privacy/security/infra/ops owners, поддержка | Владелец/фонд | Весь live NO-GO; см. LIVE_READINESS |
| Q-CTX-08 | Право РК, цели/основания, полномочия взрослых, retention/deletion, hosting/transfers | Компетентный юрист + оператор | Реальная family/child обработка BLOCKED_EXTERNAL; test consent не заменяет правовую основу |
| Q-CTX-09 | IdP/recovery/MFA, invitation/consent model, independent review | Security/privacy owners | Synthetic actor selector не переносить в real login; family shared access отсутствует |
| Q-CTX-10 | Проверенные специалисты/организации/program owners/moderation SLA и согласия | Оператор, партнёры, модераторы | Trust badges только synthetic; реальных договоров/партнёров не установлено |
| Q-CTX-11 | Delivery/schedule/map/voice/AI providers, договоры/бюджет/разрешения | Оператор + provider owners | Никаких external send/paid integrations; mock contracts только после нового поручения |
| Q-CTX-12 | Production TLS/CSP/HSTS/encryption/secrets, backup restore, incident/oncall drills | Security/infra/ops | Runtime production readiness не подтверждена; LIVE_BLOCKED |
| Q-CTX-13 | Актуальные официальные положения хакатона/передача прав/допустимость подготовленного кода | Команда/организатор | Исторические условия6 ноября не объявлять текущей проверкой; материалы не отправлены |
| Q-CTX-14 | Primary sources рыночных чисел, текущая competitor matrix, бюджет/бизнес-модель | Product/research owner | Нельзя суммировать пересекающиеся группы/считать клиентов, придумывать выручку/уникальность |
| Q-CTX-15 | Закрыто текущим поручением: EXP-02 F017–F036 | Владелец | EXP-02 выполнен в synthetic scope; EXP-03+ ожидает нового поручения |

Неизвестные, которые нельзя вывести из доступного Git: чужие unpushed commits/dirty checkouts, внутренние договоры, фактические интервью, remote CI success без наблюдения run. Наличие файла/описания не доказывает функциональность.
