import { NavLink } from "react-router-dom";
<<<<<<< HEAD
import { ChevronsLeft, ChevronsRight, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/button";
=======
import { ChevronsLeft, ChevronsRight, Radar, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { useEmployeeParam } from "@/hooks/use-employee-param";
>>>>>>> origin/enter-main

export function SidebarContent({
  collapsed,
  onToggle,
<<<<<<< HEAD
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-border px-4",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-glow-primary">
          <Radar className="h-5 w-5 text-primary" strokeWidth={1.75} />
        </div>
        {!collapsed && (
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
              RetainIQ
            </span>
            <span className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[9px] font-medium text-muted-foreground">
              v1.0
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
=======
  onNavigate,
}: {
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  const { employeePath } = useEmployeeParam();
  return (
    <div className="flex h-full w-full flex-col">
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-border px-5",
          collapsed && "justify-center px-2",
        )}
      >
        <span className="brand-icon h-9 w-9 shrink-0">
          <Radar className="h-5 w-5" />
        </span>
        {!collapsed && (
          <span className="font-display text-lg font-semibold tracking-tight">
            Retain<span className="text-primary">IQ</span>
          </span>
        )}
      </div>
      {!collapsed && (
        <p className="px-6 pb-2 pt-7 font-mono text-[9px] tracking-[.18em] text-muted-foreground">
          YOUR WORKSPACE
        </p>
      )}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={employeePath(item.path)}
            onClick={onNavigate}
>>>>>>> origin/enter-main
            end={item.path === "/"}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
<<<<<<< HEAD
                "group relative flex items-center gap-3 rounded-r-md border-l-2 px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-0"
              )
            }
          >
            <item.icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-colors",
                "text-muted-foreground group-hover:text-foreground"
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "w-full justify-start text-muted-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

=======
                "group flex items-center gap-3 rounded-xl border px-3 py-3 text-[13px] font-medium transition-colors",
                isActive
                  ? "border-primary/20 bg-primary/10 text-primary shadow-soft"
                  : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-0",
              )
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="mx-4 mb-5 rounded-xl border border-border bg-muted/40 p-4">
          <GitBranch className="mb-3 h-5 w-5 text-primary" />
          <p className="text-xs font-medium">Potential, not just prediction.</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Turn workforce insight into human-led action.
          </p>
        </div>
      )}
      {onToggle && (
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "w-full justify-start text-muted-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <>
                <ChevronsLeft size={16} />
                Collapse sidebar
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
>>>>>>> origin/enter-main
export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
<<<<<<< HEAD
        "hidden shrink-0 border-r border-border bg-card/70 backdrop-blur-md transition-[width] duration-300 ease-in-out md:block",
        collapsed ? "w-16" : "w-60"
=======
        "hidden shrink-0 border-r border-border bg-card/80 transition-[width] duration-200 md:block",
        collapsed ? "w-16" : "w-60",
>>>>>>> origin/enter-main
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}
