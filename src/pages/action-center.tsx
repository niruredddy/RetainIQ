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
  return (
    <>
      <PageHeader
        title="Action Center"
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
    </>
  );
}
