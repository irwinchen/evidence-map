# Kumu-Style Curved Path Implementation Guide

## Overview
After analyzing Kumu's implementation of curved connection paths, here are the key implementation details and recommendations for recreating this functionality in a custom system map.

## Core Components

### 1. Path Calculation
The curved paths are implemented using cubic Bezier curves with the following characteristics:

```javascript
// Pseudo-code for path generation
function generateCurvedPath(start, end, curvature) {
    // Calculate control points based on curvature
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Control point distance from line
    const offset = distance * (curvature / 100);
    
    // Calculate perpendicular vector
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    // Control points at 1/3 and 2/3 along the path
    const cp1 = {
        x: start.x + dx/3 + perpX * offset,
        y: start.y + dy/3 + perpY * offset
    };
    
    const cp2 = {
        x: start.x + 2*dx/3 + perpX * offset,
        y: start.y + 2*dy/3 + perpY * offset
    };
    
    return {
        path: `M ${start.x},${start.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${end.x},${end.y}`,
        controlPoints: [cp1, cp2]
    };
}
```

### 2. Key Parameters
- **Curvature Range**: -40 to 40
  - 0: Straight line
  - 1-10: Subtle curve
  - 11-25: Moderate curve
  - 26-40: Pronounced curve
  - Negative values: Mirror curve in opposite direction

### 3. SVG Implementation
The paths should be rendered using SVG path elements:

```html
<svg>
    <path 
        d="M x1,y1 C cx1,cy1 cx2,cy2 x2,y2"
        class="connection"
        data-curvature="15"
    />
</svg>
```

### 4. Styling System
Implement a CSS-like styling system:

```css
.connection {
    stroke: #666;
    stroke-width: 2;
    fill: none;
}

.connection[data-type="depends-on"] {
    stroke: #ff0000;
    stroke-dasharray: 5,5;
}
```

## Implementation Recommendations

1. **Path Calculation Layer**
   - Create a PathCalculator class that handles the mathematical computations
   - Cache calculated paths for performance
   - Implement path recalculation on node movement

2. **Rendering Layer**
   - Use SVG for path rendering
   - Implement a separate layer for path decorations (arrows, labels)
   - Consider using requestAnimationFrame for smooth updates

3. **Interaction Layer**
   - Implement path hovering and selection
   - Add curvature adjustment controls
   - Consider adding path dragging to adjust curvature

4. **Performance Optimizations**
   - Batch path updates
   - Use object pooling for path calculations
   - Implement viewport culling for large graphs

## Example Integration Code

```javascript
class ConnectionManager {
    constructor(svg) {
        this.svg = svg;
        this.paths = new Map();
        this.calculator = new PathCalculator();
    }

    createConnection(startNode, endNode, options = {}) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const id = `connection-${startNode.id}-${endNode.id}`;
        
        path.setAttribute("id", id);
        path.setAttribute("class", "connection");
        path.setAttribute("data-curvature", options.curvature || 0);
        
        this.updatePath(path, startNode, endNode);
        this.paths.set(id, { path, startNode, endNode, options });
        
        return path;
    }

    updatePath(path, startNode, endNode) {
        const curvature = Number(path.getAttribute("data-curvature"));
        const pathData = this.calculator.generateCurvedPath(
            startNode.position,
            endNode.position,
            curvature
        );
        
        path.setAttribute("d", pathData.path);
    }

    updateAllPaths() {
        for (const { path, startNode, endNode } of this.paths.values()) {
            this.updatePath(path, startNode, endNode);
        }
    }
}
```

## Next Steps

1. Implement the basic PathCalculator class
2. Set up the SVG rendering infrastructure
3. Add basic node and connection management
4. Implement the styling system
5. Add interaction handlers
6. Test with sample data
7. Optimize performance
8. Add additional features (arrows, labels, etc.)

This implementation guide provides a foundation for recreating Kumu-style curved paths in your system map. The actual implementation can be adjusted based on your specific needs and existing codebase.