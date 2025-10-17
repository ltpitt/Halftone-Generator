// E2E Tests - Generate Button and Status Messages
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { TEST_TIMEOUTS } = require('../helpers/testUtils');

test.describe('Generate Button and Status Messages', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should have visible generate button', async () => {
    await expect(halftoneGenerator.generateButton).toBeVisible();
    await expect(halftoneGenerator.generateButton).toBeEnabled();
    
    const buttonText = await halftoneGenerator.generateButton.textContent();
    expect(buttonText).toContain('Generate');
  });

  test('should display status element', async () => {
    await expect(halftoneGenerator.statusMessage).toBeAttached();
  });

  test('should trigger generation when button is clicked', async () => {
    // Wait for initial canvas
    await halftoneGenerator.waitForCanvasRender();
    const initialCanvas = await halftoneGenerator.getCanvasDataURL();

    // Change a parameter to ensure canvas will be different
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 20);
    
    // Click generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);

    // Canvas should update
    const newCanvas = await halftoneGenerator.getCanvasDataURL();
    expect(newCanvas).not.toBe(initialCanvas);
  });

  test('should generate with current parameters', async () => {
    // Set specific parameters
    await halftoneGenerator.selectPattern('diamond');
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 15);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 90);

    // Generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);

    // Canvas should have content
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should work with different pattern types', async () => {
    const patterns = ['circle', 'square', 'hexagon'];

    for (const pattern of patterns) {
      await halftoneGenerator.selectPattern(pattern);
      await halftoneGenerator.clickGenerate();
      await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);

      const hasContent = await halftoneGenerator.hasCanvasContent();
      expect(hasContent).toBe(true);
    }
  });

  test('should handle multiple generate clicks', async () => {
    // Click generate multiple times
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(200);
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(200);
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);

    // Canvas should still have content
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should generate with extreme parameter values', async () => {
    // Set to max values
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 50);
    await halftoneGenerator.setSliderValue(halftoneGenerator.densitySlider, 200);
    
    // Generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);

    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should update output info in test mode', async () => {
    // Generate halftone
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);

    // Output info should be visible
    await expect(halftoneGenerator.outputInfo).toBeVisible();
  });

  test('should maintain state across generate operations', async () => {
    // Set parameters
    await halftoneGenerator.selectPattern('cross');
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 12);

    // Generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);

    // Parameters should remain the same
    const pattern = await halftoneGenerator.getSelectedPattern();
    const dotSize = await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue);

    expect(pattern).toBe('cross');
    expect(parseFloat(dotSize)).toBe(12);
  });

  test('should handle generate after parameter changes', async () => {
    // Initial generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);
    const canvas1 = await halftoneGenerator.getCanvasDataURL();

    // Change parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 180);
    await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, 1.7);

    // Generate again
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);
    const canvas2 = await halftoneGenerator.getCanvasDataURL();

    // Canvas should be different
    expect(canvas1).not.toBe(canvas2);
  });

  test('should work after reset', async () => {
    // Change parameters and generate
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 25);
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);

    // Generate with default values
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(TEST_TIMEOUTS.SHORT_WAIT);

    // Should still work
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });
});
