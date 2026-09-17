import { Database, ScanSearch, Zap } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: Database,
    index: "01",
    title: "Ingest",
    body: "HRIS, calendar, code activity and peer reviews stream into one normalized telemetry layer.",
  },
  {
    icon: ScanSearch,
    index: "02",
    title: "Diagnose",
    body: "The Qwen reasoning engine emits structured, zero-hallucination root causes — copyable as JSON.",
  },
  {
    icon: Zap,
    index: "03",
    title: "Act",
    body: "EnterPro orchestrates manager dispatch, upskilling sprints and mentor check-ins automatically.",
  },
];

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              HOW IT WORKS
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Detect. Diagnose. Act.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              A closed loop that runs continuously — no dashboards left unread,
              no check-ins left unscheduled.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-14">
          {/* Connector */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[26px] hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block"
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.1}>
                <div className="relative flex flex-col items-start lg:items-center lg:text-center">
                  <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-primary/30 bg-card shadow-glow-primary">
                    <step.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <span className="mt-5 font-mono text-[10px] tracking-[0.24em] text-muted-foreground">
                    STEP {step.index}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
