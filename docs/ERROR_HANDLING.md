# Ошибки пилота

401 AUTH_REQUIRED → повторный вход; 403 CSRF/origin → доступ не подтверждён; 404 NOT_FOUND → единый ответ для отсутствующего/чужого private resource; 409 VERSION/IDEMPOTENCY_CONFLICT → обновить/сверить, не перезаписывать; 400 INVALID_INPUT → проверить формы/даты/цену; 413 payload size; 429 rate limit; 500 SERVER_ERROR без SQL/PII/stack.

UI оставляет допустимые поля в памяти при ошибке, сообщает отсутствие локального сохранения. Неопределённый network/server outcome сохраняет тот же command/key для retry, никогда не генерирует новый ключ автоматически. Успешное создание допускает новый явно инициированный create. Preview/copy/download имеют отдельные статусы. Private offline edit нет. Logout/expired identity убирает private UI, csrf не сохраняется persistent storage. Ошибки jobs логируют только PILOT_JOB_ERROR.

При ошибке logout private UI очищается немедленно, но server session не объявляется отозванной: виден logoutUnconfirmed и повтор с прежним CSRF. После подтверждённого logout csrf удаляется. Reload до подтверждения может восстановить сессию; предупреждение явно это объясняет. Browser test проверяет обе стадии.
