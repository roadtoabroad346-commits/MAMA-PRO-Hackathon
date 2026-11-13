import { defineConfig } from '@playwright/test';
import base from './playwright.release.config';

// Run the questionnaire acceptance against dist, alongside the existing release gate.
export default defineConfig(base, {
  testMatch: ['exp02.spec.ts', 'intake.spec.ts', 'p0.spec.ts', 'requests.spec.ts', 'release.spec.ts'],
  outputDir: 'work/exp02/release-results',
  reporter: [['list'], ['json', { outputFile: 'work/exp02/release-results.json' }]],
});
