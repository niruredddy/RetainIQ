import { cn } from "@/lib/utils";

const ITEMS = [
  "RISK SIGNALS · 18",
  "EMPLOYEES MONITORED · 247",
  "WORKFLOWS ACTIVE · 7",
  "PREDICTION WINDOW · 90D",
  "DIAGNOSTIC P95 · 1.8S",
  "UPSKILLING SPRINT · 14D",
];

function TickerRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
            {item}
          </span>
          <span className="h-1 w-1 rounded-full bg-primary/50" />
        </span>
      ))}
    </div>
  );
}

export function Ticker({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-border bg-card/60 py-3",
        className
      )}
    >
      <div className="flex w-max animate-ticker">
        <TickerRow />
        <TickerRow ariaHidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
