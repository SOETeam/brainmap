'use client';

import { useState } from 'react';
import BrainMap from '@/components/BrainMap';
import DetailPanel from '@/components/DetailPanel';
import StatusBar from '@/components/StatusBar';
import { domainNodes, detailData } from '@/data/mockData';

export default function Dashboard() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen w-screen">
      <StatusBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <BrainMap
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
          />
        </div>
        {selectedNode && (
          <DetailPanel
            nodeId={selectedNode}
            node={domainNodes.find((n) => n.id === selectedNode)!}
            data={detailData[selectedNode as keyof typeof detailData]}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}
