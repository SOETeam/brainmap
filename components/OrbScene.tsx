'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Orb from './Orb';
import ConnectionLines from './ConnectionLines';
import Particles from './Particles';
import { domainNodes, edges, detailData } from '@/data/mockData';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  StatusColor,
  FinanceData,
  HealthData,
  AgentsData,
  CalendarData,
  LegalData,
  BusinessData,
  HomeData,
} from '@/types';

const STATUS_HEX: Record<StatusColor, string> = {
  green: '#00ff88',
  yellow: '#ffd000',
  red: '#ff3366',
  blue: '#4d9fff',
  white: '#e0e0e0',
};

const DOMAIN_RADIUS = 3.5;
function getDomainPositions(count: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    positions.push([
      Math.cos(angle) * DOMAIN_RADIUS,
      Math.sin(angle) * DOMAIN_RADIUS * 0.6,
      Math.sin(angle) * 0.5,
    ]);
  }
  return positions;
}

type SubOrbItem = {
  id: string;
  label: string;
  icon: string;
  metric: string;
  status: StatusColor;
  position: [number, number, number];
};

function getSubOrbs(domainId: string): SubOrbItem[] {
  const raw = detailData[domainId as keyof typeof detailData];
  if (!raw) return [];

  const items: SubOrbItem[] = [];

  const place = (i: number, total: number): [number, number, number] => {
    const angle = (i / total) * Math.PI * 2;
    return [Math.cos(angle) * 2, Math.sin(angle) * 1.5, Math.sin(angle) * 0.3];
  };

  switch (domainId) {
    case 'finances': {
      const data = raw as FinanceData;
      data.accounts.forEach((a, i) => {
        items.push({
          id: `fin-${i}`,
          label: a.name,
          icon: a.type === 'checking' ? '🏦' : a.type === 'savings' ? '💎' : '📱',
          metric: `$${a.balance.toFixed(2)}`,
          status: a.balance > 500 ? 'green' : 'yellow',
          position: place(i, data.accounts.length + data.billsDue.length),
        });
      });
      data.billsDue.forEach((b, i) => {
        items.push({
          id: `bill-${i}`,
          label: b.name,
          icon: '📄',
          metric: `$${b.amount.toFixed(0)}`,
          status: b.status === 'overdue' ? 'red' : 'yellow',
          position: place(i + data.accounts.length, data.accounts.length + data.billsDue.length),
        });
      });
      break;
    }
    case 'health': {
      const data = raw as HealthData;
      const healthItems = [
        { id: 'hrt', label: 'HRT', icon: '💊', metric: data.hrtStatus.active ? 'Active' : 'Inactive', status: 'green' as StatusColor },
        { id: 'weight', label: 'Weight', icon: '⚖️', metric: `${data.currentWeight} lbs`, status: 'green' as StatusColor },
        { id: 'meals', label: 'Nutrition', icon: '🥗', metric: `${data.recentMeals.length} logged`, status: 'green' as StatusColor },
        { id: 'target', label: 'Target', icon: '🎯', metric: `${data.targetWeight} lbs`, status: 'blue' as StatusColor },
      ];
      healthItems.forEach((item, i) => {
        items.push({ ...item, position: place(i, healthItems.length) });
      });
      break;
    }
    case 'agents': {
      const data = raw as AgentsData;
      const statusMap: Record<string, StatusColor> = { active: 'green', idle: 'yellow', error: 'red', offline: 'white' };
      data.profiles.forEach((a, i) => {
        items.push({
          id: `agent-${i}`,
          label: a.name,
          icon: '🤖',
          metric: `${a.tasksCompleted} tasks`,
          status: statusMap[a.status] || 'blue',
          position: place(i, data.profiles.length),
        });
      });
      break;
    }
    case 'calendar': {
      const data = raw as CalendarData;
      const evts = data.events.slice(0, 6);
      const priorityMap: Record<string, StatusColor> = { high: 'red', medium: 'yellow', low: 'green' };
      evts.forEach((e, i) => {
        items.push({
          id: `cal-${i}`,
          label: e.title.length > 18 ? e.title.slice(0, 18) + '…' : e.title,
          icon: '📅',
          metric: e.date,
          status: priorityMap[e.priority] || 'blue',
          position: place(i, evts.length),
        });
      });
      break;
    }
    case 'legal': {
      const data = raw as LegalData;
      data.cases.forEach((c, i) => {
        items.push({
          id: `case-${i}`,
          label: c.name,
          icon: '⚖️',
          metric: `$${c.amount.toLocaleString()}`,
          status: 'red',
          position: place(i, data.cases.length),
        });
      });
      break;
    }
    case 'business': {
      const data = raw as BusinessData;
      const bizItems: Omit<SubOrbItem, 'position'>[] = [
        {
          id: 'revenue',
          label: 'Revenue',
          icon: '📈',
          metric: `$${data.revenue[data.revenue.length - 1]?.amount.toLocaleString()}`,
          status: 'green',
        },
        ...data.pipeline.map((p, i) => ({
          id: `pipe-${i}`,
          label: p.stage,
          icon: '🔄',
          metric: `${p.count} · $${p.value.toLocaleString()}`,
          status: 'blue' as StatusColor,
        })),
        ...data.projects.map((p, i) => ({
          id: `proj-${i}`,
          label: p.name,
          icon: '🚀',
          metric: `${p.progress}%`,
          status: (p.progress > 50 ? 'green' : 'yellow') as StatusColor,
        })),
      ];
      bizItems.forEach((item, i) => {
        items.push({ ...item, position: place(i, bizItems.length) });
      });
      break;
    }
    case 'home': {
      const data = raw as HomeData;
      const homeItems: Omit<SubOrbItem, 'position'>[] = [
        ...data.chores.map((c, i) => ({
          id: `chore-${i}`,
          label: c.task,
          icon: c.done ? '✅' : '📋',
          metric: c.assignee,
          status: (c.done ? 'green' : 'yellow') as StatusColor,
        })),
        ...data.familySchedule.map((f, i) => ({
          id: `fam-${i}`,
          label: f.member,
          icon: '👤',
          metric: f.event,
          status: 'blue' as StatusColor,
        })),
        ...data.pets.map((p, i) => ({
          id: `pet-${i}`,
          label: p.name,
          icon: '🐕',
          metric: `Vet: ${p.nextVet}`,
          status: 'green' as StatusColor,
        })),
      ];
      homeItems.forEach((item, i) => {
        items.push({ ...item, position: place(i, homeItems.length) });
      });
      break;
    }
  }

  return items;
}

