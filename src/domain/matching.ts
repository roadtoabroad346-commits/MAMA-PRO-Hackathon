import type { Offer } from './catalog';
import { AGE_RANGES, districtApplies, type SearchInput } from './contracts';
import { fieldFreshness, FRESHNESS_POLICY, type Clock, type FieldFreshness } from './freshness';

export type Factor = 'need' | 'age' | 'language' | 'format' | 'budget' | 'district' | 'availability';
export type ConstraintField = Factor | 'category';
export const WEIGHTS: Record<Factor, number> = { need: 30, age: 15, language: 15, format: 10, budget: 15, district: 10, availability: 5 };
export interface ConstraintCheck {
  field: ConstraintField; result: 'pass' | 'fail' | 'unknown'; reasonCode: string;
  expected: unknown; actual: unknown; source: string | null; checkedAt: string | null;
}
export type ReasonLocaleKey = 'reasonNeed' | 'reasonCategory' | 'reasonAge' | 'reasonLanguage' | 'reasonFormat' | 'reasonBudget' | 'reasonDistrict' | 'reasonAvailability'
  | 'unknownNeed' | 'unknownAge' | 'unknownLanguage' | 'unknownFormat' | 'unknownBudget' | 'unknownDistrict' | 'unknownAvailability'
  | 'unknownBudgetStale' | 'unknownBudgetFrom' | 'unknownAvailabilityStale' | 'unknownAgePartial'
  | 'mismatchNeed' | 'mismatchAge' | 'mismatchLanguage' | 'mismatchFormat' | 'mismatchBudget' | 'mismatchDistrict' | 'mismatchAvailability';
export interface MatchReason {
  code: string; kind: 'match' | 'preference' | 'unknown' | 'mismatch';
  field: Factor; expected: unknown; actual: unknown; offerId: string;
  evidenceKind: string; source: string | null; checkedAt: string | null;
  rulesVersion: string; localeKey: ReasonLocaleKey; placeholders: Record<string, string | number>;
  discriminating: boolean;
}
export interface RankingResult {
  factors: Factor[]; denominator: number; coefficients: Record<Factor, number>; known: Record<Factor, boolean>;
  score: number | null; coverage: number | null;
}
export interface OfferEvaluation {
  offerId: string; specialistId: string; hardChecks: ConstraintCheck[];
  eligibility: 'eligible' | 'incomplete' | 'excluded';
  ranking: RankingResult; score: number | null; coverage: number | null;
  reasons: MatchReason[]; unknowns: MatchReason[]; mismatches: MatchReason[];
  freshness: Record<Factor, FieldFreshness>;
  rulesVersion: string; catalogVersion: string;
}
const sourceKeys: Record<Factor, string> = { need: 'focusTags', age: 'ageRange', language: 'languages', format: 'format', budget: 'price', district: 'districtId', availability: 'availability' };
const matchKeys: Record<Factor, ReasonLocaleKey> = { need: 'reasonNeed', age: 'reasonAge', language: 'reasonLanguage', format: 'reasonFormat', budget: 'reasonBudget', district: 'reasonDistrict', availability: 'reasonAvailability' };
const unknownKeys: Record<Factor, ReasonLocaleKey> = { need: 'unknownNeed', age: 'unknownAge', language: 'unknownLanguage', format: 'unknownFormat', budget: 'unknownBudget', district: 'unknownDistrict', availability: 'unknownAvailability' };
const mismatchKeys: Record<Factor, ReasonLocaleKey> = { need: 'mismatchNeed', age: 'mismatchAge', language: 'mismatchLanguage', format: 'mismatchFormat', budget: 'mismatchBudget', district: 'mismatchDistrict', availability: 'mismatchAvailability' };

export function applicableFactors(input: SearchInput): Factor[] {
  return (Object.keys(WEIGHTS) as Factor[]).filter(f => ({
    need: input.needTag !== null || input.categoryIds.length > 0, age: input.ageGroup !== null,
    language: input.serviceLanguage !== null, format: input.format !== null,
    budget: input.budgetKzt !== null, district: districtApplies(input) && input.districtId !== null,
    availability: input.availabilityPreferred,
  })[f]);
}

