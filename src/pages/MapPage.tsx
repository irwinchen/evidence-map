import React, { useEffect, useState } from 'react';
import ForceGraph from '../components/system-map/ForceGraph';
import { KumuData } from '../components/system-map/types';

const MapPage = () => {
  const [graphData, setGraphData] = useState<KumuData | null>(null);

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

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Evidence Map</h1>
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
        {graphData ? (
          <ForceGraph data={graphData} width={800} height={600} />
        ) : (
          <div className="text-gray-500 text-center">
            <p className="text-xl mb-4">Loading visualization...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
