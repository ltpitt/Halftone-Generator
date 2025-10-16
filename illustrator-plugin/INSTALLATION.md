# Installation Guide - Halftone Generator Plugin for Adobe Illustrator

This guide explains how to install and test the Halftone Generator plugin in Adobe Illustrator.

## Prerequisites

- **Adobe Illustrator CC 2019 or later** (Version 23.0+)
- **Operating System**: Windows 10/11 or macOS 10.12+
- **CEP Version**: 9.0 or later (bundled with Illustrator)

## Installation Steps

### Method 1: Development Installation (Manual Copy)

This method is for development and testing without creating a ZXP package.

#### On macOS:

1. **Locate the CEP extensions folder**:
   ```bash
   ~/Library/Application Support/Adobe/CEP/extensions/
   ```

2. **Copy the plugin folder**:
   ```bash
   cp -r /path/to/illustrator-plugin ~/Library/Application\ Support/Adobe/CEP/extensions/HalftoneGenerator
   ```

3. **Enable debug mode**:
   ```bash
   defaults write com.adobe.CSXS.9 PlayerDebugMode 1
   defaults write com.adobe.CSXS.9 LogLevel 6
   ```

4. **Restart Adobe Illustrator**

#### On Windows:

1. **Locate the CEP extensions folder**:
   ```
   C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\
   ```

2. **Copy the plugin folder**:
   - Copy the entire `illustrator-plugin` folder to the extensions directory
   - Rename it to `HalftoneGenerator`

3. **Enable debug mode** (Run as Administrator):
   - Open Registry Editor (regedit)
   - Navigate to: `HKEY_CURRENT_USER\Software\Adobe\CSXS.9`
   - Create a new String Value: `PlayerDebugMode` with value `1`
   - Create a new String Value: `LogLevel` with value `6`
   - Or use PowerShell (as Administrator):
   ```powershell
   New-Item -Path "HKCU:\Software\Adobe\CSXS.9" -Force
   Set-ItemProperty -Path "HKCU:\Software\Adobe\CSXS.9" -Name "PlayerDebugMode" -Value "1"
   Set-ItemProperty -Path "HKCU:\Software\Adobe\CSXS.9" -Name "LogLevel" -Value "6"
   ```

4. **Restart Adobe Illustrator**

### Method 2: ZXP Package Installation (Future)

For production distribution, the plugin will be packaged as a ZXP file. Instructions will be provided when packaging is implemented.

## Verifying Installation

1. **Launch Adobe Illustrator**

2. **Open the Extensions menu**:
   - Go to: **Window > Extensions > Halftone Generator**

3. **The panel should appear**:
   - If successful, you'll see the Halftone Generator panel with all controls
   - If the panel doesn't appear, check the troubleshooting section below

## Testing the Plugin

### Basic Test:

1. **Create a new document** in Illustrator
2. **Place an image** or create a shape
3. **Select the object**
4. **Open the Halftone Generator panel** (Window > Extensions > Halftone Generator)
5. **Adjust parameters** as desired
6. **Click "Generate Halftone"**
7. **Check the result**: A new layer with halftone pattern should be created

### Expected Behavior:

- The panel should display all controls
- Sliders should update value displays
- Generate button should create vector shapes
- Status messages should appear
- No errors in the ExtendScript Toolkit Console

## Debugging

### Enable Chrome DevTools (Advanced):

1. **Ensure debug mode is enabled** (see installation steps above)
2. **Open the plugin** in Illustrator
3. **Open Chrome or Edge browser**
4. **Navigate to**: `http://localhost:8088`
5. **Use DevTools** to debug the panel's JavaScript

### Common Debug Locations:

- **macOS CEP Logs**: `~/Library/Logs/CSXS/CEPHtmlEngine.log`
- **Windows CEP Logs**: `%USERPROFILE%\AppData\Local\Temp\csxs{version}.log`
- **ExtendScript Console**: Launch ExtendScript Toolkit to see jsx errors

## Troubleshooting

### Panel doesn't appear in Extensions menu:

- **Check CEP folder path**: Ensure the plugin is in the correct location
- **Check folder name**: Should be a single folder without spaces
- **Verify manifest.xml**: Check for XML syntax errors
- **Check Illustrator version**: Must be CC 2019 or later
- **Restart Illustrator**: Try restarting after installation
- **Check debug mode**: Ensure PlayerDebugMode is set to 1

### Panel appears but is blank/white:

- **Enable debug mode and check Chrome DevTools** (http://localhost:8088)
- **Check browser console** for JavaScript errors
- **Verify file paths** in manifest.xml
- **Check CSInterface.js**: Ensure it's in client/lib/ folder

### "No selection" error when clicking Generate:

- **This is expected**: You must select an object first
- **Select any object** (image, shape, text) before generating
- **Try with a simple rectangle** first to test

### ExtendScript errors:

- **Check ExtendScript Toolkit Console** for error messages
- **Verify host/index.jsx** syntax
- **Check Illustrator version compatibility**

### Performance issues:

- **Reduce grid density**: Use larger spacing values
- **Limit object size**: The plugin limits to ~5000 shapes
- **Close other applications**: Free up system resources
- **Try simpler patterns**: Circle is faster than hexagon

## Uninstallation

### Manual Installation:

1. **Close Adobe Illustrator**
2. **Delete the plugin folder**:
   - macOS: `~/Library/Application Support/Adobe/CEP/extensions/HalftoneGenerator`
   - Windows: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\HalftoneGenerator`
3. **Restart Illustrator** (if needed)

### ZXP Installation (Future):

Use Adobe Extension Manager or ZXP Installer to uninstall.

## Next Steps

After successful installation:

1. **Test all pattern types** (circle, square, diamond, line, cross, hexagon)
2. **Experiment with parameters**
3. **Test with different image types**
4. **Report any issues** on the GitHub repository
5. **Provide feedback** on usability and features

## Getting Help

- **GitHub Issues**: https://github.com/ltpitt/Halftone-Generator/issues
- **Documentation**: See README.md and MIGRATION_PLAN.md
- **Testing Guide**: See TESTING.md (when available)

## System Requirements Summary

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| Illustrator | CC 2019 (23.0) | CC 2023+ |
| CEP Version | 9.0 | 11.0 |
| OS (Windows) | Windows 10 | Windows 11 |
| OS (macOS) | 10.12 Sierra | 11.0+ Big Sur |
| RAM | 4 GB | 8 GB+ |
| Storage | 50 MB | 100 MB |

## Notes

- **Icon Placeholders**: Current icon files are placeholders. Replace with actual PNG icons for production.
- **Development Version**: This is a development version. Features may be incomplete.
- **Backup Work**: Always save your work before using the plugin.
- **Performance**: Generation time depends on spacing, image size, and pattern complexity.

---

**Last Updated**: October 2025  
**Plugin Version**: 1.0.0  
**CEP Version**: 9.0
