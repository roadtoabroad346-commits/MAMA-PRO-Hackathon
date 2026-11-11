# Onboarding специалистов

UI /pilot → SPECIALIST_A/B → «Профили и проверка». Поля и границы определены offer Zod schema. Публичное имя и услуга RU/KK, категория, age months, service languages, format, price kind/amount/unit/duration, адрес, source+checkedAt, accepting. Sandbox contact фиксирован, реальных номеров и сканов нет. Базовый объём: одна анкета = одна конкретная offer; специалист может создать несколько анкет. Условий из разных услуг не объединяем.

Тестовое разрешение test-publication-v1 запрашивается отдельно. Новая запись draft и facts=[]; затем submitted. Moderator назначает исполнителя, выносит needs_changes/rejected/published/suspended. После needs_changes: edit → draft → submit. Withdraw возможен владельцем, сразу убирает public offer. Published edit немедленно возвращает в draft до нового решения, сбрасывает facts, оставляет previousPublic только приватно для diff. Исторические request snapshots не переписываются.

Полнота, enum, возраст, неизвестная/бесплатная/положительная цена, версия, source и non-future checkedAt проверяются сервером. Offline private edits не сохраняются. Право льготного участия не выдумывается: отдельные льготные схемы не внедрены; обычная free offer не означает eligibility или льготу.

Production onboarding, правовые формы, реальные consent records и процесс приёма документов BLOCKED. Нет автоматического импорта публичных профилей.
