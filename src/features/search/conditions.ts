import { districtApplies, type SearchInput } from '../../domain/contracts';
import { ageKeys, categoryKeys, districtKeys, needKeys, type MessageKey } from '../../i18n/messages';

type Translate = (key: MessageKey, values?: Record<string, string | number>) => string;
export function conditions(input: SearchInput, t: Translate, locale: string) {
  const chips: { id: string; label: string; patch: Partial<SearchInput>; hard: boolean }[] = [];
  const add = (id: string, label: string, value: string, patch: Partial<SearchInput>, hard = false, unused = false) => {
    chips.push({ id, label: `${label}: ${value} · ${t(unused ? 'unused' : hard ? 'strict' : 'preference')}`, patch, hard });
  };
  if (input.query) add('query', t('nameSearch'), input.query, { query: '' }, true);
  for (const id of input.categoryIds) add(`category-${id}`, t('category'), t(categoryKeys[id]), { categoryIds: input.categoryIds.filter(value => value !== id) }, true);
  if (input.needTag) add('need', t('stepTopic'), t(needKeys[input.needTag]), { needTag: null });
  if (input.ageGroup) add('age', t('stepAge'), t(ageKeys[input.ageGroup]), { ageGroup: null }, true);
  if (input.serviceLanguage) add('language', t('serviceLanguage'), t(input.serviceLanguage === 'ru' ? 'russian' : 'kazakh'), { serviceLanguage: null, languageHard: true }, input.languageHard);
  if (input.format) add('format', t('format'), t(input.format), { format: null, formatHard: true }, input.formatHard);
  if (input.districtId) add('district', t('district'), t(districtKeys[input.districtId]), { districtId: null, districtHard: false }, districtApplies(input) && input.districtHard, !districtApplies(input));
  if (input.budgetKzt !== null) add('budget', t('budget'), `${new Intl.NumberFormat(locale).format(input.budgetKzt)} ₸`, { budgetKzt: null, budgetHard: false }, input.budgetHard);
  if (input.availabilityPreferred) add('availability', t('availability'), t('preference'), { availabilityPreferred: false });
  return chips;
}
