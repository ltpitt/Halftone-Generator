# CEP Version Compatibility for Illustrator

## Your Target Versions

You mentioned you use **Illustrator 2021** and **Illustrator 2023**. Here's what you need to know:

## Official Illustrator CEP Compatibility

| Illustrator Version | App Version | Year | CEP Version | Your Current Setup (CEP 9) |
|---------------------|-------------|------|-------------|---------------------------|
| Illustrator 23 | 23.x | CC 2019 | CEP 9 | ✅ **Fully Supported** |
| Illustrator 24 | 24.x | CC 2020 | CEP 9 | ✅ **Fully Supported** |
| **Illustrator 25.0** | **25.0** | **2021 (Early)** | **CEP 10** | ⚠️ **Works but not optimal** |
| **Illustrator 25.3** | **25.3+** | **2021 (Late)** | **CEP 11** | ⚠️ **Works but not optimal** |
| Illustrator 29.5 | 29.5+ | 2023/2024 | CEP 12 | ❌ **Not Fully Supported** |

## The Problem

Your current `manifest.xml` specifies:
```xml
<RequiredRuntime Name="CSXS" Version="9.0"/>
```

This means:
- ✅ **Works well** on Illustrator 2019-2020 (v23-24)
- ⚠️ **May work** on Illustrator 2021 (v25) - but CEP 10/11 is recommended
- ❌ **May not work optimally** on Illustrator 2023+ (v29) - needs CEP 12

## The Solution

CEP extensions are **backward compatible**. A plugin specifying CEP 9 will work in later versions of Illustrator that support CEP 10, 11, or 12. However, you won't have access to newer CEP features.

### Option 1: Keep CEP 9 (Current - Simplest)
**Pros:**
- Works across Illustrator 2019-2021
- Single codebase, single CSInterface.js
- Maximum compatibility with older versions

**Cons:**
- May miss newer CEP features in 2021+
- Not optimal for Illustrator 2023+

**Recommendation:** ✅ **Best option for now** - your plugin will work but use CEP 9 APIs

### Option 2: Upgrade to CEP 11 (Balanced)
**Pros:**
- Better support for Illustrator 2021
- Access to newer CEP features
- Still works with older versions

**Cons:**
- Need to download CEP 11 CSInterface.js
- Update manifest to CEP 11

**How to upgrade:**
```bash
# Download CEP 11 CSInterface.js
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_11.x/CSInterface.js"
```

Update manifest.xml:
```xml
<RequiredRuntime Name="CSXS" Version="11.0"/>
```

### Option 3: Support Multiple CEP Versions (Advanced)
Create separate builds for different CEP versions - requires build system.

## What Happens in Practice?

### With Your Current CEP 9 Setup:

**Illustrator 2019-2020 (v23-24):**
- ✅ **Perfect** - Native CEP 9

**Illustrator 2021 (v25):**
- ✅ **Works** - CEP 10/11 runs your CEP 9 plugin in compatibility mode
- ⚠️ Console may show: "This extension was built for CEP 9"
- ⚠️ May not have access to CEP 10/11 specific features

**Illustrator 2023 (v29):**
- ⚠️ **May work** - CEP 12 running CEP 9 plugin
- ⚠️ More compatibility warnings
- ⚠️ Missing CEP 12 features

## How to Check Your Illustrator CEP Version

Open Illustrator and run this in your extension's console:

```javascript
const csInterface = new CSInterface();
const apiVersion = csInterface.getCurrentApiVersion();
console.log('CEP Version:', apiVersion);

const hostEnv = csInterface.getHostEnvironment();
console.log('App Version:', hostEnv.appVersion);
console.log('App Name:', hostEnv.appName);
```

Expected output:
- Illustrator 2019-2020: `{major: 9, minor: x, micro: x}`
- Illustrator 2021: `{major: 10 or 11, minor: x, micro: x}`
- Illustrator 2023: `{major: 12, minor: x, micro: x}`

## Manifest.xml Configuration

### Current (CEP 9):
```xml
<ExecutionEnvironment>
  <HostList>
    <Host Name="ILST" Version="[23.0,99.9]"/>
  </HostList>
  <RequiredRuntimeList>
    <RequiredRuntime Name="CSXS" Version="9.0"/>
  </RequiredRuntimeList>
</ExecutionEnvironment>
```

