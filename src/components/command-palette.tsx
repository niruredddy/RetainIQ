import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { NAV_ITEMS } from "@/lib/nav";
import { useEmployees } from "@/hooks/use-employees";
import { useEmployeeParam } from "@/hooks/use-employee-param";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { employeePath } = useEmployeeParam();
  const { data: employees, isError } = useEmployees();
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") ||
        (event.key === "/" &&
          !typing &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey)
      ) {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);
  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, people or roles…" />
      <CommandList>
        <CommandEmpty>
          {isError
            ? "Employee search unavailable. Please retry."
            : "No matching results."}
        </CommandEmpty>
        <CommandGroup heading="Workspace">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.path}
              value={item.label}
              onSelect={() => go(employeePath(item.path))}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="People">
          {employees?.map((employee) => (
            <CommandItem
              key={employee.id}
              value={`${employee.name} ${employee.role} ${employee.employee_code}`}
              onSelect={() =>
                go(
                  `/deep-dive?employee=${encodeURIComponent(employee.employee_code)}`,
                )
              }
            >
              <Users className="h-4 w-4" />
              <span>
                {employee.name}
                <small className="ml-2 text-muted-foreground">
                  {employee.role}
                </small>
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
