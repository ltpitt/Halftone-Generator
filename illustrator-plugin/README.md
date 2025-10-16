# Halftone Generator - Adobe Illustrator Plugin

## Overview

This directory contains the Adobe Illustrator plugin version of the Halftone Generator. The plugin brings the powerful halftone effects from the web application directly into Adobe Illustrator, allowing designers to create vector-based halftone patterns on their artwork.

## Project Status

**Current Phase**: Planning and Architecture Design

This plugin is currently in the planning phase. See [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) for the complete roadmap and technical details.

## Features (Planned)

The plugin will replicate all features from the web application:

### Pattern Types
- Circular Dots
- Square Dots
- Diamond
- Lines
- Cross Hatch
- Hexagon

### Controls
- **Dot Parameters**: Size, Spacing, Density
- **Transformation**: Angle, Scale X, Scale Y
- **Image Adjustments**: Contrast, Brightness, Gamma, Threshold
- **Advanced Effects**: Blur, Noise, Invert

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
│       └── CSInterface.js    # Adobe CEP library
├── icons/                    # Plugin icons
├── .debug                    # Debug configuration
├── package.json              # Build configuration
└── README.md                 # This file
```

## Development Setup (Future)

Prerequisites:
- Adobe Illustrator CC 2015 or later
- Node.js (for build tools)
- ZXP Installer (for testing)

Installation steps will be provided when development begins.

## Usage (Planned)

1. Open Adobe Illustrator
2. Launch plugin from Window > Extensions > Halftone Generator
3. Select an object in your document
4. Adjust halftone parameters in the panel
5. Click "Generate" to create vector halftone effect

## Relationship to Web Application

This plugin is a **separate, independent project** that recreates the web application's functionality for Adobe Illustrator. The web application remains unchanged and continues to serve browser users.

### Design Principles
- Same user experience as web version
- Adapted for Illustrator workflow
- Vector output instead of raster
- Professional design tool integration

## Documentation

- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) - Complete migration plan and roadmap
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture (to be created)
- [API_REFERENCE.md](./API_REFERENCE.md) - ExtendScript API documentation (to be created)

## Contributing

This plugin is part of the Halftone-Generator project. When contributing:

1. All plugin work stays in `illustrator-plugin/` directory
2. Never modify web application files
3. Follow Adobe CEP best practices
4. Test thoroughly in Illustrator before committing
5. Update documentation with changes

## Resources

### Adobe CEP Documentation
- [CEP Getting Started Guide](https://github.com/Adobe-CEP/Getting-Started-guides)
- [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md)
- [ExtendScript Toolkit](https://extendscript.docsforadobe.dev/)

### Illustrator Scripting
- [Illustrator Scripting Guide](https://ai-scripting.docsforadobe.dev/)
- [Illustrator Scripting Reference](https://illustrator-scripting-guide.readthedocs.io/)

## License

Same license as the main Halftone-Generator project.

## Support

For issues, questions, or contributions, please use the main project repository:
https://github.com/ltpitt/Halftone-Generator
