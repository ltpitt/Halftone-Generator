// E2E Tests - UI Initialization and Mode Detection
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');

test.describe('UI Initialization', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should load the page successfully', async () => {
    await expect(page).toHaveTitle(/Halftone Generator/);
  });

  test('should display main UI elements', async () => {
    await expect(halftoneGenerator.generateButton).toBeVisible();
    await expect(halftoneGenerator.resetButton).toBeVisible();
    await expect(page.locator('h1')).toContainText('Halftone Generator');
  });

  test('should be in demo mode', async () => {
    const isDemoMode = await halftoneGenerator.isInDemoMode();
    expect(isDemoMode).toBe(true);
  });

  test('should show demo mode indicator', async () => {
    const isVisible = await halftoneGenerator.isModeIndicatorVisible();
    expect(isVisible).toBe(true);
    
    const modeText = await halftoneGenerator.getModeText();
    expect(modeText).toContain('Demo Mode');
  });

  test('should display demo-only sections', async () => {
    await expect(halftoneGenerator.demoFileSection).toBeVisible();
    await expect(halftoneGenerator.demoCanvasSection).toBeVisible();
  });

  test('should display canvas element', async () => {
    await expect(halftoneGenerator.canvas).toBeVisible();
    
    // Check canvas has width and height attributes (may be resized by CSS)
    const width = await halftoneGenerator.canvas.getAttribute('width');
    const height = await halftoneGenerator.canvas.getAttribute('height');
    expect(parseInt(width)).toBeGreaterThan(0);
    expect(parseInt(height)).toBeGreaterThan(0);
  });

  test('should auto-load example image in demo mode', async () => {
    // Wait for canvas to render
    await halftoneGenerator.waitForCanvasRender();
    
    // Check if canvas has content
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should display all pattern type options', async () => {
    await expect(halftoneGenerator.patternCircle).toBeVisible();
    await expect(halftoneGenerator.patternSquare).toBeVisible();
    await expect(halftoneGenerator.patternDiamond).toBeVisible();
    await expect(halftoneGenerator.patternLine).toBeVisible();
    await expect(halftoneGenerator.patternCross).toBeVisible();
    await expect(halftoneGenerator.patternHexagon).toBeVisible();
  });

  test('should have circle pattern selected by default', async () => {
    const selectedPattern = await halftoneGenerator.getSelectedPattern();
    expect(selectedPattern).toBe('circle');
  });

  test('should display all control sections', async () => {
    const sections = [
      'Pattern Type',
      'Dot Parameters',
      'Transformation',
      'Image Adjustments',
      'Advanced Options'
    ];

    for (const section of sections) {
      await expect(page.locator('h2', { hasText: section })).toBeVisible();
    }
  });
});
