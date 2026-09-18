import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
import { Users } from "lucide-react";
>>>>>>> origin/enter-main
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
<<<<<<< HEAD
  CommandShortcut,
} from "@/components/ui/command";
import { NAV_ITEMS } from "@/lib/nav";
=======
} from "@/components/ui/command";
import { NAV_ITEMS } from "@/lib/nav";
import { useEmployees } from "@/hooks/use-employees";
import { useEmployeeParam } from "@/hooks/use-employee-param";
>>>>>>> origin/enter-main

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
<<<<<<< HEAD

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = document.activeElement;
        const typing =
          el instanceof HTMLElement &&
          (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
        if (!typing) {
          e.preventDefault();
          onOpenChange(true);
        }
      }
=======
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
>>>>>>> origin/enter-main
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenChange]);
<<<<<<< HEAD

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search screens, employees, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
=======
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
>>>>>>> origin/enter-main
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.path}
              value={item.label}
<<<<<<< HEAD
              onSelect={() => {
                navigate(item.path);
                onOpenChange(false);
              }}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              <CommandShortcut>{item.path}</CommandShortcut>
=======
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
>>>>>>> origin/enter-main
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
