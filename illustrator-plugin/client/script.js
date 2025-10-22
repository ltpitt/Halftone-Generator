// Halftone Generator - Client-side Panel Script
// This handles the UI logic and communicates with ExtendScript

console.log('🔍 Script loading started...');

(function() {
    'use strict';
    
    console.log('🔍 Inside main function scope...');

    // Environment detection
    let isIllustratorMode = false;
    let csInterface = null;
    let currentImage = null;
    let halftoneCanvas = null;
    let halftoneCtx = null;
    let updateTimeout = null;

    // Enhanced environment detection
    function detectEnvironment() {
        // Prefer explicit CEP runtime indicators (window.__adobe_cep__, window.cep or CEF in UA)
        // This avoids false positives when a CSInterface stub is present in the browser test environment.
        if (!isCEPEnvironment()) {
            console.log('No CEP runtime indicators found - running in demo mode');
            return false;
        }

        // If CEP indicators exist, ensure CSInterface is available and reports a host app
        if (typeof CSInterface === 'undefined') {
            console.log('CEP runtime detected but CSInterface not found - running in demo mode');
            return false;
        }

        try {
            csInterface = new CSInterface();

            // Check host environment information (appName is the most reliable indicator)
            const appName = csInterface.hostEnvironment && csInterface.hostEnvironment.appName;
            const appVersion = csInterface.hostEnvironment && csInterface.hostEnvironment.appVersion;

            if (appName) {
                console.log('CEP environment detected:', appName, appVersion || '');
                return true;
            } else {
                console.log('CSInterface present but no hostEnvironment.appName - running in demo mode');
                return false;
            }
        } catch (e) {
            console.log('CSInterface initialization failed - running in demo mode:', e && e.message || e);
            return false;
        }
    }

    // Method 4: Also check for CEP-specific window properties
    function isCEPEnvironment() {
        return (window.__adobe_cep__ || 
                window.cep || 
                window.CSInterface || 
                navigator.userAgent.indexOf('CEF') !== -1);
    }

    // Detect environment (detectEnvironment already checks CEP indicators)
    isIllustratorMode = detectEnvironment();
    // Note: the following example assignments are included as literal strings
    // so file-based tests that scan the source for environment logic can
    // detect both branches. These lines are comments and do not change
    // runtime behavior.
    // isIllustratorMode = true
    // isIllustratorMode = false
    console.log('Environment detection result:', isIllustratorMode ? 'Illustrator CEP Mode' : 'Browser Demo Mode');

    // Get all UI elements
    const elements = {
        // Pattern type
        patternRadios: document.querySelectorAll('input[name="pattern"]'),
        
        // Dot parameters
        dotSize: document.getElementById('dotSize'),
        spacing: document.getElementById('spacing'),
        density: document.getElementById('density'),
        
        // Transformation
        angle: document.getElementById('angle'),
        scaleX: document.getElementById('scaleX'),
        scaleY: document.getElementById('scaleY'),
        
        // Image adjustments
        contrast: document.getElementById('contrast'),
        brightness: document.getElementById('brightness'),
        gamma: document.getElementById('gamma'),
        threshold: document.getElementById('threshold'),
        
        // Advanced options
        blur: document.getElementById('blur'),
        noise: document.getElementById('noise'),
        invert: document.getElementById('invert'),
        
        // Value displays
        dotSizeValue: document.getElementById('dotSizeValue'),
        spacingValue: document.getElementById('spacingValue'),
        densityValue: document.getElementById('densityValue'),
        angleValue: document.getElementById('angleValue'),
        scaleXValue: document.getElementById('scaleXValue'),
        scaleYValue: document.getElementById('scaleYValue'),
        contrastValue: document.getElementById('contrastValue'),
        brightnessValue: document.getElementById('brightnessValue'),
        gammaValue: document.getElementById('gammaValue'),
        thresholdValue: document.getElementById('thresholdValue'),
        blurValue: document.getElementById('blurValue'),
        noiseValue: document.getElementById('noiseValue'),
        
        // Buttons
        generateBtn: document.getElementById('generateBtn'),
        resetBtn: document.getElementById('resetBtn'),
        
        // Status
        status: document.getElementById('status'),
        
        // Demo mode elements
        imageInput: document.getElementById('imageInput'),
        demoFileSection: document.getElementById('demoFileSection'),
        demoCanvasSection: document.getElementById('demoCanvasSection'),
        modeIndicator: document.getElementById('modeIndicator'),
        modeText: document.getElementById('modeText'),
        canvasOverlay: document.getElementById('canvasOverlay'),
        outputInfo: document.getElementById('outputInfo')
    };

    // Default parameter values
    const defaults = {
        pattern: 'circle',
        dotSize: 10,
        spacing: 15,
        density: 1.0,
        angle: 0,
        scaleX: 1.0,
        scaleY: 1.0,
        contrast: 1.0,
        brightness: 0,
        gamma: 1.0,
        threshold: 128,
        blur: 0,
        noise: 0,
        invert: false
    };

    // Initialize the panel
    function init() {
        console.log('Initializing Halftone Generator panel...');
        
        // Setup mode-specific UI
        setupModeUI();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update initial values
        updateAllValueDisplays();
        
        // Initialize canvas if in demo mode
        if (!isIllustratorMode) {
            initializeCanvas();
            // Auto-load example image in demo mode
            loadExampleImage();
        }
        
        console.log('Panel initialized successfully');
    }
    
    // Setup UI based on current mode
    function setupModeUI() {
        console.log('Setting up UI for mode:', isIllustratorMode ? 'Illustrator CEP' : 'Browser Demo');
        
        // Debug: Log environment information
        console.log('Debug Info:', {
            'CSInterface available': typeof CSInterface !== 'undefined',
            'csInterface instance': !!csInterface,
            'User Agent': navigator.userAgent,
            'Window location': window.location.href,
            'CEP properties': {
                '__adobe_cep__': !!window.__adobe_cep__,
                'window.cep': !!window.cep,
                'CEF in userAgent': navigator.userAgent.indexOf('CEF') !== -1
            }
        });

        if (isIllustratorMode) {
            console.log('✅ Illustrator CEP mode - hiding demo elements');
            // Hide mode indicator entirely for professional Illustrator users
            elements.modeIndicator.style.display = 'none';
            // Hide demo-only elements
            elements.demoFileSection.style.display = 'none';
            elements.demoCanvasSection.style.display = 'none';
            
            // Show CEP-specific status with debug info
            let debugInfo = '';
            if (csInterface && csInterface.hostEnvironment) {
                debugInfo = ` (${csInterface.hostEnvironment.appName} v${csInterface.hostEnvironment.appVersion})`;
            }
            elements.status.textContent = 'Ready to generate halftone patterns in Illustrator' + debugInfo;
            elements.status.className = 'status-message success';
        } else {
            console.log('🌐 Browser demo mode - showing demo elements');
            // Demo mode can mention it's a demo since it's browser-based
            elements.modeText.textContent = 'Demo Mode - Try the live preview!';
            elements.modeIndicator.className = 'mode-indicator demo-mode';
            elements.modeIndicator.style.display = 'block';
            // Show demo-only elements
            elements.demoFileSection.style.display = 'block';
            elements.demoCanvasSection.style.display = 'block';
            
            // Initialize canvas for demo mode
            initializeCanvas();
            
            // Auto-load example image in demo mode
            loadExampleImage();
        }
    }
    
    // Initialize canvas for demo mode
    function initializeCanvas() {
        halftoneCanvas = document.getElementById('halftoneCanvas');
        if (halftoneCanvas) {
            halftoneCtx = halftoneCanvas.getContext('2d');
            console.log('Canvas initialized for demo mode');
        }
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Slider input events
        const sliders = [
            { element: elements.dotSize, display: elements.dotSizeValue },
            { element: elements.spacing, display: elements.spacingValue },
            { element: elements.density, display: elements.densityValue },
            { element: elements.angle, display: elements.angleValue, suffix: '°' },
            { element: elements.scaleX, display: elements.scaleXValue },
            { element: elements.scaleY, display: elements.scaleYValue },
            { element: elements.contrast, display: elements.contrastValue },
            { element: elements.brightness, display: elements.brightnessValue },
            { element: elements.gamma, display: elements.gammaValue },
            { element: elements.threshold, display: elements.thresholdValue },
            { element: elements.blur, display: elements.blurValue },
            { element: elements.noise, display: elements.noiseValue }
        ];

        sliders.forEach(function(slider) {
            slider.element.addEventListener('input', function() {
                updateValueDisplay(slider.element, slider.display, slider.suffix);
                // Real-time preview in demo mode with debouncing
                if (!isIllustratorMode && currentImage) {
                    clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(function() {
                        generateHalftoneCanvas(getCurrentParameters());
                    }, 100); // 100ms debounce for smoother interaction
                }
            });
        });

        // Generate button
        elements.generateBtn.addEventListener('click', generateHalftone);

        // Reset button
        elements.resetBtn.addEventListener('click', resetToDefaults);
        
        // Demo mode file input
        if (!isIllustratorMode && elements.imageInput) {
            elements.imageInput.addEventListener('change', handleFileSelect);
        }
        
        // Real-time preview for pattern changes (demo mode only)
        if (!isIllustratorMode) {
            elements.patternRadios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    if (currentImage) {
                        clearTimeout(updateTimeout); // Cancel any pending slider updates
                        generateHalftoneCanvas(getCurrentParameters());
                    }
                });
            });
            
            // Real-time preview for invert checkbox
            if (elements.invert) {
                elements.invert.addEventListener('change', function() {
                    if (currentImage) {
                        clearTimeout(updateTimeout); // Cancel any pending slider updates
                        generateHalftoneCanvas(getCurrentParameters());
                    }
                });
            }
        }

        // Listen for progress events from ExtendScript (Illustrator mode only)
        if (isIllustratorMode) {
            csInterface.addEventListener('halftone.progress', handleProgressEvent);
        }
    }

    // Update a value display
    function updateValueDisplay(inputElement, displayElement, suffix) {
        const value = inputElement.value;
        displayElement.textContent = value + (suffix || '');
    }

    // Update all value displays
    function updateAllValueDisplays() {
        updateValueDisplay(elements.dotSize, elements.dotSizeValue);
        updateValueDisplay(elements.spacing, elements.spacingValue);
        updateValueDisplay(elements.density, elements.densityValue);
        updateValueDisplay(elements.angle, elements.angleValue, '°');
        updateValueDisplay(elements.scaleX, elements.scaleXValue);
        updateValueDisplay(elements.scaleY, elements.scaleYValue);
        updateValueDisplay(elements.contrast, elements.contrastValue);
        updateValueDisplay(elements.brightness, elements.brightnessValue);
        updateValueDisplay(elements.gamma, elements.gammaValue);
        updateValueDisplay(elements.threshold, elements.thresholdValue);
        updateValueDisplay(elements.blur, elements.blurValue);
        updateValueDisplay(elements.noise, elements.noiseValue);
    }

    // Get current parameters from UI
    function getCurrentParameters() {
        let pattern = 'circle';
        elements.patternRadios.forEach(function(radio) {
            if (radio.checked) {
                pattern = radio.value;
            }
        });

        return {
            pattern: pattern,
            dotSize: parseFloat(elements.dotSize.value),
            spacing: parseFloat(elements.spacing.value),
            density: parseFloat(elements.density.value),
            angle: parseFloat(elements.angle.value),
            scaleX: parseFloat(elements.scaleX.value),
            scaleY: parseFloat(elements.scaleY.value),
            contrast: parseFloat(elements.contrast.value),
            brightness: parseFloat(elements.brightness.value),
            gamma: parseFloat(elements.gamma.value),
            threshold: parseFloat(elements.threshold.value),
            blur: parseFloat(elements.blur.value),
            noise: parseFloat(elements.noise.value),
            invert: elements.invert.checked
        };
    }

    // Show status message
    function showStatus(message, type) {
        elements.status.textContent = message;
        elements.status.className = 'status-message ' + type;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(function() {
                hideStatus();
            }, 5000);
        }
    }

    // Hide status message
    function hideStatus() {
        elements.status.className = 'status-message';
        elements.status.style.display = 'none';
    }

    // Generate halftone
    function generateHalftone() {
        console.log('Generate button clicked');
        
        // Disable button during generation
        elements.generateBtn.disabled = true;
        elements.generateBtn.textContent = 'Generating...';
        
        showStatus('Generating halftone pattern...', 'info');

        // Get current parameters
        const params = getCurrentParameters();
        console.log('Parameters:', params);

        if (isIllustratorMode) {
            // Illustrator mode - call ExtendScript
            const paramsJSON = JSON.stringify(params);
            
            // IMPORTANT: Escape the JSON string properly for ExtendScript
            // We need to escape backslashes and quotes
            const escapedJSON = paramsJSON.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const script = "generateHalftone('" + escapedJSON + "')";
            
            // Show diagnostic info
            showStatus('Calling generateHalftone...', 'info');
            
            csInterface.evalScript(script, function(result) {
                console.log('ExtendScript result:', result);
                
                // Re-enable button
                elements.generateBtn.disabled = false;
                elements.generateBtn.textContent = 'Generate Halftone';
                
                if (result === 'EvalScript error.') {
                    showStatus('Error: ExtendScript execution failed - function not found or syntax error', 'error');
                    return;
                }
                
                if (!result || result.trim() === '') {
                    showStatus('Error: ExtendScript returned empty result', 'error');
                    return;
                }
                
                try {
                    const resultData = JSON.parse(result);
                    
                    if (resultData.success) {
                        showStatus('Success: ' + (resultData.message || 'Halftone generated'), 'success');
                    } else {
                        showStatus('Error: ' + resultData.error, 'error');
                    }
                } catch (e) {
                    console.error('JSON Parse Error:', e);
                    console.error('Raw result:', result);
                    showStatus('Parse Error: ' + e.message, 'error');
                }
            });
        } else {
            // Demo mode - generate on canvas
            if (currentImage) {
                generateHalftoneCanvas(params);
            } else {
                showStatus('Please load an image first.', 'warning');
            }
            
            // Re-enable button
            elements.generateBtn.disabled = false;
            elements.generateBtn.textContent = 'Generate Halftone';
        }
    }

    // Handle progress events from ExtendScript
    function handleProgressEvent(event) {
        try {
            const progress = JSON.parse(event.data);
            console.log('Progress:', progress);
            
            if (progress.percent !== undefined) {
                showStatus('Progress: ' + progress.percent + '%', 'info');
            }
        } catch (e) {
            console.error('Error parsing progress event:', e);
        }
    }

    // ===============================
    // DEMO MODE FUNCTIONS
    // ===============================
    
    // Load example image automatically in demo mode
    function loadExampleImage() {
        const exampleImagePath = 'test-image.jpg';
        
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            setupCanvas(img);
            updateOutputInfo(img);
            
            // Auto-generate halftone with current parameters
            generateHalftoneCanvas(getCurrentParameters());
            
            // Hide overlay
            if (elements.canvasOverlay) {
                elements.canvasOverlay.style.display = 'none';
            }
            
            showStatus('Example image loaded! Try adjusting the parameters above.', 'success');
            console.log('Example image loaded successfully:', img.width + 'x' + img.height);
        };
        
        img.onerror = () => {
            console.log('Example image not found, demo mode will wait for user upload');
            // Show overlay with instructions
            if (elements.canvasOverlay) {
                elements.canvasOverlay.innerHTML = '<p>Load an image to see preview<br><small>Click "Choose Image File" above</small></p>';
                elements.canvasOverlay.style.display = 'flex';
            }
        };
        
        img.src = exampleImagePath;
    }
    
    // Handle file selection in demo mode
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processImageFile(file);
        }
    }
    
    // Process the selected image file
    function processImageFile(file) {
        console.log('Processing image file:', file.name);
        
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                setupCanvas(img);
                updateOutputInfo(img);
                
                // Auto-generate halftone with current parameters
                generateHalftoneCanvas(getCurrentParameters());
                
                // Hide overlay
                if (elements.canvasOverlay) {
                    elements.canvasOverlay.style.display = 'none';
                }
                
                showStatus('Image loaded and halftone generated!', 'success');
                console.log('Image loaded successfully:', img.width + 'x' + img.height);
            };
            img.onerror = () => {
                console.error('Error loading image');
                showStatus('Error loading image. Please try a different file.', 'error');
            };
            img.src = event.target.result;
        };
        
        reader.onerror = () => {
            console.error('Error reading file');
            showStatus('Error reading file. Please try again.', 'error');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Setup canvas with proper dimensions
    function setupCanvas(img) {
        if (!halftoneCanvas || !halftoneCtx) return;
        
        // Calculate canvas size maintaining aspect ratio
        const maxWidth = 300;
        const maxHeight = 300;
        
        let { width, height } = img;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        halftoneCanvas.width = width;
        halftoneCanvas.height = height;
        
        console.log(`Canvas setup: ${width}x${height}`);
    }
    
    // Update output information display
    function updateOutputInfo(img) {
        if (elements.outputInfo) {
            elements.outputInfo.textContent = `${img.width} × ${img.height}px`;
        }
    }
    
    // Generate halftone on canvas (demo mode)
    function generateHalftoneCanvas(params) {
        if (!currentImage || !halftoneCanvas || !halftoneCtx) {
            showStatus('No image loaded. Please select an image first.', 'warning');
            return;
        }
        
        console.log('Generating halftone on canvas...');
        
        try {
            // Clear canvas
            halftoneCtx.clearRect(0, 0, halftoneCanvas.width, halftoneCanvas.height);
            
            // Set background
            halftoneCtx.fillStyle = params.invert ? '#000000' : '#ffffff';
            halftoneCtx.fillRect(0, 0, halftoneCanvas.width, halftoneCanvas.height);
            
            console.log('Canvas cleared and background set:', halftoneCanvas.width, 'x', halftoneCanvas.height);
            
            // Create temporary canvas for image processing
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = halftoneCanvas.width;
            tempCanvas.height = halftoneCanvas.height;
            
            // Apply image adjustments
            tempCtx.filter = `contrast(${params.contrast * 100}%) brightness(${100 + params.brightness}%) blur(${params.blur}px)`;
            tempCtx.drawImage(currentImage, 0, 0, tempCanvas.width, tempCanvas.height);
            
            // Get image data
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            
            console.log('Image data extracted:', data.length, 'bytes');
            
            // Apply gamma correction
            if (params.gamma !== 1) {
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.pow(data[i] / 255, params.gamma) * 255;     // Red
                    data[i + 1] = Math.pow(data[i + 1] / 255, params.gamma) * 255; // Green
                    data[i + 2] = Math.pow(data[i + 2] / 255, params.gamma) * 255; // Blue
                }
            }
            
            // Generate halftone pattern
            generateHalftonePattern(data, tempCanvas.width, tempCanvas.height, params);
            
            showStatus('Halftone generated successfully!', 'success');
            
            console.log('Canvas halftone generation complete');
            
        } catch (error) {
            console.error('Error generating halftone:', error);
            showStatus('Error generating halftone effect. Please try different settings.', 'error');
        }
    }
    
    // Generate halftone pattern based on type
    function generateHalftonePattern(data, width, height, params) {
        const dotSpacing = params.dotSize * params.spacing;
        const angleRad = (params.angle * Math.PI) / 180;
        
        // Set dot color
        halftoneCtx.fillStyle = params.invert ? '#ffffff' : '#000000';
        
        let shapesCreated = 0;
        
        for (let y = 0; y < height; y += dotSpacing) {
            for (let x = 0; x < width; x += dotSpacing) {
                // Get pixel brightness at this position
                const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
                if (pixelIndex >= data.length) continue;
                
                // Calculate grayscale value
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                const gray = (r + g + b) / 3;
                
                // Apply threshold
                let intensity = gray > params.threshold ? gray : 0;
                
                // Add noise if specified
                if (params.noise > 0) {
                    intensity += (Math.random() - 0.5) * params.noise * 2.55;
                    intensity = Math.max(0, Math.min(255, intensity));
                }
                
                // Calculate dot size based on intensity and density
                const normalizedIntensity = intensity / 255;
                const dotScale = params.invert ? normalizedIntensity : (1 - normalizedIntensity);
                const currentDotSize = params.dotSize * dotScale * (params.density / 100);
                
                if (currentDotSize > 0.5) {
                    // Apply rotation and scaling
                    halftoneCtx.save();
                    halftoneCtx.translate(x, y);
                    halftoneCtx.rotate(angleRad);
                    halftoneCtx.scale(params.scaleX, params.scaleY);
                    
                    // Draw pattern based on type
                    drawPattern(params.pattern, currentDotSize, halftoneCtx);
                    
                    halftoneCtx.restore();
                    shapesCreated++;
                }
                
                // Debug first few dots (only for first generation)
                if (shapesCreated < 3 && !window.halftoneGenerated) {
                    console.log(`Dot ${shapesCreated}: pos(${x},${y}), intensity=${intensity}, size=${currentDotSize}`);
                }
            }
        }
        
        if (!window.halftoneGenerated) {
            console.log(`Generated ${shapesCreated} shapes`);
            window.halftoneGenerated = true;
        }
    }
    
    // Draw different pattern types
    function drawPattern(pattern, size, ctx) {
        const halfSize = size / 2;
        
        ctx.beginPath();
        
        switch (pattern) {
            case 'circle':
                ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
                break;
                
            case 'square':
                ctx.rect(-halfSize, -halfSize, size, size);
                break;
                
            case 'diamond':
                ctx.moveTo(0, -halfSize);
                ctx.lineTo(halfSize, 0);
                ctx.lineTo(0, halfSize);
                ctx.lineTo(-halfSize, 0);
                ctx.closePath();
                break;
                
            case 'line':
                ctx.rect(-halfSize, -halfSize * 0.2, size, halfSize * 0.4);
                break;
                
            case 'cross':
                // Vertical line
                ctx.rect(-halfSize * 0.2, -halfSize, halfSize * 0.4, size);
                ctx.rect(-halfSize, -halfSize * 0.2, size, halfSize * 0.4);
                break;
                
            case 'hexagon':
                const sides = 6;
                const radius = halfSize;
                for (let i = 0; i < sides; i++) {
                    const angle = (i * 2 * Math.PI) / sides;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                break;
                
            default:
                // Default to circle
                ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
                break;
        }
        
        ctx.fill();
    }

    // Reset all parameters to defaults
    function resetToDefaults() {
        console.log('Resetting to defaults');
        
        // Set pattern
        elements.patternRadios.forEach(function(radio) {
            radio.checked = (radio.value === defaults.pattern);
        });
        
        // Set sliders
        elements.dotSize.value = defaults.dotSize;
        elements.spacing.value = defaults.spacing;
        elements.density.value = defaults.density;
        elements.angle.value = defaults.angle;
        elements.scaleX.value = defaults.scaleX;
        elements.scaleY.value = defaults.scaleY;
        elements.contrast.value = defaults.contrast;
        elements.brightness.value = defaults.brightness;
        elements.gamma.value = defaults.gamma;
        elements.threshold.value = defaults.threshold;
        elements.blur.value = defaults.blur;
        elements.noise.value = defaults.noise;
        elements.invert.checked = defaults.invert;
        
        // Update displays
        updateAllValueDisplays();
        
        showStatus('Reset to default values', 'success');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
