# Выборочное резюме

По умолчанию selected=[]; parent явно выбирает собственные goal/diary/calendar/assignment и вопросы. Server preview проверяет каждый ID: owner/kind/status, не включает скрытые записи или internal metadata. Возвращает ровно выбранный текст, автора и версию, вопросы и введённого получателя. Выбор и user-authored текст не меняются при locale switch. Не клиническое заключение приложения.

Draft редактируется в памяти после preview, не сохраняется автоматически. Изменение состава/вопросов/получателя сбрасывает старый preview. Clipboard success только после fulfilled writeText; ошибка предлагает ручное выделение. Download статус — «браузеру запрошено скачивание», не доказанное сохранение файла. Ошибки различаются. Нет email/send/share URL и нет общей ссылки, сроков/отзыва ссылки не заявляем.

Удаление исходной записи не отзывает скопированный текст/скачанный файл. Отправка не запускается при preview. На logout/actor switch формы и draft размонтируются. API no-store; public caches не содержат private payload. Tests: default empty, exact selection, foreign ID, browser preview RU/KK и literal HTML.
