import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Bell, ChevronRight, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useEmployees } from "@/hooks/use-employees";

export function TopHeader({
  onOpenSearch,
  onOpenMobileNav,
}: {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
}) {
  const { pathname } = useLocation();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { data: employees } = useEmployees();
  const isDark = resolvedTheme === "dark";
  const criticalSignals =
    employees?.filter((e) => e.risk_score > 70).length ?? 0;

  const current =
    pathname === "/"
      ? NAV_ITEMS[0]
      : NAV_ITEMS.find((item) => item.path !== "/" && pathname.startsWith(item.path));

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "User";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 lg:px-6">
      {/* Mobile nav trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileNav}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb */}
      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Dashboard</span>
        {current && current.path !== "/" && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="truncate font-medium text-foreground">
              {current.label}
            </span>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Global search */}
        <button
          onClick={onOpenSearch}
          className="group hidden h-9 w-60 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted/70 sm:flex lg:w-72"
        >
          <Search className="h-4 w-4" />
          <span className="truncate">Search…</span>
          <kbd className="ml-auto rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={onOpenSearch}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="transition-transform duration-200 hover:scale-105"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Switch to {isDark ? "light" : "dark"} mode</p>
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative transition-transform duration-200 hover:scale-105"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {criticalSignals > 0
                ? `${criticalSignals} critical signal${criticalSignals === 1 ? "" : "s"}`
                : "No critical signals"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1.5 flex items-center gap-2.5 border-l border-border pl-3 outline-none transition-opacity duration-200 hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-semibold text-white ring-2 ring-border">
                {initials}
              </div>
              <div className="hidden leading-tight text-left lg:block">
                <p className="text-sm font-medium text-foreground">
                  {displayName}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void signOut()}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
