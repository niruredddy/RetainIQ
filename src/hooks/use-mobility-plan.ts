import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
const RoadmapSchema = z.object({
  week: z.string(),
  phase: z.string(),
  days: z.string(),
  topics: z.array(z.string()),
  progress: z.number().min(0).max(100),
});
const PlanSchema = z.object({
  id: z.string(),
  employee_code: z.string(),
  current_competencies: z.array(z.string()),
  required_skills: z.array(z.string()),
  target_role: z.object({
    title: z.string(),
    department: z.string(),
    openings: z.number().min(0),
  }),
  match_score: z.number(),
  skill_delta: z.array(z.string()),
  roadmap_phases: z.array(RoadmapSchema),
});
export type MobilityPlan = z.infer<typeof PlanSchema>;
export type RoadmapPhase = z.infer<typeof RoadmapSchema>;
export function useMobilityPlan(employeeCode?: string | null) {
  return useQuery({
    queryKey: ["mobility-plan", employeeCode],
    enabled: Boolean(employeeCode),
    queryFn: async ({ signal }) => {
      if (!employeeCode) return null;
      const { data, error } = await supabase
        .from("mobility_plan")
        .select("*")
        .eq("employee_code", employeeCode)
        .abortSignal(signal)
        .maybeSingle();
      if (error) throw error;
      return data ? PlanSchema.parse(data) : null;
    },
    staleTime: 30_000,
  });
}
