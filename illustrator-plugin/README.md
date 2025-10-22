# Halftone Generator - Adobe Illustrator Plugin

## Overview

This directory contains the Adobe Illustrator plugin version of the Halftone Generator. The plugin brings the powerful halftone effects from the web application directly into Adobe Illustrator, allowing designers to create vector-based halftone patterns on their artwork.

## Project Status

**Current Phase**: Phase 1 Complete - Foundation and Setup ✅

**Status**: Ready for testing with Adobe Illustrator

Phase 1 (Foundation and Setup) is complete with full plugin structure, UI, and basic halftone generation. The plugin can be installed and tested in Adobe Illustrator. See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) for the complete roadmap and next phases.

## Features (Implemented)

The plugin implements all core features from the web application:

### Pattern Types ✅
- ✅ Circular Dots
- ✅ Square Dots
- ✅ Diamond
- ✅ Lines
- ✅ Cross Hatch
- ✅ Hexagon

### Controls ✅
- **Dot Parameters**: Size, Spacing, Density
- **Transformation**: Angle, Scale X, Scale Y
- **Image Adjustments**: Contrast, Brightness, Gamma, Threshold
- **Advanced Effects**: Blur, Noise, Invert

### Current Implementation Status
- ✅ Full UI panel with all controls
- ✅ Basic halftone generation with all 6 pattern types
- ✅ Grid calculation with rotation support
- ✅ Shape creation based on intensity
- ✅ Error handling and user feedback
- ⚠️ Image sampling uses placeholder algorithm (needs enhancement)
- ⚠️ Icons are placeholders (need actual PNG icons)

### Key Differences from Web Version
- Output is **vector shapes** (paths) instead of raster canvas
- Works with selected Illustrator objects (raster images or vectors)
- Integrates with Illustrator's undo/redo system
- Creates editable vector patterns in the document

## Technical Architecture

### Technology Stack
- **UI Layer**: HTML5, CSS3, JavaScript (CEP Panel)
- **Automation Layer**: ExtendScript (.jsx) for Illustrator API
- **Framework**: Adobe Common Extensibility Platform (CEP)
- **Packaging**: ZXP format for distribution

### Plugin Components
```
illustrator-plugin/
├── CSXS/
│   └── manifest.xml          # Plugin metadata and configuration
├── host/
│   └── index.jsx             # ExtendScript for Illustrator automation
├── client/
│   ├── index.html            # Panel UI
│   ├── style.css             # Panel styling
│   ├── script.js             # Panel logic
│   └── lib/
│       └── CSInterface.js    # Adobe CEP library (official from Adobe)
├── icons/                    # Plugin icons
├── .debug                    # Debug configuration
├── package.json              # Build configuration
└── README.md                 # This file
```

