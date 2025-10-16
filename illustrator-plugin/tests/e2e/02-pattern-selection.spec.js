// E2E Tests - Pattern Type Selection
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { PATTERN_TYPES, TEST_TIMEOUTS } = require('../helpers/testUtils');

test.describe('Pattern Type Selection', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  PATTERN_TYPES.forEach(patternType => {
    test(`should select ${patternType} pattern`, async () => {
      await halftoneGenerator.selectPattern(patternType);
      const selected = await halftoneGenerator.getSelectedPattern();
      expect(selected).toBe(patternType);
    });
  });

  test('should change pattern selection', async () => {
    // Start with circle (default)
    let selected = await halftoneGenerator.getSelectedPattern();
    expect(selected).toBe('circle');

    // Change to square
    await halftoneGenerator.selectPattern('square');
    selected = await halftoneGenerator.getSelectedPattern();
    expect(selected).toBe('square');

    // Change to hexagon
    await halftoneGenerator.selectPattern('hexagon');
    selected = await halftoneGenerator.getSelectedPattern();
    expect(selected).toBe('hexagon');
  });

  test('should only have one pattern selected at a time', async () => {
    await halftoneGenerator.selectPattern('diamond');
    
    const checkedPatterns = await page.locator('input[name="pattern"]:checked').count();
    expect(checkedPatterns).toBe(1);
    
    const selected = await halftoneGenerator.getSelectedPattern();
    expect(selected).toBe('diamond');
  });

  test('should update canvas when pattern type changes', async () => {
    // Wait for initial render with circle pattern
    await halftoneGenerator.waitForCanvasRender();
    const canvasData1 = await halftoneGenerator.getCanvasDataURL();

    // Change to square pattern
    await halftoneGenerator.selectPattern('square');
    
    // Wait for canvas update
    await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);
    
    const canvasData2 = await halftoneGenerator.getCanvasDataURL();
    
    // Canvas should have changed
    expect(canvasData1).not.toBe(canvasData2);
  });

  test('should persist pattern selection after multiple changes', async () => {
    // Make multiple changes
    await halftoneGenerator.selectPattern('line');
    await halftoneGenerator.selectPattern('cross');
    await halftoneGenerator.selectPattern('hexagon');
    
    // Final selection should be hexagon
    const selected = await halftoneGenerator.getSelectedPattern();
    expect(selected).toBe('hexagon');
  });
});
