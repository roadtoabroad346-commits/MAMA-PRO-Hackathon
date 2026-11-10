# Контракты фаз 28–35

Зафиксированы до реализации 10.11.2026. Основа: фактическая ветка `phase-14-defense` (`b1f79f3`), ТЗ v1.0 и пользовательский объединённый промпт. AGENTS.md и отдельные результаты фаз 22–27 отсутствуют. Используем эквиваленты из фаз 6–14, без повторного создания приложения.

`SearchInput` и enum остаются в `src/domain/contracts.ts`. Budget 0…100000 integer, empty=null. Категория hard OR, возраст hard; needTag при наличии имеет единственный вес need, иначе используется категория. Locale не является входом evaluator. Пустой список languages нормализуется в null по ТЗ §17.2; он не означает доказанного отсутствия языка.

`ConstraintCheck`: field, result pass/fail/unknown, reasonCode, expected, actual, source, checkedAt. Fail → excluded; иначе unknown → incomplete; иначе eligible. Все проверки одной offer.

`FieldFreshness`: status known_current/unknown/stale/not_applicable, timestamp, cause, policyVersion. Clock передаёт момент времени. Политика price/contact30d, availability7d, verification365d — PROPOSAL. Точная граница current: 0≤age<TTL; равенство stale. Отсутствующая/невалидная/будущая дата unknown. updatedAt/savedAt не участвуют.

`OfferEvaluation`: offerId, specialistId, hardChecks, eligibility, ranking (request-level factors, coefficients, known flags), score, coverage, reasons/unknowns/mismatches, freshness, rulesVersion, catalogVersion. Числа внутренние, не медицинская вероятность.

`MatchReason` расширяет существующий Reason: kind match/preference/unknown/mismatch, offerId, field, expected, actual, evidenceKind/source, checkedAt, localeKey, placeholders, rulesVersion. Положительная причина требует актуального исходного факта и m=1. Постоянные hard-факторы помечены discriminating=false. Reasons не используют сведения другой услуги.

`GroupedSearchItem` сохраняет существующие selectedOfferId/matchingOfferIds. Сначала сортировка offers, затем best offer и одна карточка специалиста. Incomplete-специалисты исключают уже exact IDs; incompleteOfferCount считает только услуги этих отдельных incomplete-специалистов.

`SearchResult` сохраняет совместимость UI: items/incompleteItems и counts, appliedInputSummary, версии. Добавляются mode neutral/personalized, policyVersion и evaluatedAt. Ошибка загрузки — исключение repository, отдельный error UI, никогда успешный пустой/общий каталог.

Район активен для всех кандидатов, кроме запроса online + formatHard. В смешанном запросе online-услуга имеет m=0, known=0 для района, вес остаётся. Hard-район исключает подтверждённую online-услугу (у неё нет очного района); неизвестный формат/район → unknown. Значение района сохраняется для возврата к очному.

Публичная граница валидирует каталог и убирает непубличные offers/специалистов. Неизвестные поля схемой отбрасываются. SearchResult не содержит сырых записей специалистов, verification-инспекторов или приватных диагностических данных.

Состояние: intakeDraft отдельно от applied input. Review вычисляется из draft, CTA валидирует и атомарно применяет; уход в каталог без CTA не применяет незавершённую анкету. Снимок synthetic session v1 получает optional intakeDraft, старый v1 без него восстанавливается из input. TTL2h и отдельный locale сохраняются. Невалидная строка бюджета живёт только в памяти и блокирует подтверждение.
