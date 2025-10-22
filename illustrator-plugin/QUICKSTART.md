# Quick Start Guide - Halftone Generator Plugin

This guide helps you get started quickly with the Halftone Generator Adobe Illustrator plugin.

## For Users (Testing the Plugin)

### Step 1: Check Prerequisites
- Adobe Illustrator CC 2019 or later (tested with v27.5.0)
- Windows 10/11 or macOS 10.12+
- Node.js 12+ (for installation scripts)

### Step 2: Install the Plugin

**Automated Installation (Recommended)**:

```bash
cd illustrator-plugin
npm install              # Install dependencies
npm run plugin:install   # Install plugin to Illustrator
```

**What it does**:
- ✅ Automatically finds your CEP extensions directory
- ✅ Enables debug mode for unsigned extensions
- ✅ Copies plugin files with correct structure
- ✅ Shows installation status and next steps

**Manual Installation** (if automated fails):

See [INSTALLATION.md](./INSTALLATION.md) for detailed manual installation instructions.

### Step 3: Use the Plugin

1. **Restart Illustrator** (if it was open during installation)
2. **Open or create a document**
3. **Create a test shape**: Draw a rectangle or circle (any size)
4. **Select your shape**
5. **Open the plugin**: Window → Extensions → Halftone Generator
6. **Adjust parameters** (or use defaults):
   - Dot Size: 10
   - Spacing: 15
7. **Click "Generate Halftone"**
8. **Check the result**:
   - New layer appears: "Halftone Pattern"
   - Grid of black circular dots covers the selected area
   - Status message shows number of dots created

### Current Version Features

**What Works** ✅:
- Basic circular dot patterns
- Grid-based generation
- Parameter control (Dot Size, Spacing)
- New layer creation
- Status messages with debug info

**Coming Soon** 🚧:
- Multiple pattern types (square, diamond, hexagon)
- Image-based intensity (varying dot sizes)
- More image processing effects

### Tips for Best Results
- Start with a medium-sized rectangle (200×200 pt or larger)
- Use default settings first (Dot Size: 10, Spacing: 15)
- Check Layers panel to see "Halftone Pattern" layer
- You can delete and regenerate with different settings
- Smaller spacing = more dots = longer generation time

### Troubleshooting

**Plugin doesn't appear in menu**:
- Restart Illustrator
- Check installation with: `npm run plugin:status`
- See INSTALLATION.md for troubleshooting

**"No object selected" error**:
- Make sure you have a shape selected before clicking Generate

**Blank layer created**:
- Check status message for debug information
- Report issue with Illustrator version

### Step 4: Report Issues

Found a bug? Please report it on GitHub with:
- Your Illustrator version (shown in status message)
- Operating system
- What you tried to do
- What happened vs what you expected
- Status message text

See TESTING.md for the bug reporting template.

---

## For Developers (Contributing to the Plugin)

### Step 1: Setup Development Environment
```bash
git clone https://github.com/ltpitt/Halftone-Generator.git
cd Halftone-Generator/illustrator-plugin
npm install
```

### Step 2: Install Plugin in Development Mode
```bash
npm run plugin:dev    # One-time setup with debug tips
# OR
npm run plugin:watch  # Auto-reinstall on file changes (recommended)
```

**Development Workflow with Watcher**:
1. Run `npm run plugin:watch` in terminal (keeps running)
2. Make changes to plugin files
3. Save files
4. Watcher automatically reinstalls plugin
5. Reload or restart Illustrator panel to see changes

Should output:
```
✓ All required files and directories are present.
✓ manifest.xml appears valid
Validation complete: Plugin structure is valid.
```

### Step 3: Make Your Changes

All development happens in the `illustrator-plugin/` directory:
- **UI changes**: Edit `client/index.html`, `client/style.css`, `client/script.js`
- **Illustrator logic**: Edit `host/index.jsx`
- **Configuration**: Edit `CSXS/manifest.xml`

**Important**: Never modify web app files in the root directory!

### Step 4: Test Your Changes

**Without Illustrator** (structure validation):
```bash
npm run validate
```

**With Illustrator** (functional testing):
1. Copy plugin to CEP extensions folder
2. Restart Illustrator
3. Follow test procedures in TESTING.md

### Step 5: Submit Changes

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: Your feature description"
git push origin feature/your-feature
```

Then create a pull request on GitHub.

See CONTRIBUTING.md for detailed guidelines.

---

## File Structure Overview

```
illustrator-plugin/
├── CSXS/manifest.xml         # Plugin configuration
├── client/                   # Panel UI (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── host/index.jsx            # Illustrator automation
├── icons/                    # Panel icons (placeholders)
├── *.md                      # Documentation
└── package.json              # Build configuration
```

---

## Common Tasks

### Update Plugin Parameters

Edit `client/index.html` and `client/script.js` to add new controls.

### Add New Pattern Type

1. Add radio button in `client/index.html`
2. Add case in `host/index.jsx` `createShape()` function
3. Test the new pattern

### Change Default Values

Edit the `defaults` object in `client/script.js`.

### Debug Panel UI

1. Enable debug mode (see installation)
2. Open plugin in Illustrator
3. Open browser to http://localhost:8088
4. Use Chrome DevTools

### Debug ExtendScript

1. Launch ExtendScript Toolkit
2. Connect to Illustrator
3. Add `$.writeln()` for logging
4. Check console output

---

## Troubleshooting

**Plugin doesn't appear in menu**:
- Check plugin is in CEP extensions folder
- Verify debug mode is enabled
- Restart Illustrator
- Check manifest.xml for errors

**Panel is blank**:
- Open Chrome DevTools (http://localhost:8088)
- Check for JavaScript errors
- Verify file paths

**"No selection" error**:
- This is expected - select an object first
- Try with a simple rectangle

**Generation is slow**:
- Reduce spacing (larger number = fewer dots)
- Use simpler patterns (circle faster than hexagon)
- Work with smaller images

---

## Resources

- **README.md** - Full plugin documentation
- **INSTALLATION.md** - Detailed installation guide
- **TESTING.md** - Complete testing procedures
- **CONTRIBUTING.md** - Development guidelines
- **MIGRATION_PLAN.md** - Development roadmap

## Getting Help

- **Documentation**: Read the guides above
- **Issues**: Check existing GitHub issues
- **Questions**: Create a GitHub discussion
- **Bugs**: Report via GitHub issues

---

## Quick Reference

### Pattern Types
- Circle, Square, Diamond, Line, Cross, Hexagon

### Key Parameters
- **Size**: Dot size (1-50)
- **Spacing**: Grid spacing (5-100)
- **Angle**: Rotation (0-360°)
- **Invert**: Reverse brightness relationship

### Shortcuts
- **Reset**: Restore all default values
- **Generate**: Create halftone pattern
- Select object before generating!

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Status**: Phase 1 Complete - Ready for Testing
