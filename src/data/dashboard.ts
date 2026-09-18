export type RiskBand = "Low" | "Elevated" | "Critical";

export interface Employee {
  id: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  tenure: string;
  overtimeSpike: number;
  sentimentDrop: number;
  riskScore: number;
  status: "Monitor" | "Intervene" | "Escalate";
}

export const employees: Employee[] = [
  {
    id: "EMP-0241",
    name: "Maya Chen",
    role: "Staff Engineer, Data Platform",
    initials: "MC",
    gradient: "from-sky-500 to-blue-600",
    tenure: "4.2 yrs",
    overtimeSpike: 18.4,
    sentimentDrop: 32,
    riskScore: 86,
    status: "Escalate",
  },
  {
    id: "EMP-0187",
    name: "David Kim",
    role: "ML Engineer, Recommendations",
    initials: "DK",
    gradient: "from-indigo-500 to-blue-700",
    tenure: "3.1 yrs",
    overtimeSpike: 14.5,
    sentimentDrop: 26,
    riskScore: 79,
    status: "Escalate",
  },
  {
    id: "EMP-0302",
    name: "Jordan Ellis",
    role: "Senior Product Designer",
    initials: "JE",
    gradient: "from-violet-500 to-purple-600",
    tenure: "2.7 yrs",
    overtimeSpike: 12.1,
    sentimentDrop: 28,
    riskScore: 74,
    status: "Intervene",
  },
  {
    id: "EMP-0119",
    name: "Priya Raghavan",
    role: "Backend Engineer, Payments",
    initials: "PR",
    gradient: "from-emerald-500 to-teal-600",
    tenure: "5.4 yrs",
    overtimeSpike: 9.8,
    sentimentDrop: 21,
    riskScore: 63,
    status: "Intervene",
  },
  {
    id: "EMP-0456",
    name: "Liam O'Connor",
    role: "SRE, Infrastructure",
    initials: "LO",
    gradient: "from-amber-500 to-orange-600",
    tenure: "6.0 yrs",
    overtimeSpike: 7.2,
    sentimentDrop: 12,
    riskScore: 48,
    status: "Monitor",
  },
  {
    id: "EMP-0210",
    name: "Sofia Marquez",
    role: "Frontend Engineer, Growth",
    initials: "SM",
    gradient: "from-rose-500 to-pink-600",
    tenure: "2.3 yrs",
    overtimeSpike: 5.6,
    sentimentDrop: 9,
    riskScore: 35,
    status: "Monitor",
  },
  {
    id: "EMP-0368",
    name: "Ava Thompson",
    role: "Data Analyst, Finance",
    initials: "AT",
    gradient: "from-cyan-500 to-sky-600",
    tenure: "1.9 yrs",
    overtimeSpike: 6.4,
    sentimentDrop: 8,
    riskScore: 27,
    status: "Monitor",
  },
  {
    id: "EMP-0145",
    name: "Noah Williams",
    role: "Security Engineer, Infra",
    initials: "NW",
    gradient: "from-fuchsia-500 to-purple-700",
    tenure: "3.8 yrs",
    overtimeSpike: 4.9,
    sentimentDrop: 6,
    riskScore: 22,
    status: "Monitor",
  },
];

export const focusEmployee = employees[0];

export const attendancePattern = [
  { day: "Mon", hours: 8.2 },
  { day: "Tue", hours: 9.6 },
  { day: "Wed", hours: 10.8 },
  { day: "Thu", hours: 12.4 },
  { day: "Fri", hours: 11.9 },
  { day: "Sat", hours: 6.8 },
  { day: "Sun", hours: 4.2 },
];

export const peerSentiment = 68;

export const skillMatrix = [
  "Python",
  "PostgreSQL",
  "Airflow",
  "Apache Spark",
  "Kafka",
  "Docker",
  "GraphQL",
  "AWS",
  "CI/CD",
  "TypeScript",
];

export const diagnosticPayload = {
  diagnostic_id: "DGN-2026-0917-018",
  model: "qwen-max-reasoning",
  hallucination_guard: "enabled",
  confidence: 0.93,
  employee: {
    id: "EMP-0241",
    name: "Maya Chen",
    role: "Staff Engineer, Data Platform",
  },
  telemetry: {
    overtime_spike: { hours: 18.4, baseline: 6.2, trend: "rising" },
    sentiment_drop: { score: 32, baseline: 81, anomaly: true },
    peer_review_gap: { delta: -0.6, anomaly: true },
  },
  risk_assessment: {
    score: 86,
    grade: "CRITICAL",
    confidence_interval: [82, 90],
  },
  root_causes: [
    "unmanaged_oncall_load",
    "compensation_lag",
    "growth_stagnation",
  ],
  recommended_actions: [
    {
      action: "rebalance_oncall_rotation",
      owner: "Engineering Manager",
      due: "2026-09-21",
      priority: "P0",
    },
    {
      action: "enroll_upskilling_sprint",
      owner: "People Ops",
      due: "2026-09-24",
      priority: "P1",
    },
    {
      action: "schedule_mentor_checkin",
      owner: "Staff Mentor Pool",
      due: "2026-09-28",
      priority: "P1",
    },
  ],
};

export const currentCompetencies = [
  "Python",
  "TypeScript",
  "React",
  "PostgreSQL",
  "Docker",
  "Kafka",
  "GraphQL",
  "Airflow",
  "AWS",
  "CI/CD",
];

export const targetRole = {
  title: "Senior Cloud Architect",
  department: "Platform Engineering",
  openings: 2,
};

export const skillDelta = ["Kubernetes", "Terraform", "Istio", "Helm", "ArgoCD", "Vault"];

export const matchScore = 78;

export const roadmapPhases = [
  {
    week: "Week 1",
    phase: "Fundamentals",
    days: "Days 1–4",
    topics: ["Kubernetes Core", "Terraform IaC"],
    progress: 100,
  },
  {
    week: "Week 2",
    phase: "Advanced",
    days: "Days 5–9",
    topics: ["Service Mesh · Istio", "GitOps · Helm"],
    progress: 45,
  },
  {
    week: "Week 3",
    phase: "Capstone",
    days: "Days 10–13",
    topics: ["Prod Migration Lab", "Architecture Review"],
    progress: 0,
  },
];

export const workflowNodes = [
  { title: "Dispatch Manager Approval", owner: "Engineering Manager" },
  { title: "Enroll in 14-Day Upskilling Sprint", owner: "People Ops" },
  { title: "Schedule Mentor Check-in", owner: "Staff Mentor Pool" },
  { title: "30-Day Review Scheduled", owner: "HRIS Sync" },
];
