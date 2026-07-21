export type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'white';

export interface DomainNode {
  id: string;
  title: string;
  icon: string;
  metric: string;
  status: StatusColor;
  description: string;
}

export interface FinanceData {
  accounts: { name: string; balance: number; type: string }[];
  billsDue: { name: string; amount: number; dueDate: string; status: 'paid' | 'upcoming' | 'overdue' }[];
  recentTransactions: { date: string; description: string; amount: number; category: string }[];
}

export interface HealthData {
  currentWeight: number;
  targetWeight: number;
  weightTrend: { date: string; weight: number }[];
  hrtStatus: { active: boolean; medication: string; nextDose: string; startDate: string };
  recentMeals: { date: string; meal: string; calories: number }[];
}

export interface AgentProfile {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error' | 'offline';
  lastRun: string;
  tasksCompleted: number;
}

export interface AgentsData {
  profiles: AgentProfile[];
  totalTasksToday: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'personal' | 'legal' | 'business' | 'health';
  priority: 'high' | 'medium' | 'low';
}

export interface CalendarData {
  events: CalendarEvent[];
  todayCount: number;
  weekCount: number;
}

export interface LegalCase {
  name: string;
  status: 'active' | 'pending' | 'resolved';
  nextDeadline: string;
  amount: number;
  attorney: string;
}

export interface LegalData {
  cases: LegalCase[];
  totalExposure: number;
  nextDeadline: string;
}

export interface BusinessData {
  companyName: string;
  revenue: { month: string; amount: number }[];
  pipeline: { stage: string; count: number; value: number }[];
  projects: { name: string; status: string; progress: number }[];
}

export interface HomeData {
  chores: { task: string; assignee: string; done: boolean; dueDate: string }[];
  familySchedule: { member: string; event: string; time: string }[];
  pets: { name: string; type: string; nextVet: string }[];
}

export interface DetailData {
  finances: FinanceData;
  health: HealthData;
  agents: AgentsData;
  calendar: CalendarData;
  legal: LegalData;
  business: BusinessData;
  home: HomeData;
}
