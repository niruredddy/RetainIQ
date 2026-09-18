<<<<<<< HEAD
import { lazy, Suspense, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
=======
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
>>>>>>> origin/enter-main
import { Sidebar, SidebarContent } from "./sidebar";
import { TopHeader } from "./top-header";
import { CommandPalette } from "./command-palette";
import { PageShell } from "./page-shell";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";

const ThreeBackground = lazy(() => import("./site/three-background"));
=======
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useRealtimeInvalidate } from "@/hooks/use-realtime";
import { useEmployees } from "@/hooks/use-employees";
>>>>>>> origin/enter-main

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
<<<<<<< HEAD

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* Ambient WebGL backdrop */}
      <Suspense fallback={null}>
        <ThreeBackground variant="app" />
      </Suspense>

      <div className="relative z-10 flex w-full min-w-0 flex-1">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader
            onOpenSearch={() => setPaletteOpen(true)}
            onOpenMobileNav={() => setMobileNavOpen(true)}
          />
          <main className="relative flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              <PageShell key={location.pathname}>
                <Outlet />
              </PageShell>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-60 border-r border-border bg-card md:hidden"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="absolute right-2 top-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent collapsed={false} onToggle={() => {}} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

=======
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
>>>>>>> origin/enter-main
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
