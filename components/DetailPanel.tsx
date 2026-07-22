'use client';

import { DomainNode, StatusColor } from '@/types';
import type {
  FinanceData,
  HealthData,
  AgentsData,
  CalendarData,
  LegalData,
  BusinessData,
  HomeData,
} from '@/types';

interface DetailPanelProps {
  nodeId: string;
  node: DomainNode;
  data: unknown;
  onClose: () => void;
}

const statusColor: Record<StatusColor, string> = {
  green: 'text-cyber-green',
  yellow: 'text-cyber-yellow',
  red: 'text-cyber-red',
  blue: 'text-cyber-blue',
  white: 'text-gray-400',
};

const statusBorder: Record<StatusColor, string> = {
  green: 'border-cyber-green',
  yellow: 'border-cyber-yellow',
  red: 'border-cyber-red',
  blue: 'border-cyber-blue',
  white: 'border-gray-500',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-mono">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FinanceDetail({ data }: { data: FinanceData }) {
  return (
    <>
      <Section title="Accounts">
        {data.accounts.map((a, i) => (
          <div key={i} className="flex justify-between py-1 border-b border-cyber-border/30 text-sm">
            <span className="text-gray-300">{a.name}</span>
            <span className="font-mono text-cyber-green">${a.balance.toFixed(2)}</span>
          </div>
        ))}
      </Section>
      <Section title="Bills Due">
        {data.billsDue.map((b, i) => (
          <div key={i} className="flex justify-between py-1 border-b border-cyber-border/30 text-sm">
            <div>
              <span className="text-gray-300">{b.name}</span>
              <span className="text-[10px] text-gray-500 ml-2">due {b.dueDate}</span>
            </div>
            <span
              className={`font-mono ${
                b.status === 'overdue' ? 'text-cyber-red' : 'text-cyber-yellow'
              }`}
            >
              ${b.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </Section>
      <Section title="Recent Transactions">
        {data.recentTransactions.map((t, i) => (
          <div key={i} className="flex justify-between py-1 border-b border-cyber-border/30 text-sm">
            <div>
              <span className="text-gray-300">{t.description}</span>
              <span className="text-[10px] text-gray-500 ml-2">{t.date}</span>
            </div>
            <span className={`font-mono ${t.amount > 0 ? 'text-cyber-green' : 'text-gray-400'}`}>
              {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </Section>
    </>
  );
}

function HealthDetail({ data }: { data: HealthData }) {
  return (
    <>
      <Section title="Weight Progress">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Current: <span className="text-white font-bold">{data.currentWeight} lbs</span></span>
          <span className="text-gray-500">Target: {data.targetWeight} lbs</span>
        </div>
        <div className="w-full h-2 bg-cyber-border rounded-full overflow-hidden">
          <div
            className="h-full bg-cyber-green rounded-full transition-all"
            style={{
              width: `${((250 - data.currentWeight) / (250 - data.targetWeight)) * 100}%`,
            }}
          />
        </div>
        <div className="mt-2 space-y-1">
          {data.weightTrend.slice(-3).map((w, i) => (
            <div key={i} className="flex justify-between text-xs text-gray-400">
              <span>{w.date}</span>
              <span className="font-mono">{w.weight} lbs</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="HRT Status">
        <div className="bg-cyber-bg rounded-lg p-3 border border-cyber-green/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyber-green" />
            <span className="text-sm text-cyber-green font-medium">Active</span>
          </div>
          <p className="text-xs text-gray-400">{data.hrtStatus.medication}</p>
          <p className="text-xs text-gray-500 mt-1">
            Next dose: {data.hrtStatus.nextDose}
          </p>
          <p className="text-xs text-gray-500">
            Since: {data.hrtStatus.startDate}
          </p>
        </div>
      </Section>
      <Section title="Recent Meals">
        {data.recentMeals.map((m, i) => (
          <div key={i} className="flex justify-between py-1 border-b border-cyber-border/30 text-sm">
            <div>
              <span className="text-gray-300">{m.meal}</span>
              <span className="text-[10px] text-gray-500 ml-2">{m.date}</span>
            </div>
            <span className="font-mono text-gray-400">{m.calories} cal</span>
          </div>
        ))}
      </Section>
    </>
  );
}

function AgentsDetail({ data }: { data: AgentsData }) {
  const statusDot: Record<string, string> = {
    active: 'bg-cyber-green',
    idle: 'bg-cyber-yellow',
    error: 'bg-cyber-red',
    offline: 'bg-gray-500',
  };

  return (
    <>
      <Section title="Active Agents">
        <div className="text-sm text-gray-400 mb-2">
          {data.totalTasksToday} tasks completed today
        </div>
        {data.profiles.map((a, i) => (
          <div
            key={i}
            className="bg-cyber-bg rounded-lg p-3 mb-2 border border-cyber-border/30"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusDot[a.status]}`} />
                <span className="text-sm text-white font-medium">{a.name}</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                {a.lastRun}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">{a.role}</span>
              <span className="text-xs text-cyber-blue font-mono">
                {a.tasksCompleted} tasks
              </span>
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}

function CalendarDetail({ data }: { data: CalendarData }) {
  const typeColors: Record<string, string> = {
    meeting: 'border-l-cyber-blue',
    personal: 'border-l-cyber-green',
    legal: 'border-l-cyber-red',
    business: 'border-l-cyber-purple',
    health: 'border-l-cyber-cyan',
  };

  return (
    <>
      <Section title="This Week">
        <div className="flex gap-4 text-sm mb-3">
          <span className="text-gray-400">
            Today: <span className="text-white font-bold">{data.todayCount}</span>
          </span>
          <span className="text-gray-400">
            This week: <span className="text-white font-bold">{data.weekCount}</span>
          </span>
        </div>
        {data.events.map((e) => (
          <div
            key={e.id}
            className={`bg-cyber-bg rounded-lg p-3 mb-2 border-l-2 ${typeColors[e.type] || 'border-l-gray-500'}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-sm text-white">{e.title}</span>
              {e.priority === 'high' && (
                <span className="text-[10px] bg-cyber-red/20 text-cyber-red px-1.5 py-0.5 rounded">
                  HIGH
                </span>
              )}
            </div>
            <div className="flex gap-3 mt-1">
              <span className="text-xs text-gray-500">{e.date}</span>
              <span className="text-xs text-gray-500">{e.time}</span>
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}

function LegalDetail({ data }: { data: LegalData }) {
  return (
    <>
      <Section title="Active Cases">
        {data.cases.map((c, i) => (
          <div
            key={i}
            className="bg-cyber-bg rounded-lg p-3 mb-2 border border-cyber-red/30"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm text-white font-medium">{c.name}</span>
              <span className="text-[10px] bg-cyber-red/20 text-cyber-red px-1.5 py-0.5 rounded uppercase">
                {c.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">Attorney: {c.attorney}</p>
            <p className="text-xs text-gray-400">
              Amount: <span className="text-cyber-red font-mono">${c.amount.toLocaleString()}</span>
            </p>
            <p className="text-xs text-gray-400">
              Next deadline: <span className="text-cyber-yellow font-mono">{c.nextDeadline}</span>
            </p>
          </div>
        ))}
      </Section>
      <Section title="Summary">
        <div className="bg-cyber-bg rounded-lg p-3 border border-cyber-border/30">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Exposure</span>
            <span className="text-cyber-red font-mono font-bold">
              ${data.totalExposure.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Next Deadline</span>
            <span className="text-cyber-yellow font-mono text-xs">{data.nextDeadline}</span>
          </div>
        </div>
      </Section>
    </>
  );
}

function BusinessDetail({ data }: { data: BusinessData }) {
  return (
    <>
      <Section title="Revenue (YTD)">
        <div className="flex gap-1 items-end h-24 mb-2">
          {data.revenue.map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-cyber-green/30 rounded-t"
                style={{ height: `${(r.amount / 10000) * 100}%` }}
              />
              <span className="text-[9px] text-gray-500">{r.month}</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-400">
          Last month:{' '}
          <span className="text-cyber-green font-mono">
            ${data.revenue[data.revenue.length - 1]?.amount.toLocaleString()}
          </span>
        </div>
      </Section>
      <Section title="Pipeline">
        {data.pipeline.map((p, i) => (
          <div
            key={i}
            className="flex justify-between py-1 border-b border-cyber-border/30 text-sm"
          >
            <span className="text-gray-300">{p.stage}</span>
            <span className="font-mono text-gray-400">
              {p.count} · ${p.value.toLocaleString()}
            </span>
          </div>
        ))}
      </Section>
      <Section title="Active Projects">
        {data.projects.map((p, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">{p.name}</span>
              <span className="text-xs text-gray-500">{p.status}</span>
            </div>
            <div className="w-full h-1.5 bg-cyber-border rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-cyan rounded-full"
                style={{ width: `${p.progress}%` }}
              />
            </div>
          </div>
        ))}
      </Section>
    </>
  );
}

function HomeDetail({ data }: { data: HomeData }) {
  return (
    <>
      <Section title="Chores">
        {data.chores.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1 border-b border-cyber-border/30 text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded border ${
                  c.done
                    ? 'bg-cyber-green border-cyber-green'
                    : 'border-gray-500 bg-transparent'
                }`}
              />
              <span className={c.done ? 'text-gray-500 line-through' : 'text-gray-300'}>
                {c.task}
              </span>
            </div>
            <span className="text-xs text-gray-500">{c.assignee}</span>
          </div>
        ))}
      </Section>
      <Section title="Family Schedule">
        {data.familySchedule.map((f, i) => (
          <div
            key={i}
            className="flex justify-between py-1 border-b border-cyber-border/30 text-sm"
          >
            <div>
              <span className="text-gray-300">{f.member}</span>
              <span className="text-xs text-gray-500 ml-2">{f.event}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">{f.time}</span>
          </div>
        ))}
      </Section>
      <Section title="Pets">
        {data.pets.map((p, i) => (
          <div
            key={i}
            className="flex justify-between py-1 border-b border-cyber-border/30 text-sm"
          >
            <span className="text-gray-300">
              🐕 {p.name}
            </span>
            <span className="text-xs text-gray-500">Next vet: {p.nextVet}</span>
          </div>
        ))}
      </Section>
    </>
  );
}

export default function DetailPanel({ nodeId, node, data, onClose }: DetailPanelProps) {
  const renderContent = () => {
    switch (nodeId) {
      case 'finances':
        return <FinanceDetail data={data as FinanceData} />;
      case 'health':
        return <HealthDetail data={data as HealthData} />;
      case 'agents':
        return <AgentsDetail data={data as AgentsData} />;
      case 'calendar':
        return <CalendarDetail data={data as CalendarData} />;
      case 'legal':
        return <LegalDetail data={data as LegalData} />;
      case 'business':
        return <BusinessDetail data={data as BusinessData} />;
      case 'home':
        return <HomeDetail data={data as HomeData} />;
      default:
        return <p className="text-gray-500">No data available</p>;
    }
  };

  return (
    <div
      className={`w-[380px] h-full bg-[#12121a]/95 backdrop-blur-md border-l ${statusBorder[node.status]} overflow-y-auto detail-panel-enter`}
    >
      <div className="sticky top-0 bg-cyber-surface z-10 p-4 border-b border-cyber-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{node.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-white">{node.title}</h2>
              <p className={`text-xs font-mono ${statusColor[node.status]}`}>
                {node.metric}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-4">{renderContent()}</div>
    </div>
  );
}
