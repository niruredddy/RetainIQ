import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface RoadmapPhase {
  week: string;
  phase: string;
  days: string;
  topics: string[];
  progress: number;
}

export interface MobilityPlan {
  id: string;
  employee_code: string;
  current_competencies: string[];
  required_skills: string[];
  target_role: { title: string; department: string; openings: number };
  match_score: number;
  skill_delta: string[];
  roadmap_phases: RoadmapPhase[];
}

/** Fetches the mobility plan for a specific employee (their target role +
 * required skills). Falls back to any plan when no employee is selected. */
export function useMobilityPlan(employeeCode?: string | null) {
  return useQuery({
    queryKey: ["mobility-plan", employeeCode ?? "default"],
    queryFn: async () => {
      let query = supabase.from("mobility_plan").select("*");
      if (employeeCode) {
        query = query.eq("employee_code", employeeCode);
      }
      const { data, error } = await query
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as MobilityPlan | null;
    },
    staleTime: 30_000,
  });
}
