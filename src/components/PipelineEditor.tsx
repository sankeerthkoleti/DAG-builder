
import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  Controls,
  Background,
  MiniMap,
  ConnectionMode,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PipelineNode } from './PipelineNode';
import { Toolbar } from './Toolbar';
import { StatusPanel } from './StatusPanel';
import { JsonPreview } from './JsonPreview';
import { validateDAG } from '@/utils/dagValidation';
import { autoLayout } from '@/utils/autoLayout';
import { toast } from 'sonner';

const nodeTypes = {
  pipeline: PipelineNode,
};

export const PipelineEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const addNode = useCallback((name: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'pipeline',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: name },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Node "${name}" added`);
  }, [setNodes]);

  const onConnect = useCallback((params: Connection) => {
    // Prevent self-connections
    if (params.source === params.target) {
      toast.error('Self-connections are not allowed');
      return;
    }

    const newEdge: Edge = {
      ...params,
      id: `edge-${Date.now()}`,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true,
    };

    setEdges((eds) => addEdge(newEdge, eds));
    toast.success('Connection created');
  }, [setEdges]);

  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0) {
      const nodeIds = selectedNodes.map(node => node.id);
      setNodes(nds => nds.filter(node => !nodeIds.includes(node.id)));
      setEdges(eds => eds.filter(edge => 
        !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
      ));
      toast.success(`Deleted ${selectedNodes.length} node(s)`);
    }
    
    if (selectedEdges.length > 0) {
      const edgeIds = selectedEdges.map(edge => edge.id);
      setEdges(eds => eds.filter(edge => !edgeIds.includes(edge.id)));
      toast.success(`Deleted ${selectedEdges.length} edge(s)`);
    }
  }, [nodes, edges, setNodes, setEdges]);

  const handleAutoLayout = useCallback(() => {
    const layoutedNodes = autoLayout(nodes, edges);
    setNodes(layoutedNodes);
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 100);
    toast.success('Layout applied');
  }, [nodes, edges, setNodes, fitView]);

  const dagStatus = useMemo(() => {
    return validateDAG(nodes, edges);
  }, [nodes, edges]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      handleDeleteSelected();
    }
  }, [handleDeleteSelected]);

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar 
        onAddNode={addNode}
        onAutoLayout={handleAutoLayout}
        onDeleteSelected={handleDeleteSelected}
        hasSelection={nodes.some(n => n.selected) || edges.some(e => e.selected)}
      />
      
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Strict}
            fitView
            className="bg-gray-50"
          >
            <Background />
            <Controls />
            <MiniMap 
              nodeColor={(node) => node.selected ? '#ef4444' : '#3b82f6'}
              className="bg-white"
            />
          </ReactFlow>
        </div>
        
        <div className="w-80 border-l bg-white flex flex-col">
          <StatusPanel status={dagStatus} />
          <JsonPreview nodes={nodes} edges={edges} />
        </div>
      </div>
    </div>
  );
};
