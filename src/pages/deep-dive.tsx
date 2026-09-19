import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-shell";
import { RiskBadge } from "@/components/risk-badge";
import { EmployeeSelect } from "@/components/employee-select";
import { DataState } from "@/components/data-state";
import { DiagnosticPanel } from "@/components/diagnostic-panel";
import { useSelectedEmployee } from "@/hooks/use-employee-param";

export default function DeepDive() {
  const { employee, setEmployee, isLoading, isError, refetch } =
    useSelectedEmployee();
  const attendance = employee?.attendance_pattern ?? [];
  const average = attendance.length
    ? attendance.reduce((sum, point) => sum + point.hours, 0) /
      attendance.length
    : null;
  const sentiment = employee?.peer_sentiment;
  return (
    <>
      <PageHeader
        title="Deep-Dive"
        description="Look beyond the signal. Understand the person."
        right={
          employee ? (
            <EmployeeSelect
              value={employee.employee_code}
              onChange={setEmployee}
            />
          ) : undefined
        }
      />
      {!employee ? (
        <DataState
          loading={isLoading}
          error={isError}
          onRetry={() => (isError ? void refetch() : setEmployee(null))}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-5">
            <Card>
              <CardContent className="flex flex-wrap items-center gap-4 p-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 font-display text-sm font-semibold text-primary">
                  {employee.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-lg font-semibold">
                      {employee.name}
                    </h2>
                    <RiskBadge score={employee.risk_score} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {employee.role}
                  </p>
                  <p className="mt-2 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <Clock size={12} />
                    {employee.tenure} · {employee.employee_code}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="section-kicker">WORK PATTERNS</p>
                    <h2 className="mt-2 font-display text-base font-semibold">
                      Time and workload
                    </h2>
                  </div>
                  <p className="text-right font-mono text-lg font-semibold">
                    {average === null ? "—" : `${average.toFixed(1)}h`}
                    <span className="mt-1 block font-sans text-[10px] font-normal text-muted-foreground">
                      Recorded daily average
                    </span>
                  </p>
                </div>
                <div className="mt-6 h-48 min-w-0">
                  {attendance.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={attendance}
                        margin={{ top: 10, left: -25, right: 10, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="workload-fill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="hsl(var(--primary))"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="hsl(var(--border))"
                          vertical={false}
                          strokeDasharray="4 4"
                        />
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 10,
                            fill: "hsl(var(--muted-foreground))",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 12,
                            fontSize: 12,
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Area
                          dataKey="hours"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          fill="url(#workload-fill)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="pt-16 text-center text-sm text-muted-foreground">
                      No attendance observations recorded.
                    </p>
                  )}
                </div>
                <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                  Recorded overtime increase:{" "}
                  {Number(employee.overtime_spike).toFixed(1)} hours. Work
                  patterns need context, not assumptions.
                </p>
              </CardContent>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <p className="section-kicker">PEER SENTIMENT</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-display text-4xl font-semibold">
                      {sentiment ?? "—"}
                    </span>
                    <span className="pb-1 text-sm text-muted-foreground">
                      / 100
                    </span>
                  </div>
                  <progress
                    value={sentiment ?? 0}
                    max={100}
                    className="mt-4 h-1.5 w-full accent-primary"
                    aria-label="Recorded peer sentiment"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Recorded baseline: {employee.peer_sentiment_baseline}
                  </p>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                    An aggregate signal, not a judgment of the employee.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="section-kicker">CAPABILITIES</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {employee.skill_matrix.length} recorded skills
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {employee.skill_matrix.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-border bg-muted/30 px-2 py-1 text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Button
                    asChild
                    variant="link"
                    className="mt-3 h-auto p-0 text-xs"
                  >
                    <Link
                      to={`/mobility-matcher?employee=${encodeURIComponent(employee.employee_code)}`}
                    >
                      <GitBranch size={13} />
                      Explore career pathways
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <DiagnosticPanel
            key={employee.id}
            employeeCode={employee.employee_code}
            employeeId={employee.id}
          />
        </div>
      )}
    </>
  );
}
