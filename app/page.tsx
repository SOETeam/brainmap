'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import DetailPanel from '@/components/DetailPanel';
import StatusBar from '@/components/StatusBar';
import PasswordGate from '@/components/PasswordGate';
import { domainNodes, detailData } from '@/data/mockData';

const BrainMap = dynamic(() => import('@/components/BrainMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-[#00ff88] animate-pulse">Loading brain map...</div>
    </div>
  ),
});

export default function Dashboard() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <PasswordGate>
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
    </PasswordGate>
  );
}
