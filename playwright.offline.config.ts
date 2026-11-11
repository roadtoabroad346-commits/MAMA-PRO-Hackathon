import {defineConfig,devices} from '@playwright/test';
export default defineConfig({outputDir:'work/phases55-67/offline',testDir:'./tests/pilot-e2e',testMatch:'offline.spec.ts',workers:1,timeout:45000,
 reporter:[['list'],['json',{outputFile:'docs/phases55-67/offline-browser.json'}]],
 use:{baseURL:'http://127.0.0.1:5176',...devices['Pixel 7'],launchOptions:{executablePath:'/usr/bin/chromium'},trace:'retain-on-failure'},
 webServer:{command:'PORT=5176 node scripts/serve-release.mjs',url:'http://127.0.0.1:5176',reuseExistingServer:false}
});
