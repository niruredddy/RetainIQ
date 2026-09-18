import { HttpAgent } from "@enter-pro/agent-client";
import {
  ThreadClient,
  ThreadManager,
  toThreadTurnsFromAgUiHistory,
  type ThreadTurn,
} from "@enter-pro/thread-client";
import { z } from "zod";
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
export interface DiagnosticResult {
  id: string;
  generatedAt: string;
  employeeId: string;
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
  }, 90_000);
  const ensureActive = () => {
    if (deadline.signal.aborted || signal.aborted)
      throw new Error(
        timedOut
          ? "The diagnostic exceeded 90 seconds. Please retry."
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
    const last = answers[answers.length - 1];
    const text =
      last?.kind === "message" && typeof last.message.content === "string"
        ? last.message.content
        : "";
    const candidate = text
      .replace(/^\s*```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "");
    let payload: z.infer<typeof DiagnosticSchema>;
    try {
      payload = DiagnosticSchema.parse(JSON.parse(candidate));
    } catch {
      throw new Error(
        "The agent response did not match the diagnostic format. No validated result is available; please retry.",
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
}
