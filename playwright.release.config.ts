import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: process.env.RECORD_DEMO === '1' ? 90000 : 30000,
  testDir: './tests/e2e',
  testMatch: ['p0.spec.ts', 'requests.spec.ts', 'release.spec.ts'],
  outputDir: 'work/phase13/browser',
  reporter: [['list'], ['json', { outputFile: 'work/phase13/browser-results.json' }]],
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:5173',
    ...devices['Pixel 7'],
    video: process.env.RECORD_DEMO === '1' ? { mode: 'on', size: { width: 430, height: 960 } } : 'off',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
      slowMo: process.env.RECORD_DEMO === '1' ? 400 : 0,
    },
  },
  webServer: {
    command: 'node scripts/serve-release.mjs',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
  },
});
