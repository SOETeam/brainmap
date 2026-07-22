'use client';

import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { noise3D, fbm } from '@/utils/noise';
import { StatusColor } from '@/types';

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
  /** 0 = invisible, 1 = fully visible (for drill-down animation) */
  appearProgress?: number;
  /** Extra scale multiplier for drill-down */
  animScale?: number;
  /** Is this the central orb in collapsed state? */
  isCentralCollapsed?: boolean;
  /** Mobile performance flags */
  isMobile?: boolean;
  isLowEnd?: boolean;
}

function generateSphereParticles(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const noiseOffsets = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Distribute on sphere surface with slight volume variation
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = radius * (0.92 + Math.random() * 0.16);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const i3 = i * 3;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    basePositions[i3] = x;
    basePositions[i3 + 1] = y;
    basePositions[i3 + 2] = z;

    // Noise offsets for organic movement
    noiseOffsets[i3] = Math.random() * 100;
    noiseOffsets[i3 + 1] = Math.random() * 100;
    noiseOffsets[i3 + 2] = Math.random() * 100;

    // Sizes with variation
    sizes[i] = 0.8 + Math.random() * 0.6;

    // Placeholder colors (set per-frame based on status)
    colors[i3] = 1;
    colors[i3 + 1] = 1;
    colors[i3 + 2] = 1;
  }

  return { positions, basePositions, colors, sizes, noiseOffsets };
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
  appearProgress = 1,
  animScale = 1,
  isCentralCollapsed = false,
  isMobile = false,
  isLowEnd = false,
}: OrbProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const hoverPoint = useRef(new THREE.Vector3(0, 0, 0));
  const currentScale = useRef(0.01);
  const currentOpacity = useRef(0);
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const frameCount = useRef(0);

  // MOBILE: significantly reduce particle count
  const particleCount = useMemo(() => {
    const desktop = isCenter ? 1500 : 800;
    if (isLowEnd) return Math.floor(desktop * 0.3);   // 70% reduction
    if (isMobile) return Math.floor(desktop * 0.4);   // 60% reduction
    return desktop;
  }, [isCenter, isMobile, isLowEnd]);

  const color = useMemo(() => new THREE.Color(STATUS_HEX[status]), [status]);
  const colorHSL = useMemo(() => {
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    return hsl;
  }, [color]);

  const { positions, basePositions, colors, sizes, noiseOffsets } = useMemo(
    () => generateSphereParticles(particleCount, radius),
    [particleCount, radius]
  );

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  // Dispose geometry and material on unmount
  useEffect(() => {
    return () => {
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose();
        if (pointsRef.current.material instanceof THREE.Material) {
          pointsRef.current.material.dispose();
        }
      }
    };
  }, []);

  // Custom shader material for particles
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uHoverStrength: { value: 0 },
        uHoverPoint: { value: new THREE.Vector3(0, 0, 0) },
        uBaseColor: { value: color.clone() },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDistFromCenter;
        varying vec3 vWorldPos;
        uniform float uOpacity;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDistFromCenter = length(position);
          vWorldPos = position;
          gl_PointSize = size * (300.0 / -mvPosition.z) * uOpacity;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDistFromCenter;
        varying vec3 vWorldPos;
        uniform float uOpacity;
        uniform float uHoverStrength;
        uniform vec3 uHoverPoint;
        
        void main() {
          // Circular particle shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          // Soft glow falloff
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= alpha; // Sharper glow
          
          // Hover ripple highlight
          float hoverDist = length(vWorldPos - uHoverPoint);
          float ripple = sin(hoverDist * 10.0 - uHoverStrength * 8.0) * 0.5 + 0.5;
          ripple *= exp(-hoverDist * 2.0) * uHoverStrength;
          
          vec3 finalColor = vColor + vec3(ripple * 0.3);
          
          gl_FragColor = vec4(finalColor, alpha * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [color]);

  // Reusable temp color to avoid allocation in hot loop
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !groupRef.current) return;

    // MOBILE: skip particle animation on alternating frames (30fps instead of 60)
    frameCount.current++;
    const skipParticles = isMobile && frameCount.current % 2 !== 0;

    const t = state.clock.elapsedTime;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;

    // Smooth appear/disappear
    const targetScale = appearProgress * animScale;
    const targetOpacity = appearProgress;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 4);
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, delta * 4);

    groupRef.current.scale.setScalar(currentScale.current);
    mat.uniforms.uOpacity.value = currentOpacity.current;
    mat.uniforms.uTime.value = t;

    // Hover effect
    const hoverTarget = hovered ? 1 : 0;
    mat.uniforms.uHoverStrength.value = THREE.MathUtils.lerp(
      mat.uniforms.uHoverStrength.value,
      hoverTarget,
      delta * 8
    );

    // Float animation
    const floatY = Math.sin(t * floatSpeed + floatOffset.current) * floatIntensity;
    groupRef.current.position.y = position[1] + floatY;

    // Skip particle position/color updates on alternate frames for mobile
    if (skipParticles) return;

    // Update particle positions with noise-based organic movement
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    const posArr = posAttr.array as Float32Array;
    const colArr = colAttr.array as Float32Array;

    const noiseTime = t * 0.3;
    const noiseScale = isCenter ? 0.8 : 1.2;
    const waveAmplitude = radius * 0.08;

    // MOBILE: use fewer noise octaves
    const octaves = isLowEnd ? 1 : 2;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const nx = noiseOffsets[i3];
      const ny = noiseOffsets[i3 + 1];
      const nz = noiseOffsets[i3 + 2];

      // Noise-based displacement for organic "swarm" movement
      // On mobile: use simpler noise (fewer octaves)
      const dx = (isLowEnd ? noise3D(nx + noiseTime, ny, nz) : fbm(nx + noiseTime, ny, nz, octaves)) * waveAmplitude;
      const dy = (isLowEnd ? noise3D(nx, ny + noiseTime, nz) : fbm(nx, ny + noiseTime, nz, octaves)) * waveAmplitude;
      const dz = (isLowEnd ? noise3D(nx, ny, nz + noiseTime) : fbm(nx, ny, nz + noiseTime, octaves)) * waveAmplitude;

      posArr[i3] = basePositions[i3] + dx * noiseScale;
      posArr[i3 + 1] = basePositions[i3 + 1] + dy * noiseScale;
      posArr[i3 + 2] = basePositions[i3 + 2] + dz * noiseScale;

      // DESKTOP ONLY: per-frame color variation (expensive HSL conversion)
      if (!isMobile) {
        const hueShift = fbm(nx * 0.5, ny * 0.5, noiseTime) * 0.05;
        const satShift = fbm(nx * 0.3, noiseTime, nz * 0.3) * 0.1;
        const lightShift = fbm(noiseTime, ny * 0.3, nz * 0.3) * 0.08;

        const h = Math.max(0, Math.min(1, colorHSL.h + hueShift));
        const s = Math.max(0, Math.min(1, colorHSL.s + satShift));
        const l = Math.max(0.2, Math.min(0.9, colorHSL.l + lightShift + 0.1));

        tempColor.setHSL(h, s, l);
        colArr[i3] = tempColor.r;
        colArr[i3 + 1] = tempColor.g;
        colArr[i3 + 2] = tempColor.b;
      }
    }

    posAttr.needsUpdate = true;
    if (!isMobile) colAttr.needsUpdate = true;
  });

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick?.();
  }, [onClick]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    if (e.point) hoverPoint.current.copy(e.point);
    onPointerOver?.();
    document.body.style.cursor = 'pointer';
  }, [onPointerOver]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onPointerOut?.();
    document.body.style.cursor = 'default';
  }, [onPointerOut]);

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      scale={0.01}
    >
      {/* Particle sphere */}
      <points
        ref={pointsRef}
        geometry={geometry}
        material={material}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Inner glow core — simplify on mobile (fewer segments) */}
      <mesh>
        <sphereGeometry args={[radius * 0.3, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <meshBasicMaterial
          color={STATUS_HEX[status]}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow halo — simplify on mobile */}
      <mesh>
        <sphereGeometry args={[radius * 1.4, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <meshBasicMaterial
          color={STATUS_HEX[status]}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Label */}
      {showLabel && appearProgress > 0.5 && (
        <Html
          position={[0, -radius - 0.4, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none', opacity: Math.min(1, (appearProgress - 0.5) * 2) }}
        >
          <div className="text-center whitespace-nowrap select-none">
            <div className="text-lg mb-0.5">{icon}</div>
            <div
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: STATUS_HEX[status], textShadow: `0 0 12px ${STATUS_HEX[status]}80` }}
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
