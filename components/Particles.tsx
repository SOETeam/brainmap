'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 300;
const SPREAD = 14;

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color('#00ff88'),
      new THREE.Color('#00e5ff'),
      new THREE.Color('#b44dff'),
      new THREE.Color('#4d9fff'),
      new THREE.Color('#ff3366'),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * SPREAD;
      positions[i3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i3 + 2] = (Math.random() - 0.5) * SPREAD;

      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, velocities, colors, sizes };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  // Grid lines geometry
  const gridGeometry = useMemo(() => {
    const gridSize = 20;
    const gridDiv = 20;
    const positions: number[] = [];

    for (let i = 0; i <= gridDiv; i++) {
      const t = (i / gridDiv) * gridSize - gridSize / 2;
      // X lines
      positions.push(-gridSize / 2, -4, t, gridSize / 2, -4, t);
      // Z lines
      positions.push(t, -4, -gridSize / 2, t, -4, gridSize / 2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Wrap around
      for (let j = 0; j < 3; j++) {
        if (posArray[i3 + j] > SPREAD / 2) posArray[i3 + j] = -SPREAD / 2;
        if (posArray[i3 + j] < -SPREAD / 2) posArray[i3 + j] = SPREAD / 2;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Ambient floating particles */}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle grid floor */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial
          color="#0a1a2a"
          transparent
          opacity={0.15}
        />
      </lineSegments>
    </group>
  );
}
