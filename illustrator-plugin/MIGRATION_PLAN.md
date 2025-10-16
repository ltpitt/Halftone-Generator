# Migration Plan: Web Halftone Generator to Adobe Illustrator Plugin

## Executive Summary

This document outlines the complete migration plan for converting the web-based Halftone Generator into an Adobe Illustrator plugin. The migration will be executed in phases, maintaining the web application while building a new, independent plugin that provides the same functionality within Illustrator's environment.

**Key Principle**: The web application remains untouched. The plugin is a separate, parallel implementation.

---

## Table of Contents

1. [Project Scope](#project-scope)
2. [Major Phases](#major-phases)
3. [Technical Challenges](#technical-challenges)
4. [Coordination Points](#coordination-points)
5. [Risk Assessment](#risk-assessment)
6. [Success Criteria](#success-criteria)
7. [Timeline Estimates](#timeline-estimates)

---

## Project Scope

### In Scope
- Complete plugin infrastructure using Adobe CEP framework
- All halftone pattern types (circle, square, diamond, line, cross, hexagon)
- All control parameters matching web version
- Vector shape output in Illustrator documents
- Selection-based workflow (apply to selected objects)
- User interface panel matching web aesthetics
- Plugin packaging and distribution preparation

### Out of Scope (for initial release)
- Batch processing multiple objects simultaneously
- Preset save/load functionality
- Cloud synchronization with web version
- Color halftone (CMYK separation)
- Advanced layer management
- Integration with Adobe libraries

---

## Major Phases

### CEP Version Targets

Based on [Adobe CEP Getting Started guides](https://github.com/Adobe-CEP/Getting-Started-guides), the plugin will target:

| CEP Version | Illustrator Version | Release Year |
|-------------|---------------------|--------------|
| CEP 9       | CC 2019 (23.x)      | 2018         |
| CEP 10      | 2020 (24.x)         | 2019         |
| CEP 11      | 2021 (25.x)         | 2020         |
| CEP 11      | 2022 (26.x)         | 2021         |

**Target**: CEP 9 minimum for broad compatibility, with testing on CEP 11 for latest features.

---

### Phase 1: Foundation and Setup (Week 1-2)
**Goal**: Establish development environment and basic plugin structure

**Reference**: [Adobe CEP Getting Started guides](https://github.com/Adobe-CEP/Getting-Started-guides)

#### Tasks
1. **Development Environment**
   - [ ] Install Adobe Illustrator (CC 2019 or later)
   - [ ] Set up Node.js 12+ for build tools
   - [ ] Install ZXP Sign Tool for packaging
   - [ ] Enable CEP debugging (PlayerDebugMode registry/plist setting)
   - [ ] Set up version control for plugin directory
   - [ ] Configure Chrome DevTools for debugging

2. **Plugin Structure** (Following CEP Standards)
   - [ ] Create extension folder in CEP extensions directory
   - [ ] Create CSXS/manifest.xml with proper bundle configuration
   - [ ] Set up HTML panel structure (client/index.html)
   - [ ] Download and integrate CSInterface.js from Adobe CEP Resources
   - [ ] Create ExtendScript host file (host/index.jsx)
   - [ ] Establish JSX interface for panel-to-host communication
   - [ ] Create .debug file for development mode

3. **Development Workflow**
   - [ ] Configure CEP debug ports (default: 8000-8999)
   - [ ] Set up Chrome DevTools remote debugging
   - [ ] Create npm scripts for build automation
   - [ ] Establish hot reload workflow using file watchers
   - [ ] Create logging infrastructure for both UI and ExtendScript

**Key Files to Create** (per Adobe CEP standards):
```
CSXS/manifest.xml         - Extension manifest with host app versions
.debug                    - Debug configuration for development
client/index.html         - Panel UI entry point
client/CSInterface.js     - Adobe's CEP interface library
host/index.jsx            - ExtendScript host script
icons/                    - Panel icons (normal, hover, dark themes)
```

**Deliverables**:
- Working plugin skeleton that loads in Illustrator
- Basic "Hello World" with UI-to-ExtendScript communication
- Debug configuration working with Chrome DevTools
- Development documentation

---

### Phase 2: Core Architecture (Week 3-4)
**Goal**: Build the fundamental systems for halftone generation

#### Tasks
1. **Image Data Processing**
   - [ ] Implement object selection detection
   - [ ] Create raster image data extraction from selected objects
   - [ ] Build vector-to-raster conversion for vector objects
   - [ ] Implement brightness/grayscale calculation
   - [ ] Port image adjustment algorithms (contrast, brightness, gamma, threshold)

2. **Grid System**
   - [ ] Implement grid calculation with rotation support
   - [ ] Create coordinate transformation system
   - [ ] Build sampling logic for image data at grid points
   - [ ] Implement spacing and density controls

3. **Vector Shape Generation**
   - [ ] Create Illustrator path creation functions
   - [ ] Implement circle pattern generator
   - [ ] Build shape scaling based on intensity
   - [ ] Optimize path creation for performance

**Deliverables**:
- Functional halftone generation with circle pattern
- Basic parameter controls
- Selection handling system

**Technical Challenges**:
- Canvas ImageData → Illustrator raster data conversion
- Performance optimization for thousands of vector shapes
- Coordinate system transformation (web canvas vs Illustrator artboard)

---

### Phase 3: Pattern Types Implementation (Week 5-6)
**Goal**: Implement all six pattern types

#### Tasks
1. **Pattern Generators**
   - [ ] Square pattern (rectangles)
   - [ ] Diamond pattern (rotated squares)
   - [ ] Line pattern (horizontal lines with rotation)
   - [ ] Cross hatch pattern (intersecting lines)
   - [ ] Hexagon pattern (six-sided polygons)

2. **Pattern Optimization**
   - [ ] Optimize path point counts
   - [ ] Implement compound path creation
   - [ ] Group shapes efficiently
   - [ ] Handle edge cases and boundaries

**Deliverables**:
- All six pattern types working
- Pattern switching UI
- Performance benchmarks

**Technical Challenges**:
- Efficient polygon generation in ExtendScript
- Maintaining visual consistency with web version
- Performance with complex patterns (hexagons have more points)

---

### Phase 4: User Interface Development (Week 7-8)
**Goal**: Create professional, user-friendly panel UI

#### Tasks
1. **UI Layout**
   - [ ] Design panel layout based on web version
   - [ ] Implement collapsible sections
   - [ ] Create slider controls with live preview
   - [ ] Build radio button groups for pattern selection
   - [ ] Add checkbox for invert option

2. **User Experience**
   - [ ] Implement parameter validation
   - [ ] Add loading indicators for generation process
   - [ ] Create error handling and user feedback
   - [ ] Build reset functionality
   - [ ] Add tooltips and help text

3. **Styling**
   - [ ] Adapt web app CSS for CEP panel
   - [ ] Ensure consistent look with Illustrator UI
   - [ ] Implement responsive layout
   - [ ] Add smooth animations and transitions

**Deliverables**:
- Complete, polished user interface
- Intuitive parameter controls
- Professional appearance

**Technical Challenges**:
- CEP panel CSS restrictions and quirks
- Maintaining web app's aesthetic in Illustrator context
- Performance of UI updates during generation

---

### Phase 5: Advanced Features (Week 9-10)
**Goal**: Implement advanced effects and optimizations

#### Tasks
1. **Image Processing Effects**
   - [ ] Blur effect implementation
   - [ ] Noise addition system
   - [ ] Gamma correction
   - [ ] Threshold control
   - [ ] Invert functionality

2. **Transformation Controls**
   - [ ] Rotation angle implementation
   - [ ] Scale X/Y controls
   - [ ] Transformation matrix calculations
   - [ ] Preview of transformations

3. **Performance Optimization**
   - [ ] Progress reporting for large generations
   - [ ] Cancelable generation process
   - [ ] Memory management for large images
   - [ ] Shape batching and grouping strategies

**Deliverables**:
- All advanced features functional
- Optimized performance
- Cancellation support

**Technical Challenges**:
- ExtendScript performance limitations
- Blur algorithm implementation without Canvas API
- Memory constraints with large documents

---

### Phase 6: Polish and Testing (Week 11-12)
**Goal**: Ensure quality, reliability, and user satisfaction

#### Tasks
1. **Comprehensive Testing**
   - [ ] Test with various image types (JPEG, PNG, TIFF, PSD)
   - [ ] Test with vector objects (paths, compounds, text)
   - [ ] Test with different document sizes and resolutions
   - [ ] Test all parameter combinations
   - [ ] Test error scenarios (no selection, invalid objects)
   - [ ] Performance testing with large images

2. **Bug Fixes and Refinement**
   - [ ] Fix identified bugs
   - [ ] Optimize slow operations
   - [ ] Improve error messages
   - [ ] Refine UI responsiveness

3. **Documentation**
   - [ ] Write user guide
   - [ ] Create video tutorials
   - [ ] Document technical architecture
   - [ ] Write API reference for ExtendScript functions
   - [ ] Create troubleshooting guide

4. **Compatibility Testing**
   - [ ] Test on Illustrator CC 2018, 2019, 2020, 2021, 2022, 2023
   - [ ] Test on Windows 10/11
   - [ ] Test on macOS (multiple versions)
   - [ ] Verify CEP version compatibility

**Deliverables**:
- Production-ready plugin
- Complete documentation
- Test reports
- Known issues list

---

### Phase 7: Packaging and Distribution (Week 13)
**Goal**: Prepare plugin for distribution

#### Tasks
1. **Plugin Packaging**
   - [ ] Create ZXP package
   - [ ] Test ZXP installation
   - [ ] Create installer documentation
   - [ ] Prepare distribution files

2. **Release Preparation**
   - [ ] Write release notes
   - [ ] Create marketing materials
   - [ ] Prepare GitHub release
   - [ ] Update project README

3. **Distribution Channels**
   - [ ] GitHub releases
   - [ ] Adobe Exchange (if pursuing)
   - [ ] Project website updates

**Deliverables**:
- Installable ZXP package
- Installation instructions
- Release announcement

---

## Technical Challenges

### Challenge 1: Canvas API to Illustrator API Translation
**Problem**: Web version uses HTML Canvas API extensively, which doesn't exist in Illustrator.

**Solution Strategy**:
- Create abstraction layer that mimics Canvas concepts
- Use ExtendScript's document.rasterize() for vector-to-raster conversion
- Implement custom image data structure for pixel manipulation
- Build transformation matrix utilities matching Canvas transforms

**Risk Level**: High  
**Mitigation**: Prototype early, create reusable utilities library

---

### Challenge 2: Performance with Thousands of Vector Shapes
**Problem**: Halftone patterns can generate 10,000+ individual shapes, which is slow in ExtendScript.

**Solution Strategy**:
- Use compound paths when possible to reduce object count
- Batch shape creation operations
- Implement progress indicators for user feedback
- Consider simplification algorithms for very dense patterns
- Use Illustrator's pathfinder operations efficiently

**Risk Level**: High  
**Mitigation**: Performance testing from Phase 2, optimization throughout

---

### Challenge 3: Image Data Extraction from Selection
**Problem**: Getting pixel data from selected objects is not straightforward in Illustrator.

**Solution Strategy**:
- For raster images: Use Illustrator's image.imageData (if available) or export/reimport
- For vectors: Rasterize to hidden layer, sample data, delete layer
- Cache rasterized data to avoid repeated rasterization
- Handle embedded vs. linked images appropriately

**Risk Level**: Medium  
**Mitigation**: Research Illustrator API thoroughly, prepare fallback methods

---

### Challenge 4: Real-time Preview
**Problem**: Web version updates instantly; ExtendScript is slower.

**Solution Strategy**:
- Implement "draft mode" with reduced resolution for previews
- Use debouncing on slider controls
- Show progress indicators during generation
- Consider separate "preview" vs. "generate" buttons
- Cache intermediate results where possible

**Risk Level**: Medium  
**Mitigation**: Set user expectations, optimize critical paths

---

### Challenge 5: Cross-version Compatibility
**Problem**: Plugin must work across multiple Illustrator versions (CC 2015 - 2024).

**Solution Strategy**:
- Target CEP 7+ for broad compatibility
- Test against ExtendScript API differences
- Use feature detection for version-specific APIs
- Maintain compatibility matrix documentation
- Implement graceful degradation for missing features

**Risk Level**: Medium  
**Mitigation**: Early version testing, maintain test machines

---

### Challenge 6: Color Space and Bit Depth Handling
**Problem**: Illustrator works with various color spaces (RGB, CMYK, Grayscale); web uses RGB canvas.

**Solution Strategy**:
- Convert all input to grayscale for halftone calculation
- Respect document color space for output
- Handle different bit depths properly
- Test with various image formats and color modes

**Risk Level**: Low  
**Mitigation**: Standardize on grayscale early, document color behavior

---

### Challenge 7: Memory Management
**Problem**: Large images and many shapes can consume significant memory.

**Solution Strategy**:
- Implement chunked processing for large images
- Clean up temporary objects aggressively
- Use gc() calls in ExtendScript where appropriate
- Set practical limits on input size (e.g., max 4000x4000px)
- Warn users before processing very large images

**Risk Level**: Low  
**Mitigation**: Testing with large files, clear user communication

---

## Coordination Points

### Between Web and Plugin Development

#### Shared Concepts
- Algorithm parity: Halftone generation logic should produce similar results
- Parameter names and ranges: Keep consistent for user familiarity
- Pattern definitions: Visual output should match between platforms

#### Independent Concerns
- UI implementation: Different but conceptually similar
- File I/O: Web uses File API, plugin uses Illustrator documents
- Output format: Web produces raster/SVG, plugin produces vector shapes
- Performance characteristics: Different optimization strategies

#### Communication Protocol
- Document algorithm changes in both codebases
- Maintain feature parity checklist
- Cross-reference issues between web and plugin
- Share test cases and expected outputs

---

### Development Workflow Coordination

#### Version Control
- Plugin lives in `illustrator-plugin/` directory
- Separate commit history from web app changes
- Independent branching strategy if needed
- Clear commit messages indicating plugin vs. web changes

#### Issue Tracking
- Tag issues with "plugin" or "web" labels
- Link related issues between platforms
- Separate milestones for plugin development
- Track feature parity in dedicated issues

#### Documentation
- Keep AGENTS.md updated with constraints
- Maintain separate README for plugin
- Cross-link relevant documentation
- Document API differences and design decisions

---

### User Experience Coordination

#### Feature Parity
- Track which features are available in each platform
- Document intentional differences (e.g., vector output)
- Maintain consistent terminology
- Provide migration guides for users switching platforms

#### Support and Troubleshooting
- Separate support channels if needed
- Common FAQ sections for both platforms
- Clear documentation on which tool to use when
- Consistent error messages and handling

---

## Risk Assessment

### High-Risk Items
1. **Performance Issues**: Shape generation could be too slow
   - **Mitigation**: Early prototyping, optimization from Phase 2
   
2. **API Limitations**: ExtendScript might lack needed capabilities
   - **Mitigation**: Deep research before commitment, fallback plans

3. **Version Compatibility**: Breaking changes across Illustrator versions
   - **Mitigation**: Test early and often, maintain compatibility matrix

### Medium-Risk Items
1. **Learning Curve**: Team unfamiliar with CEP/ExtendScript
   - **Mitigation**: Training period, reference implementations
   
2. **User Adoption**: Users may prefer web version
   - **Mitigation**: Clear value proposition, good documentation

3. **Maintenance Burden**: Supporting two codebases
   - **Mitigation**: Good architecture, automated testing

### Low-Risk Items
1. **UI Design**: Adapting web design to CEP
   - **Mitigation**: Iterative design, user feedback
   
2. **Distribution**: Getting plugin to users
   - **Mitigation**: Multiple distribution channels

---

## Success Criteria

### Functional Success
- [ ] All six pattern types working correctly
- [ ] All parameters functional and producing expected results
- [ ] Handles common image formats (JPEG, PNG, TIFF)
- [ ] Works with vector and raster selections
- [ ] Generates editable vector output in document
- [ ] Matches web version output quality

### Performance Success
- [ ] Generates 2000x2000px halftone in under 30 seconds
- [ ] UI remains responsive during generation
- [ ] No crashes with typical inputs
- [ ] Memory usage stays reasonable (<500MB)

### Quality Success
- [ ] Zero critical bugs
- [ ] Complete documentation
- [ ] Works on Windows and macOS
- [ ] Compatible with Illustrator CC 2018+
- [ ] Professional, polished appearance

### User Success
- [ ] Intuitive for users familiar with web version
- [ ] Clear error messages and guidance
- [ ] Successful installations by test users
- [ ] Positive user feedback
- [ ] Active usage after installation

---

## Timeline Estimates

### Optimistic Timeline: 10 weeks
- Assumes experienced CEP developer
- No major technical blockers
- Streamlined testing process

### Realistic Timeline: 13 weeks
- Accounts for learning curve
- Time for research and problem-solving
- Thorough testing and iteration

### Pessimistic Timeline: 16-20 weeks
- Significant technical challenges encountered
- Need for architectural changes
- Extended compatibility testing
- Multiple revision cycles

### Recommended Approach
Start with realistic timeline (13 weeks), re-evaluate after Phase 2 completion. Phase 2 completion is the key indicator of whether optimistic or pessimistic timeline is more appropriate.

---

## Next Steps

### Immediate Actions
1. Create plugin skeleton structure
2. Set up development environment
3. Begin Phase 1 implementation
4. Schedule regular progress reviews

### Before Starting Phase 1
- [ ] Approve this migration plan
- [ ] Allocate development resources
- [ ] Confirm Illustrator version targets
- [ ] Set up project tracking tools

### Regular Checkpoints
- End of each phase: Review deliverables
- Weekly: Progress updates
- Bi-weekly: Risk assessment review
- Monthly: Stakeholder demonstrations

---

## Appendix

### Technology Reference
- **CEP (Common Extensibility Platform)**: Adobe's framework for HTML-based extensions
- **ExtendScript**: JavaScript variant for Adobe applications scripting
- **ZXP**: Package format for distributing CEP extensions
- **JSX**: ExtendScript file extension
- **CSInterface**: JavaScript library for CEP panel-to-host communication

### CEP Extension Structure (Adobe Standard)

Based on [Adobe CEP Getting Started guides](https://github.com/Adobe-CEP/Getting-Started-guides), a CEP extension follows this structure:

```
HalftoneGenerator/                          # Extension root
├── CSXS/
│   └── manifest.xml                        # Extension manifest (required)
├── .debug                                  # Debug configuration (development only)
├── client/                                 # Panel UI layer
│   ├── index.html                          # Main panel HTML
│   ├── style.css                           # Panel styles
│   ├── script.js                           # Panel logic
│   ├── lib/
│   │   └── CSInterface.js                  # Adobe's CEP library
│   └── thirdparty/                         # Any third-party libraries
├── host/                                   # ExtendScript layer
│   ├── index.jsx                           # Main host script
│   └── lib/                                # Utility libraries
│       ├── halftone-engine.jsx             # Halftone generation logic
│       ├── image-processor.jsx             # Image data processing
│       └── shape-generator.jsx             # Vector shape creation
└── icons/                                  # Extension icons
    ├── icon-normal.png                     # 23x23 or 46x46 (HiDPI)
    ├── icon-hover.png
    ├── icon-disabled.png
    └── icon-dark.png                       # For dark UI themes
```

### Example manifest.xml (Adobe CEP Standard)

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<ExtensionManifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                   ExtensionBundleId="com.halftone.generator" 
                   ExtensionBundleVersion="1.0.0" 
                   Version="9.0">
  
  <ExtensionList>
    <Extension Id="com.halftone.generator.panel" Version="1.0.0"/>
  </ExtensionList>
  
  <ExecutionEnvironment>
    <HostList>
      <!-- Illustrator CC 2019 and later -->
      <Host Name="ILST" Version="[23.0,99.9]"/>
    </HostList>
    
    <LocaleList>
      <Locale Code="All"/>
    </LocaleList>
    
    <RequiredRuntimeList>
      <RequiredRuntime Name="CSXS" Version="9.0"/>
    </RequiredRuntimeList>
  </ExecutionEnvironment>
  
  <DispatchInfoList>
    <Extension Id="com.halftone.generator.panel">
      <DispatchInfo>
        <Resources>
          <MainPath>./client/index.html</MainPath>
          <ScriptPath>./host/index.jsx</ScriptPath>
          <CEFCommandLine/>
        </Resources>
        
        <Lifecycle>
          <AutoVisible>true</AutoVisible>
        </Lifecycle>
        
        <UI>
          <Type>Panel</Type>
          <Menu>Halftone Generator</Menu>
          <Geometry>
            <Size>
              <Height>600</Height>
              <Width>320</Width>
            </Size>
            <MinSize>
              <Height>400</Height>
              <Width>280</Width>
            </MinSize>
            <MaxSize>
              <Height>800</Height>
              <Width>400</Width>
            </MaxSize>
          </Geometry>
          <Icons>
            <Icon Type="Normal">./icons/icon-normal.png</Icon>
            <Icon Type="RollOver">./icons/icon-hover.png</Icon>
            <Icon Type="Disabled">./icons/icon-disabled.png</Icon>
            <Icon Type="DarkNormal">./icons/icon-dark.png</Icon>
          </Icons>
        </UI>
      </DispatchInfo>
    </Extension>
  </DispatchInfoList>
</ExtensionManifest>
```

### Example .debug File (Development)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ExtensionList>
  <Extension Id="com.halftone.generator.panel">
    <HostList>
      <Host Name="ILST" Port="8088"/>
    </HostList>
  </Extension>
</ExtensionList>
```

### CEP Panel to ExtendScript Communication Pattern

**In client/script.js (Panel side):**
```javascript
// Using CSInterface.js from Adobe CEP Resources
var csInterface = new CSInterface();

// Call ExtendScript function
function generateHalftone(params) {
  var paramsJSON = JSON.stringify(params);
  
  // evalScript communicates with host ExtendScript
  csInterface.evalScript('generateHalftone(' + paramsJSON + ')', function(result) {
    if (result === 'EvalScript error.') {
      console.error('ExtendScript execution failed');
      return;
    }
    
    var resultData = JSON.parse(result);
    console.log('Halftone generated:', resultData);
    updateUI(resultData);
  });
}

// Listen for events from ExtendScript
csInterface.addEventListener('halftone.progress', function(event) {
  var progress = JSON.parse(event.data);
  updateProgressBar(progress.percent);
});
```

**In host/index.jsx (ExtendScript side):**
```javascript
// ExtendScript function called from panel
function generateHalftone(paramsJSON) {
  try {
    var params = JSON.parse(paramsJSON);
    
    // Illustrator API calls
    var doc = app.activeDocument;
    var selection = doc.selection;
    
    if (selection.length === 0) {
      return JSON.stringify({success: false, error: 'No selection'});
    }
    
    // Generate halftone pattern
    var result = createHalftonePattern(selection[0], params);
    
    // Send progress events back to panel
    var event = new CSXSEvent();
    event.type = 'halftone.progress';
    event.data = JSON.stringify({percent: 100, complete: true});
    event.dispatch();
    
    return JSON.stringify({success: true, shapesCreated: result.count});
    
  } catch (error) {
    return JSON.stringify({success: false, error: error.toString()});
  }
}

// Helper function for halftone generation
function createHalftonePattern(targetObject, params) {
  // Implementation details here
  // This is where web Canvas logic gets translated to Illustrator paths
}
```

### Enabling CEP Debug Mode

**On macOS:**
```bash
# Enable debug mode
defaults write com.adobe.CSXS.9 PlayerDebugMode 1

# Set log level (0-6, 6 is most verbose)
defaults write com.adobe.CSXS.9 LogLevel 6

# Restart Illustrator
```

**On Windows:**
```powershell
# Create registry key (run as Administrator)
# For CEP 9
New-Item -Path "HKEY_CURRENT_USER\Software\Adobe\CSXS.9" -Force
Set-ItemProperty -Path "HKEY_CURRENT_USER\Software\Adobe\CSXS.9" -Name "PlayerDebugMode" -Value "1"
Set-ItemProperty -Path "HKEY_CURRENT_USER\Software\Adobe\CSXS.9" -Name "LogLevel" -Value "6"

# Restart Illustrator
```

**Debug with Chrome DevTools:**
1. Enable debug mode (above)
2. Load extension in Illustrator
3. Open Chrome/Edge browser
4. Navigate to: `http://localhost:8088` (port from .debug file)
5. Use full DevTools for debugging panel JavaScript

### Building and Packaging

**Development Installation:**
```bash
# macOS: Copy to CEP extensions folder
cp -r HalftoneGenerator ~/Library/Application\ Support/Adobe/CEP/extensions/

# Windows: Copy to CEP extensions folder
# C:\Users\<username>\AppData\Roaming\Adobe\CEP\extensions\
```

**Production Packaging:**
```bash
# Using ZXPSignCmd tool from Adobe
ZXPSignCmd -sign HalftoneGenerator/ HalftoneGenerator.zxp certificate.p12 password -tsa http://timestamp.digicert.com

# Self-signed certificate for testing (creates certificate.p12)
ZXPSignCmd -selfSignedCert US CA MyCompany MyCommonName password certificate.p12
```

**Installation:**
- ZXP files can be installed via Adobe Extension Manager (deprecated) or third-party installers
- For testing: ExMan Command Line Tool or Anastasiy's Extension Manager
- For distribution: Consider Adobe Exchange or direct download

### Performance Optimization Tips

**From Adobe CEP Best Practices:**

1. **Minimize evalScript Calls**: Batch operations in ExtendScript
2. **Use Asynchronous Communication**: Don't block UI during heavy processing
3. **Cache CSInterface Instance**: Create once, reuse throughout panel lifetime
4. **Optimize ExtendScript**: 
   - Use app.executeMenuCommand() for built-in operations when possible
   - Group document modifications to reduce redraw overhead
   - Use app.redraw() judiciously
5. **Panel Performance**:
   - Minimize DOM manipulations
   - Use CSS transforms for animations
   - Debounce slider inputs before calling ExtendScript

### Common Pitfalls and Solutions

**Problem**: Extension doesn't appear in Illustrator
- **Solution**: Check manifest.xml syntax, verify CEP version compatibility, ensure bundle ID is unique

**Problem**: evalScript returns "EvalScript error"
- **Solution**: Check ExtendScript syntax, use try-catch blocks, verify function names, check $.writeln() output in ESTK Console

**Problem**: Extension panel is blank/white
- **Solution**: Check browser console (via debug mode), verify HTML/CSS paths, check for JavaScript errors

**Problem**: ExtendScript runs slowly
- **Solution**: Optimize loops, use compound paths, batch operations, profile with $.hiresTimer

### Development Best Practices

1. **Error Handling**: Always use try-catch in both panel JS and ExtendScript
2. **Logging**: Use console.log() in panel, $.writeln() in ExtendScript
3. **Version Control**: Separate client and host logic for easier testing
4. **Testing**: Test across multiple Illustrator versions early
5. **Documentation**: Document JSX interfaces for team collaboration
6. **User Feedback**: Show progress indicators for long operations

### Useful Resources

**Primary Reference:**
- **[Adobe CEP Getting Started guides](https://github.com/Adobe-CEP/Getting-Started-guides)** - Official Adobe guide for CEP development
  - Covers development environment setup
  - Extension structure and manifest configuration
  - Debugging and testing procedures
  - Packaging and distribution

**Additional Adobe Resources:**
- [CEP Resources Repository](https://github.com/Adobe-CEP/CEP-Resources) - Sample extensions and documentation
- [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md) - Comprehensive technical guide
- [CSInterface.js](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/CSInterface.js) - Required library for panel-host communication
- [Sample Extensions](https://github.com/Adobe-CEP/Samples) - Working example extensions

**Illustrator Scripting:**
- [Illustrator Scripting Guide](https://ai-scripting.docsforadobe.dev/) - Official scripting documentation
- [Illustrator Scripting Reference](https://illustrator-scripting-guide.readthedocs.io/) - Community-maintained guide
- [ExtendScript Toolkit](https://extendscript.docsforadobe.dev/) - Language reference

**Tools:**
- [ZXPSignCmd](https://github.com/Adobe-Distribute/ZXPSignCMD) - Command-line signing tool
- [Anastasiy's Extension Manager](https://install.anastasiy.com/) - Extension installer for testing
- Chrome DevTools - For debugging panel JavaScript

### Contact and Support
- Project Repository: https://github.com/ltpitt/Halftone-Generator
- Issue Tracking: GitHub Issues
- Documentation: Repository Wiki (when available)

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Author**: Halftone Generator Development Team  
**Status**: Planning Phase
