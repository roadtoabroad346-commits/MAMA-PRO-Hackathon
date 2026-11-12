# Цели, наблюдения и задания

Необходимость полей — ASSUMPTION. Интервью родителя и профильного специалиста NOT RUN; реальные чувствительные данные не подключены. Нет child name/DOB/diagnosis/фото/аудио/файлов.

Goal: owner/author, text≤1000, discussedOn optional date, version/lifecycle. Diary: owner/author, date, optional own goalId, observation≤1000, context≤300, version/timestamps/status. Всё plaintext только на тестовом сервере; private access owner, не автоматический доступ специалиста по request. create/read/edit/delete, optimistic conflicts. UI выводит как React text, HTML не интерпретируется. Audit/idempotency не копируют текст; deletion очищает resource JSON и оставляет tombstone. Удаление из WAL/backup/export не гарантируется: STATE_AND_STORAGE.

Assignment: author specialist, scoped recipient owner, инструкция/условия≤1000, due/review date nullable, instructionVersion, revisions, status issued|revised|withdrawn. Minimal UI — только эти задания и собственные offers/requests, не CRM69. Goal attachments запрещены специалисту без отдельного goal-sharing scope (он не реализован). Scope A→A/B→B seeded на сервере. Нет произвольного recipient ownerID.

Parent response: not_started/attempted/done/unable/question, observation optional≤1000, author/time и **instructionVersion**, а не версия после ответа. При правке автором старая инструкция сохраняется в revisions; старая response остаётся связанной с прежней инструкцией. Resource version отдельно защищает concurrent write. Withdraw не выполнение; revoked scope сразу блокирует дальнейшие действия/чтение специалистом, собственная history остаётся родителю. Медицинские упражнения автоматически не генерируются; ответы не превращаются в показатель здоровья.

Tests: A/B, moderator denied, HTML literal, oversize, foreign goal, delete scrub, assignment author/recipient, unable/question, revision and scope revoke. Реальная клиническая/правовая валидация BLOCKED.