// Input is normalized at the service boundary. No UI, locale, storage or wall clock.
export function evaluateOffer(input: SearchInput, offer: Offer, context: { clock: Clock; rulesVersion: string; catalogVersion: string }): OfferEvaluation {
  const { clock, rulesVersion, catalogVersion } = context;
  const fact = (f: Factor) => offer.fieldSources[f === 'need' && input.needTag === null ? 'categoryId' : sourceKeys[f]];
  const freshness = Object.fromEntries((Object.keys(WEIGHTS) as Factor[]).map(f => {
    const source = fact(f);
    const date = f === 'budget' ? offer.priceConfirmedAt : f === 'availability' ? offer.availabilityConfirmedAt : source?.checkedAt ?? null;
    const ttl = f === 'budget' ? FRESHNESS_POLICY.days.price : f === 'availability' ? FRESHNESS_POLICY.days.availability : undefined;
    // categoryId is required and validated; it needs no invented fieldSources entry.
    const categoryOnly = f === 'need' && input.needTag === null;
    const state: FieldFreshness = categoryOnly ? { status: 'known_current', cause: 'current', timestamp: null, policyVersion: FRESHNESS_POLICY.version }
      : fieldFreshness(source?.sourceKind && source.checkedAt === date ? date : null, clock, ttl, f !== 'district' || offer.format !== 'online');
    return [f, state];
  })) as Record<Factor, FieldFreshness>;
  const sourced = (f: Factor) => freshness[f].status === 'known_current';
  const range = input.ageGroup === null ? null : AGE_RANGES[input.ageGroup];
  const category: ConstraintCheck['result'] = input.categoryIds.includes(offer.categoryId) ? 'pass' : 'fail';
  const age: ConstraintCheck['result'] = !sourced('age') || offer.ageMinMonths === null || offer.ageMaxMonths === null ? 'unknown'
    : range === null || offer.ageMinMonths <= range[0] && offer.ageMaxMonths >= range[1] ? 'pass'
      : offer.ageMaxMonths < range[0] || offer.ageMinMonths > range[1] ? 'fail' : 'unknown';
  const language: ConstraintCheck['result'] = !sourced('language') || !offer.languages?.length ? 'unknown'
    : input.serviceLanguage !== null && offer.languages.includes(input.serviceLanguage) ? 'pass' : 'fail';
  const format: ConstraintCheck['result'] = !sourced('format') || offer.format === 'unknown' ? 'unknown' : offer.format === input.format ? 'pass' : 'fail';
  const priceKnown = sourced('budget') && offer.priceAmountKzt !== null && offer.priceKind !== 'unknown';
  const finalPrice = priceKnown && (offer.priceKind === 'exact' || offer.priceKind === 'free');
  const amount = offer.priceAmountKzt;
  const budget: ConstraintCheck['result'] = !priceKnown || input.budgetKzt === null || amount === null ? 'unknown'
    : amount > input.budgetKzt ? 'fail' : finalPrice ? 'pass' : 'unknown';
  const district: ConstraintCheck['result'] = offer.format === 'online' && sourced('format') ? 'fail'
    : !sourced('district') || offer.districtId === null ? 'unknown' : offer.districtId === input.districtId ? 'pass' : 'fail';
  const availabilityKnown = sourced('availability') && offer.acceptingEnquiries !== null;
  const needKnown = sourced('need') && (input.needTag === null || offer.focusTags !== null);
  const statuses = { category, need: needKnown ? 'pass' : 'unknown', age, language, format, budget, district, availability: availabilityKnown ? 'pass' : 'unknown' } as const;
  const known: Record<Factor, boolean> = {
    need: needKnown, age: age !== 'unknown', language: language !== 'unknown', format: format !== 'unknown',
    budget: finalPrice, district: sourced('district') && offer.districtId !== null, availability: availabilityKnown,
  };
  const coefficients: Record<Factor, number> = {
    need: Number(needKnown && (input.needTag !== null ? offer.focusTags?.includes(input.needTag) : category === 'pass')),
    age: Number(age === 'pass'), language: Number(language === 'pass'), format: Number(format === 'pass'),
    budget: !finalPrice || input.budgetKzt === null || amount === null ? 0 : budget === 'pass' ? 1
      : input.budgetKzt > 0 && amount <= input.budgetKzt * 1.25 ? 0.5 : 0,
    district: Number(district === 'pass'), availability: Number(availabilityKnown && offer.acceptingEnquiries === true),
  };
  const expected: Record<ConstraintField, unknown> = { category: input.categoryIds, need: input.needTag ?? input.categoryIds, age: input.ageGroup, language: input.serviceLanguage, format: input.format, budget: input.budgetKzt, district: input.districtId, availability: true };
  const actual: Record<ConstraintField, unknown> = { category: offer.categoryId, need: input.needTag !== null ? offer.focusTags : offer.categoryId, age: [offer.ageMinMonths, offer.ageMaxMonths], language: offer.languages, format: offer.format, budget: { kind: offer.priceKind, amountKzt: amount, unit: offer.unit, durationMinutes: offer.durationMinutes }, district: offer.districtId, availability: offer.acceptingEnquiries };
  const hardFields: ConstraintField[] = [];
  if (input.categoryIds.length) hardFields.push('category');
  if (input.ageGroup !== null) hardFields.push('age');
  if (input.serviceLanguage !== null && input.languageHard) hardFields.push('language');
  if (input.format !== null && input.formatHard) hardFields.push('format');
  if (input.budgetKzt !== null && input.budgetHard) hardFields.push('budget');
  if (districtApplies(input) && input.districtId !== null && input.districtHard) hardFields.push('district');
  const codeFor = (f: Factor, state: 'match' | 'unknown' | 'mismatch') => {
    if (state === 'unknown') {
      if (freshness[f].status === 'stale') return `${f.toUpperCase()}_STALE`;
      if (f === 'budget' && priceKnown && offer.priceKind === 'from') return 'BUDGET_FROM_REQUIRES_CONFIRMATION';
      if (f === 'age' && sourced('age') && offer.ageMinMonths !== null && offer.ageMaxMonths !== null) return 'AGE_PARTIAL';
    }
    return `${f.toUpperCase()}_${state.toUpperCase()}`;
  };
  const hardChecks = hardFields.map((f): ConstraintCheck => ({ field: f, result: statuses[f],
    reasonCode: f === 'category' ? `CATEGORY_${statuses[f].toUpperCase()}` : codeFor(f, statuses[f] === 'pass' ? 'match' : statuses[f] === 'fail' ? 'mismatch' : 'unknown'),
    expected: expected[f], actual: actual[f], source: f === 'category' ? 'validated_catalog' : fact(f)?.sourceKind ?? null,
    checkedAt: f === 'category' ? null : freshness[f].timestamp,
  }));
  const eligibility = hardChecks.some(c => c.result === 'fail') ? 'excluded' : hardChecks.some(c => c.result === 'unknown') ? 'incomplete' : 'eligible';
  const factors = applicableFactors(input);
  const denominator = factors.reduce((sum, f) => sum + WEIGHTS[f], 0);
  const score = denominator === 0 ? null : 100 * factors.reduce((sum, f) => sum + WEIGHTS[f] * coefficients[f], 0) / denominator;
  const coverage = denominator === 0 ? null : factors.reduce((sum, f) => sum + WEIGHTS[f] * Number(known[f]), 0) / denominator;
  const reasons: MatchReason[] = [], unknowns: MatchReason[] = [], mismatches: MatchReason[] = [];
  const displayed = [...new Set<Factor>([...factors, 'age', 'language', 'format', 'budget', 'availability', ...(offer.format === 'offline' ? ['district' as const] : [])])];
  for (const f of displayed) {
    if (known[f] && !factors.includes(f)) continue;
    const state = !known[f] ? 'unknown' : coefficients[f] === 1 ? 'match' : 'mismatch';
    const code = codeFor(f, state);
    const hard = hardFields.includes(f) || f === 'need' && input.needTag === null && input.categoryIds.length > 0;
    let localeKey = state === 'match' ? f === 'need' && input.needTag === null ? 'reasonCategory' : matchKeys[f] : state === 'unknown' ? unknownKeys[f] : mismatchKeys[f];
    if (code === 'BUDGET_STALE') localeKey = 'unknownBudgetStale';
    if (code === 'BUDGET_FROM_REQUIRES_CONFIRMATION') localeKey = 'unknownBudgetFrom';
    if (code === 'AVAILABILITY_STALE') localeKey = 'unknownAvailabilityStale';
    if (code === 'AGE_PARTIAL') localeKey = 'unknownAgePartial';
    const reason: MatchReason = { code, kind: state === 'match' ? hard ? 'match' : 'preference' : state,
      field: f, expected: factors.includes(f) ? expected[f] : null, actual: actual[f], offerId: offer.id,
      evidenceKind: fact(f)?.sourceKind ?? 'synthetic_catalog', source: fact(f)?.sourceKind ?? (f === 'need' && input.needTag === null ? 'validated_catalog' : null),
      checkedAt: freshness[f].timestamp, rulesVersion, localeKey, placeholders: {}, discriminating: !hard,
    };
    (state === 'unknown' ? unknowns : state === 'match' ? reasons : mismatches).push(reason);
  }
  return { offerId: offer.id, specialistId: offer.specialistId, hardChecks, eligibility,
    ranking: { factors, denominator, coefficients, known, score, coverage }, score, coverage,
    reasons, unknowns, mismatches, freshness, rulesVersion, catalogVersion };
}
