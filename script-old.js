// MODERN HALFTONE GENERATOR - ENHANCED JAVASCRIPT
// ================================================

// Canvas elements
const halftoneCanvas = document.getElementById('halftoneCanvas');
const halftoneCtx = halftoneCanvas.getContext('2d');

// Control elements
const imageUpload = document.getElementById('imageUpload');
const uploadZone = document.getElementById('uploadZone');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadSvg = document.getElementById('downloadSvg');

// Pattern type (radio buttons)
const patternRadios = document.querySelectorAll('input[name="pattern"]');

// Slider controls
const dotSize = document.getElementById('dotSize');
const spacing = document.getElementById('spacing');
const density = document.getElementById('density');
const angle = document.getElementById('angle');
const scaleX = document.getElementById('scaleX');
const scaleY = document.getElementById('scaleY');
const contrast = document.getElementById('contrast');
const brightness = document.getElementById('brightness');
const gamma = document.getElementById('gamma');
const threshold = document.getElementById('threshold');
const blur = document.getElementById('blur');
const noise = document.getElementById('noise');
const invert = document.getElementById('invert');

// Value display elements
const dotSizeValue = document.getElementById('dotSizeValue');
const spacingValue = document.getElementById('spacingValue');
const densityValue = document.getElementById('densityValue');
const angleValue = document.getElementById('angleValue');
const scaleXValue = document.getElementById('scaleXValue');
const scaleYValue = document.getElementById('scaleYValue');
const contrastValue = document.getElementById('contrastValue');
const brightnessValue = document.getElementById('brightnessValue');
const gammaValue = document.getElementById('gammaValue');
const thresholdValue = document.getElementById('thresholdValue');
const blurValue = document.getElementById('blurValue');
const noiseValue = document.getElementById('noiseValue');

// Output info elements
const outputDimensions = document.getElementById('outputDimensions');
const outputFileSize = document.getElementById('outputFileSize');
const canvasOverlay = document.getElementById('canvasOverlay');

// State
let currentImage = null;
let originalImageData = null;

// Initialize the application
function init() {
    // Hide canvas overlay initially
    if (canvasOverlay) {
        canvasOverlay.style.display = 'flex';
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup drag and drop
    setupDragAndDrop();
    
    console.log('Halftone Generator initialized');
}

// Setup all event listeners
function setupEventListeners() {
    // File upload
    if (imageUpload) {
        imageUpload.addEventListener('change', handleFileSelect);
    }
    
    // Upload zone click
    if (uploadZone) {
        uploadZone.addEventListener('click', () => {
            if (imageUpload) imageUpload.click();
        });
    }
    
    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAll);
    }
    
    // Generate button
    if (generateBtn) {
        generateBtn.addEventListener('click', generateHalftone);
    }
    
    // Download buttons
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPNG);
    }
    if (downloadSvg) {
        downloadSvg.addEventListener('click', downloadSVG);
    }
    
    // Slider event listeners with null checks
    const sliders = [
        { element: dotSize, display: dotSizeValue, suffix: 'px' },
        { element: spacing, display: spacingValue, suffix: 'x' },
        { element: density, display: densityValue, suffix: '%' },
        { element: angle, display: angleValue, suffix: '°' },
        { element: scaleX, display: scaleXValue, suffix: '' },
        { element: scaleY, display: scaleYValue, suffix: '' },
        { element: contrast, display: contrastValue, suffix: '%' },
        { element: brightness, display: brightnessValue, suffix: '' },
        { element: gamma, display: gammaValue, suffix: '' },
        { element: threshold, display: thresholdValue, suffix: '' },
        { element: blur, display: blurValue, suffix: 'px' },
        { element: noise, display: noiseValue, suffix: '%' }
    ];
    
    sliders.forEach(({ element, display, suffix }) => {
        if (element && display) {
            element.addEventListener('input', (e) => {
                display.textContent = e.target.value + suffix;
                if (currentImage) {
                    generateHalftone();
                }
            });
        }
    });
    
    // Pattern radio buttons
    patternRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (currentImage) {
                generateHalftone();
            }
        });
    });
    
    // Invert checkbox
    if (invert) {
        invert.addEventListener('change', () => {
            if (currentImage) {
                generateHalftone();
            }
        });
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    if (!uploadZone) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });
    
    uploadZone.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    if (uploadZone) {
        uploadZone.classList.add('dragover');
    }
}

function unhighlight(e) {
    if (uploadZone) {
        uploadZone.classList.remove('dragover');
    }
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        } else {
            alert('Please drop an image file (PNG, JPG, GIF, etc.)');
        }
    }
}

// Handle file selection from input
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processImageFile(file);
    }
}

