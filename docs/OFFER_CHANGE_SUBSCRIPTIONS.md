# Подписки на изменения услуг

Опция parent по конкретной application/offer ID, явный opt-in/disable. Тестовый канал — тот же in-app inbox. Подписка owner/ref, status active|disabled. Стабильный event key change:subscriptionId:offerId:version, уникальный inbox.source; транзакция сериализует set и moderation/edit/withdraw. Никаких pending внешних messages нет: notice и inbox создаются атомарно, после unsubscribe новые не создаются.

Allowlist diff: price, priceKind, unit, address, format, languages, accepting, публичные facts, publication. Technical timestamps, private evidence/consent и прочие поля не участвуют; факты сравниваются по scope/status/source/limitation, косметическая дата проверки не спамит. Сохраняются old/new только public значений одной offer и server revision. Published edit скрывает предложение до пересмотра, вызывает withdrawal notice; approval показывает сравнение с previousPublic, включая изменение цены.

Withdraw убирает public offer немедленно. Исторические requests остаются snapshots. Активные подписки на withdrawn можно отключить в inbox даже без public страницы. Offline saved cards — отдельные явно synthetic CORE snapshots, автоматической синхронизации/обновления/отзыва отключённой копии нет. Пилотные персональные offers не записываются в demo saved storage.

Tests: opt-in, timestamp no-op, dedup, withdraw/unsubscribe, public-safe diff. Нет внешних обещаний доступных слотов или доставки.
