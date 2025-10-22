#!/usr/bin/env node
/**
 * Development Watcher for Halftone Generator Plugin
 * Watches for file changes and automatically reinstalls the plugin
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🔄 Starting development watcher for Halftone Generator plugin...');
console.log('   Watching for changes in client/, host/, and CSXS/ directories');
console.log('   The plugin will be automatically reinstalled when files change');
console.log('   Press Ctrl+C to stop watching\n');

// Directories to watch
const watchDirs = ['client', 'host', 'CSXS'];
const watchedFiles = new Set();

// Debounce timer to avoid too frequent reinstalls
let reinstallTimer = null;
const DEBOUNCE_MS = 1000; // Wait 1 second after last change

/**
 * Reinstall the plugin
 */
function reinstallPlugin() {
    console.log('🔄 File changes detected, reinstalling plugin...');
    
    const child = spawn('node', ['scripts/plugin-manager.js', 'reinstall'], {
        stdio: 'inherit',
        shell: true
    });
    
    child.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Plugin reinstalled successfully!');
            console.log('   Restart Illustrator or refresh the panel to see changes\n');
        } else {
            console.log('❌ Plugin reinstall failed\n');
        }
        console.log('👀 Watching for more changes...\n');
    });
}

/**
 * Schedule a reinstall (debounced)
 */
function scheduleReinstall() {
    if (reinstallTimer) {
        clearTimeout(reinstallTimer);
    }
    
    reinstallTimer = setTimeout(reinstallPlugin, DEBOUNCE_MS);
}

/**
 * Watch a directory recursively
 */
function watchDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }
    
    try {
        const watcher = fs.watch(dirPath, { recursive: true }, (eventType, filename) => {
            if (filename) {
                const fullPath = path.join(dirPath, filename);
                
                // Ignore certain file types
                if (filename.endsWith('.log') || 
                    filename.endsWith('.tmp') || 
                    filename.startsWith('.') ||
                    filename.includes('node_modules')) {
                    return;
                }
                
                console.log(`📝 Changed: ${path.relative(process.cwd(), fullPath)} (${eventType})`);
                scheduleReinstall();
            }
        });
        
        console.log(`👀 Watching: ${dirPath}`);
        
        // Handle watcher errors
        watcher.on('error', (error) => {
            console.log(`❌ Watcher error for ${dirPath}:`, error.message);
        });
        
        return watcher;
    } catch (error) {
        console.log(`❌ Could not watch ${dirPath}:`, error.message);
    }
}

// Start watching directories
const watchers = [];
for (const dir of watchDirs) {
    const watcher = watchDirectory(dir);
    if (watcher) {
        watchers.push(watcher);
    }
}

// Also watch the manifest file specifically
const manifestPath = path.join('CSXS', 'manifest.xml');
if (fs.existsSync(manifestPath)) {
    try {
        const manifestWatcher = fs.watch(manifestPath, (eventType) => {
            console.log(`📝 Manifest changed (${eventType})`);
            scheduleReinstall();
        });
        watchers.push(manifestWatcher);
        console.log('👀 Watching: CSXS/manifest.xml');
    } catch (error) {
        console.log('❌ Could not watch manifest:', error.message);
    }
}

console.log('\n🚀 Watcher started! Make changes to your plugin files...\n');

// Handle cleanup on exit
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping file watcher...');
    
    watchers.forEach(watcher => {
        try {
            watcher.close();
        } catch (error) {
            // Ignore close errors
        }
    });
    
    if (reinstallTimer) {
        clearTimeout(reinstallTimer);
    }
    
    console.log('✅ File watcher stopped');
    process.exit(0);
});

// Keep the process alive
process.stdin.resume();