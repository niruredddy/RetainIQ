<<<<<<< HEAD
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
=======
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
>>>>>>> origin/enter-main
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
<<<<<<< HEAD
=======
import { useEmployees } from "@/hooks/use-employees";
>>>>>>> origin/enter-main

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
<<<<<<< HEAD
  const isDark = resolvedTheme === "dark";

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
=======
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
>>>>>>> origin/enter-main
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
<<<<<<< HEAD
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
            <p>3 new signals</p>
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
=======
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
>>>>>>> origin/enter-main
                {user?.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
<<<<<<< HEAD
            <DropdownMenuItem onSelect={() => void signOut()}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
=======
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
>>>>>>> origin/enter-main
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
