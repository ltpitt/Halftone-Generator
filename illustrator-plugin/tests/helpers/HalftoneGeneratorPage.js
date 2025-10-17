// Page Object Model for Halftone Generator
// Follows SOLID principles: Single Responsibility - this class only handles page interactions
const { expect } = require('@playwright/test');

/**
 * Page Object Model for the Halftone Generator UI
 * Encapsulates all page interactions and element locators
 * 
 * @class HalftoneGeneratorPage
 */
class HalftoneGeneratorPage {
  /**
   * Creates an instance of HalftoneGeneratorPage
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;
    
    // Pattern type selectors
    this.patternCircle = page.locator('input[value="circle"]');
    this.patternSquare = page.locator('input[value="square"]');
    this.patternDiamond = page.locator('input[value="diamond"]');
    this.patternLine = page.locator('input[value="line"]');
    this.patternCross = page.locator('input[value="cross"]');
    this.patternHexagon = page.locator('input[value="hexagon"]');
    
    // Dot parameters
    this.dotSizeSlider = page.locator('#dotSize');
    this.dotSizeValue = page.locator('#dotSizeValue');
    this.spacingSlider = page.locator('#spacing');
    this.spacingValue = page.locator('#spacingValue');
    this.densitySlider = page.locator('#density');
    this.densityValue = page.locator('#densityValue');
    
    // Transformation controls
    this.angleSlider = page.locator('#angle');
    this.angleValue = page.locator('#angleValue');
    this.scaleXSlider = page.locator('#scaleX');
    this.scaleXValue = page.locator('#scaleXValue');
    this.scaleYSlider = page.locator('#scaleY');
    this.scaleYValue = page.locator('#scaleYValue');
    
    // Image adjustments
    this.contrastSlider = page.locator('#contrast');
    this.contrastValue = page.locator('#contrastValue');
    this.brightnessSlider = page.locator('#brightness');
    this.brightnessValue = page.locator('#brightnessValue');
    this.gammaSlider = page.locator('#gamma');
    this.gammaValue = page.locator('#gammaValue');
    this.thresholdSlider = page.locator('#threshold');
    this.thresholdValue = page.locator('#thresholdValue');
    
    // Advanced options
    this.blurSlider = page.locator('#blur');
    this.blurValue = page.locator('#blurValue');
    this.noiseSlider = page.locator('#noise');
    this.noiseValue = page.locator('#noiseValue');
    this.invertCheckbox = page.locator('#invert');
    
    // Test mode elements
    this.imageInput = page.locator('#imageInput');
    this.testFileSection = page.locator('#testFileSection');
    this.testCanvasSection = page.locator('#testCanvasSection');
    this.canvas = page.locator('#halftoneCanvas');
    this.canvasOverlay = page.locator('#canvasOverlay');
    this.outputInfo = page.locator('#outputInfo');
    
    // Mode indicator
    this.modeIndicator = page.locator('#modeIndicator');
    this.modeText = page.locator('#modeText');
    
    // Buttons
    this.generateButton = page.locator('#generateBtn');
    this.resetButton = page.locator('#resetBtn');
    
    // Status
    this.statusMessage = page.locator('#status');
  }
  
  /**
   * Navigate to the halftone generator page
   */
  async goto() {
    await this.page.goto('/');
  }
  
  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.generateButton.waitFor({ state: 'visible' });
  }
  
  /**
   * Select a pattern type
   * @param {string} pattern - Pattern type (circle, square, diamond, line, cross, hexagon)
   */
  async selectPattern(pattern) {
    const patternMap = {
      circle: this.patternCircle,
      square: this.patternSquare,
      diamond: this.patternDiamond,
      line: this.patternLine,
      cross: this.patternCross,
      hexagon: this.patternHexagon
    };
    
    const patternLocator = patternMap[pattern.toLowerCase()];
    if (!patternLocator) {
      throw new Error(`Invalid pattern type: ${pattern}`);
    }
    
    await patternLocator.check();
  }
  
  /**
   * Get the currently selected pattern
   * @returns {Promise<string>} The selected pattern value
   */
  async getSelectedPattern() {
    return await this.page.locator('input[name="pattern"]:checked').inputValue();
  }
  
  /**
   * Set a slider value
   * @param {object} slider - The slider locator
   * @param {number} value - The value to set
   */
  async setSliderValue(slider, value) {
    await slider.fill(value.toString());
  }
  
  /**
   * Get the display value of a slider
   * @param {object} valueDisplay - The value display locator
   * @returns {Promise<string>} The displayed value
   */
  async getDisplayValue(valueDisplay) {
    return await valueDisplay.textContent();
  }
  
  /**
   * Upload an image file in test mode
   * @param {string} filePath - Path to the image file
   */
  async uploadImage(filePath) {
    await this.imageInput.setInputFiles(filePath);
  }
  
  /**
   * Click the generate button
   */
  async clickGenerate() {
    await this.generateButton.click();
  }
  
  /**
   * Click the reset button
   */
  async clickReset() {
    await this.resetButton.click();
  }
  
  /**
   * Check if the page is in test mode
   * @returns {Promise<boolean>} True if in test mode
   */
  async isInTestMode() {
    const isVisible = await this.testFileSection.isVisible();
    return isVisible;
  }
  
  /**
   * Wait for canvas to be visible and have content
   */
  async waitForCanvasRender() {
    await this.canvas.waitFor({ state: 'visible' });
    // Wait a bit for canvas to render
    await this.page.waitForTimeout(500);
  }
  
  /**
   * Get canvas data URL for comparison
   * @returns {Promise<string>} Canvas data URL
   */
  async getCanvasDataURL() {
    return await this.canvas.evaluate(canvas => canvas.toDataURL());
  }
  
  /**
   * Check if canvas has been drawn on (not blank)
   * @returns {Promise<boolean>} True if canvas has content
   */
  async hasCanvasContent() {
    const isEmpty = await this.canvas.evaluate((canvas) => {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return !imageData.data.some(channel => channel !== 0);
    });
    return !isEmpty;
  }
  
  /**
   * Get status message text
   * @returns {Promise<string>} Status message
   */
  async getStatusMessage() {
    return await this.statusMessage.textContent();
  }
  
  /**
   * Wait for status message to appear
   * @param {string} expectedText - Expected text in status message (optional)
   */
  async waitForStatusMessage(expectedText = null) {
    await this.statusMessage.waitFor({ state: 'visible' });
    if (expectedText) {
      await expect(this.statusMessage).toContainText(expectedText);
    }
  }
  
  /**
   * Check if invert checkbox is checked
   * @returns {Promise<boolean>} True if checked
   */
  async isInvertChecked() {
    return await this.invertCheckbox.isChecked();
  }
  
  /**
   * Toggle invert checkbox
   */
  async toggleInvert() {
    await this.invertCheckbox.click();
  }
  
  /**
   * Get mode indicator text
   * @returns {Promise<string>} Mode text
   */
  async getModeText() {
    return await this.modeText.textContent();
  }
  
  /**
   * Check if mode indicator is visible
   * @returns {Promise<boolean>} True if visible
   */
  async isModeIndicatorVisible() {
    return await this.modeIndicator.isVisible();
  }
}

module.exports = { HalftoneGeneratorPage };
