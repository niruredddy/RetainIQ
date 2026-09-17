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
    throw new Error(error.message ?? "Diagnostic failed.");
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
