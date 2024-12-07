export interface Point {
  x: number;
  y: number;
}

export interface PathData {
  path: string;
  controlPoints: [Point, Point];
}

export class PathCalculator {
  /**
   * Generates a curved SVG path between two points using cubic Bezier curves
   * @param start Starting point coordinates
   * @param end Ending point coordinates
   * @param curvature Curvature value (-40 to 40)
   * @returns SVG path string and control points
   */
  static generateCurvedPath(start: Point, end: Point, curvature: number): PathData {
    // Calculate the distance and direction vector
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize the curvature to a reasonable range
    const normalizedCurvature = Math.max(-40, Math.min(40, curvature));
    
    // Calculate the offset for control points based on curvature
    const offset = distance * (normalizedCurvature / 100);
    
    // Calculate perpendicular vector for control point offset
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    // Calculate control points at 1/3 and 2/3 along the path
    const cp1: Point = {
      x: start.x + dx/3 + perpX * offset,
      y: start.y + dy/3 + perpY * offset
    };
    
    const cp2: Point = {
      x: start.x + 2*dx/3 + perpX * offset,
      y: start.y + 2*dy/3 + perpY * offset
    };
    
    // Generate SVG path command
    const path = `M ${start.x},${start.y} C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${end.x},${end.y}`;
    
    return {
      path,
      controlPoints: [cp1, cp2]
    };
  }

  /**
   * Calculates a point along the curve at a given percentage
   * Useful for positioning labels or decorations
   */
  static getPointAlongPath(start: Point, end: Point, controlPoints: [Point, Point], t: number): Point {
    const [cp1, cp2] = controlPoints;
    const tInv = 1 - t;
    const tInv2 = tInv * tInv;
    const tInv3 = tInv2 * tInv;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: tInv3 * start.x + 3 * tInv2 * t * cp1.x + 3 * tInv * t2 * cp2.x + t3 * end.x,
      y: tInv3 * start.y + 3 * tInv2 * t * cp1.y + 3 * tInv * t2 * cp2.y + t3 * end.y
    };
  }

  /**
   * Calculates the angle (in radians) of the curve at a given point
   * Useful for rotating arrows or labels to follow the curve
   */
  static getAngleAtPoint(start: Point, end: Point, controlPoints: [Point, Point], t: number): number {
    const [cp1, cp2] = controlPoints;
    const tInv = 1 - t;
    const tInv2 = tInv * tInv;
    const t2 = t * t;

    // Calculate the derivative at point t
    const dx = -3 * tInv2 * start.x + (3 * tInv2 - 6 * t * tInv) * cp1.x +
               (6 * t * tInv - 3 * t2) * cp2.x + 3 * t2 * end.x;
    const dy = -3 * tInv2 * start.y + (3 * tInv2 - 6 * t * tInv) * cp1.y +
               (6 * t * tInv - 3 * t2) * cp2.y + 3 * t2 * end.y;

    return Math.atan2(dy, dx);
  }
}