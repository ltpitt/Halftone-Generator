# Halftone Generator Plugin - User Guide

## What's Fixed

Your reported issue has been **RESOLVED** ✅

**Before**: Plugin showed demo mode UI and didn't generate vectors in Illustrator viewport  
**After**: Plugin properly integrates with Illustrator and generates vectors in the viewport

---

## Quick Start (After Installing Fix)

### Step 1: Create or Select Artwork
- **Option A**: Draw a shape (rectangle, circle, etc.) and fill it with a color
- **Option B**: Place an image (File > Place)
- Select the artwork

### Step 2: Open Plugin
- Go to: **Window > Extensions > Halftone Generator**
- The panel should open (no demo mode UI visible)

### Step 3: Adjust Parameters

#### Pattern Type
Choose your dot pattern:
- **Circle**: Classic halftone dots
- **Square**: Square dots
- **Diamond**: Rotated squares
- **Line**: Horizontal lines
- **Cross**: Crossed lines
- **Hexagon**: Hexagonal dots

#### Dot Parameters
- **Size** (1-50): How big each dot is
- **Spacing** (1-50): Distance between dots
- **Density** (0-100%): How packed the dots are

#### Transformation
- **Angle** (0-360°): Rotate the pattern
- **Scale X/Y** (0.1-3.0): Stretch horizontally/vertically

#### Image Adjustments
- **Contrast** (0.1-2.0): Enhance differences
- **Brightness** (-100 to 100): Make lighter/darker
- **Gamma** (0.1-3.0): Adjust midtones
- **Threshold** (0-255): Cut off darker values

#### Advanced
- **Blur** (0-10): Soften the effect
- **Noise** (0-100): Add randomness
- **Invert**: Reverse light/dark

### Step 4: Generate
- Click **"Generate Halftone"**
- Wait a few seconds
- ✅ Vectors appear in your viewport!
- ✅ New layer "Halftone Pattern" is created

---

## What You'll See

### Correct Behavior (After Fix)
```
Panel Appearance:
┌─────────────────────────┐
│ Halftone Generator      │
│ Create vector halftone  │
├─────────────────────────┤
│ Pattern Type            │
│ ○ Circle ☐ Square      │
│ ◇ Diamond  — Line       │
├─────────────────────────┤
│ Dot Parameters          │
│ Size: [====|====] 10    │
│ Spacing: [====|=] 15    │
│ Density: [=======] 100% │
├─────────────────────────┤
│ (more controls...)      │
├─────────────────────────┤
│ [Generate Halftone]     │
│ [Reset to Defaults]     │
└─────────────────────────┘

(No "LOAD IMAGE" section)
(No canvas preview)
(No "Demo Mode" text)
```

### In Illustrator Viewport
```
Before Generate:
- Your selected artwork (rectangle, image, etc.)

After Generate:
- Original artwork (unchanged)
- NEW: "Halftone Pattern" layer with vector dots
- Dots sized based on brightness of original artwork
```

---

## Tips for Best Results

### For Vector Shapes
1. **Use solid fill colors**
   - Lighter colors = More/larger dots
   - Darker colors = Fewer/smaller dots
   - Gray is perfect for testing

2. **Simple shapes work best**
   - Rectangles, circles, polygons
   - Complex paths work but take longer

3. **Adjust dot size to match shape size**
   - Small shapes: Use size 5-10
   - Large shapes: Use size 10-20

### For Raster Images
1. **Place images first** (File > Place)
   - Don't embed them

2. **Lower resolution recommended**
   - High-res images create many dots
   - May hit 5000 shape limit

3. **Adjust spacing**
   - Smaller spacing = more dots = longer generation
   - Start with spacing 15-20

### Performance Tips
1. **Start with larger spacing** (15-20)
   - Test the effect first
   - Then reduce for finer detail

2. **Reduce density** if too many dots
   - 100% = maximum dots
   - 50% = half the dots

3. **Watch the shape count**
   - Status shows "Created X shapes"
   - Limit is 5000 shapes per generation

---

## Common Issues & Solutions

### Issue: Still Shows "Demo Mode"
**Cause**: Plugin not properly installed or CSInterface not working

**Solution**:
1. Make sure you installed the UPDATED version with the fix
2. Restart Illustrator completely
3. Check that files are in correct location (see INSTALLATION.md)
4. Verify `client/lib/CSInterface.js` has the new code

### Issue: "No Object Selected" Error
**Cause**: Nothing is selected in Illustrator

**Solution**:
1. Create or place an artwork first
2. Use Selection Tool (V) to select it
3. Make sure it's highlighted
4. Then click Generate

### Issue: No Shapes Appear
**Possible Causes**:
- Shapes created outside viewport (zoom out)
- Shapes too small to see (increase size)
- Shapes are white on white background (change invert)

**Solutions**:
1. Check Layers panel for "Halftone Pattern" layer
2. Zoom out to see full extent
3. Increase "Size" parameter
4. Try "Invert" checkbox

### Issue: Pattern Looks Random
**For Vector Shapes**: This is expected - dots are sized by fill color
**For Raster Images**: Limitation - see "Known Limitations" below

