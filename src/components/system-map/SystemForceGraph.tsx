import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KumuData, KumuElement, KumuConnection } from 'components/system-map/types';

interface SystemForceGraphProps {
  data: KumuData;
  width: number;
  height: number;
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  elementType?: string;
  x?: number;
  y?: number;
  radius: number;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  connectionType?: string;
  source: SimulationNode;
  target: SimulationNode;
}

// Edge router helper class for calculating edge paths
class EdgeRouter {
  constructor() {
    // No parameters needed in constructor
  }

  getPath(source: SimulationNode, target: SimulationNode): string {
    // Ensure source and target have positions
    if (
      typeof source.x !== 'number' ||
      typeof source.y !== 'number' ||
      typeof target.x !== 'number' ||
      typeof target.y !== 'number'
    ) {
      return '';
    }

    // Calculate the angle between nodes
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const angle = Math.atan2(dy, dx);

    // Adjust start and end points to account for node radii
    const sourceRadius = source.radius || 10;
    const targetRadius = target.radius || 10;

    const startX = source.x + sourceRadius * Math.cos(angle);
    const startY = source.y + sourceRadius * Math.sin(angle);
    const endX = target.x - targetRadius * Math.cos(angle);
    const endY = target.y - targetRadius * Math.sin(angle);

    // Create a straight line path
    return `M${startX},${startY}L${endX},${endY}`;
  }
}

