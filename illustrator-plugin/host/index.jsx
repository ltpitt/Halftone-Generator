// Halftone Generator - ExtendScript Host Script
// This runs in Illustrator and handles the actual halftone generation

// TEST 1: Absolute simplest function
function testBasic() {
    return "TEST_SUCCESS";
}

// TEST 2: Simple JSON.parse test
if (typeof JSON === 'undefined') {
    JSON = {
        parse: function(str) {
            return eval('(' + str + ')');
        }
    };
}

// Main function called from the panel
function generateHalftone(paramsJSON) {
    try {
        // Parse the parameters
        var params = JSON.parse(paramsJSON);
        
        // Check if there's an active document
        if (app.documents.length === 0) {
            return '{"success":false,"error":"No active document. Please open or create a document."}';
        }
        
        var doc = app.activeDocument;
        
        // Check if there's a selection
        if (doc.selection.length === 0) {
            return '{"success":false,"error":"No object selected. Please select an image or object to apply halftone effect."}';
        }
        
        var selectedItem = doc.selection[0];
        
        // Get bounds of selected item
        var bounds = selectedItem.geometricBounds;
        var width = bounds[2] - bounds[0];
        var height = bounds[1] - bounds[3];
        
        // Debug: Log values
        var debugInfo = 'Bounds: [' + bounds[0] + ', ' + bounds[1] + ', ' + bounds[2] + ', ' + bounds[3] + '] ';
        debugInfo += 'Size: ' + width + 'x' + height + ' ';
        
        // Create a new layer for halftone
        var halftoneLayer = doc.layers.add();
        halftoneLayer.name = "Halftone Pattern";
        
        // Simple halftone generation - create circles in a grid
        var spacing = params.spacing || 15;
        var dotSize = params.dotSize || 10;
        var cols = Math.floor(width / spacing);
        var rows = Math.floor(height / spacing);
        var shapesCreated = 0;
        
        debugInfo += 'Grid: ' + cols + 'x' + rows + ' Spacing: ' + spacing + ' DotSize: ' + dotSize;
        
        // Create black color for dots
        var blackColor = new RGBColor();
        blackColor.red = 0;
        blackColor.green = 0;
        blackColor.blue = 0;
        
        // Create halftone dots
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                var x = bounds[0] + (col * spacing) + (spacing / 2);
                var y = bounds[1] - (row * spacing) - (spacing / 2);
                
                // Create a circle
                var circle = halftoneLayer.pathItems.ellipse(y + dotSize/2, x - dotSize/2, dotSize, dotSize);
                circle.filled = true;
                circle.fillColor = blackColor;
                circle.stroked = false;
                
                shapesCreated++;
            }
        }
        
        // Return success with debug info
        return '{"success":true,"message":"Created ' + shapesCreated + ' halftone dots. ' + debugInfo + '"}';
        
        // Check if there's an active document
        if (app.documents.length === 0) {
            return '{"success":false,"error":"No active document. Please open or create a document."}';
        }
        
        var doc = app.activeDocument;
        
        // Check if there's a selection
        if (doc.selection.length === 0) {
            return '{"success":false,"error":"No object selected. Please select an image or object to apply halftone effect."}';
        }
        
        var selectedItem = doc.selection[0];
        
        // Temporary: Skip complex functions to test basic structure
        return '{"success":true,"message":"Basic ExtendScript function is working! Selected: ' + selectedItem.typename + '"}';
        
    } catch (error) {
        return '{"success":false,"error":"' + error.toString() + '"}';
    }
}

// Extract image data from selected item
function extractImageData(item, params) {
    try {
        // For now, we'll work with the item's bounds
        var bounds = item.geometricBounds; // left, top, right, bottom
        var width = bounds[2] - bounds[0];
        var height = bounds[1] - bounds[3];
        
        // Limit size for performance
        var maxDimension = 500;
        var scale = 1.0;
        if (width > maxDimension || height > maxDimension) {
            scale = maxDimension / Math.max(width, height);
        }
        
        return {
            success: true,
            bounds: bounds,
            width: width,
            height: height,
            scale: scale,
            left: bounds[0],
            top: bounds[1]
        };
        
    } catch (error) {
        return {
            success: false,
            error: 'Failed to extract image data: ' + error.toString()
        };
    }
}

