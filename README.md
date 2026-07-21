# BrainMap 🧠

Interactive command dashboard — a life management visualization tool showing interconnected domains as a node graph.

## Domains

| Domain | Metric | Status |
|--------|--------|--------|
| 💰 Finances | $486 available | 🟡 Attention |
| 💊 Health | 231.5 lbs · HRT ✅ | 🟢 On Track |
| 🤖 Agents | 6 profiles active | 🔵 Active |
| 📅 Calendar | 25 events this week | 🟢 On Track |
| ⚖️ Legal | $6K active lawsuit | 🔴 Urgent |
| 🏢 Business | SOETech | 🟢 On Track |
| 🏠 Home | Kids · Dogs · Chores | 🟡 Attention |

## Tech Stack

- **Next.js 14** — App Router
- **React Flow** (@xyflow/react) — Node graph visualization
- **Tailwind CSS** — Dark cyberpunk theme
- **TypeScript** — Full type safety

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
  layout.tsx       — Dark theme root layout
  page.tsx         — Main dashboard with node selection state
  globals.css      — Cyberpunk styles, React Flow overrides
components/
  BrainMap.tsx     — React Flow graph with hexagonal node layout
  NodeCard.tsx     — Custom domain node with status glow/pulse
  DetailPanel.tsx  — Right-side detail panel per domain
  StatusBar.tsx    — Top bar with alerts and live clock
data/
  mockData.ts      — All mock data for 7 domains
types/
  index.ts         — TypeScript interfaces
```

## Theme

Dark cyberpunk — neon green (#00ff88), cyan (#00e5ff), purple (#b44dff) accents on near-black background. Urgent nodes pulse red; active nodes glow green.

## Status Colors

- 🟢 **Green** — Healthy / on track
- 🟡 **Yellow** — Needs attention
- 🔴 **Red** — Urgent
- 🔵 **Blue** — Agent activity
- ⚪ **White** — Neutral

---

Built for Sophia Saitta's personal command dashboard. Internal tool first, potential SaaS product later.
