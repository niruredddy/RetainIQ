<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, FileText, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-shell";
import { RiskBadge } from "@/components/risk-badge";
import { focusEmployee, workflowNodes } from "@/data/dashboard";
import { cn } from "@/lib/utils";

export default function ActionCenter() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const execute = () => {
    if (running) return;
    setRunning(true);
    setCompleted([]);
    workflowNodes.forEach((_, i) => {
      timeouts.current.push(
        setTimeout(() => setCompleted((c) => [...c, i]), 500 + i * 700)
      );
    });
    timeouts.current.push(
      setTimeout(
        () => setRunning(false),
        500 + workflowNodes.length * 700 + 300
      )
    );
  };

=======
import { useState } from "react";
import { ClipboardCheck, ExternalLink, Loader2, Workflow } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-shell";
import { EmployeeSelect } from "@/components/employee-select";
import { DataState } from "@/components/data-state";
import { RetentionTaskCard } from "@/components/retention-task";
import { useSelectedEmployee } from "@/hooks/use-employee-param";
import {
  startWorkflow,
  useInvalidateWorkflows,
  useRetentionTasks,
  useWorkflows,
} from "@/hooks/use-workflows";

function EmployeeCase({
  employeeId,
  name,
  role,
}: {
  employeeId: string;
  name: string;
  role: string;
}) {
  const {
    data: workflows,
    isLoading,
    isError,
    refetch,
  } = useWorkflows(employeeId);
  const active = workflows?.find(
    (workflow) => workflow.tracking_mode === "manual",
  );
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useRetentionTasks(active?.id);
  const invalidate = useInvalidateWorkflows();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const start = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await startWorkflow(employeeId);
      await invalidate();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Case could not be created. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  };
  if (isLoading || isError)
    return (
      <DataState
        loading={isLoading}
        error={isError}
        onRetry={() => void refetch()}
      />
    );
  const completed =
    tasks?.filter((task) => task.status === "completed").length ?? 0;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-5 p-6">
          <div>
            <p className="section-kicker">HUMAN-LED RETENTION</p>
            <h2 className="mt-2 font-display text-xl font-semibold">{name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{role}</p>
          </div>
          {active ? (
            <span className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              {completed} / {tasks?.length ?? "—"} tasks recorded
            </span>
          ) : (
            <Button onClick={() => void start()} disabled={busy}>
              {busy ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Workflow size={16} />
              )}
              Create retention case
            </Button>
          )}
        </CardContent>
      </Card>
      <div className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong className="text-foreground">
            External services are not connected.
          </strong>{" "}
          This workspace records your team's actions and supporting notes.
          Manager messages, training enrollment and HR-system updates must be
          performed outside RetainIQ and confirmed here.
        </p>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <ClipboardCheck size={18} className="text-primary" />
            Action checklist
          </h2>
          {active && (
            <span className="font-mono text-[10px] text-muted-foreground">
              CASE {active.id.slice(0, 8).toUpperCase()}
            </span>
          )}
        </div>
        <CardContent className="px-5 py-1">
          {!active ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium">
                A clear plan. An accountable next step.
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                Create a case to track manager review, development and
                follow-up. Tasks stay pending until you record what actually
                happened.
              </p>
            </div>
          ) : tasksLoading || tasksError ? (
            <DataState
              loading={tasksLoading}
              error={tasksError}
              onRetry={() => void refetchTasks()}
            />
          ) : tasks?.length ? (
            tasks.map((task) => <RetentionTaskCard key={task.id} task={task} />)
          ) : (
            <p className="py-10 text-sm text-muted-foreground">
              No tasks are configured for this case.
            </p>
          )}
        </CardContent>
      </Card>
      {!!workflows?.filter((w) => w.tracking_mode === "legacy").length && (
        <details className="rounded-xl border border-border bg-card p-5">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
            Previous execution records · unverified
          </summary>
          <p className="my-3 text-xs leading-relaxed text-muted-foreground">
            These historical records predate evidence-based tracking. A stored
            “completed” status is not proof of an operational action.
          </p>
          {workflows
            .filter((w) => w.tracking_mode === "legacy")
            .map((w) => (
              <div
                key={w.id}
                className="flex justify-between gap-3 border-t border-border py-3 font-mono text-[10px] text-muted-foreground"
              >
                <span>
                  {w.id.slice(0, 8)} · {w.status}
                </span>
                <span>{new Date(w.created_at).toLocaleDateString()}</span>
              </div>
            ))}
        </details>
      )}
    </div>
  );
}
export default function ActionCenter() {
  const { employee, setEmployee, isLoading, isError, refetch } =
    useSelectedEmployee();
>>>>>>> origin/enter-main
  return (
    <>
      <PageHeader
        title="Action Center"
<<<<<<< HEAD
        description="One-click orchestration of retention workflows across the organization."
      />

      <div className="mx-auto w-full max-w-2xl">
        {/* Summary */}
        <Card className="border-border">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              Retention Execution Summary
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Case #R-0241
            </span>
          </div>
          <CardContent className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
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
                  <RiskBadge score={focusEmployee.riskScore} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {focusEmployee.role}
                </p>
              </div>
            </div>
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
            onClick={execute}
            disabled={running}
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
          </CardContent>
        </Card>
      </div>
=======
        description="Turn insight into action—with people, ownership and evidence."
        right={
          employee ? (
            <EmployeeSelect
              value={employee.employee_code}
              onChange={setEmployee}
            />
          ) : undefined
        }
      />
      {employee ? (
        <EmployeeCase
          key={employee.id}
          employeeId={employee.id}
          name={employee.name}
          role={employee.role}
        />
      ) : (
        <DataState
          loading={isLoading}
          error={isError}
          onRetry={() => (isError ? void refetch() : setEmployee(null))}
        />
      )}
>>>>>>> origin/enter-main
    </>
  );
}
