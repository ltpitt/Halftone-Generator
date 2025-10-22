// Playwright Configuration for Halftone Generator E2E Tests
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:8765',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use channel to use system Chrome
        channel: 'chrome'
      },
    },
  ],

  // Web server configuration
  webServer: {
    command: 'npx http-server client -p 8765 --cors',
    port: 8765,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
