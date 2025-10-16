# Quick Start Guide - Halftone Generator Plugin

This guide helps you get started quickly with the Halftone Generator Adobe Illustrator plugin.

## For Users (Testing the Plugin)

### Step 1: Check Prerequisites
- Adobe Illustrator CC 2019 or later
- Windows 10/11 or macOS 10.12+

### Step 2: Install the Plugin

**macOS**:
```bash
# Copy plugin to CEP extensions folder
cp -r illustrator-plugin ~/Library/Application\ Support/Adobe/CEP/extensions/HalftoneGenerator

# Enable debug mode
defaults write com.adobe.CSXS.9 PlayerDebugMode 1

# Restart Illustrator
```

**Windows** (Run PowerShell as Administrator):
```powershell
# Copy plugin to CEP extensions folder
Copy-Item -Recurse illustrator-plugin $env:APPDATA\Adobe\CEP\extensions\HalftoneGenerator

# Enable debug mode
New-Item -Path "HKCU:\Software\Adobe\CSXS.9" -Force
Set-ItemProperty -Path "HKCU:\Software\Adobe\CSXS.9" -Name "PlayerDebugMode" -Value "1"

# Restart Illustrator
```

### Step 3: Use the Plugin

1. **Open Illustrator** and create/open a document
2. **Go to Window > Extensions > Halftone Generator**
3. **Place an image** or create a shape
4. **Select the object**
5. **Adjust parameters** in the panel
6. **Click "Generate Halftone"**
7. **See the result** - a new layer with halftone pattern!

### Step 4: Report Issues

Found a bug? Please report it on GitHub with:
- Your Illustrator version
- Operating system
- Steps to reproduce
- Screenshots if applicable

See TESTING.md for the bug reporting template.

---

## For Developers (Contributing to the Plugin)

### Step 1: Clone Repository
```bash
git clone https://github.com/ltpitt/Halftone-Generator.git
cd Halftone-Generator/illustrator-plugin
```

### Step 2: Validate Structure
```bash
npm run validate
```

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
