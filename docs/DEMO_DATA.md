# Синтетический каталог фаз 28–35

Source: `src/data/catalog.json`, catalog-v2/rules-v2, demoClock `2026-11-14T12:00:00+05:00`, freshness-v2. Настоящие часы машины не меняют актуальность demo facts. История демозапросов/TTL session использует runtimeClock, а не время каталога.

Исходный dataset из ТЗ и фаз 6–14: 12 специалистов, 20 опубликованных услуг. Значения тем/возраста/языка/формата/цены/доступности не подменены ради результатов. Добавлены только `fieldSources.focusTags` с `synthetic_curated_fixture` и датой синтетического снимка 13.11.2026, поскольку evaluator теперь требует происхождение темы. Это аннотация фиктивного dataset, не интервью и не подтверждение специалистом. Повышены catalog/rules версии; старый session catalog-v1 явно сбрасывается, уже сохранённая история requests остаётся своей историей.

Канонический scenario manifest: [DEMO_SCENARIOS.json](DEMO_SCENARIOS.json), все его сценарии исполняются в tests/matching.test.ts.

| Сценарий | Exact selectedOfferIds | Incomplete selectedOfferIds |
|---|---|---|
| A: speech,3–5,KK hard,offline hard,6000soft,Bostandyksoft,availability | O01,O03,O02,O11,O10 | O07,O08 |
| B: LOGOPED,KK hard,offline hard,6000hard | O01,O03,O06,O07 | O08,O10,O11 |
| C: KK hard,offline hard,1000hard | — | O11 |
| Пустой запрос | 12 специалистов /20 услуг; score/coverage null | — |

Ручной расчёт A: O01=100/1, O03=85/.85, O02=82.5/1. O11 устаревшая цена: soft не исключает, hard оставляет incomplete; O10 from не подтверждает конечный бюджет. O23 RU/offline и O24 KK/online одного специалиста не соединяются.

Изолированные fixtures для free/zero, partial age, empty lists, hidden/withdrawn, future/invalid dates и mixed district находятся в тестах, основной dataset ими не раздувается. `catalogWithOffers` сохраняет FK/category aggregates; evaluator напрямую получает конфликтующие metadata для проверки unknown. Публикация/загрузка невалидного каталога возвращает ошибку операции, а не успешные кандидаты.