> **Important**: `CSInterface.js` is the official Adobe CEP library downloaded from [Adobe-CEP/CEP-Resources](https://github.com/Adobe-CEP/CEP-Resources). It should never be modified or replaced with custom code. The plugin uses CEP 9 (v9.4.0) for compatibility with Illustrator CC 2019+.

## Demo Mode 🌐

**Try the plugin without Adobe Illustrator!**

The plugin includes a **Demo Mode** that runs in any web browser, enabling:
- ✅ Full UI testing and interaction
- ✅ Image loading and halftone generation
- ✅ Real-time parameter adjustments with canvas preview
- ✅ All pattern types and effects
- ✅ Complete feature exploration

### Quick Demo

```bash
# Open demo mode in browser
open client/index.html

# Or serve with local server (recommended)
cd client
python3 -m http.server 8000
# Visit: http://localhost:8000
```

**Instant Preview**: Demo mode automatically loads an example image so you can immediately see halftone effects and experiment with all parameters!

**Demo vs Production**:
- **Demo Mode**: Canvas-based preview, image file upload, browser testing
- **Production Mode**: Vector shape creation, Illustrator object selection, full plugin functionality

This enables extensive development and testing without requiring Adobe Illustrator installation.

## Getting Started

### For Users (Testing)

**Option 1: Demo Mode** (No Illustrator Required)
```bash
open client/index.html  # Opens in default browser
```

**Option 2: Full Plugin** (Requires Illustrator)
See [QUICKSTART.md](./QUICKSTART.md) for installation and usage instructions.

Detailed guides:
- [DEMO_MODE.md](./DEMO_MODE.md) - Complete demo mode guide and testing
- [INSTALLATION.md](./INSTALLATION.md) - Complete installation guide  
- [TESTING.md](./TESTING.md) - Testing procedures including demo mode

### For Developers (Contributing)

Prerequisites:
- Node.js 12+ (for build tools)
- Git (for version control)
- Text editor (VS Code recommended)
- Adobe Illustrator CC 2019+ (for testing only, not required for development)

Quick start:
```bash
cd illustrator-plugin
npm run validate  # Validate plugin structure
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed development guidelines.

## Usage (Ready for Testing)

1. Install the plugin (see [INSTALLATION.md](./INSTALLATION.md))
2. Open Adobe Illustrator
3. Launch plugin from Window > Extensions > Halftone Generator
4. Select an object in your document (image or vector)
5. Adjust halftone parameters in the panel
6. Click "Generate" to create vector halftone effect

**Quick Start**: See [QUICKSTART.md](./QUICKSTART.md) for a quick guide.

## Relationship to Web Application

This plugin is a **separate, independent project** that recreates the web application's functionality for Adobe Illustrator. The web application remains unchanged and continues to serve browser users.

### Design Principles
- Same user experience as web version
- Adapted for Illustrator workflow
- Vector output instead of raster
- Professional design tool integration

## Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide for users and developers
- [INSTALLATION.md](./INSTALLATION.md) - Detailed installation instructions
- [TESTING.md](./TESTING.md) - Comprehensive testing procedures
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development and contribution guidelines
- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) - Complete migration plan and roadmap
- [README.md](./README.md) - This file (overview and features)

### Planned Documentation (Future)
- ARCHITECTURE.md - Technical architecture details
- API_REFERENCE.md - ExtendScript API documentation

## Contributing

This plugin is part of the Halftone-Generator project. When contributing:

1. All plugin work stays in `illustrator-plugin/` directory
2. Never modify web application files
3. Follow Adobe CEP best practices
4. Test thoroughly in Illustrator before committing
5. Update documentation with changes

## CEP Version and Compatibility

Based on [Adobe CEP Getting Started guides](https://github.com/Adobe-CEP/Getting-Started-guides):

- **Target CEP Version**: CEP 9+ (for Illustrator CC 2019 and later)
- **CEP 10**: Illustrator 2020 and later
- **CEP 11**: Illustrator 2021 and later

The plugin will target CEP 9 as the minimum to ensure broad compatibility while supporting newer versions.

## Resources

### Adobe CEP Documentation
- [CEP Getting Started Guide](https://github.com/Adobe-CEP/Getting-Started-guides) - **Primary reference for plugin development**
- [CEP Resources](https://github.com/Adobe-CEP/CEP-Resources) - Sample code and documentation
- [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md)
- [CSInterface.js Library](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/CSInterface.js)
- [ExtendScript Toolkit](https://extendscript.docsforadobe.dev/)

### Illustrator Scripting
- [Illustrator Scripting Guide](https://ai-scripting.docsforadobe.dev/)
- [Illustrator Scripting Reference](https://illustrator-scripting-guide.readthedocs.io/)

### Example Extensions
- [CEP HTML Test Extension](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_9.x/Samples/CEP_HTML_Test_Extension-9.0)
- [Illustrator Sample Extensions](https://github.com/Adobe-CEP/Samples)

## License

Same license as the main Halftone-Generator project.

## Support

For issues, questions, or contributions, please use the main project repository:
https://github.com/ltpitt/Halftone-Generator
