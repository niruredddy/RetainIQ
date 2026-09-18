import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, FileText, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-shell";
import { RiskBadge } from "@/components/risk-badge";
import { EmployeeSelect } from "@/components/employee-select";
import { useEmployees } from "@/hooks/use-employees";
import { useEmployeeParam } from "@/hooks/use-employee-param";
import {
  completeWorkflow,
  startWorkflow,
  useInvalidateWorkflows,
  useWorkflowNodes,
  useWorkflows,
} from "@/hooks/use-workflows";
import { cn } from "@/lib/utils";

export default function ActionCenter() {
  const { data: employees } = useEmployees();
  const { employeeCode, setEmployee } = useEmployeeParam();
  const { data: nodes } = useWorkflowNodes();
  const { data: workflows } = useWorkflows();
  const invalidateWorkflows = useInvalidateWorkflows();
  const focusEmployee =
    employees?.find((e) => e.employee_code === employeeCode) ?? employees?.[0] ?? null;
  const workflowNodes = nodes ?? [];

  const [completed, setCompleted] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const execute = async () => {
    if (running || !focusEmployee) return;
    setRunning(true);
    setCompleted([]);

    let wfId: string | null = null;
    try {
      const wf = await startWorkflow(focusEmployee.id);
      wfId = wf.id;
    } catch {
      /* still animate locally even if persistence fails */
    }

    workflowNodes.forEach((_, i) => {
      timeouts.current.push(
        setTimeout(() => setCompleted((c) => [...c, i]), 500 + i * 700)
      );
    });
    timeouts.current.push(
      setTimeout(() => {
        setRunning(false);
        if (wfId) {
          completeWorkflow(wfId).catch(() => undefined);
        }
        invalidateWorkflows();
      }, 500 + workflowNodes.length * 700 + 300)
    );
  };

  return (
    <>
      <PageHeader
        title="Action Center"
        description="One-click orchestration of retention workflows across the organization."
      />

      <div className="mx-auto w-full max-w-2xl">
        {/* Summary */}
        <Card className="border-border">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Retention Execution Summary
            </h2>
            <div className="flex items-center gap-3">
              {focusEmployee && (
                <EmployeeSelect value={focusEmployee.employee_code} onChange={setEmployee} />
              )}
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Case #{(focusEmployee?.employee_code ?? "0000").replace("EMP-", "R-")}
              </span>
            </div>
          </div>
          <CardContent className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            {focusEmployee ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-1 ring-border">
                  <AvatarFallback
                    className={cn(
                      "bg-gradient-to-br text-sm font-semibold text-white",
                      focusEmployee.gradient
                    )}
                  >
                    {focusEmployee.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {focusEmployee.name}
                    </p>
                    <RiskBadge score={focusEmployee.risk_score} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {focusEmployee.role}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="shimmer h-11 w-11 shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-3.5 w-36 rounded bg-muted" />
                  <div className="shimmer h-3 w-52 rounded bg-muted" />
                </div>
              </div>
            )}
            <div className="rounded-lg border border-border bg-muted/30 p-3.5">
              <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3 w-3" /> Recommended Action
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                Immediate manager dispatch, then enroll in a{" "}
                <span className="font-medium text-primary">14-day upskilling sprint</span>{" "}
                with a staff mentor check-in.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Execute */}
        <div className="py-7">
          <Button
            onClick={() => void execute()}
            disabled={running || !focusEmployee}
            className="mx-auto flex h-14 w-full max-w-[400px] items-center justify-center gap-2.5 bg-gradient-primary bg-[length:200%_auto] font-display text-base font-semibold text-primary-foreground shadow-glow-primary-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-glow-primary disabled:opacity-70 disabled:hover:scale-100"
          >
            <Zap
              className={cn("h-5 w-5", running && "animate-pulse")}
              fill="currentColor"
            />
            {running ? "Executing workflow…" : "Execute EnterPro Workflow"}
          </Button>
          <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
            {running
              ? "ORCH-2026-0917 · DISPATCHING NODES…"
              : completed.length === workflowNodes.length && completed.length > 0
                ? "ORCH-2026-0917-A7 · WORKFLOW COMPLETED"
                : "AWAITING EXECUTION"}
          </p>
        </div>

        {/* Timeline */}
        <Card className="border-border">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Workflow Orchestration
            </h2>
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 font-mono text-[10px]",
                completed.length === workflowNodes.length && completed.length > 0
                  ? "border-success/25 bg-success/10 text-success"
                  : "border-border bg-muted/40 text-muted-foreground"
              )}
            >
              {completed.length}/{workflowNodes.length} NODES
            </span>
          </div>

          <CardContent className="p-5 lg:p-6">
            {workflowNodes.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-mono text-xs tracking-widest text-muted-foreground">
                  NO WORKFLOW NODES CONFIGURED
                </p>
              </div>
            ) : (
            <div className="relative">
              {workflowNodes.map((node, i) => {
                const done = completed.includes(i);
                const isLast = i === workflowNodes.length - 1;
                return (
                  <motion.div
                    key={node.title}
                    className="relative flex gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center self-stretch">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                          done
                            ? "border-success bg-success text-white shadow-glow-emerald"
                            : "border-border bg-muted/40 text-muted-foreground"
                        )}
                      >
                        {done ? (
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </motion.span>
                        ) : (
                          <span className="font-mono text-xs">{i + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={cn(
                            "mt-1 w-0.5 flex-1 rounded-full transition-colors duration-500",
                            done ? "bg-success" : "bg-border"
                          )}
                          style={{ minHeight: 28 }}
                        />
                      )}
                    </div>

                    <div className={cn("min-w-0 pb-6", isLast && "pb-0")}>
                      <p
                        className={cn(
                          "text-sm font-medium transition-colors duration-300",
                          done ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {node.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {node.owner}
                      </p>
                      <span
                        className={cn(
                          "mt-2 inline-block rounded-full border px-2 py-0.5 font-mono text-[10px]",
                          done
                            ? "border-success/25 bg-success/10 text-success"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        {done ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            )}
          </CardContent>
        </Card>

        {/* Recent executions — the provable output of every click */}
        <Card className="mt-4 border-border">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Recent Executions
              </h2>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                LIVE FROM DATABASE · {workflows?.length ?? 0} RECORDS
              </p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-success">
              ● REALTIME
            </span>
          </div>

          {!workflows || workflows.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="font-mono text-xs tracking-widest text-muted-foreground">
                NO EXECUTIONS YET — RUN A WORKFLOW ABOVE
              </p>
            </CardContent>
          ) : (
            <div className="divide-y divide-border">
              {workflows.slice(0, 6).map((wf) => (
                <div
                  key={wf.id}
                  className="grid grid-cols-[minmax(0,1.6fr)_0.8fr_1fr] items-center gap-3 px-5 py-3 transition-colors duration-200 hover:bg-accent/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {wf.employees?.name ?? "Unknown employee"}
                    </p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground">
                      CASE #{(wf.employees?.employee_code ?? "0000").replace("EMP-", "R-")}
                    </p>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px]",
                        wf.status === "completed"
                          ? "border-success/25 bg-success/10 text-success"
                          : wf.status === "in_progress"
                            ? "border-warning/25 bg-warning/10 text-warning animate-pulse"
                            : "border-border text-muted-foreground"
                      )}
                    >
                      {wf.status === "completed" ? "✓ Completed" : wf.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {new Date(wf.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/70">
                      WF-{wf.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