interface OrbSceneProps {
  onNodeSelect: (id: string | null) => void;
  drillDepth: number;
  setDrillDepth: (depth: number) => void;
  activeDomain: string | null;
  setActiveDomain: (domain: string | null) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function OrbScene({
  onNodeSelect,
  drillDepth,
  setDrillDepth,
  activeDomain,
  setActiveDomain,
  isExpanded,
  setIsExpanded,
}: OrbSceneProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const domainPositions = useMemo(() => getDomainPositions(domainNodes.length), []);

  // Domain orb visibility — use actual state for the initial expand
  const [domainOrbsVisible, setDomainOrbsVisible] = useState(false);
  const expandAnimProgress = useRef(0);

  // Smoothly animate expand progress
  useFrame((_, delta) => {
    const target = isExpanded ? 1 : 0;
    expandAnimProgress.current = THREE.MathUtils.lerp(expandAnimProgress.current, target, delta * 2.5);
  });

  // Show domain orbs after a short delay when expanding
  const handleCentralClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      setDomainOrbsVisible(true);
    }
  }, [isExpanded, setIsExpanded]);

  // Smoothly move camera to target (non-blocking — doesn't fight OrbitControls)
  const animateCamera = useCallback((targetPos: THREE.Vector3, targetLook: THREE.Vector3) => {
    if (!controlsRef.current) return;
    // Set the OrbitControls target — this lets OrbitControls handle the actual camera
    controlsRef.current.target.copy(targetLook);
    // Smoothly move camera
    const startPos = camera.position.clone();
    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      camera.position.lerpVectors(startPos, targetPos, ease);
      controlsRef.current?.target.copy(targetLook);
      controlsRef.current?.update();
      if (t < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [camera]);

  const handleDomainClick = useCallback(
    (domainId: string) => {
      const idx = domainNodes.findIndex((n) => n.id === domainId);
      if (idx < 0) return;

      setActiveDomain(domainId);
      setDrillDepth(1);
      onNodeSelect(domainId);

      const pos = domainPositions[idx];
      animateCamera(
        new THREE.Vector3(pos[0] * 0.3, pos[1] * 0.3, pos[2] + 4),
        new THREE.Vector3(pos[0], pos[1], pos[2])
      );
    },
    [domainPositions, setActiveDomain, setDrillDepth, onNodeSelect, animateCamera]
  );

  const handleSubClick = useCallback(
    (_subId: string) => {
      onNodeSelect(activeDomain);
    },
    [activeDomain, onNodeSelect]
  );

  // Connection lines for domain level
  const domainConnections = useMemo(() => {
    return edges
      .map((edge) => {
        const fromIdx = domainNodes.findIndex((n) => n.id === edge.source);
        const toIdx = domainNodes.findIndex((n) => n.id === edge.target);
        if (fromIdx < 0 || toIdx < 0) return null;
        const fromNode = domainNodes[fromIdx];
        return {
          from: domainPositions[fromIdx],
          to: domainPositions[toIdx],
          color: STATUS_HEX[fromNode.status],
          label: edge.label,
        };
      })
      .filter(Boolean) as {
      from: [number, number, number];
      to: [number, number, number];
      color: string;
      label?: string;
    }[];
  }, [domainPositions]);

  const subOrbs = useMemo(() => {
    if (!activeDomain || drillDepth < 1) return [];
    return getSubOrbs(activeDomain);
  }, [activeDomain, drillDepth]);

  const subConnections = useMemo(() => {
    if (!activeDomain || drillDepth < 1) return [];
    return subOrbs.map((sub) => ({
      from: [0, 0, 0] as [number, number, number],
      to: sub.position,
      color: STATUS_HEX[sub.status],
    }));
  }, [subOrbs, activeDomain, drillDepth]);

  return (
    <>
      {/* OrbitControls — the ONLY thing controlling the camera */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.5}
        minDistance={2}
        maxDistance={25}
        makeDefault
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#00e5ff" />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#b44dff" />
      <pointLight position={[-5, -5, 3]} intensity={0.3} color="#00ff88" />

      {/* Background */}
      <Stars radius={50} depth={50} count={2000} factor={3} saturation={0.2} fade speed={0.5} />
      <color attach="background" args={['#030308']} />
      <fog attach="fog" args={['#030308', 15, 40]} />

      <Particles />

      {/* === MAIN VIEW === */}
      {drillDepth === 0 && (
        <>
          {/* Central orb */}
          <Orb
            id="center"
            label="Life"
            icon="🧠"
            metric={isExpanded ? '7 domains active' : 'Tap to explore'}
            status="white"
            position={[0, 0, 0]}
            radius={isExpanded ? 0.6 : 1.2}
            isCenter
            floatSpeed={0.5}
            floatIntensity={0.15}
            showLabel
            onClick={handleCentralClick}
            isCentralCollapsed={!isExpanded}
            appearProgress={1}
            animScale={1}
          />

          {/* Domain orbs — shown once expanded */}
          {domainOrbsVisible &&
            domainNodes.map((node, i) => (
              <Orb
                key={node.id}
                id={node.id}
                label={node.title}
                icon={node.icon}
                metric={node.metric}
                status={node.status}
                position={domainPositions[i]}
                radius={0.55}
                onClick={() => handleDomainClick(node.id)}
                floatSpeed={0.8 + i * 0.1}
                floatIntensity={0.2}
                appearProgress={1}
                animScale={1}
              />
            ))}

          {/* Connection lines */}
          {domainOrbsVisible && (
            <ConnectionLines connections={domainConnections} visible />
          )}
        </>
      )}

      {/* === SUB LEVEL === */}
      {drillDepth === 1 && activeDomain && (
        <>
          {(() => {
            const dn = domainNodes.find((n) => n.id === activeDomain);
            if (!dn) return null;
            return (
              <Orb
                id={dn.id}
                label={dn.title}
                icon={dn.icon}
                metric={dn.metric}
                status={dn.status}
                position={[0, 0, 0]}
                radius={0.8}
                isCenter
                floatSpeed={0.5}
                floatIntensity={0.1}
                appearProgress={1}
              />
            );
          })()}

          {subOrbs.map((sub) => (
            <Orb
              key={sub.id}
              id={sub.id}
              label={sub.label}
              icon={sub.icon}
              metric={sub.metric}
              status={sub.status}
              position={sub.position}
              radius={0.35}
              onClick={() => handleSubClick(sub.id)}
              floatSpeed={1}
              floatIntensity={0.15}
              appearProgress={1}
            />
          ))}

          <ConnectionLines connections={subConnections} visible />
        </>
      )}
    </>
  );
}
