<<<<<<< HEAD
import { useEffect, useState } from "react";
import { ArrowRight, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-shell";
import {
  currentCompetencies,
  matchScore,
  roadmapPhases,
  skillDelta,
  targetRole,
} from "@/data/dashboard";
import { cn } from "@/lib/utils";

function useCountUp(target: number, duration = 1200, delay = 250) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);

  return value;
}

function Tag({
  children,
  variant = "neutral",
}: {
  children: string;
  variant?: "neutral" | "gap";
}) {
  return (
    <span
      className={cn(
        "rounded-md border px-2.5 py-1 font-mono text-xs transition-all duration-200",
        variant === "neutral"
          ? "border-primary/15 bg-primary/5 text-primary/90"
          : "border-primary/60 bg-primary/10 text-primary shadow-glow-primary hover:border-primary"
      )}
    >
      {children}
    </span>
  );
}

export default function MobilityMatcher() {
  const alignment = useCountUp(matchScore);

=======
import { ArrowRight, Check, GitBranch, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-shell";
import { useMobilityPlan } from "@/hooks/use-mobility-plan";
import { useSelectedEmployee } from "@/hooks/use-employee-param";
import { EmployeeSelect } from "@/components/employee-select";
import { DataState } from "@/components/data-state";
import { skillAlignment } from "@/lib/workforce";

export default function MobilityMatcher() {
  const {
    employee,
    setEmployee,
    isLoading: employeeLoading,
    isError: employeeError,
    refetch,
  } = useSelectedEmployee();
  const {
    data: plan,
    isLoading,
    isError,
    refetch: refetchPlan,
  } = useMobilityPlan(employee?.employee_code);
  const { current, required, overlap, gaps, match } = skillAlignment(
    employee?.skill_matrix ?? [],
    plan?.required_skills ?? [],
  );
  const phases = plan?.roadmap_phases ?? [];
  const progress = phases.length
    ? Math.round(
        phases.reduce(
          (sum, phase) => sum + Math.max(0, Math.min(100, phase.progress ?? 0)),
          0,
        ) / phases.length,
      )
    : null;
>>>>>>> origin/enter-main
  return (
    <>
      <PageHeader
        title="Mobility Matcher"
<<<<<<< HEAD
        description="Dynamic skill-graph gap matching against open internal requisitions."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Current competencies */}
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Current Competencies
            </p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {currentCompetencies.length} VERIFIED SKILLS
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {currentCompetencies.map((skill) => (
                <Tag key={skill}>{skill}</Tag>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target requisition */}
        <Card className="border-border">
          <CardContent className="flex h-full flex-col items-center justify-center p-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <Target className="h-3 w-3" /> Internal Requisition
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-foreground">
              {targetRole.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {targetRole.department} · {targetRole.openings} openings
            </p>

            <div className="mt-8">
              <p className="font-mono text-6xl font-semibold tracking-tight text-foreground">
                {alignment}
                <span className="text-primary">%</span>
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Alignment
              </p>
            </div>

            <div className="mt-6 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary transition-[width] duration-700 ease-out"
                style={{ width: `${alignment}%` }}
              />
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              10 PRESENT · {skillDelta.length} GAPS · {matchScore}% ALIGNED
            </p>
          </CardContent>
        </Card>

        {/* Skill delta */}
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Skill Delta (Gap)
            </p>
            <p className="mt-1 font-mono text-[11px] text-destructive">
              MISSING · {skillDelta.length} TO CLOSE
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillDelta.map((skill) => (
                <Tag key={skill} variant="gap">
                  {skill}
                </Tag>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Closing this gap unlocks{" "}
                <span className="font-medium text-foreground">Senior Cloud Architect</span>{" "}
                mobility within the current band.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      <Card className="mt-4 border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Upskilling Roadmap
            </h2>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              14-DAY SPRINT · 3 PHASES
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 font-mono text-[10px] text-success">
            <ArrowRight className="h-3 w-3" /> IN PROGRESS
          </span>
        </div>

        <CardContent className="relative p-5 lg:p-6">
          <div className="absolute left-6 right-6 top-[20px] hidden h-0.5 bg-border lg:block" />
          <div
            className="absolute left-6 top-[20px] hidden h-0.5 bg-gradient-primary transition-all duration-700 lg:block"
            style={{ width: "calc(33.333% + 16.667% * 0.5)" }}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roadmapPhases.map((phase, i) => (
              <div key={phase.week} className="relative">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-card font-mono text-xs font-semibold text-primary shadow-glow-primary">
                  {i + 1}
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {phase.week} · {phase.days}
                </p>
                <p className="font-display text-sm font-semibold text-foreground">
                  {phase.phase}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {phase.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-foreground/90"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-primary"
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
                <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                  {phase.progress}% COMPLETE
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
=======
        description="Turn today's capabilities into tomorrow's possibilities."
        right={
          employee ? (
            <EmployeeSelect
              value={employee.employee_code}
              onChange={setEmployee}
            />
          ) : undefined
        }
      />
      {!employee ? (
        <DataState
          loading={employeeLoading}
          error={employeeError}
          onRetry={() => (employeeError ? void refetch() : setEmployee(null))}
        />
      ) : isLoading ? (
        <DataState loading />
      ) : isError ? (
        <DataState error onRetry={() => void refetchPlan()} />
      ) : !plan ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GitBranch className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <h2 className="font-display text-lg">No pathway assigned yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {employee.name} does not have a saved mobility plan. No
              alternative employee's plan is shown.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-5 flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 font-semibold text-primary">
              {employee.initials}
            </span>
            <span className="font-medium">
              {employee.name}
              <span className="ml-2 hidden font-normal text-muted-foreground sm:inline">
                {employee.role}
              </span>
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <p className="section-kicker">01 / CURRENT CAPABILITIES</p>
                <h2 className="mt-3 font-display text-lg font-semibold">
                  Your starting point
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {current.length} recorded skills
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {current.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {!current.length && (
                  <p className="mt-5 text-sm text-muted-foreground">
                    No skills recorded.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="border-primary/25">
              <CardContent className="flex h-full flex-col items-center p-6 text-center">
                <span className="flex items-center gap-2 text-xs text-primary">
                  <Target size={15} />
                  Target opportunity
                </span>
                <h2 className="mt-4 font-display text-xl font-semibold">
                  {plan.target_role.title || "Role not specified"}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {plan.target_role.department} ·{" "}
                  {plan.target_role.openings ?? 0} recorded openings
                </p>
                <p className="mt-7 font-display text-6xl font-semibold tracking-tight">
                  {required.length ? match : "—"}
                  <span className="text-3xl text-primary">
                    {required.length ? "%" : ""}
                  </span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Skill overlap · not a hiring prediction
                </p>
                <progress
                  className="mt-5 h-1.5 w-full accent-primary"
                  value={match}
                  max={100}
                  aria-label="Skill overlap"
                />
                <p className="mt-3 font-mono text-[10px] text-muted-foreground">
                  {overlap.length} MATCHED / {required.length} REQUIRED
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="section-kicker">02 / GROWTH OPPORTUNITIES</p>
                <h2 className="mt-3 font-display text-lg font-semibold">
                  Your next steps
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {gaps.length} skills to develop
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {gaps.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {!gaps.length && required.length > 0 && (
                  <p className="mt-5 flex items-center gap-2 text-sm text-success">
                    <Check size={17} />
                    All listed skills are present.
                  </p>
                )}
                <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  Discuss your interests and readiness with your manager. A
                  skill match is a starting point, not a placement guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <div>
                <p className="section-kicker">03 / THE PATH FORWARD</p>
                <h2 className="mt-2 font-display text-lg font-semibold">
                  Saved development roadmap
                </h2>
              </div>
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs">
                {progress === null
                  ? "Not configured"
                  : progress === 100
                    ? "Recorded as complete"
                    : progress > 0
                      ? `${progress}% recorded progress`
                      : "Not started"}
              </span>
            </div>
            <CardContent className="p-6">
              {phases.length ? (
                <div className="grid gap-6 md:grid-cols-3">
                  {phases.map((phase, index) => (
                    <div key={`${phase.phase}-${index}`}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 font-mono text-sm text-primary">
                        0{index + 1}
                      </span>
                      <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {phase.week} · {phase.days}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold">
                        {phase.phase}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {phase.topics.map((topic) => (
                          <li
                            key={topic}
                            className="text-xs text-muted-foreground"
                          >
                            {topic}
                          </li>
                        ))}
                      </ul>
                      <progress
                        value={Math.max(0, Math.min(100, phase.progress))}
                        max={100}
                        className="mt-5 h-1 w-full accent-primary"
                        aria-label={`${phase.phase} progress`}
                      />
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {Math.max(0, Math.min(100, phase.progress))}% recorded
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-5 text-center text-sm text-muted-foreground">
                  No milestones have been saved for this employee. Dates and
                  progress will appear when a plan is configured.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="mt-5 flex justify-end">
            <Button asChild variant="outline">
              <Link
                to={`/action-center?employee=${encodeURIComponent(employee.employee_code)}`}
              >
                Open retention case
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </>
      )}
>>>>>>> origin/enter-main
    </>
  );
}
