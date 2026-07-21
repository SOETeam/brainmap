/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          surface: '#12121a',
          border: '#1e1e2e',
          green: '#00ff88',
          cyan: '#00e5ff',
          purple: '#b44dff',
          red: '#ff3366',
          yellow: '#ffd000',
          blue: '#4d9fff',
          white: '#e0e0e0',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px var(--glow-color, #00ff88), 0 0 10px var(--glow-color, #00ff88)' },
          '100%': { boxShadow: '0 0 10px var(--glow-color, #00ff88), 0 0 25px var(--glow-color, #00ff88), 0 0 40px var(--glow-color, #00ff88)' },
        },
      },
    },
  },
  plugins: [],
};
