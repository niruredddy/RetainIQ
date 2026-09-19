import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  GitBranch,
  Radar,
  ScanSearch,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { RiskBadge } from "@/components/risk-badge";
import { useEmployees } from "@/hooks/use-employees";
import { useAuth } from "@/hooks/use-auth";
import { useWorkflowCount } from "@/hooks/use-workflows";
import { useEmployeeParam } from "@/hooks/use-employee-param";
import { cn } from "@/lib/utils";
const ThreeBackground = lazy(
  () => import("@/components/site/three-background"),
);
const rise = (i: number) => ({ animationDelay: `${0.1 + i * 0.1}s` });
const MODULES = [
  {
    path: "/risk-radar",
    icon: Radar,
    index: "01",
    title: "Risk Radar",
    body: "Prioritize workforce signals and explore the context behind each record.",
  },
  {
    path: "/deep-dive",
    icon: ScanSearch,
    index: "02",
    title: "Deep-Dive",
    body: "Agent-assisted review of recorded signals, with human judgment at the center.",
  },
  {
    path: "/mobility-matcher",
    icon: GitBranch,
    index: "03",
    title: "Mobility Matcher",
    body: "Compare recorded skills with a target role and its saved development plan.",
  },
  {
    path: "/action-center",
    icon: Zap,
    index: "04",
    title: "Action Center",
    body: "Human-led retention cases with recorded actions and supporting evidence.",
  },
];
const STAT_CONFIG = [
  {
    icon: Users,
    label: "Total Monitored",
    iconClass: "border-border bg-muted/50 text-muted-foreground",
  },
  {
    icon: AlertTriangle,
    label: "Critical Attrition Risk",
    iconClass: "border-destructive/25 bg-destructive/10 text-destructive",
    valueClass: "text-destructive drop-shadow-[0_0_12px_hsl(350_89%_60%/0.45)]",
  },
  {
    icon: Workflow,
    label: "My Active Cases",
    iconClass: "border-success/25 bg-success/10 text-success",
    valueClass: "text-success",
  },
];
export default function Dashboard() {
  const { user } = useAuth();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "there";
  const firstName = displayName.split(/\s+/)[0] ?? "there";

  const { data: employees, isLoading, isError, refetch } = useEmployees();
  const {
    data: activeCount,
    isLoading: workflowsLoading,
    isError: workflowError,
  } = useWorkflowCount();
  const { employeePath } = useEmployeeParam();
  const total = employees?.length;
  const critical = employees?.filter((e) => e.risk_score > 70).length;
  const active = activeCount ?? 0;
  const statValues = [
    isLoading ? "…" : isError ? "—" : String(total ?? 0),
    isLoading ? "…" : isError ? "—" : String(critical ?? 0),
    workflowsLoading ? "…" : workflowError ? "—" : String(active),
  ];
  const topSignals = employees?.slice(0, 4) ?? [];
  const heroCopy = isLoading
    ? "Loading live workforce signals…"
    : isError
      ? "Workforce data is unavailable. Retry below to reconnect."
      : `${total ?? 0} employee records. ${critical ?? 0} critical signals. Explore the context, find opportunities, and coordinate your next step.`;
  return (
    <div className="space-y-6">
      {/* ---- 3D Hero ---- */}
      <section className="relative -mx-5 overflow-hidden rounded-b-none px-5 lg:-mx-8 lg:px-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_30%_45%,hsl(var(--background)/0.65),transparent_72%)]"
        />
        <Suspense fallback={null}>
          <ThreeBackground variant="hero" />
        </Suspense>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
        />

        <div className="relative z-10 pb-10 pt-14 lg:pt-20">
          <div
            className="rise inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-muted-foreground"
            style={rise(0)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            WORKFORCE INTELLIGENCE · PEOPLE FIRST
          </div>

          <h1
            className="rise mt-6 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl"
            style={rise(1)}
          >
            Good morning, {firstName}.
            <br />
            <span className="gradient-text">
              {" "}
              Help your people move forward.
            </span>
          </h1>

          <p
            className="rise mt-4 max-w-xl text-base leading-relaxed text-muted-foreground"
            style={rise(2)}
          >
            {heroCopy}
          </p>

          {/* Quick stats */}
          <div
            className="rise mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
            style={rise(3)}
          >
            {STAT_CONFIG.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/70 p-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                    stat.iconClass,
                  )}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "font-mono text-lg font-semibold",
                      stat.valueClass ?? "text-foreground",
                    )}
                  >
                    {statValues[i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Modules ---- */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              MODULES
            </p>
            <h2 className="mt-1.5 font-display text-lg font-semibold text-foreground">
              Jump straight in
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
            ⌘K TO SEARCH
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {MODULES.map((mod, i) => (
            <div className="rise" key={mod.path} style={rise(4 + i)}>
              <Link
                to={employeePath(mod.path)}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-primary"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-shadow duration-200 group-hover:shadow-glow-primary">
                    <mod.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {mod.index}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {mod.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {mod.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  Open module
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Recent signals ---- */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              RECENT SIGNALS
            </p>
            <h2 className="mt-1.5 font-display text-lg font-semibold text-foreground">
              Highest risk right now
            </h2>
          </div>
          <Link
            to="/deep-dive"
            className="hidden items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80 sm:inline-flex"
          >
            Open Deep-Dive
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading &&
            Array.from({
              length: 4,
            }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="shimmer h-9 w-9 shrink-0 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="shimmer h-3 w-24 rounded bg-muted" />
                    <div className="shimmer h-2.5 w-32 rounded bg-muted" />
                  </div>
                </div>
                <div className="shimmer mt-4 h-6 w-14 rounded-full bg-muted" />
                <div className="shimmer mt-4 h-3 w-full rounded bg-muted" />
              </div>
            ))}

          {isError && (
            <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center">
              <p className="font-mono text-xs tracking-widest text-destructive">
                FAILED TO LOAD SIGNALS
              </p>
              <button
                className="mt-3 text-xs text-primary underline"
                onClick={() => void refetch()}
              >
                Retry loading signals
              </button>
            </div>
          )}

          {!isLoading &&
            !isError &&
            topSignals.map((emp, i) => (
              <div className="rise" key={emp.id} style={rise(8 + i)}>
                <Link
                  to={`/deep-dive?employee=${emp.employee_code}`}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-destructive/40 hover:shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
                      {emp.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {emp.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <RiskBadge score={emp.risk_score} />
                    <span
                      className={cn(
                        "font-mono text-[10px]",
                        emp.status === "Escalate"
                          ? "text-destructive"
                          : emp.status === "Intervene"
                            ? "text-warning"
                            : "text-muted-foreground",
                      )}
                    >
                      {emp.status}
                    </span>
                  </div>
                  <p className="mt-3 border-t border-border pt-3 font-mono text-[10px] text-muted-foreground">
                    OVERTIME +{Number(emp.overtime_spike).toFixed(1)}H ·
                    SENTIMENT −{emp.sentiment_drop}
                  </p>
                </Link>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