// Create halftone pattern
function createHalftonePattern(doc, imageData, params) {
    try {
        // Create a new layer for the halftone
        var halftoneLayer = doc.layers.add();
        halftoneLayer.name = 'Halftone Pattern';
        
        var shapesCreated = 0;
        
        // Calculate grid parameters
        var spacing = params.spacing;
        var angleRad = params.angle * Math.PI / 180;
        
        // Calculate grid dimensions
        var cols = Math.ceil(imageData.width / spacing);
        var rows = Math.ceil(imageData.height / spacing);
        
        // Limit number of shapes for performance
        var maxShapes = 5000;
        if (cols * rows > maxShapes) {
            var scaleFactor = Math.sqrt(maxShapes / (cols * rows));
            spacing = spacing / scaleFactor;
            cols = Math.ceil(imageData.width / spacing);
            rows = Math.ceil(imageData.height / spacing);
        }
        
        // Create halftone dots
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                // Calculate position
                var x = imageData.left + col * spacing;
                var y = imageData.top - row * spacing;
                
                // Apply rotation transform
                var cosA = Math.cos(angleRad);
                var sinA = Math.sin(angleRad);
                var centerX = imageData.left + imageData.width / 2;
                var centerY = imageData.top - imageData.height / 2;
                
                var dx = x - centerX;
                var dy = y - centerY;
                var rotX = centerX + dx * cosA - dy * sinA;
                var rotY = centerY + dx * sinA + dy * cosA;
                
                // Calculate dot size based on position (simple gradient for now)
                // In a full implementation, this would sample the actual image
                var intensity = calculateIntensity(col, row, cols, rows, params);
                
                if (params.invert) {
                    intensity = 1.0 - intensity;
                }
                
                // Skip dots below threshold
                var normalizedThreshold = params.threshold / 255.0;
                if (intensity < normalizedThreshold / 2) {
                    continue;
                }
                
                // Calculate dot size
                var dotSize = params.dotSize * intensity * params.density;
                
                // Skip very small dots
                if (dotSize < 0.5) {
                    continue;
                }
                
                // Create shape based on pattern type
                var shape = createShape(params.pattern, rotX, rotY, dotSize, params.scaleX, params.scaleY);
                
                if (shape) {
                    shape.move(halftoneLayer, ElementPlacement.PLACEATBEGINNING);
                    shapesCreated++;
                }
            }
            
            // Send progress update every 10 rows
            if (row % 10 === 0) {
                var percent = Math.round((row / rows) * 100);
                sendProgressEvent(percent);
            }
        }
        
        // Send completion event
        sendProgressEvent(100);
        
        return {
            success: true,
            shapesCreated: shapesCreated
        };
        
    } catch (error) {
        return {
            success: false,
            error: 'Failed to create halftone pattern: ' + error.toString()
        };
    }
}

// Calculate intensity at a grid position
// This is a placeholder - in a full implementation, this would sample the actual image
function calculateIntensity(col, row, cols, rows, params) {
    // Create a simple gradient pattern for demonstration
    var x = col / cols;
    var y = row / rows;
    
    // Radial gradient from center
    var centerX = 0.5;
    var centerY = 0.5;
    var dx = x - centerX;
    var dy = y - centerY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize distance (max distance from center is ~0.707)
    var intensity = 1.0 - (distance / 0.707);
    
    // Apply contrast
    intensity = Math.pow(intensity, 1.0 / params.contrast);
    
    // Apply brightness
    intensity = intensity + (params.brightness / 100.0);
    
    // Apply gamma
    intensity = Math.pow(Math.max(0, Math.min(1, intensity)), params.gamma);
    
    // Add noise
    if (params.noise > 0) {
        var noiseAmount = (Math.random() - 0.5) * (params.noise / 100.0);
        intensity = intensity + noiseAmount;
    }
    
    // Clamp to 0-1 range
    return Math.max(0, Math.min(1, intensity));
}

// Create a shape based on pattern type
function createShape(patternType, x, y, size, scaleX, scaleY) {
    try {
        var shape = null;
        var adjustedSize = size;
        
        switch (patternType) {
            case 'circle':
                shape = app.activeDocument.pathItems.ellipse(y + size/2, x - size/2, size * scaleX, size * scaleY);
                break;
                
            case 'square':
                shape = app.activeDocument.pathItems.rectangle(y + size/2, x - size/2, size * scaleX, size * scaleY);
                break;
                
            case 'diamond':
                // Create rotated square
                shape = app.activeDocument.pathItems.rectangle(y + size/2, x - size/2, size * scaleX, size * scaleY);
                if (shape) {
                    shape.rotate(45, true, true, true, true, Transformation.CENTER);
                }
                break;
                
            case 'line':
                // Create horizontal line
                var lineSize = size * 2;
                shape = app.activeDocument.pathItems.rectangle(y + size/4, x - lineSize/2, lineSize * scaleX, size/2 * scaleY);
                break;
                
            case 'cross':
                // Create cross shape using two rectangles
                // For simplicity, create just one line for now
                // A full implementation would create a compound path
                var crossSize = size * 1.5;
                shape = app.activeDocument.pathItems.rectangle(y + size/4, x - crossSize/2, crossSize * scaleX, size/2 * scaleY);
                break;
                
            case 'hexagon':
                // Create hexagon using polygon
                shape = app.activeDocument.pathItems.polygon(x, y, size/2 * scaleX, 6);
                break;
                
            default:
                // Default to circle
                shape = app.activeDocument.pathItems.ellipse(y + size/2, x - size/2, size * scaleX, size * scaleY);
        }
        
        if (shape) {
            // Set fill color to black
            var fillColor = new RGBColor();
            fillColor.red = 0;
            fillColor.green = 0;
            fillColor.blue = 0;
            shape.filled = true;
            shape.fillColor = fillColor;
            shape.stroked = false;
        }
        
        return shape;
        
    } catch (error) {
        // Silent fail for individual shapes
        return null;
    }
}

// Send progress event to panel
function sendProgressEvent(percent) {
    try {
        var event = new CSXSEvent();
        event.type = 'halftone.progress';
        event.data = JSON.stringify({
            percent: percent,
            complete: percent >= 100
        });
        event.dispatch();
    } catch (error) {
        // Silent fail for progress updates
    }
}

// Utility function to clamp values
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
