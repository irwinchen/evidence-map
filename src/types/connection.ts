import { Point } from '../utils/PathCalculator';

export interface ConnectionData {
  id: string;
  sourceId: string;
  targetId: string;
  type?: string;
  label?: string;
  curvature: number;
}

export interface NodeData {
  id: string;
  position: Point;
  label: string;
}