### Recommended for Your Use Case (CEP 11):
```xml
<ExecutionEnvironment>
  <HostList>
    <!-- Supports Illustrator 2019-2021+ -->
    <Host Name="ILST" Version="[23.0,99.9]"/>
  </HostList>
  <RequiredRuntimeList>
    <!-- CEP 11 for better 2021 support, still works with older versions -->
    <RequiredRuntime Name="CSXS" Version="11.0"/>
  </RequiredRuntimeList>
</ExecutionEnvironment>
```

### For Maximum Compatibility (CEP 9):
```xml
<ExecutionEnvironment>
  <HostList>
    <Host Name="ILST" Version="[23.0,99.9]"/>
  </HostList>
  <RequiredRuntimeList>
    <!-- CEP 9 works across all versions via backward compatibility -->
    <RequiredRuntime Name="CSXS" Version="9.0"/>
  </RequiredRuntimeList>
</ExecutionEnvironment>
```

## My Recommendation for You

### For Illustrator 2021 and 2023:

**Short term (Quick Fix):**
✅ **Keep CEP 9** - It will work! Adobe maintains backward compatibility.

Your plugin will load and function in Illustrator 2021 and 2023, though it will use CEP 9 APIs.

**Medium term (Better Support):**
✅ **Upgrade to CEP 11**

1. Download CEP 11 CSInterface.js:
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_11.x/CSInterface.js"
```

2. Update manifest.xml:
```xml
<RequiredRuntime Name="CSXS" Version="11.0"/>
```

3. Test on all your Illustrator versions

**Long term (Future-Proof):**
✅ **Plan for CEP 12** support for Illustrator 2023+

## CEP Version Download URLs

### CEP 9 (Current - Illustrator 2019-2020)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_9.x/CSInterface.js"
```

### CEP 10 (Illustrator 2021 Early)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_10.x/CSInterface.js"
```

### CEP 11 (Illustrator 2021+) - RECOMMENDED
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_11.x/CSInterface.js"
```

### CEP 12 (Illustrator 2023/2024+)
```bash
curl -o client/lib/CSInterface.js \
  "https://raw.githubusercontent.com/Adobe-CEP/CEP-Resources/master/CEP_12.x/CSInterface.js"
```

## Testing Checklist

- [ ] Test on Illustrator 2019 (v23) - Should work perfectly
- [ ] Test on Illustrator 2020 (v24) - Should work perfectly
- [ ] Test on Illustrator 2021 (v25) - Should work with possible warnings
- [ ] Test on Illustrator 2023 (v29) - Should work with compatibility mode
- [ ] Check console for CEP version warnings
- [ ] Verify all functionality works across versions
- [ ] Test ExtendScript communication
- [ ] Test UI rendering and scaling

## Enable Debug Mode for Testing

**macOS:**
```bash
# For CEP 9
defaults write com.adobe.CSXS.9 PlayerDebugMode 1

# For CEP 10
defaults write com.adobe.CSXS.10 PlayerDebugMode 1

# For CEP 11
defaults write com.adobe.CSXS.11 PlayerDebugMode 1

# For CEP 12
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
```

**Windows:**
Create these registry keys (as Administrator):
```
HKEY_CURRENT_USER\Software\Adobe\CSXS.9
HKEY_CURRENT_USER\Software\Adobe\CSXS.10
HKEY_CURRENT_USER\Software\Adobe\CSXS.11
HKEY_CURRENT_USER\Software\Adobe\CSXS.12

String Value: PlayerDebugMode = "1"
```

## Additional Resources

- [CEP 9 Documentation](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_9.x)
- [CEP 10 Documentation](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_10.x)
- [CEP 11 Documentation](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_11.x)
- [CEP 12 Documentation](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_12.x)
- [CEP Compatibility Table](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_11.x/Documentation/CEP%2011.1%20HTML%20Extension%20Cookbook.md#applications-integrated-with-cep)

## Summary

**Your situation:**
- Using Illustrator 2021 and 2023
- Currently have CEP 9

**What to do:**
1. ✅ **For now**: Keep CEP 9 - it will work via backward compatibility
2. ✅ **Recommended**: Upgrade to CEP 11 for better 2021 support
3. ⚠️ **Future**: Consider CEP 12 for Illustrator 2023+ full support

**Bottom line:** CEP 9 will work in Illustrator 2021 and 2023, but CEP 11 would be more optimal for your use case.
