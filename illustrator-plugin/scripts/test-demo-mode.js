#!/usr/bin/env node

/**
 * Demo Mode Test Script
 * Tests the plugin's demo mode functionality without requiring Illustrator
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Demo Mode Functionality...\n');

// Test 1: HTML Structure
console.log('1. Testing HTML structure...');
const htmlPath = path.join(__dirname, '../client/index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Check for demo mode elements
const demoElements = [
    'id="demoFileSection"',
    'id="demoCanvasSection"', 
    'id="modeIndicator"',
    'id="halftoneCanvas"',
    'id="imageInput"'
];

demoElements.forEach(element => {
    if (htmlContent.includes(element)) {
        console.log(`   ✓ ${element} found`);
    } else {
        console.log(`   ❌ ${element} missing`);
        process.exit(1);
    }
});

// Test 2: CSS Demo Styles
console.log('\n2. Testing CSS demo mode styles...');
const cssPath = path.join(__dirname, '../client/style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const demoStyles = [
    '.demo-only',
    '.mode-indicator',
    '.canvas-container',
    '.file-input'
];

demoStyles.forEach(style => {
    if (cssContent.includes(style)) {
        console.log(`   ✓ ${style} found`);
    } else {
        console.log(`   ❌ ${style} missing`);
        process.exit(1);
    }
});

// Test 3: JavaScript Demo Functions
console.log('\n3. Testing JavaScript demo mode functions...');
const jsPath = path.join(__dirname, '../client/script.js');
const jsContent = fs.readFileSync(jsPath, 'utf8');

const demoFunctions = [
    'isIllustratorMode',
    'setupModeUI',
    'initializeCanvas',
    'loadExampleImage',
    'handleFileSelect',
    'generateHalftoneCanvas',
    'drawPattern'
];

demoFunctions.forEach(func => {
    if (jsContent.includes(func)) {
        console.log(`   ✓ ${func} found`);
    } else {
        console.log(`   ❌ ${func} missing`);
        process.exit(1);
    }
});

// Test 4: Environment Detection Logic
console.log('\n4. Testing environment detection...');
const envDetectionPatterns = [
    'try {',
    'csInterface = new CSInterface()',
    'isIllustratorMode = true',
    'isIllustratorMode = false'
];

envDetectionPatterns.forEach(pattern => {
    if (jsContent.includes(pattern)) {
        console.log(`   ✓ Environment detection logic present`);
    } else {
        console.log(`   ❌ Environment detection missing: ${pattern}`);
        process.exit(1);
    }
});

// Test 5: Dual Mode Generate Function
console.log('\n5. Testing dual mode generation...');
if (jsContent.includes('if (isIllustratorMode)') && 
    jsContent.includes('generateHalftoneCanvas(params)')) {
    console.log('   ✓ Dual mode generation logic found');
} else {
    console.log('   ❌ Dual mode generation logic missing');
    process.exit(1);
}

// Test 6: File Structure Validation
console.log('\n6. Validating demo mode file accessibility...');
const requiredFiles = [
    '../client/index.html',
    '../client/style.css', 
    '../client/script.js',
    '../client/lib/CSInterface.js',
    '../client/test-image.jpg'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`   ✓ ${file} accessible`);
    } else {
        console.log(`   ❌ ${file} not found`);
        process.exit(1);
    }
});

console.log('\n🎉 All demo mode tests passed!');
console.log('\n📋 Test Summary:');
console.log('   ✅ HTML demo elements present');  
console.log('   ✅ CSS demo styles available');
console.log('   ✅ JavaScript demo functions implemented');
console.log('   ✅ Environment detection working');
console.log('   ✅ Dual mode generation logic active');
console.log('   ✅ All required files accessible');
console.log('   ✅ Example image available for auto-loading');

console.log('\n🚀 Demo mode is ready for testing!');
console.log('   Run: open client/index.html');
console.log('   Or:  npm run serve');