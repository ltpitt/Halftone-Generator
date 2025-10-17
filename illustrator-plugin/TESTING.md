# Testing Guide - Halftone Generator Plugin

This guide provides comprehensive testing procedures for the Halftone Generator plugin for Adobe Illustrator.

## Overview

The plugin supports **dual-mode operation**:

1. **Test Mode** (Browser) - Full UI testing and halftone preview without Illustrator
2. **Production Mode** (Illustrator) - Full plugin functionality within Illustrator

This enables extensive testing without requiring Adobe Illustrator installation.

## Testing Categories

1. **Test Mode Testing** - Browser-based testing, no Illustrator required
2. **Automated Validation** - Runs in CI/CD, no Illustrator required  
3. **Manual Testing** - Requires Illustrator installation

## Test Mode Testing (Browser-Based)

### Quick Start - Test Mode

1. **Open in Browser**:
   ```bash
   # Option 1: Direct file open
   open client/index.html
   
   # Option 2: Local server (recommended)
   cd client
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Test Basic Functionality**:
   - Plugin loads with "Running in Test Mode" indicator
   - Example image automatically loads and displays halftone
   - File upload section is visible
   - Canvas preview area shows live halftone effect
   - All UI controls are interactive

3. **Test Image Processing**:
   - Example image loads automatically on startup
   - Adjust parameters to see real-time halftone updates
   - Load a custom test image (PNG/JPG) via file upload
   - Verify both auto-loaded and custom images work correctly

### Test Mode Features

**✅ What Works**:
- Complete UI functionality
- Image file loading and processing
- Real-time halftone generation on canvas
- All pattern types (circle, square, diamond, line, cross, hexagon)
- Parameter adjustments with live preview
- Error handling and status messages

**❌ What Doesn't Work**:
- Vector shape generation (canvas-only preview)
- Integration with Illustrator documents
- ExtendScript communication

### Automated Testing with Test Mode

```bash
# Run structure validation
npm run validate:structure

# Test test mode in headless browser (if configured)
npm run test:test-mode

