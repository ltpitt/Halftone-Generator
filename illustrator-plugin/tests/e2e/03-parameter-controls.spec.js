// E2E Tests - Parameter Controls (Sliders and Checkboxes)
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { DEFAULT_PARAMS, SLIDER_CONFIGS, TEST_TIMEOUTS } = require('../helpers/testUtils');

test.describe('Parameter Controls', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test.describe('Slider Controls', () => {
    test('should display initial values on load (from HTML)', async () => {
      // These are the initial values set in the HTML, not the reset defaults
      expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue)).toBe('8');
      expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.spacingValue)).toBe('1.2');
      expect(await halftoneGenerator.getDisplayValue(halftoneGenerator.densityValue)).toBe('100');
      // Angle includes degree symbol
      const angleText = await halftoneGenerator.getDisplayValue(halftoneGenerator.angleValue);
      expect(angleText).toContain('45');
    });

    test('should update dot size slider and display value', async () => {
      const newValue = 25;
      await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update spacing slider and display value', async () => {
      const newValue = 2.5;
      await halftoneGenerator.setSliderValue(halftoneGenerator.spacingSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.spacingValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update density slider and display value', async () => {
      const newValue = 150;
      await halftoneGenerator.setSliderValue(halftoneGenerator.densitySlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.densityValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update angle slider and display value', async () => {
      const newValue = 180;
      await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.angleValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update scale X slider and display value', async () => {
      const newValue = 2.5;
      await halftoneGenerator.setSliderValue(halftoneGenerator.scaleXSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.scaleXValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update scale Y slider and display value', async () => {
      const newValue = 1.5;
      await halftoneGenerator.setSliderValue(halftoneGenerator.scaleYSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.scaleYValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update contrast slider and display value', async () => {
      const newValue = 1.8;
      await halftoneGenerator.setSliderValue(halftoneGenerator.contrastSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.contrastValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update brightness slider and display value', async () => {
      const newValue = 50;
      await halftoneGenerator.setSliderValue(halftoneGenerator.brightnessSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.brightnessValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update gamma slider and display value', async () => {
      const newValue = 2.0;
      await halftoneGenerator.setSliderValue(halftoneGenerator.gammaSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.gammaValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update threshold slider and display value', async () => {
      const newValue = 200;
      await halftoneGenerator.setSliderValue(halftoneGenerator.thresholdSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.thresholdValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update blur slider and display value', async () => {
      const newValue = 5;
      await halftoneGenerator.setSliderValue(halftoneGenerator.blurSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.blurValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should update noise slider and display value', async () => {
      const newValue = 75;
      await halftoneGenerator.setSliderValue(halftoneGenerator.noiseSlider, newValue);
      
      const displayValue = await halftoneGenerator.getDisplayValue(halftoneGenerator.noiseValue);
      expect(parseFloat(displayValue)).toBe(newValue);
    });

    test('should respect slider min/max constraints', async () => {
      // Test dot size min value
      await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, SLIDER_CONFIGS.dotSize.min);
      const minValue = await halftoneGenerator.dotSizeSlider.inputValue();
      expect(parseFloat(minValue)).toBe(SLIDER_CONFIGS.dotSize.min);

      // Test dot size max value
      await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, SLIDER_CONFIGS.dotSize.max);
      const maxValue = await halftoneGenerator.dotSizeSlider.inputValue();
      expect(parseFloat(maxValue)).toBe(SLIDER_CONFIGS.dotSize.max);
    });
  });

  test.describe('Checkbox Controls', () => {
    test('should have invert checkbox unchecked by default', async () => {
      const isChecked = await halftoneGenerator.isInvertChecked();
      expect(isChecked).toBe(false);
    });

    test('should toggle invert checkbox', async () => {
      // Initially unchecked
      let isChecked = await halftoneGenerator.isInvertChecked();
      expect(isChecked).toBe(false);

      // Click to check
      await halftoneGenerator.toggleInvert();
      isChecked = await halftoneGenerator.isInvertChecked();
      expect(isChecked).toBe(true);

      // Click to uncheck
      await halftoneGenerator.toggleInvert();
      isChecked = await halftoneGenerator.isInvertChecked();
      expect(isChecked).toBe(false);
    });
  });

  test.describe('Real-time Canvas Updates', () => {
    test('should update canvas when slider values change', async () => {
      // Get initial canvas state
      await halftoneGenerator.waitForCanvasRender();
      const initialCanvas = await halftoneGenerator.getCanvasDataURL();

      // Change dot size
      await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 20);
      await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);

      // Canvas should have changed
      const updatedCanvas = await halftoneGenerator.getCanvasDataURL();
      expect(initialCanvas).not.toBe(updatedCanvas);
    });

    test('should update canvas when invert is toggled', async () => {
      // Get initial canvas state
      await halftoneGenerator.waitForCanvasRender();
      const initialCanvas = await halftoneGenerator.getCanvasDataURL();

      // Toggle invert
      await halftoneGenerator.toggleInvert();
      await page.waitForTimeout(TEST_TIMEOUTS.STANDARD_WAIT);

      // Canvas should have changed
      const invertedCanvas = await halftoneGenerator.getCanvasDataURL();
      expect(initialCanvas).not.toBe(invertedCanvas);
    });
  });
});
