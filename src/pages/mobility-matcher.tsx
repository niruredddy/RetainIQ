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

  return (
    <>
      <PageHeader
        title="Mobility Matcher"
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
    </>
  );
}
