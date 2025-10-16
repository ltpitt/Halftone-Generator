# E2E Test Suite Quick Start

## Running Tests

### All Tests
```bash
npm test                    # Run all tests (validation + e2e)
npm run test:e2e           # Run only e2e tests
```

### Interactive Mode
```bash
npm run test:e2e:ui        # Open Playwright UI for interactive testing
npm run test:e2e:headed    # Run tests with visible browser
npm run test:e2e:debug     # Run tests in debug mode
```

### View Reports
```bash
npm run test:e2e:report    # View HTML test report
```

### Run Specific Tests
```bash
# Run a specific test file
npx playwright test tests/e2e/01-ui-initialization.spec.js

# Run tests matching a pattern
npx playwright test --grep "pattern selection"

# Run a specific test by line number
npx playwright test tests/e2e/01-ui-initialization.spec.js:16
```

## Test Results

✅ **82/82 tests passing**

### Test Breakdown
- UI Initialization: 10 tests
- Pattern Selection: 6 tests  
- Parameter Controls: 18 tests
- Image Upload: 6 tests
- Canvas Rendering: 9 tests
- Reset Functionality: 10 tests
- Generate & Status: 10 tests
- Integration Tests: 8 tests

## What's Tested

### Demo Mode Features
- ✅ UI loads correctly
- ✅ Auto-loads example image
- ✅ All 6 pattern types (circle, square, diamond, line, cross, hexagon)
- ✅ All parameter controls (12 sliders + checkboxes)
- ✅ Image file upload
- ✅ Real-time canvas rendering
- ✅ Reset to defaults
- ✅ Generate button functionality
- ✅ Complete workflows

### Test Quality
- **SOLID Principles**: Page Object Model with single responsibilities
- **DRY (Don't Repeat Yourself)**: Shared utilities and constants
- **KISS (Keep It Simple)**: Clear, focused, easy-to-understand tests

## Architecture

```
tests/
├── e2e/                      # Test files
│   ├── 01-ui-initialization.spec.js
│   ├── 02-pattern-selection.spec.js
│   ├── 03-parameter-controls.spec.js
│   ├── 04-image-upload.spec.js
│   ├── 05-canvas-rendering.spec.js
│   ├── 06-reset-functionality.spec.js
│   ├── 07-generate-and-status.spec.js
│   └── 08-integration.spec.js
├── helpers/                  # Reusable code
│   ├── HalftoneGeneratorPage.js  # Page Object Model
│   └── testUtils.js              # Utilities & constants
├── fixtures/                 # Test data
│   └── test-image.jpg
└── README.md                # Full documentation
```

## CI/CD Integration

The test suite is ready for continuous integration:
- Automated retries on failure (2x)
- Screenshots on failure
- Multiple report formats (HTML, JSON, list)
- Headless execution
- Web server auto-start

## Adding New Tests

1. Create test file in `tests/e2e/`
2. Import Page Object Model
3. Use `beforeEach` for setup
4. Write descriptive test names
5. Follow existing patterns

Example:
```javascript
const { test, expect } = require('@playwright/test');
const { HalftoneGeneratorPage } = require('../helpers/HalftoneGeneratorPage');

test.describe('My Feature', () => {
  let page, halftoneGenerator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    halftoneGenerator = new HalftoneGeneratorPage(page);
    await halftoneGenerator.goto();
    await halftoneGenerator.waitForLoad();
  });

  test('should do something', async () => {
    // Your test here
  });
});
```

## Troubleshooting

### Tests Won't Start
- Check Python 3 is installed
- Verify port 8765 is not in use
- Ensure `client/index.html` exists

### Flaky Tests
- Increase timeouts if needed
- Use `waitForCanvasRender()` for async operations
- Check for race conditions

### Browser Issues
- System Chrome/Chromium is required
- Install with: `npx playwright install chromium`

## Documentation

See `tests/README.md` for comprehensive documentation including:
- Detailed test descriptions
- Helper function reference
- Writing new tests
- Best practices
- CI/CD examples

## Support

For issues or questions:
1. Check `tests/README.md`
2. Review test files for examples
3. Open an issue on GitHub
