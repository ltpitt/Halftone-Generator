# GitHub Actions CI Setup

This document describes the CI/CD setup for the Halftone Generator project.

## Overview

The project uses GitHub Actions to automatically run tests on every pull request and push to the main/master branches. This ensures code quality and prevents broken code from being merged.

## Workflow File

The CI workflow is defined in `.github/workflows/ci.yml` and includes:

### Jobs

1. **validate-structure** - Validates the plugin file structure and manifest.xml
2. **test-demo-mode** - Tests the demo mode functionality
3. **e2e-tests** - Runs Playwright end-to-end tests in a browser
4. **all-tests-passed** - A final verification job that ensures all tests passed

### Features

- **Parallel execution**: Test jobs run simultaneously for faster feedback
- **Node.js 18**: Uses LTS version of Node.js
- **Dependency caching**: npm dependencies are cached to speed up builds
- **Playwright with system dependencies**: E2E tests install Chromium with all required system libraries
- **Test artifacts**: Playwright reports are uploaded and retained for 30 days
- **Required status check**: The `all-tests-passed` job can be configured as a required check for PRs

## Setting Up Branch Protection (Optional)

To enforce that tests must pass before merging, you can set up branch protection rules:

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Branches**
3. Click **Add rule** under "Branch protection rules"
4. In "Branch name pattern", enter `main` (or `master` if that's your default branch)
5. Check **Require status checks to pass before merging**
6. Search for and select these status checks:
   - `Validate Plugin Structure`
   - `Test Demo Mode`
   - `E2E Tests`
   - `All Tests Passed`
7. Optionally check **Require branches to be up to date before merging**
8. Click **Create** or **Save changes**

## Running Tests Locally

Before pushing code, you can run tests locally:

```bash
cd illustrator-plugin

# Install dependencies (first time only)
npm install

# Run all tests
npm test

# Or run individual test suites
npm run validate        # Structure validation
npm run test:demo       # Demo mode tests
npm run test:e2e        # E2E tests (requires Playwright browsers)
```

### Installing Playwright Browsers

For E2E tests, you need to install Playwright browsers:

```bash
cd illustrator-plugin
npx playwright install chromium
```

## Troubleshooting

### Tests fail locally but pass in CI (or vice versa)

- Ensure you have the same Node.js version (18.x)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- For E2E tests, reinstall Playwright browsers: `npx playwright install chromium`

### E2E tests fail due to missing system dependencies

On CI, we use `npx playwright install --with-deps` which installs system dependencies. Locally, you might need to install them manually. See [Playwright docs](https://playwright.dev/docs/browsers#install-system-dependencies) for your OS.

### Tests time out

- Check if the local server is running (for E2E tests)
- Increase timeout values in `playwright.config.js` if needed
- Ensure no other process is using port 8765

## Workflow Triggers

The CI workflow runs automatically on:

- **Pull requests** targeting `main` or `master` branches
- **Pushes** to `main` or `master` branches

This means:
- Every PR will automatically run tests
- Every merge to main/master will verify the code still works
- You'll see the test status directly in the PR interface

## Test Results

After tests run, you can:

- View test results in the **Actions** tab of your GitHub repository
- Download test artifacts (Playwright reports) from the workflow summary
- See pass/fail status directly on pull requests
- Review detailed logs for any failing tests

## Maintenance

To update the workflow:

1. Edit `.github/workflows/ci.yml`
2. Test changes by pushing to a branch and creating a PR
3. The workflow will run with your changes
4. Once verified, merge the PR

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Testing Documentation](https://playwright.dev/)
- [Project Test Documentation](../illustrator-plugin/TESTING.md)
