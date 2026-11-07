import { z } from 'zod';

// ТЗ §7.2, §9.2, §17.3; docs/DECISIONS.md MATCH.
export const NEED_TAGS = ['speech', 'learning', 'interaction'] as const;
export const AGE_GROUPS = ['AGE_0_2', 'AGE_3_5', 'AGE_6_9', 'AGE_10_14', 'AGE_15_17'] as const;
export const LANGUAGES = ['ru', 'kk'] as const;
export const FORMATS = ['offline', 'online'] as const;
export const DISTRICTS = ['BOSTANDYK', 'ALMALY', 'AUEZOV', 'MEDEU'] as const;
export const CATEGORIES = ['LOGOPED', 'DEFECTOLOG', 'PSYCHOLOG'] as const;
export const AGE_RANGES = {
  AGE_0_2: [0, 35], AGE_3_5: [36, 71], AGE_6_9: [72, 119],
  AGE_10_14: [120, 179], AGE_15_17: [180, 215],
} as const;
export const BUDGET_MAX = 100_000;
export type Locale = typeof LANGUAGES[number];
export type NeedTag = typeof NEED_TAGS[number];
export type AgeGroup = typeof AGE_GROUPS[number];
export type District = typeof DISTRICTS[number];
export type Category = typeof CATEGORIES[number];

export const searchInputSchema = z.strictObject({
  needTag: z.enum(NEED_TAGS).nullable(),
  categoryIds: z.array(z.enum(CATEGORIES)).refine(a => new Set(a).size === a.length),
  ageGroup: z.enum(AGE_GROUPS).nullable(),
  serviceLanguage: z.enum(LANGUAGES).nullable(),
  languageHard: z.boolean(),
  format: z.enum(FORMATS).nullable(),
  formatHard: z.boolean(),
  budgetKzt: z.number().int().min(0).max(BUDGET_MAX).nullable(),
  budgetHard: z.boolean(),
  districtId: z.enum(DISTRICTS).nullable(),
  districtHard: z.boolean(),
  availabilityPreferred: z.boolean(),
  query: z.string().max(80),
  sort: z.enum(['relevant', 'price', 'district']),
});
export type SearchInput = z.infer<typeof searchInputSchema>;

export function emptySearchInput(): SearchInput {
  return {
    needTag: null, categoryIds: [], ageGroup: null, serviceLanguage: null,
    languageHard: true, format: null, formatHard: true,
    budgetKzt: null, budgetHard: false, districtId: null, districtHard: false,
    availabilityPreferred: false, query: '', sort: 'relevant',
  };
}

export function normalizeSearchInput(value: SearchInput): SearchInput {
  const input = searchInputSchema.parse(value);
  return { ...input, query: input.query.normalize('NFKC').trim().replace(/\s+/gu, ' ') };
}

export function districtApplies(input: SearchInput): boolean {
  return input.format === 'offline' && input.formatHard;
}

export type BudgetError = 'budgetInteger' | 'budgetNegative' | 'budgetLimit';
export function parseBudget(raw: string): { value: number | null; error: BudgetError | null } {
  const text = raw.trim();
  if (text === '') return { value: null, error: null };
  if (/^-\d+$/u.test(text)) return { value: null, error: 'budgetNegative' };
  if (!/^\d+$/u.test(text)) return { value: null, error: 'budgetInteger' };
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value > BUDGET_MAX) return { value: null, error: 'budgetLimit' };
  return { value, error: null };
}
