# Передача фаз 28–35 → 36

Результат — проверяемый домен и интеграция S01–S03. Следующая фаза этой командой не начинается. Текущая ветка: `phases-28-35`, основа `phase-14-defense`/`b1f79f3`.

| Фаза | Результат | Основные файлы |
|---|---|---|
|28|Same-offer hard checks pass/fail/unknown; fail приоритетнее unknown|src/domain/matching.ts, contracts.ts|
|29|Request-wide веса, score/coverage, stable ties, grouping/best offer|matching.ts, SearchService.ts|
|30|Clock, field freshness, proposal/version, отдельные price/availability/contact/verification сроки|freshness.ts, profile.ts, TrustPassport.tsx|
|31|Типизированные fact reasons/kinds/source/offerId, RU/KK, separate уточнения/несовпадения|matching.ts, OfferCard.tsx, searchMessages.ts|
|32|Независимые граничные примеры, manifest A/B/C, invariants и регрессии|tests/matching.test.ts, p0.test.ts, domain.test.ts, search.test.ts|
|33|Переиспользован работающий Home: два входа, locale/demo/privacy/Қарлығаш|Home.tsx, App.tsx; intake/keyboard/reflow e2e|
|34|Четыре шага, null/skip/Back/errors; отдельный intakeDraft; явный hard район|Intake.tsx, AppState.tsx, session.ts|
|35|Summary/count тем же SearchService, edit без потерь, валидируемое применение, invalid budget блокирует CTA|Review.tsx; phases28-35/intake e2e|

API для следующей фазы:

- `new SearchService(validatedCatalog, clock?)`; `search(input, now?)` возвращает SearchResult; inspectOffer использует тот же evaluator для фиксированной услуги.
- `evaluateOffer` для чистых проверок: hardChecks, eligibility, ranking, freshness, reasons/unknowns/mismatches, версии. Excluded evaluations не возвращаются в пользовательских items.
- SearchResult: items/incompleteItems с selectedOfferId/matchingOfferIds, specialistCount/eligibleOfferCount, incompleteSpecialistCount/incompleteOfferCount, mode, appliedInputSummary, rulesVersion/catalogVersion/policyVersion/evaluatedAt.
- Код причины: `<FACTOR>_MATCH/UNKNOWN/MISMATCH`, дополнительные AGE_PARTIAL, BUDGET_STALE, BUDGET_FROM_REQUIRES_CONFIRMATION, AVAILABILITY_STALE. `localeKey` — типизированный шаблон; UI не выводит enum/code как текст.
- Applied input: `useApp().input`; анкета: `intakeDraft/updateDraft`; только `applyIntake` по S03 CTA фиксирует draft. Фильтры используют прежний `update` на applied. Count/reasons не сохраняются отдельно.
- Manifest [DEMO_SCENARIOS.json](DEMO_SCENARIOS.json), catalog-v2/rules-v2, fixed demoClock, FRESHNESS_POLICY freshness-v2 PROPOSAL. Не заменять demoClock реальными часами.

Документация: [DOMAIN_CONTRACTS](DOMAIN_CONTRACTS.md), [MATCHING_ENGINE_SPEC](MATCHING_ENGINE_SPEC.md), [UX_SPEC](UX_SPEC.md), [DEMO_DATA](DEMO_DATA.md). QA/ограничения и AC — [QA_RESULTS](QA_RESULTS.md), [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md).

Следующей фазе не нужно создавать второй SearchInput/evaluator. Полноценная новая выдача фазы36 не объявляется готовой: существующий каталог и последующие модули сохраняются как прежняя реализация с проверкой затронутых контрактов. Реальные данные/отправки/AI/карты/аккаунты не добавлены. KK требует носителя, реальное usability/screen-reader и полевые performance-метрики остаются отдельными проверками. Публичное размещение сайта не выполняется; пользователь разрешил сохранение кода в существующий GitHub.
