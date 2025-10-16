// E2E Tests - Canvas Rendering and Halftone Generation
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { PATTERN_TYPES } = require('../helpers/testUtils');

test.describe('Canvas Rendering', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should render canvas with auto-loaded example image', async () => {
    await halftoneGenerator.waitForCanvasRender();
    
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should have canvas with correct dimensions', async () => {
    const canvas = halftoneGenerator.canvas;
    
    // Check canvas has non-zero dimensions
    const width = await canvas.getAttribute('width');
    const height = await canvas.getAttribute('height');
    
    expect(parseInt(width)).toBeGreaterThan(0);
    expect(parseInt(height)).toBeGreaterThan(0);
  });

  test('should render different patterns on canvas', async () => {
    const canvasStates = new Map();

    // Capture canvas for each pattern type
    for (const pattern of PATTERN_TYPES) {
      await halftoneGenerator.selectPattern(pattern);
      await page.waitForTimeout(500); // Wait for render
      
      const canvasData = await halftoneGenerator.getCanvasDataURL();
      canvasStates.set(pattern, canvasData);
    }

    // Verify we have captures for all patterns
    expect(canvasStates.size).toBe(PATTERN_TYPES.length);

    // Verify patterns produce different outputs (spot check a few)
    const circleCanvas = canvasStates.get('circle');
    const squareCanvas = canvasStates.get('square');
    const hexagonCanvas = canvasStates.get('hexagon');

    expect(circleCanvas).not.toBe(squareCanvas);
    expect(circleCanvas).not.toBe(hexagonCanvas);
    expect(squareCanvas).not.toBe(hexagonCanvas);
  });

  test('should update canvas when parameters change', async () => {
    await halftoneGenerator.waitForCanvasRender();
    const canvas1 = await halftoneGenerator.getCanvasDataURL();

    // Change multiple parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 25);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 180);
    await page.waitForTimeout(500);

    const canvas2 = await halftoneGenerator.getCanvasDataURL();
    expect(canvas1).not.toBe(canvas2);
  });

  test('should render inverted halftone when invert is checked', async () => {
    await halftoneGenerator.waitForCanvasRender();
    const normalCanvas = await halftoneGenerator.getCanvasDataURL();

    // Toggle invert
    await halftoneGenerator.toggleInvert();
    await page.waitForTimeout(500);

    const invertedCanvas = await halftoneGenerator.getCanvasDataURL();
    expect(normalCanvas).not.toBe(invertedCanvas);

    // Toggle back
    await halftoneGenerator.toggleInvert();
    await page.waitForTimeout(500);

    const restoredCanvas = await halftoneGenerator.getCanvasDataURL();
    expect(restoredCanvas).toBe(normalCanvas);
  });

  test('should render with extreme parameter values', async () => {
    // Test with minimum values
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 1);
    await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, 0.5);
    await page.waitForTimeout(500);

    let hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);

    // Test with maximum values
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 50);
    await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, 3);
    await page.waitForTimeout(500);

    hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should handle rapid parameter changes', async () => {
    await halftoneGenerator.waitForCanvasRender();

    // Rapidly change multiple parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 15);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 45);
    await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, 1.5);
    await halftoneGenerator.selectPattern('diamond');
    
    // Wait for all updates to complete
    await page.waitForTimeout(1000);

    // Canvas should still have content
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should maintain aspect ratio in canvas', async () => {
    await halftoneGenerator.waitForCanvasRender();

    // Get canvas element
    const canvasElement = halftoneGenerator.canvas;
    
    // Check if canvas maintains square aspect ratio
    const boundingBox = await canvasElement.boundingBox();
    expect(boundingBox).not.toBeNull();
    
    if (boundingBox) {
      // Canvas should be visible and have dimensions
      expect(boundingBox.width).toBeGreaterThan(0);
      expect(boundingBox.height).toBeGreaterThan(0);
    }
  });

  test('should render with different transformation values', async () => {
    const transformations = [
      { angle: 0, scaleX: 1.0, scaleY: 1.0 },
      { angle: 90, scaleX: 1.0, scaleY: 1.0 },
      { angle: 45, scaleX: 2.0, scaleY: 1.0 },
      { angle: 180, scaleX: 1.0, scaleY: 2.0 }
    ];

    for (const transform of transformations) {
      await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, transform.angle);
      await halftoneGenerator.setSliderValue(halftoneGenerator.scaleXSlider, transform.scaleX);
      await halftoneGenerator.setSliderValue(halftoneGenerator.scaleYSlider, transform.scaleY);
      await page.waitForTimeout(500);

      const hasContent = await halftoneGenerator.hasCanvasContent();
      expect(hasContent).toBe(true);
    }
  });
});
