import { defineConfig } from '@playwright/test';
import base from './playwright.release.config';

// Acceptance against dist. The full search suite (including its Vite-module
// corruption fixture) runs in the separate dev gate.
export default defineConfig(base, {
  testMatch: ['exp03.spec.ts', 'exp02.spec.ts', 'intake.spec.ts', 'p0.spec.ts', 'requests.spec.ts', 'release.spec.ts'],
  outputDir: 'work/exp03/dist-results',
  reporter: [['list'], ['json', { outputFile: 'work/exp03/dist-results.json' }]],
});
