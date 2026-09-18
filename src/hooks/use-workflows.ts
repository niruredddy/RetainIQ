import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export interface WorkflowNode {
  id: string;
  position: number;
  title: string;
  owner: string;
}
export interface WorkflowRow {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  employee_id: string;
  tracking_mode: string;
  employees: { employee_code: string; name: string } | null;
}
export interface RetentionTask {
  id: string;
  workflow_id: string;
  position: number;
  title: string;
  owner_label: string;
  status: string;
  evidence: string | null;
  recorded_by: string | null;
  recorded_at: string | null;
}
export function useWorkflowNodes() {
  return useQuery({
    queryKey: ["workflow-nodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workflow_nodes")
        .select("*")
        .order("position");
      if (error) throw error;
      return data as WorkflowNode[];
    },
    staleTime: 60_000,
  });
}
export function useWorkflows(employeeId?: string, page = 0) {
  return useQuery({
    queryKey: ["workflows", employeeId, page],
    queryFn: async () => {
      let query = supabase
        .from("workflows")
        .select(
          "id,status,created_at,updated_at,employee_id,tracking_mode,employees(employee_code,name)",
        )
        .order("updated_at", { ascending: false });
      if (employeeId) query = query.eq("employee_id", employeeId);
      const { data, error } = await query.range(page * 20, page * 20 + 19);
      if (error) throw error;
      return data as WorkflowRow[];
    },
    staleTime: 15_000,
  });
}
export function useWorkflowCount() {
  return useQuery({
    queryKey: ["workflow-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("workflows")
        .select("id", { count: "exact", head: true })
        .eq("tracking_mode", "manual")
        .eq("status", "in_progress");
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 15_000,
  });
}
export function useRetentionTasks(workflowId?: string) {
  return useQuery({
    queryKey: ["retention-tasks", workflowId],
    enabled: Boolean(workflowId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retention_tasks")
        .select("*")
        .eq("workflow_id", workflowId!)
        .order("position");
      if (error) throw error;
      return data as RetentionTask[];
    },
  });
}
export function useTaskEvents(taskId: string) {
  return useQuery({
    queryKey: ["retention-events", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retention_task_events")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
export async function startWorkflow(employeeId: string) {
  const { data, error } = await supabase.rpc("start_retention_case", {
    p_employee_id: employeeId,
  });
  if (error) throw error;
  return data as string;
}
export async function recordTask(
  taskId: string,
  completed: boolean,
  evidence: string,
) {
  const { error } = await supabase.rpc("record_retention_task", {
    p_task_id: taskId,
    p_completed: completed,
    p_evidence: evidence,
  });
  if (error) throw error;
}
export function useInvalidateWorkflows() {
  const cache = useQueryClient();
  return async () => {
    await Promise.all(
      [
        "workflows",
        "workflow-count",
        "retention-tasks",
        "retention-events",
      ].map((key) => cache.invalidateQueries({ queryKey: [key] })),
    );
  };
}
