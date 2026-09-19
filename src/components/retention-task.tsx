import { useState } from "react";
import { CalendarDays, Check, History, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  recordTask,
  useInvalidateWorkflows,
  useTaskEvents,
  type RetentionTask,
} from "@/hooks/use-workflows";

function TaskHistory({ taskId }: { taskId: string }) {
  const { data, isLoading, isError } = useTaskEvents(taskId);
  return (
    <div className="mt-3 space-y-3 rounded-lg border border-border bg-muted/30 p-3">
      {isLoading
        ? "Loading history…"
        : isError
          ? "History unavailable."
          : !data?.length
            ? "No recorded updates."
            : data.map((event) => (
                <div key={event.id} className="text-xs">
                  <p className="font-medium">
                    {event.status === "completed"
                      ? "Manually recorded complete"
                      : "Reopened"}{" "}
                    · {new Date(event.created_at).toLocaleString()}
                  </p>
                  <p className="mt-1 text-muted-foreground">{event.evidence}</p>
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                    Actor {event.recorded_by.slice(0, 8)}
                  </p>
                </div>
              ))}
    </div>
  );
}
export function RetentionTaskCard({ task }: { task: RetentionTask }) {
  const [editing, setEditing] = useState(false);
  const [history, setHistory] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const invalidate = useInvalidateWorkflows();
  const done = task.status === "completed";
  const due = task.due_at ? new Date(task.due_at) : null;
  const overdue = Boolean(due && !done && due.getTime() < Date.now());
  const save = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await recordTask(task.id, !done, note.trim());
      await invalidate();
      setEditing(false);
      setNote("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the task update.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex gap-4 border-b border-border py-5 last:border-0">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${done ? "border-success/30 bg-success/10 text-success" : "border-border bg-muted/40 text-muted-foreground"}`}
      >
        {done ? (
          <Check size={17} />
        ) : (
          <span className="font-mono text-xs">{task.position + 1}</span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{task.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Suggested owner: {task.owner_label}
            </p>
          </div>
          <span className="rounded-full border border-border px-2 py-1 text-[10px]">
            {done ? "Human-recorded completion" : "Awaiting human action"}
          </span>
        </div>
        {due && (
          <p
            className={`mt-2 flex items-center gap-1.5 font-mono text-[10px] ${overdue ? "text-destructive" : "text-muted-foreground"}`}
          >
            <CalendarDays size={11} />
            {overdue ? "Overdue since " : "Scheduled for "}
            {due.toLocaleDateString()} · {due.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {task.evidence && (
          <p className="mt-3 rounded-lg bg-muted/50 p-3 text-xs leading-relaxed">
            {task.evidence}
          </p>
        )}
        {task.recorded_at && (
          <p className="mt-2 text-[10px] text-muted-foreground">
            Recorded {new Date(task.recorded_at).toLocaleString()} · actor{" "}
            {task.recorded_by?.slice(0, 8)}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing((v) => !v)}
          >
            {done ? "Reopen task" : "Record completion"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistory((v) => !v)}
          >
            <History size={14} />
            History
          </Button>
        </div>
        {editing && (
          <div className="mt-4 space-y-3">
            <label
              htmlFor={`note-${task.id}`}
              className="block text-xs font-medium"
            >
              {done
                ? "Why is this task being reopened?"
                : "What was completed? Add supporting evidence."}
            </label>
            <Textarea
              id={`note-${task.id}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              minLength={10}
              maxLength={2000}
              placeholder="Describe the action, date, and confirmation you received…"
            />
            <p className="text-[10px] text-muted-foreground">
              This records your confirmation; it does not send messages or
              enroll anyone.
            </p>
            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}
            <Button
              size="sm"
              disabled={busy || note.trim().length < 10}
              onClick={() => void save()}
            >
              {busy && <Loader2 className="animate-spin" size={14} />}Save
              recorded update
            </Button>
          </div>
        )}
        {history && <TaskHistory taskId={task.id} />}
      </div>
    </div>
  );
}
