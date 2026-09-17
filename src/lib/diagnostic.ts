import { diagnosticPayload } from "@/data/dashboard";

export interface DiagnosticResult {
  id: string;
  generatedAt: string;
  employeeId: string;
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
}
