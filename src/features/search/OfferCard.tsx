import { factDateText } from '../../i18n/date';
import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import type { Offer } from '../../domain/catalog';
import { isFresh, type RatedOffer } from '../../domain/SearchService';
import { FRESHNESS_POLICY } from '../../domain/freshness';
import { scopeKeys } from '../../domain/profile';
import { categoryKeys, districtKeys } from '../../i18n/messages';
import { priceText } from '../../i18n/price';
import { EvidenceFact } from '../profile/TrustPassport';

export function OfferFacts({ offer, detailed = false }: { offer: Offer; detailed?: boolean }) {
  const { catalog, locale, t } = useApp();
  const price = priceText(offer.priceKind, offer.priceAmountKzt, locale, t, t('demo'));
  const date = (value: string) => factDateText(value, locale);
  const { ageMinMonths: min, ageMaxMonths: max } = offer;
  const availabilitySource = offer.fieldSources.availability;
  const availabilityCurrent = !!availabilitySource?.sourceKind && availabilitySource.checkedAt === offer.availabilityConfirmedAt
    && isFresh(offer.availabilityConfirmedAt, new Date(catalog.demoClock), FRESHNESS_POLICY.days.availability);
  const age = min === null && max === null ? t('unknown') : min === null || max === null
    ? t('partialAge', { min: min ?? '?', max: max ?? '?' })
    : min % 12 === 0 && max % 12 === 11 ? t('ageYears', { min: min / 12, max: Math.floor(max / 12) }) : t('ageMonths', { min, max });
  return <>
    <dl className="offer-facts">
      <div><dt>{t('ageRange')}</dt><dd>{age}</dd></div>
      <div><dt>{t('serviceLanguage')}</dt><dd>{offer.languages?.map(lang => t(lang === 'ru' ? 'russian' : 'kazakh')).join(', ') || t('unknown')}</dd></div>
      <div><dt>{t('format')}</dt><dd>{t(offer.format === 'unknown' ? 'unknown' : offer.format)}</dd></div>
      <div><dt>{t('district')}</dt><dd>{offer.format === 'online' ? t('onlineDistrictNA') : offer.districtId ? t(districtKeys[offer.districtId]) : t('unknown')}</dd></div>
      {detailed && <div><dt>{t('addressLabel')}</dt><dd>{t(offer.format === 'online' ? 'onlineAddressNA' : 'addressUnknown')}</dd></div>}
      <div><dt>{t('priceLabel')}</dt><dd>
        <p className="price">{price} · {offer.durationMinutes === null ? t('durationUnknown') : t('duration', { minutes: offer.durationMinutes })}</p>
        <p>{t(offer.unit)}</p>
        <p className="help">{offer.priceConfirmedAt ? t('priceDate', { date: date(offer.priceConfirmedAt) }) : t('priceDateUnknown')}</p>
        {offer.priceKind !== 'unknown' && !isFresh(offer.priceConfirmedAt, new Date(catalog.demoClock), FRESHNESS_POLICY.days.price) && <p className="help warning-text">{t('stalePrice')}</p>}
      </dd></div>
      {detailed && <div><dt>{t('availabilityLabel')}</dt><dd>
        <p>{t(offer.acceptingEnquiries === null ? 'unknown' : offer.acceptingEnquiries ? 'accepting' : 'notAccepting')}</p>
        <p className="help">{offer.availabilityConfirmedAt ? t('availabilityDate', { date: date(offer.availabilityConfirmedAt) }) : t('dateUnknown')}</p>
        {!availabilityCurrent && <p className="warning-text">{t('staleAvailability')}</p>}
        <p className="help">{t('availabilityLimit')}</p>
      </dd></div>}
    </dl>
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
  const { catalog, t } = useApp();
  const facts = catalog.specialists.find(s => s.id === specialistId)!.verificationFacts.filter(fact => fact.scope !== 'offer_data');
  return <section className="verification"><h3>{t('verification')}</h3>
    {!facts.length && <p>{t('noVerification')}</p>}
    {facts.map((fact, index) => <div key={`${fact.scope}-${index}`}>
      <p><strong>{t(scopeKeys[fact.scope])}</strong> · {t('demo')}</p>
      <EvidenceFact fact={fact} />
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
    <div className="card-actions"><Link className="button primary" id={`profile-${offer.id}`} to={`/specialists/${encodeURIComponent(specialist.id)}?offer=${encodeURIComponent(offer.id)}`} state={{ fromCatalog: true }}
      onClick={() => setCatalogView(old => ({ ...old, scrollY: window.scrollY, focusId: `profile-${offer.id}` }))}>{t('profile')}</Link>
      <CompareButton offer={offer} /></div>
  </article>;
}
