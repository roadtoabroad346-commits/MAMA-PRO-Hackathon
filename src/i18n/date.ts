import type { Locale } from '../domain/contracts';

// One documented date-only policy for public profile/offer provenance.
// Numeric KK avoids ICU builds that return placeholder month names like M11.
export function factDateText(instant: string, locale: Locale): string {
  const date = new Date(instant);
  if (locale === 'ru') return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Asia/Almaty' }).format(date);
  const parts = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Almaty' }).formatToParts(date);
  return ['day', 'month', 'year'].map(type => parts.find(part => part.type === type)!.value).join('.');
}
