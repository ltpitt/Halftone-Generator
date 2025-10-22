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
        },
        stringify: function(obj) {
            return obj.toSource();
        }
    };
}

// Capture selected artwork for preview - returns path to exported file
function captureArtworkForPreview() {
    try {
        if (app.documents.length === 0) {
            return '{"success":false,"error":"No active document"}';
        }
        
        var doc = app.activeDocument;
        
        if (doc.selection.length === 0) {
            return '{"success":false,"error":"No artwork selected. Please select an object or image."}';
        }
        
        var selectedItem = doc.selection[0];
        var bounds = selectedItem.geometricBounds;
        var width = bounds[2] - bounds[0];
        var height = bounds[1] - bounds[3];
        
        // Store bounds for returning (left, top, right, bottom in Illustrator coordinates)
        var left = bounds[0];
        var top = bounds[1];
        var right = bounds[2];
        var bottom = bounds[3];
        
        // Validate bounds
        if (width <= 0 || height <= 0) {
            return '{"success":false,"error":"Selected artwork has invalid dimensions"}';
        }
        
        // Create temp file path
        var tempFolder = Folder.temp;
        var timestamp = (new Date()).getTime();
        var exportPath = tempFolder.fsName + '\\halftone_capture_' + timestamp + '.png';
        var exportFile = new File(exportPath);
        
        // Export options
        var exportOptions = new ExportOptionsPNG24();
        exportOptions.antiAliasing = true;
        exportOptions.transparency = false;
        exportOptions.artBoardClipping = false;
        
        // Calculate export size (max 300px for preview)
        var maxSize = 300;
        var scale = Math.min(maxSize / width, maxSize / height, 1.0);
        exportOptions.horizontalScale = scale * 100;
        exportOptions.verticalScale = scale * 100;
        
        // Save current selection
        var originalSelection = [];
        for (var i = 0; i < doc.selection.length; i++) {
            originalSelection.push(doc.selection[i]);
        }
        
        try {
            // Create a temporary duplicate to export
            var tempItem = selectedItem.duplicate();
            doc.selection = null;
            tempItem.selected = true;
            
            // Export the selection
            doc.exportFile(exportFile, ExportType.PNG24, exportOptions);
            
            // Clean up temp item
            tempItem.remove();
            
            // Restore original selection
            doc.selection = null;
            for (var j = 0; j < originalSelection.length; j++) {
                originalSelection[j].selected = true;
            }
            
        } catch (exportError) {
            // Restore selection even if export fails
            doc.selection = null;
            for (var k = 0; k < originalSelection.length; k++) {
                originalSelection[k].selected = true;
            }
            return '{"success":false,"error":"Export failed: ' + exportError.toString() + '"}';
        }
        
        // Return the file path instead of trying to encode
        if (exportFile.exists) {
            // Return path using forward slashes for web compatibility
            var webPath = 'file:///' + exportPath.replace(/\\/g, '/');
            
            return '{"success":true,"imagePath":"' + webPath + '","width":' + Math.floor(width) + ',"height":' + Math.floor(height) + ',"left":' + left + ',"top":' + top + ',"right":' + right + ',"bottom":' + bottom + '}';
        } else {
            return '{"success":false,"error":"Export file was not created"}';
        }
        
    } catch (error) {
        return '{"success":false,"error":"Capture error: ' + error.toString() + '"}';
    }
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
        
        // Get original bounds - prefer from params if available (exact match to captured artwork)
        var bounds;
        if (params.originalBounds) {
            // Use the exact bounds from when we captured the artwork
            bounds = [
                params.originalBounds.left,
                params.originalBounds.top,
                params.originalBounds.left + params.originalBounds.width,
                params.originalBounds.top - params.originalBounds.height
            ];
        } else {
            // Fallback to current selection bounds
            bounds = selectedItem.geometricBounds;
        }
        
        var width = bounds[2] - bounds[0];
        var height = bounds[1] - bounds[3];
        
        // Create a new layer for halftone
        var halftoneLayer = doc.layers.add();
        halftoneLayer.name = "Halftone Pattern";
        
        // Use brightness map from canvas if provided
        var brightnessMap = params.brightnessMap;
        var cols = params.gridCols;
        var rows = params.gridRows;
        
        if (!brightnessMap || !cols || !rows) {
            return '{"success":false,"error":"No brightness data provided. Please capture artwork first."}';
        }
        
        // Calculate spacing to fit the grid exactly within the original artwork bounds
        // The grid should cover the entire artwork, matching the preview exactly
        var spacingX = width / cols;  // Horizontal spacing between dots
        var spacingY = height / rows; // Vertical spacing between dots
        
        // Use the average spacing for dot size calculations
        var avgSpacing = (spacingX + spacingY) / 2;
        
        var shapesCreated = 0;
        
        // Create halftone dots based on brightness map from canvas
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                // Calculate position using the grid spacing that matches the original artwork
                // Position should NOT be rotated - only the individual shapes rotate
                var x = bounds[0] + (col * spacingX) + (spacingX / 2);
                var y = bounds[1] - (row * spacingY) - (spacingY / 2);
                
                // Get brightness at this position from the canvas-provided map
                var brightness = brightnessMap[row][col];
                
                // Calculate dot size based on brightness
                var intensity = params.invert ? brightness : (1 - brightness);
                
                // Scale dot size relative to the grid spacing, not the parameter dotSize
                // The parameter dotSize is used as a multiplier (0-20 range)
                var maxDotSize = avgSpacing * 0.9; // Max dot size is 90% of spacing to avoid overlap
                var currentDotSize = maxDotSize * intensity * (params.density / 100) * (params.dotSize / 10);
                
                // Skip very small dots
                if (currentDotSize < 0.5) {
                    continue;
                }
                
                // Create shape at the grid position (angle rotation happens inside createShape)
                var shape = createShape(params.pattern, x, y, currentDotSize, params.scaleX, params.scaleY, halftoneLayer);
                
                // Apply rotation to the individual shape (not the position)
                if (shape && params.angle !== 0) {
                    shape.rotate(params.angle);
                }
                
                if (shape) {
                    shapesCreated++;
                }
            }
        }
        
        // Hide the original artwork
        selectedItem.hidden = true;
        
        // Return success
        return '{"success":true,"message":"Created ' + shapesCreated + ' halftone dots matching preview"}';
        
    } catch (error) {
        return '{"success":false,"error":"' + error.toString() + ' (Line: ' + (error.line || 'unknown') + ')"}';
    }
}

