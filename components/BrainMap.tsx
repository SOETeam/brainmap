'use client';

import { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Show "tap to explore" hint on first load for mobile
  useEffect(() => {
    if (isMobile && !isExpanded && drillDepth === 0) {
      const timer = setTimeout(() => setShowHint(true), 1500);
      const hideTimer = setTimeout(() => setShowHint(false), 6000);
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [isMobile, isExpanded, drillDepth]);

  // Hide hint when expanded
  useEffect(() => {
    if (isExpanded) setShowHint(false);
  }, [isExpanded]);

  // Reset expand state when going back to top level
  useEffect(() => {
    if (drillDepth === 0 && !activeDomain) {
      // Keep expanded state when returning from sub-level
    }
  }, [drillDepth, activeDomain]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#030308', touchAction: 'none' }}
        // Ensure touch events propagate
        onCreated={({ gl }) => {
          gl.domElement.style.touchAction = 'none';
        }}
      >
        {/* OrbitControls with full touch support */}
        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.5}
          minDistance={3}
          maxDistance={20}
          // Touch configuration
          touches={{
            ONE: 1, // ROTATE (THREE.TOUCH.ROTATE)
            TWO: 2, // DOLLY_PAN (THREE.TOUCH.DOLLY_PAN)
          }}
          mouseButtons={{
            LEFT: 0, // ROTATE
            MIDDLE: 1, // DOLLY
            RIGHT: 2, // PAN
          }}
        />

        <OrbScene
          onNodeSelect={onNodeSelect}
          drillDepth={drillDepth}
          setDrillDepth={setDrillDepth}
          activeDomain={activeDomain}
          setActiveDomain={setActiveDomain}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />

        {/* Post-processing bloom */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* "Tap to Explore" mobile hint */}
      {showHint && !isExpanded && drillDepth === 0 && (
        <div
          className="absolute inset-0 flex items-end justify-center pb-24 pointer-events-none z-10"
          style={{ animation: 'fadeInOut 4s ease-in-out' }}
        >
          <div className="bg-[#0a0a1a]/80 backdrop-blur-sm border border-[#00e5ff]/30 rounded-full px-6 py-3 flex items-center gap-3">
            {/* Animated tap icon */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full border-2 border-[#00e5ff]/60 animate-ping absolute inset-0" />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="#00e5ff" strokeWidth="1.5"/>
                <circle cx="12" cy="10" r="3" fill="#00e5ff" opacity="0.6">
                  <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </div>
            <span className="text-[#00e5ff] text-sm font-mono tracking-wider">
              TAP THE ORB TO EXPLORE
            </span>
          </div>
        </div>
      )}

      {/* Desktop hint (subtle) */}
      {!isMobile && !isExpanded && drillDepth === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 opacity-40">
          <span className="text-gray-500 text-xs font-mono tracking-wider">
            CLICK THE ORB TO EXPLORE · DRAG TO ROTATE · SCROLL TO ZOOM
          </span>
        </div>
      )}
    </div>
  );
}
