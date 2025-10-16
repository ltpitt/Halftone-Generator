# Installation Guide - Halftone Generator Plugin for Adobe Illustrator

This guide explains how to install and test the Halftone Generator plugin in Adobe Illustrator.

## Quick Summary

**What you need to do**:
1. 📁 Copy the `illustrator-plugin` folder (NOT zip it)
2. 📂 Paste it into Adobe's CEP extensions folder
3. ✏️ Rename it to `HalftoneGenerator`
4. ⚙️ Enable debug mode (to allow unsigned extensions)
5. 🔄 Restart Illustrator
6. ✅ Access via Window → Extensions → Halftone Generator

**Important**: The plugin remains as a folder structure. Do NOT zip or compress it.

## Prerequisites

- **Adobe Illustrator CC 2019 or later** (Version 23.0+)
- **Operating System**: Windows 10/11 or macOS 10.12+
- **CEP Version**: 9.0 or later (bundled with Illustrator)

## Installation Steps

### Overview

The plugin files need to be copied (not zipped, not moved - **copied**) to Adobe Illustrator's CEP extensions folder. The plugin should remain as a folder structure, not compressed. Follow the platform-specific instructions below.

---

### Method 1: Development Installation (Manual Copy)

This method is for development and testing without creating a ZXP package. **No zipping required** - you simply copy the folder.

---

#### 📱 On macOS:

##### Step 1: Locate the Plugin Folder

First, find where you cloned/downloaded this repository. The plugin files are in:
```
Halftone-Generator/illustrator-plugin/
```

This folder contains:
- `CSXS/` folder
- `client/` folder
- `host/` folder
- `icons/` folder
- `.debug` file
- Other files

##### Step 2: Find the CEP Extensions Folder

Open **Finder** and navigate to the CEP extensions folder:

**Path**: `~/Library/Application Support/Adobe/CEP/extensions/`

**How to get there**:
1. In Finder, press **Cmd + Shift + G** (Go to Folder)
2. Paste: `~/Library/Application Support/Adobe/CEP/extensions/`
3. Press **Enter**

**If the folder doesn't exist**, create it:
```bash
mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions/
```

##### Step 3: Copy the Plugin Files

**Option A: Using Finder (Visual)**:
1. Open two Finder windows side by side
2. In one window, navigate to `Halftone-Generator/illustrator-plugin/`
3. In the other window, show the CEP extensions folder (from Step 2)
4. **Drag and drop** the entire `illustrator-plugin` folder into the extensions folder while holding **Option key** (this creates a copy)
5. **Rename** the copied folder from `illustrator-plugin` to `HalftoneGenerator` (no spaces, no hyphens)

**Option B: Using Terminal**:
```bash
# Navigate to the repository
cd /path/to/Halftone-Generator

# Copy the plugin folder
cp -r illustrator-plugin ~/Library/Application\ Support/Adobe/CEP/extensions/HalftoneGenerator
```

**After copying, the structure should be**:
```
~/Library/Application Support/Adobe/CEP/extensions/HalftoneGenerator/
├── CSXS/
├── client/
├── host/
├── icons/
├── scripts/
├── .debug
└── [other files]
```

##### Step 4: Enable Debug Mode

Open **Terminal** and run these commands:

```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
defaults write com.adobe.CSXS.9 LogLevel 6
```

**What this does**: Allows Illustrator to load unsigned extensions (required for development).

##### Step 5: Verify Installation

```bash
# Check if folder exists
ls -la ~/Library/Application\ Support/Adobe/CEP/extensions/HalftoneGenerator/

# You should see CSXS/, client/, host/, etc.
```

##### Step 6: Restart Adobe Illustrator

1. **Quit** Illustrator completely (Cmd + Q)
2. **Relaunch** Illustrator
3. Go to **Window → Extensions → Halftone Generator**

---

#### 🪟 On Windows:

##### Step 1: Locate the Plugin Folder

First, find where you cloned/downloaded this repository. The plugin files are in:
```
Halftone-Generator\illustrator-plugin\
```

