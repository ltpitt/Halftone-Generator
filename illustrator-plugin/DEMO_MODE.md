# Demo Mode Guide

## Overview

The Halftone Generator plugin includes a **Demo Mode** that allows you to test and explore the plugin's functionality without requiring Adobe Illustrator. This mode runs entirely in a web browser and provides the same user interface and halftone generation capabilities.

## Quick Start

### Method 1: Direct File Open
```bash
# Navigate to the plugin directory
cd illustrator-plugin

# Open in your default browser
open client/index.html
```

### Method 2: Local Server (Recommended)
```bash
# Navigate to the client directory
cd illustrator-plugin/client

# Start a local web server
python3 -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

### Method 3: Using npm Scripts
```bash
# From the plugin root directory
cd illustrator-plugin

# Start development server
npm run serve

# Visit: http://localhost:8000
```

## Demo Mode Features

### ✅ What Works in Demo Mode

**Complete UI Experience**:
- Example image automatically loads for immediate testing
- All controls and sliders are fully functional  
- Real-time parameter updates with visual feedback
- Pattern type selection (Circle, Square, Diamond, Line, Cross, Hexagon)
- Advanced parameter adjustments

**Image Processing**:
- File upload for PNG, JPG, and other image formats
- Canvas-based halftone generation
- Real-time preview of halftone effects
- All image adjustments (contrast, brightness, gamma, threshold)

**Pattern Generation**:
- All 6 pattern types supported
- Rotation, scaling, and transformation effects  
- Density, spacing, and size adjustments
- Advanced effects like blur, noise, and invert

**Testing Capabilities**:
- Parameter validation and error handling
- Status messages and user feedback
- Performance testing with different image sizes
- Cross-browser compatibility testing

### ❌ What Doesn't Work in Demo Mode

**Illustrator-Specific Features**:
- Vector shape creation (demo uses canvas rendering)
- Integration with Illustrator documents
- Object selection from Illustrator artboards
- ExtendScript communication

**File System Integration**:
- Direct export to Illustrator files
- Plugin installation and management
- Illustrator's undo/redo system integration

## Mode Detection

The plugin automatically detects its environment:

**Demo Mode Indicators**:
- Blue header bar saying "Running in Demo Mode (Browser)"
- File upload section is visible
- Canvas preview area is displayed

**Illustrator Mode Indicators**:
- Green header bar saying "Running in Adobe Illustrator"  
- File upload section is hidden
- Canvas preview is hidden

## Testing Scenarios

### Basic Functionality Test
1. Open demo mode in browser
2. Verify UI loads correctly with demo mode indicator
3. Upload a test image (PNG or JPG)
4. Try different pattern types (Circle, Square, etc.)
5. Adjust parameters and observe real-time updates

### Parameter Testing
1. Test all sliders and controls
2. Verify value displays update correctly
3. Try extreme values (min/max ranges)
4. Test pattern type switching

### Image Processing Test  
1. Upload different image sizes and formats
2. Test image adjustments (contrast, brightness, etc.)
3. Verify halftone generation works with various images
4. Test error handling with invalid files

### Performance Testing
1. Upload large images and test performance
2. Try complex parameter combinations
3. Generate halftones with high density settings
4. Test responsiveness of UI during generation

## Development Benefits

**For Plugin Development**:
- Rapid UI prototyping and testing
- Parameter tuning without Illustrator
- Cross-browser compatibility validation
- Automated testing integration

**For Code Reviews**:
- Easy demonstration of functionality
- Visual validation of UI changes  
- Performance benchmarking capabilities
- Regression testing for UI components

**For Documentation**:
- Live examples for user guides
- Interactive parameter demonstrations
- Portfolio showcase capabilities
- Educational tool for halftone principles

## Automated Testing

Demo mode enables comprehensive automated testing:

```bash
# Run all tests including demo validation
npm test

# Run only demo mode tests
npm run test:demo

# Validate plugin structure  
npm run validate
```

## Browser Compatibility

Demo mode is tested and works in:
- ✅ Chrome/Chromium (Recommended)
- ✅ Safari  
- ✅ Firefox
- ✅ Edge

## Troubleshooting

**Canvas Not Appearing**:
- Check browser console for JavaScript errors
- Ensure all files are accessible (use local server)
- Verify image file formats are supported

**Upload Not Working**:
- Try different image formats (PNG, JPG recommended)
- Check file size (very large images may cause issues)
- Ensure browser has file access permissions

**Performance Issues**:
- Reduce image size for testing
- Lower density/spacing values  
- Try simpler pattern types first
- Check browser memory usage

## Next Steps

After testing in demo mode:
1. **For Users**: Install the full plugin in Illustrator ([INSTALLATION.md](./INSTALLATION.md))
2. **For Developers**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup
3. **For Testing**: Follow [TESTING.md](./TESTING.md) for comprehensive testing procedures

Demo mode provides an excellent way to explore the plugin's capabilities and ensure everything works as expected before moving to the full Illustrator integration.