# E2E Test Suite Documentation

## Overview

This directory contains a comprehensive end-to-end (e2e) test suite for the Halftone Generator Illustrator plugin using Playwright. The tests are designed to validate the plugin's test mode functionality through automated browser testing.

## Architecture

The test suite follows **SOLID**, **DRY**, and **KISS** principles:

### SOLID Principles
- **Single Responsibility**: Each test file focuses on a specific feature area
- **Open/Closed**: Page Object Model allows extension without modification
- **Liskov Substitution**: Helper utilities are interchangeable
- **Interface Segregation**: Page objects expose only needed methods
- **Dependency Inversion**: Tests depend on abstractions (Page Object Model)

### DRY (Don't Repeat Yourself)
- Reusable Page Object Model (`HalftoneGeneratorPage.js`)
- Shared test utilities (`testUtils.js`)
- Common fixtures and constants

### KISS (Keep It Simple, Stupid)
- Clear, focused test cases
- Descriptive test names
- Simple assertions
- Easy-to-understand structure

## Directory Structure

```
tests/
├── e2e/                              # E2E test files
│   ├── 01-ui-initialization.spec.js  # UI loading and mode detection
│   ├── 02-pattern-selection.spec.js  # Pattern type selection
│   ├── 03-parameter-controls.spec.js # Slider and checkbox controls
│   ├── 04-image-upload.spec.js       # Image upload functionality
│   ├── 05-canvas-rendering.spec.js   # Canvas rendering tests
│   ├── 06-reset-functionality.spec.js# Reset button tests
│   ├── 07-generate-and-status.spec.js# Generate button and status
│   └── 08-integration.spec.js        # Full workflow integration tests
├── helpers/                          # Reusable helper code
│   ├── HalftoneGeneratorPage.js     # Page Object Model
│   └── testUtils.js                  # Utility functions and constants
└── fixtures/                         # Test data files
    └── test-image.jpg                # Sample image for testing
```

## Page Object Model

### HalftoneGeneratorPage

The `HalftoneGeneratorPage` class encapsulates all interactions with the UI:

**Key Methods:**
- `goto()` - Navigate to the page
- `selectPattern(pattern)` - Select a pattern type
- `setSliderValue(slider, value)` - Set slider values
- `uploadImage(path)` - Upload an image file
- `clickGenerate()` - Click generate button
- `clickReset()` - Click reset button
- `waitForCanvasRender()` - Wait for canvas to update
- `hasCanvasContent()` - Check if canvas has been drawn on
- `getCanvasDataURL()` - Get canvas content for comparison

## Test Files

### 01-ui-initialization.spec.js
Tests basic UI loading and initialization:
- Page loads successfully
- Test mode is detected
- All UI sections are visible
- Canvas auto-loads example image
- Default pattern is selected

### 02-pattern-selection.spec.js
Tests pattern type selection:
- All 6 pattern types can be selected
- Only one pattern is selected at a time
- Pattern changes update the canvas
- Pattern selection persists

### 03-parameter-controls.spec.js
Tests all parameter controls:
- All sliders update their display values
- Min/max constraints are respected
- Invert checkbox toggles correctly
- Canvas updates when parameters change

**Tested Sliders:**
- Dot Size (1-50)
- Spacing (0.5-3.0)
- Density (10-200)
- Angle (0-360°)
- Scale X/Y (0.1-3.0)
- Contrast (0.5-2.0)
- Brightness (-100-100)
- Gamma (0.1-3.0)
- Threshold (0-255)
- Blur (0-10)
- Noise (0-100)

### 04-image-upload.spec.js
Tests image upload functionality:
- Image input accepts files
- Canvas updates with uploaded image
- Parameters persist after upload
- Current settings apply to uploaded image

### 05-canvas-rendering.spec.js
Tests canvas rendering:
- Canvas renders with example image
- Different patterns produce different outputs
- Canvas updates with parameter changes
- Invert produces different rendering
- Extreme values are handled correctly
- Transformations work properly

### 06-reset-functionality.spec.js
Tests reset button:
- All parameters reset to defaults
- Pattern resets to circle
- Invert checkbox unchecks
- Canvas updates after reset
- Status message appears
- Multiple resets work correctly

### 07-generate-and-status.spec.js
Tests generate button and status messages:
- Generate button is visible and enabled
- Canvas updates when generated
- Works with all pattern types
- Handles multiple clicks
- Works with extreme values
- Maintains state across operations

### 08-integration.spec.js
Tests complete workflows:
- Full workflow: load → adjust → generate
- Multiple pattern changes
- Reset and re-adjust workflow
- All transformation combinations
- All image adjustment combinations
- Advanced options combinations
- Stress test with rapid changes
- Complete cycle with all features

## Running Tests