This folder contains:
- `CSXS\` folder
- `client\` folder
- `host\` folder
- `icons\` folder
- `.debug` file
- Other files

##### Step 2: Find the CEP Extensions Folder

Open **File Explorer** and navigate to:

**Path**: `C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\`

**How to get there**:
1. Press **Windows + R** to open Run dialog
2. Type: `%APPDATA%\Adobe\CEP\extensions`
3. Press **Enter**

**If the folder doesn't exist**:
1. Navigate to `%APPDATA%\Adobe\`
2. Create a new folder called `CEP`
3. Inside `CEP`, create a new folder called `extensions`

##### Step 3: Copy the Plugin Files

**Option A: Using File Explorer (Visual)**:
1. Open **File Explorer** and navigate to `Halftone-Generator\illustrator-plugin\`
2. Select the entire `illustrator-plugin` folder
3. Press **Ctrl + C** to copy
4. Navigate to `%APPDATA%\Adobe\CEP\extensions\`
5. Press **Ctrl + V** to paste
6. **Rename** the folder from `illustrator-plugin` to `HalftoneGenerator` (no spaces, no hyphens)

**Option B: Using PowerShell**:
```powershell
# Navigate to the repository
cd C:\path\to\Halftone-Generator

# Copy the plugin folder
Copy-Item -Recurse illustrator-plugin $env:APPDATA\Adobe\CEP\extensions\HalftoneGenerator
```

**After copying, the structure should be**:
```
C:\Users\<YourUsername>\AppData\Roaming\Adobe\CEP\extensions\HalftoneGenerator\
├── CSXS\
├── client\
├── host\
├── icons\
├── scripts\
├── .debug
└── [other files]
```

##### Step 4: Enable Debug Mode

**Option A: Using PowerShell (Recommended)**:
1. **Right-click** on PowerShell and select **"Run as Administrator"**
2. Run these commands:

```powershell
New-Item -Path "HKCU:\Software\Adobe\CSXS.9" -Force
Set-ItemProperty -Path "HKCU:\Software\Adobe\CSXS.9" -Name "PlayerDebugMode" -Value "1"
Set-ItemProperty -Path "HKCU:\Software\Adobe\CSXS.9" -Name "LogLevel" -Value "6"
```

**Option B: Using Registry Editor (Manual)**:
1. Press **Windows + R**, type `regedit`, press **Enter**
2. Navigate to: `HKEY_CURRENT_USER\Software\Adobe\`
3. If `CSXS.9` folder doesn't exist, create it:
   - Right-click on `Adobe` → New → Key
   - Name it `CSXS.9`
4. Right-click on `CSXS.9` → New → String Value
5. Name it `PlayerDebugMode`, set value to `1`
6. Create another String Value named `LogLevel`, set value to `6`

**What this does**: Allows Illustrator to load unsigned extensions (required for development).

##### Step 5: Verify Installation

Open **PowerShell** or **Command Prompt** and run:

```powershell
dir $env:APPDATA\Adobe\CEP\extensions\HalftoneGenerator
```

You should see the plugin files (CSXS, client, host, etc.)

##### Step 6: Restart Adobe Illustrator

1. **Close** Illustrator completely
2. **Relaunch** Illustrator
3. Go to **Window → Extensions → Halftone Generator**

---

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

### Common Installation Issues

#### "I can't find the CEP extensions folder"

**On macOS**:
- The folder is hidden by default. Use Cmd + Shift + G in Finder and paste the path
- If it doesn't exist, create it: `mkdir -p ~/Library/Application\ Support/Adobe/CEP/extensions/`

**On Windows**:
- The AppData folder is hidden by default. Type `%APPDATA%` in the Run dialog (Windows + R)
- If CEP/extensions doesn't exist, create both folders manually

#### "I copied the files but the extension doesn't appear"

Check these in order:
1. **Folder name**: Must be exactly `HalftoneGenerator` (no spaces, capital H, capital G)
2. **Folder location**: Must be in `.../CEP/extensions/HalftoneGenerator/` not nested deeper
3. **Folder structure**: Inside `HalftoneGenerator` you should see CSXS, client, host folders directly
4. **Debug mode**: Must be enabled (see Step 4 above)
5. **Illustrator restart**: Must fully quit and relaunch Illustrator
6. **Illustrator version**: Must be CC 2019 or later

#### "The files got zipped/compressed"

**Don't zip the plugin!** The plugin must remain as a folder structure:
```
❌ Wrong: HalftoneGenerator.zip
❌ Wrong: illustrator-plugin.zip
✅ Correct: HalftoneGenerator/ (folder with subfolders)
```

If you accidentally zipped it:
1. Delete the zip file
2. Extract/unzip the folder
3. Make sure the extracted folder is named `HalftoneGenerator`

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
