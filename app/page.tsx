'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import DetailPanel from '@/components/DetailPanel';
import StatusBar from '@/components/StatusBar';
import PasswordGate from '@/components/PasswordGate';
import { domainNodes, detailData } from '@/data/mockData';

const BrainMap = dynamic(() => import('@/components/BrainMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050508]">
      <div className="text-center">
        <div className="text-4xl mb-4">🧠</div>
        <div className="text-[#00ff88] animate-pulse text-lg font-mono tracking-wider">
          INITIALIZING NEURAL MAP...
        </div>
      </div>
    </div>
  ),
});

export default function Dashboard() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [drillDepth, setDrillDepth] = useState(0);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const handleNodeSelect = useCallback((id: string | null) => {
    setSelectedNode(id);
  }, []);

  const handleZoomOut = useCallback(() => {
    setDrillDepth(0);
    setActiveDomain(null);
    setSelectedNode(null);
  }, []);

  const activeDomainNode = activeDomain
    ? domainNodes.find((n) => n.id === activeDomain)
    : null;

  return (
    <PasswordGate>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {/* StatusBar overlay */}
        <StatusBar />

        {/* Breadcrumb / Back button - overlays on 3D scene */}
        {drillDepth > 0 && activeDomainNode && (
          <div className="absolute top-14 left-4 z-20 flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                bg-[#12121a]/80 backdrop-blur-sm border border-[#1e1e2e]
                text-[#00e5ff] hover:text-white hover:border-[#00e5ff]
                transition-all text-sm font-mono"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Overview
            </button>
            <span className="text-[#1e1e2e] text-sm">|</span>
            <span className="text-gray-400 text-sm font-mono">
              🧠 Life
            </span>
            <span className="text-gray-600 text-sm">›</span>
            <span
              className="text-sm font-mono font-bold"
              style={{
                color:
                  activeDomainNode.status === 'green'
                    ? '#00ff88'
                    : activeDomainNode.status === 'yellow'
                      ? '#ffd000'
                      : activeDomainNode.status === 'red'
                        ? '#ff3366'
                        : '#4d9fff',
              }}
            >
              {activeDomainNode.icon} {activeDomainNode.title}
            </span>
          </div>
        )}

        {/* Main 3D scene */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative">
            <BrainMap
              selectedNode={selectedNode}
              onNodeSelect={handleNodeSelect}
              drillDepth={drillDepth}
              setDrillDepth={setDrillDepth}
              activeDomain={activeDomain}
              setActiveDomain={setActiveDomain}
            />
          </div>

          {/* Detail panel overlay */}
          {selectedNode && (
            <DetailPanel
              nodeId={selectedNode}
              node={
                domainNodes.find((n) => n.id === selectedNode) || domainNodes[0]
              }
              data={detailData[selectedNode as keyof typeof detailData]}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </div>
      </div>
    </PasswordGate>
  );
}
