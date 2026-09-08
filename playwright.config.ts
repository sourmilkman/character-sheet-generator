import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser',fullyParallel:false,workers:1,timeout:60000,use:{baseURL:'http://127.0.0.1:4318',headless:true,viewport:{width:384,height:854}},webServer:{command:'npm start',url:'http://127.0.0.1:4318/health',reuseExistingServer:true,timeout:30000}});
