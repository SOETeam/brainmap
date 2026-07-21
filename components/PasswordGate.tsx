'use client';

import { useState, useEffect } from 'react';

const CORRECT_PASSWORD = 'nyxwolf2026';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('brainmap_auth');
    if (stored === 'true') {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('brainmap_auth', 'true');
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#00ff88] animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-[#b44dff] rounded-lg blur opacity-25"></div>
          
          <form onSubmit={handleSubmit} className="relative bg-[#0d0d14] border border-[#1a1a2e] rounded-lg p-8 w-80">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🧠</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00e5ff] bg-clip-text text-transparent">
                BRAINMAP
              </h1>
              <p className="text-gray-500 text-sm mt-1">Command Dashboard</p>
            </div>

            {/* Input */}
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className="w-full bg-[#0a0a0f] border border-[#1a1a2e] rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88] transition-colors text-center"
                autoFocus
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-500 text-sm text-center mb-4 animate-pulse">
                Access denied
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00ff88] to-[#00e5ff] text-black font-bold py-3 rounded hover:opacity-90 transition-opacity"
            >
              ENTER
            </button>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-xs">Authorized personnel only</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
