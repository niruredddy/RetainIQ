import { Radar } from "lucide-react";

const COLUMNS = [
  {
    heading: "Product",
    links: ["Risk Radar", "Deep-Dive", "Mobility Matcher", "Action Center"],
  },
  {
    heading: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    heading: "Legal",
    links: ["Privacy", "Security", "Terms", "SOC 2"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-glow-primary">
                <Radar className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
              </div>
              <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
                RetainIQ
              </span>
              <span className="rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                v1.0
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The autonomous workforce mobility &amp; retention engine.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            © 2026 RETAINIQ, INC. · ALL RIGHTS RESERVED
          </p>
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
            SOC 2 TYPE II · GDPR · ZERO-HALLUCINATION MODE
          </p>
        </div>
      </div>
    </footer>
  );
}
