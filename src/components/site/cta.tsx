import { lazy, Suspense, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "./reveal";

const ThreeBackground = lazy(() => import("./three-background"));

export function Cta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="cta" className="scroll-mt-24 border-t border-border py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card">
            {/* Backgrounds */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,hsl(var(--primary)/0.22),transparent_70%)]"
            />
            <Suspense fallback={null}>
              <ThreeBackground variant="cta" />
            </Suspense>
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_55%,hsl(var(--background)/0.65),transparent_70%)]"
            />

            <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center lg:py-24">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                GET STARTED
              </span>
              <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Ready to stop losing your best people?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                See your retention risk score live, on your own data, in a
                14-day pilot. Implementation takes less than a week.
              </p>

              {submitted ? (
                <div className="mt-10 flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 px-5 py-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <p className="font-mono text-sm text-success">
                    REQUEST RECEIVED — WE'LL BE IN TOUCH WITHIN 24H
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                >
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-12 flex-1 bg-background/70 backdrop-blur"
                  />
                  <Button
                    type="submit"
                    className="h-12 bg-gradient-primary px-6 text-primary-foreground shadow-glow-primary-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-primary"
                  >
                    Request access
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}

              <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                PILOT · SOC 2 TYPE II · GDPR
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
