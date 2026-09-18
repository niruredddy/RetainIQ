import { supabase } from "@/integrations/supabase/client";
import { diagnosticPayload } from "@/data/dashboard";

export interface DiagnosticResult {
  id: string;
  generatedAt: string;
  employeeId: string;
  payload: unknown;
}

/** Published RetainIQ Qwen reasoning agent (Enter custom agent). */
export const DIAGNOSTIC_AGENT_ID = "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64";

const POLL_INTERVAL_MS = 2500;
const REAL_ATTEMPT_BUDGET_MS = 10_000;

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
 * Attempts the real agent run: start the serving thread, then poll the short
 * status call until the turn completes.
 */
async function runRealAgent(
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

  const deadline = Date.now() + REAL_ATTEMPT_BUDGET_MS;
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
    onProgress?.(Math.floor((Date.now() - startedAt) / 1000));
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error("Agent did not respond in time.");
}

/**
 * Runs the Qwen reasoning diagnostic for an employee.
 *
 * Tries the real agent first via the Enter Cloud backend function. The agent's
 * API host bot-protection can block server-side calls in some environments; if
 * the real attempt fails within a short budget, we fall back to a clearly
 * labeled cached analysis so the flow always completes. Check `payload.source`
 * for `"cached_analysis"` to distinguish it.
 */
export async function runDiagnostic(
  employeeId: string,
  onProgress?: (elapsedSeconds: number) => void
): Promise<DiagnosticResult> {
  try {
    return await runRealAgent(employeeId, onProgress);
  } catch {
    // Agent unreachable from this environment — labeled cached fallback.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      id: `DGN-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      employeeId,
      payload: {
        ...diagnosticPayload,
        diagnostic_id: `DGN-${Date.now()}`,
        source: "cached_analysis",
      },
    };
  }
}
