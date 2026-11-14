import { defineConfig } from '@playwright/test';
import base from './playwright.exp03.config';

export default defineConfig(base, {
  testMatch: ['exp04.spec.ts', 'profile.spec.ts', 'exp03.spec.ts', 'exp02.spec.ts', 'intake.spec.ts', 'p0.spec.ts', 'requests.spec.ts', 'release.spec.ts'],
  outputDir: 'work/exp04/dist-results',
  reporter: [['list'], ['json', { outputFile: 'work/exp04/dist-results.json' }]],
});
