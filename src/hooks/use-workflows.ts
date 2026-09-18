import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WorkflowNode {
  id: string;
  position: number;
  title: string;
  owner: string;
}

export function useWorkflowNodes() {
  return useQuery({
    queryKey: ["workflow-nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_nodes")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as WorkflowNode[];
    },
    staleTime: 60_000,
  });
}

export interface WorkflowRow {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  employee_id: string;
  employees: { employee_code: string; name: string } | null;
}

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflows")
        .select(
          "id, status, created_at, updated_at, employee_id, employees(employee_code, name)"
        )
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as unknown as WorkflowRow[];
    },
    staleTime: 15_000,
  });
}

export function activeWorkflowCount(rows: WorkflowRow[] | undefined) {
  return rows?.filter((w) => w.status !== "completed").length ?? 0;
}

/**
 * Starts a retention workflow for an employee. One case per employee:
 * re-running the same employee re-uses their existing workflow row instead of
 * creating duplicates.
 */
export async function startWorkflow(employeeId: string) {
  const { data: existing } = await supabase
    .from("workflows")
    .select("id")
    .eq("employee_id", employeeId)
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("workflows")
      .update({ status: "in_progress" })
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw error;
    return data as { id: string };
  }

  const { data, error } = await supabase
    .from("workflows")
    .insert({ employee_id: employeeId, status: "in_progress" })
    .select("id")
    .single();
  if (error) throw error;
  return data as { id: string };
}

export async function completeWorkflow(id: string) {
  const { error } = await supabase
    .from("workflows")
    .update({ status: "completed" })
    .eq("id", id);
  if (error) throw error;
}

export function useInvalidateWorkflows() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: ["workflows"] });
  };
}
