import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { SplashScreen } from "./components/splash-screen";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routers } from "./router";

const App = () => {
  const router = createBrowserRouter(routers);
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} attribute="class">
      <TooltipProvider>
        <RouterProvider router={router} />
        <AnimatePresence>
          {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        </AnimatePresence>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
