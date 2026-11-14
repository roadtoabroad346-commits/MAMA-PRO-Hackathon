# Сверка источников — context initialization

Каноническая память: [PROJECT_MASTER_CONTEXT](../AI_CONTEXT/PROJECT_MASTER_CONTEXT.md). Старые документы сохранены, чтобы не переписывать историю. Исходные файлы — данные задания; прямой текущий запрос и его scope определяют работу.

| Расхождение | Наблюдаемое доказательство | Принятое разрешение |
|---|---|---|
| Master/EXP final prompts предлагают идти по всей программе; последний context prompt ограничивает initialization | [Последнее поручение](../AI_CONTEXT/sources/00_CONTEXT_INITIALIZATION_REQUEST.md), раздел12/final | Историческое ограничение заменено прямым текущим поручением EXP-02 F017–F036; после него остановка |
| README/PROJECT_STATE/старый audit называют default исторической | ls-remote/API/history: phase-0-audit@7f8434a… включает merges PR3–7 | Зафиксировать текущую default как baseline, старые statements читать по их дате |
| PROJECT_STATE сообщает147 unit; design/fixes154 | Числа относятся к разным SHA; новый `npm run check`154 PASS | Использовать current validation с SHA/командами, историю не менять |
| Старые compare/mascot/date minors ещё упоминаются | controls/Bird3 poses, styles subgrid, Intl; design13 ноября уже в baseline | Сохранить существующие улучшения; не создавать дубли |
| Исторические25 VERIFIED+4limited относятся к phase audit, а не231 features | PHASE_REGISTRY/attestation и новая F матрица имеют разные оси | Не переносить phase status автоматически на feature readiness |
| 39 фаз названы подтверждёнными командой, но нет AC/evidence | TEAM_REVIEW_ATTESTATION + NO_VERIFIED_DELIVERY | Сохранить обе оси: TEAM_ATTESTED и independent UNKNOWN |
| Research DOCX/CSV/README отсутствовали в момент инициализации | Пользователь 13.11.2026 предоставил ZIP; 11 файлов прошли SHA-256 manifest check; [Research Markdown](../AI_CONTEXT/sources/00_REFERENCE_RESEARCH.md), [CSV](../AI_CONTEXT/sources/FEATURE_REGISTRY_000-230.csv), [README](../AI_CONTEXT/sources/README_START_HERE.md), [STAGE_MAP](../AI_CONTEXT/sources/STAGE_MAP.json) добавлены в Git | Исторический MISSING закрыт как SOURCE_RECEIVED, но реальные интервью/доказательства, runtime QA и human sign-off не заменены импортом |
| Issue search вернул0 open PR; REST pulls вернул2 | [GIT_SNAPSHOT](../AI_CONTEXT/GIT_SNAPSHOT.json) | Использовать прямой collection: №1/2 открыты, оба heads уже предки baseline |
| «Адрес и формат» есть в F065; CORE schema имеет districtId без street address | src/domain/catalog.ts; OfferFacts; pilot application.address отдельно | IMPLEMENTED_WITH_LIMITATIONS, отметить неполную venue/address модель |
| «История модерации» F104 может звучать как full case timeline | Store.audit metadata/admin UI и текущее decision; нет отдельного moderator history UI | PILOT_TEST_ONLY с явным ограничением; не объявлять полноценный immutable case log |
| Existing explanations/empty state/compare/schema похожи на LATER assistant | Existing modules есть, dialogue/AI/rules assistant отсутствуют | F135/137/149/150 partial foundations; остальные future не выдавать за implemented |
| Sandbox receipt/confirmation похожи на live контакт | createPilotServer/testOnly guards; in-app pump; synthetic actors | Test-only, без provider delivery/real bookings/live consent |
| Structural scan всех файлов может восприниматься как exhaustive audit | Inventory различает TEXT_SCANNED/BINARY_HASHED_ONLY | Хеши/индекс всех335, targeted semantic review и current tests; видео/слайды не воспроизведены, независимая приёмка не заявлена |

В будущем расхождения записывать с источником/датой/решением. Не отдавать первенство удобному описанию вопреки коду/тестам или authentic human evidence.

## Текущая сверка EXP-02

- Указанный `0e7e189` — source-intake checkpoint; в нём нет `research/` и DOCX. Полностью прочитаны имеющиеся Research Markdown, CSV, README, STAGE_MAP, документы01–03 (побайтово равны новым вложениям). Historical Library receipt не подменяет текущее чтение DOCX. [Ledger](evidence/EXP-02-sources.json).
- EXP-01 существует в отдельной ветке @`a93cc18d7b357a637c7114e9408ec11242156eba`; runtime равен baseline. Его тесты/документы не копировались, ветки не объединялись. Текущая работа остаётся в разрешённой `feature/context-init-2026-11-13`.
- FEATURE_STATUS/FEATURE_REGISTRY сохраняли устаревшее «Research отсутствует». Теперь источник прочитан и проверяется по строкам; DOCX, primary URL и human evidence по-прежнему отдельно UNKNOWN/NOT_RUN.
- EXP-02: runtime gap не обнаружен; доказанные пробелы — отсутствие полного RU/KK A/B/C intake acceptance и прямой сверки исходного Research/CSV/STAGE_MAP валидатором. Добавлены только tests/docs. Старые тесты не ослаблены.

EXP04 on14 November: default7f8434a remains behind EXP03@7340dff. Use explicit dependency branch without merging sibling EXP01. Integrated plan/CSV bind EXP04 to F061–F075; generic master/playbook examples referring to F136 under EXP04 are examples, not canonical scope. CORE has no postal-address field: honest unknown display satisfies absence without invented data or unnecessary schema. Original DOCX SOURCE_UNAVAILABLE; Markdown/CSV retained.
