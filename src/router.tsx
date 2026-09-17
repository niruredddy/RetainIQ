import AppShell from "./components/app-shell";
import Dashboard from "./pages/dashboard";
import RiskRadar from "./pages/risk-radar";
import DeepDive from "./pages/deep-dive";
import MobilityMatcher from "./pages/mobility-matcher";
import ActionCenter from "./pages/action-center";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        name: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "risk-radar",
        name: "risk-radar",
        element: <RiskRadar />,
      },
      {
        path: "deep-dive",
        name: "deep-dive",
        element: <DeepDive />,
      },
      {
        path: "mobility-matcher",
        name: "mobility-matcher",
        element: <MobilityMatcher />,
      },
      {
        path: "action-center",
        name: "action-center",
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

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
