import {randomUUID} from 'node:crypto';
import {defineConfig,devices} from '@playwright/test';
const databaseName='e2e-'+randomUUID();
export default defineConfig({outputDir:'work/phases55-67/pilot',testDir:'./tests/pilot-e2e',testMatch:'pilot.spec.ts',workers:1,timeout:45000,
 reporter:[['list'],['json',{outputFile:'docs/phases55-67/pilot-browser.json'}]],
 use:{baseURL:'http://127.0.0.1:5175',...devices['Pixel 7'],launchOptions:{executablePath:'/usr/bin/chromium'},trace:'retain-on-failure'},
 webServer:[{command:`PILOT_MODE=PILOT_TEST PILOT_DB_NAME=${databaseName} npm run pilot`,url:'http://127.0.0.1:8787/api/pilot/public',reuseExistingServer:false},{command:'npm run dev -- --port 5175 --strictPort',url:'http://127.0.0.1:5175',reuseExistingServer:false}]
});
