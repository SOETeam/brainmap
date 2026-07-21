import { DomainNode, DetailData, StatusColor } from '@/types';

export const domainNodes: DomainNode[] = [
  {
    id: 'finances',
    title: 'Finances',
    icon: '💰',
    metric: '$486 available',
    status: 'yellow' as StatusColor,
    description: 'Checking, savings, bills & transactions',
  },
  {
    id: 'health',
    title: 'Health',
    icon: '💊',
    metric: '231.5 lbs · HRT ✅',
    status: 'green' as StatusColor,
    description: 'Weight, HRT, nutrition & vitals',
  },
  {
    id: 'agents',
    title: 'Agents',
    icon: '🤖',
    metric: '6 profiles active',
    status: 'blue' as StatusColor,
    description: 'AI agent orchestration & monitoring',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: '📅',
    metric: '25 events this week',
    status: 'green' as StatusColor,
    description: 'Meetings, deadlines & personal events',
  },
  {
    id: 'legal',
    title: 'Legal',
    icon: '⚖️',
    metric: '$6K active lawsuit',
    status: 'red' as StatusColor,
    description: 'Active cases, deadlines & exposure',
  },
  {
    id: 'business',
    title: 'Business',
    icon: '🏢',
    metric: 'SOETech',
    status: 'green' as StatusColor,
    description: 'Revenue, pipeline & active projects',
  },
  {
    id: 'home',
    title: 'Home',
    icon: '🏠',
    metric: 'Kids · Dogs · Chores',
    status: 'yellow' as StatusColor,
    description: 'Family, pets & household tasks',
  },
];

export const edges = [
  { id: 'fin-business', source: 'finances', target: 'business', label: 'revenue' },
  { id: 'business-agents', source: 'business', target: 'agents', label: 'automation' },
  { id: 'agents-calendar', source: 'agents', target: 'calendar', label: 'scheduling' },
  { id: 'calendar-legal', source: 'calendar', target: 'legal', label: 'deadlines' },
  { id: 'legal-fin', source: 'legal', target: 'finances', label: 'payments' },
  { id: 'health-home', source: 'health', target: 'home', label: 'wellness' },
  { id: 'home-calendar', source: 'home', target: 'calendar', label: 'family' },
  { id: 'agents-health', source: 'agents', target: 'health', label: 'tracking' },
  { id: 'business-calendar', source: 'business', target: 'calendar', label: 'meetings' },
  { id: 'fin-health', source: 'finances', target: 'health', label: 'medical costs' },
];

