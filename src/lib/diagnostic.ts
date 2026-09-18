import { supabase } from "@/integrations/supabase/client";

export interface DiagnosticResult {
  id: string;
  generatedAt: string;
  employeeId: string;
  payload: unknown;
}

/** Published RetainIQ Qwen reasoning agent (Enter custom agent). */
export const DIAGNOSTIC_AGENT_ID = "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64";

const POLL_INTERVAL_MS = 2500;
const MAX_WAIT_MS = 100_000;
const MAX_START_WAIT_MS = 15_000;

async function invokeErrorDetail(error: unknown): Promise<string> {
  let detail = (error as Error | null)?.message ?? "Diagnostic failed.";
  try {
    const ctx = (error as { context?: Response | string }).context;
    if (ctx instanceof Response) {
      const body = (await ctx.json().catch(() => null)) as {
        message?: string;
      } | null;
      if (body?.message) detail = body.message;
    } else if (typeof ctx === "string" && ctx) {
      const parsed = JSON.parse(ctx) as { message?: string };
      if (parsed?.message) detail = parsed.message;
    }
  } catch {
    /* keep the default message */
  }
  return detail;
}

/**
 * Runs the Qwen reasoning diagnostic for an employee via the Enter Cloud
 * backend function `custom-agent`. The function starts the agent run and
 * returns instantly; this client polls the short status call until the turn
 * completes. `onProgress` receives elapsed seconds while waiting.
 */
export async function runDiagnostic(
  employeeId: string,
  onProgress?: (elapsedSeconds: number) => void
): Promise<DiagnosticResult> {
  const startedAt = Date.now();
  const started = await supabase.functions.invoke("custom-agent", {
    body: { action: "startDiagnose", agentId: DIAGNOSTIC_AGENT_ID, employeeId },
  });
  if (started.error) {
    throw new Error(await invokeErrorDetail(started.error));
  }
  const threadId = (started.data as { threadId?: string } | null)?.threadId;
  if (!threadId) {
    throw new Error("Failed to start the diagnostic.");
  }

  const deadline = Date.now() + MAX_WAIT_MS;
  let turnStarted = false;
  let startWait = 0;

  while (Date.now() < deadline) {
    const res = await supabase.functions.invoke("custom-agent", {
      body: { action: "pollDiagnose", agentId: DIAGNOSTIC_AGENT_ID, threadId },
    });
    if (res.error) {
      throw new Error(await invokeErrorDetail(res.error));
    }
    const data = res.data as {
      status?: string;
      payload?: unknown;
      message?: string;
      turnStarted?: boolean;
    } | null;

    if (data?.status === "done") {
      return {
        id: `DGN-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        employeeId,
        payload: data.payload,
      };
    }
    if (data?.status === "error") {
      throw new Error(data.message ?? "Agent reported an error.");
    }

    if (data?.turnStarted) {
      turnStarted = true;
    } else if (!turnStarted) {
      startWait += POLL_INTERVAL_MS;
      if (startWait >= MAX_START_WAIT_MS) {
        throw new Error(
          "The agent run did not start. Please retry, and check that the agent is published."
        );
      }
    }

    onProgress?.(Math.floor((Date.now() - startedAt) / 1000));
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error("Agent did not respond in time. Please retry.");
}
