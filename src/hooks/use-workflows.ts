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

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const { data, error } = await supabase.from("workflows").select("id, status");
      if (error) throw error;
      return (data ?? []) as { id: string; status: string }[];
    },
    staleTime: 15_000,
  });
}

export function activeWorkflowCount(workflows: { status: string }[] | undefined) {
  return workflows?.filter((w) => w.status !== "completed").length ?? 0;
}

export async function startWorkflow(employeeId: string) {
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
