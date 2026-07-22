'use client';

import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import OrbScene from './OrbScene';

interface BrainMapProps {
  selectedNode: string | null;
  onNodeSelect: (id: string | null) => void;
  drillDepth: number;
  setDrillDepth: (depth: number) => void;
  activeDomain: string | null;
  setActiveDomain: (domain: string | null) => void;
}

export default function BrainMap({
  selectedNode,
  onNodeSelect,
  drillDepth,
  setDrillDepth,
  activeDomain,
  setActiveDomain,
}: BrainMapProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#050508' }}
      >
        <OrbScene
          onNodeSelect={onNodeSelect}
          drillDepth={drillDepth}
          setDrillDepth={setDrillDepth}
          activeDomain={activeDomain}
          setActiveDomain={setActiveDomain}
        />
      </Canvas>
    </div>
  );
}
