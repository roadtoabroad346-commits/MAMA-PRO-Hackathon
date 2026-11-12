# Передача к фазе 8

Основа: ветка `phase-7-search` репозитория https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon. Код S04–S05 сохранён коммитом `bebad7f`. Последующий документационный коммит этой ветки добавляет эту инструкцию; точный HEAD проверяется через Git. Фазу 8 в этой задаче не реализовывали. Её окончательный объём задаёт следующая команда пользователя; ожидаемое продолжение экранов — полный S06.

## Получение в новой среде

```sh
git clone --branch phase-7-search https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.git
cd MAMA-PRO-Hackathon
git log -2 --oneline
git status --short
git switch -c phase-8-profile
npm ci
npm run typecheck
npm test
npm run build
```

Для браузерных проверок:

```sh
npx playwright install chromium
npm run test:e2e
```

Если есть системный Chromium: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Для разработки: `npm run dev`. Не начинать с `phase-0-audit` или `phase-6-intake`: они не содержат результата фазы 7. Не требуются архив, секреты, backend или облачные ресурсы.

## Что уже работает

- S01–S03: вход ru/kk, четыре шага анкеты, review и общий SearchInput.
- S04–S05: поиск, OR/AND, chips/reset, сортировки, полные карточки конкретных услуг, exact/incomplete, draft/preview/apply/cancel и доступный dialog.
- Рабочее назначение `/specialists/:specialistId?offer=:offerId`: просмотр выбранной услуги, её проверка и объяснения. Deep link нейтрален; чужая пара ID не подменяется другой услугой.
- Tray и `/compare`: до трёх фиксированных пар specialist/offer, явная замена услуги, перепроверка после изменения условий. Это необходимый каталогу просмотр, а не завершение всех требований S07.
- Возврат из профиля сохраняет applied, sort, comparison, scroll и фокус. Параметры семьи не помещаются в URL.

## Где продолжать

| Задача | Текущее место |
|---|---|
| Профиль выбранной услуги и сравнение | `src/features/search/SelectionViews.tsx`: OfferProfile, Comparison |
| Факты услуги, объяснения, проверка и compare toggle | `src/features/search/OfferCard.tsx`: OfferFacts, Explanations, Verification, CompareButton |
| Matching конкретной услуги | `src/domain/SearchService.ts`: search, inspectOffer; не повторять классификацию в компонентах |
| Контракты и каталог | `src/domain/contracts.ts`, `src/domain/catalog.ts`, `src/data/catalog.json` |
| Загрузка/Retry | `src/data/catalogRepository.ts`: fetch локального публичного JSON с валидацией; ошибки не подменяются общей выдачей |
| Состояние и выбранные пары | `src/app/AppState.tsx`: input/update, comparison/toggleCompare, catalogView |
| Сохранение | `src/app/session.ts`: synthetic applied/step, schemaVersion, catalogVersion, TTL2h; comparison пока только в памяти |
| Маршруты и возврат фокуса/scroll | `src/app/App.tsx`: Layout, FocusOnNavigation |
| RU/KK | `src/i18n/messages.ts`, `src/i18n/searchMessages.ts`; равенство ключей/плейсхолдеров проверяется тестом |
| Регрессии | `tests/domain.test.ts`, `tests/search.test.ts`, `tests/session.test.ts`, `tests/e2e/intake.spec.ts`, `tests/e2e/search.spec.ts` |

## Оставшееся для полного S06

Переиспользовать имеющийся профиль; добавить выбор других опубликованных услуг специалиста согласно следующему запросу пользователя и ТЗ §7.6/10. Смена услуги должна атомарно менять цену, длительность, язык, формат, район, неизвестные сведения и объяснения. Несовместимая услуга не наследует reasons от предыдущей. Проверять пару specialistId/offerId и publicationStatus, сохранять выбранную пару при сравнении и последующих переходах.

Для фиксированной услуги уже есть `service.inspectOffer(input, offerId)`: exact/incomplete или null при несовпадении/недоступности. Публичность и принадлежность услуги проверяются отдельно; null не означает, что можно незаметно выбрать другую услугу. При отсутствии контекста не обещать персональное совпадение. В полном S06 отдельно определить поведение ссылки без offer по ТЗ: нынешний минимальный просмотр требует явный offer.

Паспорт доверия использует существующие verificationFacts: scope/status/evidenceSummary/checkedAt/reviewDueAt/limitations/isSynthetic. Отсутствие факта, SELF_DECLARED, DOCUMENT_SEEN, SOURCE_CONFIRMED, STALE и REVOKED нельзя превращать в единую гарантию. Даты сравниваются с demoClock; цена и готовность к обращениям имеют свои правила актуальности. Проверка документов не обещает качество занятий или результат.

S08–S09, IndexedDB-заявки и реальные обращения отсутствуют. Не добавлять декоративный CTA демозапроса к несуществующему экрану. Переход к заявке реализовывать только в разрешённом следующей задачей объёме. Не расширять фазу 8 автоматически до полного P0.

## Не нарушить при продолжении

- Единица соответствия — одна offer. O23/RU/offline и O24/KK/online у S12 не дают составную KK/offline-услугу.
- Unknown не pass; hard не ослабляются автоматически. Incomplete остаётся отдельным списком и не увеличивает основной count.
- Смена фильтров/сортировки не очищает сравнение и не подменяет закреплённую услугу. Другая услуга того же специалиста обновляет пару только явным действием пользователя.
- Draft панели фильтров не сохраняется в applied или storage до Apply. Обе панели и карточки используют общий SearchService.
- Возврат, фокус, ru/kk и мобильная прокрутка должны сохраниться. Не заявлять сохранение comparison после reload: сейчас его нет.
- Не выводить внутренние score/coverage как рейтинг или процент успеха. Все данные синтетические.

## Проверенная исходная точка

Фаза 7: `npm ci`, typecheck, build — PASS; **39 unit, 28 e2e — PASS**. Production preview: фильтры → сортировка → профиль → возврат, runtime errors 0; запросы только к локальному origin. RU/KK, keyboard, reflow320 и landscape проверены. Подробности и границы — [PHASE_7.md](PHASE_7.md). Эти результаты относятся к фазе 7, не доказывают будущие изменения.

Источники: [полное ТЗ](sources/QOLDAU_ZHOL_FULL_TECHNICAL_SPEC_v1.0.txt), [принятые уточнения MATCH/FLOW](DECISIONS.md), [фаза 6](PHASE_6.md). Фазы 1–5 отдельно не объявлялись завершёнными; необходимая основа появилась в фазе 6. Редактура носителем KK, родительское исследование и аудит скринридером не проводились.

Перед завершением фазы 8 обновить отчёт фактических проверок, сохранить исходники коммитом и явно указать ветку/SHA и факт отправки в GitHub. Проверять удалённый SHA, а не только успешный вывод commit.
