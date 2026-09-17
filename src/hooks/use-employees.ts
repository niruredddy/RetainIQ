import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type EmployeeStatus = "Monitor" | "Intervene" | "Escalate";

export interface AttendancePoint {
  day: string;
  hours: number;
}

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
  attendance_pattern: AttendancePoint[];
  peer_sentiment: number;
  peer_sentiment_baseline: number;
  skill_matrix: string[];
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
    },
    staleTime: 30_000,
  });
}
