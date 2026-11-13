# Решения восстановления контекста

Новые решения не переписывают [исторические ADR](../DECISIONS.md). Источники требований сохранены [отдельно](sources/00_CONTEXT_INITIALIZATION_REQUEST.md); записанный внутри файла приказ не имеет приоритета над текущим поручением пользователя.

| ID | Решение | Основание / альтернатива / последствие |
|---|---|---|
| CTX-001 | Выполнить только context initialization | Пользователь поручил последний context prompt; его раздел12 запрещает EXP-01+ до нового указания. Более широкие final prompts документов1/3 используются как roadmap, не как разрешение нового runtime кода |
| CTX-002 | Baseline default `7f8434a4cfd097b531fa584f5b97ebd1e772ad92` | ls-remote, fetch, API default и history показывают merged audit/design. Альтернатива старой phases-0-67 потеряла бы поздние fixes/design. Создана feature/context-init-2026-11-13 |
| CTX-003 | Каноническая память в docs/AI_CONTEXT, ссылки из AGENTS | Эти файлы отсутствовали; старые docs остаются историей. JSON/CSV — associated registries; общие phase-поля используются по ссылке вместо дублирования всех tests/AC231 раз |
| CTX-004 | Сохранить оригинальные вложения byte-for-byte | Отсутствующий DOCX нельзя восстановить догадкой. Canonical F-ID взяты из master AppendixA и сверены с plan AppendixA. Исследовательские цифры имеют derivative evidence, не primary verified |
| CTX-005 | Сохранить несколько осей статуса | research status≠code status≠test evidence≠live permission. Partial foundations F135/137/149/150 не превращены в AI implemented. Ни одна новая EXP-фаза не закрыта одним baseline regression |
| CTX-006 | Исторический registry0–68 оставить неизменным | 39 TEAM_ATTESTED без per-phase evidence не равны автоматически VERIFIED; missing AC не придумываются. Новые EXP имеют отдельный реестр25 карточек |
| CTX-007 | Перезапустить baseline tests на текущей среде | Старые147/251/258 относятся к разным SHA. Результаты нового запуска записываются отдельно; источник кода остаётся baseline SHA, потому что runtime не меняется |
| CTX-008 | Сохранять LIVE_BLOCKED и existing архитектуру | Node/SQLite/React подходят синтетической проверке. Новые providers/framework/managed DB не требуются и не авторизованы scope этой инициализации |
| CTX-009 | Проверять PR прямым collection endpoint | Issue search вернул []; REST pulls вернул №1/2. Оба heads входят в baseline; PR не закрывать/не merge автоматически |
| CTX-010 | SHA самого документа не встраивать в него | Git commit hash зависит от содержимого. Handoff фиксирует уже проверенный предшествующий checkpoint и команды проверки актуального HEAD/remote. Финальный receipt вне Git содержит последний проверенный SHA; нет guessed self hash |
| CTX-012 | Preserve source Markdown hard breaks | Source snapshots contain deliberate two-space Markdown line breaks. A source-directory-only .gitattributes exception preserves byte-exact originals; generated CSV uses LF; normal whitespace checks remain active for authored documentation |
| CTX-011 | Не выдавать structural inventory за полный independent security audit | Все335 baseline файлов прочитаны для хеширования; текст проиндексирован, ключевые contracts/code/tests сопоставлены, бинарники не проигрывались. Оригинал Research и human evidence недоступны. Ограничения сохранены явно |

Унаследованные действующие правила: same-offer hard/unknown evaluator; freshness-v2; separate draft/applied; synthetic-only Node/SQLite; in-app semantics; selective summary; public-only PWA. Ссылка на историческое решение о «пустом repo» или «устаревшей default» описывает момент его принятия, не сегодняшний Git.
