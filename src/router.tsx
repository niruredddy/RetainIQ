import AppShell from "./components/app-shell";
import { AuthGuard } from "./components/auth-guard";
import Dashboard from "./pages/dashboard";
<<<<<<< HEAD
import RiskRadar from "./pages/risk-radar";
import DeepDive from "./pages/deep-dive";
import MobilityMatcher from "./pages/mobility-matcher";
import ActionCenter from "./pages/action-center";
=======
>>>>>>> origin/enter-main
import AuthPage from "./pages/auth";
import NotFound from "./pages/NotFound";

export const routers = [
<<<<<<< HEAD
  {
    path: "/auth",
    name: "auth",
    element: <AuthPage />,
  },
  {
    path: "/",
=======
  { path: "/auth", name: "auth", element: <AuthPage /> },
  {
    path: "/",
    hydrateFallbackElement: (
      <div
        className="flex min-h-screen items-center justify-center bg-background text-foreground"
        role="status"
      >
        Opening your workspace…
      </div>
    ),
>>>>>>> origin/enter-main
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
<<<<<<< HEAD
      {
        index: true,
        name: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "risk-radar",
        name: "risk-radar",
        element: <RiskRadar />,
=======
      { index: true, name: "dashboard", element: <Dashboard /> },
      {
        path: "risk-radar",
        name: "risk-radar",
        lazy: async () => ({
          Component: (await import("./pages/risk-radar")).default,
        }),
>>>>>>> origin/enter-main
      },
      {
        path: "deep-dive",
        name: "deep-dive",
<<<<<<< HEAD
        element: <DeepDive />,
=======
        lazy: async () => ({
          Component: (await import("./pages/deep-dive")).default,
        }),
>>>>>>> origin/enter-main
      },
      {
        path: "mobility-matcher",
        name: "mobility-matcher",
<<<<<<< HEAD
        element: <MobilityMatcher />,
=======
        lazy: async () => ({
          Component: (await import("./pages/mobility-matcher")).default,
        }),
>>>>>>> origin/enter-main
      },
      {
        path: "action-center",
        name: "action-center",
<<<<<<< HEAD
        element: <ActionCenter />,
      },
    ],
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

=======
        lazy: async () => ({
          Component: (await import("./pages/action-center")).default,
        }),
      },
    ],
  },
  { path: "*", name: "404", element: <NotFound /> },
];
>>>>>>> origin/enter-main
declare global {
  interface Window {
    __routers__: typeof routers;
  }
}
<<<<<<< HEAD

=======
>>>>>>> origin/enter-main
window.__routers__ = routers;
