
import dagre from 'dagre';
import { Node, Edge } from '@xyflow/react';

export const autoLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', ranksep: 100, nodesep: 50 });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: 120, height: 50 });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Run layout algorithm
  dagre.layout(g);

  // Apply new positions to nodes
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 60, // Center the node (width/2)
        y: nodeWithPosition.y - 25, // Center the node (height/2)
      },
    };
  });
};
