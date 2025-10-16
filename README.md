# Adobe Illustrator Halftone Plugin

## Goal

The primary goal of this project is to create an Adobe Illustrator plugin that replicates the functionality of a web-based halftone generator. The plugin should allow a user to select an image or vector object within Illustrator and apply a configurable vector-based halftone effect to it.

## Core Functionality to Implement

The plugin's UI and logic should be based on the features from the `Halftone-Generator_OLD` project.

### UI Controls:
- **Source Selection**: A way to target the selected object(s) in Illustrator.
- **Pattern Type**: Radio buttons or a dropdown for: Circle, Square, Diamond, Line, Cross, Hexagon.
- **Dot Parameters**:
    - **Size**: Slider to control the maximum size of the pattern elements.
    - **Spacing**: Slider to control the grid spacing between elements.
    - **Density**: Slider to control the overall effect intensity.
- **Transformation**:
    - **Angle**: Slider to rotate the halftone grid.
    - **Scale X / Scale Y**: Sliders to stretch the pattern elements.
- **Image Adjustments**:
    - **Contrast, Brightness, Gamma, Threshold**: Sliders to preprocess the source image data.
- **Advanced Options**:
    - **Blur, Noise**: Sliders for advanced effects.
    - **Invert**: A checkbox to invert the relationship between brightness and dot size.
- **Actions**:
    - A "Generate" button to create the vector halftone pattern.
    - A "Reset" button to clear the settings.

## Technical Requirements

- The plugin must be built using the Adobe CEP framework (HTML, CSS, JavaScript).
- The output must be **vector shapes** (e.g., paths, compound paths) in the active Illustrator document, not a raster image.
- The plugin needs to read pixel data from a selected raster image or rasterize a selected vector object to get the brightness values needed for the halftone calculation.
- The ExtendScript part (`.jsx`) will handle the Illustrator-specific logic, such as creating shapes, while the HTML/JS part will manage the UI panel.

## Continuous Integration

This project uses GitHub Actions for automated testing and quality assurance. The CI workflow runs automatically on:
- Pull requests to main/master branches
- Pushes to main/master branches

### CI Jobs

The CI pipeline includes three parallel test jobs:

1. **Validate Plugin Structure** - Ensures all required files and proper structure
2. **Test Demo Mode** - Validates demo mode functionality
3. **E2E Tests** - Runs Playwright end-to-end tests

All jobs must pass before a pull request can be merged. Test results and reports are automatically uploaded as artifacts for review.

### Running Tests Locally

To run the complete test suite:

```bash
cd illustrator-plugin
npm install
npm test
```

Individual test suites can be run with:
- `npm run validate` - Structure validation
- `npm run test:demo` - Demo mode tests
- `npm run test:e2e` - E2E tests with Playwright