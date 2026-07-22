'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STATUS_HEX: Record<string, string> = {
  green: '#00ff88',
  yellow: '#ffd000',
  red: '#ff3366',
  blue: '#4d9fff',
  white: '#e0e0e0',
};

interface ConnectionDef {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  label?: string;
}

interface ConnectionLinesProps {
  connections: ConnectionDef[];
}

function PulsingLine({ from, to, color }: ConnectionDef) {
  const meshRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const phaseOffset = useRef(Math.random() * Math.PI * 2);

  const geometry = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2 + 0.5,
        (from[2] + to[2]) / 2
      ),
      new THREE.Vector3(...to)
    );
    const points = curve.getPoints(24);
    const positions: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      positions.push(points[i].x, points[i].y, points[i].z);
      positions.push(points[i + 1].x, points[i + 1].y, points[i + 1].z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, [from, to]);

  useFrame(() => {
    if (!materialRef.current) return;
    const t = Date.now() * 0.001;
    const pulse = 0.15 + Math.sin(t * 2 + phaseOffset.current) * 0.1;
    materialRef.current.opacity = pulse;
  });

  return (
    <lineSegments ref={meshRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.2}
      />
    </lineSegments>
  );
}

export default function ConnectionLines({ connections }: ConnectionLinesProps) {
  return (
    <group>
      {connections.map((conn, i) => (
        <PulsingLine key={i} {...conn} />
      ))}
    </group>
  );
}
