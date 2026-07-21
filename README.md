# 🧠 PROJECT: Nyx Brain Map — Interactive Command Dashboard

**Project Code:** BRAINMAP-001
**Status:** CONCEPT → DESIGN
**Created:** July 21, 2026
**Owner:** Sophia Saitta × Nyx-Prime
**Category:** SOETech Internal Tool → Potential SaaS Product

---

## Vision

An interactive, real-time visualization of Sophia's entire life system — finances, health, agents, calendar, legal, business, home — displayed as an interconnected brain map. Think: cyber threat monitoring dashboard meets personal command center.

**The Problem:** Too much data scattered across GDrive, local files, Discord, cron jobs, and memory. No single place to see EVERYTHING at once and understand how it all connects.

**The Solution:** A living, breathing dashboard where every domain is a node, connections show data flow, and color-coded urgency tells you what needs attention RIGHT NOW.

---

## Design Concept

### Visual Layout
```
                    ┌─────────────┐
                    │  FINANCES   │
                    │  $486.09    │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────┴─────┐    ┌──────┴──────┐    ┌──────┴──────┐
  │  HEALTH   │    │   AGENTS    │    │  BUSINESS   │
  │  HRT ✅   │    │  3 profiles │    │  Pipeline   │
  │  231.5 lb │    │  Kanban ✅  │    │  Frozen ❌  │
  └─────┬─────┘    └──────┬──────┘    └──────┬──────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
  ┌─────┴─────┐    ┌──────┴──────┐    ┌──────┴──────┐
  │  LEGAL    │    │  CALENDAR   │    │    HOME     │
  │  $6K suit │    │  25 events  │    │  Kids/Dogs  │
  │  Maxine   │    │  Deadlines  │    │  Chores     │
  └───────────┘    └─────────────┘    └─────────────┘
```

### Node Types
| Node | Data Sources | Refresh Rate |
|------|-------------|--------------|
| 💰 Finances | GDrive sheets, CashApp, Uber, DoorDash | Real-time |
| 🏥 Health | Health Progress sheet, HRT log | Daily |
| 🤖 Agents | Kanban, cron, profiles | Hourly |
| 💼 Business | Lead pipeline, emails, contracts | Daily |
| 📅 Calendar | Google Calendar | Real-time |
| 📧 Comms | Gmail, Discord | Hourly |
| ⚖️ Legal | Court docs, deadlines, case status | As-needed |
| 🏠 Home | Chores, kids, family logistics | Daily |
| 💹 Investments | Robinhood, CashApp stocks | Daily |

### Connections (Data Flow)
- Finances ↔ Business (income from contracts)
- Health ↔ Calendar (appointment reminders)
- Agents ↔ All (automated reporting)
- Legal ↔ Calendar (deadline tracking)
- Home ↔ Calendar (kid schedules, pickups)

### Color Coding
| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 Green | Healthy, on track | HRT on schedule |
| 🟡 Yellow | Attention needed | Bill due in 7 days |
| 🔴 Red | Urgent, action required | Bill overdue, missed dose |
| ⚪ White | Neutral, informational | Calendar event |
| 🔵 Blue | Agent activity | Task completed |

### Interactions
- **Click node** → Drill down into detailed view
- **Hover connection** → See data flow details
- **Drag nodes** → Rearrange layout
- **Filter** → Show only urgent items
- **Timeline** → See historical changes
- **Alerts** → Pop-up for critical items

---

## Technical Architecture

### Tech Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Next.js | UI framework |
| Visualization | D3.js / React Flow | Node graph rendering |
| Styling | Tailwind CSS | Dark cyberpunk theme |
| State | Zustand | Client state management |
| API | Next.js API routes | Backend endpoints |
| Data | Google Sheets API | Live data source |
| Real-time | WebSocket | Live updates |
| Auth | NextAuth.js | Google OAuth |
| Hosting | Vercel or Hostinger | Deployment |

### Data Pipeline
```
Google Sheets → API Routes → WebSocket → Frontend
     ↓
Cron jobs (nyx-finance, nyx-health) → Update sheets
     ↓
Dashboard reflects real-time state
```

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/finances` | GET | Account balances, bills, budget |
| `/api/health` | GET | Weight, HRT, meals, sleep |
| `/api/agents` | GET | Profile status, kanban, cron |
| `/api/calendar` | GET | Events, deadlines |
| `/api/legal` | GET | Case status, deadlines |
| `/api/comms` | GET | Email summary, messages |
| `/api/alerts` | GET | Urgent items across all domains |
| `/api/brain` | GET | Full brain state (all nodes) |

---

## Development Phases

### Phase 1: Static Prototype (This Week)
- [ ] Design mockup in Figma/Excalidraw
- [ ] Build static React component with mock data
- [ ] Dark cyberpunk theme
- [ ] Node layout with basic connections

### Phase 2: Live Data (Next Week)
- [ ] Google Sheets API integration
- [ ] Real-time data fetching
- [ ] Color-coded urgency system
- [ ] Click-to-drill-down

### Phase 3: Real-time Updates (Week 3)
- [ ] WebSocket integration
- [ ] Live agent status
- [ ] Alert system
- [ ] Historical timeline

### Phase 4: Polish & Deploy (Week 4)
- [ ] Mobile responsive
- [ ] Authentication
- [ ] Deploy to Vercel/Hostinger
- [ ] Share with team

### Phase 5: SaaS Potential (Month 2+)
- [ ] Multi-user support
- [ ] Custom node types
- [ ] Integration marketplace
- [ ] Pricing tiers

---

## Monetization Potential

### B2C (Personal Use)
- **Free tier:** 3 nodes, manual data entry
- **Pro ($9/mo):** Unlimited nodes, Google integration, real-time
- **Team ($29/mo):** Multi-user, shared dashboards

### B2B (Business Use)
- **Startup ($49/mo):** 5 users, API access
- **Business ($99/mo):** 25 users, custom integrations
- **Enterprise ($299/mo):** Unlimited, white-label

### Market
- Personal productivity enthusiasts
- Small business owners
- Freelancers and solopreneurs
- Life coaches and consultants
- Anyone managing complex lives

---

## Inspiration

- **Cyber threat maps** (Norse, FireEye) — real-time, interconnected, visual
- **Obsidian graph view** — node connections, knowledge mapping
- **Notion dashboards** — all-in-one life management
- **Apple Health** — clean health visualization
- **Mint/YNAB** — financial dashboards

**What makes ours different:** It's not just data — it's a living brain. The connections matter as much as the nodes. You can SEE how your health affects your finances, how your agents affect your business, how your legal issues affect everything.

---

## Files & Resources

| Resource | Location |
|----------|----------|
| Project doc | This file |
| GDrive folder | TBD (create under SOETech_Apps) |
| Mockup | TBD |
| Repo | TBD (GitHub) |

---

*Concept by Sophia Saitta × Nyx-Prime*
*"See everything. Connect everything. Control everything."*
*So Mote It Be. 🐺*