// Create a brightness map with variation
function sampleArtworkBrightness(item, cols, rows) {
    var brightnessMap = [];
    var bounds = item.geometricBounds;
    var width = bounds[2] - bounds[0];
    var height = bounds[1] - bounds[3];
    
    try {
        // For raster images, try to get actual brightness data
        if (item.typename === 'RasterItem') {
            brightnessMap = sampleRasterImageBrightness(item, cols, rows, bounds, width, height);
        } 
        // For placed/embedded images
        else if (item.typename === 'PlacedItem') {
            brightnessMap = samplePlacedImageBrightness(item, cols, rows, bounds, width, height);
        }
        // For vector shapes, sample fill colors
        else if (item.typename === 'PathItem' || item.typename === 'CompoundPathItem') {
            brightnessMap = sampleVectorShapeBrightness(item, cols, rows, bounds, width, height);
        }
        // For groups, try to sample the visual appearance
        else if (item.typename === 'GroupItem') {
            brightnessMap = sampleGroupBrightness(item, cols, rows, bounds, width, height);
        }
        // Fallback for other types
        else {
            brightnessMap = createPositionBasedBrightnessMap(item, cols, rows, bounds, width, height);
        }
        
    } catch (error) {
        // Fallback if sampling fails
        brightnessMap = createGradientBrightnessMap(cols, rows);
    }
    
    return brightnessMap;
}

// Sample brightness from raster image by creating temporary small raster samples
function sampleRasterImageBrightness(rasterItem, cols, rows, bounds, width, height) {
    var brightnessMap = [];
    
    // For raster items, we can analyze the image matrix if available
    // ExtendScript limitation: No direct pixel access
    // Workaround: Create small sample shapes and analyze their appearance
    
    // For now, use a more sophisticated sampling based on item properties
    var hasTransparency = rasterItem.opacity < 100;
    var avgBrightness = hasTransparency ? 0.5 : 0.3;
    
    // Create a more realistic brightness map based on image position
    for (var row = 0; row < rows; row++) {
        brightnessMap[row] = [];
        for (var col = 0; col < cols; col++) {
            // Sample position in normalized coordinates
            var normX = col / (cols - 1);
            var normY = row / (rows - 1);
            
            // Create a more complex pattern that simulates real image analysis
            // This would ideally read actual pixel data
            var brightness = simulateImageSampling(normX, normY, avgBrightness);
            brightnessMap[row][col] = brightness;
        }
    }
    
    return brightnessMap;
}

