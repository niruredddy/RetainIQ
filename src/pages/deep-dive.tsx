import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Check,
  Clipboard,
  Clock,
  Loader2,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-shell";
import { RiskBadge } from "@/components/risk-badge";
import { useEmployees } from "@/hooks/use-employees";
import { useEmployeeParam } from "@/hooks/use-employee-param";
import { EmployeeSelect } from "@/components/employee-select";
import { runDiagnostic, type DiagnosticResult } from "@/lib/diagnostic";
import { cn } from "@/lib/utils";

/* ---------- JSON syntax highlighting ---------- */

function highlightJson(json: string): ReactNode[] {
  const out: ReactNode[] = [];
  let plain = "";
  const pushPlain = () => {
    if (plain) {
      out.push(
        <span key={out.length} className="text-zinc-500">
          {plain}
        </span>
      );
      plain = "";
    }
  };

  let i = 0;
  while (i < json.length) {
    const ch = json[i];

    if (ch === '"') {
      pushPlain();
      let j = i + 1;
      let escaped = false;
      while (j < json.length) {
        const c = json[j];
        if (c === '"' && !escaped) break;
        if (c === "\\" && !escaped) escaped = true;
        else escaped = false;
        j++;
      }
      const str = json.slice(i, j + 1);
      const isKey = /^\s*:/.test(json.slice(j + 1));
      out.push(
        <span key={out.length} className={isKey ? "text-sky-400" : "text-emerald-400"}>
          {str}
        </span>
      );
      i = j + 1;
      continue;
    }

    if (/[\d-]/.test(ch)) {
      pushPlain();
      let j = i;
      while (j < json.length && /[\d\-+.eE]/.test(json[j])) j++;
      out.push(
        <span key={out.length} className="text-orange-400">
          {json.slice(i, j)}
        </span>
      );
      i = j;
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      pushPlain();
      let j = i;
      while (j < json.length && /[a-zA-Z]/.test(json[j])) j++;
      const word = json.slice(i, j);
      const cls =
        word === "true" || word === "false" || word === "null"
          ? "text-purple-400"
          : "text-zinc-300";
      out.push(
        <span key={out.length} className={cls}>
          {word}
        </span>
      );
      i = j;
      continue;
    }

    plain += ch;
    i++;
  }
  pushPlain();
  return out;
}

/* ---------- Radial gauge ---------- */

