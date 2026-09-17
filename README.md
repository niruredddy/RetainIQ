# 🚀 RetainIQ

<div align="center">
  <img src="public/favicon.ico" alt="RetainIQ Logo" width="120" />
  <p><strong>A Modern, AI-Powered Workforce Intelligence Dashboard</strong></p>
  <p><i>Predict, Analyze, and Prevent Employee Attrition Before It Happens.</i></p>
</div>

---

## 📖 Overview

RetainIQ is an advanced workforce intelligence platform engineered to empower HR professionals, people leaders, and managers. By transforming raw employee telemetry into actionable insights, RetainIQ enables organizations to shift from reactive damage control to proactive talent retention.

Our core philosophy: **Retention decisions must be driven by real-time signals, not just intuition.**

## ✨ Key Features

### 🎯 Risk Radar
- **Real-Time Monitoring:** Track your workforce's attrition risk scores dynamically.
- **Signal Detection:** Instantly identify high-risk indicators across overtime, morale, and historical retention metrics.
- **Urgency Highlighting:** Prioritize the most critical intervention opportunities at a glance.

### 🧠 Deep-Dive Intelligence
- **Comprehensive Diagnostics:** Get a 360-degree view of individual employee profiles.
- **Pattern Recognition:** Analyze attendance trends, sentiment shifts, tenure, and skill evolution.
- **Structured Reasoning:** Generate clear, data-backed rationale suitable for executive reviews and operational follow-ups.

### 🔄 Mobility Matcher
- **Skill-to-Role Mapping:** Seamlessly align employee capabilities with internal open roles.
- **Gap Analysis:** Identify skill deficiencies and receive tailored upskilling recommendations.
- **Mobility Readiness:** Estimate the likelihood of successful internal transitions to foster career growth.

### ⚡ Action Center
- **Guided Interventions:** Execute retention strategies through structured, step-by-step workflows.
- **Task Orchestration:** Track progress and completion across various retention initiatives.
- **One-Click Execution:** Deploy operational action plans for at-risk employees instantly.

## 🛠️ Tech Stack

Built with cutting-edge technologies for maximum performance, scalability, and developer experience:

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui, Framer Motion
- **Data Management:** TanStack Query, Supabase
- **Visualization:** Recharts
- **Internationalization:** i18next

## 📂 Project Structure

```text
retainiq-project/
├── public/                 # Static assets and locale files
├── src/
│   ├── components/         # Reusable UI components
│   ├── data/               # Mock data and constants
│   ├── hooks/              # Custom React hooks
│   ├── i18n/               # Internationalization config
│   ├── integrations/       # Third-party integrations (Supabase)
│   ├── lib/                # Utility functions and helpers
│   ├── pages/              # Application pages/routes
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   ├── router.tsx          # Application routing
│   └── index.css           # Global styles
└── supabase/               # Supabase configuration & migrations
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or later)
- `pnpm` (Package manager)
- A [Supabase](https://supabase.com/) project (optional, for extended data layers)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/niruredddy/RetainIQ.git
   cd RetainIQ
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment:**
   Copy the sample environment file and add your configuration (e.g., Supabase keys).
   ```bash
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   *The application will be available at `http://localhost:5173`.*

### Build for Production

```bash
pnpm build:prod
```

### Code Quality Check

Run linter and type-checking:
```bash
pnpm check
```

## 📈 Application Workflow

1. **Telemetry Ingestion:** The dashboard aggregates employee data and computes baseline workforce risk.
2. **Prioritization:** The **Risk Radar** surfaces individuals requiring immediate attention.
3. **Diagnosis:** The **Deep-Dive** module provides nuanced insights and reasoning for the flagged risk.
4. **Resolution via Mobility:** The **Mobility Matcher** evaluates internal opportunities for the employee.
5. **Action:** The **Action Center** orchestrates the final retention strategy.

## 🤝 Contributing

We welcome contributions! Please adhere to the following workflow to ensure smooth integration:

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m "feat: add amazing feature"`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request.

---
<div align="center">
  <p><i>RetainIQ — Act before attrition becomes expensive.</i></p>
</div>