// Sample brightness from placed/embedded image
function samplePlacedImageBrightness(placedItem, cols, rows, bounds, width, height) {
    // Similar approach to raster items
    return sampleRasterImageBrightness(placedItem, cols, rows, bounds, width, height);
}

// Sample brightness from vector shapes based on fill color
function sampleVectorShapeBrightness(pathItem, cols, rows, bounds, width, height) {
    var brightnessMap = [];
    
    // Get the fill color and convert to brightness
    var baseBrightness = 0.5; // Default mid-gray
    
    if (pathItem.filled && pathItem.fillColor) {
        baseBrightness = getColorBrightness(pathItem.fillColor);
    }
    
    // For vector shapes, create varying brightness based on position within shape
    for (var row = 0; row < rows; row++) {
        brightnessMap[row] = [];
        for (var col = 0; col < cols; col++) {
            var x = bounds[0] + (col / (cols - 1)) * width;
            var y = bounds[1] - (row / (rows - 1)) * height;
            
            // Check if point is inside the path
            var isInside = isPointInPath(pathItem, x, y);
            
            // Vary brightness based on position and whether inside shape
            var brightness = baseBrightness;
            if (isInside) {
                // Add some variation to make it more interesting
                var normX = col / (cols - 1);
                var normY = row / (rows - 1);
                brightness = baseBrightness * (0.7 + 0.3 * Math.sin(normX * Math.PI) * Math.cos(normY * Math.PI));
            } else {
                brightness = 1.0; // White/transparent outside
            }
            
            brightnessMap[row][col] = Math.max(0, Math.min(1, brightness));
        }
    }
    
    return brightnessMap;
}

// Sample brightness from group items
function sampleGroupBrightness(groupItem, cols, rows, bounds, width, height) {
    var brightnessMap = [];
    
    // For groups, analyze the overall appearance
    // This is a simplified approach - ideally would sample each item in the group
    var avgBrightness = 0.5;
    
    // Try to get average brightness from group items
    if (groupItem.pageItems && groupItem.pageItems.length > 0) {
        var totalBrightness = 0;
        var count = 0;
        
        for (var i = 0; i < Math.min(groupItem.pageItems.length, 10); i++) {
            var item = groupItem.pageItems[i];
            if (item.filled && item.fillColor) {
                totalBrightness += getColorBrightness(item.fillColor);
                count++;
            }
        }
        
        if (count > 0) {
            avgBrightness = totalBrightness / count;
        }
    }
    
    return createVariedBrightnessMap(cols, rows, avgBrightness);
}

// Create position-based brightness for unknown item types
function createPositionBasedBrightnessMap(item, cols, rows, bounds, width, height) {
    return createVariedBrightnessMap(cols, rows, 0.5);
}

// Simulate image sampling with more realistic patterns
function simulateImageSampling(normX, normY, baseBrightness) {
    // Create a more realistic brightness variation
    // Combine multiple patterns for natural look
    
    // Radial gradient
    var centerX = 0.5;
    var centerY = 0.5;
    var dx = normX - centerX;
    var dy = normY - centerY;
    var radialDist = Math.sqrt(dx * dx + dy * dy);
    var radialPattern = 1.0 - (radialDist / 0.707);
    
    // Wave pattern
    var wavePattern = (Math.sin(normX * Math.PI * 4) * Math.cos(normY * Math.PI * 4) + 1) / 2;
    
    // Edge detection simulation
    var edgeFactor = Math.abs(normX - 0.5) * Math.abs(normY - 0.5) * 4;
    
    // Combine patterns
    var brightness = (radialPattern * 0.5 + wavePattern * 0.3 + edgeFactor * 0.2) * baseBrightness;
    
    return Math.max(0, Math.min(1, brightness));
}

// Get brightness value from a color
function getColorBrightness(color) {
    try {
        if (color.typename === 'RGBColor') {
            // Convert RGB to perceived brightness (weighted average)
            return (color.red * 0.299 + color.green * 0.587 + color.blue * 0.114) / 255;
        } else if (color.typename === 'GrayColor') {
            return color.gray / 100;
        } else if (color.typename === 'CMYKColor') {
            // Convert CMYK to approximate brightness
            var k = color.black / 100;
            return 1 - k;
        } else if (color.typename === 'SpotColor') {
            // Try to get tint
            return (100 - color.tint) / 100;
        }
    } catch (e) {
        // Fallback
    }
    
    return 0.5; // Default mid-gray
}

