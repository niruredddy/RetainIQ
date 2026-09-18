import { MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { routers } from "./router";

const queryClient = new QueryClient();

const router = createBrowserRouter(routers);

const App = () => {

  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <MotionConfig reducedMotion="user">
              <RouterProvider router={router} />
            </MotionConfig>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
