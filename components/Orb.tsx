'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { StatusColor } from '@/types';

// Map our status colors to hex values
const STATUS_HEX: Record<StatusColor, string> = {
  green: '#00ff88',
  yellow: '#ffd000',
  red: '#ff3366',
  blue: '#4d9fff',
  white: '#e0e0e0',
};

interface OrbProps {
  id: string;
  label: string;
  icon: string;
  metric: string;
  status: StatusColor;
  position: [number, number, number];
  radius?: number;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  showLabel?: boolean;
  isCenter?: boolean;
  floatSpeed?: number;
  floatIntensity?: number;
}

export default function Orb({
  id,
  label,
  icon,
  metric,
  status,
  position,
  radius = 0.6,
  onClick,
  onPointerOver,
  onPointerOut,
  showLabel = true,
  isCenter = false,
  floatSpeed = 1,
  floatIntensity = 0.3,
}: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = new THREE.Color(STATUS_HEX[status]);
  const baseEmissiveIntensity = isCenter ? 0.8 : 0.5;
  const targetEmissive = hovered ? 1.5 : baseEmissiveIntensity;
  const targetScale = hovered ? 1.15 : 1;
  const currentEmissive = useRef(baseEmissiveIntensity);
  const currentScale = useRef(1);
  const floatOffset = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth lerp emissive intensity
    currentEmissive.current = THREE.MathUtils.lerp(
      currentEmissive.current,
      targetEmissive,
      delta * 5
    );
    (
      meshRef.current.material as THREE.MeshStandardMaterial
    ).emissiveIntensity = currentEmissive.current;

    // Smooth scale
    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale,
      delta * 8
    );
    meshRef.current.scale.setScalar(currentScale.current);

    // Gentle float animation
    const t = Date.now() * 0.001;
    const floatY =
      Math.sin(t * floatSpeed + floatOffset.current) * floatIntensity;
    meshRef.current.position.y = position[1] + floatY;

    // Glow mesh follows
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      const glowScale = currentScale.current * (1.3 + Math.sin(t * 2 + floatOffset.current) * 0.1);
      glowRef.current.scale.setScalar(glowScale);
    }
  });

  return (
    <group>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onPointerOver?.();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onPointerOut?.();
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={baseEmissiveIntensity}
          metalness={0.3}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html
          position={[position[0], position[1] - radius - 0.35, position[2]]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-center whitespace-nowrap select-none">
            <div className="text-lg mb-0.5">{icon}</div>
            <div
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: STATUS_HEX[status], textShadow: `0 0 8px ${STATUS_HEX[status]}40` }}
            >
              {label}
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-0.5">
              {metric}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
