
import { Node, Edge } from '@xyflow/react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateDAG = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Rule 1: Must have at least 2 nodes
  if (nodes.length < 2) {
    errors.push('DAG must have at least 2 nodes');
  }

  // Rule 2: All nodes must be connected to at least one edge
  if (nodes.length >= 2) {
    const connectedNodes = new Set<string>();
    edges.forEach(edge => {
      connectedNodes.add(edge.source);
      connectedNodes.add(edge.target);
    });

    const isolatedNodes = nodes.filter(node => !connectedNodes.has(node.id));
    if (isolatedNodes.length > 0) {
      errors.push(`${isolatedNodes.length} node(s) are not connected: ${isolatedNodes.map(n => n.data.label).join(', ')}`);
    }
  }

  // Rule 3: No cycles (detect cycles using DFS)
  if (hasCycles(nodes, edges)) {
    errors.push('DAG contains cycles - cycles are not allowed');
  }

  // Rule 4: No self-loops (already prevented in connection logic, but double-check)
  const selfLoops = edges.filter(edge => edge.source === edge.target);
  if (selfLoops.length > 0) {
    errors.push(`${selfLoops.length} self-loop(s) detected`);
  }

  // Warnings for best practices
  if (nodes.length > 10) {
    warnings.push('Large number of nodes may impact performance');
  }

  if (edges.length === 0 && nodes.length > 0) {
    warnings.push('No connections between nodes');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

const hasCycles = (nodes: Node[], edges: Edge[]): boolean => {
  const graph: { [key: string]: string[] } = {};
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  // Build adjacency list
  nodes.forEach(node => {
    graph[node.id] = [];
  });

  edges.forEach(edge => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });

  // DFS to detect cycles
  const dfs = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) {
      return true; // Cycle found
    }

    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph[nodeId] || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  };

  // Check each node
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }

  return false;
};
