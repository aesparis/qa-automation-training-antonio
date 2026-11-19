import { defineConfig, devices } from '@playwright/test';

// The sandbox keeps its data in memory and every test resets it, so tests run one at a time (workers: 1).
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4020',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Starts the sandbox for you if it isn't already running.
  webServer: {
    command: 'node sandbox/server.js',
    url: 'http://localhost:4020/api/health',
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