// Process the selected image file
function processImageFile(file) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            setupCanvas(img);
            generateHalftone();
            updateOutputInfo(img);
            
            // Hide overlay
            if (canvasOverlay) {
                canvasOverlay.style.display = 'none';
            }
        };
        img.onerror = () => {
            alert('Error loading image. Please try a different file.');
        };
        img.src = event.target.result;
    };
    
    reader.onerror = () => {
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsDataURL(file);
}

// Setup canvas with proper dimensions
function setupCanvas(img) {
    if (!halftoneCanvas) return;
    
    // Calculate canvas size maintaining aspect ratio
    const maxWidth = 2000;
    const maxHeight = 2000;
    
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
// Update output information display
function updateOutputInfo(img) {
    if (outputDimensions) {
        outputDimensions.textContent = `${img.width} × ${img.height}px`;
    }
}

// Reset everything
function resetAll() {
    currentImage = null;
    originalImageData = null;
    
    if (imageUpload) {
        imageUpload.value = '';
    }
    
    if (halftoneCanvas) {
        halftoneCtx.clearRect(0, 0, halftoneCanvas.width, halftoneCanvas.height);
        halftoneCanvas.width = 0;
        halftoneCanvas.height = 0;
    }
    
    if (canvasOverlay) {
        canvasOverlay.style.display = 'flex';
    }
    
    if (outputDimensions) {
        outputDimensions.textContent = 'No image loaded';
    }
    
    if (outputFileSize) {
        outputFileSize.textContent = '';
    }
}

// Get current pattern type
function getCurrentPattern() {
    const checked = document.querySelector('input[name="pattern"]:checked');
    return checked ? checked.value : 'circle';
}

// Generate halftone effect
function generateHalftone() {
    if (!currentImage || !halftoneCanvas) {
        console.warn('No image or canvas available');
        return;
    }
    
    console.log('Generating halftone...');
    
    // Get current parameter values
    const params = {
        dotSize: dotSize ? parseFloat(dotSize.value) : 8,
        spacing: spacing ? parseFloat(spacing.value) : 1.2,
        density: density ? parseFloat(density.value) : 100,
        angle: angle ? parseFloat(angle.value) : 45,
        scaleX: scaleX ? parseFloat(scaleX.value) : 1,
        scaleY: scaleY ? parseFloat(scaleY.value) : 1,
        contrast: contrast ? parseFloat(contrast.value) : 100,
        brightness: brightness ? parseFloat(brightness.value) : 0,
        gamma: gamma ? parseFloat(gamma.value) : 1,
        threshold: threshold ? parseFloat(threshold.value) : 128,
        blur: blur ? parseFloat(blur.value) : 0,
        noise: noise ? parseFloat(noise.value) : 0,
        invert: invert ? invert.checked : false,
        pattern: getCurrentPattern()
    };
    
    try {
        // Clear canvas
        halftoneCtx.clearRect(0, 0, halftoneCanvas.width, halftoneCanvas.height);
        
        // Set white background
        halftoneCtx.fillStyle = params.invert ? '#000000' : '#ffffff';
        halftoneCtx.fillRect(0, 0, halftoneCanvas.width, halftoneCanvas.height);
        
        // Draw original image to get pixel data
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = halftoneCanvas.width;
        tempCanvas.height = halftoneCanvas.height;
        
        // Apply image adjustments
        tempCtx.filter = `contrast(${params.contrast}%) brightness(${100 + params.brightness}%) blur(${params.blur}px)`;
        tempCtx.drawImage(currentImage, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Get image data
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        
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
        
        // Update file size info
        updateFileSizeInfo();
        
        console.log('Halftone generation complete');
        
    } catch (error) {
        console.error('Error generating halftone:', error);
        alert('Error generating halftone effect. Please try different settings.');
    }
}

// Generate halftone pattern based on type
function generateHalftonePattern(data, width, height, params) {
    const dotSpacing = params.dotSize * params.spacing;
    const angleRad = (params.angle * Math.PI) / 180;
    
    // Set dot color
    halftoneCtx.fillStyle = params.invert ? '#ffffff' : '#000000';
    
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
            }
        }
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
            const radius = halfSize;
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI) / 3;
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
            ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
    }
    
    ctx.fill();
}

// Update file size information
function updateFileSizeInfo() {
    if (!outputFileSize || !halftoneCanvas) return;
    
    try {
        const dataURL = halftoneCanvas.toDataURL('image/png');
        const sizeInBytes = Math.round((dataURL.length * 3) / 4);
        const sizeInKB = (sizeInBytes / 1024).toFixed(1);
        outputFileSize.textContent = `${sizeInKB} KB`;
    } catch (error) {
        console.warn('Could not calculate file size:', error);
    }
}