const SystemForceGraph: React.FC<SystemForceGraphProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    // Get set of node IDs that have connections
    const connectedNodeIds = new Set<string>();
    data.connections.forEach((conn: KumuConnection) => {
      connectedNodeIds.add(conn.from);
      connectedNodeIds.add(conn.to);
    });

    // Filter elements to only include those with connections
    const connectedElements = data.elements.filter((elem: KumuElement) =>
      connectedNodeIds.has(elem._id)
    );

    // Transform data for D3 with guaranteed radius
    const nodes: SimulationNode[] = connectedElements.map((elem: KumuElement) => ({
      id: elem._id,
      label: elem.attributes.label || '',
      elementType: elem.attributes['element type'],
      radius: elem.attributes['element type'] === 'Core Story' ? 15 : 10,
    }));

    const links: SimulationLink[] = data.connections.map((conn: KumuConnection) => ({
      source: nodes.find((n) => n.id === conn.from)!,
      target: nodes.find((n) => n.id === conn.to)!,
      connectionType: conn.attributes?.['connection type'],
    }));

    // Create SVG container with zoom
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Define arrow markers with proper positioning
    svg
      .append('defs')
      .selectAll('marker')
      .data(['end-marker'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', (d) => 28) // Adjusted to account for node radius
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#999')
      .attr('d', 'M0,-5L10,0L0,5');

    // Add zoom behavior
    const g = svg.append('g');
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Initialize edge router
    const edgeRouter = new EdgeRouter();

    // Create the simulation but don't start it yet
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimulationNode, SimulationLink>(links)
          .id((d) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-300).distanceMax(350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))
      .stop(); // Stop the simulation initially

    // Create container for links
    const linkGroup = g.append('g').attr('class', 'links');

    // Create container for nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Create links with smart routing
    const link = linkGroup
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => (d.connectionType === '++' ? 2 : 1))
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow)')
      .style('transition', 'opacity 0.3s ease');

    // Create nodes
    const node = nodeGroup
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .call(
        d3
          .drag<any, SimulationNode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Add white background for labels (rendered first)
    const labelBackgrounds = node
      .append('text')
      .attr('class', 'label-background')
      .text((d) => d.label)
      .attr('x', (d) => (d.elementType === 'Core Story' ? 20 : 15))
      .attr('y', 4)
      .attr('font-size', (d) => (d.elementType === 'Core Story' ? '12px' : '10px'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .style('pointer-events', 'none');

    // Add actual label text
    const labels = node
      .append('text')
      .attr('class', 'label')
      .text((d) => d.label)
      .attr('x', (d) => (d.elementType === 'Core Story' ? 20 : 15))
      .attr('y', 4)
      .attr('font-size', (d) => (d.elementType === 'Core Story' ? '12px' : '10px'))
      .attr('fill', '#000')
      .style('pointer-events', 'none');

    // Add circles to nodes (rendered on top of labels)
    const circles = node
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => {
        switch (d.elementType) {
          case 'Core Story':
            return '#ff0064';
          case 'Authoritarianism/Populism':
            return '#373737';
          case 'Democracy':
            return '#143cff';
          case 'Information Confusion':
            return '#50f5c8';
          case 'Journalism':
            return '#dcf500';
          case 'Media Growth':
            return '#e1e1e1';
          default:
            return '#dedede';
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    // Helper function to get connected nodes
    function getConnectedNodes(d: SimulationNode | SimulationLink): Set<string> {
      const connectedNodes = new Set<string>();
      if ('source' in d && 'target' in d) {
        connectedNodes.add((d.source as SimulationNode).id);
        connectedNodes.add((d.target as SimulationNode).id);
      } else {
        connectedNodes.add(d.id);
        links.forEach((l) => {
          const sourceId = (l.source as SimulationNode).id;
          const targetId = (l.target as SimulationNode).id;
          if (sourceId === d.id) connectedNodes.add(targetId);
          if (targetId === d.id) connectedNodes.add(sourceId);
        });
      }
      return connectedNodes;
    }

    // Hover effects for nodes
    node
      .on('mouseover', function (event: MouseEvent, d: SimulationNode) {
        const connectedNodes = getConnectedNodes(d);

        // Fade unconnected nodes
        node.style('opacity', (n: SimulationNode) => (connectedNodes.has(n.id) ? 1 : 0.1));

        // Fade unconnected links
        link.style('opacity', (l: SimulationLink) => {
          const sourceId = (l.source as SimulationNode).id;
          const targetId = (l.target as SimulationNode).id;
          return connectedNodes.has(sourceId) && connectedNodes.has(targetId) ? 1 : 0.1;
        });

        // Highlight current node
        d3.select(this)
          .select('circle')
          .attr('stroke', '#000')
          .attr('stroke-width', 2)
          .attr('r', d.radius * 1.2);
      })
      .on('mouseout', function (event: MouseEvent, d: SimulationNode) {
        // Reset all opacities
        node.style('opacity', 1);
        link.style('opacity', 0.4);

        // Reset current node
        d3.select(this)
          .select('circle')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('r', d.radius);
      });

    // Hover effects for links
    link
      .on('mouseover', function (event: MouseEvent, d: SimulationLink) {
        const connectedNodes = getConnectedNodes(d);

        // Fade unconnected nodes
        node.style('opacity', (n: SimulationNode) => (connectedNodes.has(n.id) ? 1 : 0.1));

        // Fade unconnected links
        link.style('opacity', (l: SimulationLink) => (l === d ? 0.8 : 0.1));

        // Highlight current link
        d3.select(this)
          .attr('stroke-width', d.connectionType === '++' ? 3 : 2)
          .attr('stroke-opacity', 0.8);
      })
      .on('mouseout', function (event: MouseEvent, d: SimulationLink) {
        // Reset all elements
        node.style('opacity', 1);
        link.style('opacity', 0.4);

        // Reset current link
        d3.select(this)
          .attr('stroke-width', d.connectionType === '++' ? 2 : 1)
          .attr('stroke-opacity', 0.4);
      });

    // Update function for synchronized rendering
    function updatePositions() {
      // Update node positions
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);

      // Update link paths
      link.attr('d', (d) => edgeRouter.getPath(d.source, d.target));
    }

    // Run simulation for initial positioning
    simulation.nodes(nodes);
    const linkForce = simulation.force('link') as d3.ForceLink<SimulationNode, SimulationLink>;
    if (linkForce) {
      linkForce.links(links);
    }

    // Warm up the simulation
    for (let i = 0; i < 300; i++) simulation.tick();

    // Update positions after warm-up
    updatePositions();

    // Now start the simulation
    simulation.on('tick', updatePositions).restart();

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<any, SimulationNode, any>, d: SimulationNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<any, SimulationNode, any>, d: SimulationNode) {
      d.fx = event.x;
      d.fy = event.y;
      // Update positions during drag
      updatePositions();
    }

    function dragended(event: d3.D3DragEvent<any, SimulationNode, any>, d: SimulationNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Initial zoom to fit
    const initialScale = 0.75;
    svg.call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(initialScale)
        .translate(-width / 2, -height / 2)
    );

    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} className="bg-white w-full h-full" />;
};

export default SystemForceGraph;
