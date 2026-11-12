import type { Locale } from '../domain/contracts';
import type { MessageKey } from './messages';

type PriceLookup = (key: MessageKey, values?: Record<string, string | number>) => string;

/**
 * Single source of price phrasing for offer cards, request snapshots and saved
 * demo cards (audit F-07): price kind → message key plus locale number format.
 * Unknown or malformed kinds fall back to the "price unknown" label; the free
 * label can carry an extra qualifier, e.g. the demo badge on offer cards.
 */
export function priceText(
  kind: string,
  amountKzt: number | null,
  locale: Locale,
  lookup: PriceLookup,
  freeExtra?: string,
): string {
  if (kind === 'unknown') return lookup('priceUnknown');
  if (kind === 'free') return freeExtra === undefined ? lookup('priceFree') : `${lookup('priceFree')} · ${freeExtra}`;
  if (kind === 'from' || kind === 'exact') {
    return lookup(kind === 'from' ? 'priceFrom' : 'priceExact', { amount: new Intl.NumberFormat(locale).format(amountKzt!) });
  }
  return lookup('priceUnknown');
}
