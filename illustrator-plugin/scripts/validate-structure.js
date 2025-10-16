#!/usr/bin/env node

/**
 * Structure Validation Script
 * Validates that the CEP extension has all required files and directories
 */

const fs = require('fs');
const path = require('path');

const pluginRoot = path.join(__dirname, '..');

// Required files and directories
const requiredPaths = [
    'CSXS/manifest.xml',
    '.debug',
    'client/index.html',
    'client/style.css',
    'client/script.js',
    'client/lib/CSInterface.js',
    'host/index.jsx',
    'icons',
    'package.json',
    'README.md',
    'MIGRATION_PLAN.md'
];

let hasErrors = false;

console.log('Validating plugin structure...\n');

requiredPaths.forEach(requiredPath => {
    const fullPath = path.join(pluginRoot, requiredPath);
    const exists = fs.existsSync(fullPath);
    
    if (exists) {
        console.log(`✓ ${requiredPath}`);
    } else {
        console.error(`✗ ${requiredPath} - MISSING`);
        hasErrors = true;
    }
});

console.log('\n');

if (hasErrors) {
    console.error('Validation failed: Some required files are missing.');
    process.exit(1);
} else {
    console.log('✓ All required files and directories are present.');
    
    // Check manifest.xml is valid XML
    try {
        const manifestPath = path.join(pluginRoot, 'CSXS/manifest.xml');
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        
        // Basic XML validation
        if (!manifestContent.includes('<?xml') || !manifestContent.includes('ExtensionManifest')) {
            console.error('✗ manifest.xml appears to be malformed');
            hasErrors = true;
        } else {
            console.log('✓ manifest.xml appears valid');
        }
    } catch (error) {
        console.error('✗ Error reading manifest.xml:', error.message);
        hasErrors = true;
    }
    
    if (hasErrors) {
        process.exit(1);
    }
    
    console.log('\nValidation complete: Plugin structure is valid.');
    process.exit(0);
}
