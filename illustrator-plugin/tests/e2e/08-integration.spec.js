// E2E Tests - Integration Tests (End-to-End Workflows)
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { getFixturePath, PATTERN_TYPES } = require('../helpers/testUtils');

test.describe('Integration Tests', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('complete workflow: load image, adjust parameters, generate', async () => {
    // 1. Upload image
    const testImagePath = getFixturePath('test-image.jpg');
    await halftoneGenerator.uploadImage(testImagePath);
    await page.waitForTimeout(500);

    // 2. Select pattern
    await halftoneGenerator.selectPattern('hexagon');

    // 3. Adjust parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 12);
    await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, 1.5);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 60);
    await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, 1.3);

    // 4. Generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(500);

    // 5. Verify result
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);

    const pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe('hexagon');
  });

  test('workflow: change pattern multiple times and generate', async () => {
    const canvasSnapshots = [];

    for (const pattern of PATTERN_TYPES) {
      // Select pattern
      await halftoneGenerator.selectPattern(pattern);
      
      // Generate
      await halftoneGenerator.clickGenerate();
      await page.waitForTimeout(300);

      // Capture canvas
      const canvas = await halftoneGenerator.getCanvasDataURL();
      canvasSnapshots.push({ pattern, canvas });

      // Verify has content
      const hasContent = await halftoneGenerator.hasCanvasContent();
      expect(hasContent).toBe(true);
    }

    // Verify all patterns produced different outputs
    expect(canvasSnapshots.length).toBe(PATTERN_TYPES.length);
    
    // Check that at least some patterns are different
    const uniqueCanvases = new Set(canvasSnapshots.map(s => s.canvas));
    expect(uniqueCanvases.size).toBeGreaterThan(1);
  });

  test('workflow: adjust parameters, reset, adjust again', async () => {
    // 1. Adjust parameters
    await halftoneGenerator.selectPattern('square');
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 20);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 90);
    await halftoneGenerator.toggleInvert();

    // Generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);
    const canvas1 = await halftoneGenerator.getCanvasDataURL();

    // 2. Reset
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(300);

    // 3. Adjust different parameters
    await halftoneGenerator.selectPattern('diamond');
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 15);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 45);

    // Generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);
    const canvas2 = await halftoneGenerator.getCanvasDataURL();

    // Verify canvases are different
    expect(canvas1).not.toBe(canvas2);

    // Verify current parameters
    const pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe('diamond');
  });

  test('workflow: test all transformation combinations', async () => {
    const transformTests = [
      { angle: 0, scaleX: 1.0, scaleY: 1.0 },
      { angle: 45, scaleX: 1.5, scaleY: 1.0 },
      { angle: 90, scaleX: 1.0, scaleY: 1.5 },
      { angle: 180, scaleX: 2.0, scaleY: 2.0 },
      { angle: 270, scaleX: 0.5, scaleY: 0.5 }
    ];

    for (const transform of transformTests) {
      await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, transform.angle);
      await halftoneGenerator.setSliderValue(halftoneGenerator.scaleXSlider, transform.scaleX);
      await halftoneGenerator.setSliderValue(halftoneGenerator.scaleYSlider, transform.scaleY);
      
      await halftoneGenerator.clickGenerate();
      await page.waitForTimeout(300);

      const hasContent = await halftoneGenerator.hasCanvasContent();
      expect(hasContent).toBe(true);
    }
  });

  test('workflow: test all image adjustments', async () => {
    const adjustmentTests = [
      { contrast: 0.5, brightness: -50, gamma: 0.5, threshold: 50 },
      { contrast: 1.0, brightness: 0, gamma: 1.0, threshold: 128 },
      { contrast: 1.5, brightness: 50, gamma: 1.5, threshold: 200 },
      { contrast: 2.0, brightness: 100, gamma: 2.0, threshold: 255 }
    ];

    for (const adj of adjustmentTests) {
      await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, adj.contrast);
      await halftoneGenerator.setSliderValue(halftoneGenerator.brightnessSlider, adj.brightness);
      await halftoneGenerator.setSliderValue(halftoneGenerator.gammaSlider, adj.gamma);
      await halftoneGenerator.setSliderValue(halftoneGenerator.thresholdSlider, adj.threshold);
      
      await halftoneGenerator.clickGenerate();
      await page.waitForTimeout(300);

      const hasContent = await halftoneGenerator.hasCanvasContent();
      expect(hasContent).toBe(true);
    }
  });

  test('workflow: test advanced options combinations', async () => {
    // Test blur and noise
    await halftoneGenerator.setSliderValue(halftoneGenerator.blurSlider, 5);
    await halftoneGenerator.setSliderValue(halftoneGenerator.noiseSlider, 50);
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);
    
    let hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);

    // Test with invert
    await halftoneGenerator.toggleInvert();
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);
    
    hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);

    // Test max values
    await halftoneGenerator.setSliderValue(halftoneGenerator.blurSlider, 10);
    await halftoneGenerator.setSliderValue(halftoneGenerator.noiseSlider, 100);
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);
    
    hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('stress test: rapid parameter changes and generations', async () => {
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
      // Random pattern
      const patterns = ['circle', 'square', 'diamond', 'line'];
      const randomPattern = patterns[i % patterns.length];
      
      await halftoneGenerator.selectPattern(randomPattern);
      await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 10 + i * 5);
      await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, i * 45);
      await halftoneGenerator.clickGenerate();
      await page.waitForTimeout(200);
    }

    // Final check
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('workflow: complete cycle with all features', async () => {
    // 1. Start with defaults, generate
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);

    // 2. Upload custom image
    const testImagePath = getFixturePath('test-image.jpg');
    await halftoneGenerator.uploadImage(testImagePath);
    await page.waitForTimeout(300);

    // 3. Change to each pattern type and generate
    for (const pattern of ['circle', 'square', 'hexagon']) {
      await halftoneGenerator.selectPattern(pattern);
      await halftoneGenerator.clickGenerate();
      await page.waitForTimeout(200);
    }

    // 4. Adjust all parameter categories
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 15);
    await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, 2.0);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 135);
    await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, 1.5);
    await halftoneGenerator.setSliderValue(halftoneGenerator.blurSlider, 3);
    await halftoneGenerator.toggleInvert();
    
    // 5. Generate final result
    await halftoneGenerator.clickGenerate();
    await page.waitForTimeout(300);

    // 6. Verify final state
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);

    const isInverted = await halftoneGenerator.isInvertChecked();
    expect(isInverted).toBe(true);

    // 7. Reset and verify
    await halftoneGenerator.clickReset();
    await page.waitForTimeout(300);

    const pattern = await halftoneGenerator.getSelectedPattern();
    expect(pattern).toBe('circle');
  });
});
