import React, { useState } from 'react';
import { Connection } from './Connection';
import { ConnectionData, NodeData } from '../types/connection';

const initialNodes: NodeData[] = [
  { id: '1', position: { x: 100, y: 100 }, label: 'Node 1' },
  { id: '2', position: { x: 300, y: 100 }, label: 'Node 2' },
  { id: '3', position: { x: 200, y: 300 }, label: 'Node 3' },
];

const initialConnections: ConnectionData[] = [
  { 
    id: 'conn1', 
    sourceId: '1', 
    targetId: '2', 
    curvature: 20,
    label: 'Curved Right'
  },
  { 
    id: 'conn2', 
    sourceId: '2', 
    targetId: '3', 
    curvature: -15,
    label: 'Curved Left'
  },
  { 
    id: 'conn3', 
    sourceId: '3', 
    targetId: '1', 
    curvature: 0,
    label: 'Straight'
  },
];

export const CurvedConnectionsDemo: React.FC = () => {
  const [nodes] = useState<NodeData[]>(initialNodes);
  const [connections] = useState<ConnectionData[]>(initialConnections);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Curved Connections Demo</h1>
      <div className="border rounded-lg p-4">
        <svg width="400" height="400" className="bg-gray-50">
          {/* Render connections */}
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.sourceId)!;
            const targetNode = nodes.find(n => n.id === connection.targetId)!;
            
            return (
              <Connection
                key={connection.id}
                connection={connection}
                sourceNode={sourceNode}
                targetNode={targetNode}
                selected={selectedConnection === connection.id}
                onSelect={setSelectedConnection}
              />
            );
          })}
          
          {/* Render nodes */}
          {nodes.map(node => (
            <g
              key={node.id}
              transform={`translate(${node.position.x},${node.position.y})`}
              className="node"
            >
              <circle
                r="20"
                fill="white"
                stroke="#333"
                strokeWidth="2"
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#333"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ul className="list-disc pl-5">
          <li>Click on a connection to select it</li>
          <li>Notice how different curvature values affect the path</li>
          <li>Labels automatically follow the curve direction</li>
        </ul>
      </div>
    </div>
  );
};