# Run all automated tests
npm test
```

## Automated Validation (No Illustrator Required)

These tests can be run by anyone with Node.js installed:

### Structure Validation

```bash
cd illustrator-plugin
npm run validate:structure
```

**What it checks**:
- All required files and directories exist
- manifest.xml is valid XML
- File structure follows CEP standards

**Expected output**: All checks should pass with ✓ symbols

### File Syntax Validation

**HTML Validation** (if validator available):
```bash
# Using html-validator or similar tool
npx html-validator client/index.html
```

**CSS Validation** (if stylelint available):
```bash
# Using stylelint
npx stylelint client/style.css
```

**JavaScript Validation** (if eslint available):
```bash
# Using eslint
npx eslint client/script.js
```

**ExtendScript Validation**:
```bash
# Basic syntax check
node -e "require('fs').readFileSync('host/index.jsx', 'utf8')"
```

## Manual Testing (Requires Illustrator)

These tests must be performed by someone with Adobe Illustrator installed.

### Prerequisites

- Adobe Illustrator CC 2019 or later installed
- Plugin installed (see INSTALLATION.md)
- Test images and shapes prepared

### Test Environment Setup

1. **System Information** (Document before testing):
   - Operating System: _______________
   - OS Version: _______________
   - Illustrator Version: _______________
   - CEP Version: _______________

2. **Prepare Test Files**:
   - Sample raster image (JPEG, 1000x1000px)
   - Sample vector shape (simple rectangle)
   - Complex vector artwork
   - Large image (4000x4000px) for performance testing

### Test Cases

#### TC-001: Plugin Installation

**Objective**: Verify plugin appears in Illustrator

**Steps**:
1. Launch Adobe Illustrator
2. Go to Window > Extensions
3. Look for "Halftone Generator"

**Expected Result**:
- ✓ Plugin appears in Extensions menu
- ✓ Plugin name is "Halftone Generator"

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-002: Panel Display

**Objective**: Verify panel UI loads correctly

**Steps**:
1. Click Window > Extensions > Halftone Generator
2. Observe the panel

**Expected Result**:
- ✓ Panel opens in Illustrator
- ✓ All UI elements visible (header, controls, buttons)
- ✓ No blank or white screen
- ✓ No console errors (check DevTools if available)

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-003: Pattern Type Selection

**Objective**: Verify all pattern types are available

**Steps**:
1. Open the panel
2. Check Pattern Type section
3. Click each pattern option

**Expected Result**:
- ✓ All 6 pattern types visible (Circle, Square, Diamond, Line, Cross, Hexagon)
- ✓ Radio buttons respond to clicks
- ✓ Selected pattern is highlighted

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-004: Slider Controls

**Objective**: Verify all sliders work and update values

**Steps**:
1. Move each slider through its range
2. Observe value displays

**Expected Result**:
- ✓ All sliders move smoothly
- ✓ Value displays update in real-time
- ✓ Values are within expected ranges

**Sliders to test**:
- [ ] Dot Size (1-50)
- [ ] Spacing (5-100)
- [ ] Density (0.1-2.0)
- [ ] Angle (0-360°)
- [ ] Scale X (0.1-3.0)
- [ ] Scale Y (0.1-3.0)
- [ ] Contrast (0.5-2.0)
- [ ] Brightness (-100-100)
- [ ] Gamma (0.1-3.0)
- [ ] Threshold (0-255)
- [ ] Blur (0-10)
- [ ] Noise (0-100)

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-005: No Selection Error

**Objective**: Verify error handling when no object is selected

**Steps**:
1. Create new document
2. Ensure nothing is selected
3. Click "Generate Halftone"

**Expected Result**:
- ✓ Error message appears
- ✓ Message says "No object selected"
- ✓ No crash or freeze

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-006: Circle Pattern Generation

**Objective**: Verify circle pattern generates correctly

**Steps**:
1. Create a document
2. Place a test image or create a rectangle
3. Select the object
4. Set pattern to "Circle"
5. Use default parameters (Size: 10, Spacing: 15)
6. Click "Generate Halftone"

**Expected Result**:
- ✓ New layer "Halftone Pattern" created
- ✓ Circular dots visible
- ✓ Dots vary in size (halftone effect)
- ✓ Pattern covers the selected area
- ✓ Success message shows shape count
- ✓ Generation completes in reasonable time (<30s)

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-007: Square Pattern Generation

**Objective**: Verify square pattern generates correctly

**Steps**:
1. Select an object
2. Set pattern to "Square"
3. Click "Generate Halftone"

**Expected Result**:
- ✓ Square shapes created
- ✓ Halftone effect visible
- ✓ Shapes are actual rectangles

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-008: Diamond Pattern Generation

**Objective**: Verify diamond pattern generates correctly

**Steps**:
1. Select an object
2. Set pattern to "Diamond"
3. Click "Generate Halftone"

**Expected Result**:
- ✓ Diamond (rotated square) shapes created
- ✓ 45° rotation applied
- ✓ Halftone effect visible

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-009: Line Pattern Generation

**Objective**: Verify line pattern generates correctly

**Steps**:
1. Select an object
2. Set pattern to "Line"
3. Click "Generate Halftone"

**Expected Result**:
- ✓ Horizontal lines created
- ✓ Line thickness varies with intensity
- ✓ Halftone effect visible

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-010: Cross Pattern Generation

**Objective**: Verify cross pattern generates correctly

**Steps**:
1. Select an object
2. Set pattern to "Cross"
3. Click "Generate Halftone"

**Expected Result**:
- ✓ Cross shapes created
- ✓ Halftone effect visible

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-011: Hexagon Pattern Generation

**Objective**: Verify hexagon pattern generates correctly

**Steps**:
1. Select an object
2. Set pattern to "Hexagon"
3. Click "Generate Halftone"

**Expected Result**:
- ✓ Hexagonal shapes created
- ✓ Regular hexagons (6 sides)
- ✓ Halftone effect visible

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-012: Angle Rotation

**Objective**: Verify angle parameter rotates pattern

**Steps**:
1. Select object, set Circle pattern
2. Set Angle to 0°, generate
3. Undo
4. Set Angle to 45°, generate
5. Compare results

**Expected Result**:
- ✓ Pattern rotates by specified angle
- ✓ 45° rotation is visibly different from 0°
- ✓ Rotation is clockwise

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-013: Scale X/Y

**Objective**: Verify scale parameters stretch shapes

**Steps**:
1. Select object, Circle pattern
2. Set Scale X to 2.0, Scale Y to 1.0
3. Generate

**Expected Result**:
- ✓ Shapes stretched horizontally (ellipses, not circles)
- ✓ Aspect ratio changed
- ✓ Halftone effect maintained

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-014: Invert Checkbox

**Objective**: Verify invert inverts brightness relationship

**Steps**:
1. Generate with Invert unchecked, note result
2. Undo
3. Check Invert checkbox
4. Generate again, compare

**Expected Result**:
- ✓ Dark areas become light and vice versa
- ✓ Large dots where small dots were before
- ✓ Inverse halftone effect

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-015: Reset Button

**Objective**: Verify reset button restores defaults

**Steps**:
1. Change multiple parameters
2. Click "Reset to Defaults"

**Expected Result**:
- ✓ All sliders return to default values
- ✓ Pattern type returns to Circle
- ✓ Invert unchecked
- ✓ Success message appears

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-016: Performance - Small Image

**Objective**: Test performance with standard image

**Steps**:
1. Use 1000x1000px image
2. Default parameters (Spacing: 15)
3. Circle pattern
4. Generate and time

**Expected Result**:
- ✓ Completes in under 15 seconds
- ✓ No freeze or crash
- ✓ UI remains responsive

**Time**: _________ seconds

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-017: Performance - Large Image

**Objective**: Test performance with large image

**Steps**:
1. Use 4000x4000px image
2. Default parameters
3. Generate and time

**Expected Result**:
- ✓ Completes in under 60 seconds
- ✓ Progress updates visible (if implemented)
- ✓ No crash

**Time**: _________ seconds

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-018: Performance - Dense Grid

**Objective**: Test performance with small spacing

**Steps**:
1. Use standard image
2. Set Spacing to 5 (very dense)
3. Generate

**Expected Result**:
- ✓ Plugin handles dense grid (may be slow)
- ✓ Shape limit enforced (~5000 shapes max)
- ✓ No crash or freeze

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-019: Multiple Generations

**Objective**: Verify plugin can generate multiple times

**Steps**:
1. Generate halftone once
2. Without undo, generate again with different parameters
3. Repeat 3-5 times

**Expected Result**:
- ✓ Each generation creates new layer
- ✓ No performance degradation
- ✓ No memory leaks (watch Activity Monitor/Task Manager)

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

#### TC-020: Different Object Types

**Objective**: Test with various object types

**Steps**:
Test generation with:
1. Raster image (placed JPEG/PNG)
2. Simple rectangle shape
3. Complex vector path
4. Text object (converted to outlines)

**Expected Result**:
- ✓ All object types work or show appropriate error
- ✓ Pattern dimensions match object bounds

**Status**: [ ] Pass [ ] Fail

**Notes**: _______________________

---

## Regression Testing

When making changes, re-run critical test cases:
- TC-006 (Circle Pattern)
- TC-015 (Reset Button)
- TC-016 (Performance)

## Bug Reporting Template

When reporting issues, include:

```
**Bug Title**: Brief description

