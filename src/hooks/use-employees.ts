import { useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { supabase } from "@/integrations/supabase/client";

export type EmployeeStatus = "Monitor" | "Intervene" | "Escalate";

export interface EmployeeRecord {
  id: string;
  employee_code: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  tenure: string;
  overtime_spike: number;
  sentiment_drop: number;
  risk_score: number;
  status: EmployeeStatus;
}

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("risk_score", { ascending: false });
      if (error) throw error;
      return (data ?? []) as EmployeeRecord[];
=======
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const EmployeeSchema = z.object({
  id: z.string(),
  employee_code: z.string(),
  name: z.string(),
  role: z.string(),
  initials: z.string(),
  gradient: z.string(),
  tenure: z.string(),
  overtime_spike: z.number(),
  sentiment_drop: z.number(),
  risk_score: z.number().min(0).max(100),
  status: z.enum(["Monitor", "Intervene", "Escalate"]),
  attendance_pattern: z.array(
    z.object({ day: z.string(), hours: z.number().min(0) }),
  ),
  peer_sentiment: z.number().min(0).max(100),
  peer_sentiment_baseline: z.number().min(0).max(100),
  skill_matrix: z.array(z.string()),
  updated_at: z.string(),
});
export type EmployeeRecord = z.infer<typeof EmployeeSchema>;
export type EmployeeStatus = EmployeeRecord["status"];
export type AttendancePoint = EmployeeRecord["attendance_pattern"][number];
export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("risk_score", { ascending: false })
        .abortSignal(signal);
      if (error) throw error;
      return z.array(EmployeeSchema).parse(data ?? []);
>>>>>>> origin/enter-main
    },
    staleTime: 30_000,
  });
}
