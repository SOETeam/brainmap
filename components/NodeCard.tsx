'use client';

import { DomainNode, StatusColor } from '@/types';

interface NodeCardProps {
  node: DomainNode;
  isSelected: boolean;
  onClick: () => void;
}

const statusBorder: Record<StatusColor, string> = {
  green: 'border-cyber-green',
  yellow: 'border-cyber-yellow',
  red: 'border-cyber-red',
  blue: 'border-cyber-blue',
  white: 'border-gray-500',
};

const statusGlow: Record<StatusColor, string> = {
  green: 'shadow-[0_0_12px_rgba(0,255,136,0.3)]',
  yellow: 'shadow-[0_0_12px_rgba(255,208,0,0.3)]',
  red: 'shadow-[0_0_12px_rgba(255,51,102,0.5)]',
  blue: 'shadow-[0_0_12px_rgba(77,159,255,0.3)]',
  white: '',
};

const statusText: Record<StatusColor, string> = {
  green: 'text-cyber-green',
  yellow: 'text-cyber-yellow',
  red: 'text-cyber-red',
  blue: 'text-cyber-blue',
  white: 'text-gray-400',
};

const statusBg: Record<StatusColor, string> = {
  green: 'bg-cyber-green/5',
  yellow: 'bg-cyber-yellow/5',
  red: 'bg-cyber-red/5',
  blue: 'bg-cyber-blue/5',
  white: 'bg-gray-800/20',
};

export default function NodeCard({ node, isSelected, onClick }: NodeCardProps) {
  const pulseClass =
    node.status === 'red'
      ? 'node-urgent'
      : node.status === 'green'
        ? 'node-active'
        : '';

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl border-2 p-4 w-56
        bg-cyber-surface transition-all duration-300
        ${statusBorder[node.status]}
        ${statusGlow[node.status]}
        ${statusBg[node.status]}
        ${pulseClass}
        ${isSelected ? 'ring-2 ring-cyber-cyan scale-105' : 'hover:scale-[1.03]'}
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{node.icon}</span>
        <h3 className="font-bold text-sm text-white">{node.title}</h3>
      </div>

      <p className={`text-xs font-mono ${statusText[node.status]} mb-1`}>
        {node.metric}
      </p>

      <div className="flex items-center gap-1.5 mt-2">
        <div
          className={`w-2 h-2 rounded-full ${
            node.status === 'green'
              ? 'bg-cyber-green'
              : node.status === 'yellow'
                ? 'bg-cyber-yellow'
                : node.status === 'red'
                  ? 'bg-cyber-red'
                  : node.status === 'blue'
                    ? 'bg-cyber-blue'
                    : 'bg-gray-500'
          }`}
        />
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          {node.status === 'green'
            ? 'on track'
            : node.status === 'yellow'
              ? 'attention'
              : node.status === 'red'
                ? 'urgent'
                : node.status === 'blue'
                  ? 'active'
                  : 'neutral'}
        </span>
      </div>
    </div>
  );
}
