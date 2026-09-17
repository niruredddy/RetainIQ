import { NavLink } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/button";

export function SidebarContent({
  collapsed,
  onToggle,
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
            end={item.path === "/"}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
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
        "hidden shrink-0 border-r border-border bg-card/70 backdrop-blur-md transition-[width] duration-300 ease-in-out md:block",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}