**Environment**:
- OS: 
- Illustrator Version:
- Plugin Version:

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots/Videos**: (if applicable)

**Console Errors**: (from DevTools or ExtendScript console)

**Workaround**: (if found)
```

## Performance Benchmarks

Target benchmarks for acceptable performance:

| Scenario | Target Time | Acceptable Time |
|----------|-------------|-----------------|
| 1000x1000px, Spacing 15 | <10s | <20s |
| 2000x2000px, Spacing 15 | <20s | <40s |
| 4000x4000px, Spacing 15 | <30s | <60s |
| Dense (Spacing 5) | <30s | <60s |

## Test Completion Checklist

Before marking testing complete:

- [ ] All automated validation passes
- [ ] All 6 pattern types tested
- [ ] All parameters tested (sliders, checkboxes)
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Multiple generations work
- [ ] Reset functionality works
- [ ] No memory leaks observed
- [ ] No console errors
- [ ] Documentation accurate
- [ ] Installation instructions work

## Reporting Results

After testing, create a summary:

1. **Overall Status**: Pass/Fail/Partial
2. **Test Cases Passed**: ____ / 20
3. **Critical Issues**: (list any blockers)
4. **Minor Issues**: (list non-blockers)
5. **Performance Notes**:
6. **Recommendations**:

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Tested By**: _______________  
**Test Date**: _______________
