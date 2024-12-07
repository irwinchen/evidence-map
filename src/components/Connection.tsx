import React, { useMemo } from 'react';
import { PathCalculator } from '../utils/PathCalculator';
import { ConnectionData, NodeData } from '../types/connection';

interface ConnectionProps {
  connection: ConnectionData;
  sourceNode: NodeData;
  targetNode: NodeData;
  selected?: boolean;
  onSelect?: (connectionId: string) => void;
}

export const Connection: React.FC<ConnectionProps> = ({
  connection,
  sourceNode,
  targetNode,
  selected = false,
  onSelect
}) => {
  const pathData = useMemo(() => {
    return PathCalculator.generateCurvedPath(
      sourceNode.position,
      targetNode.position,
      connection.curvature
    );
  }, [sourceNode.position, targetNode.position, connection.curvature]);

  // Calculate position for label if exists
  const labelPosition = useMemo(() => {
    if (connection.label) {
      return PathCalculator.getPointAlongPath(
        sourceNode.position,
        targetNode.position,
        pathData.controlPoints,
        0.5
      );
    }
    return null;
  }, [pathData, sourceNode.position, targetNode.position, connection.label]);

  // Calculate angle for label if exists
  const labelAngle = useMemo(() => {
    if (connection.label) {
      return (PathCalculator.getAngleAtPoint(
        sourceNode.position,
        targetNode.position,
        pathData.controlPoints,
        0.5
      ) * 180) / Math.PI;
    }
    return 0;
  }, [pathData, sourceNode.position, targetNode.position, connection.label]);

  return (
    <g
      className={`connection ${selected ? 'selected' : ''} ${connection.type || ''}`}
      onClick={() => onSelect?.(connection.id)}
    >
      <path
        d={pathData.path}
        className="connection-path"
        stroke={selected ? '#007AFF' : '#666'}
        strokeWidth={selected ? 3 : 2}
        fill="none"
        data-testid={`connection-${connection.id}`}
      />
      
      {connection.label && labelPosition && (
        <g
          transform={`translate(${labelPosition.x},${labelPosition.y}) rotate(${labelAngle})`}
          className="connection-label"
        >
          <rect
            x="-40"
            y="-10"
            width="80"
            height="20"
            fill="white"
            stroke="#666"
            strokeWidth="1"
            rx="4"
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#333"
            fontSize="12"
          >
            {connection.label}
          </text>
        </g>
      )}
    </g>
  );
};