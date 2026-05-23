"use client";

import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

interface GraphVisualizerProps {
  knowledge: {
    explicitPreferences: any[];
    impliedAttributes: string[];
  };
}

export function GraphVisualizer({ knowledge }: GraphVisualizerProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Root user node
    nodes.push({
      id: 'user',
      data: { label: 'You (User)' },
      position: { x: 250, y: 0 },
      style: { background: '#3b82f6', color: '#fff', fontWeight: 'bold', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }
    });

    // Explicit Preference Nodes
    knowledge.explicitPreferences.forEach((pref, index) => {
      const id = `pref-${index}`;
      nodes.push({
        id,
        data: { label: pref.name },
        position: { x: index * 150, y: 150 },
        style: { background: '#10b981', color: '#fff', fontSize: '12px', borderRadius: '8px', padding: '10px' }
      });

      edges.push({
        id: `e-user-${id}`,
        source: 'user',
        target: id,
        label: 'PREFERS',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981' }
      });
    });

    // Implied Attribute Nodes
    knowledge.impliedAttributes.forEach((attr, index) => {
      const id = `attr-${index}`;
      nodes.push({
        id,
        data: { label: attr },
        position: { x: (index + knowledge.explicitPreferences.length) * 150, y: 150 },
        style: { background: '#6366f1', color: '#fff', fontSize: '10px', borderRadius: '8px', padding: '8px' }
      });

      edges.push({
        id: `e-user-${id}`,
        source: 'user',
        target: id,
        label: 'INTERESTED',
        animated: true,
        style: { stroke: '#6366f1' }
      });
    });

    return { nodes, edges };
  }, [knowledge]);

  return (
    <div style={{ width: '100%', height: '400px' }} className="border rounded-2xl bg-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
