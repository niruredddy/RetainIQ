import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent } from "./sidebar";
import { TopHeader } from "./top-header";
import { CommandPalette } from "./command-palette";
import { PageShell } from "./page-shell";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useRealtimeInvalidate } from "@/hooks/use-realtime";
import { useEmployees } from "@/hooks/use-employees";

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const status = useRealtimeInvalidate();
  const { dataUpdatedAt, isError } = useEmployees();
  return (
    <div className="app-atmosphere flex h-dvh w-full overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:p-3"
      >
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader
          onOpenSearch={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <div className="data-note">
          <span>Sample workforce dataset · HR source not connected</span>
          <span role="status">Database sync: {status} · {isError ? "Snapshot unavailable" : dataUpdatedAt ? `Fetched ${new Date(dataUpdatedAt).toLocaleTimeString()}` : "Fetching snapshot…"}</span>
        </div>
        <main
          id="main-content"
          className="relative flex-1 overflow-y-auto"
          tabIndex={-1}
        >
          <PageShell key={location.pathname}>
            <Outlet />
          </PageShell>
        </main>
      </div>
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-72 p-0"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.getElementById("mobile-nav-toggle")?.focus();
          }}
        >
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Choose a RetainIQ module
          </SheetDescription>
          <SidebarContent
            collapsed={false}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </SheetContent>
      </Sheet>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
