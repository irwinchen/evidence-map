import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { KumuData, KumuElement, KumuConnection } from 'components/system-map/types';

interface ForceGraphProps {
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
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  connectionType?: string;
}

const ForceGraph: React.FC<ForceGraphProps> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

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

    // Transform data for D3
    const nodes: SimulationNode[] = connectedElements.map((elem: KumuElement) => ({
      id: elem._id,
      label: elem.attributes.label || '',
      elementType: elem.attributes['element type'],
    }));

    const links: SimulationLink[] = data.connections.map((conn: KumuConnection) => ({
      source: conn.from,
      target: conn.to,
      connectionType: conn.attributes?.['connection type'],
    }));

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create the SVG container with zoom support
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Define arrow markers
    svg
      .append('defs')
      .selectAll('marker')
      .data(['end'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
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

    // Create the simulation with adjusted parameters
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
      .force('collision', d3.forceCollide().radius(40));

    // Create the links using curved paths
    const link = g
      .append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d: SimulationLink) => (d.connectionType === '++' ? 2 : 1))
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrow)')
      .style('transition', 'all 0.3s ease');

    // Create the nodes group
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('transition', 'all 0.3s ease')
      .call(
        d3
          .drag<any, SimulationNode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Add circles to nodes with hover effect
    const circles = node
      .append('circle')
      .attr('r', (d: SimulationNode) => (d.elementType === 'Core Story' ? 15 : 10))
      .attr('fill', (d: SimulationNode) => {
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
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s ease');

    // Add labels with background for better readability
    const labels = node.append('g').style('transition', 'all 0.3s ease');

    // Add white background for text
    const labelBackgrounds = labels
      .append('text')
      .text((d: SimulationNode) => d.label)
      .attr('x', (d: SimulationNode) => (d.elementType === 'Core Story' ? 20 : 15))
      .attr('y', 4)
      .attr('font-size', (d: SimulationNode) => (d.elementType === 'Core Story' ? '12px' : '10px'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 4)
      .attr('stroke-linejoin', 'round')
      .style('pointer-events', 'none')
      .style('transition', 'all 0.3s ease');

    // Add actual text
    const labelTexts = labels
      .append('text')
      .text((d: SimulationNode) => d.label)
      .attr('x', (d: SimulationNode) => (d.elementType === 'Core Story' ? 20 : 15))
      .attr('y', 4)
      .attr('font-size', (d: SimulationNode) => (d.elementType === 'Core Story' ? '12px' : '10px'))
      .attr('fill', '#000')
      .style('pointer-events', 'none')
      .style('transition', 'all 0.3s ease');

    // Helper function to get connected nodes
    function getConnectedNodes(d: SimulationNode | SimulationLink) {
      const connectedNodes = new Set<string>();

      if ('source' in d && 'target' in d) {
        // If it's a link
        connectedNodes.add((d.source as SimulationNode).id);
        connectedNodes.add((d.target as SimulationNode).id);
      } else {
        // If it's a node
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

        // Highlight the hovered node
        d3.select(this)
          .select('circle')
          .attr('stroke', '#000')
          .attr('stroke-width', 2)
          .attr('r', d.elementType === 'Core Story' ? 18 : 12);
      })
      .on('mouseout', function () {
        // Reset all opacities
        node.style('opacity', 1);
        link.style('opacity', 1);

        // Reset node style
        d3.select(this)
          .select('circle')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5)
          .attr('r', function (this: any, d: any) {
            return (d as SimulationNode).elementType === 'Core Story' ? 15 : 10;
          });
      });

    // Hover effects for links
    link
      .on('mouseover', function (event: MouseEvent, d: SimulationLink) {
        const connectedNodes = getConnectedNodes(d);

        // Fade unconnected nodes
        node.style('opacity', (n: SimulationNode) => (connectedNodes.has(n.id) ? 1 : 0.1));

        // Fade unconnected links
        link.style('opacity', (l: SimulationLink) => (l === d ? 1 : 0.1));

        // Highlight the hovered link
        d3.select(this)
          .attr('stroke-width', d.connectionType === '++' ? 3 : 2)
          .attr('stroke-opacity', 0.8);
      })
      .on('mouseout', function () {
        // Reset all opacities
        node.style('opacity', 1);
        link.style('opacity', 1);

        // Reset link style
        d3.select(this)
          .attr('stroke-width', function (this: any, d: any) {
            return (d as SimulationLink).connectionType === '++' ? 2 : 1;
          })
          .attr('stroke-opacity', 0.4);
      });

    // Function to generate curved path between nodes
    function linkArc(d: any) {
      const dx = d.target.x! - d.source.x!;
      const dy = d.target.y! - d.source.y!;
      const dr = Math.sqrt(dx * dx + dy * dy);
      const baseOffset = 0.1;
      const distanceScale = Math.min(1, dr / 200);
      const offset = dr * baseOffset * distanceScale;
      const midX = (d.source.x! + d.target.x!) / 2;
      const midY = (d.source.y! + d.target.y!) / 2;
      const perpX = midX - (dy * offset) / dr;
      const perpY = midY + (dx * offset) / dr;
      return `M${d.source.x},${d.source.y} Q${perpX},${perpY} ${d.target.x},${d.target.y}`;
    }

    // Update positions on each tick
    simulation.on('tick', () => {
      link.attr('d', linkArc);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<any, SimulationNode, any>, d: SimulationNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<any, SimulationNode, any>, d: SimulationNode) {
      d.fx = event.x;
      d.fy = event.y;
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

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100%' }} className="bg-white" />;
};

export default ForceGraph;
