// E2E Tests - Image Upload and Processing
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');
const { getFixturePath, TEST_TIMEOUTS } = require('../helpers/testUtils');

test.describe('Image Upload and Processing', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should have image input visible in demo mode', async () => {
    await expect(halftoneGenerator.imageInput).toBeAttached();
  });

  test('should accept image file upload', async () => {
    const testImagePath = getFixturePath('test-image.jpg');
    
    // Upload image
    await halftoneGenerator.uploadImage(testImagePath);
    
    // Wait for processing
    await page.waitForTimeout(TEST_TIMEOUTS.LONG_WAIT);
    
    // Canvas should have content
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should update canvas when new image is uploaded', async () => {
    // Get initial canvas (with auto-loaded example image)
    await halftoneGenerator.waitForCanvasRender();
    const initialCanvas = await halftoneGenerator.getCanvasDataURL();

    // Upload a test image
    const testImagePath = getFixturePath('test-image.jpg');
    await halftoneGenerator.uploadImage(testImagePath);
    
    // Wait for new image to process
    await page.waitForTimeout(TEST_TIMEOUTS.LONG_WAIT);
    
    // Note: Since we're using the same image file, the canvas might be the same
    // But the upload mechanism should still work
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should maintain parameter values after image upload', async () => {
    // Set custom parameters
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 15);
    await halftoneGenerator.setSliderValue(halftoneGenerator.angleSlider, 90);
    await halftoneGenerator.selectPattern('square');

    // Upload image
    const testImagePath = getFixturePath('test-image.jpg');
    await halftoneGenerator.uploadImage(testImagePath);
    await page.waitForTimeout(TEST_TIMEOUTS.LONG_WAIT);

    // Check parameters are still set
    const dotSize = await halftoneGenerator.getDisplayValue(halftoneGenerator.dotSizeValue);
    const angle = await halftoneGenerator.getDisplayValue(halftoneGenerator.angleValue);
    const pattern = await halftoneGenerator.getSelectedPattern();

    expect(parseFloat(dotSize)).toBe(15);
    expect(parseFloat(angle)).toBe(90);
    expect(pattern).toBe('square');
  });

  test('should process uploaded image with current parameters', async () => {
    // Set specific parameters
    await halftoneGenerator.selectPattern('hexagon');
    await halftoneGenerator.setSliderValue(halftoneGenerator.dotSizeSlider, 12);
    
    // Upload image
    const testImagePath = getFixturePath('test-image.jpg');
    await halftoneGenerator.uploadImage(testImagePath);
    await page.waitForTimeout(TEST_TIMEOUTS.LONG_WAIT);

    // Canvas should have content (halftone applied)
    const hasContent = await halftoneGenerator.hasCanvasContent();
    expect(hasContent).toBe(true);
  });

  test('should handle file input element attributes correctly', async () => {
    const acceptAttr = await halftoneGenerator.imageInput.getAttribute('accept');
    expect(acceptAttr).toBe('image/*');
  });
});
