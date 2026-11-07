import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import type { Offer } from '../../domain/catalog';
import { isFresh, type RatedOffer } from '../../domain/SearchService';
import { verificationStatus } from '../../domain/profile';
import { categoryKeys, districtKeys, type MessageKey } from '../../i18n/messages';

const matchKeys: Record<string, MessageKey> = { need: 'reasonNeed', age: 'reasonAge', language: 'reasonLanguage', format: 'reasonFormat', budget: 'reasonBudget', district: 'reasonDistrict', availability: 'reasonAvailability' };
const unknownKeys: Record<string, MessageKey> = { need: 'unknownNeed', age: 'unknownAge', language: 'unknownLanguage', format: 'unknownFormat', budget: 'unknownBudget', district: 'unknownDistrict', availability: 'unknownAvailability' };
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
    {offer.priceKind !== 'unknown' && !isFresh(offer.priceConfirmedAt, new Date(catalog.demoClock), 30) && <p className="help warning-text">{t('stalePrice')}</p>}
  </>;
}

export function Explanations({ item, fallbackUnknowns }: { item: RatedOffer | null; fallbackUnknowns?: RatedOffer['unknowns'] }) {
  const { t } = useApp();
  if (!item) return <><p className="notice">{t('incompatible')}</p>{fallbackUnknowns && <section className="explanations"><h3>{t('clarify')}</h3>
    {fallbackUnknowns.length ? <ul>{fallbackUnknowns.map(reason => <li key={reason.code} data-unknown={reason.code}>{t(unknownKeys[reason.field])}</li>)}</ul> : <p>{t('noUnknowns')}</p>}
  </section>}</>;
  return <>
    {item.status === 'incomplete' && <p className="notice">{t('incompleteTitle')}</p>}
    <section className="explanations"><h3>{t(item.score === null ? 'serviceInfo' : 'matched')}</h3>
      {item.score === null ? <p>{t('neutralOffer')}</p> : item.reasons.length ? <ul>{item.reasons.slice(0, 3).map(reason => <li key={reason.code} data-reason={reason.code}>{t(reason.field === 'need' && Array.isArray(reason.expected) ? 'reasonCategory' : matchKeys[reason.field])}</li>)}</ul> : <p>{t('noReasons')}</p>}
      <h3>{t('clarify')}</h3>
      {item.unknowns.length ? <ul>{item.unknowns.map(reason => <li key={reason.code} data-unknown={reason.code}>{t(unknownKeys[reason.field])}</li>)}</ul> : <p>{t('noUnknowns')}</p>}
    </section>
  </>;
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
      {fact.reviewDueAt && Date.parse(fact.reviewDueAt) < Date.parse(catalog.demoClock) && <p className="warning-text">{t('verificationExpired')}</p>}
      <p>{fact.limitations[locale]}</p>
    </div>)}
  </section>;
}

export function CompareButton({ offer }: { offer: Offer }) {
  const { comparison, toggleCompare, t } = useApp();
  const selected = comparison.find(item => item.specialistId === offer.specialistId);
  return <button className="button secondary" type="button" aria-pressed={selected?.offerId === offer.id}
    onClick={() => toggleCompare(offer.specialistId, offer.id)}>{t(selected?.offerId === offer.id ? 'removeCompare' : selected ? 'replaceCompare' : 'compare')}</button>;
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