**Solutions**:
- Use vector shapes with solid colors for best results
- Adjust contrast and brightness parameters
- Try different pattern types

### Issue: Generation is Slow
**Cause**: Too many shapes being created

**Solutions**:
1. Increase spacing (15-20)
2. Reduce density (50-75%)
3. Use smaller artwork
4. Increase threshold to skip darker areas

---

## Understanding the Results

### How Dot Sizing Works

#### For Vector Shapes:
```
White Fill (#FFFFFF) → Large dots
Light Gray (#CCCCCC) → Medium-large dots
Medium Gray (#808080) → Medium dots
Dark Gray (#333333) → Small dots
Black Fill (#000000) → Very small dots
```

#### For Raster Images:
- Bright areas → Larger dots
- Dark areas → Smaller dots
- Pattern varies by position
- Not exact pixel reproduction (limitation)

### Pattern Types Explained

- **Circle**: Classic comic book halftone
- **Square**: Geometric, modern look
- **Diamond**: Rotated squares, dynamic
- **Line**: Horizontal scan lines effect
- **Cross**: Grid pattern (simplified)
- **Hexagon**: Honeycomb pattern

---

## Advanced Usage

### Creating Custom Effects

1. **Duotone Effect**:
   - Generate halftone
   - Duplicate layer
   - Change color of dots
   - Offset second layer slightly

2. **Gradient Effect**:
   - Create shape with gradient fill
   - Generate halftone
   - Dots vary in size creating gradient illusion

3. **Multiple Patterns**:
   - Generate with Circle pattern
   - Hide that layer
   - Select original again
   - Generate with different pattern (Square)
   - Blend the two layers

### Editing Generated Patterns

The halftone pattern is made of **editable vector shapes**:
- Select individual dots
- Change colors
- Delete unwanted dots
- Apply effects (shadows, etc.)
- Group and transform

---

## Known Limitations

### Raster Image Accuracy
ExtendScript (Illustrator's scripting) doesn't provide direct pixel access to raster images.

**Current Behavior**:
- Creates pattern that varies by position
- Uses approximation algorithm
- Not exact pixel-for-pixel reproduction

**Best Practices**:
- Use for stylistic effects
- Don't expect photographic accuracy
- Pre-process images if needed
- Use vector shapes for precise control

### Performance Limits
- Maximum 5000 shapes per generation
- Large images with small spacing may hit limit
- Generation time increases with shape count

### Pattern Limitations
- Cross pattern is simplified (single line)
- Some patterns may need refinement
- Complex shapes take longer

---

## Demo Mode

The plugin can also run in a web browser for testing:

1. Open `client/index.html` in a browser
2. **Demo mode UI will appear**:
   - "LOAD IMAGE (DEMO MODE)" section
   - File upload button
   - Canvas preview at bottom
3. Upload an image
4. Adjust parameters
5. See instant preview

**Note**: Demo mode is for testing only - doesn't create vectors in Illustrator

---

## Getting Help

If issues persist:

1. **Check installation**: See `INSTALLATION.md`
2. **Read testing guide**: See `TESTING_NOTES.md`
3. **Review technical details**: See `FIX_SUMMARY.md`
4. **Report issues**: Include:
   - Illustrator version
   - Steps to reproduce
   - Error messages
   - Screenshots

---

## What to Expect

### First Time Using Plugin
1. Open Halftone Generator panel
2. **Should NOT see**: Demo mode UI
3. **Should see**: Pattern types, parameters, generate button
4. Create a gray rectangle
5. Select it
6. Click "Generate Halftone"
7. **Should see**: Dots appear in viewport within seconds
8. **Should see**: New layer "Halftone Pattern" in Layers panel

### Success Indicators
- ✅ Panel opens without demo mode UI
- ✅ Can adjust all parameters
- ✅ Generate button responds
- ✅ Status shows "Generating halftone pattern..."
- ✅ Status shows "Halftone generated successfully! Created X shapes"
- ✅ Vectors visible in viewport
- ✅ New layer created in Layers panel

---

## Examples

### Example 1: Simple Test
```
1. Rectangle: 200x200 points
2. Fill: Gray (#808080)
3. Parameters:
   - Pattern: Circle
   - Size: 10
   - Spacing: 15
   - Density: 100%
4. Result: Grid of uniform dots
```

### Example 2: Gradient Effect
```
1. Rectangle: 400x200 points
2. Fill: Linear gradient (black to white)
3. Parameters:
   - Pattern: Circle
   - Size: 8
   - Spacing: 12
4. Result: Dots vary from small (dark) to large (light)
```

### Example 3: Pattern Variation
```
1. Circle: 300x300 points
2. Fill: Blue (#0066CC)
3. Parameters:
   - Pattern: Hexagon
   - Size: 15
   - Spacing: 18
   - Angle: 30°
4. Result: Honeycomb pattern
```

---

## Support

For additional help, see:
- `INSTALLATION.md` - Installation instructions
- `TESTING_NOTES.md` - Comprehensive testing guide
- `FIX_SUMMARY.md` - Technical details of the fix
- `README.md` - Plugin overview
