import { randomUUID } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';
const databaseName = 'e2e-' + randomUUID();
// Chromium location is environment-specific; override with
// PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH when the browser is elsewhere.
const executable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium';
export default defineConfig({
  outputDir: 'work/phases55-67/pilot', testDir: './tests/pilot-e2e', testMatch: 'pilot.spec.ts', workers: 1, timeout: 45000,
  // Run artifacts go to work/, never into docs/ evidence directories.
  reporter: [['list'], ['json', { outputFile: 'work/phases55-67/pilot-browser.json' }]],
  use: { baseURL: 'http://127.0.0.1:5175', ...devices['Pixel 7'], launchOptions: { executablePath: executable }, trace: 'retain-on-failure' },
  webServer: [
    { command: 'npm run pilot', url: 'http://127.0.0.1:8787/api/pilot/public', reuseExistingServer: false, env: { PILOT_MODE: 'PILOT_TEST', PILOT_DB_NAME: databaseName } },
    { command: 'npm run dev -- --port 5175 --strictPort', url: 'http://127.0.0.1:5175', reuseExistingServer: false },
  ],
});
