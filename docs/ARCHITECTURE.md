# Архитектура

Существующий React strict/Vite/router, domain SearchService/matching, local synthetic CatalogRepository и IndexedDbRequestRepository сохранены. Map — представление того же SearchResult, не второй evaluator; only eligible matchingOfferIds, source-backed synthetic coordinate table, списочная альтернатива, no routing provider.

/pilot — отдельный лениво загружаемый синтетический сценарий; не подмена CORE fixtures реальными данными. UI → same-origin /api/pilot → trusted server session → strict command → transaction/ownership/version → SQLite → public/private DTO. Durable jobs/inbox в том же процессе. Интеграция реального production каталога с CORE search и реальные public profiles не заявлены: live adapter отсутствует.

Backend выбран один: Node 24 встроенный SQLite. Шифрование, RLS, distributed scheduler, OAuth, real provider и production hosting не добавлены. Public shell worker не кэширует private API. Контракты: DOMAIN_CONTRACTS и ACCESS_AND_DATA_MODEL. Фазы 68+ не выполнены.
