import { useQuery } from "@tanstack/react-query";
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
    },
    staleTime: 30_000,
  });
}
