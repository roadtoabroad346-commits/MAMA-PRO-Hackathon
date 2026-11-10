# Поиск по услугам — rules-v2

Актуально для фаз 28–35. Типы/инварианты: [DOMAIN_CONTRACTS.md](DOMAIN_CONTRACTS.md). Единственный evaluator: `src/domain/matching.ts`; orchestration: `src/domain/SearchService.ts`.

Pipeline: normalize/validate SearchInput → валидируемый CatalogRepository → public projection → текстовые кандидаты → same-offer hard checks → eligible/incomplete/excluded → ranking → reasons из тех же фактов → grouping/best offer → стабильный SearchResult.

Каталог проверяется целиком, включая ссылки, публикацию, агрегаты категорий, цену и даты. Ошибка не становится общим каталогом. Constructor SearchService также валидирует перед публичной проекцией. Unknown поля JSON отбрасываются; SearchResult содержит только IDs/проверяемые причины и агрегаты, без полных записей специалистов. Hidden/withdrawn отсутствуют в кандидатах. Отдельные domain fixtures создаются с корректными category aggregates через tests/support/catalog.ts; чистый evaluator проверяется напрямую, включая конфликтующие metadata.

Hard — AND групп; categoryIds — OR. Полный возрастной диапазон группы включительно; частичное пересечение unknown. У конкретного обязательного языка/формата нет fallback. Budget null пропущен; 0 активен. Актуальные exact/free≤B pass; exact>B fail; from>B fail; from≤B unknown. Stale/unknown не pass. Никаких комбинированных услуг.

Район в rules-v2: не применяется только при `online && formatHard`. Для смешанного запроса вес района одинаков для online/offline: online получает m=0, known=0; неизвестность не уменьшает знаменатель. При hard-районе подтверждённая online-услуга fail, отсутствие сведений unknown. UI сохраняет выбранный район и поясняет его неприменимость в online-only. Это осознанная замена ADR-0005 по прямому указанию объединённого промпта, ADR-0012.

Веса: need30/age15/language15/format10/budget15/district10/availability5. A зависит только от заданных параметров запроса. При needTag и categoryIds вес need один раз оценивает тему; категория независимо hard. Только categoryIds — need оценивает категорию. `score=100*Σ(w*m)/Σw`, `coverage=Σ(w*known)/Σw`. Empty A → null/null. Unknown/stale m=0/known=0; известное несовпадение known=1. From для конечного бюджета known=0 даже при доказанном превышении нижней границы. Soft exact: ≤B→1; до1.25B→0.5; выше→0. B=0 обрабатывается без деления. Availability — только актуальное true, не слот/обещание ответа.

Clock инжектируется; default фиксирован из catalog.demoClock. Единственный снимок времени на весь search. Политика freshness-v2 PROPOSAL: price30d, availability7d, contact30d, documents365d. `now < checkedAt+TTL`, equality stale; invalid/missing/future unknown. Для не имеющих TTL фактов достаточно валидного источника/даты не в будущем; цена и availability требуют согласованности собственных timestamps с fieldSources. updatedAt/savedAt не освежают их. Verification имеет отдельные checkedAt/reviewDueAt, ранний отзыв сохраняется, contact не получает документный TTL.

Default order: score desc, coverage desc, specialistId asc, offerId asc. Сначала offers, затем best и matchingOfferIds. Существующие price/district sort сохранены, используют ту же freshness. Exact counts — уникальные специалисты и все eligible услуги; incomplete counts — только специалисты без exact, и их incomplete услуги. Fail никогда не incomplete.

`MatchReason` имеет kind, code, offerId, expected/actual, source/evidenceKind, checkedAt, localeKey/placeholders, rulesVersion, discriminating. Положительное объяснение требует известного m=1. Hard-факторы discriminating=false: совпадение условия не объявляется преимуществом порядка. UI разделяет matches/preferences/unknowns/mismatches; основные положительные причины ограничены тремя, уточнения не скрываются. Тексты берутся по типизированному localeKey, не создаются вторым evaluator. Цена «от», stale и partial age имеют отдельные причины. Неперсональный каталог не имеет положительных причин персонального подбора.

Пример A: O01=100/coverage1; O03=85/.85; O02=82.5/1; далее O11=80 и O10=75. Ожидаемые A/B/C IDs: [DEMO_SCENARIOS.json](DEMO_SCENARIOS.json). Score внутренний; не является вероятностью занятий, клинической рекомендацией или оценкой ребёнка.
