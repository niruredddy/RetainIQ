import AppShell from "./components/app-shell";
import { AuthGuard } from "./components/auth-guard";
import Dashboard from "./pages/dashboard";
import AuthPage from "./pages/auth";
import NotFound from "./pages/NotFound";

export const routers = [
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
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    children: [
      { index: true, name: "dashboard", element: <Dashboard /> },
      {
        path: "risk-radar",
        name: "risk-radar",
        lazy: async () => ({
          Component: (await import("./pages/risk-radar")).default,
        }),
      },
      {
        path: "deep-dive",
        name: "deep-dive",
        lazy: async () => ({
          Component: (await import("./pages/deep-dive")).default,
        }),
      },
      {
        path: "mobility-matcher",
        name: "mobility-matcher",
        lazy: async () => ({
          Component: (await import("./pages/mobility-matcher")).default,
        }),
      },
      {
        path: "action-center",
        name: "action-center",
        lazy: async () => ({
          Component: (await import("./pages/action-center")).default,
        }),
      },
    ],
  },
  { path: "*", name: "404", element: <NotFound /> },
];
declare global {
  interface Window {
    __routers__: typeof routers;
  }
}
window.__routers__ = routers;
