import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // we run a built Next app for stability (fast & no dev HMR noise)
  webServer: {
    command: 'npm -w apps/web run start -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: true,
  },
});
