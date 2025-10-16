// Halftone Generator - Client-side Panel Script
// This handles the UI logic and communicates with ExtendScript

(function() {
    'use strict';

    // Initialize CEP interface
    const csInterface = new CSInterface();

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
        status: document.getElementById('status')
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
        
        // Setup event listeners
        setupEventListeners();
        
        // Update initial values
        updateAllValueDisplays();
        
        console.log('Panel initialized successfully');
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
            });
        });

        // Generate button
        elements.generateBtn.addEventListener('click', generateHalftone);

        // Reset button
        elements.resetBtn.addEventListener('click', resetToDefaults);

        // Listen for progress events from ExtendScript
        csInterface.addEventListener('halftone.progress', handleProgressEvent);
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

        // Call ExtendScript function
        const paramsJSON = JSON.stringify(params);
        const script = 'generateHalftone(' + paramsJSON + ')';
        
        csInterface.evalScript(script, function(result) {
            console.log('ExtendScript result:', result);
            
            // Re-enable button
            elements.generateBtn.disabled = false;
            elements.generateBtn.textContent = 'Generate Halftone';
            
            if (result === 'EvalScript error.') {
                showStatus('Error: ExtendScript execution failed', 'error');
                return;
            }
            
            try {
                const resultData = JSON.parse(result);
                
                if (resultData.success) {
                    showStatus('Halftone generated successfully! Created ' + resultData.shapesCreated + ' shapes.', 'success');
                } else {
                    showStatus('Error: ' + resultData.error, 'error');
                }
            } catch (e) {
                console.error('Error parsing result:', e);
                showStatus('Error: Invalid response from ExtendScript', 'error');
            }
        });
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
