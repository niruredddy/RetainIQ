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

export function useMobilityPlan() {
  return useQuery({
    queryKey: ["mobility-plan"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mobility_plan")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as MobilityPlan | null;
    },
    staleTime: 30_000,
  });
}
