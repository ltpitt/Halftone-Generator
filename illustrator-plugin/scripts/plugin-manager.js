#!/usr/bin/env node
/**
 * Plugin Installation Manager for Adobe Illustrator
 * Automates the installation, update, and removal of the Halftone Generator plugin
 */

const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const os = require('os');

// Configuration
const PLUGIN_NAME = 'HalftoneGenerator';
const CEP_VERSION = '9'; // CEP 9.0 for modern Illustrator versions

/**
 * Get the platform-specific CEP extensions directory
 */
function getCepExtensionsPath() {
    const platform = os.platform();
    
    if (platform === 'win32') {
        return path.join(os.homedir(), 'AppData', 'Roaming', 'Adobe', 'CEP', 'extensions');
    } else if (platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', 'Adobe', 'CEP', 'extensions');
    } else {
        throw new Error(`Unsupported platform: ${platform}`);
    }
}

/**
 * Ensure the CEP extensions directory exists
 */
function ensureCepDirectory() {
    const cepPath = getCepExtensionsPath();
    if (!fs.existsSync(cepPath)) {
        console.log('📁 Creating CEP extensions directory...');
        fs.mkdirSync(cepPath, { recursive: true });
        console.log(`✅ Created: ${cepPath}`);
    }
    return cepPath;
}

/**
 * Enable debug mode for CEP (allows unsigned extensions)
 */
function enableDebugMode() {
    const platform = os.platform();
    
    console.log('⚙️  Enabling debug mode for CEP extensions...');
    
    if (platform === 'win32') {
        try {
            // Create registry key and set debug mode
            execSync(`reg add "HKCU\\Software\\Adobe\\CSXS.${CEP_VERSION}" /v PlayerDebugMode /t REG_SZ /d 1 /f`, { 
                stdio: 'ignore' 
            });
            execSync(`reg add "HKCU\\Software\\Adobe\\CSXS.${CEP_VERSION}" /v LogLevel /t REG_SZ /d 6 /f`, { 
                stdio: 'ignore' 
            });
            console.log('✅ Debug mode enabled (Windows Registry)');
        } catch (error) {
            console.log('⚠️  Could not set registry keys. You may need to run as Administrator.');
            console.log('   Alternative: Run these commands in PowerShell as Administrator:');
            console.log(`   reg add "HKCU\\Software\\Adobe\\CSXS.${CEP_VERSION}" /v PlayerDebugMode /t REG_SZ /d 1 /f`);
            console.log(`   reg add "HKCU\\Software\\Adobe\\CSXS.${CEP_VERSION}" /v LogLevel /t REG_SZ /d 6 /f`);
        }
    } else if (platform === 'darwin') {
        try {
            execSync(`defaults write com.adobe.CSXS.${CEP_VERSION} PlayerDebugMode 1`, { stdio: 'ignore' });
            execSync(`defaults write com.adobe.CSXS.${CEP_VERSION} LogLevel 6`, { stdio: 'ignore' });
            console.log('✅ Debug mode enabled (macOS defaults)');
        } catch (error) {
            console.log('⚠️  Could not set macOS defaults:', error.message);
        }
    }
}

/**
 * Copy plugin files to CEP extensions directory
 */
function installPlugin() {
    const cepPath = ensureCepDirectory();
    const pluginPath = path.join(cepPath, PLUGIN_NAME);
    const sourcePath = process.cwd();
    
    console.log('📦 Installing Halftone Generator plugin...');
    console.log(`   Source: ${sourcePath}`);
    console.log(`   Target: ${pluginPath}`);
    
    // Remove existing installation
    if (fs.existsSync(pluginPath)) {
        console.log('🗑️  Removing existing installation...');
        fs.rmSync(pluginPath, { recursive: true, force: true });
    }
    
    // Copy files
    console.log('📋 Copying plugin files...');
    copyDirectory(sourcePath, pluginPath);
    
    console.log('✅ Plugin installed successfully!');
    console.log('\n🎨 Next steps:');
    console.log('   1. Restart Adobe Illustrator');
    console.log('   2. Go to Window → Extensions → Halftone Generator');
    console.log('   3. The plugin panel should appear');
    
    return pluginPath;
}

/**
 * Remove plugin from CEP extensions directory
 */
