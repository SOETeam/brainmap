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
    { text: 'Car insurance overdue', color: 'text-[#ff3366]' },
    { text: 'Legal deadline Aug 5', color: 'text-[#ffd000]' },
    { text: '6 agents online', color: 'text-[#4d9fff]' },
  ];

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-2.5
        bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]/50
        z-30 relative"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg sm:text-xl font-bold tracking-wider">
          <span className="text-[#00ff88]">BRAIN</span>
          <span className="text-[#00e5ff]">MAP</span>
        </h1>
        <span className="text-[10px] text-gray-600 font-mono hidden sm:inline">
          v0.2.0 · 3D
        </span>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {alerts.map((a, i) => (
          <span
            key={i}
            className={`text-[11px] font-mono px-2 py-1 rounded border border-[#1e1e2e]/50
              bg-[#0d0d14]/60 backdrop-blur-sm ${a.color}`}
          >
            {a.text}
          </span>
        ))}
      </div>

      <div className="text-xs sm:text-sm font-mono text-gray-500">{time}</div>
    </header>
  );
}
