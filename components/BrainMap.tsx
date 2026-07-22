'use client';

import { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { domainNodes, edges as domainEdges } from '@/data/mockData';
import NodeCard from './NodeCard';

interface BrainMapProps {
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
}

function DomainNodeWrapper({
  data,
}: {
  data: { node: (typeof domainNodes)[0]; isSelected: boolean; onClick: () => void };
}) {
  return (
    <NodeCard
      node={data.node}
      isSelected={data.isSelected}
      onClick={data.onClick}
    />
  );
}

const nodeTypes: NodeTypes = {
  domain: DomainNodeWrapper,
};

// Position nodes in a hexagonal layout
const positions: Record<string, { x: number; y: number }> = {
  finances: { x: 500, y: 50 },
  business: { x: 850, y: 200 },
  agents: { x: 850, y: 450 },
  calendar: { x: 500, y: 600 },
  legal: { x: 150, y: 450 },
  home: { x: 150, y: 200 },
  health: { x: 500, y: 320 },
};

export default function BrainMap({ selectedNode, onNodeSelect }: BrainMapProps) {
  const initialNodes: Node[] = useMemo(
    () =>
      domainNodes.map((dn) => ({
        id: dn.id,
        type: 'domain',
        position: positions[dn.id] || { x: 0, y: 0 },
        data: {
          node: dn,
          isSelected: selectedNode === dn.id,
          onClick: () => onNodeSelect(dn.id === selectedNode ? null : dn.id),
        },
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedNode]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      domainEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        style: { stroke: '#1e1e2e', strokeWidth: 2 },
        labelStyle: { fill: '#666', fontSize: 10, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#0a0a0f', fillOpacity: 0.8 },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      })),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection changes
  useEffect(() => {
    setNodes(
      domainNodes.map((dn) => ({
        id: dn.id,
        type: 'domain',
        position: positions[dn.id] || { x: 0, y: 0 },
        data: {
          node: dn,
          isSelected: selectedNode === dn.id,
          onClick: () => onNodeSelect(dn.id === selectedNode ? null : dn.id),
        },
      }))
    );
  }, [selectedNode, setNodes, onNodeSelect]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange as OnEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        className="bg-cyber-bg"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e1e2e"
        />
        <Controls
          position="bottom-left"
          className="!bg-cyber-surface !border-cyber-border !rounded-lg"
        />
        <MiniMap
          position="bottom-right"
          nodeColor={(node) => {
            const dn = domainNodes.find((d) => d.id === node.id);
            if (!dn) return '#1e1e2e';
            const map: Record<string, string> = {
              green: '#00ff88',
              yellow: '#ffd000',
              red: '#ff3366',
              blue: '#4d9fff',
              white: '#e0e0e0',
            };
            return map[dn.status] || '#1e1e2e';
          }}
          maskColor="rgba(10,10,15,0.8)"
          className="!bg-cyber-surface !border-cyber-border !rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}
