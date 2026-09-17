import { useEffect, useState } from "react";
import { Reveal } from "./reveal";

function useCountUp(target: number, duration = 1200, delay = 200) {
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

const STATS = [
  { value: 76, suffix: "%", label: "of attrition is predictable 90+ days out", accent: "text-foreground" },
  { value: 2.3, suffix: "×", decimals: 1, label: "retention ROI within one fiscal year", accent: "text-primary" },
  { value: 14, suffix: "d", label: "upskilling sprint, end to end", accent: "text-foreground" },
  { value: 247, suffix: "", label: "employees continuously monitored", accent: "text-success" },
];

function StatCard({ stat }: { stat: (typeof STATS)[number] }) {
  const value = useCountUp(stat.value);
  return (
    <div className="flex flex-col items-start gap-1 rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <p className={`font-mono text-4xl font-semibold tracking-tight ${stat.accent}`}>
        {stat.decimals ? value.toFixed(stat.decimals) : value}
        <span className="text-xl text-muted-foreground">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {stat.label}
      </p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
            THE SIGNAL
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <StatCard stat={stat} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
