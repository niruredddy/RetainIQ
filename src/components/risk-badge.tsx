import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function riskBand(score: number) {
  if (score <= 30) return "Low";
  if (score <= 70) return "Elevated";
  return "Critical";
}

export function RiskBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const band = riskBand(score);
  const critical = band === "Critical";

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-mono text-xs font-semibold",
        band === "Low" &&
          "bg-success/10 text-success ring-1 ring-inset ring-success/25",
        band === "Elevated" &&
          "bg-warning/10 text-warning ring-1 ring-inset ring-warning/30",
        critical &&
          "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/30 animate-pulse-glow",
        className
      )}
    >
      {score}%
    </Badge>
  );
}
