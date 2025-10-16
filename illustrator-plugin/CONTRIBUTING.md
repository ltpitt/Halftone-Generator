# Contributing to Halftone Generator Plugin

Thank you for your interest in contributing to the Halftone Generator Adobe Illustrator plugin!

## Project Structure

```
illustrator-plugin/
├── CSXS/                       # CEP manifest
│   └── manifest.xml            # Extension configuration
├── client/                     # Panel UI (HTML/CSS/JS)
│   ├── index.html              # Panel interface
│   ├── style.css               # Panel styling
│   ├── script.js               # Panel logic
│   └── lib/
│       └── CSInterface.js      # Adobe CEP library
├── host/                       # ExtendScript (Illustrator automation)
│   └── index.jsx               # Main ExtendScript file
├── icons/                      # Extension icons
├── scripts/                    # Build and validation scripts
│   └── validate-structure.js   # Structure validation
├── .debug                      # Debug configuration
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js package config
├── README.md                   # Main documentation
├── MIGRATION_PLAN.md           # Development roadmap
├── INSTALLATION.md             # Installation guide
├── TESTING.md                  # Testing procedures
└── CONTRIBUTING.md             # This file
```

## Getting Started

### Prerequisites

- **Node.js 12+** (for build tools and validation)
- **Git** for version control
- **Text editor** (VS Code, Sublime Text, etc.)
- **Adobe Illustrator** (for testing only, not required for development)

### Setting Up Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ltpitt/Halftone-Generator.git
   cd Halftone-Generator/illustrator-plugin
   ```

2. **Install dependencies** (if any):
   ```bash
   npm install
   ```

3. **Validate structure**:
   ```bash
   npm run validate
   ```

## Development Workflow

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the coding standards below
   - Test your changes if possible
   - Update documentation if needed

3. **Validate your changes**:
   ```bash
   npm run validate
   ```

4. **Commit with clear messages**:
   ```bash
   git add .
   git commit -m "feat: Add support for ellipse pattern"
   ```

5. **Push and create pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
- `feat: Add gradient density option`
- `fix: Correct angle rotation calculation`
- `docs: Update installation instructions`

## Coding Standards

### HTML (client/index.html)

- Use semantic HTML5 elements
- Maintain consistent indentation (2 spaces)
- Add comments for complex sections
- Use descriptive IDs and classes

### CSS (client/style.css)

- Use consistent naming convention (kebab-case)
- Group related styles together
- Add comments for sections
- Maintain dark theme compatibility
- Use CSS variables for colors when possible

### JavaScript (client/script.js)

- Use strict mode (`'use strict'`)
- Use descriptive variable names
- Add JSDoc comments for functions
- Handle errors gracefully
- Use modern ES5 syntax (for CEP compatibility)

Example:
```javascript
/**
 * Generate halftone pattern with current parameters
 * @returns {void}
 */
function generateHalftone() {
    // Implementation
}
```

### ExtendScript (host/index.jsx)

- Use clear function names
- Add comments for complex algorithms
- Handle errors with try-catch
- Return JSON-formatted results
- Test in ExtendScript Toolkit when possible

Example:
```javascript
// Create a shape based on pattern type
// @param {string} patternType - Type of pattern (circle, square, etc.)
// @param {number} x - X position
// @param {number} y - Y position
// @param {number} size - Shape size
// @returns {PathItem} Created shape or null
function createShape(patternType, x, y, size) {
    try {
        // Implementation
        return shape;
    } catch (error) {
        return null;
    }
}
```

### Manifest (CSXS/manifest.xml)

- Maintain valid XML structure
- Follow Adobe CEP standards
- Update version numbers appropriately
- Test with XML validator

## Testing

### Development Testing (No Illustrator)

You can develop and test without Illustrator:

1. **Validate structure**:
   ```bash
   npm run validate:structure
   ```

2. **Check manifest XML**:
   ```bash
   npm run validate:manifest
   ```

3. **Lint code** (if linters configured):
   ```bash
   npm run lint
   ```

### Manual Testing (Requires Illustrator)

For testing with Illustrator:

1. **Install the plugin** (see INSTALLATION.md)
2. **Follow test procedures** (see TESTING.md)
3. **Document results** in test report
4. **Report bugs** via GitHub issues

## Areas for Contribution

### High Priority

1. **Image Data Extraction**:
   - Implement actual image sampling from raster images
   - Support linked vs. embedded images
   - Handle different color spaces

2. **Pattern Improvements**:
   - Improve cross hatch pattern (add second line set)
   - Optimize shape generation for performance
   - Add more pattern types

3. **UI Enhancements**:
   - Add preset save/load functionality
   - Add preview thumbnail
   - Improve progress indicators

4. **Performance**:
   - Optimize ExtendScript execution
   - Implement chunked processing
   - Add cancellation support

### Medium Priority

1. **Advanced Features**:
   - Implement actual blur algorithm
   - Add color halftone (CMYK separation)
   - Support multiple selections

2. **Documentation**:
   - Add video tutorials
   - Create API reference
   - Write architecture document

3. **Testing**:
   - Create automated tests where possible
   - Expand test coverage
   - Document test results

### Low Priority

1. **Distribution**:
   - Create ZXP packaging script
   - Submit to Adobe Exchange
   - Create installer

2. **Localization**:
   - Add multi-language support
   - Translate UI strings

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project coding standards
- [ ] Validation scripts pass (`npm run validate`)
- [ ] Changes are documented (code comments, README updates)
- [ ] Tested manually if Illustrator available
- [ ] Commit messages follow convention
- [ ] No unrelated changes included

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
How were the changes tested?

## Screenshots
(if UI changes)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested in Illustrator (if available)

## Related Issues
Fixes #(issue number)
```

## Important Rules

### What NOT to Do

⚠️ **Never modify web application files**:
- `index.html` (root directory)
- `script.js` (root directory)
- `style.css` (root directory)
- `script-old.js`
- `style-backup.css`

These files are the production web application and must remain unchanged.

### What TO Do

✓ **All plugin work stays in `illustrator-plugin/` directory**
✓ **Test changes before committing**
✓ **Update documentation when adding features**
✓ **Ask questions if unsure**

## Getting Help

- **Documentation**: Read README.md and MIGRATION_PLAN.md first
- **GitHub Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: Repository maintainers

## Code Review Process

1. **Submit PR** with clear description
2. **Automated checks** run (validation, linting)
3. **Manual review** by maintainer
4. **Address feedback** if requested
5. **Approval** and merge

## Recognition

Contributors will be:
- Listed in project README
- Credited in release notes
- Mentioned in documentation

## Resources

### Adobe CEP Development

- [Adobe CEP Getting Started](https://github.com/Adobe-CEP/Getting-Started-guides)
- [CEP Resources](https://github.com/Adobe-CEP/CEP-Resources)
- [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md)

### Illustrator Scripting

- [Illustrator Scripting Guide](https://ai-scripting.docsforadobe.dev/)
- [ExtendScript Documentation](https://extendscript.docsforadobe.dev/)

### Tools

- [Node.js](https://nodejs.org/)
- [VS Code](https://code.visualstudio.com/)
- [ZXP Sign Tool](https://github.com/Adobe-Distribute/ZXPSignCMD)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to the Halftone Generator plugin!**

Your contributions help make this tool better for the design community.
