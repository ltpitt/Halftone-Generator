# Halftone Generator

A collection of halftone generation tools that create artistic halftone patterns from images.

## 📁 Project Structure

This repository contains two separate halftone generator implementations:

### 🌐 [Web Application](./web-app/)
A browser-based halftone generator - no installation required!
- **Location**: `web-app/`
- **Type**: Static web application (HTML/CSS/JavaScript)
- **Usage**: Open `web-app/index.html` in any modern browser
- **Features**: Real-time halftone generation with Canvas API
- [View Web App Documentation →](./web-app/README.md)

### 🎨 [Adobe Illustrator Plugin](./illustrator-plugin/)
A professional plugin for creating vector halftone effects in Adobe Illustrator
- **Location**: `illustrator-plugin/`
- **Type**: Adobe CEP (Common Extensibility Platform) plugin
- **Usage**: Install as an Illustrator extension
- **Features**: Vector-based halftone patterns with full Illustrator integration
- **Status**: ✅ Working (v1.0 - Basic circular patterns, more features in development)
- [View Plugin Documentation →](./illustrator-plugin/README.md)

## 🚀 Quick Start

### Using the Web Application
```bash
# Simply open in browser - no build required!
open web-app/index.html
```

### Using the Illustrator Plugin
```bash
cd illustrator-plugin
npm install
npm run plugin:setup  # Automated installation and setup
# Restart Illustrator, then go to Window → Extensions → Halftone Generator
```

#### Available Plugin Scripts

**Installation & Management:**
- `npm run plugin:help` - Display help and usage information
- `npm run plugin:setup` - Complete installation (install + instructions)
- `npm run plugin:install` - Install plugin to CEP extensions folder
- `npm run plugin:uninstall` - Remove plugin from CEP extensions folder
- `npm run plugin:reinstall` - Uninstall then reinstall (useful after changes)
- `npm run plugin:status` - Check if plugin is installed and show file details

**Development:**
- `npm run plugin:dev` - Enable debug mode for plugin development
- `npm run plugin:watch` - Watch for changes and auto-reinstall (requires separate terminal)

**Testing:**
- `npm test` - Run all tests (validation + demo + E2E)
- `npm run validate` - Validate plugin structure and manifest
- `npm run test:demo` - Test demo mode functionality
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI
- `npm run test:e2e:debug` - Run E2E tests in debug mode

**Demo/Development Server:**
- `npm run serve` - Start local web server on port 8000 for testing UI

See the [Illustrator Plugin README](./illustrator-plugin/README.md) for detailed instructions.

## ✨ Features

Both tools provide similar halftone generation capabilities:

- **Multiple Pattern Types**: Circle, Square, Diamond, Line, Cross, Hexagon
- **Customizable Parameters**: Size, spacing, density, rotation, scaling
- **Image Adjustments**: Contrast, brightness, gamma, threshold
- **Advanced Effects**: Blur, noise, invert options

## 🛠️ Development

### Web Application
The web app is self-contained with no build process required. Simply edit the HTML, CSS, or JavaScript files and refresh your browser.

### Illustrator Plugin
The plugin includes a full test suite with CI/CD integration:

```bash
cd illustrator-plugin
npm install          # Install dependencies
npm test            # Run all tests
npm run validate    # Validate structure
npm run test:e2e    # Run E2E tests
```

## 📚 Documentation

- [AGENTS.md](./AGENTS.md) - Guidelines for AI agents working on this project
- [Web App Documentation](./web-app/README.md) - Web application details
- [Plugin Documentation](./illustrator-plugin/README.md) - Illustrator plugin details

## 🤝 Contributing

Both projects are maintained independently:
- Web app changes should be minimal and focused on bug fixes
- Plugin development is active and welcomes contributions

See individual project READMEs for specific contribution guidelines.

## 📄 License

See individual project directories for license information.