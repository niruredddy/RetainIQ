<<<<<<< HEAD
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { SplashScreen } from "./components/splash-screen";
=======
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

>>>>>>> origin/enter-main
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { routers } from "./router";

const queryClient = new QueryClient();

<<<<<<< HEAD
const App = () => {
  const router = createBrowserRouter(routers);
  const [splashDone, setSplashDone] = useState(false);
=======
const router = createBrowserRouter(routers);

const App = () => {
>>>>>>> origin/enter-main

  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <RouterProvider router={router} />
<<<<<<< HEAD
            <AnimatePresence>
              {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
            </AnimatePresence>
=======
>>>>>>> origin/enter-main
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