// Download PNG
function downloadPNG() {
    if (!halftoneCanvas || halftoneCanvas.width === 0) {
        alert('Please generate a halftone image first!');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.download = `halftone-${Date.now()}.png`;
        link.href = halftoneCanvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error downloading PNG:', error);
        alert('Error downloading image. Please try again.');
    }
}

// Download SVG (simplified version)
function downloadSVG() {
    if (!currentImage) {
        alert('Please upload and generate a halftone image first!');
        return;
    }
    
    try {
        // Create SVG representation
        const params = {
            dotSize: dotSize ? parseFloat(dotSize.value) : 8,
            spacing: spacing ? parseFloat(spacing.value) : 1.2,
            pattern: getCurrentPattern()
        };
        
        const svg = createSVGHalftone(params);
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `halftone-${Date.now()}.svg`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading SVG:', error);
        alert('Error downloading SVG. Please try again.');
    }
}

// Create SVG halftone (simplified)
function createSVGHalftone(params) {
    const width = halftoneCanvas.width;
    const height = halftoneCanvas.height;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += '<rect width="100%" height="100%" fill="white"/>';
    
    // Add basic circle pattern for SVG
    const dotSpacing = params.dotSize * params.spacing;
    
    for (let y = 0; y < height; y += dotSpacing) {
        for (let x = 0; x < width; x += dotSpacing) {
            const size = params.dotSize * 0.5; // Simplified size
            svg += `<circle cx="${x}" cy="${y}" r="${size}" fill="black"/>`;
        }
    }
    
    svg += '</svg>';
    return svg;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

console.log('Halftone Generator script loaded');

// Display original image
function displayOriginalImage() {
    const maxSize = 500;
    let width = currentImage.width;
    let height = currentImage.height;
    
    // Scale down if too large
    if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width *= ratio;
        height *= ratio;
    }
    
    originalCanvas.width = width;
    originalCanvas.height = height;
    originalCtx.drawImage(currentImage, 0, 0, width, height);
}

// Apply brightness and contrast adjustments
function applyImageAdjustments(imageData) {
    const data = imageData.data;
    const contrastFactor = (parseFloat(contrast.value) / 100);
    const brightnessFactor = parseInt(brightness.value);
    
    for (let i = 0; i < data.length; i += 4) {
        // Apply contrast
        data[i] = ((data[i] - 128) * contrastFactor) + 128;
        data[i + 1] = ((data[i + 1] - 128) * contrastFactor) + 128;
        data[i + 2] = ((data[i + 2] - 128) * contrastFactor) + 128;
        
        // Apply brightness
        data[i] += brightnessFactor;
        data[i + 1] += brightnessFactor;
        data[i + 2] += brightnessFactor;
        
        // Clamp values
        data[i] = Math.max(0, Math.min(255, data[i]));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }
    
    return imageData;
}

// Convert to grayscale
function toGrayscale(imageData) {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    return imageData;
}

// Generate halftone effect
function generateHalftone() {
    if (!currentImage) return;
    
    const width = originalCanvas.width;
    const height = originalCanvas.height;
    
    halftoneCanvas.width = width;
    halftoneCanvas.height = height;
    
    // Get original image data
    let imageData = originalCtx.getImageData(0, 0, width, height);
    
    // Apply adjustments
    imageData = applyImageAdjustments(imageData);
    
    // Convert to grayscale
    imageData = toGrayscale(imageData);
    
    const data = imageData.data;
    
    // Clear halftone canvas
    halftoneCtx.fillStyle = 'white';
    halftoneCtx.fillRect(0, 0, width, height);
    
    const size = parseInt(dotSize.value);
    const pattern = patternType.value;
    const rotationAngle = (parseFloat(angle.value) * Math.PI) / 180;
    const sharp = parseFloat(sharpness.value) / 100;
    
    halftoneCtx.fillStyle = 'black';
    
    // Create halftone pattern
    for (let y = 0; y < height; y += size) {
        for (let x = 0; x < width; x += size) {
            // Sample the center of each cell
            const sampleX = Math.min(x + Math.floor(size / 2), width - 1);
            const sampleY = Math.min(y + Math.floor(size / 2), height - 1);
            const index = (sampleY * width + sampleX) * 4;
            
            // Get brightness (0-255, where 0 is black and 255 is white)
            const brightness = data[index];
            
            // Calculate dot radius based on brightness (inverted - darker = larger dots)
            const normalizedBrightness = brightness / 255;
            const dotRadius = (size / 2) * (1 - normalizedBrightness) * sharp;
            
            if (dotRadius > 0.5) {
                halftoneCtx.save();
                
                // Calculate center of the cell
                const centerX = x + size / 2;
                const centerY = y + size / 2;
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

console.log('Halftone Generator script loaded');
