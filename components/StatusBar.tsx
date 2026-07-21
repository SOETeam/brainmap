'use client';

import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const alerts = [
    { text: 'Car insurance overdue', color: 'text-cyber-red' },
    { text: 'Legal deadline Aug 5', color: 'text-cyber-yellow' },
    { text: '6 agents online', color: 'text-cyber-blue' },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-cyber-surface border-b border-cyber-border">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-wider">
          <span className="text-cyber-green">BRAIN</span>
          <span className="text-cyber-cyan">MAP</span>
        </h1>
        <span className="text-xs text-gray-500 font-mono">v0.1.0</span>
      </div>

      <div className="flex items-center gap-6">
        {alerts.map((a, i) => (
          <span
            key={i}
            className={`text-xs font-mono px-2 py-1 rounded border border-cyber-border bg-cyber-bg ${a.color}`}
          >
            {a.text}
          </span>
        ))}
      </div>

      <div className="text-sm font-mono text-gray-400">{time}</div>
    </header>
  );
}
