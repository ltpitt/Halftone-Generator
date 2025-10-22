# 🚀 Automated Plugin Management

The Halftone Generator plugin now includes automated installation scripts that make it easy to install, update, and manage the plugin during development.

## Quick Setup

For first-time installation, just run:

```bash
npm run plugin:setup
```

This will:
- Install the plugin to Adobe Illustrator
- Enable debug mode for unsigned extensions
- Show next steps

## Available Commands

### Installation Commands

```bash
# Install plugin to Illustrator
npm run plugin:install

# Remove plugin from Illustrator  
npm run plugin:uninstall

# Clean reinstall (uninstall + install)
npm run plugin:reinstall

# Check if plugin is installed and working
npm run plugin:status

# Show all available commands
npm run plugin:help
```

### Development Commands

```bash
# Install plugin in development mode
npm run plugin:dev

# Watch files and auto-reinstall on changes
npm run plugin:watch
```

## Development Workflow

### Initial Setup
1. **Clone and install dependencies:**
   ```bash
   git clone <repository>
   cd illustrator-plugin
   npm install
   ```

2. **Install plugin:**
   ```bash
   npm run plugin:setup
   ```

3. **Restart Adobe Illustrator**

4. **Access plugin:** Window → Extensions → Halftone Generator

### Daily Development
1. **Start file watcher:**
   ```bash
   npm run plugin:watch
   ```

2. **Make changes to plugin files** (client/, host/, CSXS/)

3. **Files are automatically reinstalled** when you save

4. **Refresh Illustrator panel** or restart Illustrator to see changes

## What Happens During Installation

The automated scripts:

✅ **Copy plugin files** to Adobe's CEP extensions directory  
✅ **Enable debug mode** in system registry/preferences  
✅ **Exclude development files** (tests, node_modules, etc.)  
✅ **Verify installation** and check for required files  
✅ **Provide clear next steps** and troubleshooting info  

## Cross-Platform Support

The scripts automatically detect your operating system:

- **Windows:** Uses `%APPDATA%\Adobe\CEP\extensions` and Windows Registry
- **macOS:** Uses `~/Library/Application Support/Adobe/CEP/extensions` and defaults command

## File Watcher Features

When using `npm run plugin:watch`:

- **Automatic reinstallation** when you modify plugin files
- **Debounced updates** (waits 1 second after last change)
- **Excludes irrelevant files** (.log, .tmp, node_modules)
- **Shows which files changed** for debugging
- **Graceful shutdown** with Ctrl+C

## Manual Installation Paths

If you prefer manual installation, the plugin files go to:

**Windows:**
```
C:\Users\<Username>\AppData\Roaming\Adobe\CEP\extensions\HalftoneGenerator\
```

**macOS:**
```
~/Library/Application Support/Adobe/CEP/extensions/HalftoneGenerator/
```

## Troubleshooting

### Plugin doesn't appear in Illustrator menu
```bash
# Check installation status
npm run plugin:status

# Reinstall cleanly
npm run plugin:reinstall

# Restart Illustrator after installation
```

### Permission errors on Windows
Run PowerShell as Administrator, then:
```bash
npm run plugin:install
```

### Debug mode issues
The scripts automatically enable debug mode, but you can also do it manually:

**Windows (PowerShell as Admin):**
```powershell
reg add "HKCU\Software\Adobe\CSXS.9" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

**macOS:**
```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
```

## Development Tips

1. **Use file watcher during development** for instant updates
2. **Check plugin status** regularly to ensure proper installation
3. **Restart Illustrator** after major changes (manifest, structure)
4. **Use Chrome DevTools** at http://localhost:8092 for debugging
5. **Check CEP logs** for runtime errors:
   - Windows: `%TEMP%\csxs9-ILST.log`
   - macOS: `~/Library/Logs/CSXS/CEP9-ILST.log`