function Gauge({ value }: { value: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const color = value >= 70 ? "hsl(var(--destructive))" : "hsl(var(--success))";
  return (
    <div className="relative mx-auto h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-semibold text-foreground">{value}</span>
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

type PanelState = "idle" | "loading" | "done" | "error";

export default function DeepDive() {
  const { data: employees, isLoading } = useEmployees();
  const { employeeCode, setEmployee } = useEmployeeParam();
  const live =
    employees?.find((e) => e.employee_code === employeeCode) ?? employees?.[0];
  const focusEmployee = live
    ? {
        id: live.employee_code,
        name: live.name,
        role: live.role,
        initials: live.initials,
        gradient: live.gradient,
        tenure: live.tenure,
        riskScore: live.risk_score,
      }
    : null;

  const attendance = live?.attendance_pattern ?? [];
  const sentiment = live?.peer_sentiment ?? 0;
  const sentimentBaseline = live?.peer_sentiment_baseline ?? 92;
  const skills = live?.skill_matrix ?? [];

  // Live-derived attendance readout: peak day vs average.
  const avgHours = attendance.length
    ? attendance.reduce((sum, p) => sum + p.hours, 0) / attendance.length
    : 0;
  const peak = attendance.reduce(
    (best, p) => (p.hours > best.hours ? p : best),
    { day: "", hours: 0 }
  );
  const spikeDelta = peak.hours - avgHours;
  const spikeLabel =
    spikeDelta > 0.8
      ? `SPIKE DETECTED · +${spikeDelta.toFixed(1)}H ON ${peak.day.toUpperCase()}`
      : `PATTERN NORMAL · AVG ${avgHours.toFixed(1)}H`;

  const [state, setState] = useState<PanelState>("idle");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const json = useMemo(
    () => (result ? JSON.stringify(result.payload, null, 2) : ""),
    [result]
  );

  const run = async () => {
    if (state === "loading" || !focusEmployee) return;
    setState("loading");
    setResult(null);
    setError(null);
    setElapsed(0);
    try {
      const res = await runDiagnostic(focusEmployee.id, setElapsed);
      setResult(res);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Diagnostic failed.");
      setState("error");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <>
      <PageHeader
        title="Deep-Dive"
        description="Focused telemetry review with Qwen zero-hallucination structured output."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* LEFT — telemetry */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="border-border">
            <CardContent className="flex flex-wrap items-center gap-4 p-5">
              {focusEmployee ? (
                <>
                  <Avatar className="h-12 w-12 ring-1 ring-border">
                    <AvatarFallback
                      className={cn(
                        "bg-gradient-to-br text-sm font-semibold text-white",
                        focusEmployee.gradient
                      )}
                    >
                      {focusEmployee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-base font-semibold text-foreground">
                        {focusEmployee.name}
                      </h2>
                      <RiskBadge score={focusEmployee.riskScore} />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {focusEmployee.role}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <EmployeeSelect
                      value={focusEmployee.id}
                      onChange={setEmployee}
                    />
                    <div className="flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> TENURE {focusEmployee.tenure}
                      </span>
                      <span>ID {focusEmployee.id}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center gap-4">
                  <div className="shimmer h-12 w-12 shrink-0 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="shimmer h-4 w-40 rounded bg-muted" />
                    <div className="shimmer h-3 w-56 rounded bg-muted" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
            {/* Attendance */}
            <Card className="border-border">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Attendance Pattern
                </p>
                <p className="mb-3 mt-1 font-mono text-[11px] text-destructive">
                  {spikeLabel}
                </p>
                <div className="h-24 min-w-0">
                  <ResponsiveContainer width="100%" height={96}>
                    <AreaChart data={attendance} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="attendFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide domain={[0, 14]} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 11,
                        }}
                        labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        fill="url(#attendFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment gauge */}
            <Card className="border-border">
              <CardContent className="flex flex-col items-center p-5">
                <p className="self-start text-xs font-medium text-muted-foreground">
                  Peer Review Sentiment
                </p>
                <div className="mt-3">
                  <Gauge value={sentiment} />
                </div>
                <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                  BASELINE {sentimentBaseline} → NOW {sentiment}
                </p>
              </CardContent>
            </Card>

            {/* Skill matrix */}
            <Card className="border-border">
              <CardContent className="p-5">
                <p className="text-xs font-medium text-muted-foreground">
                  Skill Matrix
                </p>
                <p className="mb-3 mt-1 font-mono text-[11px] text-muted-foreground">
                  {skills.length} VERIFIED
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={run}
            disabled={state === "loading" || !focusEmployee}
            className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow-primary transition-all duration-200 hover:scale-[1.01] hover:shadow-glow-primary-lg disabled:opacity-70"
          >
            {state === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running diagnostic… {elapsed}s
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Run Qwen Diagnostic
              </>
            )}
          </Button>
        </div>

        {/* RIGHT — structured output */}
        <Card className="flex min-h-[560px] flex-col border-border lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Qwen Reasoning Engine
              </h2>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                zero-hallucination · structured
              </p>
            </div>
            {state === "done" &&
              result &&
              (result.payload as { source?: string })?.source ===
                "cached_analysis" && (
                <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 font-mono text-[9px] text-warning">
                  CACHED ANALYSIS — AGENT UNREACHABLE
                </span>
              )}
            {state === "done" && (
              <Button variant="outline" size="sm" onClick={copy}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" /> Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="h-3.5 w-3.5" /> Copy JSON
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-auto rounded-b-lg bg-[#0A0B0D] p-4 font-mono text-[13px] leading-relaxed">
            {state === "idle" && (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 text-center">
                <ScanSearch className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
                <p className="max-w-[260px] text-xs leading-relaxed text-zinc-500">
                  Awaiting diagnostic trigger. Click{" "}
                  <span className="text-zinc-300">"Run Qwen Diagnostic"</span> to
                  analyze multi-source telemetry.
                </p>
              </div>
            )}

            {state === "loading" && (
              <div className="space-y-3 pt-1">
                {[88, 55, 70, 100, 62, 40, 82, 30].map((w, i) => (
                  <div
                    key={i}
                    className="shimmer h-3.5 rounded bg-zinc-800/80"
                    style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            )}

            {state === "error" && (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 text-center">
                <p className="font-mono text-xs tracking-widest text-destructive">
                  DIAGNOSTIC FAILED
                </p>
                <p className="max-w-[280px] text-xs leading-relaxed text-zinc-500">
                  {error}
                </p>
                <Button variant="outline" size="sm" onClick={run}>
                  Retry
                </Button>
              </div>
            )}

            {state === "done" && result && (
              <pre className="whitespace-pre-wrap">{highlightJson(json)}</pre>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
