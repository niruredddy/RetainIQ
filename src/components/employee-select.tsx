import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";

export function EmployeeSelect({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (employeeCode: string) => void;
  className?: string;
}) {
  const { data: employees } = useEmployees();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label="Select employee" className={cn("w-56 max-w-full", className)}>
        <SelectValue placeholder="Select employee…" />
      </SelectTrigger>
      <SelectContent>
        {(employees ?? []).map((emp) => (
          <SelectItem key={emp.id} value={emp.employee_code}>
            <span className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary"
              >
                {emp.initials}
              </span>
              <span>{emp.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {emp.risk_score}%
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
