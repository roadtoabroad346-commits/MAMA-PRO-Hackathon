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

## ADR-CTX-EXP02 — источники, ветки и граница исправлений

13.11.2026: прямое поручение разрешает EXP-02, отменяя исторический STOP после initialization только для этого scope. Работа в указанной feature/context-init-2026-11-13 от0e7e189; sibling EXP-01@a93cc18 учтён отдельно без merge/дублирования. Research Markdown полностью прочитан, но отсутствие DOCX отражено явно. Runtime не изменён: воспроизводимые проверки не выявили дефекта; добавлены недостающие acceptance tests и прямые source checks. Исходные Research statuses и human/live gates не повышаются от автоматического PASS. Полные AC/rollback: [EXP-02](../expansion/stages/EXP-02.md).

## ADR-CTX-EXP03-A — authorized scope and snapshot

Direct user instruction authorizes only EXP-03 F037–F060, four checkpoints and branch pushes. Start from verified EXP-02 remote0ebd5bf rather than old default; sibling EXP-01 remains separate, no merge. Reuse current evaluator and schemas. Correct identified gaps at SearchService/text/explanations only as demonstrated by regression tests. F059 means same-tab condition restoration; saved-search CRUD F161 is outside this phase. No EXP-04 without permission. LIVE_BLOCKED unchanged.

## ADR-CTX-EXP03-B — candidate text, ties and evidence integrity

Six red regression cases reproduced omitted RU/KK title (2), host-collated ID ties (3 sort modes), and invalid inspectOffer clock (1). SearchService now indexes normalized fields separately per offer once at construction, including own title and own category plus specialist name. No sibling text or fact aggregation. Inputs/field weights/eligibility stay rules-v2; catalog-v2/session schema/freshness-v2 unchanged. Opaque ID tie-break is explicit UTF-16 ordinal, preserving the existing ASCII demo order; score semantics do not change. inspectOffer uses search's existing invalid-clock error. Public catalog is a parsed service-owned snapshot; no runtime catalog editing is supported.

Historical inventory335 remains immutable as evidence. Context validator now checks reviewed changed files against both historical Git blobs and an explicit current-hash manifest; every unlisted path must retain its original hash. It no longer falsely requires bug fixes to leave all runtime bytes unchanged. Original source prompts remain byte-exact. No schema migration or live effect.
