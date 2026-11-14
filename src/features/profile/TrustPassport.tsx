import { factDateText } from '../../i18n/date';
import { useApp } from '../../app/AppState';
import type { Offer, Specialist, VerificationFact } from '../../domain/catalog';
import { fieldFreshness, fixedClock, FRESHNESS_POLICY } from '../../domain/freshness';
import { scopeKeys, verificationStatus } from '../../domain/profile';
import type { MessageKey } from '../../i18n/messages';

function FactDetails({ status, source, date, scope, limit, reviewDue }: {
  status: VerificationFact['status']; source: string; date: string | null;
  scope: string; limit: string; reviewDue?: string | null;
}) {
  const { locale, t } = useApp();
  const format = (value: string) => factDateText(value, locale);
  return <dl className="trust-details">
    <div><dt>{t('factStatus')}</dt><dd>{t(status)}</dd></div>
    <div><dt>{t('factSource')}</dt><dd>{source}</dd></div>
    <div><dt>{t('factDate')}</dt><dd>{date ? <time dateTime={date}>{format(date)}</time> : t('dateUnknown')}</dd></div>
    <div><dt>{t('factScope')}</dt><dd>{scope}</dd></div>
    <div><dt>{t('factLimit')}</dt><dd>{limit}</dd></div>
    {reviewDue && <div><dt>{t('reviewDue')}</dt><dd><time dateTime={reviewDue}>{format(reviewDue)}</time></dd></div>}
  </dl>;
}

export function EvidenceFact({ fact }: { fact: VerificationFact }) {
  const { catalog, locale, t } = useApp();
  return <>
    <FactDetails status={verificationStatus(fact, catalog.demoClock)} source={fact.sourceLabel?.[locale].trim() || t('sourceUnknown')}
      date={fact.checkedAt} scope={fact.evidenceSummary[locale]} limit={fact.limitations[locale]} reviewDue={fact.reviewDueAt} />
    {fact.status === 'DOCUMENT_SEEN' && <p className="help">{t('noDocumentAuthenticity')}</p>}
    {fact.checkedAt && Date.parse(fact.checkedAt) > Date.parse(catalog.demoClock) && <p className="warning-text">{t('verificationFuture')}</p>}
    {fact.reviewDueAt && Date.parse(fact.reviewDueAt) <= Date.parse(catalog.demoClock) && <p className="warning-text">{t('verificationExpired')}</p>}
  </>;
}

export function OfferEvidence({ specialist, offer }: { specialist: Specialist; offer: Offer }) {
  const { catalog, t } = useApp();
  const fields: { key: string; label: MessageKey; known: boolean; freshDays?: number }[] = [
    { key: 'ageRange', label: 'ageRange', known: offer.ageMinMonths !== null && offer.ageMaxMonths !== null },
    { key: 'languages', label: 'serviceLanguage', known: !!offer.languages?.length },
    { key: 'format', label: 'format', known: offer.format !== 'unknown' },
    ...(offer.format === 'online' ? [] : [{ key: 'districtId', label: 'district' as const, known: offer.districtId !== null }]),
    { key: 'price', label: 'priceLabel', known: offer.priceKind !== 'unknown', freshDays: FRESHNESS_POLICY.days.price },
    { key: 'availability', label: 'availabilityLabel', known: offer.acceptingEnquiries !== null, freshDays: FRESHNESS_POLICY.days.availability },
  ];
  return <section className="trust-fact" data-trust-scope="offer_data" data-trust-offer-id={offer.id}>
      <h3>{t('scopeOfferData')} · {offer.id}</h3>
      {specialist.verificationFacts.filter(fact => fact.scope === 'offer_data' && fact.offerId === offer.id).map((fact, index) => <EvidenceFact key={index} fact={fact} />)}
      {fields.map(field => {
        const source = offer.fieldSources[field.key];
        const date = field.key === 'price' ? offer.priceConfirmedAt : field.key === 'availability' ? offer.availabilityConfirmedAt : source?.checkedAt ?? null;
        const freshness = fieldFreshness(source?.checkedAt === date ? date : null, fixedClock(catalog.demoClock), field.freshDays);
        const reported = source?.sourceKind === 'synthetic_self_reported';
        const status = !field.known || freshness.status === 'unknown' || !reported ? 'UNVERIFIED'
          : freshness.status === 'stale' ? 'STALE' : 'SELF_DECLARED';
        return <section className="offer-trust-field" key={field.key} data-trust-field={field.key}>
          <h4>{t(field.label)}</h4><FactDetails status={status} source={reported ? t('selfReportedSource') : t('sourceUnknown')}
            date={source?.checkedAt ?? null} scope={t('offerFieldScope', { field: t(field.label), id: offer.id })} limit={t('offerFieldLimit')} />
        </section>;
      })}
    </section>;
}

export function TrustPassport({ specialist, offer }: { specialist: Specialist; offer: Offer }) {
  const { catalog, locale, t } = useApp();
  return <section className="trust-passport" aria-labelledby="passport-title">
    <h2 id="passport-title">{t('passport')}</h2><p>{t('passportHelp')}</p>
    <p className="help">{t('reviewClock', { date: factDateText(catalog.demoClock, locale) })}</p>
    <div className="passport-grid">{(['identity', 'education', 'contact', ...(specialist.verificationFacts.some(f => f.scope === 'qualification') ? ['qualification' as const] : [])] as const).map(scope => {
      const facts = specialist.verificationFacts.filter(fact => fact.scope === scope);
      return <section className="trust-fact" data-trust-scope={scope} key={scope}>
        <h3>{t(scopeKeys[scope])}</h3>
        {facts.length ? facts.map((fact, index) => <EvidenceFact key={index} fact={fact} />)
          : <FactDetails status="UNVERIFIED" source={t('sourceUnknown')} date={null} scope={t('noFactScope')} limit={t('noFactLimit')} />}
      </section>;
    })}</div>
    <OfferEvidence specialist={specialist} offer={offer} />
  </section>;
}
