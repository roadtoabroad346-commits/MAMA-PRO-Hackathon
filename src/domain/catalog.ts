import { z } from 'zod';
import { CATEGORIES, DISTRICTS, LANGUAGES, NEED_TAGS } from './contracts';

const localized = z.object({ ru: z.string().min(1), kk: z.string().min(1) });
const timestamp = z.iso.datetime({ offset: true });
const publicationStatus = z.enum(['published', 'hidden', 'withdrawn']);
const source = z.object({ sourceKind: z.string().min(1), checkedAt: timestamp.nullable() });
const offerSchema = z.object({
  id: z.string().min(1), specialistId: z.string().min(1), categoryId: z.enum(CATEGORIES),
  title: localized, focusTags: z.array(z.enum(NEED_TAGS)).nullable(),
  ageMinMonths: z.number().int().min(0).max(215).nullable(),
  ageMaxMonths: z.number().int().min(0).max(215).nullable(),
  languages: z.array(z.enum(LANGUAGES)).nullable().transform(value => value?.length ? value : null),
  format: z.enum(['offline', 'online', 'unknown']), districtId: z.enum(DISTRICTS).nullable(),
  priceKind: z.enum(['exact', 'from', 'free', 'unknown']), priceAmountKzt: z.number().int().min(0).nullable(),
  durationMinutes: z.number().int().positive().nullable(),
  unit: z.enum(['individual_session', 'group_session', 'consultation']),
  acceptingEnquiries: z.boolean().nullable(),
  priceConfirmedAt: timestamp.nullable(), availabilityConfirmedAt: timestamp.nullable(),
  fieldSources: z.record(z.string(), source), publicationStatus,
  isSynthetic: z.literal(true), updatedAt: timestamp,
}).superRefine((offer, ctx) => {
  const invalid = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (offer.ageMinMonths !== null && offer.ageMaxMonths !== null && offer.ageMinMonths > offer.ageMaxMonths) invalid('AGE_RANGE');
  if (offer.format === 'online' && offer.districtId !== null) invalid('ONLINE_DISTRICT');
  if (offer.priceKind === 'free' && offer.priceAmountKzt !== 0) invalid('FREE_PRICE');
  if (['exact', 'from'].includes(offer.priceKind) && (offer.priceAmountKzt === null || offer.priceAmountKzt <= 0)) invalid('POSITIVE_PRICE');
  if (offer.priceKind === 'unknown' && offer.priceAmountKzt !== null) invalid('UNKNOWN_PRICE');
  if (offer.fieldSources.price?.checkedAt !== offer.priceConfirmedAt) invalid('PRICE_TIMESTAMP');
});
export const catalogSchema = z.object({
  catalogVersion: z.string().min(1), rulesVersion: z.string().min(1), isSynthetic: z.literal(true),
  demoClock: timestamp,
  categories: z.array(z.object({ id: z.enum(CATEGORIES), label: localized })),
  specialists: z.array(z.object({
    id: z.string().min(1), displayName: localized, categoryIds: z.array(z.enum(CATEGORIES)),
    bio: localized.nullable().default(null), publicationStatus, isSynthetic: z.literal(true), updatedAt: timestamp,
    verificationFacts: z.array(z.object({
      scope: z.enum(['identity', 'education', 'qualification', 'contact', 'offer_data']),
      offerId: z.string().min(1).nullable().default(null),
      sourceLabel: localized.nullable().default(null),
      status: z.enum(['UNVERIFIED', 'SELF_DECLARED', 'DOCUMENT_SEEN', 'SOURCE_CONFIRMED', 'STALE', 'REVOKED']),
      evidenceSummary: localized, checkedAt: timestamp.nullable(), reviewDueAt: timestamp.nullable(),
      checkedByRole: z.string().nullable(), limitations: localized, isSynthetic: z.literal(true),
    })).default([]),
  })),
  offers: z.array(offerSchema),
}).superRefine((catalog, ctx) => {
  const invalid = (message: string) => ctx.addIssue({ code: 'custom', message });
  for (const list of [catalog.categories, catalog.specialists, catalog.offers]) {
    if (new Set(list.map(item => item.id)).size !== list.length) invalid('DUPLICATE_ID');
  }
  for (const offer of catalog.offers) {
    if (!catalog.specialists.some(s => s.id === offer.specialistId)) invalid('SPECIALIST_FK');
    if (!catalog.categories.some(c => c.id === offer.categoryId)) invalid('CATEGORY_FK');
  }
  for (const specialist of catalog.specialists) {
    for (const fact of specialist.verificationFacts) {
      if (fact.scope === 'offer_data' && !catalog.offers.some(o => o.id === fact.offerId && o.specialistId === specialist.id)) invalid('VERIFICATION_OFFER_FK');
      if (fact.scope !== 'offer_data' && fact.offerId !== null) invalid('VERIFICATION_SCOPE');
    }
    const actual = catalog.offers.filter(o => o.specialistId === specialist.id && o.publicationStatus === 'published').map(o => o.categoryId);
    if (new Set(actual).size !== new Set(specialist.categoryIds).size || actual.some(id => !specialist.categoryIds.includes(id))) invalid('CATEGORY_AGGREGATE');
  }
});
export type Catalog = z.infer<typeof catalogSchema>;
export type Offer = Catalog['offers'][number];
export type Specialist = Catalog['specialists'][number];
export type VerificationFact = Specialist['verificationFacts'][number];