export const detailData: DetailData = {
  finances: {
    accounts: [
      { name: 'Chase Checking', balance: 486.23, type: 'checking' },
      { name: 'Chase Savings', balance: 1200.0, type: 'savings' },
      { name: 'Venmo', balance: 42.5, type: 'digital' },
    ],
    billsDue: [
      { name: 'Rent', amount: 1450, dueDate: '2026-08-01', status: 'upcoming' },
      { name: 'Electric', amount: 125, dueDate: '2026-07-25', status: 'upcoming' },
      { name: 'Internet', amount: 79.99, dueDate: '2026-07-28', status: 'upcoming' },
      { name: 'Car Insurance', amount: 186, dueDate: '2026-07-15', status: 'overdue' },
    ],
    recentTransactions: [
      { date: '2026-07-20', description: 'Walmart', amount: -87.42, category: 'groceries' },
      { date: '2026-07-19', description: 'Amazon', amount: -34.99, category: 'shopping' },
      { date: '2026-07-18', description: 'Uber Eats', amount: -22.50, category: 'food' },
      { date: '2026-07-17', description: 'Gas Station', amount: -45.00, category: 'transport' },
      { date: '2026-07-15', description: 'Paycheck', amount: 2400.00, category: 'income' },
    ],
  },
  health: {
    currentWeight: 231.5,
    targetWeight: 200,
    weightTrend: [
      { date: '2026-06-21', weight: 235.2 },
      { date: '2026-06-28', weight: 234.0 },
      { date: '2026-07-05', weight: 233.1 },
      { date: '2026-07-12', weight: 232.0 },
      { date: '2026-07-19', weight: 231.5 },
    ],
    hrtStatus: {
      active: true,
      medication: 'Estradiol 2mg + Spiro 100mg',
      nextDose: '2026-07-22 09:00',
      startDate: '2025-03-15',
    },
    recentMeals: [
      { date: '2026-07-21', meal: 'Oatmeal + berries', calories: 320 },
      { date: '2026-07-20', meal: 'Grilled chicken salad', calories: 450 },
      { date: '2026-07-20', meal: 'Protein shake', calories: 280 },
    ],
  },
  agents: {
    profiles: [
      { name: 'Hermes-LNM', role: 'Lead Orchestrator', status: 'active', lastRun: '2 min ago', tasksCompleted: 47 },
      { name: 'Alice', role: 'SOP Executor', status: 'active', lastRun: '15 min ago', tasksCompleted: 23 },
      { name: 'Athena', role: 'SOP Executor', status: 'idle', lastRun: '1 hr ago', tasksCompleted: 18 },
      { name: 'Nyx', role: 'Self-Evolution', status: 'active', lastRun: '5 min ago', tasksCompleted: 31 },
      { name: 'CarnalBot', role: 'Discord Moderation', status: 'active', lastRun: '30 sec ago', tasksCompleted: 156 },
      { name: 'Sophia-Core', role: 'Dashboard & Oversight', status: 'active', lastRun: 'just now', tasksCompleted: 12 },
    ],
    totalTasksToday: 287,
  },
  calendar: {
    events: [
      { id: '1', title: 'Legal Consultation - Smith Case', date: '2026-07-22', time: '10:00 AM', type: 'legal', priority: 'high' },
      { id: '2', title: 'SOETech Client Demo', date: '2026-07-22', time: '2:00 PM', type: 'business', priority: 'high' },
      { id: '3', title: 'HRT Check-in', date: '2026-07-23', time: '9:00 AM', type: 'health', priority: 'medium' },
      { id: '4', title: 'Kids Soccer Practice', date: '2026-07-23', time: '4:00 PM', type: 'personal', priority: 'low' },
      { id: '5', title: 'Agent System Review', date: '2026-07-24', time: '11:00 AM', type: 'business', priority: 'medium' },
      { id: '6', title: 'Grocery Shopping', date: '2026-07-24', time: '6:00 PM', type: 'personal', priority: 'low' },
      { id: '7', title: 'Dentist Appointment', date: '2026-07-25', time: '3:00 PM', type: 'health', priority: 'medium' },
    ],
    todayCount: 2,
    weekCount: 25,
  },
  legal: {
    cases: [
      { name: 'Smith v. Saitta', status: 'active', nextDeadline: '2026-08-05', amount: 6000, attorney: 'J. Martinez, Esq.' },
    ],
    totalExposure: 6000,
    nextDeadline: '2026-08-05 — Response filing due',
  },
  business: {
    companyName: 'SOETech',
    revenue: [
      { month: 'Jan', amount: 4200 },
      { month: 'Feb', amount: 5100 },
      { month: 'Mar', amount: 4800 },
      { month: 'Apr', amount: 6200 },
      { month: 'May', amount: 7500 },
      { month: 'Jun', amount: 8100 },
      { month: 'Jul', amount: 6800 },
    ],
    pipeline: [
      { stage: 'Leads', count: 12, value: 24000 },
      { stage: 'Proposal', count: 5, value: 15000 },
      { stage: 'Negotiation', count: 3, value: 9000 },
      { stage: 'Closed Won', count: 2, value: 6000 },
    ],
    projects: [
      { name: 'BrainMap Dashboard', status: 'In Progress', progress: 35 },
      { name: 'Client Portal v2', status: 'Planning', progress: 10 },
      { name: 'Agent Automation Suite', status: 'In Progress', progress: 60 },
    ],
  },
  home: {
    chores: [
      { task: 'Dishes', assignee: 'Sophia', done: false, dueDate: '2026-07-21' },
      { task: 'Laundry', assignee: 'Shared', done: true, dueDate: '2026-07-20' },
      { task: 'Dog Walk', assignee: 'Sophia', done: false, dueDate: '2026-07-21' },
      { task: 'Vacuum Living Room', assignee: 'Kids', done: false, dueDate: '2026-07-22' },
      { task: 'Take Out Trash', assignee: 'Sophia', done: true, dueDate: '2026-07-20' },
    ],
    familySchedule: [
      { member: 'Sophia', event: 'Work from home', time: 'All day' },
      { member: 'Kid 1', event: 'Soccer practice', time: '4:00 PM' },
      { member: 'Kid 2', event: 'Piano lesson', time: '5:30 PM' },
    ],
    pets: [
      { name: 'Dog 1', type: 'Dog', nextVet: '2026-08-15' },
      { name: 'Dog 2', type: 'Dog', nextVet: '2026-09-01' },
    ],
  },
};
