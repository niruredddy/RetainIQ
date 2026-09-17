import { Check } from "lucide-react";
import { Reveal } from "./reveal";
import { employees } from "@/data/dashboard";
import { cn } from "@/lib/utils";

const BULLETS = [
  "Live risk scoring across every employee, updated every 60 seconds",
  "Structured diagnostics you can copy as JSON — no hallucinations",
  "Workflows that act on the data, not just report it",
];

const STATUS_DOT: Record<string, string> = {
  Escalate: "bg-destructive",
  Intervene: "bg-warning",
  Monitor: "bg-muted-foreground",
};

const topEmployees = [...employees].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

export function PlatformPreview() {
  return (
    <section id="platform" className="scroll-mt-24 border-t border-border py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <div>
          <Reveal>
            <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
              SEE IT IN ACTION
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              One console for the whole retention loop.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Every signal, diagnostic and workflow lives in a single,
              high-density surface your leadership team will actually use.
            </p>
          </Reveal>
          <div className="mt-8 space-y-3.5">
            {BULLETS.map((bullet, i) => (
              <Reveal key={bullet} delay={0.2 + i * 0.08}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-success/30 bg-success/10">
                    <Check className="h-3 w-3 text-success" strokeWidth={3} />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {bullet}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Browser window */}
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 rounded border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                app.retainiq.io/risk-radar
              </span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-success">
                <span className="h-1 w-1 animate-pulse rounded-full bg-success" />
                LIVE
              </span>
            </div>

            {/* Table */}
            <div className="divide-y divide-border">
              <div className="grid grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr] items-center gap-3 bg-muted/30 px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <span>Employee</span>
                <span className="text-right">Risk</span>
                <span className="text-right">Status</span>
              </div>
              {topEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="grid grid-cols-[minmax(0,1.6fr)_0.7fr_0.8fr] items-center gap-3 px-4 py-2.5 transition-colors duration-200 hover:bg-accent/50"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-semibold text-white",
                        emp.gradient
                      )}
                    >
                      {emp.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-foreground">
                        {emp.name}
                      </p>
                      <p className="truncate font-mono text-[9px] text-muted-foreground">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "text-right font-mono text-sm font-semibold",
                      emp.riskScore > 70
                        ? "text-destructive"
                        : emp.riskScore > 30
                          ? "text-warning"
                          : "text-success"
                    )}
                  >
                    {emp.riskScore}%
                  </p>
                  <p className="flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted-foreground">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        STATUS_DOT[emp.status]
                      )}
                    />
                    {emp.status}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-muted/30 px-4 py-2.5 font-mono text-[9px] tracking-widest text-muted-foreground">
              TELEMETRY STREAM · REFRESH 60S · QWEN DIAGNOSTIC READY
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
