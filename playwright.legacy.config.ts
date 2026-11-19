import { defineConfig, devices } from '@playwright/test';

// Config for the inherited suite in tests-legacy/ (Day 12 triage). Run: npm run test:legacy
export default defineConfig({
  testDir: './tests-legacy',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-legacy' }]],
  use: {
    baseURL: 'http://localhost:4020',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node sandbox/server.js',
    url: 'http://localhost:4020/api/health',
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
