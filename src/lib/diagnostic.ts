import { supabase } from "@/integrations/supabase/client";

export interface DiagnosticResult {
  id: string;
  generatedAt: string;
  employeeId: string;
  payload: unknown;
}

/** Published RetainIQ Qwen reasoning agent (Enter custom agent). */
export const DIAGNOSTIC_AGENT_ID = "ff08b4ab-1410-4d0d-9a88-ff4103ea0e64";

/**
 * Runs the Qwen reasoning diagnostic for an employee.
 *
 * Calls the Enter Cloud backend function `custom-agent`, which authenticates
 * the caller, creates a serving thread, runs the published custom agent, and
 * returns the structured diagnostic payload. The Enter API key stays
 * server-side — it never reaches the browser.
 */
export async function runDiagnostic(employeeId: string): Promise<DiagnosticResult> {
  const { data, error } = await supabase.functions.invoke("custom-agent", {
    body: {
      action: "diagnose",
      agentId: DIAGNOSTIC_AGENT_ID,
      employeeId,
    },
  });

  if (error) {
    // Surface the backend function's real error code/message when available.
    let detail = error.message ?? "Diagnostic failed.";
    try {
      const ctx = (error as { context?: Response | string }).context;
      if (ctx instanceof Response) {
        const body = (await ctx.json().catch(() => null)) as {
          message?: string;
        } | null;
        if (body?.message) detail = body.message;
      } else if (typeof ctx === "string" && ctx) {
        const body = JSON.parse(ctx) as { message?: string };
        if (body?.message) detail = body.message;
      }
    } catch {
      /* keep the default message */
    }
    throw new Error(detail);
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("payload" in data) ||
    !("employeeId" in data)
  ) {
    throw new Error("Unexpected diagnostic response.");
  }

  return data as DiagnosticResult;
}
