import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../app/AppState';
import type { Offer } from '../../domain/catalog';
import { Check } from '../../ui/controls';

// Both selection entry points use the same explicit mismatch acknowledgement.
export function RequestAction({ offer, incompatible, hasContext, fromComparison = false }: {
  offer: Offer; incompatible: boolean; hasContext: boolean; fromComparison?: boolean;
}) {
  const { t } = useApp();
  const [reviewed, setReviewed] = useState(false);
  const label = t(fromComparison ? 'chooseOffer' : 'createDemoRequest');
  return <div className="request-action">
    {incompatible && <Check label={t('reviewMismatch')} help={t('mismatchHelp')} checked={reviewed} onChange={setReviewed} />}
    {incompatible && !reviewed ? <button className="button primary" type="button" disabled>{label}</button>
      : <Link id={fromComparison ? undefined : 'create-demo-request'} className="button primary" to={`/request/${encodeURIComponent(offer.id)}`}
        state={{ fromProfile: !fromComparison, fromComparison, hasSearchContext: hasContext }}>{label}</Link>}
  </div>;
}
