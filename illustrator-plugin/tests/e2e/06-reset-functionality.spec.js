// E2E Tests - Reset Functionality
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { DEFAULT_PARAMS } = require('../helpers/testUtils');

test.describe('Reset Functionality', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should have visible reset button', async () => {
    await expect(halftoneGenerator.resetButton).toBeVisible();
    await expect(halftoneGenerator.resetButton).toBeEnabled();
  });

  test('should reset all parameters to defaults', async () => {
    // Change multiple parameters
    await halftoneGenerator.selectPattern('hexagon');
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 25);
    await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, 2.5);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 180);
    await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, 1.8);
    await halftoneGenerator.toggleInvert();

    // Click reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(500);

    // Verify parameters are reset
    const pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe(DEFAULT_PARAMS.pattern);

    const dotSize = await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue);
    expect(dotSize).toBe(DEFAULT_PARAMS.dotSize);

    const spacing = await halftoneGenerator.getDisplayValue(halftoneGenerator.spacingValue);
    expect(spacing).toBe(DEFAULT_PARAMS.spacing);

    const angle = await halftoneGenerator.getDisplayValue(halftoneGenerator.angleValue);
    expect(angle).toContain(DEFAULT_PARAMS.angle); // Angle includes degree symbol

    const isInverted = await halftoneGenerator.isInvertChecked();
    expect(isInverted).toBe(DEFAULT_PARAMS.invert);
  });

  test('should reset dot parameters', async () => {
    // Change dot parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 30);
    await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, 2.8);
    await halftoneGenerator.setSliderValue(halftoneGenerator.densitySlider, 150);

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(500);

    // Verify reset
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue)).toBe(DEFAULT_PARAMS.dotSize);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.spacingValue)).toBe(DEFAULT_PARAMS.spacing);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.densityValue)).toBe(DEFAULT_PARAMS.density);
  });

  test('should reset transformation parameters', async () => {
    // Change transformation parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 270);
    await halftoneGenerator.setSliderValue(halftoneGenerator.scaleXSlider, 2.5);
    await halftoneGenerator.setSliderValue(halftoneGenerator.scaleYSlider, 1.8);

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(500);

    // Verify reset (angle includes degree symbol)
    const angle = await halftoneGenerator.getDisplayValue(halftoneGenerator.angleValue);
    expect(angle).toContain(DEFAULT_PARAMS.angle);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.scaleXValue)).toBe(DEFAULT_PARAMS.scaleX);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.scaleYValue)).toBe(DEFAULT_PARAMS.scaleY);
  });

  test('should reset image adjustment parameters', async () => {
    // Change image adjustments
    await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, 1.9);
    await halftoneGenerator.setSliderValue(halftoneGenerator.brightnessSlider, 75);
    await halftoneGenerator.setSliderValue(halftoneGenerator.gammaSlider, 2.5);
    await halftoneGenerator.setSliderValue(halftoneGenerator.thresholdSlider, 200);

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(500);

    // Verify reset
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.contrastValue)).toBe(DEFAULT_PARAMS.contrast);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.brightnessValue)).toBe(DEFAULT_PARAMS.brightness);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.gammaValue)).toBe(DEFAULT_PARAMS.gamma);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.thresholdValue)).toBe(DEFAULT_PARAMS.threshold);
  });

  test('should reset advanced options', async () => {
    // Change advanced options
    await halftoneGenerator.setSliderValue(halftoneGenerator.blurSlider, 7);
    await halftoneGenerator.setSliderValue(halftoneGenerator.noiseSlider, 85);
    await halftoneGenerator.toggleInvert(); // Check it

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(500);

    // Verify reset
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.blurValue)).toBe(DEFAULT_PARAMS.blur);
    expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.noiseValue)).toBe(DEFAULT_PARAMS.noise);
    expect(await halftoneGenerator.isInvertChecked()).toBe(DEFAULT_PARAMS.invert);
  });

  test('should update canvas after reset', async () => {
    // Change parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 35);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 180);
    await halftoneGenerator.selectPattern('line');
    await page.waitForTimeout(500);

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(500);

    // Canvas should still have content after reset
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should show status message after reset', async () => {
    await halftoneGenerator.clickReset();
    
    // Status message should appear
    await halftoneGenerator.waitForStatusMessage();
    const statusText = await halftoneGenerator.getStatusMessage();
    
    expect(statusText.toLowerCase()).toContain('reset');
  });

  test('should allow multiple resets', async () => {
    // First reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(300);

    // Change parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 20);
    await halftoneGenerator.selectPattern('square');

    // Second reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(300);

    // Verify still at defaults
    const pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe(DEFAULT_PARAMS.pattern);

    const dotSize = await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue);
    expect(dotSize).toBe(DEFAULT_PARAMS.dotSize);
  });

  test('should reset pattern type to circle', async () => {
    // Change to different pattern
    await halftoneGenerator.selectPattern('hexagon');
    let pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe('hexagon');

    // Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(300);

    // Should be back to circle
    pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe('circle');
  });
});
