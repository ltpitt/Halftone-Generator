// Test Helpers - DRY principle: Reusable test utilities
const path = require('path');

/**
 * Default parameter values for the halftone generator
 */
const DEFAULT_PARAMS = {
  pattern: 'circle',
  dotSize: '8',
  spacing: '1.2',
  density: '100',
  angle: '45',
  scaleX: '1.0',
  scaleY: '1.0',
  contrast: '1.0',
  brightness: '0',
  gamma: '1.0',
  threshold: '128',
  blur: '0',
  noise: '0',
  invert: false
};

/**
 * All available pattern types
 */
const PATTERN_TYPES = ['circle', 'square', 'diamond', 'line', 'cross', 'hexagon'];

/**
 * Get path to test fixtures
 * @param {string} filename - Fixture filename
 * @returns {string} Absolute path to fixture
 */
function getFixturePath(filename) {
  return path.join(__dirname, '../fixtures', filename);
}

/**
 * Wait for a condition to be true
 * @param {Function} condition - Function that returns a boolean
 * @param {number} timeout - Maximum time to wait in ms
 * @param {number} interval - Check interval in ms
 */
async function waitForCondition(condition, timeout = 5000, interval = 100) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Compare two canvas data URLs for similarity
 * Basic comparison - in real scenarios you might use image comparison libraries
 * @param {string} dataURL1 - First canvas data URL
 * @param {string} dataURL2 - Second canvas data URL
 * @returns {boolean} True if identical
 */
function canvasDataEquals(dataURL1, dataURL2) {
  return dataURL1 === dataURL2;
}

/**
 * Generate a random value within slider range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} step - Step size
 * @returns {number} Random value
 */
function getRandomSliderValue(min, max, step = 1) {
  const steps = Math.floor((max - min) / step);
  return min + (Math.floor(Math.random() * steps) * step);
}

/**
 * Slider configurations for testing
 */
const SLIDER_CONFIGS = {
  dotSize: { min: 1, max: 50, step: 0.5, default: 8 },
  spacing: { min: 0.5, max: 3, step: 0.1, default: 1.2 },
  density: { min: 10, max: 200, step: 5, default: 100 },
  angle: { min: 0, max: 360, step: 1, default: 45 },
  scaleX: { min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
  scaleY: { min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
  contrast: { min: 0.5, max: 2.0, step: 0.1, default: 1.0 },
  brightness: { min: -100, max: 100, step: 1, default: 0 },
  gamma: { min: 0.1, max: 3.0, step: 0.1, default: 1.0 },
  threshold: { min: 0, max: 255, step: 1, default: 128 },
  blur: { min: 0, max: 10, step: 1, default: 0 },
  noise: { min: 0, max: 100, step: 1, default: 0 }
};

module.exports = {
  DEFAULT_PARAMS,
  PATTERN_TYPES,
  SLIDER_CONFIGS,
  getFixturePath,
  waitForCondition,
  canvasDataEquals,
  getRandomSliderValue
};
