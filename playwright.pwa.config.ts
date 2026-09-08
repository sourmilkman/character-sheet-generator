import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'pwa.spec.ts',workers:1,timeout:45000,use:{baseURL:'http://127.0.0.1:4320',viewport:{width:384,height:854}},webServer:{command:'npx tsx scripts/preview-pwa.ts',url:'http://127.0.0.1:4320/character-sheet-generator/',reuseExistingServer:true}});
