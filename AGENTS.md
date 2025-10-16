# Agent Instructions for Halftone Generator Project

## Critical Requirements

### Web Application Protection
- **NEVER modify, delete, or touch the existing web application files**
- The following files must remain untouched:
  - `web-app/index.html`
  - `web-app/script.js`
  - `web-app/style.css`
- These files represent the working web-based halftone generator
- Any changes to the web app could break functionality for current users

### Adobe Illustrator Plugin Development
- **All plugin development must be in a dedicated folder**: `illustrator-plugin/`
- The plugin is a separate, independent project
- Plugin code should not share or modify web application code
- Plugin development should be completely isolated from the web app

### Project Structure
```
Halftone-Generator/
├── web-app/                # Web-based halftone generator
│   ├── index.html          # Web app - DO NOT MODIFY
│   ├── script.js           # Web app - DO NOT MODIFY
│   ├── style.css           # Web app - DO NOT MODIFY
│   └── README.md           # Web app documentation
├── illustrator-plugin/     # Adobe Illustrator plugin
│   ├── README.md
│   ├── MIGRATION_PLAN.md
│   └── [plugin files]
├── README.md               # Main project documentation
└── AGENTS.md               # This file
```

## Guidelines for Agents

### When Working on Web Application
- If asked to modify the web app, politely decline and explain it must remain unchanged
- Direct any web app improvements to be postponed or considered separately
- The web app is production code serving users
- All web app files are located in the `web-app/` directory

### When Working on Illustrator Plugin
- All work must be within `illustrator-plugin/` directory
- Plugin should recreate web app functionality for Illustrator environment
- Plugin uses Adobe CEP (Common Extensibility Platform) framework
- Plugin consists of:
  - HTML/CSS/JS panel (UI layer)
  - ExtendScript (.jsx) for Illustrator automation
  - Manifest file for plugin configuration

### Code Reuse Strategy
- Study web app logic for reference only
- Do NOT copy web app files directly
- Reimplement functionality adapted for Illustrator context
- Canvas rendering logic → Illustrator vector shape creation
- Web controls → CEP panel controls

## Technical Context

### Web Application Tech Stack
- Pure HTML5/CSS3/JavaScript
- Canvas API for rendering
- No build process or dependencies
- Runs directly in browser

### Plugin Tech Stack (Planned)
- Adobe CEP (HTML5/CSS3/JavaScript for UI)
- ExtendScript (.jsx) for Illustrator API
- Node.js for build tooling (optional)
- ZXP Installer for packaging

## Collaboration Rules

1. **Separation of Concerns**: Web app and plugin are independent projects
2. **No Cross-Contamination**: Changes in one should never affect the other
3. **Documentation First**: Plan before implementing major changes
4. **Incremental Development**: Build plugin in phases, test thoroughly
5. **User Safety**: Never break existing web functionality

## Questions to Ask Before Making Changes

- [ ] Am I about to modify a web app file? (If yes, STOP)
- [ ] Is my change within the `illustrator-plugin/` directory? (Should be yes)
- [ ] Does my change risk affecting the web app? (Should be no)
- [ ] Have I documented my approach in the plugin README?

## Future Considerations

- Both web app and plugin will coexist indefinitely
- Users may use either or both tools
- Maintain feature parity where possible
- Document differences between web and plugin versions
- Keep migration plan updated as plugin develops
