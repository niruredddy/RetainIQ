import { GitBranch, Radar, ScanSearch, Zap } from "lucide-react";
import { Reveal } from "./reveal";

const FEATURES = [
  {
    icon: Radar,
    index: "01",
    title: "Risk Radar",
    body: "Cross-vector attrition radar fuses HRIS, telemetry and peer sentiment into one live risk score.",
  },
  {
    icon: ScanSearch,
    index: "02",
    title: "Deep-Dive",
    body: "Qwen zero-hallucination diagnostics turn noisy telemetry into structured root causes.",
  },
  {
    icon: GitBranch,
    index: "03",
    title: "Mobility Matcher",
    body: "Skill-graph matching surfaces internal moves and closes the gap with a 14-day sprint.",
  },
  {
    icon: Zap,
    index: "04",
    title: "Action Center",
    body: "One-click orchestration dispatches managers, mentors and reviews before it's too late.",
  },
];

export function Features() {
  return (
    <section id="product" className="scroll-mt-24 border-t border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              THE PLATFORM
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Four engines. One retention loop.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              RetainIQ doesn't chat about turnover — it measures, diagnoses and
              acts on it, continuously.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-primary">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-shadow duration-200 group-hover:shadow-glow-primary">
                    <feature.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {feature.index}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
