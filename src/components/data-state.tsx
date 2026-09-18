import { AlertCircle, Users } from "lucide-react";
import { Button } from "./ui/button";
export function DataState({
  loading,
  error,
  title = "No employee selected",
  onRetry,
}: {
  loading?: boolean;
  error?: boolean;
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="surface-card flex min-h-52 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-8 text-center"
      role="status"
    >
      {error ? (
        <AlertCircle className="h-7 w-7 text-destructive" />
      ) : (
        <Users className="h-7 w-7 text-muted-foreground" />
      )}
      <p className="text-sm font-medium">
        {loading
          ? "Loading workforce records…"
          : error
            ? "Unable to load records"
            : title}
      </p>
      <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
        {loading
          ? "Retrieving the latest database snapshot."
          : error
            ? "Check your connection and try again."
            : "Select an available employee. No data has been substituted."}
      </p>
      {onRetry && !loading && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {error ? "Retry" : "Select first employee"}
        </Button>
      )}
    </div>
  );
}
