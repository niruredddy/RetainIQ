import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThreeBackground = lazy(() => import("./three-background"));

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.15 + i * 0.12, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* Backgrounds */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsl(var(--primary)/0.16),transparent_70%)]"
      />
      <Suspense fallback={null}>
        <ThreeBackground variant="hero" />
      </Suspense>
      {/* Soft scrim behind copy for guaranteed readability */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_30%_50%,hsl(var(--background)/0.7),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
      />

      {/* Content — left-aligned so the globe owns the right half */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-24 pt-36 lg:px-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.22em] text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          AUTONOMOUS WORKFORCE INTELLIGENCE · V1.0
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Keep the people who
          <br /> <span className="gradient-text">keep you shipping.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          RetainIQ fuses HRIS, telemetry and sentiment into a single risk score —
          then autonomously runs Qwen diagnostics and orchestrates retention
          workflows before your best people walk out the door.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-col items-start gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="h-12 bg-gradient-primary px-7 text-primary-foreground shadow-glow-primary-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-primary"
          >
            <a href="#cta">
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-7 transition-all duration-200 hover:scale-[1.02] hover:border-primary/40"
          >
            <a href="#platform">Explore the platform</a>
          </Button>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-8 font-mono text-[10px] tracking-[0.2em] text-muted-foreground"
        >
          NO CREDIT CARD · SOC 2 TYPE II · 14-DAY PILOT
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#platform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="font-mono text-[9px] tracking-[0.3em]">SCROLL</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}
