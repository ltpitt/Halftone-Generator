# CSInterface.js - Setup Guide

## What is CSInterface.js?

`CSInterface.js` is the official Adobe library that enables communication between:
- Your HTML/JavaScript panel (UI)
- Adobe's Common Extensibility Platform (CEP)
- The host application (Illustrator, Photoshop, etc.)
- ExtendScript (.jsx files)

## Critical Information

### ⚠️ DO NOT WRITE YOUR OWN VERSION
**CSInterface.js must ALWAYS be the official Adobe version.**

- ❌ Don't create minimal/custom versions
- ❌ Don't modify the official file
- ✅ Always download from Adobe's official repository
- ✅ Match the CEP version in your manifest.xml

## Installation

### Step 1: Determine Your CEP Version
Check your `CSXS/manifest.xml` file:

```xml
<RequiredRuntimeList>
  <RequiredRuntime Name="CSXS" Version="9.0"/>
</RequiredRuntimeList>
```

This tells you which CEP version to use.

### Step 2: Download Official CSInterface.js

#### CEP 9 (Illustrator CC 2019+)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_9.x/CSInterface.js"
```

#### CEP 10 (Illustrator CC 2020+)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_10.x/CSInterface.js"
```

#### CEP 11 (Illustrator CC 2021+)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_11.x/CSInterface.js"
```

#### CEP 12 (Illustrator CC 2022+)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_12.x/CSInterface.js"
```

### Step 3: Include in HTML
```html
<!-- Load CSInterface before your code -->
<script src="lib/CSInterface.js"></script>
<script src="script.js"></script>
```

### Step 4: Use in Your Code
```javascript
// Create instance
const csInterface = new CSInterface();

// Get host info
const hostEnv = csInterface.getHostEnvironment();
console.log('Host:', hostEnv.appName, hostEnv.appVersion);

// Execute ExtendScript
csInterface.evalScript('alert("Hello from ExtendScript");', function(result) {
    console.log('Result:', result);
});

// Get OS info
const osInfo = csInterface.getOSInformation();
console.log('OS:', osInfo);
```

## Version Compatibility Matrix

| CEP Version | CSInterface Version | Illustrator Version | Other Adobe Apps |
|-------------|---------------------|---------------------|------------------|
| CEP 4       | v4.x                | CC 2013             | PS CC 2013       |
| CEP 5       | v5.2.0              | CC 2014             | PS CC 2014       |
| CEP 6       | v6.1.0              | CC 2015             | PS CC 2015       |
| CEP 7       | v7.0.0              | CC 2015.5           | PS CC 2015.5     |
| CEP 8       | v8.0.0              | CC 2018             | PS CC 2018       |
| CEP 9       | v9.4.0              | CC 2019             | PS CC 2019       |
| CEP 10      | v10.0.0             | CC 2020             | PS CC 2020       |
| CEP 11      | v11.0.0             | CC 2021             | PS CC 2021       |
| CEP 12      | v12.0.0             | CC 2022+            | PS CC 2022+      |

## Common CSInterface Methods

### Core Methods
```javascript
// System information
csInterface.getOSInformation()
csInterface.getSystemPath(pathType)
csInterface.getHostEnvironment()
csInterface.getCurrentApiVersion()

// Extension information
csInterface.getExtensionID()
csInterface.getScaleFactor()
csInterface.getHostCapabilities()

// Communication
csInterface.evalScript(script, callback)
csInterface.addEventListener(type, listener, obj)
csInterface.dispatchEvent(event)

// UI control
csInterface.closeExtension()
csInterface.resizeContent(width, height)
csInterface.setWindowTitle(title)
csInterface.requestOpenExtension(extensionId, params)

// Utilities
csInterface.openURLInDefaultBrowser(url)
csInterface.getApplicationID()
csInterface.getHostEnvironment()
```

### CEP Events
```javascript
// Theme changes
CSInterface.THEME_COLOR_CHANGED_EVENT

// Listen for theme changes
csInterface.addEventListener(
    CSInterface.THEME_COLOR_CHANGED_EVENT, 
    onThemeChanged
);
```

## File Structure

### Recommended Layout
```
your-extension/
├── CSXS/
│   └── manifest.xml          # Specifies CEP version
├── client/
│   ├── index.html            # Loads CSInterface.js
│   ├── script.js             # Uses CSInterface
│   └── lib/
│       └── CSInterface.js    # Official Adobe library ✅
└── host/
    └── index.jsx             # ExtendScript code
```

## Troubleshooting

### CSInterface is undefined
**Problem**: `TypeError: CSInterface is not defined`

**Solutions**:
1. Check script load order in HTML:
   ```html
   <!-- CSInterface MUST load first -->
   <script src="lib/CSInterface.js"></script>
   <script src="script.js"></script>
   ```

2. Verify file exists: `client/lib/CSInterface.js`

3. Check browser console for 404 errors

### Methods don't exist
**Problem**: `TypeError: csInterface.getOSInformation is not a function`

**Solutions**:
1. You're using a custom/minimal version - download official Adobe version
2. Check CEP version matches your needs
3. Some methods are version-specific (check documentation)

### window.__adobe_cep__ is undefined
**Problem**: Plugin not detecting CEP environment

**Causes**:
- Extension not properly installed
- PlayerDebugMode not enabled
- Running in regular browser (not CEP)
- Manifest.xml configuration issues

**Solutions**:
- Enable debug mode: `defaults write com.adobe.CSXS.9 PlayerDebugMode 1`
- Restart Adobe application
- Check extension is in correct folder
- Verify manifest.xml paths

## Official Resources

### Adobe Repositories
- **Main CEP Resources**: https://github.com/Adobe-CEP/CEP-Resources
- **Sample Extensions**: https://github.com/Adobe-CEP/Samples
- **Getting Started Guides**: https://github.com/Adobe-CEP/Getting-Started-guides

### Documentation
- [CEP 9 Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md)
- [CEP JavaScript APIs](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#apis)

### Community Resources
- [Davide Barranca's Blog](http://www.davidebarranca.com/)
- [HTML Panels Development Course](http://htmlpanelsbook.com/)

## Verification Checklist

- [ ] Downloaded official CSInterface.js from Adobe repository
- [ ] CEP version matches manifest.xml
- [ ] File saved to `client/lib/CSInterface.js`
- [ ] Included in HTML before other scripts
- [ ] File size is ~40-50KB (not 1-2KB)
- [ ] Methods like `getOSInformation()` exist
- [ ] No custom modifications made to the file

## License
CSInterface.js is provided by Adobe Systems Incorporated under their license terms. See the header in the file for complete license information.

---

**Remember**: When in doubt, always download fresh from Adobe's official repository!