// Check if a point is inside a path (simplified hit test)
function isPointInPath(pathItem, x, y) {
    try {
        // Use Illustrator's hit test
        var doc = app.activeDocument;
        var testPoint = [x, y];
        
        // Simple bounds check first (faster)
        var bounds = pathItem.geometricBounds;
        if (x < bounds[0] || x > bounds[2] || y > bounds[1] || y < bounds[3]) {
            return false;
        }
        
        // For filled paths, assume points inside bounds are inside
        // A more accurate method would use ray casting, but that's expensive
        return pathItem.filled;
        
    } catch (e) {
        return false;
    }
}

// Create a brightness map with variation
function createVariedBrightnessMap(cols, rows, baseBrightness) {
    var brightnessMap = [];
    
    for (var row = 0; row < rows; row++) {
        brightnessMap[row] = [];
        for (var col = 0; col < cols; col++) {
            var normX = col / (cols - 1);
            var normY = row / (rows - 1);
            
            // Add variation
            var variation = Math.sin(normX * Math.PI) * Math.cos(normY * Math.PI);
            var brightness = baseBrightness * (0.8 + 0.4 * variation);
            
            brightnessMap[row][col] = Math.max(0, Math.min(1, brightness));
        }
    }
    
    return brightnessMap;
}

// Create a brightness map with gradient pattern
function createGradientBrightnessMap(cols, rows) {
    var brightnessMap = [];
    
    for (var row = 0; row < rows; row++) {
        brightnessMap[row] = [];
        for (var col = 0; col < cols; col++) {
            // Create radial gradient from center
            var x = col / (cols - 1);
            var y = row / (rows - 1);
            var centerX = 0.5;
            var centerY = 0.5;
            var dx = x - centerX;
            var dy = y - centerY;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            // Normalize (max distance from center is ~0.707)
            var brightness = 1.0 - (distance / 0.707);
            brightness = Math.max(0, Math.min(1, brightness));
            
            brightnessMap[row][col] = brightness;
        }
    }
    
    return brightnessMap;
}

// Apply image adjustments to brightness value
function applyAdjustments(brightness, params) {
    // Apply contrast
    brightness = Math.pow(brightness, 1.0 / params.contrast);
    
    // Apply brightness adjustment
    brightness = brightness + (params.brightness / 100.0);
    
    // Apply gamma
    brightness = Math.pow(Math.max(0, Math.min(1, brightness)), params.gamma);
    
    // Apply threshold
    var normalizedThreshold = params.threshold / 255.0;
    if (brightness < normalizedThreshold) {
        brightness = brightness * 0.5; // Darken below threshold
    }
    
    // Add noise
    if (params.noise > 0) {
        var noiseAmount = (Math.random() - 0.5) * (params.noise / 100.0);
        brightness = brightness + noiseAmount;
    }
    
    // Clamp to 0-1 range
    return Math.max(0, Math.min(1, brightness));
}

// Create a shape based on pattern type
function createShape(patternType, x, y, size, scaleX, scaleY, targetLayer) {
    try {
        var shape = null;
        var doc = app.activeDocument;
        
        switch (patternType) {
            case 'circle':
                shape = targetLayer.pathItems.ellipse(y + size/2, x - size/2, size * scaleX, size * scaleY);
                break;
                
            case 'square':
                shape = targetLayer.pathItems.rectangle(y + size/2, x - size/2, size * scaleX, size * scaleY);
                break;
                
            case 'diamond':
                // Create rotated square
                shape = targetLayer.pathItems.rectangle(y + size/2, x - size/2, size * scaleX, size * scaleY);
                if (shape) {
                    shape.rotate(45, true, true, true, true, Transformation.CENTER);
                }
                break;
                
            case 'line':
                // Create horizontal line
                var lineSize = size * 2;
                shape = targetLayer.pathItems.rectangle(y + size/4, x - lineSize/2, lineSize * scaleX, size/2 * scaleY);
                break;
                
            case 'cross':
                // Create cross shape using two rectangles
                // For simplicity, create just one line for now
                // A full implementation would create a compound path
                var crossSize = size * 1.5;
                shape = targetLayer.pathItems.rectangle(y + size/4, x - crossSize/2, crossSize * scaleX, size/2 * scaleY);
                break;
                
            case 'hexagon':
                // Create hexagon using polygon
                shape = targetLayer.pathItems.polygon(x, y, size/2 * scaleX, 6);
                break;
                
            default:
                // Default to circle
                shape = targetLayer.pathItems.ellipse(y + size/2, x - size/2, size * scaleX, size * scaleY);
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
