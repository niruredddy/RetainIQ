import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/button";
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
  const { data: employees, isLoading, isError } = useEmployees();
  const [error, setError] = useState<string | null>(null);
  const signals = employees?.filter((e) => e.risk_score > 70) ?? [];
  const current = NAV_ITEMS.find((item) => item.path === pathname);
  const name =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "User";
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <header className="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 lg:px-6">
      <Button
        id="mobile-nav-toggle"
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
      >
        <Menu size={19} />
      </Button>
      <div className="flex min-w-0 items-center gap-1.5 text-xs">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          Workspace
        </Link>
        {current && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span className="truncate font-medium">{current.label}</span>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={onOpenSearch}
          aria-label="Search pages and employees"
          className="hidden h-9 w-48 items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 text-xs text-muted-foreground hover:border-primary/30 sm:flex"
        >
          <Search size={14} />
          <span>Search your workspace</span>
          <kbd className="ml-auto text-[10px]">⌘K</kbd>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Search"
          onClick={onOpenSearch}
        >
          <Search size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Review ${signals.length} critical signals`}
              className="relative"
            >
              <Bell size={18} />
              {signals.length > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Critical workforce signals</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoading || isError || signals.length === 0 ? (
              <p className="px-2 py-4 text-xs text-muted-foreground">
                {isLoading
                  ? "Loading signals…"
                  : isError
                    ? "Unable to load signals."
                    : "No critical signals in the current snapshot."}
              </p>
            ) : (
              signals.map((employee) => (
                <DropdownMenuItem key={employee.id} asChild>
                  <Link
                    to={`/deep-dive?employee=${encodeURIComponent(employee.employee_code)}`}
                  >
                    <span className="flex-1">
                      {employee.name}
                      <small className="block text-muted-foreground">
                        {employee.role}
                      </small>
                    </span>
                    <span className="text-destructive">
                      {employee.risk_score}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className="ml-2 flex items-center gap-2.5 border-l border-border pl-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </span>
              <span className="hidden max-w-40 truncate text-xs font-medium lg:block">
                {name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              {name}
              <p className="mt-1 truncate text-[10px] font-normal text-muted-foreground">
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setError(null);
                void signOut().catch(() =>
                  setError("Sign-out failed. Please try again."),
                );
              }}
            >
              <LogOut size={15} />
              Sign out
            </DropdownMenuItem>
            {error && (
              <p role="alert" className="p-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
