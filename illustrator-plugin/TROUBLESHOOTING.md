# Troubleshooting Guide

## Issue: Plugin Always Shows "Demo Mode" in Illustrator

### Problem
When loading the extension in Illustrator, it always shows "Demo Mode" instead of detecting that it's running inside Illustrator.

### Root Cause
The plugin was using a custom minimal `CSInterface.js` instead of Adobe's official library. The minimal version was missing critical methods like `getOSInformation()`, causing the detection code to fail and fall back to demo mode.

### Solution
**Download the Official Adobe CSInterface.js**

The CSInterface.js library is officially provided by Adobe and should NOT be written manually. Download it from:

```bash
# For CEP 9 (Illustrator CC 2019+)
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_9.x/CSInterface.js"
```

**Official Adobe CEP Resources:**
- GitHub: https://github.com/Adobe-CEP/CEP-Resources
- CEP 9: https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_9.x
- CEP 10: https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_10.x
- CEP 11: https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_11.x
- CEP 12: https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_12.x

**Detection Code (with official library):**
```javascript
try {
    csInterface = new CSInterface();
    const osInfo = csInterface.getOSInformation();
    const hostEnv = csInterface.getHostEnvironment();
    isIllustratorMode = true;
} catch (e) {
    isIllustratorMode = false; // Running in browser
}
```

### Debugging Steps
1. **Check Console Output**: The plugin now includes detailed logging. Open Chrome DevTools:
   - In Illustrator, go to: Window > Extensions (Legacy) > Halftone Generator
   - Right-click the panel and select "Debug"
   - Or use: `chrome://inspect/#devices` and click "inspect" next to your extension

2. **Look for These Log Messages**:
   ```
   === Environment Detection Debug ===
   typeof CSInterface: function
   CSInterface exists: true
   window.__adobe_cep__ exists: true
   ...
   Final mode: Illustrator
   ```

3. **If `window.__adobe_cep__` is undefined**:
   - The extension is not properly loaded as a CEP extension
   - Check that the extension is installed in the correct location
   - Verify manifest.xml configuration

4. **If CSInterface is undefined**:
   - CSInterface.js is not loading
   - Check the script load order in index.html
   - Verify CSInterface.js exists in client/lib/

### Extension Installation Locations

**macOS**:
- System: `/Library/Application Support/Adobe/CEP/extensions/`
- User: `~/Library/Application Support/Adobe/CEP/extensions/`

**Windows**:
- System: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
- User: `C:\Users\<username>\AppData\Roaming\Adobe\CEP\extensions\`

### Enable Unsigned Extensions (Development)

**macOS**:
```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
```

**Windows** (Command Prompt as Administrator):
```cmd
regedit
# Add key: HKEY_CURRENT_USER\Software\Adobe\CSXS.9
# Add String value: PlayerDebugMode = "1"
```

### Verify Installation
1. Extension folder should be: `extensions/com.halftone.generator/`
2. Check folder structure:
   ```
   com.halftone.generator/
   ├── CSXS/
   │   └── manifest.xml
   ├── client/
   │   ├── index.html
   │   ├── script.js
   │   ├── style.css
   │   └── lib/
   │       └── CSInterface.js
   └── host/
       └── index.jsx
   ```

### Common Issues

1. **Extension Not Visible in Illustrator Menu**
   - Check that PlayerDebugMode is enabled
   - Restart Illustrator after installation
   - Verify manifest.xml paths are correct

2. **"Access Denied" or Permission Errors**
   - Use user extensions folder instead of system folder
   - Check folder permissions

3. **Panel Opens But Shows Errors**
   - Open debug console to see JavaScript errors
   - Check that all files are in correct locations
   - Verify CSInterface.js is loading

4. **ExtendScript Communication Fails**
   - Verify index.jsx exists in host/ folder
   - Check console for evalScript errors
   - Ensure manifest.xml has correct ScriptPath

### Additional Resources
- [Adobe CEP Resources](https://github.com/Adobe-CEP/CEP-Resources)
- [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md)
- Chrome DevTools: `chrome://inspect/#devices`
