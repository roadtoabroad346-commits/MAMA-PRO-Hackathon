# Модерация

Очередь доступна только synthetic MODERATOR. submitted требует отдельного moderation.assign; без назначения решение NOT_FOUND. moderation.decide не допускается specialist/parent. Проверки scopes identity/education/contact/offer_data, source, private evidence, дата решения, reviewDueAt>now, limitation, решение и server actor сохраняются. Скан не загружается. Единственный положительный статус — document_seen для вымышленного evidence; source_confirmed/эффект не заявляются.

Public summary исключает private evidence/decision/consent; stale вычисляется по текущим часам на чтении, revocation — через suspended/withdrawn/отрицательное решение. Specialist не пишет verification через offer schema. Жалоба parent — приватный сигнал в moderator queue, не доказательство нарушения. Полноценное управление жалобами, назначение реального человека и SLA TO-VALIDATE; в ограниченном интерфейсе модератор пересматривает связанную анкету.

Audit: actor/op/resource/version/at, без копии evidence и medical text. Тестовые роли не подтверждают наличие реального модератора. Матрица доступа и тесты — ACCESS_AND_DATA_MODEL, tests/pilot.test.ts. Реальные полномочия и конфликт интересов живого персонала BLOCKED до назначения владельцем.