function uninstallPlugin() {
    const cepPath = getCepExtensionsPath();
    const pluginPath = path.join(cepPath, PLUGIN_NAME);
    
    if (!fs.existsSync(pluginPath)) {
        console.log('ℹ️  Plugin is not currently installed.');
        return;
    }
    
    console.log('🗑️  Uninstalling Halftone Generator plugin...');
    fs.rmSync(pluginPath, { recursive: true, force: true });
    console.log('✅ Plugin uninstalled successfully!');
    console.log('   Restart Illustrator to complete removal.');
}

/**
 * Check if plugin is installed and show status
 */
function checkStatus() {
    const cepPath = getCepExtensionsPath();
    const pluginPath = path.join(cepPath, PLUGIN_NAME);
    
    console.log('📊 Plugin Status:');
    console.log(`   CEP Extensions Path: ${cepPath}`);
    console.log(`   Plugin Path: ${pluginPath}`);
    console.log(`   Installed: ${fs.existsSync(pluginPath) ? '✅ YES' : '❌ NO'}`);
    
    if (fs.existsSync(pluginPath)) {
        try {
            const stats = fs.statSync(pluginPath);
            console.log(`   Last Modified: ${stats.mtime.toLocaleString()}`);
            
            // Check key files
            const manifestPath = path.join(pluginPath, 'CSXS', 'manifest.xml');
            const clientPath = path.join(pluginPath, 'client', 'index.html');
            const hostPath = path.join(pluginPath, 'host', 'index.jsx');
            
            console.log(`   Manifest: ${fs.existsSync(manifestPath) ? '✅' : '❌'}`);
            console.log(`   Client UI: ${fs.existsSync(clientPath) ? '✅' : '❌'}`);
            console.log(`   Host Script: ${fs.existsSync(hostPath) ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`   Error reading plugin: ${error.message}`);
        }
    }
}

/**
 * Copy directory recursively, excluding development files
 */
function copyDirectory(src, dest) {
    // Files and directories to exclude from plugin installation
    const excludePatterns = [
        'node_modules',
        'test-results',
        'playwright-report',
        '.git',
        '.gitignore',
        'package-lock.json',
        'playwright.config.js',
        'tests',
        'scripts/test-*.js',
        '*.md',
        '*.log'
    ];
    
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        // Skip excluded files/directories
        if (excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(entry.name);
            }
            return entry.name === pattern || entry.name.startsWith(pattern);
        })) {
            continue;
        }
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

/**
 * Open CEP debug port for development
 */
function enableDevMode() {
    const platform = os.platform();
    
    console.log('🛠️  Enabling development mode...');
    
    // Enable debug mode first
    enableDebugMode();
    
    console.log('🔧 Development mode tips:');
    console.log('   - Plugin files will sync automatically during development');
    console.log('   - Use Chrome DevTools for debugging: http://localhost:8092');
    console.log('   - Restart Illustrator after major changes');
    
    if (platform === 'win32') {
        console.log('   - Check CEP logs: %TEMP%\\csxs9-ILST.log');
    } else {
        console.log('   - Check CEP logs: ~/Library/Logs/CSXS/CEP9-ILST.log');
    }
}

// Command line interface
const command = process.argv[2];

switch (command) {
    case 'install':
        enableDebugMode();
        installPlugin();
        break;
    
    case 'uninstall':
        uninstallPlugin();
        break;
    
    case 'reinstall':
        uninstallPlugin();
        enableDebugMode();
        installPlugin();
        break;
    
    case 'status':
        checkStatus();
        break;
    
    case 'dev':
        enableDevMode();
        installPlugin();
        break;
    
    default:
        console.log('🎨 Halftone Generator - Plugin Installation Manager\n');
        console.log('Usage:');
        console.log('  npm run plugin:install     - Install plugin to Illustrator');
        console.log('  npm run plugin:uninstall   - Remove plugin from Illustrator');
        console.log('  npm run plugin:reinstall   - Reinstall plugin (clean install)');
        console.log('  npm run plugin:status      - Check installation status');
        console.log('  npm run plugin:dev         - Install in development mode');
        console.log('');
        console.log('After installation:');
        console.log('  1. Restart Adobe Illustrator');
        console.log('  2. Access via Window → Extensions → Halftone Generator');
        break;
}