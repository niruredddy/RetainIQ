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
  }, 150_000);
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
    // Accept the plain reply, fenced JSON, or the first/last JSON object block.
    const candidates = [text];
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) candidates.push(fenced[1]);
    const blocks = [...text.matchAll(/\{[\s\S]*?\}/g)].map((m) => m[0]);
    if (blocks.length) {
      candidates.push(blocks[0], blocks[blocks.length - 1]);
    }
    let payload: z.infer<typeof DiagnosticSchema> | null = null;
    let parseError = "";
    for (const candidate of candidates) {
      try {
        const parsed = DiagnosticSchema.safeParse(JSON.parse(candidate));
        if (parsed.success) {
          payload = parsed.data;
          break;
        }
        parseError = parsed.error.issues
          .slice(0, 2)
          .map((issue) => issue.path.join(".") || "value")
          .join(", ");
      } catch {
        /* try the next candidate */
      }
    }
    if (!payload)
      throw new Error(
        `The agent response did not match the diagnostic format${parseError ? ` (${parseError})` : ""}. No validated result is available; please retry.`,
      );
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