### Prerequisites
```bash
cd illustrator-plugin
npm install
```

### Run All Tests
```bash
npm test
```

### Run Only E2E Tests
```bash
npm run test:e2e
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Debug Mode
```bash
npm run test:e2e:debug
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### View Test Report
```bash
npm run test:e2e:report
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/01-ui-initialization.spec.js
```

### Run Tests Matching Pattern
```bash
npx playwright test --grep "pattern selection"
```

## Configuration

The test configuration is in `playwright.config.js`:

- **Test Directory**: `./tests/e2e`
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Base URL**: http://localhost:8765
- **Browser**: Chromium (using system Chrome when available)
- **Web Server**: Python HTTP server on port 8765

## Test Data

### Fixtures
Test fixtures are located in `tests/fixtures/`:
- `test-image.jpg` - Sample image for upload tests

### Constants
Test constants are defined in `testUtils.js`:
- `DEFAULT_PARAMS` - Default parameter values
- `PATTERN_TYPES` - All available pattern types
- `SLIDER_CONFIGS` - Configuration for each slider

## Helper Utilities

### testUtils.js

**Constants:**
- `DEFAULT_PARAMS` - Default values for all parameters
- `PATTERN_TYPES` - Array of all pattern types
- `SLIDER_CONFIGS` - Min/max/step/default for each slider

**Functions:**
- `getFixturePath(filename)` - Get path to test fixture
- `waitForCondition(condition, timeout, interval)` - Wait for custom condition
- `canvasDataEquals(url1, url2)` - Compare canvas data URLs
- `getRandomSliderValue(min, max, step)` - Generate random slider value

## Writing New Tests

### Example Test Structure

```javascript
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');

test.describe('Feature Name', () => {
  let page;
  let halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should do something specific', async () => {
    // Arrange
    await halftoneGenerator.selectPattern('circle');
    
    // Act
    await halftoneGenerator.setSliderValue(
      halftoneGenerator.dotSizeSlider, 
      15
    );
    
    // Assert
    const value = await halftoneGenerator.getDisplayValue(
      halftoneGenerator.dotSizeValue
    );
    expect(parseFloat(value)).toBe(15);
  });
});
```

### Best Practices

1. **Use Page Object Model**: Always interact through `HalftoneGeneratorPage`
2. **Descriptive Names**: Test names should describe what is being tested
3. **Single Assertion**: Each test should verify one specific behavior
4. **Wait Appropriately**: Use `waitForCanvasRender()` or specific waits
5. **Clean State**: Use `beforeEach` to ensure clean state
6. **Constants**: Use constants from `testUtils.js` for values
7. **Fixtures**: Store test data in `fixtures/` directory

## Continuous Integration

The test suite is designed to run in CI/CD environments:

- Retries failed tests automatically (2 retries on CI)
- Generates reports in multiple formats (HTML, JSON)
- Screenshots on failure
- Videos on failure
- Headless mode for CI

### GitHub Actions Example
```yaml
- name: Install dependencies
  run: cd illustrator-plugin && npm ci

- name: Install Playwright Browsers
  run: cd illustrator-plugin && npx playwright install --with-deps chromium

- name: Run E2E tests
  run: cd illustrator-plugin && npm run test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: illustrator-plugin/test-results/
```

## Troubleshooting

### Tests Fail to Start
- Ensure port 8765 is not in use
- Check Python 3 is installed
- Verify `client/index.html` exists

### Canvas Assertions Fail
- Increase timeout with `await page.waitForTimeout(1000)`
- Check if canvas rendering is complete
- Verify image has loaded

### Flaky Tests
- Add appropriate waits (`waitForCanvasRender()`)
- Use `waitFor({ state: 'visible' })` for elements
- Increase test timeout if needed

### Browser Not Found
- Install system Chrome: `npx playwright install chromium`
- Or set `channel: undefined` in config to download Playwright's browser

## Coverage

The test suite covers:

✅ **UI Initialization** (11 tests)
✅ **Pattern Selection** (6 tests)  
✅ **Parameter Controls** (18 tests)
✅ **Image Upload** (6 tests)
✅ **Canvas Rendering** (9 tests)
✅ **Reset Functionality** (10 tests)
✅ **Generate & Status** (10 tests)
✅ **Integration** (8 tests)

**Total: 78+ comprehensive tests**

## Future Enhancements

Potential improvements:
- Visual regression testing (screenshot comparison)
- Performance benchmarking tests
- Accessibility testing
- Cross-browser testing (Firefox, Safari)
- Mobile viewport testing
- Load testing with large images
- Error handling and edge cases

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Use the Page Object Model
3. Add tests to appropriate spec file or create new one
4. Update this README if adding new features
5. Ensure tests pass before submitting PR

## License

Same as the main project (MIT)
