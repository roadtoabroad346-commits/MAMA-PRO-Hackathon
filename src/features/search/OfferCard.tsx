import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import type { Offer } from '../../domain/catalog';
import { isFresh, type RatedOffer } from '../../domain/SearchService';
import { FRESHNESS_POLICY } from '../../domain/freshness';
import { verificationStatus } from '../../domain/profile';
import { categoryKeys, districtKeys } from '../../i18n/messages';

export const scopeKeys = { identity: 'scopeIdentity', education: 'scopeEducation', qualification: 'scopeQualification', contact: 'scopeContact', offer_data: 'scopeOfferData' } as const;

export function OfferFacts({ offer }: { offer: Offer }) {
  const { catalog, locale, t } = useApp();
  const price = offer.priceKind === 'unknown' ? t('priceUnknown') : offer.priceKind === 'free' ? `${t('priceFree')} · ${t('demo')}`
    : t(offer.priceKind === 'from' ? 'priceFrom' : 'priceExact', { amount: new Intl.NumberFormat(locale).format(offer.priceAmountKzt!) });
  const date = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Almaty' }).format(new Date(value));
  const { ageMinMonths: min, ageMaxMonths: max } = offer;
  const age = min === null && max === null ? t('unknown') : min === null || max === null
    ? t('partialAge', { min: min ?? '?', max: max ?? '?' })
    : min % 12 === 0 && max % 12 === 11 ? t('ageYears', { min: min / 12, max: Math.floor(max / 12) }) : t('ageMonths', { min, max });
  return <>
    <dl className="offer-facts">
      <div><dt>{t('ageRange')}</dt><dd>{age}</dd></div>
      <div><dt>{t('serviceLanguage')}</dt><dd>{offer.languages?.map(lang => t(lang === 'ru' ? 'russian' : 'kazakh')).join(', ') || t('unknown')}</dd></div>
      <div><dt>{t('format')}</dt><dd>{t(offer.format === 'unknown' ? 'unknown' : offer.format)}</dd></div>
      <div><dt>{t('district')}</dt><dd>{offer.format === 'online' ? t('onlineDistrictNA') : offer.districtId ? t(districtKeys[offer.districtId]) : t('unknown')}</dd></div>
    </dl>
    <p className="price">{price} · {offer.durationMinutes === null ? t('durationUnknown') : t('duration', { minutes: offer.durationMinutes })}</p>
    <p>{t(offer.unit)}</p>
    <p className="help">{offer.priceConfirmedAt ? t('priceDate', { date: date(offer.priceConfirmedAt) }) : t('priceDateUnknown')}</p>
    {offer.priceKind !== 'unknown' && !isFresh(offer.priceConfirmedAt, new Date(catalog.demoClock), FRESHNESS_POLICY.days.price) && <p className="help warning-text">{t('stalePrice')}</p>}
  </>;
}

export function Explanations({ item, fallbackUnknowns }: { item: RatedOffer | null; fallbackUnknowns?: RatedOffer['unknowns'] }) {
  const { t } = useApp();
  const unknowns = item?.unknowns ?? fallbackUnknowns ?? [];
  const reasons = item?.reasons.slice(0, 3) ?? [];
  return <section className="explanations">
    {!item && <p className="notice">{t('incompatible')}</p>}
    {item?.status === 'incomplete' && <p className="notice">{t('incompleteTitle')}</p>}
    {item?.score === null ? <><h3>{t('serviceInfo')}</h3><p>{t('neutralOffer')}</p></> : item && <>
      <h3>{t('matched')}</h3>
      {reasons.some(r => r.kind === 'match') ? <ul>{reasons.filter(r => r.kind === 'match').map(reason => <li key={reason.code} data-reason={reason.code}>{t(reason.localeKey, reason.placeholders)}</li>)}</ul> : <p>{t('noReasons')}</p>}
      {reasons.some(r => r.kind === 'preference') && <><h3>{t('preferencesMatched')}</h3><ul>{reasons.filter(r => r.kind === 'preference').map(reason => <li key={reason.code} data-reason={reason.code}>{t(reason.localeKey, reason.placeholders)}</li>)}</ul></>}
      {item.mismatches.length > 0 && <><h3>{t('notMatched')}</h3><ul>{item.mismatches.map(reason => <li key={reason.code} data-mismatch={reason.code}>{t(reason.localeKey, reason.placeholders)}</li>)}</ul></>}
    </>}
    <h3>{t('clarify')}</h3>
    {unknowns.length ? <ul>{unknowns.map(reason => <li key={reason.code} data-unknown={reason.code}>{t(reason.localeKey, reason.placeholders)}</li>)}</ul> : <p>{t('noUnknowns')}</p>}
  </section>;
}

