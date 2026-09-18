import { useEffect, useRef, useState } from "react";
import type { ThreadTurn } from "@enter-pro/thread-client";
import {
  Clipboard,
  Loader2,
  ScanSearch,
  Square,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { runDiagnostic, type DiagnosticResult } from "@/lib/diagnostic";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function AgentActivity({ turns }: { turns: readonly ThreadTurn[] }) {
  const messages = turns.flatMap((turn) => turn.messages);
  const customs = messages.filter((m) => m.kind === "custom");
  const startup = customs.some(
    (m) =>
      m.kind === "custom" &&
      ["agent.loaded", "agent.environment.ready"].includes(m.event.name),
  );
  const reasoning = messages.filter(
    (m) => m.kind === "message" && String(m.message.role) === "reasoning",
  );
  const tools = messages.flatMap((m) =>
    m.kind === "message" && m.message.role === "assistant"
      ? (m.message.toolCalls ?? [])
      : [],
  );
  return (
    <div className="space-y-3 text-xs text-muted-foreground">
      <p role="status">
        {startup
          ? "Agent ready · reviewing the supplied record"
          : "Connecting to the published agent…"}
      </p>
      {reasoning.map((m) =>
        m.kind === "message" && typeof m.message.content === "string" ? (
          <details key={m.id}>
            <summary className="cursor-pointer">Agent reasoning</summary>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">
              {m.message.content}
            </p>
          </details>
        ) : null,
      )}
      {tools.length > 0 && (
        <details>
          <summary className="cursor-pointer">
            Agent tool activity ({tools.length})
          </summary>
          {tools.map((tool) => (
            <p key={tool.id} className="mt-2">
              {tool.function.name} ·{" "}
              {messages.some(
                (m) =>
                  m.kind === "message" &&
                  m.message.role === "tool" &&
                  m.message.toolCallId === tool.id,
              )
                ? "Result received"
                : "Requested"}
            </p>
          ))}
        </details>
      )}
    </div>
  );
}
export function DiagnosticPanel({ employeeCode }: { employeeCode: string }) {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [turns, setTurns] = useState<readonly ThreadTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!busy) return;
    const started = Date.now();
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, [busy]);
  const run = async () => {
    if (busy) return;
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setError(null);
    setResult(null);
    setTurns([]);
    setElapsed(0);
    setCopied(false);
    try {
      const response = await runDiagnostic(
        employeeCode,
        setTurns,
        request.signal,
      );
      if (!request.signal.aborted) setResult(response);
    } catch (err) {
      if (!request.signal.aborted)
        setError(err instanceof Error ? err.message : "Diagnostic failed.");
    } finally {
      if (!request.signal.aborted) setBusy(false);
    }
  };
  const cancel = () => {
    controller.current?.abort();
    setBusy(false);
    setError("Diagnostic cancelled. No result was generated.");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(result?.payload, null, 2),
      );
      setCopied(true);
    } catch {
      setError(
        "Clipboard unavailable. You can select the JSON below to copy it.",
      );
    }
  };
  return (
    <Card className="flex min-h-96 flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <p className="section-kicker">PUBLISHED QWEN AGENT</p>
          <h2 className="mt-2 font-display text-lg font-semibold">
            A clearer picture.
          </h2>
        </div>
        <ScanSearch className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1 space-y-5 p-5">
        {!busy && !result && !error && (
          <div className="py-12 text-center">
            <ScanSearch className="mx-auto h-9 w-9 text-muted-foreground/60" />
            <p className="mt-4 text-sm font-medium">
              Context before conclusions.
            </p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Review the selected employee's recorded signals with the published
              agent. Suggestions support human judgment, not automated
              employment decisions.
            </p>
          </div>
        )}
        {busy && (
          <div className="space-y-5 rounded-xl border border-primary/20 bg-primary/5 p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Reviewing signals · {elapsed}s
            </p>
            <AgentActivity turns={turns} />
            <p className="text-[10px] text-muted-foreground">
              No result is shown until a valid response is received. Maximum
              wait: 150 seconds.
            </p>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 p-4"
          >
            <h3 className="text-sm font-medium">Diagnostic not available</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {error}
            </p>
          </div>
        )}
        {result && (
          <>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm leading-relaxed">
                {result.payload.summary}
              </p>
              <p className="mt-3 font-mono text-[9px] text-muted-foreground">
                {result.employeeId} ·{" "}
                {new Date(result.generatedAt).toLocaleString()}
              </p>
            </div>
            {(
              [
                ["Recorded observations", result.payload.observations],
                ["Hypotheses to review", result.payload.hypotheses],
                ["Limitations", result.payload.limitations],
              ] as const
            ).map(([title, items]) => (
              <section key={title}>
                <h3 className="text-xs font-semibold">{title}</h3>
                <ul className="mt-2 list-disc space-y-2 pl-4 text-xs leading-relaxed text-muted-foreground">
                  {items.length ? (
                    items.map((item, i) => <li key={i}>{item}</li>)
                  ) : (
                    <li>None provided by the agent.</li>
                  )}
                </ul>
              </section>
            ))}
            <section>
              <h3 className="text-xs font-semibold">Suggested human actions</h3>
              {result.payload.recommended_actions.map((action, i) => (
                <p
                  key={i}
                  className="mt-2 text-xs leading-relaxed text-muted-foreground"
                >
                  {action.action}
                  <span className="block font-medium">
                    Suggested owner: {action.owner}
                  </span>
                </p>
              ))}
            </section>
            <details className="rounded-xl border border-border p-3">
              <summary className="cursor-pointer text-xs">
                Agent activity and structured response
              </summary>
              <div className="my-3">
                <AgentActivity turns={turns} />
              </div>
              <Button variant="outline" size="sm" onClick={() => void copy()}>
                <Clipboard size={13} />
                {copied ? "Copied" : "Copy JSON"}
              </Button>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-[10px] text-muted-foreground">
                {JSON.stringify(result.payload, null, 2)}
              </pre>
            </details>
            <Button asChild variant="outline" className="w-full">
              <Link
                to={`/action-center?employee=${encodeURIComponent(employeeCode)}`}
              >
                Review retention actions
                <ArrowRight size={14} />
              </Link>
            </Button>
          </>
        )}
      </div>
      <div className="border-t border-border p-5">
        {busy ? (
          <Button variant="outline" className="w-full" onClick={cancel}>
            <Square size={14} />
            Cancel diagnostic
          </Button>
        ) : (
          <Button className="w-full" onClick={() => void run()}>
            <ScanSearch size={16} />
            {result
              ? "Run a fresh diagnostic"
              : error
                ? "Retry diagnostic"
                : "Run Qwen diagnostic"}
          </Button>
        )}
      </div>
    </Card>
  );
}
