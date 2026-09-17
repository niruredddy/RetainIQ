import { LayoutDashboard, Radar, ScanSearch, GitBranch, Zap } from "lucide-react";

export const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/risk-radar", label: "Risk Radar", icon: Radar },
  { path: "/deep-dive", label: "Deep-Dive", icon: ScanSearch },
  { path: "/mobility-matcher", label: "Mobility Matcher", icon: GitBranch },
  { path: "/action-center", label: "Action Center", icon: Zap },
] as const;
