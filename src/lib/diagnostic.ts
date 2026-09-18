<<<<<<< HEAD
import { diagnosticPayload } from "@/data/dashboard";

=======
import { HttpAgent } from "@enter-pro/agent-client";
import {
  ThreadClient,
  ThreadManager,
  toThreadTurnsFromAgUiHistory,
  type ThreadTurn,
} from "@enter-pro/thread-client";
import { z } from "zod";
import { jsonrepair as repairJson } from "jsonrepair";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
export const DIAGNOSTIC_AGENT_ID = "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64";
const prefix = `custom-agent/${DIAGNOSTIC_AGENT_ID}`;
const base = `${SUPABASE_URL}/functions/v1/${prefix}`;
export const DiagnosticSchema = z.object({
  employee_id: z.string(),
  summary: z.string().min(1),
  observations: z.array(z.string()),
  hypotheses: z.array(z.string()),
  recommended_actions: z.array(
    z.object({ action: z.string(), owner: z.string() }),
  ),
  limitations: z.array(z.string()),
});
type DiagnosticPayload = z.infer<typeof DiagnosticSchema>;
/** Maps the published agent's native envelope ({id, employeeId, payload:{...}})
 * onto the panel schema, grounded only in fields the agent supplied. */
export function fromNativeDiagnostic(
  raw: unknown,
  fallbackEmployeeId: string,
): DiagnosticPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const source = raw as Record<string, unknown>;
  const body =
    typeof source.payload === "object" && source.payload !== null
      ? (source.payload as Record<string, unknown>)
      : source;
  const employeeMeta =
    typeof body.employee === "object" && body.employee !== null
      ? (body.employee as Record<string, unknown>)
      : undefined;
  const employee_id =
    typeof source.employeeId === "string"
      ? source.employeeId
      : typeof body.employee_id === "string"
        ? body.employee_id
        : typeof employeeMeta?.id === "string"
          ? employeeMeta.id
          : typeof employeeMeta?.employee_code === "string"
            ? employeeMeta.employee_code
            : fallbackEmployeeId;
  const strings = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  const risk =
    typeof body.risk_assessment === "object" && body.risk_assessment !== null
      ? (body.risk_assessment as Record<string, unknown>)
      : undefined;
  const summary =
    typeof body.summary === "string" && body.summary.trim()
      ? body.summary
      : typeof body.overview === "string" && body.overview.trim()
        ? body.overview
        : risk
          ? `Recorded ${String(risk.grade ?? "elevated").toLowerCase()} risk with a score of ${String(risk.score ?? "?")} on the supplied record.`
          : "The agent returned a structured review of the supplied record.";
  const telemetry =
    typeof body.telemetry === "object" && body.telemetry !== null
      ? (body.telemetry as Record<string, unknown>)
      : undefined;
  const observations = strings(body.observations).length
    ? strings(body.observations)
    : telemetry && Object.keys(telemetry).length
      ? Object.entries(telemetry).map(
          ([key, value]) => `${key}: ${JSON.stringify(value)}`,
        )
      : strings(body.root_causes);
  const hypotheses = strings(body.hypotheses).length
    ? strings(body.hypotheses)
    : strings(body.root_causes);
  const actions = Array.isArray(body.recommended_actions)
    ? body.recommended_actions
    : Array.isArray(body.actions)
      ? body.actions
      : [];
  const recommended_actions = actions
    .map((item) => {
      if (typeof item !== "object" || item === null) return null;
      const entry = item as Record<string, unknown>;
      return {
        action: String(entry.action ?? JSON.stringify(entry)),
        owner: String(entry.owner ?? "Human review"),
      };
    })
    .filter(
      (item): item is { action: string; owner: string } =>
        Boolean(item && item.action),
    );
  const limitations = strings(body.limitations).length
    ? strings(body.limitations)
    : ["Review the supplied record and confirm with the employee's manager before acting."];
  return {
    employee_id,
    summary,
    observations,
    hypotheses,
    recommended_actions,
    limitations,
  };
}
>>>>>>> origin/enter-main
export interface DiagnosticResult {
  id: string;
  generatedAt: string;
  employeeId: string;
<<<<<<< HEAD
  payload: unknown;
}

/**
 * Runs the Qwen reasoning diagnostic for an employee.
 *
 * NOTE: Currently returns the demo payload after a simulated latency so the
 * UI skeleton shimmer is exercised. This is the single swap point for the
 * future real AI agent integration (Enter Cloud backend function + AI
 * capability) — the Deep-Dive UI only consumes this promise, so wiring in a
 * real call later touches this file alone.
 */
