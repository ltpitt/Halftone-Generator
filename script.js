// Canvas elements
const originalCanvas = document.getElementById('originalCanvas');
const halftoneCanvas = document.getElementById('halftoneCanvas');
const originalCtx = originalCanvas.getContext('2d');
const halftoneCtx = halftoneCanvas.getContext('2d');

// Control elements
const imageUpload = document.getElementById('imageUpload');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const patternType = document.getElementById('patternType');
const dotSize = document.getElementById('dotSize');
const contrast = document.getElementById('contrast');
const angle = document.getElementById('angle');
const brightness = document.getElementById('brightness');
const sharpness = document.getElementById('sharpness');

// Value display elements
const dotSizeValue = document.getElementById('dotSizeValue');
const contrastValue = document.getElementById('contrastValue');
const angleValue = document.getElementById('angleValue');
const brightnessValue = document.getElementById('brightnessValue');
const sharpnessValue = document.getElementById('sharpnessValue');

// State
let currentImage = null;

// Event listeners for sliders to update display values
dotSize.addEventListener('input', (e) => {
    dotSizeValue.textContent = e.target.value;
});

contrast.addEventListener('input', (e) => {
    contrastValue.textContent = e.target.value;
});

angle.addEventListener('input', (e) => {
    angleValue.textContent = e.target.value;
});

brightness.addEventListener('input', (e) => {
    brightnessValue.textContent = e.target.value;
});

sharpness.addEventListener('input', (e) => {
    sharpnessValue.textContent = e.target.value;
});

// Image upload handler
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                currentImage = img;
                displayOriginalImage();
                generateHalftone();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Reset button handler
resetBtn.addEventListener('click', () => {
    currentImage = null;
    imageUpload.value = '';
    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    halftoneCtx.clearRect(0, 0, halftoneCanvas.width, halftoneCanvas.height);
    originalCanvas.width = 0;
    originalCanvas.height = 0;
    halftoneCanvas.width = 0;
    halftoneCanvas.height = 0;
});

// Generate button handler
generateBtn.addEventListener('click', () => {
    if (currentImage) {
        generateHalftone();
    } else {
        alert('Please upload an image first!');
    }
});

// Download button handler
downloadBtn.addEventListener('click', () => {
    if (halftoneCanvas.width > 0) {
        const link = document.createElement('a');
        link.download = 'halftone-result.png';
        link.href = halftoneCanvas.toDataURL();
        link.click();
    } else {
        alert('Please generate a halftone image first!');
    }
});

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
                
                // Translate to center, rotate, then translate back
                halftoneCtx.translate(centerX, centerY);
                halftoneCtx.rotate(rotationAngle);
                halftoneCtx.translate(-centerX, -centerY);
                
                // Draw pattern based on type
                switch (pattern) {
                    case 'circle':
                        halftoneCtx.beginPath();
                        halftoneCtx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
                        halftoneCtx.fill();
                        break;
                        
                    case 'square':
                        const halfSize = dotRadius;
                        halftoneCtx.fillRect(
                            centerX - halfSize,
                            centerY - halfSize,
                            halfSize * 2,
                            halfSize * 2
                        );
                        break;
                        
                    case 'line':
                        halftoneCtx.fillRect(
                            centerX - size / 2,
                            centerY - dotRadius / 2,
                            size,
                            dotRadius
                        );
                        break;
                        
                    case 'cross':
                        const thickness = dotRadius / 2;
                        // Horizontal line
                        halftoneCtx.fillRect(
                            centerX - dotRadius,
                            centerY - thickness / 2,
                            dotRadius * 2,
                            thickness
                        );
                        // Vertical line
                        halftoneCtx.fillRect(
                            centerX - thickness / 2,
                            centerY - dotRadius,
                            thickness,
                            dotRadius * 2
                        );
                        break;
                }
                
                halftoneCtx.restore();
            }
        }
    }
}

// Auto-generate on parameter change
patternType.addEventListener('change', () => {
    if (currentImage) generateHalftone();
});

dotSize.addEventListener('input', () => {
    if (currentImage) generateHalftone();
});

contrast.addEventListener('input', () => {
    if (currentImage) generateHalftone();
});

angle.addEventListener('input', () => {
    if (currentImage) generateHalftone();
});

brightness.addEventListener('input', () => {
    if (currentImage) generateHalftone();
});

sharpness.addEventListener('input', () => {
    if (currentImage) generateHalftone();
});
