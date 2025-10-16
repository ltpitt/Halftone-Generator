/**
 * Test Setup Helpers
 * Common setup and teardown functions for e2e tests
 * Follows DRY principle - avoid duplicating setup code
 */

const { HalftoneGeneratorPage } = require('./HalftoneGeneratorPage');

/**
 * Standard test setup for Halftone Generator tests
 * Creates and initializes a page object
 * 
 * @param {import('@playwright/test').Page} testPage - Playwright page object
 * @returns {Promise<{page: import('@playwright/test').Page, halftoneGenerator: HalftoneGeneratorPage}>}
 */
async function setupTest(testPage) {
  const page = testPage;
  const halftoneGenerator = new HalftoneGeneratorPage(page);
  await halftoneGenerator.goto();
  await halftoneGenerator.waitForLoad();
  
  return { page, halftoneGenerator };
}

/**
 * Assertion helper with descriptive error messages
 * 
 * @param {*} actual - Actual value
 * @param {*} expected - Expected value
 * @param {string} message - Descriptive error message
 */
function assertWithMessage(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: Expected "${expected}" but got "${actual}"`);
  }
}

module.exports = {
  setupTest,
  assertWithMessage
};