export async function runDiagnostic(employeeId: string): Promise<DiagnosticResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return {
    id: `DGN-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    employeeId,
    payload: diagnosticPayload,
  };
=======
  payload: z.infer<typeof DiagnosticSchema>;
}
async function detail(error: unknown) {
  const response = (error as { context?: Response } | null)?.context;
  if (response instanceof Response) {
    const data = await response
      .clone()
      .json()
      .catch(() => null);
    if (typeof data?.message === "string") return data.message as string;
  }
  return error instanceof Error
    ? error.message
    : "The agent is unavailable. No diagnostic was generated.";
}
export async function runDiagnostic(
  employeeId: string,
  onTurns: (turns: readonly ThreadTurn[]) => void,
  signal: AbortSignal,
): Promise<DiagnosticResult> {
  const manager = new ThreadManager();
  let client: ThreadClient | undefined;
  let unsubscribe: (() => void) | undefined;
  const deadline = new AbortController();
  let timedOut = false;
  const cancel = () => {
    deadline.abort();
    client?.abort();
  };
  signal.addEventListener("abort", cancel, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    cancel();
  }, 180_000);
  let lastText = "";
  const ensureActive = () => {
    if (deadline.signal.aborted || signal.aborted)
      throw new Error(
        timedOut
          ? "The diagnostic exceeded the time limit. The agent may be busy; please retry. " +
            (lastText ? `Last agent output: ${lastText.slice(0, 160)}` : "")
          : "Diagnostic cancelled.",
      );
  };
  try {
    ensureActive();
    const { data, error } = await supabase.functions.invoke(
      `${prefix}/threads`,
      { body: { employeeId }, signal: deadline.signal },
    );
    if (error) throw new Error(await detail(error));
    ensureActive();
    const threadId = data?.thread_id;
    if (typeof threadId !== "string" || !threadId)
      throw new Error("The agent did not create a valid diagnostic thread.");
    const agent: HttpAgent = new HttpAgent({
      threadId,
      url: () => `${base}/run`,
      token: async () => {
        const { data: auth } = await supabase.auth.getSession();
        ensureActive();
        if (!auth.session) throw new Error("Sign in to run a diagnostic.");
        return auth.session.access_token;
      },
      abortUrl: () =>
        agent.activeTurnId
          ? `${base}/threads/${threadId}/turns/${agent.activeTurnId}/cancel`
          : "",
      resumeUrl: () =>
        `${base}/threads/${threadId}/turns/${agent.activeTurnId}/events`,
    });
    client = new ThreadClient({
      threadId,
      agent,
      historyMessageLoader: {
        load: async (_id, start, end) => {
          const response = await supabase.functions.invoke(
            `${prefix}/threads/${threadId}/turns?start_turn=${start}&end_turn=${end}`,
            { method: "GET", signal: deadline.signal },
          );
          if (response.error) throw new Error(await detail(response.error));
          return toThreadTurnsFromAgUiHistory(response.data);
        },
        loadSince: async () => [],
      },
      historyMessagePagination: { turnSize: 20, endTurn: 0 },
    });
    const activeClient = client;
    unsubscribe = client.subscribe(() => {
      if (!signal.aborted) onTurns([...activeClient.turns]);
      const latest = [...activeClient.turns]
        .flatMap((turn) => turn.messages)
        .filter(
          (message) =>
            message.kind === "message" &&
            message.message.role === "assistant" &&
            typeof message.message.content === "string",
        )
        .map((message) =>
          message.kind === "message" ? message.message.content : "",
        )
        .join("\n");
      if (latest) lastText = latest;
    });
    manager.register(threadId, client);
    await manager.resume(threadId);
    ensureActive();
    await client.sendMessage({
      content: `Review employee ${employeeId} using the current stored record.`,
    });
    ensureActive();
    const messages = client.turns.flatMap((turn) => turn.messages);
    const failed = messages.find(
      (message) =>
        message.kind === "custom" && message.event.name === "agent.turn.error",
    );
    if (failed?.kind === "custom")
      throw new Error(
        (failed.event.value as { message?: string })?.message ||
          "The agent could not complete the diagnostic.",
      );
    const answers = messages.filter(
      (message) =>
        message.kind === "message" && message.message.role === "assistant",
    );
    const text = answers
      .map((message) => {
        if (message.kind !== "message") return "";
        const content = message.message.content;
        if (typeof content === "string") return content;
        if (Array.isArray(content))
          return content
            .filter(
              (part): part is { type: "text"; text: string } =>
                typeof part === "object" &&
                part !== null &&
                (part as { type?: string }).type === "text" &&
                typeof (part as { text?: unknown }).text === "string",
            )
            .map((part) => part.text)
            .join("\n");
        return "";
      })
      .join("\n");
    // Accept the plain reply, fenced JSON, or balanced top-level JSON objects.
    // Balanced extraction prevents inner fragments (e.g. a single action
    // object) from being mistaken for the full reply.
    const candidates = [text.trim()];
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) candidates.push(fenced[1].trim());
    const balanced: string[] = [];
    let start = -1;
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') inString = true;
      else if (ch === "{") {
        if (start === -1) start = i;
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          balanced.push(text.slice(start, i + 1));
          start = -1;
        }
      }
    }
    candidates.push(...balanced);
    let payload: z.infer<typeof DiagnosticSchema> | null = null;
    let parseError = "";
    // Models occasionally rename keys, wrap the object, or omit the summary
    // echo. Normalize aliases, unwrap nested objects, and fill only provable
    // fields: the requested employee id (an input, not invented data) and a
    // summary quoted verbatim from the agent's own first observation.
    const ALIASES: Record<string, string> = {
      employee_code: "employee_id",
      user_id: "employee_id",
      overview: "summary",
      analysis: "summary",
      conclusion: "summary",
      findings: "observations",
      actions: "recommended_actions",
      recommendations: "recommended_actions",
      risks: "hypotheses",
    };
    const normalizeKeys = (value: Record<string, unknown>) => {
      const out: Record<string, unknown> = { ...value };
      for (const [from, to] of Object.entries(ALIASES)) {
        if (from in out) {
          if (!(to in out)) out[to] = out[from];
          delete out[from];
        }
      }
      return out;
    };
    const complete = (value: Record<string, unknown>) => {
      const out = normalizeKeys(value);
      if (typeof out.employee_id !== "string")
        out.employee_id = employeeId;
      if (typeof out.summary !== "string" || !out.summary.trim()) {
        const first = Array.isArray(out.observations)
          ? out.observations.find((item) => typeof item === "string")
          : undefined;
        out.summary =
          typeof first === "string" && first
            ? first
            : "The agent provided its analysis without a summary field.";
      }
      return out;
    };
    const attempt = (value: unknown) => {
      if (typeof value !== "object" || value === null || Array.isArray(value))
        return null;
      const direct = DiagnosticSchema.safeParse(value);
      if (direct.success) return direct.data;
      const completed = DiagnosticSchema.safeParse(
        complete(value as Record<string, unknown>),
      );
      if (completed.success) return completed.data;
      const native = fromNativeDiagnostic(value, employeeId);
      if (native) return native;
      for (const nested of Object.values(value as Record<string, unknown>)) {
        if (
          typeof nested === "object" &&
          nested !== null &&
          !Array.isArray(nested)
        ) {
          const unwrapped = fromNativeDiagnostic(nested, employeeId);
          if (unwrapped) return unwrapped;
          const parsed = DiagnosticSchema.safeParse(
            complete(nested as Record<string, unknown>),
          );
          if (parsed.success) return parsed.data;
        }
      }
      return null;
    };
    const parseJson = (candidate: string): unknown => {
      try {
        return JSON.parse(candidate);
      } catch {
        // Models occasionally emit trailing commas or unescaped quotes;
        // jsonrepair normalizes these small mistakes deterministically.
        return JSON.parse(repairJson(candidate));
      }
    };
    const tryCandidate = (candidate: string) => {
      const parsed = attempt(parseJson(candidate));
      if (parsed) {
        payload = parsed;
        return true;
      }
      try {
        const first = DiagnosticSchema.safeParse(parseJson(candidate));
        if (!first.success)
          parseError = first.error.issues
            .slice(0, 2)
            .map((issue) => issue.path.join(".") || "value")
            .join(", ");
      } catch {
        parseError = "unparsable response";
      }
      return false;
    };
    for (const candidate of candidates) {
      try {
        if (tryCandidate(candidate)) break;
      } catch {
        /* try the next candidate */
      }
    }
    if (!payload) {
      if (!text.trim())
        throw new Error(
          "The agent returned an empty response. No diagnostic was generated; please retry.",
        );
      throw new Error(
        `The agent response did not match the diagnostic format${parseError ? ` (${parseError})` : ""}. No validated result is available; please retry.${text.trim() ? ` Raw reply preview: ${text.trim().slice(0, 800)}` : ""}`,
      );
    }
    if (payload.employee_id !== employeeId)
      throw new Error(
        "The response employee does not match the selected employee. Result rejected.",
      );
    return {
      id: threadId,
      generatedAt: new Date().toISOString(),
      employeeId,
      payload,
    };
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", cancel);
    unsubscribe?.();
    await manager.dispose();
  }
>>>>>>> origin/enter-main
}