export function Verification({ specialistId }: { specialistId: string }) {
  const { catalog, locale, t } = useApp();
  const facts = catalog.specialists.find(s => s.id === specialistId)!.verificationFacts.filter(fact => fact.scope !== 'offer_data');
  return <section className="verification"><h3>{t('verification')}</h3>
    {!facts.length && <p>{t('noVerification')}</p>}
    {facts.map((fact, index) => <div key={`${fact.scope}-${index}`}>
      <p><strong>{t(scopeKeys[fact.scope])}: {t(verificationStatus(fact, catalog.demoClock))}</strong> · {t('demo')}</p>
      <p>{t('factSource')}: {fact.sourceLabel?.[locale] ?? t('sourceUnknown')}</p>
      <p>{fact.evidenceSummary[locale]}</p>
      {fact.checkedAt && <p>{t('checkedOn', { date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Almaty' }).format(new Date(fact.checkedAt)) })}</p>}
      {fact.checkedAt && Date.parse(fact.checkedAt) > Date.parse(catalog.demoClock) && <p className="warning-text">{t('verificationFuture')}</p>}
      {fact.reviewDueAt && Date.parse(fact.reviewDueAt) <= Date.parse(catalog.demoClock) && <p className="warning-text">{t('verificationExpired')}</p>}
      <p>{fact.limitations[locale]}</p>
    </div>)}
  </section>;
}

export function CompareButton({ offer, onRemoved }: { offer: Offer; onRemoved?: () => void }) {
  const { comparison, toggleCompare, t } = useApp();
  const selected = comparison.find(item => item.specialistId === offer.specialistId);
  return <button className="button secondary" type="button" aria-pressed={selected?.offerId === offer.id}
    onClick={() => {
      toggleCompare(offer.specialistId, offer.id);
      if (selected?.offerId === offer.id) onRemoved?.();
    }}>{t(selected?.offerId === offer.id ? 'removeCompare' : selected ? 'replaceCompare' : 'compare')}</button>;
}

export function OfferCard({ item }: { item: RatedOffer }) {
  const { catalog, locale, setCatalogView, t } = useApp();
  const specialist = catalog.specialists.find(s => s.id === item.specialistId)!;
  const offer = catalog.offers.find(o => o.id === item.selectedOfferId)!;
  return <article className="specialist-card" data-testid={item.status === 'exact' ? 'specialist-card' : 'incomplete-card'} data-offer-id={offer.id}>
    <span className="badge">{t('demo')} · {t('offerId', { id: offer.id })}</span>
    <h2>{specialist.displayName[locale]}</h2><p className="offer-title">{offer.title[locale]}</p><p>{t(categoryKeys[offer.categoryId])}</p>
    <OfferFacts offer={offer} />
    <Explanations item={item} />
    <Verification specialistId={specialist.id} />
    <div className="card-actions"><Link className="button primary" id={`profile-${offer.id}`} to={`/specialists/${specialist.id}?offer=${offer.id}`} state={{ fromCatalog: true }}
      onClick={() => setCatalogView(old => ({ ...old, scrollY: window.scrollY, focusId: `profile-${offer.id}` }))}>{t('profile')}</Link>
      <CompareButton offer={offer} /></div>
  </article>;
}
