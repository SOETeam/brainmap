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
  visible?: boolean;
}

function DataStreamLine({ from, to, color, visible = true }: ConnectionDef & { visible?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const phaseOffset = useRef(Math.random() * Math.PI * 2);
  const currentOpacity = useRef(0);

  const STREAM_PARTICLES = 40;

  const { geometry, basePositions, curve } = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2 + 0.5,
        (from[2] + to[2]) / 2
      ),
      new THREE.Vector3(...to)
    );

    const basePositions = new Float32Array(STREAM_PARTICLES * 3);
    const colors = new Float32Array(STREAM_PARTICLES * 3);
    const sizes = new Float32Array(STREAM_PARTICLES);

    const c = new THREE.Color(color);
    for (let i = 0; i < STREAM_PARTICLES; i++) {
      const t = i / STREAM_PARTICLES;
      const point = curve.getPoint(t);
      const i3 = i * 3;
      basePositions[i3] = point.x;
      basePositions[i3 + 1] = point.y;
      basePositions[i3 + 2] = point.z;

      // Color with slight variation
      const hsl = { h: 0, s: 0, l: 0 };
      c.getHSL(hsl);
      const vc = new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l + (Math.random() - 0.5) * 0.15);
      colors[i3] = vc.r;
      colors[i3 + 1] = vc.g;
      colors[i3 + 2] = vc.b;

      sizes[i] = 1.5 + Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(basePositions.slice(), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    return { geometry, basePositions, curve };
  }, [from, to, color]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uOpacity;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Pulse brightness along the stream
          float pulse = sin(uTime * 3.0 + length(position) * 2.0) * 0.3 + 0.7;
          vAlpha = pulse * uOpacity;
          
          gl_PointSize = size * (200.0 / -mvPosition.z) * uOpacity;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= alpha;
          
          gl_FragColor = vec4(vColor, alpha * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;

    // Smooth visibility
    const targetOpacity = visible ? 0.6 : 0;
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, 0.05);
    mat.uniforms.uOpacity.value = currentOpacity.current;
    mat.uniforms.uTime.value = t;

    // Animate particles flowing along the curve
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array as Float32Array;

    for (let i = 0; i < STREAM_PARTICLES; i++) {
      // Each particle flows along the curve with offset
      const flowT = ((i / STREAM_PARTICLES + t * 0.15 + phaseOffset.current * 0.1) % 1 + 1) % 1;
      const point = curve.getPoint(flowT);
      const i3 = i * 3;

      // Add slight wave perpendicular to curve
      const wave = Math.sin(t * 2 + i * 0.5) * 0.03;
      posArr[i3] = point.x + wave;
      posArr[i3 + 1] = point.y + wave;
      posArr[i3 + 2] = point.z + wave * 0.5;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}

export default function ConnectionLines({ connections, visible = true }: ConnectionLinesProps) {
  return (
    <group>
      {connections.map((conn, i) => (
        <DataStreamLine key={i} {...conn} visible={visible} />
      ))}
    </group>
  );
}
