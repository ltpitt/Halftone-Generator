# Halftone Generator - Adobe Illustrator Plugin

## Overview

This directory contains the Adobe Illustrator plugin version of the Halftone Generator. The plugin creates vector-based halftone patterns directly in Adobe Illustrator, transforming selected objects into stylized dot patterns.

## Project Status

**Current Phase**: Phase 1 Complete - Basic Halftone Generation ✅

**Status**: Working plugin with basic functionality

### What's Working ✅
- Plugin loads successfully in Illustrator
- Environment detection (CEP vs browser demo mode)
- UI panel with all pattern controls
- Basic halftone generation (grid of circles)
- Creates new layer with vector dots
- Parameter passing from UI to ExtendScript
- Error handling and status messages

### Next Steps 🚧
- Enhance pattern generation (square, diamond, hexagon, etc.)
- Implement actual image sampling
- Add intensity-based dot sizing
- Performance optimization
- Testing and refinement

See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) for the complete development roadmap.

## Features

### Pattern Types (In Development)
- ✅ Circular Dots (Basic implementation)
- 🚧 Square Dots
- 🚧 Diamond
- 🚧 Lines
- 🚧 Cross Hatch
- 🚧 Hexagon

### Controls (UI Complete)
- **Dot Parameters**: Size, Spacing, Density
- **Transformation**: Angle, Scale X, Scale Y
- **Image Adjustments**: Contrast, Brightness, Gamma, Threshold
- **Advanced Effects**: Blur, Noise, Invert

### Current Implementation
- ✅ Full UI panel with all controls
- ✅ Basic circular dot pattern generation
- ✅ Grid calculation based on spacing
- ✅ New layer creation for halftone output
- ✅ Error handling and user feedback
- 🚧 Image sampling (placeholder - uses simple gradient)
- 🚧 Multiple pattern types
- 🚧 Intensity-based dot sizing

### Key Differences from Web Version
- Output is **vector shapes** (paths) instead of raster canvas
- Works with selected Illustrator objects
- Integrates with Illustrator's undo/redo system
- Creates editable vector patterns in the document
- No real-time preview (generates on button click)

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
│       └── CSInterface.js    # Adobe CEP library
├── icons/                    # Plugin icons
├── .debug                    # Debug configuration
├── package.json              # Build configuration
└── README.md                 # This file
```

## Demo Mode 🌐

**Try the plugin without Adobe Illustrator!**

The plugin includes a **Demo Mode** that runs in any web browser, enabling:
- ✅ Full UI testing and interaction
- ✅ Image loading and halftone generation
- ✅ Real-time parameter adjustments with canvas preview
- ✅ Pattern types visualization
- ✅ Complete feature exploration

### Quick Demo

```bash
# Serve with npm script (recommended)
npm run serve

# Or manually
cd client
python3 -m http.server 8000
# Visit: http://localhost:8000
```

**Instant Preview**: Demo mode automatically loads an example image so you can immediately see halftone effects and experiment with all parameters!

**Demo vs Production**:
- **Demo Mode**: Canvas-based raster preview, image file upload, browser testing
- **Production Mode**: Vector shape creation in Illustrator, works with selected objects

This enables UI development and testing without requiring Adobe Illustrator installation.

**Note**: The demo mode shows the full feature set, but the Illustrator plugin currently implements basic circular patterns. Additional patterns will be added in future updates.

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

## Usage

### Basic Usage

1. **Install the plugin** (see [INSTALLATION.md](./INSTALLATION.md))
2. **Open Adobe Illustrator**
3. **Launch plugin**: Window → Extensions → Halftone Generator
4. **Select an object** in your document (any shape or image)
5. **Adjust parameters**:
   - Dot Size: Size of individual dots
   - Spacing: Distance between dots
   - Other parameters (currently affect demo mode only)
6. **Click "Generate"** to create halftone pattern

### What to Expect

**Current Version (v1.0 - Basic Implementation)**:
- ✅ Creates a new layer called "Halftone Pattern"
- ✅ Generates a grid of circular black dots
- ✅ Grid size based on selected object's bounds
- ✅ Spacing controlled by "Spacing" parameter
- ✅ Dot size controlled by "Dot Size" parameter
- 🚧 Other pattern types coming soon
- 🚧 Image-based intensity coming soon

**Status Message**: The plugin shows detailed information about what was created, including number of dots and grid dimensions.

### Tips
- Start with default parameters (Dot Size: 10, Spacing: 15)
- Use smaller spacing for finer patterns
- Select larger objects to see more dots
- The halftone layer is created separately from your original object
- You can delete the halftone layer and regenerate with different settings

**Quick Start**: See [QUICKSTART.md](./QUICKSTART.md) for step-by-step guide with screenshots.

## Relationship to Web Application

This plugin is a **separate, independent project** that recreates the web application's functionality for Adobe Illustrator. The web application remains unchanged and continues to serve browser users.

### Design Principles
- Same user experience as web version
- Adapted for Illustrator workflow
- Vector output instead of raster
- Professional design tool integration

**Development Status**: The plugin is in active development. Current version provides basic functionality with more features being added incrementally.

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
