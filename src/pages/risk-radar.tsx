<<<<<<< HEAD
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Users, Workflow } from "lucide-react";
=======
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWorkflowCount } from "@/hooks/use-workflows";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Users, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
>>>>>>> origin/enter-main
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-shell";
import { RiskBadge } from "@/components/risk-badge";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";

function MetricCard({
  label,
  value,
  icon: Icon,
  iconClass,
  valueClass,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass: string;
  valueClass?: string;
}) {
  return (
    <Card className="border-border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border",
<<<<<<< HEAD
            iconClass
=======
            iconClass,
>>>>>>> origin/enter-main
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-0.5 font-mono text-2xl font-semibold tracking-tight",
<<<<<<< HEAD
              valueClass ?? "text-foreground"
=======
              valueClass ?? "text-foreground",
>>>>>>> origin/enter-main
            )}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Escalate: "text-destructive",
  Intervene: "text-warning",
  Monitor: "text-muted-foreground",
};

function StatusCell({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-2">
<<<<<<< HEAD
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_STYLES[status])} />
=======
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          STATUS_STYLES[status],
        )}
      />
>>>>>>> origin/enter-main
      <span className={cn("text-sm", STATUS_STYLES[status])}>{status}</span>
    </div>
  );
}

export default function RiskRadar() {
  const { data: employees, isLoading, isError, refetch } = useEmployees();
<<<<<<< HEAD
=======
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("all");
  const {
    data: workflowCount,
    isLoading: countLoading,
    isError: countError,
  } = useWorkflowCount();
  const filtered = (employees ?? []).filter(
    (employee) =>
      `${employee.name} ${employee.role}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (risk === "all" ||
        (risk === "critical"
          ? employee.risk_score > 70
          : risk === "elevated"
            ? employee.risk_score > 30 && employee.risk_score <= 70
            : employee.risk_score <= 30)),
  );
>>>>>>> origin/enter-main
  const total = employees?.length;
  const critical = employees?.filter((e) => e.risk_score > 70).length;

  return (
    <>
      <PageHeader
        title="Risk Radar"
<<<<<<< HEAD
        description="Cross-vector attrition signals fused from HRIS, telemetry and peer sentiment."
        right={
          <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            LIVE · ENTER CLOUD SYNC
=======
        description="Prioritize recorded signals, then explore the context behind them."
        right={
          <span className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            DATABASE SNAPSHOT
>>>>>>> origin/enter-main
          </span>
        }
      />

      {/* Metrics row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total Monitored"
<<<<<<< HEAD
          value={isLoading ? "…" : String(total ?? 0)}
=======
          value={isLoading ? "…" : isError ? "—" : String(total ?? 0)}
>>>>>>> origin/enter-main
          icon={Users}
          iconClass="border-border bg-muted/50 text-muted-foreground"
        />
        <MetricCard
          label="Critical Attrition Risk"
<<<<<<< HEAD
          value={isLoading ? "…" : String(critical ?? 0)}
=======
          value={isLoading ? "…" : isError ? "—" : String(critical ?? 0)}
>>>>>>> origin/enter-main
          icon={AlertTriangle}
          iconClass="border-destructive/25 bg-destructive/10 text-destructive"
          valueClass="text-destructive drop-shadow-[0_0_12px_hsl(350_89%_60%/0.45)]"
        />
        <MetricCard
<<<<<<< HEAD
          label="Active Retention Workflows"
          value="7"
=======
          label="My Active Retention Cases"
          value={
            countLoading ? "…" : countError ? "—" : String(workflowCount ?? 0)
          }
>>>>>>> origin/enter-main
          icon={Workflow}
          iconClass="border-success/25 bg-success/10 text-success"
          valueClass="text-success"
        />
      </div>

      {/* Data table */}
      <Card className="mt-4 overflow-hidden border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Cross-Vector Attrition Radar
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
<<<<<<< HEAD
              8 HIGH-SIGNAL RECORDS · RANKED BY RISK SCORE
=======
              {filtered.length} OF {employees?.length ?? 0} RECORDS · RANKED BY
              RISK SCORE
>>>>>>> origin/enter-main
            </p>
          </div>
          <div className="hidden items-center gap-4 font-mono text-[10px] text-muted-foreground md:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> 0–30 LOW
            </span>
            <span className="flex items-center gap-1.5">
<<<<<<< HEAD
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> 31–70 ELEVATED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> 71–100 CRITICAL
=======
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> 31–70
              ELEVATED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />{" "}
              71–100 CRITICAL
>>>>>>> origin/enter-main
            </span>
          </div>
        </div>

<<<<<<< HEAD
=======
        <div className="flex flex-wrap gap-3 border-b border-border p-4">
          <Input
            aria-label="Search employees"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or role…"
            className="max-w-sm"
          />
          <select
            aria-label="Filter by risk level"
            value={risk}
            onChange={(event) => setRisk(event.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-xs"
          >
            <option value="all">All risk levels</option>
            <option value="critical">Critical</option>
            <option value="elevated">Elevated</option>
            <option value="low">Low</option>
          </select>
        </div>
        {!isLoading && !isError && filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No employees match these filters.
          </p>
        )}
>>>>>>> origin/enter-main
        {/* Column headers */}
        <div className="grid grid-cols-[minmax(0,2.2fr)_0.7fr_0.8fr_0.8fr_1fr] items-center gap-4 border-b border-border bg-muted/30 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground max-md:grid-cols-[minmax(0,1.5fr)_0.7fr_1fr]">
          <span>Employee</span>
          <span className="hidden md:block">Overtime Spike</span>
          <span className="hidden md:block">Sentiment Drop</span>
          <span>Risk Score</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-border">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-[minmax(0,2.2fr)_0.7fr_0.8fr_0.8fr_1fr] items-center gap-4 px-5 py-3.5 max-md:grid-cols-[minmax(0,1.5fr)_0.7fr_1fr]"
              >
                <div className="flex items-center gap-3">
                  <div className="shimmer h-9 w-9 shrink-0 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="shimmer h-3 w-32 rounded bg-muted" />
                    <div className="shimmer h-2.5 w-44 rounded bg-muted" />
                  </div>
                </div>
                <div className="shimmer hidden h-3 w-10 rounded bg-muted md:block" />
                <div className="shimmer hidden h-3 w-8 rounded bg-muted md:block" />
                <div className="shimmer h-6 w-14 rounded-full bg-muted" />
                <div className="shimmer h-3 w-16 rounded bg-muted" />
              </div>
            ))}

          {isError && (
            <div className="px-5 py-12 text-center">
              <p className="font-mono text-xs tracking-widest text-destructive">
                FAILED TO LOAD EMPLOYEE SIGNALS
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading &&
            !isError &&
<<<<<<< HEAD
            (employees ?? []).map((emp) => (
              <div
=======
            filtered.map((emp) => (
              <Link
                to={`/deep-dive?employee=${emp.employee_code}`}
>>>>>>> origin/enter-main
                key={emp.id}
                className="grid grid-cols-[minmax(0,2.2fr)_0.7fr_0.8fr_0.8fr_1fr] items-center gap-4 rounded-lg border border-transparent px-5 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent/40 hover:shadow-soft max-md:grid-cols-[minmax(0,1.5fr)_0.7fr_1fr]"
              >
                {/* Employee */}
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border">
<<<<<<< HEAD
                    <AvatarFallback
                      className={cn(
                        "bg-gradient-to-br text-xs font-semibold text-white",
                        emp.gradient
                      )}
                    >
=======
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
>>>>>>> origin/enter-main
                      {emp.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {emp.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {emp.role}
                    </p>
                  </div>
                </div>

                {/* Overtime */}
                <div className="hidden md:block">
                  <p className="font-mono text-sm text-foreground">
                    {Number(emp.overtime_spike).toFixed(1)}
                    <span className="text-muted-foreground">h</span>
                  </p>
                </div>

                {/* Sentiment */}
                <div className="hidden md:block">
                  <p
                    className={cn(
                      "font-mono text-sm",
                      emp.sentiment_drop > 25
                        ? "text-destructive"
<<<<<<< HEAD
                        : "text-foreground"
=======
                        : "text-foreground",
>>>>>>> origin/enter-main
                    )}
                  >
                    −{emp.sentiment_drop}
                  </p>
                </div>

                {/* Risk */}
                <div>
                  <RiskBadge score={emp.risk_score} />
                </div>

                {/* Status */}
                <StatusCell status={emp.status} />
<<<<<<< HEAD
              </div>
=======
              </Link>
>>>>>>> origin/enter-main
            ))}
        </div>
      </Card>
    </>
  );
}
