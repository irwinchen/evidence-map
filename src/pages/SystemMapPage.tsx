import React, { useEffect, useState } from 'react';
import SystemForceGraph from '../components/system-map/SystemForceGraph';
import { KumuData } from '../components/system-map/types';

const SystemMapPage = () => {
  const [graphData, setGraphData] = useState<KumuData | null>(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 64, // Subtract header height (h-16 = 64px)
  });

  useEffect(() => {
    // Load the Kumu data
    fetch('/data/kumu-map-wicked-problem-task-force.json')
      .then((response) => response.json())
      .then((data) => {
        setGraphData({
          elements: data.elements,
          connections: data.connections,
        });
      })
      .catch((error) => {
        console.error('Error loading graph data:', error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 64, // Subtract header height
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      {' '}
      {/* Full viewport height minus header */}
      <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 p-3 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-1">System Evidence Map</h1>
        <p className="text-sm text-gray-600">
          Interactive visualization of evidence and relationships in the system.
        </p>
      </div>
      <div className="w-full h-full">
        {graphData ? (
          <SystemForceGraph data={graphData} width={dimensions.width} height={dimensions.height} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">Loading visualization...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemMapPage;
